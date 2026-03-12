import { supabaseAdmin } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  adminCreateCasting,
  adminCreateJob,
} from "@/lib/actions/admin-castings-actions";

export async function CastingsJobsSection() {
  const { data: models } = await supabaseAdmin
    .from("models")
    .select(
      `
      id,
      profiles ( full_name, email )
    `
    )
    .order("created_at", { ascending: false });

  const modelOptions =
    models?.map((m: any) => {
      const p = Array.isArray(m.profiles) ? m.profiles[0] : m.profiles;
      const label = [p?.full_name, p?.email].filter(Boolean).join(" · ") || m.id;
      return { id: m.id as string, label };
    }) ?? [];

  return (
    <div className="space-y-4">
      <Card className="border-border/70 bg-card/60 px-5 py-4">
        <h3 className="text-sm font-medium tracking-tight">
          Добавить кастинг
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Приглашение на кастинг появится у модели во вкладке «Работы и букинги».
        </p>
        <form
          action={adminCreateCasting}
          className="mt-4 grid gap-3 text-xs sm:grid-cols-2 lg:grid-cols-3"
        >
          <div className="space-y-1.5">
            <Label htmlFor="casting_model_id">Модель</Label>
            <select
              id="casting_model_id"
              name="model_id"
              required
              className="h-9 w-full rounded-lg border border-input bg-background px-2.5 py-1 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring [&_option]:bg-background [&_option]:text-foreground"
            >
              <option value="">Выберите модель</option>
              {modelOptions.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="casting_brand">Бренд / проект</Label>
            <Input id="casting_brand" name="brand" required placeholder="Напр. Zara" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="casting_type">Тип</Label>
            <Input id="casting_type" name="type" required placeholder="Кастинг, примерка" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="casting_location">Локация</Label>
            <Input id="casting_location" name="location" placeholder="Москва, студия" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="casting_date">Дата</Label>
            <Input
              id="casting_date"
              name="casting_date"
              type="date"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="casting_time">Время</Label>
            <Input id="casting_time" name="casting_time" placeholder="14:00" />
          </div>
          <div className="sm:col-span-2 lg:col-span-3 space-y-1.5">
            <Label htmlFor="casting_details">Подробнее (задачи, контакты — видит модель)</Label>
            <Textarea
              id="casting_details"
              name="details"
              placeholder="Адрес студии, контакт координатора, что взять с собой..."
              rows={3}
              className="min-h-[72px] resize-y text-sm"
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <Button type="submit" size="sm">
              Создать кастинг
            </Button>
          </div>
        </form>
      </Card>

      <Card className="border-border/70 bg-card/60 px-5 py-4">
        <h3 className="text-sm font-medium tracking-tight">
          Добавить работу / букинг
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Работа появится у модели в блоке «Мои работы».
        </p>
        <form
          action={adminCreateJob}
          className="mt-4 grid gap-3 text-xs sm:grid-cols-2 lg:grid-cols-3"
        >
          <div className="space-y-1.5">
            <Label htmlFor="job_model_id">Модель</Label>
            <select
              id="job_model_id"
              name="model_id"
              required
              className="h-9 w-full rounded-lg border border-input bg-background px-2.5 py-1 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring [&_option]:bg-background [&_option]:text-foreground"
            >
              <option value="">Выберите модель</option>
              {modelOptions.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="job_title">Название</Label>
            <Input id="job_title" name="title" required placeholder="Кампания Zara SS26" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="job_type">Тип</Label>
            <Input id="job_type" name="type" required placeholder="Lookbook, реклама" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="job_location">Локация</Label>
            <Input id="job_location" name="location" placeholder="Москва" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="job_fee">Гонорар</Label>
            <Input id="job_fee" name="fee" placeholder="15000 или 15 000 ₽" />
          </div>
          <div className="sm:col-span-2 lg:col-span-3 space-y-1.5">
            <Label htmlFor="job_details">Подробнее (задачи — видит модель)</Label>
            <Textarea
              id="job_details"
              name="details"
              placeholder="Конкретные задачи, референсы, контакт на площадке..."
              rows={3}
              className="min-h-[72px] resize-y text-sm"
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <Button type="submit" size="sm">
              Добавить работу
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
