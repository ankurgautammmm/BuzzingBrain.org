import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Zap, 
  FlaskConical, 
  Eye, 
  Heart, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  Activity, 
  Sliders, 
  Layers, 
  Maximize2,
  Database,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { saveLabJournalToMongo } from '../../services/mongoStorage';
import { UserProfile } from '../../types';

interface InteractiveQuickWorkbenchProps {
  userProfile?: UserProfile | null;
  onRecordReading?: (reading: {
    tool: 'circuit' | 'titration' | 'microscope' | 'cardiac';
    data: any;
  }) => void;
  onNavigateTab?: (tab: 'virtual_academy' | 'organs3d' | 'virtual_tools' | 'journal') => void;
}

// Web Audio API tactile sound synthesizer
function playLabSound(type: 'click' | 'drip' | 'spark' | 'chime' | 'switch', enabled: boolean = true) {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'drip') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(550, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.08);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'spark') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(440, now + 0.03);
      osc.frequency.setValueAtTime(880, now + 0.06);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.13);
    } else if (type === 'chime') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.08);
      osc.frequency.setValueAtTime(783.99, now + 0.16);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.36);
    } else if (type === 'switch') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(140, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.03);
      osc.start(now);
      osc.stop(now + 0.04);
    }
  } catch {
    // Ignore audio autoplay restrictions
  }
}

