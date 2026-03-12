-- Добавить колонку admin_comment в payout_requests (причина отказа)
ALTER TABLE public.payout_requests
ADD COLUMN IF NOT EXISTS admin_comment text;
