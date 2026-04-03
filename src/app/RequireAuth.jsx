import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSessionStore } from '../stores/sessionStore.js'
import { isSupabaseConfigured } from '../lib/supabase/client.js'

export function RequireAuth() {
  const user = useSessionStore((s) => s.user)
  const loading = useSessionStore((s) => s.loading)
  const location = useLocation()

  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Configuration required</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Add{' '}
          <code className="rounded bg-zinc-100 px-1 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
            VITE_SUPABASE_URL
          </code>{' '}
          and{' '}
          <code className="rounded bg-zinc-100 px-1 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
            VITE_SUPABASE_ANON_KEY
          </code>{' '}
          to{' '}
          <code className="rounded bg-zinc-100 px-1 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
            .env
          </code>{' '}
          and restart the dev server.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-zinc-500 dark:text-zinc-400">
        Loading session…
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
