import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { supabaseAdmin } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";

type Params = {
  id: string;
};

export default async function AdminModelPortfolioPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const session = await auth();
  const userId = session?.user?.id as string | undefined;

  if (!userId) {
    redirect("/login");
  }

  const { data: adminProfile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (!adminProfile || adminProfile.role !== "admin") {
    redirect("/dashboard");
  }

  const { id: modelId } = await params;

  const { data: modelRow } = await supabaseAdmin
    .from("models")
    .select(
      `
        id,
        city,
        height_cm,
        parameters,
        profiles (
          full_name,
          email
        )
      `,
    )
    .eq("id", modelId)
    .maybeSingle();

  if (!modelRow) {
    redirect("/dashboard");
  }

  const profile = modelRow.profiles as any;

  const { data: photos } = await supabaseAdmin
    .from("model_photos")
    .select("id, image_path, created_at, category, subcategory")
    .eq("model_id", modelId)
    .order("created_at", { ascending: false });

  const bucket = process.env.SUPABASE_STORAGE_BUCKET_MODELS || "models";

  const categoryLabels: Record<string, string> = {
    front: "Анфас",
    profile: "Профиль",
    full_body: "В полный рост",
    natural_light: "Естественный свет",
    magazines: "Журналы",
    campaigns: "Кампании",
    runway: "Подиум",
    lookbooks: "Лукбук",
  };
  const categoryTitles: Record<string, string> = {
    polaroid: "Тестовые фото",
    editorial: "Редакционные съёмки",
    nude: "Ню",
    lingerie: "Нижнее бельё",
  };
  const items =
    photos?.map((p: any) => ({
      id: p.id as string,
      url: supabaseAdmin.storage.from(bucket).getPublicUrl(p.image_path).data
        .publicUrl,
      created_at: p.created_at as string,
      category: p.category as string | null,
      subcategory: p.subcategory as string | null,
    })) ?? [];

  const name =
    (profile?.full_name as string | null) ??
    (profile?.email as string | null) ??
    "Модель";

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
          Портфолио модели
        </p>
        <h1 className="mt-1 text-lg font-medium tracking-[0.16em] uppercase">
          {name}
        </h1>
      </div>

      <Card className="border-border/70 bg-card/60 px-5 py-4">
        {items.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            У этой модели пока нет загруженных фотографий.
          </p>
        ) : (
          <div className="columns-2 gap-2 md:columns-3 lg:columns-4">
            {items.map((photo) => (
              <div
                key={photo.id}
                className="mb-2 overflow-hidden rounded-lg border border-border/60 bg-black/40"
              >
                <Image
                  src={photo.url}
                  alt="Фото модели"
                  width={600}
                  height={900}
                  className="h-auto w-full object-cover"
                />
                {(photo.category || photo.subcategory) && (
                  <div className="border-t border-border/40 px-2 py-1.5 text-xs uppercase tracking-wider text-muted-foreground">
                    {photo.category && categoryTitles[photo.category]}
                    {photo.subcategory && ` · ${categoryLabels[photo.subcategory] ?? photo.subcategory}`}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

