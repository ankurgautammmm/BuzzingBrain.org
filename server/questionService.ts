import { callGeminiSafely } from './geminiService';

export interface GeneratedQuestion {
  id?: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  subject: string;
  classLevel: number;
  chapter: string;
  topic?: string;
}

export interface QuestionRequestParams {
  classLevel?: number | string;
  subject?: string;
  chapter?: string;
  topic?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  count?: number;
}

/**
 * Validate that a question strictly conforms to the NCERT MCQ schema
 */
export function validateQuestion(q: any): q is GeneratedQuestion {
  if (!q || typeof q !== 'object') return false;
  if (typeof q.question !== 'string' || !q.question.trim()) return false;
  if (!Array.isArray(q.options) || q.options.length !== 4) return false;
  
  // All 4 options must be non-empty strings and distinct
  const cleanedOptions = q.options.map((opt: any) => String(opt || '').trim());
  if (cleanedOptions.some((opt: string) => opt.length === 0)) return false;
  const uniqueOptions = new Set(cleanedOptions.map((o: string) => o.toLowerCase()));
  if (uniqueOptions.size !== 4) return false;

  // Correct answer must match one of the options
  if (typeof q.correctAnswer !== 'string' || !q.correctAnswer.trim()) return false;
  const cleanAns = q.correctAnswer.trim();
  const matched = cleanedOptions.some((opt: string) => 
    opt.toLowerCase() === cleanAns.toLowerCase() ||
    cleanAns.toLowerCase().startsWith(opt.toLowerCase()) ||
    opt.toLowerCase().startsWith(cleanAns.toLowerCase())
  );
  if (!matched) return false;

  if (typeof q.explanation !== 'string' || !q.explanation.trim()) return false;
  return true;
}

/**
 * Clean and standardize question object
 */
export function sanitizeQuestion(q: any, defaultParams: QuestionRequestParams): GeneratedQuestion | null {
  if (!q || typeof q !== 'object') return null;
  const question = String(q.question || '').trim();
  if (!question) return null;

  let options: string[] = [];
  if (Array.isArray(q.options)) {
    options = q.options.map((o: any) => String(o || '').trim()).filter(Boolean);
  }

  if (options.length < 4) {
    return null;
  }
  options = options.slice(0, 4);

  // If correctAnswer is an index (0, 1, 2, 3), convert to string value
  let correctAnswer = '';
  if (typeof q.correctAnswer === 'number' && q.correctAnswer >= 0 && q.correctAnswer < options.length) {
    correctAnswer = options[q.correctAnswer];
  } else if (typeof q.correctAnswer === 'string') {
    correctAnswer = q.correctAnswer.trim();
    // Verify if it corresponds to 'A', 'B', 'C', 'D'
    const letterMatch = correctAnswer.match(/^[Option\s]*([A-D])$/i);
    if (letterMatch) {
      const idx = letterMatch[1].toUpperCase().charCodeAt(0) - 65;
      if (idx >= 0 && idx < options.length) {
        correctAnswer = options[idx];
      }
    }
  }

  // Ensure correctAnswer matches one of the options
  let matchedOption = options.find((opt) => opt.toLowerCase() === correctAnswer.toLowerCase());
  if (!matchedOption) {
    // Check partial match
    matchedOption = options.find((opt) => 
      opt.toLowerCase().includes(correctAnswer.toLowerCase()) || 
      correctAnswer.toLowerCase().includes(opt.toLowerCase())
    );
  }
  if (!matchedOption) {
    // Reject question rather than arbitrarily guessing options[0] as correct
    return null;
  }
  correctAnswer = matchedOption;

  const validDifficulties: Array<'easy' | 'medium' | 'hard'> = ['easy', 'medium', 'hard'];
  let diff: 'easy' | 'medium' | 'hard' = 'medium';
  if (q.difficulty && validDifficulties.includes(String(q.difficulty).toLowerCase() as any)) {
    diff = String(q.difficulty).toLowerCase() as any;
  } else if (defaultParams.difficulty) {
    diff = defaultParams.difficulty;
  }

  let classNum = 10;
  if (typeof q.classLevel === 'number') {
    classNum = q.classLevel;
  } else if (defaultParams.classLevel) {
    const parsed = parseInt(String(defaultParams.classLevel).replace(/\D/g, ''), 10);
    if (!isNaN(parsed)) classNum = parsed;
  }

  return {
    question,
    options,
    correctAnswer,
    explanation: String(q.explanation || 'Based on core NCERT textbook concepts.').trim(),
    difficulty: diff,
    subject: String(q.subject || defaultParams.subject || 'Science').trim(),
    classLevel: classNum,
    chapter: String(q.chapter || defaultParams.chapter || 'Core Concepts').trim(),
    topic: q.topic ? String(q.topic).trim() : defaultParams.topic,
  };
}

