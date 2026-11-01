/**
 * BuzzingBrain Virtual Practical Academy — Types & Data Contracts
 * Supports multi-stage practical learning for CBSE, NEET, JEE Main, JEE Advanced, and CUET.
 */

export type PracticalStage = 'intro' | 'procedure' | 'simulation' | 'calculations' | 'quiz' | 'report';

export type ExamTarget = 'cbse' | 'neet' | 'jee_main' | 'jee_advanced' | 'cuet' | 'all';

export type PracticalSubject = 'Chemistry' | 'Biology' | 'Physics';

export type PracticalClassGrade = 'Class 9' | 'Class 10' | 'Class 11' | 'Class 12';

export interface ApparatusItem {
  id: string;
  name: string;
  category: 'glassware' | 'instrument' | 'chemical' | 'circuit' | 'optical' | 'mechanical';
  description: string;
  purpose: string;
  safetyNote?: string;
  iconName?: string;
}

export interface ProcedureStep {
  stepNumber: number;
  title: string;
  actionPrompt: string;
  apparatusUsed: string[];
  scientificReason: string;
  expectedObservation: string;
  precautions: string;
  commonMistakes: string;
}

export interface ObservationColumn {
  key: string;
  label: string;
  unit?: string;
  type: 'text' | 'number';
  readOnly?: boolean;
  formulaDescription?: string;
}

export interface ObservationRow {
  id: string;
  [key: string]: string | number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0-indexed
  explanation: string;
  distractorExplanations?: string[];
  topicTag: string;
  difficulty: 'easy' | 'medium' | 'hard';
  hint?: string;
  examTarget: ExamTarget[];
  sourceReference?: string;
}

export interface VivaQuestion {
  question: string;
  answer: string;
  examRelevance?: string;
}

export interface FormulaSpec {
  name: string;
  equation: string; // Plain text or LaTeX notation
  explanation: string;
  conditions: string;
  symbols: {
    symbol: string;
    definition: string;
    unit: string;
  }[];
  workedExample: {
    inputs: string;
    steps: string[];
    result: string;
  };
}

export interface PracticalExperiment {
  id: string;
  title: string;
  subject: PracticalSubject;
  classGrade: PracticalClassGrade;
  chapter: string;
  examTags: ExamTarget[];
  estimatedDurationMinutes: number;
  has3D: boolean;
  hasCalculations: boolean;
  learningObjectives: string[];
  prerequisites: string[];
  scientificPrinciple: string;
  curriculumReference: string;
  apparatus: ApparatusItem[];
  procedureSteps: ProcedureStep[];
  formulas?: FormulaSpec[];
  observationColumns: ObservationColumn[];
  defaultObservations: ObservationRow[];
  quizQuestions: QuizQuestion[];
  vivaQuestions: VivaQuestion[];
  simulatedModelNotes: string;
}

export interface PracticalAttemptRecord {
  experimentId: string;
  userId?: string;
  timestamp: string;
  stageReached: PracticalStage;
  completedStages: PracticalStage[];
  observations: ObservationRow[];
  quizScore?: number;
  quizTotal?: number;
  quizPercentage?: number;
  selectedExamGoal: ExamTarget;
  isCompleted: boolean;
}
