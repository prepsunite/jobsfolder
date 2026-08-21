import { Link } from 'react-router';
import { Target, ShieldCheck, Sparkles, ArrowRight, Award, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-10 py-4 animate-fadeIn">
      {/* Hero Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#009D63]/10 text-[#009D63] dark:bg-[#00C47B]/10 dark:text-[#00C47B] text-[10px] font-display font-bold uppercase tracking-wider">
          <Sparkles className="w-3 h-3" />
          <span>About PrepUnite</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#121417] dark:text-[#FFFFFF] tracking-tight">
          The Operating System for Placement Intelligence.
        </h1>
        <p className="text-xs text-[#868E96] dark:text-[#555555] leading-relaxed font-sans">
          PrepUnite aggregates, organizes, verifies, and delivers previous year OA papers and placement intelligence into one unified platform.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-lg bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] space-y-2.5">
          <div className="w-8 h-8 rounded-md bg-[#009D63]/10 text-[#009D63] dark:bg-[#00C47B]/10 dark:text-[#00C47B] flex items-center justify-center font-bold">
            <Target className="w-4 h-4" />
          </div>
          <h3 className="font-display font-bold text-base text-[#121417] dark:text-[#FFFFFF]">Precision Intelligence</h3>
          <p className="text-xs text-[#868E96] dark:text-[#555555] leading-relaxed font-sans">
            Every test pattern, section weightage, and past paper is verified by students who sat recent campus drives.
          </p>
        </div>

        <div className="p-5 rounded-lg bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] space-y-2.5">
          <div className="w-8 h-8 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="font-display font-bold text-base text-[#121417] dark:text-[#FFFFFF]">Memory-Verified Papers</h3>
          <p className="text-xs text-[#868E96] dark:text-[#555555] leading-relaxed font-sans">
            No generic mock tests. We archive actual questions submitted by students right after their online assessment.
          </p>
        </div>

        <div className="p-5 rounded-lg bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] space-y-2.5">
          <div className="w-8 h-8 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Award className="w-4 h-4" />
          </div>
          <h3 className="font-display font-bold text-base text-[#121417] dark:text-[#FFFFFF]">₹99 Single Pass</h3>
          <p className="text-xs text-[#868E96] dark:text-[#555555] leading-relaxed font-sans">
            No recurring subscription traps. 1-Year access per single company archive or all-access passes.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="p-6 sm:p-8 rounded-lg bg-[#121417] dark:bg-[#141414] border border-[#121417] dark:border-[#242424] text-white space-y-5">
        <h2 className="font-display font-extrabold text-xl sm:text-2xl">Why We Built PrepUnite</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs text-[#999999] leading-relaxed font-sans">
          <p>
            Campus recruitment can be overwhelming. Students spend dozens of hours searching fragmented forums, Telegram channels, and unstructured blogs trying to figure out what actually appeared in TCS NQT, Accenture ASE, Infosys SP, or Amazon drives.
          </p>
          <p>
            PrepUnite solves this by providing structured paper sets, step-by-step memory-based solutions, verified interview experiences, and practice questions categorized strictly by company exam patterns.
          </p>
        </div>

        <div className="pt-4 border-t border-[#2E2E2E] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-5 text-xs font-semibold text-[#999999]">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#00C47B]" /> Verified PYQs</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#00C47B]" /> 1-Year Access</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#00C47B]" /> Instant Unlock</span>
          </div>

          <Link
            to="/companies"
            className="px-4 py-2 rounded-md bg-white text-black hover:bg-[#F1F3F5] font-display font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
          >
            <span>Explore Companies</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
