/**
 * Competitive Programming Judge Comparator & Stdin/Stdout Normalization
 * Standardizes stdin variable extraction and output comparisons across languages (Python, Java, C++, C).
 */

/**
 * Normalizes program output (standardizing newlines and trailing spaces for clean comparison).
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
 * Strips matching surrounding single or double quotes from string.
 */
export function stripQuotes(str?: string): string {
  if (!str) return '';
  const trimmed = str.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
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

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== 'object' || typeof b !== 'object') return false;

  if (Array.isArray(a) !== Array.isArray(b)) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  const objA = a as Record<string, unknown>;
  const objB = b as Record<string, unknown>;
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(objB, key)) return false;
    if (!deepEqual(objA[key], objB[key])) return false;
  }

  return true;
}

/**
 * Competitive Programming Output Comparator.
 * Handles quote tolerance (e.g. "fl" vs fl), boolean case tolerance (Python True vs Java true),
 * JSON/Array formatting variations (e.g. [0,1] vs [0, 1]), and float tolerances.
 */
export function compareOutputs(actualRaw?: string, expectedRaw?: string): boolean {
  if (actualRaw === expectedRaw) return true;
  if (!actualRaw && !expectedRaw) return true;

  const actual = (actualRaw || '').trim();
  const expected = (expectedRaw || '').trim();

  // 1. Direct match
  if (actual === expected) return true;

  // 2. Normalized newline & trailing space match
  const normActual = normalizeOutput(actual);
  const normExpected = normalizeOutput(expected);
  if (normActual === normExpected) return true;

  // 3. String Quote Tolerance (e.g. "Hello World" vs Hello World, "fl" vs fl, "" vs "")
  if (stripQuotes(normActual) === stripQuotes(normExpected)) return true;

  // If one is empty and stripQuotes didn't match, they cannot match on booleans, JSON or numbers
  if (!normActual || !normExpected) return false;

  // 4. Boolean Case-Insensitive Tolerance (e.g. Python True vs Java/C++ true)
  if (/^(?:true|false)$/i.test(normActual) && /^(?:true|false)$/i.test(normExpected)) {
    if (normActual.toLowerCase() === normExpected.toLowerCase()) return true;
  }

  // 5. JSON / Array whitespace & format tolerance (e.g. [0,1] vs [0, 1], {"a":1} vs {"a": 1})
  if (
    (normActual.startsWith('[') && normActual.endsWith(']')) ||
    (normActual.startsWith('{') && normActual.endsWith('}'))
  ) {
    try {
      const parsedActual = JSON.parse(normActual.replace(/'/g, '"'));
      const parsedExpected = JSON.parse(normExpected.replace(/'/g, '"'));
      if (deepEqual(parsedActual, parsedExpected)) return true;
    } catch {}
  }

  // 6. Number tolerance (e.g. 1.0 vs 1, or trailing zero in decimal)
  const numActual = Number(normActual);
  const numExpected = Number(normExpected);
  if (!isNaN(numActual) && !isNaN(numExpected) && normActual.length < 20 && normExpected.length < 20) {
    if (Math.abs(numActual - numExpected) < 1e-7) return true;
  }

  return false;
}
