import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
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

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sigma-models.ru"),
  title: {
    default: "Sigma Models — модельное агентство",
    template: "%s | Sigma Models",
  },
  description:
    "Премиальное модельное агентство Sigma Models. Москва и филиалы по всей России. Профессиональные модели и кастинги уровня 2026 года.",
  keywords: ["модельное агентство", "Sigma Models", "модели", "кастинг", "Москва", "премиум"],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Sigma Models",
    title: "Sigma Models — модельное агентство",
    description:
      "Премиальное модельное агентство с головным офисом в Москве и сетью филиалов по всей России.",
    url: "https://sigma-models.ru",
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
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
        suppressHydrationWarning
      >
        <div suppressHydrationWarning>
          {/* Глобальный видео-фон для всего сайта */}
          <video
            className="pointer-events-none fixed inset-0 -z-20 h-full w-full object-cover"
            src="/videos/runway.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          {/* Градиентное затемнение поверх видео — усилено для читаемости */}
          <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-black/75 via-black/60 to-black/75" />
          {/* Лёгкая текстура «зерно» */}
          <div className="grain-overlay" aria-hidden />
          {/* Основной контент приложения */}
          <div className="relative z-0">
            {children}
          </div>
          {/* Круг-софит, следующий за курсором */}
          <CursorSpotlight />
        </div>
      </body>
    </html>
  );
}
