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
    <div className="max-w-5xl mx-auto space-y-6 py-4 animate-fadeIn">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#747878] dark:text-[#a6adbb] hover:text-[#1f1b17] dark:hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <a
          href={policy.docUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#006c49]/10 text-[#006c49] dark:bg-[#6cf8bb]/10 dark:text-[#6cf8bb] hover:bg-[#006c49]/20 transition-all text-xs font-bold"
        >
          <span>Open Full Document</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Hero */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#006c49]/10 text-[#006c49] dark:bg-[#6cf8bb]/10 dark:text-[#6cf8bb] flex items-center justify-center shrink-0">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-display font-black text-2xl text-[#1f1b17] dark:text-white tracking-tight">
            {policy.title}
          </h1>
          <p className="text-xs text-[#747878] dark:text-[#a6adbb]">
            {policy.subtitle}
          </p>
        </div>
      </div>

      {/* Document Viewer Frame */}
      <div className="w-full rounded-2xl border border-[#eae1da] dark:border-[#2b2d31] bg-white dark:bg-[#1e1f22] overflow-hidden shadow-sm h-[75vh]">
        <iframe
          src={`${policy.docUrl}?embedded=true`}
          className="w-full h-full border-none"
          title={policy.title}
        />
      </div>
    </div>
  );
}
