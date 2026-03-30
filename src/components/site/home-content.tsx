"use client";

import { useCallback, useRef, useState, useEffect, useActionState } from "react";
import { motion, useScroll, useTransform, useInView, animate, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormToast } from "@/components/ui/form-toast";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

type ActionResult = { status: "success" | "error"; message?: string } | null;

type HomeContentProps = {
  action: (formData: FormData) => void | Promise<void | ActionResult>;
};

/* ─── Data ─── */

const NEW_FACES = [
  {
    name: "Anna K.",
    city: "Москва",
    height: 176,
    src: "/models/new-faces/anna-k.jpg",
    segment: "Premium · Commercial",
    campaigns: 3,
    since: "2024",
    story: "До Sigma работала баристой, снималась для локальных брендов. После подписания контракта попала в кампанию ювелирного дома и digital-кампанию федерального банка. Сейчас закреплена за двумя ключевыми клиентами агентства.",
  },
  {
    name: "Daria M.",
    city: "Москва",
    height: 178,
    src: "/models/new-faces/daria-m.jpg",
    segment: "Beauty · Editorial",
    campaigns: 4,
    since: "2024",
    story: "Пришла со старыми тестами. Мы пересобрали портфолио, сделали серию clean‑beauty съёмок и представили трём партнёрским агентствам. Через полгода — несколько beauty‑кампаний и первый выход на подиум.",
  },
  {
    name: "Alina S.",
    city: "Санкт‑Петербург",
    height: 174,
    src: "/models/new-faces/alina-s.jpg",
    segment: "Fashion · Lookbook",
    campaigns: 2,
    since: "2025",
    story: "Снималась только для локальных шоурумов Петербурга. Получила доступ к московским и международным кастингам. Первый крупный проект — lookbook для европейского дизайнера в онлайн‑изданиях.",
  },
  {
    name: "Polina R.",
    city: "Казань",
    height: 180,
    src: "/models/new-faces/polina-r.jpg",
    segment: "Sport · Commercial",
    campaigns: 2,
    since: "2025",
    story: "Пришла без единой профессиональной съёмки. Сделали fashion‑тесты, отправили на закрытый кастинг спортивного бренда. Стала лицом региональной кампании и получила предложение по долгосрочному сотрудничеству.",
  },
  {
    name: "Vika L.",
    city: "Екатеринбург",
    height: 175,
    src: "/models/new-faces/vika-l.jpg",
    segment: "Editorial · Digital",
    campaigns: 5,
    since: "2024",
    story: "Работала в региональном агентстве. Пересобрали образ, сделали editorial‑съёмки, вывели на рынок Москвы. Работы регулярно появляются в онлайн‑глянце.",
  },
  {
    name: "Nika T.",
    city: "Новосибирск",
    height: 179,
    src: "/models/new-faces/nika-t.jpg",
    segment: "E‑commerce · Fashion",
    campaigns: 3,
    since: "2025",
    story: "Воспринимала моделинг как хобби. Дистанционный формат: куратор, портфолио, онлайн‑кастинги. В первый сезон — кампания для международного e‑commerce‑бренда.",
  },
];

const PARTNER_BRANDS = [
  { name: "Zara", category: "Fashion · Retail", detail: "Lookbook и рекламные кампании для российского и международного ритейла." },
  { name: "Sberbank", category: "Finance", detail: "Корпоративная и цифровая реклама, подбор лиц для федеральных кампаний." },
  { name: "L'Oréal", category: "Beauty", detail: "Beauty-съёмки и тестовые кампании в сегменте премиальной косметики." },
  { name: "Reserved", category: "Fashion", detail: "Сезонные каталоги и кампании для сети магазинов одежды." },
  { name: "T‑Bank", category: "Finance", detail: "Рекламные ролики и digital-кампании с участием моделей Sigma." },
  { name: "Gloria Jeans", category: "Fashion · Retail", detail: "Подбор типажей и съёмки для молодёжной fashion-линейки." },
];

