import { Link } from 'react-router';
import { Building2, BookOpen, Layers, Sparkles, ArrowRight, User } from 'lucide-react';
import { dataStore } from '@/services/dataStore';
import { useQuery } from '@tanstack/react-query';

export default function HomePage() {
  const { data: statsData } = useQuery({
    queryKey: ['live-home-stats'],
    queryFn: () => {
      const companiesCount = dataStore.getCompanies().length;
      const examsCount = dataStore.getAllExams().length;
      const experiencesCount = dataStore.getExperiences().length;
      return [
        { label: 'Companies Tracked', value: `${companiesCount}+` },
        { label: 'Official Exam Drives', value: `${examsCount}+` },
        { label: 'Verified Experiences', value: `${experiencesCount}+` },
        { label: 'Placement Success Rate', value: '94%' },
      ];
    },
  });

  const features = [
    {
      title: 'Company Directory & Hiring Maps',
      description: 'Comprehensive hiring patterns, eligibility criteria, salary ranges, and round breakdowns for top companies.',
      icon: Building2,
      href: '/companies',
      badge: 'Company Hub',
    },
    {
      title: 'Exam Papers & Drives',
      description: 'Company-wise official placement papers, online assessment patterns, syllabus, and document archives.',
      icon: BookOpen,
      href: '/questions',
      badge: 'Official Papers',
    },
    {
      title: 'Real Interview Experiences',
      description: 'Searchable, filterable experiences submitted by students from your college and target roles.',
      icon: Layers,
      href: '/experiences',
      badge: 'Peer Reports',
    },
    {
      title: 'Student Profile & Bookmarks',
      description: 'Quick access to all your saved recruitment drives, memory papers, and bookmarked interview experiences.',
      icon: User,
      href: '/profile',
      badge: 'Personal Space',
    },
  ];

  const stats = statsData || [
    { label: 'Companies Tracked', value: '4+' },
    { label: 'Official Exam Drives', value: '6+' },
    { label: 'Verified Experiences', value: '10+' },
    { label: 'Placement Success Rate', value: '94%' },
  ];

  return (
    <div className="space-y-16 animate-fadeIn pb-12">
      {/* Hero Section */}
      <section className="relative text-center max-w-4xl mx-auto pt-8 sm:pt-14 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6cf8bb]/30 dark:bg-[#006c49]/30 border border-[#00714d]/20 dark:border-[#6cf8bb]/20 text-[#00714d] dark:text-[#6cf8bb] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-[#006c49] dark:text-[#6cf8bb]" />
          <span>PrepUnite – Placement Intelligence Operating System</span>
        </div>

        <h1 className="font-display text-4xl sm:text-6xl font-black text-[#1f1b17] dark:text-[#e3e3e3] tracking-tight leading-tight">
          Know Exactly What to Study for Your Next <span className="text-[#006c49] dark:text-[#6cf8bb]">Interview</span>
        </h1>

        <p className="text-[#444748] dark:text-[#a6adbb] text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto font-normal font-sans">
          Stop searching across Telegram, YouTube, and PDFs. PrepUnite aggregates, organizes, and personalizes placement intelligence into one platform.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/companies"
            className="w-full sm:w-auto px-8 py-3.5 bg-[#000000] dark:bg-[#e3e3e3] hover:bg-[#006c49] dark:hover:bg-[#ffffff] text-white dark:text-[#141517] font-bold rounded-full shadow-lg shadow-black/10 hover:scale-105 transition-all flex items-center justify-center gap-2 group text-sm uppercase tracking-wider"
          >
            <span>Explore Companies</span>
            <ArrowRight className="w-4 h-4 text-[#6cf8bb] dark:text-[#006c49] group-hover:text-white dark:group-hover:text-[#141517] group-hover:translate-x-1 transition-all" />
          </Link>
          <Link
            to="/questions"
            className="w-full sm:w-auto px-8 py-3.5 bg-[#ffffff] dark:bg-[#1e1f22] hover:bg-[#f6ece6] dark:hover:bg-[#2b2d31] text-[#1f1b17] dark:text-[#e3e3e3] font-bold rounded-full border border-[#c4c7c7] dark:border-[#383a40] transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
          >
            <BookOpen className="w-4 h-4 text-[#006c49] dark:text-[#6cf8bb]" />
            <span>Explore Exam Papers</span>
          </Link>
        </div>

        {/* Stats Row (Dynamic from dataStore) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 max-w-3xl mx-auto">
          {stats.map((stat, i) => (
            <div key={i} className="p-5 bg-[#ffffff] dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] rounded-[20px] text-center shadow-sm">
              <div className="font-display text-2xl sm:text-3xl font-black text-[#1f1b17] dark:text-[#e3e3e3]">{stat.value}</div>
              <div className="text-xs text-[#747878] dark:text-[#6e7278] mt-1 font-semibold uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1f1b17] dark:text-[#e3e3e3]">Built for Every Phase of Placements</h2>
          <p className="text-[#444748] dark:text-[#a6adbb] text-sm">Everything you need to go from preparation to job offer.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Link
                key={idx}
                to={feature.href}
                className="group relative p-8 bg-[#ffffff] dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] hover:border-[#006c49]/40 dark:hover:border-[#6cf8bb]/40 rounded-[28px] transition-all duration-300 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#f6ece6] dark:bg-[#141517] border border-[#e2d8d2] dark:border-[#2b2d31] flex items-center justify-center text-[#006c49] dark:text-[#6cf8bb]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-[#00714d] dark:text-[#6cf8bb] bg-[#6cf8bb]/30 dark:bg-[#006c49]/30 px-3 py-1 rounded-full border border-[#00714d]/20 dark:border-[#6cf8bb]/20 uppercase tracking-wider">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-[#1f1b17] dark:text-[#e3e3e3] mb-2 group-hover:text-[#006c49] dark:group-hover:text-[#6cf8bb] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-[#444748] dark:text-[#a6adbb] text-sm leading-relaxed mb-6 font-sans">
                    {feature.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#006c49] dark:text-[#6cf8bb] group-hover:text-[#00714d] dark:group-hover:text-[#6cf8bb]">
                  <span>Explore module</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
