import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  // В продакшене лучше логировать в централизованный сервис.
  console.warn(
    "[Sigma Models] RESEND_API_KEY не задан, отправка писем будет отключена.",
  );
}

export const resend = apiKey ? new Resend(apiKey) : null;

