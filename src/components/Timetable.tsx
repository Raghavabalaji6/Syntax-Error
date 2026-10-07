import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Move,
  MapPin,
  Sparkles,
  Info,
  X,
} from 'lucide-react';
import { StudySession } from '../types';

export const Timetable: React.FC = () => {
  const {
    sessions,
    subjects,
    classes,
    completeSession,
    simulateMissedSession,
    moveSessionSlot,
    startFocusSession,
  } = useApp();

  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [selectedSession, setSelectedSession] = useState<StudySession | null>(null);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [targetMoveDate, setTargetMoveDate] = useState('');
  const [targetMoveTime, setTargetMoveTime] = useState('17:00');

  // Days of current week (Monday to Sunday)
  const today = new Date();
  const currentDayIndex = today.getDay(); // 0 is Sun, 1 is Mon...
  const mondayOffset = currentDayIndex === 0 ? -6 : 1 - currentDayIndex;

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + mondayOffset + i);
    const dateStr = d.toISOString().split('T')[0];
    const isToday = dateStr === today.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.getDate();
    return { dateStr, isToday, dayName, dayNum, fullDate: d };
  });

  const [activeDayStr, setActiveDayStr] = useState(today.toISOString().split('T')[0]);

  // Color mapping
  const getSessionStyle = (session: StudySession) => {
    if (session.status === 'Completed') {
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
        badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
        label: 'Completed',
      };
    }
    if (session.status === 'Missed') {
      return {
        bg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800 opacity-60',
        badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
        label: 'Missed',
      };
    }

    switch (session.type) {
      case 'Class':
        return {
          bg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
          badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
          label: 'Class',
        };
      case 'Assignment':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
          badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
          label: 'Assignment',
        };
      case 'Exam':
        return {
          bg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
          badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
          label: 'Exam',
        };
      default:
        // Study
        return {
          bg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
          badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
          label: 'Study',
        };
    }
  };

  const handleOpenMove = (session: StudySession) => {
    setSelectedSession(session);
    setTargetMoveDate(session.date);
    setTargetMoveTime(session.startTime);
    setIsMoveModalOpen(true);
  };

  const handleConfirmMove = () => {
    if (!selectedSession || !targetMoveDate) return;
    const dur = selectedSession.duration;
    const [h, m] = targetMoveTime.split(':').map(Number);
    let endMin = m + dur;
    let endH = h;
    while (endMin >= 60) {
      endMin -= 60;
      endH += 1;
    }
    const endStr = `${String(endH).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;

    moveSessionSlot(selectedSession.id, targetMoveDate, targetMoveTime, endStr);
    setIsMoveModalOpen(false);
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-12">
      {/* Top Header & View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Dynamic Weekly Timetable</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Auto-synced with classes, assignments, and sleep constraints. Drag or re-slot anytime.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Trigger: Simulate Missed Session for Hackathon */}
          <button
            onClick={() => simulateMissedSession()}
            className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 font-semibold text-xs flex items-center gap-1.5 hover:bg-rose-100 dark:hover:bg-rose-900 cursor-pointer transition shadow-xs"
            title="Simulate missed study session to see AI dynamically recalculate"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Simulate Missed Session</span>
          </button>

          {/* View Mode Toggle */}
          <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-lg cursor-pointer transition ${
                viewMode === 'week'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Week View
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 rounded-lg cursor-pointer transition ${
                viewMode === 'day'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Day View
            </button>
          </div>
        </div>
      </div>

      {/* Color Meaning Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <span className="font-semibold text-slate-700 dark:text-slate-300">Color System:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-500" />
          <span>Blue = Classes</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-indigo-500" />
          <span>Purple = Study</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500" />
          <span>Orange = Assignment</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-rose-500" />
          <span>Red = Urgent / Exam</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500" />
          <span>Green = Completed</span>
        </div>
      </div>

      {/* Week Day Switcher Tabs for mobile / day view */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {weekDays.map((d) => (
          <button
            key={d.dateStr}
            onClick={() => setActiveDayStr(d.dateStr)}
            className={`p-2 sm:p-2.5 rounded-xl border text-center transition cursor-pointer ${
              activeDayStr === d.dateStr
                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <span className="block text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 uppercase">
              {d.dayName}
            </span>
            <span
              className={`inline-block mt-0.5 text-xs sm:text-sm font-bold ${
                d.isToday ? 'w-6 h-6 rounded-full bg-indigo-600 text-white leading-6 mx-auto' : ''
              }`}
            >
              {d.dayNum}
            </span>
          </button>
        ))}
      </div>

      {/* Week Grid View */}
      {viewMode === 'week' ? (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {weekDays.map((day) => {
            const daySessions = sessions
              .filter((s) => s.date === day.dateStr)
              .sort((a, b) => a.startTime.localeCompare(b.startTime));

            return (
              <div
                key={day.dateStr}
                className={`bg-white dark:bg-slate-900 rounded-2xl border p-3 flex flex-col min-h-[420px] ${
                  day.isToday
                    ? 'border-indigo-400 dark:border-indigo-600 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Column Day Header */}
                <div className="pb-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {day.dayName}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1.5">{day.dateStr.slice(5)}</span>
                  </div>
                  {day.isToday && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                      TODAY
                    </span>
                  )}
                </div>

                {/* Sessions list */}
                <div className="space-y-2 mt-3 flex-1 overflow-y-auto">
                  {daySessions.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-3 text-slate-400">
                      <p className="text-[11px]">Free Day 🎉</p>
                      <p className="text-[10px] text-slate-400 mt-1">No scheduled sessions</p>
                    </div>
                  ) : (
                    daySessions.map((s) => {
                      const style = getSessionStyle(s);
                      const sub = subjects.find((sub) => sub.id === s.subjectId);

                      return (
                        <div
                          key={s.id}
                          onClick={() => setSelectedSession(s)}
                          className={`p-2 rounded-xl border text-left cursor-pointer transition hover:shadow-xs group relative ${style.bg}`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] font-bold flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {s.startTime}
                            </span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${style.badge}`}>
                              {style.label}
                            </span>
                          </div>

                          <h5 className="font-semibold text-xs mt-1 leading-snug line-clamp-2">
                            {s.title}
                          </h5>

                          <div className="flex items-center justify-between mt-2 pt-1 border-t border-black/5 dark:border-white/5 text-[10px] opacity-80">
                            <span>{sub?.code || 'Course'}</span>
                            <span>{s.duration}m</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Day View */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Schedule for {activeDayStr}
            </h3>
            <span className="text-xs text-slate-500">
              {sessions.filter((s) => s.date === activeDayStr).length} Sessions
            </span>
          </div>

          <div className="space-y-3">
            {sessions
              .filter((s) => s.date === activeDayStr)
              .sort((a, b) => a.startTime.localeCompare(b.startTime))
              .map((s) => {
                const style = getSessionStyle(s);
                const sub = subjects.find((sub) => sub.id === s.subjectId);

                return (
                  <div
                    key={s.id}
                    className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${style.bg}`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold">{s.startTime} – {s.endTime}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${style.badge}`}>
                          {style.label}
                        </span>
                        <span className="text-xs opacity-75">• {sub?.name} ({sub?.code})</span>
                      </div>
                      <h4 className="font-bold text-sm mt-1">{s.title}</h4>
                      {s.notes && <p className="text-xs opacity-80 mt-0.5">{s.notes}</p>}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {s.status === 'Scheduled' && s.type !== 'Class' && (
                        <button
                          onClick={() => startFocusSession(s)}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          Focus
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenMove(s)}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold cursor-pointer"
                      >
                        Reschedule
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Session Details Modal */}
      {selectedSession && !isMoveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Session Inspector
              </span>
              <button
                onClick={() => setSelectedSession(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {selectedSession.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {subjects.find((s) => s.id === selectedSession.subjectId)?.name}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-400 block">Date & Time</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedSession.date} • {selectedSession.startTime}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-400 block">Duration</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedSession.duration} minutes
                  </span>
                </div>
              </div>

              {selectedSession.notes && (
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs">
                  <span className="text-slate-400 block mb-0.5">Details</span>
                  <p className="text-slate-700 dark:text-slate-300">{selectedSession.notes}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between gap-2">
              <button
                onClick={() => handleOpenMove(selectedSession)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Move className="w-3.5 h-3.5" />
                <span>Move Session</span>
              </button>

              <div className="flex items-center gap-2">
                {selectedSession.status === 'Scheduled' && (
                  <button
                    onClick={() => {
                      completeSession(selectedSession.id);
                      setSelectedSession(null);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Complete</span>
                  </button>
                )}
                {selectedSession.type !== 'Class' && selectedSession.status === 'Scheduled' && (
                  <button
                    onClick={() => {
                      startFocusSession(selectedSession);
                      setSelectedSession(null);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer"
                  >
                    Start Focus
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Move / Reschedule Accessible Modal */}
      {isMoveModalOpen && selectedSession && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-sm w-full p-6 shadow-2xl">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Reschedule Session
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Select new slot. AI verifies class overlaps and protects sleep boundaries.
            </p>

            <div className="space-y-3 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  New Date
                </label>
                <input
                  type="date"
                  value={targetMoveDate}
                  onChange={(e) => setTargetMoveDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={targetMoveTime}
                  onChange={(e) => setTargetMoveTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setIsMoveModalOpen(false)}
                className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmMove}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Confirm Move
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
