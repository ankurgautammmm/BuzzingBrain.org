/**
 * Buzzing Brain — MongoDB Primary Storage Architecture
 *
 * Full-Stack MongoDB Database Service for persistent storage of:
 * - User Profiles & Roles (Student, Teacher, Admin, Parents Info, Avatars)
 * - Study Notes & Handwritten Register Documents
 * - Test Attempts & Performance Scorecards
 * - Mistake Book & Remedial Practice Journal
 * - Grievance Desk Complaints & Resolution History
 * - Academic Progress & Class Attendance Records
 *
 * Connects via environment variable MONGODB_URI or MONGO_URL.
 * Provides resilient connection pooling and in-memory cache fallback.
 */

import { MongoClient, Db, Collection, ObjectId } from 'mongodb';

// Environment variable resolution
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URL || null;
const DB_NAME = process.env.MONGODB_DB_NAME || 'buzzing_brain';

let client: MongoClient | null = null;
let dbInstance: Db | null = null;
let isConnecting = false;
let connectionError: string | null = null;
let lastConnectionAttemptTime = 0;
const RETRY_COOLDOWN_MS = 20000;

// In-memory fallback stores when MongoDB URI is awaiting configuration
const inMemoryStore = {
  users: new Map<string, any>(),
  notes: new Map<string, any>(),
  test_attempts: new Map<string, any>(),
  mistakes: new Map<string, any>(),
  complaints: new Map<string, any>(),
  academic_progress: new Map<string, any>(),
  lab_journals: new Map<string, any>(),
  experiment_progress: new Map<string, any>(),
};

/**
 * Initializes and returns the MongoDB database connection
 */
export async function getMongoDb(): Promise<Db | null> {
  if (dbInstance) {
    return dbInstance;
  }

  if (!MONGODB_URI) {
    connectionError = 'MONGODB_URI or MONGO_URL not set in environment. Resilient fallback storage active.';
    return null;
  }

  // Prevent connection hammering when cluster is offline or undergoing DNS change
  if (Date.now() - lastConnectionAttemptTime < RETRY_COOLDOWN_MS && !dbInstance) {
    return null;
  }

  if (isConnecting) {
    let attempts = 0;
    while (isConnecting && attempts < 20) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      attempts++;
    }
    if (dbInstance) return dbInstance;
  }

  isConnecting = true;
  lastConnectionAttemptTime = Date.now();
  connectionError = null;

  try {
    const mongoClient = new MongoClient(MONGODB_URI, {
      connectTimeoutMS: 3000,
      serverSelectionTimeoutMS: 3000,
      maxPoolSize: 20,
    });

    await mongoClient.connect();
    client = mongoClient;
    dbInstance = mongoClient.db(DB_NAME);

    console.log(`[MongoDB] Successfully connected to database: ${DB_NAME}`);
    
    // Ensure primary indexes
    await ensureMongoIndexes(dbInstance);

    return dbInstance;
  } catch (err: any) {
    connectionError = err.message || 'Failed to connect to MongoDB';
    console.warn(`[MongoDB] Connection notice (${connectionError}). Resilient fallback storage is active.`);
    return null;
  } finally {
    isConnecting = false;
  }
}

/**
 * Ensure collection indexes for fast lookup and uniqueness
 */
async function ensureMongoIndexes(db: Db) {
  try {
    await db.collection('users').createIndex({ email: 1 });
    await db.collection('users').createIndex({ id: 1 }, { unique: true, sparse: true });
    await db.collection('notes').createIndex({ userId: 1 });
    await db.collection('notes').createIndex({ classGrade: 1, subject: 1, chapter: 1 });
    await db.collection('test_attempts').createIndex({ userId: 1, createdAt: -1 });
    await db.collection('mistakes').createIndex({ userId: 1, resolved: 1 });
    await db.collection('complaints').createIndex({ userId: 1, createdAt: -1 });
    await db.collection('lab_journals').createIndex({ id: 1 }, { unique: true, sparse: true });
    await db.collection('lab_journals').createIndex({ userId: 1, createdAt: -1 });
    await db.collection('experiment_progress').createIndex({ id: 1 }, { unique: true, sparse: true });
    await db.collection('experiment_progress').createIndex({ userId: 1, experimentId: 1 });
  } catch (idxErr) {
    console.warn('[MongoDB] Index creation notice:', idxErr);
  }
}

