-- ============================================================
-- Sigma Models — исправление таблицы verification_tokens
-- для корректной работы NextAuth (@auth/supabase-adapter)
--
-- Запустить в Supabase → SQL Editor
-- ============================================================

-- 1) Убеждаемся, что схема next_auth существует
CREATE SCHEMA IF NOT EXISTS next_auth;

GRANT USAGE ON SCHEMA next_auth TO service_role;
GRANT ALL ON SCHEMA next_auth TO postgres;

-- 2) Удаляем неполную таблицу (если была создана без нужных колонок)
DROP TABLE IF EXISTS next_auth.verification_tokens;

-- 3) Создаём с правильной структурой (identifier + token + expires)
CREATE TABLE next_auth.verification_tokens (
  identifier  text        NOT NULL,
  token       text        NOT NULL,
  expires     timestamptz NOT NULL,
  CONSTRAINT verification_tokens_pkey          PRIMARY KEY (token),
  CONSTRAINT verification_tokens_token_unique  UNIQUE (token),
  CONSTRAINT verification_tokens_token_ident   UNIQUE (token, identifier)
);

GRANT ALL ON TABLE next_auth.verification_tokens TO postgres;
GRANT ALL ON TABLE next_auth.verification_tokens TO service_role;

-- 4) Проверяем, что остальные NextAuth-таблицы тоже существуют и правильно настроены
--    (на случай если их тоже нет)

CREATE TABLE IF NOT EXISTS next_auth.users (
  id            uuid        NOT NULL DEFAULT gen_random_uuid(),
  name          text,
  email         text        UNIQUE,
  email_verified timestamptz,
  image         text,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);

GRANT ALL ON TABLE next_auth.users TO postgres;
GRANT ALL ON TABLE next_auth.users TO service_role;

CREATE TABLE IF NOT EXISTS next_auth.accounts (
  id                    uuid    NOT NULL DEFAULT gen_random_uuid(),
  type                  text    NOT NULL,
  provider              text    NOT NULL,
  "providerAccountId"   text    NOT NULL,
  refresh_token         text,
  access_token          text,
  expires_at            bigint,
  token_type            text,
  scope                 text,
  id_token              text,
  session_state         text,
  oauth_token_secret    text,
  oauth_token           text,
  "userId"              uuid REFERENCES next_auth.users(id) ON DELETE CASCADE,
  CONSTRAINT accounts_pkey PRIMARY KEY (id)
);

GRANT ALL ON TABLE next_auth.accounts TO postgres;
GRANT ALL ON TABLE next_auth.accounts TO service_role;

CREATE TABLE IF NOT EXISTS next_auth.sessions (
  id            uuid        NOT NULL DEFAULT gen_random_uuid(),
  expires       timestamptz NOT NULL,
  "sessionToken" text       NOT NULL UNIQUE,
  "userId"      uuid REFERENCES next_auth.users(id) ON DELETE CASCADE,
  CONSTRAINT sessions_pkey PRIMARY KEY (id)
);

GRANT ALL ON TABLE next_auth.sessions TO postgres;
GRANT ALL ON TABLE next_auth.sessions TO service_role;

-- 5) Функция для синхронизации next_auth.users → public.profiles
--    (если уже есть — пересоздаём, чтобы убедиться в корректности)
CREATE OR REPLACE FUNCTION next_auth.uid() RETURNS uuid
  LANGUAGE sql STABLE
  AS $$
    SELECT COALESCE(
      NULLIF(current_setting('request.jwt.claim.sub', true), ''),
      (NULLIF(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
    )::uuid
  $$;
