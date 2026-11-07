/**
 * Job Description Formatter & Markdown Normalizer.
 *
 * Scraped and ATS-sourced job descriptions often contain mixed Markdown
 * (`### **Heading**`, `**Title**`), raw bullet symbols (`•`, `›`, `▪`),
 * or plain-text duty lines without markdown prefixes.
 *
 * This normalizer converts raw text into clean, standard GitHub Flavored Markdown
 * so it renders with elegant typography, bold styling, section headers,
 * and bullet lists instead of showing literal `*` and `#` symbols.
 */

const ACTION_VERBS = new Set([
  'provide', 'quickly', 'analyze', 'perform', 'review', 'author', 'drive',
  'facilitate', 'responsible', 'ensure', 'have', 'ad-hoc', 'effective',
  'candidate', 'working', 'experience', 'requires', 'associate\'s',
  'bachelor', 'master', 'b.tech', 'b.e', 'm.tech', 'mca', 'degree',
  'strong', 'basic', 'good', 'excellent', 'proven', 'hands-on', 'knowledge',
  'proficiency', 'familiarity', 'understanding', 'ability', 'must', 'should',
  'develop', 'design', 'implement', 'build', 'collaborate', 'maintain',
  'create', 'work', 'lead', 'support', 'write', 'assist', 'manage',
  'coordinate', 'execute', 'monitor', 'optimize', 'troubleshoot', 'deploy',
  'automate', 'architect', 'research', 'participate', 'debug', 'test',
  'stay', 'contribute', 'join', 'deliver', 'own', 'partner', 'scale',
  'familiarity', 'proficiency', 'demonstrated'
]);

export function prepareJobDescriptionMarkdown(raw?: string | null): string {
  if (!raw || !raw.trim()) return '';

  const lines = raw.split('\n');
  const result: string[] = [];
  let inBulletSection = false;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      result.push('');
      inBulletSection = false;
      continue;
    }

    // 1. Clean markdown headers: "### **Company Description**" -> "### Company Description"
    const hashMatch = line.match(/^(#{1,6})\s*(\*{1,3}|_{1,3})?([^*#_]+?)(\*{1,3}|_{1,3})?$/);
    if (hashMatch) {
      result.push(`${hashMatch[1]} ${hashMatch[3].trim()}`);
      inBulletSection = false;
      continue;
    }

    // 2. Lines that are strictly standalone bold subheadings: "**Essential Job Duties**" or "**Primary Function of the Position**"
    // We explicitly avoid key-values like "**Shift:** Day" or "**Salary:** $50k"
    const boldHeadingMatch = line.match(/^\*\*([^*:]+?)\*\*[:]?$/);
    if (
      boldHeadingMatch &&
      boldHeadingMatch[1].length < 80 &&
      !line.includes('. ') &&
      !line.startsWith('**Base') &&
      !line.startsWith('**Shift') &&
      !line.startsWith('**Workplace') &&
      !line.startsWith('**Salary') &&
      !line.startsWith('**Location')
    ) {
      result.push(`#### ${boldHeadingMatch[1].trim()}`);
      inBulletSection = true;
      continue;
    }

    // 3. Plain text colons acting as headings: "Responsibilities:" or "Role Overview:"
    if (/^[A-Za-z0-9\s&/'-]+:$/.test(line) && line.length < 60 && !line.includes('http')) {
      result.push(`### ${line.replace(/[:]+$/, '').trim()}`);
      inBulletSection = true;
      continue;
    }

    // 4. Short ALL CAPS section header: "MANDATORY NOTICES" or "QUALIFICATIONS"
    if (
      line.length <= 45 &&
      !line.endsWith('.') &&
      line.toUpperCase() === line &&
      /[A-Z]{3,}/.test(line) &&
      !line.startsWith('$') &&
      !line.includes(':')
    ) {
      result.push(`### ${line.trim()}`);
      inBulletSection = false;
      continue;
    }

    // 5. Existing bullet indicators (•, ›, ▪, ▫, –, +, *, -)
    if (/^[•›▪▫–\+]\s*(.+)/.test(line)) {
      const clean = line.replace(/^[•›▪▫–\+]\s*/, '').trim();
      result.push(`- ${clean}`);
      inBulletSection = true;
      continue;
    }

    if (/^[\-\*]\s+(.+)/.test(line)) {
      result.push(line);
      inBulletSection = true;
      continue;
    }

    // 6. Numbered items: "1. something" or "1) something"
    if (/^\d+[\.\)]\s+(.+)/.test(line)) {
      result.push(line);
      inBulletSection = true;
      continue;
    }

    // 7. Action verb / qualification lines under a section that should be bullet items
    const firstWord = line.toLowerCase().split(/[\s,]+/)[0];
    if (
      (inBulletSection || ACTION_VERBS.has(firstWord)) &&
      ACTION_VERBS.has(firstWord) &&
      line.length > 8 &&
      !line.endsWith('?') &&
      !line.startsWith('http') &&
      !line.startsWith('**')
    ) {
      result.push(`- ${line}`);
      inBulletSection = true;
      continue;
    }

    inBulletSection = false;
    result.push(line);
  }

  return result.join('\n');
}
