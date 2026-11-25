/**
 * Active Mock Exam Browser & Anti-AI Extension Shield
 *
 * Strictly scoped to active mock exam sessions (`MockExamTestPage` while `testPhase === 'IN_PROGRESS'`).
 * Never loaded or activated on practice pages, study hubs, or post-exam answer reviews.
 */

export interface ForeignElementInput {
  tagName?: string;
  id?: string;
  className?: string;
  src?: string;
  href?: string;
  attributes?: Record<string, string>;
  hasShadowRoot?: boolean;
  isInsideAppRoot?: boolean;
  isFixedOverlay?: boolean;
  zIndex?: number;
  hasInteractiveChild?: boolean;
}

export interface ForeignElementClassification {
  isForeign: boolean;
  isAiTool: boolean;
  isPassiveHelper: boolean;
  reason: string;
}

export interface ShortcutCheckInput {
  key?: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
}

export interface ShortcutEvaluation {
  blocked: boolean;
  severity: 'STRIKE' | 'WARN' | 'NONE';
  reason: string;
}

const EXTENSION_URI_RE = /^(?:chrome-extension|moz-extension|safari-extension|ms-browser-extension|edge-extension):\/\//i;

const AI_SOLVER_SIGNATURES = [
  'quizmate',
  'examgpt',
  'questionai',
  'question-ai',
  'gauth',
  'studyx',
  'sider-ai',
  'sider_ai',
  'sider-chat',
  'monica-ai',
  'monica_ai',
  'monica-chat',
  'harpa',
  'merlin-ai',
  'merlin_ai',
  'maxai',
  'liner-ai',
  'caktus',
  'chegg',
  'brainly',
  'coursehero',
  'blackbox-ai',
  'chatgpt-sidebar',
  'perplexity-ext',
  'plasmo-csui',
  'ai-solver',
  'answer-ai',
];

const PASSIVE_HELPER_SIGNATURES = [
  'grammarly',
  'goog-gt-',
  'google-translate',
  'lt-highlighter',
  'lastpass',
  '1password',
  'bitwarden',
  'dashlane',
  'darkreader',
];

const SAFE_APP_TAG_NAMES = new Set(['SCRIPT', 'STYLE', 'LINK', 'META', 'NOSCRIPT', 'TITLE']);

function extractMetadataFromDom(el: Element): ForeignElementInput {
  const tagName = (el.tagName || '').toUpperCase();
  const id = typeof el.id === 'string' ? el.id : '';
  const className =
    typeof el.className === 'string'
      ? el.className
      : (el.getAttribute('class') || '');
  const src = el.getAttribute('src') || '';
  const href = el.getAttribute('href') || '';
  const attrs: Record<string, string> = {};
  for (let i = 0; i < el.attributes.length; i++) {
    const a = el.attributes[i];
    attrs[a.name] = a.value;
  }

  const rootEl = typeof document !== 'undefined' ? document.getElementById('root') : null;
  const isInsideAppRoot = Boolean(rootEl && (rootEl === el || rootEl.contains(el)));

  let isFixedOverlay = false;
  let zIndex = 0;
  if (typeof window !== 'undefined' && el instanceof HTMLElement && tagName !== 'SCRIPT' && tagName !== 'STYLE' && tagName !== 'LINK') {
    try {
      const style = window.getComputedStyle(el);
      isFixedOverlay = style.position === 'fixed';
      const parsedZ = Number.parseInt(style.zIndex || '0', 10);
      zIndex = Number.isFinite(parsedZ) ? parsedZ : 0;
    } catch {}
  }

  const hasInteractiveChild = Boolean(
    el.querySelector?.('iframe, textarea, input, shadow-root, plasmo-csui') ||
      tagName === 'IFRAME' ||
      tagName === 'TEXTAREA'
  );

  return {
    tagName,
    id,
    className,
    src,
    href,
    attributes: attrs,
    hasShadowRoot: Boolean((el as any).shadowRoot),
    isInsideAppRoot,
    isFixedOverlay,
    zIndex,
    hasInteractiveChild,
  };
}

/**
 * Classifies a DOM element (or metadata snapshot) to identify injected AI tools/extensions
 * while avoiding false positives on legitimate app UI, Monaco editor helpers, or passive extensions.
 */
