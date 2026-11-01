import React, { useState } from 'react';
import { QuizQuestion, ExamTarget } from '../types/laboratory';
import { Award, CheckCircle2, XCircle, HelpCircle, ArrowRight, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ExperimentQuizProps {
  questions: QuizQuestion[];
  experimentTitle: string;
  selectedExamGoal: ExamTarget;
  onCompleteQuiz: (score: number, total: number, percentage: number) => void;
}

export const ExperimentQuiz: React.FC<ExperimentQuizProps> = ({
  questions,
  experimentTitle,
  selectedExamGoal,
  onCompleteQuiz,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Filter or prioritize questions by exam target if relevant
  const activeQuestions = questions;
  const currentQ = activeQuestions[currentIdx];

  const handleSelectOption = (optionIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQ.id]: optionIdx
    }));
  };

  const handleToggleHint = (qId: string) => {
    setRevealedHints(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  // Submit and calculate results
  const handleSubmitQuiz = () => {
    let score = 0;
    activeQuestions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        score += 1;
      }
    });
    const percentage = Math.round((score / activeQuestions.length) * 100);
    setIsSubmitted(true);
    onCompleteQuiz(score, activeQuestions.length, percentage);
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setRevealedHints({});
    setIsSubmitted(false);
    setCurrentIdx(0);
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const allAnswered = answeredCount === activeQuestions.length;

  // Compute final score if submitted
  const score = activeQuestions.reduce((acc, q) => {
    return acc + (selectedAnswers[q.id] === q.correctAnswer ? 1 : 0);
  }, 0);
  const percentage = Math.round((score / activeQuestions.length) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Quiz Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
              STAGE E &bull; DEDICATED PRACTICAL MCQ QUIZ
            </span>
            <span className="text-xs text-slate-400 capitalize">
              Target: {selectedExamGoal.replace('_', ' ')}
            </span>
          </div>
          <h3 className="text-lg font-black text-white">{experimentTitle}</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified exam-oriented questions on apparatus, theory, observations, errors, and numerical calculations.
          </p>
        </div>

        {/* Progress Pill */}
        <div className="text-right self-stretch sm:self-auto flex sm:flex-col items-center sm:items-end justify-between">
          <span className="text-xs font-mono text-slate-300">
            Answered: <strong className="text-white">{answeredCount}</strong> / {activeQuestions.length}
          </span>
          <div className="w-32 bg-slate-950 rounded-full h-2 mt-1 border border-slate-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${(answeredCount / activeQuestions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Question Display */}
      {currentQ && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
          {/* Question Metadata & Tags */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center font-mono">
                {currentIdx + 1}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                Question {currentIdx + 1} of {activeQuestions.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                {currentQ.topicTag}
              </span>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                currentQ.difficulty === 'hard' 
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : currentQ.difficulty === 'medium'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {currentQ.difficulty}
              </span>
            </div>
          </div>

          {/* Question Stem */}
          <div className="text-sm sm:text-base font-semibold text-white leading-relaxed">
            {currentQ.question}
          </div>

          {/* 4 Options Grid */}
          <div className="space-y-3">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = selectedAnswers[currentQ.id] === optIdx;
              const isCorrect = isSubmitted && optIdx === currentQ.correctAnswer;
              const isWrongSelected = isSubmitted && isSelected && !isCorrect;

              return (
                <div
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`p-4 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-start gap-3 cursor-pointer ${
                    isCorrect
                      ? 'bg-emerald-950/40 border-emerald-500 text-emerald-100 shadow-md'
                      : isWrongSelected
                      ? 'bg-rose-950/40 border-rose-500 text-rose-100'
                      : isSelected
                      ? 'bg-purple-600/20 border-purple-400 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-xl font-bold flex items-center justify-center shrink-0 font-mono text-xs ${
                    isCorrect
                      ? 'bg-emerald-500 text-slate-950'
                      : isWrongSelected
                      ? 'bg-rose-500 text-white'
                      : isSelected
                      ? 'bg-purple-500 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {String.fromCharCode(65 + optIdx)}
                  </span>

                  <span className="flex-1 leading-relaxed mt-0.5">{opt}</span>

                  {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
                  {isWrongSelected && <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
                </div>
              );
            })}
          </div>

          {/* Hint Toggle */}
          {currentQ.hint && !isSubmitted && (
            <div>
              <button
                onClick={() => handleToggleHint(currentQ.id)}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{revealedHints[currentQ.id] ? 'Hide Conceptual Hint' : 'Need a Conceptual Hint?'}</span>
              </button>

              {revealedHints[currentQ.id] && (
                <div className="mt-2 p-3 rounded-xl bg-amber-400/10 border border-amber-400/20 text-xs text-amber-300 animate-in fade-in">
                  <strong>Hint: </strong>{currentQ.hint}
                </div>
              )}
            </div>
          )}

          {/* Detailed Explanations (Shown after Submission) */}
          {isSubmitted && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs animate-in fade-in">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Authoritative Pedagogical Explanation:</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {currentQ.explanation}
              </p>

              {currentQ.distractorExplanations && (
                <div className="space-y-1.5 pt-2 border-t border-slate-900">
                  <span className="font-bold text-slate-400">Why other options are incorrect:</span>
                  {currentQ.distractorExplanations.map((d, dIdx) => (
                    <div key={dIdx} className="text-[11px] text-slate-400 pl-2 border-l border-slate-800">
                      • {d}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-semibold text-slate-300 transition cursor-pointer"
            >
              Previous Question
            </button>

            {currentIdx < activeQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentIdx(prev => Math.min(activeQuestions.length - 1, prev + 1))}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              !isSubmitted ? (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={!allAnswered}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs transition shadow-lg disabled:opacity-40 cursor-pointer"
                >
                  Submit Assessment &amp; Calculate Score
                </button>
              ) : (
                <button
                  onClick={handleResetQuiz}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry Quiz</span>
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* Score Summary Banner (When Submitted) */}
      {isSubmitted && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl ${
              percentage >= 80 ? 'bg-emerald-500 text-slate-950' : percentage >= 50 ? 'bg-amber-400 text-slate-950' : 'bg-rose-500 text-white'
            }`}>
              <Award className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Assessment Complete!</h4>
              <p className="text-xs text-slate-300">
                You scored <strong className="text-amber-400 font-mono text-sm">{score} out of {activeQuestions.length} ({percentage}%)</strong>
              </p>
            </div>
          </div>

          <div className="text-xs font-semibold text-slate-400">
            {percentage >= 80 ? '🌟 Outstanding Master Grade' : percentage >= 50 ? '👍 Solid Conceptual Foundation' : '🔄 Revision Recommended'}
          </div>
        </div>
      )}
    </div>
  );
};
