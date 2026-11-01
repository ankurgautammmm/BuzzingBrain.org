import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Flame,
  FileText,
  Palette,
  Loader2,
  Sliders,
  Send,
  GraduationCap,
  Award,
  Zap,
  HelpCircle,
  Hash
} from 'lucide-react';
import { HandwritingStyleConfig, PenType, InkColor, PaperType, HandwritingFont, NotesMode, ExamTarget } from '../types';
import { validateNcertSyllabus, NCERT_SYLLABUS } from '../data/ncertSyllabus';

interface HandwritingCommandBarProps {
  onGenerate: (command: string, options?: Partial<HandwritingStyleConfig> & { thinkingMode?: 'standard' | 'high'; mode?: NotesMode; targetExam?: ExamTarget }) => void;
  isGenerating: boolean;
  activeClass: string;
  onClassChange: (newClass: string) => void;
  initialCommand?: string;
}

export const HandwritingCommandBar: React.FC<HandwritingCommandBarProps> = ({
  onGenerate,
  isGenerating,
  activeClass,
  onClassChange,
  initialCommand,
}) => {
  // Command & Generator Inputs
  const [commandText, setCommandText] = useState<string>(
    initialCommand || '/handwriting photosynthesis --class 10 --detailed'
  );
  const [topicInput, setTopicInput] = useState<string>('Photosynthesis & Cellular Energy');
  const [selectedClass, setSelectedClass] = useState<string>(activeClass || 'Class 10');
  const [selectedSubject, setSelectedSubject] = useState<string>('Science');
  const [selectedExam, setSelectedExam] = useState<ExamTarget>('cbse');
  const [selectedMode, setSelectedMode] = useState<NotesMode>('detailed');

  // Handwriting Aesthetics
  const [showStyleDrawer, setShowStyleDrawer] = useState(false);
  const [selectedPen, setSelectedPen] = useState<PenType>('gel-pen');
  const [selectedInk, setSelectedInk] = useState<InkColor>('royal-blue');
  const [selectedPaper, setSelectedPaper] = useState<PaperType>('ruled-notebook');
  const [selectedFont, setSelectedFont] = useState<HandwritingFont>('Kalam');
  const [highThinking, setHighThinking] = useState(true);

  // Quick Presets matching 2026-27 Syllabus
  const samplePresets = [
    { label: "10th Science: Photosynthesis", cmd: "/handwriting photosynthesis --class 10 --detailed", cls: "Class 10", subj: "Science" },
    { label: "10th Math: Quadratic Equations", cmd: "/handwriting quadratic equations --class 10 --formulas", cls: "Class 10", subj: "Mathematics" },
    { label: "9th Science: Cell & Organelles", cmd: "/handwriting organisation in living systems --class 9 --detailed", cls: "Class 9", subj: "Science" },
    { label: "9th Science: Laws of Motion", cmd: "/handwriting force and laws of motion --class 9 --detailed", cls: "Class 9", subj: "Science" },
    { label: "11th Physics: Laws of Motion", cmd: "/handwriting laws of motion --class 11 --jee", cls: "Class 11", subj: "Physics" },
    { label: "12th Physics: Electric Charges", cmd: "/handwriting electric charges and fields --class 12 --exam", cls: "Class 12", subj: "Physics" },
    { label: "12th Biology: DNA Inheritance", cmd: "/handwriting molecular basis of inheritance --class 12 --neet", cls: "Class 12", subj: "Biology" },
  ];

  // Dynamic Syllabus Match Preview
  const [validationInfo, setValidationInfo] = useState<{
    isValid: boolean;
    classGrade: string;
    subject: string;
    message: string;
    matchedChapterName?: string;
  }>({
    isValid: true,
    classGrade: 'Class 10',
    subject: 'Science',
    message: '2026–27 NCERT Syllabus Validated',
    matchedChapterName: 'Life Processes'
  });

  useEffect(() => {
    if (initialCommand) {
      setCommandText(initialCommand);
    }
  }, [initialCommand]);

  useEffect(() => {
    // Synchronize command bar with selected fields
    const res = validateNcertSyllabus(selectedClass, selectedSubject, topicInput);
    setValidationInfo({
      isValid: res.isValid,
      classGrade: res.normalizedClass,
      subject: res.normalizedSubject,
      message: res.message,
      matchedChapterName: res.matchedChapter?.name,
    });
  }, [topicInput, selectedClass, selectedSubject]);

  const handleExecute = (cmdToRun?: string) => {
    const finalCmd = cmdToRun || commandText || `/handwriting ${topicInput} --class ${selectedClass.replace('Class ', '')} --${selectedMode} --${selectedExam}`;
    if (!finalCmd.trim() || isGenerating) return;

    onGenerate(finalCmd, {
      penType: selectedPen,
      inkColor: selectedInk,
      paperType: selectedPaper,
      fontFamily: selectedFont,
      mode: selectedMode,
      targetExam: selectedExam,
      thinkingMode: highThinking ? 'high' : 'standard',
    });
  };

  const handleSelectPreset = (preset: typeof samplePresets[0]) => {
    setCommandText(preset.cmd);
    setTopicInput(preset.label.split(':')[1]?.trim() || preset.label);
    setSelectedClass(preset.cls);
    setSelectedSubject(preset.subj);
    onClassChange(preset.cls);
    handleExecute(preset.cmd);
  };

  const handleSyncFromFieldsToCommand = (newTopic?: string, newClass?: string, newSubj?: string, newMode?: NotesMode, newExam?: ExamTarget) => {
    const t = newTopic !== undefined ? newTopic : topicInput;
    const c = newClass !== undefined ? newClass : selectedClass;
    const m = newMode !== undefined ? newMode : selectedMode;
    const e = newExam !== undefined ? newExam : selectedExam;

    const classNum = c.replace(/[^0-9]/g, '');
    const newCmd = `/handwriting ${t} --class ${classNum} --${m} --${e}`;
    setCommandText(newCmd);
  };

  return (
    <div className="w-full max-w-5xl mx-auto mb-8 space-y-4">
      {/* Dedicated Generate Handwritten Notes Interface Box */}
      <div className="astra-card rounded-3xl border border-white/15 shadow-2xl overflow-hidden transition-all">
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between px-6 py-3.5 bg-black/50 border-b border-white/10 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span className="font-bold text-white tracking-wide">
              Handwritten Notes Studio
            </span>
            <span className="text-slate-500 hidden sm:inline">&bull;</span>
            <span className="text-slate-400 hidden sm:inline">2026–27 NCERT Curriculum</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Notes Mode Selector */}
            <div className="flex items-center bg-black/60 p-0.5 rounded-xl border border-white/10 text-xs">
              <span className="text-[11px] text-slate-400 font-mono pl-2 pr-1 hidden md:inline">Mode:</span>
              <select
                value={selectedMode}
                onChange={(e) => {
                  const m = e.target.value as NotesMode;
                  setSelectedMode(m);
                  handleSyncFromFieldsToCommand(undefined, undefined, undefined, m);
                }}
                className="bg-transparent text-amber-300 font-bold px-2 py-1 outline-none cursor-pointer border-none"
              >
                <option value="detailed" className="bg-slate-900 text-white">📘 Detailed</option>
                <option value="short" className="bg-slate-900 text-white">⚡ Short</option>
                <option value="exam" className="bg-slate-900 text-white">🎯 Exam</option>
                <option value="revision" className="bg-slate-900 text-white">🔁 Revision</option>
                <option value="formulas" className="bg-slate-900 text-white">🧮 Formulas</option>
                <option value="mindmap" className="bg-slate-900 text-white">🧠 Mind Map</option>
                <option value="questions" className="bg-slate-900 text-white">❓ Questions</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setShowStyleDrawer(!showStyleDrawer)}
              className="flex items-center gap-1.5 text-slate-200 hover:text-white px-3 py-1 rounded-xl bg-white/10 border border-white/15 hover:border-amber-400/40 transition-colors cursor-pointer font-medium"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Notes Style (Paper &amp; Ink)</span>
            </button>
          </div>
        </div>

        {/* Structured Generator Inputs */}
        <div className="p-5 sm:p-6 space-y-4 bg-slate-950/40">
          {/* Row 1: Topic Input & Primary Generate Button */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400 font-mono font-bold text-sm">
                /hw
              </span>
              <input
                type="text"
                value={commandText}
                onChange={(e) => {
                  setCommandText(e.target.value);
                  // also update topic preview
                  const cleanTopic = e.target.value.replace(/^\/(?:handwriting|hw)\s*/i, '').replace(/--[a-z0-9_-]+/gi, '').trim();
                  if (cleanTopic) setTopicInput(cleanTopic);
                }}
                placeholder="e.g. /handwriting photosynthesis --class 10 --detailed OR enter any topic / lecture text..."
                className="w-full pl-14 pr-4 py-3.5 bg-black/60 border border-white/10 rounded-2xl text-white text-sm sm:text-base outline-none font-mono focus:border-amber-400/80 transition-colors"
                disabled={isGenerating}
              />
            </div>

            <button
              type="button"
              onClick={() => handleExecute()}
              disabled={isGenerating || !commandText.trim()}
              className="px-7 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Synthesizing Notes...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Generate Notes</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Row 2: Selectors Grid (Class, Subject, Exam Target, Notes Mode) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {/* Class Selector */}
            <div className="space-y-1">
              <label className="text-slate-400 font-medium block">Grade / Class:</label>
              <select
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  onClassChange(e.target.value);
                  handleSyncFromFieldsToCommand(undefined, e.target.value);
                }}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white font-semibold outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="Class 9">Class 9 (CBSE 2026–27)</option>
                <option value="Class 10">Class 10 (Board Exam)</option>
                <option value="Class 11">Class 11 (Senior Secondary)</option>
                <option value="Class 12">Class 12 (Board &amp; Entrance)</option>
              </select>
            </div>

            {/* Subject Selector */}
            <div className="space-y-1">
              <label className="text-slate-400 font-medium block">Subject:</label>
              <select
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value);
                  handleSyncFromFieldsToCommand(undefined, undefined, e.target.value);
                }}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white font-semibold outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="Science">Science</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="Social Science">Social Science</option>
                <option value="Mathematics">Mathematics</option>
              </select>
            </div>

            {/* Target Exam */}
            <div className="space-y-1">
              <label className="text-slate-400 font-medium block">Target Examination:</label>
              <select
                value={selectedExam}
                onChange={(e) => {
                  setSelectedExam(e.target.value as ExamTarget);
                  handleSyncFromFieldsToCommand(undefined, undefined, undefined, undefined, e.target.value as ExamTarget);
                }}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white font-semibold outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="cbse">CBSE Board Exam</option>
                <option value="neet">NEET (Medical)</option>
                <option value="jee">JEE (Engineering)</option>
                <option value="general">Conceptual Mastery</option>
              </select>
            </div>

            {/* Notes Mode Selector */}
            <div className="space-y-1">
              <label className="text-slate-400 font-medium block">Notes Style / Mode:</label>
              <select
                value={selectedMode}
                onChange={(e) => {
                  setSelectedMode(e.target.value as NotesMode);
                  handleSyncFromFieldsToCommand(undefined, undefined, undefined, e.target.value as NotesMode);
                }}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white font-semibold outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="detailed">📘 Detailed Full Chapter</option>
                <option value="short">⚡ Quick Revision Sheet</option>
                <option value="exam">🎯 Exam-Focused High-Yield</option>
                <option value="revision">🔁 1-Shot Spaced Revision</option>
                <option value="formulas">🧮 Formula &amp; Equation Sheet</option>
                <option value="mindmap">🧠 Handwritten Mind Map</option>
                <option value="questions">❓ Important Questions &amp; PYQs</option>
              </select>
            </div>
          </div>
        </div>

        {/* Validation & Live Status Bar */}
        <div className="px-6 py-2.5 bg-black/70 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-emerald-300 font-medium">
              {validationInfo.message}
            </span>
            {validationInfo.matchedChapterName && (
              <span className="text-slate-400 hidden sm:inline">
                &bull; Matched Chapter: <strong className="text-white">{validationInfo.matchedChapterName}</strong>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
            <span>Mode: <strong className="text-amber-400 capitalize">{selectedMode}</strong></span>
            <span>&bull;</span>
            <span>Exam: <strong className="text-violet-400 uppercase">{selectedExam}</strong></span>
          </div>
        </div>
      </div>

      {/* Style Drawer (Pen, Ink, Paper, Font Simulation) */}
      {showStyleDrawer && (
        <div className="astra-card rounded-2xl p-5 border border-white/10 space-y-4 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h4 className="font-bold text-white text-xs sm:text-sm flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-400" />
              <span>Authentic Handwritten Physical Notebook Simulation</span>
            </h4>
            <span className="text-xs text-slate-400">Controls ruled lines, left margin, pen pressure, and ink flow</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="font-medium text-slate-300 block mb-1.5">Pen Type</label>
              <select
                value={selectedPen}
                onChange={(e) => setSelectedPen(e.target.value as PenType)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-white focus:border-amber-400 outline-none"
              >
                <option value="gel-pen">Gel Pen (0.5mm Crisp student ink)</option>
                <option value="fountain-pen">Fountain Pen (Smooth rich flow)</option>
                <option value="ballpoint">Ballpoint Pen (Standard examination)</option>
                <option value="pencil">2B Pencil (Diagrams &amp; graphite)</option>
              </select>
            </div>

            <div>
              <label className="font-medium text-slate-300 block mb-1.5">Ink Color</label>
              <select
                value={selectedInk}
                onChange={(e) => setSelectedInk(e.target.value as InkColor)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-white focus:border-amber-400 outline-none"
              >
                <option value="royal-blue">Royal Blue (Student standard)</option>
                <option value="classic-black">Classic Black Gel</option>
                <option value="academic-red">Academic Red (Alerts)</option>
                <option value="emerald-green">Emerald Green (Derivations)</option>
              </select>
            </div>

            <div>
              <label className="font-medium text-slate-300 block mb-1.5">Notebook Paper</label>
              <select
                value={selectedPaper}
                onChange={(e) => setSelectedPaper(e.target.value as PaperType)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-white focus:border-amber-400 outline-none"
              >
                <option value="ruled-notebook">Ruled Notebook (Blue lines + Red margin)</option>
                <option value="grid-math">Grid / Graph Paper (Calculations)</option>
                <option value="vintage-parchment">Vintage Parchment (Warm tint)</option>
                <option value="clean-ivory">Clean Ivory Blank Sheet</option>
              </select>
            </div>

            <div>
              <label className="font-medium text-slate-300 block mb-1.5">Handwriting Typography</label>
              <select
                value={selectedFont}
                onChange={(e) => setSelectedFont(e.target.value as HandwritingFont)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-white focus:border-amber-400 outline-none"
              >
                <option value="Kalam">Kalam (Natural Cursive Topper)</option>
                <option value="Caveat">Caveat (Flowing Penmanship)</option>
                <option value="Patrick Hand">Patrick Hand (Neat Block Letters)</option>
                <option value="Indie Flower">Indie Flower (Artistic Pen)</option>
                <option value="Architects Daughter">Architects Daughter (Schematic)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Suggested 2026-27 Syllabus Quick Presets */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-semibold flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>Quick Chapters (2026–27):</span>
        </span>
        {samplePresets.map((preset, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSelectPreset(preset)}
            className="px-3 py-1.5 astra-card astra-card-hover text-slate-300 hover:text-white rounded-xl border border-white/10 text-xs transition-colors cursor-pointer font-medium flex items-center gap-1.5"
          >
            <span>{preset.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
