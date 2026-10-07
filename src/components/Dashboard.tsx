import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Flame,
  Clock,
  CheckSquare,
  Target,
  Play,
  CheckCircle2,
  AlertCircle,
  Zap,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Sparkles,
  BookOpen,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';

interface DashboardProps {
  onNavigateTab: (tab: string) => void;
  onOpenNewTaskModal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigateTab, onOpenNewTaskModal }) => {
  const {
    user,
    subjects,
    tasks,
    exams,
    sessions,
    workloadHealth,
    completeSession,
    simulateMissedSession,
    startFocusSession,
    setIsSmartDayOpen,
    availability,
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];

  // Today's sessions
  const todaySessions = sessions
    .filter((s) => s.date === todayStr)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Next upcoming session
  const upNextSession =
    todaySessions.find((s) => s.status === 'Scheduled' && s.type !== 'Class') ||
    todaySessions.find((s) => s.status === 'Scheduled') ||
    todaySessions[0];

  const upNextSubject = subjects.find((s) => s.id === upNextSession?.subjectId);

  // Stats
  const completedTodaySessions = todaySessions.filter((s) => s.status === 'Completed').length;
  const completedTasksCount = tasks.filter((t) => t.status === 'Completed').length;
  const totalTasksCount = tasks.length;

  // Primary Exam (Mathematics in 4 days)
  const mathExam = exams.find((e) => e.subjectId === 'sub_math') || exams[0];
  const mathSubject = subjects.find((s) => s.id === mathExam?.subjectId);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Motivational & AI Guidance Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-900/90 via-slate-900 to-indigo-950 text-white border border-indigo-800/60 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-indigo-500/30 text-amber-300">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="text-xs uppercase font-bold tracking-wider text-indigo-300">
                AI Academic Copilot
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-100">
              You have {availability.weekdayAvailableHours} focused hours available today.
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Your <strong className="text-indigo-200">Mathematics exam</strong> is in 4 days and is your highest priority.
              We've allocated a 45-minute calculus sprint before dinner.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsSmartDayOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm active:scale-95"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>⚡ Smart Day</span>
            </button>
            <button
              onClick={() => startFocusSession(upNextSession)}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Start Focus</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Core Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Study Hours */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Study Hours</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                3.5h
              </span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                +45m vs yest.
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Target: {availability.weekdayAvailableHours}h daily
            </p>
          </div>
        </div>

        {/* Card 2: Tasks Completed */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Tasks</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {completedTasksCount} / {totalTasksCount}
              </span>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                {Math.round((completedTasksCount / Math.max(1, totalTasksCount)) * 100)}%
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              2 assignments pending
            </p>
          </div>
        </div>

        {/* Card 3: Study Streak */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Study Streak</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-500">
              <Flame className="w-4 h-4 fill-amber-500" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                🔥 {user.streakDays}
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">days</span>
            </div>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-1">
              Personal best record!
            </p>
          </div>
        </div>

        {/* Card 4: Exam Readiness */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Exam Readiness</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {mathExam ? `${mathExam.readinessScore}%` : '78%'}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                Ready 🟢
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Mathematics (MA101)
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Up Next + Today's Plan & Quick Exam Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Up Next & Today's Plan Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* "UP NEXT" Focal Card */}
          {upNextSession && (
            <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-indigo-500/30 dark:border-indigo-600/40 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
                    Up Next
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {upNextSession.startTime} – {upNextSession.endTime} ({upNextSession.duration}m)
                  </span>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60">
                  {upNextSession.priority} Priority
                </span>
              </div>

              <div className="mt-3 sm:mt-4">
                <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>🧠</span>
                  <span>{upNextSubject?.name || 'Academic Session'} — {upNextSession.title}</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {upNextSession.notes || 'Calculus problem set practice before upcoming midterm.'}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => startFocusSession(upNextSession)}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-indigo-600/20 transition cursor-pointer active:scale-95"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Focus Session →</span>
                </button>
                <button
                  onClick={() => completeSession(upNextSession.id)}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Mark Done</span>
                </button>
                <button
                  onClick={() => simulateMissedSession(upNextSession.id)}
                  className="px-3 py-2.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium text-xs flex items-center gap-1 transition cursor-pointer ml-auto"
                  title="Simulate missed session to test dynamic rescheduling"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Simulate Missed</span>
                </button>
              </div>
            </div>
          )}

          {/* Today's Vertical Timeline */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Today's Plan
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Adaptive vertical schedule protected from sleep encroachment
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('timetable')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Full Timetable</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Timeline Events */}
            <div className="relative pl-6 sm:pl-8 space-y-5 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {todaySessions.map((session) => {
                const isCompleted = session.status === 'Completed';
                const isMissed = session.status === 'Missed';
                const subject = subjects.find((s) => s.id === session.subjectId);

                // Badge colors
                let typeBadge = 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border-indigo-200';
                let iconChar = '📚';
                if (session.type === 'Class') {
                  typeBadge = 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border-blue-200';
                  iconChar = '🏫';
                } else if (session.type === 'Assignment') {
                  typeBadge = 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border-amber-200';
                  iconChar = '📝';
                }

                return (
                  <div key={session.id} className="relative group">
                    {/* Node Dot */}
                    <div
                      className={`absolute -left-6 sm:-left-8 top-1.5 w-4 h-4 rounded-full border-2 bg-white dark:bg-slate-900 flex items-center justify-center transition ${
                        isCompleted
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : isMissed
                          ? 'border-rose-500 bg-rose-500 text-white'
                          : 'border-indigo-600 dark:border-indigo-400'
                      }`}
                    >
                      {isCompleted && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>

                    <div
                      className={`p-3.5 sm:p-4 rounded-xl border transition ${
                        isCompleted
                          ? 'bg-slate-50/60 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-70'
                          : isMissed
                          ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800'
                          : 'bg-white dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 shadow-xs hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            {session.startTime}
                          </span>
                          <span className="text-xs text-slate-400">•</span>
                          <span
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${typeBadge}`}
                          >
                            {iconChar} {subject?.name || 'Class'}
                          </span>
                          <span className="text-xs text-slate-400">
                            {session.duration} minutes
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              session.priority === 'Urgent'
                                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                                : session.priority === 'High'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                            }`}
                          >
                            {session.priority}
                          </span>

                          {/* Completion Checkbox */}
                          <button
                            onClick={() => completeSession(session.id)}
                            disabled={isCompleted}
                            className={`p-1 rounded-md transition cursor-pointer ${
                              isCompleted
                                ? 'text-emerald-500'
                                : 'text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-700'
                            }`}
                            title={isCompleted ? 'Completed' : 'Mark completed'}
                          >
                            <CheckCircle2
                              className={`w-5 h-5 ${isCompleted ? 'fill-emerald-500 text-white' : ''}`}
                            />
                          </button>
                        </div>
                      </div>

                      <p
                        className={`text-xs font-medium mt-1 text-slate-800 dark:text-slate-200 ${
                          isCompleted ? 'line-through text-slate-500 dark:text-slate-500' : ''
                        }`}
                      >
                        {session.title}
                      </p>

                      {session.notes && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                          {session.notes}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Smart Day, Exam Prep & Sleep Awareness */}
        <div className="space-y-6">
          {/* ⚡ Smart Day Interactive Widget */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-900 dark:to-amber-950/20 border border-amber-200 dark:border-amber-800/60 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 rounded-lg bg-amber-500 text-slate-950">
                <Zap className="w-4 h-4 fill-slate-950" />
              </span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                ⚡ Smart Day
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              How much time do you have today? AI will balance your exam and assignments in seconds.
            </p>

            <div className="grid grid-cols-2 gap-2 mb-3">
              {['30 min', '1 hour', '2 hours', '3 hours'].map((dur) => (
                <button
                  key={dur}
                  onClick={() => setIsSmartDayOpen(true)}
                  className="py-1.5 px-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-slate-700 border border-amber-200/80 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition cursor-pointer text-center"
                >
                  {dur}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsSmartDayOpen(true)}
              className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm active:scale-95"
            >
              <span>Generate My Day →</span>
            </button>
          </div>

          {/* Exam Countdown & Readiness Card */}
          {mathExam && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-indigo-500" />
                  <span>Upcoming Midterm</span>
                </h4>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200">
                  In 4 Days
                </span>
              </div>

              <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 mb-3">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {mathSubject?.name || 'Mathematics'} ({mathSubject?.code})
                </p>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <span>Room: Auditorium East</span>
                  <span>Target: A</span>
                </div>
              </div>

              {/* Readiness Progress Bar */}
              <div className="space-y-1.5 mb-3">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-600 dark:text-slate-300">Readiness Score</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {mathExam.readinessScore}% (Ready 🟢)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full"
                    style={{ width: `${mathExam.readinessScore}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('exams')}
                className="w-full py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1 transition cursor-pointer"
              >
                <span>View 7-Day Exam Roadmap</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Sleep-Aware & Workload Health Status */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Sleep-Aware Protection
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              StudySync AI strictly protects your rest. Bedtime at{' '}
              <strong className="text-indigo-600 dark:text-indigo-400">{availability.sleepTime}</strong> and wake-up at{' '}
              <strong className="text-indigo-600 dark:text-indigo-400">{availability.wakeTime}</strong>.
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Workload Health:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {workloadHealth.health} 🟢
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">No-Study Safe Zone:</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  10:30 PM – 06:30 AM
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
