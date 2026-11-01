import { MDPreset, MDAtom, MDBond } from '../types';

export const ELEMENT_PROPERTIES: Record<string, { color: string; radius: number; mass: number; sigma: number; epsilon: number }> = {
  C: { color: '#334155', radius: 1.70, mass: 12.011, sigma: 3.40, epsilon: 0.086 }, // Carbon (dark gray/slate)
  N: { color: '#2563eb', radius: 1.55, mass: 14.007, sigma: 3.25, epsilon: 0.170 }, // Nitrogen (blue)
  O: { color: '#dc2626', radius: 1.52, mass: 15.999, sigma: 2.96, epsilon: 0.210 }, // Oxygen (red)
  H: { color: '#e2e8f0', radius: 1.20, mass: 1.008, sigma: 2.40, epsilon: 0.015 },  // Hydrogen (white/silver)
  S: { color: '#eab308', radius: 1.80, mass: 32.065, sigma: 3.55, epsilon: 0.250 }, // Sulfur (yellow)
  P: { color: '#ea580c', radius: 1.80, mass: 30.974, sigma: 3.74, epsilon: 0.200 }, // Phosphorus (orange)
  Ar: { color: '#8b5cf6', radius: 1.88, mass: 39.948, sigma: 3.40, epsilon: 0.238 } // Argon (purple)
};

export function createPolyalanineHelix(): { atoms: MDAtom[]; bonds: MDBond[] } {
  const atoms: MDAtom[] = [];
  const bonds: MDBond[] = [];
  const numResidues = 7;
  const radius = 2.3;
  const pitchPerResidue = 1.5; // 1.5 Angstroms rise per residue in alpha-helix
  const anglePerResidue = (100 * Math.PI) / 180; // 100 degrees per residue (3.6 residues per turn)

  let atomId = 1;

  for (let i = 0; i < numResidues; i++) {
    const angle = i * anglePerResidue;
    const zBase = (i - numResidues / 2) * pitchPerResidue * 2;
    const xBase = Math.cos(angle) * radius;
    const yBase = Math.sin(angle) * radius;

    // N atom (backbone)
    const nId = atomId++;
    atoms.push({
      id: nId,
      element: 'N',
      name: 'N',
      residueName: 'ALA',
      residueIndex: i + 1,
      x: xBase - 0.5 * Math.sin(angle),
      y: yBase + 0.5 * Math.cos(angle),
      z: zBase - 0.7,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
      vz: (Math.random() - 0.5) * 0.1,
      fx: 0, fy: 0, fz: 0,
      mass: 14.01,
      charge: -0.47,
      sigma: 3.25,
      epsilon: 0.17,
      color: ELEMENT_PROPERTIES.N.color,
      radius: 1.2
    });

    // CA atom (Alpha Carbon)
    const caId = atomId++;
    atoms.push({
      id: caId,
      element: 'C',
      name: 'CA',
      residueName: 'ALA',
      residueIndex: i + 1,
      x: xBase,
      y: yBase,
      z: zBase,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
      vz: (Math.random() - 0.5) * 0.1,
      fx: 0, fy: 0, fz: 0,
      mass: 12.01,
      charge: 0.07,
      sigma: 3.40,
      epsilon: 0.086,
      color: ELEMENT_PROPERTIES.C.color,
      radius: 1.3
    });

    // C atom (Carbonyl Carbon)
    const cId = atomId++;
    atoms.push({
      id: cId,
      element: 'C',
      name: 'C',
      residueName: 'ALA',
      residueIndex: i + 1,
      x: xBase + 0.6 * Math.sin(angle),
      y: yBase - 0.6 * Math.cos(angle),
      z: zBase + 0.7,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
      vz: (Math.random() - 0.5) * 0.1,
      fx: 0, fy: 0, fz: 0,
      mass: 12.01,
      charge: 0.51,
      sigma: 3.40,
      epsilon: 0.086,
      color: ELEMENT_PROPERTIES.C.color,
      radius: 1.3
    });

    // O atom (Carbonyl Oxygen)
    const oId = atomId++;
    atoms.push({
      id: oId,
      element: 'O',
      name: 'O',
      residueName: 'ALA',
      residueIndex: i + 1,
      x: xBase + 1.4 * Math.sin(angle),
      y: yBase - 1.4 * Math.cos(angle),
      z: zBase + 1.1,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
      vz: (Math.random() - 0.5) * 0.1,
      fx: 0, fy: 0, fz: 0,
      mass: 16.00,
      charge: -0.51,
      sigma: 2.96,
      epsilon: 0.21,
      color: ELEMENT_PROPERTIES.O.color,
      radius: 1.1
    });

    // CB atom (Sidechain Methyl Carbon)
    const cbId = atomId++;
    atoms.push({
      id: cbId,
      element: 'C',
      name: 'CB',
      residueName: 'ALA',
      residueIndex: i + 1,
      x: xBase * 1.6,
      y: yBase * 1.6,
      z: zBase - 0.2,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
      vz: (Math.random() - 0.5) * 0.1,
      fx: 0, fy: 0, fz: 0,
      mass: 15.03,
      charge: 0.0,
      sigma: 3.6,
      epsilon: 0.10,
      color: '#475569',
      radius: 1.35
    });

    // Bonds within residue: N-CA, CA-C, C=O, CA-CB
    bonds.push({ atom1: nId, atom2: caId, r0: 1.46, kBond: 320 });
    bonds.push({ atom1: caId, atom2: cId, r0: 1.52, kBond: 300 });
    bonds.push({ atom1: cId, atom2: oId, r0: 1.23, kBond: 550, order: 2 });
    bonds.push({ atom1: caId, atom2: cbId, r0: 1.53, kBond: 280 });

    // Peptide bond to previous residue: C(i-1) - N(i)
    if (i > 0) {
      const prevCId = (i - 1) * 5 + 3;
      bonds.push({ atom1: prevCId, atom2: nId, r0: 1.33, kBond: 420 });

      // Alpha-helix hydrogen bond stabilization potential between C=O(i) and N-H(i+3) or (i+4)
      if (i >= 3) {
        const hBondOId = (i - 3) * 5 + 4;
        bonds.push({ atom1: hBondOId, atom2: nId, r0: 2.85, kBond: 35 }); // Soft pseudo-bond for H-bond stability
      }
    }
  }

  return { atoms, bonds };
}