export function classifyForeignElement(input: Element | ForeignElementInput): ForeignElementClassification {
  const meta: ForeignElementInput =
    typeof Element !== 'undefined' && input instanceof Element
      ? extractMetadataFromDom(input)
      : (input as ForeignElementInput);

  const tagName = (meta.tagName || '').toUpperCase();
  const id = (meta.id || '').toLowerCase();
  const className = (meta.className || '').toLowerCase();
  const src = meta.src || '';
  const href = meta.href || '';
  const attrPairs = Object.entries(meta.attributes || {})
    .map(([k, v]) => `${k.toLowerCase()}=${String(v).toLowerCase()}`)
    .join(' ');
  const combined = `${tagName.toLowerCase()} ${id} ${className} ${src.toLowerCase()} ${href.toLowerCase()} ${attrPairs}`;

  // 1. Explicitly protect Prepunite's root, exam shell, and Monaco runtime helpers
  if (id === 'root' || id === 'prepunite-exam-root' || id === 'prepunite-exam-dom-shield') {
    return { isForeign: false, isAiTool: false, isPassiveHelper: false, reason: 'App container' };
  }

  if (
    className.includes('monaco') ||
    className.includes('codicon') ||
    id.includes('monaco')
  ) {
    return { isForeign: false, isAiTool: false, isPassiveHelper: false, reason: 'Monaco helper' };
  }

  // 2. Any injected extension resource URI is always a high-confidence extension artifact
  if (EXTENSION_URI_RE.test(src) || EXTENSION_URI_RE.test(href)) {
    return {
      isForeign: true,
      isAiTool: true,
      isPassiveHelper: false,
      reason: `Extension resource injection detected (${(src || href).slice(0, 60)})`,
    };
  }

  // 3. Explicit AI / homework solver / Plasmo CSUI signatures anywhere in DOM
  for (const sig of AI_SOLVER_SIGNATURES) {
    if (combined.includes(sig)) {
      return {
        isForeign: true,
        isAiTool: true,
        isPassiveHelper: false,
        reason: `Unauthorized AI / homework extension overlay detected (${sig})`,
      };
    }
  }

  // 4. Passive spellcheck / password / translator helpers: suppress quietly without failing candidate
  for (const sig of PASSIVE_HELPER_SIGNATURES) {
    if (combined.includes(sig)) {
      return {
        isForeign: true,
        isAiTool: false,
        isPassiveHelper: true,
        reason: `Passive browser helper suppressed (${sig})`,
      };
    }
  }

  if (meta.isInsideAppRoot || SAFE_APP_TAG_NAMES.has(tagName)) {
    return { isForeign: false, isAiTool: false, isPassiveHelper: false, reason: 'Safe app node' };
  }

  // 5. Foreign element injected directly outside #root during an active exam
  const hasExtensionAttr = Object.keys(meta.attributes || {}).some(k => {
    const lk = k.toLowerCase();
    return lk.startsWith('data-plasmo') || lk.startsWith('data-extension') || lk.includes('quizmate');
  });

  if (
    hasExtensionAttr ||
    meta.hasShadowRoot ||
    tagName.includes('-') ||
    (meta.isFixedOverlay && (meta.zIndex || 0) >= 9000 && meta.hasInteractiveChild)
  ) {
    return {
      isForeign: true,
      isAiTool: true,
      isPassiveHelper: false,
      reason: `Foreign interactive overlay injected outside exam shell (<${tagName.toLowerCase()}>)`,
    };
  }

  return { isForeign: false, isAiTool: false, isPassiveHelper: false, reason: 'Unclassified' };
}

/**
 * Neutralizes a foreign light-DOM element injected outside Prepunite's `#root`.
 */
export function neutralizeForeignElement(el: Element, removeNode: boolean): void {
  try {
    if (el instanceof HTMLElement) {
      el.style.setProperty('display', 'none', 'important');
      el.style.setProperty('visibility', 'hidden', 'important');
      el.style.setProperty('opacity', '0', 'important');
      el.style.setProperty('pointer-events', 'none', 'important');
      el.style.setProperty('width', '0px', 'important');
      el.style.setProperty('height', '0px', 'important');
      el.setAttribute('aria-hidden', 'true');
    }
    if (removeNode && el.parentNode) {
      const rootEl = typeof document !== 'undefined' ? document.getElementById('root') : null;
      if (!rootEl || (el !== rootEl && !rootEl.contains(el))) {
        el.parentNode.removeChild(el);
      }
    }
  } catch {}
}

/**
 * Checks if an event target is an authorized interactive editor inside `#prepunite-exam-root`
 * (preventing clipboard exemptions from accidentally applying to injected AI extension chat boxes).
 */
export function isWithinAuthorizedExamEditor(target: EventTarget | null): boolean {
  if (typeof Node === 'undefined' || !(target instanceof Node)) return false;
  const el = target instanceof Element ? target : target.parentElement;
  if (!el) return false;

  const examRoot = document.getElementById('prepunite-exam-root');
  if (!examRoot || !examRoot.contains(el)) {
    return false;
  }

  return Boolean(
    el.closest('.monaco-editor') ||
      el.tagName === 'TEXTAREA' ||
      el.tagName === 'INPUT'
  );
}

/**
 * Evaluates keyboard shortcuts during an active mock exam.
 */
