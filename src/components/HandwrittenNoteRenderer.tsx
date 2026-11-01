import React, { useRef, useState, useEffect } from 'react';
import { 
  Printer, 
  Share2, 
  Bookmark, 
  BookmarkCheck, 
  Check, 
  Sparkles, 
  ZoomIn, 
  ZoomOut, 
  FileText,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  ArrowRight,
  Download,
  RotateCcw,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Columns,
  Eye,
  Maximize2,
  BookMarked,
  Palette,
  Sparkle,
  Loader2,
  PenTool,
  Cpu,
  Atom,
  Clock
} from 'lucide-react';
import { NoteContentPayload, HandwritingStyleConfig, NoteSection } from '../types';
import { MathFormulaRenderer } from './MathFormulaRenderer';

export interface HandwrittenNoteRendererProps {
  note?: NoteContentPayload | null;
  styleConfig?: HandwritingStyleConfig;
  isLoading?: boolean;
  isSynthesizing?: boolean;
  loadingMessage?: string;
  synthesizingStep?: string;
  onSaveToLibrary?: () => void;
  isSaved?: boolean;
  onOpenChatWithNote?: (note: NoteContentPayload) => void;
  rawNoteId?: string;
  isLoggedIn?: boolean;
  onRequireAuth?: () => void;
  onRegeneratePage?: (pageIndex: number) => void;
  onRegenerateSection?: (sectionIndex: number) => void;
  onSelectSampleChapter?: (chapterKey: string) => void;
}

// Stage sequence for realistic educational notes synthesis
const SYNTH_STAGES = [
  {
    step: 'Stage 1 of 5',
    title: 'Curriculum & Blueprint Alignment',
    detail: 'Validating CBSE 2026–27 syllabus, unit marks weightage & NCERT chapter guidelines...',
    badge: 'CBSE 2026–27',
  },
  {
    step: 'Stage 2 of 5',
    title: 'Synthesizing Core Concepts & Laws',
    detail: 'Inking foundational theory, principles, governing equations & definitions...',
    badge: 'NCERT Core',
  },
  {
    step: 'Stage 3 of 5',
    title: 'Generating Vector Diagrams & FBDs',
    detail: 'Drafting high-resolution labeled apparatus, molecular models & coordinate curves...',
    badge: 'Section C/D Visuals',
  },
  {
    step: 'Stage 4 of 5',
    title: 'Formulating Board Alerts & PYQs',
    detail: 'Compiling common red-pen student traps, 5-mark long answers & worked numericals...',
    badge: 'High-Yield PYQs',
  },
  {
    step: 'Stage 5 of 5',
    title: 'Calligraphy & Layout Inking',
    detail: 'Typesetting natural gel pen handwriting, highlighter notes & register spine binding...',
    badge: 'Topper Register',
  },
];

const BOARD_STUDY_TIPS = [
  "💡 CBSE Evaluation Rule: Writing the general formula before substituting numbers guarantees full step-marks.",
  "💡 High-Yield Tip: Diagrams with labeled arrows and state symbols (s, l, g, aq) award maximum presentation marks.",
  "💡 Topper Secret: Box numerical final answers along with explicit SI units to catch the examiner's eye immediately.",
  "💡 Common Blunder Alert: Never skip defining variables in derivation questions; write where each symbol is introduced.",
  "💡 100% Mark Strategy: In 5-mark long questions, structure points with distinct headings rather than running paragraphs."
];

// Sample chapters for quick switching
const SAMPLE_CHAPTERS = [
  { label: "🍃 10th Science: Photosynthesis", key: "Class 10:Science:Photosynthesis" },
  { label: "⚛️ 11th Physics: Laws of Motion", key: "Class 11:Physics:Laws of Motion" },
  { label: "📐 10th Math: Quadratic Equations", key: "Class 10:Mathematics:Quadratic Equations" },
  { label: "🧪 10th Science: Chemical Reactions", key: "Class 10:Science:Chemical Reactions and Equations" },
  { label: "🔬 9th Science: Cell (Fundamental Unit)", key: "Class 9:Science:The Fundamental Unit of Life: Cell" },
  { label: "⚡ 12th Physics: Electric Charges", key: "Class 12:Physics:Electric Charges and Fields" },
  { label: "🧬 11th Chemistry: Chemical Bonding", key: "Class 11:Chemistry:Chemical Bonding and Molecular Structure" },
];

