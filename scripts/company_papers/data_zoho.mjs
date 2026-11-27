export const ZOHO_QUESTIONS = [
  {
    number: 1,
    title: 'Alternating Peak-Valley Rearrangement',
    fnName: 'countAlternatingViolations',
    description: 'In Zoho Round 2, an array <code>nums</code> is wave-sorted if <code>nums[0] >= nums[1] <= nums[2] >= nums[3] ...</code>. Count how many adjacent pairs violate this wave condition.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [10, 5, 6, 3, 2, 20]', output: '2' },
      { title: 'Test Case 2', input: 'nums = [10, 2, 8, 1]', output: '0' },
      { title: 'Test Case 3', input: 'nums = [1, 2, 3, 4]', output: '2' },
      { title: 'Test Case 4', input: 'nums = [5]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countAlternatingViolations(int[] nums) {
        int bad = 0;
        for (int i = 0; i + 1 < nums.length; i++) {
            if (i % 2 == 0) { if (nums[i] < nums[i + 1]) bad++; }
            else { if (nums[i] > nums[i + 1]) bad++; }
        }
        return bad;
    }
}`,
    pythonSolution: `def countAlternatingViolations(nums):
    bad = 0
    for i in range(len(nums) - 1):
        if i % 2 == 0 and nums[i] < nums[i + 1]: bad += 1
        elif i % 2 == 1 and nums[i] > nums[i + 1]: bad += 1
    return bad`
  },
  {
    number: 2,
    title: 'Number System Base-K Digit Sum',
    fnName: 'sumDigitsInBaseK',
    description: 'Convert non-negative integer <code>n</code> into base <code>k</code> and return the sum of its digits in base <code>k</code>.',
    constraints: ['0 <= n <= 10^9', '2 <= k <= 16'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 34, k = 6', output: '9' },
      { title: 'Test Case 2', input: 'n = 10, k = 2', output: '2' },
      { title: 'Test Case 3', input: 'n = 0, k = 8', output: '0' },
      { title: 'Test Case 4', input: 'n = 255, k = 16', output: '30' }
    ],
    javaSolution: `public class Solution {
    public static int sumDigitsInBaseK(int n, int k) {
        int s = 0;
        while (n > 0) { s += n % k; n /= k; }
        return s;
    }
}`,
    pythonSolution: `def sumDigitsInBaseK(n, k):
    s = 0
    while n > 0: s += n % k; n //= k
    return s`
  },
  {
    number: 3,
    title: 'Matrix X-Cross Diagonal Sum',
    fnName: 'sumMatrixXCross',
    description: 'Given an <code>n x n</code> square matrix <code>mat</code>, return the sum of all elements on both main diagonals without double-counting the center element when <code>n</code> is odd.',
    constraints: ['1 <= n <= 500'],
    testCases: [
      { title: 'Test Case 1', input: 'mat = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]', output: '25' },
      { title: 'Test Case 2', input: 'mat = [[1, 1], [1, 1]]', output: '4' },
      { title: 'Test Case 3', input: 'mat = [[7]]', output: '7' },
      { title: 'Test Case 4', input: 'mat = [[1, 0, 0, 2], [0, 3, 4, 0], [0, 5, 6, 0], [7, 0, 0, 8]]', output: '36' }
    ],
    javaSolution: `public class Solution {
    public static long sumMatrixXCross(int[][] mat) {
        int n = mat.length; long s = 0;
        for (int i = 0; i < n; i++) {
            s += mat[i][i];
            if (i != n - 1 - i) s += mat[i][n - 1 - i];
        }
        return s;
    }
}`,
    pythonSolution: `def sumMatrixXCross(mat):
    n = len(mat)
    return sum(mat[i][i] + (mat[i][n-1-i] if i != n-1-i else 0) for i in range(n))`
  },
  {
    number: 4,
    title: 'Reverse Only Alphabetic Characters',
    fnName: 'reverseLettersOnly',
    description: 'Given a string <code>s</code> containing letters and punctuation/digits, reverse only the English letters (a-z, A-Z) while keeping all other characters in their original positions.',
    constraints: ['1 <= s.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 's = "a-bC-dEf-ghIj"', output: 'j-Ih-gfE-dCba' },
      { title: 'Test Case 2', input: 's = "1234"', output: '1234' },
      { title: 'Test Case 3', input: 's = "zoho"', output: 'ohoz' },
      { title: 'Test Case 4', input: 's = "a1b2c"', output: 'c1b2a' }
    ],
    javaSolution: `public class Solution {
    public static String reverseLettersOnly(String s) {
        char[] a = s.toCharArray();
        int l = 0, r = a.length - 1;
        while (l < r) {
            if (!Character.isLetter(a[l])) l++;
            else if (!Character.isLetter(a[r])) r--;
            else { char t = a[l]; a[l++] = a[r]; a[r--] = t; }
        }
        return new String(a);
    }
}`,
    pythonSolution: `def reverseLettersOnly(s):
    a = list(s); l, r = 0, len(a) - 1
    while l < r:
        if not a[l].isalpha(): l += 1
        elif not a[r].isalpha(): r -= 1
        else: a[l], a[r] = a[r], a[l]; l += 1; r -= 1
    return "".join(a)`
  },
  {
    number: 5,
    title: 'Spiral Matrix Outer Ring Sum',
    fnName: 'outerRingSum',
    description: 'Given an <code>R x C</code> matrix <code>mat</code>, return the sum of all elements on its outermost perimeter ring.',
    constraints: ['1 <= R, C <= 500'],
    testCases: [
      { title: 'Test Case 1', input: 'mat = [[1, 2, 3], [4, 9, 6], [7, 8, 5]]', output: '36' },
      { title: 'Test Case 2', input: 'mat = [[5]]', output: '5' },
      { title: 'Test Case 3', input: 'mat = [[1, 2, 3, 4]]', output: '10' },
      { title: 'Test Case 4', input: 'mat = [[1, 2], [3, 4]]', output: '10' }
    ],
    javaSolution: `public class Solution {
    public static long outerRingSum(int[][] mat) {
        int R = mat.length, C = mat[0].length; long s = 0;
        for (int r = 0; r < R; r++) for (int c = 0; c < C; c++)
            if (r == 0 || r == R - 1 || c == 0 || c == C - 1) s += mat[r][c];
        return s;
    }
}`,
    pythonSolution: `def outerRingSum(mat):
    R, C = len(mat), len(mat[0])
    return sum(mat[r][c] for r in range(R) for c in range(C) if r in (0, R-1) or c in (0, C-1))`
  },
  {
    number: 6,
    title: 'Equilibrium Index First Match',
    fnName: 'firstEquilibriumIndex',
    description: 'Return the smallest 0-based index <code>i</code> in <code>nums</code> where the sum of elements strictly to the left equals the sum strictly to the right, or <code>-1</code> if none exists.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 7, 3, 6, 5, 6]', output: '3' },
      { title: 'Test Case 2', input: 'nums = [1, 2, 3]', output: '-1' },
      { title: 'Test Case 3', input: 'nums = [2, 1, -1]', output: '0' },
      { title: 'Test Case 4', input: 'nums = [10]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int firstEquilibriumIndex(int[] nums) {
        long tot = 0; for (int x : nums) tot += x;
        long left = 0;
        for (int i = 0; i < nums.length; i++) {
            if (left == tot - left - nums[i]) return i;
            left += nums[i];
        }
        return -1;
    }
}`,
    pythonSolution: `def firstEquilibriumIndex(nums):
    tot = sum(nums); left = 0
    for i, x in enumerate(nums):
        if left == tot - left - x: return i
        left += x
    return -1`
  },
  {
    number: 7,
    title: 'Next Greater Element Right Count',
    fnName: 'countElementsWithGreaterRight',
    description: 'Given array <code>nums</code>, count how many elements have at least one strictly greater element anywhere to their right.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [4, 2, 7, 1, 5]', output: '3' },
      { title: 'Test Case 2', input: 'nums = [5, 4, 3, 2]', output: '0' },
      { title: 'Test Case 3', input: 'nums = [1, 2, 3, 4]', output: '3' },
      { title: 'Test Case 4', input: 'nums = [9]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countElementsWithGreaterRight(int[] nums) {
        int mx = Integer.MIN_VALUE, cnt = 0;
        for (int i = nums.length - 1; i >= 0; i--) {
            if (nums[i] < mx) cnt++;
            mx = Math.max(mx, nums[i]);
        }
        return cnt;
    }
}`,
    pythonSolution: `def countElementsWithGreaterRight(nums):
    mx = float('-inf'); cnt = 0
    for x in reversed(nums):
        if x < mx: cnt += 1
        mx = max(mx, x)
    return cnt`
  },
  {
    number: 8,
    title: 'Run-Length Expand Digit String',
    fnName: 'expandedStringLength',
    description: 'A compressed string <code>s</code> alternates single letter and single digit (1..9), e.g., <code>"a3b2c1"</code>. Return the length of the expanded string.',
    constraints: ['2 <= s.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 's = "a3b2c1"', output: '6' },
      { title: 'Test Case 2', input: 's = "z9"', output: '9' },
      { title: 'Test Case 3', input: 's = "x1y1"', output: '2' },
      { title: 'Test Case 4', input: 's = "m5n5"', output: '10' }
    ],
    javaSolution: `public class Solution {
    public static int expandedStringLength(String s) {
        int len = 0;
        for (int i = 1; i < s.length(); i += 2) len += s.charAt(i) - '0';
        return len;
    }
}`,
    pythonSolution: `def expandedStringLength(s):
    return sum(int(s[i]) for i in range(1, len(s), 2))`
  },
  {
    number: 9,
    title: 'Matrix Saddle Row-Min Col-Max',
    fnName: 'countLuckyNumbers',
    description: 'Given an <code>R x C</code> matrix <code>mat</code> of distinct integers, count how many entries are simultaneously the minimum in their row and maximum in their column.',
    constraints: ['1 <= R, C <= 200'],
    testCases: [
      { title: 'Test Case 1', input: 'mat = [[3, 7, 8], [9, 11, 13], [15, 16, 17]]', output: '1' },
      { title: 'Test Case 2', input: 'mat = [[1, 4], [3, 2]]', output: '0' },
      { title: 'Test Case 3', input: 'mat = [[5]]', output: '1' },
      { title: 'Test Case 4', input: 'mat = [[7, 8], [1, 2]]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countLuckyNumbers(int[][] mat) {
        int R = mat.length, C = mat[0].length;
        int[] rmin = new int[R], cmax = new int[C];
        for (int r = 0; r < R; r++) {
            rmin[r] = mat[r][0];
            for (int c = 1; c < C; c++) rmin[r] = Math.min(rmin[r], mat[r][c]);
        }
        for (int c = 0; c < C; c++) {
            cmax[c] = mat[0][c];
            for (int r = 1; r < R; r++) cmax[c] = Math.max(cmax[c], mat[r][c]);
        }
        int cnt = 0;
        for (int r = 0; r < R; r++) for (int c = 0; c < C; c++) if (mat[r][c] == rmin[r] && mat[r][c] == cmax[c]) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countLuckyNumbers(mat):
    rmin = [min(r) for r in mat]
    cmax = [max(mat[r][c] for r in range(len(mat))) for c in range(len(mat[0]))]
    return sum(1 for r in range(len(mat)) for c in range(len(mat[0])) if mat[r][c] == rmin[r] == cmax[c])`
  },
  {
    number: 10,
    title: 'Pangram Alphabet Missing Count',
    fnName: 'countMissingAlphabetLetters',
    description: 'Given a lowercase string <code>s</code>, return how many letters of the English alphabet (<code>a..z</code>) do NOT appear in <code>s</code>.',
    constraints: ['0 <= s.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 's = "thequickbrownfoxjumpsoverthelazydog"', output: '0' },
      { title: 'Test Case 2', input: 's = "abc"', output: '23' },
      { title: 'Test Case 3', input: 's = ""', output: '26' },
      { title: 'Test Case 4', input: 's = "zzzzzz"', output: '25' }
    ],
    javaSolution: `public class Solution {
    public static int countMissingAlphabetLetters(String s) {
        boolean[] seen = new boolean[26];
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c >= 'a' && c <= 'z') seen[c - 'a'] = true;
        }
        int miss = 0;
        for (boolean b : seen) if (!b) miss++;
        return miss;
    }
}`,
    pythonSolution: `def countMissingAlphabetLetters(s):
    return 26 - len({c for c in s if 'a' <= c <= 'z'})`
  },
  {
    number: 11,
    title: 'Zeroes Moved to End Swaps',
    fnName: 'countNonZeroElements',
    description: 'Given integer array <code>nums</code>, return how many non-zero elements exist (i.e. length of the non-zero prefix after moving all zeros to the end).',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [0, 1, 0, 3, 12]', output: '3' },
      { title: 'Test Case 2', input: 'nums = [0, 0, 0]', output: '0' },
      { title: 'Test Case 3', input: 'nums = [1, 2, 3]', output: '3' },
      { title: 'Test Case 4', input: 'nums = [0]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countNonZeroElements(int[] nums) {
        int cnt = 0;
        for (int x : nums) if (x != 0) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countNonZeroElements(nums):
    return sum(1 for x in nums if x != 0)`
  },
  {
    number: 12,
    title: 'Palindrome Ignore Non-Alphanumeric',
    fnName: 'isCleanPalindrome',
    description: 'Return <code>true</code> if string <code>s</code> is a palindrome considering only alphanumeric characters (case-insensitive), else <code>false</code>.',
    constraints: ['1 <= s.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 's = "A man, a plan, a canal: Panama"', output: 'true' },
      { title: 'Test Case 2', input: 's = "race a car"', output: 'false' },
      { title: 'Test Case 3', input: 's = " "', output: 'true' },
      { title: 'Test Case 4', input: 's = "0P"', output: 'false' }
    ],
    javaSolution: `public class Solution {
    public static boolean isCleanPalindrome(String s) {
        int l = 0, r = s.length() - 1;
        while (l < r) {
            while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;
            while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;
            if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r))) return false;
            l++; r--;
        }
        return true;
    }
}`,
    pythonSolution: `def isCleanPalindrome(s):
    t = [c.lower() for c in s if c.isalnum()]
    return t == t[::-1]`
  },
  {
    number: 13,
    title: 'Roman Numeral Value Converter',
    fnName: 'romanToInteger',
    description: 'Convert a valid Roman numeral string <code>s</code> (using I, V, X, L, C, D, M) to its integer value.',
    constraints: ['1 <= s.length <= 15'],
    testCases: [
      { title: 'Test Case 1', input: 's = "MCMXCIV"', output: '1994' },
      { title: 'Test Case 2', input: 's = "LVIII"', output: '58' },
      { title: 'Test Case 3', input: 's = "IV"', output: '4' },
      { title: 'Test Case 4', input: 's = "III"', output: '3' }
    ],
    javaSolution: `public class Solution {
    public static int romanToInteger(String s) {
        int[] map = new int[128];
        map['I']=1; map['V']=5; map['X']=10; map['L']=50; map['C']=100; map['D']=500; map['M']=1000;
        int tot = 0;
        for (int i = 0; i < s.length(); i++) {
            int v = map[s.charAt(i)];
            if (i + 1 < s.length() && v < map[s.charAt(i + 1)]) tot -= v;
            else tot += v;
        }
        return tot;
    }
}`,
    pythonSolution: `def romanToInteger(s):
    m = {'I':1,'V':5,'X':10,'L':50,'C':100,'D':500,'M':1000}
    tot = 0
    for i, c in enumerate(s):
        if i + 1 < len(s) and m[c] < m[s[i + 1]]: tot -= m[c]
        else: tot += m[c]
    return tot`
  },
  {
    number: 14,
    title: 'Circular Array Rotation Value',
    fnName: 'valueAfterRightRotate',
    description: 'Given array <code>nums</code> of length <code>n</code>, rotate it right by <code>k</code> positions and return the element at index <code>idx</code>.',
    constraints: ['1 <= nums.length <= 10^5', '0 <= k <= 10^9', '0 <= idx < nums.length'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [10, 20, 30, 40, 50], k = 2, idx = 0', output: '40' },
      { title: 'Test Case 2', input: 'nums = [1, 2, 3], k = 3, idx = 1', output: '2' },
      { title: 'Test Case 3', input: 'nums = [7], k = 100, idx = 0', output: '7' },
      { title: 'Test Case 4', input: 'nums = [5, 10], k = 1, idx = 1', output: '5' }
    ],
    javaSolution: `public class Solution {
    public static int valueAfterRightRotate(int[] nums, int k, int idx) {
        int n = nums.length;
        int orig = ((idx - (k % n)) + n) % n;
        return nums[orig];
    }
}`,
    pythonSolution: `def valueAfterRightRotate(nums, k, idx):
    n = len(nums)
    return nums[(idx - k) % n]`
  },
  {
    number: 15,
    title: 'Digit Sum Persistence Steps',
    fnName: 'additivePersistence',
    description: 'Given a non-negative integer <code>n</code>, repeatedly replace <code>n</code> with the sum of its digits until <code>n < 10</code>. Return the number of steps taken.',
    constraints: ['0 <= n <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 99', output: '2' },
      { title: 'Test Case 2', input: 'n = 5', output: '0' },
      { title: 'Test Case 3', input: 'n = 199', output: '3' },
      { title: 'Test Case 4', input: 'n = 10', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int additivePersistence(int n) {
        int steps = 0;
        while (n >= 10) {
            int s = 0;
            while (n > 0) { s += n % 10; n /= 10; }
            n = s; steps++;
        }
        return steps;
    }
}`,
    pythonSolution: `def additivePersistence(n):
    steps = 0
    while n >= 10:
        n = sum(int(d) for d in str(n)); steps += 1
    return steps`
  },
  {
    number: 16,
    title: 'Maximum Word Length Product',
    fnName: 'maxNonSharingWordProduct',
    description: 'Given lowercase words <code>words</code>, return the maximum value of <code>len(words[i]) * len(words[j])</code> where <code>words[i]</code> and <code>words[j]</code> share NO common letters (<code>0</code> if no such pair exists).',
    constraints: ['2 <= words.length <= 500'],
    testCases: [
      { title: 'Test Case 1', input: 'words = ["abcw", "baz", "foo", "bar", "xtfn", "abcdef"]', output: '16' },
      { title: 'Test Case 2', input: 'words = ["a", "aa", "aaa"]', output: '0' },
      { title: 'Test Case 3', input: 'words = ["ab", "cd"]', output: '4' },
      { title: 'Test Case 4', input: 'words = ["zoho", "app"]', output: '12' }
    ],
    javaSolution: `public class Solution {
    public static int maxNonSharingWordProduct(String[] words) {
        int n = words.length;
        int[] masks = new int[n];
        for (int i = 0; i < n; i++) for (char c : words[i].toCharArray()) masks[i] |= 1 << (c - 'a');
        int best = 0;
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                if ((masks[i] & masks[j]) == 0) best = Math.max(best, words[i].length() * words[j].length());
        return best;
    }
}`,
    pythonSolution: `def maxNonSharingWordProduct(words):
    masks = [0] * len(words)
    for i, w in enumerate(words):
        for c in w: masks[i] |= 1 << (ord(c) - ord('a'))
    best = 0
    for i in range(len(words)):
        for j in range(i + 1, len(words)):
            if (masks[i] & masks[j]) == 0:
                best = max(best, len(words[i]) * len(words[j]))
    return best`
  },
  {
    number: 17,
    title: 'Sort Odd Indices Ascending',
    fnName: 'countFixedOddPositions',
    description: 'Given array <code>nums</code>, sort elements at odd indices ascending and even indices descending, then return how many elements stayed at their original value-position.',
    constraints: ['1 <= nums.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [4, 1, 2, 3]', output: '4' },
      { title: 'Test Case 2', input: 'nums = [10, 1, 5, 2]', output: '4' },
      { title: 'Test Case 3', input: 'nums = [7]', output: '1' },
      { title: 'Test Case 4', input: 'nums = [1, 5, 3, 2]', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countFixedOddPositions(int[] nums) {
        List<Integer> ev = new ArrayList<>(), od = new ArrayList<>();
        for (int i = 0; i < nums.length; i++) {
            if (i % 2 == 0) ev.add(nums[i]); else od.add(nums[i]);
        }
        ev.sort(Collections.reverseOrder());
        Collections.sort(od);
        int fixed = 0, ei = 0, oi = 0;
        for (int i = 0; i < nums.length; i++) {
            int val = (i % 2 == 0) ? ev.get(ei++) : od.get(oi++);
            if (val == nums[i]) fixed++;
        }
        return fixed;
    }
}`,
    pythonSolution: `def countFixedOddPositions(nums):
    ev = sorted(nums[0::2], reverse=True)
    od = sorted(nums[1::2])
    res = [0] * len(nums)
    res[0::2] = ev; res[1::2] = od
    return sum(1 for a, b in zip(nums, res) if a == b)`
  },
  {
    number: 18,
    title: 'Submatrix All-Ones Square Count',
    fnName: 'countAllOnes2x2Squares',
    description: 'Given a binary matrix <code>mat</code>, count how many <code>2 x 2</code> submatrices consist entirely of <code>1</code>s.',
    constraints: ['1 <= mat.length, mat[0].length <= 200'],
    testCases: [
      { title: 'Test Case 1', input: 'mat = [[1, 1, 1], [1, 1, 0], [0, 1, 1]]', output: '1' },
      { title: 'Test Case 2', input: 'mat = [[1, 1], [1, 1]]', output: '1' },
      { title: 'Test Case 3', input: 'mat = [[1]]', output: '0' },
      { title: 'Test Case 4', input: 'mat = [[1, 1, 1], [1, 1, 1]]', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int countAllOnes2x2Squares(int[][] mat) {
        int cnt = 0;
        for (int r = 0; r + 1 < mat.length; r++)
            for (int c = 0; c + 1 < mat[0].length; c++)
                if (mat[r][c] == 1 && mat[r][c+1] == 1 && mat[r+1][c] == 1 && mat[r+1][c+1] == 1) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countAllOnes2x2Squares(mat):
    return sum(1 for r in range(len(mat)-1) for c in range(len(mat[0])-1) if mat[r][c]==mat[r][c+1]==mat[r+1][c]==mat[r+1][c+1]==1)`
  },
  {
    number: 19,
    title: 'Frequency Sort Tie-Break',
    fnName: 'maxFrequencyElement',
    description: 'Given array <code>nums</code>, return the element with the highest frequency (if tied, return the LARGEST element).',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [2, 3, 2, 3, 1]', output: '3' },
      { title: 'Test Case 2', input: 'nums = [5, 5, 1, 1, 1]', output: '1' },
      { title: 'Test Case 3', input: 'nums = [7]', output: '7' },
      { title: 'Test Case 4', input: 'nums = [4, 9, 2]', output: '9' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int maxFrequencyElement(int[] nums) {
        Map<Integer, Integer> freq = new HashMap<>();
        int bestV = nums[0], bestC = 0;
        for (int x : nums) {
            int c = freq.getOrDefault(x, 0) + 1;
            freq.put(x, c);
            if (c > bestC || (c == bestC && x > bestV)) { bestC = c; bestV = x; }
        }
        return bestV;
    }
}`,
    pythonSolution: `from collections import Counter
def maxFrequencyElement(nums):
    cnt = Counter(nums)
    return max(cnt.keys(), key=lambda x: (cnt[x], x))`
  },
  {
    number: 20,
    title: 'Matrix Transpose Diagonal Check',
    fnName: 'isSymmetricMatrix',
    description: 'Given an <code>n x n</code> matrix <code>mat</code>, return <code>true</code> if <code>mat[r][c] == mat[c][r]</code> for all <code>r, c</code>, else <code>false</code>.',
    constraints: ['1 <= n <= 200'],
    testCases: [
      { title: 'Test Case 1', input: 'mat = [[1, 2, 3], [2, 4, 5], [3, 5, 6]]', output: 'true' },
      { title: 'Test Case 2', input: 'mat = [[1, 2], [3, 4]]', output: 'false' },
      { title: 'Test Case 3', input: 'mat = [[9]]', output: 'true' },
      { title: 'Test Case 4', input: 'mat = [[0, 1], [1, 0]]', output: 'true' }
    ],
    javaSolution: `public class Solution {
    public static boolean isSymmetricMatrix(int[][] mat) {
        int n = mat.length;
        for (int r = 0; r < n; r++) for (int c = r + 1; c < n; c++) if (mat[r][c] != mat[c][r]) return false;
        return true;
    }
}`,
    pythonSolution: `def isSymmetricMatrix(mat):
    n = len(mat)
    return all(mat[r][c] == mat[c][r] for r in range(n) for c in range(r + 1, n))`
  },
  {
    number: 21,
    title: 'Vowel Substring Count',
    fnName: 'countAllVowelSubstrings',
    description: 'Given lowercase string <code>s</code>, count how many substrings consist ONLY of vowels (<code>a, e, i, o, u</code>).',
    constraints: ['1 <= s.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 's = "abaei"', output: '7' },
      { title: 'Test Case 2', input: 's = "bcdf"', output: '0' },
      { title: 'Test Case 3', input: 's = "aeiou"', output: '15' },
      { title: 'Test Case 4', input: 's = "a"', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static long countAllVowelSubstrings(String s) {
        long ans = 0, run = 0;
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c=='a'||c=='e'||c=='i'||c=='o'||c=='u') { run++; ans += run; }
            else run = 0;
        }
        return ans;
    }
}`,
    pythonSolution: `def countAllVowelSubstrings(s):
    ans = run = 0
    for c in s:
        if c in 'aeiou': run += 1; ans += run
        else: run = 0
    return ans`
  },
  {
    number: 22,
    title: 'Second Largest Distinct Number',
    fnName: 'secondLargestDistinct',
    description: 'Return the second largest distinct integer in <code>nums</code>, or <code>-1</code> if fewer than 2 distinct values exist.',
    constraints: ['1 <= nums.length <= 10^5', '0 <= nums[i] <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [12, 35, 1, 10, 34, 1]', output: '34' },
      { title: 'Test Case 2', input: 'nums = [10, 10, 10]', output: '-1' },
      { title: 'Test Case 3', input: 'nums = [5]', output: '-1' },
      { title: 'Test Case 4', input: 'nums = [1, 2]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int secondLargestDistinct(int[] nums) {
        int m1 = -1, m2 = -1;
        for (int x : nums) {
            if (x > m1) { m2 = m1; m1 = x; }
            else if (x < m1 && x > m2) m2 = x;
        }
        return m2;
    }
}`,
    pythonSolution: `def secondLargestDistinct(nums):
    s = sorted(set(nums))
    return s[-2] if len(s) >= 2 else -1`
  },
  {
    number: 23,
    title: 'Leader Elements in Array',
    fnName: 'countArrayLeaders',
    description: 'An element is a leader if it is strictly greater than all elements to its right (the last element is always a leader). Count total leaders in <code>nums</code>.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [16, 17, 4, 3, 5, 2]', output: '3' },
      { title: 'Test Case 2', input: 'nums = [1, 2, 3, 4]', output: '1' },
      { title: 'Test Case 3', input: 'nums = [4, 3, 2, 1]', output: '4' },
      { title: 'Test Case 4', input: 'nums = [5, 5]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countArrayLeaders(int[] nums) {
        int mx = Integer.MIN_VALUE, cnt = 0;
        for (int i = nums.length - 1; i >= 0; i--) {
            if (nums[i] > mx) { cnt++; mx = nums[i]; }
        }
        return cnt;
    }
}`,
    pythonSolution: `def countArrayLeaders(nums):
    mx = float('-inf'); cnt = 0
    for x in reversed(nums):
        if x > mx: cnt += 1; mx = x
    return cnt`
  },
  {
    number: 24,
    title: 'Word Pattern Isomorphic Check',
    fnName: 'matchesCharPattern',
    description: 'Given pattern <code>pat</code> and space-separated words string <code>s</code>, return <code>true</code> if there is a bijection between letters in <code>pat</code> and words in <code>s</code>, else <code>false</code>.',
    constraints: ['1 <= pat.length <= 1000'],
    testCases: [
      { title: 'Test Case 1', input: 'pat = "abba", s = "dog cat cat dog"', output: 'true' },
      { title: 'Test Case 2', input: 'pat = "abba", s = "dog cat cat fish"', output: 'false' },
      { title: 'Test Case 3', input: 'pat = "ab", s = "dog dog"', output: 'false' },
      { title: 'Test Case 4', input: 'pat = "a", s = "hello"', output: 'true' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static boolean matchesCharPattern(String pat, String s) {
        String[] w = s.split(" ");
        if (pat.length() != w.length) return false;
        Map<Character, String> c2w = new HashMap<>();
        Map<String, Character> w2c = new HashMap<>();
        for (int i = 0; i < pat.length(); i++) {
            char c = pat.charAt(i);
            if (c2w.containsKey(c) && !c2w.get(c).equals(w[i])) return false;
            if (w2c.containsKey(w[i]) && w2c.get(w[i]) != c) return false;
            c2w.put(c, w[i]); w2c.put(w[i], c);
        }
        return true;
    }
}`,
    pythonSolution: `def matchesCharPattern(pat, s):
    w = s.split()
    if len(pat) != len(w): return False
    return len(set(zip(pat, w))) == len(set(pat)) == len(set(w))`
  },
  {
    number: 25,
    title: 'Matrix 180-Degree Rotation Check',
    fnName: 'is180RotatedMatch',
    description: 'Given two <code>R x C</code> matrices <code>a</code> and <code>b</code>, return <code>true</code> if rotating <code>a</code> by 180 degrees equals <code>b</code>, else <code>false</code>.',
    constraints: ['1 <= R, C <= 200'],
    testCases: [
      { title: 'Test Case 1', input: 'a = [[1, 2], [3, 4]], b = [[4, 3], [2, 1]]', output: 'true' },
      { title: 'Test Case 2', input: 'a = [[1, 2], [3, 4]], b = [[1, 2], [3, 4]]', output: 'false' },
      { title: 'Test Case 3', input: 'a = [[5]], b = [[5]]', output: 'true' },
      { title: 'Test Case 4', input: 'a = [[1, 0, 1]], b = [[1, 0, 1]]', output: 'true' }
    ],
    javaSolution: `public class Solution {
    public static boolean is180RotatedMatch(int[][] a, int[][] b) {
        int R = a.length, C = a[0].length;
        for (int r = 0; r < R; r++) for (int c = 0; c < C; c++)
            if (a[r][c] != b[R - 1 - r][C - 1 - c]) return false;
        return true;
    }
}`,
    pythonSolution: `def is180RotatedMatch(a, b):
    R, C = len(a), len(a[0])
    return all(a[r][c] == b[R-1-r][C-1-c] for r in range(R) for c in range(C))`
  },
  {
    number: 26,
    title: 'Bitonic Point Peak Index',
    fnName: 'findBitonicPeak',
    description: 'Given a strictly bitonic array <code>nums</code> (strictly increases then strictly decreases, <code>n >= 3</code>), return the peak element value.',
    constraints: ['3 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 4, 8, 12, 7, 3]', output: '12' },
      { title: 'Test Case 2', input: 'nums = [2, 10, 1]', output: '10' },
      { title: 'Test Case 3', input: 'nums = [1, 2, 3, 2]', output: '3' },
      { title: 'Test Case 4', input: 'nums = [5, 100, 90, 80]', output: '100' }
    ],
    javaSolution: `public class Solution {
    public static int findBitonicPeak(int[] nums) {
        int l = 0, r = nums.length - 1;
        while (l < r) {
            int m = (l + r) / 2;
            if (nums[m] < nums[m + 1]) l = m + 1; else r = m;
        }
        return nums[l];
    }
}`,
    pythonSolution: `def findBitonicPeak(nums):
    l, r = 0, len(nums) - 1
    while l < r:
        m = (l + r) // 2
        if nums[m] < nums[m + 1]: l = m + 1
        else: r = m
    return nums[l]`
  },
  {
    number: 27,
    title: 'Count Pairs With Difference K',
    fnName: 'countDiffKPairs',
    description: 'Given distinct integers <code>nums</code> and <code>k > 0</code>, count pairs <code>(i, j)</code> with <code>i < j</code> and <code>|nums[i] - nums[j]| == k</code>.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 5, 3, 4, 2], k = 2', output: '3' },
      { title: 'Test Case 2', input: 'nums = [1, 2, 3], k = 5', output: '0' },
      { title: 'Test Case 3', input: 'nums = [10, 20], k = 10', output: '1' },
      { title: 'Test Case 4', input: 'nums = [7], k = 1', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countDiffKPairs(int[] nums, int k) {
        Set<Integer> s = new HashSet<>();
        for (int x : nums) s.add(x);
        int cnt = 0;
        for (int x : nums) if (s.contains(x + k)) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countDiffKPairs(nums, k):
    s = set(nums)
    return sum(1 for x in nums if x + k in s)`
  },
  {
    number: 28,
    title: 'Minimum Deletions for Unique Counts',
    fnName: 'minDeletionsUniqueFreq',
    description: 'Given lowercase string <code>s</code>, return minimum character deletions so no two distinct characters have the same frequency.',
    constraints: ['1 <= s.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 's = "aaabbbcc"', output: '2' },
      { title: 'Test Case 2', input: 's = "aab"', output: '0' },
      { title: 'Test Case 3', input: 's = "ceabaacb"', output: '2' },
      { title: 'Test Case 4', input: 's = "a"', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minDeletionsUniqueFreq(String s) {
        int[] freq = new int[26];
        for (int i = 0; i < s.length(); i++) freq[s.charAt(i) - 'a']++;
        Set<Integer> used = new HashSet<>();
        int del = 0;
        for (int f : freq) {
            while (f > 0 && !used.add(f)) { f--; del++; }
        }
        return del;
    }
}`,
    pythonSolution: `from collections import Counter
def minDeletionsUniqueFreq(s):
    used = set(); dels = 0
    for f in Counter(s).values():
        while f > 0 and f in used: f -= 1; dels += 1
        if f > 0: used.add(f)
    return dels`
  },
  {
    number: 29,
    title: 'Sum of Digits Until Single Digit',
    fnName: 'digitalRoot',
    description: 'Given non-negative integer <code>n</code>, return its digital root (repeated digit sum until a single digit remains).',
    constraints: ['0 <= n <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 38', output: '2' },
      { title: 'Test Case 2', input: 'n = 0', output: '0' },
      { title: 'Test Case 3', input: 'n = 9', output: '9' },
      { title: 'Test Case 4', input: 'n = 12345', output: '6' }
    ],
    javaSolution: `public class Solution {
    public static int digitalRoot(int n) {
        return n == 0 ? 0 : 1 + (n - 1) % 9;
    }
}`,
    pythonSolution: `def digitalRoot(n):
    return 0 if n == 0 else 1 + (n - 1) % 9`
  },
  {
    number: 30,
    title: 'Pascal Triangle K-th Element',
    fnName: 'pascalValue',
    description: 'Return the element at 0-indexed row <code>r</code> and column <code>c</code> in Pascal\'s Triangle.',
    constraints: ['0 <= c <= r <= 30'],
    testCases: [
      { title: 'Test Case 1', input: 'r = 4, c = 2', output: '6' },
      { title: 'Test Case 2', input: 'r = 0, c = 0', output: '1' },
      { title: 'Test Case 3', input: 'r = 5, c = 0', output: '1' },
      { title: 'Test Case 4', input: 'r = 6, c = 3', output: '20' }
    ],
    javaSolution: `public class Solution {
    public static long pascalValue(int r, int c) {
        long res = 1;
        for (int i = 0; i < c; i++) res = res * (r - i) / (i + 1);
        return res;
    }
}`,
    pythonSolution: `import math
def pascalValue(r, c):
    return math.comb(r, c)`
  },
  {
    number: 31,
    title: 'Grid Island Perimeter Count',
    fnName: 'gridPerimeter',
    description: 'Given a binary grid <code>grid</code> (<code>1</code> = land, <code>0</code> = water), return total perimeter of all land cells.',
    constraints: ['1 <= grid.length, grid[0].length <= 200'],
    testCases: [
      { title: 'Test Case 1', input: 'grid = [[0, 1, 0], [1, 1, 1], [0, 1, 0]]', output: '12' },
      { title: 'Test Case 2', input: 'grid = [[1]]', output: '4' },
      { title: 'Test Case 3', input: 'grid = [[1, 1]]', output: '6' },
      { title: 'Test Case 4', input: 'grid = [[0, 0]]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int gridPerimeter(int[][] grid) {
        int R = grid.length, C = grid[0].length, per = 0;
        for (int r = 0; r < R; r++) for (int c = 0; c < C; c++) if (grid[r][c] == 1) {
            per += 4;
            if (r > 0 && grid[r-1][c] == 1) per -= 2;
            if (c > 0 && grid[r][c-1] == 1) per -= 2;
        }
        return per;
    }
}`,
    pythonSolution: `def gridPerimeter(grid):
    R, C = len(grid), len(grid[0]); p = 0
    for r in range(R):
        for c in range(C):
            if grid[r][c] == 1:
                p += 4
                if r > 0 and grid[r-1][c] == 1: p -= 2
                if c > 0 and grid[r][c-1] == 1: p -= 2
    return p`
  },
  {
    number: 32,
    title: 'Word Frequency Exact Match',
    fnName: 'countTargetWord',
    description: 'Given a space-separated sentence <code>s</code> and word <code>target</code>, count exact case-sensitive token occurrences of <code>target</code>.',
    constraints: ['1 <= s.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 's = "zoho is great and zoho hires", target = "zoho"', output: '2' },
      { title: 'Test Case 2', input: 's = "hello world", target = "hi"', output: '0' },
      { title: 'Test Case 3', input: 's = "a a a", target = "a"', output: '3' },
      { title: 'Test Case 4', input: 's = "Zoho zoho", target = "zoho"', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countTargetWord(String s, String target) {
        int cnt = 0;
        for (String w : s.split("\\\\s+")) if (w.equals(target)) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countTargetWord(s, target):
    return s.split().count(target)`
  },
  {
    number: 33,
    title: 'Minimum Swaps to Sort Binary Array',
    fnName: 'minSwapsZeroesLeft',
    description: 'Given a binary array <code>bits</code>, you may swap adjacent elements. Return minimum adjacent swaps to move all <code>0</code>s to the left and <code>1</code>s to the right.',
    constraints: ['1 <= bits.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'bits = [1, 0, 1, 0]', output: '3' },
      { title: 'Test Case 2', input: 'bits = [0, 0, 1, 1]', output: '0' },
      { title: 'Test Case 3', input: 'bits = [1, 1, 0]', output: '2' },
      { title: 'Test Case 4', input: 'bits = [0]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long minSwapsZeroesLeft(int[] bits) {
        long ones = 0, swaps = 0;
        for (int b : bits) {
            if (b == 1) ones++; else swaps += ones;
        }
        return swaps;
    }
}`,
    pythonSolution: `def minSwapsZeroesLeft(bits):
    ones = swaps = 0
    for b in bits:
        if b == 1: ones += 1
        else: swaps += ones
    return swaps`
  },
  {
    number: 34,
    title: 'Check Armstrong Number',
    fnName: 'countArmstrongNumbers',
    description: 'A positive integer is Armstrong if the sum of its digits each raised to the power of total digits equals the number itself. Count Armstrong numbers in <code>nums</code>.',
    constraints: ['1 <= nums.length <= 10^4', '1 <= nums[i] <= 10^6'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [153, 370, 123, 9]', output: '3' },
      { title: 'Test Case 2', input: 'nums = [10, 20, 30]', output: '0' },
      { title: 'Test Case 3', input: 'nums = [371, 407]', output: '2' },
      { title: 'Test Case 4', input: 'nums = [1634]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countArmstrongNumbers(int[] nums) {
        int cnt = 0;
        for (int x : nums) {
            String s = String.valueOf(x); int p = s.length(), sum = 0;
            for (int i = 0; i < p; i++) sum += (int) Math.pow(s.charAt(i) - '0', p);
            if (sum == x) cnt++;
        }
        return cnt;
    }
}`,
    pythonSolution: `def countArmstrongNumbers(nums):
    cnt = 0
    for x in nums:
        s = str(x); p = len(s)
        if sum(int(d)**p for d in s) == x: cnt += 1
    return cnt`
  },
  {
    number: 35,
    title: 'Longest Increasing Subarray Length',
    fnName: 'longestStrictlyIncreasing',
    description: 'Return the length of the longest contiguous strictly increasing subarray in <code>nums</code>.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 3, 5, 4, 7]', output: '3' },
      { title: 'Test Case 2', input: 'nums = [2, 2, 2]', output: '1' },
      { title: 'Test Case 3', input: 'nums = [1, 2, 3, 4]', output: '4' },
      { title: 'Test Case 4', input: 'nums = [9]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int longestStrictlyIncreasing(int[] nums) {
        int cur = 1, best = 1;
        for (int i = 1; i < nums.length; i++) {
            cur = (nums[i] > nums[i - 1]) ? cur + 1 : 1;
            best = Math.max(best, cur);
        }
        return best;
    }
}`,
    pythonSolution: `def longestStrictlyIncreasing(nums):
    cur = best = 1
    for i in range(1, len(nums)):
        cur = cur + 1 if nums[i] > nums[i - 1] else 1
        best = max(best, cur)
    return best`
  },
  {
    number: 36,
    title: 'Zigzag String Row Character Count',
    fnName: 'zigzagFirstRowLength',
    description: 'A string <code>s</code> is written in a zigzag pattern across <code>numRows</code> rows (down then diagonally up). Return how many characters end up in row <code>0</code>.',
    constraints: ['1 <= s.length <= 10^5', '1 <= numRows <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 's = "PAYPALISHIRING", numRows = 3', output: '4' },
      { title: 'Test Case 2', input: 's = "HELLO", numRows = 1', output: '5' },
      { title: 'Test Case 3', input: 's = "ABCDEF", numRows = 4', output: '1' },
      { title: 'Test Case 4', input: 's = "ABC", numRows = 2', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int zigzagFirstRowLength(String s, int numRows) {
        if (numRows == 1) return s.length();
        int cycle = 2 * numRows - 2;
        return (s.length() + cycle - 1) / cycle;
    }
}`,
    pythonSolution: `def zigzagFirstRowLength(s, numRows):
    if numRows == 1: return len(s)
    cyc = 2 * numRows - 2
    return (len(s) + cyc - 1) // cyc`
  },
  {
    number: 37,
    title: 'Count Divisible Digits in Number',
    fnName: 'countDividingDigits',
    description: 'Given positive integer <code>n</code>, count how many of its decimal digits (ignoring 0) evenly divide <code>n</code>.',
    constraints: ['1 <= n <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 1248', output: '4' },
      { title: 'Test Case 2', input: 'n = 121', output: '2' },
      { title: 'Test Case 3', input: 'n = 105', output: '2' },
      { title: 'Test Case 4', input: 'n = 7', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countDividingDigits(int n) {
        int t = n, cnt = 0;
        while (t > 0) {
            int d = t % 10;
            if (d != 0 && n % d == 0) cnt++;
            t /= 10;
        }
        return cnt;
    }
}`,
    pythonSolution: `def countDividingDigits(n):
    return sum(1 for c in str(n) if c != '0' and n % int(c) == 0)`
  },
  {
    number: 38,
    title: 'Matrix Column-Wise Max Sum',
    fnName: 'maxColumnSum',
    description: 'Given an <code>R x C</code> matrix <code>mat</code>, return the maximum sum of any single column.',
    constraints: ['1 <= R, C <= 200'],
    testCases: [
      { title: 'Test Case 1', input: 'mat = [[1, 10, 3], [4, 2, 6], [7, 8, 9]]', output: '20' },
      { title: 'Test Case 2', input: 'mat = [[5]]', output: '5' },
      { title: 'Test Case 3', input: 'mat = [[-1, -5], [-2, -3]]', output: '-3' },
      { title: 'Test Case 4', input: 'mat = [[1, 2, 3]]', output: '3' }
    ],
    javaSolution: `public class Solution {
    public static long maxColumnSum(int[][] mat) {
        int R = mat.length, C = mat[0].length; long best = Long.MIN_VALUE;
        for (int c = 0; c < C; c++) {
            long s = 0; for (int r = 0; r < R; r++) s += mat[r][c];
            best = Math.max(best, s);
        }
        return best;
    }
}`,
    pythonSolution: `def maxColumnSum(mat):
    return max(sum(mat[r][c] for r in range(len(mat))) for c in range(len(mat[0])))`
  },
  {
    number: 39,
    title: 'Anagram Pair Check',
    fnName: 'areAnagrams',
    description: 'Return <code>true</code> if lowercase strings <code>s1</code> and <code>s2</code> are anagrams of each other, else <code>false</code>.',
    constraints: ['0 <= s1.length, s2.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 's1 = "listen", s2 = "silent"', output: 'true' },
      { title: 'Test Case 2', input: 's1 = "rat", s2 = "car"', output: 'false' },
      { title: 'Test Case 3', input: 's1 = "aabb", s2 = "abab"', output: 'true' },
      { title: 'Test Case 4', input: 's1 = "a", s2 = "ab"', output: 'false' }
    ],
    javaSolution: `public class Solution {
    public static boolean areAnagrams(String s1, String s2) {
        if (s1.length() != s2.length()) return false;
        int[] c = new int[26];
        for (int i = 0; i < s1.length(); i++) { c[s1.charAt(i)-'a']++; c[s2.charAt(i)-'a']--; }
        for (int x : c) if (x != 0) return false;
        return true;
    }
}`,
    pythonSolution: `from collections import Counter
def areAnagrams(s1, s2):
    return Counter(s1) == Counter(s2)`
  },
  {
    number: 40,
    title: 'Count Trailing Zeros in Factorial',
    fnName: 'factorialTrailingZeros',
    description: 'Given non-negative integer <code>n</code>, return the number of trailing zeros in <code>n!</code>.',
    constraints: ['0 <= n <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 25', output: '6' },
      { title: 'Test Case 2', input: 'n = 5', output: '1' },
      { title: 'Test Case 3', input: 'n = 0', output: '0' },
      { title: 'Test Case 4', input: 'n = 100', output: '24' }
    ],
    javaSolution: `public class Solution {
    public static long factorialTrailingZeros(long n) {
        long z = 0;
        while (n >= 5) { n /= 5; z += n; }
        return z;
    }
}`,
    pythonSolution: `def factorialTrailingZeros(n):
    z = 0
    while n >= 5: n //= 5; z += n
    return z`
  },
  {
    number: 41,
    title: 'Merge Two Sorted Arrays Distinct',
    fnName: 'countUnionSorted',
    description: 'Given two sorted arrays <code>a</code> and <code>b</code>, return the number of distinct elements in their union.',
    constraints: ['0 <= a.length, b.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'a = [1, 2, 2, 4], b = [2, 3, 4, 5]', output: '5' },
      { title: 'Test Case 2', input: 'a = [], b = [1, 1]', output: '1' },
      { title: 'Test Case 3', input: 'a = [1, 3], b = [2, 4]', output: '4' },
      { title: 'Test Case 4', input: 'a = [], b = []', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countUnionSorted(int[] a, int[] b) {
        Set<Integer> s = new HashSet<>();
        for (int x : a) s.add(x);
        for (int x : b) s.add(x);
        return s.size();
    }
}`,
    pythonSolution: `def countUnionSorted(a, b):
    return len(set(a) | set(b))`
  },
  {
    number: 42,
    title: 'Smallest Missing Non-Negative',
    fnName: 'smallestMissingNonNeg',
    description: 'Given an array of distinct non-negative integers <code>nums</code>, return the smallest non-negative integer NOT in <code>nums</code>.',
    constraints: ['0 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [3, 0, 1]', output: '2' },
      { title: 'Test Case 2', input: 'nums = [0, 1, 2]', output: '3' },
      { title: 'Test Case 3', input: 'nums = [1, 2, 3]', output: '0' },
      { title: 'Test Case 4', input: 'nums = []', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int smallestMissingNonNeg(int[] nums) {
        Set<Integer> s = new HashSet<>();
        for (int x : nums) s.add(x);
        int i = 0;
        while (s.contains(i)) i++;
        return i;
    }
}`,
    pythonSolution: `def smallestMissingNonNeg(nums):
    s = set(nums); i = 0
    while i in s: i += 1
    return i`
  },
  {
    number: 43,
    title: 'Subarray Maximum Average K',
    fnName: 'maxSumOfLengthK',
    description: 'Given integer array <code>nums</code> and integer <code>k</code>, return the maximum sum of any contiguous subarray of length <code>k</code>.',
    constraints: ['1 <= k <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 12, -5, -6, 50, 3], k = 4', output: '51' },
      { title: 'Test Case 2', input: 'nums = [5], k = 1', output: '5' },
      { title: 'Test Case 3', input: 'nums = [-1, -2, -3], k = 2', output: '-3' },
      { title: 'Test Case 4', input: 'nums = [4, 4, 4], k = 3', output: '12' }
    ],
    javaSolution: `public class Solution {
    public static long maxSumOfLengthK(int[] nums, int k) {
        long cur = 0;
        for (int i = 0; i < k; i++) cur += nums[i];
        long best = cur;
        for (int i = k; i < nums.length; i++) { cur += nums[i] - nums[i - k]; best = Math.max(best, cur); }
        return best;
    }
}`,
    pythonSolution: `def maxSumOfLengthK(nums, k):
    cur = sum(nums[:k]); best = cur
    for i in range(k, len(nums)):
        cur += nums[i] - nums[i - k]; best = max(best, cur)
    return best`
  },
  {
    number: 44,
    title: 'Spiral Layer Count in Matrix',
    fnName: 'countSpiralRings',
    description: 'An <code>R x C</code> matrix is peeled layer by layer from outside to inside. Return the total number of rectangular rings (<code>ceil(min(R, C) / 2)</code>).',
    constraints: ['1 <= R, C <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'R = 4, C = 5', output: '2' },
      { title: 'Test Case 2', input: 'R = 3, C = 3', output: '2' },
      { title: 'Test Case 3', input: 'R = 1, C = 10', output: '1' },
      { title: 'Test Case 4', input: 'R = 6, C = 6', output: '3' }
    ],
    javaSolution: `public class Solution {
    public static int countSpiralRings(int R, int C) {
        return (Math.min(R, C) + 1) / 2;
    }
}`,
    pythonSolution: `def countSpiralRings(R, C):
    return (min(R, C) + 1) // 2`
  },
  {
    number: 45,
    title: 'Binary String Flip To Alternate',
    fnName: 'minFlipsToAlternate',
    description: 'Given binary string <code>s</code>, return the minimum number of bit flips needed to make <code>s</code> strictly alternating (either <code>"0101..."</code> or <code>"1010..."</code>).',
    constraints: ['1 <= s.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 's = "0100"', output: '1' },
      { title: 'Test Case 2', input: 's = "10"', output: '0' },
      { title: 'Test Case 3', input: 's = "1111"', output: '2' },
      { title: 'Test Case 4', input: 's = "0"', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int minFlipsToAlternate(String s) {
        int f0 = 0;
        for (int i = 0; i < s.length(); i++) {
            char exp = (i % 2 == 0) ? '0' : '1';
            if (s.charAt(i) != exp) f0++;
        }
        return Math.min(f0, s.length() - f0);
    }
}`,
    pythonSolution: `def minFlipsToAlternate(s):
    f0 = sum(1 for i, c in enumerate(s) if c != ('0' if i % 2 == 0 else '1'))
    return min(f0, len(s) - f0)`
  },
  {
    number: 46,
    title: 'Count Odd-Length Subarrays',
    fnName: 'countOddLengthSubarrays',
    description: 'Given array length <code>n</code>, return the total number of contiguous subarrays of odd length.',
    constraints: ['1 <= n <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 3', output: '4' },
      { title: 'Test Case 2', input: 'n = 1', output: '1' },
      { title: 'Test Case 3', input: 'n = 4', output: '6' },
      { title: 'Test Case 4', input: 'n = 5', output: '9' }
    ],
    javaSolution: `public class Solution {
    public static long countOddLengthSubarrays(long n) {
        long odd = (n + 1) / 2, even = n / 2;
        return odd * odd + even * even;
    }
}`,
    pythonSolution: `def countOddLengthSubarrays(n):
    return sum(n - L + 1 for L in range(1, n + 1, 2))`
  },
  {
    number: 47,
    title: 'Matrix Toeplitz Diagonal Check',
    fnName: 'isToeplitzMatrix',
    description: 'Return <code>true</code> if every diagonal from top-left to bottom-right in <code>mat</code> has the same elements, else <code>false</code>.',
    constraints: ['1 <= mat.length, mat[0].length <= 200'],
    testCases: [
      { title: 'Test Case 1', input: 'mat = [[1, 2, 3, 4], [5, 1, 2, 3], [9, 5, 1, 2]]', output: 'true' },
      { title: 'Test Case 2', input: 'mat = [[1, 2], [2, 2]]', output: 'false' },
      { title: 'Test Case 3', input: 'mat = [[7]]', output: 'true' },
      { title: 'Test Case 4', input: 'mat = [[1, 2], [3, 1]]', output: 'true' }
    ],
    javaSolution: `public class Solution {
    public static boolean isToeplitzMatrix(int[][] mat) {
        for (int r = 1; r < mat.length; r++)
            for (int c = 1; c < mat[0].length; c++)
                if (mat[r][c] != mat[r - 1][c - 1]) return false;
        return true;
    }
}`,
    pythonSolution: `def isToeplitzMatrix(mat):
    return all(mat[r][c] == mat[r-1][c-1] for r in range(1, len(mat)) for c in range(1, len(mat[0])))`
  },
  {
    number: 48,
    title: 'First Unique Character Index',
    fnName: 'firstUniqueCharIdx',
    description: 'Given lowercase string <code>s</code>, return the 0-based index of the first non-repeating character, or <code>-1</code> if none exists.',
    constraints: ['1 <= s.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 's = "zoho"', output: '0' },
      { title: 'Test Case 2', input: 's = "lovezoho"', output: '0' },
      { title: 'Test Case 3', input: 's = "aabb"', output: '-1' },
      { title: 'Test Case 4', input: 's = "x"', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int firstUniqueCharIdx(String s) {
        int[] freq = new int[26];
        for (int i = 0; i < s.length(); i++) freq[s.charAt(i) - 'a']++;
        for (int i = 0; i < s.length(); i++) if (freq[s.charAt(i) - 'a'] == 1) return i;
        return -1;
    }
}`,
    pythonSolution: `from collections import Counter
def firstUniqueCharIdx(s):
    c = Counter(s)
    for i, ch in enumerate(s):
        if c[ch] == 1: return i
    return -1`
  },
  {
    number: 49,
    title: 'Minimum Steps to Reduce Zero',
    fnName: 'stepsToZero',
    description: 'Given non-negative integer <code>n</code>, if even divide by 2, else subtract 1. Return steps to reach <code>0</code>.',
    constraints: ['0 <= n <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 14', output: '6' },
      { title: 'Test Case 2', input: 'n = 8', output: '4' },
      { title: 'Test Case 3', input: 'n = 0', output: '0' },
      { title: 'Test Case 4', input: 'n = 1', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int stepsToZero(int n) {
        int s = 0;
        while (n > 0) { n = (n % 2 == 0) ? n / 2 : n - 1; s++; }
        return s;
    }
}`,
    pythonSolution: `def stepsToZero(n):
    s = 0
    while n > 0: n = n // 2 if n % 2 == 0 else n - 1; s += 1
    return s`
  },
  {
    number: 50,
    title: 'String Rotation Equality Check',
    fnName: 'isCyclicRotation',
    description: 'Return <code>true</code> if string <code>s2</code> can be obtained by rotating string <code>s1</code>, else <code>false</code>.',
    constraints: ['1 <= s1.length, s2.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 's1 = "abcde", s2 = "cdeab"', output: 'true' },
      { title: 'Test Case 2', input: 's1 = "abcde", s2 = "abced"', output: 'false' },
      { title: 'Test Case 3', input: 's1 = "a", s2 = "a"', output: 'true' },
      { title: 'Test Case 4', input: 's1 = "ab", s2 = "aba"', output: 'false' }
    ],
    javaSolution: `public class Solution {
    public static boolean isCyclicRotation(String s1, String s2) {
        return s1.length() == s2.length() && (s1 + s1).contains(s2);
    }
}`,
    pythonSolution: `def isCyclicRotation(s1, s2):
    return len(s1) == len(s2) and s2 in (s1 + s1)`
  }
];
