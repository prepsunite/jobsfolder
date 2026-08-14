import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { type DocTabNode } from '@/services/dataStore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import ContentRenderer from '@/components/ContentRenderer';
import RichTextEditor from '@/components/RichTextEditor';
import {
  ChevronRight,
  ChevronDown,
  FileText,
  Search,
  Lock,
  Unlock,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Sparkles,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  FilePlus,
  FolderPlus,
  Edit3,
  Check,
  X,
  GripVertical,
  Settings2,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface DocumentExplorerProps {
  examName: string;
  companyName: string;
  tabs: DocTabNode[];
  hasAccess: boolean;
  isAdmin?: boolean;
  watermarkText?: string;
  onOpenPaywall: () => void;
  onUpdateTabs?: (updatedTabs: DocTabNode[]) => void;
}

// ─── Tree Manipulation Helpers (pure functions) ──────────────────────────────
function cloneTree(nodes: DocTabNode[]): DocTabNode[] {
  return JSON.parse(JSON.stringify(nodes));
}

/** Returns true if a modification was made */
function findAndModify(
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

function moveUp(nodes: DocTabNode[], nodeId: string): DocTabNode[] {
  const tree = cloneTree(nodes);
  findAndModify(tree, nodeId, (node, siblings, i) => {
    if (i > 0) { siblings.splice(i, 1); siblings.splice(i - 1, 0, node); }
  });
  return tree;
}

function moveDown(nodes: DocTabNode[], nodeId: string): DocTabNode[] {
  const tree = cloneTree(nodes);
  findAndModify(tree, nodeId, (node, siblings, i) => {
    if (i < siblings.length - 1) { siblings.splice(i, 1); siblings.splice(i + 1, 0, node); }
  });
  return tree;
}

function deleteNode(nodes: DocTabNode[], nodeId: string): DocTabNode[] {
  const tree = cloneTree(nodes);
  findAndModify(tree, nodeId, (_node, siblings, i) => { siblings.splice(i, 1); });
  return tree;
}

function addChildTo(nodes: DocTabNode[], parentId: string, newNode: DocTabNode): DocTabNode[] {
  const tree = cloneTree(nodes);
  findAndModify(tree, parentId, (node) => {
    node.children = node.children ? [...node.children, newNode] : [newNode];
  });
  return tree;
}

function addAfterNode(nodes: DocTabNode[], siblingId: string, newNode: DocTabNode): DocTabNode[] {
  const tree = cloneTree(nodes);
  let inserted = false;
  const insert = (arr: DocTabNode[]): boolean => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === siblingId) { arr.splice(i + 1, 0, newNode); inserted = true; return true; }
      if (arr[i].children && insert(arr[i].children!)) return true;
    }
    return false;
  };
  insert(tree);
  if (!inserted) tree.push(newNode); // fallback: push to root
  return tree;
}

function updateNode(nodes: DocTabNode[], nodeId: string, updates: Partial<DocTabNode>): DocTabNode[] {
  const tree = cloneTree(nodes);
  findAndModify(tree, nodeId, (node) => { Object.assign(node, updates); });
  return tree;
}

function makeNewNode(title: string): DocTabNode {
  return {
    id: `node-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title,
    content: `### ${title}\n\nWrite content here...`,
    emoji: '📄',
  };
}

