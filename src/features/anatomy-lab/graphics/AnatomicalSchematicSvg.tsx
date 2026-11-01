import React from 'react';
import { AnatomicalStructure } from '../types/anatomy';

interface AnatomicalSchematicSvgProps {
  organId: string;
  selectedStructure: AnatomicalStructure | null;
  onSelectStructureId?: (id: string) => void;
}

export const AnatomicalSchematicSvg: React.FC<AnatomicalSchematicSvgProps> = ({
  organId,
  selectedStructure,
  onSelectStructureId
}) => {
  if (organId === 'organ-heart') {
    const isRA = selectedStructure?.id === 'heart-right-atrium';
    const isLA = selectedStructure?.id === 'heart-left-atrium';
    const isRV = selectedStructure?.id === 'heart-right-ventricle';
    const isLV = selectedStructure?.id === 'heart-left-ventricle';
    const isAorta = selectedStructure?.id === 'heart-aortic-arch';
    const isSeptum = selectedStructure?.id === 'heart-interventricular-septum';
    const isTricuspid = selectedStructure?.id === 'heart-tricuspid-valve';
    const isMitral = selectedStructure?.id === 'heart-mitral-valve';

    return (
      <div className="p-3 rounded-2xl bg-slate-950/90 border border-white/10 space-y-2 select-none">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="font-bold uppercase tracking-wider text-rose-400">Cardiovascular Schematic</span>
          <span className="text-[10px]">Click diagram part to select</span>
        </div>

        <svg viewBox="0 0 320 220" className="w-full h-44 rounded-xl bg-slate-900/50">
          <defs>
            <linearGradient id="oxygenatedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#be123c" />
            </linearGradient>
            <linearGradient id="deoxygenatedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
          </defs>

          {/* Superior / Inferior Vena Cava (Deoxygenated Inflow) */}
          <path
            d="M 60 10 L 60 70 L 95 85"
            stroke="#38bdf8"
            strokeWidth="14"
            fill="none"
            strokeLinecap="round"
            className="cursor-pointer hover:opacity-80"
            onClick={() => onSelectStructureId && onSelectStructureId('heart-right-atrium')}
          />
          <text x="35" y="35" fill="#7dd3fc" fontSize="9" fontFamily="monospace">SVC Inflow</text>

          {/* Aortic Arch (Oxygenated Outflow to Body) */}
          <path
            d="M 180 85 Q 160 20 220 20 Q 270 20 270 90"
            stroke={isAorta ? '#ffffff' : '#ef4444'}
            strokeWidth="16"
            fill="none"
            strokeLinecap="round"
            className="cursor-pointer transition-all"
            onClick={() => onSelectStructureId && onSelectStructureId('heart-aortic-arch')}
          />
          <text x="200" y="15" fill="#fca5a5" fontSize="9" fontFamily="monospace" fontWeight="bold">Aorta</text>

          {/* Pulmonary Artery Bifurcation */}
          <path
            d="M 140 100 Q 130 50 80 45 M 130 50 L 175 48"
            stroke="#0ea5e9"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            className="cursor-pointer"
          />

          {/* Right Atrium Chamber */}
          <rect
            x="65"
            y="75"
            width="65"
            height="55"
            rx="12"
            fill="url(#deoxygenatedGrad)"
            stroke={isRA ? '#ffffff' : '#38bdf8'}
            strokeWidth={isRA ? '3' : '1.5'}
            className="cursor-pointer hover:opacity-90 transition-all"
            onClick={() => onSelectStructureId && onSelectStructureId('heart-right-atrium')}
          />
          <text x="74" y="105" fill="#ffffff" fontSize="11" fontWeight="bold">Right Atrium</text>
          <text x="76" y="118" fill="#bae6fd" fontSize="8" fontFamily="monospace">Deoxygenated</text>

          {/* Left Atrium Chamber */}
          <rect
            x="190"
            y="75"
            width="65"
            height="55"
            rx="12"
            fill="url(#oxygenatedGrad)"
            stroke={isLA ? '#ffffff' : '#f43f5e'}
            strokeWidth={isLA ? '3' : '1.5'}
            className="cursor-pointer hover:opacity-90 transition-all"
            onClick={() => onSelectStructureId && onSelectStructureId('heart-left-atrium')}
          />
          <text x="200" y="105" fill="#ffffff" fontSize="11" fontWeight="bold">Left Atrium</text>
          <text x="202" y="118" fill="#fecdd3" fontSize="8" fontFamily="monospace">Oxygenated</text>

          {/* Tricuspid Valve Line */}
          <line
            x1="75"
            y1="135"
            x2="120"
            y2="135"
            stroke={isTricuspid ? '#fbbf24' : '#e2e8f0'}
            strokeWidth="4"
            strokeDasharray="3 2"
            className="cursor-pointer"
            onClick={() => onSelectStructureId && onSelectStructureId('heart-tricuspid-valve')}
          />

          {/* Bicuspid / Mitral Valve Line */}
          <line
            x1="200"
            y1="135"
            x2="245"
            y2="135"
            stroke={isMitral ? '#fbbf24' : '#e2e8f0'}
            strokeWidth="4"
            strokeDasharray="3 2"
            className="cursor-pointer"
            onClick={() => onSelectStructureId && onSelectStructureId('heart-mitral-valve')}
          />

          {/* Right Ventricle */}
          <path
            d="M 65 140 L 140 140 L 140 205 L 100 205 Q 65 190 65 140 Z"
            fill="#0284c7"
            stroke={isRV ? '#ffffff' : '#0369a1'}
            strokeWidth={isRV ? '3' : '1.5'}
            className="cursor-pointer hover:opacity-90 transition-all"
            onClick={() => onSelectStructureId && onSelectStructureId('heart-right-ventricle')}
          />
          <text x="76" y="175" fill="#ffffff" fontSize="11" fontWeight="bold">Right Ventricle</text>
          <text x="82" y="190" fill="#bae6fd" fontSize="8" fontFamily="monospace">Thin Myocardium</text>

          {/* Interventricular Septum */}
          <rect
            x="142"
            y="136"
            width="36"
            height="72"
            rx="4"
            fill={isSeptum ? '#38bdf8' : '#475569'}
            stroke="#94a3b8"
            strokeWidth="1"
            className="cursor-pointer hover:opacity-90 transition-all"
            onClick={() => onSelectStructureId && onSelectStructureId('heart-interventricular-septum')}
          />
          <text x="146" y="175" fill="#f8fafc" fontSize="8" fontWeight="bold" transform="rotate(-90 152 175)">
            Septum
          </text>

          {/* Left Ventricle (Thick Myocardium) */}
          <path
            d="M 180 140 L 255 140 Q 255 190 220 210 L 180 210 Z"
            fill="#e11d48"
            stroke={isLV ? '#ffffff' : '#be123c'}
            strokeWidth={isLV ? '3' : '1.5'}
            className="cursor-pointer hover:opacity-90 transition-all"
            onClick={() => onSelectStructureId && onSelectStructureId('heart-left-ventricle')}
          />
          <text x="190" y="175" fill="#ffffff" fontSize="11" fontWeight="bold">Left Ventricle</text>
          <text x="192" y="190" fill="#fecdd3" fontSize="8" fontFamily="monospace">3× Wall Thick</text>
        </svg>
      </div>
    );
  }

  // Kidney Schematic
  return (
    <div className="p-3 rounded-2xl bg-slate-950/90 border border-white/10 space-y-2 select-none">
      <div className="flex items-center justify-between text-xs font-mono text-slate-400">
        <span className="font-bold uppercase tracking-wider text-cyan-400">Renal Cross-Section Schematic</span>
        <span className="text-[10px]">Cortex to Medulla</span>
      </div>

      <svg viewBox="0 0 320 200" className="w-full h-40 rounded-xl bg-slate-900/50">
        {/* Renal Capsule Outer Rim */}
        <path
          d="M 100 20 C 220 15 280 60 280 100 C 280 140 220 185 100 180 C 130 140 130 60 100 20 Z"
          fill="#334155"
          stroke="#06b6d4"
          strokeWidth="3"
        />

        {/* Renal Cortex Outer Layer */}
        <path
          d="M 120 30 C 200 28 260 65 260 100 C 260 135 200 172 120 170 C 145 135 145 65 120 30 Z"
          fill="#0e7490"
          className="cursor-pointer hover:opacity-90"
          onClick={() => onSelectStructureId && onSelectStructureId('kidney-cortex')}
        />
        <text x="180" y="45" fill="#a5f3fc" fontSize="9" fontWeight="bold">Renal Cortex (Bowman's Capsules)</text>

        {/* Medullary Pyramids (Triangles) */}
        {[[170, 75], [210, 100], [170, 125]].map(([cx, cy], idx) => (
          <polygon
            key={idx}
            points={`${cx},${cy - 16} ${cx + 36},${cy} ${cx},${cy + 16}`}
            fill="#be123c"
            stroke="#f43f5e"
            strokeWidth="1.5"
            className="cursor-pointer hover:opacity-90"
            onClick={() => onSelectStructureId && onSelectStructureId('kidney-pyramids')}
          />
        ))}
        <text x="165" y="105" fill="#ffe4e6" fontSize="8" fontWeight="bold">Pyramids</text>

        {/* Renal Pelvis & Ureter */}
        <path
          d="M 110 90 L 140 100 L 110 110 L 80 170 L 60 170 L 85 100 Z"
          fill="#f59e0b"
          opacity="0.85"
          className="cursor-pointer hover:opacity-90"
          onClick={() => onSelectStructureId && onSelectStructureId('kidney-hilum')}
        />
        <text x="25" y="170" fill="#fde68a" fontSize="9" fontFamily="monospace">Ureter Outflow</text>
      </svg>
    </div>
  );
};
