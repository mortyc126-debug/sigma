"use client";

import { useEffect, useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
  token: string;
  /** Email модели, если он задан в инвайте (именной инвайт). */
  email?: string;
}

/**
 * Если email известен — сразу отправляем magic link, модели ничего вводить не нужно.
 * Если инвайт открытый (email не задан) — показываем форму ввода email.
 */
export function InviteSignIn({ token, email }: Props) {
  // Для именных инвайтов (email задан) — signIn callback находит инвайт по email,
  // поэтому токен в callbackUrl не нужен → URL в письме остаётся чистым.
  // Для открытых инвайтов (email не задан) — нужен токен, т.к. поиск по email невозможен.
  const callbackUrl = email ? "/dashboard" : `/dashboard?invite=${encodeURIComponent(token)}`;

  if (email) {
    return <AutoSend email={email} token={token} callbackUrl={callbackUrl} />;
  }

  return <OpenInviteForm callbackUrl={callbackUrl} />;
}

// ─── Авто-отправка magic link ─────────────────────────────────────────────────

function AutoSend({
  email,
  token,
  callbackUrl,
}: {
  email: string;
  token: string;
  callbackUrl: string;
}) {
  const [status, setStatus] = useState<"sending" | "sent" | "error">("sending");
  // Изменение attempt перезапускает useEffect → retry работает корректно.
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStatus("sending");

    signIn("email", { email, callbackUrl, redirect: false })
      .then((res) => {
        if (cancelled) return;
        if (res?.error) setStatus("error");
        else setStatus("sent");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt]); // email и callbackUrl не меняются — используем только attempt

  if (status === "sending") {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="inline-block h-3 w-3 animate-spin rounded-full border border-amber-400/40 border-t-amber-400" />
        Отправляем ссылку для входа…
      </div>
    );
  }

  if (status === "sent") {
    return (
      <div className="space-y-2 text-sm">
        <p className="font-medium">Ссылка для входа отправлена</p>
        <p className="text-muted-foreground">
          Письмо отправлено на{" "}
          <span className="text-foreground">{email}</span>.{" "}
          Проверьте входящие и папку «Спам», затем нажмите кнопку в письме.
        </p>
      </div>
    );
  }

  // status === "error"
  return (
    <div className="space-y-4 text-sm">
      <p className="text-destructive">
        Не удалось отправить письмо автоматически.
      </p>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setAttempt((a) => a + 1)}
      >
        Попробовать снова
      </Button>
      {/* Запасной вариант: ручной ввод email */}
      <div className="border-t border-border/50 pt-4">
        <p className="mb-3 text-xs text-muted-foreground">
          Или введите email вручную — адрес уже занесён в систему, ссылка придёт на почту.
        </p>
        <OpenInviteForm callbackUrl={callbackUrl} prefillEmail={email} />
      </div>
      <p className="text-xs text-muted-foreground">
        Если ничего не помогает —{" "}
        <Link
          href={`/login?token=${encodeURIComponent(token)}`}
          className="underline underline-offset-4 hover:text-foreground"
        >
          войти через страницу входа
        </Link>
        .
      </p>
    </div>
  );
}

// ─── Форма для открытого инвайта ──────────────────────────────────────────────

function OpenInviteForm({
  callbackUrl,
  prefillEmail,
}: {
  callbackUrl: string;
  prefillEmail?: string;
}) {
  const [email, setEmail] = useState(prefillEmail ?? "");
  const [status, setStatus] = useState<"idle" | "loading" | "sent">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    setStatus("loading");
    await signIn("email", { email: trimmed, callbackUrl, redirect: false });
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="space-y-2 text-sm">
        <p className="font-medium">Ссылка для входа отправлена</p>
        <p className="text-muted-foreground">
          Проверьте входящие на{" "}
          <span className="text-foreground">{email}</span> и папку «Спам».
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="space-y-1">
        <label htmlFor="invite-email" className="text-xs text-muted-foreground">
          Ваш email
        </label>
        <Input
          id="invite-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="адрес электронной почты"
        />
      </div>
      <Button type="submit" className="w-full" disabled={status === "loading"}>
        {status === "loading" ? "Отправляем…" : "Получить ссылку для входа"}
      </Button>
    </form>
  );
}
