import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, CheckCircle2, ChevronRight, X, Play, RotateCcw } from 'lucide-react';

interface HackathonDemoBarProps {
  onNavigateTab: (tab: string) => void;
}

export const HackathonDemoBar: React.FC<HackathonDemoBarProps> = ({ onNavigateTab }) => {
  const {
    hackathonStep,
    setHackathonStep,
    addTask,
    simulateMissedSession,
    resetToDemoData,
    subjects,
  } = useApp();

  const [isExpanded, setIsExpanded] = useState(true);

  const steps = [
    {
      num: 1,
      title: 'Dashboard: Mathematics Exam',
      desc: 'View Mathematics exam in 4 days & current 78% readiness',
      action: () => onNavigateTab('dashboard'),
    },
    {
      num: 2,
      title: 'Add Assignment in Smart Planner',
      desc: 'Add "DBMS Mini Project" (Deadline: Tomorrow, 3 hours)',
      action: () => {
        onNavigateTab('planner');
      },
    },
    {
      num: 3,
      title: 'Click "Generate Plan"',
      desc: 'AI recalculates workload and inserts dedicated slots',
      action: () => {
        const dbmsSub = subjects.find((s) => s.id === 'sub_dbms') || subjects[0];
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        addTask({
          title: 'DBMS Mini Project',
          subjectId: dbmsSub.id,
          type: 'Project',
          deadline: `${tomorrow.toISOString().split('T')[0]}T17:00`,
          estimatedMinutes: 180, // 3 hours
          priority: 'Urgent',
          status: 'In Progress',
          progress: 10,
          notes: 'Full stack relational database schema and queries.',
        });
        setHackathonStep(4);
      },
    },
    {
      num: 4,
      title: 'Schedule Optimized Notification',
      desc: 'Review the optimization alert & workload rebalance',
      action: () => {
        onNavigateTab('timetable');
        setHackathonStep(5);
      },
    },
    {
      num: 5,
      title: 'Inspect Weekly Timetable',
      desc: 'See DBMS Mini Project automatically placed in free slots',
      action: () => onNavigateTab('timetable'),
    },
    {
      num: 6,
      title: 'Simulate Missed Session',
      desc: 'Trigger realistic missed session to test AI adaptability',
      action: () => {
        simulateMissedSession();
        setHackathonStep(7);
      },
    },
    {
      num: 7,
      title: 'Review AI Dynamic Rescheduling',
      desc: 'AI shifts slot to preserve bedtime & exam preparation',
      action: () => onNavigateTab('timetable'),
    },
    {
      num: 8,
      title: 'Open Productivity Analytics',
      desc: 'Review updated weekly hours, donut distribution & AI report',
      action: () => onNavigateTab('analytics'),
    },
    {
      num: 9,
      title: 'Ask AI StudyBuddy',
      desc: 'Ask "What should I study now?" with personalized schedule awareness',
      action: () => onNavigateTab('studybuddy'),
    },
  ];

  const current = steps[hackathonStep - 1] || steps[0];

  const handleNext = () => {
    current.action();
    if (hackathonStep < steps.length) {
      setHackathonStep(hackathonStep + 1);
    }
  };

  if (!isExpanded) {
    return (
      <div className="bg-indigo-900 text-white px-4 py-2 flex items-center justify-between text-xs border-b border-indigo-700 select-none">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="font-semibold">Hackathon Demo Mode</span>
          <span className="text-indigo-200">
            Step {hackathonStep}/9: {current.title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(true)}
            className="px-2 py-1 bg-indigo-700 hover:bg-indigo-600 rounded text-xs font-medium cursor-pointer"
          >
            Show Guide
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-4 py-3 border-b border-indigo-800/60 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start md:items-center gap-3">
          <div className="p-2 bg-indigo-600/30 border border-indigo-500/50 rounded-lg text-amber-300 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                Hackathon Demo Scenario • Step {hackathonStep} of 9
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                (Simulates official 9-step judge walk-through)
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-100 mt-0.5">
              {current.title}: <span className="font-normal text-indigo-200 text-xs sm:text-sm">{current.desc}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
          <button
            onClick={() => {
              resetToDemoData();
              onNavigateTab('dashboard');
            }}
            title="Reset demo data"
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition cursor-pointer text-xs flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={handleNext}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition cursor-pointer"
          >
            <span>Run Step {hackathonStep}</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsExpanded(false)}
            className="p-1.5 text-slate-400 hover:text-white transition cursor-pointer"
            title="Minimize"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress pill dots */}
      <div className="max-w-7xl mx-auto flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-0.5">
        {steps.map((st) => (
          <button
            key={st.num}
            onClick={() => {
              setHackathonStep(st.num);
              st.action();
            }}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              st.num === hackathonStep
                ? 'w-8 bg-amber-400'
                : st.num < hackathonStep
                ? 'w-4 bg-indigo-400'
                : 'w-2 bg-slate-700'
            }`}
            title={`Step ${st.num}: ${st.title}`}
          />
        ))}
      </div>
    </div>
  );
};
