/**
 * Buzzing Brain — Offline Storage & Notes Cache Service
 * Provides resilient offline persistence for handwritten study notes, diagrams,
 * and curriculum content using IndexedDB with localStorage fallback.
 */

import { StudyNote, NoteContentPayload, HandwritingStyleConfig } from '../types';
import { COMPREHENSIVE_CHAPTER_NOTES } from '../data/curatedChapterNotes';
import { logger } from './logger';

const DB_NAME = 'BuzzingBrain_OfflineDB';
const DB_VERSION = 1;
const NOTES_STORE = 'cached_notes';
const IMAGES_STORE = 'cached_note_images';
const LOCAL_STORAGE_BACKUP_KEY = 'bb_offline_notes_backup_v1';

// Seed initial curated notes into offline cache so students immediately have rich offline study materials
function generateInitialCuratedNotes(): StudyNote[] {
  const seedNotes: StudyNote[] = [];
  const entries = Object.entries(COMPREHENSIVE_CHAPTER_NOTES);

  for (const [key, payload] of entries) {
    const parts = key.split(':');
    const classGrade = payload.classGrade || parts[0] || 'Class 10';
    const subject = payload.subject || parts[1] || 'Science';
    const chapter = payload.chapter || parts[2] || payload.title;

    const defaultStyle: HandwritingStyleConfig = {
      penType: 'gel-pen',
      inkColor: subject.includes('Bio') || subject.includes('Science') ? 'royal-blue' : 'emerald-green',
      paperType: 'ruled-notebook',
      fontFamily: 'Kalam',
      fontSize: 20,
      slantAngle: 0.3,
      inkPressure: 'medium',
      highlightColor: 'yellow',
      showMarginLine: true,
      showHoles: true,
    };

    seedNotes.push({
      id: `curated_${classGrade.replace(/\s+/g, '')}_${subject.replace(/\s+/g, '')}_${chapter.replace(/[^a-zA-Z0-9]/g, '')}`,
      title: payload.title,
      classGrade,
      subject,
      chapter,
      topic: payload.topic || chapter,
      commandUsed: `/handwriting ${classGrade} ${subject} ${chapter}`,
      contentJson: JSON.stringify(payload),
      parsedContent: payload,
      styleConfig: JSON.stringify(defaultStyle),
      parsedStyle: defaultStyle,
      userId: 'system_curated',
      userName: 'NCERT Verified Master Note',
      userEmail: 'curated@buzzingbrain.org',
      isPublic: true,
      likesCount: 142,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  return seedNotes;
}

// Open IndexedDB instance
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB is not available in this environment'));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(NOTES_STORE)) {
        db.createObjectStore(NOTES_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(IMAGES_STORE)) {
        db.createObjectStore(IMAGES_STORE, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

let memoryStore: StudyNote[] = generateInitialCuratedNotes();

// Synchronous fast fallback to get cached notes from localStorage or in-memory fallback
export function getFastLocalCachedNotes(): StudyNote[] {
  if (typeof localStorage === 'undefined') {
    return memoryStore;
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_BACKUP_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryStore = parsed;
        return parsed;
      }
    }
  } catch (e) {
    logger.warn('OfflineStorage', 'Failed to read fast local cached notes:', e);
  }
  return memoryStore;
}

// Save notes list to localStorage backup and memory store
function backupToLocalStorage(notes: StudyNote[]): void {
  memoryStore = notes;
  if (typeof localStorage === 'undefined') return;
  try {
    // Keep top 40 notes in localStorage backup to avoid quota exhaustion
    const trimmed = notes.slice(0, 40);
    localStorage.setItem(LOCAL_STORAGE_BACKUP_KEY, JSON.stringify(trimmed));
  } catch (e) {
    logger.warn('OfflineStorage', 'LocalStorage backup quota notice:', e);
  }
}

/**
 * Retrieve all offline cached notes
 */
export async function getOfflineNotes(): Promise<StudyNote[]> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(NOTES_STORE, 'readonly');
      const store = tx.objectStore(NOTES_STORE);
      const req = store.getAll();

      req.onsuccess = () => {
        const records: StudyNote[] = req.result || [];
        if (records.length === 0) {
          // Initialize with curated seed notes
          const initial = generateInitialCuratedNotes();
          saveMultipleOfflineNotes(initial).catch(() => {});
          resolve(initial);
        } else {
          // Sort newest first
          records.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
          backupToLocalStorage(records);
          resolve(records);
        }
      };

      req.onerror = () => {
        resolve(getFastLocalCachedNotes());
      };
    });
  } catch (err) {
    logger.warn('OfflineStorage', 'Falling back to fast localStorage for offline notes:', err);
    return getFastLocalCachedNotes();
  }
}

/**
 * Save or update a single study note in offline storage
 */
export async function saveOfflineNote(note: StudyNote): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(NOTES_STORE, 'readwrite');
      const store = tx.objectStore(NOTES_STORE);
      const req = store.put(note);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });

    // Also update fast localStorage backup
    const current = getFastLocalCachedNotes();
    const existingIdx = current.findIndex(n => n.id === note.id);
    if (existingIdx >= 0) {
      current[existingIdx] = note;
    } else {
      current.unshift(note);
    }
    backupToLocalStorage(current);
    logger.info('OfflineStorage', `Cached note offline: ${note.title} (${note.id})`);
  } catch (err) {
    logger.warn('OfflineStorage', 'Failed to save note to IndexedDB, updating localStorage backup:', err);
    const current = getFastLocalCachedNotes();
    const existingIdx = current.findIndex(n => n.id === note.id);
    if (existingIdx >= 0) {
      current[existingIdx] = note;
    } else {
      current.unshift(note);
    }
    backupToLocalStorage(current);
  }
}

/**
 * Batch save multiple study notes (used when syncing remote Firestore notes to offline cache)
 */
export async function saveMultipleOfflineNotes(notes: StudyNote[]): Promise<void> {
  if (!notes || notes.length === 0) return;

  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(NOTES_STORE, 'readwrite');
      const store = tx.objectStore(NOTES_STORE);

      for (const note of notes) {
        store.put(note);
      }

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });

    backupToLocalStorage(notes);
  } catch (err) {
    backupToLocalStorage(notes);
  }
}

/**
 * Delete a note from offline cache
 */
export async function deleteOfflineNote(noteId: string): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(NOTES_STORE, 'readwrite');
      const store = tx.objectStore(NOTES_STORE);
      const req = store.delete(noteId);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });

    const current = getFastLocalCachedNotes().filter(n => n.id !== noteId);
    backupToLocalStorage(current);
  } catch (err) {
    const current = getFastLocalCachedNotes().filter(n => n.id !== noteId);
    backupToLocalStorage(current);
  }
}

/**
 * Cache a generated note image or diagram SVG/base64
 */
export async function cacheNoteImage(imageId: string, imageData: string): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(IMAGES_STORE, 'readwrite');
      const store = tx.objectStore(IMAGES_STORE);
      const req = store.put({ id: imageId, data: imageData, savedAt: new Date().toISOString() });

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    logger.warn('OfflineStorage', `Failed to cache image for ${imageId}:`, e);
  }
}

/**
 * Retrieve cached note image or diagram
 */
export async function getOfflineNoteImage(imageId: string): Promise<string | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(IMAGES_STORE, 'readonly');
      const store = tx.objectStore(IMAGES_STORE);
      const req = store.get(imageId);

      req.onsuccess = () => {
        if (req.result && req.result.data) {
          resolve(req.result.data);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}
