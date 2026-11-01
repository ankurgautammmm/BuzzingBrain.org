import React, { useState, useEffect, useMemo } from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  X,
  Target,
  HelpCircle,
  TrendingUp,
  Flame,
  Tag,
  CheckSquare,
  Square
} from 'lucide-react';
import { parseMathInText } from '../utils/latexParser';
import { NCERT_SYLLABUS } from '../data/ncertSyllabus';

interface PyqAgentPanelProps {
  isOpen: boolean;
  onClose: () => void;
  topic: string;
  grade: string;
  subject: string;
  onLoadNotesForChapter: (topic: string, grade: string, subject: string) => void;
  onOpenPyqTest?: () => void;
}

export const PyqAgentPanel: React.FC<PyqAgentPanelProps> = ({
  isOpen,
  onClose,
  topic,
  grade,
  subject,
  onLoadNotesForChapter,
  onOpenPyqTest,
}) => {
  // Target Class comes FIRST (Featuring Droppers!)
  const [selectedClass, setSelectedClass] = useState<string>(() => {
    if (grade.toLowerCase().includes('dropper') || grade.toLowerCase().includes('repeater')) return 'Dropper';
    if (grade.includes('12')) return 'Class 12';
    if (grade.includes('11')) return 'Class 11';
    if (grade.includes('9')) return 'Class 9';
    return 'Class 10';
  });

  const classSubjects = useMemo(() => {
    if (NCERT_SYLLABUS[selectedClass]) {
      return Object.keys(NCERT_SYLLABUS[selectedClass]);
    }
    return ['Physics', 'Chemistry', 'Biology', 'Mathematics'];
  }, [selectedClass]);

  const [selectedSubject, setSelectedSubject] = useState<string>(() => {
    if (classSubjects.includes(subject)) return subject;
    return classSubjects[0] || 'Physics';
  });

  useEffect(() => {
    if (!classSubjects.includes(selectedSubject)) {
      setSelectedSubject(classSubjects[0] || 'Physics');
    }
  }, [classSubjects, selectedSubject]);

  const availableChapters = useMemo(() => {
    return NCERT_SYLLABUS[selectedClass]?.[selectedSubject] || [];
  }, [selectedClass, selectedSubject]);

  const [selectedChapterName, setSelectedChapterName] = useState<string>(() => {
    const match = availableChapters.find(c => c.name.toLowerCase().includes(topic.toLowerCase()) || topic.toLowerCase().includes(c.name.toLowerCase()));
    return match ? match.name : (availableChapters[0]?.name || topic);
  });

  useEffect(() => {
    if (availableChapters.length > 0) {
      const match = availableChapters.find(c => c.name === selectedChapterName);
      if (!match) {
        setSelectedChapterName(availableChapters[0].name);
      }
    }
  }, [availableChapters, selectedChapterName]);

  const activeChapterObj = useMemo(() => {
    return availableChapters.find(c => c.name === selectedChapterName) || availableChapters[0];
  }, [availableChapters, selectedChapterName]);

  const [selectedTopicTag, setSelectedTopicTag] = useState<string>('');

  useEffect(() => {
    if (activeChapterObj?.keyTopics && activeChapterObj.keyTopics.length > 0) {
      setSelectedTopicTag(activeChapterObj.keyTopics[0]);
    } else {
      setSelectedTopicTag(selectedChapterName);
    }
  }, [activeChapterObj, selectedChapterName]);

  const [analysisText, setAnalysisText] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [userQuery, setUserQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'deep_breakdown' | 'ask_agent'>('deep_breakdown');

  // Load default 25-year analysis whenever opened or topic changes
  useEffect(() => {
    if (isOpen && selectedChapterName) {
      fetchAnalysis();
    }
  }, [isOpen, selectedChapterName, selectedClass, selectedSubject, selectedTopicTag]);

  const fetchAnalysis = async (customQuestion?: string) => {
    try {
      setLoading(true);
      const res = await fetch('/api/pyq/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: selectedTopicTag ? `${selectedChapterName} - ${selectedTopicTag}` : selectedChapterName,
          grade: selectedClass,
          subject: selectedSubject,
          query: customQuestion || '',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch PYQ analysis');
      }

      setAnalysisText(data.analysis || '');
    } catch (err: any) {
      setAnalysisText(`⚠️ Error: ${err.message || 'Unable to connect to PYQ AI Agent.'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleSendQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;
    fetchAnalysis(userQuery.trim());
    setUserQuery('');
  };

  const handleCopyAnalysis = () => {
    navigator.clipboard.writeText(analysisText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const QUICK_QUESTIONS = [
    `Which subtopic had the highest question frequency in Boards/NEET/JEE (2000-2025)?`,
    `Explain the step-by-step derivation with exact Board 5-mark rubrics.`,
    `What are the top 3 assertion-reasoning traps examiners set for this chapter?`,
    `Show the fastest elimination shortcut for competitive numericals in 1 minute.`,
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-5 backdrop-blur-xs font-sans-clean overflow-y-auto">
      <div className="w-full max-w-4xl my-6 rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-red-600 via-amber-600 to-indigo-700 p-4 sm:p-5 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md shadow-inner text-white">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                  25-Year PYQ AI Evaluator Agent
                </h3>
                <span className="rounded-full bg-amber-400 text-slate-900 text-[10px] font-black uppercase px-2 py-0.5 tracking-wider">
                  2000 - 2025 Trained
                </span>
              </div>
              <p className="text-xs text-amber-100 flex items-center gap-2 mt-0.5">
                <span>{selectedChapterName}</span>
                <span>•</span>
                <span>{selectedClass}</span>
                <span>•</span>
                <span>{selectedSubject}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAnalysis}
              className="hidden sm:flex items-center gap-1 text-xs bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-lg transition cursor-pointer"
              title="Copy analysis text"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-amber-300" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Class First, Subject & Chapter Selector Bar */}
        <div className="bg-slate-100/90 border-b border-slate-200 px-4 py-2.5 space-y-2 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[11px] text-slate-500 uppercase tracking-wider">Target:</span>
              {['Dropper', 'Class 12', 'Class 11', 'Class 10', 'Class 9'].map(cls => (
                <button
                  key={cls}
                  onClick={() => setSelectedClass(cls)}
                  className={`px-2 py-0.5 rounded-md font-bold text-[11px] transition cursor-pointer ${
                    selectedClass === cls
                      ? cls === 'Dropper'
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {cls === 'Dropper' ? '🔥 Droppers' : cls}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1">
              <span className="font-bold text-[11px] text-slate-500 uppercase tracking-wider">Subject:</span>
              {classSubjects.map(subj => (
                <button
                  key={subj}
                  onClick={() => setSelectedSubject(subj)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                    selectedSubject === subj
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {subj}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-[11px] text-slate-500 uppercase tracking-wider shrink-0">Chapter:</span>
            <select
              value={selectedChapterName}
              onChange={(e) => setSelectedChapterName(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-semibold text-slate-800 w-full max-w-sm focus:outline-hidden"
            >
              {availableChapters.map(ch => (
                <option key={ch.number} value={ch.name}>Ch {ch.number}: {ch.name}</option>
              ))}
            </select>
          </div>

          {/* Topic Tags Multi-Selection Row */}
          {activeChapterObj?.keyTopics && activeChapterObj.keyTopics.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 pt-0.5">
              <span className="font-bold text-[10px] text-slate-500 uppercase tracking-wider shrink-0">Topics:</span>
              {activeChapterObj.keyTopics.map(tName => (
                <button
                  key={tName}
                  onClick={() => setSelectedTopicTag(tName === selectedTopicTag ? '' : tName)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 transition cursor-pointer border ${
                    selectedTopicTag === tName
                      ? 'bg-amber-500 text-slate-950 border-amber-600 font-bold'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {tName}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Tabs & Chapter Link */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setActiveTab('deep_breakdown');
                if (!analysisText && !loading) fetchAnalysis();
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'deep_breakdown'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5" />
              25-Year Exam Blueprint & Explanations
            </button>
            <button
              onClick={() => setActiveTab('ask_agent')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'ask_agent'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <HelpCircle className="h-3.5 w-3.5" />
              Ask PYQ Evaluator
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onOpenPyqTest && (
              <button
                onClick={() => {
                  onOpenPyqTest();
                  onClose();
                }}
                className="flex items-center gap-1.5 font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-100 hover:bg-emerald-200 px-3 py-1 rounded-md transition"
              >
                <Target className="h-3.5 w-3.5 text-emerald-600" />
                Launch PYQ Test
              </button>
            )}

            <button
              onClick={() => {
                onLoadNotesForChapter(topic, grade, subject);
                onClose();
              }}
              className="flex items-center gap-1.5 font-bold text-amber-700 hover:text-amber-900 bg-amber-100 hover:bg-amber-200 px-3 py-1 rounded-md transition"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Open Notes →
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Quick Prompts Bar if on ask_agent tab */}
          {activeTab === 'ask_agent' && (
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1 mb-2">
                <Flame className="h-3 w-3 text-red-500" /> High-Yield Examiner Prompts (Click to Run)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {QUICK_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => fetchAnalysis(q)}
                    className="text-left rounded-lg border border-indigo-200 bg-white p-2 text-indigo-950 hover:bg-indigo-100/70 hover:border-indigo-300 transition text-[11px] font-medium leading-snug"
                  >
                    💬 {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Analysis Output Container */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
              <div className="relative">
                <div className="h-12 w-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
                <BrainCircuit className="h-6 w-6 text-indigo-600 absolute inset-0 m-auto" />
              </div>
              <h4 className="text-base font-bold text-slate-800">
                Consulting 25 Years of Board & Competitive Exam Archives...
              </h4>
              <p className="text-xs text-slate-500 max-w-md">
                Analyzing question frequency from CBSE 2000-2025, NEET 2000-2025, and JEE Main/Advanced. Structuring comprehensive topic explanations and marking rubrics.
              </p>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none text-slate-800 leading-relaxed space-y-3">
              {analysisText ? (
                <div className="space-y-3">
                  {analysisText.split('\n\n').map((paragraph, pIdx) => {
                    const trimmed = paragraph.trim();
                    if (!trimmed) return null;

                    // Header 1 or 2
                    if (trimmed.startsWith('# ') || trimmed.startsWith('## ')) {
                      return (
                        <div key={pIdx} className="pt-3 pb-1 border-b border-slate-200">
                          <h4 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                            <span className="text-indigo-600">✦</span>
                            <span dangerouslySetInnerHTML={{ __html: parseMathInText(trimmed.replace(/^#+\s*/, '')) }} />
                          </h4>
                        </div>
                      );
                    }

                    // Header 3
                    if (trimmed.startsWith('### ')) {
                      return (
                        <h5
                          key={pIdx}
                          className="text-sm sm:text-base font-bold text-slate-800 pt-2 flex items-center gap-1.5"
                          dangerouslySetInnerHTML={{ __html: parseMathInText(trimmed.replace(/^###\s*/, '')) }}
                        />
                      );
                    }

                    // Examiner trap or alert highlight
                    if (trimmed.includes('Trap') || trimmed.includes('Pitfall') || trimmed.includes('Warning') || trimmed.includes('Common Mistake')) {
                      return (
                        <div
                          key={pIdx}
                          className="rounded-xl border-l-4 border-red-500 bg-red-50/80 p-3.5 text-xs sm:text-sm text-red-950 shadow-2xs font-medium"
                          dangerouslySetInnerHTML={{ __html: parseMathInText(trimmed) }}
                        />
                      );
                    }

                    // Model solution / Question card
                    if (trimmed.includes('[CBSE') || trimmed.includes('[NEET') || trimmed.includes('[JEE') || trimmed.includes('Question:')) {
                      return (
                        <div
                          key={pIdx}
                          className="rounded-xl border border-amber-300 bg-amber-50/60 p-3.5 text-xs sm:text-sm text-amber-950 shadow-2xs"
                          dangerouslySetInnerHTML={{ __html: parseMathInText(trimmed) }}
                        />
                      );
                    }

                    // Bullet lists
                    if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s/.test(trimmed)) {
                      const items = trimmed.split('\n').filter((l) => l.trim().length > 0);
                      return (
                        <ul key={pIdx} className="space-y-1.5 pl-3 text-xs sm:text-sm">
                          {items.map((item, iIdx) => (
                            <li key={iIdx} className="flex items-start gap-2">
                              <span className="text-indigo-600 font-bold select-none">•</span>
                              <div
                                className="flex-1"
                                dangerouslySetInnerHTML={{ __html: parseMathInText(item.replace(/^[-*•]\s+|\d+\.\s+/, '')) }}
                              />
                            </li>
                          ))}
                        </ul>
                      );
                    }

                    // Standard paragraph with KaTeX math parsing
                    return (
                      <p
                        key={pIdx}
                        className="text-xs sm:text-sm text-slate-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: parseMathInText(trimmed) }}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs">
                  Click any question prompt above or enter a question to start.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Query Input */}
        <div className="border-t border-slate-200 bg-white p-3 sm:p-4">
          <form onSubmit={handleSendQuery} className="flex items-center gap-2">
            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder={`Ask anything about ${topic} past questions, tricky derivations, or marking rubrics...`}
              disabled={loading}
              className="flex-1 rounded-xl border border-slate-300 py-2.5 px-4 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-hidden transition"
            />
            <button
              type="submit"
              disabled={loading || !userQuery.trim()}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">Ask Agent</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
