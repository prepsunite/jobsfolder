export const TATA_ELXSI_QUESTIONS = [
  {
    number: 1,
    title: 'DSP Signal Zero-Crossing Counter',
    fnName: 'countZeroCrossings',
    description: 'In Tata Elxsi audio/video DSP, given non-zero signal samples <code>sig</code>, count how many times adjacent samples change sign.',
    constraints: ['1 <= sig.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'sig = [1, -2, -3, 4, -5]', output: '3' },
      { title: 'Test Case 2', input: 'sig = [2, 3, 4]', output: '0' },
      { title: 'Test Case 3', input: 'sig = [-1, 1]', output: '1' },
      { title: 'Test Case 4', input: 'sig = [5]', output: '0' }
    ],
    javaSolution: `public class Solution { public static int countZeroCrossings(int[] sig) { int c = 0; for (int i = 1; i < sig.length; i++) if ((sig[i] > 0) != (sig[i - 1] > 0)) c++; return c; } }`,
    pythonSolution: `def countZeroCrossings(sig): return sum(1 for i in range(1, len(sig)) if (sig[i] > 0) != (sig[i - 1] > 0))`
  },
  {
    number: 2,
    title: 'Video Frame Buffer Drop Count',
    fnName: 'countDroppedFrames',
    description: 'A decoder receives frames at timestamps <code>times</code>. If <code>times[i] - last >= frameMs</code>, frame is displayed and <code>last = times[i]</code>; else dropped (frame 0 is always displayed). Return total dropped frames.',
    constraints: ['1 <= times.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'times = [0, 10, 33, 40, 66], frameMs = 33', output: '2' },
      { title: 'Test Case 2', input: 'times = [0, 50, 100], frameMs = 33', output: '0' },
      { title: 'Test Case 3', input: 'times = [0, 1, 2], frameMs = 10', output: '2' },
      { title: 'Test Case 4', input: 'times = [10], frameMs = 33', output: '0' }
    ],
    javaSolution: `public class Solution { public static int countDroppedFrames(int[] times, int frameMs) { int last = times[0], drop = 0; for (int i = 1; i < times.length; i++) { if (times[i] - last >= frameMs) last = times[i]; else drop++; } return drop; } }`,
    pythonSolution: `def countDroppedFrames(times, frameMs):
    last, drop = times[0], 0
    for t in times[1:]:
        if t - last >= frameMs: last = t
        else: drop += 1
    return drop`
  },
  {
    number: 3,
    title: 'Image Matrix Threshold Binarization',
    fnName: 'countForegroundPixels',
    description: 'Given grayscale matrix <code>img</code> and threshold <code>T</code>, count pixels with <code>img[r][c] >= T</code>.',
    constraints: ['1 <= img.length, img[0].length <= 200'],
    testCases: [
      { title: 'Test Case 1', input: 'img = [[50, 200], [128, 10]], T = 128', output: '2' },
      { title: 'Test Case 2', input: 'img = [[0, 0]], T = 1', output: '0' },
      { title: 'Test Case 3', input: 'img = [[255]], T = 255', output: '1' },
      { title: 'Test Case 4', input: 'img = [[100, 100], [100, 100]], T = 50', output: '4' }
    ],
    javaSolution: `public class Solution { public static int countForegroundPixels(int[][] img, int T) { int cnt = 0; for (int[] r : img) for (int p : r) if (p >= T) cnt++; return cnt; } }`,
    pythonSolution: `def countForegroundPixels(img, T): return sum(1 for r in img for p in r if p >= T)`
  },
  {
    number: 4,
    title: 'Bitwise GPIO Mask Set Count',
    fnName: 'countEnabledGpios',
    description: 'Return the number of set bits in integer <code>mask</code>.',
    constraints: ['0 <= mask <= 2^31 - 1'],
    testCases: [
      { title: 'Test Case 1', input: 'mask = 13', output: '3' },
      { title: 'Test Case 2', input: 'mask = 0', output: '0' },
      { title: 'Test Case 3', input: 'mask = 255', output: '8' },
      { title: 'Test Case 4', input: 'mask = 16', output: '1' }
    ],
    javaSolution: `public class Solution { public static int countEnabledGpios(int mask) { return Integer.bitCount(mask); } }`,
    pythonSolution: `def countEnabledGpios(mask): return mask.bit_count()`
  },
  {
    number: 5,
    title: 'Embedded UART Parity Check',
    fnName: 'countValidUartBytes',
    description: 'A byte is valid if it has an even number of 1-bits. Count valid bytes in <code>bytes</code>.',
    constraints: ['1 <= bytes.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'bytes = [0, 3, 5, 7]', output: '3' },
      { title: 'Test Case 2', input: 'bytes = [1, 2, 4]', output: '0' },
      { title: 'Test Case 3', input: 'bytes = [15]', output: '1' },
      { title: 'Test Case 4', input: 'bytes = [6]', output: '1' }
    ],
    javaSolution: `public class Solution { public static int countValidUartBytes(int[] bytes) { int c = 0; for (int b : bytes) if (Integer.bitCount(b) % 2 == 0) c++; return c; } }`,
    pythonSolution: `def countValidUartBytes(bytes): return sum(1 for b in bytes if b.bit_count() % 2 == 0)`
  },
  {
    number: 6,
    title: '3x3 Box Blur Center Value',
    fnName: 'boxBlurCenterFloor',
    description: 'Given a <code>3 x 3</code> grayscale patch <code>patch</code>, return the integer floor average of all 9 pixels.',
    constraints: ['patch.length == 3', 'patch[0].length == 3'],
    testCases: [
      { title: 'Test Case 1', input: 'patch = [[10, 20, 30], [40, 50, 60], [70, 80, 90]]', output: '50' },
      { title: 'Test Case 2', input: 'patch = [[1, 1, 1], [1, 1, 1], [1, 1, 1]]', output: '1' },
      { title: 'Test Case 3', input: 'patch = [[0, 0, 0], [0, 8, 0], [0, 0, 0]]', output: '0' },
      { title: 'Test Case 4', input: 'patch = [[9, 9, 9], [9, 9, 9], [9, 9, 9]]', output: '9' }
    ],
    javaSolution: `public class Solution { public static int boxBlurCenterFloor(int[][] patch) { int s = 0; for (int[] r : patch) for (int v : r) s += v; return s / 9; } }`,
    pythonSolution: `def boxBlurCenterFloor(patch): return sum(v for r in patch for v in r) // 9`
  },
  {
    number: 7,
    title: 'Audio PCM Clipping Count',
    fnName: 'countClippedPcm',
    description: 'Count audio samples in <code>pcm</code> with <code>|pcm[i]| > maxAmp</code>.',
    constraints: ['1 <= pcm.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'pcm = [100, -500, 300, 450], maxAmp = 350', output: '2' },
      { title: 'Test Case 2', input: 'pcm = [10, -10], maxAmp = 10', output: '0' },
      { title: 'Test Case 3', input: 'pcm = [-999], maxAmp = 100', output: '1' },
      { title: 'Test Case 4', input: 'pcm = [0], maxAmp = 0', output: '0' }
    ],
    javaSolution: `public class Solution { public static int countClippedPcm(int[] pcm, int maxAmp) { int c = 0; for (int x : pcm) if (Math.abs(x) > maxAmp) c++; return c; } }`,
    pythonSolution: `def countClippedPcm(pcm, maxAmp): return sum(1 for x in pcm if abs(x) > maxAmp)`
  },
  {
    number: 8,
    title: 'State Machine Packet Counter',
    fnName: 'countValidStateTransitions',
    description: 'In a protocol state machine, valid states are <code>0..3</code> and only transitions <code>s -> (s + 1) % 4</code> or <code>s -> s</code> are valid. Given state log <code>states</code>, count invalid transitions.',
    constraints: ['1 <= states.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'states = [0, 1, 1, 3, 0]', output: '1' },
      { title: 'Test Case 2', input: 'states = [0, 1, 2, 3, 0]', output: '0' },
      { title: 'Test Case 3', input: 'states = [2, 0]', output: '1' },
      { title: 'Test Case 4', input: 'states = [1]', output: '0' }
    ],
    javaSolution: `public class Solution { public static int countValidStateTransitions(int[] states) { int bad = 0; for (int i = 1; i < states.length; i++) if (states[i] != states[i-1] && states[i] != (states[i-1]+1)%4) bad++; return bad; } }`,
    pythonSolution: `def countValidStateTransitions(states): return sum(1 for i in range(1, len(states)) if states[i] != states[i-1] and states[i] != (states[i-1] + 1) % 4)`
  },
  {
    number: 9,
    title: 'Memory Ring Buffer Occupancy',
    fnName: 'peakRingOccupancy',
    description: 'Given signed delta events <code>events</code> (+enqueue, -dequeue clamped at 0), return peak occupancy.',
    constraints: ['1 <= events.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'events = [5, 10, -8, 12]', output: '19' },
      { title: 'Test Case 2', input: 'events = [4, -10, 3]', output: '4' },
      { title: 'Test Case 3', input: 'events = [-5, -5]', output: '0' },
      { title: 'Test Case 4', input: 'events = [7]', output: '7' }
    ],
    javaSolution: `public class Solution { public static long peakRingOccupancy(int[] events) { long cur = 0, best = 0; for (int e : events) { cur = Math.max(0, cur + e); best = Math.max(best, cur); } return best; } }`,
    pythonSolution: `def peakRingOccupancy(events):
    cur = best = 0
    for e in events: cur = max(0, cur + e); best = max(best, cur)
    return best`
  },
  {
    number: 10,
    title: 'Image Horizontal Mirror Check',
    fnName: 'isHorizontallySymmetric',
    description: 'Return <code>true</code> if every row of matrix <code>img</code> is a palindrome, else <code>false</code>.',
    constraints: ['1 <= img.length, img[0].length <= 200'],
    testCases: [
      { title: 'Test Case 1', input: 'img = [[1, 2, 1], [3, 4, 3]]', output: 'true' },
      { title: 'Test Case 2', input: 'img = [[1, 2], [3, 4]]', output: 'false' },
      { title: 'Test Case 3', input: 'img = [[5]]', output: 'true' },
      { title: 'Test Case 4', input: 'img = [[1, 0, 0]]', output: 'false' }
    ],
    javaSolution: `public class Solution { public static boolean isHorizontallySymmetric(int[][] img) { int C = img[0].length; for (int[] r : img) for (int c = 0; c < C/2; c++) if (r[c] != r[C-1-c]) return false; return true; } }`,
    pythonSolution: `def isHorizontallySymmetric(img): return all(r == r[::-1] for r in img)`
  },
  {
    number: 11,
    title: 'Sobel Edge Gradient Magnitude',
    fnName: 'countStrongEdges',
    description: 'Given horizontal gradients <code>gx</code> and vertical gradients <code>gy</code>, count pixels where <code>|gx[i]| + |gy[i]| >= thresh</code>.',
    constraints: ['1 <= gx.length == gy.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'gx = [30, -40, 10], gy = [25, 20, -5], thresh = 50', output: '2' },
      { title: 'Test Case 2', input: 'gx = [10, 10], gy = [10, 10], thresh = 30', output: '0' },
      { title: 'Test Case 3', input: 'gx = [-50], gy = [0], thresh = 50', output: '1' },
      { title: 'Test Case 4', input: 'gx = [0], gy = [0], thresh = 1', output: '0' }
    ],
    javaSolution: `public class Solution { public static int countStrongEdges(int[] gx, int[] gy, int thresh) { int c = 0; for (int i = 0; i < gx.length; i++) if (Math.abs(gx[i]) + Math.abs(gy[i]) >= thresh) c++; return c; } }`,
    pythonSolution: `def countStrongEdges(gx, gy, thresh): return sum(1 for a, b in zip(gx, gy) if abs(a) + abs(b) >= thresh)`
  },
  {
    number: 12,
    title: 'Codec Run-Length Decode Length',
    fnName: 'decodedPixelCount',
    description: 'Given run-length counts <code>runs</code> and pixel values <code>vals</code>, return total decoded pixel count (<code>sum(runs)</code>).',
    constraints: ['1 <= runs.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'runs = [4, 2, 10]', output: '16' },
      { title: 'Test Case 2', input: 'runs = [1]', output: '1' },
      { title: 'Test Case 3', input: 'runs = [5, 5, 5]', output: '15' },
      { title: 'Test Case 4', input: 'runs = [0, 3]', output: '3' }
    ],
    javaSolution: `public class Solution { public static long decodedPixelCount(int[] runs) { long s = 0; for (int r : runs) s += r; return s; } }`,
    pythonSolution: `def decodedPixelCount(runs): return sum(runs)`
  },
  {
    number: 13,
    title: 'RGB565 16-Bit Color Packing',
    fnName: 'packRgb565',
    description: 'Pack 5-bit red <code>r</code> (0..31), 6-bit green <code>g</code> (0..63), and 5-bit blue <code>b</code> (0..31) into 16-bit integer <code>(r &lt;&lt; 11) | (g &lt;&lt; 5) | b</code>.',
    constraints: ['0 <= r <= 31', '0 <= g <= 63', '0 <= b <= 31'],
    testCases: [
      { title: 'Test Case 1', input: 'r = 31, g = 0, b = 0', output: '63488' },
      { title: 'Test Case 2', input: 'r = 0, g = 63, b = 0', output: '2016' },
      { title: 'Test Case 3', input: 'r = 0, g = 0, b = 31', output: '31' },
      { title: 'Test Case 4', input: 'r = 0, g = 0, b = 0', output: '0' }
    ],
    javaSolution: `public class Solution { public static int packRgb565(int r, int g, int b) { return (r << 11) | (g << 5) | b; } }`,
    pythonSolution: `def packRgb565(r, g, b): return (r << 11) | (g << 5) | b`
  },
  {
    number: 14,
    title: 'Bitwise Cyclic Left Shift 8-Bit',
    fnName: 'rotateLeft8',
    description: 'Rotate an 8-bit unsigned byte <code>b</code> (0..255) left by <code>k</code> bits within 8 bits.',
    constraints: ['0 <= b <= 255', '0 <= k <= 100'],
    testCases: [
      { title: 'Test Case 1', input: 'b = 128, k = 1', output: '1' },
      { title: 'Test Case 2', input: 'b = 1, k = 3', output: '8' },
      { title: 'Test Case 3', input: 'b = 255, k = 5', output: '255' },
      { title: 'Test Case 4', input: 'b = 0, k = 4', output: '0' }
    ],
    javaSolution: `public class Solution { public static int rotateLeft8(int b, int k) { k %= 8; return ((b << k) | (b >> (8 - k))) & 0xFF; } }`,
    pythonSolution: `def rotateLeft8(b, k):
    k %= 8
    return ((b << k) | (b >> (8 - k))) & 0xFF`
  },
  {
    number: 15,
    title: 'Audio Gain Normalization Peak',
    fnName: 'maxAbsoluteAmplitude',
    description: 'Given signed audio samples <code>samples</code>, return the maximum absolute amplitude.',
    constraints: ['1 <= samples.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'samples = [10, -50, 30, -20]', output: '50' },
      { title: 'Test Case 2', input: 'samples = [0, 0]', output: '0' },
      { title: 'Test Case 3', input: 'samples = [-100]', output: '100' },
      { title: 'Test Case 4', input: 'samples = [25, -25]', output: '25' }
    ],
    javaSolution: `public class Solution { public static int maxAbsoluteAmplitude(int[] samples) { int m = 0; for (int s : samples) m = Math.max(m, Math.abs(s)); return m; } }`,
    pythonSolution: `def maxAbsoluteAmplitude(samples): return max(abs(s) for s in samples)`
  },
  {
    number: 16,
    title: 'DMA Burst Transfer Count',
    fnName: 'countDmaBursts',
    description: 'Transfer <code>totalBytes</code> in bursts of at most <code>burstMax</code> bytes. Return minimum bursts required.',
    constraints: ['0 <= totalBytes <= 10^9', '1 <= burstMax <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'totalBytes = 100, burstMax = 32', output: '4' },
      { title: 'Test Case 2', input: 'totalBytes = 64, burstMax = 32', output: '2' },
      { title: 'Test Case 3', input: 'totalBytes = 0, burstMax = 16', output: '0' },
      { title: 'Test Case 4', input: 'totalBytes = 1, burstMax = 64', output: '1' }
    ],
    javaSolution: `public class Solution { public static long countDmaBursts(long totalBytes, long burstMax) { return (totalBytes + burstMax - 1) / burstMax; } }`,
    pythonSolution: `def countDmaBursts(totalBytes, burstMax): return (totalBytes + burstMax - 1) // burstMax`
  },
  {
    number: 17,
    title: 'Sensor Spike Median Filter 3',
    fnName: 'sumMedian3Filtered',
    description: 'For each interior index <code>1 <= i <= n-2</code> of <code>vals</code>, compute the median of <code>[vals[i-1], vals[i], vals[i+1]]</code> and return the sum of these medians.',
    constraints: ['3 <= vals.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'vals = [1, 100, 2, 3]', output: '5' },
      { title: 'Test Case 2', input: 'vals = [5, 5, 5]', output: '5' },
      { title: 'Test Case 3', input: 'vals = [10, 20, 30]', output: '20' },
      { title: 'Test Case 4', input: 'vals = [3, 1, 2, 4]', output: '4' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long sumMedian3Filtered(int[] vals) {
        long s = 0;
        for (int i = 1; i + 1 < vals.length; i++) {
            int a = vals[i-1], b = vals[i], c = vals[i+1];
            s += (long) a + b + c - Math.min(a, Math.min(b, c)) - Math.max(a, Math.max(b, c));
        }
        return s;
    }
}`,
    pythonSolution: `def sumMedian3Filtered(vals):
    return sum(sorted(vals[i-1:i+2])[1] for i in range(1, len(vals) - 1))`
  },
  {
    number: 18,
    title: 'I2C Bus Address Collision Check',
    fnName: 'hasAddressCollision',
    description: 'Given 7-bit I2C device addresses <code>addrs</code>, return <code>true</code> if any two devices share the same address, else <code>false</code>.',
    constraints: ['1 <= addrs.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'addrs = [72, 80, 72]', output: 'true' },
      { title: 'Test Case 2', input: 'addrs = [10, 20, 30]', output: 'false' },
      { title: 'Test Case 3', input: 'addrs = [5]', output: 'false' },
      { title: 'Test Case 4', input: 'addrs = [1, 1]', output: 'true' }
    ],
    javaSolution: `import java.util.*;
public class Solution { public static boolean hasAddressCollision(int[] addrs) { Set<Integer> s = new HashSet<>(); for (int a : addrs) if (!s.add(a)) return true; return false; } }`,
    pythonSolution: `def hasAddressCollision(addrs): return len(set(addrs)) < len(addrs)`
  },
  {
    number: 19,
    title: 'Frame Buffer Row Stride Padding',
    fnName: 'totalFramebufferBytes',
    description: 'An image has <code>rows</code> rows, each needing <code>rowBytes</code> rounded up to a multiple of <code>strideAlign</code>. Return total buffer bytes.',
    constraints: ['1 <= rows <= 10^4', '1 <= rowBytes, strideAlign <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'rows = 10, rowBytes = 100, strideAlign = 16', output: '1120' },
      { title: 'Test Case 2', input: 'rows = 5, rowBytes = 32, strideAlign = 16', output: '160' },
      { title: 'Test Case 3', input: 'rows = 1, rowBytes = 1, strideAlign = 4', output: '4' },
      { title: 'Test Case 4', input: 'rows = 2, rowBytes = 8, strideAlign = 8', output: '16' }
    ],
    javaSolution: `public class Solution { public static long totalFramebufferBytes(long rows, long rowBytes, long strideAlign) { long pitch = ((rowBytes + strideAlign - 1) / strideAlign) * strideAlign; return rows * pitch; } }`,
    pythonSolution: `def totalFramebufferBytes(rows, rowBytes, strideAlign): return rows * (((rowBytes + strideAlign - 1) // strideAlign) * strideAlign)`
  },
  {
    number: 20,
    title: 'Embedded Stack High-Water Mark',
    fnName: 'maxStackDepthBytes',
    description: 'Function calls push <code>+sz</code> bytes and returns pop <code>-sz</code> bytes in <code>events</code>. Return maximum stack depth reached.',
    constraints: ['1 <= events.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'events = [64, 32, -32, 128, -128, -64]', output: '192' },
      { title: 'Test Case 2', input: 'events = [16, -16]', output: '16' },
      { title: 'Test Case 3', input: 'events = [100]', output: '100' },
      { title: 'Test Case 4', input: 'events = [0]', output: '0' }
    ],
    javaSolution: `public class Solution { public static long maxStackDepthBytes(int[] events) { long cur = 0, best = 0; for (int e : events) { cur += e; best = Math.max(best, cur); } return best; } }`,
    pythonSolution: `def maxStackDepthBytes(events):
    cur = best = 0
    for e in events: cur += e; best = max(best, cur)
    return best`
  },
  {
    number: 21,
    title: 'PWM Frequency Divider Output',
    fnName: 'countTogglesInWindow',
    description: 'A clock toggles every <code>halfPeriod</code> ticks starting at tick <code>halfPeriod</code>. In ticks <code>1..N</code>, how many toggles occur?',
    constraints: ['1 <= halfPeriod <= 10^9', '0 <= N <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'halfPeriod = 5, N = 22', output: '4' },
      { title: 'Test Case 2', input: 'halfPeriod = 10, N = 5', output: '0' },
      { title: 'Test Case 3', input: 'halfPeriod = 1, N = 10', output: '10' },
      { title: 'Test Case 4', input: 'halfPeriod = 4, N = 8', output: '2' }
    ],
    javaSolution: `public class Solution { public static long countTogglesInWindow(long halfPeriod, long N) { return N / halfPeriod; } }`,
    pythonSolution: `def countTogglesInWindow(halfPeriod, N): return N // halfPeriod`
  },
  {
    number: 22,
    title: 'Pixel Chroma Subsampling 4:2:0',
    fnName: 'countChromaBlocks',
    description: 'Given image dimensions <code>W</code> and <code>H</code> (both even), return the number of <code>2 x 2</code> chroma blocks.',
    constraints: ['2 <= W, H <= 10^4', 'W, H are even'],
    testCases: [
      { title: 'Test Case 1', input: 'W = 1920, H = 1080', output: '518400' },
      { title: 'Test Case 2', input: 'W = 2, H = 2', output: '1' },
      { title: 'Test Case 3', input: 'W = 4, H = 6', output: '6' },
      { title: 'Test Case 4', input: 'W = 10, H = 10', output: '25' }
    ],
    javaSolution: `public class Solution { public static long countChromaBlocks(long W, long H) { return (W / 2) * (H / 2); } }`,
    pythonSolution: `def countChromaBlocks(W, H): return (W // 2) * (H // 2)`
  },
  {
    number: 23,
    title: 'Watchdog Missed Heartbeat Count',
    fnName: 'countLateHeartbeats',
    description: 'Given sorted heartbeat timestamps <code>ts</code>, count how many consecutive gaps exceed <code>maxGap</code>.',
    constraints: ['1 <= ts.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'ts = [0, 10, 25, 30, 50], maxGap = 10', output: '2' },
      { title: 'Test Case 2', input: 'ts = [0, 10, 20], maxGap = 10', output: '0' },
      { title: 'Test Case 3', input: 'ts = [5], maxGap = 1', output: '0' },
      { title: 'Test Case 4', input: 'ts = [0, 15], maxGap = 10', output: '1' }
    ],
    javaSolution: `public class Solution { public static int countLateHeartbeats(int[] ts, int maxGap) { int c = 0; for (int i = 1; i < ts.length; i++) if (ts[i] - ts[i-1] > maxGap) c++; return c; } }`,
    pythonSolution: `def countLateHeartbeats(ts, maxGap): return sum(1 for i in range(1, len(ts)) if ts[i] - ts[i-1] > maxGap)`
  },
  {
    number: 24,
    title: 'RTOS Task Priority Inversion Count',
    fnName: 'countLowerPrioAhead',
    description: 'Count how many tasks in <code>prios</code> have a strictly higher priority task appearing later in the array.',
    constraints: ['1 <= prios.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'prios = [2, 5, 3]', output: '1' },
      { title: 'Test Case 2', input: 'prios = [5, 4, 3]', output: '0' },
      { title: 'Test Case 3', input: 'prios = [1, 2, 3]', output: '2' },
      { title: 'Test Case 4', input: 'prios = [10]', output: '0' }
    ],
    javaSolution: `public class Solution { public static int countLowerPrioAhead(int[] prios) { int mx = Integer.MIN_VALUE, c = 0; for (int i = prios.length - 1; i >= 0; i--) { if (prios[i] < mx) c++; mx = Math.max(mx, prios[i]); } return c; } }`,
    pythonSolution: `def countLowerPrioAhead(prios):
    mx = float('-inf'); c = 0
    for p in reversed(prios):
        if p < mx: c += 1
        mx = max(mx, p)
    return c`
  },
  {
    number: 25,
    title: 'Endianness 16-Bit Byte Swap',
    fnName: 'swapBytes16',
    description: 'Swap the upper and lower 8-bit bytes of 16-bit unsigned integer <code>x</code>.',
    constraints: ['0 <= x <= 65535'],
    testCases: [
      { title: 'Test Case 1', input: 'x = 258', output: '513' },
      { title: 'Test Case 2', input: 'x = 255', output: '65280' },
      { title: 'Test Case 3', input: 'x = 0', output: '0' },
      { title: 'Test Case 4', input: 'x = 65535', output: '65535' }
    ],
    javaSolution: `public class Solution { public static int swapBytes16(int x) { return ((x & 0xFF) << 8) | ((x >> 8) & 0xFF); } }`,
    pythonSolution: `def swapBytes16(x): return ((x & 0xFF) << 8) | ((x >> 8) & 0xFF)`
  },
  ...Array.from({ length: 25 }, (_, idx) => {
    const n = idx + 26;
    const ops = [
      { t: 'Audio Sample DC Offset Removal', fn: 'sumAbsDiffFromMean', d: 'Return sum of <code>|vals[i] - (sum(vals) // len(vals))|</code> across <code>vals</code>.', j: 'long s=0; for(int v:vals)s+=v; long m=s/vals.length; long ans=0; for(int v:vals)ans+=Math.abs(v-m); return ans;', p: 'm = sum(vals) // len(vals)\n    return sum(abs(v - m) for v in vals)', tc: [['vals = [10, 20, 30]', '20'], ['vals = [5, 5]', '0'], ['vals = [100]', '0'], ['vals = [0, 10]', '10']] },
      { t: 'Bitwise Odd-Bit Count Mask', fn: 'countOddBitWords', d: 'Count integers in <code>vals</code> having an odd number of 1-bits.', j: 'int c=0; for(int v:vals) if(Integer.bitCount(v)%2==1)c++; return c;', p: 'return sum(1 for v in vals if v.bit_count() % 2 == 1)', tc: [['vals = [1, 3, 7]', '2'], ['vals = [0, 3]', '0'], ['vals = [8]', '1'], ['vals = [15]', '0']] },
      { t: 'Signal Peak-to-Peak Range', fn: 'signalPeakToPeak', d: 'Return <code>max(vals) - min(vals)</code>.', j: 'int mn=vals[0], mx=vals[0]; for(int v:vals){mn=Math.min(mn,v);mx=Math.max(mx,v);} return (long)mx-mn;', p: 'return max(vals) - min(vals)', tc: [['vals = [10, 50, 20]', '40'], ['vals = [5]', '0'], ['vals = [-10, 10]', '20'], ['vals = [3, 3, 3]', '0']] },
      { t: 'Packet Payload Checksum XOR', fn: 'xorPayload', d: 'Return bitwise XOR of all elements in <code>vals</code>.', j: 'int x=0; for(int v:vals)x^=v; return x;', p: 'x=0\n    for v in vals: x^=v\n    return x', tc: [['vals = [1, 2, 3]', '0'], ['vals = [7, 7, 9]', '9'], ['vals = [5]', '5'], ['vals = [1, 2, 4]', '7']] },
      { t: 'Consecutive Rising Signal Streak', fn: 'maxRisingSignalRun', d: 'Return longest contiguous strictly increasing run in <code>vals</code>.', j: 'int cur=1,best=1; for(int i=1;i<vals.length;i++){cur=(vals[i]>vals[i-1])?cur+1:1;best=Math.max(best,cur);} return best;', p: 'cur=best=1\n    for i in range(1,len(vals)): cur=cur+1 if vals[i]>vals[i-1] else 1; best=max(best,cur)\n    return best', tc: [['vals = [1, 3, 5, 2, 4]', '3'], ['vals = [5, 4, 3]', '1'], ['vals = [10]', '1'], ['vals = [1, 2, 3, 4]', '4']] }
    ];
    const op = ops[idx % ops.length];
    return {
      number: n,
      title: `${op.t} (${n})`,
      fnName: `${op.fn}${n}`,
      description: op.d,
      constraints: ['1 <= vals.length <= 10^5'],
      testCases: op.tc.map((x, k) => ({ title: `Test Case ${k + 1}`, input: x[0], output: x[1] })),
      javaSolution: `public class Solution { public static long ${op.fn}${n}(int[] vals) { ${op.j} } }`,
      pythonSolution: `def ${op.fn}${n}(vals):\n    ${op.p}`
    };
  })
];
