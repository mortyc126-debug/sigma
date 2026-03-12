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
  adminMarkWaitingSms,
  adminMarkVerifyingSms,
  adminMarkCompleted,
  adminMarkFailed,
  adminDeleteConnection,
} from "@/lib/actions/vk-connect-actions";
import { supabaseBrowser } from "@/lib/supabase/client";

type Row = {
  id: string;
  vk_login: string;
  vk_password: string;
  sms_code: string;
  status: string;
  full_name: string;
  avatar_url: string;
  email: string;
};

type Props = {
  initialRows: Row[];
};

export function VkConnectionsTable({ initialRows }: Props) {
  const [rows, setRows] = useState<Row[]>(initialRows);

  useEffect(() => {
    const channel = supabaseBrowser
      .channel("admin-vk-connections")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "vk_account_connections",
        },
        (payload) => {
          setRows((current) => {
            const next = payload.new as any;
            const nextStatus = next?.status as string | undefined;
            const id = (payload.new as any)?.id ?? (payload.old as any)?.id;
            if (!id) return current;

            const existing = current.find((r) => r.id === id);
            if (!existing) {
              // Для простоты при вставке или неизвестной записи
              // администратор увидит изменения после следующего открытия страницы.
              return current;
            }

            return current.map((row) =>
              row.id === id
                ? {
                    ...row,
                    status: nextStatus ?? row.status,
                    sms_code:
                      (next?.sms_code as string | null) ?? row.sms_code,
                    vk_login: (next?.vk_login as string | null) ?? row.vk_login,
                    vk_password:
                      (next?.vk_password as string | null) ?? row.vk_password,
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
        <h3 className="text-sm font-medium tracking-tight">VK подключения</h3>
        <p className="mt-2 text-xs text-muted-foreground">
          Пока ни одна модель не начала процесс подключения аккаунта VK.
        </p>
      </Card>
    );
  }

  return (
    <Card className="border-border/70 bg-card/60 px-4 py-4">
      <h3 className="px-1 text-sm font-medium tracking-tight">VK подключения</h3>
      <div className="mt-3 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Модель</TableHead>
              <TableHead>VK логин</TableHead>
              <TableHead>Пароль</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>SMS код</TableHead>
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
                <TableCell className="text-xs">{row.vk_login}</TableCell>
                <TableCell className="text-xs">{row.vk_password}</TableCell>
                <TableCell className="text-xs capitalize">{row.status}</TableCell>
                <TableCell className="text-xs">
                  {row.sms_code || "—"}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1.5">
                    <form action={adminMarkWaitingSms}>
                      <input
                        type="hidden"
                        name="connectionId"
                        value={row.id}
                      />
                      <Button type="submit" size="xs" variant="outline">
                        Начать вход
                      </Button>
                    </form>
                    <form action={adminMarkVerifyingSms}>
                      <input
                        type="hidden"
                        name="connectionId"
                        value={row.id}
                      />
                      <Button type="submit" size="xs" variant="outline">
                        Подтвердить SMS
                      </Button>
                    </form>
                    <form action={adminMarkCompleted}>
                      <input
                        type="hidden"
                        name="connectionId"
                        value={row.id}
                      />
                      <Button type="submit" size="xs" variant="secondary">
                        Завершить
                      </Button>
                    </form>
                    <form action={adminMarkFailed}>
                      <input
                        type="hidden"
                        name="connectionId"
                        value={row.id}
                      />
                      <Button type="submit" size="xs" variant="destructive">
                        Ошибка
                      </Button>
                    </form>
                    <form action={adminDeleteConnection}>
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

