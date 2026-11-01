import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CircuitParameters, CircuitState } from '../simulation/physicsSimulation';
import { RotateCcw, Zap, Power, Sliders, Activity, Info, Plus } from 'lucide-react';

interface PhysicsCircuit3DProps {
  circuitParams: CircuitParameters;
  circuitState: CircuitState;
  onUpdateParams: (partial: Partial<CircuitParameters>) => void;
  onRecordObservation: () => void;
}

export const PhysicsCircuit3D: React.FC<PhysicsCircuit3DProps> = ({
  circuitParams,
  circuitState,
  onUpdateParams,
  onRecordObservation,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const ammeterNeedleRef = useRef<THREE.Mesh | null>(null);
  const voltmeterNeedleRef = useRef<THREE.Mesh | null>(null);
  const switchBladeRef = useRef<THREE.Mesh | null>(null);
  const rheostatSliderRef = useRef<THREE.Mesh | null>(null);

  // Initialize Three.js 3D Circuit Scene
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = mountRef.current;
    if (!canvas || !container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
    } catch (e) {
      console.warn('WebGL init failed for circuit', e);
      setWebglSupported(false);
      return;
    }

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 5.0, 7.5);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.05;
    controls.minDistance = 3.5;
    controls.maxDistance = 14;
    controls.target.set(0, 0.8, 0);
    controlsRef.current = controls;

    // --- Lighting ---
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(6, 12, 8);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const cyanAccent = new THREE.DirectionalLight(0x38bdf8, 0.4);
    cyanAccent.position.set(-6, 4, -4);
    scene.add(cyanAccent);

    // --- Heavy Teak Wooden Laboratory Bench ---
    const benchGeo = new THREE.BoxGeometry(9.0, 0.4, 5.5);
    const benchMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.4,
      metalness: 0.1
    });
    const bench = new THREE.Mesh(benchGeo, benchMat);
    bench.position.y = -0.2;
    bench.receiveShadow = true;
    scene.add(bench);

    // --- Materials Palette ---
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.2 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.15 });
    const porcelainMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
    const meterCasingMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.3 });
    const meterDialMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const wireMatRed = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.5 });
    const wireMatBlack = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });

    // --- 1. DC Power Supply (Left Rear) ---
    const supplyGroup = new THREE.Group();
    supplyGroup.position.set(-3.0, 0.6, -1.2);

    const supplyBoxGeo = new THREE.BoxGeometry(1.8, 1.2, 1.4);
    const supplyMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.5, roughness: 0.3 });
    const supplyBox = new THREE.Mesh(supplyBoxGeo, supplyMat);
    supplyBox.castShadow = true;
    supplyGroup.add(supplyBox);

    // Glowing LED readout screen on power supply
    const ledScreenGeo = new THREE.BoxGeometry(0.8, 0.35, 0.05);
    const ledScreenMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
    const ledScreen = new THREE.Mesh(ledScreenGeo, ledScreenMat);
    ledScreen.position.set(0, 0.25, 0.71);
    supplyGroup.add(ledScreen);

    // Binding Posts (+ Red, - Black)
    const postGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.2, 16);
    const postRed = new THREE.Mesh(postGeo, wireMatRed);
    postRed.rotation.x = Math.PI / 2;
    postRed.position.set(0.4, -0.25, 0.72);
    const postBlack = new THREE.Mesh(postGeo, wireMatBlack);
    postBlack.rotation.x = Math.PI / 2;
    postBlack.position.set(-0.4, -0.25, 0.72);
    supplyGroup.add(postRed, postBlack);

    scene.add(supplyGroup);

    // --- 2. Moving Coil DC Ammeter (Center Left) ---
    const ammeterGroup = new THREE.Group();
    ammeterGroup.position.set(-1.0, 0.5, 0.4);

    const meterCaseGeo = new THREE.BoxGeometry(1.4, 0.9, 1.1);
    const ammeterCase = new THREE.Mesh(meterCaseGeo, meterCasingMat);
    ammeterCase.castShadow = true;
    ammeterGroup.add(ammeterCase);

    // Beveled dial face
    const dialGeo = new THREE.PlaneGeometry(1.1, 0.65);
    const ammeterDial = new THREE.Mesh(dialGeo, meterDialMat);
    ammeterDial.position.set(0, 0.1, 0.56);
    ammeterGroup.add(ammeterDial);

    // Needle pivot and needle pointer
    const needleGeo = new THREE.BoxGeometry(0.02, 0.45, 0.01);
    const needleMat = new THREE.MeshBasicMaterial({ color: 0xdc2626 });
    const ammeterNeedle = new THREE.Mesh(needleGeo, needleMat);
    ammeterNeedle.position.set(0, -0.05, 0.57);
    ammeterNeedle.geometry.translate(0, 0.22, 0); // Rotate around base
    ammeterNeedleRef.current = ammeterNeedle;
    ammeterGroup.add(ammeterNeedle);

    scene.add(ammeterGroup);

    // --- 3. Moving Coil DC Voltmeter (Center Right) ---
    const voltmeterGroup = new THREE.Group();
    voltmeterGroup.position.set(1.1, 0.5, 0.4);

    const voltmeterCase = new THREE.Mesh(meterCaseGeo, meterCasingMat);
    voltmeterCase.castShadow = true;
    voltmeterGroup.add(voltmeterCase);

    const voltmeterDial = new THREE.Mesh(dialGeo, meterDialMat);
    voltmeterDial.position.set(0, 0.1, 0.56);
    voltmeterGroup.add(voltmeterDial);

    const voltmeterNeedle = new THREE.Mesh(needleGeo, needleMat);
    voltmeterNeedle.position.set(0, -0.05, 0.57);
    voltmeterNeedle.geometry.translate(0, 0.22, 0);
    voltmeterNeedleRef.current = voltmeterNeedle;
    voltmeterGroup.add(voltmeterNeedle);

    scene.add(voltmeterGroup);

    // --- 4. Sliding Wire-Wound Rheostat (Right Rear) ---
    const rheostatGroup = new THREE.Group();
    rheostatGroup.position.set(2.8, 0.45, -1.2);

    // Porcelain insulating tube
    const tubeGeo = new THREE.CylinderGeometry(0.35, 0.35, 2.4, 32);
    tubeGeo.rotateZ(Math.PI / 2);
    const tube = new THREE.Mesh(tubeGeo, porcelainMat);
    rheostatGroup.add(tube);

    // Metal ends
    const endGeo = new THREE.BoxGeometry(0.2, 0.9, 0.9);
    const end1 = new THREE.Mesh(endGeo, meterCasingMat);
    end1.position.x = -1.2;
    const end2 = new THREE.Mesh(endGeo, meterCasingMat);
    end2.position.x = 1.2;
    rheostatGroup.add(end1, end2);

    // Top slider guide rod
    const rodGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.4, 16);
    rodGeo.rotateZ(Math.PI / 2);
    const rod = new THREE.Mesh(rodGeo, chromeMat);
    rod.position.y = 0.5;
    rheostatGroup.add(rod);

    // Movable brass slider collar
    const sliderGeo = new THREE.BoxGeometry(0.25, 0.35, 0.4);
    const slider = new THREE.Mesh(sliderGeo, brassMat);
    slider.position.set(0, 0.45, 0);
    rheostatSliderRef.current = slider;
    rheostatGroup.add(slider);

    scene.add(rheostatGroup);

    // --- 5. Knife Plug Switch (Center Front) ---
    const switchGroup = new THREE.Group();
    switchGroup.position.set(0, 0.15, 1.8);

    const switchBaseGeo = new THREE.BoxGeometry(1.2, 0.12, 0.8);
    const switchBase = new THREE.Mesh(switchBaseGeo, porcelainMat);
    switchGroup.add(switchBase);

    // Brass jaw terminals
    const jawGeo = new THREE.BoxGeometry(0.12, 0.3, 0.12);
    const jaw1 = new THREE.Mesh(jawGeo, brassMat);
    jaw1.position.set(-0.35, 0.15, 0);
    const jaw2 = new THREE.Mesh(jawGeo, brassMat);
    jaw2.position.set(0.35, 0.15, 0);
    switchGroup.add(jaw1, jaw2);

    // Pivoting switch blade
    const bladeGeo = new THREE.BoxGeometry(0.7, 0.08, 0.04);
    bladeGeo.translate(0.35, 0, 0); // Pivot at one end
    const blade = new THREE.Mesh(bladeGeo, brassMat);
    blade.position.set(-0.35, 0.18, 0);
    switchBladeRef.current = blade;
    switchGroup.add(blade);

    scene.add(switchGroup);

    // --- 6. Stretched Nichrome Resistance Wire on Wooden Base (Center Table) ---
    const wireBoardGeo = new THREE.BoxGeometry(2.2, 0.08, 0.5);
    const wireBoard = new THREE.Mesh(wireBoardGeo, porcelainMat);
    wireBoard.position.set(0, 0.08, -0.2);
    scene.add(wireBoard);

    // Wire brass terminal studs
    const studGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.18, 16);
    const stud1 = new THREE.Mesh(studGeo, brassMat);
    stud1.position.set(-0.95, 0.18, -0.2);
    const stud2 = new THREE.Mesh(studGeo, brassMat);
    stud2.position.set(0.95, 0.18, -0.2);
    scene.add(stud1, stud2);

    // The taut nichrome wire itself
    const nichromeGeo = new THREE.CylinderGeometry(0.015, 0.015, 1.9, 16);
    nichromeGeo.rotateZ(Math.PI / 2);
    const nichromeMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.2 });
    const nichromeWire = new THREE.Mesh(nichromeGeo, nichromeMat);
    nichromeWire.position.set(0, 0.22, -0.2);
    scene.add(nichromeWire);

    // --- Resize ---
    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // --- Loop ---
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();

      // Smooth damped needle deflection
      // Convert deflection angle (0 to 80 deg) to radian rotation
      const targetAmRads = -(circuitState.ammeterAngleDegrees * (Math.PI / 180));
      const targetVmRads = -(circuitState.voltmeterAngleDegrees * (Math.PI / 180));

      if (ammeterNeedleRef.current) {
        ammeterNeedleRef.current.rotation.z += (targetAmRads - ammeterNeedleRef.current.rotation.z) * 0.12;
      }
      if (voltmeterNeedleRef.current) {
        voltmeterNeedleRef.current.rotation.z += (targetVmRads - voltmeterNeedleRef.current.rotation.z) * 0.12;
      }

      // Switch blade position: Closed (0 deg) vs Open (45 deg)
      if (switchBladeRef.current) {
        const targetSwitchAngle = circuitParams.isSwitchClosed ? 0.0 : 0.65;
        switchBladeRef.current.rotation.z += (targetSwitchAngle - switchBladeRef.current.rotation.z) * 0.15;
      }

      // Rheostat slider translation along rod based on rheostat resistance (0 to 20 Ω)
      if (rheostatSliderRef.current) {
        const targetSliderX = -0.9 + (circuitParams.rheostatResistanceOhms / 20) * 1.8;
        rheostatSliderRef.current.position.x += (targetSliderX - rheostatSliderRef.current.position.x) * 0.1;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      controls.dispose();
    };
  }, []);

  const resetCamera = () => {
    if (controlsRef.current) controlsRef.current.reset();
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-white rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${circuitParams.isSwitchClosed ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
          <span className="text-xs font-bold text-slate-200">
            3D Ohm's Law Circuit Bench &amp; Resistance Station
          </span>
          <span className="text-[10px] text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30 font-mono">
            {circuitParams.isSwitchClosed ? 'CIRCUIT ENERGIZED' : 'SWITCH OPEN'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetCamera}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition flex items-center gap-1 cursor-pointer"
            title="Reset 3D camera"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Camera</span>
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Area */}
      <div className="relative flex-1 min-h-[380px] w-full overflow-hidden" ref={mountRef}>
        {webglSupported ? (
          <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-400 text-xs p-6">
            3D Circuit viewport fallback active.
          </div>
        )}

        {/* Live HUD Meter Readouts */}
        <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-3.5 shadow-xl pointer-events-none space-y-2 text-xs max-w-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Ammeter Reading (I):</span>
            <span className="text-emerald-400 font-mono font-black text-base">
              {circuitState.currentAmperes.toFixed(3)} A
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Voltmeter Drop (V):</span>
            <span className="text-sky-400 font-mono font-black text-base">
              {circuitState.measuredVoltageDropVolts.toFixed(3)} V
            </span>
          </div>

          <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Calculated R (V / I):</span>
            <span className="text-amber-300 font-mono font-bold">
              {circuitState.currentAmperes > 0 ? (circuitState.measuredVoltageDropVolts / circuitState.currentAmperes).toFixed(2) : '—'} Ω
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Joule Heating Power (P):</span>
            <span className="text-rose-300 font-mono">
              {circuitState.circuitPowerWatts.toFixed(2)} W
            </span>
          </div>
        </div>

        {/* Floating Quick Action: Switch Key & Record Reading */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          <button
            onClick={() => onUpdateParams({ isSwitchClosed: !circuitParams.isSwitchClosed })}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs shadow-lg transition-all flex items-center gap-2 active:scale-95 cursor-pointer ${
              circuitParams.isSwitchClosed
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{circuitParams.isSwitchClosed ? 'Open Key Switch' : 'Close Key Switch (Plug Key)'}</span>
          </button>

          <button
            onClick={onRecordObservation}
            disabled={!circuitParams.isSwitchClosed || circuitState.currentAmperes <= 0}
            className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Log to Observation Table</span>
          </button>
        </div>
      </div>

      {/* Circuit Adjustment Controls Bar */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* DC Battery Voltage Slider */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-semibold">DC Battery Voltage (V_supply):</span>
              <span className="text-sky-400 font-mono font-bold">{circuitParams.supplyVoltageVolts} V</span>
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
              <span className="text-slate-300 font-semibold">Rheostat Resistance (R_rh):</span>
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

        {/* Nichrome Wire Selection Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800 text-xs">
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
                    ? 'bg-purple-600 text-white font-bold'
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
