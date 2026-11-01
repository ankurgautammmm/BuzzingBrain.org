/**
 * Interactive Virtual Science Labs, 3D Organs & Mind Maps Library Data
 * Academic Session 2026-27 (NCERT & CBSE Aligned)
 */

export interface MindMapNode {
  id: string;
  label: string;
  description: string;
  formula?: string;
  examAlert?: string;
  children?: MindMapNode[];
}

export interface MindMapItem {
  id: string;
  title: string;
  subject: 'Physics' | 'Chemistry' | 'Biology' | 'Mathematics';
  classGrade: 'Class 9' | 'Class 10' | 'Class 11' | 'Class 12';
  chapter: string;
  rootNode: MindMapNode;
}

export interface OrganPartInfo {
  id: string;
  name: string;
  function: string;
  details: string;
  ncertReference: string;
  color: string;
}

export interface VisualOrganModel {
  id: string;
  name: string;
  system: string;
  subject: string;
  classGrade: string;
  description: string;
  parts: OrganPartInfo[];
  diagramType: 'heart' | 'brain' | 'eye' | 'nephron' | 'cell' | 'lungs' | 'dna';
}

export interface VirtualToolSpecimen {
  id: string;
  name: string;
  type: string;
  description: string;
  keyFeatures: string[];
  recommendedMagnification: string;
}

export interface VirtualTool {
  id: string;
  name: string;
  category: 'Biology' | 'Physics' | 'Chemistry';
  description: string;
  syllabusTopic: string;
  toolType: 'microscope' | 'chemical_balance' | 'ph_meter' | 'vernier' | 'titration' | 'optics_bench' | 'breadboard' | 'pendulum' | 'flame_test';
  specimens?: VirtualToolSpecimen[];
}

