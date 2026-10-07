export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Urgent';

export type TaskType = 'Assignment' | 'Revision' | 'Project' | 'Practice' | 'Reading' | 'Other';

export type TaskStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Overdue';

export type SubjectDifficulty = 'Easy' | 'Medium' | 'Hard';

export type SessionType = 'Class' | 'Study' | 'Assignment' | 'Exam' | 'Break';

export type SessionStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Missed' | 'Rescheduled';

export interface SyllabusTopic {
  id: string;
  name: string;
  completed: boolean;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  teacher: string;
  difficulty: SubjectDifficulty;
  color: string; // e.g. '#6366F1'
  bgLight: string;
  borderLight: string;
  textLight: string;
  totalStudyHours: number;
  completedStudyHours: number;
  priority: 'Low' | 'Medium' | 'High';
  room?: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  subjectId: string;
  type: TaskType;
  deadline: string; // YYYY-MM-DDTHH:mm
  estimatedMinutes: number;
  priority: PriorityLevel;
  status: TaskStatus;
  progress: number; // 0 - 100
  notes?: string;
  createdAt: string;
}

export interface Exam {
  id: string;
  subjectId: string;
  examDate: string; // YYYY-MM-DD
  examTime?: string; // e.g. "09:00 AM"
  importance: 'Critical' | 'High' | 'Medium';
  syllabus: SyllabusTopic[];
  readinessScore: number; // 0 - 100
  targetGrade?: string;
  room?: string;
}

export interface ClassSession {
  id: string;
  subjectId: string;
  day: number; // 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat, 0 = Sun
  startTime: string; // HH:mm (e.g. "09:00")
  endTime: string; // HH:mm (e.g. "10:00")
  room: string;
  teacher?: string;
}

export interface StudySession {
  id: string;
  title: string;
  subjectId: string;
  taskId?: string;
  examId?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  duration: number; // minutes
  status: SessionStatus;
  type: SessionType;
  priority: PriorityLevel;
  notes?: string;
  rescheduledFrom?: string;
}

export interface AvailabilitySettings {
  weekdayAvailableHours: number; // default 2.5
  weekendAvailableHours: number; // default 4.0
  preferredStudyTime: 'Morning' | 'Afternoon' | 'Evening';
  sleepTime: string; // "23:00"
  wakeTime: string; // "06:30"
  preferredSessionMinutes: number; // 50
  breakMinutes: number; // 10
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt?: string;
  xpReward: number;
  unlocked: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'urgent' | 'info' | 'success' | 'warning';
  timestamp: string;
  read: boolean;
  actionText?: string;
  actionPayload?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  timezone: string;
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
}

export type WorkloadHealth = 'Balanced' | 'Heavy' | 'Overloaded';

export interface SmartDayItem {
  durationMinutes: number;
  subjectName: string;
  subjectId: string;
  topic: string;
  activityType: TaskType;
  priority: PriorityLevel;
}
