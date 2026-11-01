import { OrganModelSpec } from '../types/anatomy';

export const LIVER_ORGAN_SPEC: OrganModelSpec = {
  id: 'organ-liver',
  name: 'Human Liver & Biliary Apparatus (Hepatic Lobules & Gallbladder)',
  system: 'Gastrointestinal / Hepato-Biliary System',
  classGrade: 'Class 10 & Class 11 (NCERT & NEET)',
  subject: 'Human Physiology / Biology',
  description: 'The liver is the largest internal gland and metabolic powerhouse of the human body, weighing approximately 1.2 to 1.5 kg in an adult. Situated in the right upper quadrant of the abdominal cavity immediately below the diaphragm.',
  modelUrl: '/models/liver.glb',
  modelFormat: 'procedural',
  initialCameraPosition: [0.0, 0.46, 0.38],
  initialTarget: [0.0, 0.42, 0.0],
  cameraPresets: {
    anterior: {
      id: 'anterior',
      label: 'Anterior (Diaphragmatic) Surface',
      position: [0.0, 0.42, 0.36],
      target: [0.0, 0.42, 0.0],
    },
    visceralInferior: {
      id: 'visceralInferior',
      label: 'Visceral (Inferior & Gallbladder) View',
      position: [0.0, 0.24, 0.32],
      target: [0.0, 0.42, 0.0],
    },
    rightLobe: {
      id: 'rightLobe',
      label: 'Right Massive Lobe',
      position: [-0.3, 0.42, 0.15],
      target: [0.0, 0.42, 0.0],
    },
    portaHepatis: {
      id: 'portaHepatis',
      label: 'Porta Hepatis & Biliary Triad',
      position: [0.1, 0.32, 0.28],
      target: [0.02, 0.38, 0.0],
    },
  },
  structures: [
    {
      id: 'liver-right-lobe',
      meshNames: ['liver_right_lobe_mesh'],
      name: 'Right Hepatic Lobe & Falciform Ligament',
      latinName: 'Lobus hepatis dexter',
      hindiName: 'यकृत का दायाँ पिण्ड (Daayan Pind)',
      pronunciation: 'LOH-bus heh-PAH-tis DEKS-ter',
      system: 'Hepato-Biliary System',
      location: 'Occupies the entire right hypochondrium and epigastrium.',
      grossDescription: 'Makes up roughly five-sixths of the total liver mass. Separated from the left lobe on the diaphragmatic surface by the sickle-shaped falciform ligament, which contains the ligamentum teres hepatis (obliterated umbilical vein).',
      mainFunction: 'Houses millions of hexagonal hepatic lobules (the structural and functional units of the liver) consisting of hepatocytes arranged in radiating cords around a central vein. Synthesizes bile salts, plasma proteins (albumin, fibrinogen, prothrombin), and detoxifies xenobiotics.',
      substructures: ['Hepatic Lobules', 'Glisson\'s Capsule', 'Kupffer Cells (Macrophages)', 'Central Vein', 'Sinusoids'],
      bloodSupply: 'Dual supply: 75% via Hepatic Portal Vein (nutrient-rich, partially deoxygenated from gut); 25% via Hepatic Artery Proper (oxygenated from celiac trunk).',
      innervation: 'Hepatic plexus from celiac plexus (sympathetic) and vagus nerve (parasympathetic).',
      schoolExplanation: 'The right lobe is the large side of the liver. It makes bile juice, which breaks down dietary fats into small droplets (emulsification) so lipase enzymes can digest them.',
      advancedExplanation: 'Hepatic lobules are enveloped in Glisson\'s capsule. Kupffer cells in the sinusoids phagocytose worn-out erythrocytes and intestinal bacteria. The liver also executes gluconeogenesis, glycogenolysis, and the Ornithine (urea) cycle.',
      learningObjectives: [
        'Identify Glisson\'s capsule as the characteristic mammalian liver connective tissue.',
        'Trace the path of blood through hepatic sinusoids to the central vein.',
        'Understand fat emulsification by bile pigments (bilirubin/biliverdin) and bile salts (sodium glycocholate/taurocholate).'
      ],
      importantTerminology: [
        { term: 'Glisson\'s Capsule', definition: 'A thin sheath of connective tissue covering each hepatic lobule, characteristic of mammalian liver.' },
        { term: 'Kupffer Cells', definition: 'Resident hepatic macrophages situated in sinusoidal linings that destroy damaged RBCs and pathogens.' }
      ],
      quizQuestions: [
        {
          id: 'q-liver-lobe-1',
          question: 'The structural and functional units of the liver are hepatic lobules covered by a thin connective tissue sheath known as:',
          options: [
            'Bowman\'s capsule',
            'Glisson\'s capsule',
            'Malpighian corpuscle',
            'Pericardium'
          ],
          correctAnswer: 1,
          explanation: 'Each hepatic lobule is covered by a thin connective tissue sheath called Glisson\'s capsule, which is a defining histological feature of mammalian liver in NCERT Biology.',
          examTag: 'NEET',
          difficulty: 'easy'
        }
      ],
      textbookCitation: {
        source: 'NCERT Biology Class 11, Chapter 16',
        authors: 'NCERT Biology Committee',
        edition: '2026-27 Rationalised Edition',
        chapter: 'Digestion and Absorption',
        curriculumTags: ['CBSE-11', 'NEET-UG'],
        verificationStatus: 'VERIFIED_CURRICULUM',
        verificationDate: '2026-02-27',
        license: 'NCERT'
      },
      defaultColor: '#b45309'
    },
    {
      id: 'liver-gallbladder-ducts',
      meshNames: ['liver_gallbladder_mesh'],
      name: 'Gallbladder & Biliary Tree (Cystic Duct, Common Bile Duct, Sphincter of Oddi)',
      latinName: 'Vesica biliaris et Ductus choledochus',
      hindiName: 'पित्ताशय एवं पित्त वाहिनी (Pittaashay & Biliary Ducts)',
      pronunciation: 'veh-SEE-kuh bil-ee-AIR-is',
      system: 'Hepato-Biliary System',
      location: 'Pear-shaped muscular sac nested in a fossa on the inferior visceral surface of the right hepatic lobe.',
      grossDescription: 'Capacity 30–50 mL. Hepatic ducts from right and left lobes join to form the common hepatic duct. The cystic duct from the gallbladder connects with it to form the common bile duct (ductus choledochus).',
      mainFunction: 'Stores and concentrates bile up to 10-fold by absorbing water and electrolytes. Under the stimulus of Cholecystokinin (CCK), contracts and ejects concentrated bile through the hepatopancreatic ampulla (Ampulla of Vater) into the duodenum, guarded by the Sphincter of Oddi.',
      substructures: ['Fundus, Body & Neck of Gallbladder', 'Spiral Valve of Heister', 'Cystic Duct', 'Common Bile Duct', 'Hepatopancreatic Ampulla of Vater', 'Sphincter of Oddi'],
      bloodSupply: 'Cystic artery (usually branch of right hepatic artery); drainage into portal vein.',
      innervation: 'Vagus (parasympathetic contraction) and celiac plexus (sympathetic relaxation).',
      schoolExplanation: 'The gallbladder is a small green pouch tucked beneath the liver that acts as a storage tank for bile juice. When you eat greasy or oily food, it squirts concentrated bile into the food.',
      advancedExplanation: 'Bile contains no digestive enzymes but contains bile salts, bile pigments (bilirubin, biliverdin), cholesterol, and phospholipids. Lack of bile salts prevents fat emulsification and micelle formation, leading to steatorrhea.',
      learningObjectives: [
        'Diagram the junction of cystic duct and common hepatic duct to form common bile duct.',
        'Locate the Sphincter of Oddi at the entry point of duodenum.',
        'Explain the hormonal trigger (Cholecystokinin / CCK) for gallbladder contraction.'
      ],
      importantTerminology: [
        { term: 'Sphincter of Oddi', definition: 'Smooth muscle valve controlling release of bile and pancreatic secretions into the duodenum.' },
        { term: 'Cholecystokinin (CCK)', definition: 'Peptide hormone secreted by duodenal I-cells that stimulates gallbladder contraction.' }
      ],
      quizQuestions: [
        {
          id: 'q-liver-gallbladder-1',
          question: 'The duct from the gallbladder (cystic duct) joins the common hepatic duct from the liver to form the:',
          options: [
            'Hepatopancreatic duct',
            'Common bile duct',
            'Duct of Wirsung',
            'Duct of Santorini'
          ],
          correctAnswer: 1,
          explanation: 'The cystic duct from the gallbladder joins the common hepatic duct to form the common bile duct, which subsequently merges with the main pancreatic duct before opening into the duodenum.',
          examTag: 'NEET',
          difficulty: 'medium'
        }
      ],
      textbookCitation: {
        source: 'NCERT Biology Class 11, Chapter 16',
        authors: 'NCERT',
        edition: '2026-27 Rationalised Edition',
        chapter: 'Digestion and Absorption',
        curriculumTags: ['CBSE-11', 'NEET-UG'],
        verificationStatus: 'VERIFIED_CURRICULUM',
        verificationDate: '2026-02-27',
        license: 'NCERT'
      },
      defaultColor: '#15803d'
    }
  ],
  guidedTourSteps: [
    {
      stepNumber: 1,
      title: 'Gross Hepatic Anatomy & Dual Vascular Supply',
      structureId: 'liver-right-lobe',
      narration: 'The liver receives 75% of its blood from the nutrient-laden Hepatic Portal Vein and 25% from the oxygenated Hepatic Artery, blending together in porous sinusoids surrounded by radiating plates of hepatocytes.',
      highlightMeshNames: ['liver_right_lobe_mesh'],
      cameraPosition: [0.0, 0.44, 0.35],
      cameraTarget: [0.0, 0.42, 0.0]
    },
    {
      stepNumber: 2,
      title: 'Bile Production, Storage & Sphincter of Oddi',
      structureId: 'liver-gallbladder-ducts',
      narration: 'Hepatocytes secrete bile into canaliculi, which empty through hepatic ducts and the cystic duct into the gallbladder for concentration. Upon chyme arrival, CCK prompts sphincter relaxation to squirt bile for fat emulsification.',
      highlightMeshNames: ['liver_gallbladder_mesh'],
      cameraPosition: [0.1, 0.3, 0.28],
      cameraTarget: [0.02, 0.38, 0.0]
    }
  ]
};
