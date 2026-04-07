import { getSupabase } from '../../lib/supabase/client.js'

/**
 * @param {string} code e.g. 'IRPP'
 */
export async function fetchTaxIdByCode(code) {
  const supabase = getSupabase()
  if (!supabase) return null
  const { data, error } = await supabase
    .from('taxes')
    .select('id')
    .eq('code', code)
    .maybeSingle()
  if (error) throw error
  return data?.id ?? null
}

/**
 * Persist estimate. 
 * @param {string} userId
 * @param {string | null} taxId
 * @param {{ gross: number, irpp: number, cnps: number, net: number, note?: string }} breakdown
 */
export async function insertTaxEstimate(userId, taxId, breakdown) {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase is not configured')
  const taxYear = new Date().getFullYear()
  const totalTax = breakdown.irpp + breakdown.cnps
  const note = typeof breakdown.note === 'string' ? breakdown.note.trim() : ''
  const metadata = {
    gross_monthly: breakdown.gross,
    irpp: breakdown.irpp,
    cnps: breakdown.cnps,
    net: breakdown.net,
    source: 'tax_clarity_web',
  }
  if (note) metadata.user_note = note.slice(0, 2000)
  const payload = {
    user_id: userId,
    tax_id: taxId,
    base_amount: breakdown.gross,
    tax_amount: totalTax,
    effective_rate:
      breakdown.gross > 0 ? Number(((totalTax / breakdown.gross) * 100).toFixed(4)) : 0,
    tax_year: taxYear,
    tax_period: 'monthly',
    estimate_name: `Salary estimate ${taxYear}`,
    status: 'draft',
    metadata,
  }
  const { error } = await supabase.from('tax_estimates').insert(payload)
  if (error) throw error
}

/**
 * @param {string} userId
 */
export async function listTaxEstimates(userId) {
  const supabase = getSupabase()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('tax_estimates')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)
  if (error) throw error
  return data ?? []
}

/**
 * @param {string} estimateId
 */
export async function deleteTaxEstimate(estimateId) {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase is not configured')
  const { error } = await supabase.from('tax_estimates').delete().eq('id', estimateId)
  if (error) throw error
}

/**
 * Merge `metadata` patch on an estimate row (e.g. user_note).
 * @param {string} userId
 * @param {string} estimateId
 * @param {Record<string, unknown>} patch
 */
export async function patchTaxEstimateMetadata(userId, estimateId, patch) {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase is not configured')
  const { data, error } = await supabase
    .from('tax_estimates')
    .select('metadata')
    .eq('id', estimateId)
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error
  const prev = data?.metadata && typeof data.metadata === 'object' ? data.metadata : {}
  const next = { ...prev, ...patch }
  for (const k of Object.keys(next)) {
    if (next[k] === null) delete next[k]
  }
  const { error: uerr } = await supabase
    .from('tax_estimates')
    .update({ metadata: next })
    .eq('id', estimateId)
    .eq('user_id', userId)
  if (uerr) throw uerr
}
