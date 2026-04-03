import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useSessionStore } from '../../stores/sessionStore.js'
import { updateUserMetadata } from '../../features/profile/profileApi.js'
import { Card } from '../../components/ui/Card.jsx'
import { Button } from '../../components/ui/Button.jsx'

const OPTIONS = [
  { value: 'individual', label: 'Individual', hint: 'Personal income and employment' },
  { value: 'business', label: 'Business', hint: 'Company or formal business entity' },
  { value: 'mixed', label: 'Mixed', hint: 'Both personal and business activity' },
]

export function OnboardingIdentityPage() {
  const user = useSessionStore((s) => s.user)
  const qc = useQueryClient()
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: async (identity) => {
      if (!user?.id) throw new Error('Not signed in')
      await updateUserMetadata(user.id, { identity })
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['profile', user?.id] })
      navigate('/onboarding')
    },
  })

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <Card>
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Who are you?</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Choose the option that best describes your situation. You can revisit this later in
          settings.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          {OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              disabled={mutation.isPending}
              onClick={() => mutation.mutate(o.value)}
              className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-left transition hover:border-brand-300 hover:bg-white disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800 dark:hover:border-brand-500 dark:hover:bg-zinc-700"
            >
              <span className="font-semibold text-zinc-900 dark:!text-white">{o.label}</span>
              <p className="mt-1 text-sm text-zinc-600 dark:!text-zinc-300">{o.hint}</p>
            </button>
          ))}
        </div>
        {mutation.isError ? (
          <p className="mt-4 text-sm text-red-600 dark:text-red-400">{mutation.error.message}</p>
        ) : null}
        <div className="mt-6">
          <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      </Card>
    </div>
  )
}
