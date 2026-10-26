import React from 'react';
import { Link } from 'react-router';
import {
  Crosshair,
  FileCode2,
  Coins,
  Network,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  Download,
} from 'lucide-react';
import AboutGridOverlay from '@/components/AboutGridOverlay';
import '@/hp-styles.css';

export default function AboutPage() {
  const stats = [
    { num: '1,200+', label: 'Verified OA Questions', sub: 'From actual student test drives' },
    { num: '50+', label: 'Recruitment Hubs', sub: 'TCS, Amazon, Accenture, Infosys & more' },
    { num: '94%', label: 'Pattern Match Rate', sub: 'Identical questions reported in real drives' },
    { num: '₹59', label: 'Single Paper Pass', sub: '30-day full access per recruiter archive' },
  ];

  const pillars = [
    {
      index: '01',
      tag: 'PRECISION',
      icon: <Crosshair className="w-5 h-5 text-[#FD4A32]" />,
      title: 'Drive-Specific Intelligence',
      desc: 'No generic aptitude questions. Every test pattern, section weightage, and past paper is verified by engineering candidates who sat the most recent campus drives.',
    },
    {
      index: '02',
      tag: '100% SOLVED',
      icon: <FileCode2 className="w-5 h-5 text-[#FD4A32]" />,
      title: 'Memory-Reconstructed Papers',
      desc: 'Real questions submitted immediately after online assessments, fully solved with step-by-step logic, code implementations, and complexity breakdowns.',
    },
    {
      index: '03',
      tag: 'TRANSPARENT',
      icon: <Coins className="w-5 h-5 text-[#FD4A32]" />,
      title: 'Fair ₹59 Pricing',
      desc: 'Placement preparation should not be a luxury. We offer ₹59 30-day archive unlocks per recruiter with zero recurring charges or hidden paywalls.',
    },
    {
      index: '04',
      tag: 'COMMUNITY',
      icon: <Network className="w-5 h-5 text-[#FD4A32]" />,
      title: 'Student-Driven Community',
      desc: 'Built by engineers for engineers. Placed students continuously contribute real interview experiences, round-by-round transcripts, and tips for freshers.',
    },
  ];

  return (
    <div className="relative min-h-screen py-10 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* 📐 Geometric Architectural Grid Overlay with Elliptical Radial Mask */}
      <AboutGridOverlay />

      <div className="relative z-10 max-w-5xl mx-auto space-y-16 animate-fadeIn">
        {/* ── HERO HEADER ── */}
        <div className="text-center space-y-4 max-w-3xl mx-auto pt-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FD4A32]/10 dark:bg-[#FD4A32]/15 border border-[#FD4A32]/30 text-[#FD4A32] text-xs font-display font-bold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Placement Intelligence Operating System</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl text-[var(--e-text)] tracking-tight leading-[1.1]">
            Practice the <span className="text-[#FD4A32]">Actual Papers</span>.<br />
            Not Random Questions.
          </h1>

          <p className="text-sm sm:text-base text-[var(--e-text-2)] leading-relaxed max-w-2xl mx-auto font-sans">
            MockFolder aggregates, verifies, and organizes authentic memory-reconstructed campus placement questions into structured company drive blueprints for engineering students.
          </p>
        </div>

        {/* ── IMPACT STATS STRIP ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-xl bg-white/70 dark:bg-[#141414]/70 backdrop-blur-md border border-[var(--e-border)] hover:border-[#FD4A32]/40 transition-all duration-300 shadow-sm text-center space-y-1"
            >
              <div className="font-display font-black text-2xl sm:text-3xl text-[var(--e-text)] tracking-tight">
                {s.num.startsWith('₹') ? <span className="text-[#FD4A32]">{s.num}</span> : s.num}
              </div>
              <div className="font-display font-bold text-xs text-[var(--e-text)]">
                {s.label}
              </div>
              <div className="text-[10.5px] text-[var(--e-text-3)] leading-tight">
                {s.sub}
              </div>
            </div>
          ))}
        </div>

        {/* ── CORE PILLARS ── */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-widest text-[#FD4A32]">
              Our Foundation
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--e-text)]">
              Built on 4 Core Principles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {pillars.map((p, i) => (
              <div
                key={i}
                className="group relative p-6 rounded-xl bg-white/80 dark:bg-[#141414]/80 backdrop-blur-md border border-[var(--e-border)] hover:border-[#FD4A32]/45 transition-all duration-300 shadow-sm space-y-3.5"
              >
                {/* Header with Icon & Technical Monospace Tag */}
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg border border-[#FD4A32]/25 bg-[#FD4A32]/10 text-[#FD4A32] flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                    {p.icon}
                  </div>

                  <div className="px-2.5 py-1 rounded-md font-mono text-[10.5px] font-bold tracking-wider border border-[#FD4A32]/25 bg-[#FD4A32]/8 text-[#FD4A32] uppercase flex items-center gap-1.5 shadow-sm">
                    <span className="opacity-60">{p.index} //</span>
                    <span>{p.tag}</span>
                  </div>
                </div>

                <h3 className="font-display font-bold text-lg text-[var(--e-text)] group-hover:text-[#FD4A32] transition-colors">
                  {p.title}
                </h3>

                <p className="text-xs sm:text-[13px] text-[var(--e-text-2)] leading-relaxed font-sans">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── PHILOSOPHY & WHY WE BUILT PREPUNITE ── */}
        <div className="p-6 sm:p-10 rounded-2xl bg-white/80 dark:bg-[#141414]/85 backdrop-blur-md border border-[var(--e-border)] hover:border-[#FD4A32]/30 transition-all duration-300 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--e-border)] pb-5">
            <div className="space-y-1">
              <div className="text-[10.5px] font-bold uppercase tracking-widest text-[#FD4A32]">
                Manifesto
              </div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--e-text)]">
                Why We Built MockFolder
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--e-text-3)] bg-[var(--e-surface-2)] px-3 py-1.5 rounded-md border border-[var(--e-border)]">
              <Zap size={13} className="text-[#FD4A32]" />
              <span>Drive Ready · 2026</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-[var(--e-text-2)] leading-relaxed font-sans">
            <p>
              Campus recruitment in India can feel chaotic and overwhelming. Students spend dozens of hours scouring random Telegram channels, unstructured WhatsApp groups, and outdated blogs trying to guess what actually appeared in TCS NQT, Accenture ASE, Infosys SP, or Amazon drives.
            </p>
            <p>
              MockFolder eliminates the guesswork. We deliver structured paper archives, memory-verified questions, step-by-step explanations, and real candidate interview experiences—organized strictly by company and drive year.
            </p>
          </div>

          <div className="pt-4 border-t border-[var(--e-border)] flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-semibold text-[var(--e-text-2)]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#FD4A32]" /> Memory-Verified
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#FD4A32]" /> 1-Year Full Access
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#FD4A32]" /> Instant OA Unlocks
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/companies"
                className="px-5 py-2.5 rounded-lg bg-[#FD4A32] hover:bg-[#E03E28] text-white font-display font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 shadow-sm"
              >
                <span>Browse Companies</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Brand Assets / Official Logo Download */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white/80 dark:bg-[#141414]/85 backdrop-blur-md border border-[var(--e-border)] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--e-border)] pb-4">
            <div>
              <div className="text-[10.5px] font-bold uppercase tracking-widest text-[#FD4A32]">
                Brand Assets
              </div>
              <h3 className="font-display font-extrabold text-xl text-[var(--e-text)]">
                MockFolder Official Logo &amp; Identity
              </h3>
            </div>
            <span className="text-[11px] font-mono text-[var(--e-text-3)] bg-[var(--e-surface-2)] px-2.5 py-1 rounded border border-[var(--e-border)]">
              Transparent · 930 × 930 px
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-[#F8F9FA] dark:bg-[#1C1C1C] border border-[var(--e-border)] flex items-center justify-center p-3 shrink-0 shadow-inner">
              <img
                src="/mockfolder-logo.png"
                alt="MockFolder Official Logo"
                className="w-full h-full object-contain drop-shadow"
              />
            </div>
            <div className="space-y-3 flex-1 text-center sm:text-left">
              <p className="text-xs sm:text-sm text-[var(--e-text-2)] leading-relaxed font-sans">
                Download the official high-resolution transparent MockFolder emblem for media, presentations, campus notices, or profile badges.
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1">
                <a
                  href="/mockfolder-logo.png"
                  download="mockfolder-logo.png"
                  className="px-4 py-2 rounded-lg bg-[#FD4A32] hover:bg-[#E03E28] text-white font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download High-Res PNG (930×930)</span>
                </a>
                <a
                  href="/mockfolder-logo.svg"
                  download="mockfolder-logo.svg"
                  className="px-4 py-2 rounded-lg bg-[var(--e-surface-2)] hover:bg-[var(--e-surface)] text-[var(--e-text)] border border-[var(--e-border)] font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Vector SVG</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
