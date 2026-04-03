export const THEME_STORAGE_KEY = 'taxclarity-theme-mode'

/** @typedef {'light' | 'dark' | 'system'} ThemeMode */

/** @returns {ThemeMode} */
export function getInitialThemeMode() {
  if (typeof window === 'undefined') return 'system'
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY)
    if (v === 'light' || v === 'dark' || v === 'system') return v
  } catch {
    /* ignore */
  }
  return 'system'
}

/**
 * @param {ThemeMode} mode
 * @returns {boolean}
 */
export function resolveDark(mode) {
  if (mode === 'dark') return true
  if (mode === 'light') return false
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/**
 * @param {ThemeMode} mode
 */
export function applyThemeForMode(mode) {
  if (typeof document === 'undefined') return
  const dark = resolveDark(mode)
  document.documentElement.classList.toggle('dark', dark)
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
}

/**
 * @param {ThemeMode} mode
 */
export function persistThemeMode(mode) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode)
  } catch {
    /* ignore */
  }
}
