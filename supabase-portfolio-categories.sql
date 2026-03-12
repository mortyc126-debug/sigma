-- Портфолио модели: категории и подкатегории
-- category: polaroid | editorial | nude | lingerie
-- subcategory для тестовых фото: front, profile, full_body, natural_light
-- subcategory для редакционных: magazines, campaigns, runway, lookbooks
-- nude и lingerie без подкатегории (subcategory NULL)
-- NULL = старые фото без категории (блок «Прочее»)

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
