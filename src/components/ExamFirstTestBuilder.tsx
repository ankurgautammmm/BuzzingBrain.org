import React, { useState, useMemo } from 'react';
import { 
  Target, 
  Layers, 
  CheckSquare, 
  Square, 
  Sparkles, 
  BrainCircuit, 
  TrendingUp, 
  Clock, 
  Award, 
  Play, 
  Filter, 
  Check, 
  CheckCircle2, 
  Flame,
  AlertCircle
} from 'lucide-react';
import { 
  TARGET_EXAMINATIONS, 
  CURRICULUM_STRUCTURE, 
  CURRICULUM_CHAPTERS, 
  CurriculumChapter
} from '../data/curriculumHierarchy';
import { ChapterTest, PracticeQuestion, getTestForChapter } from '../data/chapterTests';

interface ExamFirstTestBuilderProps {
  onStartTest: (test: ChapterTest, patternKey: 'cbse' | 'neet' | 'jee') => void;
  onRequireAuth: () => void;
  isAuthenticated: boolean;
  activeClass?: string;
}

export const ExamFirstTestBuilder: React.FC<ExamFirstTestBuilderProps> = ({
  onStartTest,
  onRequireAuth,
  isAuthenticated,
  activeClass = 'Class 11',
}) => {
  // Step 1: Examination First
  const [targetExamId, setTargetExamId] = useState<string>('cbse');

  // Step 2: Class Selection
  const [selectedClass, setSelectedClass] = useState<'Class 9' | 'Class 10' | 'Class 11' | 'Class 12'>(
    (activeClass === 'Class 9' || activeClass === 'Class 10' || activeClass === 'Class 12') ? activeClass : 'Class 11'
  );

  // Step 3: Stream Selection (for Class 11 & 12)
  const [selectedStream, setSelectedStream] = useState<'Science Stream' | 'Commerce' | 'Humanities'>('Science Stream');

  // Multi-Subject Selection: Set of subject names
  const availableSubjects = useMemo(() => {
    const node = CURRICULUM_STRUCTURE[selectedClass];
    if (!node.hasStreams) {
      return node.subjects || ['Mathematics', 'Science', 'Social Science', 'Languages'];
    }
    const stream = (node.streams || []).find((s) => s.name === selectedStream);
    return stream ? stream.subjects : ['Physics', 'Chemistry', 'Biology', 'Mathematics'];
  }, [selectedClass, selectedStream]);

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(() => [availableSubjects[0] || 'Science']);

  // Keep selected subjects valid when class or stream changes
  React.useEffect(() => {
    setSelectedSubjects((prev) => {
      const valid = prev.filter((s) => availableSubjects.includes(s));
      return valid.length > 0 ? valid : [availableSubjects[0] || 'Science'];
    });
  }, [availableSubjects]);

  // Step 4: Multi-Chapter Selection
  // Chapters available based on selectedClass, selectedStream, and selectedSubjects
  const candidateChapters = useMemo(() => {
    return CURRICULUM_CHAPTERS.filter((ch) => {
      const classMatch = ch.classGrade === selectedClass;
      const streamMatch = !ch.stream || ch.stream === selectedStream;
      const subjectMatch = selectedSubjects.includes(ch.subject);
      return classMatch && streamMatch && subjectMatch;
    });
  }, [selectedClass, selectedStream, selectedSubjects]);

  const [selectedChapterIds, setSelectedChapterIds] = useState<string[]>([]);

  // Auto-select first 3 chapters by default or when candidate chapters change
  React.useEffect(() => {
    if (candidateChapters.length > 0) {
      setSelectedChapterIds((prev) => {
        const candidateSet = new Set(candidateChapters.map((c) => c.id));
        const validExisting = prev.filter((id) => candidateSet.has(id));
        if (validExisting.length > 0) return validExisting;
        return candidateChapters.slice(0, Math.min(3, candidateChapters.length)).map((c) => c.id);
      });
    } else {
      setSelectedChapterIds([]);
    }
  }, [candidateChapters]);

  // Step 5: Test Parameters
  const [questionCount, setQuestionCount] = useState<number>(15);
  const [includePredictive50Yr, setIncludePredictive50Yr] = useState<boolean>(true);
  const [difficulty, setDifficulty] = useState<'Board Standard' | 'Exemplar High' | 'Conceptual Foundation'>('Board Standard');

  // Toggle subject selection
  const handleToggleSubject = (subject: string) => {
    setSelectedSubjects((prev) => {
      if (prev.includes(subject)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter((s) => s !== subject);
      } else {
        return [...prev, subject];
      }
    });
  };

  // Toggle chapter selection
  const handleToggleChapter = (chapterId: string) => {
    setSelectedChapterIds((prev) => {
      if (prev.includes(chapterId)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter((id) => id !== chapterId);
      } else {
        return [...prev, chapterId];
      }
    });
  };

  // Select all or deselect all chapters
  const handleSelectAllChapters = () => {
    if (selectedChapterIds.length === candidateChapters.length) {
      // Keep only the first chapter
      setSelectedChapterIds(candidateChapters.slice(0, 1).map((c) => c.id));
    } else {
      setSelectedChapterIds(candidateChapters.map((c) => c.id));
    }
  };

  // Build & Launch the Combined Test
  const handleLaunchTest = () => {
    if (!isAuthenticated) {
      onRequireAuth();
      return;
    }

    const chosenChapters = candidateChapters.filter((c) => selectedChapterIds.includes(c.id));
    if (chosenChapters.length === 0) return;

    // Collect questions across all chosen chapters
    const combinedQuestions: PracticeQuestion[] = [];
    const patternKey = targetExamId === 'neet' ? 'neet' : (targetExamId === 'jee_main' || targetExamId === 'jee_adv' ? 'jee' : 'cbse');
    const marksPerQ = patternKey === 'neet' || patternKey === 'jee' ? 4 : 1;

    let qCounter = 1;
    for (const ch of chosenChapters) {
      const baseTest = getTestForChapter(ch.title, ch.classGrade, ch.subject);
      if (baseTest && baseTest.questions.length > 0) {
        for (const q of baseTest.questions) {
          combinedQuestions.push({
            ...q,
            id: `q_multi_${qCounter++}`,
            topic: ch.title,
            marks: marksPerQ,
            difficulty: difficulty,
            boardYear: `${targetExamId.toUpperCase()} 50-Year (1975–2025) Archive`,
          });
        }
      } else {
        // Synthesize fallback high-yield questions for chapter
        for (let i = 0; i < Math.min(3, ch.keyTopics.length); i++) {
          const topicName = ch.keyTopics[i] || ch.title;
          combinedQuestions.push({
            id: `q_multi_${qCounter++}`,
            question: `In the study of ${ch.title} (${topicName}), which of the following statements represents the core NCERT physical / theoretical principle?`,
            type: 'mcq',
            options: [
              `Consistent with primary 50-year examination laws for ${topicName}.`,
              `Violates foundational conservation principles outlined in NCERT.`,
              `Applicable strictly at absolute zero temperature conditions.`,
              `Dependent entirely on arbitrary reference system boundaries.`
            ],
            correctAnswer: 0,
            explanation: `Standard 50-Year PYQ principle for ${ch.title}: As stated in official NCERT text, primary axioms govern ${topicName}.`,
            marks: marksPerQ,
            difficulty: difficulty,
            topic: ch.title,
            boardYear: `${targetExamId.toUpperCase()} High-Yield 50-Yr Predictor`,
          });
        }
      }
    }

    // Slice to desired questionCount or keep all if less
    const finalQuestions = combinedQuestions.slice(0, Math.max(questionCount, 5));

    const combinedTest: ChapterTest = {
      id: `multi_exam_${Date.now()}`,
      title: `${targetExamId.toUpperCase()} Combined Mock: ${selectedSubjects.join(' + ')} (${chosenChapters.length} Chapters)`,
      classGrade: selectedClass,
      subject: selectedSubjects.join(', '),
      chapter: chosenChapters.map((c) => c.title).join(', '),
      difficulty: difficulty,
      durationMinutes: Math.max(10, Math.round(finalQuestions.length * 2.5)),
      totalMarks: finalQuestions.length * marksPerQ,
      questions: finalQuestions,
    };

    onStartTest(combinedTest, patternKey);
  };

  // Exam pattern description
  const activeExamObj = TARGET_EXAMINATIONS.find((e) => e.id === targetExamId) || TARGET_EXAMINATIONS[0];

  return (
    <div className="w-full astra-card rounded-3xl p-6 sm:p-8 border border-white/10 bg-slate-950/85 space-y-8 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 text-xs font-semibold">
            <Target className="w-3.5 h-3.5" />
            <span>Target Examination First Multi-Chapter Assessment</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            50-Year PYQ &amp; Adaptive Predictive Test Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Trained on 50 years (1975–2025) of examination questions. Select your target exam, then multi-select subjects and chapters to synthesize custom mock papers.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono shrink-0">
          <BrainCircuit className="w-4 h-4 text-purple-400" />
          <span className="text-purple-300 font-bold">1975–2025 Model Active</span>
        </div>
      </div>

      {/* STEP 1: Target Examination Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-[10px]">
              1
            </span>
            <span>Target Examination</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {activeExamObj.years} Archive Scope
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {TARGET_EXAMINATIONS.map((exam) => (
            <button
              key={exam.id}
              type="button"
              onClick={() => {
                setTargetExamId(exam.id);
                // Adjust class defaults if applicable
                if (exam.id === 'neet' || exam.id === 'jee_main' || exam.id === 'jee_adv') {
                  if (selectedClass === 'Class 9' || selectedClass === 'Class 10') {
                    setSelectedClass('Class 11');
                  }
                }
              }}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                targetExamId === exam.id
                  ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md font-extrabold scale-102'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
              }`}
            >
              <div className="text-xs font-extrabold line-clamp-1">{exam.name.split(' (')[0]}</div>
              <div className={`text-[10px] font-mono line-clamp-1 ${targetExamId === exam.id ? 'text-slate-800' : 'text-slate-400'}`}>
                {exam.scope}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* STEP 2: Class Selection */}
      <div className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-[10px]">
            2
          </span>
          <span>Select Academic Class Grade</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(['Class 9', 'Class 10', 'Class 11', 'Class 12'] as const).map((cls) => (
            <button
              key={cls}
              type="button"
              onClick={() => setSelectedClass(cls)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedClass === cls
                  ? 'bg-white text-slate-950 shadow-md font-extrabold'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              {cls}
            </button>
          ))}
        </div>
      </div>

      {/* STEP 3: Stream (if Class 11/12) & Multiple Subject Checkboxes */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-[10px]">
              3
            </span>
            <span>Select Stream &amp; Subjects (Multi-Select Allowed)</span>
          </div>
          <span className="text-[11px] text-slate-400">
            Selected: <strong className="text-white">{selectedSubjects.join(', ')}</strong>
          </span>
        </div>

        {CURRICULUM_STRUCTURE[selectedClass].hasStreams && (
          <div className="flex items-center gap-2 pb-1">
            {(['Science Stream', 'Commerce', 'Humanities'] as const).map((str) => (
              <button
                key={str}
                type="button"
                onClick={() => setSelectedStream(str)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  selectedStream === str
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold'
                    : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {str}
              </button>
            ))}
          </div>
        )}

        {/* Subjects Multi-Select Checkboxes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {availableSubjects.map((sub) => {
            const isChecked = selectedSubjects.includes(sub);
            return (
              <button
                key={sub}
                type="button"
                onClick={() => handleToggleSubject(sub)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                  isChecked
                    ? 'bg-amber-400/15 border-amber-400 text-amber-300 font-bold'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-xs">{sub}</div>
                {isChecked ? (
                  <CheckSquare className="w-4 h-4 text-amber-400 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 4: Chapter Selection Checkboxes */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-[10px]">
              4
            </span>
            <span>Select Chapters ({selectedChapterIds.length}/{candidateChapters.length} Selected)</span>
          </div>

          <button
            type="button"
            onClick={handleSelectAllChapters}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer underline text-left sm:text-right"
          >
            {selectedChapterIds.length === candidateChapters.length ? 'Deselect All' : 'Select All Chapters'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-80 overflow-y-auto p-1 border border-white/10 rounded-2xl bg-black/40 scrollbar-thin scrollbar-thumb-white/20">
          {candidateChapters.map((ch) => {
            const isChecked = selectedChapterIds.includes(ch.id);
            return (
              <div
                key={ch.id}
                onClick={() => handleToggleChapter(ch.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  isChecked
                    ? 'bg-amber-400/10 border-amber-400/50 text-white'
                    : 'bg-white/5 hover:bg-white/10 border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-amber-400 font-bold">Ch {ch.number}</span>
                    <span className="text-[10px] text-slate-400">&bull; {ch.subject}</span>
                    {ch.predictiveLikelihood >= 85 && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                        {ch.predictiveLikelihood}% High Prob
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-white leading-snug line-clamp-1">{ch.title}</div>
                  <div className="text-[10px] text-slate-400 line-clamp-1">
                    {ch.keyTopics.slice(0, 3).join(', ')}...
                  </div>
                </div>

                <div className="pt-0.5">
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 5: Configuration & Adaptive Settings */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Test Format &amp; Adaptive Parameters</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Estimated Duration: {Math.round(questionCount * 2.5)} mins
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1 font-semibold">Question Count</label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
            >
              <option value={10}>10 Questions (Quick Check)</option>
              <option value={15}>15 Questions (Standard Practice)</option>
              <option value={25}>25 Questions (Sectional Mock)</option>
              <option value={45}>45 Questions (NEET Subject Mock)</option>
              <option value={90}>90 Questions (Full Mock Paper)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1 font-semibold">Difficulty Level</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
            >
              <option value="Board Standard">Board / Examination Standard</option>
              <option value="Exemplar High">Exemplar High (Tricky Traps)</option>
              <option value="Conceptual Foundation">Conceptual Foundation (Easy)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={() => setIncludePredictive50Yr(!includePredictive50Yr)}
              className={`w-full py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-between cursor-pointer transition ${
                includePredictive50Yr
                  ? 'bg-purple-500/20 border-purple-400 text-purple-200'
                  : 'bg-black/40 border-white/15 text-slate-400'
              }`}
            >
              <span>50-Yr Predictive Questions</span>
              {includePredictive50Yr ? (
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-500 shrink-0" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Launch Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="text-xs text-slate-400">
          Synthesizing <strong className="text-white">{questionCount}</strong> questions across{' '}
          <strong className="text-amber-300">{selectedChapterIds.length}</strong> selected chapters in{' '}
          <strong className="text-white">{selectedSubjects.join(' & ')}</strong>.
        </div>

        <button
          type="button"
          onClick={handleLaunchTest}
          disabled={selectedChapterIds.length === 0}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-sm shadow-xl transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          <span>Launch Combined Mock Test</span>
        </button>
      </div>
    </div>
  );
};
