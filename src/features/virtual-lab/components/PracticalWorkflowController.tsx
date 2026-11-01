import React, { useState } from 'react';
import { 
  PracticalExperiment, 
  PracticalStage, 
  ExamTarget, 
  ObservationRow 
} from '../types/laboratory';
import { ChemistryLab3D } from '../scenes/ChemistryLab3D';
import { BiologyMicroscope3D } from '../scenes/BiologyMicroscope3D';
import { PhysicsCircuit3D } from '../scenes/PhysicsCircuit3D';
import { OhmsLawR3F } from '../scenes/OhmsLawR3F';
import { ObservationTable } from './ObservationTable';
import { ExperimentQuiz } from './ExperimentQuiz';
import { CHEMICAL_SAMPLES, ChemicalSample, IndicatorType, computeIndicatorReaction } from '../simulation/chemistrySimulation';
import { BIOLOGY_SPECIMENS, MicroscopeSpecimen, OpticalParameters, computeMicroscopeOptics } from '../simulation/biologySimulation';
import { CircuitParameters, computeOhmicCircuit } from '../simulation/physicsSimulation';
import { 
  BookOpen, 
  ListOrdered, 
  PlayCircle, 
  Calculator, 
  HelpCircle, 
  FileText, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  RotateCcw, 
  ShieldCheck, 
  ArrowLeft,
  Printer,
  Sparkles,
  Layers,
  Award
} from 'lucide-react';

interface PracticalWorkflowControllerProps {
  experiment: PracticalExperiment;
  initialStage?: PracticalStage;
  selectedExamGoal?: ExamTarget;
  onExit?: () => void;
  onSaveProgress?: (record: any) => void;
}

