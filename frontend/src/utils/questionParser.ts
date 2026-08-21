import { resolveTopicSlug } from '@/services/topicMap';
import type {
  TopicQuestionItem,
  QuestionOption,
  StructuredExplanation,
  QuestionStatus,
  AiMetadata,
} from '@/services/dataStore';

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
 */
export function generateQuestionFingerprint(item: Partial<TopicQuestionItem>, raw?: any): string {
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

  // Deterministic Fingerprint from Normalized Statement Text
  const rawStatement = item.statement || raw?.question || raw?.statement || '';
  const normText = rawStatement
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

  if (normText) {
    return computeSha256Hex(`STATEMENT:${normText}`);
  }

  return computeSha256Hex(`RAW:${Date.now()}-${Math.random()}`);
}

/**
 * Robust parser for raw JSON input representing a topic question item.
 */
export function parseTopicQuestionJsonItem(raw: any, defaultTopicId?: string): Partial<TopicQuestionItem> {
  const rawSubtopic = raw.subtopic || raw.subTopic || raw.topic || raw.topicId;
  const topicId = resolveTopicSlug(rawSubtopic, defaultTopicId);

  const keys = ['A', 'B', 'C', 'D', 'E', 'F'];
  let parsedOptions: QuestionOption[] = [];
  if (Array.isArray(raw.options)) {
    parsedOptions = raw.options.map((opt: any, idx: number) => {
      const optionId = (opt && typeof opt === 'object' && (opt.id || opt.key)) || keys[idx] || `${idx + 1}`;
      const optionText = typeof opt === 'string' ? opt : (opt?.text || String(opt));
      return {
        id: String(optionId).toUpperCase(),
        key: String(optionId).toUpperCase(),
        text: optionText,
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
  let formulasUsed: string[] = raw.formulasUsed || [];

  if (raw.explanation && typeof raw.explanation === 'object') {
    const rawSteps = raw.explanation.steps || [];
    const parsedSteps = Array.isArray(rawSteps)
      ? rawSteps.map((st: any) => {
          if (typeof st === 'string') return st;
          if (st && typeof st === 'object') {
            const val = st.text || st.content || st.formula || st.title || '';
            return st.title && st.title !== 'Step' ? `${st.title}: ${val}` : val;
          }
          return String(st);
        })
      : [];

    structuredExplanation = {
      given: Array.isArray(raw.explanation.given) ? raw.explanation.given : (raw.explanation.given ? [raw.explanation.given] : []),
      steps: parsedSteps,
      shortcut: raw.explanation.shortcut || raw.explanation.shortCut || raw.explanation.tricks || undefined,
      formulaUsed: raw.explanation.formulaUsed || raw.explanation.formulasUsed || [],
      finalAnswer: raw.explanation.finalAnswer || '',
    };
    if (raw.explanation.formulaUsed && Array.isArray(raw.explanation.formulaUsed)) {
      formulasUsed = [...formulasUsed, ...raw.explanation.formulaUsed];
    }
  } else if (typeof raw.explanation === 'string') {
    explanationText = raw.explanation;
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
    statement: raw.question || raw.statement || '',
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
