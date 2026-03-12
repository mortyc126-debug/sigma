"use server";

import { resend } from "@/lib/resend";

const TARGET_EMAIL = "sigma-models@mail.ru";

export async function applyAsModel(formData: FormData) {
  const fullName = String(formData.get("fullName") || "").trim();
  const age = String(formData.get("age") || "").trim();
  const height = String(formData.get("height") || "").trim();
  const parameters = String(formData.get("parameters") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const photos = String(formData.get("photos") || "").trim();

  if (!fullName || !age || !height || !parameters || !city || !email || !photos) {
    return {
      status: "error" as const,
      message: "Пожалуйста, заполните все поля формы.",
    };
  }

  if (!resend) {
    return {
      status: "error" as const,
      message:
        "Сервис временно недоступен. Попробуйте отправить анкету чуть позже.",
    };
  }

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "Sigma Models <no-reply@sigma-model.com>",
    to: TARGET_EMAIL,
    subject: `Новая анкета модели — ${fullName}`,
    html: `
      <div style="background-color:#050509;padding:24px 20px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;color:#f7f4ea;">
        <div style="max-width:520px;margin:0 auto;">
          <div style="text-align:center;margin-bottom:20px;">
            <div style="font-size:26px;letter-spacing:0.32em;text-transform:uppercase;color:#f7d26a;">Σ</div>
            <div style="font-size:12px;letter-spacing:0.26em;text-transform:uppercase;color:#b3a58a;margin-top:6px;">
              SIGMA MODELS — APPLICATION
            </div>
          </div>
          <p style="font-size:14px;line-height:1.6;margin:0 0 16px 0;">
            Поступила новая анкета модели с сайта Sigma Models.
          </p>
          <table style="width:100%;border-collapse:collapse;font-size:13px;line-height:1.6;margin-bottom:18px;">
            <tbody>
              <tr>
                <td style="padding:4px 0;color:#918777;width:110px;">Имя</td>
                <td style="padding:4px 0;color:#f7f4ea;">${fullName}</td>
              </tr>
              <tr>
                <td style="padding:4px 0;color:#918777;">Возраст</td>
                <td style="padding:4px 0;color:#f7f4ea;">${age}</td>
              </tr>
              <tr>
                <td style="padding:4px 0;color:#918777;">Рост</td>
                <td style="padding:4px 0;color:#f7f4ea;">${height} см</td>
              </tr>
              <tr>
                <td style="padding:4px 0;color:#918777;">Параметры</td>
                <td style="padding:4px 0;color:#f7f4ea;">${parameters}</td>
              </tr>
              <tr>
                <td style="padding:4px 0;color:#918777;">Город</td>
                <td style="padding:4px 0;color:#f7f4ea;">${city}</td>
              </tr>
              <tr>
                <td style="padding:4px 0;color:#918777;">Email</td>
                <td style="padding:4px 0;color:#f7f4ea;">${email}</td>
              </tr>
            </tbody>
          </table>
          <div style="margin-bottom:18px;">
            <p style="margin:0 0 6px 0;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#918777;">
              Ссылки на фото
            </p>
            <p style="white-space:pre-wrap;font-size:13px;line-height:1.6;color:#f7f4ea;">
              ${photos}
            </p>
          </div>
          <p style="font-size:11px;line-height:1.6;color:#7f7467;margin:0;">
            Рекомендуется перенести данные в CRM агентства и связаться с моделью,
            если типаж подходит под текущие запросы клиентов.
          </p>
        </div>
      </div>
    `,
  });

  return { status: "success" as const };
}

