/**
 * Core Type Definitions for NCERT ScribbleAI
 */

export type PenType = 'gel-pen' | 'fountain-pen' | 'ballpoint' | 'pencil';
export type InkColor = 'royal-blue' | 'classic-black' | 'academic-red' | 'emerald-green' | 'pencil-gray' | 'blue' | 'black' | 'red' | 'green' | 'purple';
export type PaperType = 'ruled-notebook' | 'grid-math' | 'vintage-parchment' | 'clean-ivory' | 'legal-pad';
export type PaperStyle = 'ruled' | 'ruled-tight' | 'grid' | 'dotted' | 'plain';
export type HandwritingFont = 'Caveat' | 'Kalam' | 'Patrick Hand' | 'Indie Flower' | 'Architects Daughter' | 'Homemade Apple' | 'kalam' | 'caveat' | 'patrick' | 'indie' | 'gloria';

export interface UserStickyNote {
  id: string;
  text: string;
  color: 'yellow' | 'pink' | 'blue';
  createdAt?: string;
}

export interface NotePreset {
  topic: string;
  grade: string;
  subject: string;
}

export type NotesMode = 'short' | 'detailed' | 'exam' | 'revision' | 'formulas' | 'mindmap' | 'questions';
export type ExamTarget = 'cbse' | 'neet' | 'jee' | 'general';

export interface HandwritingStyleConfig {
  penType: PenType;
  inkColor: InkColor;
  paperType: PaperType;
  fontFamily: HandwritingFont;
  fontSize: number; // e.g. 18 - 24
  slantAngle: number; // -1 to 2 deg
  inkPressure: 'light' | 'medium' | 'deep';
  highlightColor: 'yellow' | 'pink' | 'green' | 'orange';
  showMarginLine: boolean;
  showHoles: boolean;
}

export interface DiagramSpec {
  title: string;
  type: 'flowchart' | 'chemistry_reaction' | 'ray_diagram' | 'cycle' | 'table' | 'geometry' | 'biology_anatomy';
  caption: string;
  asciiSketch?: string;
  svgData?: string;
  keySteps?: string[];
  labels?: { label: string; x?: number; y?: number; arrow?: string }[];
}

export interface NoteIllustration {
  title?: string;
  type?: 'sketch' | 'cell' | 'flow' | 'organism' | 'custom';
  items?: {
    name: string;
    caption?: string;
    color?: string;
    symbol?: string;
    sketchAscii?: string;
  }[];
}

export interface NoteComparisonTable {
  title?: string;
  headers: string[];
  rows: string[][];
}

export interface FormulaBlock {
  title: string;
  formula: string;
  variables?: string[];
  derivationSummary?: string;
  exampleProblem?: {
    statement: string;
    steps: string[];
    boxedAnswer: string;
    units: string;
  };
}

export interface NoteSection {
  heading: string;
  subheading?: string;
  content: string;
  bullets?: string[];
  importantFormulas?: string[];
  formulaBlocks?: FormulaBlock[];
  highlighterWords?: string[];
  starredPoints?: string[];
  warningMistakes?: string[]; // Red pen warnings / common errors
  postItNote?: {
    color: 'yellow' | 'pink' | 'blue' | 'green';
    title?: string;
    text: string;
  };
  marginAnnotation?: string;
  diagram?: DiagramSpec;
  comparisonTable?: NoteComparisonTable;
  illustration?: NoteIllustration;
}

export interface NotebookPage {
  pageNumber: number;
  totalCoursePages: number;
  pageHeader: string;
  pageKicker?: string;
  sections: NoteSection[];
  marginNotes?: string[];
  pageType?: 'concept' | 'diagram' | 'derivation' | 'revision' | 'exam_tips';
}

export interface NoteContentPayload {
  title: string;
  classGrade: string;
  subject: string;
  chapter: string;
  topic: string;
  mode?: NotesMode;
  targetExam?: ExamTarget;
  syllabusContext: string;
  examWeightageTip: string;
  sections: NoteSection[];
  pages?: NotebookPage[]; // Multi-page notebook architecture
  totalCoursePages?: number;
  topperMnemonics?: string[];
  ncertExamAlert?: string;
  quickSummaryReview?: string[];
  sampleQuestion?: {
    question: string;
    answer: string;
  };
  verificationStatus?: 'VERIFIED_CURRICULUM' | 'CURATED_FACULTY' | 'AI_GENERATED_OUTLINE' | 'PENDING_REVIEW' | 'NEEDS_REVISION';
  sourceCitation?: {
    textbook: string;
    edition: string;
    chapterNumber?: number;
    isbn?: string;
    officialUrl?: string;
    verifiedDate?: string;
  };
  qualityScore?: number; // 0-100 quality gate metric
}

export interface StudyNote {
  id: string;
  title: string;
  classGrade: string;
  subject: string;
  chapter: string;
  topic?: string;
  commandUsed: string;
  contentJson: string; // Serialized NoteContentPayload
  parsedContent?: NoteContentPayload;
  styleConfig: string; // Serialized HandwritingStyleConfig
  parsedStyle?: HandwritingStyleConfig;
  userId: string;
  userEmail?: string;
  userName?: string;
  isPublic: boolean;
  likesCount: number;
  createdAt: string;
  updatedAt: string;
}

export type AuthStateStatus = 
  | 'AUTH_LOADING'
  | 'AUTHENTICATED'
  | 'AUTHENTICATED_PROFILE_LOADING'
  | 'AUTHENTICATED_PROFILE_READY'
  | 'AUTHENTICATED_PROFILE_ERROR'
  | 'UNAUTHENTICATED';

