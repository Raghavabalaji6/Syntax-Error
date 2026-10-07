import { Exam, Subject, StudySession } from '../types';

export interface ExamRoadmapDay {
  dayNumber: number;
  dateStr: string;
  focusTitle: string;
  recommendedDurationMinutes: number;
  technique: string;
  topics: string[];
}

/**
 * Calculates Exam Readiness Score (0-100%)
 * Factors:
 * 1. Topics completed in syllabus (45% weight)
 * 2. Study hours logged vs recommended hours (35% weight)
 * 3. Proximity buffer & active tasks (20% weight)
 */
export function calculateExamReadiness(
  exam: Exam,
  subject?: Subject,
  sessions: StudySession[] = []
): {
  score: number;
  tier: 'At Risk' | 'Needs Attention' | 'Ready';
  tierColor: string;
  topicsCompleted: number;
  totalTopics: number;
} {
  const totalTopics = exam.syllabus.length || 1;
  const topicsCompleted = exam.syllabus.filter((t) => t.completed).length;
  const topicRatio = topicsCompleted / totalTopics;

  // Study hours ratio
  let hoursRatio = 0.5;
  if (subject && subject.totalStudyHours > 0) {
    hoursRatio = Math.min(1, subject.completedStudyHours / subject.totalStudyHours);
  }

  // Days remaining factor
  const now = new Date().getTime();
  const examTime = new Date(exam.examDate).getTime();
  const daysLeft = Math.max(0, Math.round((examTime - now) / (1000 * 60 * 60 * 24)));

  // If daysLeft < 2 and topics < 50%, penalty; if prep is solid, bonus
  let urgencyBonus = 0.1;
  if (daysLeft >= 3 && topicRatio >= 0.5) urgencyBonus = 0.2;

  const rawScore = (topicRatio * 0.5 + hoursRatio * 0.35 + urgencyBonus * 0.15) * 100;
  const score = Math.min(100, Math.max(0, Math.round(rawScore)));

  let tier: 'At Risk' | 'Needs Attention' | 'Ready' = 'Needs Attention';
  let tierColor = 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800';

  if (score >= 80) {
    tier = 'Ready';
    tierColor = 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800';
  } else if (score < 50) {
    tier = 'At Risk';
    tierColor = 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800';
  }

  return {
    score,
    tier,
    tierColor,
    topicsCompleted,
    totalTopics,
  };
}

/**
 * Automatically creates a 7-day preparation roadmap for an exam
 */
export function generateExamRoadmap(exam: Exam, subjectName: string): ExamRoadmapDay[] {
  const examDate = new Date(exam.examDate);
  const roadmap: ExamRoadmapDay[] = [];
  const topics = exam.syllabus.map((t) => t.name);

  const t0 = topics[0] || 'Core Concepts & Fundamentals';
  const t1 = topics[1] || 'Intermediate Applications';
  const t2 = topics[2] || 'Advanced Problem Solving';
  const t3 = topics[3] || 'Edge Cases & Multi-step Problems';

  const defaultSchedule = [
    {
      dayNumber: 1,
      offset: -7,
      focusTitle: `Diagnostic & Foundations: ${t0}`,
      recommendedDurationMinutes: 60,
      technique: 'Feynman Technique & Definition Audits',
      topics: [t0],
    },
    {
      dayNumber: 2,
      offset: -6,
      focusTitle: `Deep Dive: ${t1}`,
      recommendedDurationMinutes: 60,
      technique: 'Active Recall & Guided Examples',
      topics: [t1],
    },
    {
      dayNumber: 3,
      offset: -5,
      focusTitle: `Complex Application: ${t2}`,
      recommendedDurationMinutes: 75,
      technique: 'Unassisted Problem Drills',
      topics: [t2],
    },
    {
      dayNumber: 4,
      offset: -4,
      focusTitle: `Synthesis: ${t3}`,
      recommendedDurationMinutes: 60,
      technique: 'Mind-Mapping & Formula Derivation',
      topics: [t3],
    },
    {
      dayNumber: 5,
      offset: -3,
      focusTitle: 'Comprehensive Past Papers Drill',
      recommendedDurationMinutes: 90,
      technique: 'Timed Section Practice',
      topics: [t0, t1, t2],
    },
    {
      dayNumber: 6,
      offset: -2,
      focusTitle: 'Full-Length Timed Mock Exam',
      recommendedDurationMinutes: 90,
      technique: 'Simulated Exam Conditions',
      topics: ['All Topics & Error Logging'],
    },
    {
      dayNumber: 7,
      offset: -1,
      focusTitle: 'Final Error Review & Confidence Polish',
      recommendedDurationMinutes: 45,
      technique: 'High-Level Review & Sleep Prioritization',
      topics: ['Formula Cheatsheet & Weakest 2 Concepts'],
    },
  ];

  for (const item of defaultSchedule) {
    const d = new Date(examDate);
    d.setDate(d.getDate() + item.offset);
    roadmap.push({
      dayNumber: item.dayNumber,
      dateStr: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' }),
      focusTitle: item.focusTitle,
      recommendedDurationMinutes: item.recommendedDurationMinutes,
      technique: item.technique,
      topics: item.topics,
    });
  }

  return roadmap;
}
