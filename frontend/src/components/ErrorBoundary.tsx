import { useRouteError, isRouteErrorResponse, Link } from 'react-router';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';

export default function ErrorBoundary() {
  const error = useRouteError();

  let errorMessage = 'An unexpected error occurred.';
  let errorDetails = '';

  if (isRouteErrorResponse(error)) {
    errorMessage = `${error.status} - ${error.statusText}`;
    errorDetails = error.data || '';
  } else if (error instanceof Error) {
    errorMessage = error.message;
    errorDetails = error.stack || '';
  } else if (typeof error === 'string') {
    errorMessage = error;
  }

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#faf6f0] dark:bg-[#141517] flex items-center justify-center p-6 text-[#1f1b17] dark:text-[#e3e3e3]">
      <div className="max-w-md w-full bg-[#ffffff] dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] rounded-[28px] p-8 shadow-2xl space-y-6 text-center animate-fadeIn">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/15 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-xl font-extrabold text-[#1f1b17] dark:text-[#e3e3e3]">
            Oops! Something went wrong
          </h2>
          <p className="text-xs text-[#747878] dark:text-[#a6adbb] leading-relaxed">
            {errorMessage}
          </p>
        </div>

        {errorDetails && (
          <div className="p-3 bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 rounded-xl text-left">
            <span className="text-[10px] font-bold uppercase text-rose-600 dark:text-rose-400 block mb-1">
              Error Details:
            </span>
            <pre className="font-mono text-[10px] text-rose-600 dark:text-rose-300 overflow-x-auto whitespace-pre-wrap max-h-32">
              {errorDetails.split('\n').slice(0, 4).join('\n')}
            </pre>
          </div>
        )}

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={handleReload}
            className="px-5 py-2.5 bg-[#006c49] hover:bg-[#00573b] dark:bg-[#6cf8bb] dark:hover:bg-[#5be3ab] text-white dark:text-[#141517] rounded-full text-xs font-extrabold transition-all shadow-md flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Page</span>
          </button>

          <Link
            to="/dashboard"
            className="px-5 py-2.5 bg-[#f6ece6] hover:bg-[#eae1da] dark:bg-[#2b2d31] dark:hover:bg-[#383a40] text-[#1f1b17] dark:text-[#e3e3e3] rounded-full text-xs font-extrabold transition-all border border-[#eae1da] dark:border-[#383a40] flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
