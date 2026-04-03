import { create } from 'zustand'
import {
  applyThemeForMode,
  getInitialThemeMode,
  persistThemeMode,
} from '../lib/theme.js'

export const useThemeStore = create((set) => ({
  /** @type {import('../lib/theme.js').ThemeMode} */
  mode: typeof window !== 'undefined' ? getInitialThemeMode() : 'system',
  /**
   * @param {import('../lib/theme.js').ThemeMode} mode
   */
  setMode: (mode) => {
    if (mode !== 'light' && mode !== 'dark' && mode !== 'system') return
    persistThemeMode(mode)
    applyThemeForMode(mode)
    set({ mode })
  },
}))
