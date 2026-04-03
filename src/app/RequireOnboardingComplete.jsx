import { Navigate, Outlet } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useSessionStore } from '../stores/sessionStore.js'
import { fetchUserProfile } from '../features/profile/profileApi.js'
import { isOnboardingComplete, parseMetadataFromRow } from '../features/profile/metadata.js'

export function RequireOnboardingComplete() {
  const user = useSessionStore((s) => s.user)
  const { data, isLoading, isError } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => fetchUserProfile(user.id),
    enabled: Boolean(user?.id),
  })

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-zinc-500">
        Loading profile…
      </div>
    )
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-red-600">
        Could not load your profile. Check Supabase tables and RLS.
      </div>
    )
  }

  const meta = parseMetadataFromRow(data)
  if (!isOnboardingComplete(meta)) {
    return <Navigate to="/onboarding/identity" replace />
  }

  return <Outlet />
}