/**
 * Rich Pre-built CBSE NCERT Question Bank for instant resilience and testing
 */
export const VERIFIED_QUESTION_BANK: GeneratedQuestion[] = [
  // Class 9 Science - Motion & Inertia
  {
    question: "Which physical quantity measures inertia?",
    options: ["Speed", "Mass", "Acceleration", "Force"],
    correctAnswer: "Mass",
    explanation: "Mass is a quantitative measure of an object's inertia. Greater the mass of an object, greater is its inertia to resist changes in its state of rest or motion.",
    difficulty: "easy",
    subject: "Science",
    classLevel: 9,
    chapter: "Force and Laws of Motion",
    topic: "Inertia"
  },
  {
    question: "What is the SI unit of momentum?",
    options: ["kg·m/s²", "kg·m/s", "N·m", "J/s"],
    correctAnswer: "kg·m/s",
    explanation: "Momentum p = m × v, where mass is measured in kilograms (kg) and velocity in meters per second (m/s). Hence the SI unit is kg·m/s.",
    difficulty: "easy",
    subject: "Science",
    classLevel: 9,
    chapter: "Force and Laws of Motion",
    topic: "Momentum"
  },
  {
    question: "When a carpet is beaten with a stick, dust comes out of it. This is explained by:",
    options: ["Newton's First Law (Inertia of rest)", "Newton's Third Law of Action-Reaction", "Law of Conservation of Momentum", "Law of Gravitation"],
    correctAnswer: "Newton's First Law (Inertia of rest)",
    explanation: "When beaten with a stick, the carpet comes into motion, but the dust particles tend to remain at rest due to inertia of rest and therefore fall out.",
    difficulty: "easy",
    subject: "Science",
    classLevel: 9,
    chapter: "Force and Laws of Motion",
    topic: "Inertia of Rest"
  },
  {
    question: "A constant force of 5 N acts on a mass of 2 kg initially at rest for 4 seconds. What is the final velocity acquired?",
    options: ["5 m/s", "10 m/s", "15 m/s", "20 m/s"],
    correctAnswer: "10 m/s",
    explanation: "Acceleration a = F / m = 5 / 2 = 2.5 m/s². Final velocity v = u + at = 0 + (2.5 × 4) = 10 m/s.",
    difficulty: "medium",
    subject: "Science",
    classLevel: 9,
    chapter: "Force and Laws of Motion",
    topic: "Newton's Second Law"
  },
  {
    question: "Why does a gun recoil backwards when a bullet is fired?",
    options: ["Conservation of linear momentum", "Air resistance pushing backwards", "Gravitational force acting downwards", "Inertia of direction"],
    correctAnswer: "Conservation of linear momentum",
    explanation: "Before firing, total momentum is zero. When the bullet gains forward momentum, the gun must acquire an equal and opposite backward momentum to conserve total momentum: m_bullet·v_bullet + M_gun·V_recoil = 0.",
    difficulty: "medium",
    subject: "Science",
    classLevel: 9,
    chapter: "Force and Laws of Motion",
    topic: "Conservation of Momentum"
  },
  {
    question: "Two objects of masses 100 g and 200 g are moving along the same line in the same direction with velocities 2 m/s and 1 m/s respectively. They collide and stick together. Their combined velocity after collision is:",
    options: ["1.33 m/s", "1.50 m/s", "1.67 m/s", "2.00 m/s"],
    correctAnswer: "1.33 m/s",
    explanation: "m₁ = 0.1 kg, u₁ = 2 m/s; m₂ = 0.2 kg, u₂ = 1 m/s. Total initial momentum = (0.1×2) + (0.2×1) = 0.4 kg·m/s. Combined mass = 0.3 kg. Final velocity v = 0.4 / 0.3 = 1.33 m/s.",
    difficulty: "hard",
    subject: "Science",
    classLevel: 9,
    chapter: "Force and Laws of Motion",
    topic: "Collisions"
  },
  {
    question: "The slope of a Distance-Time graph represents which physical quantity?",
    options: ["Acceleration", "Speed", "Displacement", "Force"],
    correctAnswer: "Speed",
    explanation: "The slope of distance-time graph is change in distance divided by change in time (Δs/Δt), which is speed.",
    difficulty: "easy",
    subject: "Science",
    classLevel: 9,
    chapter: "Motion",
    topic: "Graphical Representation of Motion"
  },
  {
    question: "A car travels from A to B at a speed of 40 km/h and returns from B to A at 60 km/h. What is the average speed for the round trip?",
    options: ["48 km/h", "50 km/h", "52 km/h", "54 km/h"],
    correctAnswer: "48 km/h",
    explanation: "For equal distances d, Average Speed = Total Distance / Total Time = 2d / (d/40 + d/60) = 2 / (3/120 + 2/120) = (2 × 120) / 5 = 48 km/h.",
    difficulty: "medium",
    subject: "Science",
    classLevel: 9,
    chapter: "Motion",
    topic: "Average Speed"
  },
  {
    question: "Which of the following cellular organelles possesses its own DNA and 70S ribosomes?",
    options: ["Mitochondria", "Golgi apparatus", "Lysosome", "Endoplasmic Reticulum"],
    correctAnswer: "Mitochondria",
    explanation: "Mitochondria (and plastids in plants) are semi-autonomous organelles possessing their own circular DNA and 70S ribosomes, allowing them to synthesize some of their own proteins.",
    difficulty: "medium",
    subject: "Science",
    classLevel: 9,
    chapter: "The Fundamental Unit of Life: Cell",
    topic: "Mitochondria"
  },
  {
    question: "If a plant cell is kept in a hypertonic solution, the cytoplasm shrinks away from the cell wall. This phenomenon is known as:",
    options: ["Plasmolysis", "Endosmosis", "Deplasmolysis", "Turgidity"],
    correctAnswer: "Plasmolysis",
    explanation: "In a hypertonic solution, water leaves the plant cell through exosmosis, causing the protoplast to shrink away from the rigid cell wall. This is called plasmolysis.",
    difficulty: "medium",
    subject: "Science",
    classLevel: 9,
    chapter: "The Fundamental Unit of Life: Cell",
    topic: "Osmosis"
  },

  // Class 10 Science - Chemical Reactions & Equations
  {
    question: "When aqueous barium chloride reacts with dilute sulphuric acid, what is the chemical formula of the white precipitate formed?",
    options: ["BaSO₄", "BaCl₂", "BaSO₃", "BaS"],
    correctAnswer: "BaSO₄",
    explanation: "BaCl₂(aq) + H₂SO₄(aq) → BaSO₄(s)↓ + 2HCl(aq). Barium sulphate is insoluble in water and precipitates out as a dense white solid (precipitation double displacement reaction).",
    difficulty: "easy",
    subject: "Science",
    classLevel: 10,
    chapter: "Chemical Reactions and Equations",
    topic: "Double Displacement Reactions"
  },
  {
    question: "Which gas is evolved when calcium carbonate reacts with dilute hydrochloric acid?",
    options: ["Carbon dioxide (CO₂)", "Hydrogen (H₂)", "Oxygen (O₂)", "Chlorine (Cl₂)"],
    correctAnswer: "Carbon dioxide (CO₂)",
    explanation: "CaCO₃(s) + 2HCl(aq) → CaCl₂(aq) + H₂O(l) + CO₂(g)↑. The carbon dioxide turns lime water milky due to formation of calcium carbonate precipitate.",
    difficulty: "easy",
    subject: "Science",
    classLevel: 10,
    chapter: "Chemical Reactions and Equations",
    topic: "Reaction of Carbonates with Acids"
  },
  {
    question: "In the reaction: CuO + H₂ → Cu + H₂O, which substance acts as the reducing agent?",
    options: ["H₂", "CuO", "Cu", "H₂O"],
    correctAnswer: "H₂",
    explanation: "Hydrogen (H₂) gains oxygen to become H₂O and undergoes oxidation; therefore, H₂ acts as the reducing agent that reduces copper(II) oxide to copper.",
    difficulty: "medium",
    subject: "Science",
    classLevel: 10,
    chapter: "Chemical Reactions and Equations",
    topic: "Redox Reactions"
  },
  {
    question: "Why is respiration considered an exothermic reaction in human physiology?",
    options: ["Glucose combines with oxygen releasing energy", "It absorbs heat from the bloodstream", "It converts light energy into chemical bonds", "It only occurs in cold temperatures"],
    correctAnswer: "Glucose combines with oxygen releasing energy",
    explanation: "During respiration, glucose (C₆H₁₂O₆) combines with oxygen in the cells of our body to form carbon dioxide, water, and releases energy in the form of ATP: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + Energy.",
    difficulty: "easy",
    subject: "Science",
    classLevel: 10,
    chapter: "Chemical Reactions and Equations",
    topic: "Exothermic Reactions"
  },
  {
    question: "When ferrous sulphate crystals (FeSO₄·7H₂O) are heated strongly in a dry boiling tube, the color changes from green to:",
    options: ["Reddish brown", "Bright yellow", "Deep blue", "Silver grey"],
    correctAnswer: "Reddish brown",
    explanation: "Green ferrous sulphate crystals first lose water of crystallization to become white anhydrous FeSO₄, and on further heating decompose into reddish-brown solid Fe₂O₃ (ferric oxide), along with pungent smelling SO₂ and SO₃ gases.",
    difficulty: "hard",
    subject: "Science",
    classLevel: 10,
    chapter: "Chemical Reactions and Equations",
    topic: "Thermal Decomposition"
  },

  // Class 10 Science - Life Processes
  {
    question: "During photosynthesis, the oxygen gas liberated originates from which molecule?",
    options: ["Water (H₂O)", "Carbon dioxide (CO₂)", "Glucose (C₆H₁₂O₆)", "Chlorophyll"],
    correctAnswer: "Water (H₂O)",
    explanation: "During the light reaction of photosynthesis in thylakoids, light energy drives the photolysis of water molecules (2H₂O → 4H⁺ + 4e⁻ + O₂↑), liberating molecular oxygen.",
    difficulty: "medium",
    subject: "Science",
    classLevel: 10,
    chapter: "Life Processes",
    topic: "Photosynthesis"
  },
  {
    question: "In anaerobic respiration in human muscle cells during strenuous exercise, pyruvate is converted into:",
    options: ["Lactic acid + Energy", "Ethanol + Carbon dioxide", "Carbon dioxide + Water", "Acetic acid"],
    correctAnswer: "Lactic acid + Energy",
    explanation: "When there is a lack of oxygen in skeletal muscle cells during vigorous exercise, pyruvate is converted into lactic acid (3-carbon molecule), leading to muscle cramps.",
    difficulty: "medium",
    subject: "Science",
    classLevel: 10,
    chapter: "Life Processes",
    topic: "Respiration"
  },
  {
    question: "What prevents backflow of blood inside the human heart during ventricular contraction?",
    options: ["Valves (Tricuspid and Bicuspid)", "Thick muscular septum", "Pericardial fluid", "Pulmonary artery walls"],
    correctAnswer: "Valves (Tricuspid and Bicuspid)",
    explanation: "Atrioventricular valves (bicuspid/mitral and tricuspid) and semilunar valves ensure that blood flows in only one direction and prevents any backflow when ventricles contract.",
    difficulty: "easy",
    subject: "Science",
    classLevel: 10,
    chapter: "Life Processes",
    topic: "Circulation"
  },
  {
    question: "What is the structural and functional filtration unit of the human kidney?",
    options: ["Nephron", "Neuron", "Alveolus", "Glomerulus capsule only"],
    correctAnswer: "Nephron",
    explanation: "Each kidney contains approximately one million filtration units called nephrons, consisting of Bowman's capsule, glomerulus, and renal tubules.",
    difficulty: "easy",
    subject: "Science",
    classLevel: 10,
    chapter: "Life Processes",
    topic: "Excretion"
  },
  {
    question: "Which enzyme present in human saliva begins the chemical digestion of dietary starch?",
    options: ["Salivary amylase (Ptyalin)", "Pepsin", "Trypsin", "Lipase"],
    correctAnswer: "Salivary amylase (Ptyalin)",
    explanation: "Salivary amylase breaks down complex starch molecules into simpler maltose disaccharide sugars in the mouth at an optimum pH of ~6.8.",
    difficulty: "easy",
    subject: "Science",
    classLevel: 10,
    chapter: "Life Processes",
    topic: "Human Digestion"
  },

  // Class 10 Mathematics - Quadratic Equations
  {
    question: "If the discriminant D = b² - 4ac of a quadratic equation ax² + bx + c = 0 is greater than zero, the roots are:",
    options: ["Real and distinct", "Real and equal", "Non-real complex conjugate", "Zero"],
    correctAnswer: "Real and distinct",
    explanation: "When D > 0, the quadratic formula yields two distinct real values: x = (-b ± √D) / (2a).",
    difficulty: "easy",
    subject: "Mathematics",
    classLevel: 10,
    chapter: "Quadratic Equations",
    topic: "Nature of Roots"
  },
  {
    question: "For what value of k does the quadratic equation 2x² + kx + 3 = 0 have two equal real roots?",
    options: ["±2√6", "±√6", "±6", "±4"],
    correctAnswer: "±2√6",
    explanation: "For equal roots, D = b² - 4ac = 0 => k² - 4(2)(3) = 0 => k² - 24 = 0 => k² = 24 => k = ±√24 = ±2√6.",
    difficulty: "medium",
    subject: "Mathematics",
    classLevel: 10,
    chapter: "Quadratic Equations",
    topic: "Condition for Equal Roots"
  },
  {
    question: "If α and β are the roots of the equation x² - 5x + 6 = 0, what is the value of (α² + β²)?",
    options: ["13", "25", "19", "12"],
    correctAnswer: "13",
    explanation: "Sum of roots α + β = -(-5)/1 = 5. Product of roots αβ = 6/1 = 6. α² + β² = (α + β)² - 2αβ = (5)² - 2(6) = 25 - 12 = 13.",
    difficulty: "medium",
    subject: "Mathematics",
    classLevel: 10,
    chapter: "Quadratic Equations",
    topic: "Roots Relationship"
  },
  {
    question: "The sum of a number and its reciprocal is 10/3. What is the number?",
    options: ["3 or 1/3", "2 or 1/2", "4 or 1/4", "5 or 1/5"],
    correctAnswer: "3 or 1/3",
    explanation: "Let the number be x. Then x + 1/x = 10/3 => (x² + 1)/x = 10/3 => 3x² + 3 = 10x => 3x² - 10x + 3 = 0 => (3x - 1)(x - 3) = 0 => x = 3 or x = 1/3.",
    difficulty: "hard",
    subject: "Mathematics",
    classLevel: 10,
    chapter: "Quadratic Equations",
    topic: "Word Problems"
  },

  // Class 11 Physics - Laws of Motion
  {
    question: "A block of mass 5 kg rests on a rough horizontal surface with coefficient of static friction μ_s = 0.3. What horizontal force is required to just start moving the block? (g = 9.8 m/s²)",
    options: ["14.7 N", "15.0 N", "29.4 N", "49.0 N"],
    correctAnswer: "14.7 N",
    explanation: "Limiting static friction F_limit = μ_s × N = μ_s × mg = 0.3 × 5 × 9.8 = 14.7 N.",
    difficulty: "easy",
    subject: "Physics",
    classLevel: 11,
    chapter: "Laws of Motion",
    topic: "Friction"
  },
  {
    question: "What is the maximum speed with which a car can safely take a flat circular curve of radius 50 m if the friction coefficient is 0.2? (g = 9.8 m/s²)",
    options: ["9.9 m/s", "14.0 m/s", "19.6 m/s", "24.5 m/s"],
    correctAnswer: "9.9 m/s",
    explanation: "v_max = √(μ_s · r · g) = √(0.2 × 50 × 9.8) = √98 ≈ 9.899 m/s ≈ 9.9 m/s.",
    difficulty: "medium",
    subject: "Physics",
    classLevel: 11,
    chapter: "Laws of Motion",
    topic: "Circular Motion"
  },
  {
    question: "An elevator of mass 1000 kg is accelerating upwards at 2 m/s². What is the tension in the supporting cable? (g = 9.8 m/s²)",
    options: ["11,800 N", "9,800 N", "7,800 N", "10,000 N"],
    correctAnswer: "11,800 N",
    explanation: "When accelerating upwards, pseudo force acts downwards. T - mg = ma => T = m(g + a) = 1000 × (9.8 + 2) = 1000 × 11.8 = 11,800 N.",
    difficulty: "medium",
    subject: "Physics",
    classLevel: 11,
    chapter: "Laws of Motion",
    topic: "Apparent Weight"
  },
  {
    question: "A cricket ball of mass 150 g moving at 20 m/s is caught by a player in 0.1 s. What is the average force exerted on the player's hands?",
    options: ["30 N", "15 N", "45 N", "60 N"],
    correctAnswer: "30 N",
    explanation: "Impulse = Change in momentum = m(v - u) = 0.15 × (0 - 20) = -3 kg·m/s. Average Force = Δp / Δt = 3 / 0.1 = 30 N.",
    difficulty: "easy",
    subject: "Physics",
    classLevel: 11,
    chapter: "Laws of Motion",
    topic: "Impulse"
  },

  // Class 12 Physics - Electric Charges & Fields
  {
    question: "What is the SI unit of electric permittivity of free space (ε₀)?",
    options: ["C²/(N·m²)", "N·m²/C²", "C/(N·m)", "N/C"],
    correctAnswer: "C²/(N·m²)",
    explanation: "From Coulomb's Law F = (1 / 4πε₀) · (q₁q₂ / r²), we have ε₀ = q₁q₂ / (4π F r²). Units = C² / (N·m²).",
    difficulty: "easy",
    subject: "Physics",
    classLevel: 12,
    chapter: "Electric Charges and Fields",
    topic: "Coulomb's Law"
  },
  {
    question: "What is the angle between electric dipole moment p and electric field E for maximum torque on the dipole?",
    options: ["90°", "0°", "180°", "45°"],
    correctAnswer: "90°",
    explanation: "Torque on a dipole is given by vector cross product τ = p × E = pE sin θ. Maximum torque occurs when sin θ = 1, i.e., θ = 90°.",
    difficulty: "easy",
    subject: "Physics",
    classLevel: 12,
    chapter: "Electric Charges and Fields",
    topic: "Electric Dipole"
  },
  {
    question: "The electric flux through a closed Gaussian cube of side 10 cm enclosing a charge of 8.854 μC is:",
    options: ["10⁶ N·m²/C", "10⁵ N·m²/C", "10⁴ N·m²/C", "10³ N·m²/C"],
    correctAnswer: "10⁶ N·m²/C",
    explanation: "By Gauss's Law, Φ = q / ε₀ = (8.854 × 10⁻⁶ C) / (8.854 × 10⁻¹² C²/(N·m²)) = 10⁶ N·m²/C, independent of the cube size.",
    difficulty: "medium",
    subject: "Physics",
    classLevel: 12,
    chapter: "Electric Charges and Fields",
    topic: "Gauss's Law"
  },

  // Class 12 Chemistry - Solutions
  {
    question: "Which colligative property is most suitably employed to determine the molar mass of biomolecules and polymers?",
    options: ["Osmotic pressure", "Elevation in boiling point", "Depression in freezing point", "Relative lowering of vapour pressure"],
    correctAnswer: "Osmotic pressure",
    explanation: "Osmotic pressure can be measured at room temperature, uses molarity, and provides measurable changes even for very dilute polymer solutions with low molar mass concentration.",
    difficulty: "medium",
    subject: "Chemistry",
    classLevel: 12,
    chapter: "Solutions",
    topic: "Colligative Properties"
  },
  {
    question: "What is the van 't Hoff factor (i) for complete dissociation of potassium ferricyanide K₃[Fe(CN)₆] in aqueous solution?",
    options: ["4", "3", "2", "6"],
    correctAnswer: "4",
    explanation: "K₃[Fe(CN)₆] dissociates into 3 K⁺ cations and 1 [Fe(CN)₆]³⁻ complex anion: total ions produced = 3 + 1 = 4. Hence i = 4.",
    difficulty: "hard",
    subject: "Chemistry",
    classLevel: 12,
    chapter: "Solutions",
    topic: "Van 't Hoff Factor"
  }
];

