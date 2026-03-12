import Image from "next/image";
import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  uploadModelPhoto,
  deleteModelPhoto,
  setModelAvatar,
} from "@/lib/actions/model-profile-actions";
import { SetAvatarButton } from "./set-avatar-button";
import { PortfolioUploadFields } from "./portfolio-upload-form";
import { PortfolioCardWrapper } from "./portfolio-card-wrapper";
import {
  POLAROID_SUBCATEGORIES,
  EDITORIAL_SUBCATEGORIES,
} from "@/lib/portfolio-categories";

type PhotoItem = {
  id: string;
  path: string;
  url: string;
  category: string | null;
  subcategory: string | null;
};

function groupPhotos(items: PhotoItem[]) {
  const polaroid: Record<string, PhotoItem[]> = {};
  const editorial: Record<string, PhotoItem[]> = {};
  const nude: PhotoItem[] = [];
  const lingerie: PhotoItem[] = [];
  const other: PhotoItem[] = [];

  POLAROID_SUBCATEGORIES.forEach((s) => {
    polaroid[s.value] = [];
  });
  EDITORIAL_SUBCATEGORIES.forEach((s) => {
    editorial[s.value] = [];
  });

  for (const p of items) {
    if (p.category === "nude") {
      nude.push(p);
    } else if (p.category === "lingerie") {
      lingerie.push(p);
    } else if (p.category === "polaroid" && p.subcategory && polaroid[p.subcategory]) {
      polaroid[p.subcategory].push(p);
    } else if (p.category === "editorial" && p.subcategory && editorial[p.subcategory]) {
      editorial[p.subcategory].push(p);
    } else {
      other.push(p);
    }
  }

  return { polaroid, editorial, nude, lingerie, other };
}

export async function ModelPortfolioSection() {
  const session = await auth();
  const userId = session?.user?.id as string | undefined;
  if (!userId) return null;

  const { data: model } = await supabaseAdmin
    .from("models")
    .select("id")
    .eq("profile_id", userId)
    .maybeSingle();

  if (!model) return null;

  const { data: photos } = await supabaseAdmin
    .from("model_photos")
    .select("id, image_path, created_at, category, subcategory")
    .eq("model_id", model.id)
    .order("created_at", { ascending: false });

  const bucket = process.env.SUPABASE_STORAGE_BUCKET_MODELS || "models";

  const items: PhotoItem[] =
    photos?.map((p: any) => ({
      id: p.id as string,
      path: p.image_path as string,
      url: supabaseAdmin.storage.from(bucket).getPublicUrl(p.image_path).data
        .publicUrl,
      category: p.category ?? null,
      subcategory: p.subcategory ?? null,
    })) ?? [];

  const { polaroid, editorial, nude, lingerie, other } = groupPhotos(items);

  const renderPhotoCard = (photo: PhotoItem) => (
    <PortfolioCardWrapper key={photo.id} className="mb-2">
      <div className="overflow-hidden rounded-lg border border-border/60 bg-black/40 transition-colors hover:border-border/80 hover:shadow-lg">
        <Image
        src={photo.url}
        alt="Фото модели"
        width={400}
        height={600}
        className="h-auto w-full object-cover"
      />
      <div className="flex items-center justify-between gap-2 border-t border-border/40 p-2">
        <form action={deleteModelPhoto} className="flex-1">
          <input type="hidden" name="photo_id" value={photo.id} />
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="h-7 w-full border-border/70 px-2 text-xs"
          >
            Удалить
          </Button>
        </form>
        <div className="flex-1">
          <SetAvatarButton
            photoId={photo.id}
            imageUrl={photo.url}
            setModelAvatar={setModelAvatar}
          />
        </div>
      </div>
      </div>
    </PortfolioCardWrapper>
  );

  const renderSubsection = (title: string, list: PhotoItem[]) =>
    list.length > 0 ? (
      <div key={title} className="mb-6">
        <h4 className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {title}
        </h4>
        <div className="columns-2 gap-2 md:columns-3 lg:columns-4">
          {list.map(renderPhotoCard)}
        </div>
      </div>
    ) : null;

  return (
    <Card className="border-border/70 bg-card/60 px-4 py-4 sm:px-5">
      <div className="mb-4 rounded-lg border border-border/50 bg-muted/20 px-4 py-3">
        <p className="text-sm leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground/90">Конфиденциальность материалов.</span>{" "}
          Все загруженные фотографии используются исключительно для продвижения вашей карьеры
          и подбора проектов агентством. Доступ к портфолио имеют только уполномоченные
          сотрудники Sigma Models и клиенты в рамках согласованных кастингов. Третьи лица
          к вашим материалам не допускаются.
        </p>
      </div>
      <div className="space-y-3" id="portfolio">
        <h2 className="text-sm font-medium tracking-tight">Портфолио</h2>
        <p className="text-xs text-muted-foreground">
          Загружайте фото по категориям: тестовые фото, редакционные съёмки,
          ню, нижнее бельё. Агентство использует их при подборе проектов и
          презентации клиентам.
        </p>
        <form
          action={uploadModelPhoto}
          encType="multipart/form-data"
          className="mt-3 flex flex-col gap-3 text-xs"
        >
          <PortfolioUploadFields />
        </form>
      </div>

      {items.length === 0 ? (
        <p className="mt-4 text-xs text-muted-foreground">
          Фотографии пока не загружены. Выберите категорию и подкатегорию и
          добавьте первые фото.
        </p>
      ) : (
        <div className="mt-6 space-y-6 border-t border-border/40 pt-6">
          {/* Тестовые фото (polaroid) */}
          <section>
            <h3 className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-foreground">
              Тестовые фото
            </h3>
            <p className="mb-3 text-xs text-muted-foreground">
              анфас · профиль · в полный рост · естественный свет
            </p>
            {POLAROID_SUBCATEGORIES.map((s) =>
              renderSubsection(s.label, polaroid[s.value]),
            )}
          </section>

          {/* Редакционные съёмки (editorial) */}
          <section>
            <h3 className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-foreground">
              Редакционные съёмки
            </h3>
            <p className="mb-3 text-xs text-muted-foreground">
              журналы · кампании · подиум · лукбук
            </p>
            {EDITORIAL_SUBCATEGORIES.map((s) =>
              renderSubsection(s.label, editorial[s.value]),
            )}
          </section>

          {/* Ню */}
          {nude.length > 0 && (
            <section>
              <h3 className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-foreground">
                Ню
              </h3>
              <div className="columns-2 gap-2 md:columns-3 lg:columns-4">
                {nude.map(renderPhotoCard)}
              </div>
            </section>
          )}

          {/* Нижнее бельё */}
          {lingerie.length > 0 && (
            <section>
              <h3 className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-foreground">
                Нижнее бельё
              </h3>
              <div className="columns-2 gap-2 md:columns-3 lg:columns-4">
                {lingerie.map(renderPhotoCard)}
              </div>
            </section>
          )}

          {/* Без категории */}
          {other.length > 0 && (
            <section>
              <h3 className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                Прочее
              </h3>
              <p className="mb-3 text-xs text-muted-foreground">
                Фото, загруженные до введения категорий
              </p>
              <div className="columns-2 gap-2 md:columns-3 lg:columns-4">
                {other.map(renderPhotoCard)}
              </div>
            </section>
          )}
        </div>
      )}
    </Card>
  );
}
