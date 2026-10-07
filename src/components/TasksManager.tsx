import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckSquare,
  Plus,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Filter,
  Search,
  BookOpen,
} from 'lucide-react';
import { Task, TaskType, PriorityLevel, TaskStatus } from '../types';

export const TasksManager: React.FC<{ onOpenNewTaskModal: () => void }> = ({
  onOpenNewTaskModal,
}) => {
  const { tasks, subjects, completeTask, deleteTask, updateTask } = useApp();

  const [activeFilter, setActiveFilter] = useState<'All' | TaskType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Completed'>('Active');

  const filterTabs: Array<'All' | TaskType> = [
    'All',
    'Assignment',
    'Project',
    'Revision',
    'Practice',
    'Reading',
  ];

  const filteredTasks = tasks.filter((t) => {
    // Type filter
    if (activeFilter !== 'All' && t.type !== activeFilter) return false;

    // Status filter
    if (statusFilter === 'Active' && t.status === 'Completed') return false;
    if (statusFilter === 'Completed' && t.status !== 'Completed') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const sub = subjects.find((s) => s.id === t.subjectId);
      const matchesTitle = t.title.toLowerCase().includes(q);
      const matchesSub = sub?.name.toLowerCase().includes(q) || sub?.code.toLowerCase().includes(q);
      return matchesTitle || matchesSub;
    }

    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Academic Tasks & Deliverables</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Assignments, project milestones, revision drills, and problem sets.
          </p>
        </div>

        <button
          onClick={onOpenNewTaskModal}
          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 sm:p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search tasks or courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Status Tabs */}
          <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center gap-1 text-xs self-stretch sm:self-auto justify-center">
            {(['Active', 'All', 'Completed'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg font-medium cursor-pointer transition ${
                  statusFilter === st
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Type Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition ${
                activeFilter === tab
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
            You're all caught up! 🎉
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            No active tasks matching this filter. Enjoy your free time or schedule a quick revision!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const isCompleted = task.status === 'Completed';
            const sub = subjects.find((s) => s.id === task.subjectId);

            // Deadline proximity
            const now = new Date().getTime();
            const dlTime = new Date(task.deadline).getTime();
            const daysLeft = Math.round((dlTime - now) / (1000 * 3600 * 24));

            return (
              <div
                key={task.id}
                className={`bg-white dark:bg-slate-900 rounded-2xl border p-4 sm:p-5 shadow-xs transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isCompleted
                    ? 'border-slate-200 dark:border-slate-800 opacity-60'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  {/* Completion Toggle */}
                  <button
                    onClick={() => completeTask(task.id)}
                    disabled={isCompleted}
                    className={`mt-0.5 p-1 rounded-lg transition cursor-pointer ${
                      isCompleted
                        ? 'text-emerald-500'
                        : 'text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    title={isCompleted ? 'Completed' : 'Complete task (+50 XP)'}
                  >
                    <CheckCircle2
                      className={`w-6 h-6 ${isCompleted ? 'fill-emerald-500 text-white' : ''}`}
                    />
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                        style={{
                          backgroundColor: `${sub?.color || '#6366F1'}15`,
                          color: sub?.color || '#6366F1',
                        }}
                      >
                        {sub?.name || 'General'}
                      </span>

                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {task.type}
                      </span>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          task.priority === 'Urgent'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                            : task.priority === 'High'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {task.priority} Priority
                      </span>
                    </div>

                    <h4
                      className={`text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate ${
                        isCompleted ? 'line-through text-slate-500 dark:text-slate-400' : ''
                      }`}
                    >
                      {task.title}
                    </h4>

                    {task.notes && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                        {task.notes}
                      </p>
                    )}

                    {/* Deadline & Duration footer */}
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Due: {task.deadline.replace('T', ' at ')}</span>
                      </span>

                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Est: {task.estimatedMinutes} mins</span>
                      </span>

                      {!isCompleted && (
                        <span
                          className={`font-semibold ${
                            daysLeft <= 1 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {daysLeft <= 0 ? 'Due Today!' : daysLeft === 1 ? 'Due Tomorrow' : `In ${daysLeft} days`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress bar & Delete */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  <div className="w-28 text-right">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      {task.progress}% done
                    </span>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mt-1">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                    title="Delete Task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
