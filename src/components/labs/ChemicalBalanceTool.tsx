import React, { useState, useEffect, useMemo } from 'react';
import { 
  Scale, 
  Shield, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  FlaskConical, 
  Info, 
  Check, 
  ChevronRight,
  Maximize2,
  BookOpen
} from 'lucide-react';

export interface ChemicalBalanceReading {
  reagentName: string;
  formula: string;
  massGrams: number;
  tareVessel: string;
  targetMolarity: number;
  timestamp: string;
}

interface ChemicalBalanceProps {
  onLogToJournal?: (reading: ChemicalBalanceReading) => void;
  onOpenJournal?: () => void;
}

interface TareVessel {
  id: string;
  name: string;
  tareMass: number;
  description: string;
}

interface ChemicalReagent {
  id: string;
  name: string;
  formula: string;
  molarMass: number;
  nFactor: number;
  color: string;
  crystalStyle: string;
  description: string;
  ncertTopic: string;
  standardTarget250ml: number; // mass in grams for 250 mL of 0.1 M or 0.05 M
  targetMolarity: number;
}

const TARE_VESSELS: TareVessel[] = [
  { id: 'watch_glass', name: 'Glass Watch Glass', tareMass: 18.4215, description: 'Borosilicate shallow circular dish for crystalline solids' },
  { id: 'weighing_boat', name: 'Polystyrene Weighing Boat', tareMass: 2.1480, description: 'Anti-static flexible plastic boat with pour-spout' },
  { id: 'beaker_100', name: '100 mL Pyrex Beaker', tareMass: 52.3840, description: 'Standard laboratory weighing and dissolution beaker' },
  { id: 'weighing_paper', name: 'Glazed Weighing Paper', tareMass: 0.4120, description: 'Moisture-resistant smooth parchment paper' },
  { id: 'none', name: 'Direct Balance Pan', tareMass: 0.0000, description: 'Bare stainless steel weighing plate' }
];

const CHEMICAL_REAGENTS: ChemicalReagent[] = [
  {
    id: 'oxalic_acid',
    name: 'Oxalic Acid Dihydrate',
    formula: '(COOH)₂·2H₂O',
    molarMass: 126.07,
    nFactor: 2,
    color: '#e2e8f0',
    crystalStyle: 'bg-white border-slate-300 shadow-sm',
    description: 'Primary standard dibasic organic acid for titrations against KMnO₄ & standard alkali.',
    ncertTopic: 'NCERT Class 11 Practical Chemistry: Preparation of 0.1 M Oxalic Acid Standard Solution',
    standardTarget250ml: 3.1518,
    targetMolarity: 0.1000
  },
  {
    id: 'na2co3',
    name: 'Sodium Carbonate (Anhydrous)',
    formula: 'Na₂CO₃',
    molarMass: 105.99,
    nFactor: 2,
    color: '#f8fafc',
    crystalStyle: 'bg-slate-100 border-slate-200',
    description: 'Primary standard base for volumetric acidimetry (standardizing HCl or H₂SO₄).',
    ncertTopic: 'NCERT Class 11 Practical Chemistry: Preparation of 0.05 M (0.1 N) Sodium Carbonate',
    standardTarget250ml: 1.3249,
    targetMolarity: 0.0500
  },
  {
    id: 'cuso4',
    name: 'Copper(II) Sulfate Pentahydrate',
    formula: 'CuSO₄·5H₂O',
    molarMass: 249.68,
    nFactor: 2,
    color: '#06b6d4',
    crystalStyle: 'bg-cyan-500 border-cyan-400',
    description: 'Brilliant deep-blue crystalline solid for iodometric titrations and gravimetric assays.',
    ncertTopic: 'NCERT Class 12 Chemistry: Coordination Compounds & Redox Titrations',
    standardTarget250ml: 6.2420,
    targetMolarity: 0.1000
  },
  {
    id: 'kmno4',
    name: 'Potassium Permanganate',
    formula: 'KMnO₄',
    molarMass: 158.03,
    nFactor: 5,
    color: '#a855f7',
    crystalStyle: 'bg-purple-900 border-purple-600',
    description: 'Dark purple needle-shaped crystals with metallic luster; self-indicating strong oxidizing agent.',
    ncertTopic: 'NCERT Class 12 Practical Chemistry: Permanganometry of Ferrous Ammonium Sulfate',
    standardTarget250ml: 0.7902,
    targetMolarity: 0.0200
  },
  {
    id: 'nacl',
    name: 'Sodium Chloride (Analytical Grade)',
    formula: 'NaCl',
    molarMass: 58.44,
    nFactor: 1,
    color: '#f1f5f9',
    crystalStyle: 'bg-white border-slate-200',
    description: 'Analytical reagent grade cubic salt for argentometric titrations (Mohr method).',
    ncertTopic: 'NCERT Class 10 & 11: Solutions, Mole Concept and Stoichiometry',
    standardTarget250ml: 1.4610,
    targetMolarity: 0.1000
  },
  {
    id: 'k2cr2o7',
    name: 'Potassium Dichromate',
    formula: 'K₂Cr₂O₇',
    molarMass: 294.18,
    nFactor: 6,
    color: '#f97316',
    crystalStyle: 'bg-orange-600 border-orange-400',
    description: 'Bright orange crystalline primary standard oxidizer for redox titrations of Iron(II).',
    ncertTopic: 'NCERT Class 12 Chemistry: d-Block Elements & Dichromate Redox Titrations',
    standardTarget250ml: 1.2258,
    targetMolarity: 0.0167
  }
];

