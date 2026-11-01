import React, { useState } from 'react';
import { PracticalExperiment, ExamTarget } from '../types/laboratory';
import { PRACTICAL_EXPERIMENTS_REGISTRY } from '../experiments/experimentRegistry';
import { PracticalWorkflowController } from './PracticalWorkflowController';
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
  LineChart
} from 'lucide-react';

interface PracticalAcademyDashboardProps {
  activeClass: string;
}

export const PracticalAcademyDashboard: React.FC<PracticalAcademyDashboardProps> = ({
  activeClass,
}) => {
  // Navigation / Selection State
  const [selectedExperiment, setSelectedExperiment] = useState<PracticalExperiment | null>(null);

  // Filters
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('All');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('All');
  const [selectedExamGoal, setSelectedExamGoal] = useState<ExamTarget>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Track completed experiments in local session/state
  const [completedExperiments, setCompletedExperiments] = useState<Record<string, { score: number; total: number; percentage: number }>>({});

  const filteredExperiments = PRACTICAL_EXPERIMENTS_REGISTRY.filter(exp => {
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

  const handleSaveProgress = (record: { experimentId: string; score: number; total: number; percentage: number }) => {
    setCompletedExperiments(prev => ({
      ...prev,
      [record.experimentId]: {
        score: record.score,
        total: record.total,
        percentage: record.percentage
      }
    }));
  };

  // If student is actively conducting a practical, render the multi-stage controller!
  if (selectedExperiment) {
    return (
      <PracticalWorkflowController
        experiment={selectedExperiment}
        selectedExamGoal={selectedExamGoal}
        onExit={() => setSelectedExperiment(null)}
        onSaveProgress={handleSaveProgress}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Academy Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/20 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
              <FlaskConical className="w-3.5 h-3.5" />
              <span>BuzzingBrain Virtual Practical Academy</span>
            </span>
            <span className="text-xs text-slate-400">
              CBSE &bull; NEET &bull; JEE Main &bull; CUET Practical Syllabus
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Exam-Oriented 3D Virtual Science Laboratory
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Every practical guides you through Introduction, Guided Procedure, Interactive 3D WebGL Simulation, Empirical Calculations &amp; Graphs, and finishing with an Exam-Grade MCQ Quiz.
          </p>
        </div>

        {/* Global Practical Stats */}
        <div className="grid grid-cols-2 gap-3 self-stretch sm:self-auto shrink-0 font-mono">
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-xl font-black text-amber-400 block">3</span>
            <span className="text-[10px] text-slate-400 uppercase">3D Real-Time Labs</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-xl font-black text-emerald-400 block">
              {Object.keys(completedExperiments).length}
            </span>
            <span className="text-[10px] text-slate-400 uppercase">Completed Practicals</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
        {/* Search & Exam Goal Pills */}
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

          {/* Exam Goal Selector */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="font-bold text-slate-400 mr-1">Exam Focus:</span>
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

        {/* Class & Subject Filter Buttons */}
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
            {['All', 'Chemistry', 'Biology', 'Physics'].map(subj => (
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
        </div>
      </div>

      {/* Practical Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExperiments.map(exp => {
          const comp = completedExperiments[exp.id];

          return (
            <div
              key={exp.id}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col justify-between shadow-xl space-y-4 group"
            >
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

                {/* Feature Tags (3D, Calculations, MCQs) */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] font-mono">
                  {exp.has3D && (
                    <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20 flex items-center gap-1">
                      <Layers className="w-3 h-3" />
                      <span>3D WebGL</span>
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

              {/* Card Footer: Launch Button */}
              <div className="pt-3 border-t border-slate-800/80">
                <button
                  onClick={() => setSelectedExperiment(exp)}
                  className="w-full py-2.5 px-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer shadow-md"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Launch Practical Workflow</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
