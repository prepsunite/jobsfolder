import { useState, useEffect, useRef } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, MapPin, Clock, HelpCircle, ShieldCheck, Loader2, ShieldAlert, Paperclip, Image as ImageIcon, X, ExternalLink } from 'lucide-react';
import { feedbackService } from '@/services/feedback.service';
import { rateLimiter, type RateLimitStatus } from '@/utils/rateLimiter';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState(''); // Anti-bot honeypot trap
  const [rateStatus, setRateStatus] = useState<RateLimitStatus>(() => rateLimiter.check('contact_message'));

  // Attachment state (picture/screenshot)
  const [attachment, setAttachment] = useState<{
    file: File;
    previewUrl: string;
    base64: string;
  } | null>(null);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: 'Access / Payment Assistance',
    message: '',
  });

  // Re-check rate limit status on mount and when submitted changes
  useEffect(() => {
    setRateStatus(rateLimiter.check('contact_message'));
  }, [submitted]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAttachmentError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 4.5 MB)
    if (file.size > 4.5 * 1024 * 1024) {
      setAttachmentError('File is too large. Maximum image size is 4.5 MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validate type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setAttachmentError('Unsupported file type. Please attach a PNG, JPG, or WEBP image.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      const previewUrl = URL.createObjectURL(file);
      setAttachment({ file, previewUrl, base64 });
    };
    reader.onerror = () => {
      setAttachmentError('Failed to read file. Please try another image.');
    };
    reader.readAsDataURL(file);
  };

  const removeAttachment = () => {
    if (attachment?.previewUrl) {
      URL.revokeObjectURL(attachment.previewUrl);
    }
    setAttachment(null);
    setAttachmentError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Build a mailto link that pre-fills everything the user has typed
  const mailtoUrl = `mailto:prepsunite@gmail.com?subject=${encodeURIComponent(
    `[PrepUnite Support] ${form.subject}`
  )}&body=${encodeURIComponent(
    `Hello PrepUnite Team,\n\nName: ${form.name || '(Candidate)'}\nEmail: ${form.email || '(Your email)'}\nQuery Type: ${form.subject}\n\nMessage:\n${form.message || '(Please describe your issue or question here...)'}\n\n(Tip: You can easily attach any screenshots, transaction receipts, or photos directly to this email!)`
  )}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Invisible Anti-Bot Honeypot Trap
    if (honeypot.trim()) {
      setSubmitted(true); // Fake success to disarm automated spam scrapers
      return;
    }

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;

    // 2. Client-side Rate Limit / Cooldown check
    const currentLimit = rateLimiter.check('contact_message');
    if (!currentLimit.allowed) {
      setErrorMsg(currentLimit.reason || 'Submission limit exceeded. Please try again later.');
      setRateStatus(currentLimit);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      let finalMessage = form.message.trim();

      // If a screenshot was attached, upload it to storage first
      if (attachment) {
        const uploadRes = await fetch('/api/upload-support-attachment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: attachment.file.name,
            fileType: attachment.file.type,
            base64: attachment.base64,
          }),
        });

        if (!uploadRes.ok) {
          const errData = await uploadRes.json().catch(() => ({}));
          throw new Error(errData.detail || errData.error || 'Failed to upload attached screenshot.');
        }

        const { url } = await uploadRes.json();
        if (url) {
          finalMessage += `\n\n📷 Attached Screenshot / Proof:\n${url}`;
        }
      }

      await feedbackService.submitContactMessage({
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: finalMessage,
      });

      setSubmitted(true);
      removeAttachment();
      setRateStatus(rateLimiter.check('contact_message'));
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send message. Please try again or email us directly.');
    } finally {
      setIsSubmitting(false);
    }
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
              <MessageSquare className="w-3.5 h-3.5 text-[#121417] dark:text-[#FD4A32]" />
              <span>Direct Support</span>
            </h3>

            <div className="space-y-2.5 text-xs text-[#868E96] dark:text-[#555555] font-sans">
              <div className="flex items-start gap-2.5">
                <Mail className="w-3.5 h-3.5 text-[#121417] dark:text-[#FD4A32] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#121417] dark:text-[#FFFFFF] block text-[11px]">Email</span>
                  <a href="mailto:prepsunite@gmail.com" className="hover:text-[#FD4A32] dark:hover:text-[#FD4A32]">
                    prepsunite@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-3.5 h-3.5 text-[#121417] dark:text-[#FD4A32] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#121417] dark:text-[#FFFFFF] block text-[11px]">Response Time</span>
                  <span>Within 24 hours</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-[#121417] dark:text-[#FD4A32] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#121417] dark:text-[#FFFFFF] block text-[11px]">Location</span>
                  <span>India · Placement Tech Services</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[#F8F9FA] dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] space-y-2">
            <h4 className="font-display font-bold text-xs text-[#FD4A32] dark:text-[#FD4A32] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>Prefer Your Email App?</span>
            </h4>
            <p className="text-[11px] text-[#868E96] dark:text-[#555555] leading-relaxed font-sans">
              You can also send directly from your personal Gmail or Outlook client. Attach photos, screenshots, or receipts easily!
            </p>
            <a
              href={mailtoUrl}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#121417] dark:bg-white text-white dark:text-black text-[10px] font-display font-bold uppercase tracking-wider transition-colors mt-1 w-full justify-center"
            >
              <span>Open in Mail App</span>
              <ExternalLink className="w-3 h-3" />
            </a>
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
              {/* Invisible Bot Honeypot Trap (Automated bots will fill this; humans will not see it) */}
              <div aria-hidden="true" style={{ display: 'none', position: 'absolute', left: '-9999px' }}>
                <label htmlFor="company_fax_website">Leave this field blank</label>
                <input
                  type="text"
                  id="company_fax_website"
                  name="company_fax_website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              {/* Anti-Spam / Daily Quota Indicator */}
              <div className="flex items-center justify-between pb-1 border-b border-[#E9ECEF] dark:border-[#242424] text-[10px] text-[#868E96] dark:text-[#555555]">
                <span>Anti-Spam Shield Active</span>
                <span className={`font-mono font-bold ${rateStatus.remainingToday === 0 ? 'text-rose-500' : 'text-[#121417] dark:text-[#FFFFFF]'}`}>
                  Quota: {rateStatus.remainingToday} of {rateStatus.maxDaily} inquiries remaining today
                </span>
              </div>

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

              {/* Picture / Screenshot Attachment Uploader */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-[9px] font-display font-bold text-[#868E96] dark:text-[#555555] uppercase block">
                    Attach Screenshot / Image (Optional)
                  </label>
                  <span className="text-[10px] text-[#868E96] dark:text-[#555555]">Max 4.5 MB · PNG, JPG, WEBP</span>
                </div>

                {!attachment ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border border-dashed border-[#E9ECEF] dark:border-[#2E2E2E] hover:border-[#FD4A32] dark:hover:border-[#FD4A32] rounded-md p-3 text-center cursor-pointer transition-colors bg-[#F8F9FA]/60 dark:bg-[#0C0C0C]/60 flex items-center justify-center gap-2 group"
                  >
                    <Paperclip className="w-3.5 h-3.5 text-[#FD4A32] group-hover:scale-110 transition-transform" />
                    <span className="text-xs text-[#868E96] dark:text-[#888888]">
                      Click to attach a payment receipt, question photo, or error screenshot
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </div>
                ) : (
                  <div className="relative p-2 rounded-md border border-[#E9ECEF] dark:border-[#242424] bg-[#F8F9FA] dark:bg-[#0C0C0C] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={attachment.previewUrl}
                        alt="Attachment preview"
                        className="w-10 h-10 object-cover rounded-sm border border-[#E9ECEF] dark:border-[#2E2E2E] shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-[#121417] dark:text-white truncate block">
                          {attachment.file.name}
                        </span>
                        <span className="text-[10px] text-[#868E96] dark:text-[#666666] block font-mono">
                          {(attachment.file.size / (1024 * 1024)).toFixed(2)} MB · Ready to upload
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeAttachment}
                      className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 text-[#868E96] hover:text-rose-500 transition-colors cursor-pointer"
                      title="Remove attachment"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {attachmentError && (
                  <p className="text-[11px] text-rose-500 font-medium">{attachmentError}</p>
                )}
              </div>

              {(!rateStatus.allowed || errorMsg) && (
                <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 font-medium flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg || rateStatus.reason}</span>
                </div>
              )}

              {/* Dual Action: Submit Online OR Open in Mail App */}
              <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !rateStatus.allowed}
                  className="w-full sm:flex-1 py-2.5 rounded-md bg-[#FD4A32] dark:bg-[#FD4A32] hover:bg-[#E0351D] text-black text-xs font-display font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Submitting Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Online</span>
                    </>
                  )}
                </button>

                <a
                  href={mailtoUrl}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-md border border-[#E9ECEF] dark:border-[#2E2E2E] hover:border-[#121417] dark:hover:border-white text-[#121417] dark:text-white text-xs font-display font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap bg-white dark:bg-[#1C1C1C] cursor-pointer"
                  title="Opens your installed email client (Gmail, Outlook) with these details pre-filled"
                >
                  <Mail className="w-3.5 h-3.5 text-[#FD4A32]" />
                  <span>Send via Mail App</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </div>
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
