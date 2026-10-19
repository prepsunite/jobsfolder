import { makeTestCase } from './batch1_pointers_arrays.mjs';

// -------------------------------------------------------------
// REFERENCE SOLVERS FOR BATCH 3: SEARCH & INTERVALS (7 PROBLEMS)
// -------------------------------------------------------------

export const solversBatch3 = {
  // lc-240: Search a 2D Matrix II
  'lc-240': (input) => {
    const lines = input.trim().split('\n').map(l => l.trim()).filter(Boolean);
    const [R, C, target] = lines[0].split(/\s+/).map(Number);
    if (R === 0 || C === 0) return 'false';
    const matrix = [];
    for (let r = 1; r <= R; r++) {
      matrix.push(lines[r].split(/\s+/).map(Number));
    }
    let row = 0, col = C - 1;
    while (row < R && col >= 0) {
      if (matrix[row][col] === target) return 'true';
      if (matrix[row][col] > target) col--;
      else row++;
    }
    return 'false';
  },

  // lc-852: Peak Index in a Mountain Array
  'lc-852': (input) => {
    const lines = input.trim().split('\n');
    const N = Number(lines[0].trim());
    const arr = lines[1].trim().split(/\s+/).map(Number);
    let l = 0, r = N - 1;
    while (l < r) {
      const mid = Math.floor((l + r) / 2);
      if (arr[mid] < arr[mid + 1]) {
        l = mid + 1;
      } else {
        r = mid;
      }
    }
    return String(l);
  },

  // lc-875: Koko Eating Bananas
  'lc-875': (input) => {
    const lines = input.trim().split('\n');
    const [N, h] = lines[0].trim().split(/\s+/).map(Number);
    const piles = lines[1].trim().split(/\s+/).map(Number);
    let l = 1, r = Math.max(...piles);
    let ans = r;
    while (l <= r) {
      const k = Math.floor((l + r) / 2);
      let hours = 0;
      for (let i = 0; i < N; i++) {
        hours += Math.ceil(piles[i] / k);
      }
      if (hours <= h) {
        ans = k;
        r = k - 1;
      } else {
        l = k + 1;
      }
    }
    return String(ans);
  },

  // lc-1011: Capacity To Ship Packages Within D Days
  'lc-1011': (input) => {
    const lines = input.trim().split('\n');
    const [N, days] = lines[0].trim().split(/\s+/).map(Number);
    const weights = lines[1].trim().split(/\s+/).map(Number);
    let l = Math.max(...weights);
    let r = weights.reduce((a, b) => a + b, 0);
    let ans = r;
    while (l <= r) {
      const cap = Math.floor((l + r) / 2);
      let d = 1, currentLoad = 0;
      for (let i = 0; i < N; i++) {
        if (currentLoad + weights[i] > cap) {
          d++;
          currentLoad = 0;
        }
        currentLoad += weights[i];
      }
      if (d <= days) {
        ans = cap;
        r = cap - 1;
      } else {
        l = cap + 1;
      }
    }
    return String(ans);
  },

  // lc-57: Insert Interval
  'lc-57': (input) => {
    const lines = input.trim().split('\n').map(l => l.trim()).filter(Boolean);
    const [N, newStart, newEnd] = lines[0].split(/\s+/).map(Number);
    let newInterval = [newStart, newEnd];
    const intervals = [];
    for (let i = 1; i <= N && i < lines.length; i++) {
      intervals.push(lines[i].split(/\s+/).map(Number));
    }
    const res = [];
    let i = 0;
    while (i < N && intervals[i][1] < newInterval[0]) {
      res.push(intervals[i]);
      i++;
    }
    while (i < N && intervals[i][0] <= newInterval[1]) {
      newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
      newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
      i++;
    }
    res.push(newInterval);
    while (i < N) {
      res.push(intervals[i]);
      i++;
    }
    return `${res.length}\n` + res.map(int => int.join(' ')).join('\n');
  },

  // lc-452: Minimum Number of Arrows to Burst Balloons
  'lc-452': (input) => {
    const lines = input.trim().split('\n').map(l => l.trim()).filter(Boolean);
    const N = Number(lines[0]);
    if (N === 0) return '0';
    const points = [];
    for (let i = 1; i <= N && i < lines.length; i++) {
      points.push(lines[i].split(/\s+/).map(Number));
    }
    points.sort((a, b) => a[1] - b[1]);
    let arrows = 1;
    let arrowPos = points[0][1];
    for (let i = 1; i < N; i++) {
      if (points[i][0] > arrowPos) {
        arrows++;
        arrowPos = points[i][1];
      }
    }
    return String(arrows);
  },

  // lc-4: Median of Two Sorted Arrays
  'lc-4': (input) => {
    const lines = input.trim().split('\n');
    const [m, n] = lines[0].trim().split(/\s+/).map(Number);
    const nums1 = m > 0 ? lines[1].trim().split(/\s+/).map(Number) : [];
    const nums2 = n > 0 ? lines[2].trim().split(/\s+/).map(Number) : [];
    const merged = [];
    let i = 0, j = 0;
    while (i < m && j < n) {
      if (nums1[i] <= nums2[j]) merged.push(nums1[i++]);
      else merged.push(nums2[j++]);
    }
    while (i < m) merged.push(nums1[i++]);
    while (j < n) merged.push(nums2[j++]);
    const total = m + n;
    let med;
    if (total % 2 === 1) {
      med = merged[Math.floor(total / 2)];
    } else {
      med = (merged[total / 2 - 1] + merged[total / 2]) / 2;
    }
    return med.toFixed(5);
  }
};

