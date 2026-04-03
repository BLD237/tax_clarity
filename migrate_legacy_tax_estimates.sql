-- =====================================================
-- One-time alignment for DBs created before tax_id was nullable
-- Safe to re-run
-- =====================================================
DO $$
BEGIN
  IF to_regclass('public.tax_estimates') IS NOT NULL THEN
    ALTER TABLE public.tax_estimates ALTER COLUMN tax_id DROP NOT NULL;
  END IF;
EXCEPTION
  WHEN undefined_column THEN NULL;
END $$;