const WHY_SIGMA = [
  { num: "01", title: "Строгий отбор", text: "Не конвейер. Работаем с теми, кто органично существует в премиальной рекламе и готов строить долгосрочную карьеру." },
  { num: "02", title: "Прозрачные финансы", text: "Баланс и история выплат в личном кабинете в реальном времени. Никаких скрытых комиссий — только договор." },
  { num: "03", title: "Кураторство", text: "Персональный менеджер, план развития портфолио и доступ к закрытым кастингам уровня федерального бренда." },
  { num: "04", title: "География", text: "Москва и пять городов присутствия. Единые стандарты работы и один уровень клиентов — везде." },
];

const STATS = [
  { value: 10, suffix: "+", label: "лет на рынке" },
  { value: 500, suffix: "+", label: "кампаний" },
  { value: 6, suffix: "", label: "городов" },
  { value: 200, suffix: "+", label: "моделей" },
];

const MARQUEE_ITEMS = [
  "Zara", "L'Oréal", "Sberbank", "Reserved", "T‑Bank", "Gloria Jeans",
  "Zara", "L'Oréal", "Sberbank", "Reserved", "T‑Bank", "Gloria Jeans",
];

const FAQ = [
  {
    q: "Как попасть в агентство?",
    a: "Заполните анкету «Стать моделью» на этой странице. Рассматриваем в течение 5–7 рабочих дней. Отвечаем только подходящим кандидатам — не беспокойтесь, если ответ придёт не сразу.",
  },
  {
    q: "Нужен ли опыт?",
    a: "Нет. Мы регулярно работаем с новыми лицами без опыта и помогаем выстроить портфолио с нуля — от тестовой съёмки до первой кампании.",
  },
  {
    q: "Есть ли вступительный взнос?",
    a: "Нет. Sigma работает исключительно по агентской схеме — комиссия только с реально закрытых проектов. Мы не берём денег «на вход».",
  },
  {
    q: "Нужно ли переезжать в Москву?",
    a: "Нет. Мы работаем с моделями дистанционно из всех городов присутствия. Для крупных проектов организуем приезд и берём логистику на себя.",
  },
  {
    q: "Возрастные ограничения?",
    a: "Принимаем от 16 лет (с согласия родителей) до 35+. Editorial и commercial-направления имеют более гибкие рамки — важен типаж, а не возраст.",
  },
  {
    q: "Как происходят выплаты?",
    a: "Вся финансовая история доступна в личном кабинете в реальном времени. Выплаты — по договору в оговорённые сроки. Никаких задержек и скрытых списаний.",
  },
];

/* ─── Animation variants ─── */

const staggerWrap = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.4, 0.25, 1] as const },
  },
};

const COLS = 3;
const DISPERSE_PX = 140;

/* ─── Animated Counter ─── */
function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, value, {
      duration: 1.8,
      ease: "easeOut",
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.round(v) + suffix;
      },
    });
    return controls.stop;
  }, [inView, value, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

/* ─── FAQ Item ─── */
function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      variants={itemVariants}
      className="border-b border-border/30 last:border-0"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="group flex w-full items-center justify-between gap-4 py-4 text-left focus-visible:outline-none"
      >
        <div className="flex items-center gap-4">
          <span className="font-condensed text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-300/40">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-sm font-medium text-foreground/90 md:text-[0.95rem]">
            {q}
          </span>
        </div>
        <span
          className={`shrink-0 text-muted-foreground/40 transition-transform duration-300 ${open ? "rotate-45" : ""}`}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-4 pl-10 text-sm leading-relaxed text-muted-foreground/70">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Section header helper ─── */
function SectionEyebrow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-px w-8 bg-gradient-to-r from-amber-400/60 to-transparent" />
      <p className="font-condensed text-[11px] font-semibold uppercase tracking-[0.42em] text-amber-300/60">
        {label}
      </p>
    </div>
  );
}

