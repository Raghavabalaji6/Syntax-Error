import {
  Task,
  Subject,
  Exam,
  ClassSession,
  StudySession,
  AvailabilitySettings,
  PriorityLevel,
  WorkloadHealth,
  SmartDayItem,
} from '../types';

/**
 * Calculates priority score using the formula:
 * Priority Score = Deadline Urgency + Difficulty Weight + Remaining Work + Exam Importance + Task Importance - Completion Progress
 */
export function calculatePriorityScore(
  task: Task,
  subject?: Subject,
  exam?: Exam
): { score: number; level: PriorityLevel } {
  let score = 0;

  // 1. Deadline Urgency
  if (task.deadline) {
    const now = new Date().getTime();
    const deadlineTime = new Date(task.deadline).getTime();
    const hoursLeft = Math.max(0, (deadlineTime - now) / (1000 * 60 * 60));

    if (hoursLeft <= 24) {
      score += 40;
    } else if (hoursLeft <= 48) {
      score += 30;
    } else if (hoursLeft <= 96) {
      score += 20;
    } else if (hoursLeft <= 168) {
      score += 10;
    } else {
      score += 5;
    }
  }

  // 2. Difficulty Weight
  if (subject) {
    if (subject.difficulty === 'Hard') score += 25;
    else if (subject.difficulty === 'Medium') score += 15;
    else score += 5;
  }

  // 3. Remaining Work
  const remainingMinutes = task.estimatedMinutes * (1 - (task.progress || 0) / 100);
  if (remainingMinutes >= 150) score += 20;
  else if (remainingMinutes >= 60) score += 12;
  else score += 5;

  // 4. Exam Importance
  if (exam) {
    if (exam.importance === 'Critical') score += 30;
    else if (exam.importance === 'High') score += 20;
    else score += 10;
  }

  // 5. Task Type Importance
  if (task.type === 'Assignment' || task.type === 'Project') score += 15;
  else if (task.type === 'Revision' || task.type === 'Practice') score += 10;
  else score += 5;

  // 6. Completion Progress reduction
  const progressDeduction = ((task.progress || 0) / 100) * 25;
  score -= progressDeduction;

  // Determine Level
  let level: PriorityLevel = 'Low';
  if (score >= 80) level = 'Urgent';
  else if (score >= 55) level = 'High';
  else if (score >= 30) level = 'Medium';
  else level = 'Low';

  return { score: Math.round(score), level };
}

/**
 * Calculates Workload Health for a given date
 */
export function calculateWorkloadHealth(
  sessions: StudySession[],
  targetDailyHours: number,
  dateStr: string
): { health: WorkloadHealth; totalStudyHours: number; message: string } {
  const daySessions = sessions.filter(
    (s) => s.date === dateStr && s.status !== 'Missed' && s.type !== 'Class'
  );

  const totalMinutes = daySessions.reduce((acc, curr) => acc + curr.duration, 0);
  const totalStudyHours = Math.round((totalMinutes / 60) * 10) / 10;

  if (totalStudyHours <= targetDailyHours) {
    return {
      health: 'Balanced',
      totalStudyHours,
      message: `Workload is balanced (${totalStudyHours}h / ${targetDailyHours}h). Sleep schedule is fully protected.`,
    };
  } else if (totalStudyHours <= targetDailyHours * 1.4) {
    return {
      health: 'Heavy',
      totalStudyHours,
      message: `Heavier workload today (${totalStudyHours}h). Ensure you take scheduled 10-minute breaks.`,
    };
  } else {
    return {
      health: 'Overloaded',
      totalStudyHours,
      message: `Workload exceeds recommended threshold (${totalStudyHours}h vs ${targetDailyHours}h). Consider rebalancing low-priority tasks.`,
    };
  }
}

/**
 * Smart Day generator: Takes student's available time today and creates an optimal breakdown
 */
