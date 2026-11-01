/**
 * Master Verification Test Suite for Buzzing Brain
 * Runs all unit, integration, and security test suites and outputs aggregated metrics.
 */

import { execSync } from 'node:child_process';

interface SuiteResult {
  suiteName: string;
  command: string;
  status: 'PASSED' | 'FAILED';
  durationMs: number;
  output: string;
}

const suites = [
  { name: 'P0 & P1 Core Syllabus & Marking Engine', cmd: 'npx tsx test_p0_p1.ts' },
  { name: 'P05 242-Chapter Tests, Notes & Labs', cmd: 'npx tsx test_p05.ts' },
  { name: 'Content Quality Gate & Coverage Matrix', cmd: 'npx tsx test_content_validation.ts' },
  { name: 'Exam Revision Planner & Leap-Year Engine', cmd: 'npx tsx test_exam_planner.ts' },
  { name: 'Offline Cache & PWA Workbox Compliance', cmd: 'npx tsx test_offline_cache.ts' },
  { name: 'SciLab BioMolecular & Dynamics Suite', cmd: 'npx tsx test_scilab_suite.ts' },
  { name: 'Virtual Practical Academy (Physics/Chem/Bio)', cmd: 'npx tsx test_virtual_practical_academy.ts' },
  { name: 'P02, P03, P04 AI Coach & Guest Auth', cmd: 'npx tsx test_p2_p3_p4.ts' },
  { name: 'MongoDB Architecture & Fast AI Tutor', cmd: 'npx tsx test_mongo_and_ai_tutor.ts' },
];

console.log('================================================================');
console.log('      BUZZING BRAIN — PRINCIPAL ENGINEER MASTER TEST SUITE      ');
console.log('================================================================\n');

const results: SuiteResult[] = [];
let totalPassed = 0;
let totalFailed = 0;

for (const s of suites) {
  const start = Date.now();
  process.stdout.write(`Executing: ${s.name}... `);
  try {
    const stdout = execSync(s.cmd, { stdio: 'pipe', encoding: 'utf-8', timeout: 30000 });
    const duration = Date.now() - start;
    console.log(`✓ PASSED (${duration}ms)`);
    results.push({
      suiteName: s.name,
      command: s.cmd,
      status: 'PASSED',
      durationMs: duration,
      output: stdout,
    });
    totalPassed++;
  } catch (err: any) {
    const duration = Date.now() - start;
    console.log(`✗ FAILED (${duration}ms)`);
    results.push({
      suiteName: s.name,
      command: s.cmd,
      status: 'FAILED',
      durationMs: duration,
      output: err.stdout?.toString() || err.message,
    });
    totalFailed++;
  }
}

console.log('\n================================================================');
console.log(`MASTER TEST SUMMARY: ${totalPassed} SUITES PASSED, ${totalFailed} FAILED`);
console.log('================================================================\n');

for (const r of results) {
  console.log(`• [${r.status}] ${r.suiteName} (${r.durationMs}ms)`);
}

if (totalFailed > 0) {
  console.error('\nOne or more test suites failed.');
  process.exit(1);
} else {
  console.log('\nALL VERIFICATION SUITES EXECUTED AND PASSED CLEANLY.');
  process.exit(0);
}
