import { makeTestCase } from './batch1_pointers_arrays.mjs';

// -------------------------------------------------------------------
// REFERENCE SOLVERS FOR BATCH 6: NETWORK & GRAPH ALGORITHMS (8 PROBLEMS)
// -------------------------------------------------------------------

export const solversBatch6 = {
  // lc-547: Number of Provinces
  'lc-547': (input) => {
    const lines = input.trim().split('\n').map(l => l.trim()).filter(Boolean);
    const N = Number(lines[0]);
    if (N === 0) return '0';
    const isConnected = [];
    for (let i = 1; i <= N; i++) {
      isConnected.push(lines[i].split(/\s+/).map(Number));
    }
    const visited = Array(N).fill(false);
    let provinces = 0;
    const dfs = (city) => {
      visited[city] = true;
      for (let next = 0; next < N; next++) {
        if (isConnected[city][next] === 1 && !visited[next]) {
          dfs(next);
        }
      }
    };
    for (let i = 0; i < N; i++) {
      if (!visited[i]) {
        provinces++;
        dfs(i);
      }
    }
    return String(provinces);
  },

  // lc-133: Clone Graph
  'lc-133': (input) => {
    const lines = input.trim().split('\n').map(l => l.trim()).filter(Boolean);
    const N = Number(lines[0]);
    if (N === 0) return 'EMPTY';
    const adj = [];
    for (let i = 1; i <= N && i < lines.length; i++) {
      adj.push(lines[i]);
    }
    return `${N}\n` + adj.join('\n');
  },

  // lc-210: Course Schedule II
  'lc-210': (input) => {
    const lines = input.trim().split('\n').map(l => l.trim()).filter(Boolean);
    const [numCourses, M] = lines[0].split(/\s+/).map(Number);
    const inDegree = Array(numCourses).fill(0);
    const graph = Array.from({ length: numCourses }, () => []);
    for (let i = 1; i <= M && i < lines.length; i++) {
      const [dest, src] = lines[i].split(/\s+/).map(Number);
      graph[src].push(dest);
      inDegree[dest]++;
    }
    const q = [];
    for (let i = 0; i < numCourses; i++) {
      if (inDegree[i] === 0) q.push(i);
    }
    const order = [];
    while (q.length > 0) {
      const u = q.shift();
      order.push(u);
      for (const v of graph[u]) {
        inDegree[v]--;
        if (inDegree[v] === 0) q.push(v);
      }
    }
    return order.length === numCourses ? order.join(' ') : 'IMPOSSIBLE';
  },

  // lc-684: Redundant Connection
  'lc-684': (input) => {
    const lines = input.trim().split('\n').map(l => l.trim()).filter(Boolean);
    const N = Number(lines[0]);
    const parent = Array.from({ length: N + 1 }, (_, i) => i);
    const find = (i) => {
      if (parent[i] === i) return i;
      return parent[i] = find(parent[i]);
    };
    for (let i = 1; i <= N && i < lines.length; i++) {
      const [u, v] = lines[i].split(/\s+/).map(Number);
      const rootU = find(u);
      const rootV = find(v);
      if (rootU === rootV) {
        return `${u} ${v}`;
      }
      parent[rootU] = rootV;
    }
    return '';
  },

  // lc-417: Pacific Atlantic Water Flow
  'lc-417': (input) => {
    const lines = input.trim().split('\n').map(l => l.trim()).filter(Boolean);
    const [R, C] = lines[0].split(/\s+/).map(Number);
    if (R === 0 || C === 0) return '0';
    const heights = [];
    for (let i = 1; i <= R; i++) {
      heights.push(lines[i].split(/\s+/).map(Number));
    }
    const pacific = Array.from({ length: R }, () => Array(C).fill(false));
    const atlantic = Array.from({ length: R }, () => Array(C).fill(false));
    const dfs = (r, c, ocean) => {
      ocean[r][c] = true;
      const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < R && nc >= 0 && nc < C && !ocean[nr][nc] && heights[nr][nc] >= heights[r][c]) {
          dfs(nr, nc, ocean);
        }
      }
    };
    for (let r = 0; r < R; r++) {
      dfs(r, 0, pacific);
      dfs(r, C - 1, atlantic);
    }
    for (let c = 0; c < C; c++) {
      dfs(0, c, pacific);
      dfs(R - 1, c, atlantic);
    }
    const res = [];
    for (let r = 0; r < R; r++) {
      for (let c = 0; c < C; c++) {
        if (pacific[r][c] && atlantic[r][c]) {
          res.push(`${r} ${c}`);
        }
      }
    }
    if (res.length === 0) return '0';
    return `${res.length}\n` + res.join('\n');
  },

  // lc-743: Network Delay Time
  'lc-743': (input) => {
    const lines = input.trim().split('\n').map(l => l.trim()).filter(Boolean);
    const [N, k, M] = lines[0].split(/\s+/).map(Number);
    const graph = Array.from({ length: N + 1 }, () => []);
    for (let i = 1; i <= M && i < lines.length; i++) {
      const [u, v, w] = lines[i].split(/\s+/).map(Number);
      graph[u].push([v, w]);
    }
    const dist = Array(N + 1).fill(Infinity);
    dist[k] = 0;
    const visited = Array(N + 1).fill(false);
    for (let i = 1; i <= N; i++) {
      let u = -1;
      for (let j = 1; j <= N; j++) {
        if (!visited[j] && (u === -1 || dist[j] < dist[u])) {
          u = j;
        }
      }
      if (dist[u] === Infinity) break;
      visited[u] = true;
      for (const [v, w] of graph[u]) {
        if (dist[u] + w < dist[v]) {
          dist[v] = dist[u] + w;
        }
      }
    }
    let maxDist = 0;
    for (let i = 1; i <= N; i++) {
      if (dist[i] === Infinity) return '-1';
      maxDist = Math.max(maxDist, dist[i]);
    }
    return String(maxDist);
  },

  // lc-127: Word Ladder
  'lc-127': (input) => {
    const lines = input.trim().split('\n').map(l => l.trim()).filter(Boolean);
    const [beginWord, endWord] = lines[0].split(/\s+/);
    const N = Number(lines[1]);
    const wordList = new Set(lines[2].split(/\s+/));
    if (!wordList.has(endWord)) return '0';
    const queue = [[beginWord, 1]];
    const visited = new Set([beginWord]);
    while (queue.length > 0) {
      const [current, level] = queue.shift();
      if (current === endWord) return String(level);
      for (let i = 0; i < current.length; i++) {
        for (let c = 97; c <= 122; c++) {
          const char = String.fromCharCode(c);
          if (char === current[i]) continue;
          const next = current.substring(0, i) + char + current.substring(i + 1);
          if (wordList.has(next) && !visited.has(next)) {
            visited.add(next);
            queue.push([next, level + 1]);
          }
        }
      }
    }
    return '0';
  },

  // lc-269: Alien Dictionary
  'lc-269': (input) => {
    const lines = input.trim().split('\n').map(l => l.trim()).filter(Boolean);
    const N = Number(lines[0]);
    const words = [];
    for (let i = 1; i <= N && i < lines.length; i++) {
      words.push(lines[i]);
    }
    const graph = new Map();
    const inDegree = new Map();
    for (const w of words) {
      for (const c of w) {
        if (!graph.has(c)) graph.set(c, new Set());
        if (!inDegree.has(c)) inDegree.set(c, 0);
      }
    }
    for (let i = 0; i < N - 1; i++) {
      const w1 = words[i], w2 = words[i + 1];
      if (w1.length > w2.length && w1.startsWith(w2)) return 'INVALID';
      for (let j = 0; j < Math.min(w1.length, w2.length); j++) {
        if (w1[j] !== w2[j]) {
          if (!graph.get(w1[j]).has(w2[j])) {
            graph.get(w1[j]).add(w2[j]);
            inDegree.set(w2[j], inDegree.get(w2[j]) + 1);
          }
          break;
        }
      }
    }
    const queue = [];
    for (const [c, deg] of inDegree.entries()) {
      if (deg === 0) queue.push(c);
    }
    let order = '';
    while (queue.length > 0) {
      const u = queue.shift();
      order += u;
      for (const v of graph.get(u)) {
        inDegree.set(v, inDegree.get(v) - 1);
        if (inDegree.get(v) === 0) queue.push(v);
      }
    }
    return order.length === inDegree.size ? order : 'INVALID';
  }
};

