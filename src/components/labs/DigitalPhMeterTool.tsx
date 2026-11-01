import React, { useState, useMemo } from 'react';
import { 
  Gauge, 
  Thermometer, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Sliders, 
  FlaskConical, 
  Info, 
  Check, 
  Droplets,
  Sparkles,
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface PhSolution {
  id: string;
  name: string;
  category: 'acid' | 'neutral' | 'base' | 'buffer';
  nominalPh: number;
  color: string;
  bgRgba: string;
  description: string;
  hConc: string;
  ohConc: string;
  source: string;
}

const PH_SOLUTIONS_LIBRARY: PhSolution[] = [
  {
    id: 'buffer_7',
    name: 'NIST Buffer pH 7.00 (Zero-Point Calibration)',
    category: 'buffer',
    nominalPh: 7.00,
    color: '#22c55e',
    bgRgba: 'rgba(34, 197, 94, 0.25)',
    description: 'Equimolar potassium dihydrogen phosphate & disodium hydrogen phosphate standard.',
    hConc: '1.00 × 10⁻⁷ M',
    ohConc: '1.00 × 10⁻⁷ M',
    source: 'NIST Standard Reference Material'
  },
  {
    id: 'buffer_4',
    name: 'NIST Buffer pH 4.01 (Acidic Slope Calibration)',
    category: 'buffer',
    nominalPh: 4.01,
    color: '#f43f5e',
    bgRgba: 'rgba(244, 63, 94, 0.25)',
    description: '0.05 m Potassium hydrogen phthalate (KHP) acidic calibration standard.',
    hConc: '9.77 × 10⁻⁵ M',
    ohConc: '1.02 × 10⁻¹⁰ M',
    source: 'NIST Standard Reference Material'
  },
  {
    id: 'buffer_10',
    name: 'NIST Buffer pH 10.01 (Alkaline Slope Calibration)',
    category: 'buffer',
    nominalPh: 10.01,
    color: '#3b82f6',
    bgRgba: 'rgba(59, 130, 246, 0.25)',
    description: '0.025 m Sodium bicarbonate and 0.025 m sodium carbonate alkaline standard.',
    hConc: '9.77 × 10⁻¹¹ M',
    ohConc: '1.02 × 10⁻⁴ M',
    source: 'NIST Standard Reference Material'
  },
  {
    id: 'hcl_01',
    name: '0.10 M Hydrochloric Acid (HCl)',
    category: 'acid',
    nominalPh: 1.00,
    color: '#ef4444',
    bgRgba: 'rgba(239, 68, 68, 0.25)',
    description: 'Strong monoprotic mineral acid, completely dissociated [H⁺] = 0.1 M.',
    hConc: '1.00 × 10⁻¹ M',
    ohConc: '1.00 × 10⁻¹³ M',
    source: 'Laboratory Analytical Reagent'
  },
  {
    id: 'gastric',
    name: 'Human Gastric Juice (Stomach Acid)',
    category: 'acid',
    nominalPh: 1.80,
    color: '#f97316',
    bgRgba: 'rgba(249, 115, 22, 0.25)',
    description: 'Secreted by stomach parietal cells to activate pepsin for protein breakdown.',
    hConc: '1.58 × 10⁻² M',
    ohConc: '6.31 × 10⁻¹³ M',
    source: 'NCERT Class 10 Science: Life Processes'
  },
  {
    id: 'lemon',
    name: 'Fresh Lemon Juice (Citric Acid)',
    category: 'acid',
    nominalPh: 2.30,
    color: '#eab308',
    bgRgba: 'rgba(234, 179, 8, 0.25)',
    description: 'Natural triprotic organic acid (C₆H₈O₇) with Ka1 = 7.4 × 10⁻⁴.',
    hConc: '5.01 × 10⁻³ M',
    ohConc: '2.00 × 10⁻¹² M',
    source: 'NCERT Class 10: Acids, Bases and Salts'
  },
  {
    id: 'acetic_01',
    name: '0.10 M Acetic Acid (Vinegar / CH₃COOH)',
    category: 'acid',
    nominalPh: 2.88,
    color: '#eab308',
    bgRgba: 'rgba(234, 179, 8, 0.25)',
    description: 'Weak acid; Ka = 1.75 × 10⁻⁵, [H⁺] = √(Ka·C) = 1.32 × 10⁻³ M.',
    hConc: '1.32 × 10⁻³ M',
    ohConc: '7.58 × 10⁻¹² M',
    source: 'NCERT Class 11 Chemistry: Chemical Equilibrium'
  },
  {
    id: 'coffee',
    name: 'Black Coffee Extract',
    category: 'acid',
    nominalPh: 5.00,
    color: '#78350f',
    bgRgba: 'rgba(120, 53, 15, 0.25)',
    description: 'Mildly acidic beverage containing chlorogenic and caffeic acids.',
    hConc: '1.00 × 10⁻⁵ M',
    ohConc: '1.00 × 10⁻⁹ M',
    source: 'Household Food Sample'
  },
  {
    id: 'water',
    name: 'Pure Deionized Distilled Water (H₂O)',
    category: 'neutral',
    nominalPh: 7.00,
    color: '#06b6d4',
    bgRgba: 'rgba(6, 182, 212, 0.2)',
    description: 'Self-ionizing neutral solvent; Kw = [H⁺][OH⁻] = 1.0 × 10⁻¹⁴ at 25°C.',
    hConc: '1.00 × 10⁻⁷ M',
    ohConc: '1.00 × 10⁻⁷ M',
    source: 'Laboratory Solvent Standard'
  },
  {
    id: 'blood',
    name: 'Human Blood Plasma (Physiological Buffer)',
    category: 'neutral',
    nominalPh: 7.40,
    color: '#dc2626',
    bgRgba: 'rgba(220, 38, 38, 0.25)',
    description: 'Regulated within 7.35–7.45 by carbonic acid/bicarbonate buffer system.',
    hConc: '3.98 × 10⁻⁸ M',
    ohConc: '2.51 × 10⁻⁷ M',
    source: 'NCERT Class 11 Biology: Body Fluids & Circulation'
  },
  {
    id: 'sea_water',
    name: 'Natural Oceanic Sea Water',
    category: 'base',
    nominalPh: 8.15,
    color: '#0284c7',
    bgRgba: 'rgba(2, 132, 199, 0.25)',
    description: 'Alkaline marine water buffered by dissolved borates and carbonates.',
    hConc: '7.08 × 10⁻⁹ M',
    ohConc: '1.41 × 10⁻⁶ M',
    source: 'Environmental Oceanography'
  },
  {
    id: 'milk_magnesia',
    name: 'Milk of Magnesia (Mg(OH)₂ Suspension)',
    category: 'base',
    nominalPh: 10.50,
    color: '#3b82f6',
    bgRgba: 'rgba(59, 130, 246, 0.25)',
    description: 'Mild antacid base sparingly soluble in water, neutralizing gastric HCl.',
    hConc: '3.16 × 10⁻¹¹ M',
    ohConc: '3.16 × 10⁻⁴ M',
    source: 'NCERT Class 10: Acids, Bases & Antacids'
  },
  {
    id: 'ammonia_01',
    name: '0.10 M Aqueous Ammonia (NH₃·H₂O)',
    category: 'base',
    nominalPh: 11.13,
    color: '#6366f1',
    bgRgba: 'rgba(99, 102, 241, 0.25)',
    description: 'Weak volatile base; Kb = 1.8 × 10⁻⁵, [OH⁻] = √(Kb·C) = 1.34 × 10⁻³ M.',
    hConc: '7.46 × 10⁻¹² M',
    ohConc: '1.34 × 10⁻³ M',
    source: 'Laboratory Analytical Reagent'
  },
  {
    id: 'naoh_01',
    name: '0.10 M Sodium Hydroxide (NaOH)',
    category: 'base',
    nominalPh: 13.00,
    color: '#a855f7',
    bgRgba: 'rgba(168, 85, 247, 0.25)',
    description: 'Strong alkali; completely dissociated [OH⁻] = 0.1 M, pOH = 1.0, pH = 13.0.',
    hConc: '1.00 × 10⁻¹³ M',
    ohConc: '1.00 × 10⁻¹ M',
    source: 'Laboratory Analytical Standard'
  }
];

interface DigitalPhMeterProps {
  onLogToJournal?: (reading: {
    solutionName: string;
    ph: number;
    tempC: number;
    emfMv: string;
    hConc: string;
    timestamp: string;
  }) => void;
  onOpenJournal?: () => void;
}

export const DigitalPhMeterTool: React.FC<DigitalPhMeterProps> = ({ onLogToJournal, onOpenJournal }) => {
  // Meter states
  const [selectedSolutionId, setSelectedSolutionId] = useState<string>('water');
  const [electrodeState, setElectrodeState] = useState<'submerged' | 'air'>('submerged');
  const [temperatureC, setTemperatureC] = useState<number>(25.0); // 0 to 80 °C
  const [isCalibrated, setIsCalibrated] = useState<boolean>(true);
  const [calibStep, setCalibStep] = useState<number>(3); // 3 = fully calibrated with 4, 7, 10
  const [slopeEfficiency, setSlopeEfficiency] = useState<number>(98.6); // percentage (ideal 100%)
  const [rinseMessage, setRinseMessage] = useState<string | null>(null);
  const [journalLoggedNotice, setJournalLoggedNotice] = useState<string | null>(null);
  const [isGaugeHovered, setIsGaugeHovered] = useState<boolean>(false);

  // Custom Solution Simulator States
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [customType, setCustomType] = useState<'strong_acid' | 'weak_acid' | 'strong_base' | 'weak_base'>('weak_acid');
  const [customConcM, setCustomConcM] = useState<number>(0.05);
  const [customPka, setCustomPka] = useState<number>(4.75);

  const activeSolution = useMemo(() => {
    return PH_SOLUTIONS_LIBRARY.find(s => s.id === selectedSolutionId) || PH_SOLUTIONS_LIBRARY[0];
  }, [selectedSolutionId]);

  // Nernst Equation slope calculation: S = 2.3026 * R * T / F
  // At 25°C = 59.16 mV/pH
  const nernstSlopeMv = useMemo(() => {
    const tempK = 273.15 + temperatureC;
    const idealSlope = 0.1984 * tempK; // in mV/pH
    return idealSlope * (slopeEfficiency / 100);
  }, [temperatureC, slopeEfficiency]);

  // Actual pH calculation
  const calculatedPh = useMemo(() => {
    if (electrodeState === 'air') return 7.00; // in air/dry, indeterminate

    if (isCustomMode) {
      if (customType === 'strong_acid') {
        return Math.max(0.0, Math.min(14.0, -Math.log10(customConcM)));
      } else if (customType === 'strong_base') {
        const pOh = -Math.log10(customConcM);
        return Math.max(0.0, Math.min(14.0, 14.0 - pOh));
      } else if (customType === 'weak_acid') {
        // pH = 0.5 * (pKa - log10(C))
        const ph = 0.5 * (customPka - Math.log10(customConcM));
        return Math.max(0.0, Math.min(14.0, ph));
      } else {
        // weak base: pOH = 0.5 * (pKb - log10(C)), pH = 14 - pOH
        const pKb = customPka; // using same slider for pKb
        const pOh = 0.5 * (pKb - Math.log10(customConcM));
        return Math.max(0.0, Math.min(14.0, 14.0 - pOh));
      }
    }

    // Standard solution nominal pH with slight temperature dependency:
    // Temperature effect on neutral water Kw: at 0°C pH 7.47, at 25°C pH 7.00, at 50°C pH 6.63
    let ph = activeSolution.nominalPh;
    if (activeSolution.category === 'neutral') {
      const deltaT = temperatureC - 25.0;
      ph = ph - deltaT * 0.015;
    }
    return Math.max(0.0, Math.min(14.0, Number(ph.toFixed(2))));
  }, [electrodeState, isCustomMode, customType, customConcM, customPka, activeSolution, temperatureC]);

  // Cell Potential EMF in mV: E = - S * (pH - 7.00)
  const cellPotentialMv = useMemo(() => {
    if (electrodeState === 'air') return '+0.0';
    const emf = -nernstSlopeMv * (calculatedPh - 7.00);
    return emf > 0 ? `+${emf.toFixed(1)}` : emf.toFixed(1);
  }, [electrodeState, nernstSlopeMv, calculatedPh]);

  // Concentration strings
  const currentHConc = useMemo(() => {
    const h = Math.pow(10, -calculatedPh);
    return h.toExponential(2) + ' M';
  }, [calculatedPh]);

  const currentOhConc = useMemo(() => {
    const pOh = 14.0 - calculatedPh;
    const oh = Math.pow(10, -pOh);
    return oh.toExponential(2) + ' M';
  }, [calculatedPh]);

  // Handlers
  const handleRinseElectrode = () => {
    setElectrodeState('air');
    setRinseMessage('Electrode rinsed with deionized water spray & blotted with lint-free tissue.');
    setTimeout(() => {
      setElectrodeState('submerged');
      setRinseMessage(null);
    }, 1500);
  };

  const handleRunCalibrationWizard = () => {
    setIsCalibrated(false);
    setCalibStep(1);
    setSelectedSolutionId('buffer_7');
    setTimeout(() => {
      setCalibStep(2);
      setSelectedSolutionId('buffer_4');
      setTimeout(() => {
        setCalibStep(3);
        setSelectedSolutionId('buffer_10');
        setIsCalibrated(true);
        setSlopeEfficiency(99.2);
      }, 1000);
    }, 1000);
  };

  // Rotating Galvanometer Needle Angle:
  // -65 deg (Strong Acid pH 0) -> 0 deg (Neutral pH 7) -> +65 deg (Strong Base pH 14)
  const needleAngle = useMemo(() => {
    if (electrodeState === 'air') return 0;
    const clampedPh = Math.max(0, Math.min(14, calculatedPh));
    return Number((((clampedPh - 7) / 7) * 65).toFixed(1));
  }, [calculatedPh, electrodeState]);

  const handleSendToJournal = () => {
    const reading = {
      solutionName: isCustomMode ? `Custom ${customType.replace('_', ' ')} (${customConcM} M)` : activeSolution.name,
      ph: calculatedPh,
      tempC: temperatureC,
      emfMv: cellPotentialMv,
      hConc: currentHConc,
      timestamp: new Date().toLocaleTimeString(),
    };
    if (onLogToJournal) {
      onLogToJournal(reading);
    }
    setJournalLoggedNotice(`Logged pH ${calculatedPh.toFixed(2)} to Experiment Journal`);
    setTimeout(() => setJournalLoggedNotice(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-950/80 border border-white/10 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-cyan-400" />
              <span>Electrochemistry &amp; Solution Equilibrium Lab</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 font-bold border border-cyan-400/30">
              3-Point NIST Calibrated
            </span>
          </div>
          <h3 className="text-xl font-black text-white tracking-tight">
            Calibrated Digital Benchtop pH Meter &amp; Potentiometer
          </h3>
          <p className="text-xs text-slate-400">
            Simulate real glass combination electrode potentiometry, Nernst equation EMF in mV, automatic temperature compensation (ATC), and NIST buffer calibrations.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleRunCalibrationWizard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Calibrate (NIST 4/7/10)</span>
          </button>

          <button
            onClick={handleRinseElectrode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-semibold transition-all cursor-pointer"
          >
            <Droplets className="w-3.5 h-3.5 text-cyan-400" />
            <span>Rinse Probe (DI Water)</span>
          </button>

          <button
            onClick={handleSendToJournal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            title="Append current pH and EMF potentiometric readings to Experiment Journal"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Record in Journal</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Digital Benchtop Instrument Chassis & Electrode Beaker */}
        <div className="lg:col-span-8 rounded-3xl bg-slate-950 border border-white/10 p-6 space-y-6 shadow-2xl">
          {/* Temporary Rinse Banner Notification */}
          {rinseMessage && (
            <div className="p-3 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 text-xs flex items-center gap-2 animate-in fade-in">
              <Droplets className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{rinseMessage}</span>
            </div>
          )}

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

          {/* Visual Electrochemical Cell & Beaker */}
          <div className="relative rounded-3xl bg-gradient-to-b from-[#0a0f24] to-[#040714] border-2 border-slate-700/60 p-8 flex flex-col md:flex-row items-center justify-around gap-8 min-h-[340px] shadow-inner overflow-hidden">
            {/* Background Beaker Glass Lighting */}
            <div className="absolute inset-0 pointer-events-none bg-radial from-cyan-500/5 to-transparent" />

            {/* Glass Beaker with Solution & Submerged Electrode */}
            <div className="relative flex flex-col items-center">
              {/* Electrode Stand Arm */}
              <div className="absolute -top-10 flex flex-col items-center z-20">
                <div className="w-2 h-16 bg-slate-500 rounded-full" />
                <div className="w-16 h-3 bg-slate-700 rounded-full border border-slate-500 shadow-md" />
              </div>

              {/* Glass Combination Electrode Shaft */}
              <div 
                className={`relative z-20 transition-all duration-500 flex flex-col items-center ${
                  electrodeState === 'air' ? '-translate-y-16 opacity-75' : 'translate-y-4'
                }`}
              >
                {/* Electrode Cable */}
                <div className="w-1.5 h-8 bg-slate-900 border-x border-slate-600" />
                {/* Electrode Cap */}
                <div className="w-6 h-6 bg-blue-600 rounded-t-lg border border-blue-400 shadow-md" />
                {/* Epoxy Body Shaft */}
                <div className="w-4 h-28 bg-gradient-to-r from-blue-900 via-blue-950 to-blue-900 border-x border-blue-400/60 relative">
                  {/* Internal Reference Ag/AgCl Wire */}
                  <div className="w-0.5 h-20 bg-slate-200 mx-auto mt-2" />
                  <span className="text-[7px] font-mono text-cyan-300 absolute bottom-2 left-0.5">Ag/AgCl</span>
                </div>
                {/* Temperature Pt1000 Probe (Parallel wire) */}
                <div className="w-2 h-20 bg-amber-600/70 absolute -right-3 top-10 rounded-full" />
                {/* Glass Sensing Bulb (pH sensitive lithium glass) */}
                <div className="w-5 h-5 rounded-full bg-cyan-200/90 border-2 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.6)] animate-pulse" />
              </div>

              {/* 250 mL Glass Beaker */}
              <div className="w-52 h-44 border-4 border-slate-500/70 rounded-b-3xl bg-slate-900/40 relative overflow-hidden flex flex-col justify-end shadow-2xl backdrop-blur-xs mt-2">
                {/* Beaker Volume Graduations */}
                <div className="absolute top-4 left-3 space-y-4 pointer-events-none opacity-40 text-[9px] font-mono text-white">
                  <div>— 200 mL</div>
                  <div>— 150 mL</div>
                  <div>— 100 mL</div>
                  <div>— 50 mL</div>
                </div>

                {/* Solution Fluid Fill */}
                <div 
                  className="w-full h-32 transition-all duration-500 flex items-center justify-center relative"
                  style={{ backgroundColor: activeSolution.bgRgba }}
                >
                  <div className="text-center px-4 z-10">
                    <span className="text-xs font-bold text-white drop-shadow-md">
                      {isCustomMode ? 'Custom Test Analyte' : activeSolution.name}
                    </span>
                    <div className="text-[10px] font-mono text-white/80 mt-0.5">
                      {isCustomMode ? `${customConcM} M Solution` : activeSolution.source}
                    </div>
                  </div>
                </div>
              </div>

              {/* Magnetic Stirrer Base */}
              <div className="w-60 h-6 bg-slate-800 rounded-b-xl border-t border-slate-600 shadow-md flex items-center justify-between px-6 text-[9px] font-mono text-slate-400">
                <span>Magnetic Stirrer: OFF</span>
                <span className="text-emerald-400">Temp: {temperatureC.toFixed(1)}°C</span>
              </div>
            </div>

            {/* Glowing Benchtop Display Console */}
            <div className="w-full md:w-80 rounded-3xl bg-black border-2 border-cyan-500/40 p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
                    BENCHTOP pH-2026 ATC
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold">
                  {electrodeState === 'air' ? 'PROBE IN AIR' : 'MEASURING'}
                </span>
              </div>

              {/* Main Dual LCD Readout */}
              <div className="space-y-1 text-center py-2">
                <div className="text-xs font-mono text-slate-400">Measured Solution pH:</div>
                <div className="text-5xl sm:text-6xl font-black font-mono tracking-wider text-cyan-300 drop-shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                  {electrodeState === 'air' ? '---' : calculatedPh.toFixed(2)}
                </div>
                <div className="flex items-center justify-center gap-4 text-xs font-mono text-slate-300 pt-1">
                  <span>EMF: <strong className="text-cyan-400">{cellPotentialMv} mV</strong></span>
                  <span>•</span>
                  <span>Temp: <strong className="text-amber-400">{temperatureC.toFixed(1)} °C</strong></span>
                </div>
              </div>

              {/* ANALOG ROTATING NEEDLE POTENTIOMETER GAUGE */}
              <div 
                onMouseEnter={() => setIsGaugeHovered(true)}
                onMouseLeave={() => setIsGaugeHovered(false)}
                className="relative p-3.5 rounded-2xl bg-[#030712] border border-cyan-500/30 hover:border-cyan-400/70 transition-all duration-300 overflow-hidden group/gauge shadow-inner cursor-pointer"
              >
                {/* Glass Dial Anti-Glare Reflection Sweep */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-cyan-400/10 opacity-30 group-hover/gauge:opacity-75 transition-opacity duration-300" />

                <div className="flex items-center justify-between text-[9px] font-mono font-bold tracking-wider mb-0.5">
                  <span className="text-rose-400">0 ACID</span>
                  <span className="text-emerald-400">7 NEUTRAL</span>
                  <span className="text-purple-400">14 BASE</span>
                </div>

                {/* Arc Gauge with Rotating Needle */}
                <div className="relative h-20 w-full flex items-end justify-center overflow-visible">
                  <svg viewBox="0 0 200 95" className="w-48 h-20 overflow-visible">
                    <defs>
                      <linearGradient id="phNeedleGaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="35%" stopColor="#f59e0b" />
                        <stop offset="50%" stopColor="#10b981" />
                        <stop offset="70%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 25 85 A 75 75 0 0 1 175 85"
                      fill="none"
                      stroke="#1e293b"
                      strokeWidth="10"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 25 85 A 75 75 0 0 1 175 85"
                      fill="none"
                      stroke="url(#phNeedleGaugeGradient)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      className="opacity-90"
                    />
                    {[0, 2, 4, 6, 7, 8, 10, 12, 14].map(val => {
                      const rad = (((val - 7) / 7) * 65) * (Math.PI / 180);
                      const x1 = 100 + 66 * Math.sin(rad);
                      const y1 = 85 - 66 * Math.cos(rad);
                      const x2 = 100 + 76 * Math.sin(rad);
                      const y2 = 85 - 76 * Math.cos(rad);
                      return (
                        <line
                          key={val}
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke={val === 7 ? '#10b981' : '#94a3b8'}
                          strokeWidth={val === 7 ? '2' : '1'}
                        />
                      );
                    })}
                  </svg>

                  {/* MECHANICAL ROTATING NEEDLE WITH DYNAMIC HOVER SENSITIVITY */}
                  <div 
                    className="absolute bottom-0 w-1 h-18 bg-gradient-to-t from-cyan-400 via-white to-rose-400 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.9)] origin-bottom transition-transform duration-500 ease-out will-change-transform"
                    style={{
                      transform: `rotate(${needleAngle + (isGaugeHovered ? 1.5 : 0)}deg)`,
                      transformOrigin: '50% 100%',
                      boxShadow: isGaugeHovered ? '0 0 16px rgba(6,182,212,1), 0 0 6px #fff' : '0 0 10px rgba(6,182,212,0.9)'
                    }}
                  >
                    <div className="w-2.5 h-2.5 bg-rose-500 rounded-full absolute -top-1 -left-[3px] shadow-[0_0_8px_#f43f5e] transition-transform duration-300 group-hover/gauge:scale-125" />
                  </div>

                  {/* Center Pivot Hub */}
                  <div className="absolute -bottom-1 w-5 h-5 rounded-full bg-slate-800 border-2 border-cyan-400 shadow-md flex items-center justify-center z-10">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-1">
                  <span>Galvanometric Dial:</span>
                  <span className={`font-bold transition-colors ${isGaugeHovered ? 'text-emerald-300' : 'text-cyan-300'}`}>
                    {needleAngle > 0 ? `+${needleAngle}°` : `${needleAngle}°`} {isGaugeHovered && '⚡ Active Flux'}
                  </span>
                </div>
              </div>

              {/* Electrode Health & Slope */}
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-white/10 space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Electrode Slope:</span>
                  <span className="text-emerald-400 font-bold">{nernstSlopeMv.toFixed(2)} mV/pH</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Slope Efficiency:</span>
                  <span className="text-emerald-300 font-bold">{slopeEfficiency}% (Excellent)</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Calibration:</span>
                  <span className="text-cyan-300 font-bold">
                    {calibStep === 3 ? '3-Point (pH 4, 7, 10)' : `Step ${calibStep}/3`}
                  </span>
                </div>
              </div>

              {/* Arm Position Toggle Button */}
              <button
                onClick={() => setElectrodeState(electrodeState === 'submerged' ? 'air' : 'submerged')}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  electrodeState === 'submerged'
                    ? 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40'
                    : 'bg-amber-400 text-slate-950 font-black shadow-lg animate-bounce'
                }`}
              >
                {electrodeState === 'submerged' ? 'Raise Electrode Arm (To Rinse)' : 'Submerge Electrode in Solution'}
              </button>

              {/* Send Reading to Experiment Journal */}
              <div className="pt-1 space-y-1.5">
                <button
                  onClick={handleSendToJournal}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-95 text-slate-950 text-xs font-black transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-3.5 h-3.5 text-slate-950" />
                  <span>Log Reading to Experiment Journal</span>
                </button>
                {journalLoggedNotice && (
                  <div className="text-center text-[10px] font-mono text-emerald-400 font-bold animate-in fade-in">
                    ✓ {journalLoggedNotice}
                  </div>
                )}
                {onOpenJournal && (
                  <button
                    onClick={onOpenJournal}
                    className="w-full text-center text-[11px] text-cyan-400 hover:text-cyan-300 underline font-semibold cursor-pointer pt-0.5"
                  >
                    Open Experiment Journal →
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Color Spectrum Indicator Bar */}
          <div className="p-5 rounded-3xl bg-slate-950 border border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-rose-400 font-bold">Acidic (pH 0–6)</span>
              <span className="text-emerald-400 font-bold">Neutral (pH 7)</span>
              <span className="text-purple-400 font-bold">Alkaline / Basic (pH 8–14)</span>
            </div>

            {/* Gradient Bar */}
            <div className="relative h-5 rounded-full bg-gradient-to-r from-rose-600 via-amber-400 via-emerald-500 via-cyan-500 to-purple-600 shadow-inner">
              {/* Indicator Arrow at calculated pH */}
              <div 
                className="absolute -top-1 w-4 h-7 bg-white rounded border-2 border-black shadow-xl -translate-x-1/2 transition-all duration-300"
                style={{ left: `${Math.max(2, Math.min(98, (calculatedPh / 14) * 100))}%` }}
              />
            </div>

            {/* Chemical Ion Concentrations Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Hydronium Ion [H⁺]</span>
                <div className="text-xs font-mono font-bold text-rose-300">{currentHConc}</div>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Hydroxide Ion [OH⁻]</span>
                <div className="text-xs font-mono font-bold text-cyan-300">{currentOhConc}</div>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase">pOH Complement</span>
                <div className="text-xs font-mono font-bold text-purple-300">{(14.0 - calculatedPh).toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Solution Pickers, Custom Analyzer & Temperature ATC */}
        <div className="lg:col-span-4 space-y-6">
          {/* Solution Selector Mode Toggle */}
          <div className="p-5 rounded-3xl bg-slate-950/80 border border-white/10 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                1. Select Solution to Test
              </h4>
              <button
                onClick={() => setIsCustomMode(!isCustomMode)}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  isCustomMode
                    ? 'bg-emerald-400 text-slate-950 border-emerald-400'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                }`}
              >
                {isCustomMode ? 'Custom Mode: ON' : 'Switch to Custom Mode'}
              </button>
            </div>

            {!isCustomMode ? (
              <div className="space-y-2">
                <select
                  value={selectedSolutionId}
                  onChange={e => setSelectedSolutionId(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <optgroup label="Standard NIST Calibration Buffers">
                    <option value="buffer_7">NIST Buffer pH 7.00</option>
                    <option value="buffer_4">NIST Buffer pH 4.01</option>
                    <option value="buffer_10">NIST Buffer pH 10.01</option>
                  </optgroup>
                  <optgroup label="Laboratory Acids & Bases">
                    <option value="hcl_01">0.10 M HCl (Strong Acid)</option>
                    <option value="acetic_01">0.10 M CH₃COOH (Vinegar)</option>
                    <option value="water">Pure Deionized Water (Neutral)</option>
                    <option value="ammonia_01">0.10 M NH₃ (Weak Base)</option>
                    <option value="naoh_01">0.10 M NaOH (Strong Base)</option>
                  </optgroup>
                  <optgroup label="Biological & Everyday Samples">
                    <option value="gastric">Human Gastric Juice (Stomach)</option>
                    <option value="lemon">Fresh Lemon Juice</option>
                    <option value="coffee">Black Coffee</option>
                    <option value="blood">Human Blood Plasma (7.40)</option>
                    <option value="sea_water">Sea Water</option>
                    <option value="milk_magnesia">Milk of Magnesia (Antacid)</option>
                  </optgroup>
                </select>

                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <strong className="text-white">{activeSolution.name}</strong>
                    <span className="font-mono text-cyan-300 font-bold">pH {activeSolution.nominalPh}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{activeSolution.description}</p>
                  <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-white/5">
                    Source: {activeSolution.source}
                  </div>
                </div>
              </div>
            ) : (
              /* Custom Solution Parameter Sliders */
              <div className="space-y-4 pt-1">
                <div>
                  <label className="text-[11px] text-slate-300 font-semibold mb-1 block">Electrolyte Type:</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(['strong_acid', 'weak_acid', 'strong_base', 'weak_base'] as const).map(t => (
                      <button
                        key={t}
                        onClick={() => setCustomType(t)}
                        className={`py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          customType === t 
                            ? 'bg-cyan-500 text-slate-950 font-black' 
                            : 'bg-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        {t === 'strong_acid' ? 'Strong Acid' : t === 'weak_acid' ? 'Weak Acid' : t === 'strong_base' ? 'Strong Base' : 'Weak Base'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Concentration Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Molar Concentration:</span>
                    <span className="font-mono text-cyan-300 font-bold">{customConcM} M</span>
                  </div>
                  <input
                    type="range"
                    min="0.001"
                    max="1.0"
                    step="0.005"
                    value={customConcM}
                    onChange={e => setCustomConcM(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                {/* pKa / pKb Slider for weak electrolytes */}
                {(customType === 'weak_acid' || customType === 'weak_base') && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>{customType === 'weak_acid' ? 'Acid Dissociation pKa:' : 'Base Dissociation pKb:'}</span>
                      <span className="font-mono text-amber-300 font-bold">{customPka.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="1.5"
                      max="10.0"
                      step="0.05"
                      value={customPka}
                      onChange={e => setCustomPka(Number(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Automatic Temperature Compensation (ATC) Controller */}
          <div className="p-5 rounded-3xl bg-slate-950/80 border border-white/10 shadow-xl space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center justify-between">
              <span>2. Temperature Sensor (Pt1000 ATC)</span>
              <Thermometer className="w-4 h-4 text-amber-400" />
            </h4>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Solution Temperature:</span>
                <span className="font-mono text-amber-300 font-bold">{temperatureC.toFixed(1)} °C ({(273.15 + temperatureC).toFixed(1)} K)</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="80.0"
                step="0.5"
                value={temperatureC}
                onChange={e => setTemperatureC(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>0 °C (Ice Bath)</span>
                <span>25 °C (Standard)</span>
                <span>80 °C (Hot)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/60 border border-amber-500/30 space-y-1.5 text-xs">
              <span className="text-[10px] font-mono text-amber-300 font-bold uppercase">
                Nernst Equation Temperature Dependency
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Slope changes with temperature: <strong>S = 0.1984 × (273.15 + T) = {nernstSlopeMv.toFixed(2)} mV/pH</strong>.
                At 25°C, 1 pH unit = 59.16 mV; at 50°C, 1 pH unit = 64.12 mV.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
