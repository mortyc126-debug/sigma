import type { Metadata } from "next";
import { BranchesContent } from "@/components/site/branches-content";
import { BreadcrumbJsonLd, LocalBusinessJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Филиалы модельного агентства — Москва, СПб, Казань, Екатеринбург, Новосибирск, Сочи",
  description:
    "Филиалы Sigma Models в 6 городах России: Москва, Санкт-Петербург, Казань, Екатеринбург, Новосибирск и Сочи. Единые стандарты работы, кастинги и кураторство в каждом городе.",
  alternates: {
    canonical: "https://sigma-model.com/branches",
  },
  openGraph: {
    title: "Филиалы Sigma Models — 6 городов России",
    description: "Москва, Санкт-Петербург, Казань, Екатеринбург, Новосибирск и Сочи. Единые стандарты работы.",
    url: "https://sigma-model.com/branches",
    images: [{ url: "/models/hero-3-new.jpg", width: 1200, height: 630, alt: "Филиалы модельного агентства Sigma Models" }],
  },
};

const CITIES = ["Москва", "Санкт-Петербург", "Казань", "Екатеринбург", "Новосибирск", "Сочи"];

export default function BranchesPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", url: "https://sigma-model.com" },
          { name: "Филиалы", url: "https://sigma-model.com/branches" },
        ]}
      />
      {CITIES.map((city) => (
        <LocalBusinessJsonLd key={city} name="Sigma Models" city={city} />
      ))}
      <BranchesContent />
    </>
  );
}