export function createRgdTripeptide(): { atoms: MDAtom[]; bonds: MDBond[] } {
  // Arg - Gly - Asp
  const atoms: MDAtom[] = [
    // Arg (Residue 1)
    { id: 1, element: 'N', name: 'N', residueName: 'ARG', residueIndex: 1, x: -7.0, y: 1.5, z: 0, vx: 0, vy: 0, vz: 0, fx: 0, fy: 0, fz: 0, mass: 14.0, charge: -0.4, sigma: 3.25, epsilon: 0.17, color: ELEMENT_PROPERTIES.N.color, radius: 1.2 },
    { id: 2, element: 'C', name: 'CA', residueName: 'ARG', residueIndex: 1, x: -5.8, y: 1.0, z: 0, vx: 0, vy: 0, vz: 0, fx: 0, fy: 0, fz: 0, mass: 12.0, charge: 0.1, sigma: 3.4, epsilon: 0.086, color: ELEMENT_PROPERTIES.C.color, radius: 1.3 },
    { id: 3, element: 'C', name: 'C', residueName: 'ARG', residueIndex: 1, x: -4.8, y: 2.1, z: 0, vx: 0, vy: 0, vz: 0, fx: 0, fy: 0, fz: 0, mass: 12.0, charge: 0.5, sigma: 3.4, epsilon: 0.086, color: ELEMENT_PROPERTIES.C.color, radius: 1.3 },
    { id: 4, element: 'O', name: 'O', residueName: 'ARG', residueIndex: 1, x: -5.0, y: 3.3, z: 0, vx: 0, vy: 0, vz: 0, fx: 0, fy: 0, fz: 0, mass: 16.0, charge: -0.5, sigma: 2.96, epsilon: 0.21, color: ELEMENT_PROPERTIES.O.color, radius: 1.1 },
    // Arg Guanidinium Sidechain
    { id: 5, element: 'C', name: 'CB', residueName: 'ARG', residueIndex: 1, x: -5.5, y: -0.4, z: 0, vx: 0, vy: 0, vz: 0, fx: 0, fy: 0, fz: 0, mass: 12.0, charge: 0.0, sigma: 3.4, epsilon: 0.086, color: ELEMENT_PROPERTIES.C.color, radius: 1.3 },
    { id: 6, element: 'C', name: 'CG', residueName: 'ARG', residueIndex: 1, x: -6.6, y: -1.4, z: 0, vx: 0, vy: 0, vz: 0, fx: 0, fy: 0, fz: 0, mass: 12.0, charge: 0.0, sigma: 3.4, epsilon: 0.086, color: ELEMENT_PROPERTIES.C.color, radius: 1.3 },
    { id: 7, element: 'N', name: 'NE', residueName: 'ARG', residueIndex: 1, x: -6.2, y: -2.8, z: 0, vx: 0, vy: 0, vz: 0, fx: 0, fy: 0, fz: 0, mass: 14.0, charge: -0.3, sigma: 3.25, epsilon: 0.17, color: ELEMENT_PROPERTIES.N.color, radius: 1.2 },
    { id: 8, element: 'C', name: 'CZ', residueName: 'ARG', residueIndex: 1, x: -7.0, y: -3.8, z: 0, vx: 0, vy: 0, vz: 0, fx: 0, fy: 0, fz: 0, mass: 12.0, charge: 0.6, sigma: 3.4, epsilon: 0.086, color: ELEMENT_PROPERTIES.C.color, radius: 1.3 },
    { id: 9, element: 'N', name: 'NH1', residueName: 'ARG', residueIndex: 1, x: -8.3, y: -3.6, z: 0, vx: 0, vy: 0, vz: 0, fx: 0, fy: 0, fz: 0, mass: 14.0, charge: -0.4, sigma: 3.25, epsilon: 0.17, color: ELEMENT_PROPERTIES.N.color, radius: 1.2 },
    { id: 10, element: 'N', name: 'NH2', residueName: 'ARG', residueIndex: 1, x: -6.6, y: -5.0, z: 0, vx: 0, vy: 0, vz: 0, fx: 0, fy: 0, fz: 0, mass: 14.0, charge: -0.4, sigma: 3.25, epsilon: 0.17, color: ELEMENT_PROPERTIES.N.color, radius: 1.2 },

    // Gly (Residue 2)
    { id: 11, element: 'N', name: 'N', residueName: 'GLY', residueIndex: 2, x: -3.5, y: 1.7, z: 0, vx: 0, vy: 0, vz: 0, fx: 0, fy: 0, fz: 0, mass: 14.0, charge: -0.4, sigma: 3.25, epsilon: 0.17, color: ELEMENT_PROPERTIES.N.color, radius: 1.2 },
    { id: 12, element: 'C', name: 'CA', residueName: 'GLY', residueIndex: 2, x: -2.3, y: 2.5, z: 0, vx: 0, vy: 0, vz: 0, fx: 0, fy: 0, fz: 0, mass: 12.0, charge: 0.1, sigma: 3.4, epsilon: 0.086, color: ELEMENT_PROPERTIES.C.color, radius: 1.3 },
    { id: 13, element: 'C', name: 'C', residueName: 'GLY', residueIndex: 2, x: -1.0, y: 1.8, z: 0, vx: 0, vy: 0, vz: 0, fx: 0, fy: 0, fz: 0, mass: 12.0, charge: 0.5, sigma: 3.4, epsilon: 0.086, color: ELEMENT_PROPERTIES.C.color, radius: 1.3 },
    { id: 14, element: 'O', name: 'O', residueName: 'GLY', residueIndex: 2, x: -0.9, y: 0.6, z: 0, vx: 0, vy: 0, vz: 0, fx: 0, fy: 0, fz: 0, mass: 16.0, charge: -0.5, sigma: 2.96, epsilon: 0.21, color: ELEMENT_PROPERTIES.O.color, radius: 1.1 },

    // Asp (Residue 3)
    { id: 15, element: 'N', name: 'N', residueName: 'ASP', residueIndex: 3, x: 0.1, y: 2.5, z: 0, vx: 0, vy: 0, vz: 0, fx: 0, fy: 0, fz: 0, mass: 14.0, charge: -0.4, sigma: 3.25, epsilon: 0.17, color: ELEMENT_PROPERTIES.N.color, radius: 1.2 },
    { id: 16, element: 'C', name: 'CA', residueName: 'ASP', residueIndex: 3, x: 1.4, y: 1.9, z: 0, vx: 0, vy: 0, vz: 0, fx: 0, fy: 0, fz: 0, mass: 12.0, charge: 0.1, sigma: 3.4, epsilon: 0.086, color: ELEMENT_PROPERTIES.C.color, radius: 1.3 },
    { id: 17, element: 'C', name: 'C', residueName: 'ASP', residueIndex: 3, x: 2.4, y: 3.0, z: 0, vx: 0, vy: 0, vz: 0, fx: 0, fy: 0, fz: 0, mass: 12.0, charge: 0.5, sigma: 3.4, epsilon: 0.086, color: ELEMENT_PROPERTIES.C.color, radius: 1.3 },
    { id: 18, element: 'O', name: 'OT1', residueName: 'ASP', residueIndex: 3, x: 2.2, y: 4.2, z: 0, vx: 0, vy: 0, vz: 0, fx: 0, fy: 0, fz: 0, mass: 16.0, charge: -0.6, sigma: 2.96, epsilon: 0.21, color: ELEMENT_PROPERTIES.O.color, radius: 1.1 },
    { id: 19, element: 'O', name: 'OT2', residueName: 'ASP', residueIndex: 3, x: 3.5, y: 2.6, z: 0, vx: 0, vy: 0, vz: 0, fx: 0, fy: 0, fz: 0, mass: 16.0, charge: -0.6, sigma: 2.96, epsilon: 0.21, color: ELEMENT_PROPERTIES.O.color, radius: 1.1 },
    // Asp Carboxylate Sidechain
    { id: 20, element: 'C', name: 'CB', residueName: 'ASP', residueIndex: 3, x: 1.8, y: 0.7, z: 0, vx: 0, vy: 0, vz: 0, fx: 0, fy: 0, fz: 0, mass: 12.0, charge: 0.0, sigma: 3.4, epsilon: 0.086, color: ELEMENT_PROPERTIES.C.color, radius: 1.3 },
    { id: 21, element: 'C', name: 'CG', residueName: 'ASP', residueIndex: 3, x: 3.2, y: 0.3, z: 0, vx: 0, vy: 0, vz: 0, fx: 0, fy: 0, fz: 0, mass: 12.0, charge: 0.6, sigma: 3.4, epsilon: 0.086, color: ELEMENT_PROPERTIES.C.color, radius: 1.3 },
    { id: 22, element: 'O', name: 'OD1', residueName: 'ASP', residueIndex: 3, x: 3.6, y: -0.9, z: 0, vx: 0, vy: 0, vz: 0, fx: 0, fy: 0, fz: 0, mass: 16.0, charge: -0.7, sigma: 2.96, epsilon: 0.21, color: ELEMENT_PROPERTIES.O.color, radius: 1.1 },
    { id: 23, element: 'O', name: 'OD2', residueName: 'ASP', residueIndex: 3, x: 4.1, y: 1.2, z: 0, vx: 0, vy: 0, vz: 0, fx: 0, fy: 0, fz: 0, mass: 16.0, charge: -0.7, sigma: 2.96, epsilon: 0.21, color: ELEMENT_PROPERTIES.O.color, radius: 1.1 },
  ];

  const bonds: MDBond[] = [
    // Arg backbone
    { atom1: 1, atom2: 2, r0: 1.46, kBond: 320 },
    { atom1: 2, atom2: 3, r0: 1.52, kBond: 300 },
    { atom1: 3, atom2: 4, r0: 1.23, kBond: 550, order: 2 },
    // Arg sidechain
    { atom1: 2, atom2: 5, r0: 1.53, kBond: 280 },
    { atom1: 5, atom2: 6, r0: 1.53, kBond: 280 },
    { atom1: 6, atom2: 7, r0: 1.46, kBond: 320 },
    { atom1: 7, atom2: 8, r0: 1.33, kBond: 420 },
    { atom1: 8, atom2: 9, r0: 1.33, kBond: 420 },
    { atom1: 8, atom2: 10, r0: 1.33, kBond: 420 },
    // Peptide bond 1 (Arg C - Gly N)
    { atom1: 3, atom2: 11, r0: 1.33, kBond: 420 },
    // Gly backbone
    { atom1: 11, atom2: 12, r0: 1.46, kBond: 320 },
    { atom1: 12, atom2: 13, r0: 1.52, kBond: 300 },
    { atom1: 13, atom2: 14, r0: 1.23, kBond: 550, order: 2 },
    // Peptide bond 2 (Gly C - Asp N)
    { atom1: 13, atom2: 15, r0: 1.33, kBond: 420 },
    // Asp backbone & sidechain
    { atom1: 15, atom2: 16, r0: 1.46, kBond: 320 },
    { atom1: 16, atom2: 17, r0: 1.52, kBond: 300 },
    { atom1: 17, atom2: 18, r0: 1.25, kBond: 500 },
    { atom1: 17, atom2: 19, r0: 1.25, kBond: 500 },
    { atom1: 16, atom2: 20, r0: 1.53, kBond: 280 },
    { atom1: 20, atom2: 21, r0: 1.52, kBond: 300 },
    { atom1: 21, atom2: 22, r0: 1.25, kBond: 500 },
    { atom1: 21, atom2: 23, r0: 1.25, kBond: 500 },
    // Soft intramolecular electrostatic loop attraction between Arg(+) and Asp(-)
    { atom1: 8, atom2: 21, r0: 4.5, kBond: 18 }
  ];

  return { atoms, bonds };
}

