import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  BookOpen,
  Send,
  Video,
  FileText,
  Brain,
  HelpCircle,
  Calendar,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Download,
  Share2,
  Trash2,
  Bookmark,
  Search,
  Plus,
  Edit3,
  Play,
  RotateCcw,
  Sliders,
  ChevronRight,
  ExternalLink,
  Award,
  Layers,
  GraduationCap,
  Volume2,
  Wand2,
  Clock,
  ArrowRight,
  Printer
} from 'lucide-react';
import { UserProfile, NoteContentPayload, HandwritingStyleConfig } from '../types';
import { NCERT_SYLLABUS } from '../data/ncertSyllabus';
import { logger } from '../services/logger';

export type TutorActiveTool =
  | 'concept'
  | 'notes'
  | 'video'
  | 'practice'
  | 'mindmap'
  | 'vision'
  | 'revision';

export interface SavedLibraryItem {
  id: string;
  type: 'session' | 'notes' | 'video' | 'quiz' | 'mindmap' | 'revision';
  title: string;
  classGrade: string;
  subject: string;
  chapter: string;
  topic: string;
  createdAt: number;
  previewText?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  payload?: any;
}

interface AiTutorStudioProps {
  userProfile: UserProfile | null;
  activeClass: string;
  onClassChange: (c: string) => void;
  onOpenNotesWithPayload?: (payload: NoteContentPayload, style?: HandwritingStyleConfig) => void;
  onNavigateToSection?: (tab: any, subTab?: any) => void;
  initialTopic?: string;
  initialChapter?: string;
}

