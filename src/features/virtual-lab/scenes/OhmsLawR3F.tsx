import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Text } from '@react-three/drei';
import * as THREE from 'three';
import { CircuitParameters, CircuitState, calculateLinearRegressionResistance } from '../simulation/physicsSimulation';
import { 
  Zap, 
  Power, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Table, 
  LineChart, 
  Sliders, 
  Activity, 
  Info, 
  CheckCircle2, 
  Flame 
} from 'lucide-react';

interface OhmsLawR3FProps {
  circuitParams: CircuitParameters;
  circuitState: CircuitState;
  onUpdateParams: (partial: Partial<CircuitParameters>) => void;
  onRecordObservation: () => void;
  recordedReadings?: { current: number; voltage: number; resistance: number; power: number }[];
  onClearReadings?: () => void;
}

// =========================================================================
// 3D R3F COMPONENT: REGULATED DC POWER SUPPLY
// =========================================================================
const PowerSupply3D: React.FC<{
  voltage: number;
  onVoltageChange: (v: number) => void;
  onSelectComponent: (name: string) => void;
}> = ({ voltage, onVoltageChange, onSelectComponent }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <group 
      position={[-2.8, 0.6, -1.2]}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onSelectComponent('Regulated DC Power Supply (0–12V)'); }}
      onPointerOut={() => setHovered(false)}
    >
      {/* Outer Metal Enclosure */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.8, 1.2, 1.4]} />
        <meshStandardMaterial 
          color={hovered ? '#475569' : '#334155'} 
          metalness={0.6} 
          roughness={0.25} 
          emissive={hovered ? '#0284c7' : '#000000'}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
      </mesh>

      {/* Front Panel Bevel */}
      <mesh position={[0, 0, 0.71]}>
        <planeGeometry args={[1.6, 1.0]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} />
      </mesh>

      {/* Glowing Blue Digital LED Display Screen */}
      <mesh position={[0, 0.26, 0.72]}>
        <planeGeometry args={[0.9, 0.38]} />
        <meshBasicMaterial color="#0284c7" />
      </mesh>

      {/* Digital Voltage Text in 3D */}
      <Text
        position={[0, 0.26, 0.73]}
        fontSize={0.2}
        color="#f0f9ff"
        anchorX="center"
        anchorY="middle"
      >
        {voltage.toFixed(1)} V
      </Text>

      {/* Power Supply Label */}
      <Text
        position={[0, 0.44, 0.72]}
        fontSize={0.07}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
      >
        DC REGULATED SUPPLY
      </Text>

      {/* Voltage Control Dial Knob */}
      <group position={[0, -0.22, 0.75]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.12, 24]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.09, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[0.03, 0.08, 0.02]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>

      {/* Binding Posts: (+) Red (Right) & (-) Black (Left) */}
      <mesh position={[0.5, -0.22, 0.74]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.16, 16]} />
        <meshStandardMaterial color="#dc2626" roughness={0.3} metalness={0.4} />
      </mesh>
      <mesh position={[-0.5, -0.22, 0.74]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.16, 16]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.4} />
      </mesh>
    </group>
  );
};

