export const KPIT_QUESTIONS = [
  {
    number: 1,
    title: 'EV Battery BMS Cell Balance',
    fnName: 'countImbalancedCells',
    description: 'In a KPIT EV Battery Management System, cell voltages <code>mv</code> (millivolts) are balanced if within <code>tol</code> of the minimum cell voltage <code>min(mv)</code>. Return how many cells exceed <code>min(mv) + tol</code>.',
    constraints: ['1 <= mv.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'mv = [3600, 3620, 3680, 3700], tol = 50', output: '2' },
      { title: 'Test Case 2', input: 'mv = [3500, 3520], tol = 30', output: '0' },
      { title: 'Test Case 3', input: 'mv = [4000], tol = 0', output: '0' },
      { title: 'Test Case 4', input: 'mv = [3000, 3100, 3200], tol = 100', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countImbalancedCells(int[] mv, int tol) {
        int mn = mv[0];
        for (int v : mv) mn = Math.min(mn, v);
        int bad = 0;
        for (int v : mv) if (v > mn + tol) bad++;
        return bad;
    }
}`,
    pythonSolution: `def countImbalancedCells(mv, tol):
    mn = min(mv)
    return sum(1 for v in mv if v > mn + tol)`
  },
  {
    number: 2,
    title: 'CAN-Bus Frame ID Filter',
    fnName: 'countMatchingCanFrames',
    description: 'Given 11-bit CAN frame IDs <code>ids</code>, hardware acceptance mask <code>mask</code>, and filter <code>filt</code>, a frame is accepted if <code>(id &amp; mask) == (filt &amp; mask)</code>. Return count of accepted frames.',
    constraints: ['1 <= ids.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'ids = [256, 257, 260, 512], mask = 2040, filt = 256', output: '3' },
      { title: 'Test Case 2', input: 'ids = [1, 2, 3], mask = 0, filt = 5', output: '3' },
      { title: 'Test Case 3', input: 'ids = [10, 20], mask = 255, filt = 30', output: '0' },
      { title: 'Test Case 4', input: 'ids = [100], mask = 127, filt = 100', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countMatchingCanFrames(int[] ids, int mask, int filt) {
        int target = filt & mask, cnt = 0;
        for (int id : ids) if ((id & mask) == target) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countMatchingCanFrames(ids, mask, filt):
    t = filt & mask
    return sum(1 for i in ids if (i & mask) == t)`
  },
  {
    number: 3,
    title: 'ADAS Radar Obstacle Warning',
    fnName: 'countCriticalObstacles',
    description: 'Given obstacle distances <code>dist</code> (meters) and closing speeds <code>speed</code> (m/s), an obstacle is critical if <code>speed[i] > 0</code> and <code>dist[i] <= speed[i] * ttc</code> (time-to-collision threshold). Count critical obstacles.',
    constraints: ['1 <= dist.length == speed.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'dist = [20, 50, 10], speed = [10, 10, 0], ttc = 3', output: '1' },
      { title: 'Test Case 2', input: 'dist = [30, 40], speed = [10, 10], ttc = 4', output: '2' },
      { title: 'Test Case 3', input: 'dist = [100], speed = [5], ttc = 2', output: '0' },
      { title: 'Test Case 4', input: 'dist = [15], speed = [5], ttc = 3', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countCriticalObstacles(int[] dist, int[] speed, int ttc) {
        int cnt = 0;
        for (int i = 0; i < dist.length; i++) if (speed[i] > 0 && dist[i] <= (long) speed[i] * ttc) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countCriticalObstacles(dist, speed, ttc):
    return sum(1 for d, s in zip(dist, speed) if s > 0 and d <= s * ttc)`
  },
  {
    number: 4,
    title: 'Regenerative Braking Energy Sum',
    fnName: 'totalRegenEnergy',
    description: 'Given wheel speed changes <code>deltas</code> (negative = braking, positive = accelerating), braking recovers <code>effPct</code>% (integer floor) of <code>-deltas[i]</code>. Return total recovered energy.',
    constraints: ['1 <= deltas.length <= 10^5', '0 <= effPct <= 100'],
    testCases: [
      { title: 'Test Case 1', input: 'deltas = [-100, 50, -40], effPct = 50', output: '70' },
      { title: 'Test Case 2', input: 'deltas = [10, 20, 30], effPct = 80', output: '0' },
      { title: 'Test Case 3', input: 'deltas = [-200], effPct = 25', output: '50' },
      { title: 'Test Case 4', input: 'deltas = [-9], effPct = 10', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long totalRegenEnergy(int[] deltas, int effPct) {
        long rec = 0;
        for (int d : deltas) if (d < 0) rec += ((long) (-d) * effPct) / 100;
        return rec;
    }
}`,
    pythonSolution: `def totalRegenEnergy(deltas, effPct):
    return sum(((-d) * effPct) // 100 for d in deltas if d < 0)`
  },
  {
    number: 5,
    title: 'AUTOSAR Task Cyclic Overruns',
    fnName: 'countSlotOverruns',
    description: 'Given periodic ECU task execution times <code>execUs</code> and fixed slot budget <code>budgetUs</code>, return how many tasks exceed <code>budgetUs</code>.',
    constraints: ['1 <= execUs.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'execUs = [800, 1200, 1000, 1050], budgetUs = 1000', output: '2' },
      { title: 'Test Case 2', input: 'execUs = [500, 600], budgetUs = 1000', output: '0' },
      { title: 'Test Case 3', input: 'execUs = [1001], budgetUs = 1000', output: '1' },
      { title: 'Test Case 4', input: 'execUs = [100], budgetUs = 100', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countSlotOverruns(int[] execUs, int budgetUs) {
        int bad = 0;
        for (int x : execUs) if (x > budgetUs) bad++;
        return bad;
    }
}`,
    pythonSolution: `def countSlotOverruns(execUs, budgetUs):
    return sum(1 for x in execUs if x > budgetUs)`
  },
  {
    number: 6,
    title: 'ECU Diagnostic DTC Bitmask',
    fnName: 'countActiveFaultCodes',
    description: 'Each ECU subsystem reports a 16-bit DTC fault mask in <code>masks</code>. Return total active fault bits across all subsystems.',
    constraints: ['1 <= masks.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'masks = [3, 5, 0, 7]', output: '7' },
      { title: 'Test Case 2', input: 'masks = [0, 0]', output: '0' },
      { title: 'Test Case 3', input: 'masks = [255]', output: '8' },
      { title: 'Test Case 4', input: 'masks = [1, 2, 4]', output: '3' }
    ],
    javaSolution: `public class Solution {
    public static int countActiveFaultCodes(int[] masks) {
        int cnt = 0;
        for (int m : masks) cnt += Integer.bitCount(m);
        return cnt;
    }
}`,
    pythonSolution: `def countActiveFaultCodes(masks):
    return sum(m.bit_count() for m in masks)`
  },
  {
    number: 7,
    title: 'EV Charging Route Minimum Stops',
    fnName: 'minEvChargeStops',
    description: 'An EV must drive <code>dist</code> km starting with <code>range</code> km charge. Sorted fast chargers sit at <code>chargers</code> (each recharges to full <code>range</code>). Return minimum stops, or <code>-1</code> if unreachable.',
    constraints: ['0 <= chargers.length <= 10^5', '1 <= range <= dist <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'dist = 300, range = 120, chargers = [100, 200, 250]', output: '2' },
      { title: 'Test Case 2', input: 'dist = 200, range = 80, chargers = [90, 150]', output: '-1' },
      { title: 'Test Case 3', input: 'dist = 100, range = 100, chargers = []', output: '0' },
      { title: 'Test Case 4', input: 'dist = 150, range = 50, chargers = [50, 100]', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int minEvChargeStops(int dist, int range, int[] chargers) {
        int reach = range, stops = 0, i = 0;
        while (reach < dist) {
            int best = -1;
            while (i < chargers.length && chargers[i] <= reach) { best = chargers[i]; i++; }
            if (best == -1) return -1;
            reach = best + range; stops++;
        }
        return stops;
    }
}`,
    pythonSolution: `def minEvChargeStops(dist, range, chargers):
    reach, stops, i = range, 0, 0
    while reach < dist:
        best = -1
        while i < len(chargers) and chargers[i] <= reach:
            best = chargers[i]; i += 1
        if best == -1: return -1
        reach = best + range; stops += 1
    return stops`
  },
  {
    number: 8,
    title: 'Sensor Moving Average Anomaly',
    fnName: 'countWindowSpikes',
    description: 'Given sensor readings <code>vals</code>, count indices <code>i >= 2</code> where <code>vals[i] > (vals[i-1] + vals[i-2])</code>.',
    constraints: ['1 <= vals.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'vals = [2, 3, 6, 4, 15]', output: '2' },
      { title: 'Test Case 2', input: 'vals = [10, 10, 10]', output: '0' },
      { title: 'Test Case 3', input: 'vals = [1, 2]', output: '0' },
      { title: 'Test Case 4', input: 'vals = [1, 1, 3]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countWindowSpikes(int[] vals) {
        int cnt = 0;
        for (int i = 2; i < vals.length; i++) if ((long) vals[i] > (long) vals[i-1] + vals[i-2]) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countWindowSpikes(vals):
    return sum(1 for i in range(2, len(vals)) if vals[i] > vals[i-1] + vals[i-2])`
  },
  {
    number: 9,
    title: 'Cruise Control Speed Clamping',
    fnName: 'clampedSpeedSum',
    description: 'Given target speeds <code>speeds</code>, clamp each into <code>[minSpd, maxSpd]</code> and return total sum.',
    constraints: ['1 <= speeds.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'speeds = [10, 60, 130], minSpd = 30, maxSpd = 100', output: '190' },
      { title: 'Test Case 2', input: 'speeds = [50, 80], minSpd = 40, maxSpd = 90', output: '130' },
      { title: 'Test Case 3', input: 'speeds = [0], minSpd = 20, maxSpd = 50', output: '20' },
      { title: 'Test Case 4', input: 'speeds = [200], minSpd = 20, maxSpd = 80', output: '80' }
    ],
    javaSolution: `public class Solution {
    public static long clampedSpeedSum(int[] speeds, int minSpd, int maxSpd) {
        long s = 0;
        for (int v : speeds) s += Math.max(minSpd, Math.min(maxSpd, v));
        return s;
    }
}`,
    pythonSolution: `def clampedSpeedSum(speeds, minSpd, maxSpd):
    return sum(max(minSpd, min(maxSpd, v)) for v in speeds)`
  },
  {
    number: 10,
    title: 'OTA Firmware Checksum XOR',
    fnName: 'xorChecksumWords',
    description: 'Given firmware 16-bit words <code>words</code>, return their cumulative XOR.',
    constraints: ['1 <= words.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'words = [10, 20, 10]', output: '20' },
      { title: 'Test Case 2', input: 'words = [7, 7]', output: '0' },
      { title: 'Test Case 3', input: 'words = [42]', output: '42' },
      { title: 'Test Case 4', input: 'words = [1, 2, 4, 8]', output: '15' }
    ],
    javaSolution: `public class Solution {
    public static int xorChecksumWords(int[] words) {
        int x = 0; for (int w : words) x ^= w; return x;
    }
}`,
    pythonSolution: `def xorChecksumWords(words):
    x = 0
    for w in words: x ^= w
    return x`
  },
  {
    number: 11,
    title: 'Tire Pressure Low Alert Count',
    fnName: 'countLowPressureTires',
    description: 'Given tire pressures <code>psi</code>, count how many tires are strictly below <code>minPsi</code>.',
    constraints: ['1 <= psi.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'psi = [32, 28, 33, 25], minPsi = 30', output: '2' },
      { title: 'Test Case 2', input: 'psi = [30, 30, 30, 30], minPsi = 30', output: '0' },
      { title: 'Test Case 3', input: 'psi = [20], minPsi = 32', output: '1' },
      { title: 'Test Case 4', input: 'psi = [35, 36], minPsi = 32', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countLowPressureTires(int[] psi, int minPsi) {
        int cnt = 0; for (int p : psi) if (p < minPsi) cnt++; return cnt;
    }
}`,
    pythonSolution: `def countLowPressureTires(psi, minPsi):
    return sum(1 for p in psi if p < minPsi)`
  },
  {
    number: 12,
    title: 'Lane Departure Consecutive Drift',
    fnName: 'maxDriftStreak',
    description: 'Given binary lane-drift flags <code>drift</code> (<code>1</code> = drifting, <code>0</code> = centered), return the longest streak of consecutive <code>1</code>s.',
    constraints: ['1 <= drift.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'drift = [0, 1, 1, 0, 1, 1, 1]', output: '3' },
      { title: 'Test Case 2', input: 'drift = [0, 0, 0]', output: '0' },
      { title: 'Test Case 3', input: 'drift = [1, 1]', output: '2' },
      { title: 'Test Case 4', input: 'drift = [1]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int maxDriftStreak(int[] drift) {
        int cur = 0, best = 0;
        for (int d : drift) { cur = (d == 1) ? cur + 1 : 0; best = Math.max(best, cur); }
        return best;
    }
}`,
    pythonSolution: `def maxDriftStreak(drift):
    cur = best = 0
    for d in drift:
        cur = cur + 1 if d == 1 else 0; best = max(best, cur)
    return best`
  },
  {
    number: 13,
    title: 'CAN Signal Bitfield Packing',
    fnName: 'packTwoBytes',
    description: 'Pack two 8-bit sensor bytes <code>hi</code> and <code>lo</code> (0..255) into a 16-bit integer <code>(hi &lt;&lt; 8) | lo</code>.',
    constraints: ['0 <= hi, lo <= 255'],
    testCases: [
      { title: 'Test Case 1', input: 'hi = 1, lo = 2', output: '258' },
      { title: 'Test Case 2', input: 'hi = 0, lo = 255', output: '255' },
      { title: 'Test Case 3', input: 'hi = 255, lo = 0', output: '65280' },
      { title: 'Test Case 4', input: 'hi = 0, lo = 0', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int packTwoBytes(int hi, int lo) { return (hi << 8) | lo; }
}`,
    pythonSolution: `def packTwoBytes(hi, lo): return (hi << 8) | lo`
  },
  {
    number: 14,
    title: 'LiDAR Point Cloud Range Filter',
    fnName: 'countPointsInRange',
    description: 'Given 2D LiDAR points <code>pts</code> <code>[x, y]</code>, count how many lie within squared distance <code>maxR2</code> from origin (<code>x^2 + y^2 <= maxR2</code>).',
    constraints: ['1 <= pts.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'pts = [[3, 4], [6, 8], [0, 5]], maxR2 = 25', output: '2' },
      { title: 'Test Case 2', input: 'pts = [[10, 10]], maxR2 = 50', output: '0' },
      { title: 'Test Case 3', input: 'pts = [[0, 0]], maxR2 = 0', output: '1' },
      { title: 'Test Case 4', input: 'pts = [[1, 1], [2, 2]], maxR2 = 8', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int countPointsInRange(int[][] pts, long maxR2) {
        int cnt = 0;
        for (int[] p : pts) if ((long) p[0]*p[0] + (long) p[1]*p[1] <= maxR2) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countPointsInRange(pts, maxR2):
    return sum(1 for x, y in pts if x*x + y*y <= maxR2)`
  },
  {
    number: 15,
    title: 'ECU Boot-Up Dependency Order',
    fnName: 'canBootAllEcus',
    description: 'Given <code>n</code> ECUs and boot dependencies <code>deps</code> <code>[a, b]</code> (<code>b</code> must boot before <code>a</code>), return <code>true</code> if all ECUs can boot without deadlock cycle, else <code>false</code>.',
    constraints: ['1 <= n <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 3, deps = [[1, 0], [2, 1]]', output: 'true' },
      { title: 'Test Case 2', input: 'n = 2, deps = [[0, 1], [1, 0]]', output: 'false' },
      { title: 'Test Case 3', input: 'n = 4, deps = []', output: 'true' },
      { title: 'Test Case 4', input: 'n = 3, deps = [[0, 1], [1, 2], [2, 0]]', output: 'false' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static boolean canBootAllEcus(int n, int[][] deps) {
        List<List<Integer>> g = new ArrayList<>(); int[] ind = new int[n];
        for (int i = 0; i < n; i++) g.add(new ArrayList<>());
        for (int[] d : deps) { g.get(d[1]).add(d[0]); ind[d[0]]++; }
        Queue<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < n; i++) if (ind[i] == 0) q.add(i);
        int vis = 0;
        while (!q.isEmpty()) { int u = q.poll(); vis++; for (int v : g.get(u)) if (--ind[v] == 0) q.add(v); }
        return vis == n;
    }
}`,
    pythonSolution: `from collections import deque
def canBootAllEcus(n, deps):
    g = [[] for _ in range(n)]; ind = [0] * n
    for a, b in deps: g[b].append(a); ind[a] += 1
    q = deque([i for i in range(n) if ind[i] == 0]); vis = 0
    while q:
        u = q.popleft(); vis += 1
        for v in g[u]:
            ind[v] -= 1
            if ind[v] == 0: q.append(v)
    return vis == n`
  },
  {
    number: 16,
    title: 'Motor Torque Peak Window',
    fnName: 'maxTorqueWindow',
    description: 'Given motor torque samples <code>torque</code>, return maximum sum of any <code>k</code> consecutive samples.',
    constraints: ['1 <= k <= torque.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'torque = [50, 80, 30, 90, 20], k = 2', output: '130' },
      { title: 'Test Case 2', input: 'torque = [10, 10, 10], k = 3', output: '30' },
      { title: 'Test Case 3', input: 'torque = [5, 100, 5], k = 1', output: '100' },
      { title: 'Test Case 4', input: 'torque = [40, 60], k = 2', output: '100' }
    ],
    javaSolution: `public class Solution {
    public static long maxTorqueWindow(int[] torque, int k) {
        long cur = 0; for (int i = 0; i < k; i++) cur += torque[i];
        long best = cur;
        for (int i = k; i < torque.length; i++) { cur += torque[i] - torque[i - k]; best = Math.max(best, cur); }
        return best;
    }
}`,
    pythonSolution: `def maxTorqueWindow(torque, k):
    cur = sum(torque[:k]); best = cur
    for i in range(k, len(torque)): cur += torque[i] - torque[i - k]; best = max(best, cur)
    return best`
  },
  {
    number: 17,
    title: 'EV Thermal Coolant Pump Cycles',
    fnName: 'countCoolingActivations',
    description: 'Given battery temperatures <code>temps</code>, the pump turns ON when temp crosses strictly above <code>highT</code> (while currently OFF) and turns OFF when temp drops strictly below <code>lowT</code> (while currently ON). Starting OFF, return how many times the pump turns ON.',
    constraints: ['1 <= temps.length <= 10^5', 'lowT < highT'],
    testCases: [
      { title: 'Test Case 1', input: 'temps = [30, 45, 42, 34, 46], lowT = 35, highT = 40', output: '2' },
      { title: 'Test Case 2', input: 'temps = [35, 38, 40], lowT = 35, highT = 40', output: '0' },
      { title: 'Test Case 3', input: 'temps = [45, 42, 41], lowT = 35, highT = 40', output: '1' },
      { title: 'Test Case 4', input: 'temps = [20], lowT = 30, highT = 40', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countCoolingActivations(int[] temps, int lowT, int highT) {
        boolean on = false; int cnt = 0;
        for (int t : temps) {
            if (!on && t > highT) { on = true; cnt++; }
            else if (on && t < lowT) on = false;
        }
        return cnt;
    }
}`,
    pythonSolution: `def countCoolingActivations(temps, lowT, highT):
    on = False; cnt = 0
    for t in temps:
        if not on and t > highT: on = True; cnt += 1
        elif on and t < lowT: on = False
    return cnt`
  },
  {
    number: 18,
    title: 'CAN-Bus Message Burst Gaps',
    fnName: 'countMissedCanFrames',
    description: 'Sorted frame arrival timestamps <code>times</code> expect a frame at most every <code>period</code> ms. Whenever <code>gap > period</code>, <code>(gap - 1) // period</code> frames were missed. Return total missed frames.',
    constraints: ['1 <= times.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'times = [0, 10, 35, 45], period = 10', output: '2' },
      { title: 'Test Case 2', input: 'times = [0, 10, 20], period = 10', output: '0' },
      { title: 'Test Case 3', input: 'times = [0, 31], period = 10', output: '3' },
      { title: 'Test Case 4', input: 'times = [5], period = 10', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long countMissedCanFrames(int[] times, int period) {
        long miss = 0;
        for (int i = 1; i < times.length; i++) {
            int gap = times[i] - times[i - 1];
            if (gap > period) miss += (gap - 1) / period;
        }
        return miss;
    }
}`,
    pythonSolution: `def countMissedCanFrames(times, period):
    return sum((times[i] - times[i-1] - 1) // period for i in range(1, len(times)) if times[i] - times[i-1] > period)`
  },
  {
    number: 19,
    title: 'Bitwise Parity Error Bit',
    fnName: 'countOddBitPayloads',
    description: 'Count how many integers in <code>payloads</code> have an odd number of set bits.',
    constraints: ['1 <= payloads.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'payloads = [1, 3, 7, 8]', output: '3' },
      { title: 'Test Case 2', input: 'payloads = [0, 3, 5]', output: '0' },
      { title: 'Test Case 3', input: 'payloads = [15]', output: '0' },
      { title: 'Test Case 4', input: 'payloads = [4]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countOddBitPayloads(int[] payloads) {
        int cnt = 0; for (int p : payloads) if (Integer.bitCount(p) % 2 == 1) cnt++; return cnt;
    }
}`,
    pythonSolution: `def countOddBitPayloads(payloads):
    return sum(1 for p in payloads if p.bit_count() % 2 == 1)`
  },
  {
    number: 20,
    title: 'Vehicle Speed Limit Violations',
    fnName: 'totalExcessSpeedScore',
    description: 'Given vehicle speeds <code>speeds</code> and speed limit <code>limit</code>, return sum of <code>max(0, speeds[i] - limit)</code>.',
    constraints: ['1 <= speeds.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'speeds = [50, 75, 60, 80], limit = 60', output: '35' },
      { title: 'Test Case 2', input: 'speeds = [40, 50], limit = 60', output: '0' },
      { title: 'Test Case 3', input: 'speeds = [100], limit = 80', output: '20' },
      { title: 'Test Case 4', input: 'speeds = [60], limit = 60', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long totalExcessSpeedScore(int[] speeds, int limit) {
        long s = 0; for (int v : speeds) if (v > limit) s += v - limit; return s;
    }
}`,
    pythonSolution: `def totalExcessSpeedScore(speeds, limit):
    return sum(max(0, v - limit) for v in speeds)`
  },
  {
    number: 21,
    title: 'Memory Alignment Upward Round',
    fnName: 'alignedBufferSize',
    description: 'Round allocation <code>size</code> up to the nearest multiple of power-of-2 <code>align</code>.',
    constraints: ['0 <= size <= 10^9', 'align is a power of 2'],
    testCases: [
      { title: 'Test Case 1', input: 'size = 13, align = 8', output: '16' },
      { title: 'Test Case 2', input: 'size = 16, align = 16', output: '16' },
      { title: 'Test Case 3', input: 'size = 0, align = 4', output: '0' },
      { title: 'Test Case 4', input: 'size = 1, align = 32', output: '32' }
    ],
    javaSolution: `public class Solution {
    public static long alignedBufferSize(long size, long align) {
        return (size + align - 1) & ~(align - 1);
    }
}`,
    pythonSolution: `def alignedBufferSize(size, align):
    return (size + align - 1) & ~(align - 1)`
  },
  {
    number: 22,
    title: 'Ring Buffer Free Capacity',
    fnName: 'ringFreeSlots',
    description: 'In a ring buffer of size <code>cap</code> with <code>used</code> bytes currently queued, process events <code>events</code> (+write clamped to <code>cap</code>, -read clamped to 0). Return final free slots.',
    constraints: ['1 <= events.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'cap = 10, used = 2, events = [5, -3, 8]', output: '0' },
      { title: 'Test Case 2', input: 'cap = 10, used = 5, events = [-10, 3]', output: '7' },
      { title: 'Test Case 3', input: 'cap = 8, used = 0, events = [4]', output: '4' },
      { title: 'Test Case 4', input: 'cap = 5, used = 5, events = [-5]', output: '5' }
    ],
    javaSolution: `public class Solution {
    public static int ringFreeSlots(int cap, int used, int[] events) {
        int cur = used;
        for (int e : events) cur = Math.max(0, Math.min(cap, cur + e));
        return cap - cur;
    }
}`,
    pythonSolution: `def ringFreeSlots(cap, used, events):
    cur = used
    for e in events: cur = max(0, min(cap, cur + e))
    return cap - cur`
  },
  {
    number: 23,
    title: 'ABS Wheel Lockup Detection',
    fnName: 'countAbsTriggers',
    description: 'Given wheel speeds <code>speeds</code>, ABS triggers at index <code>i >= 1</code> if <code>speeds[i-1] - speeds[i] >= dropThresh</code>. Count ABS triggers.',
    constraints: ['1 <= speeds.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'speeds = [60, 40, 35, 10], dropThresh = 20', output: '2' },
      { title: 'Test Case 2', input: 'speeds = [50, 45, 40], dropThresh = 10', output: '0' },
      { title: 'Test Case 3', input: 'speeds = [30, 0], dropThresh = 30', output: '1' },
      { title: 'Test Case 4', input: 'speeds = [50], dropThresh = 5', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countAbsTriggers(int[] speeds, int dropThresh) {
        int cnt = 0;
        for (int i = 1; i < speeds.length; i++) if (speeds[i - 1] - speeds[i] >= dropThresh) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countAbsTriggers(speeds, dropThresh):
    return sum(1 for i in range(1, len(speeds)) if speeds[i - 1] - speeds[i] >= dropThresh)`
  },
  {
    number: 24,
    title: 'Parking Sensor Nearest Obstacle',
    fnName: 'minSensorDistance',
    description: 'Given ultrasonic sensor readings <code>dists</code> (ignoring negative invalid readings), return the smallest valid reading, or <code>-1</code> if none.',
    constraints: ['1 <= dists.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'dists = [-1, 45, 18, 30, -1]', output: '18' },
      { title: 'Test Case 2', input: 'dists = [-1, -2]', output: '-1' },
      { title: 'Test Case 3', input: 'dists = [0, 10]', output: '0' },
      { title: 'Test Case 4', input: 'dists = [50]', output: '50' }
    ],
    javaSolution: `public class Solution {
    public static int minSensorDistance(int[] dists) {
        int best = Integer.MAX_VALUE;
        for (int d : dists) if (d >= 0 && d < best) best = d;
        return best == Integer.MAX_VALUE ? -1 : best;
    }
}`,
    pythonSolution: `def minSensorDistance(dists):
    v = [d for d in dists if d >= 0]
    return min(v) if v else -1`
  },
  {
    number: 25,
    title: 'Telemetry Packet CRC8 Check',
    fnName: 'countValidPackets',
    description: 'A 4-byte packet <code>[b0, b1, b2, crc]</code> is valid if <code>(b0 ^ b1 ^ b2) == crc</code>. Count valid packets in <code>packets</code>.',
    constraints: ['1 <= packets.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'packets = [[1, 2, 3, 0], [5, 3, 1, 7], [4, 4, 4, 1]]', output: '2' },
      { title: 'Test Case 2', input: 'packets = [[1, 1, 1, 0]]', output: '0' },
      { title: 'Test Case 3', input: 'packets = [[0, 0, 0, 0]]', output: '1' },
      { title: 'Test Case 4', input: 'packets = [[10, 20, 30, 0]]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countValidPackets(int[][] packets) {
        int ok = 0;
        for (int[] p : packets) if ((p[0] ^ p[1] ^ p[2]) == p[3]) ok++;
        return ok;
    }
}`,
    pythonSolution: `def countValidPackets(packets):
    return sum(1 for a, b, c, d in packets if (a ^ b ^ c) == d)`
  },
  {
    number: 26,
    title: 'Fleet EV Range Remaining',
    fnName: 'countTripsCompleted',
    description: 'An EV starts with <code>range</code> km and must make sequential trips <code>trips</code> (stopping before a trip if <code>range < trips[i]</code>). Return how many trips are completed.',
    constraints: ['1 <= trips.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'range = 100, trips = [30, 40, 50, 10]', output: '2' },
      { title: 'Test Case 2', input: 'range = 20, trips = [25, 10]', output: '0' },
      { title: 'Test Case 3', input: 'range = 60, trips = [20, 20, 20]', output: '3' },
      { title: 'Test Case 4', input: 'range = 10, trips = [10]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countTripsCompleted(int range, int[] trips) {
        int cnt = 0;
        for (int t : trips) { if (range < t) break; range -= t; cnt++; }
        return cnt;
    }
}`,
    pythonSolution: `def countTripsCompleted(range, trips):
    cnt = 0
    for t in trips:
        if range < t: break
        range -= t; cnt += 1
    return cnt`
  },
  {
    number: 27,
    title: 'Bitwise Flag Register Toggle',
    fnName: 'finalRegisterState',
    description: 'Starting at <code>init</code>, flip every bit listed in <code>bits</code> (0-indexed). Return final integer.',
    constraints: ['1 <= bits.length <= 10^5', '0 <= bits[i] <= 30'],
    testCases: [
      { title: 'Test Case 1', input: 'init = 5, bits = [0, 1, 0]', output: '7' },
      { title: 'Test Case 2', input: 'init = 0, bits = [3, 3]', output: '0' },
      { title: 'Test Case 3', input: 'init = 8, bits = [3]', output: '0' },
      { title: 'Test Case 4', input: 'init = 0, bits = [0, 1, 2]', output: '7' }
    ],
    javaSolution: `public class Solution {
    public static int finalRegisterState(int init, int[] bits) {
        for (int b : bits) init ^= (1 << b);
        return init;
    }
}`,
    pythonSolution: `def finalRegisterState(init, bits):
    for b in bits: init ^= (1 << b)
    return init`
  },
  {
    number: 28,
    title: 'Odometer Rollover Counter',
    fnName: 'countOdometerRollovers',
    description: 'An odometer wraps modulo <code>mod</code>. Given sequential trip distances <code>trips</code> starting from <code>0</code>, return how many times the odometer wraps around (crosses <code>mod</code>).',
    constraints: ['1 <= trips.length <= 10^5', '1 <= mod <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'trips = [60, 50, 90], mod = 100', output: '2' },
      { title: 'Test Case 2', input: 'trips = [20, 30, 40], mod = 100', output: '0' },
      { title: 'Test Case 3', input: 'trips = [250], mod = 100', output: '2' },
      { title: 'Test Case 4', input: 'trips = [100], mod = 100', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static long countOdometerRollovers(int[] trips, long mod) {
        long tot = 0; for (int t : trips) tot += t;
        return tot / mod;
    }
}`,
    pythonSolution: `def countOdometerRollovers(trips, mod):
    return sum(trips) // mod`
  },
  {
    number: 29,
    title: 'CAN Signal Rising Edge Count',
    fnName: 'countSignalTriggers',
    description: 'Given binary state array <code>sig</code>, count how many <code>0 -> 1</code> transitions occur.',
    constraints: ['1 <= sig.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'sig = [0, 1, 1, 0, 1]', output: '2' },
      { title: 'Test Case 2', input: 'sig = [1, 1, 1]', output: '0' },
      { title: 'Test Case 3', input: 'sig = [0, 0]', output: '0' },
      { title: 'Test Case 4', input: 'sig = [0, 1, 0, 1]', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int countSignalTriggers(int[] sig) {
        int cnt = 0;
        for (int i = 1; i < sig.length; i++) if (sig[i - 1] == 0 && sig[i] == 1) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countSignalTriggers(sig):
    return sum(1 for i in range(1, len(sig)) if sig[i - 1] == 0 and sig[i] == 1)`
  },
  {
    number: 30,
    title: 'Headlight Auto-Beam Hysteresis',
    fnName: 'countBeamSwitches',
    description: 'Ambient light readings <code>lux</code> turn high-beam ON when <code>lux < lowLux</code> and OFF when <code>lux > highLux</code>. Starting OFF, return total ON/OFF state changes.',
    constraints: ['1 <= lux.length <= 10^5', 'lowLux < highLux'],
    testCases: [
      { title: 'Test Case 1', input: 'lux = [100, 10, 30, 80, 15], lowLux = 20, highLux = 50', output: '3' },
      { title: 'Test Case 2', input: 'lux = [30, 40, 50], lowLux = 20, highLux = 50', output: '0' },
      { title: 'Test Case 3', input: 'lux = [5, 10, 15], lowLux = 20, highLux = 50', output: '1' },
      { title: 'Test Case 4', input: 'lux = [100], lowLux = 20, highLux = 50', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countBeamSwitches(int[] lux, int lowLux, int highLux) {
        boolean on = false; int sw = 0;
        for (int l : lux) {
            if (!on && l < lowLux) { on = true; sw++; }
            else if (on && l > highLux) { on = false; sw++; }
        }
        return sw;
    }
}`,
    pythonSolution: `def countBeamSwitches(lux, lowLux, highLux):
    on = False; sw = 0
    for l in lux:
        if not on and l < lowLux: on = True; sw += 1
        elif on and l > highLux: on = False; sw += 1
    return sw`
  },
  {
    number: 31,
    title: 'Motor RPM Redline Duration',
    fnName: 'longestRedlineStreak',
    description: 'Given RPM readings <code>rpms</code>, return the longest consecutive readings with <code>rpms[i] >= redline</code>.',
    constraints: ['1 <= rpms.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'rpms = [4000, 6500, 7000, 5000, 6800, 7200, 7100], redline = 6500', output: '3' },
      { title: 'Test Case 2', input: 'rpms = [3000, 4000], redline = 6000', output: '0' },
      { title: 'Test Case 3', input: 'rpms = [6000, 6000], redline = 6000', output: '2' },
      { title: 'Test Case 4', input: 'rpms = [8000], redline = 7000', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int longestRedlineStreak(int[] rpms, int redline) {
        int cur = 0, best = 0;
        for (int r : rpms) { cur = (r >= redline) ? cur + 1 : 0; best = Math.max(best, cur); }
        return best;
    }
}`,
    pythonSolution: `def longestRedlineStreak(rpms, redline):
    cur = best = 0
    for r in rpms: cur = cur + 1 if r >= redline else 0; best = max(best, cur)
    return best`
  },
  {
    number: 32,
    title: 'Telemetry Downsampling Step',
    fnName: 'sumEveryKthSample',
    description: 'Given samples <code>vals</code> and step <code>k</code>, return the sum of elements at indices <code>0, k, 2k, ...</code>.',
    constraints: ['1 <= k <= vals.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'vals = [10, 20, 30, 40, 50], k = 2', output: '90' },
      { title: 'Test Case 2', input: 'vals = [5, 10, 15], k = 1', output: '30' },
      { title: 'Test Case 3', input: 'vals = [7, 8, 9], k = 3', output: '7' },
      { title: 'Test Case 4', input: 'vals = [42], k = 1', output: '42' }
    ],
    javaSolution: `public class Solution {
    public static long sumEveryKthSample(int[] vals, int k) {
        long s = 0;
        for (int i = 0; i < vals.length; i += k) s += vals[i];
        return s;
    }
}`,
    pythonSolution: `def sumEveryKthSample(vals, k):
    return sum(vals[::k])`
  },
  {
    number: 33,
    title: 'EV Charging Slot Overlap',
    fnName: 'maxChargersUsedSimultaneously',
    description: 'Given charging session intervals <code>sessions</code> <code>[start, end)</code>, return minimum charging stalls required.',
    constraints: ['1 <= sessions.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'sessions = [[1, 5], [2, 6], [5, 8]]', output: '2' },
      { title: 'Test Case 2', input: 'sessions = [[0, 10], [1, 9], [2, 8]]', output: '3' },
      { title: 'Test Case 3', input: 'sessions = [[1, 2], [2, 3]]', output: '1' },
      { title: 'Test Case 4', input: 'sessions = [[5, 10]]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int maxChargersUsedSimultaneously(int[][] sessions) {
        int n = sessions.length; int[] s = new int[n], e = new int[n];
        for (int i = 0; i < n; i++) { s[i] = sessions[i][0]; e[i] = sessions[i][1]; }
        Arrays.sort(s); Arrays.sort(e);
        int i = 0, j = 0, cur = 0, best = 0;
        while (i < n) {
            if (s[i] < e[j]) { cur++; best = Math.max(best, cur); i++; } else { cur--; j++; }
        }
        return best;
    }
}`,
    pythonSolution: `def maxChargersUsedSimultaneously(sessions):
    s = sorted(x[0] for x in sessions); e = sorted(x[1] for x in sessions)
    i = j = cur = best = 0
    while i < len(s):
        if s[i] < e[j]: cur += 1; best = max(best, cur); i += 1
        else: cur -= 1; j += 1
    return best`
  },
  {
    number: 34,
    title: 'Bitwise Mask Power-of-2 Check',
    fnName: 'countPowerOfTwoIds',
    description: 'Count how many positive integers in <code>ids</code> are exact powers of 2.',
    constraints: ['1 <= ids.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'ids = [1, 2, 3, 4, 8, 10]', output: '4' },
      { title: 'Test Case 2', input: 'ids = [3, 5, 7]', output: '0' },
      { title: 'Test Case 3', input: 'ids = [16]', output: '1' },
      { title: 'Test Case 4', input: 'ids = [0, 1]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countPowerOfTwoIds(int[] ids) {
        int cnt = 0;
        for (int x : ids) if (x > 0 && (x & (x - 1)) == 0) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countPowerOfTwoIds(ids):
    return sum(1 for x in ids if x > 0 and (x & (x - 1)) == 0)`
  },
  {
    number: 35,
    title: 'GPS Waypoint Path Length',
    fnName: 'totalManhattanRoute',
    description: 'Starting at <code>(0, 0)</code>, visit 2D integer waypoints <code>pts</code> in order. Return total Manhattan distance.',
    constraints: ['1 <= pts.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'pts = [[2, 3], [5, 1]]', output: '10' },
      { title: 'Test Case 2', input: 'pts = [[0, 0]]', output: '0' },
      { title: 'Test Case 3', input: 'pts = [[-2, 2], [0, 0]]', output: '8' },
      { title: 'Test Case 4', input: 'pts = [[4, 0]]', output: '4' }
    ],
    javaSolution: `public class Solution {
    public static long totalManhattanRoute(int[][] pts) {
        long d = 0; int cx = 0, cy = 0;
        for (int[] p : pts) { d += Math.abs((long) p[0] - cx) + Math.abs((long) p[1] - cy); cx = p[0]; cy = p[1]; }
        return d;
    }
}`,
    pythonSolution: `def totalManhattanRoute(pts):
    d = cx = cy = 0
    for x, y in pts: d += abs(x - cx) + abs(y - cy); cx, cy = x, y
    return d`
  },
  {
    number: 36,
    title: 'ECU Flash Memory Block Count',
    fnName: 'minFlashSectors',
    description: 'A firmware image of <code>bytes</code> bytes is written in sectors of <code>sectorSize</code> bytes. Return minimum sectors needed.',
    constraints: ['0 <= bytes <= 10^9', '1 <= sectorSize <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'bytes = 10000, sectorSize = 4096', output: '3' },
      { title: 'Test Case 2', input: 'bytes = 8192, sectorSize = 4096', output: '2' },
      { title: 'Test Case 3', input: 'bytes = 0, sectorSize = 512', output: '0' },
      { title: 'Test Case 4', input: 'bytes = 1, sectorSize = 1024', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static long minFlashSectors(long bytes, long sectorSize) {
        return (bytes + sectorSize - 1) / sectorSize;
    }
}`,
    pythonSolution: `def minFlashSectors(bytes, sectorSize):
    return (bytes + sectorSize - 1) // sectorSize`
  },
  {
    number: 37,
    title: 'Brake Pad Wear Alert Check',
    fnName: 'countWornPads',
    description: 'Given pad thicknesses <code>mm</code>, count how many pads are <code>&lt;= minMm</code>.',
    constraints: ['1 <= mm.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'mm = [5, 2, 8, 3], minMm = 3', output: '2' },
      { title: 'Test Case 2', input: 'mm = [10, 12], minMm = 4', output: '0' },
      { title: 'Test Case 3', input: 'mm = [1], minMm = 2', output: '1' },
      { title: 'Test Case 4', input: 'mm = [4, 4], minMm = 4', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int countWornPads(int[] mm, int minMm) {
        int cnt = 0; for (int x : mm) if (x <= minMm) cnt++; return cnt;
    }
}`,
    pythonSolution: `def countWornPads(mm, minMm):
    return sum(1 for x in mm if x <= minMm)`
  },
  {
    number: 38,
    title: 'Vehicle Trip Fuel Efficiency',
    fnName: 'countEcoTrips',
    description: 'Given trip distances <code>km</code> and energy used <code>kwh</code>, count trips achieving at least <code>minKmPerKwh</code> efficiency (<code>km[i] >= minKmPerKwh * kwh[i]</code>).',
    constraints: ['1 <= km.length == kwh.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'km = [60, 40, 100], kwh = [10, 10, 15], minKmPerKwh = 6', output: '2' },
      { title: 'Test Case 2', input: 'km = [20], kwh = [10], minKmPerKwh = 5', output: '0' },
      { title: 'Test Case 3', input: 'km = [50], kwh = [10], minKmPerKwh = 5', output: '1' },
      { title: 'Test Case 4', input: 'km = [30, 30], kwh = [5, 6], minKmPerKwh = 6', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countEcoTrips(int[] km, int[] kwh, int minKmPerKwh) {
        int cnt = 0;
        for (int i = 0; i < km.length; i++) if (km[i] >= (long) minKmPerKwh * kwh[i]) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countEcoTrips(km, kwh, minKmPerKwh):
    return sum(1 for d, e in zip(km, kwh) if d >= minKmPerKwh * e)`
  },
  {
    number: 39,
    title: 'CAN Signal Debounce Filter',
    fnName: 'countDebouncedPulses',
    description: 'Given sorted pulse timestamps <code>times</code>, accept the first pulse and any subsequent pulse at least <code>debounceMs</code> after the last ACCEPTED pulse. Return total accepted pulses.',
    constraints: ['1 <= times.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'times = [0, 5, 12, 18, 30], debounceMs = 10', output: '3' },
      { title: 'Test Case 2', input: 'times = [0, 1, 2, 3], debounceMs = 5', output: '1' },
      { title: 'Test Case 3', input: 'times = [0, 10, 20], debounceMs = 10', output: '3' },
      { title: 'Test Case 4', input: 'times = [42], debounceMs = 100', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countDebouncedPulses(int[] times, int debounceMs) {
        int last = times[0], ok = 1;
        for (int i = 1; i < times.length; i++) if (times[i] - last >= debounceMs) { ok++; last = times[i]; }
        return ok;
    }
}`,
    pythonSolution: `def countDebouncedPulses(times, debounceMs):
    last, ok = times[0], 1
    for t in times[1:]:
        if t - last >= debounceMs: ok += 1; last = t
    return ok`
  },
  {
    number: 40,
    title: 'V2X Broadcast Reachability',
    fnName: 'countReachableVehicles',
    description: 'Given <code>n</code> vehicles (0..n-1) and bidirectional V2X radio links <code>links</code> <code>[u, v]</code>, return how many vehicles receive a broadcast originating at vehicle <code>0</code> (including <code>0</code>).',
    constraints: ['1 <= n <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 5, links = [[0, 1], [1, 2], [3, 4]]', output: '3' },
      { title: 'Test Case 2', input: 'n = 3, links = [[1, 2]]', output: '1' },
      { title: 'Test Case 3', input: 'n = 3, links = [[0, 1], [0, 2]]', output: '3' },
      { title: 'Test Case 4', input: 'n = 1, links = []', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countReachableVehicles(int n, int[][] links) {
        List<List<Integer>> g = new ArrayList<>();
        for (int i = 0; i < n; i++) g.add(new ArrayList<>());
        for (int[] l : links) { g.get(l[0]).add(l[1]); g.get(l[1]).add(l[0]); }
        boolean[] vis = new boolean[n]; Queue<Integer> q = new ArrayDeque<>();
        vis[0] = true; q.add(0); int cnt = 0;
        while (!q.isEmpty()) { int u = q.poll(); cnt++; for (int v : g.get(u)) if (!vis[v]) { vis[v] = true; q.add(v); } }
        return cnt;
    }
}`,
    pythonSolution: `from collections import deque
def countReachableVehicles(n, links):
    g = [[] for _ in range(n)]
    for u, v in links: g[u].append(v); g[v].append(u)
    vis = {0}; q = deque([0])
    while q:
        u = q.popleft()
        for v in g[u]:
            if v not in vis: vis.add(v); q.append(v)
    return len(vis)`
  },
  {
    number: 41,
    title: 'Bitwise Byte Inversion Sum',
    fnName: 'sumInvertedBytes',
    description: 'For each 8-bit byte <code>b</code> in <code>bytes</code> (0..255), compute <code>b ^ 255</code> and return the sum.',
    constraints: ['1 <= bytes.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'bytes = [0, 255, 15]', output: '495' },
      { title: 'Test Case 2', input: 'bytes = [255, 255]', output: '0' },
      { title: 'Test Case 3', input: 'bytes = [0]', output: '255' },
      { title: 'Test Case 4', input: 'bytes = [100, 155]', output: '255' }
    ],
    javaSolution: `public class Solution {
    public static long sumInvertedBytes(int[] bytes) {
        long s = 0; for (int b : bytes) s += (b ^ 255); return s;
    }
}`,
    pythonSolution: `def sumInvertedBytes(bytes):
    return sum(b ^ 255 for b in bytes)`
  },
  {
    number: 42,
    title: 'EV Battery State-of-Health',
    fnName: 'countHealthyPacks',
    description: 'Given original capacities <code>orig</code> and current capacities <code>cur</code>, a pack is healthy if <code>cur[i] * 100 >= minPct * orig[i]</code>. Count healthy packs.',
    constraints: ['1 <= orig.length == cur.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'orig = [100, 100, 100], cur = [85, 79, 90], minPct = 80', output: '2' },
      { title: 'Test Case 2', input: 'orig = [50], cur = [30], minPct = 80', output: '0' },
      { title: 'Test Case 3', input: 'orig = [80], cur = [64], minPct = 80', output: '1' },
      { title: 'Test Case 4', input: 'orig = [100, 200], cur = [100, 200], minPct = 100', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int countHealthyPacks(int[] orig, int[] cur, int minPct) {
        int cnt = 0;
        for (int i = 0; i < orig.length; i++) if ((long) cur[i] * 100 >= (long) minPct * orig[i]) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countHealthyPacks(orig, cur, minPct):
    return sum(1 for o, c in zip(orig, cur) if c * 100 >= minPct * o)`
  },
  {
    number: 43,
    title: 'Torque Vectoring Left-Right Diff',
    fnName: 'maxAxleTorqueImbalance',
    description: 'Given left-wheel torques <code>left</code> and right-wheel torques <code>right</code>, return maximum <code>|left[i] - right[i]|</code>.',
    constraints: ['1 <= left.length == right.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'left = [100, 150, 80], right = [90, 100, 85]', output: '50' },
      { title: 'Test Case 2', input: 'left = [50, 50], right = [50, 50]', output: '0' },
      { title: 'Test Case 3', input: 'left = [10], right = [40]', output: '30' },
      { title: 'Test Case 4', input: 'left = [200, 0], right = [0, 100]', output: '200' }
    ],
    javaSolution: `public class Solution {
    public static int maxAxleTorqueImbalance(int[] left, int[] right) {
        int best = 0;
        for (int i = 0; i < left.length; i++) best = Math.max(best, Math.abs(left[i] - right[i]));
        return best;
    }
}`,
    pythonSolution: `def maxAxleTorqueImbalance(left, right):
    return max(abs(l - r) for l, r in zip(left, right))`
  },
  {
    number: 44,
    title: 'Embedded Watchdog Max Idle Gap',
    fnName: 'maxKickGap',
    description: 'Given sorted watchdog kick timestamps <code>kicks</code>, return the maximum gap between consecutive kicks (<code>0</code> if fewer than 2).',
    constraints: ['1 <= kicks.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'kicks = [0, 5, 18, 22]', output: '13' },
      { title: 'Test Case 2', input: 'kicks = [10]', output: '0' },
      { title: 'Test Case 3', input: 'kicks = [5, 5, 5]', output: '0' },
      { title: 'Test Case 4', input: 'kicks = [0, 100]', output: '100' }
    ],
    javaSolution: `public class Solution {
    public static int maxKickGap(int[] kicks) {
        int best = 0;
        for (int i = 1; i < kicks.length; i++) best = Math.max(best, kicks[i] - kicks[i - 1]);
        return best;
    }
}`,
    pythonSolution: `def maxKickGap(kicks):
    return max((kicks[i] - kicks[i-1] for i in range(1, len(kicks))), default=0)`
  },
  {
    number: 45,
    title: 'Steer-By-Wire Angle Clamp',
    fnName: 'countAngleViolations',
    description: 'Given signed steering angles <code>angles</code>, count how many exceed safety bound <code>|angles[i]| > maxDeg</code>.',
    constraints: ['1 <= angles.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'angles = [-45, 20, 50, -60, 45], maxDeg = 45', output: '2' },
      { title: 'Test Case 2', input: 'angles = [10, -10], maxDeg = 30', output: '0' },
      { title: 'Test Case 3', input: 'angles = [-90], maxDeg = 45', output: '1' },
      { title: 'Test Case 4', input: 'angles = [0], maxDeg = 0', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countAngleViolations(int[] angles, int maxDeg) {
        int bad = 0; for (int a : angles) if (Math.abs(a) > maxDeg) bad++; return bad;
    }
}`,
    pythonSolution: `def countAngleViolations(angles, maxDeg):
    return sum(1 for a in angles if abs(a) > maxDeg)`
  },
  {
    number: 46,
    title: 'Bitmask Sensor Health Check',
    fnName: 'countHealthySensors',
    description: 'Given sensor status bitmasks <code>status</code> and required bitmask <code>okMask</code>, count sensors with <code>(status[i] &amp; okMask) == okMask</code>.',
    constraints: ['1 <= status.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'status = [7, 5, 3, 15], okMask = 5', output: '3' },
      { title: 'Test Case 2', input: 'status = [1, 2], okMask = 4', output: '0' },
      { title: 'Test Case 3', input: 'status = [0], okMask = 0', output: '1' },
      { title: 'Test Case 4', input: 'status = [12], okMask = 12', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countHealthySensors(int[] status, int okMask) {
        int cnt = 0; for (int s : status) if ((s & okMask) == okMask) cnt++; return cnt;
    }
}`,
    pythonSolution: `def countHealthySensors(status, okMask):
    return sum(1 for s in status if (s & okMask) == okMask)`
  },
  {
    number: 47,
    title: 'EV Charging Queue Total Wait',
    fnName: 'minTotalChargingWait',
    description: 'Vehicles need charging times <code>times</code> at 1 fast charger. Schedule shortest-job-first and return sum of completion times.',
    constraints: ['1 <= times.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'times = [10, 5, 2]', output: '26' },
      { title: 'Test Case 2', input: 'times = [8]', output: '8' },
      { title: 'Test Case 3', input: 'times = [4, 4, 4]', output: '24' },
      { title: 'Test Case 4', input: 'times = [1, 3]', output: '5' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long minTotalChargingWait(int[] times) {
        Arrays.sort(times); long cur = 0, tot = 0;
        for (int t : times) { cur += t; tot += cur; }
        return tot;
    }
}`,
    pythonSolution: `def minTotalChargingWait(times):
    cur = tot = 0
    for t in sorted(times): cur += t; tot += cur
    return tot`
  },
  {
    number: 48,
    title: 'ECU Firmware Version Upgrade',
    fnName: 'countPendingUpdates',
    description: 'Given installed ECU versions <code>cur</code> and target versions <code>target</code>, count ECUs needing an upgrade (<code>cur[i] < target[i]</code>).',
    constraints: ['1 <= cur.length == target.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'cur = [1, 5, 3], target = [2, 5, 4]', output: '2' },
      { title: 'Test Case 2', input: 'cur = [10, 10], target = [5, 10]', output: '0' },
      { title: 'Test Case 3', input: 'cur = [1], target = [9]', output: '1' },
      { title: 'Test Case 4', input: 'cur = [4], target = [4]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countPendingUpdates(int[] cur, int[] target) {
        int cnt = 0; for (int i = 0; i < cur.length; i++) if (cur[i] < target[i]) cnt++; return cnt;
    }
}`,
    pythonSolution: `def countPendingUpdates(cur, target):
    return sum(1 for c, t in zip(cur, target) if c < t)`
  },
  {
    number: 49,
    title: 'Radar Object Tracking Continuity',
    fnName: 'countTrackedObjects',
    description: 'Given object IDs detected in frame 1 <code>f1</code> and frame 2 <code>f2</code>, return how many distinct IDs appear in BOTH frames.',
    constraints: ['0 <= f1.length, f2.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'f1 = [1, 2, 3, 2], f2 = [2, 3, 4]', output: '2' },
      { title: 'Test Case 2', input: 'f1 = [1, 2], f2 = [3, 4]', output: '0' },
      { title: 'Test Case 3', input: 'f1 = [], f2 = [1]', output: '0' },
      { title: 'Test Case 4', input: 'f1 = [5], f2 = [5, 5]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countTrackedObjects(int[] f1, int[] f2) {
        Set<Integer> a = new HashSet<>(), b = new HashSet<>();
        for (int x : f1) a.add(x);
        for (int x : f2) if (a.contains(x)) b.add(x);
        return b.size();
    }
}`,
    pythonSolution: `def countTrackedObjects(f1, f2):
    return len(set(f1) & set(f2))`
  },
  {
    number: 50,
    title: 'EV Battery Energy Budget DP',
    fnName: 'maxModulesEnabled',
    description: 'Select a subset of vehicle subsystems with power draws <code>draws</code> without exceeding battery budget <code>cap</code>. Return maximum number of subsystems enabled.',
    constraints: ['1 <= draws.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'draws = [30, 10, 20, 40], cap = 60', output: '3' },
      { title: 'Test Case 2', input: 'draws = [50, 60], cap = 40', output: '0' },
      { title: 'Test Case 3', input: 'draws = [10, 10, 10], cap = 30', output: '3' },
      { title: 'Test Case 4', input: 'draws = [5], cap = 5', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int maxModulesEnabled(int[] draws, long cap) {
        Arrays.sort(draws); long s = 0; int cnt = 0;
        for (int d : draws) { if (s + d <= cap) { s += d; cnt++; } else break; }
        return cnt;
    }
}`,
    pythonSolution: `def maxModulesEnabled(draws, cap):
    s = cnt = 0
    for d in sorted(draws):
        if s + d <= cap: s += d; cnt += 1
        else: break
    return cnt`
  }
];
