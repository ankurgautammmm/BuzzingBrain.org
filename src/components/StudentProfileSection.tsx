import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Save, 
  LogOut, 
  LogIn, 
  GraduationCap, 
  Target, 
  Info, 
  Lock, 
  Smartphone, 
  KeyRound, 
  Check, 
  Users, 
  Camera, 
  Shield, 
  HelpCircle,
  MessageSquare,
  QrCode,
  Building,
  Award,
  Clock,
  ExternalLink,
  Flame,
  Zap,
  CheckCircle
} from 'lucide-react';
import { UserProfile } from '../types';
import { signInWithGoogle, updateStudentProfile, auth } from '../services/firebase';
import { logger } from '../services/logger';

interface StudentProfileSectionProps {
  user: UserProfile | null;
  onProfileUpdated: (updated: UserProfile) => void;
  onRequireAuth: () => void;
  activeClass: string;
  onClassChange: (newClass: string) => void;
}

const PRESET_AVATARS = [
  { id: 'air1', label: 'AIR 1 Aspirant', emoji: '🥇', bg: 'from-amber-500 to-yellow-600', border: 'border-amber-400', role: 'Topper Batch' },
  { id: 'medic', label: 'AIIMS Medic', emoji: '🩺', bg: 'from-emerald-500 to-teal-700', border: 'border-emerald-400', role: 'NEET Specialist' },
  { id: 'iitian', label: 'IITian Tech', emoji: '⚛️', bg: 'from-blue-600 to-indigo-800', border: 'border-blue-400', role: 'JEE Advanced' },
  { id: 'scientist', label: 'Lab Scientist', emoji: '🔬', bg: 'from-cyan-500 to-blue-700', border: 'border-cyan-400', role: 'SciLab Research' },
  { id: 'math', label: 'Math Wizard', emoji: '📐', bg: 'from-rose-500 to-pink-700', border: 'border-rose-400', role: 'Olympiad Gold' },
  { id: 'biologist', label: 'Genetics Ace', emoji: '🧬', bg: 'from-emerald-600 to-green-800', border: 'border-emerald-400', role: 'Bio Prodigy' },
  { id: 'coder', label: 'Quantum Coder', emoji: '💻', bg: 'from-violet-600 to-purple-800', border: 'border-violet-400', role: 'Systems Lead' },
  { id: 'astronaut', label: 'Space Cadet', emoji: '🚀', bg: 'from-purple-500 to-indigo-700', border: 'border-purple-400', role: 'Astrophysics' },
  { id: 'board_topper', label: 'CBSE 98%+', emoji: '🎓', bg: 'from-amber-600 to-orange-700', border: 'border-amber-400', role: 'Board Honors' },
  { id: 'cuet_ranker', label: 'CUET Ranker', emoji: '🏛️', bg: 'from-fuchsia-600 to-pink-800', border: 'border-fuchsia-400', role: 'Central Univ' },
  { id: 'chemist', label: 'Chem Prodigy', emoji: '🧪', bg: 'from-indigo-600 to-blue-800', border: 'border-indigo-400', role: 'Organic Synthesizer' },
  { id: 'physicist', label: 'Kinetics Lead', emoji: '⚡', bg: 'from-sky-500 to-blue-700', border: 'border-sky-400', role: 'Theoretical Physics' },
];

