import { supabaseAdmin } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { adminAdjustBalance } from "@/lib/actions/admin-models-actions";

export async function BalancesSection() {
  const { data } = await supabaseAdmin
    .from("models")
    .select(
      `
        id,
        profiles (
          full_name,
          email
        )
      `,
    )
    .order("created_at", { ascending: false });

  const models =
    data?.map((row: any) => ({
      id: row.id as string,
      full_name:
        (row.profiles?.full_name as string | null) ??
        (row.profiles?.email as string | null) ??
        "Модель",
    })) ?? [];

  return (
    <Card className="border-border/70 bg-card/60 px-5 py-4">
      <h3 className="text-sm font-medium tracking-tight">
        Администрирование балансов
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Начисление и корректировка балансов моделей. Все изменения сразу видны
        в личном кабинете.
      </p>

      <form action={adminAdjustBalance} className="mt-4 grid gap-3 text-sm">
        <div className="space-y-1.5">
          <Label htmlFor="model_id">Модель</Label>
          <select
            id="model_id"
            name="model_id"
            required
            className="h-9 w-full rounded-md border border-border bg-background/40 px-2 text-xs outline-none"
          >
            <option value="">Выберите модель</option>
            {models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.full_name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="amount">Сумма (RUB)</Label>
          <Input
            id="amount"
            name="amount"
            required
            placeholder="Положительное число — начисление"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="description">Комментарий</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Основание начисления (заказ, проект, корректировка)."
            className="min-h-[60px] resize-none"
          />
        </div>
        <Button type="submit" className="w-full sm:w-auto">
          Применить изменение баланса
        </Button>
      </form>
    </Card>
  );
}