function flattenNodes(nodes: DocTabNode[]): DocTabNode[] {
  const list: DocTabNode[] = [];
  const traverse = (arr: DocTabNode[]) => arr.forEach(n => { list.push(n); if (n.children) traverse(n.children); });
  traverse(nodes);
  return list;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function DocumentExplorer({
  examName,
  companyName,
  tabs,
  hasAccess,
  isAdmin = false,
  watermarkText,
  onOpenPaywall,
  onUpdateTabs,
}: DocumentExplorerProps) {

  // Local tab state — keeps admin edits fast without prop round-trips
  const [localTabs, setLocalTabs] = useState<DocTabNode[]>(() => cloneTree(tabs));

  // Sync from parent when tabs change externally (e.g. exam switch)
  useEffect(() => {
    setLocalTabs(cloneTree(tabs));
  }, [tabs]);

  const persist = useCallback((newTabs: DocTabNode[]) => {
    setLocalTabs(newTabs);
    onUpdateTabs?.(newTabs);
  }, [onUpdateTabs]);

  const [selectedNodeId, setSelectedNodeId] = useState<string>(() => tabs[0]?.id || '');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    const expand = (nodes: DocTabNode[]) => nodes.forEach(n => { map[n.id] = true; if (n.children) expand(n.children); });
    expand(tabs);
    return map;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [emojiValue, setEmojiValue] = useState('');
  const [adminMode, setAdminMode] = useState(false); // shown in admin but toggleable

  const flatNodes = useMemo(() => flattenNodes(localTabs), [localTabs]);

  const activeNode = useMemo(() => {
    const find = (nodes: DocTabNode[], id: string): DocTabNode | null => {
      for (const n of nodes) {
        if (n.id === id) return n;
        if (n.children) { const f = find(n.children, id); if (f) return f; }
      }
      return null;
    };
    return find(localTabs, selectedNodeId) || localTabs[0] || null;
  }, [localTabs, selectedNodeId]);

  const currentIndex = flatNodes.findIndex(n => n.id === activeNode?.id);
  const prevNode = currentIndex > 0 ? flatNodes[currentIndex - 1] : null;
  const nextNode = currentIndex < flatNodes.length - 1 ? flatNodes[currentIndex + 1] : null;

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const matchesSearch = (node: DocTabNode, q: string): boolean => {
    if (!q) return true;
    const lq = q.toLowerCase();
    if (node.title.toLowerCase().includes(lq) || node.content.toLowerCase().includes(lq)) return true;
    return !!node.children?.some(c => matchesSearch(c, q));
  };

  // ── Admin: tree operations ──────────────────────────────────────────────
  const handleAddRootFile = () => {
    const n = makeNewNode('New File');
    const updated = [...localTabs, n];
    persist(updated);
    setSelectedNodeId(n.id);
  };

  const handleAddAfter = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    const n = makeNewNode('New File');
    persist(addAfterNode(localTabs, nodeId, n));
    setSelectedNodeId(n.id);
  };

  const handleAddChild = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    const n = makeNewNode('New Subtab');
    const updated = addChildTo(localTabs, nodeId, n);
    persist(updated);
    setExpandedIds(prev => ({ ...prev, [nodeId]: true }));
    setSelectedNodeId(n.id);
  };

  const handleMoveUp = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    persist(moveUp(localTabs, nodeId));
  };

  const handleMoveDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    persist(moveDown(localTabs, nodeId));
  };

  const handleDelete = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    if (!confirm('Delete this section and all its children?')) return;
    const updated = deleteNode(localTabs, nodeId);
    persist(updated);
    if (selectedNodeId === nodeId) setSelectedNodeId(updated[0]?.id || '');
  };

  const startRename = (e: React.MouseEvent, node: DocTabNode) => {
    e.stopPropagation();
    setRenamingId(node.id);
    setRenameValue(node.title);
    setEmojiValue(node.emoji || '📄');
  };

  const commitRename = (nodeId: string) => {
    if (!renameValue.trim()) { setRenamingId(null); return; }
    persist(updateNode(localTabs, nodeId, { title: renameValue.trim(), emoji: emojiValue || '📄' }));
    setRenamingId(null);
  };

  // ── Admin: content editing (right panel) ───────────────────────────────
  const handleContentChange = useCallback((newContent: string) => {
    if (!activeNode) return;
    persist(updateNode(localTabs, activeNode.id, { content: newContent }));
  }, [activeNode, localTabs, persist]);

  // ── Render tree node ───────────────────────────────────────────────────
  const renderTreeNode = (node: DocTabNode, level = 0): React.ReactNode => {
    if (searchQuery && !matchesSearch(node, searchQuery)) return null;

    const hasChildren = !!node.children?.length;
    const isExpanded = !!expandedIds[node.id];
    const isSelected = selectedNodeId === node.id;
    const isRenaming = renamingId === node.id;

    return (
      <div key={node.id} className="select-none">
        <div
          onClick={() => setSelectedNodeId(node.id)}
          style={{ paddingLeft: `${level * 14 + 8}px` }}
          className={`group flex items-center gap-1 py-1.5 px-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
            isSelected
              ? 'bg-purple-600/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 shadow-xs'
              : 'text-[#585c5c] dark:text-[#a6adbb] hover:bg-[#eae1da]/60 dark:hover:bg-[#2b2d31]/60 hover:text-[#1f1b17] dark:hover:text-white'
          }`}
        >
          {/* Expand toggle */}
          {hasChildren ? (
            <button onClick={(e) => toggleExpand(node.id, e)} className="p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 flex-shrink-0">
              {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          ) : (
            <span className="w-4 flex-shrink-0" />
          )}

          {/* Emoji */}
          {isRenaming ? (
            <input
              value={emojiValue}
              onChange={e => setEmojiValue(e.target.value)}
              onClick={e => e.stopPropagation()}
              className="w-8 text-center bg-white dark:bg-[#1e1f22] border border-purple-400 rounded px-0.5 text-sm"
              maxLength={2}
            />
          ) : (
            <span className="text-sm flex-shrink-0">{node.emoji || (hasChildren ? (isExpanded ? '📂' : '📁') : '📄')}</span>
          )}

          {/* Title or Rename input */}
          {isRenaming ? (
            <input
              autoFocus
              value={renameValue}
              onChange={e => setRenameValue(e.target.value)}
              onClick={e => e.stopPropagation()}
              onKeyDown={e => {
                if (e.key === 'Enter') commitRename(node.id);
                if (e.key === 'Escape') setRenamingId(null);
              }}
              className="flex-1 min-w-0 bg-white dark:bg-[#1e1f22] border border-purple-400 rounded px-1 py-0.5 text-xs focus:outline-none"
            />
          ) : (
            <div className="flex-1 min-w-0 flex items-center justify-between gap-1">
              <span className="truncate">{node.title}</span>
              {node.isFree ? (
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 uppercase tracking-wider flex-shrink-0">
                  FREE
                </span>
              ) : adminMode && isAdmin ? (
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 uppercase tracking-wider flex-shrink-0 opacity-70 group-hover:opacity-100">
                  PAID
                </span>
              ) : null}
            </div>
          )}

          {/* Admin action buttons */}
          {adminMode && isAdmin && (
            <div
              className="flex items-center gap-0.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
              onClick={e => e.stopPropagation()}
            >
              {isRenaming ? (
                <>
                  <button onClick={() => commitRename(node.id)} className="p-0.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded" title="Save name">
                    <Check className="w-3 h-3" />
                  </button>
                  <button onClick={() => setRenamingId(null)} className="p-0.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded" title="Cancel">
                    <X className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <>
                  <button onClick={e => startRename(e, node)} className="p-0.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded" title="Rename">
                    <Edit3 className="w-3 h-3" />
                  </button>
                  <button onClick={e => handleMoveUp(e, node.id)} className="p-0.5 text-[#747878] dark:text-[#a6adbb] hover:bg-[#f6ece6] dark:hover:bg-[#2b2d31] rounded" title="Move up">
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button onClick={e => handleMoveDown(e, node.id)} className="p-0.5 text-[#747878] dark:text-[#a6adbb] hover:bg-[#f6ece6] dark:hover:bg-[#2b2d31] rounded" title="Move down">
                    <ArrowDown className="w-3 h-3" />
                  </button>
                  <button onClick={e => handleAddChild(e, node.id)} className="p-0.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded" title="Add subtab inside">
                    <FolderPlus className="w-3 h-3" />
                  </button>
                  <button onClick={e => handleAddAfter(e, node.id)} className="p-0.5 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded" title="Add file after">
                    <FilePlus className="w-3 h-3" />
                  </button>
                  <button onClick={e => handleDelete(e, node.id)} className="p-0.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded" title="Delete">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="mt-0.5 space-y-0.5 border-l border-[#eae1da] dark:border-[#2b2d31] ml-4">
            {node.children!.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // ─── Main Render ─────────────────────────────────────────────────────────
  return (
    <div className="w-full rounded-2xl overflow-hidden border border-[#eae1da] dark:border-[#2b2d31] bg-white dark:bg-[#141517] shadow-xl flex flex-col md:flex-row min-h-[680px]">

      {/* ── LEFT SIDEBAR ─────────────────────────────────────────────────── */}
      <div className="w-full md:w-72 lg:w-80 border-r border-[#eae1da] dark:border-[#2b2d31] bg-[#fbf7f4]/80 dark:bg-[#18191c]/80 flex flex-col shrink-0">

        {/* Sidebar Header */}
        <div className="p-3 border-b border-[#eae1da] dark:border-[#2b2d31] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-[#1f1b17] dark:text-white">Document Tabs</h4>
                <p className="text-[10px] text-[#747878] dark:text-[#a6adbb]">{flatNodes.length} sections</p>
              </div>
            </div>

            {/* Admin Mode Toggle */}
            {isAdmin && (
              <button
                onClick={() => setAdminMode(v => !v)}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                  adminMode
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'border-[#e2d8d2] dark:border-[#383a40] text-[#747878] dark:text-[#a6adbb] hover:border-purple-400 hover:text-purple-600'
                }`}
                title="Toggle admin editing mode"
              >
                <Settings2 className="w-3 h-3" />
                <span>{adminMode ? 'Editing' : 'Manage'}</span>
              </button>
            )}
          </div>

          {/* Admin Root-level Add */}
          {isAdmin && adminMode && (
            <button
              onClick={handleAddRootFile}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl border border-dashed border-purple-400 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-[11px] font-bold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Root File
            </button>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="w-3 h-3 absolute left-2.5 top-2.5 text-[#747878] dark:text-[#a6adbb]" />
            <input
              type="text"
              placeholder="Search topics..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-7 pr-3 py-1.5 rounded-xl bg-white dark:bg-[#202225] border border-[#eae1da] dark:border-[#383a40] text-xs focus:outline-none focus:ring-1 focus:ring-purple-500/50"
            />
          </div>
        </div>

        {/* Admin Controls Legend */}
        {isAdmin && adminMode && (
          <div className="px-3 py-2 bg-purple-500/5 border-b border-purple-200/30 dark:border-purple-700/20 flex items-center gap-2 flex-wrap">
            <span className="text-[9px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Hover a node →</span>
            <span className="flex items-center gap-0.5 text-[9px] text-[#747878] dark:text-[#a6adbb]"><Edit3 className="w-2.5 h-2.5" />Rename</span>
            <span className="flex items-center gap-0.5 text-[9px] text-[#747878] dark:text-[#a6adbb]"><ArrowUp className="w-2.5 h-2.5" /><ArrowDown className="w-2.5 h-2.5" />Reorder</span>
            <span className="flex items-center gap-0.5 text-[9px] text-[#747878] dark:text-[#a6adbb]"><FolderPlus className="w-2.5 h-2.5" />Subtab</span>
            <span className="flex items-center gap-0.5 text-[9px] text-[#747878] dark:text-[#a6adbb]"><FilePlus className="w-2.5 h-2.5" />File After</span>
            <span className="flex items-center gap-0.5 text-[9px] text-rose-500"><Trash2 className="w-2.5 h-2.5" />Delete</span>
          </div>
        )}

        {/* Tree Node List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5 custom-scrollbar">
          {localTabs.length > 0 ? (
            localTabs.map(node => renderTreeNode(node))
          ) : (
            <div className="p-6 text-center text-xs text-[#747878] dark:text-[#a6adbb] space-y-3">
              <FileText className="w-8 h-8 mx-auto opacity-30" />
              <p>No document sections yet.</p>
              {isAdmin && (
                <button
                  onClick={handleAddRootFile}
                  className="mx-auto flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white rounded-xl text-[11px] font-bold hover:bg-purple-500 transition-colors"
                >
                  <Plus className="w-3 h-3" /> Add First Section
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT CONTENT PANEL ──────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col relative min-h-[600px] overflow-hidden bg-white dark:bg-[#141517]">

        {/* PAYWALL OVERLAY */}
        {!(hasAccess || isAdmin || activeNode?.isFree === true) ? (
          <div className="relative flex-1 flex flex-col items-center justify-center p-6 sm:p-12 text-center bg-[#f6ece6]/30 dark:bg-[#141517]/30">
            {/* Visual Abstract Skeleton Background (ZERO Text/Questions in HTML) */}
            <div className="absolute inset-0 p-8 opacity-10 filter blur-xs pointer-events-none select-none overflow-hidden space-y-6">
              <div className="h-6 bg-current rounded-xl w-2/3 opacity-40" />
              <div className="h-0.5 bg-current w-full opacity-20" />
              <div className="space-y-3 pt-2">
                <div className="h-4 bg-current rounded-lg w-1/3 opacity-30" />
                <div className="h-3 bg-current rounded-md w-full opacity-20" />
                <div className="h-3 bg-current rounded-md w-5/6 opacity-20" />
                <div className="h-3 bg-current rounded-md w-4/5 opacity-20" />
              </div>
              <div className="space-y-3 pt-4">
                <div className="h-4 bg-current rounded-lg w-2/5 opacity-30" />
                <div className="h-3 bg-current rounded-md w-full opacity-20" />
                <div className="h-3 bg-current rounded-md w-3/4 opacity-20" />
                <div className="h-3 bg-current rounded-md w-11/12 opacity-20" />
              </div>
              <div className="space-y-3 pt-4">
                <div className="h-4 bg-current rounded-lg w-1/4 opacity-30" />
                <div className="h-3 bg-current rounded-md w-full opacity-20" />
                <div className="h-3 bg-current rounded-md w-2/3 opacity-20" />
              </div>
            </div>

            {/* Lock card */}
            <div className="relative z-10 max-w-md w-full p-8 rounded-[28px] bg-white/95 dark:bg-[#1e1f22]/95 border border-[#eae1da] dark:border-[#383a40] shadow-2xl space-y-5 backdrop-blur-md">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto shadow-md">
                <Lock className="w-7 h-7 animate-pulse" />
              </div>
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-400 text-[10px] font-extrabold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" /> Official Papers Locked
                </span>
                <h3 className="font-display text-xl font-black text-[#1f1b17] dark:text-[#e3e3e3]">
                  Unlock {activeNode?.title || 'Official Paper'}
                </h3>
                <p className="text-xs text-[#747878] dark:text-[#a6adbb] leading-relaxed">
                  Unlock access to all official placement papers for <strong>{companyName} – {examName}</strong>.
                </p>
              </div>
              <button
                onClick={onOpenPaywall}
                className="w-full py-4 px-6 rounded-2xl bg-purple-700 hover:bg-purple-600 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-purple-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4 text-purple-300" />
                <span>Unlock Access (from ₹99)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-[#747878] dark:text-[#a6adbb]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Single Paper (₹99) • Monthly All-Access (₹299/mo)</span>
              </div>
            </div>
          </div>

        ) : isAdmin && adminMode ? (
          /* ── ADMIN EDIT PANEL ──────────────────────────────────────── */
          <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
            {activeNode ? (
              <>
                {/* Node meta editor */}
                <div className="p-4 border-b border-[#eae1da] dark:border-[#2b2d31] bg-purple-50/50 dark:bg-purple-900/10 space-y-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-widest">
                    <Settings2 className="w-3 h-3" />
                    Editing Section
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      value={emojiValue || activeNode.emoji || '📄'}
                      onChange={e => {
                        const val = e.target.value;
                        setEmojiValue(val);
                        persist(updateNode(localTabs, activeNode.id, { emoji: val }));
                      }}
                      className="w-10 text-center text-xl bg-white dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#383a40] rounded-lg py-1"
                      maxLength={2}
                      title="Emoji icon"
                    />
                    <input
                      value={activeNode.title}
                      onChange={e => persist(updateNode(localTabs, activeNode.id, { title: e.target.value }))}
                      className="flex-1 bg-white dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#383a40] rounded-xl px-3 py-1.5 text-sm font-bold text-[#1f1b17] dark:text-[#e3e3e3] focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                      placeholder="Section title..."
                    />

                    {/* Access level toggle */}
                    <button
                      onClick={() => persist(updateNode(localTabs, activeNode.id, { isFree: !activeNode.isFree }))}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all border cursor-pointer ${
                        activeNode.isFree
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                          : 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/25'
                      }`}
                      title="Toggle whether non-paying users can view this section for free or must purchase access"
                    >
                      {activeNode.isFree ? (
                        <>
                          <Unlock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>Free (Public)</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          <span>Paid (Locked)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Rich text editor for content */}
                <div className="flex-1 p-4">
                  <RichTextEditor
                    title={`Editing: ${activeNode.title}`}
                    value={activeNode.content}
                    onChange={handleContentChange}
                    placeholder="Write section content in Markdown..."
                    minHeight="400px"
                  />
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 text-[#747878] p-8 text-center">
                <FileText className="w-10 h-10 opacity-30" />
                <p className="text-sm font-semibold">Select a section from the left to edit its content.</p>
                <button
                  onClick={handleAddRootFile}
                  className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-500 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add First Section
                </button>
              </div>
            )}
          </div>

        ) : (
          /* ── READER PANEL ──────────────────────────────────────────── */
          <div className="flex-1 flex flex-col relative overflow-y-auto custom-scrollbar p-6 sm:p-10 select-none">

            {/* Watermark */}
            {watermarkText && (
              <div className="absolute inset-0 z-20 pointer-events-none select-none overflow-hidden flex flex-wrap content-around justify-around p-8 gap-20 font-mono text-xs font-black text-emerald-800 dark:text-emerald-300 opacity-10">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} style={{ transform: `rotate(${-38 - (i % 5) * 3}deg)`, opacity: 0.08 + (i % 4) * 0.02 }} className="whitespace-nowrap tracking-widest uppercase">
                    {watermarkText}
                  </div>
                ))}
              </div>
            )}

            {/* Document header */}
            {activeNode && (
              <div className="space-y-3 border-b border-[#eae1da] dark:border-[#2b2d31] pb-6 mb-8">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{activeNode.emoji || '📄'}</span>
                    <div>
                      <h1 className="font-display text-2xl sm:text-3xl font-black text-[#1f1b17] dark:text-white">{activeNode.title}</h1>
                      <p className="text-xs text-[#747878] dark:text-[#a6adbb] mt-0.5">{companyName} • {examName} Official Placement Series</p>
                    </div>
                  </div>
                  {activeNode.isFree && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                      <Unlock className="w-3 h-3" /> Free Practice Guide
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Document content */}
            {activeNode ? (
              <ContentRenderer
                content={activeNode.content}
                emptyText="No content added yet."
              />
            ) : (
              <div className="p-8 text-center text-gray-500 text-xs">Select a section from the left.</div>
            )}

            {/* Prev / Next navigation */}
            {flatNodes.length > 1 && (
              <div className="mt-12 pt-6 border-t border-[#eae1da] dark:border-[#2b2d31] flex items-center justify-between gap-4">
                {prevNode ? (
                  <button onClick={() => setSelectedNodeId(prevNode.id)} className="flex items-center gap-2 p-3 rounded-2xl border border-[#eae1da] dark:border-[#2b2d31] hover:bg-[#f6ece6] dark:hover:bg-[#1e1f22] text-left group transition-all">
                    <span className="text-lg">←</span>
                    <div>
                      <span className="block text-[10px] text-[#747878] dark:text-[#a6adbb] uppercase tracking-wider">Previous</span>
                      <span className="text-xs font-bold text-[#1f1b17] dark:text-white group-hover:text-purple-600">{prevNode.title}</span>
                    </div>
                  </button>
                ) : <div />}

                {nextNode && (
                  <button onClick={() => setSelectedNodeId(nextNode.id)} className="flex items-center gap-2 p-3 rounded-2xl border border-[#eae1da] dark:border-[#2b2d31] hover:bg-[#f6ece6] dark:hover:bg-[#1e1f22] text-right group transition-all ml-auto">
                    <div>
                      <span className="block text-[10px] text-[#747878] dark:text-[#a6adbb] uppercase tracking-wider">Next</span>
                      <span className="text-xs font-bold text-[#1f1b17] dark:text-white group-hover:text-purple-600">{nextNode.title}</span>
                    </div>
                    <span className="text-lg">→</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
