"use client";

import { motion } from "framer-motion";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.4, 0.25, 1] as const } },
};

function Eyebrow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-px w-8 bg-gradient-to-r from-amber-400/60 to-transparent" />
      <p className="font-condensed text-[11px] font-semibold uppercase tracking-[0.42em] text-amber-300/60">{label}</p>
    </div>
  );
}

const BRANCHES = [
  {
    num: "01",
    city: "Москва",
    label: "Головной офис",
    address: "ул. Большая Никитская, д. 15, стр. 2, офис 7",
    phone: "+7 (495) 900‑45‑21",
    note: "Центральный офис: кастинги, продакшен, кураторство. Приём по записи.",
    isHQ: true,
  },
  {
    num: "02",
    city: "Санкт‑Петербург",
    label: "Филиал",
    address: "Невский пр., д. 88, офис 4",
    phone: "+7 (812) 309‑12‑45",
    note: "Кастинги и съёмки для северо-западного региона.",
    isHQ: false,
  },
  {
    num: "03",
    city: "Казань",
    label: "Филиал",
    address: "ул. Баумана, д. 58, БЦ «Центральный», офис 12",
    phone: "+7 (843) 567‑33‑21",
    note: "Поволжский регион: локальные кастинги и кампании.",
    isHQ: false,
  },
  {
    num: "04",
    city: "Екатеринбург",
    label: "Филиал",
    address: "ул. Ленина, д. 52а, офис 9",
    phone: "+7 (343) 278‑91‑00",
    note: "Уральский регион: кастинги, тесты, локальные бренды.",
    isHQ: false,
  },
  {
    num: "05",
    city: "Новосибирск",
    label: "Филиал",
    address: "Красный пр., д. 77, офис 15",
    phone: "+7 (383) 209‑44‑18",
    note: "Сибирь: отбор новых лиц, региональные съёмки.",
    isHQ: false,
  },
  {
    num: "06",
    city: "Сочи",
    label: "Партнёрское представительство",
    address: "ул. Навагинская, д. 16, офис 3",
    phone: "+7 (862) 265‑71‑22",
    note: "Сезонные кастинги и съёмки на юге России.",
    isHQ: false,
  },
];

export function BranchesContent() {
  return (
    <main className="min-h-screen px-4 py-16 md:px-10 lg:px-20">
      <div className="mx-auto max-w-5xl space-y-16">

        {/* ─── Hero ─── */}
        <motion.header
          className="space-y-5"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Eyebrow label="География · Россия" />
          <h1
            className="text-4xl font-light leading-[1.1] tracking-[0.06em] text-foreground md:text-5xl"
            style={{ fontFamily: "var(--font-display), serif" }}
          >
            Sigma
            <br />
            <span className="text-muted-foreground/50 italic">по всей России</span>
          </h1>
          <p className="max-w-xl text-base leading-[1.85] text-muted-foreground/65">
            Головной офис в Москве, пять региональных точек. Единый стандарт
            кастинга и кураторства — в каждом городе присутствия.
          </p>
        </motion.header>

        {/* ─── Branch list ─── */}
        <motion.section
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.06 }}
        >
          {BRANCHES.map((branch) => (
            <motion.div
              key={branch.city}
              variants={fadeUp}
              className={`why-card-line group relative overflow-hidden rounded-2xl border bg-black/40 p-5 transition-all duration-350 hover:border-amber-400/25 ${
                branch.isHQ ? "border-amber-400/20 bg-amber-400/[0.025]" : "border-border/30"
              }`}
            >
              {/* Number */}
              <span className="font-condensed absolute right-5 top-4 text-[1.8rem] font-bold leading-none text-white/[0.04] select-none">
                {branch.num}
              </span>

              <div className="space-y-4">
                <div className="space-y-0.5">
                  <p className={`font-condensed text-[10px] font-semibold uppercase tracking-[0.28em] ${branch.isHQ ? "text-amber-300/70" : "text-amber-300/40"}`}>
                    {branch.label}
                  </p>
                  <p
                    className="text-lg font-light tracking-[0.08em] text-foreground"
                    style={{ fontFamily: "var(--font-display), serif" }}
                  >
                    {branch.city}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs leading-relaxed text-muted-foreground/55">{branch.address}</p>
                  <p className="text-xs leading-relaxed text-muted-foreground/45">{branch.note}</p>
                </div>

                <a
                  href={`tel:${branch.phone.replace(/[^+\d]/g, "")}`}
                  className="inline-flex items-center gap-2 text-xs text-amber-200/65 underline-offset-4 transition-colors hover:text-amber-100 hover:underline"
                >
                  {branch.phone}
                </a>
              </div>
            </motion.div>
          ))}
        </motion.section>

        {/* ─── Note ─── */}
        <motion.div
          className="rounded-2xl border border-border/25 bg-black/35 px-5 py-4"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm leading-[1.85] text-muted-foreground/55">
            Визиты в офисы — по предварительной записи. Для кастингов в вашем городе
            пишите на{" "}
            <a href="mailto:casting@sigma-models.ru" className="text-amber-200/70 underline-offset-4 hover:underline">
              casting@sigma-models.ru
            </a>
            , укажите город в теме письма.
          </p>
        </motion.div>
      </div>
    </main>
  );
}
