import type { Metadata } from "next";
import { ContactsContent } from "@/components/site/contacts-content";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Контакты модельного агентства Sigma Models — Москва",
  description:
    "Свяжитесь с Sigma Models: головной офис в Москве. Кастинг моделей, коммерческие запросы, сотрудничество с брендами. Ответим в течение 24 часов.",
  alternates: {
    canonical: "https://sigma-model.com/contacts",
  },
  openGraph: {
    title: "Контакты Sigma Models",
    description: "Головной офис в Москве. Кастинг, коммерческие запросы и сотрудничество с брендами.",
    url: "https://sigma-model.com/contacts",
    images: [{ url: "/models/hero-1-new.jpg", width: 1200, height: 630, alt: "Контакты Sigma Models" }],
  },
};

export default function ContactsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", url: "https://sigma-model.com" },
          { name: "Контакты", url: "https://sigma-model.com/contacts" },
        ]}
      />
      <ContactsContent />
    </>
  );
}