export const InteractiveQuickWorkbench: React.FC<InteractiveQuickWorkbenchProps> = ({
  userProfile,
  onRecordReading,
  onNavigateTab
}) => {
  // Active Station
  const [activeStation, setActiveStation] = useState<'physics' | 'chemistry' | 'biology' | 'anatomy'>('physics');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // =========================================================================
  // 1. PHYSICS OHM'S LAW CIRCUIT STATE
  // =========================================================================
  const [voltage, setVoltage] = useState(6.0); // Volts (1 to 12)
  const [resistance, setResistance] = useState(5.0); // Ohms (1 to 25)
  const [circuitClosed, setCircuitClosed] = useState(true);

  const current = circuitClosed ? Number((voltage / resistance).toFixed(3)) : 0;
  const power = circuitClosed ? Number((voltage * current).toFixed(3)) : 0;
  const jouleHeating = circuitClosed ? Number((current * current * resistance).toFixed(2)) : 0;

  // Voltmeter needle rotation angle (-60 deg to +60 deg)
  const voltAngle = useMemo(() => {
    const fraction = circuitClosed ? Math.min(1, voltage / 12) : 0;
    return -60 + fraction * 120;
  }, [voltage, circuitClosed]);

  // Ammeter needle rotation angle (-60 deg to +60 deg for 0 to 4A)
  const ampAngle = useMemo(() => {
    const fraction = circuitClosed ? Math.min(1, current / 3.0) : 0;
    return -60 + fraction * 120;
  }, [current, circuitClosed]);

  // =========================================================================
  // 2. CHEMISTRY ACID-BASE TITRATION & pH STATE
  // =========================================================================
  const [dropsCount, setDropsCount] = useState(0); // drops of 0.1 M NaOH
  const [isDrippingAuto, setIsDrippingAuto] = useState(false);

  // Each drop adds 0.05 mL of 0.1 M NaOH to 10 mL of 0.1 M HCl
  const titrantMl = useMemo(() => Number((dropsCount * 0.05).toFixed(2)), [dropsCount]);

  const chemPh = useMemo(() => {
    const initialHclMoles = (10 / 1000) * 0.1;
    const addedNaohMoles = (titrantMl / 1000) * 0.1;
    const totalVolumeL = (10 + titrantMl) / 1000;

    if (addedNaohMoles < initialHclMoles) {
      const remainingHclMoles = initialHclMoles - addedNaohMoles;
      const hConc = remainingHclMoles / totalVolumeL;
      const calcPh = -Math.log10(hConc);
      return Math.max(1.0, Number(calcPh.toFixed(2)));
    } else if (Math.abs(addedNaohMoles - initialHclMoles) < 0.000005) {
      return 7.0; // Equivalence
    } else {
      const excessNaohMoles = addedNaohMoles - initialHclMoles;
      const ohConc = excessNaohMoles / totalVolumeL;
      const pOh = -Math.log10(ohConc);
      const calcPh = 14 - pOh;
      return Math.min(13.2, Number(calcPh.toFixed(2)));
    }
  }, [titrantMl]);

  // Solution Appearance: Clear -> Pale Pink (8.2-10) -> Vibrant Magenta (>10)
  const solutionVisual = useMemo(() => {
    if (chemPh < 8.2) {
      return {
        bg: 'rgba(255, 255, 255, 0.15)',
        border: 'rgba(255, 255, 255, 0.3)',
        textColor: 'text-slate-300',
        label: 'Colorless (Acidic HCl Excess)',
        isEndpoint: false,
      };
    } else if (chemPh <= 10.0) {
      return {
        bg: 'rgba(244, 114, 182, 0.55)',
        border: 'rgba(244, 114, 182, 0.8)',
        textColor: 'text-pink-300',
        label: 'Faint Pink — Neutralization Endpoint Reached! ⭐',
        isEndpoint: true,
      };
    } else {
      return {
        bg: 'rgba(219, 39, 119, 0.85)',
        border: 'rgba(219, 39, 119, 1)',
        textColor: 'text-pink-200',
        label: 'Deep Pink / Magenta (Excess NaOH Alkaline)',
        isEndpoint: false,
      };
    }
  }, [chemPh]);

  // Auto-dripper effect
  useEffect(() => {
    if (!isDrippingAuto) return;
    const interval = setInterval(() => {
      setDropsCount((prev) => {
        if (prev >= 260) {
          setIsDrippingAuto(false);
          return prev;
        }
        playLabSound('drip', soundEnabled);
        return prev + 1;
      });
    }, 400);
    return () => clearInterval(interval);
  }, [isDrippingAuto, soundEnabled]);

  // =========================================================================
  // 3. BIOLOGY MICROSCOPE OPTICS STATE
  // =========================================================================
  const [specimen, setSpecimen] = useState<'onion' | 'cheek' | 'stoma' | 'rbc'>('onion');
  const [objective, setObjective] = useState<'4x' | '10x' | '40x' | '100x'>('10x');
  const [coarseFocus, setCoarseFocus] = useState(50);
  const [fineFocus, setFineFocus] = useState(50);

  const totalMagnification = useMemo(() => {
    const objNum = parseInt(objective, 10);
    return 10 * objNum; // 10x ocular * objective
  }, [objective]);

  // Blur calculation (0px is perfectly sharp)
  const focusBlur = useMemo(() => {
    const coarseOffset = Math.abs(coarseFocus - 50);
    const fineOffset = Math.abs(fineFocus - 50);
    return Math.min(16, Number((coarseOffset * 0.25 + fineOffset * 0.1).toFixed(1)));
  }, [coarseFocus, fineFocus]);

  const focusAccuracy = useMemo(() => {
    const acc = Math.max(0, 100 - focusBlur * 6.5);
    return Math.round(acc);
  }, [focusBlur]);

  // =========================================================================
  // 4. ANATOMY 3D CARDIAC CONDUCTION & ECG STATE
  // =========================================================================
  const [heartRate, setHeartRate] = useState(72); // BPM (40 to 160)
  const ecgCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Live ECG Drawing Loop
  useEffect(() => {
    const canvas = ecgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let x = 0;
    const height = canvas.height;
    const width = canvas.width;
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2.2;
    ctx.shadowBlur = 6;
    ctx.shadowColor = '#34d399';

    ctx.fillStyle = 'rgba(2, 6, 23, 0.95)';
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.12)';
    ctx.lineWidth = 0.5;
    for (let gx = 0; gx < width; gx += 20) {
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, height);
      ctx.stroke();
    }
    for (let gy = 0; gy < height; gy += 20) {
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(width, gy);
      ctx.stroke();
    }

    let phase = 0;
    const speed = (heartRate / 72) * 1.8;

    const render = () => {
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.2;

      // Draw segment
      const mid = height / 2;
      let y = mid;

      const pNorm = (phase % 100);
      if (pNorm > 20 && pNorm < 30) {
        // P-Wave (Atrial Depolarization)
        y = mid - 12 * Math.sin(((pNorm - 20) / 10) * Math.PI);
      } else if (pNorm >= 38 && pNorm < 42) {
        // Q-Dip
        y = mid + 8;
      } else if (pNorm >= 42 && pNorm < 48) {
        // R-Peak (Ventricular Depolarization)
        y = mid - 46;
      } else if (pNorm >= 48 && pNorm < 52) {
        // S-Dip
        y = mid + 16;
      } else if (pNorm > 60 && pNorm < 75) {
        // T-Wave (Ventricular Repolarization)
        y = mid - 18 * Math.sin(((pNorm - 60) / 15) * Math.PI);
      }

      ctx.beginPath();
      ctx.moveTo(x, y);
      x = (x + speed) % width;
      phase = (phase + speed) % 100;

      // Clear upcoming slice to create moving radar sweep
      ctx.fillStyle = 'rgba(2, 6, 23, 0.95)';
      ctx.fillRect((x + 1) % width, 0, 18, height);

      // Redraw grid slice
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.12)';
      ctx.lineWidth = 0.5;
      const nextX = Math.floor(x / 20) * 20;
      ctx.beginPath();
      ctx.moveTo(nextX, 0);
      ctx.lineTo(nextX, height);
      ctx.stroke();

      // Lead line
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 2.2;
      ctx.lineTo(x, y);
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [heartRate]);

  // =========================================================================
  // ACTIONS: SAVE OBSERVATION TO MONGODB
  // =========================================================================
  const handleSaveToMongo = async () => {
    playLabSound('chime', soundEnabled);
    const now = new Date().toISOString();
    const uid = userProfile?.id || userProfile?.uid || 'student_guest';

    let journalPayload: any = null;

    if (activeStation === 'physics') {
      journalPayload = {
        userId: uid,
        title: `Ohm's Law Circuit Verification (${voltage}V / ${resistance}Ω)`,
        experimentNo: 'EXP-PHY-01',
        subject: 'Physics',
        classGrade: 'Class 10',
        toolType: 'interactive_circuit',
        aim: 'To verify Ohm’s law by measuring current passing through an ohmic conductor under varying potential difference.',
        apparatus: 'Regulated DC Power Supply, Ammeter, Voltmeter, Rheostat, Resistance Wire.',
        theory: 'Ohm’s Law: The electric current flowing through a metallic conductor is directly proportional to the potential difference across its terminals at constant temperature. V = I · R.',
        formulae: 'V = I · R  |  P = V · I  |  Heat = I² · R · t',
        observations: [
          { id: '1', parameter: 'Supply Voltage (V)', metricValue: `${voltage.toFixed(2)} V`, metricUnit: 'V' },
          { id: '2', parameter: 'Circuit Resistance (R)', metricValue: `${resistance.toFixed(2)} Ω`, metricUnit: 'Ω' },
          { id: '3', parameter: 'Measured Current (I)', metricValue: `${current.toFixed(3)} A`, metricUnit: 'A' },
          { id: '4', parameter: 'Power Dissipation (P)', metricValue: `${power.toFixed(3)} W`, metricUnit: 'W' },
        ],
        calculations: `Resistance R = V / I = ${voltage} / ${current} = ${(voltage / (current || 0.001)).toFixed(2)} Ω. Power P = ${power} W.`,
        errorPercentage: 0.2,
        conclusion: 'Ohm’s law was verified. The ratio V/I remained constant, yielding a linear characteristic slope.',
        precautions: 'Ensure all terminal keys are tight and switch is open when not taking observations.',
        createdAt: now,
      };
    } else if (activeStation === 'chemistry') {
      journalPayload = {
        userId: uid,
        title: `Acid-Base Titration (0.1M HCl vs 0.1M NaOH) — pH ${chemPh}`,
        experimentNo: 'EXP-CH-01',
        subject: 'Chemistry',
        classGrade: 'Class 10 & 11',
        toolType: 'interactive_titration',
        aim: 'To determine the neutralization equivalence point of dilute hydrochloric acid using standardized sodium hydroxide solution with phenolphthalein indicator.',
        apparatus: 'Burette (50 mL), Conical Flask (100 mL), Pipette, Phenolphthalein Indicator, 0.1 M HCl, 0.1 M NaOH.',
        theory: 'Strong acid-strong base neutralization: H⁺ + OH⁻ → H₂O. Phenolphthalein turns from colorless to faint pink at pH 8.2–10.0.',
        formulae: 'M₁ · V₁ = M₂ · V₂  |  pH = -log₁₀[H⁺]',
        observations: [
          { id: '1', parameter: 'Volume of 0.1 M HCl in Flask', metricValue: '10.00 mL', metricUnit: 'mL' },
          { id: '2', parameter: 'Titrant (0.1 M NaOH) Added', metricValue: `${titrantMl.toFixed(2)} mL`, metricUnit: 'mL' },
          { id: '3', parameter: 'Total Drops Added', metricValue: `${dropsCount}`, metricUnit: 'drops' },
          { id: '4', parameter: 'Solution pH', metricValue: `${chemPh.toFixed(2)}`, metricUnit: 'pH' },
          { id: '5', parameter: 'Visual Color Endpoint', metricValue: solutionVisual.label, metricUnit: 'color' },
        ],
        calculations: `At equivalence point (10 mL NaOH added), 10.00 mL × 0.1 M = 10.00 mL × 0.1 M. pH = ${chemPh}.`,
        errorPercentage: 0.5,
        conclusion: `Neutralization endpoint observed at ${titrantMl} mL with sharp colorimetric transition.`,
        precautions: 'Add titrant dropwise near the equivalence point with constant gentle swirling of the flask.',
        createdAt: now,
      };
    } else if (activeStation === 'biology') {
      const specimenLabels = {
        onion: 'Onion Epidermal Cells (Allium cepa)',
        cheek: 'Human Cheek Epithelial Squamous Cells',
        stoma: 'Plant Stomatal Aperture & Guard Cells',
        rbc: 'Human Erythrocytes (Red Blood Cells)',
      };
      journalPayload = {
        userId: uid,
        title: `Microscopic Slide Observation: ${specimenLabels[specimen]} (${totalMagnification}x)`,
        experimentNo: 'EXP-BIO-01',
        subject: 'Biology',
        classGrade: 'Class 9 & 10',
        toolType: 'interactive_microscope',
        aim: `To prepare and observe a temporary stained mount of ${specimenLabels[specimen]} under compound optical microscope.`,
        apparatus: 'Compound Optical Microscope, Clean Glass Slides, Coverslips, Methylene Blue / Safranin Stain, Glycerin, Dropper.',
        theory: 'Plant and animal cells differ in cell wall presence, chloroplasts, and vacuole dimensions. Total Magnification = Ocular (10x) × Objective lens.',
        formulae: 'Magnification = Ocular Magnification × Objective Magnification',
        observations: [
          { id: '1', parameter: 'Specimen Mount', metricValue: specimenLabels[specimen], metricUnit: 'sample' },
          { id: '2', parameter: 'Objective Lens', metricValue: objective, metricUnit: 'lens' },
          { id: '3', parameter: 'Total Optical Magnification', metricValue: `${totalMagnification}x`, metricUnit: 'x' },
          { id: '4', parameter: 'Focus Sharpness Score', metricValue: `${focusAccuracy}%`, metricUnit: '%' },
        ],
        calculations: `Optical Power = 10x × ${objective} = ${totalMagnification}x. Focus resolution factor: ${focusAccuracy}%.`,
        errorPercentage: 0.1,
        conclusion: `Distinct cellular boundaries, nuclei, and cytoplasm observed clearly at ${totalMagnification}x magnification.`,
        precautions: 'Avoid formation of air bubbles while gently lowering coverslip with mounting needle.',
        createdAt: now,
      };
    } else {
      journalPayload = {
        userId: uid,
        title: `Electrocardiogram (ECG) Conduction Telemetry (${heartRate} BPM)`,
        experimentNo: 'EXP-BIO-05',
        subject: 'Biology / Anatomy',
        classGrade: 'Class 11',
        toolType: 'interactive_ecg',
        aim: 'To analyze human cardiac conduction cycle waveforms (P-Q-R-S-T) and calculate cardiac output.',
        apparatus: '3D Organ Cardiac Conduction Simulator, Digital ECG Telemetry Monitor, Pulse Rate Controller.',
        theory: 'P wave: Atrial depolarization. QRS complex: Ventricular depolarization. T wave: Ventricular repolarization. Cardiac Output = Stroke Volume × Heart Rate.',
        formulae: 'Cardiac Output (CO) = Stroke Volume (70 mL) × Heart Rate (BPM)',
        observations: [
          { id: '1', parameter: 'Heart Rate', metricValue: `${heartRate} BPM`, metricUnit: 'BPM' },
          { id: '2', parameter: 'Cardiac Cycle Period', metricValue: `${(60 / heartRate).toFixed(3)} s`, metricUnit: 's' },
          { id: '3', parameter: 'Estimated Cardiac Output', metricValue: `${((heartRate * 70) / 1000).toFixed(2)} L/min`, metricUnit: 'L/min' },
        ],
        calculations: `Stroke Volume = 70 mL. Cardiac Output = ${heartRate} × 70 = ${heartRate * 70} mL/min = ${((heartRate * 70) / 1000).toFixed(2)} L/min.`,
        errorPercentage: 0.0,
        conclusion: `Normal sinus rhythm maintained at ${heartRate} BPM with synchronized P-Q-R-S-T conduction intervals.`,
        precautions: 'Subject must remain stationary during lead calibration to prevent somatic tremor artifacts.',
        createdAt: now,
      };
    }

    try {
      await saveLabJournalToMongo(journalPayload);
      if (onRecordReading) {
        onRecordReading({ tool: activeStation as any, data: journalPayload });
      }
      setSaveToast(`🍃 Saved to MongoDB Cloud! "${journalPayload.title.substring(0, 32)}..."`);
      setTimeout(() => setSaveToast(null), 3500);
    } catch {
      setSaveToast('Saved to local journal cache.');
      setTimeout(() => setSaveToast(null), 3000);
    }
  };

  return (
    <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-b from-slate-900/95 via-slate-900/80 to-slate-950/95 p-5 md:p-7 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/10 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3" /> Live Interactive
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1.5">
              <Database className="w-3 h-3" /> 🍃 MongoDB Cloud Sync Active
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Interactive Quick Experiment Workbench
          </h3>
          <p className="text-xs text-slate-400 max-w-2xl">
            Directly manipulate physics circuits, titration burettes, microscopic focus optics, and cardiac rhythms in real-time. Instant live calculations with 1-click MongoDB record saving.
          </p>
        </div>

        {/* Audio Toggle & Save All */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              soundEnabled 
                ? 'bg-amber-400/15 border-amber-400/40 text-amber-300 hover:bg-amber-400/25' 
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
            title={soundEnabled ? 'Mute Lab Sound FX' : 'Enable Lab Tactile Sound FX'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Audio FX ON' : 'Audio Muted'}</span>
          </button>

          <button
            onClick={handleSaveToMongo}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save to MongoDB Journal</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {saveToast && (
        <div className="my-3 p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{saveToast}</span>
          </div>
          <button 
            onClick={() => onNavigateTab && onNavigateTab('journal')}
            className="text-[11px] underline text-emerald-300 hover:text-white cursor-pointer"
          >
            Open Journal &rarr;
          </button>
        </div>
      )}

      {/* 4 Station Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 my-5 relative z-10">
        <button
          onClick={() => { setActiveStation('physics'); playLabSound('switch', soundEnabled); }}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeStation === 'physics'
              ? 'bg-amber-400/15 border-amber-400 text-white shadow-lg shadow-amber-400/10 ring-1 ring-amber-400'
              : 'bg-slate-900/60 border-white/5 text-slate-400 hover:bg-slate-900 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-xl ${activeStation === 'physics' ? 'bg-amber-400 text-slate-950' : 'bg-white/5 text-amber-400'}`}>
              <Zap className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 font-bold">
              Physics
            </span>
          </div>
          <div>
            <div className="font-bold text-sm text-white">Ohm's Law Circuit</div>
            <div className="text-[11px] text-slate-400">V = I·R, Rheostat, Dial Meters</div>
          </div>
        </button>

        <button
          onClick={() => { setActiveStation('chemistry'); playLabSound('switch', soundEnabled); }}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeStation === 'chemistry'
              ? 'bg-pink-500/15 border-pink-400 text-white shadow-lg shadow-pink-500/10 ring-1 ring-pink-400'
              : 'bg-slate-900/60 border-white/5 text-slate-400 hover:bg-slate-900 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-xl ${activeStation === 'chemistry' ? 'bg-pink-500 text-white' : 'bg-white/5 text-pink-400'}`}>
              <FlaskConical className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-pink-500/20 text-pink-300 font-bold">
              Chemistry
            </span>
          </div>
          <div>
            <div className="font-bold text-sm text-white">Acid-Base Titration</div>
            <div className="text-[11px] text-slate-400">Burette, pH Color Transition</div>
          </div>
        </button>

        <button
          onClick={() => { setActiveStation('biology'); playLabSound('switch', soundEnabled); }}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeStation === 'biology'
              ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400'
              : 'bg-slate-900/60 border-white/5 text-slate-400 hover:bg-slate-900 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-xl ${activeStation === 'biology' ? 'bg-cyan-500 text-slate-950' : 'bg-white/5 text-cyan-400'}`}>
              <Eye className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-bold">
              Biology
            </span>
          </div>
          <div>
            <div className="font-bold text-sm text-white">Optical Microscope</div>
            <div className="text-[11px] text-slate-400">Slide Optics, Coarse/Fine Focus</div>
          </div>
        </button>

        <button
          onClick={() => { setActiveStation('anatomy'); playLabSound('switch', soundEnabled); }}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeStation === 'anatomy'
              ? 'bg-rose-500/15 border-rose-400 text-white shadow-lg shadow-rose-500/10 ring-1 ring-rose-400'
              : 'bg-slate-900/60 border-white/5 text-slate-400 hover:bg-slate-900 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-xl ${activeStation === 'anatomy' ? 'bg-rose-500 text-white' : 'bg-white/5 text-rose-400'}`}>
              <Heart className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 font-bold">
              Anatomy
            </span>
          </div>
          <div>
            <div className="font-bold text-sm text-white">Cardiac ECG Rhythm</div>
            <div className="text-[11px] text-slate-400">P-Q-R-S-T Wave, BPM Telemetry</div>
          </div>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* STATION 1: PHYSICS OHM'S LAW INTERACTIVE EXPERIMENT                   */}
      {/* ===================================================================== */}
      {activeStation === 'physics' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center animate-in fade-in duration-200">
          {/* Interactive Circuit Canvas & Dial Meters */}
          <div className="lg:col-span-7 bg-slate-950/80 rounded-2xl p-5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono uppercase tracking-widest text-slate-300 font-bold">
                  Circuit Schematic & Moving-Needle Analog Meters
                </span>
              </div>
              <button
                onClick={() => {
                  setCircuitClosed(!circuitClosed);
                  playLabSound('click', soundEnabled);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  circuitClosed 
                    ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400' 
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}
              >
                Key: {circuitClosed ? 'CLOSED (ON)' : 'OPEN (OFF)'}
              </button>
            </div>

            {/* SVG Interactive Circuit Animation */}
            <div className="h-44 bg-slate-900/90 rounded-xl border border-white/5 relative overflow-hidden flex items-center justify-center p-2">
              <svg viewBox="0 0 500 160" className="w-full h-full">
                {/* Circuit Wires */}
                <path
                  d="M 50 80 L 120 80 L 120 40 L 260 40 L 260 80 L 380 80 L 380 130 L 50 130 Z"
                  fill="none"
                  stroke={circuitClosed ? '#38bdf8' : '#475569'}
                  strokeWidth="3.5"
                  strokeDasharray={circuitClosed ? '6, 6' : 'none'}
                  className={circuitClosed ? 'animate-dash' : ''}
                />

                {/* Battery Source */}
                <g transform="translate(40, 60)">
                  <rect x="0" y="0" width="20" height="40" rx="3" fill="#0284c7" />
                  <line x1="10" y1="-8" x2="10" y2="0" stroke="#38bdf8" strokeWidth="3" />
                  <text x="10" y="55" fill="#93c5fd" fontSize="10" textAnchor="middle" fontWeight="bold">
                    {voltage.toFixed(1)}V
                  </text>
                </g>

                {/* Resistor / Wire Element */}
                <g transform="translate(170, 30)">
                  <rect x="0" y="0" width="40" height="20" rx="3" fill="#ea580c" stroke="#fed7aa" strokeWidth="1" />
                  <text x="20" y="32" fill="#fdba74" fontSize="10" textAnchor="middle" fontWeight="bold">
                    {resistance.toFixed(1)}Ω
                  </text>
                </g>

                {/* Voltmeter Connected in Parallel */}
                <g transform="translate(165, 80)">
                  <circle cx="25" cy="25" r="22" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                  <text x="25" y="22" fill="#38bdf8" fontSize="11" textAnchor="middle" fontWeight="bold">V</text>
                  <line 
                    x1="25" y1="25" 
                    x2={25 + 16 * Math.sin((voltAngle * Math.PI) / 180)} 
                    y2={25 - 16 * Math.cos((voltAngle * Math.PI) / 180)} 
                    stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" 
                  />
                  <text x="25" y="37" fill="#fbbf24" fontSize="9" textAnchor="middle" fontWeight="bold">
                    {circuitClosed ? `${voltage.toFixed(1)}V` : '0V'}
                  </text>
                </g>

                {/* Ammeter Connected in Series */}
                <g transform="translate(320, 60)">
                  <circle cx="20" cy="20" r="18" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
                  <text x="20" y="18" fill="#10b981" fontSize="10" textAnchor="middle" fontWeight="bold">A</text>
                  <line 
                    x1="20" y1="20" 
                    x2={20 + 13 * Math.sin((ampAngle * Math.PI) / 180)} 
                    y2={20 - 13 * Math.cos((ampAngle * Math.PI) / 180)} 
                    stroke="#10b981" strokeWidth="2" strokeLinecap="round" 
                  />
                  <text x="20" y="31" fill="#34d399" fontSize="8" textAnchor="middle" fontWeight="bold">
                    {circuitClosed ? `${current.toFixed(2)}A` : '0A'}
                  </text>
                </g>
              </svg>
            </div>

            {/* Live Readout Cards */}
            <div className="grid grid-cols-4 gap-2">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-white/5 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Potential (V)</div>
                <div className="text-base font-black text-amber-300">{circuitClosed ? voltage.toFixed(2) : '0.00'} V</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-white/5 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Current (I)</div>
                <div className="text-base font-black text-emerald-400">{current.toFixed(3)} A</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-white/5 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Resistance (R)</div>
                <div className="text-base font-black text-orange-400">{resistance.toFixed(1)} Ω</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-white/5 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Power (P)</div>
                <div className="text-base font-black text-purple-300">{power.toFixed(2)} W</div>
              </div>
            </div>
          </div>

          {/* Interactive Rheostat & Voltage Sliders */}
          <div className="lg:col-span-5 space-y-4 bg-slate-900/90 rounded-2xl p-5 border border-white/10">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                Interactive Circuit Controls
              </span>
              <h4 className="text-base font-bold text-white">Adjust Rheostat & DC Voltage</h4>
            </div>

            {/* Voltage Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">DC Voltage Supply:</span>
                <span className="text-amber-300 font-mono font-bold">{voltage.toFixed(1)} V</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="12.0"
                step="0.5"
                value={voltage}
                onChange={(e) => {
                  setVoltage(parseFloat(e.target.value));
                  playLabSound('click', soundEnabled);
                }}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1.0 V</span>
                <span>6.0 V (Default)</span>
                <span>12.0 V</span>
              </div>
            </div>

            {/* Resistance Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Rheostat Slider (Resistance):</span>
                <span className="text-orange-300 font-mono font-bold">{resistance.toFixed(1)} Ω</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="25.0"
                step="0.5"
                value={resistance}
                onChange={(e) => {
                  setResistance(parseFloat(e.target.value));
                  playLabSound('click', soundEnabled);
                }}
                className="w-full accent-orange-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1.0 Ω (Max Current)</span>
                <span>12.5 Ω</span>
                <span>25.0 Ω (Min Current)</span>
              </div>
            </div>

            {/* Formula & Verification */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1 text-xs">
              <div className="font-mono text-amber-300 font-bold">
                Ohm's Equation: V / I = {voltage.toFixed(1)} / {current.toFixed(3)} = {(voltage / (current || 0.001)).toFixed(2)} Ω
              </div>
              <p className="text-[11px] text-slate-400">
                Heat dissipated: {jouleHeating} J/s (Joule's heating law $H = I^2Rt$).
              </p>
            </div>

            <button
              onClick={handleSaveToMongo}
              className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>Record Reading to MongoDB Journal</span>
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* STATION 2: CHEMISTRY ACID-BASE TITRATION INTERACTIVE EXPERIMENT      */}
      {/* ===================================================================== */}
      {activeStation === 'chemistry' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center animate-in fade-in duration-200">
          {/* Burette & Flask Simulation Visual */}
          <div className="lg:col-span-7 bg-slate-950/80 rounded-2xl p-5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-pink-400" />
                <span className="text-xs font-mono uppercase tracking-widest text-slate-300 font-bold">
                  Burette Dropper & Colorimetric Flask
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-pink-500/20 text-pink-300 font-bold border border-pink-500/30">
                Phenolphthalein Indicator
              </span>
            </div>

            <div className="h-56 bg-slate-900/90 rounded-xl border border-white/5 relative flex items-center justify-around p-4 overflow-hidden">
              {/* Burette Column */}
              <div className="flex flex-col items-center">
                <div className="text-[10px] text-slate-400 font-mono mb-1">0.1 M NaOH Burette</div>
                <div className="w-8 h-28 bg-slate-800 rounded-t-md border border-cyan-400/40 relative overflow-hidden">
                  {/* Fluid Level */}
                  <div 
                    className="w-full bg-cyan-400/50 absolute bottom-0 transition-all duration-300"
                    style={{ height: `${Math.max(10, 100 - (titrantMl / 25) * 100)}%` }}
                  />
                  {/* Graduations */}
                  <div className="absolute inset-0 flex flex-col justify-between py-1 px-0.5 opacity-40 text-[6px] font-mono text-white">
                    <span>0</span><span>5</span><span>10</span><span>15</span><span>20</span>
                  </div>
                </div>
                {/* Burette Valve */}
                <div className="w-4 h-3 bg-amber-400 rounded-sm mt-0.5" />
                {/* Drip Droplet */}
                <div className={`w-2 h-2 rounded-full bg-cyan-300 mt-1 transition-all ${isDrippingAuto ? 'animate-bounce' : 'opacity-60'}`} />
              </div>

              {/* Conical Flask */}
              <div className="flex flex-col items-center">
                <div className="text-[10px] text-slate-400 font-mono mb-1">10 mL 0.1 M HCl + Indicator</div>
                <div 
                  className="w-28 h-28 rounded-b-3xl rounded-t-md border-2 transition-all duration-500 flex flex-col justify-end p-2 items-center shadow-lg"
                  style={{
                    backgroundColor: solutionVisual.bg,
                    borderColor: solutionVisual.border,
                  }}
                >
                  <div className="text-center">
                    <span className="text-xs font-black text-white font-mono bg-black/40 px-2 py-0.5 rounded-md">
                      pH {chemPh.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-[9px] text-slate-200 mt-1 text-center font-semibold">
                    {solutionVisual.isEndpoint ? '⭐ Neutralized!' : chemPh < 7 ? 'Acidic' : 'Alkaline'}
                  </div>
                </div>
              </div>

              {/* Digital pH Meter Readout */}
              <div className="p-3 rounded-xl bg-slate-950 border border-white/10 text-center w-32 shadow-xl">
                <div className="text-[9px] text-slate-400 uppercase font-mono">Digital pH</div>
                <div className="text-2xl font-black text-pink-400 font-mono">{chemPh.toFixed(2)}</div>
                <div className="text-[9px] text-slate-400 mt-1 font-mono">
                  EMF: {((7.0 - chemPh) * 59.16).toFixed(1)} mV
                </div>
              </div>
            </div>

            <div className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between ${
              solutionVisual.isEndpoint 
                ? 'bg-pink-500/20 border-pink-400 text-pink-200' 
                : 'bg-slate-900 border-white/5 text-slate-300'
            }`}>
              <span>Visual Status: {solutionVisual.label}</span>
              <span className="font-mono text-slate-400 text-[11px]">{titrantMl.toFixed(2)} mL Titrant</span>
            </div>
          </div>

          {/* Interactive Burette Controls */}
          <div className="lg:col-span-5 space-y-4 bg-slate-900/90 rounded-2xl p-5 border border-white/10">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-pink-400 font-bold">
                Burette Dispenser Controls
              </span>
              <h4 className="text-base font-bold text-white">Dispense 0.1 M NaOH Solution</h4>
            </div>

            {/* Dropper Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setDropsCount(prev => prev + 1);
                  playLabSound('drip', soundEnabled);
                }}
                className="py-3 px-3 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/30 text-pink-200 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>+1 Drop (0.05 mL)</span>
              </button>

              <button
                onClick={() => {
                  setDropsCount(prev => prev + 5);
                  playLabSound('drip', soundEnabled);
                }}
                className="py-3 px-3 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/30 text-pink-200 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>+5 Drops (0.25 mL)</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setIsDrippingAuto(!isDrippingAuto);
                  playLabSound('switch', soundEnabled);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  isDrippingAuto 
                    ? 'bg-rose-500 text-white' 
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                <span>{isDrippingAuto ? 'Stop Drip Valve' : 'Auto Drip Valve'}</span>
              </button>

              <button
                onClick={() => {
                  setDropsCount(0);
                  setIsDrippingAuto(false);
                  playLabSound('click', soundEnabled);
                }}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Flask</span>
              </button>
            </div>

            {/* Reaction Summary */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1 text-xs">
              <div className="font-mono text-pink-300 font-bold">
                HCl (aq) + NaOH (aq) &rarr; NaCl (aq) + H₂O (l)
              </div>
              <p className="text-[11px] text-slate-400">
                Equivalence point occurs at exactly 200 drops (10.0 mL), where moles of acid = moles of base.
              </p>
            </div>

            <button
              onClick={handleSaveToMongo}
              className="w-full py-2.5 rounded-xl bg-pink-500 hover:bg-pink-400 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>Record Titration to MongoDB Journal</span>
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* STATION 3: BIOLOGY OPTICAL MICROSCOPE INTERACTIVE EXPERIMENT          */}
      {/* ===================================================================== */}
      {activeStation === 'biology' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center animate-in fade-in duration-200">
          {/* Microscopic Slide Viewport */}
          <div className="lg:col-span-7 bg-slate-950/80 rounded-2xl p-5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono uppercase tracking-widest text-slate-300 font-bold">
                  Ocular Optical Field of View ({totalMagnification}x)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold ${
                  focusAccuracy > 80 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  Focus: {focusAccuracy}%
                </span>
              </div>
            </div>

            {/* Circular Microscopic Stage Canvas */}
            <div className="h-56 bg-black rounded-xl border border-white/10 relative overflow-hidden flex items-center justify-center p-2">
              <div 
                className="w-48 h-48 rounded-full border-4 border-slate-700 bg-slate-900 relative overflow-hidden shadow-2xl flex items-center justify-center"
                style={{
                  filter: `blur(${focusBlur}px)`,
                  transition: 'filter 0.15s ease-out'
                }}
              >
                {/* Specimen Render */}
                {specimen === 'onion' && (
                  <div className="w-full h-full bg-amber-950/30 p-2 grid grid-cols-4 gap-1">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div key={i} className="border border-amber-400/50 rounded-sm relative flex items-center justify-center bg-amber-500/10">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-300/80" />
                      </div>
                    ))}
                  </div>
                )}

                {specimen === 'cheek' && (
                  <div className="w-full h-full bg-blue-950/30 p-4 relative flex items-center justify-center">
                    <div className="w-24 h-20 rounded-full border-2 border-blue-400/60 bg-blue-500/15 relative flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-blue-300/90" />
                    </div>
                  </div>
                )}

                {specimen === 'stoma' && (
                  <div className="w-full h-full bg-emerald-950/40 p-4 relative flex items-center justify-center">
                    <div className="flex items-center gap-1">
                      <div className="w-6 h-16 rounded-full bg-emerald-500/40 border border-emerald-400" />
                      <div className="w-1.5 h-10 bg-black/60 rounded-full" />
                      <div className="w-6 h-16 rounded-full bg-emerald-500/40 border border-emerald-400" />
                    </div>
                  </div>
                )}

                {specimen === 'rbc' && (
                  <div className="w-full h-full bg-rose-950/40 p-2 grid grid-cols-5 gap-2">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div key={i} className="w-5 h-5 rounded-full bg-rose-500/70 border border-rose-400 shadow-inner" />
                    ))}
                  </div>
                )}

                {/* Eyepiece Crosshair Graticule */}
                <div className="absolute inset-0 pointer-events-none opacity-20">
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-white" />
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              {(['onion', 'cheek', 'stoma', 'rbc'] as const).map((spec) => (
                <button
                  key={spec}
                  onClick={() => { setSpecimen(spec); playLabSound('click', soundEnabled); }}
                  className={`py-1.5 px-2 rounded-xl border text-[11px] font-bold capitalize transition-all cursor-pointer ${
                    specimen === spec 
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-sm' 
                      : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {spec === 'onion' ? 'Onion Peel' : spec === 'cheek' ? 'Cheek Cell' : spec === 'stoma' ? 'Stomata' : 'RBC Smear'}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Microscope Optics Knobs */}
          <div className="lg:col-span-5 space-y-4 bg-slate-900/90 rounded-2xl p-5 border border-white/10">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
                Focus & Objective Controls
              </span>
              <h4 className="text-base font-bold text-white">Adjust Focal Plane & Magnification</h4>
            </div>

            {/* Objective Turret */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Objective Turret Lens:</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['4x', '10x', '40x', '100x'] as const).map((lens) => (
                  <button
                    key={lens}
                    onClick={() => { setObjective(lens); playLabSound('click', soundEnabled); }}
                    className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      objective === lens
                        ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {lens}
                  </button>
                ))}
              </div>
            </div>

            {/* Coarse Focus Knob */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Coarse Focus Dial:</span>
                <span className="text-cyan-300 font-mono font-bold">{coarseFocus}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={coarseFocus}
                onChange={(e) => setCoarseFocus(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Fine Focus Knob */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Fine Micrometer Dial:</span>
                <span className="text-cyan-300 font-mono font-bold">{fineFocus}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={fineFocus}
                onChange={(e) => setFineFocus(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <button
              onClick={handleSaveToMongo}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>Capture Slide to MongoDB Journal</span>
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* STATION 4: ANATOMY CARDIAC ECG TELEMETRY INTERACTIVE EXPERIMENT       */}
      {/* ===================================================================== */}
      {activeStation === 'anatomy' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center animate-in fade-in duration-200">
          {/* Real-time Oscilloscope ECG Canvas */}
          <div className="lg:col-span-7 bg-slate-950/80 rounded-2xl p-5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono uppercase tracking-widest text-slate-300 font-bold">
                  Lead II Electrocardiogram (ECG) Oscilloscope
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                Sinus Rhythm
              </span>
            </div>

            {/* ECG Screen */}
            <div className="h-56 bg-slate-950 rounded-xl border border-emerald-500/30 relative overflow-hidden flex items-center justify-center">
              <canvas
                ref={ecgCanvasRef}
                width={480}
                height={220}
                className="w-full h-full block"
              />
            </div>

            {/* Telemetry Readouts */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-white/5">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Heart Rate</div>
                <div className="text-base font-black text-emerald-400 font-mono">{heartRate} BPM</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-white/5">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Cycle Duration</div>
                <div className="text-base font-black text-cyan-300 font-mono">{(60 / heartRate).toFixed(3)} s</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-white/5">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Cardiac Output</div>
                <div className="text-base font-black text-rose-300 font-mono">{((heartRate * 70) / 1000).toFixed(2)} L/m</div>
              </div>
            </div>
          </div>

          {/* Interactive Heart Rate & Conduction Sliders */}
          <div className="lg:col-span-5 space-y-4 bg-slate-900/90 rounded-2xl p-5 border border-white/10">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-rose-400 font-bold">
                SA Node Pulse Control
              </span>
              <h4 className="text-base font-bold text-white">Adjust Cardiac Beat Frequency</h4>
            </div>

            {/* BPM Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Heart Rate (BPM):</span>
                <span className="text-rose-400 font-mono font-bold">{heartRate} BPM</span>
              </div>
              <input
                type="range"
                min="45"
                max="160"
                step="1"
                value={heartRate}
                onChange={(e) => {
                  setHeartRate(parseInt(e.target.value, 10));
                  playLabSound('click', soundEnabled);
                }}
                className="w-full accent-rose-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Bradycardia (&lt;60)</span>
                <span>Resting (72)</span>
                <span>Tachycardia (&gt;100)</span>
              </div>
            </div>

            {/* Conduction Legend */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                P-Wave: SA Node &rarr; Atrial Systole
              </div>
              <div className="flex items-center gap-2 text-cyan-300 font-bold font-mono">
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
                QRS Complex: Bundle of His &rarr; Purkinje
              </div>
              <div className="flex items-center gap-2 text-amber-300 font-bold font-mono">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                T-Wave: Ventricular Repolarization
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onNavigateTab && onNavigateTab('organs3d')}
                className="flex-1 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-200 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <Heart className="w-4 h-4 text-rose-400" />
                <span>Open 3D Organ Studio</span>
              </button>

              <button
                onClick={handleSaveToMongo}
                className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Save to MongoDB</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