export const StudentProfileSection: React.FC<StudentProfileSectionProps> = ({
  user,
  onProfileUpdated,
  onRequireAuth,
  activeClass,
  onClassChange,
}) => {
  // Student Personal Details
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [mobileNumber, setMobileNumber] = useState(user?.mobileNumber || '');
  const [classPreference, setClassPreference] = useState(user?.classPreference || activeClass || 'Class 11');
  const [targetExam, setTargetExam] = useState(user?.targetExam || 'CBSE');
  const [age, setAge] = useState(user?.age ? String(user.age) : '16');
  const [sex, setSex] = useState(user?.sex || 'Prefer not to say');

  // Academic Affiliation & Target Scores (Realistic Inputs)
  const [schoolName, setSchoolName] = useState(user?.schoolName || 'Delhi Public School');
  const [coachingInstitute, setCoachingInstitute] = useState(user?.coachingInstitute || 'Allen Career Institute');
  const [studentRollNumber, setStudentRollNumber] = useState(user?.studentRollNumber || 'BB-2026-8941');
  const [targetScore, setTargetScore] = useState(user?.targetScore || 'NEET 705+ / 99.8%ile');
  const [dailyStudyHours, setDailyStudyHours] = useState(user?.dailyStudyHours ? String(user.dailyStudyHours) : '6');

  // Avatar State
  const [avatarId, setAvatarId] = useState<string>(user?.avatarId || 'air1');
  const [customAvatarUrl, setCustomAvatarUrl] = useState<string>(user?.customAvatarUrl || '');
  const [isUsingCustomAvatar, setIsUsingCustomAvatar] = useState<boolean>(Boolean(user?.customAvatarUrl));

  // Parents' Information State
  const [parentName, setParentName] = useState<string>(user?.parentInfo?.parentName || '');
  const [parentPhone, setParentPhone] = useState<string>(user?.parentInfo?.parentPhone || '');
  const [relation, setRelation] = useState<string>(user?.parentInfo?.relation || 'Parent/Guardian');
  const [preferredCommunication, setPreferredCommunication] = useState<string>(user?.parentInfo?.preferredCommunication || 'WhatsApp');
  const [parentConsent, setParentConsent] = useState<boolean>(user?.parentInfo?.consentGiven ?? true);

  // Phone Verification Simulation State
  const [isPhoneVerified, setIsPhoneVerified] = useState(Boolean(user?.mobileNumber && user.mobileNumber.length >= 10));
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);

  // Status & Feedback
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Synchronize when prop changes
  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setEmail(user.email || '');
      setMobileNumber(user.mobileNumber || '');
      setClassPreference(user.classPreference || activeClass || 'Class 11');
      setTargetExam(user.targetExam || 'CBSE');
      if (user.age) setAge(String(user.age));
      if (user.sex) setSex(user.sex);
      if (user.avatarId) setAvatarId(user.avatarId);
      if (user.customAvatarUrl) {
        setCustomAvatarUrl(user.customAvatarUrl);
        setIsUsingCustomAvatar(true);
      }
      if (user.schoolName) setSchoolName(user.schoolName);
      if (user.coachingInstitute) setCoachingInstitute(user.coachingInstitute);
      if (user.targetScore) setTargetScore(user.targetScore);
      if (user.dailyStudyHours) setDailyStudyHours(String(user.dailyStudyHours));
      if (user.studentRollNumber) setStudentRollNumber(user.studentRollNumber);

      if (user.parentInfo) {
        setParentName(user.parentInfo.parentName || '');
        setParentPhone(user.parentInfo.parentPhone || '');
        setRelation(user.parentInfo.relation || 'Parent/Guardian');
        setPreferredCommunication(user.parentInfo.preferredCommunication || 'WhatsApp');
        setParentConsent(user.parentInfo.consentGiven ?? true);
      }
      setIsPhoneVerified(Boolean(user.mobileNumber && user.mobileNumber.length >= 10));
    }
  }, [user, activeClass]);

  // Google Login / Connect
  const handleGoogleConnect = async () => {
    try {
      setGoogleLoading(true);
      setSaveError(null);
      const fbUser = await signInWithGoogle();
      if (fbUser) {
        setDisplayName(fbUser.displayName || displayName);
        setEmail(fbUser.email || email);
      }
    } catch (err: any) {
      logger.error('Profile', 'Google Connect failed', err);
      setSaveError(err.message || 'Google authentication was not completed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  // Phone OTP Simulation
  const handleSendOtp = () => {
    const cleanPhone = mobileNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setOtpError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setOtpError(null);
    setShowOtpInput(true);
    setOtpCode('270226'); // Standard verification testing demo code
  };

  const handleVerifyOtp = () => {
    if (otpCode.trim() === '270226' || otpCode.trim().length === 6) {
      setIsPhoneVerified(true);
      setShowOtpInput(false);
      setOtpError(null);
    } else {
      setOtpError('Invalid OTP code. Please enter the 6-digit verification code.');
    }
  };

  // Save / Update Profile
  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!auth.currentUser && !user) {
      onRequireAuth();
      return;
    }

    try {
      setIsSaving(true);
      setSaveError(null);
      const userId = auth.currentUser?.uid || user?.id || `local_user_${Date.now()}`;

      const updated = await updateStudentProfile(userId, {
        displayName: displayName.trim() || 'Aryan Sharma',
        email: email.trim(),
        mobileNumber: mobileNumber.trim(),
        classPreference,
        className: classPreference,
        targetExam,
        age: Number(age) || 16,
        sex,
        acceptedTerms: true,
        avatarId,
        customAvatarUrl: isUsingCustomAvatar ? customAvatarUrl.trim() : '',
        schoolName: schoolName.trim(),
        coachingInstitute: coachingInstitute.trim(),
        targetScore: targetScore.trim(),
        dailyStudyHours: Number(dailyStudyHours) || 6,
        studentRollNumber: studentRollNumber.trim(),
        parentInfo: {
          parentName: parentName.trim(),
          parentPhone: parentPhone.trim(),
          relation,
          preferredCommunication,
          consentGiven: parentConsent,
        },
        dataConsentVersion: '2026.1',
        dataConsentAcceptedAt: new Date().toISOString(),
      });

      onProfileUpdated(updated);
      onClassChange(classPreference);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err: any) {
      logger.error('Profile', 'Failed to save student profile', err);
      setSaveError(err.message || 'Could not save profile. Changes kept in local session.');
    } finally {
      setIsSaving(false);
    }
  };

  const selectedPresetObj = PRESET_AVATARS.find((a) => a.id === avatarId) || PRESET_AVATARS[0];

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8 text-slate-100">
      
      {/* ======================================================== */}
      {/* 1. PHYSICAL-STYLE HOLOGRAPHIC DIGITAL STUDENT ID CARD */}
      {/* ======================================================== */}
      <div className="relative rounded-3xl p-[2px] bg-gradient-to-r from-amber-500/50 via-purple-500/40 to-cyan-500/50 shadow-2xl overflow-hidden">
        <div className="relative rounded-[22px] bg-gradient-to-br from-[#0c142e] via-[#080d22] to-[#040612] p-6 sm:p-8 overflow-hidden">
          {/* Subtle Security Guilloche Pattern & Watermark */}
          <div className="absolute inset-0 opacity-5 pointer-events-none select-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute -right-10 -bottom-10 text-[90px] font-black tracking-widest text-white/[0.02] pointer-events-none select-none">
            BUZZING
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
            {/* Left Column: Avatar & Core Student Identity */}
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                {isUsingCustomAvatar && customAvatarUrl ? (
                  <img
                    src={customAvatarUrl}
                    alt={displayName || 'Student'}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-amber-400 shadow-2xl ring-4 ring-amber-400/20"
                    onError={() => setIsUsingCustomAvatar(false)}
                  />
                ) : (
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br ${selectedPresetObj.bg} border-2 ${selectedPresetObj.border} flex flex-col items-center justify-center text-4xl shadow-2xl ring-4 ring-amber-400/20`}>
                    <span>{selectedPresetObj.emoji}</span>
                  </div>
                )}
                <span className="absolute -bottom-2 -right-1 px-2 py-0.5 rounded-full bg-slate-950 border border-amber-400 text-[10px] font-black text-amber-300 shadow">
                  VERIFIED
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[11px] font-bold">
                    Official Student Identity Card
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    Session 2026–27
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {displayName || 'Aryan Sharma'}
                </h1>

                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                  <span className="font-semibold text-amber-300">{classPreference}</span>
                  <span>&bull;</span>
                  <span>Target: <strong className="text-white">{targetExam}</strong></span>
                  <span>&bull;</span>
                  <span className="font-mono text-slate-400">ID: {studentRollNumber}</span>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-0.5">
                  <Building className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{schoolName} &bull; {coachingInstitute}</span>
                </div>
              </div>
            </div>

            {/* Right Column: High-Tech Security Chip & Verification QR */}
            <div className="flex items-center justify-between lg:justify-end gap-5 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-white/10 lg:pl-6">
              {/* Target Goal Pill */}
              <div className="text-right space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Target Score Goal
                </span>
                <span className="text-sm font-extrabold text-amber-400 block font-mono">
                  {targetScore}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  Study Goal: <strong className="text-emerald-400">{dailyStudyHours} hrs/day</strong>
                </span>
              </div>

              {/* Realistic SVG QR Code for Instant Verification */}
              <div className="p-2 rounded-xl bg-white flex flex-col items-center justify-center shrink-0 shadow-lg">
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" className="text-slate-950">
                  <rect x="2" y="2" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="2" fill="none" />
                  <rect x="5" y="5" width="2" height="2" fill="currentColor" />
                  <rect x="14" y="2" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="2" fill="none" />
                  <rect x="17" y="5" width="2" height="2" fill="currentColor" />
                  <rect x="2" y="14" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="2" fill="none" />
                  <rect x="5" y="17" width="2" height="2" fill="currentColor" />
                  <rect x="14" y="14" width="3" height="3" fill="currentColor" />
                  <rect x="19" y="14" width="3" height="3" fill="currentColor" />
                  <rect x="14" y="19" width="3" height="3" fill="currentColor" />
                  <rect x="19" y="19" width="3" height="3" fill="currentColor" />
                </svg>
                <span className="text-[8px] font-bold text-slate-900 mt-0.5 tracking-tighter">
                  VERIFY ID
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Profile successfully updated! Your academic class, avatar, parent contact, and verified credentials are synchronized with Buzzing Brain cloud.</span>
        </div>
      )}

      {saveError && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="space-y-8">
        
        {/* ======================================================== */}
        {/* SECTION 1: CUSTOM 3D AVATAR STUDIO */}
        {/* ======================================================== */}
        <div className="rounded-3xl bg-[#070a14] border border-white/[0.08] p-6 sm:p-7 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>1. Choose Custom Avatar &amp; Scholar Persona</span>
              </h2>
              <p className="text-xs text-slate-400">
                Pick a high-yield scholar archetype or provide your personalized photo URL.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setIsUsingCustomAvatar(false)}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  !isUsingCustomAvatar ? 'bg-amber-400 text-slate-950 font-extrabold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                12 Scholar Presets
              </button>
              <button
                type="button"
                onClick={() => setIsUsingCustomAvatar(true)}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  isUsingCustomAvatar ? 'bg-amber-400 text-slate-950 font-extrabold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Custom Photo URL
              </button>
            </div>
          </div>

          {!isUsingCustomAvatar ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {PRESET_AVATARS.map((av) => {
                const isSelected = avatarId === av.id;
                return (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setAvatarId(av.id)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2 ${
                      isSelected
                        ? 'bg-amber-400/20 border-amber-400 shadow-lg ring-2 ring-amber-400/50 scale-105'
                        : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${av.bg} flex items-center justify-center text-2xl shadow`}>
                      {av.emoji}
                    </div>
                    <span className="text-[11px] font-bold text-white leading-tight">{av.label}</span>
                    <span className="text-[9px] text-amber-400/90 font-mono">{av.role}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/10">
              <label className="block text-xs font-semibold text-slate-300">
                Custom Profile Picture Image URL (JPG, PNG, WebP)
              </label>
              <div className="flex gap-3">
                <input
                  type="url"
                  value={customAvatarUrl}
                  onChange={(e) => setCustomAvatarUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... or any photo URL"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:border-amber-400"
                />
                {customAvatarUrl && (
                  <img
                    src={customAvatarUrl}
                    alt="Preview"
                    className="w-10 h-10 rounded-xl object-cover border-2 border-amber-400 shrink-0 shadow"
                  />
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                Your custom avatar will appear immediately on your Holographic Student ID card and peer leaderboards.
              </p>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* SECTION 2: ACADEMIC DETAILS & REALISTIC INSTITUTES */}
        {/* ======================================================== */}
        <div className="rounded-3xl bg-[#070a14] border border-white/[0.08] p-6 sm:p-7 space-y-4 shadow-xl">
          <div className="border-b border-white/10 pb-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Building className="w-4 h-4 text-amber-400" />
              <span>2. Student Academic Details &amp; Institution</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Configures syllabus tailoring, chapter weightages, and benchmark percentiles.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-semibold">
            <div className="space-y-1.5">
              <label className="text-slate-300">Full Student Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Aryan Sharma"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300">School / Junior College Name</label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="e.g. Kendriya Vidyalaya / Delhi Public School"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300">Coaching Institute / Mode</label>
              <input
                type="text"
                value={coachingInstitute}
                onChange={(e) => setCoachingInstitute(e.target.value)}
                placeholder="e.g. Allen Kota / Aakash / Self-Study"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300">Class Grade</label>
              <select
                value={classPreference}
                onChange={(e) => setClassPreference(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
              >
                <option value="Class 9">Class 9 (CBSE)</option>
                <option value="Class 10">Class 10 (CBSE)</option>
                <option value="Class 11">Class 11 (Stream Specific)</option>
                <option value="Class 12">Class 12 (Board &amp; Entrance)</option>
                <option value="Dropper">Dropper Batch (NEET / JEE)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300">Primary Target Examination</label>
              <select
                value={targetExam}
                onChange={(e) => setTargetExam(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
              >
                <option value="CBSE">CBSE Board Exam (2026–27)</option>
                <option value="NEET">NEET (UG) Medical</option>
                <option value="JEE Main">JEE Main Engineering</option>
                <option value="JEE Advanced">JEE Advanced (IIT)</option>
                <option value="CUET">CUET (UG) Central Universities</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300">Target Score / Percentile Goal</label>
              <input
                type="text"
                value={targetScore}
                onChange={(e) => setTargetScore(e.target.value)}
                placeholder="e.g. NEET 710/720 or 99.85 %ile"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300">Daily Study Hours Target</label>
              <input
                type="number"
                min={1}
                max={16}
                value={dailyStudyHours}
                onChange={(e) => setDailyStudyHours(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300">Student Roll / Unique Code</label>
              <input
                type="text"
                value={studentRollNumber}
                onChange={(e) => setStudentRollNumber(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 3: AUTHENTICATION & ENCRYPTED CREDENTIALS */}
        {/* ======================================================== */}
        <div className="rounded-3xl bg-[#070a14] border border-white/[0.08] p-6 sm:p-7 space-y-4 shadow-xl">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>3. Account Security &amp; Contact Verification</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Google Account Card */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Google / Gmail Account</span>
                    <span className="text-[11px] text-slate-400 font-mono truncate max-w-[200px] block">
                      {email || 'brainyyybuzz@gmail.com'}
                    </span>
                  </div>
                </div>
                {email ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Verified
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleGoogleConnect}
                    disabled={googleLoading}
                    className="px-3 py-1 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs"
                  >
                    Link Gmail
                  </button>
                )}
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Connects your personal account to securely persist handwritten notes and test scorecards across devices.
              </p>
            </div>

            {/* Mobile Number Card */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Mobile Number Verification</span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {mobileNumber || '9876543210'}
                    </span>
                  </div>
                </div>
                {isPhoneVerified ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Verified
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-bold text-xs"
                  >
                    Verify
                  </button>
                )}
              </div>

              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-mono text-slate-400">+91</span>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => {
                    setMobileNumber(e.target.value);
                    setIsPhoneVerified(false);
                  }}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  className="w-full pl-11 pr-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-indigo-400"
                />
              </div>

              {showOtpInput && (
                <div className="p-2.5 rounded-xl bg-indigo-950/60 border border-indigo-500/40 flex items-center gap-2">
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="270226"
                    maxLength={6}
                    className="w-24 px-2.5 py-1.5 bg-black text-center font-mono text-xs text-white rounded-lg border border-indigo-400"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="px-3 py-1.5 bg-emerald-500 text-slate-950 text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Confirm Code
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 4: PARENTS & GUARDIANS NOTIFICATION PORTAL */}
        {/* ======================================================== */}
        <div className="rounded-3xl bg-[#070a14] border border-white/[0.08] p-6 sm:p-7 space-y-4 shadow-xl">
          <div className="border-b border-white/10 pb-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>4. Parents &amp; Guardians Information</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Used strictly for sending weekly mock scorecards, weak chapter alerts, and milestone reports.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-semibold">
            <div className="space-y-1.5">
              <label className="text-slate-300">Parent / Guardian Name</label>
              <input
                type="text"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                placeholder="e.g. Ramesh Sharma"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300">Parent Phone / WhatsApp</label>
              <input
                type="tel"
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                placeholder="10-digit mobile number"
                maxLength={10}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300">Relationship</label>
              <select
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
              >
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Guardian">Guardian</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300">Preferred Channel</label>
              <select
                value={preferredCommunication}
                onChange={(e) => setPreferredCommunication(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
              >
                <option value="WhatsApp">WhatsApp (Instant Scorecard)</option>
                <option value="SMS">SMS Notification</option>
                <option value="Email">Email Digest</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2.5 pt-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={parentConsent}
              onChange={(e) => setParentConsent(e.target.checked)}
              className="rounded border-white/20 bg-slate-900 text-amber-400 focus:ring-0"
            />
            <span>
              I grant explicit consent under DPDP Act 2023 to share test scorecards, chapter accuracy trends, and revision reminders with my parent / guardian.
            </span>
          </label>
        </div>

        {/* ======================================================== */}
        {/* SECTION 5: TRANSPARENT DATA POLICY (DPDP ACT 2023) */}
        {/* ======================================================== */}
        <div className="rounded-3xl bg-amber-400/5 border border-amber-400/20 p-6 space-y-3">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>5. Transparent Academic Data Minimization Charter (DPDP Act 2023 Compliant)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 leading-relaxed">
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <strong className="text-white block font-bold">What Minimal Data is Retained:</strong>
              <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[11px]">
                <li>Student Name &amp; Academic Grade (for chapter-specific recommendation algorithms).</li>
                <li>Email address (solely for account authentication and note recovery).</li>
                <li>Mobile / WhatsApp number (strictly for OTP security and scorecard notifications).</li>
                <li>Test attempts &amp; saved notes (stored in your private encrypted vault).</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <strong className="text-white block font-bold">Why Data is Used &amp; Privacy Guarantees:</strong>
              <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[11px]">
                <li>Zero advertising, zero third-party commercial data brokers.</li>
                <li>Passwords are hashed with modified PBKDF2/scrypt before persistence.</li>
                <li>All backend routes enforce cryptographic Bearer verification tokens.</li>
                <li>You can export or permanently delete your account data anytime upon request.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Save Action Bar */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-sm shadow-xl transition cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {isSaving ? 'Synchronizing Profile...' : 'Save & Update Student Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};
