export const CAPGEMINI_QUESTIONS = [
  {
    number: 1,
    title: 'Exceller Run-Length Telemetry Compressor',
    fnName: 'compressTelemetry',
    description: 'During Capgemini Exceller batch log ingestion, repeated consecutive characters in a sensor string inflate storage. Given a lowercase string <code>s</code>, compress consecutive identical characters as <code>char + count</code> only when <code>count &gt; 1</code>. If a character appears once consecutively, keep just the character.',
    constraints: ['1 <= s.length <= 10^5', 's consists of lowercase English letters'],
    testCases: [
      { title: 'Test Case 1', input: 's = "aabbbcc"', output: 'a2b3c2' },
      { title: 'Test Case 2', input: 's = "abcd"', output: 'abcd' },
      { title: 'Test Case 3', input: 's = "ppppqrr"', output: 'p4qr2' },
      { title: 'Test Case 4', input: 's = "z"', output: 'z' }
    ],
    javaSolution: `public class Solution {
    public static String compressTelemetry(String s) {
        StringBuilder sb = new StringBuilder();
        int i = 0, n = s.length();
        while (i < n) {
            char c = s.charAt(i);
            int j = i;
            while (j < n && s.charAt(j) == c) j++;
            sb.append(c);
            if (j - i > 1) sb.append(j - i);
            i = j;
        }
        return sb.toString();
    }
}`,
    pythonSolution: `def compressTelemetry(s):
    res = []
    i, n = 0, len(s)
    while i < n:
        j = i
        while j < n and s[j] == s[i]:
            j += 1
        res.append(s[i])
        if j - i > 1:
            res.append(str(j - i))
        i = j
    return ''.join(res)`
  },
  {
    number: 2,
    title: 'Hash-Prefix Normalization for Legacy Records',
    fnName: 'moveHashesFront',
    description: 'A Capgemini mainframe migration tool receives a string <code>s</code> containing alphanumeric characters and <code>#</code> delimiters. Move all <code>#</code> characters to the front of the string while preserving the relative order of all non-<code>#</code> characters.',
    constraints: ['1 <= s.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 's = "Move#Hash#to#Front"', output: '###MoveHashtoFront' },
      { title: 'Test Case 2', input: 's = "Cap#gemini#"', output: '##Capgemini' },
      { title: 'Test Case 3', input: 's = "NoHashesHere"', output: 'NoHashesHere' },
      { title: 'Test Case 4', input: 's = "###"', output: '###' }
    ],
    javaSolution: `public class Solution {
    public static String moveHashesFront(String s) {
        StringBuilder hashes = new StringBuilder();
        StringBuilder rest = new StringBuilder();
        for (char c : s.toCharArray()) {
            if (c == '#') hashes.append('#');
            else rest.append(c);
        }
        return hashes.append(rest).toString();
    }
}`,
    pythonSolution: `def moveHashesFront(s):
    hashes = '#' * s.count('#')
    rest = ''.join(c for c in s if c != '#')
    return hashes + rest`
  },
  {
    number: 3,
    title: 'Dealership Tyre Inventory Calculator',
    fnName: 'countTotalTyres',
    description: 'An automotive client tracks daily fleet arrivals across dealerships. Given an array <code>cars</code> and an array <code>bikes</code> where <code>cars[i]</code> and <code>bikes[i]</code> are the number of 4-wheeler cars and 2-wheeler bikes at dealership <code>i</code>, return an array containing the total tyre count for each dealership.',
    constraints: ['1 <= cars.length == bikes.length <= 10^4', '0 <= cars[i], bikes[i] <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'cars = [4, 4, 1], bikes = [2, 0, 2]', output: '[20, 16, 8]' },
      { title: 'Test Case 2', input: 'cars = [0, 3], bikes = [5, 0]', output: '[10, 12]' },
      { title: 'Test Case 3', input: 'cars = [10], bikes = [10]', output: '[60]' },
      { title: 'Test Case 4', input: 'cars = [0, 0], bikes = [0, 1]', output: '[0, 2]' }
    ],
    javaSolution: `public class Solution {
    public static int[] countTotalTyres(int[] cars, int[] bikes) {
        int[] res = new int[cars.length];
        for (int i = 0; i < cars.length; i++) {
            res[i] = cars[i] * 4 + bikes[i] * 2;
        }
        return res;
    }
}`,
    pythonSolution: `def countTotalTyres(cars, bikes):
    return [c * 4 + b * 2 for c, b in zip(cars, bikes)]`
  },
  {
    number: 4,
    title: 'Semester Peak Score Aggregator',
    fnName: 'maxMarksPerSemester',
    description: 'A campus evaluation portal stores student marks per semester in a 2D array <code>semesters</code>. Validate each mark (must be between 0 and 100 inclusive). If any mark in a semester is invalid, record <code>-1</code> for that semester; otherwise record the maximum mark achieved in that semester.',
    constraints: ['1 <= semesters.length <= 20', '1 <= semesters[i].length <= 50'],
    testCases: [
      { title: 'Test Case 1', input: 'semesters = [[55, 67, 98], [77, 88, 91], [45, 72]]', output: '[98, 91, 72]' },
      { title: 'Test Case 2', input: 'semesters = [[100, 99], [105, 80], [0, 50]]', output: '[100, -1, 50]' },
      { title: 'Test Case 3', input: 'semesters = [[-5, 40]]', output: '[-1]' },
      { title: 'Test Case 4', input: 'semesters = [[0], [100]]', output: '[0, 100]' }
    ],
    javaSolution: `public class Solution {
    public static int[] maxMarksPerSemester(int[][] semesters) {
        int[] res = new int[semesters.length];
        for (int i = 0; i < semesters.length; i++) {
            int maxVal = -1;
            boolean invalid = false;
            for (int m : semesters[i]) {
                if (m < 0 || m > 100) { invalid = true; break; }
                if (m > maxVal) maxVal = m;
            }
            res[i] = invalid ? -1 : maxVal;
        }
        return res;
    }
}`,
    pythonSolution: `def maxMarksPerSemester(semesters):
    res = []
    for sem in semesters:
        if any(m < 0 or m > 100 for m in sem):
            res.append(-1)
        else:
            res.append(max(sem))
    return res`
  },
  {
    number: 5,
    title: 'Spiral Matrix Telemetry Extraction',
    fnName: 'spiralOrderRead',
    description: 'A sensor grid <code>matrix</code> of size <code>R x C</code> must be serialized in clockwise spiral order starting from the top-left cell <code>(0, 0)</code>. Return the 1D list of elements in spiral order.',
    constraints: ['1 <= R, C <= 100', '-10^4 <= matrix[i][j] <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'matrix = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]', output: '[1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]' },
      { title: 'Test Case 2', input: 'matrix = [[1, 2], [3, 4]]', output: '[1, 2, 4, 3]' },
      { title: 'Test Case 3', input: 'matrix = [[7, 8, 9]]', output: '[7, 8, 9]' },
      { title: 'Test Case 4', input: 'matrix = [[1], [2], [3]]', output: '[1, 2, 3]' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static List<Integer> spiralOrderRead(int[][] matrix) {
        List<Integer> res = new ArrayList<>();
        int top = 0, bottom = matrix.length - 1, left = 0, right = matrix[0].length - 1;
        while (top <= bottom && left <= right) {
            for (int c = left; c <= right; c++) res.add(matrix[top][c]);
            top++;
            for (int r = top; r <= bottom; r++) res.add(matrix[r][right]);
            right--;
            if (top <= bottom) {
                for (int c = right; c >= left; c--) res.add(matrix[bottom][c]);
                bottom--;
            }
            if (left <= right) {
                for (int r = bottom; r >= top; r--) res.add(matrix[r][left]);
                left++;
            }
        }
        return res;
    }
}`,
    pythonSolution: `def spiralOrderRead(matrix):
    res = []
    top, bottom, left, right = 0, len(matrix) - 1, 0, len(matrix[0]) - 1
    while top <= bottom and left <= right:
        for c in range(left, right + 1):
            res.append(matrix[top][c])
        top += 1
        for r in range(top, bottom + 1):
            res.append(matrix[r][right])
        right -= 1
        if top <= bottom:
            for c in range(right, left - 1, -1):
                res.append(matrix[bottom][c])
            bottom -= 1
        if left <= right:
            for r in range(bottom, top - 1, -1):
                res.append(matrix[r][left])
            left += 1
    return res`
  },
  {
    number: 6,
    title: 'Array Element Frequency Counter',
    fnName: 'sortedFrequencies',
    description: 'Given an integer array <code>arr</code> of product category IDs, return a sorted list of <code>[id, count]</code> pairs ordered by ascending <code>id</code>.',
    constraints: ['1 <= arr.length <= 10^5', '-10^6 <= arr[i] <= 10^6'],
    testCases: [
      { title: 'Test Case 1', input: 'arr = [1, 2, 3, 3, 4, 1, 4, 5, 1, 2]', output: '[[1, 3], [2, 2], [3, 2], [4, 2], [5, 1]]' },
      { title: 'Test Case 2', input: 'arr = [10, 10, 10]', output: '[[10, 3]]' },
      { title: 'Test Case 3', input: 'arr = [-1, 0, -1, 5]', output: '[[-1, 2], [0, 1], [5, 1]]' },
      { title: 'Test Case 4', input: 'arr = [42]', output: '[[42, 1]]' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int[][] sortedFrequencies(int[] arr) {
        TreeMap<Integer, Integer> map = new TreeMap<>();
        for (int x : arr) map.put(x, map.getOrDefault(x, 0) + 1);
        int[][] res = new int[map.size()][2];
        int idx = 0;
        for (Map.Entry<Integer, Integer> e : map.entrySet()) {
            res[idx][0] = e.getKey();
            res[idx][1] = e.getValue();
            idx++;
        }
        return res;
    }
}`,
    pythonSolution: `def sortedFrequencies(arr):
    from collections import Counter
    cnt = Counter(arr)
    return [[k, cnt[k]] for k in sorted(cnt.keys())]`
  },
  {
    number: 7,
    title: 'Equation Solver for Billing Formula',
    fnName: 'evaluateCubicIdentity',
    description: 'In a Capgemini pseudo-code & math verification round, compute the exact value of <code>a^3 + a^2*b + 2*a^2*b + 2*a*b^2 + a*b^2 + b^3</code> (which simplifies to <code>(a + b)^3</code>) for given integers <code>a</code> and <code>b</code>.',
    constraints: ['-1000 <= a, b <= 1000'],
    testCases: [
      { title: 'Test Case 1', input: 'a = 2, b = 3', output: '125' },
      { title: 'Test Case 2', input: 'a = -1, b = 4', output: '27' },
      { title: 'Test Case 3', input: 'a = 0, b = 0', output: '0' },
      { title: 'Test Case 4', input: 'a = 10, b = -5', output: '125' }
    ],
    javaSolution: `public class Solution {
    public static long evaluateCubicIdentity(long a, long b) {
        long s = a + b;
        return s * s * s;
    }
}`,
    pythonSolution: `def evaluateCubicIdentity(a, b):
    return (a + b) ** 3`
  },
  {
    number: 8,
    title: 'Minimum Steps to Reduce Load to Zero',
    fnName: 'minReductionSteps',
    description: 'A batch server starts with workload <code>n</code>. In one step, you can divide <code>n</code> by 2 if it is even, or subtract 1 if it is odd. Return the minimum number of steps required to reduce <code>n</code> to 0.',
    constraints: ['0 <= n <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 14', output: '6' },
      { title: 'Test Case 2', input: 'n = 8', output: '4' },
      { title: 'Test Case 3', input: 'n = 0', output: '0' },
      { title: 'Test Case 4', input: 'n = 123', output: '12' }
    ],
    javaSolution: `public class Solution {
    public static int minReductionSteps(int n) {
        int steps = 0;
        while (n > 0) {
            if ((n & 1) == 0) n >>= 1;
            else n -= 1;
            steps++;
        }
        return steps;
    }
}`,
    pythonSolution: `def minReductionSteps(n):
    steps = 0
    while n > 0:
        if n % 2 == 0:
            n //= 2
        else:
            n -= 1
        steps += 1
    return steps`
  },
  {
    number: 9,
    title: 'Minimum Discounted Product Finder',
    fnName: 'minDiscountProduct',
    description: 'An e-commerce catalog provides product names and prices as parallel arrays <code>items</code>, <code>prices</code>, and <code>discounts</code> (percentage 0-100). Compute the discount amount <code>price * discount / 100.0</code> for each item and return the name of the item with the strictly smallest discount amount (break ties by earliest appearance).',
    constraints: ['1 <= items.length <= 10^4', '1 <= prices[i] <= 10^6', '0 <= discounts[i] <= 100'],
    testCases: [
      { title: 'Test Case 1', input: 'items = ["mobile", "shoe", "watch", "laptop"], prices = [10000, 5000, 6000, 35000], discounts = [20, 10, 15, 5]', output: 'shoe' },
      { title: 'Test Case 2', input: 'items = ["pen", "book"], prices = [100, 200], discounts = [10, 5]', output: 'pen' },
      { title: 'Test Case 3', input: 'items = ["bag", "cap"], prices = [1000, 500], discounts = [0, 10]', output: 'bag' },
      { title: 'Test Case 4', input: 'items = ["desk"], prices = [8000], discounts = [25]', output: 'desk' }
    ],
    javaSolution: `public class Solution {
    public static String minDiscountProduct(String[] items, int[] prices, int[] discounts) {
        int bestIdx = 0;
        long bestVal = (long) prices[0] * discounts[0];
        for (int i = 1; i < items.length; i++) {
            long val = (long) prices[i] * discounts[i];
            if (val < bestVal) {
                bestVal = val;
                bestIdx = i;
            }
        }
        return items[bestIdx];
    }
}`,
    pythonSolution: `def minDiscountProduct(items, prices, discounts):
    best_idx = 0
    best_val = prices[0] * discounts[0]
    for i in range(1, len(items)):
        val = prices[i] * discounts[i]
        if val < best_val:
            best_val = val
            best_idx = i
    return items[best_idx]`
  },
  {
    number: 10,
    title: 'Divisor List in Ascending Order',
    fnName: 'findAllDivisors',
    description: 'Given a positive integer <code>n</code>, return all positive divisors of <code>n</code> in ascending order. If <code>n &lt;= 0</code>, return an empty list.',
    constraints: ['-10^6 <= n <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 54', output: '[1, 2, 3, 6, 9, 18, 27, 54]' },
      { title: 'Test Case 2', input: 'n = 13', output: '[1, 13]' },
      { title: 'Test Case 3', input: 'n = 1', output: '[1]' },
      { title: 'Test Case 4', input: 'n = -7', output: '[]' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static List<Integer> findAllDivisors(int n) {
        List<Integer> small = new ArrayList<>();
        List<Integer> large = new ArrayList<>();
        if (n <= 0) return small;
        for (int i = 1; (long) i * i <= n; i++) {
            if (n % i == 0) {
                small.add(i);
                if (i != n / i) large.add(n / i);
            }
        }
        Collections.reverse(large);
        small.addAll(large);
        return small;
    }
}`,
    pythonSolution: `def findAllDivisors(n):
    if n <= 0:
        return []
    small, large = [], []
    i = 1
    while i * i <= n:
        if n % i == 0:
            small.append(i)
            if i != n // i:
                large.append(n // i)
        i += 1
    return small + large[::-1]`
  },
  {
    number: 11,
    title: 'Valley Counter in Elevation Logs',
    fnName: 'countValleys',
    description: 'A field surveyor logs elevation changes as a string <code>steps</code> of <code>\'U\'</code> (up 1 unit) and <code>\'D\'</code> (down 1 unit), starting and ending at sea level (0). A valley is a sequence of consecutive steps below sea level, starting with a step down from sea level and ending with a step up to sea level. Return the total number of valleys.',
    constraints: ['2 <= steps.length <= 10^6', 'steps consists of U and D'],
    testCases: [
      { title: 'Test Case 1', input: 'steps = "UDDDUDUU"', output: '1' },
      { title: 'Test Case 2', input: 'steps = "DDUUDDUDUUUD"', output: '2' },
      { title: 'Test Case 3', input: 'steps = "UUUUUDDDDD"', output: '0' },
      { title: 'Test Case 4', input: 'steps = "DUDUDU"', output: '3' }
    ],
    javaSolution: `public class Solution {
    public static int countValleys(String steps) {
        int level = 0, valleys = 0;
        for (char c : steps.toCharArray()) {
            if (c == 'U') {
                level++;
                if (level == 0) valleys++;
            } else {
                level--;
            }
        }
        return valleys;
    }
}`,
    pythonSolution: `def countValleys(steps):
    level = valleys = 0
    for c in steps:
        if c == 'U':
            level += 1
            if level == 0:
                valleys += 1
        else:
            level -= 1
    return valleys`
  },
  {
    number: 12,
    title: 'Balanced Bracket Validator for Config Files',
    fnName: 'isConfigBalanced',
    description: 'A deployment script validates configuration strings containing <code>(</code>, <code>)</code>, <code>{</code>, <code>}</code>, <code>[</code>, <code>]</code> along with alphanumeric characters. Ignore non-bracket characters and return <code>true</code> if all brackets are properly matched and nested, else <code>false</code>.',
    constraints: ['1 <= s.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 's = "{a:[1,2],b:(3)}"', output: 'true' },
      { title: 'Test Case 2', input: 's = "([)]"', output: 'false' },
      { title: 'Test Case 3', input: 's = "((abc))"', output: 'true' },
      { title: 'Test Case 4', input: 's = "{["', output: 'false' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static boolean isConfigBalanced(String s) {
        Deque<Character> st = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '{' || c == '[') st.push(c);
            else if (c == ')' || c == '}' || c == ']') {
                if (st.isEmpty()) return false;
                char top = st.pop();
                if ((c == ')' && top != '(') || (c == '}' && top != '{') || (c == ']' && top != '[')) return false;
            }
        }
        return st.isEmpty();
    }
}`,
    pythonSolution: `def isConfigBalanced(s):
    pairs = {')': '(', '}': '{', ']': '['}
    st = []
    for c in s:
        if c in '({[':
            st.append(c)
        elif c in pairs:
            if not st or st.pop() != pairs[c]:
                return False
    return len(st) == 0`
  },
  {
    number: 13,
    title: 'Missing Packet Sequence Identifier',
    fnName: 'findMissingPacket',
    description: 'A network stream sends packets numbered <code>1</code> to <code>n</code>, but exactly one packet is dropped. Given the array <code>packets</code> of length <code>n - 1</code> containing distinct integers from <code>1..n</code>, return the missing packet number.',
    constraints: ['2 <= n <= 10^6', 'packets.length == n - 1'],
    testCases: [
      { title: 'Test Case 1', input: 'packets = [1, 2, 4, 5]', output: '3' },
      { title: 'Test Case 2', input: 'packets = [2, 3, 1, 5]', output: '4' },
      { title: 'Test Case 3', input: 'packets = [2]', output: '1' },
      { title: 'Test Case 4', input: 'packets = [1, 2, 3]', output: '4' }
    ],
    javaSolution: `public class Solution {
    public static int findMissingPacket(int[] packets) {
        long n = packets.length + 1;
        long expected = n * (n + 1) / 2;
        long actual = 0;
        for (int p : packets) actual += p;
        return (int) (expected - actual);
    }
}`,
    pythonSolution: `def findMissingPacket(packets):
    n = len(packets) + 1
    return n * (n + 1) // 2 - sum(packets)`
  },
  {
    number: 14,
    title: 'Season Identifier from Month Code',
    fnName: 'getSeason',
    description: 'An agricultural analytics app maps month numbers (1 to 12) to Indian/global seasons: 3-5 -> <code>Spring</code>, 6-8 -> <code>Summer</code>, 9-11 -> <code>Autumn</code>, 12,1,2 -> <code>Winter</code>. Return <code>Invalid</code> for any month outside 1..12.',
    constraints: ['-100 <= month <= 100'],
    testCases: [
      { title: 'Test Case 1', input: 'month = 4', output: 'Spring' },
      { title: 'Test Case 2', input: 'month = 12', output: 'Winter' },
      { title: 'Test Case 3', input: 'month = 10', output: 'Autumn' },
      { title: 'Test Case 4', input: 'month = 15', output: 'Invalid' }
    ],
    javaSolution: `public class Solution {
    public static String getSeason(int month) {
        if (month < 1 || month > 12) return "Invalid";
        if (month >= 3 && month <= 5) return "Spring";
        if (month >= 6 && month <= 8) return "Summer";
        if (month >= 9 && month <= 11) return "Autumn";
        return "Winter";
    }
}`,
    pythonSolution: `def getSeason(month):
    if month < 1 or month > 12:
        return "Invalid"
    if 3 <= month <= 5:
        return "Spring"
    if 6 <= month <= 8:
        return "Summer"
    if 9 <= month <= 11:
        return "Autumn"
    return "Winter"`
  },
  {
    number: 15,
    title: 'Array Rotation Check for Cyclic Logs',
    fnName: 'isCyclicRotation',
    description: 'Two circular buffer snapshots <code>a</code> and <code>b</code> of equal length are given. Return <code>true</code> if <code>b</code> can be obtained by rotating <code>a</code> cyclically (either left or right), otherwise <code>false</code>.',
    constraints: ['1 <= a.length == b.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'a = [1, 2, 3, 4, 5], b = [3, 4, 5, 1, 2]', output: 'true' },
      { title: 'Test Case 2', input: 'a = [1, 2, 3, 4], b = [1, 3, 2, 4]', output: 'false' },
      { title: 'Test Case 3', input: 'a = [7, 7, 7], b = [7, 7, 7]', output: 'true' },
      { title: 'Test Case 4', input: 'a = [10, 20], b = [20, 10]', output: 'true' }
    ],
    javaSolution: `public class Solution {
    public static boolean isCyclicRotation(int[] a, int[] b) {
        int n = a.length;
        for (int shift = 0; shift < n; shift++) {
            boolean ok = true;
            for (int i = 0; i < n; i++) {
                if (a[(i + shift) % n] != b[i]) { ok = false; break; }
            }
            if (ok) return true;
        }
        return false;
    }
}`,
    pythonSolution: `def isCyclicRotation(a, b):
    n = len(a)
    for shift in range(n):
        if all(a[(i + shift) % n] == b[i] for i in range(n)):
            return True
    return False`
  },
  {
    number: 16,
    title: 'Maximum Contiguous Server Throughput',
    fnName: 'maxThroughputWindow',
    description: 'Given an array <code>deltas</code> representing net throughput changes per minute (positive or negative), find the maximum sum of any contiguous non-empty time window.',
    constraints: ['1 <= deltas.length <= 10^5', '-10^4 <= deltas[i] <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'deltas = [-2, 1, -3, 4, -1, 2, 1, -5, 4]', output: '6' },
      { title: 'Test Case 2', input: 'deltas = [-5, -2, -8, -1]', output: '-1' },
      { title: 'Test Case 3', input: 'deltas = [5, 4, -1, 7, 8]', output: '23' },
      { title: 'Test Case 4', input: 'deltas = [10]', output: '10' }
    ],
    javaSolution: `public class Solution {
    public static int maxThroughputWindow(int[] deltas) {
        int cur = deltas[0], best = deltas[0];
        for (int i = 1; i < deltas.length; i++) {
            cur = Math.max(deltas[i], cur + deltas[i]);
            best = Math.max(best, cur);
        }
        return best;
    }
}`,
    pythonSolution: `def maxThroughputWindow(deltas):
    cur = best = deltas[0]
    for x in deltas[1:]:
        cur = max(x, cur + x)
        best = max(best, cur)
    return best`
  },
  {
    number: 17,
    title: 'Minimum Platforms for Train Dispatch',
    fnName: 'minDispatchPlatforms',
    description: 'Given arrival times <code>arrivals</code> and departure times <code>departures</code> (in minutes from midnight) of trains at a station, find the minimum number of platforms required so no train waits. If a train arrives at the exact minute another departs, two separate platforms are needed.',
    constraints: ['1 <= arrivals.length == departures.length <= 10^4', '0 <= arrivals[i] <= departures[i] <= 1440'],
    testCases: [
      { title: 'Test Case 1', input: 'arrivals = [540, 580, 590, 660, 900, 1080], departures = [550, 720, 680, 690, 1140, 1200]', output: '3' },
      { title: 'Test Case 2', input: 'arrivals = [100, 200, 300], departures = [150, 250, 350]', output: '1' },
      { title: 'Test Case 3', input: 'arrivals = [100, 150], departures = [150, 200]', output: '2' },
      { title: 'Test Case 4', input: 'arrivals = [10, 10, 10], departures = [50, 50, 50]', output: '3' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minDispatchPlatforms(int[] arrivals, int[] departures) {
        Arrays.sort(arrivals);
        Arrays.sort(departures);
        int i = 0, j = 0, cur = 0, best = 0;
        while (i < arrivals.length) {
            if (arrivals[i] <= departures[j]) {
                cur++;
                best = Math.max(best, cur);
                i++;
            } else {
                cur--;
                j++;
            }
        }
        return best;
    }
}`,
    pythonSolution: `def minDispatchPlatforms(arrivals, departures):
    a = sorted(arrivals)
    d = sorted(departures)
    i = j = cur = best = 0
    while i < len(a):
        if a[i] <= d[j]:
            cur += 1
            if cur > best:
                best = cur
            i += 1
        else:
            cur -= 1
            j += 1
    return best`
  },
  {
    number: 18,
    title: 'Distinct Substring Without Repeats',
    fnName: 'longestUniqueTokenSpan',
    description: 'Given an API request trace string <code>s</code>, find the length of the longest contiguous substring containing all distinct characters.',
    constraints: ['0 <= s.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 's = "abcabcbb"', output: '3' },
      { title: 'Test Case 2', input: 's = "bbbbb"', output: '1' },
      { title: 'Test Case 3', input: 's = "pwwkew"', output: '3' },
      { title: 'Test Case 4', input: 's = ""', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int longestUniqueTokenSpan(String s) {
        Map<Character, Integer> last = new HashMap<>();
        int left = 0, best = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (last.containsKey(c) && last.get(c) >= left) {
                left = last.get(c) + 1;
            }
            last.put(c, right);
            best = Math.max(best, right - left + 1);
        }
        return best;
    }
}`,
    pythonSolution: `def longestUniqueTokenSpan(s):
    last = {}
    left = best = 0
    for right, c in enumerate(s):
        if c in last and last[c] >= left:
            left = last[c] + 1
        last[c] = right
        if right - left + 1 > best:
            best = right - left + 1
    return best`
  },
  {
    number: 19,
    title: 'Zero-Allocation Matrix Propagation',
    fnName: 'zeroOutMatrix',
    description: 'In a sensor grid <code>grid</code>, if any cell equals <code>0</code>, its entire row and column must be marked offline (set to <code>0</code>). Return the updated matrix.',
    constraints: ['1 <= R, C <= 200'],
    testCases: [
      { title: 'Test Case 1', input: 'grid = [[1, 1, 1], [1, 0, 1], [1, 1, 1]]', output: '[[1, 0, 1], [0, 0, 0], [1, 0, 1]]' },
      { title: 'Test Case 2', input: 'grid = [[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]]', output: '[[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]]' },
      { title: 'Test Case 3', input: 'grid = [[5, 6], [7, 8]]', output: '[[5, 6], [7, 8]]' },
      { title: 'Test Case 4', input: 'grid = [[0]]', output: '[[0]]' }
    ],
    javaSolution: `public class Solution {
    public static int[][] zeroOutMatrix(int[][] grid) {
        int r = grid.length, c = grid[0].length;
        boolean[] rows = new boolean[r], cols = new boolean[c];
        for (int i = 0; i < r; i++)
            for (int j = 0; j < c; j++)
                if (grid[i][j] == 0) { rows[i] = true; cols[j] = true; }
        int[][] out = new int[r][c];
        for (int i = 0; i < r; i++)
            for (int j = 0; j < c; j++)
                out[i][j] = (rows[i] || cols[j]) ? 0 : grid[i][j];
        return out;
    }
}`,
    pythonSolution: `def zeroOutMatrix(grid):
    r, c = len(grid), len(grid[0])
    zrows = {i for i in range(r) for j in range(c) if grid[i][j] == 0}
    zcols = {j for i in range(r) for j in range(c) if grid[i][j] == 0}
    return [[0 if (i in zrows or j in zcols) else grid[i][j] for j in range(c)] for i in range(r)]`
  },
  {
    number: 20,
    title: 'Minimum Coin Change for Vending Kiosk',
    fnName: 'minVendingCoins',
    description: 'A smart kiosk dispenses change using coin denominations <code>coins</code>. Given a target amount <code>amount</code>, return the minimum number of coins needed to make up that amount, or <code>-1</code> if it cannot be formed.',
    constraints: ['1 <= coins.length <= 20', '0 <= amount <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'coins = [1, 2, 5], amount = 11', output: '3' },
      { title: 'Test Case 2', input: 'coins = [2], amount = 3', output: '-1' },
      { title: 'Test Case 3', input: 'coins = [1, 5, 10], amount = 0', output: '0' },
      { title: 'Test Case 4', input: 'coins = [3, 7, 10], amount = 14', output: '2' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minVendingCoins(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        for (int a = 1; a <= amount; a++) {
            for (int c : coins) {
                if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
}`,
    pythonSolution: `def minVendingCoins(coins, amount):
    INF = amount + 1
    dp = [0] + [INF] * amount
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a and dp[a - c] + 1 < dp[a]:
                dp[a] = dp[a - c] + 1
    return -1 if dp[amount] == INF else dp[amount]`
  },
  {
    number: 21,
    title: 'Equilibrium Index in Financial Ledger',
    fnName: 'findEquilibriumIndex',
    description: 'Given an array <code>entries</code> of integer credits/debits, find the smallest index <code>i</code> such that the sum of elements strictly to the left of <code>i</code> equals the sum of elements strictly to the right of <code>i</code>. Return <code>-1</code> if no such index exists.',
    constraints: ['1 <= entries.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'entries = [1, 7, 3, 6, 5, 6]', output: '3' },
      { title: 'Test Case 2', input: 'entries = [1, 2, 3]', output: '-1' },
      { title: 'Test Case 3', input: 'entries = [2, 1, -1]', output: '0' },
      { title: 'Test Case 4', input: 'entries = [0, 0, 0]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int findEquilibriumIndex(int[] entries) {
        long total = 0;
        for (int x : entries) total += x;
        long left = 0;
        for (int i = 0; i < entries.length; i++) {
            if (left == total - left - entries[i]) return i;
            left += entries[i];
        }
        return -1;
    }
}`,
    pythonSolution: `def findEquilibriumIndex(entries):
    total = sum(entries)
    left = 0
    for i, x in enumerate(entries):
        if left == total - left - x:
            return i
        left += x
    return -1`
  },
  {
    number: 22,
    title: 'Next Greater Temperature Reading',
    fnName: 'nextWarmerDays',
    description: 'Given daily temperature readings <code>temps</code>, return an array where index <code>i</code> contains how many days you must wait after day <code>i</code> to get a strictly warmer temperature. If no future day is warmer, put <code>0</code>.',
    constraints: ['1 <= temps.length <= 10^5', '30 <= temps[i] <= 120'],
    testCases: [
      { title: 'Test Case 1', input: 'temps = [73, 74, 75, 71, 69, 72, 76, 73]', output: '[1, 1, 4, 2, 1, 1, 0, 0]' },
      { title: 'Test Case 2', input: 'temps = [30, 40, 50, 60]', output: '[1, 1, 1, 0]' },
      { title: 'Test Case 3', input: 'temps = [90, 80, 70]', output: '[0, 0, 0]' },
      { title: 'Test Case 4', input: 'temps = [50]', output: '[0]' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int[] nextWarmerDays(int[] temps) {
        int n = temps.length;
        int[] res = new int[n];
        Deque<Integer> st = new ArrayDeque<>();
        for (int i = 0; i < n; i++) {
            while (!st.isEmpty() && temps[i] > temps[st.peek()]) {
                int idx = st.pop();
                res[idx] = i - idx;
            }
            st.push(i);
        }
        return res;
    }
}`,
    pythonSolution: `def nextWarmerDays(temps):
    res = [0] * len(temps)
    st = []
    for i, t in enumerate(temps):
        while st and t > temps[st[-1]]:
            idx = st.pop()
            res[idx] = i - idx
        st.append(i)
    return res`
  },
  {
    number: 23,
    title: 'Merge Overlapping Maintenance Windows',
    fnName: 'mergeMaintenanceWindows',
    description: 'Given a list of maintenance intervals <code>intervals</code> where each interval is <code>[start, end]</code>, merge all overlapping intervals and return the sorted non-overlapping intervals.',
    constraints: ['1 <= intervals.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'intervals = [[1, 3], [2, 6], [8, 10], [15, 18]]', output: '[[1, 6], [8, 10], [15, 18]]' },
      { title: 'Test Case 2', input: 'intervals = [[1, 4], [4, 5]]', output: '[[1, 5]]' },
      { title: 'Test Case 3', input: 'intervals = [[5, 10], [1, 3]]', output: '[[1, 3], [5, 10]]' },
      { title: 'Test Case 4', input: 'intervals = [[2, 9]]', output: '[[2, 9]]' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int[][] mergeMaintenanceWindows(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        List<int[]> merged = new ArrayList<>();
        for (int[] iv : intervals) {
            if (merged.isEmpty() || merged.get(merged.size() - 1)[1] < iv[0]) {
                merged.add(new int[]{iv[0], iv[1]});
            } else {
                merged.get(merged.size() - 1)[1] = Math.max(merged.get(merged.size() - 1)[1], iv[1]);
            }
        }
        return merged.toArray(new int[0][]);
    }
}`,
    pythonSolution: `def mergeMaintenanceWindows(intervals):
    intervals = sorted(intervals)
    merged = []
    for s, e in intervals:
        if not merged or merged[-1][1] < s:
            merged.append([s, e])
        else:
            if e > merged[-1][1]:
                merged[-1][1] = e
    return merged`
  },
  {
    number: 24,
    title: 'Subarray Sum Equal to Target Budget',
    fnName: 'countBudgetSubarrays',
    description: 'Given an integer array <code>expenses</code> and a target integer <code>k</code>, return the total number of contiguous subarrays whose sum equals <code>k</code>.',
    constraints: ['1 <= expenses.length <= 2 * 10^4', '-1000 <= expenses[i] <= 1000'],
    testCases: [
      { title: 'Test Case 1', input: 'expenses = [1, 1, 1], k = 2', output: '2' },
      { title: 'Test Case 2', input: 'expenses = [1, 2, 3], k = 3', output: '2' },
      { title: 'Test Case 3', input: 'expenses = [3, 4, -7, 1, 3, 3, 1, -4], k = 7', output: '4' },
      { title: 'Test Case 4', input: 'expenses = [5], k = 10', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countBudgetSubarrays(int[] expenses, int k) {
        Map<Integer, Integer> seen = new HashMap<>();
        seen.put(0, 1);
        int sum = 0, count = 0;
        for (int x : expenses) {
            sum += x;
            count += seen.getOrDefault(sum - k, 0);
            seen.put(sum, seen.getOrDefault(sum, 0) + 1);
        }
        return count;
    }
}`,
    pythonSolution: `def countBudgetSubarrays(expenses, k):
    seen = {0: 1}
    s = count = 0
    for x in expenses:
        s += x
        count += seen.get(s - k, 0)
        seen[s] = seen.get(s, 0) + 1
    return count`
  },
  {
    number: 25,
    title: 'Peak Element in Unimodal Signal',
    fnName: 'findSignalPeak',
    description: 'A radio signal strength array <code>nums</code> has no two adjacent equal elements. Return the index of any peak element (strictly greater than its neighbors). Assume <code>nums[-1] = nums[n] = -infinity</code>.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 2, 3, 1]', output: '2' },
      { title: 'Test Case 2', input: 'nums = [10, 20, 15, 2]', output: '1' },
      { title: 'Test Case 3', input: 'nums = [5]', output: '0' },
      { title: 'Test Case 4', input: 'nums = [1, 2, 3, 4, 5]', output: '4' }
    ],
    javaSolution: `public class Solution {
    public static int findSignalPeak(int[] nums) {
        int l = 0, r = nums.length - 1;
        while (l < r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] < nums[mid + 1]) l = mid + 1;
            else r = mid;
        }
        return l;
    }
}`,
    pythonSolution: `def findSignalPeak(nums):
    l, r = 0, len(nums) - 1
    while l < r:
        mid = (l + r) // 2
        if nums[mid] < nums[mid + 1]:
            l = mid + 1
        else:
            r = mid
    return l`
  },
  {
    number: 26,
    title: 'Connected Clusters in Server Grid',
    fnName: 'countServerClusters',
    description: 'Given a 2D binary grid <code>grid</code> where <code>1</code> represents an active server and <code>0</code> represents empty space, count the number of connected server clusters (connected horizontally or vertically).',
    constraints: ['1 <= R, C <= 200'],
    testCases: [
      { title: 'Test Case 1', input: 'grid = [[1, 1, 0, 0], [1, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]', output: '3' },
      { title: 'Test Case 2', input: 'grid = [[1, 1, 1], [0, 1, 0], [1, 1, 1]]', output: '1' },
      { title: 'Test Case 3', input: 'grid = [[0, 0], [0, 0]]', output: '0' },
      { title: 'Test Case 4', input: 'grid = [[1, 0, 1], [0, 1, 0], [1, 0, 1]]', output: '5' }
    ],
    javaSolution: `public class Solution {
    public static int countServerClusters(int[][] grid) {
        int r = grid.length, c = grid[0].length, count = 0;
        for (int i = 0; i < r; i++) {
            for (int j = 0; j < c; j++) {
                if (grid[i][j] == 1) {
                    count++;
                    dfs(grid, i, j, r, c);
                }
            }
        }
        return count;
    }
    private static void dfs(int[][] g, int i, int j, int r, int c) {
        if (i < 0 || j < 0 || i >= r || j >= c || g[i][j] != 1) return;
        g[i][j] = 0;
        dfs(g, i + 1, j, r, c);
        dfs(g, i - 1, j, r, c);
        dfs(g, i, j + 1, r, c);
        dfs(g, i, j - 1, r, c);
    }
}`,
    pythonSolution: `def countServerClusters(grid):
    r, c = len(grid), len(grid[0])
    g = [row[:] for row in grid]
    count = 0
    for i in range(r):
        for j in range(c):
            if g[i][j] == 1:
                count += 1
                stack = [(i, j)]
                g[i][j] = 0
                while stack:
                    x, y = stack.pop()
                    for nx, ny in ((x+1,y),(x-1,y),(x,y+1),(x,y-1)):
                        if 0 <= nx < r and 0 <= ny < c and g[nx][ny] == 1:
                            g[nx][ny] = 0
                            stack.append((nx, ny))
    return count`
  },
  {
    number: 27,
    title: 'Minimum Cost to Connect Fiber Nodes',
    fnName: 'minFiberMergeCost',
    description: 'Given an array <code>lengths</code> of fiber cables, connecting two cables of lengths <code>x</code> and <code>y</code> costs <code>x + y</code> and produces one cable of length <code>x + y</code>. Return the minimum total cost to connect all cables into one.',
    constraints: ['1 <= lengths.length <= 10^4', '1 <= lengths[i] <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'lengths = [4, 3, 2, 6]', output: '29' },
      { title: 'Test Case 2', input: 'lengths = [1, 2, 3]', output: '9' },
      { title: 'Test Case 3', input: 'lengths = [10]', output: '0' },
      { title: 'Test Case 4', input: 'lengths = [5, 5, 5, 5]', output: '40' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long minFiberMergeCost(int[] lengths) {
        PriorityQueue<Long> pq = new PriorityQueue<>();
        for (int l : lengths) pq.add((long) l);
        long cost = 0;
        while (pq.size() > 1) {
            long s = pq.poll() + pq.poll();
            cost += s;
            pq.add(s);
        }
        return cost;
    }
}`,
    pythonSolution: `def minFiberMergeCost(lengths):
    import heapq
    h = list(lengths)
    heapq.heapify(h)
    cost = 0
    while len(h) > 1:
        s = heapq.heappop(h) + heapq.heappop(h)
        cost += s
        heapq.heappush(h, s)
    return cost`
  },
  {
    number: 28,
    title: 'House Security Alarm Non-Adjacent Sum',
    fnName: 'maxNonAdjacentValue',
    description: 'A security audit selects non-adjacent nodes along a linear corridor <code>values</code> so no two neighboring nodes are triggered. Return the maximum sum obtainable.',
    constraints: ['1 <= values.length <= 10^5', '0 <= values[i] <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'values = [2, 7, 9, 3, 1]', output: '12' },
      { title: 'Test Case 2', input: 'values = [1, 2, 3, 1]', output: '4' },
      { title: 'Test Case 3', input: 'values = [10]', output: '10' },
      { title: 'Test Case 4', input: 'values = [5, 5, 10, 100, 10, 5]', output: '110' }
    ],
    javaSolution: `public class Solution {
    public static int maxNonAdjacentValue(int[] values) {
        int prev2 = 0, prev1 = 0;
        for (int v : values) {
            int cur = Math.max(prev1, prev2 + v);
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }
}`,
    pythonSolution: `def maxNonAdjacentValue(values):
    prev2 = prev1 = 0
    for v in values:
        prev2, prev1 = prev1, max(prev1, prev2 + v)
    return prev1`
  },
  {
    number: 29,
    title: 'Kth Largest SLA Latency',
    fnName: 'kthLargestLatency',
    description: 'Given an unsorted list of API latencies <code>latencies</code> (in ms) and an integer <code>k</code>, return the <code>k</code>-th largest latency (1-indexed).',
    constraints: ['1 <= k <= latencies.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'latencies = [3, 2, 1, 5, 6, 4], k = 2', output: '5' },
      { title: 'Test Case 2', input: 'latencies = [3, 2, 3, 1, 2, 4, 5, 5, 6], k = 4', output: '4' },
      { title: 'Test Case 3', input: 'latencies = [10], k = 1', output: '10' },
      { title: 'Test Case 4', input: 'latencies = [7, 7, 7], k = 2', output: '7' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int kthLargestLatency(int[] latencies, int k) {
        PriorityQueue<Integer> pq = new PriorityQueue<>();
        for (int x : latencies) {
            pq.add(x);
            if (pq.size() > k) pq.poll();
        }
        return pq.peek();
    }
}`,
    pythonSolution: `def kthLargestLatency(latencies, k):
    import heapq
    return heapq.nlargest(k, latencies)[-1]`
  },
  {
    number: 30,
    title: 'Grid Unique Delivery Paths with Obstacles',
    fnName: 'countDeliveryPaths',
    description: 'An automated warehouse bot moves from top-left <code>(0, 0)</code> to bottom-right <code>(R-1, C-1)</code> moving only right or down. Cells with <code>1</code> are blocked racks and <code>0</code> are open aisles. Return the number of unique valid paths.',
    constraints: ['1 <= R, C <= 50'],
    testCases: [
      { title: 'Test Case 1', input: 'grid = [[0, 0, 0], [0, 1, 0], [0, 0, 0]]', output: '2' },
      { title: 'Test Case 2', input: 'grid = [[0, 1], [0, 0]]', output: '1' },
      { title: 'Test Case 3', input: 'grid = [[1, 0], [0, 0]]', output: '0' },
      { title: 'Test Case 4', input: 'grid = [[0, 0], [0, 0]]', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static long countDeliveryPaths(int[][] grid) {
        int r = grid.length, c = grid[0].length;
        if (grid[0][0] == 1 || grid[r - 1][c - 1] == 1) return 0;
        long[] dp = new long[c];
        dp[0] = 1;
        for (int i = 0; i < r; i++) {
            for (int j = 0; j < c; j++) {
                if (grid[i][j] == 1) dp[j] = 0;
                else if (j > 0) dp[j] += dp[j - 1];
            }
        }
        return dp[c - 1];
    }
}`,
    pythonSolution: `def countDeliveryPaths(grid):
    r, c = len(grid), len(grid[0])
    if grid[0][0] == 1 or grid[-1][-1] == 1:
        return 0
    dp = [0] * c
    dp[0] = 1
    for i in range(r):
        for j in range(c):
            if grid[i][j] == 1:
                dp[j] = 0
            elif j > 0:
                dp[j] += dp[j - 1]
    return dp[-1]`
  }
];
