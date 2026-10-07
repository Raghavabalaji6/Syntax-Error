import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  BookOpen,
  Calendar,
  CheckSquare,
  Target,
  Clock,
  Moon,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  X,
} from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const {
    isOnboardingOpen,
    setIsOnboardingOpen,
    generateDynamicPlan,
    subjects,
    availability,
  } = useApp();

  const [step, setStep] = useState(1);

  if (!isOnboardingOpen) return null;

  const totalSteps = 7;

  const handleFinish = () => {
    generateDynamicPlan();
    setIsOnboardingOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Step Indicator */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Step {step} of {totalSteps}
          </span>
          <button
            onClick={() => setIsOnboardingOpen(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              Welcome to StudySync AI 👋
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              Plan smarter. Study better. Achieve more. Let's set up your personalized academic operating system.
            </p>
          </div>
        )}

        {/* Step 2: Subjects */}
        {step === 2 && (
          <div className="py-6 space-y-3">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <BookOpen className="w-5 h-5" />
              <h4 className="font-bold text-base text-slate-900 dark:text-white">1. Add Your Courses</h4>
            </div>
            <p className="text-xs text-slate-500">
              We've preloaded your core semester subjects:
            </p>
            <div className="space-y-1.5">
              {subjects.slice(0, 4).map((s) => (
                <div key={s.id} className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{s.name} ({s.code})</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">{s.difficulty}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Class Schedule */}
        {step === 3 && (
          <div className="py-6 space-y-3">
            <div className="flex items-center gap-2 text-blue-600">
              <Calendar className="w-5 h-5" />
              <h4 className="font-bold text-base text-slate-900 dark:text-white">2. Class Timetable</h4>
            </div>
            <p className="text-xs text-slate-500">
              Classes are locked into your weekly schedule to prevent study overlaps:
            </p>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
              <div className="flex justify-between"><span>Mon & Thu 09:00 AM:</span><span className="font-semibold">Mathematics (Hall 204)</span></div>
              <div className="flex justify-between"><span>Tue & Fri 10:30 AM:</span><span className="font-semibold">Physics (Lab B)</span></div>
              <div className="flex justify-between"><span>Mon & Wed 11:00 AM:</span><span className="font-semibold">DSA (Turing 102)</span></div>
            </div>
          </div>
        )}

        {/* Step 4: Assignments */}
        {step === 4 && (
          <div className="py-6 space-y-3">
            <div className="flex items-center gap-2 text-amber-600">
              <CheckSquare className="w-5 h-5" />
              <h4 className="font-bold text-base text-slate-900 dark:text-white">3. Active Assignments</h4>
            </div>
            <p className="text-xs text-slate-500">
              AI splits long assignments into 45-minute focus intervals before deadlines.
            </p>
            <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 text-xs">
              <p className="font-bold text-amber-800 dark:text-amber-300">Auto-Chunking Engine</p>
              <p className="text-slate-600 dark:text-slate-400 mt-1">A 3-hour project is seamlessly split into 2 dedicated afternoon blocks.</p>
            </div>
          </div>
        )}

        {/* Step 5: Exams */}
        {step === 5 && (
          <div className="py-6 space-y-3">
            <div className="flex items-center gap-2 text-rose-600">
              <Target className="w-5 h-5" />
              <h4 className="font-bold text-base text-slate-900 dark:text-white">4. Exam Countdown</h4>
            </div>
            <p className="text-xs text-slate-500">
              Your Mathematics Midterm in 4 days will automatically receive peak revision weight in your priority matrix.
            </p>
            <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-rose-700 dark:text-rose-300">MA101 Mathematics Midterm</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-700">78% Readiness</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Availability */}
        {step === 6 && (
          <div className="py-6 space-y-3">
            <div className="flex items-center gap-2 text-indigo-600">
              <Clock className="w-5 h-5" />
              <h4 className="font-bold text-base text-slate-900 dark:text-white">5. Daily Availability</h4>
            </div>
            <p className="text-xs text-slate-500">
              Set realistic study limits so your workload stays balanced:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border">
                <span className="text-slate-400 block">Weekdays</span>
                <span className="font-bold text-base text-slate-900 dark:text-white">2.5 hours / day</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border">
                <span className="text-slate-400 block">Weekends</span>
                <span className="font-bold text-base text-slate-900 dark:text-white">4.5 hours / day</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Sleep Schedule */}
        {step === 7 && (
          <div className="py-6 space-y-3 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-lg text-slate-900 dark:text-white">
              Your Academic System is Ready!
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Bedtime ({availability.sleepTime}) and wake time ({availability.wakeTime}) are protected. Click below to generate your initial weekly plan.
            </p>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < totalSteps ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate My Plan</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
