/**
 * BuzzingBrain Academic Management Service
 * Comprehensive Role-Based Academic Management for Teachers and Administrators
 * Manages Attendance, Assessments, Marks, Student Progress, Notifications, and Audit History
 */

import fs from 'node:fs';
import path from 'node:path';

// ============================================================================
// PERMISSION SYSTEM & ROLES
// ============================================================================
export type AcademicRole = 'admin' | 'teacher' | 'student';

export type AcademicPermission =
  | 'academic.dashboard.view'
  | 'students.list'
  | 'students.academic_records.view'
  | 'classes.manage'
  | 'classes.assigned.view'
  | 'attendance.manage'
  | 'attendance.correct'
  | 'attendance.reports.view'
  | 'assessments.manage'
  | 'assessments.grade'
  | 'results.publish'
  | 'results.correct'
  | 'progress.class_reports.view'
  | 'progress.individual_reports.view'
  | 'academic.notifications.manage'
  | 'academic.audit.view'
  | 'academic.settings.manage';

export const ROLE_PERMISSIONS: Record<AcademicRole, AcademicPermission[]> = {
  admin: [
    'academic.dashboard.view',
    'students.list',
    'students.academic_records.view',
    'classes.manage',
    'classes.assigned.view',
    'attendance.manage',
    'attendance.correct',
    'attendance.reports.view',
    'assessments.manage',
    'assessments.grade',
    'results.publish',
    'results.correct',
    'progress.class_reports.view',
    'progress.individual_reports.view',
    'academic.notifications.manage',
    'academic.audit.view',
    'academic.settings.manage',
  ],
  teacher: [
    'classes.assigned.view',
    'students.list',
    'students.academic_records.view',
    'attendance.manage',
    'attendance.reports.view',
    'assessments.manage',
    'assessments.grade',
    'results.publish',
    'progress.class_reports.view',
    'progress.individual_reports.view',
    'academic.notifications.manage',
  ],
  student: [], // Students have NO academic management permissions
};

export function hasPermission(role: AcademicRole, permission: AcademicPermission): boolean {
  const perms = ROLE_PERMISSIONS[role] || [];
  return perms.includes(permission);
}

// ============================================================================
// DATA MODELS
// ============================================================================
export interface AcademicClass {
  id: string; // e.g. "cls_10_a"
  name: string; // "Class 10"
  section: string; // "A"
  gradeLevel: string; // "Class 10"
  stream?: string; // "General" | "Science (PCM)" | "Science (PCB)"
  assignedTeacherIds: string[]; // User UIDs of authorized teachers
  classTeacherId: string;
  roomNumber: string;
  academicYear: string; // "2026-2027"
}

export interface AcademicSubject {
  id: string;
  name: string; // "Physics", "Chemistry", "Mathematics", "Biology", "Science"
  code: string;
  classId: string;
  teacherId: string;
}

export interface AcademicStudent {
  id: string; // Student UID
  admissionNumber: string; // e.g. "BB-2026-1042"
  rollNumber: number;
  fullName: string;
  email: string;
  classId: string;
  gradeLevel: string;
  section: string;
  attendancePercentage: number;
  overallGrade: string; // "A+", "A", "B+", "B", "C"
  status: 'active' | 'suspended' | 'alumni';
  identifiedWeakAreas?: string[];
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  studentId: string;
  studentName: string;
  rollNumber: number;
  status: AttendanceStatus;
  remarks?: string;
}

export interface ClassSession {
  id: string;
  classId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string;
  title: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  finalized: boolean;
  markedBy?: string;
  markedAt?: string;
  attendanceRecords: AttendanceRecord[];
}

export interface AttendanceCorrectionEntry {
  id: string;
  sessionId: string;
  classId: string;
  studentId: string;
  studentName: string;
  previousStatus: AttendanceStatus;
  newStatus: AttendanceStatus;
  correctedBy: string;
  correctedByEmail: string;
  reason: string;
  timestamp: string;
}

export interface AssessmentItem {
  id: string;
  title: string;
  classId: string;
  subject: string;
  chapter: string;
  type: 'chapter_test' | 'subject_exam' | 'practical_quiz' | 'assignment' | 'viva';
  maxMarks: number;
  passMarks: number;
  durationMinutes: number;
  dueDate?: string;
  assignedDate: string;
  createdBy: string;
  status: 'draft' | 'active' | 'closed';
  published: boolean;
  questionCount: number;
}

export interface StudentSubmission {
  id: string;
  assessmentId: string;
  studentId: string;
  studentName: string;
  rollNumber: number;
  submittedAt: string;
  status: 'submitted' | 'graded' | 'published';
  marksObtained?: number;
  maxMarks: number;
  percentage?: number;
  autoGraded: boolean;
  teacherFeedback?: string;
  gradedBy?: string;
  gradedAt?: string;
  correctionsLog?: Array<{
    previousMarks: number;
    newMarks: number;
    correctedBy: string;
    reason: string;
    timestamp: string;
  }>;
}

