import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ChemicalSample, IndicatorType, ReactionResult } from '../simulation/chemistrySimulation';
import { RotateCcw, ZoomIn, ZoomOut, Info, Eye, Droplet, Sparkles } from 'lucide-react';

interface ChemistryLab3DProps {
  activeSample: ChemicalSample;
  activeIndicator: IndicatorType;
  dropsAdded: number;
  reactionResult: ReactionResult;
  onAddDrop: () => void;
  onSelectSample: (sampleId: string) => void;
  onSelectIndicator: (ind: IndicatorType) => void;
  onResetTube: () => void;
}

export const ChemistryLab3D: React.FC<ChemistryLab3DProps> = ({
  activeSample,
  activeIndicator,
  dropsAdded,
  reactionResult,
  onAddDrop,
  onSelectSample,
  onSelectIndicator,
  onResetTube,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedMeshName, setSelectedMeshName] = useState<string>('Test Tube A');
  const [isDroppingAnimation, setIsDroppingAnimation] = useState<boolean>(false);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);

  // Three.js scene references for reactive updates
  const sceneRef = useRef<THREE.Scene | null>(null);
  const liquidMeshRef = useRef<THREE.Mesh | null>(null);
  const dropperGroupRef = useRef<THREE.Group | null>(null);
  const dropParticleRef = useRef<THREE.Mesh | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // Initialize Three.js Scene
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
      console.warn('WebGL initialization failed, falling back to 2D view', e);
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
    camera.position.set(0, 3.5, 7.5);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.1; // Don't go below table
    controls.minDistance = 3.5;
    controls.maxDistance = 14;
    controls.target.set(0, 1.2, 0);
    controlsRef.current = controls;

    // --- Lighting Rig ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(5, 10, 7);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.6);
    rimLight.position.set(-6, 5, -5);
    scene.add(rimLight);

    // --- Studio Table Surface ---
    const tableGeo = new THREE.CylinderGeometry(6, 6, 0.4, 64);
    const tableMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.35,
      metalness: 0.2
    });
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.y = -0.2;
    table.receiveShadow = true;
    scene.add(table);

    // White porcelain experiment comparison tile
    const tileGeo = new THREE.BoxGeometry(4.2, 0.08, 2.5);
    const tileMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.1,
      metalness: 0.05
    });
    const tile = new THREE.Mesh(tileGeo, tileMat);
    tile.position.set(0, 0.04, 0.3);
    tile.receiveShadow = true;
    scene.add(tile);

    // --- Acrylic Test Tube Rack ---
    const rackGroup = new THREE.Group();

    const rackBaseGeo = new THREE.BoxGeometry(4.4, 0.12, 1.2);
    const rackMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.2,
      metalness: 0.1,
      transparent: true,
      opacity: 0.85
    });
    const rackBase = new THREE.Mesh(rackBaseGeo, rackMat);
    rackBase.position.y = 0.1;
    rackGroup.add(rackBase);

    const rackTopGeo = new THREE.BoxGeometry(4.4, 0.1, 1.2);
    const rackTop = new THREE.Mesh(rackTopGeo, rackMat);
    rackTop.position.y = 1.4;
    rackGroup.add(rackTop);

    // Rack vertical supports
    const supportGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.3, 16);
    const supportMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.6, roughness: 0.3 });
    const s1 = new THREE.Mesh(supportGeo, supportMat);
    s1.position.set(-2.0, 0.75, -0.45);
    const s2 = new THREE.Mesh(supportGeo, supportMat);
    s2.position.set(2.0, 0.75, -0.45);
    const s3 = new THREE.Mesh(supportGeo, supportMat);
    s3.position.set(-2.0, 0.75, 0.45);
    const s4 = new THREE.Mesh(supportGeo, supportMat);
    s4.position.set(2.0, 0.75, 0.45);
    rackGroup.add(s1, s2, s3, s4);

    scene.add(rackGroup);

    // --- Active Glass Test Tube with Liquid ---
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.9,
      ior: 1.52,
      thickness: 0.15,
      specularIntensity: 1.0
    });

    const tubeGroup = new THREE.Group();
    tubeGroup.name = 'Test Tube A';
    tubeGroup.position.set(0, 0.4, 0.3);

    // Test tube cylinder
    const tubeCylGeo = new THREE.CylinderGeometry(0.28, 0.28, 2.2, 32, 1, true);
    const tubeCyl = new THREE.Mesh(tubeCylGeo, glassMat);
    tubeCyl.position.y = 1.2;
    tubeCyl.castShadow = true;
    tubeGroup.add(tubeCyl);

    // Test tube bottom hemispherical curve
    const tubeBottomGeo = new THREE.SphereGeometry(0.28, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const tubeBottom = new THREE.Mesh(tubeBottomGeo, glassMat);
    tubeBottom.position.y = 0.1;
    tubeGroup.add(tubeBottom);

    // Test tube top rim collar
    const rimGeo = new THREE.TorusGeometry(0.29, 0.03, 16, 32);
    const rim = new THREE.Mesh(rimGeo, glassMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 2.3;
    tubeGroup.add(rim);

    // --- Liquid Inside Tube ---
    const liquidGeo = new THREE.CylinderGeometry(0.26, 0.26, 1.2, 32);
    const liquidMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(reactionResult.developedColorHex),
      transparent: true,
      opacity: 0.88,
      roughness: 0.15,
      metalness: 0.1
    });
    const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
    liquidMesh.position.y = 0.7;
    liquidMeshRef.current = liquidMesh;
    tubeGroup.add(liquidMesh);

    // Liquid surface meniscus
    const meniscusGeo = new THREE.CircleGeometry(0.26, 32);
    const meniscus = new THREE.Mesh(meniscusGeo, liquidMat);
    meniscus.rotation.x = -Math.PI / 2;
    meniscus.position.y = 1.3;
    tubeGroup.add(meniscus);

    scene.add(tubeGroup);

    // --- Secondary Test Tubes on Rack (Tubes B, C, D, E) ---
    const tubeOffsets = [-1.5, -0.75, 0.75, 1.5];
    const tubeNames = ['Tube B (NaOH)', 'Tube C (CH3COOH)', 'Tube D (Lemon)', 'Tube E (Water)'];
    const secondaryColors = [0x7c3aed, 0xf59e0b, 0xea580c, 0x10b981];

    tubeOffsets.forEach((xOff, idx) => {
      const g = new THREE.Group();
      g.name = tubeNames[idx];
      g.position.set(xOff, 0.4, 0);

      const body = new THREE.Mesh(tubeCylGeo, glassMat);
      body.position.y = 1.2;
      const btm = new THREE.Mesh(tubeBottomGeo, glassMat);
      btm.position.y = 0.1;

      // Small sample liquid inside secondary tubes
      const secLiqMat = new THREE.MeshStandardMaterial({
        color: secondaryColors[idx],
        transparent: true,
        opacity: 0.75,
        roughness: 0.2
      });
      const secLiq = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.9, 24), secLiqMat);
      secLiq.position.y = 0.55;

      g.add(body, btm, secLiq);
      scene.add(g);
    });

    // --- Glass Dropper Suspended Above Center Tube ---
    const dropperGroup = new THREE.Group();
    dropperGroup.name = 'Precision Glass Dropper';
    dropperGroup.position.set(0, 3.2, 0.3);

    // Dropper glass capillary tube
    const dropStemGeo = new THREE.CylinderGeometry(0.05, 0.02, 1.2, 16);
    const dropStem = new THREE.Mesh(dropStemGeo, glassMat);
    dropperGroup.add(dropStem);

    // Dropper rubber bulb
    const bulbGeo = new THREE.SphereGeometry(0.18, 24, 24);
    const bulbMat = new THREE.MeshStandardMaterial({
      color: activeIndicator === 'phenolphthalein' ? 0xe11d48 : activeIndicator === 'methyl_orange' ? 0xd97706 : 0x059669,
      roughness: 0.6,
      metalness: 0.1
    });
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.y = 0.7;
    bulb.scale.set(1, 1.4, 1);
    dropperGroup.add(bulb);

    dropperGroupRef.current = dropperGroup;
    scene.add(dropperGroup);

    // Falling Drop Particle (for animated addition)
    const dropGeo = new THREE.SphereGeometry(0.045, 16, 16);
    const dropMat = new THREE.MeshStandardMaterial({
      color: activeIndicator === 'phenolphthalein' ? 0xf43f5e : 0xf59e0b,
      transparent: true,
      opacity: 0.9
    });
    const dropParticle = new THREE.Mesh(dropGeo, dropMat);
    dropParticle.position.set(0, 2.5, 0.3);
    dropParticle.visible = false;
    dropParticleRef.current = dropParticle;
    scene.add(dropParticle);

    // --- Raycasting for Apparatus Selection ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        let obj: THREE.Object3D | null = intersects[0].object;
        while (obj && obj.parent && obj.parent !== scene) {
          if (obj.name) break;
          obj = obj.parent;
        }
        if (obj && obj.name) {
          setSelectedMeshName(obj.name);
        }
      }
    };

    canvas.addEventListener('pointerdown', handlePointerDown);

    // --- Resize Handler ---
    const handleResize = () => {
      if (!container || !renderer) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // --- Animation Loop ---
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      controls.update();

      // Gentle floating hover on dropper
      if (dropperGroupRef.current) {
        dropperGroupRef.current.position.y = 3.2 + Math.sin(elapsed * 2.0) * 0.04;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      renderer.dispose();
      controls.dispose();
    };
  }, []);

  // Update Liquid Color reactively based on simulation state
  useEffect(() => {
    if (liquidMeshRef.current) {
      const mat = liquidMeshRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.color.set(new THREE.Color(reactionResult.developedColorHex));
      }
    }
  }, [reactionResult.developedColorHex]);

  // Trigger drop fall animation when drop count increases
  const triggerDropAnimation = () => {
    if (isDroppingAnimation) return;
    setIsDroppingAnimation(true);
    onAddDrop();

    if (dropParticleRef.current) {
      dropParticleRef.current.visible = true;
      dropParticleRef.current.position.set(0, 2.5, 0.3);

      let start = performance.now();
      const dropDuration = 450; // ms

      const step = (now: number) => {
        const progress = Math.min(1.0, (now - start) / dropDuration);
        if (dropParticleRef.current) {
          // Quadratic fall
          dropParticleRef.current.position.y = 2.5 - 1.2 * (progress * progress);
        }

        if (progress < 1.0) {
          requestAnimationFrame(step);
        } else {
          if (dropParticleRef.current) dropParticleRef.current.visible = false;
          setIsDroppingAnimation(false);
        }
      };

      requestAnimationFrame(step);
    } else {
      setTimeout(() => setIsDroppingAnimation(false), 300);
    }
  };

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-white rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* 3D Canvas Top Bar Controls */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-200">
            Interactive Three.js WebGL Chemistry Station
          </span>
          <span className="text-[10px] text-purple-300 bg-purple-900/40 px-2 py-0.5 rounded-full border border-purple-500/30 font-mono">
            {selectedMeshName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetCamera}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition flex items-center gap-1 cursor-pointer"
            title="Reset 3D Camera view"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Camera</span>
          </button>
        </div>
      </div>

      {/* Main Viewport & Interactive 3D Canvas */}
      <div className="relative flex-1 min-h-[380px] w-full overflow-hidden" ref={mountRef}>
        {webglSupported ? (
          <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />
        ) : (
          /* 2D Schematic Fallback if WebGL unavailable */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-900">
            <div className="w-24 h-48 rounded-b-full border-4 border-slate-400 relative overflow-hidden bg-slate-800/80 mb-4 shadow-xl">
              <div 
                className="absolute bottom-0 left-0 right-0 h-32 transition-colors duration-500"
                style={{ backgroundColor: reactionResult.developedColorHex }}
              />
            </div>
            <h4 className="text-sm font-bold text-white">2D Calibrated Reaction View</h4>
            <p className="text-xs text-slate-400 max-w-sm mt-1">
              Active solution: {activeSample.name} with {dropsAdded} drops of {activeIndicator}.
            </p>
          </div>
        )}

        {/* Live HUD Reaction Overlay (Floating on Canvas) */}
        <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md border border-slate-700/80 rounded-2xl p-3 max-w-xs shadow-xl pointer-events-none space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="text-slate-400">Current Tube Sample:</span>
            <span className="text-purple-300 font-mono">{activeSample.formula}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Indicator Status:</span>
            <span className="text-white font-bold capitalize">{activeIndicator} ({dropsAdded} drops)</span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-800">
            <span className="text-slate-400">Developed Color:</span>
            <span 
              className="px-2 py-0.5 rounded-md font-bold text-[11px] shadow-xs text-slate-950 font-mono"
              style={{ backgroundColor: reactionResult.developedColorHex }}
            >
              {reactionResult.developedColorName}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Measured pH:</span>
            <span className="text-amber-400 font-mono font-black text-sm">
              {reactionResult.measuredPh.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Floating Quick Action: Dispense Drops */}
        <div className="absolute bottom-4 right-4 flex flex-col sm:flex-row items-end sm:items-center gap-2">
          <button
            onClick={triggerDropAnimation}
            disabled={isDroppingAnimation}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-900/40 transition-all flex items-center gap-2 active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Droplet className={`w-4 h-4 ${isDroppingAnimation ? 'animate-bounce text-amber-300' : ''}`} />
            <span>Add Drop from Pipette ({dropsAdded})</span>
          </button>

          <button
            onClick={onResetTube}
            className="px-3.5 py-2.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Empty &amp; Clean Tube</span>
          </button>
        </div>
      </div>

      {/* Bench Controls Sub-Panel */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-3">
        {/* Sample Selection Buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-slate-400">Select Test Solution:</span>
          {['sample_hcl', 'sample_naoh', 'sample_acetic', 'sample_lemon', 'sample_water'].map((sId) => {
            const isSel = activeSample.id === sId;
            const label = sId === 'sample_hcl' ? '0.1M Dilute HCl' :
                          sId === 'sample_naoh' ? '0.1M Dilute NaOH' :
                          sId === 'sample_acetic' ? 'Acetic Acid' :
                          sId === 'sample_lemon' ? 'Lemon Juice' : 'Distilled Water';
            return (
              <button
                key={sId}
                onClick={() => onSelectSample(sId)}
                className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer ${
                  isSel
                    ? 'bg-purple-500 text-white font-bold shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Indicator Selection Buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-slate-400">Select Indicator:</span>
          {[
            { id: 'none', label: 'None (Natural)' },
            { id: 'phenolphthalein', label: 'Phenolphthalein' },
            { id: 'methyl_orange', label: 'Methyl Orange' },
            { id: 'universal', label: 'Universal Indicator' }
          ].map((ind) => {
            const isSel = activeIndicator === ind.id;
            return (
              <button
                key={ind.id}
                onClick={() => onSelectIndicator(ind.id as IndicatorType)}
                className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer ${
                  isSel
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {ind.label}
              </button>
            );
          })}
        </div>

        {/* Scientific Rationale Feedback Bar */}
        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
          <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <span className="leading-relaxed">
            <strong className="text-white">Scientific Mechanism: </strong>
            {reactionResult.scientificExplanation}
          </span>
        </div>
      </div>
    </div>
  );
};
