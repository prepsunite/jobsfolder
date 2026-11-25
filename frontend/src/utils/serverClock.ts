// Monotonic Server Clock Utility
// Anchors to server UTC timestamp + performance.now() so OS wall-clock
// rollback/forward tampering cannot extend mock exam timers or unlock reviews early.

const CLOCK_STORAGE_KEY = 'prepunite_server_clock_anchor_v1';

interface ClockAnchor {
  serverMs: number;
  perfMs: number;
  syncedAtWallMs: number;
}

let anchor: ClockAnchor | null = null;
let syncPromise: Promise<number> | null = null;

function persistAnchor(next: ClockAnchor) {
  try {
    sessionStorage.setItem(CLOCK_STORAGE_KEY, JSON.stringify(next));
  } catch {}
}

export function setServerNowMs(serverMs: number): void {
  if (!Number.isFinite(serverMs) || serverMs <= 0) return;
  const nowPerf = typeof performance !== 'undefined' ? performance.now() : 0;

  // Enforce monotonicity if clock already anchored within this tab session
  const currentEst = anchor ? anchor.serverMs + Math.max(0, nowPerf - anchor.perfMs) : 0;
  const clampedMs = Math.max(Math.round(serverMs), Math.round(currentEst));

  anchor = {
    serverMs: clampedMs,
    perfMs: nowPerf,
    syncedAtWallMs: Date.now(),
  };
  persistAnchor(anchor);
}

export function hasServerClockSync(): boolean {
  return anchor !== null;
}

export function getServerNowMs(): number {
  if (!anchor) {
    return Date.now();
  }
  const nowPerf = typeof performance !== 'undefined' ? performance.now() : 0;
  const elapsedPerf = Math.max(0, nowPerf - anchor.perfMs);
  return Math.round(anchor.serverMs + elapsedPerf);
}

export function getServerDate(): Date {
  return new Date(getServerNowMs());
}

/**
 * Queries Postgres `get_server_timestamp` RPC once per call window using RTT/2 compensation.
 * Falls back gracefully without overriding any already-anchored monotonic clock.
 */
export async function syncServerClock(supabaseClient?: { rpc: (fn: string) => any }): Promise<number> {
  if (syncPromise) return syncPromise;

  syncPromise = (async () => {
    try {
      if (supabaseClient && typeof supabaseClient.rpc === 'function') {
        const t0 = typeof performance !== 'undefined' ? performance.now() : Date.now();
        const { data, error } = await supabaseClient.rpc('get_server_timestamp');
        const t1 = typeof performance !== 'undefined' ? performance.now() : Date.now();
        if (!error && data) {
          const parsedMs = Date.parse(String(data));
          if (Number.isFinite(parsedMs) && parsedMs > 0) {
            const rttHalf = Math.max(0, Math.min(5000, Math.round((t1 - t0) / 2)));
            setServerNowMs(parsedMs + rttHalf);
            return getServerNowMs();
          }
        }
      }
    } catch {}
    return getServerNowMs();
  })().finally(() => {
    syncPromise = null;
  });

  return syncPromise;
}

/**
 * Pure helper for testing / resetting internal anchor in unit checks.
 */
export function _resetServerClockForTest(): void {
  anchor = null;
  syncPromise = null;
}
