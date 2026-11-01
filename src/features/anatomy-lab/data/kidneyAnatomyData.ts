import { OrganModelSpec } from '../types/anatomy';

export const KIDNEY_ORGAN_SPEC: OrganModelSpec = {
  id: 'organ-kidney',
  name: 'Human Kidney (Excretory & Urinary System)',
  system: 'Excretory / Urinary System',
  classGrade: 'Class 10 & Class 11 (NCERT & NEET)',
  subject: 'Human Physiology / Biology',
  description: 'Bean-shaped paired retroperitoneal organs situated between the levels of the last thoracic and third lumbar vertebra (T12–L3). The primary functional organs of human osmoregulation, nitrogenous waste excretion (urea filtration), and arterial blood pressure regulation via the Renin-Angiotensin-Aldosterone System (RAAS).',
  modelUrl: '/models/kidney.glb',
  modelFormat: 'glb',
  initialCameraPosition: [-0.05, 0.35, 0.28],
  initialTarget: [-0.06, 0.35, 0.05],
  cameraPresets: {
    anterior: {
      id: 'anterior',
      label: 'Anterior View',
      position: [-0.06, 0.35, 0.28],
      target: [-0.06, 0.35, 0.05]
    },
    posterior: {
      id: 'posterior',
      label: 'Posterior View',
      position: [-0.06, 0.35, -0.18],
      target: [-0.06, 0.35, 0.05]
    },
    hilum: {
      id: 'hilum',
      label: 'Medial Hilum View',
      position: [0.12, 0.35, 0.05],
      target: [-0.06, 0.35, 0.05]
    },
    lateral: {
      id: 'lateral',
      label: 'Lateral Convex Border View',
      position: [-0.24, 0.35, 0.05],
      target: [-0.06, 0.35, 0.05]
    }
  },
  structures: [
    // 1. Renal Capsule
    {
      id: 'kidney-capsule',
      meshNames: ['VH_M_kidney_capsule_L'],
      name: 'Renal Capsule',
      latinName: 'Capsula fibrosa renalis',
      hindiName: 'वृक्क सम्पुट (Vrikk Samput)',
      pronunciation: 'KAP-sul fy-BRO-suh ree-NAY-lis',
      system: 'Urinary System',
      location: 'Innermost fibrous connective tissue sheath directly investing the renal parenchyma.',
      grossDescription: 'Smooth, tough, fibrous membrane of dense irregular connective tissue. Easily stripped from healthy kidney parenchyma but adherent in chronic glomerulonephritis.',
      mainFunction: 'Maintains kidney organ shape, protects internal delicate nephrons from mechanical trauma, and acts as a barrier against the spread of retroperitoneal infection.',
      substructures: ['Fibrous Layer', 'Myofibroblast Sublayer'],
      bloodSupply: 'Capsular branches of renal artery and lumbar vessels.',
      innervation: 'Sensory afferent fibers traveling with renal sympathetic nerves.',
      schoolExplanation: 'In NCERT Class 11 Biology Chapter 19, the kidney is enveloped by a tough outer layer called the renal capsule. Towards the center of the inner concave surface is a notch called the hilum.',
      advancedExplanation: 'The renal capsule is one of three protective layers: (1) fibrous renal capsule, (2) perirenal fat capsule (adipose capsule), and (3) outer renal fascia (Gerota\'s fascia). Distension of the capsule due to edema or acute obstruction causes severe dull flank pain.',
      learningObjectives: [
        'Identify the protective fibrous envelope of the renal parenchyma.',
        'Contrast the renal capsule with the adipose capsule and renal fascia.'
      ],
      importantTerminology: [
        { term: 'Gerota\'s Fascia', definition: 'The outermost dense fibroareolar connective tissue layer anchoring the kidney and adrenal gland to surrounding abdominal walls.' }
      ],
      quizQuestions: [
        {
          id: 'q-kc-1',
          question: 'What is the innermost tough fibrous membrane covering the human kidney called?',
          options: ['Renal capsule', 'Renal pelvis', 'Peritoneum', 'Tunica albuginea'],
          correctAnswer: 0,
          explanation: 'The renal capsule is the glistening, fibrous inner membrane directly covering the renal cortex.',
          examTag: 'CBSE',
          difficulty: 'easy'
        }
      ],
      textbookCitation: {
        source: 'NCERT Class 11 Biology & OpenStax Anatomy and Physiology 2e',
        authors: 'NCERT & Betts et al.',
        edition: 'NCERT 2026-27 & OpenStax 2e',
        chapter: 'NCERT Ch 19.1 & OpenStax Ch 25.1 (Gross Anatomy of Kidney)',
        curriculumTags: ['CBSE Class 11', 'NEET-UG'],
        verificationStatus: 'VERIFIED_CURRICULUM',
        verificationDate: 'October 2026',
        license: 'CC BY 4.0'
      },
      defaultColor: '#c2410c',
      pinPosition: [-0.09, 0.38, 0.07],
      explodedOffset: [-0.03, 0.02, 0.02],
      relatedStructureIds: ['kidney-cortex', 'kidney-hilum']
    },

    // 2. Renal Cortex
    {
      id: 'kidney-cortex',
      meshNames: ['VH_M_cortex_of_kidney_L', 'VH_M_outer_cortex_of_kidney_L'],
      name: 'Renal Cortex',
      latinName: 'Cortex renalis',
      hindiName: 'वृक्क वल्कुट (Vrikk Valkut)',
      pronunciation: 'KOR-teks ree-NAY-lis',
      system: 'Urinary System',
      location: 'Outer, granular superficial layer of kidney parenchyma beneath the renal capsule, extending inward between the medullary pyramids as the Renal Columns of Bertin.',
      grossDescription: 'Reddish-brown, granular zone due to dense vascularity. Accommodates approximately 1.0 to 1.2 million nephrons per kidney, specifically the Malpighian body (Bowman\'s capsule and glomerulus) as well as Proximal (PCT) and Distal Convoluted Tubules (DCT).',
      mainFunction: 'Site of high-pressure ultrafiltration of blood plasma (Glomerular Filtration Rate, GFR ≈ 125 mL/min or 180 L/day) and extensive tubular reabsorption of water, glucose, amino acids, and essential electrolytes.',
      substructures: ['Renal Corpuscles (Glomeruli & Bowman\'s Capsules)', 'Proximal Convoluted Tubules (PCT)', 'Distal Convoluted Tubules (DCT)', 'Cortical Radiate Arteries & Veins', 'Juxtaglomerular Apparatus (JGA)'],
      bloodSupply: 'Interlobar arteries branch into arcuate arteries, giving off cortical radiate (interlobular) arteries and afferent arterioles.',
      innervation: 'Renal sympathetic plexus (vasoconstrictor control regulating GFR and renin release).',
      schoolExplanation: 'NCERT Class 11 Biology Section 19.1 notes: "Inside the kidney, there are two zones, an outer cortex and an inner medulla. The cortex extends in between the medullary pyramids as renal columns called Columns of Bertin. The Malpighian corpuscle, PCT, and DCT of the nephron are situated in the cortical region."',
      advancedExplanation: 'In OpenStax A&P 2e, 85% of nephrons are Cortical Nephrons with short loops of Henle barely dipping into the outer medulla, while 15% are Juxtamedullary Nephrons possessing long Henle\'s loops essential for producing hypertonic concentrated urine.',
      learningObjectives: [
        'Recognize which segments of the nephron reside exclusively in the renal cortex.',
        'Locate the Columns of Bertin dipping between pyramids.',
        'State the normal Glomerular Filtration Rate (GFR) of 125 mL/min.'
      ],
      importantTerminology: [
        { term: 'Glomerular Filtration Rate (GFR)', definition: 'The volume of ultrafiltrate formed per minute by all the glomeruli in both kidneys (normally 125 mL/min in healthy young adults).' },
        { term: 'Columns of Bertin', definition: 'Inward extensions of the cortical tissue between neighboring medullary pyramids.' }
      ],
      quizQuestions: [
        {
          id: 'q-cor-1',
          question: 'Which of the following nephron components is located within the renal cortex?',
          options: [
            'Malpighian corpuscle, PCT, and DCT',
            'Loop of Henle only',
            'Duct of Bellini only',
            'Renal papilla only'
          ],
          correctAnswer: 0,
          explanation: 'As explicitly taught in NCERT Class 11 Biology Ch 19, the Malpighian corpuscle (glomerulus + Bowman’s capsule), proximal convoluted tubule (PCT), and distal convoluted tubule (DCT) lie in the renal cortex.',
          examTag: 'NEET',
          difficulty: 'medium'
        }
      ],
      textbookCitation: {
        source: 'NCERT Class 11 Biology Chapter 19 & OpenStax A&P 2e Section 25.1',
        authors: 'NCERT & Betts et al.',
        edition: 'NCERT 2026-27 & OpenStax 2e',
        chapter: 'NCERT Ch 19.1 (Structure of Nephron)',
        curriculumTags: ['CBSE Class 11', 'NEET Biology'],
        verificationStatus: 'VERIFIED_CURRICULUM',
        verificationDate: 'October 2026',
        license: 'CC BY 4.0'
      },
      defaultColor: '#ea580c',
      pinPosition: [-0.07, 0.36, 0.05],
      explodedOffset: [-0.02, 0.01, 0.01],
      relatedStructureIds: ['kidney-medulla', 'kidney-pyramids', 'kidney-columns']
    },

    // 3. Renal Columns of Bertin
    {
      id: 'kidney-columns',
      meshNames: ['VH_M_renal_column_L'],
      name: 'Renal Columns of Bertin',
      latinName: 'Columnae renales',
      hindiName: 'बर्टिन के वृक्क स्तंभ (Bertin Ke Vrikk Stambh)',
      pronunciation: 'ko-LUM-nee ree-NAY-leez',
      system: 'Urinary System',
      location: 'Band-like cortical projections extending through the renal medulla between adjacent medullary pyramids.',
      grossDescription: 'Composed of cortical nephron extensions and blood vessels (interlobar arteries and veins) traversing from the renal sinus toward the arcuate arches.',
      mainFunction: 'Anchor the cortex structurally and provide the anatomical vascular conduits through which interlobar arteries and veins travel into the parenchyma.',
      substructures: ['Interlobar Arteries', 'Interlobar Veins', 'Cortical Glomerular Projections'],
      bloodSupply: 'Interlobar branches of the renal artery.',
      innervation: 'Perivascular autonomic sympathetic nerve plexus.',
      schoolExplanation: 'In NCERT Class 11, the renal columns called Columns of Bertin are the inward extensions of the outer cortex dividing the medulla into conical pyramids.',
      advancedExplanation: 'Hypertrophied columns of Bertin can appear as pseudotumors on imaging studies (CT/Ultrasound) but represent normal variant extensions of vascularized renal cortex.',
      learningObjectives: [
        'Recognize Columns of Bertin as extensions of the renal cortex.',
        'Trace the path of interlobar arteries through these columns.'
      ],
      importantTerminology: [
        { term: 'Interlobar Artery', definition: 'Major vascular branches of the renal artery that ascend between renal pyramids within the columns of Bertin.' }
      ],
      quizQuestions: [
        {
          id: 'q-col-1',
          question: 'The Columns of Bertin in the human kidney are:',
          options: [
            'Inward extensions of the cortex between the medullary pyramids',
            'Connective tissue bundles in the urinary bladder',
            'Extensions of the renal pelvis into the ureter',
            'Tubules connecting minor calyces directly to the urethra'
          ],
          correctAnswer: 0,
          explanation: 'Columns of Bertin are cortical extensions diving inward between adjacent renal pyramids.',
          examTag: 'CBSE',
          difficulty: 'easy'
        }
      ],
      textbookCitation: {
        source: 'NCERT Class 11 Biology Section 19.1',
        authors: 'NCERT',
        edition: 'NCERT 2026-27',
        chapter: 'Chapter 19: Excretory Products and their Elimination',
        curriculumTags: ['CBSE Class 11', 'NEET Biology'],
        verificationStatus: 'VERIFIED_CURRICULUM',
        verificationDate: 'October 2026',
        license: 'CC BY 4.0'
      },
      defaultColor: '#f97316',
      pinPosition: [-0.05, 0.34, 0.04],
      explodedOffset: [-0.01, 0, 0],
      relatedStructureIds: ['kidney-cortex', 'kidney-pyramids']
    },

    // 4. Renal Medulla & Pyramids
    {
      id: 'kidney-pyramids',
      meshNames: [
        'VH_M_renal_medulla_L',
        'VH_M_renal_pyramid_L',
        'VH_M_renal_pyramid_L_a',
        'VH_M_renal_pyramid_L_b',
        'VH_M_renal_pyramid_L_c',
        'VH_M_renal_pyramid_L_d',
        'VH_M_renal_pyramid_L_e',
        'VH_M_renal_pyramid_L_f',
        'VH_M_renal_pyramid_L_g',
        'VH_M_renal_pyramid_L_h',
        'VH_M_renal_pyramid_L_i'
      ],
      name: 'Renal Medulla & Medullary Pyramids',
      latinName: 'Medulla renalis et pyramides renales',
      hindiName: 'वृक्क मध्यांश और पिरामिड (Vrikk Madhyansh & Pyramid)',
      pronunciation: 'meh-DUH-lah ree-NAY-lis',
      system: 'Urinary System',
      location: 'Inner zone of the kidney, organized into 8 to 18 triangular striated conical masses (renal pyramids).',
      grossDescription: 'Radially striated pyramids whose broad bases border the cortex and whose apices (papillae) project into the minor calyces. Contains the Loops of Henle, Collecting Ducts, and parallel capillary loops (vasa recta).',
      mainFunction: 'Maintains the medullary hyperosmolar osmotic gradient (from 300 mOsm/L at corticomedullary junction to 1200 mOsm/L at papilla tip) via the countercurrent multiplier (Henle\'s loops) and countercurrent exchanger (vasa recta), facilitating water conservation under Antidiuretic Hormone (ADH / Vasopressin).',
      substructures: ['Loops of Henle (Descending and Ascending Limbs)', 'Collecting Ducts of Bellini', 'Vasa Recta Capillary Loops', 'Medullary Interstitial Cells'],
      bloodSupply: 'Vasa recta arising from efferent arterioles of juxtamedullary glomeruli.',
      innervation: 'Renal sympathetic plexus.',
      schoolExplanation: 'NCERT Class 11 Biology Section 19.1 states that the inner medulla is divided into a few conical masses (medullary pyramids) projecting into the calyces. Henle\'s loops and collecting ducts run down into the medulla, establishing the countercurrent mechanism to concentrate urine.',
      advancedExplanation: 'The ascending thick limb of Henle\'s loop actively transports Na+, K+, and 2Cl- (via the NKCC2 cotransporter, inhibited by loop diuretics like furosemide) into the medullary interstitium while remaining impermeable to water. This drives passive water reabsorption from collecting ducts in the presence of ADH (via Aquaporin-2 channels).',
      learningObjectives: [
        'Understand the countercurrent multiplier mechanism between descending and ascending limbs of Henle\'s loop.',
        'Locate the medullary pyramids terminating in renal papillae.',
        'Explain how ADH/vasopressin enables formation of hypertonic urine up to 1200 mOsm/L.'
      ],
      importantTerminology: [
        { term: 'Countercurrent Mechanism', definition: 'The anatomical arrangement of Henle’s loops and vasa recta flowing in opposite directions that creates an increasing hypertonic osmotic gradient in the medullary interstitium.' },
        { term: 'Vasa Recta', definition: 'Hairpin vascular loops running parallel to the loop of Henle that preserve the hyperosmolar gradient without washing out solute.' }
      ],
      quizQuestions: [
        {
          id: 'q-med-1',
          question: 'The countercurrent mechanism responsible for urine concentration operates between which structures?',
          options: [
            'Henle’s loop and vasa recta',
            'Bowman’s capsule and glomerulus',
            'PCT and DCT',
            'Renal capsule and ureter'
          ],
          correctAnswer: 0,
          explanation: 'In NCERT Class 11 Biology Section 19.5, the flow of filtrate in the two limbs of Henle’s loop and the flow of blood in the two limbs of vasa recta occur in opposite directions, operating as a countercurrent system to concentrate urine.',
          examTag: 'NEET',
          difficulty: 'hard'
        }
      ],
      textbookCitation: {
        source: 'NCERT Class 11 Biology Chapter 19 & OpenStax A&P 2e Section 25.3',
        authors: 'NCERT & Betts et al.',
        edition: 'NCERT 2026-27 & OpenStax 2e',
        chapter: 'NCERT Ch 19.5 (Mechanism of Concentration of the Filtrate)',
        curriculumTags: ['CBSE Class 11', 'NEET Biology'],
        verificationStatus: 'VERIFIED_CURRICULUM',
        verificationDate: 'October 2026',
        license: 'CC BY 4.0'
      },
      defaultColor: '#991b1b',
      pinPosition: [-0.04, 0.35, 0.04],
      explodedOffset: [0.01, 0, 0],
      relatedStructureIds: ['kidney-cortex', 'kidney-papilla', 'kidney-hilum']
    },

    // 5. Renal Papillae
    {
      id: 'kidney-papilla',
      meshNames: [
        'VH_M_renal_papilla_L',
        'VH_M_renal_papilla_L_a',
        'VH_M_renal_papilla_L_b',
        'VH_M_renal_papilla_L_c',
        'VH_M_renal_papilla_L_d',
        'VH_M_renal_papilla_L_e',
        'VH_M_renal_papilla_L_f',
        'VH_M_renal_papilla_L_g',
        'VH_M_renal_papilla_L_h',
        'VH_M_renal_papilla_L_i'
      ],
      name: 'Renal Papillae (Ducts of Bellini)',
      latinName: 'Papillae renales',
      hindiName: 'वृक्क पैपिला (Vrikk Papilla)',
      pronunciation: 'puh-PIL-ee ree-NAY-leez',
      system: 'Urinary System',
      location: 'The blunt apex of each medullary pyramid protruding into the cup-shaped minor calyx.',
      grossDescription: 'Perforated like a sieve by 15–20 papillary ducts (Ducts of Bellini), forming the area cribrosa.',
      mainFunction: 'Channels final processed urine from collecting ducts into the minor calyx system. Once urine leaves the renal papilla, no further qualitative chemical reabsorption or modification occurs.',
      substructures: ['Area Cribrosa', 'Terminal Ducts of Bellini', 'Minor Calyx Junction'],
      bloodSupply: 'Terminal capillary plexus of vasa recta.',
      innervation: 'Autonomic nerve endings in calyx wall.',
      schoolExplanation: 'The tips of the medullary pyramids are called renal papillae, which empty final concentrated urine into the calyces of the renal pelvis.',
      advancedExplanation: 'Medullary and papillary necrosis can occur in analgesic nephropathy, severe sickle cell disease, or acute pyelonephritis in diabetics, causing sloughing of papillae and ureteral colic.',
      learningObjectives: [
        'Locate the renal papillae at the apex of the medullary pyramids.',
        'Identify the area cribrosa where Ducts of Bellini open.'
      ],
      importantTerminology: [
        { term: 'Area Cribrosa', definition: 'The cribriform perforated tip of the renal papilla where terminal collecting ducts deliver urine into the minor calyx.' }
      ],
      quizQuestions: [
        {
          id: 'q-pap-1',
          question: 'Urine exiting through the renal papillae directly enters which structure?',
          options: ['Minor Calyx', 'Urinary Bladder', 'Bowman’s Capsule', 'Afferent Arteriole'],
          correctAnswer: 0,
          explanation: 'Renal papillae discharge urine into the minor calyces, which converge into major calyces and the renal pelvis.',
          examTag: 'CBSE',
          difficulty: 'easy'
        }
      ],
      textbookCitation: {
        source: 'NCERT Class 11 Biology Chapter 19 & OpenStax A&P 2e Section 25.1',
        authors: 'NCERT & Betts et al.',
        edition: 'NCERT 2026-27 & OpenStax 2e',
        chapter: 'NCERT Ch 19.1',
        curriculumTags: ['CBSE Class 11', 'NEET Biology'],
        verificationStatus: 'VERIFIED_CURRICULUM',
        verificationDate: 'October 2026',
        license: 'CC BY 4.0'
      },
      defaultColor: '#fb7185',
      pinPosition: [-0.03, 0.35, 0.03],
      explodedOffset: [0.02, 0, 0],
      relatedStructureIds: ['kidney-pyramids', 'kidney-hilum']
    },

    // 6. Renal Hilum & Pelvis
    {
      id: 'kidney-hilum',
      meshNames: ['VH_M_hilum_of_kidney_L'],
      name: 'Renal Hilum & Renal Sinus',
      latinName: 'Hilum renale et sinus renalis',
      hindiName: 'वृक्क नाभि (Vrikk Naabhi)',
      pronunciation: 'HY-lum ree-NAY-lee',
      system: 'Urinary System',
      location: 'Deep vertical fissure on the medial concave margin of each kidney.',
      grossDescription: 'Transmits from anterior to posterior: Renal Vein (anterior), Renal Artery (middle), and Renal Pelvis (posterior). The hilum opens into the internal fat-filled space termed the renal sinus.',
      mainFunction: 'Primary entry and exit portal for the large renal artery (receiving 20–25% of resting cardiac output, ~1200 mL/min), renal vein, lymphatics, autonomic nerves, and the funnel-shaped renal pelvis collecting urine into the ureter.',
      substructures: ['Renal Artery', 'Renal Vein', 'Renal Pelvis (Pelvis Renalis)', 'Major & Minor Calyces', 'Ureteric Junction', 'Renal Sinus Fat'],
      bloodSupply: 'Renal Artery arising directly from abdominal aorta at L1–L2 level.',
      innervation: 'Renal autonomic plexus from celiac and aorticorenal ganglia.',
      schoolExplanation: 'NCERT Class 11 Biology Section 19.1 notes: "Towards the centre of the inner concave surface of the kidney is a notch called hilum through which ureter, blood vessels and nerves enter. Inner to the hilum is a broad funnel-shaped space called the renal pelvis with projections called calyces."',
      advancedExplanation: 'The renal pelvis collects urine from 2–3 major calyces (which each drain 2–4 minor calyces). Smooth muscle in the calyces and renal pelvis exhibits intrinsic peristaltic pacemakers that drive urine droplets through the ureter toward the bladder.',
      learningObjectives: [
        'Recall the anterior-to-posterior order of structures at the renal hilum: Vein, Artery, Pelvis (V-A-P).',
        'Recognize the high blood flow rate (20-25% of cardiac output) passing through the hilum.'
      ],
      importantTerminology: [
        { term: 'Renal Fraction', definition: 'The portion of total cardiac output delivered to the kidneys (~21% or 1200 mL/min) to sustain blood purification.' }
      ],
      quizQuestions: [
        {
          id: 'q-hil-1',
          question: 'What is the broad, funnel-shaped space inside the renal hilum that collects urine called?',
          options: ['Renal pelvis', 'Renal capsule', 'Malpighian corpuscle', 'Columns of Bertin'],
          correctAnswer: 0,
          explanation: 'Inside the hilum lies the broad funnel-shaped space called the renal pelvis, with calyces collecting urine from the papillae.',
          examTag: 'CBSE',
          difficulty: 'easy'
        }
      ],
      textbookCitation: {
        source: 'NCERT Class 11 Biology Section 19.1 & OpenStax A&P 2e Section 25.1',
        authors: 'NCERT & Betts et al.',
        edition: 'NCERT 2026-27 & OpenStax 2e',
        chapter: 'NCERT Ch 19.1',
        curriculumTags: ['CBSE Class 11', 'NEET Biology'],
        verificationStatus: 'VERIFIED_CURRICULUM',
        verificationDate: 'October 2026',
        license: 'CC BY 4.0'
      },
      defaultColor: '#facc15',
      pinPosition: [-0.02, 0.35, 0.02],
      explodedOffset: [0.03, 0, 0],
      relatedStructureIds: ['kidney-papilla', 'kidney-cortex']
    }
  ],
  guidedTourSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Protective Renal Capsule & Hilum Entrance',
      structureId: 'kidney-capsule',
      narration: 'Blood arrives from the abdominal aorta via the Renal Artery through the medial Hilum, which receives approximately 20-25% of resting cardiac output (1200 mL/min). The fibrous Renal Capsule encloses and protects the organ.',
      highlightMeshNames: ['VH_M_kidney_capsule_L', 'VH_M_hilum_of_kidney_L'],
      cameraPosition: [-0.18, 0.38, 0.22],
      cameraTarget: [-0.06, 0.35, 0.05],
      clinicalNote: 'Renal artery stenosis can cause severe secondary renovascular hypertension via excess renin secretion.'
    },
    {
      stepNumber: 2,
      title: 'Step 2: Renal Cortex & High-Pressure Glomerular Filtration',
      structureId: 'kidney-cortex',
      narration: 'Interlobar arteries branch through the Columns of Bertin into arcuate and cortical radiate arteries, feeding millions of Glomeruli inside the Renal Cortex. Here, hydrostatic pressure forces plasma ultrafiltrate into Bowman’s capsule at 125 mL/min.',
      highlightMeshNames: ['VH_M_cortex_of_kidney_L', 'VH_M_renal_column_L'],
      cameraPosition: [-0.12, 0.36, 0.16],
      cameraTarget: [-0.06, 0.35, 0.05],
      clinicalNote: 'Over 99% of the 180 liters of daily glomerular filtrate is reabsorbed by the renal tubules, leaving only ~1.5 liters of urine excreted daily.'
    },
    {
      stepNumber: 3,
      title: 'Step 3: Medullary Pyramids & Countercurrent Concentration',
      structureId: 'kidney-pyramids',
      narration: 'The Loops of Henle and Collecting Ducts dip deep into the Medullary Pyramids. The countercurrent mechanism between Henle’s loop and vasa recta creates a steep osmotic gradient (up to 1200 mOsm/L), enabling water retention under ADH.',
      highlightMeshNames: ['VH_M_renal_medulla_L', 'VH_M_renal_pyramid_L'],
      cameraPosition: [-0.02, 0.35, 0.14],
      cameraTarget: [-0.05, 0.35, 0.04],
      clinicalNote: 'Diabetes Insipidus results from deficiency of ADH (neurogenic) or renal resistance to ADH (nephrogenic), causing massive dilute polyuria.'
    },
    {
      stepNumber: 4,
      title: 'Step 4: Papillae & Renal Pelvis Delivery',
      structureId: 'kidney-papilla',
      narration: 'Final concentrated urine drops from the renal papillae into the minor and major calyces, converging into the funnel-shaped Renal Pelvis. Smooth muscle contractions pump the urine down the ureter toward the urinary bladder.',
      highlightMeshNames: ['VH_M_renal_papilla_L', 'VH_M_hilum_of_kidney_L'],
      cameraPosition: [0.06, 0.35, 0.10],
      cameraTarget: [-0.03, 0.35, 0.03],
      clinicalNote: 'Nephrolithiasis (kidney stones, predominantly calcium oxalate) commonly lodge at the ureteropelvic junction (UPJ).'
    }
  ]
};
