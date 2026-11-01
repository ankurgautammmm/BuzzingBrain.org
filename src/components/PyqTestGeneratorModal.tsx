import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  BrainCircuit, 
  Sparkles, 
  Clock, 
  Award, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Printer, 
  ChevronRight, 
  ChevronLeft, 
  Flag, 
  Flame, 
  Target, 
  Lightbulb, 
  BookOpen, 
  Check,
  AlertTriangle,
  Layers,
  Tag,
  CheckSquare,
  Square
} from 'lucide-react';
import { parseMathInText } from '../utils/latexParser';
import { NCERT_SYLLABUS } from '../data/ncertSyllabus';

export interface PyqQuestion {
  id: string;
  questionNumber: number;
  questionType: 'MCQ' | 'ASSERTION_REASON' | 'NUMERICAL';
  provenance: string; // e.g. "[NEET 2023]" or "[CBSE Board 2024]"
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  marks: number;
  negativeMarks: number;
  stepMarkingRubric: string[];
  detailedExplanation: string;
  examinerTrapWarning: string;
  topperShortcut?: string;
}

export interface PyqTestData {
  testTitle: string;
  topic: string;
  examTarget: string;
  totalMarks: number;
  durationMinutes: number;
  questions: PyqQuestion[];
}

interface PyqTestGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: string;
  grade: string;
  subject: string;
  onOpenNotes?: (topic: string, grade: string, subject: string) => void;
}

