/**
 * Buzzing Brain — Pure MongoDB Database Architecture
 *
 * Dedicated MongoDB database connection, document schemas, collection definitions,
 * and high-performance querying utilities for students, study notes, assessments,
 * mistake journals, complaints, and interactive virtual lab records.
 *
 * SQL and PostgreSQL have been completely eliminated.
 */

import { MongoClient, Db, Collection, ObjectId } from 'mongodb';

// MongoDB configuration
export const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/buzzing_brain';
export const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'buzzing_brain';

// Document Schemas & Interfaces for MongoDB Collections
export interface MongoUserDoc {
  _id?: ObjectId;
  id: string; // Firebase UID
  uid: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  role: 'student' | 'teacher' | 'parent' | 'admin';
  classGrade?: string;
  targetExam?: string;
  xp?: number;
  streakDays?: number;
  parentsInfo?: {
    fatherName?: string;
    motherName?: string;
    whatsappNumber?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface MongoNoteDoc {
  _id?: ObjectId;
  id: string;
  userId: string;
  topic: string;
  grade: string;
  subject: string;
  title: string;
  payload: any;
  styleConfig: any;
  markdownContent?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MongoTestAttemptDoc {
  _id?: ObjectId;
  id: string;
  userId: string;
  testId: string;
  testTitle: string;
  classGrade: string;
  subject: string;
  chapter: string;
  score: number;
  maxScore: number;
  percentage: number;
  correctCount: number;
  wrongCount: number;
  unattemptedCount: number;
  accuracy: number;
  timeSpentSec: number;
  completedAt: string;
  chapterBreakdown?: Record<string, { correct: number; total: number }>;
  weakTopics?: string[];
  strongTopics?: string[];
}

export interface MongoMistakeDoc {
  _id?: ObjectId;
  id: string;
  userId: string;
  questionId: string;
  questionText: string;
  subject: string;
  chapter: string;
  examType: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  mistakeTag: 'calculation' | 'conceptual' | 'formula_recall' | 'reading_trap';
  resolved: boolean;
  recordedAt: string;
  resolvedAt?: string;
}

export interface MongoComplaintDoc {
  _id?: ObjectId;
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

export interface MongoLabJournalDoc {
  _id?: ObjectId;
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

export interface MongoExperimentProgressDoc {
  _id?: ObjectId;
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

// Resilient singleton connection management
let client: MongoClient | null = null;
let dbInstance: Db | null = null;
let isConnecting = false;

export async function getDb(): Promise<Db | null> {
  if (dbInstance) return dbInstance;
  if (!MONGODB_URI) return null;

  if (isConnecting) {
    let attempts = 0;
    while (isConnecting && attempts < 20) {
      await new Promise((r) => setTimeout(r, 100));
      attempts++;
    }
    if (dbInstance) return dbInstance;
  }

  isConnecting = true;
  try {
    const mongoClient = new MongoClient(MONGODB_URI, {
      connectTimeoutMS: 4000,
      serverSelectionTimeoutMS: 4000,
      maxPoolSize: 20,
    });
    await mongoClient.connect();
    client = mongoClient;
    dbInstance = mongoClient.db(MONGODB_DB_NAME);
    return dbInstance;
  } catch (err: any) {
    console.warn('[MongoDB] getDb connection notice:', err?.message || err);
    return null;
  } finally {
    isConnecting = false;
  }
}

// Collection Helpers with direct MongoDB queries
export const getCollections = async () => {
  const db = await getDb();
  if (!db) return null;
  return {
    users: db.collection<MongoUserDoc>('users'),
    notes: db.collection<MongoNoteDoc>('notes'),
    testAttempts: db.collection<MongoTestAttemptDoc>('test_attempts'),
    mistakes: db.collection<MongoMistakeDoc>('mistakes'),
    complaints: db.collection<MongoComplaintDoc>('complaints'),
    labJournals: db.collection<MongoLabJournalDoc>('lab_journals'),
    experimentProgress: db.collection<MongoExperimentProgressDoc>('experiment_progress'),
  };
};

// Export db object for compatibility
export const db = {
  getDb,
  getCollections,
};
