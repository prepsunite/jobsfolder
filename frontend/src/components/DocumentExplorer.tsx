import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { type DocTabNode } from '@/services/dataStore';
import ContentRenderer from '@/components/ContentRenderer';
import RichTextEditor from '@/components/RichTextEditor';
import { TreeNodeItem } from '@/components/TreeNodeItem';
import {
  cloneTree,
  moveUp,
  moveDown,
  deleteNode,
  addChildTo,
  addAfterNode,
  updateNode,
  makeNewNode,
  flattenNodes,
  findNodeById,
} from '@/utils/treeUtils';
import {
  FileText,
  Search,
  Lock,
  Unlock,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Sparkles,
  Plus,
  Settings2,
} from 'lucide-react';

interface DocumentExplorerProps {
  examName: string;
  companyName: string;
  tabs: DocTabNode[];
  hasAccess: boolean;
  isAdmin?: boolean;
  isPublicExam?: boolean;
  watermarkText?: string;
  onOpenPaywall: () => void;
  onUpdateTabs?: (updatedTabs: DocTabNode[]) => void;
  onToggleExamPublic?: (isPublic: boolean) => void;
}

export default function DocumentExplorer({
  examName,
  companyName,
  tabs,
  hasAccess,
  isAdmin = false,
  watermarkText,
  onOpenPaywall,
  onUpdateTabs,
  onToggleExamPublic,
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

  const handleBulkSetAccess = (makeFree: boolean) => {
    const setRecursive = (nodes: DocTabNode[]): DocTabNode[] => {
      return nodes.map(n => ({
        ...n,
        isFree: makeFree,
        children: n.children ? setRecursive(n.children) : undefined,
      }));
    };
    const updated = setRecursive(localTabs);
    persist(updated);
    onToggleExamPublic?.(makeFree);
  };

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
  const [adminMode, setAdminMode] = useState(false);

  const flatNodes = useMemo(() => flattenNodes(localTabs), [localTabs]);

  const activeNode = useMemo(() => {
    return findNodeById(localTabs, selectedNodeId) || localTabs[0] || null;
  }, [localTabs, selectedNodeId]);

  const currentIndex = flatNodes.findIndex(n => n.id === activeNode?.id);
  const prevNode = currentIndex > 0 ? flatNodes[currentIndex - 1] : null;
  const nextNode = currentIndex < flatNodes.length - 1 ? flatNodes[currentIndex + 1] : null;

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // ── Admin tree operations ──────────────────────────────────────────────
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

  const handleToggleNodeAccess = (node: DocTabNode) => {
    const newIsFree = !(node.isFree === true);
    const updated = updateNode(localTabs, node.id, { isFree: newIsFree });
    persist(updated);
    const allFree = flattenNodes(updated).every(n => n.isFree === true);
    onToggleExamPublic?.(allFree);
  };

  const handleContentChange = useCallback((newContent: string) => {
    if (!activeNode) return;
    persist(updateNode(localTabs, activeNode.id, { content: newContent }));
  }, [activeNode, localTabs, persist]);

  return (
    <div className="w-full rounded-lg overflow-hidden border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] shadow-xs flex flex-col md:flex-row min-h-[680px]">

      {/* ── LEFT SIDEBAR ─────────────────────────────────────────────────── */}
      <div className="w-full md:w-72 lg:w-80 border-r border-[#E9ECEF] dark:border-[#242424] bg-[#F8F9FA] dark:bg-[#0C0C0C] flex flex-col shrink-0">

        {/* Sidebar Header */}
        <div className="p-3 border-b border-[#E9ECEF] dark:border-[#242424] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#FD4A32]/10 text-[#FD4A32] dark:bg-[#FD4A32]/10 dark:text-[#FD4A32] flex items-center justify-center font-display">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-display font-bold uppercase tracking-wider text-[#121417] dark:text-[#FFFFFF]">Paper Sections</h4>
                <p className="text-[10px] text-[#868E96] dark:text-[#555555]">{flatNodes.length} sections</p>
              </div>
            </div>

            {/* Admin Mode Toggle */}
            {isAdmin && (
              <button
                onClick={() => setAdminMode(v => !v)}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-display font-bold transition-all border ${
                  adminMode
                    ? 'bg-purple-700 text-white border-purple-700'
                    : 'border-[#E9ECEF] dark:border-[#2E2E2E] text-[#868E96] dark:text-[#555555] hover:border-purple-400 hover:text-purple-600'
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
              className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-md border border-dashed border-purple-400 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-[10px] font-display font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Root File
            </button>
          )}

          {/* Admin Bulk Exam Access Toggle */}
          {isAdmin && adminMode && (
            <div className="p-2.5 rounded-md bg-purple-500/10 border border-purple-500/20 space-y-1.5 animate-fadeIn">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-extrabold text-purple-800 dark:text-purple-300 truncate">
                  {examName} Access:
                </span>
                <span className="text-[9px] font-bold text-[#868E96] dark:text-[#555555]">
                  {flatNodes.filter(n => n.isFree === true).length}/{flatNodes.length} Free
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleBulkSetAccess(true)}
                  className="py-1 px-2 rounded font-display font-bold text-[9px] uppercase bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 transition-all cursor-pointer flex items-center justify-center gap-1"
                  title="Make all tabs in this exam Free"
                >
                  <Unlock className="w-3 h-3" /> Make All Free
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkSetAccess(false)}
                  className="py-1 px-2 rounded font-display font-bold text-[9px] uppercase bg-amber-500/20 hover:bg-amber-500/30 text-amber-700 dark:text-amber-300 border border-amber-500/30 transition-all cursor-pointer flex items-center justify-center gap-1"
                  title="Make all tabs in this exam Paid (Locked)"
                >
                  <Lock className="w-3 h-3" /> Make All Paid
                </button>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="w-3 h-3 absolute left-2.5 top-2.5 text-[#868E96] dark:text-[#555555]" />
            <input
              type="text"
              placeholder="Search topics..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-7 pr-3 py-1.5 rounded-md bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] text-xs text-[#121417] dark:text-[#FFFFFF] focus:outline-none focus:border-[#121417] dark:focus:border-[#444444]"
            />
          </div>
        </div>

        {/* Tree Node List (Modular TreeNodeItem) */}
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5 custom-scrollbar">
          {localTabs.length > 0 ? (
            localTabs.map(node => (
              <TreeNodeItem
                key={node.id}
                node={node}
                selectedNodeId={selectedNodeId}
                expandedIds={expandedIds}
                renamingId={renamingId}
                renameValue={renameValue}
                emojiValue={emojiValue}
                adminMode={adminMode}
                isAdmin={isAdmin}
                searchQuery={searchQuery}
                onSelectNode={setSelectedNodeId}
                onToggleExpand={toggleExpand}
                onSetRenameValue={setRenameValue}
                onSetEmojiValue={setEmojiValue}
                onCommitRename={commitRename}
                onCancelRename={() => setRenamingId(null)}
                onStartRename={startRename}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onAddChild={handleAddChild}
                onAddAfter={handleAddAfter}
                onDeleteNode={handleDelete}
                onToggleNodeAccess={handleToggleNodeAccess}
              />
            ))
          ) : (
            <div className="p-6 text-center text-xs text-[#868E96] dark:text-[#555555] space-y-3">
              <FileText className="w-8 h-8 mx-auto opacity-30" />
              <p>No document sections yet.</p>
              {isAdmin && (
                <button
                  onClick={handleAddRootFile}
                  className="mx-auto flex items-center gap-1 px-3 py-1.5 bg-purple-700 text-white rounded-md text-[10px] font-display font-bold uppercase tracking-wider hover:bg-purple-600 transition-colors"
                >
                  <Plus className="w-3 h-3" /> Add Section
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT CONTENT PANEL ──────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col relative min-h-[600px] overflow-hidden bg-white dark:bg-[#141414]">

        {/* PAYWALL OVERLAY */}
        {!(hasAccess || isAdmin || activeNode?.isFree === true) ? (
          <div className="relative flex-1 flex flex-col items-center justify-center p-6 sm:p-12 text-center bg-[#F8F9FA]/50 dark:bg-[#0C0C0C]/50">
            {/* Visual Abstract Skeleton Background */}
            <div className="absolute inset-0 p-8 opacity-10 filter blur-xs pointer-events-none select-none overflow-hidden space-y-6">
              <div className="h-6 bg-current rounded w-2/3 opacity-40" />
              <div className="h-0.5 bg-current w-full opacity-20" />
              <div className="space-y-3 pt-2">
                <div className="h-4 bg-current rounded w-1/3 opacity-30" />
                <div className="h-3 bg-current rounded w-full opacity-20" />
                <div className="h-3 bg-current rounded w-5/6 opacity-20" />
              </div>
            </div>

            {/* Lock card */}
            <div className="relative z-10 max-w-md w-full p-6 sm:p-8 rounded-lg bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] shadow-lg space-y-4">
              <div className="w-12 h-12 rounded-md bg-[#FD4A32]/10 text-[#FD4A32] dark:bg-[#FD4A32]/10 dark:text-[#FD4A32] flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#FD4A32]/10 text-[#FD4A32] dark:bg-[#FD4A32]/10 dark:text-[#FD4A32] text-[9px] font-display font-bold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" /> Previous Paper Locked
                </span>
                <h3 className="font-display text-lg font-extrabold text-[#121417] dark:text-[#FFFFFF]">
                  Unlock Complete {examName} Archive
                </h3>
                <p className="text-xs text-[#868E96] dark:text-[#555555] leading-relaxed font-sans">
                  Unlock full access to all sections, solved memory questions, and code solutions for <strong>{companyName} – {examName}</strong>.
                </p>
              </div>
              <button
                onClick={onOpenPaywall}
                className="w-full py-2.5 px-4 rounded-md bg-[#FD4A32] dark:bg-[#FD4A32] hover:bg-[#E0351D] text-black font-display font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Unlock All {examName} Tabs (from ₹99)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-center justify-center gap-2 text-[10px] font-semibold text-[#868E96] dark:text-[#555555]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FD4A32] dark:text-[#FD4A32]" />
                <span>1-Year Access (₹99) · All-Company Pass (₹299/mo)</span>
              </div>
            </div>
          </div>

        ) : isAdmin && adminMode ? (
          /* ── ADMIN EDIT PANEL ──────────────────────────────────────── */
          <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
            {activeNode ? (
              <>
                {/* Node meta editor */}
                <div className="p-4 border-b border-[#E9ECEF] dark:border-[#242424] bg-purple-50/50 dark:bg-purple-900/10 space-y-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-widest font-display">
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
                      className="w-10 text-center text-xl bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] rounded-md py-1"
                      maxLength={2}
                      title="Emoji icon"
                    />
                    <input
                      value={activeNode.title}
                      onChange={e => persist(updateNode(localTabs, activeNode.id, { title: e.target.value }))}
                      className="flex-1 bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] rounded-md px-3 py-1.5 text-sm font-bold text-[#121417] dark:text-[#FFFFFF] focus:outline-none focus:border-[#121417]"
                      placeholder="Section title..."
                    />

                    {/* Access level toggle for single active section */}
                    <button
                      type="button"
                      onClick={() => handleToggleNodeAccess(activeNode)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-black transition-all border cursor-pointer ${
                        activeNode.isFree === true
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                          : 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/25'
                      }`}
                      title="Toggle whether non-paying users can view this section for free or must purchase access"
                    >
                      {activeNode.isFree === true ? (
                        <>
                          <Unlock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>Free (Single Tab)</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          <span>Paid (Single Tab)</span>
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
              <div className="flex-1 flex flex-col items-center justify-center gap-3 text-[#868E96] p-8 text-center">
                <FileText className="w-10 h-10 opacity-30" />
                <p className="text-sm font-semibold">Select a section from the left to edit its content.</p>
                <button
                  onClick={handleAddRootFile}
                  className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 text-white rounded-md text-xs font-bold hover:bg-purple-500 transition-colors"
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
              <div className="space-y-3 border-b border-[#E9ECEF] dark:border-[#242424] pb-6 mb-8">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{activeNode.emoji || '📄'}</span>
                    <div>
                      <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#121417] dark:text-[#FFFFFF]">{activeNode.title}</h1>
                      <p className="text-xs text-[#868E96] dark:text-[#555555] mt-0.5">{companyName} • {examName} Official Placement Series</p>
                    </div>
                  </div>
                  {activeNode.isFree === true && (
                    <span className="px-2.5 py-1 rounded-md bg-[#FD4A32]/10 border border-[#FD4A32]/20 text-[#FD4A32] dark:text-[#FD4A32] text-[10px] font-display font-bold uppercase tracking-wider flex items-center gap-1">
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
              <div className="p-8 text-center text-[#868E96] text-xs">Select a section from the left.</div>
            )}

            {/* Prev / Next navigation */}
            {flatNodes.length > 1 && (
              <div className="mt-12 pt-6 border-t border-[#E9ECEF] dark:border-[#242424] flex items-center justify-between gap-4">
                {prevNode ? (
                  <button onClick={() => setSelectedNodeId(prevNode.id)} className="flex items-center gap-2 p-3 rounded-md border border-[#E9ECEF] dark:border-[#242424] hover:bg-[#F8F9FA] dark:hover:bg-[#141414] text-left group transition-all cursor-pointer">
                    <span className="text-lg text-[#121417] dark:text-[#FFFFFF]">←</span>
                    <div>
                      <span className="block text-[10px] text-[#868E96] dark:text-[#555555] uppercase tracking-wider font-display font-bold">Previous</span>
                      <span className="text-xs font-bold text-[#121417] dark:text-[#FFFFFF] group-hover:text-[#FD4A32] dark:group-hover:text-[#FD4A32]">{prevNode.title}</span>
                    </div>
                  </button>
                ) : <div />}

                {nextNode && (
                  <button onClick={() => setSelectedNodeId(nextNode.id)} className="flex items-center gap-2 p-3 rounded-md border border-[#E9ECEF] dark:border-[#242424] hover:bg-[#F8F9FA] dark:hover:bg-[#141414] text-right group transition-all ml-auto cursor-pointer">
                    <div>
                      <span className="block text-[10px] text-[#868E96] dark:text-[#555555] uppercase tracking-wider font-display font-bold">Next</span>
                      <span className="text-xs font-bold text-[#121417] dark:text-[#FFFFFF] group-hover:text-[#FD4A32] dark:group-hover:text-[#FD4A32]">{nextNode.title}</span>
                    </div>
                    <span className="text-lg text-[#121417] dark:text-[#FFFFFF]">→</span>
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
