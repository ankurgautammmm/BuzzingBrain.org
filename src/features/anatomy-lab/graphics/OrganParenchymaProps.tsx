import React, { useMemo } from 'react';
import * as THREE from 'three';
import { AnatomicalStructure, GraphicsRenderMode } from '../types/anatomy';
import { createAnatomicalMaterial } from './OrganShaderMaterials';

export interface OrganParenchymaPropsProps {
  organId: string;
  renderMode?: GraphicsRenderMode;
  tissueOpacity?: number; // 0.0 to 1.0 (default 0.92)
  showCrossSection?: boolean;
  selectedStructure?: AnatomicalStructure | null;
  hoveredStructure?: AnatomicalStructure | null;
  onSelectStructure?: (struct: AnatomicalStructure | null) => void;
  clippingPlanes?: THREE.Plane[];
}

/**
 * High-fidelity 3D Anatomical Organ Body & Parenchymal Muscle Tissue Props
 * Solves the missing organ body issue where only isolated veins/arteries were visible.
 * Renders complete myocardial muscular walls, renal cortex/capsule, and cerebral cortex.
 */
export const OrganParenchymaProps: React.FC<OrganParenchymaPropsProps> = ({
  organId,
  renderMode = 'pbr_tissue',
  tissueOpacity = 0.92,
  showCrossSection = false,
  selectedStructure,
  hoveredStructure,
  onSelectStructure,
  clippingPlanes = []
}) => {
  // Common biological tissue material for myocardial muscular walls
  const myocardiumMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#991b1b'), // Deep rich cardiac muscle crimson
      roughness: 0.38,
      metalness: 0.06,
      clearcoat: 0.6,
      clearcoatRoughness: 0.18,
      reflectivity: 0.55,
      transparent: tissueOpacity < 0.98,
      opacity: tissueOpacity,
      side: showCrossSection ? THREE.DoubleSide : THREE.FrontSide,
      clippingPlanes,
      clipShadows: true,
    });
  }, [tissueOpacity, showCrossSection, clippingPlanes]);

  // Material for epicardial fat cushions / sulcus grooves
  const epicardialFatMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#fef08a'), // Creamy physiological fat along sulcus
      roughness: 0.55,
      metalness: 0.02,
      transparent: tissueOpacity < 0.98,
      opacity: Math.min(1.0, tissueOpacity * 0.9),
      side: THREE.DoubleSide,
      clippingPlanes,
    });
  }, [tissueOpacity, clippingPlanes]);

  // Material for Renal Cortex & Capsule
  const renalCortexMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#831843'), // Reddish-brown renal parenchyma
      roughness: 0.42,
      metalness: 0.05,
      clearcoat: 0.7,
      clearcoatRoughness: 0.15,
      transparent: tissueOpacity < 0.98,
      opacity: tissueOpacity,
      side: showCrossSection ? THREE.DoubleSide : THREE.FrontSide,
      clippingPlanes,
    });
  }, [tissueOpacity, showCrossSection, clippingPlanes]);

  // Material for Renal Medullary Pyramids
  const renalPyramidMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#9f1239'), // Deeper striated medullary pyramid tissue
      roughness: 0.45,
      metalness: 0.04,
      transparent: tissueOpacity < 0.98,
      opacity: tissueOpacity,
      clippingPlanes,
    });
  }, [tissueOpacity, clippingPlanes]);

  // Material for Brain Cerebral Cortex Mantle
  const brainCortexMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#f1f5f9'), // Pearl-tinted cerebral grey/white matter
      roughness: 0.5,
      metalness: 0.05,
      clearcoat: 0.4,
      transparent: tissueOpacity < 0.98,
      opacity: tissueOpacity,
      side: THREE.DoubleSide,
      clippingPlanes,
    });
  }, [tissueOpacity, clippingPlanes]);

  // Material for Alveolar Lung Parenchyma
  const lungParenchymaMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#f472b6'), // Physiological pink alveolar sponge tissue
      roughness: 0.65,
      metalness: 0.02,
      clearcoat: 0.3,
      transparent: tissueOpacity < 0.98,
      opacity: Math.min(0.95, tissueOpacity),
      side: showCrossSection ? THREE.DoubleSide : THREE.FrontSide,
      clippingPlanes,
    });
  }, [tissueOpacity, showCrossSection, clippingPlanes]);

  // Material for Eyeball Sclera / Cornea
  const eyeScleraMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#ffffff'),
      roughness: 0.1,
      metalness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      transmission: 0.1,
      transparent: false,
      side: THREE.DoubleSide,
      clippingPlanes,
    });
  }, [clippingPlanes]);

  const eyeCorneaMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#38bdf8'),
      roughness: 0.05,
      metalness: 0.0,
      transmission: 0.85,
      transparent: true,
      opacity: 0.7,
      ior: 1.376,
      clippingPlanes,
    });
  }, [clippingPlanes]);

  // Material for Gastric Mucosa & Muscularis
  const stomachWallMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#be123c'),
      roughness: 0.32,
      metalness: 0.04,
      clearcoat: 0.85,
      clearcoatRoughness: 0.12,
      reflectivity: 0.6,
      transparent: tissueOpacity < 0.98,
      opacity: tissueOpacity,
      side: showCrossSection ? THREE.DoubleSide : THREE.FrontSide,
      clippingPlanes,
    });
  }, [tissueOpacity, showCrossSection, clippingPlanes]);

  // Material for Cartilage & Ossicles
  const cartilageBoneMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#f8fafc'),
      roughness: 0.28,
      metalness: 0.08,
      transparent: tissueOpacity < 0.98,
      opacity: tissueOpacity,
      clippingPlanes,
    });
  }, [tissueOpacity, clippingPlanes]);

  const cochleaMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#0284c7'),
      roughness: 0.25,
      metalness: 0.15,
      clearcoat: 0.7,
      transparent: tissueOpacity < 0.98,
      opacity: tissueOpacity,
      clippingPlanes,
    });
  }, [tissueOpacity, clippingPlanes]);

  // Material for Hepatic Parenchyma
  const liverParenchymaMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#78350f'),
      roughness: 0.38,
      metalness: 0.05,
      clearcoat: 0.5,
      transparent: tissueOpacity < 0.98,
      opacity: tissueOpacity,
      side: showCrossSection ? THREE.DoubleSide : THREE.FrontSide,
      clippingPlanes,
    });
  }, [tissueOpacity, showCrossSection, clippingPlanes]);

  // Material for Gallbladder & Bile
  const gallbladderMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#15803d'),
      roughness: 0.2,
      metalness: 0.1,
      clearcoat: 0.9,
      transparent: tissueOpacity < 0.98,
      opacity: tissueOpacity,
      clippingPlanes,
    });
  }, [tissueOpacity, clippingPlanes]);

  // Material for Neuron Soma & Axon
  const neuronAxonMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#eab308'),
      emissive: new THREE.Color('#ca8a04'),
      emissiveIntensity: 0.25,
      roughness: 0.28,
      metalness: 0.12,
      clearcoat: 0.6,
      transparent: tissueOpacity < 0.98,
      opacity: tissueOpacity,
      clippingPlanes,
    });
  }, [tissueOpacity, clippingPlanes]);

  // Material for Myelin Sheath
  const myelinSheathMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#6366f1'),
      roughness: 0.35,
      metalness: 0.1,
      transparent: tissueOpacity < 0.98,
      opacity: tissueOpacity,
      clippingPlanes,
    });
  }, [tissueOpacity, clippingPlanes]);

  // Material for Synapse Bouton Terminal
  const synapseBoutonMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#06b6d4'),
      emissive: new THREE.Color('#0891b2'),
      emissiveIntensity: 0.4,
      roughness: 0.2,
      metalness: 0.2,
      clearcoat: 1.0,
      clippingPlanes,
    });
  }, [clippingPlanes]);

  // 1. HUMAN HEART FULL MYOCARDIAL BODY PROP
  if (organId === 'organ-heart') {
    return (
      <group name="heart-parenchyma-prop">
        {/* Left Ventricle Thick Conical Muscular Wall (Forms Cardiac Apex) */}
        <mesh 
          position={[0.04, 0.44, 0.04]} 
          rotation={[0.1, 0.15, -0.22]} 
          scale={[1.1, 1.35, 1.05]}
          material={myocardiumMaterial}
          castShadow
          receiveShadow
        >
          {showCrossSection ? (
            // Half-sphere cutaway showing internal chamber
            <sphereGeometry args={[0.088, 32, 24, 0, Math.PI * 1.6, 0, Math.PI]} />
          ) : (
            <sphereGeometry args={[0.088, 32, 28]} />
          )}
        </mesh>

        {/* Right Ventricle Anterior Crescentic Muscular Wall */}
        <mesh 
          position={[-0.04, 0.45, 0.06]} 
          rotation={[-0.05, -0.15, 0.15]} 
          scale={[0.95, 1.25, 0.9]}
          material={myocardiumMaterial}
          castShadow
          receiveShadow
        >
          <sphereGeometry args={[0.075, 30, 24, 0, Math.PI * 1.8, 0, Math.PI]} />
        </mesh>

        {/* Interventricular Septum (Muscular Partition) */}
        <mesh 
          position={[0.005, 0.45, 0.045]} 
          rotation={[0, 0.25, 0]} 
          material={myocardiumMaterial}
          castShadow
        >
          <boxGeometry args={[0.018, 0.13, 0.085]} />
        </mesh>

        {/* Left Atrial Muscular Auricle & Posterior Wall */}
        <mesh 
          position={[0.055, 0.53, -0.01]} 
          rotation={[0.2, 0, -0.15]} 
          material={myocardiumMaterial}
          castShadow
        >
          <sphereGeometry args={[0.052, 24, 20]} />
        </mesh>

        {/* Right Atrial Muscular Auricle & Pectinate Wall */}
        <mesh 
          position={[-0.06, 0.52, 0.03]} 
          rotation={[-0.15, 0, 0.2]} 
          material={myocardiumMaterial}
          castShadow
        >
          <sphereGeometry args={[0.054, 24, 20]} />
        </mesh>

        {/* Anterior Interventricular Sulcus Fatty Cushion */}
        <mesh 
          position={[0.008, 0.43, 0.11]} 
          rotation={[0, 0, -0.25]}
          material={epicardialFatMaterial}
        >
          <cylinderGeometry args={[0.006, 0.004, 0.14, 12]} />
        </mesh>

        {/* Coronary Sulcus (Atrioventricular Groove) Fatty Band */}
        <mesh 
          position={[0.01, 0.495, 0.04]} 
          rotation={[Math.PI / 2, 0, 0.1]}
          material={epicardialFatMaterial}
        >
          <torusGeometry args={[0.085, 0.006, 10, 28, Math.PI * 1.7]} />
        </mesh>
      </group>
    );
  }

  // 2. HUMAN KIDNEY FULL RENAL CORTEX & CAPSULE PROP
  if (organId === 'organ-kidney') {
    return (
      <group name="kidney-parenchyma-prop">
        {/* Main Bean-Shaped Renal Cortex Outer Body */}
        <mesh 
          position={[-0.06, 0.35, 0.05]} 
          scale={[0.9, 1.45, 0.85]}
          material={renalCortexMaterial}
          castShadow
          receiveShadow
        >
          {showCrossSection ? (
            // Half cutaway showing medullary pyramids and renal pelvis inside
            <sphereGeometry args={[0.085, 32, 24, 0, Math.PI, 0, Math.PI]} />
          ) : (
            <sphereGeometry args={[0.085, 32, 28]} />
          )}
        </mesh>

        {/* Medullary Pyramids (Striated Cones inside Parenchyma) */}
        <group position={[-0.06, 0.35, 0.05]}>
          {[
            { pos: [0.015, 0.035, 0.01], rot: [0, 0, -0.6] },
            { pos: [0.02, 0.005, 0.01], rot: [0, 0, -0.2] },
            { pos: [0.015, -0.03, 0.01], rot: [0, 0, 0.3] },
            { pos: [-0.01, 0.04, -0.01], rot: [0, 0, -0.8] },
            { pos: [-0.015, -0.035, -0.01], rot: [0, 0, 0.6] },
          ].map((pyr, idx) => (
            <mesh 
              key={`pyr-${idx}`} 
              position={pyr.pos as [number, number, number]} 
              rotation={pyr.rot as [number, number, number]}
              material={renalPyramidMaterial}
            >
              <coneGeometry args={[0.018, 0.035, 16]} />
            </mesh>
          ))}
        </group>

        {/* Renal Pelvis Funnel leading to Ureter */}
        <mesh 
          position={[0.025, 0.33, 0.05]} 
          rotation={[0, 0, 0.35]}
          material={epicardialFatMaterial}
        >
          <cylinderGeometry args={[0.016, 0.008, 0.06, 16]} />
        </mesh>
      </group>
    );
  }

  // 3. HUMAN BRAIN CEREBRAL MANTLE & GYRI PROP
  if (organId === 'organ-brain') {
    return (
      <group name="brain-parenchyma-prop">
        {/* Left Cerebral Hemisphere */}
        <mesh 
          position={[-0.042, 0.38, 0.02]} 
          scale={[1.0, 1.15, 1.25]}
          material={brainCortexMaterial}
          castShadow
          receiveShadow
        >
          <sphereGeometry args={[0.075, 32, 24]} />
        </mesh>

        {/* Right Cerebral Hemisphere */}
        <mesh 
          position={[0.042, 0.38, 0.02]} 
          scale={[1.0, 1.15, 1.25]}
          material={brainCortexMaterial}
          castShadow
          receiveShadow
        >
          <sphereGeometry args={[0.075, 32, 24]} />
        </mesh>

        {/* Cerebellar Foliated Lobes (Posteroinferior) */}
        <mesh 
          position={[-0.03, 0.31, -0.05]} 
          scale={[1.0, 0.7, 0.85]}
          material={myocardiumMaterial}
        >
          <sphereGeometry args={[0.042, 24, 20]} />
        </mesh>
        <mesh 
          position={[0.03, 0.31, -0.05]} 
          scale={[1.0, 0.7, 0.85]}
          material={myocardiumMaterial}
        >
          <sphereGeometry args={[0.042, 24, 20]} />
        </mesh>

        {/* Brainstem & Medulla Oblongata */}
        <mesh 
          position={[0, 0.26, -0.01]} 
          material={brainCortexMaterial}
        >
          <cylinderGeometry args={[0.018, 0.014, 0.08, 20]} />
        </mesh>
      </group>
    );
  }

  // 4. HUMAN LUNGS BILATERAL PARENCHYMAL LOBES & TRACHEA
  if (organId === 'organ-lungs') {
    return (
      <group name="lungs-parenchyma-prop">
        {/* Right Lung (Superior, Middle & Inferior Lobes) */}
        <mesh 
          position={[-0.065, 0.38, 0.01]} 
          scale={[1.1, 1.45, 0.9]}
          material={lungParenchymaMaterial}
          castShadow
          receiveShadow
        >
          <sphereGeometry args={[0.08, 32, 28]} />
        </mesh>

        {/* Left Lung (Superior & Inferior Lobes with Cardiac Notch) */}
        <mesh 
          position={[0.065, 0.38, 0.01]} 
          scale={[0.95, 1.4, 0.85]}
          material={lungParenchymaMaterial}
          castShadow
          receiveShadow
        >
          <sphereGeometry args={[0.078, 32, 28]} />
        </mesh>

        {/* Trachea & Cartilaginous Rings */}
        <mesh position={[0, 0.48, 0.02]} material={epicardialFatMaterial}>
          <cylinderGeometry args={[0.014, 0.014, 0.09, 20]} />
        </mesh>
      </group>
    );
  }

  // 5. HUMAN EYE CORNEA, LENS & SCLERA PROP
  if (organId === 'organ-eye') {
    return (
      <group name="eye-parenchyma-prop" position={[0, 0.38, 0]}>
        {/* Eyeball Sclera White Globe */}
        <mesh material={eyeScleraMaterial} castShadow receiveShadow>
          {showCrossSection ? (
            <sphereGeometry args={[0.09, 32, 24, 0, Math.PI * 1.5, 0, Math.PI]} />
          ) : (
            <sphereGeometry args={[0.09, 32, 28]} />
          )}
        </mesh>

        {/* Transparent Anterior Cornea Dome */}
        <mesh position={[0, 0, 0.08]} material={eyeCorneaMaterial}>
          <sphereGeometry args={[0.038, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.38]} />
        </mesh>

        {/* Crystalline Biconvex Lens */}
        <mesh position={[0, 0, 0.05]} scale={[1, 1, 0.4]} material={eyeCorneaMaterial}>
          <sphereGeometry args={[0.025, 24, 16]} />
        </mesh>

        {/* Optic Nerve Tube */}
        <mesh position={[0, 0, -0.09]} rotation={[Math.PI / 2, 0, 0]} material={epicardialFatMaterial}>
          <cylinderGeometry args={[0.012, 0.012, 0.05, 16]} />
        </mesh>
      </group>
    );
  }

  // 6. HUMAN STOMACH & GASTRIC MUCOSA PROP
  if (organId === 'organ-stomach') {
    return (
      <group name="stomach-parenchyma-prop" position={[0, 0.4, 0]}>
        {/* Fundus Dome (Superior Left) */}
        <mesh position={[-0.04, 0.07, 0]} material={stomachWallMaterial} castShadow receiveShadow>
          <sphereGeometry args={[0.046, 32, 24]} />
        </mesh>

        {/* Main Body (Corpus) J-Curve */}
        <mesh position={[-0.02, 0.01, 0]} rotation={[0, 0, -0.3]} scale={[1.15, 1.4, 0.9]} material={stomachWallMaterial} castShadow receiveShadow>
          <capsuleGeometry args={[0.042, 0.07, 24, 24]} />
        </mesh>

        {/* Cardia Inflow Junction */}
        <mesh position={[-0.01, 0.1, 0]} rotation={[0, 0, 0.2]} material={epicardialFatMaterial}>
          <cylinderGeometry args={[0.014, 0.018, 0.04, 20]} />
        </mesh>

        {/* Pyloric Antrum & Canal (Rightward curve into duodenum) */}
        <mesh position={[0.045, -0.045, 0.01]} rotation={[0, 0, -1.1]} material={stomachWallMaterial} castShadow>
          <cylinderGeometry args={[0.024, 0.034, 0.07, 24]} />
        </mesh>

        {/* Pyloric Sphincter Muscular Ring */}
        <mesh position={[0.08, -0.06, 0.01]} rotation={[0, 1.2, 0]} material={epicardialFatMaterial}>
          <torusGeometry args={[0.018, 0.007, 16, 24]} />
        </mesh>

        {/* Internal Rugae Folds (When cross-section is toggled) */}
        {showCrossSection && (
          <group position={[-0.02, 0.01, 0.02]}>
            {[-0.03, -0.01, 0.01, 0.03].map((xOffset, idx) => (
              <mesh key={`rugae-${idx}`} position={[xOffset, 0, 0]} material={stomachWallMaterial}>
                <torusGeometry args={[0.025, 0.004, 12, 16, Math.PI * 0.8]} />
              </mesh>
            ))}
          </group>
        )}
      </group>
    );
  }

  // 7. HUMAN EAR & AUDITORY VESTIBULAR APPARATUS PROP
  if (organId === 'organ-ear') {
    return (
      <group name="ear-parenchyma-prop" position={[0, 0.4, 0]}>
        {/* Pinna Elastic Cartilage Concha Shell */}
        <mesh position={[0.09, 0.02, 0]} rotation={[0, 0.3, 0.1]} material={cartilageBoneMaterial} castShadow>
          <torusGeometry args={[0.05, 0.016, 16, 32, Math.PI * 1.6]} />
        </mesh>

        {/* Ear Canal (External Acoustic Meatus) */}
        <mesh position={[0.04, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={cartilageBoneMaterial}>
          <cylinderGeometry args={[0.012, 0.014, 0.08, 20]} />
        </mesh>

        {/* Tympanic Membrane (Eardrum Disk) */}
        <mesh position={[0, 0, 0]} rotation={[0, 0.2, 0]} material={epicardialFatMaterial}>
          <cylinderGeometry args={[0.016, 0.016, 0.003, 24]} />
        </mesh>

        {/* Auditory Ossicles: Malleus & Incus */}
        <mesh position={[-0.015, 0.012, 0]} material={cartilageBoneMaterial}>
          <capsuleGeometry args={[0.005, 0.02, 12, 12]} />
        </mesh>

        {/* Stapes (Stirrup articulating with oval window) */}
        <mesh position={[-0.03, 0.006, 0]} rotation={[0, 0, Math.PI / 2]} material={cartilageBoneMaterial}>
          <torusGeometry args={[0.008, 0.003, 12, 16]} />
        </mesh>

        {/* Cochlea (2.75 Coiled Spiral Chamber) */}
        <group position={[-0.065, -0.01, 0]}>
          <mesh material={cochleaMaterial} castShadow>
            <torusGeometry args={[0.022, 0.009, 16, 32, Math.PI * 1.9]} />
          </mesh>
          <mesh position={[0, 0, 0.012]} scale={[0.7, 0.7, 0.7]} material={cochleaMaterial}>
            <torusGeometry args={[0.018, 0.007, 16, 28, Math.PI * 1.7]} />
          </mesh>
        </group>

        {/* 3 Orthogonal Semicircular Canals (Balance & Acceleration) */}
        <mesh position={[-0.055, 0.035, 0]} rotation={[0, 0, 0]} material={cochleaMaterial}>
          <torusGeometry args={[0.02, 0.004, 12, 24, Math.PI * 1.2]} />
        </mesh>
        <mesh position={[-0.055, 0.035, 0]} rotation={[Math.PI / 2, 0, 0]} material={cochleaMaterial}>
          <torusGeometry args={[0.018, 0.004, 12, 24, Math.PI * 1.2]} />
        </mesh>
      </group>
    );
  }

  // 8. HUMAN LIVER & BILIARY GALLBLADDER APPARATUS PROP
  if (organId === 'organ-liver') {
    return (
      <group name="liver-parenchyma-prop" position={[0, 0.4, 0]}>
        {/* Massive Right Hepatic Lobe */}
        <mesh position={[-0.035, 0, 0]} rotation={[0.1, 0, -0.1]} scale={[1.35, 1.1, 0.95]} material={liverParenchymaMaterial} castShadow receiveShadow>
          <sphereGeometry args={[0.075, 32, 24]} />
        </mesh>

        {/* Smaller Left Hepatic Lobe */}
        <mesh position={[0.055, 0.01, 0]} rotation={[-0.1, 0, 0.15]} scale={[0.95, 0.85, 0.7]} material={liverParenchymaMaterial} castShadow receiveShadow>
          <sphereGeometry args={[0.058, 32, 24]} />
        </mesh>

        {/* Falciform Ligament Divider Line */}
        <mesh position={[0.01, 0.02, 0.065]} rotation={[0, 0, -0.2]} material={epicardialFatMaterial}>
          <boxGeometry args={[0.004, 0.1, 0.01]} />
        </mesh>

        {/* Gallbladder (Visceral Underbelly Pear-Shaped Bile Reservoir) */}
        <mesh position={[-0.025, -0.05, 0.035]} rotation={[0.4, 0, -0.3]} material={gallbladderMaterial} castShadow>
          <capsuleGeometry args={[0.018, 0.042, 20, 20]} />
        </mesh>

        {/* Cystic Duct & Common Bile Duct Branching */}
        <mesh position={[-0.015, -0.07, 0.025]} rotation={[0, 0, 0.4]} material={gallbladderMaterial}>
          <cylinderGeometry args={[0.005, 0.005, 0.035, 12]} />
        </mesh>

        {/* Hepatic Portal Vein Inflow Vessel */}
        <mesh position={[0, -0.06, -0.02]} rotation={[0.2, 0, 0.2]} material={myocardiumMaterial}>
          <cylinderGeometry args={[0.009, 0.009, 0.05, 16]} />
        </mesh>
      </group>
    );
  }

  // 9. MULTIPOLAR MOTOR NEURON & CHEMICAL SYNAPSE PROP
  if (organId === 'organ-neuron') {
    return (
      <group name="neuron-parenchyma-prop" position={[0, 0.4, 0]}>
        {/* Soma / Cyton Core Cell Body */}
        <mesh position={[-0.08, 0.04, 0]} material={neuronAxonMaterial} castShadow>
          <sphereGeometry args={[0.038, 24, 20]} />
        </mesh>

        {/* Nucleus & Nucleolus within Soma */}
        <mesh position={[-0.08, 0.04, 0]} material={epicardialFatMaterial}>
          <sphereGeometry args={[0.016, 16, 16]} />
        </mesh>

        {/* Dendritic Arbor Branches radiating outward */}
        {[
          { pos: [-0.11, 0.07, 0.01], rot: [0, 0, 0.8], len: 0.05 },
          { pos: [-0.12, 0.03, -0.01], rot: [0, 0, 1.6], len: 0.045 },
          { pos: [-0.09, 0.08, -0.02], rot: [0.4, 0, 0.4], len: 0.04 },
          { pos: [-0.07, 0.08, 0.02], rot: [-0.3, 0, -0.2], len: 0.04 },
        ].map((dendrite, idx) => (
          <mesh 
            key={`dendrite-${idx}`} 
            position={dendrite.pos as [number, number, number]} 
            rotation={dendrite.rot as [number, number, number]} 
            material={neuronAxonMaterial}
          >
            <coneGeometry args={[0.006, dendrite.len, 12]} />
          </mesh>
        ))}

        {/* Axon Hillock & Central Cylindrical Axon Cable */}
        <mesh position={[0.02, 0.02, 0]} rotation={[0, 0, Math.PI / 2]} material={neuronAxonMaterial}>
          <cylinderGeometry args={[0.006, 0.008, 0.16, 16]} />
        </mesh>

        {/* Segmented Myelin Sheath Cuffs (Schwann Cells) with Nodes of Ranvier Gaps */}
        {[-0.03, 0.01, 0.05].map((xPos, idx) => (
          <mesh 
            key={`myelin-${idx}`} 
            position={[xPos, 0.02, 0]} 
            rotation={[0, 0, Math.PI / 2]} 
            material={myelinSheathMaterial}
            castShadow
          >
            <cylinderGeometry args={[0.014, 0.014, 0.032, 16]} />
          </mesh>
        ))}

        {/* Axon Terminal & Synaptic Bouton Knobs */}
        <mesh position={[0.11, 0.02, 0]} rotation={[0, 0, -0.2]} material={neuronAxonMaterial}>
          <cylinderGeometry args={[0.004, 0.006, 0.04, 12]} />
        </mesh>
        <mesh position={[0.13, 0.015, 0]} material={synapseBoutonMaterial} castShadow>
          <sphereGeometry args={[0.015, 20, 20]} />
        </mesh>
      </group>
    );
  }

  return null;
};