// ==========================================
// 1. HUGE MIND MAPS LIBRARY
// ==========================================
export const MIND_MAPS_LIBRARY: MindMapItem[] = [
  // 1. Class 10 Science - Electricity
  {
    id: 'mm-10-sci-electricity',
    title: 'Electricity & Circuits (Comprehensive)',
    subject: 'Physics',
    classGrade: 'Class 10',
    chapter: 'Electricity',
    rootNode: {
      id: 'root-elec',
      label: 'Electricity & Circuits',
      description: 'Fundamental principles of charge, potential, current, resistance and heating effects',
      children: [
        {
          id: 'elec-charge',
          label: 'Electric Charge & Current',
          description: 'Charge (Q = n·e) measured in Coulombs; Current (I = Q/t) measured in Amperes by Ammeter in series.',
          formula: 'I = Q / t  [1 A = 1 C / 1 s]',
          examAlert: 'Ammeter always in series; Voltmeter always in parallel!',
          children: [
            {
              id: 'elec-drift',
              label: 'Electron Drift & Direction',
              description: 'Conventional current flows from Positive to Negative (+ to -), opposite to actual electron drift (- to +).'
            },
            {
              id: 'elec-pot',
              label: 'Electric Potential Difference (V)',
              description: 'Work done in moving unit positive charge between two terminals.',
              formula: 'V = W / Q  [1 Volt = 1 Joule / 1 Coulomb]'
            }
          ]
        },
        {
          id: 'elec-ohms',
          label: "Ohm's Law & Resistance",
          description: 'Potential difference across metallic conductor is directly proportional to current at constant temperature.',
          formula: 'V = I · R  [Resistance R in Ohms Ω]',
          children: [
            {
              id: 'elec-factors',
              label: 'Factors Affecting Resistance',
              description: 'Directly proportional to length (L), inversely to area of cross-section (A), and material resistivity (ρ).',
              formula: 'R = ρ · (L / A)'
            },
            {
              id: 'elec-resistivity',
              label: 'Resistivity (ρ)',
              description: 'Characteristic property of material. Metals have low ρ (~10^-8 Ω·m), alloys have high ρ (used in heaters), insulators have huge ρ (~10^12 Ω·m).'
            }
          ]
        },
        {
          id: 'elec-comb',
          label: 'Resistor Networks',
          description: 'Series (same current, cumulative voltage) vs Parallel (same voltage, shared current).',
          children: [
            {
              id: 'elec-series',
              label: 'Series Combination',
              description: 'Total resistance is maximum: Rs = R1 + R2 + R3. If one component fails, circuit breaks.',
              formula: 'R_s = R_1 + R_2 + R_3'
            },
            {
              id: 'elec-parallel',
              label: 'Parallel Combination',
              description: 'Total resistance is minimum: 1/Rp = 1/R1 + 1/R2 + 1/R3. Used in domestic household wiring so devices run independently.',
              formula: '1/R_p = 1/R_1 + 1/R_2 + 1/R_3'
            }
          ]
        },
        {
          id: 'elec-heat',
          label: "Joule's Law of Heating & Power",
          description: 'Heat generated in a resistor is proportional to square of current, resistance, and time duration.',
          formula: 'H = I² · R · t  |  P = V · I = I² · R = V² / R',
          children: [
            {
              id: 'elec-kwh',
              label: 'Commercial Unit of Energy',
              description: '1 Kilowatt-hour (kWh) = 1 Unit = 3.6 × 10^6 Joules.',
              formula: '1 kWh = 3.6 × 10⁶ J'
            },
            {
              id: 'elec-fuse',
              label: 'Electric Fuse',
              description: 'Safety device with low melting point placed in series with live wire to prevent overload.'
            }
          ]
        }
      ]
    }
  },

  // 2. Class 10 Science - Light: Reflection and Refraction
  {
    id: 'mm-10-sci-light',
    title: 'Light – Reflection and Refraction',
    subject: 'Physics',
    classGrade: 'Class 10',
    chapter: 'Light – Reflection and Refraction',
    rootNode: {
      id: 'root-light',
      label: 'Optics: Reflection & Refraction',
      description: 'Geometrical optics governing spherical mirrors, lenses, sign conventions, and refractive indices',
      children: [
        {
          id: 'light-reflection',
          label: 'Reflection by Spherical Mirrors',
          description: 'Concave mirrors (converging, forms real/inverted or virtual/erect) vs Convex mirrors (diverging, always virtual/erect/diminished, used as rear-view mirrors).',
          formula: '1/f = 1/v + 1/u  |  m = -v/u = h_i/h_o',
          children: [
            {
              id: 'light-focal',
              label: 'Focal Length & Radius',
              description: 'For spherical mirrors of small aperture, radius of curvature is twice focal length.',
              formula: 'f = R / 2'
            },
            {
              id: 'light-cartesian',
              label: 'New Cartesian Sign Convention',
              description: 'Pole (P) is origin. Distances measured against incident light are negative (u is always negative). Focal length of concave is negative, convex is positive.'
            }
          ]
        },
        {
          id: 'light-refraction',
          label: "Refraction & Snell's Law",
          description: 'Bending of light rays at interface between two transparent media of differing optical densities.',
          formula: 'n = c / v  |  n₂₁ = sin i / sin r',
          children: [
            {
              id: 'light-snell',
              label: "Snell's Law of Refraction",
              description: 'Ratio of sine of angle of incidence to sine of angle of refraction is constant for given pair of media.'
            },
            {
              id: 'light-slab',
              label: 'Refraction through Glass Slab',
              description: 'Emergent ray is parallel to incident ray with lateral displacement.'
            }
          ]
        },
        {
          id: 'light-lenses',
          label: 'Lenses & Power of Lens',
          description: 'Convex lens (converging, f positive) vs Concave lens (diverging, f negative).',
          formula: '1/f = 1/v - 1/u  |  m = v/u  |  P = 1/f(m)  [Dioptres D]',
          children: [
            {
              id: 'light-power',
              label: 'Power of a Lens (P)',
              description: 'Reciprocal of focal length in metres. 1 Dioptre (1 D) = power of lens with f = 1 m.',
              formula: 'P = P₁ + P₂ + P₃'
            }
          ]
        }
      ]
    }
  },

  // 3. Class 10 Science - Chemical Reactions & Equations
  {
    id: 'mm-10-sci-chem-rxn',
    title: 'Chemical Reactions and Equations',
    subject: 'Chemistry',
    classGrade: 'Class 10',
    chapter: 'Chemical Reactions and Equations',
    rootNode: {
      id: 'root-chem-rxn',
      label: 'Chemical Reactions and Equations',
      description: 'Balancing equations, types of chemical reactions, redox processes, and oxidation prevention',
      children: [
        {
          id: 'chem-types',
          label: 'Classification of Chemical Reactions',
          description: '5 major standard reaction categories based on reactant rearrangement and bonds.',
          children: [
            {
              id: 'chem-comb',
              label: 'Combination Reaction',
              description: 'Two or more reactants combine to form a single product.',
              formula: 'CaO (quicklime) + H₂O → Ca(OH)₂ (slaked lime) + Heat'
            },
            {
              id: 'chem-decomp',
              label: 'Decomposition Reaction',
              description: 'Single reactant breaks down into two or more simpler products (Thermal, Electrolytic, Photolytic).',
              formula: '2FeSO₄(s) --Δ--> Fe₂O₃(s) + SO₂(g) + SO₃(g) | 2AgCl --sunlight--> 2Ag + Cl₂'
            },
            {
              id: 'chem-disp',
              label: 'Displacement Reaction',
              description: 'More reactive element displaces less reactive element from its aqueous salt solution.',
              formula: 'Fe(s) + CuSO₄(aq) [blue] → FeSO₄(aq) [pale green] + Cu(s) [reddish-brown]'
            },
            {
              id: 'chem-doub-disp',
              label: 'Double Displacement (Precipitation)',
              description: 'Mutual exchange of ions between reactants yielding an insoluble solid precipitate.',
              formula: 'Na₂SO₄(aq) + BaCl₂(aq) → BaSO₄(s)↓ [white ppt] + 2NaCl(aq)'
            }
          ]
        },
        {
          id: 'chem-redox',
          label: 'Redox Reactions (Oxidation & Reduction)',
          description: 'Simultaneous loss/gain of electrons or oxygen/hydrogen atoms.',
          children: [
            {
              id: 'chem-ox-red',
              label: 'Oxidation vs Reduction',
              description: 'Oxidation = Gain of Oxygen or Loss of Hydrogen / Electrons. Reduction = Gain of Hydrogen / Electrons or Loss of Oxygen.',
              formula: 'CuO + H₂ --Δ--> Cu + H₂O  [CuO reduced to Cu; H₂ oxidized to H₂O]'
            },
            {
              id: 'chem-corrosion',
              label: 'Corrosion & Rancidity',
              description: 'Corrosion: Oxidation of metals by moisture and acids (Rust: Fe₂O₃·xH₂O). Rancidity: Oxidation of fats and oils leading to foul odor and taste (prevented by antioxidants, N₂ flushing).'
            }
          ]
        }
      ]
    }
  },

  // 4. Class 10 Science - Life Processes
  {
    id: 'mm-10-sci-life-proc',
    title: 'Life Processes (Nutrition, Respiration, Transport, Excretion)',
    subject: 'Biology',
    classGrade: 'Class 10',
    chapter: 'Life Processes',
    rootNode: {
      id: 'root-life-proc',
      label: 'Life Processes',
      description: 'The four fundamental physiological mechanisms maintaining homeostasis in living organisms',
      children: [
        {
          id: 'bio-nutrition',
          label: 'Nutrition (Autotrophic & Heterotrophic)',
          description: 'Modes of obtaining and synthesizing nourishment for energy and biomass.',
          children: [
            {
              id: 'bio-photo',
              label: 'Photosynthesis (Autotrophs)',
              description: 'Conversion of solar energy to chemical energy by chlorophyll in chloroplasts.',
              formula: '6CO₂ + 12H₂O --light/chlorophyll--> C₆H₁₂O₆ + 6O₂ + 6H₂O'
            },
            {
              id: 'bio-digestion',
              label: 'Human Alimentary Canal',
              description: 'Mouth (salivary amylase) → Stomach (HCl, Pepsin, Mucus) → Small Intestine (Bile, Trypsin, Lipase; villi absorption) → Large Intestine.'
            }
          ]
        },
        {
          id: 'bio-respiration',
          label: 'Respiration & ATP Generation',
          description: 'Biochemical oxidation of glucose to release cellular energy.',
          children: [
            {
              id: 'bio-glycolysis',
              label: 'Breakdown of Glucose Pathway',
              description: 'Glucose (6C) in cytoplasm → Pyruvate (3C). Aerobic in Mitochondria (CO₂ + H₂O + 38 ATP). Anaerobic in Yeast (Ethanol + CO₂ + 2 ATP). Anaerobic in Muscle cells (Lactic acid + 2 ATP, causing cramps).'
            },
            {
              id: 'bio-human-resp',
              label: 'Human Respiratory System',
              description: 'Nostrils → Trachea (cartilaginous rings) → Bronchi → Alveoli (richly supplied with blood capillaries for thin-wall gas diffusion).'
            }
          ]
        },
        {
          id: 'bio-circulation',
          label: 'Transportation in Humans & Plants',
          description: 'Internal transport systems for oxygen, nutrients, water and minerals.',
          children: [
            {
              id: 'bio-heart',
              label: 'Human Heart & Double Circulation',
              description: '4 chambers (2 Atria, 2 Ventricles). Double circulation: Pulmonary circuit (heart-lungs-heart) + Systemic circuit (heart-body-heart). Prevents mixing of oxygenated & deoxygenated blood.'
            },
            {
              id: 'bio-xylem-phloem',
              label: 'Plant Vascular Tissues',
              description: 'Xylem (vessels and tracheids; unidirectional transpiration pull of water/minerals). Phloem (sieve tubes & companion cells; bidirectional translocation of sucrose using ATP).'
            }
          ]
        },
        {
          id: 'bio-excretion',
          label: 'Excretion in Humans & Plants',
          description: 'Removal of toxic metabolic nitrogenous waste (Urea, Uric acid).',
          children: [
            {
              id: 'bio-nephron',
              label: 'Human Nephron Filtration Unit',
              description: 'Glomerulus (ultrafiltration under pressure) → Bowman’s Capsule → PCT (selective reabsorption of glucose, amino acids, salts, water) → Henle’s loop → DCT → Collecting duct → Ureter → Urinary bladder.'
            }
          ]
        }
      ]
    }
  },

  // 5. Class 10 Mathematics - Quadratic Equations
  {
    id: 'mm-10-math-quad',
    title: 'Quadratic Equations & Roots',
    subject: 'Mathematics',
    classGrade: 'Class 10',
    chapter: 'Quadratic Equations',
    rootNode: {
      id: 'root-math-quad',
      label: 'Quadratic Equations',
      description: 'Polynomial equations of second degree ax² + bx + c = 0 (a ≠ 0)',
      children: [
        {
          id: 'math-std',
          label: 'Standard Form & Factorization',
          description: 'Standard form: ax² + bx + c = 0. Solving by splitting the middle term (product = ac, sum = b).',
          formula: 'ax² + bx + c = 0  (a ≠ 0)'
        },
        {
          id: 'math-formula',
          label: 'Quadratic Formula (Shreedharacharya)',
          description: 'Direct algebraic method to obtain real or complex roots.',
          formula: 'x = [-b ± √(b² - 4ac)] / (2a)'
        },
        {
          id: 'math-discriminant',
          label: 'Discriminant (D) & Nature of Roots',
          description: 'The quantity D = b² - 4ac dictates whether roots are real, equal, or imaginary.',
          formula: 'D = b² - 4ac',
          children: [
            {
              id: 'math-d-pos',
              label: 'Case 1: D > 0',
              description: 'Two distinct, unequal real roots: x = (-b + √D)/2a, (-b - √D)/2a.'
            },
            {
              id: 'math-d-zero',
              label: 'Case 2: D = 0',
              description: 'Two equal and coincident real roots: x = -b / (2a).'
            },
            {
              id: 'math-d-neg',
              label: 'Case 3: D < 0',
              description: 'No real roots (roots are complex conjugate pairs in higher classes).'
            }
          ]
        }
      ]
    }
  },

  // 6. Class 11 Physics - Laws of Motion
  {
    id: 'mm-11-phy-lom',
    title: 'Laws of Motion & Friction',
    subject: 'Physics',
    classGrade: 'Class 11',
    chapter: 'Laws of Motion',
    rootNode: {
      id: 'root-phy-lom',
      label: 'Newton’s Laws of Motion',
      description: 'Inertia, Momentum, Impulse, Equilibrium of Concurrent Forces, and Friction dynamics',
      children: [
        {
          id: 'lom-first',
          label: 'First Law (Law of Inertia)',
          description: 'A body remains at rest or in uniform straight-line motion unless acted upon by a non-zero net external force.',
          formula: 'ΣF = 0 ⟹ a = 0, v = constant'
        },
        {
          id: 'lom-second',
          label: 'Second Law (Fundamental Law)',
          description: 'Rate of change of linear momentum (p = mv) is directly proportional to applied force and occurs in direction of force.',
          formula: 'F = dp/dt = m · a  |  Impulse J = F · Δt = Δp'
        },
        {
          id: 'lom-third',
          label: 'Third Law & Momentum Conservation',
          description: 'To every action there is an equal and opposite reaction acting on two distinct bodies simultaneously.',
          formula: 'F_AB = -F_BA  |  m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂'
        },
        {
          id: 'lom-friction',
          label: 'Friction Dynamics',
          description: 'Contact force opposing relative motion. Static friction (self-adjusting up to limiting friction fs_max = μs·N) vs Kinetic friction (fk = μk·N).',
          formula: 'f_s ≤ μ_s · N  |  f_k = μ_k · N  (μ_k < μ_s)'
        }
      ]
    }
  },

  // 7. Class 11 Chemistry - Chemical Bonding
  {
    id: 'mm-11-chem-bonding',
    title: 'Chemical Bonding and Molecular Structure',
    subject: 'Chemistry',
    classGrade: 'Class 11',
    chapter: 'Chemical Bonding and Molecular Structure',
    rootNode: {
      id: 'root-chem-bond',
      label: 'Chemical Bonding',
      description: 'Forces holding atoms and ions together: Ionic, Covalent, VSEPR, Hybridization, and MOT',
      children: [
        {
          id: 'bond-ionic',
          label: 'Ionic & Covalent Bonds',
          description: 'Ionic: Electrostatic attraction between cations and anions (lattice energy). Covalent: Mutual sharing of electron pairs (Lewis structures).'
        },
        {
          id: 'bond-vsepr',
          label: 'VSEPR Theory',
          description: 'Valence Shell Electron Pair Repulsion dictates 3D molecular geometry. Repulsion order: Lone Pair-Lone Pair > Lone Pair-Bond Pair > Bond Pair-Bond Pair.'
        },
        {
          id: 'bond-hyb',
          label: 'Hybridization of Orbitals',
          description: 'Intermixing of atomic orbitals of comparable energy yielding degenerate hybrid orbitals (sp, sp², sp³, sp³d, sp³d²).'
        },
        {
          id: 'bond-mot',
          label: 'Molecular Orbital Theory (MOT)',
          description: 'Linear Combination of Atomic Orbitals (LCAO) giving Bonding (σ, π) and Antibonding (σ*, π*) orbitals. Bond Order = 1/2(Nb - Na).'
        }
      ]
    }
  },

  // 8. Class 12 Physics - Electric Charges and Fields
  {
    id: 'mm-12-phy-electro',
    title: 'Electric Charges and Fields (Electrostatics)',
    subject: 'Physics',
    classGrade: 'Class 12',
    chapter: 'Electric Charges and Fields',
    rootNode: {
      id: 'root-phy-electro',
      label: 'Electric Charges and Fields',
      description: "Coulomb's law, electric field lines, electric dipole moments, flux and Gauss's law applications",
      children: [
        {
          id: 'elec-coulomb',
          label: "Coulomb's Inverse Square Law",
          description: 'Electrostatic force between two stationary point charges in vacuum.',
          formula: 'F = (1 / 4πε₀) · (|q₁ · q₂| / r²)  [1/4πε₀ ≈ 9 × 10⁹ N·m²/C²]'
        },
        {
          id: 'elec-field',
          label: 'Electric Field & Dipole',
          description: 'Force experienced per unit positive test charge: E = F / q₀. Dipole moment p = q · 2a directed from negative to positive.',
          formula: 'E_axial = 2kp/r³  |  E_equatorial = kp/r³  |  τ = p × E'
        },
        {
          id: 'elec-gauss',
          label: "Gauss's Theorem & Applications",
          description: 'Total electric flux through any closed Gaussian surface equals 1/ε₀ times net enclosed charge.',
          formula: 'Φ = ∮ E · dA = q_enclosed / ε₀',
          children: [
            {
              id: 'gauss-line',
              label: 'Infinitely Long Straight Wire',
              description: 'E = λ / (2πε₀·r) where λ is linear charge density.'
            },
            {
              id: 'gauss-sheet',
              label: 'Infinite Thin Plane Sheet',
              description: 'E = σ / (2ε₀) where σ is surface charge density (independent of distance!).'
            }
          ]
        }
      ]
    }
  }
];