export function evaluateExamKeyDown(
  e: ShortcutCheckInput,
  isInsideCodingEditor: boolean
): ShortcutEvaluation {
  const isCtrlOrCmd = Boolean(e.ctrlKey || e.metaKey);
  const isShift = Boolean(e.shiftKey);
  const rawKey = e.key || '';
  const key = rawKey.toUpperCase();

  // Screenshot / Capture shortcuts
  if (
    key === 'PRINTSCREEN' ||
    rawKey === 'PrintScreen' ||
    (isCtrlOrCmd && isShift && (key === 'S' || key === '3' || key === '4'))
  ) {
    return {
      blocked: true,
      severity: 'STRIKE',
      reason: 'Screenshot / Screen Capture attempt detected',
    };
  }

  // DevTools shortcuts
  if (key === 'F12') {
    return {
      blocked: true,
      severity: 'STRIKE',
      reason: 'F12 (Developer Tools) shortcut is blocked',
    };
  }

  if (
    isCtrlOrCmd &&
    isShift &&
    (key === 'I' || key === 'J' || key === 'C' || key === 'K' || key === 'E' || key === 'M')
  ) {
    return {
      blocked: true,
      severity: 'STRIKE',
      reason: `DevTools shortcut (Ctrl+Shift+${key}) is blocked`,
    };
  }

  if (isCtrlOrCmd && key === 'U') {
    return {
      blocked: true,
      severity: 'STRIKE',
      reason: 'View Page Source (Ctrl+U) is blocked',
    };
  }

  // Dedicated keyboard context-menu key
  if (rawKey === 'ContextMenu') {
    return {
      blocked: true,
      severity: 'WARN',
      reason: 'Context menu key is disabled during mock exams.',
    };
  }

  // Page print / PDF capture / Save page
  if (isCtrlOrCmd && key === 'P') {
    return {
      blocked: true,
      severity: 'WARN',
      reason: 'Printing or saving as PDF is disabled during mock exams.',
    };
  }

  if (isCtrlOrCmd && key === 'S') {
    return {
      blocked: true,
      severity: 'WARN',
      reason: 'Saving the assessment page is disabled during mock exams.',
    };
  }

  // Select All / Copy / Cut / Paste outside authorized coding editor
  if (!isInsideCodingEditor && isCtrlOrCmd && key === 'A') {
    return {
      blocked: true,
      severity: 'WARN',
      reason: 'Selecting question text is disabled during mock exams.',
    };
  }

  if (!isInsideCodingEditor && isCtrlOrCmd && (key === 'C' || key === 'X')) {
    return {
      blocked: true,
      severity: 'WARN',
      reason: 'Copying or cutting question content is prohibited.',
    };
  }

  if (!isInsideCodingEditor && isCtrlOrCmd && key === 'V') {
    return {
      blocked: true,
      severity: 'WARN',
      reason: 'Pasting external content into the exam is prohibited.',
    };
  }

  return { blocked: false, severity: 'NONE', reason: '' };
}

export const EXAM_AI_SCANNER_SELECTOR = [
  'plasmo-csui',
  'grammarly-desktop-integration',
  'lt-highlighter',
  '[id*="quizmate" i]',
  '[class*="quizmate" i]',
  '[id*="examgpt" i]',
  '[id*="monica-" i]',
  '[id*="sider-" i]',
  '[id*="harpa-" i]',
  '[id*="merlin-" i]',
  '[id*="maxai" i]',
  '[data-plasmo-styles-target]',
  'iframe[src^="chrome-extension://"]',
  'iframe[src^="moz-extension://"]',
  'iframe[src^="safari-extension://"]',
  'script[src^="chrome-extension://"]',
  'link[href^="chrome-extension://"]',
].join(', ');

export const EXAM_DOM_SHIELD_CSS = `
  plasmo-csui,
  grammarly-desktop-integration,
  lt-highlighter,
  body > [id*="quizmate" i],
  body > [class*="quizmate" i],
  body > [id*="examgpt" i],
  body > [id*="sider-" i],
  body > [id*="monica-" i],
  body > [id*="harpa-" i],
  body > [id*="merlin-" i],
  body > [id*="maxai" i],
  iframe[src^="chrome-extension://"],
  iframe[src^="moz-extension://"],
  iframe[src^="safari-extension://"] {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    pointer-events: none !important;
    width: 0 !important;
    height: 0 !important;
  }

  #prepunite-exam-root,
  #prepunite-exam-root * {
    -webkit-user-select: none !important;
    -moz-user-select: none !important;
    user-select: none !important;
    -webkit-touch-callout: none !important;
  }

  #prepunite-exam-root .monaco-editor,
  #prepunite-exam-root .monaco-editor *,
  #prepunite-exam-root input,
  #prepunite-exam-root textarea {
    -webkit-user-select: text !important;
    -moz-user-select: text !important;
    user-select: text !important;
  }

  #prepunite-exam-root img,
  #prepunite-exam-root svg {
    -webkit-user-drag: none !important;
    user-drag: none !important;
  }
`;
