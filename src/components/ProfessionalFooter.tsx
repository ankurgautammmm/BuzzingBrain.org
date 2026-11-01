import React from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Award, 
  FlaskConical, 
  Heart, 
  Dna, 
  ShieldCheck, 
  Lock, 
  FileText, 
  Youtube, 
  ExternalLink, 
  HelpCircle, 
  GraduationCap,
  Scale,
  CheckCircle2,
  Atom,
  Eye,
  Activity
} from 'lucide-react';
import { NavTab } from './Navbar';

interface ProfessionalFooterProps {
  onNavigate: (tab: NavTab) => void;
  onOpenComplaint: () => void;
  onGoToLabs?: (subTab?: any) => void;
}

export const ProfessionalFooter: React.FC<ProfessionalFooterProps> = ({
  onNavigate,
  onOpenComplaint,
  onGoToLabs,
}) => {
  return (
    <footer className="bg-[#050814] border-t border-white/10 text-slate-400 text-xs print:hidden no-print relative z-10 mt-20">
      {/* Top Academic Accreditation & National Framework Banner */}
      <div className="border-b border-white/10 bg-white/2 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4 text-[11px]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Aligned with NEP 2020 &amp; NCF Curriculum</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-semibold">
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              <span>National Digital Library of India (NDLI - IIT Kharagpur) Integrated</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Powered by Gemini 2.0 Flash AI Engine</span>
            </span>
          </div>

          <div className="text-slate-500 font-mono text-[10px]">
            ISO/IEC 27001 Data Privacy Standard &bull; DPDP Act 2023 Compliant
          </div>
        </div>
      </div>

      {/* Main 4-Column Professional Academic Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Column 1: Platform Mission & Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/BuzzingBrain_Video_Watermark_150x150.png"
                alt="Buzzing Brain"
                className="w-10 h-10 rounded-full border border-amber-400/80 shadow-md object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div>
                <h3 className="font-extrabold text-base text-white tracking-tight flex items-center gap-1.5">
                  <span>BuzzingBrain</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
                    AI
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">Free Open Education for All</p>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed">
              India&apos;s open, publication-grade academic and STEM simulation platform. Dedicated to providing free, high-yield NCERT study materials, 50-year predictive exam analytics, and interactive 3D virtual laboratories to every student across Bharat.
            </p>

            <div className="pt-2 text-[11px] space-y-1 text-slate-400">
              <div className="flex items-center gap-2">
                <Youtube className="w-4 h-4 text-red-500 shrink-0" />
                <a
                  href="https://www.youtube.com/@BrainBuzz2702"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition font-mono"
                >
                  @BrainBuzz2702 (Official Channel)
                </a>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Ads &bull; 100% Free Non-Profit Initiative</span>
              </div>
            </div>
          </div>

          {/* Column 2: Academic Programs & Examinations */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider font-mono flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>Examination Programs</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('tests')}
                  className="hover:text-amber-300 text-slate-300 transition text-left flex items-center justify-between w-full cursor-pointer"
                >
                  <span>NEET-UG Medical Entrance &amp; Droppers</span>
                  <span className="text-[10px] text-amber-400 font-mono">720 Marks</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tests')}
                  className="hover:text-amber-300 text-slate-300 transition text-left flex items-center justify-between w-full cursor-pointer"
                >
                  <span>JEE Main &amp; Advanced (IIT Entrance)</span>
                  <span className="text-[10px] text-amber-400 font-mono">300 Marks</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('studio')}
                  className="hover:text-amber-300 text-slate-300 transition text-left flex items-center justify-between w-full cursor-pointer"
                >
                  <span>CBSE Class 12 Board Examinations</span>
                  <span className="text-[10px] text-slate-500 font-mono">PCM/PCB</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('studio')}
                  className="hover:text-amber-300 text-slate-300 transition text-left flex items-center justify-between w-full cursor-pointer"
                >
                  <span>CBSE Class 11 Foundation &amp; Olympiad</span>
                  <span className="text-[10px] text-slate-500 font-mono">Science</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('studio')}
                  className="hover:text-amber-300 text-slate-300 transition text-left flex items-center justify-between w-full cursor-pointer"
                >
                  <span>CBSE Class 10 &amp; Class 9 Secondary</span>
                  <span className="text-[10px] text-slate-500 font-mono">NCERT Core</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tests')}
                  className="hover:text-amber-300 text-slate-300 transition text-left flex items-center justify-between w-full cursor-pointer"
                >
                  <span>50-Year Predictive PYQ Archives</span>
                  <span className="text-[10px] text-emerald-400 font-mono">1975–2025</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: 3D Laboratories & Interactive STEM */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider font-mono flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-purple-400" />
              <span>3D Labs &amp; Virtual Apparatus</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onGoToLabs ? onGoToLabs('organs3d') : onNavigate('labs')}
                  className="hover:text-purple-300 text-slate-300 transition text-left flex items-center justify-between w-full cursor-pointer"
                >
                  <span>3D Human Anatomy &amp; Organ Systems</span>
                  <span className="text-[10px] text-purple-400 font-mono">9 Organs</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onGoToLabs ? onGoToLabs('scilab') : onNavigate('labs')}
                  className="hover:text-cyan-300 text-slate-300 transition text-left flex items-center justify-between w-full cursor-pointer"
                >
                  <span>SciLab BioMolecular (AlphaFold &amp; MD)</span>
                  <span className="text-[10px] text-cyan-400 font-mono">PDB / MD</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onGoToLabs ? onGoToLabs('virtual_academy') : onNavigate('labs')}
                  className="hover:text-purple-300 text-slate-300 transition text-left flex items-center justify-between w-full cursor-pointer"
                >
                  <span>Virtual Practical Academy (Stages 1–6)</span>
                  <span className="text-[10px] text-slate-500 font-mono">NCERT Lab</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onGoToLabs ? onGoToLabs('virtual_tools') : onNavigate('labs')}
                  className="hover:text-purple-300 text-slate-300 transition text-left flex items-center justify-between w-full cursor-pointer"
                >
                  <span>Calibrated Virtual Instruments</span>
                  <span className="text-[10px] text-slate-500 font-mono">pH &bull; Balance</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onGoToLabs ? onGoToLabs('mindmaps') : onNavigate('labs')}
                  className="hover:text-purple-300 text-slate-300 transition text-left flex items-center justify-between w-full cursor-pointer"
                >
                  <span>Interactive Concept Mind Maps</span>
                  <span className="text-[10px] text-slate-500 font-mono">Visual Tree</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onGoToLabs ? onGoToLabs('journal') : onNavigate('labs')}
                  className="hover:text-emerald-300 text-slate-300 transition text-left flex items-center justify-between w-full cursor-pointer"
                >
                  <span>Experiment Journal &amp; Lab Reports</span>
                  <span className="text-[10px] text-emerald-400 font-mono">PDF Export</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Official Repositories & Compliance */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider font-mono flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Digital Books &amp; Support</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://ndl.iitkgp.ac.in/ndl_se"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-300 text-slate-300 transition flex items-center justify-between w-full"
                >
                  <span>National Digital Library (NDLI IIT KGP)</span>
                  <ExternalLink className="w-3 h-3 text-cyan-400" />
                </a>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('books')}
                  className="hover:text-amber-300 text-slate-300 transition text-left flex items-center justify-between w-full cursor-pointer"
                >
                  <span>Official NCERT Digital Textbooks</span>
                  <span className="text-[10px] text-slate-500 font-mono">2026–27</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenComplaint}
                  className="hover:text-amber-300 text-slate-300 transition text-left flex items-center justify-between w-full cursor-pointer"
                >
                  <span>Student Grievance Redressal Cell</span>
                  <HelpCircle className="w-3 h-3 text-amber-400" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('terms')}
                  className="hover:text-white text-slate-300 transition text-left flex items-center justify-between w-full cursor-pointer"
                >
                  <span>Terms of Academic Service</span>
                  <FileText className="w-3 h-3 text-slate-500" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-white text-slate-300 transition text-left flex items-center justify-between w-full cursor-pointer"
                >
                  <span>Privacy Policy &amp; Data Consent</span>
                  <Lock className="w-3 h-3 text-slate-500" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('profile')}
                  className="hover:text-cyan-300 text-slate-300 transition text-left flex items-center justify-between w-full cursor-pointer"
                >
                  <span>Student ID &amp; Parent Verification</span>
                  <span className="text-[10px] text-cyan-400 font-mono">Profile</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Horizontal Bar */}
        <div className="pt-8 mt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span>&copy; {new Date().getFullYear()} Buzzing Brain &bull; Free Education for All.</span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span>All NCERT and CBSE references strictly conform to official curriculum guidelines.</span>
          </div>

          <div className="flex items-center gap-4 font-mono text-[10px]">
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Database: MongoDB Active</span>
            </span>
            <span className="text-slate-400">v4.8.0 Release</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
