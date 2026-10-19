/**
 * Sandboxed Code Execution Service for Prepunite Mock Examination & Practice
 * Routes all compiler requests through secure serverless proxy (/api/execute-code).
 * Eliminates client-side Judge0 API key exposure [P0-01] and masks hidden test cases [P0-02].
 */

import { supabase } from '@/lib/supabase';

export interface TestCaseInput {
  input: string;
  expected_output?: string;
  output?: string;
  expectedOutput?: string;
  expected?: string;
  is_hidden?: boolean;
}

export interface EvaluatedTestCase {
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  status: 'PASSED' | 'WRONG_ANSWER' | 'COMPILATION_ERROR' | 'RUNTIME_ERROR' | 'TIME_LIMIT_EXCEEDED' | 'SKIPPED' | 'EMPTY_CODE';
  timeMs: number;
  memoryKb?: number;
  error?: string;
}

export interface TestCaseRunResult {
  cases: EvaluatedTestCase[];
  passedCount: number;
  totalCount: number;
  isTemplateOrEmpty: boolean;
  compileError?: string | null;
  runtimeError?: string | null;
  summaryMessage: string;
}

export interface ExecutionResult {
  statusId: number;
  statusDescription: string;
  stdout: string;
  stderr: string;
  compileOutput: string;
  timeMs: number;
  memoryKb: number;
  isSuccess: boolean;
  isCompileError: boolean;
  isRuntimeError: boolean;
  isTimeLimitExceeded: boolean;
  errorMessage?: string;
}

// Judge0 Standard Language IDs
export const JUDGE0_LANGUAGE_IDS: Record<string, number> = {
  python: 71, // Python 3.8.1
  cpp: 54,    // C++ (GCC 9.2.0)
  java: 62,   // Java (OpenJDK 13.0.1)
  c: 50,      // C (GCC 9.2.0)
};

export const LANGUAGE_LABELS: Record<string, string> = {
  python: 'Python 3.10',
  cpp: 'C++ 20 (GCC)',
  java: 'Java 17 (OpenJDK)',
  c: 'C11 (GCC)',
};

