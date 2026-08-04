import { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, Phone, MapPin, Clock, HelpCircle } from 'lucide-react';

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
    <div className="max-w-5xl mx-auto space-y-10 py-6 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#006c49]/10 text-[#006c49] dark:bg-[#6cf8bb]/10 dark:text-[#6cf8bb] text-xs font-extrabold uppercase tracking-wider">
          <Mail className="w-3.5 h-3.5" />
          <span>Support & Enquiries</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-[#1f1b17] dark:text-white tracking-tight">
          Contact Us
        </h1>
        <p className="text-xs sm:text-sm text-[#747878] dark:text-[#a6adbb]">
          Have a question about your paper access, subscriptions, or payment verification? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info Sidebar */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] shadow-sm space-y-4">
            <h3 className="font-bold text-base text-[#1f1b17] dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#006c49] dark:text-[#6cf8bb]" />
              <span>Direct Support</span>
            </h3>

            <div className="space-y-3 text-xs text-[#747878] dark:text-[#a6adbb]">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#006c49] dark:text-[#6cf8bb] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#1f1b17] dark:text-white block">Email Address</span>
                  <a href="mailto:prepsunite@gmail.com" className="hover:text-[#006c49] dark:hover:text-[#6cf8bb]">
                    prepsunite@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#006c49] dark:text-[#6cf8bb] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#1f1b17] dark:text-white block">Response Time</span>
                  <span>Within 24 hours (Monday to Sunday)</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#006c49] dark:text-[#6cf8bb] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#1f1b17] dark:text-white block">Location</span>
                  <span>India • Educational Technology Services</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#006c49]/5 dark:bg-[#6cf8bb]/5 border border-[#006c49]/20 dark:border-[#6cf8bb]/20 space-y-2">
            <h4 className="font-bold text-xs text-[#006c49] dark:text-[#6cf8bb] flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              <span>Payment or Access Issues?</span>
            </h4>
            <p className="text-[11px] text-[#747878] dark:text-[#a6adbb] leading-relaxed">
              If your payment was completed on Razorpay but content did not unlock automatically, include your <strong>Payment ID (pay_xxx)</strong> in the message for instant manual activation.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 p-8 rounded-3xl bg-white dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] shadow-sm">
          {submitted ? (
            <div className="py-12 text-center space-y-4 animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl text-[#1f1b17] dark:text-white">Message Sent Successfully!</h3>
              <p className="text-xs text-[#747878] dark:text-[#a6adbb] max-w-md mx-auto">
                Thank you for reaching out. Our support team will inspect your query and respond via email within 24 hours.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="px-5 py-2 rounded-full bg-[#006c49] hover:bg-[#005a3c] text-white text-xs font-bold transition-all"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h3 className="font-bold text-lg text-[#1f1b17] dark:text-white">Send Us a Message</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#444748] dark:text-[#a6adbb]">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#eae1da] dark:border-[#383a40] bg-[#fff8f5] dark:bg-[#141517] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#006c49]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#444748] dark:text-[#a6adbb]">Email Address</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="student@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#eae1da] dark:border-[#383a40] bg-[#fff8f5] dark:bg-[#141517] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#006c49]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#444748] dark:text-[#a6adbb]">Category / Subject</label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#eae1da] dark:border-[#383a40] bg-[#fff8f5] dark:bg-[#141517] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#006c49]"
                >
                  <option value="Access / Payment Assistance">Access / Payment Assistance</option>
                  <option value="Paper Request">Request a New Company Paper</option>
                  <option value="Bug Report">Report a Technical Issue</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#444748] dark:text-[#a6adbb]">Your Message</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Describe your request or issue in detail..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#eae1da] dark:border-[#383a40] bg-[#fff8f5] dark:bg-[#141517] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#006c49]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#006c49] hover:bg-[#005a3c] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
