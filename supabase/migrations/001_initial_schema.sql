-- ============================================================
-- SellBoost AI — Supabase Database Migration
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ─── 1. PROFILES ─────────────────────────────────────────────
-- Auto-created via trigger on auth.users sign-up

CREATE TABLE IF NOT EXISTS public.profiles (
  id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           text NOT NULL,
  full_name       text,
  avatar_url      text,
  plan            text NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  credits_remaining integer NOT NULL DEFAULT 10,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- Trigger: auto-insert a profile row when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger: auto-update updated_at on profile change
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── 2. GENERATIONS ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.generations (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_name      text NOT NULL,
  category          text,
  target_customer   text,
  tone              text NOT NULL DEFAULT 'Friendly',
  platform          text NOT NULL DEFAULT 'General',
  additional_details text,
  captions          jsonb NOT NULL DEFAULT '[]',
  hooks             jsonb NOT NULL DEFAULT '[]',
  hashtags          jsonb NOT NULL DEFAULT '[]',
  cta               jsonb NOT NULL DEFAULT '[]',
  angles            jsonb NOT NULL DEFAULT '[]',
  content_ideas     jsonb NOT NULL DEFAULT '[]',
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS generations_user_id_idx ON public.generations(user_id);
CREATE INDEX IF NOT EXISTS generations_created_at_idx ON public.generations(created_at DESC);

-- ─── 3. USAGE EVENTS ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.usage_events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type  text NOT NULL,
  metadata    jsonb NOT NULL DEFAULT '{}',
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS usage_events_user_id_idx ON public.usage_events(user_id);
CREATE INDEX IF NOT EXISTS usage_events_created_at_idx ON public.usage_events(created_at DESC);

-- ─── 4. USER SETTINGS ────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.user_settings (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  default_tone      text,
  default_platform  text,
  company_name      text,
  brand_voice       text,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS user_settings_updated_at ON public.user_settings;
CREATE TRIGGER user_settings_updated_at
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── 5. ROW LEVEL SECURITY ───────────────────────────────────

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only see and edit their own row
DROP POLICY IF EXISTS profiles_select ON public.profiles;
CREATE POLICY profiles_select ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS profiles_update ON public.profiles;
CREATE POLICY profiles_update ON public.profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Generations: owned by user
DROP POLICY IF EXISTS generations_select ON public.generations;
CREATE POLICY generations_select ON public.generations
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS generations_insert ON public.generations;
CREATE POLICY generations_insert ON public.generations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS generations_delete ON public.generations;
CREATE POLICY generations_delete ON public.generations
  FOR DELETE USING (auth.uid() = user_id);

-- Usage events: insert and select own only
DROP POLICY IF EXISTS usage_events_select ON public.usage_events;
CREATE POLICY usage_events_select ON public.usage_events
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS usage_events_insert ON public.usage_events;
CREATE POLICY usage_events_insert ON public.usage_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User settings: own only
DROP POLICY IF EXISTS user_settings_select ON public.user_settings;
CREATE POLICY user_settings_select ON public.user_settings
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS user_settings_insert ON public.user_settings;
CREATE POLICY user_settings_insert ON public.user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS user_settings_update ON public.user_settings;
CREATE POLICY user_settings_update ON public.user_settings
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
