import type { Metadata } from "next";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Филиалы",
  description:
    "Филиалы модельного агентства Sigma Models в Москве, Санкт-Петербурге, Казани, Екатеринбурге, Новосибирске и других городах России.",
};

const BRANCHES = [
  {
    city: "Москва",
    label: "Головной офис",
    address: "ул. Большая Никитская, д. 15, стр. 2, офис 7",
    phone: "+7 (495) 900‑45‑21",
    note: "Центральный офис, кастинги, продакшен. Приём по записи.",
  },
  {
    city: "Санкт‑Петербург",
    label: "Филиал",
    address: "Невский пр., д. 88, офис 4",
    phone: "+7 (812) 309‑12‑45",
    note: "Кастинги и съёмки для северо-западного региона.",
  },
  {
    city: "Казань",
    label: "Филиал",
    address: "ул. Баумана, д. 58, бизнес-центр «Центральный», офис 12",
    phone: "+7 (843) 567‑33‑21",
    note: "Работа с моделями Поволжья, локальные кастинги и кампании.",
  },
  {
    city: "Екатеринбург",
    label: "Филиал",
    address: "ул. Ленина, д. 52а, офис 9",
    phone: "+7 (343) 278‑91‑00",
    note: "Уральский регион: кастинги, тесты, сотрудничество с локальными брендами.",
  },
  {
    city: "Новосибирск",
    label: "Филиал",
    address: "Красный пр., д. 77, офис 15",
    phone: "+7 (383) 209‑44‑18",
    note: "Сибирь: отбор новых лиц, региональные съёмки и партнёрские проекты.",
  },
  {
    city: "Сочи",
    label: "Партнёрское представительство",
    address: "ул. Навагинская, д. 16, офис 3",
    phone: "+7 (862) 265‑71‑22",
    note: "Сезонные кастинги и съёмки на юге России.",
  },
];

export default function BranchesPage() {
  return (
    <main className="min-h-screen px-6 py-16 md:px-10 lg:px-20">
      <div className="mx-auto max-w-5xl space-y-12">
        <header className="space-y-5">
          <p className="text-xs uppercase tracking-[0.28em] text-primary/90">
            География · Россия
          </p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
            Филиалы Sigma Models
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Мы подбираем и сопровождаем модели в ключевых городах России.
            Организуем локальные кастинги, фотосъёмки и кампании с единым
            стандартом качества. Головной офис в Москве; филиалы и партнёрские
            представительства — в регионах.
          </p>
        </header>

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BRANCHES.map((branch) => (
            <Card
              key={branch.city}
              className="border-border/70 bg-card/60 px-5 py-5 text-sm transition-colors hover:border-primary/30"
            >
              <div className="flex items-start gap-3">
                <span className="mt-1.5 h-px w-6 shrink-0 bg-primary/50" />
                <div className="space-y-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                      {branch.label}
                    </p>
                    <p className="mt-0.5 text-base font-medium text-foreground">
                      {branch.city}
                    </p>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {branch.address}
                  </p>
                  <p className="text-xs">
                    <span className="text-muted-foreground">Тел.: </span>
                    <span className="text-foreground">{branch.phone}</span>
                  </p>
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    {branch.note}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </section>

        <section className="rounded-lg border border-border/60 bg-card/40 px-5 py-4 text-sm text-muted-foreground">
          <p>
            Визиты в офисы — по предварительной записи. Для кастингов и
            сотрудничества в вашем городе напишите на{" "}
            <a
              href="mailto:casting@sigma-models.ru"
              className="text-primary hover:underline"
            >
              casting@sigma-models.ru
            </a>
            , указав город в теме письма.
          </p>
        </section>
      </div>
    </main>
  );
}
