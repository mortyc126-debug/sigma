import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import { CursorSpotlight } from "@/components/cursor-spotlight";

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
    default: "Sigma Models — премиальное модельное агентство",
    template: "%s | Sigma Models",
  },
  description:
    "Sigma Models — закрытый пул, строгий кастинг, карьерное кураторство. Головной офис в Москве, филиалы в шести городах России.",
  keywords: ["модельное агентство", "Sigma Models", "модели Москва", "премиальный кастинг", "fashion agency Russia"],
  verification: {
    google: "6TKAIHhK2ybvZu_jhBljqn8bfeYjZpqqiMIbmmabI4k",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Sigma Models",
    title: "Sigma Models — закрытый пул. Строгий кастинг.",
    description:
      "Премиальное модельное агентство с головным офисом в Москве. Закрытый пул, кураторство карьеры, работа с федеральными и международными брендами.",
    url: "https://sigma-model.com",
    images: [
      {
        url: "/models/hero-1-new.jpg",
        width: 1200,
        height: 630,
        alt: "Sigma Models — премиальное модельное агентство",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sigma Models — закрытый пул. Строгий кастинг.",
    description: "Премиальное модельное агентство России.",
    images: ["/models/hero-1-new.jpg"],
  },
  icons: {
    icon: "/icon",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark" suppressHydrationWarning>
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
