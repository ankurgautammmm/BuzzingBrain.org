/**
 * SciLab Automated Test Suite: Bioinformatics, Molecular Dynamics, Chemistry Tools & Biological Databases
 */

import { evaluateDrugLikeness } from './src/features/scilab/api/scienceClient';
import { 
  createPolyalanineHelix, 
  createRgdTripeptide, 
  createArgonCluster, 
  MD_PRESETS, 
  ELEMENT_PROPERTIES 
} from './src/features/scilab/data/mdPresets';
import { ChemicalProperties } from './src/features/scilab/types';

function runSciLabTests() {
  console.log('=== RUNNING SCILAB BIOINFORMATICS & MOLECULAR DYNAMICS TEST SUITE ===\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, msg: string) {
    if (condition) {
      console.log(`  ✓ PASS: ${msg}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${msg}`);
      failed++;
    }
  }

  // 1. Chemistry & Drug Discovery: Lipinski Rule of 5 and Veber Rules
  console.log('1. Medicinal Chemistry & Drug-Likeness Heuristics');
  const aspirinProps: ChemicalProperties = {
    cid: 2244,
    name: 'Aspirin',
    molecularFormula: 'C9H8O4',
    molecularWeight: 180.16,
    canonicalSmiles: 'CC(=O)OC1=CC=CC=C1C(=O)O',
    xLogP: 1.2,
    tpsa: 63.6,
    hBondDonorCount: 1,
    hBondAcceptorCount: 4,
    rotatableBondCount: 2,
    complexity: 212,
    image2dUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/2244/PNG'
  };

  const aspirinEval = evaluateDrugLikeness(aspirinProps);
  assert(aspirinEval.lipinskiPassed === true, 'Aspirin passes Lipinski Rule of Five');
  assert(aspirinEval.veberPassed === true, 'Aspirin passes Veber Bioavailability Rules');
  assert(aspirinEval.lipinskiViolations.length === 0, 'Aspirin has 0 Lipinski violations');
  assert(aspirinEval.bioavailabilityScore >= 80, `Aspirin bioavailability score is high: ${aspirinEval.bioavailabilityScore}%`);
  assert(aspirinEval.bloodBrainBarrierPenetration === true, 'Aspirin correctly predicted as blood-brain barrier permeable');

  const imatinibProps: ChemicalProperties = {
    cid: 5291,
    name: 'Imatinib',
    molecularFormula: 'C29H31N7O',
    molecularWeight: 493.6,
    canonicalSmiles: 'CC1=C(C=C(C=C1)NC(=O)C2=CC=C(C=C2)CN3CCN(CC3)C)NC4=NC=CC(=N4)C5=CN=CC=C5',
    xLogP: 3.5,
    tpsa: 86.3,
    hBondDonorCount: 2,
    hBondAcceptorCount: 8,
    rotatableBondCount: 7,
    complexity: 700,
    image2dUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/5291/PNG'
  };

  const imatinibEval = evaluateDrugLikeness(imatinibProps);
  assert(imatinibEval.lipinskiPassed === true, 'Imatinib (Gleevec) passes Lipinski Rule of Five (MW 493.6 <= 500)');
  assert(imatinibEval.veberPassed === true, 'Imatinib passes Veber Rules (Rotatable 7 <= 10, TPSA 86.3 <= 140)');

  // Bad compound test (High MW, High LogP)
  const megaCompoundProps: ChemicalProperties = {
    cid: 999999,
    name: 'MegaMolecule',
    molecularFormula: 'C80H120N10O20',
    molecularWeight: 1450.0,
    canonicalSmiles: 'CCCCCCCC',
    xLogP: 8.5,
    tpsa: 220.0,
    hBondDonorCount: 8,
    hBondAcceptorCount: 16,
    rotatableBondCount: 18,
    image2dUrl: ''
  };
  const megaEval = evaluateDrugLikeness(megaCompoundProps);
  assert(megaEval.lipinskiPassed === false, 'MegaMolecule correctly fails Lipinski Rule of 5');
  assert(megaEval.veberPassed === false, 'MegaMolecule correctly fails Veber Rules');
  assert(megaEval.lipinskiViolations.length >= 3, `MegaMolecule has multiple violations: count ${megaEval.lipinskiViolations.length}`);

  // 2. Molecular Dynamics Presets & Atomic Topologies
  console.log('\n2. Molecular Dynamics (MD) Presets & Atomic Topologies');
  assert(MD_PRESETS.length >= 3, `Available MD presets count >= 3: found ${MD_PRESETS.length}`);
  
  const helix = createPolyalanineHelix();
  assert(helix.atoms.length >= 30, `Polyalanine α-helix contains at least 30 atoms: found ${helix.atoms.length}`);
  assert(helix.bonds.length >= 30, `Polyalanine α-helix contains at least 30 bonds: found ${helix.bonds.length}`);
  
  const rgd = createRgdTripeptide();
  assert(rgd.atoms.some(a => a.residueName === 'ARG'), 'RGD tripeptide includes Arginine residue');
  assert(rgd.atoms.some(a => a.residueName === 'GLY'), 'RGD tripeptide includes Glycine residue');
  assert(rgd.atoms.some(a => a.residueName === 'ASP'), 'RGD tripeptide includes Aspartate residue');

  const argon = createArgonCluster();
  assert(argon.atoms.length === 27, `Argon LJ fluid cluster has exactly 27 atoms: found ${argon.atoms.length}`);
  assert(argon.atoms.every(a => a.element === 'Ar'), 'All atoms in Argon cluster are element Ar');

  // 3. Elements and Lennard-Jones Parameters
  console.log('\n3. Non-Bonded 12-6 Lennard-Jones & Element Parameters');
  assert(ELEMENT_PROPERTIES.C.sigma === 3.40, 'Carbon LJ sigma is 3.40 Angstroms');
  assert(ELEMENT_PROPERTIES.N.color === '#2563eb', 'Nitrogen has canonical blue color');
  assert(ELEMENT_PROPERTIES.O.color === '#dc2626', 'Oxygen has canonical red color');
  assert(ELEMENT_PROPERTIES.Ar.epsilon === 0.238, 'Argon LJ epsilon is 0.238 kcal/mol (120 K well depth)');

  // 4. Numerical Velocity Verlet Step Verification
  console.log('\n4. Numerical Velocity Verlet Time-Stepping Verification');
  // Simple harmonic oscillator test: m = 1.0, k = 100, x0 = 0.5, v0 = 0
  const m = 12.0; // Carbon mass
  const k = 300.0; // Bond stiffness
  let x = 0.2; // Initial displacement in Angstroms
  let v = 0.0;
  const dt = 0.001; // 1 femtosecond in ps

  let initialEnergy = 0.5 * k * x * x + 0.5 * m * v * v;
  // Run 100 steps
  for (let s = 0; s < 100; s++) {
    const f1 = -k * x;
    const a1 = f1 / m;
    x += v * dt + 0.5 * a1 * dt * dt;
    const f2 = -k * x;
    const a2 = f2 / m;
    v += 0.5 * (a1 + a2) * dt;
  }
  let finalEnergy = 0.5 * k * x * x + 0.5 * m * v * v;
  const energyDriftPercent = Math.abs((finalEnergy - initialEnergy) / initialEnergy) * 100;
  assert(energyDriftPercent < 0.1, `Velocity Verlet conserves mechanical energy within 0.1%: drift is ${energyDriftPercent.toFixed(4)}%`);

  console.log('\n========================================');
  console.log(`SCILAB TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log('========================================\n');

  if (failed > 0) process.exit(1);
}

runSciLabTests();
