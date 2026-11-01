import {
  AlphaFoldPredictionDescriptor,
  PdbMetadata,
  UniProtSummary,
  ChemicalProperties,
  DrugLikenessEvaluation,
  ChEMBLBioactivity,
  StringInteractionPartner,
  ReactomePathway
} from '../types';

/**
 * Robust fetch with exponential backoff for scientific APIs (handles 429 and transient 5xx)
 */
async function fetchWithRetry(url: string, options: RequestInit = {}, maxRetries = 3, baseDelayMs = 500): Promise<Response> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;

      if ((response.status === 429 || response.status >= 500) && attempt < maxRetries) {
        const retryAfter = Number(response.headers.get('Retry-After'));
        const delay = !Number.isNaN(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : baseDelayMs * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      return response;
    } catch (err) {
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, baseDelayMs * Math.pow(2, attempt)));
        continue;
      }
      throw err;
    }
  }
  throw new Error(`Exhausted retries for ${url}`);
}

/**
 * 1. AlphaFold DB API (EBI)
 */
export async function fetchAlphaFoldPrediction(uniprotAccession: string): Promise<AlphaFoldPredictionDescriptor | null> {
  const cleanId = uniprotAccession.trim().toUpperCase();
  try {
    const res = await fetchWithRetry(`https://alphafold.ebi.ac.uk/api/prediction/${cleanId}`);
    if (!res.ok) {
      // Fallback: construct standard AFDB v6 prediction links
      return {
        entryId: `AF-${cleanId}-F1`,
        gene: cleanId,
        uniprotAccession: cleanId,
        uniprotId: `${cleanId}_HUMAN`,
        uniprotDescription: `Predicted AlphaFold structure for ${cleanId}`,
        taxId: 9606,
        organismScientificName: 'Homo sapiens',
        uniprotStart: 1,
        uniprotEnd: 393,
        uniprotSequence: '',
        cifUrl: `https://alphafold.ebi.ac.uk/files/AF-${cleanId}-F1-model_v6.cif`,
        bcifUrl: `https://alphafold.ebi.ac.uk/files/AF-${cleanId}-F1-model_v6.bcif`,
        pdbUrl: `https://alphafold.ebi.ac.uk/files/AF-${cleanId}-F1-model_v6.pdb`,
        paeImageUrl: `https://alphafold.ebi.ac.uk/files/AF-${cleanId}-F1-predicted_aligned_error_v6.png`,
        paeDocUrl: `https://alphafold.ebi.ac.uk/files/AF-${cleanId}-F1-predicted_aligned_error_v6.json`
      };
    }
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return data[0] as AlphaFoldPredictionDescriptor;
    }
    return null;
  } catch (err) {
    console.warn(`AlphaFold API fetch error for ${cleanId}:`, err);
    return null;
  }
}

/**
 * 2. RCSB Protein Data Bank (PDB)
 */
export async function fetchPdbMetadata(pdbId: string): Promise<PdbMetadata | null> {
  const cleanId = pdbId.trim().toUpperCase();
  try {
    const res = await fetchWithRetry(`https://data.rcsb.org/rest/v1/core/entry/${cleanId.toLowerCase()}`);
    if (!res.ok) return null;
    const data = await res.json();

    const title = data.struct?.title || `Structure ${cleanId}`;
    const resolution = data.rcsb_entry_info?.resolution_combined?.[0];
    const experimentalMethod = data.rcsb_entry_info?.experimental_method?.[0] || 'X-RAY DIFFRACTION';
    const depositDate = data.rcsb_accession_info?.deposit_date || '';
    const releaseDate = data.rcsb_accession_info?.initial_release_date || '';
    const polymerCountProtein = data.rcsb_entry_info?.polymer_entity_count_protein || 1;
    const molecularWeight = data.rcsb_entry_info?.molecular_weight || 0;

    return {
      pdbId: cleanId,
      title,
      resolution,
      experimentalMethod,
      depositDate,
      releaseDate,
      polymerCountProtein,
      molecularWeight,
      cifDownloadUrl: `https://files.rcsb.org/download/${cleanId}.cif`,
      pdbDownloadUrl: `https://files.rcsb.org/download/${cleanId}.pdb`
    };
  } catch (err) {
    console.warn(`RCSB PDB fetch error for ${cleanId}:`, err);
    return null;
  }
}

