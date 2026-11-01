/**
 * Biology Microscope Simulation Engine
 * Computes optical magnification, field of view (FOV), and depth of focus blur.
 */

export interface MicroscopeSpecimen {
  id: string;
  name: string;
  type: 'Plant Tissue' | 'Animal Tissue' | 'Microorganism';
  stainUsed: string;
  nominalCellLengthUm: number;
  description: string;
  structures: { name: string; description: string; x: number; y: number }[]; // relative 0-100 coordinates
}

export const BIOLOGY_SPECIMENS: MicroscopeSpecimen[] = [
  {
    id: 'specimen_onion_peel',
    name: 'Onion Epidermal Peel (Allium cepa)',
    type: 'Plant Tissue',
    stainUsed: '0.5% Aqueous Safranin',
    nominalCellLengthUm: 150,
    description: 'Compact, non-overlapping rectangular cells fitted together like paving bricks. Distinct cellulose walls, prominent peripheral nuclei, and large central vacuolar regions.',
    structures: [
      { name: 'Cellulose Cell Wall', description: 'Rigid outer boundary protecting the cell and maintaining turgor pressure.', x: 45, y: 22 },
      { name: 'Peripheral Nucleus', description: 'Deeply stained chromatin-containing organelle displaced to the cell margin by the vacuole.', x: 78, y: 48 },
      { name: 'Central Vacuole', description: 'Large fluid-filled compartment holding cell sap and maintaining osmotic turgidity.', x: 50, y: 55 },
      { name: 'Cytoplasmic Layer', description: 'Thin parietal cytoplasmic sheet lining the inner cell wall.', x: 30, y: 70 }
    ]
  },
  {
    id: 'specimen_cheek_cell',
    name: 'Human Buccal Cheek Epithelium',
    type: 'Animal Tissue',
    stainUsed: '1% Aqueous Methylene Blue',
    nominalCellLengthUm: 60,
    description: 'Flat, polygonal non-keratinized squamous epithelial cells. Bounded by a delicate plasma membrane with granular cytoplasm and a conspicuous central spherical nucleus.',
    structures: [
      { name: 'Plasma Membrane', description: 'Selectively permeable flexible phospholipid bilayer lacking a rigid cell wall.', x: 52, y: 18 },
      { name: 'Centrally Located Nucleus', description: 'Dark-blue stained nucleus containing DNA, regulating cellular metabolism.', x: 50, y: 50 },
      { name: 'Granular Cytoplasm', description: 'Viscous intracellular cytosol containing organelles and enzyme systems.', x: 35, y: 65 }
    ]
  },
  {
    id: 'specimen_amoeba',
    name: 'Pond Water Amoeba (Amoeba proteus)',
    type: 'Microorganism',
    stainUsed: 'Vital Methyl Green',
    nominalCellLengthUm: 250,
    description: 'Unicellular freshwater protozoan exhibiting continuous amoeboid motion via flowing pseudopodia.',
    structures: [
      { name: 'Pseudopodium', description: 'Temporary blunt extension of protoplasm used for locomotion and phagocytosis.', x: 75, y: 30 },
      { name: 'Contractile Vacuole', description: 'Clear pulsating vesicle responsible for osmoregulation (expelling excess water).', x: 32, y: 42 },
      { name: 'Food Vacuole', description: 'Intracellular vacuole enclosing ingested micro-algae undergoing enzymatic digestion.', x: 60, y: 70 }
    ]
  }
];

export interface OpticalParameters {
  eyepieceMagnification: number; // e.g. 10
  objectiveMagnification: 4 | 10 | 40; // 4x, 10x, 40x
  coarseFocusPosition: number; // 0 to 100 (50 is optimal focal plane)
  fineFocusPosition: number; // 0 to 100 (50 is optimal focal plane)
  irisDiaphragmPercent: number; // 10 to 100
}

export interface OpticalState {
  totalMagnification: number;
  fieldOfViewDiameterUm: number;
  defocusBlurPx: number; // Gaussian blur radius in pixels
  lightIntensityNormalized: number;
  isFocused: boolean;
  scaleBarLengthUm: number;
}

export function computeMicroscopeOptics(params: OpticalParameters): OpticalState {
  const { eyepieceMagnification, objectiveMagnification, coarseFocusPosition, fineFocusPosition, irisDiaphragmPercent } = params;

  const totalMagnification = eyepieceMagnification * objectiveMagnification;

  // Standard 18mm field of view ocular
  const fieldNumberMm = 18;
  const fovDiameterUm = Math.round((fieldNumberMm / objectiveMagnification) * 1000);

  // Depth of field is tighter at higher magnifications
  // 40x has DOF ~ 2 um; 10x has DOF ~ 10 um; 4x has DOF ~ 40 um
  const sensitivity = objectiveMagnification === 40 ? 1.0 : objectiveMagnification === 10 ? 0.45 : 0.2;

  // Deviation from optimal focal plane (50 is optimal)
  const coarseDev = Math.abs(coarseFocusPosition - 50) * 1.5;
  const fineDev = Math.abs(fineFocusPosition - 50) * 0.2;
  const totalDev = (coarseDev + fineDev) * sensitivity;

  const defocusBlurPx = Math.min(24, Math.max(0, totalDev));
  const isFocused = defocusBlurPx < 1.2;

  const lightIntensityNormalized = Math.min(1.0, Math.max(0.2, (irisDiaphragmPercent / 100)));

  // Scale bar represents 100 um at 10x, 25 um at 40x, 250 um at 4x
  const scaleBarLengthUm = objectiveMagnification === 40 ? 50 : objectiveMagnification === 10 ? 100 : 250;

  return {
    totalMagnification,
    fieldOfViewDiameterUm: fovDiameterUm,
    defocusBlurPx: Number(defocusBlurPx.toFixed(1)),
    lightIntensityNormalized,
    isFocused,
    scaleBarLengthUm
  };
}
