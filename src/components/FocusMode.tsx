import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Play,
  Pause,
  CheckCircle2,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Award,
  Zap,
} from 'lucide-react';
import { playAmbientSound, stopAmbientSound, AmbientSoundType } from '../utils/sound';

export const FocusMode: React.FC = () => {
  const {
    isFocusModeOpen,
    closeFocusMode,
    focusSessionTarget,
    subjects,
    completeSession,
  } = useApp();

  const [sessionMinutes, setSessionMinutes] = useState(50);
  const [secondsLeft, setSecondsLeft] = useState(50 * 60);
  const [isActive, setIsActive] = useState(true);
  const [ambientSound, setAmbientSound] = useState<AmbientSoundType>('none');
  const [isCompletedModal, setIsCompletedModal] = useState(false);

  const activeSubject = subjects.find((s) => s.id === focusSessionTarget?.subjectId) || subjects[0];

  // Initialize seconds on target change
  useEffect(() => {
    if (focusSessionTarget?.duration) {
      setSessionMinutes(focusSessionTarget.duration);
      setSecondsLeft(focusSessionTarget.duration * 60);
    } else {
      setSessionMinutes(50);
      setSecondsLeft(50 * 60);
    }
    setIsActive(true);
    setIsCompletedModal(false);
  }, [focusSessionTarget, isFocusModeOpen]);

  // Timer tick
  useEffect(() => {
    let interval: any = null;
    if (isFocusModeOpen && isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isFocusModeOpen && !isCompletedModal) {
      handleFinishSession();
    }
    return () => clearInterval(interval);
  }, [isFocusModeOpen, isActive, secondsLeft, isCompletedModal]);

  // Handle ambient sound change
  const handleSoundChange = (type: AmbientSoundType) => {
    setAmbientSound(type);
    playAmbientSound(type);
  };

  // Clean up sound on unmount/close
  useEffect(() => {
    return () => {
      stopAmbientSound();
    };
  }, []);

  if (!isFocusModeOpen) return null;

  const handleFinishSession = () => {
    setIsActive(false);
    stopAmbientSound();
    if (focusSessionTarget) {
      completeSession(focusSessionTarget.id);
    }
    setIsCompletedModal(true);
  };

  const setTimerMode = (mins: number) => {
    setSessionMinutes(mins);
    setSecondsLeft(mins * 60);
    setIsActive(true);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progressPct = Math.max(
    0,
    Math.min(100, ((sessionMinutes * 60 - secondsLeft) / (sessionMinutes * 60)) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between p-6 sm:p-12 animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="flex items-center justify-between max-w-4xl w-full mx-auto">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-bold tracking-widest uppercase text-slate-400">
            Focus Mode Active
          </span>
        </div>

        {/* Ambient Noise Selector */}
        <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Ambience:</span>
          {(['none', 'rain', 'whitenoise', 'binaural'] as AmbientSoundType[]).map((snd) => (
            <button
              key={snd}
              onClick={() => handleSoundChange(snd)}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold cursor-pointer transition ${
                ambientSound === snd
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {snd === 'none'
                ? 'Mute'
                : snd === 'rain'
                ? '🌧️ Rain'
                : snd === 'whitenoise'
                ? '💨 White Noise'
                : '🧠 40Hz Wave'}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            stopAmbientSound();
            closeFocusMode();
          }}
          className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-900 transition cursor-pointer"
          title="Exit Focus Mode"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Center Countdown & Topic Display */}
      <div className="max-w-xl w-full mx-auto text-center space-y-6 my-auto">
        {/* Subject and Topic Badge */}
        <div className="space-y-2">
          <span
            className="text-xs sm:text-sm font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border border-indigo-500/30 bg-indigo-950/60 text-indigo-300"
          >
            {activeSubject?.name || 'Academic Sprint'} ({activeSubject?.code || 'MA101'})
          </span>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-100 max-w-lg mx-auto">
            {focusSessionTarget?.title || 'Calculus — Integration Practice'}
          </h2>
          <p className="text-xs text-slate-400">
            High-yield focus sprint • Stay fully immersed
          </p>
        </div>

        {/* Big Giant Timer */}
        <div className="relative py-4 select-none">
          <div className="font-mono text-7xl sm:text-9xl font-black tracking-tight text-white drop-shadow-lg">
            {timeFormatted}
          </div>

          {/* Minimalist Progress Line */}
          <div className="w-64 mx-auto h-1.5 rounded-full bg-slate-800 overflow-hidden mt-4">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-1000"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Play / Pause / Finish Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setIsActive((prev) => !prev)}
            className="w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 transition transform active:scale-95 cursor-pointer"
            title={isActive ? 'Pause' : 'Resume'}
          >
            {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
          </button>

          <button
            onClick={handleFinishSession}
            className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition transform active:scale-95 cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Finish Session</span>
          </button>

          <button
            onClick={() => setSecondsLeft(sessionMinutes * 60)}
            className="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector (25/5, 50/10, Custom) */}
        <div className="flex items-center justify-center gap-2 pt-4">
          {[
            { label: '25 min (Pomodoro)', val: 25 },
            { label: '50 min (Deep Work)', val: 50 },
            { label: '15 min (Sprint)', val: 15 },
          ].map((m) => (
            <button
              key={m.val}
              onClick={() => setTimerMode(m.val)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition ${
                sessionMinutes === m.val
                  ? 'bg-slate-800 text-indigo-400 border border-indigo-500/40'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Motivational Quote Footer */}
      <div className="text-center text-xs text-slate-500 max-w-md mx-auto">
        “Concentration is the secret of strength in politics, in war, in trade, in short in all management of human affairs.”
      </div>

      {/* Celebration Modal upon Finish */}
      {isCompletedModal && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-3xl">
              🎉
            </div>
            <h3 className="text-2xl font-black text-white">Focus Session Complete!</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Great work! One more step toward your goal. Your study progress and streak have been logged.
            </p>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex items-center justify-around text-xs">
              <div>
                <span className="text-slate-400 block">XP Awarded</span>
                <span className="text-emerald-400 font-extrabold text-base">+20 XP</span>
              </div>
              <div className="w-px h-8 bg-slate-700" />
              <div>
                <span className="text-slate-400 block">Study Time</span>
                <span className="text-indigo-400 font-extrabold text-base">{sessionMinutes}m</span>
              </div>
            </div>

            <button
              onClick={() => {
                closeFocusMode();
              }}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition cursor-pointer shadow-lg shadow-indigo-600/30"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
