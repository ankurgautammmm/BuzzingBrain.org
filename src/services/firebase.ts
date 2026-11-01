import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signInAnonymously,
  sendPasswordResetEmail,
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc,
  getDocFromServer,
  setDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot, 
  getDocs,
  Unsubscribe 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { logger } from './logger';
import { checkLockoutStatus, recordFailedAttempt, resetFailedAttempts } from './authRateLimiter';
import { StudyNote, UserProfile, ComplaintTicket, MistakeItem, TestAttemptRecord, ExperimentJournalEntry } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function cleanFirestoreData<T extends Record<string, any>>(data: T): Partial<T> {
  const result: any = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result;
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  logger.error('Firebase', `Firestore Operation Failed [${operationType}] at ${path}:`, errInfo);
  throw new Error(JSON.stringify(errInfo));
}

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// CRITICAL: Database initialized with custom firestoreDatabaseId from config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Safe connection check that never crashes or throws on boot
async function testConnection() {
  try {
    // Only attempt when authenticated to respect security rules
    if (auth.currentUser) {
      await getDoc(doc(db, 'users', auth.currentUser.uid));
    }
  } catch (_) {
    // Silent handling on initial connection probe
  }
}
setTimeout(testConnection, 2000);

// Check for redirect result on app initialization (e.g. after redirect OAuth)
export async function checkRedirectAuthResult(): Promise<FirebaseUser | null> {
  try {
    const result = await getRedirectResult(auth);
    if (result && result.user) {
      logger.info('Auth', `[AUTH] Redirect Sign-In completed for: ${result.user.email} (${result.user.uid})`);
      return result.user;
    }
  } catch (error: any) {
    logger.warn('Auth', `[AUTH] Redirect result check notice [${error?.code || 'unknown'}]:`, error?.message);
  }
  return null;
}

// Authentication Helpers with Explicit Diagnostic Logging & Popup / Redirect Resilience
export async function signInWithGoogle(): Promise<FirebaseUser> {
  logger.info('Auth', '[AUTH] Initiating Google Sign-In with popup');
  try {
    const result = await signInWithPopup(auth, googleProvider);
    logger.info('Auth', `[AUTH] Google Sign-In successful for: ${result.user.email} (${result.user.uid})`);
    return result.user;
  } catch (error: any) {
    const code = error?.code || 'auth/unknown';
    logger.error('Auth', `[AUTH] Google Sign-In failed [${code}]:`, error?.message);

    // If popup was blocked by browser or iframe constraints, try redirect fallback
    if (code === 'auth/popup-blocked' || code === 'auth/cancelled-popup-request') {
      try {
        logger.info('Auth', '[AUTH] Popup was blocked or cancelled, attempting signInWithRedirect fallback');
        await signInWithRedirect(auth, googleProvider);
        return new Promise(() => {}); // Wait for page redirect
      } catch (redirectErr: any) {
        logger.warn('Auth', '[AUTH] Redirect fallback notice:', redirectErr?.message);
      }
    }

    if (code === 'auth/unauthorized-domain') {
      const hostname = typeof window !== 'undefined' ? window.location.hostname : 'current domain';
      throw new Error(`Domain "${hostname}" is not authorized for OAuth in Firebase Console. Please add "${hostname}" in Firebase Console -> Authentication -> Settings -> Authorized domains.`);
    }
    throw error;
  }
}

export async function signUpWithEmail(
  email: string, 
  password: string, 
  displayName: string, 
  classPreference: string = 'Class 10',
  accountRole: 'student' | 'teacher' = 'student'
): Promise<FirebaseUser> {
  const cleanEmail = email.trim();
  logger.info('Auth', `[AUTH] Attempting new ${accountRole} registration for: ${cleanEmail}`);
  try {
    const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
    if (displayName) {
      try {
        await updateProfile(cred.user, { displayName: displayName.trim() });
      } catch (pErr) {
        logger.warn('Auth', '[AUTH] Display name update notice:', pErr);
      }
    }
    logger.info('Auth', `[AUTH] User account created successfully: ${cred.user.uid}`);
    
    // Background profile sync: non-blocking so registration never hangs if Firestore is busy
    syncUserProfile(cred.user, classPreference, true, accountRole).catch((syncErr) => {
      logger.warn('Auth', '[FIRESTORE] Non-blocking initial profile creation catch:', syncErr);
    });

    return cred.user;
  } catch (error: any) {
    const code = error?.code || 'auth/unknown';
    logger.error('Auth', `[AUTH] Registration failed [${code}]:`, error?.message);
    if (code === 'auth/admin-restricted-operation' || error?.message?.includes('admin-restricted-operation')) {
      const err = new Error('Sign-up is restricted by administrator settings in Firebase Console (User account creation is disabled). In Firebase Console -> Authentication -> Settings -> User actions, turn ON "Enable create (sign-up)".');
      (err as any).code = 'auth/admin-restricted-operation';
      throw err;
    }
    throw error;
  }
}

