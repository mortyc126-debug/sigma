import { supabaseAdmin } from "@/lib/supabase/server";
import { ModelsTableWithSearch, type ModelRow } from "./models-table-with-search";

export async function ModelsSection() {
  const { data } = await supabaseAdmin
    .from("models")
    .select(
      `
        id,
        city,
        age,
        height_cm,
        parameters,
        profiles (
          full_name,
          email
        ),
        balances (
          amount
        ),
        vk_account_connections (
          status
        )
      `,
    )
    .order("created_at", { ascending: false });

  const rows: ModelRow[] =
    data?.map((row: any) => {
      const profile = row.profiles;
      const balance = row.balances?.[0];
      const vk = row.vk_account_connections?.[0];
      return {
        id: row.id as string,
        full_name: (profile?.full_name as string | null) ?? "Модель",
        email: (profile?.email as string | null) ?? "",
        city: (row.city as string | null) ?? "",
        age: (row.age as number | null) ?? null,
        height_cm: (row.height_cm as number | null) ?? null,
        parameters: (row.parameters as string | null) ?? "",
        balance: (balance?.amount as number | null) ?? 0,
        vk_status: (vk?.status as string | null) ?? "not_connected",
      };
    }) ?? [];

  return <ModelsTableWithSearch rows={rows} />;
}