export const ChemicalBalanceTool: React.FC<ChemicalBalanceProps> = ({ onLogToJournal, onOpenJournal }) => {
  // Instrument Configuration
  const [draftShieldClosed, setDraftShieldClosed] = useState<boolean>(true);
  const [leastCountMode, setLeastCountMode] = useState<'analytical' | 'precision'>('analytical'); // 4 decimals vs 2 decimals
  const [unit, setUnit] = useState<'g' | 'mg' | 'oz' | 'ct'>('g');
  const [selectedVesselId, setSelectedVesselId] = useState<string>('watch_glass');
  const [selectedReagentId, setSelectedReagentId] = useState<string>('oxalic_acid');
  
  // Gravimetric Masses (in grams)
  const [reagentMassG, setReagentMassG] = useState<number>(0.0);
  const [taredGrossG, setTaredGrossG] = useState<number>(0.0);
  const [hasCalibWeight, setHasCalibWeight] = useState<boolean>(false);
  const [targetFlaskVolumeMl, setTargetFlaskVolumeMl] = useState<number>(250); // 100, 250, 500, 1000 mL
  const [journalLoggedNotice, setJournalLoggedNotice] = useState<string | null>(null);
  const [isPanHovered, setIsPanHovered] = useState<boolean>(false);

  // Air turbulence noise simulation when draft shield is open
  const [airTurbulence, setAirTurbulence] = useState<number>(0);

  useEffect(() => {
    if (draftShieldClosed) {
      setAirTurbulence(0);
      return;
    }
    const interval = setInterval(() => {
      // Small Gaussian-like noise ±0.0004 g
      const noise = (Math.random() - 0.5) * 0.0008;
      setAirTurbulence(Number(noise.toFixed(4)));
    }, 250);
    return () => clearInterval(interval);
  }, [draftShieldClosed]);

  const activeVessel = useMemo(() => {
    return TARE_VESSELS.find(v => v.id === selectedVesselId) || TARE_VESSELS[0];
  }, [selectedVesselId]);

  const activeReagent = useMemo(() => {
    return CHEMICAL_REAGENTS.find(r => r.id === selectedReagentId) || CHEMICAL_REAGENTS[0];
  }, [selectedReagentId]);

  // Actual physical gross mass currently resting on the balance pan
  const actualGrossMassG = useMemo(() => {
    const vesselWeight = activeVessel.tareMass;
    const chemicalWeight = reagentMassG;
    const testWeight = hasCalibWeight ? 100.0000 : 0.0;
    return vesselWeight + chemicalWeight + testWeight;
  }, [activeVessel, reagentMassG, hasCalibWeight]);

  // Net display reading after subtracting tared gross mass
  const netReadingG = useMemo(() => {
    const rawNet = actualGrossMassG - taredGrossG + airTurbulence;
    return Math.max(-999.9999, rawNet);
  }, [actualGrossMassG, taredGrossG, airTurbulence]);

  // Format reading according to current unit & least count
  const formattedDisplay = useMemo(() => {
    let converted = netReadingG;
    if (unit === 'mg') converted = netReadingG * 1000;
    else if (unit === 'oz') converted = netReadingG * 0.035274;
    else if (unit === 'ct') converted = netReadingG * 5.0;

    const decimals = leastCountMode === 'analytical' 
      ? (unit === 'mg' ? 1 : 4) 
      : (unit === 'mg' ? 0 : 2);

    return converted.toFixed(decimals);
  }, [netReadingG, unit, leastCountMode]);

  // Standard Solution Molarity Calculation: M = mass / (MolarMass * V(L))
  const solutionMolarity = useMemo(() => {
    if (reagentMassG <= 0) return '0.0000';
    const volL = targetFlaskVolumeMl / 1000;
    const moles = reagentMassG / activeReagent.molarMass;
    const m = moles / volL;
    return m.toFixed(4);
  }, [reagentMassG, targetFlaskVolumeMl, activeReagent]);

  const solutionNormality = useMemo(() => {
    const m = Number(solutionMolarity);
    return (m * activeReagent.nFactor).toFixed(4);
  }, [solutionMolarity, activeReagent]);

  // Handlers
  const handleTare = () => {
    setTaredGrossG(actualGrossMassG);
  };

  const handleZeroReset = () => {
    setReagentMassG(0);
    setTaredGrossG(0);
    setHasCalibWeight(false);
  };

  const handleAddReagent = (amountG: number) => {
    setReagentMassG(prev => Number(Math.max(0, prev + amountG).toFixed(4)));
  };

  // Quick preset to reach exact NCERT standard solution mass
  const handleSetExactNCERTTarget = () => {
    // Automatically tare vessel first if not tared
    setTaredGrossG(activeVessel.tareMass);
    setReagentMassG(activeReagent.standardTarget250ml);
    setTargetFlaskVolumeMl(250);
  };

  const handleLogToJournal = () => {
    const reading: ChemicalBalanceReading = {
      reagentName: activeReagent.name,
      formula: activeReagent.formula,
      massGrams: parseFloat(reagentMassG.toFixed(4)),
      tareVessel: activeVessel.name,
      targetMolarity: activeReagent.targetMolarity,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    if (onLogToJournal) {
      onLogToJournal(reading);
    }
    setJournalLoggedNotice(`Logged ${activeReagent.name} (${reagentMassG.toFixed(4)} g) to Experiment Journal`);
    setTimeout(() => setJournalLoggedNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-950/80 border border-white/10 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-amber-400" />
              <span>Analytical Chemistry &amp; Gravimetry Lab</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
              Calibrated 0.0001 g (0.1 mg)
            </span>
          </div>
          <h3 className="text-xl font-black text-white tracking-tight">
            Precision Digital Analytical Chemical Balance
          </h3>
          <p className="text-xs text-slate-400">
            Simulate real gravimetric weighing, tare zeroing, sliding draft shield air currents, and standard solution preparation.
          </p>
        </div>

        {/* Quick Mode Pill Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setLeastCountMode(leastCountMode === 'analytical' ? 'precision' : 'analytical')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              leastCountMode === 'analytical'
                ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            {leastCountMode === 'analytical' ? 'Analytical (0.0001 g)' : 'Precision (0.01 g)'}
          </button>

          <button
            onClick={() => setDraftShieldClosed(!draftShieldClosed)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              draftShieldClosed
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{draftShieldClosed ? 'Draft Shield: Closed' : 'Draft Shield: OPEN'}</span>
          </button>

          <button
            onClick={handleLogToJournal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            title="Append current gravimetric weighing data to Experiment Journal"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Record in Journal</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Digital Balance Physical Chamber & Glowing HUD */}
        <div className="lg:col-span-8 rounded-3xl bg-slate-950 border border-white/10 p-6 space-y-6 shadow-2xl relative overflow-hidden">
          {/* Journal Logged Banner Notification */}
          {journalLoggedNotice && (
            <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{journalLoggedNotice}</span>
              </div>
              {onOpenJournal && (
                <button
                  onClick={onOpenJournal}
                  className="text-[11px] font-mono text-cyan-300 hover:text-white underline font-bold cursor-pointer"
                >
                  View in Journal →
                </button>
              )}
            </div>
          )}

          {/* Draft Shield Indicator Banner */}
          {!draftShieldClosed && (
            <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-between text-xs text-amber-300 shadow-sm animate-in fade-in">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Air Current Notice:</strong> Glass draft doors are open! Room air turbulence causes microgram fluctuations (±0.0004 g). Close doors for ISO/NCERT analytical stability.
                </span>
              </div>
              <button
                onClick={() => setDraftShieldClosed(true)}
                className="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-bold text-[11px] shrink-0 hover:bg-amber-300 transition-colors cursor-pointer"
              >
                Close Doors
              </button>
            </div>
          )}

          {/* Physical Glass Chamber & Weighing Pan */}
          <div className="relative rounded-3xl bg-gradient-to-b from-[#0a0f24] to-[#040714] border-2 border-slate-700/60 p-8 flex flex-col items-center justify-center min-h-[340px] shadow-inner overflow-hidden">
            {/* Draft Shield Glass Reflections */}
            <div className="absolute inset-0 pointer-events-none border border-cyan-400/20 rounded-3xl bg-gradient-to-tr from-cyan-500/5 via-transparent to-white/5" />

            {/* Sliding Doors Handle Overlays */}
            <div className="absolute top-4 left-6 flex items-center gap-1.5 text-[10px] font-mono text-cyan-400/80">
              <Shield className="w-3.5 h-3.5" />
              <span>Left Glass Panel</span>
            </div>
            <div className="absolute top-4 right-6 flex items-center gap-1.5 text-[10px] font-mono text-cyan-400/80">
              <span>Right Glass Panel</span>
              <Shield className="w-3.5 h-3.5" />
            </div>

            {/* Spirit Level Bubble Indicator (Calibrated Balance Leveling) */}
            <div className="absolute top-4 flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-white/10 text-[10px] font-mono text-slate-300">
              <span>Spirit Level:</span>
              <div className="w-4 h-4 rounded-full border border-emerald-400 bg-emerald-950/60 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
              <span className="text-emerald-400 font-bold">Centered</span>
            </div>

            {/* Weighing Platform with Reagents & Vessels */}
            <div className="relative z-10 flex flex-col items-center mt-6">
              {/* Tare Vessel Graphic */}
              <div className="relative flex flex-col items-center justify-center">
                {/* Calibration 100g Test Weight if placed */}
                {hasCalibWeight && (
                  <div className="w-12 h-14 bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 rounded-t-lg border-2 border-amber-200 shadow-xl flex flex-col items-center justify-center text-slate-950 font-black text-[10px] mb-1 animate-bounce">
                    <span>100g</span>
                    <span className="text-[8px] font-mono">CLASS F1</span>
                  </div>
                )}

                {/* Vessel: Watch Glass */}
                {selectedVesselId === 'watch_glass' && (
                  <div className="w-48 h-12 rounded-b-full border-2 border-cyan-300/60 bg-gradient-to-b from-cyan-200/10 to-cyan-400/20 shadow-xl flex items-center justify-center relative overflow-hidden backdrop-blur-xs">
                    {/* Reagent powder inside watch glass */}
                    {reagentMassG > 0 && (
                      <div 
                        className="rounded-full shadow-lg transition-all duration-300 flex items-center justify-center border"
                        style={{
                          width: `${Math.min(140, 30 + reagentMassG * 20)}px`,
                          height: `${Math.min(22, 8 + reagentMassG * 3)}px`,
                          backgroundColor: activeReagent.color,
                          opacity: 0.9
                        }}
                      >
                        <span className="text-[9px] font-bold text-slate-900 drop-shadow-xs">
                          {activeReagent.formula}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Vessel: Weighing Boat */}
                {selectedVesselId === 'weighing_boat' && (
                  <div 
                    className="w-44 h-14 bg-slate-200/90 border-2 border-slate-300 shadow-xl flex items-center justify-center relative"
                    style={{ clipPath: 'polygon(10% 0%, 90% 0%, 80% 100%, 20% 100%)' }}
                  >
                    {reagentMassG > 0 && (
                      <div 
                        className="rounded-md shadow-md transition-all"
                        style={{
                          width: `${Math.min(100, 20 + reagentMassG * 15)}px`,
                          height: `${Math.min(24, 8 + reagentMassG * 3)}px`,
                          backgroundColor: activeReagent.color
                        }}
                      />
                    )}
                  </div>
                )}

                {/* Vessel: 100 mL Beaker */}
                {selectedVesselId === 'beaker_100' && (
                  <div className="w-36 h-28 border-2 border-cyan-400/50 rounded-b-2xl bg-cyan-950/20 backdrop-blur-xs flex flex-col justify-end p-2 relative">
                    <span className="text-[9px] font-mono text-cyan-300 absolute top-2 right-2">Pyrex 100mL</span>
                    {reagentMassG > 0 && (
                      <div 
                        className="w-full rounded-b-xl shadow-md transition-all"
                        style={{
                          height: `${Math.min(80, 10 + reagentMassG * 12)}px`,
                          backgroundColor: activeReagent.color,
                          opacity: 0.85
                        }}
                      />
                    )}
                  </div>
                )}

                {/* Vessel: Weighing Paper */}
                {selectedVesselId === 'weighing_paper' && (
                  <div className="w-40 h-8 bg-white/90 border border-slate-300 shadow-md rotate-1 flex items-center justify-center">
                    {reagentMassG > 0 && (
                      <div 
                        className="rounded-full transition-all"
                        style={{
                          width: `${Math.min(90, 20 + reagentMassG * 12)}px`,
                          height: '8px',
                          backgroundColor: activeReagent.color
                        }}
                      />
                    )}
                  </div>
                )}

                {/* Vessel: Direct Pan */}
                {selectedVesselId === 'none' && (
                  <div className="w-32 h-6 flex items-center justify-center">
                    {reagentMassG > 0 && (
                      <div 
                        className="rounded-full transition-all"
                        style={{
                          width: `${Math.min(70, 15 + reagentMassG * 10)}px`,
                          height: '6px',
                          backgroundColor: activeReagent.color
                        }}
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Stainless Steel Weighing Pan (Disc) */}
              <div className="w-56 h-4 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 rounded-full border border-slate-500 shadow-lg mt-1" />
              {/* Pan Support Stem */}
              <div className="w-8 h-10 bg-gradient-to-r from-slate-600 via-slate-400 to-slate-600 border border-slate-700 shadow-inner" />
              {/* Balance Base Collar */}
              <div className="w-64 h-3 bg-slate-800 rounded-t-lg border-t border-slate-600" />
            </div>

            {/* Live Chamber Status Tag */}
            <div className="absolute bottom-3 left-6 flex items-center gap-2 text-xs">
              <span className="text-slate-400">Vessel:</span>
              <strong className="text-white font-mono">{activeVessel.name}</strong>
              <span className="text-slate-500 text-[11px]">({activeVessel.tareMass.toFixed(4)} g)</span>
            </div>
            <div className="absolute bottom-3 right-6 flex items-center gap-2 text-xs">
              <span className="text-slate-400">Reagent:</span>
              <strong className="font-mono text-cyan-300">{activeReagent.name}</strong>
            </div>
          </div>

          {/* Glowing Green VFD / LCD Digital Weight HUD */}
          <div className="rounded-3xl bg-black border-2 border-emerald-500/40 p-6 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none" />

            {/* Main Numeric Display */}
            <div className="space-y-1 text-center md:text-left">
              <div className="flex items-center gap-3">
                {/* Stability Dot */}
                <div className="flex items-center gap-1.5">
                  <div className={`w-3 h-3 rounded-full ${draftShieldClosed ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${draftShieldClosed ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {draftShieldClosed ? 'STABLE' : 'UNSTABLE (DRAFT)'}
                  </span>
                </div>
                {/* Zero Center Tag */}
                {Math.abs(netReadingG) < 0.0001 && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 font-bold">
                    &gt;0&lt; CENTER ZERO
                  </span>
                )}
                {/* Net Indicator */}
                {taredGrossG > 0 && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-500/40 font-bold">
                    NET
                  </span>
                )}
              </div>

              {/* Huge Seven-Segment / Digital Weight Digits */}
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl lg:text-6xl font-black font-mono tracking-wider text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.4)]">
                  {formattedDisplay}
                </span>
                <span className="text-xl sm:text-2xl font-black font-mono text-emerald-300">
                  {unit}
                </span>
              </div>

              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-3">
                <span>Gross: <strong>{actualGrossMassG.toFixed(4)} g</strong></span>
                <span>•</span>
                <span>Tare Subtracted: <strong>{taredGrossG.toFixed(4)} g</strong></span>
              </div>
            </div>

            {/* Front Panel Keypad Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {/* TARE BUTTON */}
              <button
                onClick={handleTare}
                className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-lg active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                title="Deduct vessel weight and zero the balance reading"
              >
                <Scale className="w-4 h-4" />
                <span>TARE / ZERO</span>
              </button>

              {/* UNIT TOGGLE */}
              <button
                onClick={() => {
                  const units: ('g' | 'mg' | 'oz' | 'ct')[] = ['g', 'mg', 'oz', 'ct'];
                  const next = units[(units.indexOf(unit) + 1) % units.length];
                  setUnit(next);
                }}
                className="px-4 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-xs border border-white/15 transition-all cursor-pointer"
                title="Toggle display units (g, mg, oz, ct)"
              >
                UNIT ({unit.toUpperCase()})
              </button>

              {/* CALIBRATE 100g WEIGHT */}
              <button
                onClick={() => setHasCalibWeight(!hasCalibWeight)}
                className={`px-4 py-3.5 rounded-2xl font-mono font-bold text-xs border transition-all cursor-pointer ${
                  hasCalibWeight 
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300' 
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
                title="Place or remove certified 100.0000 g Class F1 calibration test weight"
              >
                {hasCalibWeight ? 'Remove 100g Weight' : '+ 100g Test Weight'}
              </button>

              {/* ZERO RESET ALL */}
              <button
                onClick={handleZeroReset}
                className="p-3.5 rounded-2xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-white/10 transition-colors cursor-pointer"
                title="Reset balance pan and chemical sample to 0"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Chemical Reagents, Spatula Dispenser & Molarity Calculator */}
        <div className="lg:col-span-4 space-y-6">
          {/* Tare Vessel Selector */}
          <div className="p-5 rounded-3xl bg-slate-950/80 border border-white/10 shadow-xl space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center justify-between">
              <span>1. Select Tare Vessel</span>
              <span className="text-[10px] text-slate-400">Step 1</span>
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {TARE_VESSELS.map(v => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVesselId(v.id)}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between text-xs ${
                    selectedVesselId === v.id
                      ? 'bg-amber-400/20 border-amber-400 text-white font-bold'
                      : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <div>
                    <div className="font-semibold">{v.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">Tare Mass: {v.tareMass.toFixed(4)} g</div>
                  </div>
                  {selectedVesselId === v.id && <Check className="w-4 h-4 text-amber-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Chemical Reagent Selector */}
          <div className="p-5 rounded-3xl bg-slate-950/80 border border-white/10 shadow-xl space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center justify-between">
              <span>2. Select Chemical Solid</span>
              <span className="text-[10px] text-slate-400">Step 2</span>
            </h4>
            <select
              value={selectedReagentId}
              onChange={e => setSelectedReagentId(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            >
              {CHEMICAL_REAGENTS.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.formula}) — {r.molarMass} g/mol
                </option>
              ))}
            </select>
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1 text-xs">
              <div className="flex items-center justify-between text-slate-300 font-mono text-[11px]">
                <span>Formula: <strong>{activeReagent.formula}</strong></span>
                <span>Mw: <strong>{activeReagent.molarMass} g/mol</strong></span>
              </div>
              <p className="text-[11px] text-slate-400">{activeReagent.description}</p>
            </div>
          </div>

          {/* Spatula Addition Controls */}
          <div className="p-5 rounded-3xl bg-slate-950/80 border border-white/10 shadow-xl space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center justify-between">
              <span>3. Spatula Reagent Dispensing</span>
              <span className="text-[10px] text-slate-400">Step 3</span>
            </h4>

            {/* Button grid for discrete additions */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleAddReagent(0.0050)}
                className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-300 border border-white/10 text-xs font-mono font-bold transition-all cursor-pointer text-center"
              >
                + 0.005 g (Micro Tip)
              </button>
              <button
                onClick={() => handleAddReagent(0.0500)}
                className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-300 border border-white/10 text-xs font-mono font-bold transition-all cursor-pointer text-center"
              >
                + 0.050 g (Spatula)
              </button>
              <button
                onClick={() => handleAddReagent(0.5000)}
                className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-300 border border-white/10 text-xs font-mono font-bold transition-all cursor-pointer text-center"
              >
                + 0.500 g (Full Scoop)
              </button>
              <button
                onClick={() => handleAddReagent(1.0000)}
                className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-300 border border-white/10 text-xs font-mono font-bold transition-all cursor-pointer text-center"
              >
                + 1.000 g (Bulk Spoon)
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleAddReagent(-0.1000)}
                className="flex-1 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all cursor-pointer"
              >
                - 0.100 g (Scrape Off)
              </button>
              <button
                onClick={() => setReagentMassG(0)}
                className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 text-xs transition-colors cursor-pointer"
              >
                Clear Powder
              </button>
            </div>

            {/* Quick NCERT Target Calibration Challenge */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">NCERT Practical Target:</span>
                <span className="font-mono text-amber-300 font-bold">
                  {activeReagent.standardTarget250ml.toFixed(4)} g
                </span>
              </div>
              <button
                onClick={handleSetExactNCERTTarget}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-slate-950 font-bold text-xs border border-amber-400/40 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Auto-Weigh NCERT Target ({activeReagent.standardTarget250ml} g)</span>
              </button>
            </div>
          </div>

          {/* Volumetric Solution Molarity Calculator */}
          <div className="p-5 rounded-3xl bg-slate-950/80 border border-white/10 shadow-xl space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400 flex items-center justify-between">
              <span>Standard Solution Preparation</span>
              <FlaskConical className="w-4 h-4 text-purple-400" />
            </h4>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-300">Volumetric Flask Capacity:</label>
              <div className="grid grid-cols-4 gap-1.5">
                {[100, 250, 500, 1000].map(vol => (
                  <button
                    key={vol}
                    onClick={() => setTargetFlaskVolumeMl(vol)}
                    className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      targetFlaskVolumeMl === vol
                        ? 'bg-purple-500 text-white shadow-sm'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    {vol} mL
                  </button>
                ))}
              </div>
            </div>

            {/* Real-time Molarity & Normality readout */}
            <div className="p-3.5 rounded-2xl bg-black/60 border border-purple-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Net Reagent Mass (w):</span>
                <span className="font-mono text-white font-bold">{reagentMassG.toFixed(4)} g</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Solution Molarity (M):</span>
                <span className="font-mono text-purple-300 font-extrabold text-sm">{solutionMolarity} M</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Solution Normality (N):</span>
                <span className="font-mono text-cyan-300 font-extrabold text-sm">{solutionNormality} N</span>
              </div>
              <div className="pt-2 border-t border-white/10 text-[10px] font-mono text-slate-400 leading-snug">
                M = w / (Mw × V) = {reagentMassG.toFixed(4)} / ({activeReagent.molarMass} × {(targetFlaskVolumeMl / 1000).toFixed(3)} L)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