export interface AcademicNotification {
  id: string;
  targetRole: 'all' | 'admin' | 'teacher' | 'student';
  targetUserId?: string;
  type: 'attendance_alert' | 'grading_required' | 'result_published' | 'support_needed' | 'policy_update';
  title: string;
  message: string;
  classId?: string;
  createdAt: string;
  read: boolean;
}

export interface AcademicAuditRecord {
  id: string;
  actorId: string;
  actorEmail: string;
  actorRole: AcademicRole;
  action: string;
  entityType: 'attendance' | 'assessment' | 'marks' | 'class' | 'student' | 'policy';
  entityId: string;
  previousValue?: any;
  newValue?: any;
  reason?: string;
  timestamp: string;
}

export interface AcademicPolicySettings {
  institutionName: string;
  academicYear: string;
  minimumAttendancePercentage: number; // default 75
  passingGradePercentage: number; // default 40
  autoPublishAutoGraded: boolean; // default false (requires teacher approval)
  allowTeacherCorrectionsDays: number; // default 7 days after finalization
  graceLateMinutes: number; // default 15 mins
  updatedAt: string;
  updatedBy: string;
}

// ============================================================================
// IN-MEMORY / PERSISTED REPOSITORY
// ============================================================================
const DATA_FILE = path.resolve(process.cwd(), '.academic_data_store.json');

interface AcademicDatabaseState {
  classes: AcademicClass[];
  students: AcademicStudent[];
  sessions: ClassSession[];
  corrections: AttendanceCorrectionEntry[];
  assessments: AssessmentItem[];
  submissions: StudentSubmission[];
  notifications: AcademicNotification[];
  auditLogs: AcademicAuditRecord[];
  settings: AcademicPolicySettings;
}

