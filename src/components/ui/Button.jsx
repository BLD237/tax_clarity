/**
 * @param {object} props
 * @param {import('react').ReactNode} [props.children]
 * @param {'primary' | 'secondary' | 'ghost'} [props.variant]
 * @param {string} [props.className]
 * @param {import('react').ButtonHTMLAttributes<HTMLButtonElement>} props
 */
export function Button({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  ...rest
}) {
  const base =
    'inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 disabled:opacity-50'
  const variants = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm dark:shadow-brand-900/30',
    secondary:
      'border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700',
    ghost:
      'text-brand-700 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-950/50 dark:hover:text-brand-300',
  }
  return (
    <button type={type} className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  )
}
