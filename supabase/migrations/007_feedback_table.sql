-- ============================================================
-- Capduction — Migration 007: Feedback table
-- (Already applied to live ljpgkbkrpnpfjzxjsfzn before this commit.)
-- ============================================================

-- In-app feedback widget collects user voice during beta. Schema is
-- intentionally minimal — type + message + page context — so submission
-- friction stays low. Email + plan + credits are snapshots at submit
-- time (the profile may change later; the feedback context must not).

CREATE TABLE IF NOT EXISTS public.feedback (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  email       text,
  type        text NOT NULL CHECK (type IN ('bug', 'idea', 'praise', 'question', 'other')),
  message     text NOT NULL CHECK (char_length(message) BETWEEN 1 AND 4000),
  page        text,
  user_agent  text,
  metadata    jsonb DEFAULT '{}'::jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS feedback_created_at_idx ON public.feedback (created_at DESC);
CREATE INDEX IF NOT EXISTS feedback_user_id_idx    ON public.feedback (user_id);
CREATE INDEX IF NOT EXISTS feedback_type_idx       ON public.feedback (type);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Anyone (including anonymous) may insert. Users may read only their
-- own rows. Admin/service-role bypasses RLS for the founder's read access.
DROP POLICY IF EXISTS "anyone can insert feedback"   ON public.feedback;
DROP POLICY IF EXISTS "users read own feedback"      ON public.feedback;

CREATE POLICY "anyone can insert feedback"
  ON public.feedback FOR INSERT
  WITH CHECK (true);

CREATE POLICY "users read own feedback"
  ON public.feedback FOR SELECT
  USING (user_id IS NOT NULL AND user_id = auth.uid());
