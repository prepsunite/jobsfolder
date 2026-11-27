export const TECH_MAHINDRA_P2 = [
  {
    number: 31,
    title: '5G Cell-Handover Ping-Pong Counter',
    fnName: 'countPingPongHandovers',
    description: 'A mobile UE logs connected cell tower IDs <code>cells</code> every second. A ping-pong handover occurs at index <code>i &gt;= 2</code> if <code>cells[i] == cells[i - 2]</code> and <code>cells[i] != cells[i - 1]</code>. Return total ping-pong handovers.',
    constraints: ['1 <= cells.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'cells = [1, 2, 1, 2, 3]', output: '2' },
      { title: 'Test Case 2', input: 'cells = [1, 1, 1, 1]', output: '0' },
      { title: 'Test Case 3', input: 'cells = [1, 2, 3, 4]', output: '0' },
      { title: 'Test Case 4', input: 'cells = [5, 9, 5]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countPingPongHandovers(int[] cells) {
        int cnt = 0;
        for (int i = 2; i < cells.length; i++) if (cells[i] == cells[i - 2] && cells[i] != cells[i - 1]) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countPingPongHandovers(cells):
    return sum(1 for i in range(2, len(cells)) if cells[i] == cells[i-2] and cells[i] != cells[i-1])`
  },
  {
    number: 32,
    title: 'VoLTE Call-Drop Burst Window',
    fnName: 'hasCallDropBurst',
    description: 'Given call status flags <code>calls</code> (<code>1</code> = completed, <code>0</code> = dropped), return <code>true</code> if ANY window of <code>k</code> consecutive calls has at least <code>m</code> dropped calls.',
    constraints: ['1 <= m <= k <= calls.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'calls = [1, 0, 1, 0, 0, 1], k = 3, m = 2', output: 'true' },
      { title: 'Test Case 2', input: 'calls = [1, 0, 1, 1, 0], k = 3, m = 2', output: 'false' },
      { title: 'Test Case 3', input: 'calls = [0, 0], k = 2, m = 2', output: 'true' },
      { title: 'Test Case 4', input: 'calls = [1, 1, 1], k = 2, m = 1', output: 'false' }
    ],
    javaSolution: `public class Solution {
    public static boolean hasCallDropBurst(int[] calls, int k, int m) {
        int drops = 0;
        for (int i = 0; i < calls.length; i++) {
            if (calls[i] == 0) drops++;
            if (i >= k && calls[i - k] == 0) drops--;
            if (i >= k - 1 && drops >= m) return true;
        }
        return false;
    }
}`,
    pythonSolution: `def hasCallDropBurst(calls, k, m):
    drops = 0
    for i, c in enumerate(calls):
        if c == 0: drops += 1
        if i >= k and calls[i - k] == 0: drops -= 1
        if i >= k - 1 and drops >= m: return True
    return False`
  },
  {
    number: 33,
    title: 'Base-Station Eco Sleep Hours',
    fnName: 'countEcoSleepHours',
    description: 'A 5G base station enters low-power sleep during any hour where active users <code>users[h] &lt;= threshold</code> AND the previous hour also had <code>&lt;= threshold</code> (or it is hour 0). Return total sleep hours.',
    constraints: ['1 <= users.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'users = [5, 4, 20, 3, 2, 1], threshold = 5', output: '4' },
      { title: 'Test Case 2', input: 'users = [10, 2, 10, 2], threshold = 5', output: '0' },
      { title: 'Test Case 3', input: 'users = [0, 0, 0], threshold = 0', output: '3' },
      { title: 'Test Case 4', input: 'users = [100], threshold = 10', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countEcoSleepHours(int[] users, int threshold) {
        int sleep = 0;
        for (int i = 0; i < users.length; i++) {
            if (users[i] <= threshold && (i == 0 || users[i - 1] <= threshold)) sleep++;
        }
        return sleep;
    }
}`,
    pythonSolution: `def countEcoSleepHours(users, threshold):
    return sum(1 for i, u in enumerate(users) if u <= threshold and (i == 0 or users[i - 1] <= threshold))`
  },
  {
    number: 34,
    title: 'Roaming Data-Cap Throttling Day',
    fnName: 'dayDataThrottled',
    description: 'A roaming pack includes <code>capMB</code> high-speed data. Given daily data usage <code>dailyMB</code>, return the 0-based day index when cumulative usage strictly exceeds <code>capMB</code> (or <code>-1</code> if never exceeded).',
    constraints: ['1 <= dailyMB.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'dailyMB = [300, 400, 500, 200], capMB = 1000', output: '2' },
      { title: 'Test Case 2', input: 'dailyMB = [500, 500], capMB = 1000', output: '-1' },
      { title: 'Test Case 3', input: 'dailyMB = [101], capMB = 100', output: '0' },
      { title: 'Test Case 4', input: 'dailyMB = [10, 20, 30], capMB = 100', output: '-1' }
    ],
    javaSolution: `public class Solution {
    public static int dayDataThrottled(int[] dailyMB, long capMB) {
        long s = 0;
        for (int i = 0; i < dailyMB.length; i++) { s += dailyMB[i]; if (s > capMB) return i; }
        return -1;
    }
}`,
    pythonSolution: `def dayDataThrottled(dailyMB, capMB):
    s = 0
    for i, d in enumerate(dailyMB):
        s += d
        if s > capMB: return i
    return -1`
  },
  {
    number: 35,
    title: 'Fiber Splice Attenuation Budget',
    fnName: 'isFiberLinkViable',
    description: 'An optical fiber link of <code>lengthKm</code> km has <code>splices</code> splices. Total signal loss in dB*100 (integer) is <code>lengthKm * lossPerKm + splices * spliceLoss</code>. Return <code>true</code> if total loss <code>&lt;= maxBudget</code>.',
    constraints: ['0 <= lengthKm, splices <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'lengthKm = 10, lossPerKm = 35, splices = 4, spliceLoss = 10, maxBudget = 400', output: 'true' },
      { title: 'Test Case 2', input: 'lengthKm = 20, lossPerKm = 35, splices = 5, spliceLoss = 15, maxBudget = 700', output: 'false' },
      { title: 'Test Case 3', input: 'lengthKm = 0, splices = 0, lossPerKm = 30, spliceLoss = 10, maxBudget = 0', output: 'true' },
      { title: 'Test Case 4', input: 'lengthKm = 5, lossPerKm = 40, splices = 2, spliceLoss = 50, maxBudget = 300', output: 'true' }
    ],
    javaSolution: `public class Solution {
    public static boolean isFiberLinkViable(int lengthKm, int lossPerKm, int splices, int spliceLoss, int maxBudget) {
        return (long) lengthKm * lossPerKm + (long) splices * spliceLoss <= maxBudget;
    }
}`,
    pythonSolution: `def isFiberLinkViable(lengthKm, lossPerKm, splices, spliceLoss, maxBudget):
    return lengthKm * lossPerKm + splices * spliceLoss <= maxBudget`
  },
  {
    number: 36,
    title: 'SMS Gateway Multipart Segment Counter',
    fnName: 'countSmsSegments',
    description: 'An SMS gateway sends messages <code>msgs</code>. Messages of length <code>&lt;= 160</code> use 1 segment; longer messages split into chunks of <code>153</code> characters each (<code>ceil(len / 153)</code>). Return total segments across all messages.',
    constraints: ['1 <= msgs.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'msgs = [50, 160, 161, 306]', output: '6' },
      { title: 'Test Case 2', input: 'msgs = [10, 20]', output: '2' },
      { title: 'Test Case 3', input: 'msgs = [307]', output: '3' },
      { title: 'Test Case 4', input: 'msgs = [1]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countSmsSegments(int[] msgs) {
        int seg = 0;
        for (int len : msgs) seg += (len <= 160) ? 1 : (len + 152) / 153;
        return seg;
    }
}`,
    pythonSolution: `def countSmsSegments(msgs):
    return sum(1 if l <= 160 else (l + 152) // 153 for l in msgs)`
  },
  {
    number: 37,
    title: 'Packet Jitter Max Inter-Arrival Delta',
    fnName: 'maxPacketJitter',
    description: 'Given sorted packet arrival timestamps <code>times</code> (at least 2 packets), inter-arrival gaps are <code>gap[i] = times[i] - times[i-1]</code>. Jitter is defined as <code>max(gap) - min(gap)</code> (0 if fewer than 2 gaps). Return jitter.',
    constraints: ['2 <= times.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'times = [10, 20, 35, 45, 70]', output: '15' },
      { title: 'Test Case 2', input: 'times = [0, 10, 20, 30]', output: '0' },
      { title: 'Test Case 3', input: 'times = [5, 15]', output: '0' },
      { title: 'Test Case 4', input: 'times = [0, 1, 101]', output: '99' }
    ],
    javaSolution: `public class Solution {
    public static int maxPacketJitter(int[] times) {
        if (times.length < 3) return 0;
        int mn = Integer.MAX_VALUE, mx = Integer.MIN_VALUE;
        for (int i = 1; i < times.length; i++) {
            int g = times[i] - times[i - 1];
            mn = Math.min(mn, g); mx = Math.max(mx, g);
        }
        return mx - mn;
    }
}`,
    pythonSolution: `def maxPacketJitter(times):
    if len(times) < 3: return 0
    gaps = [times[i] - times[i - 1] for i in range(1, len(times))]
    return max(gaps) - min(gaps)`
  },
  {
    number: 38,
    title: 'Spectrum-Band Guard Interference Check',
    fnName: 'countInterferingBands',
    description: 'Sorted allocated frequency centers <code>freqs</code> must maintain a minimum guard separation of <code>minGap</code> between adjacent channels. Return how many adjacent pairs violate <code>freqs[i] - freqs[i-1] &lt; minGap</code>.',
    constraints: ['1 <= freqs.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'freqs = [100, 115, 140, 150, 200], minGap = 20', output: '2' },
      { title: 'Test Case 2', input: 'freqs = [10, 30, 50], minGap = 20', output: '0' },
      { title: 'Test Case 3', input: 'freqs = [100], minGap = 10', output: '0' },
      { title: 'Test Case 4', input: 'freqs = [1, 2, 3, 4], minGap = 5', output: '3' }
    ],
    javaSolution: `public class Solution {
    public static int countInterferingBands(int[] freqs, int minGap) {
        int bad = 0;
        for (int i = 1; i < freqs.length; i++) if (freqs[i] - freqs[i - 1] < minGap) bad++;
        return bad;
    }
}`,
    pythonSolution: `def countInterferingBands(freqs, minGap):
    return sum(1 for i in range(1, len(freqs)) if freqs[i] - freqs[i - 1] < minGap)`
  },
  {
    number: 39,
    title: 'OSS Alarm Root-Cause Suppression',
    fnName: 'countUnresolvedAlarms',
    description: 'An OSS monitor receives <code>events</code> <code>[timestamp, deviceId, state]</code> where <code>state == 1</code> raises an alarm and <code>state == 0</code> clears it. Return how many devices still have an active alarm at the end.',
    constraints: ['1 <= events.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'events = [[1, 10, 1], [2, 20, 1], [3, 10, 0], [4, 30, 1]]', output: '2' },
      { title: 'Test Case 2', input: 'events = [[1, 5, 1], [2, 5, 0]]', output: '0' },
      { title: 'Test Case 3', input: 'events = [[1, 5, 0]]', output: '0' },
      { title: 'Test Case 4', input: 'events = [[1, 1, 1], [2, 1, 1]]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countUnresolvedAlarms(int[][] events) {
        Set<Integer> active = new HashSet<>();
        for (int[] e : events) {
            if (e[2] == 1) active.add(e[1]);
            else active.remove(e[1]);
        }
        return active.size();
    }
}`,
    pythonSolution: `def countUnresolvedAlarms(events):
    active = set()
    for _, dev, st in events:
        if st == 1: active.add(dev)
        else: active.discard(dev)
    return len(active)`
  },
  {
    number: 40,
    title: 'Connected-Car Geofence Breach Counter',
    fnName: 'countGeofenceBreaches',
    description: 'A connected vehicle reports <code>(x, y)</code> coordinates <code>coords</code>. A geofence circle is centered at <code>(0, 0)</code> with radius <code>R</code> (inside if <code>x^2 + y^2 &lt;= R^2</code>). Return how many coordinates fall strictly outside the geofence.',
    constraints: ['1 <= coords.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'coords = [[0, 0], [3, 4], [4, 4], [5, 0]], R = 5', output: '1' },
      { title: 'Test Case 2', input: 'coords = [[1, 1], [2, 2]], R = 1', output: '2' },
      { title: 'Test Case 3', input: 'coords = [[0, 5]], R = 5', output: '0' },
      { title: 'Test Case 4', input: 'coords = [[0, 0]], R = 0', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countGeofenceBreaches(int[][] coords, long R) {
        long r2 = R * R;
        int out = 0;
        for (int[] p : coords) if ((long) p[0] * p[0] + (long) p[1] * p[1] > r2) out++;
        return out;
    }
}`,
    pythonSolution: `def countGeofenceBreaches(coords, R):
    r2 = R * R
    return sum(1 for x, y in coords if x * x + y * y > r2)`
  },
  {
    number: 41,
    title: 'CDR Duplicate Call Deduplicator',
    fnName: 'countUniqueCdrs',
    description: 'Call Detail Records arrive as <code>cdrs</code> <code>[callerId, calleeId, startSec]</code>. Due to tower handoffs, identical triples may be logged twice. Return the number of unique calls.',
    constraints: ['1 <= cdrs.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'cdrs = [[1, 2, 100], [1, 2, 100], [2, 1, 100]]', output: '2' },
      { title: 'Test Case 2', input: 'cdrs = [[5, 6, 10], [5, 6, 10]]', output: '1' },
      { title: 'Test Case 3', input: 'cdrs = [[1, 2, 1], [1, 2, 2]]', output: '2' },
      { title: 'Test Case 4', input: 'cdrs = [[9, 8, 7]]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countUniqueCdrs(int[][] cdrs) {
        Set<String> s = new HashSet<>();
        for (int[] c : cdrs) s.add(c[0] + ":" + c[1] + ":" + c[2]);
        return s.size();
    }
}`,
    pythonSolution: `def countUniqueCdrs(cdrs):
    return len({tuple(c) for c in cdrs})`
  },
  {
    number: 42,
    title: 'Network-Slice Bandwidth Admission',
    fnName: 'countAdmittedSlices',
    description: 'A 5G core link has total capacity <code>capMbps</code>. Slice requests <code>reqs</code> arrive in order; each request is admitted if remaining capacity <code>&gt;= reqs[i]</code> (subtracting it from remaining capacity). Return count of admitted slices.',
    constraints: ['1 <= reqs.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'reqs = [400, 300, 500, 200], capMbps = 1000', output: '3' },
      { title: 'Test Case 2', input: 'reqs = [600, 600], capMbps = 500', output: '0' },
      { title: 'Test Case 3', input: 'reqs = [250, 250], capMbps = 500', output: '2' },
      { title: 'Test Case 4', input: 'reqs = [100], capMbps = 100', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countAdmittedSlices(int[] reqs, long capMbps) {
        long rem = capMbps;
        int cnt = 0;
        for (int r : reqs) if (rem >= r) { rem -= r; cnt++; }
        return cnt;
    }
}`,
    pythonSolution: `def countAdmittedSlices(reqs, capMbps):
    rem, cnt = capMbps, 0
    for r in reqs:
        if rem >= r: rem -= r; cnt += 1
    return cnt`
  },
  {
    number: 43,
    title: 'BGP AS-Path Loop Detector',
    fnName: 'countLoopingRoutes',
    description: 'A BGP router rejects any route announcement whose AS-path contains duplicate AS numbers (a routing loop). Given <code>paths</code> (array of AS-number arrays), return how many announcements are rejected.',
    constraints: ['1 <= paths.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'paths = [[65001, 65002, 65001], [65001, 65003], [100, 200, 300, 200]]', output: '2' },
      { title: 'Test Case 2', input: 'paths = [[1, 2, 3]]', output: '0' },
      { title: 'Test Case 3', input: 'paths = [[10, 10]]', output: '1' },
      { title: 'Test Case 4', input: 'paths = [[42]]', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countLoopingRoutes(int[][] paths) {
        int rej = 0;
        for (int[] p : paths) {
            Set<Integer> s = new HashSet<>();
            for (int as : p) if (!s.add(as)) { rej++; break; }
        }
        return rej;
    }
}`,
    pythonSolution: `def countLoopingRoutes(paths):
    return sum(1 for p in paths if len(set(p)) < len(p))`
  },
  {
    number: 44,
    title: 'WiFi Mesh Minimum Channel Hops',
    fnName: 'countChannelSwitches',
    description: 'A roaming client logs AP channel numbers <code>channels</code> at each hop. Return how many times the client switched to a different channel than the previous hop.',
    constraints: ['1 <= channels.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'channels = [1, 1, 6, 6, 11, 1]', output: '3' },
      { title: 'Test Case 2', input: 'channels = [36, 36, 36]', output: '0' },
      { title: 'Test Case 3', input: 'channels = [1, 6, 11]', output: '2' },
      { title: 'Test Case 4', input: 'channels = [6]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countChannelSwitches(int[] channels) {
        int sw = 0;
        for (int i = 1; i < channels.length; i++) if (channels[i] != channels[i - 1]) sw++;
        return sw;
    }
}`,
    pythonSolution: `def countChannelSwitches(channels):
    return sum(1 for i in range(1, len(channels)) if channels[i] != channels[i - 1])`
  },
  {
    number: 45,
    title: 'Prepaid Validity Stacking Expiry',
    fnName: 'finalValidityEndDay',
    description: 'A telecom user starts with plan valid until <code>curEnd</code> and buys recharge packs <code>packs</code> <code>[buyDay, validityDays]</code> sorted by <code>buyDay</code>. If <code>buyDay &lt;= curEnd</code>, validity extends by <code>validityDays</code> from <code>curEnd</code>; if <code>buyDay &gt; curEnd</code>, validity becomes <code>buyDay + validityDays</code>. Return final expiry day.',
    constraints: ['1 <= packs.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'curEnd = 10, packs = [[5, 28], [40, 28]]', output: '68' },
      { title: 'Test Case 2', input: 'curEnd = 10, packs = [[5, 30], [20, 30]]', output: '70' },
      { title: 'Test Case 3', input: 'curEnd = 0, packs = [[1, 30]]', output: '31' },
      { title: 'Test Case 4', input: 'curEnd = 10, packs = [[10, 15]]', output: '25' }
    ],
    javaSolution: `public class Solution {
    public static long finalValidityEndDay(long curEnd, int[][] packs) {
        for (int[] p : packs) {
            if (p[0] <= curEnd) curEnd += p[1];
            else curEnd = (long) p[0] + p[1];
        }
        return curEnd;
    }
}`,
    pythonSolution: `def finalValidityEndDay(curEnd, packs):
    for buy, days in packs:
        curEnd = curEnd + days if buy <= curEnd else buy + days
    return curEnd`
  },
  {
    number: 46,
    title: 'eSIM Profile Slot Switcher',
    fnName: 'activeProfileAtEnd',
    description: 'A phone has <code>k</code> eSIM slots (0..k-1) initially holding profiles <code>0..k-1</code>, with slot 0 active. Commands <code>cmds</code> are <code>["SWITCH", slot]</code> or <code>["LOAD", slot, profileId]</code>. Return the active profile ID after all commands.',
    constraints: ['1 <= k <= 100', '1 <= cmds.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'k = 2, cmds = [["LOAD", 1, 99], ["SWITCH", 1]]', output: '99' },
      { title: 'Test Case 2', input: 'k = 3, cmds = [["SWITCH", 2], ["LOAD", 2, 50]]', output: '50' },
      { title: 'Test Case 3', input: 'k = 2, cmds = [["LOAD", 1, 77], ["SWITCH", 0]]', output: '0' },
      { title: 'Test Case 4', input: 'k = 1, cmds = [["LOAD", 0, 42]]', output: '42' }
    ],
    javaSolution: `public class Solution {
    public static int activeProfileAtEnd(int k, String[][] cmds) {
        int[] slots = new int[k];
        for (int i = 0; i < k; i++) slots[i] = i;
        int active = 0;
        for (String[] c : cmds) {
            if (c[0].equals("SWITCH")) active = Integer.parseInt(c[1]);
            else slots[Integer.parseInt(c[1])] = Integer.parseInt(c[2]);
        }
        return slots[active];
    }
}`,
    pythonSolution: `def activeProfileAtEnd(k, cmds):
    slots = list(range(k))
    active = 0
    for c in cmds:
        if c[0] == 'SWITCH': active = int(c[1])
        else: slots[int(c[1])] = int(c[2])
    return slots[active]`
  },
  {
    number: 47,
    title: 'OTDR Fiber-Fault Distance Finder',
    fnName: 'firstFaultDistanceMeters',
    description: 'An OTDR pulse measures signal reflection at every 100m in <code>reflections</code>. Normal attenuation is <code>&lt;= thresh</code>; the first index where <code>reflections[i] &gt; thresh</code> indicates a fiber break at <code>(i + 1) * 100</code> meters. Return break distance, or <code>-1</code> if no fault.',
    constraints: ['1 <= reflections.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'reflections = [10, 12, 11, 85, 10], thresh = 30', output: '400' },
      { title: 'Test Case 2', input: 'reflections = [5, 10, 15], thresh = 20', output: '-1' },
      { title: 'Test Case 3', input: 'reflections = [50], thresh = 10', output: '100' },
      { title: 'Test Case 4', input: 'reflections = [30, 31], thresh = 30', output: '200' }
    ],
    javaSolution: `public class Solution {
    public static int firstFaultDistanceMeters(int[] reflections, int thresh) {
        for (int i = 0; i < reflections.length; i++) if (reflections[i] > thresh) return (i + 1) * 100;
        return -1;
    }
}`,
    pythonSolution: `def firstFaultDistanceMeters(reflections, thresh):
    for i, r in enumerate(reflections):
        if r > thresh: return (i + 1) * 100
    return -1`
  },
  {
    number: 48,
    title: 'Cell-Tower Sector Load Imbalance',
    fnName: 'countOverloadedTowers',
    description: 'Each 3-sector tower has sector user counts <code>[s1, s2, s3]</code>. A tower needs re-azimuth tuning if <code>max(s1,s2,s3) - min(s1,s2,s3) &gt; maxDiff</code>. Given <code>towers</code>, return how many towers need tuning.',
    constraints: ['1 <= towers.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'towers = [[10, 12, 11], [50, 10, 20], [30, 30, 30]], maxDiff = 15', output: '1' },
      { title: 'Test Case 2', input: 'towers = [[100, 0, 50]], maxDiff = 50', output: '1' },
      { title: 'Test Case 3', input: 'towers = [[20, 25, 30]], maxDiff = 10', output: '0' },
      { title: 'Test Case 4', input: 'towers = [[0, 0, 0]], maxDiff = 0', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countOverloadedTowers(int[][] towers, int maxDiff) {
        int bad = 0;
        for (int[] t : towers) {
            int mx = Math.max(t[0], Math.max(t[1], t[2]));
            int mn = Math.min(t[0], Math.min(t[1], t[2]));
            if (mx - mn > maxDiff) bad++;
        }
        return bad;
    }
}`,
    pythonSolution: `def countOverloadedTowers(towers, maxDiff):
    return sum(1 for t in towers if max(t) - min(t) > maxDiff)`
  },
  {
    number: 49,
    title: 'MIMO Beam-Switch Overhead',
    fnName: 'totalBeamSwitchLatency',
    description: 'A 5G receiver switches beams along sequence <code>beams</code>. Staying on the same beam costs 0 ms; switching to a different beam costs <code>abs(beams[i] - beams[i-1]) * stepMs</code> ms. Return total switching latency.',
    constraints: ['1 <= beams.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'beams = [1, 1, 4, 2], stepMs = 5', output: '25' },
      { title: 'Test Case 2', input: 'beams = [3, 3, 3], stepMs = 10', output: '0' },
      { title: 'Test Case 3', input: 'beams = [0, 5], stepMs = 2', output: '10' },
      { title: 'Test Case 4', input: 'beams = [7], stepMs = 100', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long totalBeamSwitchLatency(int[] beams, int stepMs) {
        long ms = 0;
        for (int i = 1; i < beams.length; i++) ms += Math.abs((long) beams[i] - beams[i - 1]) * stepMs;
        return ms;
    }
}`,
    pythonSolution: `def totalBeamSwitchLatency(beams, stepMs):
    return sum(abs(beams[i] - beams[i - 1]) * stepMs for i in range(1, len(beams)))`
  },
  {
    number: 50,
    title: 'SIM IMSI Carrier Prefix Counter',
    fnName: 'countByHomeCarrier',
    description: 'Mobile subscriber IMSI strings start with a 5-digit MCC+MNC prefix. Given an array <code>imsis</code> and target <code>homePrefix</code>, return how many subscribers belong to the home carrier.',
    constraints: ['1 <= imsis.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'imsis = ["4041012345", "4042099999", "4041055555"], homePrefix = "40410"', output: '2' },
      { title: 'Test Case 2', input: 'imsis = ["3102600001"], homePrefix = "40410"', output: '0' },
      { title: 'Test Case 3', input: 'imsis = ["4050111111", "4050122222"], homePrefix = "40501"', output: '2' },
      { title: 'Test Case 4', input: 'imsis = ["404"], homePrefix = "40410"', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countByHomeCarrier(String[] imsis, String homePrefix) {
        int cnt = 0;
        for (String s : imsis) if (s.startsWith(homePrefix)) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countByHomeCarrier(imsis, homePrefix):
    return sum(1 for s in imsis if s.startswith(homePrefix))`
  }
];
