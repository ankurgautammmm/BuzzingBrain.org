import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BloodFlowParticlesProps {
  organId: string;
  speed?: number; // multiplier e.g. 1.0
  active?: boolean;
}

// Catmull-Rom physiological blood circulation splines
function createHeartCurves() {
  // 1. Deoxygenated flow: Vena Cava -> Right Atrium -> Right Ventricle -> Pulmonary Trunk
  const deoxCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.18, 0.42, 0.08),  // Superior Vena Cava
    new THREE.Vector3(-0.20, 0.22, 0.05),  // Right Atrium
    new THREE.Vector3(-0.16, 0.08, 0.06),  // Tricuspid Valve
    new THREE.Vector3(-0.18, -0.15, 0.12), // Right Ventricle Chamber
    new THREE.Vector3(-0.05, 0.02, 0.15),  // Infundibulum
    new THREE.Vector3(-0.02, 0.25, 0.12),  // Pulmonary Valve
    new THREE.Vector3(0.02, 0.45, 0.05),   // Pulmonary Trunk Bifurcation
  ]);

  // 2. Oxygenated flow: Pulmonary Veins -> Left Atrium -> Left Ventricle -> Aortic Arch
  const oxCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.22, 0.28, -0.15),  // Left Pulmonary Veins
    new THREE.Vector3(0.12, 0.20, -0.08),  // Left Atrium
    new THREE.Vector3(0.08, 0.05, -0.04),  // Mitral / Bicuspid Valve
    new THREE.Vector3(0.14, -0.22, 0.02),  // Left Ventricle Apex
    new THREE.Vector3(0.04, -0.05, 0.04),  // Aortic Vestibule
    new THREE.Vector3(0.01, 0.22, 0.02),   // Aortic Valve
    new THREE.Vector3(-0.02, 0.48, -0.02), // Ascending Aorta
    new THREE.Vector3(0.08, 0.58, -0.06),  // Aortic Arch Peak
    new THREE.Vector3(0.18, 0.45, -0.12),  // Descending Aorta
  ]);

  // 3. Coronary arterial perfusion loop (branching over myocardium surface)
  const coronaryCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.02, 0.32, 0.05),   // Right Coronary Ostium
    new THREE.Vector3(-0.12, 0.12, 0.18),  // Right coronary groove
    new THREE.Vector3(-0.16, -0.08, 0.20), // Marginal branch
    new THREE.Vector3(-0.02, -0.25, 0.16), // Posterior descending towards apex
  ]);

  return { deoxCurve, oxCurve, coronaryCurve };
}

function createKidneyCurves() {
  // Renal Artery inflow (Red)
  const renalArteryCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.35, -0.02, 0.05),  // Abdominal Aorta Branch
    new THREE.Vector3(0.18, 0.02, 0.02),   // Renal Hilum
    new THREE.Vector3(0.04, 0.14, 0.03),   // Segmental / Interlobar Artery Superior
    new THREE.Vector3(-0.18, 0.25, 0.02),  // Arcuate Artery / Renal Cortex
  ]);

  // Renal Vein outflow (Blue)
  const renalVeinCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.15, -0.18, -0.02), // Interlobular Veins
    new THREE.Vector3(0.02, -0.08, 0.01),   // Arcuate Vein
    new THREE.Vector3(0.18, -0.04, 0.03),   // Renal Hilum Outflow
    new THREE.Vector3(0.36, -0.06, 0.05),   // Inferior Vena Cava
  ]);

  // Urine filtration droplets (Gold) down into ureter
  const urineCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.08, 0.12, 0.01),  // Renal Papilla
    new THREE.Vector3(0.02, 0.02, 0.01),   // Minor / Major Calyx
    new THREE.Vector3(0.10, -0.05, 0.02),  // Renal Pelvis
    new THREE.Vector3(0.14, -0.32, 0.04),  // Ureter Descending
  ]);

  return { renalArteryCurve, renalVeinCurve, urineCurve };
}

