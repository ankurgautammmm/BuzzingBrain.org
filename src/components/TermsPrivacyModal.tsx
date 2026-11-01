import React from 'react';
import { Shield, FileText, Lock, CheckCircle2, X } from 'lucide-react';

interface TermsPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'terms' | 'privacy';
}

export const TermsPrivacyModal: React.FC<TermsPrivacyModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'terms',
}) => {
  const [activeTab, setActiveTab] = React.useState<'terms' | 'privacy'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-slate-900 text-base">NCERT ScribbleAI Legal &amp; Compliance Center</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-100 px-5 pt-3 gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('terms')}
            className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'terms' ? 'border-amber-600 text-amber-800 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Terms and Conditions</span>
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'privacy' ? 'border-amber-600 text-amber-800 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Privacy Policy &amp; Student Data Protection</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed flex-1">
          {activeTab === 'terms' ? (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 font-medium">
                Last updated: October 2026. By accessing or using NCERT ScribbleAI, students, educators, and guardians agree to these terms.
              </div>

              <section className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">1. Purpose and Educational Scope</h4>
                <p>
                  NCERT ScribbleAI is an autonomous pedagogical platform engineered exclusively for educational study note generation, CBSE/NCERT curriculum alignment, and conceptual learning assistance. All synthesized notes are intended as study aids and reference material.
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">2. /handwriting Command &amp; Acceptable Usage</h4>
                <p>
                  Users agree to employ the <code>/handwriting</code> command strictly for academic topics covering standard NCERT subjects (Classes 6 through 12). Prohibited behaviors include:
                </p>
                <ul className="list-disc pl-5 space-y-0.5">
                  <li>Generating plagiarized, deceptive, or non-educational content.</li>
                  <li>Attempting to bypass syllabus guardrails or inject malicious system prompts.</li>
                  <li>Overloading backend inference endpoints through automated scraping scripts.</li>
                </ul>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">3. Intellectual Property and Curriculum Accuracy</h4>
                <p>
                  NCERT syllabus references, chapter outlines, and exemplar questions are based on publicly published educational frameworks by the National Council of Educational Research and Training (NCERT). While our AI engine uses advanced thinking models, students are encouraged to cross-reference formulas and chemical equations with official prescribed textbooks.
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">4. Grievance Redressal &amp; Support</h4>
                <p>
                  Users may submit discrepancies, syllabus mismatches, or rendering glitches via the built-in Grievance Desk. Academic administrators review and update curriculum mapping in accordance with CBSE standards.
                </p>
              </section>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-900 font-medium">
                Student Privacy Commitment: We adhere to zero-commercialization student data standards.
              </div>

              <section className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">1. Information We Collect</h4>
                <p>
                  When you sign in via Google Firebase Authentication, we collect:
                </p>
                <ul className="list-disc pl-5 space-y-0.5">
                  <li><strong>Account Identity:</strong> Display name, email address, and avatar URL for personalizing your student profile.</li>
                  <li><strong>Academic Preferences:</strong> Class grade (e.g., Class 10), subject focus, and saved handwritten notes.</li>
                  <li><strong>Grievance Records:</strong> Ticket category and problem descriptions submitted to our support team.</li>
                </ul>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">2. Use of Firebase Authentication &amp; Firestore</h4>
                <p>
                  All profile records, saved notes, and grievance tickets are persisted in Google Cloud Firebase Firestore with strict Attribute-Based Access Control (ABAC) security rules. Private study notes remain strictly inaccessible to unauthorized third parties.
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">3. Generative AI Safety &amp; Telemetry</h4>
                <p>
                  Study note synthesis queries are processed server-side through Gemini API with secure API credentials. No user emails or personal identifiers are passed to public training datasets.
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">4. Data Ownership &amp; Export</h4>
                <p>
                  Students own all study notes generated on this platform. You may print, save as high-resolution PDF, or delete your study notes at any time from your personal library.
                </p>
              </section>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Close &amp; Return
          </button>
        </div>
      </div>
    </div>
  );
};
