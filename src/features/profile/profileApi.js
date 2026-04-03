import { getSupabase } from '../../lib/supabase/client.js'

/**
 * @param {string} userId
 */
export async function fetchUserProfile(userId) {
  const supabase = getSupabase()
  if (!supabase) return null
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()
  if (error) throw error
  return data
}

/**
 * @param {string} userId
 * @param {Record<string, unknown>} metadataPatch
 */
export async function updateUserMetadata(userId, metadataPatch) {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase is not configured')
  const { data: row, error: fetchError } = await supabase
    .from('user_profiles')
    .select('metadata, email')
    .eq('id', userId)
    .maybeSingle()
  if (fetchError) throw fetchError
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError) throw userError
  const email = userData.user?.email ?? row?.email ?? ''
  const prev =
    row?.metadata && typeof row.metadata === 'object' && !Array.isArray(row.metadata)
      ? row.metadata
      : {}
  const metadata = { ...prev, ...metadataPatch }
  const { error } = await supabase.from('user_profiles').upsert(
    { id: userId, email, metadata },
    { onConflict: 'id' },
  )
  if (error) throw error
}
