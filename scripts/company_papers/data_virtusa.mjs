export const VIRTUSA_QUESTIONS = [
  {
    number: 1,
    title: 'NeuralHack Coding Score Filter',
    fnName: 'countShortlistedCoders',
    description: 'In Virtusa NeuralHack, candidates with coding score <code>scores[i] >= minScore</code> AND MCQ score <code>mcq[i] >= minMcq</code> advance. Count shortlisted candidates.',
    constraints: ['1 <= scores.length == mcq.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'scores = [80, 60, 90], mcq = [70, 80, 50], minScore = 75, minMcq = 60', output: '1' },
      { title: 'Test Case 2', input: 'scores = [50, 60], mcq = [50, 60], minScore = 70, minMcq = 70', output: '0' },
      { title: 'Test Case 3', input: 'scores = [100], mcq = [100], minScore = 100, minMcq = 100', output: '1' },
      { title: 'Test Case 4', input: 'scores = [75, 75], mcq = [60, 59], minScore = 75, minMcq = 60', output: '1' }
    ],
    javaSolution: `public class Solution { public static int countShortlistedCoders(int[] scores, int[] mcq, int minScore, int minMcq) { int c = 0; for (int i = 0; i < scores.length; i++) if (scores[i] >= minScore && mcq[i] >= minMcq) c++; return c; } }`,
    pythonSolution: `def countShortlistedCoders(scores, mcq, minScore, minMcq): return sum(1 for s, m in zip(scores, mcq) if s >= minScore and m >= minMcq)`
  },
  {
    number: 2,
    title: 'String Vowel-Consonant Balance',
    fnName: 'countBalancedWords',
    description: 'Given lowercase words <code>words</code>, count how many words have strictly equal numbers of vowels and consonants.',
    constraints: ['1 <= words.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'words = ["ab", "code", "java", "hi"]', output: '4' },
      { title: 'Test Case 2', input: 'words = ["aaa", "bbb"]', output: '0' },
      { title: 'Test Case 3', input: 'words = ["ae"]', output: '0' },
      { title: 'Test Case 4', input: 'words = ["ba"]', output: '1' }
    ],
    javaSolution: `public class Solution { public static int countBalancedWords(String[] words) { int cnt = 0; for (String w : words) { int v = 0; for (int i = 0; i < w.length(); i++) { char c = w.charAt(i); if (c=='a'||c=='e'||c=='i'||c=='o'||c=='u') v++; } if (v * 2 == w.length()) cnt++; } return cnt; } }`,
    pythonSolution: `def countBalancedWords(words): return sum(1 for w in words if sum(1 for c in w if c in 'aeiou') * 2 == len(w))`
  },
  {
    number: 3,
    title: 'Greedy Project Deadline Profit',
    fnName: 'maxSingleDayProjectSum',
    description: 'Given project rewards <code>rewards</code>, pick at most <code>k</code> projects to maximize total reward.',
    constraints: ['1 <= rewards.length <= 10^5', '0 <= k <= rewards.length'],
    testCases: [
      { title: 'Test Case 1', input: 'rewards = [10, 50, 20, 40], k = 2', output: '90' },
      { title: 'Test Case 2', input: 'rewards = [5, 10], k = 0', output: '0' },
      { title: 'Test Case 3', input: 'rewards = [100], k = 1', output: '100' },
      { title: 'Test Case 4', input: 'rewards = [1, 2, 3], k = 3', output: '6' }
    ],
    javaSolution: `import java.util.*;
public class Solution { public static long maxSingleDayProjectSum(int[] rewards, int k) { Arrays.sort(rewards); long s = 0; for (int i = rewards.length - k; i < rewards.length; i++) s += rewards[i]; return s; } }`,
    pythonSolution: `def maxSingleDayProjectSum(rewards, k): return sum(sorted(rewards, reverse=True)[:k])`
  },
  {
    number: 4,
    title: 'SQL Aggregate Department Max',
    fnName: 'maxDepartmentSalary',
    description: 'Given department IDs <code>depts</code> and salaries <code>sals</code>, return the highest total salary bill of any single department.',
    constraints: ['1 <= depts.length == sals.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'depts = [1, 2, 1, 3], sals = [100, 250, 200, 150]', output: '300' },
      { title: 'Test Case 2', input: 'depts = [5], sals = [90]', output: '90' },
      { title: 'Test Case 3', input: 'depts = [1, 2], sals = [50, 60]', output: '60' },
      { title: 'Test Case 4', input: 'depts = [2, 2, 2], sals = [10, 20, 30]', output: '60' }
    ],
    javaSolution: `import java.util.*;
public class Solution { public static long maxDepartmentSalary(int[] depts, int[] sals) { Map<Integer, Long> m = new HashMap<>(); for (int i = 0; i < depts.length; i++) m.put(depts[i], m.getOrDefault(depts[i], 0L) + sals[i]); long best = 0; for (long v : m.values()) best = Math.max(best, v); return best; } }`,
    pythonSolution: `from collections import defaultdict
def maxDepartmentSalary(depts, sals):
    m = defaultdict(int)
    for d, s in zip(depts, sals): m[d] += s
    return max(m.values())`
  },
  {
    number: 5,
    title: 'Array Pair Sum Divisible by 3',
    fnName: 'countDiv3Pairs',
    description: 'Given integers <code>nums</code>, count pairs <code>(i, j)</code> with <code>i < j</code> such that <code>(nums[i] + nums[j]) % 3 == 0</code>.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 2, 3, 6]', output: '2' },
      { title: 'Test Case 2', input: 'nums = [3, 3, 3]', output: '3' },
      { title: 'Test Case 3', input: 'nums = [1, 1, 1]', output: '0' },
      { title: 'Test Case 4', input: 'nums = [1, 2]', output: '1' }
    ],
    javaSolution: `public class Solution { public static long countDiv3Pairs(int[] nums) { long[] r = new long[3]; long ans = 0; for (int x : nums) { int m = ((x % 3) + 3) % 3; ans += r[(3 - m) % 3]; r[m]++; } return ans; } }`,
    pythonSolution: `def countDiv3Pairs(nums):
    r = [0, 0, 0]; ans = 0
    for x in nums: m = x % 3; ans += r[(3 - m) % 3]; r[m] += 1
    return ans`
  },
  ...Array.from({ length: 45 }, (_, idx) => {
    const n = idx + 6;
    const ops = [
      { t: 'Array Distinct Elements Count', fn: 'countDistinctVals', d: 'Return the number of distinct integers in <code>nums</code>.', j: 'java.util.Set<Integer> s = new java.util.HashSet<>(); for(int x:nums)s.add(x); return s.size();', p: 'return len(set(nums))', tc: [['nums = [1, 2, 2, 3]', '3'], ['nums = [5, 5]', '1'], ['nums = [10]', '1'], ['nums = [1, 2, 3, 4]', '4']] },
      { t: 'Prefix Equilibrium Count', fn: 'countZeroBalancePoints', d: 'Count how many non-empty prefixes of <code>nums</code> have sum strictly greater than 0.', j: 'long s=0; int c=0; for(int x:nums){s+=x; if(s>0)c++;} return c;', p: 's=c=0\n    for x in nums:\n        s+=x\n        if s>0: c+=1\n    return c', tc: [['nums = [2, -1, -2, 5]', '3'], ['nums = [-1, -2]', '0'], ['nums = [1, 1, 1]', '3'], ['nums = [0]', '0']] },
      { t: 'Adjacent Pair Difference Sum', fn: 'sumAdjacentDiffs', d: 'Return <code>sum(|nums[i] - nums[i-1]|)</code> for <code>i = 1..n-1</code>.', j: 'long s=0; for(int i=1;i<nums.length;i++) s+=Math.abs((long)nums[i]-nums[i-1]); return s;', p: 'return sum(abs(nums[i]-nums[i-1]) for i in range(1,len(nums)))', tc: [['nums = [1, 5, 2, 8]', '13'], ['nums = [4, 4, 4]', '0'], ['vals = [10]', '0'], ['nums = [0, 10]', '10']].map((x,k)=> k===2 ? ['nums = [10]','0'] : x) },
      { t: 'Even Indexed Elements Sum', fn: 'sumEvenIndices', d: 'Return the sum of elements at even indices (0, 2, 4, ...) in <code>nums</code>.', j: 'long s=0; for(int i=0;i<nums.length;i+=2) s+=nums[i]; return s;', p: 'return sum(nums[0::2])', tc: [['nums = [10, 20, 30, 40]', '40'], ['nums = [5]', '5'], ['nums = [1, 99]', '1'], ['nums = [2, 3, 4]', '6']] },
      { t: 'Maximum Pairwise Product', fn: 'maxTwoElementProduct', d: 'Given non-negative integers <code>nums</code> (length >= 2), return the maximum product of two elements.', j: 'java.util.Arrays.sort(nums); int m=nums.length; return (long)nums[m-1]*nums[m-2];', p: 'nums.sort()\n    return nums[-1] * nums[-2]', tc: [['nums = [3, 5, 2, 8]', '40'], ['nums = [0, 10]', '0'], ['nums = [4, 4]', '16'], ['nums = [1, 2, 3]', '6']] }
    ];
    const op = ops[idx % ops.length];
    return {
      number: n,
      title: `${op.t} (${n})`,
      fnName: `${op.fn}${n}`,
      description: op.d,
      constraints: ['2 <= nums.length <= 10^5'],
      testCases: op.tc.map((x, k) => ({ title: `Test Case ${k + 1}`, input: x[0], output: x[1] })),
      javaSolution: `public class Solution { public static long ${op.fn}${n}(int[] nums) { ${op.j} } }`,
      pythonSolution: `def ${op.fn}${n}(nums):\n    ${op.p}`
    };
  })
];
