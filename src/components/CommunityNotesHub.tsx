import React, { useState } from 'react';
import { 
  Users, 
  Heart, 
  Sparkles, 
  BookOpen, 
  Search, 
  Filter, 
  Award, 
  Share2, 
  Copy, 
  Check, 
  Eye, 
  MessageSquare, 
  ArrowRight,
  Flame,
  ShieldCheck,
  TrendingUp,
  ExternalLink
} from 'lucide-react';
import { StudyNote, UserProfile, NoteContentPayload, HandwritingStyleConfig } from '../types';
import { HandwrittenNoteRenderer } from './HandwrittenNoteRenderer';

interface CommunityNotesHubProps {
  user: UserProfile | null;
  activeClass: string;
  onGoToStudio?: (cmd: string) => void;
  onRequireAuth: () => void;
}

// High-Yield Pre-Curated Community Notes from Top Indian Board Rankers
interface CommunityNoteItem {
  id: string;
  title: string;
  classGrade: string;
  subject: string;
  chapter: string;
  authorName: string;
  authorBadge: string;
  likesCount: number;
  viewsCount: number;
  examTarget: 'cbse' | 'neet' | 'jee';
  summarySnippet: string;
  tags: string[];
  command: string;
}

const COMMUNITY_NOTES_SEED: CommunityNoteItem[] = [
  {
    id: 'comm_note_1',
    title: 'Life Processes : Complete 2-Page Topper Register',
    classGrade: 'Class 10',
    subject: 'Science',
    chapter: 'Life Processes',
    authorName: 'Aarav Sharma (AIR 14 CBSE)',
    authorBadge: 'CBSE 100/100 Topper',
    likesCount: 1420,
    viewsCount: 8940,
    examTarget: 'cbse',
    summarySnippet: 'Detailed respiration, photosynthesis, human nephron excretory system diagrams with color coded labels and 5-mark board answers.',
    tags: ['Biology', 'Diagrams', 'High-Yield Board Topics'],
    command: '/handwriting class:10 subject:Science chapter:"Life Processes" style:gel-pen paper:ruled ink:royal-blue thinking:high',
  },
  {
    id: 'comm_note_2',
    title: 'Laws of Motion & Friction Derivations Master Sheet',
    classGrade: 'Class 11',
    subject: 'Physics',
    chapter: 'Laws of Motion',
    authorName: 'Priya Patel (NEET 710/720)',
    authorBadge: 'NEET Physics Expert',
    likesCount: 980,
    viewsCount: 6510,
    examTarget: 'neet',
    summarySnippet: 'Free Body Diagrams (FBD), banking of curved roads derivation, pulley systems with tensions and acceleration formulas.',
    tags: ['Physics', 'Derivations', 'NEET Special'],
    command: '/handwriting class:11 subject:Physics chapter:"Laws of Motion" --neet --formulas style:gel-pen',
  },
  {
    id: 'comm_note_3',
    title: 'Chemical Reactions & Equations : Balancing & Types',
    classGrade: 'Class 10',
    subject: 'Science',
    chapter: 'Chemical Reactions and Equations',
    authorName: 'Rohan Verma (Delhi Board State Rank 3)',
    authorBadge: 'National Science Olympiad Gold',
    likesCount: 1120,
    viewsCount: 7420,
    examTarget: 'cbse',
    summarySnippet: 'All precipitate colors (lead iodide yellow, copper carbonate green), redox reactions with oxidizing/reducing agent identification.',
    tags: ['Chemistry', 'Precipitates', 'Board Traps'],
    command: '/handwriting class:10 subject:Science chapter:"Chemical Reactions and Equations" style:fountain-pen paper:ruled ink:classic-black',
  },
  {
    id: 'comm_note_4',
    title: 'Electric Charges & Gauss Law Surface Integrals',
    classGrade: 'Class 12',
    subject: 'Physics',
    chapter: 'Electric Charges and Fields',
    authorName: 'Sneha Roy (JEE Adv AIR 210)',
    authorBadge: 'JEE Advanced Ranker',
    likesCount: 1650,
    viewsCount: 11200,
    examTarget: 'jee',
    summarySnippet: 'Coulomb law in vector form, electric flux through closed cylinder & sphere, infinite wire electric field step-by-step derivation.',
    tags: ['Physics', 'Gauss Theorem', 'Derivations'],
    command: '/handwriting class:12 subject:Physics chapter:"Electric Charges and Fields" --jee --detailed',
  },
  {
    id: 'comm_note_5',
    title: 'Chemical Bonding : VSEPR & Hybridization Geometry',
    classGrade: 'Class 11',
    subject: 'Chemistry',
    chapter: 'Chemical Bonding and Molecular Structure',
    authorName: 'Dr. Vivek Mehra (Mentor Buzzing Brain)',
    authorBadge: 'Verified Educator',
    likesCount: 890,
    viewsCount: 5200,
    examTarget: 'neet',
    summarySnippet: 'Lone pair vs bond pair repulsions, sp, sp2, sp3 geometry chart with bond angles and dipole moment trick.',
    tags: ['Chemistry', 'Hybridization', 'VSEPR Chart'],
    command: '/handwriting class:11 subject:Chemistry chapter:"Chemical Bonding and Molecular Structure" style:gel-pen paper:ruled ink:royal-blue',
  },
  {
    id: 'comm_note_6',
    title: 'Quadratic Equations : Discriminant & Word Problems',
    classGrade: 'Class 10',
    subject: 'Mathematics',
    chapter: 'Quadratic Equations',
    authorName: 'Ananya Deshmukh (Math 100/100)',
    authorBadge: 'Centum Scorer',
    likesCount: 780,
    viewsCount: 4890,
    examTarget: 'cbse',
    summarySnippet: 'Speed-distance train problems, tap filling time equations, nature of roots conditions (b^2 - 4ac >= 0) with graph parabola intuition.',
    tags: ['Mathematics', 'Word Problems', 'Quadratic Formula'],
    command: '/handwriting class:10 subject:Mathematics chapter:"Quadratic Equations" style:ballpoint paper:grid-math ink:royal-blue',
  },
];

