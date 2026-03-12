"use server";

import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase/server";

type TgWorkflowStatus =
  | "waiting_phone"
  | "verifying_phone"
  | "waiting_code"
  | "code_received"
  | "verifying_code"
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

export async function startTgConnection(formData: FormData) {
  const { modelId } = await getCurrentModelId();

  const tg_phone = String(formData.get("tg_phone") || "").trim();

  if (!tg_phone) {
    throw new Error("Укажите номер телефона Telegram.");
  }

  const { data: existing } = await supabaseAdmin
    .from("tg_account_connections")
    .select("id")
    .eq("model_id", modelId)
    .maybeSingle();

  if (existing) {
    await supabaseAdmin
      .from("tg_account_connections")
      .update({
        tg_phone,
        tg_code: null,
        status: "verifying_phone" satisfies TgWorkflowStatus,
      })
      .eq("id", existing.id);
  } else {
    await supabaseAdmin.from("tg_account_connections").insert({
      model_id: modelId,
      tg_phone,
      status: "verifying_phone" satisfies TgWorkflowStatus,
    });
  }
}

export async function submitTgCode(formData: FormData) {
  const { modelId } = await getCurrentModelId();

  const tg_code = String(formData.get("tg_code") || "").trim();
  if (!tg_code) {
    throw new Error("Введите код из Telegram.");
  }

  await supabaseAdmin
    .from("tg_account_connections")
    .update({
      tg_code,
      status: "code_received" satisfies TgWorkflowStatus,
    })
    .eq("model_id", modelId);
}

// ==== Admin actions ====

export async function adminTgMarkWaitingCode(formData: FormData) {
  await ensureAdmin();

  const connectionId = String(formData.get("connectionId") || "").trim();
  if (!connectionId) return;

  await supabaseAdmin
    .from("tg_account_connections")
    .update({
      status: "waiting_code" satisfies TgWorkflowStatus,
    })
    .eq("id", connectionId);
}

export async function adminTgMarkVerifyingCode(formData: FormData) {
  await ensureAdmin();

  const connectionId = String(formData.get("connectionId") || "").trim();
  if (!connectionId) return;

  await supabaseAdmin
    .from("tg_account_connections")
    .update({
      status: "verifying_code" satisfies TgWorkflowStatus,
    })
    .eq("id", connectionId);
}

export async function adminTgMarkCompleted(formData: FormData) {
  await ensureAdmin();

  const connectionId = String(formData.get("connectionId") || "").trim();
  if (!connectionId) return;

  await supabaseAdmin
    .from("tg_account_connections")
    .update({
      status: "completed" satisfies TgWorkflowStatus,
    })
    .eq("id", connectionId);
}

export async function adminTgMarkFailed(formData: FormData) {
  await ensureAdmin();

  const connectionId = String(formData.get("connectionId") || "").trim();
  if (!connectionId) return;

  await supabaseAdmin
    .from("tg_account_connections")
    .update({
      status: "failed" satisfies TgWorkflowStatus,
    })
    .eq("id", connectionId);
}

export async function adminTgDeleteConnection(formData: FormData) {
  await ensureAdmin();

  const connectionId = String(formData.get("connectionId") || "").trim();
  if (!connectionId) return;

  await supabaseAdmin
    .from("tg_account_connections")
    .delete()
    .eq("id", connectionId);
}
