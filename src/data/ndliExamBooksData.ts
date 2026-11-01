export interface NdliBookItem {
  id: string;
  title: string;
  subtitle: string;
  authors: string;
  publisher: string;
  examCategory: 'NEET' | 'JEE' | 'CBSE' | 'CUET' | 'FOUNDATION';
  classGrade: string; // 'Class 9', 'Class 10', 'Class 11', 'Class 12', 'Dropper'
  subject: string;
  ndliUrl: string;
  sourceBadge: string;
  openAccess: boolean;
  coverGradient: string;
  chaptersCount: number;
  description: string;
  syllabusHighlights: string[];
  pdfAvailable: boolean;
}

export const NDLI_EXAM_BOOKS: NdliBookItem[] = [
  // --- NEET-UG MEDICAL ENTRANCE ---
  {
    id: 'ndli-neet-bio-11-ncert',
    title: 'NCERT Biology Class 11 (Rationalised Edition)',
    subtitle: 'Prescribed National Medical Curriculum with Exemplar Problems',
    authors: 'NCERT Academic Panel & NDL IIT Kharagpur Curators',
    publisher: 'National Council of Educational Research and Training (NCERT)',
    examCategory: 'NEET',
    classGrade: 'Class 11',
    subject: 'Biology',
    ndliUrl: 'https://ndl.iitkgp.ac.in/ndl_se',
    sourceBadge: 'NDLI IIT Kharagpur Verified',
    openAccess: true,
    coverGradient: 'from-emerald-600 via-teal-700 to-slate-900',
    chaptersCount: 19,
    description: 'The definitive gold standard for NEET-UG Biology comprising Diversity in Living World, Structural Organisation in Animals and Plants, Cell Structure & Function, Plant Physiology, and Human Physiology.',
    syllabusHighlights: [
      'Cell: The Unit of Life & Cell Cycle with Mitosis/Meiosis checkpoints',
      'Human Physiology: Cardiac Cycle, Nephron, Reflex Arc, Endocrine Glands',
      'Plant Physiology: Photosynthesis in C3/C4/CAM, Glycolysis, Krebs Cycle'
    ],
    pdfAvailable: true
  },
  {
    id: 'ndli-neet-bio-12-ncert',
    title: 'NCERT Biology Class 12 (Board & NEET Core)',
    subtitle: 'Genetics, Ecology, Reproduction and Molecular Biology',
    authors: 'NCERT Biology Faculty',
    publisher: 'NCERT / National Digital Library of India',
    examCategory: 'NEET',
    classGrade: 'Class 12',
    subject: 'Biology',
    ndliUrl: 'https://ndl.iitkgp.ac.in/ndl_se',
    sourceBadge: 'NDLI IIT Kharagpur Verified',
    openAccess: true,
    coverGradient: 'from-green-600 via-emerald-800 to-slate-900',
    chaptersCount: 13,
    description: 'Covers 50%+ of NEET biology weightage: Molecular Basis of Inheritance, Mendelian Genetics, Human Health & Disease, Biotechnology Principles & Applications, and Environmental Ecology.',
    syllabusHighlights: [
      'Molecular Genetics: DNA Replication, Transcription, Lac Operon, Genetic Code',
      'Biotechnology: Recombinant DNA Technology, PCR, Gel Electrophoresis, Bt Cotton',
      'Reproduction: Gametogenesis, Menstrual Cycle, Double Fertilization in Angiosperms'
    ],
    pdfAvailable: true
  },
  {
    id: 'ndli-neet-trueman-bio',
    title: "Trueman's Objective Biology for NEET (Vols I & II)",
    subtitle: 'High-Yield Theory, Diagrammatic Traps & Practice Question Bank',
    authors: 'Dr. K.N. Bhatia & Dr. M.P. Tyagi',
    publisher: 'Trueman Publishing / NDLI Reference Repository',
    examCategory: 'NEET',
    classGrade: 'Class 12',
    subject: 'Biology',
    ndliUrl: 'https://ndl.iitkgp.ac.in/ndl_se',
    sourceBadge: 'NDLI Reference Shelf',
    openAccess: true,
    coverGradient: 'from-teal-600 via-cyan-800 to-slate-900',
    chaptersCount: 38,
    description: 'Regarded by top medical rankers for exhaustive coverage of morphological terminologies, taxonomy mnemonics, and assertion-reason questions aligned with NTA NEET formats.',
    syllabusHighlights: [
      'Exhaustive anatomical diagram labels & histology micrographs',
      '4,000+ assertion-reasoning questions with detailed conceptual explanations',
      'Clinical correlates and medical application case vignettes'
    ],
    pdfAvailable: true
  },
  {
    id: 'ndli-neet-chem-tandon',
    title: 'GRB Organic & Inorganic Chemistry for NEET',
    subtitle: 'Reaction Mechanisms, Stereochemistry and NCERT Named Reactions',
    authors: 'Dr. O.P. Tandon & Dr. A.K. Virmani',
    publisher: 'G.R. Bathla Publications / NDLI Portal Archive',
    examCategory: 'NEET',
    classGrade: 'Class 11',
    subject: 'Chemistry',
    ndliUrl: 'https://ndl.iitkgp.ac.in/ndl_se',
    sourceBadge: 'NDLI Curated',
    openAccess: true,
    coverGradient: 'from-rose-600 via-red-800 to-slate-900',
    chaptersCount: 26,
    description: 'Comprehensive reaction pathway maps, Markovnikov vs Anti-Markovnikov additions, SN1/SN2 kinetics, coordination coordination chemistry, and periodic trends for NEET medical aspirants.',
    syllabusHighlights: [
      'Complete roadmaps for Aldehydes, Ketones, Carboxylic Acids and Amines',
      'Coordination compounds: Crystal Field Theory, Isomerism and IUPAC nomenclature',
      'Electrochemistry: Nernst equation calculations and standard reduction potentials'
    ],
    pdfAvailable: true
  },
  {
    id: 'ndli-neet-pyq-36years',
    title: '36 Years NEET Chapterwise & Topicwise Solved Papers (1988–2025)',
    subtitle: 'Complete NTA Question Bank with Error-Free Explanations',
    authors: 'NDLI National Exam Cell & IIT Kharagpur Academic Archivists',
    publisher: 'National Digital Library of India (Ministry of Education)',
    examCategory: 'NEET',
    classGrade: 'Dropper',
    subject: 'Biology',
    ndliUrl: 'https://ndl.iitkgp.ac.in/ndl_se',
    sourceBadge: 'Official NDLI IIT Kharagpur Archive',
    openAccess: true,
    coverGradient: 'from-amber-600 via-orange-800 to-slate-900',
    chaptersCount: 38,
    description: 'Direct compilation of every single NEET and AIPMT question asked from 1988 to 2025, categorized chapterwise with difficulty tags and trend analysis curves.',
    syllabusHighlights: [
      'Chapterwise weightage matrix for past 10 years of NTA NEET exams',
      'Predictive trend markers for high-frequency repeated questions',
      'Strict syllabus filter highlighting deleted vs retained topics'
    ],
    pdfAvailable: true
  },

  // --- JEE MAIN & JEE ADVANCED ---
  {
    id: 'ndli-jee-hcverma-vol1',
    title: 'Concepts of Physics (Volume 1 & 2)',
    subtitle: 'Mechanics, Thermodynamics, Optics and Electromagnetism',
    authors: 'Dr. H.C. Verma (Former Professor, IIT Kanpur)',
    publisher: 'Bharati Bhawan / NDLI IIT Kharagpur Open Collection',
    examCategory: 'JEE',
    classGrade: 'Class 11',
    subject: 'Physics',
    ndliUrl: 'https://ndl.iitkgp.ac.in/ndl_se',
    sourceBadge: 'IIT Kharagpur Recommended',
    openAccess: true,
    coverGradient: 'from-blue-600 via-indigo-800 to-slate-900',
    chaptersCount: 47,
    description: 'The holy grail for developing conceptual intuition in Physics. Celebrated worldwide for crystalline explanations of Newton’s Laws, Rotational Motion, Simple Harmonic Motion, Fluid Mechanics, Wave Optics, and Quantum Physics.',
    syllabusHighlights: [
      'Rotational Dynamics: Moment of Inertia, Rolling without Slipping, Angular Momentum',
      'SHM & Waves: Doppler Effect in Acoustics, Standing Waves, Resonance Columns',
      'Electrodynamics: Gauss Law surfaces, Ampere Maxwell circulation, LC oscillations'
    ],
    pdfAvailable: true
  },
  {
    id: 'ndli-jee-irodov-physics',
    title: 'Problems in General Physics (Advanced Problem Set)',
    subtitle: 'Rigorous Multi-Concept Analytical Problems for IIT-JEE Advanced',
    authors: 'I.E. Irodov (Moscow Institute of Physics and Technology)',
    publisher: 'Mir Publishers / NDLI Higher Technical Collection',
    examCategory: 'JEE',
    classGrade: 'Class 12',
    subject: 'Physics',
    ndliUrl: 'https://ndl.iitkgp.ac.in/ndl_se',
    sourceBadge: 'NDLI IIT Kharagpur Advanced Shelf',
    openAccess: true,
    coverGradient: 'from-purple-600 via-violet-800 to-slate-900',
    chaptersCount: 22,
    description: 'Legendary problem anthology for JEE Advanced aspirants targeting top 500 AIR ranks in IITs. Develops non-standard differential equation formulations and conservation principles.',
    syllabusHighlights: [
      'Kinematics in curved coordinate frames and relative velocity vector triangles',
      'Magnetic fields with complex relativistic current geometries',
      'Wave optics: Fresnel diffraction, thin film interference, and polarization'
    ],
    pdfAvailable: true
  },
  {
    id: 'ndli-jee-ms-chouhan',
    title: 'Advanced Problems in Organic Chemistry for JEE (Main & Advanced)',
    subtitle: 'Stereoisomerism, Reaction Intermediates and Multi-Step Synthesis',
    authors: 'M.S. Chouhan (Director, Vibrant Academy Kota)',
    publisher: 'Balaji Publications / NDLI Competitive Portal',
    examCategory: 'JEE',
    classGrade: 'Class 12',
    subject: 'Chemistry',
    ndliUrl: 'https://ndl.iitkgp.ac.in/ndl_se',
    sourceBadge: 'NDLI Exam Special',
    openAccess: true,
    coverGradient: 'from-indigo-600 via-purple-900 to-slate-900',
    chaptersCount: 28,
    description: 'The benchmark problem bank used by top Kota institutes for mastering nucleophilic substitutions, electrophilic aromatic reactions, carbonyl condensations, and stereoselective rearrangements.',
    syllabusHighlights: [
      'Carbocation rearrangements, pinacol-pinacolone, and Wagner-Meerwein shifts',
      'Aldol, Cannizzaro, Claisen, and Michael addition mechanistic sequences',
      'Optical isomerism: Enantiomers, Diastereomers, Meso compounds, and R/S configuration'
    ],
    pdfAvailable: true
  },
  {
    id: 'ndli-jee-pyq-46years',
    title: '46 Years IIT-JEE Advanced Chapterwise Solved Papers (1978–2025)',
    subtitle: 'Comprehensive IIT Screening, Mains & Advanced Question Archive',
    authors: 'NDLI Central Archive & Joint Entrance Examination Cell',
    publisher: 'National Digital Library of India (IIT Kharagpur Hub)',
    examCategory: 'JEE',
    classGrade: 'Dropper',
    subject: 'Mathematics',
    ndliUrl: 'https://ndl.iitkgp.ac.in/ndl_se',
    sourceBadge: 'NDLI Official IIT-KGP Archive',
    openAccess: true,
    coverGradient: 'from-cyan-600 via-blue-900 to-slate-900',
    chaptersCount: 32,
    description: 'Complete 46-year record of IIT entrance questions with step-by-step mathematical proofs, alternate calculus approaches, and matrix manipulation techniques.',
    syllabusHighlights: [
      'Definite Integrals: Newton-Leibniz formula, King\'s property, and Riemann sums',
      'Coordinate Geometry: Orthogonal conics, director circles, and parametric normals',
      'Vectors & 3D: Skew lines shortest distance, coplanarity scalar triple product'
    ],
    pdfAvailable: true
  },

  // --- CBSE CLASSES 9–12 OFFICIAL NCERT BOOKS ---
  {
    id: 'ndli-cbse-math-10-ncert',
    title: 'NCERT Mathematics Class 10 (Rationalised 2026–27)',
    subtitle: 'Official CBSE Prescribed Textbook with Real-World Applications',
    authors: 'NCERT Textbook Committee & CBSE Academic Branch',
    publisher: 'NCERT / National Digital Library of India',
    examCategory: 'CBSE',
    classGrade: 'Class 10',
    subject: 'Mathematics',
    ndliUrl: 'https://ndl.iitkgp.ac.in/ndl_se',
    sourceBadge: 'NCERT / NDLI Official',
    openAccess: true,
    coverGradient: 'from-amber-600 via-yellow-700 to-slate-900',
    chaptersCount: 14,
    description: 'Complete curriculum covering Real Numbers, Polynomials, Linear Equations in Two Variables, Quadratic Equations, Arithmetic Progressions, Triangles, Trigonometry, and Statistics.',
    syllabusHighlights: [
      'Fundamental Theorem of Arithmetic and proof of irrationality (√2, √3, √5)',
      'Trigonometric Identities & Heights and Distances applications',
      'Surface Areas & Volumes of combined solids with water flow problems'
    ],
    pdfAvailable: true
  },
  {
    id: 'ndli-cbse-sci-10-ncert',
    title: 'NCERT Science Class 10 (Rationalised 2026–27)',
    subtitle: 'Official Physics, Chemistry and Life Processes Integrated Textbook',
    authors: 'NCERT Science Directorate',
    publisher: 'NCERT / NDLI Ministry of Education',
    examCategory: 'CBSE',
    classGrade: 'Class 10',
    subject: 'Science',
    ndliUrl: 'https://ndl.iitkgp.ac.in/ndl_se',
    sourceBadge: 'NCERT / NDLI Official',
    openAccess: true,
    coverGradient: 'from-blue-600 via-cyan-800 to-slate-900',
    chaptersCount: 13,
    description: 'Official unified Science textbook featuring Chemical Reactions & Equations, Acids Bases & Salts, Metals & Non-metals, Carbon & its Compounds, Life Processes, Light, Electricity, and Magnetic Effects.',
    syllabusHighlights: [
      'Chemical Equations balancing & Redox reactions with displacement experiments',
      'Life Processes: Nutrition, Respiration, Double Circulation, and Excretion',
      'Ohm\'s Law, Series & Parallel resistance combinations, and Fleming\'s Left-Hand Rule'
    ],
    pdfAvailable: true
  },
  {
    id: 'ndli-cbse-sci-9-ncert',
    title: 'NCERT Science Class 9 (Official 2026–27 Edition)',
    subtitle: 'Matter, Living Organisms, Force, Motion and Sound Foundations',
    authors: 'NCERT Faculty',
    publisher: 'NCERT / National Digital Library of India',
    examCategory: 'CBSE',
    classGrade: 'Class 9',
    subject: 'Science',
    ndliUrl: 'https://ndl.iitkgp.ac.in/ndl_se',
    sourceBadge: 'NCERT / NDLI Official',
    openAccess: true,
    coverGradient: 'from-teal-600 via-emerald-800 to-slate-900',
    chaptersCount: 12,
    description: 'Fundamental STEM foundations: Matter in Our Surroundings, Is Matter Around Us Pure, Atoms & Molecules, Structure of Atom, Cell - The Fundamental Unit of Life, Tissues, Motion, and Gravitation.',
    syllabusHighlights: [
      'Laws of Chemical Combination: Conservation of Mass & Definite Proportions',
      'Equations of Motion (v=u+at, s=ut+½at², v²-u²=2as) via graphical methods',
      'Universal Law of Gravitation, Free Fall, and Archimedes\' Principle'
    ],
    pdfAvailable: true
  },
  {
    id: 'ndli-cbse-exemplar-12-pcm',
    title: 'NCERT Exemplar Problems Class 12 (Physics & Chemistry)',
    subtitle: 'Higher-Order Thinking Skills (HOTS) and Analytical Problems',
    authors: 'NCERT Research Panel & IIT KGP Pedagogy Team',
    publisher: 'NCERT / NDLI IIT Kharagpur Hub',
    examCategory: 'CBSE',
    classGrade: 'Class 12',
    subject: 'Physics',
    ndliUrl: 'https://ndl.iitkgp.ac.in/ndl_se',
    sourceBadge: 'NDLI HOTS Reference',
    openAccess: true,
    coverGradient: 'from-violet-600 via-indigo-900 to-slate-900',
    chaptersCount: 30,
    description: 'Specially created by top academic bodies to test deep concept mastery through multiple choice with one or more than one correct options, reasoning, and conceptual applications.',
    syllabusHighlights: [
      'Multi-correct objective questions matching JEE Advanced and CBSE Case Studies',
      'Assertion-Reasoning conceptual sets for high-scoring students',
      'Analytical numerical problems testing limit concepts and symmetry'
    ],
    pdfAvailable: true
  },

  // --- CUET-UG UNIVERSITY ENTRANCE ---
  {
    id: 'ndli-cuet-general-domain',
    title: 'CUET (UG) National Entrance Exam Comprehensive Guide',
    subtitle: 'Domain Subjects (Physics, Chemistry, Maths, Biology) + General Aptitude',
    authors: 'NDLI National University Entrance Group & IIT Kharagpur',
    publisher: 'National Digital Library of India (Ministry of Education)',
    examCategory: 'CUET',
    classGrade: 'Class 12',
    subject: 'General Test',
    ndliUrl: 'https://ndl.iitkgp.ac.in/ndl_se',
    sourceBadge: 'NDLI Central University Repository',
    openAccess: true,
    coverGradient: 'from-fuchsia-600 via-purple-900 to-slate-900',
    chaptersCount: 25,
    description: 'Prepared for aspirants seeking admission to Central Universities (Delhi University, BHU, JNU, AMU). Contains domain-specific syllabus maps, numerical aptitude, logical reasoning, and current affairs.',
    syllabusHighlights: [
      'Domain subject NCERT Class 12 complete syllabus alignment',
      'Quantitative aptitude, logical deduction, and verbal ability modules',
      'Computer-Based Test (CBT) speed and accuracy test simulations'
    ],
    pdfAvailable: true
  }
];
