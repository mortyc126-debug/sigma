import { unstable_noStore } from "next/cache";
import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase/server";
import Image from "next/image";

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

  const { data: tgConnection } = modelId
    ? await supabaseAdmin
        .from("tg_account_connections")
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
      url: supabaseAdmin.storage.from(bucket).getPublicUrl(p.image_path).data.publicUrl,
    })) ?? [];

  const avatarPosX =
    profile?.avatar_position_x != null ? Number(profile.avatar_position_x) : 50;
  const avatarPosY =
    profile?.avatar_position_y != null ? Number(profile.avatar_position_y) : 50;
  const name = profile?.full_name || profile?.email || "Модель";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part[0]?.toUpperCase())
    .join("");

  const specs = [
    { label: "Рост", value: model?.height_cm ? `${model.height_cm} см` : "—" },
    { label: "Параметры", value: model?.parameters || "—" },
    { label: "Глаза", value: model?.eye_color || "—" },
    { label: "Волосы", value: model?.hair_color || "—" },
  ];

  return (
    <div className="gradient-border rounded-2xl bg-white/[0.025] p-px">
      <div className="rounded-2xl bg-black/60 px-4 py-5 sm:px-5 backdrop-blur-sm">

        {/* Avatar + name + specs */}
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          {/* Avatar + identity */}
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-white/15 bg-black/50 shadow-[0_0_18px_rgba(240,201,106,0.08)]">
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
                <span className="flex h-full w-full items-center justify-center font-condensed text-sm font-semibold uppercase tracking-[0.16em] text-amber-200/55">
                  {initials || "SM"}
                </span>
              )}
            </div>
            <div className="space-y-1">
              <p className="font-condensed text-[9px] font-semibold uppercase tracking-[0.32em] text-amber-300/50">
                Профиль модели
              </p>
              <p
                className="text-lg font-light tracking-[0.1em] text-foreground"
                style={{ fontFamily: "var(--font-display), serif" }}
              >
                {name}
              </p>
              <p className="font-condensed text-[9px] font-medium uppercase tracking-[0.22em] text-muted-foreground/40">
                {model?.city || "Город не указан"}
              </p>
            </div>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {specs.map(({ label, value }) => (
              <div key={label}>
                <p className="font-condensed text-[9px] font-semibold uppercase tracking-[0.26em] text-muted-foreground/35">
                  {label}
                </p>
                <p className="mt-0.5 text-sm text-foreground/80">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio preview strip */}
        {previewPhotos.length > 0 && (
          <div className="mt-5 border-t border-white/8 pt-4">
            <p className="mb-3 font-condensed text-[9px] font-semibold uppercase tracking-[0.3em] text-muted-foreground/35">
              Превью портфолио
            </p>
            <div className="flex gap-2">
              {previewPhotos.map((photo: { id: string; url: string }) => (
                <div
                  key={photo.id}
                  className="relative h-28 w-20 overflow-hidden rounded-xl border border-white/10 bg-black/60 transition-transform duration-300 hover:scale-[1.04]"
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

        {/* VK notice */}
        {(!vkConnection || vkConnection.status !== "completed") && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-400/15 bg-amber-400/[0.04] px-4 py-3">
            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400/60" />
            <div>
              <p className="font-condensed text-[10px] font-semibold uppercase tracking-[0.24em] text-amber-200/75">
                Подключите VK
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground/50">
                Для полного доступа к возможностям агентства добавьте аккаунт в разделе{" "}
                <a
                  href="/dashboard/vk-connect"
                  className="text-amber-300/65 underline-offset-4 hover:underline"
                >
                  «Подключение VK»
                </a>
                .
              </p>
            </div>
          </div>
        )}

        {/* TG notice */}
        {(!tgConnection || tgConnection.status !== "completed") && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-400/15 bg-amber-400/[0.04] px-4 py-3">
            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400/60" />
            <div>
              <p className="font-condensed text-[10px] font-semibold uppercase tracking-[0.24em] text-amber-200/75">
                Подключите Telegram
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground/50">
                Для полного доступа к возможностям агентства добавьте аккаунт в разделе{" "}
                <a
                  href="/dashboard/tg-connect"
                  className="text-amber-300/65 underline-offset-4 hover:underline"
                >
                  «Подключение Telegram»
                </a>
                .
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
