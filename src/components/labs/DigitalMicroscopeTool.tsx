import React, { useState, useMemo } from 'react';
import { 
  Eye, 
  Camera, 
  Sliders, 
  Grid, 
  CheckCircle2, 
  Maximize2, 
  Info, 
  Sparkles, 
  Check, 
  Layers,
  ChevronRight,
  BookOpen
} from 'lucide-react';

interface MicroscopeSpecimen {
  id: string;
  name: string;
  tissueType: string;
  stain: string;
  avgCellSizeUm: number;
  description: string;
  features: string[];
  ncertReference: string;
}

const SPECIMENS_CATALOG: MicroscopeSpecimen[] = [
  {
    id: 'spec-onion',
    name: 'Onion Peel Epidermal Cells',
    tissueType: 'Plant Epidermal Tissue',
    stain: 'Safranin O (Pink/Red)',
    avgCellSizeUm: 180,
    description: 'Rectangular plant cells with distinct cellulose cell walls, large central sap vacuoles, and peripheral nuclei pressed against the membrane.',
    features: ['Cellulose Cell Wall', 'Prominent Nucleus', 'Large Central Vacuole', 'Thin Peripheral Cytoplasm'],
    ncertReference: 'NCERT Class 9 Science: Chapter 5 The Fundamental Unit of Life (Sec 5.1)'
  },
  {
    id: 'spec-cheek',
    name: 'Human Cheek Squamous Epithelium',
    tissueType: 'Animal Epithelial Tissue',
    stain: 'Methylene Blue (Deep Blue)',
    avgCellSizeUm: 60,
    description: 'Thin, flat polygonal squamous epithelial cells gently scraped from oral mucosa. Cells lack cell walls and feature prominent dark spherical nuclei.',
    features: ['Thin Plasma Membrane', 'Absence of Cell Wall', 'Central Dense Nucleus', 'Granular Cytoplasm'],
    ncertReference: 'NCERT Class 9 Science: Chapter 6 Tissues (Sec 6.3 Epithelial Tissue)'
  },
  {
    id: 'spec-stomata',
    name: 'Leaf Epidermis (Stomata & Guard Cells)',
    tissueType: 'Plant Dermal Tissue',
    stain: 'Fast Green / Safranin',
    avgCellSizeUm: 45,
    description: 'Lower epidermal peel showing stomatal apertures flanked by kidney-shaped guard cells packed with photosynthesizing chloroplasts.',
    features: ['Stomatal Pore Aperture', 'Kidney-shaped Guard Cells', 'Active Chloroplasts', 'Epidermal Subsidiary Cells'],
    ncertReference: 'NCERT Class 10 Science: Chapter 6 Life Processes (Sec 6.2 Nutrition in Plants)'
  },
  {
    id: 'spec-blood',
    name: 'Human Peripheral Blood Smear',
    tissueType: 'Vascular Connective Tissue',
    stain: 'Leishman / Wright Stain',
    avgCellSizeUm: 7.5,
    description: 'Biconcave enucleated Red Blood Cells (Erythrocytes, 7.2–7.8 µm) alongside polymorphonuclear Neutrophils and small round Lymphocytes.',
    features: ['Biconcave RBCs (No Nucleus)', 'Multi-lobed Neutrophils', 'Lymphocytes with Large Nucleus', 'Tiny Platelets'],
    ncertReference: 'NCERT Class 11 Biology: Chapter 18 Body Fluids & Circulation'
  },
  {
    id: 'spec-spirogyra',
    name: 'Spirogyra (Green Filamentous Alga)',
    tissueType: 'Algal Cytology',
    stain: 'Iodine Stain for Starch',
    avgCellSizeUm: 120,
    description: 'Unbranched multicellular filament of green alga displaying characteristic ribbon-like spiral chloroplasts studded with glistening pyrenoids.',
    features: ['Ribbon Spiral Chloroplast', 'Starch Storing Pyrenoids', 'Central Nucleus in Cytoplasmic Web', 'Cellulose Septa'],
    ncertReference: 'NCERT Class 11 Biology: Chapter 3 Plant Kingdom (Algae)'
  },
  {
    id: 'spec-amoeba',
    name: 'Amoeba proteus (Binary Fission)',
    tissueType: 'Microbial Protozoology',
    stain: 'Hematoxylin',
    avgCellSizeUm: 250,
    description: 'Freshwater unicellular protozoan extending blunt finger-like pseudopodia for phagocytosis and motility, with contractile and food vacuoles.',
    features: ['Finger-like Pseudopodia', 'Contractile Vacuole', 'Phagocytic Food Vacuoles', 'Granular Endoplasm'],
    ncertReference: 'NCERT Class 10 Science: Chapter 8 How Do Organisms Reproduce (Sec 8.2)'
  }
];

