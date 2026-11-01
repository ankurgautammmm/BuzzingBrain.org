import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MedicalPedestalProps {
  position?: [number, number, number];
  radius?: number;
  color?: string;
}

export const MedicalPedestal: React.FC<MedicalPedestalProps> = ({
  position = [0, -0.65, 0],
  radius = 0.85,
  color = '#0284c7'
}) => {
  const ringRef = useRef<THREE.Group>(null);
  const scanlineRef = useRef<THREE.Mesh>(null);

  const tickGeo = useMemo(() => new THREE.PlaneGeometry(0.06, 0.008), []);
  const tickMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#7dd3fc',
    transparent: true,
    opacity: 0.6,
    side: THREE.DoubleSide
  }), []);

  useEffect(() => {
    return () => {
      tickGeo.dispose();
      tickMat.dispose();
    };
  }, [tickGeo, tickMat]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ringRef.current) {
      ringRef.current.rotation.y = t * 0.08;
    }
    if (scanlineRef.current) {
      // Gentle breathing pulsation
      const s = 1 + Math.sin(t * 1.5) * 0.03;
      scanlineRef.current.scale.set(s, s, 1);
    }
  });

  return (
    <group position={position}>
      {/* Base Disc with Soft Dark Falloff */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <circleGeometry args={[radius * 1.4, 64]} />
        <meshBasicMaterial color="#020617" transparent opacity={0.8} />
      </mesh>

      {/* Outer Holographic Grid Circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <ringGeometry args={[radius * 0.95, radius, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.65} side={THREE.DoubleSide} />
      </mesh>

      {/* Middle Concentric Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <ringGeometry args={[radius * 0.65, radius * 0.67, 48]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* Inner Target Ring */}
      <mesh ref={scanlineRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}>
        <ringGeometry args={[radius * 0.32, radius * 0.34, 32]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.7} side={THREE.DoubleSide} />
      </mesh>

      {/* Rotating Azimuth Ticks Group */}
      <group ref={ringRef} position={[0, 0.006, 0]}>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => {
          const rad = (angle * Math.PI) / 180;
          const x = Math.cos(rad) * radius * 0.85;
          const z = Math.sin(rad) * radius * 0.85;
          return (
            <mesh 
              key={idx} 
              geometry={tickGeo}
              material={tickMat}
              position={[x, 0, z]} 
              rotation={[-Math.PI / 2, 0, rad]} 
            />
          );
        })}
      </group>
    </group>
  );
};
