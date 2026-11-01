import React, { useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  BookOpen, 
  Award, 
  FlaskConical, 
  LayoutDashboard, 
  Users, 
  Camera, 
  MessageSquare, 
  GraduationCap, 
  Youtube, 
  HelpCircle, 
  ShieldCheck, 
  FileText, 
  Lock, 
  ChevronRight,
  Sliders,
  Calendar,
  LogOut,
  ExternalLink
} from 'lucide-react';
import { UserProfile, AuthStateStatus } from '../types';
import { NavTab } from './Navbar';

interface RightSidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  activeClass: string;
  onClassChange: (cls: string) => void;
  user: UserProfile | null;
  onSignOut: () => void;
  onSignIn: () => void;
  onOpenComplaint: () => void;
  onGoToLabs?: (subTab?: any) => void;
}

export const RightSidebarDrawer: React.FC<RightSidebarDrawerProps> = ({
  isOpen,
  onClose,
  currentTab,
  onTabChange,
  activeClass,
  onClassChange,
  user,
  onSignOut,
  onSignIn,
  onOpenComplaint,
  onGoToLabs,
}) => {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isAdmin = user?.role === 'admin' || 
    user?.email?.toLowerCase() === 'brainyyybuzz@gmail.com' ||
    user?.email?.toLowerCase() === 'gautamankur0101@gmail.com' ||
    user?.email?.toLowerCase() === 'pathpriya99@gmail.com';
  const isTeacher = user?.role === 'teacher';

  const navigateTo = (tab: NavTab) => {
    onTabChange(tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end print:hidden">
      {/* Dark Backdrop Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Right Drawer Panel */}
      <aside className="relative w-full max-w-sm sm:max-w-md h-full bg-[#070b1e] border-l border-white/15 text-slate-100 shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-md">
              BB
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white tracking-tight flex items-center gap-1.5">
                <span>Buzzing Brain Workspace</span>
              </h2>
              <p className="text-[10px] text-slate-400 font-mono">Academic Tools &amp; Portal Hub</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6 text-xs">
          {/* Target Academic Grade Switcher */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
              Academic Grade Target
            </span>
            <div className="grid grid-cols-4 gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10">
              {(['Class 9', 'Class 10', 'Class 11', 'Class 12'] as const).map((cls) => (
                <button
                  key={cls}
                  onClick={() => onClassChange(cls)}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all text-center cursor-pointer ${
                    activeClass === cls
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>
          </div>

          {/* Primary Learning Modules */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block px-1">
              Core Study Navigation
            </span>

            <button
              onClick={() => navigateTo('ai-tutor')}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl transition cursor-pointer ${
                currentTab === 'ai-tutor' ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'hover:bg-white/5 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div className="text-left">
                  <div className="font-bold text-white text-xs">AI Tutor Studio (Gemini 2.0)</div>
                  <div className="text-[10px] text-slate-400">Instant multi-turn academic doubt solver</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>

            <button
              onClick={() => navigateTo('books')}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl transition cursor-pointer ${
                currentTab === 'books' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'hover:bg-white/5 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="p-1.5 rounded-lg bg-amber-400/20 text-amber-400">
                  <BookOpen className="w-4 h-4" />
                </span>
                <div className="text-left">
                  <div className="font-bold text-white text-xs">National Digital Library (NDLI) &amp; Books</div>
                  <div className="text-[10px] text-slate-400">Official IIT Kharagpur &amp; NCERT Exam books</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>

            <button
              onClick={() => navigateTo('dashboard')}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl transition cursor-pointer ${
                currentTab === 'dashboard' ? 'bg-white/15 text-white' : 'hover:bg-white/5 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
                  <LayoutDashboard className="w-4 h-4" />
                </span>
                <div className="text-left">
                  <div className="font-bold text-white text-xs">Adaptive Student Dashboard</div>
                  <div className="text-[10px] text-slate-400">Learning analytics, streak &amp; syllabus mastery</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>

            <button
              onClick={() => navigateTo('scanner')}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl transition cursor-pointer ${
                currentTab === 'scanner' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'hover:bg-white/5 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <Camera className="w-4 h-4" />
                </span>
                <div className="text-left">
                  <div className="font-bold text-white text-xs">AI Homework Scanner</div>
                  <div className="text-[10px] text-slate-400">Instant step-by-step camera solution evaluator</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>

            <button
              onClick={() => navigateTo('parent-bot')}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl transition cursor-pointer ${
                currentTab === 'parent-bot' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : 'hover:bg-white/5 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="p-1.5 rounded-lg bg-teal-500/20 text-teal-400">
                  <MessageSquare className="w-4 h-4" />
                </span>
                <div className="text-left">
                  <div className="font-bold text-white text-xs">Parent WhatsApp Hub</div>
                  <div className="text-[10px] text-slate-400">Parental academic progress notifications &amp; alerts</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>

            <button
              onClick={() => navigateTo('planner')}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl transition cursor-pointer ${
                currentTab === 'planner' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'hover:bg-white/5 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                  <Calendar className="w-4 h-4" />
                </span>
                <div className="text-left">
                  <div className="font-bold text-white text-xs">Exam Revision Planner</div>
                  <div className="text-[10px] text-slate-400">Spaced-repetition revision schedule</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>

            <button
              onClick={() => navigateTo('syllabus')}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl transition cursor-pointer ${
                currentTab === 'syllabus' ? 'bg-white/15 text-white' : 'hover:bg-white/5 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
                  <GraduationCap className="w-4 h-4" />
                </span>
                <div className="text-left">
                  <div className="font-bold text-white text-xs">2026–27 Syllabus Outlines</div>
                  <div className="text-[10px] text-slate-400">Official CBSE, NEET &amp; JEE curriculum map</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>

            <button
              onClick={() => navigateTo('community')}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl transition cursor-pointer ${
                currentTab === 'community' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'hover:bg-white/5 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                  <Users className="w-4 h-4" />
                </span>
                <div className="text-left">
                  <div className="font-bold text-white text-xs">Community Notes Hub</div>
                  <div className="text-[10px] text-slate-400">Peer verified study notes &amp; top ratings</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>

            <button
              onClick={() => navigateTo('youtube')}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl transition cursor-pointer ${
                currentTab === 'youtube' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'hover:bg-white/5 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="p-1.5 rounded-lg bg-red-500/20 text-red-400">
                  <Youtube className="w-4 h-4" />
                </span>
                <div className="text-left">
                  <div className="font-bold text-white text-xs">YouTube Video Lectures</div>
                  <div className="text-[10px] text-slate-400">Curated lessons on @BrainBuzz2702</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          {/* Educator / Administration Portal (If authorized) */}
          {(isTeacher || isAdmin) && (
            <div className="space-y-1.5 pt-2 border-t border-white/10">
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-semibold block px-1">
                Educator Command
              </span>
              <button
                onClick={() => navigateTo('teacher')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl transition cursor-pointer ${
                  currentTab === 'teacher' ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' : 'hover:bg-white/5 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
                    <ShieldCheck className="w-4 h-4" />
                  </span>
                  <div className="text-left">
                    <div className="font-bold text-white text-xs">Teacher Portal &amp; Assignments</div>
                    <div className="text-[10px] text-slate-400">Class management &amp; student monitoring</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>

              {isAdmin && (
                <button
                  onClick={() => navigateTo('admin')}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl transition cursor-pointer ${
                    currentTab === 'admin' ? 'bg-rose-600/20 text-rose-300 border border-rose-500/30' : 'hover:bg-white/5 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
                      <Lock className="w-4 h-4" />
                    </span>
                    <div className="text-left">
                      <div className="font-bold text-white text-xs">Admin Audit Console</div>
                      <div className="text-[10px] text-slate-400">Platform security &amp; complaints oversight</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              )}
            </div>
          )}

          {/* Grievance & Student Support */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block px-1">
              Assistance &amp; Compliance
            </span>

            <button
              onClick={() => {
                onClose();
                onOpenComplaint();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-white/5 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Grievance Redressal Desk</span>
            </button>

            <button
              onClick={() => navigateTo('terms')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-white/5 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <FileText className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Terms &amp; Academic Conditions</span>
            </button>

            <button
              onClick={() => navigateTo('privacy')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-white/5 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <Lock className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Privacy Policy &amp; DPDP Consent</span>
            </button>
          </div>
        </div>

        {/* Footer Account Status */}
        <div className="p-4 border-t border-white/10 bg-black/60">
          {user ? (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'S'}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-white text-xs truncate">{user.displayName || 'Student Scholar'}</div>
                  <div className="text-[10px] text-slate-400 truncate">{user.email || 'Verified Account'}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onSignOut();
                }}
                className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition cursor-pointer shrink-0"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                onClose();
                onSignIn();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer text-center"
            >
              Log In / Register (Free)
            </button>
          )}
        </div>
      </aside>
    </div>
  );
};