export async function signInWithEmail(email: string, password: string): Promise<FirebaseUser> {
  const cleanEmail = email.trim();
  logger.info('Auth', `[AUTH] Attempting email sign-in for: ${cleanEmail}`);

  // 1. Check if account is locked due to too many failed password trials
  const lockout = checkLockoutStatus(cleanEmail);
  if (lockout.isLocked) {
    const minutes = Math.floor(lockout.remainingSeconds / 60);
    const seconds = lockout.remainingSeconds % 60;
    const timeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
    const err: any = new Error(`Account temporarily locked for security after 5 failed password attempts. Please wait ${timeStr} or use "Forgot Password" to reset.`);
    err.code = 'auth/too-many-requests';
    err.remainingSeconds = lockout.remainingSeconds;
    throw err;
  }

  try {
    const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
    // Successful login -> reset failed attempts counter
    resetFailedAttempts(cleanEmail);
    logger.info('Auth', `[AUTH] Email sign-in successful: ${cred.user.uid}`);
    return cred.user;
  } catch (error: any) {
    const code = error?.code || 'auth/unknown';
    // Record failed trial on invalid credentials
    if (code === 'auth/wrong-password' || code === 'auth/invalid-credential' || code === 'auth/user-not-found') {
      const trialResult = recordFailedAttempt(cleanEmail);
      if (trialResult.isLocked) {
        const err: any = new Error('Maximum 5 failed attempts reached! Your account is locked for 15 minutes for your security. You can reset your password anytime via "Forgot Password".');
        err.code = 'auth/too-many-requests';
        err.remainingSeconds = trialResult.remainingSeconds;
        throw err;
      } else {
        const remaining = 5 - trialResult.failedAttempts;
        const err: any = new Error(`Invalid email or password. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining before a 15-minute security lockout.`);
        err.code = code;
        err.remainingAttempts = remaining;
        throw err;
      }
    }
    logger.error('Auth', `[AUTH] Email sign-in failed [${code}]:`, error?.message);
    throw error;
  }
}

export async function sendPasswordReset(email: string): Promise<void> {
  const cleanEmail = email.trim();
  logger.info('Auth', `[AUTH] Sending password reset email to: ${cleanEmail}`);
  try {
    await sendPasswordResetEmail(auth, cleanEmail);
    logger.info('Auth', `[AUTH] Password reset email dispatched successfully to: ${cleanEmail}`);
  } catch (error: any) {
    logger.error('Auth', `[AUTH] Password reset dispatch failed [${error?.code || 'auth/unknown'}]:`, error?.message);
    throw error;
  }
}

// Local Guest Session Management (Activated seamlessly if Firebase Anonymous Auth is admin-restricted or offline)
const GUEST_STORAGE_KEY = 'bb_guest_session';
const guestAuthSubscribers = new Set<(user: FirebaseUser | null) => void>();

export function getStoredGuestUser(): FirebaseUser | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(GUEST_STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data && data.uid) {
        return createSyntheticGuestUser(data.displayName || 'Guest Student', data.uid);
      }
    }
  } catch (_) {}
  return null;
}

