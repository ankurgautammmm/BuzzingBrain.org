import React from 'react';

interface MedicalOrientationGizmoProps {
  onSelectView?: (viewKey: string) => void;
}

export const MedicalOrientationGizmo: React.FC<MedicalOrientationGizmoProps> = ({
  onSelectView
}) => {
  return (
    <div className="w-[78px] h-[78px] rounded-2xl bg-slate-950/90 backdrop-blur-md border border-slate-700/80 shadow-2xl p-1.5 flex flex-col items-center justify-between select-none pointer-events-auto">
      <div className="text-[9px] font-mono font-bold text-sky-400 uppercase tracking-tighter">
        ORIENTATION
      </div>

      {/* Quick Click Orientation Buttons */}
      <div className="grid grid-cols-3 gap-1 w-full text-center">
        <button
          onClick={() => onSelectView && onSelectView('superior')}
          className="px-1 py-0.5 rounded bg-white/5 hover:bg-sky-500 hover:text-slate-950 text-[9px] font-bold text-slate-300 transition cursor-pointer"
          title="Superior (Top)"
        >
          S
        </button>
        <button
          onClick={() => onSelectView && onSelectView('anterior')}
          className="px-1 py-0.5 rounded bg-sky-500/20 text-sky-300 hover:bg-sky-500 hover:text-slate-950 text-[9px] font-bold transition cursor-pointer"
          title="Anterior (Front)"
        >
          A
        </button>
        <button
          onClick={() => onSelectView && onSelectView('inferior')}
          className="px-1 py-0.5 rounded bg-white/5 hover:bg-sky-500 hover:text-slate-950 text-[9px] font-bold text-slate-300 transition cursor-pointer"
          title="Inferior (Bottom)"
        >
          I
        </button>

        <button
          onClick={() => onSelectView && onSelectView('right')}
          className="px-1 py-0.5 rounded bg-white/5 hover:bg-sky-500 hover:text-slate-950 text-[9px] font-bold text-slate-300 transition cursor-pointer"
          title="Right Lateral"
        >
          R
        </button>
        <button
          onClick={() => onSelectView && onSelectView('posterior')}
          className="px-1 py-0.5 rounded bg-white/5 hover:bg-sky-500 hover:text-slate-950 text-[9px] font-bold text-slate-300 transition cursor-pointer"
          title="Posterior (Back)"
        >
          P
        </button>
        <button
          onClick={() => onSelectView && onSelectView('left')}
          className="px-1 py-0.5 rounded bg-white/5 hover:bg-sky-500 hover:text-slate-950 text-[9px] font-bold text-slate-300 transition cursor-pointer"
          title="Left Lateral"
        >
          L
        </button>
      </div>

      <div className="text-[8px] font-mono text-slate-500">
        3D ANATOMY
      </div>
    </div>
  );
};
