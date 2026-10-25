/**
 * PrepUnite In-Browser WebAssembly Python Service (Pyodide)
 * Runs Python 3 code in an isolated Web Worker with strict 4.0s timeout per case.
 * Latency: ~10-40ms per test case, 0 server cost, infinite scalability.
 */

import {
  type TestCaseInput,
  type EvaluatedTestCase,
  type TestCaseRunResult,
  compareOutputs,
  normalizeOutput,
  normalizeStdin,
} from './codeExecution.service';

interface PyodideRunSingleResponse {
  stdout: string;
  stderr: string;
  timeMs: number;
  isCompileError: boolean;
  isRuntimeError: boolean;
  isTimeLimitExceeded?: boolean;
}

class PyodideExecutionService {
  private worker: Worker | null = null;
  private messageCounter = 0;
  private pendingCallbacks = new Map<number, (res: PyodideRunSingleResponse) => void>();
  private isPreloading = false;
  private isReady = false;

  private getWorker(): Worker {
    if (!this.worker) {
      if (typeof window === 'undefined') {
        throw new Error('Pyodide Web Worker is only available in a browser environment');
      }

      this.worker = new Worker('/pyodide-worker.js');

      this.worker.onmessage = (e: MessageEvent) => {
        const { id, type, stdout, stderr, timeMs, isCompileError, isRuntimeError, success } = e.data || {};

        if (type === 'PONG') {
          this.isReady = Boolean(success);
          return;
        }

        if (type === 'RESULT_SINGLE') {
          this.isReady = true;
          const cb = this.pendingCallbacks.get(id);
          if (cb) {
            this.pendingCallbacks.delete(id);
            cb({
              stdout: stdout || '',
              stderr: stderr || '',
              timeMs: timeMs || 0,
              isCompileError: Boolean(isCompileError),
              isRuntimeError: Boolean(isRuntimeError),
            });
          }
        }
      };

      this.worker.onerror = (err) => {
        console.warn('[PyodideExecutionService] Worker error (CDN or WebAssembly unavailable):', err);
        this.pendingCallbacks.forEach((cb) => {
          cb({
            stdout: '',
            stderr: 'CDN_LOAD_FAILURE: In-browser Python WebAssembly engine could not be loaded.',
            timeMs: 0,
            isCompileError: false,
            isRuntimeError: true,
          });
        });
        this.pendingCallbacks.clear();
        this.terminateWorker();
      };
    }
    return this.worker;
  }

