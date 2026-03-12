"use server";

import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase/server";
import { resend } from "@/lib/resend";
import { revalidatePath } from "next/cache";

async function getCurrentModel() {
  const session = await auth();
  const userId = session?.user?.id as string | undefined;

  if (!userId) {
    throw new Error("Необходима авторизация модели.");
  }

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("id, email, full_name")
    .eq("id", userId)
    .maybeSingle();

  if (!profile) {
    throw new Error("Профиль модели не найден.");
  }

  const { data: model } = await supabaseAdmin
    .from("models")
    .select("id")
    .eq("profile_id", profile.id)
    .maybeSingle();

  if (!model) {
    throw new Error("Анкета модели не найдена.");
  }

  return { profile, model };
}

export async function requestPayout(formData: FormData) {
  const { profile, model } = await getCurrentModel();

  const bank = String(formData.get("bank") || "").trim();
  const destination = String(formData.get("destination") || "").trim();
  const amountStr = String(formData.get("amount") || "").trim();
  const comment = String(formData.get("comment") || "").trim();

  const amount = Number(amountStr.replace(",", "."));

  if (!bank || !destination || !amount || amount <= 0) {
    throw new Error("Заполните банк, реквизиты и сумму.");
  }

  // Проверяем текущий баланс и не даём уйти в минус.
  const { data: balance } = await supabaseAdmin
    .from("balances")
    .select("amount")
    .eq("model_id", model.id)
    .maybeSingle();

  const currentAmount =
    typeof balance?.amount === "number" ? balance.amount : 0;

  if (amount > currentAmount) {
    console.warn(
      `Запрос на вывод отклонён: сумма ${amount} превышает баланс ${currentAmount}`,
    );
    // Мягко выходим без создания заявки и без падения страницы.
    return;
  }

  // Создаём запись заявки и получаем id для связи с транзакцией.
  const { data: payoutRequest } = await supabaseAdmin
    .from("payout_requests")
    .insert({
      model_id: model.id,
      bank,
      destination,
      amount,
      comment: comment || null,
      status: "pending",
    })
    .select("id")
    .single();

  // Фиксируем транзакцию "запрос вывода" и уменьшаем баланс.
  const txPayload: Record<string, unknown> = {
    model_id: model.id,
    kind: "withdrawal",
    amount,
    description:
      "Запрос на вывод средств (в ожидании подтверждения агентства)",
  };
  if (payoutRequest?.id != null) {
    txPayload.payout_request_id = payoutRequest.id;
  }
  let txError = (
    await supabaseAdmin
      .from("transactions")
      .insert(txPayload as Record<string, string | number | null>)
  ).error;
  if (txError && payoutRequest?.id != null) {
    await supabaseAdmin.from("transactions").insert({
      model_id: model.id,
      kind: "withdrawal",
      amount,
      description:
        "Запрос на вывод средств (в ожидании подтверждения агентства)",
    });
  }

  await supabaseAdmin.rpc("adjust_model_balance", {
    p_model_id: model.id,
    p_delta: -amount,
  });

  if (resend) {
    await resend.emails.send({
      from:
        process.env.RESEND_FROM_EMAIL || "Sigma Models <no-reply@example.com>",
      to: "sigma-models@mail.ru",
      subject: `Запрос на вывод средств — ${profile.full_name ?? profile.email}`,
      text: [
        `Модель: ${profile.full_name ?? "без имени"} (${profile.email})`,
        `Сумма к выводу: ${amount.toFixed(2)} RUB`,
        `Банк / способ: ${bank}`,
        `Реквизиты: ${destination}`,
        comment ? `Комментарий модели: ${comment}` : "",
      ].filter(Boolean).join("\n"),
    });
  }

  revalidatePath("/dashboard");
}

