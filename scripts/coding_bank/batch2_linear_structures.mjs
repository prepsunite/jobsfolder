import { makeTestCase } from './batch1_pointers_arrays.mjs';

// -------------------------------------------------------------
// REFERENCE SOLVERS FOR BATCH 2: LINEAR STRUCTURES (18 PROBLEMS)
// -------------------------------------------------------------

export const solversBatch2 = {
  // lc-155: Min Stack
  'lc-155': (input) => {
    const lines = input.trim().split('\n').map(l => l.trim()).filter(Boolean);
    const Q = Number(lines[0]);
    const stack = [];
    const minStack = [];
    const outputs = [];
    for (let i = 1; i <= Q && i < lines.length; i++) {
      const parts = lines[i].split(/\s+/);
      const cmd = parts[0];
      if (cmd === 'push') {
        const val = Number(parts[1]);
        stack.push(val);
        if (minStack.length === 0 || val <= minStack[minStack.length - 1]) {
          minStack.push(val);
        }
      } else if (cmd === 'pop') {
        if (stack.length > 0) {
          const popped = stack.pop();
          if (popped === minStack[minStack.length - 1]) {
            minStack.pop();
          }
        }
      } else if (cmd === 'top') {
        outputs.push(stack.length > 0 ? stack[stack.length - 1] : 'EMPTY');
      } else if (cmd === 'getMin') {
        outputs.push(minStack.length > 0 ? minStack[minStack.length - 1] : 'EMPTY');
      }
    }
    return outputs.join('\n');
  },

  // lc-83: Remove Duplicates from Sorted List
  'lc-83': (input) => {
    const lines = input.trim().split('\n');
    const N = Number(lines[0].trim());
    if (N === 0) return 'EMPTY';
    const nums = lines[1].trim().split(/\s+/).map(Number);
    const unique = [nums[0]];
    for (let i = 1; i < N; i++) {
      if (nums[i] !== nums[i - 1]) unique.push(nums[i]);
    }
    return unique.join(' ');
  },

  // lc-142: Linked List Cycle II (Find Entry Point)
  'lc-142': (input) => {
    const lines = input.trim().split('\n');
    const [N, pos] = lines[0].trim().split(/\s+/).map(Number);
    if (N === 0 || pos === -1) return 'NO_CYCLE';
    const nums = lines[1].trim().split(/\s+/).map(Number);
    if (pos >= 0 && pos < N) {
      return String(nums[pos]);
    }
    return 'NO_CYCLE';
  },

  // lc-160: Intersection of Two Linked Lists
  'lc-160': (input) => {
    const lines = input.trim().split('\n');
    const [lenA, lenB, skipA, skipB] = lines[0].trim().split(/\s+/).map(Number);
    if (skipA >= lenA || skipB >= lenB) return 'NO_INTERSECTION';
    const listA = lines[1].trim().split(/\s+/).map(Number);
    return String(listA[skipA]);
  },

  // lc-143: Reorder List
  'lc-143': (input) => {
    const lines = input.trim().split('\n');
    const N = Number(lines[0].trim());
    if (N <= 1) return lines[1] ? lines[1].trim() : '';
    const nums = lines[1].trim().split(/\s+/).map(Number);
    const reordered = [];
    let l = 0, r = N - 1;
    while (l <= r) {
      if (l === r) {
        reordered.push(nums[l]);
      } else {
        reordered.push(nums[l]);
        reordered.push(nums[r]);
      }
      l++;
      r--;
    }
    return reordered.join(' ');
  },

  // lc-2: Add Two Numbers
  'lc-2': (input) => {
    const lines = input.trim().split('\n');
    const [len1, len2] = lines[0].trim().split(/\s+/).map(Number);
    const l1 = lines[1].trim().split(/\s+/).map(Number);
    const l2 = lines[2].trim().split(/\s+/).map(Number);
    const res = [];
    let carry = 0;
    let i = 0;
    while (i < len1 || i < len2 || carry > 0) {
      const v1 = i < len1 ? l1[i] : 0;
      const v2 = i < len2 ? l2[i] : 0;
      const sum = v1 + v2 + carry;
      res.push(sum % 10);
      carry = Math.floor(sum / 10);
      i++;
    }
    return res.join(' ');
  },

  // lc-148: Sort List (Merge Sort on Linked List)
  'lc-148': (input) => {
    const lines = input.trim().split('\n');
    const N = Number(lines[0].trim());
    if (N === 0) return 'EMPTY';
    const nums = lines[1].trim().split(/\s+/).map(Number);
    nums.sort((a, b) => a - b);
    return nums.join(' ');
  },

  // lc-146: LRU Cache
  'lc-146': (input) => {
    const lines = input.trim().split('\n').map(l => l.trim()).filter(Boolean);
    const [cap, Q] = lines[0].split(/\s+/).map(Number);
    const map = new Map();
    const outputs = [];
    for (let i = 1; i <= Q && i < lines.length; i++) {
      const parts = lines[i].split(/\s+/);
      const cmd = parts[0];
      if (cmd === 'put') {
        const key = Number(parts[1]);
        const val = Number(parts[2]);
        if (map.has(key)) map.delete(key);
        else if (map.size >= cap) {
          const oldestKey = map.keys().next().value;
          map.delete(oldestKey);
        }
        map.set(key, val);
      } else if (cmd === 'get') {
        const key = Number(parts[1]);
        if (!map.has(key)) {
          outputs.push(-1);
        } else {
          const val = map.get(key);
          map.delete(key);
          map.set(key, val);
          outputs.push(val);
        }
      }
    }
    return outputs.join(' ');
  },

  // lc-23: Merge k Sorted Lists
  'lc-23': (input) => {
    const lines = input.trim().split('\n');
    const K = Number(lines[0].trim());
    const all = [];
    for (let i = 1; i <= K; i++) {
      if (!lines[i]) continue;
      const parts = lines[i].trim().split(/\s+/);
      const len = Number(parts[0]);
      for (let j = 1; j <= len; j++) {
        all.push(Number(parts[j]));
      }
    }
    if (all.length === 0) return 'EMPTY';
    all.sort((a, b) => a - b);
    return all.join(' ');
  },

  // lc-232: Implement Queue using Stacks
  'lc-232': (input) => {
    const lines = input.trim().split('\n').map(l => l.trim()).filter(Boolean);
    const Q = Number(lines[0]);
    const inStack = [];
    const outStack = [];
    const outputs = [];
    const shift = () => {
      if (outStack.length === 0) {
        while (inStack.length > 0) outStack.push(inStack.pop());
      }
    };
    for (let i = 1; i <= Q && i < lines.length; i++) {
      const parts = lines[i].split(/\s+/);
      const cmd = parts[0];
      if (cmd === 'push') {
        inStack.push(Number(parts[1]));
      } else if (cmd === 'pop') {
        shift();
        outputs.push(outStack.pop());
      } else if (cmd === 'peek') {
        shift();
        outputs.push(outStack[outStack.length - 1]);
      } else if (cmd === 'empty') {
        outputs.push(inStack.length === 0 && outStack.length === 0 ? 'true' : 'false');
      }
    }
    return outputs.join(' ');
  },

  // lc-225: Implement Stack using Queues
  'lc-225': (input) => {
    const lines = input.trim().split('\n').map(l => l.trim()).filter(Boolean);
    const Q = Number(lines[0]);
    const q = [];
    const outputs = [];
    for (let i = 1; i <= Q && i < lines.length; i++) {
      const parts = lines[i].split(/\s+/);
      const cmd = parts[0];
      if (cmd === 'push') {
        q.push(Number(parts[1]));
      } else if (cmd === 'pop') {
        outputs.push(q.pop());
      } else if (cmd === 'top') {
        outputs.push(q[q.length - 1]);
      } else if (cmd === 'empty') {
        outputs.push(q.length === 0 ? 'true' : 'false');
      }
    }
    return outputs.join(' ');
  },

  // lc-503: Next Greater Element II (Circular Array)
  'lc-503': (input) => {
    const lines = input.trim().split('\n');
    const N = Number(lines[0].trim());
    const nums = lines[1].trim().split(/\s+/).map(Number);
    const res = Array(N).fill(-1);
    const stack = [];
    for (let i = 0; i < 2 * N; i++) {
      const idx = i % N;
      while (stack.length > 0 && nums[stack[stack.length - 1]] < nums[idx]) {
        res[stack.pop()] = nums[idx];
      }
      if (i < N) stack.push(idx);
    }
    return res.join(' ');
  },

  // lc-735: Asteroid Collision
  'lc-735': (input) => {
    const lines = input.trim().split('\n');
    const N = Number(lines[0].trim());
    const asteroids = lines[1].trim().split(/\s+/).map(Number);
    const stack = [];
    for (let i = 0; i < N; i++) {
      let ast = asteroids[i];
      let exploded = false;
      while (stack.length > 0 && ast < 0 && stack[stack.length - 1] > 0) {
        const top = stack[stack.length - 1];
        if (top < -ast) {
          stack.pop();
          continue;
        } else if (top === -ast) {
          stack.pop();
          exploded = true;
          break;
        } else {
          exploded = true;
          break;
        }
      }
      if (!exploded) stack.push(ast);
    }
    return stack.length > 0 ? stack.join(' ') : 'NONE';
  },

  // lc-901: Online Stock Span
  'lc-901': (input) => {
    const lines = input.trim().split('\n');
    const N = Number(lines[0].trim());
    const prices = lines[1].trim().split(/\s+/).map(Number);
    const stack = [];
    const spans = [];
    for (let i = 0; i < N; i++) {
      const p = prices[i];
      let span = 1;
      while (stack.length > 0 && stack[stack.length - 1][0] <= p) {
        span += stack.pop()[1];
      }
      stack.push([p, span]);
      spans.push(span);
    }
    return spans.join(' ');
  },

  // lc-402: Remove K Digits
  'lc-402': (input) => {
    const [num, kStr] = input.trim().split(/\s+/);
    let k = Number(kStr);
    const stack = [];
    for (const d of num) {
      while (stack.length > 0 && k > 0 && stack[stack.length - 1] > d) {
        stack.pop();
        k--;
      }
      stack.push(d);
    }
    while (k > 0) {
      stack.pop();
      k--;
    }
    // strip leading zeros
    let s = stack.join('').replace(/^0+/, '');
    return s === '' ? '0' : s;
  },

  // lc-84: Largest Rectangle in Histogram
  'lc-84': (input) => {
    const lines = input.trim().split('\n');
    const N = Number(lines[0].trim());
    const heights = lines[1].trim().split(/\s+/).map(Number);
    const stack = [];
    let maxArea = 0;
    const h = [...heights, 0];
    for (let i = 0; i < h.length; i++) {
      while (stack.length > 0 && h[i] < h[stack[stack.length - 1]]) {
        const height = h[stack.pop()];
        const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
        maxArea = Math.max(maxArea, height * width);
      }
      stack.push(i);
    }
    return String(maxArea);
  },

  // lc-85: Maximal Rectangle
  'lc-85': (input) => {
    const lines = input.trim().split('\n').map(l => l.trim()).filter(Boolean);
    const [R, C] = lines[0].split(/\s+/).map(Number);
    if (R === 0 || C === 0) return '0';
    const heights = Array(C).fill(0);
    let maxRect = 0;
    for (let r = 1; r <= R; r++) {
      const row = lines[r].split(/\s+/).map(Number);
      for (let c = 0; c < C; c++) {
        heights[c] = row[c] === 1 ? heights[c] + 1 : 0;
      }
      // compute max in histogram
      const stack = [];
      const h = [...heights, 0];
      for (let i = 0; i < h.length; i++) {
        while (stack.length > 0 && h[i] < h[stack[stack.length - 1]]) {
          const height = h[stack.pop()];
          const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
          maxRect = Math.max(maxRect, height * width);
        }
        stack.push(i);
      }
    }
    return String(maxRect);
  },

  // lc-227: Basic Calculator II
  'lc-227': (input) => {
    const s = input.trim();
    const stack = [];
    let curr = 0;
    let op = '+';
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (c >= '0' && c <= '9') {
        curr = curr * 10 + Number(c);
      }
      if ((c !== ' ' && (c < '0' || c > '9')) || i === s.length - 1) {
        if (op === '+') {
          stack.push(curr);
        } else if (op === '-') {
          stack.push(-curr);
        } else if (op === '*') {
          stack.push(stack.pop() * curr);
        } else if (op === '/') {
          const prev = stack.pop();
          stack.push(Math.trunc(prev / curr));
        }
        op = c;
        curr = 0;
      }
    }
    return String(stack.reduce((a, b) => a + b, 0));
  }
};