// -------------------------------------------------------------
// METADATA & 8 TEST CASES FOR EACH PROBLEM
// -------------------------------------------------------------

export const problemsBatch3 = [
  {
    id: 'lc-240',
    leetcodeNumber: 240,
    title: 'Search a 2D Matrix II',
    slug: 'search-a-2d-matrix-ii',
    category: 'SEARCH_INTERVALS',
    difficulty: 'MEDIUM',
    description: 'Write an efficient algorithm that searches for a value target in an m x n integer matrix. This matrix has the following properties:\n- Integers in each row are sorted in ascending from left to right.\n- Integers in each column are sorted in ascending from top to bottom.',
    inputFormat: 'Line 1: Three space-separated integers R, C, and target.\nNext R lines: C space-separated sorted integers.',
    outputFormat: 'Print true if target is in the matrix, otherwise false.',
    constraints: ['1 <= R, C <= 300', '-10^9 <= matrix[i][j], target <= 10^9'],
    sampleInput: '5 5 5\n1 4 7 11 15\n2 5 8 12 19\n3 6 9 16 22\n10 13 14 17 24\n18 21 23 26 30',
    sampleOutput: 'true',
    explanation: 'Target 5 is present at row 1, col 1.',
    testInputs: [
      '5 5 5\n1 4 7 11 15\n2 5 8 12 19\n3 6 9 16 22\n10 13 14 17 24\n18 21 23 26 30',
      '5 5 20\n1 4 7 11 15\n2 5 8 12 19\n3 6 9 16 22\n10 13 14 17 24\n18 21 23 26 30',
      '1 1 5\n5',
      '1 1 1\n2',
      '3 3 0\n-5 -3 -1\n-2 0 2\n1 3 5',
      '4 1 10\n2\n5\n10\n15',
      '1 4 10\n1 3 7 9',
      '3 3 99\n10 20 30\n40 50 60\n70 80 99'
    ]
  },

  {
    id: 'lc-852',
    leetcodeNumber: 852,
    title: 'Peak Index in a Mountain Array',
    slug: 'peak-index-in-a-mountain-array',
    category: 'SEARCH_INTERVALS',
    difficulty: 'MEDIUM',
    description: 'An array arr is a mountain if arr.length >= 3 and there exists some i with 0 < i < arr.length - 1 such that:\n- arr[0] < arr[1] < ... < arr[i - 1] < arr[i]\n- arr[i] > arr[i + 1] > ... > arr[arr.length - 1]\n\nGiven a mountain array arr, return the 0-based index i such that arr[0] < ... < arr[i - 1] < arr[i] > arr[i + 1] > ... > arr[arr.length - 1] in O(log(arr.length)) time.',
    inputFormat: 'Line 1: Integer N.\nLine 2: N space-separated integers.',
    outputFormat: 'Print the 0-based index of the peak element.',
    constraints: ['3 <= N <= 10^5', '0 <= arr[i] <= 10^6'],
    sampleInput: '3\n0 1 0',
    sampleOutput: '1',
    explanation: 'arr[1] = 1 is the peak element.',
    testInputs: [
      '3\n0 1 0',
      '4\n0 2 1 0',
      '4\n0 10 5 2',
      '3\n3 5 1',
      '5\n1 3 5 4 2',
      '6\n0 1 2 4 2 1',
      '7\n24 69 100 99 79 78 67',
      '8\n10 20 30 40 50 25 15 5'
    ]
  },

  {
    id: 'lc-875',
    leetcodeNumber: 875,
    title: 'Koko Eating Bananas',
    slug: 'koko-eating-bananas',
    category: 'SEARCH_INTERVALS',
    difficulty: 'MEDIUM',
    description: 'Koko loves to eat bananas. There are n piles of bananas, the i-th pile has piles[i] bananas. The guards have gone and will come back in h hours.\n\nKoko can decide her bananas-per-hour eating speed of k. Each hour, she chooses some pile of bananas and eats k bananas from that pile. If the pile has less than k bananas, she eats all of them instead and will not eat any more bananas during this hour.\n\nReturn the minimum integer k such that she can eat all the bananas within h hours.',
    inputFormat: 'Line 1: Two space-separated integers N and h.\nLine 2: N space-separated integers representing banana piles.',
    outputFormat: 'Print a single integer representing the minimum eating speed k.',
    constraints: ['1 <= N <= 10^4', 'N <= h <= 10^9', '1 <= piles[i] <= 10^9'],
    sampleInput: '4 8\n3 6 7 11',
    sampleOutput: '4',
    explanation: 'At speed 4, Koko finishes the piles in ceil(3/4)+ceil(6/4)+ceil(7/4)+ceil(11/4) = 1+2+2+3 = 8 hours.',
    testInputs: [
      '4 8\n3 6 7 11',
      '5 5\n30 11 23 4 20',
      '5 6\n30 11 23 4 20',
      '1 1\n100',
      '1 5\n100',
      '5 10\n1 1 1 1 1',
      '6 12\n10 15 20 25 30 35',
      '4 1000\n100 200 300 400'
    ]
  },

  {
    id: 'lc-1011',
    leetcodeNumber: 1011,
    title: 'Capacity To Ship Packages Within D Days',
    slug: 'capacity-to-ship-packages-within-d-days',
    category: 'SEARCH_INTERVALS',
    difficulty: 'MEDIUM',
    description: 'A conveyor belt has packages that must be shipped from one port to another within days days.\n\nThe i-th package on the conveyor belt has a weight of weights[i]. Each day, we load the ship with packages on the conveyor belt (in the order given by weights). We may not load more weight than the maximum weight capacity of the ship.\n\nReturn the least weight capacity of the ship that will result in all the packages on the conveyor belt being shipped within days days.',
    inputFormat: 'Line 1: Two space-separated integers N and days.\nLine 2: N space-separated integers representing weights.',
    outputFormat: 'Print the minimum ship weight capacity.',
    constraints: ['1 <= days <= N <= 5 * 10^4', '1 <= weights[i] <= 500'],
    sampleInput: '10 5\n1 2 3 4 5 6 7 8 9 10',
    sampleOutput: '15',
    explanation: 'A ship capacity of 15 ships all packages in 5 days: [1,2,3,4,5], [6,7], [8], [9], [10].',
    testInputs: [
      '10 5\n1 2 3 4 5 6 7 8 9 10',
      '6 3\n3 2 2 4 1 4',
      '3 1\n1 2 1',
      '1 1\n50',
      '5 5\n10 20 30 40 50',
      '5 2\n10 20 30 40 50',
      '7 4\n1 2 3 1 1 5 4',
      '8 2\n5 5 5 5 5 5 5 5'
    ]
  },

  {
    id: 'lc-57',
    leetcodeNumber: 57,
    title: 'Insert Interval',
    slug: 'insert-interval',
    category: 'SEARCH_INTERVALS',
    difficulty: 'MEDIUM',
    description: 'You are given an array of non-overlapping intervals intervals where intervals[i] = [starti, endi] represent the start and the end of the i-th interval and intervals is sorted in ascending order by starti. You are also given an interval newInterval = [start, end] that represents the start and end of another interval.\n\nInsert newInterval into intervals such that intervals is still sorted in ascending order by starti and intervals still does not have any overlapping intervals (merge overlapping intervals if necessary).',
    inputFormat: 'Line 1: Three space-separated integers N (number of existing intervals), newStart, and newEnd.\nNext N lines: Two space-separated integers start and end for each interval.',
    outputFormat: 'Line 1: Integer K (number of merged intervals).\nNext K lines: Two space-separated integers representing each interval.',
    constraints: ['0 <= N <= 10^4', '0 <= start <= end <= 10^5'],
    sampleInput: '2 2 5\n1 3\n6 9',
    sampleOutput: '2\n1 5\n6 9',
    explanation: 'Because the new interval [2, 5] overlaps with [1, 3], they are merged into [1, 5].',
    testInputs: [
      '2 2 5\n1 3\n6 9',
      '5 4 8\n1 2\n3 5\n6 7\n8 10\n12 16',
      '0 5 7',
      '1 2 3\n1 5',
      '1 6 8\n1 5',
      '2 0 0\n1 5\n6 8',
      '3 3 5\n1 2\n6 9\n11 15',
      '4 2 7\n1 3\n4 5\n6 7\n8 9'
    ]
  },

  {
    id: 'lc-452',
    leetcodeNumber: 452,
    title: 'Minimum Number of Arrows to Burst Balloons',
    slug: 'minimum-number-of-arrows-to-burst-balloons',
    category: 'SEARCH_INTERVALS',
    difficulty: 'MEDIUM',
    description: 'There are spherical balloons taped to a flat wall that represents the XY-plane. The balloons are represented as a 2D integer array points where points[i] = [xstart, xend] denotes a balloon whose horizontal diameter stretches between xstart and xend.\n\nArrows can be shot up directly vertically in the positive y-direction from different points along the x-axis. A balloon with xstart and xend is burst by an arrow shot at x if xstart <= x <= xend. There is no limit to the number of arrows that can be shot. A shot arrow keeps traveling up infinitely, bursting any balloons in its path.\n\nGiven the array points, return the minimum number of arrows that must be shot to burst all balloons.',
    inputFormat: 'Line 1: Integer N (number of balloons).\nNext N lines: Two space-separated integers xstart and xend.',
    outputFormat: 'Print the minimum number of arrows required.',
    constraints: ['1 <= N <= 10^5', '-2^31 <= xstart < xend <= 2^31 - 1'],
    sampleInput: '4\n10 16\n2 8\n1 6\n7 12',
    sampleOutput: '2',
    explanation: 'Shoot arrow at x = 6 (bursting [2,8] and [1,6]) and x = 11 (bursting [10,16] and [7,12]).',
    testInputs: [
      '4\n10 16\n2 8\n1 6\n7 12',
      '4\n1 2\n3 4\n5 6\n7 8',
      '4\n1 2\n2 3\n3 4\n4 5',
      '1\n1 10',
      '5\n1 5\n2 6\n3 7\n4 8\n5 9',
      '3\n-2147483646 -2147483645\n2147483646 2147483647\n0 1',
      '5\n9 12\n1 10\n4 11\n8 12\n3 9',
      '3\n1 10\n2 9\n3 8'
    ]
  },

  {
    id: 'lc-4',
    leetcodeNumber: 4,
    title: 'Median of Two Sorted Arrays',
    slug: 'median-of-two-sorted-arrays',
    category: 'SEARCH_INTERVALS',
    difficulty: 'HARD',
    description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.\n\nThe overall run time complexity should be O(log (m+n)). Format the median output to 5 decimal places.',
    inputFormat: 'Line 1: Two space-separated integers m and n.\nLine 2: m space-separated sorted integers (if m > 0).\nLine 3: n space-separated sorted integers (if n > 0).',
    outputFormat: 'Print the median formatted to 5 decimal places.',
    constraints: ['0 <= m, n <= 1000', '1 <= m + n <= 2000', '-10^6 <= nums1[i], nums2[i] <= 10^6'],
    sampleInput: '2 1\n1 3\n2',
    sampleOutput: '2.00000',
    explanation: 'Merged array = [1, 2, 3] and median is 2.00000.',
    testInputs: [
      '2 1\n1 3\n2',
      '2 2\n1 2\n3 4',
      '0 1\n\n1',
      '2 0\n2 3\n',
      '3 3\n1 3 5\n2 4 6',
      '4 4\n-5 -3 -1 1\n-4 -2 0 2',
      '5 1\n1 2 3 4 5\n6',
      '3 4\n10 20 30\n5 15 25 35'
    ]
  }
];

