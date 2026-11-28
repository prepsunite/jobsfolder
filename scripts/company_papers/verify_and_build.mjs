import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { parsePaperQuestions, ensureFourTestCases } from '../../frontend/src/utils/paperQuestionParser.ts';

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function buildQuestionHtml(q) {
  const casesPayload = q.testCases.map((tc, idx) => ({
    title: tc.title || `Test Case ${idx + 1}`,
    input: tc.input,
    output: tc.output,
    ...(tc.explanation ? { explanation: tc.explanation } : {}),
  }));
  const casesJson = JSON.stringify(casesPayload).replace(/"/g, '&quot;');

  const diffTag = q.difficulty
    ? `<span class="sr-only" data-difficulty="${escapeHtml(q.difficulty)}">Difficulty: ${escapeHtml(q.difficulty)}</span>`
    : '';

  return `
<div class="question-block mb-10 pb-8 border-b border-[#E9ECEF] dark:border-[#242424] last:border-b-0">
  <div class="mb-2">
    <h2 class="text-lg sm:text-xl font-display font-extrabold text-[#121417] dark:text-white m-0">Q${q.number}. ${escapeHtml(q.title)}</h2>
    ${diffTag}
  </div>
  <div class="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed my-3 font-sans">
    <p>${q.description}</p>
  </div>
  <div class="my-3">
    <h3 class="text-xs font-bold text-[#FD4A32] uppercase tracking-wider mb-1.5">Constraints</h3>
    <ul class="list-disc pl-5 space-y-1 text-xs font-mono text-gray-700 dark:text-gray-300">
      ${q.constraints.map(c => `<li>${escapeHtml(c)}</li>`).join('\n      ')}
    </ul>
  </div>
  <div class="test-case-group" data-type="test-case-box" data-cases="${casesJson}">
  </div>
  <div class="solution-code-block my-4 p-4 rounded-lg bg-[#F8F9FA] dark:bg-[#1C1C1C] border border-[#E9ECEF] dark:border-[#2E2E2E]" data-language="java">
    <div class="text-xs font-bold text-[#FD4A32] uppercase tracking-wider mb-2">Verified Java Solution</div>
    <pre class="text-xs font-mono overflow-x-auto text-gray-800 dark:text-gray-200"><code>${escapeHtml(q.javaSolution)}</code></pre>
  </div>
  <div class="solution-code-block my-4 p-4 rounded-lg bg-[#F8F9FA] dark:bg-[#1C1C1C] border border-[#E9ECEF] dark:border-[#2E2E2E]" data-language="python">
    <div class="text-xs font-bold text-[#FD4A32] uppercase tracking-wider mb-2">Verified Python Solution</div>
    <pre class="text-xs font-mono overflow-x-auto text-gray-800 dark:text-gray-200"><code>${escapeHtml(q.pythonSolution)}</code></pre>
  </div>
</div>
`.trim();
}

/**
 * Verifies every question's pythonSolution against all 4 testCases by running Python,
 * AND verifies parser compatibility (parsePaperQuestions + ensureFourTestCases).
 */
export function verifyCompanyQuestions(companyName, questions) {
  const failures = [];

  // 1. Batch-verify all Python solutions in one Python subprocess for speed
  const pyPayload = questions.map(q => ({
    number: q.number,
    title: q.title,
    code: q.pythonSolution,
    fnName: q.fnName,
    testCases: q.testCases,
  }));

  const tmpPy = path.join(process.cwd(), 'scratch', `_verify_${companyName.replace(/[^a-z0-9]/gi, '_')}.py`);
  fs.mkdirSync(path.dirname(tmpPy), { recursive: true });
  const pyRunner = `
import json, sys, ast

data = json.loads(sys.stdin.read())
errors = []

def format_out(val):
    if isinstance(val, bool):
        return 'true' if val else 'false'
    if isinstance(val, (list, dict)):
        return json.dumps(val)
    return str(val)

for q in data:
    ns = {}
    try:
        exec(q['code'], ns)
    except Exception as e:
        errors.append(f"Q{q['number']} {q['title']}: compile error: {e}")
        continue
    fn = ns.get(q['fnName'])
    if not callable(fn):
        errors.append(f"Q{q['number']} {q['title']}: function '{q['fnName']}' not found")
        continue
    for idx, tc in enumerate(q['testCases']):
        try:
            env = {}
            # Parse assignments like "arr = [1, 2], k = 3" or multi-line "arr = [1, 2]\\nk = 3"
            expr = tc['input'].replace('true', 'True').replace('false', 'False').replace('null', 'None')
            # Split by newline or top-level comma? Execute as statements if newline, else try exec
            import re, inspect
            # Split top-level "ident =" assignments onto separate lines to avoid Python chained-assignment syntax
            expr = tc['input'].replace('true', 'True').replace('false', 'False').replace('null', 'None')
            if '=' in expr:
                expr = re.sub(r',\\s*(?=[a-zA-Z_][a-zA-Z0-9_]*\\s*=)', '\\n', expr)
                exec(expr, {}, env)
                sig = inspect.signature(fn)
                args = [env[p] for p in sig.parameters.keys()]
            else:
                args = list(ast.literal_eval(f"({expr},)"))
            res = fn(*args)
            actual = format_out(res)
            expected = str(tc['output']).strip()
            if actual != expected:
                errors.append(f"Q{q['number']} {q['title']} Case {idx+1}: expected '{expected}', got '{actual}'")
        except Exception as e:
            errors.append(f"Q{q['number']} {q['title']} Case {idx+1}: runtime error: {e}")

print(json.dumps(errors))
`;

  try {
    const out = execFileSync('python', ['-c', pyRunner], {
      input: JSON.stringify(pyPayload),
      encoding: 'utf8',
      maxBuffer: 20 * 1024 * 1024,
    });
    const pyErrors = JSON.parse(out.trim() || '[]');
    failures.push(...pyErrors);
  } catch (err) {
    failures.push(`Python runner failed for ${companyName}: ${err.message}`);
  }

  // 2. Verify HTML parsing & 4 distinct test cases
  const html = questions.map(buildQuestionHtml).join('\n\n');
  const parsed = parsePaperQuestions(html);
  if (parsed.length !== questions.length) {
    failures.push(`${companyName}: parsed ${parsed.length} questions, expected ${questions.length}`);
  }

  for (const pq of parsed) {
    const suite = ensureFourTestCases(pq.testCases, pq.cleanTitle);
    if (suite.length < 4) {
      failures.push(`${companyName} Q${pq.number} ${pq.cleanTitle}: only ${suite.length} test cases`);
    }
    const inputs = new Set(suite.map(c => (c.input || '').trim()));
    if (inputs.size < suite.length) {
      failures.push(`${companyName} Q${pq.number} ${pq.cleanTitle}: duplicate test case inputs`);
    }
    for (const c of suite) {
      if (!c.input || c.output === undefined || c.output === null || c.output === '') {
        failures.push(`${companyName} Q${pq.number} ${pq.cleanTitle}: empty input/output`);
      }
    }
  }

  return failures;
}

export function buildCompanyTabs(slug, companyName, round1Title, round2Title, questions) {
  const r1 = questions.slice(0, 15);
  const r2 = questions.slice(15);
  return [
    {
      id: `${slug}-round-1`,
      title: round1Title,
      isFree: true,
      content: r1.map(buildQuestionHtml).join('\n\n'),
      children: [],
    },
    {
      id: `${slug}-round-2`,
      title: round2Title,
      isFree: false,
      content: r2.map(buildQuestionHtml).join('\n\n'),
      children: [],
    },
  ];
}
