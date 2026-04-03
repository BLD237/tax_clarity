import { Navigate, Outlet } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useSessionStore } from '../stores/sessionStore.js'
import { fetchUserProfile } from '../features/profile/profileApi.js'
import { isOnboardingComplete, parseMetadataFromRow } from '../features/profile/metadata.js'
import { isSupabaseConfigured } from '../lib/supabase/client.js'

/**
 * `/auth` is only for signed-out users. Signed-in users go to onboarding or app.
 */
export function AuthRoute() {
  const user = useSessionStore((s) => s.user)
  const loading = useSessionStore((s) => s.loading)

  const { data, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => fetchUserProfile(user.id),
    enabled: Boolean(user?.id),
  })

  if (!isSupabaseConfigured()) {
    return <Outlet />
  }

  if (loading || (user && isLoading)) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center text-zinc-500">
        Loading…
      </div>
    )
  }

  if (user) {
    const meta = parseMetadataFromRow(data)
    if (isOnboardingComplete(meta)) {
      return <Navigate to="/app/dashboard" replace />
    }
    return <Navigate to="/onboarding/identity" replace />
  }

  return <Outlet />
}
