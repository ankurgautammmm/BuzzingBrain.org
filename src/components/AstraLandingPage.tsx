import React from 'react';
import { 
  ArrowRight, 
  BookOpen, 
  PenTool, 
  Play, 
  CheckCircle2, 
  Award, 
  FileText,
  Sparkles,
  ExternalLink,
  ChevronRight,
  GraduationCap,
  Layers,
  HelpCircle,
  Camera,
  GitBranch,
  LayoutDashboard,
  Zap,
  Calendar,
  Users,
  Heart,
  Sliders,
  Atom,
  Eye,
  Activity,
  FlaskConical,
  Dna,
  BrainCircuit,
  MessageSquare
} from 'lucide-react';
import { UserProfile } from '../types';

interface AstraLandingPageProps {
  onGoToStudio: (sampleCommand?: string) => void;
  onGoToBooks: () => void;
  onGoToSyllabus?: () => void;
  onGoToYouTube: () => void;
  onGoToLibrary: () => void;
  onGoToTests: () => void;
  onGoToDashboard?: () => void;
  onGoToCourses?: () => void;
  onGoToScanner?: () => void;
  onGoToPracticals?: () => void;
  onGoToSciLab?: () => void;
  onGoToLabs?: (subTab?: 'mindmaps' | 'organs3d' | 'virtual_tools' | 'simulations' | 'journal') => void;
  onGoToPlanner?: () => void;
  onGoToCommunity?: () => void;
  onGoToAiTutor?: () => void;
  onGoToTeacher?: () => void;
  onGoToParentBot?: () => void;
  onSignIn: () => void;
  onSignUp: () => void;
  user: UserProfile | null;
}

