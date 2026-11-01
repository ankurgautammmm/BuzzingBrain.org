import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Upload, 
  FileText, 
  CheckCircle2, 
  HelpCircle, 
  Copy, 
  Check, 
  Layers, 
  ArrowRight, 
  RotateCcw, 
  Bookmark, 
  Download, 
  Printer, 
  ChevronRight, 
  ChevronDown, 
  Lightbulb, 
  Award,
  Zap,
  Clock,
  Eye
} from 'lucide-react';
import { UserProfile } from '../types';
import { logger } from '../services/logger';

interface CourseTopic {
  id?: string;
  title: string;
  explanation: string;
  keyPoints: string[];
  formulas?: string[];
  examples?: string[];
}

interface CourseDefinition {
  term: string;
  definition: string;
}

interface CourseFormula {
  name: string;
  formula: string;
  notes?: string;
}

interface CourseMCQ {
  id?: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface CourseQA {
  question: string;
  answer: string;
}

interface CourseFlashcard {
  id?: string;
  front: string;
  back: string;
}

export interface GeneratedCourseData {
  chapterTitle: string;
  classGrade: string;
  subject: string;
  summary: string;
  learningOutcomes: string[];
  topics: CourseTopic[];
  definitions: CourseDefinition[];
  formulas: CourseFormula[];
  mcqs: CourseMCQ[];
  shortQuestions: CourseQA[];
  longQuestions: CourseQA[];
  flashcards: CourseFlashcard[];
  revisionChecklist: string[];
}

interface CourseGeneratorSectionProps {
  user: UserProfile | null;
  activeClass: string;
  onGoToStudio?: (cmd: string) => void;
  onRequireAuth: () => void;
}

export const CourseGeneratorSection: React.FC<CourseGeneratorSectionProps> = ({
  user,
  activeClass,
  onGoToStudio,
  onRequireAuth,
}) => {
  const [selectedClass, setSelectedClass] = useState<string>(activeClass || 'Class 10');
  const [selectedSubject, setSelectedSubject] = useState<string>('Science');
  const [chapterInput, setChapterInput] = useState<string>('Life Processes');
  const [textbookContent, setTextbookContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'topics' | 'definitions' | 'mcqs' | 'questions' | 'flashcards' | 'checklist'>('overview');
  const [courseData, setCourseData] = useState<GeneratedCourseData | null>(null);
  const [selectedMcqAnswers, setSelectedMcqAnswers] = useState<Record<number, string>>({});
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState<boolean>(false);

  const sampleChapters: Record<string, string[]> = {
    'Class 9': ['Matter in Our Surroundings', 'Force and Laws of Motion', 'Gravitation', 'The Fundamental Unit of Life'],
    'Class 10': ['Life Processes', 'Chemical Reactions and Equations', 'Light: Reflection and Refraction', 'Electricity'],
    'Class 11': ['Laws of Motion', 'Thermodynamics', 'Structure of Atom', 'Cell: The Unit of Life'],
    'Class 12': ['Electrostatics', 'Current Electricity', 'Solutions', 'Reproduction in Organisms']
  };

  const handleGenerate = async (presetChapter?: string) => {
    const targetChapter = presetChapter || chapterInput;
    if (!targetChapter.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/generate-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapter: targetChapter,
          classGrade: selectedClass,
          subject: selectedSubject,
          textbookText: textbookContent || undefined,
        }),
      });

