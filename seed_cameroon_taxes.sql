-- =====================================================
-- Cameroonian Tax Types - Seed Data
-- =====================================================
-- This script populates the 'taxes' table with all major
-- Cameroonian tax types including descriptions and categories
-- =====================================================

-- Clear existing seed data (optional - only if you want to replace)
-- DELETE FROM public.taxes WHERE code IN ('IRPP', 'CNPS', 'VAT', 'IS', 'IMF', 'PROPERTY', 'PATENTE', 'STAMP');

-- Insert Cameroonian Tax Types
INSERT INTO public.taxes (code, name, description, tax_type, category, is_active)
VALUES
    (
        'IRPP',
        'Impôt sur le Revenu des Personnes Physiques',
        'Personal Income Tax (IRPP) - Tax levied on the income of individuals including salaries, wages, business profits, and other personal income sources. Paid by all individuals earning taxable income in Cameroon.',
        'income',
        'Individual',
        TRUE
    ),
    (
        'CNPS',
        'Caisse Nationale de Prévoyance Sociale',
        'National Social Security Fund (CNPS) - Social security contributions for retirement, disability, and healthcare benefits. Paid by both employers and employees based on salary brackets.',
        'custom',
        'Social Security',
        TRUE
    ),
    (
        'VAT',
        'Taxe sur la Valeur Ajoutée / Value Added Tax',
        'Value Added Tax (VAT/TVA) - Consumption tax levied on the value added to goods and services at each stage of production and distribution. Rate is generally 19.25%. Paid by businesses on sales and passed to consumers.',
        'vat',
        'Sales',
        TRUE
    ),
    (
        'IS',
        'Impôt sur les Sociétés',
        'Corporate Tax (IS) - Tax on corporate profits and business income. Standard rate is 33% for most companies, with reduced rates for certain sectors. Paid by corporations, partnerships, and other business entities.',
        'corporate',
        'Corporate',
        TRUE
    ),
    (
        'IMF',
        'Impôt Minimum Forfaitaire',
        'Minimum Tax (IMF) - Minimum guaranteed tax payment required from businesses regardless of profit levels. Ensures all businesses contribute a minimum amount. Paid by companies and business entities.',
        'corporate',
        'Corporate',
        TRUE
    ),
    (
        'PROPERTY',
        'Taxe Foncière',
        'Property Tax - Annual tax on real estate properties including land, buildings, and improvements. Calculated based on property value and location. Paid by property owners (individuals and businesses).',
        'property',
        'Property',
        TRUE
    ),
    (
        'STAMP',
        'Droit de Timbre',
        'Stamp Duty - Tax on legal documents, contracts, and official transactions. Required for various administrative and legal procedures. Paid by individuals and businesses for document processing.',
        'custom',
        'Transaction',
        TRUE
    ),
    (
        'PATENTE',
        'Patente',
        'Business licence tax (patente) — annual municipal trade licence for commercial activity in Cameroon. Paid by businesses according to locality and activity.',
        'custom',
        'Business License',
        TRUE
    )
ON CONFLICT (code) 
DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    tax_type = EXCLUDED.tax_type,
    category = EXCLUDED.category,
    updated_at = NOW();

-- =====================================================
-- Summary of Tax Types
-- =====================================================
-- IRPP: Personal Income Tax - Paid by individuals
-- CNPS: Social Security - Paid by employers and employees
-- VAT: Value Added Tax - Paid by businesses (passed to consumers)
-- IS: Corporate Tax - Paid by corporations and businesses
-- IMF: Minimum Tax - Paid by companies and business entities
-- PROPERTY: Property Tax - Paid by property owners
-- STAMP: Stamp Duty - Paid for document processing
-- PATENTE: Patente / trade licence - Paid by businesses
-- =====================================================
