/**
 * @param {import('@supabase/supabase-js').User | null | undefined} user
 */
export function getUserFullName(user) {
  if (!user) return ''
  const meta = user.user_metadata
  if (typeof meta?.full_name === 'string' && meta.full_name.trim()) return meta.full_name.trim()
  if (typeof meta?.name === 'string' && meta.name.trim()) return meta.name.trim()
  return ''
}

/**
 * @param {import('@supabase/supabase-js').User | null | undefined} user
 */
export function getUserDisplayName(user) {
  return getUserFullName(user) || user?.email || ''
}