export const PracticalWorkflowController: React.FC<PracticalWorkflowControllerProps> = ({
  experiment,
  initialStage = 'intro',
  selectedExamGoal = 'all',
  onExit,
  onSaveProgress,
}) => {
  // Current active workflow stage
  const [currentStage, setCurrentStage] = useState<PracticalStage>(initialStage);
  const [completedStages, setCompletedStages] = useState<Record<PracticalStage, boolean>>({
    intro: false,
    procedure: false,
    simulation: false,
    calculations: false,
    quiz: false,
    report: false
  });

  // Procedure Stage: Step tracker
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  // Observations Notebook State
  const [observationRows, setObservationRows] = useState<ObservationRow[]>(experiment.defaultObservations);

  // Quiz Score State
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizTotal, setQuizTotal] = useState<number | null>(null);
  const [quizPercentage, setQuizPercentage] = useState<number | null>(null);

  // =========================================================================
  // CHEMISTRY STATE (when experiment is Chemistry)
  // =========================================================================
  const [activeChemSample, setActiveChemSample] = useState<ChemicalSample>(CHEMICAL_SAMPLES[0]);
  const [activeIndicator, setActiveIndicator] = useState<IndicatorType>('none');
  const [dropsAdded, setDropsAdded] = useState<number>(0);
  const chemReaction = computeIndicatorReaction(activeChemSample, activeIndicator, dropsAdded);

  // =========================================================================
  // BIOLOGY STATE (when experiment is Biology)
  // =========================================================================
  const [activeBioSpecimen, setActiveBioSpecimen] = useState<MicroscopeSpecimen>(BIOLOGY_SPECIMENS[0]);
  const [opticsParams, setOpticsParams] = useState<OpticalParameters>({
    eyepieceMagnification: 10,
    objectiveMagnification: 10,
    coarseFocusPosition: 50,
    fineFocusPosition: 50,
    irisDiaphragmPercent: 80
  });
  const opticsState = computeMicroscopeOptics(opticsParams);

  // =========================================================================
  // PHYSICS STATE (when experiment is Physics)
  // =========================================================================
  const [circuitParams, setCircuitParams] = useState<CircuitParameters>({
    supplyVoltageVolts: 2.0,
    wireNominalResistanceOhms: 2.50,
    wireLengthCm: 100,
    rheostatResistanceOhms: 5.0,
    isSwitchClosed: true,
    wireTemperatureCelsius: 25
  });
  const circuitState = computeOhmicCircuit(circuitParams);
  const [physicsMode, setPhysicsMode] = useState<'r3f' | 'classic'>('r3f');

  // Navigation stage markers
  const STAGES: { id: PracticalStage; label: string; icon: React.ReactNode }[] = [
    { id: 'intro', label: '1. Introduction', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'procedure', label: '2. Procedure', icon: <ListOrdered className="w-3.5 h-3.5" /> },
    { id: 'simulation', label: '3. 3D Simulation', icon: <PlayCircle className="w-3.5 h-3.5" /> },
    { id: 'calculations', label: '4. Calculations', icon: <Calculator className="w-3.5 h-3.5" /> },
    { id: 'quiz', label: '5. MCQ Quiz', icon: <HelpCircle className="w-3.5 h-3.5" /> },
    { id: 'report', label: '6. Practical Record', icon: <FileText className="w-3.5 h-3.5" /> }
  ];

  const handleStageChange = (target: PracticalStage) => {
    setCurrentStage(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const markStageCompleted = (stage: PracticalStage) => {
    setCompletedStages(prev => ({ ...prev, [stage]: true }));
  };

  // Add current 3D physics reading to observation table
  const handleRecordCircuitReading = () => {
    const newRow: ObservationRow = {
      id: `reading_${Date.now()}`,
      trial: `Trial ${observationRows.length + 1}`,
      current: circuitState.currentAmperes,
      voltage: circuitState.measuredVoltageDropVolts,
      resistance: circuitState.actualWireResistanceOhms,
      power: circuitState.circuitPowerWatts
    };
    setObservationRows(prev => [...prev, newRow]);
  };

  // Print practical record
  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 py-2">
      {/* Top Breadcrumb & Workflow Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          {onExit && (
            <button
              onClick={onExit}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              title="Return to Practicals Catalogue"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-purple-400">
              <span>{experiment.classGrade} &bull; {experiment.subject}</span>
              <span>&bull;</span>
              <span>Chapter: {experiment.chapter}</span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white">
              {experiment.title}
            </h2>
          </div>
        </div>

        {/* Exam Badges */}
        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
          {experiment.examTags.map(tag => (
            <span 
              key={tag}
              className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30"
            >
              {tag.replace('_', ' ')}
            </span>
          ))}
        </div>
      </div>

      {/* Stage Progression Stepper */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {STAGES.map((s, idx) => {
          const isActive = currentStage === s.id;
          const isDone = completedStages[s.id];

          return (
            <button
              key={s.id}
              onClick={() => handleStageChange(s.id)}
              className={`p-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-between gap-2 cursor-pointer ${
                isActive
                  ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-600/30 scale-[1.02]'
                  : isDone
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/50'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                {s.icon}
                <span className="truncate">{s.label}</span>
              </div>
              {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* STAGE A: INTRODUCTION AND PREREQUISITES */}
      {/* ========================================================================= */}
      {currentStage === 'intro' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Overview Hero */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-purple-950/30 to-slate-900 border border-purple-500/30 space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Stage 1 of 6 &bull; Introduction &amp; Concept Mapping
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Duration: ~{experiment.estimatedDurationMinutes} mins
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white">
              {experiment.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
              {experiment.scientificPrinciple}
            </p>

            <div className="pt-2 text-xs text-purple-300 font-semibold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Syllabus Compliance: {experiment.curriculumReference}</span>
            </div>
          </div>

          {/* Learning Objectives & Prerequisites Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Learning Objectives */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Key Learning Objectives</span>
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-300">
                {experiment.learningObjectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Prerequisites */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Prerequisites &amp; Prior Knowledge</span>
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-300">
                {experiment.prerequisites.map((prereq, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{prereq}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Apparatus & Materials Preview */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>Laboratory Apparatus &amp; Materials Inventory</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {experiment.apparatus.map(app => (
                <div key={app.id} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-mono">
                    <span className="text-blue-400 font-bold">{app.category}</span>
                  </div>
                  <h5 className="font-bold text-white text-xs sm:text-sm">{app.name}</h5>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{app.purpose}</p>
                  {app.safetyNote && (
                    <div className="text-[10px] text-rose-300 bg-rose-950/30 border border-rose-500/20 px-2 py-1 rounded-lg">
                      Safety: {app.safetyNote}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA: Proceed to Procedure */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                markStageCompleted('intro');
                handleStageChange('procedure');
              }}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-purple-950/50 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <span>Begin Guided Procedure (Stage 2)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE B: DETAILED STEP-BY-STEP PROCEDURE */}
      {/* ========================================================================= */}
      {currentStage === 'procedure' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Step-by-Step Laboratory Protocol</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Review each sequential stage before operating the virtual 3D instruments.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-purple-300 bg-purple-500/20 px-3 py-1 rounded-xl">
              Step {activeStepIndex + 1} of {experiment.procedureSteps.length}
            </span>
          </div>

          {/* Active Step Highlight Card */}
          {experiment.procedureSteps[activeStepIndex] && (
            <div className="p-6 rounded-3xl bg-slate-900 border-2 border-purple-500/40 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-600 text-white font-mono">
                  STEP {experiment.procedureSteps[activeStepIndex].stepNumber}
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  {experiment.procedureSteps[activeStepIndex].title}
                </span>
              </div>

              <div className="text-sm sm:text-base font-bold text-white">
                {experiment.procedureSteps[activeStepIndex].actionPrompt}
              </div>

              {/* Apparatus Used */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-slate-400 font-semibold">Apparatus Involved:</span>
                {experiment.procedureSteps[activeStepIndex].apparatusUsed.map((app, i) => (
                  <span key={i} className="px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 font-mono text-[11px]">
                    {app}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
                {/* Scientific Reason */}
                <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-500/20 space-y-1">
                  <span className="font-bold text-purple-300 uppercase text-[10px] tracking-wider block">
                    Scientific Purpose &amp; Rationale:
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {experiment.procedureSteps[activeStepIndex].scientificReason}
                  </p>
                </div>

                {/* Expected Observation */}
                <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-1">
                  <span className="font-bold text-emerald-300 uppercase text-[10px] tracking-wider block">
                    Expected Empirical Observation:
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {experiment.procedureSteps[activeStepIndex].expectedObservation}
                  </p>
                </div>

                {/* Precautions */}
                <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/20 space-y-1">
                  <span className="font-bold text-amber-300 uppercase text-[10px] tracking-wider block">
                    Precaution to Observe:
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {experiment.procedureSteps[activeStepIndex].precautions}
                  </p>
                </div>

                {/* Common Mistakes */}
                <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-500/20 space-y-1">
                  <span className="font-bold text-rose-300 uppercase text-[10px] tracking-wider block">
                    Frequent Student Mistake:
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {experiment.procedureSteps[activeStepIndex].commonMistakes}
                  </p>
                </div>
              </div>

              {/* Step Navigation Bar */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={() => setActiveStepIndex(prev => Math.max(0, prev - 1))}
                  disabled={activeStepIndex === 0}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-semibold text-slate-300 transition cursor-pointer flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous Step</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCompletedSteps(prev => ({ ...prev, [activeStepIndex]: true }));
                      if (activeStepIndex < experiment.procedureSteps.length - 1) {
                        setActiveStepIndex(prev => prev + 1);
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{completedSteps[activeStepIndex] ? 'Step Reviewed ✓' : 'Mark Step Reviewed'}</span>
                  </button>

                  {activeStepIndex < experiment.procedureSteps.length - 1 && (
                    <button
                      onClick={() => setActiveStepIndex(prev => Math.min(experiment.procedureSteps.length - 1, prev + 1))}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* All Steps Summary Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {experiment.procedureSteps.map((st, i) => (
              <button
                key={i}
                onClick={() => setActiveStepIndex(i)}
                className={`p-3 rounded-2xl border text-left text-xs transition cursor-pointer ${
                  activeStepIndex === i
                    ? 'bg-purple-600/30 border-purple-400 text-white font-bold'
                    : completedSteps[i]
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-mono text-[10px] text-purple-400 font-bold mb-1">
                  Step {i + 1} {completedSteps[i] ? '✓' : ''}
                </div>
                <div className="truncate font-semibold">{st.title}</div>
              </button>
            ))}
          </div>

          {/* CTA: Launch Interactive 3D Simulation */}
          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => handleStageChange('intro')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Introduction</span>
            </button>

            <button
              onClick={() => {
                markStageCompleted('procedure');
                handleStageChange('simulation');
              }}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-purple-950/50 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <span>Launch Interactive 3D Simulation (Stage 3)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE C: INTERACTIVE 3D SIMULATION */}
      {/* ========================================================================= */}
      {currentStage === 'simulation' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {experiment.id === 'c10_acid_base_indicators' ? (
            <ChemistryLab3D
              activeSample={activeChemSample}
              activeIndicator={activeIndicator}
              dropsAdded={dropsAdded}
              reactionResult={chemReaction}
              onAddDrop={() => setDropsAdded(prev => prev + 1)}
              onSelectSample={(sId) => {
                const s = CHEMICAL_SAMPLES.find(x => x.id === sId);
                if (s) {
                  setActiveChemSample(s);
                  setDropsAdded(0);
                }
              }}
              onSelectIndicator={(ind) => {
                setActiveIndicator(ind);
                setDropsAdded(0);
              }}
              onResetTube={() => setDropsAdded(0)}
            />
          ) : experiment.id === 'c9_compound_microscope_mounts' ? (
            <BiologyMicroscope3D
              specimen={activeBioSpecimen}
              opticsParams={opticsParams}
              opticsState={opticsState}
              onUpdateOptics={(partial) => setOpticsParams(prev => ({ ...prev, ...partial }))}
              onSelectSpecimen={(sId) => {
                const sp = BIOLOGY_SPECIMENS.find(x => x.id === sId);
                if (sp) setActiveBioSpecimen(sp);
              }}
            />
          ) : experiment.id === 'c10_ohms_law_circuit' ? (
            <div className="space-y-3">
              {/* 3D Engine Selector Pill */}
              <div className="flex items-center justify-between px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="font-semibold text-slate-300">Physics 3D Simulation Engine:</span>
                </div>
                <div className="flex items-center gap-1.5 p-0.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-semibold">
                  <button
                    onClick={() => setPhysicsMode('r3f')}
                    className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                      physicsMode === 'r3f'
                        ? 'bg-purple-600 text-white font-bold shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    React Three Fiber 3D (R3F)
                  </button>
                  <button
                    onClick={() => setPhysicsMode('classic')}
                    className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                      physicsMode === 'classic'
                        ? 'bg-purple-600 text-white font-bold shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Classic WebGL
                  </button>
                </div>
              </div>

              {physicsMode === 'r3f' ? (
                <OhmsLawR3F
                  circuitParams={circuitParams}
                  circuitState={circuitState}
                  onUpdateParams={(partial) => setCircuitParams(prev => ({ ...prev, ...partial }))}
                  onRecordObservation={handleRecordCircuitReading}
                  recordedReadings={observationRows.map(row => ({
                    current: Number(row.current || 0),
                    voltage: Number(row.voltage || 0),
                    resistance: Number(row.resistance || 0),
                    power: Number(row.power || 0)
                  }))}
                  onClearReadings={() => setObservationRows([])}
                />
              ) : (
                <PhysicsCircuit3D
                  circuitParams={circuitParams}
                  circuitState={circuitState}
                  onUpdateParams={(partial) => setCircuitParams(prev => ({ ...prev, ...partial }))}
                  onRecordObservation={handleRecordCircuitReading}
                />
              )}
            </div>
          ) : (
            <PhysicsCircuit3D
              circuitParams={circuitParams}
              circuitState={circuitState}
              onUpdateParams={(partial) => setCircuitParams(prev => ({ ...prev, ...partial }))}
              onRecordObservation={handleRecordCircuitReading}
            />
          )}

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400">
              Manipulate 3D apparatus, alter variables, and observe deterministic scientific outcomes.
            </span>

            <button
              onClick={() => {
                markStageCompleted('simulation');
                handleStageChange('calculations');
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs transition shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <span>Record Readings &amp; Calculations (Stage 4)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE D: FORMULAS AND CALCULATIONS */}
      {/* ========================================================================= */}
      {currentStage === 'calculations' && (
        <ObservationTable
          columns={experiment.observationColumns}
          rows={observationRows}
          formulas={experiment.formulas}
          experimentId={experiment.id}
          onUpdateRows={(newRows) => setObservationRows(newRows)}
          onContinueToQuiz={() => {
            markStageCompleted('calculations');
            handleStageChange('quiz');
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* STAGE E: DEDICATED MCQ QUIZ */}
      {/* ========================================================================= */}
      {currentStage === 'quiz' && (
        <div className="space-y-6">
          <ExperimentQuiz
            questions={experiment.quizQuestions}
            experimentTitle={experiment.title}
            selectedExamGoal={selectedExamGoal}
            onCompleteQuiz={(score, total, percentage) => {
              setQuizScore(score);
              setQuizTotal(total);
              setQuizPercentage(percentage);
              markStageCompleted('quiz');
              if (onSaveProgress) {
                onSaveProgress({
                  experimentId: experiment.id,
                  score,
                  total,
                  percentage,
                  timestamp: new Date().toISOString()
                });
              }
            }}
          />

          {quizPercentage !== null && (
            <div className="flex justify-end pt-2">
              <button
                onClick={() => handleStageChange('report')}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-purple-950/50 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <span>Generate Practical Record &amp; Viva Voce (Stage 6)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE F: REVISION AND PRACTICAL REPORT */}
      {/* ========================================================================= */}
      {currentStage === 'report' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Printable Header */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                <span>BuzzingBrain Certified Practical Laboratory Record</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Official CBSE &amp; NCERT formatted practical journal record ready for review and viva preparation.
              </p>
            </div>

            <button
              onClick={handlePrintReport}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Export PDF Record</span>
            </button>
          </div>

          {/* Record Document Content */}
          <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 text-xs text-slate-200">
            <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider">
                  BuzzingBrain Virtual Practical Academy &bull; {experiment.classGrade}
                </span>
                <h2 className="text-xl font-black text-white mt-1">
                  Practical Record: {experiment.title}
                </h2>
                <span className="text-slate-400 text-xs">Curriculum: {experiment.curriculumReference}</span>
              </div>

              {quizPercentage !== null && (
                <div className="p-3 rounded-2xl bg-slate-950 border border-emerald-500/30 text-right self-start sm:self-auto">
                  <span className="text-[10px] text-slate-400 block">Assessment Score</span>
                  <span className="text-lg font-mono font-black text-emerald-400">
                    {quizScore} / {quizTotal} ({quizPercentage}%)
                  </span>
                </div>
              )}
            </div>

            {/* Aim & Objective */}
            <div className="space-y-1">
              <strong className="text-purple-300 uppercase tracking-wider font-bold text-[11px] block">
                1. Aim / Objective:
              </strong>
              <p className="text-slate-300 leading-relaxed pl-2 border-l-2 border-purple-500/40">
                {experiment.learningObjectives.join(' ')}
              </p>
            </div>

            {/* Apparatus & Chemicals */}
            <div className="space-y-1">
              <strong className="text-purple-300 uppercase tracking-wider font-bold text-[11px] block">
                2. Apparatus &amp; Materials Used:
              </strong>
              <div className="flex flex-wrap gap-1.5 pl-2">
                {experiment.apparatus.map(app => (
                  <span key={app.id} className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px]">
                    {app.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Scientific Principle & Theory */}
            <div className="space-y-1">
              <strong className="text-purple-300 uppercase tracking-wider font-bold text-[11px] block">
                3. Scientific Theory &amp; Governing Principles:
              </strong>
              <p className="text-slate-300 leading-relaxed whitespace-pre-line pl-2 border-l-2 border-slate-800">
                {experiment.scientificPrinciple}
              </p>
            </div>

            {/* Observation Table */}
            <div className="space-y-2">
              <strong className="text-purple-300 uppercase tracking-wider font-bold text-[11px] block">
                4. Recorded Empirical Observations:
              </strong>
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left font-mono text-[11px]">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      {experiment.observationColumns.map(col => (
                        <th key={col.key} className="p-2.5">{col.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                    {observationRows.map((r, i) => (
                      <tr key={i}>
                        {experiment.observationColumns.map(col => (
                          <td key={col.key} className="p-2.5">{String(r[col.key] ?? '—')}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Viva Voce Questions & Answers */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <strong className="text-amber-400 uppercase tracking-wider font-bold text-[11px] flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" />
                <span>5. Viva Voce Practical Oral Examination Questions:</span>
              </strong>
              <div className="space-y-2.5">
                {experiment.vivaQuestions.map((viva, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <div className="font-bold text-white text-xs">
                      Q{i + 1}: {viva.question}
                    </div>
                    <div className="text-emerald-300 text-[11px] pl-3 border-l-2 border-emerald-500/40 mt-1">
                      <strong>Model Answer: </strong>{viva.answer}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Student Declaration & Simulated Data Disclosure */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <strong className="text-white block">Simulation Disclosure:</strong>
              <p>
                The observations recorded above were conducted inside the BuzzingBrain Virtual Practical Academy using calibrated numerical simulation algorithms and Three.js WebGL procedural apparatus models aligned with the official CBSE/NCERT laboratory manual.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
