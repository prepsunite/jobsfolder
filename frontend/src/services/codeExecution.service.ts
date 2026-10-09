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
   * Execute code with given standard input via authenticated Sandboxed API proxy
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

    const response = await fetch('/api/execute-code', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        language: normalizeLanguageKey(language),
        sourceCode,
        customStdin: sanitizedStdin,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `Compiler server error (${response.status})`);
    }

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
  },

  /**
   * Evaluates test cases against the source code via authenticated serverless proxy.
   * Supports:
   * 1. (language, sourceCode, testCases, isSubmit) - Direct test case array execution
   * 2. (language, sourceCode, { problemId, isSubmit, testCases }) - Problem-backed execution
   * 3. (problemId, language, sourceCode, isSubmit) - Problem ID first signature
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
        expected: tc.expected_output || tc.output || '',
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

    const response = await fetch('/api/execute-code', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Compiler server error (${response.status})`);
    }

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
  },

  /**
   * Runs custom input via authenticated serverless proxy
   */
  async executeCustom(
    language: string,
    sourceCode: string,
    customStdin: string
  ): Promise<{ stdout: string; stderr: string; status: string; timeMs: number }> {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;

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

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Custom execution failed.');
    }

    return await response.json();
  },
};
