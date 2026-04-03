/**
 * Tax applicability rules (aligned with migration spec categories).
 * Flutter parity: refine when source rules are available.
 *
 * @typedef {{ identity: string, incomeType: string, incomeRange: string, vatRegistered: boolean }} TaxProfileInput
 */

/** @type {'applies' | 'may' | 'does_not'} */
const A = 'applies'
const M = 'may'
const N = 'does_not'

/**
 * @param {TaxProfileInput} p
 * @returns {'applies' | 'may' | 'does_not'}
 */
function irppStatus(p) {
  if (p.identity === 'business') return N
  if (p.incomeType === 'salary' || p.incomeType === 'freelance') return A
  if (p.incomeType === 'mixed_income') return A
  if (p.incomeType === 'business_income' && p.identity === 'individual') return M
  return M
}

/**
 * @param {TaxProfileInput} p
 */
function cnpsStatus(p) {
  if (p.incomeType === 'salary') return A
  if (p.incomeType === 'freelance' || p.incomeType === 'mixed_income') return M
  if (p.identity === 'business' || p.incomeType === 'business_income') return M
  return N
}

/**
 * @param {TaxProfileInput} p
 */
function imfStatus(p) {
  if (p.identity === 'business' || p.incomeType === 'business_income') return M
  if (p.incomeType === 'freelance') return M
  return N
}

/**
 * @param {TaxProfileInput} p
 */
function vatStatus(p) {
  if (p.vatRegistered) return A
  if (p.identity === 'business' || p.incomeType === 'business_income') return M
  return N
}

/**
 * @param {TaxProfileInput} p
 */
function isStatus(p) {
  if (p.identity === 'business') return A
  if (p.identity === 'mixed') return M
  return N
}

function propertyStatus() {
  return M
}

/**
 * @param {TaxProfileInput} p
 */
function patenteStatus(p) {
  if (p.identity === 'business' || p.incomeType === 'business_income') return A
  if (p.identity === 'mixed') return M
  return N
}

export const TAX_DEFINITIONS = [
  {
    code: 'IRPP',
    name: 'IRPP (Impôt sur le Revenu des Personnes Physiques)',
    learnMore:
      'Progressive income tax on individuals. Salaried employees and many freelancers declare employment or professional income.',
    status: irppStatus,
  },
  {
    code: 'CNPS',
    name: 'CNPS (cotisation sociale salarié)',
    learnMore:
      'Social security contribution (employee share is commonly 4.2% of gross salary). Self-employed and employer rules differ.',
    status: cnpsStatus,
  },
  {
    code: 'IMF',
    name: 'IMF / minimum fiscal (micro / small business context)',
    learnMore:
      'May apply to certain small businesses or simplified regimes depending on turnover and legal form.',
    status: imfStatus,
  },
  {
    code: 'VAT',
    name: 'TVA / VAT',
    learnMore:
      'Applies when registered for VAT or when turnover crosses registration thresholds. Export of goods/services may differ.',
    status: vatStatus,
  },
  {
    code: 'IS',
    name: 'IS (Impôt sur les Sociétés)',
    learnMore: 'Corporate income tax for companies and certain legal entities.',
    status: isStatus,
  },
  {
    code: 'PROPERTY',
    name: 'Property tax',
    learnMore:
      'Local property-related taxes may apply if you own real estate; details depend on municipality and asset type.',
    status: propertyStatus,
  },
  {
    code: 'PATENTE',
    name: 'Patente / trade licence',
    learnMore:
      'Municipal business licence tax often relevant for commercial premises and certain activities.',
    status: patenteStatus,
  },
]

/**
 * @param {TaxProfileInput} profile
 */
export function decideTaxes(profile) {
  const cards = TAX_DEFINITIONS.map((d) => ({
    code: d.code,
    name: d.name,
    learnMore: d.learnMore,
    section: d.status(profile),
  }))
  return {
    applies: cards.filter((c) => c.section === A),
    mayApplyLater: cards.filter((c) => c.section === M),
    doesNotApply: cards.filter((c) => c.section === N),
  }
}
