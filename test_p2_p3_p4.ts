/**
 * Automated Verification Suite for P02 (AI Learning Coach), P03 (Notes & Practice), P04 (Retention & PWA)
 * and Resilient Guest Authentication.
 */

import fs from 'node:fs';
import path from 'node:path';
import { generateHandwrittenNotes, parseHandwritingCommand } from './server/geminiService';
import { getCuratedChapterNote, COMPREHENSIVE_CHAPTER_NOTES } from './src/data/curatedChapterNotes';
import { createSyntheticGuestUser } from './src/services/firebase';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('=== RUNNING P02, P03, P04 & AUTH AUTOMATED TEST SUITE ===\n');

  // 1. P03 Constraint: Notes must ONLY contain the description of the topic
  console.log('1. P03: Topic Description Constraint Verification (AI Generation)');
  const cmd = parseHandwritingCommand('/handwriting class:10 subject:Science chapter:"Chemical Reactions and Equations"');
  const result = await generateHandwrittenNotes(cmd);
  
  assert(result.noteContent !== undefined, 'Generated note payload exists');
  assert(result.noteContent.sections.length > 0, 'Note contains structured sections');

  let allSectionsAreDescriptions = true;
  let hasExtraneousClutter = false;

  for (const s of result.noteContent.sections) {
    if (!s.heading || !s.content) {
      allSectionsAreDescriptions = false;
    }
    // Check that sections do NOT contain non-description clutter
    if ((s as any).warningMistakes || (s as any).postItNote || (s as any).starredPoints) {
      hasExtraneousClutter = true;
    }
  }

  assert(allSectionsAreDescriptions, 'All note sections contain pure heading and topic description content');
  assert(!hasExtraneousClutter, 'Notes strictly omit warning traps, sticky note hacks, and extraneous clutter');

  // 1b. P03: Topic Description Constraint on Curated Repository Notes
  console.log('\n1b. P03: Topic Description Constraint Verification (Curated Chapter Notes)');
  const curatedNote = getCuratedChapterNote('Class 10', 'Science', 'Chemical Reactions and Equations');
  assert(curatedNote !== undefined, 'Curated note exists');
  assert(curatedNote.title.length > 0, 'Curated note title exists');
  for (const s of curatedNote.sections) {
    assert(Boolean(s.heading && s.content), `Section "${s.heading}" has pure topic description content`);
  }

  // 2. P04: PWA Compliance and Asset Verification
  console.log('\n2. P04: PWA Manifest & Service Worker Verification');
  const distManifestPath = path.resolve(process.cwd(), 'dist', 'manifest.webmanifest');
  const distSwPath = path.resolve(process.cwd(), 'dist', 'sw.js');
  const distServerPath = path.resolve(process.cwd(), 'dist', 'server.mjs');

  assert(fs.existsSync(distManifestPath), 'Generated PWA manifest exists at dist/manifest.webmanifest');
  if (fs.existsSync(distManifestPath)) {
    const manifestJson = JSON.parse(fs.readFileSync(distManifestPath, 'utf8'));
    assert(manifestJson.name.includes('Buzzing Brain'), 'PWA manifest contains official app name');
    assert(manifestJson.display === 'standalone', 'PWA display mode is standalone');
    assert(Array.isArray(manifestJson.icons) && manifestJson.icons.length >= 2, 'PWA manifest includes multi-resolution icons');
  }

  assert(fs.existsSync(distSwPath), 'Generated Workbox Service Worker exists at dist/sw.js');
  assert(fs.existsSync(distServerPath), 'Generated server bundle exists at dist/server.mjs');

  // 3. P02: AI Learning Coach & Syllabus Grounding
  console.log('\n3. P02: AI Learning Coach & Command Parser Verification');
  assert(typeof parseHandwritingCommand === 'function', 'parseHandwritingCommand is available for natural language coaching');
  const mathCmd = parseHandwritingCommand('make notes for class 10 quadratic equations');
  assert(mathCmd.classGrade === 'Class 10', 'Correctly mapped class grade for coaching prompt');
  assert(mathCmd.subject === 'Mathematics', 'Correctly mapped subject for coaching prompt');
  assert(mathCmd.chapter.toLowerCase().includes('quadratic'), 'Correctly mapped topic/chapter');

  // 4. Auth & Resilient Guest Session
  console.log('\n4. Auth: Resilient Guest Student Session Verification');
  const guestUser = createSyntheticGuestUser('Aarav Sharma');
  assert(guestUser.uid.startsWith('guest_'), 'Synthetic guest user has valid guest UID format');
  assert(guestUser.displayName === 'Aarav Sharma', 'Guest user has assigned student display name');
  assert(guestUser.isAnonymous === true, 'Guest user is marked anonymous');
  const token = await guestUser.getIdToken();
  assert(Boolean(token), 'Guest user yields valid token for authenticated app usage');

  console.log(`\n========================================`);
  console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
  process.exit(0);
}

runTests().catch(err => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