// =========================================================================
// 3D R3F COMPONENT: MOVING-COIL ANALOG DC AMMETER
// =========================================================================
const Ammeter3D: React.FC<{
  current: number;
  deflectionDeg: number;
  onSelectComponent: (name: string) => void;
}> = ({ current, deflectionDeg, onSelectComponent }) => {
  const [hovered, setHovered] = useState(false);
  const needleRef = useRef<THREE.Mesh>(null);

  // Smooth damped needle deflection animation
  useFrame(() => {
    if (needleRef.current) {
      const targetRads = -(deflectionDeg * (Math.PI / 180));
      needleRef.current.rotation.z += (targetRads - needleRef.current.rotation.z) * 0.15;
    }
  });

  return (
    <group 
      position={[-0.95, 0.5, 0.4]}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onSelectComponent('DC Moving-Coil Ammeter (0–1.5 A, Series)'); }}
      onPointerOut={() => setHovered(false)}
    >
      {/* Heavy Beveled Wooden / Bakelite Case */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.9, 1.1]} />
        <meshStandardMaterial 
          color={hovered ? '#1e293b' : '#0f172a'} 
          roughness={0.3} 
          metalness={0.2}
          emissive={hovered ? '#10b981' : '#000000'}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
      </mesh>

      {/* Slanted Dial Plate */}
      <mesh position={[0, 0.08, 0.56]}>
        <planeGeometry args={[1.15, 0.68]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Scale Arc Line */}
      <mesh position={[0, 0.2, 0.565]}>
        <ringGeometry args={[0.42, 0.43, 32, 1, Math.PI * 0.15, Math.PI * 0.7]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>

      {/* Dial Center 'A' Emblem */}
      <Text position={[0, -0.05, 0.57]} fontSize={0.14} color="#0f172a" font="bold">
        A
      </Text>
      <Text position={[0, -0.18, 0.57]} fontSize={0.06} color="#64748b">
        DC AMMETER &bull; 0–1.5A
      </Text>

      {/* Dynamic Digital Readout HUD on Dial */}
      <Text position={[0, 0.32, 0.57]} fontSize={0.09} color="#059669" font="bold">
        {current.toFixed(3)} A
      </Text>

      {/* Rotating Red Needle Pointer */}
      <mesh 
        ref={needleRef} 
        position={[0, -0.05, 0.58]}
      >
        <planeGeometry args={[0.02, 0.46]} />
        <meshBasicMaterial color="#dc2626" />
      </mesh>

      {/* Needle Pivot Brass Stud */}
      <mesh position={[0, -0.05, 0.59]}>
        <circleGeometry args={[0.04, 16]} />
        <meshStandardMaterial color="#d97706" metalness={0.8} />
      </mesh>

      {/* Red (+) and Black (-) Input Terminals */}
      <mesh position={[-0.4, -0.32, 0.56]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.12, 16]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      <mesh position={[0.4, -0.32, 0.56]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.12, 16]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
    </group>
  );
};

// =========================================================================
// 3D R3F COMPONENT: MOVING-COIL ANALOG DC VOLTMETER
// =========================================================================
const Voltmeter3D: React.FC<{
  voltage: number;
  deflectionDeg: number;
  onSelectComponent: (name: string) => void;
}> = ({ voltage, deflectionDeg, onSelectComponent }) => {
  const [hovered, setHovered] = useState(false);
  const needleRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (needleRef.current) {
      const targetRads = -(deflectionDeg * (Math.PI / 180));
      needleRef.current.rotation.z += (targetRads - needleRef.current.rotation.z) * 0.15;
    }
  });

  return (
    <group 
      position={[1.05, 0.5, 0.4]}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onSelectComponent('DC Moving-Coil Voltmeter (0–3.0 V, Parallel)'); }}
      onPointerOut={() => setHovered(false)}
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.9, 1.1]} />
        <meshStandardMaterial 
          color={hovered ? '#1e293b' : '#0f172a'} 
          roughness={0.3} 
          metalness={0.2}
          emissive={hovered ? '#0284c7' : '#000000'}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
      </mesh>

      <mesh position={[0, 0.08, 0.56]}>
        <planeGeometry args={[1.15, 0.68]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      <mesh position={[0, 0.2, 0.565]}>
        <ringGeometry args={[0.42, 0.43, 32, 1, Math.PI * 0.15, Math.PI * 0.7]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>

      <Text position={[0, -0.05, 0.57]} fontSize={0.14} color="#0f172a" font="bold">
        V
      </Text>
      <Text position={[0, -0.18, 0.57]} fontSize={0.06} color="#64748b">
        DC VOLTMETER &bull; 0–3.0V
      </Text>

      <Text position={[0, 0.32, 0.57]} fontSize={0.09} color="#0284c7" font="bold">
        {voltage.toFixed(3)} V
      </Text>

      <mesh 
        ref={needleRef} 
        position={[0, -0.05, 0.58]}
      >
        <planeGeometry args={[0.02, 0.46]} />
        <meshBasicMaterial color="#dc2626" />
      </mesh>

      <mesh position={[0, -0.05, 0.59]}>
        <circleGeometry args={[0.04, 16]} />
        <meshStandardMaterial color="#d97706" metalness={0.8} />
      </mesh>

      <mesh position={[-0.4, -0.32, 0.56]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.12, 16]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      <mesh position={[0.4, -0.32, 0.56]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.12, 16]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
    </group>
  );
};

