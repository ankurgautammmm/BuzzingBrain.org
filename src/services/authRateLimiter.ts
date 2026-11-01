/**
 * Password Trial Rate Limiting & Account Protection Service
 *
 * Security Requirements:
 * - Maximum 5 consecutive failed password trials allowed.
 * - Enforces a mandatory 15-minute lockout when threshold is reached.
 * - Live countdown timer reporting exact remaining lockout seconds.
 * - Passwords stored and authenticated in hashed form (Firebase scrypt/PBKDF2).
 */

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes in milliseconds
const STORAGE_KEY_PREFIX = 'bb_auth_trials_';

export interface LockoutStatus {
  isLocked: boolean;
  failedAttempts: number;
  remainingSeconds: number;
  lockoutExpiryMs: number | null;
}

function getStorageKey(email: string): string {
  const clean = (email || 'global').trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
  return `${STORAGE_KEY_PREFIX}${clean}`;
}

interface StoredTrialData {
  failedAttempts: number;
  lockoutUntil: number | null;
  lastAttemptAt: number;
}

export function checkLockoutStatus(email: string): LockoutStatus {
  if (typeof localStorage === 'undefined') {
    return { isLocked: false, failedAttempts: 0, remainingSeconds: 0, lockoutExpiryMs: null };
  }

  const key = getStorageKey(email);
  const raw = localStorage.getItem(key);
  if (!raw) {
    return { isLocked: false, failedAttempts: 0, remainingSeconds: 0, lockoutExpiryMs: null };
  }

  try {
    const data: StoredTrialData = JSON.parse(raw);
    const now = Date.now();

    if (data.lockoutUntil && data.lockoutUntil > now) {
      const remainingSeconds = Math.ceil((data.lockoutUntil - now) / 1000);
      return {
        isLocked: true,
        failedAttempts: data.failedAttempts,
        remainingSeconds,
        lockoutExpiryMs: data.lockoutUntil,
      };
    }

    // Lockout expired, reset attempt count
    if (data.lockoutUntil && data.lockoutUntil <= now) {
      localStorage.removeItem(key);
      return { isLocked: false, failedAttempts: 0, remainingSeconds: 0, lockoutExpiryMs: null };
    }

    return {
      isLocked: false,
      failedAttempts: data.failedAttempts || 0,
      remainingSeconds: 0,
      lockoutExpiryMs: null,
    };
  } catch {
    return { isLocked: false, failedAttempts: 0, remainingSeconds: 0, lockoutExpiryMs: null };
  }
}

export function recordFailedAttempt(email: string): LockoutStatus {
  if (typeof localStorage === 'undefined') {
    return { isLocked: false, failedAttempts: 1, remainingSeconds: 0, lockoutExpiryMs: null };
  }

  const key = getStorageKey(email);
  const status = checkLockoutStatus(email);
  const now = Date.now();
  const nextAttempts = status.failedAttempts + 1;

  if (nextAttempts >= MAX_FAILED_ATTEMPTS) {
    const lockoutUntil = now + LOCKOUT_DURATION_MS;
    const data: StoredTrialData = {
      failedAttempts: nextAttempts,
      lockoutUntil,
      lastAttemptAt: now,
    };
    localStorage.setItem(key, JSON.stringify(data));
    return {
      isLocked: true,
      failedAttempts: nextAttempts,
      remainingSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000),
      lockoutExpiryMs: lockoutUntil,
    };
  }

  const data: StoredTrialData = {
    failedAttempts: nextAttempts,
    lockoutUntil: null,
    lastAttemptAt: now,
  };
  localStorage.setItem(key, JSON.stringify(data));
  return {
    isLocked: false,
    failedAttempts: nextAttempts,
    remainingSeconds: 0,
    lockoutExpiryMs: null,
  };
}

export function resetFailedAttempts(email: string): void {
  if (typeof localStorage === 'undefined') return;
  const key = getStorageKey(email);
  localStorage.removeItem(key);
}