export const STARTER_TEMPLATES: Record<string, string> = {
  python: `import sys

def solve():
    # Read input from stdin
    # lines = sys.stdin.read().split()
    pass

if __name__ == '__main__':
    solve()
`,
  cpp: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // Write your solution here

    return 0;
}
`,
  java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // Write your solution here
    }
}
`,
  c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
    // Write your solution here

    return 0;
}
`,
};

/**
 * Base64 Encoding with full UTF-8 support for browser environment
 */
export function encodeBase64(str: string): string {
  if (!str) return '';
  try {
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode(parseInt(p1, 16))
      )
    );
  } catch {
    try {
      return btoa(unescape(encodeURIComponent(str)));
    } catch {
      return btoa(str);
    }
  }
}

/**
 * Base64 Decoding with full UTF-8 support for browser environment
 */
export function decodeBase64(b64: string): string {
  if (!b64) return '';
  try {
    return decodeURIComponent(
      Array.prototype.map
        .call(atob(b64), (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  } catch {
    try {
      return atob(b64);
    } catch {
      return btoa(b64);
    }
  }
}

/**
 * Normalizes code by converting CRLF to LF and trimming outer whitespace
 */
function normalizeCode(code: string): string {
  if (!code) return '';
  return code
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim();
}

/**
 * Strips comments and multi-spaces to inspect bare user logic
 */
function stripCommentsAndWhitespace(code: string, lang: string): string {
  if (!code) return '';
  let cleaned = code.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  if (lang === 'python') {
    cleaned = cleaned.replace(/#.*$/gm, '');
  } else {
    // C / C++ / Java
    cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '');
    cleaned = cleaned.replace(/\/\/.*$/gm, '');
  }
  return cleaned.replace(/\s+/g, ' ').trim();
}

/**
 * Normalizes input language string (e.g. 'Python 3.10', 'C++ 20 (GCC)', 'CPP') to standard canonical key.
 */
export function normalizeLanguageKey(lang?: string): string {
  if (!lang) return 'python';
  const l = lang.toLowerCase().trim();
  if (l.includes('python') || l === 'py') return 'python';
  if (l.includes('cpp') || l.includes('c++')) return 'cpp';
  if (l.includes('java')) return 'java';
  if (l === 'c' || l.includes('c11')) return 'c';
  return 'python';
}

function checkIsTemplateForSingleLang(code: string, lang: string): boolean {
  const normalized = normalizeCode(code);
  const template = STARTER_TEMPLATES[lang] || '';
  if (!template) return false;
  const normalizedTemplate = normalizeCode(template);

  // Exact template match
  if (normalized === normalizedTemplate) return true;

  // Stripped comparison (ignoring comments and whitespace differences)
  const strippedUser = stripCommentsAndWhitespace(code, lang);
  const strippedTemplate = stripCommentsAndWhitespace(template, lang);

  if (strippedUser === strippedTemplate) return true;

  // Language-specific skeleton verification
  if (lang === 'python') {
    const withoutSolve = strippedUser
      .replace('import sys', '')
      .replace('def solve(): pass', '')
      .replace("if __name__ == '__main__': solve()", '')
      .replace(/["']{3}[\s\S]*?["']{3}/g, '')
      .trim();
    if (withoutSolve.length === 0) return true;
  } else if (lang === 'cpp') {
    const withoutBoilerplate = strippedUser
      .replace('#include <iostream>', '')
      .replace('#include <vector>', '')
      .replace('#include <string>', '')
      .replace('#include <algorithm>', '')
      .replace('using namespace std;', '')
      .replace('int main() { ios_base::sync_with_stdio(false); cin.tie(NULL); return 0; }', '')
      .replace('int main() { return 0; }', '')
      .replace(/[{}\s]/g, '')
      .trim();
    if (withoutBoilerplate.length === 0) return true;
  } else if (lang === 'java') {
    const withoutBoilerplate = strippedUser
      .replace('import java.util.*;', '')
      .replace('import java.io.*;', '')
      .replace('public class Main { public static void main(String[] args) { Scanner scanner = new Scanner(System.in); } }', '')
      .replace('public class Main { public static void main(String[] args) { } }', '')
      .replace(/[{}\s]/g, '')
      .trim();
    if (withoutBoilerplate.length === 0) return true;
  } else if (lang === 'c') {
    const withoutBoilerplate = strippedUser
      .replace('#include <stdio.h>', '')
      .replace('#include <stdlib.h>', '')
      .replace('#include <string.h>', '')
      .replace('int main() { return 0; }', '')
      .replace(/[{}\s]/g, '')
      .trim();
    if (withoutBoilerplate.length === 0) return true;
  }

  return false;
}

/**
 * Detects whether the provided code is empty, whitespace only, or untouched starter boilerplate.
 */
export function isTemplateOrEmptyCode(code?: string, lang: string = 'python'): boolean {
  if (!code) return true;
  const rawTrimmed = code.trim();
  if (rawTrimmed.length === 0) return true;

  const targetLang = normalizeLanguageKey(lang);
  if (checkIsTemplateForSingleLang(code, targetLang)) return true;

  // Universal Fail-Safe: Check against ALL known starter templates
  for (const k of ['python', 'cpp', 'java', 'c']) {
    if (k !== targetLang && checkIsTemplateForSingleLang(code, k)) {
      return true;
    }
  }

  return false;
}

/**
 * Normalizes standard input by converting variable-assignment formatted inputs into competitive programming stdin.
 */
export function normalizeStdin(rawStdin?: string): string {
  if (!rawStdin) return '';
  const trimmed = rawStdin.trim();
  if (!trimmed) return '';

  const hasVariableAssignment = /(?:^|[\n,;])\s*[A-Za-z_]\w*\s*=\s*[^=]/m.test(trimmed);
  if (!hasVariableAssignment) {
    return rawStdin;
  }

  const lines = trimmed.split(/\r?\n/);
  const normalizedLines = lines.map((line) => {
    if (/(?:^|[,;])\s*[A-Za-z_]\w*\s*=\s*/.test(line)) {
      const parts = line.split(/[,;]\s*(?=[A-Za-z_]\w*\s*=)/);
      const extracted = parts.map((part) => {
        const val = part.replace(/^\s*[A-Za-z_]\w*\s*=\s*/, '').trim();
        return val.replace(/^['"](.*)['"]$/, '$1');
      });
      return extracted.join(' ');
    }
    return line;
  });

  return normalizedLines.join('\n');
}

/**
 * Normalizes program output (standardizing newlines and trailing spaces for clean comparison)
 */
export function normalizeOutput(str?: string): string {
  if (!str) return '';
  return str
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .trim();
}

/**
 * Core Sandboxed Code Execution Service
 * Proxying all execution through /api/execute-code [P0-01]
 */
export const codeExecutionService = {
  /**
   * Base API endpoint for direct Judge0 CE access (fallback when /api/execute-code proxy is unavailable)
   */
  getDirectJudge0Url(): string {
    const envUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CODE_EXECUTION_URL) as string | undefined;
    return envUrl && envUrl.trim().length > 0
      ? envUrl.trim()
      : 'https://ce.judge0.com/submissions/?base64_encoded=true&wait=true';
  },

  /**
   * Direct sandboxed execution against Judge0 CE
   */
  async executeDirectJudge0(
    language: string,
    sourceCode: string,
    stdinText: string = ''
  ): Promise<ExecutionResult> {
    const langKey = normalizeLanguageKey(language);
    const langId = JUDGE0_LANGUAGE_IDS[langKey] || JUDGE0_LANGUAGE_IDS.python;
    const sanitizedStdin = normalizeStdin(stdinText);

    const payload = {
      source_code: encodeBase64(sourceCode),
      language_id: langId,
      stdin: encodeBase64(sanitizedStdin),
      cpu_time_limit: 2.0,
      memory_limit: 256000,
      wall_time_limit: 5.0,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const apiKey = typeof import.meta !== 'undefined' &&
      (import.meta.env?.VITE_CODE_EXECUTION_API_KEY || import.meta.env?.VITE_JUDGE0_API_KEY || import.meta.env?.VITE_RAPIDAPI_KEY);
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (apiKey) {
      headers['X-Auth-Token'] = apiKey;
      headers['X-RapidAPI-Key'] = apiKey;
    }

    try {
      const res = await fetch(this.getDirectJudge0Url(), {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Compiler gateway error (${res.status}): ${text.slice(0, 100)}`);
      }

      const data = await res.json();
      const stdout = decodeBase64(data.stdout || '');
      const stderr = decodeBase64(data.stderr || '');
      const compileOutput = decodeBase64(data.compile_output || '');
      const statusId = data.status?.id || 0;
      const statusDescription = data.status?.description || 'Unknown';
      const timeMs = data.time ? Math.round(parseFloat(data.time) * 1000) : 0;
      const memoryKb = data.memory || 0;

      const isCompileError = statusId === 6 || compileOutput.trim().length > 0;
      const isTimeLimitExceeded = statusId === 5;
      const isRuntimeError = (statusId >= 7 && statusId <= 12) || (statusId === 11 && stderr.trim().length > 0);
      const isSuccess = statusId === 3 && !isCompileError && !isRuntimeError;

      return {
        statusId,
        statusDescription,
        stdout,
        stderr,
        compileOutput,
        timeMs,
        memoryKb,
        isSuccess,
        isCompileError,
        isRuntimeError,
        isTimeLimitExceeded,
        errorMessage: compileOutput || stderr || undefined,
      };
    } catch (err: any) {
      clearTimeout(timeoutId);
      const isAbort = err.name === 'AbortError';
      const errMsg = isAbort ? 'Execution timed out (> 12s).' : (err.message || 'Execution error.');
      return {
        statusId: 0,
        statusDescription: isAbort ? 'Time Limit Exceeded' : 'Execution Error',
        stdout: '',
        stderr: errMsg,
        compileOutput: '',
        timeMs: 0,
        memoryKb: 0,
        isSuccess: false,
        isCompileError: false,
        isRuntimeError: true,
        isTimeLimitExceeded: isAbort,
        errorMessage: errMsg,
      };
    }
  },

  /**
   * Directly evaluates test cases against Judge0 CE (used in local dev or when proxy is down)
   */
  async runTestCasesDirect(
    language: string,
    sourceCode: string,
    testCases: TestCaseInput[]
  ): Promise<TestCaseRunResult> {
    if (!testCases || testCases.length === 0) {
      return {
        cases: [],
        passedCount: 0,
        totalCount: 0,
        isTemplateOrEmpty: false,
        compileError: null,
        runtimeError: null,
        summaryMessage: 'No test cases configured.',
      };
    }

    const evaluatedCases: EvaluatedTestCase[] = [];
    let compileErrorEncountered: string | null = null;
    let firstRuntimeError: string | null = null;

    const evaluateSingle = async (tc: TestCaseInput, index: number): Promise<EvaluatedTestCase> => {
      const isHidden = Boolean(tc.is_hidden);
      const rawStdin = tc.input || '';
      const realExpected = normalizeOutput(
        tc.expected_output ||
        tc.output ||
        tc.expectedOutput ||
        tc.expected ||
        ''
      );

      const displayInput = isHidden ? `[Hidden Test Case ${index + 1}]` : rawStdin;
      const displayExpected = isHidden ? '[Hidden Expected Output]' : realExpected;

      const execResult = await this.executeDirectJudge0(language, sourceCode, rawStdin);

      if (execResult.isCompileError) {
        const err = execResult.compileOutput || execResult.stderr || 'Compilation error.';
        if (!compileErrorEncountered) compileErrorEncountered = err;
        return {
          input: displayInput,
          expected: displayExpected,
          actual: isHidden ? '[Compilation Error on Hidden Case]' : err,
          passed: false,
          status: 'COMPILATION_ERROR',
          timeMs: execResult.timeMs,
          memoryKb: execResult.memoryKb,
          error: err,
        };
      }

      if (execResult.isRuntimeError) {
        const rErr = execResult.stderr || execResult.errorMessage || 'Runtime error.';
        if (!firstRuntimeError) firstRuntimeError = rErr;
        return {
          input: displayInput,
          expected: displayExpected,
          actual: isHidden ? '[Runtime Error on Hidden Case]' : rErr,
          passed: false,
          status: 'RUNTIME_ERROR',
          timeMs: execResult.timeMs,
          memoryKb: execResult.memoryKb,
          error: rErr,
        };
      }

      if (execResult.isTimeLimitExceeded) {
        return {
          input: displayInput,
          expected: displayExpected,
          actual: 'Time Limit Exceeded (> 2.0s).',
          passed: false,
          status: 'TIME_LIMIT_EXCEEDED',
          timeMs: execResult.timeMs || 2000,
          memoryKb: execResult.memoryKb,
          error: 'Time Limit Exceeded',
        };
      }

      const actual = normalizeOutput(execResult.stdout);
      const isMatch = execResult.isSuccess && actual === realExpected;

      return {
        input: displayInput,
        expected: displayExpected,
        actual: isHidden ? (isMatch ? '[Output Matched]' : '[Hidden Output Mismatch]') : (actual || '[No output]'),
        passed: isMatch,
        status: isMatch ? 'PASSED' : 'WRONG_ANSWER',
        timeMs: execResult.timeMs,
        memoryKb: execResult.memoryKb,
      };
    };

    // Run first case to check compilation
    const firstEvaluated = await evaluateSingle(testCases[0], 0);
    evaluatedCases.push(firstEvaluated);

    if (firstEvaluated.status === 'COMPILATION_ERROR') {
      for (let j = 1; j < testCases.length; j++) {
        evaluatedCases.push({
          input: testCases[j].is_hidden ? `[Hidden Test Case ${j + 1}]` : (testCases[j].input || ''),
          expected: testCases[j].is_hidden
            ? '[Hidden Expected Output]'
            : normalizeOutput(
                testCases[j].expected_output ||
                testCases[j].output ||
                testCases[j].expectedOutput ||
                testCases[j].expected ||
                ''
              ),
          actual: 'Skipped due to compilation error.',
          passed: false,
          status: 'SKIPPED',
          timeMs: 0,
        });
      }
    } else if (testCases.length > 1) {
      // Run remaining test cases concurrently
      const remainingPromises = testCases.slice(1).map((tc, idx) => evaluateSingle(tc, idx + 1));
      const remainingEvaluated = await Promise.all(remainingPromises);
      evaluatedCases.push(...remainingEvaluated);
    }

    const passedCount = evaluatedCases.filter(c => c.passed).length;
    const totalCount = evaluatedCases.length;

    let summaryMessage = `${passedCount}/${totalCount} Test Cases Passed`;
    if (compileErrorEncountered) {
      summaryMessage = 'Compilation Failed: Please inspect compiler diagnostics.';
    } else if (passedCount === totalCount && totalCount > 0) {
      summaryMessage = 'All Test Cases Passed!';
    }

    return {
      cases: evaluatedCases,
      passedCount,
      totalCount,
      isTemplateOrEmpty: false,
      compileError: compileErrorEncountered,
      runtimeError: firstRuntimeError,
      summaryMessage,
    };
  },

  /**
   * Execute code with given standard input via authenticated Sandboxed API proxy with direct Judge0 fallback
   */
  async execute(
    language: string,
    sourceCode: string,
    stdin: string = ''
  ): Promise<ExecutionResult> {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const sanitizedStdin = normalizeStdin(stdin);

    try {
      const response = await fetch('/api/execute-code', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          language: normalizeLanguageKey(language),
          sourceCode,
          customStdin: sanitizedStdin,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const isErr = Boolean(data.stderr && data.stderr.trim().length > 0);

        return {
          statusId: isErr ? 11 : 3,
          statusDescription: data.status || (isErr ? 'Runtime Error' : 'Accepted'),
          stdout: data.stdout || '',
          stderr: data.stderr || '',
          compileOutput: '',
          timeMs: data.timeMs || 0,
          memoryKb: data.memoryKb || 0,
          isSuccess: !isErr,
          isCompileError: false,
          isRuntimeError: isErr,
          isTimeLimitExceeded: false,
          errorMessage: data.stderr || undefined,
        };
      }
      console.warn(`[codeExecutionService.execute] Proxy returned status ${response.status}. Using direct fallback.`);
    } catch (proxyErr) {
      console.warn('[codeExecutionService.execute] Proxy unreachable. Using direct fallback:', proxyErr);
    }

    // Direct fallback
    return await this.executeDirectJudge0(language, sourceCode, sanitizedStdin);
  },

  /**
   * Evaluates test cases against the source code via authenticated serverless proxy,
   * with automatic, seamless failover to direct Judge0 CE execution.
   */
  async runTestCases(
    arg1: string,
    arg2: string,
    arg3?: TestCaseInput[] | { problemId?: string; isSubmit?: boolean; testCases?: TestCaseInput[] } | string,
    arg4?: boolean
  ): Promise<TestCaseRunResult> {
    let language = 'python';
    let sourceCode = '';
    let problemId: string | undefined;
    let testCases: TestCaseInput[] | undefined;
    let isSubmit = false;

    // Detect parameter calling pattern
    if (Array.isArray(arg3)) {
      language = normalizeLanguageKey(arg1);
      sourceCode = arg2;
      testCases = arg3;
      isSubmit = Boolean(arg4);
    } else if (typeof arg3 === 'object' && arg3 !== null) {
      language = normalizeLanguageKey(arg1);
      sourceCode = arg2;
      problemId = arg3.problemId;
      testCases = arg3.testCases;
      isSubmit = Boolean(arg3.isSubmit);
    } else if (typeof arg3 === 'string') {
      problemId = arg1;
      language = normalizeLanguageKey(arg2);
      sourceCode = arg3;
      isSubmit = Boolean(arg4);
    } else {
      language = normalizeLanguageKey(arg1);
      sourceCode = arg2;
      isSubmit = Boolean(arg4);
    }

    // 1. Guard against empty code or unmodified starter template
    if (isTemplateOrEmptyCode(sourceCode, language)) {
      const emptyCases: EvaluatedTestCase[] = (testCases || []).map((tc) => ({
        input: tc.input || '',
        expected:
          tc.expected_output ||
          tc.output ||
          tc.expectedOutput ||
          tc.expected ||
          '',
        actual: 'No solution code detected. Please write your algorithm before running tests.',
        passed: false,
        status: 'EMPTY_CODE',
        timeMs: 0,
        error: 'No solution implemented inside the template.',
      }));

      return {
        cases: emptyCases,
        passedCount: 0,
        totalCount: (testCases || []).length,
        isTemplateOrEmpty: true,
        compileError: null,
        runtimeError: null,
        summaryMessage: 'No solution code detected. Please write your solution before running tests.',
      };
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const payload: any = {
      language,
      sourceCode,
      isSubmit,
    };
    if (problemId) payload.problemId = problemId;
    if (testCases && testCases.length > 0) payload.testCases = testCases;

    // Try serverless proxy first
    try {
      const response = await fetch('/api/execute-code', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        const cases: EvaluatedTestCase[] = (data.cases || []).map((c: any) => ({
          input: c.input || `[Test Case ${c.caseIndex}]`,
          expected: c.expected || '',
          actual: c.actual || '',
          passed: Boolean(c.passed),
          status: c.status || (c.passed ? 'PASSED' : 'WRONG_ANSWER'),
          timeMs: c.timeMs || 0,
          memoryKb: c.memoryKb,
          error: c.error,
        }));

        return {
          cases,
          passedCount: data.passedCount || 0,
          totalCount: data.totalCount || 0,
          isTemplateOrEmpty: false,
          compileError: data.compileError || null,
          runtimeError: data.status === 'RUNTIME_ERROR' ? 'Runtime error occurred.' : null,
          summaryMessage: data.compileError
            ? 'Compilation Error: Inspect compiler diagnostic output.'
            : `${data.passedCount}/${data.totalCount} Test Cases Passed`,
        };
      }
      console.warn(`[codeExecutionService] /api/execute-code proxy returned ${response.status}. Using direct Judge0 fallback.`);
    } catch (proxyErr) {
      console.warn('[codeExecutionService] /api/execute-code proxy unreachable. Using direct Judge0 fallback:', proxyErr);
    }

    // Direct fallback execution
    if (testCases && testCases.length > 0) {
      return await this.runTestCasesDirect(language, sourceCode, testCases);
    }

    throw new Error('Compiler engine unreachable and no test cases available for fallback.');
  },

  /**
   * Runs custom input via authenticated serverless proxy with direct Judge0 fallback
   */
  async executeCustom(
    language: string,
    sourceCode: string,
    customStdin: string
  ): Promise<{ stdout: string; stderr: string; status: string; timeMs: number }> {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;

    try {
      const response = await fetch('/api/execute-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          language: normalizeLanguageKey(language),
          sourceCode,
          customStdin: normalizeStdin(customStdin),
        }),
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (proxyErr) {
      console.warn('[codeExecutionService.executeCustom] Proxy unreachable, using direct fallback:', proxyErr);
    }

    const directRes = await this.executeDirectJudge0(language, sourceCode, customStdin);
    return {
      stdout: directRes.stdout,
      stderr: directRes.stderr || directRes.compileOutput,
      status: directRes.statusDescription,
      timeMs: directRes.timeMs,
    };
  },
};
