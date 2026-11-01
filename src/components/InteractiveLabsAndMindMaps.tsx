import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  GitBranch, 
  Cpu, 
  Eye, 
  Sparkles, 
  Zap, 
  Sliders, 
  RotateCcw, 
  Layers, 
  Download, 
  ChevronRight, 
  ChevronDown,
  Activity,
  Play,
  Pause,
  Heart,
  Search,
  Filter,
  Flame,
  Droplets,
  HelpCircle,
  Maximize2,
  Atom,
  Info,
  CheckCircle2,
  Compass,
  ArrowRight,
  Scale,
  Camera,
  Gauge,
  Thermometer,
  Shield,
  Grid,
  Check,
  RefreshCw,
  FlaskConical,
  BookOpen,
  Dna
} from 'lucide-react';
import { 
  MIND_MAPS_LIBRARY, 
  VIRTUAL_TOOLS_LIBRARY,
  MindMapItem,
  MindMapNode,
  VirtualTool,
  VirtualToolSpecimen
} from '../data/interactiveLabsData';
import { PRESCRIBED_PRACTICALS, NcertPracticalItem } from '../data/ncertPracticalsData';
import { ChemicalBalanceTool } from './labs/ChemicalBalanceTool';
import { DigitalPhMeterTool } from './labs/DigitalPhMeterTool';
import { DigitalMicroscopeTool } from './labs/DigitalMicroscopeTool';
import { ExperimentJournal } from './labs/ExperimentJournal';
import { VirtualPracticalAcademy } from '../features/virtual-lab';
import { AnatomyLabWorkspace } from '../features/anatomy-lab';
import { Studio3DSceneViewer } from '../features/threejs-studio/Studio3DSceneViewer';
import { SciLabStudio } from '../features/scilab/SciLabStudio';
import { InteractiveQuickWorkbench } from './labs/InteractiveQuickWorkbench';
import { UserProfile } from '../types';

interface InteractiveLabsProps {
  activeClass: string;
  initialSubTab?: 'virtual_academy' | 'mindmaps' | 'organs3d' | 'studio3d' | 'virtual_tools' | 'simulations' | 'journal' | 'practicals' | 'scilab';
  userProfile?: UserProfile | null;
  onGoToSciLab?: () => void;
}