export function createSyntheticGuestUser(studentName: string = 'Guest Student', existingUid?: string): FirebaseUser {
  let storedUid: string | null = null;
  if (typeof localStorage !== 'undefined') {
    try {
      storedUid = localStorage.getItem('bb_guest_uid');
    } catch (_) {}
  }
  const guestUid = existingUid || storedUid || `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem('bb_guest_uid', guestUid);
    } catch (_) {}
  }
  const cleanName = (studentName || 'Guest Student').trim();

  return {
    uid: guestUid,
    displayName: cleanName,
    email: null,
    emailVerified: false,
    isAnonymous: true,
    photoURL: null,
    phoneNumber: null,
    providerId: 'firebase',
    tenantId: null,
    providerData: [],
    metadata: {
      creationTime: new Date().toISOString(),
      lastSignInTime: new Date().toISOString(),
    },
    delete: async () => {
      clearGuestSession();
    },
    getIdToken: async () => 'guest-synthetic-token',
    getIdTokenResult: async () => ({
      authTime: new Date().toISOString(),
      claims: {},
      expirationTime: new Date(Date.now() + 86400000).toISOString(),
      issuedAtTime: new Date().toISOString(),
      signInProvider: 'anonymous',
      signInSecondFactor: null,
      token: 'guest-synthetic-token',
    }),
    reload: async () => {},
    toJSON: () => ({ uid: guestUid, displayName: cleanName, isAnonymous: true }),
  } as unknown as FirebaseUser;
}

export function saveGuestSession(user: FirebaseUser) {
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify({
        uid: user.uid,
        displayName: user.displayName || 'Guest Student',
        isAnonymous: true,
        lastActive: new Date().toISOString()
      }));
    } catch (_) {}
  }
  guestAuthSubscribers.forEach(cb => {
    try { cb(user); } catch (_) {}
  });
}

export function clearGuestSession() {
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.removeItem(GUEST_STORAGE_KEY);
    } catch (_) {}
  }
  guestAuthSubscribers.forEach(cb => {
    try { cb(null); } catch (_) {}
  });
}

export function onGuestAuthStateChanged(callback: (user: FirebaseUser | null) => void): Unsubscribe {
  guestAuthSubscribers.add(callback);
  return () => {
    guestAuthSubscribers.delete(callback);
  };
}

export async function signInAsGuestStudent(
  studentName: string = 'Guest Student', 
  classPreference: string = 'Class 10'
): Promise<FirebaseUser> {
  logger.info('Auth', '[AUTH] Attempting guest student sign-in');
  try {
    const cred = await signInAnonymously(auth);
    if (studentName) {
      try {
        await updateProfile(cred.user, { displayName: studentName.trim() });
      } catch (pErr) {
        logger.warn('Auth', '[AUTH] Guest display name notice:', pErr);
      }
    }
    logger.info('Auth', `[AUTH] Guest session active: ${cred.user.uid}`);

    // Background profile sync: non-blocking, guest login NEVER fails if Firestore has issues
    syncUserProfile(cred.user, classPreference, true).catch((syncErr) => {
      logger.warn('Auth', '[FIRESTORE] Non-blocking guest profile sync catch:', syncErr);
    });

    return cred.user;
  } catch (error: any) {
    const code = error?.code || 'auth/unknown';
    // If anonymous sign-in is restricted by Firebase admin policy, disabled in console, or offline:
    // Seamlessly activate the Resilient Local Guest Session so the student is never blocked.
    logger.info('Auth', `[AUTH] Firebase Anonymous sign-in notice (${code}). Seamlessly activating Resilient Local Guest Session.`);
    const localGuest = createSyntheticGuestUser(studentName);
    saveGuestSession(localGuest);

    // Non-blocking local profile sync
    syncUserProfile(localGuest, classPreference, true).catch((syncErr) => {
      logger.warn('Auth', '[LOCAL] Non-blocking guest profile sync notice:', syncErr);
    });

    return localGuest;
  }
}

export async function logOut(): Promise<void> {
  try {
    logger.info('Auth', '[AUTH] Signing out user');
    clearGuestSession();
    await signOut(auth);
    logger.info('Auth', '[AUTH] User logged out successfully');
  } catch (error) {
    clearGuestSession();
    logger.error('Auth', '[AUTH] Failed to sign out', error);
    throw error;
  }
}

// User Profile Operations with Resilient In-Memory & LocalStorage Fallbacks
export function buildFallbackUserProfile(
  user: FirebaseUser, 
  classPreference?: string, 
  acceptedTerms?: boolean,
  initialRole?: 'student' | 'teacher'
): UserProfile {
  const now = new Date().toISOString();
  const normalizedEmail = (user.email || '').toLowerCase();
  const isAdminEmail = 
    normalizedEmail === 'brainyyybuzz@gmail.com' || 
    normalizedEmail === 'gautamankur0101@gmail.com' || 
    normalizedEmail === 'pathpriya99@gmail.com';

  const defaultDisplayName = user.displayName || (user.email ? user.email.split('@')[0] : (user.isAnonymous ? 'Guest Student' : 'Student Scholar'));

  return {
    id: user.uid,
    displayName: defaultDisplayName,
    email: user.email || '',
    photoURL: user.photoURL || '',
    role: isAdminEmail ? 'admin' : (initialRole || 'student'),
    classPreference: classPreference || 'Class 10',
    className: classPreference || 'Class 10',
    acceptedTerms: acceptedTerms ?? false,
    termsVersion: acceptedTerms ? '2026.1' : undefined,
    termsAcceptedAt: acceptedTerms ? now : undefined,
    xp: 250,
    streakDays: 1,
    lastActiveDate: now.split('T')[0],
    badges: ['Welcome Scholar'],
    createdAt: now,
    updatedAt: now,
  };
}

export async function syncUserProfile(
  user: FirebaseUser, 
  classPreference?: string, 
  acceptedTerms?: boolean,
  initialRole?: 'student' | 'teacher'
): Promise<UserProfile> {
  const now = new Date().toISOString();
  const normalizedEmail = (user.email || '').toLowerCase();
  const isAdminEmail = 
    normalizedEmail === 'brainyyybuzz@gmail.com' || 
    normalizedEmail === 'gautamankur0101@gmail.com' || 
    normalizedEmail === 'pathpriya99@gmail.com';

  const cacheKey = `bb_user_profile_${user.uid}`;
  const fallbackProfile = buildFallbackUserProfile(user, classPreference, acceptedTerms, initialRole);

  // Restore cached profile from localStorage if present
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      Object.assign(fallbackProfile, parsed);
    }
  } catch (_) {}

  const userRef = doc(db, 'users', user.uid);

  try {
    logger.info('Firebase', `[FIRESTORE] Fetching profile for uid: ${user.uid}`);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      const initialProfile: Record<string, any> = {
        id: user.uid,
        displayName: fallbackProfile.displayName,
        email: user.email || '',
        photoURL: user.photoURL || '',
        role: isAdminEmail ? 'admin' : (fallbackProfile.role || initialRole || 'student'),
        classPreference: classPreference || fallbackProfile.classPreference || 'Class 10',
        className: classPreference || fallbackProfile.className || 'Class 10',
        acceptedTerms: acceptedTerms ?? fallbackProfile.acceptedTerms ?? false,
        xp: fallbackProfile.xp || 250,
        streakDays: fallbackProfile.streakDays || 1,
        lastActiveDate: now.split('T')[0],
        badges: fallbackProfile.badges || ['Welcome Scholar'],
        createdAt: now,
        updatedAt: now,
      };
      if (initialProfile.acceptedTerms) {
        initialProfile.termsVersion = '2026.1';
        initialProfile.termsAcceptedAt = now;
        initialProfile.onboardedAt = now;
      }
      const cleaned = cleanFirestoreData(initialProfile);
      // Use setDoc with merge: true so it creates or merges safely
      await setDoc(userRef, cleaned, { merge: true });
      logger.info('Firebase', `[FIRESTORE] Successfully created profile document for ${user.uid}`);
      const createdProfile = { ...fallbackProfile, ...cleaned } as UserProfile;
      try { localStorage.setItem(cacheKey, JSON.stringify(createdProfile)); } catch (_) {}
      return createdProfile;
    } else {
      const existing = userDoc.data() as UserProfile;
      const updates: Record<string, any> = {
        displayName: user.displayName || existing.displayName || fallbackProfile.displayName,
        photoURL: user.photoURL || existing.photoURL || '',
        updatedAt: now,
        lastActiveDate: now.split('T')[0],
      };
      if (classPreference && (!existing.classPreference || existing.classPreference === 'Class 10')) {
        updates.classPreference = classPreference;
        updates.className = classPreference;
      }
      if (acceptedTerms !== undefined) {
        updates.acceptedTerms = acceptedTerms;
        if (acceptedTerms) {
          updates.termsVersion = '2026.1';
          updates.termsAcceptedAt = now;
          if (!existing.onboardedAt) {
            updates.onboardedAt = now;
          }
        }
      }
      if (isAdminEmail && existing.role !== 'admin') {
        updates.role = 'admin';
      }
      const cleanedUpdates = cleanFirestoreData(updates);
      // setDoc with merge: true avoids "no document to update" errors
      await setDoc(userRef, cleanedUpdates, { merge: true });
      const mergedProfile = { ...existing, ...cleanedUpdates };
      try { localStorage.setItem(cacheKey, JSON.stringify(mergedProfile)); } catch (_) {}
      logger.info('Firebase', `[FIRESTORE] Profile refreshed for ${user.uid}`);
      return mergedProfile;
    }
  } catch (error: any) {
    // CRITICAL: A Firestore error must never fail login! Return the resilient fallback profile.
    logger.warn('Firebase', `[FIRESTORE] Non-fatal profile sync fallback for ${user.uid}:`, error?.message || error);
    try { localStorage.setItem(cacheKey, JSON.stringify(fallbackProfile)); } catch (_) {}
    return fallbackProfile;
  }
}

export async function getAuthTokenHeader(): Promise<Record<string, string>> {
  if (auth.currentUser && !auth.currentUser.uid.startsWith('guest_')) {
    try {
      const token = await auth.currentUser.getIdToken();
      if (token) return { Authorization: `Bearer ${token}` };
    } catch {}
  }
  return {};
}

export async function updateStudentProfile(
  userId: string,
  details: {
    displayName?: string;
    classPreference?: string;
    className?: string;
    age?: number | string;
    sex?: string;
    mobileNumber?: string;
    email?: string;
    targetExam?: string;
    acceptedTerms?: boolean;
    role?: 'student' | 'teacher' | 'admin';
    avatarId?: string;
    customAvatarUrl?: string;
    schoolName?: string;
    coachingInstitute?: string;
    targetScore?: string;
    dailyStudyHours?: number;
    studentRollNumber?: string;
    parentInfo?: {
      parentName?: string;
      parentPhone?: string;
      relation?: string;
      preferredCommunication?: string;
      consentGiven?: boolean;
    };
    dataConsentVersion?: string;
    dataConsentAcceptedAt?: string;
  }
): Promise<UserProfile> {
  const userRef = doc(db, 'users', userId);
  const now = new Date().toISOString();
  const cacheKey = `bb_user_profile_${userId}`;

  let currentProfile: Partial<UserProfile> = {};
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) currentProfile = JSON.parse(cached);
  } catch (_) {}

  const updates: Record<string, any> = {
    ...details,
    updatedAt: now,
    onboardedAt: now,
    acceptedTerms: true,
    termsVersion: '2026.1',
    termsAcceptedAt: now,
  };
  if (details.classPreference && !details.className) {
    updates.className = details.classPreference;
  }
  const cleaned = cleanFirestoreData(updates);

  try {
    // setDoc with merge: true works whether document exists or not!
    await setDoc(userRef, cleaned, { merge: true });
    logger.info('User', `Updated student onboarding profile in Firestore for ${userId}`);
  } catch (error) {
    logger.warn('User', `Firestore write deferred for ${userId} (offline or security notice):`, error);
  }

  const merged = { ...currentProfile, ...cleaned, id: userId } as UserProfile;
  try { localStorage.setItem(cacheKey, JSON.stringify(merged)); } catch (_) {}

  // Sync student profile to MongoDB
  try {
    getAuthTokenHeader().then((authHeader) => {
      fetch('/api/mongo/users/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        body: JSON.stringify({ id: userId, uid: userId, ...cleaned }),
      }).catch(() => {});
    });
  } catch (_) {}

  return merged;
}

export async function setUserRole(userId: string, newRole: 'student' | 'teacher' | 'admin'): Promise<void> {
  const userRef = doc(db, 'users', userId);
  const now = new Date().toISOString();
  try {
    await setDoc(userRef, { role: newRole, updatedAt: now }, { merge: true });
    logger.info('User', `Set user ${userId} role to ${newRole}`);
  } catch (err) {
    logger.warn('User', `Failed to persist user role change in Firestore:`, err);
  }
  const cacheKey = `bb_user_profile_${userId}`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      parsed.role = newRole;
      parsed.updatedAt = now;
      localStorage.setItem(cacheKey, JSON.stringify(parsed));
    }
  } catch (_) {}
}

export function subscribeToUserProfile(userId: string, callback: (profile: UserProfile | null) => void): Unsubscribe {
  if (userId.startsWith('guest_')) {
    try {
      const cached = localStorage.getItem(`bb_user_profile_${userId}`);
      if (cached) {
        callback(JSON.parse(cached));
      }
    } catch (_) {}
    return () => {};
  }

  const userRef = doc(db, 'users', userId);
  return onSnapshot(
    userRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const profile = docSnap.data() as UserProfile;
        try { localStorage.setItem(`bb_user_profile_${userId}`, JSON.stringify(profile)); } catch (_) {}
        callback(profile);
      }
    },
    (error) => {
      logger.warn('Firebase', `Profile subscription notice for ${userId}: ${error.message}`);
      // Do NOT set profile to null on snapshot error! Preserves local profile state.
    }
  );
}

// Note Operations
export async function saveStudyNote(note: Omit<StudyNote, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const noteId = `note_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();
  const noteDoc = doc(db, 'notes', noteId);
  const noteData: StudyNote = {
    ...note,
    id: noteId,
    createdAt: now,
    updatedAt: now,
  };

  try {
    const cleanedNote = cleanFirestoreData(noteData);
    await setDoc(noteDoc, cleanedNote);
    logger.info('Notes', `Saved study note ${noteId}: ${note.title}`);

    // Sync to MongoDB notes collection
    try {
      getAuthTokenHeader().then((authHeader) => {
        fetch('/api/mongo/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...authHeader },
          body: JSON.stringify(noteData),
        }).catch(() => {});
      });
    } catch (_) {}

    return noteId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `notes/${noteId}`);
    throw error;
  }
}

