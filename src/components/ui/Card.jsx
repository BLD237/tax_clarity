/**
 * @param {object} props
 * @param {import('react').ReactNode} props.children
 * @param {string} [props.className]
 * @param {import('react').HTMLAttributes<HTMLDivElement>} props
 */
export function Card({ children, className = '', style, ...rest }) {
  return (
    <div
      className={`rounded-2xl border border-zinc-200/80 bg-white p-5 text-zinc-900 shadow-sm dark:border-zinc-700/80 dark:bg-zinc-900/90 dark:text-zinc-100 dark:shadow-zinc-950/50 ${className}`}
      style={style}
      {...rest}
    >
      {children}
    </div>
  )
}
