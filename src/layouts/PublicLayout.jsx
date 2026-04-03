import { Link, Outlet } from 'react-router-dom'

export function PublicLayout() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-zinc-50 via-white to-brand-50/30 text-zinc-900 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900 dark:text-zinc-100">
      <header className="sticky top-0 z-30 border-b border-zinc-200/70 bg-white/80 shadow-sm backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/85">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <Link
            to="/"
            className="text-lg font-semibold tracking-tight text-brand-700 transition hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-300"
          >
            TaxClarity
          </Link>
          <nav className="flex flex-wrap items-center gap-4 text-sm font-medium text-zinc-600 dark:text-zinc-300">
            <Link
              to="/pricing"
              className="transition hover:text-brand-700 dark:hover:text-brand-400"
            >
              Pricing
            </Link>
            <Link
              to="/privacy"
              className="transition hover:text-brand-700 dark:hover:text-brand-400"
            >
              Privacy
            </Link>
            <Link to="/terms" className="transition hover:text-brand-700 dark:hover:text-brand-400">
              Terms
            </Link>
            <Link
              to="/auth"
              className="rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-orange-500/20 transition hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
            >
              Sign in
            </Link>
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
