import { unstable_noStore } from "next/cache";
import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
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

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Link href="/dashboard?tab=portfolio" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" suppressHydrationWarning>
        <Card className="border-border/60 bg-card/50 px-4 py-3 transition-all duration-200 hover:scale-[1.02] hover:border-border hover:bg-card/70 sm:px-4">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
            Фото в портфолио
          </p>
          <p className="mt-1 text-xl font-medium tracking-tight tabular-nums">
            {photoCount}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Перейти в портфолио →
          </p>
        </Card>
      </Link>
      <Link href="/dashboard?tab=finance" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" suppressHydrationWarning>
        <Card className="border-border/60 bg-card/50 px-4 py-3 transition-all duration-200 hover:scale-[1.02] hover:border-border hover:bg-card/70 sm:px-4">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
            Текущий баланс
          </p>
          <p className="mt-1 text-xl font-medium tracking-tight tabular-nums text-amber-200/95">
            {formatMoney(amount)}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Финансы и вывод →
          </p>
        </Card>
      </Link>
      <Card className="border-border/60 bg-card/50 px-4 py-3">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
          Запросы на вывод
        </p>
        <p className="mt-1 text-xl font-medium tracking-tight tabular-nums">
          {pendingPayouts === 0 ? "—" : pendingPayouts}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {pendingPayouts === 0 ? "В обработке нет" : "В обработке"}
        </p>
      </Card>
    </div>
  );
}
