import { Outlet } from 'react-router-dom'

export function OnboardingLayout() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-brand-50 to-zinc-50 dark:from-zinc-950 dark:to-zinc-900">
      <Outlet />
    </div>
  )
}
