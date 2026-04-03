/**
 * @param {object} props
 * @param {import('react').ReactNode} props.children
 * @param {'default' | 'success' | 'warning'} [props.tone]
 */
export function Badge({ children, tone = 'default' }) {
  const tones = {
    default: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200',
    success: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200',
    warning: 'bg-amber-50 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200',
  }
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  )
}
