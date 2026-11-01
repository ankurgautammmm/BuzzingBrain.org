import fs from 'fs';
import path from 'path';
import { NCERT_SYLLABUS, NCERTChapterItem } from '../src/data/ncertSyllabus';
import { COMPREHENSIVE_CHAPTER_NOTES, getCuratedChapterNote } from '../src/data/curatedChapterNotes';
import { generateHandwrittenNotes, parseHandwritingCommand } from './geminiService';
import { NoteContentPayload } from '../src/types';

export interface CurriculumRecord {
  curriculumId: string;
  board: string;
  academicSession: string;
  classes: string[];
  verificationStatus: 'verified' | 'provisional' | 'needs_review';
  sourceUrl: string;
  version: string;
  lastVerifiedDate: string;
}

export interface ChapterDetails {
  chapterId: string;
  chapterNumber: number;
  title: string;
  classGrade: string;
  subject: string;
  unit: string;
  keyTopics: string[];
  learningObjectives: string[];
  ncertBookCode?: string;
  verificationStatus: 'verified' | 'provisional';
  curriculumId: string;
}

export interface GenerationJob {
  jobId: string;
  chapterId: string;
  classGrade: string;
  subject: string;
  chapterTitle: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  retryCount: number;
  createdAt: string;
  updatedAt: string;
  error?: string;
  noteId?: string;
}

export interface StudentProgressRecord {
  userId: string;
  notesId: string;
  chapterId: string;
  completedSections: number[];
  bookmarks: number[];
  lastVisitedPosition: number;
  totalSections: number;
  percentComplete: number;
  updatedAt: string;
}

// In-Memory Curricula Store with 2026-27 Official CBSE NCERT Baselines
export const CURRICULA_REGISTRY: Record<string, CurriculumRecord> = {
  'cbse-ncert-2026-27': {
    curriculumId: 'cbse-ncert-2026-27',
    board: 'CBSE',
    academicSession: '2026-27',
    classes: ['Class 9', 'Class 10', 'Class 11', 'Class 12'],
    verificationStatus: 'verified',
    sourceUrl: 'https://ncert.nic.in/textbook.php',
    version: '2026-27.v1',
    lastVerifiedDate: '2026-04-01',
  },
};

// In-Memory Generation Jobs Store
export const GENERATION_JOBS: Map<string, GenerationJob> = new Map();

// Saved Notes & Progress disk storage paths
const DATA_DIR = path.resolve(process.cwd(), 'data');
const PERSISTED_NOTES_FILE = path.join(DATA_DIR, 'persisted_notes.json');
const STUDENT_PROGRESS_FILE = path.join(DATA_DIR, 'student_progress.json');

// Persistent Stores
export const PERSISTED_NOTES: Map<string, { note: NoteContentPayload; metadata: any }> = new Map();
export const STUDENT_PROGRESS: Map<string, StudentProgressRecord> = new Map();

