import Link from "next/link";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-black/50 px-4 py-10 md:px-10 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/25 text-xs font-semibold tracking-[0.18em] text-amber-200/90">
              Σ
            </span>
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground">
              Sigma Models
            </span>
          </div>
          <nav className="flex flex-wrap gap-6 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <Link href="/about" className="transition-colors hover:text-foreground hover:text-amber-100/90">
              О нас
            </Link>
            <Link href="/branches" className="transition-colors hover:text-foreground hover:text-amber-100/90">
              Филиалы
            </Link>
            <Link href="/contacts" className="transition-colors hover:text-foreground hover:text-amber-100/90">
              Контакты
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-foreground hover:text-amber-100/90">
              Конфиденциальность
            </Link>
            <Link href="/terms" className="transition-colors hover:text-foreground hover:text-amber-100/90">
              Условия использования
            </Link>
            <Link href="/login" className="transition-colors hover:text-foreground hover:text-amber-100/90">
              Войти
            </Link>
          </nav>
        </div>
        <p className="mt-8 border-t border-white/10 pt-6 text-xs text-muted-foreground">
          © {currentYear} Sigma Models. Все права защищены.
        </p>
      </div>
    </footer>
  );
}
