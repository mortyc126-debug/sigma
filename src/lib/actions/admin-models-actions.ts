"use server";

import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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

export async function adminAdjustBalance(formData: FormData) {
  await ensureAdmin();

  const modelId = String(formData.get("model_id") || "").trim();
  const amountStr = String(formData.get("amount") || "").trim();
  const description = String(formData.get("description") || "").trim();

  const amount = Number(amountStr.replace(",", "."));

  if (!modelId || !amount || !Number.isFinite(amount)) {
    throw new Error("Укажите модель и корректную сумму.");
  }

  // Добавляем транзакцию и обновляем баланс.
  await supabaseAdmin.from("transactions").insert({
    model_id: modelId,
    kind: "credit",
    amount,
    description: description || null,
  });

  await supabaseAdmin.rpc("adjust_model_balance", {
    p_model_id: modelId,
    p_delta: amount,
  });

  revalidatePath("/dashboard");
}

