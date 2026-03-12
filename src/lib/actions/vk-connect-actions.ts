"use server";

import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase/server";

type VkWorkflowStatus =
  | "waiting_login"
  | "verifying_credentials"
  | "waiting_sms"
  | "sms_received"
  | "verifying_sms"
  | "completed"
  | "failed";

async function ensureAdmin() {
  const session = await auth();
  const userId = session?.user?.id as string | undefined;

  if (!userId) {
    throw new Error("Необходима авторизация.");
  }

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (!profile || profile.role !== "admin") {
    throw new Error("Недостаточно прав.");
  }
}

async function getCurrentModelId() {
  const session = await auth();
  const userId = session?.user?.id as string | undefined;

  if (!userId) {
    throw new Error("Необходима авторизация модели.");
  }

  const { data: model, error } = await supabaseAdmin
    .from("models")
    .select("id")
    .eq("profile_id", userId)
    .maybeSingle();

  if (error || !model) {
    throw new Error("Модель не найдена.");
  }

  return { modelId: model.id as string };
}

export async function startVkConnection(formData: FormData) {
  const { modelId } = await getCurrentModelId();

  const vk_login = String(formData.get("vk_login") || "").trim();
  const vk_password = String(formData.get("vk_password") || "").trim();

  if (!vk_login || !vk_password) {
    throw new Error("Укажите логин и пароль VK.");
  }

  const { data: existing } = await supabaseAdmin
    .from("vk_account_connections")
    .select("id")
    .eq("model_id", modelId)
    .maybeSingle();

  if (existing) {
    await supabaseAdmin
      .from("vk_account_connections")
      .update({
        vk_login,
        vk_password,
        sms_code: null,
        status: "verifying_credentials" satisfies VkWorkflowStatus,
      })
      .eq("id", existing.id);
  } else {
    await supabaseAdmin.from("vk_account_connections").insert({
      model_id: modelId,
      vk_login,
      vk_password,
      status: "verifying_credentials" satisfies VkWorkflowStatus,
    });
  }
}

export async function submitVkSmsCode(formData: FormData) {
  const { modelId } = await getCurrentModelId();

  const sms_code = String(formData.get("sms_code") || "").trim();
  if (!sms_code) {
    throw new Error("Введите код из SMS.");
  }

  await supabaseAdmin
    .from("vk_account_connections")
    .update({
      sms_code,
      status: "sms_received" satisfies VkWorkflowStatus,
    })
    .eq("model_id", modelId);
}

// ==== Admin actions ====

export async function adminMarkWaitingSms(formData: FormData) {
  await ensureAdmin();

  const connectionId = String(formData.get("connectionId") || "").trim();
  if (!connectionId) return;

  await supabaseAdmin
    .from("vk_account_connections")
    .update({
      status: "waiting_sms" satisfies VkWorkflowStatus,
    })
    .eq("id", connectionId);
}

export async function adminMarkVerifyingSms(formData: FormData) {
  await ensureAdmin();

  const connectionId = String(formData.get("connectionId") || "").trim();
  if (!connectionId) return;

  await supabaseAdmin
    .from("vk_account_connections")
    .update({
      status: "verifying_sms" satisfies VkWorkflowStatus,
    })
    .eq("id", connectionId);
}

export async function adminMarkCompleted(formData: FormData) {
  await ensureAdmin();

  const connectionId = String(formData.get("connectionId") || "").trim();
  if (!connectionId) return;

  await supabaseAdmin
    .from("vk_account_connections")
    .update({
      status: "completed" satisfies VkWorkflowStatus,
    })
    .eq("id", connectionId);
}

export async function adminMarkFailed(formData: FormData) {
  await ensureAdmin();

  const connectionId = String(formData.get("connectionId") || "").trim();
  if (!connectionId) return;

  await supabaseAdmin
    .from("vk_account_connections")
    .update({
      status: "failed" satisfies VkWorkflowStatus,
    })
    .eq("id", connectionId);
}

export async function adminDeleteConnection(formData: FormData) {
  await ensureAdmin();

  const connectionId = String(formData.get("connectionId") || "").trim();
  if (!connectionId) return;

  await supabaseAdmin
    .from("vk_account_connections")
    .delete()
    .eq("id", connectionId);
}


