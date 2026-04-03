-- Run after creating or altering tables so the REST API picks them up immediately.
-- Supabase Dashboard → SQL Editor → Run.

NOTIFY pgrst, 'reload schema';
