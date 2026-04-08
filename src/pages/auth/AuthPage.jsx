import { useState } from 'react'
import { z } from 'zod'
import { Card } from '../../components/ui/Card.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Alert } from '../../components/ui/Alert.jsx'
import { getSupabase, isSupabaseConfigured } from '../../lib/supabase/client.js'

const EMAIL_REDIRECT_TO = 'https://tax-clarity.vercel.app/auth'

const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(8, 'Use at least 8 characters'),
})

const signUpSchema = signInSchema.extend({
  fullName: z
    .string()
    .trim()
    .min(2, 'Enter your full name')
    .max(120, 'Name is too long'),
})

function mapAuthMessage(message) {
  if (!message) return 'Something went wrong.'
  if (message.includes('Invalid login')) return 'Invalid email or password.'
  return message
}

export function AuthPage() {
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)

  const configured = isSupabaseConfigured()

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setInfo('')
    const parsed =
      mode === 'signup'
        ? signUpSchema.safeParse({ email, password, fullName })
        : signInSchema.safeParse({ email, password })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid input')
      return
    }
    const supabase = getSupabase()
    if (!supabase) return
    setLoading(true)
    try {
      if (mode === 'signup') {
        const { data, error: err } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: EMAIL_REDIRECT_TO,
            data: {
              full_name: parsed.data.fullName,
            },
          },
        })
        if (err) throw err
        if (!data.session) {
          setInfo(
            'Check your email to confirm your account. You can sign in after confirmation.',
          )
        }
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        })
        if (err) throw err
      }
    } catch (err) {
      setError(mapAuthMessage(err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="!p-8 shadow-md">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        {mode === 'signin' ? 'Sign in' : 'Create account'}
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Email and password via Supabase Auth.
      </p>

      {!configured ? (
        <div className="mt-6">
          <Alert variant="error">
            Set <code className="font-mono">VITE_SUPABASE_URL</code> and{' '}
            <code className="font-mono">VITE_SUPABASE_ANON_KEY</code> in a{' '}
            <code className="font-mono">.env</code> file, then restart Vite.
          </Alert>
        </div>
      ) : null}

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        {mode === 'signup' ? (
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Full name
            </label>
            <input
              id="fullName"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="e.g. Marie Ngo Njip"
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-zinc-900 shadow-sm placeholder:text-zinc-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={!configured || loading}
            />
          </div>
        ) : null}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-zinc-900 shadow-sm placeholder:text-zinc-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!configured || loading}
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-zinc-900 shadow-sm placeholder:text-zinc-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={!configured || loading}
          />
        </div>
        {error ? (
          <Alert variant="error">
            {error}
          </Alert>
        ) : null}
        {info ? <Alert>{info}</Alert> : null}
        <Button type="submit" className="w-full" disabled={!configured || loading}>
          {loading ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Sign up'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
        {mode === 'signin' ? (
          <>
            No account?{' '}
            <button
              type="button"
              className="font-medium text-brand-700 hover:underline dark:text-brand-400"
              onClick={() => {
                setMode('signup')
                setError('')
                setInfo('')
              }}
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              type="button"
              className="font-medium text-brand-700 hover:underline dark:text-brand-400"
              onClick={() => {
                setMode('signin')
                setError('')
                setInfo('')
                setFullName('')
              }}
            >
              Sign in
            </button>
          </>
        )}
      </p>
    </Card>
  )
}
