import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Flame, 
  Activity, 
  Sliders, 
  Maximize2, 
  Compass, 
  Zap, 
  Info, 
  CheckCircle2, 
  ShieldAlert,
  ChevronRight,
  Sparkles,
  MousePointer
} from 'lucide-react';
import { MDAtom, MDBond, MDSimulationState, MDPreset } from '../types';
import { MD_PRESETS, ELEMENT_PROPERTIES } from '../data/mdPresets';

export const MolecularDynamicsSimulator: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('polyalanine-helix');
  const [activePreset, setActivePreset] = useState<MDPreset>(MD_PRESETS[0]);
  
  // Interactive Simulation Controls
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [targetTemp, setTargetTemp] = useState<number>(300); // Kelvin
  const [timeStepFs, setTimeStepFs] = useState<number>(1.0); // femtoseconds
  const [thermostatEnabled, setThermostatEnabled] = useState<boolean>(true);
  const [showVelocityVectors, setShowVelocityVectors] = useState<boolean>(true);
  const [showBondStrain, setShowBondStrain] = useState<boolean>(true);
  const [pullingForceStrength, setPullingForceStrength] = useState<number>(2.5);

  // Telemetry history for live charts
  const [telemetry, setTelemetry] = useState<{
    timePs: number;
    tempK: number;
    eKin: number;
    ePot: number;
    eTot: number;
  }>({
    timePs: 0,
    tempK: 300,
    eKin: 0,
    ePot: 0,
    eTot: 0
  });

  const [historyBuffer, setHistoryBuffer] = useState<Array<{ time: number; temp: number; eTot: number; eKin: number; ePot: number }>>([]);

  // Simulation physics state stored in refs for 60fps performance
  const atomsRef = useRef<MDAtom[]>([]);
  const bondsRef = useRef<MDBond[]>([]);
  const draggedAtomIdRef = useRef<number | null>(null);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const simTimePsRef = useRef<number>(0);
  const stepCountRef = useRef<number>(0);

  // Initialize preset
  const loadPreset = useCallback((preset: MDPreset) => {
    setActivePreset(preset);
    setSelectedPresetId(preset.id);
    setTargetTemp(preset.recommendedTemp);
    setTimeStepFs(preset.recommendedTimeStep);
    simTimePsRef.current = 0;
    stepCountRef.current = 0;
    setHistoryBuffer([]);

    // Deep clone atoms & bonds
    atomsRef.current = JSON.parse(JSON.stringify(preset.atoms));
    bondsRef.current = JSON.parse(JSON.stringify(preset.bonds));

    // Initialize velocities according to Maxwell-Boltzmann distribution for targetTemp
    const kB = 0.0019872; // kcal/(mol*K)
    atomsRef.current.forEach(atom => {
      const vStd = Math.sqrt((kB * preset.recommendedTemp) / atom.mass);
      atom.vx = (Math.random() - 0.5) * vStd * 1.5;
      atom.vy = (Math.random() - 0.5) * vStd * 1.5;
      atom.vz = (Math.random() - 0.5) * vStd * 1.5;
      atom.fx = 0;
      atom.fy = 0;
      atom.fz = 0;
    });
  }, []);

  useEffect(() => {
    loadPreset(MD_PRESETS[0]);
  }, [loadPreset]);

  // Velocity Verlet Integration Step
  const stepVerlet = useCallback((dtFs: number, tempK: number, applyThermostat: boolean) => {
    const atoms = atomsRef.current;
    const bonds = bondsRef.current;
    const dt = dtFs * 0.001; // convert fs to picoseconds

    if (atoms.length === 0) return;

    // 1. Position update: r(t + dt) = r(t) + v(t)*dt + 0.5*a(t)*dt^2
    for (let i = 0; i < atoms.length; i++) {
      const a = atoms[i];
      if (a.pinned) continue;
      const ax = a.fx / a.mass;
      const ay = a.fy / a.mass;
      const az = a.fz / a.mass;

      a.x += a.vx * dt + 0.5 * ax * dt * dt;
      a.y += a.vy * dt + 0.5 * ay * dt * dt;
      a.z += a.vz * dt + 0.5 * az * dt * dt;

      // Half-step velocity update: v(t + dt/2) = v(t) + 0.5*a(t)*dt
      a.vx += 0.5 * ax * dt;
      a.vy += 0.5 * ay * dt;
      a.vz += 0.5 * az * dt;
    }

    // 2. Compute Forces at r(t + dt)
    let potentialEnergy = 0;

    // Reset forces
    for (let i = 0; i < atoms.length; i++) {
      atoms[i].fx = 0;
      atoms[i].fy = 0;
      atoms[i].fz = 0;
    }

    // A. Harmonic Bond Forces: V_bond = 0.5 * k * (r - r0)^2
    for (let b = 0; b < bonds.length; b++) {
      const bond = bonds[b];
      const a1 = atoms.find(a => a.id === bond.atom1);
      const a2 = atoms.find(a => a.id === bond.atom2);
      if (!a1 || !a2) continue;

      const dx = a2.x - a1.x;
      const dy = a2.y - a1.y;
      const dz = a2.z - a1.z;
      const r = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.0001;
      const dr = r - bond.r0;

      potentialEnergy += 0.5 * bond.kBond * dr * dr;

      // Force magnitude = - dV/dr = - k * (r - r0)
      const forceMag = -bond.kBond * dr;
      const fx = forceMag * (dx / r);
      const fy = forceMag * (dy / r);
      const fz = forceMag * (dz / r);

      if (!a1.pinned) {
        a1.fx -= fx;
        a1.fy -= fy;
        a1.fz -= fz;
      }
      if (!a2.pinned) {
        a2.fx += fx;
        a2.fy += fy;
        a2.fz += fz;
      }
    }

    // B. Lennard-Jones (12-6) Non-Bonded Potentials: V_LJ = 4*eps * [(sig/r)^12 - (sig/r)^6]
    for (let i = 0; i < atoms.length; i++) {
      for (let j = i + 1; j < atoms.length; j++) {
        // Skip directly bonded 1-2 pairs
        const isBonded = bonds.some(b => 
          (b.atom1 === atoms[i].id && b.atom2 === atoms[j].id) ||
          (b.atom1 === atoms[j].id && b.atom2 === atoms[i].id)
        );
        if (isBonded) continue;

        const a1 = atoms[i];
        const a2 = atoms[j];
        const dx = a2.x - a1.x;
        const dy = a2.y - a1.y;
        const dz = a2.z - a1.z;
        const r2 = dx * dx + dy * dy + dz * dz;
        const r = Math.sqrt(r2) || 0.001;

        // Lorentz-Berthelot mixing rules
        const sigma = 0.5 * (a1.sigma + a2.sigma);
        const epsilon = Math.sqrt(a1.epsilon * a2.epsilon);

        if (r < 12.0) { // 12 A cutoff
          const s_r = sigma / r;
          const s_r6 = Math.pow(s_r, 6);
          const s_r12 = s_r6 * s_r6;

          // Potential
          potentialEnergy += 4 * epsilon * (s_r12 - s_r6);

          // Force = 24 * eps / r * [ 2*(sig/r)^12 - (sig/r)^6 ]
          const fMag = (24 * epsilon / r) * (2 * s_r12 - s_r6);
          const fx = fMag * (dx / r);
          const fy = fMag * (dy / r);
          const fz = fMag * (dz / r);

          if (!a1.pinned) {
            a1.fx -= fx;
            a1.fy -= fy;
            a1.fz -= fz;
          }
          if (!a2.pinned) {
            a2.fx += fx;
            a2.fy += fy;
            a2.fz += fz;
          }
        }
      }
    }

    // C. User interactive pulling force (optical tweezers / AFM probe simulation)
    if (draggedAtomIdRef.current !== null) {
      const draggedAtom = atoms.find(a => a.id === draggedAtomIdRef.current);
      if (draggedAtom && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const scale = 24; // pixels per Angstrom

        const targetX = (mousePosRef.current.x - centerX) / scale;
        const targetY = (mousePosRef.current.y - centerY) / scale;

        const pullFx = (targetX - draggedAtom.x) * pullingForceStrength * 80;
        const pullFy = (targetY - draggedAtom.y) * pullingForceStrength * 80;

        draggedAtom.fx += pullFx;
        draggedAtom.fy += pullFy;
      }
    }

    // 3. Complete velocity update: v(t + dt) = v(t + dt/2) + 0.5*a(t + dt)*dt
    let kineticEnergy = 0;
    for (let i = 0; i < atoms.length; i++) {
      const a = atoms[i];
      if (a.pinned) continue;
      const ax = a.fx / a.mass;
      const ay = a.fy / a.mass;
      const az = a.fz / a.mass;

      a.vx += 0.5 * ax * dt;
      a.vy += 0.5 * ay * dt;
      a.vz += 0.5 * az * dt;

      const v2 = a.vx * a.vx + a.vy * a.vy + a.vz * a.vz;
      kineticEnergy += 0.5 * a.mass * v2;
    }

    // 4. Compute Instantaneous Temperature: T = 2 * E_kin / (3 * N * k_B)
    const kB = 0.0019872; // kcal/(mol*K)
    const activeAtomsCount = atoms.filter(a => !a.pinned).length;
    const currentTemp = activeAtomsCount > 0 ? (2 * kineticEnergy) / (3 * activeAtomsCount * kB * 418.4) * 300 : tempK;

    // 5. Berendsen Thermostat: Rescale velocities toward target temperature
    if (applyThermostat && activeAtomsCount > 0 && currentTemp > 0.1) {
      const tau = 0.1; // coupling time constant in ps
      const lambda = Math.sqrt(1 + (dt / tau) * ((tempK / currentTemp) - 1));
      // Clamp scaling to avoid numerical instability
      const safeLambda = Math.max(0.85, Math.min(1.15, lambda));

      for (let i = 0; i < atoms.length; i++) {
        if (!atoms[i].pinned) {
          atoms[i].vx *= safeLambda;
          atoms[i].vy *= safeLambda;
          atoms[i].vz *= safeLambda;
        }
      }
    }

    simTimePsRef.current += dt;
    stepCountRef.current += 1;

    // Update telemetry state periodically
    if (stepCountRef.current % 3 === 0) {
      const curTime = Number(simTimePsRef.current.toFixed(3));
      const curTemp = Math.round(currentTemp);
      const eTot = Number((kineticEnergy + potentialEnergy).toFixed(2));
      const eKin = Number(kineticEnergy.toFixed(2));
      const ePot = Number(potentialEnergy.toFixed(2));

      setTelemetry({
        timePs: curTime,
        tempK: curTemp,
        eKin,
        ePot,
        eTot
      });

      setHistoryBuffer(prev => {
        const next = [...prev, { time: curTime, temp: curTemp, eTot, eKin, ePot }];
        if (next.length > 50) next.shift();
        return next;
      });
    }
  }, [pullingForceStrength]);

  // Main 60 FPS Render Loop
  useEffect(() => {
    let active = true;

    const render = () => {
      if (!active) return;

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const width = canvas.width;
          const height = canvas.height;
          ctx.clearRect(0, 0, width, height);

          // Dark slate background with high-contrast laboratory grid
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(0, 0, width, height);

          // Grid coordinates
          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 1;
          const gridSize = 35;
          for (let x = 0; x < width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
          }
          for (let y = 0; y < height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
          }

          const centerX = width / 2;
          const centerY = height / 2;
          const scale = 24; // pixels per Angstrom

          // Step physics if simulation is running
          if (isRunning) {
            // Take multiple sub-steps per frame for high integration stability
            for (let s = 0; s < 4; s++) {
              stepVerlet(timeStepFs / 4, targetTemp, thermostatEnabled);
            }
          }

          const atoms = atomsRef.current;
          const bonds = bondsRef.current;

          // 1. Draw Bonds (with strain indicators)
          for (let b = 0; b < bonds.length; b++) {
            const bond = bonds[b];
            const a1 = atoms.find(a => a.id === bond.atom1);
            const a2 = atoms.find(a => a.id === bond.atom2);
            if (!a1 || !a2) continue;

            const x1 = centerX + a1.x * scale;
            const y1 = centerY + a1.y * scale;
            const x2 = centerX + a2.x * scale;
            const y2 = centerY + a2.y * scale;

            const dist = Math.sqrt((a2.x - a1.x) ** 2 + (a2.y - a1.y) ** 2 + (a2.z - a1.z) ** 2);
            const strain = Math.abs(dist - bond.r0) / bond.r0;

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);

            if (showBondStrain && strain > 0.15) {
              // High mechanical strain (Red/Orange)
              ctx.strokeStyle = strain > 0.35 ? '#ef4444' : '#f97316';
              ctx.lineWidth = bond.order === 2 ? 4.5 : 3.0;
            } else {
              // Standard relaxed bond
              ctx.strokeStyle = '#64748b';
              ctx.lineWidth = bond.order === 2 ? 3.5 : 2.0;
            }
            ctx.stroke();
          }

          // 2. Draw Atoms
          for (let i = 0; i < atoms.length; i++) {
            const a = atoms[i];
            const px = centerX + a.x * scale;
            const py = centerY + a.y * scale;
            const radius = (a.radius || 1.3) * 8;

            // Depth sorting / shadow glow
            const gradient = ctx.createRadialGradient(
              px - radius * 0.3,
              py - radius * 0.3,
              radius * 0.1,
              px,
              py,
              radius
            );

            const baseColor = a.color || ELEMENT_PROPERTIES[a.element]?.color || '#94a3b8';
            gradient.addColorStop(0, '#ffffff');
            gradient.addColorStop(0.3, baseColor);
            gradient.addColorStop(1, '#090d16');

            ctx.beginPath();
            ctx.arc(px, py, radius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            // Pinned ring or dragging highlight
            if (a.id === draggedAtomIdRef.current) {
              ctx.strokeStyle = '#38bdf8';
              ctx.lineWidth = 3;
              ctx.stroke();

              // Pulling spring vector
              ctx.beginPath();
              ctx.moveTo(px, py);
              ctx.lineTo(mousePosRef.current.x, mousePosRef.current.y);
              ctx.strokeStyle = '#38bdf8';
              ctx.setLineDash([4, 4]);
              ctx.lineWidth = 2;
              ctx.stroke();
              ctx.setLineDash([]);
            } else if (a.pinned) {
              ctx.strokeStyle = '#eab308';
              ctx.lineWidth = 2;
              ctx.stroke();
            }

            // Element Label
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 9px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(a.name || a.element, px, py);

            // Velocity vector
            if (showVelocityVectors && !a.pinned) {
              const vMag = Math.sqrt(a.vx * a.vx + a.vy * a.vy);
              if (vMag > 0.05) {
                const vScale = 15;
                ctx.beginPath();
                ctx.moveTo(px, py);
                ctx.lineTo(px + a.vx * vScale, py + a.vy * vScale);
                ctx.strokeStyle = '#22d3ee';
                ctx.lineWidth = 1.2;
                ctx.stroke();
              }
            }
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      active = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRunning, timeStepFs, targetTemp, thermostatEnabled, showVelocityVectors, showBondStrain, stepVerlet]);

  // Handle Mouse Interactivity (Optical Tweezers dragging)
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = 24;

    // Find nearest atom within 20px
    let nearestId: number | null = null;
    let minD2 = 400; // 20px squared

    atomsRef.current.forEach(a => {
      const px = centerX + a.x * scale;
      const py = centerY + a.y * scale;
      const d2 = (px - mouseX) ** 2 + (py - mouseY) ** 2;
      if (d2 < minD2) {
        minD2 = d2;
        nearestId = a.id;
      }
    });

    if (nearestId !== null) {
      draggedAtomIdRef.current = nearestId;
      mousePosRef.current = { x: mouseX, y: mouseY };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mousePosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseUp = () => {
    draggedAtomIdRef.current = null;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-sm">
      {/* Left Pane: Interactive 60fps Canvas Viewport */}
      <div className="flex-1 flex flex-col">
        {/* Preset Header & Selector Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
              Biomolecular System:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {MD_PRESETS.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => loadPreset(preset)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    selectedPresetId === preset.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>{preset.name}</span>
                  <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                    selectedPresetId === preset.id ? 'bg-blue-700 text-blue-100' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {preset.category}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer shadow-sm ${
                isRunning
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isRunning ? 'Pause Sim' : 'Resume Sim'}</span>
            </button>
            <button
              onClick={() => loadPreset(activePreset)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition cursor-pointer"
              title="Reset initial atomic positions and Maxwell-Boltzmann velocities"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Canvas WebGL / Physics Surface */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-inner bg-slate-950">
          <canvas
            ref={canvasRef}
            width={760}
            height={460}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="w-full h-[460px] cursor-grab active:cursor-grabbing block"
          />

          {/* Overlay Interactive Hint */}
          <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md border border-slate-700 text-slate-300 px-3 py-1.5 rounded-xl text-[11px] flex items-center gap-2">
            <MousePointer className="w-3.5 h-3.5 text-cyan-400" />
            <span>Click &amp; drag any atom to apply an optical-tweezers force vector</span>
          </div>

          {/* Overlay Live Telemetry HUD */}
          <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl px-4 py-2 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-slate-500">Time:</span>{' '}
                <span className="text-cyan-400 font-bold">{telemetry.timePs} ps</span>
              </div>
              <div>
                <span className="text-slate-500">Temp:</span>{' '}
                <span className={`font-bold ${telemetry.tempK > 370 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {telemetry.tempK} K
                </span>
              </div>
              <div className="hidden sm:inline">
                <span className="text-slate-500">E_tot:</span>{' '}
                <span className="text-slate-200">{telemetry.eTot} kcal/mol</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                <span>E_kin: {telemetry.eKin}</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                <span>E_pot: {telemetry.ePot}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Scientific Context Description */}
        <div className="mt-4 bg-white border border-slate-200 rounded-2xl p-4 text-xs text-slate-700">
          <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
            <Info className="w-4 h-4 text-blue-600" />
            <span>Biophysical Context: {activePreset.name}</span>
          </div>
          <p className="leading-relaxed text-slate-600">
            {activePreset.scientificContext}
          </p>
        </div>
      </div>

      {/* Right Pane: Thermostat & Molecular Physics Controls */}
      <div className="w-full lg:w-80 flex flex-col gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-4">
            <Flame className="w-4 h-4 text-rose-500" />
            <span>Berendsen Thermostat</span>
          </h4>

          {/* Temperature Slider */}
          <div className="space-y-2 mb-5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600 font-medium">Target Temperature (T)</span>
              <span className="font-mono font-bold text-rose-600">{targetTemp} K ({Math.round(targetTemp - 273.15)}°C)</span>
            </div>
            <input
              type="range"
              min={50}
              max={550}
              step={5}
              value={targetTemp}
              onChange={(e) => setTargetTemp(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>50 K (Cryo)</span>
              <span>300 K (Room)</span>
              <span>370 K (Boiling)</span>
              <span>550 K</span>
            </div>
          </div>

          {/* Thermostat Toggle */}
          <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer p-2 rounded-xl hover:bg-slate-50 transition border border-slate-100 mb-3">
            <span>Berendsen Velocity Rescaling</span>
            <input
              type="checkbox"
              checked={thermostatEnabled}
              onChange={(e) => setThermostatEnabled(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded accent-blue-600 cursor-pointer"
            />
          </label>

          {/* Integration Time-step Slider */}
          <div className="space-y-2 mb-5 pt-2 border-t border-slate-100">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600 font-medium">Time-Step (Δt)</span>
              <span className="font-mono font-bold text-blue-600">{timeStepFs.toFixed(1)} fs</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={3.0}
              step={0.1}
              value={timeStepFs}
              onChange={(e) => setTimeStepFs(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <span className="text-[10px] text-slate-400 block">
              1 fs recommended for harmonic bonds; 2 fs for rigid non-bonded argon.
            </span>
          </div>

          {/* Visualization Toggles */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-800 mb-1">Display Features:</div>
            <label className="flex items-center justify-between text-xs text-slate-600 cursor-pointer">
              <span>Show Velocity Vectors</span>
              <input
                type="checkbox"
                checked={showVelocityVectors}
                onChange={(e) => setShowVelocityVectors(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded accent-blue-600 cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between text-xs text-slate-600 cursor-pointer">
              <span>Color High Bond Strain</span>
              <input
                type="checkbox"
                checked={showBondStrain}
                onChange={(e) => setShowBondStrain(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded accent-blue-600 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Real-Time Energy Conservation Monitor */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-cyan-600" />
            <span>Energy Trajectory (Verlet)</span>
          </h4>

          {/* Mini Real-Time Energy Sparkline */}
          <div className="h-28 w-full bg-slate-950 rounded-xl p-2 relative overflow-hidden flex items-end border border-slate-800">
            {historyBuffer.map((pt, idx) => {
              const maxE = 150;
              const minE = -50;
              const range = maxE - minE || 1;
              const eTotHeight = Math.max(5, Math.min(95, ((pt.eTot - minE) / range) * 100));
              const eKinHeight = Math.max(5, Math.min(95, ((pt.eKin - minE) / range) * 100));

              return (
                <div key={idx} className="flex-1 flex flex-col justify-end h-full mx-[0.5px]">
                  <div
                    style={{ height: `${eTotHeight}%` }}
                    className="w-full bg-cyan-400 opacity-70"
                    title={`E_tot: ${pt.eTot} kcal/mol`}
                  />
                  <div
                    style={{ height: `${eKinHeight * 0.5}%` }}
                    className="w-full bg-emerald-400 opacity-60 -mt-1"
                  />
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mt-2">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded bg-cyan-400" /> Total Energy
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded bg-emerald-400" /> Kinetic Energy
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
