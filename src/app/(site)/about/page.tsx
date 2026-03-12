import type { Metadata } from "next";
import Link from "next/link";
import { AboutContent } from "@/components/site/about-content";

export const metadata: Metadata = {
  title: "О нас",
  description:
    "Sigma Models — агентство не для всех. Строгий отбор, долгосрочные карьеры, прозрачные условия. Головной офис в Москве.",
};

export default function AboutPage() {
  return <AboutContent />;
}
