import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useSessionStore } from '../../stores/sessionStore.js'
import {
  deleteTaxEstimate,
  listTaxEstimates,
  patchTaxEstimateMetadata,
} from '../../features/estimates/estimatesApi.js'
import { Card } from '../../components/ui/Card.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { formatXaf } from '../../lib/format.js'

function csvEscape(value) {
  const s = value == null ? '' : String(value)
  return `"${s.replace(/"/g, '""')}"`
}

function buildHistoryCsv(rows) {
  const header = ['Saved at', 'Gross monthly', 'IRPP', 'CNPS', 'Net', 'Effective %', 'Note']
  const lines = [header.join(',')]
  for (const row of rows) {
    const m = row.metadata && typeof row.metadata === 'object' ? row.metadata : {}
    const gross = Number(m.gross_monthly ?? 0)
    const irpp = Number(m.irpp ?? 0)
    const cnps = Number(m.cnps ?? 0)
    const net = Number(m.net ?? 0)
    const rate =
      row.effective_rate != null
        ? Number(row.effective_rate).toFixed(2)
        : gross > 0
          ? (((irpp + cnps) / gross) * 100).toFixed(2)
          : ''
    const note = typeof m.user_note === 'string' ? m.user_note : ''
    lines.push(
      [
        csvEscape(row.created_at ? new Date(row.created_at).toISOString() : ''),
        csvEscape(gross),
        csvEscape(irpp),
        csvEscape(cnps),
        csvEscape(net),
        csvEscape(rate),
        csvEscape(note),
      ].join(','),
    )
  }
  return lines.join('\n')
}

export function HistoryPage() {
  const user = useSessionStore((s) => s.user)
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [expandedId, setExpandedId] = useState(/** @type {string | null} */ (null))
  const [noteDraftById, setNoteDraftById] = useState(/** @type {Record<string, string>} */ ({}))

  const { data, isLoading, isError } = useQuery({
    queryKey: ['estimates', user?.id],
    queryFn: () => listTaxEstimates(user.id),
    enabled: Boolean(user?.id),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await deleteTaxEstimate(id)
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['estimates', user?.id] })
      setExpandedId(null)
    },
  })

  const noteMutation = useMutation({
    mutationFn: async ({ id, note }) => {
      if (!user?.id) throw new Error('Not signed in')
      const trimmed = note.trim().slice(0, 2000)
      await patchTaxEstimateMetadata(user.id, id, { user_note: trimmed || null })
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['estimates', user?.id] })
    },
  })

  function downloadCsv() {
    const rows = data ?? []
    if (rows.length === 0) return
    const blob = new Blob([buildHistoryCsv(rows)], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `taxclarity-estimates-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return <p className="text-zinc-500 dark:text-zinc-400">Loading history…</p>
  }
  if (isError) {
    return <p className="text-red-600 dark:text-red-400">Could not load estimates.</p>
  }

  const rows = data ?? []
  if (rows.length === 0) {
    return (
      <Card>
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Estimation history</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">No saved estimates yet.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Estimation history</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Open a row for details, notes, and actions.
          </p>
        </div>
        <Button type="button" variant="secondary" onClick={downloadCsv}>
          Export CSV
        </Button>
      </div>

      <ul className="space-y-3">
        {rows.map((row) => {
          const id = row.id
          if (!id) return null
          const m = row.metadata && typeof row.metadata === 'object' ? row.metadata : {}
          const gross = Number(m.gross_monthly ?? 0)
          const net = Number(m.net ?? 0)
          const irpp = Number(m.irpp ?? 0)
          const cnps = Number(m.cnps ?? 0)
          const expanded = expandedId === id
          const savedNote = typeof m.user_note === 'string' ? m.user_note : ''
          const draft = noteDraftById[id] ?? savedNote

          return (
            <li key={id}>
              <Card className="!py-4">
                <button
                  type="button"
                  className="flex w-full flex-wrap items-baseline justify-between gap-2 text-left"
                  onClick={() => {
                    setExpandedId(expanded ? null : id)
                    setNoteDraftById((prev) => ({ ...prev, [id]: savedNote }))
                  }}
                  aria-expanded={expanded}
                >
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    {row.created_at ? new Date(row.created_at).toLocaleString() : '—'}
                  </span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                    Net: {formatXaf(net)}
                    <span className="ml-2 text-xs font-normal text-zinc-500 dark:text-zinc-400">
                      {expanded ? '▲' : '▼'}
                    </span>
                  </span>
                </button>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Gross {formatXaf(gross)} · IRPP {formatXaf(irpp)} · CNPS {formatXaf(cnps)}
                </p>

                {expanded ? (
                  <div className="mt-4 space-y-4 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                    <div className="grid gap-2 text-sm sm:grid-cols-2">
                      <div className="rounded-xl bg-zinc-50 px-3 py-2 dark:bg-zinc-800/80">
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Effective tax on gross</p>
                        <p className="font-medium text-zinc-900 dark:text-zinc-100">
                          {gross > 0
                            ? `${(((irpp + cnps) / gross) * 100).toFixed(2)}%`
                            : '—'}
                        </p>
                      </div>
                      <div className="rounded-xl bg-zinc-50 px-3 py-2 dark:bg-zinc-800/80">
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Annual net (×12)</p>
                        <p className="font-medium text-zinc-900 dark:text-zinc-100">
                          {formatXaf(net * 12)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor={`note-${id}`}
                        className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
                      >
                        Note
                      </label>
                      <textarea
                        id={`note-${id}`}
                        className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-600 dark:bg-white dark:text-zinc-900"
                        rows={2}
                        value={draft}
                        placeholder="Optional context for this save…"
                        onChange={(e) =>
                          setNoteDraftById((prev) => ({ ...prev, [id]: e.target.value }))
                        }
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        className="mt-2"
                        disabled={noteMutation.isPending}
                        onClick={() => noteMutation.mutate({ id, note: draft })}
                      >
                        {noteMutation.isPending ? 'Saving…' : 'Save note'}
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => navigate('/app/estimation', { state: { prefillGross: gross } })}
                      >
                        Open in calculator
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-900/50 dark:text-red-300 dark:hover:bg-red-950/40"
                        disabled={deleteMutation.isPending}
                        onClick={() => {
                          if (
                            typeof window !== 'undefined' &&
                            window.confirm('Delete this saved estimate? This cannot be undone.')
                          ) {
                            deleteMutation.mutate(id)
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ) : null}
              </Card>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
