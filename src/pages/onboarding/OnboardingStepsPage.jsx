import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Navigate, useNavigate } from 'react-router-dom'
import { useSessionStore } from '../../stores/sessionStore.js'
import { useUserProfile } from '../../hooks/useUserProfile.js'
import { parseMetadataFromRow } from '../../features/profile/metadata.js'
import { updateUserMetadata } from '../../features/profile/profileApi.js'
import { Card } from '../../components/ui/Card.jsx'
import { Button } from '../../components/ui/Button.jsx'

const INCOME_TYPES = [
  { value: 'salary', label: 'Salary' },
  { value: 'business_income', label: 'Business income' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'mixed_income', label: 'Mixed' },
]

const RANGES = [
  { value: '0-500k', label: '0 – 500k XAF / month' },
  { value: '500k-2m', label: '500k – 2M XAF / month' },
  { value: '2m-5m', label: '2M – 5M XAF / month' },
  { value: '5m+', label: '5M+ XAF / month' },
]

export function OnboardingStepsPage() {
  const user = useSessionStore((s) => s.user)
  const { data: profileRow, isLoading } = useUserProfile()
  const qc = useQueryClient()
  const navigate = useNavigate()
  const [incomeType, setIncomeType] = useState('salary')
  const [incomeRange, setIncomeRange] = useState('0-500k')
  const [vatRegistered, setVatRegistered] = useState(false)

  const mutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('Not signed in')
      await updateUserMetadata(user.id, {
        income_type: incomeType,
        income_range: incomeRange,
        vat_registered: vatRegistered,
        onboardingComplete: true,
      })
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['profile', user?.id] })
      navigate('/app/dashboard')
    },
  })

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-zinc-500 dark:text-zinc-400">
        Loading…
      </div>
    )
  }
  const meta = parseMetadataFromRow(profileRow)
  if (!meta.identity) {
    return <Navigate to="/onboarding/identity" replace />
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <Card>
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Your income</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Step 1: income type. Step 2: typical monthly range (approximate).
        </p>

        <fieldset className="mt-6">
          <legend className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Income type</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {INCOME_TYPES.map((t) => {
              const isOn = incomeType === t.value
              return (
                <label
                  key={t.value}
                  className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium ${
                    isOn
                      ? 'border-brand-600 bg-brand-100 text-zinc-900 shadow-sm dark:border-brand-500 dark:bg-zinc-700 dark:text-white dark:shadow-none'
                      : 'border-zinc-200 bg-white text-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="income_type"
                    value={t.value}
                    checked={isOn}
                    onChange={() => setIncomeType(t.value)}
                    className="size-4 shrink-0 accent-brand-600 dark:accent-brand-400"
                  />
                  <span
                    className={`min-w-0 flex-1 leading-snug ${
                      isOn ? 'text-zinc-900 dark:!text-white' : 'text-zinc-900 dark:text-zinc-100'
                    }`}
                  >
                    {t.label}
                  </span>
                </label>
              )
            })}
          </div>
        </fieldset>

        <fieldset className="mt-6">
          <legend className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Income range</legend>
          <div className="mt-2 grid gap-2">
            {RANGES.map((r) => {
              const isOn = incomeRange === r.value
              return (
                <label
                  key={r.value}
                  className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium ${
                    isOn
                      ? 'border-brand-600 bg-brand-100 text-zinc-900 shadow-sm dark:border-brand-500 dark:bg-zinc-700 dark:text-white dark:shadow-none'
                      : 'border-zinc-200 bg-white text-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="income_range"
                    value={r.value}
                    checked={isOn}
                    onChange={() => setIncomeRange(r.value)}
                    className="size-4 shrink-0 accent-brand-600 dark:accent-brand-400"
                  />
                  <span
                    className={`min-w-0 flex-1 leading-snug ${
                      isOn ? 'text-zinc-900 dark:!text-white' : 'text-zinc-900 dark:text-zinc-100'
                    }`}
                  >
                    {r.label}
                  </span>
                </label>
              )
            })}
          </div>
        </fieldset>

        <label className="mt-6 flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={vatRegistered}
            onChange={(e) => setVatRegistered(e.target.checked)}
            className="size-4 shrink-0 rounded border-zinc-300 accent-brand-600 dark:border-zinc-500 dark:accent-brand-400"
          />
          <span className="text-zinc-900 dark:!text-zinc-100">
            I am registered for VAT (optional)
          </span>
        </label>

        {mutation.isError ? (
          <p className="mt-4 text-sm text-red-600 dark:text-red-400">{mutation.error.message}</p>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3">
          <Button type="button" variant="secondary" onClick={() => navigate('/onboarding/identity')}>
            Back
          </Button>
          <Button type="button" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving…' : 'Finish'}
          </Button>
        </div>
      </Card>
    </div>
  )
}
