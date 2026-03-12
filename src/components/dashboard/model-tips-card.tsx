import Link from "next/link";

const TIPS = [
  {
    num: "01",
    title: "Портфолио",
    text: "Добавляйте качественные снимки — они видны клиентам и букеру агентства.",
    href: "/dashboard?tab=portfolio",
  },
  {
    num: "02",
    title: "Профиль",
    text: "Рост, параметры и фото помогают подбирать вас на кастинги точечно.",
    href: "/dashboard?tab=profile",
  },
  {
    num: "03",
    title: "Финансы",
    text: "Баланс и история операций. Запрос на вывод — в один клик.",
    href: "/dashboard?tab=finance",
  },
  {
    num: "04",
    title: "Вопросы",
    text: "По всем вопросам пишите куратору или обращайтесь в офис агентства.",
    href: "/contacts",
  },
];

export function ModelTipsCard() {
  return (
    <div className="gradient-border rounded-2xl bg-white/[0.02] p-px">
      <div className="rounded-2xl bg-black/55 px-4 py-4 sm:px-5 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-5 bg-gradient-to-r from-amber-400/50 to-transparent" />
          <p className="font-condensed text-[9px] font-semibold uppercase tracking-[0.34em] text-amber-300/50">
            Рекомендации
          </p>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground/55 mb-4">
          Несколько шагов, чтобы кабинет работал на вас:
        </p>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {TIPS.map((item) => (
            <Link
              key={item.num}
              href={item.href}
              className="group flex gap-3 rounded-xl border border-white/6 bg-white/[0.03] p-3.5 text-left transition-all duration-250 hover:border-amber-400/20 hover:bg-white/[0.06]"
            >
              <span className="font-condensed mt-0.5 shrink-0 text-[11px] font-bold text-amber-300/25 transition-colors duration-250 group-hover:text-amber-300/50">
                {item.num}
              </span>
              <div className="min-w-0 flex-1 space-y-1">
                <p className="font-condensed text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/80 transition-colors group-hover:text-foreground">
                  {item.title}
                </p>
                <p className="text-[11px] leading-relaxed text-muted-foreground/50">
                  {item.text}
                </p>
              </div>
              <span className="mt-0.5 shrink-0 text-[10px] text-muted-foreground/20 transition-colors duration-250 group-hover:text-amber-300/50">
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
