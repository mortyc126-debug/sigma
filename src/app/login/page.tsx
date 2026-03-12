import { Suspense } from "react";
import { LoginForm } from "./login-form";
import { motion } from "framer-motion";

function LoginFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo skeleton */}
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 animate-pulse rounded-full border border-white/10 bg-white/5" />
          <div className="h-3 w-24 animate-pulse rounded bg-white/5" />
        </div>
        {/* Card skeleton */}
        <div className="gradient-border rounded-2xl bg-white/[0.025] p-px">
          <div className="rounded-2xl bg-black/75 px-6 py-7 backdrop-blur-xl">
            <div className="space-y-4">
              <div className="h-7 w-40 animate-pulse rounded-lg bg-white/5" />
              <div className="h-3 w-full animate-pulse rounded bg-white/[0.04]" />
              <div className="mt-2 h-10 w-full animate-pulse rounded-lg bg-white/5" />
              <div className="h-10 w-full animate-pulse rounded-full bg-white/8" />
            </div>
          </div>
        </div>
      </div>
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