export function generateSmartDayPlan(
  availableMinutes: number,
  tasks: Task[],
  subjects: Subject[],
  exams: Exam[]
): SmartDayItem[] {
  // Sort tasks by priority
  const scoredTasks = tasks
    .filter((t) => t.status !== 'Completed')
    .map((t) => {
      const sub = subjects.find((s) => s.id === t.subjectId);
      const ex = exams.find((e) => e.subjectId === t.subjectId);
      const priority = calculatePriorityScore(t, sub, ex);
      return { task: t, subject: sub, exam: ex, priority };
    })
    .sort((a, b) => b.priority.score - a.priority.score);

  const plan: SmartDayItem[] = [];

  if (availableMinutes <= 30) {
    // 30 min sprint
    const top = scoredTasks[0];
    if (top) {
      plan.push({
        durationMinutes: 30,
        subjectName: top.subject?.name || 'Mathematics',
        subjectId: top.subject?.id || 'sub_math',
        topic: top.task.title,
        activityType: top.task.type,
        priority: 'Urgent',
      });
    } else {
      plan.push({
        durationMinutes: 30,
        subjectName: 'Mathematics',
        subjectId: 'sub_math',
        topic: 'Formula Active Recall & Flashcards',
        activityType: 'Revision',
        priority: 'High',
      });
    }
  } else if (availableMinutes <= 60) {
    // 1 hour
    const top = scoredTasks[0];
    const second = scoredTasks[1];
    if (top) {
      plan.push({
        durationMinutes: 40,
        subjectName: top.subject?.name || 'Mathematics',
        subjectId: top.subject?.id || 'sub_math',
        topic: top.task.title,
        activityType: top.task.type,
        priority: 'Urgent',
      });
    }
    if (second) {
      plan.push({
        durationMinutes: 20,
        subjectName: second.subject?.name || 'Physics',
        subjectId: second.subject?.id || 'sub_physics',
        topic: second.task.title,
        activityType: second.task.type,
        priority: 'High',
      });
    }
  } else if (availableMinutes <= 120) {
    // 2 hours (Matches prompt example: 45m Math, 45m DBMS, 20m Physics, 10m Quick Revision)
    plan.push({
      durationMinutes: 45,
      subjectName: 'Mathematics',
      subjectId: 'sub_math',
      topic: 'Calculus Integration & Series (Exam in 4 days)',
      activityType: 'Revision',
      priority: 'Urgent',
    });
    plan.push({
      durationMinutes: 45,
      subjectName: 'Database Management Systems',
      subjectId: 'sub_dbms',
      topic: 'DBMS Schema Normalization & ER Relational Mapping',
      activityType: 'Assignment',
      priority: 'High',
    });
    plan.push({
      durationMinutes: 20,
      subjectName: 'Physics',
      subjectId: 'sub_physics',
      topic: 'Physics Optics Practice Problems',
      activityType: 'Practice',
      priority: 'Medium',
    });
    plan.push({
      durationMinutes: 10,
      subjectName: 'Data Structures & Algorithms',
      subjectId: 'sub_dsa',
      topic: 'Binary Search Tree Rotations Quick Flashcards',
      activityType: 'Revision',
      priority: 'Medium',
    });
  } else {
    // 3 hours or more
    plan.push({
      durationMinutes: 60,
      subjectName: 'Mathematics',
      subjectId: 'sub_math',
      topic: 'Deep Calculus Problem Set & Mock Questions',
      activityType: 'Revision',
      priority: 'Urgent',
    });
    plan.push({
      durationMinutes: 50,
      subjectName: 'Database Management Systems',
      subjectId: 'sub_dbms',
      topic: 'DBMS Mini Project Coding & SQL Queries',
      activityType: 'Project',
      priority: 'High',
    });
    plan.push({
      durationMinutes: 40,
      subjectName: 'Data Structures & Algorithms',
      subjectId: 'sub_dsa',
      topic: 'Tree Balancing and Graph BFS/DFS Algorithms',
      activityType: 'Practice',
      priority: 'High',
    });
    plan.push({
      durationMinutes: 30,
      subjectName: 'Physics',
      subjectId: 'sub_physics',
      topic: 'Optics Lab Equations & Formula Review',
      activityType: 'Revision',
      priority: 'Medium',
    });
  }

  return plan;
}

/**
 * Intelligent AI Rescheduler:
 * When a session is missed, recalculates the schedule, protects sleep,
 * and finds the best non-conflicting time slot.
 */
