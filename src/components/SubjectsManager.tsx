import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  Plus,
  Clock,
  User,
  MapPin,
  Trash2,
  Edit2,
  BarChart,
  CheckCircle2,
  X,
} from 'lucide-react';
import { Subject, SubjectDifficulty } from '../types';

export const SubjectsManager: React.FC = () => {
  const { subjects, addSubject, updateSubject, deleteSubject } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  // Form inputs
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [teacher, setTeacher] = useState('');
  const [room, setRoom] = useState('');
  const [difficulty, setDifficulty] = useState<SubjectDifficulty>('Medium');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('High');
  const [totalStudyHours, setTotalStudyHours] = useState('10');
  const [color, setColor] = useState('#6366F1');

  const openNewModal = () => {
    setEditingSubject(null);
    setName('');
    setCode('');
    setTeacher('');
    setRoom('');
    setDifficulty('Medium');
    setPriority('High');
    setTotalStudyHours('10');
    setColor('#6366F1');
    setIsModalOpen(true);
  };

  const openEditModal = (sub: Subject) => {
    setEditingSubject(sub);
    setName(sub.name);
    setCode(sub.code);
    setTeacher(sub.teacher);
    setRoom(sub.room || '');
    setDifficulty(sub.difficulty);
    setPriority(sub.priority);
    setTotalStudyHours(String(sub.totalStudyHours));
    setColor(sub.color);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingSubject) {
      updateSubject(editingSubject.id, {
        name,
        code: code || 'C101',
        teacher: teacher || 'Instructor',
        room: room || 'Classroom',
        difficulty,
        priority,
        totalStudyHours: parseFloat(totalStudyHours) || 10,
        color,
      });
    } else {
      addSubject({
        name,
        code: code || 'C101',
        teacher: teacher || 'Instructor',
        room: room || 'Classroom',
        difficulty,
        priority,
        totalStudyHours: parseFloat(totalStudyHours) || 10,
        completedStudyHours: 0,
        color,
        bgLight: 'bg-indigo-50 dark:bg-indigo-950/40',
        borderLight: 'border-indigo-200 dark:border-indigo-800',
        textLight: 'text-indigo-600 dark:text-indigo-400',
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Course & Subject Catalog</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage academic courses, syllabus depth, target study hours, and instructor details.
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Course</span>
        </button>
      </div>

      {/* Grid of Subjects */}
      {subjects.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
            No subjects yet
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Add your first subject to let the AI prioritize your assignments and exam roadmap.
          </p>
          <button
            onClick={openNewModal}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            Add your first subject
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {subjects.map((sub) => {
            const progress = Math.min(
              100,
              Math.round((sub.completedStudyHours / Math.max(1, sub.totalStudyHours)) * 100)
            );

            return (
              <div
                key={sub.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between transition hover:border-slate-300 dark:hover:border-slate-700"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-md"
                      style={{
                        backgroundColor: `${sub.color}15`,
                        color: sub.color,
                      }}
                    >
                      {sub.code}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          sub.difficulty === 'Hard'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                            : sub.difficulty === 'Medium'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                        }`}
                      >
                        {sub.difficulty}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {sub.priority} Priority
                      </span>
                    </div>
                  </div>

                  {/* Subject Name */}
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-3">
                    {sub.name}
                  </h3>

                  {/* Instructor & Room */}
                  <div className="mt-2 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{sub.teacher}</span>
                    </div>
                    {sub.room && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{sub.room}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Study Hours Progress */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Study Log</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {sub.completedStudyHours}h / {sub.totalStudyHours}h ({progress}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: sub.color,
                      }}
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-end gap-2 mt-4">
                    <button
                      onClick={() => openEditModal(sub)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition"
                      title="Edit Subject"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteSubject(sub.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition"
                      title="Delete Subject"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {editingSubject ? 'Edit Course' : 'Add New Course'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Course Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Calculus & Linear Algebra"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Course Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MA101"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Room / Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hall 204"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Instructor Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Reed"
                  value={teacher}
                  onChange={(e) => setTeacher(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as SubjectDifficulty)}
                    className="w-full px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  >
                    <option value="Hard">Hard</option>
                    <option value="Medium">Medium</option>
                    <option value="Easy">Easy</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Hours
                  </label>
                  <input
                    type="number"
                    value={totalStudyHours}
                    onChange={(e) => setTotalStudyHours(e.target.value)}
                    className="w-full px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Accent Color
                </label>
                <div className="flex items-center gap-2">
                  {['#6366F1', '#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-6 h-6 rounded-full cursor-pointer transition ${
                        color === c ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-500 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  {editingSubject ? 'Save Changes' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
