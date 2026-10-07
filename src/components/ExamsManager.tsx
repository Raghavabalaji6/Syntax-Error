import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Target,
  Plus,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  BookOpen,
  ChevronRight,
  MapPin,
  Award,
} from 'lucide-react';
import { generateExamRoadmap } from '../utils/examReadiness';
import { Exam } from '../types';

export const ExamsManager: React.FC = () => {
  const { exams, subjects, toggleExamTopic, addExam } = useApp();

  const [selectedExamId, setSelectedExamId] = useState<string>(exams[0]?.id || '');
  const [isNewExamModalOpen, setIsNewExamModalOpen] = useState(false);

  // New exam form state
  const [newSubjectId, setNewSubjectId] = useState(subjects[0]?.id || '');
  const [newExamDate, setNewExamDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [newExamTime, setNewExamTime] = useState('09:00 AM');
  const [newImportance, setNewImportance] = useState<'Critical' | 'High' | 'Medium'>('High');
  const [newRoom, setNewRoom] = useState('Hall A');
  const [topicsInput, setTopicsInput] = useState('Unit 1 Foundations\nUnit 2 Core Models\nUnit 3 Problem Sets\nUnit 4 Review');

  const activeExam = exams.find((e) => e.id === selectedExamId) || exams[0];
  const activeSubject = subjects.find((s) => s.id === activeExam?.subjectId);

  const roadmap = activeExam && activeSubject
    ? generateExamRoadmap(activeExam, activeSubject.name)
    : [];

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedTopics = topicsInput
      .split('\n')
      .map((t) => t.trim())
      .filter(Boolean)
      .map((name, i) => ({
        id: `topic_${Date.now()}_${i}`,
        name,
        completed: false,
      }));

    addExam({
      subjectId: newSubjectId,
      examDate: newExamDate,
      examTime: newExamTime,
      importance: newImportance,
      readinessScore: 0,
      targetGrade: 'A',
      room: newRoom,
      syllabus: parsedTopics.length > 0 ? parsedTopics : [
        { id: `t1_${Date.now()}`, name: 'Fundamentals', completed: false },
        { id: `t2_${Date.now()}`, name: 'Practice Drills', completed: false },
      ],
    });

    setIsNewExamModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Semester Exam Preparation Engine</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time readiness scoring, topic mastery checklists, and 7-day revision roadmaps.
          </p>
        </div>

        <button
          onClick={() => setIsNewExamModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Exam Target</span>
        </button>
      </div>

      {exams.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
          <Target className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
            No upcoming exams
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Add an exam date to unlock an automated preparation roadmap with topic breakdown.
          </p>
          <button
            onClick={() => setIsNewExamModalOpen(true)}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            Add an Exam
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Exam Cards Selector (Left 1 col) */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
              Upcoming Exams ({exams.length})
            </h3>

            {exams.map((exam) => {
              const sub = subjects.find((s) => s.id === exam.subjectId);
              const isSelected = exam.id === activeExam?.id;

              const daysLeft = Math.round(
                (new Date(exam.examDate).getTime() - Date.now()) / (1000 * 3600 * 24)
              );

              // Readiness tier
              let readinessBadge = 'text-rose-600 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900';
              let readinessText = '🔴 At Risk';
              if (exam.readinessScore >= 80) {
                readinessBadge = 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900';
                readinessText = '🟢 Ready';
              } else if (exam.readinessScore >= 50) {
                readinessBadge = 'text-amber-600 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900';
                readinessText = '🟡 Needs Attention';
              }

              return (
                <div
                  key={exam.id}
                  onClick={() => setSelectedExamId(exam.id)}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {sub?.name || 'Subject'} ({sub?.code})
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {daysLeft <= 0 ? 'Today' : `In ${daysLeft} days`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      📅 {exam.examDate}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${readinessBadge}`}>
                      {readinessText}
                    </span>
                  </div>

                  <div className="mt-3">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-500 dark:text-slate-400">Readiness</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {exam.readinessScore}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full"
                        style={{ width: `${exam.readinessScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Exam Roadmap & Interactive Syllabus (Right 2 cols) */}
          {activeExam && (
            <div className="lg:col-span-2 space-y-6">
              {/* Detailed Readiness Card */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      Active Exam Target
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                      {activeSubject?.name} Midterm Examination
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {activeExam.examDate} at {activeExam.examTime || '09:00 AM'} • {activeExam.room || 'Main Hall'}
                    </p>
                  </div>

                  {/* Circular / Large Score Badge */}
                  <div className="flex items-center gap-3 self-start sm:self-auto p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <div className="w-12 h-12 rounded-full border-4 border-emerald-500 flex items-center justify-center font-extrabold text-base text-slate-900 dark:text-white">
                      {activeExam.readinessScore}%
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                        Readiness Level
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        {activeExam.readinessScore >= 80 ? '🟢 Ready for Exam' : activeExam.readinessScore >= 50 ? '🟡 Needs Attention' : '🔴 At Risk'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Interactive Syllabus Topic Checklist */}
                <div className="mt-5">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      Syllabus Mastery Checklist
                    </h4>
                    <span className="text-xs text-slate-400">
                      Check topics off to boost Readiness Score
                    </span>
                  </div>

                  <div className="space-y-2">
                    {activeExam.syllabus.map((topic) => (
                      <div
                        key={topic.id}
                        onClick={() => toggleExamTopic(activeExam.id, topic.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition ${
                          topic.completed
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60'
                            : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2
                            className={`w-5 h-5 transition ${
                              topic.completed
                                ? 'text-emerald-600 dark:text-emerald-400 fill-emerald-500 text-white'
                                : 'text-slate-300 dark:text-slate-600'
                            }`}
                          />
                          <span
                            className={`text-xs font-medium ${
                              topic.completed
                                ? 'line-through text-slate-500 dark:text-slate-400'
                                : 'text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            {topic.name}
                          </span>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            topic.completed
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                              : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {topic.completed ? 'Mastered' : 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 7-Day Automated Revision Roadmap */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-indigo-500" />
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">
                    Automated 7-Day Preparation Roadmap
                  </h4>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
                  Spaced repetition and progressive test simulation designed specifically for {activeSubject?.name}.
                </p>

                <div className="space-y-3">
                  {roadmap.map((step) => (
                    <div
                      key={step.dayNumber}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                    >
                      <div className="flex items-start sm:items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs flex items-center justify-center shrink-0">
                          D{step.dayNumber}
                        </div>
                        <div>
                          <h5 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                            {step.focusTitle}
                          </h5>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {step.technique} • {step.dateStr}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {step.recommendedDurationMinutes} mins
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* New Exam Modal */}
      {isNewExamModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl">
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
              Add New Exam Target
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              AI automatically builds your spaced-repetition revision sprint.
            </p>

            <form onSubmit={handleCreateExam} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject
                </label>
                <select
                  value={newSubjectId}
                  onChange={(e) => setNewSubjectId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Exam Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newExamDate}
                    onChange={(e) => setNewExamDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Exam Time
                  </label>
                  <input
                    type="text"
                    value={newExamTime}
                    onChange={(e) => setNewExamTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Importance
                  </label>
                  <select
                    value={newImportance}
                    onChange={(e) => setNewImportance(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Location / Hall
                  </label>
                  <input
                    type="text"
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Syllabus Topics (One per line)
                </label>
                <textarea
                  rows={4}
                  value={topicsInput}
                  onChange={(e) => setTopicsInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewExamModalOpen(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-500 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Create Exam Roadmap
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