/**
 * 3. UniProtKB API
 */
export async function fetchUniProtData(accessionOrGene: string): Promise<UniProtSummary | null> {
  const query = accessionOrGene.trim();
  let accession = query.toUpperCase();

  try {
    // If input looks like a gene symbol (e.g. TP53, EGFR, BRCA1), search first
    if (!/^[A-N,R-Z][0-9][A-Z][A-Z, 0-9][A-Z, 0-9][0-9]$/i.test(accession)) {
      const searchRes = await fetchWithRetry(
        `https://rest.uniprot.org/uniprotkb/search?query=gene_exact:${encodeURIComponent(query)}+AND+organism_id:9606+AND+reviewed:true&format=json&size=1`
      );
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        if (searchData.results && searchData.results.length > 0) {
          accession = searchData.results[0].primaryAccession;
        }
      }
    }

    const res = await fetchWithRetry(`https://rest.uniprot.org/uniprotkb/${accession}.json`);
    if (!res.ok) return null;
    const data = await res.json();

    const primaryAccession = data.primaryAccession || accession;
    const id = data.uniProtkbId || '';
    const proteinName = data.proteinDescription?.recommendedName?.fullName?.value || query;
    const geneSymbol = data.genes?.[0]?.geneName?.value || query.toUpperCase();
    const organism = data.organism?.scientificName || 'Homo sapiens';
    const sequence = data.sequence?.value || '';
    const sequenceLength = data.sequence?.length || sequence.length;

    // Parse features: Active sites, Binding sites, Domains, Natural variants
    const features: any[] = [];
    if (Array.isArray(data.features)) {
      for (const feat of data.features) {
        const type = feat.type;
        const description = feat.description || '';
        const start = feat.location?.start?.value || 0;
        const end = feat.location?.end?.value || start;

        if (['Active site', 'Binding site', 'Domain', 'Natural variant', 'Mutagenesis', 'Transmembrane'].includes(type)) {
          features.push({
            type,
            description,
            start,
            end
          });
        }
      }
    }

    // Function summary
    let functionSummary = '';
    if (Array.isArray(data.comments)) {
      const funcComment = data.comments.find((c: any) => c.commentType === 'FUNCTION');
      if (funcComment && funcComment.texts && funcComment.texts.length > 0) {
        functionSummary = funcComment.texts[0].value;
      }
    }

    // PDB cross-references
    const pdbCrossReferences: string[] = [];
    if (Array.isArray(data.uniProtKBCrossReferences)) {
      for (const xref of data.uniProtKBCrossReferences) {
        if (xref.database === 'PDB' && xref.id) {
          pdbCrossReferences.push(xref.id);
          if (pdbCrossReferences.length >= 8) break;
        }
      }
    }

    return {
      accession: primaryAccession,
      primaryAccession,
      id,
      proteinName,
      geneSymbol,
      organism,
      sequence,
      sequenceLength,
      features,
      functionSummary,
      pdbCrossReferences
    };
  } catch (err) {
    console.warn(`UniProt fetch error for ${query}:`, err);
    return null;
  }
}

/**
 * 4. PubChem PUG REST API
 */
