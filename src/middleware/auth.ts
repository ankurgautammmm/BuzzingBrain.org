/**
 * BuzzingBrain — Production-Grade Authentication & Role-Based Access Control (RBAC)
 *
 * Security Architecture:
 * - Cryptographic Firebase ID Token verification on protected endpoints.
 * - Multi-Role Authorization: Student, Teacher, Parent, Administrator.
 * - Strict privilege escalation defense: Client-supplied roles and admin flags are never trusted.
 * - Data ownership isolation: Users can access and modify only their own private records.
 * - Deep NoSQL injection input sanitization for all MongoDB requests.
 */

import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin';
import { DecodedIdToken } from 'firebase-admin/auth';
import { getMongoUser } from '../../server/mongoService';

export type UserRole = 'student' | 'teacher' | 'parent' | 'admin';

export interface AuthenticatedUser {
  uid: string;
  email: string;
  role: UserRole;
  isAdmin: boolean;
  displayName?: string;
  photoURL?: string;
}

export interface AuthRequest extends Request {
  user?: DecodedIdToken;
  authenticatedUser?: AuthenticatedUser;
}

// Trusted Administrative Email Registry from Environment
export const getTrustedAdminEmails = (): string[] => {
  const envAdmins = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  return Array.from(new Set([
    'brainyyybuzz@gmail.com',
    'gautamankur0101@gmail.com',
    'pathpriya99@gmail.com',
    ...envAdmins
  ]));
};

/**
 * Extracts and verifies Firebase token from Authorization: Bearer <token>
 */
export async function resolveVerifiedToken(req: Request): Promise<DecodedIdToken | null> {
  const authHeader = req.headers.authorization || (req.headers['x-authorization'] as string);
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split('Bearer ')[1]?.trim();
  if (!token) return null;

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return decoded;
  } catch (err: any) {
    // If token verification fails, return null
    return null;
  }
}

/**
 * Optional Authentication: Attaches verified user context if present.
 * Does NOT reject if token is absent, making it ideal for dual-access public/authenticated endpoints.
 */
export const authenticateOptional = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const decoded = await resolveVerifiedToken(req);
    if (decoded) {
      req.user = decoded;
      const email = (decoded.email || '').toLowerCase();
      const trustedAdmins = getTrustedAdminEmails();
      const isConfiguredAdmin = trustedAdmins.includes(email) || Boolean((decoded as any).admin);

      // Fetch authentic role from MongoDB database
      let dbRole: UserRole = 'student';
      try {
        const dbUser = await getMongoUser(decoded.uid);
        if (dbUser && dbUser.role) {
          dbRole = dbUser.role as UserRole;
        }
      } catch {
        // Fallback to student if db lookup transiently unavailable
      }

      req.authenticatedUser = {
        uid: decoded.uid,
        email,
        role: isConfiguredAdmin ? 'admin' : dbRole,
        isAdmin: isConfiguredAdmin || dbRole === 'admin',
        displayName: decoded.name || decoded.displayName,
        photoURL: decoded.picture,
      };
    }
    next();
  } catch (err) {
    next();
  }
};

/**
 * Mandatory Authentication: Requires a valid, cryptographically verified Firebase ID Token.
 */
export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const decoded = await resolveVerifiedToken(req);
  if (!decoded) {
    return res.status(401).json({ 
      success: false, 
      error: 'Authentication required. Missing or invalid Bearer token.' 
    });
  }

  req.user = decoded;
  const email = (decoded.email || '').toLowerCase();
  const trustedAdmins = getTrustedAdminEmails();
  const isConfiguredAdmin = trustedAdmins.includes(email) || Boolean((decoded as any).admin);

  let dbRole: UserRole = 'student';
  try {
    const dbUser = await getMongoUser(decoded.uid);
    if (dbUser && dbUser.role) {
      dbRole = dbUser.role as UserRole;
    }
  } catch {}

  req.authenticatedUser = {
    uid: decoded.uid,
    email,
    role: isConfiguredAdmin ? 'admin' : dbRole,
    isAdmin: isConfiguredAdmin || dbRole === 'admin',
    displayName: decoded.name || decoded.displayName,
    photoURL: decoded.picture,
  };

  next();
};

