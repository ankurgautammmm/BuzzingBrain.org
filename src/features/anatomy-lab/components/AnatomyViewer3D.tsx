import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';
import { 
  OrganModelSpec, 
  AnatomicalStructure, 
  CameraPreset,
  GraphicsSettings,
  GraphicsRenderMode,
  LightingPreset,
  SliceAxis 
} from '../types/anatomy';
import { createAnatomicalMaterial } from '../graphics/OrganShaderMaterials';
import { BloodFlowParticles } from '../graphics/BloodFlowParticles';
import { CardiacConductionGraphic } from '../graphics/CardiacConductionGraphic';
import { MedicalPedestal } from '../graphics/MedicalPedestal';
import { MedicalOrientationGizmo } from '../graphics/MedicalOrientationGizmo';
import { EcGMonitorHud } from '../graphics/EcGMonitorHud';
import { OrganParenchymaProps } from '../graphics/OrganParenchymaProps';
import { 
  Maximize2, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Layers, 
  Activity, 
  Camera, 
  Sliders, 
  Play, 
  Pause,
  Sparkles,
  Info,
  Droplets,
  Zap,
  Scissors,
  Flame,
  Sun,
  Grid,
  ChevronDown,
  Palette
} from 'lucide-react';

interface AnatomyViewer3DProps {
  organ: OrganModelSpec;
  selectedStructure: AnatomicalStructure | null;
  hoveredStructure: AnatomicalStructure | null;
  onSelectStructure: (structure: AnatomicalStructure | null) => void;
  onHoverStructure: (structure: AnatomicalStructure | null) => void;
  hiddenMeshNames: Set<string>;
  isIsolated: boolean;
  explodedPercent: number; // 0 to 1
  isBeating?: boolean;
  heartRate?: number;
  showLabels?: boolean;
  activePresetId?: string;
  onResetView?: () => void;
  graphicsSettings?: Partial<GraphicsSettings>;
  onUpdateGraphicsSettings?: (newSettings: Partial<GraphicsSettings>) => void;
}

const DEFAULT_GRAPHICS: GraphicsSettings = {
  renderMode: 'pbr_tissue',
  lightingPreset: 'surgical',
  showBloodFlow: true,
  bloodFlowSpeed: 1.0,
  showConductionSystem: true,
  showPedestal: true,
  showEcGHud: true,
  sliceAxis: 'none',
  sliceOffset: 0,
  showMeasurements: false,
  tissueGloss: 0.65,
  pulseIntensity: 1.0,
  showOrganBody: true,
  organBodyMode: 'solid',
};

// ============================================================================
// CAMERA RIG WITH SMOOTH LERP TRANSITIONS
// ============================================================================
const CameraRig: React.FC<{
  targetPosition: [number, number, number] | null;
  targetLookAt: [number, number, number] | null;
  controlsRef: React.RefObject<any>;
}> = ({ targetPosition, targetLookAt, controlsRef }) => {
  const { camera } = useThree();
  const desiredPos = useRef<THREE.Vector3 | null>(null);
  const desiredTarget = useRef<THREE.Vector3 | null>(null);

  useEffect(() => {
    if (targetPosition) {
      desiredPos.current = new THREE.Vector3(...targetPosition);
    }
    if (targetLookAt) {
      desiredTarget.current = new THREE.Vector3(...targetLookAt);
    }
  }, [targetPosition, targetLookAt]);

  useFrame((_, delta) => {
    if (desiredPos.current) {
      camera.position.lerp(desiredPos.current, Math.min(1, delta * 3.5));
      if (camera.position.distanceTo(desiredPos.current) < 0.005) {
        desiredPos.current = null;
      }
    }
    if (desiredTarget.current && controlsRef.current) {
      controlsRef.current.target.lerp(desiredTarget.current, Math.min(1, delta * 3.5));
      controlsRef.current.update();
      if (controlsRef.current.target.distanceTo(desiredTarget.current) < 0.005) {
        desiredTarget.current = null;
      }
    }
  });

  return null;
};

// ============================================================================
// VISUAL SLICE PLANE INDICATOR
// ============================================================================
const SlicePlaneVisualizer: React.FC<{
  sliceAxis: SliceAxis;
  sliceOffset: number;
}> = ({ sliceAxis, sliceOffset }) => {
  if (sliceAxis === 'none') return null;

  const pos: [number, number, number] = [
    sliceAxis === 'sagittal' ? sliceOffset * 0.4 : 0,
    sliceAxis === 'axial' ? sliceOffset * 0.4 : 0,
    sliceAxis === 'coronal' ? sliceOffset * 0.4 : 0,
  ];

  const rot: [number, number, number] = [
    sliceAxis === 'axial' ? Math.PI / 2 : 0,
    sliceAxis === 'sagittal' ? Math.PI / 2 : 0,
    0,
  ];

  return (
    <group position={pos} rotation={rot}>
      {/* Translucent cutting plane sheet */}
      <mesh>
        <planeGeometry args={[1.2, 1.2]} />
        <meshBasicMaterial 
          color="#00f0ff" 
          transparent 
          opacity={0.12} 
          side={THREE.DoubleSide} 
          depthWrite={false}
        />
      </mesh>
      {/* Glowing boundary line */}
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(1.2, 1.2)]} />
        <lineBasicMaterial color="#38bdf8" transparent opacity={0.6} />
      </lineSegments>
    </group>
  );
};