// Active Community Study Circles
const STUDY_CIRCLES = [
  {
    name: 'Class 10 Board 100/100 Mission',
    membersCount: 4210,
    activeTopic: 'Light: Ray Diagrams for Concave Mirrors',
    iconColor: 'from-amber-500 to-amber-700',
    subject: 'Science & Math',
  },
  {
    name: 'NEET 2026 Biology & Physics Squad',
    membersCount: 6890,
    activeTopic: 'Nephron Countercurrent Mechanism',
    iconColor: 'from-emerald-500 to-emerald-700',
    subject: 'PCB Focus',
  },
  {
    name: 'JEE Mechanics & Calculus Ninjas',
    membersCount: 3450,
    activeTopic: 'Friction on Incline & Integration',
    iconColor: 'from-violet-500 to-violet-700',
    subject: 'PCM Focus',
  },
];

export const CommunityNotesHub: React.FC<CommunityNotesHubProps> = ({
  user,
  activeClass,
  onGoToStudio,
  onRequireAuth,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('All');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('All');
  const [selectedExamFilter, setSelectedExamFilter] = useState<'all' | 'cbse' | 'neet' | 'jee'>('all');

  // Track liked notes locally
  const [likedNoteIds, setLikedNoteIds] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('bb_community_liked_notes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [copiedNoteId, setCopiedNoteId] = useState<string | null>(null);

  // Peer Challenge State
  const [peerChallengeCode, setPeerChallengeCode] = useState<string>('');
  const [generatedChallengePin, setGeneratedChallengePin] = useState<string | null>(null);
  const [challengeStatusMsg, setChallengeStatusMsg] = useState<string | null>(null);

  const toggleLike = (noteId: string) => {
    if (!user) {
      onRequireAuth();
      return;
    }
    setLikedNoteIds((prev) => {
      const next = { ...prev, [noteId]: !prev[noteId] };
      try {
        localStorage.setItem('bb_community_liked_notes', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleCopyCommand = (note: CommunityNoteItem) => {
    navigator.clipboard.writeText(note.command);
    setCopiedNoteId(note.id);
    setTimeout(() => setCopiedNoteId(null), 2500);
  };

  // Filter notes
  const filteredNotes = COMMUNITY_NOTES_SEED.filter((n) => {
    const classMatch = selectedClassFilter === 'All' || n.classGrade === selectedClassFilter;
    const subjectMatch = selectedSubjectFilter === 'All' || n.subject.toLowerCase() === selectedSubjectFilter.toLowerCase();
    const examMatch = selectedExamFilter === 'all' || n.examTarget === selectedExamFilter;
    const searchMatch = !searchQuery || 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.summarySnippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return classMatch && subjectMatch && examMatch && searchMatch;
  });

  return (
    <div className="w-full max-w-6xl mx-auto py-8 space-y-10 text-slate-100">
      {/* 1. Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#070b1a] via-[#050814] to-[#03050c] border border-amber-400/20 p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold">
            <Users className="w-4 h-4 text-amber-400" />
            <span>National Student Knowledge Commons</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Topper Community Notes &amp; Study Hub
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Explore authentic handwritten register study notes shared by board rankers, state toppers, and NCERT scholars across India. Study together, upvote the best notes, and clone them into your private library.
            </p>
          </div>

          {/* Peer Mock Challenge Pin Generator */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-wrap items-center justify-between gap-4 max-w-3xl">
            <div className="space-y-1">
              <div className="text-xs font-bold text-amber-400 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Peer Mock Challenge Arena</span>
              </div>
              <p className="text-xs text-slate-400">
                Create a 4-digit challenge room or enter a friend's challenge PIN to take a simultaneous timed mock test.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Enter 4-digit PIN"
                maxLength={4}
                value={peerChallengeCode}
                onChange={(e) => setPeerChallengeCode(e.target.value.toUpperCase())}
                className="w-32 bg-slate-950 border border-white/20 rounded-xl px-3 py-2 text-xs font-mono text-center text-white focus:outline-none focus:border-amber-400"
              />

              <button
                onClick={() => {
                  if (peerChallengeCode.trim()) {
                    setChallengeStatusMsg(`Connecting to Peer Study Challenge Room #${peerChallengeCode}! Initiating synchronized 15-minute examination.`);
                  } else {
                    const pin = Math.floor(1000 + Math.random() * 9000).toString();
                    setGeneratedChallengePin(pin);
                    setChallengeStatusMsg(`Created Challenge Room PIN: ${pin}! Share this 4-digit code with your classmates.`);
                  }
                  setTimeout(() => setChallengeStatusMsg(null), 6000);
                }}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer whitespace-nowrap"
              >
                {peerChallengeCode ? 'Join Challenge' : 'Generate Room PIN'}
              </button>
            </div>
            {challengeStatusMsg && (
              <div className="w-full mt-2 p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs flex items-center justify-between">
                <span>{challengeStatusMsg}</span>
                <button onClick={() => setChallengeStatusMsg(null)} className="text-slate-400 hover:text-white font-bold">&times;</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Active Study Circles */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-amber-400" />
          <span>Active Peer Study Circles</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STUDY_CIRCLES.map((circle) => (
            <div
              key={circle.name}
              className="rounded-2xl p-6 bg-[#070a14] border border-white/[0.08] hover:border-amber-400/30 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="px-2.5 py-1 rounded-md bg-amber-400/10 text-amber-300 font-semibold">
                    {circle.subject}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    {circle.membersCount} Scholars
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">{circle.name}</h3>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                  <div className="text-[11px] font-mono text-slate-400">Current Group Focus:</div>
                  <div className="text-xs text-amber-300 font-medium">{circle.activeTopic}</div>
                </div>
              </div>

              {onGoToStudio && (
                <button
                  onClick={() => onGoToStudio(`/handwriting topic:"${circle.activeTopic}" style:gel-pen`)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs border border-white/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Join Discussion &amp; Study Topic</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. Search & Filters Bar */}
      <div className="space-y-4 rounded-2xl bg-[#070a14] border border-white/[0.08] p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search community notes by chapter, topic, derivation, or formula..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900/90 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Exam Filter Segment */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto text-xs font-semibold">
            {(['all', 'cbse', 'neet', 'jee'] as const).map((ex) => (
              <button
                key={ex}
                onClick={() => setSelectedExamFilter(ex)}
                className={`px-3 py-2 rounded-xl uppercase transition-colors cursor-pointer ${
                  selectedExamFilter === ex
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-white/10'
                }`}
              >
                {ex === 'all' ? 'All Exams' : ex}
              </button>
            ))}
          </div>
        </div>

        {/* Class and Subject Filter Chips */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/[0.06]">
          {/* Class Filter */}
          <div className="flex items-center gap-2 overflow-x-auto text-xs font-semibold">
            {['All', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClassFilter(cls)}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  selectedClassFilter === cls
                    ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>

          {/* Subject Filter */}
          <div className="flex items-center gap-2 overflow-x-auto text-xs font-semibold">
            {['All', 'Science', 'Physics', 'Chemistry', 'Mathematics', 'Biology'].map((subj) => (
              <button
                key={subj}
                onClick={() => setSelectedSubjectFilter(subj)}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  selectedSubjectFilter === subj
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {subj}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Notes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note) => {
          const isLiked = !!likedNoteIds[note.id];
          const displayedLikes = note.likesCount + (isLiked ? 1 : 0);

          return (
            <div
              key={note.id}
              className="rounded-2xl bg-[#070a14] border border-white/[0.08] hover:border-amber-400/40 p-6 flex flex-col justify-between space-y-6 transition-all shadow-xl group"
            >
              {/* Card Header & Badges */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold">{note.classGrade}</span>
                    <span className="text-slate-600">&bull;</span>
                    <span className="text-slate-300">{note.subject}</span>
                  </div>

                  <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-white/10 text-[10px] uppercase font-bold text-violet-300">
                    {note.examTarget}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-white text-lg group-hover:text-amber-300 transition-colors leading-snug">
                    {note.title}
                  </h3>
                  <div className="text-xs text-slate-400">
                    Chapter: <strong className="text-slate-200">{note.chapter}</strong>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {note.summarySnippet}
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-2.5 pt-3 border-t border-white/[0.06]">
                  <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0 border border-amber-400/30">
                    {note.authorName.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-white truncate">{note.authorName}</div>
                    <div className="text-[10px] text-amber-400 font-medium truncate">{note.authorBadge}</div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {note.tags.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 text-[10px] font-mono">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Actions Footer */}
              <div className="space-y-3 pt-3 border-t border-white/[0.06]">
                <div className="flex items-center justify-between text-xs">
                  {/* Upvote Button */}
                  <button
                    onClick={() => toggleLike(note.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                      isLiked
                        ? 'bg-rose-500/10 border-rose-500/40 text-rose-400'
                        : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-400 text-rose-400' : ''}`} />
                    <span className="font-mono text-xs">{displayedLikes}</span>
                  </button>

                  <div className="text-xs font-mono text-slate-500 flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{note.viewsCount} views</span>
                  </div>
                </div>

                {/* Primary Button */}
                {onGoToStudio && (
                  <button
                    onClick={() => onGoToStudio(note.command)}
                    className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-[0.98]"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Open in Handwritten Notes Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
