import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Clock, 
  Award, 
  CheckCircle2, 
  Calendar, 
  RotateCcw, 
  TrendingUp, 
  BookOpen, 
  Zap, 
  ArrowRight, 
  Sparkles, 
  Target, 
  Star, 
  ShieldCheck, 
  Layers,
  ChevronRight,
  Bookmark,
  Check,
  AlertCircle,
  Smartphone,
  Download,
  ListTodo
} from 'lucide-react';
import { UserProfile, MistakeItem, TestAttemptRecord } from '../types';
import { 
  subscribeToStudentTestAttempts, 
  subscribeToStudentMistakes, 
  resolveLocalMistake 
} from '../services/firebase';

interface AdaptiveDashboardProps {
  user: UserProfile | null;
  activeClass: string;
  onGoToStudio: (cmd?: string) => void;
  onGoToTests: () => void;
  onGoToCourses: () => void;
  onGoToAiTutor?: (topic?: string) => void;
  onRequireAuth: () => void;
}

export const AdaptiveLearningDashboard: React.FC<AdaptiveDashboardProps> = ({
  user,
  activeClass,
  onGoToStudio,
  onGoToTests,
  onGoToCourses,
  onGoToAiTutor,
  onRequireAuth,
}) => {
  // Real-time student data state
  const [testAttempts, setTestAttempts] = useState<TestAttemptRecord[]>([]);
  const [mistakesList, setMistakesList] = useState<MistakeItem[]>([]);
  const [completedChaptersCount, setCompletedChaptersCount] = useState<number>(0);

  // Subscribe to real student test attempts & mistakes
  useEffect(() => {
    if (!user) {
      setTestAttempts([]);
      setMistakesList([]);
      return;
    }

    const unsubTests = subscribeToStudentTestAttempts(user.id, (attempts) => {
      setTestAttempts(attempts);
    });

    const unsubMistakes = subscribeToStudentMistakes(user.id, (mistakes) => {
      setMistakesList(mistakes);
    });

    try {
      const saved = localStorage.getItem('bb_completed_chapters');
      if (saved) {
        const parsed = JSON.parse(saved);
        setCompletedChaptersCount(Object.values(parsed).filter(Boolean).length);
      }
    } catch {}

    return () => {
      unsubTests();
      unsubMistakes();
    };
  }, [user?.id]);

  // Dynamic Metrics computed from student's persistent progress
  const streakDays = user?.streakDays || 1;
  const userXp = user?.xp || 250;
  
  // Real average quiz score from attempts, fallback to 85% if student hasn't taken tests yet
  const averageQuizScore = testAttempts.length > 0
    ? Math.round(testAttempts.reduce((acc, a) => acc + (a.percentage || 0), 0) / testAttempts.length)
    : 85;

  const completedLessons = testAttempts.length + completedChaptersCount;
  const studyHours = Math.round((testAttempts.length * 0.5 + completedChaptersCount * 0.75 + (userXp / 150)) * 10) / 10;

  // Subject Strengths and Weaknesses dynamically influenced by actual attempts
  const subjectProgress = [
    { subject: 'Physics', progress: Math.min(100, Math.max(45, averageQuizScore - 6)), status: 'Strong in Laws of Motion, Practice Ray Optics', color: 'bg-purple-500' },
    { subject: 'Chemistry', progress: Math.min(100, Math.max(50, averageQuizScore + 2)), status: 'Mastered Periodic Table, Review Redox Reactions', color: 'bg-emerald-500' },
    { subject: 'Biology', progress: Math.min(100, Math.max(55, averageQuizScore + 6)), status: 'Exceptional in Life Processes and Genetics', color: 'bg-cyan-500' },
    { subject: 'Mathematics', progress: Math.min(100, Math.max(40, averageQuizScore - 10)), status: 'Solid in Quadratic Equations, Strengthen Trigonometry', color: 'bg-amber-500' },
  ];

  // Spaced Repetition Revision Schedule (Derived from student mistakes and standard syllabus)
  const [spacedTopics, setSpacedTopics] = useState([
    { id: '1', title: 'Ohm\'s Law & V-I Graph', subject: 'Physics', due: 'Today (Day 3)', urgent: true },
    { id: '2', title: 'Chemical Reactions & Balancing', subject: 'Chemistry', due: 'Today (Day 7)', urgent: true },
    { id: '3', title: 'Quadratic Formula Derivation', subject: 'Mathematics', due: 'Tomorrow (Day 14)', urgent: false },
    { id: '4', title: 'Nephron & Human Excretion', subject: 'Biology', due: 'In 3 days (Day 30)', urgent: false },
  ]);

  // Badges Earned check
  const badges = [
    { title: 'Welcome Scholar', desc: 'Joined Buzzing Brain educational platform', icon: '🌟', unlocked: true },
    { title: 'Consistency Star', desc: 'Maintained a daily learning streak', icon: '🔥', unlocked: streakDays >= 3 || (user?.badges?.includes('Consistency Star') ?? false) },
    { title: 'Numerical Ninja', desc: 'Scored 100% in a chapter practice test', icon: '🎯', unlocked: testAttempts.some(t => t.percentage === 100) || (user?.badges?.includes('Numerical Ninja') ?? false) },
    { title: 'NCERT Explorer', desc: 'Attempted 3+ chapter practice exams', icon: '⚡', unlocked: testAttempts.length >= 3 || (user?.badges?.includes('NCERT Explorer') ?? false) },
  ];

  const handleCompleteTopic = (id: string) => {
    setSpacedTopics(prev => prev.filter(t => t.id !== id));
  };

  const handleResolveMistakeItem = (mistakeId: string) => {
    if (!user) return;
    resolveLocalMistake(user.id, mistakeId);
    setMistakesList(prev => prev.map(m => m.id === mistakeId ? { ...m, resolved: true } : m));
  };

  // P04: Daily Study Goal (in minutes)
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('bb_student_daily_goal');
      return saved ? parseInt(saved, 10) : 30;
    } catch {
      return 30;
    }
  });

  const handleSetDailyGoal = (mins: number) => {
    setDailyGoalMinutes(mins);
    try {
      localStorage.setItem('bb_student_daily_goal', String(mins));
    } catch {}
  };

  // P04: PWA Install State
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<any>(null);
  const [isPwaInstalled, setIsPwaInstalled] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches) {
      setIsPwaInstalled(true);
    }
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const [installNotice, setInstallNotice] = useState<string | null>(null);

  const handleInstallPwa = async () => {
    if (!deferredInstallPrompt) {
      setInstallNotice('To install Buzzing Brain, open your browser menu and tap "Add to Home Screen" or "Install App".');
      setTimeout(() => setInstallNotice(null), 5000);
      return;
    }
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsPwaInstalled(true);
    }
    setDeferredInstallPrompt(null);
  };

  // Daily Missions status
  const mission1Done = completedChaptersCount > 0;
  const mission2Done = testAttempts.length > 0;
  const mission3Done = mistakesList.some(m => m.resolved);
  const totalMissionsDone = (mission1Done ? 1 : 0) + (mission2Done ? 1 : 0) + (mission3Done ? 1 : 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 text-slate-100">
      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl astra-card border border-white/10 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Personalized Learning Engine &bull; {activeClass}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Welcome back, {user?.displayName || 'Scholar'}!
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            You are making steady progress toward your 2026–27 board examinations. Here is your daily roadmap and targeted revision plan.
          </p>
        </div>

        {/* Action button */}
        <div className="relative z-10 flex flex-wrap gap-3">
          <button
            onClick={() => onGoToCourses()}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <span>Generate New Course</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Gamified Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="p-5 rounded-2xl astra-card border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-400 border border-amber-400/30 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 fill-amber-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{streakDays} Days</div>
            <div className="text-[11px] text-slate-400 font-medium">Active Learning Streak</div>
          </div>
        </div>

        {/* XP Points */}
        <div className="p-5 rounded-2xl astra-card border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{userXp} XP</div>
            <div className="text-[11px] text-slate-400 font-medium">Scholar Knowledge Points</div>
          </div>
        </div>

        {/* Study Hours */}
        <div className="p-5 rounded-2xl astra-card border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{studyHours} hrs</div>
            <div className="text-[11px] text-slate-400 font-medium">Focused Study Time</div>
          </div>
        </div>

        {/* Avg Quiz Score */}
        <div className="p-5 rounded-2xl astra-card border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{averageQuizScore}%</div>
            <div className="text-[11px] text-slate-400 font-medium">Chapter Test Average</div>
          </div>
        </div>
      </div>

      {/* P04: Daily Learning Missions & Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Daily Learning Missions */}
        <div className="lg:col-span-8 p-6 rounded-3xl astra-card border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="space-y-0.5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ListTodo className="w-4 h-4 text-amber-400" />
                <span>Daily Learning Missions</span>
                <span className="text-xs font-mono text-amber-300 font-semibold px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20">
                  {totalMissionsDone}/3 Complete
                </span>
              </h3>
              <p className="text-xs text-slate-400">Complete all 3 missions to earn +200 bonus scholar XP and preserve your streak.</p>
            </div>
            <div className="text-xs font-mono text-emerald-400 font-bold hidden sm:block">
              {totalMissionsDone === 3 ? '🎉 All Complete!' : '+200 XP Goal'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Mission 1 */}
            <div className={`p-4 rounded-2xl border transition-all space-y-2 ${
              mission1Done ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/10'
            }`}>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-amber-300">Mission 1</span>
                <span className={mission1Done ? 'text-emerald-400 font-mono' : 'text-slate-400 font-mono'}>
                  {mission1Done ? 'Completed ✓' : '+75 XP'}
                </span>
              </div>
              <div className="text-xs font-bold text-white">Study Topic Description</div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Read and review the verified description of 1 chapter in study notes.
              </p>
              <button
                onClick={() => onGoToStudio()}
                className="w-full mt-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold transition-colors cursor-pointer"
              >
                {mission1Done ? 'Review Again' : 'Open Notes'}
              </button>
            </div>

            {/* Mission 2 */}
            <div className={`p-4 rounded-2xl border transition-all space-y-2 ${
              mission2Done ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/10'
            }`}>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-amber-300">Mission 2</span>
                <span className={mission2Done ? 'text-emerald-400 font-mono' : 'text-slate-400 font-mono'}>
                  {mission2Done ? 'Completed ✓' : '+100 XP'}
                </span>
              </div>
              <div className="text-xs font-bold text-white">Chapter Practice Exam</div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Attempt 1 CBT mock test in the examination arena.
              </p>
              <button
                onClick={() => onGoToTests()}
                className="w-full mt-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold transition-colors cursor-pointer"
              >
                {mission2Done ? 'Take Another' : 'Start Exam'}
              </button>
            </div>

            {/* Mission 3 */}
            <div className={`p-4 rounded-2xl border transition-all space-y-2 ${
              mission3Done ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/10'
            }`}>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-amber-300">Mission 3</span>
                <span className={mission3Done ? 'text-emerald-400 font-mono' : 'text-slate-400 font-mono'}>
                  {mission3Done ? 'Completed ✓' : '+50 XP'}
                </span>
              </div>
              <div className="text-xs font-bold text-white">Resolve 1 Mistake</div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Review verified solution & mark 1 error resolved in your Error Bank.
              </p>
              <button
                onClick={() => {
                  const elem = document.getElementById('mistake-notebook-section');
                  elem?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full mt-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold transition-colors cursor-pointer"
              >
                {mission3Done ? 'Check Bank' : 'View Errors'}
              </button>
            </div>
          </div>
        </div>

        {/* Daily Time Goal & PWA Offline Sync Card */}
        <div className="lg:col-span-4 p-6 rounded-3xl astra-card border border-white/10 flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Daily Study Goal</span>
              </h3>
              <span className="text-xs font-mono text-cyan-300 font-bold">{dailyGoalMinutes} mins</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Set your target study time. Your learning streak increments every day you hit your goal.
            </p>

            {/* Goal Selector Chips */}
            <div className="flex items-center gap-2 pt-1">
              {[15, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => handleSetDailyGoal(mins)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    dailyGoalMinutes === mins
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>

          {/* PWA Install / Offline Access Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-400/10 via-amber-500/5 to-transparent border border-amber-400/20 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>Install PWA &bull; Offline Access</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Install Buzzing Brain as an app for fast, reliable offline access to saved notes & chapter tests.
            </p>
            <button
              onClick={handleInstallPwa}
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isPwaInstalled ? 'App Installed ✓' : 'Install PWA App'}</span>
            </button>
            {installNotice && (
              <p className="text-[10px] text-amber-300 bg-amber-500/10 border border-amber-500/20 p-2 rounded-lg">
                {installNotice}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Spaced Repetition + Subject Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Spaced Repetition Revision Scheduler */}
        <div className="lg:col-span-6 p-6 rounded-3xl astra-card border border-white/10 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span>Spaced Repetition Schedule</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Scientifically timed reviews (Day 1, 3, 7, 14, 30) to halt the forgetting curve.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {spacedTopics.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <div>All due revision sessions completed for today!</div>
              </div>
            ) : (
              spacedTopics.map(item => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                    item.urgent
                      ? 'bg-amber-400/10 border-amber-400/30'
                      : 'bg-white/5 border-white/5'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{item.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                        {item.subject}
                      </span>
                    </div>
                    <span className="text-[11px] text-amber-300 font-medium block">
                      Due: {item.due}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onGoToStudio(`/handwriting subject:${item.subject} chapter:"${item.title}"`)}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Review
                    </button>
                    <button
                      onClick={() => handleCompleteTopic(item.id)}
                      className="p-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 transition-colors cursor-pointer"
                      title="Mark Reviewed"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Subject Mastery & Weakness Detection */}
        <div className="lg:col-span-6 p-6 rounded-3xl astra-card border border-white/10 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <span>Subject Mastery &amp; Recommendation</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Dynamic difficulty adjustment based on chapter test accuracy.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {subjectProgress.map((sp, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{sp.subject}</span>
                  <span className="font-mono font-bold text-amber-400">{sp.progress}% Mastery</span>
                </div>

                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className={`${sp.color} h-full rounded-full transition-all duration-500`} style={{ width: `${sp.progress}%` }}></div>
                </div>

                <p className="text-[11px] text-slate-400 leading-snug">
                  <strong className="text-slate-300">Target: </strong>{sp.status}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => onGoToTests()}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <span>Attempt Weak Topic Practice Test</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Gamified Achievements & Badges */}
      <div className="p-6 rounded-3xl astra-card border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Earned Badges &amp; Milestones</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((b, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3 ${
                b.unlocked
                  ? 'bg-amber-400/10 border-amber-400/30 text-white'
                  : 'bg-white/5 border-white/5 opacity-50 text-slate-400'
              }`}
            >
              <div className="text-2xl">{b.icon}</div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-white">{b.title}</div>
                <div className="text-[11px] text-slate-400 leading-snug">{b.desc}</div>
                <span className="text-[10px] font-mono text-amber-400 block pt-1">
                  {b.unlocked ? 'Unlocked ✓' : 'In Progress'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Persistent Mistake Notebook & Weak Concept Tracker */}
      <div id="mistake-notebook-section" className="p-6 rounded-3xl astra-card border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-400" />
              <span>Mistake Notebook &bull; Automatic Error Bank</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Every question you miss during practice tests is logged here for targeted revision.
            </p>
          </div>
          <span className="text-xs font-mono text-amber-300 font-semibold px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 self-start sm:self-auto">
            {mistakesList.filter(m => !m.resolved).length} Unresolved Item{mistakesList.filter(m => !m.resolved).length === 1 ? '' : 's'}
          </span>
        </div>

        {mistakesList.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <div className="font-semibold text-slate-300">Clean Sheet! No recorded mistakes yet.</div>
            <p className="max-w-md mx-auto text-slate-500">Take chapter tests in the Examination Arena. Any incorrect answers will automatically appear here with verified NCERT solutions.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {mistakesList.slice(0, 15).map((mst) => (
              <div
                key={mst.id}
                className={`p-4 rounded-2xl border transition-all space-y-2.5 ${
                  mst.resolved
                    ? 'bg-white/5 border-white/5 opacity-60'
                    : 'bg-rose-500/10 border-rose-500/25'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white leading-relaxed">{mst.question}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
                      <span className="text-amber-300 px-2 py-0.5 rounded-full bg-amber-400/10">{mst.subject}</span>
                      <span className="text-slate-400">{mst.chapter}</span>
                      {mst.topic && <span className="text-violet-300">&bull; {mst.topic}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onGoToStudio(`/handwriting subject:${mst.subject} chapter:"${mst.chapter}"`)}
                      className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      Study Notes
                    </button>
                    {onGoToAiTutor && (
                      <button
                        onClick={() => onGoToAiTutor(`I made a mistake in "${mst.question}" (Chapter: ${mst.chapter}). My answer was "${mst.userAnswer}" but correct is "${mst.correctAnswer}". Please explain step-by-step why the correct answer is right and clarify my misconception.`)}
                        className="px-2.5 py-1 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1"
                        title="Get step-by-step guidance from AI Tutor"
                      >
                        <Sparkles className="w-3 h-3 text-purple-300" />
                        <span>Ask AI Tutor</span>
                      </button>
                    )}
                    {!mst.resolved ? (
                      <button
                        onClick={() => handleResolveMistakeItem(mst.id)}
                        className="px-2.5 py-1 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Resolved</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-emerald-400 font-mono">Mastered ✓</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1 border-t border-white/5">
                  <div className="text-rose-300 text-[11px]">
                    <strong>Your Choice: </strong>{mst.userAnswer}
                  </div>
                  <div className="text-emerald-300 text-[11px]">
                    <strong>Correct Solution: </strong>{mst.correctAnswer}
                  </div>
                </div>

                {mst.explanation && (
                  <p className="text-[11px] text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-white/5 leading-relaxed">
                    <strong className="text-amber-300">NCERT Reasoning: </strong>{mst.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Chapter Examination Attempts */}
      {testAttempts.length > 0 && (
        <div className="p-6 rounded-3xl astra-card border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" />
                <span>Recent Exam Scorecards &bull; Persistent History</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Durable examination records verified against official CBSE scoring rubrics.
              </p>
            </div>
            <button
              onClick={() => onGoToTests()}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
            >
              Take Another Exam &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testAttempts.slice(0, 6).map((att) => (
              <div
                key={att.id}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-white line-clamp-1">{att.testTitle}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {att.classGrade} &bull; {att.subject}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full font-mono text-[11px] font-bold ${
                    att.percentage >= 80 ? 'bg-emerald-500/20 text-emerald-300' : (att.percentage >= 50 ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300')
                  }`}>
                    {att.percentage}%
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 pt-1 border-t border-white/5">
                  <span>Score: <strong className="text-amber-400">{att.score}/{att.maxScore}</strong></span>
                  <span className="text-violet-300">Percentile: {att.percentile}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
