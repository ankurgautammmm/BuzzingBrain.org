import React from 'react';
import { ShieldCheck, ExternalLink, X, BookOpen, Layers } from 'lucide-react';

export const AttributionModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[85vh] rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-slate-300">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white">Anatomical Assets Attribution &amp; Verification Register</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. 3D Model Source */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-purple-300 font-bold">
            <span>Human Reference Atlas (HRA) &bull; HuBMAP Consortium</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">CC BY 4.0</span>
          </div>
          <p className="text-slate-200 leading-relaxed">
            The 3D anatomical models for the human heart, kidney, pancreas, and spleen are sourced from the NIH Human Biomolecular Atlas Program (HuBMAP) and Human Reference Atlas 3D Reference Organ Set v1.3.
          </p>
          <div className="text-[11px] text-slate-400 space-y-0.5">
            <div>Authors: Kristen Browne, Heidi Schlehlein, Bruce W. Herr II, Katy Börner (Indiana University).</div>
            <div>DOI: <a href="https://doi.org/10.48539/HBM352.BTSQ.586" target="_blank" rel="noreferrer" className="text-purple-400 underline inline-flex items-center gap-1">10.48539/HBM352.BTSQ.586 <ExternalLink className="w-3 h-3" /></a></div>
          </div>
        </div>

        {/* 2. BodyParts3D */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-sky-300 font-bold">
            <span>BodyParts3D &bull; Database Center for Life Science (DBCLS)</span>
            <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300">CC BY 4.0</span>
          </div>
          <p className="text-slate-200 leading-relaxed">
            Whole-body reference coordinate frameworks and Japanese anatomical concept hierarchies derived from BodyParts3D 4.0 (Mitsuhashi et al., 2009, Nucleic Acids Research, 37(suppl_1), D782–D785).
          </p>
        </div>

        {/* 3. Textbook Verification */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-emerald-300 font-bold">
            <span>Curriculum &amp; Textbook Verification</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">NCERT 2026-27</span>
          </div>
          <ul className="list-disc pl-5 space-y-1 text-slate-300">
            <li><strong>NCERT Class 10 Science</strong>: Chapter 6 (Life Processes — Transportation &amp; Excretion)</li>
            <li><strong>NCERT Class 11 Biology</strong>: Chapter 18 (Body Fluids and Circulation) &amp; Chapter 19 (Excretory Products and their Elimination)</li>
            <li><strong>OpenStax Anatomy and Physiology 2e</strong>: Chapter 19 (Cardiovascular System: The Heart) &amp; Chapter 25 (The Urinary System). Licensed under CC BY 4.0.</li>
            <li><strong>Gray's Anatomy for Students (4th Edition)</strong>: Referenced for coronary arterial branching and microvascular beds.</li>
          </ul>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition cursor-pointer"
          >
            Close Register
          </button>
        </div>
      </div>
    </div>
  );
};
