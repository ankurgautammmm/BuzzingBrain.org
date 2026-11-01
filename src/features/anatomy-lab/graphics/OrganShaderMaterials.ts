import * as THREE from 'three';
import { AnatomicalStructure, GraphicsRenderMode } from '../types/anatomy';

// Procedural biological tissue micro-striation bump texture
let cachedBumpTexture: THREE.CanvasTexture | null = null;

export function getOrCreateTissueBumpTexture(): THREE.CanvasTexture | null {
  if (cachedBumpTexture) return cachedBumpTexture;
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Neutral grey baseline (128, 128, 128)
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 512, 512);

  // Draw organic muscular striated fiber lines
  ctx.strokeStyle = '#999999';
  ctx.lineWidth = 1.2;
  for (let y = 0; y < 512; y += 4) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x < 512; x += 16) {
      const wobble = Math.sin(x * 0.05 + y * 0.02) * 2.5 + (Math.random() - 0.5) * 1.5;
      ctx.lineTo(x, y + wobble);
    }
    ctx.stroke();
  }

  // Draw delicate capillary micro-vascular branching
  ctx.strokeStyle = '#666666';
  ctx.lineWidth = 0.8;
  for (let i = 0; i < 35; i++) {
    const startX = Math.random() * 512;
    const startY = Math.random() * 512;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    let cx = startX;
    let cy = startY;
    for (let seg = 0; seg < 5; seg++) {
      cx += (Math.random() - 0.5) * 40;
      cy += (Math.random() - 0.5) * 40;
      ctx.lineTo(cx, cy);
    }
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  cachedBumpTexture = texture;
  return texture;
}

// Thermal Perfusion palette based on physiological vascular activity
function getThermalColor(struct?: AnatomicalStructure | null): THREE.Color {
  if (!struct) return new THREE.Color('#3b82f6');
  const name = (struct.name + ' ' + struct.latinName).toLowerCase();
  
  if (name.includes('aorta') || name.includes('left ventricle') || name.includes('renal artery')) {
    // Hyper-perfused high pressure arterial core (37.4°C - Bright Red / Orange)
    return new THREE.Color('#ef4444');
  }
  if (name.includes('right ventricle') || name.includes('cortex') || name.includes('myocardium')) {
    // Moderate perfusion (37.0°C - Golden Amber)
    return new THREE.Color('#f59e0b');
  }
  if (name.includes('atrium') || name.includes('medulla') || name.includes('pyramid')) {
    // Intermediate venous perfusion (36.8°C - Emerald / Teal)
    return new THREE.Color('#10b981');
  }
  if (name.includes('vena cava') || name.includes('pulmonary') || name.includes('capsule')) {
    // Lower relative thermal signature (36.4°C - Cool Cyan / Cobalt)
    return new THREE.Color('#06b6d4');
  }
  return new THREE.Color('#6366f1');
}

// Vascular Angiogram palette (High-contrast arterial red vs venous cyan)
function getVascularAngioColor(struct?: AnatomicalStructure | null): { color: THREE.Color; emissive: THREE.Color } {
  if (!struct) {
    return { color: new THREE.Color('#0f172a'), emissive: new THREE.Color('#000000') };
  }
  const name = (struct.name + ' ' + struct.latinName).toLowerCase();

  // Arterial Oxygenated System
  if (name.includes('aorta') || name.includes('left') || name.includes('artery') || name.includes('aortic')) {
    return {
      color: new THREE.Color('#dc2626'),
      emissive: new THREE.Color('#ff0033')
    };
  }
  // Venous Deoxygenated System
  if (name.includes('vena cava') || name.includes('right') || name.includes('vein') || name.includes('pulmonary')) {
    return {
      color: new THREE.Color('#0284c7'),
      emissive: new THREE.Color('#00bfff')
    };
  }
  // Valves & Septum
  if (name.includes('valve') || name.includes('septum') || name.includes('papillary')) {
    return {
      color: new THREE.Color('#e2e8f0'),
      emissive: new THREE.Color('#38bdf8')
    };
  }
  return {
    color: new THREE.Color('#334155'),
    emissive: new THREE.Color('#1e293b')
  };
}

export interface MaterialOptions {
  struct?: AnatomicalStructure | null;
  renderMode: GraphicsRenderMode;
  isSelected: boolean;
  isHovered: boolean;
  isIsolated: boolean;
  tissueGloss: number;
  clippingPlanes?: THREE.Plane[];
}