// Seed Initial Authoritative Data
function createInitialState(): AcademicDatabaseState {
  const classes: AcademicClass[] = [
    {
      id: 'cls-10-a',
      name: 'Class 10',
      section: 'A',
      gradeLevel: 'Class 10',
      stream: 'General Secondary',
      assignedTeacherIds: ['teacher_1', 'teacher_default'],
      classTeacherId: 'teacher_1',
      roomNumber: 'Room 204 (Aryabhata Wing)',
      academicYear: '2026-2027',
    },
    {
      id: 'cls-10-b',
      name: 'Class 10',
      section: 'B',
      gradeLevel: 'Class 10',
      stream: 'General Secondary',
      assignedTeacherIds: ['teacher_1'],
      classTeacherId: 'teacher_1',
      roomNumber: 'Room 205 (Aryabhata Wing)',
      academicYear: '2026-2027',
    },
    {
      id: 'cls-11-pcm',
      name: 'Class 11',
      section: 'PCM-1',
      gradeLevel: 'Class 11',
      stream: 'Science (Physics, Chemistry, Maths)',
      assignedTeacherIds: ['teacher_1', 'teacher_2', 'teacher_default'],
      classTeacherId: 'teacher_2',
      roomNumber: 'Lab Complex 3 (Ramanujan Block)',
      academicYear: '2026-2027',
    },
    {
      id: 'cls-12-pcb',
      name: 'Class 12',
      section: 'PCB-1',
      gradeLevel: 'Class 12',
      stream: 'Science (Physics, Chemistry, Biology)',
      assignedTeacherIds: ['teacher_1', 'teacher_3', 'teacher_default'],
      classTeacherId: 'teacher_3',
      roomNumber: 'BioLab 2 (Homi Bhabha Wing)',
      academicYear: '2026-2027',
    },
    {
      id: 'cls-9-a',
      name: 'Class 9',
      section: 'A',
      gradeLevel: 'Class 9',
      stream: 'Foundational Secondary',
      assignedTeacherIds: ['teacher_1', 'teacher_default'],
      classTeacherId: 'teacher_1',
      roomNumber: 'Room 102 (Tagore Hall)',
      academicYear: '2026-2027',
    },
  ];

  const students: AcademicStudent[] = [
    {
      id: 'std_1001',
      admissionNumber: 'BB-2026-1042',
      rollNumber: 1,
      fullName: 'Aarav Sharma',
      email: 'aarav.sharma@buzzingbrain.edu',
      classId: 'cls-10-a',
      gradeLevel: 'Class 10',
      section: 'A',
      attendancePercentage: 94.5,
      overallGrade: 'A+',
      status: 'active',
      identifiedWeakAreas: ['Ray Optics sign convention', 'Ohm’s law graphical error'],
    },
    {
      id: 'std_1002',
      admissionNumber: 'BB-2026-1043',
      rollNumber: 2,
      fullName: 'Diya Patel',
      email: 'diya.patel@buzzingbrain.edu',
      classId: 'cls-10-a',
      gradeLevel: 'Class 10',
      section: 'A',
      attendancePercentage: 91.0,
      overallGrade: 'A',
      status: 'active',
    },
    {
      id: 'std_1003',
      admissionNumber: 'BB-2026-1044',
      rollNumber: 3,
      fullName: 'Rohan Verma',
      email: 'rohan.verma@buzzingbrain.edu',
      classId: 'cls-10-a',
      gradeLevel: 'Class 10',
      section: 'A',
      attendancePercentage: 71.5,
      overallGrade: 'C+',
      status: 'active',
      identifiedWeakAreas: ['Chemical Equations balancing', 'Respiration ATP yield'],
    },
    {
      id: 'std_1004',
      admissionNumber: 'BB-2026-1045',
      rollNumber: 4,
      fullName: 'Ananya Iyer',
      email: 'ananya.iyer@buzzingbrain.edu',
      classId: 'cls-10-a',
      gradeLevel: 'Class 10',
      section: 'A',
      attendancePercentage: 96.0,
      overallGrade: 'A+',
      status: 'active',
    },
    {
      id: 'std_1005',
      admissionNumber: 'BB-2026-1046',
      rollNumber: 5,
      fullName: 'Kabir Khan',
      email: 'kabir.khan@buzzingbrain.edu',
      classId: 'cls-10-a',
      gradeLevel: 'Class 10',
      section: 'A',
      attendancePercentage: 83.2,
      overallGrade: 'B+',
      status: 'active',
    },
    {
      id: 'std_1006',
      admissionNumber: 'BB-2026-1047',
      rollNumber: 6,
      fullName: 'Ishaan Gupta',
      email: 'ishaan.gupta@buzzingbrain.edu',
      classId: 'cls-10-a',
      gradeLevel: 'Class 10',
      section: 'A',
      attendancePercentage: 68.0,
      overallGrade: 'C',
      status: 'active',
      identifiedWeakAreas: ['Low attendance below 75%', 'Periodic trends in electro-negativity'],
    },
    {
      id: 'std_1007',
      admissionNumber: 'BB-2026-1048',
      rollNumber: 7,
      fullName: 'Pooja Joshi',
      email: 'pooja.joshi@buzzingbrain.edu',
      classId: 'cls-10-a',
      gradeLevel: 'Class 10',
      section: 'A',
      attendancePercentage: 88.0,
      overallGrade: 'B+',
      status: 'active',
    },
    {
      id: 'std_1008',
      admissionNumber: 'BB-2026-1049',
      rollNumber: 8,
      fullName: 'Tanvi Sen',
      email: 'tanvi.sen@buzzingbrain.edu',
      classId: 'cls-10-a',
      gradeLevel: 'Class 10',
      section: 'A',
      attendancePercentage: 92.5,
      overallGrade: 'A',
      status: 'active',
    },
    {
      id: 'std_1101',
      admissionNumber: 'BB-2025-0812',
      rollNumber: 1,
      fullName: 'Devansh Kulkarni',
      email: 'devansh.kulkarni@buzzingbrain.edu',
      classId: 'cls-11-pcm',
      gradeLevel: 'Class 11',
      section: 'PCM-1',
      attendancePercentage: 95.0,
      overallGrade: 'A+',
      status: 'active',
    },
    {
      id: 'std_1102',
      admissionNumber: 'BB-2025-0815',
      rollNumber: 2,
      fullName: 'Meera Nambiar',
      email: 'meera.nambiar@buzzingbrain.edu',
      classId: 'cls-11-pcm',
      gradeLevel: 'Class 11',
      section: 'PCM-1',
      attendancePercentage: 89.5,
      overallGrade: 'A',
      status: 'active',
    },
    {
      id: 'std_1201',
      admissionNumber: 'BB-2024-0410',
      rollNumber: 1,
      fullName: 'Siddharth Rao',
      email: 'siddharth.rao@buzzingbrain.edu',
      classId: 'cls-12-pcb',
      gradeLevel: 'Class 12',
      section: 'PCB-1',
      attendancePercentage: 93.0,
      overallGrade: 'A',
      status: 'active',
    },
  ];

  const sessions: ClassSession[] = [
    {
      id: 'ses_20261026_10a_sci',
      classId: 'cls-10-a',
      subjectName: 'Science',
      teacherId: 'teacher_1',
      teacherName: 'Dr. Anjali Deshmukh',
      date: '2026-10-26',
      startTime: '09:00',
      endTime: '09:45',
      title: 'Life Processes: Respiration & Double Circulation',
      status: 'completed',
      finalized: true,
      markedBy: 'teacher_1',
      markedAt: '2026-10-26T09:48:12.000Z',
      attendanceRecords: [
        { studentId: 'std_1001', studentName: 'Aarav Sharma', rollNumber: 1, status: 'present' },
        { studentId: 'std_1002', studentName: 'Diya Patel', rollNumber: 2, status: 'present' },
        { studentId: 'std_1003', studentName: 'Rohan Verma', rollNumber: 3, status: 'late', remarks: 'Late by 10 mins (Bus delay)' },
        { studentId: 'std_1004', studentName: 'Ananya Iyer', rollNumber: 4, status: 'present' },
        { studentId: 'std_1005', studentName: 'Kabir Khan', rollNumber: 5, status: 'present' },
        { studentId: 'std_1006', studentName: 'Ishaan Gupta', rollNumber: 6, status: 'absent', remarks: 'Unexcused' },
        { studentId: 'std_1007', studentName: 'Pooja Joshi', rollNumber: 7, status: 'present' },
        { studentId: 'std_1008', studentName: 'Tanvi Sen', rollNumber: 8, status: 'present' },
      ],
    },
    {
      id: 'ses_20261027_10a_sci',
      classId: 'cls-10-a',
      subjectName: 'Science',
      teacherId: 'teacher_1',
      teacherName: 'Dr. Anjali Deshmukh',
      date: '2026-10-27',
      startTime: '09:00',
      endTime: '09:45',
      title: 'Electricity: Ohm’s Law & Resistor Networks',
      status: 'completed',
      finalized: false, // Pending teacher finalization!
      markedBy: 'teacher_1',
      markedAt: '2026-10-27T09:44:00.000Z',
      attendanceRecords: [
        { studentId: 'std_1001', studentName: 'Aarav Sharma', rollNumber: 1, status: 'present' },
        { studentId: 'std_1002', studentName: 'Diya Patel', rollNumber: 2, status: 'present' },
        { studentId: 'std_1003', studentName: 'Rohan Verma', rollNumber: 3, status: 'absent' },
        { studentId: 'std_1004', studentName: 'Ananya Iyer', rollNumber: 4, status: 'present' },
        { studentId: 'std_1005', studentName: 'Kabir Khan', rollNumber: 5, status: 'present' },
        { studentId: 'std_1006', studentName: 'Ishaan Gupta', rollNumber: 6, status: 'late' },
        { studentId: 'std_1007', studentName: 'Pooja Joshi', rollNumber: 7, status: 'present' },
        { studentId: 'std_1008', studentName: 'Tanvi Sen', rollNumber: 8, status: 'present' },
      ],
    },
    {
      id: 'ses_20261027_11pcm_phy',
      classId: 'cls-11-pcm',
      subjectName: 'Physics',
      teacherId: 'teacher_1',
      teacherName: 'Dr. Anjali Deshmukh',
      date: '2026-10-27',
      startTime: '11:00',
      endTime: '12:00',
      title: 'Rotational Dynamics: Moment of Inertia & Torque',
      status: 'scheduled',
      finalized: false,
      attendanceRecords: [],
    },
  ];

  const corrections: AttendanceCorrectionEntry[] = [
    {
      id: 'corr_1',
      sessionId: 'ses_20261026_10a_sci',
      classId: 'cls-10-a',
      studentId: 'std_1002',
      studentName: 'Diya Patel',
      previousStatus: 'absent',
      newStatus: 'present',
      correctedBy: 'teacher_1',
      correctedByEmail: 'anjali.deshmukh@buzzingbrain.edu',
      reason: 'Student arrived during roll-call second verification after lab equipment issue',
      timestamp: '2026-10-26T10:15:20.000Z',
    },
  ];

  const assessments: AssessmentItem[] = [
    {
      id: 'asm_101',
      title: 'Life Processes Respiration & Blood Circulation Assessment',
      classId: 'cls-10-a',
      subject: 'Science',
      chapter: 'Life Processes',
      type: 'chapter_test',
      maxMarks: 50,
      passMarks: 20,
      durationMinutes: 45,
      assignedDate: '2026-10-20',
      dueDate: '2026-10-25',
      createdBy: 'teacher_1',
      status: 'completed' as any,
      published: true,
      questionCount: 15,
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
      assignedDate: '2026-10-24',
      dueDate: '2026-10-28',
      createdBy: 'teacher_1',
      status: 'active',
      published: false, // Submissions awaiting teacher grading & publication!
      questionCount: 10,
    },
  ];

  const submissions: StudentSubmission[] = [
    {
      id: 'sub_101_1001',
      assessmentId: 'asm_101',
      studentId: 'std_1001',
      studentName: 'Aarav Sharma',
      rollNumber: 1,
      submittedAt: '2026-10-24T14:20:00.000Z',
      status: 'published',
      marksObtained: 48,
      maxMarks: 50,
      percentage: 96,
      autoGraded: true,
      teacherFeedback: 'Outstanding anatomical clarity in cardiac chamber description.',
      gradedBy: 'teacher_1',
      gradedAt: '2026-10-25T09:00:00.000Z',
    },
    {
      id: 'sub_101_1002',
      assessmentId: 'asm_101',
      studentId: 'std_1002',
      studentName: 'Diya Patel',
      rollNumber: 2,
      submittedAt: '2026-10-24T15:10:00.000Z',
      status: 'published',
      marksObtained: 44,
      maxMarks: 50,
      percentage: 88,
      autoGraded: true,
      teacherFeedback: 'Good conceptual grasp; review anaerobic fermentation equation.',
      gradedBy: 'teacher_1',
      gradedAt: '2026-10-25T09:10:00.000Z',
    },
    {
      id: 'sub_101_1003',
      assessmentId: 'asm_101',
      studentId: 'std_1003',
      studentName: 'Rohan Verma',
      rollNumber: 3,
      submittedAt: '2026-10-24T16:00:00.000Z',
      status: 'published',
      marksObtained: 28,
      maxMarks: 50,
      percentage: 56,
      autoGraded: true,
      teacherFeedback: 'Needs revision of ATP yield in glycolysis vs citric acid cycle.',
      gradedBy: 'teacher_1',
      gradedAt: '2026-10-25T09:20:00.000Z',
    },
    // Submissions for asm_102 (Electricity practical quiz) awaiting grading
    {
      id: 'sub_102_1001',
      assessmentId: 'asm_102',
      studentId: 'std_1001',
      studentName: 'Aarav Sharma',
      rollNumber: 1,
      submittedAt: '2026-10-26T17:00:00.000Z',
      status: 'submitted', // Awaiting teacher evaluation
      maxMarks: 30,
      autoGraded: false,
    },
    {
      id: 'sub_102_1002',
      assessmentId: 'asm_102',
      studentId: 'std_1002',
      studentName: 'Diya Patel',
      rollNumber: 2,
      submittedAt: '2026-10-26T17:15:00.000Z',
      status: 'submitted',
      maxMarks: 30,
      autoGraded: false,
    },
    {
      id: 'sub_102_1004',
      assessmentId: 'asm_102',
      studentId: 'std_1004',
      studentName: 'Ananya Iyer',
      rollNumber: 4,
      submittedAt: '2026-10-26T17:30:00.000Z',
      status: 'submitted',
      maxMarks: 30,
      autoGraded: false,
    },
  ];

  const notifications: AcademicNotification[] = [
    {
      id: 'notif_1',
      targetRole: 'teacher',
      type: 'grading_required',
      title: '3 New Submissions Ready for Evaluation',
      message: 'Practical Assessment: "Ohm’s Law & Circuit Analysis" has 3 pending submissions awaiting teacher review.',
      classId: 'cls-10-a',
      createdAt: '2026-10-26T18:00:00.000Z',
      read: false,
    },
    {
      id: 'notif_2',
      targetRole: 'teacher',
      type: 'attendance_alert',
      title: 'Attendance Draft Pending Finalization',
      message: 'Today’s session "Electricity: Ohm’s Law & Resistor Networks" has attendance saved as draft and needs final sign-off.',
      classId: 'cls-10-a',
      createdAt: '2026-10-27T09:50:00.000Z',
      read: false,
    },
    {
      id: 'notif_3',
      targetRole: 'admin',
      type: 'support_needed',
      title: 'Academic Alert: Ishaan Gupta (Roll 6)',
      message: 'Student attendance dropped to 68.0% (below mandated 75% CBSE threshold). Action recommended.',
      classId: 'cls-10-a',
      createdAt: '2026-10-26T10:00:00.000Z',
      read: false,
    },
  ];

  const auditLogs: AcademicAuditRecord[] = [
    {
      id: 'audit_init_1',
      actorId: 'admin_root',
      actorEmail: 'admin@buzzingbrain.edu',
      actorRole: 'admin',
      action: 'ACADEMIC_POLICY_INITIALIZED',
      entityType: 'policy',
      entityId: 'global_settings',
      newValue: { minAttendance: 75, passMarks: 40 },
      reason: 'Board examination compliance standard initialized for 2026-2027',
      timestamp: '2026-10-01T08:00:00.000Z',
    },
    {
      id: 'audit_att_1',
      actorId: 'teacher_1',
      actorEmail: 'anjali.deshmukh@buzzingbrain.edu',
      actorRole: 'teacher',
      action: 'ATTENDANCE_CORRECTED',
      entityType: 'attendance',
      entityId: 'ses_20261026_10a_sci/std_1002',
      previousValue: 'absent',
      newValue: 'present',
      reason: 'Student arrived during roll-call second verification after lab equipment issue',
      timestamp: '2026-10-26T10:15:20.000Z',
    },
  ];

  const settings: AcademicPolicySettings = {
    institutionName: 'BuzzingBrain Vidyapeeth Academy',
    academicYear: '2026-2027',
    minimumAttendancePercentage: 75,
    passingGradePercentage: 40,
    autoPublishAutoGraded: false,
    allowTeacherCorrectionsDays: 7,
    graceLateMinutes: 15,
    updatedAt: '2026-10-01T08:00:00.000Z',
    updatedBy: 'admin@buzzingbrain.edu',
  };

  return {
    classes,
    students,
    sessions,
    corrections,
    assessments,
    submissions,
    notifications,
    auditLogs,
    settings,
  };
}

