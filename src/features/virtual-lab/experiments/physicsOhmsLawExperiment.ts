import { PracticalExperiment } from '../types/laboratory';

export const PHYSICS_OHMS_LAW_EXPERIMENT: PracticalExperiment = {
  id: 'c10_ohms_law_circuit',
  title: 'Verification of Ohm’s Law & Resistance per Unit Length of Nichrome Wire',
  subject: 'Physics',
  classGrade: 'Class 10',
  chapter: 'Electricity',
  examTags: ['cbse', 'jee_main', 'neet', 'cuet'],
  estimatedDurationMinutes: 30,
  has3D: true,
  hasCalculations: true,
  learningObjectives: [
    'Assemble an electrical circuit correctly: connect the DC ammeter strictly in series and voltmeter in parallel across the resistance wire.',
    'Verify that the electric current (I) flowing through a metallic conductor is directly proportional to the potential difference (V) across its ends (V ∝ I).',
    'Plot an experimental V versus I graph, observe linear behavior, and calculate resistance R from the inverse slope (or direct slope).',
    'Determine the resistance per unit length (Ω/m) of a nichrome wire and compute experimental percentage error.',
    'Understand common experimental errors: heating effects from keeping the key continuously closed, loose contact resistance, and zero error in meters.'
  ],
  prerequisites: [
    'Concept of electric charge, potential difference in volts, and electric current in amperes.',
    'Knowledge of circuit symbols: cell/battery, plug key, variable resistance (rheostat), ammeter, and voltmeter.',
    'Understanding of internal resistance of meters: ideal ammeter has zero resistance; ideal voltmeter has infinite resistance.'
  ],
  scientificPrinciple: `Ohm’s Law states that at constant temperature and other physical conditions, the electric current (I) flowing through a metallic conductor is directly proportional to the potential difference (V) maintained across its ends:
V \\propto I \\implies V = I \\cdot R
where R is the electrical resistance of the conductor in ohms (Ω).
When potential difference (V) is plotted on the vertical y-axis against current (I) on the horizontal x-axis, the resulting curve is a straight line passing through the origin:
\\text{Slope } m = \\frac{\\Delta V}{\\Delta I} = R
Resistance of a uniform cylindrical wire of length L, cross-sectional area A, and resistivity ρ is given by:
R = \\rho \\frac{L}{A} \\implies \\text{Resistance per unit length } = \\frac{R}{L} = \\frac{\\rho}{A}`,
  curriculumReference: 'NCERT Class 10 Science Chapter 12 (Electricity) & CBSE Practical Manual Physics Experiment 2',
  apparatus: [
    {
      id: 'dc_power_supply',
      name: 'Regulated DC Battery Eliminator / Power Supply (0–12 V)',
      category: 'circuit',
      description: 'Stabilized variable direct-current laboratory supply with voltage regulation knob and overload trip.',
      purpose: 'Providing steady driving electromotive force (EMF) without electrochemical polarization.',
      safetyNote: 'Do not exceed 10V with small resistors to prevent wire overheating.'
    },
    {
      id: 'voltmeter',
      name: 'Moving-Coil DC Voltmeter (0–3 V, Least Count 0.05 V)',
      category: 'instrument',
      description: 'High-resistance moving-coil instrument connected in parallel across the test resistor.',
      purpose: 'Measuring potential drop across the wire without drawing significant current.'
    },
    {
      id: 'ammeter',
      name: 'Moving-Coil DC Ammeter (0–1.5 A, Least Count 0.02 A)',
      category: 'instrument',
      description: 'Low-resistance instrument connected in series with the load.',
      purpose: 'Measuring the total current flowing through the circuit branch.'
    },
    {
      id: 'rheostat',
      name: 'Sliding Contact Wire-Wound Rheostat (0–20 Ω, 2 A)',
      category: 'circuit',
      description: 'Eureka or constantan resistance wire wound on an insulating porcelain cylinder with brass sliding contact.',
      purpose: 'Varying circuit resistance smoothly to record multiple current settings.'
    },
    {
      id: 'resistance_wire',
      name: 'Nichrome Resistance Wire on Wooden Base (L = 100 cm)',
      category: 'circuit',
      description: 'Standard 28 SWG nichrome wire (80% Ni, 20% Cr) clamped between brass binding terminals.',
      purpose: 'Serving as the ohmic test conductor of known length.'
    },
    {
      id: 'plug_key',
      name: 'Single-Pole Brass Plug Key with Ebonite Top',
      category: 'circuit',
      description: 'High-conductivity brass block with conical plug.',
      purpose: 'Opening the circuit between readings to prevent heating of the resistance wire.'
    }
  ],
  procedureSteps: [
    {
      stepNumber: 1,
      title: 'Inspect Meters & Record Least Count and Zero Errors',
      actionPrompt: 'Examine ammeter and voltmeter dials. Determine the least count and note any mechanical zero error.',
      apparatusUsed: ['DC Ammeter', 'DC Voltmeter'],
      scientificReason: 'Accurate measurements require subtracting zero error: Observed Reading = Measured - Zero Error.',
      expectedObservation: 'Ammeter least count = 0.02 A; Voltmeter least count = 0.05 V. Zero pointer rests exactly at 0 mark.',
      precautions: 'Tap the meter glass gently with a finger before taking readings to eliminate pivot friction.',
      commonMistakes: 'Ignoring negative or positive mechanical zero offset.'
    },
    {
      stepNumber: 2,
      title: 'Assemble Circuit According to Schematic',
      actionPrompt: 'Connect battery positive to ammeter (+), ammeter (-) to resistor wire, resistor to rheostat slider, and back through plug key to battery (-). Connect voltmeter in parallel across resistor wire.',
      apparatusUsed: ['Connecting Wires', 'DC Battery', 'Ammeter', 'Voltmeter', 'Rheostat', 'Plug Key'],
      scientificReason: 'An ammeter has very low resistance and must be in series to measure branch current. A voltmeter has very high resistance and must be in parallel to measure potential drop.',
      expectedObservation: 'A complete series-parallel circuit with tight terminal screws.',
      precautions: 'Observe positive and negative meter polarity. Ensure the plug key is kept open until ready to take readings.',
      commonMistakes: 'Accidentally connecting the ammeter in parallel, causing a direct short-circuit.'
    },
    {
      stepNumber: 3,
      title: 'Insert Plug Key & Set Low Current (0.20 A)',
      actionPrompt: 'Insert plug key into the brass block. Adjust rheostat slider until ammeter indicates exactly 0.20 A.',
      apparatusUsed: ['Plug Key', 'Rheostat Slider'],
      scientificReason: 'Starting at low current minimizes Joule heating (P = I²R) so wire temperature remains steady.',
      expectedObservation: 'Ammeter needle points to 0.20 A; voltmeter needle registers approximately 0.50 V.',
      precautions: 'Take readings immediately, then remove the plug key for 15 seconds to let the wire cool.',
      commonMistakes: 'Leaving the key plugged in continuously, causing resistance to increase due to temperature coefficient (α).'
    },
    {
      stepNumber: 4,
      title: 'Vary Rheostat Slider & Record 5 Consecutive Pairs',
      actionPrompt: 'Slide rheostat in small steps to obtain currents of 0.40 A, 0.60 A, 0.80 A, and 1.00 A. Record corresponding voltages.',
      apparatusUsed: ['Rheostat', 'Ammeter', 'Voltmeter'],
      scientificReason: 'Multiple data points across a wide range allow calculating a statistically reliable mean and plotting a linear trendline.',
      expectedObservation: 'As current increases linearly, voltage increases in exact constant ratio (V / I ≈ constant).',
      precautions: 'Look perpendicularly at the meter scale with one eye to eliminate parallax error with mirror strip.',
      commonMistakes: 'Rounding values carelessly instead of reading to the nearest fractional division.'
    },
    {
      stepNumber: 5,
      title: 'Measure Wire Length & Calculate Resistance per Unit Length',
      actionPrompt: 'Measure the stretched length of nichrome wire between binding posts using a metre scale. Plot V-I graph and determine slope.',
      apparatusUsed: ['Metre Scale', 'Graph Plotter'],
      scientificReason: 'Slope ΔV / ΔI gives total wire resistance R. Dividing by measured wire length L gives intrinsic linear resistance R/L.',
      expectedObservation: 'A straight line passing through the origin (0, 0) with slope R ≈ 2.50 Ω; resistance per unit length ≈ 2.50 Ω/m for 100 cm wire.',
      precautions: 'Measure only the active length of wire between the inner binding posts, not the curled ends.',
      commonMistakes: 'Drawing a best-fit line that does not pass through the origin when V=0 must produce I=0.'
    }
  ],
  formulas: [
    {
      name: 'Ohm’s Law & Resistance',
      equation: 'R = \\frac{V}{I}',
      explanation: 'Mathematical formulation of Ohm’s law expressing electrical resistance as the ratio of voltage drop to electric current.',
      conditions: 'Isothermal metallic conductor with no electromagnetic induction or mechanical strain.',
      symbols: [
        { symbol: 'R', definition: 'Electrical resistance', unit: 'Ohm (\\Omega)' },
        { symbol: 'V', definition: 'Potential difference across conductor ends', unit: 'Volt (V)' },
        { symbol: 'I', definition: 'Electric current flowing through conductor', unit: 'Ampere (A)' }
      ],
      workedExample: {
        inputs: 'Measured potential difference V = 1.50 V, measured electric current I = 0.60 A.',
        steps: [
          'State formula: R = V / I',
          'Substitute values: R = 1.50 V / 0.60 A',
          'Calculate: 1.50 / 0.60 = 2.50 \\Omega'
        ],
        result: 'Resistance R = 2.50 \\Omega'
      }
    },
    {
      name: 'Resistance per Unit Length',
      equation: 'r = \\frac{R}{L}',
      explanation: 'Linear resistance density of the cylindrical wire of uniform cross-section.',
      conditions: 'Uniform wire diameter without kinks or stretching.',
      symbols: [
        { symbol: 'r', definition: 'Resistance per unit length', unit: '\\Omega / \\text{m}' },
        { symbol: 'R', definition: 'Total measured resistance of test wire', unit: '\\Omega' },
        { symbol: 'L', definition: 'Length of wire between binding terminals', unit: 'Metre (m)' }
      ],
      workedExample: {
        inputs: 'Total resistance R = 2.50 \\Omega, active length L = 100 cm = 1.00 m.',
        steps: [
          'Convert length to SI unit: L = 1.00 m',
          'Apply formula: r = R / L = 2.50 \\Omega / 1.00 m = 2.50 \\Omega / \\text{m}'
        ],
        result: 'Resistance per unit length = 2.50 \\Omega / \\text{m}'
      }
    }
  ],
  observationColumns: [
    { key: 'trial', label: 'Observation No.', type: 'text', readOnly: true },
    { key: 'current', label: 'Current I', type: 'number', unit: 'A' },
    { key: 'voltage', label: 'Voltage V', type: 'number', unit: 'V' },
    { key: 'resistance', label: 'Calculated R = V / I', type: 'number', unit: 'Ω', readOnly: true },
    { key: 'power', label: 'Power P = V · I', type: 'number', unit: 'W', readOnly: true }
  ],
  defaultObservations: [
    { id: 'ohm_1', trial: 'Trial 1', current: 0.20, voltage: 0.50, resistance: 2.50, power: 0.10 },
    { id: 'ohm_2', trial: 'Trial 2', current: 0.40, voltage: 1.00, resistance: 2.50, power: 0.40 },
    { id: 'ohm_3', trial: 'Trial 3', current: 0.60, voltage: 1.50, resistance: 2.50, power: 0.90 },
    { id: 'ohm_4', trial: 'Trial 4', current: 0.80, voltage: 2.02, resistance: 2.525, power: 1.616 },
    { id: 'ohm_5', trial: 'Trial 5', current: 1.00, voltage: 2.52, resistance: 2.52, power: 2.52 }
  ],
  quizQuestions: [
    {
      id: 'q_ohm_1',
      question: 'In an Ohm’s Law experiment, a student connects an ammeter in parallel with the resistance wire and a voltmeter in series. What will happen when the circuit switch is closed?',
      options: [
        'Both meters will record perfectly normal values.',
        'The voltmeter needle will deflect almost to full scale while the ammeter registers virtually zero current, with no component damage.',
        'The circuit will explode and destroy the power supply.',
        'The resistance wire will melt instantly due to excessive heating.'
      ],
      correctAnswer: 1,
      explanation: 'A voltmeter has extremely high resistance (ideally infinite). Connected in series, it restricts circuit current to microamperes, so the ammeter registers virtually zero. The total battery EMF drops almost entirely across the high-resistance voltmeter, showing near-battery voltage.',
      distractorExplanations: [
        'Meters must be in correct configuration to record normal values.',
        'Correct: The series voltmeter blocks current and reads supply EMF.',
        'The circuit does not explode because the voltmeter resistance is enormous, preventing excessive current.',
        'The wire carries negligible current (< 1 mA), generating virtually zero Joule heat.'
      ],
      topicTag: 'Circuit Meter Topology',
      difficulty: 'medium',
      hint: 'Remember the internal resistance of an ideal voltmeter compared to circuit resistors.',
      examTarget: ['cbse', 'jee_main', 'neet']
    },
    {
      id: 'q_ohm_2',
      question: 'A V–I graph is plotted for two conductors A and B at constant temperature. Conductor A produces a steeper slope than Conductor B when V is on the y-axis and I on the x-axis. What does this indicate?',
      options: [
        'Conductor A has higher resistance than Conductor B (R_A > R_B).',
        'Conductor B has higher resistance than Conductor A (R_B > R_A).',
        'Conductor A is a superconductor.',
        'Both conductors have identical resistance.'
      ],
      correctAnswer: 0,
      explanation: 'When V is on the vertical axis and I is on the horizontal axis: Slope = ΔV / ΔI = R. Therefore, a steeper slope corresponds directly to a larger resistance: Slope_A > Slope_B implies R_A > R_B.',
      distractorExplanations: [
        'Correct: Steeper slope on V vs I graph corresponds to larger resistance.',
        'If I were plotted on the y-axis and V on the x-axis, then steeper slope would mean smaller R.',
        'A superconductor has zero resistance, corresponding to a horizontal line (zero slope).',
        'Different slopes cannot represent identical resistances.'
      ],
      topicTag: 'V-I Graph Analysis',
      difficulty: 'easy',
      hint: 'Slope = Vertical change / Horizontal change = ΔV / ΔI.',
      examTarget: ['cbse', 'jee_main', 'neet', 'cuet']
    },
    {
      id: 'q_ohm_3',
      question: 'Why does the V–I curve of a real metallic wire begin to bend upward toward the V-axis at very high electric currents?',
      options: [
        'Electrons run out of kinetic energy.',
        'Excessive Joule heating (H = I²Rt) increases wire temperature, causing lattice ions to oscillate more vigorously and increase resistivity.',
        'The battery voltage automatically increases.',
        'The wire diameter shrinks under magnetic pressure.'
      ],
      correctAnswer: 1,
      explanation: 'Metals possess a positive temperature coefficient of resistance (α > 0). At high current, Joule heating elevates temperature, which accelerates thermal vibrations of copper/nichrome cations, increasing the collision frequency of conduction electrons and increasing R.',
      distractorExplanations: [
        'Electrons gain energy from the electric field, they do not run out of energy.',
        'Correct: Joule heating increases resistance, requiring higher V for subsequent increments in I.',
        'The battery voltage does not increase automatically.',
        'Pinch effect is negligible at ordinary educational laboratory currents.'
      ],
      topicTag: 'Temperature Dependence of Resistance',
      difficulty: 'hard',
      hint: 'What happens to the temperature of a toaster or heater wire when large current flows through it?',
      examTarget: ['jee_main', 'neet', 'cbse']
    },
    {
      id: 'q_ohm_4',
      question: 'A uniform nichrome wire of resistance 10 Ω is stretched uniformly to double its original length. What is its new resistance?',
      options: [
        '20 Ω',
        '40 Ω',
        '5 Ω',
        '10 Ω'
      ],
      correctAnswer: 1,
      explanation: 'When stretched uniformly without mass loss, volume V = A · L remains constant. If length doubles (L\' = 2L), area halves (A\' = A / 2). New resistance R\' = ρ · (2L) / (A / 2) = 4 · (ρL / A) = 4 · 10 Ω = 40 Ω.',
      distractorExplanations: [
        '20 Ω would occur if length doubled while cross-sectional area remained constant (e.g. connecting two wires).',
        'Correct: Stretching doubles length and halves area, multiplying resistance by 2² = 4 (R\' = 40 Ω).',
        '5 Ω is one-half of original resistance.',
        'Resistance cannot remain 10 Ω when geometry changes.'
      ],
      topicTag: 'Wire Stretching & Resistivity',
      difficulty: 'medium',
      hint: 'Recall that volume is conserved: if length increases, cross-sectional area must decrease proportionally.',
      examTarget: ['jee_main', 'neet', 'cbse']
    },
    {
      id: 'q_ohm_5',
      question: 'Which alloy is most commonly chosen for standard laboratory resistance wire and why?',
      options: [
        'Pure Silver because it has lowest electrical resistivity.',
        'Manganin or Constantan because they possess high resistivity and nearly zero temperature coefficient of resistance.',
        'Pure Aluminum because it is lightweight.',
        'Lead because it has a low melting point.'
      ],
      correctAnswer: 1,
      explanation: 'Standard resistors must maintain invariant resistance despite temperature changes during an experiment. Manganin (Cu-Mn-Ni) and Constantan (Cu-Ni) have high specific resistance and extremely low temperature coefficients of resistance (α ≈ 10^-5 K^-1).',
      distractorExplanations: [
        'Pure silver has a large temperature coefficient and low resistance, requiring impractically long wires.',
        'Correct: High resistivity and near-zero temperature coefficient guarantee stable readings.',
        'Aluminum oxidizes rapidly and has a high temperature coefficient.',
        'Lead has high resistivity but melts easily under modest currents.'
      ],
      topicTag: 'Materials & Standard Resistors',
      difficulty: 'medium',
      hint: 'Look for an alloy that does NOT change its resistance when warmed.',
      examTarget: ['cbse', 'neet', 'jee_main']
    }
  ],
  vivaQuestions: [
    {
      question: 'What is the physical meaning of the slope of an I–V graph versus a V–I graph?',
      answer: 'For a V–I graph (V on y-axis, I on x-axis), the slope is ΔV / ΔI = R (Resistance in ohms). For an I–V graph (I on y-axis, V on x-axis), the slope is ΔI / ΔV = G = 1 / R (Electrical conductance in siemens).',
      examRelevance: 'CBSE Class 10 & 12 Board Practical Viva Essential'
    },
    {
      question: 'Why should the plug key be removed from the circuit between successive readings?',
      answer: 'Continuous flow of electric current causes Joule heating (H = I²Rt). As temperature rises, the resistance of the nichrome wire increases, producing erroneous readings that deviate from constant-temperature Ohm’s law.',
      examRelevance: 'CBSE Safety and Error Analysis Question'
    },
    {
      question: 'Why does an ammeter have very low resistance while a voltmeter has very high resistance?',
      answer: 'An ammeter is connected in series; if it had high resistance, it would add to circuit resistance and reduce the very current it aims to measure. A voltmeter is in parallel; if it had low resistance, it would divert significant current from the branch, altering the potential drop.',
      examRelevance: 'NEET & JEE Main Conceptual Question'
    }
  ],
  simulatedModelNotes: 'The 3D Physics Laboratory models real-time DC closed-circuit kinematics, dynamic needle deflection with damping oscillations on analog gauges, linear regression slope calculation, and wire temperature drift.'
};
