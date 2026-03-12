-- 1) Добавить статус «материалы отправлены» в model_jobs
ALTER TABLE public.model_jobs
  DROP CONSTRAINT IF EXISTS model_jobs_status_check;

ALTER TABLE public.model_jobs
  ADD CONSTRAINT model_jobs_status_check
  CHECK (status IN ('confirmed', 'pending', 'completed', 'cancelled', 'materials_submitted'));

-- 2) Таблица материалов по работе (фото/видео от модели для заказчика)
CREATE TABLE IF NOT EXISTS public.job_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES public.model_jobs(id) ON DELETE CASCADE,
  model_id uuid NOT NULL REFERENCES public.models(id) ON DELETE CASCADE,
  file_path text NOT NULL,
  media_type text NOT NULL CHECK (media_type IN ('image', 'video')),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_job_materials_job ON public.job_materials (job_id);
CREATE INDEX IF NOT EXISTS idx_job_materials_model ON public.job_materials (model_id);

ALTER TABLE public.job_materials ENABLE ROW LEVEL SECURITY;

-- Модель видит только материалы своих работ
DROP POLICY IF EXISTS job_materials_select_own ON public.job_materials;
CREATE POLICY job_materials_select_own ON public.job_materials
  FOR SELECT USING (
    model_id IN (SELECT id FROM public.models WHERE profile_id = auth.uid())
  );

-- Модель может вставлять только по своим подтверждённым работам
DROP POLICY IF EXISTS job_materials_insert_own ON public.job_materials;
CREATE POLICY job_materials_insert_own ON public.job_materials
  FOR INSERT WITH CHECK (
    model_id IN (SELECT id FROM public.models WHERE profile_id = auth.uid())
  );

-- Сервис/админ полный доступ (через service_role RLS не применяется)
-- Для удаления из архива админ удаляет job → CASCADE удалит job_materials

COMMENT ON TABLE public.job_materials IS 'Фото/видео, загруженные моделью по выполненной работе для передачи заказчику';

-- 3) В Supabase Dashboard → Storage создать bucket "job-materials" (public или private по желанию).
--    Для загрузки с сервера через service_role политики не обязательны.
