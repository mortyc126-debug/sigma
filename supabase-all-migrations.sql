-- ============================================================
-- Sigma Models — все миграции для Supabase (один файл)
-- Выполнять по порядку в SQL Editor. Повторный запуск безопасен (IF NOT EXISTS / DROP IF EXISTS).
-- ============================================================

-- 1) Причина отказа по заявке на вывод
ALTER TABLE public.payout_requests
ADD COLUMN IF NOT EXISTS admin_comment text;

-- 2) Связь транзакции с заявкой на вывод (статус в истории операций)
ALTER TABLE public.transactions
ADD COLUMN IF NOT EXISTS payout_request_id uuid REFERENCES public.payout_requests(id);

-- 3) Позиция области аватара (проценты 0–100)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS avatar_position_x numeric DEFAULT 50;
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS avatar_position_y numeric DEFAULT 50;

-- 4) Категории портфолио (тестовые фото, редакционные, ню, нижнее бельё)
ALTER TABLE public.model_photos
ADD COLUMN IF NOT EXISTS category text
  CHECK (category IS NULL OR category IN ('polaroid', 'editorial', 'nude', 'lingerie'));

ALTER TABLE public.model_photos
ADD COLUMN IF NOT EXISTS subcategory text
  CHECK (
    subcategory IS NULL
    OR subcategory IN (
      'front', 'profile', 'full_body', 'natural_light',
      'magazines', 'campaigns', 'runway', 'lookbooks'
    )
  );

COMMENT ON COLUMN public.model_photos.category IS 'polaroid | editorial | nude | lingerie';
COMMENT ON COLUMN public.model_photos.subcategory IS 'Тестовые фото: front, profile, full_body, natural_light. Редакционные: magazines, campaigns, runway, lookbooks.';

-- Если колонка category уже была с двумя категориями — обновить CHECK до четырёх:
ALTER TABLE public.model_photos
DROP CONSTRAINT IF EXISTS model_photos_category_check;

ALTER TABLE public.model_photos
ADD CONSTRAINT model_photos_category_check
  CHECK (category IS NULL OR category IN ('polaroid', 'editorial', 'nude', 'lingerie'));

-- 5) Ближайшие кастинги
CREATE TABLE IF NOT EXISTS public.model_castings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id uuid NOT NULL REFERENCES public.models(id) ON DELETE CASCADE,
  brand text NOT NULL,
  type text NOT NULL,
  location text,
  casting_date date NOT NULL,
  casting_time text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'declined')),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_model_castings_model_date
  ON public.model_castings (model_id, casting_date);

-- 6) Мои работы / букинги
CREATE TABLE IF NOT EXISTS public.model_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id uuid NOT NULL REFERENCES public.models(id) ON DELETE CASCADE,
  title text NOT NULL,
  type text NOT NULL,
  location text,
  status text DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'pending', 'completed', 'cancelled')),
  fee text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_model_jobs_model
  ON public.model_jobs (model_id);

-- RLS для model_castings и model_jobs
ALTER TABLE public.model_castings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.model_jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS model_castings_select_own ON public.model_castings;
CREATE POLICY model_castings_select_own ON public.model_castings
  FOR SELECT USING (
    model_id IN (SELECT id FROM public.models WHERE profile_id = auth.uid())
  );

DROP POLICY IF EXISTS model_jobs_select_own ON public.model_jobs;
CREATE POLICY model_jobs_select_own ON public.model_jobs
  FOR SELECT USING (
    model_id IN (SELECT id FROM public.models WHERE profile_id = auth.uid())
  );

DROP POLICY IF EXISTS model_castings_insert_admin ON public.model_castings;
CREATE POLICY model_castings_insert_admin ON public.model_castings
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS model_jobs_insert_admin ON public.model_jobs;
CREATE POLICY model_jobs_insert_admin ON public.model_jobs
  FOR INSERT WITH CHECK (true);
