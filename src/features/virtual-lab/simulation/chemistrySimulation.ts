/**
 * Chemistry Acid-Base Simulation Engine
 * Calculates authentic pH, hydronium concentration, and indicator color transitions.
 */

export interface ChemicalSample {
  id: string;
  name: string;
  formula: string;
  molarity: number;
  theoreticalPh: number;
  nature: 'Strong Acid' | 'Weak Acid' | 'Neutral' | 'Strong Base';
  liquidColor: string; // Base liquid tint (hex)
}

export const CHEMICAL_SAMPLES: ChemicalSample[] = [
  { id: 'sample_hcl', name: 'Dilute Hydrochloric Acid', formula: '0.1 M HCl', molarity: 0.1, theoreticalPh: 1.05, nature: 'Strong Acid', liquidColor: '#e0f2fe' },
  { id: 'sample_naoh', name: 'Dilute Sodium Hydroxide', formula: '0.1 M NaOH', molarity: 0.1, theoreticalPh: 13.10, nature: 'Strong Base', liquidColor: '#f1f5f9' },
  { id: 'sample_acetic', name: 'Dilute Ethanoic (Acetic) Acid', formula: '0.1 M CH3COOH', molarity: 0.1, theoreticalPh: 2.88, nature: 'Weak Acid', liquidColor: '#fef3c7' },
  { id: 'sample_lemon', name: 'Fresh Lemon Juice (Citric Acid)', formula: 'C6H8O7 ~5%', molarity: 0.05, theoreticalPh: 2.35, nature: 'Weak Acid', liquidColor: '#fef08a' },
  { id: 'sample_water', name: 'Pure Distilled Water', formula: 'H2O (Deionized)', molarity: 55.5, theoreticalPh: 7.02, nature: 'Neutral', liquidColor: '#f8fafc' },
];

export type IndicatorType = 'none' | 'phenolphthalein' | 'methyl_orange' | 'universal';

export interface ReactionResult {
  developedColorName: string;
  developedColorHex: string;
  measuredPh: number;
  hydroniumConc: string;
  scientificExplanation: string;
}

export function computeIndicatorReaction(sample: ChemicalSample, indicator: IndicatorType, dropsAdded: number): ReactionResult {
  const ph = sample.theoreticalPh;
  const hConc = Math.pow(10, -ph).toExponential(2);

  if (dropsAdded === 0 || indicator === 'none') {
    return {
      developedColorName: 'Clear / Natural Solution',
      developedColorHex: sample.liquidColor,
      measuredPh: ph,
      hydroniumConc: `${hConc} M`,
      scientificExplanation: 'No indicator added yet. Liquid exhibits natural color and clarity.'
    };
  }

  if (indicator === 'phenolphthalein') {
    if (ph >= 8.2) {
      return {
        developedColorName: 'Vivid Magenta / Pink',
        developedColorHex: '#f43f5e',
        measuredPh: ph,
        hydroniumConc: `${hConc} M`,
        scientificExplanation: 'Alkaline pH (> 8.2) causes phenolphthalein to lose protons and form its quinonoid resonance structure, reflecting intense pink/magenta light.'
      };
    } else {
      return {
        developedColorName: 'Colorless Transparent',
        developedColorHex: '#f1f5f9',
        measuredPh: ph,
        hydroniumConc: `${hConc} M`,
        scientificExplanation: 'In acidic and neutral solutions (pH < 8.2), phenolphthalein remains in its neutral lactone form, which absorbs only in ultraviolet and appears completely colorless.'
      };
    }
  }

  if (indicator === 'methyl_orange') {
    if (ph < 3.1) {
      return {
        developedColorName: 'Deep Crimson Red',
        developedColorHex: '#dc2626',
        measuredPh: ph,
        hydroniumConc: `${hConc} M`,
        scientificExplanation: 'Strong acidity (pH < 3.1) protonates methyl orange into a red quinonoid cation.'
      };
    } else if (ph <= 4.4) {
      return {
        developedColorName: 'Warm Orange',
        developedColorHex: '#ea580c',
        measuredPh: ph,
        hydroniumConc: `${hConc} M`,
        scientificExplanation: 'Transition range (pH 3.1–4.4): both protonated red cation and deprotonated yellow anion coexist.'
      };
    } else {
      return {
        developedColorName: 'Bright Golden Yellow',
        developedColorHex: '#eab308',
        measuredPh: ph,
        hydroniumConc: `${hConc} M`,
        scientificExplanation: 'In weakly acidic, neutral, and alkaline solutions (pH > 4.4), the yellow azo sulfonate anion dominates.'
      };
    }
  }

  // Universal Indicator
  if (ph < 2.0) {
    return { developedColorName: 'Deep Red (pH 1)', developedColorHex: '#b91c1c', measuredPh: ph, hydroniumConc: `${hConc} M`, scientificExplanation: 'Strong acid (pH ~1): Thymol blue & methyl red acidic forms dominate.' };
  } else if (ph < 4.0) {
    return { developedColorName: 'Orange-Red (pH 2–3)', developedColorHex: '#ea580c', measuredPh: ph, hydroniumConc: `${hConc} M`, scientificExplanation: 'Moderate organic acid (pH ~2.5).' };
  } else if (ph < 6.0) {
    return { developedColorName: 'Yellow-Orange (pH 4–5)', developedColorHex: '#f59e0b', measuredPh: ph, hydroniumConc: `${hConc} M`, scientificExplanation: 'Weak acid.' };
  } else if (ph <= 7.5) {
    return { developedColorName: 'Emerald Green (pH 7)', developedColorHex: '#10b981', measuredPh: ph, hydroniumConc: `${hConc} M`, scientificExplanation: 'Neutral solution: Bromothymol blue neutral green transition.' };
  } else if (ph < 10.0) {
    return { developedColorName: 'Blue (pH 8–9)', developedColorHex: '#2563eb', measuredPh: ph, hydroniumConc: `${hConc} M`, scientificExplanation: 'Mildly alkaline.' };
  } else {
    return { developedColorName: 'Deep Violet (pH 12–14)', developedColorHex: '#7c3aed', measuredPh: ph, hydroniumConc: `${hConc} M`, scientificExplanation: 'Strong base (pH > 12): Phenolphthalein & thymol blue alkaline forms produce deep purple.' };
  }
}