// ============================================================================
// GLB MODEL INNER MESH RENDERER WITH ADVANCED GRAPHICS MATERIALS
// ============================================================================
const GlbOrganScene: React.FC<{
  organ: OrganModelSpec;
  selectedStructure: AnatomicalStructure | null;
  hoveredStructure: AnatomicalStructure | null;
  onSelectStructure: (structure: AnatomicalStructure | null) => void;
  onHoverStructure: (structure: AnatomicalStructure | null) => void;
  hiddenMeshNames: Set<string>;
  isIsolated: boolean;
  explodedPercent: number;
  isBeating?: boolean;
  heartRate?: number;
  showLabels?: boolean;
  graphics: GraphicsSettings;
  clippingPlanes: THREE.Plane[];
}> = ({
  organ,
  selectedStructure,
  hoveredStructure,
  onSelectStructure,
  onHoverStructure,
  hiddenMeshNames,
  isIsolated,
  explodedPercent,
  isBeating = false,
  heartRate = 72,
  showLabels = true,
  graphics,
  clippingPlanes
}) => {
  const gltf = useGLTF(organ.modelUrl);
  const groupRef = useRef<THREE.Group>(null);

  // Fast structure lookup maps by mesh name
  const meshToStructureMap = useMemo(() => {
    const map = new Map<string, AnatomicalStructure>();
    organ.structures.forEach(struct => {
      struct.meshNames.forEach(mName => {
        map.set(mName, struct);
      });
    });
    return map;
  }, [organ]);

  // Clone scene so materials can be uniquely manipulated per structure
  const clonedScene = useMemo(() => {
    const clone = gltf.scene.clone(true);
    return clone;
  }, [gltf.scene]);

  // Heartbeat physiological contraction loop
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    if (isBeating && organ.id === 'organ-heart') {
      const bps = (heartRate / 60) * Math.PI * 2;
      const t = clock.getElapsedTime() * bps;
      // Ventricular systole contraction pulse scaled by pulseIntensity
      const pIntensity = graphics.pulseIntensity;
      const pulse = (Math.sin(t) * 0.026 + Math.sin(t * 2) * 0.012) * pIntensity;
      groupRef.current.scale.set(1 + pulse * 0.5, 1 - pulse * 0.8, 1 + pulse * 0.5);
    } else {
      groupRef.current.scale.set(1, 1, 1);
    }
  });

  // Apply procedural advanced shader materials, clipping planes, and exploded offsets
  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const struct = meshToStructureMap.get(mesh.name);

        // Visibility
        if (hiddenMeshNames.has(mesh.name) || (struct && hiddenMeshNames.has(struct.id))) {
          mesh.visible = false;
          return;
        }
        mesh.visible = true;

        const isSelected = selectedStructure && struct && (selectedStructure.id === struct.id || selectedStructure.meshNames.includes(mesh.name));
        const isHovered = hoveredStructure && struct && (hoveredStructure.id === struct.id || hoveredStructure.meshNames.includes(mesh.name));

        // Create advanced shader material based on active graphics mode
        const mat = createAnatomicalMaterial({
          struct,
          renderMode: graphics.renderMode,
          isSelected: !!isSelected,
          isHovered: !!isHovered,
          isIsolated,
          tissueGloss: graphics.tissueGloss,
          clippingPlanes
        });

        mesh.material = mat;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // Apply Exploded View Offset
        if (struct && struct.explodedOffset) {
          const [ox, oy, oz] = struct.explodedOffset;
          mesh.position.set(ox * explodedPercent, oy * explodedPercent, oz * explodedPercent);
        } else {
          mesh.position.set(0, 0, 0);
        }
      }
    });
  }, [clonedScene, selectedStructure, hoveredStructure, hiddenMeshNames, isIsolated, explodedPercent, meshToStructureMap, graphics, clippingPlanes]);

  return (
    <group ref={groupRef}>
      <primitive 
        object={clonedScene}
        onPointerOver={(e: any) => {
          e.stopPropagation();
          const targetMesh = e.object as THREE.Mesh;
          const struct = meshToStructureMap.get(targetMesh.name);
          if (struct) {
            onHoverStructure(struct);
          }
        }}
        onPointerOut={() => {
          onHoverStructure(null);
        }}
        onClick={(e: any) => {
          e.stopPropagation();
          const targetMesh = e.object as THREE.Mesh;
          const struct = meshToStructureMap.get(targetMesh.name);
          if (struct) {
            onSelectStructure(struct);
          }
        }}
      />

      {/* 3D Anatomical Organ Parenchymal Muscular Walls & Tissue Props */}
      {graphics.showOrganBody !== false && (
        <OrganParenchymaProps
          organId={organ.id}
          renderMode={graphics.renderMode}
          tissueOpacity={
            graphics.organBodyMode === 'translucent'
              ? 0.35
              : graphics.organBodyMode === 'cutaway'
              ? 0.88
              : 0.95
          }
          showCrossSection={graphics.organBodyMode === 'cutaway'}
          selectedStructure={selectedStructure}
          hoveredStructure={hoveredStructure}
          onSelectStructure={onSelectStructure}
          clippingPlanes={clippingPlanes}
        />
      )}

      {/* 3D Physiological Blood Flow Particles */}
      <BloodFlowParticles 
        organId={organ.id} 
        active={graphics.showBloodFlow} 
        speed={graphics.bloodFlowSpeed} 
      />

      {/* 3D Cardiac Electrical Conduction Wireframe */}
      {organ.id === 'organ-heart' && (
        <CardiacConductionGraphic 
          active={graphics.showConductionSystem} 
          heartRate={heartRate} 
        />
      )}

      {/* Visual Slice Cutting Plane Guide */}
      <SlicePlaneVisualizer 
        sliceAxis={graphics.sliceAxis} 
        sliceOffset={graphics.sliceOffset} 
      />

      {/* 3D Anatomical Label Callout Pins */}
      {showLabels && !isIsolated && organ.structures.map((struct) => {
        if (!struct.pinPosition) return null;
        if (hiddenMeshNames.has(struct.id)) return null;

        const isSelected = selectedStructure?.id === struct.id;
        const [px, py, pz] = struct.pinPosition;
        const [ox, oy, oz] = struct.explodedOffset || [0, 0, 0];
        const posX = px + ox * explodedPercent;
        const posY = py + oy * explodedPercent;
        const posZ = pz + oz * explodedPercent;

        return (
          <group key={struct.id} position={[posX, posY, posZ]}>
            <Html center distanceFactor={1.2} zIndexRange={[100, 0]}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectStructure(struct);
                }}
                className={`group px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all shadow-lg flex items-center gap-1.5 cursor-pointer backdrop-blur-md select-none ${
                  isSelected
                    ? 'bg-sky-500 text-slate-950 ring-2 ring-white scale-110 shadow-sky-500/50'
                    : 'bg-slate-900/85 hover:bg-slate-800 text-slate-200 border border-white/20 hover:scale-105'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: struct.defaultColor }} />
                <span>{struct.name}</span>
              </button>
            </Html>
          </group>
        );
      })}
    </group>
  );
};

// ============================================================================
// PROCEDURAL 3D BRAIN SCENE
// ============================================================================
const ProceduralBrainScene: React.FC<{
  organ: OrganModelSpec;
  selectedStructure: AnatomicalStructure | null;
  hoveredStructure: AnatomicalStructure | null;
  onSelectStructure: (s: AnatomicalStructure | null) => void;
  onHoverStructure: (s: AnatomicalStructure | null) => void;
  isIsolated: boolean;
  explodedPercent: number;
  showLabels?: boolean;
  graphics: GraphicsSettings;
  clippingPlanes: THREE.Plane[];
}> = ({
  organ,
  selectedStructure,
  hoveredStructure,
  onSelectStructure,
  onHoverStructure,
  isIsolated,
  explodedPercent,
  showLabels = true,
  graphics,
  clippingPlanes
}) => {
  const frontalStruct = organ.structures.find(s => s.id === 'brain-frontal-lobe');
  const cerebellumStruct = organ.structures.find(s => s.id === 'brain-cerebellum');
  const medullaStruct = organ.structures.find(s => s.id === 'brain-medulla');

  const frontalMat = useMemo(() => createAnatomicalMaterial({
    struct: frontalStruct,
    renderMode: graphics.renderMode,
    isSelected: selectedStructure?.id === 'brain-frontal-lobe',
    isHovered: hoveredStructure?.id === 'brain-frontal-lobe',
    isIsolated,
    tissueGloss: graphics.tissueGloss,
    clippingPlanes
  }), [frontalStruct, graphics, selectedStructure, hoveredStructure, isIsolated, clippingPlanes]);

  const cerebellumMat = useMemo(() => createAnatomicalMaterial({
    struct: cerebellumStruct,
    renderMode: graphics.renderMode,
    isSelected: selectedStructure?.id === 'brain-cerebellum',
    isHovered: hoveredStructure?.id === 'brain-cerebellum',
    isIsolated,
    tissueGloss: graphics.tissueGloss,
    clippingPlanes
  }), [cerebellumStruct, graphics, selectedStructure, hoveredStructure, isIsolated, clippingPlanes]);

  const medullaMat = useMemo(() => createAnatomicalMaterial({
    struct: medullaStruct,
    renderMode: graphics.renderMode,
    isSelected: selectedStructure?.id === 'brain-medulla',
    isHovered: hoveredStructure?.id === 'brain-medulla',
    isIsolated,
    tissueGloss: graphics.tissueGloss,
    clippingPlanes
  }), [medullaStruct, graphics, selectedStructure, hoveredStructure, isIsolated, clippingPlanes]);

  return (
    <group position={[0, 0, 0]}>
      {/* Frontal & Cerebral Cortex (Left and Right Hemispheres) */}
      <group 
        position={[0, 0.2 + explodedPercent * 0.4, 0.2 + explodedPercent * 0.3]}
        onClick={(e) => { e.stopPropagation(); if (frontalStruct) onSelectStructure(frontalStruct); }}
        onPointerOver={(e) => { e.stopPropagation(); if (frontalStruct) onHoverStructure(frontalStruct); }}
        onPointerOut={() => onHoverStructure(null)}
      >
        <mesh position={[-0.42, 0, 0]} castShadow receiveShadow material={frontalMat}>
          <sphereGeometry args={[0.72, 32, 24]} />
        </mesh>
        <mesh position={[0.42, 0, 0]} castShadow receiveShadow material={frontalMat}>
          <sphereGeometry args={[0.72, 32, 24]} />
        </mesh>
      </group>

      {/* Cerebellum (Posteroinferior Folia) */}
      <group
        position={[0, -0.45 - explodedPercent * 0.3, -0.65 - explodedPercent * 0.4]}
        onClick={(e) => { e.stopPropagation(); if (cerebellumStruct) onSelectStructure(cerebellumStruct); }}
        onPointerOver={(e) => { e.stopPropagation(); if (cerebellumStruct) onHoverStructure(cerebellumStruct); }}
        onPointerOut={() => onHoverStructure(null)}
      >
        <mesh position={[-0.32, 0, 0]} scale={[1, 0.7, 0.8]} castShadow receiveShadow material={cerebellumMat}>
          <sphereGeometry args={[0.42, 24, 20]} />
        </mesh>
        <mesh position={[0.32, 0, 0]} scale={[1, 0.7, 0.8]} castShadow receiveShadow material={cerebellumMat}>
          <sphereGeometry args={[0.42, 24, 20]} />
        </mesh>
      </group>

      {/* Medulla Oblongata & Brainstem */}
      <group
        position={[0, -0.85 - explodedPercent * 0.4, -0.1]}
        onClick={(e) => { e.stopPropagation(); if (medullaStruct) onSelectStructure(medullaStruct); }}
        onPointerOver={(e) => { e.stopPropagation(); if (medullaStruct) onHoverStructure(medullaStruct); }}
        onPointerOut={() => onHoverStructure(null)}
      >
        <mesh castShadow receiveShadow material={medullaMat}>
          <cylinderGeometry args={[0.18, 0.14, 0.85, 24]} />
        </mesh>
      </group>

      {/* Visual Slice Cutting Plane Guide */}
      <SlicePlaneVisualizer 
        sliceAxis={graphics.sliceAxis} 
        sliceOffset={graphics.sliceOffset} 
      />

      {/* Procedural Labels */}
      {showLabels && !isIsolated && organ.structures.map(struct => {
        if (!struct.pinPosition) return null;
        const [px, py, pz] = struct.pinPosition;
        return (
          <group key={struct.id} position={[px, py, pz]}>
            <Html center distanceFactor={8} zIndexRange={[100, 0]}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectStructure(struct);
                }}
                className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/90 text-white border border-white/20 shadow-md cursor-pointer hover:bg-slate-800"
              >
                {struct.name}
              </button>
            </Html>
          </group>
        );
      })}
    </group>
  );
};

// ============================================================================
// MAIN EXPORTED 3D ANATOMY VIEWER WITH FULL GRAPHICS SUITE
// ============================================================================
export const AnatomyViewer3D: React.FC<AnatomyViewer3DProps> = ({
  organ,
  selectedStructure,
  hoveredStructure,
  onSelectStructure,
  onHoverStructure,
  hiddenMeshNames,
  isIsolated,
  explodedPercent,
  isBeating = false,
  heartRate = 72,
  showLabels = true,
  activePresetId = 'anterior',
  onResetView,
  graphicsSettings = {},
  onUpdateGraphicsSettings
}) => {
  const controlsRef = useRef<any>(null);
  const [internalGraphics, setInternalGraphics] = useState<GraphicsSettings>({
    ...DEFAULT_GRAPHICS,
    ...graphicsSettings
  });

  // Keep internal graphics in sync with parent prop if provided
  useEffect(() => {
    if (graphicsSettings) {
      setInternalGraphics(prev => ({ ...prev, ...graphicsSettings }));
    }
  }, [graphicsSettings]);

  const updateGraphics = (changes: Partial<GraphicsSettings>) => {
    setInternalGraphics(prev => ({ ...prev, ...changes }));
    if (onUpdateGraphicsSettings) {
      onUpdateGraphicsSettings(changes);
    }
  };

  const [activePreset, setActivePreset] = useState<CameraPreset | null>(
    organ.cameraPresets[activePresetId] || organ.cameraPresets.anterior || null
  );

  const [showGraphicsToolbar, setShowGraphicsToolbar] = useState<boolean>(false);

  const handleApplyPreset = (presetKey: string) => {
    const p = organ.cameraPresets[presetKey];
    if (p) {
      setActivePreset(p);
    }
  };

  const handleReset = () => {
    const p = organ.cameraPresets.anterior || Object.values(organ.cameraPresets)[0];
    if (p) {
      setActivePreset(p);
    }
    if (onResetView) {
      onResetView();
    }
  };

  // Three.js clipping planes calculated from sliceAxis and sliceOffset
  const clippingPlanes = useMemo(() => {
    if (internalGraphics.sliceAxis === 'none') return [];
    if (internalGraphics.sliceAxis === 'coronal') {
      return [new THREE.Plane(new THREE.Vector3(0, 0, -1), internalGraphics.sliceOffset * 0.4)];
    }
    if (internalGraphics.sliceAxis === 'sagittal') {
      return [new THREE.Plane(new THREE.Vector3(-1, 0, 0), internalGraphics.sliceOffset * 0.4)];
    }
    if (internalGraphics.sliceAxis === 'axial') {
      return [new THREE.Plane(new THREE.Vector3(0, -1, 0), internalGraphics.sliceOffset * 0.4)];
    }
    return [];
  }, [internalGraphics.sliceAxis, internalGraphics.sliceOffset]);

  // Lighting configurations
  const lightingRig = useMemo(() => {
    const preset = internalGraphics.lightingPreset;
    if (preset === 'clinical_blue') {
      return {
        ambientColor: '#bfdbfe',
        ambientIntensity: 0.75,
        keyColor: '#e0f2fe',
        keyIntensity: 1.9,
        fillColor: '#38bdf8',
        fillIntensity: 1.1,
        rimColor: '#0284c7',
        rimIntensity: 1.3
      };
    }
    if (preset === 'cyber_neon') {
      return {
        ambientColor: '#38bdf8',
        ambientIntensity: 0.4,
        keyColor: '#f43f5e',
        keyIntensity: 1.9,
        fillColor: '#00f0ff',
        fillIntensity: 1.5,
        rimColor: '#a855f7',
        rimIntensity: 1.8
      };
    }
    if (preset === 'warm_diagnostic') {
      return {
        ambientColor: '#fef3c7',
        ambientIntensity: 0.9,
        keyColor: '#fffbeb',
        keyIntensity: 1.8,
        fillColor: '#fed7aa',
        fillIntensity: 0.9,
        rimColor: '#fbbf24',
        rimIntensity: 0.8
      };
    }
    // Default 'surgical'
    return {
      ambientColor: '#ffffff',
      ambientIntensity: 0.9,
      keyColor: '#ffffff',
      keyIntensity: 2.0,
      fillColor: '#93c5fd',
      fillIntensity: 0.8,
      rimColor: '#cbd5e1',
      rimIntensity: 0.6
    };
  }, [internalGraphics.lightingPreset]);

  return (
    <div className="relative w-full h-[580px] sm:h-[640px] rounded-3xl bg-gradient-to-b from-slate-950 via-[#070b1a] to-[#020617] border border-slate-800 shadow-2xl overflow-hidden select-none">
      {/* 3D WebGL Canvas */}
      <Canvas
        camera={{
          position: organ.initialCameraPosition,
          fov: 45,
          near: 0.01,
          far: 50
        }}
        onCreated={({ gl }) => {
          gl.localClippingEnabled = true;
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          localClippingEnabled: true
        }}
        shadows
      >
        {/* Illumination Rig: Clinical Surgical Key, Fill, and Rim Lights */}
        <ambientLight 
          color={lightingRig.ambientColor} 
          intensity={lightingRig.ambientIntensity} 
        />
        <directionalLight 
          position={[4, 8, 6]} 
          intensity={lightingRig.keyIntensity} 
          color={lightingRig.keyColor}
          castShadow 
          shadow-mapSize={[2048, 2048]} 
        />
        <directionalLight 
          position={[-4, -2, -4]} 
          intensity={lightingRig.fillIntensity} 
          color={lightingRig.fillColor} 
        />
        <directionalLight 
          position={[0, -6, 2]} 
          intensity={lightingRig.rimIntensity} 
          color={lightingRig.rimColor} 
        />
        <pointLight position={[0, 2, 3]} intensity={1.2} distance={8} color="#ffffff" />

        {/* Camera Rig Lerp Driver */}
        <CameraRig 
          targetPosition={activePreset?.position || null}
          targetLookAt={activePreset?.target || null}
          controlsRef={controlsRef}
        />

        {/* Orbit Controls with Damping and Restraints */}
        <OrbitControls 
          ref={controlsRef}
          enableDamping 
          dampingFactor={0.05} 
          minDistance={0.08} 
          maxDistance={12} 
          target={new THREE.Vector3(...organ.initialTarget)}
        />

        {/* Holographic Medical Scanner Pedestal */}
        {internalGraphics.showPedestal && (
          <MedicalPedestal 
            position={[0, -0.68, 0]} 
            radius={0.85} 
            color={internalGraphics.renderMode === 'xray_scan' ? '#00f0ff' : internalGraphics.lightingPreset === 'cyber_neon' ? '#f43f5e' : '#0284c7'} 
          />
        )}

        {/* Organ Model Loader */}
        <React.Suspense fallback={
          <Html center>
            <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-900/90 border border-purple-500/30 text-white backdrop-blur-md">
              <Activity className="w-5 h-5 text-purple-400 animate-spin" />
              <span className="text-xs font-semibold">Loading 3D Anatomical Meshes...</span>
            </div>
          </Html>
        }>
          <Center top={false}>
            {organ.modelFormat === 'glb' ? (
              <GlbOrganScene 
                organ={organ}
                selectedStructure={selectedStructure}
                hoveredStructure={hoveredStructure}
                onSelectStructure={onSelectStructure}
                onHoverStructure={onHoverStructure}
                hiddenMeshNames={hiddenMeshNames}
                isIsolated={isIsolated}
                explodedPercent={explodedPercent}
                isBeating={isBeating}
                heartRate={heartRate}
                showLabels={showLabels}
                graphics={internalGraphics}
                clippingPlanes={clippingPlanes}
              />
            ) : (
              <ProceduralBrainScene 
                organ={organ}
                selectedStructure={selectedStructure}
                hoveredStructure={hoveredStructure}
                onSelectStructure={onSelectStructure}
                onHoverStructure={onHoverStructure}
                isIsolated={isIsolated}
                explodedPercent={explodedPercent}
                showLabels={showLabels}
                graphics={internalGraphics}
                clippingPlanes={clippingPlanes}
              />
            )}
          </Center>
        </React.Suspense>
      </Canvas>

      {/* Floating HUD: Top Left - Active Structure Indicator & Render Mode Pill */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none max-w-sm space-y-1">
        <div className="p-3 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-slate-700/80 shadow-2xl space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>3D Anatomy &bull; {organ.system}</span>
            <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono text-[9px]">
              {internalGraphics.renderMode.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <h4 className="text-sm font-black text-white">
            {selectedStructure ? selectedStructure.name : hoveredStructure ? hoveredStructure.name : organ.name}
          </h4>
          <p className="text-[11px] text-slate-300 italic font-serif">
            {selectedStructure ? selectedStructure.latinName : hoveredStructure ? hoveredStructure.latinName : 'Click any anatomical part to inspect details'}
          </p>
        </div>
      </div>

      {/* Floating HUD: Top Right - Camera Presets & Reset */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-slate-700/80 shadow-2xl">
        {Object.entries(organ.cameraPresets).map(([key, preset]) => (
          <button
            key={key}
            onClick={() => handleApplyPreset(key)}
            className="px-2.5 py-1 rounded-xl text-[11px] font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title={preset.label}
          >
            {preset.label.split(' ')[0]}
          </button>
        ))}

        <div className="w-px h-4 bg-slate-700 mx-1" />

        {/* Graphics Settings Toggle Button */}
        <button
          onClick={() => setShowGraphicsToolbar(!showGraphicsToolbar)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer ${
            showGraphicsToolbar 
              ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30' 
              : 'text-purple-300 bg-purple-500/20 hover:bg-purple-500/30'
          }`}
          title="Toggle 3D Graphics & FX Control Suite"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Graphics</span>
        </button>

        <button
          onClick={handleReset}
          className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
          title="Reset Camera & Angle"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* ADVANCED GRAPHICS & VISUAL FX TOOLBAR MODAL / DRAWER */}
      {showGraphicsToolbar && (
        <div className="absolute top-16 right-4 z-30 w-80 p-4 rounded-3xl bg-slate-950/95 backdrop-blur-xl border border-purple-500/40 shadow-2xl space-y-4 text-xs text-white">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>3D Graphics &amp; Shaders</span>
            </div>
            <button
              onClick={() => setShowGraphicsToolbar(false)}
              className="text-slate-400 hover:text-white text-xs px-2 py-0.5 rounded-lg bg-white/5 cursor-pointer"
            >
              Close
            </button>
          </div>

          {/* 1. Shading & Visualization Render Modes */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-mono text-purple-300 uppercase tracking-wider font-bold">
              Tissue Shading Mode
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'pbr_tissue', label: '🌟 PBR Tissue', desc: 'Realistic wet organ' },
                { id: 'xray_scan', label: '⚡ X-Ray Scan', desc: 'Fluoroscopy glow' },
                { id: 'thermal_perfusion', label: '🌡️ Thermal', desc: 'Blood heat map' },
                { id: 'vascular_map', label: '🩸 Angiogram', desc: 'High-contrast vessels' },
                { id: 'wireframe_grid', label: '📐 Wireframe', desc: 'Hologram blueprint' },
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => updateGraphics({ renderMode: mode.id as GraphicsRenderMode })}
                  className={`p-2 rounded-xl text-left border transition cursor-pointer ${
                    internalGraphics.renderMode === mode.id
                      ? 'bg-purple-500/25 border-purple-400 text-white shadow-md'
                      : 'bg-white/5 border-white/5 hover:border-white/15 text-slate-300'
                  }`}
                >
                  <div className="font-bold text-[11px]">{mode.label}</div>
                  <div className="text-[9px] text-slate-400">{mode.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Studio Lighting Presets */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-mono text-purple-300 uppercase tracking-wider font-bold">
              Lighting Studio Rig
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'surgical', label: 'Surgical Suite', icon: Sun },
                { id: 'clinical_blue', label: 'Clinical Blue', icon: Droplets },
                { id: 'cyber_neon', label: 'Cyber Bio-Lab', icon: Zap },
                { id: 'warm_diagnostic', label: 'Warm Light', icon: Flame },
              ].map(lt => {
                const Icon = lt.icon;
                return (
                  <button
                    key={lt.id}
                    onClick={() => updateGraphics({ lightingPreset: lt.id as LightingPreset })}
                    className={`flex items-center gap-2 p-2 rounded-xl border transition cursor-pointer ${
                      internalGraphics.lightingPreset === lt.id
                        ? 'bg-sky-500/25 border-sky-400 text-white'
                        : 'bg-white/5 border-white/5 hover:border-white/15 text-slate-300'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-sky-400" />
                    <span className="text-[10px] font-medium">{lt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Physiological FX Toggles */}
          <div className="space-y-2 border-t border-white/10 pt-3">
            <div className="text-[10px] font-mono text-purple-300 uppercase tracking-wider font-bold">
              Physiological Visual FX
            </div>

            {/* Organ Body Parenchymal Tissue Props Mode */}
            <div className="space-y-1.5 pb-2 border-b border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-200 font-semibold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-rose-400" />
                  <span>Muscular Organ Body (Tissue Props)</span>
                </span>
                <button
                  onClick={() => updateGraphics({ showOrganBody: internalGraphics.showOrganBody === false ? true : false })}
                  className={`w-10 h-5 rounded-full p-0.5 transition cursor-pointer ${
                    internalGraphics.showOrganBody !== false ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                  title="Toggle full organ body vs vessels only"
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    internalGraphics.showOrganBody !== false ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {internalGraphics.showOrganBody !== false && (
                <div className="grid grid-cols-3 gap-1 pt-1">
                  {[
                    { id: 'solid', label: 'Solid Tissue' },
                    { id: 'translucent', label: 'Translucent' },
                    { id: 'cutaway', label: 'Cutaway Cross-Section' },
                  ].map(m => (
                    <button
                      key={m.id}
                      onClick={() => updateGraphics({ organBodyMode: m.id as any })}
                      className={`px-1.5 py-1 rounded-lg text-[9px] font-bold border transition cursor-pointer text-center ${
                        (internalGraphics.organBodyMode || 'solid') === m.id
                          ? 'bg-rose-500/30 border-rose-400 text-rose-200'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-300 flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-rose-400" />
                <span>Circulatory Veins & Arteries (Blood Flow)</span>
              </span>
              <button
                onClick={() => updateGraphics({ showBloodFlow: !internalGraphics.showBloodFlow })}
                className={`w-10 h-5 rounded-full p-0.5 transition cursor-pointer ${
                  internalGraphics.showBloodFlow ? 'bg-rose-500' : 'bg-slate-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  internalGraphics.showBloodFlow ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {organ.id === 'organ-heart' && (
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Cardiac Electrical Conduction</span>
                </span>
                <button
                  onClick={() => updateGraphics({ showConductionSystem: !internalGraphics.showConductionSystem })}
                  className={`w-10 h-5 rounded-full p-0.5 transition cursor-pointer ${
                    internalGraphics.showConductionSystem ? 'bg-amber-500' : 'bg-slate-700'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    internalGraphics.showConductionSystem ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-300 flex items-center gap-1.5">
                <Grid className="w-3.5 h-3.5 text-sky-400" />
                <span>Hologram Scanner Pedestal</span>
              </span>
              <button
                onClick={() => updateGraphics({ showPedestal: !internalGraphics.showPedestal })}
                className={`w-10 h-5 rounded-full p-0.5 transition cursor-pointer ${
                  internalGraphics.showPedestal ? 'bg-sky-500' : 'bg-slate-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  internalGraphics.showPedestal ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-300 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>Live ECG Oscilloscope HUD</span>
              </span>
              <button
                onClick={() => updateGraphics({ showEcGHud: !internalGraphics.showEcGHud })}
                className={`w-10 h-5 rounded-full p-0.5 transition cursor-pointer ${
                  internalGraphics.showEcGHud ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  internalGraphics.showEcGHud ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>

          {/* 4. Interactive Anatomical Cross-Section Slicing */}
          <div className="space-y-2 border-t border-white/10 pt-3">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-mono text-purple-300 uppercase tracking-wider font-bold flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5 text-cyan-400" />
                <span>Cross-Section Slicing Plane</span>
              </div>
              <span className="text-[9px] font-mono text-cyan-400 uppercase">
                {internalGraphics.sliceAxis}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1">
              {(['none', 'coronal', 'sagittal', 'axial'] as SliceAxis[]).map(axis => (
                <button
                  key={axis}
                  onClick={() => updateGraphics({ sliceAxis: axis })}
                  className={`py-1 rounded-lg text-center font-bold text-[10px] transition capitalize cursor-pointer ${
                    internalGraphics.sliceAxis === axis
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {axis}
                </button>
              ))}
            </div>

            {internalGraphics.sliceAxis !== 'none' && (
              <div className="space-y-1 bg-white/5 p-2 rounded-xl">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Slice Position</span>
                  <span className="font-mono text-cyan-300">{internalGraphics.sliceOffset.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="-1"
                  max="1"
                  step="0.05"
                  value={internalGraphics.sliceOffset}
                  onChange={(e) => updateGraphics({ sliceOffset: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* 5. Tissue Gloss / Wetness Slider */}
          <div className="space-y-1 border-t border-white/10 pt-3">
            <div className="flex justify-between text-[10px] text-slate-300">
              <span className="flex items-center gap-1">
                <Palette className="w-3 h-3 text-purple-400" />
                <span>Tissue Wetness &amp; Specular Sheen</span>
              </span>
              <span className="font-mono text-purple-300">{Math.round(internalGraphics.tissueGloss * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={internalGraphics.tissueGloss}
              onChange={(e) => updateGraphics({ tissueGloss: parseFloat(e.target.value) })}
              className="w-full accent-purple-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Floating HUD: Bottom ECG Oscilloscope (when enabled and beating) */}
      {internalGraphics.showEcGHud && organ.id === 'organ-heart' && (
        <div className="absolute bottom-4 left-4 z-20 max-w-sm w-full hidden md:block">
          <EcGMonitorHud 
            heartRate={heartRate} 
            isBeating={isBeating} 
          />
        </div>
      )}

      {/* Floating HUD: Bottom Left Controls Hint (when ECG is hidden or on other organs) */}
      {(!internalGraphics.showEcGHud || organ.id !== 'organ-heart') && (
        <div className="absolute bottom-4 left-4 z-20 pointer-events-none hidden sm:flex items-center gap-2 text-[10px] font-mono text-slate-400 bg-slate-950/70 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-slate-800">
          <span>Orbit: Left Click + Drag</span>
          <span>&bull;</span>
          <span>Pan: Right Click + Drag</span>
          <span>&bull;</span>
          <span>Zoom: Scroll / Pinch</span>
        </div>
      )}

      {/* Floating HUD: Bottom Right 3D Medical Orientation Gizmo */}
      <div className="absolute bottom-4 right-4 z-20 hidden sm:block">
        <MedicalOrientationGizmo onSelectView={handleApplyPreset} />
      </div>
    </div>
  );
};
