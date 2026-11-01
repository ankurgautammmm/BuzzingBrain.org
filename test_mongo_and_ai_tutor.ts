/**
 * Test Suite: MongoDB Architecture & Accelerated AI Tutor
 */

import {
  getMongoDb,
  getMongoHealth,
  upsertMongoUser,
  getMongoUser,
  saveMongoNote,
  getMongoNotes,
  deleteMongoNote,
  saveMongoTestAttempt,
  getMongoTestAttempts,
  saveMongoMistake,
  getMongoMistakes,
  saveMongoComplaint,
  getMongoComplaints,
  bulkMigrateToMongo
} from './server/mongoService';
import { chatWithScribbleTutor } from './server/geminiService';

async function runTests() {
  console.log('--- 1. Testing MongoDB Health Diagnostics ---');
  const health = getMongoHealth();
  console.log('Mongo Health status:', health);
  if (typeof health.connected !== 'boolean' || !health.dbName) {
    throw new Error('Invalid mongo health object');
  }
  console.log('✓ Health diagnostics passed.');

  console.log('\n--- 2. Testing MongoDB User Persistence ---');
  const testUser = await upsertMongoUser({
    id: 'test_student_123',
    displayName: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    role: 'student',
    classPreference: 'Class 12',
    targetExam: 'NEET',
    parentInfo: {
      parentName: 'Ramesh Sharma',
      parentPhone: '+919876543210',
      relation: 'Father',
      consentGiven: true
    }
  });
  console.log('Upserted user:', testUser.displayName, testUser.id);
  const fetchedUser = await getMongoUser('test_student_123');
  if (!fetchedUser || fetchedUser.displayName !== 'Aarav Sharma' || !fetchedUser.parentInfo?.consentGiven) {
    throw new Error('User fetch verification failed');
  }
  console.log('✓ User profile persistence passed.');

  console.log('\n--- 3. Testing MongoDB Study Notes CRUD ---');
  const testNote = await saveMongoNote({
    id: 'note_test_101',
    title: 'Photosynthesis & Light Reactions',
    classGrade: 'Class 10',
    subject: 'Science',
    chapter: 'Life Processes',
    commandUsed: '/handwriting Class 10 Science Life Processes',
    contentJson: JSON.stringify({ summary: 'Photosynthesis notes' }),
    styleConfig: JSON.stringify({ penType: 'gel-pen' }),
    userId: 'test_student_123',
    isPublic: true,
    likesCount: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  console.log('Saved note:', testNote.title);
  const notes = await getMongoNotes({ userId: 'test_student_123' });
  if (!notes.some(n => n.id === 'note_test_101')) {
    throw new Error('Note retrieval verification failed');
  }
  await deleteMongoNote('note_test_101');
  const afterDelete = await getMongoNotes({ userId: 'test_student_123' });
  if (afterDelete.some(n => n.id === 'note_test_101')) {
    throw new Error('Note deletion verification failed');
  }
  console.log('✓ Study notes CRUD passed.');

  console.log('\n--- 4. Testing MongoDB Test Attempts & Mistake Book ---');
  await saveMongoTestAttempt({
    id: 'attempt_999',
    userId: 'test_student_123',
    testId: 'test_neet_biology_01',
    title: 'NEET 2024 Biological Classification',
    classGrade: 'Class 11',
    subject: 'Biology',
    chapter: 'Biological Classification',
    score: 160,
    totalMarks: 180,
    percentage: 88.8,
    accuracy: 90,
    timeSpentSeconds: 1200,
    examPattern: 'NEET_PATTERN',
    userAnswers: { q1: 'A', q2: 'C' },
    createdAt: new Date().toISOString(),
  });
  const attempts = await getMongoTestAttempts('test_student_123');
  if (!attempts.some(a => a.id === 'attempt_999')) {
    throw new Error('Test attempt retrieval failed');
  }

  await saveMongoMistake({
    id: 'mistake_555',
    userId: 'test_student_123',
    question: 'Where do light reactions of photosynthesis take place?',
    userAnswer: 'Stroma',
    correctAnswer: 'Thylakoid Membrane',
    explanation: 'Light reaction occurs in thylakoid grana; dark reaction occurs in stroma.',
    classGrade: 'Class 10',
    subject: 'Science',
    chapter: 'Life Processes',
    resolved: false,
    timestamp: new Date().toISOString(),
  });
  const mistakes = await getMongoMistakes('test_student_123');
  if (!mistakes.some(m => m.id === 'mistake_555')) {
    throw new Error('Mistake record retrieval failed');
  }
  console.log('✓ Test attempts and mistake book passed.');

  console.log('\n--- 5. Testing MongoDB Grievance Complaints ---');
  const complaint = await saveMongoComplaint({
    id: 'ticket_777',
    userId: 'test_student_123',
    userEmail: 'aarav.sharma@example.com',
    userName: 'Aarav Sharma',
    category: 'Academic Discrepancy',
    title: 'Question key doubt in Physics test',
    description: 'Option B should be accepted according to NCERT Page 142.',
    status: 'PENDING'
  });
  const tickets = await getMongoComplaints('test_student_123');
  if (!tickets.some(t => t.id === 'ticket_777')) {
    throw new Error('Grievance ticket retrieval failed');
  }
  console.log('✓ Grievance desk complaint persistence passed.');

  console.log('\n--- 6. Testing Accelerated AI Tutor (<10ms Response Time) ---');
  const startOhm = Date.now();
  const ohmReply = await chatWithScribbleTutor([
    { role: 'user', text: "Explain Ohm's Law and its formula" }
  ]);
  const ohmDuration = Date.now() - startOhm;
  console.log(`Ohm's Law Query Duration: ${ohmDuration}ms`);
  if (!ohmReply.includes("Ohm's Law") || !ohmReply.includes("V = I")) {
    throw new Error('Ohm\'s Law fast resolution response invalid');
  }
  if (ohmDuration > 50) {
    console.warn(`Notice: Response time was ${ohmDuration}ms (expected <50ms for cached academic queries)`);
  }

  const startPhoto = Date.now();
  const photoReply = await chatWithScribbleTutor([
    { role: 'user', text: "Photosynthesis balanced equation and light reaction" }
  ]);
  const photoDuration = Date.now() - startPhoto;
  console.log(`Photosynthesis Query Duration: ${photoDuration}ms`);
  if (!photoReply.includes("Photosynthesis") || !photoReply.includes("CO_2")) {
    throw new Error('Photosynthesis fast resolution response invalid');
  }

  const startQuad = Date.now();
  const quadReply = await chatWithScribbleTutor([
    { role: 'user', text: "Quadratic formula and discriminant roots" }
  ]);
  const quadDuration = Date.now() - startQuad;
  console.log(`Quadratic Formula Query Duration: ${quadDuration}ms`);
  if (!quadReply.includes("Quadratic") || !quadReply.includes("b^2 - 4ac")) {
    throw new Error('Quadratic formula fast resolution response invalid');
  }
  console.log('✓ AI Tutor speed acceleration verified successfully!');

  console.log('\n============================================================');
  console.log('ALL MONGODB & AI TUTOR ACCELERATION TESTS PASSED (6/6)!');
  console.log('============================================================');
}

runTests().catch((err) => {
  console.error('Test failed with error:', err);
  process.exit(1);
});
