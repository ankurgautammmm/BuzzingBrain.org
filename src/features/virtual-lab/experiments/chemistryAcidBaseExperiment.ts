import { PracticalExperiment } from '../types/laboratory';

export const CHEMISTRY_ACID_BASE_EXPERIMENT: PracticalExperiment = {
  id: 'c10_acid_base_indicators',
  title: 'Determination of pH & Acid-Base Indicator Behaviour of Chemical Samples',
  subject: 'Chemistry',
  classGrade: 'Class 10',
  chapter: 'Acids, Bases and Salts',
  examTags: ['cbse', 'neet', 'cuet'],
  estimatedDurationMinutes: 25,
  has3D: true,
  hasCalculations: true,
  learningObjectives: [
    'Observe characteristic color changes of natural and synthetic indicators in acidic, neutral, and alkaline solutions.',
    'Differentiate between strong acids (HCl), weak organic acids (CH3COOH, citric acid), neutral water, and strong alkalis (NaOH).',
    'Understand logarithmic hydronium ion concentration [H+] and calculate pH from molar concentration.',
    'Identify endpoint colors for Phenolphthalein (colorless in acid, magenta in base) and Methyl Orange (red in acid, yellow in base).'
  ],
  prerequisites: [
    'Concept of Arrhenius acids (furnishing H+ in water) and Arrhenius bases (furnishing OH- in water).',
    'Definition of indicators as weak organic acids or bases whose conjugated forms exhibit different absorption wavelengths.',
    'Basic knowledge of laboratory glassware safety.'
  ],
  scientificPrinciple: `Indicators are weak organic acids (HIn) or bases that dissociate partially in aqueous media:
HIn (Color A) ⇌ H+ + In- (Color B)
In acidic medium, high [H3O+] shifts the equilibrium to the left via Le Chatelier’s principle, displaying the color of undissociated HIn.
In basic medium, OH- ions consume H3O+ ions, driving equilibrium to the right and revealing the vibrant ionized In- color.
The pH scale is defined as the negative logarithm of hydrogen ion activity: pH = -log10[H+].`,
  curriculumReference: 'NCERT Class 10 Science Chapter 2 (Acids, Bases and Salts) & CBSE Practical Manual Experiment 1',
  apparatus: [
    {
      id: 'test_tubes',
      name: 'Borosilicate Test Tubes (Set of 5)',
      category: 'glassware',
      description: 'Rimmed heat-resistant borosilicate glass tubes for reacting liquid reagents.',
      purpose: 'Holding individual aliquot samples during indicator testing.',
      safetyNote: 'Inspect for chips and cracks before dispensing corrosive solutions.'
    },
    {
      id: 'dropper',
      name: 'Calibrated Glass Dropper with Rubber Bulb',
      category: 'glassware',
      description: 'Precision dropper delivering approximately 0.05 mL per drop.',
      purpose: 'Dispensing exact drop counts of indicators without cross-contamination.'
    },
    {
      id: 'ph_paper_strip',
      name: 'Full-Range Universal pH Strip Booklet (pH 1–14)',
      category: 'chemical',
      description: 'Cellulose strip impregnated with mixed indicators (thymol blue, methyl red, bromothymol blue, phenolphthalein).',
      purpose: 'Immediate visual colorimetric comparison against standard reference chart.'
    },
    {
      id: 'reagents_stand',
      name: 'Chemical Reagent Stand',
      category: 'chemical',
      description: 'Dropper bottles containing 0.1 M Dilute HCl, 0.1 M Dilute NaOH, 0.1 M Ethanoic Acid, Fresh Lemon Juice, and Deionized Distilled Water.',
      purpose: 'Providing standard test solutions across the full pH spectrum.'
    }
  ],
  procedureSteps: [
    {
      stepNumber: 1,
      title: 'Setup Test Tubes & Label Aliquots',
      actionPrompt: 'Arrange 5 clean, dry test tubes on the test tube rack labeled A, B, C, D, and E.',
      apparatusUsed: ['Test Tubes', 'Test Tube Rack'],
      scientificReason: 'Prevents cross-contamination and maintains systematic record of chemical specimens.',
      expectedObservation: 'Clear, empty borosilicate tubes ready for dispensing.',
      precautions: 'Ensure tubes are rinsed with distilled water and inverted to dry.',
      commonMistakes: 'Using wet tubes with residual tap water alters solution concentration.'
    },
    {
      stepNumber: 2,
      title: 'Dispense Standard Solutions (5 mL each)',
      actionPrompt: 'Add 5 mL of 0.1M Dilute HCl to Tube A, 0.1M Dilute NaOH to Tube B, 0.1M Acetic Acid to Tube C, Lemon Juice to Tube D, and Distilled Water to Tube E.',
      apparatusUsed: ['Measuring Cylinder', 'Chemical Reagent Bottles'],
      scientificReason: 'Provides samples with known theoretical pH: 1.0 (strong acid), 13.0 (strong base), 2.9 (weak acid), 2.3 (organic acid), and 7.0 (neutral).',
      expectedObservation: 'Colorless, transparent liquids in all five test tubes.',
      precautions: 'Wear protective goggles. Avoid skin contact with 0.1 M NaOH (caustic) and 0.1 M HCl.',
      commonMistakes: 'Mixing pipette tips across bottles ruins the stock reagents.'
    },
    {
      stepNumber: 3,
      title: 'Add Phenolphthalein Indicator (2 Drops)',
      actionPrompt: 'Using clean dropper, add 2 drops of alcoholic phenolphthalein into each tube and gently swirl.',
      apparatusUsed: ['Glass Dropper', 'Phenolphthalein Dropper Bottle'],
      scientificReason: 'Phenolphthalein transition range is pH 8.2–10.0. Below 8.2 it remains colorless; above 10.0 its quinonoid structure turns intense pink.',
      expectedObservation: 'Tube B (NaOH) turns vivid magenta-pink. Tubes A, C, D, and E remain completely colorless.',
      precautions: 'Do not add excess indicator (more than 3 drops) as indicators are weak acids that alter solution pH.',
      commonMistakes: 'Concluding that colorless means neutral (colorless occurs in both acids and neutral water).'
    },
    {
      stepNumber: 4,
      title: 'Test with Methyl Orange Indicator (2 Drops)',
      actionPrompt: 'Test fresh aliquots with 2 drops of methyl orange solution.',
      apparatusUsed: ['Glass Dropper', 'Methyl Orange Solution'],
      scientificReason: 'Methyl orange transition range is pH 3.1 (red) to 4.4 (yellow). In strong acids (pH < 3.1) it forms red benzenoid cation; above 4.4 it is yellow.',
      expectedObservation: 'Tubes A (HCl), C (CH3COOH), and D (Lemon juice) turn distinct red/pink-red. Tube E (Water) and Tube B (NaOH) appear distinct yellow.',
      precautions: 'Observe against a clean white tile under diffuse white light.',
      commonMistakes: 'Confusing the orange intermediate hue with a definitive endpoint.'
    },
    {
      stepNumber: 5,
      title: 'Universal Indicator & Digital pH Verification',
      actionPrompt: 'Immerse universal pH strip or add universal indicator to read precise pH colorimetric scale.',
      apparatusUsed: ['Universal pH Strip', 'Color Comparison Card'],
      scientificReason: 'Universal indicator blends several dyes to provide continuous spectrum: Red (pH 1-3), Orange/Yellow (pH 4-6), Green (pH 7-8), Blue (pH 9-11), Violet (pH 12-14).',
      expectedObservation: 'Tube A: Deep Red (pH 1.0); Tube B: Violet (pH 13.0); Tube C: Orange (pH 2.9); Tube D: Pinkish-Orange (pH 2.4); Tube E: Emerald Green (pH 7.0).',
      precautions: 'Read paper strip within 10 seconds of immersion before dye diffuses into bulk liquid.',
      commonMistakes: 'Touching the reagent end of the pH strip with bare fingers.'
    }
  ],
  formulas: [
    {
      name: 'Hydronium Ion Concentration to pH',
      equation: 'pH = -\\log_{10}[H_3O^+]',
      explanation: 'Sørensen pH scale formula relating molar hydrogen ion activity to a convenient logarithmic scale.',
      conditions: 'Dilute aqueous solutions at 25°C where activity coefficient f_H+ ≈ 1.0.',
      symbols: [
        { symbol: 'pH', definition: 'Potential of Hydrogen (dimensionless measure)', unit: 'None' },
        { symbol: '[H_3O^+]', definition: 'Molar concentration of hydronium ions', unit: 'mol/L (M)' }
      ],
      workedExample: {
        inputs: '[H_3O^+] = 0.10 M for dilute hydrochloric acid (completely dissociated monoprotic acid).',
        steps: [
          'Identify formula: pH = -log10[H+]',
          'Substitute molarity: pH = -log10(1.0 × 10^-1)',
          'Calculate log: -(-1.0) = 1.00'
        ],
        result: 'pH = 1.00 (Strongly Acidic)'
      }
    },
    {
      name: 'Ion Product of Water & Alkaline pOH',
      equation: 'pH + pOH = 14.00 \\quad \\text{at } 25^\\circ\\text{C}',
      explanation: 'Derived from water auto-ionization constant Kw = [H+][OH-] = 1.0 × 10^-14 at 298.15 K.',
      conditions: 'Neutral, acidic, or basic aqueous solutions at 25°C.',
      symbols: [
        { symbol: 'pOH', definition: 'Potential of Hydroxide ion: -log10[OH-]', unit: 'None' },
        { symbol: 'K_w', definition: 'Ionic product of pure water (1.0 × 10^-14)', unit: 'mol^2/L^2' }
      ],
      workedExample: {
        inputs: '[OH-] = 0.10 M for 0.1M NaOH solution.',
        steps: [
          'Calculate pOH = -log10[OH-] = -log10(10^-1) = 1.00',
          'Use Kw relation: pH = 14.00 - pOH = 14.00 - 1.00 = 13.00'
        ],
        result: 'pH = 13.00 (Strongly Alkaline)'
      }
    }
  ],
  observationColumns: [
    { key: 'sample', label: 'Sample Chemical Solution', type: 'text', readOnly: true },
    { key: 'phenolphthalein', label: 'Phenolphthalein Color', type: 'text' },
    { key: 'methylOrange', label: 'Methyl Orange Color', type: 'text' },
    { key: 'universalColor', label: 'Universal Indicator Hue', type: 'text' },
    { key: 'estimatedPh', label: 'Measured pH', type: 'number', unit: 'pH' },
    { key: 'nature', label: 'Inferred Chemical Nature', type: 'text' }
  ],
  defaultObservations: [
    { id: 'obs_1', sample: '0.1M Dilute HCl (Tube A)', phenolphthalein: 'Colorless', methylOrange: 'Red', universalColor: 'Deep Crimson Red', estimatedPh: 1.05, nature: 'Strong Acid' },
    { id: 'obs_2', sample: '0.1M Dilute NaOH (Tube B)', phenolphthalein: 'Vivid Pink / Magenta', methylOrange: 'Golden Yellow', universalColor: 'Deep Violet', estimatedPh: 13.10, nature: 'Strong Base' },
    { id: 'obs_3', sample: '0.1M Acetic Acid (Tube C)', phenolphthalein: 'Colorless', methylOrange: 'Reddish Orange', universalColor: 'Orange', estimatedPh: 2.88, nature: 'Weak Acid' },
    { id: 'obs_4', sample: 'Fresh Lemon Juice (Tube D)', phenolphthalein: 'Colorless', methylOrange: 'Pinkish Red', universalColor: 'Pinkish Orange', estimatedPh: 2.35, nature: 'Moderate Organic Acid' },
    { id: 'obs_5', sample: 'Distilled Water (Tube E)', phenolphthalein: 'Colorless', methylOrange: 'Yellow', universalColor: 'Forest Green', estimatedPh: 7.02, nature: 'Neutral' }
  ],
  quizQuestions: [
    {
      id: 'q_chem_1',
      question: 'A student adds 2 drops of phenolphthalein to an unknown liquid in a beaker. The liquid turns bright magenta-pink. What can definitely be inferred?',
      options: [
        'The solution is strongly acidic with pH < 3.0',
        'The solution is alkaline with pH > 8.2',
        'The solution is pure neutral distilled water',
        'The solution contains dissolved calcium sulfate'
      ],
      correctAnswer: 1,
      explanation: 'Phenolphthalein is colorless in acidic and neutral media (pH < 8.2). It undergoes structural rearrangement into a resonance-stabilized quinonoid dianion above pH 8.2, producing a vivid pink-magenta color in alkaline solutions.',
      distractorExplanations: [
        'Acids keep phenolphthalein strictly colorless, never pink.',
        'Correct answer: pH > 8.2 confirms alkalinity.',
        'Neutral water produces no color change with phenolphthalein (remains colorless).',
        'Calcium sulfate does not impart characteristic alkaline phenolphthalein coloration unless basic hydroxide ions are present.'
      ],
      topicTag: 'Indicators & pH',
      difficulty: 'easy',
      hint: 'Recall the pH range in which phenolphthalein turns pink.',
      examTarget: ['cbse', 'neet']
    },
    {
      id: 'q_chem_2',
      question: 'Which of the following indicators turns red in 0.1 M Dilute HCl and yellow in 0.1 M Dilute NaOH?',
      options: [
        'Phenolphthalein',
        'Methyl Orange',
        'Turmeric paper',
        'Red litmus solution'
      ],
      correctAnswer: 1,
      explanation: 'Methyl orange has an azo dye structure. In acidic solutions (pH < 3.1) it accepts a proton to form a red dipolar cation. In neutral and alkaline solutions (pH > 4.4) it deprotonates to yield a bright yellow azo anion.',
      distractorExplanations: [
        'Phenolphthalein is colorless in acid and pink in base.',
        'Correct answer: Methyl orange transitions from red in acid to yellow in alkaline media.',
        'Turmeric remains yellow in acid and turns reddish-brown in base.',
        'Red litmus remains red in acid and turns blue in base.'
      ],
      topicTag: 'Synthetic Indicators',
      difficulty: 'medium',
      hint: 'This azo dye is widely used in acid-base titration of strong acids with weak bases.',
      examTarget: ['cbse', 'neet', 'cuet']
    },
    {
      id: 'q_chem_3',
      question: 'What is the pH of a 0.001 M aqueous hydrochloric acid (HCl) solution at 25°C assuming complete dissociation?',
      options: [
        '1.0',
        '2.0',
        '3.0',
        '11.0'
      ],
      correctAnswer: 2,
      explanation: 'HCl is a strong monoprotic acid that fully ionizes: [H+] = [HCl] = 0.001 M = 1.0 × 10^-3 M. Therefore, pH = -log10(10^-3) = -(-3) = 3.0.',
      distractorExplanations: [
        '1.0 corresponds to 0.1 M HCl.',
        '2.0 corresponds to 0.01 M HCl.',
        'Correct answer: -log10(0.001) = 3.0.',
        '11.0 is basic and would correspond to pOH = 3 in a basic solution.'
      ],
      topicTag: 'pH Calculations',
      difficulty: 'medium',
      hint: 'Express 0.001 in scientific notation as 10 to a negative power.',
      examTarget: ['cbse', 'neet', 'jee_main']
    },
    {
      id: 'q_chem_4',
      question: 'Dry HCl gas is passed over dry blue litmus paper, and no color change is observed. However, when passed over moist blue litmus paper, it turns red immediately. Why?',
      options: [
        'Water acts as a catalyst for oxidation of HCl gas.',
        'HCl molecules only ionize into H3O+ (hydronium) ions in the presence of water molecules.',
        'Litmus dye requires moisture to vaporize.',
        'Dry HCl gas is basic while wet HCl gas is acidic.'
      ],
      correctAnswer: 1,
      explanation: 'Acidic properties stem exclusively from hydrated hydrogen ions (H3O+). Dry gaseous HCl consists of covalent polar molecules. Only in an aqueous medium do dipole-dipole interactions overcome the H-Cl bond to release H+ ions which hydrate to form H3O+.',
      distractorExplanations: [
        'Water is a protic solvent facilitating ionization, not an oxidation catalyst.',
        'Correct: Acidic ionization requires polar water molecules to form hydronium ions.',
        'Litmus dye is fixed on cellulose fibers and does not vaporize.',
        'HCl is never chemically basic.'
      ],
      topicTag: 'Ionization & Hydronium',
      difficulty: 'hard',
      hint: 'Think about what species actually reacts with the indicator dye: covalent HCl or hydronium ions?',
      examTarget: ['cbse', 'neet']
    },
    {
      id: 'q_chem_5',
      question: 'A universal indicator solution is added to distilled water at 25°C. What color does the solution display?',
      options: [
        'Cherry Red',
        'Bright Yellow',
        'Forest Green',
        'Deep Violet'
      ],
      correctAnswer: 2,
      explanation: 'At 25°C, pure distilled water has [H+] = [OH-] = 1.0 × 10^-7 M, yielding neutral pH 7.00. Universal indicator is calibrated to produce a neutral forest green hue between pH 6.8 and 7.2.',
      distractorExplanations: [
        'Cherry red occurs at pH 1–2 (strong acid).',
        'Bright yellow occurs at weakly acidic pH 4–5.',
        'Correct: Green signifies neutrality on the universal indicator spectrum.',
        'Deep violet occurs in strongly alkaline media (pH 12–14).'
      ],
      topicTag: 'Universal Indicator',
      difficulty: 'easy',
      hint: 'Look at the center of the standard VIBGYOR-reversed universal indicator chart.',
      examTarget: ['cbse', 'cuet']
    }
  ],
  vivaQuestions: [
    {
      question: 'Why does universal indicator provide more practical information than litmus paper?',
      answer: 'Litmus paper is a binary indicator showing only whether a solution is acidic or basic. Universal indicator is a cocktail of several indicators that changes color continuously across the 1–14 scale, allowing accurate estimation of the actual numeric pH value.',
      examRelevance: 'CBSE Class 10 Board Practical Viva (2 Marks)'
    },
    {
      question: 'What is the effect of dilution on the pH of an acidic solution?',
      answer: 'Adding water decreases the concentration of [H3O+] per unit volume. As [H3O+] decreases, -log10[H3O+] increases toward 7.00. However, dilution can never make an acid neutral or basic (pH asymptotically approaches 7 at 25°C).',
      examRelevance: 'NEET Chemistry Concepts'
    },
    {
      question: 'Why does tooth enamel corrode when mouth pH falls below 5.5?',
      answer: 'Tooth enamel consists of calcium hydroxyapatite [Ca5(PO4)3(OH)], which is a basic crystalline salt. When bacterial degradation of sugars produces mouth acids lowering pH below 5.5, the acid dissolves the hydroxyapatite mineral matrix (demineralization).',
      examRelevance: 'NCERT Class 10 Board High Frequency Question'
    }
  ],
  simulatedModelNotes: 'The 3D Chemistry laboratory simulates volumetric aliquots, authentic capillary drop detachment, refractive liquid surfaces, and exact spectrophotometric CIE-RGB color mapping based on tabulated pH and indicator dissociation equilibria.'
};
