import React, { useState, useMemo, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Printer, 
  Download, 
  ArrowRightLeft, 
  Sliders, 
  Gauge, 
  Eye, 
  Scale, 
  Check, 
  Copy, 
  RefreshCw, 
  FileText, 
  Sparkles, 
  Bookmark, 
  Calendar, 
  User, 
  Award,
  ChevronDown,
  Info,
  ExternalLink,
  Save,
  CheckCircle2,
  Table as TableIcon
} from 'lucide-react';
import { ExperimentJournalEntry, JournalObservationRow, UserProfile } from '../../types';
import { saveExperimentJournal, deleteExperimentJournal, getLocalJournals } from '../../services/firebase';
import { saveLabJournalToMongo, fetchLabJournalsFromMongo, deleteLabJournalFromMongo } from '../../services/mongoStorage';

interface ExperimentJournalProps {
  activeClass: string;
  userProfile?: UserProfile | null;
  liveToolReadings?: {
    phMeter?: { solutionName: string; ph: number; tempC: number; emfMv: string; hConc: string; timestamp: string };
    microscope?: { specimenName: string; tissueType: string; magnification: number; cellSizeUm: number; objective: string; timestamp: string };
    balance?: { reagentName: string; formula: string; massGrams: number; tareVessel: string; targetMolarity: number; timestamp: string };
    vernier?: { readingCm: number; msrCm: number; vsr: number; timestamp: string };
    titration?: { titrantMl: number; ph: number; indicator: string; timestamp: string };
  };
  onSwitchToTool?: (toolId: string) => void;
}

// ============================================================================
// CURATED NCERT CURRICULUM LAB TEMPLATES
// ============================================================================
interface LabTemplate {
  id: string;
  title: string;
  experimentNo: string;
  subject: string;
  classGrade: string;
  toolType: string;
  aim: string;
  apparatus: string;
  theory: string;
  formulae: string;
  sampleObservations: JournalObservationRow[];
  calculations: string;
  errorPercentage: number;
  conclusion: string;
  precautions: string;
}

const NCERT_LAB_TEMPLATES: LabTemplate[] = [
  {
    id: 'tpl-ph-acids-bases',
    title: 'Determination of pH of Dilute Acids, Alkalis, and Salt Solutions using Calibrated pH Electrode',
    experimentNo: 'EXP-CH-01',
    subject: 'Chemistry',
    classGrade: 'Class 10 & 11',
    toolType: 'tool-ph-meter',
    aim: 'To determine the pH of various laboratory test solutions (0.1 M HCl, 0.1 M Acetic acid, Deionized H2O, 0.1 M NaOH, and physiological buffers) using a 3-point NIST calibrated pH meter with automatic temperature compensation.',
    apparatus: 'Benchtop Digital pH Meter with glass combination electrode, Pt1000 temperature sensor probe, 250 mL borosilicate glass beakers, NIST buffer calibration solutions (pH 4.01, 7.00, 10.01), wash bottle with deionized water, lint-free tissue paper.',
    theory: 'pH is defined as the negative logarithm of the hydrogen ion molar activity: pH = -log10[H+]. The glass electrode responds selectively to hydrogen ion activity according to the Nernst Equation: E = E0 - (2.303·R·T / F)·pH. At 25°C (298.15 K), the theoretical electrode slope is 59.16 mV per pH unit. Acidic solutions have [H+] > 10^-7 M (pH < 7), neutral solutions have pH = 7, and alkaline solutions have [H+] < 10^-7 M (pH > 7).',
    formulae: 'pH = -log₁₀[H⁺]  |  pOH = 14.00 - pH  |  E = -Slope·(pH - 7.00) mV',
    sampleObservations: [
      { id: 'obs-1', parameter: '0.10 M Hydrochloric Acid (HCl)', metricValue: '1.02', metricUnit: 'pH', imperialValue: '1.02', imperialUnit: 'pH', notes: 'Strong mineral acid, completely dissociated; sharp negative EMF (+354.2 mV)' },
      { id: 'obs-2', parameter: '0.10 M Acetic Acid (CH₃COOH)', metricValue: '2.88', metricUnit: 'pH', imperialValue: '2.88', imperialUnit: 'pH', notes: 'Weak carboxylic acid; Ka = 1.75 × 10⁻⁵, [H⁺] ≈ √(Ka·C)' },
      { id: 'obs-3', parameter: 'Deionized Distilled Water (H₂O)', metricValue: '7.00', metricUnit: 'pH', imperialValue: '7.00', imperialUnit: 'pH', notes: 'Self-ionization of neutral solvent; Kw = 1.0 × 10⁻¹⁴ at 25°C, EMF ≈ 0.0 mV' },
      { id: 'obs-4', parameter: 'Human Blood Plasma Buffer', metricValue: '7.40', metricUnit: 'pH', imperialValue: '7.40', imperialUnit: 'pH', notes: 'Physiological bicarbonate buffer maintaining homeostatic pH within 7.35–7.45' },
      { id: 'obs-5', parameter: '0.10 M Sodium Hydroxide (NaOH)', metricValue: '13.00', metricUnit: 'pH', imperialValue: '13.00', imperialUnit: 'pH', notes: 'Strong alkali; [OH⁻] = 0.1 M, pOH = 1.0, high positive EMF (-354.8 mV)' },
    ],
    calculations: '1. For 0.1 M HCl: Theoretical pH = -log₁₀(0.1) = 1.00. Observed pH = 1.02.\n2. Percentage Error = |(1.02 - 1.00) / 1.00| × 100% = 2.0%.\n3. Electrode Slope Efficiency = (Measured mV per decade / 59.16 mV) × 100% = 99.2% (Within NIST ±2% tolerance).',
    errorPercentage: 2.0,
    conclusion: 'The measured pH values match theoretical Nernst expectations within experimental limits. Strong acids exhibit pH near 1, weak acids pH 2.88, neutral water pH 7.00, and strong alkalis pH 13.00.',
    precautions: '1. Always rinse the glass bulb thoroughly with deionized water and blot dry before transferring between test beakers.\n2. Never rub or scratch the fragile hydrated gel layer on the glass sensing bulb.\n3. Calibrate with fresh pH 7.00 zero-point buffer before measuring unknowns.'
  },
  {
    id: 'tpl-microscope-cells',
    title: 'Preparation and Cytological Microscopic Examination of Onion Peel & Cheek Epithelial Cells',
    experimentNo: 'EXP-BIO-01',
    subject: 'Biology',
    classGrade: 'Class 9 & 11',
    toolType: 'tool-microscope',
    aim: 'To mount temporary stained slides of (a) plant epidermal cells from onion bulb peel and (b) animal squamous epithelial cells from oral mucosa, and compare their cell wall, vacuole, and nuclear morphologies under 100x and 400x magnification.',
    apparatus: 'Compound optical microscope with 10x eyepiece and 10x/40x objectives, clean glass slides, coverslips, forceps, dissecting needle, Safranin O stain, Methylene Blue stain, glycerin mountant, filter paper.',
    theory: 'Plant and animal cells share fundamental eukaryotic architecture (plasma membrane, cytoplasm, nucleus, organelles) but differ fundamentally in cellular boundary and sap vacuolation. Plant epidermal cells possess a rigid outer cellulose cell wall that prevents lysis and maintains turgidity, alongside a prominent central sap vacuole pushing the nucleus to the periphery. Animal squamous epithelial cells lack a cellulose cell wall, displaying irregular polygonal contours with centrally suspended spherical nuclei.',
    formulae: 'Total Magnification = Eyepiece (10x) × Objective (10x/40x)  |  Cell Size = Field of View Diameter / Cells across field',
    sampleObservations: [
      { id: 'obs-m1', parameter: 'Onion Peel Epidermal Cell Length', metricValue: '180.0', metricUnit: 'µm', imperialValue: '7.09', imperialUnit: 'mils', notes: 'Elongated rectangular shape; brick-like tessellation with Safranin-stained cellulose wall' },
      { id: 'obs-m2', parameter: 'Onion Peel Central Vacuole Diameter', metricValue: '115.0', metricUnit: 'µm', imperialValue: '4.53', imperialUnit: 'mils', notes: 'Large central turgor vacuole occupying ~70% of intracellular volume' },
      { id: 'obs-m3', parameter: 'Onion Nucleus Position', metricValue: '12.5', metricUnit: 'µm', imperialValue: '0.49', imperialUnit: 'mils', notes: 'Dense spherical nucleus pushed to periphery against cellulose wall' },
      { id: 'obs-m4', parameter: 'Cheek Squamous Epithelial Cell Diameter', metricValue: '60.0', metricUnit: 'µm', imperialValue: '2.36', imperialUnit: 'mils', notes: 'Flat polygonal squamous morphology; stained deep blue with Methylene blue' },
      { id: 'obs-m5', parameter: 'Cheek Cell Nucleus Diameter', metricValue: '10.0', metricUnit: 'µm', imperialValue: '0.39', imperialUnit: 'mils', notes: 'Centrally located dense chromatin nucleus; no cellulose cell wall visible' },
    ],
    calculations: '1. At 100x: Field of View = 1800 µm. Number of onion cells spanning diameter ≈ 10 cells.\n2. Average Cell Length = 1800 µm / 10 = 180 µm (7.09 mils).\n3. At 400x: Field of View = 450 µm. Cheek epithelial cell diameter = 450 µm / 7.5 cells = 60 µm (2.36 mils).',
    errorPercentage: 1.5,
    conclusion: 'Onion peel cells clearly exhibit distinct cellulose cell walls and large sap vacuoles with peripheral nuclei. Human cheek epithelial cells lack cell walls and large vacuoles, possessing thin plasma membranes and central dark nuclei.',
    precautions: '1. Lower coverslip gently with needle at 45° angle to prevent air bubbles.\n2. Wipe away excess stain with filter paper before mounting on microscope stage.\n3. Always start focusing with low power (10x) objective before switching to high power (40x).'
  },
  {
    id: 'tpl-balance-oxalic',
    title: 'Preparation of 250 mL of 0.1 M Oxalic Acid Primary Standard Solution using Digital Analytical Balance',
    experimentNo: 'EXP-CH-02',
    subject: 'Chemistry',
    classGrade: 'Class 11 & 12',
    toolType: 'tool-chemical-balance',
    aim: 'To weigh accurately 3.1518 g of crystalline oxalic acid dihydrate ((COOH)2·2H2O) using a calibrated digital analytical chemical balance (least count 0.0001 g) and prepare a 250 mL standard solution of 0.1000 M concentration.',
    apparatus: 'Precision digital analytical chemical balance (0.0001 g least count) with sliding glass draft shields, glass watch glass / weighing boat, micro spatula, 250 mL volumetric flask with stopper, glass funnel, wash bottle, distilled water.',
    theory: 'Oxalic acid dihydrate ((COOH)2·2H2O, Molar Mass = 126.07 g/mol) is a primary standard because it is non-hygroscopic, chemically pure, has high equivalent weight, and remains stable in air. Mass required: w = (M × MolarMass × V) / 1000. For 0.1 M in 250 mL: w = (0.1 × 126.07 × 250) / 1000 = 3.1518 g. Since oxalic acid is dibasic (n-factor = 2), Normality = Molarity × 2 = 0.2000 N.',
    formulae: 'Mass (g) = (Molarity × Molar Mass × Volume in mL) / 1000  |  Normality = Molarity × n-factor',
    sampleObservations: [
      { id: 'obs-b1', parameter: 'Tare Vessel (Watch Glass Mass)', metricValue: '18.4215', metricUnit: 'g', imperialValue: '0.6498', imperialUnit: 'oz', notes: 'Borosilicate watch glass tared to exactly 0.0000 g' },
      { id: 'obs-b2', parameter: 'Target Mass of Oxalic Acid Crystals', metricValue: '3.1518', metricUnit: 'g', imperialValue: '0.1112', imperialUnit: 'oz', notes: 'Calculated theoretical mass for 250 mL 0.1 M solution' },
      { id: 'obs-b3', parameter: 'Actual Weighed Oxalic Acid Mass', metricValue: '3.1520', metricUnit: 'g', imperialValue: '0.1112', imperialUnit: 'oz', notes: 'Stable reading inside closed glass draft shield chamber' },
      { id: 'obs-b4', parameter: 'Final Volumetric Solution Volume', metricValue: '250.0', metricUnit: 'mL', imperialValue: '8.453', imperialUnit: 'fl oz', notes: 'Meniscus adjusted to graduation mark at eye level' },
    ],
    calculations: '1. Actual Molarity M = (Actual Mass / 126.07) / (0.250 L) = (3.1520 / 126.07) / 0.250 = 0.100006 M.\n2. Percentage Error in Weighing = |(3.1520 - 3.1518) / 3.1518| × 100% = 0.0063% (Negligible error).',
    errorPercentage: 0.01,
    conclusion: '250 mL of standard primary oxalic acid solution was successfully prepared with an exact concentration of 0.1000 M (0.2000 N).',
    precautions: '1. Never add or remove chemical crystals directly inside the balance chamber.\n2. Keep sliding draft shield doors completely closed during final digital readout stabilization.\n3. Rinse funnel and watch glass with distilled water into the volumetric flask so no solute is lost.'
  }
];

