import Link from "next/link";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/8 bg-black/70 px-4 pt-14 pb-8 md:px-10 lg:px-20">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(240,201,106,0.04),transparent)]" />

      <div className="relative mx-auto max-w-6xl">
        {/* Top area: brand + nav columns */}
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">

          {/* Brand column */}
          <div className="space-y-5">
            <Link href="/" className="group inline-flex items-baseline gap-3">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-sm font-semibold tracking-[0.16em] text-amber-200/80 transition-all duration-300 group-hover:border-amber-300/50 group-hover:shadow-[0_0_10px_rgba(240,201,106,0.15)]">
                Σ
              </span>
              <span className="text-sm font-semibold uppercase tracking-[0.3em] text-foreground">
                Sigma Models
              </span>
            </Link>
            <p className="max-w-[22ch] text-xs leading-relaxed text-muted-foreground/50">
              Премиальное модельное агентство России. Москва и шесть городов.
            </p>

            {/* Decorative line */}
            <div className="h-px w-12 bg-gradient-to-r from-amber-400/40 to-transparent" />

            <p className="text-[10px] uppercase tracking-[0.26em] text-muted-foreground/35">
              Moscow · Worldwide
            </p>
          </div>

          {/* Agency column */}
          <div className="space-y-4">
            <p className="text-[9px] uppercase tracking-[0.36em] text-amber-300/50">
              Агентство
            </p>
            <nav className="flex flex-col gap-2.5">
              {[
                { href: "/about", label: "О нас" },
                { href: "/branches", label: "Филиалы" },
                { href: "/contacts", label: "Контакты" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="group flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground/55 transition-colors hover:text-amber-100/80"
                >
                  <span className="h-px w-0 bg-amber-400/40 transition-all duration-300 group-hover:w-3" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal column */}
          <div className="space-y-4">
            <p className="text-[9px] uppercase tracking-[0.36em] text-amber-300/50">
              Правовое
            </p>
            <nav className="flex flex-col gap-2.5">
              {[
                { href: "/privacy", label: "Конфиденциальность" },
                { href: "/terms", label: "Условия использования" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="group flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground/55 transition-colors hover:text-amber-100/80"
                >
                  <span className="h-px w-0 bg-amber-400/40 transition-all duration-300 group-hover:w-3" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Access column */}
          <div className="space-y-4">
            <p className="text-[9px] uppercase tracking-[0.36em] text-amber-300/50">
              Доступ
            </p>
            <nav className="flex flex-col gap-2.5">
              {[
                { href: "/login", label: "Войти в кабинет" },
                { href: "/invite", label: "Код приглашения" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="group flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground/55 transition-colors hover:text-amber-100/80"
                >
                  <span className="h-px w-0 bg-amber-400/40 transition-all duration-300 group-hover:w-3" />
                  {label}
                </Link>
              ))}
            </nav>

            {/* CTA */}
            <div className="pt-2">
              <Link
                href="/invite"
                className="btn-outline-gold inline-flex items-center gap-2 rounded-full px-4 py-2 text-[9px] uppercase tracking-[0.24em] text-muted-foreground/70"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400/60" />
                Войти
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-3 border-t border-white/6 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/30">
            © {currentYear} Sigma Models. Все права защищены.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[9px] uppercase tracking-[0.24em] text-muted-foreground/20">
              Premium · Closed Pool · Russia
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
