import React, { useState, useEffect } from 'react';
import {
  Flame,
  X,
  RotateCcw,
  Server,
  Clock,
  CheckCircle2,
} from 'lucide-react';

interface CompilerOverloadedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry?: () => void;
  onSwitchLanguage?: (language: string) => void;
  currentLanguage?: string;
  reason?: string;
}

export default function CompilerOverloadedModal({
  isOpen,
  onClose,
  onRetry,
  reason,
}: CompilerOverloadedModalProps) {
  const [countdown, setCountdown] = useState<number>(5);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
      setIsRetrying(false);
      return;
    }

    setCountdown(5);
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRetryClick = () => {
    setIsRetrying(true);
    onClose();
    if (onRetry) {
      setTimeout(() => {
        onRetry();
      }, 100);
    }
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#121418] border border-[#262930] rounded-2xl p-6 sm:p-7 shadow-2xl text-[#f0f2f5] space-y-6">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Surge Badge */}
        <div className="text-center space-y-3">
          <div className="relative w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shadow-lg">
            <Flame className="w-7 h-7 animate-pulse text-amber-400" />
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-500 animate-ping opacity-75" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-display font-bold uppercase tracking-wider">
            <Server className="w-3.5 h-3.5" />
            <span>High Server Queue Traffic Surge</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight">
            The IDE Compiler is Packed!
          </h3>

          <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
            <strong className="text-emerald-400 font-semibold">Your code is completely fine!</strong>{' '}
            Our backend sandbox servers are currently processing a high volume of candidate test runs, causing temporary queue delays.
          </p>
        </div>

        {/* Reassurance Callout Box */}
        <div className="p-3.5 rounded-xl bg-[#181b22] border border-[#292e3a] space-y-2 text-xs">
          <div className="flex items-start gap-2 text-gray-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>This is <strong>not a bug in your algorithm</strong> — the cloud compiler container took longer than 30s to provision.</span>
          </div>
          {reason && (
            <div className="text-[11px] font-mono text-gray-400 bg-black/40 p-2 rounded border border-white/5 overflow-x-auto">
              Diagnostic: {reason}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleRetryClick}
            disabled={isRetrying}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FD4A32] to-[#e03a22] hover:from-[#e03a22] hover:to-[#c4301a] text-white font-display font-bold text-xs tracking-wide shadow-lg shadow-[#FD4A32]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
            <span>
              {countdown > 1 ? `Retry Execution (${countdown}s)` : 'Retry Execution Now'}
            </span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-display font-semibold text-xs border border-white/10 transition-colors cursor-pointer"
          >
            I'll Wait a Moment
          </button>
        </div>

        {/* Footer note */}
        <div className="text-center">
          <p className="text-[11px] text-gray-400 flex items-center justify-center gap-1">
            <Clock className="w-3 h-3 text-gray-400" />
            <span>Queue allocation typically clears within 10 to 15 seconds.</span>
          </p>
        </div>

      </div>
    </div>
  );
}
