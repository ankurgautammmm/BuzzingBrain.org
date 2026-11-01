/**
 * Automated Verification Test Suite for BuzzingBrain 3D Virtual Practical Academy
 * Tests Phases 1–5:
 * 1. Practical Experiments Registry & Curriculum Ingestion
 * 2. Multi-Stage Workflow Data Integrity
 * 3. Deterministic Scientific Simulation Models (Chemistry, Biology, Physics)
 * 4. Empirical Calculations & Linear Regression
 * 5. Assessment MCQs & Verified Answer Keys
 */

import { PRACTICAL_EXPERIMENTS_REGISTRY, filterExperiments, getExperimentById } from './src/features/virtual-lab/experiments/experimentRegistry';
import { CHEMICAL_SAMPLES, computeIndicatorReaction } from './src/features/virtual-lab/simulation/chemistrySimulation';
import { BIOLOGY_SPECIMENS, computeMicroscopeOptics } from './src/features/virtual-lab/simulation/biologySimulation';
import { computeOhmicCircuit, calculateLinearRegressionResistance } from './src/features/virtual-lab/simulation/physicsSimulation';

let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failedTests++;
  }
}

console.log('================================================================');
console.log('   BUZZINGBRAIN 3D VIRTUAL PRACTICAL ACADEMY AUTOMATED SUITE     ');
console.log('================================================================');

// --- 1. EXPERIMENT REGISTRY & METADATA VALIDATION ---
console.log('\n1. VERIFYING EXPERIMENTS REGISTRY & CURRICULUM SYLLABUS ALIGNMENT');
assert(PRACTICAL_EXPERIMENTS_REGISTRY.length === 3, 'Registry contains 3 comprehensive core practicals');

const chemExp = getExperimentById('c10_acid_base_indicators');
assert(Boolean(chemExp), 'Chemistry Acid-Base Indicator Experiment found in registry');
assert(chemExp?.classGrade === 'Class 10', 'Chemistry experiment aligned with Class 10');
assert(chemExp?.has3D === true, 'Chemistry experiment has 3D WebGL capability');
assert(chemExp?.hasCalculations === true, 'Chemistry experiment includes calculations');
assert((chemExp?.procedureSteps.length || 0) >= 5, 'Chemistry experiment has at least 5 structured procedure steps');
assert((chemExp?.quizQuestions.length || 0) >= 5, 'Chemistry experiment contains verified exam questions');

const bioExp = getExperimentById('c9_compound_microscope_mounts');
assert(Boolean(bioExp), 'Biology Microscope Mounts Experiment found in registry');
assert(bioExp?.classGrade === 'Class 9', 'Biology experiment aligned with Class 9');
assert(bioExp?.subject === 'Biology', 'Biology subject correctly tagged');
assert((bioExp?.apparatus.length || 0) >= 4, 'Biology experiment contains complete apparatus inventory');

const physExp = getExperimentById('c10_ohms_law_circuit');
assert(Boolean(physExp), 'Physics Ohm\'s Law Experiment found in registry');
assert(physExp?.subject === 'Physics', 'Physics subject correctly tagged');
assert(Boolean(physExp?.examTags.includes('jee_main')), 'Physics experiment tagged for JEE Main');
assert(Boolean(physExp?.examTags.includes('neet')), 'Physics experiment tagged for NEET');

// Test Filtering
const neetPracticals = filterExperiments({ examTarget: 'neet' });
assert(neetPracticals.length === 3, 'All 3 practicals are applicable to NEET medical curriculum');

const physOnly = filterExperiments({ subject: 'Physics' });
assert(physOnly.length === 1 && physOnly[0].id === 'c10_ohms_law_circuit', 'Filter by subject works accurately');

// --- 2. CHEMISTRY SCIENTIFIC SIMULATION ENGINE ---
console.log('\n2. VERIFYING CHEMISTRY ACID-BASE & PH SIMULATION ENGINE');
const hclSample = CHEMICAL_SAMPLES.find(s => s.id === 'sample_hcl')!;
const naohSample = CHEMICAL_SAMPLES.find(s => s.id === 'sample_naoh')!;
const waterSample = CHEMICAL_SAMPLES.find(s => s.id === 'sample_water')!;

// Pure sample without indicator
const r0 = computeIndicatorReaction(hclSample, 'none', 0);
assert(r0.developedColorName.includes('Clear'), 'HCl without indicator is clear');

// HCl + Phenolphthalein (should be colorless)
const rHclPhenol = computeIndicatorReaction(hclSample, 'phenolphthalein', 2);
assert(rHclPhenol.developedColorName.includes('Colorless'), 'HCl with phenolphthalein is strictly colorless');
assert(rHclPhenol.measuredPh <= 2.0, 'HCl measured pH is correctly strongly acidic (<= 2.0)');

// NaOH + Phenolphthalein (should be vivid pink/magenta)
const rNaohPhenol = computeIndicatorReaction(naohSample, 'phenolphthalein', 2);
assert(rNaohPhenol.developedColorHex === '#f43f5e', 'NaOH with phenolphthalein turns vivid magenta pink (#f43f5e)');
assert(rNaohPhenol.measuredPh >= 12.0, 'NaOH measured pH is strongly alkaline (>= 12.0)');

// HCl + Methyl Orange (should be red)
const rHclMo = computeIndicatorReaction(hclSample, 'methyl_orange', 2);
assert(rHclMo.developedColorHex === '#dc2626', 'HCl with methyl orange turns deep red (#dc2626)');

