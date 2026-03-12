import type { Metadata } from "next";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Контакты",
  description:
    "Контакты модельного агентства Sigma Models. Москва, головной офис, кастинг, коммерческие запросы и сотрудничество с брендами.",
};

export default function ContactsPage() {
  return (
    <main className="min-h-screen px-6 py-16 md:px-10 lg:px-20">
      <div className="mx-auto max-w-4xl space-y-14">
        {/* Герой */}
        <header className="space-y-5">
          <p className="text-xs uppercase tracking-[0.28em] text-primary/90">
            Связь с агентством
          </p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
            Контакты Sigma Models
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Мы открыты к диалогу с брендами, продюсерами, фотографами и медиа.
            Для коммерческих запросов, кастингов и сотрудничества используйте
            контакты ниже. Модели агентства решают вопросы через личный кабинет и
            персонального куратора.
          </p>
        </header>

        {/* Карточки контактов */}
        <section className="grid gap-6 sm:grid-cols-2">
          <Card className="border-border/70 bg-card/60 px-5 py-5 text-sm transition-colors hover:border-primary/30">
            <div className="flex items-start gap-3">
              <span className="mt-1.5 h-px w-8 shrink-0 bg-primary/50" />
              <div className="space-y-4">
                <h2 className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                  Головной офис — Москва
                </h2>
                <p className="font-medium text-foreground">
                  ул. Большая Никитская, 15, офис 7
                </p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Приём по предварительной записи. Вход через внутренний двор,
                  ресепшен Sigma. Для визитов партнёров и клиентов просим
                  согласовывать время заранее.
                </p>
                <dl className="space-y-2 text-xs">
                  <div>
                    <dt className="text-muted-foreground">Общий email</dt>
                    <dd>
                      <a
                        href="mailto:sigma-models@mail.ru"
                        className="text-primary hover:underline"
                      >
                        sigma-models@mail.ru
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Коммерческие запросы</dt>
                    <dd>
                      <a
                        href="mailto:booking@sigma-models.ru"
                        className="text-primary hover:underline"
                      >
                        booking@sigma-models.ru
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Телефон офиса</dt>
                    <dd className="text-foreground">+7 (495) 900‑45‑21</dd>
                  </div>
                </dl>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  пн–пт, 10:00–19:00 (МСК)
                </p>
              </div>
            </div>
          </Card>

          <Card className="border-border/70 bg-card/60 px-5 py-5 text-sm transition-colors hover:border-primary/30">
            <div className="flex items-start gap-3">
              <span className="mt-1.5 h-px w-8 shrink-0 bg-primary/50" />
              <div className="space-y-4">
                <h2 className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                  Кастинг и продакшен
                </h2>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Подбор типажей под проект, организация кастингов, продакшен‑поддержка
                  на площадке. Отвечаем на запросы в течение 1–2 рабочих дней.
                </p>
                <dl className="space-y-2 text-xs">
                  <div>
                    <dt className="text-muted-foreground">Email кастинга</dt>
                    <dd>
                      <a
                        href="mailto:casting@sigma-models.ru"
                        className="text-primary hover:underline"
                      >
                        casting@sigma-models.ru
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Кастинг‑директор</dt>
                    <dd className="text-foreground">+7 (495) 900‑45‑22</dd>
                  </div>
                </dl>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  пн–пт, 11:00–18:00 (МСК)
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Для моделей */}
        <section className="space-y-5 border-t border-border/60 pt-10">
          <h2 className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
            Для моделей агентства
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">
                Уже работаете с Sigma?
              </p>
              <p className="leading-relaxed">
                Используйте личный кабинет для обновления портфолио, параметров и
                связи с куратором. Вопросы по выплатам, договорам и графикам
                решаются через персонального менеджера в системе.
              </p>
              <p>
                <a
                  href="/login"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Войти в личный кабинет
                </a>
              </p>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">
                Хотите стать моделью Sigma?
              </p>
              <p className="leading-relaxed">
                Анкеты принимаются только через форму на главной странице. После
                рассмотрения мы свяжемся с отобранными кандидатами и пригласим на
                собеседование.
              </p>
              <p>
                <a
                  href="/#apply-form"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Заполнить анкету «Стать моделью»
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* Пресса и партнёры */}
        <section className="rounded-lg border border-border/60 bg-card/40 px-5 py-5">
          <h2 className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
            Пресса и партнёрские запросы
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Для запросов от СМИ, коллабораций и партнёрских программ пишите на{" "}
            <a
              href="mailto:sigma-models@mail.ru"
              className="text-primary hover:underline"
            >
              sigma-models@mail.ru
            </a>
            {" "}с пометкой темы в заголовке письма. Мы отвечаем в приоритетном порядке.
          </p>
        </section>
      </div>
    </main>
  );
}
