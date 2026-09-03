import type { DocTabNode } from '@/services/dataStore';

/**
 * Deep clones a tree of document tab nodes recursively without JSON stringify overhead.
 */
export function cloneTree(nodes: DocTabNode[]): DocTabNode[] {
  return nodes.map((n) => ({
    ...n,
    children: n.children ? cloneTree(n.children) : undefined,
  }));
}

/**
 * Traverses the tree to find a node by ID and executes a modifier callback.
 * Returns true if a modification was made.
 */
export function findAndModify(
  nodes: DocTabNode[],
  nodeId: string,
  modifier: (node: DocTabNode, siblings: DocTabNode[], idx: number) => void
): boolean {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === nodeId) {
      modifier(nodes[i], nodes, i);
      return true;
    }
    if (nodes[i].children && findAndModify(nodes[i].children!, nodeId, modifier)) {
      return true;
    }
  }
  return false;
}

/**
 * Moves a node up among its siblings (immutable).
 */
export function moveUp(nodes: DocTabNode[], nodeId: string): DocTabNode[] {
  const idx = nodes.findIndex((n) => n.id === nodeId);
  if (idx > 0) {
    const next = [...nodes];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    return next;
  }
  return nodes.map((n) => (n.children ? { ...n, children: moveUp(n.children, nodeId) } : n));
}

/**
 * Moves a node down among its siblings (immutable).
 */
export function moveDown(nodes: DocTabNode[], nodeId: string): DocTabNode[] {
  const idx = nodes.findIndex((n) => n.id === nodeId);
  if (idx >= 0 && idx < nodes.length - 1) {
    const next = [...nodes];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    return next;
  }
  return nodes.map((n) => (n.children ? { ...n, children: moveDown(n.children, nodeId) } : n));
}

/**
 * Deletes a node and all of its descendants from the tree (immutable filter-map).
 */
export function deleteNode(nodes: DocTabNode[], nodeId: string): DocTabNode[] {
  return nodes
    .filter((n) => n.id !== nodeId)
    .map((n) => (n.children ? { ...n, children: deleteNode(n.children, nodeId) } : n));
}

/**
 * Adds a new child node to a specified parent node (immutable structural sharing).
 */
export function addChildTo(nodes: DocTabNode[], parentId: string, newNode: DocTabNode): DocTabNode[] {
  return nodes.map((node) => {
    if (node.id === parentId) {
      return { ...node, children: node.children ? [...node.children, newNode] : [newNode] };
    }
    if (node.children) {
      return { ...node, children: addChildTo(node.children, parentId, newNode) };
    }
    return node;
  });
}

/**
 * Adds a new sibling node immediately after the specified node.
 */
export function addAfterNode(nodes: DocTabNode[], siblingId: string, newNode: DocTabNode): DocTabNode[] {
  const result: DocTabNode[] = [];
  let found = false;

  for (const node of nodes) {
    result.push(node);
    if (node.id === siblingId) {
      result.push(newNode);
      found = true;
    } else if (node.children) {
      const updatedChildren = addAfterNode(node.children, siblingId, newNode);
      if (updatedChildren !== node.children) {
        result[result.length - 1] = { ...node, children: updatedChildren };
        found = true;
      }
    }
  }

  if (!found) {
    result.push(newNode);
  }
  return result;
}

/**
 * Updates properties of a target node in the tree with structural sharing.
 * Only the modified node and its direct ancestors are cloned; all untouched branches
 * retain their object references.
 */
export function updateNode(nodes: DocTabNode[], nodeId: string, updates: Partial<DocTabNode>): DocTabNode[] {
  return nodes.map((node) => {
    if (node.id === nodeId) {
      return { ...node, ...updates };
    }
    if (node.children && node.children.length > 0) {
      const updatedChildren = updateNode(node.children, nodeId, updates);
      if (updatedChildren !== node.children) {
        return { ...node, children: updatedChildren };
      }
    }
    return node;
  });
}

/**
 * Creates a new DocTabNode with defaults.
 */
export function makeNewNode(title: string): DocTabNode {
  return {
    id: `node-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title,
    content: `### ${title}\n\nWrite content here...`,
    emoji: '📄',
    isFree: true,
  };
}

/**
 * Flattens all nested tree nodes into a sequential array using iterative DFS.
 */
export function flattenNodes(nodes: DocTabNode[]): DocTabNode[] {
  const list: DocTabNode[] = [];
  const stack: DocTabNode[] = [...nodes].reverse();
  while (stack.length > 0) {
    const curr = stack.pop()!;
    list.push(curr);
    if (curr.children && curr.children.length > 0) {
      for (let i = curr.children.length - 1; i >= 0; i--) {
        stack.push(curr.children[i]);
      }
    }
  }
  return list;
}

/**
 * Recursively searches tree nodes matching title or content query.
 */
export function matchesSearch(node: DocTabNode, q: string): boolean {
  if (!q) return true;
  const lq = q.toLowerCase();
  if (node.title.toLowerCase().includes(lq) || (node.content && node.content.toLowerCase().includes(lq))) {
    return true;
  }
  return !!node.children?.some((c) => matchesSearch(c, q));
}

/**
 * Finds a specific node in the tree by its ID.
 */
export function findNodeById(nodes: DocTabNode[], id: string): DocTabNode | null {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children) {
      const f = findNodeById(n.children, id);
      if (f) return f;
    }
  }
  return null;
}
