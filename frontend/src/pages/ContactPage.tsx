import { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, MapPin, Clock, HelpCircle, ShieldCheck } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: 'Access / Payment Assistance',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FD4A32]/10 text-[#FD4A32] dark:bg-[#FD4A32]/10 dark:text-[#FD4A32] text-[10px] font-display font-bold uppercase tracking-wider">
          <Mail className="w-3 h-3" />
          <span>Support & Enquiries</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#121417] dark:text-[#FFFFFF] tracking-tight">
          Contact Us
        </h1>
        <p className="text-xs text-[#868E96] dark:text-[#555555] font-sans">
          Have a question about your paper access, company requests, or payment verification?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Contact Info Sidebar */}
        <div className="space-y-4">
          <div className="p-5 rounded-lg bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] space-y-3">
            <h3 className="font-display font-bold text-sm text-[#121417] dark:text-[#FFFFFF] flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-[#FD4A32] dark:text-[#FD4A32]" />
              <span>Direct Support</span>
            </h3>

            <div className="space-y-2.5 text-xs text-[#868E96] dark:text-[#555555] font-sans">
              <div className="flex items-start gap-2.5">
                <Mail className="w-3.5 h-3.5 text-[#FD4A32] dark:text-[#FD4A32] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#121417] dark:text-[#FFFFFF] block text-[11px]">Email</span>
                  <a href="mailto:prepsunite@gmail.com" className="hover:text-[#FD4A32] dark:hover:text-[#FD4A32]">
                    prepsunite@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-3.5 h-3.5 text-[#FD4A32] dark:text-[#FD4A32] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#121417] dark:text-[#FFFFFF] block text-[11px]">Response Time</span>
                  <span>Within 24 hours</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-[#FD4A32] dark:text-[#FD4A32] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#121417] dark:text-[#FFFFFF] block text-[11px]">Location</span>
                  <span>India · Placement Tech Services</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[#F8F9FA] dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] space-y-1.5">
            <h4 className="font-display font-bold text-xs text-[#FD4A32] dark:text-[#FD4A32] flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Payment or Access Issues?</span>
            </h4>
            <p className="text-[11px] text-[#868E96] dark:text-[#555555] leading-relaxed font-sans">
              Include your <strong>Payment ID (pay_xxx)</strong> in the message for rapid activation.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 p-6 rounded-lg bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424]">
          {submitted ? (
            <div className="py-10 text-center space-y-3 animate-fadeIn">
              <div className="w-10 h-10 rounded-md bg-[#FD4A32]/10 text-[#FD4A32] dark:text-[#FD4A32] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-[#121417] dark:text-[#FFFFFF]">Message Sent Successfully!</h3>
              <p className="text-xs text-[#868E96] dark:text-[#555555] max-w-md mx-auto font-sans">
                Our support team will inspect your query and respond via email within 24 hours.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="px-4 py-1.5 rounded-md bg-[#121417] dark:bg-white text-white dark:text-black text-xs font-display font-bold uppercase tracking-wider transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[9px] font-display font-bold text-[#868E96] dark:text-[#555555] uppercase block">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] focus:border-[#121417] dark:focus:border-[#444444] rounded-md p-2 text-xs text-[#121417] dark:text-[#FFFFFF] placeholder-[#868E96] focus:outline-none transition-colors font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-display font-bold text-[#868E96] dark:text-[#555555] uppercase block">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@college.edu"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] focus:border-[#121417] dark:focus:border-[#444444] rounded-md p-2 text-xs text-[#121417] dark:text-[#FFFFFF] placeholder-[#868E96] focus:outline-none transition-colors font-sans"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-display font-bold text-[#868E96] dark:text-[#555555] uppercase block">Subject / Query Type</label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] focus:border-[#121417] dark:focus:border-[#444444] rounded-md p-2 text-xs text-[#121417] dark:text-[#FFFFFF] focus:outline-none transition-colors font-sans"
                >
                  <option>Access / Payment Assistance</option>
                  <option>Request Company Paper Archive</option>
                  <option>Submit Verified Question Paper</option>
                  <option>General Feedback / Partnership</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-display font-bold text-[#868E96] dark:text-[#555555] uppercase block">Your Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your issue or query..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] focus:border-[#121417] dark:focus:border-[#444444] rounded-md p-2 text-xs text-[#121417] dark:text-[#FFFFFF] placeholder-[#868E96] focus:outline-none transition-colors font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-md bg-[#FD4A32] dark:bg-[#FD4A32] hover:bg-[#E0351D] text-black text-xs font-display font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Message</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* DPDP Act 2023 — Data Grievance Section (Pillar 7, Section 13) */}
      <div className="p-6 rounded-lg bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-[#FD4A32]/10 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-[#FD4A32]" />
          </div>
          <div>
            <h2 className="font-display font-bold text-sm text-[#121417] dark:text-[#FFFFFF]">
              Data Rights &amp; Privacy Complaints
            </h2>
            <p className="text-[10px] text-[#868E96] dark:text-[#555555] font-sans">
              Grievance Officer — DPDP Act, 2023 (Section 13) · Response within 7 working days
            </p>
          </div>
        </div>

        <p className="text-xs text-[#495057] dark:text-[#999999] font-sans leading-relaxed">
          Under the <strong className="text-[#121417] dark:text-white">Digital Personal Data Protection Act, 2023</strong>, you have
          the right to access, correct, or request erasure of your personal data, withdraw your consent, or file a
          complaint about how your data is handled. Use the options below to exercise these rights.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              title: 'Request Data Access',
              desc: 'Get a summary of all personal data we hold about you.',
              subject: 'Data Access Request',
              body: 'I request a summary of all personal data Jobsfolder holds about me.',
            },
            {
              title: 'Request Data Correction',
              desc: 'Ask us to correct or complete inaccurate personal data.',
              subject: 'Data Correction Request',
              body: 'I request correction of the following personal data: [describe what needs correcting]',
            },
            {
              title: 'Request Account Deletion',
              desc: 'Request permanent deletion of your account and personal data.',
              subject: 'Account Deletion Request',
              body: 'I request permanent deletion of my Jobsfolder account and all associated personal data.',
            },
            {
              title: 'File a Privacy Complaint',
              desc: 'Report a concern about how your data has been handled.',
              subject: 'Privacy Complaint',
              body: 'I wish to file a privacy complaint regarding: [describe your concern]',
            },
          ].map(({ title, desc, subject, body }) => (
            <a
              key={title}
              href={`mailto:prepsunite@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}
              className="p-3.5 rounded-md border border-[#E9ECEF] dark:border-[#242424] hover:border-[#FD4A32] dark:hover:border-[#FD4A32] group transition-colors space-y-1 block"
            >
              <p className="text-xs font-display font-bold text-[#121417] dark:text-white group-hover:text-[#FD4A32] transition-colors">
                {title}
              </p>
              <p className="text-[10px] text-[#868E96] dark:text-[#555555] font-sans">{desc}</p>
            </a>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-[#E9ECEF] dark:border-[#242424]">
          <div className="text-[10px] text-[#868E96] dark:text-[#555555] font-sans">
            <strong className="text-[#495057] dark:text-[#999999]">Grievance Officer:</strong> prepsunite@gmail.com ·{' '}
            <strong className="text-[#495057] dark:text-[#999999]">SLA:</strong> 7 working days ·{' '}
            If unresolved in 30 days, escalate to the Data Protection Board of India (DPBI).
          </div>
          <a
            href="mailto:prepsunite@gmail.com"
            className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#FD4A32] hover:bg-[#e03e28] text-white text-[11px] font-display font-bold uppercase tracking-wider transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            Email Grievance Officer
          </a>
        </div>
      </div>

    </div>
  );
}
