import React, { useState } from 'react';
import { 
  Dna, 
  Flame, 
  FlaskConical, 
  GitBranch, 
  Layers, 
  Sparkles, 
  Database, 
  Activity, 
  ShieldCheck, 
  ExternalLink,
  BookOpen,
  Info,
  ChevronRight
} from 'lucide-react';
import { MacromolecularViewer3D } from './components/MacromolecularViewer3D';
import { MolecularDynamicsSimulator } from './components/MolecularDynamicsSimulator';
import { ChemistryDrugWorkbench } from './components/ChemistryDrugWorkbench';
import { BioinformaticsDatabaseExplorer } from './components/BioinformaticsDatabaseExplorer';
import { SequenceAlignmentTool } from './components/SequenceAlignmentTool';

export type SciLabTab = 
  | 'macromolecules' 
  | 'molecular-dynamics' 
  | 'chemistry-drug' 
  | 'pathways-interactome' 
  | 'sequence-mutation';

export const SciLabStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SciLabTab>('macromolecules');

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 pb-16 font-sans">
      {/* Top Publication-Grade Scientific Workbench Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="p-1.5 rounded-xl bg-blue-600 text-white shadow-xs">
                  <Dna className="w-5 h-5 animate-spin-slow" />
                </span>
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>SciLab</span>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    BioMolecular Studio
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                Powered by <strong>AlphaFold DB</strong>, <strong>RCSB PDB</strong>, <strong>UniProtKB</strong>, <strong>PubChem PUG REST</strong>, <strong>ChEMBL</strong>, <strong>Reactome</strong>, and <strong>Interactive Verlet Molecular Dynamics</strong>.
              </p>
            </div>

            {/* Quick Provenance Badges */}
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-slate-500">
              <span className="px-2 py-1 rounded-md bg-slate-100 border border-slate-200 flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                AlphaFold v6 pLDDT
              </span>
              <span className="px-2 py-1 rounded-md bg-slate-100 border border-slate-200 flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                Velocity Verlet 60fps
              </span>
              <span className="px-2 py-1 rounded-md bg-slate-100 border border-slate-200 flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                Lipinski Ro5 &amp; Veber
              </span>
            </div>
          </div>

          {/* Sub-Tabs Navigation */}
          <div className="flex overflow-x-auto no-scrollbar gap-2 mt-4 pt-2 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('macromolecules')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                activeTab === 'macromolecules'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Dna className="w-4 h-4" />
              <span>3D Macromolecules &amp; AlphaFold</span>
            </button>

            <button
              onClick={() => setActiveTab('molecular-dynamics')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                activeTab === 'molecular-dynamics'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Flame className="w-4 h-4 text-rose-500" />
              <span>Molecular Dynamics (MD) Simulator</span>
            </button>

            <button
              onClick={() => setActiveTab('chemistry-drug')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                activeTab === 'chemistry-drug'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <FlaskConical className="w-4 h-4 text-emerald-500" />
              <span>Chemistry &amp; Drug Discovery</span>
            </button>

            <button
              onClick={() => setActiveTab('pathways-interactome')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                activeTab === 'pathways-interactome'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <GitBranch className="w-4 h-4 text-purple-500" />
              <span>Pathways &amp; PPI Networks</span>
            </button>

            <button
              onClick={() => setActiveTab('sequence-mutation')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                activeTab === 'sequence-mutation'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Layers className="w-4 h-4 text-amber-500" />
              <span>Sequence &amp; Mutation Analyzer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace View */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {activeTab === 'macromolecules' && (
          <div>
            <div className="mb-4">
              <h2 className="text-base font-extrabold text-slate-900">
                3D Macromolecular &amp; AlphaFold Structure Explorer
              </h2>
              <p className="text-xs text-slate-500">
                Load atomic coordinate models from AlphaFold DB (200M+ predictions) or experimental crystal structures from RCSB PDB with canonical pLDDT confidence gradients.
              </p>
            </div>
            <MacromolecularViewer3D initialAccession="P04637" />
          </div>
        )}

        {activeTab === 'molecular-dynamics' && (
          <div>
            <div className="mb-4">
              <h2 className="text-base font-extrabold text-slate-900">
                Interactive Velocity Verlet Molecular Dynamics Engine
              </h2>
              <p className="text-xs text-slate-500">
                Simulate multi-body peptide mechanics, Lennard-Jones (12-6) potentials, harmonic bond vibrations, and thermal denaturation under a Berendsen thermostat.
              </p>
            </div>
            <MolecularDynamicsSimulator />
          </div>
        )}

        {activeTab === 'chemistry-drug' && (
          <div>
            <div className="mb-4">
              <h2 className="text-base font-extrabold text-slate-900">
                Medicinal Chemistry &amp; Drug Discovery Workbench
              </h2>
              <p className="text-xs text-slate-500">
                Query small molecules across PubChem PUG REST, render 2D chemical topologies with SmilesDrawer, and calculate Lipinski&apos;s Rule of Five and Veber oral bioavailability criteria.
              </p>
            </div>
            <ChemistryDrugWorkbench />
          </div>
        )}

        {activeTab === 'pathways-interactome' && (
          <div>
            <div className="mb-4">
              <h2 className="text-base font-extrabold text-slate-900">
                Biological Pathways &amp; Protein-Protein Interactomes
              </h2>
              <p className="text-xs text-slate-500">
                Query multi-channel evidence scores from STRING DB v12 and explore biochemical reaction cascades from the curated Reactome knowledgebase.
              </p>
            </div>
            <BioinformaticsDatabaseExplorer />
          </div>
        )}

        {activeTab === 'sequence-mutation' && (
          <div>
            <div className="mb-4">
              <h2 className="text-base font-extrabold text-slate-900">
                Sequence Translation &amp; Variant Biophysical Consequence
              </h2>
              <p className="text-xs text-slate-500">
                Examine amino acid hydropathy shifts, formal charge mutations, and translate 5&apos; to 3&apos; nucleotide triplets into peptide chains.
              </p>
            </div>
            <SequenceAlignmentTool />
          </div>
        )}
      </div>
    </div>
  );
};
