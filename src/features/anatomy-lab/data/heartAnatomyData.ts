import { OrganModelSpec } from '../types/anatomy';

export const HEART_ORGAN_SPEC: OrganModelSpec = {
  id: 'organ-heart',
  name: 'Human Heart (Cardiovascular System)',
  system: 'Cardiovascular / Circulatory System',
  classGrade: 'Class 10 & Class 11 (NCERT & NEET)',
  subject: 'Human Physiology / Biology',
  description: 'The human heart is a hollow, muscular, myogenic pumping organ situated in the thoracic cavity between the lungs in the middle mediastinum, tilted slightly to the left. It maintains double circulation through rhythmic, synchronized cardiac cycles.',
  modelUrl: '/models/heart.glb',
  modelFormat: 'glb',
  initialCameraPosition: [0.03, 0.48, 0.32],
  initialTarget: [0.02, 0.47, 0.04],
  cameraPresets: {
    anterior: {
      id: 'anterior',
      label: 'Anterior (Sternocostal) View',
      position: [0.02, 0.47, 0.28],
      target: [0.02, 0.47, 0.04]
    },
    posterior: {
      id: 'posterior',
      label: 'Posterior (Base) View',
      position: [0.02, 0.47, -0.22],
      target: [0.02, 0.47, 0.04]
    },
    superior: {
      id: 'superior',
      label: 'Superior (Valvular Plane) View',
      position: [0.02, 0.72, 0.05],
      target: [0.02, 0.47, 0.04]
    },
    leftLateral: {
      id: 'leftLateral',
      label: 'Left Ventricular / Apex View',
      position: [0.26, 0.47, 0.04],
      target: [0.02, 0.47, 0.04]
    },
    rightLateral: {
      id: 'rightLateral',
      label: 'Right Atrial / Vena Cava View',
      position: [-0.22, 0.47, 0.04],
      target: [0.02, 0.47, 0.04]
    }
  },
  structures: [
    // 1. Right Atrium
    {
      id: 'heart-right-atrium',
      meshNames: ['VH_M_right_cardiac_atrium'],
      name: 'Right Atrium',
      latinName: 'Atrium dextrum cordis',
      hindiName: 'दायाँ अलिन्द (Daayan Alind)',
      pronunciation: 'AY-tree-um DEK-strum',
      system: 'Cardiovascular System',
      location: 'Upper right chamber of the heart; forms the entire right border and receives venous blood from systemic circulation.',
      grossDescription: 'Thin-walled (2–3 mm), low-pressure chamber. Internally divided into a smooth posterior part (sinus venarum) and a rough anterior muscular part featuring pectinate muscles (musculi pectinati), separated by the crista terminalis. Houses the sinoatrial (SA) node at the junction with the superior vena cava.',
      mainFunction: 'Receives deoxygenated systemic venous return from the Superior Vena Cava (upper body), Inferior Vena Cava (lower body), and Coronary Sinus (cardiac myocardium), channeling it through the tricuspid orifice into the right ventricle during ventricular diastole.',
      substructures: ['Sinus Venarum', 'Fossa Ovalis', 'Crista Terminalis', 'Pectinate Muscles', 'Sinoatrial (SA) Node', 'Opening of Coronary Sinus'],
      bloodSupply: 'Right Coronary Artery (RCA) atrial branches; draining directly into the cardiac venous system.',
      innervation: 'Cardiac Plexus: Sympathetic fibers from T1–T4 (increases heart rate); Parasympathetic via Vagus nerve (CN X) to SA and AV nodes (decreases heart rate).',
      schoolExplanation: 'In NCERT Class 10 & 11 Biology, the right atrium is described as the thin-walled receiving chamber for oxygen-poor blood returning from the entire body. It relaxes to fill with blood from the superior and inferior vena cava, then contracts to push blood past the tricuspid valve into the right ventricle.',
      advancedExplanation: 'In OpenStax A&P 2e and Gray\'s Anatomy, the right atrium functions under low pressures (mean 2–6 mmHg). During atrial systole, it provides the "atrial kick," contributing approximately 20–30% of ventricular end-diastolic filling. The interatrial septum bears the fossa ovalis, the remnant of the fetal foramen ovale. Contains specialized stretch receptors that secrete Atrial Natriuretic Peptide (ANP) in response to hypervolemia.',
      learningObjectives: [
        'Identify the position of the Sinoatrial (SA) node in the superior posterolateral right atrial wall.',
        'Trace the systemic venous return pathways through the SVC, IVC, and coronary sinus.',
        'Differentiate the smooth sinus venarum from the trabeculated pectinate muscles.'
      ],
      importantTerminology: [
        { term: 'Sinoatrial (SA) Node', definition: 'The natural primary pacemaker of the heart, generating rhythmic action potentials at 70–75 impulses per minute.' },
        { term: 'Fossa Ovalis', definition: 'An oval depression in the interatrial septum marking the closure site of the fetal foramen ovale.' },
        { term: 'Atrial Kick', definition: 'The final 20–30% bolus of blood pumped into the ventricles during atrial contraction at the end of diastole.' }
      ],
      quizQuestions: [
        {
          id: 'q-ra-1',
          question: 'Where is the Sinoatrial (SA) node, the primary pacemaker of the human heart, anatomically situated?',
          options: [
            'In the upper wall of the right atrium near the opening of the superior vena cava',
            'In the lower left corner of the right ventricle near the apex',
            'In the interatrial septum near the bicuspid valve orifice',
            'At the base of the aorta inside the left ventricle'
          ],
          correctAnswer: 0,
          explanation: 'As per NCERT Class 11 Biology Chapter 18, a patch of nodal tissue called the Sinoatrial (SA) Node is located in the upper right corner of the right atrium, adjacent to the entrance of the superior vena cava.',
          examTag: 'NEET',
          difficulty: 'medium'
        },
        {
          id: 'q-ra-2',
          question: 'What is the embryonic remnant found in the interatrial septum of the right atrium called?',
          options: [
            'Fossa Ovalis',
            'Ductus Arteriosus',
            'Ligamentum Arteriosum',
            'Conus Arteriosus'
          ],
          correctAnswer: 0,
          explanation: 'The fossa ovalis represents the closed embryological foramen ovale which previously shunted oxygenated placental blood from right to left atrium in the fetus.',
          examTag: 'CBSE',
          difficulty: 'easy'
        }
      ],
      textbookCitation: {
        source: 'NCERT Class 11 Biology & OpenStax Anatomy and Physiology 2e',
        authors: 'NCERT Textbook Committee & J. Gordon Betts et al.',
        edition: 'NCERT 2026-27 Session & OpenStax 2nd Edition',
        chapter: 'NCERT Ch 18 (Body Fluids & Circulation) & OpenStax Ch 19.1',
        curriculumTags: ['CBSE Class 11', 'NEET-UG Biology', 'CUET Life Sciences'],
        verificationStatus: 'VERIFIED_CURRICULUM',
        verificationDate: 'October 2026',
        license: 'CC BY 4.0'
      },
      defaultColor: '#1d4ed8',
      pinPosition: [-0.02, 0.49, 0.04],
      explodedOffset: [-0.04, 0.02, 0],
      relatedStructureIds: ['heart-right-ventricle', 'heart-tricuspid-valve']
    },

    // 2. Right Ventricle
    {
      id: 'heart-right-ventricle',
      meshNames: ['VH_M_heart_right_ventricle'],
      name: 'Right Ventricle',
      latinName: 'Ventriculus dexter cordis',
      hindiName: 'दायाँ निलय (Daayan Nilay)',
      pronunciation: 'ven-TRIH-kyul-us DEK-ster',
      system: 'Cardiovascular System',
      location: 'Anterior portion of the cardiac mass; forms the major part of the sternocostal surface.',
      grossDescription: 'Crescent-shaped chamber in cross-section wrapping around the left ventricle. Wall thickness is approximately 3–5 mm. Characterized by prominent muscular ridges (trabeculae carneae), three papillary muscles, and the conus arteriosus (infundibulum) leading to the pulmonary valve.',
      mainFunction: 'Ejects deoxygenated blood under moderate pressure (systolic ~25 mmHg) into the pulmonary trunk through the pulmonary semilunar valve, propelling blood through the low-resistance pulmonary capillary bed for gas exchange in the lungs.',
      substructures: ['Trabeculae Carneae', 'Papillary Muscles (Anterior, Posterior, Septal)', 'Moderator Band (Septomarginal Trabecula)', 'Conus Arteriosus', 'Pulmonary Orifice'],
      bloodSupply: 'Marginal branch and posterior interventricular branch of Right Coronary Artery (RCA).',
      innervation: 'Cardiac autonomic plexus via sympathetic accelerator nerves and parasympathetic vagal fibers.',
      schoolExplanation: 'In NCERT Class 10 & 11, the right ventricle has thicker muscular walls than the atria because it must pump blood outward to the pulmonary system. It contracts during ventricular systole while the tricuspid valve snaps shut to prevent backflow.',
      advancedExplanation: 'The right ventricle operates against low pulmonary vascular resistance (PVR = 1–2 Wood units). The moderator band crosses the lumen carrying the right bundle branch of the Purkinje conduction system to ensure coordinated apex-to-base contraction. During ventricular systole, pressure rises to 25 mmHg, opening the pulmonary valve.',
      learningObjectives: [
        'Understand why the right ventricular wall is thinner (3-5 mm) compared to the left ventricle (10-15 mm).',
        'Identify the role of the moderator band and papillary muscles.',
        'Trace the pulmonary circulation circuit originating from this chamber.'
      ],
      importantTerminology: [
        { term: 'Trabeculae Carneae', definition: 'Muscular ridges lining the interior ventricular walls that prevent suction upon ejection.' },
        { term: 'Moderator Band', definition: 'A muscular band carrying the right bundle branch of the AV conduction bundle from the septum to the anterior papillary muscle.' }
      ],
      quizQuestions: [
        {
          id: 'q-rv-1',
          question: 'The right ventricle ejects deoxygenated blood directly into which major blood vessel?',
          options: [
            'Pulmonary Trunk / Artery',
            'Ascending Aorta',
            'Superior Vena Cava',
            'Pulmonary Vein'
          ],
          correctAnswer: 0,
          explanation: 'Contraction of the right ventricle forces blood across the pulmonary semilunar valve into the pulmonary trunk, branching into the left and right pulmonary arteries towards the lungs.',
          examTag: 'CBSE',
          difficulty: 'easy'
        }
      ],
      textbookCitation: {
        source: 'NCERT Class 11 Biology & OpenStax Anatomy and Physiology 2e',
        authors: 'NCERT & Betts et al.',
        edition: 'NCERT 2026-27 & OpenStax 2e',
        chapter: 'NCERT Ch 18.2 & OpenStax Ch 19.1',
        curriculumTags: ['CBSE Class 11', 'NEET Biology'],
        verificationStatus: 'VERIFIED_CURRICULUM',
        verificationDate: 'October 2026',
        license: 'CC BY 4.0'
      },
      defaultColor: '#2563eb',
      pinPosition: [0.01, 0.44, 0.07],
      explodedOffset: [-0.03, -0.02, 0.02],
      relatedStructureIds: ['heart-right-atrium', 'heart-pulmonary-valve', 'heart-tricuspid-valve']
    },

    // 3. Left Atrium
    {
      id: 'heart-left-atrium',
      meshNames: ['VH_M_left_cardiac_atrium'],
      name: 'Left Atrium',
      latinName: 'Atrium sinistrum cordis',
      hindiName: 'बायाँ अलिन्द (Bayan Alind)',
      pronunciation: 'AY-tree-um sin-IS-trum',
      system: 'Cardiovascular System',
      location: 'Most posterior chamber of the heart; forms the greater part of the anatomical base, directly anterior to the esophagus and descending aorta.',
      grossDescription: 'Cuboidal chamber with smooth interior walls derived from the embryological incorporation of the pulmonary veins. Only the left auricle contains pectinate muscles. Wall thickness is about 3 mm.',
      mainFunction: 'Receives high-oxygen blood freshly purified in the pulmonary alveoli from all four pulmonary veins (two left, two right) and transfers it into the left ventricle across the bicuspid (mitral) valve.',
      substructures: ['Four Pulmonary Venous Ostia', 'Left Auricle (Pectinate Muscles)', 'Interatrial Septum with Valve of Fossa Ovalis', 'Mitral Orifice'],
      bloodSupply: 'Left Coronary Artery (circumflex branch) and right coronary artery branches.',
      innervation: 'Cardiac plexus (vagal parasympathetic and thoracic sympathetic fibers).',
      schoolExplanation: 'In NCERT textbooks, the left atrium receives oxygen-rich blood from the lungs via four pulmonary veins. It relaxes while collecting oxygenated blood and contracts to pump it into the left ventricle.',
      advancedExplanation: 'In clinical cardiology, the left atrial pressure (LAP) reflects pulmonary capillary wedge pressure (PCWP, normal 4–12 mmHg). It is prone to dilation and thrombus formation (especially within the left atrial appendage) during atrial fibrillation.',
      learningObjectives: [
        'Recognize that pulmonary veins uniquely carry oxygenated blood to this chamber.',
        'Locate the four pulmonary venous openings on the posterior surface.',
        'Understand the role of the left atrium in left ventricular diastolic preload.'
      ],
      importantTerminology: [
        { term: 'Pulmonary Veins', definition: 'The four veins (two left, two right) that transport freshly oxygenated blood from the pulmonary capillary plexus into the left atrium.' }
      ],
      quizQuestions: [
        {
          id: 'q-la-1',
          question: 'How many pulmonary veins drain oxygenated blood into the left atrium in human adults?',
          options: ['4 (Two from each lung)', '2 (One from each lung)', '1 (Common trunk)', '3'],
          correctAnswer: 0,
          explanation: 'Four pulmonary veins (two left superior/inferior and two right superior/inferior) enter the posterior wall of the left atrium without valves.',
          examTag: 'NEET',
          difficulty: 'medium'
        }
      ],
      textbookCitation: {
        source: 'NCERT Class 11 Biology & OpenStax Anatomy and Physiology 2e',
        authors: 'NCERT & Betts et al.',
        edition: 'NCERT 2026-27 & OpenStax 2e',
        chapter: 'NCERT Ch 18.2 & OpenStax Ch 19.1',
        curriculumTags: ['CBSE Class 10', 'CBSE Class 11', 'NEET-UG'],
        verificationStatus: 'VERIFIED_CURRICULUM',
        verificationDate: 'October 2026',
        license: 'CC BY 4.0'
      },
      defaultColor: '#dc2626',
      pinPosition: [0.01, 0.51, -0.01],
      explodedOffset: [0, 0.03, -0.04],
      relatedStructureIds: ['heart-left-ventricle', 'heart-mitral-valve']
    },

    // 4. Left Ventricle
    {
      id: 'heart-left-ventricle',
      meshNames: ['VH_M_heart_left_ventricle'],
      name: 'Left Ventricle',
      latinName: 'Ventriculus sinister cordis',
      hindiName: 'बायाँ निलय (Bayan Nilay)',
      pronunciation: 'ven-TRIH-kyul-us sin-IS-ter',
      system: 'Cardiovascular System',
      location: 'Forms the apex of the heart, posteroinferior surface, situated to the left and posterior of the right ventricle.',
      grossDescription: 'Conical, thick-walled chamber (myocardium thickness 10–15 mm, three times thicker than the right ventricle). Circular in cross-section. Contains two large papillary muscles (anterolateral and posteromedial) that anchor the mitral valve leaflets via heavy chordae tendineae.',
      mainFunction: 'Pumps high-pressure oxygenated blood (systolic pressure ~120 mmHg) through the aortic semilunar valve into the aorta, overcoming total peripheral systemic vascular resistance to supply all tissues of the body.',
      substructures: ['Thick Myocardium (10–15 mm)', 'Anterolateral Papillary Muscle', 'Posteromedial Papillary Muscle', 'Chordae Tendineae', 'Aortic Vestibule', 'Cardiac Apex'],
      bloodSupply: 'Left Anterior Descending (LAD / Anterior Interventricular Artery) and Circumflex branch of Left Coronary Artery.',
      innervation: 'Cardiac autonomic plexus (rich sympathetic innervation augmenting inotropic contractility).',
      schoolExplanation: 'According to NCERT Class 10 & 11, the left ventricle possesses the thickest muscular wall in the entire heart because it must generate enough force to propel blood through the vast systemic circulation to every cell in the human body.',
      advancedExplanation: 'In OpenStax A&P 2e, the left ventricle generates a stroke volume of approximately 70 mL with an ejection fraction (EF) of 55–70%. Its circular cross-section enables it to withstand and generate high systolic peak pressures (120 mmHg). Its contractility is governed by the Frank-Starling Law of the Heart.',
      learningObjectives: [
        'Explain the mechanical necessity of 3x thicker myocardium in the left ventricle.',
        'Understand the relation between left ventricular stroke volume and cardiac output (CO = HR x SV).',
        'Identify the aortic vestibule leading to the aortic root.'
      ],
      importantTerminology: [
        { term: 'Stroke Volume (SV)', definition: 'The volume of blood ejected by the left ventricle per beat (normally ~70 mL at rest).' },
        { term: 'Ejection Fraction (EF)', definition: 'The fraction of outbound blood pumped from the left ventricle with each contraction (normal 55–70%).' },
        { term: 'Frank-Starling Law', definition: 'The physiological principle that the force of ventricular contraction is proportional to the initial end-diastolic length of myocardial fibers.' }
      ],
      quizQuestions: [
        {
          id: 'q-lv-1',
          question: 'Why is the muscular wall of the left ventricle significantly thicker than that of the right ventricle?',
          options: [
            'It must generate sufficient systolic pressure to overcome systemic vascular resistance throughout the entire body',
            'It stores deoxygenated blood under higher hydrostatic pressure',
            'It contains the primary pacemaker SA node',
            'It contracts more frequently than the right ventricle'
          ],
          correctAnswer: 0,
          explanation: 'The left ventricle pumps against the systemic afterload (120 mmHg) across thousands of miles of systemic vascular beds, requiring 3x thicker muscular walls compared to the low-pressure pulmonary circuit (25 mmHg).',
          examTag: 'CBSE',
          difficulty: 'medium'
        }
      ],
      textbookCitation: {
        source: 'NCERT Class 11 Biology & OpenStax Anatomy and Physiology 2e',
        authors: 'NCERT & Betts et al.',
        edition: 'NCERT 2026-27 & OpenStax 2e',
        chapter: 'NCERT Ch 18.2 & OpenStax Ch 19.1',
        curriculumTags: ['CBSE Class 10', 'CBSE Class 11', 'NEET-UG'],
        verificationStatus: 'VERIFIED_CURRICULUM',
        verificationDate: 'October 2026',
        license: 'CC BY 4.0'
      },
      defaultColor: '#ef4444',
      pinPosition: [0.05, 0.45, 0.04],
      explodedOffset: [0.04, -0.02, 0.02],
      relatedStructureIds: ['heart-left-atrium', 'heart-aortic-valve', 'heart-interventricular-septum']
    },

    // 5. Interventricular Septum
    {
      id: 'heart-interventricular-septum',
      meshNames: ['VH_M_interventricular_septum'],
      name: 'Interventricular Septum',
      latinName: 'Septum interventriculare',
      hindiName: 'अंतर-निलयी पट (Antar-Nilayi Pat)',
      pronunciation: 'SEP-tum in-ter-ven-trik-yoo-LAIR-ee',
      system: 'Cardiovascular System',
      location: 'Internal partition separating the right and left ventricular cavities from apex to base.',
      grossDescription: 'A curved, oblique muscular and membranous wall. Consists of a thick muscular part (pars muscularis, 90% of septum) and a small, thin, smooth membranous part (pars membranacea) superiorly near the aortic root. Conveys the Bundle of His and bundle branches.',
      mainFunction: 'Completely separates oxygenated left ventricular blood from deoxygenated right ventricular blood to maintain high systemic oxygen tension. Participates actively in ventricular contraction and transmits the cardiac conduction action potential.',
      substructures: ['Muscular Septum (Pars Muscularis)', 'Membranous Septum (Pars Membranacea)', 'Atrioventricular (AV) Bundle of His', 'Left and Right Bundle Branches'],
      bloodSupply: 'Anterior 2/3 supplied by septal branches of Left Anterior Descending (LAD) artery; posterior 1/3 by posterior interventricular artery (PDA).',
      innervation: 'Innervated through the cardiac plexus; houses the specialized conduction bundle.',
      schoolExplanation: 'In NCERT Biology, birds and mammals possess a complete four-chambered heart with an intact interventricular septum that completely prevents the mixing of oxygenated and deoxygenated blood, ensuring maximum metabolic efficiency and warm-blooded homeostasis.',
      advancedExplanation: 'A defect in the membranous septum produces a Ventricular Septal Defect (VSD), the most common congenital heart anomaly. Pathologically causes a left-to-right shunt due to higher left ventricular pressures, causing pulmonary hypertension.',
      learningObjectives: [
        'Understand the evolutionary importance of complete ventricular septation in warm-blooded vertebrates.',
        'Locate the Bundle of His passing through the membranous septum.',
        'Differentiate the muscular from the membranous septum.'
      ],
      importantTerminology: [
        { term: 'Ventricular Septal Defect (VSD)', definition: 'A congenital opening in the interventricular septum that permits abnormal left-to-right hemodynamic shunting.' },
        { term: 'Bundle of His', definition: 'The specialized conducting tract of cardiac muscle fibers that carries electrical impulses from the AV node into the ventricles.' }
      ],
      quizQuestions: [
        {
          id: 'q-ivs-1',
          question: 'What is the physiological consequence of an intact interventricular septum in humans?',
          options: [
            'Complete separation of oxygenated and deoxygenated blood, ensuring high metabolic oxygen delivery',
            'Slowed electrical conduction between the two atria',
            'Mixing of venous and arterial blood to reduce cardiac workload',
            'Prevention of semilunar valve closure during ventricular diastole'
          ],
          correctAnswer: 0,
          explanation: 'The complete interventricular septum prevents any mixing of oxygenated and deoxygenated blood, which is essential for the high-pressure, high-oxygen demands of endothermic mammals.',
          examTag: 'CBSE',
          difficulty: 'easy'
        }
      ],
      textbookCitation: {
        source: 'NCERT Class 11 Biology Chapter 18 & OpenStax A&P 2e Section 19.1',
        authors: 'NCERT & Betts et al.',
        edition: 'NCERT 2026-27 & OpenStax 2e',
        chapter: 'NCERT Ch 18.2 (Human Circulatory System)',
        curriculumTags: ['CBSE Class 11', 'NEET Biology'],
        verificationStatus: 'VERIFIED_CURRICULUM',
        verificationDate: 'October 2026',
        license: 'CC BY 4.0'
      },
      defaultColor: '#b45309',
      pinPosition: [0.03, 0.46, 0.05],
      explodedOffset: [0, 0, 0],
      relatedStructureIds: ['heart-left-ventricle', 'heart-right-ventricle']
    },

    // 6. Tricuspid Valve
    {
      id: 'heart-tricuspid-valve',
      meshNames: ['VH_M_tricuspid_valve'],
      name: 'Tricuspid Valve (Right AV Valve)',
      latinName: 'Valva atrioventricularis dextra',
      hindiName: 'त्रिवलनी कपाट (Trivalani Kapaat)',
      pronunciation: 'try-KUS-pid VALV',
      system: 'Cardiovascular System',
      location: 'Situated in the right atrioventricular orifice between the right atrium and right ventricle.',
      grossDescription: 'Features three flexible fibrous cusps (anterior, posterior, septal) anchored to a fibrous annulus. The free margins of the cusps are connected by fibrous cords (chordae tendineae) to the papillary muscles.',
      mainFunction: 'Permits forward blood flow from right atrium to right ventricle during ventricular diastole; snaps tightly closed during ventricular systole to prevent regurgitation into the right atrium.',
      substructures: ['Anterior Cusp', 'Posterior Cusp', 'Septal Cusp', 'Chordae Tendineae', 'Fibrous Annulus'],
      bloodSupply: 'Avascular cusps; nourished by direct diffusion from the intracardiac blood and deep capillary plexus of the annulus.',
      innervation: 'Mechanoreceptors in the fibrous ring innervated by cardiac autonomic fibers.',
      schoolExplanation: 'NCERT Class 11 Biology Section 18.2 states: "The opening between the right atrium and the right ventricle is guarded by a valve formed of three muscular flaps or cusps, the tricuspid valve." Its closure creates the first heart sound (lub/S1).',
      advancedExplanation: 'During ventricular systole, the rising intraventricular pressure balloons the cusps upward. Simultaneous contraction of the papillary muscles pulls on the chordae tendineae, preventing the cusps from everting (prolapsing) into the atrium.',
      learningObjectives: [
        'Identify the three cusps (anterior, posterior, and septal).',
        'Explain how chordae tendineae and papillary muscles prevent valve prolapse during systole.',
        'Correlate tricuspid valve closure with the S1 (first heart sound).'
      ],
      importantTerminology: [
        { term: 'Chordae Tendineae', definition: 'Inelastic fibrous cords ("heartstrings") linking papillary muscles to AV valve cusps.' },
        { term: 'First Heart Sound (S1)', definition: 'The "lub" sound caused by reverberation of blood against the closing atrioventricular valves (mitral and tricuspid) at the onset of ventricular systole.' }
      ],
      quizQuestions: [
        {
          id: 'q-tv-1',
          question: 'The tricuspid valve guards the aperture between which two heart chambers?',
          options: [
            'Right atrium and right ventricle',
            'Left atrium and left ventricle',
            'Right ventricle and pulmonary trunk',
            'Left ventricle and aorta'
          ],
          correctAnswer: 0,
          explanation: 'The tricuspid valve has three triangular cusps and guards the right atrioventricular opening, preventing backflow into the right atrium during right ventricular contraction.',
          examTag: 'CBSE',
          difficulty: 'easy'
        }
      ],
      textbookCitation: {
        source: 'NCERT Class 11 Biology Section 18.2 & OpenStax A&P 2e Section 19.1',
        authors: 'NCERT & Betts et al.',
        edition: 'NCERT 2026-27 & OpenStax 2e',
        chapter: 'NCERT Ch 18.2 (Cardiac Cycle)',
        curriculumTags: ['CBSE Class 11', 'NEET Biology'],
        verificationStatus: 'VERIFIED_CURRICULUM',
        verificationDate: 'October 2026',
        license: 'CC BY 4.0'
      },
      defaultColor: '#f59e0b',
      pinPosition: [-0.01, 0.46, 0.05],
      explodedOffset: [-0.02, 0.02, 0.01],
      relatedStructureIds: ['heart-right-atrium', 'heart-right-ventricle', 'heart-papillary-anterior']
    },

    // 7. Mitral / Bicuspid Valve
    {
      id: 'heart-mitral-valve',
      meshNames: ['VH_M_mitral_valve'],
      name: 'Bicuspid (Mitral) Valve',
      latinName: 'Valva mitralis / bicuspidalis',
      hindiName: 'द्विवलनी / माइट्रल कपाट (Dwivalani / Mitral Kapaat)',
      pronunciation: 'BY-kus-pid / MY-tral VALV',
      system: 'Cardiovascular System',
      location: 'Left atrioventricular orifice between the left atrium and left ventricle.',
      grossDescription: 'Consists of two heavy triangular cusps: an anterior (aortic) cusp and a posterior (mural) cusp. Resembles a bishop\'s miter headpiece. Connected via strong chordae tendineae to two large left ventricular papillary muscles.',
      mainFunction: 'Opens during ventricular diastole to allow oxygenated blood into the left ventricle. Withstands the peak 120 mmHg systolic pressure of the left ventricle to prevent backflow into the pulmonary circulation.',
      substructures: ['Anterior (Aortic) Cusp', 'Posterior (Mural) Cusp', 'Fibrous Annulus', 'Anterior & Posterior Commissures'],
      bloodSupply: 'Avascular leaflet tissue; nourished through microdiffusion.',
      innervation: 'Cardiac autonomic plexus terminal free endings.',
      schoolExplanation: 'According to NCERT Class 11 Biology Chapter 18: "A bicuspid or mitral valve guards the opening between the left atrium and the left ventricle." It prevents backflow when the left ventricle contracts with immense force.',
      advancedExplanation: 'The mitral valve is the most clinically vulnerable valve in human medicine (Mitral Valve Prolapse, Mitral Regurgitation, Mitral Stenosis following rheumatic fever). Mitral valve closure is the primary contributor to the loud first heart sound (S1).',
      learningObjectives: [
        'Differentiate the bicuspid (2-cusp) mitral valve from the tricuspid (3-cusp) valve.',
        'Explain the role of the anterior cusp in guiding blood into the aortic vestibule.',
        'Understand mitral regurgitation pathology.'
      ],
      importantTerminology: [
        { term: 'Mitral Regurgitation', definition: 'Failure of the mitral valve to seal tightly, causing high-pressure systolic backflow of blood into the left atrium and pulmonary veins.' }
      ],
      quizQuestions: [
        {
          id: 'q-mv-1',
          question: 'The bicuspid valve in the human heart is also commonly known as the:',
          options: ['Mitral valve', 'Eustachian valve', 'Thebesian valve', 'Semilunar valve'],
          correctAnswer: 0,
          explanation: 'The bicuspid valve is commonly termed the mitral valve because its two cusps resemble a bishop’s ceremonial miter.',
          examTag: 'CBSE',
          difficulty: 'easy'
        }
      ],
      textbookCitation: {
        source: 'NCERT Class 11 Biology Section 18.2 & OpenStax A&P 2e Section 19.1',
        authors: 'NCERT & Betts et al.',
        edition: 'NCERT 2026-27 & OpenStax 2e',
        chapter: 'NCERT Ch 18.2',
        curriculumTags: ['CBSE Class 11', 'NEET Biology'],
        verificationStatus: 'VERIFIED_CURRICULUM',
        verificationDate: 'October 2026',
        license: 'CC BY 4.0'
      },
      defaultColor: '#f59e0b',
      pinPosition: [0.02, 0.48, 0.01],
      explodedOffset: [0.02, 0.02, -0.01],
      relatedStructureIds: ['heart-left-atrium', 'heart-left-ventricle']
    },

    // 8. Aortic Valve
    {
      id: 'heart-aortic-valve',
      meshNames: ['VH_M_aortic_valve'],
      name: 'Aortic Semilunar Valve',
      latinName: 'Valva aortae',
      hindiName: 'महाधमनी अर्धचंद्राकार कपाट (Mahadhamani Ardhchandrakar Kapaat)',
      pronunciation: 'ay-OR-tik SEM-ee-LOO-ner VALV',
      system: 'Cardiovascular System',
      location: 'At the root of the ascending aorta, superior to the aortic vestibule of the left ventricle.',
      grossDescription: 'Comprises three pocket-like semilunar cusps (right coronary, left coronary, and non-coronary / posterior cusp). Behind each cusp is an aortic sinus (Sinus of Valsalva) from which the left and right coronary arteries arise.',
      mainFunction: 'Opens during left ventricular systole when ventricular pressure exceeds aortic diastolic pressure (~80 mmHg); snaps shut when ventricular pressure falls during diastole, preventing backflow into the left ventricle and creating the second heart sound (dub/S2).',
      substructures: ['Right Coronary Cusp & Sinus', 'Left Coronary Cusp & Sinus', 'Non-Coronary Cusp & Sinus', 'Nodules of Arantius', 'Lunulae'],
      bloodSupply: 'Avascular cusps; sinuses bathe the openings of the right and left coronary arteries.',
      innervation: 'Autonomic mechanoreceptors in the aortic root.',
      schoolExplanation: 'NCERT Class 11 Biology notes that the openings of the right and the left ventricles into the pulmonary artery and the aorta respectively are provided with semilunar valves. These valves allow the flow of blood only in one direction.',
      advancedExplanation: 'In diastole, as blood recoils from the elastic aorta against the closed aortic valve cusps, it fills the Sinuses of Valsalva and surges directly into the coronary arteries. Thus, coronary perfusion of the myocardium occurs almost entirely during ventricular diastole.',
      learningObjectives: [
        'Understand why coronary artery perfusion occurs primarily during diastole.',
        'Correlate aortic valve closure with the second heart sound (S2 / dub).',
        'Identify the Sinuses of Valsalva giving origin to the coronary arteries.'
      ],
      importantTerminology: [
        { term: 'Second Heart Sound (S2)', definition: 'The "dub" sound produced by the vibration and closure of the aortic and pulmonary semilunar valves at the start of ventricular diastole.' },
        { term: 'Aortic Stenosis', definition: 'Abnormal narrowing of the aortic valve orifice, leading to left ventricular hypertrophy and angina.' }
      ],
      quizQuestions: [
        {
          id: 'q-av-1',
          question: 'The second heart sound ("dub" / S2) is produced by the closure of which valves?',
          options: [
            'Semilunar valves (Aortic and Pulmonary)',
            'Atrioventricular valves (Bicuspid and Tricuspid)',
            'Mitral and Eustachian valves',
            'Coronary sinus valve'
          ],
          correctAnswer: 0,
          explanation: 'Closure of the aortic and pulmonary semilunar valves at the onset of ventricular diastole produces the sharp, shorter second heart sound (dub).',
          examTag: 'NEET',
          difficulty: 'medium'
        }
      ],
      textbookCitation: {
        source: 'NCERT Class 11 Biology Chapter 18 & OpenStax A&P 2e Section 19.1',
        authors: 'NCERT & Betts et al.',
        edition: 'NCERT 2026-27 & OpenStax 2e',
        chapter: 'NCERT Ch 18.2 (Heart Sounds)',
        curriculumTags: ['CBSE Class 11', 'NEET Biology'],
        verificationStatus: 'VERIFIED_CURRICULUM',
        verificationDate: 'October 2026',
        license: 'CC BY 4.0'
      },
      defaultColor: '#10b981',
      pinPosition: [0.01, 0.50, 0.03],
      explodedOffset: [0, 0.03, 0],
      relatedStructureIds: ['heart-left-ventricle', 'heart-pulmonary-valve']
    },

    // 9. Pulmonary Valve
    {
      id: 'heart-pulmonary-valve',
      meshNames: ['VH_M_pulmonary_valve'],
      name: 'Pulmonary Semilunar Valve',
      latinName: 'Valva trunci pulmonalis',
      hindiName: 'फुफ्फुसीय अर्धचंद्राकार कपाट (Fupphusiya Ardhchandrakar Kapaat)',
      pronunciation: 'PUL-mo-nair-ee SEM-ee-LOO-ner VALV',
      system: 'Cardiovascular System',
      location: 'At the junction between the conus arteriosus of the right ventricle and the pulmonary trunk.',
      grossDescription: 'Consists of three semilunar cusps (anterior, left, right) each shaped like a half-moon pocket with a thickened central nodule and thin crescent-shaped lunula.',
      mainFunction: 'Opens during right ventricular systole (when ventricular pressure exceeds pulmonary arterial pressure ~10 mmHg); closes in diastole to prevent pulmonary blood from regurgitating into the right ventricle.',
      substructures: ['Anterior Cusp', 'Right Cusp', 'Left Cusp', 'Pulmonary Sinuses', 'Nodules of Pulmonary Valve'],
      bloodSupply: 'Avascular leaflets.',
      innervation: 'Endothelial and annular mechanoreceptors.',
      schoolExplanation: 'NCERT Class 10 & 11 describes the pulmonary semilunar valve as the one-way gate ensuring deoxygenated blood ejected from the right ventricle flows exclusively towards the pulmonary trunk and lungs, without returning backwards.',
      advancedExplanation: 'The pulmonary valve operates at substantially lower pressures than the aortic valve (peak systolic 25 mmHg vs 120 mmHg). Pulmonary valve closure is normally slightly delayed relative to aortic closure, producing physiological splitting of the S2 heart sound during inspiration.',
      learningObjectives: [
        'Differentiate the pulmonary valve from the aortic valve by pressure threshold.',
        'Explain physiological splitting of S2 during deep inspiration.',
        'Locate the pulmonary orifice anterior and superior to the aortic orifice.'
      ],
      importantTerminology: [
        { term: 'Physiological Splitting of S2', definition: 'The normal slight separation of aortic (A2) and pulmonary (P2) valve closure heard during inspiration due to increased venous return.' }
      ],
      quizQuestions: [
        {
          id: 'q-pv-1',
          question: 'Blood passing through the pulmonary semilunar valve enters which blood vessel?',
          options: ['Pulmonary Trunk', 'Aorta', 'Inferior Vena Cava', 'Pulmonary Vein'],
          correctAnswer: 0,
          explanation: 'The right ventricle pumps deoxygenated blood through the pulmonary semilunar valve into the pulmonary trunk, which then bifurcates into right and left pulmonary arteries.',
          examTag: 'CBSE',
          difficulty: 'easy'
        }
      ],
      textbookCitation: {
        source: 'NCERT Class 11 Biology Chapter 18 & OpenStax A&P 2e Section 19.1',
        authors: 'NCERT & Betts et al.',
        edition: 'NCERT 2026-27 & OpenStax 2e',
        chapter: 'NCERT Ch 18.2',
        curriculumTags: ['CBSE Class 11', 'NEET Biology'],
        verificationStatus: 'VERIFIED_CURRICULUM',
        verificationDate: 'October 2026',
        license: 'CC BY 4.0'
      },
      defaultColor: '#10b981',
      pinPosition: [0.02, 0.51, 0.04],
      explodedOffset: [0.01, 0.04, 0.01],
      relatedStructureIds: ['heart-right-ventricle', 'heart-aortic-valve']
    },

    // 10. Papillary Muscles (Anterior, Posterior, Medial, Anterolateral, Posteromedial)
    {
      id: 'heart-papillary-muscles',
      meshNames: [
        'VH_M_papillary_muscle_of_heart_anterior',
        'VH_M_papillary_muscle_of_heart_anterolateral',
        'VH_M_papillary_muscle_of_heart_medial',
        'VH_M_papillary_muscle_of_heart_posterior',
        'VH_M_papillary_muscle_of_heart_posteromedial'
      ],
      name: 'Papillary Muscles & Chordae Tendineae',
      latinName: 'Musculi papillares et chordae tendineae',
      hindiName: 'पैपिलरी मांसपेशियां और कॉर्डा टेंडिनी',
      pronunciation: 'PAP-ih-lair-ee MUS-uls',
      system: 'Cardiovascular System',
      location: 'Arise from the myocardial walls and interventricular septum of both right and left ventricles.',
      grossDescription: 'Nipple-like muscular projections of the myocardium. In the right ventricle there are three (anterior, posterior, septal); in the left ventricle there are two large ones (anterolateral and posteromedial). From their apices extend collagenous chordae tendineae attached to the valve cusps.',
      mainFunction: 'Contract synchronously with the ventricular myocardium during systole to generate tension on the chordae tendineae, keeping the AV valves (tricuspid and mitral) tightly shut against immense intraventricular pressures without permitting cusp prolapse.',
      substructures: ['Anterior Papillary Muscle (RV)', 'Posterior Papillary Muscle (RV)', 'Septal Papillary Muscle (RV)', 'Anterolateral Papillary Muscle (LV)', 'Posteromedial Papillary Muscle (LV)'],
      bloodSupply: 'Supplied directly by terminal perforating branches of the coronary arteries.',
      innervation: 'Endocardial Purkinje fiber network ensuring pre-ejection contraction.',
      schoolExplanation: 'Papillary muscles are specialized muscular pillars inside the ventricles connected to the valve flaps by tough thread-like chordae tendineae. They pull tight during heartbeat contractions so the valves cannot flip open backward into the atria.',
      advancedExplanation: 'Rupture of a papillary muscle (frequently the posteromedial papillary muscle following myocardial infarction of the posterior descending artery) causes acute, catastrophic mitral regurgitation and cardiogenic shock.',
      learningObjectives: [
        'Understand that papillary muscles DO NOT open the valves; they prevent valve cusps from being driven into the atria.',
        'Recognize the vulnerability of the posteromedial papillary muscle to ischemic necrosis.',
        'Trace the role of chordae tendineae in maintaining valvular competence.'
      ],
      importantTerminology: [
        { term: 'Papillary Rupture', definition: 'A critical complication of myocardial infarction where the papillary muscle shears, causing severe acute valve regurgitation.' }
      ],
      quizQuestions: [
        {
          id: 'q-pm-1',
          question: 'What is the exact functional role of the papillary muscles during ventricular systole?',
          options: [
            'They contract to pull on chordae tendineae, preventing AV valve cusps from prolapsing into the atria',
            'They actively pull the atrioventricular valves open to let blood enter the ventricles',
            'They pump blood directly into the coronary sinus',
            'They close the semilunar valves during ventricular ejection'
          ],
          correctAnswer: 0,
          explanation: 'Papillary muscles contract simultaneously with the ventricular myocardium to tether the chordae tendineae, preventing the high ventricular pressure from blowing the AV valves inside-out into the atria.',
          examTag: 'NEET',
          difficulty: 'hard'
        }
      ],
      textbookCitation: {
        source: 'NCERT Class 11 Biology Chapter 18 & Gray\'s Anatomy for Students 4th ed.',
        authors: 'NCERT & Drake et al.',
        edition: 'NCERT 2026-27 & Gray\'s 4th Edition',
        chapter: 'NCERT Ch 18.2 & Gray\'s Ch 3 (Thorax - Heart)',
        curriculumTags: ['CBSE Class 11', 'NEET Biology'],
        verificationStatus: 'PEER_REVIEWED',
        verificationDate: 'October 2026',
        license: 'CC BY 4.0'
      },
      defaultColor: '#c2410c',
      pinPosition: [0.03, 0.45, 0.06],
      explodedOffset: [0.01, -0.01, 0.01],
      relatedStructureIds: ['heart-tricuspid-valve', 'heart-mitral-valve', 'heart-left-ventricle', 'heart-right-ventricle']
    }
  ],
  guidedTourSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Systemic Venous Return & Right Atrium',
      structureId: 'heart-right-atrium',
      narration: 'Deoxygenated blood returns from the upper body via the Superior Vena Cava and from the lower body via the Inferior Vena Cava, entering the Right Atrium. The Sinoatrial (SA) node in the upper right atrial wall fires an electrical impulse initiates the heartbeat.',
      highlightMeshNames: ['VH_M_right_cardiac_atrium'],
      cameraPosition: [-0.18, 0.50, 0.16],
      cameraTarget: [-0.01, 0.47, 0.04],
      bloodOxygenation: 'deoxygenated',
      clinicalNote: 'Atrial Natriuretic Peptide (ANP) is synthesized by atrial myocytes in response to blood volume overload.'
    },
    {
      stepNumber: 2,
      title: 'Step 2: Tricuspid Valve & Right Ventricle',
      structureId: 'heart-tricuspid-valve',
      narration: 'As the right atrium contracts, blood flows across the three-cusp Tricuspid Valve into the Right Ventricle. The Right Ventricle then contracts, forcing blood upward through the pulmonary valve toward the lungs.',
      highlightMeshNames: ['VH_M_tricuspid_valve', 'VH_M_heart_right_ventricle'],
      cameraPosition: [-0.08, 0.43, 0.22],
      cameraTarget: [0.01, 0.44, 0.05],
      bloodOxygenation: 'deoxygenated',
      clinicalNote: 'Closure of the tricuspid and mitral valves produces the first heart sound (S1, "lub").'
    },
    {
      stepNumber: 3,
      title: 'Step 3: Pulmonary Valve & Gas Exchange in Lungs',
      structureId: 'heart-pulmonary-valve',
      narration: 'Deoxygenated blood is pumped across the Pulmonary Semilunar Valve into the Pulmonary Trunk and Arteries, entering the pulmonary capillary beds where carbon dioxide is released and oxygen is absorbed.',
      highlightMeshNames: ['VH_M_pulmonary_valve'],
      cameraPosition: [0.02, 0.58, 0.18],
      cameraTarget: [0.02, 0.50, 0.04],
      bloodOxygenation: 'deoxygenated',
      clinicalNote: 'Pulmonary arteries are the only postnatal arteries in the human body carrying deoxygenated blood.'
    },
    {
      stepNumber: 4,
      title: 'Step 4: Left Atrium Receiving Purified Blood',
      structureId: 'heart-left-atrium',
      narration: 'Oxygenated blood returns from the lungs through four pulmonary veins into the Left Atrium. The left atrium relaxes to fill with oxygen-rich blood, then contracts to propel blood past the Bicuspid (Mitral) valve.',
      highlightMeshNames: ['VH_M_left_cardiac_atrium'],
      cameraPosition: [0.02, 0.54, -0.18],
      cameraTarget: [0.01, 0.48, 0.01],
      bloodOxygenation: 'oxygenated',
      clinicalNote: 'Left atrial thrombi frequently form in the left atrial appendage in patients with atrial fibrillation.'
    },
    {
      stepNumber: 5,
      title: 'Step 5: High-Pressure Left Ventricle & Aorta',
      structureId: 'heart-left-ventricle',
      narration: 'The Left Ventricle, with its 3x thicker muscular myocardium, contracts with immense force (~120 mmHg) to eject oxygenated blood through the Aortic Valve into the systemic arterial tree, feeding the brain, coronary arteries, and all living tissues.',
      highlightMeshNames: ['VH_M_heart_left_ventricle', 'VH_M_aortic_valve', 'VH_M_interventricular_septum'],
      cameraPosition: [0.20, 0.45, 0.18],
      cameraTarget: [0.04, 0.46, 0.04],
      bloodOxygenation: 'oxygenated',
      clinicalNote: 'Aortic valve closure in early diastole drives blood into the left and right coronary arteries.'
    }
  ]
};
