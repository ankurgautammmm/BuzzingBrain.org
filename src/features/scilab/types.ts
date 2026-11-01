/**
 * SciLab: Scientific Computing, Bioinformatics, Molecular Dynamics & Chemistry Types
 */

export interface AlphaFoldPredictionDescriptor {
  entryId: string;
  gene: string;
  uniprotAccession: string;
  uniprotId: string;
  uniprotDescription: string;
  taxId: number;
  organismScientificName: string;
  uniprotStart: number;
  uniprotEnd: number;
  uniprotSequence: string;
  cifUrl: string;
  bcifUrl: string;
  pdbUrl: string;
  paeImageUrl?: string;
  paeDocUrl?: string;
}

export interface ProteinFeatureItem {
  type: string; // 'Active site' | 'Binding site' | 'Domain' | 'Natural variant' | 'Mutagenesis' | 'Transmembrane'
  description: string;
  start: number;
  end: number;
  evidenceCode?: string;
}

export interface UniProtSummary {
  accession: string;
  primaryAccession: string;
  id: string;
  proteinName: string;
  geneSymbol: string;
  organism: string;
  sequence: string;
  sequenceLength: number;
  features: ProteinFeatureItem[];
  functionSummary?: string;
  subcellularLocation?: string[];
  pdbCrossReferences: string[];
}

export interface PdbMetadata {
  pdbId: string;
  title: string;
  resolution?: number;
  experimentalMethod: string;
  depositDate: string;
  releaseDate: string;
  polymerCountProtein: number;
  molecularWeight: number;
  cifDownloadUrl: string;
  pdbDownloadUrl: string;
}

export interface ChemicalProperties {
  cid: number;
  name: string;
  molecularFormula: string;
  molecularWeight: number;
  canonicalSmiles: string;
  isomericSmiles?: string;
  inchiKey?: string;
  xLogP?: number;
  tpsa?: number;
  hBondDonorCount?: number;
  hBondAcceptorCount?: number;
  rotatableBondCount?: number;
  complexity?: number;
  iupacName?: string;
  description?: string;
  image2dUrl: string;
  conformer3dUrl?: string;
}

export interface DrugLikenessEvaluation {
  lipinskiPassed: boolean;
  lipinskiViolations: string[];
  veberPassed: boolean;
  veberViolations: string[];
  bioavailabilityScore: number; // 0 - 100
  bloodBrainBarrierPenetration: boolean;
}

export interface ChEMBLBioactivity {
  activityId: string;
  targetChemblId: string;
  targetName: string;
  moleculeChemblId: string;
  standardType: string; // 'IC50' | 'Ki' | 'Kd' | 'EC50'
  standardValue: number;
  standardUnits: string;
  pchemblValue?: number;
  clinicalPhase?: number;
  mechanismOfAction?: string;
}

export interface StringInteractionPartner {
  stringIdA: string;
  stringIdB: string;
  preferredNameA: string;
  preferredNameB: string;
  score: number; // 0.0 - 1.0
  nscore: number;
  fscore: number;
  pscore: number;
  ascore: number;
  escore: number;
  dscore: number;
  tscore: number;
}

export interface ReactomePathway {
  stId: string;
  name: string;
  species: string;
  diagramUrl?: string;
}

// ==========================================
// Molecular Dynamics (MD) Simulation Types
// ==========================================

export interface MDAtom {
  id: number;
  element: string; // 'C' | 'N' | 'O' | 'H' | 'S' | 'P' | 'Ar'
  name: string;
  residueName?: string;
  residueIndex?: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  fx: number;
  fy: number;
  fz: number;
  mass: number;      // amu
  charge: number;    // elementary charge (e)
  sigma: number;     // Angstroms (LJ collision diameter)
  epsilon: number;   // kcal/mol or kJ/mol (LJ well depth)
  pinned?: boolean;  // user anchor
  color?: string;
  radius?: number;
}

export interface MDBond {
  atom1: number;
  atom2: number;
  r0: number;        // equilibrium distance in Angstroms
  kBond: number;     // harmonic force constant kcal/(mol*A^2)
  order?: number;    // 1 for single, 2 for double
}

export interface MDSimulationState {
  timePicoseconds: number;
  stepCount: number;
  temperatureKelvin: number;
  targetTemperature: number;
  kineticEnergy: number;
  potentialEnergy: number;
  totalEnergy: number;
  pressureAtm: number;
  isRunning: boolean;
  thermostatEnabled: boolean;
  frictionCoeff: number; // Langevin damping
  timeStepFemtoseconds: number;
}

export interface MDPreset {
  id: string;
  name: string;
  category: 'Peptide' | 'Enzyme' | 'Biomembrane' | 'Thermodynamics' | 'Ligand-Receptor';
  description: string;
  scientificContext: string;
  atoms: MDAtom[];
  bonds: MDBond[];
  recommendedTemp: number;
  recommendedTimeStep: number;
}
