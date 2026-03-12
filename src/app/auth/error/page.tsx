import Link from "next/link";

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const resolved = await searchParams;
  const code = resolved?.error;

  const message =
    code === "Verification"
      ? "Ссылка для входа недействительна или уже была использована. Запросите новую ссылку на странице входа."
      : "Произошла ошибка при авторизации. Попробуйте ещё раз или запросите новую ссылку для входа.";

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md space-y-4 text-sm">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
            Ошибка авторизации
          </p>
          <h1 className="mt-2 text-xl font-semibold tracking-tight">
            Не удалось подтвердить вход
          </h1>
        </div>
        <p className="text-xs text-muted-foreground">{message}</p>
        <Link
          href="/login"
          className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground transition hover:bg-primary/90"
        >
          Вернуться к входу
        </Link>
      </div>
    </main>
  );
}

