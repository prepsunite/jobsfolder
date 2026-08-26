/**
 * PolicyPage — Inline DPDP-Compliant Legal Pages
 *
 * Replaces the Google Docs iframe embed with fully inline content so the
 * policy is:
 *  • Always readable without third-party dependency
 *  • Searchable by the DPBI and courts as authentic published notice
 *  • DPDP Rule 3 compliant (specific data, purpose, rights, grievance contact)
 *
 * Covers: Privacy Policy · Terms & Conditions · Refund Policy
 */

import { ShieldCheck, FileText, RefreshCw, ChevronLeft, Mail } from 'lucide-react';
import { Link } from 'react-router';

interface PolicyPageProps {
  type: 'privacy' | 'terms' | 'refund';
}

// ─── Shared section component ─────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="font-display font-bold text-sm text-[#121417] dark:text-white border-b border-[#E9ECEF] dark:border-[#242424] pb-1.5">
        {title}
      </h2>
      <div className="text-xs text-[#495057] dark:text-[#999999] font-sans leading-relaxed space-y-2">
        {children}
      </div>
    </section>
  );
}

function Info({ children }: { children: React.ReactNode }) {
  return (
    <p className="p-3 rounded-md bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] text-[11px] text-[#868E96] dark:text-[#555555]">
      {children}
    </p>
  );
}

