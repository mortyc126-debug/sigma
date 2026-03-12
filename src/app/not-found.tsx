import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
        Ошибка 404
      </p>
      <h1 className="mt-2 text-2xl font-medium tracking-tight md:text-3xl">
        Страница не найдена
      </h1>
      <p className="mt-3 max-w-sm text-center text-sm text-muted-foreground">
        Запрашиваемая страница не существует или была перемещена.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-lg border border-white/20 bg-white/5 px-6 py-2 text-sm font-medium tracking-wide text-foreground transition hover:bg-white/10"
      >
        На главную
      </Link>
    </div>
  );
}