// ============================================================================
// UNIT CONVERSION ENGINE (Metric <-> Imperial)
// ============================================================================
type UnitCategory = 'length' | 'mass' | 'volume' | 'temp' | 'pressure';

interface UnitPreset {
  category: UnitCategory;
  metricLabel: string;
  metricUnit: string;
  imperialLabel: string;
  imperialUnit: string;
  toImperial: (val: number) => number;
  toMetric: (val: number) => number;
  description: string;
}

const UNIT_PRESETS: UnitPreset[] = [
  // 1. Length & Microscopic Scale
  {
    category: 'length',
    metricLabel: 'Micrometers (µm)',
    metricUnit: 'µm',
    imperialLabel: 'Mils (0.001 in)',
    imperialUnit: 'mils',
    toImperial: (val) => val * 0.0393701,
    toMetric: (val) => val / 0.0393701,
    description: 'Cell cytology, bacteria & microscopic graticule dimensions'
  },
  {
    category: 'length',
    metricLabel: 'Millimeters (mm)',
    metricUnit: 'mm',
    imperialLabel: 'Inches (in)',
    imperialUnit: 'in',
    toImperial: (val) => val / 25.4,
    toMetric: (val) => val * 25.4,
    description: 'Vernier caliper & micrometer screw gauge precision readings'
  },
  {
    category: 'length',
    metricLabel: 'Centimeters (cm)',
    metricUnit: 'cm',
    imperialLabel: 'Inches (in)',
    imperialUnit: 'in',
    toImperial: (val) => val * 0.393701,
    toMetric: (val) => val / 0.393701,
    description: 'Ray optics bench focal length & pendulum wire measurements'
  },
  // 2. Mass & Gravimetric Weighing
  {
    category: 'mass',
    metricLabel: 'Milligrams (mg)',
    metricUnit: 'mg',
    imperialLabel: 'Grains (gr)',
    imperialUnit: 'gr',
    toImperial: (val) => val * 0.0154324,
    toMetric: (val) => val / 0.0154324,
    description: 'Analytical chemical reagent micro-dispensing'
  },
  {
    category: 'mass',
    metricLabel: 'Grams (g)',
    metricUnit: 'g',
    imperialLabel: 'Ounces (oz)',
    imperialUnit: 'oz',
    toImperial: (val) => val * 0.035274,
    toMetric: (val) => val / 0.035274,
    description: 'Analytical chemical balance standard solution preparation'
  },
  {
    category: 'mass',
    metricLabel: 'Kilograms (kg)',
    metricUnit: 'kg',
    imperialLabel: 'Pounds (lb)',
    imperialUnit: 'lb',
    toImperial: (val) => val * 2.20462,
    toMetric: (val) => val / 2.20462,
    description: 'Physics mechanics, bob masses & gravitational apparatus'
  },
  // 3. Volume & Titration Dispensing
  {
    category: 'volume',
    metricLabel: 'Milliliters (mL)',
    metricUnit: 'mL',
    imperialLabel: 'Fluid Ounces (fl oz)',
    imperialUnit: 'fl oz',
    toImperial: (val) => val * 0.033814,
    toMetric: (val) => val / 0.033814,
    description: 'Burette volumetric titration & pipette aliquots'
  },
  {
    category: 'volume',
    metricLabel: 'Milliliters (mL)',
    metricUnit: 'mL',
    imperialLabel: 'Teaspoons (tsp)',
    imperialUnit: 'tsp',
    toImperial: (val) => val * 0.202884,
    toMetric: (val) => val / 0.202884,
    description: 'Household chemical solutions & culinary science assays'
  },
  {
    category: 'volume',
    metricLabel: 'Liters (L)',
    metricUnit: 'L',
    imperialLabel: 'Gallons (US gal)',
    imperialUnit: 'gal',
    toImperial: (val) => val * 0.264172,
    toMetric: (val) => val / 0.264172,
    description: 'Bulk solution preparation & reservoir volumetry'
  },
  // 4. Temperature & Thermodynamics
  {
    category: 'temp',
    metricLabel: 'Celsius (°C)',
    metricUnit: '°C',
    imperialLabel: 'Fahrenheit (°F)',
    imperialUnit: '°F',
    toImperial: (val) => (val * 9/5) + 32,
    toMetric: (val) => (val - 32) * 5/9,
    description: 'Electrochemical temperature compensation (ATC) & boiling points'
  },
  {
    category: 'temp',
    metricLabel: 'Celsius (°C)',
    metricUnit: '°C',
    imperialLabel: 'Kelvin (K)',
    imperialUnit: 'K',
    toImperial: (val) => val + 273.15,
    toMetric: (val) => val - 273.15,
    description: 'Gas laws, chemical equilibrium thermodynamics & Nernst slope'
  },
  // 5. Pressure & Voltage
  {
    category: 'pressure',
    metricLabel: 'Kilopascals (kPa)',
    metricUnit: 'kPa',
    imperialLabel: 'Pounds/sq in (psi)',
    imperialUnit: 'psi',
    toImperial: (val) => val * 0.145038,
    toMetric: (val) => val / 0.145038,
    description: 'Boyle’s law, atmospheric barometry & pneumatic pressure'
  }
];

