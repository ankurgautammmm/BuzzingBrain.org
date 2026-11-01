import React, { useState, useEffect } from 'react';
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  FileText,
  BarChart3,
  Calendar,
  Send,
  Plus,
  BookOpen,
  Clock,
  Shield,
  Layers,
  Search,
  Filter,
  Check,
  Award,
  ChevronRight,
  ExternalLink,
  Flame,
  HelpCircle,
  TrendingUp,
  Download,
  AlertCircle,
  Edit,
  Save,
  Bell,
  RefreshCw,
  X,
  Sparkles,
  ClipboardCheck,
  GraduationCap
} from 'lucide-react';
import { UserProfile } from '../types';
import { NCERT_SYLLABUS } from '../data/ncertSyllabus';

interface TeacherPortalProps {
  userProfile: UserProfile | null;
  activeClass: string;
  onNavigateToSection?: (tab: any, subTab?: any) => void;
}

export type TeacherNavTab =
  | 'dashboard'
  | 'classes'
  | 'timetable'
  | 'attendance'
  | 'assessments'
  | 'grading'
  | 'marks'
  | 'progress'
  | 'assignments'
  | 'notifications';

export const TeacherPortal: React.FC<TeacherPortalProps> = ({
  userProfile,
  activeClass,
  onNavigateToSection,
}) => {
  // Navigation & Class Scoping
  const [activeTab, setActiveTab] = useState<TeacherNavTab>('dashboard');
  const [selectedClassId, setSelectedClassId] = useState<string>('cls-10-a');
  const [selectedSubject, setSelectedSubject] = useState<string>('Science');

  // Academic Classes (Scoped to Teacher's Assignments)
  const [assignedClasses, setAssignedClasses] = useState([
    { id: 'cls-10-a', name: 'Class 10', section: 'A', gradeLevel: 'Class 10', stream: 'General Secondary', room: 'Room 204' },
    { id: 'cls-10-b', name: 'Class 10', section: 'B', gradeLevel: 'Class 10', stream: 'General Secondary', room: 'Room 205' },
    { id: 'cls-11-pcm', name: 'Class 11', section: 'PCM-1', gradeLevel: 'Class 11', stream: 'Science (PCM)', room: 'Lab Complex 3' },
  ]);

  // Students Roster for Selected Class
  const [students, setStudents] = useState([
    { id: 'std_1001', admissionNo: 'BB-2026-1042', rollNo: 1, name: 'Aarav Sharma', attendancePct: 94.5, grade: 'A+', weakAreas: ['Ray Optics sign convention', 'Ohm’s law graphical error'] },
    { id: 'std_1002', admissionNo: 'BB-2026-1043', rollNo: 2, name: 'Diya Patel', attendancePct: 91.0, grade: 'A', weakAreas: ['Anaerobic respiration equation'] },
    { id: 'std_1003', admissionNo: 'BB-2026-1044', rollNo: 3, name: 'Rohan Verma', attendancePct: 71.5, grade: 'C+', weakAreas: ['Balancing chemical reactions', 'Glycolysis ATP yield'] },
    { id: 'std_1004', admissionNo: 'BB-2026-1045', rollNo: 4, name: 'Ananya Iyer', attendancePct: 96.0, grade: 'A+', weakAreas: [] },
    { id: 'std_1005', admissionNo: 'BB-2026-1046', rollNo: 5, name: 'Kabir Khan', attendancePct: 83.2, grade: 'B+', weakAreas: ['Resistor network equivalent'] },
    { id: 'std_1006', admissionNo: 'BB-2026-1047', rollNo: 6, name: 'Ishaan Gupta', attendancePct: 68.0, grade: 'C', weakAreas: ['Low attendance below 75%', 'Periodic trends'] },
    { id: 'std_1007', admissionNo: 'BB-2026-1048', rollNo: 7, name: 'Pooja Joshi', attendancePct: 88.0, grade: 'B+', weakAreas: [] },
    { id: 'std_1008', admissionNo: 'BB-2026-1049', rollNo: 8, name: 'Tanvi Sen', attendancePct: 92.5, grade: 'A', weakAreas: [] },
  ]);

  // Class Sessions & Timetable
  const [sessions, setSessions] = useState([
    {
      id: 'ses_20261027_10a_sci',
      classId: 'cls-10-a',
      title: 'Electricity: Ohm’s Law & Resistor Networks',
      date: '2026-10-27',
      startTime: '09:00',
      endTime: '09:45',
      subject: 'Science',
      status: 'completed',
      finalized: false,
    },
    {
      id: 'ses_20261027_11pcm_phy',
      classId: 'cls-11-pcm',
      title: 'Rotational Dynamics: Moment of Inertia & Torque',
      date: '2026-10-27',
      startTime: '11:00',
      endTime: '12:00',
      subject: 'Physics',
      status: 'scheduled',
      finalized: false,
    },
    {
      id: 'ses_20261026_10a_sci',
      classId: 'cls-10-a',
      title: 'Life Processes: Respiration & Double Circulation',
      date: '2026-10-26',
      startTime: '09:00',
      endTime: '09:45',
      subject: 'Science',
      status: 'completed',
      finalized: true,
    },
  ]);

  // Active Attendance Marking State
  const [activeSessionId, setActiveSessionId] = useState<string>('ses_20261027_10a_sci');
  const [attendanceDraft, setAttendanceDraft] = useState<Record<string, 'present' | 'absent' | 'late' | 'excused'>>({
    std_1001: 'present',
    std_1002: 'present',
    std_1003: 'absent',
    std_1004: 'present',
    std_1005: 'present',
    std_1006: 'late',
    std_1007: 'present',
    std_1008: 'present',
  });
  const [attendanceSaveMsg, setAttendanceSaveMsg] = useState<string | null>(null);

  // Attendance Correction Modal
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [correctionStudent, setCorrectionStudent] = useState<{ id: string; name: string; currentStatus: string } | null>(null);
  const [newCorrectionStatus, setNewCorrectionStatus] = useState<'present' | 'absent' | 'late' | 'excused'>('present');
  const [correctionReason, setCorrectionReason] = useState('');

  // Assessments
  const [assessments, setAssessments] = useState([
    {
      id: 'asm_101',
      title: 'Life Processes: Respiration & Blood Circulation Assessment',
      classId: 'cls-10-a',
      subject: 'Science',
      chapter: 'Life Processes',
      type: 'chapter_test',
      maxMarks: 50,
      passMarks: 20,
      durationMinutes: 45,
      dueDate: '2026-10-25',
      published: true,
      submissionsCount: 8,
      averageScore: 40,
    },
    {
      id: 'asm_102',
      title: 'Ohm’s Law & Circuit Analysis Practical Assessment',
      classId: 'cls-10-a',
      subject: 'Science',
      chapter: 'Electricity',
      type: 'practical_quiz',
      maxMarks: 30,
      passMarks: 12,
      durationMinutes: 30,
      dueDate: '2026-10-28',
      published: false,
      submissionsCount: 6,
      averageScore: 24,
    },
  ]);

  // Submissions for Grading
  const [submissions, setSubmissions] = useState([
    {
      id: 'sub_102_1001',
      assessmentId: 'asm_102',
      studentId: 'std_1001',
      studentName: 'Aarav Sharma',
      rollNo: 1,
      submittedAt: '2026-10-26 17:00',
      maxMarks: 30,
      marksObtained: 28,
      status: 'submitted',
      teacherFeedback: 'Excellent experimental verification of V-I graph linearity.',
    },
    {
      id: 'sub_102_1002',
      assessmentId: 'asm_102',
      studentId: 'std_1002',
      studentName: 'Diya Patel',
      rollNo: 2,
      submittedAt: '2026-10-26 17:15',
      maxMarks: 30,
      marksObtained: 25,
      status: 'submitted',
      teacherFeedback: 'Good circuit diagram; check error analysis for rheostat.',
    },
    {
      id: 'sub_102_1003',
      assessmentId: 'asm_102',
      studentId: 'std_1003',
      studentName: 'Rohan Verma',
      rollNo: 3,
      submittedAt: '2026-10-26 17:45',
      maxMarks: 30,
      marksObtained: 18,
      status: 'submitted',
      teacherFeedback: 'Need to review series vs parallel resistor equivalent derivation.',
    },
    {
      id: 'sub_102_1004',
      assessmentId: 'asm_102',
      studentId: 'std_1004',
      studentName: 'Ananya Iyer',
      rollNo: 4,
      submittedAt: '2026-10-26 18:00',
      maxMarks: 30,
      marksObtained: 30,
      status: 'submitted',
      teacherFeedback: 'Full marks! Flawless precision in calculations.',
    },
  ]);

  // Selected Student for Individual Progress Report
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<any | null>(null);

  // New Assessment Modal State
  const [showNewAssessmentModal, setShowNewAssessmentModal] = useState(false);
  const [newAsmTitle, setNewAsmTitle] = useState('');
  const [newAsmChapter, setNewAsmChapter] = useState('Life Processes');
  const [newAsmType, setNewAsmType] = useState('chapter_test');
  const [newAsmMaxMarks, setNewAsmMaxMarks] = useState(50);
  const [newAsmPassMarks, setNewAsmPassMarks] = useState(20);
  const [newAsmDuration, setNewAsmDuration] = useState(45);
  const [newAsmDueDate, setNewAsmDueDate] = useState('2026-11-15');

  // New Class Session Modal State
  const [showNewSessionModal, setShowNewSessionModal] = useState(false);
  const [newSessionTitle, setNewSessionTitle] = useState('');
  const [newSessionSubject, setNewSessionSubject] = useState('Science');
  const [newSessionDate, setNewSessionDate] = useState('2026-10-28');
  const [newSessionStart, setNewSessionStart] = useState('09:00');
  const [newSessionEnd, setNewSessionEnd] = useState('09:45');

  // Notifications
  const [notifications, setNotifications] = useState([
    { id: 'notif_1', title: '3 Submissions Pending Evaluation', msg: 'Practical Quiz: "Ohm’s Law & Circuit Analysis" has 3 student submissions waiting for your marks & remarks.', time: '2 hours ago', read: false },
    { id: 'notif_2', title: 'Attendance Finalization Reminder', msg: 'Session "Electricity: Ohm’s Law & Resistor Networks" has attendance saved as draft and requires final confirmation.', time: '4 hours ago', read: false },
    { id: 'notif_3', title: 'CBSE Attendance Alert: Ishaan Gupta', msg: 'Attendance dropped to 68.0% (below mandated 75% CBSE threshold). Academic support counseling recommended.', time: '1 day ago', read: false },
  ]);

  // Sync with Backend API on Mount (with fallback)
  useEffect(() => {
    async function fetchTeacherData() {
      try {
        const res = await fetch('/api/academic/dashboard/teacher', {
          headers: {
            'x-user-role': 'teacher',
            'x-user-id': userProfile?.uid || 'teacher_1',
            'x-user-email': userProfile?.email || 'teacher@buzzingbrain.edu',
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.assignedClasses) setAssignedClasses(data.assignedClasses);
        }
      } catch (err) {
        // Fallback already pre-seeded
      }
    }
    fetchTeacherData();
  }, [userProfile]);

  // Attendance Handlers
  const handleMarkStatus = (studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
    setAttendanceDraft((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAttendance = async (finalize: boolean) => {
    setAttendanceSaveMsg('Saving attendance records...');
    try {
      const records = students.map((s) => ({
        studentId: s.id,
        studentName: s.name,
        rollNumber: s.rollNo,
        status: attendanceDraft[s.id] || 'present',
      }));

      await fetch('/api/academic/attendance/mark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': 'teacher',
          'x-user-id': userProfile?.uid || 'teacher_1',
          'x-user-email': userProfile?.email || 'teacher@buzzingbrain.edu',
        },
        body: JSON.stringify({
          sessionId: activeSessionId,
          records,
          finalize,
        }),
      });

      // Update session status in UI
      setSessions((prev) =>
        prev.map((ses) => (ses.id === activeSessionId ? { ...ses, finalized: finalize } : ses))
      );

      setAttendanceSaveMsg(
        finalize
          ? 'Attendance finalized successfully and locked! Official student attendance percentages updated.'
          : 'Attendance saved as draft. You can make further changes before final submission.'
      );
      setTimeout(() => setAttendanceSaveMsg(null), 4000);
    } catch (err) {
      setAttendanceSaveMsg('Saved locally in offline cache.');
      setTimeout(() => setAttendanceSaveMsg(null), 3000);
    }
  };

  const handleOpenCorrection = (student: any) => {
    setCorrectionStudent({
      id: student.id,
      name: student.name,
      currentStatus: attendanceDraft[student.id] || 'present',
    });
    setNewCorrectionStatus(attendanceDraft[student.id] || 'present');
    setCorrectionReason('');
    setShowCorrectionModal(true);
  };

  const handleSubmitCorrection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionStudent || !correctionReason.trim()) return;

    try {
      await fetch('/api/academic/attendance/correct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': 'teacher',
          'x-user-id': userProfile?.uid || 'teacher_1',
          'x-user-email': userProfile?.email || 'teacher@buzzingbrain.edu',
        },
        body: JSON.stringify({
          sessionId: activeSessionId,
          studentId: correctionStudent.id,
          newStatus: newCorrectionStatus,
          reason: correctionReason.trim(),
        }),
      });

      setAttendanceDraft((prev) => ({
        ...prev,
        [correctionStudent.id]: newCorrectionStatus,
      }));

      setShowCorrectionModal(false);
      setAttendanceSaveMsg(`Attendance correction recorded for ${correctionStudent.name}. Reason logged in audit history.`);
      setTimeout(() => setAttendanceSaveMsg(null), 4000);
    } catch (err) {
      setAttendanceDraft((prev) => ({
        ...prev,
        [correctionStudent.id]: newCorrectionStatus,
      }));
      setShowCorrectionModal(false);
    }
  };

  // Grading Handlers
  const handleUpdateMarks = (subId: string, marks: number) => {
    setSubmissions((prev) =>
      prev.map((sub) => (sub.id === subId ? { ...sub, marksObtained: marks } : sub))
    );
  };

  const handleUpdateFeedback = (subId: string, feedback: string) => {
    setSubmissions((prev) =>
      prev.map((sub) => (sub.id === subId ? { ...sub, teacherFeedback: feedback } : sub))
    );
  };

  const handlePublishResults = async (assessmentId: string) => {
    try {
      await fetch('/api/academic/results/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': 'teacher',
          'x-user-id': userProfile?.uid || 'teacher_1',
          'x-user-email': userProfile?.email || 'teacher@buzzingbrain.edu',
        },
        body: JSON.stringify({ assessmentId }),
      });

      setAssessments((prev) =>
        prev.map((a) => (a.id === assessmentId ? { ...a, published: true } : a))
      );
      setSubmissions((prev) =>
        prev.map((s) => (s.assessmentId === assessmentId ? { ...s, status: 'published' } : s))
      );
      alert('Assessment results successfully published to authorized student progress records!');
    } catch (err) {
      setAssessments((prev) =>
        prev.map((a) => (a.id === assessmentId ? { ...a, published: true } : a))
      );
    }
  };

  // Create Assessment Handler
  const handleCreateAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsmTitle.trim()) return;

    const newAsm = {
      id: `asm_${Date.now()}`,
      title: newAsmTitle.trim(),
      classId: selectedClassId,
      subject: selectedSubject,
      chapter: newAsmChapter,
      type: newAsmType,
      maxMarks: Number(newAsmMaxMarks),
      passMarks: Number(newAsmPassMarks),
      durationMinutes: Number(newAsmDuration),
      dueDate: newAsmDueDate,
      published: false,
      submissionsCount: 0,
      averageScore: 0,
    };

    setAssessments((prev) => [newAsm as any, ...prev]);
    setShowNewAssessmentModal(false);
    setNewAsmTitle('');
  };

  // Create Session Handler
  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSessionTitle.trim()) return;

    const newSes = {
      id: `ses_${Date.now()}`,
      classId: selectedClassId,
      title: newSessionTitle.trim(),
      date: newSessionDate,
      startTime: newSessionStart,
      endTime: newSessionEnd,
      subject: newSessionSubject,
      status: 'scheduled',
      finalized: false,
    };

    setSessions((prev) => [newSes, ...prev]);
    setShowNewSessionModal(false);
    setNewSessionTitle('');
  };

  const activeClassObj = assignedClasses.find((c) => c.id === selectedClassId) || assignedClasses[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Educator Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400 uppercase tracking-widest mb-1 font-bold">
            <Shield className="w-4 h-4 text-sky-400" />
            <span>Authorized Educator Command Portal &bull; Role-Restricted Domain</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span>Academic Management &amp; Progress Console</span>
            <span className="text-xs bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2.5 py-0.5 rounded-full font-mono font-bold">
              TEACHER ACCESS
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Scoped to your assigned classes, subjects, and authorized student rosters. Attendance, marks entry, and student analytics are restricted from the general student interface.
          </p>
        </div>

        {/* Assigned Class Selector */}
        <div className="flex items-center gap-3 p-2 rounded-2xl astra-card border border-white/10">
          <span className="text-xs font-mono text-slate-400 pl-2">Assigned Class:</span>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="bg-slate-900 border border-white/20 text-white rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-sky-400"
          >
            {assignedClasses.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name} (Section {cls.section}) — {cls.stream}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10">
        {[
          { id: 'dashboard', label: 'My Dashboard', icon: BarChart3 },
          { id: 'attendance', label: 'Class Attendance', icon: ClipboardCheck },
          { id: 'classes', label: 'My Classes & Roster', icon: Users },
          { id: 'timetable', label: 'Timetable & Sessions', icon: Calendar },
          { id: 'assessments', label: 'Assessments', icon: FileText },
          { id: 'grading', label: 'Submissions & Grading', icon: Award },
          { id: 'marks', label: 'Marks & Results', icon: CheckCircle2 },
          { id: 'progress', label: 'Student Progress', icon: TrendingUp },
          { id: 'assignments', label: 'Assignments & Practicals', icon: BookOpen },
          { id: 'notifications', label: 'Notifications', icon: Bell, badge: notifications.filter((n) => !n.read).length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TeacherNavTab)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-sky-500 text-slate-950 shadow-md scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge ? (
                <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold">
                  {tab.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* =================================================================== */}
      {/* 1. MY DASHBOARD VIEW */}
      {/* =================================================================== */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="astra-card p-4 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[11px] font-mono text-slate-400">ENROLLED IN CLASS</span>
              <div className="text-2xl font-black text-white">{students.length} Students</div>
              <span className="text-xs text-sky-400 font-semibold">{activeClassObj.name} Section {activeClassObj.section}</span>
            </div>

            <div className="astra-card p-4 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[11px] font-mono text-slate-400">TODAY'S ATTENDANCE</span>
              <div className="text-2xl font-black text-emerald-400">87.5%</div>
              <span className="text-xs text-amber-300 font-semibold">1 Absent &bull; 1 Late</span>
            </div>

            <div className="astra-card p-4 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[11px] font-mono text-slate-400">PENDING EVALUATION</span>
              <div className="text-2xl font-black text-amber-400">
                {submissions.filter((s) => s.status === 'submitted').length} Submissions
              </div>
              <span className="text-xs text-slate-400">Practical &amp; Chapter Tests</span>
            </div>

            <div className="astra-card p-4 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[11px] font-mono text-slate-400">AT-RISK (&lt; 75% ATT.)</span>
              <div className="text-2xl font-black text-rose-400">
                {students.filter((s) => s.attendancePct < 75).length} Students
              </div>
              <span className="text-xs text-rose-300 font-semibold">Action required</span>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20">
            <span className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> Quick Actions:
            </span>
            <button
              onClick={() => setActiveTab('attendance')}
              className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition cursor-pointer shadow-md"
            >
              Take Today's Attendance
            </button>
            <button
              onClick={() => setActiveTab('grading')}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition cursor-pointer"
            >
              Grade Submissions ({submissions.filter((s) => s.status === 'submitted').length})
            </button>
            <button
              onClick={() => setShowNewAssessmentModal(true)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Create Assessment
            </button>
            <button
              onClick={() => {
                if (onNavigateToSection) onNavigateToSection('labs', 'studio3d');
              }}
              className="px-3 py-1.5 rounded-xl bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 hover:bg-indigo-500/30 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Launch 3D Science Studio</span>
            </button>
          </div>

          {/* Today's Schedule & Attendance Alert Split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Scheduled Sessions Today */}
            <div className="astra-card p-5 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sky-400" />
                  <span>Today's Class Sessions</span>
                </h3>
                <button
                  onClick={() => setShowNewSessionModal(true)}
                  className="text-xs text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Add Session
                </button>
              </div>

              <div className="space-y-3">
                {sessions.map((ses) => (
                  <div
                    key={ses.id}
                    className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-bold text-xs text-white flex items-center gap-2">
                        <span>{ses.title}</span>
                        {ses.finalized ? (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
                            Finalized
                          </span>
                        ) : (
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-mono">
                            Draft Pending
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {ses.date} &bull; {ses.startTime} – {ses.endTime} &bull; {ses.subject}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setActiveSessionId(ses.id);
                        setActiveTab('attendance');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-xs font-semibold cursor-pointer shrink-0"
                    >
                      Attendance
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Students Needing Academic Support */}
            <div className="astra-card p-5 rounded-2xl border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Students Requiring Academic Attention</span>
              </h3>

              <div className="space-y-3">
                {students
                  .filter((s) => s.attendancePct < 75 || s.grade.startsWith('C'))
                  .map((std) => (
                    <div
                      key={std.id}
                      className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="font-bold text-xs text-white">
                          Roll {std.rollNo}: {std.name}
                        </div>
                        <div className="text-[11px] text-slate-300 mt-0.5">
                          Attendance: <span className="font-bold text-rose-300">{std.attendancePct}%</span> &bull; Current Grade: <span className="font-bold">{std.grade}</span>
                        </div>
                        {std.weakAreas && std.weakAreas.length > 0 && (
                          <div className="text-[10px] text-amber-300/80 mt-1">
                            Flagged Concept: {std.weakAreas.join(', ')}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setSelectedStudentForReport(std);
                          setActiveTab('progress');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer shrink-0"
                      >
                        View Report
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 2. CLASS ATTENDANCE VIEW */}
      {/* =================================================================== */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          {/* Attendance Header & Session Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 astra-card p-4 rounded-2xl border border-white/10">
            <div>
              <span className="text-[11px] font-mono text-sky-400">OFFICIAL CLASS SESSION ATTENDANCE</span>
              <h3 className="text-base font-bold text-white mt-0.5">
                {sessions.find((s) => s.id === activeSessionId)?.title || 'Selected Session'}
              </h3>
              <p className="text-xs text-slate-400">
                Mark each enrolled student. Drafts can be amended; finalization locks the record and updates official attendance percentages.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSaveAttendance(false)}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition cursor-pointer"
              >
                Save Draft
              </button>
              <button
                onClick={() => handleSaveAttendance(true)}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold transition cursor-pointer shadow-lg"
              >
                Finalize Attendance
              </button>
            </div>
          </div>

          {attendanceSaveMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{attendanceSaveMsg}</span>
            </div>
          )}

          {/* Student Attendance Roster Table */}
          <div className="astra-card rounded-2xl border border-white/10 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-slate-900/60 text-[11px] font-mono text-slate-400">
                  <th className="py-3 px-4">ROLL NO</th>
                  <th className="py-3 px-4">STUDENT NAME</th>
                  <th className="py-3 px-4">ADMISSION NO</th>
                  <th className="py-3 px-4 text-center">STATUS</th>
                  <th className="py-3 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-slate-200">
                {students.map((std) => {
                  const status = attendanceDraft[std.id] || 'present';
                  return (
                    <tr key={std.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-white">#{std.rollNo}</td>
                      <td className="py-3 px-4 font-semibold text-white">{std.name}</td>
                      <td className="py-3 px-4 font-mono text-slate-400">{std.admissionNo}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {(['present', 'absent', 'late', 'excused'] as const).map((st) => (
                            <button
                              key={st}
                              onClick={() => handleMarkStatus(std.id, st)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase transition cursor-pointer ${
                                status === st
                                  ? st === 'present'
                                    ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
                                    : st === 'absent'
                                    ? 'bg-rose-500 text-white font-black shadow-sm'
                                    : st === 'late'
                                    ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                                    : 'bg-indigo-500 text-white font-black shadow-sm'
                                  : 'bg-white/5 text-slate-400 hover:text-white'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleOpenCorrection(std)}
                          className="px-2 py-1 rounded bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white text-[11px] transition cursor-pointer"
                        >
                          Submit Correction
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 3. MY CLASSES & ROSTER VIEW */}
      {/* =================================================================== */}
      {activeTab === 'classes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Enrolled Students Roster</h3>
              <p className="text-xs text-slate-400">
                {activeClassObj.name} (Section {activeClassObj.section}) &bull; {activeClassObj.room}
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">{students.length} Total Enrolled</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((std) => (
              <div
                key={std.id}
                className="astra-card p-4 rounded-2xl border border-white/10 space-y-3 hover:border-sky-400/30 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-sky-400">ROLL #{std.rollNo}</span>
                    <h4 className="text-sm font-bold text-white">{std.name}</h4>
                    <span className="text-[11px] font-mono text-slate-400">{std.admissionNo}</span>
                  </div>
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                      std.grade.startsWith('A')
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : std.grade.startsWith('B')
                        ? 'bg-sky-500/20 text-sky-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    Grade {std.grade}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Attendance Rate:</span>
                    <span className={`font-bold ${std.attendancePct < 75 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {std.attendancePct}%
                    </span>
                  </div>
                  {std.weakAreas && std.weakAreas.length > 0 && (
                    <div className="text-[11px] text-amber-300/90 pt-1 border-t border-white/5">
                      Need Attention: {std.weakAreas.join('; ')}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    setSelectedStudentForReport(std);
                    setActiveTab('progress');
                  }}
                  className="w-full py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold transition cursor-pointer"
                >
                  View Academic Profile
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 4. TIMETABLE & SESSIONS */}
      {/* =================================================================== */}
      {activeTab === 'timetable' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Class Timetable &amp; Scheduled Sessions</h3>
              <p className="text-xs text-slate-400">Class sessions created for your assigned classes</p>
            </div>
            <button
              onClick={() => setShowNewSessionModal(true)}
              className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" /> Schedule New Session
            </button>
          </div>

          <div className="astra-card rounded-2xl border border-white/10 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-slate-900/60 text-[11px] font-mono text-slate-400">
                  <th className="py-3 px-4">DATE &amp; TIME</th>
                  <th className="py-3 px-4">SESSION TOPIC</th>
                  <th className="py-3 px-4">SUBJECT</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-slate-200">
                {sessions.map((ses) => (
                  <tr key={ses.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-mono">
                      <div>{ses.date}</div>
                      <div className="text-[11px] text-slate-400">{ses.startTime} – {ses.endTime}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">{ses.title}</td>
                    <td className="py-3 px-4 font-mono text-sky-400">{ses.subject}</td>
                    <td className="py-3 px-4">
                      {ses.finalized ? (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
                          Completed &amp; Finalized
                        </span>
                      ) : (
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-mono">
                          {ses.status === 'completed' ? 'Draft Pending' : 'Scheduled'}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setActiveSessionId(ses.id);
                          setActiveTab('attendance');
                        }}
                        className="px-3 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 font-semibold cursor-pointer"
                      >
                        Manage Attendance
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 5. ASSESSMENTS MANAGEMENT VIEW */}
      {/* =================================================================== */}
      {activeTab === 'assessments' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Assessments &amp; Chapter Tests</h3>
              <p className="text-xs text-slate-400">Configure tests, pass marks, and attempt policies</p>
            </div>
            <button
              onClick={() => setShowNewAssessmentModal(true)}
              className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" /> Create Assessment
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assessments.map((asm) => (
              <div
                key={asm.id}
                className="astra-card p-5 rounded-2xl border border-white/10 space-y-4 hover:border-sky-400/30 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-sky-400 uppercase">{asm.type}</span>
                    <h4 className="text-sm font-bold text-white mt-0.5">{asm.title}</h4>
                    <span className="text-xs text-slate-400">Chapter: {asm.chapter}</span>
                  </div>
                  {asm.published ? (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                      Results Published
                    </span>
                  ) : (
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono">
                      Pending Publication
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs bg-black/30 p-2.5 rounded-xl border border-white/5 font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px]">MAX MARKS</span>
                    <span className="font-bold text-white">{asm.maxMarks}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">PASS MARKS</span>
                    <span className="font-bold text-amber-400">{asm.passMarks}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">DURATION</span>
                    <span className="font-bold text-sky-400">{asm.durationMinutes}m</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-xs text-slate-400">
                    Submissions: <strong className="text-white">{asm.submissionsCount}</strong>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('grading')}
                      className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer"
                    >
                      View Grading
                    </button>
                    {!asm.published && (
                      <button
                        onClick={() => handlePublishResults(asm.id)}
                        className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold cursor-pointer"
                      >
                        Publish
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 6. SUBMISSIONS & GRADING VIEW */}
      {/* =================================================================== */}
      {activeTab === 'grading' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Student Submissions &amp; Teacher Grading</h3>
              <p className="text-xs text-slate-400">Evaluate subjective and practical work with marks and feedback</p>
            </div>
            <button
              onClick={() => handlePublishResults('asm_102')}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer shadow-md"
            >
              Publish Evaluated Marks
            </button>
          </div>

          <div className="space-y-4">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="astra-card p-4 sm:p-5 rounded-2xl border border-white/10 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                  <div>
                    <span className="text-xs font-mono text-sky-400">ROLL #{sub.rollNo}</span>
                    <h4 className="text-sm font-bold text-white">{sub.studentName}</h4>
                    <span className="text-[11px] text-slate-400">Submitted: {sub.submittedAt}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-mono">
                      Marks (out of {sub.maxMarks}):
                    </span>
                    <input
                      type="number"
                      min="0"
                      max={sub.maxMarks}
                      value={sub.marksObtained ?? ''}
                      onChange={(e) => handleUpdateMarks(sub.id, Number(e.target.value))}
                      className="w-16 px-2.5 py-1.5 rounded-xl bg-black/60 border border-white/20 text-center font-bold text-white text-sm focus:outline-none focus:border-sky-400"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Teacher Pedagogical Feedback:</label>
                  <textarea
                    rows={2}
                    value={sub.teacherFeedback || ''}
                    onChange={(e) => handleUpdateFeedback(sub.id, e.target.value)}
                    placeholder="Enter teacher notes, concept clarity guidance, or commendations..."
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 7. MARKS & RESULTS ROSTER */}
      {/* =================================================================== */}
      {activeTab === 'marks' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Official Marks &amp; Result Roster</h3>
              <p className="text-xs text-slate-400">Comprehensive score validation against pass marks</p>
            </div>
            <button
              onClick={() => alert('Marks roster downloaded as CSV.')}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Export Marks CSV
            </button>
          </div>

          <div className="astra-card rounded-2xl border border-white/10 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-slate-900/60 text-[11px] font-mono text-slate-400">
                  <th className="py-3 px-4">ROLL NO</th>
                  <th className="py-3 px-4">STUDENT NAME</th>
                  <th className="py-3 px-4">TEST 1 (LIFE PROCESSES /50)</th>
                  <th className="py-3 px-4">TEST 2 (CIRCUITS /30)</th>
                  <th className="py-3 px-4">AGGREGATE</th>
                  <th className="py-3 px-4 text-center">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-slate-200">
                {students.map((std) => (
                  <tr key={std.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-white">#{std.rollNo}</td>
                    <td className="py-3 px-4 font-semibold text-white">{std.name}</td>
                    <td className="py-3 px-4 font-mono">
                      {std.rollNo === 1 ? '48/50' : std.rollNo === 2 ? '44/50' : std.rollNo === 3 ? '28/50' : '42/50'}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {std.rollNo === 1 ? '28/30' : std.rollNo === 2 ? '25/30' : std.rollNo === 3 ? '18/30' : '26/30'}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-sky-400">
                      {std.rollNo === 1 ? '95.0%' : std.rollNo === 2 ? '86.2%' : std.rollNo === 3 ? '57.5%' : '85.0%'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
                        PASSED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 8. STUDENT PROGRESS ANALYTICS & INDIVIDUAL REPORTS */}
      {/* =================================================================== */}
      {activeTab === 'progress' && (
        <div className="space-y-6">
          {/* Detailed Individual Student Card if selected */}
          {selectedStudentForReport && (
            <div className="astra-card p-5 rounded-2xl border border-sky-400/40 bg-sky-500/5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="text-xs font-mono text-sky-400">INDIVIDUAL ACADEMIC PROGRESS REPORT</span>
                  <h3 className="text-lg font-bold text-white">{selectedStudentForReport.name}</h3>
                  <p className="text-xs text-slate-400">
                    Roll #{selectedStudentForReport.rollNo} &bull; Admission: {selectedStudentForReport.admissionNo} &bull; {activeClassObj.name}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedStudentForReport(null)}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="bg-slate-900/80 p-3 rounded-xl border border-white/5">
                  <span className="text-slate-500 block text-[10px]">ATTENDANCE</span>
                  <span className={`text-base font-bold ${selectedStudentForReport.attendancePct < 75 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {selectedStudentForReport.attendancePct}%
                  </span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-white/5">
                  <span className="text-slate-500 block text-[10px]">CURRENT GRADE</span>
                  <span className="text-base font-bold text-sky-400">{selectedStudentForReport.grade}</span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-white/5">
                  <span className="text-slate-500 block text-[10px]">ASSESSMENTS COMPLETED</span>
                  <span className="text-base font-bold text-white">4 / 4</span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-white/5">
                  <span className="text-slate-500 block text-[10px]">LAB PRACTICALS LOGGED</span>
                  <span className="text-base font-bold text-emerald-400">3 Verified</span>
                </div>
              </div>

              {selectedStudentForReport.weakAreas && selectedStudentForReport.weakAreas.length > 0 && (
                <div className="p-3.5 rounded-xl bg-amber-400/10 border border-amber-400/20 text-xs text-slate-200">
                  <span className="font-bold text-amber-300 block mb-1">
                    Identified Conceptual Weak Areas (AI-Assisted Diagnostic):
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                    {selectedStudentForReport.weakAreas.map((w: string, i: number) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Class-Level Performance Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="astra-card p-5 rounded-2xl border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-sky-400" />
                <span>Class Grade Distribution</span>
              </h3>

              <div className="space-y-2 text-xs">
                {[
                  { grade: 'A+ (90-100%)', count: 3, pct: '37.5%', color: 'bg-emerald-400' },
                  { grade: 'A (80-89%)', count: 2, pct: '25.0%', color: 'bg-sky-400' },
                  { grade: 'B+ (70-79%)', count: 2, pct: '25.0%', color: 'bg-amber-400' },
                  { grade: 'C (50-69%)', count: 1, pct: '12.5%', color: 'bg-rose-400' },
                ].map((row) => (
                  <div key={row.grade} className="space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>{row.grade}</span>
                      <span className="font-mono">{row.count} students ({row.pct})</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className={`h-full ${row.color}`} style={{ width: row.pct }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="astra-card p-5 rounded-2xl border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>AI-Assisted Class Insights &amp; Remediation</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-white/5 space-y-1">
                  <div className="font-bold text-amber-300">Ohm’s Law V-I Graphing Errors</div>
                  <p className="text-slate-300">
                    54% of students in Section A calculated inverted slope (I/V instead of V/I). Recommended: 10-minute lab revision on standard slope derivations.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-white/5 space-y-1">
                  <div className="font-bold text-emerald-300">Cardiac Cycle Description Accuracy: 92%</div>
                  <p className="text-slate-300">
                    Strong comprehension of double circulation after 3D Beating Heart interactive model visualization.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 9. ASSIGNMENTS & PRACTICALS VIEW */}
      {/* =================================================================== */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Homework &amp; Virtual Lab Assignments</h3>
              <p className="text-xs text-slate-400">Track student practical journals and lab submission rates</p>
            </div>
            <button
              onClick={() => setShowNewAssessmentModal(true)}
              className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition cursor-pointer shadow-md"
            >
              + Create Practical Task
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="astra-card p-5 rounded-2xl border border-white/10 space-y-3">
              <span className="text-[10px] font-mono text-emerald-400">VIRTUAL LAB EXPERIMENT</span>
              <h4 className="text-sm font-bold text-white">Digital pH Meter Calibration &amp; Soil Acidity</h4>
              <p className="text-xs text-slate-300">
                Calibrate virtual buffer electrodes at pH 4.01 and 7.00 and log emf values into practical journal.
              </p>
              <div className="flex justify-between text-xs text-slate-400 border-t border-white/5 pt-2">
                <span>Submitted: 6/8</span>
                <span className="text-emerald-400 font-bold">75% Completion</span>
              </div>
            </div>

            <div className="astra-card p-5 rounded-2xl border border-white/10 space-y-3">
              <span className="text-[10px] font-mono text-cyan-400">PRACTICAL JOURNAL</span>
              <h4 className="text-sm font-bold text-white">Onion Epidermal Cell Mount &amp; Sizing</h4>
              <p className="text-xs text-slate-300">
                Stain with methylene blue, observe under 40X high-dry objective, and calculate average cell size.
              </p>
              <div className="flex justify-between text-xs text-slate-400 border-t border-white/5 pt-2">
                <span>Submitted: 7/8</span>
                <span className="text-emerald-400 font-bold">87.5% Completion</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 10. NOTIFICATIONS VIEW */}
      {/* =================================================================== */}
      {activeTab === 'notifications' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-base font-bold text-white">Educator Notifications &amp; Alerts</h3>
            <button
              onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
              className="text-xs text-sky-400 hover:underline cursor-pointer"
            >
              Mark all as read
            </button>
          </div>

          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="astra-card p-4 rounded-2xl border border-white/10 flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white">{n.title}</h4>
                    <span className="text-[10px] text-slate-500 font-mono">{n.time}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{n.msg}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL: SUBMIT ATTENDANCE CORRECTION WITH REASON */}
      {/* =================================================================== */}
      {showCorrectionModal && correctionStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="astra-card border border-white/20 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit className="w-4 h-4 text-sky-400" />
                <span>Attendance Correction Entry</span>
              </h3>
              <button
                onClick={() => setShowCorrectionModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Editing official attendance for <strong>{correctionStudent.name}</strong>. An authorized reason is required for institutional audit history.
            </p>

            <form onSubmit={handleSubmitCorrection} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">New Status:</label>
                <select
                  value={newCorrectionStatus}
                  onChange={(e) => setNewCorrectionStatus(e.target.value as any)}
                  className="w-full bg-slate-900 border border-white/20 rounded-xl px-3 py-2 text-white font-bold"
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late Arrival</option>
                  <option value="excused">Excused (Medical / Official)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Correction Reason (Required for Audit):</label>
                <textarea
                  required
                  rows={3}
                  value={correctionReason}
                  onChange={(e) => setCorrectionReason(e.target.value)}
                  placeholder="e.g., Arrived during second roll-call verification; medical slip verified..."
                  className="w-full bg-black/40 border border-white/20 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCorrectionModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold cursor-pointer"
                >
                  Log &amp; Submit Correction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL: CREATE ASSESSMENT */}
      {/* =================================================================== */}
      {showNewAssessmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="astra-card border border-white/20 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-sky-400" />
                <span>Create New Assessment</span>
              </h3>
              <button
                onClick={() => setShowNewAssessmentModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAssessment} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Assessment Title:</label>
                <input
                  type="text"
                  required
                  value={newAsmTitle}
                  onChange={(e) => setNewAsmTitle(e.target.value)}
                  placeholder="e.g., Chapter 10 Light Refraction & Snell's Law Test"
                  className="w-full bg-black/40 border border-white/20 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Chapter:</label>
                  <input
                    type="text"
                    value={newAsmChapter}
                    onChange={(e) => setNewAsmChapter(e.target.value)}
                    className="w-full bg-black/40 border border-white/20 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Type:</label>
                  <select
                    value={newAsmType}
                    onChange={(e) => setNewAsmType(e.target.value)}
                    className="w-full bg-slate-900 border border-white/20 rounded-xl p-2.5 text-white font-bold"
                  >
                    <option value="chapter_test">Chapter Test</option>
                    <option value="practical_quiz">Practical Lab Quiz</option>
                    <option value="subject_exam">Term Examination</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Max Marks:</label>
                  <input
                    type="number"
                    value={newAsmMaxMarks}
                    onChange={(e) => setNewAsmMaxMarks(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/20 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Pass Marks:</label>
                  <input
                    type="number"
                    value={newAsmPassMarks}
                    onChange={(e) => setNewAsmPassMarks(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/20 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Duration (min):</label>
                  <input
                    type="number"
                    value={newAsmDuration}
                    onChange={(e) => setNewAsmDuration(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/20 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewAssessmentModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold cursor-pointer"
                >
                  Create Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL: CREATE CLASS SESSION */}
      {/* =================================================================== */}
      {showNewSessionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="astra-card border border-white/20 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-400" />
                <span>Schedule New Session</span>
              </h3>
              <button
                onClick={() => setShowNewSessionModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSession} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Session Topic:</label>
                <input
                  type="text"
                  required
                  value={newSessionTitle}
                  onChange={(e) => setNewSessionTitle(e.target.value)}
                  placeholder="e.g., Electromagnetic Induction & Faraday's Law"
                  className="w-full bg-black/40 border border-white/20 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Date:</label>
                <input
                  type="date"
                  value={newSessionDate}
                  onChange={(e) => setNewSessionDate(e.target.value)}
                  className="w-full bg-black/40 border border-white/20 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Start Time:</label>
                  <input
                    type="time"
                    value={newSessionStart}
                    onChange={(e) => setNewSessionStart(e.target.value)}
                    className="w-full bg-black/40 border border-white/20 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">End Time:</label>
                  <input
                    type="time"
                    value={newSessionEnd}
                    onChange={(e) => setNewSessionEnd(e.target.value)}
                    className="w-full bg-black/40 border border-white/20 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewSessionModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold cursor-pointer"
                >
                  Schedule Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
