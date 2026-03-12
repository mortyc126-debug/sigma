"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { href: "/about", label: "О нас" },
  { href: "/branches", label: "Филиалы" },
  { href: "/contacts", label: "Контакты" },
  { href: "/privacy", label: "Конфиденциальность" },
  { href: "/terms", label: "Условия использования" },
  { href: "/login", label: "Войти" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 60);

      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? Math.min(y / docHeight, 1) : 0);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-all duration-500 ${
        scrolled
          ? "border-white/8 bg-black/85 py-0 backdrop-blur-2xl"
          : "border-white/10 bg-black/55 backdrop-blur-xl"
      }`}
    >
      {/* Scroll progress bar */}
      <div
        className="scroll-progress pointer-events-none"
        style={{ width: `${scrollProgress * 100}%` }}
      />

      <div
        className={`mx-auto flex max-w-6xl items-center justify-between px-4 md:px-10 lg:px-20 transition-all duration-500 ${
          scrolled ? "py-2.5" : "py-3.5"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="group flex items-baseline gap-3">
          <span
            className={`inline-flex items-center justify-center rounded-full border font-semibold transition-all duration-300 group-hover:border-amber-300/60 group-hover:shadow-[0_0_12px_rgba(240,201,106,0.2)] ${
              scrolled
                ? "h-5 w-5 border-white/20 text-[10px] tracking-[0.15em] text-amber-200/80"
                : "h-6 w-6 border-white/25 text-xs tracking-[0.18em] text-amber-200/90"
            }`}
          >
            Σ
          </span>
          <span
            className={`font-semibold uppercase transition-all duration-300 ${
              scrolled ? "text-xs tracking-[0.28em]" : "text-sm tracking-[0.32em]"
            } text-foreground`}
          >
            Sigma Models
          </span>
          <span className="hidden text-xs uppercase tracking-[0.22em] text-muted-foreground/60 transition-opacity duration-300 group-hover:text-muted-foreground/80 md:inline">
            Moscow · Worldwide
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 text-[10px] uppercase tracking-[0.22em] text-muted-foreground md:flex">
          {[
            { href: "/about", label: "О нас" },
            { href: "/branches", label: "Филиалы" },
            { href: "/contacts", label: "Контакты" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="relative py-1 transition-colors duration-200 hover:text-amber-100/95 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-amber-300/50 after:transition-all after:duration-300 hover:after:w-full"
            >
              {label}
            </Link>
          ))}

          {/* Divider */}
          <span className="h-3 w-px bg-white/15" />

          <Link
            href="/login"
            className="btn-outline-gold inline-flex items-center rounded-full px-4 py-1.5 text-[10px] font-medium tracking-[0.2em] text-foreground"
          >
            Войти
          </Link>
        </nav>

        {/* Mobile burger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="btn-outline-gold inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground md:hidden"
              aria-label="Открыть меню"
            >
              <Menu className="h-4 w-4" />
            </button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[min(85vw,320px)] border-white/8 bg-black/96 backdrop-blur-2xl"
          >
            <SheetHeader>
              <SheetTitle className="text-left text-[10px] uppercase tracking-[0.3em] text-amber-200/70">
                Навигация
              </SheetTitle>
            </SheetHeader>

            {/* Decorative line */}
            <div className="mt-4 h-px bg-gradient-to-r from-amber-400/30 via-amber-200/10 to-transparent" />

            <nav className="mt-5 flex flex-col gap-0.5">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm uppercase tracking-[0.18em] text-muted-foreground transition-all hover:bg-white/6 hover:text-amber-100/95"
                >
                  <span className="h-px w-3 bg-amber-400/30 transition-all group-hover:w-5 group-hover:bg-amber-400/60" />
                  {label}
                </Link>
              ))}
            </nav>

            <div className="absolute bottom-8 left-6 right-6">
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/40">
                Sigma Models · Moscow · 2026
              </p>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
