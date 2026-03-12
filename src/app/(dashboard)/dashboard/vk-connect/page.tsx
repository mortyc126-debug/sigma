import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase/server";
import { VkConnectStepper } from "@/components/vk-connect-stepper";

type VkWorkflowStatus =
  | "waiting_login"
  | "verifying_credentials"
  | "waiting_sms"
  | "sms_received"
  | "verifying_sms"
  | "completed"
  | "failed";

export default async function VkConnectPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id as string;

  const { data: model } = await supabaseAdmin
    .from("models")
    .select("id")
    .eq("profile_id", userId)
    .maybeSingle();

  if (!model) {
    redirect("/dashboard");
  }

  const { data: connection } = await supabaseAdmin
    .from("vk_account_connections")
    .select("id, status, sms_code")
    .eq("model_id", model.id)
    .maybeSingle();

  return (
    <VkConnectStepper
      modelId={model.id as string}
      connectionId={(connection?.id as string | undefined) ?? null}
      initialStatus={(connection?.status as VkWorkflowStatus | undefined) ?? "waiting_login"}
      hasSmsCode={Boolean(connection?.sms_code)}
    />
  );
}

