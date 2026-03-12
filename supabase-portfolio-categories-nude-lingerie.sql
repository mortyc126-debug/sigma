-- Добавить категории портфолио: Ню, Нижнее бельё
-- Выполнить после supabase-portfolio-categories.sql
-- Если колонка category уже есть с ограничением, снимаем старый CHECK и вешаем новый.

ALTER TABLE public.model_photos
DROP CONSTRAINT IF EXISTS model_photos_category_check;

ALTER TABLE public.model_photos
ADD CONSTRAINT model_photos_category_check
  CHECK (category IS NULL OR category IN ('polaroid', 'editorial', 'nude', 'lingerie'));

COMMENT ON COLUMN public.model_photos.category IS 'polaroid | editorial | nude | lingerie';
