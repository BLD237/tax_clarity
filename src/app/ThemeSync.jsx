import { useEffect } from 'react'
import { useThemeStore } from '../stores/themeStore.js'
import { applyThemeForMode } from '../lib/theme.js'

/** Re-apply theme when OS preference changes while mode is "system". */
export function ThemeSync() {
  const mode = useThemeStore((s) => s.mode)

  useEffect(() => {
    if (mode !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => applyThemeForMode('system')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [mode])

  return null
}
