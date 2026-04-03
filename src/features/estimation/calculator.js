const CNPS_EMPLOYEE_RATE = 0.042

/**
 * Progressive monthly IRPP (marginal bands per migration spec).
 * @param {number} grossMonthly
 * @returns {number}
 */
export function calculateIRPP(grossMonthly) {
  const g = Math.max(0, grossMonthly)
  const bands = [
    { limit: 62_000, rate: 0 },
    { limit: 166_667, rate: 0.1 },
    { limit: 250_000, rate: 0.15 },
    { limit: 416_667, rate: 0.25 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.35 },
  ]
  let tax = 0
  let prev = 0
  for (const band of bands) {
    if (g <= prev) break
    const sliceTop = Math.min(g, band.limit)
    const slice = Math.max(0, sliceTop - prev)
    tax += slice * band.rate
    prev = band.limit
  }
  return Math.round(tax)
}

/**
 * @param {number} grossMonthly
 */
export function calculateCNPS(grossMonthly) {
  const g = Math.max(0, grossMonthly)
  return Math.round(g * CNPS_EMPLOYEE_RATE)
}

/**
 * @param {number} grossMonthly
 */
export function estimateTakeHome(grossMonthly) {
  const irpp = calculateIRPP(grossMonthly)
  const cnps = calculateCNPS(grossMonthly)
  const net = Math.max(0, grossMonthly - irpp - cnps)
  return {
    gross: grossMonthly,
    irpp,
    cnps,
    totalDeductions: irpp + cnps,
    net,
  }
}