// =========================================================================
// 3D R3F COMPONENT: SLIDING WIRE-WOUND RHEOSTAT
// =========================================================================
const Rheostat3D: React.FC<{
  resistance: number;
  onSelectComponent: (name: string) => void;
}> = ({ resistance, onSelectComponent }) => {
  const [hovered, setHovered] = useState(false);
  const sliderRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (sliderRef.current) {
      // Linear translation: resistance 0-20 Ω maps to x in [-0.95, 0.95]
      const targetX = -0.95 + (resistance / 20) * 1.9;
      sliderRef.current.position.x += (targetX - sliderRef.current.position.x) * 0.12;
    }
  });

  return (
    <group 
      position={[2.8, 0.48, -1.2]}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onSelectComponent(`Wire-Wound Variable Rheostat (${resistance.toFixed(1)} Ω)`); }}
      onPointerOut={() => setHovered(false)}
    >
      {/* Heavy Porcelain Cylinder Base */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.32, 0.32, 2.3, 32]} />
        <meshStandardMaterial 
          color="#f8fafc" 
          roughness={0.3}
          emissive={hovered ? '#f59e0b' : '#000000'}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
      </mesh>

      {/* Wound Resistance Wire Texture Rings */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.325, 0.325, 2.1, 32]} />
        <meshStandardMaterial color="#b45309" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* Left and Right Cast Iron Stands */}
      <mesh position={[-1.2, 0, 0]}>
        <boxGeometry args={[0.18, 0.85, 0.85]} />
        <meshStandardMaterial color="#1e293b" metalness={0.4} />
      </mesh>
      <mesh position={[1.2, 0, 0]}>
        <boxGeometry args={[0.18, 0.85, 0.85]} />
        <meshStandardMaterial color="#1e293b" metalness={0.4} />
      </mesh>

      {/* Top Polished Brass Slider Guide Rod */}
      <mesh position={[0, 0.48, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.045, 0.045, 2.4, 16]} />
        <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Movable Brass Contact Slider Block */}
      <mesh ref={sliderRef} position={[0, 0.44, 0]} castShadow>
        <boxGeometry args={[0.24, 0.32, 0.36]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.85} roughness={0.2} />
      </mesh>

      <Text position={[0, -0.5, 0.4]} fontSize={0.08} color="#94a3b8">
        RHEOSTAT: {resistance.toFixed(1)} Ω
      </Text>
    </group>
  );
};

// =========================================================================
// 3D R3F COMPONENT: SINGLE-POLE KNIFE PLUG SWITCH
// =========================================================================
const KnifeSwitch3D: React.FC<{
  isClosed: boolean;
  onToggle: () => void;
  onSelectComponent: (name: string) => void;
}> = ({ isClosed, onToggle, onSelectComponent }) => {
  const [hovered, setHovered] = useState(false);
  const bladeRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (bladeRef.current) {
      // Closed: 0 rads; Open: ~0.7 rads (40 deg)
      const targetAngle = isClosed ? 0.0 : 0.72;
      bladeRef.current.rotation.z += (targetAngle - bladeRef.current.rotation.z) * 0.18;
    }
  });

  return (
    <group 
      position={[0, 0.16, 1.8]}
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onSelectComponent(isClosed ? 'Plug Switch (CLOSED & ENERGIZED)' : 'Plug Switch (OPEN - Click to Close)'); }}
      onPointerOut={() => setHovered(false)}
    >
      {/* Porcelain Glazed Base Block */}
      <mesh receiveShadow>
        <boxGeometry args={[1.3, 0.12, 0.8]} />
        <meshStandardMaterial 
          color="#f8fafc" 
          roughness={0.2} 
          emissive={hovered ? '#10b981' : '#000000'}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
      </mesh>

      {/* Brass Contact Jaws */}
      <mesh position={[-0.38, 0.15, 0]}>
        <boxGeometry args={[0.12, 0.22, 0.12]} />
        <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.15} />
      </mesh>
      <mesh position={[0.38, 0.15, 0]}>
        <boxGeometry args={[0.12, 0.22, 0.12]} />
        <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Pivoting Brass Knife Arm */}
      <group ref={bladeRef} position={[-0.38, 0.16, 0]}>
        {/* Brass Blade */}
        <mesh position={[0.38, 0, 0]}>
          <boxGeometry args={[0.76, 0.06, 0.04]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Insulated Ebonite Grip Handle */}
        <mesh position={[0.82, 0.02, 0]}>
          <boxGeometry args={[0.2, 0.12, 0.1]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
      </group>

      {/* Live Status Label */}
      <Text position={[0, -0.2, 0.35]} fontSize={0.08} color={isClosed ? '#10b981' : '#f43f5e'}>
        {isClosed ? 'SWITCH: CLOSED (LIVE)' : 'SWITCH: OPEN (OFF)'}
      </Text>
    </group>
  );
};

