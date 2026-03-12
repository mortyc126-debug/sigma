/**
 * Общий HTML-шаблон для писем Sigma Models.
 * Использует inline-стили для максимальной совместимости с почтовыми клиентами.
 */
export function emailLayout(content: string, footer?: string): string {
  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sigma Models</title>
</head>
<body style="margin:0;padding:0;background-color:#050509;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#050509;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

          <!-- Шапка -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <div style="font-size:30px;letter-spacing:0.38em;color:#f7d26a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">Σ</div>
              <div style="margin-top:8px;font-size:11px;letter-spacing:0.32em;text-transform:uppercase;color:#b3a58a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">SIGMA MODELS</div>
            </td>
          </tr>

          <!-- Разделитель -->
          <tr>
            <td style="padding-bottom:28px;">
              <div style="border-top:1px solid #1e1b14;"></div>
            </td>
          </tr>

          <!-- Контент -->
          <tr>
            <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#f7f4ea;">
              ${content}
            </td>
          </tr>

          <!-- Разделитель -->
          <tr>
            <td style="padding-top:32px;padding-bottom:20px;">
              <div style="border-top:1px solid #1e1b14;"></div>
            </td>
          </tr>

          <!-- Подвал -->
          <tr>
            <td align="center" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:11px;line-height:1.6;color:#4a4538;">
              ${footer ?? "© Sigma Models &nbsp;·&nbsp; Это автоматическое письмо, отвечать на него не нужно."}
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Строка с крупным статус-заголовком письма */
export function emailHeading(text: string): string {
  return `<p style="margin:0 0 20px 0;font-size:20px;font-weight:600;line-height:1.3;color:#f7f4ea;">${text}</p>`;
}

/** Обычный параграф */
export function emailParagraph(text: string): string {
  return `<p style="margin:0 0 14px 0;font-size:14px;line-height:1.7;color:#d0c6b0;">${text}</p>`;
}

/** Выделенный блок (например, сумма или важное значение) */
export function emailHighlight(text: string): string {
  return `<div style="margin:20px 0;padding:16px 20px;background:#0d0c0f;border:1px solid #2a2519;border-radius:8px;font-size:22px;font-weight:700;letter-spacing:0.04em;color:#f7d26a;text-align:center;">${text}</div>`;
}

/** Кнопка-ссылка */
export function emailButton(label: string, url: string): string {
  return `<div style="text-align:center;margin:28px 0;">
    <a href="${url}" style="display:inline-block;padding:13px 28px;background:#f7d26a;color:#111016;text-decoration:none;border-radius:999px;font-size:13px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">${label}</a>
  </div>`;
}

/** Таблица с данными (ключ — значение) */
export function emailTable(rows: { label: string; value: string }[]): string {
  const rowsHtml = rows
    .map(
      (r) => `<tr>
        <td style="padding:7px 12px 7px 0;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#7f7467;white-space:nowrap;vertical-align:top;">${r.label}</td>
        <td style="padding:7px 0;font-size:14px;color:#f7f4ea;vertical-align:top;">${r.value}</td>
      </tr>`,
    )
    .join("");

  return `<table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin:0 0 20px 0;">
    <tbody>${rowsHtml}</tbody>
  </table>`;
}

/** Плашка с замечанием / предупреждением */
export function emailNote(text: string, type: "info" | "warning" = "info"): string {
  const borderColor = type === "warning" ? "#7f3b2a" : "#2a2519";
  const textColor = type === "warning" ? "#e8a080" : "#918777";
  return `<div style="margin:20px 0 0 0;padding:14px 16px;border:1px solid ${borderColor};border-radius:6px;font-size:12px;line-height:1.6;color:${textColor};">${text}</div>`;
}
