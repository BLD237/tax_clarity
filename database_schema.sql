-- =====================================================
-- TaxClarity Cameroon Database Schema
-- =====================================================
-- Run via: scripts/apply-migrations.sh (needs DATABASE_URL)
-- or paste into Supabase SQL Editor.
-- Idempotent: safe to re-run (drops/recreates triggers & policies).
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- 1. USER_PROFILES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    company_name TEXT,
    tax_id_number TEXT,
    address TEXT,
    city TEXT,
    country TEXT DEFAULT 'Cameroon',
    avatar_url TEXT,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at_user_profiles ON public.user_profiles;
CREATE TRIGGER set_updated_at_user_profiles
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- 2. TAXES TABLE (Reference Data)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.taxes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    tax_type TEXT NOT NULL CHECK (tax_type IN ('income', 'sales', 'property', 'corporate', 'vat', 'custom', 'other')),
    category TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

DROP TRIGGER IF EXISTS set_updated_at_taxes ON public.taxes;
CREATE TRIGGER set_updated_at_taxes
    BEFORE UPDATE ON public.taxes
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- 3. TAX_RULES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.tax_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tax_id UUID NOT NULL REFERENCES public.taxes(id) ON DELETE CASCADE,
    rule_name TEXT NOT NULL,
    description TEXT,
    rate_type TEXT NOT NULL CHECK (rate_type IN ('percentage', 'fixed', 'bracket')),
    rate DECIMAL(10, 4),
    fixed_amount DECIMAL(15, 2),
    min_amount DECIMAL(15, 2) DEFAULT 0,
    max_amount DECIMAL(15, 2),
    effective_from DATE NOT NULL,
    effective_to DATE,
    priority INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

DROP TRIGGER IF EXISTS set_updated_at_tax_rules ON public.tax_rules;
CREATE TRIGGER set_updated_at_tax_rules
    BEFORE UPDATE ON public.tax_rules
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- 4. TAX_ESTIMATES TABLE (web app stores breakdown in metadata;
--    base_amount / tax_amount / tax_year satisfy NOT NULL & RLS)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.tax_estimates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    tax_id UUID REFERENCES public.taxes(id) ON DELETE SET NULL,
    tax_rule_id UUID REFERENCES public.tax_rules(id) ON DELETE SET NULL,
    estimate_name TEXT,
    base_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    effective_rate DECIMAL(10, 4),
    tax_year INTEGER NOT NULL DEFAULT (EXTRACT(YEAR FROM CURRENT_DATE))::INTEGER,
    tax_period TEXT DEFAULT 'monthly',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'submitted', 'paid', 'cancelled')),
    due_date DATE,
    paid_date DATE,
    notes TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

DROP TRIGGER IF EXISTS set_updated_at_tax_estimates ON public.tax_estimates;
CREATE TRIGGER set_updated_at_tax_estimates
    BEFORE UPDATE ON public.tax_estimates
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_tax_id_number ON public.user_profiles(tax_id_number) WHERE tax_id_number IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_taxes_code ON public.taxes(code);
CREATE INDEX IF NOT EXISTS idx_taxes_type ON public.taxes(tax_type);
CREATE INDEX IF NOT EXISTS idx_taxes_active ON public.taxes(is_active) WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS idx_tax_rules_tax_id ON public.tax_rules(tax_id);
CREATE INDEX IF NOT EXISTS idx_tax_rules_active ON public.tax_rules(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_tax_rules_effective_dates ON public.tax_rules(effective_from, effective_to);
CREATE INDEX IF NOT EXISTS idx_tax_rules_tax_id_active ON public.tax_rules(tax_id, is_active);

CREATE INDEX IF NOT EXISTS idx_tax_estimates_user_id ON public.tax_estimates(user_id);
CREATE INDEX IF NOT EXISTS idx_tax_estimates_tax_id ON public.tax_estimates(tax_id);
CREATE INDEX IF NOT EXISTS idx_tax_estimates_user_year ON public.tax_estimates(user_id, tax_year);
CREATE INDEX IF NOT EXISTS idx_tax_estimates_status ON public.tax_estimates(status);
CREATE INDEX IF NOT EXISTS idx_tax_estimates_due_date ON public.tax_estimates(due_date) WHERE due_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tax_estimates_created_at ON public.tax_estimates(created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_estimates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;

CREATE POLICY "Users can view own profile"
    ON public.user_profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.user_profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.user_profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Authenticated users can view active taxes" ON public.taxes;
CREATE POLICY "Authenticated users can view active taxes"
    ON public.taxes FOR SELECT TO authenticated
    USING (is_active = TRUE);

DROP POLICY IF EXISTS "Authenticated users can view active tax rules" ON public.tax_rules;
CREATE POLICY "Authenticated users can view active tax rules"
    ON public.tax_rules FOR SELECT TO authenticated
    USING (is_active = TRUE);

DROP POLICY IF EXISTS "Users can view own tax estimates" ON public.tax_estimates;
DROP POLICY IF EXISTS "Users can insert own tax estimates" ON public.tax_estimates;
DROP POLICY IF EXISTS "Users can update own tax estimates" ON public.tax_estimates;
DROP POLICY IF EXISTS "Users can delete own tax estimates" ON public.tax_estimates;

CREATE POLICY "Users can view own tax estimates"
    ON public.tax_estimates FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tax estimates"
    ON public.tax_estimates FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tax estimates"
    ON public.tax_estimates FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own tax estimates"
    ON public.tax_estimates FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- Grants for PostgREST (authenticated JWT role)
-- =====================================================
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_profiles TO authenticated;
GRANT SELECT ON public.taxes TO authenticated;
GRANT SELECT ON public.tax_rules TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tax_estimates TO authenticated;

GRANT ALL ON public.user_profiles TO service_role;
GRANT ALL ON public.taxes TO service_role;
GRANT ALL ON public.tax_rules TO service_role;
GRANT ALL ON public.tax_estimates TO service_role;

-- =====================================================
-- COMMENTS (signup trigger: auth_handle_new_user.sql, applied by apply-migrations.sh)
-- =====================================================
COMMENT ON TABLE public.user_profiles IS 'User profile information linked to Supabase Auth';
COMMENT ON COLUMN public.user_profiles.metadata IS 'Onboarding and flexible JSON (e.g. identity, income_type, income_range)';
COMMENT ON TABLE public.taxes IS 'Reference data for different tax types';
COMMENT ON TABLE public.tax_rules IS 'Tax rules, rates, and brackets for calculations';
COMMENT ON TABLE public.tax_estimates IS 'User tax calculations and estimates';
COMMENT ON COLUMN public.tax_estimates.metadata IS 'Web app: gross_monthly, irpp, cnps, net, source';
