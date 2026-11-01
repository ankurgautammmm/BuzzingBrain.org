import React from 'react';
import { 
  Play, 
  ExternalLink, 
  CheckCircle2, 
  Users, 
  Sparkles, 
  Tv, 
  GraduationCap, 
  Bell,
  Share2
} from 'lucide-react';

interface YouTubeChannelSectionProps {
  channelUrl?: string;
}

export const YouTubeChannelSection: React.FC<YouTubeChannelSectionProps> = ({
  channelUrl = 'https://www.youtube.com/@BrainBuzz2702',
}) => {
  const featuredPlaylists = [
    {
      title: "Class 11 Physics: Kinematics & Laws of Motion",
      category: "Physics Derivations",
      videosCount: 14,
      desc: "Complete derivation of projectile motion, friction banking of roads, and rotational dynamics.",
      badge: "Class 11 Focus"
    },
    {
      title: "Class 11 Chemistry: Chemical Bonding & Hybridisation",
      category: "Inorganic Chemistry",
      videosCount: 12,
      desc: "Master VSEPR theory, orbital hybridisation, and molecular orbital diagrams.",
      badge: "Class 11 Focus"
    },
    {
      title: "Class 10 Science: Full Syllabus Board Exam Revisions",
      category: "Board Exam Revision",
      videosCount: 16,
      desc: "High-probability board exam questions, chemical reaction balancing, and nephron ray diagrams.",
      badge: "CBSE Board"
    },
    {
      title: "Class 12 Physics: Wave Optics & Electrostatics",
      category: "Senior Physics",
      videosCount: 18,
      desc: "Young's Double Slit experiment, Huygens principle, Gauss law applications with model answers.",
      badge: "Class 12 Focus"
    },
    {
      title: "Educational News & Current Affairs Digest",
      category: "CBSE Academic Bulletins",
      videosCount: 22,
      desc: "National education updates, CBSE circulars, exam schedule releases, and topper study tips.",
      badge: "Academic News"
    },
    {
      title: "Handwritten Notes & Topper Study Framework",
      category: "Study Methodology",
      videosCount: 8,
      desc: "How to craft neat, concise handwritten notes that capture derivations and formulas effectively.",
      badge: "Study Strategies"
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto py-6 space-y-6">
      {/* Channel Hero Header Card */}
      <div className="astra-card rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          {/* Logo Badge */}
          <div className="relative shrink-0">
            <img
              src="/BuzzingBrain_Video_Watermark_150x150.png"
              alt="Buzzing Brain Channel Logo"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-amber-400/80 shadow-xl shadow-amber-500/20 object-cover"
              onError={(e) => {
                // fallback if image fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="absolute -bottom-1 -right-1 bg-rose-600 text-white p-1.5 rounded-full border border-black shadow-md">
              <Play className="w-3.5 h-3.5 fill-white" />
            </div>
          </div>

          {/* Channel Info */}
          <div className="text-center sm:text-left flex-1 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              <span>Official YouTube Educational Community</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span>Buzzing Brain</span>
              <CheckCircle2 className="w-5 h-5 text-amber-400" />
            </h2>

            <p className="text-amber-400/90 text-xs font-mono font-semibold tracking-wider">
              NEWS &bull; EDUCATION &bull; A BRIGHTER TOMORROW
            </p>

            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Welcome to the official <strong>Buzzing Brain</strong> YouTube channel! Dedicated to <em>Free Education for All</em>, bringing conceptual NCERT video masterclasses, board exam strategies, and educational current affairs.
            </p>

            <div className="pt-3 flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <a
                href={channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-rose-600/30 cursor-pointer active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Subscribe on YouTube (@BrainBuzz2702)</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <a
                href={`${channelUrl}/videos`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/15 text-white rounded-xl text-xs font-semibold transition-all"
              >
                <span>Browse All Lectures</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Featured YouTube Series & Playlists */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Tv className="w-5 h-5 text-rose-500" />
              <span>Curated Video Playlists &amp; Series</span>
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">
              High-yield video lectures synchronized with our handwritten notes.
            </p>
          </div>

          <a
            href={`${channelUrl}/playlists`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>View All Playlists</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredPlaylists.map((pl, idx) => (
            <div
              key={idx}
              className="astra-card astra-card-hover rounded-2xl p-5 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-semibold text-[11px] border border-rose-500/20">
                    {pl.badge}
                  </span>
                  <span className="font-mono text-slate-400 text-[11px]">
                    {pl.videosCount} Lectures
                  </span>
                </div>

                <h4 className="font-bold text-white text-base group-hover:text-amber-300 transition-colors line-clamp-2">
                  {pl.title}
                </h4>

                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {pl.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[11px]">
                  {pl.category}
                </span>

                <a
                  href={channelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-rose-600 hover:text-white text-slate-300 rounded-xl transition-all font-semibold"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Watch Free</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
