import React, { useState } from 'react';
import { 
  LogIn, 
  UserPlus, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Mail, 
  KeyRound, 
  User, 
  GraduationCap, 
  AlertCircle,
  Eye,
  EyeOff,
  Zap,
  Check,
  ArrowLeft,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { 
  signInWithGoogle, 
  signInWithEmail, 
  signUpWithEmail, 
  signInAsGuestStudent,
  sendPasswordReset
} from '../services/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
  customTitle?: string;
  customDescription?: string;
  onOpenLegal?: (tab: 'terms' | 'privacy') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
  customTitle,
  customDescription,
  onOpenLegal,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [classGrade, setClassGrade] = useState('Class 10');
  const [accountRole, setAccountRole] = useState<'student' | 'teacher'>('student');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  // Sync mode if initialMode changes
  React.useEffect(() => {
    setMode(initialMode);
    setErrorMessage(null);
    setErrorCode(null);
    setIsResetMode(false);
    setResetSent(false);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const formatAuthError = (err: any): { message: string; code: string } => {
    const rawCode = err?.code || (err?.message?.includes('auth/') ? err.message.match(/auth\/[a-zA-Z0-9-]+/)?.[0] : '') || 'auth/unknown';
    
    let message = 'Authentication could not be completed. Please check your connection and credentials.';

    switch (rawCode) {
      case 'auth/invalid-email':
        message = 'Please enter a valid email address (e.g. student@example.com).';
        break;
      case 'auth/user-disabled':
        message = 'This student account has been disabled. Please contact platform support.';
        break;
      case 'auth/user-not-found':
        message = 'Incorrect email or password. Please check your credentials and try again.';
        break;
      case 'auth/wrong-password':
        message = 'Incorrect email or password. Please check your credentials and try again.';
        break;
      case 'auth/invalid-credential':
        message = 'Incorrect email or password. Please check your credentials and try again.';
        break;
      case 'auth/too-many-requests':
        message = 'Too many failed login attempts. Access is temporarily restricted. Please wait a few minutes or reset your password.';
        break;
      case 'auth/network-request-failed':
        message = 'Network connection issue. Please check your internet connectivity and try again.';
        break;
      case 'auth/operation-not-allowed':
        message = 'This authentication method is currently not enabled in Firebase Console. Please enable Email/Password or Anonymous in Firebase Console -> Authentication -> Sign-in method.';
        break;
      case 'auth/admin-restricted-operation':
        message = 'Sign-up is restricted by administrator settings in Firebase Console (User account creation is disabled). In Firebase Console -> Authentication -> Settings -> User actions, enable "Allow users to sign up".';
        break;
      case 'auth/popup-blocked':
        message = 'Google sign-in popup was blocked by your browser. Please allow popups for this site, or sign in with Email / Guest mode.';
        break;
      case 'auth/popup-closed-by-user':
        message = 'Google sign-in window was closed before completing. Please try again.';
        break;
      case 'auth/cancelled-popup-request':
        message = 'Sign-in request was cancelled. Please try again.';
        break;
      case 'auth/unauthorized-domain':
        message = 'Current domain is not authorized in Firebase Console -> Authentication -> Settings -> Authorized domains.';
        break;
      case 'auth/email-already-in-use':
        message = 'An account with this email already exists. Please switch to Sign In.';
        break;
      case 'auth/weak-password':
        message = 'Password is too weak. Please use at least 6 characters with letters and numbers.';
        break;
      default:
        message = err?.message || 'Authentication error. Please verify your input and try again.';
        break;
    }

    return { message, code: rawCode };
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setErrorMessage(null);
    setErrorCode(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setIsLoading(true);
    setLoadingAction('Signing in...');
    try {
      await signInWithEmail(email, password);
      onClose();
    } catch (err: any) {
      const parsed = formatAuthError(err);
      setErrorMessage(parsed.message);
      setErrorCode(parsed.code);
    } finally {
      setIsLoading(false);
      setLoadingAction('');
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setErrorMessage(null);
    setErrorCode(null);

    if (!displayName.trim()) {
      setErrorMessage('Please enter your full student name.');
      return;
    }
    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your email and password.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('Please accept the Terms & Conditions and Privacy Policy to proceed.');
      return;
    }

    setIsLoading(true);
    setLoadingAction(accountRole === 'teacher' ? 'Creating educator account...' : 'Creating student account...');
    try {
      await signUpWithEmail(email, password, displayName, classGrade, accountRole);
      onClose();
    } catch (err: any) {
      const parsed = formatAuthError(err);
      setErrorMessage(parsed.message);
      setErrorCode(parsed.code);
    } finally {
      setIsLoading(false);
      setLoadingAction('');
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setErrorMessage(null);
    setErrorCode(null);

    if (!email.trim()) {
      setErrorMessage('Please enter the email address associated with your account.');
      return;
    }

    setIsLoading(true);
    setLoadingAction('Sending reset email...');
    try {
      await sendPasswordReset(email);
      setResetSent(true);
    } catch (err: any) {
      const parsed = formatAuthError(err);
      setErrorMessage(parsed.message);
      setErrorCode(parsed.code);
    } finally {
      setIsLoading(false);
      setLoadingAction('');
    }
  };

  const handleGoogleSignIn = async () => {
    if (isLoading) return;
    setErrorMessage(null);
    setErrorCode(null);
    setIsLoading(true);
    setLoadingAction('Opening Google Sign-In...');
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      const parsed = formatAuthError(err);
      setErrorMessage(parsed.message);
      setErrorCode(parsed.code);
    } finally {
      setIsLoading(false);
      setLoadingAction('');
    }
  };

  const handleInstantGuestSignIn = async () => {
    if (isLoading) return;
    setErrorMessage(null);
    setErrorCode(null);
    setIsLoading(true);
    setLoadingAction('Entering as Guest Student...');
    try {
      const guestName = displayName.trim() || 'Student Scholar';
      await signInAsGuestStudent(guestName, classGrade);
      onClose();
    } catch (err: any) {
      const parsed = formatAuthError(err);
      setErrorMessage(parsed.message);
      setErrorCode(parsed.code);
    } finally {
      setIsLoading(false);
      setLoadingAction('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in overflow-y-auto">
      <div className="bg-slate-950 border border-white/20 rounded-3xl max-w-md w-full p-6 sm:p-7 text-left space-y-5 shadow-2xl relative my-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg text-sm cursor-pointer transition-colors disabled:opacity-50"
          title="Close modal"
        >
          ✕
        </button>

        {/* Header with Brand Watermark */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src="/BuzzingBrain_Video_Watermark_150x150.png"
              alt="Buzzing Brain"
              className="w-12 h-12 rounded-full border-2 border-amber-400/80 shadow-md object-cover"
            />
            <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 p-1 rounded-full shadow-xs">
              <Lock className="w-2.5 h-2.5 font-bold" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-1.5">
              <span>
                {customTitle || (
                  isResetMode 
                    ? 'Reset Password' 
                    : mode === 'signin' 
                    ? 'Welcome Back!' 
                    : 'Join Buzzing Brain'
                )}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Free Education for All &bull; NCERT Handwritten Notes
            </p>
          </div>
        </div>

        {customDescription && !isResetMode && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs text-amber-300 leading-relaxed">
            {customDescription}
          </div>
        )}

        {/* Tab Switcher: Sign In vs Sign Up (hidden in reset mode) */}
        {!isResetMode ? (
          <div className="flex p-1 rounded-2xl bg-white/5 border border-white/10 text-xs font-semibold">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => {
                setMode('signin');
                setErrorMessage(null);
                setErrorCode(null);
              }}
              className={`flex-1 py-2 text-center rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'signin'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => {
                setMode('signup');
                setErrorMessage(null);
                setErrorCode(null);
              }}
              className={`flex-1 py-2 text-center rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'signup'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up (New Student)</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-white/10 pb-2">
            <button
              type="button"
              onClick={() => {
                setIsResetMode(false);
                setResetSent(false);
                setErrorMessage(null);
                setErrorCode(null);
              }}
              className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </button>
            <span className="text-[11px] text-slate-500">Self-service Recovery</span>
          </div>
        )}

        {/* Error Alert Display with Exact Firebase Error Code in Development */}
        {errorMessage && (
          <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-2xl text-xs text-rose-300 flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 text-left leading-relaxed">
              <div>{errorMessage}</div>
              {errorCode && (
                <div className="mt-1 font-mono text-[10px] text-rose-400/90 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/40 inline-block">
                  [AUTH code: {errorCode}]
                </div>
              )}
            </div>
          </div>
        )}

        {/* Diagnostic Guide for Admin-Restricted-Operation / Operation-Not-Allowed Error */}
        {(errorCode === 'auth/admin-restricted-operation' || errorCode === 'auth/operation-not-allowed') && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-200/90 space-y-2.5 animate-in fade-in">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>How to Fix in Firebase Console (Project fast-hexagon-7mn89):</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-300 leading-relaxed bg-black/40 p-2.5 rounded-xl border border-white/5">
              <li>
                Go to <span className="text-amber-300 font-semibold">Firebase Console</span> &rarr; open project <code className="text-amber-400 font-mono">fast-hexagon-7mn89</code>.
              </li>
              <li>
                Click <span className="text-white font-medium">Build</span> &rarr; <span className="text-white font-medium">Authentication</span>.
              </li>
              <li>
                Go to <span className="text-amber-300 font-medium">Settings</span> tab &rarr; <span className="text-white font-medium">User actions</span>.
              </li>
              <li>
                Turn ON <span className="text-emerald-400 font-semibold">"Enable create (sign-up)"</span> and click Save.
              </li>
              <li>
                In <span className="text-white font-medium">Sign-in method</span> tab, ensure <span className="text-amber-300 font-medium">Email/Password</span> and <span className="text-amber-300 font-medium">Anonymous</span> are enabled.
              </li>
            </ol>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <a
                href="https://console.firebase.google.com/project/fast-hexagon-7mn89/authentication"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-[11px] transition-colors"
              >
                <span>Open Firebase Authentication Console</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[11px] font-semibold transition-colors"
              >
                Try Google Sign-In Instead
              </button>
            </div>
          </div>
        )}

        {/* FORGOT PASSWORD FORM */}
        {isResetMode && (
          <form onSubmit={handlePasswordReset} className="space-y-3.5">
            {resetSent ? (
              <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-xs text-emerald-300 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Password Reset Link Dispatched!</span>
                </div>
                <p className="leading-relaxed">
                  We've sent an email to <strong>{email}</strong> with a link to reset your password. Please check your inbox and spam folder.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsResetMode(false);
                    setResetSent(false);
                  }}
                  className="mt-2 w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Enter the email address you registered with. We'll send you a secure link to reset your password.
                </p>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@example.com"
                      required
                      disabled={isLoading}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-bold rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  {isLoading ? (
                    <span>{loadingAction || 'Sending...'}</span>
                  ) : (
                    <span>Send Password Reset Email</span>
                  )}
                </button>
              </>
            )}
          </form>
        )}

        {/* SIGN IN FORM */}
        {!isResetMode && mode === 'signin' && (
          <form onSubmit={handleEmailSignIn} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  required
                  disabled={isLoading}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsResetMode(true);
                    setErrorMessage(null);
                    setErrorCode(null);
                  }}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-medium cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-amber-400 hover:bg-amber-300 disabled:opacity-60 text-slate-950 font-bold rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{loadingAction || 'Signing in...'}</span>
                </>
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In with Password</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* SIGN UP FORM */}
        {!isResetMode && mode === 'signup' && (
          <form onSubmit={handleEmailSignUp} className="space-y-3">
            {/* Account Type Selector: Student (default) or Teacher */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAccountRole('student')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    accountRole === 'student'
                      ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-bold'
                      : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAccountRole('teacher')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    accountRole === 'teacher'
                      ? 'bg-blue-500/25 border-blue-400 text-blue-300 font-bold'
                      : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Teacher / Educator</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Rohan Sharma"
                  required
                  disabled={isLoading}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Academic Class
                </label>
                <select
                  value={classGrade}
                  onChange={(e) => setClassGrade(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-3 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                  <option value="Class 11">Class 11</option>
                  <option value="Class 12">Class 12</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Target Exam
                </label>
                <div className="px-3 py-2.5 bg-slate-900/60 border border-white/10 rounded-xl text-xs text-slate-300">
                  CBSE / State Boards
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  required
                  disabled={isLoading}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Create Password (min. 6 characters)
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  disabled={isLoading}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-2.5 text-[11px] text-slate-400 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                disabled={isLoading}
                className="mt-0.5 rounded border-white/20 text-amber-400 focus:ring-amber-400"
              />
              <span>
                I accept Buzzing Brain's{' '}
                <button
                  type="button"
                  onClick={() => onOpenLegal?.('terms')}
                  className="text-amber-400 underline hover:text-amber-300"
                >
                  Terms &amp; Conditions
                </button>{' '}
                and{' '}
                <button
                  type="button"
                  onClick={() => onOpenLegal?.('privacy')}
                  className="text-amber-400 underline hover:text-amber-300"
                >
                  Privacy Policy
                </button>
                .
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-amber-400 hover:bg-amber-300 disabled:opacity-60 text-slate-950 font-bold rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{loadingAction || 'Creating student account...'}</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Create Free Account</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Alternative Providers: Google & Instant Guest */}
        {!isResetMode && (
          <div className="space-y-2.5 pt-1">
            <div className="relative flex items-center justify-center">
              <div className="border-t border-white/10 w-full"></div>
              <span className="bg-slate-950 px-3 text-[11px] text-slate-500 uppercase tracking-wider font-mono">
                or continue with
              </span>
              <div className="border-t border-white/10 w-full"></div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Google Sign-in */}
              <button
                type="button"
                disabled={isLoading}
                onClick={handleGoogleSignIn}
                className="py-2.5 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 disabled:opacity-60"
              >
                {isLoading && loadingAction.includes('Google') ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-white shrink-0" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
                    <span>Google</span>
                  </>
                )}
              </button>

              {/* Instant Guest Access */}
              <button
                type="button"
                disabled={isLoading}
                onClick={handleInstantGuestSignIn}
                className="py-2.5 px-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 disabled:opacity-60"
                title="Enter student portal immediately without email registration"
              >
                {isLoading && loadingAction.includes('Guest') ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400 shrink-0" />
                    <span>Entering...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Guest Student</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Free Education Ethos Footer */}
        <div className="text-[11px] text-slate-400 bg-white/5 p-3 rounded-2xl flex items-center justify-between border border-white/5">
          <span className="flex items-center gap-1.5 text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
            <span>100% Free Forever</span>
          </span>
          <span>&bull;</span>
          <span>Authentic NCERT Notes</span>
          <span>&bull;</span>
          <span>Free Education for All</span>
        </div>
      </div>
    </div>
  );
};
