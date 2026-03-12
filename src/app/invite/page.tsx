import Link from "next/link";

export default async function InvitePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const resolved = await searchParams;
  const token = resolved?.token;

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md space-y-4 text-sm">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
            Приглашение в Sigma Models
          </p>
          <h1 className="mt-2 text-xl font-semibold tracking-tight">
            Доступ к личному кабинету
          </h1>
        </div>
        <p className="text-xs text-muted-foreground">
          Вы получили закрытое приглашение в систему агентства Sigma Models.
          Для продолжения перейдите к авторизации.
        </p>

        {token ? (
          <Link
            href={`/login?token=${encodeURIComponent(token)}`}
            className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            Войти по приглашению
          </Link>
        ) : (
          <p className="text-xs text-destructive">
            Неверная или отсутствующая ссылка приглашения. Уточните актуальную
            ссылку у куратора агентства.
          </p>
        )}
      </div>
    </main>
  );
}

