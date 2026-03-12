-- Описание/подробности для кастинга и работы (видит модель по кнопке «Подробнее»)
ALTER TABLE public.model_castings
  ADD COLUMN IF NOT EXISTS details text;

ALTER TABLE public.model_jobs
  ADD COLUMN IF NOT EXISTS details text;

COMMENT ON COLUMN public.model_castings.details IS 'Подробное описание, задачи, контакты — заполняет админ, видит модель';
COMMENT ON COLUMN public.model_jobs.details IS 'Подробное описание, задачи — заполняет админ, видит модель';
