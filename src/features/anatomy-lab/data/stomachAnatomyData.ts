import { OrganModelSpec } from '../types/anatomy';

export const STOMACH_ORGAN_SPEC: OrganModelSpec = {
  id: 'organ-stomach',
  name: 'Human Stomach & Gastric Mucosa (Digestive System)',
  system: 'Gastrointestinal / Digestive System',
  classGrade: 'Class 10 & Class 11 (NCERT & NEET)',
  subject: 'Human Physiology / Biology',
  description: 'The stomach is a J-shaped muscular organ located in the epigastric, umbilical, and left hypochondriac regions of the abdomen. It serves as a temporary reservoir, performing mechanical churning and chemical digestion of ingested food into acidic chyme.',
  modelUrl: '/models/stomach.glb',
  modelFormat: 'procedural',
  initialCameraPosition: [0.0, 0.48, 0.36],
  initialTarget: [0.0, 0.42, 0.0],
  cameraPresets: {
    anterior: {
      id: 'anterior',
      label: 'Anterior View',
      position: [0.0, 0.42, 0.34],
      target: [0.0, 0.42, 0.0],
    },
    greaterCurvature: {
      id: 'greaterCurvature',
      label: 'Greater Curvature (Lateral)',
      position: [-0.32, 0.42, 0.05],
      target: [0.0, 0.42, 0.0],
    },
    lesserCurvature: {
      id: 'lesserCurvature',
      label: 'Lesser Curvature (Medial)',
      position: [0.3, 0.42, 0.05],
      target: [0.0, 0.42, 0.0],
    },
    interiorLumen: {
      id: 'interiorLumen',
      label: 'Gastric Rugae & Lumen',
      position: [0.0, 0.55, 0.12],
      target: [0.0, 0.4, 0.0],
    },
  },
  structures: [
    {
      id: 'stomach-cardia',
      meshNames: ['stomach_cardia_mesh'],
      name: 'Cardiac Region & Lower Esophageal Sphincter',
      latinName: 'Pars cardiaca ventriculi',
      hindiName: 'कार्डियक भाग (Cardia Bhag)',
      pronunciation: 'PARZ kar-dee-AY-kuh',
      system: 'Digestive System',
      location: 'Surrounds the superior opening of the stomach where the esophagus enters, just below the diaphragm at the level of T11.',
      grossDescription: 'Narrow transition zone (1-2 cm wide) between the non-keratinized stratified squamous epithelium of the esophagus and the simple columnar epithelium of the gastric mucosa (Z-line or squamocolumnar junction).',
      mainFunction: 'Receives the food bolus from the esophagus. The lower esophageal physiological sphincter (LES) prevents gastroesophageal acidic reflux (GERD) into the esophagus.',
      substructures: ['Squamocolumnar Junction (Z-line)', 'Cardiac Glands', 'Gastroesophageal Orifice'],
      bloodSupply: 'Left gastric artery (from celiac trunk); drainage via left gastric vein directly to hepatic portal vein.',
      innervation: 'Parasympathetic: anterior and posterior vagal trunks (CN X); Sympathetic: celiac plexus (T6-T9).',
      schoolExplanation: 'The cardia is the top opening of the stomach where food enters through the food pipe (esophagus). A muscular valve prevents acidic contents from splashing back into the throat.',
      advancedExplanation: 'The cardiac glands secrete mainly protective mucus. Failure of LES relaxation leads to Achalasia Cardia, while excessive relaxation causes GERD and potential Barrett\'s Esophagus.',
      learningObjectives: [
        'Identify the cardiac sphincter and squamocolumnar junction.',
        'Explain the physiology of gastroesophageal reflux prevention.',
        'Distinguish mucus-secreting cardiac glands from fundic acid-secreting glands.'
      ],
      importantTerminology: [
        { term: 'Z-line', definition: 'The anatomical transition boundary between esophageal squamous and gastric columnar epithelium.' },
        { term: 'Achalasia', definition: 'Failure of smooth muscle fibers of the LES to relax, causing food dysphagia.' }
      ],
      quizQuestions: [
        {
          id: 'q-stomach-cardia-1',
          question: 'Which sphincter prevents the regurgitation of acidic gastric juice back into the esophagus?',
          options: [
            'Pyloric sphincter',
            'Lower esophageal (cardiac) sphincter',
            'Sphincter of Oddi',
            'Ileocecal valve'
          ],
          correctAnswer: 1,
          explanation: 'The lower esophageal sphincter (LES) at the cardia maintains resting tone to prevent acid regurgitation into the esophagus.',
          examTag: 'NEET',
          difficulty: 'easy'
        }
      ],
      textbookCitation: {
        source: 'NCERT Biology Class 11, Chapter 16 / OpenStax A&P 2e Chapter 23',
        authors: 'NCERT Textbook Committee / Betts et al.',
        edition: '2026-27 CBSE Rationalised / 2nd Edition',
        chapter: 'Digestion and Absorption / The Digestive System',
        curriculumTags: ['CBSE-11', 'NEET-UG', 'NCERT-Core'],
        verificationStatus: 'VERIFIED_CURRICULUM',
        verificationDate: '2026-02-27',
        license: 'CC BY 4.0 / Government of India NCERT'
      },
      defaultColor: '#e11d48'
    },
    {
      id: 'stomach-fundus-body',
      meshNames: ['stomach_fundus_body_mesh'],
      name: 'Gastric Fundus and Body (Corpus)',
      latinName: 'Fundus et Corpus gastricum',
      hindiName: 'फंडस एवं आमाशय काय (Fundus & Aamashay Kay)',
      pronunciation: 'FUN-dus ET KOR-pus',
      system: 'Digestive System',
      location: 'Fundus is the dome-shaped upper left portion resting under the left dome of the diaphragm; body constitutes the largest central digestive chamber.',
      grossDescription: 'Vast muscular chamber with three muscle layers (outer longitudinal, middle circular, inner oblique). Mucosal lining forms prominent longitudinal folds called gastric rugae when empty.',
      mainFunction: 'Stores swallowed food, produces gastric juice (HCl, pepsinogen, intrinsic factor), and mechanically churns food into semi-liquid chyme through rhythmic peristaltic contractions.',
      substructures: ['Parietal (Oxyntic) Cells', 'Chief (Peptic) Cells', 'Mucous Neck Cells', 'Gastric Rugae Folds'],
      bloodSupply: 'Left gastric artery, right gastric artery, short gastric arteries, and left gastroepiploic artery.',
      innervation: 'Vagus nerve (CN X) stimulates HCl secretion and motility; splanchnic nerves inhibit.',
      schoolExplanation: 'The fundus and body make up the main tank of the stomach. Gastric glands here make hydrochloric acid (which kills germs and activates enzymes) and pepsin enzyme (which digests proteins).',
      advancedExplanation: 'Parietal cells secrete HCl via H+/K+ ATPase pumps and Castle\'s Intrinsic Factor (essential for vitamin B12 absorption in the terminal ileum). Deficiency causes Pernicious Anemia.',
      learningObjectives: [
        'Trace the role of parietal cells in HCl and Intrinsic Factor secretion.',
        'Understand the conversion of pepsinogen to active pepsin at pH 1.5–2.0.',
        'Describe the function of the three muscular layers in churning.'
      ],
      importantTerminology: [
        { term: 'Castle\'s Intrinsic Factor', definition: 'Glycoprotein secreted by parietal cells necessary for intestinal absorption of Vitamin B12.' },
        { term: 'Oxyntic Cells', definition: 'Cells with extensive canaliculi producing hydrochloric acid via proton pumps.' }
      ],
      quizQuestions: [
        {
          id: 'q-stomach-fundus-1',
          question: 'Parietal (oxyntic) cells in the gastric glands secrete which two vital substances?',
          options: [
            'Pepsinogen and Gastrin',
            'Hydrochloric acid (HCl) and Intrinsic factor',
            'Mucus and Bicarbonate',
            'Trypsin and Amylase'
          ],
          correctAnswer: 1,
          explanation: 'Parietal cells secrete HCl (which activates pepsinogen and provides pH 1.8) and Intrinsic factor (vital for Vitamin B12 absorption in the ileum).',
          examTag: 'NEET',
          difficulty: 'medium'
        }
      ],
      textbookCitation: {
        source: 'NCERT Biology Class 11, Chapter 16',
        authors: 'NCERT Textbook Committee',
        edition: '2026-27 Rationalised Edition',
        chapter: 'Digestion and Absorption',
        curriculumTags: ['CBSE-11', 'NEET-UG', 'NCERT-Core'],
        verificationStatus: 'VERIFIED_CURRICULUM',
        verificationDate: '2026-02-27',
        license: 'NCERT'
      },
      defaultColor: '#db2777'
    },
    {
      id: 'stomach-pylorus',
      meshNames: ['stomach_pylorus_mesh'],
      name: 'Pyloric Antrum, Canal & Pyloric Sphincter',
      latinName: 'Pylorus et Sphincter pylori',
      hindiName: 'जठरनिर्गमी भाग (Pyloric Bhag & Pyloric Sphincter)',
      pronunciation: 'pie-LOR-us',
      system: 'Digestive System',
      location: 'Distal funnel-shaped exit of the stomach connecting to the C-shaped duodenum of the small intestine.',
      grossDescription: 'Consists of the wide pyloric antrum, narrow pyloric canal, and a thick circular smooth muscle ring known as the pyloric sphincter valve.',
      mainFunction: 'Regulates gastric emptying by releasing small aliquots of acidic chyme (approx 3 mL per peristaltic wave) into the duodenum while retropulsing larger food particles for further grinding.',
      substructures: ['Pyloric Antrum', 'Pyloric Canal', 'Pyloric Sphincter', 'G-cells (Gastrin-producing)'],
      bloodSupply: 'Right gastric artery and right gastroepiploic artery.',
      innervation: 'Enteric nervous system with vagal and sympathetic modulation.',
      schoolExplanation: 'The pylorus is the exit door of the stomach. Its strong circular muscle valve opens intermittently to allow small amounts of processed chyme into the small intestine.',
      advancedExplanation: 'G-cells in the pyloric antrum secrete the peptide hormone Gastrin in response to peptides and stomach distension, which enters circulation to stimulate fundic parietal acid secretion.',
      learningObjectives: [
        'Explain the role of the pyloric sphincter in gastric emptying regulation.',
        'Recognize G-cells and their endocrine secretion of Gastrin.',
        'Contrast gastric chyme properties with duodenal alkaline requirements.'
      ],
      importantTerminology: [
        { term: 'Chyme', definition: 'Pulpy acidic fluid consisting of gastric juices and partly digested food.' },
        { term: 'Gastrin', definition: 'Hormone produced by G-cells that stimulates gastric juice secretion and motility.' }
      ],
      quizQuestions: [
        {
          id: 'q-stomach-pylorus-1',
          question: 'Which hormone is secreted by G-cells located primarily in the pyloric antrum of the stomach?',
          options: [
            'Secretin',
            'Cholecystokinin (CCK)',
            'Gastrin',
            'Enterokinase'
          ],
          correctAnswer: 2,
          explanation: 'G-cells in the pyloric antrum secrete Gastrin, which stimulates parietal cells to produce HCl and promotes gastric motility.',
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
      defaultColor: '#9333ea'
    }
  ],
  guidedTourSteps: [
    {
      stepNumber: 1,
      title: 'Bolus Ingestion & Cardiac Prevention of GERD',
      structureId: 'stomach-cardia',
      narration: 'Masticated food bolus travels down the esophagus and enters the stomach via the cardiac orifice. The lower esophageal sphincter closes tightly to protect against gastric acid erosion.',
      highlightMeshNames: ['stomach_cardia_mesh'],
      cameraPosition: [0.0, 0.52, 0.3],
      cameraTarget: [0.0, 0.44, 0.0]
    },
    {
      stepNumber: 2,
      title: 'Acid Secretion & Protein Proteolysis',
      structureId: 'stomach-fundus-body',
      narration: 'In the gastric body and fundus, parietal cells generate hydrochloric acid (pH 1.5–2.0) and Castle\'s intrinsic factor. Pepsinogen is activated to pepsin, initiating peptide cleavage.',
      highlightMeshNames: ['stomach_fundus_body_mesh'],
      cameraPosition: [-0.25, 0.44, 0.22],
      cameraTarget: [0.0, 0.4, 0.0]
    },
    {
      stepNumber: 3,
      title: 'Pyloric Grinding & Duodenal Metering',
      structureId: 'stomach-pylorus',
      narration: 'Strong antral peristalsis retropulses large particles while metering small volumes of liquid chyme through the pyloric sphincter into the duodenum for pancreatic and bile neutralization.',
      highlightMeshNames: ['stomach_pylorus_mesh'],
      cameraPosition: [0.25, 0.4, 0.22],
      cameraTarget: [0.08, 0.38, 0.0]
    }
  ]
};
