import { supabaseAdmin } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { adminCreateInvite, adminDeleteInvite } from "@/lib/actions/admin-invites-actions";
import { CopyInviteButton } from "@/components/admin/copy-invite-button";

export async function InvitesSection() {
  const { data } = await supabaseAdmin
    .from("invite_codes")
    .select("id, token, email, role, created_at, expires_at, used_by, used_at")
    .order("created_at", { ascending: false })
    .limit(50);

  const items =
    data?.map((row: any) => ({
      id: row.id as string,
      token: row.token as string,
      email: (row.email as string | null) ?? "",
      role: row.role as string,
      created_at: row.created_at as string,
      expires_at: row.expires_at as string | null,
      used_by: row.used_by as string | null,
      used_at: row.used_at as string | null,
    })) ?? [];

  const baseUrl =
    process.env.NEXTAUTH_URL ?? "https://sigma-model.com";

  return (
    <Card className="border-border/70 bg-card/60 px-5 py-4">
      <h3 className="text-sm font-medium tracking-tight">Приглашения</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Создавайте инвайт-ссылки для входа в личный кабинет без открытой регистрации.
      </p>

      <form action={adminCreateInvite} className="mt-4 grid gap-3 text-sm">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email (необязательно)</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Если указать, инвайт будет привязан к конкретному email"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="role">Роль</Label>
            <select
              id="role"
              name="role"
              className="h-9 w-full rounded-md border border-border bg-background/40 px-2 text-xs outline-none"
              defaultValue="model"
            >
              <option value="model">model</option>
              <option value="admin">admin</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="expires_in_days">Срок действия (дней)</Label>
            <Input
              id="expires_in_days"
              name="expires_in_days"
              defaultValue="7"
            />
          </div>
        </div>
        <Button type="submit" className="w-full sm:w-auto">
          Создать приглашение
        </Button>
      </form>

      <div className="mt-5">
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          Последние приглашения
        </p>
        {items.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            Приглашения ещё не создавались.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-md border border-border/60">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Роль</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Ссылка</TableHead>
                  <TableHead className="w-16">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => {
                  const used = Boolean(item.used_by);
                  const url = `${baseUrl}/invite?token=${item.token}`;
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="text-xs">
                        {item.email || "Не указан"}
                      </TableCell>
                      <TableCell className="text-xs">{item.role}</TableCell>
                      <TableCell className="text-xs">
                        {used
                          ? "Использован"
                          : item.expires_at &&
                            item.expires_at < new Date().toISOString()
                          ? "Просрочен"
                          : "Активен"}
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="flex items-center gap-2">
                          <span className="hidden max-w-[220px] truncate align-middle md:inline">
                            {url}
                          </span>
                          <CopyInviteButton value={url} />
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">
                        <form action={adminDeleteInvite}>
                          <input type="hidden" name="id" value={item.id} />
                          <Button
                            type="submit"
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-[11px]"
                          >
                            Удалить
                          </Button>
                        </form>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </Card>
  );
}

