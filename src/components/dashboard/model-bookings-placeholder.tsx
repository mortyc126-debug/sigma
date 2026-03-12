import { unstable_noStore } from "next/cache";
import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { formatFee } from "@/lib/utils";
import { CastingCard, type CastingItem } from "./casting-card";
import { JobCard, type JobItem } from "./job-card";
import { confirmCasting, declineCasting, confirmJob, declineJob, submitJobMaterials } from "@/lib/actions/model-bookings-actions";
import { CalendarDays, MapPin } from "lucide-react";

const CHECKLIST = [
  {
    key: "profile",
    label: "Заполнить параметры в профиле",
    href: "/dashboard?tab=profile",
    section: "Профиль",
    isDone: (data: { hasProfileData: boolean }) => data.hasProfileData,
  },
  {
    key: "portfolio",
    label: "Добавить фото в портфолио",
    href: "/dashboard?tab=portfolio",
    section: "Портфолио",
    isDone: (data: { photoCount: number }) => data.photoCount > 0,
  },
  {
    key: "vk",
    label: "Подключить аккаунт VK",
    href: "/dashboard/vk-connect",
    section: "Подключение VK",
    isDone: (data: { vkConnected: boolean }) => data.vkConnected,
  },
];

export async function ModelBookingsPlaceholder() {
  unstable_noStore();
  const session = await auth();
  const userId = session?.user?.id as string | undefined;
  if (!userId) return null;

  const { data: model } = await supabaseAdmin
    .from("models")
    .select("id")
    .eq("profile_id", userId)
    .maybeSingle();
  if (!model) return null;

  let castings: CastingItem[] = [];
  let jobs: JobItem[] = [];

  try {
    const [castingsRes, jobsRes] = await Promise.all([
      supabaseAdmin
        .from("model_castings")
        .select("id, brand, type, location, casting_date, casting_time, status, details")
        .eq("model_id", model.id)
        .eq("status", "pending")
        .gte("casting_date", new Date().toISOString().slice(0, 10))
        .order("casting_date", { ascending: true })
        .limit(10),
      supabaseAdmin
        .from("model_jobs")
        .select("id, title, type, location, status, fee, details, admin_comment")
        .eq("model_id", model.id)
        .in("status", ["pending", "confirmed"])
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

    if (!castingsRes.error && castingsRes.data?.length) {
      castings = castingsRes.data.map((c: any) => ({
        id: c.id,
        brand: c.brand || "",
        type: c.type || "",
        location: c.location || "",
        date: c.casting_date ? new Date(c.casting_date).toLocaleDateString("ru-RU", { day: "numeric", month: "long" }) : "",
        time: c.casting_time || "",
        status: c.status,
        details: c.details?.trim() || null,
      }));
    }
    if (!jobsRes.error && jobsRes.data?.length) {
      jobs = jobsRes.data.map((j: any) => ({
        id: j.id,
        title: j.title || "",
        type: j.type || "",
        location: j.location || "",
        status: j.status || "",
        fee: formatFee(j.fee) || "",
        details: j.details?.trim() || null,
        admin_comment: j.admin_comment?.trim() || null,
      }));
    }
  } catch {
    // Таблицы model_castings / model_jobs могут отсутствовать
  }

  const [modelRow, photosRes, vkRes] = await Promise.all([
    supabaseAdmin
      .from("models")
      .select("height_cm, city, parameters")
      .eq("id", model.id)
      .maybeSingle(),
    supabaseAdmin
      .from("model_photos")
      .select("id", { count: "exact", head: true })
      .eq("model_id", model.id),
    supabaseAdmin
      .from("vk_account_connections")
      .select("status")
      .eq("model_id", model.id)
      .eq("status", "completed")
      .maybeSingle(),
  ]);

  const hasProfileData = Boolean(
    modelRow?.height_cm || modelRow?.city || (modelRow?.parameters && String(modelRow.parameters).trim()),
  );
  const photoCount = photosRes.count ?? 0;
  const vkConnected = Boolean(vkRes.data);

  const checklistData = { hasProfileData, photoCount, vkConnected };
  const itemsToShow = CHECKLIST.filter((item) => !item.isDone(checklistData));

  return (
    <div className="space-y-4">
      {/* Ближайшие кастинги */}
      <Card className="border-border/70 bg-card/60 px-4 py-4 sm:px-5">
        <h3 className="text-sm font-medium tracking-tight">
          Ближайшие кастинги
        </h3>
        {castings.length > 0 ? (
          <ul className="mt-3 space-y-2">
            {castings.map((c) => (
              <li key={c.id}>
                <CastingCard
                  casting={c}
                  confirmCasting={confirmCasting}
                  declineCasting={declineCasting}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-dashed border-border/50 bg-muted/10 px-4 py-5">
            <MapPin className="h-5 w-5 shrink-0 text-muted-foreground/60" />
            <div>
              <p className="text-xs font-medium text-foreground/90">Кастинги</p>
              <p className="text-xs text-muted-foreground">
                Пока нет новых приглашений
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Работы и букинги — описание */}
      <Card className="border-border/70 bg-card/60 px-4 py-4 sm:px-5">
        <div className="space-y-2">
          <h2 className="text-sm font-medium tracking-tight">
            Работы и букинги
          </h2>
          <p className="text-xs text-muted-foreground">
            Здесь появляются подтверждённые съёмки, кампании и показы,
            которые агентство организует для вас.
          </p>
        </div>
      </Card>

      {/* Мои работы */}
      <Card className="border-border/70 bg-card/60 px-4 py-4 sm:px-5">
        <div className="mb-3">
          <h3 className="text-sm font-medium tracking-tight">Мои работы</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Подтверждённые съёмки, кампании и показы
          </p>
        </div>
        {jobs.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:gap-5" suppressHydrationWarning>
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                confirmJob={confirmJob}
                declineJob={declineJob}
                submitJobMaterials={submitJobMaterials}
              />
            ))}
          </div>
        ) : (
          <div className="mt-3 rounded-lg border border-border/60 bg-background/20 px-4 py-4 text-xs text-muted-foreground">
            <p className="font-medium text-foreground/90">
              Пока у вас нет зафиксированных работ в системе Sigma Models.
            </p>
            <p className="mt-1">
              Как только вы начнёте участвовать в проектах агентства, здесь
              появится список кампаний, гонораров и статусов выплат.
            </p>
          </div>
        )}
      </Card>

      {itemsToShow.length > 0 && (
        <Card className="border-border/70 bg-card/60 px-4 py-4 sm:px-5" suppressHydrationWarning>
          <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Что сделать дальше
          </h3>
          <ul className="mt-3 space-y-2">
            {itemsToShow.map((item) => (
              <li key={item.key}>
                <a
                  href={item.href}
                  suppressHydrationWarning
                  className="flex items-center gap-3 rounded-lg border border-border/50 bg-background/30 px-3 py-2 text-xs transition-colors hover:border-primary/50 hover:bg-background/50 hover:text-foreground"
                >
                  <span className="flex-1 text-foreground/90">{item.label}</span>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    {item.section} →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card className="border-border/70 bg-card/60 px-4 py-4 sm:px-5">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          <span>Ближайшие события</span>
        </div>
        <div className="mt-3 rounded-lg border border-dashed border-border/50 px-4 py-6 text-center text-xs text-muted-foreground">
          <p>Пока нет запланированных кастингов или съёмок.</p>
          <p className="mt-1">
            Когда агентство назначит вас на проект, он появится здесь.
          </p>
        </div>
      </Card>
    </div>
  );
}
