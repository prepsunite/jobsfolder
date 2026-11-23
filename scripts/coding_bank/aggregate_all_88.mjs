import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { verifyBatch1 } from './batch1_pointers_arrays.mjs';
import { verifyBatch2 } from './batch2_linear_structures.mjs';
import { verifyBatch3 } from './batch3_search_intervals.mjs';
import { verifyBatch4 } from './batch4_hierarchical_structures.mjs';
import { verifyBatch5 } from './batch5_exhaustive_search_dp.mjs';
import { verifyBatch6 } from './batch6_network_graphs.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function getAll88Problems() {
  const p1 = verifyBatch1();
  const p2 = verifyBatch2();
  const p3 = verifyBatch3();
  const p4 = verifyBatch4();
  const p5 = verifyBatch5();
  const p6 = verifyBatch6();

  const all = [...p1, ...p2, ...p3, ...p4, ...p5, ...p6];
  console.log(`\n======================================================`);
  console.log(`TOTAL AGGREGATED PROBLEMS: ${all.length}/88`);
  console.log(`TOTAL VERIFIED TEST CASES: ${all.reduce((acc, p) => acc + p.testCases.length, 0)}/704`);
  console.log(`======================================================\n`);
  return all;
}

if (process.argv[1].endsWith('aggregate_all_88.mjs')) {
  const all = getAll88Problems();
  const targetPath = path.join(__dirname, 'all_88_verified_problems.json');
  fs.writeFileSync(targetPath, JSON.stringify(all, null, 2));
  console.log(`Saved all 88 verified problems to ${targetPath}`);
}
