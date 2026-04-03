import { Button } from './ui/Button.jsx'

/**
 * @param {{ message: string, onDismiss: () => void, onSnooze: (days: number) => void }} props
 */
export function EstimateReminderBanner({ message, onDismiss, onSnooze }) {
  return (
    <div
      className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50/90 p-4 text-sm text-amber-950 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-100 sm:flex-row sm:items-center sm:justify-between"
      role="status"
    >
      <p className="min-w-0 font-medium">
        <span className="mr-1.5" aria-hidden>
          ⏰
        </span>
        {message}
      </p>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="secondary" className="!py-2 text-xs" onClick={() => onSnooze(7)}>
          Snooze 7 days
        </Button>
        <Button type="button" variant="secondary" className="!py-2 text-xs" onClick={onDismiss}>
          Dismiss
        </Button>
      </div>
    </div>
  )
}