/**
 * Checks current connection health and metadata
 */
export function getMongoHealth(): {
  connected: boolean;
  dbName: string;
  uriConfigured: boolean;
  error: string | null;
  recordCounts: {
    users: number;
    notes: number;
    test_attempts: number;
    mistakes: number;
    complaints: number;
    lab_journals: number;
    experiment_progress: number;
  };
} {
  const isConnected = Boolean(dbInstance);
  return {
    connected: isConnected,
    dbName: DB_NAME,
    uriConfigured: Boolean(process.env.MONGODB_URI || process.env.MONGO_URL),
    error: connectionError,
    recordCounts: {
      users: inMemoryStore.users.size,
      notes: inMemoryStore.notes.size,
      test_attempts: inMemoryStore.test_attempts.size,
      mistakes: inMemoryStore.mistakes.size,
      complaints: inMemoryStore.complaints.size,
      lab_journals: inMemoryStore.lab_journals.size,
      experiment_progress: inMemoryStore.experiment_progress.size,
    },
  };
}

// ============================================================================
// 1. USER PROFILES COLLECTION
// ============================================================================

export interface MongoUserProfile {
  id: string; // Firebase UID or local ID
  displayName: string;
  email: string;
  photoURL?: string;
  role: 'student' | 'teacher' | 'admin';
  classPreference?: string;
  className?: string;
  targetExam?: string;
  mobileNumber?: string;
  age?: number | string;
  sex?: string;
  avatarId?: string;
  customAvatarUrl?: string;
  parentInfo?: {
    parentName?: string;
    parentPhone?: string;
    relation?: string;
    preferredCommunication?: string;
    consentGiven?: boolean;
  };
  xp?: number;
  streakDays?: number;
  acceptedTerms?: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function upsertMongoUser(userData: Partial<MongoUserProfile> & { id: string }): Promise<MongoUserProfile> {
  const now = new Date().toISOString();
  const db = await getMongoDb();

  const userDoc: MongoUserProfile = {
    id: userData.id,
    displayName: userData.displayName || 'Student Scholar',
    email: userData.email || '',
    photoURL: userData.photoURL,
    role: (userData.role as any) || 'student',
    classPreference: userData.classPreference || 'Class 11',
    className: userData.className || userData.classPreference || 'Class 11',
    targetExam: userData.targetExam || 'CBSE',
    mobileNumber: userData.mobileNumber || '',
    age: userData.age,
    sex: userData.sex,
    avatarId: userData.avatarId || 'scholar',
    customAvatarUrl: userData.customAvatarUrl,
    parentInfo: userData.parentInfo,
    xp: userData.xp ?? 250,
    streakDays: userData.streakDays ?? 1,
    acceptedTerms: userData.acceptedTerms ?? true,
    createdAt: userData.createdAt || now,
    updatedAt: now,
  };

  // Always update in-memory cache for ultra-fast access
  inMemoryStore.users.set(userData.id, userDoc);

  if (db) {
    try {
      await db.collection('users').updateOne(
        { id: userData.id },
        { $set: userDoc },
        { upsert: true }
      );
    } catch (err) {
      console.warn('[MongoDB] upsertUser write notice:', err);
    }
  }

  return userDoc;
}

export async function getMongoUser(userId: string): Promise<MongoUserProfile | null> {
  const db = await getMongoDb();
  if (db) {
    try {
      const doc = await db.collection('users').findOne({ id: userId });
      if (doc) {
        delete (doc as any)._id;
        inMemoryStore.users.set(userId, doc as any);
        return doc as unknown as MongoUserProfile;
      }
    } catch (err) {
      console.warn('[MongoDB] getMongoUser error:', err);
    }
  }

  return inMemoryStore.users.get(userId) || null;
}

export async function getAllMongoUsers(role?: string): Promise<MongoUserProfile[]> {
  const db = await getMongoDb();
  if (db) {
    try {
      const filter = role ? { role } : {};
      const docs = await db.collection('users').find(filter).toArray();
      return docs.map((d) => {
        delete (d as any)._id;
        return d as unknown as MongoUserProfile;
      });
    } catch (err) {
      console.warn('[MongoDB] getAllMongoUsers error:', err);
    }
  }

  const all = Array.from(inMemoryStore.users.values());
  return role ? all.filter((u) => u.role === role) : all;
}

// ============================================================================
// 2. STUDY NOTES COLLECTION
// ============================================================================

export interface MongoStudyNote {
  id: string;
  title: string;
  classGrade: string;
  subject: string;
  chapter: string;
  topic?: string;
  commandUsed: string;
  contentJson: string;
  styleConfig: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  isPublic: boolean;
  likesCount: number;
  createdAt: string;
  updatedAt: string;
}

export async function saveMongoNote(noteData: MongoStudyNote): Promise<MongoStudyNote> {
  const now = new Date().toISOString();
  const note: MongoStudyNote = {
    ...noteData,
    id: noteData.id || `note_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: noteData.createdAt || now,
    updatedAt: now,
  };

  inMemoryStore.notes.set(note.id, note);

  const db = await getMongoDb();
  if (db) {
    try {
      await db.collection('notes').updateOne(
        { id: note.id },
        { $set: note },
        { upsert: true }
      );
    } catch (err) {
      console.warn('[MongoDB] saveMongoNote error:', err);
    }
  }

  return note;
}

export async function getMongoNotes(filter?: {
  userId?: string;
  classGrade?: string;
  subject?: string;
  chapter?: string;
  isPublic?: boolean;
}): Promise<MongoStudyNote[]> {
  const db = await getMongoDb();
  if (db) {
    try {
      const query: any = {};
      if (filter?.userId) query.userId = filter.userId;
      if (filter?.classGrade) query.classGrade = filter.classGrade;
      if (filter?.subject) query.subject = filter.subject;
      if (filter?.chapter) query.chapter = filter.chapter;
      if (filter?.isPublic !== undefined) query.isPublic = filter.isPublic;

      const docs = await db.collection('notes').find(query).sort({ createdAt: -1 }).toArray();
      return docs.map((d) => {
        delete (d as any)._id;
        return d as unknown as MongoStudyNote;
      });
    } catch (err) {
      console.warn('[MongoDB] getMongoNotes error:', err);
    }
  }

  // Fallback to in-memory store
  let notes = Array.from(inMemoryStore.notes.values());
  if (filter?.userId) notes = notes.filter((n) => n.userId === filter.userId);
  if (filter?.classGrade) notes = notes.filter((n) => n.classGrade === filter.classGrade);
  if (filter?.subject) notes = notes.filter((n) => n.subject === filter.subject);
  if (filter?.chapter) notes = notes.filter((n) => n.chapter === filter.chapter);
  if (filter?.isPublic !== undefined) notes = notes.filter((n) => n.isPublic === filter.isPublic);
  return notes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function deleteMongoNote(noteId: string): Promise<boolean> {
  inMemoryStore.notes.delete(noteId);
  const db = await getMongoDb();
  if (db) {
    try {
      await db.collection('notes').deleteOne({ id: noteId });
      return true;
    } catch (err) {
      console.warn('[MongoDB] deleteMongoNote error:', err);
    }
  }
  return true;
}

// ============================================================================
// 3. TEST ATTEMPTS & SCORECARDS COLLECTION
// ============================================================================

export interface MongoTestAttempt {
  id: string;
  userId: string;
  testId: string;
  title: string;
  classGrade: string;
  subject: string;
  chapter: string;
  score: number;
  totalMarks: number;
  percentage: number;
  accuracy: number;
  timeSpentSeconds: number;
  examPattern: string;
  userAnswers: Record<string, any>;
  createdAt: string;
}

export async function saveMongoTestAttempt(attemptData: MongoTestAttempt): Promise<MongoTestAttempt> {
  const now = new Date().toISOString();
  const attempt: MongoTestAttempt = {
    ...attemptData,
    id: attemptData.id || `attempt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: attemptData.createdAt || now,
  };

  inMemoryStore.test_attempts.set(attempt.id, attempt);

  const db = await getMongoDb();
  if (db) {
    try {
      await db.collection('test_attempts').insertOne(attempt as any);
    } catch (err) {
      console.warn('[MongoDB] saveMongoTestAttempt error:', err);
    }
  }

  return attempt;
}

export async function getMongoTestAttempts(userId: string): Promise<MongoTestAttempt[]> {
  const db = await getMongoDb();
  if (db) {
    try {
      const docs = await db.collection('test_attempts').find({ userId }).sort({ createdAt: -1 }).toArray();
      return docs.map((d) => {
        delete (d as any)._id;
        return d as unknown as MongoTestAttempt;
      });
    } catch (err) {
      console.warn('[MongoDB] getMongoTestAttempts error:', err);
    }
  }

  return Array.from(inMemoryStore.test_attempts.values())
    .filter((a) => a.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// ============================================================================
// 4. MISTAKE BOOK COLLECTION
// ============================================================================

export interface MongoMistakeItem {
  id: string;
  userId: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  classGrade: string;
  subject: string;
  chapter: string;
  resolved: boolean;
  timestamp: string;
}

export async function saveMongoMistake(mistake: MongoMistakeItem): Promise<MongoMistakeItem> {
  const item: MongoMistakeItem = {
    ...mistake,
    id: mistake.id || `mistake_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    timestamp: mistake.timestamp || new Date().toISOString(),
  };

  inMemoryStore.mistakes.set(item.id, item);

  const db = await getMongoDb();
  if (db) {
    try {
      await db.collection('mistakes').updateOne(
        { id: item.id },
        { $set: item },
        { upsert: true }
      );
    } catch (err) {
      console.warn('[MongoDB] saveMongoMistake error:', err);
    }
  }

  return item;
}

export async function getMongoMistakes(userId: string, unresolvedOnly = false): Promise<MongoMistakeItem[]> {
  const db = await getMongoDb();
  if (db) {
    try {
      const query: any = { userId };
      if (unresolvedOnly) query.resolved = false;
      const docs = await db.collection('mistakes').find(query).sort({ timestamp: -1 }).toArray();
      return docs.map((d) => {
        delete (d as any)._id;
        return d as unknown as MongoMistakeItem;
      });
    } catch (err) {
      console.warn('[MongoDB] getMongoMistakes error:', err);
    }
  }

  return Array.from(inMemoryStore.mistakes.values())
    .filter((m) => m.userId === userId && (!unresolvedOnly || !m.resolved))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export async function resolveMongoMistake(mistakeId: string): Promise<boolean> {
  const existing = inMemoryStore.mistakes.get(mistakeId);
  if (existing) {
    existing.resolved = true;
    inMemoryStore.mistakes.set(mistakeId, existing);
  }

  const db = await getMongoDb();
  if (db) {
    try {
      await db.collection('mistakes').updateOne({ id: mistakeId }, { $set: { resolved: true } });
      return true;
    } catch (err) {
      console.warn('[MongoDB] resolveMongoMistake error:', err);
    }
  }

  return true;
}

// ============================================================================
// 5. GRIEVANCE TICKETS (COMPLAINTS) COLLECTION
// ============================================================================

export interface MongoComplaintTicket {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  category: string;
  title: string;
  description: string;
  status: 'PENDING' | 'IN_REVIEW' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
  updatedAt: string;
  adminResolutionNote?: string;
}

export async function saveMongoComplaint(complaintData: Partial<MongoComplaintTicket>): Promise<MongoComplaintTicket> {
  const now = new Date().toISOString();
  const ticket: MongoComplaintTicket = {
    id: complaintData.id || `ticket_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    userId: complaintData.userId || 'anonymous',
    userEmail: complaintData.userEmail || '',
    userName: complaintData.userName || 'Student',
    category: complaintData.category || 'General Academic',
    title: complaintData.title || 'Inquiry',
    description: complaintData.description || '',
    status: complaintData.status || 'PENDING',
    createdAt: complaintData.createdAt || now,
    updatedAt: now,
    adminResolutionNote: complaintData.adminResolutionNote,
  };

  inMemoryStore.complaints.set(ticket.id, ticket);

  const db = await getMongoDb();
  if (db) {
    try {
      await db.collection('complaints').updateOne(
        { id: ticket.id },
        { $set: ticket },
        { upsert: true }
      );
    } catch (err) {
      console.warn('[MongoDB] saveMongoComplaint error:', err);
    }
  }

  return ticket;
}

export async function getMongoComplaints(userId?: string): Promise<MongoComplaintTicket[]> {
  const db = await getMongoDb();
  if (db) {
    try {
      const query = userId ? { userId } : {};
      const docs = await db.collection('complaints').find(query).sort({ createdAt: -1 }).toArray();
      return docs.map((d) => {
        delete (d as any)._id;
        return d as unknown as MongoComplaintTicket;
      });
    } catch (err) {
      console.warn('[MongoDB] getMongoComplaints error:', err);
    }
  }

  const all = Array.from(inMemoryStore.complaints.values());
  return (userId ? all.filter((c) => c.userId === userId) : all)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function updateMongoComplaintStatus(
  ticketId: string, 
  status: 'PENDING' | 'IN_REVIEW' | 'RESOLVED' | 'DISMISSED',
  note?: string
): Promise<boolean> {
  const existing = inMemoryStore.complaints.get(ticketId);
  const now = new Date().toISOString();
  if (existing) {
    existing.status = status;
    existing.updatedAt = now;
    if (note) existing.adminResolutionNote = note;
    inMemoryStore.complaints.set(ticketId, existing);
  }

  const db = await getMongoDb();
  if (db) {
    try {
      const updateData: any = { status, updatedAt: now };
      if (note) updateData.adminResolutionNote = note;
      await db.collection('complaints').updateOne({ id: ticketId }, { $set: updateData });
      return true;
    } catch (err) {
      console.warn('[MongoDB] updateMongoComplaintStatus error:', err);
    }
  }

  return true;
}

// ============================================================================
// 6. VIRTUAL LAB JOURNALS & EXPERIMENT PROGRESS (MONGODB ARCHITECTURE)
// ============================================================================

export interface MongoLabJournalRecord {
  id: string;
  userId: string;
  title: string;
  experimentNo: string;
  subject: string;
  classGrade: string;
  toolType: string;
  aim: string;
  apparatus: string;
  theory: string;
  formulae: string;
  observations: Array<{
    id: string;
    parameter: string;
    metricValue: string;
    metricUnit: string;
    imperialValue?: string;
    imperialUnit?: string;
    notes?: string;
  }>;
  calculations: string;
  errorPercentage?: number;
  conclusion: string;
  precautions: string;
  createdAt: string;
  updatedAt: string;
}

export async function saveMongoLabJournal(journalData: Partial<MongoLabJournalRecord>): Promise<MongoLabJournalRecord> {
  const now = new Date().toISOString();
  const journal: MongoLabJournalRecord = {
    id: journalData.id || `journal_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    userId: journalData.userId || 'anonymous',
    title: journalData.title || 'Untitled Lab Journal',
    experimentNo: journalData.experimentNo || 'EXP-01',
    subject: journalData.subject || 'General Science',
    classGrade: journalData.classGrade || 'Class 10',
    toolType: journalData.toolType || 'simulation',
    aim: journalData.aim || '',
    apparatus: journalData.apparatus || '',
    theory: journalData.theory || '',
    formulae: journalData.formulae || '',
    observations: journalData.observations || [],
    calculations: journalData.calculations || '',
    errorPercentage: journalData.errorPercentage ?? 0,
    conclusion: journalData.conclusion || '',
    precautions: journalData.precautions || '',
    createdAt: journalData.createdAt || now,
    updatedAt: now,
  };

  inMemoryStore.lab_journals.set(journal.id, journal);

  const db = await getMongoDb();
  if (db) {
    try {
      await db.collection('lab_journals').updateOne(
        { id: journal.id },
        { $set: journal },
        { upsert: true }
      );
    } catch (err) {
      console.warn('[MongoDB] saveMongoLabJournal error:', err);
    }
  }

  return journal;
}

export async function getMongoLabJournals(userId?: string): Promise<MongoLabJournalRecord[]> {
  const db = await getMongoDb();
  if (db) {
    try {
      const query = userId ? { userId } : {};
      const docs = await db.collection('lab_journals').find(query).sort({ createdAt: -1 }).toArray();
      return docs.map((d) => {
        delete (d as any)._id;
        return d as unknown as MongoLabJournalRecord;
      });
    } catch (err) {
      console.warn('[MongoDB] getMongoLabJournals error:', err);
    }
  }

  const all = Array.from(inMemoryStore.lab_journals.values());
  return (userId ? all.filter((j) => j.userId === userId) : all)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function deleteMongoLabJournal(journalId: string): Promise<boolean> {
  inMemoryStore.lab_journals.delete(journalId);

  const db = await getMongoDb();
  if (db) {
    try {
      await db.collection('lab_journals').deleteOne({ id: journalId });
      return true;
    } catch (err) {
      console.warn('[MongoDB] deleteMongoLabJournal error:', err);
    }
  }

  return true;
}

export interface MongoExperimentProgressRecord {
  id: string;
  userId: string;
  experimentId: string;
  subject: string;
  stagesCompleted: string[];
  score: number;
  total: number;
  percentage: number;
  timestamp: string;
}

export async function saveMongoExperimentProgress(
  progressData: Partial<MongoExperimentProgressRecord>
): Promise<MongoExperimentProgressRecord> {
  const record: MongoExperimentProgressRecord = {
    id: progressData.id || `${progressData.userId}_${progressData.experimentId}`,
    userId: progressData.userId || 'anonymous',
    experimentId: progressData.experimentId || 'exp-default',
    subject: progressData.subject || 'Physics',
    stagesCompleted: progressData.stagesCompleted || [],
    score: progressData.score ?? 0,
    total: progressData.total ?? 0,
    percentage: progressData.percentage ?? 0,
    timestamp: progressData.timestamp || new Date().toISOString(),
  };

  inMemoryStore.experiment_progress.set(record.id, record);

  const db = await getMongoDb();
  if (db) {
    try {
      await db.collection('experiment_progress').updateOne(
        { id: record.id },
        { $set: record },
        { upsert: true }
      );
    } catch (err) {
      console.warn('[MongoDB] saveMongoExperimentProgress error:', err);
    }
  }

  return record;
}

export async function getMongoExperimentProgress(userId: string): Promise<MongoExperimentProgressRecord[]> {
  const db = await getMongoDb();
  if (db) {
    try {
      const docs = await db.collection('experiment_progress').find({ userId }).toArray();
      return docs.map((d) => {
        delete (d as any)._id;
        return d as unknown as MongoExperimentProgressRecord;
      });
    } catch (err) {
      console.warn('[MongoDB] getMongoExperimentProgress error:', err);
    }
  }

  return Array.from(inMemoryStore.experiment_progress.values()).filter((p) => p.userId === userId);
}

// ============================================================================
// CONVENIENCE & REST ENDPOINT COMPATIBILITY EXPORTS
// ============================================================================

export const getMongoStatus = async () => getMongoHealth();
export const findMongoUserById = getMongoUser;
export const findMongoNotes = getMongoNotes;
export const findMongoTestAttempts = async (userId: string, _testId?: string) => getMongoTestAttempts(userId);
export const findMongoMistakes = getMongoMistakes;
export const createMongoComplaint = saveMongoComplaint;
export const listMongoComplaints = async (_email?: string) => getMongoComplaints();

export async function bulkMigrateToMongo(payload: {
  users?: any[];
  notes?: any[];
  attempts?: any[];
  mistakes?: any[];
  complaints?: any[];
}): Promise<{ inserted: Record<string, number>; errors: string[] }> {
  const inserted: Record<string, number> = {
    users: 0,
    notes: 0,
    attempts: 0,
    mistakes: 0,
    complaints: 0,
  };
  const errors: string[] = [];

  if (Array.isArray(payload.users)) {
    for (const u of payload.users) {
      try {
        if (u.id || u.uid) {
          await upsertMongoUser({ ...u, id: u.id || u.uid });
          inserted.users++;
        }
      } catch (err: any) {
        errors.push(`User ${u.id || u.uid}: ${err.message}`);
      }
    }
  }

  if (Array.isArray(payload.notes)) {
    for (const n of payload.notes) {
      try {
        await saveMongoNote(n);
        inserted.notes++;
      } catch (err: any) {
        errors.push(`Note ${n.id}: ${err.message}`);
      }
    }
  }

  if (Array.isArray(payload.attempts)) {
    for (const a of payload.attempts) {
      try {
        await saveMongoTestAttempt(a);
        inserted.attempts++;
      } catch (err: any) {
        errors.push(`Attempt ${a.id}: ${err.message}`);
      }
    }
  }

  if (Array.isArray(payload.mistakes)) {
    for (const m of payload.mistakes) {
      try {
        await saveMongoMistake(m);
        inserted.mistakes++;
      } catch (err: any) {
        errors.push(`Mistake ${m.id}: ${err.message}`);
      }
    }
  }

  if (Array.isArray(payload.complaints)) {
    for (const c of payload.complaints) {
      try {
        await saveMongoComplaint(c);
        inserted.complaints++;
      } catch (err: any) {
        errors.push(`Complaint ${c.id}: ${err.message}`);
      }
    }
  }

  return { inserted, errors };
}
