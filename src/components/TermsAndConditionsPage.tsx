import React from 'react';
import { FileText, Shield, ArrowLeft, CheckCircle2, AlertTriangle, BookOpen } from 'lucide-react';

interface TermsAndConditionsPageProps {
  onBack: () => void;
}

export const TermsAndConditionsPage: React.FC<TermsAndConditionsPageProps> = ({ onBack }) => {
  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 space-y-8 text-slate-200">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
        <span className="text-xs text-amber-400 font-mono">Last Updated: October 2026</span>
      </div>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-semibold">
          <FileText className="w-3.5 h-3.5" />
          <span>Legal Agreement</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Terms and Conditions
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          Please read these terms carefully before accessing or using Buzzing Brain. By using the platform, you agree to these academic terms.
        </p>
      </div>

      <div className="astra-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 text-xs sm:text-sm leading-relaxed text-slate-300">
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span>1. Free Education for All Charter</span>
          </h2>
          <p>
            Buzzing Brain is founded on the fundamental principle that every student, regardless of socio-economic background, deserves free, uninterrupted access to world-class educational tools, NCERT textbook outlines, and handwritten study notes. No subscription, credit card, or paywall is required to access our core study features.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span>2. Intellectual Property &amp; NCERT Curriculum Alignment</span>
          </h2>
          <p>
            The curriculum topics, chapter lists, and educational taxonomies referenced on Buzzing Brain are aligned with public pedagogical syllabi published by the National Council of Educational Research and Training (NCERT) and the Central Board of Secondary Education (CBSE), New Delhi, India.
          </p>
          <p>
            Buzzing Brain does not claim ownership of official NCERT textbook copyrights; we provide an open analytical interface, revision study notes, and educational commentary designed to support student learning.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span>3. Acceptable Academic Usage</span>
          </h2>
          <p>
            Users agree to use Buzzing Brain exclusively for genuine educational, revision, and study purposes. Prohibited activities include:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li>Using automated crawlers, scrapers, or bot scripts to flood backend synthesis endpoints.</li>
            <li>Submitting non-academic, harmful, or abusive inputs into the generation engine.</li>
            <li>Misrepresenting AI-generated draft notes as official government-issued examination answer keys.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span>4. Study Notes Ownership &amp; Personal License</span>
          </h2>
          <p>
            You retain full personal ownership of all study notes, handwritten PDFs, and revision checklists you generate or save on Buzzing Brain. You are free to download, print, share with classmates, or bind your study materials without royalty obligations.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span>5. Grievance Redressal</span>
          </h2>
          <p>
            If you encounter a syllabus discrepancy, equation error, or technical bug, you are entitled to submit an official ticket via our Grievance Desk. Our administrative team commits to reviewing academic reports and maintaining syllabus fidelity.
          </p>
        </section>

        <section className="space-y-2 border-t border-white/10 pt-4">
          <h2 className="text-base sm:text-lg font-bold text-amber-300 flex items-center gap-2">
            <span>6. Minimum &amp; Necessary Data Usage with Informed Consent</span>
          </h2>
          <p>
            Buzzing Brain strictly adheres to principles of educational data minimization. We only collect the minimal, necessary data required to deliver educational services:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li><strong>Account Identity:</strong> Display name and email to synchronize your personal study locker across devices.</li>
            <li><strong>Phone / WhatsApp:</strong> Contact info for two-factor security and optional scorecards/revision updates sent to parents or guardians with explicit consent.</li>
            <li><strong>Academic Telemetry:</strong> Test attempts and mistake journals, strictly utilized for your personalized adaptive learning recommendations.</li>
            <li><strong>Zero Commercial Monetization:</strong> Student data is never sold, leased, or traded to third-party commercial advertisers or data brokers.</li>
          </ul>
        </section>

        <section className="space-y-2 border-t border-white/10 pt-4">
          <h2 className="text-base sm:text-lg font-bold text-emerald-300 flex items-center gap-2">
            <span>7. Backend Cryptographic Authentication &amp; Zero Frontend Data Leakage</span>
          </h2>
          <p>
            All administrative, academic synthesis, and user-sensitive backend endpoints require cryptographic Bearer ID tokens verified by Google/Firebase Admin SDK. Student passwords are never stored in plain text; they are secured using hardened PBKDF2/scrypt one-way cryptographic hashing. Private API keys and administrative records are quarantined on the server and are never revealed or leaked into client-side frontend browser bundles.
          </p>
        </section>
      </div>
    </div>
  );
};
