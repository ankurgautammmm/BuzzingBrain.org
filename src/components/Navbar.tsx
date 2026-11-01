import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  ShieldCheck, 
  Sparkles, 
  Award, 
  LayoutDashboard, 
  Users, 
  Heart, 
  Dna, 
  FlaskConical, 
  Camera, 
  Calendar, 
  MessageSquare, 
  Search, 
  LogIn, 
  LogOut, 
  MoreHorizontal, 
  Menu, 
  X,
  Sliders,
  Download,
  PanelRightOpen
} from 'lucide-react';
import { UserProfile, AuthStateStatus } from '../types';
import { PWAInstallButton } from './PWAInstallButton';
import { NotificationCenter } from './NotificationCenter';
import { RightSidebarDrawer } from './RightSidebarDrawer';

export type NavTab = 
  | 'landing' 
  | 'dashboard'
  | 'ai-tutor'
  | 'courses'
  | 'studio' 
  | 'scanner'
  | 'tests' 
  | 'planner'
  | 'community'
  | 'practicals'
  | 'practical_academy'
  | 'labs'
  | 'scilab'
  | 'books' 
  | 'syllabus' 
  | 'teacher'
  | 'youtube' 
  | 'library' 
  | 'admin' 
  | 'terms' 
  | 'privacy'
  | 'profile'
  | 'parent-bot'
  | 'auth';

