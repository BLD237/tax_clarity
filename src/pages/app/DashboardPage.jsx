import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useUserProfile } from '../../hooks/useUserProfile.js'
import { useSessionStore } from '../../stores/sessionStore.js'
import { listTaxEstimates } from '../../features/estimates/estimatesApi.js'
import { useEstimateReminder } from '../../hooks/useEstimateReminder.js'
import { parseMetadataFromRow, toTaxProfile } from '../../features/profile/metadata.js'
import { decideTaxes } from '../../features/taxes/engine.js'
import { TaxCard } from '../../components/TaxCard.jsx'
import { Card } from '../../components/ui/Card.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { PdfExportDialog } from '../../components/PdfExportDialog.jsx'
import { EstimateReminderBanner } from '../../components/EstimateReminderBanner.jsx'
import { EstimateReminderDialog } from '../../components/EstimateReminderDialog.jsx'
import { formatXaf } from '../../lib/format.js'

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="tc-shimmer-bg overflow-hidden rounded-3xl border border-zinc-200/80 bg-zinc-100/80 p-8 dark:border-zinc-700/80 dark:bg-zinc-900/60">
        <div className="h-8 w-48 rounded-lg bg-zinc-200/90 dark:bg-zinc-700/90" />
        <div className="mt-4 h-4 w-72 max-w-full rounded bg-zinc-200/80 dark:bg-zinc-700/80" />
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-zinc-200/70 dark:bg-zinc-700/70" />
          ))}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="tc-shimmer-bg h-36 rounded-2xl border border-zinc-200/60 bg-zinc-100/60 dark:border-zinc-700/60 dark:bg-zinc-900/50"
          />
        ))}
      </div>
    </div>
  )
}

function SectionHeader({ title, subtitle, accent }) {
  return (
    <div className="mb-2 flex items-center gap-2 sm:gap-3">
      <span className={`h-8 w-1 shrink-0 rounded-full sm:h-9 ${accent}`} aria-hidden />
      <div className="min-w-0">
        <h2 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-lg">
          {title}
        </h2>
        {subtitle ? (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 sm:text-sm">{subtitle}</p>
        ) : null}
      </div>
    </div>
  )
}

