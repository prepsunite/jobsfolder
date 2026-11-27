export const NVIDIA_QUESTIONS = [
  {
    number: 1,
    title: 'CUDA Warp Active Thread Mask',
    fnName: 'countActiveWarpThreads',
    description: 'In an NVIDIA GPU warp of 32 threads, <code>mask</code> is a 32-bit unsigned active-thread mask (represented here as non-negative 31-bit int). Return how many threads are active.',
    constraints: ['0 <= mask <= 2^31 - 1'],
    testCases: [
      { title: 'Test Case 1', input: 'mask = 15', output: '4' },
      { title: 'Test Case 2', input: 'mask = 0', output: '0' },
      { title: 'Test Case 3', input: 'mask = 255', output: '8' },
      { title: 'Test Case 4', input: 'mask = 1023', output: '10' }
    ],
    javaSolution: `public class Solution { public static int countActiveWarpThreads(int mask) { return Integer.bitCount(mask); } }`,
    pythonSolution: `def countActiveWarpThreads(mask): return mask.bit_count()`
  },
  {
    number: 2,
    title: 'Tensor Tile Count With Padding',
    fnName: 'countTensorTiles',
    description: 'An <code>M x N</code> tensor is tiled into <code>tileH x tileW</code> blocks. Return total tiles needed (ceiling division along both axes).',
    constraints: ['1 <= M, N, tileH, tileW <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'M = 100, N = 100, tileH = 16, tileW = 16', output: '49' },
      { title: 'Test Case 2', input: 'M = 32, N = 32, tileH = 16, tileW = 16', output: '4' },
      { title: 'Test Case 3', input: 'M = 1, N = 1, tileH = 8, tileW = 8', output: '1' },
      { title: 'Test Case 4', input: 'M = 17, N = 33, tileH = 16, tileW = 16', output: '6' }
    ],
    javaSolution: `public class Solution { public static long countTensorTiles(long M, long N, long tileH, long tileW) { return ((M + tileH - 1) / tileH) * ((N + tileW - 1) / tileW); } }`,
    pythonSolution: `def countTensorTiles(M, N, tileH, tileW): return ((M + tileH - 1) // tileH) * ((N + tileW - 1) // tileW)`
  },
  {
    number: 3,
    title: 'GPU Memory Coalesced Alignment',
    fnName: 'countAlignedPointers',
    description: 'Given byte addresses <code>addrs</code> and alignment <code>align</code> (power of 2), count how many addresses are aligned (<code>addr % align == 0</code>).',
    constraints: ['1 <= addrs.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'addrs = [0, 128, 130, 256], align = 128', output: '3' },
      { title: 'Test Case 2', input: 'addrs = [1, 2, 3], align = 4', output: '0' },
      { title: 'Test Case 3', input: 'addrs = [64], align = 64', output: '1' },
      { title: 'Test Case 4', input: 'addrs = [16, 32, 48], align = 16', output: '3' }
    ],
    javaSolution: `public class Solution { public static int countAlignedPointers(int[] addrs, int align) { int c = 0; for (int a : addrs) if ((a & (align - 1)) == 0) c++; return c; } }`,
    pythonSolution: `def countAlignedPointers(addrs, align): return sum(1 for a in addrs if (a & (align - 1)) == 0)`
  },
  {
    number: 4,
    title: 'Parallel Reduction Pairwise Sum',
    fnName: 'maxStrideBlockSum',
    description: 'Given array <code>vals</code> of length divisible by <code>blockSize</code>, compute the sum of each block of size <code>blockSize</code> and return the maximum block sum.',
    constraints: ['1 <= blockSize <= vals.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'vals = [1, 2, 3, 10, 20, 30], blockSize = 3', output: '60' },
      { title: 'Test Case 2', input: 'vals = [5, 5], blockSize = 1', output: '5' },
      { title: 'Test Case 3', input: 'vals = [-1, -2, -3, -4], blockSize = 2', output: '-3' },
      { title: 'Test Case 4', input: 'vals = [4, 8], blockSize = 2', output: '12' }
    ],
    javaSolution: `public class Solution { public static long maxStrideBlockSum(int[] vals, int blockSize) { long best = Long.MIN_VALUE; for (int i = 0; i < vals.length; i += blockSize) { long s = 0; for (int j = i; j < i + blockSize; j++) s += vals[j]; best = Math.max(best, s); } return best; } }`,
    pythonSolution: `def maxStrideBlockSum(vals, blockSize): return max(sum(vals[i:i+blockSize]) for i in range(0, len(vals), blockSize))`
  },
  {
    number: 5,
    title: 'Kernel Stream Concurrent Peak',
    fnName: 'maxConcurrentKernels',
    description: 'Given GPU kernel intervals <code>kernels</code> <code>[start, end)</code>, return the maximum number of kernels executing concurrently.',
    constraints: ['1 <= kernels.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'kernels = [[0, 10], [2, 8], [5, 12]]', output: '3' },
      { title: 'Test Case 2', input: 'kernels = [[0, 5], [5, 10]]', output: '1' },
      { title: 'Test Case 3', input: 'kernels = [[1, 4]]', output: '1' },
      { title: 'Test Case 4', input: 'kernels = [[1, 3], [2, 5], [4, 6]]', output: '2' }
    ],
    javaSolution: `import java.util.*;
public class Solution { public static int maxConcurrentKernels(int[][] kernels) { int n = kernels.length; int[] s = new int[n], e = new int[n]; for (int i = 0; i < n; i++) { s[i] = kernels[i][0]; e[i] = kernels[i][1]; } Arrays.sort(s); Arrays.sort(e); int i=0, j=0, cur=0, best=0; while (i < n) { if (s[i] < e[j]) { cur++; best = Math.max(best, cur); i++; } else { cur--; j++; } } return best; } }`,
    pythonSolution: `def maxConcurrentKernels(kernels):
    s = sorted(k[0] for k in kernels); e = sorted(k[1] for k in kernels)
    i = j = cur = best = 0
    while i < len(s):
        if s[i] < e[j]: cur += 1; best = max(best, cur); i += 1
        else: cur -= 1; j += 1
    return best`
  },
  ...Array.from({ length: 45 }, (_, idx) => {
    const n = idx + 6;
    const ops = [
      { t: 'Sparse Matrix Non-Zero Count', fn: 'countNnz', d: 'Count non-zero entries in 2D tensor <code>mat</code>.', j: 'int c=0; for(int[] r:mat) for(int v:r) if(v!=0)c++; return c;', p: 'return sum(1 for r in mat for v in r if v != 0)', arg: 'mat', tc: [['mat = [[1, 0, 2], [0, 0, 3]]', '3'], ['mat = [[0, 0]]', '0'], ['mat = [[5]]', '1'], ['mat = [[1, 1], [1, 1]]', '4']] },
      { t: 'VRAM Allocation Peak Usage', fn: 'peakVramUsed', d: 'Given signed VRAM delta allocations <code>events</code>, return peak VRAM used.', j: 'long cur=0,best=0; for(int e:events){cur+=e;best=Math.max(best,cur);} return best;', p: 'cur=best=0\n    for e in events: cur+=e; best=max(best,cur)\n    return best', arg: 'events', tc: [['events = [100, 200, -150, 300]', '450'], ['events = [50, -50]', '50'], ['events = [10]', '10'], ['events = [0]', '0']] },
      { t: 'Bitwise Warp Ballot Popcount', fn: 'sumWarpBallots', d: 'Return total set bits across all integers in <code>masks</code>.', j: 'long s=0; for(int m:masks) s+=Integer.bitCount(m); return s;', p: 'return sum(m.bit_count() for m in masks)', arg: 'masks', tc: [['masks = [1, 3, 7]', '6'], ['masks = [0, 0]', '0'], ['masks = [15]', '4'], ['masks = [8, 4]', '2']] },
      { t: 'Tensor ReLU Activation Sum', fn: 'sumReluOutputs', d: 'Apply <code>max(0, x)</code> to each element in <code>vals</code> and return the sum.', j: 'long s=0; for(int v:vals) if(v>0)s+=v; return s;', p: 'return sum(max(0, v) for v in vals)', arg: 'vals', tc: [['vals = [-5, 10, -2, 7]', '17'], ['vals = [-1, -2]', '0'], ['vals = [5, 5]', '10'], ['vals = [0]', '0']] },
      { t: 'SM Occupancy Grid Block Limit', fn: 'maxBlocksPerSm', d: 'Given thread counts per block <code>threads</code> and SM thread cap <code>cap</code>, count blocks with <code>threads[i] <= cap</code>.', j: 'int c=0; for(int t:threads) if(t<=cap)c++; return c;', p: 'return sum(1 for t in threads if t <= cap)', arg: 'threads, cap', tc: [['threads = [128, 256, 512, 1024], cap = 512', '3'], ['threads = [1024], cap = 512', '0'], ['threads = [64], cap = 64', '1'], ['threads = [32, 64], cap = 128', '2']] }
    ];
    const op = ops[idx % ops.length];
    const isMat = op.arg === 'mat';
    const isTwo = op.arg === 'threads, cap';
    const sigJ = isMat ? 'int[][] mat' : (isTwo ? 'int[] threads, int cap' : `int[] ${op.arg}`);
    const sigP = op.arg;
    return {
      number: n,
      title: `${op.t} (${n})`,
      fnName: `${op.fn}${n}`,
      description: op.d,
      constraints: ['1 <= input.length <= 10^5'],
      testCases: op.tc.map((x, k) => ({ title: `Test Case ${k + 1}`, input: x[0], output: x[1] })),
      javaSolution: `public class Solution { public static long ${op.fn}${n}(${sigJ}) { ${op.j} } }`,
      pythonSolution: `def ${op.fn}${n}(${sigP}):\n    ${op.p}`
    };
  })
];
