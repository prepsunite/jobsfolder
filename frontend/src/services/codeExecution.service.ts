/**
 * Sandboxed Code Execution Service for Prepunite Mock Examination & Practice
 * Connects to sandboxed execution API (Judge0 Community Edition / configurable private endpoint)
 * with client-side boilerplate checking, base64 encoding/decoding, and test case evaluation.
 */

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
      return b64;
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
 * Detects whether the provided code is empty, whitespace only, or untouched starter boilerplate.
 * Prevents false positives where candidates run tests without writing any logic.
 */
export function isTemplateOrEmptyCode(code?: string, lang: string = 'python'): boolean {
  if (!code) return true;
  const rawTrimmed = code.trim();
  if (rawTrimmed.length === 0) return true;

  const normalized = normalizeCode(code);
  const template = STARTER_TEMPLATES[lang] || '';
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
 * Normalizes standard input by converting any variable-assignment formatted inputs
 * (e.g., "Y = 2000", "A = 4, B = 6", "A = 15, B = 4, op = '*'", "ch = 'A'")
 * into pure competitive programming stdin tokens ("2000", "4 6", "15 4 *", "A").
 * Preserves normal unformatted stdin (arrays, raw lines, numbers) untouched.
 */
export function normalizeStdin(rawStdin?: string): string {
  if (!rawStdin) return '';
  const trimmed = rawStdin.trim();
  if (!trimmed) return '';

  // Check if the input contains variable assignments like 'X = 5' or 'A = 1, B = 2' or 'op = "*"'
  const hasVariableAssignment = /(?:^|[\n,;])\s*[A-Za-z_]\w*\s*=\s*[^=]/m.test(trimmed);

  if (!hasVariableAssignment) {
    return rawStdin;
  }

  // Handle line by line or comma-separated pairs
  const lines = trimmed.split(/\r?\n/);
  const normalizedLines = lines.map(line => {
    if (/(?:^|[,;])\s*[A-Za-z_]\w*\s*=\s*/.test(line)) {
      const parts = line.split(/[,;]\s*(?=[A-Za-z_]\w*\s*=)/);
      const extracted = parts.map(part => {
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
    .map(line => line.trimEnd())
    .join('\n')
    .trim();
}

/**
 * Core Sandboxed Code Execution Service
 */
export const codeExecutionService = {
  /**
   * Base API endpoint (supports configurable environment variable or defaults to Judge0 CE)
   */
  getApiUrl(): string {
    const envUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CODE_EXECUTION_URL) as string | undefined;
    return envUrl && envUrl.trim().length > 0
      ? envUrl.trim()
      : 'https://ce.judge0.com/submissions/?base64_encoded=true&wait=true';
  },

  /**
   * Execute code with given standard input via Sandboxed API
   */
  async execute(
    language: string,
    sourceCode: string,
    stdin: string = ''
  ): Promise<ExecutionResult> {
    const langId = JUDGE0_LANGUAGE_IDS[language] || JUDGE0_LANGUAGE_IDS.python;
    const url = this.getApiUrl();
    const sanitizedStdin = normalizeStdin(stdin);

    const payload = {
      source_code: encodeBase64(sourceCode),
      language_id: langId,
      stdin: encodeBase64(sanitizedStdin),
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s network timeout

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Compiler service returned HTTP ${response.status}: ${errText.slice(0, 200)}`);
      }

      const data = await response.json();

      const stdout = decodeBase64(data.stdout || '');
      const stderr = decodeBase64(data.stderr || '');
      const compileOutput = decodeBase64(data.compile_output || '');
      const message = decodeBase64(data.message || '');

      const statusId = data.status?.id || 0;
      const statusDescription = data.status?.description || 'Unknown';
      const timeMs = data.time ? Math.round(parseFloat(data.time) * 1000) : 0;
      const memoryKb = data.memory || 0;

      // Judge0 Status IDs:
      // 3: Accepted
      // 4: Wrong Answer (when compared in judge0)
      // 5: Time Limit Exceeded
      // 6: Compilation Error
      // 7: Runtime Error (SIGSEGV)
      // 8: Runtime Error (SIGXFSZ)
      // 9: Runtime Error (SIGFPE)
      // 10: Runtime Error (SIGABRT)
      // 11: Runtime Error (NZEC)
      // 12: Runtime Error (Other)
      // 13: Internal Error
      // 14: Exec Format Error
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
        errorMessage: compileOutput || stderr || message || undefined,
      };
    } catch (err: any) {
      clearTimeout(timeoutId);
      const isAbort = err.name === 'AbortError';
      const errMsg = isAbort
        ? 'Execution timed out. Program took more than 15 seconds to respond.'
        : (err.message || 'Unable to connect to code execution engine.');

      return {
        statusId: 0,
        statusDescription: isAbort ? 'Time Limit Exceeded' : 'Network/Compiler Error',
        stdout: '',
        stderr: errMsg,
        compileOutput: '',
        timeMs: 0,
        memoryKb: 0,
        isSuccess: false,
        isCompileError: false,
        isRuntimeError: !isAbort,
        isTimeLimitExceeded: isAbort,
        errorMessage: errMsg,
      };
    }
  },

  /**
   * Evaluates all provided test cases against the source code.
   * Intercepts empty templates, halts early on compile errors, and compares outputs.
   */
  async runTestCases(
    language: string,
    sourceCode: string,
    testCases: TestCaseInput[]
  ): Promise<TestCaseRunResult> {
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

    if (!testCases || testCases.length === 0) {
      return {
        cases: [],
        passedCount: 0,
        totalCount: 0,
        isTemplateOrEmpty: false,
        compileError: null,
        runtimeError: null,
        summaryMessage: 'No test cases defined for this problem.',
      };
    }

    // Run all test cases (no hard cap – the UI should render as many as needed).
    // For very large private suites this stays safe because the browser only
    // receives sample cases; private grading must run server-side.
    const casesToRun = testCases;
    const evaluatedCases: EvaluatedTestCase[] = [];
    let compileErrorEncountered: string | null = null;
    let firstRuntimeError: string | null = null;

    for (let i = 0; i < casesToRun.length; i++) {
      const tc = casesToRun[i];
      const stdin = tc.input || '';
      const expected = normalizeOutput(tc.expected_output || tc.output || '');

      // Execute on Judge0
      const execResult = await this.execute(language, sourceCode, stdin);

      // If compilation error occurs on test case 1, abort remaining cases immediately
      if (execResult.isCompileError) {
        compileErrorEncountered = execResult.compileOutput || execResult.stderr || 'Compilation error occurred.';
        evaluatedCases.push({
          input: stdin,
          expected,
          actual: compileErrorEncountered,
          passed: false,
          status: 'COMPILATION_ERROR',
          timeMs: execResult.timeMs,
          memoryKb: execResult.memoryKb,
          error: compileErrorEncountered,
        });

        // Mark remaining cases as skipped
        for (let j = i + 1; j < casesToRun.length; j++) {
          evaluatedCases.push({
            input: casesToRun[j].input || '',
            expected: normalizeOutput(casesToRun[j].expected_output || casesToRun[j].output || ''),
            actual: 'Skipped due to compilation error.',
            passed: false,
            status: 'SKIPPED',
            timeMs: 0,
          });
        }
        break;
      }

      // Handle Runtime Error
      if (execResult.isRuntimeError) {
        const rErr = execResult.stderr || execResult.errorMessage || 'Runtime exception thrown.';
        if (!firstRuntimeError) firstRuntimeError = rErr;
        evaluatedCases.push({
          input: stdin,
          expected,
          actual: rErr,
          passed: false,
          status: 'RUNTIME_ERROR',
          timeMs: execResult.timeMs,
          memoryKb: execResult.memoryKb,
          error: rErr,
        });
        continue;
      }

      // Handle Time Limit Exceeded
      if (execResult.isTimeLimitExceeded) {
        evaluatedCases.push({
          input: stdin,
          expected,
          actual: 'Time Limit Exceeded (> 2.0s). Check for infinite loops or inefficient algorithms.',
          passed: false,
          status: 'TIME_LIMIT_EXCEEDED',
          timeMs: execResult.timeMs || 2000,
          memoryKb: execResult.memoryKb,
          error: 'Time Limit Exceeded',
        });
        continue;
      }

      // Check Output Match — REQUIRES successful execution (isSuccess).
      // An internal error, empty stdout, or network failure must NEVER count as a pass,
      // even if the expected output is also empty.
      const actual = normalizeOutput(execResult.stdout);
      const isMatch = execResult.isSuccess && actual === expected;

      evaluatedCases.push({
        input: stdin,
        expected,
        actual: execResult.stdout.trim().length > 0 ? execResult.stdout.trim() : '[No output printed to stdout]',
        passed: isMatch,
        status: isMatch ? 'PASSED' : 'WRONG_ANSWER',
        timeMs: execResult.timeMs,
        memoryKb: execResult.memoryKb,
      });
    }

    const passedCount = evaluatedCases.filter(c => c.passed).length;
    const totalCount = evaluatedCases.length;

    let summaryMessage = `${passedCount}/${totalCount} Test Cases Passed`;
    if (compileErrorEncountered) {
      summaryMessage = 'Compilation Failed: Please inspect compiler diagnostics.';
    } else if (passedCount === totalCount && totalCount > 0) {
      summaryMessage = 'All Sample Test Cases Passed!';
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
};
