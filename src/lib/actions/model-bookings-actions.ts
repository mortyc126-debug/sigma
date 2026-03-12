"use server";

import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function confirmCasting(formData: FormData) {
  const castingId = String(formData.get("id") ?? "").trim();
  if (!castingId) return;
  await confirmCastingById(castingId);
}

export async function declineCasting(formData: FormData) {
  const castingId = String(formData.get("id") ?? "").trim();
  if (!castingId) return;
  await declineCastingById(castingId);
}

export async function confirmJob(formData: FormData) {
  const jobId = String(formData.get("id") ?? "").trim();
  if (!jobId) return;
  await confirmJobById(jobId);
}

export async function declineJob(formData: FormData) {
  const jobId = String(formData.get("id") ?? "").trim();
  if (!jobId) return;
  await declineJobById(jobId);
}

export async function submitJobMaterials(formData: FormData) {
  const jobId = String(formData.get("job_id") ?? "").trim();
  if (!jobId) throw new Error("Работа не указана.");

  const modelId = await getCurrentModelId();
  if (!modelId) throw new Error("Необходима авторизация.");

  const { data: job, error: jobError } = await supabaseAdmin
    .from("model_jobs")
    .select("id, model_id, status")
    .eq("id", jobId)
    .eq("model_id", modelId)
    .maybeSingle();

  if (jobError || !job) throw new Error("Работа не найдена.");
  if (job.status !== "confirmed") throw new Error("Материалы можно отправить только по подтверждённой работе.");

  const files = formData.getAll("files") as File[];
  const validFiles = files.filter((f) => f && f.size > 0 && f.name);
  if (validFiles.length === 0) throw new Error("Добавьте хотя бы один файл (фото или видео).");

  const bucket = process.env.SUPABASE_STORAGE_BUCKET_JOB_MATERIALS || "job-materials";
  const maxSize = 100 * 1024 * 1024; // 100 MB per file
  const imageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const videoTypes = ["video/mp4", "video/webm", "video/quicktime"];

  const rows: { job_id: string; model_id: string; file_path: string; media_type: "image" | "video" }[] = [];

  for (const file of validFiles) {
    if (file.size > maxSize) throw new Error(`Файл ${file.name} превышает 100 МБ.`);
    const isImage = imageTypes.includes(file.type);
    const isVideo = videoTypes.includes(file.type);
    if (!isImage && !isVideo) throw new Error(`Недопустимый тип файла: ${file.name}. Используйте фото (JPG, PNG, WebP, GIF) или видео (MP4, WebM).`);

    const ext = file.name.split(".").pop() || (isImage ? "jpg" : "mp4");
    const path = `${jobId}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(path, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      const msg = uploadError.message?.toLowerCase().includes("bucket not found")
        ? `Бакет хранилища не найден. Создайте в Supabase Dashboard → Storage бакет «${bucket}» (public).`
        : `Ошибка загрузки ${file.name}: ${uploadError.message}`;
      throw new Error(msg);
    }

    rows.push({
      job_id: jobId,
      model_id: modelId,
      file_path: path,
      media_type: isImage ? "image" : "video",
    });
  }

  const { error: insertError } = await supabaseAdmin.from("job_materials").insert(rows);
  if (insertError) throw new Error(insertError.message);

  await supabaseAdmin.from("model_jobs").update({ status: "materials_submitted", admin_comment: null }).eq("id", jobId);
  revalidatePath("/dashboard");
}

async function getCurrentModelId(): Promise<string | null> {
  const session = await auth();
  const userId = session?.user?.id as string | undefined;
  if (!userId) return null;
  const { data } = await supabaseAdmin
    .from("models")
    .select("id")
    .eq("profile_id", userId)
    .maybeSingle();
  return data?.id ?? null;
}

async function confirmCastingById(castingId: string) {
  const modelId = await getCurrentModelId();
  if (!modelId) throw new Error("Необходима авторизация.");
  const { error } = await supabaseAdmin
    .from("model_castings")
    .update({ status: "confirmed" })
    .eq("id", castingId)
    .eq("model_id", modelId);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}

async function declineCastingById(castingId: string) {
  const modelId = await getCurrentModelId();
  if (!modelId) throw new Error("Необходима авторизация.");
  const { error } = await supabaseAdmin
    .from("model_castings")
    .update({ status: "declined" })
    .eq("id", castingId)
    .eq("model_id", modelId);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}

async function confirmJobById(jobId: string) {
  const modelId = await getCurrentModelId();
  if (!modelId) throw new Error("Необходима авторизация.");
  const { error } = await supabaseAdmin
    .from("model_jobs")
    .update({ status: "confirmed" })
    .eq("id", jobId)
    .eq("model_id", modelId);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}

async function declineJobById(jobId: string) {
  const modelId = await getCurrentModelId();
  if (!modelId) throw new Error("Необходима авторизация.");
  const { error } = await supabaseAdmin
    .from("model_jobs")
    .update({ status: "cancelled" })
    .eq("id", jobId)
    .eq("model_id", modelId);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}
