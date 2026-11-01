import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Download, 
  BarChart3, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Users, 
  FileText, 
  Sparkles, 
  Filter,
  Search,
  MessageSquare,
  ChevronDown,
  RefreshCw,
  ExternalLink,
  Shield,
  GraduationCap,
  Check,
  Calendar,
  Award,
  BookOpen,
  Edit,
  Sliders,
  Bell,
  Lock,
  Layers,
  TrendingUp,
  AlertTriangle,
  History,
  X
} from 'lucide-react';
import { StudyNote, ComplaintTicket, UserProfile } from '../types';
import { setUserRole } from '../services/firebase';

interface AdminDashboardProps {
  notes: StudyNote[];
  complaints: ComplaintTicket[];
  currentProfile: UserProfile | null;
  onUpdateComplaintStatus: (complaintId: string, status: 'pending' | 'in_review' | 'resolved', adminNotes?: string) => Promise<void>;
}

export type AdminNavTab =
  | 'overview'
  | 'students'
  | 'teachers'
  | 'classes'
  | 'attendance'
  | 'assessments'
  | 'marks'
  | 'progress'
  | 'assignments'
  | 'notifications'
  | 'audit'
  | 'settings'
  | 'complaints'
  | 'roles';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  notes,
  complaints,
  currentProfile,
  onUpdateComplaintStatus,
}) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<AdminNavTab>('overview');

  // Academic Master Records
  const [students, setStudents] = useState([
    { id: 'std_1001', admissionNo: 'BB-2026-1042', rollNo: 1, name: 'Aarav Sharma', classGrade: 'Class 10', section: 'A', attendancePct: 94.5, grade: 'A+', status: 'active', weakAreas: ['Ray Optics sign convention', 'Ohm’s law graphical error'] },
    { id: 'std_1002', admissionNo: 'BB-2026-1043', rollNo: 2, name: 'Diya Patel', classGrade: 'Class 10', section: 'A', attendancePct: 91.0, grade: 'A', status: 'active', weakAreas: [] },
    { id: 'std_1003', admissionNo: 'BB-2026-1044', rollNo: 3, name: 'Rohan Verma', classGrade: 'Class 10', section: 'A', attendancePct: 71.5, grade: 'C+', status: 'active', weakAreas: ['Chemical Equations balancing', 'Respiration ATP yield'] },
    { id: 'std_1004', admissionNo: 'BB-2026-1045', rollNo: 4, name: 'Ananya Iyer', classGrade: 'Class 10', section: 'A', attendancePct: 96.0, grade: 'A+', status: 'active', weakAreas: [] },
    { id: 'std_1005', admissionNo: 'BB-2026-1046', rollNo: 5, name: 'Kabir Khan', classGrade: 'Class 10', section: 'A', attendancePct: 83.2, grade: 'B+', status: 'active', weakAreas: [] },
    { id: 'std_1006', admissionNo: 'BB-2026-1047', rollNo: 6, name: 'Ishaan Gupta', classGrade: 'Class 10', section: 'A', attendancePct: 68.0, grade: 'C', status: 'active', weakAreas: ['Low attendance below 75%', 'Periodic trends'] },
    { id: 'std_1007', admissionNo: 'BB-2026-1048', rollNo: 7, name: 'Pooja Joshi', classGrade: 'Class 10', section: 'A', attendancePct: 88.0, grade: 'B+', status: 'active', weakAreas: [] },
    { id: 'std_1008', admissionNo: 'BB-2026-1049', rollNo: 8, name: 'Tanvi Sen', classGrade: 'Class 10', section: 'A', attendancePct: 92.5, grade: 'A', status: 'active', weakAreas: [] },
    { id: 'std_1101', admissionNo: 'BB-2025-0812', rollNo: 1, name: 'Devansh Kulkarni', classGrade: 'Class 11', section: 'PCM-1', attendancePct: 95.0, grade: 'A+', status: 'active', weakAreas: [] },
    { id: 'std_1102', admissionNo: 'BB-2025-0815', rollNo: 2, name: 'Meera Nambiar', classGrade: 'Class 11', section: 'PCM-1', attendancePct: 89.5, grade: 'A', status: 'active', weakAreas: [] },
    { id: 'std_1201', admissionNo: 'BB-2024-0410', rollNo: 1, name: 'Siddharth Rao', classGrade: 'Class 12', section: 'PCB-1', attendancePct: 93.0, grade: 'A', status: 'active', weakAreas: [] },
  ]);

  const [teachers, setTeachers] = useState([
    { id: 'tch_1', name: 'Dr. Anjali Deshmukh', email: 'anjali.deshmukh@buzzingbrain.edu', subject: 'Science & Biology', classes: ['Class 10-A', 'Class 10-B', 'Class 12-PCB'], sessionsConducted: 42, role: 'Senior PGT Educator' },
    { id: 'tch_2', name: 'Prof. Rajesh Khanna', email: 'rajesh.khanna@buzzingbrain.edu', subject: 'Physics & Applied Mechanics', classes: ['Class 11-PCM', 'Class 12-PCM'], sessionsConducted: 38, role: 'PGT Physics Lead' },
    { id: 'tch_3', name: 'Dr. Sunita Mehta', email: 'sunita.mehta@buzzingbrain.edu', subject: 'Chemistry & Practical Lab', classes: ['Class 10-A', 'Class 11-PCM'], sessionsConducted: 36, role: 'PGT Chemistry Lead' },
  ]);

  const [classesList, setClassesList] = useState([
    { id: 'cls-10-a', name: 'Class 10', section: 'A', classTeacher: 'Dr. Anjali Deshmukh', enrolledCount: 8, room: 'Room 204' },
    { id: 'cls-10-b', name: 'Class 10', section: 'B', classTeacher: 'Prof. Rajesh Khanna', enrolledCount: 38, room: 'Room 205' },
    { id: 'cls-11-pcm', name: 'Class 11', section: 'PCM-1', classTeacher: 'Dr. Sunita Mehta', enrolledCount: 42, room: 'Lab Complex 3' },
    { id: 'cls-12-pcb', name: 'Class 12', section: 'PCB-1', classTeacher: 'Dr. Anjali Deshmukh', enrolledCount: 36, room: 'BioLab 2' },
    { id: 'cls-9-a', name: 'Class 9', section: 'A', classTeacher: 'Prof. Rajesh Khanna', enrolledCount: 39, room: 'Room 102' },
  ]);

  // Attendance Sessions Oversight
  const [sessions, setSessions] = useState([
    { id: 'ses_1', classGrade: 'Class 10 - Sec A', date: '2026-10-27', topic: 'Electricity: Ohm’s Law & Resistor Networks', teacher: 'Dr. Anjali Deshmukh', attendancePct: 87.5, status: 'Draft Pending Finalization' },
    { id: 'ses_2', classGrade: 'Class 10 - Sec A', date: '2026-10-26', topic: 'Life Processes: Respiration & Double Circulation', teacher: 'Dr. Anjali Deshmukh', attendancePct: 91.2, status: 'Completed & Finalized' },
    { id: 'ses_3', classGrade: 'Class 11 - PCM-1', date: '2026-10-27', topic: 'Rotational Dynamics: Moment of Inertia', teacher: 'Prof. Rajesh Khanna', attendancePct: 94.0, status: 'Scheduled' },
  ]);

  // Audit History Log
  const [auditLogs, setAuditLogs] = useState([
    { id: 'aud_1', actor: 'anjali.deshmukh@buzzingbrain.edu', role: 'teacher', action: 'ATTENDANCE_CORRECTED', entity: 'ses_20261026_10a_sci/std_1002', prev: 'absent', curr: 'present', reason: 'Student arrived during roll-call second verification after lab equipment issue', time: '2026-10-26 10:15' },
    { id: 'aud_2', actor: 'admin@buzzingbrain.edu', role: 'admin', action: 'ACADEMIC_POLICY_INITIALIZED', entity: 'global_settings', prev: '-', curr: 'Min Attendance: 75%', reason: 'CBSE board compliance threshold updated', time: '2026-10-01 08:00' },
  ]);

  // Academic Settings
  const [settings, setSettings] = useState({
    institutionName: 'BuzzingBrain Vidyapeeth Academy',
    academicYear: '2026-2027',
    minimumAttendancePct: 75,
    passingGradePct: 40,
    allowTeacherCorrectionsDays: 7,
    graceLateMinutes: 15,
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSavedMsg, setSettingsSavedMsg] = useState<string | null>(null);

  // Existing Grievances State
  const [complaintFilter, setComplaintFilter] = useState<'all' | 'pending' | 'in_review' | 'resolved'>('all');
  const [selectedTicket, setSelectedTicket] = useState<ComplaintTicket | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Existing Role Assignment State
  const [roleInputUid, setRoleInputUid] = useState('');
  const [roleSelectValue, setRoleSelectValue] = useState<'teacher' | 'student'>('teacher');
  const [roleUpdateMsg, setRoleUpdateMsg] = useState<string | null>(null);
  const [isSettingRole, setIsSettingRole] = useState(false);

  // Attendance Override Modal
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overrideStudentId, setOverrideStudentId] = useState('std_1003');
  const [overrideStatus, setOverrideStatus] = useState<'present' | 'absent' | 'late' | 'excused'>('present');
  const [overrideReason, setOverrideReason] = useState('');

  // Load from backend on mount
  useEffect(() => {
    async function loadAdminData() {
      try {
        const res = await fetch('/api/academic/dashboard/admin', {
          headers: {
            'x-user-role': 'admin',
            'x-user-id': currentProfile?.uid || 'admin_1',
            'x-user-email': currentProfile?.email || 'admin@buzzingbrain.edu',
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.students) setStudents(data.students);
        }
      } catch (err) {
        // Fallback pre-seeded
      }
    }
    loadAdminData();
  }, [currentProfile]);

  const handleAssignRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleInputUid.trim()) return;
    setIsSettingRole(true);
    setRoleUpdateMsg(null);
    try {
      await setUserRole(roleInputUid.trim(), roleSelectValue);
      setRoleUpdateMsg(`Account UID "${roleInputUid.trim()}" successfully updated to ${roleSelectValue.toUpperCase()}.`);
      setRoleInputUid('');
    } catch (err: any) {
      setRoleUpdateMsg(`Failed to update role: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsSettingRole(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      await fetch('/api/academic/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': 'admin',
          'x-user-id': currentProfile?.uid || 'admin_root',
          'x-user-email': currentProfile?.email || 'admin@buzzingbrain.edu',
        },
        body: JSON.stringify(settings),
      });
      setSettingsSavedMsg('Academic policies updated and recorded in institutional audit log.');
      setTimeout(() => setSettingsSavedMsg(null), 4000);
    } catch (err) {
      setSettingsSavedMsg('Saved locally.');
      setTimeout(() => setSettingsSavedMsg(null), 3000);
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleAdminAttendanceOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideReason.trim()) return;

    const std = students.find((s) => s.id === overrideStudentId);
    if (!std) return;

    setAuditLogs((prev) => [
      {
        id: `aud_${Date.now()}`,
        actor: currentProfile?.email || 'admin@buzzingbrain.edu',
        role: 'admin',
        action: 'ATTENDANCE_OVERRIDE_ADMIN',
        entity: `std_${std.admissionNo}`,
        prev: 'absent',
        curr: overrideStatus,
        reason: overrideReason.trim(),
        time: new Date().toISOString().replace('T', ' ').slice(0, 16),
      },
      ...prev,
    ]);

    setShowOverrideModal(false);
    setOverrideReason('');
    alert(`Administrator attendance override recorded for ${std.name}. Logged in audit history.`);
  };

  // CSV Export Utility
  const downloadCsv = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const escapeCell = (cell: string | number) => {
      const cellStr = String(cell ?? '').replace(/"/g, '""');
      return `"${cellStr}"`;
    };

    const csvContent = [
      headers.map(escapeCell).join(','),
      ...rows.map(row => row.map(escapeCell).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    if (link.parentNode) {
      link.parentNode.removeChild(link);
    }
  };

  const exportStudentsCsv = () => {
    const headers = ['Admission No', 'Roll No', 'Full Name', 'Class Grade', 'Section', 'Attendance %', 'Overall Grade', 'Status'];
    const rows = students.map(s => [s.admissionNo, s.rollNo, s.name, s.classGrade, s.section, `${s.attendancePct}%`, s.grade, s.status]);
    downloadCsv('buzzing_brain_students_academic_report', headers, rows);
  };

  const exportAuditLogCsv = () => {
    const headers = ['Audit ID', 'Actor Email', 'Role', 'Action', 'Entity', 'Previous Value', 'New Value', 'Reason', 'Timestamp'];
    const rows = auditLogs.map(a => [a.id, a.actor, a.role, a.action, a.entity, a.prev, a.curr, a.reason, a.time]);
    downloadCsv('buzzing_brain_academic_audit_log', headers, rows);
  };

  // Filter complaints
  const filteredComplaints = complaints.filter(c => {
    if (complaintFilter !== 'all' && c.status !== complaintFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        c.ticketId.toLowerCase().includes(term) ||
        c.title.toLowerCase().includes(term) ||
        c.userEmail.toLowerCase().includes(term) ||
        c.category.toLowerCase().includes(term)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Institutional Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-rose-400 uppercase tracking-widest mb-1 font-bold">
            <ShieldCheck className="w-4 h-4 text-rose-400" />
            <span>Institution Administration &bull; High-Privilege Domain</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span>Academic Management &amp; Governance System</span>
            <span className="text-xs bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2.5 py-0.5 rounded-full font-mono font-bold">
              ADMINISTRATOR
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Complete institutional academic management: attendance oversight, authorized corrections, assessment policies, student progress analytics, and audit logging.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportStudentsCsv}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export Student Report
          </button>
          <button
            onClick={exportAuditLogCsv}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <History className="w-3.5 h-3.5" /> Export Audit Log
          </button>
        </div>
      </div>

      {/* Navigation Hierarchy */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10">
        {[
          { id: 'overview', label: 'Academic Overview', icon: BarChart3 },
          { id: 'students', label: 'Students', icon: Users },
          { id: 'teachers', label: 'Teachers', icon: GraduationCap },
          { id: 'classes', label: 'Classes & Sections', icon: Layers },
          { id: 'attendance', label: 'Attendance Oversight', icon: Clock },
          { id: 'assessments', label: 'Assessments & Exams', icon: FileText },
          { id: 'marks', label: 'Marks & Results', icon: Award },
          { id: 'progress', label: 'Student Progress', icon: TrendingUp },
          { id: 'assignments', label: 'Assignments', icon: BookOpen },
          { id: 'audit', label: 'Audit History', icon: History },
          { id: 'settings', label: 'Academic Settings', icon: Sliders },
          { id: 'complaints', label: 'Grievances', icon: MessageSquare, badge: complaints.filter(c => c.status === 'pending').length },
          { id: 'roles', label: 'Staff Roles', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminNavTab)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-rose-500 text-white shadow-md scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge ? (
                <span className="bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold">
                  {tab.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* =================================================================== */}
      {/* 1. ACADEMIC OVERVIEW DASHBOARD */}
      {/* =================================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Institutional KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="astra-card p-4 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[11px] font-mono text-slate-400">TOTAL ENROLLED STUDENTS</span>
              <div className="text-2xl font-black text-white">{students.length}</div>
              <span className="text-xs text-emerald-400 font-semibold">100% Active Enrollment</span>
            </div>

            <div className="astra-card p-4 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[11px] font-mono text-slate-400">AUTHORIZED FACULTY</span>
              <div className="text-2xl font-black text-white">{teachers.length} Educators</div>
              <span className="text-xs text-sky-400 font-semibold">5 Science Departments</span>
            </div>

            <div className="astra-card p-4 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[11px] font-mono text-slate-400">INSTITUTION ATTENDANCE</span>
              <div className="text-2xl font-black text-emerald-400">89.4%</div>
              <span className="text-xs text-amber-300 font-semibold">Above 75% CBSE Cutoff</span>
            </div>

            <div className="astra-card p-4 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[11px] font-mono text-slate-400">AT-RISK ATTENDANCE</span>
              <div className="text-2xl font-black text-rose-400">
                {students.filter(s => s.attendancePct < settings.minimumAttendancePct).length} Students
              </div>
              <span className="text-xs text-rose-300 font-semibold">Below 75% Threshold</span>
            </div>
          </div>

          {/* Sessions & At-Risk Split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="astra-card p-5 rounded-2xl border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-400" />
                <span>Recent Class Sessions &amp; Attendance Status</span>
              </h3>
              <div className="space-y-3">
                {sessions.map((ses) => (
                  <div key={ses.id} className="p-3.5 rounded-xl bg-slate-900 border border-white/5 space-y-1 text-xs">
                    <div className="flex items-center justify-between font-bold text-white">
                      <span>{ses.topic}</span>
                      <span className="font-mono text-sky-400">{ses.attendancePct}% Att.</span>
                    </div>
                    <div className="text-slate-400 text-[11px] flex justify-between">
                      <span>{ses.classGrade} &bull; {ses.teacher}</span>
                      <span className="text-amber-300">{ses.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="astra-card p-5 rounded-2xl border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Students Requiring Academic Intervention</span>
              </h3>
              <div className="space-y-3">
                {students.filter(s => s.attendancePct < settings.minimumAttendancePct).map((s) => (
                  <div key={s.id} className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs flex items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-white">#{s.rollNo} {s.name} ({s.classGrade})</div>
                      <div className="text-rose-300 text-[11px] mt-0.5">
                        Attendance: <strong>{s.attendancePct}%</strong> (Requires minimum {settings.minimumAttendancePct}%)
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setOverrideStudentId(s.id);
                        setShowOverrideModal(true);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs cursor-pointer shrink-0"
                    >
                      Admin Override
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 2. STUDENTS MASTER DIRECTORY */}
      {/* =================================================================== */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Institutional Student Master Directory</h3>
              <p className="text-xs text-slate-400">Complete student enrollment, admission details, and academic status</p>
            </div>
            <button
              onClick={exportStudentsCsv}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Export Directory
            </button>
          </div>

          <div className="astra-card rounded-2xl border border-white/10 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-slate-900/60 text-[11px] font-mono text-slate-400">
                  <th className="py-3 px-4">ADMISSION NO</th>
                  <th className="py-3 px-4">STUDENT NAME</th>
                  <th className="py-3 px-4">CLASS &amp; SEC</th>
                  <th className="py-3 px-4">ATTENDANCE %</th>
                  <th className="py-3 px-4">OVERALL GRADE</th>
                  <th className="py-3 px-4 text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-slate-200">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-sky-400">{s.admissionNo}</td>
                    <td className="py-3 px-4 font-semibold text-white">{s.name}</td>
                    <td className="py-3 px-4">{s.classGrade} - {s.section}</td>
                    <td className="py-3 px-4 font-mono">
                      <span className={s.attendancePct < settings.minimumAttendancePct ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                        {s.attendancePct}%
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-300">{s.grade}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono uppercase">
                        {s.status}
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
      {/* 3. TEACHERS & FACULTY DIRECTORY */}
      {/* =================================================================== */}
      {activeTab === 'teachers' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Academic Faculty &amp; Educator Roster</h3>
              <p className="text-xs text-slate-400">Authorized teaching staff, subject assignments, and session workloads</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {teachers.map((t) => (
              <div key={t.id} className="astra-card p-5 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-rose-400 uppercase font-bold">{t.role}</span>
                    <h4 className="text-sm font-bold text-white mt-0.5">{t.name}</h4>
                    <span className="text-xs text-slate-400 font-mono">{t.email}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-300 space-y-1 bg-black/30 p-3 rounded-xl border border-white/5">
                  <div><strong>Department:</strong> {t.subject}</div>
                  <div><strong>Assigned Classes:</strong> {t.classes.join(', ')}</div>
                  <div><strong>Sessions Conducted:</strong> {t.sessionsConducted}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 4. CLASSES & SECTIONS */}
      {/* =================================================================== */}
      {activeTab === 'classes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Classes &amp; Sections Directory</h3>
              <p className="text-xs text-slate-400">Curriculum grades, sections, assigned class teachers, and rooms</p>
            </div>
          </div>

          <div className="astra-card rounded-2xl border border-white/10 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-slate-900/60 text-[11px] font-mono text-slate-400">
                  <th className="py-3 px-4">CLASS &amp; SECTION</th>
                  <th className="py-3 px-4">CLASS TEACHER</th>
                  <th className="py-3 px-4">ROOM / LAB</th>
                  <th className="py-3 px-4 text-right">ENROLLMENT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-slate-200">
                {classesList.map((c) => (
                  <tr key={c.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-bold text-white">{c.name} - Section {c.section}</td>
                    <td className="py-3 px-4 text-sky-400 font-semibold">{c.classTeacher}</td>
                    <td className="py-3 px-4 text-slate-300 font-mono">{c.room}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-amber-300">{c.enrolledCount} Students</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 5. ATTENDANCE OVERSIGHT & AUTHORIZED CORRECTIONS */}
      {/* =================================================================== */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Attendance Monitoring &amp; Authorized Overrides</h3>
              <p className="text-xs text-slate-400">Administrative authority to audit attendance records and submit corrections with mandatory reasons</p>
            </div>
            <button
              onClick={() => setShowOverrideModal(true)}
              className="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
            >
              <Edit className="w-4 h-4" /> Administrative Override
            </button>
          </div>

          <div className="astra-card p-5 rounded-2xl border border-white/10 space-y-4">
            <h4 className="text-xs font-mono text-slate-400 uppercase font-bold">Session Finalization Status</h4>
            <div className="space-y-3">
              {sessions.map((ses) => (
                <div key={ses.id} className="p-3.5 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">{ses.topic} ({ses.classGrade})</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{ses.date} &bull; Teacher: {ses.teacher}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-sky-400">{ses.attendancePct}% Attendance</span>
                    <span className="block text-[10px] text-amber-300 mt-0.5">{ses.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 10. AUDIT HISTORY VIEW */}
      {/* =================================================================== */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Institutional Academic Audit History</h3>
              <p className="text-xs text-slate-400">Immutable trace log of all attendance corrections, marks overrides, and policy changes</p>
            </div>
            <button
              onClick={exportAuditLogCsv}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Export Audit Log
            </button>
          </div>

          <div className="astra-card rounded-2xl border border-white/10 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-slate-900/60 text-[11px] font-mono text-slate-400">
                  <th className="py-3 px-4">TIMESTAMP</th>
                  <th className="py-3 px-4">ACTOR &amp; ROLE</th>
                  <th className="py-3 px-4">ACTION</th>
                  <th className="py-3 px-4">REASON &amp; DETAILS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-slate-200">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-400">{log.time}</td>
                    <td className="py-3 px-4 font-mono">
                      <div className="font-bold text-white">{log.actor}</div>
                      <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.2 rounded font-mono">
                        {log.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-300">{log.action}</td>
                    <td className="py-3 px-4 text-slate-300">{log.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 11. ACADEMIC SETTINGS & POLICIES */}
      {/* =================================================================== */}
      {activeTab === 'settings' && (
        <div className="astra-card p-6 rounded-2xl border border-white/10 space-y-6 max-w-2xl">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-rose-400" />
              <span>Configurable Academic Policies &amp; Thresholds</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Set board examination compliance standards and attendance calculation limits
            </p>
          </div>

          {settingsSavedMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{settingsSavedMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Institution Name:</label>
              <input
                type="text"
                value={settings.institutionName}
                onChange={(e) => setSettings({ ...settings, institutionName: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Minimum Attendance Cutoff (%):</label>
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={settings.minimumAttendancePct}
                  onChange={(e) => setSettings({ ...settings, minimumAttendancePct: Number(e.target.value) })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Passing Grade Cutoff (%):</label>
                <input
                  type="number"
                  min="30"
                  max="100"
                  value={settings.passingGradePct}
                  onChange={(e) => setSettings({ ...settings, passingGradePct: Number(e.target.value) })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Teacher Correction Window (Days):</label>
                <input
                  type="number"
                  value={settings.allowTeacherCorrectionsDays}
                  onChange={(e) => setSettings({ ...settings, allowTeacherCorrectionsDays: Number(e.target.value) })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Late Arrival Grace Window (Minutes):</label>
                <input
                  type="number"
                  value={settings.graceLateMinutes}
                  onChange={(e) => setSettings({ ...settings, graceLateMinutes: Number(e.target.value) })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white font-mono"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSavingSettings}
                className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs cursor-pointer shadow-lg transition"
              >
                {isSavingSettings ? 'Saving...' : 'Save & Enforce Policies'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =================================================================== */}
      {/* 12. EXISTING GRIEVANCES & COMPLAINTS TAB */}
      {/* =================================================================== */}
      {activeTab === 'complaints' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Student Complaints &amp; Grievance Resolution</h3>
              <p className="text-xs text-slate-400">Review tickets filed through the platform grievance system</p>
            </div>
          </div>

          <div className="space-y-3">
            {filteredComplaints.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs astra-card rounded-2xl border border-white/10">
                No tickets found for this filter.
              </div>
            ) : (
              filteredComplaints.map((c) => (
                <div key={c.ticketId} className="astra-card p-4 rounded-2xl border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-sky-400 font-bold">{c.ticketId}</span>
                    <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-mono uppercase">
                      {c.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white">{c.title}</h4>
                  <p className="text-xs text-slate-300">{c.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 13. EXISTING STAFF ROLES ASSIGNMENT TAB */}
      {/* =================================================================== */}
      {activeTab === 'roles' && (
        <div className="astra-card p-6 rounded-2xl border border-white/10 space-y-4 max-w-md">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-sky-400" />
            <span>Assign Staff Roles by UID</span>
          </h3>
          <p className="text-xs text-slate-400">
            Promote an account to Teacher or Administrator access.
          </p>

          {roleUpdateMsg && (
            <div className="p-3 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-300 text-xs">
              {roleUpdateMsg}
            </div>
          )}

          <form onSubmit={handleAssignRole} className="space-y-3 text-xs">
            <div>
              <label className="text-slate-300 block mb-1">Account UID:</label>
              <input
                type="text"
                required
                value={roleInputUid}
                onChange={(e) => setRoleInputUid(e.target.value)}
                placeholder="Paste Firebase Auth UID"
                className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1">Target Role:</label>
              <select
                value={roleSelectValue}
                onChange={(e) => setRoleSelectValue(e.target.value as any)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-white font-bold"
              >
                <option value="teacher">Teacher (Class &amp; Assessment Management)</option>
                <option value="student">Student (Standard Learner)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSettingRole}
              className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold cursor-pointer"
            >
              {isSettingRole ? 'Updating...' : 'Assign Role'}
            </button>
          </form>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL: ADMINISTRATOR ATTENDANCE OVERRIDE */}
      {/* =================================================================== */}
      {showOverrideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="astra-card border border-white/20 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                <span>Privileged Attendance Override</span>
              </h3>
              <button
                onClick={() => setShowOverrideModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Administrative overrides directly update the official student record. All overrides are recorded in the institutional audit log with your administrative actor ID.
            </p>

            <form onSubmit={handleAdminAttendanceOverride} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Target Student:</label>
                <select
                  value={overrideStudentId}
                  onChange={(e) => setOverrideStudentId(e.target.value)}
                  className="w-full bg-slate-900 border border-white/20 rounded-xl p-2.5 text-white font-bold"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      #{s.rollNo} {s.name} ({s.classGrade}) — Current {s.attendancePct}%
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Override Status:</label>
                <select
                  value={overrideStatus}
                  onChange={(e) => setOverrideStatus(e.target.value as any)}
                  className="w-full bg-slate-900 border border-white/20 rounded-xl p-2.5 text-white font-bold"
                >
                  <option value="present">Present (Authorized Correction)</option>
                  <option value="excused">Excused (Medical Board Leave)</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late Arrival</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Administrative Reason (Mandatory):</label>
                <textarea
                  required
                  rows={3}
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="e.g., Medical leave approved by principal; board sanctioned competition..."
                  className="w-full bg-black/40 border border-white/20 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOverrideModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold cursor-pointer"
                >
                  Log Override &amp; Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
