-- Позиция области аватара (какая часть фото показывается), в процентах 0–100
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS avatar_position_x numeric DEFAULT 50;

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS avatar_position_y numeric DEFAULT 50;
