import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  ExternalLink, 
  PenTool, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  ChevronRight, 
  Download, 
  GraduationCap, 
  Layers, 
  ArrowRight,
  Bookmark,
  Award,
  Globe,
  Library,
  Flame,
  Info
} from 'lucide-react';
import { NCERT_SYLLABUS, NCERTChapterItem } from '../data/ncertSyllabus';
import { SyllabusPdfViewerModal } from './SyllabusPdfViewerModal';
import { NDLI_EXAM_BOOKS, NdliBookItem } from '../data/ndliExamBooksData';

interface NcertBooksSectionProps {
  onGenerateNotesForChapter: (classGrade: string, subject: string, chapter: string) => void;
}

export const NcertBooksSection: React.FC<NcertBooksSectionProps> = ({
  onGenerateNotesForChapter,
}) => {
  // Top Navigation Mode: 'ndli_books' | 'ncert_chapters'
  const [activeSectionTab, setActiveSectionTab] = useState<'ndli_books' | 'ncert_chapters'>('ndli_books');

  // NDLI Real Books Filters
  const [selectedExamFilter, setSelectedExamFilter] = useState<string>('All');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('All');
  const [bookSearchQuery, setBookSearchQuery] = useState<string>('');
  const [selectedBookModal, setSelectedBookModal] = useState<NdliBookItem | null>(null);

  // NCERT Chapter Syllabus Filters
  const [selectedClass, setSelectedClass] = useState<string>('Class 10');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSyllabusPdfModal, setShowSyllabusPdfModal] = useState(false);
  const [activeChapterModal, setActiveChapterModal] = useState<{
    chapter: NCERTChapterItem;
    classGrade: string;
    subject: string;
  } | null>(null);

  const classes = ['Class 9', 'Class 10', 'Class 11', 'Class 12'];
  const classData = NCERT_SYLLABUS[selectedClass] || {};
  const availableSubjects = Object.keys(classData);

  // Filtered chapters for NCERT view
  const getSubjectList = () => {
    if (selectedSubject !== 'All') {
      return availableSubjects.filter(s => s.toLowerCase() === selectedSubject.toLowerCase());
    }
    return availableSubjects;
  };

  // Filtered NDLI Books
  const filteredNdliBooks = useMemo(() => {
    return NDLI_EXAM_BOOKS.filter(book => {
      const matchExam = selectedExamFilter === 'All' || book.examCategory === selectedExamFilter;
      const matchSubject = selectedSubjectFilter === 'All' || book.subject.toLowerCase() === selectedSubjectFilter.toLowerCase();
      const matchSearch = !bookSearchQuery.trim() || 
        book.title.toLowerCase().includes(bookSearchQuery.toLowerCase()) ||
        book.authors.toLowerCase().includes(bookSearchQuery.toLowerCase()) ||
        book.description.toLowerCase().includes(bookSearchQuery.toLowerCase()) ||
        book.syllabusHighlights.some(h => h.toLowerCase().includes(bookSearchQuery.toLowerCase()));
      return matchExam && matchSubject && matchSearch;
    });
  }, [selectedExamFilter, selectedSubjectFilter, bookSearchQuery]);

  return (
    <div className="w-full max-w-6xl mx-auto py-6 space-y-6">
      {/* 1. Header Banner - National Digital Library of India (IIT Kharagpur) Integration */}
      <div className="astra-card rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden bg-gradient-to-r from-slate-950 via-[#0a1128] to-[#071330]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
              <Globe className="w-3.5 h-3.5" />
              <span>National Digital Library of India (NDLI) &bull; IIT Kharagpur</span>
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
              Ministry of Education, Govt. of India
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Real Exam Reference Books &amp; Official National Library
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Access authentic textbooks, solved PYQ archives, and standard reference treatises curated directly from the National Digital Library of India (IIT Kharagpur Hub: <a href="https://ndl.iitkgp.ac.in/ndl_se" target="_blank" rel="noopener noreferrer" className="text-amber-400 font-semibold underline hover:text-amber-300">https://ndl.iitkgp.ac.in/ndl_se</a>). Browse NEET-UG, JEE Main &amp; Advanced, and CBSE Class 9–12 official curricula.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 relative z-10">
          <a
            href="https://ndl.iitkgp.ac.in/ndl_se"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg active:scale-95 cursor-pointer"
          >
            <Library className="w-4 h-4" />
            <span>Open Official NDLI Portal (ndl.iitkgp.ac.in)</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1" />
          </a>

          <button
            type="button"
            onClick={() => setShowSyllabusPdfModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-xl text-xs transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>2026–27 CBSE Syllabus PDF (17 Pages)</span>
          </button>

          <a
            href="https://ncert.nic.in/textbook.php"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900/90 hover:bg-slate-800 border border-white/15 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
            <span>NCERT Direct Portal</span>
          </a>
        </div>

        {/* Verification & Compliance Notice */}
        <div className="mt-4 p-3.5 rounded-2xl bg-slate-950/90 border border-amber-500/20 text-[11px] text-slate-400 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-amber-300">National Repository Compliance: </strong> 
            Buzzing Brain integrates open metadata and authenticated reference links to the National Digital Library of India (maintained by IIT Kharagpur under the National Mission on Education through ICT). All intellectual property rights belong to the respective authors and statutory publishers.
          </p>
        </div>
      </div>

      {/* 2. Top View Switcher (NDLI Real Exam Books vs CBSE Chapter Syllabi) */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSectionTab('ndli_books')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSectionTab === 'ndli_books'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 font-extrabold'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/10'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>NDLI Real Books for Each Exam</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 font-mono">
              {NDLI_EXAM_BOOKS.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSectionTab('ncert_chapters')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSectionTab === 'ncert_chapters'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 font-extrabold'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/10'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>NCERT Chapter Curriculum Browser</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODE 1: NDLI REAL EXAM BOOKS SECTION */}
      {/* ======================================================== */}
      {activeSectionTab === 'ndli_books' && (
        <div className="space-y-6">
          {/* Exam Filters & Search Bar */}
          <div className="p-4 rounded-3xl bg-slate-900/90 border border-white/10 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={bookSearchQuery}
                  onChange={(e) => setBookSearchQuery(e.target.value)}
                  placeholder="Search real books (e.g. 'H.C. Verma', 'Irodov', 'Trueman', 'NCERT Biology', 'M.S. Chouhan', 'Solids')..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-white/10 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Exam Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {['All', 'NEET', 'JEE', 'CBSE', 'CUET'].map((exam) => (
                  <button
                    key={exam}
                    onClick={() => setSelectedExamFilter(exam)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      selectedExamFilter === exam
                        ? 'bg-amber-400 text-slate-950 shadow-sm'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-white/10'
                    }`}
                  >
                    {exam === 'All' ? 'All Exams' : `${exam} Books`}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject Selector Filter */}
            <div className="flex items-center gap-2 overflow-x-auto text-xs text-slate-400 pt-1">
              <span className="font-semibold text-slate-400 shrink-0">Subject:</span>
              {['All', 'Physics', 'Chemistry', 'Biology', 'Mathematics', 'Science'].map((subj) => (
                <button
                  key={subj}
                  onClick={() => setSelectedSubjectFilter(subj)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                    selectedSubjectFilter === subj
                      ? 'bg-white/20 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {subj}
                </button>
              ))}
            </div>
          </div>

          {/* Book Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredNdliBooks.map((book) => (
              <div
                key={book.id}
                className="astra-card rounded-3xl p-5 border border-white/10 hover:border-amber-400/40 transition-all flex flex-col justify-between group bg-slate-900/60 shadow-xl"
              >
                <div className="space-y-3">
                  {/* Book Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400/10 text-amber-300 border border-amber-400/30">
                      {book.examCategory} Exam
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                      {book.classGrade} &bull; {book.chaptersCount} Chapters
                    </span>
                  </div>

                  {/* Book Cover Aesthetic Stripe */}
                  <div className={`h-2 rounded-full bg-gradient-to-r ${book.coverGradient}`} />

                  {/* Title & Authors */}
                  <div>
                    <h3 className="text-base font-extrabold text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      By <strong className="text-slate-300">{book.authors}</strong>
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Publisher: {book.publisher}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {book.description}
                  </p>

                  {/* Syllabus Points Preview */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Exam Topics Covered:
                    </span>
                    <ul className="text-[11px] text-slate-400 space-y-1">
                      {book.syllabusHighlights.slice(0, 2).map((pt, i) => (
                        <li key={i} className="flex items-start gap-1.5 line-clamp-1">
                          <span className="text-amber-400">•</span>
                          <span className="truncate">{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedBookModal(book)}
                    className="text-xs text-slate-300 hover:text-white font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span>View Outline</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <a
                      href={book.ndliUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all text-xs font-semibold flex items-center gap-1"
                      title="Read on National Digital Library of India (IIT Kharagpur)"
                    >
                      <Globe className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="hidden sm:inline">NDLI</span>
                    </a>

                    <button
                      onClick={() => onGenerateNotesForChapter(book.classGrade, book.subject, book.title)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                    >
                      <PenTool className="w-3.5 h-3.5" />
                      <span>Make Notes</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredNdliBooks.length === 0 && (
            <div className="p-8 text-center rounded-3xl bg-slate-900/60 border border-white/10 space-y-2">
              <BookOpen className="w-8 h-8 text-slate-500 mx-auto" />
              <h4 className="text-white font-bold text-sm">No books found matching filters</h4>
              <p className="text-slate-400 text-xs">
                Try selecting "All Exams" or search for a general keyword like "Physics", "Chemistry", or "NCERT".
              </p>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 2: CBSE CHAPTER CURRICULUM BROWSER (ORIGINAL SECTION) */}
      {/* ======================================================== */}
      {activeSectionTab === 'ncert_chapters' && (
        <div className="space-y-6">
          {/* Class Selector Tabs */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs text-slate-400 font-semibold mr-1">Select Class:</span>
              {classes.map((cls) => (
                <button
                  key={cls}
                  onClick={() => {
                    setSelectedClass(cls);
                    setSelectedSubject('All');
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedClass === cls
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/10 hover:border-white/20'
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>

            {/* Search & Subject Filters */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search chapters, topics, formulas in 2026-27 syllabus..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <button
                  onClick={() => setSelectedSubject('All')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    selectedSubject === 'All'
                      ? 'bg-white/20 text-white font-bold'
                      : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/10'
                  }`}
                >
                  All Subjects
                </button>
                {availableSubjects.map((subj) => (
                  <button
                    key={subj}
                    onClick={() => setSelectedSubject(subj)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      selectedSubject === subj
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/10'
                    }`}
                  >
                    {subj}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Books & Chapters Grid */}
          <div className="space-y-8">
            {getSubjectList().map((subj) => {
              const rawChapters = classData[subj] || [];
              const filteredChapters = rawChapters.filter(ch => {
                if (!searchQuery) return true;
                const q = searchQuery.toLowerCase();
                return (
                  ch.name.toLowerCase().includes(q) ||
                  ch.unit.toLowerCase().includes(q) ||
                  ch.keyTopics.some(t => t.toLowerCase().includes(q))
                );
              });

              if (filteredChapters.length === 0) return null;

              return (
                <div key={subj} className="space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                      <h3 className="text-lg font-bold text-white">
                        {selectedClass} &bull; {subj}
                      </h3>
                      <span className="text-xs text-slate-400">
                        ({filteredChapters.length} Chapters)
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredChapters.map((chapter) => (
                      <div
                        key={chapter.number}
                        className="astra-card astra-card-hover rounded-2xl p-5 transition-all flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                            <span className="font-mono text-amber-400 font-bold">
                              Chapter {chapter.number}
                            </span>
                            <span className="truncate max-w-[150px] text-[11px] bg-white/5 px-2 py-0.5 rounded border border-white/5">
                              {chapter.unit}
                            </span>
                          </div>

                          <h4 className="font-bold text-white text-base group-hover:text-amber-300 transition-colors line-clamp-2">
                            {chapter.name}
                          </h4>

                          <div className="mt-3 space-y-1">
                            <span className="text-[11px] font-semibold text-slate-400 block">Key NCERT Topics:</span>
                            <ul className="text-xs text-slate-400 space-y-1">
                              {chapter.keyTopics.slice(0, 3).map((topic, tIdx) => (
                                <li key={tIdx} className="flex items-start gap-1.5 line-clamp-1">
                                  <span className="text-amber-400/80 leading-none">•</span>
                                  <span className="truncate">{topic}</span>
                                </li>
                              ))}
                              {chapter.keyTopics.length > 3 && (
                                <li className="text-[10px] text-slate-500 italic">
                                  +{chapter.keyTopics.length - 3} more syllabus points
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>

                        <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between gap-2 text-xs">
                          <button
                            onClick={() => setActiveChapterModal({ chapter, classGrade: selectedClass, subject: subj })}
                            className="text-slate-400 hover:text-white font-medium flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Outline</span>
                          </button>

                          <button
                            onClick={() => onGenerateNotesForChapter(selectedClass, subj, chapter.name)}
                            className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
                          >
                            <PenTool className="w-3.5 h-3.5" />
                            <span>Generate Notes</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* NDLI Book Detail Modal */}
      {selectedBookModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="astra-card rounded-3xl max-w-xl w-full p-6 border border-white/20 shadow-2xl space-y-5 bg-slate-950">
            <div className="flex items-start justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-xs font-mono text-amber-400 font-bold uppercase">
                  {selectedBookModal.examCategory} Exam &bull; {selectedBookModal.classGrade} &bull; {selectedBookModal.subject}
                </span>
                <h3 className="text-xl font-extrabold text-white mt-1">
                  {selectedBookModal.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">By {selectedBookModal.authors}</p>
              </div>
              <button
                onClick={() => setSelectedBookModal(null)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedBookModal.description}
            </p>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Exam Curriculum Alignment &amp; High-Yield Units:
              </h4>
              <div className="space-y-1.5">
                {selectedBookModal.syllabusHighlights.map((hl, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-300 flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-amber-400/20 text-amber-300 text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
              <a
                href={selectedBookModal.ndliUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 underline font-medium"
              >
                <Globe className="w-4 h-4" />
                <span>Open on National Digital Library (ndl.iitkgp.ac.in)</span>
              </a>

              <button
                onClick={() => {
                  const b = selectedBookModal;
                  setSelectedBookModal(null);
                  onGenerateNotesForChapter(b.classGrade, b.subject, b.title);
                }}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <PenTool className="w-4 h-4" />
                <span>Generate Handwritten Study Notes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chapter Overview Modal (NCERT View) */}
      {activeChapterModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="astra-card rounded-3xl max-w-lg w-full p-6 border border-white/20 shadow-2xl space-y-4 bg-slate-950">
            <div className="flex items-start justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-xs font-mono text-amber-400 font-bold">
                  {activeChapterModal.classGrade} &bull; {activeChapterModal.subject} &bull; Chapter {activeChapterModal.chapter.number}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  {activeChapterModal.chapter.name}
                </h3>
                <span className="text-xs text-slate-400">Unit: {activeChapterModal.chapter.unit}</span>
              </div>
              <button
                onClick={() => setActiveChapterModal(null)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
                Prescribed NCERT Curriculum Topics:
              </h4>
              <div className="space-y-1.5 max-h-60 overflow-y-auto pr-2">
                {activeChapterModal.chapter.keyTopics.map((topic, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-300 flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-amber-400/20 text-amber-300 text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
              <a
                href="https://ncert.nic.in/textbook.php"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 underline"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in NCERT Portal</span>
              </a>

              <button
                onClick={() => {
                  const modal = activeChapterModal;
                  setActiveChapterModal(null);
                  onGenerateNotesForChapter(modal.classGrade, modal.subject, modal.chapter.name);
                }}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <PenTool className="w-4 h-4" />
                <span>Generate Handwritten Notes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official 2026-27 Syllabus Reference PDF Viewer */}
      <SyllabusPdfViewerModal
        isOpen={showSyllabusPdfModal}
        onClose={() => setShowSyllabusPdfModal(false)}
        initialClass={selectedClass}
        onGenerateForChapter={onGenerateNotesForChapter}
      />
    </div>
  );
};
