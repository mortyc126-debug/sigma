-- Комментарий админа при отклонении материалов (модель видит и может загрузить заново)
ALTER TABLE public.model_jobs
  ADD COLUMN IF NOT EXISTS admin_comment text;

COMMENT ON COLUMN public.model_jobs.admin_comment IS 'Замечания админа при отклонении материалов по работе; видит модель';
