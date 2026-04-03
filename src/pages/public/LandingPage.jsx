import { Link } from 'react-router-dom'
import { Card } from '../../components/ui/Card.jsx'
import { LEGAL } from '../../lib/legal.js'
import heroCollaboration from '../../assets/image1.png'
import heroTax from '../../assets/image.png'
import heroPrecision from '../../assets/image2.png'

export function LandingPage() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-4 pb-8 pt-10 lg:pb-16 lg:pt-14">
        <div
          className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-brand-400/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-sky-400/15 blur-3xl"
          aria-hidden
        />

        <div className="relative grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="tc-animate-fade-up text-sm font-semibold tracking-wide text-brand-700 dark:text-brand-400">
              Cameroon tax clarity
            </p>
            <h1 className="tc-animate-fade-up tc-delay-1 mt-3 text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 lg:text-5xl lg:leading-[1.08]">
              Understand, calculate, and manage your taxes in Cameroon
            </h1>
            <p className="tc-animate-fade-up tc-delay-2 mt-5 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              See which taxes may apply to you, estimate monthly take-home (IRPP + CNPS), and export a
              shareable PDF report — with secure sign-in.
            </p>
            <div className="tc-animate-fade-up tc-delay-3 mt-8 flex flex-wrap gap-3">
              <Link
                to="/auth"
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:scale-[1.02] hover:shadow-xl hover:shadow-brand-600/30 active:scale-[0.98]"
              >
                Create account
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center rounded-2xl border border-zinc-200/80 bg-white/80 px-6 py-3 text-sm font-semibold text-zinc-800 shadow-sm backdrop-blur-sm transition hover:border-brand-200 hover:bg-white hover:shadow-md dark:border-zinc-600 dark:bg-zinc-800/80 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                View pricing
              </Link>
            </div>
          </div>

          <div className="tc-animate-scale-in tc-delay-2 relative lg:justify-self-end">
            <div className="tc-float-soft relative mx-auto max-w-lg">
              <div className="absolute -inset-1 rounded-[1.75rem] bg-gradient-to-br from-brand-400/40 via-sky-300/30 to-accent-400/30 opacity-80 blur-sm" />
              <img
                src={heroCollaboration}
                alt="Team reviewing financial charts and documents"
                className="relative z-10 w-full rounded-[1.5rem] object-cover shadow-2xl ring-1 ring-white/60"
                width={800}
                height={600}
                fetchPriority="high"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="border-y border-zinc-200/80 bg-gradient-to-b from-white to-zinc-50/80 py-14 backdrop-blur-sm dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-3">
          {[
            {
              title: 'Clarity',
              body: 'Personalized applicability view so you know what to research next — not a substitute for professional advice.',
            },
            {
              title: 'Estimation',
              body: 'Monthly take-home estimate using IRPP brackets and the 4.2% CNPS employee share.',
            },
            {
              title: 'Export & share',
              body: 'Generate a structured PDF: profile, taxes, estimation, checklist, and disclaimer.',
            },
          ].map((item, i) => (
            <div
              key={item.title}
              className="tc-animate-fade-up rounded-2xl border border-zinc-100 bg-white/90 p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-100 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/90 dark:hover:border-brand-900/50"
              style={{ animationDelay: `${0.1 + i * 0.08}s` }}
            >
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Visual story — TAX + precision imagery */}
      <section className="mx-auto max-w-6xl px-4 py-16 lg:py-24">
        <div className="text-center">
          <h2 className="tc-animate-fade-up text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Built for real tax work
          </h2>
          <p className="tc-animate-fade-up tc-delay-1 mx-auto mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400">
            From orientation to numbers — visuals that match the seriousness of planning your
            obligations in Cameroon.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-12 md:grid-rows-2">
          <div
            className="tc-animate-fade-up group relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-zinc-100 shadow-lg dark:border-zinc-700 dark:bg-zinc-800 md:col-span-7 md:row-span-2"
            style={{ animationDelay: '0.12s' }}
          >
            <img
              src={heroPrecision}
              alt="Professional reviewing figures with calculator and documents"
              className="h-full min-h-[280px] w-full object-cover transition duration-700 group-hover:scale-105 md:min-h-[420px]"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-900/70 via-zinc-900/20 to-transparent" />
            <p className="absolute bottom-5 left-5 right-5 text-left text-lg font-semibold text-white drop-shadow-md md:text-xl">
              Precision for your pay and deductions
            </p>
          </div>

          <div
            className="tc-animate-fade-up group relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-md dark:border-zinc-700 dark:bg-zinc-900 md:col-span-5"
            style={{ animationDelay: '0.2s' }}
          >
            <img
              src={heroTax}
              alt="Tax concept with calculator and letter blocks"
              className="h-48 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-56"
              loading="lazy"
            />
            <div className="p-5">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Cameroon-focused</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                IRPP, CNPS, TVA, and more — grouped so you see what applies, what might apply later,
                and what does not.
              </p>
            </div>
          </div>

          <div
            className="tc-animate-fade-up flex items-center rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-50 via-white to-sky-50 p-6 shadow-md dark:border-brand-900/40 dark:from-brand-950/40 dark:via-zinc-900 dark:to-zinc-900 md:col-span-5"
            style={{ animationDelay: '0.28s' }}
          >
            <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              <span className="font-semibold text-brand-800 dark:text-brand-300">Secure by design.</span> Sign in with
              Supabase Auth; your profile and saved estimates stay tied to your account with row-level
              security.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-zinc-50/90 py-16 dark:bg-zinc-950/80">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="tc-animate-fade-up text-center text-2xl font-semibold text-zinc-900 dark:text-zinc-50 lg:text-3xl">
            Everything in one flow
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              'Personalized tax applicability',
              'Take-home pay estimation (IRPP + CNPS)',
              'PDF report export/share',
              'Secure sign-in (Supabase)',
            ].map((title, i) => (
              <Card
                key={title}
                className="tc-animate-fade-up border-zinc-200/80 !bg-white/95 !shadow-md backdrop-blur-sm transition hover:-translate-y-1 hover:border-brand-200/60 hover:shadow-lg"
                style={{ animationDelay: `${0.08 * i}s` }}
              >
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{title}</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Responsive on mobile, tablet, and desktop — same clarity everywhere.
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-violet-800 py-20 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.07'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-4">
          <h2 className="tc-animate-fade-up text-center text-2xl font-semibold lg:text-3xl">
            How it works
          </h2>
          <ol className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-3">
            {[
              'Create your account',
              'Answer a few questions about your situation',
              'Open your dashboard and export your report',
            ].map((step, i) => (
              <li
                key={step}
                className="tc-animate-fade-up text-center"
                style={{ animationDelay: `${0.12 + i * 0.1}s` }}
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-xl font-bold text-white shadow-lg ring-1 ring-white/30 backdrop-blur-sm transition hover:scale-110">
                  {i + 1}
                </span>
                <p className="mt-4 text-sm font-medium leading-relaxed text-white/95">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Trust */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <Card className="tc-animate-fade-up border-brand-100 !bg-gradient-to-br from-white to-brand-50/40 !shadow-lg dark:border-brand-900/30 dark:!from-zinc-900 dark:!to-brand-950/20">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Trust & disclaimer</h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            TaxClarity is <strong>informational</strong>, not tax advice. Rules change and your facts
            matter — always verify with official sources and a qualified professional. We use Supabase
            for authentication; see our{' '}
            <Link to="/privacy" className="font-medium text-brand-700 underline decoration-brand-300 underline-offset-2 hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-300">
              Privacy
            </Link>{' '}
            and{' '}
            <Link to="/terms" className="font-medium text-brand-700 underline decoration-brand-300 underline-offset-2 hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-300">
              Terms
            </Link>
            .
          </p>
        </Card>
      </section>

      <footer className="border-t border-zinc-200 bg-white py-10 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4">
          <Link to="/pricing" className="transition hover:text-brand-700 dark:hover:text-brand-400">
            Pricing
          </Link>
          <span aria-hidden>·</span>
          <Link to="/privacy" className="transition hover:text-brand-700 dark:hover:text-brand-400">
            Privacy
          </Link>
          <span aria-hidden>·</span>
          <Link to="/terms" className="transition hover:text-brand-700 dark:hover:text-brand-400">
            Terms
          </Link>
          <span aria-hidden>·</span>
          <a href={`mailto:${LEGAL.supportEmail}`} className="transition hover:text-brand-700 dark:hover:text-brand-400">
            Contact
          </a>
        </div>
        <p className="mt-4">© {new Date().getFullYear()} {LEGAL.productName}</p>
      </footer>
    </div>
  )
}
