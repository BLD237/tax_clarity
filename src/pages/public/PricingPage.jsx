import { Link } from 'react-router-dom'
import { Card } from '../../components/ui/Card.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { LEGAL } from '../../lib/legal.js'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    priceLabel: '0 FCFA',
    period: 'per month',
    description:
      'Core tax clarity tools for individuals who want orientation, estimates, and exportable reports.',
    highlighted: false,
    cta: 'Create free account',
    ctaTo: '/auth',
    features: [
      'Secure account with email sign-in',
      'Onboarding profile (identity, income type, range)',
      'Personalized tax applicability view (dashboard)',
      'Monthly take-home estimate (IRPP + CNPS employee share)',
      'Interactive estimation checklist',
      'PDF report export (profile, taxes, estimate, checklist, disclaimer)',
      'Save and review estimation history in your account',
      'Access on mobile, tablet, and desktop web',
    ],
  },
  {
    id: 'plus',
    name: 'Plus',
    priceLabel: '2 500 FCFA',
    period: 'per month, billed monthly',
    description:
      'For users who want priority support, early access to new tools, and the same full feature set with commercial-grade assistance.',
    highlighted: true,
    cta: 'Subscribe to Plus',
    ctaTo: '/auth',
    features: [
      'Everything included in Free',
      'Priority email support on business days',
      'Early access to new calculators, report layouts, and product updates',
      'Invoicing available for approved business customers on request',
      'Same security standards and data handling as Free',
    ],
  },
]

const FAQ = [
  {
    q: 'Is TaxClarity a substitute for an accountant or tax adviser?',
    a: 'No. TaxClarity provides educational orientation and simplified estimates. Official rules, your exact facts, and professional judgment still matter. See our Terms for the full disclaimer.',
  },
  {
    q: 'Can I cancel Plus anytime?',
    a: 'Yes. Plus is billed monthly unless you choose an annual plan where offered. You can cancel renewal before the next billing date from your account billing settings, or by emailing support with your account email. After cancellation, you keep access to Plus until the end of the period you already paid for, then your account moves to Free.',
  },
  {
    q: 'Do you offer refunds?',
    a: 'If you are charged in error or within the first 7 days of a new Plus subscription and have not materially abused the service, contact support and we will review a refund in good faith.',
  },
  {
    q: 'What payment methods do you support?',
    a: 'We accept payment through licensed partners supporting cards and mobile money commonly used in Cameroon. The exact methods available to you are shown at checkout before you confirm. Corporate customers may request invoicing via our support channel.',
  },
  {
    q: 'Is VAT or other tax included in the listed price?',
    a: 'Prices are shown in FCFA. Applicable taxes depend on your status and our tax treatment at the time of sale; any tax line items will be shown before you confirm payment.',
  },
]

export function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 text-zinc-900 lg:py-16 dark:text-zinc-100">
      <header className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-medium text-brand-700 dark:text-brand-400">Pricing</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 lg:text-4xl">
          Simple plans for clarity on Cameroon taxes
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Start free with full core features. Upgrade to Plus when you want unlimited history and
          priority support.
        </p>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Last updated: {LEGAL.lastUpdatedPricing}. Prices and features may change; the version on
          this page is authoritative when you subscribe or renew.
        </p>
      </header>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        {PLANS.map((plan) => (
          <Card
            key={plan.id}
            className={`relative flex flex-col !p-8 ${
              plan.highlighted
                ? 'border-2 border-brand-500 shadow-md ring-1 ring-brand-500/20'
                : ''
            }`}
          >
            {plan.highlighted ? (
              <span className="absolute right-4 top-4 rounded-full bg-brand-600 px-3 py-0.5 text-xs font-semibold text-white">
                Recommended
              </span>
            ) : null}
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">{plan.name}</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{plan.description}</p>
            <p className="mt-6">
              <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                {plan.priceLabel}
              </span>
              <span className="ml-2 text-sm text-zinc-500 dark:text-zinc-400">{plan.period}</span>
            </p>
            <ul className="mt-6 flex-1 space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
              {plan.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="mt-0.5 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden>
                    ✓
                  </span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link to={plan.ctaTo}>
                <Button type="button" className="w-full" variant={plan.highlighted ? 'primary' : 'secondary'}>
                  {plan.cta}
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      <section className="mx-auto mt-20 max-w-3xl">
        <h2 className="text-center text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Frequently asked questions
        </h2>
        <ul className="mt-10 space-y-8">
          {FAQ.map((item) => (
            <li key={item.q}>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{item.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {item.a}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto mt-16 max-w-3xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/90">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Billing and invoices</h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          Subscriptions renew automatically at the end of each billing period unless you cancel
          before the renewal date. Each successful charge generates a confirmation sent to your
          account email. Corporate customers and NGOs may request invoices and alternative billing
          arrangements by writing to{' '}
          <a
            href={`mailto:${LEGAL.supportEmail}`}
            className="font-medium text-brand-700 underline dark:text-brand-400"
          >
            {LEGAL.supportEmail}
          </a>
          .
        </p>
      </section>

      <p className="mt-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
        <Link to="/" className="text-brand-700 underline dark:text-brand-400">
          Back to home
        </Link>
        {' · '}
        <Link to="/terms" className="text-brand-700 underline dark:text-brand-400">
          Terms of service
        </Link>
        {' · '}
        <Link to="/privacy" className="text-brand-700 underline dark:text-brand-400">
          Privacy policy
        </Link>
      </p>
    </div>
  )
}
