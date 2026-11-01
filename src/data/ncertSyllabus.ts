/**
 * Official NCERT & CBSE Syllabus Database (Academic Session 2026–27)
 * Directly reconciled with the 2026–27 Science & Social Science Syllabus Reference Document.
 * Covers Classes 9, 10, 11, and 12 across Science, Social Science, and Mathematics.
 */

export interface NCERTChapterItem {
  number: number;
  name: string;
  keyTopics: string[];
  unit: string;
  pageCount?: number;
  ncertBookCode?: string;
}

export interface NCERTSubjectMap {
  [subject: string]: NCERTChapterItem[];
}

export interface NCERTSyllabusDatabase {
  [classGrade: string]: NCERTSubjectMap;
}

export const NCERT_SYLLABUS: NCERTSyllabusDatabase = {
  // ==========================================
  // CLASS 9 (Academic Session 2026–27)
  // ==========================================
  "Class 9": {
    "Science": [
      {
        number: 1,
        name: "Matter – Nature and Behaviour",
        unit: "Matter - Nature and Behaviour",
        keyTopics: [
          "Matter and its classification",
          "States of matter (Solid, Liquid, Gas) & interconversion",
          "Physical and chemical changes",
          "Elements, compounds and mixtures",
          "Atoms and molecules & laws of chemical combination",
          "Atomic and molecular masses, Formula mass",
          "Structure of the atom (Electrons, Protons, Neutrons, Valency, Isotopes)"
        ]
      },
      {
        number: 2,
        name: "Organisation in Living Systems",
        unit: "Living World",
        keyTopics: [
          "Cell: the fundamental unit of life",
          "Cell structure and functions (Plasma membrane, Cell wall, Nucleus, Cytoplasm)",
          "Cell organelles (ER, Golgi, Lysosomes, Mitochondria, Plastids, Vacuoles)",
          "Plant tissues (Meristematic and Permanent - Xylem, Phloem)",
          "Animal tissues (Epithelial, Connective, Muscular, Nervous)",
          "Organisation of cells, tissues, organs and organ systems"
        ]
      },
      {
        number: 3,
        name: "Motion",
        unit: "Motion, Force and Work",
        keyTopics: [
          "Distance and displacement",
          "Speed and velocity (Average and instantaneous)",
          "Acceleration and retardation",
          "Uniform and non-uniform motion",
          "Graphs of motion (Distance-time, Velocity-time)",
          "Equations of motion by graphical method (v = u + at, s = ut + ½at², v² = u² + 2as)"
        ]
      },
      {
        number: 4,
        name: "Force and Laws of Motion",
        unit: "Motion, Force and Work",
        keyTopics: [
          "Force and its effects (Balanced and unbalanced forces)",
          "Newton’s laws of motion (First, Second, and Third laws)",
          "Inertia and mass",
          "Momentum (p = mv)",
          "Conservation of linear momentum",
          "Applications of Newton’s laws in everyday life"
        ]
      },
      {
        number: 5,
        name: "Work, Energy and Simple Machines",
        unit: "Motion, Force and Work",
        keyTopics: [
          "Work done by a constant force",
          "Kinetic and potential energy",
          "Conservation of mechanical energy",
          "Power and commercial unit of energy (kWh)",
          "Simple machines (Levers, Pulleys, Inclined planes)",
          "Mechanical advantage and efficiency"
        ]
      },
      {
        number: 6,
        name: "Sound",
        unit: "Waves and Sound",
        keyTopics: [
          "Production and propagation of sound in various media",
          "Frequency, amplitude, wavelength and time period",
          "Speed of sound",
          "Reflection of sound and echo",
          "Human ear (Structure and hearing mechanism)",
          "Applications of sound (Ultrasound, SONAR)"
        ]
      },
      {
        number: 7,
        name: "Food Production and Management",
        unit: "Food Resources",
        keyTopics: [
          "Crop production and protection management",
          "Irrigation techniques and water management",
          "Manure and fertilisers (Nutrient management)",
          "Animal husbandry (Cattle farming)",
          "Dairy and poultry farming",
          "Fisheries (Marine and Inland capture/culture)",
          "Sustainable food production and organic practices"
        ]
      }
    ],
    "Social Science": [
      {
        number: 1,
        name: "Understanding Social Science",
        unit: "Foundation",
        keyTopics: ["Meaning and nature of Social Science", "Interdisciplinary understanding", "Society and human interaction"]
      },
      {
        number: 2,
        name: "Shaping of the Earth’s Surface",
        unit: "Geography",
        keyTopics: ["Earth’s structure and core layers", "Plate tectonics and continental drift", "Weathering, erosion and deposition", "Major landforms of the Earth"]
      },
      {
        number: 3,
        name: "Atmosphere and Climate",
        unit: "Geography",
        keyTopics: ["Composition and structure of atmosphere", "Weather and climate factors", "Temperature and pressure belts", "Winds, humidity and precipitation", "Global climate change"]
      },
      {
        number: 4,
        name: "Early Humans and Beginning of Civilisation",
        unit: "History",
        keyTopics: ["Human evolution", "Hunter-gatherers lifestyle", "Agriculture and early settlements", "Early river valley civilisations", "Tools, metallurgy and technology"]
      },
      {
        number: 5,
        name: "State and Society – up to 1000 CE",
        unit: "History",
        keyTopics: ["Early states and Mahajanapadas", "Kingdoms and empires (Mauryan, Gupta)", "Society, economy and trade routes", "Political and cultural developments"]
      },
      {
        number: 6,
        name: "Democracy",
        unit: "Political Science",
        keyTopics: ["Meaning and essential features of democracy", "Importance and arguments for democracy", "Democratic institutions", "Rights and responsibilities of citizens", "Democratic participation"]
      },
      {
        number: 7,
        name: "Elections",
        unit: "Political Science",
        keyTopics: ["Elections and democratic representation", "Voting rights and universal adult suffrage", "Electoral systems", "Election process in India", "Political parties and citizen participation"]
      },
      {
        number: 8,
        name: "Building Blocks in Economics",
        unit: "Economics",
        keyTopics: ["Needs and wants distinction", "Economic resources (Land, Labour, Capital, Enterprise)", "Production, consumption and distribution", "Economic activities", "Human resources and development"]
      },
      {
        number: 9,
        name: "The Price Puzzle: What Drives the Market",
        unit: "Economics",
        keyTopics: ["Markets and marketplace operations", "Demand and supply forces", "Price determination in markets", "Roles of consumers and producers"]
      },
      {
        number: 10,
        name: "Oceans and Life",
        unit: "Geography",
        keyTopics: ["Oceans and marine resources", "Major ocean currents (Warm and cold)", "Marine ecosystems and food webs", "Human dependence on oceanic systems", "Marine conservation"]
      },
      {
        number: 11,
        name: "Life on Earth",
        unit: "Geography & Ecology",
        keyTopics: ["Ecosystem concepts", "Biodiversity and major biomes", "Human interaction with nature", "Conservation and sustainable development"]
      },
      {
        number: 12,
        name: "Resistance and Resilience – 1000–1700 CE",
        unit: "History",
        keyTopics: ["Regional kingdoms of India", "Resistance movements against invasions", "Social, cultural and economic developments in medieval India"]
      },
      {
        number: 13,
        name: "India and the World-I – 1900 BCE–1200 CE",
        unit: "History",
        keyTopics: ["Ancient Indian civilisation", "Maritime and overland trade & cultural exchange", "Cross-civilisational contacts", "Diffusion of knowledge, philosophy and science"]
      },
      {
        number: 14,
        name: "Authority",
        unit: "Political Science",
        keyTopics: ["Meaning, legitimacy and sources of authority", "Political and social authority structures", "Institutions of governance", "Power, laws and accountability", "Role of citizens"]
      },
      {
        number: 15,
        name: "From Ideas to Startups",
        unit: "Economics & Innovation",
        keyTopics: ["Entrepreneurship and creative problem solving", "Innovation and business lifecycle", "Startups ecosystem in India", "MSMEs (Micro, Small & Medium Enterprises)", "Employment generation", "Economic development and nation building"]
      }
    ],
    "Mathematics": [
      {
        number: 1,
        name: "Number Systems",
        unit: "Number Systems",
        keyTopics: ["Irrational numbers on number line", "Real numbers and their decimal expansions", "Rationalisation of denominators", "Laws of exponents for real numbers"]
      },
      {
        number: 2,
        name: "Polynomials",
        unit: "Algebra",
        keyTopics: ["Zeroes of a polynomial", "Remainder Theorem and Factor Theorem", "Algebraic identities (x+y+z)², (x±y)³, x³+y³+z³-3xyz"]
      },
      {
        number: 3,
        name: "Coordinate Geometry",
        unit: "Coordinate Geometry",
        keyTopics: ["Cartesian plane, Coordinates of a point, Plotting points in plane"]
      },
      {
        number: 4,
        name: "Linear Equations in Two Variables",
        unit: "Algebra",
        keyTopics: ["Standard form ax+by+c=0", "Graph of a linear equation in two variables", "Equations of lines parallel to axes"]
      },
      {
        number: 5,
        name: "Lines and Angles",
        unit: "Geometry",
        keyTopics: ["Intersecting and parallel lines", "Interior alternate angles", "Angle sum property of a triangle"]
      },
      {
        number: 6,
        name: "Triangles",
        unit: "Geometry",
        keyTopics: ["Congruence criteria (SAS, ASA, AAS, SSS, RHS)", "Properties of triangles and isosceles triangle theorems"]
      },
      {
        number: 7,
        name: "Quadrilaterals",
        unit: "Geometry",
        keyTopics: ["Properties of parallelogram", "Mid-point theorem and its converse"]
      },
      {
        number: 8,
        name: "Circles",
        unit: "Geometry",
        keyTopics: ["Equal chords and distances from center", "Angle subtended by an arc at the center", "Cyclic quadrilaterals"]
      },
      {
        number: 9,
        name: "Heron’s Formula",
        unit: "Mensuration",
        keyTopics: ["Area of a triangle using Heron's formula: √[s(s-a)(s-b)(s-c)]"]
      },
      {
        number: 10,
        name: "Surface Areas and Volumes",
        unit: "Mensuration",
        keyTopics: ["Surface areas and volumes of Sphere, Hemisphere, Right circular cone, Cylinder"]
      },
      {
        number: 11,
        name: "Statistics",
        unit: "Statistics",
        keyTopics: ["Graphical representation of data: Bar graphs, Histograms, Frequency polygons"]
      }
    ]
  },

  // ==========================================
  // CLASS 10 (Academic Session 2026–27)
  // ==========================================
  "Class 10": {
    "Science": [
      {
        number: 1,
        name: "Periodic Classification of Elements",
        unit: "Chemical Substances",
        keyTopics: [
          "Early attempts at classification",
          "Döbereiner’s triads",
          "Newlands’ law of octaves",
          "Mendeleev’s periodic table (Merits and anomalies)",
          "Modern periodic table (Moseley's law)",
          "Periodic trends: Valency, Atomic size, Metallic and non-metallic character, Electronegativity"
        ]
      },
      {
        number: 2,
        name: "Chemical Reactions and Equations",
        unit: "Chemical Substances",
        keyTopics: [
          "Chemical equations and conservation of mass",
          "Balancing chemical equations systematically",
          "Types of reactions: Combination, Decomposition, Displacement, Double Displacement, Redox",
          "Oxidation and reduction definitions and electron transfer",
          "Corrosion of metals and prevention",
          "Rancidity of fats and oils and antioxidants"
        ]
      },
      {
        number: 3,
        name: "Acids, Bases and Salts",
        unit: "Chemical Substances",
        keyTopics: [
          "Indicators (Natural, Synthetic, Olfactory)",
          "Chemical properties of acids and bases (Reactions with metals, carbonates, metal oxides)",
          "pH scale and universal indicator",
          "Salts and family of salts",
          "Common salts and uses (Bleaching powder, Baking soda, Washing soda, Plaster of Paris)"
        ]
      },
      {
        number: 4,
        name: "Metals and Non-metals",
        unit: "Chemical Substances",
        keyTopics: [
          "Physical and chemical properties of metals and non-metals",
          "Reactivity series and displacement reactions",
          "Ionic compounds (Formation, Electron dot structures, Properties)",
          "Extraction of metals (Metallurgy: Roasting, Calcination, Refining)",
          "Corrosion and its prevention",
          "Alloys and amalgamation (Brass, Bronze, Solder, Stainless steel)"
        ]
      },
      {
        number: 5,
        name: "Carbon and its Compounds",
        unit: "Chemical Substances",
        keyTopics: [
          "Covalent bonding in carbon compounds",
          "Hydrocarbons (Alkanes, Alkenes, Alkynes)",
          "Homologous series and isomerism",
          "Functional groups (Alcohols, Aldehydes, Ketones, Carboxylic acids, Halogens)",
          "Ethanol and ethanoic acid (Properties, Esterification, Saponification)",
          "Soaps and detergents (Micelle formation and cleansing mechanism)"
        ]
      },
      {
        number: 6,
        name: "Life Processes",
        unit: "World of Living",
        keyTopics: [
          "Nutrition (Autotrophic photosynthesis, Heterotrophic human digestion)",
          "Respiration (Aerobic vs anaerobic, Human respiratory organs and gas exchange)",
          "Transportation (Human heart, Double circulation, Blood and lymph, Xylem and phloem)",
          "Excretion (Human excretory system, Nephron structure and urine formation)",
          "Plant and human life processes comparisons"
        ]
      },
      {
        number: 7,
        name: "Control and Coordination",
        unit: "World of Living",
        keyTopics: [
          "Nervous system (Neuron structure, Synapse transmission)",
          "Brain and reflex action (Reflex arc, Central & peripheral nervous system)",
          "Hormones in animals (Pituitary, Thyroid, Adrenal, Pancreas, Gonads)",
          "Plant hormones (Auxins, Gibberellins, Cytokinins, Abscisic acid)",
          "Tropic movements (Phototropism, Geotropism, Hydrotropism, Thigmotropism)"
        ]
      },
      {
        number: 8,
        name: "How do Organisms Reproduce?",
        unit: "World of Living",
        keyTopics: [
          "Asexual reproduction (Fission, Fragmentation, Regeneration, Budding, Vegetative propagation, Spores)",
          "Sexual reproduction in plants (Flower structure, Pollination, Double fertilisation, Seed)",
          "Human reproductive system (Male and female anatomy)",
          "Fertilisation and embryonic development",
          "Reproductive health, STDs, Contraception methods",
          "Plant reproduction"
        ]
      },
      {
        number: 9,
        name: "Heredity",
        unit: "World of Living",
        keyTopics: [
          "Heredity and variation",
          "Mendel’s experiments (Monohybrid cross 3:1, Dihybrid cross 9:3:3:1)",
          "Inheritance of traits",
          "Sex determination in human beings (XX and XY mechanisms)",
          "Evolution overview"
        ]
      },
      {
        number: 10,
        name: "Light – Reflection and Refraction",
        unit: "Natural Phenomena",
        keyTopics: [
          "Reflection of light by spherical mirrors",
          "Spherical mirrors (Concave and convex, Principal focus, Focal length)",
          "Mirror formula (1/f = 1/v + 1/u) and magnification",
          "Refraction of light and refractive index",
          "Lenses (Convex and concave, Ray diagrams)",
          "Lens formula (1/f = 1/v - 1/u) and magnification",
          "Power of lens (P = 1/f in meters, Dioptre)"
        ]
      },
      {
        number: 11,
        name: "Human Eye and the Colourful World",
        unit: "Natural Phenomena",
        keyTopics: [
          "Human eye structure and function",
          "Accommodation of the eye (Near point and far point)",
          "Defects of vision and their correction (Myopia, Hypermetropia, Presbyopia)",
          "Dispersion of white light through a triangular glass prism",
          "Atmospheric refraction (Twinkling of stars, Advanced sunrise, Delayed sunset)",
          "Scattering of light (Tyndall effect, Blue color of sky, Red sunset)"
        ]
      },
      {
        number: 12,
        name: "Electricity",
        unit: "Effects of Current",
        keyTopics: [
          "Electric current and electric potential difference",
          "Resistance and Ohm’s law (V = IR)",
          "Factors on which resistance depends (Resistivity)",
          "Series and parallel circuits (Equivalent resistance)",
          "Heating effect of electric current (Joule's law H = I²Rt)",
          "Electric power and commercial energy unit (P = VI = I²R = V²/R)"
        ]
      },
      {
        number: 13,
        name: "Magnetic Effects of Electric Current",
        unit: "Effects of Current",
        keyTopics: [
          "Magnetic fields and magnetic field lines (Properties)",
          "Electromagnets and solenoid field",
          "Fleming’s Left-Hand and Right-Hand rules",
          "Electric motor principle and working",
          "Electromagnetic induction (Faraday's discovery)",
          "Electric generator principle (AC and DC)"
        ]
      },
      {
        number: 14,
        name: "Our Environment",
        unit: "Natural Resources",
        keyTopics: [
          "Ecosystems and their structural components",
          "Food chains and webs in terrestrial and aquatic systems",
          "Trophic levels and 10% energy transfer law",
          "Energy flow pyramid in ecosystems",
          "Biodegradable and non-biodegradable substances (Bio-magnification)",
          "Ozone layer depletion (CFCs) and waste management"
        ]
      },
      {
        number: 15,
        name: "Sustainable Management of Natural Resources",
        unit: "Natural Resources",
        keyTopics: [
          "Natural resources conservation and sustainable use",
          "Forests and wildlife (Stakeholders and community participation, Chipko movement)",
          "Water resources, Dams and Rainwater harvesting",
          "Coal and petroleum conservation",
          "Sustainable development goals and 5 R's (Refuse, Reduce, Reuse, Repurpose, Recycle)"
        ]
      }
    ],
    "Social Science": [
      {
        number: 1,
        name: "The Rise of Nationalism in Europe",
        unit: "History",
        keyTopics: ["French Revolution and idea of nation", "Making of nationalism in Europe", "Age of Revolutions (1830–1848)", "Unification of Germany and Italy", "Balkan nationalism and imperialism"]
      },
      {
        number: 2,
        name: "Nationalism in India",
        unit: "History",
        keyTopics: ["First World War, Khilafat and Non-Cooperation Movement", "Differing strands within movement", "Civil Disobedience Movement and Salt March", "Quit India Movement", "Different social groups and idea of collective belonging"]
      },
      {
        number: 3,
        name: "The Making of a Global World",
        unit: "History",
        keyTopics: ["Pre-modern trade routes and Silk routes", "Migration, disease and trade in 16th century", "19th century global economy (Capital, Labour, Goods)", "Colonialism and Rinderpest", "Post-war settlement and Bretton Woods institutions", "Globalisation"]
      },
      {
        number: 4,
        name: "The Age of Industrialisation",
        unit: "History",
        keyTopics: ["Proto-industrialisation and before factory system", "Industrial Revolution and coming up of factories", "Pace of industrial change: Steam power and hand labour", "Life of workers and migration", "Industrialisation in India: Colonial market, Swadeshi movement"]
      },
      {
        number: 5,
        name: "Print Culture and the Modern World",
        unit: "History",
        keyTopics: ["First printed books in East Asia", "Print comes to Europe: Gutenberg's printing press", "Print revolution and public reading culture", "Religious debates and French Revolution link", "19th century children, women and workers", "India and the world of print (Newspapers, Censorship)"]
      },
      {
        number: 6,
        name: "Resources and Development",
        unit: "Geography",
        keyTopics: ["Types of resources (Biotic, Abiotic, Renewable, Non-renewable)", "Resource planning in India and conservation", "Land resources and land utilization patterns", "Soil erosion, types of soils in India, and soil conservation"]
      },
      {
        number: 7,
        name: "Forest and Wildlife Resources",
        unit: "Geography",
        keyTopics: ["Flora and fauna diversity in India", "Categories of existing species (IUCN classification)", "Depletion factors and conservation of forest and wildlife", "Types of forests (Reserved, Protected, Unclassed)", "Community and conservation (Bhairodev Dakav 'Sonchuri', Sacred groves)"]
      },
      {
        number: 8,
        name: "Water Resources",
        unit: "Geography",
        keyTopics: ["Water scarcity and need for water conservation", "Multipurpose river valley projects and integrated water management", "Pros and cons of large dams", "Rainwater harvesting techniques across Indian states"]
      },
      {
        number: 9,
        name: "Agriculture",
        unit: "Geography",
        keyTopics: ["Types of farming (Primitive subsistence, Intensive subsistence, Commercial)", "Cropping pattern: Kharif, Rabi, Zaid", "Major crops of India (Food grains, Cash crops, Plantation crops)", "Technological and institutional reforms", "Food security and contribution of agriculture"]
      },
      {
        number: 10,
        name: "Minerals and Energy Resources",
        unit: "Geography",
        keyTopics: ["Mode of occurrence of minerals", "Ferrous and non-ferrous minerals", "Non-metallic and rock minerals", "Conservation of mineral resources", "Conventional energy sources (Coal, Petroleum, Natural Gas, Electricity)", "Non-conventional energy sources (Solar, Wind, Biogas, Tidal, Geo-thermal)"]
      },
      {
        number: 11,
        name: "Manufacturing Industries",
        unit: "Geography",
        keyTopics: ["Importance of manufacturing sector", "Contribution of industry to national economy", "Industrial location factors", "Classification of industries (Agro-based, Mineral-based)", "Industrial pollution and environmental degradation", "Control of environmental degradation"]
      },
      {
        number: 12,
        name: "Lifelines of National Economy",
        unit: "Geography",
        keyTopics: ["Transport networks: Roadways (Golden Quadrilateral, Highways), Railways", "Pipelines network in India", "Waterways and major sea ports", "Airways", "Communication networks (Postal, Telecom)", "International trade as economic barometer", "Tourism as a trade"]
      },
      {
        number: 13,
        name: "Power Sharing",
        unit: "Political Science",
        keyTopics: ["Case studies of Belgium and Sri Lanka", "Majoritarianism in Sri Lanka vs Accommodation in Belgium", "Why power sharing is desirable (Prudential and moral reasons)", "Forms of power sharing (Horizontal, Vertical, Social groups, Political coalitions)"]
      },
      {
        number: 14,
        name: "Federalism",
        unit: "Political Science",
        keyTopics: ["What is Federalism? (Unitary vs Federal systems)", "Key features of federalism", "Coming together vs Holding together federations", "What makes India a federal country? (Union, State, Concurrent lists)", "How is federalism practiced in India? (Linguistic states, Language policy)", "Decentralisation in India (73rd & 74th Constitutional amendments, Panchayati Raj)"]
      },
      {
        number: 15,
        name: "Gender, Religion and Caste",
        unit: "Political Science",
        keyTopics: ["Gender and politics: Public/private division, Women's political representation", "Religion, communalism and politics", "Communalism definition and forms", "Secular state provisions in Indian constitution", "Caste and politics: Caste inequalities, Politics in caste"]
      },
      {
        number: 16,
        name: "Political Parties",
        unit: "Political Science",
        keyTopics: ["Why do we need political parties? Meaning, components and functions", "Necessity of parties in democracy", "Party systems (One-party, Two-party, Multi-party)", "National parties vs State parties in India", "Challenges to political parties", "How can parties be reformed?"]
      },
      {
        number: 17,
        name: "Outcomes of Democracy",
        unit: "Political Science",
        keyTopics: ["How do we assess democracy’s outcomes?", "Accountable, responsive and legitimate government", "Economic growth, poverty reduction, inequality reduction", "Accommodation of social diversity", "Dignity and freedom of the citizens"]
      },
      {
        number: 18,
        name: "Development",
        unit: "Economics",
        keyTopics: ["What development promises: Different people, different goals", "Income and other goals (Freedom, security, respect)", "National development and per capita income", "Comparison of countries and states (PCI, Infant Mortality Rate, Literacy, Net Attendance)", "Public facilities and Human Development Index (HDI)", "Sustainability of development"]
      },
      {
        number: 19,
        name: "Sectors of the Indian Economy",
        unit: "Economics",
        keyTopics: ["Sectors of economic activities (Primary, Secondary, Tertiary)", "Comparing the three sectors (GDP contribution and employment)", "Historical change in sectors", "Where are most people employed? Disguised unemployment", "How to create more employment?", "Organised vs Unorganised sectors", "Public and private sectors"]
      },
      {
        number: 20,
        name: "Money and Credit",
        unit: "Economics",
        keyTopics: ["Money as a medium of exchange (Barter system and double coincidence of wants)", "Modern forms of money (Currency, Bank deposits, Cheques)", "Loan activities of banks", "Two different credit situations", "Terms of credit (Collateral, Documentation, Interest rate)", "Formal sector credit in India vs Informal sector (Role of RBI)", "Self-Help Groups (SHGs) for the poor"]
      },
      {
        number: 21,
        name: "Globalisation and the Indian Economy",
        unit: "Economics",
        keyTopics: ["Production across countries and Multinational Corporations (MNCs)", "Interlinking production across countries (Foreign direct investment)", "Foreign trade and integration of markets", "What is globalisation?", "Factors that enabled globalisation (Technology, Liberalisation of foreign trade & investment)", "World Trade Organisation (WTO)", "Impact of globalisation on India", "The struggle for a fair globalisation"]
      },
      {
        number: 22,
        name: "Consumer Rights",
        unit: "Economics",
        keyTopics: ["Consumer in the marketplace and consumer exploitation", "Consumer movement in India (COPRA 1986 / 2019)", "Consumer rights (Safety, Information, Choice, Heard, Redressal, Consumer education)", "Taking the consumer movement forward"]
      }
    ],
    "Mathematics": [
      {
        number: 1,
        name: "Real Numbers",
        unit: "Number Systems",
        keyTopics: ["Fundamental Theorem of Arithmetic", "Proofs of irrationality of √2, √3, √5", "Decimal expansions of rational numbers"]
      },
      {
        number: 2,
        name: "Polynomials",
        unit: "Algebra",
        keyTopics: ["Geometrical meaning of zeroes of a polynomial", "Relationship between zeroes and coefficients of quadratic polynomials"]
      },
      {
        number: 3,
        name: "Pair of Linear Equations in Two Variables",
        unit: "Algebra",
        keyTopics: ["Graphical method of solution, Consistency and inconsistency", "Algebraic methods: Substitution and Elimination methods"]
      },
      {
        number: 4,
        name: "Quadratic Equations",
        unit: "Algebra",
        keyTopics: ["Standard form ax²+bx+c=0", "Solution by factorisation", "Solution by quadratic formula x = (-b ± √(b²-4ac)) / 2a", "Nature of roots via discriminant D = b²-4ac"]
      },
      {
        number: 5,
        name: "Arithmetic Progressions",
        unit: "Algebra",
        keyTopics: ["nth term of an AP: a_n = a + (n-1)d", "Sum of first n terms of an AP: S_n = n/2 [2a + (n-1)d]", "Applications of AP in daily life"]
      },
      {
        number: 6,
        name: "Triangles",
        unit: "Geometry",
        keyTopics: ["Basic Proportionality Theorem (Thales' theorem) and its converse", "Criteria for similarity of triangles (AAA, SSS, SAS)"]
      },
      {
        number: 7,
        name: "Coordinate Geometry",
        unit: "Coordinate Geometry",
        keyTopics: ["Distance formula between two points", "Section formula (Internal division)", "Midpoint formula"]
      },
      {
        number: 8,
        name: "Introduction to Trigonometry",
        unit: "Trigonometry",
        keyTopics: ["Trigonometric ratios of an acute angle in a right triangle", "Values of trig ratios of 0°, 30°, 45°, 60° and 90°", "Trigonometric identities: sin²θ + cos²θ = 1, 1 + tan²θ = sec²θ, 1 + cot²θ = cosec²θ"]
      },
      {
        number: 9,
        name: "Some Applications of Trigonometry",
        unit: "Trigonometry",
        keyTopics: ["Heights and Distances", "Angle of elevation and angle of depression", "Multi-step trigonometric surveying problems"]
      },
      {
        number: 10,
        name: "Circles",
        unit: "Geometry",
        keyTopics: ["Tangent to a circle and point of contact", "Tangent is perpendicular to radius at point of contact", "Lengths of tangents drawn from an external point to a circle are equal"]
      },
      {
        number: 11,
        name: "Areas Related to Circles",
        unit: "Mensuration",
        keyTopics: ["Area of sector and segment of a circle", "Problems on areas and perimeter/circumference of planar figures"]
      },
      {
        number: 12,
        name: "Surface Areas and Volumes",
        unit: "Mensuration",
        keyTopics: ["Surface area and volume of combinations of solids: Cubes, Cuboids, Spheres, Hemispheres, Cones, Cylinders"]
      },
      {
        number: 13,
        name: "Statistics",
        unit: "Statistics",
        keyTopics: ["Mean, Median and Mode of grouped data (Bimodal situation avoided)", "Direct, Assumed Mean and Step Deviation methods"]
      },
      {
        number: 14,
        name: "Probability",
        unit: "Probability",
        keyTopics: ["Classical definition of probability P(E) = Number of favorable outcomes / Total outcomes", "Simple problems on single events (Coins, Dice, Cards)"]
      }
    ]
  },

  // ==========================================
  // CLASS 11 (Senior Secondary)
  // ==========================================
  "Class 11": {
    "Physics": [
      {
        number: 1,
        name: "Units and Measurements",
        unit: "Physical World and Measurement",
        keyTopics: ["SI units and fundamental vs derived units", "Dimensional analysis and applications", "Checking dimensional consistency", "Significant figures and errors"],
        ncertBookCode: "keph101"
      },
      {
        number: 2,
        name: "Motion in a Straight Line",
        unit: "Kinematics",
        keyTopics: ["Frame of reference, Position-time graph", "Speed and velocity, Average vs instantaneous", "Uniformly accelerated motion", "Kinematic equations by calculus"],
        ncertBookCode: "keph102"
      },
      {
        number: 3,
        name: "Motion in a Plane",
        unit: "Kinematics",
        keyTopics: ["Scalars and vectors, Vector addition (Triangle and Parallelogram)", "Dot and cross product", "Projectile motion formulas (Range, Height, Time)", "Uniform circular motion and centripetal acceleration"],
        ncertBookCode: "keph103"
      },
      {
        number: 4,
        name: "Laws of Motion",
        unit: "Laws of Motion",
        keyTopics: ["Newton's three laws of motion", "Inertia and linear momentum", "Impulse and momentum theorem", "Friction (Static, Kinetic, Rolling, Angle of friction)", "Banking of curved roads and circular dynamics"],
        ncertBookCode: "keph104"
      },
      {
        number: 5,
        name: "Work, Energy and Power",
        unit: "Work, Energy and Power",
        keyTopics: ["Work done by constant and variable force", "Work-energy theorem", "Kinetic and potential energy of spring", "Conservative vs non-conservative forces", "Elastic and inelastic collisions in 1D and 2D"],
        ncertBookCode: "keph105"
      },
      {
        number: 6,
        name: "System of Particles and Rotational Motion",
        unit: "Rotational Motion",
        keyTopics: ["Center of mass of two-particle and rigid body systems", "Torque and angular momentum conservation", "Moment of inertia and radius of gyration", "Parallel and perpendicular axis theorems", "Kinematics of rotational motion"],
        ncertBookCode: "keph106"
      },
      {
        number: 7,
        name: "Gravitation",
        unit: "Gravitation",
        keyTopics: ["Kepler’s laws of planetary motion", "Universal law of gravitation", "Acceleration due to gravity and variation with altitude and depth", "Gravitational potential energy and escape velocity", "Orbital velocity and geostationary satellites"],
        ncertBookCode: "keph107"
      },
      {
        number: 8,
        name: "Mechanical Properties of Solids",
        unit: "Properties of Bulk Matter",
        keyTopics: ["Stress-strain curve and Hooke's law", "Young's, Shear, and Bulk modulus", "Poisson's ratio and elastic potential energy"],
        ncertBookCode: "keph201"
      },
      {
        number: 9,
        name: "Mechanical Properties of Fluids",
        unit: "Properties of Bulk Matter",
        keyTopics: ["Pascal's law and hydraulic lift", "Viscosity, Stokes' law, Terminal velocity", "Streamline vs turbulent flow, Reynolds number", "Bernoulli’s principle and applications", "Surface tension and capillary rise"],
        ncertBookCode: "keph202"
      },
      {
        number: 10,
        name: "Thermal Properties of Matter",
        unit: "Properties of Bulk Matter",
        keyTopics: ["Temperature and heat, Thermal expansion of solids, liquids, gases", "Specific heat capacity and calorimetry", "Latent heat and phase changes", "Heat transfer: Conduction, Convection, Radiation (Wien's and Stefan's laws)"],
        ncertBookCode: "keph203"
      },
      {
        number: 11,
        name: "Thermodynamics",
        unit: "Thermodynamics",
        keyTopics: ["Zeroth and First law of thermodynamics (Internal energy, Work, Heat)", "Isothermal, Adiabatic, Isochoric, Isobaric processes", "Second law of thermodynamics, Reversible and irreversible processes", "Heat engines and Carnot cycle efficiency"],
        ncertBookCode: "keph204"
      },
      {
        number: 12,
        name: "Kinetic Theory",
        unit: "Thermodynamics",
        keyTopics: ["Equation of state of perfect gas", "Kinetic theory postulates, Pressure exerted by gas", "Kinetic interpretation of temperature, RMS speed", "Degrees of freedom and law of equipartition of energy", "Mean free path"],
        ncertBookCode: "keph205"
      },
      {
        number: 13,
        name: "Oscillations",
        unit: "Oscillations and Waves",
        keyTopics: ["Periodic and oscillatory motion, Simple Harmonic Motion (SHM)", "Displacement, velocity, acceleration in SHM", "Energy in SHM (Kinetic and potential)", "Simple pendulum and spring-mass system oscillations", "Free, forced and damped oscillations, Resonance"],
        ncertBookCode: "keph206"
      },
      {
        number: 14,
        name: "Waves",
        unit: "Oscillations and Waves",
        keyTopics: ["Transverse and longitudinal waves, Wave equation", "Speed of sound: Newton's formula and Laplace's correction", "Principle of superposition of waves", "Standing waves in strings and organ pipes", "Beats and Doppler effect"],
        ncertBookCode: "keph207"
      }
    ],
    "Chemistry": [
      {
        number: 1,
        name: "Some Basic Concepts of Chemistry",
        unit: "Physical Chemistry",
        keyTopics: ["Mole concept, Molar mass, Percentage composition", "Empirical and molecular formula", "Stoichiometry and limiting reagent calculations", "Concentration terms (Molarity, Molality, Mole fraction)"],
        ncertBookCode: "kech101"
      },
      {
        number: 2,
        name: "Structure of Atom",
        unit: "Inorganic Chemistry",
        keyTopics: ["Bohr's model of atom and limitations", "de Broglie relation and Heisenberg's Uncertainty Principle", "Quantum numbers (n, l, m, s) and atomic orbitals", "Aufbau principle, Pauli exclusion principle, Hund's rule"],
        ncertBookCode: "kech102"
      },
      {
        number: 3,
        name: "Classification of Elements and Periodicity in Properties",
        unit: "Inorganic Chemistry",
        keyTopics: ["Modern periodic law and long form of periodic table", "Periodic trends in properties: Atomic and ionic radii", "Ionization enthalpy, Electron gain enthalpy, Electronegativity"],
        ncertBookCode: "kech103"
      },
      {
        number: 4,
        name: "Chemical Bonding and Molecular Structure",
        unit: "Inorganic Chemistry",
        keyTopics: ["Lewis structures, Octet rule limitations", "VSEPR theory and molecular geometries", "Valence bond theory and Hybridisation (sp, sp², sp³, dsp²)", "Molecular Orbital Theory (MOT) of homonuclear diatomic molecules", "Hydrogen bonding"],
        ncertBookCode: "kech104"
      },
      {
        number: 5,
        name: "Chemical Thermodynamics",
        unit: "Physical Chemistry",
        keyTopics: ["System, Surroundings, First Law (ΔU = q + w)", "Enthalpy, Hess's Law of constant heat summation", "Entropy and Second Law of thermodynamics", "Gibbs free energy and spontaneity criterion (ΔG = ΔH - TΔS)"],
        ncertBookCode: "kech105"
      },
      {
        number: 6,
        name: "Equilibrium",
        unit: "Physical Chemistry",
        keyTopics: ["Law of mass action, Equilibrium constants (Kc and Kp)", "Le Chatelier's principle and factors affecting equilibrium", "Ionic equilibrium: Arrhenius, Bronsted-Lowry, Lewis acids and bases", "pH scale, Common ion effect, Buffer solutions, Solubility product (Ksp)"],
        ncertBookCode: "kech106"
      },
      {
        number: 7,
        name: "Redox Reactions",
        unit: "Inorganic Chemistry",
        keyTopics: ["Concept of oxidation and reduction", "Oxidation number rules and calculations", "Balancing redox reactions (Ion-electron & oxidation number methods)"],
        ncertBookCode: "kech201"
      },
      {
        number: 8,
        name: "Organic Chemistry – Some Basic Principles and Techniques",
        unit: "Organic Chemistry",
        keyTopics: ["IUPAC nomenclature of organic compounds", "Inductive, Electromeric, Resonance and Hyperconjugation effects", "Carbocations, Carbanions, Free radicals stability", "Types of organic reactions (Substitution, Addition, Elimination)"],
        ncertBookCode: "kech202"
      },
      {
        number: 9,
        name: "Hydrocarbons",
        unit: "Organic Chemistry",
        keyTopics: ["Alkanes: Conformations of ethane, Halogenation mechanism", "Alkenes: Geometrical isomerism, Markovnikov and Anti-Markovnikov addition", "Alkynes: Acidity of alkynes, Addition reactions", "Aromatic hydrocarbons: Benzene resonance, Electrophilic substitution mechanisms"],
        ncertBookCode: "kech203"
      }
    ],
    "Biology": [
      {
        number: 1,
        name: "The Living World",
        unit: "Diversity",
        keyTopics: ["Characteristics of living organisms", "Binomial nomenclature", "Taxonomical categories and hierarchy"]
      },
      {
        number: 2,
        name: "Biological Classification",
        unit: "Diversity",
        keyTopics: ["Five kingdom classification by Whittaker", "Kingdom Monera, Protista, Fungi", "Viruses, Viroids, Lichens"]
      },
      {
        number: 3,
        name: "Plant Kingdom",
        unit: "Diversity",
        keyTopics: ["Algae, Bryophytes, Pteridophytes", "Gymnosperms and Angiosperms", "Alternation of generations"]
      },
      {
        number: 4,
        name: "Animal Kingdom",
        unit: "Diversity",
        keyTopics: ["Basis of classification: Symmetry, Coelom, Segmentation", "Non-chordates phyla Porifera to Hemichordata", "Chordata classes"]
      },
      {
        number: 5,
        name: "Cell: The Unit of Life",
        unit: "Cell Biology",
        keyTopics: ["Cell theory", "Prokaryotic vs eukaryotic cell", "Plasma membrane Fluid Mosaic Model", "Organelles structure and functions"]
      },
      {
        number: 6,
        name: "Biomolecules",
        unit: "Cell Biology",
        keyTopics: ["Proteins structure (Primary to quaternary)", "Carbohydrates, Lipids, Nucleic acids", "Enzymes: Properties and mechanism of action"]
      },
      {
        number: 7,
        name: "Cell Cycle and Cell Division",
        unit: "Cell Biology",
        keyTopics: ["Cell cycle phases (G1, S, G2, M)", "Mitosis stages and significance", "Meiosis I and II stages and crossing over"]
      },
      {
        number: 8,
        name: "Photosynthesis in Higher Plants",
        unit: "Plant Physiology",
        keyTopics: ["Light reaction and photophosphorylation", "Chemiosmotic hypothesis", "Calvin C3 cycle and Hatch-Slack C4 pathway"]
      },
      {
        number: 9,
        name: "Respiration in Plants",
        unit: "Plant Physiology",
        keyTopics: ["Glycolysis EMP pathway", "Krebs citric acid cycle", "Electron transport system and ATP synthesis"]
      },
      {
        number: 10,
        name: "Plant Growth and Development",
        unit: "Plant Physiology",
        keyTopics: ["Phases of growth and differentiation", "Plant growth regulators: Auxins, Gibberellins, Cytokinins, Ethylene, ABA"]
      },
      {
        number: 11,
        name: "Breathing and Exchange of Gases",
        unit: "Human Physiology",
        keyTopics: ["Human respiratory system", "Mechanism of breathing", "Transport of oxygen and carbon dioxide"]
      },
      {
        number: 12,
        name: "Body Fluids and Circulation",
        unit: "Human Physiology",
        keyTopics: ["Composition of blood and lymph", "Human heart structure and cardiac cycle", "ECG and double circulation"]
      },
      {
        number: 13,
        name: "Excretory Products and their Elimination",
        unit: "Human Physiology",
        keyTopics: ["Nephron structure and urine formation", "Counter-current mechanism", "Regulation of kidney function (RAAS, ADH)"]
      },
      {
        number: 14,
        name: "Locomotion and Movement",
        unit: "Human Physiology",
        keyTopics: ["Types of movement", "Skeletal muscle sliding filament theory", "Joints and skeletal system"]
      },
      {
        number: 15,
        name: "Neural Control and Coordination",
        unit: "Human Physiology",
        keyTopics: ["Neuron structure and nerve impulse conduction", "Synaptic transmission", "Human brain anatomy"]
      },
      {
        number: 16,
        name: "Chemical Coordination and Integration",
        unit: "Human Physiology",
        keyTopics: ["Endocrine glands and hormones", "Mechanism of hormone action (Lipid vs peptide)"]
      }
    ],
    "Mathematics": [
      {
        number: 1,
        name: "Sets",
        unit: "Sets and Functions",
        keyTopics: ["Sets and representation, Subsets, Power set", "Venn diagrams and operations on sets (Union, Intersection, Difference)"]
      },
      {
        number: 2,
        name: "Relations and Functions",
        unit: "Sets and Functions",
        keyTopics: ["Cartesian product of sets", "Domain, Codomain, Range of relations", "Functions and algebra of real functions"]
      },
      {
        number: 3,
        name: "Trigonometric Functions",
        unit: "Sets and Functions",
        keyTopics: ["Radian and degree measures", "Trigonometric identities: Addition and subtraction formulas", "Multiple and sub-multiple angles"]
      },
      {
        number: 4,
        name: "Complex Numbers and Quadratic Equations",
        unit: "Algebra",
        keyTopics: ["Algebra of complex numbers", "Modulus and conjugate", "Roots of quadratic equation in complex plane"]
      },
      {
        number: 5,
        name: "Linear Inequalities",
        unit: "Algebra",
        keyTopics: ["Linear inequalities in one variable", "Graphical representation of solutions"]
      },
      {
        number: 6,
        name: "Permutations and Combinations",
        unit: "Algebra",
        keyTopics: ["Fundamental principle of counting", "Factorial notation", "Permutations nPr and Combinations nCr formulas"]
      },
      {
        number: 7,
        name: "Binomial Theorem",
        unit: "Algebra",
        keyTopics: ["Statement and proof of Binomial Theorem", "General term and middle term in expansion"]
      },
      {
        number: 8,
        name: "Sequences and Series",
        unit: "Algebra",
        keyTopics: ["Arithmetic progression and Geometric progression (GP)", "General term and sum of n terms of GP", "Sum of infinite GP"]
      },
      {
        number: 9,
        name: "Straight Lines",
        unit: "Coordinate Geometry",
        keyTopics: ["Slope of a line and angle between two lines", "Various forms of equations of line (Slope-intercept, Point-slope, Intercept)", "Distance of a point from a line"]
      },
      {
        number: 10,
        name: "Conic Sections",
        unit: "Coordinate Geometry",
        keyTopics: ["Standard equations and properties of Circle, Parabola, Ellipse, Hyperbola"]
      },
      {
        number: 11,
        name: "Limits and Derivatives",
        unit: "Calculus",
        keyTopics: ["Intuitive concept of limit", "Standard trigonometric limits", "Derivative from first principles", "Product and quotient rules"]
      },
      {
        number: 12,
        name: "Probability",
        unit: "Probability",
        keyTopics: ["Random experiments and sample space", "Axiomatic approach to probability", "Addition theorem of probability"]
      }
    ]
  },

  // ==========================================
  // CLASS 12 (Academic Session 2026–27)
  // Reconciled with 2026–27 Syllabus Reference Document
  // ==========================================
  "Class 12": {
    "Physics": [
      {
        number: 1,
        name: "Electric Charges and Fields",
        unit: "Unit I: Electrostatics",
        keyTopics: [
          "Electric charges and conservation",
          "Coulomb’s law in scalar and vector form",
          "Electric field and electric field lines",
          "Electric dipole and torque in uniform field",
          "Electric flux and Gauss’s law",
          "Applications of Gauss’s law: Infinitely long straight wire, Uniformly charged infinite plane sheet, Thin spherical shell"
        ]
      },
      {
        number: 2,
        name: "Electrostatic Potential and Capacitance",
        unit: "Unit I: Electrostatics",
        keyTopics: [
          "Electric potential and potential difference",
          "Potential due to point charge and electric dipole",
          "Equipotential surfaces and properties",
          "Conductors and dielectrics, Electric polarisation",
          "Capacitors and capacitance of parallel plate capacitor",
          "Dielectric medium in capacitor",
          "Combination of capacitors (Series and parallel)",
          "Energy stored in a capacitor"
        ]
      },
      {
        number: 3,
        name: "Current Electricity",
        unit: "Unit II: Current Electricity",
        keyTopics: [
          "Electric current and drift velocity of electrons",
          "Ohm’s law, Electrical resistance and resistivity",
          "V-I characteristics of ohmic and non-ohmic conductors",
          "Electrical energy and power",
          "Temperature dependence of resistance",
          "EMF and internal resistance of a cell",
          "Kirchhoff’s laws (Junction rule and Loop rule)",
          "Wheatstone bridge principle and applications"
        ]
      },
      {
        number: 4,
        name: "Moving Charges and Magnetism",
        unit: "Unit III: Magnetism",
        keyTopics: [
          "Concept of magnetic field and Oersted’s experiment",
          "Biot–Savart law and application to circular current loop",
          "Ampere’s circuital law and solenoid field",
          "Force on moving charge in magnetic field (Lorentz force)",
          "Force on current-carrying conductor in uniform magnetic field",
          "Force between two parallel current-carrying conductors (Definition of Ampere)",
          "Torque on current loop in magnetic field",
          "Moving coil galvanometer (Current and voltage sensitivity, Conversion to ammeter/voltmeter)"
        ]
      },
      {
        number: 5,
        name: "Magnetism and Matter",
        unit: "Unit III: Magnetism",
        keyTopics: [
          "Current loop as a magnetic dipole and dipole moment",
          "Magnetic field intensity due to magnetic dipole along axis and perpendicular to axis",
          "Torque on magnetic dipole in uniform magnetic field",
          "Bar magnet as equivalent solenoid",
          "Magnetic field lines and Gauss's law for magnetism",
          "Magnetic properties of materials: Diamagnetic, Paramagnetic, Ferromagnetic",
          "Curie's law and temperature effect"
        ]
      },
      {
        number: 6,
        name: "Electromagnetic Induction",
        unit: "Unit IV: EMI & AC",
        keyTopics: [
          "Electromagnetic induction and magnetic flux",
          "Faraday’s laws of induction",
          "Lenz’s law and conservation of energy",
          "Motional electromotive force (e = Blv)",
          "Eddy currents and electromagnetic damping",
          "Self-inductance and Mutual inductance (Formulas and combinations)"
        ]
      },
      {
        number: 7,
        name: "Alternating Current",
        unit: "Unit IV: EMI & AC",
        keyTopics: [
          "Alternating current and voltage waveforms",
          "Peak, average and RMS value of AC",
          "AC circuit with pure Resistor, Inductor, Capacitor (Phasor diagrams)",
          "LCR series circuit and impedance triangle",
          "Electrical resonance and Quality factor (Q-factor)",
          "Power in AC circuit and power factor",
          "Wattless current",
          "AC generator and Transformer working, losses and efficiency"
        ]
      },
      {
        number: 8,
        name: "Electromagnetic Waves",
        unit: "Unit V: Electromagnetic Waves",
        keyTopics: [
          "Basic idea of displacement current",
          "Electromagnetic waves: Transverse nature and properties",
          "Speed of EM waves in vacuum and medium",
          "Electromagnetic spectrum: Radio waves, Microwaves, Infrared, Visible, Ultraviolet, X-rays, Gamma rays",
          "Applications and frequency/wavelength ranges"
        ]
      },
      {
        number: 9,
        name: "Ray Optics and Optical Instruments",
        unit: "Unit VI: Optics",
        keyTopics: [
          "Refraction of light and Total Internal Reflection (TIR) and optical fibers",
          "Refraction at spherical surfaces and Lens Maker’s formula",
          "Thin lens formula and magnification",
          "Combination of thin lenses in contact",
          "Refraction through a triangular glass prism and dispersion",
          "Optical instruments: Compound microscope and Astronomical telescope (Magnifying power)"
        ]
      },
      {
        number: 10,
        name: "Wave Optics",
        unit: "Unit VI: Optics",
        keyTopics: [
          "Wavefront and Huygens’ principle",
          "Proof of laws of reflection and refraction using Huygens' wave theory",
          "Interference of light and coherent sources",
          "Young’s Double Slit Experiment (YDSE): Fringe width derivation β = λD/d",
          "Conditions for constructive and destructive interference",
          "Diffraction of light due to a single slit and central maxima width"
        ]
      },
      {
        number: 11,
        name: "Dual Nature of Radiation and Matter",
        unit: "Unit VII: Dual Nature",
        keyTopics: [
          "Photoelectric effect experiments (Hertz and Lenard’s observations)",
          "Einstein’s photoelectric equation (hν = Φ₀ + K_max)",
          "Particle nature of light: Photons and momentum",
          "de Broglie hypothesis and matter waves (λ = h/p = h/√(2mE))",
          "Davisson-Germer experiment overview"
        ]
      },
      {
        number: 12,
        name: "Atoms",
        unit: "Unit VIII: Atoms and Nuclei",
        keyTopics: [
          "Alpha-particle scattering experiment and Rutherford’s planetary model",
          "Bohr’s model of hydrogen atom: Postulates, Radii of orbits, Velocity, Energy levels",
          "Hydrogen spectral line series (Lyman, Balmer, Paschen, Brackett, Pfund)",
          "de Broglie’s explanation of Bohr’s second postulate"
        ]
      },
      {
        number: 13,
        name: "Nuclei",
        unit: "Unit VIII: Atoms and Nuclei",
        keyTopics: [
          "Composition and size of atomic nucleus (R = R₀ A^(1/3))",
          "Mass defect and nuclear binding energy",
          "Binding energy per nucleon curve and nuclear stability",
          "Nuclear forces and characteristics",
          "Nuclear fission and controlled chain reaction",
          "Nuclear fusion in stars"
        ]
      },
      {
        number: 14,
        name: "Semiconductor Electronics: Materials, Devices and Simple Circuits",
        unit: "Unit IX: Electronic Devices",
        keyTopics: [
          "Energy bands in conductors, semiconductors and insulators",
          "Intrinsic and extrinsic semiconductors (p-type, n-type doping)",
          "p-n junction formation, depletion region and barrier potential",
          "Semiconductor diode in forward and reverse bias (I-V characteristics)",
          "Diode as a rectifier (Half-wave and full-wave rectifier working, filter circuit)"
        ]
      }
    ],
    "Chemistry": [
      {
        number: 1,
        name: "Solutions",
        unit: "Physical Chemistry",
        keyTopics: [
          "Types of solutions and concentration terms (Molarity, Molality, Mole fraction)",
          "Solubility of gases in liquids (Henry’s law)",
          "Vapour pressure of liquid solutions and Raoult’s law",
          "Ideal and non-ideal solutions (Positive and negative deviations)",
          "Colligative properties: Relative lowering of vapour pressure, Elevation of boiling point, Depression of freezing point, Osmotic pressure",
          "Abnormal molar masses and van ’t Hoff factor (i)"
        ]
      },
      {
        number: 2,
        name: "Electrochemistry",
        unit: "Physical Chemistry",
        keyTopics: [
          "Electrochemical cells (Galvanic and Electrolytic cells)",
          "Electrode potential and standard hydrogen electrode (SHE)",
          "Nernst equation and equilibrium constant calculation",
          "Conductance in electrolytic solutions, Specific, molar conductivity",
          "Kohlrausch’s law of independent migration of ions",
          "Electrolysis and Faraday’s laws of electrolysis",
          "Commercial batteries (Primary, Secondary lead-acid storage), Fuel cells, Corrosion"
        ]
      },
      {
        number: 3,
        name: "Chemical Kinetics",
        unit: "Physical Chemistry",
        keyTopics: [
          "Rate of reaction (Average and instantaneous rate)",
          "Factors affecting rate: Concentration, Temperature, Catalyst",
          "Order and molecularity of a reaction",
          "Integrated rate equations for zero and first order reactions",
          "Half-life of a reaction (t_1/2 = 0.693/k)",
          "Temperature dependence: Arrhenius equation and activation energy",
          "Collision theory of chemical reactions"
        ]
      },
      {
        number: 4,
        name: "d- and f-Block Elements",
        unit: "Inorganic Chemistry",
        keyTopics: [
          "Electronic configuration and general characteristics of transition metals (3d series)",
          "Atomic and ionic sizes, Ionization enthalpies, Oxidation states",
          "Magnetic properties, Catalytic properties, Colored ions, Complex formation, Interstitial compounds",
          "Preparation, properties and oxidising action of K₂Cr₂O₇ and KMnO₄",
          "Lanthanides: Electronic configuration, Oxidation states, Lanthanoid contraction",
          "Actinides: General characteristics and comparison with lanthanoids"
        ]
      },
      {
        number: 5,
        name: "Coordination Compounds",
        unit: "Inorganic Chemistry",
        keyTopics: [
          "Coordination entities, Central atom, Ligands, Coordination number, Coordination sphere",
          "IUPAC nomenclature of mononuclear coordination compounds",
          "Isomerism: Structural (Ionisation, Hydrate, Linkage, Coordination) and Stereo (Geometrical, Optical)",
          "Bonding in coordination compounds: Werner's theory, Valence Bond Theory (Inner and outer orbital complexes)",
          "Crystal Field Theory (CFT): Crystal field splitting in octahedral and tetrahedral complexes, High spin/low spin",
          "Applications of coordination compounds in metallurgy, medicine and analysis"
        ]
      },
      {
        number: 6,
        name: "Haloalkanes and Haloarenes",
        unit: "Organic Chemistry",
        keyTopics: [
          "Classification and IUPAC nomenclature",
          "Methods of preparation from alcohols, hydrocarbons and by halogen exchange",
          "Physical and chemical properties",
          "Mechanisms of nucleophilic substitution reactions: S_N1 vs S_N2 stereochemistry",
          "Electrophilic substitution reactions of haloarenes (Chlorobenzene)",
          "Polyhalogen compounds: Dichloromethane, Chloroform, Iodoform, Freons, DDT (Environmental effects)"
        ]
      },
      {
        number: 7,
        name: "Alcohols, Phenols and Ethers",
        unit: "Organic Chemistry",
        keyTopics: [
          "IUPAC nomenclature and classification (1°, 2°, 3°)",
          "Methods of preparation of alcohols (Hydration of alkenes, Hydroboration-oxidation, Reduction)",
          "Physical properties (Boiling points, Hydrogen bonding, Solubility)",
          "Chemical reactions of alcohols: Acidity, Esterification, Dehydration mechanism, Oxidation",
          "Phenols: Preparation from cumene and diazonium salts, Acidity, Kolbe’s reaction, Reimer–Tiemann reaction",
          "Ethers: Williamson’s synthesis and cleavage by HI mechanism"
        ]
      },
      {
        number: 8,
        name: "Aldehydes, Ketones and Carboxylic Acids",
        unit: "Organic Chemistry",
        keyTopics: [
          "IUPAC nomenclature and structure of carbonyl group",
          "Methods of preparation of aldehydes and ketones (Ozonolysis, Hydration of alkynes, Rosenmund reduction)",
          "Nucleophilic addition reactions and mechanism (HCN, NaHSO₃, Grignard reagents)",
          "Reactions involving α-hydrogen: Aldol condensation, Cannizzaro reaction",
          "Tests to distinguish aldehydes and ketones (Tollens' and Fehling's tests)",
          "Carboxylic acids: Preparation, Acidity and substituent effects, Decarboxylation, Hell–Volhard–Zelinsky reaction"
        ]
      },
      {
        number: 9,
        name: "Amines",
        unit: "Organic Chemistry",
        keyTopics: [
          "Classification (1°, 2°, 3°) and IUPAC nomenclature",
          "Methods of preparation (Reduction of nitro compounds, Ammonolysis, Gabriel phthalimide synthesis, Hoffmann bromamide)",
          "Physical properties and basic character in aqueous and gaseous phases",
          "Chemical reactions: Carbylamine test, Reaction with nitrous acid, Hinsberg test",
          "Diazonium salts: Preparation, Physical properties, Synthetic applications (Sandmeyer, Gattermann, Coupling reactions)"
        ]
      },
      {
        number: 10,
        name: "Biomolecules",
        unit: "Organic Chemistry",
        keyTopics: [
          "Carbohydrates: Classification (Monosaccharides, Disaccharides, Polysaccharides)",
          "Structure of D-glucose and D-fructose (Open chain and Haworth cyclic structures)",
          "Proteins: Amino acids (Essential and non-essential), Peptide bond, Protein structure (Primary, Secondary, Tertiary, Quaternary)",
          "Denaturation of proteins",
          "Enzymes and vitamins classification and deficiency diseases",
          "Nucleic acids: Chemical composition of DNA and RNA, Double helix structure, Biological functions"
        ]
      }
    ],
    "Biology": [
      {
        number: 1,
        name: "Sexual Reproduction in Flowering Plants",
        unit: "Reproduction",
        keyTopics: [
          "Flower structure and reproductive organs",
          "Development of male and female gametophytes (Microsporogenesis and Megasporogenesis)",
          "Pollination types, agencies and outbreeding devices",
          "Pollen-pistil interaction and double fertilisation",
          "Development of endosperm and embryo",
          "Development of seed and fruit",
          "Special modes: Apomixis, Parthenocarpy, Polyembryony"
        ]
      },
      {
        number: 2,
        name: "Human Reproduction",
        unit: "Reproduction",
        keyTopics: [
          "Male and female reproductive systems anatomy",
          "Microscopic anatomy of testis and ovary",
          "Gametogenesis (Spermatogenesis and Oogenesis)",
          "Menstrual cycle and hormonal control",
          "Fertilisation and embryo development up to blastocyst formation",
          "Implantation, pregnancy and placenta formation",
          "Parturition and lactation (Hormonal regulation)"
        ]
      },
      {
        number: 3,
        name: "Reproductive Health",
        unit: "Reproduction",
        keyTopics: [
          "Reproductive health problems and strategies",
          "Population explosion and birth control (Natural, Barrier, IUDs, Pills, Surgical methods)",
          "Medical Termination of Pregnancy (MTP) and legal provisions",
          "Sexually Transmitted Diseases (STDs) prevention",
          "Infertility causes and Assisted Reproductive Technologies (ART: IVF, ZIFT, GIFT, ICSI, AI)"
        ]
      },
      {
        number: 4,
        name: "Principles of Inheritance and Variation",
        unit: "Genetics and Evolution",
        keyTopics: [
          "Mendelian inheritance and deviations (Incomplete dominance, Codominance, Multiple alleles)",
          "Pleiotropy and polygenic inheritance",
          "Chromosome theory of inheritance (Sutton and Boveri)",
          "Linkage and crossing over (Morgan’s experiments on Drosophila)",
          "Sex determination in humans, birds and honeybee",
          "Mutation: Gene mutations and chromosomal aberrations",
          "Genetic disorders: Mendelian (Haemophilia, Sickle cell anaemia, Phenylketonuria, Thalassemia) and Chromosomal (Down's, Turner's, Klinefelter's)"
        ]
      },
      {
        number: 5,
        name: "Molecular Basis of Inheritance",
        unit: "Genetics and Evolution",
        keyTopics: [
          "Search for genetic material (Griffith, Avery-MacLeod-McCarty, Hershey-Chase experiments)",
          "Structure of DNA and RNA (Watson-Crick model, Nucleosome packaging)",
          "DNA replication: Semiconservative nature (Meselson and Stahl experiment) and replication fork enzymes",
          "Transcription: Transcription unit, Prokaryotic vs eukaryotic transcription, Post-transcriptional processing",
          "Genetic code: Salient features, Wobble hypothesis, tRNA adapter molecule",
          "Translation: Aminoacylation, Initiation, Elongation, Termination",
          "Regulation of gene expression: Lac Operon model",
          "Human Genome Project (HGP) and DNA fingerprinting methodology"
        ]
      },
      {
        number: 6,
        name: "Evolution",
        unit: "Genetics and Evolution",
        keyTopics: [
          "Origin of life: Chemical evolution and Miller-Urey experiment",
          "Evidences of evolution: Paleontological, Comparative anatomy (Homology vs Analogy), Embryological, Molecular",
          "Darwin’s theory of natural selection and Lamarckism",
          "Modern synthetic theory of evolution",
          "Mechanism of evolution: Variation, Mutation, Gene flow, Genetic drift",
          "Hardy–Weinberg principle and equilibrium conditions",
          "Adaptive radiation and human evolution timeline"
        ]
      },
      {
        number: 7,
        name: "Human Health and Disease",
        unit: "Biology in Human Welfare",
        keyTopics: [
          "Common human pathogens and diseases: Typhoid, Pneumonia, Common cold, Malaria, Amoebiasis, Ascariasis, Filariasis, Ringworm",
          "Immunity: Innate immunity barriers, Acquired immunity (Active and Passive, Humoral and Cell-mediated)",
          "Vaccination and immunisation, Allergies, Autoimmunity",
          "Immune system in the body (Lymphoid organs)",
          "AIDS: Causative agent HIV, Transmission, Replication, Diagnosis (ELISA), Prevention",
          "Cancer: Types, Causes (Carcinogens), Oncogenes, Detection, Treatment",
          "Drugs and alcohol abuse: Opioids, Cannabinoids, Coca alkaloids, Adolescence issues"
        ]
      },
      {
        number: 8,
        name: "Microbes in Human Welfare",
        unit: "Biology in Human Welfare",
        keyTopics: [
          "Microbes in household food processing (Lactic acid bacteria, Yeast, Toddy, Cheese)",
          "Microbes in industrial production (Fermented beverages, Antibiotics, Organic acids, Enzymes, Bioactive molecules)",
          "Microbes in sewage treatment (Primary and secondary biological treatment, BOD)",
          "Microbes in biogas production (Methanogens)",
          "Microbes as biocontrol agents (Bacillus thuringiensis, Trichoderma, Baculoviruses)",
          "Microbes as biofertilisers (Rhizobium, Azospirillum, Mycorrhiza, Cyanobacteria)"
        ]
      },
      {
        number: 9,
        name: "Biotechnology: Principles and Processes",
        unit: "Biotechnology",
        keyTopics: [
          "Principles of biotechnology: Genetic engineering and bioprocess engineering",
          "Tools of recombinant DNA technology: Restriction enzymes (Endonucleases, Palindromic sequences), DNA ligase, Polymerase",
          "Cloning vectors: Features (Ori, Selectable markers, Cloning sites), Plasmids (pBR322)",
          "Competent host preparation (Chemical, Electroporation, Gene gun, Microinjection)",
          "Processes of r-DNA technology: Isolation of DNA, Agarose gel electrophoresis, PCR (Polymerase Chain Reaction), Insertion into host",
          "Bioreactors (Stirred-tank) and downstream processing"
        ]
      },
      {
        number: 10,
        name: "Biotechnology and its Applications",
        unit: "Biotechnology",
        keyTopics: [
          "Biotechnological applications in agriculture: Genetically Modified Crops (Bt crops, Pest resistant tobacco by RNA interference)",
          "Applications in medicine: Genetically engineered insulin (Humulin), Gene therapy (ADA deficiency treatment), Molecular diagnosis (ELISA, PCR)",
          "Transgenic animals: Production, Importance in testing vaccine safety and toxicity",
          "Ethical issues: GEAC regulations, Biopiracy, Patents"
        ]
      },
      {
        number: 11,
        name: "Organisms and Populations",
        unit: "Ecology",
        keyTopics: [
          "Organism and its environment: Major abiotic factors (Temperature, Water, Light, Soil)",
          "Responses to abiotic factors: Regulate, Conform, Migrate, Suspend",
          "Adaptations in plants and animals (Kangaroo rat, Opuntia, Altitude sickness)",
          "Population attributes: Birth rate, Death rate, Sex ratio, Age pyramids",
          "Population growth models: Exponential growth and Logistic growth (Verhulst-Pearl)",
          "Population interactions: Mutualism, Competition, Predation, Parasitism, Commensalism, Amensalism"
        ]
      },
      {
        number: 12,
        name: "Ecosystem",
        unit: "Ecology",
        keyTopics: [
          "Ecosystem structure and function: Abiotic and biotic components",
          "Productivity: Primary (Gross and Net) and Secondary productivity",
          "Decomposition: Steps (Fragmentation, Leaching, Catabolism, Humification, Mineralisation)",
          "Energy flow through trophic levels and 10% law",
          "Ecological pyramids: Pyramids of number, biomass and energy (Upright vs inverted)",
          "Ecological succession: Hydrarch and Xerarch succession stages, Pioneer species and Climax community"
        ]
      },
      {
        number: 13,
        name: "Biodiversity and Conservation",
        unit: "Ecology",
        keyTopics: [
          "Concept and levels of biodiversity (Genetic, Species, Ecological)",
          "Patterns of biodiversity: Latitudinal gradients and Species-Area relationship",
          "Importance of biodiversity for ecosystem stability (David Tilman, Paul Ehrlich’s rivet popper hypothesis)",
          "Loss of biodiversity and The Evil Quartet (Habitat loss, Over-exploitation, Alien species invasions, Co-extinctions)",
          "Biodiversity conservation strategies: In-situ (National parks, Sanctuaries, Biosphere reserves) and Ex-situ (Botanical gardens, Zoos, Cryopreservation, Seed banks)"
        ]
      },
      {
        number: 14,
        name: "Environmental Issues",
        unit: "Ecology",
        keyTopics: [
          "Air pollution and its control: Electrostatic precipitators, Catalytic converters, CNG in Delhi",
          "Water pollution and its control: Domestic sewage and industrial effluents, BOD, Eutrophication, Biomagnification",
          "Solid waste management: Municipal waste, Sanitary landfills, E-waste recycling",
          "Greenhouse effect and global warming causes and mitigation",
          "Ozone depletion in stratosphere and Montreal Protocol",
          "Environmental protection laws and public initiatives"
        ]
      }
    ],
    "Social Science": [
      {
        number: 1,
        name: "Bricks, Beads and Bones: The Harappan Civilisation",
        unit: "History",
        keyTopics: ["Urban centres of Indus Valley", "Craft production and bead making", "Domestic architecture and drainage", "Trade and external contacts", "Social and economic life", "Archaeological evidence and deciphering Harappan script"]
      },
      {
        number: 2,
        name: "Kings, Farmers and Towns",
        unit: "History",
        keyTopics: ["Political and economic history of early India (c. 600 BCE–600 CE)", "Emergence of Mahajanapadas and Mauryan Empire", "Inscriptions and deciphering Brahmi script", "Agrarian economy and land grants", "Towns and trade networks"]
      },
      {
        number: 3,
        name: "Kinship, Caste and Class",
        unit: "History",
        keyTopics: ["Social relations through Mahabharata", "Kinship and marriage rules", "Caste system and varna hierarchy", "Beyond varna: Social categories", "Patriarchy and access to property"]
      },
      {
        number: 4,
        name: "Thinkers, Beliefs and Buildings",
        unit: "History",
        keyTopics: ["Cultural developments (c. 600 BCE–600 CE)", "Religious traditions: Vedic, Buddhist, Jain", "Teachings of Mahavira and Gautama Buddha", "Stupas architecture (Sanchi Stupa)", "Early Hindu temples and sculpture"]
      },
      {
        number: 5,
        name: "Through the Eyes of Travellers",
        unit: "History",
        keyTopics: ["Perceptions of medieval Indian society by foreign travellers", "Al-Biruni and Kitab-ul-Hind", "Ibn Battuta’s Rihla and Indian postal system", "Francois Bernier and Mughal India"]
      },
      {
        number: 6,
        name: "Bhakti-Sufi Traditions",
        unit: "History",
        keyTopics: ["Religious histories (c. 8th–18th century)", "Alvars and Nayanars of Tamil Nadu", "Virashaiva tradition in Karnataka", "Sufism: Silsilas, Chishtis in subcontinent", "New devotional paths: Kabir, Guru Nanak, Mirabai"]
      },
      {
        number: 7,
        name: "An Imperial Capital: Vijayanagara",
        unit: "History",
        keyTopics: ["The city of Vijayanagara and its landscape", "Fortifications, roads and royal center", "Architecture: Mahanavami Dibba, Lotus Mahal, Hazara Rama temple", "Sacred center and Virupaksha temple", "Political system and Nayakas"]
      },
      {
        number: 8,
        name: "Peasants, Zamindars and the State",
        unit: "History",
        keyTopics: ["Agrarian society and Mughal Empire", "Peasants and agricultural production", "Village community and panchayats", "Zamindars and land revenue system", "Ain-i-Akbari by Abu'l Fazl"]
      },
      {
        number: 9,
        name: "Kings and Chronicles",
        unit: "History",
        keyTopics: ["The Mughal Court (c. 16th–17th century)", "Akbar and Akbar Nama", "Chronicles as sources of history", "The imperial court etiquette and administration"]
      },
      {
        number: 10,
        name: "Colonialism and the Countryside",
        unit: "History",
        keyTopics: ["Colonial revenue policies: Permanent Settlement in Bengal", "Zamindars and ryots resistance", "Peasants revolt in Bombay Deccan", "The Santhal rebellion and Damin-i-Koh", "Colonial official reports"]
      },
      {
        number: 11,
        name: "Rebels and the Raj",
        unit: "History",
        keyTopics: ["The 1857 Revolt and its representations", "Causes, outbreak and spread of rebellion", "Awadh in revolt", "Leaders and popular participation", "British suppression and visual representations"]
      },
      {
        number: 12,
        name: "Colonial Cities",
        unit: "History",
        keyTopics: ["Urbanisation, planning and architecture under British rule", "Port cities: Madras, Calcutta, Bombay", "Civil lines, cantonments and segregation", "Architectural styles: Neo-classical, Neo-Gothic, Indo-Saracenic"]
      },
      {
        number: 13,
        name: "Mahatma Gandhi and the Nationalist Movement",
        unit: "History",
        keyTopics: ["Gandhian era (1915–1948)", "Champaran, Kheda and Ahmedabad satyagrahas", "Non-Cooperation Movement and Khilafat", "Salt March and Civil Disobedience", "Quit India Movement", "Mass mobilization and Gandhian philosophy"]
      },
      {
        number: 14,
        name: "Understanding Partition",
        unit: "History",
        keyTopics: ["Partition of India 1947", "Events, negotiations and politics leading to partition", "Violence, displacement and refugees", "Gender experiences and oral histories of survivors"]
      },
      {
        number: 15,
        name: "Framing the Constitution",
        unit: "History",
        keyTopics: ["The Constituent Assembly and its composition", "Vision of the Constitution and debates", "Federalism vs central power", "Defining minority rights and national language", "Dr. B.R. Ambedkar and the Drafting Committee"]
      },
      {
        number: 16,
        name: "Human Geography: Nature and Scope",
        unit: "Geography",
        keyTopics: ["Nature of human geography and core concepts", "Environmental determinism, Possibilism and Neo-determinism", "Schools of thought: Welfare, Radical, Behavioral", "Fields and sub-fields of human geography"]
      },
      {
        number: 17,
        name: "The World Population: Distribution, Density and Growth",
        unit: "Geography",
        keyTopics: ["Patterns of population distribution and density across continents", "Factors influencing population distribution", "Components of population change (Birth, Death, Migration)", "Demographic Transition Theory", "Population control measures"]
      },
      {
        number: 18,
        name: "Human Development",
        unit: "Geography",
        keyTopics: ["Concept of human development (Amartya Sen and Mahbub ul Haq)", "Four pillars of human development", "Approaches to human development", "Human Development Index (HDI) international comparisons"]
      },
      {
        number: 19,
        name: "Primary Activities",
        unit: "Geography",
        keyTopics: ["Hunting, gathering and pastoralism", "Subsistence vs commercial agriculture", "Plantation agriculture, Mixed farming, Dairy farming", "Mining: Factors and methods (Opencast and underground)"]
      },
      {
        number: 20,
        name: "Secondary Activities",
        unit: "Geography",
        keyTopics: ["Manufacturing industries and modern industrial features", "Industrial location factors (Weber’s theory)", "Classification of manufacturing industries", "Agro-based, Mineral-based, Chemical industries", "Major industrial regions of the world"]
      },
      {
        number: 21,
        name: "Tertiary and Quaternary Activities",
        unit: "Geography",
        keyTopics: ["Types of tertiary activities: Trade, Transport, Communication, Services", "Tourism and medical tourism", "Quaternary activities: Knowledge and information-based industries", "Quinary activities and outsourcing (BPO, KPO)"]
      },
      {
        number: 22,
        name: "Transport and Communication",
        unit: "Geography",
        keyTopics: ["Land transport: Trans-continental railways, Highway networks", "Water transport: Major oceanic routes (North Atlantic, Suez, Panama Canal)", "Air transport corridors", "Pipelines and satellite communication"]
      },
      {
        number: 23,
        name: "International Trade",
        unit: "Geography",
        keyTopics: ["Basis of international trade and historical development", "Balance of trade: Favorable vs unfavorable", "Types of international trade", "World Trade Organisation (WTO)", "Gateways of international trade: Ports"]
      },
      {
        number: 24,
        name: "The End of Bipolarity",
        unit: "Political Science",
        keyTopics: ["The Soviet system and collapse of USSR", "Gorbachev’s policies: Glasnost and Perestroika", "Consequences of disintegration of USSR", "Shock Therapy in post-communist regimes", "India’s relations with Russia and other post-communist countries"]
      },
      {
        number: 25,
        name: "Contemporary Centres of Power",
        unit: "Political Science",
        keyTopics: ["European Union (EU): Political, economic, military influence", "Association of Southeast Asian Nations (ASEAN): Pillars and security community", "Rise of Chinese economy and economic reforms", "Japan and South Korea as emerging economic powers"]
      },
      {
        number: 26,
        name: "Contemporary South Asia",
        unit: "Political Science",
        keyTopics: ["Geopolitics of South Asian region", "Democracy in Pakistan and Bangladesh", "Monarchy and democracy in Nepal", "Ethnic conflict and democracy in Sri Lanka", "India–Pakistan and India–Bangladesh relations", "SAARC and bilateral trade"]
      },
      {
        number: 27,
        name: "International Organizations",
        unit: "Political Science",
        keyTopics: ["Why international organizations are needed?", "Evolution and restructuring of the United Nations (UN)", "UN Security Council reforms and permanent membership debate", "Jurisdiction and agencies of UN (UNESCO, UNICEF, WHO, ILO)", "IMF, World Bank, WTO"]
      },
      {
        number: 28,
        name: "Security in the Contemporary World",
        unit: "Political Science",
        keyTopics: ["Meaning of security and dimensions", "Traditional notions of security: External (Deterrence, Defense, Balance of power) and Internal", "Non-traditional notions: Human security and global security", "New sources of threats: Terrorism, Human rights violations, Global poverty, Epidemics", "India’s security strategy"]
      },
      {
        number: 29,
        name: "Environment and Natural Resources",
        unit: "Political Science",
        keyTopics: ["Environmental issues in global politics", "Common Property Resources and Global Commons", "Common but differentiated responsibilities (Kyoto Protocol, Paris Agreement)", "Resource geopolitics: Oil and water", "Indigenous peoples and their rights"]
      },
      {
        number: 30,
        name: "Globalisation",
        unit: "Political Science",
        keyTopics: ["Concept, dimensions and causes of globalisation", "Political, economic and cultural consequences of globalisation", "India and globalisation", "Resistance to globalisation and anti-globalisation movements (World Social Forum)"]
      },
      {
        number: 31,
        name: "National Income and Related Aggregates",
        unit: "Economics",
        keyTopics: ["Macroeconomics concepts and circular flow of income", "Basic aggregates: GDP, NDP, GNP, NNP at market price and factor cost", "Methods of calculating national income: Value Added, Income, Expenditure", "Real vs Nominal GDP, GDP deflator, GDP and welfare"]
      },
      {
        number: 32,
        name: "Money and Banking",
        unit: "Economics",
        keyTopics: ["Money: Meaning and functions (Primary, Secondary)", "Money supply: M1, M2, M3, M4 aggregates", "Commercial banks: Process of credit creation (Money multiplier)", "Central Bank (RBI): Functions (Currency issuance, Banker to government, Banker's bank, Lender of last resort, Control of credit via CRR, SLR, Repo rate, Reverse repo, Open market operations)"]
      },
      {
        number: 33,
        name: "Determination of Income and Employment",
        unit: "Economics",
        keyTopics: ["Aggregate Demand (AD) and Aggregate Supply (AS) and components", "Propensity to consume (APC, MPC) and Propensity to save (APS, MPS)", "Short-run equilibrium output (AD-AS and S-I approaches)", "Investment multiplier mechanism (k = 1/(1-MPC))", "Problems of deficient demand and excess demand (Deflationary and Inflationary gaps)", "Monetary and fiscal measures to correct deficient/excess demand"]
      },
      {
        number: 34,
        name: "Government Budget and the Economy",
        unit: "Economics",
        keyTopics: ["Government budget: Meaning, objectives and components", "Revenue budget: Revenue receipts (Tax, Non-tax) and Revenue expenditure", "Capital budget: Capital receipts and Capital expenditure", "Measures of government deficit: Revenue deficit, Fiscal deficit, Primary deficit and implications"]
      },
      {
        number: 35,
        name: "Balance of Payments",
        unit: "Economics",
        keyTopics: ["Balance of payments account: Meaning and components", "Current account and Capital account transactions", "Balance of payments deficit/surplus and Autonomous vs Accommodating items", "Foreign exchange rate: Fixed, Flexible and Managed floating systems", "Determination of exchange rate in free market, Merits and demerits"]
      },
      {
        number: 36,
        name: "Indian Economy on the Eve of Independence",
        unit: "Economics",
        keyTopics: ["Low level of economic development under colonial rule", "Agricultural sector: Zamindari system, Commercialisation", "Industrial sector: De-industrialisation of handicrafts, Lack of capital goods industries", "Foreign trade monopoly of Britain", "Demographic condition and occupational structure", "Infrastructure development by British"]
      },
      {
        number: 37,
        name: "Indian Economy 1950–1990",
        unit: "Economics",
        keyTopics: ["Goals of Five Year Plans: Growth, Modernisation, Self-reliance, Equity", "Agriculture: Land reforms, Green Revolution (High yielding varieties)", "Industry and trade: Industrial Policy Resolution 1956 (IPR 1956)", "Small-Scale Industries (SSI) promotion", "Trade policy: Import substitution strategy"]
      },
      {
        number: 38,
        name: "Liberalisation, Privatisation and Globalisation: An Appraisal",
        unit: "Economics",
        keyTopics: ["Background and economic crisis of 1991 (New Economic Policy NEP 1991)", "Liberalisation: Deregulation of industrial sector, Financial sector reforms, Tax reforms, Foreign exchange reforms", "Privatisation: Disinvestment in PSUs, Navratnas and Miniratnas", "Globalisation: Outsourcing, WTO agreements", "Appraisal of LPG policies: Strengths and limitations"]
      },
      {
        number: 39,
        name: "Human Capital Formation in India",
        unit: "Economics",
        keyTopics: ["Concept of human capital vs physical capital", "Sources of human capital: Education, Health, On-the-job training, Migration, Information", "Human capital and economic growth correlation", "State of education and health sector in India", "Right to Education and government initiatives"]
      },
      {
        number: 40,
        name: "Rural Development",
        unit: "Economics",
        keyTopics: ["Key issues in rural development", "Rural credit: Institutional sources (NABARD, Commercial banks, RRBs, SHGs)", "Agricultural marketing system and government interventions (MSP, Buffer stocks)", "Diversification into productive activities: Horticulture, Animal husbandry, Fisheries, Organic farming"]
      },
      {
        number: 41,
        name: "Employment: Growth, Informalisation and Other Issues",
        unit: "Economics",
        keyTopics: ["Workers and employment: Worker-population ratio, Formal vs Informal sectors", "Self-employed vs Hired workers", "Informalisation of Indian workforce", "Unemployment types (Disguised, Seasonal, Educated)", "Government policies for employment generation (MGNREGA)"]
      },
      {
        number: 42,
        name: "Infrastructure",
        unit: "Economics",
        keyTopics: ["Meaning and types of infrastructure: Economic and Social", "Energy sector in India: Commercial and non-commercial sources, Power shortages", "Health infrastructure: Public health system, Private sector expansion, Global burden of disease"]
      },
      {
        number: 43,
        name: "Environment and Sustainable Development",
        unit: "Economics",
        keyTopics: ["Environment: Meaning, functions and carrying capacity", "State of India’s environment: Air and water pollution, Soil degradation", "Sustainable development: Concept (Brundtland Commission)", "Strategies for sustainable development: Solar energy, Wind power, Bio-pest control, Organic farming"]
      },
      {
        number: 44,
        name: "Development Experience of India: A Comparison with Neighbours",
        unit: "Economics",
        keyTopics: ["Comparative development indicators: India, China, Pakistan", "Development strategies and economic growth trajectory", "Demographic indicators comparison", "Human Development Indicators (HDI, Life expectancy, Maternal mortality, Infant mortality)"]
      }
    ]
  },

  // ==========================================
  // DROPPER BATCH (NEET-UG & JEE Main / Advanced Repeaters)
  // ==========================================
  "Dropper": {
    "Physics": [
      {
        number: 1,
        name: "Kinematics & Laws of Motion",
        unit: "Mechanics",
        keyTopics: [
          "1D & 2D Motion (Equations, Graphs, Relative Velocity)",
          "Projectile Motion (Ground-to-Ground, Incline, Trajectory Equation)",
          "Newton's Laws of Motion & Free Body Diagrams (FBD)",
          "Static & Kinetic Friction, Angle of Repose, Banking of Roads",
          "Impulse, Linear Momentum Conservation, Variable Mass Systems"
        ]
      },
      {
        number: 2,
        name: "Work, Energy & Power",
        unit: "Mechanics",
        keyTopics: [
          "Work Done by Constant & Variable Forces",
          "Work-Energy Theorem & Kinetic Energy Formula",
          "Conservative Forces, Potential Energy Curves & Equilibrium Types",
          "Collisions in 1D & 2D (Elastic, Inelastic, Coefficient of Restitution)",
          "Power & Rate of Energy Transfer"
        ]
      },
      {
        number: 3,
        name: "Rotational Motion & System of Particles",
        unit: "Mechanics",
        keyTopics: [
          "Center of Mass & Motion of Center of Mass",
          "Moment of Inertia (Parallel & Perpendicular Axes Theorems)",
          "Torque, Angular Acceleration & Newton's Second Law for Rotation",
          "Angular Momentum & Principle of Conservation of Angular Momentum",
          "Pure Rolling Motion, Combined Translation and Rotation on Incline"
        ]
      },
      {
        number: 4,
        name: "Thermodynamics & Kinetic Theory",
        unit: "Thermal Physics",
        keyTopics: [
          "Zeroth & First Law of Thermodynamics, Internal Energy",
          "Isothermal, Adiabatic, Isobaric & Isochoric Processes (PV Work)",
          "Second Law of Thermodynamics, Heat Engines, Carnot Cycle Efficiency",
          "Kinetic Theory of Gases (RMS Velocity, Degrees of Freedom, Specific Heat)",
          "Heat Transfer (Conduction, Convection, Stefan's Law & Wien's Displacement Law)"
        ]
      },
      {
        number: 5,
        name: "Electrostatics & Capacitance",
        unit: "Electromagnetism",
        keyTopics: [
          "Coulomb's Law, Electric Field Lines & Superposition Principle",
          "Gauss's Law & Applications (Spheres, Cylinders, Infinite Sheets)",
          "Electric Potential, Potential Energy of System of Charges, Dipole Moments",
          "Capacitance, Parallel Plate Capacitor with Dielectrics",
          "Energy Stored in Capacitors, Redistribution of Charge & Loss of Energy",
          "RC Circuits (Charging and Discharging Dynamics)"
        ]
      },
      {
        number: 6,
        name: "Current Electricity & Magnetic Effects",
        unit: "Electromagnetism",
        keyTopics: [
          "Drift Velocity, Ohm's Law, Temperature Dependence of Resistance",
          "Kirchhoff's Rules & Balanced Wheatstone Bridge",
          "Potentiometer & Meter Bridge Principles",
          "Biot-Savart Law & Magnetic Field of Circular Loop / Solenoid",
          "Ampere's Circuital Law & Toroid",
          "Lorentz Force, Motion of Charge in Combined Electric & Magnetic Fields",
          "Cyclotron, Moving Coil Galvanometer, Shunt & Voltmeter Conversion"
        ]
      },
      {
        number: 7,
        name: "Electromagnetic Induction & Alternating Current",
        unit: "Electromagnetism",
        keyTopics: [
          "Magnetic Flux, Faraday's Laws & Lenz's Law of Induction",
          "Motional EMF & Eddy Currents",
          "Self & Mutual Inductance, Inductors in Circuits",
          "AC Voltage Applied to Resistor, Inductor, Capacitor",
          "Series LCR Circuit, Resonance, Quality Factor (Q) & Bandwidth",
          "Power in AC Circuits, Wattless Current, Transformers"
        ]
      },
      {
        number: 8,
        name: "Optics (Ray & Wave)",
        unit: "Optics",
        keyTopics: [
          "Reflection, Mirror Formula & Magnification",
          "Refraction, Snell's Law & Total Internal Reflection (Optical Fibers)",
          "Refraction at Spherical Surfaces, Lens Maker's Formula & Thin Lenses",
          "Prism Formula & Dispersion of Light",
          "Wavefronts, Huygens' Principle & Laws of Reflection/Refraction",
          "Interference of Light & Young's Double Slit Experiment (YDSE)",
          "Diffraction at a Single Slit, Resolving Power & Polarisation"
        ]
      },
      {
        number: 9,
        name: "Modern Physics & Semiconductor Electronics",
        unit: "Modern Physics",
        keyTopics: [
          "Dual Nature of Radiation & Matter, Photoelectric Effect (Einstein's Equation)",
          "de Broglie Hypothesis, Davisson-Germer Experiment",
          "Bohr's Model of Hydrogen Atom, Energy Levels & Spectral Series",
          "Nuclear Physics, Mass Defect, Binding Energy per Nucleon, Radioactivity",
          "Semiconductor Diodes, p-n Junction, Forward & Reverse Bias",
          "Zener Diode, LED, Photodiode, Solar Cell, Logic Gates (AND, OR, NOT, NAND, NOR)"
        ]
      }
    ],
    "Chemistry": [
      {
        number: 1,
        name: "Mole Concept & Stoichiometry",
        unit: "Physical Chemistry",
        keyTopics: [
          "Mole Calculations, Molar Mass, Avogadro's Number",
          "Limiting Reagent & Theoretical Yield Calculations",
          "Concentration Terms (Molarity, Molality, Mole Fraction, Normality, ppm)",
          "Empirical & Molecular Formula Determination",
          "Redox Reactions & Balancing by Ion-Electron Method"
        ]
      },
      {
        number: 2,
        name: "Atomic Structure & Chemical Bonding",
        unit: "Inorganic & Physical",
        keyTopics: [
          "Quantum Numbers, Pauli's Exclusion, Hund's Rule, Aufbau Principle",
          "de Broglie Wavelength & Heisenberg's Uncertainty Principle",
          "VSEPR Theory & Molecular Geometry",
          "Hybridization (sp, sp2, sp3, sp3d, sp3d2) & Dipole Moments",
          "Molecular Orbital Theory (MOT), Bond Order, Magnetic Nature of O2/N2"
        ]
      },
      {
        number: 3,
        name: "Chemical Thermodynamics & Equilibrium",
        unit: "Physical Chemistry",
        keyTopics: [
          "First Law of Thermodynamics, Enthalpy of Reactions (Hess's Law)",
          "Entropy & Second Law of Thermodynamics",
          "Gibbs Free Energy (Delta G) & Spontaneity Criteria",
          "Chemical Equilibrium, Law of Mass Action, Kp vs Kc Relations",
          "Le Chatelier's Principle (Effect of Concentration, Temp, Pressure)",
          "Ionic Equilibrium, pH Calculations, Ostwald's Dilution Law",
          "Common Ion Effect, Buffer Solutions (Henderson-Hasselbalch Equation)",
          "Solubility Product (Ksp) & Precipitation Conditions"
        ]
      },
      {
        number: 4,
        name: "Organic Chemistry - Reaction Mechanisms & Hydrocarbons",
        unit: "Organic Chemistry",
        keyTopics: [
          "Electronic Effects (Inductive, Resonance, Hyperconjugation, Electromeric)",
          "Reaction Intermediates (Carbocations, Carbanions, Free Radicals stability)",
          "Electrophilic Aromatic Substitution (Nitration, Sulphonation, Friedel-Crafts)",
          "Nucleophilic Substitution (SN1 vs SN2 Mechanisms & Stereochemistry)",
          "Elimination Reactions (E1 vs E2, Saytzeff vs Hofmann Rule)",
          "Markovnikov & Anti-Markovnikov (Peroxide Effect) Additions"
        ]
      },
      {
        number: 5,
        name: "Aldehydes, Ketones & Carboxylic Acids",
        unit: "Organic Chemistry",
        keyTopics: [
          "Preparation Methods (Ozonolysis, Oxidation of Alcohols, Rosenmund Reduction)",
          "Nucleophilic Addition Reactions (HCN, NaHSO3, Grignard Reagent)",
          "Aldol Condensation & Cross Aldol Condensation Mechanisms",
          "Cannizzaro Reaction & Cross Cannizzaro Reaction",
          "Clemmensen & Wolff-Kishner Reductions, Haloform / Iodoform Test",
          "Acidic Strength of Carboxylic Acids & Hell-Volhard-Zelinsky (HVZ) Reaction"
        ]
      },
      {
        number: 6,
        name: "Coordination Compounds & d-Block Elements",
        unit: "Inorganic Chemistry",
        keyTopics: [
          "Transition Elements (Electronic Config, Oxidation States, Catalytic Properties)",
          "Werner's Coordination Theory (Primary vs Secondary Valency)",
          "IUPAC Nomenclature of Coordination Complexes",
          "Isomerism (Structural: Linkage, Ionisation, Coordination; Stereoisomerism)",
          "Valence Bond Theory (Inner vs Outer Orbital Complexes)",
          "Crystal Field Theory (CFT), Octahedral & Tetrahedral Splitting, CFSE",
          "Spectrochemical Series, High Spin vs Low Spin Complexes, Magnetic Moments"
        ]
      }
    ],
    "Biology": [
      {
        number: 1,
        name: "Genetics & Principles of Inheritance",
        unit: "Genetics & Evolution",
        keyTopics: [
          "Mendel's Laws of Inheritance (Monohybrid & Dihybrid Cross Ratios)",
          "Incomplete Dominance, Codominance, Multiple Alleles (ABO Blood Groups)",
          "Pleiotropy & Polygenic Inheritance",
          "Chromosomal Theory of Inheritance (Sutton & Boveri)",
          "Morgan's Drosophila Experiments, Linkage & Genetic Recombination",
          "Sex Determination Mechanisms (XX-XY, ZZ-ZW, Haplodiploidy in Honeybees)",
          "Mendelian Disorders (Haemophilia, Sickle-Cell Anaemia, Phenylketonuria, Thalassemia)",
          "Chromosomal Disorders (Down's, Turner's, Klinefelter's Syndromes)",
          "Pedigree Analysis (Autosomal Dominant/Recessive, X-linked Traits)"
        ]
      },
      {
        number: 2,
        name: "Molecular Basis of Inheritance",
        unit: "Genetics & Evolution",
        keyTopics: [
          "Structure of Polynucleotide Chain (DNA & RNA, Chargaff's Rules)",
          "Packaging of DNA Helix (Nucleosome Structure, Histones)",
          "Search for Genetic Material (Griffith's Transforming Principle, Avery-MacLeod, Hershey-Chase)",
          "Semi-Conservative DNA Replication (Meselson-Stahl Experiment, DNA Polymerase)",
          "Transcription Unit & Mechanism (Initiation, Elongation, Termination, Post-transcriptional Splicing)",
          "Genetic Code Features (Triplet, Degenerate, Unambiguous, Universal)",
          "Translation Mechanism (tRNA Adaptor, Ribosome, Peptide Bond Formation)",
          "Regulation of Gene Expression, Lac Operon Mechanism (Inducible System)",
          "Human Genome Project (HGP) Goals & Methodologies, DNA Fingerprinting (VNTRs)"
        ]
      },
      {
        number: 3,
        name: "Human Physiology - Complete System Integration",
        unit: "Human Physiology",
        keyTopics: [
          "Breathing & Exchange of Gases (Respiratory Volumes, Oxygen Dissociation Curve, CO2 Transport)",
          "Body Fluids & Circulation (Cardiac Cycle, Double Circulation, ECG Waves, Heart Regulation)",
          "Excretory Products & Elimination (Nephron Ultrafiltration, Countercurrent Mechanism, RAAS, ANF)",
          "Locomotion & Movement (Sarcomere Structure, Sliding Filament Theory, Joints)",
          "Neural Control & Coordination (Neuron Structure, Nerve Impulse Generation & Conduction, Synapse)",
          "Chemical Coordination & Integration (Pituitary, Thyroid, Adrenal, Pancreas, Hormone Mechanisms)"
        ]
      },
      {
        number: 4,
        name: "Plant Physiology & Photosynthesis",
        unit: "Plant Physiology",
        keyTopics: [
          "Light Reactions & Photophosphorylation (Cyclic vs Non-Cyclic Electron Transport / Z-Scheme)",
          "Photolysis of Water & Chemiosmotic ATP Synthesis (ATP Synthase)",
          "Dark Reactions / Calvin Cycle (Carboxylation, Reduction, Regeneration, RuBisCO)",
          "C4 Pathway (Kranz Anatomy, Hatch-Slack Pathway, PEPcase)",
          "Photorespiration (C2 Cycle) & Differences between C3 and C4 Plants",
          "Factors Affecting Photosynthesis (Blackman's Law of Limiting Factors)",
          "Respiration in Plants (Glycolysis, Krebs Cycle, Electron Transport System, RQ Values)",
          "Plant Growth Regulators (Auxins, Gibberellins, Cytokinins, Ethylene, Abscisic Acid)"
        ]
      },
      {
        number: 5,
        name: "Biotechnology - Principles, Processes & Applications",
        unit: "Biotechnology",
        keyTopics: [
          "Tools of Recombinant DNA Technology (Restriction Endonucleases, DNA Ligase, Alkaline Phosphatase)",
          "Cloning Vectors (pBR322 Features, Origin of Replication, Selectable Markers, Insertional Inactivation)",
          "Competent Host Preparation (Heat Shock, Electroporation, Gene Gun, Microinjection)",
          "Processes of r-DNA Technology (Gel Electrophoresis, PCR Amplification Steps, Bioreactors)",
          "Biotechnological Applications in Agriculture (Bt Cotton, RNA Interference / RNAi in Tobacco)",
          "Applications in Medicine (Genetically Engineered Insulin, Gene Therapy for ADA Deficiency)",
          "Transgenic Animals, Biopiracy & Ethical Issues (GEAC)"
        ]
      },
      {
        number: 6,
        name: "Ecology & Environmental Biology",
        unit: "Ecology",
        keyTopics: [
          "Organisms & Environment (Abiotic Factors, Adaptations in Desert Plants & Arctic Animals)",
          "Population Attributes (Birth/Death Rates, Sex Ratio, Age Pyramids, Exponential vs Logistic Growth)",
          "Population Interactions (Mutualism, Competition, Predation, Parasitism, Commensalism, Amensalism)",
          "Ecosystem Structure (Productivity, Decomposition, Energy Flow, 10% Law, Ecological Pyramids)",
          "Biodiversity & Conservation (Levels of Biodiversity, Latitudinal Gradients, Rivet Popper Hypothesis)",
          "Threats to Biodiversity (Evil Quartet), In-situ vs Ex-situ Conservation Strategies"
        ]
      }
    ],
    "Mathematics": [
      {
        number: 1,
        name: "Calculus - Differential & Integral",
        unit: "Calculus",
        keyTopics: [
          "Limits, Continuity & Differentiability (L'Hopital's Rule, Intermediate Value Theorem)",
          "Chain Rule, Implicit & Parametric Differentiation, Higher Order Derivatives",
          "Applications of Derivatives (Rate of Change, Tangents & Normals, Increasing/Decreasing)",
          "Maxima & Minima (First & Second Derivative Tests, Word Problems)",
          "Rolle's & Lagrange's Mean Value Theorems",
          "Indefinite Integration (Substitution, By Parts, Partial Fractions)",
          "Definite Integrals (Fundamental Theorem, Properties & King's Rule)",
          "Area Bounded by Curves (Parabola, Ellipse, Line Intersections)",
          "Differential Equations (Variable Separable, Homogeneous, Linear Differential Equations)"
        ]
      },
      {
        number: 2,
        name: "Coordinate Geometry & Conic Sections",
        unit: "Geometry",
        keyTopics: [
          "Straight Lines (Slope, Intercept, Normal Form, Angle between Lines, Distance Formula)",
          "Pair of Straight Lines & Homogeneous Equations",
          "Circles (Standard & General Equations, Tangent & Normal Equations, Chord of Contact)",
          "Parabola (Standard Forms, Focal Distance, Tangents & Normals, Parametric Form)",
          "Ellipse (Eccentricity, Foci, Directrix, Auxiliary Circle, Tangent Properties)",
          "Hyperbola (Asymptotes, Rectangular Hyperbola, Conjugate Hyperbola)"
        ]
      },
      {
        number: 3,
        name: "Vectors & 3D Geometry",
        unit: "Algebra & Geometry",
        keyTopics: [
          "Dot Product (Scalar Product) & Projections",
          "Cross Product (Vector Product) & Area of Triangle / Parallelogram",
          "Scalar Triple Product & Vector Triple Product (Coplanarity Criteria)",
          "Direction Cosines & Direction Ratios of a Line in 3D",
          "Equation of Line in Space (Vector & Cartesian Forms)",
          "Shortest Distance between Two Skew Lines & Parallel Lines",
          "Planes in 3D & Intersection of Line with Plane"
        ]
      },
      {
        number: 4,
        name: "Algebra - Matrices, Determinants & Probability",
        unit: "Algebra",
        keyTopics: [
          "Matrix Operations, Symmetric & Skew-Symmetric Matrices, Orthogonal Matrices",
          "Determinants Properties, Minors & Cofactors, Adjoint & Inverse of Matrix",
          "System of Linear Equations (Cramer's Rule & Matrix Inversion Method)",
          "Conditional Probability & Multiplication Theorem",
          "Bayes' Theorem & Law of Total Probability",
          "Random Variables, Probability Distributions & Expectation",
          "Binomial Distribution (Mean and Variance)"
        ]
      }
    ]
  }
};