export function createArgonCluster(): { atoms: MDAtom[]; bonds: MDBond[] } {
  const atoms: MDAtom[] = [];
  const bonds: MDBond[] = [];
  const numAtoms = 27;
  const spacing = 3.8; // Angstroms
  const dim = 3;

  let id = 1;
  for (let x = 0; x < dim; x++) {
    for (let y = 0; y < dim; y++) {
      for (let z = 0; z < dim; z++) {
        if (id > numAtoms) break;
        atoms.push({
          id: id++,
          element: 'Ar',
          name: 'Ar',
          residueName: 'GAS',
          residueIndex: 1,
          x: (x - dim / 2 + 0.5) * spacing + (Math.random() - 0.5) * 0.4,
          y: (y - dim / 2 + 0.5) * spacing + (Math.random() - 0.5) * 0.4,
          z: (z - dim / 2 + 0.5) * spacing + (Math.random() - 0.5) * 0.4,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          vz: (Math.random() - 0.5) * 0.15,
          fx: 0, fy: 0, fz: 0,
          mass: 39.95,
          charge: 0,
          sigma: 3.40,
          epsilon: 0.238, // 120 K in epsilon/k_B
          color: ELEMENT_PROPERTIES.Ar.color,
          radius: 1.6
        });
      }
    }
  }

  return { atoms, bonds };
}