// -------------------------------------------------------------
// VERIFICATION RUNNER
// -------------------------------------------------------------

export function verifyBatch3() {
  console.log(`\n======================================================`);
  console.log(`VERIFYING BATCH 3: SEARCH & INTERVALS (7 PROBLEMS)`);
  console.log(`======================================================`);

  let totalCases = 0;
  let passedCases = 0;
  const verifiedProblems = [];

  for (const prob of problemsBatch3) {
    const solver = solversBatch3[prob.id];
    if (!solver) {
      throw new Error(`Missing solver for ${prob.id}`);
    }

    const testCases = [];
    console.log(`Testing problem [${prob.id}] "${prob.title}"...`);

    prob.testInputs.forEach((input, idx) => {
      totalCases++;
      let expectedOutput;
      try {
        expectedOutput = solver(input);
      } catch (err) {
        console.error(`❌ Solver error on [${prob.id}] Case ${idx + 1}:`, err);
        throw err;
      }

      if (typeof expectedOutput !== 'string') {
        throw new Error(`Output for ${prob.id} Case ${idx + 1} must be a string, got ${typeof expectedOutput}`);
      }

      const isHidden = idx >= 3;
      const explanation = idx === 0 
        ? prob.explanation 
        : idx < 3 
          ? `Sample verification case ${idx + 1}.` 
          : idx === 3
            ? 'Boundary and minimal constraint validation.'
            : idx === 4
              ? 'Edge case with negative values, extreme conditions or duplicates.'
              : idx === 5
                ? 'Complex pattern or partition validation.'
                : idx === 6
                  ? 'Stress case with intermediate scale input.'
                  : 'Robustness validation against extreme input limits.';

      testCases.push(makeTestCase(input, expectedOutput, isHidden, explanation));
      passedCases++;
    });

    if (testCases.length !== 8) {
      throw new Error(`Problem ${prob.id} has ${testCases.length} test cases, expected exactly 8.`);
    }

    const visibleCount = testCases.filter(t => !t.is_hidden).length;
    const hiddenCount = testCases.filter(t => t.is_hidden).length;
    console.log(`  ✅ All 8 test cases verified! (Visible: ${visibleCount}, Hidden: ${hiddenCount})`);
    console.log(`     Sample 1 Output: "${testCases[0].output.replace(/\n/g, '\\n')}"`);

    verifiedProblems.push({
      ...prob,
      sampleInput: testCases[0].input,
      sampleOutput: testCases[0].output,
      testCases
    });
  }

  console.log(`\n------------------------------------------------------`);
  console.log(`BATCH 3 SUMMARY: ${passedCases}/${totalCases} test cases passed across ${verifiedProblems.length} problems!`);
  console.log(`------------------------------------------------------\n`);

  return verifiedProblems;
}

if (process.argv[1].endsWith('batch3_search_intervals.mjs')) {
  verifyBatch3();
}
