export const PORTFOLIO_CATEGORIES = [
  { value: "polaroid", label: "Тестовые фото" },
  { value: "editorial", label: "Редакционные съёмки" },
  { value: "nude", label: "Ню" },
  { value: "lingerie", label: "Нижнее бельё" },
] as const;

export const POLAROID_SUBCATEGORIES = [
  { value: "front", label: "Анфас" },
  { value: "profile", label: "Профиль" },
  { value: "full_body", label: "В полный рост" },
  { value: "natural_light", label: "Естественный свет" },
] as const;

export const EDITORIAL_SUBCATEGORIES = [
  { value: "magazines", label: "Журналы" },
  { value: "campaigns", label: "Кампании" },
  { value: "runway", label: "Подиум" },
  { value: "lookbooks", label: "Лукбук" },
] as const;

export type PortfolioCategory = (typeof PORTFOLIO_CATEGORIES)[number]["value"];
export type PolaroidSubcategory = (typeof POLAROID_SUBCATEGORIES)[number]["value"];
export type EditorialSubcategory = (typeof EDITORIAL_SUBCATEGORIES)[number]["value"];

export const SUBCATEGORY_LABELS: Record<string, string> = {
  front: "Анфас",
  profile: "Профиль",
  full_body: "В полный рост",
  natural_light: "Естественный свет",
  magazines: "Журналы",
  campaigns: "Кампании",
  runway: "Подиум",
  lookbooks: "Лукбук",
};

export const CATEGORY_LABELS: Record<string, string> = {
  polaroid: "Тестовые фото",
  editorial: "Редакционные съёмки",
  nude: "Ню",
  lingerie: "Нижнее бельё",
};