interface NavbarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  user: UserProfile | null;
  authStatus?: AuthStateStatus;
  onSignIn: () => void;
  onSignUp?: () => void;
  onSignOut: () => void;
  activeClass: string;
  onClassChange: (newClass: string) => void;
  onOpenChat: () => void;
  onOpenComplaint: () => void;
  onOpenProfile?: () => void;
  onOpenSearch?: () => void;
  onGoToLabs?: (subTab?: 'virtual_academy' | 'mindmaps' | 'organs3d' | 'virtual_tools' | 'simulations' | 'journal' | 'practicals' | 'scilab') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  user,
  authStatus,
  onSignIn,
  onSignUp,
  onSignOut,
  activeClass,
  onClassChange,
  onOpenChat,
  onOpenComplaint,
  onOpenProfile,
  onOpenSearch,
  onGoToLabs,
}) => {
  const isAdmin = Boolean(
    user?.role === 'admin' || 
    user?.email?.toLowerCase() === 'brainyyybuzz@gmail.com' || 
    user?.email?.toLowerCase() === 'gautamankur0101@gmail.com' ||
    user?.email?.toLowerCase() === 'pathpriya99@gmail.com'
  );

  const isTeacher = Boolean(user?.role === 'teacher');
  const isTeacherOrAdmin = isAdmin || isTeacher;

  // Right Sidebar Drawer State (Replaces 3-dots popover)
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-black/85 backdrop-blur-xl border-b border-white/10 text-slate-100 print:hidden no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onTabChange('landing')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <img
                src="/BuzzingBrain_Video_Watermark_150x150.png"
                alt="Buzzing Brain"
                className="w-9 h-9 rounded-full border border-amber-400/80 shadow-md object-cover group-hover:scale-105 transition-transform"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="flex flex-col">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white flex items-center gap-1.5 leading-tight">
                  <span>BuzzingBrain</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-300 font-semibold border border-amber-400/30">
                    AI
                  </span>
                </span>
                <span className="text-[9px] text-slate-400 tracking-wider font-mono uppercase hidden sm:block">
                  Free Education
                </span>
              </div>
            </button>

          </div>

          {/* Upper Nav Bar: Basic & Necessary Core Academic Buttons */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-300">
            <button
              onClick={() => onTabChange('landing')}
              className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                currentTab === 'landing'
                  ? 'text-white bg-white/15 font-bold'
                  : 'hover:text-white hover:bg-white/5'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => onTabChange('studio')}
              className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'studio'
                  ? 'text-amber-300 bg-amber-400/20 font-bold border border-amber-400/30'
                  : 'hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Notes</span>
            </button>

            <button
              onClick={() => onTabChange('tests')}
              className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'tests'
                  ? 'text-amber-300 bg-amber-400/20 font-bold border border-amber-400/30'
                  : 'hover:text-white hover:bg-white/5'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Tests</span>
            </button>

            <button
              onClick={() => {
                if (onGoToLabs) {
                  onGoToLabs('virtual_academy');
                } else {
                  onTabChange('labs');
                }
              }}
              className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'labs' || currentTab === 'practicals'
                  ? 'text-purple-300 bg-purple-500/20 font-bold border border-purple-400/30'
                  : 'hover:text-white hover:bg-white/5'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5 text-purple-400" />
              <span>3D Labs</span>
            </button>

            {/* AI Tutor Studio as a prominent primary page */}
            <button
              onClick={() => onTabChange('ai-tutor')}
              className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'ai-tutor'
                  ? 'text-purple-300 bg-purple-600/30 font-bold border border-purple-400/40 shadow-xs'
                  : 'hover:text-purple-300 hover:bg-purple-500/10'
              }`}
              title="Dedicated AI Tutor Studio (Powered by Gemini 2.0)"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Tutor</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-purple-500/30 text-purple-200 font-mono">
                2.0
              </span>
            </button>

            {/* Real Textbooks & NDLI Library */}
            <button
              onClick={() => onTabChange('books')}
              className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'books'
                  ? 'text-amber-300 bg-amber-400/20 font-bold border border-amber-400/30'
                  : 'hover:text-white hover:bg-white/5'
              }`}
              title="Official NCERT & National Digital Library of India (NDLI)"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Books &amp; NDLI</span>
            </button>

            <button
              onClick={() => onTabChange('profile')}
              className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'profile'
                  ? 'text-cyan-300 bg-cyan-400/20 font-bold border border-cyan-400/30'
                  : 'hover:text-white hover:bg-white/5'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>Profile</span>
            </button>
          </nav>

          {/* Right Header Actions: Search, Notifications, Auth & Right Sidebar Toggle */}
          <div className="flex items-center gap-2">
            {/* Global Search Button */}
            {onOpenSearch && (
              <button
                type="button"
                onClick={onOpenSearch}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer flex items-center gap-1.5 text-xs"
                title="Search (Cmd+K)"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden xl:inline text-[10px] text-slate-400 font-mono">Cmd+K</span>
              </button>
            )}

            {/* Right-Side Sidebar Drawer Button (Replaces three dots) */}
            <button
              type="button"
              onClick={() => setShowRightSidebar(true)}
              className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/15 to-purple-500/15 hover:from-amber-500/25 hover:to-purple-500/25 border border-white/15 text-amber-300 hover:text-white transition cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-xs active:scale-95"
              title="Open Workspace & Resources Sidebar"
            >
              <PanelRightOpen className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline font-mono">Tools</span>
            </button>

            {/* Notification Center */}
            <NotificationCenter onNavigateTab={onTabChange} userId={user?.id} />

            {/* User Auth Status */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenProfile) onOpenProfile();
                    onTabChange('profile');
                  }}
                  className="flex items-center gap-2 hover:opacity-85 transition cursor-pointer text-left"
                  title="View Student Profile"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="w-8 h-8 rounded-full border border-amber-400/60 object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs">
                      {user.displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs font-bold text-white hidden xl:inline max-w-[100px] truncate">
                    {user.displayName.split(' ')[0]}
                  </span>
                </button>

                <button
                  onClick={onSignOut}
                  className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onSignIn}
                  className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-semibold transition cursor-pointer"
                >
                  Log In
                </button>
                <button
                  onClick={onSignUp || onSignIn}
                  className="px-3.5 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold transition cursor-pointer shadow-md"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden rounded-xl bg-white/5 text-slate-300 hover:text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer (Clean, Uncluttered, Replaces bloated lower bar) */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10 space-y-2 animate-in fade-in text-xs font-semibold">
            <div className="grid grid-cols-2 gap-2 pb-2 border-b border-white/10">
              {(['Class 9', 'Class 10', 'Class 11', 'Class 12'] as const).map((cls) => (
                <button
                  key={cls}
                  onClick={() => {
                    onClassChange(cls);
                    setMobileMenuOpen(false);
                  }}
                  className={`py-1.5 px-3 rounded-lg text-center ${
                    activeClass === cls ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-white/5 text-slate-400'
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                onTabChange('landing');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left ${currentTab === 'landing' ? 'bg-white/15 text-white' : 'text-slate-300'}`}
            >
              <span>Home</span>
            </button>

            <button
              onClick={() => {
                onTabChange('studio');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left ${currentTab === 'studio' ? 'bg-amber-400/20 text-amber-300 font-bold' : 'text-slate-300'}`}
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Notes Directory</span>
            </button>

            <button
              onClick={() => {
                onTabChange('tests');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left ${currentTab === 'tests' ? 'bg-amber-400/20 text-amber-300 font-bold' : 'text-slate-300'}`}
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Tests &amp; Predictive Exams</span>
            </button>

            <button
              onClick={() => {
                if (onGoToLabs) onGoToLabs('virtual_academy');
                else onTabChange('labs');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left ${currentTab === 'labs' ? 'bg-purple-500/20 text-purple-300 font-bold' : 'text-slate-300'}`}
            >
              <FlaskConical className="w-4 h-4 text-purple-400" />
              <span>3D Labs &amp; Practicals</span>
            </button>

            <button
              onClick={() => {
                onTabChange('dashboard');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left ${currentTab === 'dashboard' ? 'bg-white/15 text-white' : 'text-slate-300'}`}
            >
              <LayoutDashboard className="w-4 h-4 text-amber-400" />
              <span>Adaptive Dashboard</span>
            </button>

            <button
              onClick={() => {
                onTabChange('profile');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left ${currentTab === 'profile' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-300'}`}
            >
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Profile &amp; Parents Info</span>
            </button>
          </div>
        )}
      </div>

      {/* Right-Side Sliding Workspace Sidebar Drawer */}
      <RightSidebarDrawer
        isOpen={showRightSidebar}
        onClose={() => setShowRightSidebar(false)}
        currentTab={currentTab}
        onTabChange={onTabChange}
        activeClass={activeClass}
        onClassChange={onClassChange}
        user={user}
        onSignOut={onSignOut}
        onSignIn={onSignIn}
        onOpenComplaint={onOpenComplaint}
        onGoToLabs={onGoToLabs}
      />
    </header>
  );
};
