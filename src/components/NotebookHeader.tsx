import React, { useState } from 'react';
import { 
  Sparkles, 
  Printer, 
  Copy, 
  Check, 
  BrainCircuit, 
  FileCode, 
  SlidersHorizontal,
  ChevronDown,
  BookOpen,
  ZoomIn,
  ZoomOut,
  Target
} from 'lucide-react';
import { PaperStyle, HandwritingFont, InkColor } from '../types';

interface NotebookHeaderProps {
  topic?: string;
  grade?: string;
  subject?: string;
  onOpenGenerateModal: () => void;
  onOpenPromptModal: () => void;
  onOpenQuizModal: () => void;
  onOpenChapterDirectory: () => void;
  onBackToDirectory?: () => void;
  onOpenPyqAgent?: () => void;
  onOpenPyqTestModal?: () => void;
  onNavigateToPyq?: () => void;
  onNavigateToPyqTest?: () => void;
  paperStyle: PaperStyle;
  onChangePaperStyle: (style: PaperStyle) => void;
  handwritingFont: HandwritingFont;
  onChangeFont: (font: HandwritingFont) => void;
  inkColor: InkColor;
  onChangeInkColor: (color: InkColor) => void;
  fontSize: number;
  onChangeFontSize: (size: number) => void;
  markdown: string;
}

