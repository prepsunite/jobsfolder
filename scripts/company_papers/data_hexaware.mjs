export const HEXAWARE_QUESTIONS = [
  {
    number: 1,
    title: 'Customer Support Token Queue Simulator',
    fnName: 'timeToServeTarget',
    description: 'At a Hexaware service desk, <code>tickets[i]</code> is the number of tickets person <code>i</code> needs to buy. Each person buys 1 ticket per second and moves to the back of the queue if they still need more. Return the total seconds until person at initial index <code>k</code> finishes.',
    constraints: ['1 <= tickets.length <= 1000', '1 <= tickets[i] <= 1000', '0 <= k < tickets.length'],
    testCases: [
      { title: 'Test Case 1', input: 'tickets = [2, 3, 2], k = 2', output: '6' },
      { title: 'Test Case 2', input: 'tickets = [5, 1, 1, 1], k = 0', output: '8' },
      { title: 'Test Case 3', input: 'tickets = [1, 2, 3], k = 1', output: '4' },
      { title: 'Test Case 4', input: 'tickets = [10], k = 0', output: '10' }
    ],
    javaSolution: `public class Solution {
    public static int timeToServeTarget(int[] tickets, int k) {
        int sec = 0;
        for (int i = 0; i < tickets.length; i++) {
            sec += Math.min(tickets[i], i <= k ? tickets[k] : tickets[k] - 1);
        }
        return sec;
    }
}`,
    pythonSolution: `def timeToServeTarget(tickets, k):
    t = tickets[k]
    return sum(min(x, t if i <= k else t - 1) for i, x in enumerate(tickets))`
  },
  {
    number: 2,
    title: 'Cart Bundle Discount Optimizer',
    fnName: 'finalCartPrices',
    description: 'Given item prices <code>prices</code>, each item <code>i</code> receives a special discount equal to <code>prices[j]</code> where <code>j &gt; i</code> is the smallest index such that <code>prices[j] &lt;= prices[i]</code>. Return the final discounted price of each item.',
    constraints: ['1 <= prices.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'prices = [8, 4, 6, 2, 3]', output: '[4, 2, 4, 2, 3]' },
      { title: 'Test Case 2', input: 'prices = [1, 2, 3, 4, 5]', output: '[1, 2, 3, 4, 5]' },
      { title: 'Test Case 3', input: 'prices = [10, 1, 1, 6]', output: '[9, 0, 1, 6]' },
      { title: 'Test Case 4', input: 'prices = [5]', output: '[5]' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int[] finalCartPrices(int[] prices) {
        int[] res = prices.clone();
        Deque<Integer> st = new ArrayDeque<>();
        for (int i = 0; i < prices.length; i++) {
            while (!st.isEmpty() && prices[st.peek()] >= prices[i]) {
                res[st.pop()] -= prices[i];
            }
            st.push(i);
        }
        return res;
    }
}`,
    pythonSolution: `def finalCartPrices(prices):
    res = prices[:]
    st = []
    for i, p in enumerate(prices):
        while st and prices[st[-1]] >= p:
            res[st.pop()] -= p
        st.append(i)
    return res`
  },
  {
    number: 3,
    title: 'CamelCase Variable Splitter',
    fnName: 'camelToSnake',
    description: 'Convert a camelCase or PascalCase identifier <code>name</code> into lowercase snake_case.',
    constraints: ['1 <= name.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'name = "getUserProfileId"', output: 'get_user_profile_id' },
      { title: 'Test Case 2', input: 'name = "HexawarePGET"', output: 'hexaware_p_g_e_t' },
      { title: 'Test Case 3', input: 'name = "total"', output: 'total' },
      { title: 'Test Case 4', input: 'name = "OrderCount"', output: 'order_count' }
    ],
    javaSolution: `public class Solution {
    public static String camelToSnake(String name) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < name.length(); i++) {
            char c = name.charAt(i);
            if (Character.isUpperCase(c)) {
                if (i > 0) sb.append('_');
                sb.append(Character.toLowerCase(c));
            } else sb.append(c);
        }
        return sb.toString();
    }
}`,
    pythonSolution: `def camelToSnake(name):
    res = []
    for i, c in enumerate(name):
        if c.isupper() and i > 0:
            res.append('_')
        res.append(c.lower())
    return ''.join(res)`
  },
  {
    number: 4,
    title: 'Max Island Area in Warehouse Grid',
    fnName: 'maxWarehouseZoneArea',
    description: 'Given a binary grid <code>grid</code> where <code>1</code> is an active storage zone, return the area of the largest 4-directionally connected zone (0 if none).',
    constraints: ['1 <= R, C <= 100'],
    testCases: [
      { title: 'Test Case 1', input: 'grid = [[0, 0, 1, 0], [0, 1, 1, 1], [0, 0, 1, 0]]', output: '5' },
      { title: 'Test Case 2', input: 'grid = [[0, 0, 0], [0, 0, 0]]', output: '0' },
      { title: 'Test Case 3', input: 'grid = [[1, 1], [1, 1]]', output: '4' },
      { title: 'Test Case 4', input: 'grid = [[1, 0, 1], [0, 1, 0]]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int maxWarehouseZoneArea(int[][] grid) {
        int r = grid.length, c = grid[0].length, best = 0;
        for (int i = 0; i < r; i++)
            for (int j = 0; j < c; j++)
                if (grid[i][j] == 1) best = Math.max(best, dfs(grid, i, j, r, c));
        return best;
    }
    private static int dfs(int[][] g, int i, int j, int r, int c) {
        if (i < 0 || j < 0 || i >= r || j >= c || g[i][j] != 1) return 0;
        g[i][j] = 0;
        return 1 + dfs(g,i+1,j,r,c) + dfs(g,i-1,j,r,c) + dfs(g,i,j+1,r,c) + dfs(g,i,j-1,r,c);
    }
}`,
    pythonSolution: `def maxWarehouseZoneArea(grid):
    r, c = len(grid), len(grid[0])
    g = [row[:] for row in grid]
    best = 0
    for i in range(r):
        for j in range(c):
            if g[i][j] == 1:
                st, area = [(i, j)], 0
                g[i][j] = 0
                while st:
                    x, y = st.pop(); area += 1
                    for nx, ny in ((x+1,y),(x-1,y),(x,y+1),(x,y-1)):
                        if 0 <= nx < r and 0 <= ny < c and g[nx][ny] == 1:
                            g[nx][ny] = 0; st.append((nx, ny))
                best = max(best, area)
    return best`
  },
  {
    number: 5,
    title: 'Reverse Words Keeping Punctuation',
    fnName: 'reverseWordOrder',
    description: 'Given a sentence <code>s</code> with extra spaces, reverse the order of words and join them with a single space (trimming leading/trailing spaces).',
    constraints: ['1 <= s.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 's = "  the sky   is blue  "', output: 'blue is sky the' },
      { title: 'Test Case 2', input: 's = "hello world"', output: 'world hello' },
      { title: 'Test Case 3', input: 's = "single"', output: 'single' },
      { title: 'Test Case 4', input: 'a = "  a   b "', output: 'b a' }
    ].map(tc => tc.input.startsWith('a =') ? { ...tc, input: 's = "  a   b "' } : tc),
    javaSolution: `public class Solution {
    public static String reverseWordOrder(String s) {
        String[] parts = s.trim().split("\\\\s+");
        StringBuilder sb = new StringBuilder();
        for (int i = parts.length - 1; i >= 0; i--) {
            sb.append(parts[i]);
            if (i > 0) sb.append(' ');
        }
        return sb.toString();
    }
}`,
    pythonSolution: `def reverseWordOrder(s):
    return ' '.join(s.split()[::-1])`
  },
  {
    number: 6,
    title: 'Remove Adjacent Duplicate Characters',
    fnName: 'removeAdjacentPairs',
    description: 'Repeatedly remove adjacent duplicate characters from string <code>s</code> until no two adjacent characters are equal. Return the final string.',
    constraints: ['1 <= s.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 's = "abbaca"', output: 'ca' },
      { title: 'Test Case 2', input: 's = "azxxzy"', output: 'ay' },
      { title: 'Test Case 3', input: 's = "aabbccd"', output: 'd' },
      { title: 'Test Case 4', input: 's = "abc"', output: 'abc' }
    ],
    javaSolution: `public class Solution {
    public static String removeAdjacentPairs(String s) {
        StringBuilder sb = new StringBuilder();
        for (char c : s.toCharArray()) {
            int len = sb.length();
            if (len > 0 && sb.charAt(len - 1) == c) sb.deleteCharAt(len - 1);
            else sb.append(c);
        }
        return sb.toString();
    }
}`,
    pythonSolution: `def removeAdjacentPairs(s):
    st = []
    for c in s:
        if st and st[-1] == c:
            st.pop()
        else:
            st.append(c)
    return ''.join(st)`
  },
  {
    number: 7,
    title: 'Digit Root Persistence',
    fnName: 'digitalRoot',
    description: 'Given a non-negative integer <code>num</code>, repeatedly sum its digits until the result has only one digit, and return it.',
    constraints: ['0 <= num <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'num = 38', output: '2' },
      { title: 'Test Case 2', input: 'num = 0', output: '0' },
      { title: 'Test Case 3', input: 'num = 999', output: '9' },
      { title: 'Test Case 4', input: 'num = 12345', output: '6' }
    ],
    javaSolution: `public class Solution {
    public static int digitalRoot(int num) {
        if (num == 0) return 0;
        return 1 + (num - 1) % 9;
    }
}`,
    pythonSolution: `def digitalRoot(num):
    return 0 if num == 0 else 1 + (num - 1) % 9`
  },
  {
    number: 8,
    title: 'Move Zeroes Preserving Relative Order',
    fnName: 'shiftZeroesEnd',
    description: 'Move all <code>0</code>s in integer array <code>nums</code> to the end while maintaining the relative order of non-zero elements.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [0, 1, 0, 3, 12]', output: '[1, 3, 12, 0, 0]' },
      { title: 'Test Case 2', input: 'nums = [0]', output: '[0]' },
      { title: 'Test Case 3', input: 'nums = [1, 2, 3]', output: '[1, 2, 3]' },
      { title: 'Test Case 4', input: 'nums = [0, 0, 5]', output: '[5, 0, 0]' }
    ],
    javaSolution: `public class Solution {
    public static int[] shiftZeroesEnd(int[] nums) {
        int[] res = new int[nums.length];
        int idx = 0;
        for (int x : nums) if (x != 0) res[idx++] = x;
        return res;
    }
}`,
    pythonSolution: `def shiftZeroesEnd(nums):
    nz = [x for x in nums if x != 0]
    return nz + [0] * (len(nums) - len(nz))`
  },
  {
    number: 9,
    title: 'Minimum Cost Climbing Stairs',
    fnName: 'minStairCost',
    description: 'Given integer array <code>cost</code> where <code>cost[i]</code> is the cost of step <code>i</code>, you can start at step 0 or 1 and climb 1 or 2 steps at a time. Return the minimum cost to reach the top (past the last index).',
    constraints: ['2 <= cost.length <= 1000'],
    testCases: [
      { title: 'Test Case 1', input: 'cost = [10, 15, 20]', output: '15' },
      { title: 'Test Case 2', input: 'cost = [1, 100, 1, 1, 1, 100, 1, 1, 100, 1]', output: '6' },
      { title: 'Test Case 3', input: 'cost = [5, 10]', output: '5' },
      { title: 'Test Case 4', input: 'cost = [0, 0, 0, 0]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int minStairCost(int[] cost) {
        int a = 0, b = 0;
        for (int c : cost) {
            int next = c + Math.min(a, b);
            a = b; b = next;
        }
        return Math.min(a, b);
    }
}`,
    pythonSolution: `def minStairCost(cost):
    a = b = 0
    for c in cost:
        a, b = b, c + min(a, b)
    return min(a, b)`
  },
  {
    number: 10,
    title: 'Check String Isomorphism',
    fnName: 'areStringsIsomorphic',
    description: 'Two strings <code>s</code> and <code>t</code> of equal length are isomorphic if characters in <code>s</code> can be bijectively replaced to get <code>t</code>. Return <code>true</code> or <code>false</code>.',
    constraints: ['1 <= s.length == t.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 's = "egg", t = "add"', output: 'true' },
      { title: 'Test Case 2', input: 's = "foo", t = "bar"', output: 'false' },
      { title: 'Test Case 3', input: 's = "paper", t = "title"', output: 'true' },
      { title: 'Test Case 4', input: 's = "ab", t = "aa"', output: 'false' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static boolean areStringsIsomorphic(String s, String t) {
        Map<Character, Character> m1 = new HashMap<>(), m2 = new HashMap<>();
        for (int i = 0; i < s.length(); i++) {
            char a = s.charAt(i), b = t.charAt(i);
            if (m1.containsKey(a) && m1.get(a) != b) return false;
            if (m2.containsKey(b) && m2.get(b) != a) return false;
            m1.put(a, b); m2.put(b, a);
        }
        return true;
    }
}`,
    pythonSolution: `def areStringsIsomorphic(s, t):
    return len(set(zip(s, t))) == len(set(s)) == len(set(t))`
  },
  {
    number: 11,
    title: 'Asteroid Collision Simulator',
    fnName: 'survivingPackets',
    description: 'Given signed integer packets <code>packets</code> where positive moves right and negative moves left at equal speed. On collision, the smaller absolute value explodes (both explode if equal). Return surviving packets.',
    constraints: ['1 <= packets.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'packets = [5, 10, -5]', output: '[5, 10]' },
      { title: 'Test Case 2', input: 'packets = [8, -8]', output: '[]' },
      { title: 'Test Case 3', input: 'packets = [10, 2, -5]', output: '[10]' },
      { title: 'Test Case 4', input: 'packets = [-2, -1, 1, 2]', output: '[-2, -1, 1, 2]' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int[] survivingPackets(int[] packets) {
        Deque<Integer> st = new ArrayDeque<>();
        for (int p : packets) {
            boolean alive = true;
            while (alive && p < 0 && !st.isEmpty() && st.peek() > 0) {
                if (st.peek() < -p) st.pop();
                else if (st.peek() == -p) { st.pop(); alive = false; }
                else alive = false;
            }
            if (alive) st.push(p);
        }
        int[] res = new int[st.size()];
        for (int i = res.length - 1; i >= 0; i--) res[i] = st.pop();
        return res;
    }
}`,
    pythonSolution: `def survivingPackets(packets):
    st = []
    for p in packets:
        alive = True
        while alive and p < 0 and st and st[-1] > 0:
            if st[-1] < -p:
                st.pop()
            elif st[-1] == -p:
                st.pop()
                alive = False
            else:
                alive = False
        if alive:
            st.append(p)
    return st`
  },
  {
    number: 12,
    title: 'Daily Stock Span Calculator',
    fnName: 'computeStockSpan',
    description: 'Given daily stock prices <code>prices</code>, the span of day <code>i</code> is the maximum number of consecutive days (going backward from day <code>i</code>, including day <code>i</code>) for which the price was <code>&lt;= prices[i]</code>.',
    constraints: ['1 <= prices.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'prices = [100, 80, 60, 70, 60, 75, 85]', output: '[1, 1, 1, 2, 1, 4, 6]' },
      { title: 'Test Case 2', input: 'prices = [10, 20, 30, 40]', output: '[1, 2, 3, 4]' },
      { title: 'Test Case 3', input: 'prices = [40, 30, 20, 10]', output: '[1, 1, 1, 1]' },
      { title: 'Test Case 4', input: 'prices = [50]', output: '[1]' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int[] computeStockSpan(int[] prices) {
        int n = prices.length;
        int[] span = new int[n];
        Deque<Integer> st = new ArrayDeque<>();
        for (int i = 0; i < n; i++) {
            while (!st.isEmpty() && prices[st.peek()] <= prices[i]) st.pop();
            span[i] = st.isEmpty() ? (i + 1) : (i - st.peek());
            st.push(i);
        }
        return span;
    }
}`,
    pythonSolution: `def computeStockSpan(prices):
    st, span = [], []
    for i, p in enumerate(prices):
        while st and prices[st[-1]] <= p:
            st.pop()
        span.append(i + 1 if not st else i - st[-1])
        st.append(i)
    return span`
  },
  {
    number: 13,
    title: 'Subsets With Distinct Elements Count',
    fnName: 'countSubsetsWithSum',
    description: 'Given positive integers <code>nums</code> and target <code>target</code>, return the number of subsets whose sum equals <code>target</code>.',
    constraints: ['1 <= nums.length <= 30', '1 <= target <= 500'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [2, 3, 5, 6, 8, 10], target = 10', output: '3' },
      { title: 'Test Case 2', input: 'nums = [1, 2, 3, 3], target = 6', output: '3' },
      { title: 'Test Case 3', input: 'nums = [1, 1, 1], target = 2', output: '3' },
      { title: 'Test Case 4', input: 'nums = [5, 10], target = 3', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countSubsetsWithSum(int[] nums, int target) {
        int[] dp = new int[target + 1];
        dp[0] = 1;
        for (int x : nums)
            for (int s = target; s >= x; s--) dp[s] += dp[s - x];
        return dp[target];
    }
}`,
    pythonSolution: `def countSubsetsWithSum(nums, target):
    dp = [0] * (target + 1)
    dp[0] = 1
    for x in nums:
        for s in range(target, x - 1, -1):
            dp[s] += dp[s - x]
    return dp[target]`
  },
  {
    number: 14,
    title: 'Matrix 90-Degree Clockwise Rotation',
    fnName: 'rotateImage90',
    description: 'Given an <code>n x n</code> matrix <code>mat</code>, rotate it 90 degrees clockwise and return the resulting matrix.',
    constraints: ['1 <= n <= 100'],
    testCases: [
      { title: 'Test Case 1', input: 'mat = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]', output: '[[7, 4, 1], [8, 5, 2], [9, 6, 3]]' },
      { title: 'Test Case 2', input: 'mat = [[1, 2], [3, 4]]', output: '[[3, 1], [4, 2]]' },
      { title: 'Test Case 3', input: 'mat = [[9]]', output: '[[9]]' },
      { title: 'Test Case 4', input: 'mat = [[1, 0], [0, 1]]', output: '[[0, 1], [1, 0]]' }
    ],
    javaSolution: `public class Solution {
    public static int[][] rotateImage90(int[][] mat) {
        int n = mat.length;
        int[][] res = new int[n][n];
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++) res[j][n - 1 - i] = mat[i][j];
        return res;
    }
}`,
    pythonSolution: `def rotateImage90(mat):
    n = len(mat)
    return [[mat[n - 1 - i][j] for i in range(n)] for j in range(n)]`
  },
  {
    number: 15,
    title: 'Minimum Time to Type on Circular Keyboard',
    fnName: 'minCircularTypingTime',
    description: 'A circular dial has lowercase letters <code>a..z</code> in order. Pointer starts at <code>a</code>. Moving 1 step clockwise or counter-clockwise takes 1 second, and typing a character takes 1 second. Return minimum seconds to type <code>word</code>.',
    constraints: ['1 <= word.length <= 1000'],
    testCases: [
      { title: 'Test Case 1', input: 'word = "abc"', output: '5' },
      { title: 'Test Case 2', input: 'word = "bza"', output: '7' },
      { title: 'Test Case 3', input: 'word = "zjpc"', output: '34' },
      { title: 'Test Case 4', input: 'word = "a"', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int minCircularTypingTime(String word) {
        int time = word.length(), cur = 0;
        for (char c : word.toCharArray()) {
            int nxt = c - 'a';
            int diff = Math.abs(nxt - cur);
            time += Math.min(diff, 26 - diff);
            cur = nxt;
        }
        return time;
    }
}`,
    pythonSolution: `def minCircularTypingTime(word):
    time, cur = len(word), 0
    for c in word:
        nxt = ord(c) - ord('a')
        diff = abs(nxt - cur)
        time += min(diff, 26 - diff)
        cur = nxt
    return time`
  },
  {
    number: 16,
    title: 'Decode Nested Bracket Strings',
    fnName: 'decodeNestedString',
    description: 'Decode an encoded string <code>s</code> where <code>k[encoded_string]</code> means <code>encoded_string</code> repeated <code>k</code> times (nesting allowed).',
    constraints: ['1 <= s.length <= 100'],
    testCases: [
      { title: 'Test Case 1', input: 's = "3[a]2[bc]"', output: 'aaabcbc' },
      { title: 'Test Case 2', input: 's = "3[a2[c]]"', output: 'accaccacc' },
      { title: 'Test Case 3', input: 's = "2[abc]3[cd]ef"', output: 'abcabccdcdcdef' },
      { title: 'Test Case 4', input: 's = "xyz"', output: 'xyz' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static String decodeNestedString(String s) {
        Deque<Integer> counts = new ArrayDeque<>();
        Deque<StringBuilder> strs = new ArrayDeque<>();
        StringBuilder cur = new StringBuilder();
        int k = 0;
        for (char c : s.toCharArray()) {
            if (Character.isDigit(c)) k = k * 10 + (c - '0');
            else if (c == '[') {
                counts.push(k); strs.push(cur);
                cur = new StringBuilder(); k = 0;
            } else if (c == ']') {
                int rep = counts.pop();
                StringBuilder prev = strs.pop();
                while (rep-- > 0) prev.append(cur);
                cur = prev;
            } else cur.append(c);
        }
        return cur.toString();
    }
}`,
    pythonSolution: `def decodeNestedString(s):
    st, cur, k = [], '', 0
    for c in s:
        if c.isdigit():
            k = k * 10 + int(c)
        elif c == '[':
            st.append((cur, k))
            cur, k = '', 0
        elif c == ']':
            prev, rep = st.pop()
            cur = prev + cur * rep
        else:
            cur += c
    return cur`
  },
  {
    number: 17,
    title: 'Minimum Path Sum in Triangle Grid',
    fnName: 'minTrianglePath',
    description: 'Given a triangle array <code>tri</code>, return the minimum path sum from top to bottom. At each step you may move to adjacent index <code>i</code> or <code>i + 1</code> on the row below.',
    constraints: ['1 <= tri.length <= 200'],
    testCases: [
      { title: 'Test Case 1', input: 'tri = [[2], [3, 4], [6, 5, 7], [4, 1, 8, 3]]', output: '11' },
      { title: 'Test Case 2', input: 'tri = [[-10]]', output: '-10' },
      { title: 'Test Case 3', input: 'tri = [[1], [2, 3]]', output: '3' },
      { title: 'Test Case 4', input: 'tri = [[5], [1, 9], [10, 2, 1]]', output: '8' }
    ],
    javaSolution: `public class Solution {
    public static int minTrianglePath(int[][] tri) {
        int n = tri.length;
        int[] dp = tri[n - 1].clone();
        for (int r = n - 2; r >= 0; r--)
            for (int c = 0; c <= r; c++)
                dp[c] = tri[r][c] + Math.min(dp[c], dp[c + 1]);
        return dp[0];
    }
}`,
    pythonSolution: `def minTrianglePath(tri):
    dp = tri[-1][:]
    for r in range(len(tri) - 2, -1, -1):
        for c in range(r + 1):
            dp[c] = tri[r][c] + min(dp[c], dp[c + 1])
    return dp[0]`
  },
  {
    number: 18,
    title: 'Longest Repeating Character Replacement',
    fnName: 'longestCharAfterKFlips',
    description: 'Given an uppercase string <code>s</code> and integer <code>k</code>, you may replace at most <code>k</code> characters with any uppercase letter. Return the length of the longest substring containing the same letter.',
    constraints: ['1 <= s.length <= 10^5', '0 <= k <= s.length'],
    testCases: [
      { title: 'Test Case 1', input: 's = "ABAB", k = 2', output: '4' },
      { title: 'Test Case 2', input: 's = "AABABBA", k = 1', output: '4' },
      { title: 'Test Case 3', input: 's = "ABCDE", k = 0', output: '1' },
      { title: 'Test Case 4', input: 's = "AAAA", k = 2', output: '4' }
    ],
    javaSolution: `public class Solution {
    public static int longestCharAfterKFlips(String s, int k) {
        int[] cnt = new int[26];
        int left = 0, maxF = 0, best = 0;
        for (int right = 0; right < s.length(); right++) {
            maxF = Math.max(maxF, ++cnt[s.charAt(right) - 'A']);
            while (right - left + 1 - maxF > k) cnt[s.charAt(left++) - 'A']--;
            best = Math.max(best, right - left + 1);
        }
        return best;
    }
}`,
    pythonSolution: `def longestCharAfterKFlips(s, k):
    cnt = [0] * 26
    left = max_f = best = 0
    for right, c in enumerate(s):
        idx = ord(c) - 65
        cnt[idx] += 1
        max_f = max(max_f, cnt[idx])
        while right - left + 1 - max_f > k:
            cnt[ord(s[left]) - 65] -= 1
            left += 1
        best = max(best, right - left + 1)
    return best`
  },
  {
    number: 19,
    title: 'Shortest Unsorted Continuous Subarray',
    fnName: 'minUnsortedSpan',
    description: 'Given integer array <code>nums</code>, find the length of the shortest contiguous subarray that, if sorted in ascending order, makes the entire array sorted.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [2, 6, 4, 8, 10, 9, 15]', output: '5' },
      { title: 'Test Case 2', input: 'nums = [1, 2, 3, 4]', output: '0' },
      { title: 'Test Case 3', input: 'nums = [1]', output: '0' },
      { title: 'Test Case 4', input: 'nums = [5, 4, 3, 2, 1]', output: '5' }
    ],
    javaSolution: `public class Solution {
    public static int minUnsortedSpan(int[] nums) {
        int n = nums.length, l = -1, r = -2, max = nums[0], min = nums[n - 1];
        for (int i = 1; i < n; i++) {
            max = Math.max(max, nums[i]);
            if (nums[i] < max) r = i;
            min = Math.min(min, nums[n - 1 - i]);
            if (nums[n - 1 - i] > min) l = n - 1 - i;
        }
        return r - l + 1;
    }
}`,
    pythonSolution: `def minUnsortedSpan(nums):
    n = len(nums)
    l, r = -1, -2
    mx, mn = nums[0], nums[-1]
    for i in range(1, n):
        mx = max(mx, nums[i])
        if nums[i] < mx: r = i
        mn = min(mn, nums[n - 1 - i])
        if nums[n - 1 - i] > mn: l = n - 1 - i
    return r - l + 1`
  },
  {
    number: 20,
    title: 'Minimum Deletions for Balanced Parentheses',
    fnName: 'minParensToMakeValid',
    description: 'Given a parentheses string <code>s</code> of <code>(</code> and <code>)</code>, return the minimum number of parentheses you must add to make <code>s</code> valid.',
    constraints: ['1 <= s.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 's = "())"', output: '1' },
      { title: 'Test Case 2', input: 's = "((("', output: '3' },
      { title: 'Test Case 3', input: 's = "()()"', output: '0' },
      { title: 'Test Case 4', input: 's = "()))(("', output: '4' }
    ],
    javaSolution: `public class Solution {
    public static int minParensToMakeValid(String s) {
        int open = 0, add = 0;
        for (char c : s.toCharArray()) {
            if (c == '(') open++;
            else if (open > 0) open--;
            else add++;
        }
        return open + add;
    }
}`,
    pythonSolution: `def minParensToMakeValid(s):
    open_cnt = add = 0
    for c in s:
        if c == '(':
            open_cnt += 1
        elif open_cnt > 0:
            open_cnt -= 1
        else:
            add += 1
    return open_cnt + add`
  },
  {
    number: 21,
    title: 'Max Consecutive Ones With K Flips',
    fnName: 'maxOnesAfterKFlips',
    description: 'Given a binary array <code>nums</code> and integer <code>k</code>, return the maximum number of consecutive <code>1</code>s in the array if you can flip at most <code>k</code> <code>0</code>s.',
    constraints: ['1 <= nums.length <= 10^5', '0 <= k <= nums.length'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], k = 2', output: '6' },
      { title: 'Test Case 2', input: 'nums = [0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1], k = 3', output: '10' },
      { title: 'Test Case 3', input: 'nums = [0, 0, 0], k = 0', output: '0' },
      { title: 'Test Case 4', input: 'nums = [1, 1, 1], k = 1', output: '3' }
    ],
    javaSolution: `public class Solution {
    public static int maxOnesAfterKFlips(int[] nums, int k) {
        int left = 0, zeros = 0, best = 0;
        for (int right = 0; right < nums.length; right++) {
            if (nums[right] == 0) zeros++;
            while (zeros > k) if (nums[left++] == 0) zeros--;
            best = Math.max(best, right - left + 1);
        }
        return best;
    }
}`,
    pythonSolution: `def maxOnesAfterKFlips(nums, k):
    left = zeros = best = 0
    for right, x in enumerate(nums):
        if x == 0:
            zeros += 1
        while zeros > k:
            if nums[left] == 0:
                zeros -= 1
            left += 1
        best = max(best, right - left + 1)
    return best`
  },
  {
    number: 22,
    title: 'Minimum Number of Swaps to Sort Array',
    fnName: 'minSwapsToSort',
    description: 'Given an array of distinct integers <code>nums</code>, find the minimum number of swaps required to sort the array in strictly increasing order.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [4, 3, 2, 1]', output: '2' },
      { title: 'Test Case 2', input: 'nums = [1, 5, 4, 3, 2]', output: '2' },
      { title: 'Test Case 3', input: 'nums = [1, 2, 3, 4]', output: '0' },
      { title: 'Test Case 4', input: 'nums = [10, 19, 6, 3, 5]', output: '2' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minSwapsToSort(int[] nums) {
        int n = nums.length;
        int[][] pairs = new int[n][2];
        for (int i = 0; i < n; i++) { pairs[i][0] = nums[i]; pairs[i][1] = i; }
        Arrays.sort(pairs, (a, b) -> Integer.compare(a[0], b[0]));
        boolean[] vis = new boolean[n];
        int swaps = 0;
        for (int i = 0; i < n; i++) {
            if (vis[i] || pairs[i][1] == i) continue;
            int cycle = 0, j = i;
            while (!vis[j]) { vis[j] = true; j = pairs[j][1]; cycle++; }
            swaps += cycle - 1;
        }
        return swaps;
    }
}`,
    pythonSolution: `def minSwapsToSort(nums):
    n = len(nums)
    order = sorted(range(n), key=lambda i: nums[i])
    vis = [False] * n
    swaps = 0
    for i in range(n):
        if vis[i] or order[i] == i:
            continue
        cycle, j = 0, i
        while not vis[j]:
            vis[j] = True
            j = order[j]
            cycle += 1
        swaps += cycle - 1
    return swaps`
  },
  {
    number: 23,
    title: 'Maximum Length of Pair Chain',
    fnName: 'longestTaskChain',
    description: 'Given pairs <code>pairs</code> <code>[a, b]</code> with <code>a &lt; b</code>, pair <code>[c, d]</code> can follow <code>[a, b]</code> if <code>b &lt; c</code>. Return the length of the longest chain.',
    constraints: ['1 <= pairs.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'pairs = [[1, 2], [2, 3], [3, 4]]', output: '2' },
      { title: 'Test Case 2', input: 'pairs = [[1, 2], [7, 8], [4, 5]]', output: '3' },
      { title: 'Test Case 3', input: 'pairs = [[5, 10]]', output: '1' },
      { title: 'Test Case 4', input: 'pairs = [[1, 10], [2, 3], [4, 5]]', output: '2' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int longestTaskChain(int[][] pairs) {
        Arrays.sort(pairs, (a, b) -> Integer.compare(a[1], b[1]));
        int curEnd = Integer.MIN_VALUE, count = 0;
        for (int[] p : pairs) {
            if (p[0] > curEnd) { count++; curEnd = p[1]; }
        }
        return count;
    }
}`,
    pythonSolution: `def longestTaskChain(pairs):
    cur_end = float('-inf')
    count = 0
    for a, b in sorted(pairs, key=lambda x: x[1]):
        if a > cur_end:
            count += 1
            cur_end = b
    return count`
  },
  {
    number: 24,
    title: 'Unique Paths With Exact Obstacles',
    fnName: 'countGridPaths',
    description: 'Count unique paths from <code>(0,0)</code> to <code>(m-1, n-1)</code> moving only right or down in an empty <code>m x n</code> grid.',
    constraints: ['1 <= m, n <= 20'],
    testCases: [
      { title: 'Test Case 1', input: 'm = 3, n = 7', output: '28' },
      { title: 'Test Case 2', input: 'm = 3, n = 2', output: '3' },
      { title: 'Test Case 3', input: 'm = 1, n = 5', output: '1' },
      { title: 'Test Case 4', input: 'm = 4, n = 4', output: '20' }
    ],
    javaSolution: `public class Solution {
    public static long countGridPaths(int m, int n) {
        long[] dp = new long[n];
        java.util.Arrays.fill(dp, 1);
        for (int i = 1; i < m; i++)
            for (int j = 1; j < n; j++) dp[j] += dp[j - 1];
        return dp[n - 1];
    }
}`,
    pythonSolution: `def countGridPaths(m, n):
    import math
    return math.comb(m + n - 2, m - 1)`
  },
  {
    number: 25,
    title: 'Partition Labels Into Disjoint Segments',
    fnName: 'partitionLabelLengths',
    description: 'Partition lowercase string <code>s</code> into as many parts as possible so each letter appears in at most one part. Return a list of integers representing the size of these parts.',
    constraints: ['1 <= s.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 's = "ababcbacadefegdehijhklij"', output: '[9, 7, 8]' },
      { title: 'Test Case 2', input: 's = "eccbbbbdec"', output: '[10]' },
      { title: 'Test Case 3', input: 's = "abc"', output: '[1, 1, 1]' },
      { title: 'Test Case 4', input: 's = "aaab"', output: '[3, 1]' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static List<Integer> partitionLabelLengths(String s) {
        int[] last = new int[26];
        for (int i = 0; i < s.length(); i++) last[s.charAt(i) - 'a'] = i;
        List<Integer> res = new ArrayList<>();
        int start = 0, end = 0;
        for (int i = 0; i < s.length(); i++) {
            end = Math.max(end, last[s.charAt(i) - 'a']);
            if (i == end) { res.add(end - start + 1); start = i + 1; }
        }
        return res;
    }
}`,
    pythonSolution: `def partitionLabelLengths(s):
    last = {c: i for i, c in enumerate(s)}
    res, start, end = [], 0, 0
    for i, c in enumerate(s):
        end = max(end, last[c])
        if i == end:
            res.append(end - start + 1)
            start = i + 1
    return res`
  },
  {
    number: 26,
    title: 'Minimum Time to Complete Trips',
    fnName: 'minTimeForTrips',
    description: 'Given bus trip durations <code>time</code> where bus <code>i</code> takes <code>time[i]</code> per trip and buses run concurrently, return the minimum time to complete at least <code>totalTrips</code> trips.',
    constraints: ['1 <= time.length <= 10^4', '1 <= totalTrips <= 10^6'],
    testCases: [
      { title: 'Test Case 1', input: 'time = [1, 2, 3], totalTrips = 5', output: '3' },
      { title: 'Test Case 2', input: 'time = [2], totalTrips = 1', output: '2' },
      { title: 'Test Case 3', input: 'time = [5, 10, 10], totalTrips = 9', output: '25' },
      { title: 'Test Case 4', input: 'time = [1, 1, 1], totalTrips = 6', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static long minTimeForTrips(int[] time, int totalTrips) {
        long minT = time[0];
        for (int t : time) minT = Math.min(minT, t);
        long lo = 1, hi = minT * totalTrips;
        while (lo < hi) {
            long mid = lo + (hi - lo) / 2;
            long trips = 0;
            for (int t : time) {
                trips += mid / t;
                if (trips >= totalTrips) break;
            }
            if (trips >= totalTrips) hi = mid; else lo = mid + 1;
        }
        return lo;
    }
}`,
    pythonSolution: `def minTimeForTrips(time, totalTrips):
    lo, hi = 1, min(time) * totalTrips
    while lo < hi:
        mid = (lo + hi) // 2
        if sum(mid // t for t in time) >= totalTrips:
            hi = mid
        else:
            lo = mid + 1
    return lo`
  },
  {
    number: 27,
    title: 'Word Search in Character Grid',
    fnName: 'existWordInGrid',
    description: 'Given an <code>m x n</code> grid of characters <code>board</code> and a string <code>word</code>, return <code>true</code> if <code>word</code> can be formed by sequentially adjacent (horizontal/vertical) cells without reusing a cell.',
    constraints: ['1 <= m, n <= 10', '1 <= word.length <= 20'],
    testCases: [
      { title: 'Test Case 1', input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"', output: 'true' },
      { title: 'Test Case 2', input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"', output: 'true' },
      { title: 'Test Case 3', input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"', output: 'false' },
      { title: 'Test Case 4', input: 'board = [["Z"]], word = "Z"', output: 'true' }
    ],
    javaSolution: `public class Solution {
    public static boolean existWordInGrid(char[][] board, String word) {
        int r = board.length, c = board[0].length;
        for (int i = 0; i < r; i++)
            for (int j = 0; j < c; j++)
                if (dfs(board, word, i, j, 0)) return true;
        return false;
    }
    private static boolean dfs(char[][] b, String w, int i, int j, int k) {
        if (k == w.length()) return true;
        if (i < 0 || j < 0 || i >= b.length || j >= b[0].length || b[i][j] != w.charAt(k)) return false;
        char tmp = b[i][j]; b[i][j] = '#';
        boolean ok = dfs(b,w,i+1,j,k+1)||dfs(b,w,i-1,j,k+1)||dfs(b,w,i,j+1,k+1)||dfs(b,w,i,j-1,k+1);
        b[i][j] = tmp;
        return ok;
    }
}`,
    pythonSolution: `def existWordInGrid(board, word):
    r, c = len(board), len(board[0])
    b = [row[:] for row in board]
    def dfs(i, j, k):
        if k == len(word): return True
        if i < 0 or j < 0 or i >= r or j >= c or b[i][j] != word[k]: return False
        tmp, b[i][j] = b[i][j], '#'
        ok = dfs(i+1,j,k+1) or dfs(i-1,j,k+1) or dfs(i,j+1,k+1) or dfs(i,j-1,k+1)
        b[i][j] = tmp
        return ok
    return any(dfs(i, j, 0) for i in range(r) for j in range(c))`
  },
  {
    number: 28,
    title: 'Minimum Cost to Cut Stick/Cable',
    fnName: 'minCableCutCost',
    description: 'A cable of length <code>n</code> must be cut at positions <code>cuts</code>. Cutting a segment of length <code>L</code> costs <code>L</code>. Return the minimum total cost to perform all cuts.',
    constraints: ['2 <= n <= 10^6', '1 <= cuts.length <= 100'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 7, cuts = [1, 3, 4, 5]', output: '16' },
      { title: 'Test Case 2', input: 'n = 9, cuts = [5, 6, 1, 4, 2]', output: '22' },
      { title: 'Test Case 3', input: 'n = 10, cuts = [5]', output: '10' },
      { title: 'Test Case 4', input: 'n = 6, cuts = [2, 4]', output: '10' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minCableCutCost(int n, int[] cuts) {
        int m = cuts.length;
        int[] c = new int[m + 2];
        System.arraycopy(cuts, 0, c, 1, m);
        c[0] = 0; c[m + 1] = n;
        Arrays.sort(c);
        int[][] dp = new int[m + 2][m + 2];
        for (int len = 2; len <= m + 1; len++) {
            for (int i = 0; i + len <= m + 1; i++) {
                int j = i + len;
                dp[i][j] = Integer.MAX_VALUE;
                for (int k = i + 1; k < j; k++) {
                    dp[i][j] = Math.min(dp[i][j], dp[i][k] + dp[k][j] + c[j] - c[i]);
                }
            }
        }
        return dp[0][m + 1];
    }
}`,
    pythonSolution: `def minCableCutCost(n, cuts):
    c = [0] + sorted(cuts) + [n]
    m = len(c)
    dp = [[0] * m for _ in range(m)]
    for length in range(2, m):
        for i in range(m - length):
            j = i + length
            dp[i][j] = min(dp[i][k] + dp[k][j] for k in range(i + 1, j)) + c[j] - c[i]
    return dp[0][m - 1]`
  },
  {
    number: 29,
    title: 'Maximum Sum of Non-Overlapping K-Length Subarrays',
    fnName: 'maxTwoKSubarrays',
    description: 'Given an integer array <code>nums</code> and integer <code>k</code>, find two non-overlapping subarrays each of length <code>k</code> with the maximum combined sum.',
    constraints: ['2 * k <= nums.length <= 2 * 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 2, 1, 2, 6, 7, 5, 1], k = 2', output: '20' },
      { title: 'Test Case 2', input: 'nums = [10, 20, 30, 40], k = 2', output: '100' },
      { title: 'Test Case 3', input: 'nums = [5, 1, 5, 1, 5], k = 1', output: '10' },
      { title: 'Test Case 4', input: 'nums = [-1, -2, -3, -4], k = 2', output: '-10' }
    ],
    javaSolution: `public class Solution {
    public static int maxTwoKSubarrays(int[] nums, int k) {
        int n = nums.length;
        int[] w = new int[n - k + 1];
        int s = 0;
        for (int i = 0; i < n; i++) {
            s += nums[i];
            if (i >= k) s -= nums[i - k];
            if (i >= k - 1) w[i - k + 1] = s;
        }
        int bestLeft = w[0], ans = w[0] + w[k];
        for (int i = k; i < w.length; i++) {
            bestLeft = Math.max(bestLeft, w[i - k]);
            ans = Math.max(ans, bestLeft + w[i]);
        }
        return ans;
    }
}`,
    pythonSolution: `def maxTwoKSubarrays(nums, k):
    w = []
    s = 0
    for i, x in enumerate(nums):
        s += x
        if i >= k: s -= nums[i - k]
        if i >= k - 1: w.append(s)
    best_left = w[0]
    ans = w[0] + w[k]
    for i in range(k, len(w)):
        best_left = max(best_left, w[i - k])
        ans = max(ans, best_left + w[i])
    return ans`
  },
  {
    number: 30,
    title: 'Count Islands After Adding Land Cells',
    fnName: 'countIslandsPerStep',
    description: 'Start with an empty <code>r x c</code> sea grid (all 0s). Given a list of land cell additions <code>ops</code> <code>[row, col]</code>, return an array of the number of 4-connected islands after each operation.',
    constraints: ['1 <= r, c <= 100', '1 <= ops.length <= 1000'],
    testCases: [
      { title: 'Test Case 1', input: 'r = 3, c = 3, ops = [[0, 0], [0, 1], [1, 2], [2, 1]]', output: '[1, 1, 2, 3]' },
      { title: 'Test Case 2', input: 'r = 3, c = 3, ops = [[0, 1], [1, 0], [1, 2], [2, 1], [1, 1]]', output: '[1, 2, 3, 4, 1]' },
      { title: 'Test Case 3', input: 'r = 2, c = 2, ops = [[0, 0], [0, 0]]', output: '[1, 1]' },
      { title: 'Test Case 4', input: 'r = 1, c = 1, ops = [[0, 0]]', output: '[1]' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int[] countIslandsPerStep(int r, int c, int[][] ops) {
        int[] p = new int[r * c];
        Arrays.fill(p, -1);
        int count = 0;
        int[] res = new int[ops.length];
        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
        for (int k = 0; k < ops.length; k++) {
            int x = ops[k][0], y = ops[k][1], id = x * c + y;
            if (p[id] != -1) { res[k] = count; continue; }
            p[id] = id; count++;
            for (int[] d : dirs) {
                int nx = x + d[0], ny = y + d[1], nid = nx * c + ny;
                if (nx >= 0 && ny >= 0 && nx < r && ny < c && p[nid] != -1) {
                    int r1 = find(p, id), r2 = find(p, nid);
                    if (r1 != r2) { p[r1] = r2; count--; }
                }
            }
            res[k] = count;
        }
        return res;
    }
    private static int find(int[] p, int x) { return p[x] == x ? x : (p[x] = find(p, p[x])); }
}`,
    pythonSolution: `def countIslandsPerStep(r, c, ops):
    p = [-1] * (r * c)
    def find(x):
        while p[x] != x:
            p[x] = p[p[x]]
            x = p[x]
        return x
    cnt, res = 0, []
    for x, y in ops:
        idx = x * c + y
        if p[idx] != -1:
            res.append(cnt)
            continue
        p[idx] = idx
        cnt += 1
        for nx, ny in ((x+1,y),(x-1,y),(x,y+1),(x,y-1)):
            if 0 <= nx < r and 0 <= ny < c:
                nidx = nx * c + ny
                if p[nidx] != -1:
                    r1, r2 = find(idx), find(nidx)
                    if r1 != r2:
                        p[r1] = r2
                        cnt -= 1
        res.append(cnt)
    return res`
  }
];
