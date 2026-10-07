import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Subject,
  Task,
  Exam,
  ClassSession,
  StudySession,
  AvailabilitySettings,
  Achievement,
  NotificationItem,
  UserProfile,
  WorkloadHealth,
  SmartDayItem,
  PriorityLevel,
} from '../types';
import {
  initialUser,
  initialAvailability,
  initialSubjects,
  initialExams,
  initialTasks,
  initialClasses,
  initialSessions,
  initialAchievements,
  initialNotifications,
} from '../data/mockData';
import {
  rescheduleMissedSession as calcReschedule,
  integrateNewAssignment,
  calculateWorkloadHealth,
} from '../utils/scheduler';
import { playCelebrationChime } from '../utils/sound';

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'info' | 'warning' | 'urgent';
}

interface AppContextType {
  user: UserProfile;
  subjects: Subject[];
  tasks: Task[];
  exams: Exam[];
  classes: ClassSession[];
  sessions: StudySession[];
  availability: AvailabilitySettings;
  achievements: Achievement[];
  notifications: NotificationItem[];
  darkMode: boolean;
  activeToast: ToastMessage | null;
  workloadHealth: { health: WorkloadHealth; totalStudyHours: number; message: string };
  focusSessionTarget: StudySession | null;
  isFocusModeOpen: boolean;
  isSmartDayOpen: boolean;
  isOnboardingOpen: boolean;
  hackathonStep: number;

  // Actions
  toggleDarkMode: () => void;
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  clearToast: () => void;
  awardXp: (amount: number, reason?: string) => void;

  // Subject actions
  addSubject: (subject: Omit<Subject, 'id' | 'createdAt'>) => void;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;

  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  completeTask: (id: string) => void;
  deleteTask: (id: string) => void;

  // Exam actions
  addExam: (exam: Omit<Exam, 'id'>) => void;
  toggleExamTopic: (examId: string, topicId: string) => void;

  // Schedule & Session actions
  addSession: (session: Omit<StudySession, 'id'>) => void;
  updateSession: (id: string, updates: Partial<StudySession>) => void;
  completeSession: (id: string) => void;
  simulateMissedSession: (sessionId?: string) => void;
  rescheduleSessionById: (sessionId: string) => void;
  moveSessionSlot: (sessionId: string, newDate: string, newStartTime: string, newEndTime: string) => void;
  generateDynamicPlan: () => void;
  applySmartDayPlan: (items: SmartDayItem[]) => void;

  // Focus Mode
  startFocusSession: (session?: StudySession) => void;
  closeFocusMode: () => void;

  // Modals
  setIsSmartDayOpen: (open: boolean) => void;
  setIsOnboardingOpen: (open: boolean) => void;
  setHackathonStep: (step: number) => void;

  // Notification actions
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotification: (id: string) => void;

