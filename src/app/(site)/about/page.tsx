import type { Metadata } from "next";
import { AboutContent } from "@/components/site/about-content";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "О нас — модельное агентство Sigma Models в Москве",
  description:
    "Sigma Models — премиальное модельное агентство с 10-летним опытом. Строгий отбор, персональное кураторство карьеры, прозрачные финансы. Более 500 кампаний и 200+ моделей.",
  alternates: {
    canonical: "https://sigma-model.com/about",
  },
  openGraph: {
    title: "О нас — Sigma Models",
    description: "Строгий отбор, долгосрочные карьеры, прозрачные условия. 10+ лет на рынке, 500+ кампаний.",
    url: "https://sigma-model.com/about",
    images: [{ url: "/models/hero-2-new.jpg", width: 1200, height: 630, alt: "О модельном агентстве Sigma Models" }],
  },
};

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", url: "https://sigma-model.com" },
          { name: "О нас", url: "https://sigma-model.com/about" },
        ]}
      />
      <AboutContent />
    </>
  );
}