export function DashboardPage() {
  const user = useSessionStore((s) => s.user)
  const { data: row, isLoading, isError } = useUserProfile()
  const [pdfOpen, setPdfOpen] = useState(false)
  const [reminderOpen, setReminderOpen] = useState(false)
  const reminder = useEstimateReminder()

  const { data: estimateRows } = useQuery({
    queryKey: ['estimates', user?.id],
    queryFn: () => listTaxEstimates(user.id),
    enabled: Boolean(user?.id),
  })

  const lastEstimate = estimateRows?.[0]
  const lastMeta =
    lastEstimate?.metadata && typeof lastEstimate.metadata === 'object'
      ? lastEstimate.metadata
      : {}
  const lastNet = Number(lastMeta.net ?? 0)

  const meta = parseMetadataFromRow(row)
  const taxProfile = toTaxProfile(meta)
  const groups = useMemo(() => decideTaxes(taxProfile), [taxProfile])

  const pdfPayload = useMemo(
    () => ({
      profileSummary: meta,
      taxGroups: {
        applies: groups.applies.map((t) => ({ ...t, section: 'applies' })),
        mayApplyLater: groups.mayApplyLater.map((t) => ({ ...t, section: 'may' })),
        doesNotApply: groups.doesNotApply.map((t) => ({ ...t, section: 'does_not' })),
      },
      estimate: null,
      checklist: [],
    }),
    [meta, groups],
  )

  if (isLoading) {
    return <DashboardSkeleton />
  }
  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50/80 px-5 py-6 text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
        Could not load your profile. Check your connection and Supabase configuration.
      </div>
    )
  }

  const statItems = [
    { label: 'Identity', value: meta.identity ? String(meta.identity) : '—' },
    {
      label: 'Income type',
      value: meta.income_type?.replaceAll('_', ' ') ?? '—',
    },
    { label: 'Income range', value: meta.income_range ?? '—' },
    { label: 'VAT registered', value: meta.vat_registered ? 'Yes' : 'No' },
  ]

  const taxGridClass =
    'grid auto-rows-fr gap-2 sm:grid-cols-2 sm:gap-3 xl:grid-cols-3 xl:gap-3'

  return (
    <div className="relative space-y-4 pb-2 sm:space-y-5 lg:space-y-4">
      <div
        className="pointer-events-none absolute -left-20 -top-8 h-56 w-56 rounded-full bg-brand-400/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-0 top-40 h-48 w-48 rounded-full bg-sky-400/10 blur-3xl"
        aria-hidden
      />

      <header className="tc-animate-fade-up relative shrink-0">
        <h1 className="bg-gradient-to-r from-zinc-900 via-brand-800 to-zinc-800 bg-clip-text text-2xl font-bold tracking-tight text-transparent dark:from-zinc-100 dark:via-brand-300 dark:to-zinc-200 sm:text-3xl">
          Tax dashboard
        </h1>
        <p className="mt-1 max-w-2xl text-xs text-zinc-600 dark:text-zinc-400 sm:text-sm">
          Profile, grouped taxes, and quick actions.
        </p>
      </header>

      {reminder.due ? (
        <div className="tc-animate-fade-up">
          <EstimateReminderBanner
            message={reminder.message}
            onDismiss={reminder.clearReminder}
            onSnooze={reminder.snoozeDays}
          />
        </div>
      ) : null}

      {lastEstimate && lastNet > 0 ? (
        <Card className="tc-animate-fade-up !border-brand-200/80 !bg-brand-50/50 !py-4 dark:!border-brand-900/40 dark:!bg-brand-950/30">
          <p className="text-xs font-medium uppercase tracking-wide text-brand-800 dark:text-brand-300">
            Latest saved estimate
          </p>
          <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Net {formatXaf(lastNet)}{' '}
            <span className="text-sm font-normal text-zinc-600 dark:text-zinc-400">/ month</span>
          </p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {lastEstimate.created_at
              ? new Date(lastEstimate.created_at).toLocaleString()
              : ''}
          </p>
          <Link
            to="/app/history"
            className="mt-3 inline-block text-sm font-medium text-brand-700 underline dark:text-brand-400"
          >
            View full history
          </Link>
        </Card>
      ) : null}

      <Card className="tc-animate-fade-up tc-delay-1 relative shrink-0 overflow-hidden !border-zinc-200/60 !bg-white/90 !p-0 !shadow-lg backdrop-blur-md dark:!border-zinc-700/60 dark:!bg-zinc-900/95">
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand-500 via-violet-500 to-sky-500" />
        <div className="p-4 sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">Your tax profile</h2>
            <span className="inline-flex w-fit items-center rounded-full bg-brand-50 px-2.5 py-0.5 text-[10px] font-medium text-brand-800 ring-1 ring-brand-100 dark:bg-brand-950/80 dark:text-brand-200 dark:ring-brand-500/30 sm:text-xs">
              From onboarding
            </span>
          </div>

          <dl className="mt-3 grid grid-cols-2 gap-2 lg:mt-4 lg:grid-cols-4">
            {statItems.map((item, i) => (
              <div
                key={item.label}
                className="tc-animate-fade-up rounded-xl border border-zinc-100 bg-gradient-to-b from-zinc-50/80 to-white px-3 py-2 shadow-sm transition hover:border-brand-100 dark:border-zinc-700 dark:from-zinc-900/90 dark:to-zinc-900/70 dark:hover:border-brand-800/50 sm:px-3 sm:py-2.5"
                style={{ animationDelay: `${0.12 + i * 0.05}s` }}
              >
                <dt className="text-[10px] font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400 sm:text-xs">
                  {item.label}
                </dt>
                <dd className="mt-0.5 truncate text-sm font-semibold capitalize text-zinc-900 dark:text-zinc-50">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-4 flex flex-wrap gap-2 sm:mt-5">
            <Link
              to="/app/estimation"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-brand-600/20 transition hover:scale-[1.02] active:scale-[0.98] sm:text-sm"
            >
              See estimation
            </Link>
            <Button
              type="button"
              variant="secondary"
              className="rounded-xl border-zinc-200/80 px-3 py-2 text-xs shadow-sm sm:text-sm"
              onClick={() => setPdfOpen(true)}
            >
              Save PDF
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="rounded-xl px-3 py-2 text-xs sm:text-sm"
              onClick={() => setReminderOpen(true)}
            >
              Reminders
            </Button>
          </div>
        </div>
      </Card>

      <section className="tc-animate-fade-up tc-delay-2 min-w-0">
        <SectionHeader
          title="Applies"
          subtitle="Likely apply to your profile."
          accent="bg-emerald-500"
        />
        <div className={taxGridClass}>
          {groups.applies.map((t, i) => (
            <div
              key={t.code}
              className="tc-animate-fade-up min-h-0 min-w-0"
              style={{ animationDelay: `${0.04 * i}s` }}
            >
              <TaxCard {...t} section="applies" compact />
            </div>
          ))}
          {groups.applies.length === 0 ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">No taxes in this category.</p>
          ) : null}
        </div>
      </section>

      <section className="tc-animate-fade-up tc-delay-3 min-w-0">
        <SectionHeader
          title="May apply later"
          subtitle="Confirm with official guidance."
          accent="bg-amber-400"
        />
        <div className={taxGridClass}>
          {groups.mayApplyLater.map((t, i) => (
            <div
              key={t.code}
              className="tc-animate-fade-up min-h-0 min-w-0"
              style={{ animationDelay: `${0.04 * i}s` }}
            >
              <TaxCard {...t} section="may" compact />
            </div>
          ))}
        </div>
      </section>

      <section className="tc-animate-fade-up tc-delay-4 min-w-0">
        <SectionHeader
          title="Does not apply"
          subtitle="From your answers — update if things change."
          accent="bg-zinc-300"
        />
        <div className={taxGridClass}>
          {groups.doesNotApply.map((t, i) => (
            <div
              key={t.code}
              className="tc-animate-fade-up min-h-0 min-w-0"
              style={{ animationDelay: `${0.04 * i}s` }}
            >
              <TaxCard {...t} section="does_not" compact />
            </div>
          ))}
        </div>
      </section>

      <PdfExportDialog open={pdfOpen} onClose={() => setPdfOpen(false)} payload={pdfPayload} />
      <EstimateReminderDialog
        open={reminderOpen}
        onClose={() => setReminderOpen(false)}
        onConfirm={(days, message) => reminder.setReminderInDays(days, message)}
      />
    </div>
  )
}
