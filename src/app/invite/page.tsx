import { supabaseAdmin } from "@/lib/supabase/server";
import { InviteSignIn } from "./invite-sign-in";

export default async function InvitePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  // ─── Нет токена ──────────────────────────────────────────────────────────
  if (!token) {
    return <InviteError message="Ссылка приглашения недействительна или устарела. Уточните актуальную ссылку у куратора агентства." />;
  }

  // ─── Проверяем инвайт в БД ────────────────────────────────────────────────
  const nowIso = new Date().toISOString();
  const { data: invite } = await supabaseAdmin
    .from("invite_codes")
    .select("id, email, expires_at, used_by")
    .eq("token", token)
    .maybeSingle();

  if (!invite) {
    return <InviteError message="Ссылка приглашения не найдена. Возможно, она была удалена или введена неверно." />;
  }

  if (invite.used_by) {
    return <InviteError message="Это приглашение уже было использовано. Если вы уже регистрировались — войдите напрямую через страницу входа." />;
  }

  if (invite.expires_at && invite.expires_at < nowIso) {
    return <InviteError message="Срок действия этого приглашения истёк. Запросите новую ссылку у куратора агентства." />;
  }

  // ─── Инвайт валиден → передаём клиентскому компоненту ───────────────────
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md space-y-6 text-sm">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
            Приглашение в Sigma Models
          </p>
          <h1 className="mt-2 text-xl font-semibold tracking-tight">
            Доступ к личному кабинету
          </h1>
          <p className="mt-2 text-xs text-muted-foreground">
            {invite.email
              ? "Мы отправим ссылку для входа на ваш email — нажимать ничего не нужно."
              : "Введите email, на который придёт ссылка для входа."}
          </p>
        </div>

        <InviteSignIn
          token={token}
          email={invite.email ?? undefined}
        />
      </div>
    </main>
  );
}

function InviteError({ message }: { message: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md space-y-4 text-sm">
        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
          Приглашение в Sigma Models
        </p>
        <p className="text-destructive">{message}</p>
      </div>
    </main>
  );
}
