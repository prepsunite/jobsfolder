export const MPHASIS_QUESTIONS = [
  {
    number: 1,
    title: 'Number System Digit Sum Parity',
    fnName: 'countEvenDigitSum',
    description: 'In Mphasis Campus OA, given positive integers <code>nums</code>, count how many have an even sum of decimal digits.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [11, 12, 24, 35]', output: '3' },
      { title: 'Test Case 2', input: 'nums = [1, 3, 5]', output: '0' },
      { title: 'Test Case 3', input: 'nums = [22]', output: '1' },
      { title: 'Test Case 4', input: 'nums = [101]', output: '1' }
    ],
    javaSolution: `public class Solution { public static int countEvenDigitSum(int[] nums) { int cnt = 0; for (int x : nums) { int s = 0, t = x; while (t > 0) { s += t % 10; t /= 10; } if (s % 2 == 0) cnt++; } return cnt; } }`,
    pythonSolution: `def countEvenDigitSum(nums): return sum(1 for x in nums if sum(int(d) for d in str(x)) % 2 == 0)`
  },
  {
    number: 2,
    title: 'Array Second Minimum Element',
    fnName: 'secondMinimumDistinct',
    description: 'Return the second smallest distinct integer in <code>nums</code>, or <code>-1</code> if fewer than 2 distinct elements exist.',
    constraints: ['1 <= nums.length <= 10^5', '0 <= nums[i] <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [5, 1, 3, 1, 2]', output: '2' },
      { title: 'Test Case 2', input: 'nums = [4, 4, 4]', output: '-1' },
      { title: 'Test Case 3', input: 'nums = [10]', output: '-1' },
      { title: 'Test Case 4', input: 'nums = [9, 2]', output: '9' }
    ],
    javaSolution: `public class Solution { public static int secondMinimumDistinct(int[] nums) { int m1 = Integer.MAX_VALUE, m2 = Integer.MAX_VALUE; for (int x : nums) { if (x < m1) { m2 = m1; m1 = x; } else if (x > m1 && x < m2) m2 = x; } return m2 == Integer.MAX_VALUE ? -1 : m2; } }`,
    pythonSolution: `def secondMinimumDistinct(nums):
    s = sorted(set(nums))
    return s[1] if len(s) >= 2 else -1`
  },
  {
    number: 3,
    title: 'String Uppercase Ratio Check',
    fnName: 'countUppercaseChars',
    description: 'Return the number of uppercase English letters (<code>A..Z</code>) in string <code>s</code>.',
    constraints: ['1 <= s.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 's = "MphasisDrive2026"', output: '2' },
      { title: 'Test Case 2', input: 's = "lowercase"', output: '0' },
      { title: 'Test Case 3', input: 's = "ABC"', output: '3' },
      { title: 'Test Case 4', input: 's = "12345"', output: '0' }
    ],
    javaSolution: `public class Solution { public static int countUppercaseChars(String s) { int c = 0; for (int i = 0; i < s.length(); i++) if (Character.isUpperCase(s.charAt(i))) c++; return c; } }`,
    pythonSolution: `def countUppercaseChars(s): return sum(1 for c in s if c.isupper())`
  },
  {
    number: 4,
    title: 'Leap Year Count in Range',
    fnName: 'countLeapYears',
    description: 'Given array of years <code>years</code>, count how many are leap years.',
    constraints: ['1 <= years.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'years = [2000, 1900, 2024, 2025]', output: '2' },
      { title: 'Test Case 2', input: 'years = [2021, 2022, 2023]', output: '0' },
      { title: 'Test Case 3', input: 'years = [2400]', output: '1' },
      { title: 'Test Case 4', input: 'years = [2100]', output: '0' }
    ],
    javaSolution: `public class Solution { public static int countLeapYears(int[] years) { int c = 0; for (int y : years) if (y % 400 == 0 || (y % 4 == 0 && y % 100 != 0)) c++; return c; } }`,
    pythonSolution: `def countLeapYears(years): return sum(1 for y in years if y % 400 == 0 or (y % 4 == 0 and y % 100 != 0))`
  },
  {
    number: 5,
    title: 'Simulation Robot Step Bounds',
    fnName: 'finalBoundedPos',
    description: 'A robot starts at position <code>0</code> on <code>[0, maxPos]</code> and executes integer steps <code>steps</code> (clamping to <code>[0, maxPos]</code> after each step). Return final position.',
    constraints: ['1 <= steps.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'steps = [3, 5, -2, -10], maxPos = 6', output: '0' },
      { title: 'Test Case 2', input: 'steps = [4, 4], maxPos = 5', output: '5' },
      { title: 'Test Case 3', input: 'steps = [2, -1, 3], maxPos = 10', output: '4' },
      { title: 'Test Case 4', input: 'steps = [-5], maxPos = 5', output: '0' }
    ],
    javaSolution: `public class Solution { public static int finalBoundedPos(int[] steps, int maxPos) { int p = 0; for (int s : steps) p = Math.max(0, Math.min(maxPos, p + s)); return p; } }`,
    pythonSolution: `def finalBoundedPos(steps, maxPos):
    p = 0
    for s in steps: p = max(0, min(maxPos, p + s))
    return p`
  },
  ...Array.from({ length: 45 }, (_, idx) => {
    const n = idx + 6;
    const ops = [
      { t: 'Sum of Positive Elements', fn: 'sumPositives', d: 'Return the sum of all strictly positive integers in <code>nums</code>.', j: 'long s=0; for(int x:nums) if(x>0)s+=x; return s;', p: 'return sum(x for x in nums if x > 0)', tc: [['nums = [-5, 10, 0, 3]', '13'], ['nums = [-1, -2]', '0'], ['nums = [7]', '7'], ['nums = [1, 2, 3]', '6']] },
      { t: 'Count Multiples of Five', fn: 'countMultFive', d: 'Count integers in <code>nums</code> divisible by 5.', j: 'int c=0; for(int x:nums) if(x%5==0)c++; return c;', p: 'return sum(1 for x in nums if x % 5 == 0)', tc: [['nums = [5, 10, 12, 25]', '3'], ['nums = [1, 2, 3]', '0'], ['nums = [0]', '1'], ['nums = [15, 30]', '2']] },
      { t: 'Alternating Sign Sum', fn: 'alternatingSignSum', d: 'Return <code>nums[0] - nums[1] + nums[2] - nums[3] ...</code>.', j: 'long s=0; for(int i=0;i<nums.length;i++) s += (i%2==0)? nums[i] : -nums[i]; return s;', p: 'return sum(x if i % 2 == 0 else -x for i, x in enumerate(nums))', tc: [['nums = [10, 3, 5, 2]', '10'], ['nums = [5]', '5'], ['nums = [1, 1]', '0'], ['nums = [4, 2, 6]', '8']] },
      { t: 'Max Element Index', fn: 'firstMaxIndex', d: 'Return the 0-based index of the first occurrence of the maximum element in <code>nums</code>.', j: 'int bi=0; for(int i=1;i<nums.length;i++) if(nums[i]>nums[bi])bi=i; return bi;', p: 'return nums.index(max(nums))', tc: [['nums = [1, 9, 3, 9]', '1'], ['nums = [5]', '0'], ['nums = [1, 2, 3]', '2'], ['nums = [10, 5, 2]', '0']] },
      { t: 'Strictly Increasing Check', fn: 'countDecreaseSteps', d: 'Count how many consecutive pairs satisfy <code>nums[i] < nums[i-1]</code>.', j: 'int c=0; for(int i=1;i<nums.length;i++) if(nums[i]<nums[i-1])c++; return c;', p: 'return sum(1 for i in range(1, len(nums)) if nums[i] < nums[i-1])', tc: [['nums = [5, 3, 4, 2]', '2'], ['nums = [1, 2, 3]', '0'], ['nums = [9, 8, 7]', '2'], ['nums = [4]', '0']] }
    ];
    const op = ops[idx % ops.length];
    return {
      number: n,
      title: `${op.t} (${n})`,
      fnName: `${op.fn}${n}`,
      description: op.d,
      constraints: ['1 <= nums.length <= 10^5'],
      testCases: op.tc.map((x, k) => ({ title: `Test Case ${k + 1}`, input: x[0], output: x[1] })),
      javaSolution: `public class Solution { public static long ${op.fn}${n}(int[] nums) { ${op.j} } }`,
      pythonSolution: `def ${op.fn}${n}(nums):\n    ${op.p}`
    };
  })
];
