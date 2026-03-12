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

const CONTACTS = [
  {
    label: "Головной офис · Москва",
    address: "ул. Большая Никитская, 15, офис 7",
    items: [
      { dt: "Общий email", dd: "sigma-models@mail.ru", href: "mailto:sigma-models@mail.ru" },
      { dt: "Коммерческие запросы", dd: "booking@sigma-models.ru", href: "mailto:booking@sigma-models.ru" },
      { dt: "Телефон", dd: "+7 (495) 900‑45‑21", href: "tel:+74959004521" },
    ],
    hours: "Пн–Пт, 10:00–19:00 МСК",
    note: "Приём по предварительной записи.",
  },
  {
    label: "Кастинг и продакшен",
    address: null,
    items: [
      { dt: "Email кастинга", dd: "casting@sigma-models.ru", href: "mailto:casting@sigma-models.ru" },
      { dt: "Кастинг‑директор", dd: "+7 (495) 900‑45‑22", href: "tel:+74959004522" },
    ],
    hours: "Пн–Пт, 11:00–18:00 МСК",
    note: "Подбор типажей, организация кастингов, продакшен‑поддержка. Ответ в течение 1–2 рабочих дней.",
  },
];

export function ContactsContent() {
  return (
    <main className="min-h-screen px-4 py-16 md:px-10 lg:px-20">
      <div className="mx-auto max-w-4xl space-y-16">

        {/* ─── Hero ─── */}
        <motion.header
          className="space-y-5"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Eyebrow label="Связь с агентством" />
          <h1
            className="text-4xl font-light leading-[1.1] tracking-[0.06em] text-foreground md:text-5xl"
            style={{ fontFamily: "var(--font-display), serif" }}
          >
            Контакты
            <br />
            <span className="text-muted-foreground/50 italic">Sigma Models</span>
          </h1>
          <p className="max-w-xl text-base leading-[1.85] text-muted-foreground/65">
            Открыты к диалогу с брендами, продюсерами и медиа.
            Модели агентства решают вопросы через личный кабинет и куратора.
          </p>
        </motion.header>

        {/* ─── Contact cards ─── */}
        <motion.section
          className="grid gap-4 sm:grid-cols-2"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {CONTACTS.map((block) => (
            <motion.div
              key={block.label}
              variants={fadeUp}
              className="why-card-line group relative overflow-hidden rounded-2xl border border-border/35 bg-black/40 p-6 transition-all duration-350 hover:border-amber-400/20"
            >
              {/* Gold dot */}
              <div className="absolute right-5 top-5 h-1 w-1 rounded-full bg-amber-400/25 transition-all duration-300 group-hover:bg-amber-400/55 group-hover:shadow-[0_0_6px_rgba(240,201,106,0.4)]" />

              <div className="space-y-5">
                <div className="space-y-1">
                  <p className="font-condensed text-[10px] font-semibold uppercase tracking-[0.3em] text-amber-300/55">
                    {block.label}
                  </p>
                  {block.address && (
                    <p className="text-sm font-medium text-foreground">{block.address}</p>
                  )}
                  {block.note && (
                    <p className="text-xs leading-relaxed text-muted-foreground/55">{block.note}</p>
                  )}
                </div>

                <dl className="space-y-3">
                  {block.items.map(({ dt, dd, href }) => (
                    <div key={dt} className="flex flex-col gap-0.5">
                      <dt className="font-condensed text-[9px] font-semibold uppercase tracking-[0.24em] text-muted-foreground/40">
                        {dt}
                      </dt>
                      <dd>
                        <a
                          href={href}
                          className="text-sm text-amber-200/80 underline-offset-4 transition-colors hover:text-amber-100 hover:underline"
                        >
                          {dd}
                        </a>
                      </dd>
                    </div>
                  ))}
                </dl>

                <p className="font-condensed text-[9px] font-medium uppercase tracking-[0.22em] text-muted-foreground/35">
                  {block.hours}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.section>

        {/* ─── For models ─── */}
        <motion.section
          className="space-y-5 border-t border-border/25 pt-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6 }}
        >
          <Eyebrow label="Для моделей агентства" />
          <motion.div
            className="grid gap-4 md:grid-cols-2"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                title: "Уже работаете с Sigma?",
                body: "Используйте личный кабинет для обновления портфолио и параметров. Вопросы по выплатам и договорам — через персонального менеджера.",
                link: { href: "/login", label: "Войти в личный кабинет" },
              },
              {
                title: "Хотите стать моделью?",
                body: "Анкеты принимаются только через форму на главной странице. После рассмотрения свяжемся с отобранными кандидатами.",
                link: { href: "/#apply-form", label: "Заполнить анкету" },
              },
            ].map(({ title, body, link }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="space-y-3 rounded-xl border border-border/25 bg-white/[0.02] p-5"
              >
                <p className="font-condensed text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">
                  {title}
                </p>
                <p className="text-xs leading-[1.85] text-muted-foreground/60">{body}</p>
                <a
                  href={link.href}
                  className="inline-flex items-center gap-2 font-condensed text-[10px] font-semibold uppercase tracking-[0.24em] text-amber-300/65 underline-offset-4 transition-colors hover:text-amber-200/90 hover:underline"
                >
                  <span className="h-px w-3 bg-amber-400/40" />
                  {link.label}
                </a>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* ─── Press ─── */}
        <motion.section
          className="rounded-2xl border border-border/25 bg-black/35 p-5"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-condensed text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-300/50">
            Пресса и партнёры
          </p>
          <p className="mt-2 text-sm leading-[1.85] text-muted-foreground/60">
            Для запросов от СМИ, коллабораций и партнёрских программ пишите на{" "}
            <a href="mailto:sigma-models@mail.ru" className="text-amber-200/75 underline-offset-4 hover:underline">
              sigma-models@mail.ru
            </a>{" "}
            с пометкой темы в заголовке. Отвечаем в приоритетном порядке.
          </p>
        </motion.section>
      </div>
    </main>
  );
}
