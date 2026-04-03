import { useState } from 'react'
import { Badge } from './ui/Badge.jsx'
import { Button } from './ui/Button.jsx'

/**
 * @param {object} props
 * @param {string} props.name
 * @param {string} props.code
 * @param {'applies' | 'may' | 'does_not'} props.section
 * @param {string} props.learnMore
 * @param {boolean} [props.compact] denser padding and type for dashboard density
 */
export function TaxCard({ name, code, section, learnMore, compact = false }) {
  const [open, setOpen] = useState(false)
  const badge =
    section === 'applies' ? (
      <Badge tone="success">Applies</Badge>
    ) : section === 'may' ? (
      <Badge tone="warning">May apply later</Badge>
    ) : (
      <Badge>Does not apply</Badge>
    )
  const pad = compact ? 'p-3' : 'p-4'
  const titleCls = compact
    ? 'text-sm font-semibold leading-snug text-zinc-900 dark:text-zinc-50'
    : 'text-base font-semibold text-zinc-900 dark:text-zinc-50'
  const codeCls = compact
    ? 'text-[10px] text-zinc-500 dark:text-zinc-400'
    : 'text-xs text-zinc-500 dark:text-zinc-400'

  return (
    <article
      className={`group flex h-full flex-col rounded-xl border border-zinc-200/80 bg-white/95 shadow-sm backdrop-blur-sm transition-all duration-300 ease-out hover:border-brand-200/70 hover:shadow-md dark:border-zinc-700/80 dark:bg-zinc-900/90 dark:hover:border-brand-600/40 ${compact ? 'hover:-translate-y-0.5' : 'hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-500/5'} ${pad}`}
    >
      <div className="flex min-w-0 flex-1 flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className={compact ? `${titleCls} line-clamp-2` : titleCls}>{name}</h3>
          <p className={`mt-0.5 ${codeCls}`}>{code}</p>
        </div>
        <div className="shrink-0 scale-90 origin-top-right">{badge}</div>
      </div>
      <div className={compact ? 'mt-2' : 'mt-3'}>
        <Button
          type="button"
          variant="ghost"
          className={`!px-0 ${compact ? '!py-0.5 text-xs' : '!py-1 text-sm'}`}
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
        >
          {open ? 'Hide' : 'Learn more'}
        </Button>
        {open ? (
          <p
            className={`mt-1.5 leading-relaxed text-zinc-600 dark:text-zinc-400 ${compact ? 'max-h-28 overflow-y-auto text-xs' : 'mt-2 text-sm'}`}
          >
            {learnMore}
          </p>
        ) : null}
      </div>
    </article>
  )
}
