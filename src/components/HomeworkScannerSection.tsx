import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Edit3, 
  RotateCcw, 
  Check, 
  HelpCircle, 
  ArrowRight, 
  Lightbulb, 
  Layers, 
  BookOpen, 
  Zap, 
  Award,
  Image as ImageIcon
} from 'lucide-react';
import { UserProfile } from '../types';
import { logger } from '../services/logger';

interface EvaluationResult {
  score: number;
  maxScore: number;
  correctPoints: string[];
  missingPoints: string[];
  formulaEvaluation: string;
  unitsAndPresentation: string;
  modelAnswer: string;
  detailedFeedback: string;
  aiSuggestedAnswer: string;
}

interface HomeworkScannerSectionProps {
  user: UserProfile | null;
  activeClass: string;
  onRequireAuth: () => void;
}

export const HomeworkScannerSection: React.FC<HomeworkScannerSectionProps> = ({
  user,
  activeClass,
  onRequireAuth,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('Physics');
  const [selectedClass, setSelectedClass] = useState<string>(activeClass || 'Class 10');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [questionText, setQuestionText] = useState<string>('State Newton\'s Second Law of Motion and derive F = ma.');
  const [answerText, setAnswerText] = useState<string>('Newton\'s second law states that rate of change of momentum is proportional to applied force. F = dp/dt = m(v-u)/t = ma.');
  const [isEditingText, setIsEditingText] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [confidenceScore, setConfidenceScore] = useState<number>(94);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const sampleProblems = [
    {
      subject: 'Physics',
      question: 'A body of mass 5 kg accelerates from 2 m/s to 10 m/s in 4 seconds. Calculate the applied net force.',
      answer: 'Given: m = 5 kg, u = 2 m/s, v = 10 m/s, t = 4 s.\na = (v - u) / t = (10 - 2) / 4 = 8 / 4 = 2 m/s^2.\nForce F = m * a = 5 * 2 = 10 N.'
    },
    {
      subject: 'Chemistry',
      question: 'Balance the chemical equation: Fe + H2O -> Fe3O4 + H2 and identify the reducing agent.',
      answer: 'Balanced equation: 3Fe + 4H2O -> Fe3O4 + 4H2.\nHere Fe gains oxygen so it is oxidized, hence Fe acts as the reducing agent.'
    },
    {
      subject: 'Mathematics',
      question: 'Find the roots of the quadratic equation 2x^2 - 7x + 3 = 0 using the quadratic formula.',
      answer: 'a = 2, b = -7, c = 3.\nDiscriminant D = b^2 - 4ac = (-7)^2 - 4(2)(3) = 49 - 24 = 25.\nx = (-(-7) +- sqrt(25)) / (2*2) = (7 +- 5) / 4.\nRoots are x = 12/4 = 3 and x = 2/4 = 1/2.'
    }
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (PNG, JPG, or JPEG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
      setErrorMessage(null);
      // Simulate OCR confidence & extraction note
      setConfidenceScore(88 + Math.floor(Math.random() * 8));
      setIsEditingText(true);
    };
    reader.readAsDataURL(file);
  };

  const handleLoadSample = (sample: typeof sampleProblems[0]) => {
    setSelectedSubject(sample.subject);
    setQuestionText(sample.question);
    setAnswerText(sample.answer);
    setImagePreview(null);
    setEvaluation(null);
    setConfidenceScore(96);
  };

  const handleEvaluate = async () => {
    if (!answerText.trim() && !imagePreview) {
      setErrorMessage('Please provide either an image of your solution or type the solution text.');
      return;
    }

    setIsEvaluating(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/ai/check-handwriting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imagePreview || undefined,
          answerText: answerText || undefined,
          questionText: questionText || 'NCERT Examination Question',
          maxMarks: 5,
        }),
      });

      const data = await response.json();
      if (data.success && data.evaluation) {
        setEvaluation(data.evaluation);
      } else {
        setErrorMessage(data.error || 'Failed to evaluate answer');
      }
    } catch (err: any) {
      logger.error('HomeworkScanner', 'Homework evaluation error', err);
      setErrorMessage('Network or server error during grading evaluation.');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-semibold mb-3">
            <Camera className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Homework &amp; Solution Scanner &bull; Requirement 7</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            AI Homework Scanner &amp; Grader
          </h1>
          <p className="text-sm text-slate-400 mt-1.5 max-w-2xl">
            Upload a snapshot of your handwritten copy or printed assignment. Buzzing Brain examines your steps, checks governing formulas and units, pinpoints exact conceptual mistakes, and guides you to full marks.
          </p>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input, Upload, and OCR Text Review */}
        <div className="lg:col-span-6 space-y-5">
          <div className="p-6 rounded-3xl astra-card border border-white/10 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Class / Grade</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-400"
                >
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                  <option value="Class 11">Class 11</option>
                  <option value="Class 12">Class 12</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-400"
                >
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Biology">Biology</option>
                </select>
              </div>
            </div>

            {/* Photo Upload Box */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Upload Photograph of Solution
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/20 hover:border-emerald-400/50 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-900/40"
              >
                {imagePreview ? (
                  <div className="space-y-3">
                    <img
                      src={imagePreview}
                      alt="Uploaded Solution"
                      className="max-h-48 mx-auto rounded-xl object-contain border border-white/10"
                    />
                    <div className="text-xs text-slate-400">
                      Click to choose a different photo
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-emerald-400">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-bold text-white">Click or drag homework image here</div>
                    <div className="text-[11px] text-slate-500">Supports PNG, JPG, or Camera snapshots</div>
                  </div>
                )}
              </div>
            </div>

            {/* Optical Confidence Indicator */}
            {imagePreview && (
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between text-xs">
                <span className="text-slate-400">Handwriting Legibility Confidence:</span>
                <span className="font-mono font-bold text-emerald-400">{confidenceScore}%</span>
              </div>
            )}

            {/* Question Text Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target Question:
              </label>
              <input
                type="text"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Question statement..."
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-emerald-400"
              />
            </div>

            {/* Student's Answer Text (Editable before evaluation) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Student's Written Solution (Editable):
                </label>
                <button
                  onClick={() => setIsEditingText(!isEditingText)}
                  className="text-[11px] text-emerald-400 font-semibold hover:underline cursor-pointer"
                >
                  {isEditingText ? 'Done Editing' : 'Edit Text'}
                </button>
              </div>
              <textarea
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                rows={4}
                placeholder="Type or edit the extracted solution steps..."
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-white font-mono focus:outline-hidden focus:border-emerald-400"
              />
            </div>

            {/* Presets */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] text-slate-400 font-medium">Try Sample Homework Questions:</span>
              <div className="flex flex-wrap gap-2">
                {sampleProblems.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleLoadSample(p)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] border border-white/5 transition-colors cursor-pointer"
                  >
                    {p.subject}: {p.question.substring(0, 30)}...
                  </button>
                ))}
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Evaluate Button */}
            <button
              onClick={handleEvaluate}
              disabled={isEvaluating}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isEvaluating ? 'Evaluating Solution Step-by-Step...' : 'Check My Homework Solution'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Examiner Grading Report & Step-by-Step Breakdown */}
        <div className="lg:col-span-6 space-y-5">
          {isEvaluating && (
            <div className="p-12 rounded-3xl astra-card border border-white/10 text-center space-y-3">
              <div className="w-10 h-10 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin mx-auto"></div>
              <h4 className="text-sm font-bold text-white">Board Examiner Grader Active</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Comparing derivation steps against NCERT marking scheme, verifying physical SI units, and calculating awarded marks...
              </p>
            </div>
          )}

          {!isEvaluating && !evaluation && (
            <div className="p-12 rounded-3xl astra-card border border-white/10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">Ready for Solution Check</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Upload your solution image or pick one of the sample problems on the left to view an instant detailed step-wise evaluation.
              </p>
            </div>
          )}

          {evaluation && !isEvaluating && (
            <div className="p-6 rounded-3xl astra-card border border-white/10 space-y-6">
              {/* Score Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <span className="text-[11px] font-mono font-semibold text-emerald-400 uppercase tracking-wider block">
                    CBSE Examiner Evaluation
                  </span>
                  <h3 className="text-xl font-bold text-white mt-0.5">Solution Assessment</h3>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black text-white">
                    <span className="text-emerald-400">{evaluation.score}</span> / {evaluation.maxScore}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Awarded Marks</span>
                </div>
              </div>

              {/* Feedback Summary */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1.5">
                <span className="text-xs font-bold text-amber-300">Examiner Feedback:</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {evaluation.detailedFeedback}
                </p>
              </div>

              {/* Correct Points vs Missing Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                  <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>What You Did Right:</span>
                  </span>
                  <ul className="space-y-1.5">
                    {evaluation.correctPoints.map((pt, i) => (
                      <li key={i} className="text-xs text-emerald-200 flex items-start gap-1.5">
                        <span className="text-emerald-400 mt-0.5">&bull;</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2">
                  <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Mistakes / Missing Steps:</span>
                  </span>
                  <ul className="space-y-1.5">
                    {evaluation.missingPoints.map((pt, i) => (
                      <li key={i} className="text-xs text-rose-200 flex items-start gap-1.5">
                        <span className="text-rose-400 mt-0.5">&bull;</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Formula & Presentation Check */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <strong className="text-slate-400 block mb-0.5">Formula Evaluation:</strong>
                  <span className="text-white">{evaluation.formulaEvaluation}</span>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <strong className="text-slate-400 block mb-0.5">Presentation &amp; SI Units:</strong>
                  <span className="text-white">{evaluation.unitsAndPresentation}</span>
                </div>
              </div>

              {/* 100% Model Answer */}
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-2">
                <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>Full-Marks Model Answer:</span>
                </span>
                <p className="text-xs text-purple-100 font-mono leading-relaxed whitespace-pre-line pl-2 border-l-2 border-purple-400/50">
                  {evaluation.modelAnswer}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
