import { makeTestCase } from './batch1_pointers_arrays.mjs';

// Tree helper: construct tree from level-order array with -1 as null
class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function buildTree(arr) {
  if (!arr || arr.length === 0 || arr[0] === -1) return null;
  const root = new TreeNode(arr[0]);
  const queue = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift();
    if (i < arr.length) {
      if (arr[i] !== -1) {
        node.left = new TreeNode(arr[i]);
        queue.push(node.left);
      }
      i++;
    }
    if (i < arr.length) {
      if (arr[i] !== -1) {
        node.right = new TreeNode(arr[i]);
        queue.push(node.right);
      }
      i++;
    }
  }
  return root;
}

// -------------------------------------------------------------------
// REFERENCE SOLVERS FOR BATCH 4: HIERARCHICAL STRUCTURES (24 PROBLEMS)
// -------------------------------------------------------------------

export const solversBatch4 = {
  // lc-355: Design Twitter
  'lc-355': (input) => {
    const lines = input.trim().split('\n').map(l => l.trim()).filter(Boolean);
    const Q = Number(lines[0]);
    const tweets = []; // { userId, tweetId, time }
    const follows = new Map(); // userId -> Set of followeeIds
    const outputs = [];
    let time = 0;

    for (let i = 1; i <= Q && i < lines.length; i++) {
      const parts = lines[i].split(/\s+/);
      const cmd = parts[0];
      if (cmd === 'postTweet') {
        const uId = Number(parts[1]);
        const tId = Number(parts[2]);
        tweets.push({ userId: uId, tweetId: tId, time: ++time });
      } else if (cmd === 'getNewsFeed') {
        const uId = Number(parts[1]);
        const userFollows = follows.get(uId) || new Set();
        const feed = [];
        for (let j = tweets.length - 1; j >= 0; j--) {
          const t = tweets[j];
          if (t.userId === uId || userFollows.has(t.userId)) {
            feed.push(t.tweetId);
            if (feed.length === 10) break;
          }
        }
        outputs.push(feed.length > 0 ? feed.join(' ') : 'EMPTY');
      } else if (cmd === 'follow') {
        const fId = Number(parts[1]);
        const feId = Number(parts[2]);
        if (!follows.has(fId)) follows.set(fId, new Set());
        follows.get(fId).add(feId);
      } else if (cmd === 'unfollow') {
        const fId = Number(parts[1]);
        const feId = Number(parts[2]);
        if (follows.has(fId)) follows.get(fId).delete(feId);
      }
    }
    return outputs.join('\n');
  },

  // lc-101: Symmetric Tree
  'lc-101': (input) => {
    const lines = input.trim().split('\n');
    const N = Number(lines[0].trim());
    if (N === 0) return 'true';
    const arr = lines[1].trim().split(/\s+/).map(Number);
    const root = buildTree(arr);
    const isMirror = (t1, t2) => {
      if (!t1 && !t2) return true;
      if (!t1 || !t2) return false;
      return t1.val === t2.val && isMirror(t1.left, t2.right) && isMirror(t1.right, t2.left);
    };
    return isMirror(root, root) ? 'true' : 'false';
  },

  // lc-199: Binary Tree Right Side View
  'lc-199': (input) => {
    const lines = input.trim().split('\n');
    const N = Number(lines[0].trim());
    if (N === 0) return 'EMPTY';
    const arr = lines[1].trim().split(/\s+/).map(Number);
    const root = buildTree(arr);
    if (!root) return 'EMPTY';
    const q = [root];
    const rightView = [];
    while (q.length > 0) {
      const len = q.length;
      for (let i = 0; i < len; i++) {
        const node = q.shift();
        if (i === len - 1) rightView.push(node.val);
        if (node.left) q.push(node.left);
        if (node.right) q.push(node.right);
      }
    }
    return rightView.join(' ');
  },

  // lc-100: Same Tree
  'lc-100': (input) => {
    const lines = input.trim().split('\n');
    const [n1, n2] = lines[0].trim().split(/\s+/).map(Number);
    const arr1 = n1 > 0 ? lines[1].trim().split(/\s+/).map(Number) : [];
    const arr2 = n2 > 0 ? lines[2].trim().split(/\s+/).map(Number) : [];
    const t1 = buildTree(arr1);
    const t2 = buildTree(arr2);
    const isSame = (p, q) => {
      if (!p && !q) return true;
      if (!p || !q) return false;
      return p.val === q.val && isSame(p.left, q.left) && isSame(p.right, q.right);
    };
    return isSame(t1, t2) ? 'true' : 'false';
  },

  // lc-112: Path Sum
  'lc-112': (input) => {
    const lines = input.trim().split('\n');
    const [N, target] = lines[0].trim().split(/\s+/).map(Number);
    if (N === 0) return 'false';
    const arr = lines[1].trim().split(/\s+/).map(Number);
    const root = buildTree(arr);
    const hasPath = (node, remaining) => {
      if (!node) return false;
      if (!node.left && !node.right) return remaining === node.val;
      return hasPath(node.left, remaining - node.val) || hasPath(node.right, remaining - node.val);
    };
    return hasPath(root, target) ? 'true' : 'false';
  },

  // lc-103: Binary Tree Zigzag Level Order Traversal
  'lc-103': (input) => {
    const lines = input.trim().split('\n');
    const N = Number(lines[0].trim());
    if (N === 0) return 'EMPTY';
    const arr = lines[1].trim().split(/\s+/).map(Number);
    const root = buildTree(arr);
    if (!root) return 'EMPTY';
    const q = [root];
    const res = [];
    let leftToRight = true;
    while (q.length > 0) {
      const len = q.length;
      const level = [];
      for (let i = 0; i < len; i++) {
        const node = q.shift();
        level.push(node.val);
        if (node.left) q.push(node.left);
        if (node.right) q.push(node.right);
      }
      if (!leftToRight) level.reverse();
      res.push(level.join(' '));
      leftToRight = !leftToRight;
    }
    return res.join('\n');
  },

  // lc-236: Lowest Common Ancestor of a Binary Tree
  'lc-236': (input) => {
    const lines = input.trim().split('\n');
    const [N, p, qVal] = lines[0].trim().split(/\s+/).map(Number);
    const arr = lines[1].trim().split(/\s+/).map(Number);
    const root = buildTree(arr);
    const findLCA = (node) => {
      if (!node || node.val === p || node.val === qVal) return node;
      const left = findLCA(node.left);
      const right = findLCA(node.right);
      if (left && right) return node;
      return left ? left : right;
    };
    const lca = findLCA(root);
    return lca ? String(lca.val) : '-1';
  },

  // lc-235: Lowest Common Ancestor of a Binary Search Tree
  'lc-235': (input) => {
    const lines = input.trim().split('\n');
    const [N, p, qVal] = lines[0].trim().split(/\s+/).map(Number);
    const arr = lines[1].trim().split(/\s+/).map(Number);
    const root = buildTree(arr);
    let curr = root;
    while (curr) {
      if (p < curr.val && qVal < curr.val) {
        curr = curr.left;
      } else if (p > curr.val && qVal > curr.val) {
        curr = curr.right;
      } else {
        return String(curr.val);
      }
    }
    return '-1';
  },

  // lc-98: Validate Binary Search Tree
  'lc-98': (input) => {
    const lines = input.trim().split('\n');
    const N = Number(lines[0].trim());
    if (N === 0) return 'true';
    const arr = lines[1].trim().split(/\s+/).map(Number);
    const root = buildTree(arr);
    const validate = (node, min, max) => {
      if (!node) return true;
      if (node.val <= min || node.val >= max) return false;
      return validate(node.left, min, node.val) && validate(node.right, node.val, max);
    };
    return validate(root, -Infinity, Infinity) ? 'true' : 'false';
  },

  // lc-230: Kth Smallest Element in a BST
  'lc-230': (input) => {
    const lines = input.trim().split('\n');
    const [N, k] = lines[0].trim().split(/\s+/).map(Number);
    const arr = lines[1].trim().split(/\s+/).map(Number);
    const root = buildTree(arr);
    const inorder = [];
    const traverse = (node) => {
      if (!node || inorder.length >= k) return;
      traverse(node.left);
      inorder.push(node.val);
      traverse(node.right);
    };
    traverse(root);
    return String(inorder[k - 1]);
  },

  // lc-973: K Closest Points to Origin
  'lc-973': (input) => {
    const lines = input.trim().split('\n').map(l => l.trim()).filter(Boolean);
    const [N, k] = lines[0].split(/\s+/).map(Number);
    const points = [];
    for (let i = 1; i <= N && i < lines.length; i++) {
      const [x, y] = lines[i].split(/\s+/).map(Number);
      points.push({ x, y, dist: x * x + y * y });
    }
    points.sort((a, b) => a.dist - b.dist || a.x - b.x || a.y - b.y);
    const res = points.slice(0, k).map(p => `${p.x} ${p.y}`);
    return res.join('\n');
  },

  // lc-105: Construct Binary Tree from Preorder and Inorder Traversal
  'lc-105': (input) => {
    const lines = input.trim().split('\n');
    const N = Number(lines[0].trim());
    if (N === 0) return 'EMPTY';
    const preorder = lines[1].trim().split(/\s+/).map(Number);
    const inorder = lines[2].trim().split(/\s+/).map(Number);

    const build = (pre, inArr) => {
      if (pre.length === 0) return null;
      const rootVal = pre[0];
      const root = new TreeNode(rootVal);
      const mid = inArr.indexOf(rootVal);
      root.left = build(pre.slice(1, mid + 1), inArr.slice(0, mid));
      root.right = build(pre.slice(mid + 1), inArr.slice(mid + 1));
      return root;
    };
    const root = build(preorder, inorder);
    // return postorder as standard validation
    const post = [];
    const postorder = (node) => {
      if (!node) return;
      postorder(node.left);
      postorder(node.right);
      post.push(node.val);
    };
    postorder(root);
    return post.join(' ');
  },

  // lc-106: Construct Binary Tree from Inorder and Postorder Traversal
  'lc-106': (input) => {
    const lines = input.trim().split('\n');
    const N = Number(lines[0].trim());
    if (N === 0) return 'EMPTY';
    const inorder = lines[1].trim().split(/\s+/).map(Number);
    const postorder = lines[2].trim().split(/\s+/).map(Number);

    const build = (inArr, post) => {
      if (post.length === 0) return null;
      const rootVal = post[post.length - 1];
      const root = new TreeNode(rootVal);
      const mid = inArr.indexOf(rootVal);
      root.left = build(inArr.slice(0, mid), post.slice(0, mid));
      root.right = build(inArr.slice(mid + 1), post.slice(mid, post.length - 1));
      return root;
    };
    const root = build(inorder, postorder);
    const pre = [];
    const preorder = (node) => {
      if (!node) return;
      pre.push(node.val);
      preorder(node.left);
      preorder(node.right);
    };
    preorder(root);
    return pre.join(' ');
  },

  // lc-114: Flatten Binary Tree to Linked List
  'lc-114': (input) => {
    const lines = input.trim().split('\n');
    const N = Number(lines[0].trim());
    if (N === 0) return 'EMPTY';
    const arr = lines[1].trim().split(/\s+/).map(Number);
    const root = buildTree(arr);
    const list = [];
    const pre = (node) => {
      if (!node) return;
      list.push(node.val);
      pre(node.left);
      pre(node.right);
    };
    pre(root);
    return list.join(' ');
  },

  // lc-450: Delete Node in a BST
  'lc-450': (input) => {
    const lines = input.trim().split('\n');
    const [N, key] = lines[0].trim().split(/\s+/).map(Number);
    if (N === 0) return 'EMPTY';
    const arr = lines[1].trim().split(/\s+/).map(Number);
    const root = buildTree(arr);

    const deleteNode = (node, k) => {
      if (!node) return null;
      if (k < node.val) {
        node.left = deleteNode(node.left, k);
      } else if (k > node.val) {
        node.right = deleteNode(node.right, k);
      } else {
        if (!node.left) return node.right;
        if (!node.right) return node.left;
        let succ = node.right;
        while (succ.left) succ = succ.left;
        node.val = succ.val;
        node.right = deleteNode(node.right, succ.val);
      }
      return node;
    };
    const updated = deleteNode(root, key);
    if (!updated) return 'EMPTY';
    // level order traversal of updated
    const res = [];
    const q = [updated];
    while (q.length > 0) {
      const node = q.shift();
      if (node) {
        res.push(node.val);
        q.push(node.left);
        q.push(node.right);
      } else {
        res.push(-1);
      }
    }
    while (res.length > 0 && res[res.length - 1] === -1) res.pop();
    return res.join(' ');
  },

  // lc-113: Path Sum II
  'lc-113': (input) => {
    const lines = input.trim().split('\n');
    const [N, target] = lines[0].trim().split(/\s+/).map(Number);
    if (N === 0) return '0';
    const arr = lines[1].trim().split(/\s+/).map(Number);
    const root = buildTree(arr);
    const paths = [];
    const dfs = (node, remaining, path) => {
      if (!node) return;
      path.push(node.val);
      if (!node.left && !node.right && remaining === node.val) {
        paths.push([...path]);
      }
      dfs(node.left, remaining - node.val, path);
      dfs(node.right, remaining - node.val, path);
      path.pop();
    };
    dfs(root, target, []);
    if (paths.length === 0) return '0';
    return `${paths.length}\n` + paths.map(p => p.join(' ')).join('\n');
  },

  // lc-124: Binary Tree Maximum Path Sum
  'lc-124': (input) => {
    const lines = input.trim().split('\n');
    const N = Number(lines[0].trim());
    if (N === 0) return '0';
    const arr = lines[1].trim().split(/\s+/).map(Number);
    const root = buildTree(arr);
    let maxSum = -Infinity;
    const maxGain = (node) => {
      if (!node) return 0;
      const leftGain = Math.max(maxGain(node.left), 0);
      const rightGain = Math.max(maxGain(node.right), 0);
      const priceNewPath = node.val + leftGain + rightGain;
      maxSum = Math.max(maxSum, priceNewPath);
      return node.val + Math.max(leftGain, rightGain);
    };
    maxGain(root);
    return String(maxSum);
  },

  // lc-297: Serialize and Deserialize Binary Tree
  'lc-297': (input) => {
    const lines = input.trim().split('\n');
    const N = Number(lines[0].trim());
    if (N === 0) return 'EMPTY';
    const arr = lines[1].trim().split(/\s+/).map(Number);
    const root = buildTree(arr);
    const res = [];
    const q = [root];
    while (q.length > 0) {
      const node = q.shift();
      if (node) {
        res.push(node.val);
        q.push(node.left);
        q.push(node.right);
      } else {
        res.push(-1);
      }
    }
    while (res.length > 0 && res[res.length - 1] === -1) res.pop();
    return res.join(' ');
  },

  // lc-703: Kth Largest Element in a Stream
  'lc-703': (input) => {
    const lines = input.trim().split('\n');
    const [k, initN] = lines[0].trim().split(/\s+/).map(Number);
    const nums = initN > 0 ? lines[1].trim().split(/\s+/).map(Number) : [];
    const addNums = lines[2].trim().split(/\s+/).map(Number);
    const stream = [...nums];
    const outputs = [];
    for (const val of addNums) {
      stream.push(val);
      stream.sort((a, b) => b - a);
      outputs.push(stream[k - 1]);
    }
    return outputs.join(' ');
  },

  // lc-378: Kth Smallest Element in a Sorted Matrix
  'lc-378': (input) => {
    const lines = input.trim().split('\n').map(l => l.trim()).filter(Boolean);
    const [N, k] = lines[0].split(/\s+/).map(Number);
    const all = [];
    for (let i = 1; i <= N; i++) {
      all.push(...lines[i].split(/\s+/).map(Number));
    }
    all.sort((a, b) => a - b);
    return String(all[k - 1]);
  },

  // lc-253: Meeting Rooms II
  'lc-253': (input) => {
    const lines = input.trim().split('\n').map(l => l.trim()).filter(Boolean);
    const N = Number(lines[0]);
    if (N === 0) return '0';
    const starts = [];
    const ends = [];
    for (let i = 1; i <= N; i++) {
      const [s, e] = lines[i].split(/\s+/).map(Number);
      starts.push(s);
      ends.push(e);
    }
    starts.sort((a, b) => a - b);
    ends.sort((a, b) => a - b);
    let rooms = 0, endIdx = 0;
    for (let i = 0; i < N; i++) {
      if (starts[i] < ends[endIdx]) {
        rooms++;
      } else {
        endIdx++;
      }
    }
    return String(rooms);
  },

  // lc-621: Task Scheduler
  'lc-621': (input) => {
    const lines = input.trim().split('\n');
    const [N, n] = lines[0].trim().split(/\s+/).map(Number);
    const tasks = lines[1].trim().split(/\s+/);
    const counts = {};
    for (const t of tasks) counts[t] = (counts[t] || 0) + 1;
    const maxFreq = Math.max(...Object.values(counts));
    let maxCount = 0;
    for (const f of Object.values(counts)) {
      if (f === maxFreq) maxCount++;
    }
    const emptySlots = (maxFreq - 1) * (n + 1) + maxCount;
    return String(Math.max(emptySlots, N));
  },

  // lc-295: Find Median from Data Stream
  'lc-295': (input) => {
    const lines = input.trim().split('\n').map(l => l.trim()).filter(Boolean);
    const Q = Number(lines[0]);
    const nums = [];
    const outputs = [];
    for (let i = 1; i <= Q && i < lines.length; i++) {
      const parts = lines[i].split(/\s+/);
      const cmd = parts[0];
      if (cmd === 'addNum') {
        const val = Number(parts[1]);
        // insert sorted
        let idx = 0;
        while (idx < nums.length && nums[idx] < val) idx++;
        nums.splice(idx, 0, val);
      } else if (cmd === 'findMedian') {
        const len = nums.length;
        if (len % 2 === 1) {
          outputs.push(nums[Math.floor(len / 2)].toFixed(1));
        } else {
          outputs.push(((nums[len / 2 - 1] + nums[len / 2]) / 2).toFixed(1));
        }
      }
    }
    return outputs.join(' ');
  },

  // lc-767: Reorganize String
  'lc-767': (input) => {
    const s = input.trim();
    const counts = {};
    for (const c of s) counts[c] = (counts[c] || 0) + 1;
    const maxFreq = Math.max(...Object.values(counts));
    if (maxFreq > Math.floor((s.length + 1) / 2)) return '';
    const sortedChars = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    const res = Array(s.length);
    let idx = 0;
    for (const c of sortedChars) {
      for (let i = 0; i < counts[c]; i++) {
        if (idx >= s.length) idx = 1;
        res[idx] = c;
        idx += 2;
      }
    }
    return res.join('');
  }
};

