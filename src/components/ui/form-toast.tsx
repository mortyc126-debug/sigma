"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ToastProps = {
  status: "success" | "error" | null;
  message?: string;
  onDismiss: () => void;
};

export function FormToast({ status, message, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!status) return;
    const t = setTimeout(onDismiss, 5000);
    return () => clearTimeout(t);
  }, [status, onDismiss]);

  const isSuccess = status === "success";

  return (
    <AnimatePresence>
      {status && (
        <motion.div
          key={status + (message ?? "")}
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ duration: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
        >
          <div
            className={`flex items-center gap-3 rounded-2xl border px-5 py-3.5 shadow-2xl backdrop-blur-xl ${
              isSuccess
                ? "border-amber-400/30 bg-black/85 text-foreground"
                : "border-red-500/30 bg-black/85 text-foreground"
            }`}
          >
            {/* Icon */}
            <div
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                isSuccess
                  ? "bg-amber-400/15 text-amber-300"
                  : "bg-red-500/15 text-red-400"
              }`}
            >
              {isSuccess ? "✓" : "✕"}
            </div>

            {/* Text */}
            <div className="space-y-0.5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                {isSuccess ? "Анкета отправлена" : "Ошибка отправки"}
              </p>
              <p className="text-[10px] text-muted-foreground/70">
                {isSuccess
                  ? "Мы рассмотрим вашу заявку в течение 5–7 рабочих дней."
                  : (message ?? "Попробуйте повторить позже.")}
              </p>
            </div>

            {/* Close */}
            <button
              type="button"
              onClick={onDismiss}
              className="ml-3 shrink-0 text-muted-foreground/40 transition-colors hover:text-muted-foreground/80"
              aria-label="Закрыть"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
