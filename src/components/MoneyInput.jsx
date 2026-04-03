import { useId } from 'react'

/**
 * @param {object} props
 * @param {string} props.label
 * @param {number | ''} props.value
 * @param {(v: number | '') => void} props.onChange
 */
export function MoneyInput({ label, value, onChange }) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400 dark:text-zinc-500">
          XAF
        </span>
        <input
          id={id}
          inputMode="numeric"
          className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-14 pr-3 text-zinc-900 shadow-sm placeholder:text-zinc-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          value={value === '' ? '' : String(value)}
          onChange={(e) => {
            const raw = e.target.value.replace(/\D/g, '')
            onChange(raw === '' ? '' : Number(raw))
          }}
        />
      </div>
    </div>
  )
}
