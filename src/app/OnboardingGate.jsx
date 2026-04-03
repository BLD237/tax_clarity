import { Navigate, Outlet } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useSessionStore } from '../stores/sessionStore.js'
import { fetchUserProfile } from '../features/profile/profileApi.js'
import { isOnboardingComplete, parseMetadataFromRow } from '../features/profile/metadata.js'

/** If onboarding already done, skip to dashboard. */
export function OnboardingGate() {
  const user = useSessionStore((s) => s.user)
  const { data, isLoading } = useQuery({
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

  const meta = parseMetadataFromRow(data)
  if (isOnboardingComplete(meta)) {
    return <Navigate to="/app/dashboard" replace />
  }

  return <Outlet />
}
