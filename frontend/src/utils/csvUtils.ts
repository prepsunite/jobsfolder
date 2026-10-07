/**
 * Universal CSV Utilities for Prepunite
 * 
 * Provides:
 * 1. Formula & DDE injection protection (CWE-1236)
 * 2. RFC 4180 compliant quotation & escaping
 * 3. Robust client-side CSV parsing supporting quoted multiline fields
 * 4. UTF-8 BOM encoding for Microsoft Excel & Google Sheets compatibility
 */

/**
 * Escapes and sanitizes a single CSV cell value.
 * - If string starts with =, +, -, @, \t, or \r, prepends a single quote (') to neutralize spreadsheet formula execution.
 * - Escapes internal double quotes by doubling them ("" per RFC 4180).
 * - Encloses the value in double quotes.
 */
export function sanitizeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return '""';
  let str = String(value).trim();

  // Mitigate CSV Formula / DDE Injection (CWE-1236)
  if (/^[=+@\-\t\r]/.test(str)) {
    str = `'${str}`;
  }

  // RFC 4180: Double all internal quotation marks
  return `"${str.replace(/"/g, '""')}"`;
}

/**
 * Formats a 2D array of rows into a sanitized CSV string.
 */
export function buildCsvContent(headers: string[], rows: (unknown[])[]): string {
  const headerLine = headers.map(h => sanitizeCsvCell(h)).join(',');
  const rowLines = rows.map(row => row.map(cell => sanitizeCsvCell(cell)).join(','));
  return [headerLine, ...rowLines].join('\n');
}

/**
 * Initiates a browser download for CSV content with a UTF-8 BOM (\uFEFF)
 * ensuring Microsoft Excel properly renders special characters.
 */
export function downloadCsv(filename: string, csvContent: string): void {
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Robust RFC 4180 compliant CSV parser.
 * Correctly parses cells containing commas, escaped quotes, and newlines.
 */
export function parseCsv(text: string): string[][] {
  const result: string[][] = [];
  let row: string[] = [''];
  let inQuotes = false;
  let i = 0;

  // Normalize Windows CRLF and Mac CR to LF
  const clean = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  while (i < clean.length) {
    const c = clean[i];
    const next = clean[i + 1];

    if (c === '"') {
      if (inQuotes && next === '"') {
        // Escaped quotation mark ("")
        row[row.length - 1] += '"';
        i += 2;
        continue;
      }
      inQuotes = !inQuotes;
    } else if (c === ',' && !inQuotes) {
      row.push('');
    } else if (c === '\n' && !inQuotes) {
      result.push(row);
      row = [''];
    } else {
      row[row.length - 1] += c;
    }
    i++;
  }

  // Push final row if it contains data
  if (row.length > 1 || row[0] !== '') {
    result.push(row);
  }

  return result;
}
