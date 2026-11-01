import React, { useMemo } from 'react';
import katex from 'katex';

interface MathFormulaRendererProps {
  formula: string;
  displayMode?: boolean;
  className?: string;
  fallbackFontFamily?: string;
}

/**
 * Normalizes common scientific and chemical equation formats to valid LaTeX for KaTeX
 */
export function sanitizeMathForKatex(raw: string): string {
  if (!raw) return '';
  let str = raw.trim();

  // Normalize Unicode arrows to LaTeX
  str = str.replace(/→/g, '\\rightarrow ')
           .replace(/←/g, '\\leftarrow ')
           .replace(/⇌/g, '\\rightleftharpoons ')
           .replace(/⇄/g, '\\rightleftarrows ')
           .replace(/±/g, '\\pm ')
           .replace(/×/g, '\\times ')
           .replace(/·/g, '\\cdot ')
           .replace(/°/g, '^\\circ ')
           .replace(/≤/g, '\\le ')
           .replace(/≥/g, '\\ge ')
           .replace(/≠/g, '\\ne ')
           .replace(/≈/g, '\\approx ')
           .replace(/µ/g, '\\mu ')
           .replace(/Δ/g, '\\Delta ')
           .replace(/θ/g, '\\theta ')
           .replace(/π/g, '\\pi ')
           .replace(/ε/g, '\\varepsilon ');

  // Handle common chemical formulas subscripts: e.g. H2O -> H_2O, CO2 -> CO_2, Fe2O3 -> Fe_2O_3
  // If not already in LaTeX subscript notation
  if (!str.includes('\\') && !str.includes('_') && !str.includes('^')) {
    // Convert numbers right after capital or lowercase chemical element letters to subscripts
    str = str.replace(/([A-Z][a-z]?)(\d+)/g, '$1_{$2}');
  }

  return str;
}

export const MathFormulaRenderer: React.FC<MathFormulaRendererProps> = ({
  formula,
  displayMode = true,
  className = '',
  fallbackFontFamily = 'monospace',
}) => {
  const renderedHtml = useMemo(() => {
    if (!formula) return null;
    const sanitized = sanitizeMathForKatex(formula);

    try {
      return katex.renderToString(sanitized, {
        displayMode,
        throwOnError: false,
        strict: false,
        output: 'html',
      });
    } catch {
      return null;
    }
  }, [formula, displayMode]);

  if (renderedHtml) {
    return (
      <span
        className={`katex-math-render select-text ${className}`}
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
      />
    );
  }

  // Graceful fallback if KaTeX parsing fails
  return (
    <span 
      className={`font-mono text-sm tracking-wide ${className}`}
      style={{ fontFamily: fallbackFontFamily }}
    >
      {formula}
    </span>
  );
};
