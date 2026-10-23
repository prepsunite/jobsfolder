const JSCPP = require('D:/Side projects/Prepunite/frontend/node_modules/JSCPP/lib/commonjs.js');

self.onmessage = function (e) {
  const { id, type, sourceCode, stdinText } = e.data || {};

  if (type === 'PING') {
    self.postMessage({ id, type: 'PONG', success: true });
    return;
  }

  if (type === 'RUN_SINGLE') {
    const startTime = performance.now();
    let stdoutBuffer = '';

    try {
      const exitCode = JSCPP.run(sourceCode, stdinText || '', {
        stdio: {
          write: function (str) {
            stdoutBuffer += str;
          },
        },
        maxTimeout: 3000,
      });

      const elapsed = Math.round(performance.now() - startTime);

      self.postMessage({
        id,
        type: 'RESULT_SINGLE',
        stdout: stdoutBuffer,
        stderr: (exitCode !== 0 && stdoutBuffer.length === 0) ? `Process exited with code ${exitCode}` : '',
        timeMs: elapsed,
        isCompileError: false,
        isRuntimeError: exitCode !== 0 && stdoutBuffer.length === 0,
      });
    } catch (err) {
      const elapsed = Math.round(performance.now() - startTime);
      const errMsg = err && (err.message || String(err)) || 'Execution error';
      const isSyntax = errMsg.toLowerCase().includes('syntax') ||
                       errMsg.toLowerCase().includes('expected') ||
                       errMsg.toLowerCase().includes('parse error') ||
                       errMsg.toLowerCase().includes('unexpected');

      self.postMessage({
        id,
        type: 'RESULT_SINGLE',
        stdout: stdoutBuffer,
        stderr: errMsg,
        timeMs: elapsed,
        isCompileError: isSyntax,
        isRuntimeError: !isSyntax,
      });
    }
  }
};
