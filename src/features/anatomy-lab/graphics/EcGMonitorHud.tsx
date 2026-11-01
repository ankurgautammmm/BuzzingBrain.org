import React, { useRef, useEffect } from 'react';
import { Activity } from 'lucide-react';

interface EcGMonitorHudProps {
  heartRate: number; // BPM
  isBeating: boolean;
  onClose?: () => void;
}

export const EcGMonitorHud: React.FC<EcGMonitorHudProps> = ({
  heartRate = 72,
  isBeating = true,
  onClose
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let sweepX = 0;
    const width = canvas.width;
    const height = canvas.height;
    const midY = height / 2;

    // Draw ECG background grid
    const drawGrid = () => {
      ctx.strokeStyle = '#052e16'; // Deep emerald medical grid
      ctx.lineWidth = 0.5;

      for (let x = 0; x < width; x += 10) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 10) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Bold 50px major lines
      ctx.strokeStyle = '#064e3b';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    };

    // Calculate normalized physiological ECG voltage f(t) for Lead II
    // Cycle duration in pixels: depends on heart rate
    // e.g. at 72 bpm, 1 cycle is (60 / 72) seconds.
    const getEcgSample = (phase: number): number => {
      // phase: 0 to 1
      if (!isBeating) return 0; // Asystole flatline

      // Baseline isoelectric
      if (phase < 0.12) return 0;

      // P-Wave (Atrial Depolarization)
      if (phase >= 0.12 && phase < 0.22) {
        const u = (phase - 0.12) / 0.10;
        return Math.sin(u * Math.PI) * 7;
      }
      // PR Segment (AV Node Delay)
      if (phase >= 0.22 && phase < 0.32) return 0;

      // Q-Wave (Septal Depolarization)
      if (phase >= 0.32 && phase < 0.35) {
        const u = (phase - 0.32) / 0.03;
        return -Math.sin(u * Math.PI) * 4;
      }
      // R-Peak (Ventricular Depolarization)
      if (phase >= 0.35 && phase < 0.42) {
        const u = (phase - 0.35) / 0.07;
        return Math.sin(u * Math.PI) * 36;
      }
      // S-Wave
      if (phase >= 0.42 && phase < 0.46) {
        const u = (phase - 0.42) / 0.04;
        return -Math.sin(u * Math.PI) * 8;
      }
      // ST Segment (Plateau Phase of Ventricular Action Potential)
      if (phase >= 0.46 && phase < 0.58) return 0;

      // T-Wave (Ventricular Repolarization)
      if (phase >= 0.58 && phase < 0.74) {
        const u = (phase - 0.58) / 0.16;
        return Math.sin(u * Math.PI) * 11;
      }

      // TP Baseline interval
      return 0;
    };

    // Initial background
    ctx.fillStyle = '#021008';
    ctx.fillRect(0, 0, width, height);
    drawGrid();

    let prevY = midY;
    const cyclePixels = Math.max(120, Math.min(300, (60 / heartRate) * 180));

    const render = () => {
      // Clear a small slice ahead of sweep to create oscilloscope sweep trail
      const clearWidth = 14;
      ctx.fillStyle = '#021008';
      ctx.fillRect(sweepX, 0, clearWidth, height);

      // Redraw grid lines in cleared slice
      ctx.strokeStyle = '#052e16';
      ctx.lineWidth = 0.5;
      for (let gx = Math.floor(sweepX / 10) * 10; gx <= sweepX + clearWidth; gx += 10) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
        ctx.stroke();
      }
      for (let gy = 0; gy < height; gy += 10) {
        ctx.beginPath();
        ctx.moveTo(sweepX, gy);
        ctx.lineTo(sweepX + clearWidth, gy);
        ctx.stroke();
      }

      // Calculate signal at current sweepX
      const phase = (sweepX % cyclePixels) / cyclePixels;
      const voltage = getEcgSample(phase);
      const currY = midY - voltage;

      // Draw glowing ECG trace line
      ctx.beginPath();
      ctx.moveTo(sweepX === 0 ? 0 : sweepX - 2, prevY);
      ctx.lineTo(sweepX, currY);
      ctx.strokeStyle = '#10b981'; // Phosphor green
      ctx.lineWidth = 2.2;
      ctx.shadowColor = '#34d399';
      ctx.shadowBlur = 6;
      ctx.stroke();
      ctx.shadowBlur = 0;

      prevY = currY;
      sweepX = (sweepX + 2) % width;

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [heartRate, isBeating]);

  // Derived clinical intervals
  const prInterval = '160 ms';
  const qrsInterval = '88 ms';
  const qtInterval = Math.round(390 * Math.sqrt(60 / heartRate)) + ' ms';

  return (
    <div className="p-3 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-emerald-500/30 shadow-2xl space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-mono text-emerald-400 font-bold">
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>LEAD II ECG TELEMETRY</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
          <span>PR: <strong className="text-white">{prInterval}</strong></span>
          <span>QRS: <strong className="text-white">{qrsInterval}</strong></span>
          <span>QTc: <strong className="text-white">{qtInterval}</strong></span>
          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
            {isBeating ? `${heartRate} BPM` : 'FLATLINE'}
          </span>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative rounded-xl overflow-hidden border border-emerald-900/60">
        <canvas
          ref={canvasRef}
          width={460}
          height={75}
          className="w-full h-[68px] block"
        />
        {/* Voltage & speed calibration mark */}
        <div className="absolute bottom-1 right-2 text-[9px] font-mono text-emerald-500/70 select-none">
          25 mm/s • 10 mm/mV
        </div>
      </div>
    </div>
  );
};