/**
 * Role-Based Access Control (RBAC): Enforces required roles.
 */
export const requireRole = (allowedRoles: UserRole[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.authenticatedUser) {
      // Execute requireAuth first if not already populated
      await requireAuth(req, res, () => {});
    }

    if (!req.authenticatedUser) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    // Admins always satisfy all roles
    if (req.authenticatedUser.isAdmin || req.authenticatedUser.role === 'admin') {
      return next();
    }

    if (!allowedRoles.includes(req.authenticatedUser.role)) {
      return res.status(403).json({ 
        success: false, 
        error: `Access denied. Requires one of the following roles: ${allowedRoles.join(', ')}` 
      });
    }

    next();
  };
};

/**
 * Strict Administrator Requirement: Requires verified admin email or admin role.
 */
export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.authenticatedUser) {
    const decoded = await resolveVerifiedToken(req);
    if (!decoded) {
      // Check dev secret bypass only in local dev
      if (process.env.NODE_ENV !== 'production' && req.headers['x-admin-secret'] && req.headers['x-admin-secret'] === process.env.ADMIN_SECRET) {
        return next();
      }
      return res.status(401).json({ success: false, error: 'Administrative authorization token required.' });
    }

    const email = (decoded.email || '').toLowerCase();
    const trustedAdmins = getTrustedAdminEmails();
    const isConfiguredAdmin = trustedAdmins.includes(email) || Boolean((decoded as any).admin);
    
    if (!isConfiguredAdmin) {
      return res.status(403).json({ success: false, error: 'Access denied: Administrative privileges required.' });
    }

    req.authenticatedUser = {
      uid: decoded.uid,
      email,
      role: 'admin',
      isAdmin: true,
      displayName: decoded.name || decoded.displayName,
    };
    return next();
  }

  if (!req.authenticatedUser.isAdmin && req.authenticatedUser.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Access denied: Administrative privileges required.' });
  }

  next();
};

/**
 * Enforces Resource Ownership: A user can access/modify only their own records.
 * Administrators and Teachers possess supervisory access.
 */
export const enforceResourceOwnership = (
  getTargetUserId: (req: Request) => string | undefined
) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const targetUserId = getTargetUserId(req);
    if (!targetUserId) {
      return res.status(400).json({ success: false, error: 'Target user ID is missing from request.' });
    }

    // If unauthenticated guest request, allow only if target is marked as guest or anonymous
    if (!req.authenticatedUser) {
      if (targetUserId.startsWith('guest') || targetUserId.startsWith('anonymous')) {
        return next();
      }
      return res.status(401).json({ success: false, error: 'Authentication required to access student records.' });
    }

    const currentUid = req.authenticatedUser.uid;
    const isOwner = currentUid === targetUserId;
    const isSupervisor = req.authenticatedUser.isAdmin || req.authenticatedUser.role === 'teacher';

    if (!isOwner && !isSupervisor) {
      return res.status(403).json({ 
        success: false, 
        error: 'Access denied: You are not authorized to access or modify this student record.' 
      });
    }

    next();
  };
};

/**
 * Deep NoSQL Injection Sanitizer:
 * Recursively cleans incoming objects, removing MongoDB query operators ($gt, $where, etc.)
 */
export function sanitizeNoSqlInput(req: Request, _res: Response, next: NextFunction) {
  const sanitize = (obj: any): any => {
    if (!obj || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(sanitize);

    const clean: Record<string, any> = {};
    for (const [key, val] of Object.entries(obj)) {
      // Disallow keys starting with $ or containing . in body keys
      if (key.startsWith('$') || key.includes('.')) {
        continue;
      }
      clean[key] = sanitize(val);
    }
    return clean;
  };

  if (req.body && typeof req.body === 'object') {
    req.body = sanitize(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = sanitize(req.query);
  }
  if (req.params && typeof req.params === 'object') {
    req.params = sanitize(req.params);
  }

  next();
}
