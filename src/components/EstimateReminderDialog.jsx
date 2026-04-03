import { useState } from 'react'
import { Button } from './ui/Button.jsx'
import { Card } from './ui/Card.jsx'

const PRESETS = [
  { days: 7, label: '1 week' },
  { days: 14, label: '2 weeks' },
  { days: 30, label: '30 days' },
]

/**
 * @param {{ open: boolean, onClose: () => void, onConfirm: (days: number, message: string) => void }} props
 */
export function EstimateReminderDialog({ open, onClose, onConfirm }) {
  const [message, setMessage] = useState(
    'Review your salary estimate and checklist.',
  )

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 backdrop-blur-sm sm:items-center dark:bg-black/60"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reminder-dialog-title"
      onClick={onClose}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <Card className="relative !p-6">
          <h2 id="reminder-dialog-title" className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Set a reminder
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            We&apos;ll show a notice in the app when it&apos;s time. Stored only on this device.
          </p>
          <label className="mt-4 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Message
            <textarea
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-500 dark:border-zinc-600 dark:bg-white dark:text-zinc-900"
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </label>
          <p className="mt-4 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Remind me in
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <Button
                key={p.days}
                type="button"
                variant="secondary"
                className="!py-2 text-xs"
                onClick={() => {
                  onConfirm(p.days, message.trim() || 'Review your salary estimate and checklist.')
                  onClose()
                }}
              >
                {p.label}
              </Button>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
