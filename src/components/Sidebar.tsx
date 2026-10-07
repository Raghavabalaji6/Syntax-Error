import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  CheckSquare,
  Target,
  BarChart3,
  Bot,
  Settings,
  Sparkles,
  Zap,
  Moon,
  Sun,
  Flame,
  Award,
  Clock,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSettings,
}) => {
  const {
    user,
    darkMode,
    toggleDarkMode,
    setIsSmartDayOpen,
    startFocusSession,
  } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'timetable', label: 'Timetable', icon: Calendar },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'exams', label: 'Exams', icon: Target },
    { id: 'analytics', label: 'Progress', icon: BarChart3 },
    { id: 'studybuddy', label: 'StudyBuddy', icon: Bot, badge: 'AI' },
  ];

  const currentLevelMinXp = (user.level - 1) * 500;
  const nextLevelXp = user.level * 500;
  const progressInLevel = Math.min(
    100,
    Math.max(0, ((user.xp - currentLevelMinXp) / (nextLevelXp - currentLevelMinXp)) * 100)
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen sticky top-0 shrink-0 select-none">
        {/* Brand */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                StudySync <span className="text-indigo-600 dark:text-indigo-400 font-extrabold text-xs px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800">AI</span>
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Smart Academic OS</p>
            </div>
          </div>
        </div>

        {/* Quick Actions (Smart Day & Focus) */}
        <div className="p-3 border-b border-slate-100 dark:border-slate-800/80 space-y-1.5">
          <button
            onClick={() => setIsSmartDayOpen(true)}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium text-xs flex items-center justify-between shadow-sm cursor-pointer transition transform active:scale-[0.99]"
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 fill-white" />
              <span>⚡ Smart Day</span>
            </div>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-bold">Auto</span>
          </button>

          <button
            onClick={() => startFocusSession()}
            className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-xs flex items-center justify-between cursor-pointer transition"
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>Focus Mode</span>
            </div>
            <span className="text-[10px] text-slate-400">Pomodoro</span>
          </button>
        </div>

        {/* Main Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Gamification Streak & XP Card */}
        <div className="p-3 mx-3 mb-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{user.streakDays} Day Streak</span>
            </div>
            <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
              Lvl {user.level}
            </span>
          </div>

          {/* XP Bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mb-1.5">
            <div
              className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressInLevel}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
            <span>Scholar</span>
            <span>{user.xp} XP</span>
          </div>
        </div>

        {/* Footer info & Settings */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
            />
            <div className="text-left">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                {user.name}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">Student</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={toggleDarkMode}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition"
              title="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={onOpenSettings}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-40 px-3 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 text-[11px] cursor-pointer ${
            activeTab === 'dashboard'
              ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab('timetable')}
          className={`flex flex-col items-center gap-1 text-[11px] cursor-pointer ${
            activeTab === 'timetable'
              ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span>Timetable</span>
        </button>

        {/* Central Smart Day Trigger */}
        <button
          onClick={() => setIsSmartDayOpen(true)}
          className="w-11 h-11 -mt-5 rounded-full bg-gradient-to-r from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-lg cursor-pointer transform active:scale-95"
          title="Smart Day"
        >
          <Zap className="w-5 h-5 fill-white" />
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex flex-col items-center gap-1 text-[11px] cursor-pointer ${
            activeTab === 'tasks'
              ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <CheckSquare className="w-5 h-5" />
          <span>Tasks</span>
        </button>

        <button
          onClick={() => setActiveTab('studybuddy')}
          className={`flex flex-col items-center gap-1 text-[11px] cursor-pointer ${
            activeTab === 'studybuddy'
              ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Bot className="w-5 h-5" />
          <span>AI Buddy</span>
        </button>
      </nav>
    </>
  );
};
