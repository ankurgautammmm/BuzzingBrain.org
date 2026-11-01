import React, { useState, useEffect } from 'react';
import { 
  GitBranch, 
  Share2, 
  ExternalLink, 
  Layers, 
  Activity, 
  Sparkles, 
  CheckCircle2, 
  Search,
  AlertCircle
} from 'lucide-react';
import { StringInteractionPartner, ReactomePathway, UniProtSummary } from '../types';
import { fetchStringPpiNetwork, fetchReactomePathways, fetchUniProtData } from '../api/scienceClient';

interface BioinformaticsDatabaseExplorerProps {
  initialGene?: string;
  initialAccession?: string;
}

export const BioinformaticsDatabaseExplorer: React.FC<BioinformaticsDatabaseExplorerProps> = ({
  initialGene = 'TP53',
  initialAccession = 'P04637'
}) => {
  const [geneInput, setGeneInput] = useState<string>(initialGene);
  const [currentGene, setCurrentGene] = useState<string>(initialGene);
  const [currentAccession, setCurrentAccession] = useState<string>(initialAccession);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [ppiPartners, setPpiPartners] = useState<StringInteractionPartner[]>([]);
  const [pathways, setPathways] = useState<ReactomePathway[]>([]);
  const [uniprotData, setUniprotData] = useState<UniProtSummary | null>(null);

  const QUICK_GENES = [
    { gene: 'TP53', accession: 'P04637', role: 'Tumor Suppressor / DNA Repair' },
    { gene: 'EGFR', accession: 'P00533', role: 'Receptor Tyrosine Kinase' },
    { gene: 'BRCA1', accession: 'P38398', role: 'Double-Strand Break Repair' },
    { gene: 'MDM2', accession: 'Q00987', role: 'E3 Ubiquitin Ligase' },
    { gene: 'ATM', accession: 'Q13315', role: 'DNA Damage Sensor Kinase' },
    { gene: 'PCSK9', accession: 'Q8NBP7', role: 'Cholesterol Homeostasis' },
  ];

  const loadData = async (gene: string, accession: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const [ppi, reactome, uniprot] = await Promise.all([
        fetchStringPpiNetwork(gene),
        fetchReactomePathways(accession),
        fetchUniProtData(gene)
      ]);

      setPpiPartners(ppi);
      setPathways(reactome);
      setUniprotData(uniprot);
      if (uniprot?.primaryAccession) {
        setCurrentAccession(uniprot.primaryAccession);
      }
    } catch (err: any) {
      console.warn('Bioinformatics network query warning:', err);
      setErrorMsg(err.message || 'Could not fetch interaction network data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(currentGene, currentAccession);
  }, [currentGene]);

  return (
    <div className="flex flex-col gap-6 bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-sm">
      {/* Top Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
            Target Interactomes:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_GENES.map(item => (
              <button
                key={item.gene}
                onClick={() => {
                  setGeneInput(item.gene);
                  setCurrentGene(item.gene);
                  setCurrentAccession(item.accession);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  currentGene === item.gene
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{item.gene}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const clean = geneInput.trim().toUpperCase();
            if (clean) setCurrentGene(clean);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={geneInput}
            onChange={(e) => setGeneInput(e.target.value)}
            placeholder="e.g. TP53, BRCA1, EGFR"
            className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-36 sm:w-44"
          />
          <button
            type="submit"
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
          >
            Explore Interactome
          </button>
        </form>
      </div>

      {loading && (
        <div className="py-16 flex flex-col items-center justify-center text-slate-600 gap-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono">Querying STRING PPI network &amp; Reactome pathway knowledgebase...</span>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Pane: STRING Database Protein-Protein Interaction (PPI) Partners */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  [Curated - STRING DB v12]
                </span>
                <span className="text-xs text-slate-400 font-mono">Species: 9606 (Homo sapiens)</span>
              </div>

              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2 mb-1">
                <GitBranch className="w-4 h-4 text-blue-600" />
                <span>Protein-Protein Interactome: {currentGene}</span>
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                High-confidence physical bindings &amp; functional associations aggregated across experimental assays, curated pathways, and co-expression.
              </p>

              {ppiPartners.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  No interaction partners above score 0.500 found for this query.
                </div>
              ) : (
                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {ppiPartners.map((partner, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-slate-100 hover:border-slate-300 bg-slate-50 transition cursor-pointer text-xs"
                    >
                      <div className="flex items-center justify-between font-bold text-slate-800 mb-1.5">
                        <span className="font-mono text-sm text-blue-600">
                          {partner.preferredNameA} ↔ {partner.preferredNameB}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-mono text-[11px] font-black">
                          Score: {(partner.score).toFixed(3)}
                        </span>
                      </div>

                      {/* Evidence Channels Breakdown */}
                      <div className="grid grid-cols-4 gap-1.5 text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-200/60">
                        <div>
                          <span>Exp: </span>
                          <strong className="text-slate-700">{(partner.escore).toFixed(2)}</strong>
                        </div>
                        <div>
                          <span>DB: </span>
                          <strong className="text-slate-700">{(partner.dscore).toFixed(2)}</strong>
                        </div>
                        <div>
                          <span>Text: </span>
                          <strong className="text-slate-700">{(partner.tscore).toFixed(2)}</strong>
                        </div>
                        <div>
                          <span>Co-exp: </span>
                          <strong className="text-slate-700">{(partner.ascore).toFixed(2)}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <a
                href={`https://string-db.org/network/9606.${currentGene}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold"
              >
                <span>Interactive STRING Network Viewer</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-[11px] text-slate-400 font-mono">Min Confidence: 0.500</span>
            </div>
          </div>

          {/* Right Pane: Reactome Curated Biological Pathways */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                  [Curated - Reactome Content Service]
                </span>
                <span className="text-xs text-slate-400 font-mono">UniProt: {currentAccession}</span>
              </div>

              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2 mb-1">
                <Layers className="w-4 h-4 text-teal-600" />
                <span>Curated Cellular Pathways: {currentGene}</span>
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Curated biochemical reaction pathways, signal transduction cascades, and metabolic networks containing {currentGene}.
              </p>

              {pathways.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  No curated Reactome pathways directly mapped to {currentAccession}.
                </div>
              ) : (
                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {pathways.map((pw, idx) => (
                    <a
                      key={idx}
                      href={`https://reactome.org/PathwayBrowser/#/${pw.stId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="block p-3 rounded-xl border border-slate-100 hover:border-teal-300 bg-slate-50 hover:bg-teal-50/20 transition text-xs group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-800 group-hover:text-teal-700 transition">
                          {pw.name}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 shrink-0" />
                      </div>
                      <div className="text-[11px] font-mono text-slate-500">
                        Stable ID: <strong className="text-slate-700">{pw.stId}</strong> | Species: {pw.species}
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <a
                href={`https://reactome.org/PathwayBrowser/#/search?q=${currentGene}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-teal-600 hover:text-teal-800 font-semibold"
              >
                <span>Browse Full Reactome Hierarchy</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-[11px] text-slate-400 font-mono">{pathways.length} Pathways Loaded</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
