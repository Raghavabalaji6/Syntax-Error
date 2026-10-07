import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  Flame,
  Award,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  RotateCcw,
} from 'lucide-react';

export const Analytics: React.FC = () => {
  const { user, subjects, tasks } = useApp();

  const [aiSummary, setAiSummary] = useState<string>(
    'Great week! You logged 14.5 focused study hours and completed 18 of 21 planned tasks (86% completion rate). Mathematics improved significantly with a 42% retention jump, but Physics needs more attention next week before midterm.'
  );
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Weekly study hours data (Mon-Sun)
  const weekData = [
    { day: 'Mon', hours: 2.5, target: 2.5 },
    { day: 'Tue', hours: 3.5, target: 2.5 },
    { day: 'Wed', hours: 2.0, target: 2.5 },
    { day: 'Thu', hours: 1.5, target: 2.5 },
    { day: 'Fri', hours: 2.0, target: 2.5 },
    { day: 'Sat', hours: 4.0, target: 4.5 },
    { day: 'Sun', hours: 3.0, target: 4.5 },
  ];

  const maxHour = 4.5;

  const handleRefreshAiReport = async () => {
    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/weekly-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stats: {
            hours: 14.5,
            completedTasks: 18,
            totalTasks: 21,
            completionRate: 86,
            streak: user.streakDays,
            topSubject: 'Mathematics',
            laggingSubject: 'Physics',
          },
        }),
      });
      const data = await res.json();
      if (data.summary) {
        setAiSummary(data.summary);
      }
    } catch (err) {
      console.warn('Fallback local summary');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Productivity & Academic Analytics</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Weekly deep work hours, subject balance ratios, and AI performance reports.
          </p>
        </div>

        <button
          onClick={handleRefreshAiReport}
          disabled={isGeneratingAi}
          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto shadow-sm"
        >
          {isGeneratingAi ? (
            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          <span>Regenerate AI Report</span>
        </button>
      </div>

      {/* 4 Summary Insight Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Best Study Window</span>
          <p className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-2">
            6:00 PM – 8:00 PM
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            +38% retention rate
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Most Studied Course</span>
          <p className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-2">
            Mathematics
          </p>
          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
            6.5 hours this week
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Most Productive Day</span>
          <p className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-2">
            Saturday
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            4.0 focused hours
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Current Streak</span>
          <p className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-2 flex items-center gap-1.5">
            <span>🔥 {user.streakDays}</span>
            <span className="text-sm font-semibold text-slate-500">days</span>
          </p>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-1">
            Top 5% student rhythm
          </p>
        </div>
      </div>

      {/* Main Charts: Weekly Hours Bar Chart + Subject Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Hours SVG Bar Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Weekly Study Hours
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                14.5 hours completed out of 18.0 target hours
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900">
              86% Target Hit
            </span>
          </div>

          {/* Bar Chart Display */}
          <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-100 dark:border-slate-800">
            {weekData.map((d) => {
              const heightPct = Math.round((d.hours / maxHour) * 100);
              const isToday = d.day === 'Tue';

              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition">
                    {d.hours}h
                  </span>

                  <div className="w-full max-w-[38px] bg-slate-100 dark:bg-slate-800 rounded-xl h-44 flex items-end p-1 relative overflow-hidden">
                    <div
                      className={`w-full rounded-lg transition-all duration-500 ${
                        isToday
                          ? 'bg-gradient-to-t from-indigo-600 to-indigo-500 shadow-sm shadow-indigo-500/30'
                          : 'bg-indigo-200 dark:bg-indigo-900/60 group-hover:bg-indigo-400'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>

                  <span
                    className={`text-xs font-semibold ${
                      isToday
                        ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subject Distribution Donut & Completion Ring (1 col) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
              Subject Distribution
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Workload share across current semester
            </p>

            {/* List with colors */}
            <div className="space-y-3">
              {subjects.map((sub) => {
                const totalAll = subjects.reduce((a, b) => a + b.completedStudyHours, 0) || 1;
                const pct = Math.round((sub.completedStudyHours / totalAll) * 100);

                return (
                  <div key={sub.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: sub.color }}
                        />
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {sub.name}
                        </span>
                      </div>
                      <span className="font-bold text-slate-600 dark:text-slate-400">
                        {sub.completedStudyHours}h ({pct}%)
                      </span>
                    </div>

                    <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: sub.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Completion Progress Ring */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                Completion Rate
              </span>
              <span className="text-[11px] text-slate-400">18 of 21 tasks finished</span>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-emerald-500 flex items-center justify-center font-extrabold text-xs text-slate-900 dark:text-white">
              86%
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Executive AI Report Box */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white p-6 sm:p-7 rounded-2xl border border-indigo-800/60 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-indigo-800/60 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/20 text-indigo-300 rounded-xl border border-indigo-400/20">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                Your Week: AI Performance Review
              </h3>
              <p className="text-xs text-indigo-200">
                14.5 hours • 18 / 21 tasks completed • 86% rate • 8-day streak
              </p>
            </div>
          </div>

          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Top 10% Consistency
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-4xl whitespace-pre-line font-medium">
          {aiSummary}
        </p>
      </div>
    </div>
  );
};
