import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Lightbulb, 
  Star, 
  CheckSquare, 
  Square, 
  Bookmark, 
  Calendar, 
  BookOpen, 
  PlusCircle, 
  Printer,
  X
} from 'lucide-react';
import { parseMathInText, parseNoteMarkdown } from '../utils/latexParser';
import { PaperStyle, HandwritingFont, InkColor, UserStickyNote } from '../types';
import { DiagramSketchCanvas } from './DiagramSketchCanvas';

interface TopperRegisterPageProps {
  topic: string;
  grade: string;
  subject: string;
  markdown: string;
  paperStyle: PaperStyle;
  handwritingFont: HandwritingFont;
  inkColor: InkColor;
  fontSize: number; // e.g. 16, 18, 20
  diagramBlueprintPrompt?: string;
  diagramImageUrl?: string;
  onImageGenerated?: (imageUrl: string) => void;
  stickyNotes: UserStickyNote[];
  onAddStickyNote: (text: string, color: 'yellow' | 'pink' | 'blue') => void;
  onDeleteStickyNote: (id: string) => void;
}

export const TopperRegisterPage: React.FC<TopperRegisterPageProps> = ({
  topic,
  grade,
  subject,
  markdown,
  paperStyle,
  handwritingFont,
  inkColor,
  fontSize,
  diagramBlueprintPrompt,
  diagramImageUrl,
  onImageGenerated,
  stickyNotes,
  onAddStickyNote,
  onDeleteStickyNote,
}) => {
  const [checkedRevisionItems, setCheckedRevisionItems] = useState<Record<number, boolean>>({});
  const [newStickyText, setNewStickyText] = useState('');
  const [showAddSticky, setShowAddSticky] = useState(false);
  const [stickyColor, setStickyColor] = useState<'yellow' | 'pink' | 'blue'>('yellow');

  // Parse markdown into structured note sections
  const sections = React.useMemo(() => parseNoteMarkdown(markdown), [markdown]);

  // Ink color styles
  const inkColorClass = {
    blue: 'text-[#1a365d]',      // Classic Royal Gel Blue
    'royal-blue': 'text-[#1a365d]',
    black: 'text-[#18181b]',     // Crisp Ballpoint Black
    'classic-black': 'text-[#18181b]',
    red: 'text-[#991b1b]',       // Red Ink
    'academic-red': 'text-[#991b1b]',
    green: 'text-[#065f46]',     // Scholar Emerald Ink
    'emerald-green': 'text-[#065f46]',
    purple: 'text-[#581c87]',    // Deep Violet Ink
    'pencil-gray': 'text-[#475569]',
  }[inkColor as string] || 'text-[#1a365d]';

  // Font family styles
  const fontClass = {
    kalam: 'font-hand-kalam',
    Kalam: 'font-hand-kalam',
    caveat: 'font-hand-caveat',
    Caveat: 'font-hand-caveat',
    patrick: 'font-hand-patrick',
    'Patrick Hand': 'font-hand-patrick',
    indie: 'font-hand-indie',
    'Indie Flower': 'font-hand-indie',
    gloria: 'font-hand-gloria',
    'Architects Daughter': 'font-hand-patrick',
    'Homemade Apple': 'font-hand-caveat',
  }[handwritingFont as string] || 'font-hand-kalam';

  // Paper styling class
  const paperClass = {
    ruled: 'paper-ruled',
    'ruled-tight': 'paper-ruled-tight',
    grid: 'paper-grid',
    dotted: 'paper-dotted',
    plain: 'paper-plain',
  }[paperStyle as string] || 'paper-ruled';

  const handleToggleCheck = (index: number) => {
    setCheckedRevisionItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleCreateStickyNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStickyText.trim()) return;
    onAddStickyNote(newStickyText.trim(), stickyColor);
    setNewStickyText('');
    setShowAddSticky(false);
  };

  // Extract date string for notebook page top
  const todayDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Split sections for 2-page landscape A4 spread
  const midPoint = Math.ceil(sections.length / 2);
  const sectionsLeft = sections.slice(0, midPoint);
  const sectionsRight = sections.slice(midPoint);

  const renderSectionItem = (section: any, idx: number) => {
    switch (section.type) {
      case 'header':
        return (
          <div key={idx} className="pt-2 pb-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight inline-block border-b-4 border-amber-300/80 pb-1 leading-snug">
              {section.content}
            </h1>
          </div>
        );

      case 'learning_objective':
        return (
          <div key={idx} className="my-2 py-1 px-3 bg-amber-100/60 rounded-lg border-l-4 border-amber-400">
            <p className="italic text-slate-700 text-sm sm:text-base leading-relaxed">
              🎯 <strong className="font-semibold text-slate-800">Learning Objective:</strong>{' '}
              {section.content.replace(/^learning objective:\s*/i, '')}
            </p>
          </div>
        );

      case 'section':
        return (
          <div key={idx} className="pt-4 pb-1">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2 border-b-2 border-blue-400/50 pb-1">
              <span className="text-blue-600 font-mono text-base">§</span>
              <span dangerouslySetInnerHTML={{ __html: parseMathInText(section.content) }} />
            </h2>
          </div>
        );

      case 'subsection':
        return (
          <div key={idx} className="pt-2 pb-1">
            <h3 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-1.5">
              <span className="text-blue-500 text-sm">▶</span>
              <span dangerouslySetInnerHTML={{ __html: parseMathInText(section.content) }} />
            </h3>
          </div>
        );

      case 'margin_note': {
        const isExamAlert = section.alertType === 'exam_alert';
        const isPitfall = section.alertType === 'pitfall';
        const isMnemonic = section.alertType === 'mnemonic';

        let borderBg = 'border-red-400 bg-red-50/70 text-red-900';
        let icon = <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />;
        let badgeLabel = 'EXAM ALERT';

        if (isPitfall) {
          borderBg = 'border-amber-400 bg-amber-50/70 text-amber-950';
          icon = <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />;
          badgeLabel = 'COMMON PITFALL';
        } else if (isMnemonic) {
          borderBg = 'border-purple-400 bg-purple-50/70 text-purple-950';
          icon = <Lightbulb className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />;
          badgeLabel = 'TOPPER MNEMONIC';
        } else if (section.alertType === 'five_star') {
          borderBg = 'border-emerald-500 bg-emerald-50/70 text-emerald-950';
          icon = <Star className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />;
          badgeLabel = '5-MARK FAVORITE';
        }

        return (
          <div
            key={idx}
            className={`my-3 rounded-xl border-2 p-3 shadow-xs transform -rotate-[0.3deg] transition hover:rotate-0 ${borderBg}`}
          >
            <div className="flex items-start gap-2.5">
              {icon}
              <div className="flex-1">
                <span className="inline-block px-2 py-0.5 rounded text-[11px] font-sans-clean font-bold tracking-wider uppercase mb-1 bg-white/80 shadow-2xs">
                  {badgeLabel}
                </span>
                <div
                  className="leading-relaxed font-hand-kalam font-medium"
                  dangerouslySetInnerHTML={{ __html: parseMathInText(section.content) }}
                />
              </div>
            </div>
          </div>
        );
      }

      case 'formula_key':
        return (
          <div
            key={idx}
            className="ml-4 my-2 p-2 rounded-lg bg-slate-100/70 border-l-3 border-blue-500 text-xs sm:text-sm font-sans-clean text-slate-700"
          >
            <strong className="text-blue-900 font-semibold uppercase tracking-wider text-[11px] block mb-1">
              Variable Key & Definitions:
            </strong>
            <div
              className="leading-normal font-hand-patrick"
              dangerouslySetInnerHTML={{ __html: parseMathInText(section.content) }}
            />
          </div>
        );

      case 'bullet':
        return (
          <div key={idx} className="flex items-start gap-2 pl-2 sm:pl-3 leading-relaxed">
            <span className="text-blue-500 select-none mt-1 text-sm font-bold">•</span>
            <div
              className="flex-1"
              dangerouslySetInnerHTML={{ __html: parseMathInText(section.content) }}
            />
          </div>
        );

      case 'diagram_blueprint':
        return (
          <DiagramSketchCanvas
            key={idx}
            blueprintPrompt={section.content || diagramBlueprintPrompt || ''}
            topic={topic}
            existingImageUrl={diagramImageUrl}
            onImageGenerated={onImageGenerated}
          />
        );

      case 'revision_summary': {
        const summaryLines = section.content
          .split('\n')
          .map((l: string) => l.trim())
          .filter((l: string) => l.length > 0 && !l.startsWith('##'));

        return (
          <div
            key={idx}
            className="mt-6 rounded-2xl border-2 border-emerald-400 bg-emerald-50/50 p-4 sm:p-5 shadow-sm"
          >
            <div className="flex items-center gap-2 border-b border-emerald-200 pb-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
                <CheckSquare className="h-4 w-4" />
              </div>
              <h3 className="font-hand-kalam text-lg sm:text-xl font-bold text-emerald-950">
                Quick Revision Summary (Exam Ready Checklist)
              </h3>
            </div>

            <div className="space-y-2">
              {summaryLines.map((line: string, rIdx: number) => {
                const cleanLine = line.replace(/^[-*•]\s+|\d+\.\s+/, '');
                const isChecked = !!checkedRevisionItems[rIdx];
                return (
                  <div
                    key={rIdx}
                    onClick={() => handleToggleCheck(rIdx)}
                    className={`flex items-start gap-3 p-2 rounded-xl cursor-pointer transition select-none ${
                      isChecked
                        ? 'bg-emerald-100/80 text-emerald-900 line-through opacity-75'
                        : 'bg-white/80 hover:bg-emerald-100/50 text-slate-800'
                    }`}
                  >
                    <button
                      type="button"
                      className="mt-0.5 text-emerald-600 shrink-0"
                    >
                      {isChecked ? (
                        <CheckSquare className="h-4 w-4" />
                      ) : (
                        <Square className="h-4 w-4 text-emerald-400" />
                      )}
                    </button>
                    <div
                      className="text-xs sm:text-base leading-snug font-hand-patrick"
                      dangerouslySetInnerHTML={{ __html: parseMathInText(cleanLine) }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      case 'paragraph':
      default:
        return (
          <div
            key={idx}
            className="leading-relaxed pl-1"
            dangerouslySetInnerHTML={{ __html: parseMathInText(section.content) }}
          />
        );
    }
  };

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = `${subject}_${topic}_Revision_Notes_BuzzingBrain`.replace(/[^a-zA-Z0-9_-]/g, '_');
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1500);
  };

  return (
    <>
      {/* 1. Interactive Web Notebook Sheet (Hidden during print) */}
      <div className="relative mx-auto w-full max-w-4xl print-page transition-all print:hidden">
        {/* Notebook Spine / Spiral Binder Holes (Decorative left edge) */}
        <div className="absolute -left-3 sm:-left-5 top-0 bottom-0 w-6 sm:w-8 spiral-holes z-20 pointer-events-none opacity-60 hidden sm:block" />

        {/* Main Notebook Sheet */}
        <div
          className={`relative rounded-2xl shadow-xl border border-[#e2dacf] p-6 sm:p-10 md:p-12 overflow-hidden ${paperClass} ${fontClass} ${inkColorClass}`}
          style={{ fontSize: `${fontSize}px`, minHeight: '1050px' }}
        >
          {/* Notebook Page Header (Page No, Date, Subject Tag) */}
          <div className="flex flex-wrap items-center justify-between border-b-2 border-red-300/80 pb-3 mb-6 font-hand-patrick text-sm sm:text-base text-slate-600">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 font-bold text-slate-800">
                <BookOpen className="h-4 w-4 text-red-500" />
                <span>{subject || 'General Science'}</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="bg-red-100/80 text-red-700 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                {grade}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-600">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span>Date: <strong>{todayDate}</strong></span>
              </span>
              <span className="bg-white/80 px-2 py-0.5 rounded border border-slate-200 font-mono text-xs">
                Page <strong>01</strong>
              </span>
            </div>
          </div>

          {/* Floating Custom Sticky Notes */}
          {stickyNotes.length > 0 && (
            <div className="absolute right-4 top-16 z-30 flex flex-col gap-3 pointer-events-auto max-w-[200px] no-print">
              {stickyNotes.map((note) => {
                const bgClass =
                  note.color === 'yellow'
                    ? 'sticky-note-yellow'
                    : note.color === 'pink'
                    ? 'sticky-note-pink'
                    : 'sticky-note-blue';
                return (
                  <div
                    key={note.id}
                    className={`relative p-3 rounded-b-md text-xs sm:text-sm transform rotate-1 hover:rotate-0 transition font-hand-caveat text-slate-800 ${bgClass}`}
                  >
                    <button
                      onClick={() => onDeleteStickyNote(note.id)}
                      className="absolute top-1 right-1 text-slate-400 hover:text-red-500"
                      title="Remove sticky note"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <p className="whitespace-pre-wrap leading-tight mt-1">{note.text}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Content Flow */}
          <div className="space-y-4">
            {sections.map((section, idx) => renderSectionItem(section, idx))}
          </div>

          {/* Notebook Footer Signature Stamp */}
          <div className="mt-12 pt-4 border-t border-slate-300/70 flex flex-wrap items-center justify-between text-xs font-hand-patrick text-slate-500">
            <div className="flex items-center gap-2">
              <Bookmark className="h-3.5 w-3.5 text-amber-500" />
              <span>BuzzingBrain Revision Notes • 100% Exam Yield</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="italic font-hand-caveat text-slate-600">
                "Neat diagrams &amp; explicit formulas score full marks."
              </span>
            </div>
          </div>

          {/* Prominent Print to PDF Action Bar in Register View */}
          <div className="mt-8 pt-4 border-t border-slate-300/80 flex flex-wrap items-center justify-between gap-4 no-print font-sans-clean">
            <div className="flex items-center gap-2">
              <Bookmark className="h-4 w-4 text-amber-500" />
              <span className="text-xs sm:text-sm font-hand-patrick text-slate-700">
                BuzzingBrain • CBSE • NEET • JEE High-Yield Revision Register
              </span>
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm shadow-lg transition active:scale-95 cursor-pointer border border-amber-300"
              title="Format current note as a landscape A4 spread and print to PDF"
            >
              <Printer className="h-4 w-4 text-slate-950" />
              <span>Print to PDF (Landscape A4 Spread)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. DEDICATED A4 LANDSCAPE PRINT SPREAD CONTAINER (Formats note as 2-page landscape spread) */}
      <div 
        className="hidden print:block w-full space-y-0"
        style={{ fontSize: `${Math.max(13, fontSize - 3)}px` }}
      >
        <div className="a4-landscape-sheet">
          {/* Spread 1 Left: Page 01 */}
          <div className={`a4-landscape-page ${paperClass} ${fontClass} ${inkColorClass}`}>
            <div className="relative pr-2 min-h-[175mm] flex flex-col justify-between">
              <div className="absolute left-6 top-0 bottom-0 w-1 border-r-2 border-double border-red-400/60 pointer-events-none" />
              <div className="pl-9 space-y-3">
                {/* Register Header */}
                <div className="flex items-center justify-between border-b-2 border-red-400/60 pb-1 text-xs font-sans font-bold">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-red-100 border border-red-300 text-red-900 rounded font-mono text-[11px]">
                      PAGE 01
                    </span>
                    <span className="text-slate-600 font-mono text-[11px]">DATE: {todayDate}</span>
                    <span className="text-slate-600 text-[11px]">SUBJECT: {subject}</span>
                  </div>
                  <span className="bg-red-100/80 text-red-700 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase">
                    {grade}
                  </span>
                </div>

                <div className="text-center my-1">
                  <div className="inline-block px-4 py-1 rounded-xl bg-rose-50/90 border border-rose-400 shadow-xs">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                      {topic}
                    </h1>
                  </div>
                </div>

                <div className="space-y-3">
                  {sectionsLeft.map((section, idx) => renderSectionItem(section, idx))}
                </div>
              </div>

              <div className="pl-9 pt-2 flex items-center justify-between text-[11px] text-slate-500 font-sans border-t border-slate-300 mt-2">
                <span className="font-bold text-slate-700">Page 01 &bull; Core Foundations</span>
                <span className="font-mono">BuzzingBrain Topper Register &bull; Free Education</span>
              </div>
            </div>
          </div>

          {/* Spread 1 Right: Page 02 */}
          <div className={`a4-landscape-page ${paperClass} ${fontClass} ${inkColorClass}`}>
            <div className="relative pl-2 min-h-[175mm] flex flex-col justify-between">
              <div className="absolute left-6 top-0 bottom-0 w-1 border-r-2 border-double border-red-400/60 pointer-events-none" />
              <div className="pl-9 space-y-3">
                {/* Register Header */}
                <div className="flex items-center justify-between border-b-2 border-red-400/60 pb-1 text-xs font-sans font-bold">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-red-100 border border-red-300 text-red-900 rounded font-mono text-[11px]">
                      PAGE 02
                    </span>
                    <span className="text-slate-600 font-mono text-[11px]">DATE: {todayDate}</span>
                    <span className="text-slate-600 text-[11px] font-bold text-emerald-800">HIGH-YIELD BOARD SECTION</span>
                  </div>
                  <span className="px-2 py-0.5 border border-emerald-600 text-emerald-800 rounded text-[10px] font-bold uppercase bg-emerald-50">
                    AIR 1 VERIFIED
                  </span>
                </div>

                <div className="space-y-3">
                  {sectionsRight.map((section, idx) => renderSectionItem(section, sectionsLeft.length + idx))}
                </div>

                {/* Stamp */}
                <div className="mt-4 pt-3 border-t border-slate-300/70 flex items-center justify-between text-xs font-hand-patrick text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Bookmark className="h-3.5 w-3.5 text-red-500" />
                    <span>Topper's Verified Notes Register &bull; 100% Exam Yield</span>
                  </div>
                  <span className="italic font-hand-caveat text-slate-600">
                    "Neat diagrams &amp; explicit formulas score full marks."
                  </span>
                </div>
              </div>

              <div className="pl-9 pt-2 flex items-center justify-between text-[11px] text-slate-500 font-sans border-t border-slate-300 mt-2">
                <span className="font-bold text-slate-700">Page 02 &bull; Formulas &amp; Exam Strategy</span>
                <span className="font-mono">100% Free Open Education</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Add Sticky Note Button (no-print) */}
      <div className="fixed bottom-6 right-6 z-40 no-print flex flex-col items-end gap-2">
        {showAddSticky && (
          <form
            onSubmit={handleCreateStickyNote}
            className="w-72 rounded-xl bg-white p-4 shadow-2xl border border-slate-200 animate-in fade-in slide-in-from-bottom-4 font-sans-clean"
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800">Add Margin Sticky Note</span>
              <button
                type="button"
                onClick={() => setShowAddSticky(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <textarea
              value={newStickyText}
              onChange={(e) => setNewStickyText(e.target.value)}
              placeholder="e.g. Revise this before Tuesday test! Remember unit conversion..."
              className="w-full h-20 rounded-lg border border-slate-200 p-2 text-xs focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
              autoFocus
            />
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1.5">
                {(['yellow', 'pink', 'blue'] as const).map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setStickyColor(color)}
                    className={`h-4 w-4 rounded-full border border-slate-300 transition ${
                      stickyColor === color ? 'ring-2 ring-slate-800 scale-110' : ''
                    } ${
                      color === 'yellow'
                        ? 'bg-amber-200'
                        : color === 'pink'
                        ? 'bg-pink-300'
                        : 'bg-sky-300'
                    }`}
                  />
                ))}
              </div>
              <button
                type="submit"
                className="rounded-lg bg-amber-500 px-3 py-1 text-xs font-semibold text-white shadow-xs hover:bg-amber-600 transition"
              >
                Pin Note
              </button>
            </div>
          </form>
        )}

        <button
          onClick={() => setShowAddSticky((prev) => !prev)}
          className="flex items-center gap-2 rounded-full bg-amber-500 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg hover:bg-amber-600 hover:scale-105 transition cursor-pointer"
          title="Stick a quick note on this page"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Sticky Note</span>
        </button>
      </div>
    </>
  );
};
