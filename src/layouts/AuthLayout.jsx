import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-gradient-to-b from-brand-50 to-zinc-50 px-4 py-12 text-zinc-900 dark:from-zinc-950 dark:to-zinc-900 dark:text-zinc-100">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  )
}
