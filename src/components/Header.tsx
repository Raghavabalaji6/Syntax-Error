import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  Plus,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Info,
  Calendar,
  X,
} from 'lucide-react';

interface HeaderProps {
  onOpenNewTaskModal: () => void;
  onNavigateTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNewTaskModal, onNavigateTab }) => {
  const {
    user,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotification,
    workloadHealth,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Format today's date
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  // Time-based greeting
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  // Close notif on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between transition-colors">
      {/* Title & Greeting */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            {greeting}, {user.name.split(' ')[0]} 👋
          </h2>
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {workloadHealth.health} Workload
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {dateStr} • Let's make today productive.
        </p>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2.5">
        {/* Quick Task Button */}
        <button
          onClick={onOpenNewTaskModal}
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Task</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen((prev) => !prev)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown Drawer */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-slate-900 dark:text-white">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="mt-3 max-h-80 overflow-y-auto space-y-2.5 divide-y divide-slate-100 dark:divide-slate-800/60">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">You're all caught up! 🎉</p>
                ) : (
                  notifications.map((notif) => {
                    return (
                      <div
                        key={notif.id}
                        className={`pt-2.5 first:pt-0 group relative flex items-start gap-2.5 text-left transition rounded-lg p-2 ${
                          notif.read ? 'opacity-70' : 'bg-slate-50 dark:bg-slate-800/40'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {notif.type === 'urgent' ? (
                            <AlertTriangle className="w-4 h-4 text-rose-500" />
                          ) : notif.type === 'warning' ? (
                            <Clock className="w-4 h-4 text-amber-500" />
                          ) : notif.type === 'success' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Info className="w-4 h-4 text-indigo-500" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                            {notif.title}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                            {notif.message}
                          </p>
                          <div className="flex items-center justify-between mt-1.5">
                            <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                            {notif.actionText && (
                              <button
                                onClick={() => {
                                  markNotificationRead(notif.id);
                                  setIsNotifOpen(false);
                                  const text = notif.actionText || '';
                                  if (text.includes('Exam')) onNavigateTab('exams');
                                  else if (text.includes('Timetable')) onNavigateTab('timetable');
                                  else onNavigateTab('tasks');
                                }}
                                className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                              >
                                {notif.actionText} →
                              </button>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => clearNotification(notif.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
                          title="Dismiss"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
