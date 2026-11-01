import React from 'react';
import { GuidedTourStep, OrganModelSpec, AnatomicalStructure } from '../types/anatomy';
import { 
  Play, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Sparkles, 
  X, 
  Droplets,
  Heart,
  Volume2
} from 'lucide-react';

interface GuidedTourControllerProps {
  organ: OrganModelSpec;
  currentStepIndex: number;
  onStepChange: (index: number) => void;
  onCloseTour: () => void;
  onSelectStructure: (s: AnatomicalStructure | null) => void;
}

export const GuidedTourController: React.FC<GuidedTourControllerProps> = ({
  organ,
  currentStepIndex,
  onStepChange,
  onCloseTour,
  onSelectStructure
}) => {
  const steps = organ.guidedTourSteps;
  const currentStep = steps[currentStepIndex] || steps[0];

  if (!currentStep) return null;

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      const nextIdx = currentStepIndex + 1;
      onStepChange(nextIdx);
      const struct = organ.structures.find(s => s.id === steps[nextIdx].structureId);
      if (struct) onSelectStructure(struct);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      onStepChange(prevIdx);
      const struct = organ.structures.find(s => s.id === steps[prevIdx].structureId);
      if (struct) onSelectStructure(struct);
    }
  };

  const handleSpeakNarration = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentStep.narration);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border-2 border-purple-500/50 shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-2 relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header with Step Indicator & Close */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-600 text-white flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Guided Tour</span>
          </span>
          <span className="text-xs font-mono text-purple-300 font-bold">
            Step {currentStep.stepNumber} of {steps.length}
          </span>
        </div>

        <button
          onClick={onCloseTour}
          className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          title="Exit Tour"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Step Title & Narration */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span>{currentStep.title}</span>
            {currentStep.bloodOxygenation && (
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                currentStep.bloodOxygenation === 'oxygenated'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              }`}>
                {currentStep.bloodOxygenation} blood
              </span>
            )}
          </h3>

          <button
            onClick={handleSpeakNarration}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-purple-600 text-slate-300 hover:text-white transition cursor-pointer shrink-0"
            title="Read Narration Aloud"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
          {currentStep.narration}
        </p>

        {currentStep.clinicalNote && (
          <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200 space-y-0.5">
            <strong className="block text-amber-300 uppercase text-[10px] tracking-wider">NEET &amp; Clinical Correlation:</strong>
            <span>{currentStep.clinicalNote}</span>
          </div>
        )}
      </div>

      {/* Step Navigation Bar */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800">
        <button
          onClick={handlePrev}
          disabled={currentStepIndex === 0}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer flex items-center gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {/* Step dots */}
        <div className="flex items-center gap-1.5">
          {steps.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                onStepChange(idx);
                const struct = organ.structures.find(x => x.id === s.structureId);
                if (struct) onSelectStructure(struct);
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                idx === currentStepIndex 
                  ? 'bg-purple-500 ring-2 ring-purple-300 scale-125' 
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
              title={s.title}
            />
          ))}
        </div>

        {currentStepIndex < steps.length - 1 ? (
          <button
            onClick={handleNext}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md"
          >
            <span>Next Step</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onCloseTour}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Complete Tour</span>
          </button>
        )}
      </div>
    </div>
  );
};
