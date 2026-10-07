import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HackathonDemoBar } from './components/HackathonDemoBar';
import { Dashboard } from './components/Dashboard';
import { SmartPlanner } from './components/SmartPlanner';
import { Timetable } from './components/Timetable';
import { SubjectsManager } from './components/SubjectsManager';
import { TasksManager } from './components/TasksManager';
import { ExamsManager } from './components/ExamsManager';
import { Analytics } from './components/Analytics';
import { StudyBuddy } from './components/StudyBuddy';
import { SmartDayModal } from './components/SmartDayModal';
import { FocusMode } from './components/FocusMode';
import { NewTaskModal } from './components/NewTaskModal';
import { SettingsModal } from './components/SettingsModal';
import { OnboardingModal } from './components/OnboardingModal';
import { CheckCircle2, AlertTriangle, Info, Clock, X } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { activeToast, clearToast } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Hackathon Demo Scenario Guide Banner */}
      <HackathonDemoBar onNavigateTab={(tab) => setActiveTab(tab)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Header */}
          <Header
            onOpenNewTaskModal={() => setIsNewTaskModalOpen(true)}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />

          {/* Main Body View */}
          <main className="flex-1 p-4 sm:p-8">
            {activeTab === 'dashboard' && (
              <Dashboard
                onNavigateTab={(tab) => setActiveTab(tab)}
                onOpenNewTaskModal={() => setIsNewTaskModalOpen(true)}
              />
            )}

            {activeTab === 'planner' && (
              <SmartPlanner onNavigateTimetable={() => setActiveTab('timetable')} />
            )}

            {activeTab === 'timetable' && <Timetable />}

            {activeTab === 'subjects' && <SubjectsManager />}

            {activeTab === 'tasks' && (
              <TasksManager onOpenNewTaskModal={() => setIsNewTaskModalOpen(true)} />
            )}

            {activeTab === 'exams' && <ExamsManager />}

            {activeTab === 'analytics' && <Analytics />}

            {activeTab === 'studybuddy' && (
              <StudyBuddy onNavigateTab={(tab) => setActiveTab(tab)} />
            )}
          </main>
        </div>
      </div>

      {/* Floating Interactive Toast Message */}
      {activeToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-slate-700/80 flex items-start gap-3 animate-in slide-in-from-bottom-5 duration-200">
          <div className="mt-0.5 shrink-0">
            {activeToast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : activeToast.type === 'urgent' ? (
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            ) : activeToast.type === 'warning' ? (
              <Clock className="w-5 h-5 text-amber-400" />
            ) : (
              <Info className="w-5 h-5 text-indigo-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h5 className="font-bold text-xs text-white">{activeToast.title}</h5>
            {activeToast.message && (
              <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                {activeToast.message}
              </p>
            )}
          </div>
          <button
            onClick={clearToast}
            className="text-slate-400 hover:text-white p-1 rounded-md transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Modals */}
      <SmartDayModal />
      <FocusMode />
      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
      />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      <OnboardingModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
