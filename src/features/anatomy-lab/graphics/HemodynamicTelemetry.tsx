import React from 'react';
import { Activity, Droplets, Zap, Gauge, Heart, Compass } from 'lucide-react';

interface HemodynamicTelemetryProps {
  organId: string;
  heartRate?: number;
  isBeating?: boolean;
}

export const HemodynamicTelemetry: React.FC<HemodynamicTelemetryProps> = ({
  organId,
  heartRate = 72,
  isBeating = true
}) => {
  if (organId === 'organ-heart') {
    const strokeVolumeMl = 70; // mL
    const cardiacOutputLpm = isBeating ? ((heartRate * strokeVolumeMl) / 1000).toFixed(2) : '0.00';
    // Dynamic blood pressure calculation based on BPM
    const systolic = Math.round(110 + (heartRate - 70) * 0.4);
    const diastolic = Math.round(75 + (heartRate - 70) * 0.2);

    return (
      <div className="p-4 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-xl space-y-3 select-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-rose-500 animate-pulse" />
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Cardiovascular Hemodynamics
            </h4>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold">
            NCERT Ch 18 Aligned
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Cardiac Output */}
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <div className="text-[10px] font-mono text-slate-400">Cardiac Output (CO)</div>
            <div className="text-base font-black text-white flex items-baseline gap-1">
              <span>{cardiacOutputLpm}</span>
              <span className="text-[10px] font-normal text-slate-400">L/min</span>
            </div>
            <div className="text-[9px] font-mono text-rose-400">CO = HR × SV</div>
          </div>

          {/* Stroke Volume */}
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <div className="text-[10px] font-mono text-slate-400">Stroke Volume (SV)</div>
            <div className="text-base font-black text-white flex items-baseline gap-1">
              <span>{strokeVolumeMl}</span>
              <span className="text-[10px] font-normal text-slate-400">mL/beat</span>
            </div>
            <div className="text-[9px] font-mono text-slate-500">EDV - ESV</div>
          </div>

          {/* Blood Pressure */}
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <div className="text-[10px] font-mono text-slate-400">Systemic BP</div>
            <div className="text-base font-black text-rose-300 flex items-baseline gap-1">
              <span>{systolic}/{diastolic}</span>
              <span className="text-[10px] font-normal text-slate-400">mmHg</span>
            </div>
            <div className="text-[9px] font-mono text-slate-500">Systole / Diastole</div>
          </div>

          {/* Ejection Fraction */}
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <div className="text-[10px] font-mono text-slate-400">Ejection Fraction</div>
            <div className="text-base font-black text-emerald-400 flex items-baseline gap-1">
              <span>58%</span>
              <span className="text-[10px] font-normal text-emerald-300">Normal</span>
            </div>
            <div className="text-[9px] font-mono text-slate-500">Healthy LV function</div>
          </div>
        </div>
      </div>
    );
  }

  if (organId === 'organ-kidney') {
    return (
      <div className="p-4 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-xl space-y-3 select-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Renal Clearance & Filtration Telemetry
            </h4>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold">
            NCERT Ch 19 Aligned
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* GFR */}
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <div className="text-[10px] font-mono text-slate-400">Glomerular Filtration</div>
            <div className="text-base font-black text-cyan-300 flex items-baseline gap-1">
              <span>125</span>
              <span className="text-[10px] font-normal text-slate-400">mL/min</span>
            </div>
            <div className="text-[9px] font-mono text-cyan-400">~180 Liters/day</div>
          </div>

          {/* Renal Blood Flow */}
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <div className="text-[10px] font-mono text-slate-400">Renal Blood Flow</div>
            <div className="text-base font-black text-white flex items-baseline gap-1">
              <span>1,100</span>
              <span className="text-[10px] font-normal text-slate-400">mL/min</span>
            </div>
            <div className="text-[9px] font-mono text-slate-500">22% of Cardiac Output</div>
          </div>

          {/* Urine Output */}
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <div className="text-[10px] font-mono text-slate-400">Daily Urine Output</div>
            <div className="text-base font-black text-amber-300 flex items-baseline gap-1">
              <span>1.5</span>
              <span className="text-[10px] font-normal text-slate-400">L/day</span>
            </div>
            <div className="text-[9px] font-mono text-slate-500">99% Reabsorbed</div>
          </div>

          {/* Osmolarity Gradient */}
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <div className="text-[10px] font-mono text-slate-400">Medullary Gradient</div>
            <div className="text-base font-black text-purple-300 flex items-baseline gap-1">
              <span>300 → 1200</span>
              <span className="text-[10px] font-normal text-slate-400">mOsm/L</span>
            </div>
            <div className="text-[9px] font-mono text-slate-500">Countercurrent VASA</div>
          </div>
        </div>
      </div>
    );
  }

  // Brain
  return (
    <div className="p-4 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-xl space-y-3 select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-purple-400" />
          <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            Neurovascular & Metabolic Telemetry
          </h4>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold">
          NCERT Ch 21 Aligned
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
          <div className="text-[10px] font-mono text-slate-400">Cerebral Blood Flow</div>
          <div className="text-base font-black text-purple-300">750 <span className="text-xs font-normal">mL/min</span></div>
          <div className="text-[9px] font-mono text-purple-400">15% Resting Output</div>
        </div>

        <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
          <div className="text-[10px] font-mono text-slate-400">Oxygen Consumption</div>
          <div className="text-base font-black text-white">20% <span className="text-xs font-normal">Body Total</span></div>
          <div className="text-[9px] font-mono text-slate-500">High aerobic demand</div>
        </div>

        <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
          <div className="text-[10px] font-mono text-slate-400">Glucose Utilization</div>
          <div className="text-base font-black text-amber-300">120 <span className="text-xs font-normal">g/day</span></div>
          <div className="text-[9px] font-mono text-slate-500">Obligate fuel source</div>
        </div>

        <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
          <div className="text-[10px] font-mono text-slate-400">Synaptic Density</div>
          <div className="text-base font-black text-sky-300">10¹⁴ <span className="text-xs font-normal">Synapses</span></div>
          <div className="text-[9px] font-mono text-slate-500">86 Billion Neurons</div>
        </div>
      </div>
    </div>
  );
};
