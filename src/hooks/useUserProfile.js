import { useQuery } from '@tanstack/react-query'
import { useSessionStore } from '../stores/sessionStore.js'
import { fetchUserProfile } from '../features/profile/profileApi.js'

export function useUserProfile() {
  const user = useSessionStore((s) => s.user)
  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => fetchUserProfile(user.id),
    enabled: Boolean(user?.id),
  })
}
