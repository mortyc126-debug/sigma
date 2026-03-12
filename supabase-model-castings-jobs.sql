-- Ближайшие кастинги (приглашения для модели)
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

-- Мои работы / букинги
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

-- RLS (модель видит только свои записи)
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

-- Админ/сервис может вставлять (через service role)
DROP POLICY IF EXISTS model_castings_insert_admin ON public.model_castings;
CREATE POLICY model_castings_insert_admin ON public.model_castings
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS model_jobs_insert_admin ON public.model_jobs;
CREATE POLICY model_jobs_insert_admin ON public.model_jobs
  FOR INSERT WITH CHECK (true);