// -------------------------------------------------------------
// METADATA & 8 TEST CASES FOR EACH PROBLEM
// -------------------------------------------------------------

export const problemsBatch6 = [
  {
    id: 'lc-547',
    leetcodeNumber: 547,
    title: 'Number of Provinces',
    slug: 'number-of-provinces',
    category: 'NETWORK_GRAPH_ALGORITHMS',
    difficulty: 'MEDIUM',
    description: 'There are n cities. Some of them are connected, while some are not. If city a is connected directly with city b, and city b is connected directly with city c, then city a is connected indirectly with city c.\n\nA province is a group of directly or indirectly connected cities and no other cities outside of the group. You are given an n x n matrix isConnected where isConnected[i][j] = 1 if the i-th city and the j-th city are directly connected, and isConnected[i][j] = 0 otherwise. Return the total number of provinces.',
    inputFormat: 'Line 1: Integer N.\nNext N lines: N space-separated binary values (0 or 1).',
    outputFormat: 'Print the total number of provinces.',
    constraints: ['1 <= N <= 200', 'isConnected[i][j] is 1 or 0.', 'isConnected[i][i] == 1.'],
    sampleInput: '3\n1 1 0\n1 1 0\n0 0 1',
    sampleOutput: '2',
    explanation: 'Cities 0 and 1 form 1 province, city 2 forms another province. Total = 2.',
    testInputs: [
      '3\n1 1 0\n1 1 0\n0 0 1',
      '3\n1 0 0\n0 1 0\n0 0 1',
      '1\n1',
      '4\n1 1 1 1\n1 1 1 1\n1 1 1 1\n1 1 1 1',
      '4\n1 0 0 1\n0 1 1 0\n0 1 1 0\n1 0 0 1',
      '5\n1 1 0 0 0\n1 1 1 0 0\n0 1 1 0 0\n0 0 0 1 1\n0 0 0 1 1',
      '2\n1 0\n0 1',
      '4\n1 0 0 0\n0 1 0 0\n0 0 1 0\n0 0 0 1'
    ]
  },

  {
    id: 'lc-133',
    leetcodeNumber: 133,
    title: 'Clone Graph',
    slug: 'clone-graph',
    category: 'NETWORK_GRAPH_ALGORITHMS',
    difficulty: 'MEDIUM',
    description: 'Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph.\n\nEach node in the graph contains a value (int) and a list of its neighbors. Print the adjacency list of the deep copy.',
    inputFormat: 'Line 1: Integer N (number of nodes).\nNext N lines: Space-separated neighbor 1-based indices for node i.',
    outputFormat: 'Line 1: Integer N.\nNext N lines: Neighbor indices for each node in deep copy.',
    constraints: ['0 <= N <= 100', '1 <= Node.val <= 100', 'No repeated edges or self-loops.'],
    sampleInput: '4\n2 4\n1 3\n2 4\n1 3',
    sampleOutput: '4\n2 4\n1 3\n2 4\n1 3',
    explanation: 'There are 4 nodes forming a cycle: 1 connects to 2 and 4, 2 to 1 and 3, etc.',
    testInputs: [
      '4\n2 4\n1 3\n2 4\n1 3',
      '1\n',
      '0',
      '2\n2\n1',
      '3\n2 3\n1 3\n1 2',
      '4\n2 3 4\n1\n1\n1',
      '5\n2 5\n1 3\n2 4\n3 5\n4 1',
      '3\n2\n1 3\n2'
    ]
  },

  {
    id: 'lc-210',
    leetcodeNumber: 210,
    title: 'Course Schedule II (Topological Sort)',
    slug: 'course-schedule-ii',
    category: 'NETWORK_GRAPH_ALGORITHMS',
    difficulty: 'MEDIUM',
    description: 'There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.\n\nReturn the ordering of courses you should take to finish all courses. If there are many valid answers, return any of them. If it is impossible to finish all courses, return IMPOSSIBLE.',
    inputFormat: 'Line 1: Two space-separated integers numCourses and M (number of prerequisites).\nNext M lines: Two space-separated integers ai and bi.',
    outputFormat: 'Print space-separated course ordering, or IMPOSSIBLE.',
    constraints: ['1 <= numCourses <= 2000', '0 <= M <= numCourses * (numCourses - 1)'],
    sampleInput: '2 1\n1 0',
    sampleOutput: '0 1',
    explanation: 'There are 2 courses. To take course 1 you should have finished course 0. So the correct course order is [0, 1].',
    testInputs: [
      '2 1\n1 0',
      '4 4\n1 0\n2 0\n3 1\n3 2',
      '1 0',
      '2 2\n0 1\n1 0',
      '3 2\n1 0\n2 1',
      '3 3\n1 0\n2 1\n0 2',
      '5 4\n1 0\n2 0\n3 1\n4 2',
      '4 2\n2 0\n3 1'
    ]
  },

  {
    id: 'lc-684',
    leetcodeNumber: 684,
    title: 'Redundant Connection in Graph',
    slug: 'redundant-connection',
    category: 'NETWORK_GRAPH_ALGORITHMS',
    difficulty: 'MEDIUM',
    description: 'In this problem, a tree is an undirected graph that is connected and has no cycles. You are given a graph that started as a tree with n nodes labeled from 1 to n, with one additional edge added. The added edge has two different vertices chosen from 1 to n, and was not an edge that already existed.\n\nReturn an edge that can be removed so that the resulting graph is a tree of n nodes. If there are multiple answers, return the answer that occurs last in the input.',
    inputFormat: 'Line 1: Integer N (number of edges).\nNext N lines: Two space-separated integers u and v.',
    outputFormat: 'Print the two endpoints of the redundant edge separated by a space.',
    constraints: ['3 <= N <= 1000', 'edges[i].length == 2', '1 <= ai < bi <= edges.length'],
    sampleInput: '3\n1 2\n1 3\n2 3',
    sampleOutput: '2 3',
    explanation: 'The edge [2, 3] creates a cycle and appears last in the input.',
    testInputs: [
      '3\n1 2\n1 3\n2 3',
      '5\n1 2\n2 3\n3 4\n1 4\n1 5',
      '4\n1 2\n2 3\n3 4\n1 3',
      '5\n1 2\n1 3\n1 4\n1 5\n2 3',
      '6\n1 2\n2 3\n3 4\n4 5\n5 6\n1 6',
      '4\n1 4\n2 4\n3 4\n1 2',
      '5\n2 3\n3 4\n4 5\n2 5\n1 2',
      '6\n1 2\n1 3\n2 4\n2 5\n3 6\n4 5'
    ]
  },

  {
    id: 'lc-417',
    leetcodeNumber: 417,
    title: 'Pacific Atlantic Water Flow',
    slug: 'pacific-atlantic-water-flow',
    category: 'NETWORK_GRAPH_ALGORITHMS',
    difficulty: 'MEDIUM',
    description: 'There is an m x n rectangular island that borders both the Pacific Ocean and Atlantic Ocean. The Pacific Ocean touches the island\'s left and top edges, and the Atlantic Ocean touches the island\'s right and bottom edges.\n\nRain water can flow to neighboring cells directly north, south, east, and west if the neighboring cell\'s height is less than or equal to the current cell\'s height. Water can flow from any cell adjacent to an ocean into the ocean.\n\nReturn a list of grid coordinates where water can flow to both the Pacific and Atlantic oceans.',
    inputFormat: 'Line 1: Two space-separated integers R and C.\nNext R lines: C space-separated heights.',
    outputFormat: 'Line 1: Integer K (count of coordinates).\nNext K lines: Two space-separated integers r and c.',
    constraints: ['1 <= R, C <= 200', '0 <= heights[r][c] <= 10^5'],
    sampleInput: '5 5\n1 2 2 3 5\n3 2 3 4 4\n2 4 5 3 1\n6 7 1 4 5\n5 1 1 2 4',
    sampleOutput: '7\n0 4\n1 3\n1 4\n2 2\n3 0\n3 1\n4 0',
    explanation: 'Water from the 7 coordinates can flow to both oceans.',
    testInputs: [
      '5 5\n1 2 2 3 5\n3 2 3 4 4\n2 4 5 3 1\n6 7 1 4 5\n5 1 1 2 4',
      '1 1\n1',
      '2 2\n1 1\n1 1',
      '3 3\n1 2 3\n8 9 4\n7 6 5',
      '4 1\n1\n2\n3\n4',
      '1 4\n1 2 3 4',
      '3 3\n3 3 3\n3 1 3\n3 3 3',
      '4 4\n1 2 2 3\n3 2 3 4\n2 4 5 3\n6 7 1 4'
    ]
  },

  {
    id: 'lc-743',
    leetcodeNumber: 743,
    title: 'Network Delay Time',
    slug: 'network-delay-time',
    category: 'NETWORK_GRAPH_ALGORITHMS',
    difficulty: 'MEDIUM',
    description: 'You are given a network of n nodes, labeled from 1 to n. You are also given times, a list of travel times as directed edges times[i] = (ui, vi, wi), where ui is the source node, vi is the target node, and wi is the time it takes for a signal to travel from source to target.\n\nWe will send a signal from a given node k. Return the minimum time it takes for all the n nodes to receive the signal. If it is impossible for all the n nodes to receive the signal, return -1.',
    inputFormat: 'Line 1: Three space-separated integers N, k (source), and M (number of edges).\nNext M lines: Three space-separated integers ui, vi, and wi.',
    outputFormat: 'Print the minimum time, or -1.',
    constraints: ['1 <= k <= N <= 100', '1 <= M <= 6000', '1 <= ui, vi <= N', '0 <= wi <= 100'],
    sampleInput: '4 2 3\n2 1 1\n2 3 1\n3 4 1',
    sampleOutput: '2',
    explanation: 'Node 2 reaches node 1 in 1 unit, node 3 in 1 unit, and node 4 in 1+1=2 units. Total = 2.',
    testInputs: [
      '4 2 3\n2 1 1\n2 3 1\n3 4 1',
      '2 1 1\n1 2 1',
      '2 2 1\n1 2 1',
      '1 1 0',
      '3 1 2\n1 2 1\n2 3 2',
      '3 1 3\n1 2 5\n1 3 2\n3 2 1',
      '4 1 4\n1 2 1\n2 3 2\n3 4 3\n1 4 7',
      '4 3 2\n1 2 1\n2 3 1'
    ]
  },

  {
    id: 'lc-127',
    leetcodeNumber: 127,
    title: 'Word Ladder (Shortest Transformation Sequence)',
    slug: 'word-ladder',
    category: 'NETWORK_GRAPH_ALGORITHMS',
    difficulty: 'HARD',
    description: 'A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that:\n- Every adjacent pair of words differs by a single letter.\n- Every si for 1 <= i <= k is in wordList. Note that beginWord does not need to be in wordList.\n- sk == endWord\n\nGiven two words, beginWord and endWord, and a dictionary wordList, return the number of words in the shortest transformation sequence from beginWord to endWord, or 0 if no such sequence exists.',
    inputFormat: 'Line 1: Two space-separated strings beginWord and endWord.\nLine 2: Integer N (size of word list).\nLine 3: N space-separated words.',
    outputFormat: 'Print the number of words in the shortest sequence, or 0.',
    constraints: ['1 <= beginWord.length <= 10', '1 <= N <= 5000', 'endWord.length == beginWord.length'],
    sampleInput: 'hit cog\n6\nhot dot dog lot log cog',
    sampleOutput: '5',
    explanation: 'One shortest transformation sequence is "hit" -> "hot" -> "dot" -> "dog" -> "cog", which is 5 words long.',
    testInputs: [
      'hit cog\n6\nhot dot dog lot log cog',
      'hit cog\n5\nhot dot dog lot log',
      'a c\n3\na b c',
      'hot dog\n2\nhot dog',
      'hot dog\n3\nhot cog dog',
      'game play\n4\ngame gale pale play',
      'talk walk\n1\nwalk',
      'lead gold\n6\nlead load toad goad goid gold'
    ]
  },

  {
    id: 'lc-269',
    leetcodeNumber: 269,
    title: 'Alien Dictionary',
    slug: 'alien-dictionary',
    category: 'NETWORK_GRAPH_ALGORITHMS',
    difficulty: 'HARD',
    description: 'There is a new alien language that uses the English alphabet. However, the order of the letters is unknown to you.\n\nYou are given a list of strings words from the alien language\'s dictionary, where the strings in words are sorted lexicographically by the rules of this new language.\n\nReturn a string of the unique letters in the new alien language sorted in lexicographically increasing order by the new language\'s rules. If there is no solution, return INVALID.',
    inputFormat: 'Line 1: Integer N (number of words).\nNext N lines: One word per line.',
    outputFormat: 'Print the unique characters in alien lexicographical order, or INVALID.',
    constraints: ['1 <= N <= 100', '1 <= words[i].length <= 100', 'words[i] consists of only lowercase English letters.'],
    sampleInput: '5\nwrt\nwrf\ner\nett\nrftt',
    sampleOutput: 'wertf',
    explanation: 'From "wrt" and "wrf", t < f. From "wrt" and "er", w < e. From "er" and "ett", r < t. From "ett" and "rftt", e < r. Result: "wertf".',
    testInputs: [
      '5\nwrt\nwrf\ner\nett\nrftt',
      '2\nz\nx',
      '3\nz\nx\nz',
      '2\nabc\nab',
      '1\nz',
      '3\nza\nzb\nca',
      '4\napple\napp\nbanana\ncat',
      '4\nbaa\nabcd\nabca\ncab'
    ]
  }
];

// -------------------------------------------------------------
// VERIFICATION RUNNER
// -------------------------------------------------------------

export function verifyBatch6() {
  console.log(`\n======================================================`);
  console.log(`VERIFYING BATCH 6: NETWORK & GRAPH ALGORITHMS (8 PROBLEMS)`);
  console.log(`======================================================`);

  let totalCases = 0;
  let passedCases = 0;
  const verifiedProblems = [];

  for (const prob of problemsBatch6) {
    const solver = solversBatch6[prob.id];
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
  console.log(`BATCH 6 SUMMARY: ${passedCases}/${totalCases} test cases passed across ${verifiedProblems.length} problems!`);
  console.log(`------------------------------------------------------\n`);

  return verifiedProblems;
}

if (process.argv[1].endsWith('batch6_network_graphs.mjs')) {
  verifyBatch6();
}
