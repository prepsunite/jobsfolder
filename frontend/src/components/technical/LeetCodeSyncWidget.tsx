import React, { useState, useEffect } from 'react';
import {
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Unlink,
  Sparkles,
  Award,
  Upload,
  ChevronDown,
  ChevronUp,
  HelpCircle,
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
  roadmapSolvedCount?: number;
}

export default function LeetCodeSyncWidget({
  onSyncSuccess,
  className = '',
  roadmapSolvedCount,
}: LeetCodeSyncWidgetProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const [profile, setProfile] = useState<LeetCodeProfile | null>(null);
  const [usernameInput, setUsernameInput] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Quick Import Past Solves State
  const [showImportBox, setShowImportBox] = useState(false);
  const [importInput, setImportInput] = useState('');
  const [importResult, setImportResult] = useState<{ count: number; error?: string } | null>(null);

  // Track timestamp of last sync for smart tab-return auto-sync throttling
  const lastSyncTimestampRef = React.useRef<number>(0);

  // Load stored profile and reconcile with solved set on mount
  useEffect(() => {
    leetcodeSyncService.reconcileStoredProfile(user?.email);
    const stored = leetcodeSyncService.getStoredProfile();
    if (stored) {
      setProfile(stored);
      setUsernameInput(stored.username);
    }
  }, [user?.email]);

  // Listen for storage updates across tabs / components
  useEffect(() => {
    const handleStorageUpdate = () => {
      const stored = leetcodeSyncService.getStoredProfile();
      if (stored) {
        setProfile(stored);
      }
    };
    window.addEventListener('prepunite-storage-update', handleStorageUpdate);
    return () => {
      window.removeEventListener('prepunite-storage-update', handleStorageUpdate);
    };
  }, []);

  // ⚡ Smart Auto-Sync: When user solves a question on LeetCode and switches back to Prepunite
  useEffect(() => {
    const handleReturnToTab = () => {
      if (document.visibilityState === 'visible' && profile && !isSyncing && !isEditing) {
        const now = Date.now();
        // Throttle auto-sync to at most once every 30 seconds to avoid spamming LeetCode
        if (now - lastSyncTimestampRef.current >= 30000) {
          lastSyncTimestampRef.current = now;
          handleSync(profile.username, { isSilent: true });
        }
      }
    };

    document.addEventListener('visibilitychange', handleReturnToTab);
    window.addEventListener('focus', handleReturnToTab);
    return () => {
      document.removeEventListener('visibilitychange', handleReturnToTab);
      window.removeEventListener('focus', handleReturnToTab);
    };
  }, [profile, isSyncing, isEditing]);

  const handleSync = async (targetUsername?: string, options?: { isSilent?: boolean }) => {
    const handle = leetcodeSyncService.extractCleanUsername(targetUsername || usernameInput);
    if (!handle) {
      if (!options?.isSilent) setErrorMsg('Please enter your LeetCode username or profile URL.');
      return;
    }

    if (!options?.isSilent) setIsSyncing(true);
    setErrorMsg(null);
    lastSyncTimestampRef.current = Date.now();

    try {
      const result = await leetcodeSyncService.syncCampusDsa(handle, user?.email);

      if (result.success && result.profile) {
        setProfile(result.profile);
        setUsernameInput(result.profile.username);
        setIsEditing(false);

        if (result.newlyMatchedCount && result.newlyMatchedCount > 0) {
          audioEffects.playSuccessChime();
          toast.success(
            `⚡ Auto-verified ${result.newlyMatchedCount} newly solved question from LeetCode! Total Campus DSA verified: ${result.matchedCount}`
          );
          if (onSyncSuccess) {
            onSyncSuccess();
          }
        } else if (!options?.isSilent) {
          audioEffects.playSuccessChime();
          if (result.isAccountSwitched) {
            toast.info(
              `Switched to @${result.profile.username}. Roadmap refreshed with ${result.matchedCount} verified problems for this account.`
            );
          } else {
            toast.success(
              `LeetCode profile synced! ${result.matchedCount} Campus DSA problems matched.`
            );
          }
          if (onSyncSuccess) {
            onSyncSuccess();
          }
        }
      } else if (!options?.isSilent) {
        audioEffects.playErrorBuzz();
        const err = result.error || 'Failed to sync LeetCode profile.';
        setErrorMsg(err);
        toast.error(err);
      }
    } catch (err: any) {
      if (!options?.isSilent) {
        audioEffects.playErrorBuzz();
        const msg = err.message || 'An unexpected error occurred while syncing with LeetCode.';
        setErrorMsg(msg);
        toast.error(msg);
      }
    } finally {
      if (!options?.isSilent) setIsSyncing(false);
    }
  };

  const handleDisconnect = () => {
    leetcodeSyncService.unlinkAccount(user?.email);
    setProfile(null);
    setUsernameInput('');
    setIsEditing(false);
    setShowImportBox(false);
    setImportResult(null);
    toast.info('LeetCode account unlinked. Verified questions have been reset.');
    if (onSyncSuccess) {
      onSyncSuccess();
    }
  };

  const handleImportPastSolves = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importInput.trim()) return;

    const res = leetcodeSyncService.importPastSolves(importInput, user?.email);
    if (res.success) {
      audioEffects.playSuccessChime();
      toast.success(
        `✨ Verified ${res.count} Campus DSA problems from your input! (${res.newlyAddedCount} newly added to roadmap)`
      );
      setImportInput('');
      setShowImportBox(false);
      const updated = leetcodeSyncService.getStoredProfile();
      if (updated) setProfile(updated);
      if (onSyncSuccess) onSyncSuccess();
    } else {
      audioEffects.playErrorBuzz();
      setImportResult({ count: 0, error: res.error });
      toast.error(res.error || 'No matching problems found.');
    }
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

      <div className="p-4 sm:p-5 space-y-3">
        {profile && !isEditing ? (
          /* ────────────────────────────────────────────────────────────────────────
              STATE A: CONNECTED PROFILE DASHBOARD
          ──────────────────────────────────────────────────────────────────────── */
          <div className="space-y-4">
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
              <div className="flex items-center justify-between sm:justify-end gap-2.5 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#E9ECEF] dark:border-[#242424] flex-wrap">
                {/* Campus DSA Match Pill */}
                <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#1A1A1A] border border-[#FFA116]/30 shadow-2xs space-y-0.5">
                  <div className="text-[10px] font-display font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#FFA116]" />
                    <span>Roadmap Solved</span>
                  </div>
                  <div className="font-display font-extrabold text-sm sm:text-base text-[#121417] dark:text-white">
                    <span className="text-[#FFA116]">
                      {roadmapSolvedCount !== undefined ? roadmapSolvedCount : profile.verifiedCampusDsaCount}
                    </span>
                    <span className="text-gray-400 text-xs font-normal"> / {ALL_CAMPUS_DSA_PROBLEMS.length} Solved</span>
                  </div>
                  {profile.verifiedCampusDsaCount > 0 && (
                    <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                      {profile.verifiedCampusDsaCount} verified via LC
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleSync(profile.username)}
                    disabled={isSyncing}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-display font-bold bg-[#FFA116] hover:bg-[#E08A00] text-black transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                    title="Pull latest recent accepted submissions from LeetCode"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowImportBox(prev => !prev)}
                    className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl border text-xs font-display font-bold transition-all cursor-pointer shadow-2xs ${
                      showImportBox
                        ? 'bg-purple-500/15 border-purple-500/40 text-purple-700 dark:text-purple-300'
                        : 'bg-white dark:bg-[#1A1A1A] border-[#E9ECEF] dark:border-[#282828] text-gray-700 dark:text-gray-300 hover:border-purple-400'
                    }`}
                    title="Paste earlier problem numbers or URLs from your LeetCode history to verify past solves"
                  >
                    <Upload className="w-3.5 h-3.5 text-purple-500" />
                    <span>Import Solves</span>
                    {showImportBox ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="p-2 rounded-xl border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#1A1A1A] text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-400 text-xs font-medium transition-all cursor-pointer shadow-2xs"
                    title="Change LeetCode handle"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={handleDisconnect}
                    className="p-2 rounded-xl border border-transparent hover:border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/15 text-rose-600 dark:text-rose-400 text-xs font-medium transition-all cursor-pointer"
                    title="Unlink LeetCode account & reset synced progress"
                  >
                    <Unlink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Contextual notice if user has LC solves but public API recent submission window returned 0 */}
            {profile.stats.totalSolved > 0 && profile.verifiedCampusDsaCount === 0 && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-xs text-[#121417] dark:text-white flex items-center gap-1.5">
                    <span>LeetCode Recent Activity Window Notice</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-700 dark:text-amber-300">
                      {profile.stats.totalSolved} Solved on LeetCode
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-gray-600 dark:text-gray-300">
                    You have <strong className="text-[#FFA116]">{profile.stats.totalSolved} solved problems</strong> on LeetCode ({profile.stats.easySolved} Easy, {profile.stats.mediumSolved} Med, {profile.stats.hardSolved} Hard)! 
                    LeetCode's public API only exposes recent submissions (which is currently empty for @{profile.username}).
                    Any new problems you solve on LeetCode will automatically auto-sync here. To quickly verify your earlier solves, click{' '}
                    <button
                      type="button"
                      onClick={() => setShowImportBox(true)}
                      className="font-bold text-[#FFA116] hover:underline cursor-pointer"
                    >
                      Import Solves
                    </button>{' '}
                    to paste problem numbers or URLs, or 1-click <strong>"Mark Solved"</strong> directly on the cards below!
                  </p>
                </div>
              </div>
            )}

            {/* Quick Import Solves Expandable Tray */}
            {showImportBox && (
              <form
                onSubmit={handleImportPastSolves}
                className="p-4 rounded-xl border border-purple-500/30 bg-purple-500/[0.04] dark:bg-purple-950/20 space-y-2.5 animate-fadeIn"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-display font-bold text-[#121417] dark:text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                      <span>Quick Import Past Solved Problems</span>
                    </h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed mt-0.5">
                      LeetCode public API returns your recent 20 submissions. If you've solved earlier questions on LeetCode, paste their LeetCode problem numbers (e.g. <code>1, 26, 88, 283, 121, 15, 11, 75, 42</code>) or URLs below to verify them instantly:
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowImportBox(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs cursor-pointer p-1"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    value={importInput}
                    onChange={e => setImportInput(e.target.value)}
                    placeholder="e.g. 1, 15, 21, 26, 42, 88, 121, 206, 283 or problem URLs"
                    className="flex-1 px-3 py-2 text-xs font-mono rounded-lg border border-purple-500/30 bg-white dark:bg-[#141414] text-[#121417] dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                  />
                  <button
                    type="submit"
                    disabled={!importInput.trim()}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-display font-bold cursor-pointer transition-all shadow-xs disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                  >
                    Verify & Match
                  </button>
                </div>

                {importResult?.error && (
                  <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                    {importResult.error}
                  </p>
                )}
              </form>
            )}

            {/* Transparent Note / Helper Footnote */}
            <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 pt-1 border-t border-[#FFA116]/15 flex-wrap gap-2">
              <span className="flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-[#FFA116]" />
                <span>
                  Auto-sync checks your recent submissions. You can also 1-click <strong>"Mark Solved"</strong> directly on any question card below.
                </span>
              </span>
              <span className="font-mono text-[10px] text-gray-400">
                Synced: {new Date(profile.syncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
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
                  placeholder="Enter username or LeetCode profile URL (e.g. 'tourist', 'leetcode.com/u/lee215')"
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
                  title="Unlink LeetCode account & clear verified progress"
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
