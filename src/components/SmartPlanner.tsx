import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Zap,
  Calendar,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Sliders,
  BookOpen,
} from 'lucide-react';
import { PriorityLevel, SubjectDifficulty, TaskType } from '../types';

export const SmartPlanner: React.FC<{ onNavigateTimetable: () => void }> = ({
  onNavigateTimetable,
}) => {
  const {
    subjects,
    addTask,
    generateDynamicPlan,
    availability,
    workloadHealth,
    updateAvailability,
  } = useApp();

  // Inputs for building new study plan / assignment
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || 'sub_math');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<TaskType>('Assignment');
  const [deadline, setDeadline] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return `${tomorrow.toISOString().split('T')[0]}T17:00`;
  });
  const [estimatedHours, setEstimatedHours] = useState('3.0');
  const [difficulty, setDifficulty] = useState<SubjectDifficulty>('Hard');
  const [priority, setPriority] = useState<PriorityLevel>('Urgent');
  const [examImportance, setExamImportance] = useState('Critical');
  const [preferredTime, setPreferredTime] = useState<'Morning' | 'Afternoon' | 'Evening'>(
    availability.preferredStudyTime
  );
  const [isGenerating, setIsGenerating] = useState(false);

  // Quick preset for hackathon demo
  const handleLoadDemoPreset = () => {
    const dbms = subjects.find((s) => s.id === 'sub_dbms') || subjects[0];
    setSelectedSubjectId(dbms.id);
    setTitle('DBMS Mini Project');
    setType('Project');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDeadline(`${tomorrow.toISOString().split('T')[0]}T17:00`);
    setEstimatedHours('3.0');
    setDifficulty('Medium');
    setPriority('Urgent');
    setExamImportance('High');
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    const taskTitle = title.trim() || 'Urgent Academic Assignment';
    const sub = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];
    const estMinutes = Math.round(parseFloat(estimatedHours || '2.0') * 60);

    setTimeout(() => {
      addTask({
        title: taskTitle,
        subjectId: sub.id,
        type,
        deadline,
        estimatedMinutes: estMinutes,
        priority,
        status: 'In Progress',
        progress: 0,
        notes: `Scheduled via AI Smart Planner. Est. ${estimatedHours}h with protected sleep rest.`,
      });
      generateDynamicPlan();
      setIsGenerating(false);
      onNavigateTimetable();
    }, 600);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Title & Vision */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Build My Study Plan
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Input coursework or exam deadlines. StudySync AI balances study sessions, classes, and protects your sleep.
          </p>
        </div>

        {/* Hackathon Preset button */}
        <button
          onClick={handleLoadDemoPreset}
          className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-300 font-semibold text-xs flex items-center gap-1.5 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition cursor-pointer"
        >
          <Zap className="w-4 h-4 fill-indigo-500" />
          <span>Load "DBMS Mini Project" Preset</span>
        </button>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Column (2 Cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-xs">
          <form onSubmit={handleGenerate} className="space-y-4 sm:space-y-5">
            {/* Subject Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Subject
              </label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} ({sub.code}) — {sub.difficulty}
                  </option>
                ))}
              </select>
            </div>

            {/* Task Title & Type */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Assignment / Topic Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. DBMS Mini Project"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as TaskType)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="Assignment">Assignment</option>
                  <option value="Project">Project</option>
                  <option value="Revision">Revision</option>
                  <option value="Practice">Practice</option>
                  <option value="Reading">Reading</option>
                </select>
              </div>
            </div>

            {/* Deadline & Estimated Hours */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Deadline Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Estimated Study Hours
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="15"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    hours
                  </span>
                </div>
              </div>
            </div>

            {/* Priority & Exam Importance */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as SubjectDifficulty)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="Hard">Hard (Weight: +25)</option>
                  <option value="Medium">Medium (Weight: +15)</option>
                  <option value="Easy">Easy (Weight: +5)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="Urgent">Urgent</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Exam Importance
                </label>
                <select
                  value={examImportance}
                  onChange={(e) => setExamImportance(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="Critical">Critical (Weight: +30)</option>
                  <option value="High">High (Weight: +20)</option>
                  <option value="Medium">Medium (Weight: +10)</option>
                </select>
              </div>
            </div>

            {/* Preferred Study Time */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Preferred Study Window
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Morning', 'Afternoon', 'Evening'] as const).map((win) => (
                  <button
                    key={win}
                    type="button"
                    onClick={() => {
                      setPreferredTime(win);
                      updateAvailability({ preferredStudyTime: win });
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium cursor-pointer transition ${
                      preferredTime === win
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {win}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 transition cursor-pointer active:scale-[0.99]"
              >
                {isGenerating ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>AI Engine Optimizing Schedule...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate My Plan</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Intelligence Diagnostics Column */}
        <div className="space-y-6">
          {/* Workload Health Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Workload Health: {workloadHealth.health} 🟢
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
              {workloadHealth.message}
            </p>

            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Weekday Study Target:</span>
                <span className="font-semibold">{availability.weekdayAvailableHours}h / day</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Weekend Study Target:</span>
                <span className="font-semibold">{availability.weekendAvailableHours}h / day</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Bedtime Protected:</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">{availability.sleepTime}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Wake-up Protected:</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">{availability.wakeTime}</span>
              </div>
            </div>
          </div>

          {/* AI Priority Engine Formula Explanation */}
          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
              AI Priority Formula
            </h4>
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 font-mono text-[11px] text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-800 leading-relaxed">
              Priority = Deadline Urgency + Difficulty Weight + Remaining Work + Exam Importance - Completion Progress
            </div>

            <ul className="mt-3 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Splits tasks into 45-50m chunks + 10m breaks</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Never schedules during classes or sleep</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Leaves buffer times before exams</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
