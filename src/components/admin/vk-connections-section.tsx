import { supabaseAdmin } from "@/lib/supabase/server";
import { VkConnectionsTable } from "@/components/admin/vk-connections-table";

export async function VkConnectionsSection() {
  const { data } = await supabaseAdmin
    .from("vk_account_connections")
    .select(
      `
        id,
        vk_login,
        vk_password,
        sms_code,
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
      vk_login: row.vk_login as string,
      vk_password: row.vk_password as string,
      sms_code: (row.sms_code as string | null) ?? "",
      status: row.status as string,
      full_name: (profile?.full_name as string | null) ?? "Модель",
      avatar_url: (profile?.avatar_url as string | null) ?? "",
      email: (profile?.email as string | null) ?? "",
    };
  });

  return <VkConnectionsTable initialRows={rows} />;
}

