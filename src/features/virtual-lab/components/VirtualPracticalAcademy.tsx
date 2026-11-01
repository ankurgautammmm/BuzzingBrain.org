import React, { useState, useEffect, useMemo } from 'react';
import { 
  PracticalExperiment, 
  ExamTarget, 
  PracticalStage, 
  PracticalSubject, 
  PracticalClassGrade 
} from '../types/laboratory';
import { PRACTICAL_EXPERIMENTS_REGISTRY, getExperimentById } from '../experiments/experimentRegistry';
import { PracticalWorkflowController } from './PracticalWorkflowController';
import { UserProfile } from '../../../types';
import { saveExperimentProgressToMongo, fetchExperimentProgressFromMongo } from '../../../services/mongoStorage';
import { 
  FlaskConical, 
  Search, 
  Filter, 
  Sparkles, 
  PlayCircle, 
  Clock, 
  HelpCircle, 
  Activity, 
  Layers, 
  BookOpen, 
  CheckCircle2, 
  Award,
  ChevronRight,
  TrendingUp,
  LineChart,
  Atom,
  RotateCcw,
  FileText,
  Sliders,
  Compass,
  CheckCircle,
  ExternalLink,
  BookMarked,
  Printer
} from 'lucide-react';

interface PracticalProgressRecord {
  experimentId: string;
  score: number;
  total: number;
  percentage: number;
  timestamp: string;
  stagesCompleted: string[];
}

export interface VirtualPracticalAcademyProps {
  activeClass?: string;
  userProfile?: UserProfile | null;
  initialExperimentId?: string;
  initialStage?: PracticalStage;
  initialExamGoal?: ExamTarget;
  onNavigateTab?: (tab: string, subTab?: string) => void;
}

