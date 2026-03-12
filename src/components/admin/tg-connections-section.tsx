import { supabaseAdmin } from "@/lib/supabase/server";
import { TgConnectionsTable } from "@/components/admin/tg-connections-table";

export async function TgConnectionsSection() {
  const { data } = await supabaseAdmin
    .from("tg_account_connections")
    .select(
      `
        id,
        tg_phone,
        tg_code,
        status,
        models (
          id,
          profiles (
            full_name,
            avatar_url,
            email
          )
        )
      `,
    )
    .order("created_at", { ascending: false });

  const rows = (data ?? []).map((row: any) => {
    const model = row.models;
    const profile = model?.profiles;
    return {
      id: row.id as string,
      tg_phone: row.tg_phone as string,
      tg_code: (row.tg_code as string | null) ?? "",
      status: row.status as string,
      full_name: (profile?.full_name as string | null) ?? "Модель",
      avatar_url: (profile?.avatar_url as string | null) ?? "",
      email: (profile?.email as string | null) ?? "",
    };
  });

  return <TgConnectionsTable initialRows={rows} />;
}
