import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  BookOpen, 
  GraduationCap, 
  Sliders, 
  Flame,
  CheckCircle
} from 'lucide-react';
import { NotePreset } from '../types';

interface TopicGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (data: {
    topic: string;
    grade: string;
    subject: string;
    styleFocus: string;
    customDirectives: string;
  }) => void;
  isGenerating: boolean;
  presets: NotePreset[];
}

export const TopicGeneratorModal: React.FC<TopicGeneratorModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  isGenerating,
  presets,
}) => {
  const [topic, setTopic] = useState('Photosynthesis');
  const [grade, setGrade] = useState('Class 10 CBSE / GCSE');
  const [subject, setSubject] = useState('Biology');
  const [styleFocus, setStyleFocus] = useState("Topper's Register (Classic Neat)");
  const [customDirectives, setCustomDirectives] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onGenerate({
      topic: topic.trim(),
      grade,
      subject,
      styleFocus,
      customDirectives,
    });
  };

  const handleSelectPreset = (p: NotePreset) => {
    setTopic(p.topic);
    setGrade(p.grade);
    setSubject(p.subject);
  };

  const GRADE_OPTIONS = [
    'Class 9 (CBSE / State Board)',
    'Class 10 (CBSE / ICSE Board)',
    'Class 11 (CBSE / JEE / NEET)',
    'Class 12 (CBSE / State / NEET / JEE)',
    'Dropper (NEET Repeater Batch)',
    'Dropper (JEE Main & Advanced Batch)',
    'College / Undergrad STEM',
  ];

  const SUBJECT_OPTIONS = [
    'Biology',
    'Physics',
    'Chemistry',
    'Mathematics',
    'Computer Science',
    'Environmental Science',
  ];

  const STYLE_OPTIONS = [
    "Topper's Register (Classic Neat)",
    'Exam Cram Revision (High Yield Callouts)',
    'Formula & Derivation Intensive',
    'Visual Diagram & Mechanism Heavy',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-sans-clean overflow-y-auto">
      <div className="w-full max-w-2xl my-8 rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-red-500/10 via-amber-500/10 to-transparent px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-amber-600 text-white shadow-xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Topper Note Stylist
              </h3>
              <p className="text-xs text-slate-500">
                Simulate a state-ranker's handwritten study register with LaTeX and examiner tips
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition disabled:opacity-40"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Quick Presets Carousel */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5 text-red-500" />
                Popular High-Yield Topics
              </label>
              <span className="text-[11px] text-slate-400">Click to autofill</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className={`shrink-0 rounded-xl border px-3 py-2 text-left text-xs transition ${
                    topic === p.topic
                      ? 'border-red-500 bg-red-50/80 text-red-950 font-semibold ring-1 ring-red-500'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="font-medium text-slate-900">{p.topic}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{p.subject} • {p.grade}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Topic Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Topic / Chapter Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Photosynthesis, Newton's Laws, Carbon Compounds, Wave Optics"
                className="w-full rounded-xl border border-slate-300 py-2.5 px-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-hidden transition"
              />
            </div>
          </div>

          {/* Grade & Subject Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <GraduationCap className="h-3.5 w-3.5 text-slate-500" /> Target Class / Grade
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full rounded-xl border border-slate-300 py-2.5 px-3 text-xs sm:text-sm font-medium text-slate-800 bg-white focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-hidden transition"
              >
                {GRADE_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5 text-slate-500" /> Subject Domain
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-xl border border-slate-300 py-2.5 px-3 text-xs sm:text-sm font-medium text-slate-800 bg-white focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-hidden transition"
              >
                {SUBJECT_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Style Focus */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Sliders className="h-3.5 w-3.5 text-slate-500" /> Note Style Focus
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {STYLE_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setStyleFocus(opt)}
                  className={`rounded-xl border p-2.5 text-left text-xs transition flex items-center justify-between ${
                    styleFocus === opt
                      ? 'border-amber-500 bg-amber-50/70 text-amber-950 font-semibold ring-1 ring-amber-500'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{opt}</span>
                  {styleFocus === opt && <CheckCircle className="h-3.5 w-3.5 text-amber-600 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Directives */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Specific Directives / Exam Focus <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={customDirectives}
              onChange={(e) => setCustomDirectives(e.target.value)}
              placeholder="e.g. Include Calvin cycle comparison table, derivation of Carnot efficiency, or NCERT highlights"
              className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-hidden transition"
            />
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Generated following the strict 6-step Topper Register directives.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isGenerating}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isGenerating || !topic.trim()}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow hover:from-red-700 hover:to-amber-700 disabled:opacity-50 transition"
              >
                {isGenerating ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Writing Notes in Register...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Topper's Notes
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
