import React, { useState, useMemo } from 'react';
import {
  X,
  Upload,
  Check,
  Copy,
  AlertCircle,
  CheckCircle2,
  FileCode,
  FolderPlus,
  Eye,
  Layers,
  Sparkles,
  Lock,
  Unlock,
  Trash2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { DocTabNode } from '@/services/dataStore';
import ContentRenderer from '@/components/ContentRenderer';

export interface BulkImportPapersModalProps {
  isOpen: boolean;
  onClose: () => void;
  examName: string;
  companyName: string;
  currentTabs: DocTabNode[];
  onImport: (newTabs: DocTabNode[]) => void;
}

export interface ParsedPaperQuestion {
  title: string;
  emoji?: string;
  description: string;
  constraints?: string[];
  testCases?: Array<{ input: string; output: string; title?: string }>;
  isFree?: boolean;
}

const SAMPLE_BATCH_TEMPLATE = `================================================================================
# Q1. Rat Count House
================================================================================
Given two integers r and unit, and an array arr of size n. r represents the total number of rats and unit represents the amount of food each rat consumes. Each element of arr represents the amount of food present in that house.

Find the minimum number of houses required to satisfy the food requirements of all rats.
- Return -1 if the total food in all houses is less than the required food.
- Return 0 if the array is null or empty.

### Constraints
- 1 <= r, unit <= 100
- 0 <= n <= 1000
- 1 <= arr[i] <= 100

### Test Cases
Test Case 1
Input:
r = 7, unit = 2, n = 8
arr = [2, 8, 3, 5, 7, 4, 1, 2]
Output:
4

Test Case 2
Input:
r = 10, unit = 5, n = 3
arr = [10, 20, 15]
Output:
-1

================================================================================
# Q2. Binary String Operations
================================================================================
The binary string operation function takes a string str containing binary digits (0, 1) separated by alphabets:
- A represents Boolean AND
- B represents Boolean OR
- C represents Boolean XOR

Scan the string from left to right and evaluate the expression. Return -1 if the string is null or empty.

### Constraints
- 1 <= str.length <= 10^5
- The string starts and alternates with digits 0 or 1 and operators A, B, C.

### Test Cases
Test Case 1
Input:
1C0C1C1A0B1
Output:
1

Test Case 2
Input:
0C1A1B1C1C1B0A1
Output:
0`;

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function parseChatGPTToCases(text: string): Array<{ title: string; input: string; output: string }> {
  if (!text?.trim()) return [];
  const regex = /(?:Test\s*Case\s*(\d+)[:\s]*)([\s\S]*?)(?=(?:Test\s*Case\s*\d+|$))/gi;
  const matches = [...text.matchAll(regex)];
  if (matches.length === 0) {
    const inputMatch = text.match(/Input:?\s*([\s\S]*?)(?=Output:|$)/i);
    const outputMatch = text.match(/Output:?\s*([\s\S]*?)$/i);
    if (inputMatch || outputMatch) {
      return [{
        title: 'Test Case 1',
        input: inputMatch ? inputMatch[1].trim() : '',
        output: outputMatch ? outputMatch[1].trim() : '',
      }];
    }
    return [];
  }
  return matches.map((m, idx) => {
    const caseNum = m[1] || `${idx + 1}`;
    const content = m[2].trim();
    const inputMatch = content.match(/Input:?\s*([\s\S]*?)(?=Output:|$)/i);
    const outputMatch = content.match(/Output:?\s*([\s\S]*?)$/i);
    return {
      title: `Test Case ${caseNum}`,
      input: inputMatch ? inputMatch[1].trim() : '',
      output: outputMatch ? outputMatch[1].trim() : '',
    };
  });
}

export function parseBatchQuestions(rawText: string, accessMode: 'standard' | 'free' | 'paid'): ParsedPaperQuestion[] {
  const text = rawText.replace(/\r\n/g, '\n').trim();
  if (!text) return [];

  // 1. JSON Array Parse
  if (text.startsWith('[') || text.startsWith('{')) {
    try {
      const parsed = JSON.parse(text);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      return arr.map((item, idx) => {
        let isFree = false;
        if (accessMode === 'free') isFree = true;
        else if (accessMode === 'paid') isFree = false;
        else isFree = idx < 2; // standard

        return {
          title: item.title || `Question ${idx + 1}`,
          description: item.description || '',
          constraints: Array.isArray(item.constraints)
            ? item.constraints
            : (item.constraints ? [item.constraints] : []),
          testCases: Array.isArray(item.testCases) ? item.testCases : [],
          emoji: item.emoji || '⚡',
          isFree: item.isFree ?? isFree,
        };
      });
    } catch {}
  }

  // 2. Identify questions by heading regex:
  // Matches "# Q1. Title", "Q1. Title", "### Q1: Title", etc.
  const questionRegex = /(?:^|\n)(?:[=\-]{5,}\s*\n)?\s*(?:#{1,3}\s*)?(Q\d+[\.:\s][^\n\r]+)([\s\S]*?)(?=(?:\n\s*(?:[=\-]{5,}\s*\n)?\s*(?:#{1,3}\s*)?Q\d+[\.:\s])|$)/gi;
  const matches = [...text.matchAll(questionRegex)];

  if (matches.length > 0) {
    return matches.map((m, idx) => {
      const rawTitle = m[1].trim();
      const title = rawTitle.replace(/^#+\s*/, '').trim();
      const body = m[2].trim().replace(/^[=\-\s]+/, '');

      // Constraints
      let constraints: string[] = [];
      const constraintsMatch = body.match(/###?\s*Constraints\s*([\s\S]*?)(?=(?:###?\s*Test\s*Cases|$))/i);
      if (constraintsMatch) {
        constraints = constraintsMatch[1]
          .split('\n')
          .map(l => l.trim().replace(/^[-*•]\s*/, '').trim())
          .filter(Boolean);
      }

      // Test cases
      let testCases: Array<{ input: string; output: string; title?: string }> = [];
      const testCasesMatch = body.match(/###?\s*Test\s*Cases\s*([\s\S]*?)$/i);
      if (testCasesMatch) {
        testCases = parseChatGPTToCases(testCasesMatch[1]);
      }

      // Description
      const descPart = body
        .split(/###?\s*Constraints/i)[0]
        .split(/###?\s*Test\s*Cases/i)[0];
      const description = descPart.replace(/^[=\-\s]+/, '').trim();

      let isFree = false;
      if (accessMode === 'free') isFree = true;
      else if (accessMode === 'paid') isFree = false;
      else isFree = idx < 2;

      return {
        title,
        description,
        constraints,
        testCases,
        emoji: '⚡',
        isFree,
      };
    });
  }

  // Fallback: Split by delimiter lines (==== or ----)
  const chunks = text
    .split(/(?:\n[=\-]{10,}\n)/g)
    .map(c => c.trim())
    .filter(Boolean);

  if (chunks.length > 1) {
    return chunks.map((chunk, idx) => {
      const lines = chunk.split('\n').map(l => l.trim()).filter(Boolean);
      const title = lines[0]?.replace(/^#+\s*/, '') || `Question ${idx + 1}`;
      const desc = lines.slice(1).join('\n');
      return {
        title,
        description: desc,
        constraints: [],
        testCases: parseChatGPTToCases(chunk),
        emoji: '⚡',
        isFree: accessMode === 'free' ? true : (accessMode === 'paid' ? false : idx < 2),
      };
    });
  }

  return [];
}

export function formatQuestionContentToHtml(q: ParsedPaperQuestion): string {
  const caseCards = (q.testCases || []).map((c, idx) => `
    <div class="test-case-item" data-type="test-case">
      <div class="test-case-header">${c.title || `Test Case ${idx + 1}`}</div>
      <div class="test-case-io-grid">
        <div class="test-case-section">
          <span class="test-case-label">Input:</span>
          <pre class="test-case-code test-case-input-val">${escapeHtml(c.input)}</pre>
        </div>
        <div class="test-case-section">
          <span class="test-case-label">Output:</span>
          <pre class="test-case-code test-case-output-val">${escapeHtml(c.output)}</pre>
        </div>
      </div>
    </div>
  `).join('');

  const constraintsList = (q.constraints && q.constraints.length > 0)
    ? `
      <h3>Constraints</h3>
      <ul>
        ${q.constraints.map(c => `<li>${escapeHtml(c)}</li>`).join('')}
      </ul>
    `
    : '';

  const testCasesBox = (q.testCases && q.testCases.length > 0)
    ? `
      <div class="test-case-group" data-type="test-case-box" data-cases='${JSON.stringify(q.testCases).replace(/'/g, '&#39;')}'>
        <div class="test-case-group-title">🧪 Test Cases</div>
        ${caseCards}
      </div>
    `
    : '';

  const formattedDesc = escapeHtml(q.description)
    .replace(/\n\n+/g, '</p><p>')
    .replace(/\n/g, '<br>');

  return `
    <h1>${escapeHtml(q.title)}</h1>
    <p>${formattedDesc}</p>
    ${constraintsList}
    ${testCasesBox}
  `.trim();
}

export default function BulkImportPapersModal({
  isOpen,
  onClose,
  examName,
  companyName,
  currentTabs,
  onImport,
}: BulkImportPapersModalProps) {
  const [inputText, setInputText] = useState<string>('');
  const [accessMode, setAccessMode] = useState<'standard' | 'free' | 'paid'>('standard');
  const [destMode, setDestMode] = useState<'new-folder' | 'root' | 'existing-folder'>('new-folder');
  const [newFolderName, setNewFolderName] = useState<string>(`${companyName} Coding Round 2026`);
  const [selectedFolderId, setSelectedFolderId] = useState<string>('');
  const [copiedTemplate, setCopiedTemplate] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'input' | 'preview'>('input');
  const [expandedPreviewIndex, setExpandedPreviewIndex] = useState<number | null>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Filter available existing folder tabs (tabs with children or root tabs)
  const existingFolders = useMemo(() => {
    return currentTabs.filter(t => t.children && t.children.length > 0);
  }, [currentTabs]);

  // Real-time parsing
  const parsedQuestions = useMemo(() => {
    return parseBatchQuestions(inputText, accessMode);
  }, [inputText, accessMode]);

  if (!isOpen) return null;

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(SAMPLE_BATCH_TEMPLATE);
    setCopiedTemplate(true);
    if (!inputText.trim()) {
      setInputText(SAMPLE_BATCH_TEMPLATE);
    }
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  const handleExecuteImport = () => {
    if (parsedQuestions.length === 0) return;
    setIsSubmitting(true);

    try {
      // 1. Build DocTabNodes for each parsed question
      const questionNodes: DocTabNode[] = parsedQuestions.map((q, idx) => ({
        id: `q-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
        title: q.title,
        emoji: q.emoji || '⚡',
        content: formatQuestionContentToHtml(q),
        isFree: q.isFree,
      }));

      let updatedTabs: DocTabNode[] = [];

      if (destMode === 'new-folder') {
        const folderNode: DocTabNode = {
          id: `folder-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          title: newFolderName.trim() || `${companyName} Coding Series`,
          emoji: '📁',
          content: `### ${newFolderName.trim() || companyName}\n\nThis section contains ${questionNodes.length} verified interview questions asked during ${companyName} campus recruitment drives.`,
          isFree: accessMode === 'free',
          children: questionNodes,
        };
        updatedTabs = [...currentTabs, folderNode];
      } else if (destMode === 'existing-folder' && selectedFolderId) {
        updatedTabs = currentTabs.map(tab => {
          if (tab.id === selectedFolderId) {
            return {
              ...tab,
              children: [...(tab.children || []), ...questionNodes],
            };
          }
          return tab;
        });
      } else {
        // Root level
        updatedTabs = [...currentTabs, ...questionNodes];
      }

      onImport(updatedTabs);
      onClose();
    } catch (err: any) {
      alert('Failed to import questions: ' + (err.message || err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs animate-fadeIn font-sans">
      <div className="bg-white dark:bg-[#141414] rounded-2xl border border-[#E9ECEF] dark:border-[#242424] shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-scaleIn">
        
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-5 border-b border-[#E9ECEF] dark:border-[#242424] flex items-start justify-between gap-4 bg-[#F8F9FA]/50 dark:bg-[#0C0C0C]/50">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 text-[10px] font-display font-extrabold uppercase tracking-wider border border-purple-500/20">
              <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              <span>Bulk Questions Importer</span>
            </div>
            <h2 className="font-display font-extrabold text-lg sm:text-xl text-[#121417] dark:text-white">
              Bulk Import Coding Questions — {companyName}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Paste batches of 10–50 questions from chat or ChatGPT. Automatically extracts titles, constraints, and side-by-side test case cards.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[#868E96] hover:text-[#121417] dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TOP CONFIGURATION STRIP */}
        <div className="p-3 sm:px-5 sm:py-3.5 bg-[#F8F9FA] dark:bg-[#1A1A1A] border-b border-[#E9ECEF] dark:border-[#2E2E2E] flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Target Placement */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-[#121417] dark:text-white shrink-0">Placement:</span>
            <select
              value={destMode}
              onChange={e => setDestMode(e.target.value as any)}
              className="bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#2E2E2E] rounded-md px-2.5 py-1 text-xs font-semibold text-[#121417] dark:text-white focus:outline-none cursor-pointer"
            >
              <option value="new-folder">📁 Create New Folder for Batch</option>
              {existingFolders.length > 0 && (
                <option value="existing-folder">📂 Add to Existing Folder</option>
              )}
              <option value="root">📄 Add Directly to Root Tree</option>
            </select>

            {destMode === 'new-folder' && (
              <input
                type="text"
                value={newFolderName}
                onChange={e => setNewFolderName(e.target.value)}
                placeholder="Folder title..."
                className="bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#2E2E2E] rounded-md px-2.5 py-1 text-xs text-[#121417] dark:text-white focus:outline-none w-48 sm:w-60 font-semibold"
              />
            )}

            {destMode === 'existing-folder' && existingFolders.length > 0 && (
              <select
                value={selectedFolderId || existingFolders[0]?.id}
                onChange={e => setSelectedFolderId(e.target.value)}
                className="bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#2E2E2E] rounded-md px-2.5 py-1 text-xs text-[#121417] dark:text-white focus:outline-none cursor-pointer"
              >
                {existingFolders.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.emoji || '📁'} {f.title} ({f.children?.length || 0} items)
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Access Policy Selector */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#121417] dark:text-white shrink-0">Access:</span>
            <select
              value={accessMode}
              onChange={e => setAccessMode(e.target.value as any)}
              className="bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#2E2E2E] rounded-md px-2.5 py-1 text-xs font-semibold text-[#121417] dark:text-white focus:outline-none cursor-pointer"
            >
              <option value="standard">⚡ First 2 Free, rest Paid (Standard)</option>
              <option value="paid">🔒 All Paid (Locked behind Paywall)</option>
              <option value="free">🔓 All Free (Public Access)</option>
            </select>
          </div>
        </div>

        {/* TABS NAVIGATION & QUICK ACTIONS */}
        <div className="flex items-center justify-between px-4 sm:px-5 pt-3 border-b border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('input')}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'input'
                  ? 'border-[#FD4A32] text-[#FD4A32]'
                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Input Paste ({parsedQuestions.length} detected)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              disabled={parsedQuestions.length === 0}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed ${
                activeTab === 'preview'
                  ? 'border-[#FD4A32] text-[#FD4A32]'
                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Visual Preview</span>
              {parsedQuestions.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                  {parsedQuestions.length}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 pb-2">
            <button
              type="button"
              onClick={handleCopyTemplate}
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-md hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors cursor-pointer"
            >
              {copiedTemplate ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              <span>{copiedTemplate ? 'Template Copied!' : 'Copy Sample Template'}</span>
            </button>
            {inputText && (
              <button
                type="button"
                onClick={() => setInputText('')}
                className="p-1 text-gray-400 hover:text-rose-500 transition-colors cursor-pointer"
                title="Clear input"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 custom-scrollbar bg-white dark:bg-[#141414]">
          {activeTab === 'input' ? (
            <div className="space-y-3 h-full flex flex-col">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  Paste your full batch of questions below. Both <strong>Markdown Batch</strong> (with <code># Q1.</code>) and <strong>JSON array</strong> formats work automatically.
                </span>
                <span className="font-mono font-bold text-[11px] text-purple-600 dark:text-purple-400">
                  {inputText.split('\n').length} lines
                </span>
              </div>

              <textarea
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder={SAMPLE_BATCH_TEMPLATE}
                rows={16}
                className="w-full flex-1 min-h-[340px] p-3.5 font-mono text-xs leading-relaxed bg-[#F8F9FA] dark:bg-[#0C0C0C] text-[#121417] dark:text-[#E9ECEF] border border-[#E9ECEF] dark:border-[#242424] rounded-xl focus:outline-none focus:border-[#FD4A32] dark:focus:border-[#FD4A32] custom-scrollbar select-text"
              />

              {/* Status pill */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E9ECEF] dark:border-[#2E2E2E] text-xs">
                {parsedQuestions.length > 0 ? (
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Successfully detected {parsedQuestions.length} coding question(s)! Click "Live Visual Preview" to verify.</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-gray-500">
                    <AlertCircle className="w-4 h-4" />
                    <span>Paste text containing questions (e.g. # Q1. Title, Constraints, Test Cases).</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-gray-500 pb-2 border-b border-[#E9ECEF] dark:border-[#242424]">
                <span>Reviewing {parsedQuestions.length} parsed question(s) before importing:</span>
                <button
                  type="button"
                  onClick={() => setExpandedPreviewIndex(expandedPreviewIndex !== null ? null : 0)}
                  className="text-purple-600 dark:text-purple-400 font-bold hover:underline"
                >
                  {expandedPreviewIndex !== null ? 'Collapse Renderers' : 'Expand First Question'}
                </button>
              </div>

              {parsedQuestions.map((q, idx) => {
                const isExpanded = expandedPreviewIndex === idx;
                const htmlPreview = formatQuestionContentToHtml(q);

                return (
                  <div
                    key={idx}
                    className="border border-[#E9ECEF] dark:border-[#242424] rounded-xl overflow-hidden bg-[#F8F9FA] dark:bg-[#0C0C0C] transition-all"
                  >
                    {/* Item Header */}
                    <div
                      onClick={() => setExpandedPreviewIndex(isExpanded ? null : idx)}
                      className="p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-base">{q.emoji || '⚡'}</span>
                        <div className="truncate">
                          <h4 className="font-bold text-xs sm:text-sm text-[#121417] dark:text-white truncate">
                            {q.title}
                          </h4>
                          <div className="flex items-center gap-3 text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                            <span>{q.constraints?.length || 0} Constraints</span>
                            <span>•</span>
                            <span className="text-purple-600 dark:text-purple-400 font-bold">
                              {q.testCases?.length || 0} Side-by-Side Test Cases
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {q.isFree ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">
                            <Unlock className="w-2.5 h-2.5" /> Free
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 text-[10px] font-bold">
                            <Lock className="w-2.5 h-2.5" /> Paid
                          </span>
                        )}
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                      </div>
                    </div>

                    {/* Expandable Rendered Question Preview */}
                    {isExpanded && (
                      <div className="p-4 sm:p-6 border-t border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] animate-fadeIn">
                        <div className="text-[10px] uppercase font-bold text-gray-400 mb-3 tracking-wider">
                          Live Rendered Document View:
                        </div>
                        <ContentRenderer content={htmlPreview} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 sm:p-5 border-t border-[#E9ECEF] dark:border-[#242424] flex items-center justify-between gap-3 bg-[#F8F9FA]/50 dark:bg-[#0C0C0C]/50">
          <div className="text-xs text-gray-500">
            {parsedQuestions.length > 0 ? (
              <span>
                Ready to import <strong>{parsedQuestions.length}</strong> question(s) into{' '}
                <span className="text-purple-600 dark:text-purple-400 font-bold">
                  {destMode === 'new-folder'
                    ? `folder "${newFolderName || 'New Folder'}"`
                    : destMode === 'existing-folder'
                    ? 'selected folder'
                    : 'document root'}
                </span>.
              </span>
            ) : (
              <span>Paste questions or copy the sample template to start.</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleExecuteImport}
              disabled={parsedQuestions.length === 0 || isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-display font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>{isSubmitting ? 'Importing...' : `Import ${parsedQuestions.length} Questions`}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
