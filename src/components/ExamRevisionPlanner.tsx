import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  Target, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  ArrowRight, 
  Flame, 
  TrendingUp, 
  RotateCcw, 
  Layers, 
  Award,
  ChevronRight,
  Filter,
  Download,
  Share2,
  Plus,
  Trash2,
  Check,
  CalendarCheck,
  ListTodo,
  Tag,
  AlertTriangle,
  Settings2,
  CalendarRange,
  Zap,
  Info,
  Edit3,
  RefreshCw
} from 'lucide-react';
import { UserProfile } from '../types';
import { NCERT_SYLLABUS } from '../data/ncertSyllabus';
import { awardStudentXP } from '../services/firebase';
import { dispatchStudentNotification } from './NotificationCenter';
import { 
  getExamCatalogForYear, 
  calculateExamCountdown, 
  generateRealisticStudyPlan,
  computePlannerStats,
  PlannerTask,
  ExamDefinition,
  DateAuthority,
  StudentStudyPreferences,
  CountdownResult
} from '../utils/examPlannerEngine';

interface ExamRevisionPlannerProps {
  user: UserProfile | null;
  activeClass: string;
  onGoToStudio?: (cmd: string) => void;
  onGoToTests?: () => void;
  onRequireAuth: () => void;
}

const TASKS_STORAGE_KEY = 'buzzingbrain_study_tasks';
const PREFERENCES_STORAGE_KEY = 'buzzingbrain_planner_prefs';
const COMPLETED_CHAPTERS_KEY = 'bb_completed_chapters';

