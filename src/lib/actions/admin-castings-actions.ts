"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase/server";
import { parseFeeToNumber } from "@/lib/utils";

async function ensureAdmin() {
  const session = await auth();
  const userId = session?.user?.id as string | undefined;
  if (!userId) throw new Error("Необходима авторизация.");
  const { data: profile } = await supabaseAdmin.from("profiles").select("role").eq("id", userId).maybeSingle();
  if (!profile || profile.role !== "admin") throw new Error("Недостаточно прав.");
}

export async function adminCreateCasting(formData: FormData) {
  const modelId = formData.get("model_id") as string | null;
  const brand = formData.get("brand") as string | null;
  const type = formData.get("type") as string | null;
  const location = (formData.get("location") as string | null) || null;
  const castingDate = formData.get("casting_date") as string | null;
  const castingTime = (formData.get("casting_time") as string | null) || null;
  const details = (formData.get("details") as string | null)?.trim() || null;

  if (!modelId?.trim() || !brand?.trim() || !type?.trim() || !castingDate?.trim()) {
    throw new Error("Заполните: модель, бренд, тип и дату кастинга.");
  }

  const { error } = await supabaseAdmin.from("model_castings").insert({
    model_id: modelId.trim(),
    brand: brand.trim(),
    type: type.trim(),
    location: location?.trim() || null,
    casting_date: castingDate.trim(),
    casting_time: castingTime?.trim() || null,
    details,
    status: "pending",
  });

  if (error) throw new Error(error.message || "Ошибка создания кастинга.");
  revalidatePath("/dashboard");
}

export async function adminCreateJob(formData: FormData) {
  const modelId = formData.get("model_id") as string | null;
  const title = formData.get("title") as string | null;
  const type = formData.get("type") as string | null;
  const location = (formData.get("location") as string | null) || null;
  const fee = (formData.get("fee") as string | null) || null;
  const details = (formData.get("details") as string | null)?.trim() || null;

  if (!modelId?.trim() || !title?.trim() || !type?.trim()) {
    throw new Error("Заполните: модель, название работы и тип.");
  }

  const { error } = await supabaseAdmin.from("model_jobs").insert({
    model_id: modelId.trim(),
    title: title.trim(),
    type: type.trim(),
    location: location?.trim() || null,
    fee: fee?.trim() || null,
    details,
    status: "pending",
  });

  if (error) throw new Error(error.message || "Ошибка создания работы.");
  revalidatePath("/dashboard");
}

export async function adminCompleteJob(formData: FormData) {
  await ensureAdmin();
  const jobId = String(formData.get("job_id") ?? "").trim();
  if (!jobId) return;

  const { data: job, error: fetchError } = await supabaseAdmin
    .from("model_jobs")
    .select("id, model_id, title, fee, status")
    .eq("id", jobId)
    .maybeSingle();

  if (fetchError || !job) throw new Error("Работа не найдена.");
  const allowed = job.status === "confirmed" || job.status === "materials_submitted";
  if (!allowed) throw new Error("Подтвердить выполнение можно только для работ со статусом «Подтверждена» или «Материалы отправлены».");

  const amount = parseFeeToNumber(job.fee);
  if (amount > 0) {
    await supabaseAdmin.from("transactions").insert({
      model_id: job.model_id,
      kind: "credit",
      amount,
      description: `Выполнение работы: ${job.title || "Работа"}`,
    });
    await supabaseAdmin.rpc("adjust_model_balance", {
      p_model_id: job.model_id,
      p_delta: amount,
    });
  }

  await supabaseAdmin.from("model_jobs").update({ status: "completed" }).eq("id", jobId);
  revalidatePath("/dashboard");
}

export async function adminDeleteJobArchive(formData: FormData) {
  await ensureAdmin();
  const jobId = String(formData.get("job_id") ?? "").trim();
  if (!jobId) return;

  const { data: materials } = await supabaseAdmin
    .from("job_materials")
    .select("file_path")
    .eq("job_id", jobId);

  const bucket = process.env.SUPABASE_STORAGE_BUCKET_JOB_MATERIALS || "job-materials";
  if (materials?.length) {
    await supabaseAdmin.storage.from(bucket).remove(materials.map((m) => m.file_path));
  }

  await supabaseAdmin.from("model_jobs").delete().eq("id", jobId);
  revalidatePath("/dashboard");
}

export async function adminRejectMaterials(formData: FormData) {
  await ensureAdmin();
  const jobId = String(formData.get("job_id") ?? "").trim();
  const comment = String(formData.get("comment") ?? "").trim();
  if (!jobId) return;
  if (!comment) throw new Error("Укажите комментарий для модели.");

  const { data: job, error: fetchError } = await supabaseAdmin
    .from("model_jobs")
    .select("id, status")
    .eq("id", jobId)
    .maybeSingle();

  if (fetchError || !job) throw new Error("Работа не найдена.");
  if (job.status !== "materials_submitted") throw new Error("Отклонить материалы можно только когда модель уже отправила материалы.");

  const { error: updateError } = await supabaseAdmin
    .from("model_jobs")
    .update({ status: "confirmed", admin_comment: comment })
    .eq("id", jobId);

  if (updateError) throw new Error(updateError.message);
  revalidatePath("/dashboard");
}
