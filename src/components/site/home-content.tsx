 "use client";

import { useCallback, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
    title: "Строгий отбор",
    text: "Работаем только с теми, кто подходит под премиальный сегмент и готов к долгосрочной карьере.",
  },
  {
    title: "Прозрачные условия",
    text: "Баланс, выплаты и история операций в личном кабинете. Никаких скрытых комиссий.",
  },
  {
    title: "Кураторство карьеры",
    text: "Персональный менеджер, план развития портфолио и доступ к кастингам уровня бренда.",
  },
  {
    title: "География",
    text: "Головной офис в Москве и филиалы в ключевых городах России. Единые стандарты везде.",
  },
];

const staggerWrap = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.4, 0.25, 1] as const },
  },
};

const COLS = 3;
const DISPERSE_PX = 140;

export function HomeContent({ action }: HomeContentProps) {
  const newFacesSectionRef = useRef<HTMLElement>(null);
  const scrollToForm = useCallback(() => {
    const el = document.getElementById("apply-form");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
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
      <section className="px-4 pb-10 pt-16 md:px-10 lg:px-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row lg:items-center">
          <motion.div
            className="flex-1 space-y-7"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <p className="text-xs uppercase tracking-[0.35em] text-amber-100/90">
              Модельное агентство · Россия
            </p>
            <div className="space-y-4">
              <h1 className="text-3xl font-medium tracking-[0.22em] md:text-5xl lg:text-6xl">
                Премиальные модели
                <br />
                для брендов уровня 2026 года
              </h1>
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
                Sigma Models — одно из ведущих модельных агентств России. Закрытый
                пул моделей, головной офис в Москве и филиалы в шести городах. Мы
                работаем в премиальном сегменте: отбираем модели точечно,
                сопровождаем карьеру кураторами и ведём проекты с брендами от
                кастинга до продакшена.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-xs md:text-sm">
              <Button
                type="button"
                onClick={scrollToForm}
                className="hero-cta-glow px-6 py-2 text-[11px] font-medium uppercase tracking-[0.24em]"
              >
                Анкета модели
              </Button>
              <Button
                type="button"
                variant="outline"
                asChild
                className="border-border/70 px-6 py-2 text-[11px] font-medium uppercase tracking-[0.24em]"
              >
                <Link href="/invite">Вход по приглашению</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          >
            <div className="relative h-[360px] rounded-[2.2rem] border border-white/15 bg-black/35 p-4 md:h-[420px]">
              <div className="grid h-full grid-cols-3 gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="group relative col-span-2 overflow-hidden rounded-[1.8rem] shadow-[0_0_0_1px_rgba(255,255,255,0.06)] transition-shadow duration-300 focus-visible:outline-none focus-visible:ring-0 hover:shadow-[0_0_40px_rgba(247,210,106,0.12),0_0_0_1px_rgba(247,210,106,0.2)]"
                    >
                      <motion.div
                        className="relative h-full w-full"
                        initial={{ y: 18 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      >
                        <Image
                          src="/models/hero-1-new.jpg"
                          alt="Sigma Models — модель портфолио"
                          fill
                          className="origin-center object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                          sizes="(min-width: 1024px) 480px, 60vw"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
                      </motion.div>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="border-border/70 bg-background/95 max-h-[92vh] overflow-hidden p-4 sm:max-w-3xl">
                  <div className="mx-auto w-full max-h-[calc(92vh-2rem)] overflow-y-auto rounded-xl bg-black">
                    <div className="relative w-full min-h-[70vh] pb-[178%]">
                        <Image
                          src="/models/hero-1-new.jpg"
                          alt="Sigma Models — модель портфолио"
                          fill
                          className="object-contain"
                          sizes="(min-width: 768px) 800px, 100vw"
                        />
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <motion.div
                  className="col-span-1 flex flex-col gap-3"
                  initial={{ y: -18 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.08 }}
                >
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        type="button"
                        className="group relative flex-1 overflow-hidden rounded-[1.5rem] shadow-[0_0_0_1px_rgba(255,255,255,0.06)] transition-shadow duration-300 hover:shadow-[0_0_28px_rgba(247,210,106,0.1),0_0_0_1px_rgba(247,210,106,0.15)] focus-visible:outline-none focus-visible:ring-0"
                      >
                        <Image
                          src="/models/hero-2-new.jpg"
                          alt="Sigma Models — модель портфолио"
                          fill
                          className="origin-center object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                          sizes="220px"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="border-border/70 bg-background/95 max-h-[92vh] overflow-hidden p-4 sm:max-w-lg">
                      <div className="mx-auto w-full max-h-[calc(92vh-2rem)] overflow-y-auto rounded-xl bg-black">
                        <div className="relative w-full min-h-[70vh] pb-[178%]">
                          <Image
                            src="/models/hero-2-new.jpg"
                            alt="Sigma Models — модель портфолио"
                            fill
                            className="object-contain"
                            sizes="(min-width: 768px) 520px, 100vw"
                          />
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        type="button"
                        className="group relative flex-1 overflow-hidden rounded-[1.5rem] shadow-[0_0_0_1px_rgba(255,255,255,0.06)] transition-shadow duration-300 hover:shadow-[0_0_28px_rgba(247,210,106,0.1),0_0_0_1px_rgba(247,210,106,0.15)] focus-visible:outline-none focus-visible:ring-0"
                      >
                        <Image
                          src="/models/hero-3-new.jpg"
                          alt="Sigma Models — модель портфолио"
                          fill
                          className="origin-center object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                          sizes="220px"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="border-border/70 bg-background/95 max-h-[92vh] overflow-hidden p-4 sm:max-w-lg">
                      <div className="mx-auto w-full max-h-[calc(92vh-2rem)] overflow-y-auto rounded-xl bg-black">
                        <div className="relative w-full min-h-[70vh] pb-[178%]">
                          <Image
                            src="/models/hero-3-new.jpg"
                            alt="Sigma Models — модель портфолио"
                            fill
                            className="object-contain"
                            sizes="(min-width: 768px) 520px, 100vw"
                          />
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </motion.div>
              </div>
              <div className="pointer-events-none absolute inset-0 rounded-[2.2rem] border border-white/15" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* NEW FACES — карточки распадаются при скролле, освобождая центр подиума */}
      <motion.section
        ref={newFacesSectionRef}
        className="px-4 pb-14 md:px-10 lg:px-20"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.08 }}
        transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
      >
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                New Faces
              </p>
              <h2 className="text-lg font-medium tracking-[0.18em] text-foreground md:text-xl">
                Новые лица Sigma
              </h2>
              <p className="max-w-xl text-xs leading-relaxed text-muted-foreground md:text-sm">
                Таланты, с которыми мы недавно начали работу. Каждое лицо прошло
                отбор и тестовую съёмку — ниже истории карьерного роста в агентстве.
              </p>
            </div>
          </div>
          <motion.div
            className="grid gap-4 sm:grid-cols-2 md:grid-cols-3"
            variants={staggerWrap}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.06 }}
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
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
              >
                <Dialog>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="group block w-full text-left focus-visible:outline-none focus-visible:ring-0"
                  >
                    <Card className="overflow-hidden border-border/50 bg-black/60 px-3 pb-3 pt-3 transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:shadow-xl">
                      <div className="relative mb-3 h-64 overflow-hidden rounded-2xl sm:h-56 md:h-52">
                        <Image
                          src={model.src}
                          alt={model.name}
                          fill
                          className="origin-center object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                          sizes="(min-width: 1024px) 260px, 40vw"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      </div>
                      <div className="space-y-0.5 text-xs">
                        <p className="font-medium tracking-[0.12em] uppercase text-foreground">
                          {model.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {model.city} · {model.height} см
                        </p>
                      </div>
                    </Card>
                  </button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto border-border/70 bg-background/95 p-4 sm:max-w-xl">
                  <div className="mx-auto w-full overflow-hidden rounded-xl bg-black">
                    <div className="relative w-full pb-[178%]">
                      <Image
                        src={model.src}
                        alt={model.name}
                        fill
                        className="object-cover"
                        sizes="(min-width: 768px) 520px, 100vw"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 pt-4 text-sm text-muted-foreground">
                    <p className="text-center text-xs font-medium text-foreground">
                      {model.name} · {model.city} · {model.height} см
                    </p>
                    <p className="text-xs leading-relaxed sm:text-sm">
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

      {/* ПОЧЕМУ SIGMA */}
      <motion.section
        className="border-y border-border/40 bg-black/40 px-4 py-12 md:px-10 lg:px-20"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
      >
        <div className="mx-auto max-w-6xl space-y-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Почему Sigma
            </p>
            <h2 className="mt-1 text-lg font-medium tracking-[0.18em] text-foreground md:text-xl">
              Что отличает нас от массового подхода
            </h2>
          </div>
          <motion.div
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            variants={staggerWrap}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.08 }}
          >
            {WHY_SIGMA.map((item) => (
              <motion.div
                key={item.title}
                variants={itemVariants}
                className="flex gap-3 rounded-xl border border-border/50 bg-card/40 px-4 py-4 transition-colors hover:border-primary/30"
              >
                <span className="mt-1 h-px w-6 shrink-0 bg-primary/50" />
                <div className="space-y-1.5">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-foreground">
                    {item.title}
                  </p>
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    {item.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Партнёры — бренды */}
      <motion.section
        className="px-6 pb-12 md:px-10 lg:px-20"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.08 }}
        transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
      >
        <div className="mx-auto max-w-6xl space-y-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Партнёры и бренды
            </p>
            <h2 className="mt-1 text-lg font-medium tracking-[0.18em] text-foreground md:text-xl">
              С кем мы сотрудничаем
            </h2>
            <p className="mt-2 max-w-xl text-xs text-muted-foreground md:text-sm">
              Известные бренды, с которыми Sigma Models ведёт кампании. Нажмите на
              карточку, чтобы узнать подробности сотрудничества.
            </p>
          </div>
          <motion.div
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
            variants={staggerWrap}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.06 }}
          >
            {PARTNER_BRANDS.map((brand) => (
              <motion.div key={brand.name} variants={itemVariants}>
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                    type="button"
                    className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <Card className="border-border/50 bg-black/40 px-4 py-3.5 text-sm transition-colors hover:border-primary/40 hover:bg-black/50">
                      <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-100/90">
                        {brand.name}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {brand.category}
                      </p>
                      <p className="mt-2 text-[11px] text-muted-foreground/80">
                        Нажмите, чтобы подробнее →
                      </p>
                    </Card>
                  </button>
                </DialogTrigger>
                <DialogContent className="border-border/70 bg-background/95 p-5 sm:max-w-md">
                  <div className="space-y-3">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                      {brand.category}
                    </p>
                    <h3 className="text-xl font-medium tracking-tight text-foreground">
                      {brand.name}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
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

      <section className="border-y border-border/40 bg-black/60 px-6 py-5 md:px-10 lg:px-20">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-4 text-center text-[11px] text-muted-foreground md:justify-between md:text-left">
          <span className="uppercase tracking-[0.25em]">Москва · Россия</span>
          <span className="hidden h-px w-6 bg-border/60 md:inline" />
          <span className="uppercase tracking-[0.2em]">10+ лет на рынке</span>
          <span className="h-px w-6 bg-border/60" />
          <span className="uppercase tracking-[0.2em]">500+ кампаний</span>
          <span className="h-px w-6 bg-border/60" />
          <span>Премиальный сегмент · Вход по приглашению или одобренной анкете</span>
        </div>
      </section>

      <section className="px-6 py-8 md:px-10 lg:px-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs text-muted-foreground md:text-sm">
              Головной офис в Москве и филиалы в Санкт‑Петербурге, Казани,
              Екатеринбурге, Новосибирске и Сочи. Единые стандарты и кураторство в каждом городе.
            </p>
          </div>
          <a
            href="/branches"
            className="shrink-0 text-xs uppercase tracking-[0.24em] text-amber-200/90 underline-offset-4 hover:text-amber-100 hover:underline"
          >
            Смотреть все филиалы
          </a>
        </div>
      </section>

      <section
        id="apply-form"
        className="border-t border-border/40 bg-gradient-to-b from-[#f7e4b0] via-[#faf0cf] to-[#ffffff] px-6 py-10 text-neutral-900 md:px-10 lg:px-20"
      >
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.6fr)]">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">
              Анкета для моделей
            </p>
            <h2 className="text-xl font-medium tracking-tight text-neutral-900 md:text-2xl">
              Стать моделью Sigma
            </h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              Мы рассматриваем анкеты выборочно и связываемся только с
              подходящими под премиальный сегмент кандидатами. Укажите реальные
              параметры, возраст, рост и прикрепите ссылки на актуальные фото
              (соцсети, облако). После одобрения вы получите приглашение в систему
              и доступ к личному кабинету.
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white/80 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.14)]">
            <ApplyForm action={action} />
          </div>
        </div>
      </section>
    </main>
  );
}

function ApplyForm({ action }: { action: HomeContentProps["action"] }) {
  return (
    <form action={action} className="space-y-4 text-sm">
      <div className="grid gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Имя и фамилия</Label>
          <Input
            id="fullName"
            name="fullName"
            required
            placeholder="Например: Анна Иванова"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="age">Возраст</Label>
            <Input
              id="age"
              name="age"
              type="number"
              min={14}
              max={40}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="height">Рост (см)</Label>
            <Input
              id="height"
              name="height"
              type="number"
              min={150}
              max={200}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="parameters">Параметры</Label>
            <Input
              id="parameters"
              name="parameters"
              placeholder="Например: 83-60-90"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="city">Город</Label>
            <Input id="city" name="city" placeholder="Ваш город" required />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Контактный email"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="photos">Ссылки на фото</Label>
          <Textarea
            id="photos"
            name="photos"
            required
            placeholder="Ссылки на ваши актуальные фото (VK, соцсети, облако и т.п.)"
            className="min-h-[80px] resize-none"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Button type="submit" className="w-full">
          Отправить анкету
        </Button>
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Отправляя анкету, вы подтверждаете согласие на обработку персональных
          данных и получение обратной связи от агентства Sigma Models.
        </p>
      </div>
    </form>
  );
}