export interface DigitalMicroscopeReading {
  specimenName: string;
  tissueType: string;
  magnification: number;
  cellSizeUm: number;
  objective: string;
  timestamp: string;
}

interface DigitalMicroscopeProps {
  onLogToJournal?: (reading: DigitalMicroscopeReading) => void;
  onOpenJournal?: () => void;
}

export const DigitalMicroscopeTool: React.FC<DigitalMicroscopeProps> = ({ onLogToJournal, onOpenJournal }) => {
  // Optical & Stage Controls
  const [selectedSpecimenId, setSelectedSpecimenId] = useState<string>('spec-onion');
  const [objectiveLens, setObjectiveLens] = useState<'4x' | '10x' | '40x' | '100x'>('10x');
  const [digitalZoom, setDigitalZoom] = useState<number>(1.0); // 1.0x, 1.5x, 2.0x, 3.0x
  const [coarseFocus, setCoarseFocus] = useState<number>(50); // 0-100 (50 is optimal focal plane)
  const [fineFocus, setFineFocus] = useState<number>(50); // 0-100 (50 is optimal)
  const [illumination, setIllumination] = useState<number>(85); // 20% to 100%
  const [filterMode, setFilterMode] = useState<'brightfield' | 'fluorescence' | 'darkfield' | 'contrast'>('brightfield');
  const [showReticle, setShowReticle] = useState<boolean>(true);
  const [snapshotNotice, setSnapshotNotice] = useState<string | null>(null);
  const [journalLoggedNotice, setJournalLoggedNotice] = useState<string | null>(null);

  // Responsive focus zoom & ocular hover coordinates
  const [isLensHovered, setIsLensHovered] = useState<boolean>(false);
  const [lensHoverPos, setLensHoverPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Caliper measurement pins
  const [caliperWidthPercent, setCaliperWidthPercent] = useState<number>(40);

  const activeSpecimen = useMemo(() => {
    return SPECIMENS_CATALOG.find(s => s.id === selectedSpecimenId) || SPECIMENS_CATALOG[0];
  }, [selectedSpecimenId]);

  // Total optical magnification: Eyepiece 10x * Objective * Digital Zoom
  const opticalMag = useMemo(() => {
    const objNum = objectiveLens === '4x' ? 4 : objectiveLens === '10x' ? 10 : objectiveLens === '40x' ? 40 : 100;
    return 10 * objNum;
  }, [objectiveLens]);

  const totalEffectiveMag = useMemo(() => {
    return Math.round(opticalMag * digitalZoom);
  }, [opticalMag, digitalZoom]);

  // Calibrated Micrometer Scale: micrometers per eyepiece reticle division
  // At 40x: 25.0 µm/div. At 100x: 10.0 µm/div. At 400x: 2.5 µm/div. At 1000x: 1.0 µm/div
  const umPerDivision = useMemo(() => {
    const base = objectiveLens === '4x' ? 25.0 : objectiveLens === '10x' ? 10.0 : objectiveLens === '40x' ? 2.5 : 1.0;
    return Number((base / digitalZoom).toFixed(2));
  }, [objectiveLens, digitalZoom]);

  // Focus blur calculation (simulates depth of field in micrometers)
  const focusBlurRadius = useMemo(() => {
    const coarseDiff = Math.abs(coarseFocus - 50);
    const fineDiff = Math.abs(fineFocus - 50);
    // Higher magnification has narrower depth of field, so blur increases faster
    const magFactor = objectiveLens === '100x' ? 1.8 : objectiveLens === '40x' ? 1.3 : 1.0;
    const blur = (coarseDiff * 0.22 + fineDiff * 0.08) * magFactor;
    return Math.min(18, Number(blur.toFixed(1)));
  }, [coarseFocus, fineFocus, objectiveLens]);

  // Measured specimen dimension using caliper pins
  const measuredDimensionUm = useMemo(() => {
    // 100% width of viewport corresponds to 10 reticle divisions
    const divisions = (caliperWidthPercent / 100) * 10;
    return (divisions * umPerDivision).toFixed(1);
  }, [caliperWidthPercent, umPerDivision]);

  const handleCaptureSnapshot = () => {
    setSnapshotNotice(`Digital Micrograph Captured: ${activeSpecimen.name} at ${totalEffectiveMag}x (${filterMode.toUpperCase()})`);
    setTimeout(() => setSnapshotNotice(null), 3000);
  };

  const handleLogToJournal = () => {
    const reading: DigitalMicroscopeReading = {
      specimenName: activeSpecimen.name,
      tissueType: activeSpecimen.tissueType,
      magnification: totalEffectiveMag,
      cellSizeUm: parseFloat(measuredDimensionUm),
      objective: `${objectiveLens} (Eyepiece 10x)`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    if (onLogToJournal) {
      onLogToJournal(reading);
    }
    setJournalLoggedNotice(`Logged ${activeSpecimen.name} (${measuredDimensionUm} µm at ${totalEffectiveMag}x) to Experiment Journal`);
    setTimeout(() => setJournalLoggedNotice(null), 4000);
  };

  const handleAutoFocus = () => {
    setCoarseFocus(50);
    setFineFocus(50);
  };

  const handleLensMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 16;
    setLensHoverPos({ x, y });
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-950/80 border border-white/10 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>Digital Cytology &amp; Micro-Measurement Lab</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 font-bold border border-cyan-400/30">
              Calibrated Graticule Reticle
            </span>
          </div>
          <h3 className="text-xl font-black text-white tracking-tight">
            Calibrated Digital Optical Microscope
          </h3>
          <p className="text-xs text-slate-400">
            Simulate revolving nosepiece objectives (4x, 10x, 40x, 100x oil), micrometer graticule reticle scale, coarse/fine focal depth, and biological cytology specimens.
          </p>
        </div>

        {/* Quick Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowReticle(!showReticle)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              showReticle
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Reticle: {showReticle ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={handleCaptureSnapshot}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Snap Micrograph</span>
          </button>

          <button
            onClick={handleLogToJournal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            title="Append current specimen cytological measurements to Experiment Journal"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Record in Journal</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Digital Microscope Screen Viewport */}
        <div className="lg:col-span-8 rounded-3xl bg-slate-950 border border-white/10 p-6 space-y-5 shadow-2xl relative overflow-hidden">
          {/* Snapshot Notification Banner */}
          {snapshotNotice && (
            <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{snapshotNotice}</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">SNAPSHOT SAVED</span>
            </div>
          )}

          {/* Journal Logged Banner with Link */}
          {journalLoggedNotice && (
            <div className="p-3 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 text-xs flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-300 shrink-0" />
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

          {/* Top Viewport HUD Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 text-xs font-mono">
            <div>
              <span className="text-slate-400">Specimen:</span>{' '}
              <strong className="text-white">{activeSpecimen.name}</strong>
              <span className="text-slate-500 ml-2">({activeSpecimen.tissueType})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-black border border-cyan-400/40 text-cyan-300 font-bold">
                Magnification: {totalEffectiveMag}x
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-black border border-white/10 text-slate-300">
                1 Div = {umPerDivision} µm
              </span>
            </div>
          </div>

          {/* Circular Digital Eyepiece Viewport with Interactive Focus Zoom */}
          <div className="flex flex-col items-center justify-center p-2">
            <div 
              onMouseEnter={() => setIsLensHovered(true)}
              onMouseLeave={() => {
                setIsLensHovered(false);
                setLensHoverPos({ x: 0, y: 0 });
              }}
              onMouseMove={handleLensMouseMove}
              className="group w-80 h-80 sm:w-96 sm:h-96 rounded-full border-8 border-slate-800 hover:border-cyan-400/70 bg-black shadow-2xl relative overflow-hidden flex items-center justify-center cursor-crosshair transition-all duration-300"
              style={{
                boxShadow: isLensHovered 
                  ? 'inset 0 0 50px rgba(0,0,0,0.95), 0 0 45px rgba(6, 182, 212, 0.45)'
                  : 'inset 0 0 50px rgba(0,0,0,0.95), 0 0 35px rgba(6, 182, 212, 0.25)'
              }}
            >
              {/* Optical Antireflective Coating & Lens Glare Sweep on Hover */}
              <div 
                className="absolute inset-0 pointer-events-none rounded-full transition-opacity duration-300 z-30"
                style={{
                  background: 'radial-gradient(circle at 35% 25%, rgba(168, 85, 247, 0.18) 0%, rgba(6, 182, 212, 0.12) 40%, transparent 70%)',
                  opacity: isLensHovered ? 1 : 0.4
                }}
              />

              {/* Specimen Cellular Texture & Microstructure with Focus Zoom effect */}
              <div 
                className="w-full h-full flex items-center justify-center transition-transform duration-200 ease-out relative will-change-transform"
                style={{
                  filter: `blur(${focusBlurRadius}px) brightness(${illumination / 75}) ${
                    filterMode === 'fluorescence' 
                      ? 'hue-rotate(90deg) saturate(200%) contrast(150%)' 
                      : filterMode === 'darkfield' 
                      ? 'invert(100%) contrast(200%)' 
                      : filterMode === 'contrast'
                      ? 'contrast(180%)'
                      : 'none'
                  }`,
                  transform: `scale(${
                    (objectiveLens === '4x' ? 0.8 : objectiveLens === '10x' ? 1.0 : objectiveLens === '40x' ? 1.8 : 2.8) * digitalZoom * (isLensHovered ? 1.08 : 1.0)
                  }) translate(${lensHoverPos.x}px, ${lensHoverPos.y}px)`
                }}
              >
                {/* SPECIMEN 1: ONION PEEL CELLS */}
                {selectedSpecimenId === 'spec-onion' && (
                  <div className="w-full h-full p-4 grid grid-cols-4 grid-rows-4 gap-1.5 opacity-90">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div key={i} className="border-2 border-emerald-400/70 bg-emerald-950/40 rounded-sm relative flex items-center justify-center shadow-inner">
                        {/* Stained Nucleus */}
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500/90 absolute top-2 right-2 border border-rose-300 shadow-xs" />
                        {/* Vacuole */}
                        <div className="w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-400/20" />
                        {/* Cell Wall Cellulose Line */}
                        <div className="w-full h-0.5 bg-emerald-400/30 absolute bottom-1" />
                      </div>
                    ))}
                  </div>
                )}

                {/* SPECIMEN 2: HUMAN CHEEK SQUAMOUS EPITHELIUM */}
                {selectedSpecimenId === 'spec-cheek' && (
                  <div className="w-full h-full p-6 flex flex-wrap gap-5 items-center justify-center opacity-85">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div 
                        key={i} 
                        className="w-24 h-16 rounded-full border-2 border-blue-400/80 bg-blue-900/40 flex items-center justify-center relative shadow-md"
                        style={{ transform: `rotate(${(i * 35) % 360}deg)` }}
                      >
                        {/* Central Dark Blue Nucleus */}
                        <div className="w-3.5 h-3.5 rounded-full bg-blue-950 border-2 border-blue-300 shadow-xs" />
                        {/* Cytoplasmic Granules */}
                        <div className="w-1 h-1 rounded-full bg-blue-400/60 absolute top-3 left-4" />
                        <div className="w-1 h-1 rounded-full bg-blue-400/60 absolute bottom-3 right-5" />
                      </div>
                    ))}
                  </div>
                )}

                {/* SPECIMEN 3: LEAF STOMATA & GUARD CELLS */}
                {selectedSpecimenId === 'spec-stomata' && (
                  <div className="w-full h-full p-6 flex flex-col items-center justify-center gap-6 opacity-90">
                    <div className="w-32 h-20 rounded-full border-4 border-lime-400 bg-lime-950/60 flex items-center justify-center relative shadow-lg">
                      {/* Stomatal Aperture */}
                      <div className="w-5 h-14 rounded-full bg-black border-2 border-lime-300" />
                      {/* Chloroplasts in guard cells */}
                      <div className="absolute top-2 left-3 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-xs" />
                      <div className="absolute bottom-2 left-4 w-2 h-2 rounded-full bg-emerald-400" />
                      <div className="absolute top-2 right-3 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-xs" />
                      <div className="absolute bottom-2 right-4 w-2 h-2 rounded-full bg-emerald-400" />
                    </div>
                    {/* Subsidiary Epidermal Cells */}
                    <div className="w-48 h-8 border-2 border-emerald-500/40 rounded-xl" />
                  </div>
                )}

                {/* SPECIMEN 4: HUMAN BLOOD SMEAR */}
                {selectedSpecimenId === 'spec-blood' && (
                  <div className="w-full h-full p-6 flex flex-wrap gap-2.5 items-center justify-center">
                    {/* Multitude of Biconcave RBCs */}
                    {Array.from({ length: 32 }).map((_, i) => (
                      <div key={i} className="w-6 h-6 rounded-full border border-rose-400/70 bg-rose-600/60 flex items-center justify-center relative shadow-xs">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-950/80" />
                      </div>
                    ))}
                    {/* Polymorphonuclear Neutrophil WBC */}
                    <div className="w-12 h-12 rounded-full border-2 border-purple-400 bg-purple-900/50 flex items-center justify-center relative shadow-md">
                      <div className="w-3 h-3 rounded-full bg-purple-950 border border-purple-300 absolute top-2 left-2" />
                      <div className="w-3 h-3 rounded-full bg-purple-950 border border-purple-300 absolute bottom-2 right-2" />
                      <div className="w-2.5 h-2.5 rounded-full bg-purple-950 border border-purple-300 absolute bottom-2 left-3" />
                    </div>
                  </div>
                )}

                {/* SPECIMEN 5: SPIROGYRA ALGA */}
                {selectedSpecimenId === 'spec-spirogyra' && (
                  <div className="w-full h-full flex flex-col justify-center items-center gap-6">
                    <div className="w-64 h-16 border-2 border-emerald-400 bg-emerald-950/60 rounded-sm relative overflow-hidden flex items-center justify-around shadow-lg">
                      <div className="w-1 h-full bg-emerald-400/50" />
                      {/* Ribbon Spiral Chloroplast */}
                      <span className="text-emerald-300 font-mono text-xs font-bold tracking-widest">
                        〰️ ⬡ PYRENOID 〰️ ⬡ 〰️
                      </span>
                      <div className="w-1 h-full bg-emerald-400/50" />
                    </div>
                  </div>
                )}

                {/* SPECIMEN 6: AMOEBA PROTEUS */}
                {selectedSpecimenId === 'spec-amoeba' && (
                  <div className="w-48 h-48 rounded-full border-4 border-indigo-400/70 bg-indigo-950/60 flex items-center justify-center relative shadow-2xl">
                    <div className="w-7 h-7 rounded-full bg-purple-400 border border-purple-200 shadow-md" />
                    <span className="text-[10px] font-mono text-cyan-300 absolute bottom-4">Pseudopodia</span>
                    {/* Contractile Vacuole */}
                    <div className="w-5 h-5 rounded-full border border-cyan-400 bg-cyan-500/20 absolute top-5 right-6" />
                  </div>
                )}
              </div>

              {/* Calibrated Eyepiece Graticule / Reticle Scale Overlay */}
              {showReticle && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  {/* Circular Reticle Ring */}
                  <div className="w-72 h-72 rounded-full border border-cyan-400/30 absolute" />
                  {/* Crosshairs */}
                  <div className="w-full h-0.5 bg-cyan-400/30 absolute" />
                  <div className="h-full w-0.5 bg-cyan-400/30 absolute" />

                  {/* 10-Division Calibrated Scale Ticks on horizontal axis */}
                  <div className="w-64 flex justify-between absolute z-20">
                    {Array.from({ length: 11 }).map((_, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div className={`w-0.5 ${i % 5 === 0 ? 'h-5 bg-cyan-300' : 'h-2.5 bg-cyan-400/60'}`} />
                        {i % 5 === 0 && (
                          <span className="text-[8px] font-mono text-cyan-300 -mt-3.5">
                            {i}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Scale Bar Tag */}
                  <div className="absolute bottom-8 px-3 py-1 rounded-full bg-black/80 border border-cyan-400/40 text-[10px] font-mono text-cyan-300 font-bold">
                    Scale: 1 Division = {umPerDivision} µm
                  </div>
                </div>
              )}

              {/* Focus Warning Prompt if out of focus */}
              {focusBlurRadius > 4 && (
                <div className="absolute top-8 px-3.5 py-1.5 rounded-xl bg-black/85 border border-amber-400/60 text-amber-300 text-xs font-mono font-bold shadow-xl animate-pulse">
                  Adjust Coarse &amp; Fine Focus Knobs!
                </div>
              )}
            </div>

            {/* Interactive Focus Zoom & Optical Loupe Badge */}
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className={`text-[11px] font-mono px-3 py-1 rounded-full border transition-all flex items-center gap-1.5 ${
                isLensHovered 
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'bg-black/60 border-white/10 text-slate-400'
              }`}>
                <Eye className="w-3 h-3 text-cyan-400 animate-pulse" />
                <span>{isLensHovered ? 'Focus Zoom Active (1.08x Optical Loupe + Micro-Pan)' : 'Hover over eyepiece lens to activate Focus Zoom & Pan'}</span>
              </span>
            </div>
          </div>

          {/* Interactive Caliper Measurement Bar */}
          <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Cell Dimension Measurement:</span>
              </span>
              <span className="text-cyan-300 font-bold text-sm">
                Measured Span: {measuredDimensionUm} µm
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="95"
              value={caliperWidthPercent}
              onChange={e => setCaliperWidthPercent(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>5% Viewport Width</span>
              <span>Specimen Average: {activeSpecimen.avgCellSizeUm} µm</span>
              <span>95% Viewport Width</span>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Microscope Stage, Turret & Illumination Controls */}
        <div className="lg:col-span-4 space-y-6">
          {/* Specimen Slide Selector */}
          <div className="p-5 rounded-3xl bg-slate-950/80 border border-white/10 shadow-xl space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center justify-between">
              <span>1. Mount Prepared Slide</span>
              <span className="text-[10px] text-slate-400">Mechanical Stage</span>
            </h4>
            <select
              value={selectedSpecimenId}
              onChange={e => setSelectedSpecimenId(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            >
              {SPECIMENS_CATALOG.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.tissueType})
                </option>
              ))}
            </select>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1.5 text-xs">
              <div className="flex items-center justify-between font-mono text-[11px] text-slate-300">
                <span>Stain: <strong>{activeSpecimen.stain}</strong></span>
                <span>Avg Size: <strong>{activeSpecimen.avgCellSizeUm} µm</strong></span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">{activeSpecimen.description}</p>
              <div className="text-[10px] font-mono text-cyan-400/90 pt-1 border-t border-white/5">
                📖 {activeSpecimen.ncertReference}
              </div>
            </div>
          </div>

          {/* Objective Nosepiece Turret */}
          <div className="p-5 rounded-3xl bg-slate-950/80 border border-white/10 shadow-xl space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center justify-between">
              <span>2. Objective Lens Turret</span>
              <span className="text-[10px] font-mono text-slate-400">Eyepiece 10x</span>
            </h4>
            <div className="grid grid-cols-4 gap-1.5">
              {(['4x', '10x', '40x', '100x'] as const).map(lens => (
                <button
                  key={lens}
                  onClick={() => setObjectiveLens(lens)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    objectiveLens === lens
                      ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {lens}
                </button>
              ))}
            </div>

            {/* Digital Sensor Zoom Multiplier */}
            <div className="space-y-1.5 pt-2 border-t border-white/10">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Digital Sensor Zoom:</span>
                <span className="font-mono text-amber-300 font-bold">{digitalZoom.toFixed(1)}x</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[1.0, 1.5, 2.0, 3.0].map(z => (
                  <button
                    key={z}
                    onClick={() => setDigitalZoom(z)}
                    className={`py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      digitalZoom === z
                        ? 'bg-white/20 text-white border border-white/30'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    {z.toFixed(1)}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Coarse & Fine Focus Adjustment Knobs */}
          <div className="p-5 rounded-3xl bg-slate-950/80 border border-white/10 shadow-xl space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400 flex items-center justify-between">
              <span>3. Focal Plane Calibration</span>
              <Sliders className="w-4 h-4 text-purple-400" />
            </h4>

            {/* Coarse Focus */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Coarse Focus Knob (Z-Axis):</span>
                <span className="font-mono text-purple-300 font-bold">{coarseFocus}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={coarseFocus}
                onChange={e => setCoarseFocus(Number(e.target.value))}
                className="w-full accent-purple-400 cursor-pointer"
              />
            </div>

            {/* Fine Focus */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Fine Focus Knob (Micrometer):</span>
                <span className="font-mono text-purple-300 font-bold">{fineFocus}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={fineFocus}
                onChange={e => setFineFocus(Number(e.target.value))}
                className="w-full accent-purple-400 cursor-pointer"
              />
            </div>

            {/* Substage Condenser Diaphragm Illumination */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs text-slate-300">
                <span>LED Condenser Illumination:</span>
                <span className="font-mono text-cyan-300 font-bold">{illumination}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={illumination}
                onChange={e => setIllumination(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Optical Filter Mode */}
            <div className="space-y-1.5 pt-2 border-t border-white/10">
              <span className="text-[11px] text-slate-300 block">Contrast Filter Mode:</span>
              <div className="grid grid-cols-2 gap-1.5">
                {(['brightfield', 'fluorescence', 'darkfield', 'contrast'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setFilterMode(mode)}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-bold capitalize transition-all cursor-pointer ${
                      filterMode === mode
                        ? 'bg-purple-500 text-white font-black'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAutoFocus}
              className="w-full py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/40 text-xs font-bold transition-all cursor-pointer text-center"
            >
              Auto-Calibrate Optimal Focus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
