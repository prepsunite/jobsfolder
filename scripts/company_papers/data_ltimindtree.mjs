export const LTIMINDTREE_QUESTIONS = [
  {
    number: 1,
    title: 'Telemetry Stream Moving Average',
    fnName: 'movingAverageFloor',
    description: 'An LTIMindtree IoT telemetry gateway computes the integer-floor moving average of every contiguous window of size <code>k</code> in <code>readings</code>. Return the resulting array.',
    constraints: ['1 <= k <= readings.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'readings = [10, 20, 30, 40, 50], k = 3', output: '[20, 30, 40]' },
      { title: 'Test Case 2', input: 'readings = [5, 7, 9], k = 2', output: '[6, 8]' },
      { title: 'Test Case 3', input: 'readings = [100], k = 1', output: '[100]' },
      { title: 'Test Case 4', input: 'readings = [1, 2, 3, 4], k = 4', output: '[2]' }
    ],
    javaSolution: `public class Solution {
    public static int[] movingAverageFloor(int[] readings, int k) {
        int n = readings.length;
        int[] res = new int[n - k + 1];
        long sum = 0;
        for (int i = 0; i < n; i++) {
            sum += readings[i];
            if (i >= k) sum -= readings[i - k];
            if (i >= k - 1) res[i - k + 1] = (int) (sum / k);
        }
        return res;
    }
}`,
    pythonSolution: `def movingAverageFloor(readings, k):
    s, res = 0, []
    for i, x in enumerate(readings):
        s += x
        if i >= k: s -= readings[i - k]
        if i >= k - 1: res.append(s // k)
    return res`
  },
  {
    number: 2,
    title: 'Inventory Reorder Threshold Alert',
    fnName: 'daysUntilStockout',
    description: 'Given daily sales <code>sales</code> starting from inventory <code>stock</code>, return the 1-indexed day on which remaining stock drops strictly below <code>threshold</code>. Return <code>-1</code> if it never drops below.',
    constraints: ['1 <= sales.length <= 10^5', '0 <= stock, threshold <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'sales = [10, 15, 20, 10], stock = 50, threshold = 10', output: '3' },
      { title: 'Test Case 2', input: 'sales = [5, 5, 5], stock = 100, threshold = 10', output: '-1' },
      { title: 'Test Case 3', input: 'sales = [30, 10], stock = 30, threshold = 5', output: '1' },
      { title: 'Test Case 4', input: 'sales = [1, 2, 3], stock = 10, threshold = 5', output: '3' }
    ],
    javaSolution: `public class Solution {
    public static int daysUntilStockout(int[] sales, int stock, int threshold) {
        long rem = stock;
        for (int i = 0; i < sales.length; i++) {
            rem -= sales[i];
            if (rem < threshold) return i + 1;
        }
        return -1;
    }
}`,
    pythonSolution: `def daysUntilStockout(sales, stock, threshold):
    rem = stock
    for i, s in enumerate(sales):
        rem -= s
        if rem < threshold:
            return i + 1
    return -1`
  },
  {
    number: 3,
    title: 'String Rotation Check',
    fnName: 'isRotatedMatch',
    description: 'Given two strings <code>s</code> and <code>goal</code>, return <code>true</code> if and only if <code>s</code> can become <code>goal</code> after some number of shifts.',
    constraints: ['1 <= s.length, goal.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 's = "abcde", goal = "cdeab"', output: 'true' },
      { title: 'Test Case 2', input: 's = "abcde", goal = "abced"', output: 'false' },
      { title: 'Test Case 3', input: 's = "aa", goal = "a"', output: 'false' },
      { title: 'Test Case 4', input: 's = "lti", goal = "lti"', output: 'true' }
    ],
    javaSolution: `public class Solution {
    public static boolean isRotatedMatch(String s, String goal) {
        return s.length() == goal.length() && (s + s).contains(goal);
    }
}`,
    pythonSolution: `def isRotatedMatch(s, goal):
    return len(s) == len(goal) and goal in (s + s)`
  },
  {
    number: 4,
    title: 'Matrix Boundary Sum',
    fnName: 'boundarySum',
    description: 'Given an <code>R x C</code> matrix <code>mat</code>, return the sum of all elements on its outer boundary (first row, last row, first column, last column, without double-counting corners).',
    constraints: ['1 <= R, C <= 200'],
    testCases: [
      { title: 'Test Case 1', input: 'mat = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]', output: '40' },
      { title: 'Test Case 2', input: 'mat = [[1, 2], [3, 4]]', output: '10' },
      { title: 'Test Case 3', input: 'mat = [[5, 6, 7]]', output: '18' },
      { title: 'Test Case 4', input: 'mat = [[10]]', output: '10' }
    ],
    javaSolution: `public class Solution {
    public static int boundarySum(int[][] mat) {
        int r = mat.length, c = mat[0].length, sum = 0;
        for (int i = 0; i < r; i++)
            for (int j = 0; j < c; j++)
                if (i == 0 || i == r - 1 || j == 0 || j == c - 1) sum += mat[i][j];
        return sum;
    }
}`,
    pythonSolution: `def boundarySum(mat):
    r, c = len(mat), len(mat[0])
    return sum(mat[i][j] for i in range(r) for j in range(c) if i in (0, r-1) or j in (0, c-1))`
  },
  {
    number: 5,
    title: 'Next Greater Element in Circular Array',
    fnName: 'nextGreaterCircular',
    description: 'Given a circular integer array <code>nums</code>, return the next strictly greater element for every element (wrapping around if needed, or <code>-1</code> if none exists).',
    constraints: ['1 <= nums.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 2, 1]', output: '[2, -1, 2]' },
      { title: 'Test Case 2', input: 'nums = [1, 2, 3, 4, 3]', output: '[2, 3, 4, -1, 4]' },
      { title: 'Test Case 3', input: 'nums = [5, 5, 5]', output: '[-1, -1, -1]' },
      { title: 'Test Case 4', input: 'nums = [9]', output: '[-1]' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int[] nextGreaterCircular(int[] nums) {
        int n = nums.length;
        int[] res = new int[n];
        Arrays.fill(res, -1);
        Deque<Integer> st = new ArrayDeque<>();
        for (int i = 0; i < 2 * n; i++) {
            int x = nums[i % n];
            while (!st.isEmpty() && nums[st.peek()] < x) res[st.pop()] = x;
            if (i < n) st.push(i);
        }
        return res;
    }
}`,
    pythonSolution: `def nextGreaterCircular(nums):
    n = len(nums)
    res, st = [-1] * n, []
    for i in range(2 * n):
        x = nums[i % n]
        while st and nums[st[-1]] < x:
            res[st.pop()] = x
        if i < n:
            st.append(i)
    return res`
  },
  {
    number: 6,
    title: 'Remove K Digits for Minimum Number',
    fnName: 'minNumberAfterRemovingK',
    description: 'Given a non-negative integer string <code>num</code> and integer <code>k</code>, remove <code>k</code> digits so the resulting number is as small as possible (without leading zeros; return <code>"0"</code> if empty).',
    constraints: ['1 <= k <= num.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'num = "1432219", k = 3', output: '1219' },
      { title: 'Test Case 2', input: 'num = "10200", k = 1', output: '200' },
      { title: 'Test Case 3', input: 'num = "10", k = 2', output: '0' },
      { title: 'Test Case 4', input: 'num = "112", k = 1', output: '11' }
    ],
    javaSolution: `public class Solution {
    public static String minNumberAfterRemovingK(String num, int k) {
        StringBuilder sb = new StringBuilder();
        for (char c : num.toCharArray()) {
            while (k > 0 && sb.length() > 0 && sb.charAt(sb.length() - 1) > c) {
                sb.deleteCharAt(sb.length() - 1); k--;
            }
            sb.append(c);
        }
        while (k > 0 && sb.length() > 0) { sb.deleteCharAt(sb.length() - 1); k--; }
        int idx = 0;
        while (idx < sb.length() && sb.charAt(idx) == '0') idx++;
        String ans = sb.substring(idx);
        return ans.isEmpty() ? "0" : ans;
    }
}`,
    pythonSolution: `def minNumberAfterRemovingK(num, k):
    st = []
    for c in num:
        while k > 0 and st and st[-1] > c:
            st.pop(); k -= 1
        st.append(c)
    if k > 0:
        st = st[:-k]
    return ''.join(st).lstrip('0') or '0'`
  },
  {
    number: 7,
    title: 'Longest Subarray of 1s After Deleting One Element',
    fnName: 'longestOnesWithOneDeletion',
    description: 'Given a binary array <code>nums</code>, you must delete exactly one element from it. Return the length of the longest non-empty subarray containing only <code>1</code>s in the resulting array.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 1, 0, 1]', output: '3' },
      { title: 'Test Case 2', input: 'nums = [0, 1, 1, 1, 0, 1, 1, 0, 1]', output: '5' },
      { title: 'Test Case 3', input: 'nums = [1, 1, 1]', output: '2' },
      { title: 'Test Case 4', input: 'nums = [0, 0, 0]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int longestOnesWithOneDeletion(int[] nums) {
        int left = 0, zeros = 0, best = 0;
        for (int right = 0; right < nums.length; right++) {
            if (nums[right] == 0) zeros++;
            while (zeros > 1) if (nums[left++] == 0) zeros--;
            best = Math.max(best, right - left);
        }
        return best;
    }
}`,
    pythonSolution: `def longestOnesWithOneDeletion(nums):
    left = zeros = best = 0
    for right, x in enumerate(nums):
        if x == 0: zeros += 1
        while zeros > 1:
            if nums[left] == 0: zeros -= 1
            left += 1
        best = max(best, right - left)
    return best`
  },
  {
    number: 8,
    title: 'Count Ways to Tile 2xN Corridor',
    fnName: 'countTilingWays',
    description: 'Count the number of ways to tile a <code>2 x n</code> corridor using <code>2 x 1</code> dominoes (modulo <code>10^9 + 7</code>).',
    constraints: ['1 <= n <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 1', output: '1' },
      { title: 'Test Case 2', input: 'n = 2', output: '2' },
      { title: 'Test Case 3', input: 'n = 5', output: '8' },
      { title: 'Test Case 4', input: 'n = 10', output: '89' }
    ],
    javaSolution: `public class Solution {
    public static int countTilingWays(int n) {
        int MOD = 1_000_000_007;
        if (n <= 2) return n;
        int a = 1, b = 2;
        for (int i = 3; i <= n; i++) {
            int c = (a + b) % MOD;
            a = b; b = c;
        }
        return b;
    }
}`,
    pythonSolution: `def countTilingWays(n):
    MOD = 10**9 + 7
    if n <= 2: return n
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, (a + b) % MOD
    return b`
  },
  {
    number: 9,
    title: 'Find All Duplicates in O(N) Time',
    fnName: 'findDuplicateIds',
    description: 'Given an array <code>nums</code> of length <code>n</code> where all integers are in <code>[1, n]</code> and each appears once or twice, return a sorted list of all elements that appear twice.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [4, 3, 2, 7, 8, 2, 3, 1]', output: '[2, 3]' },
      { title: 'Test Case 2', input: 'nums = [1, 1, 2]', output: '[1]' },
      { title: 'Test Case 3', input: 'nums = [1]', output: '[]' },
      { title: 'Test Case 4', input: 'nums = [2, 2, 1, 1]', output: '[1, 2]' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static List<Integer> findDuplicateIds(int[] nums) {
        List<Integer> res = new ArrayList<>();
        for (int i = 0; i < nums.length; i++) {
            int idx = Math.abs(nums[i]) - 1;
            if (nums[idx] < 0) res.add(idx + 1);
            else nums[idx] = -nums[idx];
        }
        Collections.sort(res);
        return res;
    }
}`,
    pythonSolution: `def findDuplicateIds(nums):
    a = nums[:]
    res = []
    for x in a:
        idx = abs(x) - 1
        if a[idx] < 0:
            res.append(idx + 1)
        else:
            a[idx] = -a[idx]
    return sorted(res)`
  },
  {
    number: 10,
    title: 'Minimum Speed to Reach Destination on Time',
    fnName: 'minTrainSpeed',
    description: 'You must take <code>n</code> trains in order with distances <code>dist</code> within <code>hour</code> hours. Each train (except the last) departs only on integer hours, so you wait until the next integer hour if you arrive early. Return the minimum integer speed (km/h) to arrive on time, or <code>-1</code> if impossible.',
    constraints: ['1 <= dist.length <= 10^5', '1 <= dist[i] <= 10^5', '1 <= hour <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'dist = [1, 3, 2], hour = 6.0', output: '1' },
      { title: 'Test Case 2', input: 'dist = [1, 3, 2], hour = 2.7', output: '3' },
      { title: 'Test Case 3', input: 'dist = [1, 3, 2], hour = 1.9', output: '-1' },
      { title: 'Test Case 4', input: 'dist = [10], hour = 2.0', output: '5' }
    ],
    javaSolution: `public class Solution {
    public static int minTrainSpeed(int[] dist, double hour) {
        int n = dist.length;
        if (hour <= n - 1) return -1;
        int lo = 1, hi = 10_000_000;
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            double t = 0;
            for (int i = 0; i < n - 1; i++) t += Math.ceil((double) dist[i] / mid);
            t += (double) dist[n - 1] / mid;
            if (t <= hour) hi = mid; else lo = mid + 1;
        }
        return lo;
    }
}`,
    pythonSolution: `def minTrainSpeed(dist, hour):
    import math
    n = len(dist)
    if hour <= n - 1:
        return -1
    lo, hi = 1, 10**7
    while lo < hi:
        mid = (lo + hi) // 2
        t = sum(math.ceil(d / mid) for d in dist[:-1]) + dist[-1] / mid
        if t <= hour:
            hi = mid
        else:
            lo = mid + 1
    return lo`
  },
  {
    number: 11,
    title: 'Sort Characters by Descending Frequency',
    fnName: 'sortByCharFreq',
    description: 'Given a string <code>s</code>, sort its characters in descending order of frequency (break ties by ascending ASCII order).',
    constraints: ['1 <= s.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 's = "tree"', output: 'eert' },
      { title: 'Test Case 2', input: 's = "cccaaa"', output: 'aaaccc' },
      { title: 'Test Case 3', input: 's = "Aabb"', output: 'bbAa' },
      { title: 'Test Case 4', input: 's = "z"', output: 'z' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static String sortByCharFreq(String s) {
        int[] cnt = new int[128];
        for (char c : s.toCharArray()) cnt[c]++;
        List<Character> chars = new ArrayList<>();
        for (int i = 0; i < 128; i++) if (cnt[i] > 0) chars.add((char) i);
        chars.sort((a, b) -> cnt[b] != cnt[a] ? Integer.compare(cnt[b], cnt[a]) : Character.compare(a, b));
        StringBuilder sb = new StringBuilder();
        for (char c : chars) sb.append(String.valueOf(c).repeat(cnt[c]));
        return sb.toString();
    }
}`,
    pythonSolution: `def sortByCharFreq(s):
    from collections import Counter
    cnt = Counter(s)
    return ''.join(c * cnt[c] for c in sorted(cnt.keys(), key=lambda x: (-cnt[x], x)))`
  },
  {
    number: 12,
    title: 'Contiguous Subarray Sum Multiple of K',
    fnName: 'hasMultipleSubarray',
    description: 'Given non-negative integer array <code>nums</code> and integer <code>k &gt; 0</code>, return <code>true</code> if <code>nums</code> has a contiguous subarray of length at least 2 whose sum is a multiple of <code>k</code>.',
    constraints: ['1 <= nums.length <= 10^5', '1 <= k <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [23, 2, 4, 6, 7], k = 6', output: 'true' },
      { title: 'Test Case 2', input: 'nums = [23, 2, 6, 4, 7], k = 13', output: 'false' },
      { title: 'Test Case 3', input: 'nums = [0, 0], k = 5', output: 'true' },
      { title: 'Test Case 4', input: 'nums = [5], k = 5', output: 'false' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static boolean hasMultipleSubarray(int[] nums, int k) {
        Map<Integer, Integer> first = new HashMap<>();
        first.put(0, -1);
        int rem = 0;
        for (int i = 0; i < nums.length; i++) {
            rem = (rem + nums[i]) % k;
            if (first.containsKey(rem)) {
                if (i - first.get(rem) >= 2) return true;
            } else first.put(rem, i);
        }
        return false;
    }
}`,
    pythonSolution: `def hasMultipleSubarray(nums, k):
    first = {0: -1}
    rem = 0
    for i, x in enumerate(nums):
        rem = (rem + x) % k
        if rem in first:
            if i - first[rem] >= 2:
                return True
        else:
            first[rem] = i
    return False`
  },
  {
    number: 13,
    title: 'Minimum Time Difference Between Logs',
    fnName: 'minMinuteGap',
    description: 'Given a list of 24-hour clock timestamps <code>timePoints</code> formatted as <code>"HH:MM"</code>, return the minimum minutes difference between any two time points (accounting for midnight wrap-around).',
    constraints: ['2 <= timePoints.length <= 2 * 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'timePoints = ["23:59", "00:00"]', output: '1' },
      { title: 'Test Case 2', input: 'timePoints = ["00:00", "23:59", "00:00"]', output: '0' },
      { title: 'Test Case 3', input: 'timePoints = ["01:01", "02:01"]', output: '60' },
      { title: 'Test Case 4', input: 'timePoints = ["05:31", "22:08", "00:35"]', output: '147' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minMinuteGap(String[] timePoints) {
        int n = timePoints.length;
        int[] mins = new int[n];
        for (int i = 0; i < n; i++) {
            String[] p = timePoints[i].split(":");
            mins[i] = Integer.parseInt(p[0]) * 60 + Integer.parseInt(p[1]);
        }
        Arrays.sort(mins);
        int best = 1440 + mins[0] - mins[n - 1];
        for (int i = 1; i < n; i++) best = Math.min(best, mins[i] - mins[i - 1]);
        return best;
    }
}`,
    pythonSolution: `def minMinuteGap(timePoints):
    mins = sorted(int(t[:2]) * 60 + int(t[3:]) for t in timePoints)
    best = 1440 + mins[0] - mins[-1]
    for i in range(1, len(mins)):
        best = min(best, mins[i] - mins[i - 1])
    return best`
  },
  {
    number: 14,
    title: 'Car Fleet Arrival Groups',
    fnName: 'countArrivalFleets',
    description: 'Cars at positions <code>pos</code> moving at speeds <code>speed</code> toward <code>target</code> cannot pass each other; faster cars catch up and form a fleet moving at the slower car\'s speed. Return the number of distinct fleets arriving at <code>target</code>.',
    constraints: ['1 <= pos.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'target = 12, pos = [10, 8, 0, 5, 3], speed = [2, 4, 1, 1, 3]', output: '3' },
      { title: 'Test Case 2', input: 'target = 10, pos = [3], speed = [3]', output: '1' },
      { title: 'Test Case 3', input: 'target = 100, pos = [0, 2, 4], speed = [4, 2, 1]', output: '1' },
      { title: 'Test Case 4', input: 'target = 10, pos = [0, 5], speed = [1, 2]', output: '2' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countArrivalFleets(int target, int[] pos, int[] speed) {
        int n = pos.length;
        double[][] cars = new double[n][2];
        for (int i = 0; i < n; i++) {
            cars[i][0] = pos[i];
            cars[i][1] = (double) (target - pos[i]) / speed[i];
        }
        Arrays.sort(cars, (a, b) -> Double.compare(b[0], a[0]));
        int fleets = 0;
        double curTime = 0;
        for (double[] c : cars) {
            if (c[1] > curTime) { fleets++; curTime = c[1]; }
        }
        return fleets;
    }
}`,
    pythonSolution: `def countArrivalFleets(target, pos, speed):
    cars = sorted(zip(pos, speed), reverse=True)
    fleets, cur_t = 0, 0.0
    for p, s in cars:
        t = (target - p) / s
        if t > cur_t:
            fleets += 1
            cur_t = t
    return fleets`
  },
  {
    number: 15,
    title: 'Longest Word in Dictionary Through Deleting',
    fnName: 'longestSubsequenceWord',
    description: 'Given string <code>s</code> and dictionary <code>dictWords</code>, return the longest word in <code>dictWords</code> that is a subsequence of <code>s</code>. Break ties by lexicographically smallest word; return <code>""</code> if none.',
    constraints: ['1 <= s.length <= 1000', '1 <= dictWords.length <= 1000'],
    testCases: [
      { title: 'Test Case 1', input: 's = "abpcplea", dictWords = ["ale", "apple", "monkey", "plea"]', output: 'apple' },
      { title: 'Test Case 2', input: 's = "abpcplea", dictWords = ["a", "b", "c"]', output: 'a' },
      { title: 'Test Case 3', input: 's = "xyz", dictWords = ["abc", "def", "xz"]', output: 'xz' },
      { title: 'Test Case 4', input: 's = "bab", dictWords = ["ba", "ab", "a", "b"]', output: 'ab' }
    ],
    javaSolution: `public class Solution {
    public static String longestSubsequenceWord(String s, String[] dictWords) {
        String best = "";
        for (String w : dictWords) {
            if (isSubseq(w, s)) {
                if (w.length() > best.length() || (w.length() == best.length() && w.compareTo(best) < 0)) {
                    best = w;
                }
            }
        }
        return best;
    }
    private static boolean isSubseq(String w, String s) {
        int i = 0;
        for (int j = 0; j < s.length() && i < w.length(); j++) if (w.charAt(i) == s.charAt(j)) i++;
        return i == w.length();
    }
}`,
    pythonSolution: `def longestSubsequenceWord(s, dictWords):
    def is_sub(w):
        it = iter(s)
        return all(c in it for c in w)
    best = ''
    for w in dictWords:
        if is_sub(w) and (len(w) > len(best) or (len(w) == len(best) and w < best)):
            best = w
    return best`
  },
  {
    number: 16,
    title: 'Minimum Cost to Hire Workers (Ratio)',
    fnName: 'maxProfitAtMostTwoTrades',
    description: 'Given daily stock prices <code>prices</code>, find the maximum profit you can achieve by completing at most 2 buy-sell transactions (you cannot hold multiple shares at once).',
    constraints: ['1 <= prices.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'prices = [3, 3, 5, 0, 0, 3, 1, 4]', output: '6' },
      { title: 'Test Case 2', input: 'prices = [1, 2, 3, 4, 5]', output: '4' },
      { title: 'Test Case 3', input: 'prices = [7, 6, 4, 3, 1]', output: '0' },
      { title: 'Test Case 4', input: 'prices = [1]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int maxProfitAtMostTwoTrades(int[] prices) {
        int buy1 = Integer.MIN_VALUE, sell1 = 0, buy2 = Integer.MIN_VALUE, sell2 = 0;
        for (int p : prices) {
            buy1 = Math.max(buy1, -p);
            sell1 = Math.max(sell1, buy1 + p);
            buy2 = Math.max(buy2, sell1 - p);
            sell2 = Math.max(sell2, buy2 + p);
        }
        return sell2;
    }
}`,
    pythonSolution: `def maxProfitAtMostTwoTrades(prices):
    buy1 = buy2 = float('-inf')
    sell1 = sell2 = 0
    for p in prices:
        buy1 = max(buy1, -p)
        sell1 = max(sell1, buy1 + p)
        buy2 = max(buy2, sell1 - p)
        sell2 = max(sell2, buy2 + p)
    return sell2`
  },
  {
    number: 17,
    title: 'Minimum Path Effort in Terrain Grid',
    fnName: 'minTerrainEffort',
    description: 'Given an <code>R x C</code> grid of elevations <code>heights</code>, a route\'s effort is the maximum absolute difference in heights between two consecutive cells. Return the minimum effort required to travel from <code>(0,0)</code> to <code>(R-1,C-1)</code>.',
    constraints: ['1 <= R, C <= 100'],
    testCases: [
      { title: 'Test Case 1', input: 'heights = [[1, 2, 2], [3, 8, 2], [5, 3, 5]]', output: '2' },
      { title: 'Test Case 2', input: 'heights = [[1, 2, 3], [3, 8, 4], [5, 3, 5]]', output: '1' },
      { title: 'Test Case 3', input: 'heights = [[1, 2, 1, 1, 1], [1, 2, 1, 2, 1], [1, 2, 1, 2, 1], [1, 2, 1, 2, 1], [1, 1, 1, 2, 1]]', output: '0' },
      { title: 'Test Case 4', input: 'heights = [[5]]', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minTerrainEffort(int[][] heights) {
        int r = heights.length, c = heights[0].length;
        int[][] eff = new int[r][c];
        for (int[] row : eff) Arrays.fill(row, Integer.MAX_VALUE);
        eff[0][0] = 0;
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));
        pq.add(new int[]{0, 0, 0});
        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
        while (!pq.isEmpty()) {
            int[] cur = pq.poll();
            int d = cur[0], x = cur[1], y = cur[2];
            if (x == r - 1 && y == c - 1) return d;
            if (d > eff[x][y]) continue;
            for (int[] dir : dirs) {
                int nx = x + dir[0], ny = y + dir[1];
                if (nx >= 0 && ny >= 0 && nx < r && ny < c) {
                    int nd = Math.max(d, Math.abs(heights[x][y] - heights[nx][ny]));
                    if (nd < eff[nx][ny]) { eff[nx][ny] = nd; pq.add(new int[]{nd, nx, ny}); }
                }
            }
        }
        return 0;
    }
}`,
    pythonSolution: `def minTerrainEffort(heights):
    import heapq
    r, c = len(heights), len(heights[0])
    eff = [[float('inf')] * c for _ in range(r)]
    eff[0][0] = 0
    pq = [(0, 0, 0)]
    while pq:
        d, x, y = heapq.heappop(pq)
        if x == r - 1 and y == c - 1:
            return d
        if d > eff[x][y]: continue
        for nx, ny in ((x+1,y),(x-1,y),(x,y+1),(x,y-1)):
            if 0 <= nx < r and 0 <= ny < c:
                nd = max(d, abs(heights[x][y] - heights[nx][ny]))
                if nd < eff[nx][ny]:
                    eff[nx][ny] = nd
                    heapq.heappush(pq, (nd, nx, ny))
    return 0`
  },
  {
    number: 18,
    title: 'Longest Increasing Path in Matrix',
    fnName: 'longestIncreasingMatrixPath',
    description: 'Given an <code>m x n</code> integer matrix <code>matrix</code>, return the length of the longest strictly increasing 4-directional path.',
    constraints: ['1 <= m, n <= 100'],
    testCases: [
      { title: 'Test Case 1', input: 'matrix = [[9, 9, 4], [6, 6, 8], [2, 1, 1]]', output: '4' },
      { title: 'Test Case 2', input: 'matrix = [[3, 4, 5], [3, 2, 6], [2, 2, 1]]', output: '4' },
      { title: 'Test Case 3', input: 'matrix = [[1]]', output: '1' },
      { title: 'Test Case 4', input: 'matrix = [[1, 2], [4, 3]]', output: '4' }
    ],
    javaSolution: `public class Solution {
    public static int longestIncreasingMatrixPath(int[][] matrix) {
        int r = matrix.length, c = matrix[0].length, best = 0;
        int[][] memo = new int[r][c];
        for (int i = 0; i < r; i++)
            for (int j = 0; j < c; j++)
                best = Math.max(best, dfs(matrix, memo, i, j, r, c));
        return best;
    }
    private static int dfs(int[][] m, int[][] memo, int i, int j, int r, int c) {
        if (memo[i][j] != 0) return memo[i][j];
        int best = 1;
        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
        for (int[] d : dirs) {
            int ni = i + d[0], nj = j + d[1];
            if (ni >= 0 && nj >= 0 && ni < r && nj < c && m[ni][nj] > m[i][j]) {
                best = Math.max(best, 1 + dfs(m, memo, ni, nj, r, c));
            }
        }
        return memo[i][j] = best;
    }
}`,
    pythonSolution: `def longestIncreasingMatrixPath(matrix):
    from functools import lru_cache
    r, c = len(matrix), len(matrix[0])
    @lru_cache(None)
    def dfs(i, j):
        best = 1
        for ni, nj in ((i+1,j),(i-1,j),(i,j+1),(i,j-1)):
            if 0 <= ni < r and 0 <= nj < c and matrix[ni][nj] > matrix[i][j]:
                best = max(best, 1 + dfs(ni, nj))
        return best
    return max(dfs(i, j) for i in range(r) for j in range(c))`
  },
  {
    number: 19,
    title: 'Minimum Number of Refueling Stops',
    fnName: 'minRefuelStops',
    description: 'A vehicle starts with <code>startFuel</code> liters (1 liter = 1 mile) to reach <code>target</code> miles. Along the way are stations <code>stations[i] = [position, fuel]</code>. Return minimum refueling stops to reach <code>target</code>, or <code>-1</code>.',
    constraints: ['1 <= target, startFuel <= 10^9', '0 <= stations.length <= 500'],
    testCases: [
      { title: 'Test Case 1', input: 'target = 100, startFuel = 10, stations = [[10, 60], [20, 30], [30, 30], [60, 40]]', output: '2' },
      { title: 'Test Case 2', input: 'target = 100, startFuel = 1, stations = [[10, 100]]', output: '-1' },
      { title: 'Test Case 3', input: 'target = 1, startFuel = 1, stations = []', output: '0' },
      { title: 'Test Case 4', input: 'target = 100, startFuel = 50, stations = [[25, 25], [50, 50]]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minRefuelStops(int target, int startFuel, int[][] stations) {
        PriorityQueue<Integer> pq = new PriorityQueue<>(Collections.reverseOrder());
        int fuel = startFuel, stops = 0, i = 0, n = stations.length;
        while (fuel < target) {
            while (i < n && stations[i][0] <= fuel) pq.add(stations[i++][1]);
            if (pq.isEmpty()) return -1;
            fuel += pq.poll();
            stops++;
        }
        return stops;
    }
}`,
    pythonSolution: `def minRefuelStops(target, startFuel, stations):
    import heapq
    pq, fuel, stops, i, n = [], startFuel, 0, 0, len(stations)
    while fuel < target:
        while i < n and stations[i][0] <= fuel:
            heapq.heappush(pq, -stations[i][1]); i += 1
        if not pq:
            return -1
        fuel += -heapq.heappop(pq)
        stops += 1
    return stops`
  },
  {
    number: 20,
    title: 'Minimum Cost to Merge Stones/Files',
    fnName: 'minMergeCostTwo',
    description: 'Given sorted or unsorted file sizes <code>files</code>, merging any two files costs the sum of their sizes. Return the minimum total cost to merge all files into one.',
    constraints: ['1 <= files.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'files = [4, 3, 2, 6]', output: '29' },
      { title: 'Test Case 2', input: 'files = [10, 20, 30]', output: '90' },
      { title: 'Test Case 3', input: 'files = [5]', output: '0' },
      { title: 'Test Case 4', input: 'files = [2, 2, 2]', output: '10' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long minMergeCostTwo(int[] files) {
        PriorityQueue<Long> pq = new PriorityQueue<>();
        for (int f : files) pq.add((long) f);
        long cost = 0;
        while (pq.size() > 1) {
            long s = pq.poll() + pq.poll();
            cost += s; pq.add(s);
        }
        return cost;
    }
}`,
    pythonSolution: `def minMergeCostTwo(files):
    import heapq
    h = list(files)
    heapq.heapify(h)
    cost = 0
    while len(h) > 1:
        s = heapq.heappop(h) + heapq.heappop(h)
        cost += s
        heapq.heappush(h, s)
    return cost`
  },
  {
    number: 21,
    title: 'Count Nice Subarrays With K Odd Numbers',
    fnName: 'countKOddSubarrays',
    description: 'Given integer array <code>nums</code> and integer <code>k</code>, return the number of contiguous subarrays with exactly <code>k</code> odd numbers.',
    constraints: ['1 <= nums.length <= 5 * 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 1, 2, 1, 1], k = 3', output: '2' },
      { title: 'Test Case 2', input: 'nums = [2, 4, 6], k = 1', output: '0' },
      { title: 'Test Case 3', input: 'nums = [2, 2, 2, 1, 2, 2, 1, 2, 2, 2], k = 2', output: '16' },
      { title: 'Test Case 4', input: 'nums = [1, 3, 5], k = 1', output: '3' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countKOddSubarrays(int[] nums, int k) {
        Map<Integer, Integer> cnt = new HashMap<>();
        cnt.put(0, 1);
        int odd = 0, ans = 0;
        for (int x : nums) {
            odd += (x & 1);
            ans += cnt.getOrDefault(odd - k, 0);
            cnt.put(odd, cnt.getOrDefault(odd, 0) + 1);
        }
        return ans;
    }
}`,
    pythonSolution: `def countKOddSubarrays(nums, k):
    cnt = {0: 1}
    odd = ans = 0
    for x in nums:
        odd += x & 1
        ans += cnt.get(odd - k, 0)
        cnt[odd] = cnt.get(odd, 0) + 1
    return ans`
  },
  {
    number: 22,
    title: 'Minimum Operations to Reduce X to Zero',
    fnName: 'minOpsReduceX',
    description: 'Given positive integers <code>nums</code> and target <code>x</code>, in each step remove either the leftmost or rightmost element and subtract it from <code>x</code>. Return the minimum operations to make <code>x == 0</code>, or <code>-1</code>.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 1, 4, 2, 3], x = 5', output: '2' },
      { title: 'Test Case 2', input: 'nums = [5, 6, 7, 8, 9], x = 4', output: '-1' },
      { title: 'Test Case 3', input: 'nums = [3, 2, 20, 1, 1, 3], x = 10', output: '5' },
      { title: 'Test Case 4', input: 'nums = [1, 1], x = 2', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int minOpsReduceX(int[] nums, int x) {
        int total = 0;
        for (int v : nums) total += v;
        int target = total - x;
        if (target < 0) return -1;
        if (target == 0) return nums.length;
        int left = 0, cur = 0, maxLen = -1;
        for (int right = 0; right < nums.length; right++) {
            cur += nums[right];
            while (cur > target) cur -= nums[left++];
            if (cur == target) maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen == -1 ? -1 : nums.length - maxLen;
    }
}`,
    pythonSolution: `def minOpsReduceX(nums, x):
    target = sum(nums) - x
    if target < 0: return -1
    if target == 0: return len(nums)
    left = cur = 0
    best = -1
    for right, v in enumerate(nums):
        cur += v
        while cur > target:
            cur -= nums[left]; left += 1
        if cur == target:
            best = max(best, right - left + 1)
    return -1 if best == -1 else len(nums) - best`
  },
  {
    number: 23,
    title: 'Maximum Erasure Value (Unique Subarray Sum)',
    fnName: 'maxUniqueSubarraySum',
    description: 'Given positive integers <code>nums</code>, find the maximum possible sum of a contiguous subarray containing all unique elements.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [4, 2, 4, 5, 6]', output: '17' },
      { title: 'Test Case 2', input: 'nums = [5, 2, 1, 2, 5, 2, 1, 2, 5]', output: '8' },
      { title: 'Test Case 3', input: 'nums = [10, 10, 10]', output: '10' },
      { title: 'Test Case 4', input: 'nums = [1, 2, 3]', output: '6' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int maxUniqueSubarraySum(int[] nums) {
        Set<Integer> seen = new HashSet<>();
        int left = 0, cur = 0, best = 0;
        for (int x : nums) {
            while (!seen.add(x)) { cur -= nums[left]; seen.remove(nums[left++]); }
            cur += x;
            best = Math.max(best, cur);
        }
        return best;
    }
}`,
    pythonSolution: `def maxUniqueSubarraySum(nums):
    seen = set()
    left = cur = best = 0
    for x in nums:
        while x in seen:
            cur -= nums[left]
            seen.remove(nums[left])
            left += 1
        seen.add(x)
        cur += x
        best = max(best, cur)
    return best`
  },
  {
    number: 24,
    title: 'Minimum Falling Path Sum in Matrix',
    fnName: 'minFallingSum',
    description: 'Given an <code>n x n</code> integer matrix <code>matrix</code>, return the minimum sum of any falling path starting at any element in row 0 and moving to <code>(r+1, c-1)</code>, <code>(r+1, c)</code>, or <code>(r+1, c+1)</code>.',
    constraints: ['1 <= n <= 100'],
    testCases: [
      { title: 'Test Case 1', input: 'matrix = [[2, 1, 3], [6, 5, 4], [7, 8, 9]]', output: '13' },
      { title: 'Test Case 2', input: 'matrix = [[-19, 57], [-40, -5]]', output: '-59' },
      { title: 'Test Case 3', input: 'matrix = [[-48]]', output: '-48' },
      { title: 'Test Case 4', input: 'matrix = [[1, 2], [3, 4]]', output: '4' }
    ],
    javaSolution: `public class Solution {
    public static int minFallingSum(int[][] matrix) {
        int n = matrix.length;
        int[] dp = matrix[0].clone();
        for (int r = 1; r < n; r++) {
            int[] next = new int[n];
            for (int c = 0; c < n; c++) {
                int best = dp[c];
                if (c > 0) best = Math.min(best, dp[c - 1]);
                if (c + 1 < n) best = Math.min(best, dp[c + 1]);
                next[c] = matrix[r][c] + best;
            }
            dp = next;
        }
        int ans = dp[0];
        for (int x : dp) ans = Math.min(ans, x);
        return ans;
    }
}`,
    pythonSolution: `def minFallingSum(matrix):
    n = len(matrix)
    dp = matrix[0][:]
    for r in range(1, n):
        dp = [matrix[r][c] + min(dp[max(0, c-1):min(n, c+2)]) for c in range(n)]
    return min(dp)`
  },
  {
    number: 25,
    title: 'Target Sum Plus-Minus Combinations',
    fnName: 'countTargetSumWays',
    description: 'Given non-negative integers <code>nums</code> and integer <code>target</code>, assign <code>+</code> or <code>-</code> before each integer so the expression evaluates to <code>target</code>. Return the number of ways.',
    constraints: ['1 <= nums.length <= 20', '0 <= sum(nums) <= 1000'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 1, 1, 1, 1], target = 3', output: '5' },
      { title: 'Test Case 2', input: 'nums = [1], target = 1', output: '1' },
      { title: 'Test Case 3', input: 'nums = [1, 2, 1], target = 0', output: '2' },
      { title: 'Test Case 4', input: 'nums = [1], target = 2', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countTargetSumWays(int[] nums, int target) {
        int sum = 0;
        for (int x : nums) sum += x;
        if (Math.abs(target) > sum || (sum + target) % 2 != 0) return 0;
        int p = (sum + target) / 2;
        int[] dp = new int[p + 1];
        dp[0] = 1;
        for (int x : nums)
            for (int s = p; s >= x; s--) dp[s] += dp[s - x];
        return dp[p];
    }
}`,
    pythonSolution: `def countTargetSumWays(nums, target):
    total = sum(nums)
    if abs(target) > total or (total + target) % 2 != 0:
        return 0
    p = (total + target) // 2
    dp = [0] * (p + 1)
    dp[0] = 1
    for x in nums:
        for s in range(p, x - 1, -1):
            dp[s] += dp[s - x]
    return dp[p]`
  },
  {
    number: 26,
    title: 'Count Complete Connected Components',
    fnName: 'countCompleteCliques',
    description: 'Given <code>n</code> vertices (0..n-1) and undirected edges <code>edges</code>, return the number of connected components that are complete graphs (every pair of vertices in the component has an edge).',
    constraints: ['1 <= n <= 50'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 6, edges = [[0,1],[0,2],[1,2],[3,4]]', output: '3' },
      { title: 'Test Case 2', input: 'n = 6, edges = [[0,1],[0,2],[1,2],[3,4],[3,5]]', output: '1' },
      { title: 'Test Case 3', input: 'n = 3, edges = []', output: '3' },
      { title: 'Test Case 4', input: 'n = 4, edges = [[0,1],[1,2],[2,3],[3,0]]', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countCompleteCliques(int n, int[][] edges) {
        List<List<Integer>> g = new ArrayList<>();
        for (int i = 0; i < n; i++) g.add(new ArrayList<>());
        for (int[] e : edges) { g.get(e[0]).add(e[1]); g.get(e[1]).add(e[0]); }
        boolean[] vis = new boolean[n];
        int ans = 0;
        for (int i = 0; i < n; i++) {
            if (vis[i]) continue;
            List<Integer> comp = new ArrayList<>();
            Deque<Integer> q = new ArrayDeque<>();
            q.add(i); vis[i] = true;
            int edgeSum = 0;
            while (!q.isEmpty()) {
                int u = q.poll(); comp.add(u);
                edgeSum += g.get(u).size();
                for (int v : g.get(u)) if (!vis[v]) { vis[v] = true; q.add(v); }
            }
            int k = comp.size();
            if (edgeSum == k * (k - 1)) ans++;
        }
        return ans;
    }
}`,
    pythonSolution: `def countCompleteCliques(n, edges):
    g = [[] for _ in range(n)]
    for u, v in edges:
        g[u].append(v); g[v].append(u)
    vis = [False] * n
    ans = 0
    for i in range(n):
        if vis[i]: continue
        st, comp, deg_sum = [i], 0, 0
        vis[i] = True
        while st:
            u = st.pop(); comp += 1; deg_sum += len(g[u])
            for v in g[u]:
                if not vis[v]:
                    vis[v] = True; st.append(v)
        if deg_sum == comp * (comp - 1):
            ans += 1
    return ans`
  },
  {
    number: 27,
    title: 'Minimum Cost to Make Array Elements Equal by Incrementing',
    fnName: 'minMovesEqualizeArray',
    description: 'In one move you can increment <code>n - 1</code> elements of <code>nums</code> by 1. Return the minimum number of moves required to make all elements equal.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 2, 3]', output: '3' },
      { title: 'Test Case 2', input: 'nums = [1, 1, 1]', output: '0' },
      { title: 'Test Case 3', input: 'nums = [5, 6, 8, 8, 5]', output: '7' },
      { title: 'Test Case 4', input: 'nums = [10]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long minMovesEqualizeArray(int[] nums) {
        int min = nums[0];
        long sum = 0;
        for (int x : nums) { min = Math.min(min, x); sum += x; }
        return sum - (long) min * nums.length;
    }
}`,
    pythonSolution: `def minMovesEqualizeArray(nums):
    return sum(nums) - min(nums) * len(nums)`
  },
  {
    number: 28,
    title: 'Jump Game Reachability Check',
    fnName: 'canReachLastStep',
    description: 'Given non-negative integers <code>nums</code> where <code>nums[i]</code> is max jump length from <code>i</code>, return <code>true</code> if you can reach the last index from index <code>0</code>.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [2, 3, 1, 1, 4]', output: 'true' },
      { title: 'Test Case 2', input: 'nums = [3, 2, 1, 0, 4]', output: 'false' },
      { title: 'Test Case 3', input: 'nums = [0]', output: 'true' },
      { title: 'Test Case 4', input: 'nums = [2, 0, 0]', output: 'true' }
    ],
    javaSolution: `public class Solution {
    public static boolean canReachLastStep(int[] nums) {
        int reach = 0;
        for (int i = 0; i < nums.length; i++) {
            if (i > reach) return false;
            reach = Math.max(reach, i + nums[i]);
        }
        return true;
    }
}`,
    pythonSolution: `def canReachLastStep(nums):
    reach = 0
    for i, x in enumerate(nums):
        if i > reach:
            return False
        reach = max(reach, i + x)
    return True`
  },
  {
    number: 29,
    title: 'Shortest Bridge Between Two Islands',
    fnName: 'shortestIslandBridge',
    description: 'Given an <code>n x n</code> binary matrix <code>grid</code> containing exactly two 4-connected islands of <code>1</code>s, return the smallest number of <code>0</code>s that must be flipped to connect the two islands.',
    constraints: ['2 <= n <= 100'],
    testCases: [
      { title: 'Test Case 1', input: 'grid = [[0, 1], [1, 0]]', output: '1' },
      { title: 'Test Case 2', input: 'grid = [[0, 1, 0], [0, 0, 0], [0, 0, 1]]', output: '2' },
      { title: 'Test Case 3', input: 'grid = [[1, 1, 1, 1, 1], [1, 0, 0, 0, 1], [1, 0, 1, 0, 1], [1, 0, 0, 0, 1], [1, 1, 1, 1, 1]]', output: '1' },
      { title: 'Test Case 4', input: 'grid = [[1, 0, 0], [0, 0, 0], [0, 0, 1]]', output: '3' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int shortestIslandBridge(int[][] grid) {
        int n = grid.length;
        Deque<int[]> q = new ArrayDeque<>();
        boolean found = false;
        for (int i = 0; i < n && !found; i++)
            for (int j = 0; j < n && !found; j++)
                if (grid[i][j] == 1) { dfs(grid, i, j, q); found = true; }
        int steps = 0;
        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
        while (!q.isEmpty()) {
            int sz = q.size();
            for (int k = 0; k < sz; k++) {
                int[] cur = q.poll();
                for (int[] d : dirs) {
                    int nx = cur[0] + d[0], ny = cur[1] + d[1];
                    if (nx >= 0 && ny >= 0 && nx < n && ny < n) {
                        if (grid[nx][ny] == 1) return steps;
                        if (grid[nx][ny] == 0) { grid[nx][ny] = 2; q.add(new int[]{nx, ny}); }
                    }
                }
            }
            steps++;
        }
        return steps;
    }
    private static void dfs(int[][] g, int i, int j, Deque<int[]> q) {
        if (i < 0 || j < 0 || i >= g.length || j >= g.length || g[i][j] != 1) return;
        g[i][j] = 2; q.add(new int[]{i, j});
        dfs(g,i+1,j,q); dfs(g,i-1,j,q); dfs(g,i,j+1,q); dfs(g,i,j-1,q);
    }
}`,
    pythonSolution: `def shortestIslandBridge(grid):
    from collections import deque
    n = len(grid)
    g = [row[:] for row in grid]
    q = deque()
    found = False
    for i in range(n):
        if found: break
        for j in range(n):
            if g[i][j] == 1:
                st = [(i, j)]
                g[i][j] = 2
                while st:
                    x, y = st.pop()
                    q.append((x, y))
                    for nx, ny in ((x+1,y),(x-1,y),(x,y+1),(x,y-1)):
                        if 0 <= nx < n and 0 <= ny < n and g[nx][ny] == 1:
                            g[nx][ny] = 2; st.append((nx, ny))
                found = True
                break
    steps = 0
    while q:
        for _ in range(len(q)):
            x, y = q.popleft()
            for nx, ny in ((x+1,y),(x-1,y),(x,y+1),(x,y-1)):
                if 0 <= nx < n and 0 <= ny < n:
                    if g[nx][ny] == 1: return steps
                    if g[nx][ny] == 0:
                        g[nx][ny] = 2; q.append((nx, ny))
        steps += 1
    return steps`
  },
  {
    number: 30,
    title: 'Maximum Profit Job Scheduling With Deadlines',
    fnName: 'maxDeadlineJobProfit',
    description: 'Given jobs <code>jobs</code> where <code>jobs[i] = [deadline, profit]</code> (1-indexed day deadlines, each job takes 1 day), schedule at most one job per day to maximize total profit.',
    constraints: ['1 <= jobs.length <= 10^4', '1 <= deadline <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'jobs = [[4, 20], [1, 10], [1, 40], [1, 30]]', output: '60' },
      { title: 'Test Case 2', input: 'jobs = [[2, 100], [1, 19], [2, 27], [1, 25], [3, 15]]', output: '142' },
      { title: 'Test Case 3', input: 'jobs = [[1, 50]]', output: '50' },
      { title: 'Test Case 4', input: 'jobs = [[1, 10], [1, 20], [1, 30]]', output: '30' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int maxDeadlineJobProfit(int[][] jobs) {
        Arrays.sort(jobs, (a, b) -> Integer.compare(b[1], a[1]));
        int maxD = 0;
        for (int[] j : jobs) maxD = Math.max(maxD, j[0]);
        int[] parent = new int[maxD + 1];
        for (int i = 0; i <= maxD; i++) parent[i] = i;
        int total = 0;
        for (int[] j : jobs) {
            int slot = find(parent, j[0]);
            if (slot > 0) { parent[slot] = find(parent, slot - 1); total += j[1]; }
        }
        return total;
    }
    private static int find(int[] p, int x) { return p[x] == x ? x : (p[x] = find(p, p[x])); }
}`,
    pythonSolution: `def maxDeadlineJobProfit(jobs):
    max_d = max(j[0] for j in jobs)
    parent = list(range(max_d + 1))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    total = 0
    for d, p in sorted(jobs, key=lambda x: -x[1]):
        slot = find(d)
        if slot > 0:
            parent[slot] = find(slot - 1)
            total += p
    return total`
  }
];
