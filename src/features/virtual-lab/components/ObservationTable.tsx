import React, { useState } from 'react';
import { ObservationColumn, ObservationRow, FormulaSpec } from '../types/laboratory';
import { calculateLinearRegressionResistance } from '../simulation/physicsSimulation';
import { Plus, Trash2, LineChart, Calculator, Check, ArrowRight, Table, Sparkles } from 'lucide-react';

interface ObservationTableProps {
  columns: ObservationColumn[];
  rows: ObservationRow[];
  formulas?: FormulaSpec[];
  experimentId: string;
  onUpdateRows: (rows: ObservationRow[]) => void;
  onContinueToQuiz: () => void;
}

export const ObservationTable: React.FC<ObservationTableProps> = ({
  columns,
  rows,
  formulas,
  experimentId,
  onUpdateRows,
  onContinueToQuiz,
}) => {
  const [selectedFormulaIdx, setSelectedFormulaIdx] = useState<number>(0);

  // Edit cell value
  const handleCellChange = (rowId: string, colKey: string, value: string | number) => {
    const updated = rows.map((r) => {
      if (r.id !== rowId) return r;
      const copy = { ...r, [colKey]: value };

      // Dynamic calculation for Ohm's law: R = V / I, P = V * I
      if (experimentId === 'c10_ohms_law_circuit') {
        const cur = Number(copy.current);
        const volt = Number(copy.voltage);
        if (cur > 0) {
          copy.resistance = Number((volt / cur).toFixed(3));
          copy.power = Number((volt * cur).toFixed(3));
        }
      }
      return copy;
    });
    onUpdateRows(updated);
  };

  // Add new blank row
  const handleAddRow = () => {
    const newRow: ObservationRow = {
      id: `row_${Date.now()}`,
      trial: `Trial ${rows.length + 1}`
    };
    columns.forEach((col) => {
      if (col.key !== 'id' && col.key !== 'trial') {
        newRow[col.key] = col.type === 'number' ? 0 : '';
      }
    });
    onUpdateRows([...rows, newRow]);
  };

  // Delete row
  const handleDeleteRow = (rowId: string) => {
    if (rows.length <= 1) return;
    onUpdateRows(rows.filter((r) => r.id !== rowId));
  };

  // Physics V-I Graph Linear Regression
  const isOhmsLaw = experimentId === 'c10_ohms_law_circuit';
  const regressionData = React.useMemo(() => {
    if (!isOhmsLaw) return null;
    const points = rows
      .map((r) => ({ current: Number(r.current || 0), voltage: Number(r.voltage || 0) }))
      .filter((p) => p.current > 0 && p.voltage > 0);
    return calculateLinearRegressionResistance(points);
  }, [rows, isOhmsLaw]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Table className="w-4 h-4 text-amber-400" />
            <span>Experimental Observation Notebook &amp; Scientific Calculations</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Record, verify, and calculate empirical values with authentic formulas and graphical regression.
          </p>
        </div>

        <button
          onClick={handleAddRow}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 hover:text-white border border-slate-700 transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-amber-400" />
          <span>Add Reading Row</span>
        </button>
      </div>

      {/* Observation Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-300 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="p-3">
                  <div className="flex items-center gap-1">
                    <span>{col.label}</span>
                    {col.unit && (
                      <span className="text-amber-400 font-mono lowercase">({col.unit})</span>
                    )}
                  </div>
                </th>
              ))}
              <th className="p-3 w-12 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-mono text-xs text-slate-200">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-slate-800/40 transition">
                {columns.map((col) => {
                  const val = row[col.key];
                  if (col.readOnly) {
                    return (
                      <td key={col.key} className="p-3 font-semibold text-slate-400 whitespace-nowrap">
                        {String(val ?? '—')}
                      </td>
                    );
                  }

                  return (
                    <td key={col.key} className="p-2">
                      <input
                        type={col.type === 'number' ? 'number' : 'text'}
                        step={col.type === 'number' ? '0.01' : undefined}
                        value={val !== undefined ? String(val) : ''}
                        onChange={(e) => handleCellChange(row.id, col.key, col.type === 'number' ? Number(e.target.value) : e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </td>
                  );
                })}
                <td className="p-2 text-center">
                  <button
                    onClick={() => handleDeleteRow(row.id)}
                    disabled={rows.length <= 1}
                    className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition disabled:opacity-30 cursor-pointer"
                    title="Delete row"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Physics V-I Graph Plotter (When applicable) */}
      {isOhmsLaw && regressionData && (
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <LineChart className="w-4 h-4 text-sky-400" />
                <span>Potential Difference (V) vs Electric Current (I) Experimental Plot</span>
              </h4>
              <span className="text-[11px] text-slate-400">
                Linear Best-Fit Slope represents Wire Resistance (R = ΔV / ΔI)
              </span>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="text-amber-400 font-bold bg-amber-400/10 px-2.5 py-1 rounded-xl border border-amber-400/20">
                Slope R = {regressionData.slopeR} Ω
              </span>
              <span className="text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-xl border border-emerald-400/20">
                R² = {regressionData.rSquared}
              </span>
            </div>
          </div>

          {/* SVG Scatter Plot & Regression Line */}
          <div className="w-full h-64 bg-slate-950 rounded-2xl p-4 relative border border-slate-800 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 500 220">
              {/* Grid Lines */}
              <line x1="50" y1="180" x2="480" y2="180" stroke="#334155" strokeWidth="1.5" />
              <line x1="50" y1="20" x2="50" y2="180" stroke="#334155" strokeWidth="1.5" />

              {/* Grid Tick Labels */}
              <text x="50" y="198" fill="#94a3b8" fontSize="10" textAnchor="middle">0.0 A</text>
              <text x="157" y="198" fill="#94a3b8" fontSize="10" textAnchor="middle">0.4 A</text>
              <text x="265" y="198" fill="#94a3b8" fontSize="10" textAnchor="middle">0.8 A</text>
              <text x="372" y="198" fill="#94a3b8" fontSize="10" textAnchor="middle">1.2 A</text>
              <text x="480" y="198" fill="#94a3b8" fontSize="10" textAnchor="middle">1.6 A</text>

              <text x="40" y="180" fill="#94a3b8" fontSize="10" textAnchor="end">0.0 V</text>
              <text x="40" y="130" fill="#94a3b8" fontSize="10" textAnchor="end">1.0 V</text>
              <text x="40" y="80" fill="#94a3b8" fontSize="10" textAnchor="end">2.0 V</text>
              <text x="40" y="30" fill="#94a3b8" fontSize="10" textAnchor="end">3.0 V</text>

              {/* Axis Titles */}
              <text x="265" y="215" fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="middle">Electric Current I (Amperes)</text>
              <text x="18" y="105" fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="middle" transform="rotate(-90 18,105)">Voltage V (Volts)</text>

              {/* Regression Trendline */}
              {regressionData.slopeR > 0 && (
                <line
                  x1="50"
                  y1="180"
                  x2={50 + 1.2 * 268}
                  y2={180 - (1.2 * regressionData.slopeR / 3.0) * 150}
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeDasharray="4 2"
                />
              )}

              {/* Data Points */}
              {rows.map((r, i) => {
                const I = Number(r.current || 0);
                const V = Number(r.voltage || 0);
                if (I <= 0 || V <= 0) return null;
                const px = 50 + (I / 1.6) * 430;
                const py = 180 - (V / 3.0) * 150;
                return (
                  <g key={i}>
                    <circle cx={px} cy={py} r="5" fill="#fbbf24" stroke="#78350f" strokeWidth="1.5" />
                    <text x={px + 7} y={py - 6} fill="#fef08a" fontSize="9" fontFamily="monospace">
                      ({I}A, {V}V)
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      )}

      {/* Formulas & Worked Examples Tab */}
      {formulas && formulas.length > 0 && (
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-purple-400" />
              <span>Scientific Equations &amp; Unit Derivations</span>
            </h4>

            <div className="flex gap-2">
              {formulas.map((f, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedFormulaIdx(i)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    selectedFormulaIdx === i
                      ? 'bg-purple-600 text-white font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>

          {formulas[selectedFormulaIdx] && (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-purple-300 font-bold uppercase tracking-wider block mb-0.5">
                    Governing Law Equation:
                  </span>
                  <div className="font-mono text-base font-black text-amber-300">
                    {formulas[selectedFormulaIdx].equation}
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 max-w-md">
                  {formulas[selectedFormulaIdx].explanation}
                </div>
              </div>

              {/* Symbols Table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {formulas[selectedFormulaIdx].symbols.map((sym, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                    <span className="font-mono font-bold text-amber-400 text-sm">{sym.symbol}</span>
                    <span className="text-slate-300 block text-[11px] mt-0.5">{sym.definition}</span>
                    <span className="text-[10px] text-slate-500 font-mono">SI Unit: {sym.unit}</span>
                  </div>
                ))}
              </div>

              {/* Worked Example */}
              <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-1.5">
                <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider">
                  Verified Worked Problem:
                </span>
                <p className="text-slate-300 font-medium">{formulas[selectedFormulaIdx].workedExample.inputs}</p>
                <div className="space-y-1 pl-3 border-l-2 border-purple-500/40 text-slate-400 font-mono text-[11px]">
                  {formulas[selectedFormulaIdx].workedExample.steps.map((st, i) => (
                    <div key={i}>• {st}</div>
                  ))}
                </div>
                <div className="pt-1 text-emerald-400 font-bold font-mono">
                  Result: {formulas[selectedFormulaIdx].workedExample.result}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom CTA: Proceed to Quiz */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onContinueToQuiz}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs sm:text-sm shadow-xl shadow-emerald-950/50 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
        >
          <span>Complete Stage: Proceed to MCQ Assessment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
