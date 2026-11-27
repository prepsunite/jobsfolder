export const LTIMINDTREE_P2 = [
  {
    number: 31,
    title: 'Assembly-Line Defect Streak Alert',
    fnName: 'countDefectBatches',
    description: 'An LTIMindtree smart-factory sensor flags <code>1</code> for a defective unit and <code>0</code> for a good unit in <code>units</code>. Whenever <code>k</code> consecutive defects occur, a line-stop alert is triggered and the counter resets. Return total line-stop alerts.',
    constraints: ['1 <= k <= units.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'units = [1, 1, 0, 1, 1, 1, 1], k = 2', output: '3' },
      { title: 'Test Case 2', input: 'units = [0, 1, 0, 1], k = 2', output: '0' },
      { title: 'Test Case 3', input: 'units = [1, 1, 1], k = 3', output: '1' },
      { title: 'Test Case 4', input: 'units = [0, 0], k = 1', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countDefectBatches(int[] units, int k) {
        int run = 0, alerts = 0;
        for (int u : units) {
            if (u == 1) { if (++run == k) { alerts++; run = 0; } }
            else run = 0;
        }
        return alerts;
    }
}`,
    pythonSolution: `def countDefectBatches(units, k):
    run = alerts = 0
    for u in units:
        if u == 1:
            run += 1
            if run == k: alerts += 1; run = 0
        else:
            run = 0
    return alerts`
  },
  {
    number: 32,
    title: 'Omnichannel Order Split-Ship Cost',
    fnName: 'minFulfillmentWarehouses',
    description: 'An order requires item IDs <code>orderItems</code>. Warehouse A stocks <code>whA</code> and Warehouse B stocks <code>whB</code>. Return <code>1</code> if either warehouse alone has ALL required items, <code>2</code> if both together cover all items, or <code>-1</code> if any item is out of stock everywhere.',
    constraints: ['1 <= orderItems.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'orderItems = [1, 2, 3], whA = [1, 2], whB = [2, 3]', output: '2' },
      { title: 'Test Case 2', input: 'orderItems = [1, 2], whA = [1, 2, 3], whB = [1]', output: '1' },
      { title: 'Test Case 3', input: 'orderItems = [1, 4], whA = [1, 2], whB = [3]', output: '-1' },
      { title: 'Test Case 4', input: 'orderItems = [5], whA = [1], whB = [5]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minFulfillmentWarehouses(int[] orderItems, int[] whA, int[] whB) {
        Set<Integer> a = new HashSet<>(), b = new HashSet<>();
        for (int x : whA) a.add(x);
        for (int x : whB) b.add(x);
        boolean allA = true, allB = true;
        for (int item : orderItems) {
            boolean inA = a.contains(item), inB = b.contains(item);
            if (!inA && !inB) return -1;
            if (!inA) allA = false;
            if (!inB) allB = false;
        }
        return (allA || allB) ? 1 : 2;
    }
}`,
    pythonSolution: `def minFulfillmentWarehouses(orderItems, whA, whB):
    req, a, b = set(orderItems), set(whA), set(whB)
    if not req.issubset(a | b): return -1
    return 1 if req.issubset(a) or req.issubset(b) else 2`
  },
  {
    number: 33,
    title: 'Predictive Maintenance Vibration Spike',
    fnName: 'countVibrationAnomalies',
    description: 'A turbine sensor records vibration amplitudes <code>amps</code>. A reading at index <code>i</code> (<code>i &gt;= 1</code>) is an anomaly if <code>amps[i] &gt; amps[i - 1] + delta</code>. Return total anomaly count.',
    constraints: ['1 <= amps.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'amps = [10, 12, 25, 24, 40], delta = 10', output: '2' },
      { title: 'Test Case 2', input: 'amps = [5, 10, 15], delta = 5', output: '0' },
      { title: 'Test Case 3', input: 'amps = [100], delta = 1', output: '0' },
      { title: 'Test Case 4', input: 'amps = [1, 100, 1, 100], delta = 50', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int countVibrationAnomalies(int[] amps, int delta) {
        int cnt = 0;
        for (int i = 1; i < amps.length; i++) if (amps[i] > amps[i - 1] + delta) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countVibrationAnomalies(amps, delta):
    return sum(1 for i in range(1, len(amps)) if amps[i] > amps[i - 1] + delta)`
  },
  {
    number: 34,
    title: 'Cold-Chain Temperature Excursion',
    fnName: 'maxExcursionRun',
    description: 'A vaccine cold-chain sensor logs temperatures <code>temps</code>. Safe range is <code>[minT, maxT]</code> inclusive. Return the longest consecutive readings strictly outside the safe range.',
    constraints: ['1 <= temps.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'temps = [4, 9, 10, 12, 5, 1, 0], minT = 2, maxT = 8', output: '3' },
      { title: 'Test Case 2', input: 'temps = [2, 5, 8], minT = 2, maxT = 8', output: '0' },
      { title: 'Test Case 3', input: 'temps = [15, 20], minT = 2, maxT = 8', output: '2' },
      { title: 'Test Case 4', input: 'temps = [5], minT = 2, maxT = 8', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int maxExcursionRun(int[] temps, int minT, int maxT) {
        int cur = 0, best = 0;
        for (int t : temps) {
            if (t < minT || t > maxT) { cur++; best = Math.max(best, cur); }
            else cur = 0;
        }
        return best;
    }
}`,
    pythonSolution: `def maxExcursionRun(temps, minT, maxT):
    cur = best = 0
    for t in temps:
        cur = cur + 1 if (t < minT or t > maxT) else 0
        if cur > best: best = cur
    return best`
  },
  {
    number: 35,
    title: 'Smart-Meter Peak-Tariff Billing',
    fnName: 'totalElectricityBill',
    description: 'Given hourly kWh usage <code>kwh</code> (24 elements, hours 0..23), peak hours (18..22 inclusive) cost <code>peakRate</code>/kWh and off-peak hours cost <code>offPeakRate</code>/kWh. Return total daily bill.',
    constraints: ['kwh.length == 24', '0 <= kwh[i] <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'kwh = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,1], peakRate = 10, offPeakRate = 5', output: '195' },
      { title: 'Test Case 2', input: 'kwh = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0], peakRate = 12, offPeakRate = 4', output: '60' },
      { title: 'Test Case 3', input: 'kwh = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], peakRate = 10, offPeakRate = 3', output: '3' },
      { title: 'Test Case 4', input: 'kwh = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], peakRate = 10, offPeakRate = 5', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long totalElectricityBill(int[] kwh, int peakRate, int offPeakRate) {
        long bill = 0;
        for (int h = 0; h < 24; h++) {
            bill += (long) kwh[h] * ((h >= 18 && h <= 22) ? peakRate : offPeakRate);
        }
        return bill;
    }
}`,
    pythonSolution: `def totalElectricityBill(kwh, peakRate, offPeakRate):
    return sum(u * (peakRate if 18 <= h <= 22 else offPeakRate) for h, u in enumerate(kwh))`
  },
  {
    number: 36,
    title: 'Warehouse AGV Collision Check',
    fnName: 'countPathCollisions',
    description: 'Two AGV robots move on a 1D track from <code>0</code>. Robot A has positions <code>posA</code> and Robot B has positions <code>posB</code> at each second <code>i</code>. A collision occurs whenever <code>posA[i] == posB[i]</code> OR they cross each other between <code>i-1</code> and <code>i</code> (<code>(posA[i-1] - posB[i-1]) * (posA[i] - posB[i]) &lt; 0</code>). Return total collision events.',
    constraints: ['1 <= posA.length == posB.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'posA = [0, 2, 4, 6], posB = [5, 3, 1, 6]', output: '2' },
      { title: 'Test Case 2', input: 'posA = [1, 2, 3], posB = [1, 5, 6]', output: '1' },
      { title: 'Test Case 3', input: 'posA = [0, 1, 2], posB = [10, 11, 12]', output: '0' },
      { title: 'Test Case 4', input: 'posA = [0, 10], posB = [10, 0]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countPathCollisions(int[] posA, int[] posB) {
        int col = (posA[0] == posB[0]) ? 1 : 0;
        for (int i = 1; i < posA.length; i++) {
            if (posA[i] == posB[i]) col++;
            else if ((long)(posA[i - 1] - posB[i - 1]) * (posA[i] - posB[i]) < 0) col++;
        }
        return col;
    }
}`,
    pythonSolution: `def countPathCollisions(posA, posB):
    col = 1 if posA[0] == posB[0] else 0
    for i in range(1, len(posA)):
        if posA[i] == posB[i] or (posA[i-1] - posB[i-1]) * (posA[i] - posB[i]) < 0:
            col += 1
    return col`
  },
  {
    number: 37,
    title: 'Clickstream Session Timeout Splitter',
    fnName: 'countUserSessions',
    description: 'Given sorted click timestamps <code>clicks</code> (in seconds) for a user, a new session starts whenever the gap from the previous click is strictly greater than <code>timeout</code>. Return total number of sessions.',
    constraints: ['0 <= clicks.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'clicks = [10, 20, 100, 115, 300], timeout = 30', output: '3' },
      { title: 'Test Case 2', input: 'clicks = [10, 40, 70], timeout = 30', output: '1' },
      { title: 'Test Case 3', input: 'clicks = [], timeout = 10', output: '0' },
      { title: 'Test Case 4', input: 'clicks = [5], timeout = 10', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countUserSessions(int[] clicks, int timeout) {
        if (clicks.length == 0) return 0;
        int sessions = 1;
        for (int i = 1; i < clicks.length; i++) if (clicks[i] - clicks[i - 1] > timeout) sessions++;
        return sessions;
    }
}`,
    pythonSolution: `def countUserSessions(clicks, timeout):
    if not clicks: return 0
    return 1 + sum(1 for i in range(1, len(clicks)) if clicks[i] - clicks[i - 1] > timeout)`
  },
  {
    number: 38,
    title: 'Quality-Gate Tolerance Band Check',
    fnName: 'countOutOfSpecParts',
    description: 'Precision parts have nominal target <code>nominal</code> and tolerance <code>tol</code>. A part passes if <code>|measured[i] - nominal| &lt;= tol</code>. Return the count of failing parts.',
    constraints: ['1 <= measured.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'measured = [100, 102, 97, 106], nominal = 100, tol = 3', output: '1' },
      { title: 'Test Case 2', input: 'measured = [50, 52, 48], nominal = 50, tol = 2', output: '0' },
      { title: 'Test Case 3', input: 'measured = [10, 20], nominal = 0, tol = 5', output: '2' },
      { title: 'Test Case 4', input: 'measured = [15], nominal = 15, tol = 0', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countOutOfSpecParts(int[] measured, int nominal, int tol) {
        int fail = 0;
        for (int m : measured) if (Math.abs(m - nominal) > tol) fail++;
        return fail;
    }
}`,
    pythonSolution: `def countOutOfSpecParts(measured, nominal, tol):
    return sum(1 for m in measured if abs(m - nominal) > tol)`
  },
  {
    number: 39,
    title: 'Digital-Twin Sensor Drift Calibration',
    fnName: 'calibratedReadings',
    description: 'A sensor drifts linearly by <code>+driftPerStep</code> at each step <code>i</code> (0-indexed: total drift at index <code>i</code> is <code>i * driftPerStep</code>). Given raw readings <code>raw</code>, return the calibrated readings <code>raw[i] - i * driftPerStep</code>.',
    constraints: ['1 <= raw.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'raw = [10, 12, 14, 16], driftPerStep = 2', output: '[10, 10, 10, 10]' },
      { title: 'Test Case 2', input: 'raw = [5, 5, 5], driftPerStep = 1', output: '[5, 4, 3]' },
      { title: 'Test Case 3', input: 'raw = [100], driftPerStep = 50', output: '[100]' },
      { title: 'Test Case 4', input: 'raw = [10, 10], driftPerStep = -2', output: '[10, 12]' }
    ],
    javaSolution: `public class Solution {
    public static int[] calibratedReadings(int[] raw, int driftPerStep) {
        int[] res = new int[raw.length];
        for (int i = 0; i < raw.length; i++) res[i] = raw[i] - i * driftPerStep;
        return res;
    }
}`,
    pythonSolution: `def calibratedReadings(raw, driftPerStep):
    return [v - i * driftPerStep for i, v in enumerate(raw)]`
  },
  {
    number: 40,
    title: 'Store Planogram Shelf Fit',
    fnName: 'maxProductsOnShelf',
    description: 'Given product widths <code>widths</code> and a shelf of length <code>shelfLen</code>, return the maximum number of products that can be placed side-by-side on the shelf.',
    constraints: ['1 <= widths.length <= 10^5', '0 <= shelfLen <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'widths = [10, 30, 20, 5, 15], shelfLen = 35', output: '3' },
      { title: 'Test Case 2', input: 'widths = [50, 60], shelfLen = 40', output: '0' },
      { title: 'Test Case 3', input: 'widths = [5, 5, 5], shelfLen = 15', output: '3' },
      { title: 'Test Case 4', input: 'widths = [10], shelfLen = 0', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int maxProductsOnShelf(int[] widths, int shelfLen) {
        int[] w = widths.clone();
        Arrays.sort(w);
        int cnt = 0, used = 0;
        for (int x : w) {
            if (used + x <= shelfLen) { used += x; cnt++; }
            else break;
        }
        return cnt;
    }
}`,
    pythonSolution: `def maxProductsOnShelf(widths, shelfLen):
    cnt = used = 0
    for w in sorted(widths):
        if used + w <= shelfLen: used += w; cnt += 1
        else: break
    return cnt`
  },
  {
    number: 41,
    title: 'Fleet Fuel-Efficiency Outlier Count',
    fnName: 'countLowEfficiencyTrucks',
    description: 'Given truck fuel efficiencies <code>kmPerLiter</code> (integers), compute the integer-floor fleet average <code>avg</code>. Return how many trucks have efficiency strictly less than <code>avg - margin</code>.',
    constraints: ['1 <= kmPerLiter.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'kmPerLiter = [10, 10, 10, 2], margin = 2', output: '1' },
      { title: 'Test Case 2', input: 'kmPerLiter = [8, 9, 10], margin = 1', output: '0' },
      { title: 'Test Case 3', input: 'kmPerLiter = [5, 5, 5], margin = 0', output: '0' },
      { title: 'Test Case 4', input: 'kmPerLiter = [20, 20, 5, 5], margin = 5', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int countLowEfficiencyTrucks(int[] kmPerLiter, int margin) {
        long sum = 0; for (int x : kmPerLiter) sum += x;
        long avg = sum / kmPerLiter.length;
        int cnt = 0;
        for (int x : kmPerLiter) if (x < avg - margin) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countLowEfficiencyTrucks(kmPerLiter, margin):
    avg = sum(kmPerLiter) // len(kmPerLiter)
    return sum(1 for x in kmPerLiter if x < avg - margin)`
  },
  {
    number: 42,
    title: 'Shift-Roster Consecutive Night Cap',
    fnName: 'countRosterViolations',
    description: 'An employee schedule string <code>roster</code> uses <code>\'N\'</code> for night shift and <code>\'D\'</code>/<code>\'O\'</code> for day/off. Policy forbids more than <code>maxNights</code> consecutive night shifts. Return <code>true</code> if the roster is compliant, else <code>false</code>.',
    constraints: ['1 <= roster.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'roster = "DDNNDNNND", maxNights = 3', output: 'true' },
      { title: 'Test Case 2', input: 'roster = "NNNND", maxNights = 3', output: 'false' },
      { title: 'Test Case 3', input: 'roster = "DDDD", maxNights = 0', output: 'true' },
      { title: 'Test Case 4', input: 'roster = "N", maxNights = 0', output: 'false' }
    ],
    javaSolution: `public class Solution {
    public static boolean countRosterViolations(String roster, int maxNights) {
        int run = 0;
        for (char c : roster.toCharArray()) {
            if (c == 'N') { if (++run > maxNights) return false; }
            else run = 0;
        }
        return true;
    }
}`,
    pythonSolution: `def countRosterViolations(roster, maxNights):
    run = 0
    for c in roster:
        run = run + 1 if c == 'N' else 0
        if run > maxNights: return False
    return True`
  },
  {
    number: 43,
    title: 'Supplier Lead-Time Reliability Rate',
    fnName: 'mostReliableSupplier',
    description: 'Given supplier IDs <code>supplierId</code> and whether each delivery was on-time <code>onTime</code> (boolean), return the supplier ID with the highest on-time count (break ties by smallest supplier ID).',
    constraints: ['1 <= supplierId.length == onTime.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'supplierId = [10, 20, 10, 20, 20], onTime = [true, true, true, false, true]', output: '10' },
      { title: 'Test Case 2', input: 'supplierId = [1, 2, 2], onTime = [false, true, true]', output: '2' },
      { title: 'Test Case 3', input: 'supplierId = [5, 3], onTime = [false, false]', output: '3' },
      { title: 'Test Case 4', input: 'supplierId = [7], onTime = [true]', output: '7' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int mostReliableSupplier(int[] supplierId, boolean[] onTime) {
        Map<Integer, Integer> cnt = new HashMap<>();
        for (int i = 0; i < supplierId.length; i++) {
            cnt.putIfAbsent(supplierId[i], 0);
            if (onTime[i]) cnt.put(supplierId[i], cnt.get(supplierId[i]) + 1);
        }
        int bestId = Integer.MAX_VALUE, bestC = -1;
        for (Map.Entry<Integer, Integer> e : cnt.entrySet()) {
            if (e.getValue() > bestC || (e.getValue() == bestC && e.getKey() < bestId)) {
                bestId = e.getKey(); bestC = e.getValue();
            }
        }
        return bestId;
    }
}`,
    pythonSolution: `def mostReliableSupplier(supplierId, onTime):
    cnt = {sid: 0 for sid in supplierId}
    for sid, ok in zip(supplierId, onTime):
        if ok: cnt[sid] += 1
    return min(cnt.keys(), key=lambda s: (-cnt[s], s))`
  },
  {
    number: 44,
    title: 'Energy Grid Load-Shedding Minimum Feeders',
    fnName: 'minFeedersToShed',
    description: 'A substation must reduce load by at least <code>targetMW</code>. Available feeders have loads <code>feeders</code> MW. Return the minimum number of feeders to shed to reach at least <code>targetMW</code>, or <code>-1</code> if impossible.',
    constraints: ['1 <= feeders.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'feeders = [10, 40, 20, 30], targetMW = 65', output: '2' },
      { title: 'Test Case 2', input: 'feeders = [10, 20], targetMW = 50', output: '-1' },
      { title: 'Test Case 3', input: 'feeders = [50], targetMW = 0', output: '0' },
      { title: 'Test Case 4', input: 'feeders = [15, 25, 10], targetMW = 25', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minFeedersToShed(int[] feeders, long targetMW) {
        if (targetMW <= 0) return 0;
        int[] f = feeders.clone();
        Arrays.sort(f);
        long shed = 0; int cnt = 0;
        for (int i = f.length - 1; i >= 0; i--) {
            shed += f[i]; cnt++;
            if (shed >= targetMW) return cnt;
        }
        return -1;
    }
}`,
    pythonSolution: `def minFeedersToShed(feeders, targetMW):
    if targetMW <= 0: return 0
    shed = cnt = 0
    for x in sorted(feeders, reverse=True):
        shed += x; cnt += 1
        if shed >= targetMW: return cnt
    return -1`
  },
  {
    number: 45,
    title: 'Returns-Portal Restocking Fee',
    fnName: 'netRefundAmount',
    description: 'Returned items have prices <code>prices</code> and condition codes <code>cond</code> (<code>"NEW"</code> -> 0% fee, <code>"OPENED"</code> -> 15% fee, <code>"DAMAGED"</code> -> 40% fee, integer floor). Return total net refund paid across all items.',
    constraints: ['1 <= prices.length == cond.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'prices = [1000, 1000, 1000], cond = ["NEW", "OPENED", "DAMAGED"]', output: '2450' },
      { title: 'Test Case 2', input: 'prices = [200], cond = ["OPENED"]', output: '170' },
      { title: 'Test Case 3', input: 'prices = [500], cond = ["NEW"]', output: '500' },
      { title: 'Test Case 4', input: 'prices = [100], cond = ["DAMAGED"]', output: '60' }
    ],
    javaSolution: `public class Solution {
    public static long netRefundAmount(int[] prices, String[] cond) {
        long total = 0;
        for (int i = 0; i < prices.length; i++) {
            int pct = cond[i].equals("NEW") ? 100 : cond[i].equals("OPENED") ? 85 : 60;
            total += (long) prices[i] * pct / 100;
        }
        return total;
    }
}`,
    pythonSolution: `def netRefundAmount(prices, cond):
    keep = {'NEW': 100, 'OPENED': 85, 'DAMAGED': 60}
    return sum((p * keep[c]) // 100 for p, c in zip(prices, cond))`
  },
  {
    number: 46,
    title: 'Order-Fulfillment SLA Breach Count',
    fnName: 'countSlaMisses',
    description: 'Orders have creation time <code>created</code>, ship time <code>shipped</code>, and priority <code>isExpress</code> (Express SLA = 24h, Standard SLA = 72h). Return how many orders missed their SLA (<code>shipped - created &gt; sla</code>).',
    constraints: ['1 <= created.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'created = [0, 10, 20], shipped = [25, 80, 95], isExpress = [true, false, false]', output: '2' },
      { title: 'Test Case 2', input: 'created = [10, 10], shipped = [34, 82], isExpress = [true, false]', output: '0' },
      { title: 'Test Case 3', input: 'created = [0], shipped = [25], isExpress = [true]', output: '1' },
      { title: 'Test Case 4', input: 'created = [5], shipped = [10], isExpress = [false]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countSlaMisses(int[] created, int[] shipped, boolean[] isExpress) {
        int miss = 0;
        for (int i = 0; i < created.length; i++) {
            int sla = isExpress[i] ? 24 : 72;
            if (shipped[i] - created[i] > sla) miss++;
        }
        return miss;
    }
}`,
    pythonSolution: `def countSlaMisses(created, shipped, isExpress):
    return sum(1 for c, s, ex in zip(created, shipped, isExpress) if s - c > (24 if ex else 72))`
  },
  {
    number: 47,
    title: 'Packaging Cartonization Optimal Pair',
    fnName: 'countExactPairCartons',
    description: 'Given sorted item weights <code>weights</code> and a carton capacity <code>cap</code>, pair the heaviest remaining item with the lightest remaining item if their sum <code>&lt;= cap</code>, otherwise ship the heaviest alone. Return minimum cartons needed.',
    constraints: ['1 <= weights.length <= 10^5', '1 <= weights[i] <= cap'],
    testCases: [
      { title: 'Test Case 1', input: 'weights = [10, 20, 30, 40], cap = 50', output: '2' },
      { title: 'Test Case 2', input: 'weights = [20, 30, 40, 50], cap = 50', output: '3' },
      { title: 'Test Case 3', input: 'weights = [25, 25, 25], cap = 50', output: '2' },
      { title: 'Test Case 4', input: 'weights = [10], cap = 10', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countExactPairCartons(int[] weights, int cap) {
        int[] w = weights.clone(); Arrays.sort(w);
        int l = 0, r = w.length - 1, cartons = 0;
        while (l <= r) { if (w[l] + w[r] <= cap) l++; r--; cartons++; }
        return cartons;
    }
}`,
    pythonSolution: `def countExactPairCartons(weights, cap):
    w = sorted(weights); l, r, cartons = 0, len(w) - 1, 0
    while l <= r:
        if w[l] + w[r] <= cap: l += 1
        r -= 1; cartons += 1
    return cartons`
  },
  {
    number: 48,
    title: 'Telemetry Delta-Encoding Compression',
    fnName: 'deltaEncodeStream',
    description: 'Compress a telemetry series <code>readings</code> by keeping <code>readings[0]</code> and replacing every subsequent <code>readings[i]</code> with <code>readings[i] - readings[i - 1]</code>. Return the delta-encoded array.',
    constraints: ['1 <= readings.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'readings = [100, 102, 105, 101]', output: '[100, 2, 3, -4]' },
      { title: 'Test Case 2', input: 'readings = [50, 50, 50]', output: '[50, 0, 0]' },
      { title: 'Test Case 3', input: 'readings = [42]', output: '[42]' },
      { title: 'Test Case 4', input: 'readings = [10, 5, 0]', output: '[10, -5, -5]' }
    ],
    javaSolution: `public class Solution {
    public static int[] deltaEncodeStream(int[] readings) {
        int[] res = new int[readings.length];
        res[0] = readings[0];
        for (int i = 1; i < readings.length; i++) res[i] = readings[i] - readings[i - 1];
        return res;
    }
}`,
    pythonSolution: `def deltaEncodeStream(readings):
    return [readings[0]] + [readings[i] - readings[i - 1] for i in range(1, len(readings))]`
  },
  {
    number: 49,
    title: 'Conveyor Barcode Misread Recovery',
    fnName: 'countRecoverableScans',
    description: 'A scanner outputs strings where unreadable characters are marked <code>\'?\'</code>. A scan is recoverable if it has at most 1 <code>\'?\'</code> AND its length is at least <code>minLen</code>. Return count of recoverable scans.',
    constraints: ['1 <= scans.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'scans = ["AB?12", "A??12", "123", "XYZ99"], minLen = 5', output: '2' },
      { title: 'Test Case 2', input: 'scans = ["?", "??"], minLen = 1', output: '1' },
      { title: 'Test Case 3', input: 'scans = ["ABCD"], minLen = 5', output: '0' },
      { title: 'Test Case 4', input: 'scans = ["12345"], minLen = 5', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countRecoverableScans(String[] scans, int minLen) {
        int ok = 0;
        for (String s : scans) {
            if (s.length() < minLen) continue;
            int q = 0;
            for (char c : s.toCharArray()) if (c == '?') q++;
            if (q <= 1) ok++;
        }
        return ok;
    }
}`,
    pythonSolution: `def countRecoverableScans(scans, minLen):
    return sum(1 for s in scans if len(s) >= minLen and s.count('?') <= 1)`
  },
  {
    number: 50,
    title: 'SKU Demand Seasonal Peak Window',
    fnName: 'bestSeasonalQuarterStart',
    description: 'Given 12 monthly demand values <code>demand</code>, find the 0-based starting month <code>i</code> (0..9) of the 3-month quarter with the highest total demand (break ties by earliest month).',
    constraints: ['demand.length == 12'],
    testCases: [
      { title: 'Test Case 1', input: 'demand = [10, 10, 10, 20, 30, 40, 10, 10, 10, 50, 50, 50]', output: '9' },
      { title: 'Test Case 2', input: 'demand = [100, 100, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0]', output: '0' },
      { title: 'Test Case 3', input: 'demand = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]', output: '0' },
      { title: 'Test Case 4', input: 'demand = [1, 2, 3, 10, 20, 30, 40, 1, 1, 1, 1, 1]', output: '4' }
    ],
    javaSolution: `public class Solution {
    public static int bestSeasonalQuarterStart(int[] demand) {
        int bestIdx = 0, bestSum = demand[0] + demand[1] + demand[2];
        int cur = bestSum;
        for (int i = 1; i <= 9; i++) {
            cur += demand[i + 2] - demand[i - 1];
            if (cur > bestSum) { bestSum = cur; bestIdx = i; }
        }
        return bestIdx;
    }
}`,
    pythonSolution: `def bestSeasonalQuarterStart(demand):
    best_i, best_s = 0, sum(demand[:3])
    cur = best_s
    for i in range(1, 10):
        cur += demand[i + 2] - demand[i - 1]
        if cur > best_s: best_s, best_i = cur, i
    return best_i`
  }
];
