import { Card } from "@/components/ui/card";
import Link from "next/link";
import { FileImage, User, Wallet, MessageSquare } from "lucide-react";

const TIPS = [
  {
    icon: FileImage,
    title: "Портфолио",
    text: "Добавляйте качественные снимки — они видны клиентам и букеру.",
    href: "/dashboard",
    tab: "Портфолио",
  },
  {
    icon: User,
    title: "Профиль",
    text: "Рост, параметры и контакты помогают подбирать вас на кастинги.",
    href: "/dashboard",
    tab: "Профиль",
  },
  {
    icon: Wallet,
    title: "Финансы",
    text: "Баланс и история операций. Запрос на вывод — в один клик.",
    href: "/dashboard",
    tab: "Финансы",
  },
  {
    icon: MessageSquare,
    title: "Вопросы",
    text: "По всем вопросам пишите куратору или в офис агентства.",
    href: "/contacts",
    tab: "Контакты",
  },
];

export function ModelTipsCard() {
  return (
    <Card className="border-border/60 bg-card/50 px-4 py-4 sm:px-5">
      <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
        Рекомендации
      </p>
      <p className="mt-1 text-xs text-foreground/90">
        Несколько шагов, чтобы кабинет работал на вас:
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {TIPS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.tab}
              href={item.href}
              className="flex gap-3 rounded-lg border border-border/50 bg-background/20 p-3 text-left transition-colors hover:border-border hover:bg-background/40"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-200/90">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium tracking-tight">
                  {item.title}
                </p>
                <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                  {item.text}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
