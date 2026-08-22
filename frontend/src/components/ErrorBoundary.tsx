import { useRouteError, isRouteErrorResponse, Link } from 'react-router';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function ErrorBoundary() {
  const error = useRouteError();

  let errorMessage = 'An unexpected error occurred.';

  const isChunkError = 
    (error instanceof Error && (error.message.includes('dynamically imported module') || error.message.includes('Loading chunk'))) ||
    (typeof error === 'string' && error.includes('dynamically imported module'));

  // Auto-reload once on new Vercel deployment chunk mismatch
  if (isChunkError && typeof window !== 'undefined') {
    const lastReload = sessionStorage.getItem('prepunite_chunk_reload');
    if (!lastReload || Date.now() - parseInt(lastReload, 10) > 10000) {
      sessionStorage.setItem('prepunite_chunk_reload', Date.now().toString());
      window.location.reload();
    }
  }

  if (isRouteErrorResponse(error)) {
    errorMessage = `${error.status} - Page ${error.statusText}`;
  } else if (isChunkError) {
    errorMessage = 'A new version of PrepUnite has been deployed. Refreshing to update...';
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#faf6f0] dark:bg-[#141517] flex items-center justify-center p-6 text-[#1f1b17] dark:text-[#e3e3e3]">
      <div className="max-w-md w-full bg-[#ffffff] dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] rounded-[28px] p-8 shadow-2xl space-y-6 text-center animate-fadeIn">
        <div className="w-16 h-16 rounded-2xl bg-purple-500/15 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto border border-purple-500/30">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-xl font-extrabold text-[#1f1b17] dark:text-[#e3e3e3]">
            {isChunkError ? 'App Updated' : 'Something went wrong'}
          </h2>
          <p className="text-xs text-[#747878] dark:text-[#a6adbb] leading-relaxed">
            {errorMessage}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={handleReload}
            className="px-5 py-2.5 bg-[#FD4A32] hover:bg-[#D62F18] dark:bg-[#FD4A32] dark:hover:bg-[#FF6D59] text-white dark:text-[#141517] rounded-full text-xs font-extrabold transition-all shadow-md flex items-center gap-2"
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