export const HandwrittenNoteRenderer: React.FC<HandwrittenNoteRendererProps> = ({
  note,
  styleConfig,
  isLoading = false,
  isSynthesizing = false,
  loadingMessage,
  synthesizingStep,
  onSaveToLibrary,
  isSaved = false,
  onOpenChatWithNote,
  rawNoteId,
  isLoggedIn = false,
  onRequireAuth,
  onRegeneratePage,
  onRegenerateSection,
  onSelectSampleChapter,
}) => {
  const noteRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [copiedLink, setCopiedLink] = useState(false);
  const [currentFont, setCurrentFont] = useState(styleConfig?.fontFamily || 'Kalam');
  const [currentInk, setCurrentInk] = useState(styleConfig?.inkColor || 'royal-blue');
  const [paperType, setPaperType] = useState<string>(styleConfig?.paperType || 'ruled-notebook');

  // Reactively sync when parent passes a new styleConfig
  useEffect(() => {
    if (styleConfig) {
      if (styleConfig.fontFamily) setCurrentFont(styleConfig.fontFamily);
      if (styleConfig.inkColor) setCurrentInk(styleConfig.inkColor);
      if (styleConfig.paperType) setPaperType(styleConfig.paperType);
    }
  }, [styleConfig?.fontFamily, styleConfig?.inkColor, styleConfig?.paperType]);

  // Notebook View Mode: 'spread' (2-page open notebook spread) | 'single' (browse page-by-page) | 'all' (all pages printable)
  const [layoutMode, setLayoutMode] = useState<'spread' | 'single' | 'all'>('spread');
  // In spread mode: Spread 1 (Pages 1 & 2) vs Spread 2 (Pages 3 & 4)
  const [activeSpread, setActiveSpread] = useState<1 | 2>(1);
  // In single page mode: 1 | 2 | 3 | 4
  const [activeSinglePage, setActiveSinglePage] = useState<number>(1);
  const [showStyleDrawer, setShowStyleDrawer] = useState(false);

  // Synthesizing & Skeleton state
  const isActivelyLoading = Boolean(isLoading || isSynthesizing || !note);
  const [synthStage, setSynthStage] = useState(0);
  const [synthProgress, setSynthProgress] = useState(18);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!isActivelyLoading) return;

    setElapsedSeconds(0);
    setSynthProgress(18);
    setSynthStage(0);

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    const stageInterval = setInterval(() => {
      setSynthStage((prev) => (prev + 1) % SYNTH_STAGES.length);
    }, 2800);

    const progInterval = setInterval(() => {
      setSynthProgress((prev) => {
        if (prev >= 92) return prev;
        const jump = Math.floor(Math.random() * 6) + 3;
        return Math.min(92, prev + jump);
      });
    }, 600);

    return () => {
      clearInterval(timer);
      clearInterval(stageInterval);
      clearInterval(progInterval);
    };
  }, [isActivelyLoading]);

  // Class ink styling
  const getInkColorClass = (ink: string) => {
    if (paperType === 'chalkboard-dark') {
      switch (ink) {
        case 'royal-blue': return 'text-[#93c5fd]';
        case 'academic-red': return 'text-[#fca5a5]';
        case 'emerald-green': return 'text-[#86efac]';
        case 'pencil-gray': return 'text-[#cbd5e1]';
        default: return 'text-[#ffffff]';
      }
    }
    switch (ink) {
      case 'royal-blue': return 'text-[#1e3a8a]';
      case 'classic-black': return 'text-[#18181b]';
      case 'academic-red': return 'text-[#881337]';
      case 'emerald-green': return 'text-[#064e3b]';
      case 'pencil-gray': return 'text-[#374151]';
      default: return 'text-[#1e3a8a]';
    }
  };

  const getHeadingInkClass = (ink: string) => {
    if (paperType === 'chalkboard-dark') {
      return 'text-[#fef08a] border-[#fde047]';
    }
    switch (ink) {
      case 'royal-blue': return 'text-[#172554] border-[#1e3a8a]';
      case 'classic-black': return 'text-[#09090b] border-[#18181b]';
      case 'academic-red': return 'text-[#4c0519] border-[#881337]';
      case 'emerald-green': return 'text-[#022c22] border-[#064e3b]';
      default: return 'text-[#172554] border-[#1e3a8a]';
    }
  };

  // Paper styling
  const getPaperBgStyle = () => {
    if (paperType === 'grid-math') {
      return {
        backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.15) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        backgroundColor: '#fafaf9',
        color: '#18181b',
      };
    }
    if (paperType === 'vintage-parchment') {
      return {
        backgroundImage: 'linear-gradient(rgba(180, 83, 9, 0.18) 1px, transparent 1px)',
        backgroundSize: '100% 32px',
        backgroundPosition: '0 12px',
        backgroundColor: '#fef3c7',
        color: '#18181b',
      };
    }
    if (paperType === 'clean-ivory') {
      return {
        backgroundColor: '#fffbeb',
        color: '#18181b',
      };
    }
    if (paperType === 'chalkboard-dark') {
      return {
        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        backgroundColor: '#182026',
        color: '#f8fafc',
      };
    }
    if (paperType === 'legal-pad') {
      return {
        backgroundImage: 'linear-gradient(rgba(202, 138, 4, 0.22) 1px, transparent 1px)',
        backgroundSize: '100% 32px',
        backgroundPosition: '0 12px',
        backgroundColor: '#fef9c3',
        color: '#18181b',
      };
    }
    // Default: ruled notebook with blue lines
    return {
      backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.22) 1px, transparent 1px)',
      backgroundSize: '100% 32px',
      backgroundPosition: '0 12px',
      backgroundColor: '#fbf9f2',
      color: '#18181b',
    };
  };

  // Multi-page page partitioning
  const activeNote = (note || {}) as NoteContentPayload;
  const totalSections = note ? note.sections.length : 0;
  const leftPageSections = note ? note.sections.slice(0, Math.ceil(totalSections / 2)) : [];
  const rightPageSections = note ? note.sections.slice(Math.ceil(totalSections / 2)) : [];

  // Determine topic category for rich authentic SVG diagrams
  const combinedTopicStr = note ? (note.topic + ' ' + note.title + ' ' + note.chapter + ' ' + note.subject).toLowerCase() : '';
  const isPhotosynthesis = /photosynthesis|chloroplast|light reaction|life processes|leaf/i.test(combinedTopicStr);
  const isQuadratic = /quadratic|parabola|discriminant|ax\^2|roots/i.test(combinedTopicStr);
  const isMechanics = /motion|force|friction|circular|newton|momentum|impulse|incline/i.test(combinedTopicStr);
  const isElectricCharges = /electric charge|coulomb|gauss|field lines|electrostatic|dipole/i.test(combinedTopicStr);
  const isCellBiology = /cell|organelle|membrane|mitochondria|prokaryot|eukaryot|fundamental unit/i.test(combinedTopicStr);
  const isChemicalBonding = /bonding|vsepr|hybridis|orbital|covalent|ionic|dipole moment/i.test(combinedTopicStr);
  const isChemicalReactions = /chemical reaction|equation|combination|decomposition|redox|displacement/i.test(combinedTopicStr);

  const handlePrint = () => {
    if (!note) return;
    const originalTitle = document.title;
    document.title = `${note.classGrade} - ${note.chapter} - Buzzing Brain Notes`;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1500);
  };

  // Direct A4 Landscape Browser Print & PDF Exporter
  const handleDownloadPdf = () => {
    if (!note) return;
    const originalTitle = document.title;
    document.title = `${note.classGrade}_${note.subject}_${note.chapter}_TopperNotes_BuzzingBrain`.replace(/[^a-zA-Z0-9_-]/g, '_');
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1500);
  };

  const handleCopyShare = () => {
    if (!note) return;
    const shareText = `NCERT Handwritten Study Notes: ${note.title}\nClass: ${note.classGrade} | Subject: ${note.subject} | Chapter: ${note.chapter}\nGenerated on Buzzing Brain — Free Education for All.`;
    navigator.clipboard.writeText(shareText);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Render a specific section with realistic handwritten annotations
  const renderSectionBlock = (section: NoteSection, globalIdx: number) => {
    const isDark = paperType === 'chalkboard-dark';

    return (
      <div key={globalIdx} className="space-y-3 relative group">
        {/* Section Heading & Number */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2.5">
            <span className={`w-7 h-7 rounded-full border-2 border-current flex items-center justify-center shrink-0 font-bold text-sm sm:text-base mt-0.5 shadow-2xs ${
              isDark ? 'bg-slate-800 text-amber-300' : 'bg-white/90'
            }`}>
              {globalIdx + 1}
            </span>
            <div>
              <span className={`font-bold px-2.5 py-0.5 rounded-md inline-block text-lg sm:text-xl underline decoration-wavy shadow-2xs ${
                isDark 
                  ? 'bg-amber-400/20 text-amber-200 decoration-amber-400/60' 
                  : 'bg-amber-200/80 text-amber-950 decoration-amber-500/70'
              }`}>
                {section.heading}
              </span>
              {section.subheading && (
                <span className={`block text-xs sm:text-sm font-sans font-semibold italic mt-0.5 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  {section.subheading}
                </span>
              )}
            </div>
          </div>

          {/* Regenerate Section Quick Button */}
          {onRegenerateSection && (
            <button
              onClick={() => onRegenerateSection(globalIdx)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg bg-black/10 hover:bg-black/20 text-slate-700 text-xs flex items-center gap-1 cursor-pointer print:hidden"
              title="Regenerate this section"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Blue Pen Main Explanation Content with Natural Margins */}
        <div className={`p-3.5 border rounded-2xl relative shadow-2xs ${
          isDark 
            ? 'bg-slate-800/80 border-slate-700 text-slate-100' 
            : 'bg-blue-50/70 border-blue-300/80'
        }`}>
          <p className="text-lg sm:text-xl font-medium leading-relaxed">
            {section.content}
          </p>
        </div>

        {/* Bullet Points with Hand-drawn markers */}
        {section.bullets && section.bullets.length > 0 && (
          <ul className="space-y-1.5 pl-3 text-base sm:text-lg leading-snug">
            {section.bullets.map((b, bIdx) => (
              <li key={bIdx} className="flex items-start gap-2">
                <span className="text-pink-600 font-bold select-none text-xl leading-none">&bull;</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Formula Blocks with Boxed Notation & Worked Numerical */}
        {section.formulaBlocks && section.formulaBlocks.length > 0 && (
          <div className="space-y-3 my-2">
            {section.formulaBlocks.map((fb, fbIdx) => (
              <div 
                key={fbIdx} 
                className={`p-3.5 border-2 rounded-2xl shadow-xs space-y-2.5 ${
                  isDark 
                    ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-200' 
                    : 'bg-emerald-50/80 border-emerald-500'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-sans font-bold text-emerald-800 uppercase tracking-wide">
                  <span className={isDark ? 'text-emerald-300' : 'text-emerald-900'}>🟢 Formula Box: {fb.title}</span>
                  <span className={`px-2 py-0.5 rounded ${isDark ? 'bg-emerald-800/60 text-emerald-100' : 'bg-emerald-200/80 text-emerald-950'}`}>
                    NCERT Result
                  </span>
                </div>

                <div className={`p-2.5 border-2 border-dashed rounded-xl text-center overflow-x-auto ${
                  isDark ? 'bg-slate-900/90 border-emerald-400' : 'bg-white/95 border-emerald-400'
                }`}>
                  <MathFormulaRenderer
                    formula={fb.formula}
                    displayMode={true}
                    className={`text-lg sm:text-xl font-bold inline-block px-3 py-1 rounded-lg ${
                      isDark ? 'text-emerald-300 bg-emerald-950/60' : 'text-emerald-950 bg-emerald-100/60'
                    }`}
                  />
                </div>

                {fb.variables && fb.variables.length > 0 && (
                  <div className="text-xs font-sans flex flex-wrap gap-x-3 gap-y-1 pt-1">
                    {fb.variables.map((v, vIdx) => (
                      <span key={vIdx} className={`font-mono px-1.5 py-0.5 rounded ${
                        isDark ? 'bg-emerald-900/40 text-emerald-300' : 'bg-emerald-100/60 text-emerald-900'
                      }`}>
                        {v}
                      </span>
                    ))}
                  </div>
                )}

                {/* Boxed Worked Example Problem */}
                {fb.exampleProblem && (
                  <div className={`mt-2 pt-2 border-t text-xs sm:text-sm font-sans space-y-2 ${
                    isDark ? 'border-emerald-800/80' : 'border-emerald-200/80'
                  }`}>
                    <span className={`font-bold block ${isDark ? 'text-emerald-300' : 'text-emerald-950'}`}>
                      📝 CBSE Solved Numerical Example:
                    </span>
                    <p className={`italic ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                      Q: {fb.exampleProblem.statement}
                    </p>
                    <div className="space-y-1 pl-2 border-l-2 border-emerald-400">
                      {fb.exampleProblem.steps.map((st, sIdx) => (
                        <div key={sIdx} className={`font-mono text-[11px] sm:text-xs ${
                          isDark ? 'text-slate-200' : 'text-slate-900'
                        }`}>
                          {st}
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 text-right">
                      <span className="inline-block px-3 py-1 bg-emerald-200 text-emerald-950 font-mono font-black text-xs sm:text-sm border-2 border-emerald-600 rounded-lg shadow-2xs">
                        Boxed Answer: {fb.exampleProblem.boxedAnswer} {fb.exampleProblem.units}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Standard Important Formulas Array if formulaBlocks not present */}
        {(!section.formulaBlocks || section.formulaBlocks.length === 0) && section.importantFormulas && section.importantFormulas.length > 0 && (
          <div className={`p-3.5 border-2 border-dashed rounded-xl my-2 ${
            isDark ? 'bg-emerald-950/30 border-emerald-500' : 'bg-emerald-50/70 border-emerald-500'
          }`}>
            <span className={`text-xs font-bold font-sans block mb-1 uppercase tracking-wider ${
              isDark ? 'text-emerald-300' : 'text-emerald-900'
            }`}>
              🟢 Governing Formulas &bull; NCERT Equations
            </span>
            <div className="space-y-1.5 font-mono text-base font-bold">
              {section.importantFormulas.map((f, fIdx) => (
                <div key={fIdx} className={`p-2 rounded-md border overflow-x-auto ${
                  isDark ? 'bg-slate-900/80 border-emerald-800 text-emerald-200' : 'bg-white/80 border-emerald-200 text-emerald-950'
                }`}>
                  <MathFormulaRenderer formula={f} displayMode={false} />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    );
  };

  // Scientific Diagrams & Visuals renderer
  const renderDiagramsSection = () => {
    return (
      <div className="space-y-4 pt-1">
        <div className="flex items-center justify-between border-b border-slate-300 pb-1 text-xs font-sans font-bold text-slate-700 uppercase tracking-wider">
          <span>🎨 Hand-Drawn Exam Diagrams &amp; Apparatus</span>
          <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-800 font-mono">Reproducible in CBSE Board Exams</span>
        </div>

        {/* 1. Photosynthesis & Cellular Energy Diagram */}
        {isPhotosynthesis && (
          <div className="p-3 bg-emerald-50/90 border-2 border-emerald-400 rounded-2xl shadow-sm space-y-2 font-sans">
            <div className="text-center">
              <h4 className="font-extrabold text-sm sm:text-base text-emerald-950">
                Leaf Anatomy &amp; Chloroplast (Photosynthesis Apparatus)
              </h4>
              <p className="text-xs text-emerald-800 italic">
                Cross-section schematic with cuticle, palisade mesophyll, guard cells &amp; stomatal pore
              </p>
            </div>

            {/* SVG Visual of Leaf & Stomata */}
            <div className="flex justify-center py-1">
              <svg viewBox="0 0 460 170" className="w-full max-w-md h-auto bg-white/95 rounded-xl border border-emerald-300 shadow-2xs">
                {/* Upper Cuticle & Epidermis */}
                <rect x="20" y="20" width="420" height="20" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" />
                <text x="230" y="34" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#166534">Upper Cuticle &amp; Epidermis</text>

                {/* Palisade Mesophyll with Chloroplasts */}
                <rect x="20" y="45" width="420" height="50" fill="#bbf7d0" stroke="#15803d" strokeWidth="1.5" />
                <text x="230" y="70" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#14532d">Palisade Mesophyll (Dense Chloroplasts: Light Absorption)</text>
                <circle cx="60" cy="80" r="4" fill="#16a34a" />
                <circle cx="120" cy="80" r="4" fill="#16a34a" />
                <circle cx="200" cy="80" r="4" fill="#16a34a" />
                <circle cx="300" cy="80" r="4" fill="#16a34a" />
                <circle cx="390" cy="80" r="4" fill="#16a34a" />

                {/* Spongy Mesophyll with Air Cavities */}
                <rect x="20" y="100" width="420" height="35" fill="#f0fdf4" stroke="#86efac" strokeWidth="1.5" />
                <text x="230" y="120" fontSize="10" textAnchor="middle" fill="#166534">Spongy Parenchyma &amp; Intercellular Air Spaces</text>

                {/* Stomata with Guard Cells at bottom */}
                <rect x="20" y="140" width="160" height="18" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" />
                <ellipse cx="205" cy="149" rx="14" ry="8" fill="#4ade80" stroke="#15803d" strokeWidth="1.5" />
                <ellipse cx="245" cy="149" rx="14" ry="8" fill="#4ade80" stroke="#15803d" strokeWidth="1.5" />
                <rect x="270" y="140" width="170" height="18" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" />

                <path d="M 225,168 L 225,155" stroke="#b91c1c" strokeWidth="1.5" />
                <text x="225" y="168" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#b91c1c">Stomatal Pore (CO₂ in, O₂ out)</text>
              </svg>
            </div>

            {/* Word Equation & Balanced Chemical Equation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2 bg-white/90 rounded-xl border border-emerald-300">
                <span className="font-bold text-emerald-950 block">Word Equation:</span>
                <p className="font-mono text-emerald-900 mt-0.5">
                  CO₂ + H₂O &minus;&minus;(Light/Chlorophyll)&minus;&minus;&rarr; Glucose + O₂ + H₂O
                </p>
              </div>

              <div className="p-2 bg-white/90 rounded-xl border border-emerald-300">
                <span className="font-bold text-emerald-950 block">Balanced Chemical Equation:</span>
                <p className="font-mono text-emerald-900 font-bold mt-0.5">
                  6CO₂ + 12H₂O &rarr; C₆H₁₂O₆ + 6O₂ + 6H₂O
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 2. Mechanics / Laws of Motion / Friction Diagram (Physics) */}
        {isMechanics && (
          <div className="p-3 bg-blue-50/90 border-2 border-blue-400 rounded-2xl shadow-sm space-y-2 font-sans">
            <div className="text-center">
              <h4 className="font-extrabold text-sm sm:text-base text-blue-950">
                Free Body Diagram (FBD) on Inclined Plane &amp; Banked Road Dynamics
              </h4>
              <p className="text-xs text-blue-800 italic">
                Resolution of weight components (mg sin θ, mg cos θ) and normal reaction N
              </p>
            </div>

            {/* SVG Free Body Diagram on Incline */}
            <div className="flex justify-center py-1">
              <svg viewBox="0 0 440 160" className="w-full max-w-md h-auto bg-white/95 rounded-xl border border-blue-300 shadow-2xs">
                <line x1="30" y1="140" x2="410" y2="140" stroke="#64748b" strokeWidth="1.5" />
                <polygon points="50,140 350,140 350,40" fill="#f1f5f9" stroke="#3b82f6" strokeWidth="2" />
                <text x="110" y="135" fontSize="11" fontWeight="bold" fill="#2563eb">θ</text>

                <g transform="translate(180, 80) rotate(-20)">
                  <rect x="-25" y="-20" width="50" height="40" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" rx="4" />
                  <text x="0" y="4" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#854d0e">m</text>
                  
                  <line x1="0" y1="-20" x2="0" y2="-60" stroke="#16a34a" strokeWidth="2.5" />
                  <text x="10" y="-50" fontSize="10" fontWeight="bold" fill="#16a34a">N = mg cos θ</text>

                  <line x1="-25" y1="20" x2="-65" y2="20" stroke="#dc2626" strokeWidth="2.5" />
                  <text x="-80" y="15" fontSize="10" fontWeight="bold" fill="#dc2626">f_s ≤ μN</text>

                  <line x1="25" y1="20" x2="70" y2="20" stroke="#7c3aed" strokeWidth="2.5" />
                  <text x="75" y="24" fontSize="10" fontWeight="bold" fill="#7c3aed">mg sin θ</text>
                </g>

                <line x1="180" y1="90" x2="180" y2="145" stroke="#b91c1c" strokeWidth="2.5" strokeDasharray="3 3" />
                <circle cx="180" cy="90" r="4" fill="#b91c1c" />
                <text x="190" y="135" fontSize="11" fontWeight="bold" fill="#b91c1c">W = mg</text>
              </svg>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2 bg-white/90 rounded-xl border border-blue-300">
                <span className="font-bold text-blue-950 block">Incline Equilibrium:</span>
                <p className="font-mono text-blue-900 mt-0.5">
                  N = m·g·cos θ | f_max = μ_s · m·g·cos θ
                </p>
              </div>

              <div className="p-2 bg-white/90 rounded-xl border border-blue-300">
                <span className="font-bold text-blue-950 block">Banked Curved Road:</span>
                <p className="font-mono text-blue-900 font-bold mt-0.5">
                  v₀ = √(r · g · tan θ) &nbsp;[Optimum Safe Speed]
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 3. Quadratic Equations Diagram (Mathematics) */}
        {isQuadratic && (
          <div className="p-3 bg-amber-50/90 border-2 border-amber-400 rounded-2xl shadow-sm space-y-2 font-sans">
            <div className="text-center">
              <h4 className="font-extrabold text-sm sm:text-base text-amber-950">
                Parabola Curve &amp; Nature of Roots (Discriminant D = b² - 4ac)
              </h4>
            </div>

            <div className="flex justify-center py-1">
              <svg viewBox="0 0 420 150" className="w-full max-w-md h-auto bg-white/95 rounded-xl border border-amber-300 shadow-2xs">
                <line x1="30" y1="110" x2="390" y2="110" stroke="#64748b" strokeWidth="1.5" />
                <line x1="120" y1="20" x2="120" y2="140" stroke="#64748b" strokeWidth="1.5" />
                <text x="385" y="105" fontSize="10" fill="#64748b">X</text>
                <text x="125" y="30" fontSize="10" fill="#64748b">Y</text>

                <path d="M 60,30 Q 180,170 300,30" fill="none" stroke="#2563eb" strokeWidth="2.5" />
                <circle cx="108" cy="110" r="4" fill="#dc2626" />
                <circle cx="252" cy="110" r="4" fill="#dc2626" />
                <text x="108" y="125" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#dc2626">Root α</text>
                <text x="252" y="125" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#dc2626">Root β</text>

                <circle cx="180" cy="135" r="3" fill="#7c3aed" />
                <text x="180" y="146" fontSize="9" textAnchor="middle" fill="#7c3aed">Vertex: (-b/2a, -D/4a)</text>
              </svg>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs pt-1">
              <div className="p-1.5 bg-emerald-100/70 border border-emerald-300 rounded-lg text-center font-mono">
                <strong className="block text-emerald-950">D &gt; 0</strong>
                <span className="text-[10px] text-emerald-900">2 Real Roots</span>
              </div>
              <div className="p-1.5 bg-blue-100/70 border border-blue-300 rounded-lg text-center font-mono">
                <strong className="block text-blue-950">D = 0</strong>
                <span className="text-[10px] text-blue-900">Equal Roots</span>
              </div>
              <div className="p-1.5 bg-rose-100/70 border border-rose-300 rounded-lg text-center font-mono">
                <strong className="block text-rose-950">D &lt; 0</strong>
                <span className="text-[10px] text-rose-900">Imaginary</span>
              </div>
            </div>
          </div>
        )}

        {/* 4. Chemical Reactions & Molecular Bonding Diagram (Chemistry) */}
        {(isChemicalReactions || isChemicalBonding) && (
          <div className="p-3 bg-purple-50/90 border-2 border-purple-400 rounded-2xl shadow-sm space-y-2 font-sans">
            <div className="text-center">
              <h4 className="font-extrabold text-sm sm:text-base text-purple-950">
                Reaction Apparatus &amp; VSEPR Molecular Geometry
              </h4>
            </div>

            <div className="flex justify-center py-1">
              <svg viewBox="0 0 420 140" className="w-full max-w-md h-auto bg-white/95 rounded-xl border border-purple-300 shadow-2xs">
                <rect x="180" y="95" width="40" height="35" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
                <polygon points="190,95 210,95 200,65" fill="#f97316" opacity="0.9" />
                <polygon points="195,95 205,95 200,75" fill="#38bdf8" />

                <g transform="translate(190, 25) rotate(25)">
                  <rect x="0" y="0" width="18" height="65" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" rx="8" />
                  <rect x="2" y="40" width="14" height="20" fill="#84cc16" opacity="0.7" />
                </g>

                <text x="285" y="45" fontSize="10" fontWeight="bold" fill="#7e22ce">2FeSO₄(s) &rarr; Fe₂O₃(s)</text>
                <text x="285" y="60" fontSize="10" fontWeight="bold" fill="#7e22ce">+ SO₂(g)&uarr; + SO₃(g)&uarr;</text>
                <text x="285" y="78" fontSize="9" fill="#6b21a8">(Thermal Decomposition)</text>
              </svg>
            </div>
          </div>
        )}

        {/* 5. Cell Biology Diagram (Class 9) */}
        {isCellBiology && (
          <div className="p-3 bg-teal-50/90 border-2 border-teal-400 rounded-2xl shadow-sm space-y-2 font-sans">
            <div className="text-center">
              <h4 className="font-extrabold text-sm sm:text-base text-teal-950">
                Plant Cell vs. Animal Cell Structural Organization
              </h4>
            </div>

            <div className="flex justify-center py-1">
              <svg viewBox="0 0 440 140" className="w-full max-w-md h-auto bg-white/95 rounded-xl border border-teal-300 shadow-2xs">
                <rect x="25" y="15" width="170" height="110" rx="10" fill="#ecfdf5" stroke="#059669" strokeWidth="2.5" />
                <ellipse cx="110" cy="70" rx="45" ry="28" fill="#bfdbfe" stroke="#60a5fa" strokeWidth="1.5" />
                <text x="110" y="74" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#1e40af">Central Vacuole</text>
                <text x="110" y="118" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#047857">PLANT CELL (Cell Wall)</text>

                <ellipse cx="320" cy="70" rx="80" ry="50" fill="#fef2f2" stroke="#ef4444" strokeWidth="2" strokeDasharray="2 1" />
                <circle cx="320" cy="70" r="16" fill="#fbcfe8" stroke="#db2777" strokeWidth="1.5" />
                <text x="320" y="73" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#9d174d">Nucleus</text>
                <text x="320" y="118" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#b91c1c">ANIMAL CELL (No Wall)</text>
              </svg>
            </div>
          </div>
        )}

        {/* 6. Electric Charges & Fields (Class 12 Physics) */}
        {isElectricCharges && (
          <div className="p-3 bg-sky-50/90 border-2 border-sky-400 rounded-2xl shadow-sm space-y-2 font-sans">
            <div className="text-center">
              <h4 className="font-extrabold text-sm sm:text-base text-sky-950">
                Electric Dipole Field Lines &amp; Coulomb's Law Force Vectors
              </h4>
            </div>

            <div className="flex justify-center py-1">
              <svg viewBox="0 0 420 140" className="w-full max-w-md h-auto bg-white/95 rounded-xl border border-sky-300 shadow-2xs">
                <circle cx="120" cy="70" r="14" fill="#fecaca" stroke="#dc2626" strokeWidth="2" />
                <text x="120" y="75" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#991b1b">+</text>

                <circle cx="300" cy="70" r="14" fill="#bfdbfe" stroke="#2563eb" strokeWidth="2" />
                <text x="300" y="75" fontSize="16" fontWeight="bold" textAnchor="middle" fill="#1e40af">&minus;</text>

                <line x1="134" y1="70" x2="286" y2="70" stroke="#0284c7" strokeWidth="2" />
                <path d="M 120,56 C 150,15 270,15 300,56" fill="none" stroke="#0284c7" strokeWidth="1.8" />
                <path d="M 120,84 C 150,125 270,125 300,84" fill="none" stroke="#0284c7" strokeWidth="1.8" />
              </svg>
            </div>

            <div className="p-2 bg-white/90 rounded-xl border border-sky-300 text-center font-mono text-xs">
              <span className="font-bold text-sky-950">Coulomb's Law: </span>
              <span className="font-bold text-sky-900">F = (1 / 4πε₀) &middot; (|q₁ &middot; q₂| / r²)</span>
            </div>
          </div>
        )}

        {/* General Flowchart or ASCII Sketch if present in note */}
        {activeNote.sections?.map((s, idx) => {
          if (!s.diagram) return null;
          return (
            <div key={idx} className="p-3 bg-white/90 border-2 border-slate-300 rounded-2xl shadow-xs space-y-1.5 font-sans">
              <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>{s.diagram.title}</span>
                <span className="text-[10px] text-slate-500 font-mono">{s.diagram.type}</span>
              </div>
              {s.diagram.caption && (
                <p className="text-xs text-slate-600 italic">{s.diagram.caption}</p>
              )}
              {s.diagram.asciiSketch && (
                <pre className="p-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-mono text-[10px] overflow-x-auto">
                  {s.diagram.asciiSketch}
                </pre>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Exam tips & summary review renderer
  const renderExamTipsSection = () => {
    return (
      <div className="space-y-3.5 pt-1">
        {/* Board Alert */}
        {activeNote.ncertExamAlert && (
          <div className="p-3 bg-rose-50/90 border-2 border-rose-400 rounded-2xl shadow-xs">
            <div className="text-xs font-bold text-rose-900 font-sans uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>NCERT Board Exam Evaluation Alert</span>
            </div>
            <p className="text-xs sm:text-sm text-rose-950 leading-snug font-sans font-medium">
              {activeNote.ncertExamAlert}
            </p>
          </div>
        )}

        {/* Quick Summary Review */}
        {activeNote.quickSummaryReview && activeNote.quickSummaryReview.length > 0 && (
          <div className="p-3 bg-amber-50/80 border-2 border-amber-300 rounded-2xl space-y-1.5 font-sans">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Quick Revision &bull; One-Shot High-Yield Points</span>
            </div>
            <ul className="space-y-1 text-xs sm:text-sm text-amber-950 pl-3">
              {activeNote.quickSummaryReview.map((rev, rIdx) => (
                <li key={rIdx} className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">&bull;</span>
                  <span>{rev}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sample Exam Question with Step-by-Step Answer */}
        {activeNote.sampleQuestion && (
          <div className="p-3 bg-purple-50/80 border-2 border-purple-300 rounded-2xl space-y-1.5 font-sans">
            <div className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center justify-between">
              <span>Representative CBSE Board Question</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-200">5-Mark Long Answer</span>
            </div>
            <div className="p-2 bg-white/90 rounded-xl border border-purple-200 text-xs font-semibold text-purple-950">
              Q: {activeNote.sampleQuestion.question}
            </div>
            <div className="text-xs text-slate-900 whitespace-pre-line leading-relaxed pl-2.5 border-l-2 border-purple-400">
              {activeNote.sampleQuestion.answer}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Indian Student Register Top Header Strip
  const renderRegisterHeader = (pageNumStr: string) => {
    return (
      <div className="flex items-center justify-between border-b-2 border-red-400/60 pb-1.5 mb-2.5 text-xs font-sans font-bold">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="px-2 py-0.5 bg-red-100 border border-red-300 text-red-900 rounded font-mono text-[11px]">
            PAGE {pageNumStr}
          </div>
          <div className="text-slate-600 font-mono text-[11px] hidden sm:block">
            DATE: <span className="underline decoration-dotted text-slate-900">
              {activeNote.sourceCitation?.verifiedDate 
                ? activeNote.sourceCitation.verifiedDate.split('-').reverse().join(' / ') 
                : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, ' / ')}
            </span>
          </div>
          <div className="text-slate-600 text-[11px] hidden md:block">
            SUBJECT: <span className="text-slate-900 font-semibold">{activeNote.subject}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeNote.verificationStatus === 'VERIFIED_CURRICULUM' ? (
            <div className="px-2.5 py-0.5 border border-emerald-600 text-emerald-800 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-50 shadow-2xs flex items-center gap-1">
              <span>✓</span> NCERT CURRICULUM VERIFIED
            </div>
          ) : activeNote.verificationStatus === 'CURATED_FACULTY' ? (
            <div className="px-2.5 py-0.5 border border-blue-600 text-blue-800 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-blue-50 shadow-2xs flex items-center gap-1">
              <span>✓</span> FACULTY REVIEWED
            </div>
          ) : (
            <div className="px-2.5 py-0.5 border border-amber-600 text-amber-800 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-amber-50 shadow-2xs flex items-center gap-1">
              <span>✎</span> SYLLABUS OUTLINE (AI ASSISTED)
            </div>
          )}
        </div>
      </div>
    );
  };

  // Page 1: Core Foundations & Definitions
  const renderPageOne = () => (
    <div className="relative pr-0 md:pr-3 min-h-[750px] flex flex-col justify-between">
      <div className="absolute left-6 top-0 bottom-0 w-1 border-r-2 border-double border-red-400/60 pointer-events-none" />

      <div className="pl-9 space-y-3.5">
        {renderRegisterHeader('01')}

        {activeNote.sourceCitation && (
          <div className="flex flex-wrap items-center justify-between text-[11px] font-sans px-2.5 py-1 bg-amber-50/90 border border-amber-300 rounded-lg text-amber-950">
            <span><strong>Prescribed Source:</strong> {activeNote.sourceCitation.textbook} ({activeNote.sourceCitation.edition})</span>
            <span>{activeNote.sourceCitation.isbn ? `ISBN: ${activeNote.sourceCitation.isbn}` : `Ch. ${activeNote.sourceCitation.chapterNumber}`}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-0.5 pb-0.5 text-base sm:text-lg font-bold">
          <div className="inline-block px-3 py-0.5 rounded-lg bg-emerald-100/90 text-emerald-900 border-2 border-emerald-400 shadow-2xs rotate-[-1deg]">
            {activeNote.classGrade} {activeNote.subject}
          </div>

          <div className="inline-block px-4 py-0.5 rounded-lg bg-pink-100/90 text-pink-900 border-2 border-pink-400 shadow-2xs rotate-[1deg]">
            {activeNote.chapter?.length > 24 ? activeNote.chapter.slice(0, 22) + '...' : activeNote.chapter}
          </div>
        </div>

        <div className="text-center my-1.5">
          <div className="inline-block px-5 py-1.5 rounded-2xl bg-rose-50/90 border-2 border-rose-400 shadow-md">
            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${getHeadingInkClass(currentInk)}`}>
              {activeNote.title}
            </h1>
          </div>
        </div>

        <div className="space-y-3.5 text-lg sm:text-xl leading-relaxed">
          {leftPageSections.map((section, idx) => renderSectionBlock(section, idx))}
        </div>
      </div>

      <div className="pl-9 pt-3 flex items-center justify-between text-xs text-slate-500 font-sans border-t border-slate-300 mt-4">
        <span className="font-bold text-slate-700">Page 01 &bull; Core Foundations</span>
        <span className="font-mono">Buzzing Brain &bull; Free Education for All</span>
      </div>
    </div>
  );

  // Page 2: Derivations, Equations & Special Cases
  const renderPageTwo = () => (
    <div className="relative pl-0 md:pl-3 min-h-[750px] flex flex-col justify-between">
      <div className="absolute left-6 top-0 bottom-0 w-1 border-r-2 border-double border-red-400/60 pointer-events-none" />

      <div className="pl-9 space-y-3.5">
        {renderRegisterHeader('02')}

        <div className="flex items-center justify-between pt-0.5 pb-0.5 text-xs sm:text-sm font-sans font-semibold text-slate-600">
          <div className="flex items-center gap-1 border-b border-dashed border-slate-400 pb-0.5">
            <span>Unit:</span>
            <span className="font-mono text-slate-900">{activeNote.syllabusContext}</span>
          </div>
          <div className="flex items-center gap-1 border-b border-dashed border-slate-400 pb-0.5">
            <span>Weightage:</span>
            <span className="font-mono text-emerald-800 font-bold">High-Yield Board Topic</span>
          </div>
        </div>

        <div className="space-y-3.5 text-lg sm:text-xl leading-relaxed">
          {rightPageSections.map((section, idx) => 
            renderSectionBlock(section, leftPageSections.length + idx)
          )}
        </div>
      </div>

      <div className="pl-9 pt-3 flex items-center justify-between text-xs text-slate-500 font-sans border-t border-slate-300 mt-4">
        <span className="font-bold text-slate-700">Page 02 &bull; Equations &amp; Derivations</span>
        <span className="font-mono">YouTube: @BrainBuzz2702</span>
      </div>
    </div>
  );

  // Page 3: Hand-Drawn Diagrams & Apparatus
  const renderPageThree = () => (
    <div className="relative pr-0 md:pr-3 min-h-[750px] flex flex-col justify-between">
      <div className="absolute left-6 top-0 bottom-0 w-1 border-r-2 border-double border-red-400/60 pointer-events-none" />

      <div className="pl-9 space-y-3.5">
        {renderRegisterHeader('03')}

        <div className="flex items-center justify-between pt-0.5 pb-0.5 text-xs sm:text-sm font-sans font-semibold text-slate-600">
          <div className="font-bold text-emerald-900">
            Scientific Diagram Apparatus &bull; NCERT Standard
          </div>
          <div className="font-mono text-slate-700 font-bold">Section C/D Board Diagrams</div>
        </div>

        {renderDiagramsSection()}
      </div>

      <div className="pl-9 pt-3 flex items-center justify-between text-xs text-slate-500 font-sans border-t border-slate-300 mt-4">
        <span className="font-bold text-slate-700">Page 03 &bull; Labeled Examination Diagrams</span>
        <span className="font-mono">Buzzing Brain</span>
      </div>
    </div>
  );

  // Page 4: Conceptual In-Depth Description Continuation
  const renderPageFour = () => (
    <div className="relative pl-0 md:pl-3 min-h-[750px] flex flex-col justify-between">
      <div className="absolute left-6 top-0 bottom-0 w-1 border-r-2 border-double border-red-400/60 pointer-events-none" />

      <div className="pl-9 space-y-3.5">
        {renderRegisterHeader('04')}

        <div className="flex items-center justify-between pt-0.5 pb-0.5 text-xs sm:text-sm font-sans font-semibold text-slate-600">
          <div className="font-bold text-slate-900">
            Topic Overview &bull; Detailed Conceptual Description
          </div>
          <div className="font-mono text-slate-800 font-bold">{activeNote.topic || activeNote.chapter}</div>
        </div>

        <div className="space-y-3.5 text-lg sm:text-xl leading-relaxed">
          {rightPageSections.slice(1).length > 0 ? (
            rightPageSections.slice(1).map((section, idx) => renderSectionBlock(section, leftPageSections.length + 1 + idx))
          ) : (
            <div className="p-4 border rounded-2xl bg-blue-50/70 border-blue-300/80 shadow-2xs space-y-2">
              <h3 className="font-bold text-xl text-blue-950">Topic Mastery &bull; {activeNote.topic || activeNote.title}</h3>
              <p className="text-lg font-medium text-slate-900 leading-relaxed">
                {activeNote.sections[0]?.content || 'Comprehensive topic explanation and description covering core definitions, fundamental laws, and syllabus objectives.'}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="pl-9 pt-3 flex items-center justify-between text-xs text-slate-500 font-sans border-t border-slate-300 mt-4">
        <span className="font-bold text-slate-700">Page 04 &bull; Topic Description</span>
        <span className="font-mono">Buzzing Brain</span>
      </div>
    </div>
  );

  // Realistic Skeleton Loader & Synthesizing Animation Spread
  const renderSkeletonSpread = () => {
    const isDark = paperType === 'chalkboard-dark';
    const activeStageInfo = SYNTH_STAGES[synthStage % SYNTH_STAGES.length];
    const activeTip = BOARD_STUDY_TIPS[synthStage % BOARD_STUDY_TIPS.length];

    return (
      <div className="w-full max-w-6xl mx-auto my-6 space-y-5 animate-in fade-in duration-300">
        {/* 1. Quick Chapter Switcher Pill Row */}
        {onSelectSampleChapter && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none print:hidden opacity-80">
            <div className="flex items-center gap-1.5 shrink-0 px-2.5 py-1 text-xs font-bold text-amber-400">
              <BookMarked className="w-3.5 h-3.5" />
              <span>Quick Topper Notes:</span>
            </div>
            {SAMPLE_CHAPTERS.map((sc) => (
              <button
                key={sc.key}
                onClick={() => onSelectSampleChapter(sc.key)}
                className="shrink-0 px-3 py-1 rounded-xl bg-white/5 hover:bg-amber-400/20 text-slate-300 hover:text-amber-200 border border-white/10 hover:border-amber-400/40 text-xs font-medium transition-all cursor-pointer whitespace-nowrap active:scale-95"
              >
                {sc.label}
              </button>
            ))}
          </div>
        )}

        {/* 2. Top Synthesizing Control Toolbar */}
        <div className="astra-card border border-amber-400/30 rounded-2xl p-3 sm:p-4 shadow-xl flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-300 font-bold text-xs shadow-xs">
              <Loader2 className="w-4 h-4 animate-spin text-amber-400 shrink-0" />
              <span>Synthesizing Handwritten Notes...</span>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-mono text-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>CBSE 2026–27 Engine</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-mono text-xs">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Elapsed: {String(Math.floor(elapsedSeconds / 60)).padStart(2, '0')}:{String(elapsedSeconds % 60).padStart(2, '0')}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-xs font-medium hidden md:block">
              Two-Page Register Spread
            </div>
          </div>
        </div>

        {/* 3. Hero 'Synthesizing...' Realtime Stage HUD */}
        <div className="astra-card rounded-2xl p-4 sm:p-5 border-2 border-amber-400/40 bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-amber-950/20 shadow-2xl relative overflow-hidden">
          {/* Subtle top light bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400 animate-pulse" />

          <div className="space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md shrink-0">
                  <PenTool className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      {activeStageInfo.badge}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {synthesizingStep || activeStageInfo.step}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-2 mt-0.5">
                    <span>{loadingMessage || activeStageInfo.title}</span>
                  </h3>
                </div>
              </div>

              {/* Progress counter pill */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <div className="px-3 py-1 rounded-xl bg-black/40 border border-white/10 font-mono text-xs sm:text-sm font-bold text-amber-300">
                  {synthProgress}% Synthesized
                </div>
              </div>
            </div>

            {/* Dynamic Stage Detail */}
            <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed pl-1 sm:pl-11">
              {activeStageInfo.detail}
            </p>

            {/* Shimmering Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="h-2.5 w-full bg-slate-800/90 rounded-full overflow-hidden border border-white/10 p-0.5 relative">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 transition-all duration-500 ease-out animate-shimmer"
                  style={{ width: `${synthProgress}%` }}
                />
              </div>
            </div>

            {/* Rotating NCERT / CBSE Exam Tip Box */}
            <div className="pt-2 border-t border-white/10 flex items-start gap-2 text-xs sm:text-sm text-amber-200/90 font-medium">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span className="transition-opacity duration-300">{activeTip}</span>
            </div>
          </div>
        </div>

        {/* 4. Realistic 2-Page Open Register Skeleton Notebook */}
        <div 
          className="w-full flex flex-col items-center overflow-x-auto pb-6 print:hidden"
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
        >
          <div
            ref={noteRef}
            style={{
              fontFamily: `"${currentFont}", cursive, sans-serif`,
            }}
            className={`w-full max-w-[1100px] min-h-[950px] rounded-3xl shadow-2xl border-4 border-[#e5dec9] relative p-4 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 ${getInkColorClass(currentInk)}`}
          >
            {/* Center Spine Stitch Binding */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-8 -translate-x-1/2 pointer-events-none z-20">
              <div className="w-full h-full bg-gradient-to-r from-black/10 via-black/20 to-black/10 shadow-inner flex flex-col justify-around py-6 items-center">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="w-3 h-1.5 bg-gradient-to-r from-slate-400 via-amber-200 to-slate-400 rounded-full border border-black/30 shadow-xs" />
                ))}
              </div>
            </div>

            {/* SKELETON PAGE 1: Core Foundations & Definitions */}
            <div style={getPaperBgStyle()} className="rounded-xl overflow-hidden p-2">
              <div className="relative pr-0 md:pr-3 min-h-[750px] flex flex-col justify-between">
                {/* Red double margin line */}
                <div className="absolute left-6 top-0 bottom-0 w-1 border-r-2 border-double border-red-400/60 pointer-events-none" />

                <div className="pl-9 space-y-4">
                  {/* Register Header */}
                  <div className="flex items-center justify-between border-b-2 border-red-400/60 pb-1.5 mb-2.5 text-xs font-sans font-bold">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="px-2 py-0.5 bg-red-100 border border-red-300 text-red-900 rounded font-mono text-[11px] animate-pulse">
                        PAGE 01
                      </div>
                      <div className="text-slate-600 font-mono text-[11px] hidden sm:block">
                        DATE: <span className="underline decoration-dotted text-slate-900">10 / 10 / 2026</span>
                      </div>
                      <div className="text-slate-600 text-[11px] hidden md:block">
                        SUBJECT: <span className="text-slate-900 font-semibold">{note?.subject || 'Science & Math'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="px-2.5 py-0.5 border-2 border-dashed border-red-600 text-red-700 rounded-lg text-[10px] font-black uppercase tracking-wider rotate-[-2deg] bg-red-50/90 shadow-2xs animate-pulse">
                        ★ CBSE TOPPER • AIR 1 VERIFIED
                      </div>
                    </div>
                  </div>

                  {/* Writing Inking Indicator */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="h-6 w-28 bg-emerald-200/60 rounded-lg animate-pulse" />
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/90 border border-blue-300 text-blue-900 text-xs font-sans font-bold shadow-2xs">
                      <PenTool className="w-3.5 h-3.5 text-blue-700 animate-spin" style={{ animationDuration: '4s' }} />
                      <span>Writing Gel Pen Strokes...</span>
                    </div>
                  </div>

                  {/* Title Shimmer Banner */}
                  <div className="text-center my-2">
                    <div className="inline-block px-6 py-2 rounded-2xl bg-rose-50/90 border-2 border-rose-300 shadow-md w-3/4 max-w-md mx-auto">
                      <div className="h-7 w-5/6 bg-rose-300/60 rounded-lg animate-pulse animate-shimmer mx-auto mb-1.5" />
                      <div className="h-3 w-1/2 bg-rose-200/60 rounded-md animate-pulse mx-auto" />
                    </div>
                  </div>

                  {/* Section 1 Skeleton */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-full border-2 border-current bg-white/90 flex items-center justify-center font-bold text-sm shadow-2xs">
                        1
                      </span>
                      <div className="h-6 w-48 bg-amber-200/80 rounded-md animate-pulse animate-shimmer" />
                    </div>

                    {/* Paragraph Explanation Skeleton */}
                    <div className="p-3.5 border rounded-2xl bg-blue-50/70 border-blue-300/80 space-y-2.5 shadow-2xs">
                      <div className="h-4 w-[96%] bg-blue-200/70 rounded-full animate-pulse animate-shimmer" />
                      <div className="h-4 w-[88%] bg-blue-200/60 rounded-full animate-pulse delay-75 animate-shimmer" />
                      <div className="h-4 w-[92%] bg-blue-200/70 rounded-full animate-pulse delay-100 animate-shimmer" />
                      <div className="h-4 w-[64%] bg-blue-200/50 rounded-full animate-pulse delay-150 animate-shimmer" />
                    </div>

                    {/* Bullets Skeleton */}
                    <ul className="space-y-2 pl-3">
                      <li className="flex items-center gap-2">
                        <span className="text-pink-600 font-bold text-xl leading-none">&bull;</span>
                        <div className="h-4 w-[82%] bg-blue-200/60 rounded-full animate-pulse" />
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-pink-600 font-bold text-xl leading-none">&bull;</span>
                        <div className="h-4 w-[74%] bg-blue-200/60 rounded-full animate-pulse delay-75" />
                      </li>
                    </ul>

                    {/* Formula Box Skeleton */}
                    <div className="p-3.5 border-2 border-dashed border-emerald-500 rounded-2xl bg-emerald-50/80 shadow-xs space-y-2.5 my-2">
                      <div className="flex items-center justify-between text-xs font-sans font-bold text-emerald-900 uppercase">
                        <span>🟢 Formula Box: NCERT Governing Law</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-950 font-mono text-[10px]">
                          NCERT Result
                        </span>
                      </div>

                      <div className="p-2.5 border-2 border-dashed border-emerald-400 rounded-xl bg-white/95 flex justify-center items-center py-3">
                        <div className="h-6 w-52 bg-emerald-200/80 rounded-lg animate-pulse animate-shimmer" />
                      </div>

                      <div className="mt-2 pt-2 border-t border-emerald-200/80 space-y-1.5 font-sans">
                        <div className="h-3 w-44 bg-emerald-300/70 rounded animate-pulse" />
                        <div className="h-3 w-3/4 bg-emerald-200/60 rounded animate-pulse" />
                        <div className="h-6 w-40 bg-emerald-200 text-emerald-950 rounded-lg ml-auto border border-emerald-400 animate-pulse mt-2" />
                      </div>
                    </div>

                    {/* Yellow Highlighter Concept Badges */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      <div className="px-3 py-1 bg-yellow-300/80 border border-yellow-400 text-yellow-950 rounded-md text-xs font-bold shadow-2xs animate-pulse">
                        🟡 Synthesizing High-Yield Concept 1
                      </div>
                      <div className="px-3 py-1 bg-yellow-300/80 border border-yellow-400 text-yellow-950 rounded-md text-xs font-bold shadow-2xs animate-pulse delay-75">
                        🟡 Board Keyword 2
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="pl-9 pt-3 flex items-center justify-between text-xs text-slate-500 font-sans border-t border-slate-300 mt-4">
                  <span className="font-bold text-slate-700">Page 01 &bull; Core Foundations</span>
                  <span className="font-mono text-amber-700 animate-pulse">Drawing ink strokes...</span>
                </div>
              </div>
            </div>

            {/* SKELETON PAGE 2: Derivations, Diagrams & Exam Traps */}
            <div style={getPaperBgStyle()} className="rounded-xl overflow-hidden p-2">
              <div className="relative pl-0 md:pl-3 min-h-[750px] flex flex-col justify-between">
                {/* Red double margin line */}
                <div className="absolute left-6 top-0 bottom-0 w-1 border-r-2 border-double border-red-400/60 pointer-events-none" />

                <div className="pl-9 space-y-4">
                  {/* Register Header */}
                  <div className="flex items-center justify-between border-b-2 border-red-400/60 pb-1.5 mb-2.5 text-xs font-sans font-bold">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="px-2 py-0.5 bg-red-100 border border-red-300 text-red-900 rounded font-mono text-[11px] animate-pulse">
                        PAGE 02
                      </div>
                      <div className="text-slate-600 text-[11px] hidden sm:block">
                        Weightage: <span className="font-mono text-emerald-800 font-bold">High-Yield Board Section</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="px-2.5 py-0.5 border-2 border-dashed border-red-600 text-red-700 rounded-lg text-[10px] font-black uppercase tracking-wider rotate-[-2deg] bg-red-50/90 shadow-2xs animate-pulse">
                        ★ CBSE TOPPER • AIR 1 VERIFIED
                      </div>
                    </div>
                  </div>

                  {/* Section 2 Header */}
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-full border-2 border-current bg-white/90 flex items-center justify-center font-bold text-sm shadow-2xs">
                      2
                    </span>
                    <div className="h-6 w-52 bg-amber-200/80 rounded-md animate-pulse animate-shimmer" />
                  </div>

                  {/* Scientific Diagram Apparatus Skeleton Canvas */}
                  <div className="p-3 bg-white/90 border-2 border-blue-400 rounded-2xl shadow-sm space-y-2.5 font-sans">
                    <div className="flex items-center justify-between border-b border-blue-200 pb-1 text-xs font-bold text-blue-950 uppercase">
                      <span className="flex items-center gap-1.5">
                        <Atom className="w-4 h-4 text-blue-600 animate-spin" style={{ animationDuration: '6s' }} />
                        <span>Scientific Diagram &amp; Apparatus Drawing</span>
                      </span>
                      <span className="text-[10px] bg-blue-100 text-blue-900 px-2 py-0.5 rounded font-mono">
                        Vector Schematic
                      </span>
                    </div>

                    {/* Animated Drawing Apparatus Canvas */}
                    <div className="h-44 w-full bg-slate-50/90 border border-dashed border-blue-300 rounded-xl flex flex-col items-center justify-center relative overflow-hidden shadow-2xs">
                      {/* Technical Grid Pattern */}
                      <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <pattern id="skel-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#93c5fd" strokeWidth="0.8" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#skel-grid)" />
                      </svg>

                      {/* Moving Blueprint Shapes */}
                      <div className="relative z-10 flex flex-col items-center space-y-2">
                        <div className="relative w-20 h-20 flex items-center justify-center">
                          <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-400 animate-spin" style={{ animationDuration: '8s' }} />
                          <div className="w-10 h-10 rounded-full border-2 border-blue-500 bg-blue-100/60 flex items-center justify-center shadow-xs">
                            <PenTool className="w-5 h-5 text-blue-600 animate-pulse" />
                          </div>
                        </div>
                        <div className="text-center space-y-0.5">
                          <span className="text-xs font-bold text-blue-900 block font-sans">
                            Rendering Labeled Examination Apparatus...
                          </span>
                          <span className="text-[11px] text-blue-700 italic">
                            Tracing ray optics, free-body vectors &amp; organelle membranes
                          </span>
                        </div>
                      </div>

                      {/* Sweeping Shimmer Line */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmerSweep_2s_infinite]" />
                    </div>

                    {/* Chemical/Formula Banner */}
                    <div className="p-2 bg-blue-50 rounded-xl border border-blue-200 text-center">
                      <div className="h-4 w-3/4 bg-blue-200/80 rounded-md mx-auto animate-pulse animate-shimmer" />
                    </div>
                  </div>

                  {/* Red Pen Trap Warning Box */}
                  <div className="p-3 border-2 border-rose-400 rounded-xl bg-rose-50/90 shadow-2xs space-y-1.5 font-sans">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-900 uppercase">
                      <AlertTriangle className="w-4 h-4 text-rose-600 animate-bounce" />
                      <span>Red Pen Trap: Common Student Blunder in Board Exams</span>
                    </div>
                    <div className="h-3.5 w-[92%] bg-rose-200/70 rounded animate-pulse" />
                    <div className="h-3.5 w-[78%] bg-rose-200/60 rounded animate-pulse delay-75" />
                  </div>

                  {/* Post-It Sticky Note Memory Hack Skeleton */}
                  <div className="flex justify-end pt-1">
                    <div className="w-full sm:w-68 bg-[#fef08a] border border-[#facc15] rounded-xl p-3.5 shadow-lg rotate-[-1.5deg] relative text-amber-950 font-sans space-y-1.5">
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-20 h-4 bg-amber-200/80 border border-amber-300/60 rounded-xs shadow-xs" />
                      <div className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                        <span>Topper Memory Hack</span>
                      </div>
                      <div className="h-3.5 w-full bg-amber-300/60 rounded animate-pulse" />
                      <div className="h-3.5 w-4/5 bg-amber-300/60 rounded animate-pulse delay-75" />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="pl-9 pt-3 flex items-center justify-between text-xs text-slate-500 font-sans border-t border-slate-300 mt-4">
                  <span className="font-bold text-slate-700">Page 02 &bull; Equations &amp; Derivations</span>
                  <span className="font-mono text-emerald-800 font-bold">100% Free Open Education</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // If component is awaiting content or in synthesis mode, display the rich skeleton spread
  if (isActivelyLoading || !note) {
    return renderSkeletonSpread();
  }

  // Sample chapters for quick switching
  const sampleChapters = SAMPLE_CHAPTERS;

  return (
    <div className="w-full max-w-6xl mx-auto my-6 space-y-4">
      {/* 1. Quick Chapter Switcher Pill Row */}
      {onSelectSampleChapter && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none print:hidden">
          <div className="flex items-center gap-1.5 shrink-0 px-2.5 py-1 text-xs font-bold text-amber-400">
            <BookMarked className="w-3.5 h-3.5" />
            <span>Quick Topper Notes:</span>
          </div>
          {sampleChapters.map((sc) => (
            <button
              key={sc.key}
              onClick={() => onSelectSampleChapter(sc.key)}
              className="shrink-0 px-3 py-1 rounded-xl bg-white/5 hover:bg-amber-400/20 text-slate-300 hover:text-amber-200 border border-white/10 hover:border-amber-400/40 text-xs font-medium transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              {sc.label}
            </button>
          ))}
        </div>
      )}

      {/* 2. Control Toolbar */}
      <div className="astra-card border border-white/10 rounded-2xl p-3 sm:p-4 shadow-xl flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm print:hidden">
        {/* Left: View Mode Toggle */}
        <div className="flex items-center gap-2">
          {/* View Mode Buttons */}
          <div className="flex items-center gap-1 bg-black/40 border border-white/10 rounded-xl p-0.5">
            <button
              onClick={() => setLayoutMode('spread')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                layoutMode === 'spread' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Two-Page Open Notebook Spread"
            >
              Spread View
            </button>
            <button
              onClick={() => setLayoutMode('single')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                layoutMode === 'single' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Single Page Focused View"
            >
              Single Page
            </button>
            <button
              onClick={() => setLayoutMode('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                layoutMode === 'all' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="All 4 Pages Continuous Register"
            >
              All Pages
            </button>
          </div>

          {/* Spread Page Toggle (Spread 1: Pgs 1-2 vs Spread 2: Pgs 3-4) */}
          {layoutMode === 'spread' && (
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-0.5 ml-1">
              <button
                onClick={() => setActiveSpread(1)}
                className={`px-2 py-0.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  activeSpread === 1 ? 'bg-amber-400/20 text-amber-300 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Spread 1 (Pgs 1–2)
              </button>
              <button
                onClick={() => setActiveSpread(2)}
                className={`px-2 py-0.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  activeSpread === 2 ? 'bg-amber-400/20 text-amber-300 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Spread 2 (Pgs 3–4)
              </button>
            </div>
          )}

          {/* Single Page Navigation Controls */}
          {layoutMode === 'single' && (
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={() => setActiveSinglePage((p) => Math.max(1, p - 1))}
                disabled={activeSinglePage <= 1}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-xs text-amber-300 font-bold px-1.5">
                Page {activeSinglePage} of 4
              </span>
              <button
                onClick={() => setActiveSinglePage((p) => Math.min(4, p + 1))}
                disabled={activeSinglePage >= 4}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right: Aesthetics & Export Actions */}
        <div className="flex items-center gap-2">
          {/* Style Customizer Toggle */}
          <button
            onClick={() => setShowStyleDrawer(!showStyleDrawer)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border transition-colors cursor-pointer text-xs ${
              showStyleDrawer 
                ? 'bg-amber-400/20 text-amber-300 border-amber-400/40' 
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
            }`}
            title="Customize Handwriting Style, Ink & Paper"
          >
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Style &amp; Ink</span>
          </button>

          {/* Zoom controls */}
          <div className="hidden md:flex items-center gap-1 border border-white/10 rounded-xl p-0.5 bg-black/30">
            <button
              onClick={() => setZoomLevel((prev) => Math.max(70, prev - 10))}
              className="p-1 hover:bg-white/10 rounded text-slate-300 cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs px-1 text-slate-300 font-mono">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel((prev) => Math.min(130, prev + 10))}
              className="p-1 hover:bg-white/10 rounded text-slate-300 cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Ask AI Tutor */}
          {onOpenChatWithNote && (
            <button
              onClick={() => onOpenChatWithNote(activeNote)}
              className="flex items-center gap-1 px-3 py-1.5 bg-purple-500/15 text-purple-300 hover:bg-purple-500/25 border border-purple-500/30 rounded-xl transition-colors font-medium text-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>AI Tutor</span>
            </button>
          )}

          {/* Save to Library */}
          {onSaveToLibrary && (
            <button
              onClick={onSaveToLibrary}
              disabled={isSaved}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl transition-colors font-medium text-xs cursor-pointer ${
                isSaved 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                  : 'bg-amber-400/15 text-amber-300 hover:bg-amber-400/25 border border-amber-400/30'
              }`}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                  <span>Save Note</span>
                </>
              )}
            </button>
          )}

          {/* Share */}
          <button
            onClick={handleCopyShare}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs transition-colors cursor-pointer border border-white/10"
            title="Share Note"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copiedLink ? 'Copied!' : 'Share'}</span>
          </button>

          {/* PRIMARY: Print to PDF Button (A4 Landscape Print) */}
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer active:scale-95 border border-amber-300"
            title="Print to PDF (Formats current note as Landscape A4 spread using browser print dialog)"
          >
            <Printer className="w-4 h-4 text-slate-950" />
            <span>Print to PDF</span>
          </button>
        </div>
      </div>

      {/* 3. Style Customization Drawer */}
      {showStyleDrawer && (
        <div className="astra-card border border-amber-400/30 rounded-2xl p-4 shadow-xl space-y-4 animate-in fade-in print:hidden">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-bold text-xs text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5" />
              Handwriting &amp; Paper Customization
            </span>
            <button
              onClick={() => setShowStyleDrawer(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Done
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Paper Type */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-semibold block">Paper Texture:</label>
              <select
                value={paperType}
                onChange={(e) => setPaperType(e.target.value)}
                className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="ruled-notebook">📘 Ruled Indian Register</option>
                <option value="grid-math">📐 Square Grid Graph Math</option>
                <option value="vintage-parchment">📜 Vintage Parchment</option>
                <option value="clean-ivory">📄 Smooth Ivory Sketchbook</option>
                <option value="legal-pad">📝 Yellow Legal Pad</option>
                <option value="chalkboard-dark">⬛ Blackboard Chalk Mode</option>
              </select>
            </div>

            {/* Handwriting Font */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-semibold block">Handwriting Font:</label>
              <select
                value={currentFont}
                onChange={(e) => setCurrentFont(e.target.value as any)}
                className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="Kalam">Kalam (Indian Student Pen)</option>
                <option value="Caveat">Caveat (Flowing Cursive)</option>
                <option value="Patrick Hand">Patrick Hand (Neat Print)</option>
                <option value="Indie Flower">Indie Flower (Creative Script)</option>
                <option value="Architects Daughter">Architects Daughter (Technical)</option>
                <option value="Homemade Apple">Homemade Apple (Fountain Pen)</option>
              </select>
            </div>

            {/* Ink Color */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-semibold block">Pen Ink Color:</label>
              <select
                value={currentInk}
                onChange={(e) => setCurrentInk(e.target.value as any)}
                className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="royal-blue">🔵 Royal Blue Gel Pen</option>
                <option value="classic-black">⚫ Classic Black Ink</option>
                <option value="academic-red">🔴 Academic Crimson Red</option>
                <option value="emerald-green">🟢 Teacher Emerald Green</option>
                <option value="pencil-gray">✏️ Graphite Pencil Gray</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 4. Interactive Web Notebook Viewer (Hidden during print) */}
      <div 
        className="w-full flex flex-col items-center overflow-x-auto pb-6 print:hidden"
        style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
      >
        <div
          ref={noteRef}
          style={{
            fontFamily: `"${currentFont}", cursive, sans-serif`,
          }}
          className={`w-full max-w-[1100px] min-h-[950px] rounded-3xl shadow-2xl border-4 border-[#e5dec9] relative p-4 sm:p-8 ${
            layoutMode === 'single' ? 'grid grid-cols-1' : 'grid grid-cols-1 md:grid-cols-2 gap-8'
          } ${getInkColorClass(currentInk)}`}
        >
          {/* Center Spine Stitch for Spread Mode */}
          {layoutMode === 'spread' && (
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-8 -translate-x-1/2 pointer-events-none z-20">
              <div className="w-full h-full bg-gradient-to-r from-black/10 via-black/20 to-black/10 shadow-inner flex flex-col justify-around py-6 items-center">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="w-3 h-1.5 bg-gradient-to-r from-slate-400 via-amber-200 to-slate-400 rounded-full border border-black/30 shadow-xs" />
                ))}
              </div>
            </div>
          )}

          {/* PAGE 1: Foundations (Spread 1 Left or Single P1) */}
          {((layoutMode === 'spread' && activeSpread === 1) || layoutMode === 'all' || (layoutMode === 'single' && activeSinglePage === 1)) && (
            <div style={getPaperBgStyle()} className="rounded-xl overflow-hidden p-2">
              {renderPageOne()}
            </div>
          )}

          {/* PAGE 2: Derivations & Formulas (Spread 1 Right or Single P2) */}
          {((layoutMode === 'spread' && activeSpread === 1) || layoutMode === 'all' || (layoutMode === 'single' && activeSinglePage === 2)) && (
            <div style={getPaperBgStyle()} className="rounded-xl overflow-hidden p-2">
              {renderPageTwo()}
            </div>
          )}

          {/* PAGE 3: Scientific Diagrams (Spread 2 Left or Single P3) */}
          {((layoutMode === 'spread' && activeSpread === 2) || layoutMode === 'all' || (layoutMode === 'single' && activeSinglePage === 3)) && (
            <div style={getPaperBgStyle()} className="rounded-xl overflow-hidden p-2">
              {renderPageThree()}
            </div>
          )}

          {/* PAGE 4: Exam Strategy & PYQs (Spread 2 Right or Single P4) */}
          {((layoutMode === 'spread' && activeSpread === 2) || layoutMode === 'all' || (layoutMode === 'single' && activeSinglePage === 4)) && (
            <div style={getPaperBgStyle()} className="rounded-xl overflow-hidden p-2">
              {renderPageFour()}
            </div>
          )}
        </div>

        {/* Action Footer: Spread Flip Buttons + Download as PDF Button */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 print:hidden">
          {layoutMode === 'spread' && (
            <>
              {activeSpread === 1 ? (
                <button
                  onClick={() => setActiveSpread(2)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm shadow-xl transition-all cursor-pointer active:scale-95"
                >
                  <span>Turn Page: Open Spread 2 (Scientific Diagrams &amp; Exam Tips)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setActiveSpread(1)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-white/10 shadow-xl transition-all cursor-pointer active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4 text-amber-400" />
                  <span>Turn Back: Open Spread 1 (Core Foundations &amp; Proofs)</span>
                </button>
              )}
            </>
          )}

          {/* Print to PDF Footer Quick Button */}
          <button
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm shadow-xl transition-all cursor-pointer active:scale-95 border border-amber-300"
            title="Format current note as a landscape A4 spread and print to PDF"
          >
            <Printer className="w-4 h-4 text-slate-950" />
            <span>Print to PDF (Landscape A4 Spread)</span>
          </button>
        </div>
      </div>

      {/* 5. DEDICATED HIGH-RES A4 LANDSCAPE PRINT & PDF EXPORT CONTAINER */}
      {/* Active ONLY during browser print dialog. Renders exactly 2 landscape sheets containing all 4 register pages */}
      <div 
        className="hidden print:block w-full space-y-0"
        style={{ fontFamily: `"${currentFont}", cursive, sans-serif` }}
      >
        {/* SHEET 1: SPREAD 1 (Page 01 on Left, Page 02 on Right) */}
        <div className="a4-landscape-sheet">
          <div className="a4-landscape-page" style={getPaperBgStyle()}>
            {renderPageOne()}
          </div>
          <div className="a4-landscape-page" style={getPaperBgStyle()}>
            {renderPageTwo()}
          </div>
        </div>

        {/* SHEET 2: SPREAD 2 (Page 03 on Left, Page 04 on Right) */}
        <div className="a4-landscape-sheet">
          <div className="a4-landscape-page" style={getPaperBgStyle()}>
            {renderPageThree()}
          </div>
          <div className="a4-landscape-page" style={getPaperBgStyle()}>
            {renderPageFour()}
          </div>
        </div>
      </div>
    </div>
  );
};
