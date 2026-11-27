export const QUALCOMM_QUESTIONS = [
  {
    number: 1,
    title: 'Register Bitfield Mask Extract',
    fnName: 'extractBitField',
    description: 'In a Qualcomm Snapdragon SoC register <code>reg</code> (32-bit unsigned value), extract <code>len</code> bits starting from bit position <code>lsb</code> (0-indexed from LSB).',
    constraints: ['0 <= reg <= 2^31 - 1', '0 <= lsb < 31', '1 <= len <= 31 - lsb'],
    testCases: [
      { title: 'Test Case 1', input: 'reg = 214, lsb = 2, len = 4', output: '5' },
      { title: 'Test Case 2', input: 'reg = 255, lsb = 0, len = 8', output: '255' },
      { title: 'Test Case 3', input: 'reg = 16, lsb = 4, len = 1', output: '1' },
      { title: 'Test Case 4', input: 'reg = 0, lsb = 3, len = 5', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int extractBitField(int reg, int lsb, int len) {
        int mask = (1 << len) - 1;
        return (reg >> lsb) & mask;
    }
}`,
    pythonSolution: `def extractBitField(reg, lsb, len):
    return (reg >> lsb) & ((1 << len) - 1)`
  },
  {
    number: 2,
    title: 'Memory Alignment Upward Round',
    fnName: 'alignUpAddress',
    description: 'Given a memory allocation size <code>size</code> and power-of-2 alignment <code>align</code>, return the smallest multiple of <code>align</code> that is <code>&gt;= size</code>.',
    constraints: ['0 <= size <= 10^9', 'align is a power of 2'],
    testCases: [
      { title: 'Test Case 1', input: 'size = 19, align = 8', output: '24' },
      { title: 'Test Case 2', input: 'size = 16, align = 16', output: '16' },
      { title: 'Test Case 3', input: 'size = 0, align = 4', output: '0' },
      { title: 'Test Case 4', input: 'size = 1, align = 64', output: '64' }
    ],
    javaSolution: `public class Solution {
    public static long alignUpAddress(long size, long align) {
        return (size + align - 1) & ~(align - 1);
    }
}`,
    pythonSolution: `def alignUpAddress(size, align):
    return (size + align - 1) & ~(align - 1)`
  },
  {
    number: 3,
    title: 'Endianness 32-Bit Byte Swap',
    fnName: 'swapEndian32',
    description: 'Convert a 32-bit unsigned integer <code>x</code> from big-endian to little-endian by reversing its 4 bytes.',
    constraints: ['0 <= x <= 2^31 - 1'],
    testCases: [
      { title: 'Test Case 1', input: 'x = 16909060', output: '67305985' },
      { title: 'Test Case 2', input: 'x = 0', output: '0' },
      { title: 'Test Case 3', input: 'x = 1', output: '16777216' },
      { title: 'Test Case 4', input: 'x = 256', output: '65536' }
    ],
    javaSolution: `public class Solution {
    public static long swapEndian32(long x) {
        return ((x & 0xFF) << 24) | ((x & 0xFF00) << 8) | ((x >> 8) & 0xFF00) | ((x >> 24) & 0xFF);
    }
}`,
    pythonSolution: `def swapEndian32(x):
    return ((x & 0xFF) << 24) | ((x & 0xFF00) << 8) | ((x >> 8) & 0xFF00) | ((x >> 24) & 0xFF)`
  },
  {
    number: 4,
    title: 'DMA Ring Buffer Drop Counter',
    fnName: 'countDmaDrops',
    description: 'A modem DMA ring buffer has capacity <code>cap</code>. Events <code>events</code> either enqueue <code>+x</code> descriptors (dropping excess above <code>cap</code>) or free <code>-y</code> descriptors (clamped at 0). Return total dropped descriptors.',
    constraints: ['1 <= events.length <= 10^5', '1 <= cap <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'events = [6, 7, -3, 5], cap = 10', output: '5' },
      { title: 'Test Case 2', input: 'events = [5, -10, 5], cap = 5', output: '0' },
      { title: 'Test Case 3', input: 'events = [12], cap = 8', output: '4' },
      { title: 'Test Case 4', input: 'events = [-4, 2], cap = 2', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long countDmaDrops(int[] events, int cap) {
        long cur = 0, drop = 0;
        for (int e : events) {
            if (e > 0) { cur += e; if (cur > cap) { drop += cur - cap; cur = cap; } }
            else cur = Math.max(0, cur + e);
        }
        return drop;
    }
}`,
    pythonSolution: `def countDmaDrops(events, cap):
    cur = drop = 0
    for e in events:
        if e > 0:
            cur += e
            if cur > cap: drop += cur - cap; cur = cap
        else: cur = max(0, cur + e)
    return drop`
  },
  {
    number: 5,
    title: 'RTOS Priority Inversion Check',
    fnName: 'countPriorityInversions',
    description: 'A real-time scheduler executes tasks with priorities <code>prios</code> in order (higher = more urgent). Count how many times a task runs while a strictly higher-priority task appears later in <code>prios</code>.',
    constraints: ['1 <= prios.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'prios = [3, 1, 5, 2]', output: '2' },
      { title: 'Test Case 2', input: 'prios = [5, 4, 3, 2]', output: '0' },
      { title: 'Test Case 3', input: 'prios = [1, 2, 3]', output: '2' },
      { title: 'Test Case 4', input: 'prios = [10]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countPriorityInversions(int[] prios) {
        int n = prios.length, maxRight = Integer.MIN_VALUE, inv = 0;
        for (int i = n - 1; i >= 0; i--) {
            if (prios[i] < maxRight) inv++;
            maxRight = Math.max(maxRight, prios[i]);
        }
        return inv;
    }
}`,
    pythonSolution: `def countPriorityInversions(prios):
    mx = float('-inf'); inv = 0
    for p in reversed(prios):
        if p < mx: inv += 1
        mx = max(mx, p)
    return inv`
  },
  {
    number: 6,
    title: '5G Modem Bit-Error Parity',
    fnName: 'countCorruptedFrames',
    description: 'Each transmitted word in <code>frames</code> should have even parity (even number of 1-bits). Return how many words have odd parity (corrupted).',
    constraints: ['1 <= frames.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'frames = [1, 3, 7, 15, 8]', output: '3' },
      { title: 'Test Case 2', input: 'frames = [0, 3, 5]', output: '0' },
      { title: 'Test Case 3', input: 'frames = [2]', output: '1' },
      { title: 'Test Case 4', input: 'frames = [255]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countCorruptedFrames(int[] frames) {
        int bad = 0;
        for (int f : frames) if (Integer.bitCount(f) % 2 == 1) bad++;
        return bad;
    }
}`,
    pythonSolution: `def countCorruptedFrames(frames):
    return sum(1 for f in frames if f.bit_count() % 2 == 1)`
  },
  {
    number: 7,
    title: 'Leading Zero Count (CLZ) 16-Bit',
    fnName: 'clz16',
    description: 'Given a 16-bit unsigned integer <code>x</code> (<code>0 <= x <= 65535</code>), return the number of leading zero bits in its 16-bit binary representation.',
    constraints: ['0 <= x <= 65535'],
    testCases: [
      { title: 'Test Case 1', input: 'x = 1', output: '15' },
      { title: 'Test Case 2', input: 'x = 32768', output: '0' },
      { title: 'Test Case 3', input: 'x = 0', output: '16' },
      { title: 'Test Case 4', input: 'x = 255', output: '8' }
    ],
    javaSolution: `public class Solution {
    public static int clz16(int x) {
        if (x == 0) return 16;
        int cnt = 0;
        for (int b = 15; b >= 0; b--) {
            if ((x & (1 << b)) != 0) break;
            cnt++;
        }
        return cnt;
    }
}`,
    pythonSolution: `def clz16(x):
    return 16 if x == 0 else 16 - x.bit_length()`
  },
  {
    number: 8,
    title: 'Cache Line Conflict Misses',
    fnName: 'countDirectMappedMisses',
    description: 'Simulate a direct-mapped cache with <code>numLines</code> lines (initially empty, line index = <code>addr % numLines</code>) processing memory accesses <code>addrs</code>. Return total cache misses.',
    constraints: ['1 <= addrs.length <= 10^5', '1 <= numLines <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'addrs = [0, 4, 0, 4], numLines = 4', output: '4' },
      { title: 'Test Case 2', input: 'addrs = [0, 1, 0, 1], numLines = 4', output: '2' },
      { title: 'Test Case 3', input: 'addrs = [5, 5, 5], numLines = 2', output: '1' },
      { title: 'Test Case 4', input: 'addrs = [1, 2, 3], numLines = 1', output: '3' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countDirectMappedMisses(int[] addrs, int numLines) {
        int[] tag = new int[numLines];
        Arrays.fill(tag, -1);
        int misses = 0;
        for (int a : addrs) {
            int idx = ((a % numLines) + numLines) % numLines;
            if (tag[idx] != a) { misses++; tag[idx] = a; }
        }
        return misses;
    }
}`,
    pythonSolution: `def countDirectMappedMisses(addrs, numLines):
    tag = [-1] * numLines; misses = 0
    for a in addrs:
        idx = a % numLines
        if tag[idx] != a: misses += 1; tag[idx] = a
    return misses`
  },
  {
    number: 9,
    title: 'Interrupt Vector Highest Pending',
    fnName: 'highestPendingIrq',
    description: 'An interrupt controller has a 32-bit pending mask <code>pending</code> and enable mask <code>enabled</code> (higher bit index = higher priority). Return the highest-priority enabled pending IRQ bit index (0..30), or <code>-1</code> if none.',
    constraints: ['0 <= pending, enabled <= 2^31 - 1'],
    testCases: [
      { title: 'Test Case 1', input: 'pending = 26, enabled = 14', output: '3' },
      { title: 'Test Case 2', input: 'pending = 5, enabled = 2', output: '-1' },
      { title: 'Test Case 3', input: 'pending = 1, enabled = 1', output: '0' },
      { title: 'Test Case 4', input: 'pending = 0, enabled = 255', output: '-1' }
    ],
    javaSolution: `public class Solution {
    public static int highestPendingIrq(int pending, int enabled) {
        int active = pending & enabled;
        if (active == 0) return -1;
        return 31 - Integer.numberOfLeadingZeros(active);
    }
}`,
    pythonSolution: `def highestPendingIrq(pending, enabled):
    active = pending & enabled
    return active.bit_length() - 1 if active else -1`
  },
  {
    number: 10,
    title: 'DSP Sliding Window Energy Peak',
    fnName: 'maxSignalEnergy',
    description: 'Given signal amplitudes <code>sig</code> and window length <code>k</code>, return the maximum sum of squared amplitudes <code>sig[i]^2</code> over any contiguous window of length <code>k</code>.',
    constraints: ['1 <= k <= sig.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'sig = [1, -3, 2, 4, -1], k = 2', output: '20' },
      { title: 'Test Case 2', input: 'sig = [2, 2, 2], k = 3', output: '12' },
      { title: 'Test Case 3', input: 'sig = [-5], k = 1', output: '25' },
      { title: 'Test Case 4', input: 'sig = [0, 3, 0], k = 2', output: '9' }
    ],
    javaSolution: `public class Solution {
    public static long maxSignalEnergy(int[] sig, int k) {
        long cur = 0;
        for (int i = 0; i < k; i++) cur += (long) sig[i] * sig[i];
        long best = cur;
        for (int i = k; i < sig.length; i++) {
            cur += (long) sig[i] * sig[i] - (long) sig[i - k] * sig[i - k];
            best = Math.max(best, cur);
        }
        return best;
    }
}`,
    pythonSolution: `def maxSignalEnergy(sig, k):
    sq = [x * x for x in sig]
    cur = sum(sq[:k]); best = cur
    for i in range(k, len(sq)):
        cur += sq[i] - sq[i - k]; best = max(best, cur)
    return best`
  },
  {
    number: 11,
    title: 'Watchdog Timer Reset Count',
    fnName: 'countWatchdogReboots',
    description: 'A hardware watchdog triggers a reboot if the gap between consecutive kicks in sorted array <code>kicks</code> strictly exceeds <code>timeout</code>. Return total reboots.',
    constraints: ['1 <= kicks.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'kicks = [0, 5, 16, 20, 35], timeout = 10', output: '2' },
      { title: 'Test Case 2', input: 'kicks = [0, 10, 20], timeout = 10', output: '0' },
      { title: 'Test Case 3', input: 'kicks = [0, 11], timeout = 10', output: '1' },
      { title: 'Test Case 4', input: 'kicks = [5], timeout = 1', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countWatchdogReboots(int[] kicks, int timeout) {
        int reboots = 0;
        for (int i = 1; i < kicks.length; i++) if (kicks[i] - kicks[i - 1] > timeout) reboots++;
        return reboots;
    }
}`,
    pythonSolution: `def countWatchdogReboots(kicks, timeout):
    return sum(1 for i in range(1, len(kicks)) if kicks[i] - kicks[i - 1] > timeout)`
  },
  {
    number: 12,
    title: 'GPIO Pin Toggle Sequence',
    fnName: 'finalPinMask',
    description: 'Starting with all GPIO pins low (<code>0</code>), apply commands <code>cmds</code>: <code>+p</code> sets bit <code>p</code> high, <code>-p</code> clears bit <code>p</code>? Actually use integer array <code>ops</code> where <code>&gt;= 0</code> sets bit <code>op</code> and <code>&lt; 0</code> clears bit <code>~op</code> (i.e. <code>-op - 1</code>). Return final bitmask.',
    constraints: ['1 <= ops.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'ops = [0, 2, -1, 3]', output: '12' },
      { title: 'Test Case 2', input: 'ops = [1, 1, -2]', output: '0' },
      { title: 'Test Case 3', input: 'ops = [0, 1, 2]', output: '7' },
      { title: 'Test Case 4', input: 'ops = [-1]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int finalPinMask(int[] ops) {
        int mask = 0;
        for (int op : ops) {
            if (op >= 0) mask |= (1 << op);
            else mask &= ~(1 << (-op - 1));
        }
        return mask;
    }
}`,
    pythonSolution: `def finalPinMask(ops):
    m = 0
    for op in ops:
        if op >= 0: m |= (1 << op)
        else: m &= ~(1 << (-op - 1))
    return m`
  },
  {
    number: 13,
    title: 'RF Channel Interference Check',
    fnName: 'countCleanChannels',
    description: 'Given sorted allocated channel numbers <code>channels</code>, a channel is clean if neither <code>c - 1</code> nor <code>c + 1</code> is also allocated. Return how many channels are clean.',
    constraints: ['1 <= channels.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'channels = [1, 2, 5, 8, 9]', output: '1' },
      { title: 'Test Case 2', input: 'channels = [1, 3, 5, 7]', output: '4' },
      { title: 'Test Case 3', input: 'channels = [10, 11]', output: '0' },
      { title: 'Test Case 4', input: 'channels = [42]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countCleanChannels(int[] channels) {
        int n = channels.length, clean = 0;
        for (int i = 0; i < n; i++) {
            boolean adjL = (i > 0 && channels[i] - channels[i - 1] == 1);
            boolean adjR = (i + 1 < n && channels[i + 1] - channels[i] == 1);
            if (!adjL && !adjR) clean++;
        }
        return clean;
    }
}`,
    pythonSolution: `def countCleanChannels(channels):
    s = set(channels)
    return sum(1 for c in channels if (c - 1) not in s and (c + 1) not in s)`
  },
  {
    number: 14,
    title: 'Clock Domain Crossing Synchronizer',
    fnName: 'countRisingEdges',
    description: 'Given a sampled digital signal <code>bits</code> (0s and 1s), count how many rising edges (<code>0 -> 1</code> transitions) occur.',
    constraints: ['1 <= bits.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'bits = [0, 1, 1, 0, 1, 0]', output: '2' },
      { title: 'Test Case 2', input: 'bits = [1, 1, 1]', output: '0' },
      { title: 'Test Case 3', input: 'bits = [0, 0, 0]', output: '0' },
      { title: 'Test Case 4', input: 'bits = [0, 1, 0, 1]', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int countRisingEdges(int[] bits) {
        int edges = 0;
        for (int i = 1; i < bits.length; i++) if (bits[i - 1] == 0 && bits[i] == 1) edges++;
        return edges;
    }
}`,
    pythonSolution: `def countRisingEdges(bits):
    return sum(1 for i in range(1, len(bits)) if bits[i - 1] == 0 and bits[i] == 1)`
  },
  {
    number: 15,
    title: 'Heap Allocator Coalesced Blocks',
    fnName: 'maxMergedFreeBlock',
    description: 'Free memory segments are given as <code>[start, size]</code> in <code>segs</code>. Sort by <code>start</code> and merge adjacent segments where <code>start1 + size1 == start2</code>. Return the maximum merged block size.',
    constraints: ['1 <= segs.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'segs = [[0, 10], [10, 20], [50, 15]]', output: '30' },
      { title: 'Test Case 2', input: 'segs = [[0, 5], [10, 10]]', output: '10' },
      { title: 'Test Case 3', input: 'segs = [[100, 25]]', output: '25' },
      { title: 'Test Case 4', input: 'segs = [[10, 5], [0, 10]]', output: '15' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long maxMergedFreeBlock(int[][] segs) {
        Arrays.sort(segs, (a, b) -> Integer.compare(a[0], b[0]));
        long curEnd = segs[0][0] + segs[0][1], curSize = segs[0][1], best = curSize;
        for (int i = 1; i < segs.length; i++) {
            if (segs[i][0] == curEnd) {
                curEnd += segs[i][1]; curSize += segs[i][1];
            } else {
                curEnd = segs[i][0] + segs[i][1]; curSize = segs[i][1];
            }
            best = Math.max(best, curSize);
        }
        return best;
    }
}`,
    pythonSolution: `def maxMergedFreeBlock(segs):
    segs.sort()
    cur_end = segs[0][0] + segs[0][1]; cur_sz = segs[0][1]; best = cur_sz
    for st, sz in segs[1:]:
        if st == cur_end: cur_end += sz; cur_sz += sz
        else: cur_end = st + sz; cur_sz = sz
        best = max(best, cur_sz)
    return best`
  },
  {
    number: 16,
    title: 'Bitwise Hamming Weight Filter',
    fnName: 'countWithExactPopcount',
    description: 'Given integers <code>nums</code> and target bit count <code>k</code>, return how many integers have exactly <code>k</code> set bits.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [3, 5, 7, 6, 1], k = 2', output: '3' },
      { title: 'Test Case 2', input: 'nums = [0, 1, 2], k = 0', output: '1' },
      { title: 'Test Case 3', input: 'nums = [7, 15], k = 1', output: '0' },
      { title: 'Test Case 4', input: 'nums = [15], k = 4', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countWithExactPopcount(int[] nums, int k) {
        int cnt = 0;
        for (int x : nums) if (Integer.bitCount(x) == k) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countWithExactPopcount(nums, k):
    return sum(1 for x in nums if x.bit_count() == k)`
  },
  {
    number: 17,
    title: 'Packet Checksum 16-Bit Ones Complement',
    fnName: 'checksum16Bit',
    description: 'Sum all 16-bit words in <code>words</code>, fold any carry bits above 16 bits back into the lower 16 bits (<code>(sum &amp; 0xFFFF) + (sum &gt;&gt; 16)</code> until <code>&lt;= 0xFFFF</code>), and return bitwise NOT masked to 16 bits (<code>~sum &amp; 0xFFFF</code>).',
    constraints: ['1 <= words.length <= 10^4', '0 <= words[i] <= 65535'],
    testCases: [
      { title: 'Test Case 1', input: 'words = [0, 0]', output: '65535' },
      { title: 'Test Case 2', input: 'words = [65535]', output: '0' },
      { title: 'Test Case 3', input: 'words = [40000, 30000]', output: '61070' },
      { title: 'Test Case 4', input: 'words = [1, 2, 3]', output: '65529' }
    ],
    javaSolution: `public class Solution {
    public static int checksum16Bit(int[] words) {
        long s = 0;
        for (int w : words) s += w;
        while (s > 0xFFFF) s = (s & 0xFFFF) + (s >> 16);
        return (int) (~s & 0xFFFF);
    }
}`,
    pythonSolution: `def checksum16Bit(words):
    s = sum(words)
    while s > 0xFFFF:
        s = (s & 0xFFFF) + (s >> 16)
    return (~s) & 0xFFFF`
  },
  {
    number: 18,
    title: 'Pointer Stride Cache Prefetch',
    fnName: 'countStridedAccesses',
    description: 'Given array length <code>n</code>, start index <code>start</code>, and positive stride <code>stride</code>, return how many elements are visited when stepping <code>start, start + stride, ... &lt; n</code>.',
    constraints: ['1 <= n <= 10^9', '0 <= start < n', '1 <= stride <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 10, start = 2, stride = 3', output: '3' },
      { title: 'Test Case 2', input: 'n = 5, start = 0, stride = 1', output: '5' },
      { title: 'Test Case 3', input: 'n = 5, start = 4, stride = 10', output: '1' },
      { title: 'Test Case 4', input: 'n = 100, start = 0, stride = 25', output: '4' }
    ],
    javaSolution: `public class Solution {
    public static long countStridedAccesses(long n, long start, long stride) {
        return (n - 1 - start) / stride + 1;
    }
}`,
    pythonSolution: `def countStridedAccesses(n, start, stride):
    return (n - 1 - start) // stride + 1`
  },
  {
    number: 19,
    title: 'PWM Duty Cycle High Ticks',
    fnName: 'countPwmHighTicks',
    description: 'A PWM signal has period <code>period</code> and duty cycle <code>duty</code> (high for ticks <code>0..duty-1</code> in each cycle). Over total ticks <code>0..totalTicks-1</code>, return how many ticks the signal is high.',
    constraints: ['1 <= period <= 10^6', '0 <= duty <= period', '0 <= totalTicks <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'period = 10, duty = 4, totalTicks = 25', output: '12' },
      { title: 'Test Case 2', input: 'period = 10, duty = 3, totalTicks = 12', output: '5' },
      { title: 'Test Case 3', input: 'period = 5, duty = 0, totalTicks = 100', output: '0' },
      { title: 'Test Case 4', input: 'period = 8, duty = 8, totalTicks = 15', output: '15' }
    ],
    javaSolution: `public class Solution {
    public static long countPwmHighTicks(long period, long duty, long totalTicks) {
        long full = totalTicks / period, rem = totalTicks % period;
        return full * duty + Math.min(rem, duty);
    }
}`,
    pythonSolution: `def countPwmHighTicks(period, duty, totalTicks):
    full, rem = divmod(totalTicks, period)
    return full * duty + min(rem, duty)`
  },
  {
    number: 20,
    title: 'NPU Matrix Quantization Clamp',
    fnName: 'sumInt8Quantized',
    description: 'Clamp every element in <code>weights</code> into signed 8-bit range <code>[-128, 127]</code> and return the sum of clamped values.',
    constraints: ['1 <= weights.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'weights = [-200, 50, 300]', output: '49' },
      { title: 'Test Case 2', input: 'weights = [-128, 127]', output: '-1' },
      { title: 'Test Case 3', input: 'weights = [0, 0]', output: '0' },
      { title: 'Test Case 4', input: 'weights = [1000, -1000]', output: '-1' }
    ],
    javaSolution: `public class Solution {
    public static long sumInt8Quantized(int[] weights) {
        long s = 0;
        for (int w : weights) s += Math.max(-128, Math.min(127, w));
        return s;
    }
}`,
    pythonSolution: `def sumInt8Quantized(weights):
    return sum(max(-128, min(127, w)) for w in weights)`
  },
  {
    number: 21,
    title: 'State Machine Packet Frame Sync',
    fnName: 'countCompleteFrames',
    description: 'A UART stream <code>bytes</code> starts a frame on byte <code>0xAA</code> (170) and ends it on the next <code>0x55</code> (85). Count how many complete non-nested frames exist.',
    constraints: ['1 <= bytes.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'bytes = [170, 1, 2, 85, 9, 170, 85]', output: '2' },
      { title: 'Test Case 2', input: 'bytes = [85, 170, 1, 2]', output: '0' },
      { title: 'Test Case 3', input: 'bytes = [170, 170, 85]', output: '1' },
      { title: 'Test Case 4', input: 'bytes = [1, 2, 3]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countCompleteFrames(int[] bytes) {
        boolean inFrame = false; int cnt = 0;
        for (int b : bytes) {
            if (!inFrame && b == 170) inFrame = true;
            else if (inFrame && b == 85) { cnt++; inFrame = false; }
        }
        return cnt;
    }
}`,
    pythonSolution: `def countCompleteFrames(bytes):
    in_f = False; cnt = 0
    for b in bytes:
        if not in_f and b == 170: in_f = True
        elif in_f and b == 85: cnt += 1; in_f = False
    return cnt`
  },
  {
    number: 22,
    title: 'SoC Thermal Budget Throttling',
    fnName: 'maxPerformanceInBudget',
    description: 'Given chip tasks with power <code>power[i]</code> and performance <code>perf[i]</code>, and power cap <code>cap</code>, pick a subset of tasks to maximize total performance.',
    constraints: ['1 <= power.length <= 100', '0 <= cap <= 5000'],
    testCases: [
      { title: 'Test Case 1', input: 'power = [2, 3, 4], perf = [4, 5, 8], cap = 5', output: '9' },
      { title: 'Test Case 2', input: 'power = [10, 20], perf = [5, 10], cap = 5', output: '0' },
      { title: 'Test Case 3', input: 'power = [1, 2], perf = [10, 20], cap = 3', output: '30' },
      { title: 'Test Case 4', input: 'power = [5], perf = [7], cap = 5', output: '7' }
    ],
    javaSolution: `public class Solution {
    public static int maxPerformanceInBudget(int[] power, int[] perf, int cap) {
        int[] dp = new int[cap + 1];
        for (int i = 0; i < power.length; i++)
            for (int p = cap; p >= power[i]; p--) dp[p] = Math.max(dp[p], dp[p - power[i]] + perf[i]);
        return dp[cap];
    }
}`,
    pythonSolution: `def maxPerformanceInBudget(power, perf, cap):
    dp = [0] * (cap + 1)
    for pw, pf in zip(power, perf):
        for p in range(cap, pw - 1, -1):
            if dp[p - pw] + pf > dp[p]: dp[p] = dp[p - pw] + pf
    return dp[cap]`
  },
  {
    number: 23,
    title: 'Bitwise Gray-to-Binary Decode',
    fnName: 'grayToBinary',
    description: 'Convert a non-negative Gray-code integer <code>g</code> to its standard binary integer value.',
    constraints: ['0 <= g <= 2^30'],
    testCases: [
      { title: 'Test Case 1', input: 'g = 6', output: '4' },
      { title: 'Test Case 2', input: 'g = 0', output: '0' },
      { title: 'Test Case 3', input: 'g = 7', output: '5' },
      { title: 'Test Case 4', input: 'g = 1', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int grayToBinary(int g) {
        int res = 0;
        while (g > 0) { res ^= g; g >>= 1; }
        return res;
    }
}`,
    pythonSolution: `def grayToBinary(g):
    res = 0
    while g: res ^= g; g >>= 1
    return res`
  },
  {
    number: 24,
    title: 'PCIe Lane Bandwidth Aggregation',
    fnName: 'totalActiveBandwidth',
    description: 'A PCIe link has 16 lanes represented by 16-bit active mask <code>laneMask</code>, each active lane providing <code>gbpsPerLane</code> Gbps. Return total link bandwidth.',
    constraints: ['0 <= laneMask <= 65535'],
    testCases: [
      { title: 'Test Case 1', input: 'laneMask = 255, gbpsPerLane = 4', output: '32' },
      { title: 'Test Case 2', input: 'laneMask = 0, gbpsPerLane = 8', output: '0' },
      { title: 'Test Case 3', input: 'laneMask = 5, gbpsPerLane = 16', output: '32' },
      { title: 'Test Case 4', input: 'laneMask = 65535, gbpsPerLane = 2', output: '32' }
    ],
    javaSolution: `public class Solution {
    public static long totalActiveBandwidth(int laneMask, int gbpsPerLane) {
        return (long) Integer.bitCount(laneMask) * gbpsPerLane;
    }
}`,
    pythonSolution: `def totalActiveBandwidth(laneMask, gbpsPerLane):
    return laneMask.bit_count() * gbpsPerLane`
  },
  {
    number: 25,
    title: 'ADC Quantization Step Index',
    fnName: 'quantizeSampleLevels',
    description: 'An ADC maps voltage <code>v</code> to integer bucket <code>min(maxLevel, v // step)</code>. Return the sum of bucket indices across <code>voltages</code>.',
    constraints: ['1 <= voltages.length <= 10^5', '1 <= step <= 10^6'],
    testCases: [
      { title: 'Test Case 1', input: 'voltages = [10, 25, 100], step = 10, maxLevel = 7', output: '10' },
      { title: 'Test Case 2', input: 'voltages = [0, 5], step = 10, maxLevel = 3', output: '0' },
      { title: 'Test Case 3', input: 'voltages = [50], step = 10, maxLevel = 4', output: '4' },
      { title: 'Test Case 4', input: 'voltages = [9, 10], step = 10, maxLevel = 5', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static long quantizeSampleLevels(int[] voltages, int step, int maxLevel) {
        long s = 0;
        for (int v : voltages) s += Math.min(maxLevel, v / step);
        return s;
    }
}`,
    pythonSolution: `def quantizeSampleLevels(voltages, step, maxLevel):
    return sum(min(maxLevel, v // step) for v in voltages)`
  },
  {
    number: 26,
    title: 'Circular Buffer Wraparound Distance',
    fnName: 'ringUsedSlots',
    description: 'In a ring buffer of capacity <code>cap</code> with write index <code>head</code> and read index <code>tail</code> (<code>0 <= head, tail < cap</code>), return how many slots are currently occupied: <code>(head - tail + cap) % cap</code>.',
    constraints: ['1 <= cap <= 10^6'],
    testCases: [
      { title: 'Test Case 1', input: 'cap = 8, head = 2, tail = 6', output: '4' },
      { title: 'Test Case 2', input: 'cap = 8, head = 5, tail = 2', output: '3' },
      { title: 'Test Case 3', input: 'cap = 10, head = 4, tail = 4', output: '0' },
      { title: 'Test Case 4', input: 'cap = 5, head = 0, tail = 4', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int ringUsedSlots(int cap, int head, int tail) {
        return (head - tail + cap) % cap;
    }
}`,
    pythonSolution: `def ringUsedSlots(cap, head, tail):
    return (head - tail) % cap`
  },
  {
    number: 27,
    title: 'Audio Codec Frame Silence Trim',
    fnName: 'trimmedAudioLength',
    description: 'Given audio energy levels <code>energy</code>, trim leading and trailing frames strictly below <code>thresh</code>. Return remaining frame count.',
    constraints: ['1 <= energy.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'energy = [1, 2, 10, 5, 12, 0, 1], thresh = 5', output: '3' },
      { title: 'Test Case 2', input: 'energy = [1, 2, 3], thresh = 10', output: '0' },
      { title: 'Test Case 3', input: 'energy = [10, 1, 10], thresh = 5', output: '3' },
      { title: 'Test Case 4', input: 'energy = [5], thresh = 5', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int trimmedAudioLength(int[] energy, int thresh) {
        int l = 0, r = energy.length - 1;
        while (l <= r && energy[l] < thresh) l++;
        while (r >= l && energy[r] < thresh) r--;
        return Math.max(0, r - l + 1);
    }
}`,
    pythonSolution: `def trimmedAudioLength(energy, thresh):
    l, r = 0, len(energy) - 1
    while l <= r and energy[l] < thresh: l += 1
    while r >= l and energy[r] < thresh: r -= 1
    return max(0, r - l + 1)`
  },
  {
    number: 28,
    title: 'Bitwise Odd-Occurring Sensor ID',
    fnName: 'findSingleFaultySensor',
    description: 'Every sensor ID in <code>ids</code> appears twice except one faulty sensor ID that appears once. Return the faulty sensor ID.',
    constraints: ['1 <= ids.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'ids = [4, 1, 2, 1, 2]', output: '4' },
      { title: 'Test Case 2', input: 'ids = [99]', output: '99' },
      { title: 'Test Case 3', input: 'ids = [7, 3, 7]', output: '3' },
      { title: 'Test Case 4', input: 'ids = [10, 20, 30, 10, 20]', output: '30' }
    ],
    javaSolution: `public class Solution {
    public static int findSingleFaultySensor(int[] ids) {
        int x = 0;
        for (int id : ids) x ^= id;
        return x;
    }
}`,
    pythonSolution: `def findSingleFaultySensor(ids):
    x = 0
    for i in ids: x ^= i
    return x`
  },
  {
    number: 29,
    title: 'Modem Carrier Aggregation Peak',
    fnName: 'maxAggregatedBandwidth',
    description: 'A 5G modem can bond at most <code>k</code> contiguous frequency blocks from <code>bw</code>. Return the maximum total bandwidth.',
    constraints: ['1 <= k <= bw.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'bw = [20, 40, 10, 50, 30], k = 2', output: '80' },
      { title: 'Test Case 2', input: 'bw = [10, 10, 10], k = 3', output: '30' },
      { title: 'Test Case 3', input: 'bw = [5, 100, 5], k = 1', output: '100' },
      { title: 'Test Case 4', input: 'bw = [15, 25], k = 2', output: '40' }
    ],
    javaSolution: `public class Solution {
    public static long maxAggregatedBandwidth(int[] bw, int k) {
        long cur = 0;
        for (int i = 0; i < k; i++) cur += bw[i];
        long best = cur;
        for (int i = k; i < bw.length; i++) { cur += bw[i] - bw[i - k]; best = Math.max(best, cur); }
        return best;
    }
}`,
    pythonSolution: `def maxAggregatedBandwidth(bw, k):
    cur = sum(bw[:k]); best = cur
    for i in range(k, len(bw)):
        cur += bw[i] - bw[i - k]; best = max(best, cur)
    return best`
  },
  {
    number: 30,
    title: 'Instruction Pipeline Hazard Stalls',
    fnName: 'countPipelineStalls',
    description: 'Given register destination IDs <code>dest</code> of sequential instructions, if <code>dest[i] == dest[i-1]</code> (and <code>dest[i] != 0</code>), a 1-cycle stall occurs. Return total stalls.',
    constraints: ['1 <= dest.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'dest = [1, 1, 2, 0, 0, 3, 3]', output: '2' },
      { title: 'Test Case 2', input: 'dest = [1, 2, 3, 4]', output: '0' },
      { title: 'Test Case 3', input: 'dest = [0, 0, 0]', output: '0' },
      { title: 'Test Case 4', input: 'dest = [5, 5, 5]', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int countPipelineStalls(int[] dest) {
        int stalls = 0;
        for (int i = 1; i < dest.length; i++) if (dest[i] != 0 && dest[i] == dest[i - 1]) stalls++;
        return stalls;
    }
}`,
    pythonSolution: `def countPipelineStalls(dest):
    return sum(1 for i in range(1, len(dest)) if dest[i] != 0 and dest[i] == dest[i - 1])`
  },
  {
    number: 31,
    title: 'Bitwise Trailing Zeros Alignment',
    fnName: 'maxPowerOfTwoDivisor',
    description: 'Given a positive integer <code>addr</code>, return the largest power of 2 that divides <code>addr</code>.',
    constraints: ['1 <= addr <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'addr = 24', output: '8' },
      { title: 'Test Case 2', input: 'addr = 15', output: '1' },
      { title: 'Test Case 3', input: 'addr = 64', output: '64' },
      { title: 'Test Case 4', input: 'addr = 12', output: '4' }
    ],
    javaSolution: `public class Solution {
    public static int maxPowerOfTwoDivisor(int addr) {
        return addr & -addr;
    }
}`,
    pythonSolution: `def maxPowerOfTwoDivisor(addr):
    return addr & -addr`
  },
  {
    number: 32,
    title: 'Sensor Fusion Outlier Count',
    fnName: 'countSensorOutliers',
    description: 'Given integer readings <code>vals</code>, count how many differ from the integer mean <code>sum(vals) // len(vals)</code> by strictly more than <code>tol</code>.',
    constraints: ['1 <= vals.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'vals = [10, 10, 10, 50], tol = 5', output: '4' },
      { title: 'Test Case 2', input: 'vals = [10, 12, 11], tol = 5', output: '0' },
      { title: 'Test Case 3', input: 'vals = [100], tol = 0', output: '0' },
      { title: 'Test Case 4', input: 'vals = [0, 20], tol = 10', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countSensorOutliers(int[] vals, int tol) {
        long sum = 0; for (int v : vals) sum += v;
        long mean = sum / vals.length;
        int cnt = 0;
        for (int v : vals) if (Math.abs(v - mean) > tol) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countSensorOutliers(vals, tol):
    mean = sum(vals) // len(vals)
    return sum(1 for v in vals if abs(v - mean) > tol)`
  },
  {
    number: 33,
    title: 'Radio Baseband Subframe Slots',
    fnName: 'countDownlinkSlots',
    description: 'A TDD frame pattern string <code>pat</code> uses <code>\'D\'</code> (downlink), <code>\'U\'</code> (uplink), and <code>\'S\'</code> (special). Repeated over <code>n</code> total slots, return total <code>\'D\'</code> slots.',
    constraints: ['1 <= pat.length <= 100', '0 <= n <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'pat = "DDDUU", n = 12', output: '8' },
      { title: 'Test Case 2', input: 'pat = "UUU", n = 10', output: '0' },
      { title: 'Test Case 3', input: 'pat = "DSU", n = 0', output: '0' },
      { title: 'Test Case 4', input: 'pat = "D", n = 50', output: '50' }
    ],
    javaSolution: `public class Solution {
    public static long countDownlinkSlots(String pat, long n) {
        int L = pat.length();
        long dPer = 0;
        for (int i = 0; i < L; i++) if (pat.charAt(i) == 'D') dPer++;
        long full = n / L, rem = n % L;
        long ans = full * dPer;
        for (int i = 0; i < rem; i++) if (pat.charAt(i) == 'D') ans++;
        return ans;
    }
}`,
    pythonSolution: `def countDownlinkSlots(pat, n):
    L = len(pat)
    full, rem = divmod(n, L)
    return full * pat.count('D') + pat[:rem].count('D')`
  },
  {
    number: 34,
    title: 'SPI Bus Chip-Select Contention',
    fnName: 'countBusConflicts',
    description: 'Given sorted SPI transfer intervals <code>[start, end)</code> in <code>transfers</code>, count how many transfers start strictly before the previous transfer finishes.',
    constraints: ['1 <= transfers.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'transfers = [[0, 5], [3, 8], [8, 10], [9, 12]]', output: '2' },
      { title: 'Test Case 2', input: 'transfers = [[0, 2], [2, 4], [4, 6]]', output: '0' },
      { title: 'Test Case 3', input: 'transfers = [[1, 10]]', output: '0' },
      { title: 'Test Case 4', input: 'transfers = [[0, 5], [1, 2], [3, 4]]', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int countBusConflicts(int[][] transfers) {
        int maxEnd = transfers[0][1], bad = 0;
        for (int i = 1; i < transfers.length; i++) {
            if (transfers[i][0] < maxEnd) bad++;
            maxEnd = Math.max(maxEnd, transfers[i][1]);
        }
        return bad;
    }
}`,
    pythonSolution: `def countBusConflicts(transfers):
    max_end = transfers[0][1]; bad = 0
    for s, e in transfers[1:]:
        if s < max_end: bad += 1
        max_end = max(max_end, e)
    return bad`
  },
  {
    number: 35,
    title: 'SIMD Vector Dot Product',
    fnName: 'vectorDotProduct',
    description: 'Compute the dot product <code>sum(a[i] * b[i])</code> of two integer vectors <code>a</code> and <code>b</code>.',
    constraints: ['1 <= a.length == b.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'a = [1, 2, 3], b = [4, 5, 6]', output: '32' },
      { title: 'Test Case 2', input: 'a = [-1, 2], b = [3, -4]', output: '-11' },
      { title: 'Test Case 3', input: 'a = [0, 0], b = [9, 9]', output: '0' },
      { title: 'Test Case 4', input: 'a = [7], b = [8]', output: '56' }
    ],
    javaSolution: `public class Solution {
    public static long vectorDotProduct(int[] a, int[] b) {
        long s = 0;
        for (int i = 0; i < a.length; i++) s += (long) a[i] * b[i];
        return s;
    }
}`,
    pythonSolution: `def vectorDotProduct(a, b):
    return sum(x * y for x, y in zip(a, b))`
  },
  {
    number: 36,
    title: 'Firmware Version Rollback Guard',
    fnName: 'countRollbackAttempts',
    description: 'Given attempted firmware version numbers <code>versions</code> (first version is installed), an update is rejected as a rollback if <code>versions[i] < maxInstalled</code>. Return total rejected updates.',
    constraints: ['1 <= versions.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'versions = [10, 12, 11, 15, 14]', output: '2' },
      { title: 'Test Case 2', input: 'versions = [1, 2, 3]', output: '0' },
      { title: 'Test Case 3', input: 'versions = [5, 4, 3, 2]', output: '3' },
      { title: 'Test Case 4', input: 'versions = [10, 10]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countRollbackAttempts(int[] versions) {
        int mx = versions[0], bad = 0;
        for (int i = 1; i < versions.length; i++) {
            if (versions[i] < mx) bad++;
            else mx = versions[i];
        }
        return bad;
    }
}`,
    pythonSolution: `def countRollbackAttempts(versions):
    mx = versions[0]; bad = 0
    for v in versions[1:]:
        if v < mx: bad += 1
        else: mx = v
    return bad`
  },
  {
    number: 37,
    title: 'Bitwise Nibble Swap Array',
    fnName: 'swapByteNibblesSum',
    description: 'For each byte <code>b</code> in <code>bytes</code> (0..255), swap its upper and lower 4-bit nibbles <code>((b &amp; 0xF) &lt;&lt; 4) | (b &gt;&gt; 4)</code>. Return the sum of transformed bytes.',
    constraints: ['1 <= bytes.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'bytes = [1, 16]', output: '17' },
      { title: 'Test Case 2', input: 'bytes = [255]', output: '255' },
      { title: 'Test Case 3', input: 'bytes = [0]', output: '0' },
      { title: 'Test Case 4', input: 'bytes = [18]', output: '33' }
    ],
    javaSolution: `public class Solution {
    public static long swapByteNibblesSum(int[] bytes) {
        long s = 0;
        for (int b : bytes) s += ((b & 0xF) << 4) | (b >> 4);
        return s;
    }
}`,
    pythonSolution: `def swapByteNibblesSum(bytes):
    return sum(((b & 0xF) << 4) | (b >> 4) for b in bytes)`
  },
  {
    number: 38,
    title: 'Core Affinity Load Balance',
    fnName: 'minImbalanceTwoClusters',
    description: 'Given thread CPU weights <code>weights</code>, split threads greedily in order onto 2 clusters (assigning each to the lighter cluster). Return final absolute difference between the two clusters.',
    constraints: ['1 <= weights.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'weights = [10, 7, 5, 4]', output: '2' },
      { title: 'Test Case 2', input: 'weights = [5, 5]', output: '0' },
      { title: 'Test Case 3', input: 'weights = [8]', output: '8' },
      { title: 'Test Case 4', input: 'weights = [3, 3, 3]', output: '3' }
    ],
    javaSolution: `public class Solution {
    public static long minImbalanceTwoClusters(int[] weights) {
        long a = 0, b = 0;
        for (int w : weights) { if (a <= b) a += w; else b += w; }
        return Math.abs(a - b);
    }
}`,
    pythonSolution: `def minImbalanceTwoClusters(weights):
    a = b = 0
    for w in weights:
        if a <= b: a += w
        else: b += w
    return abs(a - b)`
  },
  {
    number: 39,
    title: 'Bluetooth Packet Retry Count',
    fnName: 'totalTransmissions',
    description: 'Each packet in <code>retries</code> needed <code>retries[i]</code> retransmissions in addition to its 1 initial transmission. Return total transmissions across all packets.',
    constraints: ['1 <= retries.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'retries = [0, 2, 1]', output: '6' },
      { title: 'Test Case 2', input: 'retries = [0, 0, 0]', output: '3' },
      { title: 'Test Case 3', input: 'retries = [5]', output: '6' },
      { title: 'Test Case 4', input: 'retries = [1, 1]', output: '4' }
    ],
    javaSolution: `public class Solution {
    public static long totalTransmissions(int[] retries) {
        long s = retries.length;
        for (int r : retries) s += r;
        return s;
    }
}`,
    pythonSolution: `def totalTransmissions(retries):
    return len(retries) + sum(retries)`
  },
  {
    number: 40,
    title: 'SoC Thermal Sensor Max Delta',
    fnName: 'maxStepTempJump',
    description: 'Given consecutive temperature readings <code>temps</code>, return the maximum absolute change <code>|temps[i] - temps[i-1]|</code> (<code>0</code> if fewer than 2 readings).',
    constraints: ['1 <= temps.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'temps = [40, 45, 38, 52]', output: '14' },
      { title: 'Test Case 2', input: 'temps = [30]', output: '0' },
      { title: 'Test Case 3', input: 'temps = [50, 50, 50]', output: '0' },
      { title: 'Test Case 4', input: 'temps = [10, 25]', output: '15' }
    ],
    javaSolution: `public class Solution {
    public static int maxStepTempJump(int[] temps) {
        int best = 0;
        for (int i = 1; i < temps.length; i++) best = Math.max(best, Math.abs(temps[i] - temps[i - 1]));
        return best;
    }
}`,
    pythonSolution: `def maxStepTempJump(temps):
    return max((abs(temps[i] - temps[i - 1]) for i in range(1, len(temps))), default=0)`
  },
  {
    number: 41,
    title: 'Bitwise Parity Check Word',
    fnName: 'appendEvenParityBit',
    description: 'Given an 8-bit data byte <code>b</code> (0..255), return <code>(b &lt;&lt; 1) | parity</code> where <code>parity</code> is <code>1</code> if <code>b</code> has odd number of 1-bits else <code>0</code>.',
    constraints: ['0 <= b <= 255'],
    testCases: [
      { title: 'Test Case 1', input: 'b = 5', output: '10' },
      { title: 'Test Case 2', input: 'b = 7', output: '15' },
      { title: 'Test Case 3', input: 'b = 0', output: '0' },
      { title: 'Test Case 4', input: 'b = 1', output: '3' }
    ],
    javaSolution: `public class Solution {
    public static int appendEvenParityBit(int b) {
        return (b << 1) | (Integer.bitCount(b) & 1);
    }
}`,
    pythonSolution: `def appendEvenParityBit(b):
    return (b << 1) | (b.bit_count() & 1)`
  },
  {
    number: 42,
    title: 'Memory Pool Fragmentation Count',
    fnName: 'countFreeFragments',
    description: 'Given a binary memory map <code>mem</code> (<code>0</code> = free, <code>1</code> = allocated), count how many maximal contiguous blocks of free (<code>0</code>) cells exist.',
    constraints: ['1 <= mem.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'mem = [0, 0, 1, 0, 1, 0, 0]', output: '3' },
      { title: 'Test Case 2', input: 'mem = [1, 1, 1]', output: '0' },
      { title: 'Test Case 3', input: 'mem = [0, 0, 0]', output: '1' },
      { title: 'Test Case 4', input: 'mem = [1, 0, 1]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countFreeFragments(int[] mem) {
        int cnt = 0;
        for (int i = 0; i < mem.length; i++) {
            if (mem[i] == 0 && (i == 0 || mem[i - 1] == 1)) cnt++;
        }
        return cnt;
    }
}`,
    pythonSolution: `def countFreeFragments(mem):
    return sum(1 for i, v in enumerate(mem) if v == 0 and (i == 0 or mem[i - 1] == 1))`
  },
  {
    number: 43,
    title: 'L2 Cache Tag Match Hits',
    fnName: 'countTagHits',
    description: 'Given a cache set of tags <code>tags</code> and lookup sequence <code>queries</code>, return how many queries hit a tag in <code>tags</code>.',
    constraints: ['1 <= tags.length, queries.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'tags = [10, 20, 30], queries = [20, 40, 10, 20]', output: '3' },
      { title: 'Test Case 2', input: 'tags = [1, 2], queries = [3, 4]', output: '0' },
      { title: 'Test Case 3', input: 'tags = [5], queries = [5]', output: '1' },
      { title: 'Test Case 4', input: 'tags = [7, 8], queries = [8, 7]', output: '2' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countTagHits(int[] tags, int[] queries) {
        Set<Integer> s = new HashSet<>();
        for (int t : tags) s.add(t);
        int hits = 0;
        for (int q : queries) if (s.contains(q)) hits++;
        return hits;
    }
}`,
    pythonSolution: `def countTagHits(tags, queries):
    s = set(tags)
    return sum(1 for q in queries if q in s)`
  },
  {
    number: 44,
    title: 'PLL Frequency Divider Steps',
    fnName: 'countHalvingSteps',
    description: 'Starting from frequency <code>f</code>, a divider halves <code>f</code> (<code>f //= 2</code>) each step until <code>f <= target</code>. Return number of steps.',
    constraints: ['1 <= target <= f <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'f = 100, target = 20', output: '3' },
      { title: 'Test Case 2', input: 'f = 16, target = 16', output: '0' },
      { title: 'Test Case 3', input: 'f = 32, target = 1', output: '5' },
      { title: 'Test Case 4', input: 'f = 9, target = 4', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countHalvingSteps(long f, long target) {
        int steps = 0;
        while (f > target) { f /= 2; steps++; }
        return steps;
    }
}`,
    pythonSolution: `def countHalvingSteps(f, target):
    steps = 0
    while f > target: f //= 2; steps += 1
    return steps`
  },
  {
    number: 45,
    title: 'RTOS Tick Deadline Misses',
    fnName: 'countDeadlineMisses',
    description: 'Periodic tasks have execution times <code>exec</code> and deadlines <code>dead</code>, executed sequentially from <code>t = 0</code> in the given order. Count how many tasks finish strictly after their deadline.',
    constraints: ['1 <= exec.length == dead.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'exec = [3, 4, 2], dead = [3, 6, 9]', output: '1' },
      { title: 'Test Case 2', input: 'exec = [2, 2], dead = [5, 5]', output: '0' },
      { title: 'Test Case 3', input: 'exec = [5, 5], dead = [4, 9]', output: '2' },
      { title: 'Test Case 4', input: 'exec = [1], dead = [1]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countDeadlineMisses(int[] exec, int[] dead) {
        long t = 0; int miss = 0;
        for (int i = 0; i < exec.length; i++) {
            t += exec[i];
            if (t > dead[i]) miss++;
        }
        return miss;
    }
}`,
    pythonSolution: `def countDeadlineMisses(exec, dead):
    t = miss = 0
    for e, d in zip(exec, dead):
        t += e
        if t > d: miss += 1
    return miss`
  },
  {
    number: 46,
    title: 'Bitmask Set-Bit Range Check',
    fnName: 'allBitsSetInRange',
    description: 'Return <code>true</code> if bits <code>l..r</code> (inclusive, 0-indexed) are ALL <code>1</code> in integer <code>x</code>, else <code>false</code>.',
    constraints: ['0 <= l <= r <= 30', '0 <= x <= 2^31 - 1'],
    testCases: [
      { title: 'Test Case 1', input: 'x = 14, l = 1, r = 3', output: 'true' },
      { title: 'Test Case 2', input: 'x = 10, l = 1, r = 3', output: 'false' },
      { title: 'Test Case 3', input: 'x = 1, l = 0, r = 0', output: 'true' },
      { title: 'Test Case 4', input: 'x = 0, l = 0, r = 2', output: 'false' }
    ],
    javaSolution: `public class Solution {
    public static boolean allBitsSetInRange(int x, int l, int r) {
        int mask = ((1 << (r - l + 1)) - 1) << l;
        return (x & mask) == mask;
    }
}`,
    pythonSolution: `def allBitsSetInRange(x, l, r):
    mask = ((1 << (r - l + 1)) - 1) << l
    return (x & mask) == mask`
  },
  {
    number: 47,
    title: 'Modem Signal-to-Noise Quantile',
    fnName: 'countAboveSnrFloor',
    description: 'Given SNR readings <code>snr</code>, return how many readings are <code>&gt;= minSnr</code>.',
    constraints: ['1 <= snr.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'snr = [12, 18, 5, 25], minSnr = 15', output: '2' },
      { title: 'Test Case 2', input: 'snr = [1, 2], minSnr = 10', output: '0' },
      { title: 'Test Case 3', input: 'snr = [20], minSnr = 20', output: '1' },
      { title: 'Test Case 4', input: 'snr = [-5, 0, 5], minSnr = 0', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int countAboveSnrFloor(int[] snr, int minSnr) {
        int cnt = 0;
        for (int s : snr) if (s >= minSnr) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countAboveSnrFloor(snr, minSnr):
    return sum(1 for s in snr if s >= minSnr)`
  },
  {
    number: 48,
    title: 'Voltage Rail Dropout Duration',
    fnName: 'longestVoltageBrownout',
    description: 'Given voltage samples <code>mv</code> (in millivolts), return the longest contiguous run of samples strictly below <code>minMv</code>.',
    constraints: ['1 <= mv.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'mv = [1100, 950, 920, 1050, 900], minMv = 1000', output: '2' },
      { title: 'Test Case 2', input: 'mv = [1000, 1200], minMv = 1000', output: '0' },
      { title: 'Test Case 3', input: 'mv = [800, 800, 800], minMv = 900', output: '3' },
      { title: 'Test Case 4', input: 'mv = [500], minMv = 600', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int longestVoltageBrownout(int[] mv, int minMv) {
        int cur = 0, best = 0;
        for (int v : mv) {
            cur = (v < minMv) ? cur + 1 : 0;
            best = Math.max(best, cur);
        }
        return best;
    }
}`,
    pythonSolution: `def longestVoltageBrownout(mv, minMv):
    cur = best = 0
    for v in mv:
        cur = cur + 1 if v < minMv else 0
        best = max(best, cur)
    return best`
  },
  {
    number: 49,
    title: 'DSP Filter Tap Weighted Sum',
    fnName: 'firFilterOutputAt',
    description: 'Given input signal <code>x</code> and filter coefficients <code>h</code> (same length <code>k</code>), compute the reversed dot product <code>sum(x[i] * h[k - 1 - i])</code>.',
    constraints: ['1 <= x.length == h.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'x = [1, 2, 3], h = [10, 20, 30]', output: '100' },
      { title: 'Test Case 2', input: 'x = [5], h = [4]', output: '20' },
      { title: 'Test Case 3', input: 'x = [1, 0, 1], h = [2, 3, 4]', output: '6' },
      { title: 'Test Case 4', input: 'x = [0, 0], h = [9, 9]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long firFilterOutputAt(int[] x, int[] h) {
        int k = x.length; long s = 0;
        for (int i = 0; i < k; i++) s += (long) x[i] * h[k - 1 - i];
        return s;
    }
}`,
    pythonSolution: `def firFilterOutputAt(x, h):
    return sum(a * b for a, b in zip(x, reversed(h)))`
  },
  {
    number: 50,
    title: 'SoC Bus Arbitration Round-Robin',
    fnName: 'lastMasterServed',
    description: '<code>n</code> bus masters (<code>0..n-1</code>) have pending bursts <code>bursts</code>. A round-robin arbiter grants 1 burst per turn in cyclic order <code>0, 1, ..., n-1, 0, ...</code> skipping masters with 0 remaining bursts. Return the ID of the master that finishes LAST.',
    constraints: ['1 <= bursts.length <= 10^4', '1 <= bursts[i] <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'bursts = [3, 1, 3]', output: '2' },
      { title: 'Test Case 2', input: 'bursts = [5, 2, 1]', output: '0' },
      { title: 'Test Case 3', input: 'bursts = [4]', output: '0' },
      { title: 'Test Case 4', input: 'bursts = [2, 2]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int lastMasterServed(int[] bursts) {
        int mx = 0, ans = 0;
        for (int i = 0; i < bursts.length; i++) {
            if (bursts[i] >= mx) { mx = bursts[i]; ans = i; }
        }
        return ans;
    }
}`,
    pythonSolution: `def lastMasterServed(bursts):
    mx = max(bursts)
    for i in range(len(bursts) - 1, -1, -1):
        if bursts[i] == mx: return i
    return 0`
  }
];
