import { validateNoteContent, scanForPlaceholders, checkMandatorySections, buildChapterCoverageMatrix } from './src/utils/contentValidation';
import { COMPREHENSIVE_CHAPTER_NOTES, getCuratedChapterNote } from './src/data/curatedChapterNotes';

console.log('=== BUZZINGBRAIN CONTENT VALIDATION & QUALITY GATE TEST SUITE ===\n');

let passed = 0;
let failed = 0;

function assert(cond: boolean, msg: string) {
  if (cond) {
    console.log(`  ✓ PASS: ${msg}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${msg}`);
    failed++;
  }
}

// 1. Placeholder Phrase Detection
console.log('1. Placeholder Phrase Detection');
const cleanNote = getCuratedChapterNote('Class 10', 'Science', 'Chemical Reactions and Equations');
const cleanReport = validateNoteContent(cleanNote);
assert(cleanReport.detectedPlaceholders.length === 0, 'Clean curated note has 0 detected placeholders');
assert(cleanReport.qualityScore >= 90, `Clean curated note quality score is high: ${cleanReport.qualityScore}`);

const badNote = {
  ...cleanNote,
  title: 'Test Guaranteed 3-mark Question Chapter',
  sections: [
    {
      heading: 'Core Concept',
      content: 'Standard governing formula with SI units will be shown.',
      importantFormulas: ['Standard governing formula with dimensional notation']
    }
  ]
};
const badReport = validateNoteContent(badNote as any);
assert(badReport.detectedPlaceholders.length >= 2, `Bad note detected placeholders: count ${badReport.detectedPlaceholders.length}`);
assert(badReport.verificationTier === 'NEEDS_REVISION', 'Bad note classified as NEEDS_REVISION');
assert(badReport.isValid === false, 'Bad note rejected by quality gate (isValid === false)');

// 2. Mandatory Section Verification (Phase 4)
console.log('\n2. Mandatory Section Verification');
const { missing, passed: passedSections } = checkMandatorySections(cleanNote);
assert(missing.length === 0, `Clean note has 0 missing mandatory sections: ${missing.join(', ')}`);
assert(passedSections.includes('Step-by-Step Worked Problem'), 'Includes worked problem verification');
assert(passedSections.includes('Official NCERT Source Citation'), 'Includes official source citation verification');

// 3. Chapter Coverage Matrix Comparison
console.log('\n3. Chapter Coverage Matrix Comparison');
const { matrix, summary } = buildChapterCoverageMatrix(COMPREHENSIVE_CHAPTER_NOTES);
assert(summary.totalSyllabusChapters === 242, `Total syllabus chapters audited: ${summary.totalSyllabusChapters} (expected 242)`);
assert(summary.missingCount === 0, '0 missing chapters in syllabus coverage');
assert(summary.completeCuratedCount >= 6, `Complete curated chapters count: ${summary.completeCuratedCount}`);
assert(summary.placeholderOutlineCount > 0, `AI synthesized outlines count: ${summary.placeholderOutlineCount}`);
assert(matrix.length === 242, `Matrix rows count matches 242: ${matrix.length}`);

// Check specific curriculum records
const cellRecord = matrix.find(r => r.classGrade === 'Class 9' && r.subject === 'Science' && r.officialTitle.includes('Organisation in Living Systems'));
assert(cellRecord !== undefined && cellRecord.status === 'complete', 'Class 9 Cell matched as complete verified chapter');

const quadRecord = matrix.find(r => r.classGrade === 'Class 10' && r.subject === 'Mathematics' && r.officialTitle.includes('Quadratic Equations'));
assert(quadRecord !== undefined && quadRecord.status === 'complete', 'Class 10 Quadratic Equations matched as complete verified chapter');

console.log(`\n========================================`);
console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
console.log(`========================================`);

if (failed > 0) process.exit(1);