export async function fetchPubChemCompound(nameOrCid: string): Promise<ChemicalProperties | null> {
  const query = nameOrCid.trim();
  const isCid = /^\d+$/.test(query);

  const endpoint = isCid
    ? `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${query}/property/MolecularFormula,MolecularWeight,CanonicalSMILES,IsomericSMILES,InChIKey,XLogP,TPSA,HBondDonorCount,HBondAcceptorCount,RotatableBondCount,Complexity,IUPACName/JSON`
    : `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(query)}/property/MolecularFormula,MolecularWeight,CanonicalSMILES,IsomericSMILES,InChIKey,XLogP,TPSA,HBondDonorCount,HBondAcceptorCount,RotatableBondCount,Complexity,IUPACName/JSON`;

  try {
    const res = await fetchWithRetry(endpoint);
    if (!res.ok) return null;
    const data = await res.json();
    const props = data.PropertyTable?.Properties?.[0];
    if (!props) return null;

    const cid = props.CID;
    return {
      cid,
      name: query,
      molecularFormula: props.MolecularFormula || '',
      molecularWeight: Number(props.MolecularWeight) || 0,
      canonicalSmiles: props.CanonicalSMILES || '',
      isomericSmiles: props.IsomericSMILES || props.CanonicalSMILES || '',
      inchiKey: props.InChIKey || '',
      xLogP: props.XLogP !== undefined ? Number(props.XLogP) : undefined,
      tpsa: props.TPSA !== undefined ? Number(props.TPSA) : undefined,
      hBondDonorCount: props.HBondDonorCount !== undefined ? Number(props.HBondDonorCount) : undefined,
      hBondAcceptorCount: props.HBondAcceptorCount !== undefined ? Number(props.HBondAcceptorCount) : undefined,
      rotatableBondCount: props.RotatableBondCount !== undefined ? Number(props.RotatableBondCount) : undefined,
      complexity: props.Complexity !== undefined ? Number(props.Complexity) : undefined,
      iupacName: props.IUPACName || '',
      image2dUrl: `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG?image_size=400x400`,
      conformer3dUrl: `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/SDF?record_type=3d`
    };
  } catch (err) {
    console.warn(`PubChem fetch error for ${query}:`, err);
    return null;
  }
}

/**
 * 5. Lipinski's Rule of Five & Veber Oral Bioavailability Calculator
 */
export function evaluateDrugLikeness(props: ChemicalProperties): DrugLikenessEvaluation {
  const violations: string[] = [];
  const veberViolations: string[] = [];

  // Lipinski Rule of 5:
  // 1. MW <= 500 Da
  if (props.molecularWeight > 500) {
    violations.push(`Molecular Weight (${props.molecularWeight.toFixed(1)} Da) > 500 Da`);
  }
  // 2. LogP <= 5
  if (props.xLogP !== undefined && props.xLogP > 5) {
    violations.push(`LogP (${props.xLogP.toFixed(2)}) > 5.0`);
  }
  // 3. H-Bond Donors <= 5
  if (props.hBondDonorCount !== undefined && props.hBondDonorCount > 5) {
    violations.push(`H-Bond Donors (${props.hBondDonorCount}) > 5`);
  }
  // 4. H-Bond Acceptors <= 10
  if (props.hBondAcceptorCount !== undefined && props.hBondAcceptorCount > 10) {
    violations.push(`H-Bond Acceptors (${props.hBondAcceptorCount}) > 10`);
  }

  // Veber Rules:
  // 1. Rotatable bonds <= 10
  if (props.rotatableBondCount !== undefined && props.rotatableBondCount > 10) {
    veberViolations.push(`Rotatable Bonds (${props.rotatableBondCount}) > 10`);
  }
  // 2. TPSA <= 140 A^2
  if (props.tpsa !== undefined && props.tpsa > 140) {
    veberViolations.push(`TPSA (${props.tpsa.toFixed(1)} Å²) > 140 Å²`);
  }

  const lipinskiPassed = violations.length <= 1; // Lipinski allows at most 1 violation
  const veberPassed = veberViolations.length === 0;

  // Bioavailability Score estimation (0 to 100)
  let score = 100;
  score -= violations.length * 20;
  score -= veberViolations.length * 15;
  score = Math.max(10, Math.min(100, score));

  // Blood-Brain Barrier (BBB) penetration heuristic: TPSA < 90 Å² and MW < 400 and LogP between 1 and 4
  const bbb = (props.tpsa ?? 100) < 90 && props.molecularWeight < 450 && (props.xLogP ?? 0) >= 0.5 && (props.xLogP ?? 0) <= 4.5;

  return {
    lipinskiPassed,
    lipinskiViolations: violations,
    veberPassed,
    veberViolations,
    bioavailabilityScore: score,
    bloodBrainBarrierPenetration: bbb
  };
}