export async function deleteStudyNote(noteId: string): Promise<void> {
  const noteDoc = doc(db, 'notes', noteId);
  try {
    await deleteDoc(noteDoc);
    logger.info('Notes', `Deleted note ${noteId}`);

    // Sync deletion to MongoDB
    try {
      getAuthTokenHeader().then((authHeader) => {
        fetch(`/api/mongo/notes/${noteId}`, {
          method: 'DELETE',
          headers: { ...authHeader },
        }).catch(() => {});
      });
    } catch (_) {}
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `notes/${noteId}`);
    throw error;
  }
}

export function subscribeToStudyNotes(callback: (notes: StudyNote[]) => void, classGradeFilter?: string): Unsubscribe {
  try {
    const notesCol = collection(db, 'notes');
    let q = query(notesCol, limit(50));
    if (classGradeFilter && classGradeFilter !== 'All') {
      q = query(notesCol, where('classGrade', '==', classGradeFilter), limit(50));
    }

    return onSnapshot(
      q,
      (snapshot) => {
        const notes: StudyNote[] = [];
        snapshot.forEach((doc) => {
          notes.push(doc.data() as StudyNote);
        });
        // Sort newest first in memory
        notes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        callback(notes);
      },
      () => {
        // Silently fallback without clobbering console
        callback([]);
      }
    );
  } catch (_) {
    callback([]);
    return () => {};
  }
}

