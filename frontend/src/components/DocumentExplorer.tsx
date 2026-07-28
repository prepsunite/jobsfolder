import React, { useState, useMemo } from 'react';
import { type DocTabNode } from '@/services/dataStore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import {
  ChevronRight,
  ChevronDown,
  FileText,
  Search,
  Lock,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Sparkles
} from 'lucide-react';

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
  // State
  const [selectedNodeId, setSelectedNodeId] = useState<string>(() => {
    if (tabs.length > 0) return tabs[0].id;
    return '';
  });

  const [expandedNodeIds, setExpandedNodeIds] = useState<Record<string, boolean>>(() => {
    const initialMap: Record<string, boolean> = {};
    const expandAll = (nodes: DocTabNode[]) => {
      nodes.forEach(node => {
        initialMap[node.id] = true;
        if (node.children) expandAll(node.children);
      });
    };
    expandAll(tabs);
    return initialMap;
  });

  const [searchQuery, setSearchQuery] = useState('');

  // Find active node recursively
  const activeNode = useMemo(() => {
    const findNode = (nodes: DocTabNode[], id: string): DocTabNode | null => {
      for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children) {
          const found = findNode(node.children, id);
          if (found) return found;
        }
      }
      return null;
    };
    return findNode(tabs, selectedNodeId) || tabs[0] || null;
  }, [tabs, selectedNodeId]);

  // Flatten nodes for Prev / Next navigation
  const flatNodes = useMemo(() => {
    const list: DocTabNode[] = [];
    const traverse = (nodes: DocTabNode[]) => {
      nodes.forEach(node => {
        list.push(node);
        if (node.children) traverse(node.children);
      });
    };
    traverse(tabs);
    return list;
  }, [tabs]);

  const currentIndex = flatNodes.findIndex(n => n.id === activeNode?.id);
  const prevNode = currentIndex > 0 ? flatNodes[currentIndex - 1] : null;
  const nextNode = currentIndex < flatNodes.length - 1 ? flatNodes[currentIndex + 1] : null;

  // Toggle expansion
  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodeIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Filtered nodes for search
  const matchesSearch = (node: DocTabNode, query: string): boolean => {
    if (!query) return true;
    const q = query.toLowerCase();
    if (node.title.toLowerCase().includes(q) || node.content.toLowerCase().includes(q)) return true;
    if (node.children) {
      return node.children.some(child => matchesSearch(child, query));
    }
    return false;
  };

  // Render Tree Node recursively
  const renderTreeNode = (node: DocTabNode, level = 0) => {
    if (searchQuery && !matchesSearch(node, searchQuery)) return null;

    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = !!expandedNodeIds[node.id];
    const isSelected = selectedNodeId === node.id;

    return (
      <div key={node.id} className="select-none">
        <div
          onClick={() => setSelectedNodeId(node.id)}
          style={{ paddingLeft: `${level * 14 + 10}px` }}
          className={`group flex items-center justify-between py-2 px-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
            isSelected
              ? 'bg-purple-600/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 shadow-xs'
              : 'text-[#585c5c] dark:text-[#a6adbb] hover:bg-[#eae1da]/60 dark:hover:bg-[#2b2d31]/60 hover:text-[#1f1b17] dark:hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {hasChildren ? (
              <button
                onClick={(e) => toggleExpand(node.id, e)}
                className="p-0.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 text-gray-500"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </button>
            ) : (
              <span className="w-3.5" />
            )}

            <span className="text-sm leading-none">{node.emoji || (hasChildren ? (isExpanded ? '📂' : '📁') : '📄')}</span>
            <span className="truncate">{node.title}</span>
          </div>
        </div>

        {/* Nested Child Nodes */}
        {hasChildren && isExpanded && (
          <div className="mt-0.5 space-y-0.5 border-l border-[#eae1da] dark:border-[#2b2d31] ml-4">
            {node.children!.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-[#eae1da] dark:border-[#2b2d31] bg-white dark:bg-[#141517] shadow-xl flex flex-col md:flex-row min-h-[680px]">
      
      {/* LEFT SIDEBAR: "Document Tabs" (GitBook / Notion Tree Outline) */}
      <div className="w-full md:w-72 lg:w-80 border-r border-[#eae1da] dark:border-[#2b2d31] bg-[#fbf7f4]/80 dark:bg-[#18191c]/80 flex flex-col shrink-0">
        
        {/* Sidebar Header */}
        <div className="p-4 border-b border-[#eae1da] dark:border-[#2b2d31] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-[#1f1b17] dark:text-white">
                  Document Tabs
                </h4>
                <p className="text-[10px] text-[#747878] dark:text-[#a6adbb]">
                  {flatNodes.length} Sections Available
                </p>
              </div>
            </div>
          </div>

          {/* Quick Filter Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#747878] dark:text-[#a6adbb]" />
            <input
              type="text"
              placeholder="Search topics & questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white dark:bg-[#202225] border border-[#eae1da] dark:border-[#383a40] text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
        </div>

        {/* Tree Node List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
          {tabs.length > 0 ? (
            tabs.map(node => renderTreeNode(node))
          ) : (
            <div className="p-6 text-center text-xs text-[#747878] dark:text-[#a6adbb] space-y-2">
              <FileText className="w-8 h-8 mx-auto opacity-40" />
              <p>No document sections available. Please link a Google Doc from Admin settings.</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT CONTENT CANVAS: Notion-style Reader / Paywall Teaser */}
      <div className="flex-1 flex flex-col relative min-h-[600px] overflow-hidden bg-white dark:bg-[#141517]">
        
        {!hasAccess ? (
          /* 🔒 PAYWALL LOCK COVER OVERLAY (Zero Document Content Leakage) */
          <div className="relative flex-1 flex flex-col items-center justify-center p-6 sm:p-12 text-center bg-[#f6ece6]/30 dark:bg-[#141517]/30">
            
            {/* Blurred Teaser Document Layout */}
            <div className="absolute inset-0 p-8 opacity-15 filter blur-xs pointer-events-none select-none overflow-hidden font-mono text-xs text-left space-y-4">
              <h2 className="text-xl font-bold text-[#1f1b17] dark:text-white">
                {companyName} – {examName} Official Papers
              </h2>
              <div className="h-0.5 bg-gray-400 w-full" />
              <p>Section 1: Quantitative Aptitude & Problem Solving</p>
              <p>Q1. A candidate scored 45% marks in an examination and failed by 15 marks...</p>
              <p>Q2. The ratio of speeds of two trains is 7:8. If the second train runs 400 km in 4 hours...</p>
              <p>Section 2: Advanced Coding & Algorithmic Problem Solving</p>
              <p>Write an optimal algorithm to find the longest palindromic substring in O(N) time...</p>
            </div>

            {/* Premium Lock Banner Card */}
            <div className="relative z-10 max-w-md w-full p-8 rounded-[28px] bg-[#ffffff]/95 dark:bg-[#1e1f22]/95 border border-[#eae1da] dark:border-[#383a40] shadow-2xl space-y-5 backdrop-blur-md">
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
                  Unlock access to all official placement papers for <strong>{companyName} – {examName}</strong>. Choose a single paper or get the Jobsfolder Pro All-Access Pass!
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
        ) : (
          /* 📄 AUTHORIZED NOTION / GITBOOK DOCUMENT READER */
          <div className="flex-1 flex flex-col relative overflow-y-auto custom-scrollbar p-6 sm:p-10 select-none">
            
            {/* Dynamic Anti-AI Watermark Matrix Overlay */}
            {watermarkText && (
              <div className="absolute inset-0 z-20 pointer-events-none select-none overflow-hidden flex flex-wrap content-around justify-around p-8 gap-20 font-mono text-xs font-black text-emerald-800 dark:text-emerald-300 opacity-10">
                {Array.from({ length: 24 }).map((_, i) => {
                  const angle = -38 - (i % 5) * 3;
                  const opacity = 0.08 + (i % 4) * 0.02;
                  return (
                    <div key={i} style={{ transform: `rotate(${angle}deg)`, opacity }} className="whitespace-nowrap tracking-widest uppercase">
                      {watermarkText}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Document Title Header */}
            {activeNode && (
              <div className="space-y-4 border-b border-[#eae1da] dark:border-[#2b2d31] pb-6 mb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{activeNode.emoji || '📄'}</span>
                    <div>
                      <h1 className="font-display text-2xl sm:text-3xl font-black text-[#1f1b17] dark:text-white">
                        {activeNode.title}
                      </h1>
                      <p className="text-xs text-[#747878] dark:text-[#a6adbb] mt-0.5">
                        {companyName} • {examName} Official Placement Series
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Document Content Canvas */}
            {activeNode ? (
              <div className="prose dark:prose-invert max-w-none text-[#1f1b17] dark:text-[#e3e3e3] text-sm leading-relaxed space-y-4">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                  {activeNode.content}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500 text-xs">Select a section from the Document Tabs on the left.</div>
            )}

            {/* Bottom Notion-Style Prev / Next Page Buttons */}
            {flatNodes.length > 1 && (
              <div className="mt-12 pt-6 border-t border-[#eae1da] dark:border-[#2b2d31] flex items-center justify-between gap-4">
                {prevNode ? (
                  <button
                    onClick={() => setSelectedNodeId(prevNode.id)}
                    className="flex items-center gap-2 p-3 rounded-2xl border border-[#eae1da] dark:border-[#2b2d31] hover:bg-[#f6ece6] dark:hover:bg-[#1e1f22] text-left group transition-all"
                  >
                    <span className="text-lg">←</span>
                    <div>
                      <span className="block text-[10px] text-[#747878] dark:text-[#a6adbb] uppercase tracking-wider">Previous Topic</span>
                      <span className="text-xs font-bold text-[#1f1b17] dark:text-white group-hover:text-purple-600">{prevNode.title}</span>
                    </div>
                  </button>
                ) : <div />}

                {nextNode && (
                  <button
                    onClick={() => setSelectedNodeId(nextNode.id)}
                    className="flex items-center gap-2 p-3 rounded-2xl border border-[#eae1da] dark:border-[#2b2d31] hover:bg-[#f6ece6] dark:hover:bg-[#1e1f22] text-right group transition-all ml-auto"
                  >
                    <div>
                      <span className="block text-[10px] text-[#747878] dark:text-[#a6adbb] uppercase tracking-wider">Next Topic</span>
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
