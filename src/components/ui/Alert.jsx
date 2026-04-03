/**
 * @param {object} props
 * @param {'info' | 'error'} [props.variant]
 * @param {import('react').ReactNode} props.children
 */
export function Alert({ variant = 'info', children }) {
  const styles =
    variant === 'error'
      ? 'border-red-200 bg-red-50 text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200'
      : 'border-brand-200 bg-brand-50 text-brand-900 dark:border-brand-800/50 dark:bg-brand-950/40 dark:text-brand-100'
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${styles}`} role="status">
      {children}
    </div>
  )
}
