import React, { useState, useEffect, useRef } from 'react';
import SmilesDrawer from 'smiles-drawer';
import { 
  Search, 
  FlaskConical, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ExternalLink, 
  Activity, 
  ShieldCheck, 
  Layers, 
  Sparkles,
  Info,
  Compass
} from 'lucide-react';
import { ChemicalProperties, DrugLikenessEvaluation, ChEMBLBioactivity } from '../types';
import { fetchPubChemCompound, evaluateDrugLikeness, fetchChEMBLBioactivities } from '../api/scienceClient';

export const ChemistryDrugWorkbench: React.FC = () => {
  const [searchInput, setSearchInput] = useState<string>('Imatinib');
  const [activeQuery, setActiveQuery] = useState<string>('Imatinib');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [compound, setCompound] = useState<ChemicalProperties | null>(null);
  const [drugLikeness, setDrugLikeness] = useState<DrugLikenessEvaluation | null>(null);
  const [bioactivities, setBioactivities] = useState<ChEMBLBioactivity[]>([]);
  const [canvasViewMode, setCanvasViewMode] = useState<'smiles-drawer' | 'pubchem-img'>('smiles-drawer');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Quick Benchmark Drug Chips
  const BENCHMARK_DRUGS = [
    { name: 'Imatinib (Gleevec)', query: 'Imatinib', class: 'Tyrosine Kinase Inhibitor' },
    { name: 'Aspirin', query: 'Aspirin', class: 'COX Inhibitor' },
    { name: 'Caffeine', query: 'Caffeine', class: 'Adenosine Antagonist' },
    { name: 'Remdesivir', query: 'Remdesivir', class: 'RNA Polymerase Inhibitor' },
    { name: 'Doxorubicin', query: 'Doxorubicin', class: 'Topoisomerase II Inhibitor' },
    { name: 'Atorvastatin (Lipitor)', query: 'Atorvastatin', class: 'HMG-CoA Reductase Inhibitor' },
  ];

  const loadCompound = async (query: string) => {
    const clean = query.trim();
    if (!clean) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const data = await fetchPubChemCompound(clean);
      if (!data) {
        throw new Error(`Compound "${clean}" was not found in the PubChem PUG REST database.`);
      }

      setCompound(data);
      const evalResult = evaluateDrugLikeness(data);
      setDrugLikeness(evalResult);

      // Attempt ChEMBL target & bioactivity fetch if compound is known
      const chemblData = await fetchChEMBLBioactivities(data.name || query);
      setBioactivities(chemblData);
    } catch (err: any) {
      console.error('PubChem compound fetch error:', err);
      setErrorMsg(err.message || 'Could not fetch chemical compound data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompound(activeQuery);
  }, [activeQuery]);

  // Render SMILES to canvas with SmilesDrawer
  useEffect(() => {
    if (!compound || !compound.canonicalSmiles || !canvasRef.current) return;

    try {
      const canvas = canvasRef.current;
      const options = {
        width: 380,
        height: 280,
        bondThickness: 1.8,
        bondLength: 16,
        themes: {
          light: {
            C: '#1e293b',
            O: '#dc2626',
            N: '#2563eb',
            S: '#d97706',
            P: '#ea580c',
            Cl: '#16a34a',
            F: '#0d9488',
            Br: '#9333ea',
            BACKGROUND: 'transparent'
          }
        }
      };

      const drawer = new SmilesDrawer.Drawer(options);
      SmilesDrawer.parse(
        compound.canonicalSmiles,
        (tree: any) => {
          drawer.draw(tree, canvas, 'light', false);
        },
        (err: any) => {
          console.warn('SmilesDrawer parse error; falling back to PubChem depiction:', err);
          setCanvasViewMode('pubchem-img');
        }
      );
    } catch (err) {
      console.warn('SmilesDrawer execution warning:', err);
      setCanvasViewMode('pubchem-img');
    }
  }, [compound]);

  return (
    <div className="flex flex-col gap-6 bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-sm">
      {/* Top Search & Benchmark Drug Chips Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
            Benchmark Molecules:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {BENCHMARK_DRUGS.map(drug => (
              <button
                key={drug.query}
                onClick={() => {
                  setSearchInput(drug.query);
                  setActiveQuery(drug.query);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  activeQuery === drug.query
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{drug.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setActiveQuery(searchInput.trim());
          }}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search compound (e.g. Aspirin, CID)"
              className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
          >
            Query PubChem
          </button>
        </form>
      </div>

      {loading && (
        <div className="py-16 flex flex-col items-center justify-center text-slate-600 gap-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono">Retrieving chemical properties &amp; 2D topology from PubChem...</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {compound && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Column 1: 2D Chemical Structure Depiction (4 cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4 text-blue-600" />
                <span>2D Chemical Topology</span>
              </span>
              <div className="flex bg-slate-100 p-0.5 rounded-lg text-[10px] font-semibold">
                <button
                  onClick={() => setCanvasViewMode('smiles-drawer')}
                  className={`px-2 py-0.5 rounded transition ${canvasViewMode === 'smiles-drawer' ? 'bg-white shadow-xs text-blue-600 font-bold' : 'text-slate-600'}`}
                >
                  Vector
                </button>
                <button
                  onClick={() => setCanvasViewMode('pubchem-img')}
                  className={`px-2 py-0.5 rounded transition ${canvasViewMode === 'pubchem-img' ? 'bg-white shadow-xs text-blue-600 font-bold' : 'text-slate-600'}`}
                >
                  PubChem
                </button>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center min-h-[260px] bg-slate-50 border border-slate-100 rounded-xl p-3 relative">
              {canvasViewMode === 'smiles-drawer' ? (
                <canvas ref={canvasRef} width={360} height={260} className="max-w-full block" />
              ) : (
                <img
                  src={compound.image2dUrl}
                  alt={compound.name}
                  className="max-h-60 max-w-full object-contain"
                />
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">
                Canonical SMILES
              </div>
              <div className="text-xs font-mono text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200 break-all select-all">
                {compound.canonicalSmiles}
              </div>
            </div>
          </div>

          {/* Column 2: Physicochemical Properties & Descriptors (4 cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  [Curated - PubChem PUG REST]
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">CID: {compound.cid}</span>
              </div>

              <h3 className="font-extrabold text-lg text-slate-900 capitalize">
                {compound.name}
              </h3>
              {compound.iupacName && (
                <p className="text-[11px] text-slate-500 font-mono mt-0.5 line-clamp-2">
                  {compound.iupacName}
                </p>
              )}

              {/* Property Matrix Grid */}
              <div className="grid grid-cols-2 gap-2.5 mt-4">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-500">Molecular Formula</div>
                  <div className="font-mono font-bold text-slate-900 text-sm">{compound.molecularFormula}</div>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-500">Molecular Weight</div>
                  <div className="font-mono font-bold text-slate-900 text-sm">{compound.molecularWeight.toFixed(2)} g/mol</div>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-500">Lipophilicity (XLogP)</div>
                  <div className="font-mono font-bold text-slate-900 text-sm">
                    {compound.xLogP !== undefined ? compound.xLogP.toFixed(2) : 'N/A'}
                  </div>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-500">Polar Surface Area (TPSA)</div>
                  <div className="font-mono font-bold text-slate-900 text-sm">
                    {compound.tpsa !== undefined ? `${compound.tpsa.toFixed(1)} Å²` : 'N/A'}
                  </div>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-500">H-Bond Donors</div>
                  <div className="font-mono font-bold text-slate-900 text-sm">{compound.hBondDonorCount ?? 0}</div>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-500">H-Bond Acceptors</div>
                  <div className="font-mono font-bold text-slate-900 text-sm">{compound.hBondAcceptorCount ?? 0}</div>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-500">Rotatable Bonds</div>
                  <div className="font-mono font-bold text-slate-900 text-sm">{compound.rotatableBondCount ?? 0}</div>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-500">Complexity</div>
                  <div className="font-mono font-bold text-slate-900 text-sm">{compound.complexity ?? 'N/A'}</div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <a
                href={`https://pubchem.ncbi.nlm.nih.gov/compound/${compound.cid}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold"
              >
                <span>PubChem Full Record</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="font-mono text-[10px] text-slate-400">InChIKey: {compound.inchiKey?.slice(0, 14)}...</span>
            </div>
          </div>

          {/* Column 3: Lipinski's Rule of 5 & Veber Drug-Likeness (4 cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Drug-Likeness &amp; Oral Bioavailability</span>
                </span>
                {drugLikeness && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    drugLikeness.lipinskiPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {drugLikeness.lipinskiPassed ? 'PASSED RO5' : 'VIOLATION'}
                  </span>
                )}
              </div>

              {drugLikeness && (
                <div className="space-y-3">
                  {/* Bioavailability Score Pill */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Predicted Bioavailability Score
                      </div>
                      <div className="text-xs text-slate-600">
                        {drugLikeness.bioavailabilityScore >= 80 ? 'High oral bioavailability' : 'Moderate / formulation dependent'}
                      </div>
                    </div>
                    <div className="text-xl font-black font-mono text-blue-600">
                      {drugLikeness.bioavailabilityScore}%
                    </div>
                  </div>

                  {/* Rules Checklist */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-700">1. Molecular Weight ≤ 500 Da</span>
                      {compound.molecularWeight <= 500 ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-700">2. LogP ≤ 5.0 (Lipophilicity)</span>
                      {(compound.xLogP ?? 0) <= 5.0 ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-700">3. H-Bond Donors ≤ 5</span>
                      {(compound.hBondDonorCount ?? 0) <= 5 ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-700">4. H-Bond Acceptors ≤ 10</span>
                      {(compound.hBondAcceptorCount ?? 0) <= 10 ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-700">5. Veber: Rotatable Bonds ≤ 10</span>
                      {(compound.rotatableBondCount ?? 0) <= 10 ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-amber-500 shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-700">6. Veber: TPSA ≤ 140 Å²</span>
                      {(compound.tpsa ?? 0) <= 140 ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-amber-500 shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
              <span className="font-semibold text-slate-700">Blood-Brain Barrier: </span>
              {drugLikeness?.bloodBrainBarrierPenetration ? (
                <span className="text-emerald-600 font-bold">Predicted Permeable</span>
              ) : (
                <span className="text-slate-500">Low CNS Permeation (Peripheral selectivity)</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
