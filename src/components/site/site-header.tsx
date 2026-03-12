"use client";

import { useState } from "react";
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

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-10 lg:px-20">
        <Link href="/" className="flex items-baseline gap-3">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/25 text-xs font-semibold tracking-[0.18em] text-amber-200/90">
            Σ
          </span>
          <span className="text-sm font-semibold uppercase tracking-[0.32em] text-foreground">
            Sigma Models
          </span>
          <span className="hidden text-xs uppercase tracking-[0.26em] text-muted-foreground md:inline">
            Management · Moscow · Worldwide
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-xs uppercase tracking-[0.2em] text-muted-foreground md:flex">
          <Link href="/about" className="transition-colors duration-200 hover:text-foreground hover:text-amber-100/90">
            О нас
          </Link>
          <Link href="/branches" className="transition-colors duration-200 hover:text-foreground hover:text-amber-100/90">
            Филиалы
          </Link>
          <Link href="/contacts" className="transition-colors duration-200 hover:text-foreground hover:text-amber-100/90">
            Контакты
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center rounded-full border border-white/25 bg-white/5 px-3 py-1 text-xs font-medium tracking-[0.18em] text-foreground transition hover:border-amber-300/80 hover:bg-white/10"
          >
            Войти
          </Link>
        </nav>

        {/* Mobile: burger + sheet */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/5 text-foreground transition hover:bg-white/10 md:hidden"
              aria-label="Открыть меню"
            >
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[min(85vw,320px)] border-white/10 bg-black/95 backdrop-blur-xl"
          >
            <SheetHeader>
              <SheetTitle className="text-left text-xs uppercase tracking-[0.28em] text-amber-200/90">
                Меню
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-6 flex flex-col gap-1">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
