import { OrganModelSpec } from '../types/anatomy';

export const NEURON_ORGAN_SPEC: OrganModelSpec = {
  id: 'organ-neuron',
  name: 'Multipolar Motor Neuron & Chemical Synapse (Nervous System)',
  system: 'Nervous / Neuro-Muscular System',
  classGrade: 'Class 10 & Class 11 (NCERT & NEET)',
  subject: 'Human Physiology / Biology',
  description: 'The neuron (nerve cell) is the structural and functional unit of neural tissue. It is an excitable cell specialized for receiving stimuli and conducting electrochemical impulses (action potentials) over long distances.',
  modelUrl: '/models/neuron.glb',
  modelFormat: 'procedural',
  initialCameraPosition: [0.0, 0.45, 0.38],
  initialTarget: [0.0, 0.42, 0.0],
  cameraPresets: {
    somaDendrites: {
      id: 'somaDendrites',
      label: 'Cell Body & Dendritic Arbor',
      position: [-0.25, 0.48, 0.2],
      target: [-0.08, 0.45, 0.0],
    },
    axonShaft: {
      id: 'axonShaft',
      label: 'Myelinated Axon & Nodes of Ranvier',
      position: [0.0, 0.42, 0.3],
      target: [0.0, 0.42, 0.0],
    },
    synapticTerminal: {
      id: 'synapticTerminal',
      label: 'Synaptic Bouton & Neurotransmitter Cleft',
      position: [0.25, 0.38, 0.22],
      target: [0.12, 0.38, 0.0],
    },
  },
  structures: [
    {
      id: 'neuron-soma-dendrites',
      meshNames: ['neuron_soma_mesh'],
      name: 'Cyton (Soma / Cell Body) & Dendrites',
      latinName: 'Perikaryon et Dendrita',
      hindiName: 'कोशिकाकाय एवं द्रुमाक्ष्य (Cyton & Dendrites)',
      pronunciation: 'SY-ton et den-DRY-tuh',
      system: 'Nervous System',
      location: 'Located in the grey matter of the brain, spinal cord, or peripheral ganglia.',
      grossDescription: 'Contains granular cytoplasm with typical cell organelles, a prominent spherical nucleus with a clear nucleolus, and characteristic basophilic granular bodies called Nissl\'s granules (clusters of rough endoplasmic reticulum and free ribosomes). Branched dendritic arbor extends outward.',
      mainFunction: 'Dendrites receive incoming synaptic chemical stimuli from other neurons and conduct graded electrical impulses towards the cell body. The soma integrates these postsynaptic potentials (EPSPs and IPSPs).',
      substructures: ['Nucleus & Nucleolus', 'Nissl\'s Granules', 'Neurofibrils', 'Dendritic Spines', 'Axon Hillock'],
      bloodSupply: 'Microvascular cerebral capillaries forming the blood-brain barrier (BBB).',
      innervation: 'Self-excitable electrogenic cell.',
      schoolExplanation: 'The cell body (cyton) is the brain of the neuron. The star-like branches spreading from it are called dendrites, which pick up messages from neighboring nerve cells like antennas.',
      advancedExplanation: 'Nissl\'s granules are intensely active sites of protein synthesis (producing enzymes and neurotransmitter precursors). Crucially, Nissl\'s granules are abundant in the cyton and dendrites, but completely absent from the axon and axon hillock.',
      learningObjectives: [
        'Identify Nissl\'s granules as aggregations of rough ER.',
        'Note the complete absence of Nissl\'s granules in the axon hillock.',
        'Distinguish graded dendritic potentials from all-or-none axonal action potentials.'
      ],
      importantTerminology: [
        { term: 'Nissl\'s Granules', definition: 'Basophilic masses of rough ER and ribosomes found in the cyton and dendrites, absent in axons.' },
        { term: 'Axon Hillock', definition: 'Conical trigger zone of the soma with high density of voltage-gated Na+ channels where action potentials initiate.' }
      ],
      quizQuestions: [
        {
          id: 'q-neuron-soma-1',
          question: 'Nissl\'s granules are characteristic bodies found in neurons made up of:',
          options: [
            'Golgi apparatus and lysosomes',
            'Rough endoplasmic reticulum and free ribosomes',
            'Mitochondria and centrioles',
            'Microfilaments and glycogen'
          ],
          correctAnswer: 1,
          explanation: 'Nissl\'s granules are prominent basophilic masses of rough endoplasmic reticulum (RER) and free ribosomes responsible for rapid protein synthesis in the cyton and dendrites.',
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
      defaultColor: '#eab308'
    },
    {
      id: 'neuron-myelin-nodes',
      meshNames: ['neuron_axon_mesh'],
      name: 'Axon, Myelin Sheath & Nodes of Ranvier',
      latinName: 'Axon, Stratum myelini et Nodi Ranvierii',
      hindiName: 'तंत्रिकाक्ष, मज्जा आच्छद एवं रैनवियर के नोड',
      pronunciation: 'AK-son my-eh-LIN',
      system: 'Nervous System',
      location: 'Extends from the axon hillock of the cyton to target tissues (sometimes exceeding 1 meter in length, e.g., sciatic nerve).',
      grossDescription: 'Long, slender cylindrical projection (axoplasm enclosed by axolemma). In myelinated fibers, enveloped by Schwann cells (PNS) or Oligodendrocytes (CNS) creating a lipid-rich insulating sheath interrupted at periodic intervals (1 mm) by uninsulated Nodes of Ranvier.',
      mainFunction: 'Conducts rapid action potentials away from the soma via saltatory conduction (jumping from one node of Ranvier to the next), increasing conduction velocity up to 120 m/s compared to 1 m/s in unmyelinated fibers.',
      substructures: ['Axolemma', 'Axoplasm (devoid of Nissl)', 'Schwann Cell Nuclei', 'Myelin Sheath Lipids', 'Nodes of Ranvier', 'Neurilemma'],
      bloodSupply: 'Vasa nervorum.',
      innervation: 'Impulse conductor.',
      schoolExplanation: 'The axon is the long electric cable of the nerve cell. It is coated in an insulating fatty layer (myelin sheath) like plastic around an electric wire, with small gaps (Nodes of Ranvier) that let electricity jump super fast.',
      advancedExplanation: 'Resting membrane potential is -70 mV maintained by 3 Na+ out / 2 K+ in ATPases. Voltage-gated Na+ channels are concentrated in massive density at the Nodes of Ranvier (>10,000/µm²), allowing regenerating inward sodium currents with minimal energy loss.',
      learningObjectives: [
        'Understand saltatory conduction across Nodes of Ranvier.',
        'Distinguish PNS Schwann cell myelination from CNS Oligodendrocyte myelination.',
        'Calculate membrane potential changes during depolarization (+30 mV) and repolarization.'
      ],
      importantTerminology: [
        { term: 'Saltatory Conduction', definition: 'The rapid mode of impulse propagation where depolarization leaps from one Node of Ranvier to the next.' },
        { term: 'Nodes of Ranvier', definition: 'Periodic unmyelinated gaps along an axon where voltage-gated ion channels are clustered.' }
      ],
      quizQuestions: [
        {
          id: 'q-neuron-axon-1',
          question: 'The rapid conduction of a nerve impulse jumping from node to node along a myelinated axon is called:',
          options: [
            'Continuous conduction',
            'Saltatory conduction',
            'Electrotonic conduction',
            'Synaptic conduction'
          ],
          correctAnswer: 1,
          explanation: 'In myelinated nerve fibers, the ionic flow occurs only at the Nodes of Ranvier, allowing the action potential to jump rapidly between nodes (saltatory conduction).',
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
      defaultColor: '#6366f1'
    },
    {
      id: 'neuron-synapse-terminal',
      meshNames: ['neuron_synapse_mesh'],
      name: 'Axon Terminal, Synaptic Knobs & Chemical Synapse',
      latinName: 'Bouton terminalis et Synapsis chimica',
      hindiName: 'अंत्य बटन एवं रासायनिक सिनेप्स (Synaptic Knobs & Cleft)',
      pronunciation: 'syn-AP-sis',
      system: 'Nervous System',
      location: 'Distal branched ends of the axon touching effector muscles, glands, or dendrites of postsynaptic neurons.',
      grossDescription: 'Terminal arborizations ending in bulb-like swellings called synaptic knobs or boutons. Each knob contains abundant mitochondria and thousands of membrane-bound synaptic vesicles filled with neurotransmitter chemicals (e.g., Acetylcholine).',
      mainFunction: 'Converts electrical action potentials into chemical messages: depolarizing wave triggers voltage-gated Ca2+ influx; Ca2+ stimulates exocytosis of neurotransmitters into the 20 nm synaptic cleft; molecules bind ligand-gated receptors on the postsynaptic membrane.',
      substructures: ['Presynaptic Membrane', 'Voltage-Gated Ca2+ Channels', 'Synaptic Vesicles (Acetylcholine)', 'Synaptic Cleft (approx 20 nm)', 'Postsynaptic Membrane', 'Ligand-Gated Ion Receptors'],
      bloodSupply: 'Local capillary microcirculation.',
      innervation: 'Site of unidirectional signal transmission.',
      schoolExplanation: 'At the end of the nerve wire are tiny bulbs called synaptic knobs. When an electric signal reaches here, it squirts out tiny chemical messengers into a microscopic gap (synaptic cleft) to alert the next cell.',
      advancedExplanation: 'Transmission is strictly unidirectional due to presence of vesicles only presynaptically. Unbound neurotransmitter is degraded (e.g. by Acetylcholinesterase) or recycled by reuptake transporters, ensuring millisecond-precise timing.',
      learningObjectives: [
        'Diagram the role of Ca2+ ions in synaptic vesicle fusion.',
        'Explain why transmission across chemical synapses is unidirectional.',
        'Contrast electrical synapses (gap junctions, faster, bidirectional) with chemical synapses (delay, modifiable).'
      ],
      importantTerminology: [
        { term: 'Synaptic Cleft', definition: 'The fluid-filled microscopic gap (approx 20 nm) separating pre- and postsynaptic membranes.' },
        { term: 'Acetylcholine (ACh)', definition: 'Common excitatory neurotransmitter at the neuromuscular junction and parasympathetic nervous system.' }
      ],
      quizQuestions: [
        {
          id: 'q-neuron-synapse-1',
          question: 'The influx of which ion into the synaptic knob triggers the exocytosis of neurotransmitter-filled vesicles into the synaptic cleft?',
          options: [
            'Sodium ions (Na+)',
            'Potassium ions (K+)',
            'Calcium ions (Ca2+)',
            'Chloride ions (Cl-)'
          ],
          correctAnswer: 2,
          explanation: 'Arrival of the action potential depolarizes the presynaptic membrane, opening voltage-gated Ca2+ channels. The rapid influx of Ca2+ causes synaptic vesicles to fuse with the presynaptic membrane and release neurotransmitters.',
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
      defaultColor: '#06b6d4'
    }
  ],
  guidedTourSteps: [
    {
      stepNumber: 1,
      title: 'Dendritic Input & Nissl Protein Factory',
      structureId: 'neuron-soma-dendrites',
      narration: 'Dendrites receive excitatory stimuli. Nissl granules (rough ER) continually produce neurotransmitter precursors and structural proteins. Graded potentials summate at the axon hillock.',
      highlightMeshNames: ['neuron_soma_mesh'],
      cameraPosition: [-0.22, 0.46, 0.24],
      cameraTarget: [-0.06, 0.44, 0.0]
    },
    {
      stepNumber: 2,
      title: 'Saltatory Conduction Across Ranvier Nodes',
      structureId: 'neuron-myelin-nodes',
      narration: 'Depolarization reaches threshold (-55 mV), firing an all-or-none action potential. The insulating myelin sheath forces sodium current to jump between Nodes of Ranvier at up to 120 meters per second.',
      highlightMeshNames: ['neuron_axon_mesh'],
      cameraPosition: [0.0, 0.42, 0.32],
      cameraTarget: [0.0, 0.42, 0.0]
    },
    {
      stepNumber: 3,
      title: 'Calcium Influx & Neurotransmitter Exocytosis',
      structureId: 'neuron-synapse-terminal',
      narration: 'Voltage-gated calcium channels open in the terminal bouton. Ca2+ drives vesicle fusion, spilling acetylcholine across the 20nm synaptic cleft to open ligand-gated sodium channels on the target effector.',
      highlightMeshNames: ['neuron_synapse_mesh'],
      cameraPosition: [0.22, 0.4, 0.24],
      cameraTarget: [0.1, 0.38, 0.0]
    }
  ]
};
