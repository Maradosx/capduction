-- ============================================================
-- Capduction — Migration 004: Studios v2 (Script + Combo + Projects + Brand Voice)
-- Run AFTER 001, 002, 003
-- ============================================================
--
-- Changes from SellBoost schema:
-- 1. Restructure `generations` to support multi-studio (script/caption/combo)
--    via `studio` enum + JSON `payload` (was: caption-only columns)
-- 2. Add `projects` table (group generations per product/campaign)
-- 3. Add `brand_voices` table (memory for tone/style)
-- 4. Add `duration` column to generations (for script timing)
-- 5. Rename plan tiers: starter→studio, pro→agency
-- 6. Extend user_settings with default_duration
-- ============================================================

-- ─── 1. Rename plan tiers to match Capduction pricing ─────────────────────────
-- (Existing constraint allows free/pro/enterprise → update to free/studio/agency)
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_plan_check;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_plan_check
  CHECK (plan IN ('free', 'studio', 'agency'));

-- Migrate any existing data
UPDATE public.profiles SET plan = 'studio' WHERE plan = 'starter';
UPDATE public.profiles SET plan = 'agency' WHERE plan = 'pro' OR plan = 'enterprise';

-- Update plan_credits table from migration 003
UPDATE public.plan_credits SET plan = 'studio',  credits = 500   WHERE plan = 'starter';
UPDATE public.plan_credits SET plan = 'agency',  credits = 99999 WHERE plan = 'pro';

INSERT INTO public.plan_credits (plan, credits, description) VALUES
  ('free',   10,    'One-time allocation on signup'),
  ('studio', 500,   'Refreshed monthly on invoice.paid'),
  ('agency', 99999, 'Refreshed monthly on invoice.paid')
ON CONFLICT (plan) DO UPDATE SET
  credits = EXCLUDED.credits,
  description = EXCLUDED.description;

-- ─── 2. PROJECTS table ─────────────────────────────────────
-- Groups generations under a named project (product / campaign / theme)
CREATE TABLE IF NOT EXISTS public.projects (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name         text NOT NULL,
  description  text,
  cover_color  text,                -- hex e.g. "#FF8FB5"
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS projects_user_id_idx ON public.projects(user_id);

DROP TRIGGER IF EXISTS projects_updated_at ON public.projects;
CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS projects_select ON public.projects;
CREATE POLICY projects_select ON public.projects
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS projects_insert ON public.projects;
CREATE POLICY projects_insert ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS projects_update ON public.projects;
CREATE POLICY projects_update ON public.projects
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS projects_delete ON public.projects;
CREATE POLICY projects_delete ON public.projects
  FOR DELETE USING (auth.uid() = user_id);

-- ─── 3. BRAND VOICES table ─────────────────────────────────
CREATE TABLE IF NOT EXISTS public.brand_voices (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name         text NOT NULL,                       -- e.g. "My Shop Voice"
  description  text NOT NULL,                       -- freeform voice guide
  sample_posts jsonb NOT NULL DEFAULT '[]',        -- array of up to 3 strings
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS brand_voices_user_id_idx ON public.brand_voices(user_id);

DROP TRIGGER IF EXISTS brand_voices_updated_at ON public.brand_voices;
CREATE TRIGGER brand_voices_updated_at
  BEFORE UPDATE ON public.brand_voices
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.brand_voices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS brand_voices_select ON public.brand_voices;
CREATE POLICY brand_voices_select ON public.brand_voices
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS brand_voices_insert ON public.brand_voices;
CREATE POLICY brand_voices_insert ON public.brand_voices
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS brand_voices_update ON public.brand_voices;
CREATE POLICY brand_voices_update ON public.brand_voices
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS brand_voices_delete ON public.brand_voices;
CREATE POLICY brand_voices_delete ON public.brand_voices
  FOR DELETE USING (auth.uid() = user_id);

-- ─── 4. Restructure GENERATIONS for multi-studio ───────────
-- Add `studio`, `project_id`, `duration`, `payload` columns
-- Keep old caption columns for backwards compat during migration

ALTER TABLE public.generations
  ADD COLUMN IF NOT EXISTS studio      text NOT NULL DEFAULT 'caption'
    CHECK (studio IN ('script', 'caption', 'combo')),
  ADD COLUMN IF NOT EXISTS project_id  uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS duration    text,                -- '15s' / '30s' / etc
  ADD COLUMN IF NOT EXISTS payload     jsonb;               -- universal payload

-- Backfill `payload` from existing caption columns
UPDATE public.generations
SET payload = jsonb_build_object(
  'captions',     captions,
  'hooks',        hooks,
  'hashtags',     hashtags,
  'cta',          cta,
  'angles',       angles,
  'contentIdeas', content_ideas
),
studio = 'caption'
WHERE payload IS NULL;

CREATE INDEX IF NOT EXISTS generations_studio_idx     ON public.generations(studio);
CREATE INDEX IF NOT EXISTS generations_project_id_idx ON public.generations(project_id);

-- ─── 5. Extend USER SETTINGS ───────────────────────────────
ALTER TABLE public.user_settings
  ADD COLUMN IF NOT EXISTS default_duration text;  -- '15s' / '30s' / etc

-- ─── 6. Atomic credit decrement (safe across concurrent requests) ────────────
CREATE OR REPLACE FUNCTION public.decrement_credit(p_user_id uuid)
RETURNS integer AS $$
DECLARE
  remaining integer;
BEGIN
  UPDATE public.profiles
  SET credits_remaining = credits_remaining - 1
  WHERE id = p_user_id AND credits_remaining > 0
  RETURNING credits_remaining INTO remaining;

  RETURN COALESCE(remaining, -1);  -- -1 means no credit was deducted
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.decrement_credit(uuid) TO authenticated;
