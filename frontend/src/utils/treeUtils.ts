import type { DocTabNode } from '@/services/dataStore';

/**
 * Deep clones a tree of document tab nodes.
 */
export function cloneTree(nodes: DocTabNode[]): DocTabNode[] {
  return JSON.parse(JSON.stringify(nodes));
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
 * Moves a node up among its siblings.
 */
export function moveUp(nodes: DocTabNode[], nodeId: string): DocTabNode[] {
  const tree = cloneTree(nodes);
  findAndModify(tree, nodeId, (node, siblings, i) => {
    if (i > 0) {
      siblings.splice(i, 1);
      siblings.splice(i - 1, 0, node);
    }
  });
  return tree;
}

/**
 * Moves a node down among its siblings.
 */
export function moveDown(nodes: DocTabNode[], nodeId: string): DocTabNode[] {
  const tree = cloneTree(nodes);
  findAndModify(tree, nodeId, (node, siblings, i) => {
    if (i < siblings.length - 1) {
      siblings.splice(i, 1);
      siblings.splice(i + 1, 0, node);
    }
  });
  return tree;
}

/**
 * Deletes a node and all of its descendants from the tree.
 */
export function deleteNode(nodes: DocTabNode[], nodeId: string): DocTabNode[] {
  const tree = cloneTree(nodes);
  findAndModify(tree, nodeId, (_node, siblings, i) => {
    siblings.splice(i, 1);
  });
  return tree;
}

/**
 * Adds a new child node to a specified parent node.
 */
export function addChildTo(nodes: DocTabNode[], parentId: string, newNode: DocTabNode): DocTabNode[] {
  const tree = cloneTree(nodes);
  findAndModify(tree, parentId, (node) => {
    node.children = node.children ? [...node.children, newNode] : [newNode];
  });
  return tree;
}

/**
 * Adds a new sibling node immediately after the specified node.
 */
export function addAfterNode(nodes: DocTabNode[], siblingId: string, newNode: DocTabNode): DocTabNode[] {
  const tree = cloneTree(nodes);
  let inserted = false;
  const insert = (arr: DocTabNode[]): boolean => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === siblingId) {
        arr.splice(i + 1, 0, newNode);
        inserted = true;
        return true;
      }
      if (arr[i].children && insert(arr[i].children!)) return true;
    }
    return false;
  };
  insert(tree);
  if (!inserted) tree.push(newNode); // fallback: push to root
  return tree;
}

/**
 * Updates properties of a target node in the tree.
 */
export function updateNode(nodes: DocTabNode[], nodeId: string, updates: Partial<DocTabNode>): DocTabNode[] {
  const tree = cloneTree(nodes);
  findAndModify(tree, nodeId, (node) => {
    Object.assign(node, updates);
  });
  return tree;
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
    isFree: true, // Default: Free unless admin explicitly locks
  };
}

/**
 * Flattens all nested tree nodes into a sequential array.
 */
export function flattenNodes(nodes: DocTabNode[]): DocTabNode[] {
  const list: DocTabNode[] = [];
  const traverse = (arr: DocTabNode[]) =>
    arr.forEach((n) => {
      list.push(n);
      if (n.children) traverse(n.children);
    });
  traverse(nodes);
  return list;
}

/**
 * Recursively searches tree nodes matching title or content query.
 */
export function matchesSearch(node: DocTabNode, q: string): boolean {
  if (!q) return true;
  const lq = q.toLowerCase();
  if (node.title.toLowerCase().includes(lq) || node.content.toLowerCase().includes(lq)) {
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
