import { unstable_noStore } from "next/cache";
import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase/server";
import Image from "next/image";
import { Card } from "@/components/ui/card";

export async function ModelOverviewSection() {
  unstable_noStore();
  const session = await auth();
  const userId = session?.user?.id as string | undefined;

  if (!userId) return null;

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("full_name, email, avatar_url, avatar_position_x, avatar_position_y")
    .eq("id", userId)
    .maybeSingle();

  const { data: model } = await supabaseAdmin
    .from("models")
    .select("id, city, height_cm, parameters, eye_color, hair_color")
    .eq("profile_id", userId)
    .maybeSingle();

  const modelId = model?.id as string | undefined;

  const { data: vkConnection } = modelId
    ? await supabaseAdmin
        .from("vk_account_connections")
        .select("status")
        .eq("model_id", modelId)
        .maybeSingle()
    : { data: null as any };

  const { data: photos } = modelId
    ? await supabaseAdmin
        .from("model_photos")
        .select("id, image_path, created_at")
        .eq("model_id", modelId)
        .order("created_at", { ascending: false })
        .limit(3)
    : { data: null as any };

  const bucket = process.env.SUPABASE_STORAGE_BUCKET_MODELS || "models";
  const previewPhotos =
    photos?.map((p: any) => ({
      id: p.id as string,
      url: supabaseAdmin.storage.from(bucket).getPublicUrl(p.image_path).data
        .publicUrl,
    })) ?? [];

  const avatarPosX =
    profile?.avatar_position_x != null
      ? Number(profile.avatar_position_x)
      : 50;
  const avatarPosY =
    profile?.avatar_position_y != null
      ? Number(profile.avatar_position_y)
      : 50;
  const name = profile?.full_name || profile?.email || "Модель";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <Card className="border-border/70 bg-card/60 px-4 py-4 sm:px-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-border/70 bg-black/50 ring-1 ring-border/30 text-sm font-medium tracking-[0.16em] uppercase">
            {profile?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar_url}
                alt={name}
                className="absolute inset-0 h-full w-full rounded-full object-cover"
                style={{
                  objectPosition: `${Number.isNaN(avatarPosX) ? 50 : avatarPosX}% ${Number.isNaN(avatarPosY) ? 50 : avatarPosY}%`,
                  transform: "translateZ(0)",
                }}
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center">
                {initials || "SM"}
              </span>
            )}
          </div>
          <div className="space-y-1 text-xs md:text-sm">
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Профиль модели
            </p>
            <p className="text-sm font-medium tracking-[0.12em] uppercase">
              {name}
            </p>
            <p className="text-xs text-muted-foreground">
              {model?.city || "Город не указан"}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs md:text-xs">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
              Рост
            </p>
            <p className="mt-1 text-sm">
              {model?.height_cm ? `${model.height_cm} см` : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
              Параметры
            </p>
            <p className="mt-1 text-sm">
              {model?.parameters || "—"}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
              Цвет глаз
            </p>
            <p className="mt-1 text-sm">
              {model?.eye_color || "—"}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
              Цвет волос
            </p>
            <p className="mt-1 text-sm">
              {model?.hair_color || "—"}
            </p>
          </div>
        </div>
      </div>
      {previewPhotos.length > 0 && (
        <div className="mt-4 border-t border-border/40 pt-4">
          <p className="mb-2 text-xs uppercase tracking-[0.26em] text-muted-foreground">
            Превью портфолио
          </p>
          <div className="flex gap-2">
            {previewPhotos.map((photo) => (
              <div
                key={photo.id}
                className="relative h-28 w-20 overflow-hidden rounded-md border border-border/60 bg-black/60"
              >
                <Image
                  src={photo.url}
                  alt="Фото портфолио"
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {!vkConnection || vkConnection.status !== "completed" ? (
        <div className="mt-4 rounded-lg border border-dashed border-border/60 bg-card/40 px-4 py-3 text-xs text-muted-foreground">
          <p className="font-medium uppercase tracking-[0.2em] text-amber-200/90">
            Подключите VK
          </p>
          <p className="mt-1">
            Для полного доступа к возможностям агентства добавьте аккаунт VK в
            разделе{" "}
            <a
              href="/dashboard/vk-connect"
              className="text-primary underline-offset-4 hover:underline"
            >
              «Подключение VK»
            </a>
            .
          </p>
        </div>
      ) : null}
    </Card>
  );
}

