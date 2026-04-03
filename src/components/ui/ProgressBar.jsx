/**
 * @param {{ value: number; max?: number; className?: string }} props
 */
export function ProgressBar({ value, max = 100, className = '' }) {
  const pct = max <= 0 ? 0 : Math.min(100, Math.round((value / max) * 100))
  return (
    <div
      className={`h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800 ${className}`}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