export function createAnatomicalMaterial(opts: MaterialOptions): THREE.Material {
  const {
    struct,
    renderMode,
    isSelected,
    isHovered,
    isIsolated,
    tissueGloss,
    clippingPlanes = []
  } = opts;

  const baseColor = struct ? struct.defaultColor : '#b91c1c';
  const bumpMap = getOrCreateTissueBumpTexture();

  // 1. X-Ray Radiograph / CT Fluoroscopy Mode
  if (renderMode === 'xray_scan') {
    const mat = new THREE.MeshPhysicalMaterial({
      color: isSelected ? new THREE.Color('#38bdf8') : new THREE.Color('#0f2b48'),
      emissive: isSelected ? new THREE.Color('#00f0ff') : isHovered ? new THREE.Color('#38bdf8') : new THREE.Color('#0284c7'),
      emissiveIntensity: isSelected ? 0.8 : isHovered ? 0.5 : 0.25,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: isIsolated && !isSelected ? 0.08 : isSelected ? 0.85 : 0.45,
      side: THREE.DoubleSide,
      clippingPlanes,
      clipShadows: true
    });
    return mat;
  }

  // 2. Thermal Perfusion Heatmap Mode
  if (renderMode === 'thermal_perfusion') {
    const thermalCol = getThermalColor(struct);
    const mat = new THREE.MeshStandardMaterial({
      color: thermalCol,
      emissive: isSelected ? new THREE.Color('#ffffff') : isHovered ? new THREE.Color('#fef08a') : thermalCol,
      emissiveIntensity: isSelected ? 0.5 : isHovered ? 0.35 : 0.12,
      roughness: 0.4,
      metalness: 0.05,
      transparent: isIsolated && !isSelected,
      opacity: isIsolated && !isSelected ? 0.12 : 1.0,
      side: THREE.DoubleSide,
      clippingPlanes,
      clipShadows: true
    });
    return mat;
  }

  // 3. Vascular Angiogram Mode
  if (renderMode === 'vascular_map') {
    const { color: vColor, emissive: vEmissive } = getVascularAngioColor(struct);
    const isVascularCore = struct && (struct.name.includes('Aorta') || struct.name.includes('Ventricle') || struct.name.includes('Artery') || struct.name.includes('Vena'));
    
    const mat = new THREE.MeshPhysicalMaterial({
      color: vColor,
      emissive: isSelected ? new THREE.Color('#ffffff') : isHovered ? new THREE.Color('#facc15') : vEmissive,
      emissiveIntensity: isSelected ? 0.7 : isHovered ? 0.5 : (isVascularCore ? 0.35 : 0.1),
      roughness: 0.25,
      metalness: 0.1,
      clearcoat: 0.4,
      transparent: isIsolated ? !isSelected : !isVascularCore,
      opacity: isIsolated && !isSelected ? 0.08 : isVascularCore ? 0.95 : 0.4,
      side: THREE.DoubleSide,
      clippingPlanes,
      clipShadows: true
    });
    return mat;
  }

  // 4. Wireframe / Hologram Blueprint Mode
  if (renderMode === 'wireframe_grid') {
    const mat = new THREE.MeshStandardMaterial({
      color: isSelected ? new THREE.Color('#00ffff') : new THREE.Color('#0284c7'),
      wireframe: true,
      emissive: isSelected ? new THREE.Color('#00ffff') : isHovered ? new THREE.Color('#38bdf8') : new THREE.Color('#0369a1'),
      emissiveIntensity: isSelected ? 0.9 : isHovered ? 0.5 : 0.3,
      transparent: true,
      opacity: isIsolated && !isSelected ? 0.08 : isSelected ? 1.0 : 0.7,
      clippingPlanes,
      clipShadows: true
    });
    return mat;
  }

  // 5. Default PBR Natural Biological Tissue with Wet Clearcoat and Micro-Bump
  const mat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(baseColor),
    bumpMap: bumpMap || undefined,
    bumpScale: 0.015,
    roughness: Math.max(0.15, 0.45 - tissueGloss * 0.25),
    metalness: 0.06,
    clearcoat: Math.min(1.0, 0.25 + tissueGloss * 0.5),
    clearcoatRoughness: 0.12,
    reflectivity: 0.6,
    side: THREE.DoubleSide,
    clippingPlanes,
    clipShadows: true
  });

  if (isIsolated) {
    if (isSelected) {
      mat.opacity = 1.0;
      mat.transparent = false;
      mat.emissive = new THREE.Color('#38bdf8');
      mat.emissiveIntensity = 0.45;
    } else {
      mat.opacity = 0.12;
      mat.transparent = true;
      mat.roughness = 0.1;
      mat.color = new THREE.Color('#334155');
    }
  } else {
    if (isSelected) {
      mat.emissive = new THREE.Color('#38bdf8');
      mat.emissiveIntensity = 0.5;
    } else if (isHovered) {
      mat.emissive = new THREE.Color('#fbbf24');
      mat.emissiveIntensity = 0.35;
    } else {
      mat.emissive = new THREE.Color('#000000');
      mat.emissiveIntensity = 0;
    }
  }

  return mat;
}
