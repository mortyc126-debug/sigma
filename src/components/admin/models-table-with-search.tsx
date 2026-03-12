"use client";

import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export type ModelRow = {
  id: string;
  full_name: string;
  email: string;
  city: string;
  age: number | null;
  height_cm: number | null;
  parameters: string;
  balance: number;
  vk_status: string;
};

export function ModelsTableWithSearch({ rows }: { rows: ModelRow[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.trim().toLowerCase();
    return rows.filter(
      (r) =>
        r.full_name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        (r.city && r.city.toLowerCase().includes(q))
    );
  }, [rows, query]);

  return (
    <Card className="border-border/70 bg-card/60 px-4 py-4">
      <h3 className="px-1 text-sm font-medium tracking-tight">Все модели</h3>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          type="search"
          placeholder="Поиск по имени, email, городу..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-xs text-sm"
        />
        {query && (
          <span className="text-xs text-muted-foreground">
            Найдено: {filtered.length} из {rows.length}
          </span>
        )}
      </div>
      {filtered.length === 0 ? (
        <p className="mt-4 text-xs text-muted-foreground">
          {rows.length === 0
            ? "Зарегистрированные модели пока отсутствуют."
            : "Ничего не найдено по запросу."}
        </p>
      ) : (
        <div className="mt-3 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Модель</TableHead>
                <TableHead>Параметры</TableHead>
                <TableHead>Город</TableHead>
                <TableHead>Рост</TableHead>
                <TableHead>Баланс</TableHead>
                <TableHead>VK</TableHead>
                <TableHead className="w-[140px]">Портфолио</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <div className="space-y-0.5 text-xs">
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
                    {row.parameters || "—"}
                  </TableCell>
                  <TableCell className="text-xs">{row.city || "—"}</TableCell>
                  <TableCell className="text-xs">
                    {row.height_cm ? `${row.height_cm} см` : "—"}
                  </TableCell>
                  <TableCell className="text-xs">
                    {row.balance.toFixed(2)} RUB
                  </TableCell>
                  <TableCell className="text-xs">
                    {row.vk_status === "completed"
                      ? "Подключен"
                      : row.vk_status === "waiting_login" ||
                          row.vk_status === "verifying_credentials"
                        ? "В процессе"
                        : "Не подключен"}
                  </TableCell>
                  <TableCell className="text-xs">
                    <a
                      href={`/dashboard/models/${row.id}/portfolio`}
                      className="inline-flex items-center rounded-full border border-border/70 px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:border-primary hover:text-primary"
                    >
                      Открыть
                    </a>
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