// ─── Privacy Policy Content ───────────────────────────────────────────────────
function PrivacyPolicyContent() {
  return (
    <div className="space-y-6">
      <Info>
        Effective Date: 1 August 2024 · Last Updated: 25 August 2026 · Policy Version: 2.0
        <br />
        This Privacy Policy is published in compliance with the <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong> and the DPDP Rules, 2025 of India.
      </Info>

      <Section title="1. Who We Are (Data Fiduciary)">
        <p>
          <strong className="text-[#121417] dark:text-white">Jobsfolder / PrepUnite</strong> ("we", "us", "our") is a placement intelligence platform operated
          in India. We are the <strong>Data Fiduciary</strong> under the DPDP Act, 2023, meaning we determine
          the purpose and means of processing your personal data.
        </p>
        <p>Contact: <a href="mailto:prepsunite@gmail.com" className="text-[#FD4A32] underline">prepsunite@gmail.com</a></p>
      </Section>

      <Section title="2. Personal Data We Collect (DPDP Rule 3 Disclosure)">
        <p>We collect only the data strictly necessary for the purposes stated below:</p>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px] border-collapse">
            <thead>
              <tr className="bg-[#F8F9FA] dark:bg-[#0C0C0C]">
                <th className="text-left p-2 border border-[#E9ECEF] dark:border-[#242424] font-bold text-[#121417] dark:text-white">Data Field</th>
                <th className="text-left p-2 border border-[#E9ECEF] dark:border-[#242424] font-bold text-[#121417] dark:text-white">Source</th>
                <th className="text-left p-2 border border-[#E9ECEF] dark:border-[#242424] font-bold text-[#121417] dark:text-white">Purpose</th>
                <th className="text-left p-2 border border-[#E9ECEF] dark:border-[#242424] font-bold text-[#121417] dark:text-white">Retention</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Full Name', 'Google OAuth', 'Identify & personalise your workspace', 'Until account deletion'],
                ['Email Address', 'Google OAuth', 'Account authentication & communication', 'Until account deletion'],
                ['Profile Picture URL', 'Google OAuth', 'Display avatar in workspace', 'Until account deletion'],
                ['Payment Order ID & Status', 'Razorpay', 'Verify Pro Pass activation', '7 years (legal mandate)'],
                ['Bookmarks & Progress', 'User action', 'Persist study activity', 'Until account deletion'],
                ['Submitted Experiences', 'User action', 'Community knowledge base', 'Until user deletion request'],
              ].map(([field, source, purpose, retention]) => (
                <tr key={field} className="border-b border-[#E9ECEF] dark:border-[#242424]">
                  <td className="p-2 border border-[#E9ECEF] dark:border-[#242424] font-semibold text-[#121417] dark:text-[#e3e3e3]">{field}</td>
                  <td className="p-2 border border-[#E9ECEF] dark:border-[#242424]">{source}</td>
                  <td className="p-2 border border-[#E9ECEF] dark:border-[#242424]">{purpose}</td>
                  <td className="p-2 border border-[#E9ECEF] dark:border-[#242424]">{retention}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[#868E96] dark:text-[#555555]">We do <strong>not</strong> collect Aadhaar, PAN, financial account numbers, biometric data, health data, or any special category personal data.</p>
      </Section>

      <Section title="3. Legal Basis for Processing">
        <p>We process your personal data on the basis of your <strong>explicit, informed consent</strong> obtained at the time of sign-up (DPDP Act, 2023, Section 6). You may withdraw this consent at any time — see Section 7.</p>
        <p>Payment transaction records are retained under a <strong>legitimate legal obligation</strong> (Indian tax and financial regulations) independent of your consent.</p>
      </Section>

      <Section title="4. How We Use Your Data">
        <ul className="list-disc ml-4 space-y-1">
          <li>Authenticate your account via Google OAuth 2.0</li>
          <li>Display your name and avatar in the workspace</li>
          <li>Activate and verify your Pro Pass subscription</li>
          <li>Sync and persist your bookmarks, notes, and progress</li>
          <li>Send transactional emails (payment receipts, account alerts)</li>
          <li>Respond to your support and grievance requests</li>
        </ul>
        <p>We do <strong>not</strong> use your data for advertising, profiling, or any automated decision-making that produces legal effects on you.</p>
      </Section>

      <Section title="5. Data Sharing & Third Parties (Data Processors)">
        <p>We share data <strong>only</strong> with the following processors, under contractual obligations that restrict them from using your data for their own purposes:</p>
        <ul className="list-disc ml-4 space-y-1">
          <li><strong>Supabase Inc.</strong> — Database, authentication, and file storage (servers in Singapore region)</li>
          <li><strong>Razorpay Software Pvt. Ltd.</strong> — Payment processing (India)</li>
          <li><strong>Vercel Inc.</strong> — Frontend hosting and CDN</li>
        </ul>
        <p>We do <strong>not</strong> sell, rent, or share your personal data with any advertisers, data brokers, or marketing platforms.</p>
      </Section>

      <Section title="6. Cross-Border Data Transfers">
        <p>
          Your authentication and profile data is stored on Supabase servers. Supabase's primary data region for our account is <strong>ap-southeast-1 (Singapore)</strong>.
          This transfer is permitted under the DPDP Act, 2023 (Section 16) as Singapore is not on India's restricted country list.
          Payment data processed by Razorpay is stored within India.
        </p>
      </Section>

      <Section title="7. Your Rights as a Data Principal (DPDP Act, Sections 11–14)">
        <p>You have the following rights, which you can exercise at any time:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            ['Right to Access', 'Request a summary of all personal data we hold about you.'],
            ['Right to Correction', 'Request correction of inaccurate or incomplete data.'],
            ['Right to Erasure', 'Request deletion of your account and all associated data.'],
            ['Right to Withdraw Consent', 'Withdraw your consent to data processing at any time.'],
            ['Right to Grievance Redressal', 'File a complaint with our Grievance Officer.'],
            ['Right to Nominate', 'Nominate a person to exercise your rights in case of death/incapacity.'],
          ].map(([right, desc]) => (
            <div key={right} className="p-2.5 rounded-md bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424]">
              <p className="font-bold text-[#121417] dark:text-white text-[11px]">{right}</p>
              <p className="text-[10px] text-[#868E96] dark:text-[#555555] mt-0.5">{desc}</p>
            </div>
          ))}
        </div>
        <p>
          To exercise any of these rights, visit your{' '}
          <Link to="/profile" className="text-[#FD4A32] underline">Profile → Data &amp; Privacy</Link>{' '}
          page or email our Grievance Officer at{' '}
          <a href="mailto:prepsunite@gmail.com" className="text-[#FD4A32] underline">prepsunite@gmail.com</a>.
          We will respond within <strong>7 working days</strong>.
        </p>
      </Section>

      <Section title="8. Security Safeguards (DPDP Rule 6)">
        <p>We implement the following technical and organisational measures to protect your data:</p>
        <ul className="list-disc ml-4 space-y-1">
          <li>All data in transit protected by TLS 1.3 encryption</li>
          <li>Database access restricted by row-level security (RLS) policies via Supabase</li>
          <li>Authentication handled exclusively via Google OAuth 2.0 — we never store passwords</li>
          <li>Internal access controlled by role-based permissions; employees access data on a need-to-know basis</li>
          <li>Payment data handled by Razorpay — we only store order IDs and status, never card details</li>
        </ul>
      </Section>

      <Section title="9. Children's Data">
        <p>
          Our platform is intended for college students and graduates preparing for campus placements.
          We do not knowingly collect data from individuals under 18 years of age.
          If you are a minor, please obtain parental or guardian consent before using this platform.
          If we discover we have inadvertently collected data from a minor without verifiable parental consent,
          we will delete it promptly. Contact: <a href="mailto:prepsunite@gmail.com" className="text-[#FD4A32] underline">prepsunite@gmail.com</a>.
        </p>
      </Section>

      <Section title="10. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. When we make material changes, we will
          update the "Last Updated" date at the top and, where required, seek fresh consent from users.
          The current policy version is displayed at the top of this page.
        </p>
      </Section>

      <Section title="11. Grievance Officer (DPDP Act, Section 13)">
        <div className="p-4 rounded-md bg-[#FD4A32]/5 border border-[#FD4A32]/20 space-y-2">
          <p className="font-bold text-[#121417] dark:text-white text-[11px] flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-[#FD4A32]" />
            Grievance Redressal Officer
          </p>
          <div className="text-[11px] space-y-0.5">
            <p><strong>Officer Name:</strong> Mukala Venkat</p>
            <p><strong>Designation:</strong> Founder &amp; Data Protection Officer</p>
            <p><strong>Organisation:</strong> PrepUnite / Jobsfolder</p>
            <p><strong>Email:</strong> <a href="mailto:prepsunite@gmail.com" className="text-[#FD4A32] underline">prepsunite@gmail.com</a></p>
            <p><strong>Response SLA:</strong> Within 7 working days of receipt</p>
          </div>
          <p className="text-[10px] text-[#868E96] dark:text-[#555555]">
            If your grievance is not resolved within 30 days, you may escalate to the{' '}
            <strong>Data Protection Board of India (DPBI)</strong> at the official government portal.
          </p>
        </div>
      </Section>
    </div>
  );
}

