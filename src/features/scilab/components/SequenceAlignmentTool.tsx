import React, { useState } from 'react';
import { 
  GitCompare, 
  Dna, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';

const KYTE_DOOLITTLE_HYDROPATHY: Record<string, number> = {
  I: 4.5, V: 4.2, L: 3.8, F: 2.8, C: 2.5, M: 1.9, A: 1.8, G: -0.4,
  T: -0.7, S: -0.8, W: -0.9, Y: -1.3, P: -1.6, H: -3.2, E: -3.5,
  Q: -3.5, D: -3.5, N: -3.5, K: -3.9, R: -4.5
};

const AMINO_ACID_NAMES: Record<string, { name: string; charge: number; type: string }> = {
  A: { name: 'Alanine', charge: 0, type: 'Aliphatic' },
  R: { name: 'Arginine', charge: 1, type: 'Basic / Positively Charged' },
  N: { name: 'Asparagine', charge: 0, type: 'Polar Neutral' },
  D: { name: 'Aspartate', charge: -1, type: 'Acidic / Negatively Charged' },
  C: { name: 'Cysteine', charge: 0, type: 'Thiol / Polar' },
  E: { name: 'Glutamate', charge: -1, type: 'Acidic / Negatively Charged' },
  Q: { name: 'Glutamine', charge: 0, type: 'Polar Neutral' },
  G: { name: 'Glycine', charge: 0, type: 'Conformationally Flexible' },
  H: { name: 'Histidine', charge: 0.1, type: 'Aromatic / Weak Base' },
  I: { name: 'Isoleucine', charge: 0, type: 'Aliphatic Hydrophobic' },
  L: { name: 'Leucine', charge: 0, type: 'Aliphatic Hydrophobic' },
  K: { name: 'Lysine', charge: 1, type: 'Basic / Positively Charged' },
  M: { name: 'Methionine', charge: 0, type: 'Hydrophobic / Thioether' },
  F: { name: 'Phenylalanine', charge: 0, type: 'Aromatic Hydrophobic' },
  P: { name: 'Proline', charge: 0, type: 'Cyclic / Helix Breaker' },
  S: { name: 'Serine', charge: 0, type: 'Polar / Hydroxyl' },
  T: { name: 'Threonine', charge: 0, type: 'Polar / Hydroxyl' },
  W: { name: 'Tryptophan', charge: 0, type: 'Aromatic Hydrophobic' },
  Y: { name: 'Tyrosine', charge: 0, type: 'Aromatic / Phenolic' },
  V: { name: 'Valine', charge: 0, type: 'Aliphatic Hydrophobic' },
};

export const SequenceAlignmentTool: React.FC = () => {
  // Mutation Analyzer State
  const [wtResidue, setWtResidue] = useState<string>('R');
  const [position, setPosition] = useState<number>(175);
  const [mutResidue, setMutResidue] = useState<string>('H');

  // DNA to Protein Translation State
  const [dnaInput, setDnaInput] = useState<string>('ATGGAGGAGCCGCAGTCAGATCCTAGCGTCGAGCCCCCTCTGAGTCAGGAAACATTTTCAGACCTA');

  // Benchmark Mutation Presets
  const CANCER_MUTATIONS = [
    { gene: 'TP53', code: 'R175H', wt: 'R', pos: 175, mut: 'H', desc: 'Zinc-binding structural domain hot-spot mutation (Dominant-negative)' },
    { gene: 'TP53', code: 'R248Q', wt: 'R', pos: 248, mut: 'Q', desc: 'Direct DNA minor groove contact residue disruption' },
    { gene: 'EGFR', code: 'L858R', wt: 'L', pos: 858, mut: 'R', desc: 'Kinase activation loop oncogenic mutation (Gefitinib / Erlotinib sensitizing)' },
    { gene: 'EGFR', code: 'T790M', wt: 'T', pos: 790, mut: 'M', desc: 'Gatekeeper mutation conferring 1st-gen TKI drug resistance' },
    { gene: 'BRAF', code: 'V600E', wt: 'V', pos: 600, mut: 'E', desc: 'Kinase activation phosphomimetic oncogenic driver' },
  ];

  // Translation function
  const translateDna = (dna: string): { protein: string; codons: string[] } => {
    const clean = dna.toUpperCase().replace(/[^ATGC]/g, '');
    const codons: string[] = [];
    let protein = '';

    const CODON_TABLE: Record<string, string> = {
      TTT: 'F', TTC: 'F', TTA: 'L', TTG: 'L',
      CTT: 'L', CTC: 'L', CTA: 'L', CTG: 'L',
      ATT: 'I', ATC: 'I', ATA: 'I', ATG: 'M', // Start
      GTT: 'V', GTC: 'V', GTA: 'V', GTG: 'V',
      TCT: 'S', TCC: 'S', TCA: 'S', TCG: 'S',
      CCT: 'P', CCC: 'P', CCA: 'P', CCG: 'P',
      ACT: 'T', ACC: 'T', ACA: 'T', ACG: 'T',
      GCT: 'A', GCC: 'A', GCA: 'A', GCG: 'A',
      TAT: 'Y', TAC: 'Y', TAA: '*', TAG: '*', // Stop
      CAT: 'H', CAC: 'H', CAA: 'Q', CAG: 'Q',
      AAT: 'N', AAC: 'N', AAA: 'K', AAG: 'K',
      GAT: 'D', GAC: 'D', GAA: 'E', GAG: 'E',
      TGT: 'C', TGC: 'C', TGA: '*', TGG: 'W', // Stop
      CGT: 'R', CGC: 'R', CGA: 'R', CGG: 'R',
      AGT: 'S', AGC: 'S', AGA: 'R', AGG: 'R',
      GGT: 'G', GGC: 'G', GGA: 'G', GGG: 'G',
    };

    for (let i = 0; i < clean.length - 2; i += 3) {
      const triplet = clean.substring(i, i + 3);
      codons.push(triplet);
      protein += CODON_TABLE[triplet] || '?';
    }

    return { protein, codons };
  };

  const { protein, codons } = translateDna(dnaInput);

  // Analyze mutation
  const wtInfo = AMINO_ACID_NAMES[wtResidue] || { name: wtResidue, charge: 0, type: 'Unknown' };
  const mutInfo = AMINO_ACID_NAMES[mutResidue] || { name: mutResidue, charge: 0, type: 'Unknown' };

  const wtHydro = KYTE_DOOLITTLE_HYDROPATHY[wtResidue] ?? 0;
  const mutHydro = KYTE_DOOLITTLE_HYDROPATHY[mutResidue] ?? 0;
  const hydroDelta = mutHydro - wtHydro;

  const chargeShift = mutInfo.charge - wtInfo.charge;
  const isRadical = Math.abs(hydroDelta) > 2.0 || Math.abs(chargeShift) >= 1.0 || (mutResidue === 'P' || wtResidue === 'P');

  return (
    <div className="flex flex-col gap-6 bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-sm">
      {/* Benchmark Cancer Variants Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
            Pathogenic Benchmarks:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {CANCER_MUTATIONS.map(m => (
              <button
                key={m.code}
                onClick={() => {
                  setWtResidue(m.wt);
                  setPosition(m.pos);
                  setMutResidue(m.mut);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  wtResidue === m.wt && position === m.pos && mutResidue === m.mut
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span className="font-mono font-bold">{m.gene} {m.code}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card: Point Mutation Physicochemical Impact Evaluator */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                [In silico Variant Effect Analyzer]
              </span>
              <span className="text-xs font-mono font-bold text-slate-600">
                p.{wtResidue}{position}{mutResidue}
              </span>
            </div>

            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2 mb-2">
              <GitCompare className="w-4 h-4 text-rose-600" />
              <span>Point Mutation Biophysical Consequence</span>
            </h3>

            {/* Mutation Input Form */}
            <div className="grid grid-cols-3 gap-3 my-4">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Wild-Type Residue</label>
                <select
                  value={wtResidue}
                  onChange={(e) => setWtResidue(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold text-slate-800"
                >
                  {Object.keys(AMINO_ACID_NAMES).sort().map(aa => (
                    <option key={aa} value={aa}>{aa} ({AMINO_ACID_NAMES[aa].name})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Residue Position</label>
                <input
                  type="number"
                  value={position}
                  onChange={(e) => setPosition(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Mutant Residue</label>
                <select
                  value={mutResidue}
                  onChange={(e) => setMutResidue(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold text-slate-800"
                >
                  {Object.keys(AMINO_ACID_NAMES).sort().map(aa => (
                    <option key={aa} value={aa}>{aa} ({AMINO_ACID_NAMES[aa].name})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Detailed Biophysical Shift Matrix */}
            <div className="space-y-3 pt-2">
              {/* Substitution Classification Banner */}
              <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                isRadical ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}>
                <div className="flex items-center gap-2">
                  {isRadical ? <AlertTriangle className="w-4 h-4 text-rose-600" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  <span className="font-bold">
                    {isRadical ? 'Radical / Non-Conservative Substitution' : 'Conservative Substitution'}
                  </span>
                </div>
                <span className="font-mono text-[10px] uppercase font-bold">
                  {isRadical ? 'High destabilization probability' : 'Low structural disruption'}
                </span>
              </div>

              {/* Side-by-Side Comparison */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <div className="text-[10px] text-slate-500 font-mono">Wild-Type ({wtResidue})</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{wtInfo.name}</div>
                  <div className="text-slate-600 text-[11px] mt-1">Class: {wtInfo.type}</div>
                  <div className="text-slate-600 text-[11px]">Formal Charge: {wtInfo.charge > 0 ? `+${wtInfo.charge}` : wtInfo.charge}</div>
                  <div className="text-slate-600 text-[11px]">Hydropathy: {wtHydro.toFixed(1)}</div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <div className="text-[10px] text-slate-500 font-mono">Mutant ({mutResidue})</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{mutInfo.name}</div>
                  <div className="text-slate-600 text-[11px] mt-1">Class: {mutInfo.type}</div>
                  <div className="text-slate-600 text-[11px]">Formal Charge: {mutInfo.charge > 0 ? `+${mutInfo.charge}` : mutInfo.charge}</div>
                  <div className="text-slate-600 text-[11px]">Hydropathy: {mutHydro.toFixed(1)}</div>
                </div>
              </div>

              {/* Delta Properties */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span>Charge Shift (Δq):</span>
                  <span className="font-mono font-bold text-slate-900">
                    {chargeShift > 0 ? `+${chargeShift}` : chargeShift}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Hydropathy Shift (ΔH):</span>
                  <span className={`font-mono font-bold ${hydroDelta > 0 ? 'text-blue-600' : 'text-amber-600'}`}>
                    {hydroDelta > 0 ? `+${hydroDelta.toFixed(1)} (More hydrophobic)` : `${hydroDelta.toFixed(1)} (More polar)`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: DNA Codon Translation & Open Reading Frame Inspector */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                [Standard Genetic Code Translator]
              </span>
              <span className="text-xs font-mono font-bold text-slate-500">{protein.length} Amino Acids</span>
            </div>

            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2 mb-1">
              <Dna className="w-4 h-4 text-blue-600" />
              <span>DNA Triplet to Polypeptide Sequence</span>
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Standard vertebrate codon translation with 5' to 3' triplet parsing.
            </p>

            <textarea
              value={dnaInput}
              onChange={(e) => setDnaInput(e.target.value.toUpperCase())}
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase tracking-widest leading-relaxed resize-none"
              placeholder="Enter nucleotide sequence (A, T, G, C)"
            />

            {/* Translated Amino Acid Chain */}
            <div className="mt-4">
              <div className="text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">
                Translated Polypeptide (1-letter code)
              </div>
              <div className="bg-slate-900 text-emerald-400 font-mono text-xs p-3 rounded-xl border border-slate-800 break-all select-all leading-relaxed">
                {protein}
              </div>
            </div>

            {/* Triplet Visualization */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="text-[10px] font-mono font-bold uppercase text-slate-400 mb-2">
                First 8 Codon Mappings
              </div>
              <div className="flex flex-wrap gap-1.5">
                {codons.slice(0, 8).map((triplet, idx) => {
                  const aa = protein[idx] || '';
                  return (
                    <div
                      key={idx}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-center font-mono text-xs"
                    >
                      <div className="text-[10px] text-slate-400">{triplet}</div>
                      <div className="font-bold text-blue-600">{aa}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