export const ExamRevisionPlanner: React.FC<ExamRevisionPlannerProps> = ({
  user,
  activeClass,
  onGoToStudio,
  onGoToTests,
  onRequireAuth,
}) => {
  // Navigation tabs inside Planner: 'tasks' | 'countdown' | 'syllabus' | 'preferences'
  const [plannerTab, setPlannerTab] = useState<'tasks' | 'countdown' | 'syllabus' | 'preferences'>('tasks');

  // Configurable Exam Target Year: 2025, 2026, 2027, 2028 (Default 2026)
  const [targetYear, setTargetYear] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.targetYear) return Number(parsed.targetYear);
      }
    } catch {}
    return 2027; // Default to 2027-28 Academic Examination Session
  });

  // Target Exam Selection based on class
  const defaultTargetKey = activeClass === 'Class 12' 
    ? 'cbse-12' 
    : (activeClass === 'Class 10' ? 'cbse-10' : 'neet-ug');
  
  const [selectedExamKey, setSelectedExamKey] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.selectedExamKey) return parsed.selectedExamKey;
      }
    } catch {}
    return defaultTargetKey;
  });

  // Custom User-configured Exam Date (optional override)
  const [customExamDate, setCustomExamDate] = useState<string>('');

  // Daily Available Study Hours (1 to 8 hours)
  const [dailyStudyHours, setDailyStudyHours] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.dailyStudyHours) return Number(parsed.dailyStudyHours);
      }
    } catch {}
    return 3;
  });

  // Weak Topics requiring priority focus
  const [weakTopics, setWeakTopics] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.weakTopics)) return parsed.weakTopics;
      }
    } catch {}
    return ['Chemical Reactions and Equations', 'Optics', 'Calculus'];
  });

  const [includeSundayMocks, setIncludeSundayMocks] = useState<boolean>(true);
  const [studyPace, setStudyPace] = useState<'balanced' | 'rapid_sprint' | 'deep_practice'>('balanced');

  // Catalog for current target year
  const catalog = useMemo(() => getExamCatalogForYear(targetYear), [targetYear]);
  const targetInfo: ExamDefinition = catalog[selectedExamKey] || catalog['cbse-10'];
  const effectiveExamDate = customExamDate || targetInfo.targetDate;

  // Chapter Completion Tracking in LocalStorage
  const [completedChapters, setCompletedChapters] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(COMPLETED_CHAPTERS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Study Tasks State
  const [tasks, setTasks] = useState<PlannerTask[]>(() => {
    try {
      const stored = localStorage.getItem(TASKS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}

    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    return [
      {
        id: 'task_default_1',
        title: 'Review Chemical Reactions & Equations (NCERT Definitions & Balancing)',
        subject: 'Chemistry',
        chapter: 'Chemical Reactions and Equations',
        dueDate: todayStr,
        priority: 'high',
        type: 'concept_study',
        estimatedMinutes: 60,
        completed: false,
        createdAt: new Date().toISOString(),
        notes: 'State symbols and conservation of mass.',
      },
      {
        id: 'task_default_2',
        title: 'Attempt 10-Question MCQ Quiz on Ohm\'s Law and Resistance',
        subject: 'Physics',
        chapter: 'Electricity',
        dueDate: todayStr,
        priority: 'high',
        type: 'quiz_practice',
        estimatedMinutes: 30,
        completed: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'task_default_3',
        title: 'Complete 3D Onion Peel Cell Mount Observation Table in Practical Journal',
        subject: 'Biology',
        chapter: 'The Fundamental Unit of Life: Cell',
        dueDate: tomorrowStr,
        priority: 'medium',
        type: 'practical_log',
        estimatedMinutes: 45,
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ];
  });

  // Task Creation & Editing Modal State
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<PlannerTask | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskSubject, setTaskSubject] = useState('Physics');
  const [taskDueDate, setTaskDueDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [taskPriority, setTaskPriority] = useState<'high' | 'medium' | 'low'>('high');
  const [taskType, setTaskType] = useState<PlannerTask['type']>('concept_study');
  const [taskEstimatedMins, setTaskEstimatedMins] = useState<number>(45);

  // Filters
  const [taskFilterStatus, setTaskFilterStatus] = useState<'all' | 'pending' | 'completed' | 'overdue'>('all');
  const [taskFilterSubject, setTaskFilterSubject] = useState<string>('All');
  const [activeSubjectTab, setActiveSubjectTab] = useState<string>('All');

  // Live Countdown State
  const [countdown, setCountdown] = useState<CountdownResult>(() => 
    calculateExamCountdown(effectiveExamDate)
  );

  // Sync tasks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    } catch {}
  }, [tasks]);

  // Sync preferences to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify({
        targetYear,
        selectedExamKey,
        dailyStudyHours,
        weakTopics,
        includeSundayMocks,
        studyPace,
      }));
    } catch {}
  }, [targetYear, selectedExamKey, dailyStudyHours, weakTopics, includeSundayMocks, studyPace]);

  // Live Timer Countdown Effect
  useEffect(() => {
    const update = () => {
      setCountdown(calculateExamCountdown(effectiveExamDate));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [effectiveExamDate]);

  // Toggle chapter completion in syllabus tracker
  const toggleChapter = (chapterKey: string) => {
    setCompletedChapters((prev) => {
      const updated = { ...prev, [chapterKey]: !prev[chapterKey] };
      try {
        localStorage.setItem(COMPLETED_CHAPTERS_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Add / Edit Task Handler
  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    if (editingTask) {
      // Edit existing
      setTasks(prev => prev.map(t => t.id === editingTask.id ? {
        ...t,
        title: taskTitle.trim(),
        subject: taskSubject,
        dueDate: taskDueDate,
        priority: taskPriority,
        type: taskType,
        estimatedMinutes: taskEstimatedMins,
      } : t));
    } else {
      // Create new
      const newTask: PlannerTask = {
        id: `task_custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        title: taskTitle.trim(),
        subject: taskSubject,
        dueDate: taskDueDate,
        priority: taskPriority,
        type: taskType,
        estimatedMinutes: taskEstimatedMins,
        completed: false,
        isUserCustom: true,
        createdAt: new Date().toISOString(),
      };
      setTasks(prev => [newTask, ...prev]);
    }

    setEditingTask(null);
    setTaskTitle('');
    setShowTaskModal(false);

    dispatchStudentNotification({
      title: editingTask ? 'Task Rescheduled' : 'Study Task Scheduled',
      message: `"${taskTitle.trim()}" set for ${taskDueDate}.`,
      type: 'task_reminder',
      targetTab: 'planner',
    });
  };

  // Open Edit Modal for a task
  const handleOpenEdit = (task: PlannerTask) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskSubject(task.subject);
    setTaskDueDate(task.dueDate);
    setTaskPriority(task.priority);
    setTaskType(task.type);
    setTaskEstimatedMins(task.estimatedMinutes || 45);
    setShowTaskModal(true);
  };

  // Toggle task completion with celebratory XP
  const handleToggleTask = async (taskId: string) => {
    const target = tasks.find(t => t.id === taskId);
    if (!target) return;

    const nextCompleted = !target.completed;
    setTasks(prev => prev.map(t => t.id === taskId ? {
      ...t,
      completed: nextCompleted,
      completedAt: nextCompleted ? new Date().toISOString() : undefined
    } : t));

    if (nextCompleted) {
      if (user) {
        awardStudentXP(user.id, 25).catch(() => {});
      }
      dispatchStudentNotification({
        title: 'Task Completed! (+25 XP)',
        message: `Outstanding work on "${target.title}". Keep up the consistent study routine!`,
        type: 'test_result',
        targetTab: 'planner',
      });
    }
  };

  // Delete Task
  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // Generate / Regenerate Realistic Plan from Engine
  const handleGeneratePlan = () => {
    const preferences: StudentStudyPreferences = {
      dailyStudyHours,
      targetYear,
      selectedExamKey,
      customExamDate: customExamDate || undefined,
      weakTopics,
      studyPace,
      includeSundayMocks,
      bufferDaysPerMonth: 2,
    };

    const newTasks = generateRealisticStudyPlan({
      preferences,
      completedChapters,
      existingTasks: tasks,
    });

    setTasks(newTasks);
    setPlannerTab('tasks');

    dispatchStudentNotification({
      title: 'Study Schedule Generated',
      message: `Personalized schedule ready with ${newTasks.length} tasks capped at ${dailyStudyHours} hours/day.`,
      type: 'task_reminder',
      targetTab: 'planner',
    });
  };

  // Automatically reschedule overdue tasks to upcoming available slots
  const handleRescheduleOverdue = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const overdue = tasks.filter(t => !t.completed && t.dueDate < todayStr);
    if (overdue.length === 0) return;

    // Shift each overdue task forward starting tomorrow
    let dayOffset = 1;
    const tomorrow = new Date(Date.now() + 86400000);
    const updated = tasks.map(t => {
      if (!t.completed && t.dueDate < todayStr) {
        const nextDate = new Date(tomorrow.getTime() + (dayOffset % 5) * 86400000).toISOString().split('T')[0];
        dayOffset++;
        return { ...t, dueDate: nextDate };
      }
      return t;
    });

    setTasks(updated);
    dispatchStudentNotification({
      title: 'Overdue Tasks Rescheduled',
      message: `Shifted ${overdue.length} overdue task(s) into your upcoming study days.`,
      type: 'task_reminder',
      targetTab: 'planner',
    });
  };

  // Compute Planner Statistics
  const stats = useMemo(() => 
    computePlannerStats(tasks, completedChapters, selectedExamKey, targetYear),
    [tasks, completedChapters, selectedExamKey, targetYear]
  );

  // Filter tasks for view
  const todayDateString = new Date().toISOString().split('T')[0];
  const filteredTasks = tasks.filter(t => {
    if (taskFilterSubject !== 'All' && t.subject !== taskFilterSubject) return false;
    if (taskFilterStatus === 'completed' && !t.completed) return false;
    if (taskFilterStatus === 'pending' && t.completed) return false;
    if (taskFilterStatus === 'overdue' && (t.completed || t.dueDate >= todayDateString)) return false;
    return true;
  });

  // Top priorities for today
  const todayTasks = tasks.filter(t => t.dueDate === todayDateString && !t.completed);

  // Available subjects from syllabus for class
  const classSyllabus = NCERT_SYLLABUS[targetInfo.classGrade as keyof typeof NCERT_SYLLABUS] || {};
  const availableSubjects = Object.keys(classSyllabus);

  return (
    <div className="w-full max-w-6xl mx-auto py-8 space-y-8 text-slate-100">
      {/* Top Banner Navigation: Tasks vs Countdown vs Syllabus vs Preferences */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-2">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Academic Command &amp; Study Planner</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Study Planner &amp; Exam Engine
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Targeting: <strong className="text-amber-300">{targetInfo.name}</strong> ({targetYear}) &bull; {targetInfo.authority === 'OFFICIALLY_ANNOUNCED' ? 'Official' : 'Tentative Projected'}
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-white/10 rounded-2xl flex-wrap">
          <button
            onClick={() => setPlannerTab('tasks')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              plannerTab === 'tasks'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <ListTodo className="w-4 h-4" />
            <span>Tasks ({stats.pendingTasks})</span>
          </button>
          <button
            onClick={() => setPlannerTab('countdown')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              plannerTab === 'countdown'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Exam Clocks</span>
          </button>
          <button
            onClick={() => setPlannerTab('syllabus')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              plannerTab === 'syllabus'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Syllabus Tracker</span>
          </button>
          <button
            onClick={() => setPlannerTab('preferences')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              plannerTab === 'preferences'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Settings2 className="w-4 h-4" />
            <span>Configure Plan</span>
          </button>
        </div>
      </div>

      {/* Authority Banner */}
      <div className={`p-3.5 rounded-2xl border flex items-start gap-3 text-xs leading-relaxed ${
        targetInfo.authority === 'OFFICIALLY_ANNOUNCED'
          ? 'bg-blue-950/40 border-blue-500/30 text-blue-200'
          : 'bg-amber-950/30 border-amber-500/30 text-amber-200'
      }`}>
        <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold">
              {targetInfo.authority === 'OFFICIALLY_ANNOUNCED' ? 'Official Examination Notification' : 'Tentative Academic Schedule'}
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-black/30 font-bold">
              Target Year: {targetYear}
            </span>
          </div>
          <p className="mt-0.5 text-slate-300">
            {targetInfo.authorityNote} You can adjust your target year, daily hours, and dates under the <strong>Configure Plan</strong> tab.
          </p>
        </div>
      </div>

      {/* VIEW 1: STUDY TASKS & SCHEDULE */}
      {plannerTab === 'tasks' && (
        <div className="space-y-6">
          {/* Overdue Warning & Quick Recovery Action */}
          {stats.overdueTasks > 0 && (
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                <div>
                  <div className="font-bold text-rose-200 text-sm">
                    {stats.overdueTasks} Overdue Task{stats.overdueTasks > 1 ? 's' : ''} Need Attention
                  </div>
                  <div className="text-xs text-rose-300/80">
                    Missed a study session? Recalculate and shift them into upcoming open slots without stress.
                  </div>
                </div>
              </div>
              <button
                onClick={handleRescheduleOverdue}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shrink-0 cursor-pointer shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reschedule to Upcoming Days</span>
              </button>
            </div>
          )}

          {/* Today's Focus Priorities Banner if tasks exist today */}
          {todayTasks.length > 0 && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-600/10 to-transparent border border-amber-400/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
                  <h3 className="font-bold text-white text-sm sm:text-base">Today's Focus ({todayTasks.length} Planned)</h3>
                </div>
                <span className="text-xs font-mono text-amber-300 font-bold">
                  Est: {todayTasks.reduce((acc, t) => acc + (t.estimatedMinutes || 45), 0)} mins
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {todayTasks.slice(0, 4).map(t => (
                  <div key={t.id} className="p-3 bg-slate-950/80 rounded-xl border border-white/10 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <button
                        onClick={() => handleToggleTask(t.id)}
                        className="w-4 h-4 rounded border border-amber-400/60 hover:bg-amber-400/20 flex items-center justify-center cursor-pointer shrink-0"
                      >
                        <Check className="w-3 h-3 text-transparent hover:text-amber-400" />
                      </button>
                      <span className="text-xs font-medium text-slate-200 truncate">{t.title}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 shrink-0">
                      {t.estimatedMinutes || 45}m
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* KPI Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 shadow-xs">
              <div className="text-xs text-slate-400 font-semibold">Pending Tasks</div>
              <div className="text-2xl font-black text-amber-400 mt-0.5">{stats.pendingTasks}</div>
              <div className="text-[10px] text-slate-500 mt-1">~{stats.estimatedHoursRemaining}h remaining</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 shadow-xs">
              <div className="text-xs text-slate-400 font-semibold">Completed</div>
              <div className="text-2xl font-black text-emerald-400 mt-0.5">{stats.completedTasks}</div>
              <div className="text-[10px] text-slate-500 mt-1">{stats.completionPercentage}% of scheduled</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 shadow-xs">
              <div className="text-xs text-slate-400 font-semibold">Syllabus Covered</div>
              <div className="text-2xl font-black text-sky-400 mt-0.5">{stats.syllabusCoveredCount} / {stats.totalSyllabusCount}</div>
              <div className="text-[10px] text-slate-500 mt-1">{stats.syllabusPercentage}% syllabus done</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-xs text-slate-400 font-semibold">Daily Study Cap</div>
                <div className="text-2xl font-black text-white mt-0.5">{dailyStudyHours} hrs/day</div>
              </div>
              <button
                onClick={() => setPlannerTab('preferences')}
                className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 cursor-pointer mt-1"
              >
                <span>Adjust in Settings</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Filter Bar & Add Task */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/60 rounded-2xl border border-white/10 text-xs">
            {/* Status Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {[
                { id: 'all', label: 'All Tasks' },
                { id: 'pending', label: 'In Progress' },
                { id: 'completed', label: 'Completed' },
                { id: 'overdue', label: 'Overdue' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setTaskFilterStatus(f.id as any)}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer ${
                    taskFilterStatus === f.id
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white bg-white/5'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <select
                value={taskFilterSubject}
                onChange={(e) => setTaskFilterSubject(e.target.value)}
                className="bg-slate-950 border border-white/10 rounded-xl px-2.5 py-1.5 text-white font-medium focus:outline-none focus:border-amber-400"
              >
                <option value="All">All Subjects</option>
                {availableSubjects.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>

              <button
                onClick={() => {
                  setEditingTask(null);
                  setTaskTitle('');
                  setShowTaskModal(true);
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
            </div>
          </div>

          {/* Task List */}
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="py-16 text-center space-y-3 astra-card border border-white/10 rounded-3xl">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h3 className="text-base font-bold text-white">No tasks matching your current view</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Generate a personalized curriculum schedule or add custom tasks to keep your revision momentum going.
                </p>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      setEditingTask(null);
                      setShowTaskModal(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Custom Task</span>
                  </button>
                  <button
                    onClick={handleGeneratePlan}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-sm"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Realistic Plan</span>
                  </button>
                </div>
              </div>
            ) : (
              filteredTasks.map((task) => {
                const isOverdue = !task.completed && task.dueDate < todayDateString;
                return (
                  <div
                    key={task.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      task.completed
                        ? 'bg-emerald-950/15 border-emerald-500/30 text-slate-400'
                        : isOverdue
                        ? 'bg-rose-950/15 border-rose-500/30'
                        : 'bg-slate-900/70 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <button
                        onClick={() => handleToggleTask(task.id)}
                        className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                          task.completed
                            ? 'bg-emerald-500 border-emerald-400 text-white'
                            : 'border-white/20 hover:border-amber-400 bg-slate-950 text-transparent'
                        }`}
                        title={task.completed ? 'Mark pending' : 'Mark completed (+25 XP)'}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>

                      <div className="space-y-1 flex-1 min-w-0 text-left">
                        <div className="flex items-center gap-2 flex-wrap text-[11px] font-mono">
                          <span className="font-bold text-amber-400">{task.subject}</span>
                          <span className="text-slate-600">&bull;</span>
                          <span className="text-slate-400 capitalize">{task.type.replace('_', ' ')}</span>
                          <span className="text-slate-600">&bull;</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                            task.priority === 'high' 
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : task.priority === 'medium'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}>
                            {task.priority}
                          </span>
                          <span className="text-slate-400">~{task.estimatedMinutes || 45} mins</span>
                          {task.revisionCycle && (
                            <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[10px]">
                              Cycle {task.revisionCycle} Review
                            </span>
                          )}
                        </div>

                        <h4 className={`text-sm font-bold truncate ${task.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                          {task.title}
                        </h4>

                        {task.notes && (
                          <p className="text-xs text-slate-400 truncate">{task.notes}</p>
                        )}

                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>Due: {task.dueDate}</span>
                          {isOverdue && (
                            <span className="text-rose-400 font-bold ml-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              Overdue
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Task Actions */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {onGoToStudio && (
                        <button
                          onClick={() => onGoToStudio(`/handwriting ${targetInfo.classGrade} ${task.subject} "${task.chapter || task.title}"`)}
                          className="px-3 py-1.5 rounded-xl bg-amber-400/10 hover:bg-amber-400 text-amber-300 hover:text-slate-950 font-semibold text-xs border border-amber-400/30 transition-all flex items-center gap-1 cursor-pointer"
                          title="Open Notes Studio"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Study</span>
                        </button>
                      )}
                      {onGoToTests && (
                        <button
                          onClick={() => onGoToTests()}
                          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/10 transition-all flex items-center gap-1 cursor-pointer"
                          title="Practice Quiz"
                        >
                          <Target className="w-3 h-3 text-emerald-400" />
                          <span>Quiz</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenEdit(task)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                        title="Edit or reschedule task"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-white/5 transition-colors cursor-pointer"
                        title="Delete task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: EXAM CLOCKS & COUNTDOWNS */}
      {plannerTab === 'countdown' && (
        <div className="space-y-8">
          <div className="rounded-3xl bg-gradient-to-br from-[#0a0f24] via-[#060914] to-[#04060d] border border-amber-400/20 p-8 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="relative z-10 space-y-8">
              {/* Exam Switcher & Year Selector */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">Academic Year:</span>
                  <div className="flex items-center gap-1 bg-slate-900 border border-white/10 p-1 rounded-xl text-xs font-semibold">
                    {[
                      { yr: 2025, label: '2025' },
                      { yr: 2026, label: '2026' },
                      { yr: 2027, label: '2027' },
                      { yr: 2028, label: '2027–28' }
                    ].map(({ yr, label }) => (
                      <button
                        key={yr}
                        onClick={() => setTargetYear(yr)}
                        className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                          targetYear === yr
                            ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">Target Exam:</span>
                  <div className="flex items-center gap-1 bg-slate-900 border border-white/10 p-1 rounded-xl text-xs font-semibold">
                    {Object.entries(catalog).map(([key, info]) => (
                      <button
                        key={key}
                        onClick={() => {
                          setSelectedExamKey(key);
                          setCustomExamDate('');
                        }}
                        className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                          selectedExamKey === key
                            ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {key.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Title & Pattern */}
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold ${
                    targetInfo.authority === 'OFFICIALLY_ANNOUNCED'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {targetInfo.authority === 'OFFICIALLY_ANNOUNCED' ? 'OFFICIAL NOTIFICATION' : 'TENTATIVE ESTIMATE'}
                  </span>
                  <span className="text-xs text-slate-400">
                    Exam Date: {new Date(effectiveExamDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {targetInfo.name}
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
                  {targetInfo.pattern}
                </p>
              </div>

              {/* Countdown Digits */}
              {countdown.isPast ? (
                <div className="p-8 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-amber-400 mx-auto" />
                  <h3 className="text-lg font-bold text-white">This examination date has concluded or arrived</h3>
                  <p className="text-xs text-slate-400">
                    Select the next academic year ({targetYear + 1}) above to begin planning for your upcoming attempt.
                  </p>
                  <button
                    onClick={() => setTargetYear(targetYear + 1)}
                    className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-amber-400 text-slate-950 font-bold rounded-xl text-xs cursor-pointer"
                  >
                    <span>Switch to Year {targetYear + 1}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'DAYS REMAINING', val: countdown.days },
                    { label: 'HOURS', val: countdown.hours },
                    { label: 'MINUTES', val: countdown.minutes },
                    { label: 'SECONDS', val: countdown.seconds },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 sm:p-6 rounded-2xl bg-slate-950/80 border border-white/10 flex flex-col items-center justify-center text-center shadow-inner"
                    >
                      <span className="text-4xl sm:text-6xl font-black font-mono tracking-tight text-white tabular-nums">
                        {String(item.val).padStart(2, '0')}
                      </span>
                      <span className="text-[10px] sm:text-xs font-semibold text-amber-400/90 tracking-wider mt-2 font-mono">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Daily Study Routine Slots */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <span>Recommended Daily Spaced Revision Slots</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  slotName: 'Morning Foundation (06:00 - 07:30)',
                  focus: 'Theory & Core Concepts',
                  tip: 'High brain receptivity: read theory, highlight keywords, and memorize definitions.',
                  badge: 'Concept Mastery',
                },
                {
                  slotName: 'Afternoon Numerical Drill (14:30 - 16:00)',
                  focus: 'Derivations & Mathematics',
                  tip: 'Active problem solving: practice formula substitution and step-by-step board numericals.',
                  badge: 'Formula Drills',
                },
                {
                  slotName: 'Evening Recall & Testing (19:30 - 20:30)',
                  focus: 'Active Recall & Mock Quiz',
                  tip: 'Test retention without notes. Solve 5 timed MCQs and review common board exam traps.',
                  badge: 'Spaced Recall',
                },
              ].map((slot, index) => (
                <div
                  key={index}
                  className="p-5 rounded-2xl bg-slate-900 border border-white/10 space-y-3 text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-mono text-[10px] font-bold">
                      {slot.badge}
                    </span>
                    <Clock className="w-4 h-4 text-slate-500" />
                  </div>
                  <h4 className="text-sm font-bold text-white">{slot.slotName}</h4>
                  <div className="text-xs text-amber-300/90 font-medium">{slot.focus}</div>
                  <p className="text-xs text-slate-400 leading-relaxed">{slot.tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: SYLLABUS MATRIX & COMPLETION TRACKER */}
      {plannerTab === 'syllabus' && (
        <div className="space-y-6">
          {/* Subject Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 text-xs">
            <button
              onClick={() => setActiveSubjectTab('All')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                activeSubjectTab === 'All' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Subjects
            </button>
            {availableSubjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setActiveSubjectTab(sub)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                  activeSubjectTab === sub ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* Chapters Checklist */}
          <div className="space-y-6">
            {availableSubjects
              .filter(sub => activeSubjectTab === 'All' || activeSubjectTab === sub)
              .map(subject => {
                const chapters = classSyllabus[subject] || [];
                return (
                  <div key={subject} className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-4 text-left">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white text-base">{subject}</h3>
                      <span className="text-xs text-slate-400 font-mono">
                        {chapters.filter(ch => completedChapters[`${targetInfo.classGrade}:${subject}:${ch.name}`] || completedChapters[ch.name]).length} / {chapters.length} Finished
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {chapters.map(ch => {
                        const chapterKey = `${targetInfo.classGrade}:${subject}:${ch.name}`;
                        const isDone = Boolean(completedChapters[chapterKey] || completedChapters[ch.name]);
                        return (
                          <div
                            key={ch.name}
                            onClick={() => toggleChapter(chapterKey)}
                            className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                              isDone
                                ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-300'
                                : 'bg-slate-950 border-white/5 hover:border-white/20'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                                isDone ? 'bg-emerald-500 border-emerald-400 text-white' : 'border-white/20'
                              }`}>
                                {isDone && <Check className="w-3.5 h-3.5" />}
                              </div>
                              <div className="min-w-0">
                                <span className={`text-xs font-semibold block truncate ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                                  {ch.name}
                                </span>
                                <span className="text-[10px] text-slate-500 block truncate">{ch.unit}</span>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400 shrink-0">
                              {ch.keyTopics.length} topics
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* VIEW 4: CONFIGURE STUDY PREFERENCES & SCHEDULE REGENERATOR */}
      {plannerTab === 'preferences' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-white/10 space-y-6 text-left max-w-3xl mx-auto">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-amber-400" />
              <span>Study Planner Configuration</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Personalize your study routine. The engine uses your available hours, exam targets, and weak topics to generate realistic daily schedules without overloading.
            </p>
          </div>

          <div className="space-y-5 pt-2">
            {/* Daily Available Hours */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Daily Available Study Hours:</span>
                <span className="font-mono text-amber-400 font-bold text-sm">{dailyStudyHours} hours / day</span>
              </label>
              <input
                type="range"
                min="1"
                max="8"
                step="0.5"
                value={dailyStudyHours}
                onChange={(e) => setDailyStudyHours(Number(e.target.value))}
                className="w-full accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1 hr (Light)</span>
                <span>3 hrs (Standard)</span>
                <span>5 hrs (Intensive)</span>
                <span>8 hrs (Full-time)</span>
              </div>
            </div>

            {/* Target Year Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">Target Academic Year:</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { yr: 2025, label: '2025' },
                  { yr: 2026, label: '2026' },
                  { yr: 2027, label: '2027' },
                  { yr: 2028, label: '2027–28' }
                ].map(({ yr, label }) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setTargetYear(yr)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      targetYear === yr
                        ? 'bg-amber-400 text-slate-950 border-amber-400 font-black'
                        : 'bg-slate-950 text-slate-300 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Exam Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">Target Examination:</label>
              <select
                value={selectedExamKey}
                onChange={(e) => setSelectedExamKey(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white font-medium focus:outline-none focus:border-amber-400"
              >
                {Object.entries(catalog).map(([k, info]) => (
                  <option key={k} value={k}>
                    {info.name} ({info.classGrade})
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Exam Date Override */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Custom Exam Date Override (Optional):
              </label>
              <input
                type="date"
                value={customExamDate}
                onChange={(e) => setCustomExamDate(e.target.value)}
                placeholder="YYYY-MM-DD"
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
              />
              <span className="text-[10px] text-slate-500">
                Leave blank to automatically follow the official/projected calendar ({targetInfo.targetDate.split('T')[0]}).
              </span>
            </div>

            {/* Sunday Mocks Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-white/10">
              <div>
                <span className="text-xs font-bold text-white block">Schedule Full Mock Tests on Sundays</span>
                <span className="text-[10px] text-slate-400">Reserves 2 hours every Sunday for timed practice test.</span>
              </div>
              <input
                type="checkbox"
                checked={includeSundayMocks}
                onChange={(e) => setIncludeSundayMocks(e.target.checked)}
                className="w-4 h-4 accent-amber-400 cursor-pointer"
              />
            </div>

            {/* Regenerate Plan Button */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleGeneratePlan}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Realistic Study Plan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Creation & Edit Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-white/20 rounded-3xl max-w-md w-full p-6 space-y-4 text-left shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-base font-bold text-white">
                {editingTask ? 'Edit Study Task' : 'Schedule Study Task'}
              </h3>
              <button
                onClick={() => {
                  setShowTaskModal(false);
                  setEditingTask(null);
                }}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-semibold">Task Title &amp; Topic</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Solve 10 Physics Numerals on Kinematics"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-semibold">Subject</label>
                  <select
                    value={taskSubject}
                    onChange={(e) => setTaskSubject(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="Social Science">Social Science</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-semibold">Due Date</label>
                  <input
                    type="date"
                    required
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-semibold">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as any)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-semibold">Est. Duration (Mins)</label>
                  <input
                    type="number"
                    min="15"
                    max="180"
                    step="15"
                    value={taskEstimatedMins}
                    onChange={(e) => setTaskEstimatedMins(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-sm"
                >
                  {editingTask ? 'Save Changes' : 'Schedule Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
