import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Mail,
  Clock,
  Sparkles,
} from 'lucide-react';
import type { MockExam } from '@/types/tpo';

interface ShareMockExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: MockExam | null;
  collegeName?: string;
}

export default function ShareMockExamModal({
  isOpen,
  onClose,
  exam,
  collegeName,
}: ShareMockExamModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!isOpen || !exam) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://prepunite.com';
  const candidateUrl = `${origin}/exam/${exam.id}`;
  const resolvedCollege = collegeName || 'Campus Placement Cell';
  const targetDepts = exam.target_departments?.length ? exam.target_departments.join(', ') : 'All Branches';

  // 1. WhatsApp Broadcast Text
  const whatsappBroadcastText = `📢 *CAMPUS PLACEMENT ASSESSMENT: ${resolvedCollege}*
━━━━━━━━━━━━━━━━━━━━
🎯 *Assessment:* ${exam.title}
🏢 *Company Pattern:* ${exam.target_company}
⏱ *Duration:* ${exam.duration_minutes} Minutes | *Total Marks:* ${exam.total_marks}
📊 *Passing Cutoff:* ${exam.passing_percentage}%
🎓 *Eligible:* ${targetDepts}${exam.target_batch_year ? ` (Batch ${exam.target_batch_year})` : ''}

🔗 *Direct Candidate Assessment Link:*
${candidateUrl}

⚠️ *Important Proctoring Guidelines:*
1. Login with your registered college email.
2. Fullscreen mode required with tab-switch monitoring.
3. Finish and submit test before the deadline.
━━━━━━━━━━━━━━━━━━━━
_Powered by PrepUnite Placement Assessment Suite_`;

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappBroadcastText)}`;

  // 2. Official Circular Email Template
  const emailSubject = `[URGENT] Campus Placement Mock Drive: ${exam.title} (${exam.target_company} Pattern)`;
  const emailBodyText = `Dear Students,

As part of our upcoming campus placement readiness drive, the Placement Cell has scheduled an official proctored mock assessment for ${exam.target_company}.

Assessment Details:
• Title: ${exam.title}
• Company Pattern: ${exam.target_company}
• Duration: ${exam.duration_minutes} Minutes
• Total Marks: ${exam.total_marks}
• Passing Cutoff: ${exam.passing_percentage}%
• Target Departments: ${targetDepts}${exam.target_batch_year ? ` (Batch of ${exam.target_batch_year})` : ''}

Direct Test Link:
${candidateUrl}

Instructions:
1. Please log in to PrepUnite using your registered college email.
2. Ensure you have an uninterrupted internet connection and a working browser.
3. Test runs with fullscreen lock and automated malpractice detection. Switching windows or tabs will be logged.

All eligible candidates are strongly advised to complete this assessment to qualify for placement shortlists.

Regards,
${resolvedCollege}
Training & Placement Office`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(candidateUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(`Subject: ${emailSubject}\n\n${emailBodyText}`);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-[#151618] border border-gray-200 dark:border-[#25262a] rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-5 animate-scaleUp">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#202225] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#FD4A32]/10 text-[#FD4A32]">
              <Share2 className="w-5 h-5" />
            </span>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#FD4A32]">
              Candidate Access & Distribution
            </span>
          </div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white leading-tight">
            Share Mock Drive with Students
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Distribute this proctored placement drive directly to your batch via WhatsApp, Link, or Official Email.
          </p>
        </div>

        {/* Exam Preview Summary Card */}
        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#1a1b1e] border border-gray-200/80 dark:border-[#2e3035] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FD4A32]/10 text-[#FD4A32] border border-[#FD4A32]/20">
              {exam.target_company}
            </span>
            <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {exam.duration_minutes} Mins
            </span>
          </div>

          <h3 className="font-bold text-sm text-gray-900 dark:text-white leading-snug">
            {exam.title}
          </h3>

          <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400 pt-1 border-t border-gray-200/60 dark:border-[#2a2c30]">
            <span>Marks: <strong className="text-gray-900 dark:text-white">{exam.total_marks}</strong></span>
            <span>Cutoff: <strong className="text-emerald-600 dark:text-emerald-400">{exam.passing_percentage}%</strong></span>
            <span>Depts: <strong className="text-gray-900 dark:text-white">{targetDepts}</strong></span>
          </div>
        </div>

        {/* Channels */}
        <div className="space-y-3">
          
          {/* Channel 1: WhatsApp Broadcast */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#25D366]/20 flex items-center justify-center gap-2 group"
          >
            <MessageCircle className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
            <span>1-Click WhatsApp Broadcast to Batch Group</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>

          {/* Channel 2: Direct Candidate URL */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Candidate Direct Exam URL
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-[#1e1f23] border border-gray-200 dark:border-[#2e3035] text-xs font-mono text-gray-700 dark:text-gray-300 truncate select-all">
                {candidateUrl}
              </div>
              <button
                onClick={handleCopyLink}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 ${
                  copiedLink
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-900 hover:bg-black text-white dark:bg-white dark:text-black dark:hover:bg-gray-200'
                }`}
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Link
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Channel 3: Email Notice Template */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1a1b1e] border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                  Official Placement Circular Template
                </h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  Ready-to-send draft with exam instructions for college emails & ERP
                </p>
              </div>
            </div>

            <button
              onClick={handleCopyEmail}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all shrink-0 flex items-center gap-1 ${
                copiedEmail
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
              }`}
            >
              {copiedEmail ? (
                <>
                  <Check className="w-3 h-3" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copy Draft
                </>
              )}
            </button>
          </div>

        </div>

        {/* Student Notice Footnote */}
        <div className="p-3 bg-orange-50/70 dark:bg-[#FD4A32]/5 border border-orange-200/60 dark:border-[#FD4A32]/20 rounded-2xl flex items-start gap-2.5 text-[11px] text-gray-600 dark:text-gray-300">
          <Sparkles className="w-4 h-4 text-[#FD4A32] shrink-0 mt-0.5" />
          <span>
            <strong>Automatic Student Discovery:</strong> All students enrolled under <em>{resolvedCollege}</em> will automatically see this exam on their PrepUnite Student Dashboard!
          </span>
        </div>

      </div>
    </div>
  );
}
