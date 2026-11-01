import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MicroscopeSpecimen, OpticalParameters, OpticalState } from '../simulation/biologySimulation';
import { RotateCcw, ZoomIn, Eye, Sliders, CheckCircle2, Info, Compass } from 'lucide-react';

interface BiologyMicroscope3DProps {
  specimen: MicroscopeSpecimen;
  opticsParams: OpticalParameters;
  opticsState: OpticalState;
  onUpdateOptics: (partial: Partial<OpticalParameters>) => void;
  onSelectSpecimen: (specimenId: string) => void;
}

export const BiologyMicroscope3D: React.FC<BiologyMicroscope3DProps> = ({
  specimen,
  opticsParams,
  opticsState,
  onUpdateOptics,
  onSelectSpecimen,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedStructure, setSelectedStructure] = useState<{ name: string; description: string } | null>(null);
  const [showFovOverlay, setShowFovOverlay] = useState<boolean>(true);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const nosepieceRef = useRef<THREE.Group | null>(null);
  const stageMeshRef = useRef<THREE.Mesh | null>(null);

  // Initialize 3D Microscope Scene
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
      console.warn('WebGL init failed', e);
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
    camera.position.set(0, 4.2, 7.8);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.1;
    controls.minDistance = 3.5;
    controls.maxDistance = 15;
    controls.target.set(0, 2.0, 0);
    controlsRef.current = controls;

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(6, 12, 8);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const softFill = new THREE.DirectionalLight(0xa5b4fc, 0.5);
    softFill.position.set(-6, 6, -4);
    scene.add(softFill);

    // --- Lab Tabletop ---
    const tableGeo = new THREE.CylinderGeometry(6, 6, 0.3, 48);
    const tableMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4, metalness: 0.1 });
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.y = -0.15;
    table.receiveShadow = true;
    scene.add(table);

    // --- 3D Microscope Assembly ---
    const microscopeGroup = new THREE.Group();

    // Horseshoe Heavy Cast Iron Base
    const baseGeo = new THREE.BoxGeometry(2.4, 0.4, 2.8);
    const blackEnamelMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.25,
      metalness: 0.3
    });
    const base = new THREE.Mesh(baseGeo, blackEnamelMat);
    base.position.set(0, 0.2, 0);
    base.castShadow = true;
    microscopeGroup.add(base);

    // Base Substage LED Illuminator Housing
    const lampGeo = new THREE.CylinderGeometry(0.45, 0.55, 0.5, 32);
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.85,
      roughness: 0.15
    });
    const lamp = new THREE.Mesh(lampGeo, chromeMat);
    lamp.position.set(0, 0.45, 0.4);
    microscopeGroup.add(lamp);

    // LED Lamp Diffuser Lens (Glows based on diaphragm setting)
    const bulbGeo = new THREE.CircleGeometry(0.35, 32);
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.rotation.x = -Math.PI / 2;
    bulb.position.set(0, 0.71, 0.4);
    microscopeGroup.add(bulb);

    // Curved Sturdy Cast Limb / Arm
    const armGeo = new THREE.BoxGeometry(0.6, 3.2, 0.7);
    const arm = new THREE.Mesh(armGeo, blackEnamelMat);
    arm.position.set(0, 2.0, -0.85);
    arm.castShadow = true;
    microscopeGroup.add(arm);

    // Horizontal Stage Support Bracket
    const bracketGeo = new THREE.BoxGeometry(0.8, 0.3, 1.2);
    const bracket = new THREE.Mesh(bracketGeo, blackEnamelMat);
    bracket.position.set(0, 1.6, -0.2);
    microscopeGroup.add(bracket);

    // Mechanical Specimen Stage (Black Anodized Aluminum with Glass Aperture)
    const stageGeo = new THREE.BoxGeometry(2.5, 0.15, 2.2);
    const stageMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.3,
      metalness: 0.2
    });
    const stageMesh = new THREE.Mesh(stageGeo, stageMat);
    stageMesh.position.set(0, 1.8, 0.3);
    stageMeshRef.current = stageMesh;
    microscopeGroup.add(stageMesh);

    // Glass Specimen Slide on Stage
    const slideGeo = new THREE.BoxGeometry(1.8, 0.04, 0.8);
    const slideGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.65,
      transmission: 0.85,
      roughness: 0.1,
      ior: 1.5
    });
    const slide = new THREE.Mesh(slideGeo, slideGlassMat);
    slide.position.set(0, 1.9, 0.3);
    microscopeGroup.add(slide);

    // Stained Specimen Spot under Cover Slip
    const spotGeo = new THREE.CircleGeometry(0.18, 24);
    const spotMat = new THREE.MeshBasicMaterial({
      color: specimen.id === 'specimen_onion_peel' ? 0xf43f5e : specimen.id === 'specimen_cheek_cell' ? 0x2563eb : 0x10b981
    });
    const spot = new THREE.Mesh(spotGeo, spotMat);
    spot.rotation.x = -Math.PI / 2;
    spot.position.set(0, 1.925, 0.3);
    microscopeGroup.add(spot);

    // Stage Spring Clips (Brass Chrome)
    const clipGeo = new THREE.BoxGeometry(0.1, 0.06, 0.7);
    const clip1 = new THREE.Mesh(clipGeo, chromeMat);
    clip1.position.set(-0.7, 1.93, 0.3);
    const clip2 = new THREE.Mesh(clipGeo, chromeMat);
    clip2.position.set(0.7, 1.93, 0.3);
    microscopeGroup.add(clip1, clip2);

    // Coaxial Coarse & Fine Focus Knobs on Arm
    const coarseGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.4, 32);
    const coarseMat = new THREE.MeshStandardMaterial({ color: 0x3f3f46, roughness: 0.5, metalness: 0.4 });
    const coarseKnobLeft = new THREE.Mesh(coarseGeo, coarseMat);
    coarseKnobLeft.rotation.z = Math.PI / 2;
    coarseKnobLeft.position.set(-0.55, 1.9, -0.85);

    const coarseKnobRight = new THREE.Mesh(coarseGeo, coarseMat);
    coarseKnobRight.rotation.z = Math.PI / 2;
    coarseKnobRight.position.set(0.55, 1.9, -0.85);

    // Outer smaller fine knob
    const fineGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.6, 32);
    const fineKnobLeft = new THREE.Mesh(fineGeo, chromeMat);
    fineKnobLeft.rotation.z = Math.PI / 2;
    fineKnobLeft.position.set(-0.65, 1.9, -0.85);
    const fineKnobRight = new THREE.Mesh(fineGeo, chromeMat);
    fineKnobRight.rotation.z = Math.PI / 2;
    fineKnobRight.position.set(0.65, 1.9, -0.85);

    microscopeGroup.add(coarseKnobLeft, coarseKnobRight, fineKnobLeft, fineKnobRight);

    // Head Assembly & Body Tube
    const headArmGeo = new THREE.BoxGeometry(0.7, 0.5, 1.5);
    const headArm = new THREE.Mesh(headArmGeo, blackEnamelMat);
    headArm.position.set(0, 3.6, -0.3);
    microscopeGroup.add(headArm);

    // Revolving Nosepiece Turret
    const nosepieceGroup = new THREE.Group();
    nosepieceGroup.position.set(0, 3.2, 0.3);

    const turretDiskGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.2, 32);
    const turretDisk = new THREE.Mesh(turretDiskGeo, chromeMat);
    nosepieceGroup.add(turretDisk);

    // 3 Objective Lenses (4x, 10x, 40x)
    const objGeo4x = new THREE.CylinderGeometry(0.12, 0.1, 0.5, 16);
    const objGeo10x = new THREE.CylinderGeometry(0.12, 0.09, 0.75, 16);
    const objGeo40x = new THREE.CylinderGeometry(0.12, 0.08, 0.95, 16);

    const objMat4x = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.5 }); // Red stripe 4x
    const objMat10x = new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.5 }); // Yellow stripe 10x
    const objMat40x = new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.5 }); // Blue stripe 40x

    const obj1 = new THREE.Mesh(objGeo10x, objMat10x);
    obj1.position.set(0, -0.4, 0.35); // Active downward
    obj1.rotation.x = Math.PI;

    const obj2 = new THREE.Mesh(objGeo4x, objMat4x);
    obj2.position.set(0.35, -0.3, -0.2);
    obj2.rotation.z = 0.4;

    const obj3 = new THREE.Mesh(objGeo40x, objMat40x);
    obj3.position.set(-0.35, -0.4, -0.2);
    obj3.rotation.z = -0.4;

    nosepieceGroup.add(obj1, obj2, obj3);
    nosepieceRef.current = nosepieceGroup;
    microscopeGroup.add(nosepieceGroup);

    // Eyepiece Monocular/Binocular Incline Tube
    const tubeGeo = new THREE.CylinderGeometry(0.2, 0.22, 1.4, 24);
    const eyeTube = new THREE.Mesh(tubeGeo, blackEnamelMat);
    eyeTube.rotation.x = -0.45;
    eyeTube.position.set(0, 4.3, -0.1);
    microscopeGroup.add(eyeTube);

    // Eyepiece 10x Ocular Lens Cap
    const ocularGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.4, 24);
    const ocular = new THREE.Mesh(ocularGeo, chromeMat);
    ocular.rotation.x = -0.45;
    ocular.position.set(0, 4.9, 0.15);
    microscopeGroup.add(ocular);

    scene.add(microscopeGroup);

    // Resize
    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();

      // Subtle rotation on nosepiece when objective changes
      if (nosepieceRef.current) {
        const targetRot = opticsParams.objectiveMagnification === 4 ? 1.0 : opticsParams.objectiveMagnification === 40 ? -1.0 : 0.0;
        nosepieceRef.current.rotation.y += (targetRot - nosepieceRef.current.rotation.y) * 0.1;
      }

      // Stage vertical motion with focus adjustments
      if (stageMeshRef.current) {
        const targetStageY = 1.8 + (opticsParams.coarseFocusPosition - 50) * 0.003;
        stageMeshRef.current.position.y += (targetStageY - stageMeshRef.current.position.y) * 0.1;
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

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-white rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-200">
            3D Compound Optical Microscope &amp; Cytological Mount Station
          </span>
          <span className="text-[10px] text-emerald-300 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-mono">
            {opticsState.totalMagnification}× Optical Magnification
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFovOverlay(!showFovOverlay)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition flex items-center gap-1 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showFovOverlay ? 'Hide Eyepiece FOV' : 'Show Eyepiece FOV'}</span>
          </button>
        </div>
      </div>

      {/* Main Dual Work Area: 3D Canvas + Circular Eyepiece Field of View */}
      <div className="relative flex-1 min-h-[380px] w-full flex flex-col lg:flex-row overflow-hidden" ref={mountRef}>
        {/* Left / Center: Three.js 3D Microscope View */}
        <div className="relative flex-1 h-full min-h-[280px]">
          {webglSupported ? (
            <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-400 text-xs p-6">
              3D WebGL viewport offline. Use the high-resolution optical eyepiece panel on the right.
            </div>
          )}

          {/* Quick 3D Overlay Badge */}
          <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-md border border-slate-700/80 rounded-xl p-2.5 text-xs pointer-events-none space-y-1">
            <div className="text-[11px] font-bold text-slate-300">Specimen Slide on Stage:</div>
            <div className="text-emerald-400 font-semibold">{specimen.name}</div>
            <div className="text-[10px] text-slate-400">Stain: {specimen.stainUsed}</div>
          </div>
        </div>

        {/* Right: High-Precision Eyepiece Field of View (FOV) Viewport */}
        {showFovOverlay && (
          <div className="w-full lg:w-96 bg-slate-900/95 border-t lg:border-t-0 lg:border-l border-slate-800 p-4 flex flex-col items-center justify-between shrink-0 overflow-y-auto">
            <div className="w-full flex items-center justify-between text-xs pb-2 border-b border-slate-800">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-blue-400" />
                <span>Ocular Eyepiece Field</span>
              </span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                opticsState.isFocused 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}>
                {opticsState.isFocused ? 'SHARP FOCUS ✓' : `DEFOCUSED (${opticsState.defocusBlurPx}px)`}
              </span>
            </div>

            {/* Circular Microscope Aperture with Authentic Cellular Specimen Art */}
            <div className="relative my-3">
              <div 
                className="w-56 h-56 rounded-full border-4 border-slate-950 overflow-hidden relative shadow-2xl bg-black"
                style={{
                  boxShadow: 'inset 0 0 40px rgba(0,0,0,0.9), 0 0 25px rgba(59,130,246,0.2)'
                }}
              >
                {/* Specimen SVG Cellular Micrograph with Dynamic Blur and Illumination */}
                <div 
                  className="w-full h-full relative transition-all duration-200"
                  style={{
                    filter: `blur(${opticsState.defocusBlurPx}px) brightness(${opticsState.lightIntensityNormalized})`,
                    transform: `scale(${opticsParams.objectiveMagnification === 40 ? 1.6 : opticsParams.objectiveMagnification === 10 ? 1.0 : 0.6})`
                  }}
                >
                  {specimen.id === 'specimen_onion_peel' ? (
                    /* Plant Epidermal Cells Pattern (Rectangular compact bricks) */
                    <svg className="w-full h-full" viewBox="0 0 200 200">
                      <rect width="200" height="200" fill="#fdf2f8" />
                      {/* Brick row 1 */}
                      <rect x="5" y="10" width="90" height="40" fill="#ffe4e6" stroke="#e11d48" strokeWidth="2.5" rx="3" />
                      <circle cx="80" cy="30" r="5" fill="#be123c" />
                      <rect x="100" y="10" width="95" height="40" fill="#ffe4e6" stroke="#e11d48" strokeWidth="2.5" rx="3" />
                      <circle cx="175" cy="30" r="5" fill="#be123c" />
                      {/* Brick row 2 (offset) */}
                      <rect x="-10" y="55" width="75" height="42" fill="#ffe4e6" stroke="#e11d48" strokeWidth="2.5" rx="3" />
                      <circle cx="50" cy="76" r="5" fill="#be123c" />
                      <rect x="70" y="55" width="85" height="42" fill="#ffe4e6" stroke="#e11d48" strokeWidth="2.5" rx="3" />
                      <circle cx="140" cy="76" r="5" fill="#be123c" />
                      <rect x="160" y="55" width="50" height="42" fill="#ffe4e6" stroke="#e11d48" strokeWidth="2.5" rx="3" />
                      {/* Brick row 3 */}
                      <rect x="5" y="102" width="92" height="42" fill="#ffe4e6" stroke="#e11d48" strokeWidth="2.5" rx="3" />
                      <circle cx="82" cy="122" r="5" fill="#be123c" />
                      <rect x="102" y="102" width="92" height="42" fill="#ffe4e6" stroke="#e11d48" strokeWidth="2.5" rx="3" />
                      <circle cx="178" cy="122" r="5" fill="#be123c" />
                      {/* Brick row 4 */}
                      <rect x="35" y="149" width="85" height="42" fill="#ffe4e6" stroke="#e11d48" strokeWidth="2.5" rx="3" />
                      <circle cx="105" cy="170" r="5" fill="#be123c" />
                      <rect x="125" y="149" width="85" height="42" fill="#ffe4e6" stroke="#e11d48" strokeWidth="2.5" rx="3" />
                    </svg>
                  ) : specimen.id === 'specimen_cheek_cell' ? (
                    /* Human Cheek Cells Pattern (Irregular polygonal cells, central dark blue nucleus) */
                    <svg className="w-full h-full" viewBox="0 0 200 200">
                      <rect width="200" height="200" fill="#f0f9ff" />
                      {/* Primary Central Cell */}
                      <polygon points="55,40 135,35 165,85 145,150 70,160 35,110" fill="#dbeafe" stroke="#2563eb" strokeWidth="2.2" />
                      <circle cx="102" cy="98" r="8.5" fill="#1e3a8a" />
                      {/* Adjacent Cell 2 */}
                      <polygon points="135,35 190,45 205,100 165,85" fill="#e0f2fe" stroke="#3b82f6" strokeWidth="1.8" />
                      <circle cx="175" cy="65" r="7" fill="#1e3a8a" />
                      {/* Adjacent Cell 3 */}
                      <polygon points="145,150 195,140 185,190 120,185 70,160" fill="#e0f2fe" stroke="#3b82f6" strokeWidth="1.8" />
                      <circle cx="145" cy="172" r="7" fill="#1e3a8a" />
                    </svg>
                  ) : (
                    /* Amoeba Proteus with flowing pseudopodia */
                    <svg className="w-full h-full" viewBox="0 0 200 200">
                      <rect width="200" height="200" fill="#f0fdf4" />
                      <path 
                        d="M 60,60 C 80,30 130,40 150,70 C 170,100 185,120 160,150 C 135,180 80,185 50,150 C 20,115 40,90 60,60 Z"
                        fill="#dcfce7"
                        stroke="#16a34a"
                        strokeWidth="2.5"
                      />
                      <circle cx="100" cy="100" r="9" fill="#15803d" />
                      <circle cx="68" cy="85" r="6" fill="#86efac" stroke="#16a34a" strokeWidth="1.5" />
                      <circle cx="125" cy="130" r="4.5" fill="#166534" />
                    </svg>
                  )}
                </div>

                {/* Glass Optical Crosshair Graticule */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
                  <div className="w-full h-[1px] bg-slate-400" />
                  <div className="h-full w-[1px] bg-slate-400 absolute" />
                </div>

                {/* Clickable Organelle Pins on Specimen */}
                {opticsState.isFocused && specimen.structures.map((st, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedStructure(st)}
                    style={{ left: `${st.x}%`, top: `${st.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-[10px] font-bold flex items-center justify-center shadow-md animate-pulse cursor-pointer border border-white"
                    title={`Inspect: ${st.name}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              {/* Micrometry Scale Bar */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1 px-2">
                <span>FOV: ⌀ {opticsState.fieldOfViewDiameterUm} μm</span>
                <span className="flex items-center gap-1">
                  <span className="w-6 h-1 bg-amber-400 inline-block" />
                  <span>{opticsState.scaleBarLengthUm} μm</span>
                </span>
              </div>
            </div>

            {/* Selected Structure Inspector Card */}
            {selectedStructure ? (
              <div className="w-full p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs space-y-1">
                <div className="font-bold text-blue-300 flex items-center justify-between">
                  <span>{selectedStructure.name}</span>
                  <button 
                    onClick={() => setSelectedStructure(null)}
                    className="text-slate-400 hover:text-white"
                  >
                    &times;
                  </button>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  {selectedStructure.description}
                </p>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 italic text-center">
                Tap numbered pins on sharp focus to inspect biological organelle functions.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Optical Bench Controls Bar */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-3">
        {/* Specimen Slide Selector */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-slate-400">Select Mount Slide:</span>
          {[
            { id: 'specimen_onion_peel', label: 'Onion Epidermal Peel (Plant)' },
            { id: 'specimen_cheek_cell', label: 'Human Cheek Epithelium (Animal)' },
            { id: 'specimen_amoeba', label: 'Pond Water Amoeba (Protozoa)' }
          ].map(s => (
            <button
              key={s.id}
              onClick={() => onSelectSpecimen(s.id)}
              className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer ${
                specimen.id === s.id
                  ? 'bg-blue-600 text-white font-bold shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Objective Lens Turret Selector */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-slate-400">Objective Turret Lens:</span>
          {([4, 10, 40] as const).map(mag => (
            <button
              key={mag}
              onClick={() => onUpdateOptics({ objectiveMagnification: mag })}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition cursor-pointer flex items-center gap-1.5 ${
                opticsParams.objectiveMagnification === mag
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>{mag}× Objective</span>
              <span className="text-[10px] font-mono text-slate-500 font-normal">
                ({mag * opticsParams.eyepieceMagnification}× Total)
              </span>
            </button>
          ))}
        </div>

        {/* Coaxial Focus Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-semibold">Coarse Focus Knob (Stage Z):</span>
              <span className="text-amber-400 font-mono">{opticsParams.coarseFocusPosition}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={opticsParams.coarseFocusPosition}
              onChange={(e) => onUpdateOptics({ coarseFocusPosition: Number(e.target.value) })}
              className="w-full accent-blue-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-semibold">Fine Focus Knob (Micrometric):</span>
              <span className="text-amber-400 font-mono">{opticsParams.fineFocusPosition}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={opticsParams.fineFocusPosition}
              onChange={(e) => onUpdateOptics({ fineFocusPosition: Number(e.target.value) })}
              className="w-full accent-blue-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
