"use server";

import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase/server";
import { resend } from "@/lib/resend";
import {
  emailLayout,
  emailHeading,
  emailParagraph,
  emailHighlight,
  emailNote,
} from "@/lib/email-layout";
import { revalidatePath } from "next/cache";

async function ensureAdmin() {
  const session = await auth();
  const userId = session?.user?.id as string | undefined;

  if (!userId) {
    throw new Error("Необходима авторизация.");
  }

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (!profile || profile.role !== "admin") {
    throw new Error("Недостаточно прав.");
  }
}

export async function adminApprovePayout(formData: FormData) {
  await ensureAdmin();

  const id = String(formData.get("request_id") || "").trim();
  if (!id) return;

  const { data: request } = await supabaseAdmin
    .from("payout_requests")
    .select("id, model_id, amount")
    .eq("id", id)
    .maybeSingle();

  if (!request) return;

  await supabaseAdmin
    .from("payout_requests")
    .update({
      status: "paid",
      admin_comment: null,
    })
    .eq("id", id);

  const { data: model } = await supabaseAdmin
    .from("models")
    .select("profile_id")
    .eq("id", request.model_id)
    .maybeSingle();
  const { data: profile } = model
    ? await supabaseAdmin
        .from("profiles")
        .select("email")
        .eq("id", model.profile_id)
        .maybeSingle()
    : { data: null };
  const to = profile?.email;
  if (to && resend) {
    const amount = Number(request.amount) || 0;
    const amountStr = amount.toLocaleString("ru-RU", { minimumFractionDigits: 2 }) + " ₽";
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "Sigma Models <official@sigma-model.com>",
        to: [to],
        subject: "Sigma Models — выплата выполнена",
        html: emailLayout(
          emailHeading("Выплата выполнена") +
          emailParagraph("Ваш запрос на вывод средств успешно обработан.") +
          emailHighlight(amountStr) +
          emailParagraph("Деньги переведены согласно указанным реквизитам. Если в течение 2–3 рабочих дней средства не поступили — свяжитесь с агентством.") +
          emailNote("Это уведомление сформировано автоматически после подтверждения выплаты администратором."),
        ),
      });
    } catch (e) {
      console.warn("[Sigma Models] Payout approval email failed:", e);
    }
  }

  revalidatePath("/dashboard");
}

export async function adminRejectPayout(formData: FormData) {
  await ensureAdmin();

  const id = String(formData.get("request_id") || "").trim();
  const reason = String(formData.get("reason") || "").trim() || null;

  if (!id) return;

  const { data: request } = await supabaseAdmin
    .from("payout_requests")
    .select("id, model_id, amount, status")
    .eq("id", id)
    .maybeSingle();

  if (!request) return;

  // Возвращаем деньги на баланс только если заявка была в статусе pending.
  if (request.status === "pending") {
    const amount = Number(request.amount) || 0;
    if (amount) {
      await supabaseAdmin.from("transactions").insert({
        model_id: request.model_id,
        kind: "credit",
        amount,
        description: "Возврат средств после отклонения заявки на вывод",
      });

      await supabaseAdmin.rpc("adjust_model_balance", {
        p_model_id: request.model_id,
        p_delta: amount,
      });
    }
  }

  await supabaseAdmin
    .from("payout_requests")
    .update({
      status: "rejected",
      admin_comment: reason,
    })
    .eq("id", id);

  const { data: model } = await supabaseAdmin
    .from("models")
    .select("profile_id")
    .eq("id", request.model_id)
    .maybeSingle();
  const { data: profile } = model
    ? await supabaseAdmin
        .from("profiles")
        .select("email")
        .eq("id", model.profile_id)
        .maybeSingle()
    : { data: null };
  const to = profile?.email;
  if (to && resend) {
    const amount = Number(request.amount) || 0;
    const amountStr = amount.toLocaleString("ru-RU", { minimumFractionDigits: 2 }) + " ₽";
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "Sigma Models <official@sigma-model.com>",
        to: [to],
        subject: "Sigma Models — заявка на вывод отклонена",
        html: emailLayout(
          emailHeading("Заявка на вывод отклонена") +
          emailParagraph("К сожалению, ваш запрос на вывод средств не был одобрен.") +
          emailHighlight(amountStr) +
          (reason
            ? emailNote(`Причина: ${reason.replace(/</g, "&lt;")}`, "warning")
            : "") +
          emailParagraph("Сумма возвращена на баланс в вашем личном кабинете — вы можете подать новую заявку."),
        ),
      });
    } catch (e) {
      console.warn("[Sigma Models] Payout rejection email failed:", e);
    }
  }

  revalidatePath("/dashboard");
}