  private terminateWorker() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.isReady = false;
      this.isPreloading = false;
    }
  }

  /**
   * Preloads Pyodide Wasm binary in the background while candidate reads problem statement.
   */
  preload(): void {
    if (typeof window === 'undefined' || this.isReady || this.isPreloading) return;
    this.isPreloading = true;
    try {
      const w = this.getWorker();
      w.postMessage({ type: 'PING', id: 0 });
    } catch {
      this.isPreloading = false;
    }
  }

  /**
   * Executes a single Python run with an isolated timeout to protect against infinite loops.
   * Allows up to 20s for the first-time CDN download of Pyodide, and strict 4.0s for code execution.
   */
  async executeSingle(
    sourceCode: string,
    stdinText: string = '',
    timeoutMs: number = 4000
  ): Promise<PyodideRunSingleResponse> {
    const w = this.getWorker();
    const msgId = ++this.messageCounter;
    const effectiveTimeout = this.isReady ? timeoutMs : Math.max(timeoutMs, 20000);

    return new Promise<PyodideRunSingleResponse>((resolve, reject) => {
      let isSettled = false;

      // Timer to abort infinite loops (e.g. while True:) or CDN load failure
      const timer = setTimeout(() => {
        if (!isSettled) {
          isSettled = true;
          this.pendingCallbacks.delete(msgId);
          const wasReady = this.isReady;
          this.terminateWorker();

          if (!wasReady) {
            // Cold start download timed out — throw so codeExecutionService immediately falls back to Judge0
            reject(new Error('CDN_DOWNLOAD_TIMEOUT: Pyodide WebAssembly cold start took too long. Falling back to backend compiler.'));
            return;
          }

          resolve({
            stdout: '',
            stderr: 'Time Limit Exceeded (> 4.0s). Check for infinite loops or deep recursion.',
            timeMs: timeoutMs,
            isCompileError: false,
            isRuntimeError: false,
            isTimeLimitExceeded: true,
          });
        }
      }, effectiveTimeout);

      this.pendingCallbacks.set(msgId, (res) => {
        if (!isSettled) {
          isSettled = true;
          clearTimeout(timer);
          if (res.stderr && res.stderr.includes('CDN_LOAD_FAILURE')) {
            reject(new Error(res.stderr));
            return;
          }
          resolve(res);
        }
      });

      w.postMessage({
        id: msgId,
        type: 'RUN_SINGLE',
        sourceCode,
        stdinText: normalizeStdin(stdinText),
      });
    });
  }

  /**
   * Evaluates all test cases in-browser using Pyodide WebAssembly.
   * Returns a complete TestCaseRunResult within ~20-50ms with 0 backend calls.
   */
  async runTestCases(
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

    // Step 1: Run Case 1 first as a compilation & syntax guard
    const firstTc = testCases[0];
    const firstExpected = normalizeOutput(
      firstTc.expected_output || firstTc.output || firstTc.expectedOutput || firstTc.expected || ''
    );
    const firstRes = await this.executeSingle(sourceCode, firstTc.input || '', 4000);

    if (firstRes.isCompileError) {
      compileErrorEncountered = firstRes.stderr || 'Syntax error in Python code.';
      evaluatedCases.push({
        input: firstTc.input || '',
        expected: firstExpected,
        actual: compileErrorEncountered,
        passed: false,
        status: 'COMPILATION_ERROR',
        timeMs: firstRes.timeMs,
        error: compileErrorEncountered,
        is_hidden: Boolean(firstTc.is_hidden),
      });

      // Skip remaining test cases immediately
      for (let j = 1; j < testCases.length; j++) {
        const tc = testCases[j];
        evaluatedCases.push({
          input: tc.input || '',
          expected: normalizeOutput(tc.expected_output || tc.output || tc.expectedOutput || tc.expected || ''),
          actual: 'Skipped due to syntax error on Test Case 1.',
          passed: false,
          status: 'SKIPPED',
          timeMs: 0,
          is_hidden: Boolean(tc.is_hidden),
        });
      }

      return {
        cases: evaluatedCases,
        passedCount: 0,
        totalCount: testCases.length,
        isTemplateOrEmpty: false,
        compileError: compileErrorEncountered,
        runtimeError: null,
        summaryMessage: 'Compilation Error: Inspect syntax output below.',
      };
    }

    // Process Case 1 result
    const firstActual = normalizeOutput(firstRes.stdout);
    const firstMatch = !firstRes.isRuntimeError && !firstRes.isTimeLimitExceeded && compareOutputs(firstActual, firstExpected);
    evaluatedCases.push({
      input: firstTc.input || '',
      expected: firstExpected,
      actual: firstRes.isTimeLimitExceeded
        ? 'Time Limit Exceeded (> 4.0s)'
        : (firstRes.isRuntimeError ? firstRes.stderr : (firstActual || '[No output]')),
      passed: firstMatch,
      status: firstRes.isTimeLimitExceeded
        ? 'TIME_LIMIT_EXCEEDED'
        : (firstRes.isRuntimeError ? 'RUNTIME_ERROR' : (firstMatch ? 'PASSED' : 'WRONG_ANSWER')),
      timeMs: firstRes.timeMs,
      error: firstRes.stderr || undefined,
      is_hidden: Boolean(firstTc.is_hidden),
    });

    if (firstRes.isRuntimeError && !firstRuntimeError) {
      firstRuntimeError = firstRes.stderr;
    }

    // Step 2: Run remaining cases
    for (let i = 1; i < testCases.length; i++) {
      const tc = testCases[i];
      const realExpected = normalizeOutput(
        tc.expected_output || tc.output || tc.expectedOutput || tc.expected || ''
      );
      const displayInput = tc.input || '';
      const displayExpected = realExpected;

      const res = await this.executeSingle(sourceCode, tc.input || '', 4000);

      if (res.isTimeLimitExceeded) {
        evaluatedCases.push({
          input: displayInput,
          expected: displayExpected,
          actual: 'Time Limit Exceeded (> 4.0s)',
          passed: false,
          status: 'TIME_LIMIT_EXCEEDED',
          timeMs: res.timeMs,
          error: 'Time Limit Exceeded',
          is_hidden: Boolean(tc.is_hidden),
        });
        continue;
      }

      if (res.isRuntimeError) {
        if (!firstRuntimeError) firstRuntimeError = res.stderr;
        evaluatedCases.push({
          input: displayInput,
          expected: displayExpected,
          actual: res.stderr,
          passed: false,
          status: 'RUNTIME_ERROR',
          timeMs: res.timeMs,
          error: res.stderr,
          is_hidden: Boolean(tc.is_hidden),
        });
        continue;
      }

      const actualOut = normalizeOutput(res.stdout);
      const isMatch = compareOutputs(actualOut, realExpected);

      evaluatedCases.push({
        input: displayInput,
        expected: displayExpected,
        actual: actualOut || '[No output]',
        passed: isMatch,
        status: isMatch ? 'PASSED' : 'WRONG_ANSWER',
        timeMs: res.timeMs,
        is_hidden: Boolean(tc.is_hidden),
      });
    }

    const passedCount = evaluatedCases.filter(c => c.passed).length;
    const totalCount = evaluatedCases.length;

    let summaryMessage = `${passedCount}/${totalCount} Test Cases Passed (Pyodide Wasm Engine)`;
    if (passedCount === totalCount && totalCount > 0) {
      summaryMessage = `All ${totalCount} Test Cases Passed!`;
    }

    return {
      cases: evaluatedCases,
      passedCount,
      totalCount,
      isTemplateOrEmpty: false,
      compileError: null,
      runtimeError: firstRuntimeError,
      summaryMessage,
    };
  }

  /**
   * Executes custom input in-browser via Pyodide.
   */
  async executeCustom(sourceCode: string, customStdin: string): Promise<{
    stdout: string;
    stderr?: string;
    timeMs: number;
    memoryKb?: number;
    status: string;
  }> {
    const res = await this.executeSingle(sourceCode, customStdin, 4000);
    return {
      stdout: res.stdout,
      stderr: res.stderr,
      timeMs: res.timeMs,
      status: res.isTimeLimitExceeded
        ? 'Time Limit Exceeded'
        : (res.isCompileError ? 'Compilation Error' : (res.isRuntimeError ? 'Runtime Error' : 'Accepted')),
    };
  }
}

export const pyodideExecutionService = new PyodideExecutionService();
