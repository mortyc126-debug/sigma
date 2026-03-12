import { unstable_noStore } from "next/cache";
import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { requestPayout } from "@/lib/actions/model-balance-actions";

export async function ModelBalanceSection() {
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

  const { data: balance } = await supabaseAdmin
    .from("balances")
    .select("amount, currency")
    .eq("model_id", model.id)
    .maybeSingle();

  let transactions: { id: string; kind: string; amount: number; description: string | null; created_at: string; payout_request_id?: string | null }[] | null = null;
  const { data: txData, error: txError } = await supabaseAdmin
    .from("transactions")
    .select("id, kind, amount, description, created_at, payout_request_id")
    .eq("model_id", model.id)
    .order("created_at", { ascending: false })
    .limit(20);
  if (!txError) transactions = txData;

  if (txError && txError.message?.includes("payout_request_id")) {
    const { data: txFallback } = await supabaseAdmin
      .from("transactions")
      .select("id, kind, amount, description, created_at")
      .eq("model_id", model.id)
      .order("created_at", { ascending: false })
      .limit(20);
    transactions = txFallback;
  }

  const { data: payoutRequests } = await supabaseAdmin
    .from("payout_requests")
    .select("id, status, amount, created_at")
    .eq("model_id", model.id);

  const statusByPayoutId = new Map<string, string>(
    (payoutRequests ?? []).map((p: { id: string; status: string }) => [
      p.id,
      p.status,
    ]),
  );

  function getPayoutStatus(
    tx: { kind: string; amount: number; created_at: string; payout_request_id?: string | null },
  ): string | null {
    if (tx.kind !== "withdrawal") return null;
    if (tx.payout_request_id) {
      return statusByPayoutId.get(tx.payout_request_id) ?? null;
    }
    const list = payoutRequests ?? [];
    const txTime = new Date(tx.created_at).getTime();
    const sameAmount = list.filter(
      (p: { amount: number }) => Number(p.amount) === Number(tx.amount),
    );
    const closest = sameAmount.find((p: { created_at: string }) => {
      const diff = Math.abs(new Date(p.created_at).getTime() - txTime);
      return diff < 5 * 60 * 1000;
    });
    return closest ? (closest as { status: string }).status : null;
  }

  const formattedAmount =
    typeof balance?.amount === "number"
      ? balance.amount.toFixed(2)
      : "0.00";
  const currency = balance?.currency ?? "RUB";

  return (
    <Card className="border-border/70 bg-card/60 px-4 py-4 sm:px-5">
      <div className="grid gap-6 md:grid-cols-2 md:items-stretch">
        <div className="flex min-h-[320px] flex-col space-y-3">
          <div className="space-y-1">
            <h2 className="text-sm font-medium tracking-tight">Баланс модели</h2>
            <p className="text-xs text-muted-foreground">
              Информация о начислениях и текущем доступном балансе.
            </p>
          </div>

          <div className="rounded-lg border border-border/70 bg-background/30 px-4 py-3">
            <p className="text-xs text-muted-foreground">Текущий баланс</p>
            <p className="mt-1 text-xl font-semibold">
              {formattedAmount} <span className="text-xs align-middle">{currency}</span>
            </p>
          </div>

          <div className="mt-2 flex-1 min-h-0">
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              История операций
            </p>
            {transactions && transactions.length > 0 ? (
              <div className="min-h-[280px] max-h-[380px] overflow-x-auto overflow-y-auto rounded-md border border-border/60">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[90px]">Дата</TableHead>
                      <TableHead>Тип / статус</TableHead>
                      <TableHead className="w-[90px] text-right">Сумма</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((tx: any) => {
                      const payoutStatus = getPayoutStatus(tx);
                      return (
                        <TableRow key={tx.id}>
                          <TableCell className="text-xs text-muted-foreground">
                            {new Date(tx.created_at).toLocaleDateString("ru-RU")}
                          </TableCell>
                          <TableCell className="text-xs">
                            <span>
                              {tx.kind === "credit"
                                ? "Начисление"
                                : tx.kind === "withdrawal"
                                ? "Вывод"
                                : "Корректировка"}
                            </span>
                            {tx.description && (
                              <div className="mt-0.5 text-xs text-muted-foreground">
                                {tx.description}
                              </div>
                            )}
                            {payoutStatus && (
                              <div
                                className={
                                  payoutStatus === "paid"
                                    ? "mt-1 text-xs font-medium text-emerald-400"
                                    : payoutStatus === "rejected"
                                    ? "mt-1 text-xs font-medium text-red-400"
                                    : "mt-1 text-xs font-medium text-amber-400"
                                }
                              >
                                {payoutStatus === "paid"
                                  ? "Выплачено"
                                  : payoutStatus === "rejected"
                                  ? "Отклонено"
                                  : "В обработке"}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-xs text-right">
                            {Number(tx.amount).toFixed(2)} {currency}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                История операций пока отсутствует.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-medium tracking-tight">
              Запрос на вывод средств
            </h3>
            <p className="text-xs text-muted-foreground">
              Заявка отправляется напрямую в агентство. Обработка запроса
              выполняется менеджером вручную.
            </p>
          </div>
          <form action={requestPayout} className="space-y-3 text-sm">
            <div className="space-y-1.5">
              <Label htmlFor="bank">Банк / способ вывода</Label>
              <Input
                id="bank"
                name="bank"
                required
                placeholder="Например: Сбербанк, Тинькофф, ЮMoney"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="destination">Номер карты или телефона</Label>
              <Input
                id="destination"
                name="destination"
                required
                placeholder="Реквизиты для зачисления"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="amount">Сумма к выводу (RUB)</Label>
              <Input
                id="amount"
                name="amount"
                required
                placeholder="Например: 15000"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="comment">Комментарий (необязательно)</Label>
              <Textarea
                id="comment"
                name="comment"
                placeholder="Дополнительная информация для бухгалтерии (по желанию)."
                className="min-h-[60px] resize-none"
              />
            </div>
            <Button type="submit" className="w-full">
              Отправить запрос на вывод
            </Button>
          </form>

          <div className="mt-3 rounded-lg border border-border/70 bg-background/20 px-3 py-2 text-xs text-muted-foreground">
            <p>
              Завершённые работы и начисления отображаются в истории операций
              слева. Статус выводов: в обработке → выплачено или отклонено. О
              поступлении средств агентство уведомляет отдельно.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

