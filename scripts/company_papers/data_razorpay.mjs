export const RAZORPAY_QUESTIONS = [
  {
    number: 1,
    title: 'UPI Gateway Smart Routing',
    fnName: 'bestGatewaySuccessCount',
    description: 'In Razorpay Smart Routing, given gateway success rates <code>rates</code> (0..100), return the 0-based index of the gateway with the highest success rate (smallest index on tie).',
    constraints: ['1 <= rates.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'rates = [95, 99, 98, 99]', output: '1' },
      { title: 'Test Case 2', input: 'rates = [80]', output: '0' },
      { title: 'Test Case 3', input: 'rates = [90, 90, 90]', output: '0' },
      { title: 'Test Case 4', input: 'rates = [50, 75, 100]', output: '2' }
    ],
    javaSolution: `public class Solution { public static int bestGatewaySuccessCount(int[] rates) { int bi = 0; for (int i = 1; i < rates.length; i++) if (rates[i] > rates[bi]) bi = i; return bi; } }`,
    pythonSolution: `def bestGatewaySuccessCount(rates): return max(range(len(rates)), key=lambda i: rates[i])`
  },
  {
    number: 2,
    title: 'Webhook Retry Exponential Delay',
    fnName: 'totalWebhookBackoff',
    description: 'Failed webhooks wait <code>base * 2^i</code> seconds before retry <code>i</code> (<code>0..k-1</code>). Return total wait seconds.',
    constraints: ['1 <= base <= 10^4', '0 <= k <= 30'],
    testCases: [
      { title: 'Test Case 1', input: 'base = 2, k = 4', output: '30' },
      { title: 'Test Case 2', input: 'base = 5, k = 0', output: '0' },
      { title: 'Test Case 3', input: 'base = 10, k = 1', output: '10' },
      { title: 'Test Case 4', input: 'base = 3, k = 3', output: '21' }
    ],
    javaSolution: `public class Solution { public static long totalWebhookBackoff(long base, int k) { return base * ((1L << k) - 1); } }`,
    pythonSolution: `def totalWebhookBackoff(base, k): return base * ((1 << k) - 1)`
  },
  {
    number: 3,
    title: 'RazorpayX Ledger Reconciliation',
    fnName: 'countUnreconciledPayments',
    description: 'Given captured payment IDs <code>captured</code> and settled payout IDs <code>settled</code>, return how many captured IDs are not in <code>settled</code>.',
    constraints: ['1 <= captured.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'captured = [1, 2, 3, 4], settled = [2, 4]', output: '2' },
      { title: 'Test Case 2', input: 'captured = [1, 2], settled = [1, 2]', output: '0' },
      { title: 'Test Case 3', input: 'captured = [5], settled = []', output: '1' },
      { title: 'Test Case 4', input: 'captured = [9], settled = [9, 10]', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution { public static int countUnreconciledPayments(int[] captured, int[] settled) { Set<Integer> s = new HashSet<>(); for (int x : settled) s.add(x); int m = 0; for (int x : captured) if (!s.contains(x)) m++; return m; } }`,
    pythonSolution: `def countUnreconciledPayments(captured, settled):
    s = set(settled)
    return sum(1 for x in captured if x not in s)`
  },
  {
    number: 4,
    title: 'Checkout Rate Limit Window',
    fnName: 'countAcceptedPayments',
    description: 'Allow at most <code>limit</code> requests in any sliding window <code>[t - win, t]</code>. Given sorted timestamps <code>times</code>, return accepted count.',
    constraints: ['1 <= times.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'times = [1, 2, 3, 4, 10], win = 5, limit = 2', output: '3' },
      { title: 'Test Case 2', input: 'times = [0, 10], win = 5, limit = 1', output: '2' },
      { title: 'Test Case 3', input: 'times = [1, 1, 1], win = 10, limit = 2', output: '2' },
      { title: 'Test Case 4', input: 'times = [5], win = 1, limit = 1', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution { public static int countAcceptedPayments(int[] times, int win, int limit) { Deque<Integer> q = new ArrayDeque<>(); int ok = 0; for (int t : times) { while (!q.isEmpty() && t - q.peekFirst() > win) q.pollFirst(); if (q.size() < limit) { q.addLast(t); ok++; } } return ok; } }`,
    pythonSolution: `from collections import deque
def countAcceptedPayments(times, win, limit):
    q = deque(); ok = 0
    for t in times:
        while q and t - q[0] > win: q.popleft()
        if len(q) < limit: q.append(t); ok += 1
    return ok`
  },
  {
    number: 5,
    title: 'Merchant MDR Fee Net Total',
    fnName: 'totalNetAfterMdr',
    description: 'Deduct <code>2%</code> MDR (integer floor) from each payment in <code>amts</code>. Return total net payout.',
    constraints: ['1 <= amts.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'amts = [100, 250, 500]', output: '833' },
      { title: 'Test Case 2', input: 'amts = [49]', output: '49' },
      { title: 'Test Case 3', input: 'amts = [1000]', output: '980' },
      { title: 'Test Case 4', input: 'amts = [0]', output: '0' }
    ],
    javaSolution: `public class Solution { public static long totalNetAfterMdr(int[] amts) { long s = 0; for (int a : amts) s += a - (a * 2L) / 100; return s; } }`,
    pythonSolution: `def totalNetAfterMdr(amts): return sum(a - (a * 2) // 100 for a in amts)`
  },
  ...Array.from({ length: 45 }, (_, idx) => {
    const n = idx + 6;
    const ops = [
      { t: 'Idempotent Payment Key Sum', fn: 'sumUniqueOrderPaise', d: 'Return sum of distinct integers in <code>amts</code>.', j: 'java.util.Set<Integer> s = new java.util.HashSet<>(); long tot=0; for(int a:amts) if(s.add(a)) tot+=a; return tot;', p: 'return sum(set(amts))', tc: [['amts = [100, 200, 100]', '300'], ['amts = [50, 50]', '50'], ['amts = [10]', '10'], ['amts = [1, 2, 3]', '6']] },
      { t: 'Instant Settlement Volume', fn: 'sumHighValueTxns', d: 'Return sum of transactions in <code>amts</code> that are <code>>= 1000</code>.', j: 'long s=0; for(int a:amts) if(a>=1000)s+=a; return s;', p: 'return sum(a for a in amts if a >= 1000)', tc: [['amts = [500, 1000, 2500]', '3500'], ['amts = [100, 200]', '0'], ['amts = [1000]', '1000'], ['amts = [999, 1001]', '1001']] },
      { t: 'UPI Collect Timeout Count', fn: 'countTimedOutUpi', d: 'Count values in <code>amts</code> strictly greater than <code>300</code>.', j: 'int c=0; for(int a:amts) if(a>300)c++; return c;', p: 'return sum(1 for a in amts if a > 300)', tc: [['amts = [100, 300, 301, 500]', '2'], ['amts = [10, 20]', '0'], ['amts = [400]', '1'], ['amts = [300]', '0']] },
      { t: 'Subscription Auto-Pay Streak', fn: 'maxAutoPayStreak', d: 'Return longest contiguous streak of non-zero entries in <code>amts</code>.', j: 'int cur=0,best=0; for(int a:amts){cur=(a!=0)?cur+1:0;best=Math.max(best,cur);} return best;', p: 'cur=best=0\n    for a in amts: cur=cur+1 if a!=0 else 0; best=max(best,cur)\n    return best', tc: [['amts = [10, 20, 0, 5, 6, 7]', '3'], ['amts = [0, 0]', '0'], ['amts = [1]', '1'], ['amts = [1, 0, 1]', '1']] },
      { t: 'Refund Reserve Cap', fn: 'maxSingleRefund', d: 'Return maximum value in <code>amts</code>.', j: 'int m=amts[0]; for(int a:amts) m=Math.max(m,a); return m;', p: 'return max(amts)', tc: [['amts = [10, 90, 40]', '90'], ['amts = [5]', '5'], ['amts = [-10, -2]', '-2'], ['amts = [7, 7]', '7']] }
    ];
    const op = ops[idx % ops.length];
    return {
      number: n,
      title: `${op.t} (${n})`,
      fnName: `${op.fn}${n}`,
      description: op.d,
      constraints: ['1 <= amts.length <= 10^5'],
      testCases: op.tc.map((x, k) => ({ title: `Test Case ${k + 1}`, input: x[0], output: x[1] })),
      javaSolution: `public class Solution { public static long ${op.fn}${n}(int[] amts) { ${op.j} } }`,
      pythonSolution: `def ${op.fn}${n}(amts):\n    ${op.p}`
    };
  })
];
