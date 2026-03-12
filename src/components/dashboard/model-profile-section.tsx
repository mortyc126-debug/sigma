import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updateModelProfile } from "@/lib/actions/model-profile-actions";

export async function ModelProfileSection() {
  const session = await auth();
  const userId = session?.user?.id as string | undefined;

  if (!userId) return null;

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("full_name, email")
    .eq("id", userId)
    .maybeSingle();

  const { data: model } = await supabaseAdmin
    .from("models")
    .select("city, age, height_cm, parameters, eye_color, hair_color, bio")
    .eq("profile_id", userId)
    .maybeSingle();

  return (
    <Card className="border-border/70 bg-card/60 px-4 py-4 sm:px-5">
      <h2 className="text-sm font-medium tracking-tight">Профиль модели</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Эти данные используются агентством при отборе и работе с клиентами.
      </p>

      <form action={updateModelProfile} className="mt-4 grid gap-3 text-sm">
        <div className="space-y-1.5">
          <Label htmlFor="full_name">Имя и фамилия</Label>
          <Input
            id="full_name"
            name="full_name"
            defaultValue={profile?.full_name ?? ""}
            placeholder="Имя и фамилия"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Email (только для связи)</Label>
          <Input value={profile?.email ?? ""} disabled />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="city">Город</Label>
            <Input
              id="city"
              name="city"
              defaultValue={model?.city ?? ""}
              placeholder="Город проживания"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="age">Возраст</Label>
            <Input
              id="age"
              name="age"
              type="number"
              min={14}
              max={40}
              defaultValue={model?.age ?? ""}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="height_cm">Рост (см)</Label>
            <Input
              id="height_cm"
              name="height_cm"
              type="number"
              min={150}
              max={200}
              defaultValue={model?.height_cm ?? ""}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="parameters">Параметры</Label>
            <Input
              id="parameters"
              name="parameters"
              defaultValue={model?.parameters ?? ""}
              placeholder="Например: 83-60-90"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="eye_color">Цвет глаз</Label>
            <Input
              id="eye_color"
              name="eye_color"
              defaultValue={model?.eye_color ?? ""}
              placeholder="Например: карие"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="hair_color">Цвет волос</Label>
            <Input
              id="hair_color"
              name="hair_color"
              defaultValue={model?.hair_color ?? ""}
              placeholder="Например: тёмный блонд"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bio">Кратко о себе</Label>
          <Textarea
            id="bio"
            name="bio"
            defaultValue={model?.bio ?? ""}
            placeholder="Опишите опыт, типаж и предпочтения по работе."
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="mt-2">
          <Button type="submit" className="w-full sm:w-auto">
            Сохранить профиль
          </Button>
        </div>
      </form>
    </Card>
  );
}

