import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

export interface ConfirmModalOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
}

interface ToastContextValue {
  toast: {
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
  };
  confirmModal: (options: ConfirmModalOptions) => Promise<boolean>;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [confirmState, setConfirmState] = useState<{
    options: ConfirmModalOptions;
    resolve: (val: boolean) => void;
  } | null>(null);

  const toastIdRef = useRef(0);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = `toast-${++toastIdRef.current}`;
    setToasts((prev) => [...prev.slice(-4), { id, type, message }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  const toast = {
    success: (msg: string) => addToast('success', msg),
    error: (msg: string) => addToast('error', msg),
    info: (msg: string) => addToast('info', msg),
  };

  const confirmModal = useCallback((options: ConfirmModalOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmState({ options, resolve });
    });
  }, []);

  const handleConfirm = () => {
    if (confirmState) {
      confirmState.resolve(true);
      setConfirmState(null);
    }
  };

  const handleCancel = () => {
    if (confirmState) {
      confirmState.resolve(false);
      setConfirmState(null);
    }
  };

  return (
    <ToastContext.Provider value={{ toast, confirmModal }}>
      {children}

      {/* Floating Toast Container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4">
        {toasts.map((t) => {
          let bgBorder = 'bg-white dark:bg-[#1A1A1A] border-[#E9ECEF] dark:border-[#2A2A2A] text-[#121417] dark:text-[#FFFFFF]';
          let icon = <Info className="w-4 h-4 text-blue-500 shrink-0" />;

          if (t.type === 'success') {
            bgBorder = 'bg-white dark:bg-[#1A1A1A] border-emerald-500/30 text-[#121417] dark:text-[#FFFFFF]';
            icon = <CheckCircle2 className="w-4 h-4 text-[#FD4A32] shrink-0" />;
          } else if (t.type === 'error') {
            bgBorder = 'bg-white dark:bg-[#1A1A1A] border-red-500/30 text-[#121417] dark:text-[#FFFFFF]';
            icon = <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />;
          }

          return (
            <div
              key={t.id}
              role="alert"
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border shadow-lg transition-all animate-fadeIn ${bgBorder}`}
            >
              {icon}
              <p className="text-xs font-sans font-medium leading-relaxed flex-1">{t.message}</p>
              <button
                onClick={() => removeToast(t.id)}
                aria-label="Close notification"
                className="text-[#868E96] hover:text-[#121417] dark:hover:text-[#FFFFFF] transition-colors p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Confirm Modal Dialog */}
      {confirmState && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
        >
          <div className="w-full max-w-md bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] rounded-lg shadow-2xl p-6 space-y-4 animate-scaleUp">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 ${
                  confirmState.options.isDanger ?? true
                    ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                    : 'bg-[#FD4A32]/10 text-[#FD4A32] border border-[#FD4A32]/20'
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-display text-base font-extrabold text-[#121417] dark:text-[#FFFFFF]">
                {confirmState.options.title}
              </h3>
            </div>

            <p className="text-xs text-[#868E96] dark:text-[#888888] font-sans leading-relaxed">
              {confirmState.options.message}
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#E9ECEF] dark:border-[#242424]">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 rounded-md border border-[#E9ECEF] dark:border-[#242424] text-xs font-display font-bold uppercase tracking-wider text-[#868E96] dark:text-[#888888] hover:text-[#121417] dark:hover:text-[#FFFFFF] transition-colors cursor-pointer"
              >
                {confirmState.options.cancelText || 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className={`px-4 py-2 rounded-md text-xs font-display font-bold uppercase tracking-wider text-white transition-colors cursor-pointer ${
                  confirmState.options.isDanger ?? true
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-[#FD4A32] hover:bg-[#E0351D] text-black'
                }`}
              >
                {confirmState.options.confirmText || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
};
