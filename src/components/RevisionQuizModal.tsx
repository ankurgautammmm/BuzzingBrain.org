import React, { useState } from 'react';
import { Award, CheckCircle2, XCircle, RotateCcw, X, BrainCircuit, Sparkles } from 'lucide-react';
import { parseMathInText } from '../utils/latexParser';

interface RevisionQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: string;
  markdown: string;
}

interface QuestionItem {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const RevisionQuizModal: React.FC<RevisionQuizModalProps> = ({
  isOpen,
  onClose,
  topic,
  markdown,
}) => {
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);

  // Generate dynamic questions from the notes markdown (examiner tips, formulas, key definitions)
  React.useEffect(() => {
    if (isOpen && markdown) {
      const generated = generateQuestionsFromMarkdown(topic, markdown);
      setQuestions(generated);
      setCurrentIndex(0);
      setSelectedOption(null);
      setShowResult(false);
      setScore(0);
      setAnsweredCount(0);
    }
  }, [isOpen, markdown, topic]);

  if (!isOpen) return null;

  const currentQ = questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    setAnsweredCount((prev) => prev + 1);
    if (idx === currentQ?.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowResult(false);
    setScore(0);
    setAnsweredCount(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-sans-clean">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-200 bg-amber-500/10 px-5 py-3.5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-white shadow-xs">
              <BrainCircuit className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Examiner Rapid Recall Quiz
              </h3>
              <p className="text-xs text-slate-500">
                Testing High-Yield Tips & Core Concepts for {topic}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {!showResult && currentQ ? (
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                <span className="font-semibold text-amber-700 uppercase tracking-wider">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="bg-slate-100 px-2 py-0.5 rounded-full font-mono text-[11px]">
                  Score: {score}/{answeredCount}
                </span>
              </div>

              <h4
                className="text-base sm:text-lg font-semibold text-slate-900 leading-snug mb-4"
                dangerouslySetInnerHTML={{ __html: parseMathInText(currentQ.question) }}
              />

              <div className="space-y-2.5">
                {currentQ.options.map((opt, idx) => {
                  let btnStyle = 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-800';
                  if (selectedOption !== null) {
                    if (idx === currentQ.correctIndex) {
                      btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold ring-1 ring-emerald-500';
                    } else if (selectedOption === idx) {
                      btnStyle = 'border-red-400 bg-red-50 text-red-900 line-through';
                    } else {
                      btnStyle = 'opacity-50 border-slate-200';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={selectedOption !== null}
                      className={`w-full text-left rounded-xl border p-3 text-sm transition flex items-center justify-between ${btnStyle}`}
                    >
                      <span
                        className="leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: parseMathInText(opt) }}
                      />
                      {selectedOption !== null && idx === currentQ.correctIndex && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 ml-2" />
                      )}
                      {selectedOption === idx && idx !== currentQ.correctIndex && (
                        <XCircle className="h-4 w-4 text-red-500 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedOption !== null && (
                <div className="mt-4 rounded-xl bg-amber-50 p-3.5 border border-amber-200 text-xs text-amber-950 animate-in fade-in">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
                    <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                    Examiner Explanation:
                  </div>
                  <div
                    className="leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: parseMathInText(currentQ.explanation) }}
                  />
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={handleNext}
                      className="rounded-lg bg-amber-600 px-4 py-1.5 text-xs font-semibold text-white shadow hover:bg-amber-700 transition"
                    >
                      {currentIndex < questions.length - 1 ? 'Next Question →' : 'See Final Score'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 mb-3 shadow-inner">
                <Award className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">
                Topper Revision Complete!
              </h4>
              <p className="text-sm text-slate-500 mt-1">
                You scored <strong className="text-slate-800">{score}</strong> out of{' '}
                <strong className="text-slate-800">{questions.length}</strong> on this topic.
              </p>

              <div className="mt-4 inline-block rounded-xl bg-slate-50 border border-slate-200 px-6 py-3">
                <div className="text-2xl font-black text-amber-600">
                  {Math.round((score / Math.max(questions.length, 1)) * 100)}%
                </div>
                <div className="text-xs text-slate-500">Exam Preparedness Rating</div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  onClick={handleRestart}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Retake Quiz
                </button>
                <button
                  onClick={onClose}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-slate-800 transition"
                >
                  Back to Register
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Generates dynamic question items from the notes
function generateQuestionsFromMarkdown(topic: string, markdown: string): QuestionItem[] {
  const list: QuestionItem[] = [];
  const lines = markdown.split('\n');

  // Look for Examiner alerts / pitfalls
  const alerts: string[] = [];
  const quickRevision: string[] = [];

  let inRev = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.toLowerCase().includes('quick revision summary')) {
      inRev = true;
      continue;
    }
    if (inRev && (trimmed.startsWith('- ') || trimmed.startsWith('* '))) {
      quickRevision.push(trimmed.replace(/^[-*•]\s+/, ''));
    }
    if (trimmed.includes('[EXAM ALERT]') || trimmed.includes('Common Pitfall') || trimmed.includes('Mnemonic') || trimmed.includes('⚠️')) {
      alerts.push(trimmed.replace(/^[-*•]\s+/, ''));
    }
  }

  // Question 1 from Examiner alert
  if (alerts.length > 0) {
    const alert = alerts[0];
    list.push({
      question: `According to the Examiner Tips for **${topic}**, what is the crucial distinction to avoid losing marks?`,
      options: [
        alert.replace(/\*\*.*?\*\*/g, '').slice(0, 80) + '...',
        'Assuming standard state conditions always yield zero enthalpy change',
        'Confusing rate constants with equilibrium concentration constants',
        'Neglecting directional arrows in ray/pathway diagrams',
      ],
      correctIndex: 0,
      explanation: `Topper tip: ${alert}`,
    });
  }

  // Question 2 from Quick revision takeaways
  if (quickRevision.length >= 2) {
    list.push({
      question: `Which of the following is highlighted as a high-yield exam takeaway for ${topic}?`,
      options: [
        quickRevision[0].slice(0, 95) + '...',
        'It occurs only under cryogenic temperature constraints',
        'Directly proportional to the inverse square of ambient atmospheric pressure',
        'Can be approximated as an ideal reversible gas cycle at all scales',
      ],
      correctIndex: 0,
      explanation: `Core takeaway: ${quickRevision[0]}`,
    });

    list.push({
      question: `In rapid revision prep for ${topic}, what critical mechanism must be cited?`,
      options: [
        'The classical uncoupled thermodynamic gradient model',
        quickRevision[1].slice(0, 95) + '...',
        'Newtonian linear momentum conservation without external forces',
        'First order kinetic decomposition under standard pH 7',
      ],
      correctIndex: 1,
      explanation: `Essential key point: ${quickRevision[1]}`,
    });
  }

  // Question 3: Common pitfall
  if (alerts.length > 1) {
    list.push({
      question: `What common trap do examiners frequently test in competitive exams on ${topic}?`,
      options: [
        'Writing descriptive essays instead of labeled schematic flowcharts',
        alerts[1].slice(0, 90) + '...',
        'Failing to convert Celsius to Kelvin in state calculations',
        'Ignoring boundary condition constraints in vector sums',
      ],
      correctIndex: 1,
      explanation: `Examiner Warning: ${alerts[1]}`,
    });
  }

  // Fallback defaults if notes are concise
  if (list.length < 3) {
    list.push({
      question: `What is the primary role of high-precision LaTeX formulas in Topper study notes?`,
      options: [
        'To ensure unambiguous mathematical & chemical precision with explicit variable keys',
        'To merely decorate the notebook layout with decorative math fonts',
        'To substitute qualitative explanations with purely computational shorthand',
        'To satisfy university research indexing criteria',
      ],
      correctIndex: 0,
      explanation: 'Precision: LaTeX rendering guarantees standard scientific notation and full variable identification for top exam scoring.',
    });
    list.push({
      question: `Why is the Visual Reference / Diagram Blueprint strictly specified with labels and directional arrows?`,
      options: [
        'Because diagrams in state/board exams carry direct mark allocation for labeled pointers',
        'To occupy blank notebook space at the footer',
        'To replace textual definitions entirely',
        'Because colors are mandatory on exam answer sheets',
      ],
      correctIndex: 0,
      explanation: 'Examiners reward accurate directional arrows, labeled nodes, and clean structural representations.',
    });
  }

  return list.slice(0, 5);
}
