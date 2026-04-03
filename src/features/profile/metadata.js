/** @typedef {'individual' | 'business' | 'mixed'} Identity */
/** @typedef {'salary' | 'business_income' | 'freelance' | 'mixed_income'} IncomeType */

/**
 * @typedef {Object} ProfileMetadata
 * @property {Identity} [identity]
 * @property {IncomeType} [income_type]
 * @property {string} [income_range]
 * @property {boolean} [vat_registered]
 * @property {boolean} [onboardingComplete]
 */

/** @param {unknown} row */
export function parseMetadataFromRow(row) {
  if (!row || typeof row !== 'object') return {}
  const meta = /** @type {{ metadata?: unknown }} */ (row).metadata
  if (!meta || typeof meta !== 'object' || Array.isArray(meta)) return {}
  return /** @type {ProfileMetadata} */ (meta)
}

/**
 * @param {ProfileMetadata} m
 * @returns {boolean}
 */
export function isOnboardingComplete(m) {
  return Boolean(
    m?.onboardingComplete &&
      m?.identity &&
      m?.income_type &&
      m?.income_range,
  )
}

/**
 * @param {ProfileMetadata} m
 * @returns {{ identity: Identity, incomeType: IncomeType, incomeRange: string, vatRegistered: boolean }}
 */
export function toTaxProfile(m) {
  return {
    identity: m.identity ?? 'individual',
    incomeType: m.income_type ?? 'salary',
    incomeRange: m.income_range ?? '',
    vatRegistered: Boolean(m.vat_registered),
  }
}
