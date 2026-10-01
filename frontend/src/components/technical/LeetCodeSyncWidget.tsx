import React, { useState, useEffect } from 'react';
import {
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Unlink,
  Sparkles,
  Award,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import audioEffects from '@/utils/audioEffects';
import {
  leetcodeSyncService,
  type LeetCodeProfile,
} from '@/services/leetcodeSync.service';
import { ALL_CAMPUS_DSA_PROBLEMS } from '@/services/campusDsaRoadmapData';

interface LeetCodeSyncWidgetProps {
  onSyncSuccess?: () => void;
  className?: string;
}

export default function LeetCodeSyncWidget({
  onSyncSuccess,
  className = '',
}: LeetCodeSyncWidgetProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const [profile, setProfile] = useState<LeetCodeProfile | null>(null);
  const [usernameInput, setUsernameInput] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load stored profile and reconcile with solved set on mount
  useEffect(() => {
    leetcodeSyncService.reconcileStoredProfile(user?.email);
    const stored = leetcodeSyncService.getStoredProfile();
    if (stored) {
      setProfile(stored);
      setUsernameInput(stored.username);
    }
  }, [user?.email]);

  const handleSync = async (targetUsername?: string) => {
    const handle = (targetUsername || usernameInput).replace(/^@/, '').trim();
    if (!handle) {
      setErrorMsg('Please enter your LeetCode username.');
      return;
    }

    setIsSyncing(true);
    setErrorMsg(null);

    try {
      const result = await leetcodeSyncService.syncCampusDsa(handle, user?.email);

      if (result.success && result.profile) {
        setProfile(result.profile);
        setIsEditing(false);
        audioEffects.playSuccessChime();

        if (result.newlyMatchedCount && result.newlyMatchedCount > 0) {
          toast.success(
            `⚡ Verified ${result.newlyMatchedCount} new solved problems from LeetCode! Total Campus DSA verified: ${result.matchedCount}`
          );
        } else {
          toast.success(
            `LeetCode profile synced! ${result.matchedCount} Campus DSA problems matched.`
          );
        }

        if (onSyncSuccess) {
          onSyncSuccess();
        }
      } else {
        audioEffects.playErrorBuzz();
        const err = result.error || 'Failed to sync LeetCode profile.';
        setErrorMsg(err);
        toast.error(err);
      }
    } catch (err: any) {
      audioEffects.playErrorBuzz();
      const msg = err.message || 'An unexpected error occurred while syncing with LeetCode.';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDisconnect = () => {
    leetcodeSyncService.clearStoredProfile();
    setProfile(null);
    setUsernameInput('');
    setIsEditing(false);
    toast.info('LeetCode account unlinked.');
  };

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 overflow-hidden relative ${
        profile && !isEditing
          ? 'bg-gradient-to-br from-[#FFA116]/[0.06] via-white dark:via-[#141414] to-[#FD4A32]/[0.04] border-[#FFA116]/30 dark:border-[#FFA116]/25 shadow-sm'
          : 'bg-white dark:bg-[#141414] border-[#E9ECEF] dark:border-[#242424] shadow-xs'
      } ${className}`}
    >
      {/* Decorative top accent glow */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFA116] via-[#FD4A32] to-[#FFA116]/50 opacity-90" />

      <div className="p-4 sm:p-5">
        {profile && !isEditing ? (
          /* ────────────────────────────────────────────────────────────────────────
              STATE A: CONNECTED PROFILE DASHBOARD
          ──────────────────────────────────────────────────────────────────────── */
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Left: User Identity & Verified Badge */}
            <div className="flex items-start sm:items-center gap-3.5 min-w-0">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.username}
                  className="w-12 h-12 rounded-xl object-cover border-2 border-[#FFA116]/40 shadow-xs shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFA116] to-[#E08A00] text-black font-extrabold flex items-center justify-center text-lg shadow-xs shrink-0">
                  {profile.username.slice(0, 2).toUpperCase()}
                </div>
              )}

              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-display font-black text-base sm:text-lg text-[#121417] dark:text-white">
                    @{profile.username}
                  </span>
                  <a
                    href={`https://leetcode.com/u/${profile.username}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-[#FFA116] hover:underline"
                    title="View public profile on LeetCode"
                  >
                    <span>LeetCode Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="inline-flex items-center gap-1 text-[10px] font-display font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Auto-Sync Active</span>
                  </span>
                </div>

                {/* Difficulty Breakdown Badges */}
                <div className="flex items-center gap-1.5 flex-wrap text-[11px] font-mono">
                  <span className="font-bold text-gray-700 dark:text-gray-300">
                    {profile.stats.totalSolved} Solved on LC:
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    {profile.stats.easySolved} Easy
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">
                    {profile.stats.mediumSolved} Med
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-rose-600 dark:text-rose-400 font-semibold">
                    {profile.stats.hardSolved} Hard
                  </span>
                  {profile.ranking && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500 dark:text-gray-400 flex items-center gap-0.5">
                        <Award className="w-3 h-3 text-[#FFA116]" />
                        <span>Rank #{profile.ranking.toLocaleString()}</span>
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Middle / Right: Solved Match Count & Actions */}
            <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#E9ECEF] dark:border-[#242424] flex-wrap">
              {/* Campus DSA Match Pill */}
              <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#1A1A1A] border border-[#FFA116]/30 shadow-2xs space-y-0.5">
                <div className="text-[10px] font-display font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#FFA116]" />
                  <span>Roadmap Solved</span>
                </div>
                <div className="font-display font-extrabold text-sm sm:text-base text-[#121417] dark:text-white">
                  <span className="text-[#FFA116]">{profile.verifiedCampusDsaCount}</span>
                  <span className="text-gray-400 text-xs font-normal"> / {ALL_CAMPUS_DSA_PROBLEMS.length} Verified</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSync(profile.username)}
                  disabled={isSyncing}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-display font-bold bg-[#FFA116] hover:bg-[#E08A00] text-black transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                  title="Pull latest solved problems from your LeetCode account"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="p-2 rounded-xl border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#1A1A1A] text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-400 text-xs font-medium transition-all cursor-pointer shadow-2xs"
                  title="Change LeetCode handle"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ────────────────────────────────────────────────────────────────────────
              STATE B: DISCONNECTED / EDIT INPUT FORM
          ──────────────────────────────────────────────────────────────────────── */
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FFA116] to-[#E08A00] text-black font-extrabold flex items-center justify-center shadow-xs shrink-0">
                  <Sparkles className="w-4 h-4 text-black" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-sm sm:text-base text-[#121417] dark:text-white flex items-center gap-2">
                    <span>LeetCode Auto-Sync</span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FFA116]/15 text-[#FFA116] border border-[#FFA116]/30">
                      Live
                    </span>
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Connect your public LeetCode handle to auto-verify and track your Campus DSA progress in 1 click.
                  </p>
                </div>
              </div>

              {profile && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 self-start sm:self-auto cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>

            {/* Input & Connect Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSync();
              }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1"
            >
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-sm font-bold text-gray-400 select-none">
                  @
                </span>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => {
                    setUsernameInput(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="Enter LeetCode username (e.g. 'tourist', 'lee215')"
                  disabled={isSyncing}
                  className="w-full pl-8 pr-4 py-2.5 text-xs sm:text-sm font-sans rounded-xl border border-[#E9ECEF] dark:border-[#282828] bg-[#F8F9FA] dark:bg-[#0C0C0C] text-[#121417] dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFA116]/50 focus:border-[#FFA116] transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isSyncing || !usernameInput.trim()}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-display font-bold bg-[#FFA116] hover:bg-[#E08A00] text-black transition-all shadow-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Connecting...' : profile ? 'Save & Sync' : 'Connect & Sync'}</span>
              </button>

              {profile && (
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-display font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
                  title="Unlink LeetCode account"
                >
                  <Unlink className="w-3.5 h-3.5" />
                  <span>Unlink</span>
                </button>
              )}
            </form>

            {/* Error Message if any */}
            {errorMsg && (
              <div className="flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-lg font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Trust Footnote */}
            <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 pt-0.5">
              <span>🔒 100% Secure • Public profile data only • No passwords needed</span>
              <span className="hidden sm:inline">Recent solves will be automatically matched</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
