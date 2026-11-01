import { OrganModelSpec } from '../types/anatomy';

export const EAR_ORGAN_SPEC: OrganModelSpec = {
  id: 'organ-ear',
  name: 'Human Ear & Auditory Vestibular Apparatus',
  system: 'Sensory / Auditory & Vestibular System',
  classGrade: 'Class 10 & Class 11 (NCERT & NEET)',
  subject: 'Human Physiology / Biology',
  description: 'The human ear performs two distinct sensory functions: hearing (audition) and maintenance of body balance and equilibrium. It is anatomically divided into the Outer, Middle, and Inner Ear encased within the temporal bone.',
  modelUrl: '/models/ear.glb',
  modelFormat: 'procedural',
  initialCameraPosition: [0.0, 0.44, 0.35],
  initialTarget: [0.0, 0.42, 0.0],
  cameraPresets: {
    lateralPinna: {
      id: 'lateralPinna',
      label: 'Outer Ear & Pinna',
      position: [0.28, 0.44, 0.15],
      target: [0.0, 0.42, 0.0],
    },
    middleOssicles: {
      id: 'middleOssicles',
      label: 'Middle Ear & Ossicles',
      position: [0.0, 0.45, 0.28],
      target: [0.0, 0.42, 0.0],
    },
    innerCochlea: {
      id: 'innerCochlea',
      label: 'Inner Ear (Cochlea & Canals)',
      position: [-0.25, 0.42, 0.18],
      target: [0.0, 0.42, 0.0],
    },
  },
  structures: [
    {
      id: 'ear-outer-pinna',
      meshNames: ['ear_pinna_mesh'],
      name: 'External Ear (Pinna & External Acoustic Meatus)',
      latinName: 'Auris externa et meatus acusticus',
      hindiName: 'कर्ण पल्लव एवं बाह्य कर्ण कुहर (Pinna & Auditory Canal)',
      pronunciation: 'AW-ris ek-STER-nuh',
      system: 'Sensory System',
      location: 'Lateral aspect of the head, leading into the petrous part of the temporal bone.',
      grossDescription: 'Composed of elastic cartilage covered by skin (pinna/auricle) that funnels into an S-shaped cartilaginous and bony tube (2.5 cm long) containing ceruminous glands and fine hairs.',
      mainFunction: 'Collects sound vibrations from the atmosphere and directs them inwards to the tympanic membrane. Wax (cerumen) traps foreign particles and microbes.',
      substructures: ['Helix & Antihelix', 'Tragus & Antitragus', 'Lobule', 'Ceruminous Glands'],
      bloodSupply: 'Superficial temporal and posterior auricular arteries.',
      innervation: 'Auriculotemporal nerve (CN V3), Great auricular nerve (C2, C3), and Vagus (CN X) auricular branch.',
      schoolExplanation: 'The outer ear includes the flap (pinna) that catches sound waves like a funnel and directs them through the ear canal toward the eardrum.',
      advancedExplanation: 'The acoustic resonator properties of the external acoustic meatus naturally amplify frequencies between 2 kHz and 4 kHz, which matches human speech consonants vital for intelligibility.',
      learningObjectives: [
        'Understand how the pinna concentrates ambient sonic waves.',
        'Describe the protective role of cerumen and hairs in the canal.',
        'Relate resonance frequency of the canal to human vocal range.'
      ],
      importantTerminology: [
        { term: 'Cerumen', definition: 'Earwax produced by modified apocrine sweat glands in the external acoustic meatus.' },
        { term: 'Meatus', definition: 'A canal or passage in the temporal bone.' }
      ],
      quizQuestions: [
        {
          id: 'q-ear-pinna-1',
          question: 'The external ear canal contains which type of modified sweat glands producing earwax?',
          options: [
            'Sebaceous glands',
            'Ceruminous glands',
            'Eccrine glands',
            'Meibomian glands'
          ],
          correctAnswer: 1,
          explanation: 'Ceruminous glands are specialized apocrine sweat glands in the subcutaneous tissue of the cartilaginous auditory meatus that produce protective earwax (cerumen).',
          examTag: 'NEET',
          difficulty: 'easy'
        }
      ],
      textbookCitation: {
        source: 'NCERT Biology Class 11, Chapter 21',
        authors: 'NCERT Biology Board',
        edition: '2026-27 CBSE Rationalised',
        chapter: 'Neural Control and Coordination',
        curriculumTags: ['CBSE-11', 'NEET-UG'],
        verificationStatus: 'VERIFIED_CURRICULUM',
        verificationDate: '2026-02-27',
        license: 'NCERT'
      },
      defaultColor: '#f59e0b'
    },
    {
      id: 'ear-middle-ossicles',
      meshNames: ['ear_ossicles_mesh'],
      name: 'Middle Ear & Auditory Ossicles (Malleus, Incus, Stapes)',
      latinName: 'Auris media et Ossicula auditus',
      hindiName: 'मध्य कर्ण एवं कर्ण अस्थिकाएं (Malleus, Incus, Stapes)',
      pronunciation: 'OS-ih-kuhl',
      system: 'Sensory System',
      location: 'Air-filled tympanic cavity inside the temporal bone between the eardrum and the oval window.',
      grossDescription: 'Features the tympanic membrane (eardrum) and three minuscule articulated bones: Malleus (hammer), Incus (anvil), and Stapes (stirrup - smallest bone in the human body). Communicates with the nasopharynx via the Eustachian tube.',
      mainFunction: 'Amplifies sound pressure waves approx 20-fold through hydraulic mechanical leverage (large tympanic area vs tiny stapes footplate area) and transmits vibrations to the oval window of the perilymph.',
      substructures: ['Tympanic Membrane', 'Malleus', 'Incus', 'Stapes', 'Eustachian (Pharyngotympanic) Tube', 'Tensor Tympani & Stapedius Muscles'],
      bloodSupply: 'Anterior and posterior tympanic branches of maxillary and stylomastoid arteries.',
      innervation: 'Tympanic plexus from Glossopharyngeal nerve (CN IX); Chorda tympani (CN VII).',
      schoolExplanation: 'The middle ear acts as a mechanical amplifier. Sound hits the eardrum, which moves three tiny bones (hammer, anvil, and stirrup) to strongly push against the fluid in the inner ear.',
      advancedExplanation: 'The Eustachian tube equalizes air pressure between the middle ear and the atmosphere. The stapedius muscle contracts reflexively during loud sounds (acoustic attenuation reflex) to prevent inner ear acoustic trauma.',
      learningObjectives: [
        'Identify Malleus, Incus, and Stapes and their mechanical arrangement.',
        'Calculate impedance matching leverage ratio from eardrum to oval window.',
        'Explain how the Eustachian tube equalizes pressure during swallowing or yawning.'
      ],
      importantTerminology: [
        { term: 'Stapes', definition: 'The smallest bone in the human body that articulates with the oval window of the inner ear.' },
        { term: 'Eustachian Tube', definition: 'Passageway equalizing atmospheric pressure on both sides of the tympanic membrane.' }
      ],
      quizQuestions: [
        {
          id: 'q-ear-ossicles-1',
          question: 'In the middle ear of humans, the correct sequence of ear ossicles from outer to inner is:',
          options: [
            'Incus → Malleus → Stapes',
            'Malleus → Incus → Stapes',
            'Stapes → Incus → Malleus',
            'Malleus → Stapes → Incus'
          ],
          correctAnswer: 1,
          explanation: 'The three auditory ossicles are arranged from the tympanic membrane inward as: Malleus (hammer) → Incus (anvil) → Stapes (stirrup) which fits into the oval window.',
          examTag: 'NEET',
          difficulty: 'easy'
        }
      ],
      textbookCitation: {
        source: 'NCERT Biology Class 11, Chapter 21',
        authors: 'NCERT',
        edition: '2026-27 Rationalised Edition',
        chapter: 'Neural Control and Coordination',
        curriculumTags: ['CBSE-11', 'NEET-UG'],
        verificationStatus: 'VERIFIED_CURRICULUM',
        verificationDate: '2026-02-27',
        license: 'NCERT'
      },
      defaultColor: '#38bdf8'
    },
    {
      id: 'ear-inner-cochlea',
      meshNames: ['ear_cochlea_mesh'],
      name: 'Inner Ear (Cochlea, Organ of Corti & Vestibular Labyrinth)',
      latinName: 'Labyrinthus membranaceus et Cochlea',
      hindiName: 'कर्णावर्त एवं अंतःकर्ण (Cochlea & Balance Canals)',
      pronunciation: 'KOK-lee-uh',
      system: 'Sensory System',
      location: 'Embedded deep within the petrous temporal bone.',
      grossDescription: 'Fluid-filled bony and membranous labyrinth consisting of the coiled, snail-shell-like Cochlea (2.75 turns) and the Vestibular apparatus (three Semicircular canals, Utricle, and Saccule).',
      mainFunction: 'Transduces fluid mechanical waves into electrical action potentials via hair cells in the Organ of Corti for hearing. Cristae ampullaris and maculae detect angular and linear acceleration for balance.',
      substructures: ['Scala Vestibuli (Perilymph)', 'Scala Media (Endolymph)', 'Scala Tympani (Perilymph)', 'Basilar Membrane', 'Organ of Corti', 'Tectorial Membrane', 'Hair Cells (Stereocilia)', 'Semicircular Canals & Ampullae', 'Vestibulocochlear Nerve (CN VIII)'],
      bloodSupply: 'Labyrinthine artery (internal auditory artery from AICA).',
      innervation: 'Vestibulocochlear nerve (Cranial Nerve VIII).',
      schoolExplanation: 'The cochlea is shaped like a snail shell filled with liquid. Waves in this liquid bend microscopic hair cells on the basilar membrane, which send electric signals down the auditory nerve to the brain.',
      advancedExplanation: 'High frequency sounds vibrate the narrow, stiff base of the basilar membrane near the oval window; low frequency sounds travel to the wide, flexible apex (tonotopic organization). Bending of stereocilia opens mechanically-gated K+ channels depolarizing hair cells.',
      learningObjectives: [
        'Differentiate perilymph (high Na+) and endolymph (high K+).',
        'Explain the tonotopic map along the basilar membrane.',
        'Recognize the role of semicircular canals in rotational balance and otolith organs in gravity detection.'
      ],
      importantTerminology: [
        { term: 'Organ of Corti', definition: 'The receptor organ for hearing situated on the basilar membrane containing sensory hair cells.' },
        { term: 'Tonotopy', definition: 'The spatial arrangement of where different sound frequencies are detected along the cochlear coil.' }
      ],
      quizQuestions: [
        {
          id: 'q-ear-cochlea-1',
          question: 'The sensory organ for hearing located upon the basilar membrane in the inner ear is known as the:',
          options: [
            'Macula',
            'Crista ampullaris',
            'Organ of Corti',
            'Otolith membrane'
          ],
          correctAnswer: 2,
          explanation: 'The Organ of Corti is the microscopic structure located on the basilar membrane that contains auditory hair cells with stereocilia beneath the tectorial membrane.',
          examTag: 'NEET',
          difficulty: 'medium'
        }
      ],
      textbookCitation: {
        source: 'NCERT Biology Class 11, Chapter 21',
        authors: 'NCERT',
        edition: '2026-27 Rationalised Edition',
        chapter: 'Neural Control and Coordination',
        curriculumTags: ['CBSE-11', 'NEET-UG'],
        verificationStatus: 'VERIFIED_CURRICULUM',
        verificationDate: '2026-02-27',
        license: 'NCERT'
      },
      defaultColor: '#10b981'
    }
  ],
  guidedTourSteps: [
    {
      stepNumber: 1,
      title: 'Sound Wave Funneling & Tympanic Resonator',
      structureId: 'ear-outer-pinna',
      narration: 'Acoustic sound waves are collected by the cartilage folds of the pinna and channeled through the external auditory meatus to strike the elastic tympanic membrane.',
      highlightMeshNames: ['ear_pinna_mesh'],
      cameraPosition: [0.26, 0.46, 0.22],
      cameraTarget: [0.0, 0.42, 0.0]
    },
    {
      stepNumber: 2,
      title: 'Ossicular Lever Multiplication',
      structureId: 'ear-middle-ossicles',
      narration: 'The malleus, incus, and stapes act as a mechanical lever system, amplifying the pressure 20-fold from the larger tympanum onto the smaller footprint of the oval window.',
      highlightMeshNames: ['ear_ossicles_mesh'],
      cameraPosition: [0.05, 0.45, 0.26],
      cameraTarget: [0.0, 0.42, 0.0]
    },
    {
      stepNumber: 3,
      title: 'Cochlear Tonotopy & Mechanoelectrical Transduction',
      structureId: 'ear-inner-cochlea',
      narration: 'Perilymph waves displace the basilar membrane according to frequency pitch. Hair cells shear against the tectorial membrane, generating nerve impulses through Cranial Nerve VIII to the auditory cortex.',
      highlightMeshNames: ['ear_cochlea_mesh'],
      cameraPosition: [-0.22, 0.44, 0.22],
      cameraTarget: [0.0, 0.42, 0.0]
    }
  ]
};
