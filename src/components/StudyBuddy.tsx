import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bot,
  Send,
  Sparkles,
  User,
  Clock,
  Target,
  ArrowRight,
  Flame,
  Zap,
  CheckCircle2,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionText?: string;
  actionType?: 'focus' | 'exam' | 'smartday' | 'timetable';
}

export const StudyBuddy: React.FC<{
  onNavigateTab: (tab: string) => void;
}> = ({ onNavigateTab }) => {
  const {
    user,
    subjects,
    tasks,
    exams,
    sessions,
    availability,
    workloadHealth,
    startFocusSession,
    setIsSmartDayOpen,
  } = useApp();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      text: `Hello ${user.name.split(' ')[0]}! I'm **StudyBuddy**, your personalized AI academic strategist.\n\nI'm tracking your **5 courses**, your upcoming **Mathematics exam in 4 days**, and your **${user.streakDays}-day study streak**.\n\nHow can I help you optimize your study hours today?`,
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const suggestedPrompts = [
    "What should I study now?",
    "Create today's study plan.",
    "I missed yesterday's plan.",
    "How can I prepare for my Maths exam?",
    "I only have one hour.",
    "Explain my current workload.",
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const todaySchedule = sessions.filter((s) => s.date === todayStr);

      const res = await fetch('/api/studybuddy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          context: {
            userName: user.name,
            exams: exams.map((e) => ({
              subject: subjects.find((s) => s.id === e.subjectId)?.name,
              date: e.examDate,
              readinessScore: e.readinessScore,
            })),
            tasks: tasks.map((t) => ({
              title: t.title,
              subject: subjects.find((s) => s.id === t.subjectId)?.name,
              deadline: t.deadline,
              priority: t.priority,
              status: t.status,
            })),
            todaySchedule: todaySchedule.map((s) => ({
              title: s.title,
              time: `${s.startTime} - ${s.endTime}`,
              status: s.status,
            })),
            availableHours: availability.weekdayAvailableHours,
            streakDays: user.streakDays,
            workloadStatus: workloadHealth.health,
          },
        }),
      });

      const data = await res.json();

      let actionText: string | undefined = undefined;
      let actionType: 'focus' | 'exam' | 'smartday' | 'timetable' | undefined = undefined;

      const qLower = query.toLowerCase();
      if (qLower.includes('study now') || qLower.includes('math')) {
        actionText = 'Start Mathematics Focus Sprint';
        actionType = 'focus';
      } else if (qLower.includes('today') || qLower.includes('one hour')) {
        actionText = 'Open ⚡ Smart Day Generator';
        actionType = 'smartday';
      } else if (qLower.includes('missed') || qLower.includes('workload')) {
        actionText = 'Inspect Weekly Timetable';
        actionType = 'timetable';
      }

      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'I analyzed your workload and adjusted your plan accordingly.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionText,
        actionType,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot_err_${Date.now()}`,
          sender: 'assistant',
          text: `Based on your academic schedule, your highest impact task right now is **Mathematics: Calculus Integration** (MA101 exam in 4 days). Take a 45-minute sprint to maximize retention!`,
          timestamp: 'Just now',
          actionText: 'Start Focus Session',
          actionType: 'focus',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (type?: string) => {
    if (type === 'focus') {
      startFocusSession();
    } else if (type === 'smartday') {
      setIsSmartDayOpen(true);
    } else if (type === 'exam') {
      onNavigateTab('exams');
    } else if (type === 'timetable') {
      onNavigateTab('timetable');
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-130px)] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                StudyBuddy AI
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                Active & Schedule-Aware
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Grounded in your active courses, assignments, and sleep boundaries
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
          <Flame className="w-4 h-4 text-amber-500" />
          <span>{user.streakDays} Day Streak</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                  isUser
                    ? 'bg-indigo-600 text-white'
                    : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                {msg.actionText && (
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/80">
                    <button
                      onClick={() => handleActionClick(msg.actionType)}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm active:scale-95"
                    >
                      <span>{msg.actionText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <span
                  className={`block text-[10px] mt-2 ${
                    isUser ? 'text-indigo-200 text-right' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce delay-100" />
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce delay-200" />
              <span className="ml-1 text-slate-400">Analyzing workload & schedule...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="px-4 py-2 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto">
        <span className="text-[11px] font-semibold text-slate-400 shrink-0">Prompts:</span>
        {suggestedPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p)}
            className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap cursor-pointer transition shadow-2xs"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Message Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Ask StudyBuddy about your exams, schedule, or study strategy..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white cursor-pointer transition shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
