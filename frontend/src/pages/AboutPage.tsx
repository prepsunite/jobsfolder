import { Link } from 'react-router';
import { Target, ShieldCheck, BookOpen, Layers, Users, Sparkles, ArrowRight, Award, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-12 py-6 animate-fadeIn">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#006c49]/10 text-[#006c49] dark:bg-[#6cf8bb]/10 dark:text-[#6cf8bb] text-xs font-extrabold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>About PrepUnite</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-[#1f1b17] dark:text-white tracking-tight">
          The Operating System for Placement Preparation.
        </h1>
        <p className="text-sm sm:text-base text-[#747878] dark:text-[#a6adbb] leading-relaxed">
          PrepUnite aggregates, organizes, verifies, and personalizes placement intelligence into one unified platform.
          If you have an interview next week, you should know exactly what to study and where to study it.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#006c49]/10 text-[#006c49] dark:bg-[#6cf8bb]/10 dark:text-[#6cf8bb] flex items-center justify-center font-bold">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg text-[#1f1b17] dark:text-white">Precision Intelligence</h3>
          <p className="text-xs text-[#747878] dark:text-[#a6adbb] leading-relaxed">
            Every test pattern, section weightage, and past paper is verified by students who recently cleared campus drives.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg text-[#1f1b17] dark:text-white">Zero Redundant Fluff</h3>
          <p className="text-xs text-[#747878] dark:text-[#a6adbb] leading-relaxed">
            No outdated 10-year-old syllabus. We update questions and technical tracks dynamically for current hiring drives.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg text-[#1f1b17] dark:text-white">Fair & Accessible</h3>
          <p className="text-xs text-[#747878] dark:text-[#a6adbb] leading-relaxed">
            Flexible 1-Year Single Paper access and All-Access Pro Passes built to serve every student fairly.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-[#006c49] to-[#004f35] text-white space-y-6 shadow-xl">
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl">Why We Built PrepUnite</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
          <p>
            Campus recruitment can be overwhelming. Students spend dozens of hours searching fragmented forums, WhatsApp groups, and unstructured blogs trying to figure out what actually appeared in TCS NQT, Accenture ASE, Infosys SP, or Wipro Elite drives.
          </p>
          <p>
            PrepUnite solves this by delivering structured Document Explorer tabs, step-by-step memory-based solutions, verified interview experiences, and practice questions categorized strictly by company exam patterns.
          </p>
        </div>

        <div className="pt-4 border-t border-emerald-500/40 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-xs font-bold">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#6cf8bb]" /> Verified PYQs</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#6cf8bb]" /> 1-Year Access</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#6cf8bb]" /> Instant Unlock</span>
          </div>

          <Link
            to="/companies"
            className="px-6 py-2.5 rounded-full bg-white text-[#006c49] hover:bg-emerald-50 font-extrabold text-xs tracking-wider uppercase shadow-md transition-all flex items-center gap-2"
          >
            <span>Explore Companies</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