export const PyqTestGeneratorModal: React.FC<PyqTestGeneratorModalProps> = ({
  isOpen,
  onClose,
  topic,
  grade,
  subject,
  onOpenNotes,
}) => {
  // Test Lifecycle & Interaction State
  const [viewState, setViewState] = useState<'configure' | 'testing' | 'results'>('configure');
  const [testData, setTestData] = useState<PyqTestData | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(600);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. Target Class comes FIRST (Featuring Droppers!)
  const [selectedClass, setSelectedClass] = useState<string>(() => {
    if (grade.toLowerCase().includes('dropper') || grade.toLowerCase().includes('repeater')) return 'Dropper';
    if (grade.includes('12')) return 'Class 12';
    if (grade.includes('11')) return 'Class 11';
    if (grade.includes('9')) return 'Class 9';
    return 'Class 10';
  });

  // 2. Available subjects for selected class
  const classSubjects = useMemo(() => {
    if (NCERT_SYLLABUS[selectedClass]) {
      return Object.keys(NCERT_SYLLABUS[selectedClass]);
    }
    return ['Physics', 'Chemistry', 'Biology', 'Mathematics'];
  }, [selectedClass]);

  const [selectedSubject, setSelectedSubject] = useState<string>(() => {
    if (classSubjects.includes(subject)) return subject;
    return classSubjects[0] || 'Physics';
  });

  // Keep selectedSubject in sync when class changes
  useEffect(() => {
    if (!classSubjects.includes(selectedSubject)) {
      setSelectedSubject(classSubjects[0] || 'Physics');
    }
  }, [classSubjects, selectedSubject]);

  // 3. Proper listing of chapters for selected class & subject
  const availableChapters = useMemo(() => {
    return NCERT_SYLLABUS[selectedClass]?.[selectedSubject] || [];
  }, [selectedClass, selectedSubject]);

  const [selectedChapterName, setSelectedChapterName] = useState<string>(() => {
    const match = availableChapters.find(c => c.name.toLowerCase().includes(topic.toLowerCase()) || topic.toLowerCase().includes(c.name.toLowerCase()));
    return match ? match.name : (availableChapters[0]?.name || topic);
  });

  // Keep selectedChapterName in sync when availableChapters change
  useEffect(() => {
    if (availableChapters.length > 0) {
      const match = availableChapters.find(c => c.name === selectedChapterName);
      if (!match) {
        setSelectedChapterName(availableChapters[0].name);
      }
    }
  }, [availableChapters, selectedChapterName]);

  // Active chapter object
  const activeChapterObj = useMemo(() => {
    return availableChapters.find(c => c.name === selectedChapterName) || availableChapters[0];
  }, [availableChapters, selectedChapterName]);

  // 4. Topic Tags with Multiple Selection
  const [selectedTopicTags, setSelectedTopicTags] = useState<string[]>([]);

  // Update selected topic tags whenever activeChapterObj changes
  useEffect(() => {
    if (activeChapterObj?.keyTopics && activeChapterObj.keyTopics.length > 0) {
      setSelectedTopicTags([...activeChapterObj.keyTopics]);
    } else {
      setSelectedTopicTags([selectedChapterName]);
    }
  }, [activeChapterObj, selectedChapterName]);

  // Test Configuration State
  const [examTarget, setExamTarget] = useState<'NEET' | 'JEE_MAIN' | 'JEE_ADVANCED' | 'CBSE_BOARDS'>(() => {
    if (selectedClass === 'Dropper') {
      return selectedSubject === 'Biology' ? 'NEET' : 'JEE_MAIN';
    }
    return selectedSubject === 'Biology' ? 'NEET' : 'CBSE_BOARDS';
  });
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<string>('Standard Competitive');
  const [pyqYearsScope, setPyqYearsScope] = useState<string>('2000-2025 (Full Archive)');

  // Sync examTarget when class or subject changes
  useEffect(() => {
    if (selectedClass === 'Dropper') {
      if (selectedSubject.toLowerCase() === 'biology') {
        setExamTarget('NEET');
      } else if (selectedSubject.toLowerCase() === 'mathematics') {
        setExamTarget('JEE_MAIN');
      }
    } else if (selectedClass.includes('10') || selectedClass.includes('9')) {
      setExamTarget('CBSE_BOARDS');
    }
  }, [selectedClass, selectedSubject]);

  // Timer countdown
  useEffect(() => {
    if (viewState !== 'testing' || timeLeftSeconds <= 0) return;

    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [viewState, timeLeftSeconds]);

  if (!isOpen) return null;

  const handleGenerateTest = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setIsGenerating(true);
      setErrorMessage(null);

      const res = await fetch('/api/pyq/generate-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: selectedChapterName,
          grade: selectedClass,
          subject: selectedSubject,
          examTarget,
          questionCount,
          difficulty,
          pyqYearsScope,
          selectedTopics: selectedTopicTags,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate PYQ test paper.');
      }

      if (!data.questions || data.questions.length === 0) {
        throw new Error('Test questions could not be loaded. Please try again.');
      }

      setTestData(data);
      setUserAnswers({});
      setMarkedForReview({});
      setCurrentIndex(0);
      setTimeLeftSeconds((data.durationMinutes || data.questions.length * 2) * 60);
      setViewState('testing');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error creating test.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectOption = (qIdx: number, optionIdx: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qIdx]: optionIdx,
    }));
  };

  const handleToggleReview = (qIdx: number) => {
    setMarkedForReview((prev) => ({
      ...prev,
      [qIdx]: !prev[qIdx],
    }));
  };

  const handleClearSelection = (qIdx: number) => {
    setUserAnswers((prev) => {
      const copy = { ...prev };
      delete copy[qIdx];
      return copy;
    });
  };

  const handleFinishTest = () => {
    setViewState('results');
  };

  const handleResetToConfigure = () => {
    setViewState('configure');
    setTestData(null);
  };

  // Format timer MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // Compute test results
  const computeScore = () => {
    if (!testData) return { totalScore: 0, maxScore: 0, correct: 0, incorrect: 0, skipped: 0, accuracy: 0 };

    let totalScore = 0;
    let maxScore = 0;
    let correct = 0;
    let incorrect = 0;
    let skipped = 0;

    testData.questions.forEach((q, idx) => {
      const qMarks = q.marks || 4;
      const qNeg = q.negativeMarks !== undefined ? q.negativeMarks : 1;
      maxScore += qMarks;

      const userAns = userAnswers[idx];
      if (userAns === undefined) {
        skipped++;
      } else if (userAns === q.correctOptionIndex) {
        correct++;
        totalScore += qMarks;
      } else {
        incorrect++;
        totalScore -= qNeg;
      }
    });

    const attempted = correct + incorrect;
    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

    return { totalScore, maxScore, correct, incorrect, skipped, accuracy };
  };

  const results = computeScore();

  // Helper to toggle a specific topic tag in multi-selection
  const handleToggleTopicTag = (topicName: string) => {
    setSelectedTopicTags((prev) => {
      if (prev.includes(topicName)) {
        if (prev.length === 1) return prev; // Keep at least one topic selected
        return prev.filter((t) => t !== topicName);
      } else {
        return [...prev, topicName];
      }
    });
  };

  const handleSelectAllTopics = () => {
    if (activeChapterObj?.keyTopics) {
      setSelectedTopicTags([...activeChapterObj.keyTopics]);
    }
  };

  const handleClearAllTopics = () => {
    if (activeChapterObj?.keyTopics && activeChapterObj.keyTopics.length > 0) {
      setSelectedTopicTags([activeChapterObj.keyTopics[0]]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-xs font-sans-clean overflow-y-auto">
      <div className="w-full max-w-4xl my-4 rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-red-600 via-amber-600 to-indigo-700 px-5 py-3.5 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md shadow-inner text-white">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold tracking-tight">
                  PYQ Guru Test Generator
                </h3>
                <span className="rounded-full bg-amber-400 text-slate-900 text-[10px] font-black uppercase px-2 py-0.5 tracking-wider">
                  25-Year PYQ Exam Simulator
                </span>
              </div>
              <p className="text-xs text-amber-100 mt-0.5">
                {selectedChapterName} • {selectedClass} • {selectedSubject}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {viewState === 'testing' && (
              <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-xl text-xs font-mono font-bold text-amber-300">
                <Clock className="h-3.5 w-3.5 animate-pulse" />
                <span>{formatTime(timeLeftSeconds)}</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* View State 1: CONFIGURE */}
        {viewState === 'configure' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 bg-[#faf9f5]">
            <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-4 sm:p-5 flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
                <BrainCircuit className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                  Authentic 25-Year Past Exam Question Generator (2000–2025)
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Select your target class/batch first, pick subject & chapter, and multi-select exact topics to generate custom tests matching authentic competitive entrance patterns!
                </p>
              </div>
            </div>

            <form onSubmit={handleGenerateTest} className="space-y-6">
              
              {/* STEP 1: TARGET CLASS / BATCH COMES FIRST */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] flex items-center justify-center font-bold">1</span>
                    Target Class / Batch (Select First)
                  </label>
                  {selectedClass === 'Dropper' && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[10px] flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-600 fill-amber-500" />
                      Dropper / Repeater Intensive Mode
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'Dropper', label: '🔥 Droppers', sub: 'NEET & JEE Repeaters' },
                    { id: 'Class 12', label: 'Class 12', sub: 'Boards + Entrance' },
                    { id: 'Class 11', label: 'Class 11', sub: 'Entrance Foundation' },
                    { id: 'Class 10', label: 'Class 10', sub: 'CBSE / ICSE Board' },
                    { id: 'Class 9', label: 'Class 9', sub: 'Foundational' },
                  ].map((cls) => (
                    <button
                      key={cls.id}
                      type="button"
                      onClick={() => setSelectedClass(cls.id)}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        selectedClass === cls.id
                          ? cls.id === 'Dropper'
                            ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold ring-2 ring-amber-400'
                            : 'bg-indigo-50 border-indigo-600 text-indigo-950 font-bold ring-2 ring-indigo-400/40'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-xs font-bold">{cls.label}</div>
                      <div className="text-[10px] text-slate-500 truncate">{cls.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* STEP 2: SUBJECT & CHAPTER SELECTION */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Subject Selector */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] flex items-center justify-center font-bold">2</span>
                    Subject
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {classSubjects.map((subj) => (
                      <button
                        key={subj}
                        type="button"
                        onClick={() => setSelectedSubject(subj)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                          selectedSubject === subj
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {subj}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chapter Selector */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] flex items-center justify-center font-bold">3</span>
                    Chapter ({availableChapters.length} Available)
                  </label>
                  <select
                    value={selectedChapterName}
                    onChange={(e) => setSelectedChapterName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs font-semibold text-slate-800 bg-white focus:border-indigo-500 focus:outline-hidden"
                  >
                    {availableChapters.map((ch) => (
                      <option key={ch.number} value={ch.name}>
                        Ch {ch.number}: {ch.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* STEP 3: INTERACTIVE MULTI-TOPIC SELECTION TAG CLOUD */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] flex items-center justify-center font-bold">4</span>
                      Select Specific Sub-Topics (Multiple Selection)
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Click tags to include/exclude specific topics in your exam questions.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
                      {selectedTopicTags.length} of {activeChapterObj?.keyTopics?.length || 1} Topics Selected
                    </span>
                    <button
                      type="button"
                      onClick={handleSelectAllTopics}
                      className="text-[11px] font-bold text-slate-600 hover:text-indigo-600 underline cursor-pointer"
                    >
                      All
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={handleClearAllTopics}
                      className="text-[11px] font-bold text-slate-600 hover:text-indigo-600 underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Topic Pills Cloud */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {(activeChapterObj?.keyTopics || [selectedChapterName]).map((tName) => {
                    const isSelected = selectedTopicTags.includes(tName);
                    return (
                      <button
                        key={tName}
                        type="button"
                        onClick={() => handleToggleTopicTag(tName)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs ring-1 ring-indigo-500'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected ? (
                          <CheckSquare className="w-3.5 h-3.5 shrink-0 text-white" />
                        ) : (
                          <Square className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                        )}
                        <span>{tName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STEP 4: Target Examination & Marking Scheme */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] flex items-center justify-center font-bold">5</span>
                  Target Exam Pattern & Marking Scheme
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  {[
                    { id: 'NEET', label: 'NEET UG', sub: '+4 / -1 Marking', badge: 'Medical Entrance' },
                    { id: 'JEE_MAIN', label: 'JEE Main', sub: '+4 / -1 Marking', badge: 'Engineering Entrance' },
                    { id: 'JEE_ADVANCED', label: 'JEE Advanced', sub: '+4 / -2 Multi-Opt', badge: 'Challenger' },
                    { id: 'CBSE_BOARDS', label: 'CBSE Boards', sub: 'Step Rubrics', badge: 'Board Assessment' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setExamTarget(item.id as any)}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                        examTarget === item.id
                          ? 'border-indigo-600 bg-indigo-50/90 text-indigo-950 font-bold ring-2 ring-indigo-500/30'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider block">
                        {item.badge}
                      </span>
                      <div className="text-sm font-bold text-slate-900 mt-0.5">{item.label}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{item.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of Questions & Difficulty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                    Question Count
                  </label>
                  <div className="flex items-center gap-2">
                    {[3, 5, 8, 10, 15].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setQuestionCount(count)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition border ${
                          questionCount === count
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {count} Qs
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                    Difficulty Level
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 py-2.5 px-3 text-xs font-semibold text-slate-800 bg-white focus:border-indigo-500 focus:outline-hidden"
                  >
                    <option value="Standard Competitive">Standard Exam Level (High Yield)</option>
                    <option value="Rank-Decider Challenger">Rank-Decider Challenger (Multi-Concept)</option>
                    <option value="Assertion-Reasoning Trap Special">Assertion-Reasoning & Conceptual Traps</option>
                    <option value="Calculative Numerical Intensive">Formula & Calculation Heavy</option>
                  </select>
                </div>
              </div>

              {/* 25-Year Archive Scope */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                  25-Year Past Paper Archive Scope
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    '2000-2025 (Full Archive)',
                    'Recent Trends (2018-2025)',
                    'Classic Rank Deciders (2000-2017)',
                  ].map((scope) => (
                    <button
                      key={scope}
                      type="button"
                      onClick={() => setPyqYearsScope(scope)}
                      className={`p-2.5 rounded-xl border text-center transition font-semibold ${
                        pyqYearsScope === scope
                          ? 'border-amber-500 bg-amber-50 text-amber-950 ring-1 ring-amber-400'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {scope}
                    </button>
                  ))}
                </div>
              </div>

              {errorMessage && (
                <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-xs text-red-700">
                  ⚠️ {errorMessage}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-indigo-600 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:opacity-95 disabled:opacity-50 transition"
                >
                  {isGenerating ? (
                    <>
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Architecting {questionCount} Exam Questions from PYQ Archives...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Start Authentic PYQ Test
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* View State 2: TESTING (Active Exam Hall) */}
        {viewState === 'testing' && testData && (
          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            {/* Question Palette Bar */}
            <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-2.5 flex items-center justify-between gap-2 overflow-x-auto text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase mr-1">Questions:</span>
                {testData.questions.map((q, idx) => {
                  const isAnswered = userAnswers[idx] !== undefined;
                  const isMarked = markedForReview[idx];
                  const isCurrent = currentIndex === idx;

                  let badgeColor = 'bg-white border-slate-300 text-slate-700';
                  if (isMarked) badgeColor = 'bg-purple-600 border-purple-600 text-white font-bold';
                  else if (isAnswered) badgeColor = 'bg-emerald-600 border-emerald-600 text-white font-bold';
                  if (isCurrent) badgeColor += ' ring-2 ring-indigo-500 ring-offset-1';

                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-7 w-7 rounded-lg border text-xs font-semibold flex items-center justify-center transition shrink-0 ${badgeColor}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[11px] text-slate-500 hidden sm:inline">
                  Answered: <strong>{Object.keys(userAnswers).length}</strong>/{testData.questions.length}
                </span>
                <button
                  onClick={handleFinishTest}
                  className="rounded-lg bg-red-600 hover:bg-red-700 text-white px-3 py-1 font-bold text-xs shadow-xs transition"
                >
                  Submit Test
                </button>
              </div>
            </div>

            {/* Current Question Body */}
            {testData.questions[currentIndex] && (
              <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-4">
                {/* Provenance Banner */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="bg-indigo-100 text-indigo-900 border border-indigo-200 px-2.5 py-0.5 rounded-full font-bold text-[11px]">
                      Q{currentIndex + 1} of {testData.questions.length}
                    </span>
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full font-bold text-[11px] flex items-center gap-1">
                      <Flame className="h-3 w-3 text-red-500" />
                      {testData.questions[currentIndex].provenance}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 font-mono">
                    Marks: <strong className="text-emerald-700">+{testData.questions[currentIndex].marks}</strong>, Negative: <strong className="text-red-600">-{testData.questions[currentIndex].negativeMarks}</strong>
                  </div>
                </div>

                {/* Question Statement */}
                <div
                  className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed pt-2"
                  dangerouslySetInnerHTML={{
                    __html: parseMathInText(testData.questions[currentIndex].questionText),
                  }}
                />

                {/* Options */}
                <div className="space-y-2.5 pt-3">
                  {testData.questions[currentIndex].options.map((opt, optIdx) => {
                    const isSelected = userAnswers[currentIndex] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(currentIndex, optIdx)}
                        className={`w-full text-left rounded-xl border p-3.5 text-xs sm:text-sm transition flex items-start gap-3 ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-semibold ring-1 ring-indigo-500'
                            : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-600 text-white'
                              : 'border-slate-300 text-slate-500'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <div
                          className="flex-1 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: parseMathInText(opt) }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bottom Actions Bar */}
            <div className="border-t border-slate-200 bg-slate-50 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleClearSelection(currentIndex)}
                  disabled={userAnswers[currentIndex] === undefined}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                >
                  Clear Choice
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleReview(currentIndex)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition ${
                    markedForReview[currentIndex]
                      ? 'border-purple-600 bg-purple-100 text-purple-900 font-bold'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Flag className="h-3.5 w-3.5" />
                  <span>{markedForReview[currentIndex] ? 'Marked for Review' : 'Mark for Review'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>
                {currentIndex < testData.questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIndex((prev) => Math.min(testData.questions.length - 1, prev + 1))}
                    className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
                  >
                    Save & Next <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinishTest}
                    className="px-5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs transition"
                  >
                    Submit Paper
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* View State 3: RESULTS & DEEP PYQ GURU EVALUATION */}
        {viewState === 'results' && testData && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 bg-[#faf9f5]">
            {/* Scorecard Hero Banner */}
            <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 p-6 text-white shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-amber-400" /> PYQ Guru Examination Result
                  </span>
                  <h4 className="text-2xl sm:text-3xl font-black mt-1">
                    {testData.testTitle || `${topic} PYQ Mastery Paper`}
                  </h4>
                  <p className="text-xs text-indigo-200 mt-1">
                    Target: {testData.examTarget} • {grade} • Evaluated against official 25-Year Marking Rubrics
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-center bg-white/10 rounded-xl p-3 border border-white/10">
                    <div className="text-2xl sm:text-3xl font-black text-amber-400">
                      {results.totalScore} <span className="text-sm text-indigo-200 font-normal">/ {results.maxScore}</span>
                    </div>
                    <div className="text-[11px] text-indigo-200">Total Score</div>
                  </div>

                  <div className="text-center bg-white/10 rounded-xl p-3 border border-white/10">
                    <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                      {results.accuracy}%
                    </div>
                    <div className="text-[11px] text-indigo-200">Accuracy</div>
                  </div>
                </div>
              </div>

              {/* Stat Pills */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/10 text-xs">
                <div className="bg-emerald-500/20 rounded-lg p-2 text-center text-emerald-300 font-semibold">
                  ✓ {results.correct} Correct (+{results.correct * 4})
                </div>
                <div className="bg-red-500/20 rounded-lg p-2 text-center text-red-300 font-semibold">
                  ✗ {results.incorrect} Incorrect (-{results.incorrect * 1})
                </div>
                <div className="bg-slate-500/20 rounded-lg p-2 text-center text-slate-300 font-semibold">
                  ○ {results.skipped} Unattempted
                </div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="font-bold text-slate-800 text-sm">
                Detailed Question-by-Question PYQ Analysis:
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print Paper & Solutions</span>
                </button>
                <button
                  onClick={handleResetToConfigure}
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 font-semibold text-white hover:bg-indigo-700 transition"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Configure New Test</span>
                </button>
              </div>
            </div>

            {/* Question Breakdown Cards */}
            <div className="space-y-4">
              {testData.questions.map((q, idx) => {
                const userAns = userAnswers[idx];
                const isCorrect = userAns === q.correctOptionIndex;
                const isSkipped = userAns === undefined;

                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border p-4 sm:p-5 bg-white shadow-xs space-y-3.5 ${
                      isCorrect
                        ? 'border-emerald-300 bg-emerald-50/20'
                        : isSkipped
                        ? 'border-slate-200'
                        : 'border-red-300 bg-red-50/20'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">Question {idx + 1}</span>
                        <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full text-[10px]">
                          {q.provenance}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 font-semibold">
                        {isCorrect && (
                          <span className="text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="h-4 w-4" /> Correct (+{q.marks})
                          </span>
                        )}
                        {!isCorrect && !isSkipped && (
                          <span className="text-red-600 flex items-center gap-1">
                            <XCircle className="h-4 w-4" /> Incorrect (-{q.negativeMarks})
                          </span>
                        )}
                        {isSkipped && (
                          <span className="text-slate-500">Unattempted (0)</span>
                        )}
                      </div>
                    </div>

                    {/* Question text */}
                    <div
                      className="text-sm sm:text-base font-medium text-slate-900 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: parseMathInText(q.questionText) }}
                    />

                    {/* Options list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt, oIdx) => {
                        const isCorrectOption = oIdx === q.correctOptionIndex;
                        const isUserChoice = userAns === oIdx;

                        let style = 'border-slate-200 bg-slate-50/50 text-slate-700';
                        if (isCorrectOption) {
                          style = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-500';
                        } else if (isUserChoice) {
                          style = 'border-red-400 bg-red-50 text-red-950 line-through';
                        }

                        return (
                          <div
                            key={oIdx}
                            className={`rounded-xl border p-2.5 flex items-start gap-2 ${style}`}
                          >
                            <span className="font-mono font-bold">{String.fromCharCode(65 + oIdx)})</span>
                            <div
                              className="flex-1"
                              dangerouslySetInnerHTML={{ __html: parseMathInText(opt) }}
                            />
                            {isCorrectOption && <Check className="h-4 w-4 text-emerald-600 shrink-0" />}
                          </div>
                        );
                      })}
                    </div>

                    {/* Step-Marking Rubric (Board style) */}
                    {q.stepMarkingRubric && q.stepMarkingRubric.length > 0 && (
                      <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-3 text-xs text-indigo-950">
                        <span className="font-bold text-indigo-900 uppercase tracking-wider text-[10px] block mb-1">
                          📋 Official Board Step-Marking Rubric:
                        </span>
                        <ul className="space-y-1 pl-2">
                          {q.stepMarkingRubric.map((step, sIdx) => (
                            <li key={sIdx} className="flex items-start gap-1.5 font-mono text-[11px]">
                              <span className="text-indigo-600 font-bold">›</span>
                              <span dangerouslySetInnerHTML={{ __html: parseMathInText(step) }} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Detailed Pedagogical Explanation */}
                    <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200 text-xs sm:text-sm text-slate-800 space-y-1.5">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                        <BookOpen className="h-3.5 w-3.5 text-indigo-600" />
                        Complete Pedagogical Solution:
                      </span>
                      <div
                        className="leading-relaxed font-hand-patrick text-sm sm:text-base text-slate-800"
                        dangerouslySetInnerHTML={{ __html: parseMathInText(q.detailedExplanation) }}
                      />
                    </div>

                    {/* Examiner Trap Warning */}
                    {q.examinerTrapWarning && (
                      <div className="rounded-xl border border-amber-300 bg-amber-50/70 p-3 text-xs text-amber-950 flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-bold block mb-0.5 text-amber-900">
                            Examiner Trap Analysis (Why Students Picked Distractor):
                          </strong>
                          <span dangerouslySetInnerHTML={{ __html: parseMathInText(q.examinerTrapWarning) }} />
                        </div>
                      </div>
                    )}

                    {/* Topper Shortcut */}
                    {q.topperShortcut && (
                      <div className="rounded-xl border border-emerald-300 bg-emerald-50/70 p-3 text-xs text-emerald-950 flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-bold block mb-0.5 text-emerald-900">
                            1-Minute Competitive Elimination Shortcut:
                          </strong>
                          <span dangerouslySetInnerHTML={{ __html: parseMathInText(q.topperShortcut) }} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              {onOpenNotes && (
                <button
                  onClick={() => {
                    onOpenNotes(topic, grade, subject);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-900 bg-amber-100 px-4 py-2 rounded-xl transition"
                >
                  <Sparkles className="h-4 w-4" />
                  Send Mistakes to Handwritten Study Register →
                </button>
              )}

              <button
                onClick={handleResetToConfigure}
                className="ml-auto rounded-xl bg-slate-900 text-white font-bold px-5 py-2 text-xs hover:bg-slate-800 transition"
              >
                Generate Another PYQ Test
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
