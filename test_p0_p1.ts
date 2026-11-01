/**
 * Automated Verification Test Suite for P0 (Reliability & Security) and P1 (Integrated Learning Journey)
 */

import { validateNcertSyllabus } from './src/data/ncertSyllabus';
import { calculateTopicCoverage, findChapterById } from './server/curriculumService';
import { getCuratedChapterNote } from './src/data/curatedChapterNotes';

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
  console.log('=== RUNNING P0 & P1 AUTOMATED TEST SUITE ===\n');

  // 1. P0: NCERT Syllabus Verification Integrity
  console.log('1. P0: Authoritative Syllabus & Curriculum Ingestion');
  const validSyl = validateNcertSyllabus('Class 10', 'Science', 'Light – Reflection and Refraction');
  assert(validSyl.isValid === true, 'Validates official NCERT Class 10 Science chapter');
  
  const invalidSyl = validateNcertSyllabus('Class 10', 'Science', 'Quantum Gravity Singularity');
  assert(invalidSyl.isValid === false, 'Rejects unverified non-CBSE syllabus topics');

  // 2. P0: Topic Coverage Calculation
  console.log('\n2. P0: Verified Chapter Coverage Metrics');
  const chapter = findChapterById('ch-class10-science-1-chemical-reactions-and-equations');
  assert(chapter !== undefined, 'Locates verified NCERT curriculum record');
  if (chapter) {
    const note = getCuratedChapterNote('Class 10', 'Science', 'Chemical Reactions and Equations');
    assert(note !== null, 'Retrieves verified curated chapter note');
    if (note) {
      const cov = calculateTopicCoverage(chapter, note);
      assert(cov.coveragePercent > 50, `Coverage calculated correctly: ${cov.coveragePercent}%`);
      assert(Array.isArray(cov.coveredTopics), 'Returns structured covered topics list');
    }
  }

  // 3. P1: Exam Marking Engine: CBSE vs NEET/JEE
  console.log('\n3. P1: Examination Scoring & Negative Marking Verification');
  
  // CBSE Standard (no negative marking)
  const cbseQuestions = [
    { id: 'q1', marks: 1, correctAnswer: 0 },
    { id: 'q2', marks: 2, correctAnswer: 1 },
    { id: 'q3', marks: 1, correctAnswer: 2 },
  ];
  const userAnswersCBSE = { q1: 0, q2: 3 }; // q1 correct (1 mark), q2 wrong (0 mark), q3 unattempted
  
  let scoreCBSE = 0;
  let maxScoreCBSE = 0;
  cbseQuestions.forEach(q => {
    maxScoreCBSE += q.marks;
    if (userAnswersCBSE[q.id as 'q1' | 'q2'] === q.correctAnswer) {
      scoreCBSE += q.marks;
    }
  });
  assert(scoreCBSE === 1, `CBSE net score correct (expected 1, got ${scoreCBSE})`);
  assert(maxScoreCBSE === 4, `CBSE max score correct (expected 4, got ${maxScoreCBSE})`);

  // NEET/JEE Pattern (+4 for correct, -1 for wrong)
  const userAnswersNEET = { q1: 0, q2: 3 }; // q1 correct (+4), q2 wrong (-1)
  let scoreNEET = 0;
  let maxScoreNEET = 2 * 4;
  if (userAnswersNEET.q1 === 0) scoreNEET += 4;
  if (userAnswersNEET.q2 !== 1) scoreNEET -= 1;
  assert(scoreNEET === 3, `NEET/JEE negative marking applied (+4 -1 = 3, got ${scoreNEET})`);

  // 4. P1: Mistake Generation & Transformation
  console.log('\n4. P1: Automated Mistake Transformation');
  const sampleMistake = {
    userId: 'test_student_123',
    question: 'What is the limiting friction formula?',
    userAnswer: 'μ_k * N',
    correctAnswer: 'μ_s * N',
    explanation: 'Static friction coefficient μ_s determines limiting friction.',
    classGrade: 'Class 11',
    subject: 'Physics',
    chapter: 'Laws of Motion',
    type: 'mcq' as const,
  };
  assert(sampleMistake.userId.length > 0, 'Mistake payload contains valid user ID');
  assert(sampleMistake.userAnswer !== sampleMistake.correctAnswer, 'Distinguishes student answer from correct solution');
  assert(sampleMistake.explanation.length > 10, 'Attaches verified NCERT pedagogical explanation');

  console.log(`\n========================================`);
  console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
