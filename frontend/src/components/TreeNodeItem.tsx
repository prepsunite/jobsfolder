import React from 'react';
import type { DocTabNode } from '@/services/dataStore';
import { matchesSearch } from '@/utils/treeUtils';
import {
  ChevronRight,
  ChevronDown,
  Edit3,
  Trash2,
  ArrowUp,
  ArrowDown,
  FilePlus,
  FolderPlus,
  Check,
  X,
} from 'lucide-react';

interface TreeNodeItemProps {
  node: DocTabNode;
  level?: number;
  selectedNodeId: string;
  expandedIds: Record<string, boolean>;
  renamingId: string | null;
  renameValue: string;
  emojiValue: string;
  adminMode: boolean;
  isAdmin: boolean;
  searchQuery: string;
  onSelectNode: (id: string) => void;
  onToggleExpand: (id: string, e: React.MouseEvent) => void;
  onSetRenameValue: (val: string) => void;
  onSetEmojiValue: (val: string) => void;
  onCommitRename: (nodeId: string) => void;
  onCancelRename: () => void;
  onStartRename: (e: React.MouseEvent, node: DocTabNode) => void;
  onMoveUp: (e: React.MouseEvent, nodeId: string) => void;
  onMoveDown: (e: React.MouseEvent, nodeId: string) => void;
  onAddChild: (e: React.MouseEvent, nodeId: string) => void;
  onAddAfter: (e: React.MouseEvent, nodeId: string) => void;
  onDeleteNode: (e: React.MouseEvent, nodeId: string) => void;
  onToggleNodeAccess: (node: DocTabNode) => void;
}

export const TreeNodeItem: React.FC<TreeNodeItemProps> = ({
  node,
  level = 0,
  selectedNodeId,
  expandedIds,
  renamingId,
  renameValue,
  emojiValue,
  adminMode,
  isAdmin,
  searchQuery,
  onSelectNode,
  onToggleExpand,
  onSetRenameValue,
  onSetEmojiValue,
  onCommitRename,
  onCancelRename,
  onStartRename,
  onMoveUp,
  onMoveDown,
  onAddChild,
  onAddAfter,
  onDeleteNode,
  onToggleNodeAccess,
}) => {
  if (searchQuery && !matchesSearch(node, searchQuery)) return null;

  const hasChildren = !!node.children?.length;
  const isExpanded = !!expandedIds[node.id];
  const isSelected = selectedNodeId === node.id;
  const isRenaming = renamingId === node.id;

  return (
    <div className="select-none">
      <div
        onClick={() => onSelectNode(node.id)}
        style={{ paddingLeft: `${level * 14 + 8}px` }}
        className={`group flex items-center gap-1 py-1.5 px-2 rounded-md text-xs font-semibold cursor-pointer transition-all ${
          isSelected
            ? 'bg-purple-600/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 shadow-xs'
            : 'text-[#585c5c] dark:text-[#a6adbb] hover:bg-[#eae1da]/60 dark:hover:bg-[#2b2d31]/60 hover:text-[#1f1b17] dark:hover:text-white'
        }`}
      >
        {/* Expand toggle */}
        {hasChildren ? (
          <button
            onClick={(e) => onToggleExpand(node.id, e)}
            className="p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 flex-shrink-0"
          >
            {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>
        ) : (
          <span className="w-4 flex-shrink-0" />
        )}

        {/* Emoji */}
        {isRenaming ? (
          <input
            value={emojiValue}
            onChange={(e) => onSetEmojiValue(e.target.value)}
            onClick={(e) => e.stopPropagation()}
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
            onChange={(e) => onSetRenameValue(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onCommitRename(node.id);
              if (e.key === 'Escape') onCancelRename();
            }}
            className="flex-1 min-w-0 bg-white dark:bg-[#1e1f22] border border-purple-400 rounded px-1 py-0.5 text-xs focus:outline-none"
          />
        ) : (
          <div className="flex-1 min-w-0 flex items-center justify-between gap-1">
            <span className="truncate">{node.title}</span>
            {adminMode && isAdmin ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleNodeAccess(node);
                }}
                className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider flex-shrink-0 transition-transform active:scale-95 cursor-pointer ${
                  node.isFree === true
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                    : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/25'
                }`}
                title="Click to toggle between Free and Paid for this section"
              >
                {node.isFree === true ? 'FREE' : 'PAID'}
              </button>
            ) : node.isFree === true ? (
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 uppercase tracking-wider flex-shrink-0">
                FREE
              </span>
            ) : null}
          </div>
        )}

        {/* Admin action buttons */}
        {adminMode && isAdmin && (
          <div
            className="flex items-center gap-0.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            {isRenaming ? (
              <>
                <button
                  onClick={() => onCommitRename(node.id)}
                  className="p-0.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded"
                  title="Save name"
                >
                  <Check className="w-3 h-3" />
                </button>
                <button
                  onClick={onCancelRename}
                  className="p-0.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded"
                  title="Cancel"
                >
                  <X className="w-3 h-3" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={(e) => onStartRename(e, node)}
                  className="p-0.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
                  title="Rename"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => onMoveUp(e, node.id)}
                  className="p-0.5 text-[#868E96] hover:bg-[#E9ECEF] dark:hover:bg-[#242424] rounded"
                  title="Move up"
                >
                  <ArrowUp className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => onMoveDown(e, node.id)}
                  className="p-0.5 text-[#868E96] hover:bg-[#E9ECEF] dark:hover:bg-[#242424] rounded"
                  title="Move down"
                >
                  <ArrowDown className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => onAddChild(e, node.id)}
                  className="p-0.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded"
                  title="Add subtab inside"
                >
                  <FolderPlus className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => onAddAfter(e, node.id)}
                  className="p-0.5 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded"
                  title="Add file after"
                >
                  <FilePlus className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => onDeleteNode(e, node.id)}
                  className="p-0.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded"
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Children recursive rendering */}
      {hasChildren && isExpanded && (
        <div className="mt-0.5 space-y-0.5 border-l border-[#E9ECEF] dark:border-[#242424] ml-3.5">
          {node.children!.map((child) => (
            <TreeNodeItem
              key={child.id}
              node={child}
              level={level + 1}
              selectedNodeId={selectedNodeId}
              expandedIds={expandedIds}
              renamingId={renamingId}
              renameValue={renameValue}
              emojiValue={emojiValue}
              adminMode={adminMode}
              isAdmin={isAdmin}
              searchQuery={searchQuery}
              onSelectNode={onSelectNode}
              onToggleExpand={onToggleExpand}
              onSetRenameValue={onSetRenameValue}
              onSetEmojiValue={onSetEmojiValue}
              onCommitRename={onCommitRename}
              onCancelRename={onCancelRename}
              onStartRename={onStartRename}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
              onAddChild={onAddChild}
              onAddAfter={onAddAfter}
              onDeleteNode={onDeleteNode}
              onToggleNodeAccess={onToggleNodeAccess}
            />
          ))}
        </div>
      )}
    </div>
  );
};
