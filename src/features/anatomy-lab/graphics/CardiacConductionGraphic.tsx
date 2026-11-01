import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CardiacConductionGraphicProps {
  active: boolean;
  heartRate?: number;
}

export const CardiacConductionGraphic: React.FC<CardiacConductionGraphicProps> = ({
  active,
  heartRate = 72
}) => {
  const saNodeRef = useRef<THREE.Mesh>(null);
  const avNodeRef = useRef<THREE.Mesh>(null);
  const linesGroupRef = useRef<THREE.Group>(null);

  // Conduction pathway spline coordinates
  const pathways = useMemo(() => {
    // 1. Internodal tract (SA node in upper right atrium to AV node)
    const saToAv = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.16, 0.28, 0.08),  // SA Node
      new THREE.Vector3(-0.14, 0.20, 0.06),  // Internodal tract
      new THREE.Vector3(-0.06, 0.12, 0.05),  // Lower right atrial septum (AV Node)
    ]);

    // 2. Bachmann's bundle to Left Atrium
    const bachmann = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.16, 0.28, 0.08),  // SA Node
      new THREE.Vector3(-0.02, 0.30, 0.02),  // Interatrial septum superior
      new THREE.Vector3(0.12, 0.24, -0.04),  // Left Atrium roof
    ]);

    // 3. Bundle of His & Septal Branch
    const bundleOfHis = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.06, 0.12, 0.05),  // AV Node
      new THREE.Vector3(-0.02, 0.04, 0.04),  // Bundle of His trunk
      new THREE.Vector3(0.01, -0.08, 0.06),  // Interventricular septum mid
      new THREE.Vector3(0.04, -0.22, 0.08),  // Septal apex
    ]);

    // 4. Left Bundle Branch & Purkinje fibers
    const leftPurkinje = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.01, -0.08, 0.06),
      new THREE.Vector3(0.08, -0.16, 0.02),  // Left Ventricle lateral wall
      new THREE.Vector3(0.12, -0.06, -0.02), // Purkinje subendocardial arborization
    ]);

    // 5. Right Bundle Branch & Purkinje fibers
    const rightPurkinje = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.01, -0.08, 0.06),
      new THREE.Vector3(-0.08, -0.14, 0.12), // Moderator band & RV wall
      new THREE.Vector3(-0.14, -0.04, 0.10), // RV lateral free wall
    ]);

    return { saToAv, bachmann, bundleOfHis, leftPurkinje, rightPurkinje };
  }, []);

  const tubeGeometries = useMemo(() => {
    return {
      saToAvGeo: new THREE.TubeGeometry(pathways.saToAv, 20, 0.005, 8, false),
      bachmannGeo: new THREE.TubeGeometry(pathways.bachmann, 20, 0.004, 8, false),
      bundleOfHisGeo: new THREE.TubeGeometry(pathways.bundleOfHis, 24, 0.006, 8, false),
      leftPurkinjeGeo: new THREE.TubeGeometry(pathways.leftPurkinje, 20, 0.004, 8, false),
      rightPurkinjeGeo: new THREE.TubeGeometry(pathways.rightPurkinje, 20, 0.004, 8, false),
    };
  }, [pathways]);

    useEffect(() => {
    return () => {
      Object.values(tubeGeometries).forEach(geo => geo.dispose());
    };
  }, [tubeGeometries]);

  useFrame(({ clock }) => {
    if (!active) return;
    const bps = (heartRate / 60) * Math.PI * 2;
    const phase = (clock.getElapsedTime() * bps) % (Math.PI * 2);

    // SA Node fires first in cycle (phase ~ 0)
    if (saNodeRef.current && saNodeRef.current.material) {
      const saFlash = Math.max(0, Math.sin(phase * 1.5)) ** 3;
      (saNodeRef.current.material as THREE.MeshBasicMaterial).color.setRGB(1, 0.8 + saFlash * 0.2, 0.2);
      saNodeRef.current.scale.setScalar(1 + saFlash * 0.6);
    }

    // AV Node fires with ~0.12s physiological delay
    if (avNodeRef.current && avNodeRef.current.material) {
      const avPhase = (phase - 0.7 + Math.PI * 2) % (Math.PI * 2);
      const avFlash = Math.max(0, Math.sin(avPhase * 1.5)) ** 3;
      (avNodeRef.current.material as THREE.MeshBasicMaterial).color.setRGB(1, 0.6 + avFlash * 0.4, 0.1);
      avNodeRef.current.scale.setScalar(1 + avFlash * 0.5);
    }
  });

  if (!active) return null;

  return (
    <group ref={linesGroupRef}>
      {/* SA Node (Pacemaker) - Pulsing golden node */}
      <mesh ref={saNodeRef} position={[-0.16, 0.28, 0.08]}>
        <sphereGeometry args={[0.016, 16, 16]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>

      {/* AV Node (Atrioventricular Node) */}
      <mesh ref={avNodeRef} position={[-0.06, 0.12, 0.05]}>
        <sphereGeometry args={[0.014, 16, 16]} />
        <meshBasicMaterial color="#f59e0b" />
      </mesh>

      {/* Internodal & Interatrial Pathways */}
      <mesh geometry={tubeGeometries.saToAvGeo}>
        <meshBasicMaterial color="#fde047" transparent opacity={0.85} />
      </mesh>

      <mesh geometry={tubeGeometries.bachmannGeo}>
        <meshBasicMaterial color="#fef08a" transparent opacity={0.75} />
      </mesh>

      {/* Bundle of His (Interventricular Septum) */}
      <mesh geometry={tubeGeometries.bundleOfHisGeo}>
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.9} />
      </mesh>

      {/* Left and Right Purkinje Arborizations */}
      <mesh geometry={tubeGeometries.leftPurkinjeGeo}>
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.8} />
      </mesh>

      <mesh geometry={tubeGeometries.rightPurkinjeGeo}>
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.8} />
      </mesh>
    </group>
  );
};
