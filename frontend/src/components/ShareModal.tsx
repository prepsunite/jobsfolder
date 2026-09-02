import React, { useState } from 'react';
import { X, Copy, Check, MessageCircle, Send, Share2 } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url?: string;
  description?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  title,
  url,
  description = 'Solved placement drive papers, memory questions, and interview transcripts on PrepUnite.',
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareMessage = `Check out this on PrepUnite:\n${title}\n${shareUrl}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleTelegram = () => {
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`;
    window.open(tgUrl, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        });
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.warn('Native share failed:', err);
        }
      }
    } else {
      handleCopy();
    }
  };

  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-[#141414] rounded-2xl border border-[#E9ECEF] dark:border-[#242424] shadow-xl overflow-hidden p-6 space-y-5 animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E9ECEF] dark:border-[#222222]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FD4A32]/10 text-[#FD4A32] flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-base text-[#121417] dark:text-white">
                Share with Batchmates
              </h3>
              <p className="text-[11px] text-[#868E96] dark:text-[#777777]">
                Help your college batch ace the campus drive
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#868E96] hover:text-[#121417] dark:hover:text-white hover:bg-[#F8F9FA] dark:hover:bg-[#202020] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Preview */}
        <div className="p-3 rounded-xl bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E9ECEF] dark:border-[#242424] space-y-1">
          <span className="text-[10px] font-display font-bold uppercase tracking-wider text-[#FD4A32]">
            Target Resource
          </span>
          <p className="text-xs font-semibold text-[#121417] dark:text-white line-clamp-2">
            {title}
          </p>
        </div>

        {/* Quick Social Share Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {/* WhatsApp */}
          <button
            onClick={handleWhatsApp}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-display font-bold transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-emerald-500 text-emerald-500" />
            <span>WhatsApp</span>
          </button>

          {/* Telegram */}
          <button
            onClick={handleTelegram}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/30 text-xs font-display font-bold transition-all cursor-pointer"
          >
            <Send className="w-4 h-4 text-sky-500" />
            <span>Telegram</span>
          </button>
        </div>

        {/* Mobile Native Share (if supported) */}
        {hasNativeShare && (
          <button
            onClick={handleNativeShare}
            className="w-full py-2.5 px-4 rounded-xl bg-[#121417] dark:bg-white hover:bg-black text-white dark:text-black font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>More Sharing Options...</span>
          </button>
        )}

        {/* Copy Direct Link */}
        <div className="space-y-1.5 pt-1">
          <label className="text-[11px] font-display font-bold text-[#868E96] dark:text-[#777777]">
            Or copy direct link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3 py-2 text-xs font-mono rounded-lg border border-[#E9ECEF] dark:border-[#242424] bg-[#F8F9FA] dark:bg-[#1A1A1A] text-[#121417] dark:text-[#CCCCCC] outline-none"
            />
            <button
              onClick={handleCopy}
              className={`px-3 py-2 rounded-lg text-xs font-display font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                copied
                  ? 'bg-emerald-500 text-white'
                  : 'bg-[#FD4A32] text-black hover:bg-[#E0351D]'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
