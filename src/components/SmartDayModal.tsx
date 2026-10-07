import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Zap, Clock, Sparkles, CheckCircle2, ArrowRight, X } from 'lucide-react';
import { generateSmartDayPlan } from '../utils/scheduler';
import { SmartDayItem } from '../types';

export const SmartDayModal: React.FC = () => {
  const {
    isSmartDayOpen,
    setIsSmartDayOpen,
    tasks,
    subjects,
    exams,
    applySmartDayPlan,
  } = useApp();

  const [selectedMinutes, setSelectedMinutes] = useState(120); // default 2 hours
  const [customMinutes, setCustomMinutes] = useState('90');
  const [isCustom, setIsCustom] = useState(false);

  if (!isSmartDayOpen) return null;

  const currentDuration = isCustom ? parseInt(customMinutes) || 60 : selectedMinutes;
  const planItems: SmartDayItem[] = generateSmartDayPlan(currentDuration, tasks, subjects, exams);

  const totalCalculatedMinutes = planItems.reduce((acc, curr) => acc + curr.durationMinutes, 0);

  const presets = [
    { label: '30 min', minutes: 30, desc: 'Quick laser sprint' },
    { label: '1 hour', minutes: 60, desc: 'Standard revision block' },
    { label: '2 hours', minutes: 120, desc: 'Optimal balanced focus' },
    { label: '3 hours', minutes: 180, desc: 'Deep exam preparation' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 sm:p-7 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/20">
              <Zap className="w-4 h-4 fill-slate-950" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                ⚡ Smart Day Generator
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Instant high-yield schedule customized to your available time
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSmartDayOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Question */}
        <div className="mt-5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
            How much time do you have today?
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
            {presets.map((p) => {
              const active = !isCustom && selectedMinutes === p.minutes;
              return (
                <button
                  key={p.minutes}
                  onClick={() => {
                    setIsCustom(false);
                    setSelectedMinutes(p.minutes);
                  }}
                  className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                    active
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <span className="block text-xs sm:text-sm font-bold">{p.label}</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5 line-clamp-1">{p.desc}</span>
                </button>
              );
            })}
          </div>

          {/* Custom Time Option */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCustom(true)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition ${
                isCustom
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold'
                  : 'border-slate-200 dark:border-slate-800 text-slate-500'
              }`}
            >
              Custom
            </button>
            {isCustom && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="15"
                  max="480"
                  step="15"
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(e.target.value)}
                  className="w-24 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
                <span className="text-xs text-slate-500">minutes</span>
              </div>
            )}
          </div>
        </div>

        {/* AI Generated Breakdown Preview */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>AI Optimized Allocation</span>
            </span>
            <span className="font-semibold text-slate-500 dark:text-slate-400">
              {totalCalculatedMinutes} mins total
            </span>
          </div>

          <div className="space-y-2">
            {planItems.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs shadow-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-12 text-center py-1 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-[11px] shrink-0">
                    {item.durationMinutes} min
                  </span>
                  <div className="truncate">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">
                      {item.subjectName}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                      {item.topic}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0 ${
                    item.priority === 'Urgent'
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                      : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400'
                  }`}
                >
                  {item.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            onClick={() => setIsSmartDayOpen(false)}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => applySmartDayPlan(planItems)}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition cursor-pointer active:scale-95"
          >
            <span>Apply to Today's Plan →</span>
          </button>
        </div>
      </div>
    </div>
  );
};
