import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  PenTool, 
  BookOpen, 
  Sparkles, 
  ExternalLink, 
  Award, 
  Layers, 
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  ArrowRight,
  Filter,
  GraduationCap
} from 'lucide-react';
import { SYLLABUS_2026_27_PAGES } from './SyllabusPdfViewerModal';
import { NCERT_SYLLABUS } from '../data/ncertSyllabus';

interface SyllabusSectionProps {
  onGenerateNotesForChapter: (classGrade: string, subject: string, chapter: string) => void;
  onGoToTests?: (classGrade: string, chapter: string) => void;
  activeClass?: string;
  onClassChange?: (cls: string) => void;
}

export const SyllabusSection: React.FC<SyllabusSectionProps> = ({
  onGenerateNotesForChapter,
  onGoToTests,
  activeClass = 'Class 10',
  onClassChange,
}) => {
  // Navigation & Class separation
  const [selectedClassTab, setSelectedClassTab] = useState<'Class 9' | 'Class 10' | 'Class 11' | 'Class 12'>(
    (activeClass as any) || 'Class 10'
  );
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // PDF Viewer mode inside Syllabus Section
  const [viewMode, setViewMode] = useState<'curriculum' | 'pdf'>('curriculum');
  const [currentPdfPage, setCurrentPdfPage] = useState<number>(1);
  const [pdfZoom, setPdfZoom] = useState<number>(100);

  // Available subjects for the selected class
  const classCurriculum = NCERT_SYLLABUS[selectedClassTab] || {};
  const availableSubjects = Object.keys(classCurriculum);

  // Active chapters list based on class and subject filter
  const displayedChapters = Object.entries(classCurriculum).flatMap(([subj, chapters]) => {
    if (selectedSubject !== 'All' && subj !== selectedSubject) return [];
    return chapters
      .filter((ch) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          ch.name.toLowerCase().includes(q) ||
          ch.unit.toLowerCase().includes(q) ||
          ch.keyTopics.some((t) => t.toLowerCase().includes(q))
        );
      })
      .map((ch) => ({ ...ch, subject: subj }));
  });

  // Filtered PDF pages based on selected class or search
  const filteredPdfPages = SYLLABUS_2026_27_PAGES.filter((p) => {
    if (selectedClassTab === 'Class 9') {
      return p.category === 'Class 9' || p.category === 'Intro & Notes';
    }
    if (selectedClassTab === 'Class 10') {
      return p.category === 'Class 10' || p.category === 'Intro & Notes';
    }
    if (selectedClassTab === 'Class 12') {
      return p.category === 'Class 12' || p.category === 'Intro & Notes';
    }
    return true; // Class 11 shows all or general
  });

  const activePdfDocPage = SYLLABUS_2026_27_PAGES.find((p) => p.pageNumber === currentPdfPage) || SYLLABUS_2026_27_PAGES[0];

  const handlePrintPdf = () => {
    const originalTitle = document.title;
    document.title = `NCERT_Syllabus_2026_27_${selectedClassTab}_BuzzingBrain`;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  const handleDownloadPdfFile = () => {
    // Generate clean printable HTML doc for the entire 17-page syllabus
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>CBSE & NCERT Syllabus Reference (2026-27) - ${selectedClassTab}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 40px; color: #1e293b; background: #fff; }
    .header { border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 24px; }
    .title { font-size: 24px; font-weight: 800; color: #0f172a; }
    .sub { font-size: 14px; color: #64748b; margin-top: 4px; }
    .page-box { page-break-after: always; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 24px; }
    .page-title { font-size: 18px; font-weight: 700; color: #0369a1; border-bottom: 1px dashed #cbd5e1; padding-bottom: 8px; margin-bottom: 12px; }
    .line { margin: 6px 0; font-size: 13px; line-height: 1.5; }
    .bold { font-weight: 700; color: #0f172a; }
    .bullet { padding-left: 16px; color: #334155; }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">Official CBSE & NCERT Syllabus (Academic Session 2026–27)</div>
    <div class="sub">Buzzing Brain — Free Education for All &bull; ${selectedClassTab}</div>
  </div>
  ${SYLLABUS_2026_27_PAGES.map(p => `
    <div class="page-box">
      <div class="page-title">Page ${p.pageNumber}: ${p.headerTitle} (${p.category} &bull; ${p.subject})</div>
      ${p.contentLines.map(line => {
        if (!line.trim()) return '<div style="height: 10px;"></div>';
        if (line.startsWith('•')) return `<div class="line bullet">${line}</div>`;
        if (/^[0-9]+\./.test(line)) return `<div class="line bold" style="font-size: 15px; margin-top: 10px;">${line}</div>`;
        return `<div class="line">${line}</div>`;
      }).join('')}
    </div>
  `).join('')}
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NCERT_Syllabus_2026_27_${selectedClassTab}.html`;
    document.body.appendChild(link);
    link.click();
    if (link.parentNode) {
      link.parentNode.removeChild(link);
    }
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-100">
      {/* 1. Header Banner */}
      <div className="astra-card border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Academic Session 2026–27 Official Reference</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              CBSE &amp; NCERT Syllabus <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-violet-400">
                Separated by Class &amp; Chapter
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Fully aligned with the 17-page <strong>Class 9, 10 &amp; 12 Science and Social Science Syllabus Reference</strong>. Explore official chapters, inspect the embedded PDF document, and click any unit to immediately generate authentic handwritten study notes.
            </p>
          </div>

          {/* Quick PDF Action Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <button
              onClick={() => setViewMode(viewMode === 'pdf' ? 'curriculum' : 'pdf')}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm shadow-xl transition-all cursor-pointer active:scale-95"
            >
              <FileText className="w-4 h-4" />
              <span>{viewMode === 'pdf' ? 'View Chapter Catalog' : 'Open Embedded PDF (17 Pages)'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrintPdf}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/10 transition-colors cursor-pointer"
                title="Print Syllabus Document"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print PDF</span>
              </button>

              <button
                onClick={handleDownloadPdfFile}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/10 transition-colors cursor-pointer"
                title="Download Syllabus Reference"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Class Selector Navigation (Separating Each Class Cleanly) */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        {/* Class Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/10">
          {(['Class 9', 'Class 10', 'Class 11', 'Class 12'] as const).map((cls) => (
            <button
              key={cls}
              onClick={() => {
                setSelectedClassTab(cls);
                setSelectedSubject('All');
                if (onClassChange) onClassChange(cls);
                // Adjust current PDF page to start of class
                if (cls === 'Class 9') setCurrentPdfPage(2);
                else if (cls === 'Class 10') setCurrentPdfPage(5);
                else if (cls === 'Class 12') setCurrentPdfPage(10);
                else setCurrentPdfPage(1);
              }}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedClassTab === cls
                  ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cls}
            </button>
          ))}
        </div>

        {/* View Toggle (Interactive Chapters vs Full PDF Viewer) */}
        <div className="flex items-center gap-2 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setViewMode('curriculum')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'curriculum'
                ? 'bg-white/20 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Chapter Notes Portal</span>
          </button>
          <button
            onClick={() => setViewMode('pdf')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'pdf'
                ? 'bg-white/20 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-violet-400" />
            <span>Official Syllabus PDF</span>
          </button>
        </div>
      </div>

      {/* 3. MODE A: Interactive Chapter Grid with "Make Notes According to It" */}
      {viewMode === 'curriculum' && (
        <div className="space-y-6">
          {/* Filter Bar: Subject Filter & Search Input */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Subject Filters */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setSelectedSubject('All')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  selectedSubject === 'All'
                    ? 'bg-white/20 text-white font-bold'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                All Subjects
              </button>
              {availableSubjects.map((subj) => (
                <button
                  key={subj}
                  onClick={() => setSelectedSubject(subj)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    selectedSubject === subj
                      ? 'bg-violet-500/30 text-violet-200 border border-violet-500/40 font-bold'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {subj}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${selectedClassTab} syllabus...`}
                className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400 transition-colors"
              />
            </div>
          </div>

          {/* Chapters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedChapters.map((chapter, idx) => (
              <div
                key={`${chapter.subject}-${chapter.number}-${idx}`}
                className="astra-card rounded-2xl border border-white/10 p-5 flex flex-col justify-between hover:border-amber-400/40 transition-all group shadow-md"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-amber-400 font-bold">
                      Ch {chapter.number}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white/5 text-slate-400 border border-white/10 text-[11px]">
                      {chapter.subject}
                    </span>
                  </div>

                  {/* Chapter Name & Unit */}
                  <div>
                    <h3 className="font-extrabold text-base text-white group-hover:text-amber-300 transition-colors leading-snug">
                      {chapter.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 font-medium">
                      Unit: {chapter.unit}
                    </p>
                  </div>

                  {/* Prescribed Key Topics Pills */}
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                      Prescribed Syllabus Topics:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {chapter.keyTopics.slice(0, 3).map((topic, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded-md bg-slate-800 text-[11px] text-slate-300 border border-white/5"
                        >
                          {topic}
                        </span>
                      ))}
                      {chapter.keyTopics.length > 3 && (
                        <span className="px-1.5 py-0.5 text-[10px] text-slate-400 font-mono">
                          +{chapter.keyTopics.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Actions: Direct "Make Notes According to It" */}
                <div className="pt-5 mt-4 border-t border-white/10 flex items-center gap-2">
                  <button
                    onClick={() => onGenerateNotesForChapter(selectedClassTab, chapter.subject, chapter.name)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    <span>Make Notes According to It</span>
                  </button>

                  {onGoToTests && (
                    <button
                      onClick={() => onGoToTests(selectedClassTab, chapter.name)}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                      title="Practice Chapter Test"
                    >
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {displayedChapters.length === 0 && (
            <div className="text-center py-16 astra-card rounded-2xl border border-white/10">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No chapters found</h3>
              <p className="text-xs text-slate-400 mt-1">
                Try searching for a different term or select "All Subjects".
              </p>
            </div>
          )}
        </div>
      )}

      {/* 4. MODE B: Embedded Official 17-Page Syllabus PDF Viewer */}
      {viewMode === 'pdf' && (
        <div className="space-y-4">
          {/* PDF Viewer Controls Toolbar */}
          <div className="astra-card rounded-2xl border border-white/10 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 text-xs shadow-lg">
            {/* Page navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPdfPage((p) => Math.max(1, p - 1))}
                disabled={currentPdfPage <= 1}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1 text-slate-300 font-mono">
                <span>Page</span>
                <select
                  value={currentPdfPage}
                  onChange={(e) => setCurrentPdfPage(Number(e.target.value))}
                  className="bg-slate-900 border border-white/20 rounded-lg px-2 py-1 text-white text-xs outline-none cursor-pointer"
                >
                  {SYLLABUS_2026_27_PAGES.map((p) => (
                    <option key={p.pageNumber} value={p.pageNumber}>
                      {p.pageNumber}: {p.headerTitle.slice(0, 28)}
                    </option>
                  ))}
                </select>
                <span>of {SYLLABUS_2026_27_PAGES.length}</span>
              </div>

              <button
                onClick={() => setCurrentPdfPage((p) => Math.min(SYLLABUS_2026_27_PAGES.length, p + 1))}
                disabled={currentPdfPage >= SYLLABUS_2026_27_PAGES.length}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white cursor-pointer"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Category / Scope tag */}
            <div className="hidden md:flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-amber-400/20 text-amber-300 font-semibold border border-amber-400/30">
                {activePdfDocPage.category}
              </span>
              <span className="text-slate-400">&bull;</span>
              <span className="text-slate-300 font-medium">
                {activePdfDocPage.subject}
              </span>
            </div>

            {/* Zoom & Action tools */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-black/40 border border-white/10 rounded-xl p-0.5">
                <button
                  onClick={() => setPdfZoom((z) => Math.max(80, z - 10))}
                  className="p-1 hover:bg-white/10 rounded text-slate-300 cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-[11px] px-1 text-slate-300">{pdfZoom}%</span>
                <button
                  onClick={() => setPdfZoom((z) => Math.min(130, z + 10))}
                  className="p-1 hover:bg-white/10 rounded text-slate-300 cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handlePrintPdf}
                className="flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white rounded-xl font-medium cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print</span>
              </button>

              <button
                onClick={handleDownloadPdfFile}
                className="flex items-center gap-1 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>

          {/* The Realistic Rendered Document Page */}
          <div className="flex justify-center overflow-x-auto pb-8">
            <div 
              style={{ transform: `scale(${pdfZoom / 100})`, transformOrigin: 'top center' }}
              className="w-full max-w-4xl bg-white text-slate-900 rounded-2xl shadow-2xl p-8 sm:p-12 border border-slate-300 font-sans min-h-[900px] transition-transform flex flex-col justify-between"
            >
              {/* Official Document Header */}
              <div className="border-b-2 border-slate-900 pb-4 mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block">
                    Central Board of Secondary Education &bull; NCERT Reference
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight mt-0.5">
                    {activePdfDocPage.headerTitle}
                  </h2>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-300 inline-block">
                    Page {activePdfDocPage.pageNumber} of {SYLLABUS_2026_27_PAGES.length}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-1 font-mono">
                    Session 2026–27
                  </span>
                </div>
              </div>

              {/* Document Text Content with high readability */}
              <div className="space-y-2.5 text-xs sm:text-sm text-slate-800 leading-relaxed font-sans flex-1">
                {activePdfDocPage.contentLines.map((line, idx) => {
                  if (!line.trim()) {
                    return <div key={idx} className="h-3" />;
                  }

                  // Main heading
                  if (line.startsWith('CLASS') || line.includes('SYLLABUS REFERENCE')) {
                    return (
                      <div key={idx} className="text-base sm:text-lg font-black text-slate-950 border-b border-slate-200 pb-1 pt-2">
                        {line}
                      </div>
                    );
                  }

                  // Numbered unit / chapter heading
                  if (/^[0-9]+\.\s+/.test(line)) {
                    return (
                      <div key={idx} className="flex items-center justify-between pt-3 pb-1 border-b border-slate-200">
                        <span className="font-extrabold text-slate-950 text-sm sm:text-base">
                          {line}
                        </span>
                        <button
                          onClick={() => {
                            const cleanCh = line.replace(/^[0-9]+\.\s+/, '').trim();
                            onGenerateNotesForChapter(selectedClassTab, activePdfDocPage.subject, cleanCh);
                          }}
                          className="px-2.5 py-1 rounded-md bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-[11px] shadow-xs cursor-pointer flex items-center gap-1"
                        >
                          <PenTool className="w-3 h-3" />
                          <span>Synthesize Notes</span>
                        </button>
                      </div>
                    );
                  }

                  // Bullet points
                  if (line.startsWith('•')) {
                    return (
                      <div key={idx} className="flex items-start gap-2 pl-4 text-slate-700">
                        <span className="text-amber-600 font-bold select-none">&bull;</span>
                        <span>{line.replace(/^•\s*/, '')}</span>
                      </div>
                    );
                  }

                  // Regular paragraph line
                  return (
                    <p key={idx} className="text-slate-800">
                      {line}
                    </p>
                  );
                })}
              </div>

              {/* Document Footer */}
              <div className="pt-6 border-t border-slate-200 mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 font-mono">
                <span>Buzzing Brain &bull; Free Education for All &bull; 2026–27 Syllabus Reference</span>
                <span>Page {activePdfDocPage.pageNumber} / {SYLLABUS_2026_27_PAGES.length}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
