import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, 
  X, 
  BookOpen, 
  FlaskConical, 
  Heart, 
  Award, 
  FileText, 
  Clock, 
  ArrowRight, 
  Sliders,
  Sparkles,
  CheckCircle2,
  CornerDownLeft
} from 'lucide-react';
import { NCERT_SYLLABUS } from '../data/ncertSyllabus';
import { NavTab } from './Navbar';

export interface SearchResultItem {
  id: string;
  title: string;
  category: 'curriculum' | 'practical' | 'organ3d' | 'test' | 'notes';
  classGrade: string;
  subject: string;
  subtitle?: string;
  targetTab: NavTab;
  targetSubTab?: string;
  command?: string;
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: NavTab, subTab?: string, command?: string) => void;
  activeClass: string;
}

const RECENT_SEARCHES_KEY = 'buzzing_brain_recent_searches';

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  activeClass,
}) => {
  const [query, setQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'curriculum' | 'practical' | 'test' | 'notes'>('all');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return ['Chemical Reactions', 'Ohm\'s Law', 'Human Heart', 'Life Processes'];
  });
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input automatically on modal open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Global keydown listener for ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Build searchable index from NCERT Syllabus, 3D Practicals & Tests
  const searchableCatalog = useMemo<SearchResultItem[]>(() => {
    const catalog: SearchResultItem[] = [];

    // 1. Syllabus Chapters
    Object.entries(NCERT_SYLLABUS).forEach(([cls, subjects]) => {
      Object.entries(subjects).forEach(([subj, chapters]) => {
        (chapters as any[]).forEach((ch) => {
          catalog.push({
            id: `ch_${cls}_${subj}_${ch.id || ch.name}`,
            title: ch.name,
            category: 'curriculum',
            classGrade: cls,
            subject: subj,
            subtitle: `NCERT Standard ${cls} • ${subj} (${ch.periods || 'Core'} Units)`,
            targetTab: 'syllabus',
            command: `/handwriting ${cls} ${subj} ${ch.name}`,
          });

          // Also index as Notes & Test targets
          catalog.push({
            id: `notes_${cls}_${subj}_${ch.name}`,
            title: `${ch.name} - Handwritten Study Register`,
            category: 'notes',
            classGrade: cls,
            subject: subj,
            subtitle: `Authentic Topper Two-Page Notebook • ${cls} ${subj}`,
            targetTab: 'studio',
            command: `/handwriting ${cls} ${subj} ${ch.name}`,
          });

          catalog.push({
            id: `test_${cls}_${subj}_${ch.name}`,
            title: `${ch.name} - Chapter Practice Assessment`,
            category: 'test',
            classGrade: cls,
            subject: subj,
            subtitle: `CBSE / NEET Competency Practice Quiz • ${cls}`,
            targetTab: 'tests',
          });
        });
      });
    });

    // 2. 3D Practical Academy Labs
    const practicals = [
      {
        id: 'prac_ohms_law',
        title: 'Verification of Ohm\'s Law and Metre Bridge Resistance',
        cls: 'Class 10',
        subj: 'Physics',
        subTab: 'virtual_academy',
      },
      {
        id: 'prac_titration',
        title: 'Acid-Base Titration: Standard Oxalic Acid vs NaOH with Indicator',
        cls: 'Class 10',
        subj: 'Chemistry',
        subTab: 'virtual_academy',
      },
      {
        id: 'prac_microscope',
        title: 'Temporary Mount Preparation of Onion Peel & Human Cheek Cells',
        cls: 'Class 9',
        subj: 'Biology',
        subTab: 'virtual_academy',
      },
    ];

    practicals.forEach((p) => {
      catalog.push({
        id: p.id,
        title: p.title,
        category: 'practical',
        classGrade: p.cls,
        subject: p.subj,
        subtitle: `3D Multi-Stage Practical Academy & Observation Log • ${p.cls}`,
        targetTab: 'practicals',
        targetSubTab: p.subTab,
      });
    });

    // 3. 3D Anatomical Organs
    const organs = [
      { name: 'Human Heart (Four-Chambered Cardiovascular Circulation)', cls: 'Class 10' },
      { name: 'Nephron & Kidney Filtration Unit', cls: 'Class 10' },
      { name: 'Human Brain & Central Nervous Coordination', cls: 'Class 10' },
      { name: 'Endocrine Pancreas & Islets of Langerhans', cls: 'Class 11' },
      { name: 'Spleen & Lymphatic Immune System', cls: 'Class 11' },
    ];

    organs.forEach((o, idx) => {
      catalog.push({
        id: `organ_${idx}`,
        title: o.name,
        category: 'organ3d',
        classGrade: o.cls,
        subject: 'Biology',
        subtitle: `3D Interactive Anatomical Visualization & Dissection • ${o.cls}`,
        targetTab: 'labs',
        targetSubTab: 'organs3d',
      });
    });

    return catalog;
  }, []);

  // Filter results
  const filteredResults = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return [];

    return searchableCatalog
      .filter((item) => {
        if (selectedFilter !== 'all') {
          if (selectedFilter === 'curriculum' && item.category !== 'curriculum') return false;
          if (selectedFilter === 'practical' && item.category !== 'practical' && item.category !== 'organ3d') return false;
          if (selectedFilter === 'test' && item.category !== 'test') return false;
          if (selectedFilter === 'notes' && item.category !== 'notes') return false;
        }

        const matchTitle = item.title.toLowerCase().includes(cleanQuery);
        const matchSubj = item.subject.toLowerCase().includes(cleanQuery);
        const matchCls = item.classGrade.toLowerCase().includes(cleanQuery);
        const matchSub = item.subtitle?.toLowerCase().includes(cleanQuery);

        return matchTitle || matchSubj || matchCls || matchSub;
      })
      .slice(0, 20); // Top 20 results for fast response
  }, [query, selectedFilter, searchableCatalog]);

  const handleSelectItem = (item: SearchResultItem) => {
    // Save to recent searches
    if (query.trim()) {
      const updated = [query.trim(), ...recentSearches.filter((s) => s.toLowerCase() !== query.trim().toLowerCase())].slice(0, 6);
      setRecentSearches(updated);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {}
    }

    onNavigate(item.targetTab, item.targetSubTab, item.command);
    onClose();
  };

  const handleSelectRecent = (term: string) => {
    setQuery(term);
  };

  if (!isOpen) return null;

  const getCategoryBadge = (category: SearchResultItem['category']) => {
    switch (category) {
      case 'curriculum':
        return <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold border border-blue-500/30">Syllabus</span>;
      case 'practical':
        return <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold border border-purple-500/30">3D Lab</span>;
      case 'organ3d':
        return <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono text-[10px] font-bold border border-rose-500/30">3D Organ</span>;
      case 'test':
        return <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/30">Practice Test</span>;
      case 'notes':
        return <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">Notes Studio</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      <div className="relative w-full max-w-2xl bg-slate-950 border border-white/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-100 z-10 animate-in zoom-in-95 duration-200">
        {/* Search Bar Input */}
        <div className="flex items-center px-5 py-4 border-b border-white/10 bg-slate-900/60 gap-3">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chapters, formulas, 3D practicals, notes, or tests... (e.g. Photosynthesis, Ohm's Law)"
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder:text-slate-500 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-white/5 border border-white/10 rounded-md">
              ESC
            </kbd>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 px-5 py-2.5 border-b border-white/5 bg-slate-950/80 overflow-x-auto text-xs scrollbar-none">
          {[
            { id: 'all', label: 'All Content' },
            { id: 'curriculum', label: 'Curriculum' },
            { id: 'notes', label: 'Handwritten Notes' },
            { id: 'practical', label: '3D Labs & Organs' },
            { id: 'test', label: 'Tests & Quizzes' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id as any)}
              className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer shrink-0 text-xs ${
                selectedFilter === f.id
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Results / Empty / Recent Searches View */}
        <div className="max-h-[420px] overflow-y-auto divide-y divide-white/5 scrollbar-thin scrollbar-thumb-white/10 p-2">
          {query.trim().length === 0 ? (
            <div className="p-4 space-y-4">
              <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Popular &amp; Recent Academic Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSelectRecent(term)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <Search className="w-3 h-3 text-slate-500" />
                    <span>{term}</span>
                  </button>
                ))}
              </div>

              {/* Quick Jump Suggestions */}
              <div className="pt-2">
                <div className="text-xs font-semibold text-slate-400 mb-2">
                  Quick Hub Shortcuts
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => {
                      onNavigate('practicals');
                      onClose();
                    }}
                    className="p-3 rounded-2xl bg-gradient-to-br from-purple-950/40 to-slate-900 border border-purple-500/20 hover:border-purple-500/40 text-left transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
                        <FlaskConical className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white">3D Practical Academy</div>
                        <div className="text-[11px] text-slate-400">Ohm's Law, Titration, Cells</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('tests');
                      onClose();
                    }}
                    className="p-3 rounded-2xl bg-gradient-to-br from-amber-950/40 to-slate-900 border border-amber-500/20 hover:border-amber-500/40 text-left transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white">Chapter Assessments</div>
                        <div className="text-[11px] text-slate-400">Class 9–12 Mock Tests</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="py-12 px-6 text-center space-y-3">
              <Search className="w-8 h-8 text-slate-600 mx-auto" />
              <div className="text-sm font-bold text-white">No results found for "{query}"</div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Try searching by topic keyword (e.g., "Electricity", "Light", "Acids", "Genetics") or standard subject names.
              </p>
            </div>
          ) : (
            filteredResults.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelectItem(item)}
                className="p-3 rounded-xl hover:bg-white/5 transition-all flex items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10 shrink-0 group-hover:scale-105 transition-transform">
                    {item.category === 'curriculum' && <BookOpen className="w-4 h-4 text-blue-400" />}
                    {item.category === 'practical' && <FlaskConical className="w-4 h-4 text-purple-400" />}
                    {item.category === 'organ3d' && <Heart className="w-4 h-4 text-rose-400" />}
                    {item.category === 'test' && <Award className="w-4 h-4 text-amber-400" />}
                    {item.category === 'notes' && <FileText className="w-4 h-4 text-emerald-400" />}
                  </div>

                  <div className="min-w-0 text-left">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs sm:text-sm text-white truncate group-hover:text-amber-300 transition-colors">
                        {item.title}
                      </span>
                      {getCategoryBadge(item.category)}
                    </div>
                    {item.subtitle && (
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 text-slate-500 group-hover:text-amber-400 transition-colors text-xs font-semibold">
                  <span className="hidden sm:inline">Jump</span>
                  <CornerDownLeft className="w-3.5 h-3.5" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer Keyboard Guide */}
        <div className="p-3 bg-slate-900/60 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Search across 217+ NCERT Chapters &amp; 3D Practical Academy</span>
          <div className="flex items-center gap-2">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 bg-white/10 rounded border border-white/10 text-white font-bold text-[10px]">ESC</kbd>
            <span>to close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
