import { OrganModelSpec } from '../types/anatomy';

export const BRAIN_ORGAN_SPEC: OrganModelSpec = {
  id: 'organ-brain',
  name: 'Human Brain (Central Nervous System)',
  system: 'Nervous System & Neural Control',
  classGrade: 'Class 10 & Class 11 (NCERT & NEET)',
  subject: 'Human Physiology / Biology',
  description: 'The human brain is the central information processing organ of the body, acting as the command and control system. It is protected inside the bony cranium and three cranial meninges (dura mater, arachnoid mater, pia mater), cushioned by cerebrospinal fluid (CSF).',
  modelUrl: '',
  modelFormat: 'procedural',
  initialCameraPosition: [0, 0.4, 2.8],
  initialTarget: [0, 0, 0],
  cameraPresets: {
    lateral: {
      id: 'lateral',
      label: 'Lateral Hemisphere View',
      position: [2.5, 0.3, 1.2],
      target: [0, 0, 0]
    },
    superior: {
      id: 'superior',
      label: 'Superior (Cerebral Cortical) View',
      position: [0, 3.0, 0.1],
      target: [0, 0, 0]
    },
    sagittal: {
      id: 'sagittal',
      label: 'Mid-Sagittal Cross-Section View',
      position: [0, 0.2, -2.6],
      target: [0, 0, 0]
    },
    brainstem: {
      id: 'brainstem',
      label: 'Inferior / Brainstem View',
      position: [0, -2.2, 1.8],
      target: [0, -0.4, 0]
    }
  },
  structures: [
    {
      id: 'brain-frontal-lobe',
      meshNames: ['mesh_frontal_lobe'],
      name: 'Frontal Lobe (Cerebral Cortex)',
      latinName: 'Lobus frontalis',
      hindiName: 'अग्र पालि (Agra Paali)',
      pronunciation: 'LOH-bus fron-TAY-lis',
      system: 'Central Nervous System',
      location: 'Anterior portion of each cerebral hemisphere, rostral to the central sulcus of Rolando and superior to the lateral sulcus of Sylvius.',
      grossDescription: 'Largest of the four cerebral lobes (occupies ~33% of the neocortex). Contains prominent folded gyri: precentral gyrus (primary motor cortex, Brodmann area 4), premotor cortex, and Broca\'s motor speech area (Brodmann 44/45).',
      mainFunction: 'Executive function, abstract reasoning, future planning, voluntary motor control, decision making, emotional inhibition, personality expression, and motor speech production (Broca\'s area).',
      substructures: ['Primary Motor Cortex (Brodmann 4)', 'Prefrontal Cortex', 'Broca\'s Motor Speech Area', 'Frontal Eye Fields'],
      bloodSupply: 'Anterior Cerebral Artery (ACA) for medial surface; Middle Cerebral Artery (MCA) for lateral convexity.',
      innervation: 'Cortical associative, commissural, and projection fibers.',
      schoolExplanation: 'In NCERT Class 10 (Chapter 7: Control and Coordination) and Class 11 (Chapter 21: Neural Control and Coordination), the cerebrum is the major part of the forebrain. The frontal region governs conscious thought, memory, voluntary actions, and intelligence.',
      advancedExplanation: 'Phineas Gage famously illustrated prefrontal function after an iron rod damaged his orbitofrontal cortex, transforming him from conscientious to irreverent. Broca\'s aphasia causes expressive non-fluent speech with intact comprehension.',
      learningObjectives: [
        'Locate the primary motor cortex on the precentral gyrus.',
        'Distinguish Broca’s motor speech area from Wernicke’s sensory area.',
        'Identify the executive roles of the prefrontal cortex.'
      ],
      importantTerminology: [
        { term: 'Broca\'s Area', definition: 'The motor speech region located in the left inferior frontal gyrus coordinating tongue, vocal cords, and larynx motions for articulation.' },
        { term: 'Central Sulcus', definition: 'The deep groove separating the frontal lobe from the parietal lobe.' }
      ],
      quizQuestions: [
        {
          id: 'q-fl-1',
          question: 'Broca\'s motor speech area is anatomically situated in which cerebral lobe?',
          options: ['Frontal lobe', 'Temporal lobe', 'Occipital lobe', 'Parietal lobe'],
          correctAnswer: 0,
          explanation: 'Broca\'s motor speech area is located in the posterior part of the inferior frontal gyrus of the dominant (usually left) hemisphere.',
          examTag: 'NEET',
          difficulty: 'medium'
        }
      ],
      textbookCitation: {
        source: 'NCERT Class 11 Biology Chapter 21 & OpenStax A&P 2e Section 13.2',
        authors: 'NCERT & Betts et al.',
        edition: 'NCERT 2026-27 & OpenStax 2e',
        chapter: 'NCERT Ch 21 (Human Brain) & OpenStax Ch 13.2',
        curriculumTags: ['CBSE Class 10', 'CBSE Class 11', 'NEET Biology'],
        verificationStatus: 'VERIFIED_CURRICULUM',
        verificationDate: 'October 2026',
        license: 'CC BY 4.0'
      },
      defaultColor: '#8b5cf6',
      pinPosition: [0.3, 0.4, 0.8],
      explodedOffset: [0.2, 0.1, 0.3],
      relatedStructureIds: ['brain-parietal-lobe', 'brain-temporal-lobe']
    },
    {
      id: 'brain-cerebellum',
      meshNames: ['mesh_cerebellum'],
      name: 'Cerebellum (Little Brain)',
      latinName: 'Cerebellum',
      hindiName: 'अनुमस्तिष्क (Anumastishk)',
      pronunciation: 'sair-uh-BEL-um',
      system: 'Hindbrain / Central Nervous System',
      location: 'Dorsal to the pons and medulla oblongata, occupying the posterior cranial fossa beneath the tentorium cerebelli.',
      grossDescription: 'Consists of two lateral cerebellar hemispheres connected by a median vermis. Features densely packed, parallel transverse fissures forming folia. Its internal arbor vitae ("tree of life") white matter branches into deep cerebellar nuclei (dentate, emboliform, globose, fastigial). Contains ~50% of all neurons in the human brain.',
      mainFunction: 'Coordination of complex voluntary motor movements, precision timing, calibration of force, maintaining somatic equilibrium, balance, and motor learning (e.g., bicycling, playing piano). Does NOT initiate movement.',
      substructures: ['Cerebellar Vermis', 'Lateral Hemispheres', 'Arbor Vitae', 'Purkinje Cell Layer', 'Dentate Nucleus'],
      bloodSupply: 'Superior Cerebellar Artery (SCA), Anterior Inferior Cerebellar Artery (AICA), Posterior Inferior Cerebellar Artery (PICA).',
      innervation: 'Spinocerebellar, vestibulocerebellar, and corticopontocerebellar fiber pathways via superior, middle, and inferior cerebellar peduncles.',
      schoolExplanation: 'In NCERT Class 10 and 11, the cerebellum is the hindbrain structure responsible for maintaining posture, body equilibrium, and the precision of voluntary motor actions, such as walking in a straight line or riding a bicycle.',
      advancedExplanation: 'Alcohol intoxication specifically depresses cerebellar Purkinje cell functioning, causing cerebellar ataxia, dysmetria (past-pointing), dysdiadochokinesia (inability to perform rapid alternating movements), and intention tremor.',
      learningObjectives: [
        'Recognize the cerebellum as the master coordinator (not initiator) of voluntary movement.',
        'Locate the arbor vitae on cross-section.',
        'Explain why cerebellar damage leads to ataxia and loss of equilibrium.'
      ],
      importantTerminology: [
        { term: 'Arbor Vitae', definition: 'The tree-like branching pattern of cerebellar white matter revealed on mid-sagittal section.' },
        { term: 'Ataxia', definition: 'Lack of voluntary coordination of muscle movements, characteristic of cerebellar injury or intoxication.' }
      ],
      quizQuestions: [
        {
          id: 'q-cb-1',
          question: 'Which part of the human brain is directly responsible for maintaining body equilibrium, posture, and precision of voluntary movements?',
          options: ['Cerebellum', 'Corpus callosum', 'Hypothalamus', 'Medulla oblongata'],
          correctAnswer: 0,
          explanation: 'As per NCERT Class 10 Section 7.1.2 and Class 11 Section 21.4, the cerebellum coordinates precision movements and maintains body balance and posture.',
          examTag: 'CBSE',
          difficulty: 'easy'
        }
      ],
      textbookCitation: {
        source: 'NCERT Class 11 Biology Section 21.4 & OpenStax A&P 2e Section 13.2',
        authors: 'NCERT & Betts et al.',
        edition: 'NCERT 2026-27 & OpenStax 2e',
        chapter: 'NCERT Ch 21.4 (Hindbrain)',
        curriculumTags: ['CBSE Class 10', 'CBSE Class 11', 'NEET Biology'],
        verificationStatus: 'VERIFIED_CURRICULUM',
        verificationDate: 'October 2026',
        license: 'CC BY 4.0'
      },
      defaultColor: '#ec4899',
      pinPosition: [0, -0.4, -0.9],
      explodedOffset: [0, -0.2, -0.3],
      relatedStructureIds: ['brain-medulla', 'brain-frontal-lobe']
    },
    {
      id: 'brain-medulla',
      meshNames: ['mesh_medulla'],
      name: 'Medulla Oblongata',
      latinName: 'Medulla oblongata',
      hindiName: 'मेडुला ऑबलोंगाटा (Medulla Oblongata)',
      pronunciation: 'meh-DUH-lah ob-lon-GAH-tuh',
      system: 'Brainstem / Hindbrain',
      location: 'Most inferior component of the brainstem, transitioning into the spinal cord at the level of the foramen magnum.',
      grossDescription: 'Conical stem measuring ~3 cm. Features anterior pyramids containing the corticospinal motor tracts that undergo pyramidal decussation, olives containing inferior olivary nuclei, and houses nuclei of cranial nerves IX, X, XI, and XII.',
      mainFunction: 'Houses autonomous vital autonomic reflex centers: Cardiovascular Center (cardiac rate and vasomotor tone), Respiratory Rhythmicity Center (dorsal & ventral respiratory groups), and non-vital reflex centers for vomiting, swallowing, coughing, sneezing, and salivation.',
      substructures: ['Pyramids & Pyramidal Decussation', 'Cardiovascular Regulating Center', 'Respiratory Rhythmicity Center', 'Solitary Tract Nucleus'],
      bloodSupply: 'Vertebral arteries and Posterior Inferior Cerebellar Artery (PICA).',
      innervation: 'Gives rise to Vagus (CN X), Glossopharyngeal (CN IX), Accessory (CN XI), and Hypoglossal (CN XII) nerves.',
      schoolExplanation: 'NCERT Class 10 & 11 Biology states that the medulla of the brain controls involuntary actions like blood pressure, salivation, heartbeat, and vomiting. Injury to the medulla is immediately fatal.',
      advancedExplanation: 'The central chemoreceptors on the ventrolateral surface of the medulla sense pH drops in the cerebrospinal fluid caused by hypercapnia (high arterial PCO2), driving hyperventilation to restore physiological pH.',
      learningObjectives: [
        'Identify the vital involuntary autonomic reflex centers residing in the medulla.',
        'Explain pyramidal decussation explaining why the left brain controls the right body.',
        'State why medullary trauma causes instantaneous cardiopulmonary arrest.'
      ],
      importantTerminology: [
        { term: 'Pyramidal Decussation', definition: 'The crossover of ~90% of corticospinal motor fibers in the lower medulla, establishing contralateral motor control.' }
      ],
      quizQuestions: [
        {
          id: 'q-med-brain-1',
          question: 'The respiratory rhythm center and cardiovascular centers governing involuntary heartbeat and breathing are situated in the:',
          options: ['Medulla oblongata', 'Cerebrum', 'Cerebellum', 'Thalamus'],
          correctAnswer: 0,
          explanation: 'NCERT Class 11 Biology Ch 17 & 21 explicitly confirms the respiratory rhythm center and vasomotor centers reside in the medulla oblongata.',
          examTag: 'NEET',
          difficulty: 'medium'
        }
      ],
      textbookCitation: {
        source: 'NCERT Class 11 Biology Section 21.4 & OpenStax A&P 2e Section 13.2',
        authors: 'NCERT & Betts et al.',
        edition: 'NCERT 2026-27 & OpenStax 2e',
        chapter: 'NCERT Ch 21.4 & Ch 17.5 (Regulation of Respiration)',
        curriculumTags: ['CBSE Class 10', 'CBSE Class 11', 'NEET Biology'],
        verificationStatus: 'VERIFIED_CURRICULUM',
        verificationDate: 'October 2026',
        license: 'CC BY 4.0'
      },
      defaultColor: '#06b6d4',
      pinPosition: [0, -0.7, -0.3],
      explodedOffset: [0, -0.3, 0],
      relatedStructureIds: ['brain-cerebellum']
    }
  ],
  guidedTourSteps: [
    {
      stepNumber: 1,
      title: 'Step 1: Cerebral Hemispheres & Frontal Lobe',
      structureId: 'brain-frontal-lobe',
      narration: 'The Cerebrum makes up 85% of the brain’s mass. Its heavily folded neocortex maximizes surface area, accommodating over 16 billion cortical neurons. The Frontal Lobe directs planning, speech (Broca\'s area), and motor control.',
      highlightMeshNames: ['mesh_frontal_lobe'],
      cameraPosition: [1.8, 1.2, 1.8],
      cameraTarget: [0, 0, 0]
    },
    {
      stepNumber: 2,
      title: 'Step 2: Cerebellum & Precision Coordination',
      structureId: 'brain-cerebellum',
      narration: 'Situated under the occipital lobes, the Cerebellum contains more than half the brain\'s total neurons. It continuously compares planned motor commands from the motor cortex with sensory feedback from muscle spindles to maintain smooth equilibrium and precision.',
      highlightMeshNames: ['mesh_cerebellum'],
      cameraPosition: [1.6, -0.4, -1.8],
      cameraTarget: [0, -0.2, -0.5]
    },
    {
      stepNumber: 3,
      title: 'Step 3: Brainstem & Medulla Oblongata',
      structureId: 'brain-medulla',
      narration: 'The Medulla Oblongata connects the brain to the spinal cord. It controls involuntary reflexes essential to life: arterial blood pressure, heart rate, respiration rate, coughing, and vomiting reflexes.',
      highlightMeshNames: ['mesh_medulla'],
      cameraPosition: [0, -1.2, 1.6],
      cameraTarget: [0, -0.5, 0]
    }
  ]
};
