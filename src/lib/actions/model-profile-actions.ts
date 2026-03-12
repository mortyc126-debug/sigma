"use server";

import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function getCurrentModel() {
  const session = await auth();
  const userId = session?.user?.id as string | undefined;

  if (!userId) {
    throw new Error("Необходима авторизация модели.");
  }

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", userId)
    .maybeSingle();

  if (!profile) {
    throw new Error("Профиль модели не найден.");
  }

  let { data: model } = await supabaseAdmin
    .from("models")
    .select("id")
    .eq("profile_id", profile.id)
    .maybeSingle();

  if (!model) {
    // Для администратора создаём анкету модели и начальный баланс при первом входе в режим модели.
    if ((profile as any).role === "admin") {
      const { data: createdModel } = await supabaseAdmin
        .from("models")
        .insert({ profile_id: profile.id })
        .select("id")
        .single();

      if (!createdModel) {
        throw new Error("Не удалось создать анкету модели для администратора.");
      }

      model = createdModel;

      await supabaseAdmin.from("balances").insert({
        model_id: model.id,
        amount: 0,
        currency: "RUB",
      });
    } else {
      throw new Error("Анкета модели не найдена.");
    }
  }

  return { profile, model };
}

export async function updateModelProfile(formData: FormData) {
  const { profile, model } = await getCurrentModel();

  const full_name = String(formData.get("full_name") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const age = Number(formData.get("age") || 0);
  const height_cm = Number(formData.get("height_cm") || 0);
  const parameters = String(formData.get("parameters") || "").trim();
  const eye_color = String(formData.get("eye_color") || "").trim();
  const hair_color = String(formData.get("hair_color") || "").trim();
  const bio = String(formData.get("bio") || "").trim();

  await supabaseAdmin
    .from("profiles")
    .update({
      full_name: full_name || profile.full_name,
    })
    .eq("id", profile.id);

  await supabaseAdmin
    .from("models")
    .update({
      city: city || null,
      age: age || null,
      height_cm: height_cm || null,
      parameters: parameters || null,
      eye_color: eye_color || null,
      hair_color: hair_color || null,
      bio: bio || null,
    })
    .eq("id", model.id);

  revalidatePath("/dashboard");
}

export async function uploadModelPhoto(formData: FormData) {
  const { model } = await getCurrentModel();

  const file = formData.get("photo") as File | null;
  if (!file) {
    throw new Error("Файл не найден.");
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Поддерживаются только JPG, PNG и WebP.");
  }

  const maxSizeBytes = 10 * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    throw new Error("Размер файла не должен превышать 10 МБ.");
  }

  const bucket = process.env.SUPABASE_STORAGE_BUCKET_MODELS || "models";
  const extension = file.name.split(".").pop() || "jpg";
  const path = `${model.id}/${crypto.randomUUID()}.${extension}`;

  const allowedCategories = ["polaroid", "editorial", "nude", "lingerie"];
  const allowedSubcategories = [
    "front", "profile", "full_body", "natural_light",
    "magazines", "campaigns", "runway", "lookbooks",
  ];
  let category = String(formData.get("category") || "").trim() || null;
  let subcategory = String(formData.get("subcategory") || "").trim() || null;
  if (category && !allowedCategories.includes(category)) category = null;
  if (subcategory && !allowedSubcategories.includes(subcategory)) subcategory = null;
  if (category === "nude" || category === "lingerie") subcategory = null;

  const { error: uploadError } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  await supabaseAdmin.from("model_photos").insert({
    model_id: model.id,
    image_path: path,
    ...(category && { category }),
    ...(subcategory && { subcategory }),
  });

  revalidatePath("/dashboard");
}

export async function deleteModelPhoto(formData: FormData) {
  const { model } = await getCurrentModel();
  const id = String(formData.get("photo_id") || "").trim();
  if (!id) return;

  const { data, error } = await supabaseAdmin
    .from("model_photos")
    .select("id, image_path, model_id")
    .eq("id", id)
    .maybeSingle();

  if (error || !data || data.model_id !== model.id) {
    throw new Error("Фотография не найдена.");
  }

  const bucket = process.env.SUPABASE_STORAGE_BUCKET_MODELS || "models";

  await supabaseAdmin.storage.from(bucket).remove([data.image_path]);

  await supabaseAdmin.from("model_photos").delete().eq("id", id);

  revalidatePath("/dashboard");
}

export async function setModelAvatar(formData: FormData) {
  const { profile, model } = await getCurrentModel();
  const photoId = String(formData.get("photo_id") || "").trim();
  if (!photoId) return;

  const { data: photo, error } = await supabaseAdmin
    .from("model_photos")
    .select("id, image_path, model_id")
    .eq("id", photoId)
    .maybeSingle();

  if (error || !photo || photo.model_id !== model.id) {
    throw new Error("Фотография не найдена.");
  }

  const bucket = process.env.SUPABASE_STORAGE_BUCKET_MODELS || "models";
  const publicUrl = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(photo.image_path).data.publicUrl;

  const positionX = Math.min(
    100,
    Math.max(0, Number(formData.get("position_x")) || 50),
  );
  const positionY = Math.min(
    100,
    Math.max(0, Number(formData.get("position_y")) || 50),
  );

  await supabaseAdmin
    .from("profiles")
    .update({
      avatar_url: publicUrl,
      avatar_position_x: positionX,
      avatar_position_y: positionY,
    })
    .eq("id", profile.id);

  revalidatePath("/dashboard");
}