export const MD_PRESETS: MDPreset[] = [
  {
    id: 'polyalanine-helix',
    name: 'Polyalanine α-Helix Denaturation',
    category: 'Peptide',
    description: '7-residue alpha-helical peptide showing cooperative hydrogen bond stabilization and thermal denaturation above 370 K.',
    scientificContext: 'Alpha-helices represent the most abundant secondary structure in proteins (~31% of residues in globular structures). Watch the i -> i+4 hydrogen bond network maintain rigidity at 300 K and unfold at high temperatures.',
    atoms: createPolyalanineHelix().atoms,
    bonds: createPolyalanineHelix().bonds,
    recommendedTemp: 300,
    recommendedTimeStep: 1.0
  },
  {
    id: 'rgd-integrin-motif',
    name: 'RGD Tripeptide Dynamic Conformational Sampling',
    category: 'Ligand-Receptor',
    description: 'Arg-Gly-Asp recognition motif with charged guanidinium (Arg+) and carboxylate (Asp-) sidechains sampling bioactive hairpin conformations.',
    scientificContext: 'Found in fibronectin and fibrinogen, the RGD sequence binds cell-surface integrins (αvβ3, α5β1) to mediate cell adhesion, signaling, and angiogenesis.',
    atoms: createRgdTripeptide().atoms,
    bonds: createRgdTripeptide().bonds,
    recommendedTemp: 310,
    recommendedTimeStep: 1.0
  },
  {
    id: 'argon-lj-fluid',
    name: 'Noble Gas Lennard-Jones (12-6) Phase Simulator',
    category: 'Thermodynamics',
    description: '27-atom Argon cluster demonstrating crystalline condensation at 60 K, liquid droplet dynamics at 85 K, and supercritical expansion above 150 K.',
    scientificContext: 'Classic verification test for molecular dynamics integration algorithms (Verlet / Velocity Verlet) testing energy conservation under non-bonded 12-6 van der Waals interactions.',
    atoms: createArgonCluster().atoms,
    bonds: createArgonCluster().bonds,
    recommendedTemp: 85,
    recommendedTimeStep: 2.0
  }
];
