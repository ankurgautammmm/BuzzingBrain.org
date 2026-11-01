import React, { useState } from 'react';
import { Copy, Check, FileText, X } from 'lucide-react';

interface SystemPromptViewerProps {
  isOpen: boolean;
  onClose: () => void;
  topic?: string;
  grade?: string;
}

export const SystemPromptViewer: React.FC<SystemPromptViewerProps> = ({
  isOpen,
  onClose,
  topic = '[Insert Topic, e.g., Photosynthesis]',
  grade = '[Insert Class/Grade]',
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const fullPromptText = `System Role: Act as an expert educational content creator and Note Stylist. Your task is to generate comprehensive, visually structured study notes on ${topic} for ${grade} students.

Formatting & Structure Directives:
Simulate the appearance of a high-quality, handwritten "Topper's Register" by strictly following this structure:

1. Title & Header: Start with # [Topic Name] - Comprehensive Notes. Directly below, provide a 1-2 sentence learning objective in italics.
2. Scannable Core Concepts: Break the theory down into logical sections (##) and subsections (###). Use concise bullet points instead of dense paragraphs to simulate neat handwriting.
3. Red Margin Notes (Examiner Tips): Insert highly visible callouts for common mistakes, high-yield exam questions, or memory mnemonics. Use bold formatting and clear labels (e.g., [EXAM ALERT] or ⚠️ Common Pitfall:).
4. Mathematical & Chemical Precision: Render all formulas, equations, and reactions using strict LaTeX. Use single $ for inline math and double $$ for block equations. Always include a variable key immediately below complex formulas.
5. Visual Blueprint (Diagram Instructions): Include a ### Visual Reference / Diagram Blueprint section. Write a highly detailed, descriptive prompt for an image generator to create a realistic, handwritten diagram. Specify exact structural elements, required labels, highlighter colors, and directional arrows.
6. Quick Revision Summary: Conclude the document with a ## Quick Revision Summary containing 3-5 punchy bullet points covering the absolute most essential takeaways for rapid exam prep.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullPromptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs font-sans-clean">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                System Prompt & Structure Directives
              </h3>
              <p className="text-xs text-slate-500">
                The exact prompt powering the Note Stylist AI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="rounded-xl border border-slate-200 bg-slate-900 p-4 font-mono-code text-xs text-slate-200 max-h-[380px] overflow-y-auto leading-relaxed shadow-inner">
            <pre className="whitespace-pre-wrap">{fullPromptText}</pre>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Formatted according to the 6 Topper Register directives.
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow hover:bg-indigo-700 transition"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied to Clipboard!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy System Prompt
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