export const AstraLandingPage: React.FC<AstraLandingPageProps> = ({
  onGoToStudio,
  onGoToBooks,
  onGoToSyllabus,
  onGoToYouTube,
  onGoToLibrary,
  onGoToParentBot,
  onGoToTests,
  onGoToDashboard,
  onGoToCourses,
  onGoToScanner,
  onGoToPracticals,
  onGoToSciLab,
  onGoToLabs,
  onGoToPlanner,
  onGoToCommunity,
  onGoToAiTutor,
  onGoToTeacher,
  onSignIn,
  onSignUp,
  user,
}) => {
  const handlePrimaryCta = () => {
    if (!user) {
      onSignUp();
    } else {
      onGoToStudio();
    }
  };

  return (
    <div className="w-full text-slate-100 space-y-24 py-12 md:py-16">
      {/* 1. HERO SECTION: Dramatic Headline, Real Photography & Single Clear CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Big Editorial Headline & Value Proposition */}
          <div className="lg:col-span-7 space-y-8 text-left">
            {/* Subtle Brand Tag */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span>Open Educational Initiative &bull; CBSE &amp; NCERT</span>
            </div>

            {/* Huge Headline */}
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
              Free Education <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-violet-400">
                For Every Student.
              </span>
            </h1>

            {/* Clear, Honest Copy - No Fake Claims */}
            <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed max-w-xl">
              Complete, verified NCERT study notes formatted like a topper's two-page handwritten register. Ruled notebook paper, real equations, scientific diagrams, and chapter assessments — 100% open and free.
            </p>

            {/* Dual CTA: AI Tutor Studio + Handwritten Studio */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
              <button
                onClick={() => onGoToAiTutor ? onGoToAiTutor() : handlePrimaryCta()}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm transition-all shadow-xl hover:shadow-amber-400/25 active:scale-[0.98] cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Open AI Tutor Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handlePrimaryCta}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm border border-slate-700 transition-all cursor-pointer"
              >
                <span>{user ? 'Notes Studio' : 'Free Notes'}</span>
              </button>

              {!user && (
                <button
                  onClick={onSignIn}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-3.5 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <span>Already have an account?</span>
                  <span className="text-amber-400 font-semibold underline underline-offset-4">Log In</span>
                </button>
              )}
            </div>

            {/* Honest Curriculum Footnote (No fake numbers) */}
            <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Class 9, 10, 11 &amp; 12 Complete Syllabus</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                <span>Print &amp; Download PDF Support</span>
              </div>
            </div>
          </div>

          {/* Right Column: Real Educational Photography Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900 group">
              {/* Real Student Study Photography from Unsplash */}
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80"
                alt="Students studying collaboratively with books and notebooks"
                className="w-full h-[420px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>
              
              {/* Overlay Quality Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-white">Curriculum Grounded</span>
                  <span className="text-amber-400 font-mono">NCERT &bull; CBSE</span>
                </div>
                <p className="text-[12px] text-slate-300 leading-snug">
                  Aligned with official National Council of Educational Research and Training textbooks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE 6 PILLARS OF BUZZING BRAIN: Comprehensive AI Education Suite */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="max-w-2xl space-y-3 text-left">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-amber-400">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>All-In-One Open Education Platform</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Everything a student needs to master their syllabus.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            From textbook decomposition to handwritten study registers, video production, homework checking, and virtual physics experiments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Textbook to Complete Course */}
          <div 
            onClick={() => onGoToCourses ? onGoToCourses() : onGoToStudio()}
            className="p-6 rounded-3xl astra-card border border-white/10 hover:border-amber-400/40 transition-all cursor-pointer group space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                Textbook to Complete Course
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upload a textbook PDF or paste chapter text to generate an entire curriculum: chapter summary, subtopic breakdowns, formulas, definitions, MCQs, and flashcards.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 pt-2 border-t border-white/5">
              <span>Launch Course Engine</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Handwritten Notes Studio */}
          <div 
            onClick={() => onGoToStudio()}
            className="p-6 rounded-3xl astra-card border border-white/10 hover:border-amber-400/40 transition-all cursor-pointer group space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold">
                <PenTool className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                Handwritten Notes Studio
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Authentic ruled notebook pages with realistic handwriting fonts, red margins, formula derivations, post-it memory hacks, and printable vector PDF export.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 pt-2 border-t border-white/5">
              <span>Synthesize Notes</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: 25-Year PYQ Guru & Question Bank */}
          <div 
            onClick={() => onGoToTests()}
            className="p-6 rounded-3xl astra-card border border-white/10 hover:border-indigo-400/40 transition-all cursor-pointer group space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                  <BrainCircuit className="w-6 h-6 text-indigo-400" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  25-Yr Archive
                </span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                25-Yr PYQ Guru &amp; Matrix
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                25 years of authentic past exam questions across NEET, JEE Main, and CBSE Boards. Chapter-wise frequency heatmaps, timed CBT practice tests, and instant AI answer evaluation.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 pt-2 border-t border-white/5">
              <span>Explore PYQs in Tests</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: AI Homework Scanner */}
          <div 
            onClick={() => onGoToScanner ? onGoToScanner() : onGoToStudio()}
            className="p-6 rounded-3xl astra-card border border-white/10 hover:border-emerald-400/40 transition-all cursor-pointer group space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                AI Homework Scanner
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Photograph your handwritten homework solution. Get step-by-step examiner evaluations, mark breakdowns, mistake alerts, and perfect full-marks model answers.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 pt-2 border-t border-white/5">
              <span>Scan Homework</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: Practice Tests & Adaptive Engine */}
          <div 
            onClick={() => onGoToTests()}
            className="p-6 rounded-3xl astra-card border border-white/10 hover:border-purple-400/40 transition-all cursor-pointer group space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                Practice Tests &amp; Adaptive Engine
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Timed chapter assessments, randomized MCQs, and forgetting curve spaced repetition revision reminders to ensure retention for final board evaluations.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400 pt-2 border-t border-white/5">
              <span>Start Assessment</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 6: 3D Anatomical Organs, Calibrated Virtual Tools & Mind Maps */}
          <div 
            className="p-6 rounded-3xl astra-card border border-cyan-400/30 hover:border-cyan-400/60 transition-all cursor-pointer group space-y-4 flex flex-col justify-between shadow-lg shadow-cyan-950/20"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                  <Heart className="w-6 h-6 text-rose-400" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                  Interactive 3D &amp; Labs
                </span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                3D Organs, Virtual Tools &amp; Mind Maps
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Interact with 3D human organs (Heart, Brain, Eye, Nephron, Cells, DNA), calibrated virtual instruments (1000x Optical Microscope, Vernier Calipers, Titration Station), and 200+ chapter mind maps.
              </p>

              {/* Direct Quick Launch Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onGoToPracticals) onGoToPracticals();
                    else if (onGoToLabs) onGoToLabs('virtual_academy' as any);
                  }}
                  className="px-2 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-[10px] font-bold text-purple-300 hover:text-white transition-all text-center cursor-pointer col-span-2 sm:col-span-4 flex items-center justify-center gap-1.5"
                >
                  <FlaskConical className="w-3.5 h-3.5 text-purple-400" />
                  <span>3D Practical Academy (Stages 1–6 Labs)</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onGoToLabs) onGoToLabs('organs3d');
                  }}
                  className="px-2 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-[10px] font-bold text-rose-300 hover:text-white transition-all text-center cursor-pointer"
                >
                  3D Organs
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onGoToLabs) onGoToLabs('virtual_tools');
                  }}
                  className="px-2 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-[10px] font-bold text-cyan-300 hover:text-white transition-all text-center cursor-pointer"
                >
                  Virtual Tools
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onGoToLabs) onGoToLabs('mindmaps');
                  }}
                  className="px-2 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-[10px] font-bold text-amber-300 hover:text-white transition-all text-center cursor-pointer"
                >
                  Mind Maps
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onGoToLabs) onGoToLabs('journal');
                  }}
                  className="px-2 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-[10px] font-bold text-emerald-300 hover:text-white transition-all text-center cursor-pointer"
                >
                  Lab Journal
                </button>
              </div>
            </div>

            <div 
              onClick={() => onGoToLabs ? onGoToLabs('organs3d') : onGoToStudio()}
              className="flex items-center justify-between text-xs font-bold text-cyan-400 pt-3 border-t border-white/5 hover:text-cyan-300"
            >
              <span>Explore 3D Visualization Hub</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Dedicated SciLab BioMolecular Studio Card */}
          <div 
            onClick={() => onGoToSciLab ? onGoToSciLab() : onGoToStudio()}
            className="p-6 rounded-3xl astra-card border border-teal-500/30 hover:border-cyan-400/60 transition-all cursor-pointer group space-y-4 flex flex-col justify-between shadow-lg shadow-teal-950/20"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                  <Dna className="w-6 h-6 text-cyan-400" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                  Bioinformatics &amp; MD
                </span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                SciLab BioMolecular Studio
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Explore 3D macromolecular structures from <strong>AlphaFold DB</strong> &amp; <strong>RCSB PDB</strong> with pLDDT confidence gradients, 60fps <strong>Velocity Verlet Molecular Dynamics</strong> physics simulations, <strong>PubChem PUG REST</strong> chemistry workbench with Lipinski/Veber drug-likeness rules, and <strong>STRING</strong> interactome networks.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-cyan-400 pt-3 border-t border-white/5 group-hover:text-cyan-300">
              <span>Launch SciLab Studio</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 7: AI Exam Revision Planner & Countdown */}
          <div 
            onClick={() => onGoToPlanner ? onGoToPlanner() : onGoToTests()}
            className="p-6 rounded-3xl astra-card border border-white/10 hover:border-amber-400/40 transition-all cursor-pointer group space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                Exam Revision Planner
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                National exam countdown clock, spaced repetition matrix (1-3-7-14-30 days), daily 3-slot study routines, and full NCERT syllabus completion trackers.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 pt-2 border-t border-white/5">
              <span>Open Study Planner</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 8: Topper Community Hub & Peer Study Groups */}
          <div 
            onClick={() => onGoToCommunity ? onGoToCommunity() : onGoToStudio()}
            className="p-6 rounded-3xl astra-card border border-white/10 hover:border-emerald-400/40 transition-all cursor-pointer group space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                Topper Community Hub
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Browse authentic notes shared by board rankers across India. Upvote, clone to your library, join study circles, and run synchronized peer mock challenges.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 pt-2 border-t border-white/5">
              <span>Join Community</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 9: Coaching Institute — Parent WhatsApp Chatbot (n8n Spec) */}
          <div 
            onClick={() => onGoToParentBot ? onGoToParentBot() : onGoToAiTutor?.()}
            className="p-6 rounded-3xl astra-card border border-emerald-500/30 hover:border-emerald-500/60 transition-all cursor-pointer group space-y-4 flex flex-col justify-between shadow-lg shadow-emerald-950/20"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  WhatsApp + AI
                </span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                Coaching Institute — Parent Chatbot
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Parents message the institute WhatsApp helpline to get instant attendance %, test score trends, teacher remarks, and fee status explained by Gemini Flash in Hindi/Hinglish/English.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 pt-2 border-t border-white/5">
              <span>Launch WhatsApp Bot Simulator</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE TOPPER REGISTER LAYOUT */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl bg-slate-900/60 border border-white/[0.08] p-8 md:p-12 space-y-10">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-amber-400">
              <PenTool className="w-4 h-4 text-amber-400" />
              <span>Two-Page Register Format</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Crafted like the register of a CBSE board topper.
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              Every chapter note is built with structured ruled lines, left red margins, mathematical derivation blocks, scientific diagram blueprints, and examiner warnings.
            </p>
          </div>

          {/* 3-Column Feature Grid Aligned */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-slate-950/50 border border-white/[0.06] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold">
                  01
                </div>
                <h3 className="text-lg font-bold text-white">Left Red Margin Notations</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Chapter unit titles, fundamental definitions, and unit dimensions systematically logged along the classical student margin.
                </p>
              </div>
              <div className="text-xs text-amber-400/90 font-mono pt-2 border-t border-white/[0.05]">
                Structure: Ruled A4 notebook
              </div>
            </div>

            <div className="p-6 rounded-xl bg-slate-950/50 border border-white/[0.06] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-violet-400/10 text-violet-400 flex items-center justify-center font-bold">
                  02
                </div>
                <h3 className="text-lg font-bold text-white">Diagrams &amp; Equations</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Clear schematics, reaction mechanisms, and step-by-step mathematical derivations with SI units clearly marked.
                </p>
              </div>
              <div className="text-xs text-violet-400/90 font-mono pt-2 border-t border-white/[0.05]">
                Visual: Blue &amp; black ink contrast
              </div>
            </div>

            <div className="p-6 rounded-xl bg-slate-950/50 border border-white/[0.06] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold">
                  03
                </div>
                <h3 className="text-lg font-bold text-white">CBSE Examiner Alerts</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Highlighted callout boxes pointing out high-frequency board traps, common student blunders, and memory mnemonics.
                </p>
              </div>
              <div className="text-xs text-amber-400/90 font-mono pt-2 border-t border-white/[0.05]">
                Preparation: Solved Exemplars
              </div>
            </div>
          </div>

          {/* Single Focused CTA for Notes */}
          <div className="pt-4 flex justify-start">
            <button
              onClick={() => {
                onGoToStudio('/handwriting class:11 subject:Physics chapter:Laws of Motion topic:Friction & Circular Motion style:gel-pen paper:ruled ink:royal-blue thinking:high');
              }}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-white/10 hover:border-amber-400/30 transition-all cursor-pointer"
            >
              <span>Explore Sample Note: Laws of Motion</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. CURRICULUM BREADTH: Real Science Photography + Grid Alignment */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="max-w-2xl space-y-4 text-left">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-violet-400">
            <BookOpen className="w-4 h-4 text-violet-400" />
            <span>Complete Academic Coverage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Official NCERT Curriculum for Grades 9 through 12.
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Every chapter indexed directly from the latest National Council of Educational Research and Training textbooks.
          </p>
        </div>

        {/* 2-Column High-End Split Grid with Real Photography */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: Senior Secondary (Class 11 & 12) */}
          <div className="rounded-2xl bg-slate-900/60 border border-white/[0.08] overflow-hidden flex flex-col justify-between">
            <div className="relative h-48 overflow-hidden bg-slate-950">
              <img
                src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80"
                alt="Chemistry laboratory glassware"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
              <div className="absolute bottom-4 left-6">
                <span className="px-3 py-1 rounded-md bg-amber-400/20 text-amber-300 font-mono text-xs font-bold border border-amber-400/30">
                  Classes 11 &amp; 12
                </span>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white">Higher Secondary Sciences</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Rigorous coverage for Physics (Mechanics, Optics, Electromagnetism), Chemistry (Physical, Inorganic, Organic), Biology, and Mathematics.
                </p>
                <div className="flex flex-wrap gap-2 pt-2 text-xs text-slate-300 font-mono">
                  <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08]">Physics</span>
                  <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08]">Chemistry</span>
                  <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08]">Biology</span>
                  <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08]">Mathematics</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Secondary Foundation (Class 9 & 10) */}
          <div className="rounded-2xl bg-slate-900/60 border border-white/[0.08] overflow-hidden flex flex-col justify-between">
            <div className="relative h-48 overflow-hidden bg-slate-950">
              <img
                src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80"
                alt="Open textbook and study desk"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
              <div className="absolute bottom-4 left-6">
                <span className="px-3 py-1 rounded-md bg-violet-400/20 text-violet-300 font-mono text-xs font-bold border border-violet-400/30">
                  Classes 9 &amp; 10
                </span>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white">Secondary Board Foundation</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Complete chapter-wise notes for Science (Life Processes, Chemical Reactions, Motion, Light) and Core Mathematics with full formula sheets.
                </p>
                <div className="flex flex-wrap gap-2 pt-2 text-xs text-slate-300 font-mono">
                  <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08]">Life Processes</span>
                  <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08]">Acids &amp; Bases</span>
                  <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08]">Optics</span>
                  <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08]">Cell Biology</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Single Focused CTA for Syllabus & Books */}
        <div className="pt-2 flex justify-start">
          <button
            onClick={onGoToSyllabus || onGoToBooks}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all shadow-md active:scale-[0.98] cursor-pointer"
          >
            <span>Explore 2026–27 Syllabus &amp; Embedded PDF</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 3.5 SCIENTIFIC VISUALIZATION & 3D LABS SHOWCASE */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="max-w-3xl space-y-4 text-left">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-cyan-400">
            <Heart className="w-4 h-4 text-rose-400" />
            <span>Interactive Virtual Labs &amp; 3D Biology Suite</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            3D Anatomical Organs, Calibrated Virtual Science Tools &amp; Mind Maps.
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Move beyond static 2D textbook drawings. Rotate 3D pulsing anatomical organs, adjust microscope focus knobs, calibrate vernier calipers, conduct acid-base titrations, and explore expansive mind maps across all NCERT chapters.
          </p>
        </div>

        {/* 3 Showcase Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card A: 3D Anatomical & Biological Organs */}
          <div className="rounded-3xl bg-[#070b1a] border border-rose-500/30 p-6 md:p-8 space-y-6 flex flex-col justify-between shadow-xl hover:border-rose-500/60 transition-all group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                  <Heart className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                  3D Anatomy
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-rose-300 transition-colors">
                  3D Anatomical &amp; Biological Organs
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Real-time interactive anatomical models with 3D rotation, cross-sectional cutaways, and physiological function inspection.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-white/5 font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                  <span><strong>Human Heart:</strong> 4 pulsing chambers, valves &amp; blood flow</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                  <span><strong>Human Brain:</strong> Cerebrum lobes, cerebellum &amp; medulla</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  <span><strong>Human Eye:</strong> Accommodation, myopia &amp; ray optics</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <span><strong>Nephron &amp; Kidney:</strong> Ultrafiltration &amp; Henle loop</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span><strong>Plant vs Animal Cells:</strong> Organelle dissection</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                  <span><strong>DNA Double Helix:</strong> Watson-Crick base pairing</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onGoToLabs ? onGoToLabs('organs3d') : onGoToStudio()}
              className="w-full py-3 px-4 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-200 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-rose-500/40"
            >
              <span>Launch 3D Organ Explorer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card B: Calibrated Virtual Science Tools */}
          <div className="rounded-3xl bg-[#070b1a] border border-cyan-500/30 p-6 md:p-8 space-y-6 flex flex-col justify-between shadow-xl hover:border-cyan-500/60 transition-all group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                  <Sliders className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                  Calibrated Labs
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Calibrated Virtual Science Tools
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Accurately calibrated laboratory instruments simulating real physical and chemical apparatus required in CBSE board practicals.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-white/5 font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  <span><strong>1000x Optical Microscope:</strong> Coarse/fine focus blur &amp; slides</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                  <span><strong>Vernier Calipers:</strong> 0.01 mm precision slider &amp; least count</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                  <span><strong>Acid-Base Titration:</strong> Burette drops &amp; pH indicators</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <span><strong>Ray Optics Bench:</strong> Focal length &amp; image tracing</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span><strong>Circuit Breadboard:</strong> Series &amp; parallel Ohm's law</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  <span><strong>SHM Pendulum:</strong> Earth, Moon &amp; Jupiter gravity tests</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onGoToLabs ? onGoToLabs('virtual_tools') : onGoToStudio()}
              className="w-full py-3 px-4 rounded-xl bg-cyan-500/20 hover:bg-cyan-500 text-cyan-200 hover:text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-cyan-500/40"
            >
              <span>Open Calibrated Virtual Tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card C: Hierarchical Mind Maps Library */}
          <div className="rounded-3xl bg-[#070b1a] border border-amber-500/30 p-6 md:p-8 space-y-6 flex flex-col justify-between shadow-xl hover:border-amber-500/60 transition-all group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <GitBranch className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  Curriculum Trees
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                  Hierarchical Mind Maps Library
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Huge visual knowledge trees organizing every chapter into interconnected branches with formulas, definitions, and rapid revision notes.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-white/5 font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <span><strong>200+ NCERT Chapters:</strong> Physics, Chemistry, Biology, Math</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                  <span><strong>Class 9, 10, 11 &amp; 12:</strong> Fully indexed and aligned</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  <span><strong>One-Click Expand &amp; Collapse:</strong> Rapid revision</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                  <span><strong>Instant Search &amp; Filter:</strong> Find any concept in seconds</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span><strong>Deep Detail Cards:</strong> Formulas, SI units &amp; exam tips</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                  <span><strong>Interactive Node Inspection:</strong> Click any concept to view notes</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onGoToLabs ? onGoToLabs('mindmaps') : onGoToStudio()}
              className="w-full py-3 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-400 text-amber-200 hover:text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-amber-500/40"
            >
              <span>Browse Mind Maps Library</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. ONLINE TEST ARENA: Dark Luxury Assessment Portal Teaser */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl bg-[#060913] border border-white/[0.08] p-8 md:p-12 relative overflow-hidden space-y-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-2xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-amber-400">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Computer-Based Test Portal</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Test your conceptual clarity in exam conditions.
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              Step into our dark, distraction-free test environment with timed countdowns, CBSE-format multiple choice questions, and comprehensive step-by-step solutions for every problem.
            </p>
          </div>

          {/* Test Features Horizontal Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
            <div className="p-5 rounded-xl bg-slate-900/60 border border-white/[0.06] space-y-2">
              <div className="text-amber-400 font-mono text-sm font-bold">Standardized Format</div>
              <div className="text-white font-bold text-base">CBSE &amp; Exemplar Marking</div>
              <p className="text-xs text-slate-400">Strict marks allocation and authentic assertion-reason questions.</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-white/[0.06] space-y-2">
              <div className="text-violet-400 font-mono text-sm font-bold">Live HUD Timer</div>
              <div className="text-white font-bold text-base">Countdown &amp; Question Grid</div>
              <p className="text-xs text-slate-400">Interactive question palette with review markers and time tracking.</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-white/[0.06] space-y-2">
              <div className="text-amber-400 font-mono text-sm font-bold">In-Depth Solutions</div>
              <div className="text-white font-bold text-base">Step-by-Step Derivations</div>
              <p className="text-xs text-slate-400">Review mathematical formulas and concepts immediately upon submission.</p>
            </div>
          </div>

          {/* Single Focused CTA for Test Portal */}
          <div className="pt-2 relative z-10 flex justify-start">
            <button
              onClick={onGoToTests}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all shadow-xl hover:shadow-amber-400/20 active:scale-[0.98] cursor-pointer"
            >
              <span>Launch Test Arena</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. YOUTUBE LEARNING COMMUNITY: Direct Channel Integration */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl bg-slate-900/60 border border-white/[0.08] p-8 md:p-12 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-amber-400">
                <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Synchronized Video Lectures</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Official YouTube Channel: @BrainBuzz2702
              </h2>
              <p className="text-slate-400 text-base leading-relaxed">
                Connect your handwritten study notes with official video lessons, chapter walk-throughs, and board exam tips curated specifically for CBSE students.
              </p>
            </div>

            <div className="lg:col-span-4 flex lg:justify-end">
              <button
                onClick={onGoToYouTube}
                className="inline-flex items-center gap-2.5 px-6 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-white/10 hover:border-amber-400/30 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>Visit YouTube Channel</span>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER: Minimal, Dignified, Grounded */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 border-t border-white/[0.08] text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src="/BuzzingBrain_Video_Watermark_150x150.png"
            alt="Buzzing Brain"
            className="w-6 h-6 rounded-full border border-amber-400/50"
            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
          />
          <span className="font-semibold text-slate-300">Buzzing Brain</span>
          <span>&bull;</span>
          <span>Open Educational Initiative</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>CBSE &amp; NCERT Aligned</span>
          <span>&bull;</span>
          <span>Handwritten Study Notes</span>
          <span>&bull;</span>
          <span>Online Test Arena</span>
        </div>
      </footer>
    </div>
  );
};