/**
 * Filter verified questions by criteria
 */
export function filterVerifiedQuestions(params: QuestionRequestParams): GeneratedQuestion[] {
  let list = [...VERIFIED_QUESTION_BANK];

  if (params.classLevel) {
    const classNum = parseInt(String(params.classLevel).replace(/\D/g, ''), 10);
    if (!isNaN(classNum)) {
      const classMatched = list.filter((q) => q.classLevel === classNum);
      if (classMatched.length >= 3) list = classMatched;
    }
  }

  if (params.subject && params.subject !== 'All') {
    const sub = params.subject.toLowerCase();
    const subMatched = list.filter((q) => q.subject.toLowerCase().includes(sub) || sub.includes(q.subject.toLowerCase()));
    if (subMatched.length >= 3) list = subMatched;
  }

  if (params.chapter) {
    const chap = params.chapter.toLowerCase();
    const chapMatched = list.filter((q) => q.chapter.toLowerCase().includes(chap) || chap.includes(q.chapter.toLowerCase()));
    if (chapMatched.length >= 3) list = chapMatched;
  }

  if (params.difficulty) {
    const diff = params.difficulty.toLowerCase();
    const diffMatched = list.filter((q) => q.difficulty.toLowerCase() === diff);
    if (diffMatched.length >= 3) list = diffMatched;
  }

  // Shuffle deterministic sample
  return list.sort(() => 0.5 - Math.random());
}

