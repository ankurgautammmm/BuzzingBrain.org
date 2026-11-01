import React from 'react';
import { AnatomicalStructure, OrganModelSpec } from '../types/anatomy';
import { 
  Eye, 
  EyeOff, 
  Layers, 
  Search, 
  Focus, 
  Sliders, 
  Activity, 
  Heart,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface AnatomyHierarchyTreeProps {
  organ: OrganModelSpec;
  selectedStructure: AnatomicalStructure | null;
  onSelectStructure: (s: AnatomicalStructure | null) => void;
  hiddenMeshNames: Set<string>;
  onToggleHide: (structureId: string) => void;
  onUnhideAll: () => void;
  isIsolated: boolean;
  onToggleIsolate: () => void;
  explodedPercent: number;
  onExplodedChange: (percent: number) => void;
  isBeating?: boolean;
  onToggleBeating?: () => void;
  heartRate?: number;
  onHeartRateChange?: (bpm: number) => void;
  showLabels: boolean;
  onToggleLabels: () => void;
}

export const AnatomyHierarchyTree: React.FC<AnatomyHierarchyTreeProps> = ({
  organ,
  selectedStructure,
  onSelectStructure,
  hiddenMeshNames,
  onToggleHide,
  onUnhideAll,
  isIsolated,
  onToggleIsolate,
  explodedPercent,
  onExplodedChange,
  isBeating = false,
  onToggleBeating,
  heartRate = 72,
  onHeartRateChange,
  showLabels,
  onToggleLabels
}) => {
  return (
    <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5 text-xs">
      {/* 1. Header with Controls Summary */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-400" />
          <h3 className="font-bold text-white text-sm">Anatomical Structures</h3>
        </div>
        <span className="text-[10px] font-mono text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full font-bold">
          {organ.structures.length} Segmented Parts
        </span>
      </div>

      {/* 2. Interactive Anatomical Sliders (Exploded Chambers & Heartbeat) */}
      <div className="space-y-4 p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
        {/* Exploded View Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-purple-400" />
              <span>Chamber Separation (Exploded):</span>
            </span>
            <span className="text-purple-300 font-mono font-bold">
              {Math.round(explodedPercent * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.02"
            value={explodedPercent}
            onChange={(e) => onExplodedChange(Number(e.target.value))}
            className="w-full accent-purple-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-slate-500 font-mono">
            <span>Assembled</span>
            <span>Interior Chambers</span>
          </div>
        </div>

        {/* Heart Rate / Systole-Diastole Pulse (For Heart) */}
        {organ.id === 'organ-heart' && onToggleBeating && onHeartRateChange && (
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <button
                onClick={onToggleBeating}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold text-xs transition cursor-pointer ${
                  isBeating 
                    ? 'bg-rose-500 text-white shadow-xs' 
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isBeating ? 'animate-pulse text-white' : ''}`} />
                <span>{isBeating ? 'Heartbeat Active' : 'Cardiac Pulse Off'}</span>
              </button>

              <span className="font-mono text-rose-300 font-bold text-xs">
                {heartRate} BPM
              </span>
            </div>

            {isBeating && (
              <input
                type="range"
                min="40"
                max="160"
                step="2"
                value={heartRate}
                onChange={(e) => onHeartRateChange(Number(e.target.value))}
                className="w-full accent-rose-500 bg-slate-800 rounded-lg h-1.5 cursor-pointer"
              />
            )}
          </div>
        )}

        {/* Label Pins Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <span className="text-slate-300 font-semibold text-[11px]">3D Label Pins:</span>
          <button
            onClick={onToggleLabels}
            className={`px-3 py-1 rounded-xl font-bold text-[11px] transition cursor-pointer ${
              showLabels
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {showLabels ? 'Labels Visible' : 'Hidden'}
          </button>
        </div>
      </div>

      {/* 3. Structure List / Outliner */}
      <div className="space-y-1 max-h-[360px] overflow-y-auto pr-1">
        {organ.structures.map((struct) => {
          const isSelected = selectedStructure?.id === struct.id;
          const isHidden = hiddenMeshNames.has(struct.id);

          return (
            <div
              key={struct.id}
              className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                isSelected
                  ? 'bg-purple-600/30 border-purple-500 text-white font-bold'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {/* Click to select structure */}
              <button
                onClick={() => onSelectStructure(struct)}
                className="flex items-center gap-2.5 flex-1 text-left truncate cursor-pointer"
              >
                <span 
                  className="w-2.5 h-2.5 rounded-full shrink-0" 
                  style={{ backgroundColor: struct.defaultColor }} 
                />
                <span className="truncate">{struct.name}</span>
              </button>

              {/* Visibility eye toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleHide(struct.id);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer shrink-0"
                title={isHidden ? 'Show Structure' : 'Hide Structure'}
              >
                {isHidden ? (
                  <EyeOff className="w-3.5 h-3.5 text-rose-400" />
                ) : (
                  <Eye className="w-3.5 h-3.5 text-slate-400 hover:text-white" />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Unhide all if any are hidden */}
      {hiddenMeshNames.size > 0 && (
        <button
          onClick={onUnhideAll}
          className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer text-center"
        >
          Show All Hidden Structures ({hiddenMeshNames.size})
        </button>
      )}
    </div>
  );
};
