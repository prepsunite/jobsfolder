export const HCLTECH_QUESTIONS = [
  {
    number: 1,
    title: 'Server Load Balancer Round-Robin Peak',
    fnName: 'heaviestServerLoad',
    description: 'HCLTech infrastructure routes <code>requests</code> (each with a CPU weight) across <code>k</code> servers in round-robin order (request <code>i</code> goes to server <code>i % k</code>). Return the maximum total CPU weight assigned to any single server.',
    constraints: ['1 <= k <= 10^4', '1 <= requests.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'requests = [10, 20, 30, 40, 50], k = 2', output: '90' },
      { title: 'Test Case 2', input: 'requests = [5, 10, 15], k = 3', output: '15' },
      { title: 'Test Case 3', input: 'requests = [7, 8, 9], k = 1', output: '24' },
      { title: 'Test Case 4', input: 'requests = [100], k = 4', output: '100' }
    ],
    javaSolution: `public class Solution {
    public static long heaviestServerLoad(int[] requests, int k) {
        long[] loads = new long[k];
        long best = 0;
        for (int i = 0; i < requests.length; i++) {
            int s = i % k;
            loads[s] += requests[i];
            if (loads[s] > best) best = loads[s];
        }
        return best;
    }
}`,
    pythonSolution: `def heaviestServerLoad(requests, k):
    loads = [0] * k
    for i, r in enumerate(requests):
        loads[i % k] += r
    return max(loads)`
  },
  {
    number: 2,
    title: 'Log Severity Escalation Streak',
    fnName: 'longestErrorStreak',
    description: 'Given a server health log array <code>codes</code> where HTTP codes <code>&gt;= 500</code> represent critical failures, return the length of the longest contiguous streak of critical failures.',
    constraints: ['1 <= codes.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'codes = [200, 500, 502, 503, 200, 500, 504]', output: '3' },
      { title: 'Test Case 2', input: 'codes = [200, 201, 404]', output: '0' },
      { title: 'Test Case 3', input: 'codes = [500, 500, 500, 500]', output: '4' },
      { title: 'Test Case 4', input: 'codes = [503]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int longestErrorStreak(int[] codes) {
        int cur = 0, best = 0;
        for (int c : codes) {
            if (c >= 500) { cur++; best = Math.max(best, cur); }
            else cur = 0;
        }
        return best;
    }
}`,
    pythonSolution: `def longestErrorStreak(codes):
    cur = best = 0
    for c in codes:
        if c >= 500:
            cur += 1
            best = max(best, cur)
        else:
            cur = 0
    return best`
  },
  {
    number: 3,
    title: 'Prime Bandwidth Channel Count',
    fnName: 'countPrimeChannels',
    description: 'A telecom module assigns prime-numbered frequency channels strictly less than <code>n</code>. Return the count of prime numbers strictly less than <code>n</code>.',
    constraints: ['0 <= n <= 10^6'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 10', output: '4' },
      { title: 'Test Case 2', input: 'n = 2', output: '0' },
      { title: 'Test Case 3', input: 'n = 30', output: '10' },
      { title: 'Test Case 4', input: 'n = 100', output: '25' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countPrimeChannels(int n) {
        if (n <= 2) return 0;
        boolean[] isPrime = new boolean[n];
        Arrays.fill(isPrime, true);
        isPrime[0] = isPrime[1] = false;
        for (int i = 2; (long) i * i < n; i++) {
            if (isPrime[i]) {
                for (int j = i * i; j < n; j += i) isPrime[j] = false;
            }
        }
        int cnt = 0;
        for (boolean b : isPrime) if (b) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countPrimeChannels(n):
    if n <= 2:
        return 0
    p = [True] * n
    p[0] = p[1] = False
    i = 2
    while i * i < n:
        if p[i]:
            p[i*i:n:i] = [False] * len(range(i*i, n, i))
        i += 1
    return sum(p)`
  },
  {
    number: 4,
    title: 'Memory Block First-Fit Allocator',
    fnName: 'firstFitAllocation',
    description: 'Given available memory block sizes <code>blocks</code> and incoming process requests <code>reqs</code>, allocate each request to the first block (lowest index) with remaining capacity <code>&gt;= req</code>, reducing that block\'s capacity by <code>req</code>. Return an array of allocated block indices (or <code>-1</code> if unallocated).',
    constraints: ['1 <= blocks.length, reqs.length <= 1000'],
    testCases: [
      { title: 'Test Case 1', input: 'blocks = [100, 500, 200, 300, 600], reqs = [212, 417, 112, 426]', output: '[1, 4, 1, -1]' },
      { title: 'Test Case 2', input: 'blocks = [50, 50], reqs = [60, 50]', output: '[-1, 0]' },
      { title: 'Test Case 3', input: 'blocks = [300], reqs = [100, 100, 100, 1]', output: '[0, 0, 0, -1]' },
      { title: 'Test Case 4', input: 'blocks = [10, 20, 30], reqs = [30]', output: '[2]' }
    ],
    javaSolution: `public class Solution {
    public static int[] firstFitAllocation(int[] blocks, int[] reqs) {
        int[] cap = blocks.clone();
        int[] res = new int[reqs.length];
        for (int i = 0; i < reqs.length; i++) {
            res[i] = -1;
            for (int j = 0; j < cap.length; j++) {
                if (cap[j] >= reqs[i]) {
                    cap[j] -= reqs[i];
                    res[i] = j;
                    break;
                }
            }
        }
        return res;
    }
}`,
    pythonSolution: `def firstFitAllocation(blocks, reqs):
    cap = blocks[:]
    res = []
    for r in reqs:
        idx = -1
        for j, b in enumerate(cap):
            if b >= r:
                cap[j] -= r
                idx = j
                break
        res.append(idx)
    return res`
  },
  {
    number: 5,
    title: 'Cyclic Buffer Left Rotation',
    fnName: 'rotateLogBuffer',
    description: 'Rotate an integer array <code>arr</code> to the left by <code>k</code> positions and return the resulting array.',
    constraints: ['1 <= arr.length <= 10^5', '0 <= k <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'arr = [1, 2, 3, 4, 5], k = 2', output: '[3, 4, 5, 1, 2]' },
      { title: 'Test Case 2', input: 'arr = [10, 20, 30], k = 4', output: '[20, 30, 10]' },
      { title: 'Test Case 3', input: 'arr = [7, 8], k = 0', output: '[7, 8]' },
      { title: 'Test Case 4', input: 'arr = [9], k = 100', output: '[9]' }
    ],
    javaSolution: `public class Solution {
    public static int[] rotateLogBuffer(int[] arr, int k) {
        int n = arr.length;
        k %= n;
        int[] res = new int[n];
        for (int i = 0; i < n; i++) res[i] = arr[(i + k) % n];
        return res;
    }
}`,
    pythonSolution: `def rotateLogBuffer(arr, k):
    n = len(arr)
    k %= n
    return arr[k:] + arr[:k]`
  },
  {
    number: 6,
    title: 'Log Timestamp Anomaly Pair',
    fnName: 'hasDuplicateWithinK',
    description: 'Given an array of request IDs <code>ids</code> and an integer <code>k</code>, return <code>true</code> if any ID appears twice within a window of distance at most <code>k</code> (i.e. <code>|i - j| &lt;= k</code>).',
    constraints: ['1 <= ids.length <= 10^5', '0 <= k <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'ids = [1, 2, 3, 1], k = 3', output: 'true' },
      { title: 'Test Case 2', input: 'ids = [1, 2, 3, 1, 2, 3], k = 2', output: 'false' },
      { title: 'Test Case 3', input: 'ids = [5, 5], k = 0', output: 'false' },
      { title: 'Test Case 4', input: 'ids = [1, 0, 1, 1], k = 1', output: 'true' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static boolean hasDuplicateWithinK(int[] ids, int k) {
        Map<Integer, Integer> last = new HashMap<>();
        for (int i = 0; i < ids.length; i++) {
            if (last.containsKey(ids[i]) && i - last.get(ids[i]) <= k) return true;
            last.put(ids[i], i);
        }
        return false;
    }
}`,
    pythonSolution: `def hasDuplicateWithinK(ids, k):
    last = {}
    for i, x in enumerate(ids):
        if x in last and i - last[x] <= k:
            return True
        last[x] = i
    return False`
  },
  {
    number: 7,
    title: 'Matrix Diagonal Checksum',
    fnName: 'diagonalChecksum',
    description: 'Given a square <code>n x n</code> telemetry matrix <code>mat</code>, return the sum of all elements on both the primary and secondary diagonals, counting the center element only once if <code>n</code> is odd.',
    constraints: ['1 <= n <= 200'],
    testCases: [
      { title: 'Test Case 1', input: 'mat = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]', output: '25' },
      { title: 'Test Case 2', input: 'mat = [[1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1]]', output: '8' },
      { title: 'Test Case 3', input: 'mat = [[5]]', output: '5' },
      { title: 'Test Case 4', input: 'mat = [[2, 3], [4, 5]]', output: '14' }
    ],
    javaSolution: `public class Solution {
    public static int diagonalChecksum(int[][] mat) {
        int n = mat.length, sum = 0;
        for (int i = 0; i < n; i++) {
            sum += mat[i][i];
            if (i != n - 1 - i) sum += mat[i][n - 1 - i];
        }
        return sum;
    }
}`,
    pythonSolution: `def diagonalChecksum(mat):
    n = len(mat)
    return sum(mat[i][i] + (mat[i][n-1-i] if i != n-1-i else 0) for i in range(n))`
  },
  {
    number: 8,
    title: 'Second Largest Distinct Metric',
    fnName: 'secondLargestDistinct',
    description: 'Given an integer array <code>nums</code>, return the second largest distinct value, or <code>-1</code> if fewer than 2 distinct values exist.',
    constraints: ['1 <= nums.length <= 10^5', '0 <= nums[i] <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [12, 35, 1, 10, 34, 1]', output: '34' },
      { title: 'Test Case 2', input: 'nums = [10, 10, 10]', output: '-1' },
      { title: 'Test Case 3', input: 'nums = [5]', output: '-1' },
      { title: 'Test Case 4', input: 'nums = [100, 99, 100]', output: '99' }
    ],
    javaSolution: `public class Solution {
    public static int secondLargestDistinct(int[] nums) {
        int first = -1, second = -1;
        for (int x : nums) {
            if (x > first) { second = first; first = x; }
            else if (x < first && x > second) second = x;
        }
        return second;
    }
}`,
    pythonSolution: `def secondLargestDistinct(nums):
    first = second = -1
    for x in nums:
        if x > first:
            second, first = first, x
        elif first > x > second:
            second = x
    return second`
  },
  {
    number: 9,
    title: 'Binary Search on Minimum Ship Speed',
    fnName: 'minDeliverySpeed',
    description: 'A courier has <code>piles</code> of parcels at stops and <code>h</code> hours to deliver all parcels. At speed <code>k</code> parcels/hour, each stop takes <code>ceil(piles[i] / k)</code> hours. Find the minimum integer speed <code>k</code> to finish within <code>h</code> hours.',
    constraints: ['1 <= piles.length <= h <= 10^5', '1 <= piles[i] <= 10^6'],
    testCases: [
      { title: 'Test Case 1', input: 'piles = [3, 6, 7, 11], h = 8', output: '4' },
      { title: 'Test Case 2', input: 'piles = [30, 11, 23, 4, 20], h = 5', output: '30' },
      { title: 'Test Case 3', input: 'piles = [30, 11, 23, 4, 20], h = 6', output: '23' },
      { title: 'Test Case 4', input: 'piles = [10], h = 10', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int minDeliverySpeed(int[] piles, int h) {
        int lo = 1, hi = 0;
        for (int p : piles) hi = Math.max(hi, p);
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            long hrs = 0;
            for (int p : piles) hrs += (p + mid - 1) / mid;
            if (hrs <= h) hi = mid; else lo = mid + 1;
        }
        return lo;
    }
}`,
    pythonSolution: `def minDeliverySpeed(piles, h):
    lo, hi = 1, max(piles)
    while lo < hi:
        mid = (lo + hi) // 2
        if sum((p + mid - 1) // mid for p in piles) <= h:
            hi = mid
        else:
            lo = mid + 1
    return lo`
  },
  {
    number: 10,
    title: 'Run-Length String Expansion',
    fnName: 'expandPattern',
    description: 'Given a compressed string <code>s</code> where each letter is followed by a positive integer (e.g. <code>a3b12</code>), expand and return the full string.',
    constraints: ['2 <= s.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 's = "a2b3c1"', output: 'aabbbc' },
      { title: 'Test Case 2', input: 's = "x10"', output: 'xxxxxxxxxx' },
      { title: 'Test Case 3', input: 's = "m1n2"', output: 'mnn' },
      { title: 'Test Case 4', input: 's = "z5"', output: 'zzzzz' }
    ],
    javaSolution: `public class Solution {
    public static String expandPattern(String s) {
        StringBuilder sb = new StringBuilder();
        int i = 0;
        while (i < s.length()) {
            char ch = s.charAt(i++);
            int num = 0;
            while (i < s.length() && Character.isDigit(s.charAt(i))) {
                num = num * 10 + (s.charAt(i++) - '0');
            }
            sb.append(String.valueOf(ch).repeat(num));
        }
        return sb.toString();
    }
}`,
    pythonSolution: `def expandPattern(s):
    res, i = [], 0
    while i < len(s):
        ch = s[i]; i += 1
        j = i
        while j < len(s) and s[j].isdigit():
            j += 1
        res.append(ch * int(s[i:j]))
        i = j
    return ''.join(res)`
  },
  {
    number: 11,
    title: 'Minimum Deletions for Anagram Pair',
    fnName: 'minDeletionsForAnagram',
    description: 'Given two lowercase strings <code>s1</code> and <code>s2</code>, return the minimum total number of character deletions required to make them anagrams of each other.',
    constraints: ['1 <= s1.length, s2.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 's1 = "cde", s2 = "abc"', output: '4' },
      { title: 'Test Case 2', input: 's1 = "listen", s2 = "silent"', output: '0' },
      { title: 'Test Case 3', input: 's1 = "aabb", s2 = "ab"', output: '2' },
      { title: 'Test Case 4', input: 's1 = "xyz", s2 = "pq"', output: '5' }
    ],
    javaSolution: `public class Solution {
    public static int minDeletionsForAnagram(String s1, String s2) {
        int[] cnt = new int[26];
        for (char c : s1.toCharArray()) cnt[c - 'a']++;
        for (char c : s2.toCharArray()) cnt[c - 'a']--;
        int del = 0;
        for (int x : cnt) del += Math.abs(x);
        return del;
    }
}`,
    pythonSolution: `def minDeletionsForAnagram(s1, s2):
    from collections import Counter
    c1, c2 = Counter(s1), Counter(s2)
    return sum(abs(c1[ch] - c2[ch]) for ch in set(c1) | set(c2))`
  },
  {
    number: 12,
    title: 'Longest Subarray with At Most K Distinct Values',
    fnName: 'longestKDistinctWindow',
    description: 'Given an array of task types <code>tasks</code> and an integer <code>k</code>, return the length of the longest contiguous subarray containing at most <code>k</code> distinct task types.',
    constraints: ['1 <= tasks.length <= 10^5', '1 <= k <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'tasks = [1, 2, 1, 2, 3], k = 2', output: '4' },
      { title: 'Test Case 2', input: 'tasks = [1, 2, 1, 3, 4], k = 3', output: '4' },
      { title: 'Test Case 3', input: 'tasks = [5, 5, 5], k = 1', output: '3' },
      { title: 'Test Case 4', input: 'tasks = [1, 2, 3, 4], k = 1', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int longestKDistinctWindow(int[] tasks, int k) {
        Map<Integer, Integer> cnt = new HashMap<>();
        int left = 0, best = 0;
        for (int right = 0; right < tasks.length; right++) {
            cnt.put(tasks[right], cnt.getOrDefault(tasks[right], 0) + 1);
            while (cnt.size() > k) {
                int lv = tasks[left++];
                if (cnt.get(lv) == 1) cnt.remove(lv);
                else cnt.put(lv, cnt.get(lv) - 1);
            }
            best = Math.max(best, right - left + 1);
        }
        return best;
    }
}`,
    pythonSolution: `def longestKDistinctWindow(tasks, k):
    from collections import defaultdict
    cnt = defaultdict(int)
    left = best = 0
    for right, x in enumerate(tasks):
        cnt[x] += 1
        while len(cnt) > k:
            lv = tasks[left]
            cnt[lv] -= 1
            if cnt[lv] == 0:
                del cnt[lv]
            left += 1
        best = max(best, right - left + 1)
    return best`
  },
  {
    number: 13,
    title: 'Postfix Expression Evaluator',
    fnName: 'evalPostfix',
    description: 'Evaluate a Reverse Polish Notation (postfix) token array <code>tokens</code> supporting <code>+</code>, <code>-</code>, <code>*</code>, <code>/</code> (integer division truncating toward zero).',
    constraints: ['1 <= tokens.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'tokens = ["2", "1", "+", "3", "*"]', output: '9' },
      { title: 'Test Case 2', input: 'tokens = ["4", "13", "5", "/", "+"]', output: '6' },
      { title: 'Test Case 3', input: 'tokens = ["10", "3", "-"]', output: '7' },
      { title: 'Test Case 4', input: 'tokens = ["42"]', output: '42' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int evalPostfix(String[] tokens) {
        Deque<Integer> st = new ArrayDeque<>();
        for (String t : tokens) {
            if (t.equals("+") || t.equals("-") || t.equals("*") || t.equals("/")) {
                int b = st.pop(), a = st.pop();
                if (t.equals("+")) st.push(a + b);
                else if (t.equals("-")) st.push(a - b);
                else if (t.equals("*")) st.push(a * b);
                else st.push(a / b);
            } else st.push(Integer.parseInt(t));
        }
        return st.pop();
    }
}`,
    pythonSolution: `def evalPostfix(tokens):
    st = []
    for t in tokens:
        if t in ('+', '-', '*', '/'):
            b, a = st.pop(), st.pop()
            if t == '+': st.append(a + b)
            elif t == '-': st.append(a - b)
            elif t == '*': st.append(a * b)
            else: st.append(int(a / b))
        else:
            st.append(int(t))
    return st[0]`
  },
  {
    number: 14,
    title: 'Bitwise Single-Exception Sensor ID',
    fnName: 'findSingleSensor',
    description: 'Every sensor ID in <code>sensors</code> appears three times except one faulty sensor ID that appears once. Find and return the single sensor ID.',
    constraints: ['1 <= sensors.length <= 3 * 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'sensors = [2, 2, 3, 2]', output: '3' },
      { title: 'Test Case 2', input: 'sensors = [0, 1, 0, 1, 0, 1, 99]', output: '99' },
      { title: 'Test Case 3', input: 'sensors = [7]', output: '7' },
      { title: 'Test Case 4', input: 'sensors = [-2, -2, 1, -2]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int findSingleSensor(int[] sensors) {
        int ones = 0, twos = 0;
        for (int x : sensors) {
            ones = (ones ^ x) & ~twos;
            twos = (twos ^ x) & ~ones;
        }
        return ones;
    }
}`,
    pythonSolution: `def findSingleSensor(sensors):
    ones = twos = 0
    for x in sensors:
        ones = (ones ^ x) & ~twos
        twos = (twos ^ x) & ~ones
    return ones`
  },
  {
    number: 15,
    title: 'Minimum Steps in Knight-Like Grid Jump',
    fnName: 'minJumpSteps',
    description: 'Given an array <code>jumps</code> where <code>jumps[i]</code> is the max forward jump from index <code>i</code>, return the minimum number of jumps to reach the last index <code>n - 1</code> from index <code>0</code> (guaranteed reachable).',
    constraints: ['1 <= jumps.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'jumps = [2, 3, 1, 1, 4]', output: '2' },
      { title: 'Test Case 2', input: 'jumps = [2, 3, 0, 1, 4]', output: '2' },
      { title: 'Test Case 3', input: 'jumps = [0]', output: '0' },
      { title: 'Test Case 4', input: 'jumps = [1, 1, 1, 1]', output: '3' }
    ],
    javaSolution: `public class Solution {
    public static int minJumpSteps(int[] jumps) {
        int steps = 0, curEnd = 0, farthest = 0;
        for (int i = 0; i < jumps.length - 1; i++) {
            farthest = Math.max(farthest, i + jumps[i]);
            if (i == curEnd) { steps++; curEnd = farthest; }
        }
        return steps;
    }
}`,
    pythonSolution: `def minJumpSteps(jumps):
    steps = cur_end = farthest = 0
    for i in range(len(jumps) - 1):
        farthest = max(farthest, i + jumps[i])
        if i == cur_end:
            steps += 1
            cur_end = farthest
    return steps`
  },
  {
    number: 16,
    title: 'Word Ladder Shortest Transformation',
    fnName: 'shortestTransformLen',
    description: 'Given <code>beginWord</code>, <code>endWord</code>, and a <code>wordList</code>, return the number of words in the shortest transformation sequence changing one letter at a time using only words in <code>wordList</code> (0 if impossible).',
    constraints: ['1 <= wordList.length <= 500', '1 <= beginWord.length <= 10'],
    testCases: [
      { title: 'Test Case 1', input: 'beginWord = "hit", endWord = "cog", wordList = ["hot", "dot", "dog", "lot", "log", "cog"]', output: '5' },
      { title: 'Test Case 2', input: 'beginWord = "hit", endWord = "cog", wordList = ["hot", "dot", "dog", "lot", "log"]', output: '0' },
      { title: 'Test Case 3', input: 'beginWord = "a", endWord = "c", wordList = ["a", "b", "c"]', output: '2' },
      { title: 'Test Case 4', input: 'beginWord = "cat", endWord = "dog", wordList = ["cot", "dot"]', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int shortestTransformLen(String beginWord, String endWord, String[] wordList) {
        Set<String> dict = new HashSet<>(Arrays.asList(wordList));
        if (!dict.contains(endWord)) return 0;
        Deque<String> q = new ArrayDeque<>();
        q.add(beginWord);
        int steps = 1;
        while (!q.isEmpty()) {
            int sz = q.size();
            for (int k = 0; k < sz; k++) {
                String w = q.poll();
                if (w.equals(endWord)) return steps;
                char[] arr = w.toCharArray();
                for (int i = 0; i < arr.length; i++) {
                    char orig = arr[i];
                    for (char c = 'a'; c <= 'z'; c++) {
                        arr[i] = c;
                        String next = new String(arr);
                        if (dict.remove(next)) q.add(next);
                    }
                    arr[i] = orig;
                }
            }
            steps++;
        }
        return 0;
    }
}`,
    pythonSolution: `def shortestTransformLen(beginWord, endWord, wordList):
    from collections import deque
    wset = set(wordList)
    if endWord not in wset:
        return 0
    q = deque([(beginWord, 1)])
    while q:
        w, d = q.popleft()
        if w == endWord:
            return d
        for i in range(len(w)):
            for c in 'abcdefghijklmnopqrstuvwxyz':
                nw = w[:i] + c + w[i+1:]
                if nw in wset:
                    wset.remove(nw)
                    q.append((nw, d + 1))
    return 0`
  },
  {
    number: 17,
    title: '0/1 Knapsack Cloud VM Packing',
    fnName: 'maxServerProfit',
    description: 'Given <code>weights</code> (RAM GB) and <code>values</code> (revenue) of <code>n</code> microservices and a host capacity <code>cap</code>, return the maximum total revenue without exceeding <code>cap</code>.',
    constraints: ['1 <= weights.length <= 200', '0 <= cap <= 5000'],
    testCases: [
      { title: 'Test Case 1', input: 'weights = [1, 2, 3], values = [6, 10, 12], cap = 5', output: '22' },
      { title: 'Test Case 2', input: 'weights = [4, 5, 1], values = [1, 2, 3], cap = 4', output: '3' },
      { title: 'Test Case 3', input: 'weights = [10, 20], values = [100, 200], cap = 5', output: '0' },
      { title: 'Test Case 4', input: 'weights = [2, 3, 4, 5], values = [3, 4, 5, 6], cap = 5', output: '7' }
    ],
    javaSolution: `public class Solution {
    public static int maxServerProfit(int[] weights, int[] values, int cap) {
        int[] dp = new int[cap + 1];
        for (int i = 0; i < weights.length; i++) {
            for (int w = cap; w >= weights[i]; w--) {
                dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
            }
        }
        return dp[cap];
    }
}`,
    pythonSolution: `def maxServerProfit(weights, values, cap):
    dp = [0] * (cap + 1)
    for wt, val in zip(weights, values):
        for w in range(cap, wt - 1, -1):
            if dp[w - wt] + val > dp[w]:
                dp[w] = dp[w - wt] + val
    return dp[cap]`
  },
  {
    number: 18,
    title: 'Longest Palindromic Substring in Packet',
    fnName: 'longestPalindromicSpan',
    description: 'Given a string <code>s</code>, return the length of the longest palindromic contiguous substring in <code>s</code>.',
    constraints: ['1 <= s.length <= 1000'],
    testCases: [
      { title: 'Test Case 1', input: 's = "babad"', output: '3' },
      { title: 'Test Case 2', input: 's = "cbbd"', output: '2' },
      { title: 'Test Case 3', input: 's = "racecar"', output: '7' },
      { title: 'Test Case 4', input: 's = "a"', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int longestPalindromicSpan(String s) {
        int best = 1;
        for (int i = 0; i < s.length(); i++) {
            best = Math.max(best, expand(s, i, i));
            best = Math.max(best, expand(s, i, i + 1));
        }
        return best;
    }
    private static int expand(String s, int l, int r) {
        while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) { l--; r++; }
        return r - l - 1;
    }
}`,
    pythonSolution: `def longestPalindromicSpan(s):
    best = 1
    for i in range(len(s)):
        for l, r in ((i, i), (i, i + 1)):
            while l >= 0 and r < len(s) and s[l] == s[r]:
                l -= 1
                r += 1
            best = max(best, r - l - 1)
    return best`
  },
  {
    number: 19,
    title: 'Rotting Signal Propagation Minutes',
    fnName: 'minPatchPropagationMinutes',
    description: 'In a server rack grid <code>grid</code>, <code>2</code> is a patched server, <code>1</code> is an unpatched server, and <code>0</code> is empty. Every minute, patched servers patch 4-adjacent unpatched servers. Return the minimum minutes until no unpatched server remains, or <code>-1</code>.',
    constraints: ['1 <= R, C <= 50'],
    testCases: [
      { title: 'Test Case 1', input: 'grid = [[2, 1, 1], [1, 1, 0], [0, 1, 1]]', output: '4' },
      { title: 'Test Case 2', input: 'grid = [[2, 1, 1], [0, 1, 1], [1, 0, 1]]', output: '-1' },
      { title: 'Test Case 3', input: 'grid = [[0, 2]]', output: '0' },
      { title: 'Test Case 4', input: 'grid = [[1]]', output: '-1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minPatchPropagationMinutes(int[][] grid) {
        int r = grid.length, c = grid[0].length, fresh = 0, mins = 0;
        Deque<int[]> q = new ArrayDeque<>();
        for (int i = 0; i < r; i++)
            for (int j = 0; j < c; j++) {
                if (grid[i][j] == 2) q.add(new int[]{i, j});
                else if (grid[i][j] == 1) fresh++;
            }
        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
        while (!q.isEmpty() && fresh > 0) {
            int sz = q.size();
            for (int k = 0; k < sz; k++) {
                int[] cur = q.poll();
                for (int[] d : dirs) {
                    int nx = cur[0] + d[0], ny = cur[1] + d[1];
                    if (nx >= 0 && ny >= 0 && nx < r && ny < c && grid[nx][ny] == 1) {
                        grid[nx][ny] = 2; fresh--; q.add(new int[]{nx, ny});
                    }
                }
            }
            mins++;
        }
        return fresh == 0 ? mins : -1;
    }
}`,
    pythonSolution: `def minPatchPropagationMinutes(grid):
    from collections import deque
    r, c = len(grid), len(grid[0])
    g = [row[:] for row in grid]
    q, fresh, mins = deque(), 0, 0
    for i in range(r):
        for j in range(c):
            if g[i][j] == 2: q.append((i, j))
            elif g[i][j] == 1: fresh += 1
    while q and fresh > 0:
        for _ in range(len(q)):
            x, y = q.popleft()
            for nx, ny in ((x+1,y),(x-1,y),(x,y+1),(x,y-1)):
                if 0 <= nx < r and 0 <= ny < c and g[nx][ny] == 1:
                    g[nx][ny] = 2
                    fresh -= 1
                    q.append((nx, ny))
        mins += 1
    return mins if fresh == 0 else -1`
  },
  {
    number: 20,
    title: 'Subarray With Maximum Average of Length K',
    fnName: 'maxWindowSumK',
    description: 'Given an integer array <code>nums</code> and integer <code>k</code>, return the maximum sum of any contiguous subarray of length <code>k</code>.',
    constraints: ['1 <= k <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 12, -5, -6, 50, 3], k = 4', output: '51' },
      { title: 'Test Case 2', input: 'nums = [5], k = 1', output: '5' },
      { title: 'Test Case 3', input: 'nums = [-10, -2, -3, -1], k = 2', output: '-4' },
      { title: 'Test Case 4', input: 'nums = [4, 2, 1, 7, 8, 1, 2, 8, 1, 0], k = 3', output: '16' }
    ],
    javaSolution: `public class Solution {
    public static int maxWindowSumK(int[] nums, int k) {
        int sum = 0;
        for (int i = 0; i < k; i++) sum += nums[i];
        int best = sum;
        for (int i = k; i < nums.length; i++) {
            sum += nums[i] - nums[i - k];
            best = Math.max(best, sum);
        }
        return best;
    }
}`,
    pythonSolution: `def maxWindowSumK(nums, k):
    s = sum(nums[:k])
    best = s
    for i in range(k, len(nums)):
        s += nums[i] - nums[i - k]
        if s > best:
            best = s
    return best`
  },
  {
    number: 21,
    title: 'Search in Rotated Sorted Partition',
    fnName: 'searchRotatedPartition',
    description: 'A sorted array of unique IDs was rotated at an unknown pivot. Given <code>nums</code> and <code>target</code>, return the index of <code>target</code> or <code>-1</code> if not found.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [4, 5, 6, 7, 0, 1, 2], target = 0', output: '4' },
      { title: 'Test Case 2', input: 'nums = [4, 5, 6, 7, 0, 1, 2], target = 3', output: '-1' },
      { title: 'Test Case 3', input: 'nums = [1], target = 0', output: '-1' },
      { title: 'Test Case 4', input: 'nums = [5, 1, 3], target = 5', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int searchRotatedPartition(int[] nums, int target) {
        int l = 0, r = nums.length - 1;
        while (l <= r) {
            int m = (l + r) >>> 1;
            if (nums[m] == target) return m;
            if (nums[l] <= nums[m]) {
                if (nums[l] <= target && target < nums[m]) r = m - 1; else l = m + 1;
            } else {
                if (nums[m] < target && target <= nums[r]) l = m + 1; else r = m - 1;
            }
        }
        return -1;
    }
}`,
    pythonSolution: `def searchRotatedPartition(nums, target):
    l, r = 0, len(nums) - 1
    while l <= r:
        m = (l + r) // 2
        if nums[m] == target:
            return m
        if nums[l] <= nums[m]:
            if nums[l] <= target < nums[m]: r = m - 1
            else: l = m + 1
        else:
            if nums[m] < target <= nums[r]: l = m + 1
            else: r = m - 1
    return -1`
  },
  {
    number: 22,
    title: 'Minimum Time to Complete All Tasks With Cooldown',
    fnName: 'minSchedulerTicks',
    description: 'Given CPU task labels <code>tasks</code> and a cooldown <code>n</code> between identical tasks, return the minimum number of intervals required to finish all tasks.',
    constraints: ['1 <= tasks.length <= 10^4', '0 <= n <= 100'],
    testCases: [
      { title: 'Test Case 1', input: 'tasks = ["A", "A", "A", "B", "B", "B"], n = 2', output: '8' },
      { title: 'Test Case 2', input: 'tasks = ["A", "A", "A", "B", "B", "B"], n = 0', output: '6' },
      { title: 'Test Case 3', input: 'tasks = ["A", "A", "A", "A", "A", "A", "B", "C", "D", "E", "F", "G"], n = 2', output: '16' },
      { title: 'Test Case 4', input: 'tasks = ["A"], n = 5', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int minSchedulerTicks(String[] tasks, int n) {
        int[] freq = new int[26];
        int maxF = 0, maxCnt = 0;
        for (String t : tasks) {
            int f = ++freq[t.charAt(0) - 'A'];
            if (f > maxF) { maxF = f; maxCnt = 1; }
            else if (f == maxF) maxCnt++;
        }
        return Math.max(tasks.length, (maxF - 1) * (n + 1) + maxCnt);
    }
}`,
    pythonSolution: `def minSchedulerTicks(tasks, n):
    from collections import Counter
    cnt = Counter(tasks)
    max_f = max(cnt.values())
    max_cnt = sum(1 for v in cnt.values() if v == max_f)
    return max(len(tasks), (max_f - 1) * (n + 1) + max_cnt)`
  },
  {
    number: 23,
    title: 'Trapped Rainwater Between Server Racks',
    fnName: 'trappedCoolantUnits',
    description: 'Given non-negative integers <code>height</code> representing rack heights of width 1, compute how many units of coolant/water can be trapped between the racks.',
    constraints: ['1 <= height.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]', output: '6' },
      { title: 'Test Case 2', input: 'height = [4, 2, 0, 3, 2, 5]', output: '9' },
      { title: 'Test Case 3', input: 'height = [1, 2, 3, 4]', output: '0' },
      { title: 'Test Case 4', input: 'height = [5]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int trappedCoolantUnits(int[] height) {
        int l = 0, r = height.length - 1, lMax = 0, rMax = 0, ans = 0;
        while (l < r) {
            if (height[l] < height[r]) {
                lMax = Math.max(lMax, height[l]);
                ans += lMax - height[l++];
            } else {
                rMax = Math.max(rMax, height[r]);
                ans += rMax - height[r--];
            }
        }
        return ans;
    }
}`,
    pythonSolution: `def trappedCoolantUnits(height):
    l, r, lmax, rmax, ans = 0, len(height) - 1, 0, 0, 0
    while l < r:
        if height[l] < height[r]:
            lmax = max(lmax, height[l])
            ans += lmax - height[l]
            l += 1
        else:
            rmax = max(rmax, height[r])
            ans += rmax - height[r]
            r -= 1
    return ans`
  },
  {
    number: 24,
    title: 'Largest Histogram Server Rack Area',
    fnName: 'maxRackArea',
    description: 'Given bar heights <code>heights</code> of width 1, return the area of the largest rectangle that can be formed inside the histogram.',
    constraints: ['1 <= heights.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'heights = [2, 1, 5, 6, 2, 3]', output: '10' },
      { title: 'Test Case 2', input: 'heights = [2, 4]', output: '4' },
      { title: 'Test Case 3', input: 'heights = [6, 2, 5, 4, 5, 1, 6]', output: '12' },
      { title: 'Test Case 4', input: 'heights = [5]', output: '5' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int maxRackArea(int[] heights) {
        Deque<Integer> st = new ArrayDeque<>();
        int best = 0, n = heights.length;
        for (int i = 0; i <= n; i++) {
            int h = (i == n) ? 0 : heights[i];
            while (!st.isEmpty() && h < heights[st.peek()]) {
                int height = heights[st.pop()];
                int width = st.isEmpty() ? i : i - st.peek() - 1;
                best = Math.max(best, height * width);
            }
            st.push(i);
        }
        return best;
    }
}`,
    pythonSolution: `def maxRackArea(heights):
    st, best = [], 0
    for i, h in enumerate(heights + [0]):
        while st and h < heights[st[-1]]:
            ht = heights[st.pop()]
            w = i if not st else i - st[-1] - 1
            best = max(best, ht * w)
        st.append(i)
    return best`
  },
  {
    number: 25,
    title: 'Network Latency Dijkstra Shortest Path',
    fnName: 'networkBroadcastTime',
    description: 'Given <code>n</code> nodes (1-indexed), directed weighted edges <code>times</code> <code>[u, v, w]</code>, and a source node <code>k</code>, return the minimum time for all <code>n</code> nodes to receive a signal, or <code>-1</code> if impossible.',
    constraints: ['1 <= n <= 100', '1 <= times.length <= 6000'],
    testCases: [
      { title: 'Test Case 1', input: 'times = [[2, 1, 1], [2, 3, 1], [3, 4, 1]], n = 4, k = 2', output: '2' },
      { title: 'Test Case 2', input: 'times = [[1, 2, 1]], n = 2, k = 1', output: '1' },
      { title: 'Test Case 3', input: 'times = [[1, 2, 1]], n = 2, k = 2', output: '-1' },
      { title: 'Test Case 4', input: 'times = [], n = 1, k = 1', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int networkBroadcastTime(int[][] times, int n, int k) {
        List<List<int[]>> g = new ArrayList<>();
        for (int i = 0; i <= n; i++) g.add(new ArrayList<>());
        for (int[] t : times) g.get(t[0]).add(new int[]{t[1], t[2]});
        int[] dist = new int[n + 1];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[k] = 0;
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));
        pq.add(new int[]{0, k});
        while (!pq.isEmpty()) {
            int[] cur = pq.poll();
            if (cur[0] > dist[cur[1]]) continue;
            for (int[] e : g.get(cur[1])) {
                if (cur[0] + e[1] < dist[e[0]]) {
                    dist[e[0]] = cur[0] + e[1];
                    pq.add(new int[]{dist[e[0]], e[0]});
                }
            }
        }
        int ans = 0;
        for (int i = 1; i <= n; i++) {
            if (dist[i] == Integer.MAX_VALUE) return -1;
            ans = Math.max(ans, dist[i]);
        }
        return ans;
    }
}`,
    pythonSolution: `def networkBroadcastTime(times, n, k):
    import heapq
    g = [[] for _ in range(n + 1)]
    for u, v, w in times:
        g[u].append((v, w))
    dist = [float('inf')] * (n + 1)
    dist[k] = 0
    pq = [(0, k)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue
        for v, w in g[u]:
            if d + w < dist[v]:
                dist[v] = d + w
                heapq.heappush(pq, (dist[v], v))
    mx = max(dist[1:])
    return -1 if mx == float('inf') else mx`
  },
  {
    number: 26,
    title: 'Minimum Spanning Tree Fiber Cost',
    fnName: 'minSpanningFiberCost',
    description: 'Connect <code>n</code> data centers (0 to n-1) given bidirectional weighted links <code>edges</code> <code>[u, v, cost]</code>. Return the minimum cost to connect all data centers, or <code>-1</code> if disconnected.',
    constraints: ['1 <= n <= 1000'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 4, edges = [[0, 1, 10], [0, 2, 6], [0, 3, 5], [1, 3, 15], [2, 3, 4]]', output: '19' },
      { title: 'Test Case 2', input: 'n = 3, edges = [[0, 1, 5]]', output: '-1' },
      { title: 'Test Case 3', input: 'n = 1, edges = []', output: '0' },
      { title: 'Test Case 4', input: 'n = 3, edges = [[0, 1, 1], [1, 2, 2], [0, 2, 3]]', output: '3' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minSpanningFiberCost(int n, int[][] edges) {
        Arrays.sort(edges, (a, b) -> Integer.compare(a[2], b[2]));
        int[] p = new int[n];
        for (int i = 0; i < n; i++) p[i] = i;
        int cost = 0, used = 0;
        for (int[] e : edges) {
            int r1 = find(p, e[0]), r2 = find(p, e[1]);
            if (r1 != r2) { p[r1] = r2; cost += e[2]; used++; }
        }
        return used == n - 1 ? cost : -1;
    }
    private static int find(int[] p, int x) { return p[x] == x ? x : (p[x] = find(p, p[x])); }
}`,
    pythonSolution: `def minSpanningFiberCost(n, edges):
    p = list(range(n))
    def find(x):
        while p[x] != x:
            p[x] = p[p[x]]
            x = p[x]
        return x
    cost = used = 0
    for u, v, w in sorted(edges, key=lambda e: e[2]):
        ru, rv = find(u), find(v)
        if ru != rv:
            p[ru] = rv
            cost += w
            used += 1
    return cost if used == n - 1 else -1`
  },
  {
    number: 27,
    title: 'Minimum Deletions to Make Frequencies Unique',
    fnName: 'minFreqDeletions',
    description: 'Given a lowercase string <code>s</code>, return the minimum number of characters you need to delete so that no two distinct characters in <code>s</code> have the same frequency.',
    constraints: ['1 <= s.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 's = "aab"', output: '0' },
      { title: 'Test Case 2', input: 's = "aaabbbcc"', output: '2' },
      { title: 'Test Case 3', input: 's = "ceabaacb"', output: '2' },
      { title: 'Test Case 4', input: 's = "aaaa"', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minFreqDeletions(String s) {
        int[] cnt = new int[26];
        for (char c : s.toCharArray()) cnt[c - 'a']++;
        Set<Integer> used = new HashSet<>();
        int del = 0;
        for (int f : cnt) {
            while (f > 0 && !used.add(f)) { f--; del++; }
        }
        return del;
    }
}`,
    pythonSolution: `def minFreqDeletions(s):
    from collections import Counter
    used, dels = set(), 0
    for f in Counter(s).values():
        while f > 0 and f in used:
            f -= 1
            dels += 1
        if f > 0:
            used.add(f)
    return dels`
  },
  {
    number: 28,
    title: 'Count Submatrices With All Ones',
    fnName: 'countAllOneSubmatrices',
    description: 'Given a binary matrix <code>mat</code>, return the total number of rectangular submatrices consisting entirely of <code>1</code>s.',
    constraints: ['1 <= R, C <= 150'],
    testCases: [
      { title: 'Test Case 1', input: 'mat = [[1, 0, 1], [1, 1, 0], [1, 1, 0]]', output: '13' },
      { title: 'Test Case 2', input: 'mat = [[0, 1, 1, 0], [0, 1, 1, 1], [1, 1, 1, 0]]', output: '24' },
      { title: 'Test Case 3', input: 'mat = [[1, 1], [1, 1]]', output: '9' },
      { title: 'Test Case 4', input: 'mat = [[0]]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countAllOneSubmatrices(int[][] mat) {
        int r = mat.length, c = mat[0].length, total = 0;
        int[] h = new int[c];
        for (int i = 0; i < r; i++) {
            for (int j = 0; j < c; j++) h[j] = (mat[i][j] == 0) ? 0 : h[j] + 1;
            for (int j = 0; j < c; j++) {
                int minH = h[j];
                for (int k = j; k >= 0 && minH > 0; k--) {
                    minH = Math.min(minH, h[k]);
                    total += minH;
                }
            }
        }
        return total;
    }
}`,
    pythonSolution: `def countAllOneSubmatrices(mat):
    r, c = len(mat), len(mat[0])
    h = [0] * c
    total = 0
    for i in range(r):
        for j in range(c):
            h[j] = 0 if mat[i][j] == 0 else h[j] + 1
        for j in range(c):
            mh = h[j]
            for k in range(j, -1, -1):
                if h[k] < mh: mh = h[k]
                if mh == 0: break
                total += mh
    return total`
  },
  {
    number: 29,
    title: 'Maximum Points From Card Deck Ends',
    fnName: 'maxEndCardsScore',
    description: 'Given card points <code>cards</code>, in each step you can take one card from the beginning or end of the row. Take exactly <code>k</code> cards to maximize your total score.',
    constraints: ['1 <= k <= cards.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'cards = [1, 2, 3, 4, 5, 6, 1], k = 3', output: '12' },
      { title: 'Test Case 2', input: 'cards = [2, 2, 2], k = 2', output: '4' },
      { title: 'Test Case 3', input: 'cards = [9, 7, 7, 9, 7, 7, 9], k = 7', output: '55' },
      { title: 'Test Case 4', input: 'cards = [100, 40, 17, 9, 73, 75], k = 3', output: '248' }
    ],
    javaSolution: `public class Solution {
    public static int maxEndCardsScore(int[] cards, int k) {
        int n = cards.length, cur = 0;
        for (int i = 0; i < k; i++) cur += cards[i];
        int best = cur;
        for (int i = 0; i < k; i++) {
            cur += cards[n - 1 - i] - cards[k - 1 - i];
            best = Math.max(best, cur);
        }
        return best;
    }
}`,
    pythonSolution: `def maxEndCardsScore(cards, k):
    cur = sum(cards[:k])
    best = cur
    for i in range(k):
        cur += cards[-1 - i] - cards[k - 1 - i]
        if cur > best:
            best = cur
    return best`
  },
  {
    number: 30,
    title: 'Bipartite Graph Check for Server Zones',
    fnName: 'canTwoColorZones',
    description: 'Given <code>n</code> nodes and undirected conflict edges <code>edges</code>, return <code>true</code> if the nodes can be partitioned into 2 conflict-free zones (bipartite graph).',
    constraints: ['1 <= n <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 4, edges = [[0, 1], [1, 2], [2, 3], [3, 0]]', output: 'true' },
      { title: 'Test Case 2', input: 'n = 3, edges = [[0, 1], [1, 2], [2, 0]]', output: 'false' },
      { title: 'Test Case 3', input: 'n = 2, edges = []', output: 'true' },
      { title: 'Test Case 4', input: 'n = 5, edges = [[0, 1], [2, 3], [3, 4], [4, 2]]', output: 'false' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static boolean canTwoColorZones(int n, int[][] edges) {
        List<List<Integer>> g = new ArrayList<>();
        for (int i = 0; i < n; i++) g.add(new ArrayList<>());
        for (int[] e : edges) { g.get(e[0]).add(e[1]); g.get(e[1]).add(e[0]); }
        int[] color = new int[n];
        for (int i = 0; i < n; i++) {
            if (color[i] != 0) continue;
            Deque<Integer> q = new ArrayDeque<>();
            q.add(i); color[i] = 1;
            while (!q.isEmpty()) {
                int u = q.poll();
                for (int v : g.get(u)) {
                    if (color[v] == 0) { color[v] = -color[u]; q.add(v); }
                    else if (color[v] == color[u]) return false;
                }
            }
        }
        return true;
    }
}`,
    pythonSolution: `def canTwoColorZones(n, edges):
    from collections import deque
    g = [[] for _ in range(n)]
    for u, v in edges:
        g[u].append(v); g[v].append(u)
    color = [0] * n
    for i in range(n):
        if color[i]:
            continue
        color[i] = 1
        q = deque([i])
        while q:
            u = q.popleft()
            for v in g[u]:
                if color[v] == 0:
                    color[v] = -color[u]
                    q.append(v)
                elif color[v] == color[u]:
                    return False
    return True`
  }
];
