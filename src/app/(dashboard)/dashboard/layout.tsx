import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      {/* Dashboard video background */}
      <video
        className="pointer-events-none fixed inset-0 -z-[5] h-full w-full object-cover"
        src="/videos/dashboard-bg.mp4"
        poster="/models/hero-1-new.jpg"
        autoPlay
        loop
        muted
        playsInline
      />
      {/* Stronger overlay for cabinet readability */}
      <div className="pointer-events-none fixed inset-0 -z-[4] bg-gradient-to-b from-black/82 via-black/72 to-black/88" aria-hidden />

      {/* Cabinet top bar */}
      <nav className="sticky top-0 z-30 border-b border-white/8 bg-black/78 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5 md:px-8 lg:px-12">
          <Link href="/" className="group flex items-baseline gap-2.5">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/20 text-[10px] font-semibold tracking-[0.14em] text-amber-200/80 transition-all group-hover:border-amber-400/40 group-hover:shadow-[0_0_8px_rgba(240,201,106,0.18)]">
              Σ
            </span>
            <span className="font-condensed text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground/70">
              Sigma Models
            </span>
          </Link>
          <Link
            href="/"
            className="font-condensed text-[9px] font-medium uppercase tracking-[0.26em] text-muted-foreground/35 transition-colors hover:text-muted-foreground/70"
          >
            ← На сайт
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-8 lg:px-12">
        {children}
      </main>
    </div>
  );
}
