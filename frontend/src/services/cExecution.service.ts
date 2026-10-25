/**
 * PrepUnite In-Browser WebAssembly/Native C Service
 * Runs C11 / C99 code directly in candidate browser tab via isolated Web Worker.
 * Latency: ~15-30ms per test case, 0 server cost, infinite scalability.
 */

import {
  type TestCaseInput,
  type EvaluatedTestCase,
  type TestCaseRunResult,
  compareOutputs,
  normalizeOutput,
  normalizeStdin,
} from './codeExecution.service';

interface CRunSingleResponse {
  stdout: string;
  stderr: string;
  timeMs: number;
  isCompileError: boolean;
  isRuntimeError: boolean;
  isTimeLimitExceeded?: boolean;
}

export function isCEngineLimitation(stderr?: string): boolean {
  if (!stderr) return false;
  const s = stderr.toLowerCase();
  return (
    s.includes('does not exist') ||
    s.includes('is not defined') ||
    s.includes('no method') ||
    s.includes('cannot read propert') ||
    s.includes('parsing failure') ||
    s.includes('unsupported') ||
    s.includes('not implemented') ||
    s.includes('ast') ||
    s.includes('syntax error') ||
    s.includes('malloc') ||
    s.includes('struct') ||
    s.includes('qsort')
  );
}

class CExecutionService {
  private worker: Worker | null = null;
  private messageCounter = 0;
  private pendingCallbacks = new Map<number, (res: CRunSingleResponse) => void>();
  private isPreloading = false;
  private isReady = false;

  private getWorker(): Worker {
    if (!this.worker) {
      if (typeof window === 'undefined') {
        throw new Error('C Web Worker is only available in a browser environment');
      }

      this.worker = new Worker('/c-worker.js');

      this.worker.onmessage = (e: MessageEvent) => {
        const { id, type, stdout, stderr, timeMs, isCompileError, isRuntimeError, success } = e.data || {};

        if (type === 'PONG') {
          this.isReady = Boolean(success);
          return;
        }

        if (type === 'RESULT_SINGLE') {
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
        console.warn('[CExecutionService] Worker error:', err);
        this.pendingCallbacks.forEach((cb) => {
          cb({
            stdout: '',
            stderr: 'In-browser C Worker execution failed.',
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
   * Preloads C compiler worker in the background while candidate reads problem statement.
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
   * Executes a single C run with an isolated 3.5s timeout protecting against infinite loops.
   */
  async executeSingle(
    sourceCode: string,
    stdinText: string = '',
    timeoutMs: number = 3500
  ): Promise<CRunSingleResponse> {
    const w = this.getWorker();
    const msgId = ++this.messageCounter;

    return new Promise<CRunSingleResponse>((resolve) => {
      let isSettled = false;

      const timer = setTimeout(() => {
        if (!isSettled) {
          isSettled = true;
          this.pendingCallbacks.delete(msgId);
          this.terminateWorker();
          resolve({
            stdout: '',
            stderr: 'Time Limit Exceeded (> 3.5s). Check for infinite loops (e.g. while(1)) or infinite recursion.',
            timeMs: timeoutMs,
            isCompileError: false,
            isRuntimeError: false,
            isTimeLimitExceeded: true,
          });
        }
      }, timeoutMs);

      this.pendingCallbacks.set(msgId, (res) => {
        if (!isSettled) {
          isSettled = true;
          clearTimeout(timer);
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
   * Evaluates all test cases in-browser using C engine.
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
    const firstRes = await this.executeSingle(sourceCode, firstTc.input || '', 3500);

    // If C code uses advanced features unsupported by in-browser interpreter, fail over to real GCC
    if (isCEngineLimitation(firstRes.stderr)) {
      throw new Error(`C_ENGINE_LIMITATION: ${firstRes.stderr}`);
    }

    if (firstRes.isCompileError) {
      compileErrorEncountered = firstRes.stderr || 'Syntax error in C code.';
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
        ? 'Time Limit Exceeded (> 3.5s)'
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

      const res = await this.executeSingle(sourceCode, tc.input || '', 3500);

      if (isCEngineLimitation(res.stderr)) {
        throw new Error(`C_ENGINE_LIMITATION: ${res.stderr}`);
      }

      if (res.isTimeLimitExceeded) {
        evaluatedCases.push({
          input: displayInput,
          expected: displayExpected,
          actual: 'Time Limit Exceeded (> 3.5s)',
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

    let summaryMessage = `${passedCount}/${totalCount} Test Cases Passed (In-Browser C Engine)`;
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
   * Executes custom input in-browser via C engine.
   */
  async executeCustom(sourceCode: string, customStdin: string): Promise<{
    stdout: string;
    stderr?: string;
    timeMs: number;
    memoryKb?: number;
    status: string;
  }> {
    const res = await this.executeSingle(sourceCode, customStdin, 3500);
    if (isCEngineLimitation(res.stderr)) {
      throw new Error(`C_ENGINE_LIMITATION: ${res.stderr}`);
    }
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

export const cExecutionService = new CExecutionService();