// =========================================================================
// 3D R3F COMPONENT: STRETCHED NICHROME RESISTANCE WIRE
// =========================================================================
const ResistanceWire3D: React.FC<{
  nominalR: number;
  lengthCm: number;
  current: number;
  powerWatts: number;
  onSelectComponent: (name: string) => void;
}> = ({ nominalR, lengthCm, current, powerWatts, onSelectComponent }) => {
  const [hovered, setHovered] = useState(false);

  // Wire warms up with high current (thermal emissive effect)
  const isHeating = powerWatts > 3.0;

  return (
    <group 
      position={[0, 0.1, -0.2]}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onSelectComponent(`Nichrome Resistance Wire (${lengthCm} cm, ${nominalR.toFixed(2)} Ω)`); }}
      onPointerOut={() => setHovered(false)}
    >
      {/* Wood Mounting Plate */}
      <mesh receiveShadow>
        <boxGeometry args={[2.3, 0.08, 0.55]} />
        <meshStandardMaterial 
          color="#334155" 
          roughness={0.4}
          emissive={hovered ? '#38bdf8' : '#000000'}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
      </mesh>

      {/* Brass Binding Pillars */}
      <mesh position={[-0.95, 0.15, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.22, 16]} />
        <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0.95, 0.15, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.22, 16]} />
        <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Taut Nichrome Wire */}
      <mesh position={[0, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.016, 0.016, 1.9, 16]} />
        <meshStandardMaterial 
          color={isHeating ? '#ea580c' : '#94a3b8'} 
          metalness={0.8} 
          roughness={0.2}
          emissive={isHeating ? '#f97316' : '#000000'}
          emissiveIntensity={isHeating ? 0.8 : 0}
        />
      </mesh>

      <Text position={[0, -0.15, 0.2]} fontSize={0.07} color="#94a3b8">
        NICHROME WIRE (L = {lengthCm} cm, R ≈ {nominalR.toFixed(2)} Ω)
      </Text>
    </group>
  );
};