// ─── Terms & Conditions Content ───────────────────────────────────────────────
function TermsContent() {
  return (
    <div className="space-y-6">
      <Info>
        Effective Date: 1 August 2024 · Last Updated: 25 August 2026
        <br />
        These Terms &amp; Conditions incorporate obligations under the <strong>DPDP Act, 2023</strong>,
        the Information Technology Act, 2000, and the Consumer Protection Act, 2019.
        Governing Law: Republic of India.
      </Info>

      <Section title="1. Acceptance of Terms">
        <p>
          By creating an account or using any part of the Jobsfolder / PrepUnite platform ("Platform"),
          you ("User", "Data Principal") agree to be bound by these Terms and our{' '}
          <Link to="/privacy-policy" className="text-[#FD4A32] underline">Privacy Policy</Link>.
          If you do not agree, you must not use the Platform.
        </p>
      </Section>

      <Section title="2. Platform Description & Eligibility">
        <p>
          Jobsfolder is a placement preparation platform providing access to previous year Online Assessment (OA)
          papers, interview experiences, and aptitude resources. The Platform is intended for users aged 18 and above.
          By using this Platform, you represent that you are at least 18 years old or have obtained verifiable
          parental/guardian consent.
        </p>
      </Section>

      <Section title="3. Account & Authentication">
        <ul className="list-disc ml-4 space-y-1">
          <li>You authenticate using Google OAuth 2.0. You are responsible for all activity under your account.</li>
          <li>You must provide accurate information during sign-up and keep it up to date.</li>
          <li>You must not impersonate any person, create fake accounts, or use another person's credentials.</li>
          <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
        </ul>
      </Section>

      <Section title="4. Subscription & Pro Pass">
        <ul className="list-disc ml-4 space-y-1">
          <li>Free accounts have access to limited content. Pro Pass unlocks full access to company archives.</li>
          <li>All payments are processed securely by <strong>Razorpay</strong>. We do not store card details.</li>
          <li>Pro Pass is a digital product. Access is granted immediately upon successful payment verification.</li>
          <li>Refund terms are governed by our <Link to="/refund-policy" className="text-[#FD4A32] underline">Refund Policy</Link>.</li>
        </ul>
      </Section>

      <Section title="5. Intellectual Property">
        <p>
          All platform content — including question papers, UI design, aptitude content, and experience writeups
          contributed by the Jobsfolder team — is the intellectual property of PrepUnite. Unauthorised reproduction,
          redistribution, or commercial use is strictly prohibited.
        </p>
        <p>
          Content submitted by users (interview experiences) remains your intellectual property. By submitting,
          you grant PrepUnite a non-exclusive licence to display it on the platform.
        </p>
      </Section>

      <Section title="6. Prohibited Conduct">
        <p>You agree not to:</p>
        <ul className="list-disc ml-4 space-y-1">
          <li>Scrape, crawl, or mass-download platform content using bots or automated tools</li>
          <li>Share your Pro Pass credentials with others</li>
          <li>Upload false, misleading, or malicious content</li>
          <li>Attempt to bypass payment verification or access controls</li>
          <li>Violate any applicable Indian law, including the IT Act, 2000 and DPDP Act, 2023</li>
        </ul>
      </Section>

      <Section title="7. Data Protection & Privacy (DPDP Act, 2023)">
        <p>
          We process your personal data in accordance with the{' '}
          <Link to="/privacy-policy" className="text-[#FD4A32] underline">Privacy Policy</Link> and the
          Digital Personal Data Protection Act, 2023. Your rights as a Data Principal (access, correction,
          erasure, withdrawal of consent, grievance redressal) are fully respected.
        </p>
        <p>
          As a user, you also have duties under the DPDP Act (Section 15): you must not submit false information,
          impersonate others, or file frivolous grievances. Violations may result in penalties up to ₹10,000
          as prescribed by the Act.
        </p>
      </Section>

      <Section title="8. Disclaimer of Warranties">
        <p>
          The Platform is provided "as is" and "as available". We do not guarantee uninterrupted access or that
          all content is error-free. OA papers are sourced from community submissions and are provided in good faith —
          we do not guarantee their authenticity or completeness.
        </p>
      </Section>

      <Section title="9. Limitation of Liability">
        <p>
          To the maximum extent permitted by Indian law, PrepUnite's liability for any claim arising out of
          these Terms or use of the Platform shall not exceed the amount paid by you in the 12 months preceding the claim.
        </p>
      </Section>

      <Section title="10. Governing Law & Dispute Resolution">
        <p>
          These Terms are governed by the laws of the <strong>Republic of India</strong>. Any disputes shall
          be subject to the exclusive jurisdiction of the courts located in India. We encourage you to first
          contact our Grievance Officer at{' '}
          <a href="mailto:prepsunite@gmail.com" className="text-[#FD4A32] underline">prepsunite@gmail.com</a>{' '}
          to resolve disputes amicably before initiating legal proceedings.
        </p>
      </Section>

      <Section title="11. Changes to Terms">
        <p>
          We may update these Terms. Continued use of the Platform after changes are posted constitutes
          acceptance of the revised Terms. Material changes will be communicated via email or an in-app notice.
        </p>
      </Section>
    </div>
  );
}

