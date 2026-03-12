import { Suspense } from "react";
import { LoginForm } from "./login-form";
import { Card } from "@/components/ui/card";

function LoginFallback() {
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
        <div className="h-10 w-full animate-pulse rounded-md bg-muted/50" />
        <div className="mt-4 h-4 w-32 animate-pulse rounded bg-muted/30" />
      </Card>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}
