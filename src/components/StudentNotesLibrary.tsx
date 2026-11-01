import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Trash2, 
  Eye, 
  Printer, 
  Sparkles, 
  Calendar, 
  User, 
  Tag, 
  ArrowRight, 
  Share2, 
  FileText, 
  CheckCircle2, 
  HardDrive,
  BarChart3,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Circle,
  Award,
  Bookmark
} from 'lucide-react';
import { StudyNote, NoteContentPayload, HandwritingStyleConfig } from '../types';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { NCERT_SYLLABUS, NCERTChapterItem } from '../data/ncertSyllabus';

interface StudentNotesLibraryProps {
  notes: StudyNote[];
  currentUserId?: string;
  isAdmin?: boolean;
  onSelectNote: (note: StudyNote) => void;
  onDeleteNote?: (noteId: string) => void;
  onNewNoteClick?: () => void;
  onSynthesizeChapter?: (classGrade: string, subject: string, chapter: string) => void;
}

export const StudentNotesLibrary: React.FC<StudentNotesLibraryProps> = ({
  notes,
  currentUserId,
  isAdmin = false,
  onSelectNote,
  onDeleteNote,
  onNewNoteClick,
  onSynthesizeChapter,
}) => {
  const isOnline = useOnlineStatus();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [viewFilter, setViewFilter] = useState<'all' | 'curriculum' | 'mine' | 'favorites'>('all');
  const [showChapterChecklist, setShowChapterChecklist] = useState<boolean>(false);

  // Favorite / Bookmarked Notes set
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('bb_favorite_note_ids');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const toggleFavorite = (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoriteIds(prev => {
      const next = new Set(prev);
      if (next.has(noteId)) {
        next.delete(noteId);
      } else {
        next.add(noteId);
      }
      try {
        localStorage.setItem('bb_favorite_note_ids', JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
  };

  const isCurriculum = (n: StudyNote) => {
    return (
      n.userId === 'official_curriculum' ||
      n.userId === 'faculty' ||
      n.id.startsWith('curated_') ||
      n.id.startsWith('seed_') ||
      n.userName === 'NCERT Faculty' ||
      n.userName === 'Official Curriculum' ||
      n.userName === 'Buzzing Brain Faculty'
    );
  };

  const classes = ['All', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
  const subjects = ['All', 'Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Social Science'];

  // Determine effective class for curriculum calculations (default to Class 10 if 'All' selected)
  const effectiveClass = selectedClass !== 'All' ? selectedClass : 'Class 10';
  const classSyllabus = NCERT_SYLLABUS[effectiveClass] || {};
  const availableClassSubjects = Object.keys(classSyllabus);

  // Notes to consider (respecting viewFilter: 'all' vs 'curriculum' vs 'mine' vs 'favorites')
  const relevantNotes = viewFilter === 'mine' && currentUserId
    ? notes.filter(n => n.userId === currentUserId && !isCurriculum(n))
    : viewFilter === 'curriculum'
    ? notes.filter(n => isCurriculum(n))
    : viewFilter === 'favorites'
    ? notes.filter(n => favoriteIds.has(n.id))
    : notes;

  interface SubjectCoverageInfo {
    subject: string;
    totalChapters: number;
    coveredChapters: NCERTChapterItem[];
    uncoveredChapters: NCERTChapterItem[];
    coveredCount: number;
    percentage: number;
  }

  const subjectCoverageMap: Record<string, SubjectCoverageInfo> = {};

  availableClassSubjects.forEach((subName) => {
    const chapters = classSyllabus[subName] || [];
    const coveredList: NCERTChapterItem[] = [];
    const uncoveredList: NCERTChapterItem[] = [];

    chapters.forEach((ch) => {
      const hasNote = relevantNotes.some((n) => {
        // Class check
        const classMatches = n.classGrade === effectiveClass || n.classGrade.includes(effectiveClass.replace('Class ', ''));
        if (!classMatches) return false;

        // Subject check
        const subjectMatches = 
          n.subject.toLowerCase() === subName.toLowerCase() ||
          n.subject.toLowerCase().includes(subName.toLowerCase()) ||
          subName.toLowerCase().includes(n.subject.toLowerCase());
        if (!subjectMatches) return false;

        // Chapter / Topic check
        const chNameLow = ch.name.toLowerCase();
        const noteChLow = (n.chapter || '').toLowerCase();
        const noteTitleLow = (n.title || '').toLowerCase();
        const noteTopicLow = (n.topic || '').toLowerCase();

        return (
          noteChLow.includes(chNameLow) ||
          chNameLow.includes(noteChLow) ||
          noteTitleLow.includes(chNameLow) ||
          noteTopicLow.includes(chNameLow) ||
          ch.keyTopics.some(t => {
            const tLow = t.toLowerCase();
            return noteChLow.includes(tLow) || noteTopicLow.includes(tLow) || noteTitleLow.includes(tLow);
          })
        );
      });

      if (hasNote) {
        coveredList.push(ch);
      } else {
        uncoveredList.push(ch);
      }
    });

    const coveredCount = coveredList.length;
    const totalCount = chapters.length;
    const percentage = totalCount > 0 ? Math.round((coveredCount / totalCount) * 100) : 0;

    subjectCoverageMap[subName] = {
      subject: subName,
      totalChapters: totalCount,
      coveredChapters: coveredList,
      uncoveredChapters: uncoveredList,
      coveredCount,
      percentage,
    };
  });

  // Calculate scoped active metrics based on selectedSubject
  let activeCoverage: {
    title: string;
    coveredCount: number;
    totalCount: number;
    percentage: number;
    coveredChapters: NCERTChapterItem[];
    uncoveredChapters: NCERTChapterItem[];
  };

  if (selectedSubject !== 'All' && subjectCoverageMap[selectedSubject]) {
    const info = subjectCoverageMap[selectedSubject];
    activeCoverage = {
      title: `${selectedSubject} (${effectiveClass})`,
      coveredCount: info.coveredCount,
      totalCount: info.totalChapters,
      percentage: info.percentage,
      coveredChapters: info.coveredChapters,
      uncoveredChapters: info.uncoveredChapters,
    };
  } else {
    let totalAll = 0;
    let coveredAll = 0;
    const allCovered: NCERTChapterItem[] = [];
    const allUncovered: NCERTChapterItem[] = [];

    Object.values(subjectCoverageMap).forEach(info => {
      totalAll += info.totalChapters;
      coveredAll += info.coveredCount;
      allCovered.push(...info.coveredChapters);
      allUncovered.push(...info.uncoveredChapters);
    });

    activeCoverage = {
      title: selectedClass !== 'All' ? `${effectiveClass} All Subjects` : 'Class 10 Core Syllabus',
      coveredCount: coveredAll,
      totalCount: totalAll,
      percentage: totalAll > 0 ? Math.round((coveredAll / totalAll) * 100) : 0,
      coveredChapters: allCovered,
      uncoveredChapters: allUncovered,
    };
  }

  const filteredNotes = notes.filter((n) => {
    // Search query
    const queryMatch = 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.topic && n.topic.toLowerCase().includes(searchQuery.toLowerCase())) ||
      n.subject.toLowerCase().includes(searchQuery.toLowerCase());

    if (!queryMatch) return false;

    // Class filter
    if (selectedClass !== 'All' && n.classGrade !== selectedClass) return false;

    // Subject filter
    if (selectedSubject !== 'All' && !n.subject.toLowerCase().includes(selectedSubject.toLowerCase())) return false;

    // Mine vs All filter
    if (viewFilter === 'mine' && n.userId !== currentUserId) return false;

    return true;
  });

  return (
    <div className="w-full max-w-6xl mx-auto py-4 space-y-6">
      {/* Library Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Open Student Study Repository</span>
            </div>
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
              isOnline 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
            }`}>
              <HardDrive className="w-3 h-3" />
              <span>{isOnline ? 'PWA & Cloud Synchronized' : 'Offline Mode — Local Notes Active'}</span>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Buzzing Brain &bull; Handwritten Notes Library
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Browse and read authentic study notes synthesized by students across Class 9, 10, 11, and 12 (Cached for offline review).
          </p>
        </div>

        {onNewNoteClick && (
          <button
            onClick={onNewNoteClick}
            className="px-5 py-2.5 bg-white hover:bg-slate-200 text-slate-950 font-bold rounded-2xl text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Synthesize New Note</span>
          </button>
        )}
      </div>

      {/* Search & Filter Controls */}
      <div className="astra-card border border-white/10 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by chapter, topic, formula, or subject..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Toggle All vs Verified NCERT vs Mine vs Favorites */}
          <div className="flex flex-wrap bg-white/5 p-1 rounded-xl text-xs font-medium text-slate-400 self-start sm:self-auto border border-white/5 gap-1">
            <button
              onClick={() => setViewFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${viewFilter === 'all' ? 'bg-white/20 text-white shadow-2xs font-bold' : 'hover:text-white'}`}
            >
              All Notes ({notes.length})
            </button>
            <button
              onClick={() => setViewFilter('curriculum')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${viewFilter === 'curriculum' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-2xs font-bold' : 'hover:text-white'}`}
            >
              Verified NCERT
            </button>
            <button
              onClick={() => setViewFilter('mine')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${viewFilter === 'mine' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-2xs font-bold' : 'hover:text-white'}`}
            >
              My Notes ({notes.filter(n => n.userId === currentUserId && !isCurriculum(n)).length})
            </button>
            <button
              onClick={() => setViewFilter('favorites')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${viewFilter === 'favorites' ? 'bg-amber-400 text-slate-950 font-bold shadow-2xs' : 'hover:text-white'}`}
            >
              Favorites ({notes.filter(n => favoriteIds.has(n.id)).length})
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5 text-xs">
          <span className="font-semibold text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Class:</span>
          </span>
          {classes.map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedClass === cls
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {cls}
            </button>
          ))}

          <span className="text-white/20 mx-1">|</span>

          <span className="font-semibold text-slate-400">Subject:</span>
          {subjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedSubject === sub
                  ? 'bg-white text-slate-950 font-bold'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Curriculum Note Progress Tracker */}
      <div className="astra-card border border-white/10 rounded-2xl p-5 shadow-xl bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950/90 relative overflow-hidden">
        {/* Ambient background glow */}
        <div 
          className="absolute -right-20 -top-20 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{
            background: activeCoverage.percentage >= 75 
              ? 'radial-gradient(circle, #10b981, transparent)' 
              : activeCoverage.percentage >= 40 
                ? 'radial-gradient(circle, #f59e0b, transparent)' 
                : 'radial-gradient(circle, #6366f1, transparent)'
          }}
        />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
          {/* Left: Metric highlights */}
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-400/10 text-amber-300 border border-amber-400/20 flex items-center gap-1">
                <BarChart3 className="w-3 h-3 text-amber-400" />
                NCERT 2026–27 Syllabus Coverage Tracker
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {viewFilter === 'mine' ? '• Personal Notes' : '• Community Library'}
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {activeCoverage.title} Note Coverage
              </h3>
              <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono tracking-tight">
                {activeCoverage.percentage}%
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300">
              <strong className="text-white font-semibold">{activeCoverage.coveredCount} of {activeCoverage.totalCount} chapters</strong> synthesized into verified handwritten notes 
              {activeCoverage.totalCount - activeCoverage.coveredCount > 0 && (
                <span className="text-slate-400 font-normal"> &bull; {activeCoverage.totalCount - activeCoverage.coveredCount} chapters pending</span>
              )}
            </p>
          </div>

          {/* Right: Checklist toggle */}
          <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-end">
            <button
              onClick={() => setShowChapterChecklist(!showChapterChecklist)}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-semibold text-white transition-all flex items-center gap-2 cursor-pointer active:scale-95 shadow-xs"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>{showChapterChecklist ? 'Hide Chapter Checklist' : 'View Chapter Checklist'}</span>
              {showChapterChecklist ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
            </button>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="mt-4 space-y-1.5 relative z-10">
          <div 
            className="w-full bg-slate-950/80 rounded-full h-3.5 p-0.5 border border-white/10 overflow-hidden relative shadow-inner"
            role="progressbar"
            aria-valuenow={activeCoverage.percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${activeCoverage.title} note completion progress`}
          >
            <div 
              className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 transition-all duration-700 ease-out relative shadow-sm"
              style={{ width: `${Math.max(activeCoverage.percentage, 3)}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
            </div>
          </div>

          {/* Scale benchmarks */}
          <div className="flex justify-between text-[10px] text-slate-400 font-mono px-0.5">
            <span>0% (Start)</span>
            <span>25% (Foundation)</span>
            <span>50% (Mid-Term)</span>
            <span>75% (Exam Ready)</span>
            <span className="text-emerald-400 font-bold">100% (Complete)</span>
          </div>
        </div>

        {/* Per-Subject Progress Pills */}
        <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center gap-2 relative z-10">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            <span>Subject Breakdown ({effectiveClass}):</span>
          </span>

          {availableClassSubjects.map((subName) => {
            const subInfo = subjectCoverageMap[subName];
            if (!subInfo) return null;
            const isSelected = selectedSubject === subName;

            return (
              <button
                key={subName}
                onClick={() => setSelectedSubject(isSelected ? 'All' : subName)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 border cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold shadow-md shadow-amber-400/20'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                }`}
                title={`Filter library to ${subName} (${subInfo.coveredCount}/${subInfo.totalChapters} chapters)`}
              >
                <span>{subName}</span>
                <span className={`px-1.5 py-0.2 rounded-md font-mono text-[10px] font-bold ${
                  isSelected ? 'bg-slate-950 text-amber-400' : 'bg-white/10 text-slate-200'
                }`}>
                  {subInfo.percentage}%
                </span>
                {subInfo.percentage === 100 && (
                  <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-emerald-400'}`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Expanded Chapter Coverage Checklist */}
        {showChapterChecklist && (
          <div className="mt-5 pt-4 border-t border-white/10 space-y-3 relative z-10 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>Chapter-by-Chapter Curriculum Status for {activeCoverage.title}</span>
              </h4>
              <span className="text-[11px] text-slate-400">
                {activeCoverage.coveredCount} completed &bull; {activeCoverage.totalCount - activeCoverage.coveredCount} remaining
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-80 overflow-y-auto pr-1">
              {(selectedSubject !== 'All' 
                ? (classSyllabus[selectedSubject] || []) 
                : Object.values(classSyllabus).flat()
              ).map((chapterItem, idx) => {
                const isCovered = activeCoverage.coveredChapters.some(c => c.name === chapterItem.name || c.number === chapterItem.number);
                
                return (
                  <div
                    key={`${chapterItem.number}-${chapterItem.name}-${idx}`}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 transition-colors ${
                      isCovered
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-100'
                        : 'bg-slate-950/40 border-white/5 text-slate-300 hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-start gap-2 min-w-0">
                      {isCovered ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                      )}
                      <div className="truncate">
                        <div className="font-semibold text-white truncate text-xs">
                          {chapterItem.number ? `Ch ${chapterItem.number}: ` : ''}{chapterItem.name}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {chapterItem.unit || (isCovered ? 'Handwritten Note Ready' : 'Pending Synthesis')}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isCovered ? (
                        <button
                          onClick={() => {
                            setSearchQuery(chapterItem.name);
                            window.scrollTo({ top: 400, behavior: 'smooth' });
                          }}
                          className="px-2 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-lg text-[10px] font-bold transition cursor-pointer"
                        >
                          View Note
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            if (onSynthesizeChapter) {
                              onSynthesizeChapter(effectiveClass, selectedSubject !== 'All' ? selectedSubject : 'Science', chapterItem.name);
                            } else if (onNewNoteClick) {
                              onNewNoteClick();
                            }
                          }}
                          className="px-2 py-1 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/30 rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          <span>Synthesize</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-12 astra-card border border-white/10 rounded-3xl p-8 space-y-4">
          <FileText className="w-12 h-12 text-amber-400/60 mx-auto" />
          <h3 className="text-lg font-bold text-white">No saved study notes found in this view</h3>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            {searchQuery 
              ? `No notes match "${searchQuery}". Try clearing your search query or subject filters.`
              : 'Save notes from the Handwritten Note Studio or browse chapters in the NCERT Books section to generate notes instantly!'}
          </p>
          {onNewNoteClick && (
            <button
              onClick={onNewNoteClick}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md inline-flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Synthesize Notes Now</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => {
            const isOwner = currentUserId === note.userId;
            let parsedStyle: HandwritingStyleConfig = {
              penType: 'gel-pen',
              inkColor: 'royal-blue',
              paperType: 'ruled-notebook',
              fontFamily: 'Kalam',
              fontSize: 20,
              slantAngle: 0.3,
              inkPressure: 'medium',
              highlightColor: 'yellow',
              showMarginLine: true,
              showHoles: true,
            };
            try {
              if (note.styleConfig) {
                parsedStyle = JSON.parse(note.styleConfig);
              }
            } catch (e) {
              // fallback
            }

            return (
              <div
                key={note.id}
                className="bg-white border-2 border-slate-200 hover:border-amber-400 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Notebook Top Spiral Simulation */}
                <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shrink-0"></span>
                    <span className="font-semibold text-slate-700">{note.classGrade}</span>
                    <span>&bull;</span>
                    <span className="text-slate-600 truncate">{note.subject}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {isCurriculum(note) ? (
                      <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 font-sans font-bold flex items-center gap-1" title="Rationalised NCERT Curriculum Verified">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>NCERT Verified</span>
                      </span>
                    ) : (
                      <span className="text-[10px] bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200 font-sans font-medium">
                        Personal
                      </span>
                    )}
                    <button
                      onClick={(e) => toggleFavorite(note.id, e)}
                      className={`p-1 rounded hover:bg-slate-200 transition-colors cursor-pointer ${
                        favoriteIds.has(note.id) ? 'text-amber-500' : 'text-slate-400'
                      }`}
                      title={favoriteIds.has(note.id) ? 'Bookmarked' : 'Add to bookmarks'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${favoriteIds.has(note.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Notebook Paper Preview Card Body */}
                <div 
                  onClick={() => onSelectNote(note)}
                  className="p-5 cursor-pointer flex-1 relative bg-[#fdfdfc] hover:bg-amber-50/20 transition-colors"
                  style={{
                    backgroundImage: 'linear-gradient(#f1f5f9 1px, transparent 1px)',
                    backgroundSize: '100% 28px',
                    backgroundPosition: '0 10px',
                  }}
                >
                  <h3 
                    className="text-xl font-bold text-slate-900 mb-1 group-hover:text-amber-900 transition-colors line-clamp-2"
                    style={{ fontFamily: `"${parsedStyle.fontFamily || 'Kalam'}", cursive` }}
                  >
                    {note.title}
                  </h3>

                  <div className="text-xs text-slate-600 font-sans mt-2 space-y-1">
                    <div>
                      <strong>Chapter:</strong> {note.chapter}
                    </div>
                    {note.topic && (
                      <div className="line-clamp-1">
                        <strong>Topic:</strong> {note.topic}
                      </div>
                    )}
                  </div>

                  {note.commandUsed && (
                    <div className="mt-3 text-[11px] font-mono text-slate-500 bg-slate-100/80 p-1.5 rounded truncate border border-slate-200">
                      {note.commandUsed}
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="px-4 py-3 bg-white border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate max-w-[100px]">{note.userName || 'Student'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {(isOwner || isAdmin) && onDeleteNote && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Delete this handwritten note?')) {
                            onDeleteNote(note.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors rounded hover:bg-rose-50"
                        title="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => onSelectNote(note)}
                      className="flex items-center gap-1 text-amber-700 hover:text-amber-800 font-semibold px-2 py-1 rounded-md hover:bg-amber-50 transition-colors"
                    >
                      <span>Read</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