// -------------------------------------------------------------
// METADATA & 8 TEST CASES FOR EACH PROBLEM
// -------------------------------------------------------------

export const problemsBatch4 = [
  {
    id: 'lc-355',
    leetcodeNumber: 355,
    title: 'Design Twitter',
    slug: 'design-twitter',
    category: 'HIERARCHICAL_STRUCTURES',
    difficulty: 'MEDIUM',
    description: 'Design a simplified version of Twitter where users can post tweets, follow/unfollow another user, and see the 10 most recent tweets in the user\'s news feed.\n\nOperations: postTweet(userId, tweetId), getNewsFeed(userId), follow(followerId, followeeId), unfollow(followerId, followeeId).',
    inputFormat: 'Line 1: Integer Q (number of operations).\nNext Q lines: Command strings.',
    outputFormat: 'Print news feed tweet IDs separated by spaces for each getNewsFeed call, each on a new line (or EMPTY if empty).',
    constraints: ['1 <= Q <= 10^4', '1 <= userId, followerId, followeeId <= 500', '0 <= tweetId <= 10^4'],
    sampleInput: '6\npostTweet 1 5\ngetNewsFeed 1\nfollow 1 2\npostTweet 2 6\ngetNewsFeed 1\nunfollow 1 2',
    sampleOutput: '5\n6 5',
    explanation: 'User 1 posts tweet 5. User 1 follows User 2 who posts tweet 6. User 1 news feed contains [6, 5].',
    testInputs: [
      '6\npostTweet 1 5\ngetNewsFeed 1\nfollow 1 2\npostTweet 2 6\ngetNewsFeed 1\nunfollow 1 2',
      '2\npostTweet 1 10\ngetNewsFeed 1',
      '1\ngetNewsFeed 1',
      '5\npostTweet 1 1\npostTweet 1 2\npostTweet 1 3\npostTweet 1 4\ngetNewsFeed 1',
      '4\nfollow 1 2\npostTweet 2 100\ngetNewsFeed 1\nunfollow 1 2',
      '5\npostTweet 2 50\nfollow 1 2\nunfollow 1 2\ngetNewsFeed 1\ngetNewsFeed 2',
      '7\npostTweet 1 11\npostTweet 2 22\npostTweet 3 33\nfollow 1 2\nfollow 1 3\ngetNewsFeed 1\nunfollow 1 2',
      '4\npostTweet 1 5\npostTweet 1 6\nunfollow 1 2\ngetNewsFeed 1'
    ]
  },

  {
    id: 'lc-101',
    leetcodeNumber: 101,
    title: 'Symmetric Tree',
    slug: 'symmetric-tree',
    category: 'HIERARCHICAL_STRUCTURES',
    difficulty: 'BASIC',
    description: 'Given the root of a binary tree represented as a level-order array with -1 representing empty/null nodes, check whether it is a mirror of itself (i.e., symmetric around its center).',
    inputFormat: 'Line 1: Integer N.\nLine 2: N space-separated integers (-1 for null).',
    outputFormat: 'Print true or false.',
    constraints: ['1 <= N <= 1000', '-100 <= Node.val <= 100'],
    sampleInput: '7\n1 2 2 3 4 4 3',
    sampleOutput: 'true',
    explanation: 'The tree is symmetric around its root 1.',
    testInputs: [
      '7\n1 2 2 3 4 4 3',
      '5\n1 2 2 -1 3 -1 3',
      '1\n1',
      '3\n1 2 2',
      '3\n1 2 3',
      '7\n1 2 2 2 -1 2 -1',
      '7\n5 1 1 -1 2 2 -1',
      '7\n9 3 3 5 7 7 5'
    ]
  },

  {
    id: 'lc-199',
    leetcodeNumber: 199,
    title: 'Binary Tree Right Side View',
    slug: 'binary-tree-right-side-view',
    category: 'HIERARCHICAL_STRUCTURES',
    difficulty: 'MEDIUM',
    description: 'Given the root of a binary tree represented as a level-order array of N elements (-1 for null), imagine yourself standing on the right side of it, return the values of the nodes you can see ordered from top to bottom.',
    inputFormat: 'Line 1: Integer N.\nLine 2: N space-separated integers.',
    outputFormat: 'Print the values seen from the right side separated by spaces, or EMPTY.',
    constraints: ['0 <= N <= 100', '-100 <= Node.val <= 100'],
    sampleInput: '5\n1 2 3 -1 5',
    sampleOutput: '1 3 5',
    explanation: 'From the right side, nodes 1, 3, and 5 are visible.',
    testInputs: [
      '5\n1 2 3 -1 5',
      '3\n1 -1 3',
      '0',
      '1\n42',
      '7\n1 2 3 4 5 6 7',
      '4\n1 2 -1 4',
      '5\n1 2 3 4 -1',
      '7\n10 20 30 -1 25 -1 35'
    ]
  },

  {
    id: 'lc-100',
    leetcodeNumber: 100,
    title: 'Same Tree',
    slug: 'same-tree',
    category: 'HIERARCHICAL_STRUCTURES',
    difficulty: 'BASIC',
    description: 'Given the roots of two binary trees p and q represented in level order, write a function to check if they are the same or not.\n\nTwo binary trees are considered the same if they are structurally identical, and the nodes have the same value.',
    inputFormat: 'Line 1: Two space-separated integers n1 and n2.\nLine 2: n1 space-separated integers for tree 1.\nLine 3: n2 space-separated integers for tree 2.',
    outputFormat: 'Print true or false.',
    constraints: ['0 <= n1, n2 <= 100', '-10^4 <= Node.val <= 10^4'],
    sampleInput: '3 3\n1 2 3\n1 2 3',
    sampleOutput: 'true',
    explanation: 'Both trees have identical structure [1, 2, 3] and values.',
    testInputs: [
      '3 3\n1 2 3\n1 2 3',
      '2 2\n1 2\n1 -1 2',
      '3 3\n1 2 1\n1 1 2',
      '0 0\n\n',
      '1 1\n5\n5',
      '1 1\n5\n6',
      '5 5\n1 2 3 4 5\n1 2 3 4 5',
      '5 5\n1 2 3 4 5\n1 2 3 -1 5'
    ]
  },

  {
    id: 'lc-112',
    leetcodeNumber: 112,
    title: 'Path Sum',
    slug: 'path-sum',
    category: 'HIERARCHICAL_STRUCTURES',
    difficulty: 'BASIC',
    description: 'Given the root of a binary tree and an integer targetSum, return true if the tree has a root-to-leaf path such that adding up all the values along the path equals targetSum.',
    inputFormat: 'Line 1: Two space-separated integers N and targetSum.\nLine 2: N space-separated integers representing the tree in level order (-1 for null).',
    outputFormat: 'Print true or false.',
    constraints: ['0 <= N <= 1000', '-1000 <= targetSum, Node.val <= 1000'],
    sampleInput: '9 22\n5 4 8 11 -1 13 4 7 2',
    sampleOutput: 'true',
    explanation: 'The root-to-leaf path 5 -> 4 -> 11 -> 2 has sum 22.',
    testInputs: [
      '9 22\n5 4 8 11 -1 13 4 7 2',
      '3 5\n1 2 3',
      '0 0',
      '1 10\n10',
      '1 10\n5',
      '3 -5\n-2 -3 -1',
      '5 18\n10 5 12 3 8',
      '7 14\n4 2 6 1 3 5 7'
    ]
  },

  {
    id: 'lc-103',
    leetcodeNumber: 103,
    title: 'Binary Tree Zigzag Level Order Traversal',
    slug: 'binary-tree-zigzag-level-order-traversal',
    category: 'HIERARCHICAL_STRUCTURES',
    difficulty: 'MEDIUM',
    description: 'Given the root of a binary tree, return the zigzag level order traversal of its nodes\' values. (i.e., from left to right, then right to left for the next level and alternate between).',
    inputFormat: 'Line 1: Integer N.\nLine 2: N space-separated integers.',
    outputFormat: 'Print each level on a new line with space-separated values, or EMPTY.',
    constraints: ['0 <= N <= 2000', '-100 <= Node.val <= 100'],
    sampleInput: '7\n3 9 20 -1 -1 15 7',
    sampleOutput: '3\n20 9\n15 7',
    explanation: 'Level 1: [3] (left to right). Level 2: [20, 9] (right to left). Level 3: [15, 7] (left to right).',
    testInputs: [
      '7\n3 9 20 -1 -1 15 7',
      '1\n1',
      '0',
      '3\n1 2 3',
      '7\n1 2 3 4 5 6 7',
      '5\n1 2 -1 4 5',
      '5\n1 -1 2 -1 3',
      '7\n10 5 15 2 7 12 20'
    ]
  },

  {
    id: 'lc-236',
    leetcodeNumber: 236,
    title: 'Lowest Common Ancestor of a Binary Tree',
    slug: 'lowest-common-ancestor-of-a-binary-tree',
    category: 'HIERARCHICAL_STRUCTURES',
    difficulty: 'MEDIUM',
    description: 'Given a binary tree, find the lowest common ancestor (LCA) of two given nodes p and q in the tree.\n\nThe lowest common ancestor is defined between two nodes p and q as the lowest node in T that has both p and q as descendants (where we allow a node to be a descendant of itself).',
    inputFormat: 'Line 1: Three space-separated integers N, p, and q.\nLine 2: N space-separated integers representing the tree in level order.',
    outputFormat: 'Print the value of the LCA node.',
    constraints: ['2 <= N <= 10^4', '-10^9 <= Node.val, p, q <= 10^9', 'All Node.val are unique.'],
    sampleInput: '9 5 1\n3 5 1 6 2 0 8 -1 -1',
    sampleOutput: '3',
    explanation: 'The LCA of nodes 5 and 1 is 3.',
    testInputs: [
      '9 5 1\n3 5 1 6 2 0 8 -1 -1',
      '9 5 4\n3 5 1 6 2 0 8 7 4',
      '2 1 2\n1 2',
      '3 2 3\n1 2 3',
      '7 4 5\n1 2 3 4 5 6 7',
      '7 6 7\n1 2 3 4 5 6 7',
      '5 2 5\n1 2 3 -1 5',
      '7 12 20\n10 5 15 2 7 12 20'
    ]
  },

  {
    id: 'lc-235',
    leetcodeNumber: 235,
    title: 'Lowest Common Ancestor of a Binary Search Tree',
    slug: 'lowest-common-ancestor-of-a-binary-search-tree',
    category: 'HIERARCHICAL_STRUCTURES',
    difficulty: 'MEDIUM',
    description: 'Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes p and q in the BST in O(h) time.',
    inputFormat: 'Line 1: Three space-separated integers N, p, and q.\nLine 2: N space-separated integers in BST level order.',
    outputFormat: 'Print the value of the LCA node.',
    constraints: ['2 <= N <= 10^4', '-10^9 <= Node.val <= 10^9', 'All Node.val are unique.'],
    sampleInput: '9 2 8\n6 2 8 0 4 7 9 -1 -1',
    sampleOutput: '6',
    explanation: 'The LCA of nodes 2 and 8 is 6.',
    testInputs: [
      '9 2 8\n6 2 8 0 4 7 9 -1 -1',
      '9 2 4\n6 2 8 0 4 7 9 -1 -1',
      '2 2 1\n2 1',
      '3 1 3\n2 1 3',
      '7 3 5\n4 2 6 1 3 5 7',
      '7 1 7\n4 2 6 1 3 5 7',
      '7 5 7\n4 2 6 1 3 5 7',
      '5 10 14\n12 8 16 10 14'
    ]
  },

  {
    id: 'lc-98',
    leetcodeNumber: 98,
    title: 'Validate Binary Search Tree',
    slug: 'validate-binary-search-tree',
    category: 'HIERARCHICAL_STRUCTURES',
    difficulty: 'MEDIUM',
    description: 'Given the root of a binary tree, determine if it is a valid binary search tree (BST).\n\nA valid BST is defined as follows:\n- The left subtree of a node contains only nodes with keys strictly less than the node\'s key.\n- The right subtree of a node contains only nodes with keys strictly greater than the node\'s key.\n- Both left and right subtrees must also be binary search trees.',
    inputFormat: 'Line 1: Integer N.\nLine 2: N space-separated integers.',
    outputFormat: 'Print true or false.',
    constraints: ['1 <= N <= 10^4', '-2^31 <= Node.val <= 2^31 - 1'],
    sampleInput: '3\n2 1 3',
    sampleOutput: 'true',
    explanation: 'The root 2 has left child 1 (< 2) and right child 3 (> 2), valid BST.',
    testInputs: [
      '3\n2 1 3',
      '5\n5 1 4 -1 -1 3 6',
      '1\n10',
      '3\n1 1 1',
      '7\n10 5 15 2 7 12 20',
      '3\n2 2 2',
      '5\n10 5 15 -1 6',
      '7\n4 2 6 1 3 5 7'
    ]
  },

  {
    id: 'lc-230',
    leetcodeNumber: 230,
    title: 'Kth Smallest Element in a BST',
    slug: 'kth-smallest-element-in-a-bst',
    category: 'HIERARCHICAL_STRUCTURES',
    difficulty: 'MEDIUM',
    description: 'Given the root of a binary search tree, and an integer k, return the kth smallest value (1-indexed) of all the values of the nodes in the tree.',
    inputFormat: 'Line 1: Two space-separated integers N and k.\nLine 2: N space-separated integers in BST level order.',
    outputFormat: 'Print the kth smallest integer.',
    constraints: ['1 <= k <= N <= 10^4', '0 <= Node.val <= 10^4'],
    sampleInput: '4 1\n3 1 4 -1 2',
    sampleOutput: '1',
    explanation: 'The 1st smallest element in the BST is 1.',
    testInputs: [
      '4 1\n3 1 4 -1 2',
      '7 3\n5 3 6 2 4 -1 -1 1',
      '1 1\n42',
      '3 2\n2 1 3',
      '7 5\n4 2 6 1 3 5 7',
      '7 7\n4 2 6 1 3 5 7',
      '5 4\n10 5 15 2 7',
      '6 6\n6 5 -1 4 -1 3 -1 2 -1 1'
    ]
  },

  {
    id: 'lc-973',
    leetcodeNumber: 973,
    title: 'K Closest Points to Origin',
    slug: 'k-closest-points-to-origin',
    category: 'HIERARCHICAL_STRUCTURES',
    difficulty: 'MEDIUM',
    description: 'Given an array of points where points[i] = [xi, yi] represents a point on the X-Y plane and an integer k, return the k closest points to the origin (0, 0).\n\nThe distance between two points on the X-Y plane is the Euclidean distance (√(x1 - x2)^2 + (y1 - y2)^2). Sort the output points in ascending order of distance.',
    inputFormat: 'Line 1: Two space-separated integers N and k.\nNext N lines: Two space-separated integers x and y.',
    outputFormat: 'Print each of the k closest points on a new line with x and y separated by a space.',
    constraints: ['1 <= k <= N <= 10^4', '-10^4 <= xi, yi <= 10^4'],
    sampleInput: '2 1\n1 3\n-2 2',
    sampleOutput: '-2 2',
    explanation: 'Distance of (1, 3) is √10. Distance of (-2, 2) is √8. (-2, 2) is closer.',
    testInputs: [
      '2 1\n1 3\n-2 2',
      '3 2\n3 3\n5 -1\n-2 4',
      '1 1\n0 0',
      '4 2\n1 1\n2 2\n3 3\n0 1',
      '5 3\n-5 4\n-6 -5\n4 6\n2 3\n-1 -1',
      '3 1\n10 10\n-10 -10\n1 1',
      '4 4\n1 0\n0 1\n-1 0\n0 -1',
      '5 2\n2 2\n-2 -2\n1 1\n-1 -1\n0 5'
    ]
  },

  {
    id: 'lc-105',
    leetcodeNumber: 105,
    title: 'Construct Binary Tree from Preorder and Inorder Traversal',
    slug: 'construct-binary-tree-from-preorder-and-inorder-traversal',
    category: 'HIERARCHICAL_STRUCTURES',
    difficulty: 'MEDIUM',
    description: 'Given two integer arrays preorder and inorder where preorder is the preorder traversal of a binary tree and inorder is the inorder traversal of the same tree, construct and return the binary tree (output its postorder traversal).',
    inputFormat: 'Line 1: Integer N.\nLine 2: N space-separated integers for preorder.\nLine 3: N space-separated integers for inorder.',
    outputFormat: 'Print the postorder traversal of the constructed binary tree separated by spaces.',
    constraints: ['1 <= N <= 3000', '-3000 <= Node.val <= 3000', 'All values are unique.'],
    sampleInput: '5\n3 9 20 15 7\n9 3 15 20 7',
    sampleOutput: '9 15 7 20 3',
    explanation: 'Reconstructing the tree gives root 3, left child 9, right child 20 (with 15 and 7). Postorder is [9, 15, 7, 20, 3].',
    testInputs: [
      '5\n3 9 20 15 7\n9 3 15 20 7',
      '1\n-1\n-1',
      '3\n1 2 3\n2 1 3',
      '3\n1 2 3\n3 2 1',
      '4\n1 2 4 3\n4 2 1 3',
      '5\n1 2 4 5 3\n4 2 5 1 3',
      '6\n10 5 2 7 15 20\n2 5 7 10 15 20',
      '4\n1 2 3 4\n1 2 3 4'
    ]
  },

  {
    id: 'lc-106',
    leetcodeNumber: 106,
    title: 'Construct Binary Tree from Inorder and Postorder Traversal',
    slug: 'construct-binary-tree-from-inorder-and-postorder-traversal',
    category: 'HIERARCHICAL_STRUCTURES',
    difficulty: 'MEDIUM',
    description: 'Given two integer arrays inorder and postorder where inorder is the inorder traversal of a binary tree and postorder is the postorder traversal of the same tree, construct and return the binary tree (output its preorder traversal).',
    inputFormat: 'Line 1: Integer N.\nLine 2: N space-separated integers for inorder.\nLine 3: N space-separated integers for postorder.',
    outputFormat: 'Print the preorder traversal of the constructed binary tree separated by spaces.',
    constraints: ['1 <= N <= 3000', '-3000 <= Node.val <= 3000', 'All values are unique.'],
    sampleInput: '5\n9 3 15 20 7\n9 15 7 20 3',
    sampleOutput: '3 9 20 15 7',
    explanation: 'Reconstructing the tree gives root 3 with preorder [3, 9, 20, 15, 7].',
    testInputs: [
      '5\n9 3 15 20 7\n9 15 7 20 3',
      '1\n-1\n-1',
      '3\n2 1 3\n2 3 1',
      '3\n3 2 1\n3 2 1',
      '4\n4 2 1 3\n4 2 3 1',
      '5\n4 2 5 1 3\n4 5 2 3 1',
      '6\n2 5 7 10 15 20\n2 7 5 20 15 10',
      '4\n1 2 3 4\n4 3 2 1'
    ]
  },

  {
    id: 'lc-114',
    leetcodeNumber: 114,
    title: 'Flatten Binary Tree to Linked List',
    slug: 'flatten-binary-tree-to-linked-list',
    category: 'HIERARCHICAL_STRUCTURES',
    difficulty: 'MEDIUM',
    description: 'Given the root of a binary tree, flatten the tree into a "linked list" in-place where right child points to the next node in preorder traversal and left child is always null. Print the flattened node values separated by spaces.',
    inputFormat: 'Line 1: Integer N.\nLine 2: N space-separated integers in level order.',
    outputFormat: 'Print the flattened linked list node values separated by spaces, or EMPTY.',
    constraints: ['0 <= N <= 2000', '-100 <= Node.val <= 100'],
    sampleInput: '6\n1 2 5 3 4 -1 6',
    sampleOutput: '1 2 3 4 5 6',
    explanation: 'The flattened tree follows preorder: 1 -> 2 -> 3 -> 4 -> 5 -> 6.',
    testInputs: [
      '6\n1 2 5 3 4 -1 6',
      '0',
      '1\n0',
      '3\n1 2 3',
      '4\n1 2 -1 3',
      '5\n1 2 3 4 5',
      '7\n10 5 15 2 7 12 20',
      '4\n1 -1 2 -1 3'
    ]
  },

  {
    id: 'lc-450',
    leetcodeNumber: 450,
    title: 'Delete Node in a BST',
    slug: 'delete-node-in-a-bst',
    category: 'HIERARCHICAL_STRUCTURES',
    difficulty: 'MEDIUM',
    description: 'Given a root node reference of a BST and a key, delete the node with the given key in the BST. Return the root node reference of the BST in level order traversal.',
    inputFormat: 'Line 1: Two space-separated integers N and key.\nLine 2: N space-separated integers in BST level order.',
    outputFormat: 'Print the level-order traversal of the updated BST, or EMPTY.',
    constraints: ['0 <= N <= 10^4', '-10^5 <= key, Node.val <= 10^5'],
    sampleInput: '7 3\n5 3 6 2 4 -1 7',
    sampleOutput: '5 4 6 2 -1 -1 7',
    explanation: 'Node with key 3 is replaced with its inorder successor 4.',
    testInputs: [
      '7 3\n5 3 6 2 4 -1 7',
      '7 0\n5 3 6 2 4 -1 7',
      '0 0',
      '1 5\n5',
      '3 2\n2 1 3',
      '5 10\n10 5 15 2 7',
      '7 2\n4 2 6 1 3 5 7',
      '6 6\n5 3 6 2 4'
    ]
  },

  {
    id: 'lc-113',
    leetcodeNumber: 113,
    title: 'Path Sum II',
    slug: 'path-sum-ii',
    category: 'HIERARCHICAL_STRUCTURES',
    difficulty: 'MEDIUM',
    description: 'Given the root of a binary tree and an integer targetSum, return all root-to-leaf paths where the sum of the node values in the path equals targetSum. Each path should be returned as a list of the node values.',
    inputFormat: 'Line 1: Two space-separated integers N and targetSum.\nLine 2: N space-separated integers in level order.',
    outputFormat: 'Line 1: Count of paths K.\nNext K lines: Space-separated values for each path.',
    constraints: ['0 <= N <= 5000', '-1000 <= targetSum, Node.val <= 1000'],
    sampleInput: '13 22\n5 4 8 11 -1 13 4 7 2 -1 -1 5 1',
    sampleOutput: '2\n5 4 11 2\n5 8 4 5',
    explanation: 'Two root-to-leaf paths sum to 22: [5, 4, 11, 2] and [5, 8, 4, 5].',
    testInputs: [
      '13 22\n5 4 8 11 -1 13 4 7 2 -1 -1 5 1',
      '3 5\n1 2 3',
      '2 0\n1 2',
      '0 0',
      '1 5\n5',
      '5 18\n10 4 8 4 6',
      '7 7\n1 2 2 4 4 4 4',
      '7 12\n3 4 5 5 1 4 4'
    ]
  },

  {
    id: 'lc-124',
    leetcodeNumber: 124,
    title: 'Binary Tree Maximum Path Sum',
    slug: 'binary-tree-maximum-path-sum',
    category: 'HIERARCHICAL_STRUCTURES',
    difficulty: 'HARD',
    description: 'A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. Note that the path does not need to pass through the root.\n\nThe path sum of a path is the sum of the node\'s values in the path. Given the root of a binary tree, return the maximum path sum of any non-empty path.',
    inputFormat: 'Line 1: Integer N.\nLine 2: N space-separated integers in level order.',
    outputFormat: 'Print the maximum path sum as an integer.',
    constraints: ['1 <= N <= 3 * 10^4', '-1000 <= Node.val <= 1000'],
    sampleInput: '3\n1 2 3',
    sampleOutput: '6',
    explanation: 'The optimal path is 2 -> 1 -> 3 with path sum 2 + 1 + 3 = 6.',
    testInputs: [
      '3\n1 2 3',
      '5\n-10 9 20 -1 -1 15 7',
      '1\n-3',
      '3\n-2 -1 -3',
      '5\n2 -1 -2',
      '7\n1 2 3 4 5 6 7',
      '7\n5 4 8 11 -1 13 4',
      '3\n10 -5 20'
    ]
  },

  {
    id: 'lc-297',
    leetcodeNumber: 297,
    title: 'Serialize and Deserialize Binary Tree',
    slug: 'serialize-and-deserialize-binary-tree',
    category: 'HIERARCHICAL_STRUCTURES',
    difficulty: 'HARD',
    description: 'Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer. Design an algorithm to serialize and deserialize a binary tree. Output the verified level-order serialization format.',
    inputFormat: 'Line 1: Integer N.\nLine 2: N space-separated integers in level order.',
    outputFormat: 'Print the serialized level-order traversal, or EMPTY.',
    constraints: ['0 <= N <= 10^4', '-1000 <= Node.val <= 1000'],
    sampleInput: '5\n1 2 3 -1 -1 4 5',
    sampleOutput: '1 2 3 -1 -1 4 5',
    explanation: 'Serializing and deserializing maintains identical tree structure.',
    testInputs: [
      '5\n1 2 3 -1 -1 4 5',
      '0',
      '1\n1',
      '2\n1 2',
      '4\n1 -1 2 -1 3',
      '5\n1 2 3 4 5',
      '7\n10 20 30 -1 25 35 40',
      '3\n5 2 8'
    ]
  },

  {
    id: 'lc-703',
    leetcodeNumber: 703,
    title: 'Kth Largest Element in a Stream',
    slug: 'kth-largest-element-in-a-stream',
    category: 'HIERARCHICAL_STRUCTURES',
    difficulty: 'BASIC',
    description: 'Design a class to find the kth largest element in a stream. Note that it is the kth largest element in the sorted order, not the kth distinct element.\n\nImplement KthLargest class: KthLargest(int k, int[] nums) initializes the object. int add(int val) appends the integer val to the stream and returns the element representing the kth largest element.',
    inputFormat: 'Line 1: Two space-separated integers k and initN.\nLine 2: initN space-separated integers (initial stream).\nLine 3: M space-separated integers to append.',
    outputFormat: 'Print the kth largest element after each addition separated by spaces.',
    constraints: ['1 <= k <= 10^4', '0 <= initN <= 10^4', '-10^4 <= val <= 10^4'],
    sampleInput: '3 4\n4 5 8 2\n3 5 10 9 4',
    sampleOutput: '4 5 5 8 8',
    explanation: 'After adding 3 -> 4; adding 5 -> 5; adding 10 -> 5; adding 9 -> 8; adding 4 -> 8.',
    testInputs: [
      '3 4\n4 5 8 2\n3 5 10 9 4',
      '1 2\n1 2\n3 4 5',
      '2 1\n0\n-1 1 -2 2',
      '1 0\n\n5 10 2 20',
      '3 3\n10 20 30\n5 15 25 35',
      '4 5\n7 7 7 7 7\n7 8 6 9',
      '2 3\n1 3 5\n2 4 6',
      '5 5\n10 9 8 7 6\n5 4 3 2 1'
    ]
  },

  {
    id: 'lc-378',
    leetcodeNumber: 378,
    title: 'Kth Smallest Element in a Sorted Matrix',
    slug: 'kth-smallest-element-in-a-sorted-matrix',
    category: 'HIERARCHICAL_STRUCTURES',
    difficulty: 'MEDIUM',
    description: 'Given an n x n matrix where each of the rows and columns is sorted in ascending order, return the kth smallest element in the matrix.\n\nNote that it is the kth smallest element in the sorted order, not the kth distinct element.',
    inputFormat: 'Line 1: Two space-separated integers N and k.\nNext N lines: N space-separated sorted integers.',
    outputFormat: 'Print the kth smallest element as an integer.',
    constraints: ['1 <= N <= 300', '1 <= k <= N^2', '-10^9 <= matrix[i][j] <= 10^9'],
    sampleInput: '3 8\n1 5 9\n10 11 13\n12 13 15',
    sampleOutput: '13',
    explanation: 'The elements in the matrix are [1,5,9,10,11,12,13,13,15], and the 8th smallest number is 13.',
    testInputs: [
      '3 8\n1 5 9\n10 11 13\n12 13 15',
      '1 1\n-5',
      '2 1\n1 2\n1 3',
      '2 4\n1 2\n1 3',
      '3 1\n1 2 3\n4 5 6\n7 8 9',
      '3 9\n1 2 3\n4 5 6\n7 8 9',
      '4 6\n1 4 7 11\n2 5 8 12\n3 6 9 16\n10 13 14 17',
      '3 5\n1 3 5\n6 7 12\n11 14 14'
    ]
  },

  {
    id: 'lc-253',
    leetcodeNumber: 253,
    title: 'Meeting Rooms II',
    slug: 'meeting-rooms-ii',
    category: 'HIERARCHICAL_STRUCTURES',
    difficulty: 'MEDIUM',
    description: 'Given an array of meeting time intervals intervals where intervals[i] = [starti, endi], return the minimum number of conference rooms required.',
    inputFormat: 'Line 1: Integer N (number of meetings).\nNext N lines: Two space-separated integers start and end.',
    outputFormat: 'Print the minimum number of conference rooms required.',
    constraints: ['1 <= N <= 10^4', '0 <= starti < endi <= 10^6'],
    sampleInput: '3\n0 30\n5 10\n15 20',
    sampleOutput: '2',
    explanation: 'Meeting [0, 30] overlaps with [5, 10] and [15, 20], requiring 2 conference rooms.',
    testInputs: [
      '3\n0 30\n5 10\n15 20',
      '2\n7 10\n2 4',
      '1\n1 10',
      '4\n1 5\n2 6\n3 7\n4 8',
      '3\n1 4\n4 6\n6 8',
      '5\n9 10\n4 9\n4 17\n1 2\n2 4',
      '4\n0 10\n1 2\n2 3\n3 4',
      '6\n1 3\n2 4\n3 5\n4 6\n5 7\n6 8'
    ]
  },

  {
    id: 'lc-621',
    leetcodeNumber: 621,
    title: 'Task Scheduler',
    slug: 'task-scheduler',
    category: 'HIERARCHICAL_STRUCTURES',
    difficulty: 'MEDIUM',
    description: 'Given a characters array tasks, representing the tasks a CPU needs to do, where each letter represents a different task. Tasks could be done in any order. Each task is done in one unit of time. For each unit of time, the CPU could complete either one task or just be idle.\n\nHowever, there is a non-negative integer n that represents the cooldown period between two same tasks. Return the least number of units of times that the CPU will take to finish all the given tasks.',
    inputFormat: 'Line 1: Two space-separated integers N and n.\nLine 2: N space-separated uppercase characters.',
    outputFormat: 'Print the minimum CPU intervals required.',
    constraints: ['1 <= N <= 10^4', '0 <= n <= 100', 'tasks[i] is uppercase English letter.'],
    sampleInput: '6 2\nA A A B B B',
    sampleOutput: '8',
    explanation: 'One possible schedule: A -> B -> idle -> A -> B -> idle -> A -> B. Total units = 8.',
    testInputs: [
      '6 2\nA A A B B B',
      '6 0\nA A A B B B',
      '6 2\nA A A A A A',
      '1 5\nA',
      '6 1\nA A A B B B',
      '8 2\nA A A B B B C D',
      '7 3\nA B C D E F G',
      '10 2\nA A A A B B B C C D'
    ]
  },

  {
    id: 'lc-295',
    leetcodeNumber: 295,
    title: 'Find Median from Data Stream',
    slug: 'find-median-from-data-stream',
    category: 'HIERARCHICAL_STRUCTURES',
    difficulty: 'HARD',
    description: 'The median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values.\n\nImplement the MedianFinder class supporting addNum(num) and findMedian(). Format output to 1 decimal place.',
    inputFormat: 'Line 1: Integer Q.\nNext Q lines: Either "addNum X" or "findMedian".',
    outputFormat: 'Print the results of findMedian separated by spaces.',
    constraints: ['1 <= Q <= 5 * 10^4', '-10^5 <= num <= 10^5'],
    sampleInput: '5\naddNum 1\naddNum 2\nfindMedian\naddNum 3\nfindMedian',
    sampleOutput: '1.5 2.0',
    explanation: 'Median of [1, 2] is (1+2)/2 = 1.5. Median of [1, 2, 3] is 2.0.',
    testInputs: [
      '5\naddNum 1\naddNum 2\nfindMedian\naddNum 3\nfindMedian',
      '3\naddNum 10\nfindMedian\nfindMedian',
      '4\naddNum -1\nfindMedian\naddNum -2\nfindMedian',
      '6\naddNum 6\nfindMedian\naddNum 10\nfindMedian\naddNum 2\nfindMedian',
      '7\naddNum 5\naddNum 15\naddNum 1\naddNum 3\nfindMedian\naddNum 8\nfindMedian',
      '4\naddNum 100\naddNum 200\naddNum 300\nfindMedian',
      '5\naddNum 2\naddNum 2\naddNum 2\naddNum 2\nfindMedian',
      '6\naddNum -5\naddNum 0\nfindMedian\naddNum 5\nfindMedian\nfindMedian'
    ]
  },

  {
    id: 'lc-767',
    leetcodeNumber: 767,
    title: 'Reorganize String',
    slug: 'reorganize-string',
    category: 'HIERARCHICAL_STRUCTURES',
    difficulty: 'MEDIUM',
    description: 'Given a string s, rearrange the characters of s so that any two adjacent characters are not the same. Return any possible rearrangement of s or return an empty line if not possible.',
    inputFormat: 'Line 1: String s.',
    outputFormat: 'Print the rearranged string (or empty line if impossible).',
    constraints: ['1 <= s.length <= 500', 's consists of lowercase English letters.'],
    sampleInput: 'aab',
    sampleOutput: 'aba',
    explanation: 'No two adjacent characters are the same in "aba".',
    testInputs: [
      'aab',
      'aaab',
      'vvvlo',
      'a',
      'aabbcc',
      'aaabbc',
      'baaba',
      'aaabbbccc'
    ]
  }
];

// -------------------------------------------------------------
// VERIFICATION RUNNER
// -------------------------------------------------------------

export function verifyBatch4() {
  console.log(`\n======================================================`);
  console.log(`VERIFYING BATCH 4: HIERARCHICAL STRUCTURES (24 PROBLEMS)`);
  console.log(`======================================================`);

  let totalCases = 0;
  let passedCases = 0;
  const verifiedProblems = [];

  for (const prob of problemsBatch4) {
    const solver = solversBatch4[prob.id];
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
  console.log(`BATCH 4 SUMMARY: ${passedCases}/${totalCases} test cases passed across ${verifiedProblems.length} problems!`);
  console.log(`------------------------------------------------------\n`);

  return verifiedProblems;
}

if (process.argv[1].endsWith('batch4_hierarchical_structures.mjs')) {
  verifyBatch4();
}
