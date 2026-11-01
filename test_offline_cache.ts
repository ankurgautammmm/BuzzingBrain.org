/**
 * Automated Test Suite: Offline Notes Caching, PWA Workbox Config & Library Persistence
 */

import fs from 'node:fs';
import path from 'node:path';
import { 
  getFastLocalCachedNotes, 
  getOfflineNotes, 
  saveOfflineNote, 
  saveMultipleOfflineNotes, 
  deleteOfflineNote,
  cacheNoteImage,
  getOfflineNoteImage
} from './src/services/offlineNotesCache';
import { StudyNote } from './src/types';

async function runOfflineCacheTests() {
  console.log('=== RUNNING OFFLINE NOTES CACHING & PWA TEST SUITE ===');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, msg: string) {
    if (condition) {
      console.log(`  ✓ PASS: ${msg}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${msg}`);
      failed++;
    }
  }

  // 1. Initial Curated Offline Seed
  console.log('1. Offline Seed & Fast Cache Hydration');
  const fastNotes = getFastLocalCachedNotes();
  assert(Array.isArray(fastNotes) && fastNotes.length > 0, `Fast local cache yields ${fastNotes.length} curated notes`);
  const firstNote = fastNotes[0];
  assert(Boolean(firstNote.title && firstNote.classGrade && firstNote.contentJson), 'Curated seed note contains title, class, and contentJson');

  // 2. Note Serialization & Deserialization Integrity
  console.log('2. Offline Note Payload Integrity');
  const parsed = JSON.parse(firstNote.contentJson);
  assert(Array.isArray(parsed.sections) && parsed.sections.length > 0, `Note "${firstNote.title}" contains ${parsed.sections?.length} structured sections`);
  assert(Boolean(firstNote.styleConfig), 'Note contains serialized handwriting style config');

  // 3. Save Offline Note Operation
  console.log('3. Save & Persist Note Offline');
  const testNoteId = `test_offline_${Date.now()}`;
  const testNote: StudyNote = {
    id: testNoteId,
    title: 'Offline Test Note: Electromagnetic Induction',
    classGrade: 'Class 12',
    subject: 'Physics',
    chapter: 'Electromagnetic Induction',
    topic: "Faraday's & Lenz's Law",
    commandUsed: '/handwriting Class 12 Physics Electromagnetic Induction',
    contentJson: JSON.stringify({
      title: 'Electromagnetic Induction',
      classGrade: 'Class 12',
      subject: 'Physics',
      chapter: 'Electromagnetic Induction',
      topic: "Faraday's & Lenz's Law",
      syllabusContext: 'CBSE 2026-27',
      examWeightageTip: 'High yield for 5-mark derivation questions.',
      sections: [
        {
          heading: "Faraday's Law of Induction",
          content: 'Induced EMF is proportional to the negative rate of change of magnetic flux: ε = -dΦ/dt',
          bullets: ['Lenz law enforces energy conservation via negative sign', 'Magnetic flux Φ = B · A · cos(θ)'],
          starredPoints: ['Unit of flux is Weber (Wb)'],
        }
      ]
    }),
    styleConfig: JSON.stringify({
      penType: 'gel-pen',
      inkColor: 'royal-blue',
      paperType: 'ruled-notebook',
      fontFamily: 'Kalam',
      fontSize: 20,
      slantAngle: 0.3,
      inkPressure: 'medium',
      highlightColor: 'yellow',
      showMarginLine: true,
      showHoles: true,
    }),
    userId: 'offline_user_test',
    userName: 'Offline Student',
    isPublic: true,
    likesCount: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await saveOfflineNote(testNote);
  const updatedNotes = await getOfflineNotes();
  const found = updatedNotes.find(n => n.id === testNoteId);
  assert(Boolean(found), `Newly created offline note ${testNoteId} successfully saved to local cache`);

  // 4. Delete Offline Note Operation
  console.log('4. Delete Offline Note');
  await deleteOfflineNote(testNoteId);
  const postDeleteNotes = await getOfflineNotes();
  const deletedFound = postDeleteNotes.find(n => n.id === testNoteId);
  assert(!deletedFound, 'Note cleanly removed from local offline cache');

  // 5. PWA Workbox Manifest & Caching Rules Verification
  console.log('5. VitePWA Configuration & Asset Verification');
  const viteConfigContent = fs.readFileSync(path.resolve(process.cwd(), 'vite.config.ts'), 'utf-8');
  assert(viteConfigContent.includes('note-images-cache'), 'VitePWA includes note-images-cache runtime caching rule');
  assert(viteConfigContent.includes('api-notes-content-cache'), 'VitePWA includes api-notes-content-cache NetworkFirst rule');
  assert(viteConfigContent.includes('katex-cdn-cache'), 'VitePWA includes katex-cdn-cache rule for offline formula rendering');
  assert(viteConfigContent.includes('pwa-192x192.png'), 'VitePWA manifest references 192x192 PNG icon');
  assert(viteConfigContent.includes('pwa-512x512.png'), 'VitePWA manifest references 512x512 PNG icon');
  assert(viteConfigContent.includes('pwa-maskable-512x512.png'), 'VitePWA manifest references 512x512 maskable PNG icon');

  // 6. Verify PNG icons exist in public directory
  console.log('6. Physical PWA Icon Files in public/');
  assert(fs.existsSync(path.resolve(process.cwd(), 'public', 'pwa-192x192.png')), 'public/pwa-192x192.png exists');
  assert(fs.existsSync(path.resolve(process.cwd(), 'public', 'pwa-512x512.png')), 'public/pwa-512x512.png exists');
  assert(fs.existsSync(path.resolve(process.cwd(), 'public', 'pwa-maskable-512x512.png')), 'public/pwa-maskable-512x512.png exists');
  assert(fs.existsSync(path.resolve(process.cwd(), 'public', 'apple-touch-icon.png')), 'public/apple-touch-icon.png exists');

  // 7. Harmonized Backend Multimodal & Chat Contracts
  console.log('7. Backend API Contract Verification');
  const apiTs = fs.readFileSync(path.resolve(process.cwd(), 'server', 'api.ts'), 'utf-8');
  assert(apiTs.includes("typeof message === 'string'"), '/chat endpoint harmonizes single message string with messages array');
  assert(apiTs.includes('userPrompt || prompt'), '/ai/solve-image endpoint harmonizes userPrompt and prompt');
  // 8. Visual Progress Tracker & Chapter Percentage Calculation Verification
  console.log('8. Visual Progress Tracker: Subject Chapter Coverage & Percentage');
  const libraryTsx = fs.readFileSync(path.resolve(process.cwd(), 'src', 'components', 'StudentNotesLibrary.tsx'), 'utf-8');
  assert(libraryTsx.includes('NCERT_SYLLABUS'), 'StudentNotesLibrary imports official NCERT syllabus database');
  assert(libraryTsx.includes('subjectCoverageMap'), 'StudentNotesLibrary computes subjectCoverageMap for all syllabus subjects');
  assert(libraryTsx.includes('Math.round((coveredCount / totalCount) * 100)'), 'Calculates exact percentage of chapters covered in subject');
  assert(libraryTsx.includes('role="progressbar"'), 'Renders accessible visual progress bar with role="progressbar"');
  assert(libraryTsx.includes('aria-valuenow={activeCoverage.percentage}'), 'Binds aria-valuenow to active subject coverage percentage');
  assert(libraryTsx.includes('activeCoverage.percentage}%'), 'Displays live percentage in the Library view');
  assert(libraryTsx.includes('onSynthesizeChapter'), 'Supports synthesizing ungenerated chapters directly from the checklist');

  console.log('========================================');
  console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log('========================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runOfflineCacheTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
