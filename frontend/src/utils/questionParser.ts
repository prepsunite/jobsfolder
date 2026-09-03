import { resolveTopicSlug } from '@/services/topicMap';
import type {
  TopicQuestionItem,
  QuestionOption,
  StructuredExplanation,
  QuestionStatus,
  AiMetadata,
} from '@/services/dataStore';

/**
 * Unicode Subscript Mapping for Math & Scientific expressions.
 */
const SUBSCRIPT_MAP: Record<string, string> = {
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
  '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
  '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎',
  'a': 'ₐ', 'e': 'ₑ', 'h': 'ₕ', 'i': 'ᵢ', 'j': 'ⱼ',
  'k': 'ₖ', 'l': 'ₗ', 'm': 'ₘ', 'n': 'ₙ', 'o': 'ₒ',
  'p': 'ₚ', 'r': 'ᵣ', 's': 'ₛ', 't': 'ₜ', 'u': 'ᵤ',
  'v': 'ᵥ', 'x': 'ₓ',
};

/**
 * Unicode Superscript Mapping for Powers & Exponents.
 */
const SUPERSCRIPT_MAP: Record<string, string> = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
  '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾',
  'a': 'ᵃ', 'b': 'ᵇ', 'c': 'ᶜ', 'd': 'ᵈ', 'e': 'ᵉ',
  'f': 'ᶠ', 'g': 'ᵍ', 'h': 'ʰ', 'i': 'ⁱ', 'j': 'ʲ',
  'k': 'ᵏ', 'l': 'ˡ', 'm': 'ᵐ', 'n': 'ⁿ', 'o': 'ᵒ',
  'p': 'ᵖ', 'r': 'ʳ', 's': 'ˢ', 't': 'ᵗ', 'u': 'ᵘ',
  'v': 'ᵛ', 'w': 'ʷ', 'x': 'ˣ', 'y': 'ʸ', 'z': 'ᶻ',
};

export function toSubscript(str: string): string {
  if (!str) return '';
  return str
    .split('')
    .map((c) => SUBSCRIPT_MAP[c] || SUBSCRIPT_MAP[c.toLowerCase()] || c)
    .join('');
}

export function toSuperscript(str: string): string {
  if (!str) return '';
  return str
    .split('')
    .map((c) => SUPERSCRIPT_MAP[c] || SUPERSCRIPT_MAP[c.toLowerCase()] || c)
    .join('');
}

/**
 * Universal Mathematical Normalizer
 * Converts LaTeX/HTML/Markdown math notation into clean Unicode mathematical symbols:
 * - log_2(x) / log_{16}(x) / \log_2(x) / log<sub>2</sub>(x) -> log₂(x) / log₁₆(x)
 * - x^2 / x^{m+n} / x<sup>2</sup> -> x² / xᵐ⁺ⁿ
 * - \sqrt{x} / sqrt(x) -> √(x)
 * - \theta, \pi, \pm, \le, \ge, \ne, \times, \div -> θ, π, ±, ≤, ≥, ≠, ×, ÷
 */
