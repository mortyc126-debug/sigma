"use client";

import { useState, FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
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

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
      >
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <Link href="/" className="group">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 shadow-[0_0_24px_rgba(240,201,106,0.08)] transition-all duration-300 group-hover:border-amber-400/40 group-hover:shadow-[0_0_30px_rgba(240,201,106,0.15)]">
              <span className="text-xl font-semibold tracking-[0.1em] text-amber-200/80">
                Σ
              </span>
            </div>
          </Link>
          <div className="space-y-1 text-center">
            <p className="font-condensed text-[11px] font-semibold uppercase tracking-[0.36em] text-amber-300/60">
              Sigma Models
            </p>
            <p className="font-condensed text-[9px] font-medium uppercase tracking-[0.24em] text-muted-foreground/35">
              Закрытый кабинет
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="gradient-border rounded-2xl bg-white/[0.025] p-px shadow-[0_0_60px_rgba(0,0,0,0.7)]">
          <div className="rounded-2xl bg-black/75 px-6 py-7 backdrop-blur-xl">
            <AnimatePresence mode="wait">
              {status !== "sent" ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6 space-y-1.5">
                    <h1
                      className="text-2xl font-light tracking-[0.08em] text-foreground"
                      style={{ fontFamily: "var(--font-display), serif" }}
                    >
                      Вход в кабинет
                    </h1>
                    <p className="text-xs leading-relaxed text-muted-foreground/55">
                      Доступ только по приглашению агентства.
                    </p>
                  </div>

                  <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="email"
                        className="font-condensed text-[10px] font-semibold uppercase tracking-[0.26em] text-muted-foreground/55"
                      >
                        Email
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email, на который пришло приглашение"
                        className="border-white/10 bg-white/5 text-foreground placeholder:text-muted-foreground/25 focus:border-amber-400/30 focus:ring-amber-400/10"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="hero-cta-glow w-full py-2.5 font-condensed text-[10px] font-semibold uppercase tracking-[0.28em] disabled:opacity-60"
                      disabled={status === "loading"}
                    >
                      {status === "loading" ? "Отправляем ссылку…" : "Получить ссылку для входа"}
                    </Button>

                    <p className="text-center font-condensed text-[9px] uppercase tracking-[0.18em] leading-relaxed text-muted-foreground/30">
                      На email придёт безопасная ссылка для входа.
                      Без приглашения — доступ отклоняется.
                    </p>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="sent"
                  className="flex flex-col items-center gap-4 py-4 text-center"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-amber-400/25 bg-amber-400/[0.08]">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4 10l4.5 4.5L16 6" stroke="#f0c96a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="space-y-1.5">
                    <p
                      className="text-lg font-light tracking-[0.08em] text-foreground"
                      style={{ fontFamily: "var(--font-display), serif" }}
                    >
                      Ссылка отправлена
                    </p>
                    <p className="text-xs leading-relaxed text-muted-foreground/55">
                      Если такой email есть в системе — письмо уже в пути.
                      Проверьте входящие и папку «Спам».
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="font-condensed text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground/40 underline-offset-4 transition-colors hover:text-muted-foreground/70 hover:underline"
                  >
                    Ввести другой email
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Back link */}
        <p className="mt-5 text-center font-condensed text-[9px] font-medium uppercase tracking-[0.24em] text-muted-foreground/30">
          <Link href="/" className="underline-offset-4 transition-colors hover:text-muted-foreground/60 hover:underline">
            ← На сайт
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