// Load disk stores on boot
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(PERSISTED_NOTES_FILE)) {
    const raw = fs.readFileSync(PERSISTED_NOTES_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    for (const [k, v] of Object.entries(parsed)) {
      PERSISTED_NOTES.set(k, v as any);
    }
  }

  if (fs.existsSync(STUDENT_PROGRESS_FILE)) {
    const raw = fs.readFileSync(STUDENT_PROGRESS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    for (const [k, v] of Object.entries(parsed)) {
      STUDENT_PROGRESS.set(k, v as any);
    }
  }
} catch (err) {
  console.warn('[Curriculum Service] Notice during disk storage init:', err);
}

// Function to save stores to disk safely
export function savePersistedNotesToDisk() {
  try {
    const obj = Object.fromEntries(PERSISTED_NOTES.entries());
    fs.writeFileSync(PERSISTED_NOTES_FILE, JSON.stringify(obj, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[Curriculum Service] Error saving notes to disk:', err);
  }
}

export function saveStudentProgressToDisk() {
  try {
    const obj = Object.fromEntries(STUDENT_PROGRESS.entries());
    fs.writeFileSync(STUDENT_PROGRESS_FILE, JSON.stringify(obj, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[Curriculum Service] Error saving progress to disk:', err);
  }
}

// Initialize Persisted Notes from curated repository if empty
for (const [key, note] of Object.entries(COMPREHENSIVE_CHAPTER_NOTES)) {
  const noteId = `note-${key.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  if (!PERSISTED_NOTES.has(noteId)) {
    PERSISTED_NOTES.set(noteId, {
      note,
      metadata: {
        noteId,
        curriculumId: 'cbse-ncert-2026-27',
        classGrade: note.classGrade,
        subject: note.subject,
        chapter: note.chapter,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        revision: 1,
        isVerified: true,
      },
    });
  }
}

/**
 * Generate a consistent chapter ID from class, subject, and chapter
 */
export function buildChapterId(classGrade: string, subject: string, chapterNumber: number, title: string): string {
  const cleanCls = classGrade.toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanSubj = subject.toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanTitle = title.toLowerCase().slice(0, 25).replace(/[^a-z0-9]/g, '-');
  return `ch-${cleanCls}-${cleanSubj}-${chapterNumber}-${cleanTitle}`;
}

/**
 * Retrieve all chapters across the curriculum
 */
export function getAllCurriculumChapters(classFilter?: string, subjectFilter?: string): ChapterDetails[] {
  const list: ChapterDetails[] = [];

  for (const [cls, subjects] of Object.entries(NCERT_SYLLABUS)) {
    if (classFilter && cls.toLowerCase() !== classFilter.toLowerCase()) continue;

    for (const [subj, chapters] of Object.entries(subjects)) {
      if (subjectFilter && subj.toLowerCase() !== subjectFilter.toLowerCase()) continue;

      chapters.forEach((ch: NCERTChapterItem) => {
        list.push({
          chapterId: buildChapterId(cls, subj, ch.number, ch.name),
          chapterNumber: ch.number,
          title: ch.name,
          classGrade: cls,
          subject: subj,
          unit: ch.unit,
          keyTopics: ch.keyTopics,
          learningObjectives: [
            `Understand fundamental principles of ${ch.name}`,
            `Master NCERT definitions, equations and derivations`,
            `Apply concepts to solve 5-mark CBSE Board numericals and exemplars`,
          ],
          ncertBookCode: ch.ncertBookCode,
          verificationStatus: 'verified',
          curriculumId: 'cbse-ncert-2026-27',
        });
      });
    }
  }

  return list;
}

/**
 * Find chapter by chapterId
 */
export function findChapterById(chapterId: string): ChapterDetails | null {
  const all = getAllCurriculumChapters();
  return all.find((c) => c.chapterId === chapterId) || null;
}

/**
 * Evaluate topic coverage between official syllabus topics and note sections
 */
export function calculateTopicCoverage(
  chapter: ChapterDetails,
  note: NoteContentPayload
): {
  totalTopics: number;
  coveredTopics: string[];
  missingTopics: string[];
  coveragePercent: number;
} {
  const coveredTopics: string[] = [];
  const missingTopics: string[] = [];

  const noteText = [
    note.title,
    note.topic,
    ...note.sections.map((s) => s.heading + ' ' + s.subheading + ' ' + s.content + ' ' + (s.bullets || []).join(' ')),
  ].join(' ').toLowerCase();

  chapter.keyTopics.forEach((topic) => {
    // Check if key words from topic are present in note
    const words = topic.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
    const hasMatch = words.some((w) => noteText.includes(w));

    if (hasMatch) {
      coveredTopics.push(topic);
    } else {
      missingTopics.push(topic);
    }
  });

  const total = chapter.keyTopics.length || 1;
  const coveragePercent = Math.round((coveredTopics.length / total) * 100);

  return {
    totalTopics: chapter.keyTopics.length,
    coveredTopics,
    missingTopics,
    coveragePercent,
  };
}

/**
 * Start or retrieve a notes generation job
 */
export async function startNotesGenerationJob(chapter: ChapterDetails): Promise<GenerationJob> {
  // Check if job already exists or completed
  const existingJob = Array.from(GENERATION_JOBS.values()).find(
    (j) => j.chapterId === chapter.chapterId && (j.status === 'completed' || j.status === 'in_progress')
  );

  if (existingJob) {
    return existingJob;
  }

  const jobId = `job-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const job: GenerationJob = {
    jobId,
    chapterId: chapter.chapterId,
    classGrade: chapter.classGrade,
    subject: chapter.subject,
    chapterTitle: chapter.title,
    status: 'in_progress',
    progress: 25,
    retryCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  GENERATION_JOBS.set(jobId, job);

  // Asynchronously generate note
  (async () => {
    try {
      // Step 1: Check curated repository first
      const curated = getCuratedChapterNote(chapter.classGrade, chapter.subject, chapter.title);
      let finalNote: NoteContentPayload = curated;

      job.progress = 65;
      job.updatedAt = new Date().toISOString();

      // If needed, execute AI pipeline
      if (!curated || curated.sections.length === 0) {
        const cmd = `/handwriting ${chapter.title} --class ${chapter.classGrade.replace('Class ', '')} --detailed`;
        const parsed = parseHandwritingCommand(cmd);
        const generated = await generateHandwrittenNotes(parsed);
        finalNote = generated.noteContent;
      }

      const noteId = `note-${chapter.chapterId}`;
      PERSISTED_NOTES.set(noteId, {
        note: finalNote,
        metadata: {
          noteId,
          chapterId: chapter.chapterId,
          classGrade: chapter.classGrade,
          subject: chapter.subject,
          chapter: chapter.title,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          revision: 1,
          isVerified: true,
        },
      });

      job.status = 'completed';
      job.progress = 100;
      job.noteId = noteId;
      job.updatedAt = new Date().toISOString();
    } catch (err) {
      console.error(`[Curriculum Job] Error generating notes for ${chapter.title}:`, err);
      job.status = 'failed';
      job.error = err instanceof Error ? err.message : String(err);
      job.updatedAt = new Date().toISOString();
    }
  })();

  return job;
}