function normalizeMathTextRaw(text: string): string {
  let res = text;

  // 1. Convert HTML <sub>...</sub> and <sup>...</sup>
  res = res.replace(/<sub>(.*?)<\/sub>/gi, (_, match) => toSubscript(match));
  res = res.replace(/<sup>(.*?)<\/sup>/gi, (_, match) => toSuperscript(match));

  // 2. Convert Logarithms: log_{16}(x), log_2(x), \log_{2}(x), \log_2(x)
  res = res.replace(/\\?log_\{([a-zA-Z0-9+\-_]+)\}/gi, (_, base) => `log${toSubscript(base)}`);
  res = res.replace(/\\?log_([a-zA-Z0-9]+)/gi, (_, base) => `log${toSubscript(base)}`);

  // 3. Convert general subscript variables: a_{n+1}, x_1, T_2
  res = res.replace(/([a-zA-Z])_\{([a-zA-Z0-9+\-_]+)\}/g, (_, varName, sub) => `${varName}${toSubscript(sub)}`);
  res = res.replace(/([a-zA-Z])_([0-9a-zA-Z])/g, (_, varName, sub) => `${varName}${toSubscript(sub)}`);

  // 4. Convert superscripts and exponents: x^{2}, 2^{n+1}, x^2, a^m
  res = res.replace(/\^\{([a-zA-Z0-9+\-_]+)\}/g, (_, exp) => toSuperscript(exp));
  res = res.replace(/\^([0-9a-zA-Z])/g, (_, exp) => toSuperscript(exp));

  // 5. Common LaTeX mathematical symbols & operations
  res = res.replace(/\\sqrt\{([^}]+)\}/g, '√($1)');
  res = res.replace(/\\sqrt\s*([a-zA-Z0-9]+)/g, '√$1');
  res = res.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1 / $2)');
  res = res.replace(/\\times/g, '×');
  res = res.replace(/\\div/g, '÷');
  res = res.replace(/\\pm/g, '±');
  res = res.replace(/\\le(q)?\b/g, '≤');
  res = res.replace(/\\ge(q)?\b/g, '≥');
  res = res.replace(/\\ne(q)?\b/g, '≠');
  res = res.replace(/\\approx/g, '≈');
  res = res.replace(/\\theta/gi, 'θ');
  res = res.replace(/\\pi/gi, 'π');
  res = res.replace(/\\alpha/gi, 'α');
  res = res.replace(/\\beta/gi, 'β');
  res = res.replace(/\\degree/g, '°');
  res = res.replace(/\\infty/g, '∞');

  return res;
}

export function normalizeMathText(text: string): string {
  if (!text || typeof text !== 'string') return text || '';

  // Preserve any SVG blocks untouched so SVG tags, attributes and styles are never corrupted
  if (text.includes('<svg') || text.includes('<SVG')) {
    const parts = text.split(/(<svg[\s\S]*?<\/svg>)/gi);
    return parts
      .map((part) => (part.toLowerCase().startsWith('<svg') ? part : normalizeMathTextRaw(part)))
      .join('');
  }

  return normalizeMathTextRaw(text);
}

/**
 * Sanitizes JSON strings before parsing to auto-escape raw LaTeX backslashes.
 * e.g. converts unescaped \log, \frac, \sqrt into \\log, \\frac, \\sqrt
 */
