import { useEffect, useState } from 'react'

/**
 * @template T
 * @param {string} key
 * @param {T} initial
 * @returns {[T, (v: T | ((prev: T) => T)) => void]}
 */
export function useLocalStorageState(key, initial) {
  const [state, setState] = useState(() => {
    if (typeof window === 'undefined') return initial
    try {
      const raw = localStorage.getItem(key)
      if (raw == null) return initial
      return /** @type {T} */ (JSON.parse(raw))
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch {
      /* ignore */
    }
  }, [key, state])

  return [state, setState]
}