/* ─── Main component ─── */
export function HomeContent({ action }: HomeContentProps) {
  const newFacesSectionRef = useRef<HTMLElement>(null);
  const [toastStatus, setToastStatus] = useState<"success" | "error" | null>(null);
  const [toastMessage, setToastMessage] = useState<string | undefined>();

  const scrollToForm = useCallback(() => {
    document.getElementById("apply-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  /* Scroll-disperse for model cards */
  const { scrollYProgress } = useScroll({
    target: newFacesSectionRef,
    offset: ["start end", "end start"],
  });
  const disperse = useTransform(scrollYProgress, [0, 0.2, 0.45, 0.55, 0.8, 1], [0, 0.4, 1, 1, 0.4, 0]);
  const leftX = useTransform(disperse, (v) => -v * DISPERSE_PX);
  const rightX = useTransform(disperse, (v) => v * DISPERSE_PX);
  const centerScale = useTransform(disperse, (v) => 1 - v * 0.06);

  return (
    <main className="min-h-screen bg-transparent">

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden px-4 pb-14 pt-16 md:px-10 lg:px-20">
        {/* Ghost watermark */}
        <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none">
          <span className="font-condensed text-[22vw] font-bold uppercase leading-none tracking-tighter text-white/[0.025]">
            SIGMA
          </span>
        </div>

        <div className="mx-auto flex max-w-6xl flex-col gap-14 lg:flex-row lg:items-center">
          {/* Copy */}
          <motion.div
            className="relative flex-1 space-y-8"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <div className="flex items-center gap-4">
              <motion.div
                className="h-px bg-gradient-to-r from-amber-400/70 to-transparent"
                initial={{ width: 0 }}
                animate={{ width: 40 }}
                transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
              />
              <p className="font-condensed text-[11px] font-semibold uppercase tracking-[0.44em] text-amber-300/70">
                Модельное агентство · Россия
              </p>
            </div>

            <div className="space-y-1">
              {[
                { text: "Модели,", className: "text-foreground" },
                { text: "которых", className: "text-gold-shimmer" },
                { text: "запоминают.", className: "text-foreground/70" },
              ].map(({ text, className }, i) => (
                <motion.h1
                  key={text}
                  className={`block text-5xl font-light leading-[1.05] tracking-[0.06em] md:text-6xl lg:text-7xl ${className}`}
                  style={{ fontFamily: "var(--font-display), serif" }}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 + i * 0.12 }}
                >
                  {text}
                </motion.h1>
              ))}
            </div>

            <motion.p
              className="max-w-md text-sm leading-[1.9] text-muted-foreground/70 md:text-[0.95rem]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.5 }}
            >
              Закрытый пул, строгий кастинг, карьерное кураторство.
              Головной офис в Москве, филиалы в шести городах.
              Работаем с брендами от кастинга до продакшена.
            </motion.p>

            <motion.div
              className="flex flex-wrap items-center gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.62 }}
            >
              <Button
                type="button"
                onClick={scrollToForm}
                className="hero-cta-glow px-7 py-2.5 font-condensed text-[11px] font-semibold uppercase tracking-[0.3em]"
              >
                Подать анкету
              </Button>
              <Button
                type="button"
                variant="outline"
                asChild
                className="btn-outline-gold px-7 py-2.5 font-condensed text-[11px] font-medium uppercase tracking-[0.3em]"
              >
                <Link href="/invite">Вход по приглашению</Link>
              </Button>
            </motion.div>

            {/* Mini stats */}
            <motion.div
              className="flex gap-8 pt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.78 }}
            >
              {[{ v: "10+", l: "лет" }, { v: "500+", l: "кампаний" }, { v: "6", l: "городов" }].map(({ v, l }) => (
                <div key={l} className="flex flex-col gap-0.5">
                  <span className="font-condensed text-xl font-semibold tracking-tight text-amber-200/90 stat-value">
                    {v}
                  </span>
                  <span className="font-condensed text-[9px] font-medium uppercase tracking-[0.28em] text-muted-foreground/45">
                    {l}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Gallery */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.4, 0.25, 1], delay: 0.1 }}
          >
            <div className="relative h-[400px] rounded-[2rem] border border-white/10 bg-black/30 p-3 shadow-[0_0_100px_rgba(0,0,0,0.6)] md:h-[480px]">
              {/* Corner accents */}
              {["-right-px -top-px rotate-0", "-bottom-px -left-px rotate-180"].map((pos, i) => (
                <div key={i} className={`pointer-events-none absolute ${pos} h-16 w-16`}>
                  <div className="absolute right-0 top-0 h-px w-10 bg-gradient-to-l from-amber-400/40 to-transparent" />
                  <div className="absolute right-0 top-0 h-10 w-px bg-gradient-to-b from-amber-400/40 to-transparent" />
                </div>
              ))}

              <div className="grid h-full grid-cols-3 gap-2.5">
                <Dialog>
                  <DialogTrigger asChild>
                    <button type="button" className="group relative col-span-2 overflow-hidden rounded-[1.6rem] focus-visible:outline-none focus-visible:ring-0 model-card-glow">
                      <motion.div className="relative h-full w-full" initial={{ y: 20 }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: "easeOut" }}>
                        <Image src="/models/hero-1-new.jpg" alt="Модель Sigma Models — премиальное модельное агентство Москва" fill className="origin-center object-cover object-center transition-transform duration-700 group-hover:scale-105" sizes="(min-width: 1024px) 480px, 60vw" />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                        <div className="absolute bottom-4 left-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <p className="font-condensed text-[9px] font-semibold uppercase tracking-[0.32em] text-amber-200/70">Portfolio · Sigma</p>
                        </div>
                      </motion.div>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="border-border/50 bg-background/95 max-h-[92vh] overflow-hidden p-4 sm:max-w-3xl">
                    <div className="mx-auto w-full max-h-[calc(92vh-2rem)] overflow-y-auto rounded-xl bg-black">
                      <div className="relative w-full pb-[178%]"><Image src="/models/hero-1-new.jpg" alt="Портфолио модели Sigma Models — профессиональная фэшн-съёмка" fill className="object-contain" sizes="(min-width: 768px) 800px, 100vw" /></div>
                    </div>
                  </DialogContent>
                </Dialog>

                <motion.div className="col-span-1 flex flex-col gap-2.5" initial={{ y: -20 }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: "easeOut", delay: 0.08 }}>
                  {[
                    { src: "/models/hero-2-new.jpg", alt: "Модель агентства Sigma Models — beauty-съёмка" },
                    { src: "/models/hero-3-new.jpg", alt: "Модель агентства Sigma Models — editorial-съёмка" },
                  ].map(({ src, alt }) => (
                    <Dialog key={src}>
                      <DialogTrigger asChild>
                        <button type="button" className="group relative flex-1 overflow-hidden rounded-[1.3rem] focus-visible:outline-none focus-visible:ring-0 model-card-glow">
                          <Image src={src} alt={alt} fill className="origin-center object-cover object-center transition-transform duration-700 group-hover:scale-105" sizes="220px" />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="border-border/50 bg-background/95 max-h-[92vh] overflow-hidden p-4 sm:max-w-lg">
                        <div className="mx-auto w-full max-h-[calc(92vh-2rem)] overflow-y-auto rounded-xl bg-black">
                          <div className="relative w-full pb-[178%]"><Image src={src} alt={alt} fill className="object-contain" sizes="(min-width: 768px) 520px, 100vw" /></div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                </motion.div>
              </div>
              <div className="pointer-events-none absolute inset-0 rounded-[2rem] border border-white/8" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ MARQUEE ═══════════ */}
      <div className="overflow-hidden border-y border-white/6 bg-black/50 py-3">
        <div className="marquee-container">
          <div className="marquee-track flex items-center whitespace-nowrap">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((brand, i) => (
              <span key={i} className="flex items-center gap-5 px-7">
                <span className="font-condensed text-[11px] font-medium uppercase tracking-[0.38em] text-muted-foreground/40">{brand}</span>
                <span className="h-px w-3 bg-amber-400/20" />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════ NEW FACES ═══════════ */}
      <motion.section
        ref={newFacesSectionRef}
        className="px-4 pb-16 pt-14 md:px-10 lg:px-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.06 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <SectionEyebrow label="New Faces · 2026" />
              <h2 className="text-3xl font-light tracking-[0.1em] text-foreground md:text-4xl" style={{ fontFamily: "var(--font-display), serif" }}>
                Новые лица Sigma
              </h2>
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground/60">
                Таланты, прошедшие отбор и тестовую съёмку. Нажмите на карточку — история карьеры внутри.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400/70" />
              <span className="font-condensed text-[9px] font-semibold uppercase tracking-[0.32em] text-muted-foreground/55">Закрытый набор</span>
            </div>
          </div>

          <motion.div
            className="grid gap-4 sm:grid-cols-2 md:grid-cols-3"
            variants={staggerWrap}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
          >
            {NEW_FACES.map((model, index) => {
              const col = index % COLS;
              const cardX = col === 0 ? leftX : col === 2 ? rightX : undefined;
              const cardScale = col === 1 ? centerScale : undefined;
              return (
                <motion.div key={model.name} variants={itemVariants} style={{ x: cardX, scale: cardScale }}>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button type="button" className="group block w-full text-left focus-visible:outline-none focus-visible:ring-0">
                        <div className="card-noise relative overflow-hidden rounded-2xl border border-white/8 bg-black/55 model-card-glow">
                          <div className="relative h-80 overflow-hidden sm:h-80 md:h-72">
                            <Image
                              src={model.src}
                              alt={`${model.name} — модель ${model.segment}, ${model.city}, рост ${model.height} см`}
                              fill
                              className="origin-center object-cover transition-transform duration-700 group-hover:scale-105"
                              style={{ objectPosition: "50% 15%" }}
                              sizes="(min-width: 1024px) 280px, 45vw"
                            />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute right-3 top-3 rounded-full border border-white/15 bg-black/60 px-2.5 py-1 backdrop-blur-sm">
                              <span className="font-condensed text-[9px] font-semibold uppercase tracking-[0.24em] text-amber-200/70">{model.height} см</span>
                            </div>
                          </div>
                          <div className="px-4 pb-4 pt-3">
                            <div className="flex items-end justify-between">
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">{model.name}</p>
                                <p className="text-[10px] text-muted-foreground/55">{model.city}</p>
                              </div>
                              <span className="font-condensed text-[9px] font-medium uppercase tracking-[0.24em] text-amber-300/40 transition-colors duration-300 group-hover:text-amber-300/80">
                                Профиль →
                              </span>
                            </div>
                            <div className="mt-3 h-px w-0 bg-gradient-to-r from-amber-400/50 to-transparent transition-all duration-500 group-hover:w-full" />
                          </div>
                        </div>
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] overflow-y-auto border-border/50 bg-background/97 p-0 sm:max-w-xl">
                      {/* Photo */}
                      <div className="w-full overflow-hidden bg-black">
                        <div className="relative w-full pb-[120%]">
                          <Image src={model.src} alt={`${model.name} — портфолио модели Sigma Models, ${model.city}`} fill className="object-cover object-top" sizes="(min-width: 768px) 520px, 100vw" />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          {/* Overlay name */}
                          <div className="absolute bottom-5 left-6">
                            <p className="font-condensed text-[10px] font-semibold uppercase tracking-[0.32em] text-amber-300/70">{model.segment}</p>
                            <h3 className="mt-1 text-2xl font-light tracking-[0.14em] text-foreground" style={{ fontFamily: "var(--font-display), serif" }}>{model.name}</h3>
                          </div>
                        </div>
                      </div>
                      {/* Info grid */}
                      <div className="p-6 space-y-5">
                        <div className="grid grid-cols-3 gap-3 border border-border/30 rounded-xl p-4 bg-white/[0.02]">
                          {[
                            { label: "Город", value: model.city },
                            { label: "Рост", value: `${model.height} см` },
                            { label: "Кампаний", value: `${model.campaigns}` },
                          ].map(({ label, value }) => (
                            <div key={label} className="text-center space-y-1">
                              <p className="font-condensed text-[9px] font-semibold uppercase tracking-[0.24em] text-muted-foreground/45">{label}</p>
                              <p className="text-sm font-semibold text-foreground">{value}</p>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-px w-5 bg-amber-400/40" />
                          <p className="font-condensed text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-300/60">В агентстве с {model.since}</p>
                        </div>
                        <p className="text-sm leading-[1.85] text-muted-foreground/70">{model.story}</p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* ═══════════ WHY SIGMA ═══════════ */}
      <motion.section
        className="relative overflow-hidden border-y border-border/25 px-4 py-16 md:px-10 lg:px-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.08 }}
        transition={{ duration: 0.6 }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-400/[0.03] via-transparent to-blue-900/[0.04]" />
        <div className="mx-auto max-w-6xl space-y-10">
          <div className="space-y-3">
            <SectionEyebrow label="Почему Sigma" />
            <h2 className="text-3xl font-light tracking-[0.1em] text-foreground md:text-4xl" style={{ fontFamily: "var(--font-display), serif" }}>
              Не массовый подход.
              <br />
              <em className="not-italic text-muted-foreground/50">Точечная работа.</em>
            </h2>
          </div>
          <motion.div
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            variants={staggerWrap}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.06 }}
          >
            {WHY_SIGMA.map((item) => (
              <motion.div
                key={item.title}
                variants={itemVariants}
                className="why-card-line group relative flex flex-col gap-4 rounded-2xl border border-border/35 bg-card/25 px-5 py-5 transition-all duration-350 hover:border-amber-400/20 hover:bg-card/45"
              >
                <span className="font-condensed text-[2.8rem] font-bold leading-none text-white/[0.05] transition-colors duration-300 group-hover:text-amber-400/8 select-none">
                  {item.num}
                </span>
                <div className="space-y-2">
                  <p className="font-condensed text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground">
                    {item.title}
                  </p>
                  <p className="text-xs leading-relaxed text-muted-foreground/60">
                    {item.text}
                  </p>
                </div>
                <div className="absolute right-4 top-4 h-1 w-1 rounded-full bg-amber-400/25 transition-all duration-300 group-hover:bg-amber-400/55 group-hover:shadow-[0_0_6px_rgba(240,201,106,0.4)]" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ═══════════ STATS ═══════════ */}
      <motion.section
        className="px-4 py-14 md:px-10 lg:px-20"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-border/25 bg-border/20 gap-px lg:grid-cols-4">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="flex flex-col items-center gap-2 bg-background/55 px-6 py-8 text-center"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <span
                  className="text-4xl font-light tracking-tight text-amber-200/90 stat-value md:text-5xl"
                  style={{ fontFamily: "var(--font-display), serif" }}
                >
                  <Counter value={stat.value} suffix={stat.suffix} />
                </span>
                <span className="font-condensed text-[9px] font-semibold uppercase tracking-[0.32em] text-muted-foreground/45">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ═══════════ BRANDS ═══════════ */}
      <motion.section
        className="border-t border-border/25 px-4 pb-16 pt-14 md:px-10 lg:px-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.06 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <SectionEyebrow label="Партнёры и бренды" />
              <h2 className="text-3xl font-light tracking-[0.1em] text-foreground md:text-4xl" style={{ fontFamily: "var(--font-display), serif" }}>
                С кем мы работаем
              </h2>
            </div>
            <p className="max-w-xs text-xs leading-relaxed text-muted-foreground/50 sm:text-right">
              Нажмите на бренд — подробности о сотрудничестве.
            </p>
          </div>
          <motion.div
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
            variants={staggerWrap}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
          >
            {PARTNER_BRANDS.map((brand) => (
              <motion.div key={brand.name} variants={itemVariants}>
                <Dialog>
                  <DialogTrigger asChild>
                    <button type="button" className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                      <div className="brand-badge group relative overflow-hidden rounded-2xl border border-border/30 bg-black/35 px-5 py-4">
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-400/0 to-amber-400/0 transition-all duration-500 group-hover:from-amber-400/4 group-hover:to-transparent" />
                        <div className="relative flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="font-condensed text-sm font-semibold uppercase tracking-[0.24em] text-amber-100/85">{brand.name}</p>
                            <p className="font-condensed text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/45">{brand.category}</p>
                          </div>
                          <span className="text-[10px] text-muted-foreground/25 transition-all duration-300 group-hover:text-amber-300/60">→</span>
                        </div>
                        <div className="mt-3 h-px w-0 bg-gradient-to-r from-amber-400/40 to-transparent transition-all duration-400 group-hover:w-full" />
                      </div>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="border-border/50 bg-background/97 p-6 sm:max-w-md">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-px w-5 bg-amber-400/50" />
                        <p className="font-condensed text-[10px] font-semibold uppercase tracking-[0.3em] text-amber-300/60">{brand.category}</p>
                      </div>
                      <h3 className="text-2xl font-light tracking-tight text-foreground" style={{ fontFamily: "var(--font-display), serif" }}>{brand.name}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground/70">{brand.detail}</p>
                    </div>
                  </DialogContent>
                </Dialog>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ═══════════ GEOGRAPHY ═══════════ */}
      <section className="border-y border-border/20 bg-black/55 px-4 py-4 md:px-10 lg:px-20">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-5 md:justify-between">
          {["Москва", "Санкт‑Петербург", "Казань", "Екатеринбург", "Новосибирск", "Сочи"].map((city, i, arr) => (
            <span key={city} className="flex items-center gap-5">
              <span className="font-condensed text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground/40">{city}</span>
              {i < arr.length - 1 && <span className="hidden h-px w-4 bg-border/35 md:inline-block" />}
            </span>
          ))}
          <a href="/branches" className="font-condensed text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-300/55 underline-offset-4 transition-colors hover:text-amber-200/90 hover:underline">
            Все филиалы →
          </a>
        </div>
      </section>

      {/* ═══════════ FAQ ═══════════ */}
      <motion.section
        className="px-4 py-16 md:px-10 lg:px-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.06 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 md:grid-cols-[1fr_1.8fr]">
            <div className="space-y-4">
              <SectionEyebrow label="Вопросы и ответы" />
              <h2 className="text-3xl font-light tracking-[0.1em] text-foreground md:text-4xl" style={{ fontFamily: "var(--font-display), serif" }}>
                Частые
                <br />
                <em className="not-italic text-muted-foreground/50">вопросы</em>
              </h2>
              <p className="text-xs leading-relaxed text-muted-foreground/55">
                Не нашли ответ — напишите нам на{" "}
                <a href="mailto:sigma-models@mail.ru" className="text-amber-300/70 underline-offset-4 hover:underline">
                  sigma-models@mail.ru
                </a>
              </p>
            </div>
            <motion.div
              className="divide-y divide-border/25"
              variants={staggerWrap}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.05 }}
            >
              {FAQ.map((item, i) => (
                <FaqItem key={item.q} q={item.q} a={item.a} index={i} />
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ═══════════ APPLY FORM ═══════════ */}
      <section id="apply-form" className="relative overflow-hidden border-t border-border/20 px-4 py-16 md:px-10 lg:px-20">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#1a1408] via-[#0e0e14] to-[#0b0b12]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(240,201,106,0.08),transparent)]" />

        <div className="relative mx-auto grid max-w-6xl gap-12 md:grid-cols-[1fr_1.5fr]">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="space-y-3">
              <SectionEyebrow label="Анкета модели" />
              <h2 className="text-4xl font-light tracking-[0.08em] text-foreground md:text-5xl" style={{ fontFamily: "var(--font-display), serif" }}>
                Стать моделью
                <br />
                <span className="text-gold-shimmer italic">Sigma</span>
              </h2>
            </div>
            <p className="text-sm leading-[1.9] text-muted-foreground/60">
              Рассматриваем анкеты выборочно. Указывайте реальные параметры
              и прикрепляйте актуальные фото. Связываемся только с теми,
              чей типаж подходит под запросы клиентов агентства.
            </p>
            <div className="space-y-3 pt-2">
              {["Заполните анкету с реальными данными", "Рассматриваем 5–7 рабочих дней", "Подходящие получают приглашение"].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-amber-400/25 font-condensed text-[9px] font-semibold text-amber-300/55">
                    {i + 1}
                  </span>
                  <p className="text-xs leading-relaxed text-muted-foreground/50">{step}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="gradient-border rounded-2xl bg-white/[0.03] p-px"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="rounded-2xl bg-black/50 p-6 backdrop-blur-sm">
              <ApplyForm action={action} onResult={(status, message) => { setToastStatus(status); setToastMessage(message); }} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Global toast */}
      <FormToast status={toastStatus} message={toastMessage} onDismiss={() => setToastStatus(null)} />
    </main>
  );
}

/* ─── Apply Form with useActionState ─── */
function ApplyForm({
  action,
  onResult,
}: {
  action: HomeContentProps["action"];
  onResult: (status: "success" | "error", message?: string) => void;
}) {
  const wrappedAction = async (
    _prevState: ActionResult,
    formData: FormData,
  ): Promise<ActionResult> => {
    const result = await action(formData);
    const r = result as ActionResult ?? { status: "success" };
    onResult(r?.status ?? "success", r?.message);
    return r;
  };

  const [state, formAction, isPending] = useActionState(wrappedAction, null);

  return (
    <form action={formAction} className="space-y-4 text-sm">
      <div className="grid gap-3.5">
        <Field id="fullName" label="Имя и фамилия" placeholder="Например: Анна Иванова" required />
        <div className="grid grid-cols-2 gap-3">
          <Field id="age" label="Возраст" type="number" min={14} max={40} required />
          <Field id="height" label="Рост, см" type="number" min={150} max={200} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field id="parameters" label="Параметры (ОГБ)" placeholder="83–60–90" required />
          <Field id="city" label="Город" placeholder="Ваш город" required />
        </div>
        <Field id="email" label="Email" type="email" placeholder="Контактный email" required />
        <div className="space-y-1.5">
          <Label htmlFor="photos" className="font-condensed text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/60">
            Ссылки на фото
          </Label>
          <Textarea
            id="photos"
            name="photos"
            required
            placeholder="VK, Instagram*, облако — любые ссылки на актуальные фото"
            className="min-h-[80px] resize-none border-white/10 bg-white/5 text-foreground placeholder:text-muted-foreground/25 focus:border-amber-400/30"
          />
        </div>
      </div>

      {/* Error state inline */}
      <AnimatePresence>
        {state?.status === "error" && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-red-400/80"
          >
            {state.message}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="space-y-3 pt-1">
        <Button
          type="submit"
          disabled={isPending}
          className="hero-cta-glow w-full py-3 font-condensed text-[11px] font-semibold uppercase tracking-[0.3em] disabled:opacity-60"
        >
          {isPending ? "Отправка…" : "Отправить анкету"}
        </Button>
        <p className="text-center font-condensed text-[9px] uppercase tracking-[0.18em] leading-relaxed text-muted-foreground/30">
          Отправляя анкету, вы соглашаетесь на обработку персональных данных.
        </p>
      </div>
    </form>
  );
}

/* ─── Reusable form field ─── */
function Field({
  id,
  label,
  type = "text",
  placeholder,
  required,
  min,
  max,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="font-condensed text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/60">
        {label}
      </Label>
      <Input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        className="border-white/10 bg-white/5 text-foreground placeholder:text-muted-foreground/25 focus:border-amber-400/30 focus:ring-amber-400/10"
      />
    </div>
  );
}
