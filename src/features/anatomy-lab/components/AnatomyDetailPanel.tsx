import React, { useState } from 'react';
import { AnatomicalStructure, ExplanationAudience } from '../types/anatomy';
import { 
  BookOpen, 
  GraduationCap, 
  Volume2, 
  CheckCircle2, 
  XCircle, 
  Award, 
  HelpCircle, 
  Focus, 
  Layers, 
  Sparkles, 
  ChevronRight, 
  ExternalLink, 
  Activity,
  Heart,
  Droplets,
  Zap,
  ShieldCheck,
  Languages
} from 'lucide-react';

import { AnatomicalSchematicSvg } from '../graphics/AnatomicalSchematicSvg';

interface AnatomyDetailPanelProps {
  structure: AnatomicalStructure | null;
  organName: string;
  organId?: string;
  isIsolated: boolean;
  onToggleIsolate: () => void;
  onSelectRelated: (structureId: string) => void;
  allStructures: AnatomicalStructure[];
}

export const AnatomyDetailPanel: React.FC<AnatomyDetailPanelProps> = ({
  structure,
  organName,
  organId = 'organ-heart',
  isIsolated,
  onToggleIsolate,
  onSelectRelated,
  allStructures
}) => {
  // Explanation Audience Level: 'school' (NCERT Class 10/11) vs 'advanced' (NEET / OpenStax A&P 2e)
  const [audience, setAudience] = useState<ExplanationAudience>('school');
  const [showHindi, setShowHindi] = useState<boolean>(false);

  // Active Quiz State
  const [activeQuizQuestionIdx, setActiveQuizQuestionIdx] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);

  // Reset quiz state whenever structure changes
  React.useEffect(() => {
    setActiveQuizQuestionIdx(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
  }, [structure?.id]);

  if (!structure) {
    return (
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4 shadow-xl flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shadow-inner">
          <Focus className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white">Select Any Anatomical Structure</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            Click any labeled chamber, valve, or tissue in the 3D {organName} to inspect textbook-verified anatomy, physiological functions, and NEET exam notes.
          </p>
        </div>
      </div>
    );
  }

  const currentQuiz = structure.quizQuestions[activeQuizQuestionIdx] || null;

  const handleSpeakPronunciation = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(structure.name);
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const relatedStructures = allStructures.filter(s => 
    structure.relatedStructureIds?.includes(s.id)
  );

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden divide-y divide-slate-800/80 animate-in fade-in duration-300">
      {/* 1. Header with Nomenclature & Pronunciation */}
      <div className="p-6 space-y-3 bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/30">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: structure.defaultColor }} />
            <span>{structure.system}</span>
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowHindi(!showHindi)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                showHindi ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
              title="Toggle Hindi Nomenclature"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{showHindi ? 'हिंदी' : 'Hindi'}</span>
            </button>

            <button
              onClick={onToggleIsolate}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm ${
                isIsolated 
                  ? 'bg-sky-500 text-slate-950 ring-2 ring-sky-300' 
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
              title="Dim surrounding anatomy to inspect this structure alone"
            >
              <Focus className="w-3.5 h-3.5" />
              <span>{isIsolated ? 'Isolated' : 'Isolate 3D'}</span>
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {structure.name}
            </h2>
            <button
              onClick={handleSpeakPronunciation}
              className="p-1.5 rounded-full bg-slate-800 hover:bg-purple-600 text-slate-300 hover:text-white transition cursor-pointer"
              title="Pronounce Anatomical Term"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-400 font-serif italic">
            <span>Latin: <strong className="text-slate-300 not-italic">{structure.latinName}</strong></span>
            <span>&bull;</span>
            <span className="font-mono text-[11px] not-italic text-purple-300">[{structure.pronunciation}]</span>
          </div>

          {showHindi && (
            <div className="mt-1.5 text-xs font-semibold text-amber-300 bg-amber-400/10 border border-amber-400/20 px-3 py-1.5 rounded-xl inline-block">
              हिंदी नाम: {structure.hindiName}
            </div>
          )}
        </div>
      </div>

      {/* 2. Educational Audience Mode Toggle (School vs Advanced) */}
      <div className="px-6 py-3 bg-slate-950/60 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-semibold text-slate-300">Explanation Depth:</span>
        </div>

        <div className="flex items-center p-0.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setAudience('school')}
            className={`px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              audience === 'school'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>NCERT School</span>
          </button>
          <button
            onClick={() => setAudience('advanced')}
            className={`px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              audience === 'advanced'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>NEET &amp; OpenStax</span>
          </button>
        </div>
      </div>

      {/* 3. Primary Anatomical Explanation Text */}
      <div className="p-6 space-y-4">
        {audience === 'school' ? (
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold block">
              NCERT Curriculum Core Explanation
            </span>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              {structure.schoolExplanation}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400 font-bold block">
              Advanced Clinical &amp; Physiological Analysis (OpenStax / Gray\'s Anatomy)
            </span>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              {structure.advancedExplanation}
            </p>
          </div>
        )}

        {/* Location & Gross Anatomy Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block">
              Anatomical Location:
            </span>
            <p className="text-slate-300 leading-relaxed">
              {structure.location}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block">
              Gross Morphological Description:
            </span>
            <p className="text-slate-300 leading-relaxed">
              {structure.grossDescription}
            </p>
          </div>
        </div>

        {/* Main Physiological Function */}
        <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20 text-xs space-y-1.5">
          <span className="font-bold text-purple-300 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            <span>Primary Physiological Function:</span>
          </span>
          <p className="text-slate-200 leading-relaxed font-medium">
            {structure.mainFunction}
          </p>
        </div>

        {/* Blood Supply & Innervation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-bold text-rose-400 uppercase text-[10px] tracking-wider flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5" />
              <span>Blood Supply:</span>
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              {structure.bloodSupply}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-bold text-amber-400 uppercase text-[10px] tracking-wider flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Innervation:</span>
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              {structure.innervation}
            </p>
          </div>
        </div>

        {/* Interactive 2D Anatomical Schematic Diagram */}
        <AnatomicalSchematicSvg 
          organId={organId} 
          selectedStructure={structure} 
          onSelectStructureId={onSelectRelated} 
        />

        {/* High-Yield Medical Terminology */}
        {structure.importantTerminology.length > 0 && (
          <div className="space-y-2 pt-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
              Key Examination Terminology:
            </span>
            <div className="space-y-1.5">
              {structure.importantTerminology.map((term, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs">
                  <strong className="text-purple-300 block mb-0.5">{term.term}</strong>
                  <span className="text-slate-300 text-[11px] leading-relaxed">{term.definition}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Anatomical Structures (Interactive Links) */}
        {relatedStructures.length > 0 && (
          <div className="space-y-2 pt-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
              Select Related Anatomical Structures:
            </span>
            <div className="flex flex-wrap gap-2">
              {relatedStructures.map(rel => (
                <button
                  key={rel.id}
                  onClick={() => onSelectRelated(rel.id)}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-purple-600/30 border border-slate-800 hover:border-purple-400 text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer flex items-center gap-1.5 group"
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: rel.defaultColor }} />
                  <span>{rel.name}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. Interactive Knowledge-Check Quiz */}
      {currentQuiz && (
        <div className="p-6 bg-slate-950/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Structure Knowledge Check ({currentQuiz.examTag} Focus)
              </h4>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
              Q{activeQuizQuestionIdx + 1} of {structure.quizQuestions.length}
            </span>
          </div>

          <div className="text-xs sm:text-sm font-semibold text-slate-200">
            {currentQuiz.question}
          </div>

          {/* Options */}
          <div className="space-y-2">
            {currentQuiz.options.map((opt, optIdx) => {
              const isSelected = selectedAnswer === optIdx;
              const isCorrect = optIdx === currentQuiz.correctAnswer;

              let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white';
              if (isAnswerSubmitted) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
                }
              } else if (isSelected) {
                btnStyle = 'bg-purple-600/30 border-purple-400 text-white font-bold';
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => {
                    if (!isAnswerSubmitted) setSelectedAnswer(optIdx);
                  }}
                  disabled={isAnswerSubmitted}
                  className={`w-full p-3 rounded-xl border text-left text-xs transition cursor-pointer flex items-center justify-between gap-3 ${btnStyle}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {isAnswerSubmitted && isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrect && (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Submit / Next Button */}
          {!isAnswerSubmitted ? (
            <button
              onClick={() => {
                if (selectedAnswer !== null) setIsAnswerSubmitted(true);
              }}
              disabled={selectedAnswer === null}
              className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bold text-xs transition cursor-pointer"
            >
              Verify Answer
            </button>
          ) : (
            <div className="space-y-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <strong className="text-white block mb-1">Scientific Rationale:</strong>
                {currentQuiz.explanation}
              </div>

              {activeQuizQuestionIdx < structure.quizQuestions.length - 1 && (
                <button
                  onClick={() => {
                    setActiveQuizQuestionIdx(prev => prev + 1);
                    setSelectedAnswer(null);
                    setIsAnswerSubmitted(false);
                  }}
                  className="w-full py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Next Question</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* 5. Textbook Verification & Source Citation Footer */}
      <div className="p-4 bg-slate-950 text-[11px] text-slate-400 space-y-1">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{structure.textbookCitation.source}</span>
          </span>
          <span className="text-[10px] text-emerald-400 font-mono">
            {structure.textbookCitation.verificationStatus}
          </span>
        </div>
        <p className="text-[10px] text-slate-500">
          Authors: {structure.textbookCitation.authors} &bull; {structure.textbookCitation.chapter}
        </p>
      </div>
    </div>
  );
};
