export const WIPRO_EXTRA = [
  {
    number: 20,
    title: 'Wipro NTH Prime-Index Digit Sum',
    fnName: 'sumAtPrimeIndices',
    description: 'Given an integer array <code>arr</code>, return the sum of all elements located at 0-based prime indices (2, 3, 5, 7, ...).',
    constraints: ['1 <= arr.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'arr = [10, 20, 30, 40, 50, 60]', output: '130' },
      { title: 'Test Case 2', input: 'arr = [5, 10]', output: '0' },
      { title: 'Test Case 3', input: 'arr = [1, 2, 3]', output: '3' },
      { title: 'Test Case 4', input: 'arr = [0, 0, 7, 8, 9]', output: '15' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long sumAtPrimeIndices(int[] arr) {
        int n = arr.length;
        if (n <= 2) return 0;
        boolean[] p = new boolean[n]; Arrays.fill(p, true);
        p[0] = p[1] = false;
        for (int i = 2; (long) i * i < n; i++) if (p[i]) for (int j = i * i; j < n; j += i) p[j] = false;
        long sum = 0;
        for (int i = 2; i < n; i++) if (p[i]) sum += arr[i];
        return sum;
    }
}`,
    pythonSolution: `def sumAtPrimeIndices(arr):
    n = len(arr)
    if n <= 2: return 0
    p = [True] * n; p[0] = p[1] = False
    for i in range(2, int(n**0.5) + 1):
        if p[i]: p[i*i:n:i] = [False] * len(range(i*i, n, i))
    return sum(arr[i] for i in range(2, n) if p[i])`
  },
  {
    number: 21,
    title: 'Security Key Digit-Rotation Sum',
    fnName: 'sumRotatedKeys',
    description: 'For each non-negative integer <code>x</code> in <code>keys</code>, compute its digital mirror by reversing its base-10 digits, then return the sum of <code>x + reverse(x)</code> across all keys.',
    constraints: ['1 <= keys.length <= 10^4', '0 <= keys[i] <= 10^7'],
    testCases: [
      { title: 'Test Case 1', input: 'keys = [12, 34]', output: '110' },
      { title: 'Test Case 2', input: 'keys = [100]', output: '101' },
      { title: 'Test Case 3', input: 'keys = [0, 5]', output: '10' },
      { title: 'Test Case 4', input: 'keys = [121]', output: '242' }
    ],
    javaSolution: `public class Solution {
    public static long sumRotatedKeys(int[] keys) {
        long total = 0;
        for (int k : keys) {
            int rev = 0, t = k;
            while (t > 0) { rev = rev * 10 + (t % 10); t /= 10; }
            total += k + rev;
        }
        return total;
    }
}`,
    pythonSolution: `def sumRotatedKeys(keys):
    return sum(k + int(str(k)[::-1]) for k in keys)`
  },
  {
    number: 22,
    title: 'Turbo Odd-Even Index Difference',
    fnName: 'evenMinusOddIndexSum',
    description: 'Given an integer array <code>nums</code>, return <code>(sum of elements at even indices) - (sum of elements at odd indices)</code>.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [10, 5, 20, 15]', output: '10' },
      { title: 'Test Case 2', input: 'nums = [1, 2, 3]', output: '2' },
      { title: 'Test Case 3', input: 'nums = [7]', output: '7' },
      { title: 'Test Case 4', input: 'nums = [4, 4, 4, 4]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long evenMinusOddIndexSum(int[] nums) {
        long diff = 0;
        for (int i = 0; i < nums.length; i++) diff += (i % 2 == 0) ? nums[i] : -nums[i];
        return diff;
    }
}`,
    pythonSolution: `def evenMinusOddIndexSum(nums):
    return sum(x if i % 2 == 0 else -x for i, x in enumerate(nums))`
  },
  {
    number: 23,
    title: 'Essay Word-Count Compliance Check',
    fnName: 'isEssayWithinLimits',
    description: 'Wipro NTH requires essays to have between <code>minWords</code> and <code>maxWords</code> words inclusive (words separated by whitespace). Given string <code>essay</code>, return <code>true</code> if compliant, else <code>false</code>.',
    constraints: ['0 <= essay.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'essay = "The quick brown fox jumps", minWords = 3, maxWords = 6', output: 'true' },
      { title: 'Test Case 2', input: 'essay = "Too short", minWords = 5, maxWords = 10', output: 'false' },
      { title: 'Test Case 3', input: 'essay = "  spaced   words  ", minWords = 2, maxWords = 2', output: 'true' },
      { title: 'Test Case 4', input: 'essay = "", minWords = 1, maxWords = 5', output: 'false' }
    ],
    javaSolution: `public class Solution {
    public static boolean isEssayWithinLimits(String essay, int minWords, int maxWords) {
        String trimmed = essay.trim();
        int cnt = trimmed.isEmpty() ? 0 : trimmed.split("\\\\s+").length;
        return cnt >= minWords && cnt <= maxWords;
    }
}`,
    pythonSolution: `def isEssayWithinLimits(essay, minWords, maxWords):
    return minWords <= len(essay.split()) <= maxWords`
  },
  {
    number: 24,
    title: 'Perfect Number Check in Batch',
    fnName: 'countPerfectNumbers',
    description: 'A positive integer is a perfect number if it equals the sum of its proper positive divisors (e.g. 6 = 1+2+3, 28 = 1+2+4+7+14). Given array <code>nums</code>, return how many are perfect numbers.',
    constraints: ['1 <= nums.length <= 1000', '1 <= nums[i] <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [6, 12, 28, 496]', output: '3' },
      { title: 'Test Case 2', input: 'nums = [1, 2, 3, 4]', output: '0' },
      { title: 'Test Case 3', input: 'nums = [8128]', output: '1' },
      { title: 'Test Case 4', input: 'nums = [10, 20]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countPerfectNumbers(int[] nums) {
        int cnt = 0;
        for (int n : nums) if (isPerf(n)) cnt++;
        return cnt;
    }
    private static boolean isPerf(int n) {
        if (n <= 1) return false;
        int sum = 1;
        for (int i = 2; i * i <= n; i++) {
            if (n % i == 0) { sum += i; if (i != n / i) sum += n / i; }
        }
        return sum == n;
    }
}`,
    pythonSolution: `def countPerfectNumbers(nums):
    def is_perf(n):
        if n <= 1: return False
        s = 1
        i = 2
        while i * i <= n:
            if n % i == 0:
                s += i
                if i != n // i: s += n // i
            i += 1
        return s == n
    return sum(1 for x in nums if is_perf(x))`
  },
  {
    number: 25,
    title: 'String Consonant-Only Filter',
    fnName: 'extractConsonants',
    description: 'Given a mixed-case string <code>s</code>, remove all vowels (<code>a,e,i,o,u,A,E,I,O,U</code>) and non-alphabetic characters, returning only the remaining consonant letters in their original order.',
    constraints: ['1 <= s.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 's = "Wipro Elite 2026!"', output: 'Wprlt' },
      { title: 'Test Case 2', input: 's = "AEIOUaeiou"', output: '""'.replace('""', '') || ' ' },
      { title: 'Test Case 3', input: 's = "Turbo-Code"', output: 'TrbCd' },
      { title: 'Test Case 4', input: 's = "xyz"', output: 'xyz' }
    ].map((tc, i) => i === 1 ? { title: 'Test Case 2', input: 's = "AEIOUB"', output: 'B' } : tc),
    javaSolution: `public class Solution {
    public static String extractConsonants(String s) {
        StringBuilder sb = new StringBuilder();
        for (char c : s.toCharArray()) {
            if (Character.isLetter(c) && "aeiouAEIOU".indexOf(c) < 0) sb.append(c);
        }
        return sb.toString();
    }
}`,
    pythonSolution: `def extractConsonants(s):
    return ''.join(c for c in s if c.isalpha() and c not in 'aeiouAEIOU')`
  },
  {
    number: 26,
    title: 'Sales Commission Slab Calculator',
    fnName: 'totalSalesCommission',
    description: 'Salespeople earn 5% commission on sales up to <code>10000</code>, and 10% on any amount above <code>10000</code> (integer floor per person). Given <code>sales</code>, return total commission.',
    constraints: ['1 <= sales.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'sales = [5000, 15000]', output: '1250' },
      { title: 'Test Case 2', input: 'sales = [10000]', output: '500' },
      { title: 'Test Case 3', input: 'sales = [0, 2000]', output: '100' },
      { title: 'Test Case 4', input: 'sales = [20000]', output: '1500' }
    ],
    javaSolution: `public class Solution {
    public static long totalSalesCommission(int[] sales) {
        long total = 0;
        for (int s : sales) {
            if (s <= 10000) total += s * 5L / 100;
            else total += 500L + (s - 10000L) * 10 / 100;
        }
        return total;
    }
}`,
    pythonSolution: `def totalSalesCommission(sales):
    return sum((s * 5 // 100) if s <= 10000 else (500 + (s - 10000) * 10 // 100) for s in sales)`
  },
  {
    number: 27,
    title: 'Matrix Row-Wise Max Minus Min',
    fnName: 'sumRowRanges',
    description: 'Given a 2D integer matrix <code>mat</code>, compute <code>max(row) - min(row)</code> for each row and return the sum across all rows.',
    constraints: ['1 <= R, C <= 200'],
    testCases: [
      { title: 'Test Case 1', input: 'mat = [[1, 5, 3], [10, 2, 8]]', output: '12' },
      { title: 'Test Case 2', input: 'mat = [[7, 7, 7]]', output: '0' },
      { title: 'Test Case 3', input: 'mat = [[10]]', output: '0' },
      { title: 'Test Case 4', input: 'mat = [[-5, 5], [0, 10]]', output: '20' }
    ],
    javaSolution: `public class Solution {
    public static long sumRowRanges(int[][] mat) {
        long total = 0;
        for (int[] row : mat) {
            int mn = row[0], mx = row[0];
            for (int x : row) { mn = Math.min(mn, x); mx = Math.max(mx, x); }
            total += mx - mn;
        }
        return total;
    }
}`,
    pythonSolution: `def sumRowRanges(mat):
    return sum(max(r) - min(r) for r in mat)`
  },
  {
    number: 28,
    title: 'Strong Password Policy Validator',
    fnName: 'isStrongPassword',
    description: 'A password is strong if it has length &gt;= 8, at least 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character from <code>!@#$%^&amp;*</code>. Return <code>true</code> or <code>false</code>.',
    constraints: ['1 <= pwd.length <= 100'],
    testCases: [
      { title: 'Test Case 1', input: 'pwd = "Wipro@2026"', output: 'true' },
      { title: 'Test Case 2', input: 'pwd = "wipro2026"', output: 'false' },
      { title: 'Test Case 3', input: 'pwd = "Ab1!"', output: 'false' },
      { title: 'Test Case 4', input: 'pwd = "StrongPass1#"', output: 'true' }
    ],
    javaSolution: `public class Solution {
    public static boolean isStrongPassword(String pwd) {
        if (pwd.length() < 8) return false;
        boolean up = false, lo = false, dig = false, sp = false;
        for (char c : pwd.toCharArray()) {
            if (Character.isUpperCase(c)) up = true;
            else if (Character.isLowerCase(c)) lo = true;
            else if (Character.isDigit(c)) dig = true;
            else if ("!@#$%^&*".indexOf(c) >= 0) sp = true;
        }
        return up && lo && dig && sp;
    }
}`,
    pythonSolution: `def isStrongPassword(pwd):
    return (len(pwd) >= 8 and any(c.isupper() for c in pwd) and any(c.islower() for c in pwd)
            and any(c.isdigit() for c in pwd) and any(c in '!@#$%^&*' for c in pwd))`
  },
  {
    number: 29,
    title: 'Harshad (Niven) Number Filter',
    fnName: 'countHarshadNumbers',
    description: 'A positive integer is a Harshad number if it is divisible by the sum of its digits (e.g. 18 is divisible by 1+8=9). Given <code>nums</code>, return how many are Harshad numbers.',
    constraints: ['1 <= nums.length <= 10^4', '1 <= nums[i] <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [18, 19, 21, 24]', output: '3' },
      { title: 'Test Case 2', input: 'nums = [11, 13, 17]', output: '0' },
      { title: 'Test Case 3', input: 'nums = [1, 2, 10]', output: '3' },
      { title: 'Test Case 4', input: 'nums = [100]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countHarshadNumbers(int[] nums) {
        int cnt = 0;
        for (int x : nums) {
            int s = 0, t = x;
            while (t > 0) { s += t % 10; t /= 10; }
            if (x % s == 0) cnt++;
        }
        return cnt;
    }
}`,
    pythonSolution: `def countHarshadNumbers(nums):
    return sum(1 for x in nums if x % sum(int(d) for d in str(x)) == 0)`
  },
  {
    number: 30,
    title: 'GCD of Entire Sensor Array',
    fnName: 'arrayGcd',
    description: 'Given an array of positive integers <code>nums</code>, return the greatest common divisor (GCD) of all elements in the array.',
    constraints: ['1 <= nums.length <= 10^5', '1 <= nums[i] <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [12, 18, 24]', output: '6' },
      { title: 'Test Case 2', input: 'nums = [7, 13, 19]', output: '1' },
      { title: 'Test Case 3', input: 'nums = [100]', output: '100' },
      { title: 'Test Case 4', input: 'nums = [15, 30, 45, 60]', output: '15' }
    ],
    javaSolution: `public class Solution {
    public static int arrayGcd(int[] nums) {
        int g = nums[0];
        for (int i = 1; i < nums.length; i++) g = gcd(g, nums[i]);
        return g;
    }
    private static int gcd(int a, int b) { return b == 0 ? a : gcd(b, a % b); }
}`,
    pythonSolution: `def arrayGcd(nums):
    import math
    g = nums[0]
    for x in nums[1:]: g = math.gcd(g, x)
    return g`
  },
  {
    number: 31,
    title: 'Unique Character Count After Prefix Trim',
    fnName: 'distinctCharsAfterTrim',
    description: 'Given a lowercase string <code>s</code> and integer <code>k</code>, remove the first <code>k</code> and last <code>k</code> characters (if <code>2 * k &gt;= s.length</code>, return 0) and return the number of distinct characters remaining.',
    constraints: ['1 <= s.length <= 10^5', '0 <= k <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 's = "aabbccaa", k = 2', output: '2' },
      { title: 'Test Case 2', input: 's = "abcd", k = 2', output: '0' },
      { title: 'Test Case 3', input: 's = "wipro", k = 0', output: '5' },
      { title: 'Test Case 4', input: 's = "xxabcyy", k = 2', output: '3' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int distinctCharsAfterTrim(String s, int k) {
        if (2 * k >= s.length()) return 0;
        Set<Character> set = new HashSet<>();
        for (int i = k; i < s.length() - k; i++) set.add(s.charAt(i));
        return set.size();
    }
}`,
    pythonSolution: `def distinctCharsAfterTrim(s, k):
    return 0 if 2 * k >= len(s) else len(set(s[k:len(s) - k]))`
  },
  {
    number: 32,
    title: 'Alternating Sign Sum of Subarray',
    fnName: 'alternatingWeightedSum',
    description: 'Given integer array <code>nums</code>, compute <code>nums[0] - nums[1] + nums[2] - nums[3] + ...</code>.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [10, 3, 5, 2]', output: '10' },
      { title: 'Test Case 2', input: 'nums = [1, 2, 3]', output: '2' },
      { title: 'Test Case 3', input: 'nums = [5]', output: '5' },
      { title: 'Test Case 4', input: 'nums = [4, 10]', output: '-6' }
    ],
    javaSolution: `public class Solution {
    public static long alternatingWeightedSum(int[] nums) {
        long s = 0;
        for (int i = 0; i < nums.length; i++) s += (i % 2 == 0) ? nums[i] : -nums[i];
        return s;
    }
}`,
    pythonSolution: `def alternatingWeightedSum(nums):
    return sum(x if i % 2 == 0 else -x for i, x in enumerate(nums))`
  },
  {
    number: 33,
    title: 'Minimum Cost to Paint Fence Posts',
    fnName: 'minFencePaintCost',
    description: 'There are <code>n</code> fence posts, and painting post <code>i</code> costs <code>costs[i]</code>. You can skip at most one post between painted posts (i.e. no two consecutive posts may be skipped, and you can start at post 0 or 1, ending at n-1 or n-2). Return minimum total cost.',
    constraints: ['1 <= costs.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'costs = [10, 15, 20]', output: '15' },
      { title: 'Test Case 2', input: 'costs = [1, 100, 1, 1, 1, 100, 1]', output: '4' },
      { title: 'Test Case 3', input: 'costs = [5]', output: '0' },
      { title: 'Test Case 4', input: 'costs = [4, 8]', output: '4' }
    ],
    javaSolution: `public class Solution {
    public static int minFencePaintCost(int[] costs) {
        if (costs.length == 1) return 0;
        int p2 = costs[0], p1 = costs[1];
        for (int i = 2; i < costs.length; i++) {
            int cur = costs[i] + Math.min(p1, p2);
            p2 = p1; p1 = cur;
        }
        return Math.min(p1, p2);
    }
}`,
    pythonSolution: `def minFencePaintCost(costs):
    if len(costs) == 1: return 0
    p2, p1 = costs[0], costs[1]
    for c in costs[2:]: p2, p1 = p1, c + min(p1, p2)
    return min(p1, p2)`
  },
  {
    number: 34,
    title: 'Binary Matrix Row Flip Max Score',
    fnName: 'countAllZeroRows',
    description: 'Given a binary matrix <code>mat</code>, return how many rows contain strictly more <code>1</code>s than <code>0</code>s.',
    constraints: ['1 <= R, C <= 200'],
    testCases: [
      { title: 'Test Case 1', input: 'mat = [[1, 1, 0], [0, 0, 1], [1, 1, 1]]', output: '2' },
      { title: 'Test Case 2', input: 'mat = [[1, 0], [0, 1]]', output: '0' },
      { title: 'Test Case 3', input: 'mat = [[1]]', output: '1' },
      { title: 'Test Case 4', input: 'mat = [[0, 0, 0]]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countAllZeroRows(int[][] mat) {
        int cnt = 0;
        for (int[] r : mat) {
            int ones = 0;
            for (int x : r) ones += x;
            if (ones * 2 > r.length) cnt++;
        }
        return cnt;
    }
}`,
    pythonSolution: `def countAllZeroRows(mat):
    return sum(1 for r in mat if sum(r) * 2 > len(r))`
  },
  {
    number: 35,
    title: 'K-Step Cyclic String Decryption',
    fnName: 'caesarDecrypt',
    description: 'Decrypt a lowercase string <code>cipher</code> encrypted with a right shift of <code>k</code> (shift each letter backward by <code>k</code> positions mod 26).',
    constraints: ['1 <= cipher.length <= 10^5', '0 <= k <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'cipher = "def", k = 3', output: 'abc' },
      { title: 'Test Case 2', input: 'cipher = "abc", k = 3', output: 'xyz' },
      { title: 'Test Case 3', input: 'cipher = "wipro", k = 26', output: 'wipro' },
      { title: 'Test Case 4', input: 'cipher = "z", k = 1', output: 'y' }
    ],
    javaSolution: `public class Solution {
    public static String caesarDecrypt(String cipher, int k) {
        k %= 26;
        StringBuilder sb = new StringBuilder();
        for (char c : cipher.toCharArray()) sb.append((char) ('a' + (c - 'a' - k + 26) % 26));
        return sb.toString();
    }
}`,
    pythonSolution: `def caesarDecrypt(cipher, k):
    k %= 26
    return ''.join(chr(97 + (ord(c) - 97 - k) % 26) for c in cipher)`
  },
  {
    number: 36,
    title: 'Balanced Half-Array Sum Check',
    fnName: 'canSplitPrefixSuffixEqual',
    description: 'Return <code>true</code> if there exists an index <code>i</code> (<code>0 &lt;= i &lt; n - 1</code>) such that <code>sum(nums[0..i]) == sum(nums[i+1..n-1])</code>, else <code>false</code>.',
    constraints: ['2 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 2, 3, 6]', output: 'true' },
      { title: 'Test Case 2', input: 'nums = [1, 2, 4]', output: 'false' },
      { title: 'Test Case 3', input: 'nums = [0, 0]', output: 'true' },
      { title: 'Test Case 4', input: 'nums = [5, -5, 5, 5]', output: 'true' }
    ],
    javaSolution: `public class Solution {
    public static boolean canSplitPrefixSuffixEqual(int[] nums) {
        long total = 0; for (int x : nums) total += x;
        long left = 0;
        for (int i = 0; i < nums.length - 1; i++) {
            left += nums[i];
            if (left * 2 == total) return true;
        }
        return false;
    }
}`,
    pythonSolution: `def canSplitPrefixSuffixEqual(nums):
    total = sum(nums); left = 0
    for x in nums[:-1]:
        left += x
        if left * 2 == total: return True
    return False`
  },
  {
    number: 37,
    title: 'Minimum Difference Between Any Two Scores',
    fnName: 'minScoreGap',
    description: 'Given unsorted student scores <code>scores</code> (at least 2), return the minimum absolute difference between any two scores.',
    constraints: ['2 <= scores.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'scores = [40, 10, 25, 28, 90]', output: '3' },
      { title: 'Test Case 2', input: 'scores = [5, 5, 10]', output: '0' },
      { title: 'Test Case 3', input: 'scores = [1, 100]', output: '99' },
      { title: 'Test Case 4', input: 'scores = [-5, -2, 3]', output: '3' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minScoreGap(int[] scores) {
        int[] s = scores.clone(); Arrays.sort(s);
        int best = Integer.MAX_VALUE;
        for (int i = 1; i < s.length; i++) best = Math.min(best, s[i] - s[i - 1]);
        return best;
    }
}`,
    pythonSolution: `def minScoreGap(scores):
    s = sorted(scores)
    return min(s[i] - s[i - 1] for i in range(1, len(s)))`
  },
  {
    number: 38,
    title: 'Decimal to Binary Palindrome Check',
    fnName: 'countBinaryPalindromes',
    description: 'Given an array of positive integers <code>nums</code>, return how many have a binary representation (without leading zeros) that is a palindrome.',
    constraints: ['1 <= nums.length <= 10^4', '1 <= nums[i] <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 2, 3, 5, 7, 9]', output: '5' },
      { title: 'Test Case 2', input: 'nums = [4, 6, 8]', output: '0' },
      { title: 'Test Case 3', input: 'nums = [21]', output: '1' },
      { title: 'Test Case 4', input: 'nums = [10]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countBinaryPalindromes(int[] nums) {
        int cnt = 0;
        for (int n : nums) {
            String b = Integer.toBinaryString(n);
            if (b.equals(new StringBuilder(b).reverse().toString())) cnt++;
        }
        return cnt;
    }
}`,
    pythonSolution: `def countBinaryPalindromes(nums):
    return sum(1 for n in nums if (b := bin(n)[2:]) == b[::-1])`
  },
  {
    number: 39,
    title: 'Running Median Floor Check',
    fnName: 'countAboveRunningMax',
    description: 'Given integer array <code>nums</code>, count how many elements <code>nums[i]</code> (<code>i &gt;= 1</code>) are strictly greater than EVERY element before them.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [3, 4, 2, 5, 5, 8]', output: '3' },
      { title: 'Test Case 2', input: 'nums = [10, 9, 8]', output: '0' },
      { title: 'Test Case 3', input: 'nums = [1, 2, 3, 4]', output: '3' },
      { title: 'Test Case 4', input: 'nums = [5]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countAboveRunningMax(int[] nums) {
        int mx = nums[0], cnt = 0;
        for (int i = 1; i < nums.length; i++) {
            if (nums[i] > mx) { cnt++; mx = nums[i]; }
        }
        return cnt;
    }
}`,
    pythonSolution: `def countAboveRunningMax(nums):
    mx, cnt = nums[0], 0
    for x in nums[1:]:
        if x > mx: cnt += 1; mx = x
    return cnt`
  },
  {
    number: 40,
    title: 'Word Length Histogram Peak',
    fnName: 'mostCommonWordLength',
    description: 'Given an array of words <code>words</code>, return the word length that appears most frequently (break ties by smaller length).',
    constraints: ['1 <= words.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'words = ["cat", "dog", "bird", "ant", "fish"]', output: '3' },
      { title: 'Test Case 2', input: 'words = ["hi", "to", "ab", "cd"]', output: '2' },
      { title: 'Test Case 3', input: 'words = ["a", "bb", "cc", "d"]', output: '1' },
      { title: 'Test Case 4', input: 'words = ["wipro"]', output: '5' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int mostCommonWordLength(String[] words) {
        Map<Integer, Integer> f = new HashMap<>();
        for (String w : words) f.put(w.length(), f.getOrDefault(w.length(), 0) + 1);
        int bestL = Integer.MAX_VALUE, bestC = -1;
        for (Map.Entry<Integer, Integer> e : f.entrySet()) {
            if (e.getValue() > bestC || (e.getValue() == bestC && e.getKey() < bestL)) {
                bestL = e.getKey(); bestC = e.getValue();
            }
        }
        return bestL;
    }
}`,
    pythonSolution: `def mostCommonWordLength(words):
    from collections import Counter
    c = Counter(len(w) for w in words)
    return min(c.keys(), key=lambda l: (-c[l], l))`
  },
  {
    number: 41,
    title: 'Consecutive Equal Pair Eliminator',
    fnName: 'minLenAfterPairElimination',
    description: 'In a string <code>s</code> of digits, you may repeatedly delete any two adjacent digits that sum to <code>10</code> (e.g. <code>"37"</code> or <code>"55"</code>). Return the minimum possible length of <code>s</code> after all such deletions.',
    constraints: ['1 <= s.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 's = "1379"', output: '0' },
      { title: 'Test Case 2', input: 's = "5528"', output: '0' },
      { title: 'Test Case 3', input: 's = "1234"', output: '4' },
      { title: 'Test Case 4', input: 's = "46055"', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int minLenAfterPairElimination(String s) {
        StringBuilder st = new StringBuilder();
        for (char c : s.toCharArray()) {
            int len = st.length();
            if (len > 0 && (st.charAt(len - 1) - '0') + (c - '0') == 10) st.deleteCharAt(len - 1);
            else st.append(c);
        }
        return st.length();
    }
}`,
    pythonSolution: `def minLenAfterPairElimination(s):
    st = []
    for c in s:
        if st and int(st[-1]) + int(c) == 10: st.pop()
        else: st.append(c)
    return len(st)`
  },
  {
    number: 42,
    title: 'Subarray With Exact Target Average',
    fnName: 'countSubarraysWithAvg',
    description: 'Given integer array <code>nums</code> and integer <code>targetAvg</code>, return the number of non-empty contiguous subarrays whose exact arithmetic mean equals <code>targetAvg</code>.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [2, 1, 3], targetAvg = 2', output: '3' },
      { title: 'Test Case 2', input: 'nums = [0, 4, 3, -1], targetAvg = 2', output: '2' },
      { title: 'Test Case 3', input: 'nums = [5, 5, 5], targetAvg = 5', output: '6' },
      { title: 'Test Case 4', input: 'nums = [1, 2], targetAvg = 10', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long countSubarraysWithAvg(int[] nums, int targetAvg) {
        Map<Long, Long> m = new HashMap<>();
        m.put(0L, 1L);
        long s = 0, ans = 0;
        for (int x : nums) {
            s += (x - targetAvg);
            ans += m.getOrDefault(s, 0L);
            m.put(s, m.getOrDefault(s, 0L) + 1);
        }
        return ans;
    }
}`,
    pythonSolution: `def countSubarraysWithAvg(nums, targetAvg):
    m, s, ans = {0: 1}, 0, 0
    for x in nums:
        s += x - targetAvg
        ans += m.get(s, 0)
        m[s] = m.get(s, 0) + 1
    return ans`
  },
  {
    number: 43,
    title: 'Spiral Matrix Corner Elements Sum',
    fnName: 'cornerElementsSum',
    description: 'Given an <code>R x C</code> matrix <code>mat</code>, return the sum of its 4 corner elements (if R == 1 or C == 1, avoid double counting the same cell).',
    constraints: ['1 <= R, C <= 200'],
    testCases: [
      { title: 'Test Case 1', input: 'mat = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]', output: '20' },
      { title: 'Test Case 2', input: 'mat = [[10, 20, 30]]', output: '40' },
      { title: 'Test Case 3', input: 'mat = [[5]]', output: '5' },
      { title: 'Test Case 4', input: 'mat = [[2], [4], [6]]', output: '8' }
    ],
    javaSolution: `public class Solution {
    public static int cornerElementsSum(int[][] mat) {
        int r = mat.length, c = mat[0].length;
        if (r == 1 && c == 1) return mat[0][0];
        if (r == 1) return mat[0][0] + mat[0][c - 1];
        if (c == 1) return mat[0][0] + mat[r - 1][0];
        return mat[0][0] + mat[0][c - 1] + mat[r - 1][0] + mat[r - 1][c - 1];
    }
}`,
    pythonSolution: `def cornerElementsSum(mat):
    r, c = len(mat), len(mat[0])
    pts = {(0, 0), (0, c - 1), (r - 1, 0), (r - 1, c - 1)}
    return sum(mat[i][j] for i, j in pts)`
  },
  {
    number: 44,
    title: 'Minimum Operations to Make String Palindrome by Changing Chars',
    fnName: 'minSubsToPalindrome',
    description: 'Given string <code>s</code>, in one operation you can change any single character to any other character. Return the minimum operations to make <code>s</code> a palindrome.',
    constraints: ['1 <= s.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 's = "abca"', output: '1' },
      { title: 'Test Case 2', input: 's = "racecar"', output: '0' },
      { title: 'Test Case 3', input: 's = "abcd"', output: '2' },
      { title: 'Test Case 4', input: 's = "z"', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int minSubsToPalindrome(String s) {
        int ops = 0, l = 0, r = s.length() - 1;
        while (l < r) if (s.charAt(l++) != s.charAt(r--)) ops++;
        return ops;
    }
}`,
    pythonSolution: `def minSubsToPalindrome(s):
    return sum(1 for i in range(len(s) // 2) if s[i] != s[-1 - i])`
  },
  {
    number: 45,
    title: 'K-Nearest Elements Sum in Sorted Array',
    fnName: 'sumKClosestElements',
    description: 'Given a sorted integer array <code>arr</code>, integer <code>k</code>, and target <code>x</code>, find the <code>k</code> elements closest to <code>x</code> (tie-break by smaller value) and return their sum.',
    constraints: ['1 <= k <= arr.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'arr = [1, 2, 3, 4, 5], k = 4, x = 3', output: '10' },
      { title: 'Test Case 2', input: 'arr = [1, 2, 3, 4, 5], k = 4, x = -1', output: '10' },
      { title: 'Test Case 3', input: 'arr = [10, 20, 30], k = 1, x = 25', output: '20' },
      { title: 'Test Case 4', input: 'arr = [5], k = 1, x = 100', output: '5' }
    ],
    javaSolution: `public class Solution {
    public static long sumKClosestElements(int[] arr, int k, int x) {
        int l = 0, r = arr.length - k;
        while (l < r) {
            int m = (l + r) >>> 1;
            if (x - arr[m] > arr[m + k] - x) l = m + 1; else r = m;
        }
        long sum = 0;
        for (int i = l; i < l + k; i++) sum += arr[i];
        return sum;
    }
}`,
    pythonSolution: `def sumKClosestElements(arr, k, x):
    l, r = 0, len(arr) - k
    while l < r:
        m = (l + r) // 2
        if x - arr[m] > arr[m + k] - x: l = m + 1
        else: r = m
    return sum(arr[l:l + k])`
  },
  {
    number: 46,
    title: 'Maximum Sum of Non-Overlapping Pairs',
    fnName: 'maxDisjointPairSum',
    description: 'Given an array of integers <code>nums</code>, return the maximum sum of <code>k</code> elements? No — given sorted or unsorted <code>nums</code>, pick <code>k</code> largest elements and return their sum.',
    constraints: ['1 <= k <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [3, 1, 5, 2, 4], k = 3', output: '12' },
      { title: 'Test Case 2', input: 'nums = [10, 10], k = 1', output: '10' },
      { title: 'Test Case 3', input: 'nums = [-1, -2, -3], k = 2', output: '-3' },
      { title: 'Test Case 4', input: 'nums = [7], k = 1', output: '7' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long maxDisjointPairSum(int[] nums, int k) {
        int[] a = nums.clone(); Arrays.sort(a);
        long s = 0;
        for (int i = a.length - 1; i >= a.length - k; i--) s += a[i];
        return s;
    }
}`,
    pythonSolution: `def maxDisjointPairSum(nums, k):
    return sum(sorted(nums, reverse=True)[:k])`
  },
  {
    number: 47,
    title: 'Check Monotonic Array Trend',
    fnName: 'isMonotonicSeries',
    description: 'Return <code>true</code> if array <code>nums</code> is either entirely non-decreasing or entirely non-increasing, otherwise <code>false</code>.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 2, 2, 3]', output: 'true' },
      { title: 'Test Case 2', input: 'nums = [6, 5, 4, 4]', output: 'true' },
      { title: 'Test Case 3', input: 'nums = [1, 3, 2]', output: 'false' },
      { title: 'Test Case 4', input: 'nums = [5]', output: 'true' }
    ],
    javaSolution: `public class Solution {
    public static boolean isMonotonicSeries(int[] nums) {
        boolean inc = true, dec = true;
        for (int i = 1; i < nums.length; i++) {
            if (nums[i] > nums[i - 1]) dec = false;
            if (nums[i] < nums[i - 1]) inc = false;
        }
        return inc || dec;
    }
}`,
    pythonSolution: `def isMonotonicSeries(nums):
    return all(nums[i] >= nums[i-1] for i in range(1, len(nums))) or all(nums[i] <= nums[i-1] for i in range(1, len(nums)))`
  },
  {
    number: 48,
    title: 'Count Pairs With Sum Equal to Power of 2',
    fnName: 'countPowerOfTwoPairs',
    description: 'Given an array of non-negative integers <code>nums</code> (<code>0 &lt;= nums[i] &lt;= 10^5</code>), return the number of pairs <code>(i, j)</code> with <code>i &lt; j</code> such that <code>nums[i] + nums[j]</code> is a power of 2 (1, 2, 4, 8, ...).',
    constraints: ['1 <= nums.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 3, 5, 7, 9]', output: '4' },
      { title: 'Test Case 2', input: 'nums = [1, 1, 1, 3, 3, 3, 7]', output: '15' },
      { title: 'Test Case 3', input: 'nums = [0, 1]', output: '1' },
      { title: 'Test Case 4', input: 'nums = [2, 4]', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long countPowerOfTwoPairs(int[] nums) {
        Map<Integer, Long> cnt = new HashMap<>();
        long ans = 0;
        for (int x : nums) {
            for (int p = 1; p <= (1 << 18); p <<= 1) ans += cnt.getOrDefault(p - x, 0L);
            cnt.put(x, cnt.getOrDefault(x, 0L) + 1);
        }
        return ans;
    }
}`,
    pythonSolution: `def countPowerOfTwoPairs(nums):
    from collections import defaultdict
    cnt, ans = defaultdict(int), 0
    pows = [1 << k for k in range(19)]
    for x in nums:
        for p in pows: ans += cnt[p - x]
        cnt[x] += 1
    return ans`
  },
  {
    number: 49,
    title: 'Minimum Operations to Make All Elements Divisible by 3',
    fnName: 'minOpsDivisibleByThree',
    description: 'In one operation you can add or subtract 1 from any element of <code>nums</code>. Return the minimum operations so every element in <code>nums</code> is divisible by 3.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 2, 3, 4]', output: '3' },
      { title: 'Test Case 2', input: 'nums = [3, 6, 9]', output: '0' },
      { title: 'Test Case 3', input: 'nums = [1, 1, 1]', output: '3' },
      { title: 'Test Case 4', input: 'nums = [2]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int minOpsDivisibleByThree(int[] nums) {
        int ops = 0;
        for (int x : nums) if (x % 3 != 0) ops++;
        return ops;
    }
}`,
    pythonSolution: `def minOpsDivisibleByThree(nums):
    return sum(1 for x in nums if x % 3 != 0)`
  },
  {
    number: 50,
    title: 'Longest Balanced Substring of Letters and Digits',
    fnName: 'longestAlnumBalancedSpan',
    description: 'Given an alphanumeric string <code>s</code>, return the length of the longest contiguous substring that contains an equal number of letters and digits.',
    constraints: ['1 <= s.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 's = "a1b2c3d"', output: '6' },
      { title: 'Test Case 2', input: 's = "abcd"', output: '0' },
      { title: 'Test Case 3', input: 's = "a12b"', output: '4' },
      { title: 'Test Case 4', input: 's = "123a"', output: '2' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int longestAlnumBalancedSpan(String s) {
        Map<Integer, Integer> first = new HashMap<>();
        first.put(0, -1);
        int bal = 0, best = 0;
        for (int i = 0; i < s.length(); i++) {
            bal += Character.isLetter(s.charAt(i)) ? 1 : -1;
            if (first.containsKey(bal)) best = Math.max(best, i - first.get(bal));
            else first.put(bal, i);
        }
        return best;
    }
}`,
    pythonSolution: `def longestAlnumBalancedSpan(s):
    first, bal, best = {0: -1}, 0, 0
    for i, c in enumerate(s):
        bal += 1 if c.isalpha() else -1
        if bal in first: best = max(best, i - first[bal])
        else: first[bal] = i
    return best`
  }
];
