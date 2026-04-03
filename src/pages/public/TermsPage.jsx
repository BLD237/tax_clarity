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

export function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:py-16">
      <Card className="!p-8 lg:!p-10">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 lg:text-3xl">
          Terms of service
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          {LEGAL.productName} — operated by {LEGAL.legalEntityName} ({LEGAL.country})
        </p>
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
          <strong>Effective date:</strong> {LEGAL.lastUpdatedTerms}. By accessing or using the
          service, you agree to these terms. If you do not agree, do not use the service.
        </p>

        <div className="mt-10 space-y-10">
          <Section title="1. Definitions">
            <p>
              <strong>&quot;Service&quot;</strong> means the {LEGAL.productName} website, applications,
              and related features (including authentication, onboarding, tax applicability views,
              salary estimation tools, PDF export, and estimation history).
            </p>
            <p>
              <strong>&quot;We,&quot; &quot;us,&quot;</strong> and <strong>&quot;our&quot;</strong> refer to{' '}
              {LEGAL.legalEntityName}.
            </p>
            <p>
              <strong>&quot;You&quot;</strong> means the individual or entity using the Service under
              these terms.
            </p>
          </Section>

          <Section title="2. Eligibility and account registration">
            <p>
              You must be at least 16 years old and able to form a binding contract under applicable
              law. You provide accurate registration information and keep it up to date. You are
              responsible for all activity under your account and for safeguarding your credentials.
              Notify us immediately at{' '}
              <a
                href={`mailto:${LEGAL.supportEmail}`}
                className="font-medium text-brand-700 underline dark:text-brand-400"
              >
                {LEGAL.supportEmail}
              </a>{' '}
              if you suspect unauthorized access.
            </p>
          </Section>

          <Section title="3. Description of the Service">
            <p>
              The Service offers educational orientation on taxes that may be relevant in Cameroon,
              simplified calculators (including illustrative IRPP and CNPS employee-share estimates
              where applicable), and tools to organize information into reports. Features may change
              over time; we may add, modify, or discontinue functionality with reasonable notice
              where practicable.
            </p>
          </Section>

          <Section title="4. No tax, legal, or professional advice">
            <p>
              The Service is <strong>informational only</strong>. Nothing we provide constitutes
              tax, legal, accounting, or financial advice. Tax rules are complex, depend on your
              exact facts, and change. Official guidance from Cameroon tax and social authorities, and
              advice from qualified professionals, prevails over any content or output from the
              Service. You use estimates and classifications at your own risk.
            </p>
          </Section>

          <Section title="5. Fees and payment">
            <p>
              We may offer free and paid plans as described on our{' '}
              <Link
                to="/pricing"
                className="font-medium text-brand-700 underline dark:text-brand-400"
              >
                Pricing
              </Link>{' '}
              page. Paid fees are due as specified at checkout. Failure to pay may result in
              suspension or downgrade of paid features. Taxes on our fees, if any, are as shown
              before you confirm payment.
            </p>
          </Section>

          <Section title="6. Acceptable use">
            <p>You agree not to:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Violate applicable law or third-party rights.</li>
              <li>
                Attempt to gain unauthorized access to the Service, other accounts, or underlying
                systems; probe, scan, or test vulnerabilities without our written consent.
              </li>
              <li>
                Use the Service to distribute malware, spam, or deceptive content; or to harass,
                threaten, or harm others.
              </li>
              <li>
                Reverse engineer, decompile, or disassemble the Service except where mandatory law
                allows.
              </li>
              <li>
                Use automated means (scraping, bots) in a way that overloads the Service or bypasses
                rate limits, except via documented APIs we expressly permit.
              </li>
              <li>Misrepresent your identity or affiliation.</li>
            </ul>
            <p>
              We may suspend or terminate access for conduct that we reasonably believe breaches
              these terms or puts the Service or other users at risk.
            </p>
          </Section>

          <Section title="7. Your content and data">
            <p>
              You retain rights to information you submit. You grant us a non-exclusive, worldwide,
              royalty-free license to host, process, transmit, display, and create derivative
              outputs (such as PDFs) solely to provide and improve the Service, enforce these
              terms, and comply with law. You represent that you have the rights needed to grant this
              license for content you provide.
            </p>
          </Section>

          <Section title="8. Third-party services">
            <p>
              The Service relies on third-party infrastructure (for example authentication and
              database hosting). Their terms and privacy practices also apply to the extent you
              interact with them. We are not responsible for third-party services outside our
              reasonable control.
            </p>
          </Section>

          <Section title="9. Intellectual property">
            <p>
              We and our licensors own the Service, including software, branding, and documentation.
              Except for the limited rights expressly granted in these terms, no rights are transferred
              to you. You may not use our trademarks without prior written permission.
            </p>
          </Section>

          <Section title="10. Disclaimer of warranties">
            <p>
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE.&quot; TO THE MAXIMUM EXTENT
              PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, WHETHER EXPRESS, IMPLIED, OR STATUTORY,
              INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND
              NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED,
              ERROR-FREE, OR THAT OUTPUTS WILL BE ACCURATE OR COMPLETE FOR YOUR SITUATION.
            </p>
          </Section>

          <Section title="11. Limitation of liability">
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, NEITHER {LEGAL.legalEntityName} NOR
              ITS DIRECTORS, EMPLOYEES, OR SUPPLIERS WILL BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
              SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR FOR LOSS OF PROFITS, DATA, GOODWILL,
              OR BUSINESS OPPORTUNITY, ARISING FROM OR RELATED TO THE SERVICE OR THESE TERMS, EVEN
              IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </p>
            <p>
              OUR AGGREGATE LIABILITY FOR ALL CLAIMS ARISING OUT OF OR RELATED TO THE SERVICE OR
              THESE TERMS IN ANY TWELVE-MONTH PERIOD IS LIMITED TO THE GREATER OF (A) THE AMOUNTS YOU
              PAID US FOR THE SERVICE IN THAT PERIOD, OR (B) FIFTY THOUSAND (50,000) FCFA, EXCEPT
              WHERE LIABILITY CANNOT BE LIMITED BY LAW (SUCH AS DEATH OR PERSONAL INJURY CAUSED BY
              GROSS NEGLIGENCE OR WILLFUL MISCONDUCT, WHERE APPLICABLE).
            </p>
          </Section>

          <Section title="12. Indemnity">
            <p>
              You will defend, indemnify, and hold harmless {LEGAL.legalEntityName} and its
              affiliates, officers, and employees from third-party claims, damages, and costs
              (including reasonable attorneys&apos; fees) arising from your use of the Service in breach
              of these terms, your content, or your violation of law or third-party rights.
            </p>
          </Section>

          <Section title="13. Term and termination">
            <p>
              These terms apply from your first use of the Service until terminated. You may stop
              using the Service at any time. We may suspend or terminate access for breach,
              non-payment, risk to security, or extended inactivity where we provide notice when
              reasonable. Provisions that by nature should survive (including disclaimers, liability
              limits, indemnity, and governing law) survive termination.
            </p>
          </Section>

          <Section title="14. Governing law and disputes">
            <p>
              These terms are governed by the laws of the Republic of Cameroon, without regard to
              conflict-of-law rules. Courts located in {LEGAL.city}, {LEGAL.country}, have
              non-exclusive jurisdiction over disputes, subject to any mandatory consumer protections
              that apply to you.
            </p>
          </Section>

          <Section title="15. Changes">
            <p>
              We may modify these terms. We will post the updated version with a new effective date.
              Continued use after the effective date constitutes acceptance of the revised terms. If
              you do not agree, you must stop using the Service. Material changes may be communicated
              by email or in-product notice where appropriate.
            </p>
          </Section>

          <Section title="16. Miscellaneous">
            <p>
              These terms constitute the entire agreement between you and us regarding the Service
              and supersede prior oral or written understandings on the same subject. If any
              provision is held invalid, the remainder remains in effect. Our failure to enforce a
              provision is not a waiver. You may not assign these terms without our consent; we may
              assign them in connection with a merger or sale of assets.
            </p>
          </Section>

          <Section title="17. Contact">
            <p>
              Questions about these terms:{' '}
              <a
                href={`mailto:${LEGAL.supportEmail}`}
                className="font-medium text-brand-700 underline dark:text-brand-400"
              >
                {LEGAL.supportEmail}
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
          <Link to="/privacy" className="text-brand-700 underline dark:text-brand-400">
            Privacy policy
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
