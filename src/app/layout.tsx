import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import { CursorSpotlight } from "@/components/cursor-spotlight";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/json-ld";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const barlow = Barlow_Condensed({
  variable: "--font-condensed",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sigma-model.com"),
  title: {
    default: "Sigma Models — премиальное модельное агентство в Москве | Кастинг моделей",
    template: "%s | Sigma Models",
  },
  description:
    "Sigma Models — премиальное модельное агентство в Москве. Закрытый пул моделей, строгий кастинг, персональное кураторство карьеры. Филиалы в 6 городах России. Работаем с Zara, L'Oréal, Sberbank.",
  keywords: [
    "модельное агентство",
    "модельное агентство Москва",
    "Sigma Models",
    "кастинг моделей",
    "стать моделью",
    "модели Москва",
    "модельное агентство Россия",
    "премиальный кастинг",
    "fashion agency Russia",
    "модельное агентство Санкт-Петербург",
    "модельное агентство Казань",
    "кастинг для съёмок",
    "работа моделью",
    "модельный бизнес",
    "beauty съёмки",
    "коммерческая съёмка моделей",
  ],
  verification: {
    google: "6TKAIHhK2ybvZu_jhBljqn8bfeYjZpqqiMIbmmabI4k",
  },
  alternates: {
    canonical: "https://sigma-model.com",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Sigma Models",
    title: "Sigma Models — премиальное модельное агентство в Москве",
    description:
      "Закрытый пул моделей, строгий кастинг, персональное кураторство карьеры. Работаем с федеральными и международными брендами. Филиалы в 6 городах.",
    url: "https://sigma-model.com",
    images: [
      {
        url: "/models/hero-1-new.jpg",
        width: 1200,
        height: 630,
        alt: "Sigma Models — премиальное модельное агентство в Москве",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sigma Models — премиальное модельное агентство",
    description: "Закрытый пул, строгий кастинг, кураторство карьеры. Москва и 6 городов России.",
    images: ["/models/hero-1-new.jpg"],
  },
  icons: {
    icon: "/icon",
  },
  other: {
    "theme-color": "#000000",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://ooozuuppbggjwhijbwsr.supabase.co" />
        <link rel="dns-prefetch" href="https://ooozuuppbggjwhijbwsr.supabase.co" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <OrganizationJsonLd />
        <WebSiteJsonLd />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${barlow.variable} antialiased`}
        suppressHydrationWarning
      >
        <div suppressHydrationWarning>
          {/* Глобальный видео-фон */}
          <video
            className="pointer-events-none fixed inset-0 -z-20 h-full w-full object-cover"
            src="/videos/runway.mp4"
            poster="/models/hero-1-new.jpg"
            autoPlay
            loop
            muted
            playsInline
          />
          {/* Затемнение поверх видео */}
          <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-black/80 via-black/65 to-black/80" />
          {/* Зернистость */}
          <div className="grain-overlay" aria-hidden />
          {/* Основной контент */}
          <div className="relative z-0">
            {children}
          </div>
          {/* Курсор-гало */}
          <CursorSpotlight />
        </div>
      </body>
    </html>
  );
}