export const ExperimentJournal: React.FC<ExperimentJournalProps> = ({
  activeClass,
  userProfile,
  liveToolReadings,
  onSwitchToTool
}) => {
  // Navigation View: 'editor' | 'records' | 'pdf_preview'
  const [activeView, setActiveView] = useState<'editor' | 'records' | 'pdf_preview'>('editor');
  const [savedRecords, setSavedRecords] = useState<ExperimentJournalEntry[]>([]);
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);

  // Form Fields
  const [experimentNo, setExperimentNo] = useState<string>('EXP-01');
  const [title, setTitle] = useState<string>('Determination of Solution pH & Electrochemical EMF');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [classGrade, setClassGrade] = useState<string>(activeClass || 'Class 10');
  const [subject, setSubject] = useState<string>('Chemistry');
  const [aim, setAim] = useState<string>(
    'To determine the pH of various test solutions using a calibrated digital pH meter and verify the Nernst equation electrode potential.'
  );
  const [apparatus, setApparatus] = useState<string>(
    'Benchtop Digital pH Meter with glass combination electrode, 250 mL beakers, NIST buffer solutions (pH 4.01, 7.00, 10.01), wash bottle with DI water.'
  );
  const [theory, setTheory] = useState<string>(
    'pH is the negative logarithm of hydrogen ion activity: pH = -log₁₀[H⁺]. According to the Nernst equation, cell potential varies linearly with pH at 59.16 mV/pH at 25°C.'
  );
  const [formulae, setFormulae] = useState<string>('pH = -log₁₀[H⁺]  |  EMF = -Slope × (pH - 7.00) mV');
  const [activeToolUsed, setActiveToolUsed] = useState<string>('Calibrated Digital pH Meter');
  const [observations, setObservations] = useState<JournalObservationRow[]>(
    NCERT_LAB_TEMPLATES[0].sampleObservations
  );
  const [calculations, setCalculations] = useState<string>(
    '1. Theoretical pH for 0.1 M HCl = 1.00; Measured = 1.02.\n2. Percentage Error = |(1.02 - 1.00) / 1.00| × 100% = 2.0%.\n3. Nernst Slope = 58.8 mV/pH (99.4% efficiency).'
  );
  const [errorPercentage, setErrorPercentage] = useState<number>(2.0);
  const [conclusion, setConclusion] = useState<string>(
    'The observed pH values aligned closely with theoretical calculations within a 2.0% experimental error margin.'
  );
  const [precautions, setPrecautions] = useState<string>(
    '1. Rinse probe thoroughly with deionized water between trials.\n2. Keep glass electrode bulb hydrated.\n3. Calibrate temperature sensor.'
  );
  const [studentName, setStudentName] = useState<string>(
    userProfile?.displayName || 'Student Scholar'
  );

  // Status feedback
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Unit Converter State
  const [selectedUnitCategory, setSelectedUnitCategory] = useState<UnitCategory>('length');
  const [selectedPresetIdx, setSelectedPresetIdx] = useState<number>(0);
  const [metricInputValue, setMetricInputValue] = useState<string>('45');
  const [imperialInputValue, setImperialInputValue] = useState<string>('1.77');
  const [tableDisplayMode, setTableDisplayMode] = useState<'both' | 'metric' | 'imperial'>('both');
  const [converterCopyNotice, setConverterCopyNotice] = useState<string | null>(null);
  const [showQuickConverterDrawer, setShowQuickConverterDrawer] = useState<boolean>(false);

  // Load existing records from LocalStorage, Firebase & MongoDB on mount
  useEffect(() => {
    const list = getLocalJournals(userProfile?.id);
    setSavedRecords(list);

    // Also fetch from MongoDB
    const uid = userProfile?.id || userProfile?.uid;
    if (uid) {
      fetchLabJournalsFromMongo(uid).then((mongoJournals) => {
        if (mongoJournals && mongoJournals.length > 0) {
          setSavedRecords((prev) => {
            const map = new Map<string, ExperimentJournalEntry>();
            prev.forEach((r) => map.set(r.id, r));
            mongoJournals.forEach((mj) => {
              if (mj.id) map.set(mj.id, mj);
            });
            return Array.from(map.values());
          });
        }
      }).catch(() => {});
    }
  }, [userProfile?.id, userProfile?.uid]);

  // Sync active unit presets when category changes
  const categoryPresets = useMemo(() => {
    return UNIT_PRESETS.filter(p => p.category === selectedUnitCategory);
  }, [selectedUnitCategory]);

  const activePreset = useMemo(() => {
    return categoryPresets[selectedPresetIdx] || categoryPresets[0] || UNIT_PRESETS[0];
  }, [categoryPresets, selectedPresetIdx]);

  // Handle bidirectional conversion
  const handleMetricChange = (valStr: string) => {
    setMetricInputValue(valStr);
    const num = parseFloat(valStr);
    if (!isNaN(num)) {
      const converted = activePreset.toImperial(num);
      setImperialInputValue(Number(converted.toFixed(4)).toString());
    } else {
      setImperialInputValue('');
    }
  };

  const handleImperialChange = (valStr: string) => {
    setImperialInputValue(valStr);
    const num = parseFloat(valStr);
    if (!isNaN(num)) {
      const converted = activePreset.toMetric(num);
      setMetricInputValue(Number(converted.toFixed(4)).toString());
    } else {
      setMetricInputValue('');
    }
  };

  // Switch preset
  const handleSelectPreset = (idx: number) => {
    setSelectedPresetIdx(idx);
    const preset = categoryPresets[idx];
    if (preset) {
      const num = parseFloat(metricInputValue) || 10;
      setMetricInputValue(num.toString());
      setImperialInputValue(Number(preset.toImperial(num).toFixed(4)).toString());
    }
  };

  // Insert converted value into active table
  const handleInsertConvertedToTable = () => {
    if (!metricInputValue) return;
    const newRow: JournalObservationRow = {
      id: `obs_${Date.now()}`,
      parameter: `Converted ${activePreset.description.split(' ')[0]} Measurement`,
      metricValue: metricInputValue,
      metricUnit: activePreset.metricUnit,
      imperialValue: imperialInputValue,
      imperialUnit: activePreset.imperialUnit,
      notes: `Converted using Lab Unit Engine (${activePreset.metricLabel} ↔ ${activePreset.imperialLabel})`
    };
    setObservations(prev => [...prev, newRow]);
    setConverterCopyNotice('Added to observation table!');
    setTimeout(() => setConverterCopyNotice(null), 2500);
  };

  // Convert single row units on the fly
  const handleQuickConvertRow = (rowId: string) => {
    setObservations(prev => prev.map(row => {
      if (row.id !== rowId) return row;
      const unit = (row.metricUnit || row.imperialUnit || '').toLowerCase().trim();
      
      // If metricValue exists, convert to imperial
      if (row.metricValue && !isNaN(parseFloat(row.metricValue))) {
        const val = parseFloat(row.metricValue);
        if (unit.includes('µm') || unit.includes('um')) {
          return { ...row, metricUnit: 'µm', imperialValue: (val * 0.0393701).toFixed(2), imperialUnit: 'mils' };
        } else if (unit.includes('mm')) {
          return { ...row, metricUnit: 'mm', imperialValue: (val / 25.4).toFixed(3), imperialUnit: 'in' };
        } else if (unit.includes('cm')) {
          return { ...row, metricUnit: 'cm', imperialValue: (val * 0.393701).toFixed(2), imperialUnit: 'in' };
        } else if (unit.includes('mg')) {
          return { ...row, metricUnit: 'mg', imperialValue: (val * 0.0154324).toFixed(3), imperialUnit: 'gr' };
        } else if (unit.includes('g') && !unit.includes('kg')) {
          return { ...row, metricUnit: 'g', imperialValue: (val * 0.035274).toFixed(4), imperialUnit: 'oz' };
        } else if (unit.includes('kg')) {
          return { ...row, metricUnit: 'kg', imperialValue: (val * 2.20462).toFixed(2), imperialUnit: 'lb' };
        } else if (unit.includes('ml')) {
          return { ...row, metricUnit: 'mL', imperialValue: (val * 0.033814).toFixed(2), imperialUnit: 'fl oz' };
        } else if (unit.includes('l')) {
          return { ...row, metricUnit: 'L', imperialValue: (val * 0.264172).toFixed(3), imperialUnit: 'gal' };
        } else if (unit.includes('°c') || unit.includes('c')) {
          return { ...row, metricUnit: '°C', imperialValue: ((val * 9/5) + 32).toFixed(1), imperialUnit: '°F' };
        } else {
          return { ...row, imperialValue: row.metricValue, imperialUnit: row.metricUnit };
        }
      } else if (row.imperialValue && !isNaN(parseFloat(row.imperialValue))) {
        const val = parseFloat(row.imperialValue);
        const impUnit = (row.imperialUnit || '').toLowerCase().trim();
        if (impUnit.includes('mils')) {
          return { ...row, metricValue: (val / 0.0393701).toFixed(1), metricUnit: 'µm' };
        } else if (impUnit.includes('in')) {
          return { ...row, metricValue: (val * 2.54).toFixed(2), metricUnit: 'cm' };
        } else if (impUnit.includes('oz')) {
          return { ...row, metricValue: (val / 0.035274).toFixed(4), metricUnit: 'g' };
        } else if (impUnit.includes('lb')) {
          return { ...row, metricValue: (val / 2.20462).toFixed(2), metricUnit: 'kg' };
        } else if (impUnit.includes('fl oz')) {
          return { ...row, metricValue: (val / 0.033814).toFixed(2), metricUnit: 'mL' };
        } else if (impUnit.includes('°f') || impUnit.includes('f')) {
          return { ...row, metricValue: ((val - 32) * 5/9).toFixed(1), metricUnit: '°C' };
        }
      }
      return row;
    }));
  };

  // Import Live Tool Reading into Observation Table
  const handleImportLiveToolReading = (toolName: string) => {
    if (toolName === 'pH Meter' && liveToolReadings?.phMeter) {
      const r = liveToolReadings.phMeter;
      const newRow: JournalObservationRow = {
        id: `obs_live_${Date.now()}`,
        parameter: `Live pH Meter Reading: ${r.solutionName}`,
        metricValue: r.ph.toFixed(2),
        metricUnit: 'pH',
        imperialValue: r.ph.toFixed(2),
        imperialUnit: 'pH',
        notes: `EMF: ${r.emfMv} mV | Temp: ${r.tempC.toFixed(1)}°C | [H⁺]: ${r.hConc}`
      };
      setObservations(prev => [...prev, newRow]);
      setActiveToolUsed('Calibrated Digital Benchtop pH Meter');
    } else if (toolName === 'Microscope' && liveToolReadings?.microscope) {
      const r = liveToolReadings.microscope;
      const mils = (r.cellSizeUm * 0.0393701).toFixed(2);
      const newRow: JournalObservationRow = {
        id: `obs_live_${Date.now()}`,
        parameter: `Optical Micrograph: ${r.specimenName} (${r.tissueType})`,
        metricValue: `${r.cellSizeUm} µm`,
        metricUnit: 'µm',
        imperialValue: `${mils} mils`,
        imperialUnit: 'mils',
        notes: `Magnification: ${r.magnification}x (${r.objective} Objective Lens)`
      };
      setObservations(prev => [...prev, newRow]);
      setActiveToolUsed('Virtual Compound Optical Microscope');
    } else if (toolName === 'Chemical Balance' && liveToolReadings?.balance) {
      const r = liveToolReadings.balance;
      const oz = (r.massGrams * 0.035274).toFixed(4);
      const newRow: JournalObservationRow = {
        id: `obs_live_${Date.now()}`,
        parameter: `Gravimetric Mass: ${r.reagentName} (${r.formula})`,
        metricValue: `${r.massGrams.toFixed(4)} g`,
        metricUnit: 'g',
        imperialValue: `${oz} oz`,
        imperialUnit: 'oz',
        notes: `Tare Vessel: ${r.tareVessel} | Target Molarity: ${r.targetMolarity} M`
      };
      setObservations(prev => [...prev, newRow]);
      setActiveToolUsed('Precision Digital Analytical Chemical Balance');
    }
  };

  // Load Template
  const handleLoadTemplate = (tpl: LabTemplate) => {
    setTitle(tpl.title);
    setExperimentNo(tpl.experimentNo);
    setSubject(tpl.subject);
    setClassGrade(tpl.classGrade);
    setAim(tpl.aim);
    setApparatus(tpl.apparatus);
    setTheory(tpl.theory);
    setFormulae(tpl.formulae);
    setObservations(tpl.sampleObservations);
    setCalculations(tpl.calculations);
    setErrorPercentage(tpl.errorPercentage);
    setConclusion(tpl.conclusion);
    setPrecautions(tpl.precautions);
    setActiveToolUsed(tpl.title.includes('pH') ? 'Digital pH Meter' : tpl.title.includes('Microscopic') ? 'Optical Microscope' : 'Analytical Balance');
    setSaveSuccessMsg(`Loaded "${tpl.title.substring(0, 45)}..." template`);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  // Save Record
  const handleSaveJournal = async () => {
    try {
      const entry: Omit<ExperimentJournalEntry, 'id' | 'createdAt' | 'updatedAt'> = {
        userId: userProfile?.id || 'guest',
        experimentNo,
        title,
        date,
        classGrade,
        subject,
        aim,
        apparatus,
        theory,
        formulae,
        activeToolUsed,
        observations,
        calculations,
        errorPercentage,
        conclusion,
        precautions,
        studentName,
      };
      const id = await saveExperimentJournal(entry, activeEntryId || undefined);
      setActiveEntryId(id);
      // Sync to MongoDB Cloud Database
      await saveLabJournalToMongo({
        id: id || activeEntryId || undefined,
        userId: userProfile?.id || userProfile?.uid || 'guest',
        ...entry,
      });
      const updatedList = getLocalJournals(userProfile?.id);
      setSavedRecords(updatedList);
      setSaveSuccessMsg('Experiment journal saved to MongoDB & local cache!');
      setTimeout(() => setSaveSuccessMsg(null), 3500);
    } catch (_) {
      setSaveSuccessMsg('Saved locally to browser cache!');
      setTimeout(() => setSaveSuccessMsg(null), 3500);
    }
  };

  // Add observation row
  const handleAddObservationRow = () => {
    const newRow: JournalObservationRow = {
      id: `obs_${Date.now()}`,
      parameter: 'Sample / Trial Parameter',
      metricValue: '0.00',
      metricUnit: 'unit',
      imperialValue: '0.00',
      imperialUnit: 'unit',
      notes: 'Observation note'
    };
    setObservations(prev => [...prev, newRow]);
  };

  // Update row
  const handleUpdateObservationRow = (id: string, field: keyof JournalObservationRow, val: string) => {
    setObservations(prev => prev.map(row => {
      if (row.id === id) {
        return { ...row, [field]: val };
      }
      return row;
    }));
  };

  // Remove row
  const handleRemoveObservationRow = (id: string) => {
    setObservations(prev => prev.filter(r => r.id !== id));
  };

  // Trigger Native PDF Print / Save as PDF
  const handlePrintPdf = () => {
    // Print window styles
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-950/80 border border-white/10 shadow-2xl backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>NCERT Academic Practical Record</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              CBSE &amp; CISCE Compliant
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Scientific Experiment Journal &amp; Lab Report Engine
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Record observations, capture live data from calibrated virtual tools (Microscope, pH Meter, Chemical Balance), convert metric &amp; imperial units, and export authentic academic lab reports as PDF.
          </p>
        </div>

        {/* View Switcher Segmented Control */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-white/10 rounded-2xl shadow-inner">
          <button
            onClick={() => setActiveView('editor')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeView === 'editor'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Journal Editor</span>
          </button>

          <button
            onClick={() => setActiveView('pdf_preview')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeView === 'pdf_preview'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PDF Report Preview</span>
          </button>

          <button
            onClick={() => setActiveView('records')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeView === 'records'
                ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved Records ({savedRecords.length})</span>
          </button>
        </div>
      </div>

      {/* Save feedback banner */}
      {saveSuccessMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{saveSuccessMsg}</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-300">AUTO-SAVED</span>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 1. EDITOR VIEW */}
      {/* ===================================================================== */}
      {activeView === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Journal Form Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Quick Templates Selector */}
            <div className="p-5 rounded-3xl bg-slate-950 border border-white/10 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Official NCERT Practical Templates (1-Click Load)</span>
                </span>
                <span className="text-[10px] text-slate-400">Class 9–12 Aligned</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {NCERT_LAB_TEMPLATES.map(tpl => (
                  <button
                    key={tpl.id}
                    onClick={() => handleLoadTemplate(tpl)}
                    className="p-3 rounded-2xl bg-white/5 hover:bg-emerald-500/15 border border-white/10 hover:border-emerald-500/40 text-left transition-all group cursor-pointer"
                  >
                    <div className="text-[10px] font-mono text-emerald-400 font-bold">{tpl.experimentNo} • {tpl.subject}</div>
                    <div className="text-xs font-bold text-white group-hover:text-emerald-300 line-clamp-1 mt-0.5">{tpl.title}</div>
                    <div className="text-[10px] text-slate-400 line-clamp-1 mt-1">{tpl.aim}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Experiment Metadata Card */}
            <div className="p-6 rounded-3xl bg-slate-950 border border-white/10 space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>Experiment Details &amp; Student Record</span>
                </h3>
                <button
                  onClick={handleSaveJournal}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Journal</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Experiment Number:</label>
                  <input
                    type="text"
                    value={experimentNo}
                    onChange={e => setExperimentNo(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:border-cyan-400 focus:outline-none"
                    placeholder="e.g. EXP-01"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Date Performed:</label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Student / Scholar Name:</label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={e => setStudentName(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white font-semibold focus:border-cyan-400 focus:outline-none"
                    placeholder="Your Full Name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Subject / Discipline:</label>
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="Chemistry">Chemistry (Volumetric &amp; Electrochemistry)</option>
                    <option value="Biology">Biology (Cytology &amp; Physiology)</option>
                    <option value="Physics">Physics (Optics &amp; Mechanics)</option>
                    <option value="General Science">General Science</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Class / Academic Standard:</label>
                  <input
                    type="text"
                    value={classGrade}
                    onChange={e => setClassGrade(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-slate-400 font-medium">Experiment Title:</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-white font-bold text-sm focus:border-cyan-400 focus:outline-none"
                  placeholder="e.g. Determination of pH of acids and bases"
                />
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-slate-400 font-medium">Aim / Objective:</label>
                <textarea
                  value={aim}
                  onChange={e => setAim(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-400 focus:outline-none leading-relaxed"
                  placeholder="State the primary experimental objective..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Apparatus &amp; Chemicals Used:</label>
                  <textarea
                    value={apparatus}
                    onChange={e => setApparatus(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-400 focus:outline-none leading-relaxed"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Theory &amp; Working Principle:</label>
                  <textarea
                    value={theory}
                    onChange={e => setTheory(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-400 focus:outline-none leading-relaxed"
                  />
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-slate-400 font-medium">Chemical Equations &amp; Mathematical Formulae:</label>
                <input
                  type="text"
                  value={formulae}
                  onChange={e => setFormulae(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-cyan-300 font-mono focus:border-cyan-400 focus:outline-none"
                  placeholder="e.g. pH = -log₁₀[H⁺]  |  N₁V₁ = N₂V₂"
                />
              </div>
            </div>

            {/* ============================================================== */}
            {/* OBSERVATION TABLE & LIVE TOOL INGESTION */}
            {/* ============================================================== */}
            <div className="p-6 rounded-3xl bg-slate-950 border border-white/10 space-y-5 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <TableIcon className="w-4 h-4 text-emerald-400" />
                    <span>Experimental Observations &amp; Data Input</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Record quantitative readings and qualitative inferences from virtual tools.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Quick-Access Unit Converter Toggle Button */}
                  <button
                    onClick={() => setShowQuickConverterDrawer(!showQuickConverterDrawer)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      showQuickConverterDrawer
                        ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md scale-[1.02]'
                        : 'bg-white/5 border-white/10 text-amber-300 hover:bg-white/10'
                    }`}
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    <span>Quick Unit Converter</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/30 font-bold">
                      {showQuickConverterDrawer ? 'Hide' : 'Open'}
                    </span>
                  </button>

                  {/* Table View Mode Toggle */}
                  <div className="flex items-center gap-1 p-1 bg-slate-900 border border-white/10 rounded-xl text-[11px] font-semibold">
                    <span className="text-slate-400 px-2">Units:</span>
                    <button
                      onClick={() => setTableDisplayMode('both')}
                      className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                        tableDisplayMode === 'both' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/30' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Metric &amp; Imperial
                    </button>
                    <button
                      onClick={() => setTableDisplayMode('metric')}
                      className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                        tableDisplayMode === 'metric' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/30' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Metric Only
                    </button>
                    <button
                      onClick={() => setTableDisplayMode('imperial')}
                      className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                        tableDisplayMode === 'imperial' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/30' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Imperial Only
                    </button>
                  </div>
                </div>
              </div>

              {/* INTEGRATED QUICK-ACCESS UNIT CONVERTER PANEL */}
              {showQuickConverterDrawer && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-amber-400/40 space-y-3 shadow-xl animate-in fade-in">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-400 uppercase flex items-center gap-1">
                        <ArrowRightLeft className="w-3.5 h-3.5" /> Quick Measurement Converter
                      </span>
                      <span className="text-[10px] text-slate-400">Two-way Metric ↔ Imperial</span>
                    </div>

                    {/* Category Selector */}
                    <div className="flex flex-wrap items-center gap-1">
                      {(['length', 'mass', 'volume', 'temp', 'pressure'] as const).map(cat => (
                        <button
                          key={cat}
                          onClick={() => {
                            setSelectedUnitCategory(cat);
                            setSelectedPresetIdx(0);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-all cursor-pointer ${
                            selectedUnitCategory === cat
                              ? 'bg-amber-400 text-slate-950 font-black'
                              : 'bg-white/5 text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    <div className="sm:col-span-5 flex items-center gap-2">
                      <div className="flex-1">
                        <label className="text-[10px] text-cyan-300 font-mono block mb-1">
                          Metric ({activePreset.metricLabel}):
                        </label>
                        <input
                          type="number"
                          value={metricInputValue}
                          onChange={e => handleMetricChange(e.target.value)}
                          className="w-full bg-slate-950 border border-cyan-400/40 rounded-xl px-3 py-1.5 text-xs text-cyan-300 font-mono font-bold focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2 flex items-center justify-center">
                      <div className="p-2 rounded-full bg-black/60 border border-white/10 text-slate-400">
                        <ArrowRightLeft className="w-4 h-4 text-amber-400" />
                      </div>
                    </div>

                    <div className="sm:col-span-5 flex items-center gap-2">
                      <div className="flex-1">
                        <label className="text-[10px] text-amber-300 font-mono block mb-1">
                          Imperial ({activePreset.imperialLabel}):
                        </label>
                        <input
                          type="number"
                          value={imperialInputValue}
                          onChange={e => handleImperialChange(e.target.value)}
                          className="w-full bg-slate-950 border border-amber-400/40 rounded-xl px-3 py-1.5 text-xs text-amber-300 font-mono font-bold focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/5 text-[11px]">
                    <span className="text-slate-400 font-mono">
                      {activePreset.description}
                    </span>
                    <button
                      onClick={handleInsertConvertedToTable}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Insert Converted Row into Table</span>
                    </button>
                  </div>
                </div>
              )}

              {/* One-Click Live Data Import Buttons */}
              <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-cyan-400 font-bold flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Import Live Data from Calibrated Virtual Tools:</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Syncs instantaneously</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleImportLiveToolReading('pH Meter')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-500/40 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                    <span>+ Append pH Meter Reading</span>
                  </button>

                  <button
                    onClick={() => handleImportLiveToolReading('Microscope')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/40 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    <span>+ Append Optical Microscope Specimen</span>
                  </button>

                  <button
                    onClick={() => handleImportLiveToolReading('Chemical Balance')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Scale className="w-3.5 h-3.5 text-amber-400" />
                    <span>+ Append Chemical Balance Mass</span>
                  </button>
                </div>
              </div>

              {/* Observation Table */}
              <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/60">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/60 text-slate-300 font-mono text-[11px] border-b border-white/10 uppercase">
                    <tr>
                      <th className="py-3 px-3 w-12 text-center">#</th>
                      <th className="py-3 px-3">Parameter / Specimen / Solution</th>
                      {(tableDisplayMode === 'both' || tableDisplayMode === 'metric') && (
                        <th className="py-3 px-3 w-32">Metric Value &amp; Unit</th>
                      )}
                      {(tableDisplayMode === 'both' || tableDisplayMode === 'imperial') && (
                        <th className="py-3 px-3 w-32">Imperial Value &amp; Unit</th>
                      )}
                      <th className="py-3 px-3">Inference / Remarks</th>
                      <th className="py-3 px-2 w-10 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {observations.map((row, idx) => (
                      <tr key={row.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-2.5 px-3 font-mono text-slate-500 text-center">{idx + 1}</td>
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={row.parameter}
                            onChange={e => handleUpdateObservationRow(row.id, 'parameter', e.target.value)}
                            className="w-full bg-transparent text-white font-medium focus:bg-slate-800 rounded px-1.5 py-0.5 focus:outline-none"
                          />
                        </td>
                        {(tableDisplayMode === 'both' || tableDisplayMode === 'metric') && (
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                value={row.metricValue}
                                onChange={e => handleUpdateObservationRow(row.id, 'metricValue', e.target.value)}
                                className="w-20 bg-slate-950 border border-white/10 text-cyan-300 font-mono rounded px-2 py-0.5 focus:outline-none"
                              />
                              <input
                                type="text"
                                value={row.metricUnit}
                                onChange={e => handleUpdateObservationRow(row.id, 'metricUnit', e.target.value)}
                                className="w-12 bg-transparent text-slate-400 font-mono text-[11px] px-1 focus:outline-none"
                              />
                              {tableDisplayMode === 'both' && (
                                <button
                                  type="button"
                                  onClick={() => handleQuickConvertRow(row.id)}
                                  className="p-1 rounded-md bg-white/5 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 transition-all cursor-pointer"
                                  title="Instant auto-convert Metric ↔ Imperial"
                                >
                                  <ArrowRightLeft className="w-3 h-3 text-cyan-400" />
                                </button>
                              )}
                            </div>
                          </td>
                        )}
                        {(tableDisplayMode === 'both' || tableDisplayMode === 'imperial') && (
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                value={row.imperialValue}
                                onChange={e => handleUpdateObservationRow(row.id, 'imperialValue', e.target.value)}
                                className="w-20 bg-slate-950 border border-white/10 text-amber-300 font-mono rounded px-2 py-0.5 focus:outline-none"
                              />
                              <input
                                type="text"
                                value={row.imperialUnit}
                                onChange={e => handleUpdateObservationRow(row.id, 'imperialUnit', e.target.value)}
                                className="w-12 bg-transparent text-slate-400 font-mono text-[11px] px-1 focus:outline-none"
                              />
                            </div>
                          </td>
                        )}
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={row.notes || ''}
                            onChange={e => handleUpdateObservationRow(row.id, 'notes', e.target.value)}
                            placeholder="Observations / color change..."
                            className="w-full bg-transparent text-slate-300 text-xs focus:bg-slate-800 rounded px-1.5 py-0.5 focus:outline-none"
                          />
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          <button
                            onClick={() => handleRemoveObservationRow(row.id)}
                            className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors cursor-pointer"
                            title="Remove row"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={handleAddObservationRow}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-all cursor-pointer border border-white/10"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Add Observation Row</span>
                </button>

                <span className="text-xs text-slate-400 font-mono">
                  Total Observations: <strong className="text-white">{observations.length}</strong>
                </span>
              </div>
            </div>

            {/* Calculations, Error Analysis & Conclusion */}
            <div className="p-6 rounded-3xl bg-slate-950 border border-white/10 space-y-5 shadow-xl">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Calculations, Error Analysis &amp; Inferences</span>
              </h3>

              <div className="space-y-1 text-xs">
                <label className="text-slate-400 font-medium">Calculations &amp; Steps:</label>
                <textarea
                  value={calculations}
                  onChange={e => setCalculations(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs items-center">
                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Calculated Percentage Error (%):</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.01"
                      value={errorPercentage}
                      onChange={e => setErrorPercentage(parseFloat(e.target.value) || 0)}
                      className="w-32 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-rose-300 font-mono font-bold focus:border-cyan-400 focus:outline-none"
                    />
                    <span className="text-slate-400">% Error</span>
                  </div>
                </div>
                <div className="sm:col-span-2 p-3 rounded-2xl bg-black/40 border border-white/5 text-[11px] text-slate-400">
                  Formula: <span className="text-amber-300 font-mono font-semibold">|Observed - Theoretical| / Theoretical × 100%</span>
                  <div className="text-slate-500 mt-0.5">Values under 5.0% are standard acceptable CBSE precision.</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Inference &amp; Conclusion:</label>
                  <textarea
                    value={conclusion}
                    onChange={e => setConclusion(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-400 focus:outline-none leading-relaxed"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Precautions Observed:</label>
                  <textarea
                    value={precautions}
                    onChange={e => setPrecautions(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-400 focus:outline-none leading-relaxed"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setActiveView('pdf_preview')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Preview &amp; Export Official PDF Report</span>
                </button>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* RIGHT COLUMN (4 cols): QUICK-ACCESS UNIT CONVERTER ENGINE */}
          {/* ============================================================== */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-3xl bg-slate-950 border border-cyan-500/30 space-y-5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-1 border-b border-white/10 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                    <ArrowRightLeft className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Lab Unit Converter Engine</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                    Dual Metric/Imperial
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">
                  Quick-Access Measurement Converter
                </h4>
                <p className="text-xs text-slate-400">
                  Instant two-way conversion for laboratory calculations, graticules, masses, and volumes.
                </p>
              </div>

              {/* Category Segmented Tabs */}
              <div className="grid grid-cols-5 gap-1 p-1 bg-slate-900 rounded-2xl border border-white/10 text-[11px] font-semibold text-center">
                {[
                  { id: 'length', label: 'Length' },
                  { id: 'mass', label: 'Mass' },
                  { id: 'volume', label: 'Volume' },
                  { id: 'temp', label: 'Temp' },
                  { id: 'pressure', label: 'Press.' },
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedUnitCategory(cat.id as UnitCategory);
                      setSelectedPresetIdx(0);
                    }}
                    className={`py-1.5 rounded-xl transition-all cursor-pointer ${
                      selectedUnitCategory === cat.id
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Sub-presets Selector */}
              <div className="space-y-1 text-xs">
                <label className="text-slate-400 font-medium">Conversion Preset:</label>
                <select
                  value={selectedPresetIdx}
                  onChange={e => handleSelectPreset(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                >
                  {categoryPresets.map((p, idx) => (
                    <option key={idx} value={idx}>
                      {p.metricLabel} ↔ {p.imperialLabel}
                    </option>
                  ))}
                </select>
                <div className="text-[10px] text-slate-400 pt-0.5">{activePreset.description}</div>
              </div>

              {/* Interactive Bidirectional Inputs */}
              <div className="space-y-3 pt-2">
                {/* Metric Input Box */}
                <div className="p-3.5 rounded-2xl bg-black/60 border border-cyan-500/30 space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-cyan-400 font-bold">Metric (SI System)</span>
                    <span className="text-slate-400">{activePreset.metricLabel}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="any"
                      value={metricInputValue}
                      onChange={e => handleMetricChange(e.target.value)}
                      className="w-full bg-transparent text-xl font-bold font-mono text-white focus:outline-none"
                      placeholder="0.00"
                    />
                    <span className="text-xs font-mono font-bold text-cyan-300 px-2 py-1 bg-cyan-950/60 rounded-lg border border-cyan-500/40">
                      {activePreset.metricUnit}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-slate-400 shadow-sm">
                    <ArrowRightLeft className="w-4 h-4 text-cyan-400" />
                  </div>
                </div>

                {/* Imperial Input Box */}
                <div className="p-3.5 rounded-2xl bg-black/60 border border-amber-500/30 space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-amber-400 font-bold">Imperial / US Customary</span>
                    <span className="text-slate-400">{activePreset.imperialLabel}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="any"
                      value={imperialInputValue}
                      onChange={e => handleImperialChange(e.target.value)}
                      className="w-full bg-transparent text-xl font-bold font-mono text-white focus:outline-none"
                      placeholder="0.00"
                    />
                    <span className="text-xs font-mono font-bold text-amber-300 px-2 py-1 bg-amber-950/60 rounded-lg border border-amber-500/40">
                      {activePreset.imperialUnit}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action: Insert Converted into Observation Table */}
              <button
                onClick={handleInsertConvertedToTable}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:opacity-95 text-slate-950 text-xs font-black transition-all shadow-lg active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
                <span>Insert Converted Measurement into Table</span>
              </button>

              {converterCopyNotice && (
                <div className="text-center text-xs font-mono text-emerald-400 animate-in fade-in">
                  ✓ {converterCopyNotice}
                </div>
              )}

              {/* Fast Unit Conversion Cheat Sheet */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2 text-xs">
                <span className="font-mono text-slate-400 font-bold text-[11px] block border-b border-white/5 pb-1">
                  Laboratory Constant Factors:
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 font-mono">
                  <div>1 µm = 0.0394 mils</div>
                  <div>1 in = 25.4 mm</div>
                  <div>1 g = 0.0353 oz</div>
                  <div>1 oz = 28.35 g</div>
                  <div>1 mL = 0.0338 fl oz</div>
                  <div>1 fl oz = 29.57 mL</div>
                  <div>°F = (°C × 9/5) + 32</div>
                  <div>K = °C + 273.15</div>
                </div>
              </div>
            </div>

            {/* Quick Virtual Tools Launcher Card */}
            <div className="p-6 rounded-3xl bg-slate-950 border border-white/10 space-y-4 shadow-xl">
              <h4 className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">
                Simulate &amp; Gather More Data
              </h4>
              <p className="text-xs text-slate-400">
                Switch back to virtual science instruments to conduct additional trials:
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => onSwitchToTool && onSwitchToTool('tool-ph-meter')}
                  className="w-full p-3 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-left flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Gauge className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="text-xs font-bold text-white">Digital pH Meter</div>
                      <div className="text-[10px] text-slate-400">Measure buffers, acids &amp; EMF</div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                </button>

                <button
                  onClick={() => onSwitchToTool && onSwitchToTool('tool-microscope')}
                  className="w-full p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-left flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Eye className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="text-xs font-bold text-white">Optical Microscope</div>
                      <div className="text-[10px] text-slate-400">Cytology slides &amp; cell sizing</div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                </button>

                <button
                  onClick={() => onSwitchToTool && onSwitchToTool('tool-chemical-balance')}
                  className="w-full p-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-left flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Scale className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="text-xs font-bold text-white">Analytical Chemical Balance</div>
                      <div className="text-[10px] text-slate-400">0.0001 g precision weighing</div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. PDF REPORT PREVIEW VIEW (High-Fidelity Official CBSE Lab Record) */}
      {/* ===================================================================== */}
      {activeView === 'pdf_preview' && (
        <div className="space-y-6">
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-white/10 print:hidden">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Printer className="w-4 h-4 text-cyan-400" />
              <span>Ready for Export to PDF via standard browser print dialog.</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveView('editor')}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold cursor-pointer border border-white/10"
              >
                ← Back to Editor
              </button>
              <button
                onClick={handlePrintPdf}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-lg transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save as PDF</span>
              </button>
            </div>
          </div>

          {/* Printable Lab Record Sheet (Paper Canvas) */}
          <div 
            id="printable-lab-report"
            className="max-w-4xl mx-auto bg-white text-slate-950 p-8 sm:p-12 rounded-3xl shadow-2xl border border-slate-200 font-serif leading-normal space-y-6 print:shadow-none print:border-none print:m-0 print:p-6"
          >
            {/* Academic Institution Header */}
            <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
              <div className="text-[11px] font-mono tracking-widest uppercase font-bold text-slate-600">
                Official CBSE / CISCE Academic Laboratory Practical Record
              </div>
              <h1 className="text-2xl font-black text-slate-950 tracking-tight font-sans">
                BUZZING BRAIN EXPERIMENTAL SCIENCE RECORD
              </h1>
              <div className="text-xs text-slate-600 font-sans">
                Academic Session 2026–2027 • Free Science &amp; STEM Practical Assessment
              </div>
            </div>

            {/* Student & Metadata Record Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-100 rounded-xl text-xs font-sans border border-slate-300">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Student Name:</span>
                <strong className="text-slate-900">{studentName || 'Student Scholar'}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Class &amp; Section:</span>
                <strong className="text-slate-900">{classGrade}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Experiment No:</span>
                <strong className="text-slate-900 font-mono">{experimentNo}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Date of Experiment:</span>
                <strong className="text-slate-900 font-mono">{date}</strong>
              </div>
            </div>

            {/* Experiment Title */}
            <div className="space-y-1">
              <div className="text-[10px] font-sans font-bold uppercase text-slate-500">Experiment Subject &amp; Title:</div>
              <h2 className="text-lg font-bold text-slate-900 font-sans border-b border-slate-200 pb-1">
                [{subject}] {title}
              </h2>
            </div>

            {/* Aim */}
            <div className="space-y-1 text-xs">
              <strong className="font-sans font-bold text-slate-900 uppercase tracking-wide">1. Aim / Objective:</strong>
              <p className="text-slate-800 leading-relaxed pl-2 border-l-2 border-slate-300">{aim}</p>
            </div>

            {/* Apparatus */}
            <div className="space-y-1 text-xs">
              <strong className="font-sans font-bold text-slate-900 uppercase tracking-wide">2. Apparatus &amp; Materials Required:</strong>
              <p className="text-slate-800 leading-relaxed pl-2 border-l-2 border-slate-300">{apparatus}</p>
            </div>

            {/* Principle & Formula */}
            <div className="space-y-1 text-xs">
              <strong className="font-sans font-bold text-slate-900 uppercase tracking-wide">3. Scientific Principle &amp; Formulae:</strong>
              <p className="text-slate-800 leading-relaxed pl-2 border-l-2 border-slate-300">{theory}</p>
              {formulae && (
                <div className="mt-2 p-2.5 bg-slate-100 rounded-lg font-mono text-xs text-slate-900 border border-slate-200 font-bold">
                  {formulae}
                </div>
              )}
            </div>

            {/* Observation Table */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <strong className="font-sans font-bold text-slate-900 uppercase tracking-wide">4. Tabular Observations &amp; Data:</strong>
                <span className="text-[10px] font-sans text-slate-500">Virtual Tool: {activeToolUsed}</span>
              </div>

              <table className="w-full border-collapse border border-slate-400 text-left text-xs font-sans">
                <thead>
                  <tr className="bg-slate-200 border-b border-slate-400 text-slate-900 text-[11px] font-bold">
                    <th className="border border-slate-300 p-2 text-center w-8">#</th>
                    <th className="border border-slate-300 p-2">Trial / Parameter</th>
                    <th className="border border-slate-300 p-2">Metric Value</th>
                    <th className="border border-slate-300 p-2">Imperial Value</th>
                    <th className="border border-slate-300 p-2">Remarks / Inferences</th>
                  </tr>
                </thead>
                <tbody>
                  {observations.map((row, i) => (
                    <tr key={row.id} className="border-b border-slate-300">
                      <td className="border border-slate-300 p-2 text-center font-mono text-slate-600">{i + 1}</td>
                      <td className="border border-slate-300 p-2 font-medium text-slate-900">{row.parameter}</td>
                      <td className="border border-slate-300 p-2 font-mono text-slate-800">{row.metricValue} {row.metricUnit}</td>
                      <td className="border border-slate-300 p-2 font-mono text-slate-800">{row.imperialValue} {row.imperialUnit}</td>
                      <td className="border border-slate-300 p-2 text-slate-700">{row.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations & Error */}
            <div className="space-y-1 text-xs">
              <strong className="font-sans font-bold text-slate-900 uppercase tracking-wide">5. Calculations &amp; Quantitative Error Analysis:</strong>
              <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs text-slate-800 whitespace-pre-line leading-relaxed">
                {calculations}
              </div>
              <div className="font-sans font-semibold text-slate-800 pt-1">
                Experimental Percentage Error: <span className="font-mono text-red-600 font-bold">{errorPercentage.toFixed(2)}%</span>
              </div>
            </div>

            {/* Conclusion */}
            <div className="space-y-1 text-xs">
              <strong className="font-sans font-bold text-slate-900 uppercase tracking-wide">6. Result &amp; Conclusion:</strong>
              <p className="text-slate-800 leading-relaxed pl-2 border-l-2 border-slate-300">{conclusion}</p>
            </div>

            {/* Precautions */}
            <div className="space-y-1 text-xs">
              <strong className="font-sans font-bold text-slate-900 uppercase tracking-wide">7. Precautions Observed:</strong>
              <p className="text-slate-800 leading-relaxed pl-2 border-l-2 border-slate-300">{precautions}</p>
            </div>

            {/* Formal Examiner & Student Signatures */}
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-300 text-xs font-sans">
              <div className="space-y-6">
                <div className="h-10 border-b border-dashed border-slate-400" />
                <div className="text-slate-700">
                  <strong>Signature of Student Scholar</strong>
                  <div className="text-[10px] text-slate-500">Date: {date}</div>
                </div>
              </div>

              <div className="space-y-6 text-right">
                <div className="h-10 border-b border-dashed border-slate-400" />
                <div className="text-slate-700">
                  <strong>Signature of Science Examiner / Teacher</strong>
                  <div className="text-[10px] text-slate-500">Grade / Marks Awarded: ________ / 30</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. SAVED RECORDS VIEW */}
      {/* ===================================================================== */}
      {activeView === 'records' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white">Saved Experiment Journals</h3>
              <p className="text-xs text-slate-400">Archived laboratory records and student write-ups.</p>
            </div>
            <button
              onClick={() => setActiveView('editor')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Journal</span>
            </button>
          </div>

          {savedRecords.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-950 border border-white/10 space-y-3">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
              <div className="text-sm font-bold text-slate-300">No Experiment Journals Saved Yet</div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Use the Journal Editor to write and record your lab experiment data, or click a 1-click template to populate.
              </p>
              <button
                onClick={() => handleLoadTemplate(NCERT_LAB_TEMPLATES[0])}
                className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Load Sample pH Meter Lab Record</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedRecords.map(rec => (
                <div
                  key={rec.id}
                  className="p-5 rounded-3xl bg-slate-950 border border-white/10 hover:border-emerald-500/40 transition-all space-y-4 shadow-xl group"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30">
                      {rec.experimentNo}
                    </span>
                    <span className="text-slate-500 font-mono text-[11px]">{rec.date}</span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                      {rec.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {rec.aim}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-slate-400 pt-2 border-t border-white/5">
                    <span>Subject: <strong className="text-slate-200">{rec.subject}</strong></span>
                    <span>•</span>
                    <span>Observations: <strong className="text-cyan-300">{rec.observations?.length || 0}</strong></span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        setExperimentNo(rec.experimentNo);
                        setTitle(rec.title);
                        setDate(rec.date);
                        setClassGrade(rec.classGrade);
                        setSubject(rec.subject);
                        setAim(rec.aim);
                        setApparatus(rec.apparatus);
                        setTheory(rec.theory);
                        setFormulae(rec.formulae);
                        setObservations(rec.observations || []);
                        setCalculations(rec.calculations);
                        setErrorPercentage(rec.errorPercentage || 0);
                        setConclusion(rec.conclusion);
                        setPrecautions(rec.precautions);
                        setActiveEntryId(rec.id);
                        setActiveView('editor');
                      }}
                      className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/10 transition-colors cursor-pointer text-center"
                    >
                      Open &amp; Edit
                    </button>

                    <button
                      onClick={() => {
                        setExperimentNo(rec.experimentNo);
                        setTitle(rec.title);
                        setDate(rec.date);
                        setClassGrade(rec.classGrade);
                        setSubject(rec.subject);
                        setAim(rec.aim);
                        setApparatus(rec.apparatus);
                        setTheory(rec.theory);
                        setFormulae(rec.formulae);
                        setObservations(rec.observations || []);
                        setCalculations(rec.calculations);
                        setErrorPercentage(rec.errorPercentage || 0);
                        setConclusion(rec.conclusion);
                        setPrecautions(rec.precautions);
                        setActiveEntryId(rec.id);
                        setActiveView('pdf_preview');
                      }}
                      className="p-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500 text-cyan-200 hover:text-slate-950 transition-colors cursor-pointer"
                      title="View PDF Report"
                    >
                      <Printer className="w-4 h-4" />
                    </button>

                    <button
                      onClick={async () => {
                        await deleteExperimentJournal(rec.id, userProfile?.id);
                        await deleteLabJournalFromMongo(rec.id);
                        setSavedRecords(prev => prev.filter(r => r.id !== rec.id));
                      }}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
