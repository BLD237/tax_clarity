import { useEffect } from 'react'
import { getSupabase } from '../lib/supabase/client.js'
import { useSessionStore } from '../stores/sessionStore.js'

export function SessionSync() {
  const setSession = useSessionStore((s) => s.setSession)
  const setLoading = useSessionStore((s) => s.setLoading)

  useEffect(() => {
    const supabase = getSupabase()
    if (!supabase) {
      setSession(null)
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    supabase.auth.getSession().then(({ data }) => {
      if (!cancelled) setSession(data.session ?? null)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ?? null)
    })
    return () => {
      cancelled = true
      sub.subscription.unsubscribe()
    }
  }, [setSession, setLoading])

  return null
}
