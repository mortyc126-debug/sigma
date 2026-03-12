"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, animate } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

type HomeContentProps = {
  action: (formData: FormData) => void | Promise<void | { status?: string; message?: string }>;
};

const NEW_FACES = [
  {
    name: "Anna K.",
    city: "Москва",
    height: 176,
    src: "/models/new-faces/anna-k.jpg",
    story:
      "До Sigma Models Анна работала баристой в небольшом кафе в центре Москвы и снималась только для локальных брендов одежды. После подписания контракта она попала в первую кампанию для ювелирного дома, а затем снялась в digital‑кампании федерального банка. Сейчас Анна закреплена за двумя ключевыми клиентами Sigma и строит портфолио в премиальном сегменте.",
  },
  {
    name: "Daria M.",
    city: "Москва",
    height: 178,
    src: "/models/new-faces/daria-m.jpg",
    story:
      "Дарья пришла в Sigma Models со старыми тестами и скептическим отношением к индустрии. Мы полностью пересобрали её портфолио, сделали серию clean‑beauty съёмок и представили трём агентствам‑партнёрам. Уже через полгода Дарья закрыла несколько beauty‑кампаний и впервые вышла на подиум в рамках столичного fashion‑показа.",
  },
  {
    name: "Alina S.",
    city: "Санкт‑Петербург",
    height: 174,
    src: "/models/new-faces/alina-s.jpg",
    story:
      "Алина долгое время снималась только для локальных шоурумов Петербурга. С Sigma Models она получила доступ к кастингам московских и международных брендов, а её первый крупный проект стал lookbook для европейского дизайнера, который вышел в онлайн‑изданиях. Сейчас Алина совмещает учёбу в вузе и регулярные съёмки для премиальных клиентов агентства.",
  },
  {
    name: "Polina R.",
    city: "Казань",
    height: 180,
    src: "/models/new-faces/polina-r.jpg",
    story:
      "Полина пришла в агентство на стадии нового лица без единой профессиональной съёмки. Мы сделали для неё сильные fashion‑тесты, разработали план развития и отправили на закрытый кастинг крупного спортивного бренда. В итоге Полина стала лицом региональной кампании и получила предложение по долгосрочному сотрудничеству.",
  },
  {
    name: "Vika L.",
    city: "Екатеринбург",
    height: 175,
    src: "/models/new-faces/vika-l.jpg",
    story:
      "Вика работала в региональном агентстве и не видела себя в премиальном сегменте. После перехода в Sigma Models мы пересобрали её образ, сделали серию контрастных editorial‑съёмок и вывели её на рынок Москвы. Сейчас её работы регулярно появляются в онлайн‑глянце, а география проектов расширилась от Екатеринбурга до столицы.",
  },
  {
    name: "Nika T.",
    city: "Новосибирск",
    height: 179,
    src: "/models/new-faces/nika-t.jpg",
    story:
      "Ника жила в Новосибирске и воспринимала моделинг как хобби. Sigma Models предложило ей дистанционный формат сотрудничества: куратор, обновление портфолио и доступ к онлайн‑кастингам. Уже в первый сезон Ника приняла участие в кампании для международного e‑commerce‑бренда, а дальше начала регулярно прилетать на съёмки в Москву.",
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
  {
    num: "01",
    title: "Строгий отбор",
    text: "Работаем только с теми, кто подходит под премиальный сегмент и готов к долгосрочной карьере.",
  },
  {
    num: "02",
    title: "Прозрачные условия",
    text: "Баланс, выплаты и история операций в личном кабинете. Никаких скрытых комиссий.",
  },
  {
    num: "03",
    title: "Кураторство карьеры",
    text: "Персональный менеджер, план развития портфолио и доступ к кастингам уровня бренда.",
  },
  {
    num: "04",
    title: "География",
    text: "Головной офис в Москве и филиалы в ключевых городах России. Единые стандарты везде.",
  },
];

const STATS = [
  { value: 10, suffix: "+", label: "лет на рынке" },
  { value: 500, suffix: "+", label: "кампаний" },
  { value: 6, suffix: "", label: "городов России" },
  { value: 200, suffix: "+", label: "моделей" },
];

const MARQUEE_BRANDS = [
  "Zara", "L'Oréal", "Sberbank", "Reserved", "T‑Bank", "Gloria Jeans",
  "Zara", "L'Oréal", "Sberbank", "Reserved", "T‑Bank", "Gloria Jeans",
];

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

/* ─────────────────── Animated Counter ─────────────────── */
function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, value, {
      duration: 1.8,
      ease: "easeOut",
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.round(v).toString() + suffix;
      },
    });
    return controls.stop;
  }, [inView, value, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

/* ─────────────────── Home Content ─────────────────── */
export function HomeContent({ action }: HomeContentProps) {
  const newFacesSectionRef = useRef<HTMLElement>(null);

  const scrollToForm = useCallback(() => {
    const el = document.getElementById("apply-form");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const { scrollYProgress } = useScroll({
    target: newFacesSectionRef,
    offset: ["start end", "end start"],
  });
  const disperse = useTransform(
    scrollYProgress,
    [0, 0.2, 0.45, 0.55, 0.8, 1],
    [0, 0.4, 1, 1, 0.4, 0],
  );
  const leftX = useTransform(disperse, (v) => -v * DISPERSE_PX);
  const rightX = useTransform(disperse, (v) => v * DISPERSE_PX);
  const centerScale = useTransform(disperse, (v) => 1 - v * 0.06);

  return (
    <main className="min-h-screen bg-transparent">

      {/* ═══════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-4 pb-14 pt-16 md:px-10 lg:px-20">
        {/* Giant ghost background text */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none"
        >
          <span
            className="text-[22vw] font-bold uppercase leading-none tracking-tighter text-white/[0.022]"
            style={{ fontFamily: "var(--font-display), serif" }}
          >
            SIGMA
          </span>
        </div>

        <div className="mx-auto flex max-w-6xl flex-col gap-14 lg:flex-row lg:items-center">
          {/* LEFT — copy */}
          <motion.div
            className="relative flex-1 space-y-8"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          >
            {/* Eyebrow with animated line */}
            <div className="flex items-center gap-4">
              <motion.div
                className="h-px bg-gradient-to-r from-amber-400/70 to-transparent"
                initial={{ width: 0 }}
                animate={{ width: 40 }}
                transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
              />
              <p className="text-[10px] uppercase tracking-[0.42em] text-amber-300/70">
                Модельное агентство · Россия
              </p>
            </div>

            {/* Main headline */}
            <div className="space-y-3">
              <h1
                className="text-4xl font-medium leading-[1.08] tracking-[0.16em] md:text-5xl lg:text-[3.6rem]"
                style={{ fontFamily: "var(--font-display), serif" }}
              >
                <motion.span
                  className="block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                >
                  Премиальные
                </motion.span>
                <motion.span
                  className="text-gold-shimmer block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.22 }}
                >
                  модели
                </motion.span>
                <motion.span
                  className="block text-foreground/80"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.34 }}
                >
                  для брендов
                </motion.span>
                <motion.span
                  className="block text-muted-foreground/60"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.44 }}
                  style={{ fontSize: "0.55em", letterSpacing: "0.28em" }}
                >
                  уровня 2026 года
                </motion.span>
              </h1>
            </div>

            <motion.p
              className="max-w-md text-sm leading-[1.85] text-muted-foreground/80 md:text-[0.95rem]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.55 }}
            >
              Sigma Models — одно из ведущих модельных агентств России.
              Закрытый пул, головной офис в Москве, филиалы в шести городах.
              Отбираем модели точечно, сопровождаем карьеру кураторами и ведём
              проекты с брендами от кастинга до продакшена.
            </motion.p>

            <motion.div
              className="flex flex-wrap items-center gap-3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65 }}
            >
              <Button
                type="button"
                onClick={scrollToForm}
                className="hero-cta-glow px-7 py-2.5 text-[10px] font-semibold uppercase tracking-[0.28em]"
              >
                Анкета модели
              </Button>
              <Button
                type="button"
                variant="outline"
                asChild
                className="btn-outline-gold px-7 py-2.5 text-[10px] font-medium uppercase tracking-[0.28em]"
              >
                <Link href="/invite">Вход по приглашению</Link>
              </Button>
            </motion.div>

            {/* Mini stat strip */}
            <motion.div
              className="flex gap-8 pt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.8 }}
            >
              {[
                { v: "10+", l: "лет" },
                { v: "500+", l: "кампаний" },
                { v: "6", l: "городов" },
              ].map(({ v, l }) => (
                <div key={l} className="flex flex-col gap-0.5">
                  <span className="text-lg font-semibold tracking-tight text-amber-200/90 stat-value">
                    {v}
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.26em] text-muted-foreground/50">
                    {l}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT — gallery mosaic */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.4, 0.25, 1], delay: 0.1 }}
          >
            <div className="relative h-[400px] rounded-[2rem] border border-white/10 bg-black/30 p-3 shadow-[0_0_80px_rgba(0,0,0,0.5)] md:h-[460px]">
              {/* Decorative corner accent */}
              <div className="pointer-events-none absolute -right-px -top-px h-16 w-16">
                <div className="absolute right-0 top-0 h-px w-10 bg-gradient-to-l from-amber-400/40 to-transparent" />
                <div className="absolute right-0 top-0 h-10 w-px bg-gradient-to-b from-amber-400/40 to-transparent" />
              </div>
              <div className="pointer-events-none absolute -bottom-px -left-px h-16 w-16">
                <div className="absolute bottom-0 left-0 h-px w-10 bg-gradient-to-r from-amber-400/30 to-transparent" />
                <div className="absolute bottom-0 left-0 h-10 w-px bg-gradient-to-t from-amber-400/30 to-transparent" />
              </div>

              <div className="grid h-full grid-cols-3 gap-2.5">
                {/* Large image */}
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="group relative col-span-2 overflow-hidden rounded-[1.6rem] focus-visible:outline-none focus-visible:ring-0 model-card-glow"
                    >
                      <motion.div
                        className="relative h-full w-full"
                        initial={{ y: 20 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 1.1, ease: "easeOut" }}
                      >
                        <Image
                          src="/models/hero-1-new.jpg"
                          alt="Sigma Models — модель"
                          fill
                          className="origin-center object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
                          sizes="(min-width: 1024px) 480px, 60vw"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                        <div className="absolute bottom-4 left-4 space-y-0.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <p className="text-[9px] uppercase tracking-[0.28em] text-amber-200/70">Portfolio</p>
                          <p className="text-xs font-medium tracking-[0.16em] text-white">Sigma Models</p>
                        </div>
                      </motion.div>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="border-border/50 bg-background/95 max-h-[92vh] overflow-hidden p-4 sm:max-w-3xl">
                    <div className="mx-auto w-full max-h-[calc(92vh-2rem)] overflow-y-auto rounded-xl bg-black">
                      <div className="relative w-full min-h-[70vh] pb-[178%]">
                        <Image src="/models/hero-1-new.jpg" alt="Sigma Models — портфолио" fill className="object-contain" sizes="(min-width: 768px) 800px, 100vw" />
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Two stacked small images */}
                <motion.div
                  className="col-span-1 flex flex-col gap-2.5"
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.1, ease: "easeOut", delay: 0.08 }}
                >
                  {[
                    { src: "/models/hero-2-new.jpg", key: "hero2" },
                    { src: "/models/hero-3-new.jpg", key: "hero3" },
                  ].map(({ src, key }) => (
                    <Dialog key={key}>
                      <DialogTrigger asChild>
                        <button
                          type="button"
                          className="group relative flex-1 overflow-hidden rounded-[1.3rem] focus-visible:outline-none focus-visible:ring-0 model-card-glow"
                        >
                          <Image
                            src={src}
                            alt="Sigma Models — портфолио"
                            fill
                            className="origin-center object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
                            sizes="220px"
                          />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="border-border/50 bg-background/95 max-h-[92vh] overflow-hidden p-4 sm:max-w-lg">
                        <div className="mx-auto w-full max-h-[calc(92vh-2rem)] overflow-y-auto rounded-xl bg-black">
                          <div className="relative w-full min-h-[70vh] pb-[178%]">
                            <Image src={src} alt="Sigma Models — портфолио" fill className="object-contain" sizes="(min-width: 768px) 520px, 100vw" />
                          </div>
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

      {/* ═══════════════════════════════════════════
          MARQUEE BRAND TICKER
      ═══════════════════════════════════════════ */}
      <div className="border-y border-white/6 bg-black/50 py-3 overflow-hidden">
        <div className="marquee-container">
          <div className="marquee-track flex items-center gap-0 whitespace-nowrap">
            {[...MARQUEE_BRANDS, ...MARQUEE_BRANDS].map((brand, i) => (
              <span key={i} className="flex items-center gap-6 px-8">
                <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-muted-foreground/50">
                  {brand}
                </span>
                <span className="h-px w-4 bg-amber-400/20" />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          NEW FACES
      ═══════════════════════════════════════════ */}
      <motion.section
        ref={newFacesSectionRef}
        className="px-4 pb-16 pt-14 md:px-10 lg:px-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.06 }}
        transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
      >
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Section header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="h-px w-8 bg-gradient-to-r from-amber-400/60 to-transparent" />
                <p className="text-[10px] uppercase tracking-[0.38em] text-amber-300/60">
                  New Faces · 2026
                </p>
              </div>
              <h2
                className="text-2xl font-medium tracking-[0.14em] text-foreground md:text-3xl"
                style={{ fontFamily: "var(--font-display), serif" }}
              >
                Новые лица Sigma
              </h2>
              <p className="max-w-md text-xs leading-relaxed text-muted-foreground/70 md:text-sm">
                Таланты, с которыми мы недавно начали работу. Каждое лицо прошло
                отбор и тестовую съёмку — ниже истории карьерного роста.
              </p>
            </div>
            <div className="shrink-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400/70" />
                <span className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground/60">
                  Закрытый набор
                </span>
              </div>
            </div>
          </div>

          {/* Model cards grid */}
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
                <motion.div
                  key={model.name}
                  variants={itemVariants}
                  style={{ x: cardX, scale: cardScale }}
                  transition={{ type: "spring", stiffness: 90, damping: 22 }}
                >
                  <Dialog>
                    <DialogTrigger asChild>
                      <button type="button" className="group block w-full text-left focus-visible:outline-none focus-visible:ring-0">
                        <div className="card-noise relative overflow-hidden rounded-2xl border border-white/8 bg-black/55 transition-all duration-400 model-card-glow">
                          {/* Image area */}
                          <div className="relative h-72 overflow-hidden sm:h-64 md:h-60">
                            <Image
                              src={model.src}
                              alt={model.name}
                              fill
                              className="origin-center object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                              sizes="(min-width: 1024px) 280px, 45vw"
                            />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            {/* Height badge */}
                            <div className="absolute right-3 top-3 rounded-full border border-white/15 bg-black/60 px-2.5 py-1 backdrop-blur-sm">
                              <span className="text-[9px] uppercase tracking-[0.24em] text-amber-200/70">
                                {model.height} см
                              </span>
                            </div>
                          </div>

                          {/* Info area */}
                          <div className="px-4 pb-4 pt-3">
                            <div className="flex items-end justify-between">
                              <div className="space-y-0.5">
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
                                  {model.name}
                                </p>
                                <p className="text-[10px] text-muted-foreground/60">
                                  {model.city}
                                </p>
                              </div>
                              <span className="text-[9px] uppercase tracking-[0.22em] text-amber-300/50 transition-all duration-300 group-hover:text-amber-300/80">
                                Подробнее →
                              </span>
                            </div>

                            {/* Bottom accent line */}
                            <div className="mt-3 h-px w-0 bg-gradient-to-r from-amber-400/50 to-transparent transition-all duration-500 group-hover:w-full" />
                          </div>
                        </div>
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] overflow-y-auto border-border/50 bg-background/97 p-4 sm:max-w-xl">
                      <div className="mx-auto w-full overflow-hidden rounded-2xl bg-black">
                        <div className="relative w-full pb-[178%]">
                          <Image src={model.src} alt={model.name} fill className="object-cover" sizes="(min-width: 768px) 520px, 100vw" />
                        </div>
                      </div>
                      <div className="space-y-3 pt-5">
                        <div className="flex items-center gap-3">
                          <div className="h-px w-5 bg-amber-400/50" />
                          <p className="text-[10px] uppercase tracking-[0.28em] text-amber-300/70">
                            {model.city} · {model.height} см
                          </p>
                        </div>
                        <h3 className="text-lg font-medium tracking-[0.16em] text-foreground" style={{ fontFamily: "var(--font-display), serif" }}>
                          {model.name}
                        </h3>
                        <p className="text-xs leading-relaxed text-muted-foreground/80 sm:text-sm">
                          {model.story}
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════
          WHY SIGMA
      ═══════════════════════════════════════════ */}
      <motion.section
        className="relative overflow-hidden border-y border-border/30 px-4 py-16 md:px-10 lg:px-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.08 }}
        transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
      >
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-400/[0.03] via-transparent to-blue-900/[0.04]" />

        <div className="mx-auto max-w-6xl space-y-10">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="h-px w-8 bg-gradient-to-r from-amber-400/60 to-transparent" />
              <p className="text-[10px] uppercase tracking-[0.38em] text-amber-300/60">
                Почему Sigma
              </p>
            </div>
            <h2
              className="text-2xl font-medium tracking-[0.14em] text-foreground md:text-3xl"
              style={{ fontFamily: "var(--font-display), serif" }}
            >
              Что отличает нас
              <br />
              <span className="text-muted-foreground/55 text-[0.7em] tracking-[0.2em]">
                от массового подхода
              </span>
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
                className="why-card-line group relative flex flex-col gap-4 rounded-2xl border border-border/40 bg-card/30 px-5 py-5 transition-all duration-350 hover:border-amber-400/20 hover:bg-card/50"
              >
                {/* Number */}
                <span className="text-[2.5rem] font-bold leading-none tracking-tighter text-white/[0.06] transition-colors duration-300 group-hover:text-amber-400/10 select-none">
                  {item.num}
                </span>

                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">
                    {item.title}
                  </p>
                  <p className="text-xs leading-relaxed text-muted-foreground/65">
                    {item.text}
                  </p>
                </div>

                {/* Gold dot accent */}
                <div className="absolute right-4 top-4 h-1 w-1 rounded-full bg-amber-400/30 transition-all duration-300 group-hover:bg-amber-400/60 group-hover:shadow-[0_0_6px_rgba(240,201,106,0.4)]" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════
          ANIMATED STATS
      ═══════════════════════════════════════════ */}
      <motion.section
        className="px-4 py-14 md:px-10 lg:px-20"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-px border border-border/25 rounded-2xl overflow-hidden bg-border/25 lg:grid-cols-4">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="flex flex-col items-center gap-1.5 bg-background/60 px-6 py-8 text-center"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <span
                  className="text-4xl font-bold tracking-tight text-amber-200/90 stat-value md:text-5xl"
                  style={{ fontFamily: "var(--font-display), serif" }}
                >
                  <Counter value={stat.value} suffix={stat.suffix} />
                </span>
                <span className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground/50">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════
          BRANDS / PARTNERS
      ═══════════════════════════════════════════ */}
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
              <div className="flex items-center gap-4">
                <div className="h-px w-8 bg-gradient-to-r from-amber-400/60 to-transparent" />
                <p className="text-[10px] uppercase tracking-[0.38em] text-amber-300/60">
                  Партнёры и бренды
                </p>
              </div>
              <h2
                className="text-2xl font-medium tracking-[0.14em] text-foreground md:text-3xl"
                style={{ fontFamily: "var(--font-display), serif" }}
              >
                С кем мы работаем
              </h2>
            </div>
            <p className="max-w-sm text-xs leading-relaxed text-muted-foreground/60 sm:text-right">
              Нажмите на бренд, чтобы узнать подробности сотрудничества.
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
                    <button
                      type="button"
                      className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <div className="brand-badge group relative overflow-hidden rounded-2xl border border-border/35 bg-black/35 px-5 py-4">
                        {/* Hover gradient overlay */}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-400/0 to-amber-400/0 transition-all duration-500 group-hover:from-amber-400/4 group-hover:to-transparent" />

                        <div className="relative flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-100/85">
                              {brand.name}
                            </p>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">
                              {brand.category}
                            </p>
                          </div>
                          <span className="text-[10px] text-muted-foreground/30 transition-all duration-300 group-hover:text-amber-300/60">
                            →
                          </span>
                        </div>

                        {/* Bottom reveal line */}
                        <div className="mt-3 h-px w-0 bg-gradient-to-r from-amber-400/40 to-transparent transition-all duration-400 group-hover:w-full" />
                      </div>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="border-border/50 bg-background/97 p-6 sm:max-w-md">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-px w-5 bg-amber-400/50" />
                        <p className="text-[10px] uppercase tracking-[0.28em] text-amber-300/60">
                          {brand.category}
                        </p>
                      </div>
                      <h3
                        className="text-2xl font-medium tracking-tight text-foreground"
                        style={{ fontFamily: "var(--font-display), serif" }}
                      >
                        {brand.name}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground/75">
                        {brand.detail}
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════
          GEOGRAPHY STRIP
      ═══════════════════════════════════════════ */}
      <section className="border-y border-border/25 bg-black/55 px-4 py-4 md:px-10 lg:px-20">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-5 md:justify-between">
          {[
            "Москва",
            "Санкт‑Петербург",
            "Казань",
            "Екатеринбург",
            "Новосибирск",
            "Сочи",
          ].map((city, i) => (
            <span key={city} className="flex items-center gap-5">
              <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground/45">
                {city}
              </span>
              {i < 5 && (
                <span className="hidden h-px w-4 bg-border/40 md:inline-block" />
              )}
            </span>
          ))}
          <a
            href="/branches"
            className="text-[10px] uppercase tracking-[0.28em] text-amber-300/60 underline-offset-4 transition-colors hover:text-amber-200/90 hover:underline"
          >
            Все филиалы →
          </a>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          APPLY FORM
      ═══════════════════════════════════════════ */}
      <section
        id="apply-form"
        className="relative overflow-hidden border-t border-border/20 px-4 py-16 md:px-10 lg:px-20"
      >
        {/* Background: gradient from gold to dark */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#1a1408] via-[#0e0e14] to-[#0b0b12]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(240,201,106,0.09),transparent)]" />

        <div className="relative mx-auto grid max-w-6xl gap-12 md:grid-cols-[1fr_1.5fr]">
          {/* Left: copy */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="h-px w-8 bg-gradient-to-r from-amber-400/60 to-transparent" />
                <p className="text-[10px] uppercase tracking-[0.38em] text-amber-300/60">
                  Анкета модели
                </p>
              </div>
              <h2
                className="text-3xl font-medium tracking-[0.1em] text-foreground md:text-4xl"
                style={{ fontFamily: "var(--font-display), serif" }}
              >
                Стать моделью
                <br />
                <span className="text-gold-shimmer">Sigma</span>
              </h2>
            </div>
            <p className="text-sm leading-[1.9] text-muted-foreground/65">
              Мы рассматриваем анкеты выборочно и связываемся только с
              подходящими под премиальный сегмент кандидатами. Укажите реальные
              параметры, возраст, рост и прикрепите ссылки на актуальные фото.
              После одобрения вы получите приглашение в систему.
            </p>

            {/* Process steps */}
            <div className="space-y-3 pt-2">
              {[
                "Заполните анкету с реальными данными",
                "Мы рассматриваем в течение 5–7 дней",
                "Подходящие кандидаты получают приглашение",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-amber-400/25 text-[9px] font-semibold text-amber-300/60">
                    {i + 1}
                  </span>
                  <p className="text-xs leading-relaxed text-muted-foreground/55">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: form card */}
          <motion.div
            className="gradient-border rounded-2xl bg-white/[0.04] p-px"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="rounded-2xl bg-black/50 p-6 backdrop-blur-sm">
              <ApplyForm action={action} />
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

function ApplyForm({ action }: { action: HomeContentProps["action"] }) {
  return (
    <form
      action={action as (formData: FormData) => void | Promise<void>}
      className="space-y-4 text-sm"
    >
      <div className="grid gap-3.5">
        <div className="space-y-1.5">
          <Label htmlFor="fullName" className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground/70">
            Имя и фамилия
          </Label>
          <Input
            id="fullName"
            name="fullName"
            required
            placeholder="Например: Анна Иванова"
            className="border-white/10 bg-white/5 text-foreground placeholder:text-muted-foreground/30 focus:border-amber-400/30 focus:ring-amber-400/10"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="age" className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground/70">
              Возраст
            </Label>
            <Input
              id="age"
              name="age"
              type="number"
              min={14}
              max={40}
              required
              className="border-white/10 bg-white/5 text-foreground placeholder:text-muted-foreground/30 focus:border-amber-400/30"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="height" className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground/70">
              Рост (см)
            </Label>
            <Input
              id="height"
              name="height"
              type="number"
              min={150}
              max={200}
              required
              className="border-white/10 bg-white/5 text-foreground placeholder:text-muted-foreground/30 focus:border-amber-400/30"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="parameters" className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground/70">
              Параметры
            </Label>
            <Input
              id="parameters"
              name="parameters"
              placeholder="83-60-90"
              required
              className="border-white/10 bg-white/5 text-foreground placeholder:text-muted-foreground/30 focus:border-amber-400/30"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="city" className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground/70">
              Город
            </Label>
            <Input
              id="city"
              name="city"
              placeholder="Ваш город"
              required
              className="border-white/10 bg-white/5 text-foreground placeholder:text-muted-foreground/30 focus:border-amber-400/30"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground/70">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Контактный email"
            className="border-white/10 bg-white/5 text-foreground placeholder:text-muted-foreground/30 focus:border-amber-400/30"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="photos" className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground/70">
            Ссылки на фото
          </Label>
          <Textarea
            id="photos"
            name="photos"
            required
            placeholder="Ссылки на ваши актуальные фото (VK, соцсети, облако и т.п.)"
            className="min-h-[80px] resize-none border-white/10 bg-white/5 text-foreground placeholder:text-muted-foreground/30 focus:border-amber-400/30"
          />
        </div>
      </div>

      <div className="space-y-3 pt-1">
        <Button
          type="submit"
          className="hero-cta-glow w-full py-3 text-[10px] font-semibold uppercase tracking-[0.28em]"
        >
          Отправить анкету
        </Button>
        <p className="text-center text-[10px] leading-relaxed text-muted-foreground/40">
          Отправляя анкету, вы подтверждаете согласие на обработку персональных
          данных в соответствии с политикой Sigma Models.
        </p>
      </div>
    </form>
  );
}
