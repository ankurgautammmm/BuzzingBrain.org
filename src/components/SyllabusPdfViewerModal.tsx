import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Search, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  PenTool, 
  BookOpen, 
  Sparkles,
  ExternalLink,
  Award,
  Layers,
  CheckCircle2
} from 'lucide-react';

interface SyllabusPdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateForChapter?: (classGrade: string, subject: string, chapter: string) => void;
  initialClass?: string;
}

interface SyllabusDocPage {
  pageNumber: number;
  headerTitle: string;
  category: 'Class 9' | 'Class 10' | 'Class 12' | 'Intro & Notes';
  subject: string;
  contentLines: string[];
}

export const SYLLABUS_2026_27_PAGES: SyllabusDocPage[] = [
  {
    pageNumber: 1,
    headerTitle: "Title & Academic Scope",
    category: "Intro & Notes",
    subject: "Overview",
    contentLines: [
      "CLASS 9, 10 & 12 SCIENCE / SOCIAL SCIENCE SYLLABUS REFERENCE — ACADEMIC SESSION 2026–27",
      "Prepared for the AI handwritten-notes /handwriting syllabus system",
      "",
      "Important Note for Students & Educators:",
      "This is a structured reference document for building the notes platform. Class 9 is undergoing curriculum transition under the new NCERT/NCF-SE framework, while CBSE has published the 2026–27 curriculum for Classes IX–XII.",
      "For final examination use, each chapter is mapped directly to the official NCERT/CBSE textbooks used by your school.",
      "",
      "Covered Curriculums in this Document:",
      "• Class 9: Science (7 units) & Social Science (15 units)",
      "• Class 10: Science (15 chapters) & Social Science (History, Geography, Political Science, Economics)",
      "• Class 12: Physics (14 theory chapters), Chemistry (10 chapters), Biology (14 chapters) & Social Science (History, Geography, Political Science, Economics)"
    ]
  },
  {
    pageNumber: 2,
    headerTitle: "Class 9 Science (Complete 7 Units)",
    category: "Class 9",
    subject: "Science",
    contentLines: [
      "CLASS 9 — SCIENCE",
      "",
      "1. Matter – Nature and Behaviour",
      "• Matter and its classification",
      "• States of matter",
      "• Physical and chemical changes",
      "• Elements, compounds and mixtures",
      "• Atoms and molecules",
      "• Atomic and molecular masses",
      "• Structure of the atom",
      "",
      "2. Organisation in Living Systems",
      "• Cell: the fundamental unit of life",
      "• Cell structure and functions",
      "• Cell organelles",
      "• Plant tissues",
      "• Animal tissues",
      "• Organisation of cells, tissues, organs and organ systems",
      "",
      "3. Motion",
      "• Distance and displacement",
      "• Speed and velocity",
      "• Acceleration",
      "• Uniform and non-uniform motion",
      "• Graphs of motion",
      "• Equations of motion",
      "",
      "4. Force and Laws of Motion",
      "• Force and its effects",
      "• Newton’s laws of motion",
      "• Inertia",
      "• Momentum",
      "• Conservation of momentum",
      "• Applications of Newton’s laws",
      "",
      "5. Work, Energy and Simple Machines",
      "• Work",
      "• Kinetic and potential energy",
      "• Conservation of energy",
      "• Power",
      "• Simple machines",
      "• Mechanical advantage",
      "",
      "6. Sound",
      "• Production and propagation of sound",
      "• Frequency, amplitude and time period",
      "• Speed of sound",
      "• Reflection and echo",
      "• Human ear",
      "• Applications of sound",
      "",
      "7. Food Production and Management",
      "• Crop production and protection",
      "• Irrigation",
      "• Manure and fertilisers",
      "• Animal husbandry",
      "• Dairy and poultry farming",
      "• Fisheries",
      "• Sustainable food production"
    ]
  },
  {
    pageNumber: 3,
    headerTitle: "Class 9 Social Science (Part 1)",
    category: "Class 9",
    subject: "Social Science",
    contentLines: [
      "CLASS 9 — SOCIAL SCIENCE (PART 1: CHAPTERS 1–10)",
      "",
      "1. Understanding Social Science",
      "• Meaning and nature of Social Science",
      "• Interdisciplinary understanding",
      "• Society and human interaction",
      "",
      "2. Shaping of the Earth’s Surface",
      "• Earth’s structure",
      "• Plate tectonics",
      "• Weathering, erosion and deposition",
      "• Landforms",
      "",
      "3. Atmosphere and Climate",
      "• Composition and structure of atmosphere",
      "• Weather and climate",
      "• Temperature and pressure",
      "• Winds, humidity and precipitation",
      "• Climate change",
      "",
      "4. Early Humans and Beginning of Civilisation",
      "• Human evolution",
      "• Hunter-gatherers",
      "• Agriculture and settlements",
      "• Early civilisations",
      "• Tools and technology",
      "",
      "5. State and Society – up to 1000 CE",
      "• Early states",
      "• Kingdoms and empires",
      "• Society and economy",
      "• Political and cultural developments",
      "",
      "6. Democracy",
      "• Meaning and features",
      "• Importance",
      "• Democratic institutions",
      "• Rights and responsibilities",
      "• Participation",
      "",
      "7. Elections",
      "• Elections and representation",
      "• Voting",
      "• Electoral systems",
      "• Election process",
      "• Political participation",
      "",
      "8. Building Blocks in Economics",
      "• Needs and wants",
      "• Resources",
      "• Production, consumption and distribution",
      "• Economic activities",
      "• Human resources",
      "",
      "9. The Price Puzzle: What Drives the Market",
      "• Markets",
      "• Demand and supply",
      "• Price determination",
      "• Consumers and producers",
      "",
      "10. Oceans and Life",
      "• Oceans and resources",
      "• Ocean currents",
      "• Marine ecosystems",
      "• Human dependence",
      "• Conservation"
    ]
  },
  {
    pageNumber: 4,
    headerTitle: "Class 9 Social Science (Part 2)",
    category: "Class 9",
    subject: "Social Science",
    contentLines: [
      "CLASS 9 — SOCIAL SCIENCE (PART 2: CHAPTERS 11–15)",
      "",
      "11. Life on Earth",
      "• Ecosystems",
      "• Biodiversity and biomes",
      "• Human interaction with nature",
      "• Conservation and sustainability",
      "",
      "12. Resistance and Resilience – 1000–1700 CE",
      "• Regional kingdoms",
      "• Resistance movements",
      "• Social, cultural and economic developments",
      "",
      "13. India and the World-I – 1900 BCE–1200 CE",
      "• Ancient India",
      "• Trade and cultural exchange",
      "• Civilisations",
      "• Knowledge and ideas",
      "",
      "14. Authority",
      "• Meaning and sources",
      "• Political and social authority",
      "• Institutions",
      "• Power and governance",
      "• Citizens",
      "",
      "15. From Ideas to Startups",
      "• Entrepreneurship",
      "• Innovation",
      "• Startups",
      "• MSMEs",
      "• Employment",
      "• Economic development"
    ]
  },
  {
    pageNumber: 5,
    headerTitle: "Class 10 Science (Chapters 1–8)",
    category: "Class 10",
    subject: "Science",
    contentLines: [
      "CLASS 10 — SCIENCE (REFERENCE STRUCTURE: CHAPTERS 1–8)",
      "",
      "1. Periodic Classification of Elements",
      "• Early attempts at classification",
      "• Döbereiner’s triads",
      "• Newlands’ law of octaves",
      "• Mendeleev’s periodic table",
      "• Modern periodic table",
      "• Periodic trends",
      "",
      "2. Chemical Reactions and Equations",
      "• Chemical equations",
      "• Balancing",
      "• Types of reactions",
      "• Oxidation and reduction",
      "• Corrosion",
      "• Rancidity",
      "",
      "3. Acids, Bases and Salts",
      "• Indicators",
      "• Chemical properties",
      "• pH scale",
      "• Salts",
      "• Common salts and uses",
      "",
      "4. Metals and Non-metals",
      "• Physical and chemical properties",
      "• Reactivity series",
      "• Ionic compounds",
      "• Extraction",
      "• Corrosion",
      "• Alloys",
      "",
      "5. Carbon and its Compounds",
      "• Covalent bonding",
      "• Hydrocarbons",
      "• Homologous series",
      "• Functional groups",
      "• Ethanol and ethanoic acid",
      "• Soaps and detergents",
      "",
      "6. Life Processes",
      "• Nutrition",
      "• Respiration",
      "• Transportation",
      "• Excretion",
      "• Plant and human life processes",
      "",
      "7. Control and Coordination",
      "• Nervous system",
      "• Brain and reflex action",
      "• Hormones",
      "• Plant hormones",
      "• Tropic movements",
      "",
      "8. How do Organisms Reproduce?",
      "• Asexual reproduction",
      "• Sexual reproduction",
      "• Human reproductive system",
      "• Fertilisation",
      "• Reproductive health",
      "• Plant reproduction"
    ]
  },
  {
    pageNumber: 6,
    headerTitle: "Class 10 Science (Chapters 9–15) & History Intro",
    category: "Class 10",
    subject: "Science",
    contentLines: [
      "CLASS 10 — SCIENCE (CHAPTERS 9–15)",
      "",
      "9. Heredity",
      "• Heredity and variation",
      "• Mendel’s experiments",
      "• Inheritance",
      "• Sex determination",
      "• Evolution",
      "",
      "10. Light – Reflection and Refraction",
      "• Reflection",
      "• Spherical mirrors",
      "• Mirror formula",
      "• Refraction",
      "• Lenses",
      "• Lens formula",
      "• Power of lens",
      "",
      "11. Human Eye and the Colourful World",
      "• Human eye",
      "• Accommodation",
      "• Defects of vision",
      "• Dispersion",
      "• Atmospheric refraction",
      "• Scattering",
      "",
      "12. Electricity",
      "• Current",
      "• Potential difference",
      "• Resistance",
      "• Ohm’s law",
      "• Series and parallel circuits",
      "• Heating effect",
      "• Power and energy",
      "",
      "13. Magnetic Effects of Electric Current",
      "• Magnetic fields",
      "• Electromagnets",
      "• Fleming’s rules",
      "• Electric motor",
      "• Electromagnetic induction",
      "• Generator",
      "",
      "14. Our Environment",
      "• Ecosystems",
      "• Food chains and webs",
      "• Trophic levels",
      "• Energy flow",
      "• Biodegradable and non-biodegradable substances",
      "• Ozone",
      "",
      "15. Sustainable Management of Natural Resources",
      "• Natural resources",
      "• Forests and wildlife",
      "• Water",
      "• Coal and petroleum",
      "• Conservation",
      "• Sustainable development",
      "",
      "SOCIAL SCIENCE — HISTORY",
      "1. The Rise of Nationalism in Europe",
      "• French Revolution",
      "• Nationalism"
    ]
  },
  {
    pageNumber: 7,
    headerTitle: "Class 10 History & Geography",
    category: "Class 10",
    subject: "Social Science",
    contentLines: [
      "CLASS 10 — SOCIAL SCIENCE (HISTORY & GEOGRAPHY)",
      "",
      "HISTORY (CONTINUED)",
      "• Liberalism",
      "• Unification of Germany and Italy",
      "• Balkan nationalism",
      "",
      "2. Nationalism in India",
      "• First World War",
      "• Non-Cooperation Movement",
      "• Civil Disobedience Movement",
      "• Salt March",
      "• Quit India Movement",
      "• Different groups and nationalism",
      "",
      "3. The Making of a Global World",
      "• Pre-modern trade",
      "• Migration",
      "• Global economy",
      "• Colonialism",
      "• Industrialisation",
      "• Globalisation",
      "",
      "4. The Age of Industrialisation",
      "• Industrial Revolution",
      "• Factories",
      "• Industrial production",
      "• Workers",
      "• Industrialisation in India",
      "",
      "5. Print Culture and the Modern World",
      "• Printing technology",
      "• Print revolution",
      "• Religion and print",
      "• Print and politics",
      "• Newspapers",
      "• Print culture in India",
      "",
      "GEOGRAPHY",
      "1. Resources and Development",
      "• Resources",
      "• Resource planning",
      "• Land and soil resources",
      "• Soil conservation",
      "",
      "2. Forest and Wildlife Resources",
      "• Biodiversity",
      "• Forest resources",
      "• Wildlife",
      "• Conservation",
      "• Community participation",
      "",
      "3. Water Resources",
      "• Water scarcity",
      "• Multipurpose projects",
      "• Dams",
      "• Rainwater harvesting",
      "• Water conservation",
      "",
      "4. Agriculture",
      "• Types of farming",
      "• Major crops",
      "• Technological developments",
      "• Food security",
      "",
      "5. Minerals and Energy Resources",
      "• Minerals",
      "• Metallic and non-metallic minerals"
    ]
  },
  {
    pageNumber: 8,
    headerTitle: "Class 10 Geography, Civics & Economics",
    category: "Class 10",
    subject: "Social Science",
    contentLines: [
      "CLASS 10 — SOCIAL SCIENCE (CONTINUED)",
      "",
      "GEOGRAPHY (CONTINUED)",
      "• Conventional and non-conventional energy",
      "6. Manufacturing Industries",
      "• Importance",
      "• Industrial sectors",
      "• Industrial location",
      "• Industrial pollution",
      "7. Lifelines of National Economy",
      "• Transport (Roadways, Railways, Pipelines, Waterways, Airways)",
      "• Communication",
      "• International trade",
      "• Tourism",
      "",
      "POLITICAL SCIENCE (CIVICS)",
      "1. Power Sharing",
      "2. Federalism",
      "3. Gender, Religion and Caste",
      "4. Political Parties",
      "5. Outcomes of Democracy",
      "",
      "ECONOMICS",
      "1. Development",
      "• Development goals",
      "• Income",
      "• Quality of life",
      "• Human development",
      "2. Sectors of the Indian Economy",
      "• Primary, secondary and tertiary sectors",
      "• Organised and unorganised sectors",
      "• Public and private sectors",
      "3. Money and Credit",
      "• Money",
      "• Formal and informal credit",
      "• Banks",
      "• Self-help groups",
      "4. Globalisation and the Indian Economy",
      "• Globalisation",
      "• MNCs",
      "• Production across countries",
      "• Liberalisation",
      "• Impact on India",
      "5. Consumer Rights",
      "• Consumer awareness",
      "• Consumer protection",
      "• Consumer courts",
      "• Rights and responsibilities"
    ]
  },
  {
    pageNumber: 9,
    headerTitle: "Class 12 Physics & Chemistry (Part 1)",
    category: "Class 12",
    subject: "Science",
    contentLines: [
      "CLASS 12 — SCIENCE: PHYSICS & CHEMISTRY",
      "",
      "PHYSICS",
      "Unit I–II: Electrostatics & Current Electricity",
      "• Electric Charges and Fields",
      "• Electrostatic Potential and Capacitance",
      "• Current Electricity",
      "",
      "Unit III–V: Magnetism, EMI, AC & Electromagnetic Waves",
      "• Moving Charges and Magnetism",
      "• Magnetism and Matter",
      "• Electromagnetic Induction",
      "• Alternating Current",
      "• Electromagnetic Waves",
      "",
      "Unit VI: Optics",
      "• Ray Optics and Optical Instruments",
      "• Wave Optics",
      "",
      "Unit VII: Dual Nature",
      "• Dual Nature of Radiation and Matter",
      "",
      "Unit VIII: Atoms and Nuclei",
      "• Atoms",
      "• Nuclei",
      "",
      "Unit IX: Electronic Devices",
      "• Semiconductor Electronics: Materials, Devices and Simple Circuits",
      "",
      "CHEMISTRY",
      "1. Solutions",
      "• Concentration terms",
      "• Solubility",
      "• Colligative properties",
      "• Abnormal molar masses",
      "",
      "2. Electrochemistry",
      "• Electrochemical cells",
      "• Nernst equation",
      "• Conductance",
      "• Electrolysis",
      "• Batteries and fuel cells",
      "",
      "3. Chemical Kinetics",
      "• Rate of reaction",
      "• Factors affecting rate",
      "• Integrated rate equations",
      "• Activation energy",
      "",
      "4. d- and f-Block Elements",
      "• Electronic configuration",
      "• Properties",
      "• Compounds",
      "• Lanthanides and actinides",
      "",
      "5. Coordination Compounds",
      "• Coordination entities",
      "• Nomenclature",
      "• Isomerism",
      "• Bonding",
      "• Applications",
      "",
      "6. Haloalkanes and Haloarenes",
      "• Nomenclature"
    ]
  },
  {
    pageNumber: 10,
    headerTitle: "Class 12 Chemistry (Part 2) & Biology (Part 1)",
    category: "Class 12",
    subject: "Science",
    contentLines: [
      "CLASS 12 — CHEMISTRY (CONTINUED) & BIOLOGY",
      "",
      "CHEMISTRY (CONTINUED)",
      "• Preparation",
      "• Properties",
      "• Reactions",
      "• Environmental effects",
      "",
      "7. Alcohols, Phenols and Ethers",
      "• Preparation",
      "• Properties",
      "• Reactions",
      "• Uses",
      "",
      "8. Aldehydes, Ketones and Carboxylic Acids",
      "• Structure",
      "• Preparation",
      "• Properties",
      "• Reactions",
      "• Uses",
      "",
      "9. Amines",
      "• Classification",
      "• Nomenclature",
      "• Preparation",
      "• Properties",
      "• Reactions",
      "",
      "10. Biomolecules",
      "• Carbohydrates",
      "• Proteins",
      "• Enzymes",
      "• Vitamins",
      "• Nucleic acids",
      "",
      "BIOLOGY",
      "1. Sexual Reproduction in Flowering Plants",
      "• Flower structure",
      "• Gametophytes",
      "• Pollination",
      "• Fertilisation",
      "• Embryo and seed development",
      "• Special modes of reproduction",
      "",
      "2. Human Reproduction",
      "• Male and female reproductive systems",
      "• Gametogenesis",
      "• Menstrual cycle",
      "• Fertilisation",
      "• Embryo development",
      "• Pregnancy",
      "• Parturition and lactation",
      "",
      "3. Reproductive Health",
      "• STDs",
      "• Birth control",
      "• Contraception",
      "• MTP",
      "• Infertility",
      "• Assisted reproductive technologies",
      "",
      "4. Principles of Inheritance and Variation",
      "• Mendelian genetics",
      "• Inheritance",
      "• Chromosomal theory",
      "• Sex determination"
    ]
  },
  {
    pageNumber: 11,
    headerTitle: "Class 12 Biology (Chapters 5–13)",
    category: "Class 12",
    subject: "Biology",
    contentLines: [
      "CLASS 12 — BIOLOGY (CONTINUED)",
      "",
      "• Mutation",
      "• Genetic disorders",
      "",
      "5. Molecular Basis of Inheritance",
      "• DNA",
      "• RNA",
      "• Replication",
      "• Transcription",
      "• Translation",
      "• Genetic code",
      "• Gene expression",
      "",
      "6. Evolution",
      "• Origin of life",
      "• Evolution",
      "• Evidence",
      "• Natural selection",
      "• Human evolution",
      "",
      "7. Human Health and Disease",
      "• Health and disease",
      "• Pathogens",
      "• Common diseases",
      "• Immunity",
      "• AIDS",
      "• Cancer",
      "• Drugs and alcohol abuse",
      "",
      "8. Microbes in Human Welfare",
      "• Food processing",
      "• Industrial production",
      "• Sewage treatment",
      "• Biocontrol",
      "• Biofertilisers",
      "",
      "9. Biotechnology: Principles and Processes",
      "• Recombinant DNA technology",
      "• Vectors",
      "• PCR",
      "• Gene cloning",
      "• Bioreactors",
      "",
      "10. Biotechnology and its Applications",
      "• Medicine",
      "• GMOs",
      "• Gene therapy",
      "• Transgenic organisms",
      "• Biosafety",
      "",
      "11. Organisms and Populations",
      "• Population attributes",
      "• Growth",
      "• Interactions",
      "• Adaptations",
      "",
      "12. Ecosystem",
      "• Components",
      "• Productivity",
      "• Decomposition",
      "• Energy flow",
      "• Ecological pyramids",
      "",
      "13. Biodiversity and Conservation",
      "• Biodiversity",
      "• Patterns",
      "• Importance"
    ]
  },
  {
    pageNumber: 12,
    headerTitle: "Class 12 Biology (Ch 14) & History (Ch 1–8)",
    category: "Class 12",
    subject: "Social Science",
    contentLines: [
      "CLASS 12 — BIOLOGY (CONCLUDED) & SOCIAL SCIENCE: HISTORY",
      "",
      "BIOLOGY",
      "• Threats",
      "• Conservation",
      "14. Environmental Issues",
      "• Air and water pollution",
      "• Solid waste",
      "• E-waste",
      "• Global warming",
      "• Ozone depletion",
      "• Environmental protection",
      "",
      "SOCIAL SCIENCE — HISTORY",
      "1. Bricks, Beads and Bones: The Harappan Civilisation",
      "• Urban centres",
      "• Craft production",
      "• Trade",
      "• Social and economic life",
      "• Archaeological evidence",
      "",
      "2. Kings, Farmers and Towns",
      "• Political history",
      "• Agriculture",
      "• Trade",
      "• Towns and state formation",
      "",
      "3. Kinship, Caste and Class",
      "• Kinship",
      "• Caste",
      "• Class",
      "• Social relations",
      "• Patriarchy",
      "",
      "4. Thinkers, Beliefs and Buildings",
      "• Religious traditions",
      "• Buddhism and Jainism",
      "• Stupas",
      "• Temples",
      "• Philosophical ideas",
      "",
      "5. Through the Eyes of Travellers",
      "• Accounts of foreign travellers",
      "• Society",
      "• Culture",
      "• Economy",
      "",
      "6. Bhakti-Sufi Traditions",
      "• Bhakti traditions",
      "• Sufi traditions",
      "• Religious and cultural interactions",
      "",
      "7. An Imperial Capital: Vijayanagara",
      "• Capital city",
      "• Architecture",
      "• Economy",
      "• Society",
      "• Political system",
      "",
      "8. Peasants, Zamindars and the State",
      "• Agrarian society",
      "• Mughal administration",
      "• Land revenue",
      "• Rural economy"
    ]
  },
  {
    pageNumber: 13,
    headerTitle: "Class 12 History (Ch 9–15) & Geography Intro",
    category: "Class 12",
    subject: "Social Science",
    contentLines: [
      "CLASS 12 — HISTORY (CONCLUDED) & GEOGRAPHY",
      "",
      "9. Kings and Chronicles",
      "• Mughal court",
      "• Akbar",
      "• Chronicles",
      "• Political culture",
      "",
      "10. Colonialism and the Countryside",
      "• Colonial land revenue",
      "• Rural society",
      "• Peasants",
      "• Indigo cultivation",
      "",
      "11. Rebels and the Raj",
      "• 1857 revolt",
      "• Causes",
      "• Events",
      "• Consequences",
      "",
      "12. Colonial Cities",
      "• Urbanisation",
      "• Colonial cities",
      "• Architecture",
      "• Municipal institutions",
      "",
      "13. Mahatma Gandhi and the Nationalist Movement",
      "• Gandhian movements",
      "• Civil disobedience",
      "• Quit India",
      "• Popular participation",
      "",
      "14. Understanding Partition",
      "• Partition",
      "• Migration",
      "• Violence",
      "• Oral histories",
      "",
      "15. Framing the Constitution",
      "• Constituent Assembly",
      "• Constitution",
      "• Federalism",
      "• Fundamental rights",
      "",
      "GEOGRAPHY",
      "1. Human Geography: Nature and Scope",
      "• Nature and scope",
      "• Human-environment relationships",
      "",
      "2. Population",
      "• Distribution",
      "• Density",
      "• Growth",
      "• Composition",
      "• Migration",
      "",
      "3. Human Development",
      "• Concept",
      "• Indicators",
      "• International comparisons",
      "",
      "4. Primary Activities",
      "• Agriculture",
      "• Mining",
      "• Fishing",
      "• Forestry",
      "• Pastoralism"
    ]
  },
  {
    pageNumber: 14,
    headerTitle: "Class 12 Geography, Political Science & Economics Intro",
    category: "Class 12",
    subject: "Social Science",
    contentLines: [
      "CLASS 12 — GEOGRAPHY (CONCLUDED), POLITICAL SCIENCE & ECONOMICS",
      "",
      "GEOGRAPHY (CONTINUED)",
      "5. Secondary Activities",
      "• Manufacturing",
      "• Industrial location",
      "• Industrial regions",
      "6. Tertiary and Quaternary Activities",
      "• Services",
      "• Transport",
      "• Communication",
      "• Knowledge-based activities",
      "7. Transport and Communication",
      "• Roadways",
      "• Railways",
      "• Waterways",
      "• Airways",
      "• Communication",
      "8. International Trade",
      "• Trade",
      "• Ports",
      "• Trade balance",
      "• Global trade",
      "",
      "POLITICAL SCIENCE",
      "1. The End of Bipolarity",
      "• Soviet Union",
      "• End of Cold War",
      "• New world order",
      "2. Contemporary Centres of Power",
      "• European Union",
      "• China",
      "• ASEAN",
      "• Japan",
      "• South Korea",
      "3. Contemporary South Asia",
      "• South Asian politics",
      "• India and neighbours",
      "• Democracy and conflicts",
      "4. International Organizations",
      "• UN",
      "• Reforms",
      "• Global institutions",
      "5. Security in the Contemporary World",
      "• Traditional and non-traditional security",
      "• Human security",
      "• Cooperative security",
      "6. Environment and Natural Resources",
      "• Environmental issues",
      "• Global commons",
      "• Resource politics",
      "7. Globalisation",
      "• Meaning",
      "• Causes",
      "• Consequences",
      "• Resistance",
      "• India",
      "",
      "ECONOMICS",
      "1. National Income and Related Aggregates"
    ]
  },
  {
    pageNumber: 15,
    headerTitle: "Class 12 Economics (Macro & Indian Development)",
    category: "Class 12",
    subject: "Economics",
    contentLines: [
      "CLASS 12 — ECONOMICS",
      "",
      "1. National Income (Continued)",
      "• National income",
      "• GDP",
      "• GNP",
      "• Methods of measurement",
      "• Real and nominal GDP",
      "",
      "2. Money and Banking",
      "• Money",
      "• Commercial banks",
      "• Central bank",
      "• Credit creation",
      "• Monetary policy",
      "",
      "3. Determination of Income and Employment",
      "• Aggregate demand",
      "• Consumption",
      "• Investment",
      "• Multiplier",
      "• Equilibrium income",
      "",
      "4. Government Budget and the Economy",
      "• Budget",
      "• Revenue",
      "• Expenditure",
      "• Deficit",
      "• Fiscal policy",
      "",
      "5. Balance of Payments",
      "• Current account",
      "• Capital account",
      "• Exchange rate",
      "• Balance of payments",
      "",
      "6. Indian Economy on the Eve of Independence",
      "• Colonial economy",
      "• Agriculture",
      "• Industry",
      "• Trade",
      "",
      "7. Indian Economy 1950–1990",
      "• Planning",
      "• Agriculture",
      "• Industry",
      "• Trade",
      "• Public sector",
      "",
      "8. Liberalisation, Privatisation and Globalisation",
      "• Economic reforms",
      "• LPG",
      "• MNCs",
      "• Globalisation",
      "",
      "9. Human Capital Formation",
      "• Education",
      "• Health",
      "• Skills",
      "• Economic development",
      "",
      "10. Rural Development",
      "• Rural credit",
      "• Agricultural diversification",
      "• Organic farming",
      "• Rural infrastructure",
      "",
      "11. Employment",
      "• Employment patterns"
    ]
  },
  {
    pageNumber: 16,
    headerTitle: "Class 12 Economics (Chapters 11–14)",
    category: "Class 12",
    subject: "Economics",
    contentLines: [
      "CLASS 12 — ECONOMICS (CONCLUDED)",
      "",
      "11. Employment (Continued)",
      "• Unemployment",
      "• Formal and informal sectors",
      "",
      "12. Infrastructure",
      "• Energy",
      "• Transport",
      "• Communication",
      "• Health",
      "• Education",
      "",
      "13. Environment and Sustainable Development",
      "• Environmental degradation",
      "• Sustainable development",
      "• Policies",
      "",
      "14. Development Experience of India",
      "• Comparative development",
      "• Human development",
      "• Economic performance"
    ]
  },
  {
    pageNumber: 17,
    headerTitle: "Source & Implementation Note",
    category: "Intro & Notes",
    subject: "Source Note",
    contentLines: [
      "SOURCE & IMPLEMENTATION NOTE",
      "",
      "CBSE has released the 2026–27 curriculum for Classes IX–XII.",
      "The Class XII Physics curriculum, for example, contains nine units and fourteen theory chapters;",
      "CBSE also lists Science and Social Science among the compulsory Class X subjects.",
      "",
      "Integration with Buzzing Brain Notes Engine:",
      "• Every chapter listed in this official reference document is directly synthesizable via the /handwriting AI command.",
      "• Use /handwriting [chapter name] --class [9|10|12] to produce authentic student notes in ruled register format with verified equations, definitions, diagrams, and model exam answers.",
      "• Notes follow official NCERT textbook terminology and CBSE grading criteria."
    ]
  }
];

