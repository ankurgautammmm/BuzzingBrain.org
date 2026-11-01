import React, { useState, useEffect } from 'react';
import { 
  LogIn, 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  ArrowLeft, 
  Clock, 
  KeyRound, 
  BookOpen, 
  Check, 
  Info,
  Shield
} from 'lucide-react';
import { 
  signInWithEmail, 
  signUpWithEmail, 
  signInWithGoogle, 
  sendPasswordReset 
} from '../services/firebase';
import { checkLockoutStatus } from '../services/authRateLimiter';
import { logger } from '../services/logger';

interface AuthPageProps {
  initialMode?: 'signin' | 'signup';
  onSuccess: () => void;
  onBackToHome: () => void;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
  targetMessage?: string;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'signin',
  onSuccess,
  onBackToHome,
  onOpenTerms,
  onOpenPrivacy,
  targetMessage,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [classPreference, setClassPreference] = useState('Class 11');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [showPassword, setShowPassword] = useState(false);

  // Status
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState<string | null>(null);
  const [forgotError, setForgotError] = useState<string | null>(null);

  // Lockout tracking with live countdown
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(0);

  // Check lockout on email change or mount
  useEffect(() => {
    if (!email.trim()) return;
    const status = checkLockoutStatus(email);
    if (status.isLocked) {
      setLockoutSeconds(status.remainingSeconds);
    } else {
      setLockoutSeconds(0);
    }
  }, [email]);