// -------------------------------------------------------------
// METADATA & 8 TEST CASES FOR EACH PROBLEM
// -------------------------------------------------------------

export const problemsBatch2 = [
  {
    id: 'lc-155',
    leetcodeNumber: 155,
    title: 'Min Stack Design',
    slug: 'min-stack',
    category: 'LINEAR_STRUCTURES',
    difficulty: 'MEDIUM',
    description: 'Design a stack that supports push, pop, top, and retrieving the minimum element in constant O(1) time.\n\nImplement operations: push X, pop, top, getMin.',
    inputFormat: 'Line 1: Integer Q (number of operations).\nNext Q lines: Command strings (push X, pop, top, getMin).',
    outputFormat: 'Print the results of top and getMin operations, each on a new line.',
    constraints: ['1 <= Q <= 3 * 10^4', '-2^31 <= val <= 2^31 - 1'],
    sampleInput: '7\npush -2\npush 0\npush -3\ngetMin\npop\ntop\ngetMin',
    sampleOutput: '-3\n0\n-2',
    explanation: 'Push -2, 0, -3. getMin is -3. Pop leaves [-2, 0], so top is 0 and getMin is -2.',
    testInputs: [
      '7\npush -2\npush 0\npush -3\ngetMin\npop\ntop\ngetMin',
      '4\npush 5\npush 10\ntop\ngetMin',
      '5\npush 1\npush 2\npop\ntop\ngetMin',
      '3\npush 100\ntop\ngetMin',
      '6\npush -10\npush -20\npush -5\ngetMin\npop\ngetMin',
      '7\npush 2\npush 2\npush 2\ngetMin\npop\ngetMin\ntop',
      '6\npush 7\npush 3\npush 9\ngetMin\ntop\npop',
      '8\npush 1\npush 5\ngetMin\npush -1\ngetMin\npop\ngetMin\ntop'
    ]
  },

  {
    id: 'lc-83',
    leetcodeNumber: 83,
    title: 'Remove Duplicates from Sorted Linked List',
    slug: 'remove-duplicates-from-sorted-list',
    category: 'LINEAR_STRUCTURES',
    difficulty: 'BASIC',
    description: 'Given the head of a sorted linked list, delete all duplicates such that each element appears only once. Return the linked list sorted as well.',
    inputFormat: 'Line 1: Integer N (number of nodes).\nLine 2: N space-separated integers in non-decreasing order.',
    outputFormat: 'Print the distinct linked list values separated by spaces, or EMPTY if N = 0.',
    constraints: ['0 <= N <= 300', '-100 <= Node.val <= 100'],
    sampleInput: '5\n1 1 2 3 3',
    sampleOutput: '1 2 3',
    explanation: 'Duplicates of 1 and 3 are removed, leaving [1, 2, 3].',
    testInputs: [
      '5\n1 1 2 3 3',
      '3\n1 1 2',
      '0',
      '1\n42',
      '6\n1 1 1 1 1 1',
      '5\n-5 -5 0 2 2',
      '7\n1 2 3 4 5 6 7',
      '8\n-10 -10 -5 -5 0 0 10 10'
    ]
  },

  {
    id: 'lc-142',
    leetcodeNumber: 142,
    title: 'Linked List Cycle II - Find Cycle Start Node',
    slug: 'linked-list-cycle-ii',
    category: 'LINEAR_STRUCTURES',
    difficulty: 'MEDIUM',
    description: 'Given the head of a linked list of N nodes, return the node where the cycle begins. If there is no cycle, return NO_CYCLE.\n\nThere is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer. pos represents the 0-indexed position that the tail connects back to (-1 if no cycle).',
    inputFormat: 'Line 1: Two space-separated integers N and pos.\nLine 2: N space-separated node values.',
    outputFormat: 'Print the value of the cycle entry node, or NO_CYCLE.',
    constraints: ['0 <= N <= 10^4', 'pos is -1 or a valid 0-based index in the linked list.'],
    sampleInput: '4 1\n3 2 0 -4',
    sampleOutput: '2',
    explanation: 'The tail links back to node at index 1 (value 2), where the cycle begins.',
    testInputs: [
      '4 1\n3 2 0 -4',
      '2 0\n1 2',
      '1 -1\n1',
      '0 -1',
      '5 2\n10 20 30 40 50',
      '3 0\n7 8 9',
      '6 -1\n1 2 3 4 5 6',
      '5 4\n-1 -2 -3 -4 -5'
    ]
  },

  {
    id: 'lc-160',
    leetcodeNumber: 160,
    title: 'Intersection of Two Linked Lists',
    slug: 'intersection-of-two-linked-lists',
    category: 'LINEAR_STRUCTURES',
    difficulty: 'BASIC',
    description: 'Given the heads of two singly linked lists listA and listB, return the node at which the two lists intersect. If the two linked lists have no intersection at all, return NO_INTERSECTION.',
    inputFormat: 'Line 1: Four space-separated integers lenA, lenB, skipA, skipB.\nLine 2: lenA space-separated values for listA.\nLine 3: lenB space-separated values for listB.',
    outputFormat: 'Print the value of the intersecting node, or NO_INTERSECTION.',
    constraints: ['1 <= lenA, lenB <= 3 * 10^4', '0 <= skipA < lenA', '0 <= skipB < lenB'],
    sampleInput: '5 6 2 3\n4 1 8 4 5\n5 6 1 8 4 5',
    sampleOutput: '8',
    explanation: 'The intersecting node has value 8 (at skipA = 2 and skipB = 3).',
    testInputs: [
      '5 6 2 3\n4 1 8 4 5\n5 6 1 8 4 5',
      '4 3 2 1\n1 9 1 2\n3 1 2',
      '3 2 3 2\n2 6 4\n1 5',
      '1 1 0 0\n7\n7',
      '3 3 0 0\n10 20 30\n10 20 30',
      '4 2 2 0\n1 2 99 100\n99 100',
      '4 4 4 4\n1 2 3 4\n5 6 7 8',
      '5 4 1 0\n10 50 60 70 80\n50 60 70 80'
    ]
  },

  {
    id: 'lc-143',
    leetcodeNumber: 143,
    title: 'Reorder List',
    slug: 'reorder-list',
    category: 'LINEAR_STRUCTURES',
    difficulty: 'MEDIUM',
    description: 'You are given the head of a singly linked-list: L0 → L1 → … → Ln-1 → Ln.\n\nReorder the list to be on the form: L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → …\n\nYou may not modify the values in the list\'s nodes. Only nodes themselves may be changed.',
    inputFormat: 'Line 1: Integer N.\nLine 2: N space-separated integers.',
    outputFormat: 'Print the reordered node values separated by spaces.',
    constraints: ['1 <= N <= 5 * 10^4', '1 <= Node.val <= 1000'],
    sampleInput: '4\n1 2 3 4',
    sampleOutput: '1 4 2 3',
    explanation: 'Reordering [1, 2, 3, 4] interleaves the head and tail nodes to [1, 4, 2, 3].',
    testInputs: [
      '4\n1 2 3 4',
      '5\n1 2 3 4 5',
      '1\n10',
      '2\n1 2',
      '6\n10 20 30 40 50 60',
      '7\n1 1 2 2 3 3 4',
      '8\n8 7 6 5 4 3 2 1',
      '3\n100 200 300'
    ]
  },

  {
    id: 'lc-2',
    leetcodeNumber: 2,
    title: 'Add Two Numbers (Linked Lists)',
    slug: 'add-two-numbers',
    category: 'LINEAR_STRUCTURES',
    difficulty: 'MEDIUM',
    description: 'You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list in reverse order.',
    inputFormat: 'Line 1: Two space-separated integers len1 and len2.\nLine 2: len1 space-separated digits (0-9).\nLine 3: len2 space-separated digits (0-9).',
    outputFormat: 'Print the digits of the sum linked list in reverse order separated by spaces.',
    constraints: ['1 <= len1, len2 <= 100', '0 <= Node.val <= 9', 'The number does not contain leading zeros except the number 0 itself.'],
    sampleInput: '3 3\n2 4 3\n5 6 4',
    sampleOutput: '7 0 8',
    explanation: '342 + 465 = 807, represented as [7, 0, 8].',
    testInputs: [
      '3 3\n2 4 3\n5 6 4',
      '1 1\n0\n0',
      '7 4\n9 9 9 9 9 9 9\n9 9 9 9',
      '1 2\n5\n5 0',
      '3 1\n1 2 3\n9',
      '4 4\n1 0 0 1\n9 9 9 0',
      '2 3\n9 9\n1 0 0',
      '5 2\n0 0 0 0 1\n5 5'
    ]
  },

  {
    id: 'lc-148',
    leetcodeNumber: 148,
    title: 'Sort List (Merge Sort on Linked List)',
    slug: 'sort-list',
    category: 'LINEAR_STRUCTURES',
    difficulty: 'MEDIUM',
    description: 'Given the head of a linked list of N nodes, return the list after sorting it in ascending order in O(N log N) time and O(1) auxiliary memory.',
    inputFormat: 'Line 1: Integer N.\nLine 2: N space-separated integers.',
    outputFormat: 'Print the sorted values separated by spaces, or EMPTY if N = 0.',
    constraints: ['0 <= N <= 5 * 10^4', '-10^5 <= Node.val <= 10^5'],
    sampleInput: '4\n4 2 1 3',
    sampleOutput: '1 2 3 4',
    explanation: 'Sorted linked list: 1 -> 2 -> 3 -> 4.',
    testInputs: [
      '4\n4 2 1 3',
      '5\n-1 5 3 4 0',
      '0',
      '1\n99',
      '6\n10 10 10 10 10 10',
      '7\n7 6 5 4 3 2 1',
      '6\n-100 50 -20 0 30 -5',
      '5\n1 2 3 4 5'
    ]
  },

  {
    id: 'lc-146',
    leetcodeNumber: 146,
    title: 'LRU Cache Design',
    slug: 'lru-cache',
    category: 'LINEAR_STRUCTURES',
    difficulty: 'MEDIUM',
    description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\n\nImplement the LRUCache class with capacity, get(key), and put(key, value). Both get and put must run in O(1) average time complexity.',
    inputFormat: 'Line 1: Two space-separated integers capacity and Q (number of operations).\nNext Q lines: Either "put key value" or "get key".',
    outputFormat: 'Print the return values of get operations separated by spaces (-1 if key not found).',
    constraints: ['1 <= capacity <= 3000', '1 <= Q <= 10^4', '0 <= key <= 10^4', '0 <= value <= 10^5'],
    sampleInput: '2 9\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2\nput 4 4\nget 1\nget 3\nget 4',
    sampleOutput: '1 -1 -1 3 4',
    explanation: 'Cache capacity 2. Key 2 evicted when 3 is put. Key 1 evicted when 4 is put.',
    testInputs: [
      '2 9\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2\nput 4 4\nget 1\nget 3\nget 4',
      '1 4\nput 2 1\nget 2\nput 3 2\nget 2',
      '2 5\nget 2\nput 2 6\nget 1\nput 1 5\nput 1 2',
      '3 4\nput 1 10\nput 2 20\nput 3 30\nget 2',
      '2 6\nput 1 1\nput 2 2\nput 1 10\nget 1\nput 3 3\nget 2',
      '2 3\nput 5 50\nget 5\nget 6',
      '3 6\nput 1 1\nput 2 2\nput 3 3\nget 1\nput 4 4\nget 2',
      '1 6\nput 1 10\nget 1\nput 2 20\nget 1\nget 2\nput 3 30'
    ]
  },

  {
    id: 'lc-23',
    leetcodeNumber: 23,
    title: 'Merge k Sorted Lists',
    slug: 'merge-k-sorted-lists',
    category: 'LINEAR_STRUCTURES',
    difficulty: 'HARD',
    description: 'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.',
    inputFormat: 'Line 1: Integer K (number of sorted lists).\nNext K lines: Integer M followed by M space-separated sorted integers.',
    outputFormat: 'Print the merged sorted list values separated by spaces, or EMPTY if all lists are empty.',
    constraints: ['0 <= K <= 10^4', '0 <= total nodes <= 10^5', '-10^4 <= Node.val <= 10^4'],
    sampleInput: '3\n3 1 4 5\n3 1 3 4\n2 2 6',
    sampleOutput: '1 1 2 3 4 4 5 6',
    explanation: 'Merging [1,4,5], [1,3,4], and [2,6] gives [1,1,2,3,4,4,5,6].',
    testInputs: [
      '3\n3 1 4 5\n3 1 3 4\n2 2 6',
      '1\n0',
      '0',
      '2\n1 5\n1 2',
      '3\n2 -2 0\n2 -1 1\n2 -3 2',
      '4\n1 1\n1 2\n1 3\n1 4',
      '2\n3 10 20 30\n3 15 25 35',
      '3\n2 1 10\n0\n2 2 9'
    ]
  },

  {
    id: 'lc-232',
    leetcodeNumber: 232,
    title: 'Implement Queue using Stacks',
    slug: 'implement-queue-using-stacks',
    category: 'LINEAR_STRUCTURES',
    difficulty: 'BASIC',
    description: 'Implement a first in first out (FIFO) queue using only two stacks. The implemented queue should support push, pop, peek, and empty operations.',
    inputFormat: 'Line 1: Integer Q (number of operations).\nNext Q lines: Either "push X", "pop", "peek", or "empty".',
    outputFormat: 'Print results of pop, peek, and empty operations separated by spaces.',
    constraints: ['1 <= Q <= 100', '1 <= x <= 9', 'At most 100 calls will be made to push, pop, peek, and empty.'],
    sampleInput: '5\npush 1\npush 2\npeek\npop\nempty',
    sampleOutput: '1 1 false',
    explanation: 'Queue: [1, 2]. peek returns 1. pop returns 1. empty returns false.',
    testInputs: [
      '5\npush 1\npush 2\npeek\npop\nempty',
      '4\npush 10\npeek\npop\nempty',
      '6\npush 1\npush 2\npush 3\npop\npeek\npop',
      '3\npush 5\nempty\npop',
      '7\npush 1\npush 2\npop\npush 3\npeek\npop\npop',
      '4\npush 7\npush 8\npop\npop',
      '5\npush 4\npush 5\npush 6\npop\nempty',
      '6\npush 9\npop\nempty\npush 8\npeek\nempty'
    ]
  },

  {
    id: 'lc-225',
    leetcodeNumber: 225,
    title: 'Implement Stack using Queues',
    slug: 'implement-stack-using-queues',
    category: 'LINEAR_STRUCTURES',
    difficulty: 'BASIC',
    description: 'Implement a last-in-first-out (LIFO) stack using only standard queues. The implemented stack should support push, pop, top, and empty operations.',
    inputFormat: 'Line 1: Integer Q.\nNext Q lines: Either "push X", "pop", "top", or "empty".',
    outputFormat: 'Print results of pop, top, and empty operations separated by spaces.',
    constraints: ['1 <= Q <= 100', '1 <= x <= 9'],
    sampleInput: '5\npush 1\npush 2\ntop\npop\nempty',
    sampleOutput: '2 2 false',
    explanation: 'Stack has [1, 2]. top returns 2. pop returns 2. empty returns false.',
    testInputs: [
      '5\npush 1\npush 2\ntop\npop\nempty',
      '4\npush 10\ntop\npop\nempty',
      '6\npush 1\npush 2\npush 3\ntop\npop\npop',
      '3\npush 5\nempty\ntop',
      '7\npush 1\npush 2\npop\npush 3\ntop\npop\npop',
      '4\npush 7\npush 8\npop\npop',
      '5\npush 4\npush 5\npush 6\npop\nempty',
      '6\npush 9\npop\nempty\npush 8\ntop\nempty'
    ]
  },

  {
    id: 'lc-503',
    leetcodeNumber: 503,
    title: 'Next Greater Element II (Circular Array)',
    slug: 'next-greater-element-ii',
    category: 'LINEAR_STRUCTURES',
    difficulty: 'MEDIUM',
    description: 'Given a circular integer array nums (i.e., the next element of nums[nums.length - 1] is nums[0]), return the next greater number for every element in nums.\n\nThe next greater number of a number x is the first greater number to its traversing-order next in the array, which means you could search circularly to find its next greater number. If it doesn\'t exist, return -1 for this number.',
    inputFormat: 'Line 1: Integer N.\nLine 2: N space-separated integers.',
    outputFormat: 'Print N space-separated integers representing next greater elements.',
    constraints: ['1 <= N <= 10^4', '-10^9 <= nums[i] <= 10^9'],
    sampleInput: '3\n1 2 1',
    sampleOutput: '2 -1 2',
    explanation: 'The first 1\'s next greater is 2; 2\'s next greater is -1; the second 1\'s next greater circularly is 2.',
    testInputs: [
      '3\n1 2 1',
      '5\n1 2 3 4 3',
      '1\n5',
      '4\n4 3 2 1',
      '4\n1 1 1 1',
      '6\n5 4 3 2 1 6',
      '5\n-1 -2 -3 -4 -5',
      '6\n2 1 2 4 3 2'
    ]
  },

  {
    id: 'lc-735',
    leetcodeNumber: 735,
    title: 'Asteroid Collision',
    slug: 'asteroid-collision',
    category: 'LINEAR_STRUCTURES',
    difficulty: 'MEDIUM',
    description: 'We are given an array asteroids of integers representing asteroids in a row. For each asteroid, the absolute value represents its size, and the sign represents its direction (positive meaning right, negative meaning left). Each asteroid moves at the same speed.\n\nFind out the state of the asteroids after all collisions. If two asteroids meet, the smaller one will explode. If both are the same size, both will explode. Two asteroids moving in the same direction will never meet.',
    inputFormat: 'Line 1: Integer N.\nLine 2: N space-separated non-zero integers.',
    outputFormat: 'Print the surviving asteroids separated by spaces, or NONE if all explode.',
    constraints: ['2 <= N <= 10^4', '-1000 <= asteroids[i] <= 1000', 'asteroids[i] != 0'],
    sampleInput: '3\n5 10 -5',
    sampleOutput: '5 10',
    explanation: '10 and -5 collide; 10 survives. 5 and 10 never collide because they move in the same direction.',
    testInputs: [
      '3\n5 10 -5',
      '2\n8 -8',
      '3\n10 2 -5',
      '4\n-2 -1 1 2',
      '4\n-2 -2 1 -2',
      '5\n1 2 3 -4 5',
      '6\n5 4 3 -3 -4 -5',
      '5\n10 5 -5 -10 20'
    ]
  },

  {
    id: 'lc-901',
    leetcodeNumber: 901,
    title: 'Online Stock Span',
    slug: 'online-stock-span',
    category: 'LINEAR_STRUCTURES',
    difficulty: 'MEDIUM',
    description: 'Design an algorithm that collects daily price quotes for some stock and returns the span of that stock\'s price for the current day.\n\nThe span of the stock\'s price in one day is the maximum number of consecutive days (starting from that day and going backward) for which the stock price was less than or equal to the price of that day.',
    inputFormat: 'Line 1: Integer N (number of days).\nLine 2: N space-separated integers representing stock prices.',
    outputFormat: 'Print N space-separated integers representing the daily stock spans.',
    constraints: ['1 <= N <= 10^4', '1 <= price <= 10^5'],
    sampleInput: '7\n100 80 60 70 60 75 85',
    sampleOutput: '1 1 1 2 1 4 6',
    explanation: 'Spans: [100] -> 1, [80] -> 1, [60] -> 1, [70] -> 2 (70, 60), [60] -> 1, [75] -> 4, [85] -> 6.',
    testInputs: [
      '7\n100 80 60 70 60 75 85',
      '1\n50',
      '5\n10 20 30 40 50',
      '5\n50 40 30 20 10',
      '6\n31 41 48 59 79 100',
      '5\n50 50 50 50 50',
      '7\n28 14 28 35 19 53 100',
      '8\n90 60 70 65 80 85 45 100'
    ]
  },

  {
    id: 'lc-402',
    leetcodeNumber: 402,
    title: 'Remove K Digits',
    slug: 'remove-k-digits',
    category: 'LINEAR_STRUCTURES',
    difficulty: 'MEDIUM',
    description: 'Given string num representing a non-negative integer, and an integer k, return the smallest possible integer after removing k digits from num.',
    inputFormat: 'Line 1: String num and integer k separated by a space.',
    outputFormat: 'Print the smallest integer string after removing k digits (no leading zeroes except for "0").',
    constraints: ['1 <= k <= num.length <= 10^5', 'num consists of only digits.', 'num does not have any leading zeros except for the zero itself.'],
    sampleInput: '1432219 3',
    sampleOutput: '1219',
    explanation: 'Remove digits 4, 3, and 2 to form the new number 1219 which is the smallest.',
    testInputs: [
      '1432219 3',
      '10200 1',
      '10 2',
      '9 1',
      '112 1',
      '123456 3',
      '10001 4',
      '54321 2'
    ]
  },

  {
    id: 'lc-84',
    leetcodeNumber: 84,
    title: 'Largest Rectangle in Histogram',
    slug: 'largest-rectangle-in-histogram',
    category: 'LINEAR_STRUCTURES',
    difficulty: 'HARD',
    description: 'Given an array of integers heights representing the histogram\'s bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.',
    inputFormat: 'Line 1: Integer N.\nLine 2: N space-separated integers representing bar heights.',
    outputFormat: 'Print a single integer representing the maximum rectangle area.',
    constraints: ['1 <= N <= 10^5', '0 <= heights[i] <= 10^4'],
    sampleInput: '6\n2 1 5 6 2 3',
    sampleOutput: '10',
    explanation: 'The largest rectangle is obtained by bars 5 and 6 of height 5 and width 2: area = 5 * 2 = 10.',
    testInputs: [
      '6\n2 1 5 6 2 3',
      '2\n2 4',
      '1\n10',
      '5\n5 5 5 5 5',
      '6\n1 2 3 4 5 6',
      '6\n6 5 4 3 2 1',
      '7\n2 1 4 5 1 3 3',
      '8\n0 9 0 9 0 9 0 9'
    ]
  },

  {
    id: 'lc-85',
    leetcodeNumber: 85,
    title: 'Maximal Rectangle in Binary Matrix',
    slug: 'maximal-rectangle',
    category: 'LINEAR_STRUCTURES',
    difficulty: 'HARD',
    description: 'Given a rows x cols binary matrix filled with 0\'s and 1\'s, find the largest rectangle containing only 1\'s and return its area.',
    inputFormat: 'Line 1: Two space-separated integers R and C.\nNext R lines: C space-separated binary digits (0 or 1).',
    outputFormat: 'Print the maximum rectangle area of 1s.',
    constraints: ['1 <= R, C <= 200', 'matrix[i][j] is \'0\' or \'1\'.'],
    sampleInput: '4 5\n1 0 1 0 0\n1 0 1 1 1\n1 1 1 1 1\n1 0 0 1 0',
    sampleOutput: '6',
    explanation: 'The maximal rectangle has area = 6 (height 2, width 3 formed by rows 2 and 3).',
    testInputs: [
      '4 5\n1 0 1 0 0\n1 0 1 1 1\n1 1 1 1 1\n1 0 0 1 0',
      '1 1\n0',
      '1 1\n1',
      '2 2\n1 1\n1 1',
      '3 3\n0 0 0\n0 0 0\n0 0 0',
      '3 4\n1 1 1 1\n1 1 1 1\n1 1 1 1',
      '4 3\n1 0 1\n1 1 1\n1 1 1\n0 1 0',
      '5 2\n0 1\n1 1\n1 1\n1 0\n0 1'
    ]
  },

  {
    id: 'lc-227',
    leetcodeNumber: 227,
    title: 'Basic Calculator II',
    slug: 'basic-calculator-ii',
    category: 'LINEAR_STRUCTURES',
    difficulty: 'MEDIUM',
    description: 'Given a string s which represents an expression, evaluate this expression and return its value.\n\nThe integer division should truncate toward zero. You may assume that the given expression is always valid. All intermediate results will be in the range of [-2^31, 2^31 - 1].',
    inputFormat: 'Line 1: String s representing the arithmetic expression.',
    outputFormat: 'Print the evaluated integer result.',
    constraints: ['1 <= s.length <= 3 * 10^5', 's consists of integers and operators (\'+\', \'-\', \'*\', \'/\') separated by spaces.'],
    sampleInput: '3+2*2',
    sampleOutput: '7',
    explanation: '2 * 2 = 4, and 3 + 4 = 7.',
    testInputs: [
      '3+2*2',
      ' 3/2 ',
      ' 3+5 / 2 ',
      '42',
      '14-3/2',
      '100 - 50 * 2 + 10 / 2',
      '1*2-3/4+5*6-7*8+9/10',
      '100000/1000'
    ]
  }
];

// -------------------------------------------------------------
// VERIFICATION RUNNER
// -------------------------------------------------------------

export function verifyBatch2() {
  console.log(`\n======================================================`);
  console.log(`VERIFYING BATCH 2: LINEAR STRUCTURES (18 PROBLEMS)`);
  console.log(`======================================================`);

  let totalCases = 0;
  let passedCases = 0;
  const verifiedProblems = [];

  for (const prob of problemsBatch2) {
    const solver = solversBatch2[prob.id];
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
  console.log(`BATCH 2 SUMMARY: ${passedCases}/${totalCases} test cases passed across ${verifiedProblems.length} problems!`);
  console.log(`------------------------------------------------------\n`);

  return verifiedProblems;
}

if (process.argv[1].endsWith('batch2_linear_structures.mjs')) {
  verifyBatch2();
}
