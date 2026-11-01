import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  User, 
  Calendar, 
  Phone, 
  Mail, 
  Target, 
  ShieldCheck, 
  Shield,
  Check, 
  ArrowRight, 
  Lock,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { UserProfile } from '../types';

export interface StudentProfileFormDetails {
  className: string;
  classPreference: string;
  displayName: string;
  age: number | string;
  sex: string;
  mobileNumber: string;
  email: string;
  targetExam: string;
  acceptedTerms: boolean;
  role?: 'student' | 'teacher' | 'admin';
}

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (details: StudentProfileFormDetails) => Promise<void>;
  onClose?: () => void;
  userProfile?: UserProfile | null;
  userEmail?: string;
  userName?: string;
  onOpenLegalModal: (tab: 'terms' | 'privacy') => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  onClose,
  userProfile,
  userEmail,
  userName,
  onOpenLegalModal,
}) => {
  const [className, setClassName] = useState<string>(userProfile?.classPreference || userProfile?.className || 'Class 10');
  const [displayName, setDisplayName] = useState<string>(userProfile?.displayName || userName || '');
  const [age, setAge] = useState<string>(userProfile?.age ? String(userProfile.age) : '16');
  const [sex, setSex] = useState<string>(userProfile?.sex || 'Male');
  const [mobileNumber, setMobileNumber] = useState<string>(userProfile?.mobileNumber || '');
  const [email, setEmail] = useState<string>(userProfile?.email || userEmail || '');
  const [targetExam, setTargetExam] = useState<string>(userProfile?.targetExam || 'CBSE Board Exam');
  const [role, setRole] = useState<'student' | 'teacher' | 'admin'>(userProfile?.role || 'student');
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(userProfile?.acceptedTerms || false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (userProfile) {
      if (userProfile.classPreference || userProfile.className) {
        setClassName(userProfile.classPreference || userProfile.className || 'Class 10');
      }
      if (userProfile.displayName) setDisplayName(userProfile.displayName);
      if (userProfile.age) setAge(String(userProfile.age));
      if (userProfile.sex) setSex(userProfile.sex);
      if (userProfile.mobileNumber) setMobileNumber(userProfile.mobileNumber);
      if (userProfile.email) setEmail(userProfile.email);
      if (userProfile.targetExam) setTargetExam(userProfile.targetExam);
      if (userProfile.role) setRole(userProfile.role);
    } else if (userEmail) {
      setEmail(userEmail);
    }
    if (userName && !displayName) {
      setDisplayName(userName);
    }
  }, [userProfile, userEmail, userName]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!displayName.trim()) {
      setValidationError('Please enter your full name.');
      return;
    }
    if (!age || Number(age) <= 0 || Number(age) > 100) {
      setValidationError('Please enter a valid age between 10 and 99.');
      return;
    }
    if (!mobileNumber.trim() || mobileNumber.trim().length < 8) {
      setValidationError('Please enter a valid mobile number with at least 8 digits.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setValidationError('Please enter a valid email address.');
      return;
    }
    if (!acceptedTerms) {
      setValidationError('Please agree to the educational guidelines and terms to proceed.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onComplete({
        className,
        classPreference: className,
        displayName: displayName.trim(),
        age: Number(age) || age,
        sex,
        mobileNumber: mobileNumber.trim(),
        email: email.trim(),
        targetExam,
        acceptedTerms: true,
        role,
      });
    } catch (err: any) {
      setValidationError(err?.message || 'Failed to save student profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in overflow-y-auto">
      <div className="bg-slate-950 rounded-3xl max-w-xl w-full shadow-2xl border border-white/20 overflow-hidden flex flex-col my-auto text-left">
        {/* Top Branding Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/BuzzingBrain_Video_Watermark_150x150.png"
              alt="Buzzing Brain"
              className="w-10 h-10 rounded-full border-2 border-amber-400/80 shadow-md object-cover"
            />
            <div>
              <h3 className="font-extrabold text-white text-base tracking-tight flex items-center gap-2">
                <span>Student Academic Profile</span>
                <span className="text-[10px] font-mono uppercase bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                  Profile
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                NCERT Handwritten Notes &bull; Chapter Tests Portal
              </p>
            </div>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 text-sm transition-colors cursor-pointer"
              title="Close modal"
            >
              ✕
            </button>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white">
              Set Up Your Student Profile 🎓
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Please provide your academic details so notes, syllabus weightage, and assessments are customized for your grade and exam target.
            </p>
          </div>

          {validationError && (
            <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-2xl text-xs text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Account Role Selector */}
          <div className="space-y-1.5 text-xs">
            <label className="text-slate-300 font-medium flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Account Role</span>
              </span>
              {role === 'admin' && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Administrator
                </span>
              )}
            </label>
            {role === 'admin' ? (
              <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 text-xs">
                Platform Administrator (Access to all teacher, student &amp; admin controls)
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    role === 'student'
                      ? 'border-amber-400 bg-amber-400/15 text-white font-bold'
                      : 'border-white/10 bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Student</span>
                    </span>
                    {role === 'student' && <Check className="w-3 h-3 text-amber-400" />}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Study notes, textbooks &amp; practice</div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('teacher')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    role === 'teacher'
                      ? 'border-blue-400 bg-blue-500/20 text-white font-bold'
                      : 'border-white/10 bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-blue-400" />
                      <span>Teacher / Educator</span>
                    </span>
                    {role === 'teacher' && <Check className="w-3 h-3 text-blue-400" />}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Classroom portal &amp; lab review</div>
                </button>
              </div>
            )}
          </div>

          {/* Grid of Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            {/* 1. Class / Academic Grade */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                <span>Academic Class <span className="text-rose-400">*</span></span>
              </label>
              <select
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                required
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="Class 9">Class 9 (CBSE 2026–27)</option>
                <option value="Class 10">Class 10 (Board Exam)</option>
                <option value="Class 11">Class 11 (Senior Secondary)</option>
                <option value="Class 12">Class 12 (Board &amp; Entrance)</option>
                <option value="Dropper / Target">Dropper / Target Batch</option>
              </select>
            </div>

            {/* 2. Full Name */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>Full Name <span className="text-rose-400">*</span></span>
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Rohan Sharma"
                required
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* 3. Age */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Age <span className="text-rose-400">*</span></span>
              </label>
              <input
                type="number"
                min="10"
                max="99"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 16"
                required
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* 4. Sex / Gender */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>Sex / Gender <span className="text-rose-400">*</span></span>
              </label>
              <select
                value={sex}
                onChange={(e) => setSex(e.target.value)}
                required
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            {/* 5. Mobile Number */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Mobile Number <span className="text-rose-400">*</span></span>
              </label>
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="+91 98765 43210"
                required
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* 6. Email ID */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>Email ID <span className="text-rose-400">*</span></span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                required
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* 7. Target Exam */}
          <div className="space-y-1.5 pt-1 text-xs">
            <label className="text-slate-300 font-medium flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-amber-400" />
              <span>Target Examination <span className="text-rose-400">*</span></span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                'CBSE Board Exam',
                'NEET (Medical)',
                'JEE (Engineering)',
                'State Board Exams',
                'CUET Entrance',
                'Foundation & Olympiad',
              ].map((exam) => (
                <button
                  type="button"
                  key={exam}
                  onClick={() => setTargetExam(exam)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    targetExam === exam
                      ? 'border-amber-400 bg-amber-400/15 text-white font-bold'
                      : 'border-white/10 bg-slate-900 text-slate-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{exam}</span>
                    {targetExam === exam && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-1" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 8. Terms & Policy acceptance */}
          <div className="pt-2 border-t border-white/10">
            <label className="flex items-start gap-2.5 text-xs text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 rounded border-white/20 bg-slate-900 text-amber-400 focus:ring-0"
              />
              <span className="text-[11px] leading-snug">
                I agree to the educational guidelines,{' '}
                <button
                  type="button"
                  onClick={() => onOpenLegalModal('terms')}
                  className="text-amber-400 hover:underline font-medium"
                >
                  Terms &amp; Conditions
                </button>{' '}
                and{' '}
                <button
                  type="button"
                  onClick={() => onOpenLegalModal('privacy')}
                  className="text-amber-400 hover:underline font-medium"
                >
                  Privacy Policy
                </button>.
              </span>
            </label>
          </div>

          {/* Submit Button & Optional Skip */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={isSubmitting || !acceptedTerms}
              className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-bold rounded-2xl text-xs transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              {isSubmitting ? (
                <span>Saving Profile &amp; Entering Portal...</span>
              ) : (
                <>
                  <span>Save Profile &amp; Enter Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 bg-transparent hover:bg-white/5 text-slate-400 hover:text-white rounded-xl text-xs font-medium transition-colors cursor-pointer"
              >
                Explore Platform (Complete Profile Later)
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
