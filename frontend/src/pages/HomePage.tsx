import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { ArrowRight, CheckCircle, Shield, Archive } from 'lucide-react';
import '../hp-styles.css';

/* ── Data ───────────────────────────────────────────────── */
const MARQUEE_COMPANIES = [
  { name: 'TCS', papers: '14 past papers' },
  { name: 'Accenture', papers: '12 past papers' },
  { name: 'Cognizant', papers: '10 past papers' },
  { name: 'Amazon', papers: '18 past papers' },
  { name: 'Infosys', papers: '9 past papers' },
  { name: 'Wipro', papers: '8 past papers' },
  { name: 'Capgemini', papers: '7 past papers' },
  { name: 'IBM', papers: '6 past papers' },
  { name: 'HCL', papers: '5 past papers' },
  { name: 'Hexaware', papers: '6 past papers' },
  { name: 'Mphasis', papers: '4 past papers' },
  { name: 'KPMG', papers: '5 past papers' },
];

const COMPANIES = [
  {
    abbr: 'TCS', name: 'Tata Consultancy Services',
    badge: 'NQT · 2021–2026',
    papers: '14 Previous Year Papers',
    years: '2021 · 2022 · 2023 · 2024 · 2025 · 2026',
    sections: 'Cognitive · Advanced Coding · Verbal',
    accent: '#00C47B',
  },
  {
    abbr: 'ACN', name: 'Accenture',
    badge: 'ASE & FSE · 2022–2026',
    papers: '12 Previous Year Papers',
    years: '2022 · 2023 · 2024 · 2025 · 2026',
    sections: 'Critical Thinking · Pseudocode · Coding',
    accent: '#A855F7',
  },
  {
    abbr: 'CTS', name: 'Cognizant',
    badge: 'GenC Elevate · 2022–2026',
    papers: '10 Previous Year Papers',
    years: '2022 · 2023 · 2024 · 2025 · 2026',
    sections: 'Quantitative · Automata Coding',
    accent: '#3B82F6',
  },
  {
    abbr: 'AMZN', name: 'Amazon',
    badge: 'SDE 1 Campus · 2020–2026',
    papers: '18 Previous Year Papers',
    years: '2020 · 2021 · 2022 · 2023 · 2024 · 2025 · 2026',
    sections: 'DSA · OS/DBMS · System Design',
    accent: '#F5A623',
  },
  {
    abbr: 'INF', name: 'Infosys',
    badge: 'SP & DSE · 2021–2026',
    papers: '9 Previous Year Papers',
    years: '2021 · 2022 · 2023 · 2024 · 2025 · 2026',
    sections: 'Verbal · Quant · Coding',
    accent: '#00C47B',
  },
  {
    abbr: 'WIP', name: 'Wipro',
    badge: 'NLTH · 2022–2026',
    papers: '8 Previous Year Papers',
    years: '2022 · 2023 · 2024 · 2025 · 2026',
    sections: 'English · Analytical · Coding',
    accent: '#EF4444',
  },
  {
    abbr: 'CAP', name: 'Capgemini',
    badge: 'GAME · 2022–2026',
    papers: '7 Previous Year Papers',
    years: '2022 · 2023 · 2024 · 2025 · 2026',
    sections: 'Behavioral · Coding · Essay',
    accent: '#3B82F6',
  },
  {
    abbr: 'IBM', name: 'IBM',
    badge: 'Freshers · 2023–2026',
    papers: '6 Previous Year Papers',
    years: '2023 · 2024 · 2025 · 2026',
    sections: 'Cognitive · Technical Aptitude',
    accent: '#6366F1',
  },
];