// =========================================================================
// 3D R3F COMPONENT: COLOR-CODED BRAIDED CIRCUIT CONNECTING WIRES
// =========================================================================
const ConnectingWires3D: React.FC<{ isClosed: boolean }> = ({ isClosed }) => {
  return (
    <group>
      {/* Wire 1: Battery (+) to Ammeter (+) [Red Wire] */}
      <mesh position={[-1.85, 0.15, -0.4]} rotation={[0, 0.45, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 2.2, 12]} />
        <meshStandardMaterial color="#dc2626" roughness={0.5} />
      </mesh>

      {/* Wire 2: Ammeter (-) to Resistor Wire Left Terminal [Red Wire] */}
      <mesh position={[-0.7, 0.12, 0.08]} rotation={[0, -0.6, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.8, 12]} />
        <meshStandardMaterial color="#dc2626" roughness={0.5} />
      </mesh>

      {/* Wire 3: Voltmeter Parallel (+ / Red) to Resistor Left Terminal */}
      <mesh position={[0.05, 0.2, 0.1]} rotation={[0, 0.8, Math.PI / 2]}>
        <cylinderGeometry args={[0.015, 0.015, 1.3, 12]} />
        <meshStandardMaterial color="#ef4444" roughness={0.5} />
      </mesh>

      {/* Wire 4: Voltmeter Parallel (- / Black) to Resistor Right Terminal */}
      <mesh position={[1.0, 0.2, 0.1]} rotation={[0, -0.7, Math.PI / 2]}>
        <cylinderGeometry args={[0.015, 0.015, 0.8, 12]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </mesh>

      {/* Wire 5: Resistor Right Terminal to Rheostat Slider [Blue Wire] */}
      <mesh position={[1.8, 0.15, -0.7]} rotation={[0, -0.5, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 2.0, 12]} />
        <meshStandardMaterial color="#2563eb" roughness={0.5} />
      </mesh>

      {/* Wire 6: Rheostat to Switch [Blue Wire] */}
      <mesh position={[1.4, 0.12, 0.3]} rotation={[0, 0.8, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 2.6, 12]} />
        <meshStandardMaterial color="#2563eb" roughness={0.5} />
      </mesh>

      {/* Wire 7: Switch to Battery (-) [Black Ground Return Wire] */}
      <mesh position={[-1.5, 0.1, 0.3]} rotation={[0, -0.65, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 3.4, 12]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} />
      </mesh>
    </group>
  );
};

// =========================================================================
// MAIN EXPORTED COMPONENT: OHM'S LAW REACT THREE FIBER WORKSPACE
// =========================================================================
export const OhmsLawR3F: React.FC<OhmsLawR3FProps> = ({
  circuitParams,
  circuitState,
  onUpdateParams,
  onRecordObservation,
  recordedReadings = [],
  onClearReadings,
}) => {
  const [selectedApparatusName, setSelectedApparatusName] = useState<string>('DC Circuit Bench (Click items to inspect)');
  const [activeTab, setActiveTab] = useState<'bench' | 'table' | 'graph'>('bench');

  // Compute live linear regression slope from recorded readings
  const regression = useMemo(() => {
    if (recordedReadings.length < 2) return null;
    return calculateLinearRegressionResistance(recordedReadings);
  }, [recordedReadings]);

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-white rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-3 bg-slate-900 border-b border-slate-800 gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <span className={`w-3 h-3 rounded-full ${circuitParams.isSwitchClosed ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <span>Ohm's Law 3D Virtual Circuit &amp; Resistance Bench</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                React Three Fiber
              </span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Selected: <strong className="text-purple-300">{selectedApparatusName}</strong>
            </span>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800 self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('bench')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'bench' ? 'bg-purple-600 text-white font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>3D Canvas</span>
          </button>
          <button
            onClick={() => setActiveTab('table')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'table' ? 'bg-purple-600 text-white font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Readings ({recordedReadings.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('graph')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'graph' ? 'bg-purple-600 text-white font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <LineChart className="w-3.5 h-3.5" />
            <span>V–I Graph</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative flex-1 min-h-[420px] w-full">
        {/* TAB 1: 3D REAL-TIME R3F CANVAS */}
        {activeTab === 'bench' && (
          <div className="w-full h-full relative">
            <Canvas
              shadows
              camera={{ position: [0, 4.8, 7.2], fov: 45 }}
              className="w-full h-full block cursor-grab active:cursor-grabbing"
            >
              {/* Lighting */}
              <ambientLight intensity={0.7} />
              <directionalLight 
                position={[6, 12, 8]} 
                intensity={1.2} 
                castShadow 
                shadow-mapSize-width={1024} 
                shadow-mapSize-height={1024} 
              />
              <directionalLight position={[-6, 4, -4]} intensity={0.4} color="#38bdf8" />

              {/* Lab Tabletop */}
              <mesh position={[0, -0.2, 0]} receiveShadow>
                <boxGeometry args={[9.2, 0.4, 5.6]} />
                <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.1} />
              </mesh>

              {/* Interactive 3D Circuit Apparatus */}
              <PowerSupply3D 
                voltage={circuitParams.supplyVoltageVolts} 
                onVoltageChange={(v) => onUpdateParams({ supplyVoltageVolts: v })} 
                onSelectComponent={setSelectedApparatusName}
              />

              <Ammeter3D 
                current={circuitState.currentAmperes} 
                deflectionDeg={circuitState.ammeterAngleDegrees} 
                onSelectComponent={setSelectedApparatusName}
              />

              <Voltmeter3D 
                voltage={circuitState.measuredVoltageDropVolts} 
                deflectionDeg={circuitState.voltmeterAngleDegrees} 
                onSelectComponent={setSelectedApparatusName}
              />

              <Rheostat3D 
                resistance={circuitParams.rheostatResistanceOhms} 
                onSelectComponent={setSelectedApparatusName}
              />

              <KnifeSwitch3D 
                isClosed={circuitParams.isSwitchClosed} 
                onToggle={() => onUpdateParams({ isSwitchClosed: !circuitParams.isSwitchClosed })} 
                onSelectComponent={setSelectedApparatusName}
              />

              <ResistanceWire3D 
                nominalR={circuitParams.wireNominalResistanceOhms} 
                lengthCm={circuitParams.wireLengthCm} 
                current={circuitState.currentAmperes} 
                powerWatts={circuitState.circuitPowerWatts}
                onSelectComponent={setSelectedApparatusName}
              />

              <ConnectingWires3D isClosed={circuitParams.isSwitchClosed} />

              {/* Orbit Controls with Damping */}
              <OrbitControls 
                enableDamping 
                dampingFactor={0.05} 
                maxPolarAngle={Math.PI / 2 + 0.05} 
                minDistance={3.5} 
                maxDistance={14} 
              />
            </Canvas>

            {/* Floating Live Electrical HUD (Overlay) */}
            <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 shadow-2xl pointer-events-none space-y-2 text-xs max-w-xs">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                <span className="text-slate-400">Current (Ammeter I):</span>
                <span className="text-emerald-400 font-mono font-black text-lg">
                  {circuitState.currentAmperes.toFixed(3)} A
                </span>
              </div>

              <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                <span className="text-slate-400">Voltage Drop (V):</span>
                <span className="text-sky-400 font-mono font-black text-lg">
                  {circuitState.measuredVoltageDropVolts.toFixed(3)} V
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Calculated R (V / I):</span>
                <span className="text-amber-300 font-mono font-bold">
                  {circuitState.currentAmperes > 0 
                    ? (circuitState.measuredVoltageDropVolts / circuitState.currentAmperes).toFixed(3) 
                    : '—'} Ω
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Linear Density (R / L):</span>
                <span className="text-purple-300 font-mono font-bold">
                  {circuitState.resistancePerUnitLengthOhmsPerMeter.toFixed(3)} Ω/m
                </span>
              </div>

              {circuitState.circuitPowerWatts > 3.0 && (
                <div className="flex items-center gap-1.5 text-[10px] text-rose-300 bg-rose-950/40 border border-rose-500/30 p-1.5 rounded-lg mt-1 font-semibold">
                  <Flame className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>Joule Heating active (P = {circuitState.circuitPowerWatts.toFixed(2)} W)</span>
                </div>
              )}
            </div>

            {/* Quick Action Floating Controls */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <button
                onClick={() => onUpdateParams({ isSwitchClosed: !circuitParams.isSwitchClosed })}
                className={`px-4 py-2.5 rounded-2xl font-bold text-xs shadow-xl transition-all flex items-center gap-2 active:scale-95 cursor-pointer ${
                  circuitParams.isSwitchClosed
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40'
                }`}
              >
                <Power className="w-4 h-4" />
                <span>{circuitParams.isSwitchClosed ? 'Open Key Switch' : 'Close Plug Key'}</span>
              </button>

              <button
                onClick={onRecordObservation}
                disabled={!circuitParams.isSwitchClosed || circuitState.currentAmperes <= 0}
                className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-slate-950" />
                <span>Log Reading to Table</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: MEASUREMENT OBSERVATION TABLE */}
        {activeTab === 'table' && (
          <div className="p-6 space-y-4 overflow-y-auto max-h-[500px]">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Table className="w-4 h-4 text-amber-400" />
                  <span>Empirical Circuit Measurement Log</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Readings captured dynamically from the 3D circuit bench.
                </p>
              </div>

              {onClearReadings && (
                <button
                  onClick={onClearReadings}
                  disabled={recordedReadings.length === 0}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-semibold text-rose-300 transition flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              )}
            </div>

            {recordedReadings.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
                <Activity className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-xs text-slate-400">
                  No readings logged yet. Switch to 3D Canvas, adjust the rheostat slider or battery voltage, and click <strong>Log Reading to Table</strong>.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-3">Trial</th>
                      <th className="p-3">Current I (A)</th>
                      <th className="p-3">Voltage Drop V (V)</th>
                      <th className="p-3">Resistance R = V / I (Ω)</th>
                      <th className="p-3">Power P = V · I (W)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {recordedReadings.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-800/40">
                        <td className="p-3 font-semibold text-purple-300">Reading #{i + 1}</td>
                        <td className="p-3 text-emerald-300">{r.current.toFixed(3)}</td>
                        <td className="p-3 text-sky-300">{r.voltage.toFixed(3)}</td>
                        <td className="p-3 text-amber-300 font-bold">{r.resistance.toFixed(3)}</td>
                        <td className="p-3 text-slate-300">{r.power.toFixed(3)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: LIVE V-I GRAPH WITH REGRESSION SLOPE */}
        {activeTab === 'graph' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <LineChart className="w-4 h-4 text-sky-400" />
                  <span>Experimental Potential Difference (V) vs Current (I) Plot</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Slope ΔV / ΔI represents wire resistance R. A straight line verifies Ohm's Law.
                </p>
              </div>

              {regression && (
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="px-3 py-1 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 font-bold">
                    Slope R = {regression.slopeR} Ω
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 font-bold">
                    R² = {regression.rSquared}
                  </span>
                </div>
              )}
            </div>

            {/* SVG Plot */}
            <div className="w-full h-72 bg-slate-950 rounded-2xl p-4 relative border border-slate-800 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 500 240">
                {/* Axes */}
                <line x1="50" y1="200" x2="480" y2="200" stroke="#334155" strokeWidth="1.5" />
                <line x1="50" y1="30" x2="50" y2="200" stroke="#334155" strokeWidth="1.5" />

                {/* Ticks */}
                <text x="50" y="218" fill="#94a3b8" fontSize="10" textAnchor="middle">0.0</text>
                <text x="157" y="218" fill="#94a3b8" fontSize="10" textAnchor="middle">0.4</text>
                <text x="265" y="218" fill="#94a3b8" fontSize="10" textAnchor="middle">0.8</text>
                <text x="372" y="218" fill="#94a3b8" fontSize="10" textAnchor="middle">1.2</text>
                <text x="480" y="218" fill="#94a3b8" fontSize="10" textAnchor="middle">1.6 A</text>

                <text x="40" y="200" fill="#94a3b8" fontSize="10" textAnchor="end">0.0</text>
                <text x="40" y="145" fill="#94a3b8" fontSize="10" textAnchor="end">1.0</text>
                <text x="40" y="90" fill="#94a3b8" fontSize="10" textAnchor="end">2.0</text>
                <text x="40" y="35" fill="#94a3b8" fontSize="10" textAnchor="end">3.0 V</text>

                {/* Regression Line */}
                {regression && regression.slopeR > 0 && (
                  <line
                    x1="50"
                    y1="200"
                    x2={50 + 1.2 * 268}
                    y2={200 - (1.2 * regression.slopeR / 3.0) * 165}
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                    strokeDasharray="4 2"
                  />
                )}

                {/* Data Points */}
                {recordedReadings.map((pt, idx) => {
                  if (pt.current <= 0 || pt.voltage <= 0) return null;
                  const cx = 50 + (pt.current / 1.6) * 430;
                  const cy = 200 - (pt.voltage / 3.0) * 165;
                  return (
                    <g key={idx}>
                      <circle cx={cx} cy={cy} r="5" fill="#fbbf24" stroke="#78350f" strokeWidth="1.5" />
                      <text x={cx + 7} y={cy - 6} fill="#fef08a" fontSize="9" fontFamily="monospace">
                        ({pt.current.toFixed(2)}A, {pt.voltage.toFixed(2)}V)
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Circuit Workbench Variable Control Sliders */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-3 shrink-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Voltage Supply Knob */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-semibold">DC Battery Voltage (V_supply):</span>
              <span className="text-sky-400 font-mono font-bold">{circuitParams.supplyVoltageVolts.toFixed(1)} V</span>
            </div>
            <input
              type="range"
              min="0"
              max="12"
              step="0.5"
              value={circuitParams.supplyVoltageVolts}
              onChange={(e) => onUpdateParams({ supplyVoltageVolts: Number(e.target.value) })}
              className="w-full accent-sky-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
            />
          </div>

          {/* Rheostat Slider */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-semibold">Rheostat Variable Resistance (R_rh):</span>
              <span className="text-amber-400 font-mono font-bold">{circuitParams.rheostatResistanceOhms.toFixed(1)} Ω</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="0.5"
              value={circuitParams.rheostatResistanceOhms}
              onChange={(e) => onUpdateParams({ rheostatResistanceOhms: Number(e.target.value) })}
              className="w-full accent-amber-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
            />
          </div>
        </div>

        {/* Nichrome Wire Length Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Nichrome Wire Length:</span>
            {[50, 100, 150].map((l) => (
              <button
                key={l}
                onClick={() => onUpdateParams({
                  wireLengthCm: l,
                  wireNominalResistanceOhms: Number((2.5 * (l / 100)).toFixed(2))
                })}
                className={`px-3 py-1 rounded-xl font-medium transition cursor-pointer ${
                  circuitParams.wireLengthCm === l
                    ? 'bg-purple-600 text-white font-bold shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {l} cm ({(2.5 * (l / 100)).toFixed(2)} Ω)
              </button>
            ))}
          </div>

          <div className="text-[11px] text-slate-400 font-mono">
            Status: {circuitState.statusMessage}
          </div>
        </div>
      </div>
    </div>
  );
};
