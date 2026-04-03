import { useCallback, useMemo, useState } from 'react'

export const ESTIMATE_REMINDER_STORAGE_KEY = 'taxclarity-estimate-reminder-v1'

const DEFAULT_MESSAGE = 'Review your salary estimate and checklist.'

function readRaw() {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(ESTIMATE_REMINDER_STORAGE_KEY)
    if (!raw) return null
    const o = JSON.parse(raw)
    if (!o || typeof o.fireAt !== 'string') return null
    return o
  } catch {
    return null
  }
}

export function isReminderDue(raw) {
  if (!raw?.fireAt) return false
  return new Date(raw.fireAt) <= new Date()
}

/**
 * Local reminder for revisiting estimates (no server).
 */
export function useEstimateReminder() {
  const [version, setVersion] = useState(0)
  const refresh = useCallback(() => setVersion((v) => v + 1), [])

  const snapshot = useMemo(() => {
    const raw = readRaw()
    return {
      raw,
      due: raw ? isReminderDue(raw) : false,
      message: typeof raw?.message === 'string' ? raw.message : DEFAULT_MESSAGE,
    }
  }, [version])

  const setReminderInDays = useCallback(
    (days, message = DEFAULT_MESSAGE) => {
      const fireAt = new Date(Date.now() + Math.max(1, days) * 864e5).toISOString()
      localStorage.setItem(
        ESTIMATE_REMINDER_STORAGE_KEY,
        JSON.stringify({
          fireAt,
          message: String(message).slice(0, 500) || DEFAULT_MESSAGE,
          createdAt: new Date().toISOString(),
        }),
      )
      refresh()
    },
    [refresh],
  )

  const clearReminder = useCallback(() => {
    localStorage.removeItem(ESTIMATE_REMINDER_STORAGE_KEY)
    refresh()
  }, [refresh])

  const snoozeDays = useCallback(
    (days) => {
      const raw = readRaw()
      if (!raw) return
      const msg = typeof raw.message === 'string' ? raw.message : DEFAULT_MESSAGE
      setReminderInDays(days, msg)
    },
    [setReminderInDays],
  )

  return {
    ...snapshot,
    refresh,
    setReminderInDays,
    clearReminder,
    snoozeDays,
  }
}
