import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { useUserProfile } from '../../hooks/useUserProfile.js'
import { parseMetadataFromRow, toTaxProfile } from '../../features/profile/metadata.js'
import { decideTaxes } from '../../features/taxes/engine.js'
import { estimateTakeHome } from '../../features/estimation/calculator.js'
import {
  fetchTaxIdByCode,
  insertTaxEstimate,
} from '../../features/estimates/estimatesApi.js'
import { useSessionStore } from '../../stores/sessionStore.js'
import { formatXaf } from '../../lib/format.js'
import { MoneyInput } from '../../components/MoneyInput.jsx'
import { Card } from '../../components/ui/Card.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { ProgressBar } from '../../components/ui/ProgressBar.jsx'
import { PdfExportDialog } from '../../components/PdfExportDialog.jsx'
import { EstimateReminderDialog } from '../../components/EstimateReminderDialog.jsx'
import { EstimateReminderBanner } from '../../components/EstimateReminderBanner.jsx'
import { useEstimateReminder } from '../../hooks/useEstimateReminder.js'

const DEFAULT_CHECKLIST = [
  'Confirm your employment contract and pay slips',
  'Verify CNPS registration category with your employer',
  'Keep proof of deductible items if applicable',
]

export function EstimationPage() {
  const user = useSessionStore((s) => s.user)
  const qc = useQueryClient()
  const location = useLocation()
  const navigate = useNavigate()
  const reminder = useEstimateReminder()
  const { data: row } = useUserProfile()
  const meta = parseMetadataFromRow(row)
  const taxProfile = toTaxProfile(meta)
  const taxGroups = useMemo(() => decideTaxes(taxProfile), [taxProfile])

  const [gross, setGross] = useState(500_000)
  const [checklist, setChecklist] = useState(() =>
    DEFAULT_CHECKLIST.map((label) => ({ label, done: false })),
  )
  const [pdfOpen, setPdfOpen] = useState(false)
  const [reminderOpen, setReminderOpen] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [saveNote, setSaveNote] = useState('')
  const [showAnnual, setShowAnnual] = useState(false)

  useEffect(() => {
    const g = location.state?.prefillGross
    if (typeof g === 'number' && g > 0) {
      setGross(Math.round(g))
      navigate('/app/estimation', { replace: true, state: {} })
    }
  }, [location.state, navigate])

  const breakdown = useMemo(() => estimateTakeHome(gross || 0), [gross])

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('Not signed in')
      const taxId = await fetchTaxIdByCode('IRPP')
      await insertTaxEstimate(user.id, taxId, {
        gross: breakdown.gross,
        irpp: breakdown.irpp,
        cnps: breakdown.cnps,
        net: breakdown.net,
        note: saveNote,
      })
    },
    onSuccess: async () => {
      setSaveMsg('Estimate saved.')
      setSaveNote('')
      await qc.invalidateQueries({ queryKey: ['estimates', user?.id] })
    },
    onError: (e) => {
      setSaveMsg(e.message || 'Could not save estimate.')
    },
  })

  const pdfPayload = useMemo(
    () => ({
      profileSummary: meta,
      taxGroups: {
        applies: taxGroups.applies.map((t) => ({ ...t, section: 'applies' })),
        mayApplyLater: taxGroups.mayApplyLater.map((t) => ({ ...t, section: 'may' })),
        doesNotApply: taxGroups.doesNotApply.map((t) => ({ ...t, section: 'does_not' })),
      },
      estimate: breakdown,
      checklist: checklist.filter((c) => c.done).map((c) => c.label),
    }),
    [meta, taxGroups, breakdown, checklist],
  )

  const mult = showAnnual ? 12 : 1
  const labelPeriod = showAnnual ? 'annual' : 'monthly'

  return (
    <div className="space-y-8">
      {reminder.due ? (
        <EstimateReminderBanner
          message={reminder.message}
          onDismiss={reminder.clearReminder}
          onSnooze={reminder.snoozeDays}
        />
      ) : null}

      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Tax estimation</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Monthly gross salary (XAF). IRPP uses progressive brackets; CNPS employee share 4.2%.
        </p>
      </div>

      <Card>
        <MoneyInput label="Monthly gross salary (XAF)" value={gross} onChange={setGross} />
        <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
          <input
            type="checkbox"
            checked={showAnnual}
            onChange={(e) => setShowAnnual(e.target.checked)}
            className="size-4 rounded border-zinc-300 accent-brand-600 dark:border-zinc-500 dark:accent-brand-400"
          />
          <span>Also show annual figures (×12)</span>
        </label>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-brand-50 p-4 dark:bg-brand-950/50 dark:ring-1 dark:ring-brand-500/20">
            <p className="text-sm text-brand-900 dark:text-brand-200">
              Take-home (net, {labelPeriod})
            </p>
            <p className="mt-1 text-2xl font-semibold text-brand-950 dark:text-brand-50">
              {formatXaf(breakdown.net * mult)}
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-100 p-4 text-sm dark:border-zinc-700 dark:bg-zinc-950/40 dark:text-zinc-100">
            <div className="flex justify-between py-1">
              <span className="text-zinc-500 dark:text-zinc-400">IRPP ({labelPeriod})</span>
              <span className="font-medium">{formatXaf(breakdown.irpp * mult)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-zinc-500 dark:text-zinc-400">CNPS (4.2%, {labelPeriod})</span>
              <span className="font-medium">{formatXaf(breakdown.cnps * mult)}</span>
            </div>
            <div className="flex justify-between border-t border-zinc-100 py-2 font-medium dark:border-zinc-700">
              <span>Total deductions ({labelPeriod})</span>
              <span>{formatXaf(breakdown.totalDeductions * mult)}</span>
            </div>
          </div>
        </div>
        <div className="mt-6 space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Deductions vs gross
          </p>
          <ProgressBar value={breakdown.totalDeductions} max={breakdown.gross || 1} />
        </div>
        {showAnnual ? (
          <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
            Annual figures scale the same monthly estimate ×12 (simplified; your real annual IRPP can
            differ).
          </p>
        ) : null}
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Checklist</h2>
        <ul className="mt-4 space-y-3">
          {checklist.map((item, i) => (
            <li key={item.label} className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                className="mt-1"
                checked={item.done}
                onChange={() =>
                  setChecklist((prev) =>
                    prev.map((c, j) => (j === i ? { ...c, done: !c.done } : c)),
                  )
                }
              />
              <span
                className={
                  item.done
                    ? 'text-zinc-400 line-through dark:text-zinc-500'
                    : 'text-zinc-700 dark:text-zinc-300'
                }
              >
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="!py-4">
        <label htmlFor="save-note" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Note with next save (optional)
        </label>
        <textarea
          id="save-note"
          className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-600 dark:bg-white dark:text-zinc-900"
          rows={2}
          placeholder="e.g. Scenario after raise, contract end date…"
          value={saveNote}
          onChange={(e) => setSaveNote(e.target.value)}
        />
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="secondary" onClick={() => setReminderOpen(true)}>
          Set reminder
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending}
        >
          {saveMutation.isPending ? 'Saving…' : 'Save estimate'}
        </Button>
        <Button type="button" onClick={() => setPdfOpen(true)}>
          Save PDF
        </Button>
        <Button type="button" variant="secondary" onClick={() => setPdfOpen(true)}>
          Share (PDF)
        </Button>
      </div>
      {saveMsg ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{saveMsg}</p>
      ) : null}

      <PdfExportDialog open={pdfOpen} onClose={() => setPdfOpen(false)} payload={pdfPayload} />
      <EstimateReminderDialog
        open={reminderOpen}
        onClose={() => setReminderOpen(false)}
        onConfirm={(days, message) => reminder.setReminderInDays(days, message)}
      />
    </div>
  )
}
