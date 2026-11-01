import React, { useState, useMemo } from 'react';
import { OrganModelSpec, AnatomicalStructure, AnatomyViewerMode } from '../types/anatomy';
import { ANATOMY_ORGAN_REGISTRY, searchAnatomicalStructures, SearchMatch } from '../data/anatomyRegistry';
import { AnatomyViewer3D } from './AnatomyViewer3D';
import { AnatomyDetailPanel } from './AnatomyDetailPanel';
import { AnatomyHierarchyTree } from './AnatomyHierarchyTree';
import { GuidedTourController } from './GuidedTourController';
import { AttributionModal } from './AttributionModal';
import { HemodynamicTelemetry } from '../graphics/HemodynamicTelemetry';
import { 
  Heart, 
  Brain, 
  Search, 
  Layers, 
  Sparkles, 
  HelpCircle, 
  Play, 
  Focus, 
  ShieldCheck, 
  Activity, 
  Award, 
  RotateCcw,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronRight,
  Sliders,
  Filter,
  Zap,
  Volume2,
  Shield,
  Flame
} from 'lucide-react';

interface AnatomyLabWorkspaceProps {
  initialOrganId?: string;
  activeClass?: string;
}

export const AnatomyLabWorkspace: React.FC<AnatomyLabWorkspaceProps> = ({
  initialOrganId = 'organ-heart',
  activeClass
}) => {
  // Selected Organ State
  const [selectedOrganId, setSelectedOrganId] = useState<string>(initialOrganId);
  const activeOrgan: OrganModelSpec = useMemo(() => {
    return ANATOMY_ORGAN_REGISTRY.find(o => o.id === selectedOrganId) || ANATOMY_ORGAN_REGISTRY[0];
  }, [selectedOrganId]);

  // Selected & Hovered Anatomical Structure
  const [selectedStructure, setSelectedStructure] = useState<AnatomicalStructure | null>(
    activeOrgan.structures[0] || null
  );
  const [hoveredStructure, setHoveredStructure] = useState<AnatomicalStructure | null>(null);

  // Hidden meshes / structures
  const [hiddenMeshNames, setHiddenMeshNames] = useState<Set<string>>(new Set());

  // Interactive 3D Controls
  const [isIsolated, setIsIsolated] = useState<boolean>(false);
  const [explodedPercent, setExplodedPercent] = useState<number>(0);
  const [isBeating, setIsBeating] = useState<boolean>(true);
  const [heartRate, setHeartRate] = useState<number>(72);
  const [showLabels, setShowLabels] = useState<boolean>(true);

  // Viewer Mode: 'learn' | 'self-test' | 'guided-tour'
  const [viewerMode, setViewerMode] = useState<AnatomyViewerMode>('learn');
  const [tourStepIndex, setTourStepIndex] = useState<number>(0);

  // Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const searchResults: SearchMatch[] = useMemo(() => {
    return searchAnatomicalStructures(searchQuery);
  }, [searchQuery]);

  // Self-Test Mode State
  const [selfTestTarget, setSelfTestTarget] = useState<AnatomicalStructure | null>(null);
  const [selfTestScore, setSelfTestScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [selfTestFeedback, setSelfTestFeedback] = useState<string | null>(null);

  // Attribution Modal
  const [showAttribution, setShowAttribution] = useState<boolean>(false);

  // Update selected structure when changing organ
  const handleSelectOrgan = (organId: string) => {
    setSelectedOrganId(organId);
    const newOrgan = ANATOMY_ORGAN_REGISTRY.find(o => o.id === organId) || ANATOMY_ORGAN_REGISTRY[0];
    setSelectedStructure(newOrgan.structures[0] || null);
    setHiddenMeshNames(new Set());
    setIsIsolated(false);
    setExplodedPercent(0);
    setTourStepIndex(0);
    setViewerMode('learn');
    setSearchQuery('');
  };

  const handleToggleHide = (structureId: string) => {
    setHiddenMeshNames(prev => {
      const next = new Set(prev);
      if (next.has(structureId)) {
        next.delete(structureId);
      } else {
        next.add(structureId);
      }
      return next;
    });
  };

  const handleUnhideAll = () => {
    setHiddenMeshNames(new Set());
  };

  // Start Self-Test Pin Identification Challenge
  const handleStartSelfTest = () => {
    setViewerMode('self-test');
    setIsIsolated(false);
    setShowLabels(false); // Hide labels for test
    setSelfTestScore({ correct: 0, total: 0 });
    // Pick random target
    const randomTarget = activeOrgan.structures[Math.floor(Math.random() * activeOrgan.structures.length)];
    setSelfTestTarget(randomTarget);
    setSelfTestFeedback(`Identify: "${randomTarget.name}" (${randomTarget.latinName})`);
  };

  const handleHandleStructureClickInTest = (clicked: AnatomicalStructure | null) => {
    if (viewerMode !== 'self-test' || !selfTestTarget || !clicked) return;

    if (clicked.id === selfTestTarget.id) {
      setSelfTestScore(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }));
      setSelfTestFeedback(`Correct! That is the ${clicked.name}.`);
      // Pick next structure
      setTimeout(() => {
        const remaining = activeOrgan.structures.filter(s => s.id !== clicked.id);
        const next = remaining[Math.floor(Math.random() * remaining.length)];
        setSelfTestTarget(next);
        setSelfTestFeedback(`Identify: "${next.name}" (${next.latinName})`);
      }, 1500);
    } else {
      setSelfTestScore(prev => ({ ...prev, total: prev.total + 1 }));
      setSelfTestFeedback(`Incorrect. You clicked "${clicked.name}". Try again to find "${selfTestTarget.name}".`);
    }
  };

  const handleStructureSelection = (struct: AnatomicalStructure | null) => {
    if (viewerMode === 'self-test') {
      handleHandleStructureClickInTest(struct);
    } else {
      setSelectedStructure(struct);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Textbook-Verified 3D Human Anatomy Lab</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">
              NCERT Biology &bull; OpenStax A&amp;P 2e &bull; HuBMAP 3D Reference
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Interactive Human Organ Systems in Real-Time 3D
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Examine authentic, peer-reviewed 3D anatomical models with segmented chambers, valves, and parenchyma. Every structure includes NCERT &amp; NEET curriculum explanations, blood supply, innervations, and practice questions.
          </p>
        </div>

        {/* Global Organ Switcher Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-col gap-2 shrink-0 self-stretch sm:self-auto relative z-10">
          {ANATOMY_ORGAN_REGISTRY.map(organ => {
            const isSelected = organ.id === activeOrgan.id;
            return (
              <button
                key={organ.id}
                onClick={() => handleSelectOrgan(organ.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between gap-2.5 shadow-md ${
                  isSelected
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white ring-2 ring-purple-400/50 scale-[1.02]'
                    : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  {organ.id === 'organ-heart' && <Heart className="w-3.5 h-3.5 text-rose-400" />}
                  {organ.id === 'organ-kidney' && <Activity className="w-3.5 h-3.5 text-amber-400" />}
                  {organ.id === 'organ-brain' && <Brain className="w-3.5 h-3.5 text-purple-400" />}
                  {organ.id === 'organ-stomach' && <Flame className="w-3.5 h-3.5 text-red-400" />}
                  {organ.id === 'organ-ear' && <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
                  {organ.id === 'organ-liver' && <Shield className="w-3.5 h-3.5 text-emerald-400" />}
                  {organ.id === 'organ-neuron' && <Zap className="w-3.5 h-3.5 text-yellow-400" />}
                  <span className="truncate max-w-[130px]">{organ.name.split('(')[0].replace('Human ', '').trim()}</span>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 shrink-0">3D</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Search & Mode Switcher Bar */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xl">
        {/* Search Bar with Autocomplete Dropdown */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search anatomical structures, Latin terms, or synonyms (e.g., 'mitral', 'Bertin', 'SA node', 'pacemaker')..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
          />

          {/* Autocomplete Results Panel */}
          {searchQuery.trim().length > 1 && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl bg-slate-950 border border-purple-500/40 shadow-2xl p-2 max-h-72 overflow-y-auto space-y-1">
              {searchResults.length === 0 ? (
                <div className="p-3 text-center text-xs text-slate-400">
                  No matching anatomical structure found for "{searchQuery}".
                </div>
              ) : (
                searchResults.map((res, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (res.organ.id !== activeOrgan.id) {
                        handleSelectOrgan(res.organ.id);
                      }
                      setSelectedStructure(res.structure);
                      setSearchQuery('');
                      setViewerMode('learn');
                    }}
                    className="w-full p-2.5 rounded-xl text-left hover:bg-purple-600/20 text-xs transition flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{res.structure.name}</span>
                        <span className="text-[10px] text-purple-400 font-serif italic">({res.structure.latinName})</span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-md">
                        {res.structure.mainFunction}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 shrink-0">
                      {res.organ.name.split('(')[0].trim()}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Learning Mode Selector */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center p-1 rounded-2xl bg-slate-950 border border-slate-800 font-bold">
            <button
              onClick={() => {
                setViewerMode('learn');
                setShowLabels(true);
              }}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                viewerMode === 'learn'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Focus className="w-3.5 h-3.5" />
              <span>Explore Mode</span>
            </button>

            <button
              onClick={handleStartSelfTest}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                viewerMode === 'self-test'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Self-Test Mode</span>
            </button>

            {activeOrgan.guidedTourSteps.length > 0 && (
              <button
                onClick={() => {
                  setViewerMode('guided-tour');
                  setTourStepIndex(0);
                  const firstStruct = activeOrgan.structures.find(s => s.id === activeOrgan.guidedTourSteps[0].structureId);
                  if (firstStruct) setSelectedStructure(firstStruct);
                }}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                  viewerMode === 'guided-tour'
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                <span>Guided Tour</span>
              </button>
            )}
          </div>

          {/* Attribution Button */}
          <button
            onClick={() => setShowAttribution(true)}
            className="px-3 py-2 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white font-semibold transition cursor-pointer flex items-center gap-1.5"
            title="View Model Licenses & Textbook Citations"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Attribution</span>
          </button>
        </div>
      </div>

      {/* 3. Self-Test Mode Banner (when active) */}
      {viewerMode === 'self-test' && (
        <div className="p-4 rounded-2xl bg-amber-950/30 border-2 border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
              3D Pin Identification Challenge
            </span>
            <div className="text-sm font-bold text-white">
              {selfTestFeedback}
            </div>
          </div>

          <div className="flex items-center gap-4 self-end sm:self-auto font-mono text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
              Score: <strong className="text-emerald-400">{selfTestScore.correct}</strong> / {selfTestScore.total}
            </div>
            <button
              onClick={() => {
                setViewerMode('learn');
                setShowLabels(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            >
              Exit Challenge
            </button>
          </div>
        </div>
      )}

      {/* 4. Guided Tour Controller (when active) */}
      {viewerMode === 'guided-tour' && (
        <GuidedTourController
          organ={activeOrgan}
          currentStepIndex={tourStepIndex}
          onStepChange={(idx) => setTourStepIndex(idx)}
          onCloseTour={() => setViewerMode('learn')}
          onSelectStructure={(s) => setSelectedStructure(s)}
        />
      )}

      {/* 5. Main 3D Lab Arena: 3D Viewport, Hierarchy Tree, and Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 3D Viewport (Span 7) */}
        <div className="lg:col-span-7 space-y-4">
          <AnatomyViewer3D
            organ={activeOrgan}
            selectedStructure={selectedStructure}
            hoveredStructure={hoveredStructure}
            onSelectStructure={handleStructureSelection}
            onHoverStructure={(s) => setHoveredStructure(s)}
            hiddenMeshNames={hiddenMeshNames}
            isIsolated={isIsolated}
            explodedPercent={explodedPercent}
            isBeating={isBeating}
            heartRate={heartRate}
            showLabels={showLabels}
            onResetView={() => {
              setIsIsolated(false);
              setExplodedPercent(0);
            }}
          />

          {/* Real-Time Physiological & Hemodynamic Telemetry Gauges */}
          <HemodynamicTelemetry
            organId={activeOrgan.id}
            heartRate={heartRate}
            isBeating={isBeating}
          />

          {/* Outliner Hierarchy & Exploded Sliders */}
          <AnatomyHierarchyTree
            organ={activeOrgan}
            selectedStructure={selectedStructure}
            onSelectStructure={handleStructureSelection}
            hiddenMeshNames={hiddenMeshNames}
            onToggleHide={handleToggleHide}
            onUnhideAll={handleUnhideAll}
            isIsolated={isIsolated}
            onToggleIsolate={() => setIsIsolated(!isIsolated)}
            explodedPercent={explodedPercent}
            onExplodedChange={(p) => setExplodedPercent(p)}
            isBeating={isBeating}
            onToggleBeating={() => setIsBeating(!isBeating)}
            heartRate={heartRate}
            onHeartRateChange={(r) => setHeartRate(r)}
            showLabels={showLabels}
            onToggleLabels={() => setShowLabels(!showLabels)}
          />
        </div>

        {/* Right: Textbook-Verified Details & Practice Quiz (Span 5) */}
        <div className="lg:col-span-5 space-y-4">
          <AnatomyDetailPanel
            structure={selectedStructure}
            organName={activeOrgan.name}
            organId={activeOrgan.id}
            isIsolated={isIsolated}
            onToggleIsolate={() => setIsIsolated(!isIsolated)}
            onSelectRelated={(sId) => {
              const target = activeOrgan.structures.find(s => s.id === sId);
              if (target) setSelectedStructure(target);
            }}
            allStructures={activeOrgan.structures}
          />
        </div>
      </div>

      {/* 6. Attribution & Verification Register Modal */}
      <AttributionModal 
        isOpen={showAttribution} 
        onClose={() => setShowAttribution(false)} 
      />
    </div>
  );
};
