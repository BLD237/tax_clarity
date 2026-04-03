/**
 * @param {number} value
 */
export function formatXaf(value) {
  return `${Math.round(value).toLocaleString('fr-CM')} FCFA`
}
