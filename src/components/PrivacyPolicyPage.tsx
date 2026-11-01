import React from 'react';
import { Lock, Shield, ArrowLeft, CheckCircle2, EyeOff, Database } from 'lucide-react';

interface PrivacyPolicyPageProps {
  onBack: () => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onBack }) => {
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
        <span className="text-xs text-blue-400 font-mono">Last Updated: October 2026</span>
      </div>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-400/10 border border-blue-400/20 text-blue-400 text-xs font-semibold">
          <Lock className="w-3.5 h-3.5" />
          <span>Student Privacy Protocol</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          At Buzzing Brain, we strictly champion student digital sovereignty. We do not sell student data, track browsing behaviors, or serve commercial advertisements.
        </p>
      </div>

      <div className="astra-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 text-xs sm:text-sm leading-relaxed text-slate-300">
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span>1. What Student Information We Collect</span>
          </h2>
          <p>
            We collect only the bare minimum information necessary to maintain your student study library and authenticate your notes:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li><strong>Firebase Authentication Profile:</strong> Display name, verified email address, and avatar photo when you choose to log in with Google.</li>
            <li><strong>Study Content:</strong> The notes, custom paper preferences, and feedback tickets that you explicitly create and save.</li>
            <li><strong>Academic Preferences:</strong> Selected grade standard (e.g., Class 11, Class 10) to customize your syllabus view.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span>2. Zero Third-Party Advertising &amp; Zero Tracking</span>
          </h2>
          <p>
            Buzzing Brain is strictly ad-free. We do not partner with data brokers, advertising ad-tech networks, or behavioral tracking firms. Your study habits, search queries, and notes remain private to your educational account.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span>3. Cloud Security &amp; Firebase Firestore Rules</span>
          </h2>
          <p>
            Your data is stored in Google Cloud Firestore using hardened Attribute-Based Access Control (ABAC) rules. Only you and authorized system administrators can manage your account and tickets. Public notes in the student community library contain only the note content and author nickname without leaking private contact information.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span>4. Generative AI Data Handling</span>
          </h2>
          <p>
            When synthesizing notes with Gemini, queries are processed server-side through private API proxies. Your email address and personal identity are never included in the generation prompt payload or shared with public training models.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span>5. Account Deletion &amp; Data Portability</span>
          </h2>
          <p>
            You have the complete right to export your notes as CSV or PDF at any time, or request full deletion of your user profile and tickets by contacting administration or through the Grievance Desk.
          </p>
        </section>
      </div>
    </div>
  );
};
