import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  BookOpen, 
  Sparkles, 
  BrainCircuit, 
  Flame, 
  Target
} from 'lucide-react';
import { 
  CHAPTERS_DATABASE, 
  ALL_CLASSES, 
  ALL_SUBJECTS, 
  ChapterInfo 
} from '../data/chaptersData';

interface ChapterDirectoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChapterNotes: (chapter: ChapterInfo) => void;
  onOpenPyqAgent: (chapter: ChapterInfo) => void;
  onOpenPyqTest?: (chapter: ChapterInfo) => void;
  currentTopic: string;
}

export const ChapterDirectoryDrawer: React.FC<ChapterDirectoryDrawerProps> = ({
  isOpen,
  onClose,
  onSelectChapterNotes,
  onOpenPyqAgent,
  onOpenPyqTest,
  currentTopic,
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChapters = useMemo(() => {
    return CHAPTERS_DATABASE.filter((ch) => {
      const matchClass = selectedClass === 'All' || ch.classGrade === selectedClass;
      const matchSubject = selectedSubject === 'All' || ch.subject === selectedSubject;
      const matchSearch =
        !searchQuery.trim() ||
        ch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ch.keySubtopics.some((sub) => sub.toLowerCase().includes(searchQuery.toLowerCase())) ||
        ch.classGrade.toLowerCase().includes(searchQuery.toLowerCase());

      return matchClass && matchSubject && matchSearch;
    });
  }, [selectedClass, selectedSubject, searchQuery]);

  if (!isOpen) return null;

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'Physics':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'Chemistry':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Biology':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'Mathematics':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-5 backdrop-blur-xs font-sans-clean overflow-y-auto">
      <div className="w-full max-w-5xl my-6 rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-red-600 via-amber-600 to-indigo-700 p-4 sm:p-5 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md shadow-inner text-white">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                  Complete Syllabus & Chapter Matrix
                </h3>
                <span className="rounded-full bg-amber-400 text-slate-900 text-[10px] font-black uppercase px-2 py-0.5 tracking-wider">
                  Classes 9–12 & Dropper
                </span>
              </div>
              <p className="text-xs text-amber-100 mt-0.5">
                Every chapter mapped with 20–25 years of Board, NEET & JEE PYQ weightage
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-slate-50 border-b border-slate-200 p-3 sm:p-4 space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any chapter or subtopic (e.g. Light, Thermodynamics, Aldehydes, Genetics, Calculus, Rotational Motion)..."
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-100 focus:outline-hidden transition"
            />
          </div>

          {/* Class Filters */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">
              Class / Batch:
            </span>
            <button
              onClick={() => setSelectedClass('All')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                selectedClass === 'All'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Classes ({CHAPTERS_DATABASE.length})
            </button>
            {ALL_CLASSES.map((cls) => {
              const count = CHAPTERS_DATABASE.filter((c) => c.classGrade === cls).length;
              return (
                <button
                  key={cls}
                  onClick={() => setSelectedClass(cls)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                    selectedClass === cls
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cls} ({count})
                </button>
              );
            })}
          </div>

          {/* Subject Filters */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">
              Subject:
            </span>
            <button
              onClick={() => setSelectedSubject('All')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                selectedSubject === 'All'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Subjects
            </button>
            {ALL_SUBJECTS.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-2.5 py-1 rounded-md font-medium transition ${
                  selectedSubject === sub
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {sub}
              </button>
            ))}
            <span className="text-slate-400 ml-auto text-[11px]">
              Showing {filteredChapters.length} chapters
            </span>
          </div>
        </div>

        {/* Chapters Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-[#faf9f5]">
          {filteredChapters.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <BookOpen className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold">No chapters matching your filters</p>
              <p className="text-xs mt-1">Try resetting the class or subject filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredChapters.map((chapter) => {
                const isActive = currentTopic.toLowerCase().includes(chapter.name.toLowerCase());
                return (
                  <div
                    key={chapter.id}
                    className={`rounded-2xl border p-4 bg-white transition shadow-xs hover:shadow-md flex flex-col justify-between ${
                      isActive
                        ? 'border-red-500 ring-2 ring-red-200 bg-red-50/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getSubjectColor(
                              chapter.subject
                            )}`}
                          >
                            {chapter.subject}
                          </span>
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[10px] font-semibold">
                            {chapter.classGrade}
                          </span>
                        </div>
                        <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                          <Flame className="h-2.5 w-2.5 text-amber-600" />
                          {chapter.weightage}
                        </span>
                      </div>

                      {/* Chapter Title */}
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {chapter.name}
                      </h4>

                      {/* PYQ Exam Frequency */}
                      <p className="text-xs text-slate-600 mt-1.5 font-medium leading-relaxed">
                        📊 <strong className="text-slate-800 font-semibold">25-Yr Trend:</strong>{' '}
                        {chapter.examFrequency}
                      </p>

                      {/* Years Featured */}
                      <div className="mt-2 flex flex-wrap items-center gap-1 text-[10px]">
                        <span className="text-slate-400 font-medium">PYQ Years:</span>
                        {chapter.pyqYearsFeatured.slice(0, 6).map((yr) => (
                          <span
                            key={yr}
                            className="bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-mono text-[9px]"
                          >
                            '{yr.slice(-2)}
                          </span>
                        ))}
                        {chapter.pyqYearsFeatured.length > 6 && (
                          <span className="text-slate-400 text-[9px]">
                            +{chapter.pyqYearsFeatured.length - 6} more
                          </span>
                        )}
                      </div>

                      {/* Subtopics pill cloud */}
                      <div className="mt-2.5 flex flex-wrap gap-1">
                        {chapter.keySubtopics.slice(0, 4).map((sub, sIdx) => (
                          <span
                            key={sIdx}
                            className="bg-slate-50 border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded text-[10px]"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
                      <button
                        onClick={() => {
                          onOpenPyqAgent(chapter);
                          onClose();
                        }}
                        className="flex-1 flex items-center justify-center gap-1 rounded-xl border border-indigo-200 bg-indigo-50/80 px-2 py-2 text-xs font-semibold text-indigo-900 hover:bg-indigo-100 transition"
                      >
                        <BrainCircuit className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                        <span>PYQ Guru</span>
                      </button>

                      {onOpenPyqTest && (
                        <button
                          onClick={() => {
                            onOpenPyqTest(chapter);
                            onClose();
                          }}
                          className="flex-1 flex items-center justify-center gap-1 rounded-xl border border-emerald-300 bg-emerald-50/80 px-2 py-2 text-xs font-semibold text-emerald-950 hover:bg-emerald-100 transition"
                        >
                          <Target className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span>Take Test</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          onSelectChapterNotes(chapter);
                          onClose();
                        }}
                        className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 px-2 py-2 text-xs font-semibold text-white shadow hover:from-red-700 hover:to-amber-700 transition"
                      >
                        <Sparkles className="h-3.5 w-3.5 shrink-0" />
                        <span>Notes</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