// ==========================================
// 2. 3D ORGANS & BIOLOGICAL SYSTEMS LIBRARY
// ==========================================
export const VISUAL_ORGAN_MODELS: VisualOrganModel[] = [
  // 1. Human Heart
  {
    id: 'organ-heart',
    name: 'Human Heart (Cardiovascular System)',
    system: 'Circulatory System',
    subject: 'Biology / Science',
    classGrade: 'Class 10 & Class 11',
    description: 'A muscular four-chambered pumping organ that coordinates double circulation in humans, maintaining unidirectional blood flow through precise atrioventricular and semilunar valves.',
    diagramType: 'heart',
    parts: [
      {
        id: 'p-ra',
        name: 'Right Atrium',
        function: 'Receives deoxygenated blood from superior and inferior vena cava',
        details: 'Thin-walled upper chamber. Collects systemic venous blood returning from head, torso and lower limbs.',
        ncertReference: 'NCERT Class 10 Science, Chapter 6: Life Processes, Sec 6.4 Transportation',
        color: '#2563eb'
      },
      {
        id: 'p-rv',
        name: 'Right Ventricle',
        function: 'Pumps deoxygenated blood into pulmonary artery towards lungs',
        details: 'Thicker muscular wall than atria. Ejects blood into the pulmonary trunk for oxygenation in pulmonary capillaries.',
        ncertReference: 'NCERT Class 10 Sec 6.4.1 Our Pump — The Heart',
        color: '#3b82f6'
      },
      {
        id: 'p-la',
        name: 'Left Atrium',
        function: 'Receives oxygen-rich blood from lungs via pulmonary veins',
        details: 'Relaxes to receive freshly oxygenated blood from all 4 pulmonary veins after alveolar gas exchange.',
        ncertReference: 'NCERT Class 10 Sec 6.4.1',
        color: '#dc2626'
      },
      {
        id: 'p-lv',
        name: 'Left Ventricle',
        function: 'Pumps high-pressure oxygenated blood into aorta for systemic circulation',
        details: 'Has the thickest myocardium (3x thicker than right ventricle) to overcome total systemic vascular peripheral resistance.',
        ncertReference: 'NCERT Class 10 Sec 6.4.1',
        color: '#ef4444'
      },
      {
        id: 'p-valves',
        name: 'Heart Valves (Tricuspid & Bicuspid/Mitral)',
        function: 'Prevent backflow of blood when ventricles contract',
        details: 'Tricuspid valve guards right AV orifice; Bicuspid (Mitral) guards left AV orifice; Semilunar valves guard exits to pulmonary artery and aorta.',
        ncertReference: 'NCERT Class 10 Life Processes Fig 6.10',
        color: '#f59e0b'
      },
      {
        id: 'p-aorta',
        name: 'Aorta',
        function: 'Main arterial trunk delivering systemic arterial blood to the entire body',
        details: 'Largest elastic artery; tolerates systolic pressure pulsations up to 120 mmHg in healthy adults.',
        ncertReference: 'NCERT Class 10 Sec 6.4.1',
        color: '#b91c1c'
      }
    ]
  },

  // 2. Human Brain
  {
    id: 'organ-brain',
    name: 'Human Brain (Central Nervous System)',
    system: 'Nervous System & Control',
    subject: 'Biology / Science',
    classGrade: 'Class 10 & Class 11',
    description: 'The master coordinator of the human body, protected inside the cranium and surrounded by cerebrospinal fluid (CSF). Subdivided into Forebrain, Midbrain, and Hindbrain.',
    diagramType: 'brain',
    parts: [
      {
        id: 'b-cerebrum',
        name: 'Cerebrum (Forebrain)',
        function: 'Seat of intelligence, conscious thought, voluntary actions, sensory perception, and memory',
        details: 'Divided into left and right cerebral hemispheres. Features four distinct lobes: Frontal (executive decision), Parietal (sensory), Temporal (hearing/memory), Occipital (vision).',
        ncertReference: 'NCERT Class 10 Science, Chapter 7: Control and Coordination, Sec 7.1.2 Human Brain',
        color: '#8b5cf6'
      },
      {
        id: 'b-cerebellum',
        name: 'Cerebellum (Hindbrain)',
        function: 'Precision coordination of voluntary motor movements and maintaining body posture/equilibrium',
        details: 'Responsible for precision tasks like walking in a straight line, riding a bicycle, or picking up a pen.',
        ncertReference: 'NCERT Class 10 Sec 7.1.2',
        color: '#ec4899'
      },
      {
        id: 'b-medulla',
        name: 'Medulla Oblongata',
        function: 'Controls involuntary vital functions: blood pressure, salivation, vomiting, heartbeat, and respiration',
        details: 'Located at the lower brainstem, continuous inferiorly with the spinal cord.',
        ncertReference: 'NCERT Class 10 Sec 7.1.2 Fig 7.3',
        color: '#10b981'
      },
      {
        id: 'b-hypothalamus',
        name: 'Hypothalamus',
        function: 'Thermoregulation, hunger, thirst, sleep-wake circadian rhythm, and master endocrine control',
        details: 'Connects nervous system to endocrine system by controlling hormones released by the pituitary gland.',
        ncertReference: 'NCERT Class 10 Sec 7.1.2 & NCERT Class 11 Biology Ch 21',
        color: '#f59e0b'
      },
      {
        id: 'b-midbrain',
        name: 'Midbrain',
        function: 'Coordinates reflex movements of the head, neck, and trunk in response to visual and auditory stimuli',
        details: 'Connects the forebrain to hindbrain; contains centers for pupillary light reflexes.',
        ncertReference: 'NCERT Class 10 Sec 7.1.2',
        color: '#06b6d4'
      }
    ]
  },

  // 3. Human Nephron & Kidney
  {
    id: 'organ-nephron',
    name: 'Nephron & Human Kidney (Excretory System)',
    system: 'Excretory System',
    subject: 'Biology / Science',
    classGrade: 'Class 10 & Class 11',
    description: 'The structural and functional filtration unit of the human kidney (~1 million nephrons per kidney), filtering metabolic waste from blood through ultrafiltration and selective reabsorption.',
    diagramType: 'nephron',
    parts: [
      {
        id: 'n-bowman',
        name: "Bowman's Capsule & Glomerulus",
        function: 'Site of Ultrafiltration under high hydrostatic blood pressure',
        details: 'Tuft of capillaries (Glomerulus) fed by afferent arteriole and drained by narrower efferent arteriole, forcing plasma filtrate through podocyte slits into cup-shaped capsule.',
        ncertReference: 'NCERT Class 10 Science, Sec 6.5.1 Excretion in Human Beings, Fig 6.14',
        color: '#f43f5e'
      },
      {
        id: 'n-pct',
        name: 'Proximal Convoluted Tubule (PCT)',
        function: 'Obligatory selective reabsorption of 70-80% of electrolytes, water, glucose, and amino acids',
        details: 'Lined with simple cuboidal brush border epithelium with dense microvilli to maximize surface area.',
        ncertReference: 'NCERT Class 10 Sec 6.5.1',
        color: '#f59e0b'
      },
      {
        id: 'n-henle',
        name: "Henle's Loop",
        function: 'Counter-current concentration of urine and maintenance of medullary osmolarity gradient',
        details: 'Descending limb is permeable to water and impermeable to electrolytes; ascending limb is impermeable to water and actively transports electrolytes.',
        ncertReference: 'NCERT Class 11 Biology Ch 19 & Class 10 Sec 6.5.1',
        color: '#3b82f6'
      },
      {
        id: 'n-dct',
        name: 'Distal Convoluted Tubule (DCT) & Collecting Duct',
        function: 'Facultative reabsorption of water and sodium controlled by ADH and aldosterone',
        details: 'Final concentration step; empties into collecting duct which drains urine into renal pelvis and ureter.',
        ncertReference: 'NCERT Class 10 Sec 6.5.1',
        color: '#10b981'
      }
    ]
  },

  // 4. Human Eye
  {
    id: 'organ-eye',
    name: 'Human Eye (Optics of Vision & Accommodation)',
    system: 'Sensory Organs & Vision Optics',
    subject: 'Physics / Biology',
    classGrade: 'Class 10 & Class 12',
    description: 'A biological camera that focuses light through a crystalline lens onto a light-sensitive retina, with ciliary muscles dynamically altering focal length (Power of Accommodation).',
    diagramType: 'eye',
    parts: [
      {
        id: 'e-cornea',
        name: 'Cornea',
        function: 'Transparent anterior bulge providing ~70% of total refractive optical power',
        details: 'Avascular transparent fibrous tunic where maximum refraction of incident light occurs.',
        ncertReference: 'NCERT Class 10 Science, Chapter 11: The Human Eye and the Colourful World, Fig 11.1',
        color: '#38bdf8'
      },
      {
        id: 'e-iris',
        name: 'Iris & Pupil',
        function: 'Regulates diameter of pupil to control light entering interior eye',
        details: 'Dark muscular diaphragm. Pupil contracts in bright light and dilates in dim illumination.',
        ncertReference: 'NCERT Class 10 Sec 11.1',
        color: '#6366f1'
      },
      {
        id: 'e-lens',
        name: 'Crystalline Lens & Ciliary Muscles',
        function: 'Adjusts focal length for near and distant vision (Power of Accommodation)',
        details: 'Fibrous jelly-like convex lens. Relaxed ciliary muscles = thin lens (focal length increases for distant objects). Contracted muscles = thick lens (focal length decreases for near objects, near point = 25 cm).',
        ncertReference: 'NCERT Class 10 Sec 11.1.1 Power of Accommodation',
        color: '#a855f7'
      },
      {
        id: 'e-retina',
        name: 'Retina & Photoreceptors (Rods & Cones)',
        function: 'Screen where real, inverted image is captured and converted into action potentials',
        details: 'Contains Rods (scotopic vision in dim light, rhodopsin) and Cones (photopic vision, color discernment). Signals transmit via optic nerve to visual cortex.',
        ncertReference: 'NCERT Class 10 Sec 11.1',
        color: '#f43f5e'
      }
    ]
  },

  // 5. Plant Cell vs Animal Cell
  {
    id: 'organ-cell',
    name: 'Plant Cell vs Animal Cell (Cellular Biology)',
    system: 'Cell Biology',
    subject: 'Biology / Science',
    classGrade: 'Class 9 & Class 11',
    description: 'The fundamental unit of life showing eukaryotic cell organelles: Nucleus, Mitochondria, Chloroplasts, Vacuole, Endoplasmic Reticulum, and Golgi apparatus.',
    diagramType: 'cell',
    parts: [
      {
        id: 'c-nucleus',
        name: 'Nucleus & Chromatin',
        function: 'Directs cellular activities and houses genetic blueprint (DNA)',
        details: 'Surrounded by double nuclear membrane with nuclear pores; contains nucleolus (ribosome assembly).',
        ncertReference: 'NCERT Class 9 Science, Chapter 5: The Fundamental Unit of Life, Sec 5.2.3',
        color: '#8b5cf6'
      },
      {
        id: 'c-mito',
        name: 'Mitochondria ("Powerhouse of the Cell")',
        function: 'Synthesizes ATP through oxidative phosphorylation and Krebs cycle',
        details: 'Double membrane; folded inner cristae maximize ATP synthesis area. Contains its own circular DNA and 70S ribosomes.',
        ncertReference: 'NCERT Class 9 Sec 5.2.5(v)',
        color: '#ef4444'
      },
      {
        id: 'c-chloro',
        name: 'Chloroplast (Plant Cells)',
        function: 'Carries out photosynthesis converting CO2 and water into glucose',
        details: 'Contains green chlorophyll in stacked thylakoid grana embedded in fluid stroma. Absent in animal cells.',
        ncertReference: 'NCERT Class 9 Sec 5.2.5(vi)',
        color: '#10b981'
      },
      {
        id: 'c-vacuole',
        name: 'Central Vacuole (Tonoplast)',
        function: 'Maintains turgor pressure and stores cell sap and osmotic solutes',
        details: 'Occupies 50-90% of plant cell volume; bounded by selectively permeable tonoplast.',
        ncertReference: 'NCERT Class 9 Sec 5.2.5(vii)',
        color: '#06b6d4'
      },
      {
        id: 'c-wall',
        name: 'Cell Wall (Cellulose)',
        function: 'Rigid protective outer framework preventing osmotic lysis in hypotonic media',
        details: 'Composed of cellulose microfibrils in plants; completely absent in animal cells.',
        ncertReference: 'NCERT Class 9 Sec 5.2.2',
        color: '#84cc16'
      }
    ]
  },

  // 6. Human Respiratory System
  {
    id: 'organ-lungs',
    name: 'Respiratory System (Lungs & Alveoli)',
    system: 'Respiratory System',
    subject: 'Biology / Science',
    classGrade: 'Class 10 & Class 11',
    description: 'Specialized ventilation apparatus facilitating blood-gas barrier oxygenation and carbon dioxide exhalation through extensive alveolar capillary network.',
    diagramType: 'lungs',
    parts: [
      {
        id: 'l-trachea',
        name: 'Trachea & C-shaped Cartilaginous Rings',
        function: 'Conducts air from larynx to bronchi while preventing airway collapse during inhalation',
        details: 'Lined with pseudostratified ciliated columnar epithelium to sweep trapped dust particles upwards.',
        ncertReference: 'NCERT Class 10 Science, Sec 6.3 Respiration, Fig 6.9',
        color: '#38bdf8'
      },
      {
        id: 'l-bronchi',
        name: 'Bronchial Tree',
        function: 'Distributes inhaled air evenly across lobes of left and right lungs',
        details: 'Branches progressively into primary, secondary, tertiary bronchi, and terminal bronchioles.',
        ncertReference: 'NCERT Class 10 Sec 6.3',
        color: '#6366f1'
      },
      {
        id: 'l-alveoli',
        name: 'Alveoli & Capillary Gas Exchange',
        function: 'Millions of thin-walled micro-air sacs providing huge surface area (~80 m²) for diffusion',
        details: 'Respiratory membrane thickness < 1 µm; O2 diffuses down partial pressure gradient into hemoglobin while CO2 diffuses out.',
        ncertReference: 'NCERT Class 10 Sec 6.3 Fig 6.9',
        color: '#f43f5e'
      },
      {
        id: 'l-diaphragm',
        name: 'Diaphragm & Thoracic Mechanics',
        function: 'Dome-shaped muscle altering intra-thoracic cavity volume and negative pressure',
        details: 'Contraction flattens diaphragm, increasing thoracic volume and drawing air in; relaxation pushes air out.',
        ncertReference: 'NCERT Class 10 Sec 6.3',
        color: '#f59e0b'
      }
    ]
  },

  // 7. DNA Double Helix
  {
    id: 'organ-dna',
    name: 'DNA Double Helix (Molecular Genetics)',
    system: 'Genetics & Molecular Biology',
    subject: 'Biology / Chemistry',
    classGrade: 'Class 10 & Class 12',
    description: 'The molecular blueprint of heredity proposed by Watson and Crick (1953), consisting of two antiparallel polynucleotide chains wound into a right-handed double helix.',
    diagramType: 'dna',
    parts: [
      {
        id: 'dna-backbone',
        name: 'Sugar-Phosphate Backbone',
        function: 'Structural structural spine of DNA formed by alternating deoxyribose sugar and phosphate groups',
        details: 'Linked by 3′-5′ phosphodiester covalent bonds; antiparallel orientation (5′→3′ runs opposite to 3′→5′).',
        ncertReference: 'NCERT Class 12 Biology, Chapter 6: Molecular Basis of Inheritance, Sec 6.1',
        color: '#8b5cf6'
      },
      {
        id: 'dna-at',
        name: 'Adenine = Thymine Base Pair',
        function: 'Purine-Pyrimidine complementary base pair stabilized by 2 Hydrogen bonds',
        details: 'Follows Chargaff’s Rule: Ratio of Adenine equals Thymine (A/T = 1).',
        ncertReference: 'NCERT Class 12 Sec 6.1.1',
        color: '#ef4444'
      },
      {
        id: 'dna-gc',
        name: 'Guanine ≡ Cytosine Base Pair',
        function: 'Purine-Pyrimidine complementary base pair stabilized by 3 Hydrogen bonds',
        details: 'Higher G-C content confers greater thermodynamic stability and higher melting temperature (Tm) to DNA.',
        ncertReference: 'NCERT Class 12 Sec 6.1.1',
        color: '#10b981'
      },
      {
        id: 'dna-dimensions',
        name: 'Helical Pitch & Major/Minor Grooves',
        function: 'Geometry of B-DNA double helix allowing regulatory protein binding',
        details: 'Pitch of helix = 3.4 nm (34 Å), distance between adjacent base pairs = 0.34 nm (3.4 Å), with exactly 10 base pairs per helical turn.',
        ncertReference: 'NCERT Class 12 Sec 6.1.1',
        color: '#f59e0b'
      }
    ]
  }
];

