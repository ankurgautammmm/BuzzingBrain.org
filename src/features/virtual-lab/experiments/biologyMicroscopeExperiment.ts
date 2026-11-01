import { PracticalExperiment } from '../types/laboratory';

export const BIOLOGY_MICROSCOPE_EXPERIMENT: PracticalExperiment = {
  id: 'c9_compound_microscope_mounts',
  title: 'Preparation & Microscopic Examination of Temporary Mounts (Onion Peel & Cheek Cells)',
  subject: 'Biology',
  classGrade: 'Class 9',
  chapter: 'The Fundamental Unit of Life',
  examTags: ['cbse', 'neet'],
  estimatedDurationMinutes: 30,
  has3D: true,
  hasCalculations: true,
  learningObjectives: [
    'Master the mechanical operation of a 3D Compound Optical Microscope (coarse focus, fine focus, revolving nosepiece, condenser, iris diaphragm).',
    'Prepare and examine temporary stained mounts of plant cells (Alliuum cepa onion epidermal peel stained with Safranin).',
    'Prepare and examine temporary stained mounts of animal cells (Homo sapiens buccal cheek squamous epithelium stained with Methylene Blue).',
    'Calculate total optical magnification, field of view (FOV) diameter, and approximate cell dimensions.',
    'Distinguish between plant cell features (cell wall, peripheral nucleus, large central vacuole) and animal cell features (flexible membrane, central nucleus, dense cytoplasm).'
  ],
  prerequisites: [
    'Understanding of cell theory formulated by Schleiden, Schwann, and Virchow.',
    'Knowledge of basic cellular organelles (nucleus, cytoplasm, cell wall, vacuoles, plasma membrane).',
    'Care and handling of optical glass objectives and glass slides.'
  ],
  scientificPrinciple: `A compound light microscope uses two lens systems in series to achieve high compound magnification:
Total Magnification M = M_ocular × M_objective
The objective lens forms a real, inverted, magnified intermediate image inside the body tube. The ocular eyepiece lens acts as a simple magnifier on this intermediate image to project a virtual, magnified final image to the observer’s eye.
Staining enhances visual contrast by selectively adsorbing onto specific biomolecules:
- Safranin (basic red dye) binds strongly to cellulose, pectin, and lignified cell walls and chromatin in plant tissues.
- Methylene Blue (cationic dye) binds to polyanionic nucleic acids (DNA/RNA) in animal nuclei and acidic cytoplasmic granules.`,
  curriculumReference: 'NCERT Class 9 Science Chapter 5 & CBSE Class 9 Practical Syllabus Experiment 1',
  apparatus: [
    {
      id: 'compound_microscope',
      name: 'Binocular Compound Optical Laboratory Microscope',
      category: 'optical',
      description: 'Precision mechanical-optical microscope with 10x widefield eyepieces, quadruple nosepiece (4x, 10x, 40x objectives), mechanical stage with vernier calipers, Abbe condenser N.A. 1.25, and coaxial coarse/fine focus controls.',
      purpose: 'Magnifying and resolving cellular structures with up to 400x total magnification.',
      safetyNote: 'Always lower the stage when swapping high-power objectives to prevent lens-slide collision.'
    },
    {
      id: 'glass_slide_coverslip',
      name: 'Optically Flat Glass Slides (75×25 mm) & No. 1 Cover Slips',
      category: 'glassware',
      description: 'Clean pre-washed glass slides with 0.17 mm thick borosilicate glass cover slips.',
      purpose: 'Mounting biological specimens flat in a single focal plane.'
    },
    {
      id: 'staining_reagents',
      name: 'Safranin & Methylene Blue Stain Dropper Bottles',
      category: 'chemical',
      description: '0.5% aqueous Safranin and 1% aqueous Methylene Blue with pure glycerine mounting medium.',
      purpose: 'Differential staining of cell walls and nuclear chromatin.'
    },
    {
      id: 'dissection_tools',
      name: 'Fine Forceps, Teasing Needle, and Filter Paper Strips',
      category: 'instrument',
      description: 'Stainless steel micro-forceps and angled mounting needles.',
      purpose: 'Peeling delicate epidermal layers and lowering cover slip without air bubbles.'
    }
  ],
  procedureSteps: [
    {
      stepNumber: 1,
      title: 'Peeling & Hydrating Onion Epidermis',
      actionPrompt: 'Snap a fleshy scale leaf of onion inward, gently strip the transparent epidermal peel from inner concave surface using fine forceps, and place in a watch glass of water.',
      apparatusUsed: ['Onion Scale', 'Fine Forceps', 'Watch Glass with Water'],
      scientificReason: 'Single-layer epidermal tissue prevents cell overlapping, allowing transmitted light to penetrate and reveal clear organelle boundaries.',
      expectedObservation: 'A paper-thin, wrinkle-free transparent membrane floating in water.',
      precautions: 'Do not allow the peel to dry out; dehydration causes cellular collapse and plasmolysis.',
      commonMistakes: 'Taking a thick fleshy chunk containing multiple cell layers.'
    },
    {
      stepNumber: 2,
      title: 'Staining with Safranin (2 Minutes)',
      actionPrompt: 'Transfer peel into a watch glass containing dilute Safranin stain for 2 minutes, then rinse off excess stain in distilled water.',
      apparatusUsed: ['Watch Glass', 'Safranin Solution', 'Distilled Water'],
      scientificReason: 'Safranin binds to acidic cellular components, particularly cellulose cell walls and nuclear chromatin.',
      expectedObservation: 'The translucent peel turns an even, delicate pinkish-red.',
      precautions: 'Avoid prolonged over-staining which renders whole cells completely dark and opaque.',
      commonMistakes: 'Failing to rinse excess stain, causing precipitate crystals on the slide.'
    },
    {
      stepNumber: 3,
      title: 'Mounting in Glycerine & Placing Cover Slip',
      actionPrompt: 'Place stained peel in center of clean slide, add one drop of pure glycerine, and gently lower cover slip with needle at 45° angle.',
      apparatusUsed: ['Glass Slide', 'Glycerine', 'Mounting Needle', 'Cover Slip'],
      scientificReason: 'Glycerine has a refractive index (n ≈ 1.47) close to glass (n ≈ 1.52), minimizing optical refraction, preventing specimen drying, and enhancing resolution.',
      expectedObservation: 'A flat mount without circular trapped air bubbles.',
      precautions: 'Lower the cover slip gradually so the glycerine meniscus advances uniformly, expelling air.',
      commonMistakes: 'Dropping the cover slip flat from above, creating countless dark-ringed air bubbles.'
    },
    {
      stepNumber: 4,
      title: 'Microscope Alignment & Low Power Inspection (100x)',
      actionPrompt: 'Clip slide onto mechanical stage. Select 10x objective. Turn coaxial coarse focus until cell boundaries appear sharp.',
      apparatusUsed: ['Compound Microscope', 'Mechanical Stage Controls', 'Coarse Adjustment Knob'],
      scientificReason: '100x total magnification provides a wide field of view (approx. 1800 µm) to survey the overall tissue organization.',
      expectedObservation: 'Regular, brick-like rectangular cells arranged in compact contiguous rows with prominent cell walls and peripheral dark dots (nuclei).',
      precautions: 'Always focus by racking the objective upward away from the slide, never downward into the glass.',
      commonMistakes: 'Focusing on dust particles on the top surface of the cover slip.'
    },
    {
      stepNumber: 5,
      title: 'High Power Examination (400x) & Comparative Cheek Cell Mount',
      actionPrompt: 'Rotate nosepiece to 40x objective lens. Adjust fine focus only. Inspect human buccal cheek cell smear side-by-side.',
      apparatusUsed: ['40x Objective Lens', 'Fine Focus Knob', 'Cheek Cell Slide'],
      scientificReason: 'High resolution reveals fine cytological distinctions: rigid cell walls and large central vacuoles in plant cells versus thin membranes and centrally placed nuclei in animal cheek cells.',
      expectedObservation: 'Plant cells show double-bordered walls and pushed-aside nuclei; animal cells appear irregular, isolated, or loosely clustered polygons without walls.',
      precautions: 'Use fine adjustment knob exclusively at high power; coarse adjustment can crush the cover slip.',
      commonMistakes: 'Attempting to find cheek cells at high power without first centering them under low power.'
    }
  ],
  formulas: [
    {
      name: 'Total Optical Magnification',
      equation: 'M_{\\text{total}} = M_{\\text{ocular}} \\times M_{\\text{objective}}',
      explanation: 'Compound magnification product of the eyepiece lens and objective lens system.',
      conditions: 'Standard microscope optical tube length (typically 160 mm DIN standard).',
      symbols: [
        { symbol: 'M_{total}', definition: 'Total overall magnification power', unit: 'Dimensionless (×)' },
        { symbol: 'M_{ocular}', definition: 'Eyepiece magnification (typically 10×)', unit: '×' },
        { symbol: 'M_{objective}', definition: 'Objective lens magnification (4×, 10×, 40×, 100×)', unit: '×' }
      ],
      workedExample: {
        inputs: '10× widefield eyepiece and 40× high-dry objective.',
        steps: [
          'Identify formula: M_total = M_ocular × M_objective',
          'Calculate: 10 × 40 = 400'
        ],
        result: 'Total Magnification = 400×'
      }
    },
    {
      name: 'Field of View (FOV) & Specimen Sizing',
      equation: '\\text{FOV Diameter} = \\frac{\\text{Field Number (FN)}}{\\text{Objective Magnification}}',
      explanation: 'Calculates the real physical diameter of the circular illuminated field seen through the microscope.',
      conditions: 'Using standard FN 18 mm eyepiece.',
      symbols: [
        { symbol: 'FOV', definition: 'Field of view diameter on the slide plane', unit: 'mm or micrometers (μm)' },
        { symbol: 'FN', definition: 'Eyepiece field number marked on ocular rim (e.g. 18 mm)', unit: 'mm' }
      ],
      workedExample: {
        inputs: 'FN = 18 mm, using 40× objective lens.',
        steps: [
          'FOV diameter in mm = 18 / 40 = 0.45 mm',
          'Convert to micrometers: 0.45 mm × 1000 = 450 μm',
          'If 3 onion cells fit end-to-end across the field diameter: Length = 450 μm / 3 = 150 μm'
        ],
        result: 'Average Cell Length = 150 μm (0.15 mm)'
      }
    }
  ],
  observationColumns: [
    { key: 'feature', label: 'Cellular Characteristic', type: 'text', readOnly: true },
    { key: 'onionPeel', label: 'Onion Epidermal Peel (Plant Cell)', type: 'text' },
    { key: 'cheekCell', label: 'Human Buccal Cheek Cell (Animal Cell)', type: 'text' },
    { key: 'biologicalSignificance', label: 'Biological Significance', type: 'text' }
  ],
  defaultObservations: [
    { id: 'bio_obs_1', feature: 'Cell Shape & Boundary', onionPeel: 'Rigid, rectangular, compact tile-like arrangement', cheekCell: 'Irregular, rounded polygonal, thin flexible boundary', biologicalSignificance: 'Cellulose cell wall provides turgor pressure and structural support in plants' },
    { id: 'bio_obs_2', feature: 'Cell Wall', onionPeel: 'Present, thick, double-layered, distinct', cheekCell: 'Absent; bounded only by thin plasma membrane', biologicalSignificance: 'Plants require rigid cell walls; animal cells need flexibility for movement' },
    { id: 'bio_obs_3', feature: 'Position of Nucleus', onionPeel: 'Peripheral (pushed toward edge of cell)', cheekCell: 'Centrally located', biologicalSignificance: 'Large central vacuole in mature plant cells pushes cytoplasm and nucleus to periphery' },
    { id: 'bio_obs_4', feature: 'Vacuole Characteristic', onionPeel: 'Large, prominent central sap vacuole', cheekCell: 'Vacuoles absent or extremely small/temporary', biologicalSignificance: 'Plant vacuole stores cell sap, amino acids, and maintains hydrostatic turgidity' },
    { id: 'bio_obs_5', feature: 'Intercellular Spaces', onionPeel: 'Absent (tightly fitted without gaps)', cheekCell: 'Present; loose cells detached from epithelial tissue', biologicalSignificance: 'Epidermis acts as continuous protective barrier against pathogens and water loss' }
  ],
  quizQuestions: [
    {
      id: 'q_bio_1',
      question: 'Why is Safranin preferred over Methylene Blue when staining onion epidermal peel cells?',
      options: [
        'Safranin selectively stains cellulose cell walls and nuclei bright pinkish-red, providing sharp contrast against clear cytoplasm.',
        'Safranin dissolves the cell membrane to make cells permeable to light.',
        'Methylene Blue destroys plant enzymes instantly.',
        'Safranin acts as a permanent mounting adhesive.'
      ],
      correctAnswer: 0,
      explanation: 'Safranin is a basic dye that preferentially binds to polyanionic lignified and cellulose components of plant cell walls and nucleic acids in the nucleus, producing strong visual differentiation in plant tissues.',
      distractorExplanations: [
        'Correct: Safranin provides maximum optical contrast for plant cell walls and nuclei.',
        'Stains do not dissolve cell membranes; fixation is not membrane dissolution.',
        'Methylene blue does not destroy plant tissue, but its blue color provides poorer contrast on plant walls.',
        'Glycerine or Canada balsam acts as mounting medium, not the stain.'
      ],
      topicTag: 'Cytological Staining',
      difficulty: 'medium',
      hint: 'Think about which cellular structure is unique to plants and highlighted in red.',
      examTarget: ['cbse', 'neet']
    },
    {
      id: 'q_bio_2',
      question: 'A student observes an onion epidermal cell under a 10× eyepiece and a 40× objective lens. What is the total optical magnification of the specimen?',
      options: [
        '50×',
        '400×',
        '300×',
        '4000×'
      ],
      correctAnswer: 1,
      explanation: 'Total compound magnification is the product of the ocular power and objective power: M = 10 × 40 = 400×.',
      distractorExplanations: [
        '50× is the simple sum (10 + 40), but lenses magnify multiplicatively, not additively.',
        'Correct: 10 × 40 = 400×.',
        '300× is incorrect arithmetic.',
        '4000× would require an oil-immersion objective and additional intermediate optics.'
      ],
      topicTag: 'Optical Magnification',
      difficulty: 'easy',
      hint: 'Multiply the ocular power by the objective lens power.',
      examTarget: ['cbse', 'neet', 'cuet']
    },
    {
      id: 'q_bio_3',
      question: 'Why is the nucleus located in the peripheral region in onion peel cells, while it is centrally located in human cheek cells?',
      options: [
        'Plant cells lack cytoskeleton proteins to center the nucleus.',
        'Mature plant cells develop a large central sap vacuole that occupies 90% of cell volume, displacing the nucleus.',
        'Plant cells reproduce by peripheral budding.',
        'The cell wall pushes the nucleus outward via gravitational settling.'
      ],
      correctAnswer: 1,
      explanation: 'In mature plant cells, the central tonoplast-bound vacuole accumulates water, mineral ions, and organic metabolites, expanding until it occupies 80–90% of intracellular volume. This forces the cytoplasm and nucleus into a thin peripheral parietal layer.',
      distractorExplanations: [
        'Plant cells have an extensive, well-organized actin and tubulin cytoskeleton.',
        'Correct: The massive central vacuole physically displaces organelles to the cell periphery.',
        'Onions reproduce via mitosis and mitotic division, not peripheral budding.',
        'The peripheral position is maintained by cytoplasmic strands and turgor, not gravity.'
      ],
      topicTag: 'Plant Cell Anatomy',
      difficulty: 'medium',
      hint: 'What massive organelle occupies almost the entire center of a mature plant cell?',
      examTarget: ['cbse', 'neet']
    },
    {
      id: 'q_bio_4',
      question: 'While preparing a temporary mount, why is pure glycerine added before placing the cover slip?',
      options: [
        'To chemically fix and freeze cell division in metaphase.',
        'To prevent the specimen from drying out and match the refractive index of glass to prevent light scattering.',
        'To dissolve air bubbles trapped inside the cover slip.',
        'To neutralize acidic toxic safranin vapors.'
      ],
      correctAnswer: 1,
      explanation: 'Glycerine is a hygroscopic mounting fluid that resists evaporation under the warm illumination of the microscope. Its refractive index (n ≈ 1.47) closely matches cover glass (n ≈ 1.52), minimizing internal reflection and glare.',
      distractorExplanations: [
        'Chemical fixation requires formal-acetic alcohol (FAA) or glutaraldehyde, not glycerine.',
        'Correct: Glycerine prevents dehydration and matches the refractive index of glass.',
        'Glycerine does not dissolve air bubbles; bubbles must be avoided mechanically by needle placement.',
        'Safranin is non-volatile and safe in dilute aqueous form.'
      ],
      topicTag: 'Mounting Techniques',
      difficulty: 'medium',
      hint: 'Consider what would happen to a living cell thin layer exposed to open air under a hot microscope bulb.',
      examTarget: ['cbse', 'neet']
    },
    {
      id: 'q_bio_5',
      question: 'A microscope field of view under a 10× objective has a diameter of 1800 μm. If 12 onion peel cells lie linearly along the diameter, what is the estimated length of one onion cell?',
      options: [
        '150 μm',
        '216 μm',
        '18 μm',
        '120 μm'
      ],
      correctAnswer: 0,
      explanation: 'Average cell length = Total FOV Diameter / Number of cells spanning diameter = 1800 μm / 12 = 150 μm (0.15 mm).',
      distractorExplanations: [
        'Correct: 1800 / 12 = 150 μm.',
        '216 is incorrect (1800 / 12 is exactly 150).',
        '18 μm is too small by a factor of 10.',
        '120 μm would result from 15 cells.'
      ],
      topicTag: 'Micrometry & Cell Dimensions',
      difficulty: 'hard',
      hint: 'Divide the total field diameter by the number of aligned cells.',
      examTarget: ['neet', 'cbse']
    }
  ],
  vivaQuestions: [
    {
      question: 'What is the purpose of the iris diaphragm on the microscope condenser?',
      answer: 'The iris diaphragm regulates the angular aperture and diameter of the illuminating light cone entering the objective lens. Closing it increases image contrast and depth of focus, while opening it provides maximum resolving power (resolution) and numerical aperture.',
      examRelevance: 'NCERT Biology Practical Examination Viva'
    },
    {
      question: 'How do you differentiate an air bubble from a biological cell under the microscope?',
      answer: 'An air bubble is perfectly circular with a thick, heavy, dark-black refraction rim and a completely bright empty center. Changing focus causes the dark border to expand or contract sharply. A cell has irregular or rectangular organic walls, cellular contents, granules, and a distinct stained nucleus.',
      examRelevance: 'CBSE Class 9 Practical Practical Assessment'
    },
    {
      question: 'Why are cheek cells scraped very gently with a blunt sterile toothpick rather than a sharp blade?',
      answer: 'Cheek cells are easily shed from the stratified squamous epithelium lining the oral mucosa. Gentle scraping collects naturally desquamated surface cells without injuring delicate mucosal capillary beds or causing bleeding.',
      examRelevance: 'CBSE Safety and Protocol Question'
    }
  ],
  simulatedModelNotes: 'The 3D Biology Microscope simulation renders realistic coaxial mechanics, revolving objective turret detents, dynamic Gaussian defocus blur matching the optical depth of field, real slide specimens with authentic cellular micrographs, and click-to-identify organelle pins.'
};
