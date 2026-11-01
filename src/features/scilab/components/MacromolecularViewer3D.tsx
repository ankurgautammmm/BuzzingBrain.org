import React, { useState, useEffect, useRef } from 'react';
import * as $3Dmol from '3dmol';
import { 
  RotateCcw, 
  Play, 
  Pause, 
  ZoomIn, 
  ZoomOut, 
  Camera, 
  Eye, 
  Sliders, 
  Sparkles, 
  ExternalLink,
  Layers,
  HelpCircle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { AlphaFoldPredictionDescriptor, PdbMetadata, UniProtSummary } from '../types';
import { fetchAlphaFoldPrediction, fetchPdbMetadata, fetchUniProtData } from '../api/scienceClient';

interface MacromolecularViewer3DProps {
  initialAccession?: string;
  onSelectResidue?: (residue: { resn: string; resi: number; chain: string; b: number }) => void;
}

export const MacromolecularViewer3D: React.FC<MacromolecularViewer3DProps> = ({
  initialAccession = 'P04637', // TP53 human default
  onSelectResidue
}) => {
  const [accessionInput, setAccessionInput] = useState<string>(initialAccession);
  const [currentId, setCurrentId] = useState<string>(initialAccession);
  const [sourceType, setSourceType] = useState<'alphafold' | 'pdb'>('alphafold');
  const [renderStyle, setRenderStyle] = useState<'cartoon' | 'stick' | 'sphere' | 'surface'>('cartoon');
  const [colorScheme, setColorScheme] = useState<'plddt' | 'secondary' | 'spectrum' | 'chain'>('plddt');
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [darkBackground, setDarkBackground] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Metadata states
  const [afPrediction, setAfPrediction] = useState<AlphaFoldPredictionDescriptor | null>(null);
  const [pdbMeta, setPdbMeta] = useState<PdbMetadata | null>(null);
  const [uniprotData, setUniprotData] = useState<UniProtSummary | null>(null);
  const [hoveredResidue, setHoveredResidue] = useState<{ resn: string; resi: number; chain: string; b: number } | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<any>(null);

  // Apply visual style and coloring
  const applyStyles = (viewer: any, style: string, coloring: string, isAlphaFold: boolean) => {
    if (!viewer) return;

    // Reset styles
    viewer.setStyle({}, {});

    const plddtColorFunc = (atom: any) => {
      const b = atom.b;
      if (b > 90) return '#0053D6'; // Very high (>90): Dark Blue
      if (b > 70) return '#65CBF3'; // Confident (70-90): Light Blue
      if (b > 50) return '#FFDB13'; // Low (50-70): Yellow
      return '#FF7D45';             // Very low (<50): Orange / Disordered
    };

    let colorConfig: any = { color: 'spectrum' };
    if (coloring === 'plddt' && isAlphaFold) {
      colorConfig = { colorfunc: plddtColorFunc };
    } else if (coloring === 'secondary') {
      colorConfig = { colorscheme: 'ssJmol' };
    } else if (coloring === 'chain') {
      colorConfig = { colorscheme: 'chain' };
    }

    if (style === 'cartoon') {
      viewer.setStyle({ hetflag: false }, { cartoon: colorConfig });
      // Show heteroatoms/ligands as sticks
      viewer.setStyle({ hetflag: true, resn: ['HOH', 'WAT'], invert: true }, {
        stick: { radius: 0.25, colorscheme: 'Jmol' },
        sphere: { scale: 0.3, colorscheme: 'Jmol' }
      });
    } else if (style === 'stick') {
      viewer.setStyle({}, { stick: { radius: 0.2, colorscheme: 'Jmol' } });
    } else if (style === 'sphere') {
      viewer.setStyle({}, { sphere: { scale: 0.8, colorscheme: 'Jmol' } });
    } else if (style === 'surface') {
      viewer.setStyle({}, { cartoon: colorConfig });
      viewer.addSurface($3Dmol.SurfaceType?.VDW || 1, { opacity: 0.7, color: '#38bdf8' });
    }

    viewer.render();
  };

  // Load structure into 3Dmol viewer
  const loadStructure = async (queryId: string, type: 'alphafold' | 'pdb') => {
    const clean = queryId.trim();
    if (!clean) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      let cifData = '';
      let isAf = false;

      if (type === 'alphafold') {
        isAf = true;
        const [prediction, uniSummary] = await Promise.all([
          fetchAlphaFoldPrediction(clean),
          fetchUniProtData(clean)
        ]);

        if (!prediction) {
          throw new Error(`No AlphaFold DB structure prediction found for accession "${clean}".`);
        }
        setAfPrediction(prediction);
        setUniprotData(uniSummary);
        setPdbMeta(null);

        // Fetch coordinate file
        const cifRes = await fetch(prediction.cifUrl);
        if (!cifRes.ok) {
          // fallback to pdb format
          const pdbRes = await fetch(prediction.pdbUrl);
          if (!pdbRes.ok) throw new Error('Could not download coordinate file from AlphaFold DB.');
          cifData = await pdbRes.text();
        } else {
          cifData = await cifRes.text();
        }
      } else {
        // RCSB PDB structure
        const [meta, uniSummary] = await Promise.all([
          fetchPdbMetadata(clean),
          fetchUniProtData(clean)
        ]);

        if (!meta) {
          throw new Error(`PDB entry "${clean}" could not be retrieved from RCSB PDB.`);
        }
        setPdbMeta(meta);
        setUniprotData(uniSummary);
        setAfPrediction(null);

        const cifRes = await fetch(meta.cifDownloadUrl);
        if (!cifRes.ok) throw new Error('Failed to download mmCIF coordinates from RCSB PDB.');
        cifData = await cifRes.text();
      }

      // Initialize or reuse viewer
      if (containerRef.current) {
        if (!viewerRef.current) {
          viewerRef.current = $3Dmol.createViewer(containerRef.current, {
            defaultcolors: $3Dmol.rasmolElementColors,
            backgroundColor: darkBackground ? '#0f172a' : '#f8fafc'
          });
        }

        const viewer = viewerRef.current;
        viewer.clear();
        viewer.setBackgroundColor(darkBackground ? '#0f172a' : '#f8fafc');

        // Add model to viewer
        viewer.addModel(cifData, 'cif');

        // Set interactive hover/click handler
        viewer.setClickable({}, true, (atom: any) => {
          if (!atom) return;
          const info = { resn: atom.resn, resi: atom.resi, chain: atom.chain, b: atom.b };
          setHoveredResidue(info);
          if (onSelectResidue) onSelectResidue(info);
        });

        applyStyles(viewer, renderStyle, colorScheme, isAf);
        viewer.zoomTo();
        viewer.render();

        if (isSpinning) {
          viewer.spin('y', 0.5);
        }
      }
    } catch (err: any) {
      console.error('3D structure load error:', err);
      setErrorMsg(err.message || 'Failed to load macromolecular 3D structure.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStructure(currentId, sourceType);
  }, [currentId, sourceType]);

  // Handle style or color change
  useEffect(() => {
    if (viewerRef.current) {
      applyStyles(viewerRef.current, renderStyle, colorScheme, sourceType === 'alphafold');
    }
  }, [renderStyle, colorScheme, sourceType]);

  // Handle background color toggle
  useEffect(() => {
    if (viewerRef.current) {
      viewerRef.current.setBackgroundColor(darkBackground ? '#0f172a' : '#f8fafc');
      viewerRef.current.render();
    }
  }, [darkBackground]);

  // Handle spin toggle
  const toggleSpin = () => {
    if (!viewerRef.current) return;
    if (isSpinning) {
      viewerRef.current.spin(false);
      setIsSpinning(false);
    } else {
      viewerRef.current.spin('y', 0.8);
      setIsSpinning(true);
    }
  };

  // Zoom controls
  const handleZoom = (factor: number) => {
    if (!viewerRef.current) return;
    viewerRef.current.zoom(factor);
    viewerRef.current.render();
  };

  const handleResetCamera = () => {
    if (!viewerRef.current) return;
    viewerRef.current.zoomTo();
    viewerRef.current.render();
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-sm">
      {/* Left 3D Viewport Pane (60%) */}
      <div className="flex-1 flex flex-col">
        {/* Quick Example Accession Chips */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
              Benchmark Structures:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { name: 'TP53 (p53)', id: 'P04637', type: 'alphafold' as const },
                { name: 'EGFR Kinase', id: 'P00533', type: 'alphafold' as const },
                { name: 'BRCA1', id: 'P38398', type: 'alphafold' as const },
                { name: 'PCSK9', id: 'Q8NBP7', type: 'alphafold' as const },
                { name: '4HHB (Hemoglobin)', id: '4HHB', type: 'pdb' as const },
                { name: '1BNA (B-DNA)', id: '1BNA', type: 'pdb' as const },
              ].map(bench => (
                <button
                  key={bench.id}
                  onClick={() => {
                    setAccessionInput(bench.id);
                    setSourceType(bench.type);
                    setCurrentId(bench.id);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                    currentId === bench.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>{bench.name}</span>
                  <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                    currentId === bench.id ? 'bg-blue-700 text-blue-100' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {bench.id}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setCurrentId(accessionInput.trim());
            }}
            className="flex items-center gap-2"
          >
            <select
              value={sourceType}
              onChange={(e) => setSourceType(e.target.value as any)}
              className="bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="alphafold">AlphaFold DB (UniProt)</option>
              <option value="pdb">RCSB PDB</option>
            </select>
            <input
              type="text"
              value={accessionInput}
              onChange={(e) => setAccessionInput(e.target.value)}
              placeholder="e.g. P04637, EGFR, 4HHB"
              className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-36 sm:w-44"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
            >
              Load 3D
            </button>
          </form>
        </div>

        {/* 3D WebGL Canvas Container */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-inner bg-slate-950 min-h-[480px]">
          <div
            ref={containerRef}
            className="w-full h-[480px] relative block cursor-grab active:cursor-grabbing"
          />

          {loading && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-3 z-20">
              <div className="w-8 h-8 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-mono text-slate-300">
                Fetching coordinate file &amp; building 3D WebGL meshes...
              </span>
            </div>
          )}

          {errorMsg && (
            <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center z-20">
              <AlertCircle className="w-8 h-8 text-rose-500 mb-2" />
              <div className="text-sm font-bold text-white mb-1">Structure Retrieval Error</div>
              <p className="text-xs text-slate-400 max-w-md mb-4">{errorMsg}</p>
              <button
                onClick={() => {
                  setAccessionInput('P04637');
                  setSourceType('alphafold');
                  setCurrentId('P04637');
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Load Default Human TP53
              </button>
            </div>
          )}

          {/* Floating Viewport Controls */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md border border-slate-700 p-1 rounded-xl z-10 shadow-md">
            <button
              onClick={toggleSpin}
              className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                isSpinning ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-slate-300 hover:bg-slate-800'
              }`}
              title="Toggle Auto-Rotation"
            >
              {isSpinning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={() => handleZoom(1.2)}
              className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800 transition cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleZoom(0.8)}
              className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800 transition cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetCamera}
              className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800 transition cursor-pointer"
              title="Reset Camera Center"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDarkBackground(!darkBackground)}
              className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800 transition cursor-pointer"
              title="Toggle Light/Dark Background"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Selected / Hovered Residue HUD */}
          {hoveredResidue && (
            <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-mono text-slate-200 z-10 shadow-md flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span>
                Residue: <strong>{hoveredResidue.resn} {hoveredResidue.resi}</strong> (Chain {hoveredResidue.chain})
              </span>
              <span className="text-slate-400">|</span>
              <span className="text-cyan-300">
                pLDDT / B-factor: <strong>{hoveredResidue.b.toFixed(1)}</strong>
              </span>
            </div>
          )}

          {/* AlphaFold Canonical 4-Tier pLDDT Confidence Legend */}
          {sourceType === 'alphafold' && (
            <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-[11px] z-10 font-mono text-slate-300">
              <span className="font-bold text-white flex items-center gap-1.5">
                <span>AlphaFold pLDDT Confidence:</span>
              </span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm bg-[#0053D6] inline-block" />
                  <span>&gt;90 Very High</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm bg-[#65CBF3] inline-block" />
                  <span>70-90 Confident</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm bg-[#FFDB13] inline-block" />
                  <span>50-70 Low</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm bg-[#FF7D45] inline-block" />
                  <span>&lt;50 Disordered</span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Viewport Render Style Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 bg-white border border-slate-200 rounded-2xl p-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Display Style:</span>
            {(['cartoon', 'stick', 'sphere', 'surface'] as const).map(style => (
              <button
                key={style}
                onClick={() => setRenderStyle(style)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition cursor-pointer ${
                  renderStyle === style
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {style}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Coloring:</span>
            {(['plddt', 'secondary', 'spectrum', 'chain'] as const).map(color => (
              <button
                key={color}
                onClick={() => setColorScheme(color)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition cursor-pointer ${
                  colorScheme === color
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {color === 'plddt' ? 'AlphaFold pLDDT' : color}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Metadata Inspector Pane (40%) */}
      <div className="w-full xl:w-96 flex flex-col gap-4">
        {/* Epistemic Provenance Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {sourceType === 'alphafold' ? '[Predicted by model - AlphaFold DB]' : '[Experimentally determined - RCSB PDB]'}
            </span>
            <span className="text-xs font-mono font-bold text-slate-800">{currentId}</span>
          </div>

          {uniprotData && (
            <div>
              <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                {uniprotData.proteinName}
              </h3>
              <div className="text-xs text-slate-500 font-mono mt-0.5">
                Gene: <strong className="text-slate-800">{uniprotData.geneSymbol}</strong> | Organism: {uniprotData.organism}
              </div>

              {uniprotData.functionSummary && (
                <p className="mt-3 text-xs text-slate-600 leading-relaxed line-clamp-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {uniprotData.functionSummary}
                </p>
              )}
            </div>
          )}

          {pdbMeta && (
            <div className="mt-3 space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
              <div className="flex justify-between">
                <span>Method:</span>
                <span className="font-mono font-semibold text-slate-900">{pdbMeta.experimentalMethod}</span>
              </div>
              {pdbMeta.resolution && (
                <div className="flex justify-between">
                  <span>Resolution:</span>
                  <span className="font-mono font-semibold text-slate-900">{pdbMeta.resolution.toFixed(2)} Å</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Molecular Weight:</span>
                <span className="font-mono text-slate-800">{(pdbMeta.molecularWeight / 1000).toFixed(1)} kDa</span>
              </div>
            </div>
          )}

          {/* Outbound Authoritative Links */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2 text-xs">
            {sourceType === 'alphafold' && (
              <a
                href={`https://alphafold.ebi.ac.uk/entry/${currentId}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold"
              >
                <span>AlphaFold Record</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {pdbMeta && (
              <a
                href={`https://www.rcsb.org/structure/${pdbMeta.pdbId}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold"
              >
                <span>RCSB PDB Record</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {uniprotData && (
              <a
                href={`https://www.uniprot.org/uniprotkb/${uniprotData.accession}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold"
              >
                <span>UniProtKB Entry</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Curated Active Sites & Functional Domains */}
        {uniprotData && uniprotData.features.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h4 className="font-bold text-slate-900 text-sm flex items-center justify-between mb-3">
              <span>Annotated Functional Features</span>
              <span className="text-xs text-slate-400 font-mono font-normal">
                {uniprotData.features.length} Sites
              </span>
            </h4>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {uniprotData.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl border border-slate-100 hover:border-slate-300 bg-slate-50 transition cursor-pointer text-xs"
                >
                  <div className="flex items-center justify-between font-bold text-slate-800 mb-0.5">
                    <span className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${
                        feat.type === 'Active site' ? 'bg-rose-500' :
                        feat.type === 'Binding site' ? 'bg-amber-500' : 'bg-blue-500'
                      }`} />
                      <span>{feat.type}</span>
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">
                      Residue {feat.start}{feat.end && feat.end !== feat.start ? `–${feat.end}` : ''}
                    </span>
                  </div>
                  <div className="text-slate-600 text-[11px] leading-snug line-clamp-2">
                    {feat.description || 'Catalytic or structural binding determinant'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