// ─── Refund Policy Content ────────────────────────────────────────────────────
function RefundContent() {
  return (
    <div className="space-y-6">
      <Info>
        Effective Date: 1 August 2024 · Last Updated: 25 August 2026
        <br />
        This policy is in compliance with the <strong>Consumer Protection Act, 2019</strong> and guidelines
        issued by the Ministry of Consumer Affairs, India.
      </Info>

      <Section title="1. Nature of Product">
        <p>
          Jobsfolder Pro Pass is a <strong>digital subscription product</strong>. Upon successful payment,
          access to Pro content is granted immediately and automatically. Because the digital product is
          accessible the moment payment is confirmed, the following refund terms apply.
        </p>
      </Section>

      <Section title="2. Refund Eligibility">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="p-3 rounded-md bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30">
            <p className="font-bold text-emerald-700 dark:text-emerald-400 text-[11px] mb-1">✔ Eligible for Refund</p>
            <ul className="text-[10px] text-[#495057] dark:text-[#999999] space-y-0.5 list-disc ml-3">
              <li>Payment deducted but Pro access not activated within 24 hours</li>
              <li>Duplicate/double charge for the same plan period</li>
              <li>Technical error resulting in failed order on our end</li>
            </ul>
          </div>
          <div className="p-3 rounded-md bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-800/30">
            <p className="font-bold text-rose-700 dark:text-rose-400 text-[11px] mb-1">✘ Not Eligible for Refund</p>
            <ul className="text-[10px] text-[#495057] dark:text-[#999999] space-y-0.5 list-disc ml-3">
              <li>Change of mind after Pro access has been granted</li>
              <li>Partial use of the subscription period</li>
              <li>Failure to use the platform during the subscription period</li>
              <li>Account banned for violation of Terms of Service</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section title="3. Refund Process">
        <ol className="list-decimal ml-4 space-y-1">
          <li>Email <a href="mailto:prepsunite@gmail.com" className="text-[#FD4A32] underline">prepsunite@gmail.com</a> with subject: <strong>Refund Request — [Your Razorpay Payment ID]</strong></li>
          <li>Include your registered email address and a brief description of the issue.</li>
          <li>We will review and respond within <strong>5 working days</strong>.</li>
          <li>Approved refunds are processed via the original payment method within <strong>7–10 business days</strong> (as per Razorpay's standard timeline).</li>
        </ol>
      </Section>

      <Section title="4. Cancellation">
        <p>
          Jobsfolder Pro Pass is a one-time purchase for a fixed period (not a recurring subscription),
          so there is no auto-renewal to cancel. Your access expires at the end of the plan period.
        </p>
      </Section>

      <Section title="5. Contact for Disputes">
        <p>
          For unresolved payment disputes, you may also contact:{' '}
          <a href="mailto:prepsunite@gmail.com" className="text-[#FD4A32] underline">prepsunite@gmail.com</a>{' '}
          (Grievance Officer) or initiate a dispute via Razorpay's customer portal.
        </p>
      </Section>
    </div>
  );
}

// ─── Main PolicyPage Component ────────────────────────────────────────────────
const POLICY_META = {
  privacy: {
    title: 'Privacy Policy',
    subtitle: 'How we collect, use, protect, and respect your personal data — DPDP Act, 2023 compliant.',
    icon: ShieldCheck,
    badge: 'DPDP Act Compliant',
  },
  terms: {
    title: 'Terms & Conditions',
    subtitle: 'Rules governing the use of Jobsfolder services, platform content, and subscriptions.',
    icon: FileText,
    badge: 'IT Act 2000 · Consumer Protection Act 2019',
  },
  refund: {
    title: 'Cancellation & Refund Policy',
    subtitle: 'Eligibility, process, and timelines for digital purchase refunds.',
    icon: RefreshCw,
    badge: 'Consumer Protection Act 2019',
  },
};

export default function PolicyPage({ type }: PolicyPageProps) {
  const meta = POLICY_META[type];
  const Icon = meta.icon;

  return (
    <div className="max-w-4xl mx-auto space-y-5 py-4 animate-fadeIn">

      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-display font-bold text-[#868E96] dark:text-[#555555] hover:text-[#121417] dark:hover:text-white transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-[#FD4A32]/10 text-[#FD4A32] text-[9px] font-display font-bold uppercase tracking-wider">
          {meta.badge}
        </span>
      </div>

      {/* Hero */}
      <div className="p-5 rounded-lg bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] shadow-xs flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-md bg-[#FD4A32]/10 text-[#FD4A32] flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-display font-extrabold text-xl sm:text-2xl text-[#121417] dark:text-white tracking-tight">
            {meta.title}
          </h1>
          <p className="text-xs text-[#868E96] dark:text-[#555555] font-sans mt-0.5">{meta.subtitle}</p>
        </div>
      </div>

      {/* Policy Content */}
      <div className="p-5 sm:p-7 rounded-lg border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] shadow-xs">
        {type === 'privacy' && <PrivacyPolicyContent />}
        {type === 'terms' && <TermsContent />}
        {type === 'refund' && <RefundContent />}
      </div>

      {/* Footer CTA */}
      <div className="p-4 rounded-lg bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-[#FD4A32]" />
          <div>
            <p className="text-[11px] font-display font-bold text-[#121417] dark:text-white">Grievance Officer</p>
            <p className="text-[10px] text-[#868E96] dark:text-[#555555]">For data rights & complaints — response within 7 working days</p>
          </div>
        </div>
        <a
          href="mailto:prepsunite@gmail.com"
          className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#FD4A32] text-white text-[11px] font-display font-bold uppercase tracking-wider hover:bg-[#e03e28] transition-colors"
        >
          prepsunite@gmail.com
        </a>
      </div>

    </div>
  );
}
