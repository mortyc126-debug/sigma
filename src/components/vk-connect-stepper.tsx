"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabaseBrowser } from "@/lib/supabase/client";
import {
  startVkConnection,
  submitVkSmsCode,
} from "@/lib/actions/vk-connect-actions";

type VkWorkflowStatus =
  | "waiting_login"
  | "verifying_credentials"
  | "waiting_sms"
  | "sms_received"
  | "verifying_sms"
  | "completed"
  | "failed";

type Props = {
  modelId: string;
  connectionId: string | null;
  initialStatus: VkWorkflowStatus;
  hasSmsCode: boolean;
};

export function VkConnectStepper({
  modelId,
  connectionId,
  initialStatus,
  hasSmsCode,
}: Props) {
  const [status, setStatus] = useState<VkWorkflowStatus>(initialStatus);

  // Realtime subscription (мгновенные обновления)
  useEffect(() => {
    const channel = supabaseBrowser
      .channel(`vk-connections-model-${modelId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "vk_account_connections",
          filter: `model_id=eq.${modelId}`,
        },
        (payload) => {
          const next = (payload.new as any)?.status as
            | VkWorkflowStatus
            | undefined;
          if (next) {
            setStatus(next);
          }
        },
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [modelId]);

  // Polling fallback — каждые 5 сек на случай если Realtime не настроен
  useEffect(() => {
    const poll = async () => {
      const { data } = await supabaseBrowser
        .from("vk_account_connections")
        .select("status")
        .eq("model_id", modelId)
        .maybeSingle();
      if (data?.status) {
        setStatus(data.status as VkWorkflowStatus);
      }
    };

    const interval = setInterval(poll, 5000);
    return () => clearInterval(interval);
  }, [modelId]);

  const currentStep = useMemo(() => {
    switch (status) {
      case "waiting_login":
      case "verifying_credentials":
        return 1;
      case "waiting_sms":
      case "sms_received":
      case "verifying_sms":
        return 2;
      case "completed":
        return 3;
      case "failed":
        return 1;
      default:
        return 1;
    }
  }, [status]);

  const statusMessage = useMemo(() => {
    switch (status) {
      case "waiting_login":
        return "Введите данные аккаунта VK и отправьте форму, чтобы подтвердить и привязать ваш аккаунт.";
      case "verifying_credentials":
        return "Данные аккаунта отправлены. Система проверяет подключение.";
      case "waiting_sms":
        return "Ожидается подтверждение аккаунта. Как только придёт SMS от VK, введите код ниже.";
      case "sms_received":
        return "Код принят. Подтверждаем аккаунт...";
      case "verifying_sms":
        return "Подтверждаем аккаунт...";
      case "completed":
        return "Аккаунт успешно подключён.";
      case "failed":
        return "Не удалось подключить аккаунт. Исправьте данные и повторите попытку или свяжитесь с куратором.";
      default:
        return "";
    }
  }, [status]);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Подключение аккаунта VK
        </h1>
        <p className="text-sm text-muted-foreground md:text-base">
          Для работы с агентством необходимо привязать ваш аккаунт ВКонтакте.
          Подтверждение занимает около минуты.
        </p>
      </header>

      <Card className="border-border/70 bg-card/60 px-5 py-6">
        <StepperHeader currentStep={currentStep} />

        <p className="mt-4 text-xs text-muted-foreground">{statusMessage}</p>

        <div className="mt-6">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <form
                  action={startVkConnection}
                  className="space-y-4 text-sm"
                >
                  <div className="space-y-1.5">
                    <Label htmlFor="vk_login">Логин VK</Label>
                    <Input
                      id="vk_login"
                      name="vk_login"
                      required
                      placeholder="Телефон или email от аккаунта VK"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="vk_password">Пароль VK</Label>
                    <Input
                      id="vk_password"
                      name="vk_password"
                      type="password"
                      required
                      placeholder="Пароль от аккаунта VK"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                  >
                    {status === "verifying_credentials"
                      ? "Данные отправлены, ожидайте"
                      : status === "failed"
                      ? "Повторить подключение"
                      : "Отправить данные для подключения"}
                  </Button>
                </form>

                {status === "verifying_credentials" && (
                  <p className="rounded-lg border border-amber-400/20 bg-amber-400/[0.05] px-3 py-2.5 text-[11px] leading-relaxed text-amber-200/60">
                    Данные переданы. Как только от VK придёт SMS с кодом —
                    страница обновится автоматически. Если этого не произошло,
                    обновите страницу вручную.
                  </p>
                )}
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <form action={submitVkSmsCode} className="space-y-4 text-sm">
                  <div className="space-y-1.5">
                    <Label htmlFor="sms_code">Код из SMS</Label>
                    <Input
                      id="sms_code"
                      name="sms_code"
                      required
                      placeholder="Введите код, полученный от VK"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Отправить код
                  </Button>
                </form>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="space-y-3 text-sm"
              >
                <p className="text-muted-foreground">
                  Аккаунт успешно подтверждён и привязан к системе Sigma Models.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-6 text-[11px] leading-relaxed text-muted-foreground">
          В процессе подключения система может выполнить технический вход в ваш
          аккаунт ВКонтакте для подтверждения.
          Это стандартная процедура. Не пугайтесь уведомлений о входе.
        </p>
      </Card>
    </div>
  );
}

function StepBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`h-5 w-5 rounded-full border text-[10px] flex items-center justify-center ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border text-muted-foreground"
      }`}
    >
      {active ? "●" : "○"}
    </span>
  );
}

function StepperHeader({ currentStep }: { currentStep: number }) {
  const steps = [
    { id: 1, label: "Аккаунт" },
    { id: 2, label: "Подтверждение" },
    { id: 3, label: "Готово" },
  ];

  return (
    <div className="flex items-center gap-4 text-xs">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center gap-2">
          <StepBadge active={currentStep === step.id} />
          <span
            className={
              currentStep === step.id
                ? "font-medium text-foreground"
                : "text-muted-foreground"
            }
          >
            {step.label}
          </span>
          {index < steps.length - 1 && (
            <div className="h-px w-8 bg-border/60" />
          )}
        </div>
      ))}
    </div>
  );
}

