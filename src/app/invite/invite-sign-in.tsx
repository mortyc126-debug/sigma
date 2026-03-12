"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  const callbackUrl = `/dashboard?invite=${encodeURIComponent(token)}`;

  // ─── Именной инвайт: авто-отправка ───────────────────────────────────────
  if (email) {
    return <AutoSend email={email} callbackUrl={callbackUrl} />;
  }

  // ─── Открытый инвайт: форма ввода email ──────────────────────────────────
  return <OpenInviteForm callbackUrl={callbackUrl} />;
}

// ─── Авто-отправка magic link ─────────────────────────────────────────────────

function AutoSend({ email, callbackUrl }: { email: string; callbackUrl: string }) {
  const [status, setStatus] = useState<"sending" | "sent" | "error">("sending");
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    signIn("email", { email, callbackUrl, redirect: false })
      .then((res) => {
        if (res?.error) setStatus("error");
        else setStatus("sent");
      })
      .catch(() => setStatus("error"));
  }, [email, callbackUrl]);

  if (status === "sending") {
    return (
      <div className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 animate-spin rounded-full border border-amber-400/40 border-t-amber-400" />
          Отправляем ссылку для входа…
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="space-y-3 text-sm">
        <p className="text-destructive">
          Не удалось отправить письмо. Попробуйте ещё раз или обратитесь к куратору.
        </p>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            fired.current = false;
            setStatus("sending");
          }}
        >
          Попробовать снова
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2 text-sm">
      <p className="font-medium">Ссылка для входа отправлена</p>
      <p className="text-muted-foreground">
        Письмо отправлено на <span className="text-foreground">{email}</span>.
        Проверьте входящие и папку «Спам», затем нажмите на кнопку в письме.
      </p>
    </div>
  );
}

// ─── Форма для открытого инвайта ──────────────────────────────────────────────

function OpenInviteForm({ callbackUrl }: { callbackUrl: string }) {
  const [email, setEmail] = useState("");
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
