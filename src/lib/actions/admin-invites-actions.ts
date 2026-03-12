"use server";

import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase/server";
import { resend } from "@/lib/resend";
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

export async function adminCreateInvite(formData: FormData) {
  await ensureAdmin();

  const email = String(formData.get("email") || "").trim() || null;
  const role = (String(formData.get("role") || "").trim() ||
    "model") as "model" | "admin";
  const expiresInDays = Number(formData.get("expires_in_days") || 7);

  const token = crypto.randomUUID().replace(/-/g, "");

  const expires_at =
    Number.isFinite(expiresInDays) && expiresInDays > 0
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString()
      : null;

  const { error } = await supabaseAdmin.from("invite_codes").insert({
    token,
    email,
    role,
    expires_at,
  });

  if (error) {
    throw new Error("Не удалось сохранить приглашение.");
  }

  // Если email указан и Resend настроен — сразу отправляем инвайт по почте.
  if (email && resend) {
    const baseUrl =
      process.env.NEXTAUTH_URL ?? "https://sigma-model.com";
    const inviteUrl = `${baseUrl}/invite?token=${token}`;
    const from =
      process.env.RESEND_FROM_EMAIL || "Sigma Models <official@sigma-model.com>";

    await resend.emails.send({
      from,
      to: email,
      subject: "Sigma Models — приглашение в закрытый кабинет",
      html: `
        <div style="background-color:#050509;padding:32px 24px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;color:#f7f4ea;">
          <div style="max-width:480px;margin:0 auto;">
            <div style="text-align:center;margin-bottom:24px;">
              <div style="font-size:28px;letter-spacing:0.35em;text-transform:uppercase;color:#f7d26a;">Σ</div>
              <div style="font-size:13px;letter-spacing:0.28em;text-transform:uppercase;color:#b3a58a;margin-top:8px;">
                SIGMA MODELS
              </div>
            </div>
            <p style="font-size:14px;line-height:1.6;margin:0 0 16px 0;">
              Вы получили закрытое приглашение в личный кабинет агентства Sigma Models.
            </p>
            <p style="font-size:13px;line-height:1.6;margin:0 0 20px 0;color:#d0c6b0;">
              Доступ предоставляется только по персональной ссылке и может быть ограничен по времени.
            </p>
            <div style="text-align:center;margin:28px 0;">
              <a href="${inviteUrl}" style="display:inline-block;padding:12px 24px;background:#f7d26a;color:#111016;text-decoration:none;border-radius:999px;font-size:13px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;">
                Перейти по приглашению
              </a>
            </div>
            <p style="font-size:11px;line-height:1.6;color:#918777;margin:0;">
              Если кнопка не работает, скопируйте ссылку и вставьте её в адресную строку браузера:
              <br />
              <span style="word-break:break-all;">${inviteUrl}</span>
            </p>
          </div>
        </div>
      `,
    });
  }

  revalidatePath("/dashboard");
}

export async function adminDeleteInvite(formData: FormData) {
  await ensureAdmin();

  const id = String(formData.get("id") || "").trim();
  if (!id) return;

  await supabaseAdmin.from("invite_codes").delete().eq("id", id);

  revalidatePath("/dashboard");
}

