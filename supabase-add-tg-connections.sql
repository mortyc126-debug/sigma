-- Migration: add tg_account_connections table
-- Аналогична vk_account_connections, но для Telegram

create table if not exists public.tg_account_connections (
  id         uuid primary key default gen_random_uuid(),
  model_id   uuid not null references public.models(id) on delete cascade,
  tg_phone   text not null,
  tg_code    text,
  status     text not null default 'waiting_phone',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (model_id)
);

-- Автоматически обновляем updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger tg_account_connections_updated_at
  before update on public.tg_account_connections
  for each row execute procedure public.set_updated_at();

-- RLS: только сервисная роль (supabaseAdmin) может читать/писать
alter table public.tg_account_connections enable row level security;

-- Политика для авторизованных пользователей — читать только свою запись
create policy "model can read own tg connection"
  on public.tg_account_connections
  for select
  using (
    model_id in (
      select id from public.models where profile_id = auth.uid()
    )
  );