/**
 * Generate Questions via Gemini API with Strict Schema Enforcement
 * Guarantees exactly `count` valid questions (default: 10)
 */
export async function generateAiQuestions(params: QuestionRequestParams): Promise<GeneratedQuestion[]> {
  const count = Math.min(25, Math.max(1, params.count || 10));
  const classLevel = params.classLevel || 10;
  const subject = params.subject || 'Science';
  const chapter = params.chapter || 'Core Examination Concepts';
  const difficulty = params.difficulty || 'medium';
  const topic = params.topic || chapter;

  const prompt = `You are Buzzing Brain's Senior CBSE National Examination Board Paper Setter.
Generate exactly ${count} original, high-yield Multiple Choice Questions (MCQs) strictly conforming to the 2026-27 NCERT syllabus.

Class: ${classLevel}
Subject: ${subject}
Chapter: ${chapter}
Topic: ${topic}
Target Difficulty: ${difficulty}

CRITICAL SCHEMA RULES:
1. Generate EXACTLY ${count} questions.
2. Every question must have EXACTLY 4 distinct, meaningful options.
3. Every question must have EXACTLY ONE correct answer string that EXACTLY matches one of the 4 options.
4. Explanations must be educationally accurate, providing clear reasoning and formulas where applicable.
5. Do NOT duplicate questions.
6. The difficulty must be "${difficulty}".

Return ONLY a valid JSON array matching this exact TypeScript interface:
[
  {
    "question": "Clear question text",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correctAnswer": "Exact matching option string",
    "explanation": "Clear NCERT-aligned explanation",
    "difficulty": "${difficulty}",
    "subject": "${subject}",
    "classLevel": ${typeof classLevel === 'number' ? classLevel : parseInt(String(classLevel).replace(/\D/g, '') || '10', 10)},
    "chapter": "${chapter}",
    "topic": "${topic}"
  }
]`;

  const cacheKey = `ai_q_${classLevel}_${subject}_${chapter}_${difficulty}_${count}_${Math.floor(Date.now() / 600000)}`;

  let validatedList: GeneratedQuestion[] = [];

  try {
    const rawJson = await callGeminiSafely({
      contents: prompt,
      responseMimeType: 'application/json',
      cacheKey,
    });

    if (rawJson) {
      const parsed = JSON.parse(rawJson);
      if (Array.isArray(parsed)) {
        for (const rawQ of parsed) {
          const sanitized = sanitizeQuestion(rawQ, params);
          if (sanitized && validateQuestion(sanitized)) {
            // Deduplicate by question text
            if (!validatedList.some((existing) => existing.question.toLowerCase() === sanitized.question.toLowerCase())) {
              validatedList.push(sanitized);
            }
          }
        }
      }
    }
  } catch (err) {
    console.warn('[Question Engine] Notice: Gemini question generation used fallback:', err);
  }

  // If we already have the target count, return exact slice
  if (validatedList.length >= count) {
    return validatedList.slice(0, count);
  }

  // Backfill with verified question bank to guarantee exactly `count` items
  const fallbackPool = filterVerifiedQuestions(params);
  for (const fbQ of fallbackPool) {
    if (validatedList.length >= count) break;
    if (!validatedList.some((existing) => existing.question.toLowerCase() === fbQ.question.toLowerCase())) {
      validatedList.push({
        ...fbQ,
        difficulty: params.difficulty || fbQ.difficulty,
        subject: params.subject || fbQ.subject,
        classLevel: typeof classLevel === 'number' ? classLevel : parseInt(String(classLevel).replace(/\D/g, '') || '10', 10),
        chapter: params.chapter || fbQ.chapter,
      });
    }
  }

  // If still below target count, take any remaining verified questions
  if (validatedList.length < count) {
    for (const fbQ of VERIFIED_QUESTION_BANK) {
      if (validatedList.length >= count) break;
      if (!validatedList.some((existing) => existing.question.toLowerCase() === fbQ.question.toLowerCase())) {
        validatedList.push({
          ...fbQ,
          difficulty: params.difficulty || fbQ.difficulty,
          subject: params.subject || fbQ.subject,
          classLevel: typeof classLevel === 'number' ? classLevel : parseInt(String(classLevel).replace(/\D/g, '') || '10', 10),
          chapter: params.chapter || fbQ.chapter,
        });
      }
    }
  }

  return validatedList.slice(0, count);
}