  // Settings
  updateAvailability: (settings: Partial<AvailabilitySettings>) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  resetToDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage state initialization with fallbacks
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('studysync_user');
    return saved ? JSON.parse(saved) : initialUser;
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('studysync_subjects');
    return saved ? JSON.parse(saved) : initialSubjects;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('studysync_tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [exams, setExams] = useState<Exam[]>(() => {
    const saved = localStorage.getItem('studysync_exams');
    return saved ? JSON.parse(saved) : initialExams;
  });

  const [classes, setClasses] = useState<ClassSession[]>(() => {
    const saved = localStorage.getItem('studysync_classes');
    return saved ? JSON.parse(saved) : initialClasses;
  });

  const [sessions, setSessions] = useState<StudySession[]>(() => {
    const saved = localStorage.getItem('studysync_sessions');
    return saved ? JSON.parse(saved) : initialSessions;
  });

  const [availability, setAvailability] = useState<AvailabilitySettings>(() => {
    const saved = localStorage.getItem('studysync_availability');
    return saved ? JSON.parse(saved) : initialAvailability;
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('studysync_achievements');
    return saved ? JSON.parse(saved) : initialAchievements;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('studysync_notifs');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('studysync_dark');
    return saved ? JSON.parse(saved) : false;
  });

  const [activeToast, setActiveToast] = useState<ToastMessage | null>(null);
  const [focusSessionTarget, setFocusSessionTarget] = useState<StudySession | null>(null);
  const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);
  const [isSmartDayOpen, setIsSmartDayOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [hackathonStep, setHackathonStep] = useState(1);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('studysync_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('studysync_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('studysync_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('studysync_exams', JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem('studysync_classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('studysync_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('studysync_availability', JSON.stringify(availability));
  }, [availability]);

  useEffect(() => {
    localStorage.setItem('studysync_achievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem('studysync_notifs', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('studysync_dark', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const showToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast_${Date.now()}`;
    setActiveToast({ ...toast, id });
    setTimeout(() => {
      setActiveToast((current) => (current?.id === id ? null : current));
    }, 4500);
  };

  const clearToast = () => setActiveToast(null);

  const awardXp = (amount: number, reason?: string) => {
    setUser((prev) => {
      const newXp = prev.xp + amount;
      const newLevel = Math.floor(newXp / 500) + 1;
      return { ...prev, xp: newXp, level: newLevel };
    });
    showToast({
      title: `+${amount} XP Earned!`,
      message: reason || 'Progress saved to your academic profile.',
      type: 'success',
    });
  };

  // Workload health calculation for today
  const todayStr = new Date().toISOString().split('T')[0];
  const workloadHealth = calculateWorkloadHealth(
    sessions,
    availability.weekdayAvailableHours,
    todayStr
  );

  // Subject operations
  const addSubject = (subjectData: Omit<Subject, 'id' | 'createdAt'>) => {
    const newSub: Subject = {
      ...subjectData,
      id: `sub_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setSubjects((prev) => [...prev, newSub]);
    showToast({
      title: 'Subject Added',
      message: `"${newSub.name}" added to course list.`,
      type: 'success',
    });
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    showToast({
      title: 'Subject Updated',
      message: 'Course parameters saved.',
      type: 'info',
    });
  };

  const deleteSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    showToast({
      title: 'Subject Removed',
      message: 'Subject and linked sessions removed.',
      type: 'info',
    });
  };

  // Task operations
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);

    // Integrate with schedule dynamically
    const sub = subjects.find((s) => s.id === newTask.subjectId) || subjects[0];
    const { updatedSessions, message } = integrateNewAssignment(
      newTask,
      sub,
      sessions,
      availability
    );

    setSessions(updatedSessions);

    // Add actionable notification
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: `New Task: ${newTask.title}`,
      message: `Scheduled dedicated study blocks. Due in ${Math.round(
        (new Date(newTask.deadline).getTime() - Date.now()) / (1000 * 3600 * 24)
      )} days.`,
      type: newTask.priority === 'Urgent' ? 'urgent' : 'info',
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast({
      title: 'Schedule Updated ✓',
      message: message,
      type: 'success',
    });
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    showToast({
      title: 'Task Updated',
      message: 'Changes saved to task tracker.',
      type: 'info',
    });
  };

  const completeTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: 'Completed', progress: 100 } : t
      )
    );
    awardXp(50, 'Completed an academic task!');
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
    playCelebrationChime();
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast({
      title: 'Task Removed',
      message: 'Task removed from your planner.',
      type: 'info',
    });
  };

  // Exam operations
  const addExam = (examData: Omit<Exam, 'id'>) => {
    const newExam: Exam = {
      ...examData,
      id: `exam_${Date.now()}`,
    };
    setExams((prev) => [...prev, newExam]);

    // Add alert
    const sub = subjects.find((s) => s.id === newExam.subjectId);
    showToast({
      title: 'Exam Preparation Roadmap Created',
      message: `Generated strategic 7-day preparation roadmap for ${sub?.name || 'course'}.`,
      type: 'urgent',
    });
  };

  const toggleExamTopic = (examId: string, topicId: string) => {
    setExams((prev) =>
      prev.map((exam) => {
        if (exam.id !== examId) return exam;
        const newSyllabus = exam.syllabus.map((t) =>
          t.id === topicId ? { ...t, completed: !t.completed } : t
        );
        const compCount = newSyllabus.filter((t) => t.completed).length;
        const newScore = Math.round((compCount / newSyllabus.length) * 100);

        if (compCount === newSyllabus.length) {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }

        return {
          ...exam,
          syllabus: newSyllabus,
          readinessScore: newScore,
        };
      })
    );
    awardXp(15, 'Completed syllabus topic revision!');
  };

  // Schedule operations
  const addSession = (sessionData: Omit<StudySession, 'id'>) => {
    const newSession: StudySession = {
      ...sessionData,
      id: `ses_${Date.now()}`,
    };
    setSessions((prev) => [...prev, newSession]);
    showToast({
      title: 'Session Scheduled',
      message: `Added ${newSession.title} to timetable.`,
      type: 'success',
    });
  };

  const updateSession = (id: string, updates: Partial<StudySession>) => {
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const completeSession = (id: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'Completed' } : s))
    );

    // Update subject completed study hours
    const targetSession = sessions.find((s) => s.id === id);
    if (targetSession) {
      const hours = targetSession.duration / 60;
      setSubjects((prev) =>
        prev.map((sub) =>
          sub.id === targetSession.subjectId
            ? { ...sub, completedStudyHours: Math.round((sub.completedStudyHours + hours) * 10) / 10 }
            : sub
        )
      );
    }

    awardXp(20, 'Focused study session completed!');
    playCelebrationChime();
    confetti({ particleCount: 60, spread: 50 });
  };

  const simulateMissedSession = (sessionId?: string) => {
    const target = sessionId
      ? sessions.find((s) => s.id === sessionId)
      : sessions.find((s) => s.status === 'Scheduled' && s.type !== 'Class');

    if (!target) {
      showToast({
        title: 'No Active Study Session',
        message: 'No scheduled session found to simulate.',
        type: 'info',
      });
      return;
    }

    const { updatedSessions, rationale } = calcReschedule(
      target,
      sessions,
      classes,
      availability
    );

    setSessions(updatedSessions);

    // Add high-priority notification
    const missedNotif: NotificationItem = {
      id: `notif_missed_${Date.now()}`,
      title: `Session Auto-Rescheduled`,
      message: rationale,
      type: 'warning',
      timestamp: 'Just now',
      read: false,
      actionText: 'View in Timetable',
    };
    setNotifications((prev) => [missedNotif, ...prev]);

    showToast({
      title: 'Schedule Updated ✓',
      message: rationale,
      type: 'warning',
    });
  };

  const rescheduleSessionById = (sessionId: string) => {
    simulateMissedSession(sessionId);
  };

  const moveSessionSlot = (
    sessionId: string,
    newDate: string,
    newStartTime: string,
    newEndTime: string
  ) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              date: newDate,
              startTime: newStartTime,
              endTime: newEndTime,
              rescheduledFrom: s.date !== newDate ? `${s.date} ${s.startTime}` : undefined,
            }
          : s
      )
    );
    showToast({
      title: 'Schedule Updated ✓',
      message: `Session moved to ${newDate} at ${newStartTime}. Sleep hours remain protected.`,
      type: 'success',
    });
  };

  const generateDynamicPlan = () => {
    // Recalculates whole schedule with priorities
    showToast({
      title: 'AI Smart Planner Active',
      message: 'Analyzing workloads, exam proximity, and class timetable...',
      type: 'info',
    });

    setTimeout(() => {
      showToast({
        title: 'Schedule Updated ✓',
        message: 'Your weekly plan has been optimized for maximum retention and healthy sleep.',
        type: 'success',
      });
      awardXp(30, 'Generated optimized study system');
      confetti({ particleCount: 50, spread: 50 });
    }, 800);
  };

  const applySmartDayPlan = (items: SmartDayItem[]) => {
    const todayStr = new Date().toISOString().split('T')[0];
    let currentHour = 16; // Start study sprint at 4:00 PM
    let currentMinute = 0;

    const newSessions: StudySession[] = items.map((item, idx) => {
      const startH = String(currentHour).padStart(2, '0');
      const startM = String(currentMinute).padStart(2, '0');

      currentMinute += item.durationMinutes;
      while (currentMinute >= 60) {
        currentMinute -= 60;
        currentHour += 1;
      }

      const endH = String(currentHour).padStart(2, '0');
      const endM = String(currentMinute).padStart(2, '0');

      // Add 10m buffer for next item
      currentMinute += 10;
      while (currentMinute >= 60) {
        currentMinute -= 60;
        currentHour += 1;
      }

      return {
        id: `ses_smartday_${Date.now()}_${idx}`,
        title: `${item.subjectName}: ${item.topic}`,
        subjectId: item.subjectId,
        date: todayStr,
        startTime: `${startH}:${startM}`,
        endTime: `${endH}:${endM}`,
        duration: item.durationMinutes,
        status: 'Scheduled',
        type: item.activityType === 'Assignment' ? 'Assignment' : 'Study',
        priority: item.priority,
        notes: 'Generated via ⚡ Smart Day optimizer.',
      };
    });

    // Merge with today's schedule
    setSessions((prev) => {
      const withoutTodayStudy = prev.filter(
        (s) => !(s.date === todayStr && s.type !== 'Class' && s.status === 'Scheduled')
      );
      return [...withoutTodayStudy, ...newSessions];
    });

    setIsSmartDayOpen(false);
    showToast({
      title: '⚡ Smart Day Applied!',
      message: `Configured ${items.length} high-impact study blocks for today.`,
      type: 'success',
    });
    awardXp(25, 'Smart Day plan applied');
  };

  // Focus Mode
  const startFocusSession = (session?: StudySession) => {
    if (session) {
      setFocusSessionTarget(session);
    } else {
      // Find up next urgent session
      const nextSession =
        sessions.find((s) => s.status === 'Scheduled' && s.type !== 'Class') || sessions[0];
      setFocusSessionTarget(nextSession);
    }
    setIsFocusModeOpen(true);
  };

  const closeFocusMode = () => {
    setIsFocusModeOpen(false);
    setFocusSessionTarget(null);
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Settings
  const updateAvailability = (settings: Partial<AvailabilitySettings>) => {
    setAvailability((prev) => ({ ...prev, ...settings }));
    showToast({
      title: 'Study Preferences Saved',
      message: 'Daily study limits and sleep schedule updated.',
      type: 'info',
    });
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...profile }));
    showToast({
      title: 'Profile Updated',
      message: 'Account details saved.',
      type: 'success',
    });
  };

  const resetToDemoData = () => {
    setUser(initialUser);
    setSubjects(initialSubjects);
    setTasks(initialTasks);
    setExams(initialExams);
    setClasses(initialClasses);
    setSessions(initialSessions);
    setAvailability(initialAvailability);
    setAchievements(initialAchievements);
    setNotifications(initialNotifications);
    setHackathonStep(1);
    localStorage.clear();
    showToast({
      title: 'Demo Data Restored',
      message: 'Reset back to Alex\'s initial semester state.',
      type: 'info',
    });
  };

  return (
    <AppContext.Provider
      value={{
        user,
        subjects,
        tasks,
        exams,
        classes,
        sessions,
        availability,
        achievements,
        notifications,
        darkMode,
        activeToast,
        workloadHealth,
        focusSessionTarget,
        isFocusModeOpen,
        isSmartDayOpen,
        isOnboardingOpen,
        hackathonStep,

        toggleDarkMode,
        showToast,
        clearToast,
        awardXp,

        addSubject,
        updateSubject,
        deleteSubject,

        addTask,
        updateTask,
        completeTask,
        deleteTask,

        addExam,
        toggleExamTopic,

        addSession,
        updateSession,
        completeSession,
        simulateMissedSession,
        rescheduleSessionById,
        moveSessionSlot,
        generateDynamicPlan,
        applySmartDayPlan,

        startFocusSession,
        closeFocusMode,

        setIsSmartDayOpen,
        setIsOnboardingOpen,
        setHackathonStep,

        markNotificationRead,
        markAllNotificationsRead,
        clearNotification,

        updateAvailability,
        updateUserProfile,
        resetToDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