// ==========================================
// 3. VIRTUAL INTERACTIVE SCIENCE TOOLS & LABS
// ==========================================
export const VIRTUAL_TOOLS_LIBRARY: VirtualTool[] = [
  // 1. Virtual Compound Microscope
  {
    id: 'tool-microscope',
    name: 'Virtual Compound Optical Microscope',
    category: 'Biology',
    description: 'High-precision optical microscope with coarse & fine adjustment knobs, revolving nosepiece (4x, 10x, 40x, 100x oil immersion), stage controls, and prepared cytology slides.',
    syllabusTopic: 'NCERT Class 9 Chapter 5 & Class 11 Practical Cytology',
    toolType: 'microscope',
    specimens: [
      {
        id: 'spec-onion',
        name: 'Onion Peel Epidermal Cells',
        type: 'Plant Tissue',
        description: 'Temporary mount of onion peel stained with Safranin, revealing rectangular cells with distinct cellulose walls, peripheral cytoplasm, large central vacuoles, and prominent nuclei.',
        keyFeatures: ['Cellulose Cell Wall', 'Prominent Nucleus', 'Peripheral Cytoplasm', 'Absence of Intercellular Spaces'],
        recommendedMagnification: '10x to 40x'
      },
      {
        id: 'spec-cheek',
        name: 'Human Cheek Epithelial Cells',
        type: 'Animal Tissue',
        description: 'Mount of squamous epithelial cells gently scraped from oral mucosa and stained with Methylene Blue. Cells are polyhedral, thin, flat with central dark nuclei and no cell walls.',
        keyFeatures: ['Thin Plasma Membrane (No Cell Wall)', 'Central Dense Nucleus', 'Granular Cytoplasm', 'Irregular Polygonal Shape'],
        recommendedMagnification: '10x to 40x'
      },
      {
        id: 'spec-stomata',
        name: 'Leaf Epidermal Peel (Stomata & Guard Cells)',
        type: 'Plant Physiology',
        description: 'Lower epidermis peel of Rhoeo or Bryophyllum leaf showing stomatal apertures flanked by kidney-shaped guard cells containing chloroplasts.',
        keyFeatures: ['Stomatal Pore', 'Bean-shaped Guard Cells with Chloroplasts', 'Epidermal Subsidiary Cells', 'Inner Thick Wall of Guard Cells'],
        recommendedMagnification: '40x'
      },
      {
        id: 'spec-spirogyra',
        name: 'Spirogyra (Green Filamentous Alga)',
        type: 'Algal Cytology',
        description: 'Unbranched multicellular filament of green alga displaying characteristic ribbon-like spiral chloroplasts studded with glistening pyrenoids.',
        keyFeatures: ['Ribbon-like Spiral Chloroplast', 'Pyrenoids for Starch Storage', 'Cytoplasmic Strands Suspending Nucleus'],
        recommendedMagnification: '10x to 40x'
      },
      {
        id: 'spec-amoeba',
        name: 'Amoeba proteus (Binary Fission)',
        type: 'Microbiology & Reproduction',
        description: 'Freshwater unicellular protozoan extending blunt finger-like pseudopodia for locomotion and phagocytosis; exhibits contractile vacuoles and nucleus.',
        keyFeatures: ['Pseudopodia', 'Contractile Vacuole', 'Phagocytic Food Vacuoles', 'Granular Endoplasm'],
        recommendedMagnification: '10x to 40x'
      }
    ]
  },

  // 2. Precision Digital Analytical Chemical Balance
  {
    id: 'tool-chemical-balance',
    name: 'Precision Digital Analytical Chemical Balance',
    category: 'Chemistry',
    description: 'Calibrated analytical balance (0.0001 g / 0.1 mg least count) with sliding glass draft shields, tare function, multiple tare vessels (watch glass, weighing boat, beaker), chemical reagent dispensing, and real-time molarity calculation for standard solutions.',
    syllabusTopic: 'NCERT Class 11 Chemistry Practical: Preparation of Standard Solutions (Oxalic Acid, Sodium Carbonate) & Gravimetric Analysis',
    toolType: 'chemical_balance'
  },

  // 3. Calibrated Digital Benchtop pH Meter
  {
    id: 'tool-ph-meter',
    name: 'Calibrated Digital Benchtop pH Meter',
    category: 'Chemistry',
    description: 'Precision potentiometric pH meter with glass combination electrode and Pt1000 temperature probe. Features 3-point buffer calibration (pH 4.01, 7.00, 10.01), Nernst equation electrode slope verification (mV), automatic temperature compensation (0–80°C), and measurement of diverse laboratory acids, bases, and buffer solutions.',
    syllabusTopic: 'NCERT Class 10 Chapter 2 Acids, Bases & Salts & Class 11 Equilibrium: pH Scale, Hydrolysis and Buffer Solutions',
    toolType: 'ph_meter'
  },

  // 4. Vernier Callipers & Screw Gauge
  {
    id: 'tool-vernier',
    name: 'Vernier Callipers & Micrometer Screw Gauge',
    category: 'Physics',
    description: 'Precision physical measuring instruments calculating least count, zero error correction, internal/external diameters, and spheres/cylinders dimensions down to 0.01 mm.',
    syllabusTopic: 'NCERT Class 11 Physics Practical Unit 1: Measurement & Errors',
    toolType: 'vernier'
  },

  // 3. Acid-Base Titration & pH Meter
  {
    id: 'tool-titration',
    name: 'Quantitative Acid-Base Titration & pH Curve',
    category: 'Chemistry',
    description: 'Volumetric titration apparatus with 50 mL graduated burette, conical flask, magnetic stirrer, pH electrode sensor, and indicator color transitions (Phenolphthalein, Methyl Orange, Universal Indicator).',
    syllabusTopic: 'NCERT Class 10 Chapter 2: Acids, Bases and Salts & Class 11 Practical Chemistry',
    toolType: 'titration'
  },

  // 4. Optical Bench Ray Tracing Simulator
  {
    id: 'tool-optics-bench',
    name: 'Ray Optics Bench (Lenses & Mirrors Simulator)',
    category: 'Physics',
    description: 'Precision optical bench with movable illuminated object pin, lens/mirror holder, and projection screen. Traces principal light rays in real-time, calculating focal length f, image distance v, and magnification m.',
    syllabusTopic: 'NCERT Class 10 Chapter 10 & Class 12 Chapter 9 Ray Optics',
    toolType: 'optics_bench'
  },

  // 5. Electric Circuit Breadboard
  {
    id: 'tool-breadboard',
    name: 'Interactive Electric Circuit Breadboard',
    category: 'Physics',
    description: 'Interactive DC circuit simulator: Battery source (1-24V), Series/Parallel resistors, Voltmeter, Ammeter, Rheostat, and Filament Bulb testing Ohm’s Law and Joule heating.',
    syllabusTopic: 'NCERT Class 10 Chapter 12: Electricity & Class 12 Current Electricity',
    toolType: 'breadboard'
  },

  // 6. Simple Pendulum & Gravitational Physics
  {
    id: 'tool-pendulum',
    name: 'Simple Harmonic Motion (SHM) Pendulum Lab',
    category: 'Physics',
    description: 'Oscillating simple pendulum simulating time period T = 2π√(L/g) across varying celestial gravitational fields (Earth 9.8 m/s², Moon 1.62 m/s², Jupiter 24.8 m/s²), tracking kinetic vs potential energy conservation.',
    syllabusTopic: 'NCERT Class 11 Physics Chapter 14: Oscillations',
    toolType: 'pendulum'
  },

  // 7. Flame Test & Emission Spectroscopy
  {
    id: 'tool-flame-test',
    name: 'Bunsen Flame Test & Atomic Emission Spectra',
    category: 'Chemistry',
    description: 'Qualitative inorganic analysis apparatus exciting metal cations in non-luminous Bunsen burner flame, visualizing characteristic flame colors (Na, Cu, K, Ca, Ba, Sr) and quantum spectral lines.',
    syllabusTopic: 'NCERT Class 11 Chemistry Chapter 2: Structure of Atom & Class 10 Metals and Non-Metals',
    toolType: 'flame_test'
  }
];