// Complaint Operations
export async function submitComplaint(
  ticket: Omit<ComplaintTicket, 'id' | 'ticketId' | 'status' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const ticketRefId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
  const complaintId = `comp_${Date.now()}`;
  const now = new Date().toISOString();
  const complaintDoc = doc(db, 'complaints', complaintId);

  const fullComplaint: ComplaintTicket = {
    ...ticket,
    id: complaintId,
    ticketId: ticketRefId,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };

  try {
    const cleanedComplaint = cleanFirestoreData(fullComplaint);
    await setDoc(complaintDoc, cleanedComplaint);
    logger.info('Complaint', `Logged complaint ${ticketRefId} by ${ticket.userEmail}`);
    return ticketRefId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `complaints/${complaintId}`);
    throw error;
  }
}

export async function updateComplaintStatus(
  complaintId: string, 
  status: 'pending' | 'in_review' | 'resolved', 
  adminNotes?: string
): Promise<void> {
  const complaintDoc = doc(db, 'complaints', complaintId);
  const now = new Date().toISOString();
  try {
    await updateDoc(complaintDoc, {
      status,
      adminNotes: adminNotes || '',
      updatedAt: now,
    });
    logger.info('Complaint', `Updated complaint ${complaintId} status to ${status}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `complaints/${complaintId}`);
    throw error;
  }
}

export function subscribeToComplaints(callback: (complaints: ComplaintTicket[]) => void): Unsubscribe {
  if (!auth.currentUser) {
    callback([]);
    return () => {};
  }

  try {
    const complaintsCol = collection(db, 'complaints');
    const normalizedEmail = (auth.currentUser.email || '').toLowerCase();
    const isAdmin = 
      normalizedEmail === 'brainyyybuzz@gmail.com' || 
      normalizedEmail === 'gautamankur0101@gmail.com' || 
      normalizedEmail === 'pathpriya99@gmail.com';

    const q = isAdmin 
      ? query(complaintsCol, limit(100))
      : query(complaintsCol, where('userId', '==', auth.currentUser.uid), limit(100));

    return onSnapshot(
      q,
      (snapshot) => {
        const complaints: ComplaintTicket[] = [];
        snapshot.forEach((doc) => {
          complaints.push(doc.data() as ComplaintTicket);
        });
        complaints.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        callback(complaints);
      },
      () => {
        // Silently fallback without clobbering console
        callback([]);
      }
    );
  } catch (_) {
    callback([]);
    return () => {};
  }
}

// Gamification XP & Badge operations
export async function awardStudentXP(userId: string, points: number, badgeName?: string): Promise<number> {
  const userRef = doc(db, 'users', userId);
  const cacheKey = `bb_user_profile_${userId}`;
  let newXp = points;
  try {
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      newXp = (data.xp || 0) + points;
      const updates: Record<string, any> = { xp: newXp, updatedAt: new Date().toISOString() };
      if (badgeName && (!data.badges || !data.badges.includes(badgeName))) {
        updates.badges = [...(data.badges || []), badgeName];
      }
      await updateDoc(userRef, updates);
    }
  } catch (err) {
    logger.warn('Gamification', '[FIRESTORE] Local XP fallback cache updated:', err);
  }
  // LocalStorage update
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const p = JSON.parse(cached);
      p.xp = (p.xp || 0) + points;
      if (badgeName && (!p.badges || !p.badges.includes(badgeName))) {
        p.badges = [...(p.badges || []), badgeName];
      }
      localStorage.setItem(cacheKey, JSON.stringify(p));
    }
  } catch (_) {}
  return newXp;
}

// Mistake Book Operations (Firestore + LocalStorage resilient + MongoDB Persistent)
export async function saveMistake(mistake: Omit<MistakeItem, 'id' | 'timestamp' | 'resolved'>): Promise<string> {
  const mistakeId = `mst_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();
  const fullMistake: MistakeItem = {
    ...mistake,
    id: mistakeId,
    timestamp: now,
    resolved: false,
  };

  const localKey = `bb_mistakes_${mistake.userId}`;
  try {
    const raw = localStorage.getItem(localKey);
    const list: MistakeItem[] = raw ? JSON.parse(raw) : [];
    list.unshift(fullMistake);
    localStorage.setItem(localKey, JSON.stringify(list.slice(0, 200)));
  } catch (_) {}

  try {
    const mistakeDoc = doc(db, 'mistakes', mistakeId);
    await setDoc(mistakeDoc, cleanFirestoreData(fullMistake));
    logger.info('Mistakes', `[FIRESTORE] Saved mistake ${mistakeId} for student ${mistake.userId}`);
  } catch (err) {
    logger.warn('Mistakes', `[FIRESTORE] Saved mistake to local storage fallback:`, err);
  }

  // Also sync mistake to MongoDB database
  try {
    getAuthTokenHeader().then((authHeader) => {
      fetch('/api/mongo/mistakes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        body: JSON.stringify({
          id: mistakeId,
          userId: mistake.userId,
          question: mistake.question,
          userAnswer: mistake.userAnswer,
          correctAnswer: mistake.correctAnswer,
          explanation: mistake.explanation,
          classGrade: mistake.classGrade,
          subject: mistake.subject,
          chapter: mistake.chapter,
          resolved: false,
          timestamp: now,
        }),
      }).catch(() => {});
    });
  } catch (_) {}

  return mistakeId;
}