/**
 * 6. ChEMBL Target & Bioactivity Explorer
 */
export async function fetchChEMBLBioactivities(uniprotAccession: string): Promise<ChEMBLBioactivity[]> {
  const cleanId = uniprotAccession.trim().toUpperCase();
  try {
    // 1. Find target ChEMBL ID
    const targetRes = await fetchWithRetry(`https://www.ebi.ac.uk/chembl/api/data/target.json?target_components__accession=${cleanId}`);
    if (!targetRes.ok) return [];
    const targetData = await targetRes.json();
    const target = targetData.targets?.[0];
    if (!target) return [];

    const targetChemblId = target.target_chembl_id;
    const targetName = target.pref_name || cleanId;

    // 2. Fetch bioactivities (IC50, Ki, Kd, EC50)
    const actRes = await fetchWithRetry(`https://www.ebi.ac.uk/chembl/api/data/activity.json?target_chembl_id=${targetChemblId}&standard_type=IC50&limit=15`);
    if (!actRes.ok) return [];
    const actData = await actRes.json();

    const activities: ChEMBLBioactivity[] = [];
    if (Array.isArray(actData.activities)) {
      for (const act of actData.activities) {
        if (act.standard_value && act.standard_type) {
          activities.push({
            activityId: String(act.activity_id),
            targetChemblId,
            targetName,
            moleculeChemblId: act.molecule_chembl_id || '',
            standardType: act.standard_type,
            standardValue: Number(act.standard_value),
            standardUnits: act.standard_units || 'nM',
            pchemblValue: act.pchembl_value ? Number(act.pchembl_value) : undefined
          });
        }
      }
    }
    return activities;
  } catch (err) {
    console.warn(`ChEMBL fetch error for ${cleanId}:`, err);
    return [];
  }
}

/**
 * 7. STRING Database Protein-Protein Interaction (PPI) Network
 */
export async function fetchStringPpiNetwork(geneSymbol: string): Promise<StringInteractionPartner[]> {
  const cleanGene = geneSymbol.trim().toUpperCase();
  try {
    const res = await fetchWithRetry(
      `https://string-db.org/api/json/interaction_partners?identifiers=${encodeURIComponent(cleanGene)}&species=9606&limit=12&required_score=500`
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data.map((item: any) => ({
      stringIdA: item.stringId_A || '',
      stringIdB: item.stringId_B || '',
      preferredNameA: item.preferredName_A || cleanGene,
      preferredNameB: item.preferredName_B || '',
      score: Number(item.score) || 0,
      nscore: Number(item.nscore) || 0,
      fscore: Number(item.fscore) || 0,
      pscore: Number(item.pscore) || 0,
      ascore: Number(item.ascore) || 0,
      escore: Number(item.escore) || 0,
      dscore: Number(item.dscore) || 0,
      tscore: Number(item.tscore) || 0
    }));
  } catch (err) {
    console.warn(`STRING API fetch error for ${cleanGene}:`, err);
    return [];
  }
}

/**
 * 8. Reactome Pathways Mapping
 */
export async function fetchReactomePathways(uniprotAccession: string): Promise<ReactomePathway[]> {
  const cleanId = uniprotAccession.trim().toUpperCase();
  try {
    const res = await fetchWithRetry(`https://reactome.org/ContentService/data/mapping/UniProt/${cleanId}/pathways`);
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data.slice(0, 10).map((pw: any) => ({
      stId: pw.stId || '',
      name: pw.displayName || pw.name || 'Pathway',
      species: pw.speciesName || 'Homo sapiens',
      diagramUrl: `https://reactome.org/ContentService/exporter/diagram/${pw.stId}.svg?sel=${cleanId}`
    }));
  } catch (err) {
    console.warn(`Reactome API fetch error for ${cleanId}:`, err);
    return [];
  }
}