export const NotebookHeader: React.FC<NotebookHeaderProps> = ({
  topic = 'Revision Notes',
  grade,
  subject = 'Science',
  onOpenGenerateModal,
  onOpenPromptModal,
  onOpenQuizModal,
  onOpenChapterDirectory,
  onBackToDirectory,
  onOpenPyqAgent,
  onOpenPyqTestModal,
  onNavigateToPyq,
  onNavigateToPyqTest,
  paperStyle,
  onChangePaperStyle,
  handwritingFont,
  onChangeFont,
  inkColor,
  onChangeInkColor,
  fontSize,
  onChangeFontSize,
  markdown,
}) => {
  const [copiedMd, setCopiedMd] = useState(false);
  const [showStylePanel, setShowStylePanel] = useState(false);

  const handlePrint = () => {
    const originalTitle = document.title;
    const cleanSubject = subject.replace(/[^a-zA-Z0-9_-]/g, '_');
    const cleanTopic = topic.replace(/[^a-zA-Z0-9_-]/g, '_');
    document.title = `${cleanSubject}_${cleanTopic}_Revision_Notes_BuzzingBrain`;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1500);
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdown);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const paperOptions: { id: PaperStyle; label: string }[] = [
    { id: 'ruled', label: 'Ruled Margin' },
    { id: 'ruled-tight', label: 'College Ruled' },
    { id: 'grid', label: 'Graph Grid' },
    { id: 'dotted', label: 'Bullet Dot' },
    { id: 'plain', label: 'Plain Sheet' },
  ];

  const fontOptions: { id: HandwritingFont; label: string }[] = [
    { id: 'kalam', label: 'Kalam (Ballpoint)' },
    { id: 'caveat', label: 'Caveat (Fluid Gel)' },
    { id: 'patrick', label: 'Patrick Hand (Print)' },
    { id: 'indie', label: 'Indie Flower (Casual)' },
    { id: 'gloria', label: 'Gloria (Bold Pen)' },
  ];

  const inkOptions: { id: InkColor; label: string; bg: string }[] = [
    { id: 'blue', label: 'Gel Blue', bg: '#1a365d' },
    { id: 'black', label: 'Midnight Black', bg: '#18181b' },
    { id: 'red', label: 'Exam Red', bg: '#991b1b' },
    { id: 'green', label: 'Scholar Green', bg: '#065f46' },
    { id: 'purple', label: 'Royal Violet', bg: '#581c87' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-white/10 shadow-lg no-print font-sans-clean text-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3">
        {/* Main Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Section Heading & Subtitle (Unified BuzzingBrain Branding) */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 shadow-md ring-1 ring-amber-400/40">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white font-sans-clean">
                  Notes
                </h1>
                {grade && (
                  <span className="hidden md:inline-flex rounded-full bg-white/10 border border-white/15 px-2 py-0.5 text-[10px] font-mono text-slate-300">
                    {grade}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 font-normal hidden sm:block">
                Chapter-wise revision notes &amp; topper register layout.
              </p>
            </div>
          </div>

          {/* Grouped, Compact BuzzingBrain Controls */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* Group 1: Navigation & Directory */}
            <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10">
              {onBackToDirectory && (
                <button
                  type="button"
                  onClick={onBackToDirectory}
                  className="flex items-center gap-1.5 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/30 px-2.5 py-1.5 text-xs font-bold transition cursor-pointer"
                  title="Return to the curriculum directory and search bar"
                >
                  <span>&larr; Directory</span>
                </button>
              )}

              <button
                type="button"
                onClick={onOpenChapterDirectory}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
                title="Browse all chapters for Class 9–12 and Dropper"
              >
                <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
                <span>All Chapters</span>
              </button>
            </div>

            {/* Group 2: Topic Creation & Recall */}
            <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={onOpenGenerateModal}
                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold px-3 py-1.5 text-xs shadow-sm hover:from-amber-400 hover:to-amber-300 transition cursor-pointer"
                title="Generate notes for any syllabus topic"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>New Topic</span>
              </button>

              <button
                type="button"
                onClick={onOpenQuizModal}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
                title="Rapid recall revision quiz"
              >
                <FileCode className="h-3.5 w-3.5 text-amber-400" />
                <span className="hidden md:inline">Recall Quiz</span>
              </button>

              <button
                type="button"
                onClick={() => setShowStylePanel((prev) => !prev)}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                  showStylePanel
                    ? 'bg-white/20 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
                title="Customize paper texture, ink color, and handwriting script"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-slate-300" />
                <span>Style</span>
                <ChevronDown className={`h-3 w-3 transition transform ${showStylePanel ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Group 3: Export & Print */}
            <div className="flex items-center gap-1.5 border-l border-white/10 pl-2">
              <button
                type="button"
                onClick={handlePrint}
                title="Print notes as Landscape A4 spread to PDF"
                className="flex items-center gap-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 px-3.5 py-2 text-xs font-extrabold shadow-md transition active:scale-95 cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5 text-slate-950" />
                <span>Print / PDF</span>
              </button>

              <button
                type="button"
                onClick={handleCopyMarkdown}
                title="Copy note markdown"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition cursor-pointer"
              >
                {copiedMd ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>

              <button
                type="button"
                onClick={onOpenPromptModal}
                title="View System Role & Structure Directives"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-slate-200 transition cursor-pointer"
              >
                <FileCode className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Notebook Customization Bar (Dark Theme Styled) */}
        {showStylePanel && (
          <div className="mt-3 pt-3 border-t border-white/10 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs bg-slate-950/60 p-4 rounded-2xl border border-white/10">
              {/* Paper Selector */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Paper Texture
                </label>
                <div className="flex flex-wrap gap-1">
                  {paperOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => onChangePaperStyle(opt.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                        paperStyle === opt.id
                          ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                          : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Handwriting Typeface */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Handwriting Script
                </label>
                <div className="flex flex-wrap gap-1">
                  {fontOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => onChangeFont(opt.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                        handwritingFont === opt.id
                          ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                          : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {opt.label.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ink Color */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Pen Ink Color
                </label>
                <div className="flex items-center gap-2">
                  {inkOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => onChangeInkColor(opt.id)}
                      title={opt.label}
                      className={`h-6 w-6 rounded-full border border-white/40 shadow-xs transition transform cursor-pointer ${
                        inkColor === opt.id ? 'ring-2 ring-amber-400 scale-110' : 'hover:scale-105 opacity-80'
                      }`}
                      style={{ backgroundColor: opt.bg }}
                    />
                  ))}
                  <span className="text-[11px] font-medium text-slate-300 ml-1">
                    {inkOptions.find((o) => o.id === inkColor)?.label}
                  </span>
                </div>
              </div>

              {/* Writing Size */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Writing Size
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onChangeFontSize(Math.max(14, fontSize - 2))}
                    disabled={fontSize <= 14}
                    className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 disabled:opacity-40 cursor-pointer"
                    title="Smaller handwriting"
                  >
                    <ZoomOut className="h-3.5 w-3.5" />
                  </button>
                  <span className="font-mono font-bold text-xs text-white w-10 text-center">
                    {fontSize}px
                  </span>
                  <button
                    type="button"
                    onClick={() => onChangeFontSize(Math.min(24, fontSize + 2))}
                    disabled={fontSize >= 24}
                    className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 disabled:opacity-40 cursor-pointer"
                    title="Larger handwriting"
                  >
                    <ZoomIn className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