export interface UserProfile {
  id: string;
  uid?: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: 'student' | 'teacher' | 'admin';
  classPreference?: string;
  className?: string;
  age?: number | string;
  sex?: 'Male' | 'Female' | 'Other' | 'Prefer not to say' | string;
  mobileNumber?: string;
  targetExam?: string;
  acceptedTerms: boolean;
  termsVersion?: string;
  termsAcceptedAt?: string;
  onboardedAt?: string;
  xp?: number;
  streakDays?: number;
  lastActiveDate?: string;
  badges?: string[];
  avatarId?: string;
  customAvatarUrl?: string;
  schoolName?: string;
  coachingInstitute?: string;
  targetScore?: string;
  dailyStudyHours?: number;
  studentRollNumber?: string;
  parentInfo?: {
    parentName?: string;
    parentPhone?: string;
    relation?: 'Father' | 'Mother' | 'Guardian' | string;
    preferredCommunication?: 'WhatsApp' | 'SMS' | 'Call' | string;
    consentGiven?: boolean;
  };
  dataConsentVersion?: string;
  dataConsentAcceptedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type QuestionType = 'mcq' | 'numerical' | 'assertion_reason' | 'case_study' | 'true_false' | 'short_answer';
export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'board_level' | 'competition';

export interface TestQuestion {
  id: string;
  question: string;
  type: QuestionType;
  options?: string[]; // For MCQ or True/False
  correctAnswer: string | number;
  explanation: string;
  marks: number;
  difficulty: DifficultyLevel;
  topic?: string;
  hint?: string;
  assertionText?: string;
  reasonText?: string;
  caseText?: string;
}

export interface CustomTest {
  id: string;
  title: string;
  classGrade: string;
  subject: string;
  chapter: string;
  difficulty: DifficultyLevel;
  questions: TestQuestion[];
  timeLimitMinutes: number;
  totalMarks: number;
  createdAt: string;
}

export interface MistakeItem {
  id: string;
  userId: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  classGrade: string;
  subject: string;
  chapter: string;
  topic?: string;
  type: QuestionType;
  timestamp: string;
  resolved: boolean;
  notes?: string;
}

export interface TestAttemptRecord {
  id: string;
  userId: string;
  testId: string;
  testTitle: string;
  classGrade: string;
  subject: string;
  chapter: string;
  score: number;
  maxScore: number;
  percentage: number;
  correctCount: number;
  wrongCount: number;
  unattemptedCount: number;
  examPattern: string;
  percentile: string;
  timestamp: string;
}

export interface SpacedRevisionTopic {
  id: string;
  title: string;
  chapter: string;
  subject: string;
  classGrade: string;
  learnedAt: string;
  stage: number; // 0, 1, 3, 7, 14, 30
  nextRevisionDate: string;
  completedStages: number[];
  isDueToday: boolean;
}

export interface MindMapNode {
  id: string;
  label: string;
  description?: string;
  formula?: string;
  children?: MindMapNode[];
  color?: string;
}

export interface MindMapData {
  rootTopic: string;
  subject: string;
  classGrade: string;
  nodes: MindMapNode;
}

export interface HandwritingCheckResult {
  score: number;
  maxScore: number;
  correctPoints: string[];
  missingPoints: string[];
  formulaEvaluation: string;
  unitsAndPresentation: string;
  modelAnswer: string;
  detailedFeedback: string;
  aiSuggestedAnswer: string;
}

export interface ImageQuestionSolution {
  extractedText: string;
  subject: string;
  topic: string;
  given: string[];
  required: string[];
  concept: string;
  formula: string[];
  stepByStepCalculation: string[];
  finalAnswer: string;
  explanation: string;
  commonMistakes: string;
}

export type ComplaintCategory = 
  | 'Syllabus Mismatch'
  | 'Generation Error'
  | 'Handwriting Rendering Issue'
  | 'Account Issue'
  | 'Other';

export type ComplaintStatus = 'pending' | 'in_review' | 'resolved';

export interface ComplaintTicket {
  id: string;
  ticketId: string;
  userId: string;
  userEmail: string;
  userName: string;
  category: ComplaintCategory;
  title: string;
  description: string;
  status: ComplaintStatus;
  adminNotes?: string;
  relatedNoteId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommandParseResult {
  classGrade: string;
  subject: string;
  chapter: string;
  topic: string;
  penType: PenType;
  inkColor: InkColor;
  paperType: PaperType;
  fontFamily: HandwritingFont;
  thinkingMode: 'standard' | 'high';
  rawCommand: string;
  mode?: NotesMode;
  targetExam?: ExamTarget;
  isContentText?: boolean;
  customContent?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

// ==========================================
// Experiment Journal & Lab Report Types
// ==========================================

export interface JournalObservationRow {
  id: string;
  parameter: string;
  metricValue: string;
  metricUnit: string;
  imperialValue: string;
  imperialUnit: string;
  notes?: string;
}

export interface ExperimentJournalEntry {
  id: string;
  userId?: string;
  experimentNo: string;
  title: string;
  date: string;
  classGrade: string;
  subject: string;
  aim: string;
  apparatus: string;
  theory: string;
  formulae: string;
  activeToolUsed?: string;
  observations: JournalObservationRow[];
  calculations: string;
  errorPercentage?: number;
  conclusion: string;
  precautions: string;
  studentName: string;
  createdAt: string;
  updatedAt: string;
}