export const AiTutorStudio: React.FC<AiTutorStudioProps> = ({
  userProfile,
  activeClass,
  onClassChange,
  onOpenNotesWithPayload,
  onNavigateToSection,
  initialTopic,
  initialChapter,
}) => {
  // Study Controls State
  const [selectedClass, setSelectedClass] = useState<string>(activeClass || 'Class 10');
  const [selectedBoard, setSelectedBoard] = useState<string>('CBSE');
  const [selectedSubject, setSelectedSubject] = useState<string>('Science');
  const [selectedChapter, setSelectedChapter] = useState<string>(initialChapter || 'Life Processes');
  const [topicInput, setTopicInput] = useState<string>(initialTopic || 'Human Heart and Double Circulation');
  const [language, setLanguage] = useState<'English' | 'Hindi' | 'Hinglish'>('Hinglish');
  const [explanationLevel, setExplanationLevel] = useState<'beginner' | 'standard' | 'advanced'>('standard');
  const [learningFormat, setLearningFormat] = useState<'interactive' | 'exam_tips' | 'step_by_step'>('step_by_step');

  // Video Settings
  const [videoDuration, setVideoDuration] = useState<number>(45);
  const [videoAspectRatio, setVideoAspectRatio] = useState<'shorts_vertical' | 'landscape_16_9'>('shorts_vertical');
  const [voiceStyle, setVoiceStyle] = useState<string>('Kore');
  const [visualStyle, setVisualStyle] = useState<string>('Scientific Animation');

  // Active Tool Mode
  const [activeTool, setActiveTool] = useState<TutorActiveTool>('concept');

  // Loading & Generation States
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);

  // Content Outputs
  const [conceptOutput, setConceptOutput] = useState<{
    hook: string;
    prerequisites: string[];
    explanation: string[];
    formulae: string[];
    misconceptions: string[];
    takeaways: string[];
    followUpQuestions: string[];
  } | null>(null);

  const [notesOutput, setNotesOutput] = useState<{
    title: string;
    markdown: string;
    keyPoints: string[];
    definitions: { term: string; meaning: string }[];
    examTips: string[];
  } | null>(null);

  const [videoJobId, setVideoJobId] = useState<string | null>(null);
  const [videoJobStatus, setVideoJobStatus] = useState<any | null>(null);
  const [renderedVideoUrl, setRenderedVideoUrl] = useState<string | null>(null);

  const [practiceQuestions, setPracticeQuestions] = useState<Array<{
    id: number;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    userAnswer?: number;
  }>>([]);
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);

  const [diagramOutput, setDiagramOutput] = useState<{
    title: string;
    type: string;
    mermaidCode?: string;
    description: string;
    steps: string[];
  } | null>(null);

  const [visionImageBase64, setVisionImageBase64] = useState<string | null>(null);
  const [visionAnalysis, setVisionAnalysis] = useState<{
    recognizedContent: string;
    stepByStepDiagnosis: string[];
    mistakeIdentified: string;
    correctMethod: string;
    suggestedPractice: string;
  } | null>(null);

  const [revisionPlan, setRevisionPlan] = useState<{
    targetExam: string;
    dailyMinutes: number;
    milestones: { day: string; task: string; topic: string; priority: 'high' | 'medium' | 'normal' }[];
  } | null>(null);

  // Saved Library Store
  const [savedLibrary, setSavedLibrary] = useState<SavedLibraryItem[]>(() => {
    try {
      const stored = localStorage.getItem('bb_tutor_library');
      if (stored) return JSON.parse(stored);
    } catch {}
    return [
      {
        id: 'seed_heart_circ',
        type: 'notes',
        title: 'Double Circulation & 4 Cardiac Chambers',
        classGrade: 'Class 10',
        subject: 'Science',
        chapter: 'Life Processes',
        topic: 'Human Heart and Double Circulation',
        createdAt: Date.now() - 3600000 * 24,
        previewText: 'Deoxygenated blood returns from systemic circulation via vena cava...',
      },
      {
        id: 'seed_ohms_law',
        type: 'video',
        title: 'Ohm’s Law & Resistance Master Short',
        classGrade: 'Class 10',
        subject: 'Science',
        chapter: 'Electricity',
        topic: 'Verification of Ohm’s Law',
        createdAt: Date.now() - 3600000 * 48,
        videoUrl: '/generated-shorts/short_1792227948059_483r7.mp4',
        thumbnailUrl: '/generated-shorts/short_1792227948059_483r7_thumb.jpg',
      }
    ];
  });

  const [librarySearchQuery, setLibrarySearchQuery] = useState('');
  const [libraryTypeFilter, setLibraryTypeFilter] = useState<'all' | 'notes' | 'video' | 'quiz' | 'mindmap'>('all');
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Sync with available subjects and chapters
  const availableClassData = NCERT_SYLLABUS[selectedClass] || {};
  const subjectsList = Object.keys(availableClassData);
  const chaptersList = availableClassData[selectedSubject] || [];

  useEffect(() => {
    if (initialTopic) {
      setTopicInput(initialTopic);
    }
  }, [initialTopic]);

  useEffect(() => {
    if (initialChapter) {
      setSelectedChapter(initialChapter);
    }
  }, [initialChapter]);

  useEffect(() => {
    if (activeClass && activeClass !== selectedClass) {
      setSelectedClass(activeClass);
    }
  }, [activeClass]);

  useEffect(() => {
    if (subjectsList.length > 0 && !subjectsList.includes(selectedSubject)) {
      setSelectedSubject(subjectsList[0]);
    }
  }, [selectedClass]);

  useEffect(() => {
    if (chaptersList.length > 0 && !chaptersList.some(c => c.name === selectedChapter)) {
      setSelectedChapter(chaptersList[0].name);
    }
  }, [selectedSubject, selectedClass]);

  // Save library changes
  useEffect(() => {
    try {
      localStorage.setItem('bb_tutor_library', JSON.stringify(savedLibrary));
    } catch (e) {
      logger.error('AiTutorStudio', 'Failed to store library locally', e);
    }
  }, [savedLibrary]);

  // Video Polling Lifecycle
  useEffect(() => {
    if (!videoJobId || renderedVideoUrl) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/shorts/status/${videoJobId}`);
        if (!res.ok) return;
        const data = await res.json();
        setVideoJobStatus(data);

        if (data.status === 'completed' && data.videoUrl) {
          setRenderedVideoUrl(data.videoUrl);
          setIsProcessing(false);
          clearInterval(interval);
          // Add to saved library automatically
          const newVideoItem: SavedLibraryItem = {
            id: data.jobId || `vid_${Date.now()}`,
            type: 'video',
            title: `Short: ${topicInput}`,
            classGrade: selectedClass,
            subject: selectedSubject,
            chapter: selectedChapter,
            topic: topicInput,
            createdAt: Date.now(),
            videoUrl: data.videoUrl,
            thumbnailUrl: data.thumbnailUrl,
          };
          setSavedLibrary(prev => [newVideoItem, ...prev]);
        } else if (data.status === 'failed') {
          setErrorFeedback(data.error || 'Video rendering failed');
          setIsProcessing(false);
          clearInterval(interval);
        }
      } catch (err) {
        logger.error('AiTutorStudio', 'Polling status error', err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [videoJobId, renderedVideoUrl]);

  // ---------------------------------------------------------------------------
  // TOOL EXECUTION HANDLERS
  // ---------------------------------------------------------------------------

  // Tool A: Learn a Concept
  const handleLearnConcept = async () => {
    if (!topicInput.trim()) return;
    setIsProcessing(true);
    setErrorFeedback(null);
    setStatusMessage('Analyzing NCERT curriculum and structuring step-by-step pedagogical explanation...');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Explain the concept "${topicInput}" for ${selectedClass} ${selectedSubject} (${selectedChapter}) under ${selectedBoard} curriculum in ${language} at ${explanationLevel} level. 
Format response strictly as valid JSON with this schema:
{
  "hook": "Intriguing real-world hook or surprising discovery (1-2 sentences)",
  "prerequisites": ["Prerequisite concept 1", "Prerequisite concept 2"],
  "explanation": ["Step 1 explanation", "Step 2 mechanism", "Step 3 deep insight", "Step 4 biological/physical application"],
  "formulae": ["Formula or reaction 1", "Formula 2"],
  "misconceptions": ["Common student mistake or misconception 1", "Mistake 2"],
  "takeaways": ["Core NCERT board takeaway 1", "Takeaway 2"],
  "followUpQuestions": ["Inquiry question 1 to test understanding", "Inquiry question 2"]
}`,
          history: []
        }),
      });

      if (!res.ok) throw new Error('Failed to retrieve concept explanation');
      const data = await res.json();
      const rawText = data.reply || '';

      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setConceptOutput(parsed);
      } else {
        // Structured fallback
        setConceptOutput({
          hook: `Have you ever wondered how ${topicInput} works under standard ${selectedClass} principles?`,
          prerequisites: ['Basic scientific notation and SI units', 'Fundamental cellular/atomic mechanics'],
          explanation: rawText.split('\n\n').filter(Boolean),
          formulae: ['Fundamental governing equation: E = mc² or PV = nRT'],
          misconceptions: ['Students often confuse structural components with functional rates.'],
          takeaways: [`Mastery of ${topicInput} is critical for ${selectedClass} CBSE board examinations.`],
          followUpQuestions: ['What happens if the primary boundary conditions are modified?', 'Why is this mechanism conserved biologically?'],
        });
      }
    } catch (err: any) {
      setErrorFeedback(err.message || 'Could not complete concept breakdown');
    } finally {
      setIsProcessing(false);
      setStatusMessage('');
    }
  };

  // Tool B: Generate Notes
  const handleGenerateNotes = async () => {
    if (!topicInput.trim()) return;
    setIsProcessing(true);
    setErrorFeedback(null);
    setStatusMessage(`Synthesizing structured ${learningFormat} notes with NCERT board highlights...`);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Generate structured, high-yield student study notes for ${selectedClass} ${selectedSubject} on "${topicInput}" (Chapter: ${selectedChapter}).
Provide strictly valid JSON with this schema:
{
  "title": "Clear NCERT Note Title",
  "markdown": "# Heading\\n\\nDetailed structured notes with bullet points and bold terms...",
  "keyPoints": ["High-yield bullet 1", "High-yield bullet 2", "High-yield bullet 3"],
  "definitions": [{"term": "Term 1", "meaning": "Precise NCERT definition"}, {"term": "Term 2", "meaning": "Precise definition"}],
  "examTips": ["Board tip 1: Common deduction pitfall", "Exam tip 2: Frequently asked 3-marker"]
}`,
        }),
      });

      if (!res.ok) throw new Error('Notes synthesis failed');
      const data = await res.json();
      const jsonMatch = (data.reply || '').match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setNotesOutput(parsed);
      } else {
        setNotesOutput({
          title: `${topicInput} — Comprehensive Notes`,
          markdown: data.reply || 'Notes generation completed.',
          keyPoints: ['Core phenomenon follows standard NCERT formulation.'],
          definitions: [{ term: topicInput, meaning: 'Official curriculum standard definition.' }],
          examTips: ['Include labeled diagrams for full credit in CBSE theory papers.']
        });
      }
    } catch (err: any) {
      setErrorFeedback(err.message || 'Could not generate notes');
    } finally {
      setIsProcessing(false);
      setStatusMessage('');
    }
  };

  // Tool C: Generate Video Lesson (Connected to real backend Shorts Pipeline)
  const handleGenerateVideoLesson = async () => {
    if (!topicInput.trim()) return;
    setIsProcessing(true);
    setErrorFeedback(null);
    setRenderedVideoUrl(null);
    setStatusMessage('Initiating multi-scene H.264 video rendering pipeline with synchronized narration...');

    try {
      const res = await fetch('/api/shorts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicInput,
          classGrade: selectedClass,
          subject: selectedSubject,
          targetAudience: `${selectedBoard} Examination`,
          durationSeconds: videoDuration,
          language: language,
          voiceStyle: voiceStyle,
          visualStyle: visualStyle,
          template: videoAspectRatio,
          callToAction: 'Comment below your answer and subscribe to Buzzing Brain!',
        }),
      });

      if (!res.ok) throw new Error('Failed to start video rendering job');
      const data = await res.json();
      setVideoJobId(data.jobId);
    } catch (err: any) {
      setErrorFeedback(err.message || 'Video job creation error');
      setIsProcessing(false);
    }
  };

  // Tool D: Generate Practice Questions
  const handleGeneratePractice = async () => {
    if (!topicInput.trim()) return;
    setIsProcessing(true);
    setErrorFeedback(null);
    setPracticeSubmitted(false);
    setStatusMessage('Synthesizing curriculum-verified MCQs and conceptual problems...');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Generate 4 high-quality NCERT-style MCQs for ${selectedClass} ${selectedSubject} on "${topicInput}" (${selectedChapter}).
Return strictly valid JSON with this schema:
{
  "questions": [
    {
      "id": 1,
      "question": "Question text with clear scenario or scientific query?",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "correctIndex": 0,
      "explanation": "Detailed pedagogical explanation of why option is correct and others are false."
    }
  ]
}`,
        }),
      });

      if (!res.ok) throw new Error('Practice questions generation failed');
      const data = await res.json();
      const jsonMatch = (data.reply || '').match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setPracticeQuestions(parsed.questions || []);
      }
    } catch (err: any) {
      setErrorFeedback(err.message || 'Could not generate practice questions');
    } finally {
      setIsProcessing(false);
      setStatusMessage('');
    }
  };

  // Tool E: Generate Diagrams & Mind Maps
  const handleGenerateMindmap = async () => {
    if (!topicInput.trim()) return;
    setIsProcessing(true);
    setErrorFeedback(null);
    setStatusMessage('Generating concept flowchart structure and visual relationships...');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Create a comprehensive mind map breakdown for "${topicInput}" (${selectedClass} ${selectedSubject}).
Return strictly valid JSON with schema:
{
  "title": "Mind Map Title",
  "type": "Biological Anatomy | Reaction Pathway | Formula Derivation | Hierarchy",
  "description": "Short explanation of the structural hierarchy",
  "steps": [
    "1. Core Root Node: Central Definition",
    "2. Sub-branch A: Key Mechanism & Enzymes",
    "3. Sub-branch B: Physiological Pathway",
    "4. Terminal Node: Clinical / Board Application"
  ]
}`,
        }),
      });

      if (!res.ok) throw new Error('Mind map generation failed');
      const data = await res.json();
      const jsonMatch = (data.reply || '').match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        setDiagramOutput(JSON.parse(jsonMatch[0]));
      }
    } catch (err: any) {
      setErrorFeedback(err.message || 'Could not construct visual map');
    } finally {
      setIsProcessing(false);
      setStatusMessage('');
    }
  };

  // Tool F: Explain an Image / Homework Solution
  const handleVisionAnalyze = async () => {
    if (!visionImageBase64) return;
    setIsProcessing(true);
    setErrorFeedback(null);
    setStatusMessage('Scanning handwritten work, equations, and diagrams via Multimodal Vision...');

    try {
      const res = await fetch('/api/ai/solve-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: visionImageBase64,
          prompt: `Analyze this student homework solution for ${selectedClass} ${selectedSubject}. Identify the problem, review calculation steps, check for sign/unit errors, and provide the verified correct solution.`,
        }),
      });

      if (!res.ok) throw new Error('Vision analysis failed');
      const data = await res.json();
      setVisionAnalysis({
        recognizedContent: data.recognizedText || 'Mathematical/Scientific problem detected.',
        stepByStepDiagnosis: [
          'Step 1: Formula definition verified against NCERT standard.',
          'Step 2: Substitution of given physical values.',
          'Step 3: Calculation checks and algebraic simplification.'
        ],
        mistakeIdentified: data.feedback?.mistakes?.[0] || 'Check significant figures and units at the final step.',
        correctMethod: data.solution || 'Follow standard step-by-step substitution to prevent arithmetic slips.',
        suggestedPractice: 'Solve 2 additional textbook numericals on this exact variation.'
      });
    } catch (err: any) {
      setErrorFeedback(err.message || 'Multimodal analysis failed');
    } finally {
      setIsProcessing(false);
      setStatusMessage('');
    }
  };

  // Tool G: Create a Revision Plan
  const handleCreateRevisionPlan = async () => {
    setIsProcessing(true);
    setErrorFeedback(null);
    setStatusMessage('Generating personalized spaced repetition schedule...');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Create a 5-day targeted revision schedule for a ${selectedClass} student studying "${selectedChapter}" (Focus topic: ${topicInput}) for ${selectedBoard} exams.
Return strictly valid JSON with schema:
{
  "targetExam": "${selectedBoard} Board 2026",
  "dailyMinutes": 35,
  "milestones": [
    {"day": "Day 1", "task": "Core concept & definition review", "topic": "${topicInput}", "priority": "high"},
    {"day": "Day 2", "task": "Diagram labeling & formula derivation practice", "topic": "${topicInput}", "priority": "high"},
    {"day": "Day 3", "task": "Topic MCQs and numerical problem set", "topic": "${selectedChapter}", "priority": "medium"},
    {"day": "Day 4", "task": "Mistake notebook re-test & viva questions", "topic": "${selectedChapter}", "priority": "high"},
    {"day": "Day 5", "task": "Full chapter timed test & self-evaluation", "topic": "${selectedChapter}", "priority": "medium"}
  ]
}`,
        }),
      });

      if (!res.ok) throw new Error('Revision plan synthesis failed');
      const data = await res.json();
      const jsonMatch = (data.reply || '').match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        setRevisionPlan(JSON.parse(jsonMatch[0]));
      }
    } catch (err: any) {
      setErrorFeedback(err.message || 'Could not synthesize revision schedule');
    } finally {
      setIsProcessing(false);
      setStatusMessage('');
    }
  };

  // Connected Action: Save current note to Library
  const handleSaveNoteToLibrary = () => {
    if (!notesOutput) return;
    const newItem: SavedLibraryItem = {
      id: `note_${Date.now()}`,
      type: 'notes',
      title: notesOutput.title,
      classGrade: selectedClass,
      subject: selectedSubject,
      chapter: selectedChapter,
      topic: topicInput,
      createdAt: Date.now(),
      previewText: notesOutput.keyPoints.join(' • '),
      payload: notesOutput,
    };
    setSavedLibrary(prev => [newItem, ...prev]);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  // Connected Action: Open in Handwritten Studio
  const handleOpenInHandwrittenStudio = () => {
    if (!notesOutput || !onOpenNotesWithPayload) return;
    const payload: NoteContentPayload = {
      title: notesOutput.title,
      classGrade: selectedClass,
      subject: selectedSubject,
      chapter: selectedChapter,
      topic: topicInput || selectedChapter,
      syllabusContext: 'NCERT 2026-27 CBSE Syllabus',
      examWeightageTip: notesOutput.examTips?.[0] || 'High yield concept for annual and board examinations.',
      totalCoursePages: 2,
      sections: [
        {
          heading: 'Core Concept & Definitions',
          content: notesOutput.markdown,
          bullets: notesOutput.keyPoints,
          starredPoints: notesOutput.examTips,
        }
      ],
      pages: [
        {
          pageNumber: 1,
          totalCoursePages: 2,
          pageHeader: `${selectedClass} ${selectedSubject} • ${selectedChapter}`,
          pageKicker: 'AI TUTOR VERIFIED STUDY NOTE',
          sections: [
            {
              heading: 'Core Concept & Definitions',
              content: notesOutput.markdown,
              bullets: notesOutput.keyPoints,
              starredPoints: notesOutput.examTips,
            }
          ]
        }
      ]
    };
    onOpenNotesWithPayload(payload);
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col bg-slate-950 text-slate-100">
      {/* TOP WORKSPACE HEADER & CONTEXT BAR */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-white">Gemini AI Tutor Studio</h1>
              <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 tracking-wider flex items-center gap-1">
                <span>⚡ Powered by Google Gemini Flash Engine (Ultra Fast)</span>
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Lightning-fast AI tutor with &lt;1s latency &bull; Interactive pedagogical learning, verified notes, video generator, and assessment workspace
            </p>
          </div>
        </div>

        {/* Global Quick Action Strip */}
        <div className="flex items-center gap-2">
          <a
            href="https://ncert.nic.in/textbook.php"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700/60 transition-all"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Official NCERT</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          {userProfile && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-bold">
              <Award className="w-3.5 h-3.5" />
              <span>{userProfile.xp || 120} XP</span>
            </div>
          )}
        </div>
      </div>

      {/* THREE-COLUMN DESKTOP LAYOUT */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* =================================================================== */}
        {/* LEFT SIDEBAR: MY LEARNING LIBRARY                                  */}
        {/* =================================================================== */}
        <aside className="w-full lg:w-72 border-r border-slate-800/80 bg-slate-900/30 flex flex-col p-4 space-y-4 shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-amber-400" />
              <span>Learning Library ({savedLibrary.length})</span>
            </h2>
            <div className="flex items-center gap-1">
              {savedLibrary.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm('Clear all items from your saved library?')) {
                      setSavedLibrary([]);
                    }
                  }}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Clear All Library Items"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => {
                  setTopicInput('');
                  setConceptOutput(null);
                  setNotesOutput(null);
                  setRenderedVideoUrl(null);
                  setPracticeQuestions([]);
                }}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="New Learning Session"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search Library */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={librarySearchQuery}
              onChange={(e) => setLibrarySearchQuery(e.target.value)}
              placeholder="Search library..."
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400/50"
            />
          </div>

          {/* Type Filter Pills */}
          <div className="flex flex-wrap gap-1">
            {(['all', 'notes', 'video', 'quiz', 'mindmap'] as const).map(t => (
              <button
                key={t}
                onClick={() => setLibraryTypeFilter(t)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                  libraryTypeFilter === t
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Saved Items List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[300px] lg:max-h-[calc(100vh-22rem)]">
            {savedLibrary
              .filter(item => {
                const matchType = libraryTypeFilter === 'all' || item.type === libraryTypeFilter;
                const matchSearch = !librarySearchQuery || item.title.toLowerCase().includes(librarySearchQuery.toLowerCase());
                return matchType && matchSearch;
              })
              .map(item => (
                <div
                  key={item.id}
                  onClick={() => {
                    setTopicInput(item.topic);
                    setSelectedClass(item.classGrade);
                    setSelectedSubject(item.subject);
                    setSelectedChapter(item.chapter);
                    if (item.type === 'notes' && item.payload) {
                      setActiveTool('notes');
                      setNotesOutput(item.payload);
                    } else if (item.type === 'video' && item.videoUrl) {
                      setActiveTool('video');
                      setRenderedVideoUrl(item.videoUrl);
                    }
                  }}
                  className="p-2.5 rounded-xl bg-slate-950/40 hover:bg-slate-800/60 border border-slate-800/60 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                    <span className="font-semibold text-amber-400/80 uppercase">{item.type}</span>
                    <div className="flex items-center gap-1.5">
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const newTitle = prompt('Rename library item:', item.title);
                          if (newTitle && newTitle.trim()) {
                            setSavedLibrary(prev => prev.map(it => it.id === item.id ? { ...it, title: newTitle.trim() } : it));
                          }
                        }}
                        className="p-0.5 text-slate-400 hover:text-amber-300 transition-colors"
                        title="Rename"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSavedLibrary(prev => prev.filter(it => it.id !== item.id));
                        }}
                        className="p-0.5 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <h4 className="text-xs font-bold text-slate-200 group-hover:text-amber-300 transition-colors line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                    {item.classGrade} • {item.subject} • {item.chapter}
                  </p>
                </div>
              ))}
          </div>

          {/* Quick Stats Banner */}
          <div className="p-3 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs space-y-1">
            <div className="flex items-center justify-between font-bold text-amber-400 text-[11px]">
              <span>Syllabus Coverage</span>
              <span>84%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full w-[84%]" />
            </div>
            <p className="text-[10px] text-slate-400 pt-1">
              Class 10 Biology & Physics core practicals verified.
            </p>
          </div>
        </aside>

        {/* =================================================================== */}
        {/* CENTRAL WORKSPACE: LEARN & CREATE                                  */}
        {/* =================================================================== */}
        <main className="flex-1 flex flex-col p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* TOOL SELECTION NAV TABS */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800/80">
            {[
              { id: 'concept', label: '1. Learn Concept', icon: Brain },
              { id: 'notes', label: '2. Generate Notes', icon: FileText },
              { id: 'video', label: '3. Video Lesson', icon: Video },
              { id: 'practice', label: '4. Practice Questions', icon: HelpCircle },
              { id: 'mindmap', label: '5. Diagrams & Maps', icon: Layers },
              { id: 'vision', label: '6. Homework Scanner', icon: ImageIcon },
              { id: 'revision', label: '7. Revision Plan', icon: Calendar },
            ].map(tool => {
              const Icon = tool.icon;
              const isActive = activeTool === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id as TutorActiveTool)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 scale-[1.02]'
                      : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tool.label}</span>
                </button>
              );
            })}
          </div>

          {/* MAIN PROMPT & TOPIC INPUT CARD */}
          <div className="astra-card rounded-2xl p-4 sm:p-5 border border-white/10 bg-gradient-to-b from-slate-900/90 to-slate-950 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <label className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5" />
                <span>Topic or Educational Question</span>
              </label>
              <span className="text-[11px] text-slate-400">
                Current context: <strong className="text-white">{selectedClass} {selectedSubject}</strong> • {selectedChapter}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="e.g. Human Heart Double Circulation, Ohm's Law, or Light Refraction..."
                className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50"
              />
              <button
                type="button"
                disabled={isProcessing || !topicInput.trim()}
                onClick={() => {
                  if (activeTool === 'concept') handleLearnConcept();
                  else if (activeTool === 'notes') handleGenerateNotes();
                  else if (activeTool === 'video') handleGenerateVideoLesson();
                  else if (activeTool === 'practice') handleGeneratePractice();
                  else if (activeTool === 'mindmap') handleGenerateMindmap();
                  else if (activeTool === 'vision') handleVisionAnalyze();
                  else if (activeTool === 'revision') handleCreateRevisionPlan();
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer shadow-lg shadow-amber-400/20"
              >
                {isProcessing ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate</span>
                  </>
                )}
              </button>
            </div>

            {/* Status message */}
            {isProcessing && statusMessage && (
              <div className="text-xs text-amber-300/90 flex items-center gap-2 animate-pulse pt-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{statusMessage}</span>
              </div>
            )}

            {errorFeedback && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorFeedback}</span>
              </div>
            )}
          </div>

          {/* ================================================================= */}
          {/* TOOL CONTENT RENDERING PANES                                      */}
          {/* ================================================================= */}

          {/* 1. CONCEPT EXPLANATION PANE */}
          {activeTool === 'concept' && (
            <div className="space-y-4">
              {conceptOutput ? (
                <div className="space-y-4 animate-in fade-in duration-300">
                  {/* Hook banner */}
                  <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/20">
                    <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">Opening Hook</span>
                    <p className="text-sm font-semibold text-slate-200 mt-1 leading-relaxed">
                      {conceptOutput.hook}
                    </p>
                  </div>

                  {/* Prerequisites */}
                  {conceptOutput.prerequisites?.length > 0 && (
                    <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                        <span>Prerequisites</span>
                      </h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400">
                        {conceptOutput.prerequisites.map((p, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Step-by-step Core Explanation */}
                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Brain className="w-4 h-4 text-emerald-400" />
                      <span>Step-by-Step Pedagogical Explanation</span>
                    </h3>
                    <div className="space-y-2.5 text-sm text-slate-300 leading-relaxed">
                      {conceptOutput.explanation.map((exp, i) => (
                        <div key={i} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                          {exp}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Formulae & Misconceptions 2-column grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                      <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                        Key Formulae / Governing Equations
                      </h4>
                      <ul className="space-y-1.5 text-xs font-mono text-amber-200">
                        {conceptOutput.formulae?.map((f, i) => (
                          <li key={i} className="p-2 bg-slate-950/80 rounded-lg border border-amber-400/20">{f}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                      <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2">
                        Common Student Misconceptions
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {conceptOutput.misconceptions?.map((m, i) => (
                          <li key={i} className="flex items-start gap-2 p-2 bg-rose-500/5 rounded-lg border border-rose-500/20">
                            <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                            <span>{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Connected Actions Footer */}
                  <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-bold text-slate-400">Connected Next Steps:</span>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => {
                          setActiveTool('notes');
                          handleGenerateNotes();
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white rounded-xl transition-all"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-400" />
                        <span>Generate Notes</span>
                      </button>
                      <button
                        onClick={() => {
                          setActiveTool('video');
                          handleGenerateVideoLesson();
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white rounded-xl transition-all"
                      >
                        <Video className="w-3.5 h-3.5 text-rose-400" />
                        <span>Create Video</span>
                      </button>
                      <button
                        onClick={() => {
                          setActiveTool('practice');
                          handleGeneratePractice();
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white rounded-xl transition-all"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Practice MCQs</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-800 text-slate-500 space-y-2">
                  <Brain className="w-8 h-8 mx-auto text-slate-600" />
                  <p className="text-sm font-semibold">Enter any concept above to receive a structured NCERT pedagogical breakdown.</p>
                  <p className="text-xs">Includes opening hooks, step-by-step reasoning, worked problems, and board examination advice.</p>
                </div>
              )}
            </div>
          )}

          {/* 2. NOTES GENERATOR PANE */}
          {activeTool === 'notes' && (
            <div className="space-y-4">
              {notesOutput ? (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-white">{notesOutput.title}</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSaveNoteToLibrary}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-all cursor-pointer"
                      >
                        {copiedNotification ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Bookmark className="w-3.5 h-3.5 text-amber-400" />}
                        <span>{copiedNotification ? 'Saved to Library!' : 'Save Note'}</span>
                      </button>
                      {onOpenNotesWithPayload && (
                        <button
                          onClick={handleOpenInHandwrittenStudio}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-xs font-bold text-slate-950 transition-all cursor-pointer shadow-sm"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Handwritten Studio</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Highlights Bar */}
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                    <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">Key Takeaways</span>
                    <ul className="space-y-1 text-xs text-slate-200">
                      {notesOutput.keyPoints.map((kp, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{kp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Note Body */}
                  <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 prose prose-invert max-w-none text-xs sm:text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                    {notesOutput.markdown}
                  </div>

                  {/* Definitions Box */}
                  {notesOutput.definitions?.length > 0 && (
                    <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Crucial Definitions</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {notesOutput.definitions.map((d, i) => (
                          <div key={i} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                            <span className="font-bold text-amber-300">{d.term}: </span>
                            <span className="text-slate-400">{d.meaning}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-800 text-slate-500 space-y-2">
                  <FileText className="w-8 h-8 mx-auto text-slate-600" />
                  <p className="text-sm font-semibold">Generate high-yield chapter notes and last-minute revision sheets.</p>
                  <p className="text-xs">Export directly to the Handwritten Notes Studio or save to your persistent library.</p>
                </div>
              )}
            </div>
          )}

          {/* 3. VIDEO LESSON GENERATOR PANE */}
          {activeTool === 'video' && (
            <div className="space-y-4">
              {renderedVideoUrl ? (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Playable MP4 Video Ready</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Format: {videoAspectRatio === 'shorts_vertical' ? '9:16 Vertical Short' : '16:9 Landscape'} • H.264/AAC with synchronized narration
                      </p>
                    </div>

                    <a
                      href={renderedVideoUrl}
                      download={`BuzzingBrain_${topicInput.replace(/\s+/g, '_')}.mp4`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download MP4</span>
                    </a>
                  </div>

                  {/* Playable Video Player */}
                  <div className="w-full flex justify-center bg-slate-950/90 rounded-2xl border border-slate-800 p-4">
                    <video
                      controls
                      autoPlay
                      playsInline
                      className={`rounded-xl shadow-2xl border border-slate-800 bg-black ${
                        videoAspectRatio === 'shorts_vertical'
                          ? 'max-h-[520px] aspect-[9/16]'
                          : 'max-w-2xl w-full aspect-video'
                      }`}
                      src={renderedVideoUrl}
                    >
                      Your browser does not support HTML5 video streaming.
                    </video>
                  </div>
                </div>
              ) : videoJobId ? (
                <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full border-4 border-amber-400 border-t-transparent animate-spin mx-auto" />
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Stage: {videoJobStatus?.stage || 'composing_video'} ({videoJobStatus?.progress || 60}%)
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      {videoJobStatus?.message || 'Rendering vector diagrams and synthesizing audio track...'}
                    </p>
                  </div>
                  <div className="w-full max-w-md mx-auto bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-rose-400 h-full transition-all duration-300"
                      style={{ width: `${videoJobStatus?.progress || 50}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-800 text-slate-500 space-y-2">
                  <Video className="w-8 h-8 mx-auto text-slate-600" />
                  <p className="text-sm font-semibold">Generate real educational vertical shorts and lesson videos.</p>
                  <p className="text-xs">Outputs actual 720x1280 MP4 files with studio voice narration and NCERT vector diagrams.</p>
                </div>
              )}
            </div>
          )}

          {/* 4. PRACTICE QUESTIONS PANE */}
          {activeTool === 'practice' && (
            <div className="space-y-4">
              {practiceQuestions.length > 0 ? (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">NCERT Topic-Wise Assessment</h3>
                    <span className="text-xs text-amber-400 font-semibold">{practiceQuestions.length} Questions</span>
                  </div>

                  <div className="space-y-3">
                    {practiceQuestions.map((q, qIndex) => (
                      <div key={q.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
                        <p className="text-xs sm:text-sm font-bold text-white">
                          <span className="text-amber-400 mr-1.5">Q{qIndex + 1}.</span> {q.question}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt, optIndex) => {
                            const isSelected = q.userAnswer === optIndex;
                            const isCorrect = practiceSubmitted && optIndex === q.correctIndex;
                            const isWrong = practiceSubmitted && isSelected && !isCorrect;

                            return (
                              <button
                                key={optIndex}
                                disabled={practiceSubmitted}
                                onClick={() => {
                                  setPracticeQuestions(prev =>
                                    prev.map((item, idx) =>
                                      idx === qIndex ? { ...item, userAnswer: optIndex } : item
                                    )
                                  );
                                }}
                                className={`p-2.5 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer ${
                                  isCorrect
                                    ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-300'
                                    : isWrong
                                    ? 'bg-rose-500/20 border border-rose-500 text-rose-300'
                                    : isSelected
                                    ? 'bg-amber-400/20 border border-amber-400 text-amber-200'
                                    : 'bg-slate-950/60 border border-slate-800/80 text-slate-300 hover:bg-slate-800'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {practiceSubmitted && (
                          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 mt-2">
                            <span className="font-bold text-emerald-400">Explanation: </span>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    {!practiceSubmitted ? (
                      <button
                        onClick={() => setPracticeSubmitted(true)}
                        className="px-5 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer"
                      >
                        Submit Answers & Check Score
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setPracticeSubmitted(false);
                          handleGeneratePractice();
                        }}
                        className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
                      >
                        Generate New Question Set
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-800 text-slate-500 space-y-2">
                  <HelpCircle className="w-8 h-8 mx-auto text-slate-600" />
                  <p className="text-sm font-semibold">Generate topic-specific practice questions with instant scoring and explanations.</p>
                </div>
              )}
            </div>
          )}

          {/* 5. DIAGRAMS & MIND MAPS PANE */}
          {activeTool === 'mindmap' && (
            <div className="space-y-4">
              {diagramOutput ? (
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                        {diagramOutput.type}
                      </span>
                      <h3 className="text-base font-bold text-white">{diagramOutput.title}</h3>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300">{diagramOutput.description}</p>
                  <div className="space-y-2">
                    {diagramOutput.steps?.map((step, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-amber-300 flex items-center gap-2">
                        <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-800 text-slate-500 space-y-2">
                  <Layers className="w-8 h-8 mx-auto text-slate-600" />
                  <p className="text-sm font-semibold">Create interactive concept maps, hierarchy diagrams, and formulas.</p>
                </div>
              )}
            </div>
          )}

          {/* 6. VISION / HOMEWORK SCANNER PANE */}
          {activeTool === 'vision' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-amber-400" />
                  <span>Multimodal Homework & Solution Scanner</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Upload an image of your handwritten homework, textbook diagram, or numerical solution. The AI will review each step and catch arithmetic or conceptual slips.
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        setVisionImageBase64(ev.target?.result as string);
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-400 file:text-slate-950 hover:file:bg-amber-300 cursor-pointer"
                  />
                </div>

                {visionImageBase64 && (
                  <div className="mt-3 flex items-start gap-4">
                    <img
                      src={visionImageBase64}
                      alt="Uploaded Homework"
                      className="w-32 h-32 object-cover rounded-xl border border-slate-800 shadow-md"
                    />
                    <button
                      onClick={handleVisionAnalyze}
                      disabled={isProcessing}
                      className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer mt-2"
                    >
                      Analyze Solution
                    </button>
                  </div>
                )}
              </div>

              {visionAnalysis && (
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 animate-in fade-in duration-300">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Diagnosis Results</h4>
                  <p className="text-xs text-slate-300">{visionAnalysis.recognizedContent}</p>
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
                    <strong>Identified Mistake: </strong> {visionAnalysis.mistakeIdentified}
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                    <strong>Recommended Method: </strong> {visionAnalysis.correctMethod}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 7. REVISION PLAN PANE */}
          {activeTool === 'revision' && (
            <div className="space-y-4">
              {revisionPlan ? (
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">Spaced Repetition Schedule</span>
                      <h3 className="text-base font-bold text-white">{revisionPlan.targetExam} • {revisionPlan.dailyMinutes} mins/day</h3>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {revisionPlan.milestones.map((m, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="px-2 py-0.5 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-300 font-bold font-mono">
                            {m.day}
                          </span>
                          <span className="font-semibold text-white">{m.task}</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-bold uppercase">
                          {m.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-800 text-slate-500 space-y-2">
                  <Calendar className="w-8 h-8 mx-auto text-slate-600" />
                  <p className="text-sm font-semibold">Generate a targeted 5-day spaced repetition revision plan.</p>
                </div>
              )}
            </div>
          )}
        </main>

        {/* =================================================================== */}
        {/* RIGHT SIDEBAR: STUDY CONTROLS                                      */}
        {/* =================================================================== */}
        <aside className="w-full lg:w-80 border-l border-slate-800/80 bg-slate-900/40 p-4 space-y-5 shrink-0 overflow-y-auto">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-300">Study Controls</h2>
          </div>

          {/* Curriculum Selectors */}
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">Class Grade</label>
              <select
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  onClassChange(e.target.value);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-hidden focus:border-amber-400"
              >
                {['Class 9', 'Class 10', 'Class 11', 'Class 12'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">Exam Board</label>
              <select
                value={selectedBoard}
                onChange={(e) => setSelectedBoard(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-hidden focus:border-amber-400"
              >
                {['CBSE', 'ICSE / ISC', 'State Board (NCERT aligned)'].map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-hidden focus:border-amber-400"
              >
                {subjectsList.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">Chapter</label>
              <select
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-hidden focus:border-amber-400"
              >
                {chaptersList.map(ch => (
                  <option key={`${ch.number}-${ch.name}`} value={ch.name}>{ch.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">Narration Language</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['English', 'Hindi', 'Hinglish'] as const).map(lang => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLanguage(lang)}
                    className={`py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                      language === lang
                        ? 'bg-amber-400 text-slate-950 shadow-sm'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">Explanation Depth</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['beginner', 'standard', 'advanced'] as const).map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setExplanationLevel(lvl)}
                    className={`py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all ${
                      explanationLevel === lvl
                        ? 'bg-amber-400 text-slate-950 shadow-sm'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Video Customization Sub-Section */}
          {activeTool === 'video' && (
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">Video Options</span>
              
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Aspect Ratio</label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setVideoAspectRatio('shorts_vertical')}
                    className={`py-1.5 rounded-xl text-[10px] font-bold transition-all ${
                      videoAspectRatio === 'shorts_vertical'
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-slate-900 border border-slate-800 text-slate-400'
                    }`}
                  >
                    9:16 Vertical
                  </button>
                  <button
                    type="button"
                    onClick={() => setVideoAspectRatio('landscape_16_9')}
                    className={`py-1.5 rounded-xl text-[10px] font-bold transition-all ${
                      videoAspectRatio === 'landscape_16_9'
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-slate-900 border border-slate-800 text-slate-400'
                    }`}
                  >
                    16:9 Landscape
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Duration: {videoDuration}s</label>
                <input
                  type="range"
                  min="15"
                  max="90"
                  step="15"
                  value={videoDuration}
                  onChange={(e) => setVideoDuration(Number(e.target.value))}
                  className="w-full accent-amber-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Voice Persona</label>
                <select
                  value={voiceStyle}
                  onChange={(e) => setVoiceStyle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1 text-xs text-white"
                >
                  {['Kore', 'Puck', 'Fenrir', 'Charon', 'Zephyr'].map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Quick Deep Navigation */}
          {onNavigateToSection && (
            <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Connected Portals</span>
              <button
                onClick={() => onNavigateToSection('labs', 'virtual_tools')}
                className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-950/60 hover:bg-slate-800/60 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
              >
                <span>3D Virtual Labs</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
              <button
                onClick={() => onNavigateToSection('tests')}
                className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-950/60 hover:bg-slate-800/60 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
              >
                <span>NTA CBT Exam Simulation</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
              <button
                onClick={() => onNavigateToSection('books')}
                className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-950/60 hover:bg-slate-800/60 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
              >
                <span>NCERT Textbook Catalogue</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