const FAQS = [
  {
    q: 'Are these actual OA papers from real campus drives?',
    a: 'Yes. Every paper in our archive is sourced from students who sat the actual drive and submitted their questions through PrepUnite\'s contributor program. Papers are memory-reconstructed, cross-verified by multiple contributors, and tagged by drive year and batch.',
  },
  {
    q: 'What exactly do I get when I pay ₹99?',
    a: 'You get 1-year access to all previous year OA papers for a single company — every available year\'s paper, all questions, and full solutions with explanations. It is a one-time payment, no subscription.',
  },
  {
    q: 'How many years of past papers are available per company?',
    a: 'It varies by company. TCS has papers going back to 2021, Amazon to 2020. Each company page shows the exact years available before you pay.',
  },
  {
    q: 'How accurate are memory-reconstructed papers?',
    a: 'Each paper is cross-verified by multiple contributors who sat the same drive. Where contributors agree, confidence is very high. Some questions may have minor wording variation, but the question type, difficulty, and topics are accurate.',
  },
  {
    q: 'Are papers updated after every placement season?',
    a: 'Yes. As new drives happen, contributors submit the latest papers and we add them to the archive within days. All papers are date-stamped so you always know which drive year you are looking at.',
  },
];

const DELIVER = [
  {
    num: '1,200+',
    numClass: 'g',
    title: 'Past OA Questions',
    body: 'Questions from actual campus drives — Quant, Verbal, Logical, DSA, DBMS — solved and explained by section.',
    href: '/questions',
    cta: 'Browse Questions',
  },
  {
    num: '50+',
    numClass: 'a',
    title: 'Company Archives',
    body: 'Previous year paper sets for 50+ recruiters. TCS, Accenture, Cognizant, Amazon, Infosys and more — years 2020 to 2026.',
    href: '/companies',
    cta: 'Browse Companies',
  },
  {
    num: '100+',
    numClass: '',
    title: 'Interview Reports',
    body: 'Round-by-round reports from placed students — what was asked, how many rounds, and what to prepare.',
    href: '/experiences',
    cta: 'Read Reports',
  },
  {
    num: '₹99',
    numClass: 'g',
    title: 'Per Company Archive',
    body: 'One-time payment. 1-year access to all past papers for that company. No subscription, no recurring charges.',
    href: '/pricing',
    cta: 'See Pricing',
  },
];

/* ── Counter hook ───────────────────────────────────────── */
function useCounter(end: number, started: boolean, duration = 1800) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start = Math.min(start + step, end);
      setVal(Math.floor(start));
      if (start >= end) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [started, end, duration]);
  return val;
}

