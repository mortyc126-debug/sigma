import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";

export async function GET() {
  if (!resend) {
    return NextResponse.json(
      { ok: false, error: "RESEND_API_KEY отсутствует на сервере" },
      { status: 500 },
    );
  }

  const to = process.env.SIGMA_ADMIN_EMAIL || "official@sigma-model.com";

  try {
    const result = await resend.emails.send({
      from:
        process.env.RESEND_FROM_EMAIL || "Sigma Models <official@sigma-model.com>",
      to,
      subject: "[Sigma Models] Тестовое письмо из /api/test-resend",
      text: "Если ты видишь это письмо, значит Resend настроен и работает.",
    });

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    console.error("[Sigma Models] /api/test-resend error:", error);
    return NextResponse.json(
      { ok: false, error: String(error) },
      { status: 500 },
    );
  }
}