export function getLocalMistakes(userId: string): MistakeItem[] {
  try {
    const raw = localStorage.getItem(`bb_mistakes_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

export function resolveLocalMistake(userId: string, mistakeId: string): void {
  try {
    const localKey = `bb_mistakes_${userId}`;
    const raw = localStorage.getItem(localKey);
    if (raw) {
      const list: MistakeItem[] = JSON.parse(raw);
      const updated = list.map(m => m.id === mistakeId ? { ...m, resolved: true } : m);
      localStorage.setItem(localKey, JSON.stringify(updated));
    }
  } catch (_) {}

  // Sync mistake resolution to MongoDB
  try {
    getAuthTokenHeader().then((authHeader) => {
      fetch(`/api/mongo/mistakes/${mistakeId}/resolve`, {
        method: 'PATCH',
        headers: { ...authHeader },
      }).catch(() => {});
    });
  } catch (_) {}
}

export function subscribeToStudentMistakes(userId: string, callback: (mistakes: MistakeItem[]) => void): Unsubscribe {
  if (!userId) {
    callback([]);
    return () => {};
  }

  // Initial read from local storage for instant render
  callback(getLocalMistakes(userId));

  // Reconcile with MongoDB database
  getAuthTokenHeader().then((authHeader) => {
    fetch(`/api/mongo/mistakes/${userId}`, { headers: { ...authHeader } })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.mistakes) && data.mistakes.length > 0) {
          const map = new Map<string, MistakeItem>();
          getLocalMistakes(userId).forEach((m) => map.set(m.id, m));
          data.mistakes.forEach((m: any) => {
            map.set(m.id, {
              id: m.id,
              userId: m.userId,
              question: m.question,
              userAnswer: m.userAnswer,
              correctAnswer: m.correctAnswer,
              explanation: m.explanation,
              classGrade: m.classGrade,
              subject: m.subject,
              chapter: m.chapter,
              topic: m.topic,
              type: m.type || 'mcq',
              resolved: !!m.resolved,
              timestamp: m.timestamp || new Date().toISOString(),
            });
          });
          const merged = Array.from(map.values()).sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          try {
            localStorage.setItem(`bb_mistakes_${userId}`, JSON.stringify(merged));
          } catch (_) {}
          callback(merged);
        }
      })
      .catch(() => {});
  });

  if (!auth.currentUser) {
    return () => {};
  }

  const mistakesCol = collection(db, 'mistakes');
  const q = query(mistakesCol, where('userId', '==', userId), limit(100));

  return onSnapshot(
    q,
    (snapshot) => {
      const list: MistakeItem[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as MistakeItem);
      });
      list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      if (list.length > 0) {
        try {
          localStorage.setItem(`bb_mistakes_${userId}`, JSON.stringify(list));
        } catch (_) {}
        callback(list);
      }
    },
    (error) => {
      logger.warn('Mistakes', `Mistakes subscription notice: ${error.message}`);
    }
  );
}

// ============================================================================
// Test Attempts & Examination Scorecard Persistence
// ============================================================================

export async function saveTestAttempt(
  attempt: Omit<TestAttemptRecord, 'id' | 'timestamp'>
): Promise<string> {
  const attemptId = `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();
  const fullAttempt: TestAttemptRecord = {
    ...attempt,
    id: attemptId,
    timestamp: now,
  };

  // Local storage update for offline and immediate resilience
  const localKey = `bb_test_attempts_${attempt.userId}`;
  try {
    const raw = localStorage.getItem(localKey);
    const list: TestAttemptRecord[] = raw ? JSON.parse(raw) : [];
    list.unshift(fullAttempt);
    localStorage.setItem(localKey, JSON.stringify(list.slice(0, 100)));
  } catch (_) {}

  try {
    const attemptDoc = doc(db, 'test_attempts', attemptId);
    await setDoc(attemptDoc, cleanFirestoreData(fullAttempt));
    logger.info('Tests', `[FIRESTORE] Saved test attempt ${attemptId} for student ${attempt.userId}`);
  } catch (err) {
    logger.warn('Tests', `[FIRESTORE] Saved test attempt to local storage fallback:`, err);
  }

  // Also sync test attempt to MongoDB database
  try {
    getAuthTokenHeader().then((authHeader) => {
      fetch('/api/mongo/tests/attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        body: JSON.stringify({
          id: attemptId,
          userId: attempt.userId,
          testId: attempt.testId,
          title: attempt.testTitle,
          classGrade: attempt.classGrade,
          subject: attempt.subject,
          chapter: attempt.chapter,
          score: attempt.score,
          totalMarks: attempt.maxScore,
          percentage: attempt.percentage,
          accuracy: attempt.percentage,
          timeSpentSeconds: 0,
          examPattern: attempt.examPattern || 'cbse',
          userAnswers: {},
          createdAt: now,
        }),
      }).catch(() => {});
    });
  } catch (_) {}

  return attemptId;
}

