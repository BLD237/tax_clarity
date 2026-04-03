import { Link, NavLink, Outlet } from 'react-router-dom'
import { useSessionStore } from '../stores/sessionStore.js'
import { getSupabase } from '../lib/supabase/client.js'
import { getUserDisplayName } from '../lib/userDisplay.js'

const navClass = ({ isActive }) =>
  `flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium ${
    isActive ? 'text-brand-700 dark:text-brand-400' : 'text-zinc-500 dark:text-zinc-400'
  }`

export function AppLayout() {
  const user = useSessionStore((s) => s.user)

  async function signOut() {
    await getSupabase()?.auth.signOut()
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-zinc-100 via-zinc-50 to-brand-50/40 text-zinc-900 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900 dark:text-zinc-100 lg:flex">
      <aside className="hidden w-56 shrink-0 border-r border-zinc-200/80 bg-white/95 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/95 lg:block">
        <div className="flex h-full flex-col p-4">
          <Link
            to="/app/dashboard"
            className="text-lg font-semibold text-brand-700 dark:text-brand-400"
          >
            TaxClarity
          </Link>
          <nav className="mt-8 flex flex-col gap-1 text-sm">
            <NavLink
              to="/app/dashboard"
              className={({ isActive }) =>
                `rounded-xl px-3 py-2 transition ${isActive ? 'bg-gradient-to-r from-brand-50 to-violet-50 font-medium text-brand-800 shadow-sm dark:from-brand-950/50 dark:to-violet-950/40 dark:text-brand-200' : 'text-zinc-600 hover:bg-zinc-50/80 dark:text-zinc-400 dark:hover:bg-zinc-800/60'}`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/app/estimation"
              className={({ isActive }) =>
                `rounded-xl px-3 py-2 transition ${isActive ? 'bg-gradient-to-r from-brand-50 to-violet-50 font-medium text-brand-800 shadow-sm dark:from-brand-950/50 dark:to-violet-950/40 dark:text-brand-200' : 'text-zinc-600 hover:bg-zinc-50/80 dark:text-zinc-400 dark:hover:bg-zinc-800/60'}`
              }
            >
              Estimation
            </NavLink>
            <NavLink
              to="/app/history"
              className={({ isActive }) =>
                `rounded-xl px-3 py-2 transition ${isActive ? 'bg-gradient-to-r from-brand-50 to-violet-50 font-medium text-brand-800 shadow-sm dark:from-brand-950/50 dark:to-violet-950/40 dark:text-brand-200' : 'text-zinc-600 hover:bg-zinc-50/80 dark:text-zinc-400 dark:hover:bg-zinc-800/60'}`
              }
            >
              History
            </NavLink>
            <NavLink
              to="/app/settings"
              className={({ isActive }) =>
                `rounded-xl px-3 py-2 transition ${isActive ? 'bg-gradient-to-r from-brand-50 to-violet-50 font-medium text-brand-800 shadow-sm dark:from-brand-950/50 dark:to-violet-950/40 dark:text-brand-200' : 'text-zinc-600 hover:bg-zinc-50/80 dark:text-zinc-400 dark:hover:bg-zinc-800/60'}`
              }
            >
              Settings
            </NavLink>
          </nav>
          <div className="mt-auto border-t border-zinc-100 pt-4 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            <p className="truncate font-medium text-zinc-800 dark:text-zinc-100">{getUserDisplayName(user)}</p>
            {user?.email && getUserDisplayName(user) !== user.email ? (
              <p className="mt-0.5 truncate text-zinc-500 dark:text-zinc-500">{user.email}</p>
            ) : null}
            <button
              type="button"
              onClick={signOut}
              className="mt-2 text-brand-700 hover:underline dark:text-brand-400"
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-h-dvh flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-zinc-200/80 bg-white/90 px-4 py-3 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90 lg:hidden">
          <Link to="/app/dashboard" className="font-semibold text-brand-700 dark:text-brand-400">
            TaxClarity
          </Link>
          <Link to="/app/settings" className="text-sm text-zinc-600 dark:text-zinc-400">
            Account
          </Link>
        </header>
        <main className="flex-1 overflow-y-auto px-3 py-4 pb-24 sm:px-4 lg:pb-6">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>

        <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200/80 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg dark:border-zinc-800 dark:bg-zinc-950/95 lg:hidden">
          <div className="mx-auto flex max-w-lg">
            <NavLink to="/app/dashboard" className={navClass}>
              <span aria-hidden>◉</span>
              Dashboard
            </NavLink>
            <NavLink to="/app/estimation" className={navClass}>
              <span aria-hidden>∑</span>
              Estimate
            </NavLink>
            <NavLink to="/app/history" className={navClass}>
              <span aria-hidden>≡</span>
              History
            </NavLink>
          </div>
        </nav>
      </div>
    </div>
  )
}
