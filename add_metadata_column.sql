-- =====================================================
-- Ensure user_profiles.metadata exists (older deployments)
-- =====================================================

ALTER TABLE public.user_profiles
    ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::JSONB;

UPDATE public.user_profiles
SET metadata = '{}'::JSONB
WHERE metadata IS NULL;

COMMENT ON COLUMN public.user_profiles.metadata IS 'JSONB field for storing onboarding data and other flexible user information';
