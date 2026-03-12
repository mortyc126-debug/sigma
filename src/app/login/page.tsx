 "use client";

import { useState, FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;

    setStatus("loading");
    await signIn("email", {
      email: trimmed,
      callbackUrl,
      redirect: false,
    });
    setStatus("sent");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md border-border/70 bg-card/70 px-6 py-7 shadow-[0_0_40px_rgba(0,0,0,0.6)] backdrop-blur">
        <div className="mb-5 space-y-2">
          <h1 className="text-lg font-medium tracking-tight">
            Вход в личный кабинет
          </h1>
          <p className="text-xs text-muted-foreground">
            Доступ в систему Sigma Models осуществляется только по приглашениям
            агентства.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-sm">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email, на который пришло приглашение"
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={status === "loading"}
          >
            {status === "loading"
              ? "Отправляем ссылку…"
              : "Получить ссылку для входа"}
          </Button>
          {status === "idle" && (
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              На указанный email будет отправлена безопасная ссылка для входа.
              Если приглашения нет, доступ к кабинету будет отклонён.
            </p>
          )}
          {status === "sent" && (
            <p className="text-[11px] leading-relaxed text-emerald-400">
              Если такой email есть в системе, мы отправили ссылку для входа.
              Проверьте входящие и папку «Спам».
            </p>
          )}
        </form>
      </Card>
    </main>
  );
}