  // Live countdown timer for lockout
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setErrorMessage(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  const formatCountdown = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder.toString().padStart(2, '0')}`;
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setErrorMessage('Please provide both email and password.');
      return;
    }

    if (mode === 'signin') {
      const status = checkLockoutStatus(cleanEmail);
      if (status.isLocked) {
        setLockoutSeconds(status.remainingSeconds);
        setErrorMessage(`Account temporarily locked due to 5 failed attempts. Please wait ${formatCountdown(status.remainingSeconds)} or reset your password.`);
        return;
      }
    }

    if (mode === 'signup') {
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }
      if (!displayName.trim()) {
        setErrorMessage('Please enter your full name or scholar handle.');
        return;
      }
    }

    try {
      setIsLoading(true);
      if (mode === 'signin') {
        await signInWithEmail(cleanEmail, password);
        setSuccessNotice('Signed in successfully! Redirecting...');
      } else {
        await signUpWithEmail(cleanEmail, password, displayName, classPreference, role);
        setSuccessNotice('Account created successfully! Welcome to Buzzing Brain.');
      }
      setTimeout(() => {
        onSuccess();
      }, 500);
    } catch (err: any) {
      logger.error('AuthPage', 'Authentication action failed', err);
      if (err.remainingSeconds) {
        setLockoutSeconds(err.remainingSeconds);
      }
      setErrorMessage(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMessage(null);
    setSuccessNotice(null);
    try {
      setIsLoading(true);
      await signInWithGoogle();
      setSuccessNotice('Signed in with Google successfully! Redirecting...');
      setTimeout(() => {
        onSuccess();
      }, 500);
    } catch (err: any) {
      logger.error('AuthPage', 'Google auth failed', err);
      setErrorMessage(err.message || 'Google Sign-In was cancelled or could not be completed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = (forgotEmail || email).trim();
    if (!clean) {
      setForgotError('Please enter your registered email address.');
      return;
    }

    try {
      setForgotLoading(true);
      setForgotError(null);
      setForgotMessage(null);
      await sendPasswordReset(clean);
      setForgotMessage(`A password reset link has been dispatched to ${clean}. Please check your inbox and spam folders.`);
    } catch (err: any) {
      setForgotError(err.message || 'Unable to send password reset email. Please ensure the email is registered.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative z-10">
      <div className="w-full max-w-xl mx-auto">
        {/* Back navigation */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </button>
          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>256-Bit Cryptographic Auth</span>
          </span>
        </div>

        {/* Auth Card */}
        <div className="astra-card rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl space-y-6 backdrop-blur-xl bg-slate-950/85">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Free Education for All</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {mode === 'signin' ? 'Welcome Back to Buzzing Brain' : 'Create Your Scholar Account'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              {targetMessage || (mode === 'signin' 
                ? 'Sign in to access your handwritten notes, practice tests, and sync your study journey.'
                : 'Join free. Authenticate your Gmail or email to unlock all NCERT notes, tests, and 3D labs.')}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-white/5 rounded-2xl border border-white/10 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMessage(null);
                setSuccessNotice(null);
              }}
              className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'signin'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Log In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMessage(null);
                setSuccessNotice(null);
              }}
              className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'signup'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Sign Up Free</span>
            </button>
          </div>

          {/* Quick Google Sign In */}
          <div>
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isLoading || lockoutSeconds > 0}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs sm:text-sm shadow-lg transition-all cursor-pointer active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
            <div className="flex items-center gap-3 my-4">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-mono">or email credentials</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Full Name / Handle
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Aryan Sharma"
                      className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Class / Grade
                    </label>
                    <select
                      value={classPreference}
                      onChange={(e) => setClassPreference(e.target.value)}
                      className="w-full px-3 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-amber-400 transition"
                    >
                      <option value="Class 9">Class 9</option>
                      <option value="Class 10">Class 10</option>
                      <option value="Class 11">Class 11</option>
                      <option value="Class 12">Class 12</option>
                      <option value="Dropper">Dropper (NEET/JEE)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Role
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as 'student' | 'teacher')}
                      className="w-full px-3 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-amber-400 transition"
                    >
                      <option value="student">Student Scholar</option>
                      <option value="teacher">Educator / Teacher</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-amber-400 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Password
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email);
                      setShowForgotModal(true);
                    }}
                    className="text-[11px] text-amber-400 hover:text-amber-300 transition cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-amber-400 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-400" />
                <span>Encrypted &amp; hashed with PBKDF2/scrypt. Never stored in plain text.</span>
              </p>
            </div>

            {/* Trial Lockout Banner */}
            {lockoutSeconds > 0 && (
              <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-3">
                <Clock className="w-5 h-5 shrink-0 text-rose-400 animate-spin" />
                <div>
                  <div className="font-bold">Security Lockout Active</div>
                  <div className="text-[11px] text-rose-200">
                    Max 5 failed trials reached. Locked for {formatCountdown(lockoutSeconds)}. Try again later or use Forgot Password.
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && lockoutSeconds <= 0 && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Message */}
            {successNotice && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successNotice}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || lockoutSeconds > 0}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl transition-all cursor-pointer active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </span>
              ) : mode === 'signin' ? (
                'Sign In'
              ) : (
                'Create Free Account'
              )}
            </button>
          </form>

          {/* Privacy & Data Consent Notice */}
          <div className="pt-4 border-t border-white/10 text-center space-y-2">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              By authenticating, you agree to Buzzing Brain&apos;s{' '}
              <button
                type="button"
                onClick={onOpenTerms}
                className="text-amber-400 underline hover:text-amber-300 transition cursor-pointer"
              >
                Terms &amp; Conditions
              </button>{' '}
              and{' '}
              <button
                type="button"
                onClick={onOpenPrivacy}
                className="text-amber-400 underline hover:text-amber-300 transition cursor-pointer"
              >
                Privacy Policy
              </button>
              .
            </p>
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500">
              <Info className="w-3 h-3 text-cyan-400" />
              <span>We collect strictly minimum necessary data with consent. Zero third-party tracking.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md astra-card rounded-3xl p-6 sm:p-8 border border-white/15 bg-slate-950 text-white space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-base">Reset Your Password</h3>
              </div>
              <button
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotMessage(null);
                  setForgotError(null);
                }}
                className="text-slate-400 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Enter your registered email address below. We will send an official cryptographic password reset link to your email.
            </p>

            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              {forgotError && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                  {forgotError}
                </div>
              )}

              {forgotMessage && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{forgotMessage}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-300 hover:text-white transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition cursor-pointer shadow-md disabled:opacity-50"
                >
                  {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
