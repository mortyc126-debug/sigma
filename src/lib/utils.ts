import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Форматирует сумму к отображению: "15000" или "15 000 ₽" → "15 000 ₽" */
export function formatFee(fee: string | null | undefined): string {
  if (!fee?.trim()) return "";
  const cleaned = fee.replace(/\s/g, "").replace(/[₽рубa-zA-Z]/gi, "");
  const num = parseFloat(cleaned);
  if (Number.isNaN(num)) return fee.trim();
  return num.toLocaleString("ru-RU", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + " ₽";
}

/** Парсит строку гонорара в число для зачисления на баланс */
export function parseFeeToNumber(fee: string | null | undefined): number {
  if (!fee?.trim()) return 0;
  const cleaned = fee.replace(/\s/g, "").replace(/[₽рубa-zA-Z]/gi, "");
  const num = parseFloat(cleaned);
  return Number.isNaN(num) ? 0 : num;
}