// Water + Universal Indicator (should be green pH 7)
const rWaterUni = computeIndicatorReaction(waterSample, 'universal', 2);
assert(rWaterUni.developedColorHex === '#10b981', 'Pure water with universal indicator turns emerald green (#10b981)');
assert(Math.abs(rWaterUni.measuredPh - 7.0) < 0.1, 'Water pH is neutral ~7.0');

// --- 3. BIOLOGY MICROSCOPE OPTICAL SIMULATION ENGINE ---
console.log('\n3. VERIFYING BIOLOGY MICROSCOPE OPTICAL SIMULATION ENGINE');
assert(BIOLOGY_SPECIMENS.length === 3, 'Specimen library contains Onion Peel, Cheek Cells, and Amoeba');

// Magnification test: 10x ocular * 10x objective = 100x
const optics10x = computeMicroscopeOptics({
  eyepieceMagnification: 10,
  objectiveMagnification: 10,
  coarseFocusPosition: 50,
  fineFocusPosition: 50,
  irisDiaphragmPercent: 80
});
assert(optics10x.totalMagnification === 100, '10x ocular * 10x objective gives exactly 100x magnification');
assert(optics10x.fieldOfViewDiameterUm === 1800, '10x objective field of view is 1800 μm (1.8 mm)');
assert(optics10x.isFocused === true, 'Center focus knobs yield sharp optical focus');
assert(optics10x.defocusBlurPx === 0, 'Sharp focus has 0px blur');

// Magnification test: 10x ocular * 40x objective = 400x
const optics40x = computeMicroscopeOptics({
  eyepieceMagnification: 10,
  objectiveMagnification: 40,
  coarseFocusPosition: 80, // Way off focus
  fineFocusPosition: 50,
  irisDiaphragmPercent: 80
});
assert(optics40x.totalMagnification === 400, '10x ocular * 40x objective gives exactly 400x magnification');
assert(optics40x.fieldOfViewDiameterUm === 450, '40x objective field of view is 450 μm');
assert(optics40x.isFocused === false, 'Off-focus position registers as defocused');
assert(optics40x.defocusBlurPx > 10, 'Off-focus introduces high Gaussian blur radius');

// --- 4. PHYSICS OHM\'S LAW & REGRESSION SIMULATION ENGINE ---
console.log('\n4. VERIFYING PHYSICS OHM\'S LAW SIMULATION & LINEAR REGRESSION');

// Open switch test
const openCircuit = computeOhmicCircuit({
  supplyVoltageVolts: 6.0,
  wireNominalResistanceOhms: 2.50,
  wireLengthCm: 100,
  rheostatResistanceOhms: 5.0,
  isSwitchClosed: false,
  wireTemperatureCelsius: 25
});
assert(openCircuit.currentAmperes === 0, 'Open switch yields exactly 0 current');
assert(openCircuit.measuredVoltageDropVolts === 0, 'Open switch yields 0 voltage drop');

// Closed switch test (V = 2.0 V, R_wire = 2.50 Ω, R_rheostat = 0 Ω)
// Total R = 2.50 + 0.15 (internal) + 0.05 (ammeter) = 2.70 Ω
// I = 2.0 / 2.70 = 0.741 A
// V_wire = 0.741 * 2.50 = 1.852 V
const closedCircuit = computeOhmicCircuit({
  supplyVoltageVolts: 2.0,
  wireNominalResistanceOhms: 2.50,
  wireLengthCm: 100,
  rheostatResistanceOhms: 0.0,
  isSwitchClosed: true,
  wireTemperatureCelsius: 25
});
assert(closedCircuit.currentAmperes > 0.7 && closedCircuit.currentAmperes < 0.76, 'Current calculated accurately via circuit laws');
assert(closedCircuit.measuredVoltageDropVolts > 1.8 && closedCircuit.measuredVoltageDropVolts < 1.9, 'Voltage drop across wire calculated accurately');
assert(closedCircuit.ammeterAngleDegrees > 0, 'Ammeter needle deflects with positive angle');

// Linear Regression Test: V-I data points
const testReadings = [
  { current: 0.20, voltage: 0.50 },
  { current: 0.40, voltage: 1.00 },
  { current: 0.60, voltage: 1.50 },
  { current: 0.80, voltage: 2.00 },
  { current: 1.00, voltage: 2.50 },
];
const reg = calculateLinearRegressionResistance(testReadings);
assert(Math.abs(reg.slopeR - 2.50) < 0.01, `Linear regression slope R = ${reg.slopeR} matches nominal 2.50 Ω`);
assert(reg.rSquared >= 0.999, `R² correlation = ${reg.rSquared} confirms perfect linearity`);

// --- 5. EXAM ASSESSMENT MCQS VALIDATION ---
console.log('\n5. VERIFYING MCQ QUIZ QUESTION BANKS & EXPLANATIONS');
let totalQuestions = 0;
let questionsWithValidAnswer = 0;
let questionsWithExplanations = 0;

PRACTICAL_EXPERIMENTS_REGISTRY.forEach(exp => {
  exp.quizQuestions.forEach(q => {
    totalQuestions++;
    if (q.correctAnswer >= 0 && q.correctAnswer < q.options.length) {
      questionsWithValidAnswer++;
    }
    if (q.explanation && q.explanation.length > 20) {
      questionsWithExplanations++;
    }
  });
});

assert(totalQuestions >= 15, `Validated ${totalQuestions} exam MCQs across practicals`);
assert(questionsWithValidAnswer === totalQuestions, 'Every single question has a valid, in-bounds answer index');
assert(questionsWithExplanations === totalQuestions, 'Every question has an authoritative explanation');

console.log('================================================================');
console.log(`   TEST RESULTS: ${passedTests} PASSED, ${failedTests} FAILED   `);
console.log('================================================================');

if (failedTests > 0) {
  process.exit(1);
}
