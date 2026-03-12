"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] as const } },
};

function Eyebrow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-px w-8 bg-gradient-to-r from-amber-400/60 to-transparent" />
      <p className="font-condensed text-[11px] font-semibold uppercase tracking-[0.42em] text-amber-300/60">{label}</p>
    </div>
  );
}

const DIFFERENTIATORS = [
  {
    title: "Строгий отбор — не массовый набор",
    text: "Мы рассматриваем анкеты выборочно и не работаем по конвейерной схеме. В фокусе — лица, которые органично существуют в премиальной рекламе. Каждая модель проходит личное собеседование и тестовую съёмку.",
  },
  {
    title: "Прозрачные финансы",
    text: "Для каждой модели ведётся баланс, история начислений и запросов на вывод. Всё доступно в личном кабинете в реальном времени. Никаких скрытых комиссий — работаем по договору.",
  },
  {
    title: "Бренды уровня премиум и люкс",
    text: "Долгосрочные отношения с ювелирными домами, fashion-брендами и федеральными медиа. От подбора типажей до продакшен-поддержки — сопровождаем кампании под ключ.",
  },
  {
    title: "Карьера под кураторством",
    text: "Персональный куратор: помощь в формировании портфолио, подготовка к кастингам, развитие в направлении editorial, commercial или runway. Инвестируем в людей.",
  },
];

export function AboutContent() {
  return (
    <main className="min-h-screen px-4 py-16 md:px-10 lg:px-20">
      <div className="mx-auto max-w-4xl space-y-20">

        {/* ─── Hero ─── */}
        <motion.header
          className="space-y-6"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
        >
          <Eyebrow label="Модельное агентство полного цикла" />
          <h1
            className="text-4xl font-light leading-[1.1] tracking-[0.06em] text-foreground md:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-display), serif" }}
          >
            Агентство
            <br />
            <span className="text-gold-shimmer italic">не для всех.</span>
          </h1>
          <p className="max-w-2xl text-base leading-[1.85] text-muted-foreground/70 md:text-lg">
            Мы не гонимся за количеством — выстраиваем долгосрочные карьеры
            и доверительные отношения с брендами. Один сильный типаж
            ценнее десятка случайных кастингов.
          </p>
        </motion.header>

        {/* ─── Stats ─── */}
        <motion.section
          className="grid gap-px overflow-hidden rounded-2xl border border-border/25 bg-border/20 sm:grid-cols-3"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {[
            { value: "10+", label: "лет на рынке премиального моделинга" },
            { value: "500+", label: "успешных кампаний с федеральными и международными брендами" },
            { value: "6", label: "городов присутствия и партнёрская сеть по России" },
          ].map(({ value, label }) => (
            <motion.div
              key={value}
              variants={fadeUp}
              className="flex flex-col justify-between bg-background/55 px-6 py-7"
            >
              <span
                className="text-4xl font-light text-amber-200/90 stat-value md:text-5xl"
                style={{ fontFamily: "var(--font-display), serif" }}
              >
                {value}
              </span>
              <span className="mt-3 font-condensed text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground/50">
                {label}
              </span>
            </motion.div>
          ))}
        </motion.section>

        {/* ─── Mission ─── */}
        <motion.section
          className="space-y-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6 }}
        >
          <Eyebrow label="Миссия и философия" />
          <h2
            className="text-2xl font-light tracking-[0.08em] text-foreground md:text-3xl"
            style={{ fontFamily: "var(--font-display), serif" }}
          >
            Профессия высшей лиги
          </h2>
          <div className="space-y-4 text-sm leading-[1.9] text-muted-foreground/70 md:text-base">
            <p>
              Sigma Models создана для тех, кто воспринимает модельный бизнес как
              серьёзную профессию. Мы совмещаем строгий европейский подход к кастингу
              с глубоким пониманием российского рынка. Наша команда — продюсеры,
              букеры и кастинг-директора с опытом работы в Москве, Милане и Париже.
            </p>
            <p>
              Вход в систему — только по приглашению агентства или после одобрения
              анкеты. Это позволяет сохранять высокий уровень пула и репутацию
              бренда Sigma в глазах клиентов.
            </p>
          </div>
        </motion.section>

        {/* ─── Differentiators ─── */}
        <motion.section
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 0.6 }}
        >
          <Eyebrow label="Что отличает нас" />
          <motion.ul
            className="space-y-0 divide-y divide-border/25"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.06 }}
          >
            {DIFFERENTIATORS.map((item, i) => (
              <motion.li key={item.title} variants={fadeUp} className="group flex gap-5 py-6">
                <span className="font-condensed mt-0.5 shrink-0 text-[11px] font-semibold text-amber-300/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="space-y-2">
                  <p className="font-condensed text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">
                    {item.title}
                  </p>
                  <p className="text-sm leading-[1.85] text-muted-foreground/65">
                    {item.text}
                  </p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </motion.section>

        {/* ─── CTA ─── */}
        <motion.section
          className="flex flex-col items-start gap-4 border-t border-border/30 pt-12 sm:flex-row sm:items-center sm:justify-between"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">Хотите стать частью Sigma?</p>
            <p className="text-xs text-muted-foreground/55">Анкеты рассматриваются выборочно.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/#apply-form"
              className="hero-cta-glow inline-flex items-center rounded-full bg-primary px-6 py-2.5 font-condensed text-[10px] font-semibold uppercase tracking-[0.28em] text-primary-foreground transition-all"
            >
              Подать анкету
            </Link>
            <Link
              href="/contacts"
              className="btn-outline-gold inline-flex items-center rounded-full px-6 py-2.5 font-condensed text-[10px] font-medium uppercase tracking-[0.28em] text-foreground"
            >
              Контакты
            </Link>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
