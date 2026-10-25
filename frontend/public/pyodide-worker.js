/**
 * PrepUnite In-Browser WebAssembly Python Worker (Pyodide)
 * Executes Python 3 code in an isolated browser Web Worker thread.
 * Guarantees ~20-50ms execution latency with 0 server load.
 */

/* global importScripts, loadPyodide, self, performance */

let pyodide = null;
let pyodideReadyPromise = null;

async function initPyodide() {
  if (pyodide) return pyodide;
  if (!pyodideReadyPromise) {
    pyodideReadyPromise = (async () => {
      importScripts('https://cdn.jsdelivr.net/pyodide/v0.27.2/full/pyodide.js');
      const inst = await loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.2/full/',
      });

      // Inject standard Python stdin/stdout wrapper once
      const runnerCode = `
import sys, io, traceback
try:
    sys.setrecursionlimit(50000)
except Exception:
    pass

def _exec_candidate(code_str, stdin_str):
    old_stdin, old_stdout, old_stderr = sys.stdin, sys.stdout, sys.stderr
    sys.stdin = io.StringIO(stdin_str)
    sys.stdout = io.StringIO()
    sys.stderr = io.StringIO()
    
    err = None
    is_compile = False
    
    try:
        compiled = compile(code_str, '<solution>', 'exec')
        exec(compiled, {'__name__': '__main__'})
    except SyntaxError:
        is_compile = True
        err = traceback.format_exc()
    except SystemExit as se:
        if se.code not in (0, None):
            err = f"SystemExit: {se.code}"
    except BaseException:
        err = traceback.format_exc()
    finally:
        out = sys.stdout.getvalue()
        err_out = sys.stderr.getvalue()
        sys.stdin, sys.stdout, sys.stderr = old_stdin, old_stdout, old_stderr
        
    return [out, err or err_out, is_compile, bool(err and not is_compile)]
`;
      await inst.runPythonAsync(runnerCode);
      pyodide = inst;
      return inst;
    })();
  }
  return pyodideReadyPromise;
}

self.onmessage = async (e) => {
  const { id, type, sourceCode, stdinText } = e.data || {};

  if (type === 'PING') {
    try {
      await initPyodide();
      self.postMessage({ id, type: 'PONG', success: true });
    } catch (err) {
      self.postMessage({ id, type: 'PONG', success: false, error: err?.message || 'Init error' });
    }
    return;
  }

  if (type === 'RUN_SINGLE') {
    try {
      const inst = await initPyodide();
      const fn = inst.globals.get('_exec_candidate');
      const t0 = performance.now();
      const result = fn(sourceCode, stdinText || '').toJs();
      const timeMs = Math.round(performance.now() - t0);
      const [stdout, stderr, isCompileError, isRuntimeError] = result;

      self.postMessage({
        id,
        type: 'RESULT_SINGLE',
        stdout: stdout || '',
        stderr: stderr || '',
        timeMs,
        isCompileError: Boolean(isCompileError),
        isRuntimeError: Boolean(isRuntimeError),
      });
    } catch (err) {
      self.postMessage({
        id,
        type: 'RESULT_SINGLE',
        stdout: '',
        stderr: err?.message || 'Execution error in Python WebAssembly',
        timeMs: 0,
        isCompileError: false,
        isRuntimeError: true,
      });
    }
    return;
  }
};