export const VirtualPracticalAcademy: React.FC<VirtualPracticalAcademyProps> = ({
  activeClass = 'Class 10',
  userProfile,
  initialExperimentId,
  initialStage = 'intro',
  initialExamGoal = 'all',
  onNavigateTab
}) => {
  // Navigation / Active Practical Session
  const [selectedExperiment, setSelectedExperiment] = useState<PracticalExperiment | null>(() => {
    if (initialExperimentId) {
      return getExperimentById(initialExperimentId) || null;
    }
    return null;
  });

  const [activeWorkflowStage, setActiveWorkflowStage] = useState<PracticalStage>(initialStage);

  // Active View Tab: 'experiments' | 'records' | 'apparatus'
  const [viewMode, setViewMode] = useState<'experiments' | 'records' | 'apparatus'>('experiments');

  // Filters
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('All');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('All');
  const [selectedExamGoal, setSelectedExamGoal] = useState<ExamTarget>(initialExamGoal);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'not_started' | 'completed' | 'needs_revision'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Synchronize class from props if user changes class in top bar
  useEffect(() => {
    if (activeClass && activeClass !== 'All') {
      // Default filter to the student's active class if selected
      // But keep flexible so student can browse other classes
    }
  }, [activeClass]);

  // Persistent Completed Practicals & Test Records in LocalStorage
  const [progressRecords, setProgressRecords] = useState<Record<string, PracticalProgressRecord>>(() => {
    try {
      const stored = localStorage.getItem('buzzingbrain_virtual_academy_records');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not load practical progress records', e);
    }
    return {};
  });

  // Sync with MongoDB Cloud on mount
  useEffect(() => {
    const uid = userProfile?.id || userProfile?.uid;
    if (uid) {
      fetchExperimentProgressFromMongo(uid).then((records) => {
        if (records && records.length > 0) {
          setProgressRecords(prev => {
            const merged = { ...prev };
            records.forEach(r => {
              if (r.experimentId) {
                merged[r.experimentId] = {
                  experimentId: r.experimentId,
                  score: r.score ?? 0,
                  total: r.total ?? 0,
                  percentage: r.percentage ?? 0,
                  timestamp: r.timestamp || new Date().toISOString(),
                  stagesCompleted: r.stagesCompleted || ['intro', 'procedure', 'simulation', 'calculations', 'quiz', 'report']
                };
              }
            });
            return merged;
          });
        }
      }).catch(() => {});
    }
  }, [userProfile?.id, userProfile?.uid]);

  // Save to localStorage & MongoDB whenever progress updates
  const handleSaveProgress = (record: { experimentId: string; score: number; total: number; percentage: number }) => {
    const newRecord: PracticalProgressRecord = {
      experimentId: record.experimentId,
      score: record.score,
      total: record.total,
      percentage: record.percentage,
      timestamp: new Date().toISOString(),
      stagesCompleted: ['intro', 'procedure', 'simulation', 'calculations', 'quiz', 'report']
    };

    // Sync to MongoDB Cloud Database
    const uid = userProfile?.id || userProfile?.uid || 'guest';
    saveExperimentProgressToMongo({
      userId: uid,
      experimentId: record.experimentId,
      subject: selectedExperiment?.subject || 'Science',
      stagesCompleted: newRecord.stagesCompleted,
      score: record.score,
      total: record.total,
      percentage: record.percentage,
    }).catch(() => {});

    setProgressRecords(prev => {
      const updated = { ...prev, [record.experimentId]: newRecord };
      try {
        localStorage.setItem('buzzingbrain_virtual_academy_records', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not save practical records to localStorage', e);
      }
      return updated;
    });
  };

  // Filtered experiments calculation
  const filteredExperiments = useMemo(() => {
    return PRACTICAL_EXPERIMENTS_REGISTRY.filter(exp => {
      // Class filter
      if (selectedClassFilter !== 'All' && exp.classGrade !== selectedClassFilter) {
        return false;
      }
      // Subject filter
      if (selectedSubjectFilter !== 'All' && exp.subject !== selectedSubjectFilter) {
        return false;
      }
      // Exam goal filter
      if (selectedExamGoal !== 'all' && !exp.examTags.includes(selectedExamGoal)) {
        return false;
      }
      // Status filter
      const record = progressRecords[exp.id];
      if (selectedStatusFilter === 'completed' && !record) {
        return false;
      }
      if (selectedStatusFilter === 'not_started' && record) {
        return false;
      }
      if (selectedStatusFilter === 'needs_revision' && (!record || record.percentage >= 70)) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = exp.title.toLowerCase().includes(q) ||
                      exp.chapter.toLowerCase().includes(q) ||
                      exp.subject.toLowerCase().includes(q) ||
                      exp.learningObjectives.some(o => o.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    });
  }, [selectedClassFilter, selectedSubjectFilter, selectedExamGoal, selectedStatusFilter, searchQuery, progressRecords]);

  // Global Practical Academy Stats
  const stats = useMemo(() => {
    const total = PRACTICAL_EXPERIMENTS_REGISTRY.length;
    const completedCount = Object.keys(progressRecords).length;
    const scores = Object.values(progressRecords).map(r => r.percentage);
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    return {
      total,
      completedCount,
      avgScore
    };
  }, [progressRecords]);

  // If student is actively conducting a practical, render the multi-stage controller!
  if (selectedExperiment) {
    return (
      <PracticalWorkflowController
        experiment={selectedExperiment}
        initialStage={activeWorkflowStage}
        selectedExamGoal={selectedExamGoal}
        onExit={() => {
          setSelectedExperiment(null);
          setActiveWorkflowStage('intro');
        }}
        onSaveProgress={handleSaveProgress}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Academy Hero Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/50 via-slate-900 to-indigo-950/50 border border-purple-500/20 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
        {/* Decorative Background Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2.5 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5 shadow-xs">
              <FlaskConical className="w-3.5 h-3.5 text-purple-400" />
              <span>BuzzingBrain Virtual Practical Academy</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">
              CBSE &bull; NEET &bull; JEE Main &bull; CUET Practical Syllabus
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Exam-Oriented 3D Virtual Science Laboratory
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Every practical guides you through a strict pedagogical sequence: <strong className="text-purple-300">Introduction &amp; Theory</strong> &rarr; <strong className="text-indigo-300">Guided Step-by-Step Procedure</strong> &rarr; <strong className="text-sky-300">Interactive 3D WebGL / React Three Fiber Simulation</strong> &rarr; <strong className="text-amber-300">Calculations, Regression &amp; Graphs</strong> &rarr; <strong className="text-emerald-300">Exam MCQ Quiz &amp; Practical Record</strong>.
          </p>
        </div>

        {/* Global Practical Stats Dashboard */}
        <div className="grid grid-cols-3 gap-3 self-stretch lg:self-auto shrink-0 font-mono relative z-10">
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center shadow-lg">
            <span className="text-xl font-black text-amber-400 block">{stats.total}</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">3D Virtual Labs</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center shadow-lg">
            <span className="text-xl font-black text-emerald-400 block">{stats.completedCount}</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Completed</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center shadow-lg">
            <span className="text-xl font-black text-purple-400 block">{stats.avgScore}%</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Avg MCQ Score</span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('experiments')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              viewMode === 'experiments'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            <span>Curriculum Practicals ({filteredExperiments.length})</span>
          </button>

          <button
            onClick={() => setViewMode('records')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              viewMode === 'records'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <BookMarked className="w-4 h-4" />
            <span>Practical Records ({stats.completedCount})</span>
          </button>

          <button
            onClick={() => setViewMode('apparatus')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              viewMode === 'apparatus'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Apparatus Inventory</span>
          </button>
        </div>

        {/* Quick Action: Start Featured Ohm's Law Experiment */}
        <button
          onClick={() => {
            const exp = getExperimentById('c10_ohms_law_circuit');
            if (exp) {
              setSelectedExperiment(exp);
              setActiveWorkflowStage('intro');
            }
          }}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-xs transition shadow-md hover:brightness-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
        >
          <PlayCircle className="w-4 h-4" />
          <span>Featured: Ohm's Law 3D Circuit</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* VIEW MODE 1: CURRICULUM PRACTICALS DASHBOARD & FILTERS */}
      {/* ========================================================================= */}
      {viewMode === 'experiments' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
            {/* Search and Exam Focus Pills */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search experiments by title, chapter, or concept..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                />
              </div>

              {/* Exam Goal Filter */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="font-bold text-slate-400 mr-1 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-purple-400" />
                  <span>Exam Goal:</span>
                </span>
                {[
                  { id: 'all', label: 'All Exams' },
                  { id: 'cbse', label: 'CBSE' },
                  { id: 'neet', label: 'NEET' },
                  { id: 'jee_main', label: 'JEE Main' },
                  { id: 'cuet', label: 'CUET' }
                ].map(exam => (
                  <button
                    key={exam.id}
                    onClick={() => setSelectedExamGoal(exam.id as ExamTarget)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer text-xs ${
                      selectedExamGoal === exam.id
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {exam.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Class, Subject, and Status Filters */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs">
              {/* Class Filter */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-semibold text-slate-400">Class:</span>
                {['All', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map(cls => (
                  <button
                    key={cls}
                    onClick={() => setSelectedClassFilter(cls)}
                    className={`px-3 py-1 rounded-xl font-semibold transition cursor-pointer ${
                      selectedClassFilter === cls
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {cls}
                  </button>
                ))}
              </div>

              {/* Subject Filter */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-semibold text-slate-400">Subject:</span>
                {['All', 'Physics', 'Chemistry', 'Biology'].map(subj => (
                  <button
                    key={subj}
                    onClick={() => setSelectedSubjectFilter(subj)}
                    className={`px-3 py-1 rounded-xl font-semibold transition cursor-pointer ${
                      selectedSubjectFilter === subj
                        ? 'bg-white text-slate-950 font-bold'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {subj}
                  </button>
                ))}
              </div>

              {/* Status Filter */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-semibold text-slate-400">Status:</span>
                {[
                  { id: 'all', label: 'All' },
                  { id: 'not_started', label: 'Not Started' },
                  { id: 'completed', label: 'Completed' },
                  { id: 'needs_revision', label: 'Needs Revision' }
                ].map(st => (
                  <button
                    key={st.id}
                    onClick={() => setSelectedStatusFilter(st.id as any)}
                    className={`px-2.5 py-1 rounded-xl font-semibold transition cursor-pointer text-[11px] ${
                      selectedStatusFilter === st.id
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Practical Cards Grid */}
          {filteredExperiments.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <FlaskConical className="w-8 h-8 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-white">No Practicals Match Current Filters</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Try clearing or loosening your class, subject, or exam goal filters to see all available syllabus experiments.
              </p>
              <button
                onClick={() => {
                  setSelectedClassFilter('All');
                  setSelectedSubjectFilter('All');
                  setSelectedExamGoal('all');
                  setSelectedStatusFilter('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-500 transition cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExperiments.map(exp => {
                const comp = progressRecords[exp.id];

                return (
                  <div
                    key={exp.id}
                    className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col justify-between shadow-xl space-y-4 group relative overflow-hidden"
                  >
                    {/* Top Accent Gradient Bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-sky-500 opacity-60 group-hover:opacity-100 transition-opacity" />

                    <div className="space-y-3">
                      {/* Card Header Badges */}
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="px-2.5 py-0.5 rounded-full uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {exp.classGrade} &bull; {exp.subject}
                        </span>

                        {comp ? (
                          <span className="flex items-center gap-1 text-emerald-400 font-mono">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{comp.percentage}% Score</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-slate-400 font-mono">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{exp.estimatedDurationMinutes} mins</span>
                          </span>
                        )}
                      </div>

                      {/* Practical Title & Chapter */}
                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2">
                          {exp.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          Chapter: <strong className="text-slate-300">{exp.chapter}</strong>
                        </p>
                      </div>

                      {/* Feature Tags (3D R3F, Calculations, MCQs) */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] font-mono">
                        {exp.has3D && (
                          <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20 flex items-center gap-1">
                            <Layers className="w-3 h-3" />
                            <span>{exp.id === 'c10_ohms_law_circuit' ? 'React Three Fiber 3D' : '3D WebGL'}</span>
                          </span>
                        )}
                        {exp.hasCalculations && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1">
                            <LineChart className="w-3 h-3" />
                            <span>Calculations &amp; Graph</span>
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20 flex items-center gap-1">
                          <HelpCircle className="w-3 h-3" />
                          <span>{exp.quizQuestions.length} MCQs</span>
                        </span>
                      </div>

                      {/* Key Objectives Preview */}
                      <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-300 line-clamp-3 leading-relaxed">
                        {exp.learningObjectives[0]}
                      </div>

                      {/* Exam Target Tags */}
                      <div className="flex flex-wrap gap-1 text-[9px] font-mono uppercase font-bold text-slate-400">
                        {exp.examTags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-300">
                            #{tag.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Card Footer: Launch Multi-Stage Practical Workflow */}
                    <div className="pt-3 border-t border-slate-800/80 space-y-2">
                      <button
                        onClick={() => {
                          setSelectedExperiment(exp);
                          setActiveWorkflowStage('intro');
                        }}
                        className="w-full py-2.5 px-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer shadow-md"
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span>Launch Practical Workflow</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      {/* Quick Jump Buttons to Stages */}
                      <div className="grid grid-cols-3 gap-1.5 text-[10px] font-semibold text-slate-400">
                        <button
                          onClick={() => {
                            setSelectedExperiment(exp);
                            setActiveWorkflowStage('simulation');
                          }}
                          className="py-1 px-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-center transition cursor-pointer hover:text-white"
                        >
                          Jump to 3D
                        </button>
                        <button
                          onClick={() => {
                            setSelectedExperiment(exp);
                            setActiveWorkflowStage('calculations');
                          }}
                          className="py-1 px-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-center transition cursor-pointer hover:text-white"
                        >
                          Calculations
                        </button>
                        <button
                          onClick={() => {
                            setSelectedExperiment(exp);
                            setActiveWorkflowStage('quiz');
                          }}
                          className="py-1 px-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-center transition cursor-pointer hover:text-white"
                        >
                          MCQ Quiz
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW MODE 2: STUDENT PRACTICAL RECORD NOTEBOOK */}
      {/* ========================================================================= */}
      {viewMode === 'records' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <BookMarked className="w-5 h-5 text-purple-400" />
                  <span>Student Laboratory Records &amp; Practical Portfolio</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Official certificates and verification logs for CBSE, NEET, JEE, and CUET practical assessments.
                </p>
              </div>

              {Object.keys(progressRecords).length > 0 && (
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center gap-2 self-start sm:self-auto cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-purple-400" />
                  <span>Print Portfolio</span>
                </button>
              )}
            </div>

            {Object.keys(progressRecords).length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                <FileText className="w-8 h-8 text-slate-500 mx-auto" />
                <h4 className="text-sm font-bold text-white">No Practical Records Yet</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Complete the 5-stage workflow (Intro &rarr; Procedure &rarr; 3D Simulation &rarr; Calculations &rarr; MCQ Quiz) on any practical to generate your certified record.
                </p>
                <button
                  onClick={() => setViewMode('experiments')}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition cursor-pointer"
                >
                  Browse Practicals
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.values(progressRecords).map(rec => {
                  const exp = getExperimentById(rec.experimentId);
                  if (!exp) return null;

                  return (
                    <div
                      key={rec.experimentId}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-mono">
                          <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold">
                            {exp.classGrade} &bull; {exp.subject}
                          </span>
                          <span className="text-slate-400">
                            Completed: {new Date(rec.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white">{exp.title}</h4>
                        <p className="text-xs text-slate-400">Chapter: {exp.chapter}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right font-mono">
                          <span className="text-xs text-slate-400 block">MCQ Score</span>
                          <span className={`text-base font-black ${rec.percentage >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {rec.score} / {rec.total} ({rec.percentage}%)
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedExperiment(exp);
                            setActiveWorkflowStage('report');
                          }}
                          className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Report</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW MODE 3: APPARATUS INVENTORY & CALIBRATION */}
      {/* ========================================================================= */}
      {viewMode === 'apparatus' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                <span>Standard Laboratory Apparatus &amp; Scientific Instruments</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Detailed reference specifications, circuit roles, least counts, and calibration instructions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  name: 'DC Battery Eliminator / Regulated Supply',
                  category: 'Circuit Driver',
                  range: '0 – 12 V DC (1 A Continuous)',
                  spec: 'Stabilized solid-state bridge rectifier with current-limiting overload cutout.',
                  precaution: 'Never short terminals with bare wire; switch off between measurements to prevent heating.'
                },
                {
                  name: 'DC Moving-Coil Ammeter',
                  category: 'Measuring Instrument',
                  range: '0 – 1.5 A DC',
                  spec: 'Least Count = 0.02 A (50 divisions). High sensitivity permanent magnet moving coil (PMMC).',
                  precaution: 'Must be connected strictly in SERIES with load; parallel connection will destroy the meter.'
                },
                {
                  name: 'DC Moving-Coil Voltmeter',
                  category: 'Measuring Instrument',
                  range: '0 – 3.0 V DC',
                  spec: 'Least Count = 0.05 V (60 divisions). High internal resistance (>10,000 Ω) to minimize loading error.',
                  precaution: 'Must be connected strictly in PARALLEL across the resistor or component under test.'
                },
                {
                  name: 'Sliding Contact Wire-Wound Rheostat',
                  category: 'Variable Resistance',
                  range: '0 – 20 Ω (2.0 A)',
                  spec: 'Constantan/Eureka resistance wire wound on non-conducting porcelain tube with phosphor bronze sliding contact.',
                  precaution: 'Slide gently to prevent wear of the wire coils; connect one bottom terminal and top slider rod.'
                },
                {
                  name: 'Standard Nichrome Resistance Coil',
                  category: 'Ohmic Test Conductor',
                  range: 'L = 100 cm, R ≈ 2.50 Ω',
                  spec: 'Nichrome 80/20 alloy wire with high resistivity (1.10 × 10⁻⁶ Ω·m) and low temperature coefficient.',
                  precaution: 'Do not allow current > 1.0 A for more than 10 seconds to avoid non-linear thermal drift.'
                },
                {
                  name: 'Brass Plug Key (Single Pole)',
                  category: 'Circuit Switch',
                  range: 'Zero insertion resistance (<0.01 Ω)',
                  spec: 'Machined heavy brass block with tapered brass plug fitted with an insulated ebonite handle.',
                  precaution: 'Keep plug clean and insert with a slight clockwise twist for zero contact resistance.'
                }
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold">
                      {item.category}
                    </span>
                    <span className="text-slate-400">{item.range}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{item.name}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.spec}</p>
                  <div className="pt-2 border-t border-slate-900 text-[11px] text-amber-300/90 font-medium">
                    <span className="font-bold">Precaution:</span> {item.precaution}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