export const InteractiveLabsAndMindMaps: React.FC<InteractiveLabsProps> = ({ 
  activeClass, 
  initialSubTab = 'virtual_academy',
  userProfile,
  onGoToSciLab
}) => {
  // Main Navigation Modes (Virtual Academy 3D, SciLab BioMolecular Studio, 3D Studio, Mind Maps, 3D Organs, Calibrated Virtual Tools, Simulations, Experiment Journal, Practicals)
  const [activeMainTab, setActiveMainTab] = useState<'virtual_academy' | 'mindmaps' | 'organs3d' | 'studio3d' | 'virtual_tools' | 'simulations' | 'journal' | 'practicals' | 'scilab'>(initialSubTab);

  // Live tool readings persisted for quick one-click import into Experiment Journal
  const [liveToolReadings, setLiveToolReadings] = useState<{
    phMeter?: { solutionName: string; ph: number; tempC: number; emfMv: string; hConc: string; timestamp: string };
    microscope?: { specimenName: string; tissueType: string; magnification: number; cellSizeUm: number; objective: string; timestamp: string };
    balance?: { reagentName: string; formula: string; massGrams: number; tareVessel: string; targetMolarity: number; timestamp: string };
  }>({});

  useEffect(() => {
    if (initialSubTab) {
      setActiveMainTab(initialSubTab);
    }
  }, [initialSubTab]);

  // ==========================================
  // TAB 1: MIND MAPS STATE
  // ==========================================
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('All');
  const [mindMapSearch, setMindMapSearch] = useState<string>('');
  const [selectedMindMapId, setSelectedMindMapId] = useState<string>('mm-10-sci-electricity');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'root-elec': true,
    'elec-charge': true,
    'elec-ohms': true,
    'elec-comb': true,
    'elec-heat': true,
  });
  const [selectedNodeDetails, setSelectedNodeDetails] = useState<MindMapNode | null>(null);

  const filteredMindMaps = useMemo(() => {
    return MIND_MAPS_LIBRARY.filter(m => {
      const subjMatch = selectedSubjectFilter === 'All' || m.subject === selectedSubjectFilter;
      const searchMatch = !mindMapSearch.trim() || 
        m.title.toLowerCase().includes(mindMapSearch.toLowerCase()) || 
        m.chapter.toLowerCase().includes(mindMapSearch.toLowerCase());
      return subjMatch && searchMatch;
    });
  }, [selectedSubjectFilter, mindMapSearch]);

  const activeMindMap = useMemo(() => {
    return MIND_MAPS_LIBRARY.find(m => m.id === selectedMindMapId) || MIND_MAPS_LIBRARY[0];
  }, [selectedMindMapId]);

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  const expandAllNodes = () => {
    const all: Record<string, boolean> = {};
    const traverse = (node: MindMapNode) => {
      all[node.id] = true;
      if (node.children) node.children.forEach(traverse);
    };
    traverse(activeMindMap.rootNode);
    setExpandedNodes(all);
  };

  const collapseAllNodes = () => {
    setExpandedNodes({ [activeMindMap.rootNode.id]: true });
  };

  // 3D Anatomy Lab state managed internally by AnatomyLabWorkspace

  // ==========================================
  // TAB 3: VIRTUAL TOOLS STATE
  // ==========================================
  const [selectedToolId, setSelectedToolId] = useState<string>('tool-microscope');
  
  // Microscope states
  const [selectedSpecimenId, setSelectedSpecimenId] = useState<string>('spec-onion');
  const [objectiveLens, setObjectiveLens] = useState<'4x' | '10x' | '40x' | '100x'>('10x');
  const [coarseFocus, setCoarseFocus] = useState<number>(50); // 0-100 (50 is optimal)
  const [fineFocus, setFineFocus] = useState<number>(50); // 0-100 (50 is optimal)
  const [lightIntensity, setLightIntensity] = useState<number>(80);

  // Vernier Calliper states
  const [vernierJawPosition, setVernierJawPosition] = useState<number>(2.43); // cm
  const [vernierPresetObject, setVernierPresetObject] = useState<'cylinder' | 'marble' | 'beaker'>('cylinder');

  // Titration states
  const [titrantAddedMl, setTitrantAddedMl] = useState<number>(0);
  const [titrationIndicator, setTitrationIndicator] = useState<'phenolphthalein' | 'methyl_orange' | 'universal'>('phenolphthalein');
  const [isTitratingAuto, setIsTitratingAuto] = useState<boolean>(false);

  // Flame test states
  const [activeFlameMetal, setActiveFlameMetal] = useState<string>('Na');

  // ==========================================
  // TAB 4: PHYSICS & CHEMISTRY SIMULATIONS STATE
  // ==========================================
  // Ohm's Law
  const [ohmsVoltage, setOhmsVoltage] = useState(12); // Volts
  const [ohmsResistance, setOhmsResistance] = useState(6); // Ohms
  const ohmsCurrent = (ohmsVoltage / ohmsResistance).toFixed(2);
  const ohmsPower = (ohmsVoltage * Number(ohmsCurrent)).toFixed(2);

  // Optics Lab
  const [focalLength, setFocalLength] = useState(10); // cm
  const [objectDistance, setObjectDistance] = useState(-25); // cm (convention: negative)
  const imageDistance = ((focalLength * objectDistance) / (objectDistance + focalLength)).toFixed(1);
  const magnification = (-Number(imageDistance) / objectDistance).toFixed(2);
  const isImageReal = Number(imageDistance) > 0;

  // Pendulum Lab
  const [pendulumLength, setPendulumLength] = useState(1.0); // meters
  const [gravityPreset, setGravityPreset] = useState<'earth' | 'moon' | 'jupiter'>('earth');
  const [isPendulumSwinging, setIsPendulumSwinging] = useState(true);
  const [pendulumAngle, setPendulumAngle] = useState(0);

  const gravities = { earth: 9.8, moon: 1.62, jupiter: 24.79 };
  const currentG = gravities[gravityPreset];
  const timePeriod = (2 * Math.PI * Math.sqrt(pendulumLength / currentG)).toFixed(2);
  const frequency = (1 / Number(timePeriod)).toFixed(2);

  // Pendulum oscillation loop
  useEffect(() => {
    if (!isPendulumSwinging || activeMainTab !== 'simulations') return;
    let frameId: number;
    const startTime = performance.now();

    const loop = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const omega = Math.sqrt(currentG / pendulumLength);
      const maxAngle = 25; // degrees
      const angle = maxAngle * Math.cos(omega * elapsed);
      setPendulumAngle(angle);
      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [isPendulumSwinging, pendulumLength, currentG, activeMainTab]);

  // Titration auto-drop interval
  useEffect(() => {
    if (!isTitratingAuto) return;
    const timer = setInterval(() => {
      setTitrantAddedMl(prev => {
        if (prev >= 40) {
          setIsTitratingAuto(false);
          return 40;
        }
        return Math.min(40, Number((prev + 0.5).toFixed(1)));
      });
    }, 200);
    return () => clearInterval(timer);
  }, [isTitratingAuto]);

  // Calculate Titration pH
  // Assume 25 mL of 0.1 M HCl titrated with 0.1 M NaOH
  // Equivalence point is at 25.0 mL
  const titrationCalculatedPh = useMemo(() => {
    const vAdded = titrantAddedMl;
    const vHcl = 25.0; // mL
    const mConc = 0.1; // M
    if (vAdded < vHcl) {
      const molesHLeft = (vHcl * mConc - vAdded * mConc) / 1000;
      const totalVolL = (vHcl + vAdded) / 1000;
      const concH = molesHLeft / totalVolL;
      const ph = -Math.log10(concH);
      return Math.max(1.0, Number(ph.toFixed(2)));
    } else if (vAdded === vHcl) {
      return 7.00;
    } else {
      const molesOhExcess = ((vAdded - vHcl) * mConc) / 1000;
      const totalVolL = (vHcl + vAdded) / 1000;
      const concOh = molesOhExcess / totalVolL;
      const pOh = -Math.log10(concOh);
      const ph = 14 - pOh;
      return Math.min(13.0, Number(ph.toFixed(2)));
    }
  }, [titrantAddedMl]);

  // Indicator color based on pH
  const indicatorColorInfo = useMemo(() => {
    const ph = titrationCalculatedPh;
    if (titrationIndicator === 'phenolphthalein') {
      if (ph < 8.2) return { color: '#ffffff', label: 'Colorless (Acidic)', bg: 'rgba(255, 255, 255, 0.15)' };
      if (ph < 10) return { color: '#f472b6', label: 'Faint Pink (Neutralization Endpoint!)', bg: 'rgba(244, 114, 182, 0.5)' };
      return { color: '#db2777', label: 'Deep Magenta Pink (Basic)', bg: 'rgba(219, 39, 119, 0.8)' };
    } else if (titrationIndicator === 'methyl_orange') {
      if (ph < 3.1) return { color: '#ef4444', label: 'Red (Acidic)', bg: 'rgba(239, 68, 68, 0.7)' };
      if (ph < 4.4) return { color: '#f97316', label: 'Orange (Transition)', bg: 'rgba(249, 115, 22, 0.7)' };
      return { color: '#eab308', label: 'Yellow (Equivalence reached)', bg: 'rgba(234, 179, 8, 0.7)' };
    } else {
      // Universal indicator
      if (ph < 3) return { color: '#ef4444', label: `Strong Acid (pH ${ph})`, bg: 'rgba(239, 68, 68, 0.8)' };
      if (ph < 6) return { color: '#f97316', label: `Weak Acid (pH ${ph})`, bg: 'rgba(249, 115, 22, 0.8)' };
      if (ph < 8) return { color: '#22c55e', label: `Neutral (pH ${ph})`, bg: 'rgba(34, 197, 94, 0.8)' };
      if (ph < 11) return { color: '#3b82f6', label: `Base (pH ${ph})`, bg: 'rgba(59, 130, 246, 0.8)' };
      return { color: '#a855f7', label: `Strong Alkaline (pH ${ph})`, bg: 'rgba(168, 85, 247, 0.8)' };
    }
  }, [titrationCalculatedPh, titrationIndicator]);

  // Microscope focus clarity calculation
  const focusBlurRadius = useMemo(() => {
    // Best focus is at coarse 50 and fine 50
    const coarseDiff = Math.abs(coarseFocus - 50);
    const fineDiff = Math.abs(fineFocus - 50);
    const blur = (coarseDiff * 0.2 + fineDiff * 0.08);
    return Math.min(16, Number(blur.toFixed(1)));
  }, [coarseFocus, fineFocus]);

  // ==========================================
  // TAB 6: PRESCRIBED PRACTICAL CATALOGUE STATE
  // ==========================================
  const [selectedPracticalId, setSelectedPracticalId] = useState<string>('c10_ph_testing');
  const [practicalSubjectFilter, setPracticalSubjectFilter] = useState<string>('All');
  const [practicalClassFilter, setPracticalClassFilter] = useState<string>(activeClass || 'Class 10');
  const [practicalSearchQuery, setPracticalSearchQuery] = useState<string>('');
  const [revealedVivaAnswers, setRevealedVivaAnswers] = useState<Record<number, boolean>>({});

  const filteredPracticals = useMemo(() => {
    return PRESCRIBED_PRACTICALS.filter(p => {
      const classMatch = practicalClassFilter === 'All' || p.classGrade === practicalClassFilter;
      const subjMatch = practicalSubjectFilter === 'All' || p.subject === practicalSubjectFilter;
      const searchMatch = !practicalSearchQuery || 
        p.title.toLowerCase().includes(practicalSearchQuery.toLowerCase()) || 
        p.chapter.toLowerCase().includes(practicalSearchQuery.toLowerCase());
      return classMatch && subjMatch && searchMatch;
    });
  }, [practicalClassFilter, practicalSubjectFilter, practicalSearchQuery]);

  const activePractical = useMemo(() => {
    return PRESCRIBED_PRACTICALS.find(p => p.id === selectedPracticalId) || filteredPracticals[0] || PRESCRIBED_PRACTICALS[0];
  }, [selectedPracticalId, filteredPracticals]);

  // Render Mind Map Recursive Node
  const renderMindMapNode = (node: MindMapNode, level: number = 0) => {
    const isExpanded = Boolean(expandedNodes[node.id]);
    const hasChildren = Boolean(node.children && node.children.length > 0);
    const isSelected = selectedNodeDetails?.id === node.id;

    const levelColors = [
      'bg-amber-500/20 border-amber-400 text-amber-200 hover:bg-amber-500/30 shadow-lg shadow-amber-500/10',
      'bg-indigo-500/15 border-indigo-400/60 text-indigo-200 hover:bg-indigo-500/25',
      'bg-cyan-500/10 border-cyan-400/40 text-cyan-200 hover:bg-cyan-500/20',
      'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
    ];

    const currentStyle = levelColors[Math.min(level, levelColors.length - 1)];

    return (
      <div key={node.id} className="space-y-2">
        <div 
          onClick={() => {
            setSelectedNodeDetails(node);
            if (hasChildren) toggleNode(node.id);
          }}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${currentStyle} ${
            isSelected ? 'ring-2 ring-white shadow-xl scale-[1.01]' : ''
          }`}
          style={{ marginLeft: `${level * 18}px` }}
        >
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              {hasChildren && (
                <span className="text-amber-400 p-0.5 rounded-md hover:bg-white/10">
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </span>
              )}
              <span className={`font-bold ${level === 0 ? 'text-base text-white' : level === 1 ? 'text-sm text-white' : 'text-xs text-slate-100'}`}>
                {node.label}
              </span>
              {node.formula && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  Formula
                </span>
              )}
            </div>

            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
              {node.description}
            </p>

            {node.formula && (
              <div className="text-xs font-mono text-amber-300 bg-black/40 px-3 py-1.5 rounded-xl border border-amber-400/30 inline-block">
                {node.formula}
              </div>
            )}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="border-l-2 border-dashed border-white/10 pl-2 space-y-2 ml-4">
            {node.children!.map(child => renderMindMapNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header & Main Tabs */}
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-1 font-bold">
            <Sparkles className="w-4 h-4" />
            <span>Interactive Science Lab & 3D Visualization Hub</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Virtual Laboratories & Experiential Learning
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Fully interactive hands-on physics circuits, chemical titrations, optical microscopes, and 3D organ anatomy with direct MongoDB cloud persistence.
          </p>
        </div>
      </div>

      {/* 1. VISIBLE INTERACTIVE QUICK EXPERIMENT WORKBENCH (ALWAYS INTERACTIVE & ACCESSIBLE) */}
      <InteractiveQuickWorkbench 
        userProfile={userProfile}
        onRecordReading={(reading) => {
          if (reading.tool === 'circuit') {
            // Persist into liveToolReadings
            setLiveToolReadings(prev => ({
              ...prev,
              balance: prev.balance,
              microscope: prev.microscope,
            }));
          } else if (reading.tool === 'titration') {
            setLiveToolReadings(prev => ({
              ...prev,
              phMeter: {
                solutionName: '0.1 M HCl / NaOH Titration Solution',
                ph: reading.data?.observations?.[3]?.metricValue ? parseFloat(reading.data.observations[3].metricValue) : 7.0,
                tempC: 25.0,
                emfMv: '0.0',
                hConc: '1.0e-7',
                timestamp: new Date().toISOString()
              }
            }));
          } else if (reading.tool === 'microscope') {
            setLiveToolReadings(prev => ({
              ...prev,
              microscope: {
                specimenName: reading.data?.observations?.[0]?.metricValue || 'Cell Slide',
                tissueType: 'Epithelium',
                magnification: 100,
                cellSizeUm: 45,
                objective: '10x',
                timestamp: new Date().toISOString()
              }
            }));
          }
        }}
        onNavigateTab={(tab) => setActiveMainTab(tab)}
      />

      {/* 2. SIMPLIFIED PRIMARY LAB STUDIOS SELECTOR */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>Select Specialized Laboratory Studio</span>
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            Active: <strong className="text-white capitalize">{activeMainTab.replace('_', ' ')}</strong>
          </span>
        </div>

        {/* 4 Primary High-Yield Studios */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => setActiveMainTab('virtual_academy')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
              activeMainTab === 'virtual_academy'
                ? 'bg-gradient-to-br from-purple-900/60 to-indigo-900/60 border-purple-400 text-white shadow-xl shadow-purple-900/30 ring-1 ring-purple-400 scale-[1.02]'
                : 'bg-slate-900/70 border-white/5 text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-purple-500/30 text-purple-200 font-bold">
                STAGES 1–6
              </span>
            </div>
            <div className="font-bold text-sm text-white">3D Practical Academy</div>
            <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">Physics, Chemistry & Biology 3D Workbench</div>
          </button>

          <button
            onClick={() => setActiveMainTab('organs3d')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
              activeMainTab === 'organs3d'
                ? 'bg-gradient-to-br from-rose-950/70 to-pink-950/70 border-rose-400 text-white shadow-xl shadow-rose-900/30 ring-1 ring-rose-400 scale-[1.02]'
                : 'bg-slate-900/70 border-white/5 text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30">
                <Heart className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-rose-500/30 text-rose-200 font-bold">
                DISSECTION
              </span>
            </div>
            <div className="font-bold text-sm text-white">3D Organs & Anatomy</div>
            <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">Heart, Kidney, Brain, Liver & ECG</div>
          </button>

          <button
            onClick={() => setActiveMainTab('virtual_tools')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
              activeMainTab === 'virtual_tools'
                ? 'bg-gradient-to-br from-cyan-950/70 to-blue-950/70 border-cyan-400 text-white shadow-xl shadow-cyan-900/30 ring-1 ring-cyan-400 scale-[1.02]'
                : 'bg-slate-900/70 border-white/5 text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                <Sliders className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-cyan-500/30 text-cyan-200 font-bold">
                CALIBRATED
              </span>
            </div>
            <div className="font-bold text-sm text-white">Digital Instruments</div>
            <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">pH Meter, Precision Balance, Microscope</div>
          </button>

          <button
            onClick={() => setActiveMainTab('journal')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
              activeMainTab === 'journal'
                ? 'bg-gradient-to-br from-emerald-950/70 to-teal-950/70 border-emerald-400 text-white shadow-xl shadow-emerald-900/30 ring-1 ring-emerald-400 scale-[1.02]'
                : 'bg-slate-900/70 border-white/5 text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/30 text-emerald-200 font-bold">
                MONGODB SYNC
              </span>
            </div>
            <div className="font-bold text-sm text-white">Experiment Journal</div>
            <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">Observations, Calculations & PDF Reports</div>
          </button>
        </div>

        {/* Secondary Quick-Pills for Specialized Studios */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs text-slate-400 font-semibold mr-1">More Studios:</span>

          <button
            onClick={() => setActiveMainTab('scilab')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMainTab === 'scilab'
                ? 'bg-teal-500 text-white shadow-md'
                : 'bg-teal-500/10 border border-teal-500/30 text-teal-300 hover:bg-teal-500/20'
            }`}
          >
            <Dna className="w-3.5 h-3.5 text-teal-400" />
            <span>SciLab (BioMolecular 3D)</span>
          </button>

          <button
            onClick={() => setActiveMainTab('studio3d')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMainTab === 'studio3d'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'bg-slate-800/80 border border-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <Atom className="w-3.5 h-3.5 text-amber-400" />
            <span>Three.js 3D PBR Studio</span>
          </button>

          <button
            onClick={() => setActiveMainTab('mindmaps')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMainTab === 'mindmaps'
                ? 'bg-indigo-500 text-white shadow-md'
                : 'bg-slate-800/80 border border-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
            <span>Concept Mind Maps</span>
          </button>

          <button
            onClick={() => setActiveMainTab('practicals')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMainTab === 'practicals'
                ? 'bg-purple-500 text-white shadow-md'
                : 'bg-slate-800/80 border border-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5 text-purple-400" />
            <span>NCERT Practicals Directory</span>
          </button>

          <button
            onClick={() => setActiveMainTab('simulations')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMainTab === 'simulations'
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-slate-800/80 border border-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            <span>Physics & Chem Simulations</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 0. SCILAB BIOMOLECULAR & MOLECULAR DYNAMICS 3D WORKBENCH */}
      {/* ========================================================= */}
      {activeMainTab === 'scilab' && (
        <div className="rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
          <SciLabStudio />
        </div>
      )}

      {/* ========================================================= */}
      {/* 0. 3D VIRTUAL PRACTICAL ACADEMY MULTI-STAGE WORKFLOWS */}
      {/* ========================================================= */}
      {activeMainTab === 'virtual_academy' && (
        <VirtualPracticalAcademy activeClass={activeClass} userProfile={userProfile} />
      )}

      {/* ========================================================= */}
      {/* 0B. THREE.JS 3D PBR STUDIO (ZERO OCCLUSION CONTROLS) */}
      {/* ========================================================= */}
      {activeMainTab === 'studio3d' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl astra-card border border-amber-400/30 bg-amber-400/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-lg font-bold">
                <Atom className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Interactive 3D Science Studio</span>
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full font-mono font-bold">
                    PBR PROCEDURAL
                  </span>
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  High-precision procedural subjects with studio lighting reflections, component exploded views, and zero-viewport occlusion controls.
                </p>
              </div>
            </div>
          </div>

          <Studio3DSceneViewer />
        </div>
      )}


      {/* ========================================================= */}
      {/* 1. MIND MAPS LIBRARY VIEW */}
      {/* ========================================================= */}
      {activeMainTab === 'mindmaps' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/70 border border-white/10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1 mr-2">
                <Filter className="w-3.5 h-3.5" /> Subject:
              </span>
              {['All', 'Physics', 'Chemistry', 'Biology', 'Mathematics'].map(subj => (
                <button
                  key={subj}
                  onClick={() => setSelectedSubjectFilter(subj)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedSubjectFilter === subj
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {subj}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search mind maps & topics..."
                  value={mindMapSearch}
                  onChange={e => setMindMapSearch(e.target.value)}
                  className="pl-9 pr-3 py-1.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 w-56"
                />
              </div>

              <button
                onClick={expandAllNodes}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 transition-colors cursor-pointer"
              >
                Expand All
              </button>
              <button
                onClick={collapseAllNodes}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 transition-colors cursor-pointer"
              >
                Collapse
              </button>
            </div>
          </div>

          {/* 2-Column Split: Chapter Selector & Visual Tree */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Mind Maps Catalog */}
            <div className="lg:col-span-4 space-y-3 max-h-[750px] overflow-y-auto pr-1">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2 font-bold flex items-center justify-between">
                <span>Mind Maps Catalog ({filteredMindMaps.length})</span>
                <span className="text-amber-400">{activeClass} Prescribed</span>
              </div>

              {filteredMindMaps.map(m => {
                const isSelected = m.id === selectedMindMapId;
                return (
                  <div
                    key={m.id}
                    onClick={() => {
                      setSelectedMindMapId(m.id);
                      setSelectedNodeDetails(m.rootNode);
                      setExpandedNodes({ [m.rootNode.id]: true });
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400/15 border-amber-400/80 shadow-lg shadow-amber-400/10'
                        : 'bg-slate-900/60 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold uppercase ${
                        m.subject === 'Physics' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        m.subject === 'Chemistry' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        m.subject === 'Biology' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                        'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}>
                        {m.subject} • {m.classGrade}
                      </span>
                      <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                    </div>

                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                      {m.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                      {m.chapter}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Mind Map Interactive Tree & Node Inspector */}
            <div className="lg:col-span-8 space-y-6">
              <div className="p-6 rounded-3xl bg-slate-950/80 border border-white/10 shadow-2xl relative">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                  <div>
                    <span className="text-xs font-mono text-amber-400 font-bold uppercase">
                      {activeMindMap.subject} • {activeMindMap.chapter}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1">
                      {activeMindMap.title}
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400 hidden sm:inline">
                    Click any node to reveal formulas and CBSE notes
                  </span>
                </div>

                {/* Tree Visualization Container */}
                <div className="space-y-3 max-h-[580px] overflow-y-auto pr-2">
                  {renderMindMapNode(activeMindMap.rootNode, 0)}
                </div>
              </div>

              {/* Node Inspector Bar */}
              {selectedNodeDetails && (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-indigo-950/40 border border-amber-400/40 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono text-amber-300 font-bold uppercase flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Concept Inspector
                    </span>
                    {selectedNodeDetails.formula && (
                      <span className="text-xs font-mono text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-lg border border-amber-400/40">
                        {selectedNodeDetails.formula}
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-white">
                    {selectedNodeDetails.label}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedNodeDetails.description}
                  </p>
                  {selectedNodeDetails.examAlert && (
                    <div className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/30 p-2.5 rounded-xl font-semibold mt-2 flex items-center gap-2">
                      <AlertIcon />
                      <span>{selectedNodeDetails.examAlert}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. 3D ORGANS & TEXTBOOK-VERIFIED ANATOMY LAB */}
      {/* ========================================================= */}
      {activeMainTab === 'organs3d' && (
        <AnatomyLabWorkspace activeClass={activeClass} />
      )}

      {/* ========================================================= */}
      {/* 3. VIRTUAL SCIENCE TOOLS & APPARATUS VIEW */}
      {/* ========================================================= */}
      {activeMainTab === 'virtual_tools' && (
        <div className="space-y-6">
          {/* Tool Category Selector */}
          <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-slate-950/70 border border-white/10">
            {VIRTUAL_TOOLS_LIBRARY.map(tool => {
              const isSelected = tool.id === selectedToolId;
              return (
                <button
                  key={tool.id}
                  onClick={() => setSelectedToolId(tool.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 scale-[1.02]'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{tool.name.split('(')[0].trim()}</span>
                </button>
              );
            })}
          </div>

          {/* TOOL 1: CALIBRATED DIGITAL OPTICAL MICROSCOPE */}
          {selectedToolId === 'tool-microscope' && (
            <DigitalMicroscopeTool
              onLogToJournal={(reading) => {
                setLiveToolReadings(prev => ({ ...prev, microscope: reading }));
              }}
              onOpenJournal={() => setActiveMainTab('journal')}
            />
          )}

          {/* TOOL 2: PRECISION DIGITAL ANALYTICAL CHEMICAL BALANCE */}
          {selectedToolId === 'tool-chemical-balance' && (
            <ChemicalBalanceTool
              onLogToJournal={(reading) => {
                setLiveToolReadings(prev => ({ ...prev, balance: reading }));
              }}
              onOpenJournal={() => setActiveMainTab('journal')}
            />
          )}

          {/* TOOL 3: CALIBRATED DIGITAL BENCHTOP PH METER */}
          {selectedToolId === 'tool-ph-meter' && (
            <DigitalPhMeterTool
              onLogToJournal={(reading) => {
                setLiveToolReadings(prev => ({ ...prev, phMeter: reading }));
              }}
              onOpenJournal={() => setActiveMainTab('journal')}
            />
          )}

          {/* TOOL 2: ACID-BASE TITRATION & PH CURVE */}
          {selectedToolId === 'tool-titration' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 rounded-3xl bg-slate-950 border border-white/10 p-6 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="text-xs font-mono text-pink-400 font-bold uppercase">Quantitative Volumetric Analysis</span>
                    <h3 className="text-lg font-bold text-white">HCl (Analyte) vs 0.1 M NaOH (Titrant) Titration</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-3 py-1 rounded-xl bg-black border border-pink-400/40 text-pink-300 font-bold">
                      pH: {titrationCalculatedPh}
                    </span>
                  </div>
                </div>

                {/* Simulated Conical Flask and Burette */}
                <div className="flex flex-col items-center justify-center py-6 space-y-4">
                  {/* Graduated Burette Tube */}
                  <div className="w-10 h-44 rounded-t-lg border-2 border-slate-600 bg-slate-900/60 relative overflow-hidden flex flex-col justify-end">
                    <div 
                      className="w-full bg-blue-500/40 transition-all duration-200"
                      style={{ height: `${Math.max(0, 100 - (titrantAddedMl / 40) * 100)}%` }}
                    />
                    <span className="absolute top-2 left-1 text-[9px] font-mono text-slate-400">0 mL</span>
                    <span className="absolute bottom-2 left-1 text-[9px] font-mono text-slate-400">40 mL</span>
                  </div>

                  {/* Conical Flask */}
                  <div 
                    className="w-48 h-36 border-4 border-slate-500 rounded-b-3xl relative overflow-hidden flex items-end justify-center transition-all duration-300"
                    style={{
                      clipPath: 'polygon(35% 0%, 65% 0%, 100% 100%, 0% 100%)',
                      backgroundColor: indicatorColorInfo.bg
                    }}
                  >
                    <span className="text-xs font-bold text-slate-950 mb-4 px-2 py-1 rounded bg-white/70">
                      {indicatorColorInfo.label}
                    </span>
                  </div>
                </div>

                {/* pH Real-Time Curve Summary */}
                <div className="p-4 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between">
                  <span className="text-xs text-slate-300">
                    Titrant (0.1 M NaOH) Added: <strong className="text-pink-300">{titrantAddedMl} mL</strong>
                  </span>
                  <span className="text-xs text-slate-300">
                    Equivalence Point: <strong className="text-emerald-400">25.0 mL (Neutral pH 7.0)</strong>
                  </span>
                </div>
              </div>

              {/* Titration Controls */}
              <div className="lg:col-span-4 space-y-6">
                <div className="p-6 rounded-3xl bg-slate-950/80 border border-white/10 shadow-2xl space-y-5">
                  <h4 className="text-sm font-mono text-pink-400 font-bold uppercase">Burette & Indicator Controls</h4>

                  <div className="space-y-2">
                    <label className="text-xs text-slate-300 font-semibold">Indicator Dye:</label>
                    <select
                      value={titrationIndicator}
                      onChange={e => setTitrationIndicator(e.target.value as any)}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                    >
                      <option value="phenolphthalein">Phenolphthalein (Colorless → Pink at pH 8.2)</option>
                      <option value="methyl_orange">Methyl Orange (Red → Yellow)</option>
                      <option value="universal">Universal Indicator (Full spectrum pH 1-14)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-slate-300 font-semibold">Add Titrant (NaOH):</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setTitrantAddedMl(prev => Math.min(40, Number((prev + 1.0).toFixed(1))))}
                        className="p-2.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 text-xs font-bold border border-pink-500/40 cursor-pointer"
                      >
                        + 1.0 mL Tap
                      </button>
                      <button
                        onClick={() => setTitrantAddedMl(prev => Math.min(40, Number((prev + 0.1).toFixed(1))))}
                        className="p-2.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 text-xs font-bold border border-pink-500/40 cursor-pointer"
                      >
                        + 0.1 mL Drop
                      </button>
                    </div>

                    <button
                      onClick={() => setIsTitratingAuto(!isTitratingAuto)}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isTitratingAuto ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-200'
                      }`}
                    >
                      {isTitratingAuto ? 'Stop Continuous Titration' : 'Start Continuous Burette Flow'}
                    </button>

                    <button
                      onClick={() => {
                        setTitrantAddedMl(0);
                        setIsTitratingAuto(false);
                      }}
                      className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 text-xs font-semibold cursor-pointer"
                    >
                      Reset Flask & Burette
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TOOL 3: FLAME TEST & EMISSION SPECTRA */}
          {selectedToolId === 'tool-flame-test' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 rounded-3xl bg-slate-950 border border-white/10 p-6 space-y-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="text-xs font-mono text-amber-400 font-bold uppercase">Atomic Spectroscopy Lab</span>
                    <h3 className="text-lg font-bold text-white">Bunsen Flame Color & Quantum Emission Lines</h3>
                  </div>
                </div>

                {/* Bunsen Burner Flame Canvas */}
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-24 h-48 relative flex items-center justify-center">
                    {/* Flame shape with dynamic color */}
                    <div 
                      className="w-20 h-40 rounded-full blur-md transition-all duration-300"
                      style={{
                        backgroundColor: 
                          activeFlameMetal === 'Na' ? '#fbbf24' :
                          activeFlameMetal === 'Cu' ? '#06b6d4' :
                          activeFlameMetal === 'K' ? '#c084fc' :
                          activeFlameMetal === 'Ca' ? '#f97316' :
                          activeFlameMetal === 'Ba' ? '#84cc16' : '#ef4444'
                      }}
                    />
                    <div className="w-8 h-20 rounded-full bg-blue-500 blur-sm absolute bottom-2" />
                  </div>
                  {/* Bunsen Metal Base */}
                  <div className="w-16 h-12 bg-slate-700 border-2 border-slate-500 rounded-t-md" />
                  <div className="w-28 h-4 bg-slate-800 rounded-full" />
                </div>

                {/* Spectral Wavelength Bar */}
                <div className="p-4 rounded-2xl bg-black/80 border border-white/10 space-y-1">
                  <div className="flex justify-between text-xs font-mono text-slate-400">
                    <span>Atomic Emission Spectrum:</span>
                    <span className="text-amber-400 font-bold">
                      {activeFlameMetal === 'Na' ? '589.0 nm (D-lines)' :
                       activeFlameMetal === 'Cu' ? '510.5 nm & 521.8 nm' :
                       activeFlameMetal === 'K' ? '766.5 nm (Lilac)' :
                       activeFlameMetal === 'Ca' ? '622.0 nm (Brick Red)' :
                       activeFlameMetal === 'Ba' ? '553.5 nm (Apple Green)' : '606.0 nm'}
                    </span>
                  </div>
                  <div className="h-4 rounded-full bg-gradient-to-r from-violet-600 via-emerald-500 via-amber-400 to-rose-600" />
                </div>
              </div>

              {/* Metal Cation Salt Pickers */}
              <div className="lg:col-span-4 space-y-4">
                <div className="p-6 rounded-3xl bg-slate-950/80 border border-white/10 shadow-2xl space-y-3">
                  <h4 className="text-sm font-mono text-amber-400 font-bold uppercase">Select Metal Salt (Platinum Wire):</h4>
                  {[
                    { id: 'Na', name: 'Sodium (NaCl)', colorText: 'Golden Yellow (589 nm)', bg: 'bg-amber-400' },
                    { id: 'Cu', name: 'Copper (CuSO₄)', colorText: 'Greenish-Blue (510 nm)', bg: 'bg-cyan-400' },
                    { id: 'K', name: 'Potassium (KCl)', colorText: 'Lilac / Violet (766 nm)', bg: 'bg-purple-400' },
                    { id: 'Ca', name: 'Calcium (CaCl₂)', colorText: 'Brick Red (622 nm)', bg: 'bg-orange-500' },
                    { id: 'Ba', name: 'Barium (BaCl₂)', colorText: 'Apple Green (553 nm)', bg: 'bg-lime-400' },
                    { id: 'Sr', name: 'Strontium (SrCl₂)', colorText: 'Crimson Red (606 nm)', bg: 'bg-rose-600' }
                  ].map(m => (
                    <button
                      key={m.id}
                      onClick={() => setActiveFlameMetal(m.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        activeFlameMetal === m.id
                          ? 'bg-amber-400/20 border-amber-400 text-white font-bold'
                          : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${m.bg}`} />
                        <span className="text-xs">{m.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{m.colorText}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TOOL 4: VERNIER CALLIPERS */}
          {selectedToolId === 'tool-vernier' && (
            <div className="rounded-3xl bg-slate-950 border border-white/10 p-6 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs font-mono text-cyan-400 font-bold uppercase">Physics Practical Unit 1</span>
                  <h3 className="text-lg font-bold text-white">Vernier Callipers Measurement Simulator</h3>
                </div>
                <div className="text-xs font-mono px-3 py-1.5 rounded-xl bg-black border border-cyan-400/40 text-cyan-300 font-bold">
                  Total Reading: {vernierJawPosition.toFixed(2)} cm (MSR + VSR × 0.01)
                </div>
              </div>

              {/* Interactive Scale */}
              <div className="p-8 rounded-2xl bg-black/90 border border-white/10 space-y-4">
                <div className="relative h-20 border-b-2 border-white flex items-end">
                  {/* Millimeter Ticks */}
                  {Array.from({ length: 41 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`border-l border-white ${i % 10 === 0 ? 'h-10 text-[10px] font-mono text-white' : i % 5 === 0 ? 'h-6' : 'h-3'}`}
                      style={{ width: '2.5%' }}
                    >
                      {i % 10 === 0 && <span className="absolute -top-5">{i / 10}</span>}
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Move Vernier Jaw (cm):</span>
                    <span className="font-mono text-cyan-300">{vernierJawPosition.toFixed(2)} cm</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="4"
                    step="0.01"
                    value={vernierJawPosition}
                    onChange={e => setVernierJawPosition(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. PHYSICS & CHEMISTRY SIMULATIONS VIEW */}
      {/* ========================================================= */}
      {activeMainTab === 'simulations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ohm's Law Lab */}
          <div className="p-6 rounded-3xl bg-slate-950 border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Ohm's Law: V = I · R</span>
              </h3>
              <span className="text-xs font-mono text-amber-400 font-bold">{ohmsCurrent} Amperes</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>DC Voltage (V):</span>
                  <span className="font-mono text-amber-300">{ohmsVoltage} V</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="24"
                  value={ohmsVoltage}
                  onChange={e => setOhmsVoltage(Number(e.target.value))}
                  className="w-full accent-amber-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Resistance (R):</span>
                  <span className="font-mono text-amber-300">{ohmsResistance} Ω</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={ohmsResistance}
                  onChange={e => setOhmsResistance(Number(e.target.value))}
                  className="w-full accent-amber-400"
                />
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300 flex justify-between">
                <span>Power Dissipation:</span>
                <span className="font-mono text-amber-300 font-bold">{ohmsPower} Watts</span>
              </div>
            </div>
          </div>

          {/* Convex Lens Ray Optics */}
          <div className="p-6 rounded-3xl bg-slate-950 border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-400" />
                <span>Convex Lens: 1/v - 1/u = 1/f</span>
              </h3>
              <span className="text-xs font-mono text-purple-400 font-bold">v = {imageDistance} cm</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Focal Length (f):</span>
                  <span className="font-mono text-purple-300">{focalLength} cm</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="25"
                  value={focalLength}
                  onChange={e => setFocalLength(Number(e.target.value))}
                  className="w-full accent-purple-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Object Distance (u):</span>
                  <span className="font-mono text-purple-300">{objectDistance} cm</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="-5"
                  value={objectDistance}
                  onChange={e => setObjectDistance(Number(e.target.value))}
                  className="w-full accent-purple-400"
                />
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300 flex justify-between">
                <span>Magnification (m):</span>
                <span className="font-mono text-purple-300 font-bold">{magnification} ({isImageReal ? 'Real & Inverted' : 'Virtual & Erect'})</span>
              </div>
            </div>
          </div>

          {/* Simple Pendulum */}
          <div className="p-6 rounded-3xl bg-slate-950 border border-white/10 space-y-4 shadow-xl md:col-span-2">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Simple Harmonic Oscillator (T = 2π√(L/g))</span>
              </h3>
              <span className="text-xs font-mono text-emerald-400 font-bold">Period T = {timePeriod} s</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>String Length (L):</span>
                  <span className="font-mono text-emerald-300">{pendulumLength} m</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="3.0"
                  step="0.1"
                  value={pendulumLength}
                  onChange={e => setPendulumLength(Number(e.target.value))}
                  className="w-full accent-emerald-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 mb-1 block">Celestial Gravity Field:</label>
                <div className="flex gap-1.5">
                  {(['earth', 'moon', 'jupiter'] as const).map(p => (
                    <button
                      key={p}
                      onClick={() => setGravityPreset(p)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                        gravityPreset === p ? 'bg-emerald-500 text-slate-950' : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300 flex justify-between items-center">
                <span>Oscillation Angle:</span>
                <span className="font-mono text-emerald-300 font-bold">{pendulumAngle.toFixed(1)}°</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. EXPERIMENT JOURNAL & OFFICIAL PDF LAB REPORT VIEW */}
      {/* ========================================================= */}
      {activeMainTab === 'journal' && (
        <ExperimentJournal
          activeClass={activeClass}
          userProfile={userProfile}
          liveToolReadings={liveToolReadings}
          onSwitchToTool={(toolId) => {
            setSelectedToolId(toolId);
            setActiveMainTab('virtual_tools');
          }}
        />
      )}

      {/* ========================================================= */}
      {/* 6. OFFICIAL PRESCRIBED PRACTICAL CATALOGUE VIEW */}
      {/* ========================================================= */}
      {activeMainTab === 'practicals' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Top Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900/30 via-slate-900 to-slate-950 border border-purple-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  CBSE &amp; NCERT Syllabus
                </span>
                <span className="text-xs text-slate-400">Class 9–12 Science Practical Manual</span>
              </div>
              <h3 className="text-xl font-black text-white">Prescribed Laboratory Practical Catalogue</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                Every mandatory NCERT physics, chemistry, and biology laboratory experiment with complete apparatus specs, safety protocols, sample observation tables, viva questions, and links to interactive virtual instruments.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveMainTab('journal')}
                className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>My Practical Journal</span>
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Class:</span>
              {['All', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map(cls => (
                <button
                  key={cls}
                  onClick={() => setPracticalClassFilter(cls)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    practicalClassFilter === cls
                      ? 'bg-purple-500 text-white shadow-sm'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cls}
                </button>
              ))}

              <span className="text-xs font-bold text-slate-400 ml-2">Subject:</span>
              {['All', 'Science', 'Physics', 'Chemistry', 'Biology'].map(subj => (
                <button
                  key={subj}
                  onClick={() => setPracticalSubjectFilter(subj)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    practicalSubjectFilter === subj
                      ? 'bg-purple-500 text-white shadow-sm'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {subj}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={practicalSearchQuery}
                onChange={(e) => setPracticalSearchQuery(e.target.value)}
                placeholder="Search experiments..."
                className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-purple-400"
              />
            </div>
          </div>

          {/* 2-Column Layout: Practicals List & Detail Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Practical List */}
            <div className="lg:col-span-5 space-y-2.5 max-h-[850px] overflow-y-auto pr-1">
              {filteredPracticals.map(p => {
                const isSelected = p.id === activePractical?.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPracticalId(p.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-500/15 border-purple-400 shadow-lg shadow-purple-500/10'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] mb-1.5">
                      <span className="font-bold uppercase text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-md border border-purple-500/30">
                        {p.classGrade} • {p.subject}
                      </span>
                      <span className="font-semibold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>NCERT Verified</span>
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-2">
                      {p.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                      Chapter: {p.chapter}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Right: Selected Practical Full Details */}
            {activePractical && (
              <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase text-purple-400 tracking-wider">
                      {activePractical.classGrade} • {activePractical.subject} • {activePractical.chapter}
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-white mt-1">
                      {activePractical.title}
                    </h3>
                  </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => setActiveMainTab('virtual_academy')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Open 3D Practical Academy</span>
                      </button>
                      {activePractical.linkedTool && (
                        <button
                          onClick={() => {
                            if (activePractical.linkedTool === 'microscope') {
                              setSelectedToolId('microscope');
                              setActiveMainTab('virtual_tools');
                            } else if (activePractical.linkedTool === 'balance') {
                              setSelectedToolId('balance');
                              setActiveMainTab('virtual_tools');
                            } else if (activePractical.linkedTool === 'ph_meter') {
                              setSelectedToolId('ph_meter');
                              setActiveMainTab('virtual_tools');
                            } else {
                              setActiveMainTab('simulations');
                            }
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition-all cursor-pointer shrink-0"
                        >
                          <Sliders className="w-3.5 h-3.5" />
                          <span>Tool Spec</span>
                        </button>
                      )}
                    </div>
                  </div>

                {/* Objective */}
                <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs">
                  <strong className="text-purple-300 block mb-1 uppercase font-black text-[10px] tracking-wider">Learning Objective:</strong>
                  <span className="text-slate-200 leading-relaxed">{activePractical.objective}</span>
                </div>

                {/* Apparatus & Safety */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <h5 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-blue-400" />
                      <span>Apparatus &amp; Materials</span>
                    </h5>
                    <ul className="space-y-1 text-slate-400">
                      {activePractical.apparatus.map((app, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{app}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <h5 className="font-bold text-rose-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-rose-400" />
                      <span>Safety Precautions</span>
                    </h5>
                    <ul className="space-y-1 text-slate-400">
                      {activePractical.safetyPrecautions.map((safe, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-rose-400 font-bold">•</span>
                          <span>{safe}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Step-by-Step Procedure */}
                <div className="space-y-2">
                  <h5 className="font-bold text-white text-xs uppercase tracking-wider">Step-by-Step Laboratory Procedure</h5>
                  <div className="space-y-1.5 text-xs">
                    {activePractical.procedureSteps.map((step, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 font-bold font-mono text-[11px] flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-slate-300 leading-relaxed">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sample Observation Table */}
                <div className="space-y-2">
                  <h5 className="font-bold text-white text-xs uppercase tracking-wider">Standard Observation Table</h5>
                  <div className="overflow-x-auto rounded-xl border border-slate-800">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                        <tr>
                          {activePractical.observationHeaders.map((head, i) => (
                            <th key={i} className="p-2.5 font-bold">{head}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 bg-slate-900/40 text-slate-300 font-mono text-[11px]">
                        {activePractical.sampleObservations.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-800/40">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="p-2.5">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Governing Calculations & Expected Outcome */}
                {activePractical.calculationsFormula && (
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-purple-500/20 text-xs">
                    <span className="text-[10px] font-bold uppercase text-purple-400 block mb-1">Calculations &amp; Governing Equations:</span>
                    <span className="font-mono text-purple-200">{activePractical.calculationsFormula}</span>
                  </div>
                )}

                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                  <strong className="block mb-0.5 text-emerald-400">Expected Experimental Outcome:</strong>
                  <span>{activePractical.expectedOutcome}</span>
                </div>

                {/* Viva Voce Questions */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <h5 className="font-bold text-amber-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Viva Voce Oral Examination Questions</span>
                  </h5>
                  <div className="space-y-2">
                    {activePractical.vivaQuestions.map((viva, vIdx) => {
                      const isRevealed = Boolean(revealedVivaAnswers[vIdx]);
                      return (
                        <div key={vIdx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 text-xs">
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-slate-200">
                              <span className="text-amber-400 mr-1.5">Q{vIdx + 1}.</span> {viva.question}
                            </span>
                            <button
                              onClick={() => setRevealedVivaAnswers(prev => ({ ...prev, [vIdx]: !prev[vIdx] }))}
                              className="text-[10px] text-amber-400 hover:text-amber-300 font-bold shrink-0 cursor-pointer"
                            >
                              {isRevealed ? 'Hide Answer' : 'Reveal Answer'}
                            </button>
                          </div>
                          {isRevealed && (
                            <p className="text-emerald-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800 animate-in fade-in">
                              <strong>Answer: </strong> {viva.answer}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

function AlertIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}
