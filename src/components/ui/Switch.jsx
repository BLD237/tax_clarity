/**
 * @param {object} props
 * @param {boolean} props.checked
 * @param {(checked: boolean) => void} props.onChange
 * @param {string} props.id
 * @param {boolean} [props.disabled]
 */
export function Switch({ checked, onChange, id, disabled = false }) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-[3.25rem] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-zinc-900 ${
        checked ? 'bg-brand-600' : 'bg-zinc-200 dark:bg-zinc-700'
      }`}
    >
      <span
        className={`pointer-events-none absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-200 ease-out ${
          checked ? 'left-[calc(100%-1.375rem)]' : 'left-0.5'
        }`}
      />
    </button>
  )
}
