import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { useSessionStore } from '../../stores/sessionStore.js'
import { useThemeStore } from '../../stores/themeStore.js'
import { getSupabase } from '../../lib/supabase/client.js'
import { updateUserMetadata } from '../../features/profile/profileApi.js'
import { useUserProfile } from '../../hooks/useUserProfile.js'
import { parseMetadataFromRow } from '../../features/profile/metadata.js'
import { useLocalStorageState } from '../../hooks/useLocalStorageState.js'
import { LEGAL } from '../../lib/legal.js'
import { Card } from '../../components/ui/Card.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Switch } from '../../components/ui/Switch.jsx'
import { getUserDisplayName, getUserFullName } from '../../lib/userDisplay.js'

const PREFS_KEY = 'taxclarity-app-prefs'

/** @param {{ label: string, description?: string, children: import('react').ReactNode }} props */
function SettingRow({ label, description, children }) {
  return (
    <div className="flex flex-col gap-3 border-b border-zinc-100 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
      <div className="min-w-0">
        <p className="font-medium text-zinc-900 dark:text-zinc-100">{label}</p>
        {description ? (
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
        ) : null}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

export function SettingsPage() {
  const user = useSessionStore((s) => s.user)
  const qc = useQueryClient()
  const navigate = useNavigate()
  const themeMode = useThemeStore((s) => s.mode)
  const setThemeMode = useThemeStore((s) => s.setMode)
  const { data: profileRow } = useUserProfile()
  const [copiedId, setCopiedId] = useState(false)

  const [prefs, setPrefs] = useLocalStorageState(PREFS_KEY, {
    showOnboardingTips: true,
    productUpdateEmails: false,
    weeklySummary: false,
  })

  const resetMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('Not signed in')
      await updateUserMetadata(user.id, { onboardingComplete: false })
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['profile', user?.id] })
      navigate('/onboarding/identity')
    },
  })

  async function signOut() {
    await getSupabase()?.auth.signOut()
  }

  function exportMyData() {
    const meta = parseMetadataFromRow(profileRow)
    const payload = {
      exportedAt: new Date().toISOString(),
      userId: user?.id ?? null,
      email: user?.email ?? null,
      fullName: getUserFullName(user) || null,
      profileRow: profileRow ?? null,
      metadata: meta,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `taxclarity-export-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function copyUserId() {
    if (!user?.id) return
    try {
      await navigator.clipboard.writeText(user.id)
      setCopiedId(true)
      window.setTimeout(() => setCopiedId(false), 2000)
    } catch {
      /* ignore */
    }
  }

  function clearLocalPreferences() {
    try {
      localStorage.removeItem(PREFS_KEY)
    } catch {
      /* ignore */
    }
    setPrefs({
      showOnboardingTips: true,
      productUpdateEmails: false,
      weeklySummary: false,
    })
  }

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Settings</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Account, appearance, preferences, and data.
        </p>
      </div>

      <Card className="!p-0 !shadow-md">
        <div className="border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Appearance</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Choose how TaxClarity looks on this device.
          </p>
        </div>
        <div className="px-5 pb-2">
          <SettingRow
            label="Theme"
            description="Light, dark, or match your system setting."
          >
            <div
              className="inline-flex rounded-xl border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-700 dark:bg-zinc-800/80"
              role="group"
              aria-label="Theme"
            >
              {(['light', 'dark', 'system']).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setThemeMode(/** @type {'light' | 'dark' | 'system'} */ (m))}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition sm:px-4 sm:text-sm ${
                    themeMode === m
                      ? 'bg-white text-brand-700 shadow-sm dark:bg-zinc-700 dark:text-white'
                      : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </SettingRow>
        </div>
      </Card>

      <Card className="!p-0 !shadow-md">
        <div className="border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Notifications</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Preferences stored on this device. Full email alerts can be wired to your backend later.
          </p>
        </div>
        <div className="px-5 pb-2">
          <SettingRow
            label="In-app tips"
            description="Show helpful hints on dashboard and estimation screens."
          >
            <Switch
              id="tips"
              checked={prefs.showOnboardingTips}
              onChange={(v) => setPrefs((p) => ({ ...p, showOnboardingTips: v }))}
            />
          </SettingRow>
          <SettingRow
            label="Product updates"
            description="Occasional news about new calculators and features."
          >
            <Switch
              id="product"
              checked={prefs.productUpdateEmails}
              onChange={(v) => setPrefs((p) => ({ ...p, productUpdateEmails: v }))}
            />
          </SettingRow>
          <SettingRow
            label="Weekly summary"
            description="Placeholder for a future email digest of your saved estimates."
          >
            <Switch
              id="weekly"
              checked={prefs.weeklySummary}
              onChange={(v) => setPrefs((p) => ({ ...p, weeklySummary: v }))}
            />
          </SettingRow>
        </div>
      </Card>

      <Card className="!p-0 !shadow-md">
        <div className="border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Account</h2>
        </div>
        <div className="px-5 py-4">
          {getUserFullName(user) ? (
            <>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {getUserFullName(user)}
              </p>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{user?.email}</p>
            </>
          ) : (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{getUserDisplayName(user)}</p>
          )}
          {user?.id ? (
            <p className="mt-3 font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
              ID: {user.id.slice(0, 8)}…
            </p>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button type="button" variant="secondary" onClick={copyUserId} disabled={!user?.id}>
              {copiedId ? 'Copied' : 'Copy user ID'}
            </Button>
            <Button type="button" variant="secondary" onClick={signOut}>
              Sign out
            </Button>
          </div>
        </div>
      </Card>

      <Card className="!p-0 !shadow-md">
        <div className="border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Data & privacy</h2>
        </div>
        <div className="px-5 pb-2">
          <SettingRow
            label="Export my data"
            description="Download a JSON file with your profile metadata and account identifiers."
          >
            <Button type="button" variant="secondary" onClick={exportMyData}>
              Download JSON
            </Button>
          </SettingRow>
          <SettingRow
            label="Clear local preferences"
            description="Resets notification toggles on this browser. Theme choice is kept."
          >
            <Button type="button" variant="secondary" onClick={clearLocalPreferences}>
              Clear prefs
            </Button>
          </SettingRow>
          <div className="flex flex-wrap gap-3 py-4 text-sm">
            <Link
              to="/privacy"
              className="font-medium text-brand-700 underline decoration-brand-300 underline-offset-2 dark:text-brand-400"
            >
              Privacy policy
            </Link>
            <span className="text-zinc-300 dark:text-zinc-600" aria-hidden>
              ·
            </span>
            <Link
              to="/terms"
              className="font-medium text-brand-700 underline decoration-brand-300 underline-offset-2 dark:text-brand-400"
            >
              Terms of service
            </Link>
            <span className="text-zinc-300 dark:text-zinc-600" aria-hidden>
              ·
            </span>
            <Link
              to="/pricing"
              className="font-medium text-brand-700 underline decoration-brand-300 underline-offset-2 dark:text-brand-400"
            >
              Pricing
            </Link>
          </div>
        </div>
      </Card>

      <Card className="!p-0 !shadow-md">
        <div className="border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Onboarding</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Re-run identity and income steps. Your profile row is kept; only completion is cleared.
          </p>
        </div>
        <div className="px-5 py-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => resetMutation.mutate()}
            disabled={resetMutation.isPending}
          >
            {resetMutation.isPending ? 'Resetting…' : 'Reset onboarding'}
          </Button>
          {resetMutation.isError ? (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {resetMutation.error.message}
            </p>
          ) : null}
        </div>
      </Card>

      <Card className="!p-0 !shadow-md">
        <div className="border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Support</h2>
        </div>
        <div className="space-y-3 px-5 py-4 text-sm text-zinc-600 dark:text-zinc-400">
          <p>
            Questions or billing:{' '}
            <a
              href={`mailto:${LEGAL.supportEmail}`}
              className="font-medium text-brand-700 dark:text-brand-400"
            >
              {LEGAL.supportEmail}
            </a>
          </p>
          <p>
            Privacy requests:{' '}
            <a
              href={`mailto:${LEGAL.privacyEmail}`}
              className="font-medium text-brand-700 dark:text-brand-400"
            >
              {LEGAL.privacyEmail}
            </a>
          </p>
        </div>
      </Card>

      <Card className="border-dashed border-zinc-200 dark:border-zinc-700">
        <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">About</h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {LEGAL.productName} · web app v{__APP_VERSION__}
        </p>
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
          Estimates are illustrative. Not tax or legal advice.
        </p>
      </Card>
    </div>
  )
}
