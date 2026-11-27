export const HEXAWARE_P2 = [
  {
    number: 31,
    title: 'Flight Layover Minimum Connection',
    fnName: 'minValidFlightTime',
    description: 'A passenger flies from A to B then B to C. Outbound flights have arrival times <code>arrA</code> and inbound flights have departure times <code>depB</code>. A connection is valid if <code>depB[j] - arrA[i] &gt;= minLayover</code>. Return the earliest valid <code>depB[j]</code> (or <code>-1</code> if none).',
    constraints: ['1 <= arrA.length, depB.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'arrA = [600, 720], depB = [630, 700, 800], minLayover = 45', output: '700' },
      { title: 'Test Case 2', input: 'arrA = [500], depB = [520, 530], minLayover = 40', output: '-1' },
      { title: 'Test Case 3', input: 'arrA = [100], depB = [160], minLayover = 60', output: '160' },
      { title: 'Test Case 4', input: 'arrA = [300, 200], depB = [250, 220], minLayover = 30', output: '250' }
    ],
    javaSolution: `public class Solution {
    public static int minValidFlightTime(int[] arrA, int[] depB, int minLayover) {
        int minArr = arrA[0];
        for (int a : arrA) minArr = Math.min(minArr, a);
        int best = Integer.MAX_VALUE;
        for (int d : depB) if (d >= minArr + minLayover) best = Math.min(best, d);
        return best == Integer.MAX_VALUE ? -1 : best;
    }
}`,
    pythonSolution: `def minValidFlightTime(arrA, depB, minLayover):
    earliest = min(arrA) + minLayover
    cands = [d for d in depB if d >= earliest]
    return min(cands) if cands else -1`
  },
  {
    number: 32,
    title: 'ATM Cash-Cassette Note Dispenser',
    fnName: 'minAtmNotes',
    description: 'An ATM holds unlimited 500, 200, and 100 rupee notes. Given withdrawal <code>amount</code> (multiple of 100), return the minimum total notes dispensed, or <code>-1</code> if not a multiple of 100 or &lt;= 0.',
    constraints: ['0 <= amount <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'amount = 1800', output: '5' },
      { title: 'Test Case 2', input: 'amount = 350', output: '-1' },
      { title: 'Test Case 3', input: 'amount = 700', output: '2' },
      { title: 'Test Case 4', input: 'amount = 100', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static long minAtmNotes(long amount) {
        if (amount <= 0 || amount % 100 != 0) return -1;
        long n500 = amount / 500; amount %= 500;
        long n200 = amount / 200; amount %= 200;
        return n500 + n200 + amount / 100;
    }
}`,
    pythonSolution: `def minAtmNotes(amount):
    if amount <= 0 or amount % 100 != 0: return -1
    n500, rem = divmod(amount, 500)
    n200, rem = divmod(rem, 200)
    return n500 + n200 + rem // 100`
  },
  {
    number: 33,
    title: 'Insurance Claim Deductible Cap',
    fnName: 'totalInsurerPayout',
    description: 'A health policy has an annual deductible <code>deductible</code> and an out-of-pocket max payout cap <code>maxPayout</code>. Given sequential hospital bills <code>bills</code>, the policyholder pays the first <code>deductible</code> total, and the insurer pays everything after up to <code>maxPayout</code> total. Return total insurer payout.',
    constraints: ['1 <= bills.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'bills = [400, 800, 2000], deductible = 1000, maxPayout = 1500', output: '1500' },
      { title: 'Test Case 2', input: 'bills = [300, 400], deductible = 1000, maxPayout = 5000', output: '0' },
      { title: 'Test Case 3', input: 'bills = [1500], deductible = 500, maxPayout = 2000', output: '1000' },
      { title: 'Test Case 4', input: 'bills = [200, 300, 500], deductible = 0, maxPayout = 800', output: '800' }
    ],
    javaSolution: `public class Solution {
    public static long totalInsurerPayout(int[] bills, long deductible, long maxPayout) {
        long total = 0; for (int b : bills) total += b;
        return Math.min(maxPayout, Math.max(0L, total - deductible));
    }
}`,
    pythonSolution: `def totalInsurerPayout(bills, deductible, maxPayout):
    return min(maxPayout, max(0, sum(bills) - deductible))`
  },
  {
    number: 34,
    title: 'Seat-Map Contiguous Family Block',
    fnName: 'countRowsWithFamilyBlock',
    description: 'A theater seating chart <code>seats</code> (0 = empty, 1 = booked) has <code>R</code> rows. Return how many rows contain at least one contiguous block of <code>k</code> empty seats.',
    constraints: ['1 <= R, C <= 200', '1 <= k <= C'],
    testCases: [
      { title: 'Test Case 1', input: 'seats = [[1, 0, 0, 0, 1], [0, 1, 0, 1, 0], [0, 0, 0, 0, 0]], k = 3', output: '2' },
      { title: 'Test Case 2', input: 'seats = [[1, 1], [1, 1]], k = 1', output: '0' },
      { title: 'Test Case 3', input: 'seats = [[0, 0, 1, 0, 0]], k = 3', output: '0' },
      { title: 'Test Case 4', input: 'seats = [[0, 0, 0]], k = 3', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countRowsWithFamilyBlock(int[][] seats, int k) {
        int rows = 0;
        for (int[] row : seats) {
            int run = 0; boolean ok = false;
            for (int s : row) {
                if (s == 0) { if (++run >= k) { ok = true; break; } }
                else run = 0;
            }
            if (ok) rows++;
        }
        return rows;
    }
}`,
    pythonSolution: `def countRowsWithFamilyBlock(seats, k):
    rows = 0
    for row in seats:
        run = 0
        for s in row:
            run = run + 1 if s == 0 else 0
            if run >= k: rows += 1; break
    return rows`
  },
  {
    number: 35,
    title: 'Baggage Weight Excess Fee Calculator',
    fnName: 'totalExcessBaggageFee',
    description: 'Each passenger is allowed <code>freeKg</code> kg of checked baggage. Every kg above <code>freeKg</code> is charged <code>feePerKg</code>. Given passenger bag weights <code>weights</code>, return total excess fees collected.',
    constraints: ['1 <= weights.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'weights = [15, 22, 18, 25], freeKg = 20, feePerKg = 500', output: '3500' },
      { title: 'Test Case 2', input: 'weights = [10, 20], freeKg = 20, feePerKg = 100', output: '0' },
      { title: 'Test Case 3', input: 'weights = [30], freeKg = 15, feePerKg = 200', output: '3000' },
      { title: 'Test Case 4', input: 'weights = [0, 5], freeKg = 10, feePerKg = 50', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long totalExcessBaggageFee(int[] weights, int freeKg, int feePerKg) {
        long total = 0;
        for (int w : weights) if (w > freeKg) total += (long) (w - freeKg) * feePerKg;
        return total;
    }
}`,
    pythonSolution: `def totalExcessBaggageFee(weights, freeKg, feePerKg):
    return sum((w - freeKg) * feePerKg for w in weights if w > freeKg)`
  },
  {
    number: 36,
    title: 'RPA CSV Quoted-Field Counter',
    fnName: 'countCsvFields',
    description: 'An RPA bot parses a single CSV line <code>line</code> where fields are separated by commas <code>,</code>, except commas inside double quotes <code>"..."</code> are literal. Return the number of fields in <code>line</code>.',
    constraints: ['1 <= line.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'line = "Alice,\\"New York, NY\\",30"', output: '3' },
      { title: 'Test Case 2', input: 'line = "a,b,c,d"', output: '4' },
      { title: 'Test Case 3', input: 'line = "\\"only,one,field\\""', output: '1' },
      { title: 'Test Case 4', input: 'line = "single"', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countCsvFields(String line) {
        int fields = 1; boolean inQ = false;
        for (char c : line.toCharArray()) {
            if (c == '"') inQ = !inQ;
            else if (c == ',' && !inQ) fields++;
        }
        return fields;
    }
}`,
    pythonSolution: `def countCsvFields(line):
    fields, in_q = 1, False
    for c in line:
        if c == '"': in_q = not in_q
        elif c == ',' and not in_q: fields += 1
    return fields`
  },
  {
    number: 37,
    title: 'Loyalty Miles FIFO Redemption',
    fnName: 'remainingValidMiles',
    description: 'Miles earned in batches <code>batches</code> <code>[miles, expiryDay]</code> expire at the end of <code>expiryDay</code>. Given <code>redeem</code> miles redeemed before <code>checkDay</code> (using oldest non-expired batches with <code>expiryDay &gt;= checkDay</code>), return remaining un-expired miles on <code>checkDay</code>.',
    constraints: ['1 <= batches.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'batches = [[500, 10], [800, 30], [400, 50]], redeem = 600, checkDay = 20', output: '600' },
      { title: 'Test Case 2', input: 'batches = [[100, 5]], redeem = 0, checkDay = 10', output: '0' },
      { title: 'Test Case 3', input: 'batches = [[1000, 20]], redeem = 1200, checkDay = 10', output: '0' },
      { title: 'Test Case 4', input: 'batches = [[300, 20], [500, 40]], redeem = 200, checkDay = 20', output: '600' }
    ],
    javaSolution: `public class Solution {
    public static long remainingValidMiles(int[][] batches, long redeem, int checkDay) {
        long avail = 0;
        for (int[] b : batches) if (b[1] >= checkDay) avail += b[0];
        return Math.max(0L, avail - redeem);
    }
}`,
    pythonSolution: `def remainingValidMiles(batches, redeem, checkDay):
    avail = sum(m for m, exp in batches if exp >= checkDay)
    return max(0, avail - redeem)`
  },
  {
    number: 38,
    title: 'Toll-Booth Fastag Low-Balance Alerts',
    fnName: 'countTollRejections',
    description: 'A vehicle starts with Fastag balance <code>bal</code> and passes toll plazas with fees <code>tolls</code>. If balance &gt;= toll, it deducts the toll; otherwise the gate rejects (balance unchanged) and increments rejection count. Return total rejections.',
    constraints: ['1 <= tolls.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'bal = 200, tolls = [80, 100, 50, 20]', output: '1' },
      { title: 'Test Case 2', input: 'bal = 50, tolls = [60, 70]', output: '2' },
      { title: 'Test Case 3', input: 'bal = 500, tolls = [100, 100, 100]', output: '0' },
      { title: 'Test Case 4', input: 'bal = 100, tolls = [100, 1]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countTollRejections(long bal, int[] tolls) {
        int rej = 0;
        for (int t : tolls) { if (bal >= t) bal -= t; else rej++; }
        return rej;
    }
}`,
    pythonSolution: `def countTollRejections(bal, tolls):
    rej = 0
    for t in tolls:
        if bal >= t: bal -= t
        else: rej += 1
    return rej`
  },
  {
    number: 39,
    title: 'Train Berth Type Classifier',
    fnName: 'classifyBerths',
    description: 'In Indian Railways 8-berth bays (1..8 repeating), berths <code>% 8</code> map as: 1,4 -> <code>"LB"</code>, 2,5 -> <code>"MB"</code>, 3,6 -> <code>"UB"</code>, 7 -> <code>"SL"</code>, 0 -> <code>"SU"</code>. Given berth numbers <code>berths</code>, return their berth type codes.',
    constraints: ['1 <= berths.length <= 10^4', '1 <= berths[i] <= 72'],
    testCases: [
      { title: 'Test Case 1', input: 'berths = [1, 2, 3, 7, 8]', output: '["LB", "MB", "UB", "SL", "SU"]' },
      { title: 'Test Case 2', input: 'berths = [4, 5, 6]', output: '["LB", "MB", "UB"]' },
      { title: 'Test Case 3', input: 'berths = [72]', output: '["SU"]' },
      { title: 'Test Case 4', input: 'berths = [9]', output: '["LB"]' }
    ],
    javaSolution: `public class Solution {
    public static String[] classifyBerths(int[] berths) {
        String[] map = {"SU", "LB", "MB", "UB", "LB", "MB", "UB", "SL"};
        String[] res = new String[berths.length];
        for (int i = 0; i < berths.length; i++) res[i] = map[berths[i] % 8];
        return res;
    }
}`,
    pythonSolution: `def classifyBerths(berths):
    m = ['SU', 'LB', 'MB', 'UB', 'LB', 'MB', 'UB', 'SL']
    return [m[b % 8] for b in berths]`
  },
  {
    number: 40,
    title: 'Cheque-Clearing Batch Cut-Off',
    fnName: 'splitClearingBatches',
    description: 'Cheques arrive with timestamps <code>times</code> (sorted, in minutes). Any cheque arriving strictly after <code>cutoff</code> moves to next-day clearing. Return <code>[sameDayCount, nextDayCount]</code>.',
    constraints: ['1 <= times.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'times = [500, 600, 720, 721, 900], cutoff = 720', output: '[3, 2]' },
      { title: 'Test Case 2', input: 'times = [100, 200], cutoff = 500', output: '[2, 0]' },
      { title: 'Test Case 3', input: 'times = [800, 900], cutoff = 700', output: '[0, 2]' },
      { title: 'Test Case 4', input: 'times = [720], cutoff = 720', output: '[1, 0]' }
    ],
    javaSolution: `public class Solution {
    public static int[] splitClearingBatches(int[] times, int cutoff) {
        int lo = 0, hi = times.length;
        while (lo < hi) { int m = (lo + hi) >>> 1; if (times[m] <= cutoff) lo = m + 1; else hi = m; }
        return new int[]{lo, times.length - lo};
    }
}`,
    pythonSolution: `def splitClearingBatches(times, cutoff):
    import bisect
    idx = bisect.bisect_right(times, cutoff)
    return [idx, len(times) - idx]`
  },
  {
    number: 41,
    title: 'Policy Nominee Share Validation',
    fnName: 'countValidNomineePolicies',
    description: 'Each insurance policy lists nominee share percentages in <code>policies</code>. A policy is valid if all shares are strictly positive (<code>&gt; 0</code>) and sum to exactly <code>100</code>. Return the count of valid policies.',
    constraints: ['1 <= policies.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'policies = [[50, 50], [100], [60, 50], [100, 0]]', output: '2' },
      { title: 'Test Case 2', input: 'policies = [[33, 33, 34]]', output: '1' },
      { title: 'Test Case 3', input: 'policies = [[0, 100]]', output: '0' },
      { title: 'Test Case 4', input: 'policies = [[]]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countValidNomineePolicies(int[][] policies) {
        int valid = 0;
        for (int[] p : policies) {
            if (p.length == 0) continue;
            int s = 0; boolean pos = true;
            for (int x : p) { if (x <= 0) { pos = false; break; } s += x; }
            if (pos && s == 100) valid++;
        }
        return valid;
    }
}`,
    pythonSolution: `def countValidNomineePolicies(policies):
    return sum(1 for p in policies if p and all(x > 0 for x in p) and sum(p) == 100)`
  },
  {
    number: 42,
    title: 'Airport Gate Assignment Minimum Gates',
    fnName: 'minAirportGates',
    description: 'Given flight gate intervals <code>flights</code> <code>[arrival, departure]</code>, if a plane arrives at the exact minute another departs, it requires a separate gate. Return minimum gates required.',
    constraints: ['1 <= flights.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'flights = [[100, 150], [120, 180], [150, 200]]', output: '3' },
      { title: 'Test Case 2', input: 'flights = [[10, 20], [30, 40]]', output: '1' },
      { title: 'Test Case 3', input: 'flights = [[1, 10], [2, 10], [3, 10]]', output: '3' },
      { title: 'Test Case 4', input: 'flights = [[5, 10]]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minAirportGates(int[][] flights) {
        int n = flights.length;
        int[] a = new int[n], d = new int[n];
        for (int i = 0; i < n; i++) { a[i] = flights[i][0]; d[i] = flights[i][1]; }
        Arrays.sort(a); Arrays.sort(d);
        int i = 0, j = 0, cur = 0, best = 0;
        while (i < n) {
            if (a[i] <= d[j]) { cur++; best = Math.max(best, cur); i++; }
            else { cur--; j++; }
        }
        return best;
    }
}`,
    pythonSolution: `def minAirportGates(flights):
    a = sorted(f[0] for f in flights); d = sorted(f[1] for f in flights)
    i = j = cur = best = 0
    while i < len(a):
        if a[i] <= d[j]: cur += 1; best = max(best, cur); i += 1
        else: cur -= 1; j += 1
    return best`
  },
  {
    number: 43,
    title: 'Dynamic Ride Surge Multiplier',
    fnName: 'computeSurgeFares',
    description: 'A ride-hailing engine computes surge percentage: <code>100 + max(0, (demand[i] - supply[i]) * 10)</code>, capped at <code>maxPct</code>. Given <code>baseFare</code>, return final integer-floor fares <code>baseFare * surgePct // 100</code>.',
    constraints: ['1 <= demand.length == supply.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'baseFare = 100, demand = [10, 15, 30], supply = [12, 10, 10], maxPct = 200', output: '[100, 150, 200]' },
      { title: 'Test Case 2', input: 'baseFare = 200, demand = [5], supply = [10], maxPct = 300', output: '[200]' },
      { title: 'Test Case 3', input: 'baseFare = 150, demand = [20], supply = [10], maxPct = 250', output: '[300]' },
      { title: 'Test Case 4', input: 'baseFare = 100, demand = [50], supply = [0], maxPct = 180', output: '[180]' }
    ],
    javaSolution: `public class Solution {
    public static int[] computeSurgeFares(int baseFare, int[] demand, int[] supply, int maxPct) {
        int[] res = new int[demand.length];
        for (int i = 0; i < demand.length; i++) {
            int pct = Math.min(maxPct, 100 + Math.max(0, demand[i] - supply[i]) * 10);
            res[i] = baseFare * pct / 100;
        }
        return res;
    }
}`,
    pythonSolution: `def computeSurgeFares(baseFare, demand, supply, maxPct):
    return [baseFare * min(maxPct, 100 + max(0, d - s) * 10) // 100 for d, s in zip(demand, supply)]`
  },
  {
    number: 44,
    title: 'Boarding-Pass Zone Priority Sort',
    fnName: 'sortBoardingZones',
    description: 'Passengers have boarding group codes <code>groups</code> (<code>"FIRST"</code>, <code>"BUSINESS"</code>, <code>"PREMIUM"</code>, <code>"ECONOMY"</code>). Sort passenger IDs <code>ids</code> by boarding priority (FIRST -> BUSINESS -> PREMIUM -> ECONOMY), preserving original order within the same group.',
    constraints: ['1 <= ids.length == groups.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'ids = [101, 102, 103, 104], groups = ["ECONOMY", "FIRST", "BUSINESS", "FIRST"]', output: '[102, 104, 103, 101]' },
      { title: 'Test Case 2', input: 'ids = [1, 2], groups = ["PREMIUM", "BUSINESS"]', output: '[2, 1]' },
      { title: 'Test Case 3', input: 'ids = [5, 6, 7], groups = ["ECONOMY", "ECONOMY", "ECONOMY"]', output: '[5, 6, 7]' },
      { title: 'Test Case 4', input: 'ids = [9], groups = ["FIRST"]', output: '[9]' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int[] sortBoardingZones(int[] ids, String[] groups) {
        Map<String, Integer> rank = Map.of("FIRST", 0, "BUSINESS", 1, "PREMIUM", 2, "ECONOMY", 3);
        Integer[] idx = new Integer[ids.length];
        for (int i = 0; i < ids.length; i++) idx[i] = i;
        Arrays.sort(idx, (a, b) -> {
            int c = Integer.compare(rank.get(groups[a]), rank.get(groups[b]));
            return c != 0 ? c : Integer.compare(a, b);
        });
        int[] res = new int[ids.length];
        for (int i = 0; i < ids.length; i++) res[i] = ids[idx[i]];
        return res;
    }
}`,
    pythonSolution: `def sortBoardingZones(ids, groups):
    rank = {'FIRST': 0, 'BUSINESS': 1, 'PREMIUM': 2, 'ECONOMY': 3}
    return [i for i, _ in sorted(zip(ids, groups), key=lambda p: rank[p[1]])]`
  },
  {
    number: 45,
    title: 'Credit-Card Reward Category Cap',
    fnName: 'totalRewardPoints',
    description: 'A card gives 5 points per 100 spent on <code>"DINING"</code> (capped at 500 points total for DINING) and 1 point per 100 spent on all other categories (integer floor per transaction). Given <code>amounts</code> and <code>cats</code>, return total points earned.',
    constraints: ['1 <= amounts.length == cats.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'amounts = [5000, 10000, 2000], cats = ["DINING", "DINING", "TRAVEL"]', output: '520' },
      { title: 'Test Case 2', input: 'amounts = [400, 199], cats = ["DINING", "GROCERY"]', output: '21' },
      { title: 'Test Case 3', input: 'amounts = [20000], cats = ["DINING"]', output: '500' },
      { title: 'Test Case 4', input: 'amounts = [1000], cats = ["FUEL"]', output: '10' }
    ],
    javaSolution: `public class Solution {
    public static long totalRewardPoints(int[] amounts, String[] cats) {
        long dining = 0, other = 0;
        for (int i = 0; i < amounts.length; i++) {
            if (cats[i].equals("DINING")) dining += (amounts[i] / 100L) * 5;
            else other += amounts[i] / 100L;
        }
        return Math.min(500L, dining) + other;
    }
}`,
    pythonSolution: `def totalRewardPoints(amounts, cats):
    dining = sum((a // 100) * 5 for a, c in zip(amounts, cats) if c == 'DINING')
    other = sum(a // 100 for a, c in zip(amounts, cats) if c != 'DINING')
    return min(500, dining) + other`
  },
  {
    number: 46,
    title: 'Travel Itinerary Continuity Check',
    fnName: 'isContinuousRoute',
    description: 'Given a sequence of flight legs <code>legs</code> <code>[origin, destination]</code> in chronological order, return <code>true</code> if every leg\'s origin equals the previous leg\'s destination.',
    constraints: ['1 <= legs.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'legs = [["DEL", "DXB"], ["DXB", "LHR"], ["LHR", "JFK"]]', output: 'true' },
      { title: 'Test Case 2', input: 'legs = [["BLR", "BOM"], ["DEL", "SIN"]]', output: 'false' },
      { title: 'Test Case 3', input: 'legs = [["MAA", "HYD"]]', output: 'true' },
      { title: 'Test Case 4', input: 'legs = [["A", "B"], ["B", "A"]]', output: 'true' }
    ],
    javaSolution: `public class Solution {
    public static boolean isContinuousRoute(String[][] legs) {
        for (int i = 1; i < legs.length; i++) if (!legs[i][0].equals(legs[i - 1][1])) return false;
        return true;
    }
}`,
    pythonSolution: `def isContinuousRoute(legs):
    return all(legs[i][0] == legs[i - 1][1] for i in range(1, len(legs)))`
  },
  {
    number: 47,
    title: 'Hotel Room Upgrade Chain',
    fnName: 'maxFinalRoomTier',
    description: 'A hotel has room tiers <code>0..n-1</code>. Upgrade vouchers <code>upgrades</code> <code>[fromTier, toTier]</code> allow upgrading if you currently hold <code>fromTier</code>. Starting at tier <code>start</code>, return the highest tier reachable.',
    constraints: ['1 <= n <= 5000', '0 <= start < n'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 5, upgrades = [[0, 2], [2, 4], [1, 3]], start = 0', output: '4' },
      { title: 'Test Case 2', input: 'n = 4, upgrades = [[1, 3]], start = 0', output: '0' },
      { title: 'Test Case 3', input: 'n = 4, upgrades = [[0, 1], [1, 2], [2, 0]], start = 0', output: '2' },
      { title: 'Test Case 4', input: 'n = 3, upgrades = [[0, 2], [0, 1]], start = 0', output: '2' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int maxFinalRoomTier(int n, int[][] upgrades, int start) {
        List<List<Integer>> g = new ArrayList<>(); for (int i = 0; i < n; i++) g.add(new ArrayList<>());
        for (int[] u : upgrades) g.get(u[0]).add(u[1]);
        boolean[] vis = new boolean[n]; vis[start] = true;
        Deque<Integer> q = new ArrayDeque<>(); q.add(start);
        int best = start;
        while (!q.isEmpty()) {
            int u = q.poll(); best = Math.max(best, u);
            for (int v : g.get(u)) if (!vis[v]) { vis[v] = true; q.add(v); }
        }
        return best;
    }
}`,
    pythonSolution: `def maxFinalRoomTier(n, upgrades, start):
    from collections import deque
    g = [[] for _ in range(n)]
    for u, v in upgrades: g[u].append(v)
    vis = {start}; q = deque([start])
    while q:
        u = q.popleft()
        for v in g[u]:
            if v not in vis: vis.add(v); q.append(v)
    return max(vis)`
  },
  {
    number: 48,
    title: 'EMI Principal vs Interest First Month',
    fnName: 'firstMonthPrincipal',
    description: 'Given loan principal <code>P</code>, monthly EMI <code>emi</code>, and monthly interest rate in basis points <code>monthlyBps</code> (100 bps = 1%), first month interest is <code>(P * monthlyBps) // 10000</code>, and the rest of <code>emi</code> pays principal. Return principal paid in month 1 (0 if emi &lt;= interest).',
    constraints: ['0 <= P <= 10^9', '0 <= emi <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'P = 100000, emi = 5000, monthlyBps = 100', output: '4000' },
      { title: 'Test Case 2', input: 'P = 100000, emi = 800, monthlyBps = 100', output: '0' },
      { title: 'Test Case 3', input: 'P = 50000, emi = 2500, monthlyBps = 0', output: '2500' },
      { title: 'Test Case 4', input: 'P = 200000, emi = 10000, monthlyBps = 75', output: '8500' }
    ],
    javaSolution: `public class Solution {
    public static long firstMonthPrincipal(long P, long emi, int monthlyBps) {
        long interest = (P * monthlyBps) / 10000;
        return Math.max(0L, emi - interest);
    }
}`,
    pythonSolution: `def firstMonthPrincipal(P, emi, monthlyBps):
    interest = (P * monthlyBps) // 10000
    return max(0, emi - interest)`
  },
  {
    number: 49,
    title: 'FX Card Weekend Markup Calculator',
    fnName: 'totalForeignCardSpend',
    description: 'A forex card charges 0% markup on weekdays (<code>isWeekend[i] == false</code>) and <code>markupPct</code>% (integer floor) on weekends. Given INR equivalents <code>amounts</code>, return total billed amount.',
    constraints: ['1 <= amounts.length == isWeekend.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'amounts = [1000, 2000], isWeekend = [false, true], markupPct = 3', output: '3060' },
      { title: 'Test Case 2', input: 'amounts = [500, 500], isWeekend = [false, false], markupPct = 5', output: '1000' },
      { title: 'Test Case 3', input: 'amounts = [1000], isWeekend = [true], markupPct = 2', output: '1020' },
      { title: 'Test Case 4', input: 'amounts = [150], isWeekend = [true], markupPct = 1', output: '151' }
    ],
    javaSolution: `public class Solution {
    public static long totalForeignCardSpend(int[] amounts, boolean[] isWeekend, int markupPct) {
        long total = 0;
        for (int i = 0; i < amounts.length; i++) {
            total += amounts[i];
            if (isWeekend[i]) total += (long) amounts[i] * markupPct / 100;
        }
        return total;
    }
}`,
    pythonSolution: `def totalForeignCardSpend(amounts, isWeekend, markupPct):
    return sum(a + ((a * markupPct) // 100 if w else 0) for a, w in zip(amounts, isWeekend))`
  },
  {
    number: 50,
    title: 'Refund Settlement Business Days',
    fnName: 'countOnTimeRefunds',
    description: 'Refunds are initiated on day <code>initDay[i]</code> and settled on <code>settleDay[i]</code>. A refund is on-time if <code>settleDay[i] - initDay[i] &lt;= slaDays</code>. Return the count of on-time refunds.',
    constraints: ['1 <= initDay.length == settleDay.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'initDay = [1, 5, 10], settleDay = [4, 12, 13], slaDays = 5', output: '2' },
      { title: 'Test Case 2', input: 'initDay = [10], settleDay = [15], slaDays = 5', output: '1' },
      { title: 'Test Case 3', input: 'initDay = [1, 2], settleDay = [10, 20], slaDays = 3', output: '0' },
      { title: 'Test Case 4', input: 'initDay = [7], settleDay = [7], slaDays = 0', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countOnTimeRefunds(int[] initDay, int[] settleDay, int slaDays) {
        int cnt = 0;
        for (int i = 0; i < initDay.length; i++) if (settleDay[i] - initDay[i] <= slaDays) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countOnTimeRefunds(initDay, settleDay, slaDays):
    return sum(1 for a, b in zip(initDay, settleDay) if b - a <= slaDays)`
  }
];
