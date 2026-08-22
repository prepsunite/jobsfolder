import { ExternalLink, ShieldCheck, FileText, RefreshCw, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router';

interface PolicyPageProps {
  type: 'privacy' | 'terms' | 'refund';
}

const POLICY_DATA = {
  privacy: {
    title: 'Privacy Policy',
    subtitle: 'Learn how we collect, handle, and protect your personal information.',
    icon: ShieldCheck,
    docUrl: 'https://docs.google.com/document/d/1yqqWTE_jfC8F_u9UV9nLq3AUZR2wwpQGJigRJV3YQvg/pub',
  },
  terms: {
    title: 'Terms & Conditions',
    subtitle: 'Terms governing the use of our services, website, and paper content.',
    icon: FileText,
    docUrl: 'https://docs.google.com/document/d/1bCwt0WccF7oDMBGAGRxtPgUfzqGzkUjtLnnE1JlL2dg/pub',
  },
  refund: {
    title: 'Cancellation & Refund Policy',
    subtitle: 'Information regarding digital purchase cancellations, access delivery, and refunds.',
    icon: RefreshCw,
    docUrl: 'https://docs.google.com/document/d/1xYM1QHm9S5phnkzyENqJ3KXv37schlsiTp0Id_4IMwE/pub',
  },
};

export default function PolicyPage({ type }: PolicyPageProps) {
  const policy = POLICY_DATA[type];
  const Icon = policy.icon;

  return (
    <div className="max-w-5xl mx-auto space-y-5 py-4 animate-fadeIn">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-display font-bold text-[#868E96] dark:text-[#555555] hover:text-[#121417] dark:hover:text-white transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        <a
          href={policy.docUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#FD4A32]/10 text-[#FD4A32] dark:bg-[#FD4A32]/10 dark:text-[#FD4A32] hover:bg-[#FD4A32]/20 transition-colors text-xs font-display font-bold uppercase tracking-wider"
        >
          <span>Open Full Doc</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Hero */}
      <div className="p-5 rounded-lg bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] shadow-xs flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-md bg-[#FD4A32]/10 text-[#FD4A32] dark:bg-[#FD4A32]/10 dark:text-[#FD4A32] flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-display font-extrabold text-xl sm:text-2xl text-[#121417] dark:text-[#FFFFFF] tracking-tight">
            {policy.title}
          </h1>
          <p className="text-xs text-[#868E96] dark:text-[#555555] font-sans">
            {policy.subtitle}
          </p>
        </div>
      </div>

      {/* Document Viewer Frame */}
      <div className="w-full rounded-lg border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] overflow-hidden shadow-xs h-[75vh]">
        <iframe
          src={`${policy.docUrl}?embedded=true`}
          className="w-full h-full border-none"
          title={policy.title}
        />
      </div>
    </div>
  );
}