export function getLocalTestAttempts(userId: string): TestAttemptRecord[] {
  try {
    const raw = localStorage.getItem(`bb_test_attempts_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

export function subscribeToStudentTestAttempts(
  userId: string,
  callback: (attempts: TestAttemptRecord[]) => void
): Unsubscribe {
  if (!userId) {
    callback([]);
    return () => {};
  }

  // Fast initial render from cache
  callback(getLocalTestAttempts(userId));

  // Reconcile with MongoDB database
  getAuthTokenHeader().then((authHeader) => {
    fetch(`/api/mongo/tests/attempts/${userId}`, { headers: { ...authHeader } })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.attempts) && data.attempts.length > 0) {
          const map = new Map<string, TestAttemptRecord>();
          getLocalTestAttempts(userId).forEach((a) => map.set(a.id, a));
          data.attempts.forEach((a: any) => {
            map.set(a.id, {
              id: a.id,
              userId: a.userId,
              testId: a.testId,
              testTitle: a.title || a.testTitle || 'Chapter Practice Test',
              classGrade: a.classGrade,
              subject: a.subject,
              chapter: a.chapter,
              score: a.score,
              maxScore: a.totalMarks || a.maxScore || 100,
              percentage: a.percentage,
              correctCount: a.correctCount || Math.round((a.percentage / 100) * 10),
              wrongCount: a.wrongCount || Math.round(((100 - a.percentage) / 100) * 10),
              unattemptedCount: a.unattemptedCount || 0,
              examPattern: a.examPattern || 'cbse',
              percentile: a.percentile || Math.min(99, Math.round(a.percentage * 0.95)),
              timestamp: a.createdAt || a.timestamp || new Date().toISOString(),
            });
          });
          const merged = Array.from(map.values()).sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          try {
            localStorage.setItem(`bb_test_attempts_${userId}`, JSON.stringify(merged));
          } catch (_) {}
          callback(merged);
        }
      })
      .catch(() => {});
  });

  if (!auth.currentUser) {
    return () => {};
  }

  const attemptsCol = collection(db, 'test_attempts');
  const q = query(attemptsCol, where('userId', '==', userId), limit(50));

  return onSnapshot(
    q,
    (snapshot) => {
      const list: TestAttemptRecord[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as TestAttemptRecord);
      });
      list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      if (list.length > 0) {
        try {
          localStorage.setItem(`bb_test_attempts_${userId}`, JSON.stringify(list));
        } catch (_) {}
        callback(list);
      }
    },
    (error) => {
      logger.info('TestAttempts', '[FIRESTORE] Query error, using cache fallback', { error: error?.message });
      callback(getLocalTestAttempts(userId));
    }
  );
}

// ============================================================================
// Experiment Journal Persistence (Firestore + LocalStorage hybrid)
// ============================================================================

export async function saveExperimentJournal(
  journal: Omit<ExperimentJournalEntry, 'id' | 'createdAt' | 'updatedAt'>,
  existingId?: string
): Promise<string> {
  const journalId = existingId || `jrnl_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();
  const fullJournal: ExperimentJournalEntry = {
    ...journal,
    id: journalId,
    createdAt: now,
    updatedAt: now,
  };

  const localKey = `bb_journals_${journal.userId || 'guest'}`;
  try {
    const raw = localStorage.getItem(localKey);
    let list: ExperimentJournalEntry[] = raw ? JSON.parse(raw) : [];
    const existingIdx = list.findIndex(j => j.id === journalId);
    if (existingIdx >= 0) {
      list[existingIdx] = fullJournal;
    } else {
      list.unshift(fullJournal);
    }
    localStorage.setItem(localKey, JSON.stringify(list.slice(0, 100)));
  } catch (_) {}

  // If authenticated with Firebase, write to Firestore
  if (auth.currentUser && !auth.currentUser.uid.startsWith('guest_')) {
    try {
      const journalDoc = doc(db, 'journals', journalId);
      const firestorePayload = {
        userId: journal.userId || auth.currentUser.uid,
        experimentNo: journal.experimentNo || 'EXP-01',
        title: journal.title,
        date: journal.date,
        classGrade: journal.classGrade,
        subject: journal.subject,
        aim: journal.aim,
        apparatus: journal.apparatus,
        theory: journal.theory,
        formulae: journal.formulae,
        activeToolUsed: journal.activeToolUsed || '',
        observationsJson: JSON.stringify(journal.observations || []),
        calculations: journal.calculations,
        errorPercentage: journal.errorPercentage || 0,
        conclusion: journal.conclusion,
        precautions: journal.precautions,
        studentName: journal.studentName,
        createdAt: now,
        updatedAt: now,
      };
      await setDoc(journalDoc, cleanFirestoreData(firestorePayload), { merge: true });
      logger.info('Journals', `[FIRESTORE] Saved journal ${journalId}`);
    } catch (err) {
      logger.warn('Journals', '[FIRESTORE] Saved journal to local storage fallback:', err);
    }
  }
  return journalId;
}

export function getLocalJournals(userId?: string): ExperimentJournalEntry[] {
  try {
    const localKey = `bb_journals_${userId || 'guest'}`;
    const raw = localStorage.getItem(localKey);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

export async function deleteExperimentJournal(journalId: string, userId?: string): Promise<void> {
  const localKey = `bb_journals_${userId || 'guest'}`;
  try {
    const raw = localStorage.getItem(localKey);
    if (raw) {
      const list: ExperimentJournalEntry[] = JSON.parse(raw);
      const filtered = list.filter(j => j.id !== journalId);
      localStorage.setItem(localKey, JSON.stringify(filtered));
    }
  } catch (_) {}

  if (auth.currentUser && !auth.currentUser.uid.startsWith('guest_')) {
    try {
      const journalDoc = doc(db, 'journals', journalId);
      await deleteDoc(journalDoc);
    } catch (_) {}
  }
}

export function subscribeToExperimentJournals(
  userId: string,
  callback: (journals: ExperimentJournalEntry[]) => void
): Unsubscribe {
  // Always immediately provide local cache
  callback(getLocalJournals(userId));

  if (!auth.currentUser || userId.startsWith('guest_')) {
    return () => {};
  }

  try {
    const journalsCol = collection(db, 'journals');
    const q = query(journalsCol, where('userId', '==', userId), limit(50));

    return onSnapshot(
      q,
      (snapshot) => {
        const list: ExperimentJournalEntry[] = [];
        snapshot.forEach((d) => {
          const data = d.data();
          let parsedObs = [];
          try {
            if (data.observationsJson) parsedObs = JSON.parse(data.observationsJson);
          } catch (_) {}
          list.push({
            id: d.id,
            userId: data.userId,
            experimentNo: data.experimentNo || 'EXP-01',
            title: data.title || '',
            date: data.date || '',
            classGrade: data.classGrade || 'Class 10',
            subject: data.subject || 'Science',
            aim: data.aim || '',
            apparatus: data.apparatus || '',
            theory: data.theory || '',
            formulae: data.formulae || '',
            activeToolUsed: data.activeToolUsed || '',
            observations: parsedObs,
            calculations: data.calculations || '',
            errorPercentage: data.errorPercentage || 0,
            conclusion: data.conclusion || '',
            precautions: data.precautions || '',
            studentName: data.studentName || 'Student Scholar',
            createdAt: data.createdAt || new Date().toISOString(),
            updatedAt: data.updatedAt || new Date().toISOString(),
          });
        });
        if (list.length > 0) {
          list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
          try {
            localStorage.setItem(`bb_journals_${userId}`, JSON.stringify(list));
          } catch (_) {}
          callback(list);
        }
      },
      () => {
        // Silent fallback to local storage
        callback(getLocalJournals(userId));
      }
    );
  } catch (_) {
    callback(getLocalJournals(userId));
    return () => {};
  }
}