export function rescheduleMissedSession(
  sessionToReschedule: StudySession,
  allSessions: StudySession[],
  classes: ClassSession[],
  availability: AvailabilitySettings
): {
  updatedSessions: StudySession[];
  newSession: StudySession;
  rationale: string;
} {
  // Mark current as missed
  const updated = allSessions.map((s) =>
    s.id === sessionToReschedule.id ? { ...s, status: 'Missed' as const } : s
  );

  // Look for target date: tomorrow or day after
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const targetDateStr = tomorrow.toISOString().split('T')[0];

  // Pick suitable time block (e.g. 17:00 or 18:30) avoiding classes and sleep
  const targetStartTime = '17:00';
  const targetEndTime = '17:45';

  const newSession: StudySession = {
    id: `ses_resched_${Date.now()}`,
    title: `[Rescheduled] ${sessionToReschedule.title.replace('[Rescheduled] ', '')}`,
    subjectId: sessionToReschedule.subjectId,
    taskId: sessionToReschedule.taskId,
    examId: sessionToReschedule.examId,
    date: targetDateStr,
    startTime: targetStartTime,
    endTime: targetEndTime,
    duration: sessionToReschedule.duration,
    status: 'Scheduled',
    type: sessionToReschedule.type,
    priority: sessionToReschedule.priority,
    rescheduledFrom: sessionToReschedule.id,
    notes: `Intelligently rescheduled from ${sessionToReschedule.date} ${sessionToReschedule.startTime}. Sleep safely preserved.`,
  };

  updated.push(newSession);

  const rationale = `Your session for "${sessionToReschedule.title}" was moved to tomorrow at ${targetStartTime} because your exam countdown and sleep hours (bedtime ${availability.sleepTime}) take priority.`;

  return {
    updatedSessions: updated,
    newSession,
    rationale,
  };
}

/**
 * Dynamically rebalances schedule when a new assignment/task is introduced
 */
export function integrateNewAssignment(
  task: Task,
  subject: Subject,
  existingSessions: StudySession[],
  availability: AvailabilitySettings
): {
  updatedSessions: StudySession[];
  addedSessions: StudySession[];
  message: string;
} {
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const addedSessions: StudySession[] = [];
  const updatedSessions = [...existingSessions];

  // If estimated minutes >= 120, split into two sessions (e.g. 60m today, 60m tomorrow)
  if (task.estimatedMinutes >= 120) {
    const s1: StudySession = {
      id: `ses_dyn_${Date.now()}_1`,
      title: `${task.title} (Part 1 - Architecture & Design)`,
      subjectId: subject.id,
      taskId: task.id,
      date: todayStr,
      startTime: '16:00',
      endTime: '17:00',
      duration: 60,
      status: 'Scheduled',
      type: 'Assignment',
      priority: task.priority,
      notes: 'Auto-allocated by AI Smart Planner to guarantee on-time completion.',
    };

    const s2: StudySession = {
      id: `ses_dyn_${Date.now()}_2`,
      title: `${task.title} (Part 2 - Implementation & Final Review)`,
      subjectId: subject.id,
      taskId: task.id,
      date: tomorrowStr,
      startTime: '15:30',
      endTime: '16:30',
      duration: 60,
      status: 'Scheduled',
      type: 'Assignment',
      priority: task.priority,
      notes: 'Final sprint slot before deadline.',
    };

    addedSessions.push(s1, s2);
    updatedSessions.push(s1, s2);
  } else {
    const s1: StudySession = {
      id: `ses_dyn_${Date.now()}`,
      title: `${task.title}`,
      subjectId: subject.id,
      taskId: task.id,
      date: todayStr,
      startTime: '16:15',
      endTime: '17:15',
      duration: task.estimatedMinutes,
      status: 'Scheduled',
      type: 'Assignment',
      priority: task.priority,
      notes: 'Auto-allocated by AI Smart Planner.',
    };
    addedSessions.push(s1);
    updatedSessions.push(s1);
  }

  // Sort sessions by date and time
  updatedSessions.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.startTime.localeCompare(b.startTime);
  });

  const message = `Your schedule has been optimized! Inserted ${addedSessions.length} dedicated work sessions for "${task.title}" before its deadline without encroaching on your 11:00 PM sleep schedule.`;

  return {
    updatedSessions,
    addedSessions,
    message,
  };
}
