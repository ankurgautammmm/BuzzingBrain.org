import { NoteContentPayload } from '../types';

/**
 * Converts any NoteContentPayload or topic into the exact 6-step Topper Register markdown structure
 */
export function convertNotePayloadToTopperMarkdown(note: NoteContentPayload): string {
  if (!note) return '';

  const topicName = note.topic || note.chapter || note.title || 'Comprehensive Topic';
  const grade = note.classGrade || 'Class 10';
  const subject = note.subject || 'Science';

  const lines: string[] = [];

  // 1. Title & Header + Learning Objective in italics
  lines.push(`# ${topicName} - Comprehensive Notes`);
  lines.push(`*Learning Objective: To master the theoretical fundamentals, mathematical derivations, and high-yield examination problem-solving techniques for ${topicName} in ${grade} ${subject} in strict accordance with the official NCERT syllabus and past 25-year board/competitive marking rubrics.*`);
  lines.push('');

  // 2. Scannable Core Concepts
  if (note.sections && note.sections.length > 0) {
    note.sections.forEach((sec, idx) => {
      lines.push(`## Section ${idx + 1}: ${sec.heading}`);
      if (sec.subheading) {
        lines.push(`### ${sec.subheading}`);
      }

      // Content paragraph
      if (sec.content) {
        lines.push(sec.content);
        lines.push('');
      }

      // Bullets
      if (sec.bullets && sec.bullets.length > 0) {
        sec.bullets.forEach((b) => {
          lines.push(`- ${b}`);
        });
        lines.push('');
      }

      // Formula Blocks & Math
      if (sec.formulaBlocks && sec.formulaBlocks.length > 0) {
        sec.formulaBlocks.forEach((fb) => {
          lines.push(`### Formula: ${fb.title}`);
          const formattedFormula = fb.formula.startsWith('$$') ? fb.formula : `$$${fb.formula}$$`;
          lines.push(formattedFormula);
          if (fb.variables && fb.variables.length > 0) {
            lines.push(`**Where:** ${fb.variables.join('; ')}`);
          }
          if (fb.derivationSummary) {
            lines.push(`*Derivation Logic:* ${fb.derivationSummary}`);
          }
          if (fb.exampleProblem) {
            lines.push(`- **Worked Example:** ${fb.exampleProblem.statement}`);
            lines.push(`- **Boxed Answer:** $${fb.exampleProblem.boxedAnswer}$ (${fb.exampleProblem.units})`);
          }
          lines.push('');
        });
      } else if (sec.importantFormulas && sec.importantFormulas.length > 0) {
        sec.importantFormulas.forEach((f) => {
          const formulaStr = f.includes('$') ? f : `$$${f}$$`;
          lines.push(formulaStr);
          lines.push(`**Where:** Symbols defined according to standard SI units per NCERT.`);
          lines.push('');
        });
      }

      // Margin Notes (Red Pen Examiner Tips)
      if (sec.warningMistakes && sec.warningMistakes.length > 0) {
        sec.warningMistakes.forEach((w) => {
          lines.push(`⚠️ Common Pitfall: ${w}`);
        });
        lines.push('');
      }

      if (sec.starredPoints && sec.starredPoints.length > 0) {
        sec.starredPoints.forEach((sp) => {
          lines.push(`⭐ 5-Mark Question Favorite: ${sp}`);
        });
        lines.push('');
      }

      if (sec.postItNote) {
        lines.push(`💡 Topper's Mnemonic: **${sec.postItNote.title || 'Memory Hack'}** — ${sec.postItNote.text}`);
        lines.push('');
      }
    });
  }

  // Global Alerts if present
  if (note.ncertExamAlert) {
    lines.push(`[EXAM ALERT] **Examiner 25-Year Pattern Warning:** ${note.ncertExamAlert}`);
    lines.push('');
  }

  // Sample Question if present
  if (note.sampleQuestion) {
    lines.push(`## High-Yield Exam Question & Model Solution`);
    lines.push(`**Q:** ${note.sampleQuestion.question}`);
    lines.push(`**Model Answer:**`);
    lines.push(note.sampleQuestion.answer);
    lines.push('');
  }

  // 5. Visual Reference / Diagram Blueprint
  lines.push(`### Visual Reference / Diagram Blueprint`);
  lines.push(`A crisp, hand-drawn study register diagram of ${topicName} drawn with fine-tip blue ink on off-white ruled notebook paper. Features labeled structural components with straight pointer lines, fine arrowheads indicating direction of force or energy flow, key nodes highlighted with soft fluorescent yellow marker, and a neat title box with red margin annotation.`);
  lines.push('');

  // 6. Quick Revision Summary
  lines.push(`## Quick Revision Summary`);
  if (note.quickSummaryReview && note.quickSummaryReview.length > 0) {
    note.quickSummaryReview.forEach((item) => {
      lines.push(`- ${item}`);
    });
  } else {
    lines.push(`- Core principle of ${topicName} states fundamental equilibrium and conservation.`);
    lines.push(`- Always write explicit formulas with SI units before numeric substitution.`);
    lines.push(`- Verify directional signs and boundary conditions to avoid classic examiner traps.`);
    lines.push(`- Remember key diagrams and 5-mark marking criteria for full score.`);
  }

  return lines.join('\n');
}