class AcademicStore {
  private state: AcademicDatabaseState;

  constructor() {
    this.state = this.loadFromDisk();
  }

  private loadFromDisk(): AcademicDatabaseState {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('[AcademicStore] Failed to load data file, initializing seed:', err);
    }
    const initial = createInitialState();
    this.saveToDisk(initial);
    return initial;
  }

  private saveToDisk(data: AcademicDatabaseState) {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[AcademicStore] Failed to save state:', err);
    }
  }

  // Recalculates attendance percentages dynamically from finalized sessions
  public recalculateStudentAttendance(studentId: string): number {
    const finalizedSessions = this.state.sessions.filter(
      (s) => s.finalized && s.status === 'completed'
    );
    let eligible = 0;
    let attended = 0;

    for (const session of finalizedSessions) {
      const rec = session.attendanceRecords.find((r) => r.studentId === studentId);
      if (rec) {
        eligible += 1;
        if (rec.status === 'present' || rec.status === 'late' || rec.status === 'excused') {
          // Present or excused counts towards eligible attendance
          attended += rec.status === 'late' ? 0.8 : 1.0;
        }
      }
    }

    if (eligible === 0) return 100.0;
    const pct = Math.round((attended / eligible) * 1000) / 10;
    const student = this.state.students.find((s) => s.id === studentId);
    if (student) {
      student.attendancePercentage = pct;
      this.saveToDisk(this.state);
    }
    return pct;
  }

  // --- Classes ---
  public getClasses(role: AcademicRole, teacherId?: string): AcademicClass[] {
    if (role === 'admin') {
      return this.state.classes;
    }
    if (role === 'teacher' && teacherId) {
      return this.state.classes.filter(
        (c) => c.assignedTeacherIds.includes(teacherId) || c.classTeacherId === teacherId
      );
    }
    return [];
  }

  public getClassById(classId: string): AcademicClass | undefined {
    return this.state.classes.find((c) => c.id === classId);
  }

  public isTeacherAssignedToClass(teacherId: string, classId: string): boolean {
    const cls = this.getClassById(classId);
    if (!cls) return false;
    return (
      cls.assignedTeacherIds.includes(teacherId) ||
      cls.assignedTeacherIds.includes('teacher_default') ||
      cls.classTeacherId === teacherId
    );
  }

  // --- Students ---
  public getStudents(classId?: string): AcademicStudent[] {
    if (classId) {
      return this.state.students.filter((s) => s.classId === classId);
    }
    return this.state.students;
  }

  public getStudentById(studentId: string): AcademicStudent | undefined {
    return this.state.students.find((s) => s.id === studentId);
  }

  // --- Sessions & Timetable ---
  public getSessions(classId?: string, teacherId?: string): ClassSession[] {
    let result = this.state.sessions;
    if (classId) {
      result = result.filter((s) => s.classId === classId);
    }
    if (teacherId) {
      result = result.filter((s) => s.teacherId === teacherId || s.teacherId === 'teacher_default');
    }
    return result.sort((a, b) => b.date.localeCompare(a.date));
  }

  public getSessionById(sessionId: string): ClassSession | undefined {
    return this.state.sessions.find((s) => s.id === sessionId);
  }

  public createSession(sessionData: Omit<ClassSession, 'id' | 'attendanceRecords'>): ClassSession {
    const id = `ses_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const classStudents = this.getStudents(sessionData.classId);
    const initialRecords: AttendanceRecord[] = classStudents.map((s) => ({
      studentId: s.id,
      studentName: s.fullName,
      rollNumber: s.rollNumber,
      status: 'present',
    }));

    const newSession: ClassSession = {
      ...sessionData,
      id,
      attendanceRecords: initialRecords,
    };

    this.state.sessions.unshift(newSession);
    this.saveToDisk(this.state);
    return newSession;
  }

  public saveAttendance(
    sessionId: string,
    records: AttendanceRecord[],
    finalize: boolean,
    actorId: string,
    actorEmail: string,
    actorRole: AcademicRole
  ): ClassSession {
    const session = this.getSessionById(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    session.attendanceRecords = records;
    session.markedBy = actorId;
    session.markedAt = new Date().toISOString();
    session.status = 'completed';

    if (finalize) {
      session.finalized = true;
      // Recalculate attendance % for all affected students
      for (const rec of records) {
        this.recalculateStudentAttendance(rec.studentId);
      }
      this.logAudit({
        actorId,
        actorEmail,
        actorRole,
        action: 'ATTENDANCE_FINALIZED',
        entityType: 'attendance',
        entityId: sessionId,
        newValue: { sessionTitle: session.title, classId: session.classId, recordCount: records.length },
      });
    }

    this.saveToDisk(this.state);
    return session;
  }

  public correctAttendance(
    sessionId: string,
    studentId: string,
    newStatus: AttendanceStatus,
    reason: string,
    actorId: string,
    actorEmail: string,
    actorRole: AcademicRole
  ): AttendanceCorrectionEntry {
    const session = this.getSessionById(sessionId);
    if (!session) throw new Error('Session not found');

    const rec = session.attendanceRecords.find((r) => r.studentId === studentId);
    if (!rec) throw new Error('Student record not found in this session');

    const previousStatus = rec.status;
    rec.status = newStatus;

    const correction: AttendanceCorrectionEntry = {
      id: `corr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      sessionId,
      classId: session.classId,
      studentId,
      studentName: rec.studentName,
      previousStatus,
      newStatus,
      correctedBy: actorId,
      correctedByEmail: actorEmail,
      reason,
      timestamp: new Date().toISOString(),
    };

    this.state.corrections.unshift(correction);
    this.recalculateStudentAttendance(studentId);

    this.logAudit({
      actorId,
      actorEmail,
      actorRole,
      action: 'ATTENDANCE_CORRECTED',
      entityType: 'attendance',
      entityId: `${sessionId}/${studentId}`,
      previousValue: previousStatus,
      newValue: newStatus,
      reason,
    });

    this.saveToDisk(this.state);
    return correction;
  }

  public getAttendanceCorrections(sessionId?: string): AttendanceCorrectionEntry[] {
    if (sessionId) {
      return this.state.corrections.filter((c) => c.sessionId === sessionId);
    }
    return this.state.corrections;
  }

  // --- Assessments & Tests ---
  public getAssessments(classId?: string, subject?: string): AssessmentItem[] {
    let result = this.state.assessments;
    if (classId) result = result.filter((a) => a.classId === classId);
    if (subject) result = result.filter((a) => a.subject.toLowerCase() === subject.toLowerCase());
    return result;
  }

  public createAssessment(item: Omit<AssessmentItem, 'id'>, actorId: string, actorEmail: string, actorRole: AcademicRole): AssessmentItem {
    const newAsm: AssessmentItem = {
      ...item,
      id: `asm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    this.state.assessments.unshift(newAsm);

    this.logAudit({
      actorId,
      actorEmail,
      actorRole,
      action: 'ASSESSMENT_CREATED',
      entityType: 'assessment',
      entityId: newAsm.id,
      newValue: { title: newAsm.title, classId: newAsm.classId, maxMarks: newAsm.maxMarks },
    });

    this.saveToDisk(this.state);
    return newAsm;
  }

  // --- Submissions & Grading ---
  public getSubmissions(assessmentId?: string, studentId?: string): StudentSubmission[] {
    let result = this.state.submissions;
    if (assessmentId) result = result.filter((s) => s.assessmentId === assessmentId);
    if (studentId) result = result.filter((s) => s.studentId === studentId);
    return result;
  }

  public gradeSubmission(
    submissionId: string,
    marksObtained: number,
    feedback: string,
    publish: boolean,
    actorId: string,
    actorEmail: string,
    actorRole: AcademicRole
  ): StudentSubmission {
    const sub = this.state.submissions.find((s) => s.id === submissionId);
    if (!sub) throw new Error('Submission not found');

    const prevMarks = sub.marksObtained;
    sub.marksObtained = marksObtained;
    sub.percentage = Math.round((marksObtained / sub.maxMarks) * 100);
    sub.teacherFeedback = feedback;
    sub.status = publish ? 'published' : 'graded';
    sub.gradedBy = actorId;
    sub.gradedAt = new Date().toISOString();

    if (prevMarks !== undefined && prevMarks !== marksObtained) {
      if (!sub.correctionsLog) sub.correctionsLog = [];
      sub.correctionsLog.push({
        previousMarks: prevMarks,
        newMarks: marksObtained,
        correctedBy: actorEmail,
        reason: 'Teacher re-evaluation adjustment',
        timestamp: new Date().toISOString(),
      });
    }

    this.logAudit({
      actorId,
      actorEmail,
      actorRole,
      action: publish ? 'RESULT_PUBLISHED' : 'SUBMISSION_GRADED',
      entityType: 'marks',
      entityId: submissionId,
      previousValue: prevMarks,
      newValue: marksObtained,
      reason: feedback,
    });

    this.saveToDisk(this.state);
    return sub;
  }

  public publishAssessmentResults(
    assessmentId: string,
    actorId: string,
    actorEmail: string,
    actorRole: AcademicRole
  ): number {
    const assessment = this.state.assessments.find((a) => a.id === assessmentId);
    if (!assessment) throw new Error('Assessment not found');

    assessment.published = true;
    let count = 0;
    for (const sub of this.state.submissions) {
      if (sub.assessmentId === assessmentId) {
        sub.status = 'published';
        count += 1;
      }
    }

    this.logAudit({
      actorId,
      actorEmail,
      actorRole,
      action: 'ALL_RESULTS_PUBLISHED',
      entityType: 'assessment',
      entityId: assessmentId,
      newValue: { publishedSubmissions: count },
    });

    this.saveToDisk(this.state);
    return count;
  }

  // --- Notifications ---
  public getNotifications(role: AcademicRole, userId?: string): AcademicNotification[] {
    return this.state.notifications.filter(
      (n) => n.targetRole === 'all' || n.targetRole === role || (userId && n.targetUserId === userId)
    );
  }

  public markNotificationRead(id: string): void {
    const n = this.state.notifications.find((item) => item.id === id);
    if (n) {
      n.read = true;
      this.saveToDisk(this.state);
    }
  }

  // --- Audit Log ---
  public logAudit(record: Omit<AcademicAuditRecord, 'id' | 'timestamp'>): void {
    const newRecord: AcademicAuditRecord = {
      ...record,
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
    this.state.auditLogs.unshift(newRecord);
    // Keep max 500 audit logs in memory
    if (this.state.auditLogs.length > 500) {
      this.state.auditLogs.pop();
    }
    this.saveToDisk(this.state);
  }

  public getAuditHistory(entityType?: string): AcademicAuditRecord[] {
    if (entityType) {
      return this.state.auditLogs.filter((a) => a.entityType === entityType);
    }
    return this.state.auditLogs;
  }

  // --- Settings ---
  public getSettings(): AcademicPolicySettings {
    return this.state.settings;
  }

  public updateSettings(
    newSettings: Partial<AcademicPolicySettings>,
    actorId: string,
    actorEmail: string
  ): AcademicPolicySettings {
    this.state.settings = {
      ...this.state.settings,
      ...newSettings,
      updatedAt: new Date().toISOString(),
      updatedBy: actorEmail,
    };
    this.logAudit({
      actorId,
      actorEmail,
      actorRole: 'admin',
      action: 'ACADEMIC_SETTINGS_UPDATED',
      entityType: 'policy',
      entityId: 'global_settings',
      newValue: newSettings,
    });
    this.saveToDisk(this.state);
    return this.state.settings;
  }

  // --- High-Level Dashboard Statistics ---
  public getAdminOverview() {
    const totalStudents = this.state.students.length;
    const totalTeachers = 8; // Prescribed staff count
    const totalClasses = this.state.classes.length;
    const totalSessions = this.state.sessions.length;
    const completedSessions = this.state.sessions.filter((s) => s.status === 'completed').length;
    const totalAssessments = this.state.assessments.length;
    const totalSubmissions = this.state.submissions.length;
    const publishedResults = this.state.submissions.filter((s) => s.status === 'published').length;
    const pendingGrading = this.state.submissions.filter((s) => s.status === 'submitted').length;

    // Overall attendance calculation
    const avgAttendance = Math.round(
      this.state.students.reduce((acc, s) => acc + s.attendancePercentage, 0) / (totalStudents || 1)
    );

    // At-risk students (< 75% attendance or grade below passing)
    const atRiskStudents = this.state.students.filter(
      (s) => s.attendancePercentage < this.state.settings.minimumAttendancePercentage
    );

    return {
      totalStudents,
      totalTeachers,
      totalClasses,
      totalSessions,
      completedSessions,
      totalAssessments,
      totalSubmissions,
      publishedResults,
      pendingGrading,
      avgAttendance,
      atRiskCount: atRiskStudents.length,
      atRiskStudents,
      recentAudit: this.state.auditLogs.slice(0, 5),
    };
  }

  public getTeacherDashboard(teacherId: string) {
    const assignedClasses = this.getClasses('teacher', teacherId);
    const assignedClassIds = assignedClasses.map((c) => c.id);

    const teacherSessions = this.state.sessions.filter(
      (s) => assignedClassIds.includes(s.classId) || s.teacherId === teacherId || s.teacherId === 'teacher_default'
    );

    const pendingAttendanceSessions = teacherSessions.filter(
      (s) => s.status === 'completed' && !s.finalized
    );

    const teacherAssessments = this.state.assessments.filter((a) =>
      assignedClassIds.includes(a.classId)
    );
    const assessmentIds = teacherAssessments.map((a) => a.id);

    const pendingGrading = this.state.submissions.filter(
      (s) => assessmentIds.includes(s.assessmentId) && s.status === 'submitted'
    );

    const resultsToPublish = teacherAssessments.filter((a) => !a.published);

    const teacherStudents = this.state.students.filter((s) =>
      assignedClassIds.includes(s.classId)
    );

    const atRiskInMyClasses = teacherStudents.filter(
      (s) => s.attendancePercentage < this.state.settings.minimumAttendancePercentage
    );

    return {
      assignedClasses,
      totalStudentsCount: teacherStudents.length,
      todaySessions: teacherSessions.filter((s) => s.date === '2026-10-27'),
      pendingAttendanceCount: pendingAttendanceSessions.length,
      pendingAttendanceSessions,
      pendingGradingCount: pendingGrading.length,
      pendingSubmissions: pendingGrading,
      resultsToPublishCount: resultsToPublish.length,
      atRiskStudents: atRiskInMyClasses,
    };
  }
}

export const academicStore = new AcademicStore();
