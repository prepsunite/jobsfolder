import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scripts/coding_bank/all_88_verified_problems.json', 'utf8'));

let sql = `-- Migration: Enrich 88 Campus DSA Coding Problems with 8 Verified Test Cases & Placement Statements
-- Generated at: ${new Date().toISOString()}

BEGIN;

`;

for (const p of data) {
  const statement = `### Problem Statement\n${p.description}\n\n### Input Format\n${p.inputFormat}\n\n### Output Format\n${p.outputFormat}`;
  const testCasesJson = JSON.stringify(p.testCases).replace(/'/g, "''");
  const desc = p.description.replace(/'/g, "''");
  const inFmt = p.inputFormat.replace(/'/g, "''");
  const outFmt = p.outputFormat.replace(/'/g, "''");
  const sampleIn = p.sampleInput.replace(/'/g, "''");
  const sampleOut = p.sampleOutput.replace(/'/g, "''");
  const expl = p.explanation.replace(/'/g, "''");
  const stmt = statement.replace(/'/g, "''");
  const constraintsJson = JSON.stringify(p.constraints).replace(/'/g, "''");

  sql += `UPDATE public.technical_problems
SET
  description = '${desc}',
  statement = '${stmt}',
  input_format = '${inFmt}',
  output_format = '${outFmt}',
  sample_input = '${sampleIn}',
  sample_output = '${sampleOut}',
  explanation = '${expl}',
  constraints = '${constraintsJson}'::jsonb,
  test_cases = '${testCasesJson}'::jsonb,
  updated_at = NOW()
WHERE id = '${p.id}';\n\n`;
}

sql += `COMMIT;\n`;

fs.writeFileSync('database/20261015_enrich_all_88_coding_problems.sql', sql);
console.log(`Generated database/20261015_enrich_all_88_coding_problems.sql (${data.length} UPDATE statements)`);
