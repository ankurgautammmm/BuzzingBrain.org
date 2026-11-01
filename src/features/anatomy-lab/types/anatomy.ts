/**
 * BuzzingBrain Interactive 3D Human Anatomy Lab — Type Definitions
 * Grounded in NCERT Biology, OpenStax Anatomy & Physiology 2e, and Gray's Anatomy.
 */

export interface TextbookCitation {
  source: string;
  authors: string;
  edition: string;
  chapter: string;
  curriculumTags: string[];
  verificationStatus: 'VERIFIED_CURRICULUM' | 'VERIFIED_OPENSTAX' | 'PEER_REVIEWED';
  verificationDate: string;
  sourceUrl?: string;
  license: string;
}

export interface AnatomyQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0-indexed
  explanation: string;
  distractorExplanations?: string[];
  examTag: 'CBSE' | 'NEET' | 'CUET';
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface AnatomicalStructure {
  id: string;
  meshNames: string[];
  name: string;
  latinName: string;
  hindiName: string;
  pronunciation: string;
  system: string;
  parentStructure?: string;
  location: string;
  grossDescription: string;
  mainFunction: string;
  substructures: string[];
  bloodSupply: string;
  innervation: string;
  schoolExplanation: string; // NCERT Class 10 & 11 syllabus focus
  advancedExplanation: string; // OpenStax A&P 2e & NEET clinical focus
  learningObjectives: string[];
  importantTerminology: { term: string; definition: string }[];
  quizQuestions: AnatomyQuizQuestion[];
  textbookCitation: TextbookCitation;
  defaultColor: string;
  pinPosition?: [number, number, number];
  explodedOffset?: [number, number, number];
  relatedStructureIds?: string[];
}

export interface GuidedTourStep {
  stepNumber: number;
  title: string;
  structureId: string;
  narration: string;
  highlightMeshNames: string[];
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  bloodOxygenation?: 'oxygenated' | 'deoxygenated' | 'mixed';
  clinicalNote?: string;
}

export interface CameraPreset {
  id: string;
  label: string;
  position: [number, number, number];
  target: [number, number, number];
}

export interface OrganModelSpec {
  id: string;
  name: string;
  system: string;
  classGrade: string;
  subject: string;
  description: string;
  modelUrl: string;
  modelFormat: 'glb' | 'procedural';
  initialCameraPosition: [number, number, number];
  initialTarget: [number, number, number];
  cameraPresets: Record<string, CameraPreset>;
  structures: AnatomicalStructure[];
  guidedTourSteps: GuidedTourStep[];
  scaleFactor?: number;
  rotationOffset?: [number, number, number];
}

export type AnatomyViewerMode = 'learn' | 'self-test' | 'guided-tour';
export type ExplanationAudience = 'school' | 'advanced';

export type GraphicsRenderMode = 'pbr_tissue' | 'xray_scan' | 'thermal_perfusion' | 'vascular_map' | 'wireframe_grid';
export type LightingPreset = 'surgical' | 'clinical_blue' | 'cyber_neon' | 'warm_diagnostic';
export type SliceAxis = 'none' | 'coronal' | 'sagittal' | 'axial';

export interface GraphicsSettings {
  renderMode: GraphicsRenderMode;
  lightingPreset: LightingPreset;
  showBloodFlow: boolean;
  bloodFlowSpeed: number; // 0.5 to 2.5
  showConductionSystem: boolean;
  showPedestal: boolean;
  showEcGHud: boolean;
  sliceAxis: SliceAxis;
  sliceOffset: number; // -1 to 1
  showMeasurements: boolean;
  tissueGloss: number; // 0 to 1
  pulseIntensity: number; // 0 to 1.5
  showOrganBody?: boolean; // Toggles full muscular organ body & parenchyma props
  organBodyMode?: 'solid' | 'translucent' | 'cutaway';
}
