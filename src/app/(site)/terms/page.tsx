import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Условия использования — Sigma Models",
  description:
    "Условия использования сайта и услуг модельного агентства Sigma Models. Правила работы с личным кабинетом, выплаты и интеллектуальная собственность.",
  alternates: {
    canonical: "https://sigma-model.com/terms",
  },
  openGraph: {
    title: "Условия использования — Sigma Models",
    description: "Условия использования сайта и услуг модельного агентства Sigma Models.",
    url: "https://sigma-model.com/terms",
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen px-6 py-16 md:px-10 lg:px-20">
      <article className="mx-auto max-w-3xl space-y-10">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.28em] text-primary/90">
            Правовая информация
          </p>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Условия использования
          </h1>
        </header>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Настоящие условия регулируют использование сайта sigma-models.ru
            и услуг модельного агентства Sigma Models («агентство»). Пользуясь
            сайтом и сервисами агентства, вы соглашаетесь с этими условиями.
          </p>

          <h2 className="mt-6 text-base font-medium text-foreground">
            1. Общие положения
          </h2>
          <p>
            Агентство оказывает услуги по продвижению моделей, организации
            кастингов, съёмок и выплате вознаграждений. Отношения между
            агентством и моделью оформляются договором. Доступ в личный
            кабинет предоставляется после одобрения заявки и регистрации
            по приглашению.
          </p>

          <h2 className="mt-6 text-base font-medium text-foreground">
            2. Использование личного кабинета
          </h2>
          <p>
            Модель обязуется поддерживать актуальность данных профиля и
            портфолио, не передавать учётные данные третьим лицам и соблюдать
            конфиденциальность материалов, размещённых в системе. Агентство
            вправе приостановить или прекратить доступ при нарушении правил.
          </p>

          <h2 className="mt-6 text-base font-medium text-foreground">
            3. Выплаты и комиссии
          </h2>
          <p>
            Порядок начисления, удержания комиссии и выплат определяется
            договором и правилами агентства. Запросы на вывод обрабатываются
            в указанные сроки; при отклонении заявки средства возвращаются
            на баланс. Агентство не несёт ответственности за задержки по
            вине платёжных систем или банков.
          </p>

          <h2 className="mt-6 text-base font-medium text-foreground">
            4. Интеллектуальная собственность
          </h2>
          <p>
            Фотографии и иные материалы, загруженные моделью в портфолио,
            используются агентством исключительно в целях продвижения модели
            и подбора проектов в соответствии с договором и политикой
            конфиденциальности.
          </p>

          <h2 className="mt-6 text-base font-medium text-foreground">
            5. Изменения условий
          </h2>
          <p>
            Агентство вправе обновлять условия использования. Актуальная
            версия публикуется на сайте. Продолжение использования сервисов
            после изменений означает принятие новых условий.
          </p>

          <p className="mt-8 text-xs text-muted-foreground/80">
            По вопросам условий использования обращайтесь по контактам,
            указанным в разделе «Контакты».
          </p>
        </section>

        <p className="pt-4">
          <Link
            href="/contacts"
            className="text-sm text-primary underline-offset-4 hover:underline"
          >
            Контакты агентства →
          </Link>
        </p>
      </article>
    </main>
  );
}
