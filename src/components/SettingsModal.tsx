import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  User,
  Clock,
  Moon,
  Sun,
  ShieldCheck,
  RotateCcw,
  X,
  Check,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    user,
    availability,
    updateAvailability,
    updateUserProfile,
    darkMode,
    toggleDarkMode,
    resetToDemoData,
  } = useApp();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [weekdayHours, setWeekdayHours] = useState(String(availability.weekdayAvailableHours));
  const [weekendHours, setWeekendHours] = useState(String(availability.weekendAvailableHours));
  const [sleepTime, setSleepTime] = useState(availability.sleepTime);
  const [wakeTime, setWakeTime] = useState(availability.wakeTime);
  const [sessionLen, setSessionLen] = useState(String(availability.preferredSessionMinutes));

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, email });
    updateAvailability({
      weekdayAvailableHours: parseFloat(weekdayHours) || 2.5,
      weekendAvailableHours: parseFloat(weekendHours) || 4.5,
      sleepTime,
      wakeTime,
      preferredSessionMinutes: parseInt(sessionLen) || 50,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              System Settings & Study Preferences
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5 mt-4 text-xs">
          {/* User Profile */}
          <div className="space-y-3">
            <h4 className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-[11px]">
              Student Profile
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Study Preferences */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <h4 className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-[11px]">
              Daily Study Capacity
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">
                  Weekday Target Hours
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={weekdayHours}
                  onChange={(e) => setWeekdayHours(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">
                  Weekend Target Hours
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={weekendHours}
                  onChange={(e) => setWeekendHours(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Sleep Schedule Protection */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <h4 className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-[11px]">
                Sleep-Aware Protection
              </h4>
            </div>
            <p className="text-[11px] text-slate-500">
              The AI scheduling engine strictly prevents sessions from intruding into your protected sleep window.
            </p>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">
                  Bedtime (Sleep Start)
                </label>
                <input
                  type="time"
                  value={sleepTime}
                  onChange={(e) => setSleepTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">
                  Wake Time
                </label>
                <input
                  type="time"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Appearance & Reset */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Appearance Theme
              </span>
              <button
                type="button"
                onClick={toggleDarkMode}
                className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
                <span>{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900">
              <div>
                <span className="font-semibold text-rose-700 dark:text-rose-300 block">
                  Demo Reset
                </span>
                <span className="text-[10px] text-rose-600/80 dark:text-rose-400">
                  Restore default course catalog & mock timetable
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  resetToDemoData();
                  onClose();
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-semibold cursor-pointer hover:bg-rose-700 transition"
              >
                Reset Data
              </button>
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-500 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