/* ── Main ───────────────────────────────────────────────── */
export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setStatsVisible(true);
    }, { threshold: 0.3 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const c1 = useCounter(1200, statsVisible);
  const c2 = useCounter(50, statsVisible);
  const c3 = useCounter(100, statsVisible);

  const chips = [...MARQUEE_COMPANIES, ...MARQUEE_COMPANIES];

  const filters = ['ALL', 'IT / Service', 'Product'];
  const filterMap: Record<string, string[]> = {
    ALL: COMPANIES.map(c => c.abbr),
    'IT / Service': ['TCS', 'INF', 'WIP', 'CAP', 'IBM', 'CTS'],
    'Product': ['AMZN', 'ACN'],
  };
  const visible = COMPANIES.filter(c => filterMap[activeFilter].includes(c.abbr));

  return (
    <div className="hp-root">

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="hp-hero-wrapper">
        <div className="hp-hero">
          <div className="hp-hero-inner">

            {/* Left */}
            <div>
              <div className="hp-hero-tag">
                <span className="hp-hero-tag-dot" />
                Previous Year OA Papers — 2020 to 2026
              </div>
              <h1 className="hp-hero-h1">
                The Actual Papers.<br />
                From <em>Real Drives.</em>
              </h1>
              <p className="hp-hero-sub">
                We archive the exact OA questions asked in TCS, Accenture, Cognizant, Amazon
                and 15+ campus drives every year — sourced directly from students who sat the exam,
                cross-verified, and solved. Access any company's full paper archive for ₹99.
              </p>
              <div className="hp-hero-actions">
                <Link to="/companies" className="hp-btn-solid">
                  Browse Paper Archives <ArrowRight size={14} />
                </Link>
                <Link to="/questions" className="hp-btn-outline">
                  See Questions
                </Link>
              </div>
              <div className="hp-hero-stats" ref={statsRef}>
                <div className="hp-stat-block">
                  <span className="hp-stat-num accent">{c1.toLocaleString()}+</span>
                  <span className="hp-stat-label">Past OA Questions</span>
                </div>
                <div className="hp-stat-block">
                  <span className="hp-stat-num">{c2}+</span>
                  <span className="hp-stat-label">Company Archives</span>
                </div>
                <div className="hp-stat-block">
                  <span className="hp-stat-num">{c3}+</span>
                  <span className="hp-stat-label">Interview Reports</span>
                </div>
              </div>
            </div>

            {/* Right — sample paper preview cards */}
            <div className="hp-hero-visual">
              <div className="hp-mock-card">
                <div className="hp-mock-card-top">
                  <span className="hp-mock-card-tag">TCS NQT — Advanced Coding</span>
                  <span className="hp-mock-card-meta">2025 Drive</span>
                </div>
                <div className="hp-mock-card-title">
                  Given a string, find the longest palindromic substring...
                </div>
                <div className="hp-mock-card-sub">Memory-verified · 847 contributors · Full solution</div>
                <div className="hp-mock-card-footer">
                  <span className="hp-mock-price">Part of TCS Archive · ₹99</span>
                  <span className="hp-mock-badge">100% Solved</span>
                </div>
              </div>

              <div className="hp-mock-card">
                <div className="hp-mock-card-top">
                  <span className="hp-mock-card-tag">Accenture ASE — Pseudocode</span>
                  <span className="hp-mock-card-meta">2024 Drive</span>
                </div>
                <div className="hp-mock-card-title">
                  What is the output of the following pseudocode for input n=5?
                </div>
                <div className="hp-mock-card-sub">12 similar questions from this section · Solved</div>
                <div className="hp-mock-card-footer">
                  <span className="hp-mock-price">Part of ACN Archive · ₹99</span>
                  <span className="hp-mock-badge">1-Year Access</span>
                </div>
              </div>

              <div className="hp-mock-card">
                <div className="hp-mock-placed-row">
                  <div className="hp-mock-avatar">R</div>
                  <div>
                    <div className="hp-mock-name">Rahul K.</div>
                    <div className="hp-mock-role">Placed at TCS · Used PrepUnite papers</div>
                  </div>
                  <div className="hp-mock-pkg">Got offer</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── MARQUEE ───────────────────────────────────────── */}
      <div className="hp-marquee-wrap">
        <div className="hp-marquee-row">
          {chips.map((c, i) => (
            <div className="hp-marquee-chip" key={i}>
              <span className="hp-marquee-chip-name">{c.name}</span>
              <span className="hp-marquee-chip-dot" />
              <span className="hp-marquee-chip-ctc">{c.papers}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── WHAT WE DELIVER ───────────────────────────────── */}
      <hr className="hp-section-rule" />
      <div className="hp-section">
        <div className="hp-section-hdr">
          <div>
            <div className="hp-label">What's in the Archive</div>
            <h2 className="hp-section-title">Past Papers. Solved.</h2>
          </div>
          <p className="hp-section-desc">
            Every question in our archive came from a real drive. Students who sat
            the exam contributed the questions — we verify, solve, and organise them by
            company, year, and section.
          </p>
        </div>
        <div className="hp-deliver-grid">
          {DELIVER.map((d) => (
            <div className="hp-d-card" key={d.title}>
              <div className={`hp-d-num ${d.numClass}`}>{d.num}</div>
              <div className="hp-d-title">{d.title}</div>
              <div className="hp-d-body">{d.body}</div>
              <Link to={d.href} className="hp-d-link">
                {d.cta} <ArrowRight size={11} />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* ── PAPER ARCHIVES BY COMPANY ─────────────────────── */}
      <hr className="hp-section-rule" />
      <div className="hp-section">
        <div className="hp-section-hdr">
          <div>
            <div className="hp-label">Paper Archives</div>
            <h2 className="hp-section-title">Browse by Company</h2>
          </div>
          <div className="hp-filter-strip">
            {filters.map(f => (
              <button
                key={f}
                className={`hp-filter-btn${activeFilter === f ? ' active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="hp-co-grid">
          {visible.map((co) => (
            <Link
              key={co.abbr}
              to="/companies"
              className="hp-co-card"
              style={{ '--co-accent': co.accent } as React.CSSProperties}
            >
              <div className="hp-co-top">
                <span className="hp-co-abbr">{co.abbr}</span>
                <span className="hp-co-badge">{co.badge}</span>
              </div>
              <div className="hp-co-name">{co.name}</div>
              <div className="hp-co-pkg">{co.papers}</div>
              <div className="hp-co-pattern">{co.sections}</div>
              <div className="hp-co-footer">
                <span className="hp-co-papers">{co.years}</span>
                <span className="hp-co-cta">View Archive <ArrowRight size={11} /></span>
              </div>
            </Link>
          ))}
        </div>

        <div className="hp-see-all">
          <Link to="/companies" className="hp-see-all-link">
            See All 50+ Company Archives <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* ── SOCIAL PROOF BAND ─────────────────────────────── */}
      <div className="hp-proof-band">
        <div className="hp-proof-inner">
          <div>
            <div className="hp-proof-stat-num">94<span>%</span></div>
            <div className="hp-proof-stat-label">
              of students reported seeing the exact same questions
              from our archive in their actual placement OA
            </div>
          </div>
          <div className="hp-proof-quote">
            <p className="hp-proof-quote-text">
              "Practiced the TCS NQT papers on PrepUnite and 3 out of 4 coding
              questions in my actual test were identical. This is the only prep
              resource that actually matters."
            </p>
            <div className="hp-proof-quote-author">Arjun M. — Placed at TCS, NQT 2025</div>
          </div>
          <div>
            <div className="hp-label" style={{ marginBottom: '1rem' }}>Sections Covered</div>
            <div className="hp-proof-tags">
              {[
                'Advanced Coding', 'Pseudocode', 'Critical Thinking',
                'DSA', 'Quantitative', 'Verbal', 'Automata', 'DBMS',
              ].map(t => (
                <span key={t} className="hp-proof-tag">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── FAQ ───────────────────────────────────────────── */}
      <hr className="hp-section-rule" />
      <div className="hp-section">
        <div className="hp-section-hdr">
          <div>
            <div className="hp-label">Questions</div>
            <h2 className="hp-section-title">Frequently Asked</h2>
          </div>
        </div>
        <div className="hp-faq-list">
          {FAQS.map((f, i) => (
            <div key={i} className={`hp-faq-item${openFaq === i ? ' open' : ''}`}>
              <button className="hp-faq-btn" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span className="hp-faq-q">{f.q}</span>
                <span className="hp-faq-icon">{openFaq === i ? '−' : '+'}</span>
              </button>
              {openFaq === i && (
                <div className="hp-faq-answer">{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ───────────────────────────────────────────── */}
      <div className="hp-cta-section">
        <div className="hp-cta-eyebrow">Access the Archive</div>
        <h2 className="hp-cta-h2">
          Practice the Actual Papers.<br />Not Random Questions.
        </h2>
        <p className="hp-cta-sub">
          Every question in our archive came from a real campus placement drive.
          Pick your company, get all previous year papers, and walk into your OA prepared.
          Starts at ₹99.
        </p>
        <div className="hp-cta-btns">
          <Link to="/companies" className="hp-btn-solid">
            Browse Paper Archives <ArrowRight size={14} />
          </Link>
          <Link to="/pricing" className="hp-btn-outline">
            See Pricing
          </Link>
        </div>
        <div className="hp-cta-trust">
          <span className="hp-cta-trust-item">
            <Archive size={13} style={{ color: 'var(--e-green)' }} />
            Memory-Verified from Real Drives
          </span>
          <span className="hp-cta-trust-item">
            <CheckCircle size={13} style={{ color: 'var(--e-green)' }} />
            Fully Solved with Explanations
          </span>
          <span className="hp-cta-trust-item">
            <Shield size={13} style={{ color: 'var(--e-green)' }} />
            ₹99 One-Time · 1-Year Access
          </span>
        </div>
      </div>

    </div>
  );
}
