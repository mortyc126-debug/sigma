import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "О нас",
  description:
    "Sigma Models — одно из ведущих модельных агентств России. Премиальный сегмент, международные стандарты, строгий кастинг и прозрачная работа с моделями и брендами.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen px-6 py-16 md:px-10 lg:px-20">
      <div className="mx-auto max-w-4xl space-y-16">
        {/* Герой-блок */}
        <header className="space-y-6">
          <p className="text-xs uppercase tracking-[0.28em] text-primary/90">
            Модельное агентство полного цикла
          </p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
            Sigma Models — где карьера модели становится искусством
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Мы не просто агентство. Мы — кураторы карьеры, мост между талантом и
            мировыми брендами. За годы работы Sigma Models вывела на рынок сотни
            лиц, чьи образы определяют рекламу и подиумы в России и за рубежом.
            Строгий отбор, прозрачные условия и европейские стандарты работы —
            то, что отличает нас от массового подхода.
          </p>
        </header>

        {/* Цифры и факты */}
        <section className="grid gap-8 border-y border-border/60 py-12 sm:grid-cols-3">
          <div className="space-y-1">
            <p className="text-3xl font-semibold tracking-tight text-primary md:text-4xl">
              10+
            </p>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              лет на рынке премиального моделинга
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-semibold tracking-tight text-primary md:text-4xl">
              500+
            </p>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              успешных кампаний с федеральными и международными брендами
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-semibold tracking-tight text-primary md:text-4xl">
              6
            </p>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              городов присутствия и партнёрская сеть по России и СНГ
            </p>
          </div>
        </section>

        {/* Миссия и философия */}
        <section className="space-y-6">
          <h2 className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
            Миссия и философия
          </h2>
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
            <p>
              Sigma Models создана для тех, кто воспринимает модельный бизнес как
              профессию высшей лиги. Мы не гонимся за количеством — мы
              выстраиваем долгосрочные карьеры и доверительные отношения с
              брендами. Наш принцип: одно сильное лицо ценнее десятка случайных
              кастингов.
            </p>
            <p>
              Мы совмещаем строгий европейский подход к кастингу с глубоким
              пониманием российского и регионального рынка. Наша команда —
              продюсеры, букеры и визажисты с опытом работы в Москве, Милане,
              Париже и Нью-Йорке. Это позволяет нам готовить модели к
              международным проектам и вести переговоры с клиентами на языке
              глобальных стандартов.
            </p>
          </div>
        </section>

        {/* Что отличает Sigma Models */}
        <section className="space-y-6">
          <h2 className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
            Что отличает Sigma Models
          </h2>
          <ul className="space-y-5 text-sm text-muted-foreground md:text-base">
            <li className="flex gap-4">
              <span className="mt-1 h-px w-8 shrink-0 bg-primary/50" />
              <div className="space-y-1">
                <span className="font-medium text-foreground">
                  Строгий отбор, а не массовый набор.
                </span>{" "}
                Мы рассматриваем анкеты выборочно и не работаем по конвейерной
                схеме. В фокусе — лица, которые органично существуют в
                премиальной рекламе, fashion-съёмках и на подиуме. Каждая модель
                проходит личное собеседование и тестовую съёмку.
              </div>
            </li>
            <li className="flex gap-4">
              <span className="mt-1 h-px w-8 shrink-0 bg-primary/50" />
              <div className="space-y-1">
                <span className="font-medium text-foreground">
                  Прозрачные условия и финансы.
                </span>{" "}
                Для каждой модели ведётся баланс, история начислений и запросов
                на вывод. Вся финансовая часть доступна в личном кабинете в
                режиме реального времени. Никаких скрытых комиссий и задержек
                выплат — мы работаем по договору и в рамках закона.
              </div>
            </li>
            <li className="flex gap-4">
              <span className="mt-1 h-px w-8 shrink-0 bg-primary/50" />
              <div className="space-y-1">
                <span className="font-medium text-foreground">
                  Работа с брендами уровня премиум и люкс.
                </span>{" "}
                Мы выстраиваем долгосрочные отношения с рекламодателями,
                ювелирными домами, fashion-брендами и медиа. От подбора типажей
                до продакшен-поддержки на площадке — сопровождаем кампании под ключ.
              </div>
            </li>
            <li className="flex gap-4">
              <span className="mt-1 h-px w-8 shrink-0 bg-primary/50" />
              <div className="space-y-1">
                <span className="font-medium text-foreground">
                  Карьера под кураторством.
                </span>{" "}
                У каждой модели есть персональный куратор: помощь в формировании
                портфолио, подготовка к кастингам, развитие в направлении
                editorial, commercial или runway. Мы инвестируем в развитие
                своих людей.
              </div>
            </li>
          </ul>
        </section>

        {/* Как мы работаем с моделями */}
        <section className="space-y-6">
          <h2 className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
            Как мы работаем с моделями
          </h2>
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
            <p>
              Sigma Models — агентство не для всех. Мы ожидаем профессионального
              отношения к работе, дисциплины и готовности развиваться. Взамен
              предлагаем прозрачное управление карьерой, поддержку кураторов,
              доступ к проектам, которые формируют портфолио международного
              уровня, и честные выплаты в оговорённые сроки.
            </p>
            <p>
              Вход в систему осуществляется только по приглашению агентства или
              после одобрения анкеты «Стать моделью». Это позволяет сохранять
              высокий уровень пула моделей и репутацию бренда Sigma в глазах
              клиентов и партнёров.
            </p>
            <p>
              Если вы бренд, продюсер или медиа — мы открыты к сотрудничеству:
              подбор моделей под проект, кастинги, организация съёмок и показов.
              Свяжитесь с нами через раздел Контакты.
            </p>
          </div>
        </section>

        {/* Призыв к действию */}
        <section className="border-t border-border/60 pt-12">
          <p className="text-center text-sm text-muted-foreground">
            Хотите стать частью Sigma Models? Заполните анкету на главной странице
            или перейдите в раздел{" "}
            <a href="/#apply-form" className="text-primary underline-offset-4 hover:underline">
              «Стать моделью»
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
