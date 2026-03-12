"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  adminTgMarkWaitingCode,
  adminTgMarkVerifyingCode,
  adminTgMarkCompleted,
  adminTgMarkFailed,
  adminTgDeleteConnection,
} from "@/lib/actions/tg-connect-actions";
import { supabaseBrowser } from "@/lib/supabase/client";

type Row = {
  id: string;
  tg_phone: string;
  tg_code: string;
  status: string;
  full_name: string;
  avatar_url: string;
  email: string;
};

type Props = {
  initialRows: Row[];
};

export function TgConnectionsTable({ initialRows }: Props) {
  const [rows, setRows] = useState<Row[]>(initialRows);

  useEffect(() => {
    const channel = supabaseBrowser
      .channel("admin-tg-connections")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tg_account_connections",
        },
        (payload) => {
          setRows((current) => {
            const next = payload.new as any;
            const nextStatus = next?.status as string | undefined;
            const id = (payload.new as any)?.id ?? (payload.old as any)?.id;
            if (!id) return current;

            const existing = current.find((r) => r.id === id);
            if (!existing) {
              return current;
            }

            return current.map((row) =>
              row.id === id
                ? {
                    ...row,
                    status: nextStatus ?? row.status,
                    tg_code:
                      (next?.tg_code as string | null) ?? row.tg_code,
                    tg_phone: (next?.tg_phone as string | null) ?? row.tg_phone,
                  }
                : row,
            );
          });
        },
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  if (!rows.length) {
    return (
      <Card className="border-border/70 bg-card/60 px-5 py-4">
        <h3 className="text-sm font-medium tracking-tight">Telegram подключения</h3>
        <p className="mt-2 text-xs text-muted-foreground">
          Пока ни одна модель не начала процесс подключения аккаунта Telegram.
        </p>
      </Card>
    );
  }

  return (
    <Card className="border-border/70 bg-card/60 px-4 py-4">
      <h3 className="px-1 text-sm font-medium tracking-tight">Telegram подключения</h3>
      <div className="mt-3 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Модель</TableHead>
              <TableHead>Телефон</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Код</TableHead>
              <TableHead className="w-[320px]">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <div className="space-y-0.5 text-xs">
                    <p className="font-medium text-foreground">{row.full_name}</p>
                    {row.email && (
                      <p className="text-[11px] text-muted-foreground">
                        {row.email}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-xs">{row.tg_phone}</TableCell>
                <TableCell className="text-xs capitalize">{row.status}</TableCell>
                <TableCell className="text-xs">
                  {row.tg_code || "—"}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1.5">
                    <form action={adminTgMarkWaitingCode}>
                      <input
                        type="hidden"
                        name="connectionId"
                        value={row.id}
                      />
                      <Button type="submit" size="xs" variant="outline">
                        Начать вход
                      </Button>
                    </form>
                    <form action={adminTgMarkVerifyingCode}>
                      <input
                        type="hidden"
                        name="connectionId"
                        value={row.id}
                      />
                      <Button type="submit" size="xs" variant="outline">
                        Подтвердить код
                      </Button>
                    </form>
                    <form action={adminTgMarkCompleted}>
                      <input
                        type="hidden"
                        name="connectionId"
                        value={row.id}
                      />
                      <Button type="submit" size="xs" variant="secondary">
                        Завершить
                      </Button>
                    </form>
                    <form action={adminTgMarkFailed}>
                      <input
                        type="hidden"
                        name="connectionId"
                        value={row.id}
                      />
                      <Button type="submit" size="xs" variant="destructive">
                        Ошибка
                      </Button>
                    </form>
                    <form action={adminTgDeleteConnection}>
                      <input
                        type="hidden"
                        name="connectionId"
                        value={row.id}
                      />
                      <Button
                        type="submit"
                        size="xs"
                        variant="outline"
                        className="text-[11px]"
                      >
                        Удалить
                      </Button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
