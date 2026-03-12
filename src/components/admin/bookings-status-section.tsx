import { supabaseAdmin } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adminCompleteJob, adminDeleteJobArchive } from "@/lib/actions/admin-castings-actions";
import { AdminRejectMaterialsButton } from "./admin-reject-materials-button";
import { formatFee } from "@/lib/utils";

const BUCKET_JOB_MATERIALS = process.env.SUPABASE_STORAGE_BUCKET_JOB_MATERIALS || "job-materials";

const STATUS_CASTING: Record<string, string> = {
  pending: "Ожидает",
  confirmed: "Подтверждён",
  declined: "Отклонён",
};
const STATUS_JOB: Record<string, string> = {
  pending: "В процессе",
  confirmed: "Подтверждена",
  completed: "Выполнена",
  cancelled: "Отменена",
  materials_submitted: "Материалы отправлены",
};

export async function BookingsStatusSection() {
  const [castingsRes, jobsRes] = await Promise.all([
    supabaseAdmin
      .from("model_castings")
      .select("id, model_id, brand, type, casting_date, casting_time, status")
      .order("casting_date", { ascending: false })
      .limit(50),
    supabaseAdmin
      .from("model_jobs")
      .select("id, model_id, title, type, fee, status")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const modelIds = new Set<string>();
  (castingsRes.data ?? []).forEach((c: any) => modelIds.add(c.model_id));
  (jobsRes.data ?? []).forEach((j: any) => modelIds.add(j.model_id));
  const ids = Array.from(modelIds);
  const modelNames: Record<string, string> = {};
  if (ids.length > 0) {
    const { data: models } = await supabaseAdmin
      .from("models")
      .select("id, profiles(full_name, email)")
      .in("id", ids);
    (models ?? []).forEach((m: any) => {
      const p = Array.isArray(m.profiles) ? m.profiles[0] : m.profiles;
      modelNames[m.id] = [p?.full_name, p?.email].filter(Boolean).join(" · ") || "—";
    });
  }

  const castings = (castingsRes.data ?? []).map((c: any) => ({
    id: c.id,
    modelName: modelNames[c.model_id] ?? c.model_id,
    brand: c.brand,
    type: c.type,
    date: c.casting_date,
    time: c.casting_time,
    status: c.status,
  }));
  const jobs = (jobsRes.data ?? []).map((j: any) => ({
    id: j.id,
    modelName: modelNames[j.model_id] ?? j.model_id,
    title: j.title,
    type: j.type,
    fee: j.fee,
    status: j.status,
  }));

  const jobIds = jobs.map((j) => j.id);
  const { data: materialsRows } = jobIds.length > 0
    ? await supabaseAdmin.from("job_materials").select("job_id, file_path, media_type").in("job_id", jobIds)
    : { data: [] };
  const materialsByJob: Record<string, { file_path: string; media_type: string }[]> = {};
  (materialsRows ?? []).forEach((m: any) => {
    if (!materialsByJob[m.job_id]) materialsByJob[m.job_id] = [];
    materialsByJob[m.job_id].push({ file_path: m.file_path, media_type: m.media_type });
  });

  return (
    <div className="space-y-4">
      <Card className="border-border/70 bg-card/60 px-4 py-4 sm:px-5">
        <h3 className="mb-3 text-sm font-medium tracking-tight">Кастинги — статусы</h3>
        <p className="mb-3 text-xs text-muted-foreground">
          Взяла или отклонила модель. Показываются только приглашения с действием модели.
        </p>
        {castings.length === 0 ? (
          <p className="text-xs text-muted-foreground">Нет кастингов.</p>
        ) : (
          <div className="overflow-x-auto [&_table]:min-w-[520px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Модель</TableHead>
                  <TableHead>Бренд · тип</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead>Статус</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {castings.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="text-sm">{c.modelName}</TableCell>
                    <TableCell className="text-sm">{c.brand} · {c.type}</TableCell>
                    <TableCell className="text-sm">{c.date} {c.time ? c.time : ""}</TableCell>
                    <TableCell className="text-sm">{STATUS_CASTING[c.status] ?? c.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      <Card className="border-border/70 bg-card/60 px-4 py-4 sm:px-5">
        <h3 className="mb-3 text-sm font-medium tracking-tight">Работы — статусы и выполнение</h3>
        <p className="mb-3 text-xs text-muted-foreground">
          Подтверждённая модель — «Подтвердить выполнение»: гонорар на баланс, карточка снимается. Модель может отправить материалы (фото/видео) — они появятся в колонке «Материалы». «Удалить из архива» — убрать работу после отправки заказчику.
        </p>
        {jobs.length === 0 ? (
          <p className="text-xs text-muted-foreground">Нет работ.</p>
        ) : (
          <div className="overflow-x-auto [&_table]:min-w-[800px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Модель</TableHead>
                  <TableHead>Работа</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>Гонорар</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Материалы</TableHead>
                  <TableHead className="w-[200px]">Действие</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((j) => {
                  const materials = materialsByJob[j.id] ?? [];
                  const hasMaterials = materials.length > 0;
                  const canComplete = j.status === "confirmed" || j.status === "materials_submitted";
                  const canRejectMaterials = j.status === "materials_submitted";
                  const canDeleteArchive = j.status === "materials_submitted" || j.status === "completed";
                  return (
                    <TableRow key={j.id}>
                      <TableCell className="text-sm">{j.modelName}</TableCell>
                      <TableCell className="text-sm">{j.title}</TableCell>
                      <TableCell className="text-sm">{j.type}</TableCell>
                      <TableCell className="text-sm">{formatFee(j.fee) || "—"}</TableCell>
                      <TableCell className="text-sm">{STATUS_JOB[j.status] ?? j.status}</TableCell>
                      <TableCell className="text-sm">
                        {hasMaterials ? (
                          <div className="flex flex-wrap gap-1">
                            {materials.slice(0, 5).map((m, i) => (
                              <a
                                key={i}
                                href={supabaseAdmin.storage.from(BUCKET_JOB_MATERIALS).getPublicUrl(m.file_path).data.publicUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary underline underline-offset-2"
                              >
                                {m.media_type === "video" ? "Видео" : "Фото"} {i + 1}
                              </a>
                            ))}
                            {materials.length > 5 && <span className="text-xs text-muted-foreground">+{materials.length - 5}</span>}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {canComplete && (
                            <form action={adminCompleteJob}>
                              <input type="hidden" name="job_id" value={j.id} />
                              <Button type="submit" size="sm" variant="default" className="text-xs">
                                Подтвердить выполнение
                              </Button>
                            </form>
                          )}
                          {canRejectMaterials && <AdminRejectMaterialsButton jobId={j.id} />}
                          {canDeleteArchive && (
                            <form action={adminDeleteJobArchive}>
                              <input type="hidden" name="job_id" value={j.id} />
                              <Button type="submit" size="sm" variant="outline" className="text-xs">
                                Удалить из архива
                              </Button>
                            </form>
                          )}
                          {!canComplete && !canRejectMaterials && !canDeleteArchive && <span className="text-xs text-muted-foreground">—</span>}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}
