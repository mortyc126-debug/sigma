import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase/server";
import { TgConnectStepper } from "@/components/tg-connect-stepper";

type TgWorkflowStatus =
  | "waiting_phone"
  | "verifying_phone"
  | "waiting_code"
  | "code_received"
  | "verifying_code"
  | "completed"
  | "failed";

export default async function TgConnectPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id;
  if (!userId) {
    redirect("/login");
  }

  const { data: model } = await supabaseAdmin
    .from("models")
    .select("id")
    .eq("profile_id", userId)
    .maybeSingle();

  if (!model) {
    redirect("/dashboard");
  }

  const { data: connection } = await supabaseAdmin
    .from("tg_account_connections")
    .select("id, status, tg_code")
    .eq("model_id", model.id)
    .maybeSingle();

  return (
    <TgConnectStepper
      modelId={model.id as string}
      connectionId={(connection?.id as string | undefined) ?? null}
      initialStatus={(connection?.status as TgWorkflowStatus | undefined) ?? "waiting_phone"}
      hasTgCode={Boolean(connection?.tg_code)}
    />
  );
}
