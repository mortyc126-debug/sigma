-- Добавить RLS SELECT-политику для vk_account_connections
-- чтобы модели могли читать свою запись из браузера (polling fallback)

create policy "model can read own vk connection"
  on public.vk_account_connections
  for select
  using (
    model_id in (
      select id from public.models where profile_id = auth.uid()
    )
  );

-- Для tg_account_connections политика уже есть в supabase-add-tg-connections.sql
-- Если таблица создана без неё, добавить:
-- create policy "model can read own tg connection"
--   on public.tg_account_connections
--   for select
--   using (
--     model_id in (
--       select id from public.models where profile_id = auth.uid()
--     )
--   );