export function sanitizeJsonInput(rawJson: string): string {
  if (!rawJson) return '';
  let str = rawJson.trim();
  // Negative lookahead for valid JSON escape sequences: \", \\, \/, \b, \f, \n, \r, \t, \uXXXX
  str = str.replace(/\\(?!["\\/bfnrt]|u[0-9a-fA-F]{4})/g, '\\\\');
  return str;
}

/**
 * Safe JSON parser with auto-recovery for LaTeX backslash escapes.
 */
export function safeJsonParse<T = any>(input: string): T {
  try {
    return JSON.parse(input);
  } catch {
    const sanitized = sanitizeJsonInput(input);
    return JSON.parse(sanitized);
  }
}

/**
 * Fast deterministic SHA-256 equivalent hex hash generator.
 */
export function computeSha256Hex(str: string): string {
  let h1 = 0xdeadbeef ^ 0;
  let h2 = 0x41c6ce57 ^ 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const hex1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const hex2 = (h2 >>> 0).toString(16).padStart(8, '0');
  const hex3 = ((h1 ^ h2) >>> 0).toString(16).padStart(8, '0');
  const hex4 = ((h1 + h2) >>> 0).toString(16).padStart(8, '0');
  return (hex1 + hex2 + hex3 + hex4 + hex2 + hex1 + hex4 + hex3).toLowerCase();
}

/**
 * Pre-insert validation for topic question schemas.
 */
export function validateQuestionItem(parsed: Partial<TopicQuestionItem>): { isValid: boolean; reason?: string } {
  if (!parsed.statement || !parsed.statement.trim()) {
    return { isValid: false, reason: 'Question statement cannot be empty' };
  }
  if (!parsed.options || !Array.isArray(parsed.options) || parsed.options.length < 2) {
    return { isValid: false, reason: 'Question must have at least 2 options' };
  }
  const validOptionIds = parsed.options.map((o) => o.id || o.key);
  if (!parsed.correctAnswer || !validOptionIds.includes(parsed.correctAnswer)) {
    return { isValid: false, reason: `Correct option '${parsed.correctAnswer}' is invalid or out of range` };
  }
  return { isValid: true };
}

/**
 * Deterministic fingerprint generator for question deduplication.
 * Preserves Unicode subscripts/math symbols so unique math expressions are never marked as false duplicates.
 */
export function generateQuestionFingerprint(item: Partial<TopicQuestionItem>, raw?: any): string {
  // Deterministic Fingerprint from Normalized Math Statement Text:
  // Lowercases and normalizes spaces while preserving Unicode subscripts, superscripts, Greek & math symbols
  const rawStatement = item?.statement || raw?.question || raw?.statement || raw?.title || '';
  const normText = normalizeMathText(rawStatement)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');

  if (normText) {
    return computeSha256Hex(`STATEMENT:${normText}`);
  }

  const templateId = raw?.templateId || raw?.template_id || item?.templateId;
  const variables = raw?.variables || item?.variables;

  // Fixed-length hash of templateId + sorted variables
  if (templateId && variables && typeof variables === 'object') {
    const varPairs = Object.keys(variables)
      .sort()
      .map((k) => `${k}=${variables[k]}`)
      .join('&');
    const rawString = `${String(templateId).trim()}:${varPairs}`;
    return computeSha256Hex(rawString);
  }

  if (templateId) {
    return computeSha256Hex(`TMPL:${String(templateId).trim()}`);
  }

  return computeSha256Hex(`RAW:${Date.now()}-${Math.random()}`);
}

/**
 * Robust parser for raw JSON input representing a topic question item.
 */
export function parseTopicQuestionJsonItem(raw: any, defaultTopicId?: string): Partial<TopicQuestionItem> {
  const rawSubtopic = raw.subtopic || raw.subTopic || raw.topic || raw.topicId;
  const topicId = resolveTopicSlug(rawSubtopic, defaultTopicId);

  const rawStatement = raw.question || raw.statement || '';
  const statement = normalizeMathText(rawStatement);

  const keys = ['A', 'B', 'C', 'D', 'E', 'F'];
  let parsedOptions: QuestionOption[] = [];
  if (Array.isArray(raw.options)) {
    parsedOptions = raw.options.map((opt: any, idx: number) => {
      const optionId = (opt && typeof opt === 'object' && (opt.id || opt.key)) || keys[idx] || `${idx + 1}`;
      const optionText = typeof opt === 'string' ? opt : (opt?.text || String(opt));
      return {
        id: String(optionId).toUpperCase(),
        key: String(optionId).toUpperCase(),
        text: normalizeMathText(optionText),
      };
    });
  }

  let correctAnswer = 'A';
  if (typeof raw.correctOption === 'number') {
    correctAnswer = keys[raw.correctOption] || 'A';
  } else if (typeof raw.correctOption === 'string') {
    const num = parseInt(raw.correctOption, 10);
    if (!isNaN(num)) {
      correctAnswer = keys[num] || 'A';
    } else {
      correctAnswer = raw.correctOption.toUpperCase();
    }
  } else if (raw.correctAnswer) {
    correctAnswer = String(raw.correctAnswer).toUpperCase();
  }

  let difficultyLevel: 1 | 2 | 3 = 2;
  if (raw.difficultyLevel && [1, 2, 3].includes(Number(raw.difficultyLevel))) {
    difficultyLevel = Number(raw.difficultyLevel) as 1 | 2 | 3;
  } else if (raw.difficulty) {
    const d = String(raw.difficulty).toUpperCase();
    if (d === 'EASY' || d === '1') difficultyLevel = 1;
    else if (d === 'HARD' || d === '3') difficultyLevel = 3;
    else difficultyLevel = 2;
  }

  let explanationText: string | undefined = undefined;
  let structuredExplanation: StructuredExplanation | undefined = undefined;
  let formulasUsed: string[] = Array.isArray(raw.formulasUsed) 
    ? raw.formulasUsed.map((f: any) => normalizeMathText(String(f))) 
    : [];

  if (raw.explanation && typeof raw.explanation === 'object') {
    const rawSteps = raw.explanation.steps || [];
    const parsedSteps = Array.isArray(rawSteps)
      ? rawSteps.map((st: any) => {
          if (typeof st === 'string') return normalizeMathText(st);
          if (st && typeof st === 'object') {
            const val = st.text || st.content || st.formula || st.title || '';
            const title = st.title && st.title !== 'Step' ? `${st.title}: ` : '';
            return normalizeMathText(`${title}${val}`);
          }
          return normalizeMathText(String(st));
        })
      : [];

    structuredExplanation = {
      passage: raw.passage || raw.explanation.passage,
      passageTitle: raw.passageTitle || raw.explanation.passageTitle,
      given: Array.isArray(raw.explanation.given)
        ? raw.explanation.given.map((g: any) => normalizeMathText(String(g)))
        : (raw.explanation.given ? [normalizeMathText(String(raw.explanation.given))] : []),
      steps: parsedSteps,
      shortcut: raw.explanation.shortcut
        ? normalizeMathText(String(raw.explanation.shortcut))
        : (raw.explanation.shortCut ? normalizeMathText(String(raw.explanation.shortCut)) : undefined),
      formulaUsed: Array.isArray(raw.explanation.formulaUsed || raw.explanation.formulasUsed)
        ? (raw.explanation.formulaUsed || raw.explanation.formulasUsed).map((f: any) => normalizeMathText(String(f)))
        : [],
      finalAnswer: raw.explanation.finalAnswer ? normalizeMathText(String(raw.explanation.finalAnswer)) : '',
    };
    explanationText = undefined;
    if (raw.explanation.formulaUsed && Array.isArray(raw.explanation.formulaUsed)) {
      formulasUsed = [
        ...formulasUsed,
        ...raw.explanation.formulaUsed.map((f: any) => normalizeMathText(String(f))),
      ];
    }
  } else if (typeof raw.explanation === 'string') {
    explanationText = normalizeMathText(raw.explanation);
    if (raw.passage || raw.passageTitle) {
      structuredExplanation = { passage: raw.passage, passageTitle: raw.passageTitle };
    }
  } else if (raw.passage || raw.passageTitle) {
    structuredExplanation = { passage: raw.passage, passageTitle: raw.passageTitle };
  }

  const status: QuestionStatus = raw.status || (raw.isHidden ? 'draft' : 'published');
  const aiMetadata: AiMetadata = {
    generatedBy: raw.generatedBy || raw.aiMetadata?.generatedBy || 'chatgpt',
    reviewed: raw.reviewed ?? raw.aiMetadata?.reviewed ?? false,
  };

  const templateId = raw.templateId || raw.template_id;
  const variables = raw.variables;

  let resolvedTestCase: string | undefined = undefined;
  if (typeof raw.testCase === 'string' && raw.testCase.trim()) {
    resolvedTestCase = raw.testCase;
  } else if (typeof raw.testCases === 'string' && raw.testCases.trim()) {
    resolvedTestCase = raw.testCases;
  } else if (raw.sampleInput || raw.sampleOutput || raw.input || raw.output) {
    const inp = raw.sampleInput || raw.input || '';
    const out = raw.sampleOutput || raw.output || '';
    resolvedTestCase = `Input:\n${inp}\n\nOutput:\n${out}`.trim();
  }

  const parsedItem: Partial<TopicQuestionItem> = {
    version: 1,
    topicId,
    statement,
    options: parsedOptions,
    correctAnswer,
    explanation: explanationText,
    structuredExplanation,
    formulasUsed,
    difficultyLevel,
    difficulty: difficultyLevel === 1 ? 'EASY' : difficultyLevel === 3 ? 'HARD' : 'MEDIUM',
    status,
    isHidden: status === 'draft',
    aiMetadata,
    templateId,
    variables,
    testCase: resolvedTestCase,
    sampleInput: raw.sampleInput || raw.input,
    sampleOutput: raw.sampleOutput || raw.output,
    examples: typeof raw.examples === 'string' ? raw.examples : undefined,
  };

  parsedItem.fingerprint = generateQuestionFingerprint(parsedItem, raw);
  return parsedItem;
}

/**
 * Deterministic JSON stringifier that sorts object keys recursively.
 * Guarantees identical string output regardless of key insertion order.
 */
export function stableStringify(obj: any): string {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj);
  }
  if (Array.isArray(obj)) {
    return `[${obj.map(stableStringify).join(',')}]`;
  }
  const keys = Object.keys(obj).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`).join(',')}}`;
}
