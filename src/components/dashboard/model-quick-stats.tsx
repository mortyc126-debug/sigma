import { unstable_noStore } from "next/cache";
import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase/server";
import Link from "next/link";

export async function ModelQuickStats() {
  unstable_noStore();
  const session = await auth();
  const userId = session?.user?.id as string | undefined;
  if (!userId) return null;

  const { data: model } = await supabaseAdmin
    .from("models")
    .select("id")
    .eq("profile_id", userId)
    .maybeSingle();
  if (!model) return null;

  const [photosRes, balanceRes, payoutsRes] = await Promise.all([
    supabaseAdmin
      .from("model_photos")
      .select("id", { count: "exact", head: true })
      .eq("model_id", model.id),
    supabaseAdmin
      .from("balances")
      .select("amount, currency")
      .eq("model_id", model.id)
      .maybeSingle(),
    supabaseAdmin
      .from("payout_requests")
      .select("id", { count: "exact", head: true })
      .eq("model_id", model.id)
      .eq("status", "pending"),
  ]);

  const photoCount = photosRes.count ?? 0;
  const amount = balanceRes.data?.amount ?? 0;
  const currency = balanceRes.data?.currency ?? "RUB";
  const pendingPayouts = payoutsRes.count ?? 0;

  const formatMoney = (value: number) => {
    if (currency === "RUB") return `${Number(value).toLocaleString("ru-RU")} ₽`;
    return `${Number(value).toLocaleString("ru-RU")} ${currency}`;
  };

  const stats = [
    {
      href: "/dashboard?tab=portfolio" as string | null,
      label: "Фото в портфолио",
      value: String(photoCount),
      sub: "Перейти в портфолио →",
      accent: false,
    },
    {
      href: "/dashboard?tab=finance" as string | null,
      label: "Текущий баланс",
      value: formatMoney(amount),
      sub: "Финансы и вывод →",
      accent: true,
    },
    {
      href: null,
      label: "Запросы на вывод",
      value: pendingPayouts === 0 ? "—" : String(pendingPayouts),
      sub: pendingPayouts === 0 ? "В обработке нет" : "В обработке",
      accent: false,
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {stats.map((stat) => {
        const card = (
          <div
            className={`gradient-border relative overflow-hidden rounded-2xl bg-white/[0.025] p-px transition-all duration-300 ${
              stat.href ? "hover:scale-[1.015]" : ""
            }`}
          >
            <div className="rounded-2xl bg-black/60 px-4 py-4 backdrop-blur-sm">
              {/* Balance ambient glow */}
              {stat.accent && (
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(240,201,106,0.07),transparent)]" />
              )}
              <p className="font-condensed text-[9px] font-semibold uppercase tracking-[0.32em] text-muted-foreground/45">
                {stat.label}
              </p>
              <p
                className={`relative mt-2 text-2xl font-light tabular-nums tracking-tight ${
                  stat.accent
                    ? "text-amber-200/95 stat-value"
                    : "text-foreground/90"
                }`}
                style={
                  stat.accent
                    ? { fontFamily: "var(--font-display), serif" }
                    : undefined
                }
              >
                {stat.value}
              </p>
              <p className="mt-1 font-condensed text-[9px] font-medium uppercase tracking-[0.2em] text-muted-foreground/30">
                {stat.sub}
              </p>
            </div>
          </div>
        );

        return stat.href ? (
          <Link
            key={stat.label}
            href={stat.href}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            suppressHydrationWarning
          >
            {card}
          </Link>
        ) : (
          <div key={stat.label}>{card}</div>
        );
      })}
    </div>
  );
}
