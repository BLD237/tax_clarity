import { Link } from 'react-router-dom'
import { Card } from '../../components/ui/Card.jsx'
import { LEGAL } from '../../lib/legal.js'

function Section({ title, children }) {
  return (
    <section className="border-t border-zinc-100 pt-8 first:border-t-0 first:pt-0 dark:border-zinc-800">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {children}
      </div>
    </section>
  )
}

export function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:py-16">
      <Card className="!p-8 lg:!p-10">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 lg:text-3xl">
          Privacy policy
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          {LEGAL.productName} — operated by {LEGAL.legalEntityName} ({LEGAL.country})
        </p>
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
          <strong>Effective date:</strong> {LEGAL.lastUpdatedPrivacy}. This policy describes how we
          collect, use, store, and share personal data when you use our website and services.
        </p>

        <div className="mt-10 space-y-10">
          <Section title="1. Who is responsible for your data?">
            <p>
              The data controller for {LEGAL.productName} is <strong>{LEGAL.legalEntityName}</strong>,
              based in {LEGAL.city}, {LEGAL.country}. For privacy-specific requests, email{' '}
              <a
                href={`mailto:${LEGAL.privacyEmail}`}
                className="font-medium text-brand-700 underline dark:text-brand-400"
              >
                {LEGAL.privacyEmail}
              </a>
              . For general support, email{' '}
              <a
                href={`mailto:${LEGAL.supportEmail}`}
                className="font-medium text-brand-700 underline dark:text-brand-400"
              >
                {LEGAL.supportEmail}
              </a>
              .
            </p>
          </Section>

          <Section title="2. What personal data we collect">
            <p>Depending on how you use the service, we may process:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Account data:</strong> email address, authentication identifiers, and session
                data created when you sign up or sign in, processed through our authentication
                provider (Supabase Auth).
              </li>
              <li>
                <strong>Profile and onboarding data:</strong> information you provide about your
                situation (identity category, income type, approximate income band, optional VAT
                registration flag), stored as metadata linked to your user profile in our database.
              </li>
              <li>
                <strong>Estimation inputs and outputs:</strong> values you enter for salary
                estimation and derived amounts (estimated IRPP, CNPS, net pay), including records you
                save to estimation history.
              </li>
              <li>
                <strong>Technical and usage data:</strong> browser type, device type, IP address,
                timestamps, and diagnostic information used to operate, secure, and improve the
                service.
              </li>
              <li>
                <strong>Communications:</strong> content of emails or messages you send to us,
                including support correspondence.
              </li>
            </ul>
            <p>
              We do not ask for special categories of personal data (such as health data). Please
              do not include such information in free-text fields or emails unless we explicitly
              request it for a defined purpose.
            </p>
          </Section>

          <Section title="3. Why we use your data (purposes)">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Provide the service:</strong> authenticate you, store your profile and saved
                estimates, render dashboards and PDFs, and deliver the features you use.
              </li>
              <li>
                <strong>Security and integrity:</strong> detect abuse, fraud, and unauthorized
                access; monitor errors; enforce technical and contractual limits.
              </li>
              <li>
                <strong>Product improvement:</strong> analyze aggregated or de-identified usage to
                fix bugs and prioritize features.
              </li>
              <li>
                <strong>Customer support:</strong> respond to your requests and troubleshoot
                problems.
              </li>
              <li>
                <strong>Legal compliance:</strong> comply with applicable law, respond to lawful
                requests from competent authorities, and establish, exercise, or defend legal claims.
              </li>
              <li>
                <strong>Billing:</strong> if you subscribe to a paid plan, process payments,
                invoices, applicable taxes on our fees, and manage renewals and cancellations.
              </li>
            </ul>
          </Section>

          <Section title="4. Legal bases (where applicable)">
            <p>
              Where Cameroon law or other applicable frameworks require a legal basis, we rely on:
              performance of a contract (providing the service you request); our legitimate
              interests in securing and improving the product, provided those interests are not
              overridden by your rights; consent where we ask for it explicitly (for example
              optional marketing communications, if offered); and legal obligation where the law
              requires us to retain or disclose information.
            </p>
          </Section>

          <Section title="5. How we share personal data">
            <p>
              We do not sell your personal data. We share data only as needed to run the service:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Infrastructure and authentication:</strong> Supabase (or successor
                providers) hosts authentication and application data on our instructions, under
                appropriate contractual safeguards.
              </li>
              <li>
                <strong>Payment processors:</strong> if you pay for a subscription, the payment
                provider receives the data required to complete the transaction (we do not store
                full card numbers on our servers when the processor tokenizes them).
              </li>
              <li>
                <strong>Professional advisers:</strong> lawyers, accountants, or auditors where
                confidentiality obligations apply.
              </li>
              <li>
                <strong>Authorities:</strong> when required by law or to protect rights, safety, and
                security.
              </li>
              <li>
                <strong>Business transfers:</strong> in connection with a merger, acquisition, or sale
                of assets, your data may transfer subject to this policy or equivalent protections
                communicated to you.
              </li>
            </ul>
          </Section>

          <Section title="6. International transfers">
            <p>
              Our service providers may process data in the European Union, the United States, or
              other regions where they operate. Where required, we use appropriate mechanisms (such
              as standard contractual clauses or equivalent measures offered by our providers) to
              govern cross-border processing. You may contact us for more detail on specific
              transfers relevant to your account.
            </p>
          </Section>

          <Section title="7. Retention">
            <p>
              We retain account and profile data while your account is active and for a reasonable
              period afterward to resolve disputes, enforce agreements, and comply with law. Saved
              estimates remain until you delete them or delete your account, unless a longer period
              is required for legal or security reasons. Technical logs are kept for a limited
              rolling period appropriate for security monitoring, then deleted or aggregated.
            </p>
          </Section>

          <Section title="8. Security">
            <p>
              We implement technical and organizational measures appropriate to the risk, including
              encryption in transit (HTTPS), access controls, and separation of environments. No
              method of transmission or storage is completely secure; you are responsible for
              keeping your password confidential and for activity under your account.
            </p>
          </Section>

          <Section title="9. Your rights">
            <p>
              Subject to applicable law, you may have the right to access, correct, delete, or export
              certain personal data; to object to or restrict certain processing; and to withdraw
              consent where processing was based on consent. To exercise these rights, email{' '}
              <a
                href={`mailto:${LEGAL.privacyEmail}`}
                className="font-medium text-brand-700 underline dark:text-brand-400"
              >
                {LEGAL.privacyEmail}
              </a>
              . We may need to verify your identity before fulfilling requests. You may also lodge a
              complaint with a competent supervisory authority if applicable law provides for one.
            </p>
          </Section>

          <Section title="10. Cookies and similar technologies">
            <p>
              We use cookies or local storage as needed for authentication sessions, security, and
              basic preferences. Strictly necessary cookies support login and CSRF protection.
              Unless we introduce optional analytics or marketing tools with separate consent, we do
              not use non-essential tracking cookies. If we add them, we will update this policy and,
              where required, request your consent before activation.
            </p>
          </Section>

          <Section title="11. Children">
            <p>
              The service is not directed at children under 16. We do not knowingly collect
              personal data from children. If you believe a child has provided us data, contact us
              and we will take steps to delete it.
            </p>
          </Section>

          <Section title="12. Changes to this policy">
            <p>
              We may update this policy to reflect changes in our practices or legal requirements.
              We will post the revised version with a new effective date. If changes are material,
              we will provide a more prominent notice (for example by email or in-product banner)
              where appropriate.
            </p>
          </Section>

          <Section title="13. Contact">
            <p>
              Questions about this privacy policy:{' '}
              <a
                href={`mailto:${LEGAL.privacyEmail}`}
                className="font-medium text-brand-700 underline dark:text-brand-400"
              >
                {LEGAL.privacyEmail}
              </a>
              .
            </p>
          </Section>
        </div>

        <p className="mt-10 border-t border-zinc-100 pt-8 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          <Link to="/" className="text-brand-700 underline dark:text-brand-400">
            Home
          </Link>
          {' · '}
          <Link to="/terms" className="text-brand-700 underline dark:text-brand-400">
            Terms of service
          </Link>
          {' · '}
          <Link to="/pricing" className="text-brand-700 underline dark:text-brand-400">
            Pricing
          </Link>
        </p>
      </Card>
    </div>
  )
}
