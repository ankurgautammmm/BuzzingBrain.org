/**
 * Official CBSE & NCERT Prescribed Practical Catalogue (Classes 9–12)
 * Science, Physics, Chemistry, and Biology Laboratory Syllabi
 */

export interface NcertPracticalItem {
  id: string;
  title: string;
  classGrade: 'Class 9' | 'Class 10' | 'Class 11' | 'Class 12';
  subject: 'Science' | 'Physics' | 'Chemistry' | 'Biology';
  chapter: string;
  objective: string;
  apparatus: string[];
  safetyPrecautions: string[];
  procedureSteps: string[];
  observationHeaders: string[];
  sampleObservations: string[][];
  calculationsFormula?: string;
  expectedOutcome: string;
  vivaQuestions: { question: string; answer: string }[];
  linkedTool?: 'microscope' | 'balance' | 'ph_meter' | 'simulations';
  verifiedStatus: boolean;
}

export const PRESCRIBED_PRACTICALS: NcertPracticalItem[] = [
  // CLASS 9
  {
    id: 'c9_onion_peel',
    title: 'Preparation of Temporary Mount of Onion Peel (Plant Cell)',
    classGrade: 'Class 9',
    subject: 'Science',
    chapter: 'The Fundamental Unit of Life',
    objective: 'To prepare a temporary stained mount of onion peel and observe plant cells under a compound microscope.',
    apparatus: ['Compound Microscope', 'Onion bulb', 'Glass slides', 'Cover slips', 'Safranin stain', 'Glycerine', 'Watch glass', 'Forceps', 'Dropper'],
    safetyPrecautions: [
      'Avoid air bubbles while placing the cover slip by lowering it gently with a needle at a 45° angle.',
      'Do not over-stain the peel; excess Safranin obscures cellular organelles.',
      'Keep the specimen moist with glycerine to prevent cell shrinkage and dehydration.'
    ],
    procedureSteps: [
      'Take a fresh fleshy onion scale and gently peel off the thin transparent epidermal peel using forceps.',
      'Transfer the peel into a watch glass containing water.',
      'Add 2–3 drops of dilute Safranin stain and leave for 2 minutes to stain the cell walls and nuclei.',
      'Rinse off excess stain in a separate watch glass with clean distilled water.',
      'Place the peel in the center of a clean glass slide and add a drop of pure glycerine.',
      'Gently place a cover slip using a mounting needle to avoid trapping air bubbles.',
      'Observe under low power (10x), then switch to high power (40x).'
    ],
    observationHeaders: ['Magnification', 'Cell Shape', 'Cell Wall Observed', 'Nucleus Position', 'Vacuole Status'],
    sampleObservations: [
      ['100x (10x Obj)', 'Rectangular / Hexagonal', 'Distinct, rigid outer wall', 'Peripheral nucleus', 'Large central vacuole'],
      ['400x (40x Obj)', 'Brick-like compact tiles', 'Double border visible', 'Deeply stained dot at periphery', 'Prominent clear central sap space']
    ],
    calculationsFormula: 'Cell Size (μm) = Field of View Diameter / Estimated Number of Cells in Field',
    expectedOutcome: 'Epidermal cells appear as neat rectangular compartments fitted compactly without intercellular spaces, with prominent peripheral nuclei and large central vacuoles.',
    vivaQuestions: [
      {
        question: 'Why is Safranin used instead of Methylene Blue for onion peel?',
        answer: 'Safranin preferentially stains cell walls (cellulose and lignin) and nuclei red/pink, giving maximum visual contrast in plant cells.'
      },
      {
        question: 'Why do onion cells have large central vacuoles whereas human cheek cells do not?',
        answer: 'Plant cells require large vacuoles for maintaining turgidity, structural rigidity, and cell expansion without increasing cytoplasm volume.'
      }
    ],
    linkedTool: 'microscope',
    verifiedStatus: true,
  },
  {
    id: 'c9_density_archimedes',
    title: 'Verification of Archimedes Principle & Determination of Density',
    classGrade: 'Class 9',
    subject: 'Science',
    chapter: 'Gravitation',
    objective: 'To establish the relationship between the loss in weight of a solid when immersed in tap water and strongly salted water with the weight of water displaced.',
    apparatus: ['Spring balance (0–250g)', 'Measuring cylinder (100 mL)', 'Metallic solid bob', 'Thread', 'Overflow can / beaker', 'Salt solution'],
    safetyPrecautions: [
      'Ensure the spring balance zero error is recorded and corrected prior to measurement.',
      'The immersed solid must hang freely without touching the sides or bottom of the cylinder.',
      'Read the lower meniscus of water perpendicularly to avoid parallax error.'
    ],
    procedureSteps: [
      'Determine the zero error and least count of the spring balance.',
      'Tie the metallic bob with thread and weigh it in air (W1).',
      'Fill an overflow can with water up to the spout and place a dry measuring cylinder below the spout.',
      'Immerse the bob completely in water and record its apparent weight (W2).',
      'Note the volume of water collected in the graduated cylinder (V).',
      'Calculate upthrust (W1 - W2) and compare with the weight of displaced liquid (V × ρ × g).'
    ],
    observationHeaders: ['Trial', 'Weight in Air (W1 gf)', 'Weight in Water (W2 gf)', 'Loss in Weight (W1-W2 gf)', 'Displaced Volume (mL)'],
    sampleObservations: [
      ['Trial 1', '75.0', '65.0', '10.0 gf', '10.0 mL (Weight = 10.0 gf)'],
      ['Trial 2', '120.0', '104.0', '16.0 gf', '16.0 mL (Weight = 16.0 gf)']
    ],
    calculationsFormula: 'Loss in Weight (Upthrust) = Weight of Displaced Liquid = V × d × g',
    expectedOutcome: 'The loss of weight of the solid when submerged equals the weight of the displaced liquid, completely verifying Archimedes Principle.',
    vivaQuestions: [
      {
        question: 'Does the buoyant force depend on the density of the submerged solid?',
        answer: 'No, the buoyant force depends solely on the volume of the immersed solid and the density of the surrounding fluid (FB = V_sub × ρ_fluid × g).'
      }
    ],
    linkedTool: 'balance',
    verifiedStatus: true,
  },

  // CLASS 10
  {
    id: 'c10_ph_testing',
    title: 'Determination of pH of Given Chemical Samples',
    classGrade: 'Class 10',
    subject: 'Science',
    chapter: 'Acids, Bases and Salts',
    objective: 'To determine the pH of common laboratory samples using pH paper, universal indicator solution, and a calibrated digital pH electrode.',
    apparatus: ['Digital pH Meter', 'Universal pH paper strip', 'Test tubes and test tube rack', 'Dropper', 'Standard buffer solutions (pH 4.0, 7.0, 9.2)'],
    safetyPrecautions: [
      'Rinse the glass pH electrode thoroughly with deionized water between different solution measurements.',
      'Calibrate the pH meter with standard pH 7.0 and pH 4.0 buffers before taking unknown readings.',
      'Handle corrosive acids (HCl, H2SO4) and caustic alkalis (NaOH) with dropper safety.'
    ],
    procedureSteps: [
      'Take 5 clean test tubes labeled A (Dilute HCl), B (Dilute NaOH), C (Dilute Ethanoic Acid), D (Lemon Juice), and E (Distilled Water).',
      'Dip a strip of universal pH paper into each test tube and compare the developed hue with the standard color reference chart.',
      'Immerse the glass electrode of the digital pH meter into each solution and record the exact digital reading once stabilized.',
      'Classify each sample as strongly acidic, weakly acidic, neutral, weakly basic, or strongly basic.'
    ],
    observationHeaders: ['Sample Tube', 'Substance', 'pH Paper Color', 'Digital pH Reading', 'Nature of Substance'],
    sampleObservations: [
      ['A', '0.1M Dilute HCl', 'Dark Red', '1.05', 'Strong Acid'],
      ['B', '0.1M Dilute NaOH', 'Dark Violet / Purple', '13.10', 'Strong Base'],
      ['C', '0.1M Acetic Acid', 'Orange', '2.88', 'Weak Acid'],
      ['D', 'Fresh Lemon Juice', 'Pinkish Red', '2.35', 'Moderate Organic Acid'],
      ['E', 'Distilled Water', 'Green', '7.02', 'Neutral']
    ],
    calculationsFormula: 'pH = -log10[H+]  •  pOH = -log10[OH-]  •  pH + pOH = 14 at 25°C',
    expectedOutcome: 'Acids produce pH < 7 with red/orange tints; bases produce pH > 7 with blue/violet tints; pure neutral water registers pH ~ 7.0.',
    vivaQuestions: [
      {
        question: 'Why does dry HCl gas not change the color of dry blue litmus paper?',
        answer: 'Dry HCl gas lacks hydronium ions (H3O+). Ionization into H+ ions only occurs in an aqueous medium where water molecules stabilize H+ as H3O+.'
      },
      {
        question: 'What is the relationship between temperature and measured pH?',
        answer: 'As temperature increases, water auto-ionization (Kw) increases slightly, shifting the neutral pH point downward from 7.00 (e.g. 6.77 at 40°C).'
      }
    ],
    linkedTool: 'ph_meter',
    verifiedStatus: true,
  },
  {
    id: 'c10_ohms_law',
    title: 'Verification of Ohm’s Law & Resistance per Unit Length',
    classGrade: 'Class 10',
    subject: 'Science',
    chapter: 'Electricity',
    objective: 'To determine the resistance per unit length of a given nichrome wire by plotting a graph of potential difference (V) versus current (I).',
    apparatus: ['Ammeter (0–1.5 A)', 'Voltmeter (0–3 V)', 'Nichrome resistance wire', 'Rheostat', 'DC Battery (2–4V)', 'Plug key', 'Connecting wires', 'Metre scale'],
    safetyPrecautions: [
      'Connect the ammeter strictly in series with the load and the voltmeter strictly in parallel across the resistance wire.',
      'Remove the plug key between readings to avoid continuous current heating that alters the wire resistance.',
      'Ensure all terminal screws are tightly fastened to eliminate loose contact resistance.'
    ],
    procedureSteps: [
      'Draw the circuit diagram and make tight connections as shown: battery, key, rheostat, and ammeter in series; voltmeter in parallel across resistor wire.',
      'Check the zero error and least count of both the ammeter and voltmeter.',
      'Insert the plug key and adjust the rheostat slider to set a small ammeter reading (e.g. 0.1 A).',
      'Record corresponding current (I) and voltage (V).',
      'Shift the rheostat slider to obtain at least 5 different current settings and note readings.',
      'Plot a graph of V on the y-axis against I on the x-axis, calculate slope R = ΔV / ΔI, and divide by wire length L.'
    ],
    observationHeaders: ['Reading No.', 'Ammeter (I in Amperes)', 'Voltmeter (V in Volts)', 'Resistance R = V/I (Ω)', 'Deviation from Mean'],
    sampleObservations: [
      ['1', '0.20 A', '0.50 V', '2.50 Ω', '0.00'],
      ['2', '0.40 A', '1.00 V', '2.50 Ω', '0.00'],
      ['3', '0.60 A', '1.50 V', '2.50 Ω', '0.00'],
      ['4', '0.80 A', '2.02 V', '2.52 Ω', '+0.02'],
      ['5', '1.00 A', '2.48 V', '2.48 Ω', '-0.02']
    ],
    calculationsFormula: 'Slope of V-I Graph = R = ΔV / ΔI  •  Resistance per unit length = R / L (Ω/m)',
    expectedOutcome: 'The V-I graph is a straight line passing through the origin, confirming that potential difference is directly proportional to current (Ohm’s Law: V ∝ I).',
    vivaQuestions: [
      {
        question: 'Under what physical condition does Ohm’s Law hold true?',
        answer: 'Ohm’s Law holds only when physical conditions such as temperature, mechanical strain, and wire dimensions remain constant.'
      }
    ],
    linkedTool: 'simulations',
    verifiedStatus: true,
  },

  // CLASS 11
  {
    id: 'c11_titration_oxalic_naoh',
    title: 'Preparation of Standard 0.1M Oxalic Acid & Titration with NaOH',
    classGrade: 'Class 11',
    subject: 'Chemistry',
    chapter: 'Some Basic Concepts of Chemistry / Redox',
    objective: 'To prepare 250 mL of 0.1 M standard oxalic acid solution and determine the molarity and strength of a given sodium hydroxide (NaOH) solution.',
    apparatus: ['Analytical Chemical Balance', 'Weight box', '250 mL Volumetric flask', 'Burette (50 mL)', 'Pipette (20 mL)', 'Conical flask', 'Phenolphthalein indicator'],
    safetyPrecautions: [
      'Weigh oxalic acid crystals accurately to 0.001g using a watch glass with draft shields closed.',
      'Do not blow out the last drop remaining inside the pipette nozzle tip.',
      'Take readings with a white tile beneath the conical flask to spot the faint permanent pink endpoint sharply.'
    ],
    procedureSteps: [
      'Calculate the mass of hydrated oxalic acid crystals required for 250 mL of 0.1 M: m = (M × Mol.Wt × V) / 1000 = (0.1 × 126.07 × 250) / 1000 = 3.151 g.',
      'Tare the watch glass on the analytical balance and weigh exactly 3.151 g of oxalic acid.',
      'Dissolve in ~100 mL of distilled water in a beaker, transfer quantitatively into a 250 mL volumetric flask, make up to the mark, and invert to homogenize.',
      'Fill a clean burette with the unknown NaOH solution and zero the meniscus.',
      'Pipette out 20.0 mL of standard oxalic acid into a conical flask and add 1–2 drops of phenolphthalein.',
      'Titrate dropwise against NaOH until a permanent pale pink color persists for 30 seconds. Record concordant burette readings.'
    ],
    observationHeaders: ['Titration Run', 'Initial Burette (mL)', 'Final Burette (mL)', 'Volume of NaOH Used (mL)', 'Concordance'],
    sampleObservations: [
      ['Pilot Run', '0.0', '19.8', '19.8 mL', 'Approximate'],
      ['Run 1', '0.0', '19.5', '19.5 mL', 'Concordant'],
      ['Run 2', '19.5', '39.0', '19.5 mL', 'Concordant'],
      ['Run 3', '0.0', '19.5', '19.5 mL', 'Concordant']
    ],
    calculationsFormula: '(M_acid × V_acid) / n_acid = (M_base × V_base) / n_base  (where n_acid = 1, n_base = 2 for dibasic oxalic acid: H2C2O4 + 2NaOH ➔ Na2C2O4 + 2H2O)',
    expectedOutcome: 'Molarity of NaOH is precisely determined as 0.205 M with strength = 0.205 × 40.0 = 8.20 g/L.',
    vivaQuestions: [
      {
        question: 'Why cannot NaOH be used as a primary standard directly?',
        answer: 'Solid NaOH is highly hygroscopic (absorbs moisture from air) and reacts with atmospheric carbon dioxide to form sodium carbonate (Na2CO3).'
      }
    ],
    linkedTool: 'balance',
    verifiedStatus: true,
  },
  {
    id: 'c11_simple_pendulum',
    title: 'Simple Pendulum: Variation of L vs T² & Acceleration due to Gravity (g)',
    classGrade: 'Class 11',
    subject: 'Physics',
    chapter: 'Oscillations',
    objective: 'To plot an L–T² graph using a simple pendulum and determine the acceleration due to gravity (g) and effective length of a seconds pendulum.',
    apparatus: ['Heavy metallic spherical bob with hook', 'Fine cotton thread', 'Split cork clamp', 'Rigid stand', 'Stopwatch (least count 0.1s)', 'Vernier callipers', 'Metre scale'],
    safetyPrecautions: [
      'Ensure the amplitude of oscillation is small (angular displacement θ < 4°) to preserve simple harmonic motion.',
      'Release the bob smoothly from rest without providing any spin or rotational impulse.',
      'Count oscillations at the mean equilibrium position rather than at extreme points.'
    ],
    procedureSteps: [
      'Measure the diameter of the bob using vernier callipers to obtain bob radius r.',
      'Tie the thread to the hook and clamp it firmly between the split cork at an effective length L = l + r + e.',
      'Displace the bob slightly and start the stopwatch as it passes the central mark in a fixed direction.',
      'Record the time taken for 20 complete oscillations and calculate time period T = t / 20.',
      'Repeat the experiment for 5 different lengths: 70 cm, 80 cm, 90 cm, 100 cm, 110 cm.',
      'Calculate T² for each length, plot L versus T², and deduce g from g = 4π² × (L / T²).'
    ],
    observationHeaders: ['Length L (cm)', 'Time for 20 Oscillations (s)', 'Period T (s)', 'T² (s²)', 'L / T² Ratio (cm/s²)'],
    sampleObservations: [
      ['70.0', '33.4', '1.67', '2.79', '25.09'],
      ['80.0', '35.8', '1.79', '3.20', '25.00'],
      ['90.0', '38.0', '1.90', '3.61', '24.93'],
      ['100.0', '40.1', '2.00', '4.00', '25.00'],
      ['110.0', '42.0', '2.10', '4.41', '24.94']
    ],
    calculationsFormula: 'g = 4 · π² · (L / T²)  •  Seconds Pendulum Length = g / π² ≈ 99.3 cm',
    expectedOutcome: 'The L vs T² graph is a straight line through the origin. Acceleration due to gravity is calculated as g = 9.81 m/s² with < 1% experimental error.',
    vivaQuestions: [
      {
        question: 'Does the mass or material of the bob affect the time period of a simple pendulum?',
        answer: 'No, the time period T = 2π√(L/g) is completely independent of the mass or density of the bob, provided air resistance is negligible.'
      }
    ],
    linkedTool: 'simulations',
    verifiedStatus: true,
  },

  // CLASS 12
  {
    id: 'c12_metrebredige_wheatstone',
    title: 'Determination of Unknown Resistance using Metre Bridge (Wheatstone)',
    classGrade: 'Class 12',
    subject: 'Physics',
    chapter: 'Current Electricity',
    objective: 'To determine the resistance of a given wire using a metre bridge and calculate the resistivity (specific resistance) of its material.',
    apparatus: ['Metre bridge board', 'Leclanche or DC power supply', 'Galvanometer', 'Resistance box', 'Jockey', 'Unknown resistance wire', 'Screw gauge', 'Metre scale'],
    safetyPrecautions: [
      'Do not drag the jockey along the manganin/constantan wire, as scraping causes non-uniform cross-section.',
      'Obtain null points near the middle of the bridge wire (40 cm to 60 cm) to minimize bridge sensitivity errors.',
      'Measure wire diameter at 3 different locations using a screw gauge to eliminate taper error.'
    ],
    procedureSteps: [
      'Connect the unknown resistance X in the right gap and the known resistance box R in the left gap of the metre bridge.',
      'Check circuit continuity by touching the jockey at 0 cm and 100 cm; galvanometer should deflect in opposite directions.',
      'Introduce a suitable resistance R (e.g. 2 Ω) from the resistance box and tap the jockey along the wire to locate the null point D where deflection is zero.',
      'Record balancing length AD = l cm; then DC = (100 - l) cm.',
      'Calculate unknown resistance from Wheatstone condition: X = R × (100 - l) / l.',
      'Repeat with 4 different values of R, compute mean X, measure wire radius r and length L, and calculate resistivity ρ = (X · π · r²) / L.'
    ],
    observationHeaders: ['Resistance R (Ω)', 'Balancing Length l (cm)', '(100 - l) (cm)', 'Unknown X = R(100-l)/l (Ω)', 'Deviation'],
    sampleObservations: [
      ['2.0 Ω', '44.5 cm', '55.5 cm', '2.50 Ω', '0.00'],
      ['3.0 Ω', '54.5 cm', '45.5 cm', '2.51 Ω', '+0.01'],
      ['4.0 Ω', '61.5 cm', '38.5 cm', '2.50 Ω', '0.00'],
      ['5.0 Ω', '66.6 cm', '33.4 cm', '2.51 Ω', '+0.01']
    ],
    calculationsFormula: 'Wheatstone Condition: R / l = X / (100 - l)  ➔  X = R · (100 - l) / l  •  Resistivity ρ = (X · π · r²) / L',
    expectedOutcome: 'Unknown wire resistance is found to be 2.50 ± 0.02 Ω and material resistivity matches standard nichrome (~1.10 × 10⁻⁶ Ω·m).',
    vivaQuestions: [
      {
        question: 'Why are the connection strips on a metre bridge made of thick copper?',
        answer: 'Copper has very low resistivity and thick strips have large cross-sectional area, minimizing end-strip contact resistance to negligible levels.'
      }
    ],
    linkedTool: 'simulations',
    verifiedStatus: true,
  },
  {
    id: 'c12_dna_isolation',
    title: 'Isolation of Genomic DNA from Available Plant Material',
    classGrade: 'Class 12',
    subject: 'Biology',
    chapter: 'Biotechnology: Principles and Processes',
    objective: 'To isolate and precipitate crude genomic DNA from plant tissue (ripe banana, green pea, or onion) using household/laboratory reagents.',
    apparatus: ['Ripe banana / green peas', 'Mortar and pestle', 'Liquid detergent (lysis buffer)', 'Common salt (NaCl)', 'Chilled ethanol (95%)', 'Cheesecloth / filter', 'Test tubes', 'Glass rod (spooling)'],
    safetyPrecautions: [
      'Ensure ethanol is ice-cold (-20°C in freezer) prior to layering; warm ethanol fails to precipitate DNA efficiently.',
      'Pour chilled ethanol slowly down the tilted side of the test tube to form a distinct upper layer without mixing.',
      'Spool the precipitated DNA gently in a continuous circular motion to avoid shearing high-molecular-weight DNA strands.'
    ],
    procedureSteps: [
      'Prepare lysis solution: Mix 10 mL liquid detergent, 2 g sodium chloride (NaCl), and 90 mL distilled water.',
      'Mash 20 g of ripe banana in a mortar with 20 mL of lysis solution to mechanically rupture cell walls and membranes.',
      'Incubate the slurry in a 60°C water bath for 15 minutes to denature cellular DNases, then cool in ice water.',
      'Filter the homogenate through double-layered cheesecloth to remove fibrous cellulose debris.',
      'Collect 5 mL of clear filtrate in a clean glass test tube.',
      'Slowly pour 5 mL of ice-chilled ethanol down the inner wall of the tilted test tube.',
      'Observe the white fibrous precipitates of DNA aggregating at the water-alcohol interface and gently spool using a glass hook.'
    ],
    observationHeaders: ['Step', 'Reagent Added', 'Biological Action', 'Visual Observation'],
    sampleObservations: [
      ['Cell Lysis', 'Detergent + Salt', 'Dissolves lipid bilayer & strips histones', 'Viscous cellular slurry'],
      ['Enzyme Denaturation', 'Heat 60°C', 'Inactivates cellular DNase enzymes', 'Color darkens slightly'],
      ['Precipitation', 'Ice-cold 95% Ethanol', 'Dehydrates DNA; insoluble in cold ethanol', 'White translucent fibrous spools float at interface']
    ],
    calculationsFormula: 'Yield (mg/g) = Spooled DNA Mass (mg) / Initial Plant Tissue Weight (g)',
    expectedOutcome: 'Genomic DNA precipitates as delicate, white mucous-like fibrous aggregates at the interface, demonstrating physical DNA spooling.',
    vivaQuestions: [
      {
        question: 'What is the role of NaCl in the DNA isolation extraction buffer?',
        answer: 'Sodium ions (Na+) neutralize negative charges on phosphate backbones of DNA molecules, reducing repulsion and enabling DNA strands to aggregate.'
      },
      {
        question: 'Why does DNA precipitate only when chilled ethanol is added?',
        answer: 'DNA is hydrophilic and remains dissolved in water. Ice-cold ethanol has a lower dielectric constant, shielding charges and making DNA insoluble.'
      }
    ],
    linkedTool: 'microscope',
    verifiedStatus: true,
  }
];