/**
 * Validates whether a given class, subject, and chapter/topic matches the NCERT curriculum.
 */
export function validateNcertSyllabus(classGrade: string, subject: string, topicQuery: string): {
  isValid: boolean;
  normalizedClass: string;
  normalizedSubject: string;
  matchedChapter?: NCERTChapterItem;
  suggestedChapters: string[];
  message: string;
} {
  let targetClass = classGrade.trim();
  if (/^dropper|^repeater/i.test(targetClass)) targetClass = "Dropper";
  else if (/^11th?$|^11$/.test(targetClass)) targetClass = "Class 11";
  else if (/^10th?$|^10$/.test(targetClass)) targetClass = "Class 10";
  else if (/^12th?$|^12$/.test(targetClass)) targetClass = "Class 12";
  else if (/^9th?$|^9$/.test(targetClass)) targetClass = "Class 9";
  else if (!targetClass.toLowerCase().startsWith("class")) targetClass = `Class ${targetClass}`;

  const classData = NCERT_SYLLABUS[targetClass];
  if (!classData) {
    return {
      isValid: false,
      normalizedClass: targetClass,
      normalizedSubject: subject,
      suggestedChapters: [],
      message: `${targetClass} syllabus is supported, but please select Class 9, Class 10, Class 11, or Class 12 for verified NCERT alignment.`
    };
  }

  // Find subject match
  const subjKeys = Object.keys(classData);
  let matchedSubjKey = subjKeys.find(k => k.toLowerCase() === subject.toLowerCase()) ||
    subjKeys.find(k => k.toLowerCase().includes(subject.toLowerCase()));

  // Aliases (e.g. History/Geography -> Social Science)
  if (!matchedSubjKey) {
    if (/history|geography|civics|pol|political|econ/i.test(subject) && classData["Social Science"]) {
      matchedSubjKey = "Social Science";
    } else if (/bio|chem|phy/i.test(subject) && classData[subject]) {
      matchedSubjKey = subject;
    } else if (/bio|chem|phy/i.test(subject) && classData["Science"]) {
      matchedSubjKey = "Science";
    } else {
      matchedSubjKey = subjKeys[0];
    }
  }

  const chapters = classData[matchedSubjKey] || [];
  const queryLower = topicQuery.toLowerCase();

  // Search by chapter name or key topic
  const matchedChapter = chapters.find(ch => 
    ch.name.toLowerCase().includes(queryLower) ||
    queryLower.includes(ch.name.toLowerCase()) ||
    ch.keyTopics.some(t => t.toLowerCase().includes(queryLower) || queryLower.includes(t.toLowerCase()))
  );

  const hasMatch = Boolean(matchedChapter);

  return {
    isValid: hasMatch,
    normalizedClass: targetClass,
    normalizedSubject: matchedSubjKey,
    matchedChapter,
    suggestedChapters: chapters.map(c => `Ch ${c.number}: ${c.name}`),
    message: matchedChapter 
      ? `Validated against 2026–27 NCERT ${targetClass} ${matchedSubjKey} (Unit: ${matchedChapter.unit}).`
      : `Topic "${topicQuery}" could not be verified in official 2026–27 NCERT ${targetClass} ${matchedSubjKey} syllabus.`
  };
}