/**
 * Exemplar master note for Photosynthesis in Topper Register format
 */
export const PHOTOSYNTHESIS_TOPPER_MARKDOWN = `# Photosynthesis - Comprehensive Notes
*Learning Objective: To master the photochemical and biochemical mechanisms of oxygenic photosynthesis in higher plants, contrasting light-dependent thylakoid reactions with light-independent Calvin cycle stroma reactions in full alignment with the NCERT curriculum and competitive exam marking rubrics.*

## 1. Fundamental Overview & Cellular Architecture

### 1.1 Definition & Overall Energetics
- An anabolic, endergonic, oxidation-reduction process in which green plants transduce radiant solar energy into stable chemical bond energy stored in hexose carbohydrates.
- Water ($\\text{H}_2\\text{O}$) undergoes catalytic oxidation to act as the primary electron and proton donor, whereas atmospheric Carbon Dioxide ($\\text{CO}_2$) undergoes enzymatic reduction to synthesize sugars.
- **Site of Reaction:**
  - **Light-Dependent Phase:** Localized in the **Thylakoid membranes & Grana lamellae** of the chloroplast.
  - **Light-Independent Phase (Dark Phase):** Localized in the aqueous **Chloroplast Stroma**.

[EXAM ALERT] **CBSE / NEET Scoring Rule:** Photosynthesis is **not** a single-step reaction. When asked for the source of evolved $\\text{O}_2$, always cite **Cornelis van Niel's microbiological experiments** and **Ruben, Randall & Kamen's $^{18}\\text{O}$ isotopic tracer validation**: Oxygen gas ($\\text{O}_2$) originates exclusively from the **photolysis of $\\text{H}_2\\text{O}$**, never from $\\text{CO}_2$!

## 2. Chemical & Energetic Precision

### 2.1 The Balanced Stoichiometric Reaction
The complete balanced chemical equation for oxygenic photosynthesis per modern biochemical standards is:

$$6\\text{CO}_2\\text{ (g)} + 12\\text{H}_2\\text{O}\\text{ (l)} \\xrightarrow[\\text{Chloroplast Pigments}]{\\text{Photons }(h\\nu)} \\text{C}_6\\text{H}_{12}\\text{O}_6\\text{ (aq)} + 6\\text{H}_2\\text{O}\\text{ (l)} + 6\\text{O}_2\\text{ (g)} \\uparrow$$

**Where:** $\\text{C}_6\\text{H}_{12}\\text{O}_6$ is D-glucose monosaccharide ($\\Delta G^\\circ = +2870\\text{ kJ/mol}$); $h\\nu$ represents incident photon energy ($h = 6.626 \\times 10^{-34}\\text{ J}\\cdot\\text{s}$); and exactly 12 water molecules provide 24 reducing equivalents ($24e^- + 24\\text{H}^+$).

## 3. The Light-Dependent Phase (Photochemical Reactions)

### 3.1 Photosystems & Pigment Antenna Complexes
- **Photosystem II ($\\text{PS II}$ or $\\text{P}_{680}$):** Reaction center chlorophyll-$a$ with maximal absorption at $\\lambda = 680\\text{ nm}$. Associated with the **Oxygen Evolving Complex (OEC)** on the inner lumenal face of the thylakoid membrane.
- **Photosystem I ($\\text{PS I}$ or $\\text{P}_{700}$):** Reaction center chlorophyll-$a$ with maximal absorption at $\\lambda = 700\\text{ nm}$. Associated with NADP$^+$ reductase facing the stromal exterior.

### 3.2 Catalytic Water Photolysis (Hill Reaction)
The catalytic breakdown of water occurs in the lumenal manganese-calcium cluster ($\\text{Mn}_4\\text{CaO}_5$):

$$2\\text{H}_2\\text{O} \\xrightarrow[\\text{Mn}^{2+},\\,\\text{Cl}^{-},\\,\\text{Ca}^{2+}]{\\text{OEC} \\,/\\, \\text{P}_{680}^+} 4\\text{H}^+_{\\text{lumen}} + 4e^- + \\text{O}_2 \\uparrow$$

**Where:** Electrons fill holes in photo-oxidized $\\text{P}_{680}^+$, protons accumulate in the thylakoid lumen, and $\\text{O}_2$ gas is released as a byproduct.

⚠️ Common Pitfall: Students often forget the essential inorganic mineral cofactors of the Oxygen Evolving Complex! Memorize: **Manganese ($\\text{Mn}^{2+}$)** and **Chloride ($\\text{Cl}^{-}$)** are obligatory ions for water photolysis!

### 3.3 The Z-Scheme & ATP Chemiosmosis
- Non-cyclic electron transport: $\\text{P}_{680} \\rightarrow \\text{Pheophytin} \\rightarrow \\text{PQ} \\rightarrow \\text{Cyt } b_6f \\rightarrow \\text{Plastocyanin (PC)} \\rightarrow \\text{P}_{700} \\rightarrow \\text{Ferredoxin (Fd)} \\rightarrow \\text{FNR} \\rightarrow \\text{NADPH}$.
- Mitchell's Chemiosmotic ATP synthesis across $CF_0-CF_1$ ATP synthase:

$$\\text{ADP} + \\text{P}_i + n\\text{H}^+_{\\text{lumen}} \\xrightarrow{CF_0-CF_1\\text{ ATP Synthase}} \\text{ATP} + \\text{H}_2\\text{O} + n\\text{H}^+_{\\text{stroma}}$$

## 4. The Light-Independent Phase (The Calvin Cycle / $\\text{C}_3$ Pathway)

### 4.1 The Three Definitive Stages
- **Stage 1 (Carboxylation):** Rate-limiting step catalyzed by **RuBisCO**:
$$\\text{RuBP (5C)} + \\text{CO}_2 + \\text{H}_2\\text{O} \\xrightarrow{\\text{RuBisCO}} 2 \\times \\text{3-Phosphoglycerate (3C each)}$$
- **Stage 2 (Reduction):** Consumption of ATP and NADPH to form Glyceraldehyde-3-Phosphate (G3P).
- **Stage 3 (Regeneration):** 5 G3P molecules consume 3 ATP to regenerate 3 molecules of RuBP.

💡 Topper's Mnemonic: **The $1 : 3 : 2$ Golden Ratio of $\\text{C}_3$ Photosynthesis**: Every single $\\text{CO}_2$ fixed consumes **$1\\text{ CO}_2 : 3\\text{ ATP} : 2\\text{ NADPH}$**. Multiply by 6 for Glucose: **$6\\text{ CO}_2 : 18\\text{ ATP} : 12\\text{ NADPH}$**!

⭐ 5-Mark Question Favorite: State the differences between Cyclic and Non-Cyclic Photophosphorylation. Non-cyclic involves both PS I & PS II, evolves $\\text{O}_2$, and produces both ATP and NADPH; cyclic involves only PS I, no $\\text{O}_2$ is evolved, and only ATP is produced.

### Visual Reference / Diagram Blueprint
A clean, hand-drawn study register diagram showing a cross-section of a Chloroplast Thylakoid Membrane with the stroma above and lumen below. Left side shows cylindrical barrel of PS II (P680) with manganese spheres for the Oxygen Evolving Complex splitting 2H2O into 4H+ and O2. Zigzag yellow electron pathway connects PS II to Plastoquinone, Cytochrome b6f, Plastocyanin, and PS I (P700) up to Ferredoxin and FNR forming NADPH. Right side displays CF0-CF1 ATP synthase mushroom knob pumping H+ from lumen to stroma generating ATP.

## Quick Revision Summary
- Dual-Phase Compartmentalization: Light reactions occur across the thylakoid membrane generating assimilatory power (ATP and NADPH); dark reactions occur in the stroma reducing CO2 to sugar.
- Origin of Photolytic Oxygen: Evolved O2 originates from photolysis of H2O at the Mn-cluster of PS II, never from CO2.
- Chemiosmosis: Lumenal proton accumulation (pH 4.5) creates electrochemical gradient powering CF0-CF1 ATP synthesis.
- Calvin Cycle Energetics: Synthesizing 1 mole of Glucose requires 6 turns of the Calvin cycle, consuming 6 CO2, 18 ATP, and 12 NADPH.
- RuBisCO Dual Affinity: RuBisCO acts as carboxylase under high CO2, but initiates photorespiration (C2 cycle) under high O2 and heat.`;