export const SyllabusPdfViewerModal: React.FC<SyllabusPdfViewerModalProps> = ({
  isOpen,
  onClose,
  onGenerateForChapter,
  initialClass = 'Class 10',
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassTab, setSelectedClassTab] = useState<string>(initialClass || 'Class 10');

  if (!isOpen) return null;

  const currentDocPage = SYLLABUS_2026_27_PAGES.find(p => p.pageNumber === currentPage) || SYLLABUS_2026_27_PAGES[0];

  const handleDownloadSyllabus = () => {
    const originalTitle = document.title;
    document.title = "CBSE_NCERT_Syllabus_Reference_2026-27_Classes_9_10_12";
    window.print();
    setTimeout(() => { document.title = originalTitle; }, 1000);
  };

  const jumpToClass = (cls: string) => {
    setSelectedClassTab(cls);
    if (cls === 'Class 9') setCurrentPage(2);
    else if (cls === 'Class 10') setCurrentPage(5);
    else if (cls === 'Class 12') setCurrentPage(9);
    else setCurrentPage(1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      <div className="bg-[#0b0f1a] border border-white/20 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* Modal Top Header Bar */}
        <div className="px-6 py-4 bg-[#070a14] border-b border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base">
                  Official NCERT &amp; CBSE Syllabus Reference
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
                  2026–27 Academic Session
                </span>
              </div>
              <p className="text-xs text-slate-400">
                17-Page Curriculum Reference for Classes 9, 10 &amp; 12 (Science &amp; Social Science)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadSyllabus}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-md"
              title="Print or Save as PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation & Controls Bar */}
        <div className="px-6 py-3 bg-black/40 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Class Jump Buttons */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold mr-1">Curriculum:</span>
            {['Overview', 'Class 9', 'Class 10', 'Class 12'].map((cls) => (
              <button
                key={cls}
                onClick={() => jumpToClass(cls)}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  (cls === 'Overview' && currentPage === 1) ||
                  (cls === 'Class 9' && (currentPage >= 2 && currentPage <= 4)) ||
                  (cls === 'Class 10' && (currentPage >= 5 && currentPage <= 8)) ||
                  (cls === 'Class 12' && (currentPage >= 9 && currentPage <= 16))
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>

          {/* Page Indicator & Next/Prev */}
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="font-mono text-slate-300 font-bold">
              Page {currentPage} of 17
            </span>

            <button
              disabled={currentPage >= 17}
              onClick={() => setCurrentPage(p => Math.min(17, p + 1))}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Document Content Pane (Simulating Official PDF Paper Sheet) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#05070e] flex justify-center">
          <div className="w-full max-w-3xl bg-[#fdfdfb] text-slate-900 rounded-2xl shadow-2xl p-8 sm:p-12 font-sans border border-slate-300 relative min-h-[680px] flex flex-col justify-between">
            
            {/* Top Sheet Running Header */}
            <div>
              <div className="flex items-center justify-between border-b-2 border-slate-300 pb-3 mb-6 text-xs text-slate-500 font-mono">
                <span>Class 9, 10 &amp; 12 Science / Social Science — 2026–27</span>
                <span>Page {currentDocPage.pageNumber}</span>
              </div>

              {/* Page Section Title */}
              <div className="mb-6">
                <span className="text-[11px] font-mono uppercase tracking-widest font-bold text-amber-800 px-2 py-0.5 rounded bg-amber-100 border border-amber-300">
                  {currentDocPage.category} &bull; {currentDocPage.subject}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-2 tracking-tight">
                  {currentDocPage.headerTitle}
                </h2>
              </div>

              {/* Document Text Body */}
              <div className="space-y-2 text-sm sm:text-base leading-relaxed text-slate-800">
                {currentDocPage.contentLines.map((line, idx) => {
                  const isMainHeading = /^[0-9]+\.\s+[A-Z]/.test(line.trim()) || /^[A-Z\s]{4,}$/.test(line.trim());
                  const isBullet = line.trim().startsWith('•');

                  if (!line.trim()) {
                    return <div key={idx} className="h-3" />;
                  }

                  if (isMainHeading) {
                    // Extract chapter title for 1-click note synthesis
                    const cleanChName = line.replace(/^[0-9]+\.\s*/, '').trim();

                    return (
                      <div key={idx} className="pt-3 pb-1 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 mt-2">
                        <span className="font-extrabold text-slate-950 text-base sm:text-lg">
                          {line}
                        </span>

                        {onGenerateForChapter && (
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onGenerateForChapter(
                                currentDocPage.category === 'Class 9' ? 'Class 9' : (currentDocPage.category === 'Class 10' ? 'Class 10' : 'Class 12'),
                                currentDocPage.subject,
                                cleanChName
                              );
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs transition-colors cursor-pointer"
                          >
                            <PenTool className="w-3.5 h-3.5" />
                            <span>Synthesize Notes</span>
                          </button>
                        )}
                      </div>
                    );
                  }

                  if (isBullet) {
                    return (
                      <div key={idx} className="pl-4 flex items-start gap-2 text-slate-700">
                        <span className="text-amber-600 font-bold select-none">•</span>
                        <span>{line.replace(/^•\s*/, '')}</span>
                      </div>
                    );
                  }

                  return (
                    <p key={idx} className="text-slate-700">
                      {line}
                    </p>
                  );
                })}
              </div>
            </div>

            {/* Bottom Sheet Running Footer */}
            <div className="border-t border-slate-200 pt-4 mt-8 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Buzzing Brain &bull; Official Curriculum Reference</span>
              <span>Academic Session 2026–27 &bull; Page {currentDocPage.pageNumber} of 17</span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="px-6 py-4 bg-[#070a14] border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-slate-400">
            Click <strong>Synthesize Notes</strong> on any chapter above to generate full handwritten study sheets immediately.
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-40 cursor-pointer"
            >
              Previous Page
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(17, p + 1))}
              disabled={currentPage >= 17}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-40 cursor-pointer"
            >
              Next Page
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
