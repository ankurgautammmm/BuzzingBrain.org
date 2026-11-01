import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  ChevronRight, 
  Layers, 
  Flame, 
  BrainCircuit, 
  Tag, 
  ArrowRight,
  Filter,
  Award
} from 'lucide-react';
import { 
  CURRICULUM_STRUCTURE, 
  CURRICULUM_CHAPTERS, 
  CurriculumChapter, 
  searchCurriculum 
} from '../data/curriculumHierarchy';

interface CurriculumNotesDirectoryProps {
  onSelectChapter: (chapter: CurriculumChapter) => void;
  initialClass?: 'Class 9' | 'Class 10' | 'Class 11' | 'Class 12';
}

export const CurriculumNotesDirectory: React.FC<CurriculumNotesDirectoryProps> = ({
  onSelectChapter,
  initialClass = 'Class 10',
}) => {
  const [selectedClass, setSelectedClass] = useState<'Class 9' | 'Class 10' | 'Class 11' | 'Class 12'>(initialClass);
  const [selectedStream, setSelectedStream] = useState<'Science Stream' | 'Commerce' | 'Humanities'>('Science Stream');
  const [selectedSubject, setSelectedSubject] = useState<string>('Science');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopicTag, setSelectedTopicTag] = useState<string | null>(null);

  // Sync default subject when class or stream changes
  const availableSubjects = useMemo(() => {
    const node = CURRICULUM_STRUCTURE[selectedClass];
    if (!node.hasStreams) {
      return node.subjects || ['Mathematics', 'Science', 'Social Science', 'Languages'];
    }
    const stream = (node.streams || []).find((s) => s.name === selectedStream);
    return stream ? stream.subjects : ['Physics', 'Chemistry', 'Biology', 'Mathematics'];
  }, [selectedClass, selectedStream]);

  // Adjust subject when switching grade/stream if current subject is invalid
  React.useEffect(() => {
    if (!availableSubjects.includes(selectedSubject)) {
      setSelectedSubject(availableSubjects[0] || 'Science');
    }
  }, [availableSubjects, selectedSubject]);

  // Filtered chapters based on selection or search query
  const displayedChapters = useMemo(() => {
    if (searchQuery.trim()) {
      return searchCurriculum(searchQuery, selectedClass);
    }

    return CURRICULUM_CHAPTERS.filter((ch) => {
      const classMatch = ch.classGrade === selectedClass;
      const subjectMatch = ch.subject.toLowerCase() === selectedSubject.toLowerCase();
      const streamMatch = !ch.stream || ch.stream === selectedStream;
      const topicTagMatch = !selectedTopicTag || ch.keyTopics.some((t) => t.toLowerCase().includes(selectedTopicTag.toLowerCase()));
      return classMatch && subjectMatch && streamMatch && topicTagMatch;
    });
  }, [searchQuery, selectedClass, selectedSubject, selectedStream, selectedTopicTag]);

  // Total topics count across the curriculum
  const totalSubtopicsCount = useMemo(() => {
    return displayedChapters.reduce((acc, ch) => acc + ch.keyTopics.length, 0);
  }, [displayedChapters]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 text-slate-100">
      {/* Top Banner & Search Header */}
      <div className="astra-card rounded-3xl p-6 sm:p-10 border border-white/10 bg-gradient-to-br from-slate-950 via-[#0a0f2c] to-slate-950 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Official 2026–27 NCERT / CBSE Academic Hierarchy</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              50 Years (1975–2025) PYQ Predictive Model
            </span>
          </div>

          <div className="max-w-3xl space-y-2">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              NCERT Handwritten Notes Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Explore authentic handwritten revision notes with ruled pages, formulas, diagrams, and examiner weightage. Select a chapter below or search for any concept.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across all chapters, topics, formulas, derivations (e.g. Calvin Cycle, King's Rule, Lens Formula)..."
              className="w-full pl-12 pr-10 py-3.5 bg-black/50 border border-white/20 rounded-2xl text-white text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 shadow-inner transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-white/10"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Curriculum Navigation Bar: Class -> Stream -> Subject */}
      <div className="astra-card rounded-2xl p-4 sm:p-5 border border-white/10 bg-slate-950/70 space-y-4 shadow-lg">
        {/* Level 1: Class Selection */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Select Class:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(['Class 9', 'Class 10', 'Class 11', 'Class 12'] as const).map((cls) => (
              <button
                key={cls}
                onClick={() => {
                  setSelectedClass(cls);
                  setSelectedTopicTag(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedClass === cls
                    ? 'bg-amber-400 text-slate-950 shadow-md scale-102 font-extrabold'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>

        {/* Level 2: Stream Selection (for Class 11 & 12 only) */}
        {CURRICULUM_STRUCTURE[selectedClass].hasStreams && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Select Stream:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {(['Science Stream', 'Commerce', 'Humanities'] as const).map((stream) => (
                <button
                  key={stream}
                  onClick={() => {
                    setSelectedStream(stream);
                    setSelectedTopicTag(null);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedStream === stream
                      ? 'bg-cyan-500/25 border border-cyan-400/50 text-cyan-200 shadow-sm'
                      : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  {stream}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Level 3: Subject Selection */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span>Select Subject:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {availableSubjects.map((sub) => (
              <button
                key={sub}
                onClick={() => {
                  setSelectedSubject(sub);
                  setSelectedTopicTag(null);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedSubject === sub
                    ? 'bg-white text-slate-950 shadow-md font-extrabold'
                    : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Directory Content Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400 px-1">
        <div className="flex items-center gap-2">
          <span>
            Showing <strong className="text-white">{displayedChapters.length}</strong> official chapters
            {totalSubtopicsCount > 0 && (
              <> with <strong className="text-white">{totalSubtopicsCount}</strong> detailed subtopics</>
            )}
          </span>
          {selectedTopicTag && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px]">
              <Tag className="w-3 h-3" />
              <span>Tag: {selectedTopicTag}</span>
              <button
                type="button"
                onClick={() => setSelectedTopicTag(null)}
                className="hover:text-white ml-1 font-bold"
              >
                ✕
              </button>
            </span>
          )}
        </div>
        <div className="text-[11px] font-mono text-slate-500">
          CBSE / NCERT 2026–27 Edition &bull; High-Yield Topper Notes
        </div>
      </div>

      {/* Chapter Cards Grid */}
      {displayedChapters.length === 0 ? (
        <div className="astra-card rounded-3xl p-12 text-center border border-white/10 space-y-4 bg-slate-950/60">
          <BookOpen className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No chapters match your filter criteria</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try adjusting your search query, or select a different subject or class grade.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedTopicTag(null);
            }}
            className="px-4 py-2 bg-amber-400 text-slate-950 rounded-xl text-xs font-bold hover:bg-amber-300 transition cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedChapters.map((chapter) => (
            <div
              key={chapter.id}
              className="astra-card rounded-2xl p-5 border border-white/10 bg-slate-950/75 hover:border-amber-400/50 hover:bg-slate-900/90 transition-all duration-200 flex flex-col justify-between group shadow-lg"
            >
              <div className="space-y-3.5">
                {/* Card Top: Unit & Weightage Badges */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2 py-0.5 rounded-md bg-white/5 border border-white/5 truncate">
                    {chapter.unit}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {chapter.weightage.includes('High') ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        <Flame className="w-3 h-3 text-rose-400" />
                        <span>High-Yield</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Core NCERT</span>
                      </span>
                    )}
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {chapter.predictiveLikelihood}% Exam Prob
                    </span>
                  </div>
                </div>

                {/* Chapter Title */}
                <div>
                  <div className="text-[11px] font-mono text-amber-400 font-semibold mb-1">
                    Chapter {chapter.number} &bull; {chapter.subject}
                  </div>
                  <h3 className="text-base font-extrabold text-white group-hover:text-amber-300 transition-colors tracking-tight leading-snug">
                    {chapter.title}
                  </h3>
                </div>

                {/* All Key Topics / Subtopics */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                    <Tag className="w-3 h-3 text-slate-500" />
                    <span>Included Topics &amp; Subtopics:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 pr-1">
                    {chapter.keyTopics.map((topic, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTopicTag(topic);
                        }}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 hover:bg-amber-400/20 hover:text-amber-300 text-slate-300 border border-white/5 transition cursor-pointer text-left"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 50-Year PYQ Insights */}
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-[11px] text-slate-300 space-y-1">
                  <div className="text-[10px] font-mono text-cyan-300 font-bold flex items-center justify-between">
                    <span>50-YR PYQ PATTERN (1975–2025):</span>
                    <span className="text-slate-400">{chapter.pyqYears50.length}+ appearances</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {chapter.predictivePatternNote}
                  </p>
                </div>
              </div>

              {/* Action Button: Open Notes */}
              <div className="pt-4 mt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => onSelectChapter(chapter)}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-98"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                  <span>Open Handwritten Study Notes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
