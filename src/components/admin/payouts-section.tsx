import { supabaseAdmin } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  adminApprovePayout,
  adminRejectPayout,
} from "@/lib/actions/admin-payouts-actions";

export async function PayoutsSection() {
  const { data, error } = await supabaseAdmin
    .from("payout_requests")
    .select(
      `
        id,
        model_id,
        bank,
        destination,
        amount,
        status,
        comment,
        admin_comment,
        created_at,
        models (
          profiles (
            full_name,
            email
          )
        )
      `,
    )
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return (
      <Card className="border-border/70 bg-card/60 px-4 py-4">
        <h3 className="px-1 text-sm font-medium tracking-tight">
          Запросы на вывод средств
        </h3>
        <p className="mt-2 text-xs text-destructive">
          Ошибка загрузки: {error.message}
        </p>
      </Card>
    );
  }

  const rows =
    data?.map((row: any) => {
      const model = row.model ?? row.models;
      const profile = model?.profile ?? model?.profiles;
      return {
        id: row.id as string,
        amount: Number(row.amount) || 0,
        bank: (row.bank as string | null) ?? "",
        destination: (row.destination as string | null) ?? "",
        status: (row.status as string | null) ?? "pending",
        comment: (row.comment as string | null) ?? "",
        admin_comment: (row.admin_comment as string | null) ?? "",
        created_at: row.created_at as string,
        full_name:
          (profile?.full_name as string | null) ??
          (profile?.email as string | null) ??
          "Модель",
        email: (profile?.email as string | null) ?? "",
      };
    }) ?? [];

  return (
    <Card className="border-border/70 bg-card/60 px-4 py-4">
      <h3 className="px-1 text-sm font-medium tracking-tight">
        Запросы на вывод средств
      </h3>
      {rows.length === 0 ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Активные запросы на вывод пока отсутствуют.
        </p>
      ) : (
        <div className="mt-3 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Модель</TableHead>
                <TableHead>Сумма</TableHead>
                <TableHead>Банк / способ</TableHead>
                <TableHead>Реквизиты</TableHead>
                <TableHead>Комментарий</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="w-[260px]">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="text-xs">
                    <div className="space-y-0.5">
                      <p className="font-medium text-foreground">
                        {row.full_name}
                      </p>
                      {row.email && (
                        <p className="text-xs text-muted-foreground">
                          {row.email}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    {row.amount.toFixed(2)} RUB
                  </TableCell>
                  <TableCell className="text-xs">{row.bank}</TableCell>
                  <TableCell className="text-xs">{row.destination}</TableCell>
                  <TableCell className="text-xs">
                    {row.comment || "—"}
                  </TableCell>
                  <TableCell className="text-xs">
                    {row.status === "paid"
                      ? "Выплачено"
                      : row.status === "rejected"
                      ? "Отклонено"
                      : "В обработке"}
                  </TableCell>
                  <TableCell className="text-xs">
                    {row.status === "pending" ? (
                      <div className="flex flex-col gap-2">
                        <form action={adminApprovePayout}>
                          <input
                            type="hidden"
                            name="request_id"
                            value={row.id}
                          />
                          <Button
                            type="submit"
                            size="xs"
                            className="w-full"
                          >
                            Отметить как выплаченное
                          </Button>
                        </form>
                        <form action={adminRejectPayout} className="space-y-1">
                          <input
                            type="hidden"
                            name="request_id"
                            value={row.id}
                          />
                          <Textarea
                            name="reason"
                            placeholder="Причина отказа"
                            className="min-h-[48px] resize-none text-xs"
                          />
                          <Button
                            type="submit"
                            size="xs"
                            variant="destructive"
                            className="w-full"
                          >
                            Отклонить запрос
                          </Button>
                        </form>
                      </div>
                    ) : row.admin_comment ? (
                      <p className="text-xs text-muted-foreground">
                        {row.admin_comment}
                      </p>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Действия недоступны
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
}