      const data = await response.json();
      if (data.success && data.course) {
        setCourseData(data.course);
        setSelectedMcqAnswers({});
        setFlippedCards({});
        setCheckedItems({});
      }
    } catch (err) {
      logger.error('CourseGeneratorSection', 'Course generation error', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFlashcard = (idx: number) => {
    setFlippedCards(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleChecklist = (idx: number) => {
    setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    if (!courseData) return;
    navigator.clipboard.writeText(`${courseData.chapterTitle} - Summary\n\n${courseData.summary}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalChecklist = courseData?.revisionChecklist.length || 0;
  const progressPercent = totalChecklist > 0 ? Math.round((completedCount / totalChecklist) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 text-slate-100">
      {/* Header & Value Proposition */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Curriculum Engine &bull; Requirement 4</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Textbook to Complete Course
          </h1>
          <p className="text-sm text-slate-400 mt-1.5 max-w-2xl">
            Convert any NCERT textbook chapter, PDF excerpt, or syllabus topic into an organized, comprehensive learning course with explanations, formulas, definitions, MCQs, and interactive flashcards.
          </p>
        </div>

        {courseData && (
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Course</span>
            </button>
            {onGoToStudio && (
              <button
                onClick={() => onGoToStudio(`/handwriting class:${selectedClass.replace('Class ', '')} subject:${selectedSubject} chapter:"${courseData.chapterTitle}"`)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <span>Make Handwritten Notes</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Input & Generator Card */}
      <div className="p-6 rounded-3xl astra-card border border-white/10 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Class / Grade</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden focus:border-amber-400"
            >
              <option value="Class 9">Class 9</option>
              <option value="Class 10">Class 10</option>
              <option value="Class 11">Class 11</option>
              <option value="Class 12">Class 12</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden focus:border-amber-400"
            >
              <option value="Science">Science</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Social Science">Social Science</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Chapter / Topic Title</label>
            <input
              type="text"
              value={chapterInput}
              onChange={(e) => setChapterInput(e.target.value)}
              placeholder="e.g. Life Processes, Friction..."
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden focus:border-amber-400"
            />
          </div>
        </div>

        {/* Optional Textbook Paste / PDF Extraction Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
            <span>Optional: Paste Raw Textbook Excerpt or Notes (or leave blank to auto-generate from NCERT curriculum)</span>
            <span className="text-[11px] text-slate-500">{textbookContent.length} chars</span>
          </label>
          <textarea
            value={textbookContent}
            onChange={(e) => setTextbookContent(e.target.value)}
            placeholder="Paste text from your NCERT PDF, scanned chapter notes, or syllabus bullet points..."
            rows={3}
            className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-hidden focus:border-amber-400 placeholder:text-slate-600"
          />
        </div>

        {/* Quick presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-400 font-medium">Quick NCERT Chapters:</span>
          {(sampleChapters[selectedClass] || sampleChapters['Class 10']).map((ch) => (
            <button
              key={ch}
              onClick={() => {
                setChapterInput(ch);
                handleGenerate(ch);
              }}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 transition-colors cursor-pointer"
            >
              {ch}
            </button>
          ))}
        </div>

        {/* Generate Button */}
        <div className="pt-2">
          <button
            onClick={() => handleGenerate()}
            disabled={isLoading || !chapterInput.trim()}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-bold text-sm transition-all shadow-lg active:scale-[0.98] cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isLoading ? 'Synthesizing Full Course Material...' : 'Generate Complete Course'}</span>
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="p-12 rounded-3xl astra-card border border-white/10 text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-amber-400 border-t-transparent animate-spin mx-auto"></div>
          <h3 className="text-lg font-bold text-white">Structuring NCERT Chapter Curriculum</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Extracting definitions, formulating step-by-step topic breakdowns, writing model board answers, and compiling exam flashcards...
          </p>
        </div>
      )}

      {/* Course Content View */}
      {courseData && !isLoading && (
        <div className="space-y-6">
          {/* Course Banner & Navigation */}
          <div className="p-6 rounded-3xl astra-card border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-semibold text-amber-400 uppercase tracking-wider">
                  {courseData.classGrade} &bull; {courseData.subject}
                </span>
                <h2 className="text-2xl font-bold text-white mt-1">
                  {courseData.chapterTitle}
                </h2>
              </div>

              {/* Completion Tracker Badge */}
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-3">
                <div className="text-right">
                  <div className="text-[11px] text-slate-400 font-medium">Chapter Mastery</div>
                  <div className="text-base font-extrabold text-white">{progressPercent}% Completed</div>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-amber-400/30 flex items-center justify-center font-mono text-xs font-bold text-amber-400">
                  {completedCount}/{totalChecklist}
                </div>
              </div>
            </div>

            {/* Course Navigation Tabs */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
              {[
                { id: 'overview', label: 'Summary & Outcomes' },
                { id: 'topics', label: `Topics (${courseData.topics.length})` },
                { id: 'definitions', label: `Definitions & Formulas (${courseData.definitions.length})` },
                { id: 'mcqs', label: `Practice MCQs (${courseData.mcqs.length})` },
                { id: 'questions', label: 'Exam Q&A' },
                { id: 'flashcards', label: `Flashcards (${courseData.flashcards.length})` },
                { id: 'checklist', label: `Revision Tracker (${courseData.revisionChecklist.length})` },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* TAB: Overview & Learning Outcomes */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-8 p-6 rounded-3xl astra-card border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-amber-400" />
                    <span>Executive Chapter Summary</span>
                  </h3>
                  <button
                    onClick={handleCopySummary}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Copy Summary"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                  {courseData.summary}
                </div>
              </div>

              <div className="md:col-span-4 p-6 rounded-3xl astra-card border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Target Learning Outcomes</span>
                </h3>
                <ul className="space-y-2.5">
                  {courseData.learningOutcomes.map((outcome, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB: Topic-by-Topic Explanations */}
          {activeTab === 'topics' && (
            <div className="space-y-6">
              {courseData.topics.map((top, idx) => (
                <div key={idx} className="p-6 rounded-3xl astra-card border border-white/10 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-amber-400/20 text-amber-300 font-mono text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h3 className="text-lg font-bold text-white">{top.title}</h3>
                  </div>

                  <p className="text-slate-300 text-sm leading-relaxed">
                    {top.explanation}
                  </p>

                  {/* Key Points */}
                  {top.keyPoints && top.keyPoints.length > 0 && (
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                      <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">Key Takeaways</h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {top.keyPoints.map((pt, pIdx) => (
                          <li key={pIdx} className="text-xs text-slate-300 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Formulas & Examples */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {top.formulas && top.formulas.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs">
                        <span className="font-bold text-purple-300 block mb-1">Governing Formula:</span>
                        <div className="font-mono text-purple-200">{top.formulas.join(', ')}</div>
                      </div>
                    )}
                    {top.examples && top.examples.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                        <span className="font-bold text-emerald-300 block mb-1">Practical Analogy / Example:</span>
                        <div className="text-emerald-200">{top.examples.join(' ')}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: Definitions & Formulas */}
          {activeTab === 'definitions' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Definitions */}
              <div className="p-6 rounded-3xl astra-card border border-white/10 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-amber-400" />
                  <span>Important NCERT Definitions</span>
                </h3>
                <div className="space-y-3">
                  {courseData.definitions.map((def, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                      <span className="text-xs font-bold text-amber-300">{def.term}</span>
                      <p className="text-xs text-slate-300 leading-relaxed">{def.definition}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Formulas */}
              <div className="p-6 rounded-3xl astra-card border border-white/10 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span>Governing Formulas &amp; Equations</span>
                </h3>
                <div className="space-y-3">
                  {courseData.formulas.map((form, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-300">{form.name}</span>
                      </div>
                      <div className="text-sm font-mono font-bold text-white py-1">
                        {form.formula}
                      </div>
                      {form.notes && (
                        <p className="text-[11px] text-purple-300/80">{form.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: MCQs with Instant Checking */}
          {activeTab === 'mcqs' && (
            <div className="space-y-4">
              {courseData.mcqs.map((mcq, idx) => {
                const userSelected = selectedMcqAnswers[idx];
                const isAnswered = Boolean(userSelected);
                const isCorrect = userSelected === mcq.answer;

                return (
                  <div key={idx} className="p-6 rounded-3xl astra-card border border-white/10 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <h4 className="text-sm font-bold text-white flex items-start gap-2">
                        <span className="text-amber-400 font-mono">Q{idx + 1}.</span>
                        <span>{mcq.question}</span>
                      </h4>
                      {isAnswered && (
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {isCorrect ? 'Correct ✓' : 'Incorrect ✗'}
                        </span>
                      )}
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {mcq.options.map((opt, oIdx) => {
                        const isChosen = userSelected === opt;
                        const isActualCorrect = isAnswered && opt === mcq.answer;

                        return (
                          <button
                            key={oIdx}
                            onClick={() => setSelectedMcqAnswers(prev => ({ ...prev, [idx]: opt }))}
                            className={`p-3 rounded-xl text-xs text-left transition-all border cursor-pointer ${
                              isActualCorrect
                                ? 'bg-emerald-500/20 border-emerald-500/50 text-white font-semibold'
                                : isChosen && !isCorrect
                                ? 'bg-rose-500/20 border-rose-500/50 text-rose-200'
                                : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {isAnswered && (
                      <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
                        <strong className="text-amber-300 font-semibold block mb-0.5">Answer Explanation:</strong>
                        <span>{mcq.explanation}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB: Short & Long Exam Questions */}
          {activeTab === 'questions' && (
            <div className="space-y-6">
              {/* Short Questions */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white">Short Answer Questions (2–3 Marks)</h3>
                {courseData.shortQuestions.map((qa, idx) => (
                  <div key={idx} className="p-5 rounded-2xl astra-card border border-white/10 space-y-2.5">
                    <h4 className="text-xs font-bold text-amber-300">Q{idx + 1}. {qa.question}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed pl-3 border-l-2 border-amber-400/40">
                      {qa.answer}
                    </p>
                  </div>
                ))}
              </div>

              {/* Long Questions */}
              <div className="space-y-4 pt-4">
                <h3 className="text-base font-bold text-white">Long Answer / Derivation Questions (5 Marks)</h3>
                {courseData.longQuestions.map((qa, idx) => (
                  <div key={idx} className="p-5 rounded-2xl astra-card border border-white/10 space-y-2.5">
                    <h4 className="text-xs font-bold text-purple-300">Q{idx + 1}. {qa.question}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed pl-3 border-l-2 border-purple-400/40 whitespace-pre-line">
                      {qa.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: Interactive Flip Flashcards */}
          {activeTab === 'flashcards' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-400 mb-2">
                Click any flashcard to flip between the prompt and the answer. Great for active recall!
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {courseData.flashcards.map((fc, idx) => {
                  const isFlipped = Boolean(flippedCards[idx]);
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleFlashcard(idx)}
                      className={`min-h-[160px] p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isFlipped
                          ? 'bg-amber-400/10 border-amber-400/40 text-amber-100 shadow-md'
                          : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                        <span className="font-mono">Card #{idx + 1}</span>
                        <span className="font-semibold text-amber-400">{isFlipped ? 'ANSWER' : 'QUESTION'}</span>
                      </div>

                      <div className="text-xs font-medium leading-relaxed my-auto">
                        {isFlipped ? fc.back : fc.front}
                      </div>

                      <div className="text-[10px] text-slate-500 text-right mt-2 font-mono">
                        Tap to flip ↺
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: Revision Checklist & Tracker */}
          {activeTab === 'checklist' && (
            <div className="p-6 rounded-3xl astra-card border border-white/10 space-y-6">
              <div>
                <h3 className="text-base font-bold text-white">Chapter Revision Checklist</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Track every milestone needed to secure 100% marks in your upcoming board evaluation.
                </p>
              </div>

              <div className="space-y-2.5">
                {courseData.revisionChecklist.map((item, idx) => {
                  const isDone = Boolean(checkedItems[idx]);
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleChecklist(idx)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                        isDone
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-white line-through opacity-80'
                          : 'bg-white/5 hover:bg-white/10 border-white/5 text-slate-300'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ${
                        isDone ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-bold text-xs' : 'border-white/20'
                      }`}>
                        {isDone && '✓'}
                      </div>
                      <span className="text-xs font-medium">{item}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