export const BloodFlowParticles: React.FC<BloodFlowParticlesProps> = ({
  organId,
  speed = 1.0,
  active = true
}) => {
  const pointsDeoxRef = useRef<THREE.Points>(null);
  const pointsOxRef = useRef<THREE.Points>(null);
  const pointsExtraRef = useRef<THREE.Points>(null);

  const numParticles = 60;

  // Pre-generate progress offsets [0..1]
  const offsets = useMemo(() => {
    return Array.from({ length: numParticles }, (_, i) => i / numParticles);
  }, [numParticles]);

  const heartCurves = useMemo(() => createHeartCurves(), []);
  const kidneyCurves = useMemo(() => createKidneyCurves(), []);

  // Geometry positions arrays
  const { posDeox, posOx, posExtra } = useMemo(() => {
    return {
      posDeox: new Float32Array(numParticles * 3),
      posOx: new Float32Array(numParticles * 3),
      posExtra: new Float32Array(numParticles * 3),
    };
  }, [numParticles]);

  // Create geometries safely with pre-attached BufferAttributes
  const deoxGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(posDeox, 3));
    return geo;
  }, [posDeox]);

  const oxGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(posOx, 3));
    return geo;
  }, [posOx]);

  const extraGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(posExtra, 3));
    return geo;
  }, [posExtra]);

  // Clean disposal on unmount
  useEffect(() => {
    return () => {
      deoxGeo.dispose();
      oxGeo.dispose();
      extraGeo.dispose();
    };
  }, [deoxGeo, oxGeo, extraGeo]);

  useFrame(({ clock }) => {
    if (!active) return;
    const time = clock.getElapsedTime() * 0.18 * speed;

    if (organId === 'organ-heart') {
      // 1. Deoxygenated Vena Cava -> RV -> Pulmonary
      const posDeoxAttr = pointsDeoxRef.current?.geometry?.attributes?.position as THREE.BufferAttribute | undefined;
      if (posDeoxAttr) {
        for (let i = 0; i < numParticles; i++) {
          const u = (offsets[i] + time * 1.2) % 1.0;
          const pt = heartCurves.deoxCurve.getPoint(u);
          const spread = Math.sin(u * Math.PI * 4 + time * 5) * 0.012;
          posDeoxAttr.setXYZ(i, pt.x + spread, pt.y, pt.z + spread);
        }
        posDeoxAttr.needsUpdate = true;
      }

      // 2. Oxygenated LV -> Aorta
      const posOxAttr = pointsOxRef.current?.geometry?.attributes?.position as THREE.BufferAttribute | undefined;
      if (posOxAttr) {
        for (let i = 0; i < numParticles; i++) {
          const u = (offsets[i] + time * 1.35) % 1.0;
          const pt = heartCurves.oxCurve.getPoint(u);
          const spread = Math.cos(u * Math.PI * 3 + time * 6) * 0.014;
          posOxAttr.setXYZ(i, pt.x, pt.y + spread, pt.z + spread);
        }
        posOxAttr.needsUpdate = true;
      }

      // 3. Coronary Artery Branching
      const posExtraAttr = pointsExtraRef.current?.geometry?.attributes?.position as THREE.BufferAttribute | undefined;
      if (posExtraAttr) {
        for (let i = 0; i < numParticles; i++) {
          const u = (offsets[i] + time * 0.9) % 1.0;
          const pt = heartCurves.coronaryCurve.getPoint(u);
          posExtraAttr.setXYZ(i, pt.x, pt.y, pt.z);
        }
        posExtraAttr.needsUpdate = true;
      }
    } else if (organId === 'organ-kidney') {
      // Renal Artery Inflow
      const posOxAttr = pointsOxRef.current?.geometry?.attributes?.position as THREE.BufferAttribute | undefined;
      if (posOxAttr) {
        for (let i = 0; i < numParticles; i++) {
          const u = (offsets[i] + time * 1.1) % 1.0;
          const pt = kidneyCurves.renalArteryCurve.getPoint(u);
          posOxAttr.setXYZ(i, pt.x, pt.y, pt.z);
        }
        posOxAttr.needsUpdate = true;
      }

      // Renal Vein Outflow
      const posDeoxAttr = pointsDeoxRef.current?.geometry?.attributes?.position as THREE.BufferAttribute | undefined;
      if (posDeoxAttr) {
        for (let i = 0; i < numParticles; i++) {
          const u = (offsets[i] + time * 1.0) % 1.0;
          const pt = kidneyCurves.renalVeinCurve.getPoint(u);
          posDeoxAttr.setXYZ(i, pt.x, pt.y, pt.z);
        }
        posDeoxAttr.needsUpdate = true;
      }

      // Urinary Collecting Duct Filtered Droplets
      const posExtraAttr = pointsExtraRef.current?.geometry?.attributes?.position as THREE.BufferAttribute | undefined;
      if (posExtraAttr) {
        for (let i = 0; i < numParticles; i++) {
          const u = (offsets[i] + time * 0.8) % 1.0;
          const pt = kidneyCurves.urineCurve.getPoint(u);
          posExtraAttr.setXYZ(i, pt.x, pt.y, pt.z);
        }
        posExtraAttr.needsUpdate = true;
      }
    }
  });

  if (!active) return null;

  return (
    <group>
      {/* Blue / Cyan Deoxygenated Particle Stream */}
      <points ref={pointsDeoxRef} geometry={deoxGeo}>
        <pointsMaterial
          size={0.038}
          color="#00e5ff"
          transparent
          opacity={0.88}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Red / Ruby Oxygenated Particle Stream */}
      <points ref={pointsOxRef} geometry={oxGeo}>
        <pointsMaterial
          size={0.042}
          color="#ff1744"
          transparent
          opacity={0.92}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Extra physiological flow (Coronary capillaries or Urine droplets) */}
      <points ref={pointsExtraRef} geometry={extraGeo}>
        <pointsMaterial
          size={0.032}
          color={organId === 'organ-kidney' ? '#fbbf24' : '#f43f5e'}
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
};
