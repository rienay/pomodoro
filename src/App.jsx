import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import confetti from 'canvas-confetti';
import { Settings, Sliders, Moon, Sun, Sparkles, Volume2, Maximize2, Minimize2, CheckCircle2 } from 'lucide-react';
import { DynamicIsland } from './components/DynamicIsland';
import { ModePill } from './components/ModePill';
import { TimerRing } from './components/TimerRing';
import { Controls } from './components/Controls';
import { ActivityRings } from './components/ActivityRings';
import { TaskReminders } from './components/TaskReminders';
import { AmbientSoundBar } from './components/AmbientSoundBar';
import { SettingsModal } from './components/SettingsModal';
import { playTickSound, playChimeSound, ambientEngine, triggerHaptic } from './utils/audio';

const DEFAULT_SETTINGS = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  soundEnabled: true,
  theme: 'system', // 'system' | 'light' | 'dark'
};

const INITIAL_TASKS = [
  { id: '1', title: 'Deep Work on Project Architecture', estimatedPoms: 4, completedPoms: 1, completed: false },
  { id: '2', title: 'Review Code & Design System', estimatedPoms: 2, completedPoms: 0, completed: false },
];

export default function App() {
  // Persistent Settings
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('apple_pomodoro_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Mode: 'focus' | 'shortBreak' | 'longBreak'
  const [mode, setMode] = useState('focus');

  // Timer states
  const [timeLeft, setTimeLeft] = useState(settings.focusDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedCycles, setCompletedCycles] = useState(0);

  // Active Task
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('apple_pomodoro_tasks');
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });
  const [activeTaskId, setActiveTaskId] = useState('1');

  // Stats
  const [stats, setStats] = useState(() => {
    try {
      const saved = localStorage.getItem('apple_pomodoro_stats');
      const today = new Date().toISOString().slice(0, 10);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.date === today) return parsed;
      }
      return {
        date: today,
        focusMinutes: 25,
        sessionsCompleted: 1,
        breaksTaken: 1,
        dailyStreak: 3
      };
    } catch {
      return { date: '', focusMinutes: 0, sessionsCompleted: 0, breaksTaken: 0, dailyStreak: 1 };
    }
  });

  // Ambient sound
  const [ambientType, setAmbientType] = useState('none');
  const [ambientVolume, setAmbientVolume] = useState(0.35);

  // UI state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [themeMode, setThemeMode] = useState(settings.theme);

  // Ref to track precise timestamp to avoid background tab drift
  const targetEndTimeRef = useRef(null);
  const timerIntervalRef = useRef(null);

  // Total Duration for current mode
  const getTotalDuration = useCallback((currentMode = mode) => {
    switch (currentMode) {
      case 'shortBreak':
        return settings.shortBreakDuration * 60;
      case 'longBreak':
        return settings.longBreakDuration * 60;
      default:
        return settings.focusDuration * 60;
    }
  }, [mode, settings]);

  // Persist settings
  useEffect(() => {
    localStorage.setItem('apple_pomodoro_settings', JSON.stringify(settings));
    setThemeMode(settings.theme);
  }, [settings]);

  // Persist tasks
  useEffect(() => {
    localStorage.setItem('apple_pomodoro_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Persist stats
  useEffect(() => {
    localStorage.setItem('apple_pomodoro_stats', JSON.stringify(stats));
  }, [stats]);

  // Handle Theme (System, Light, Dark)
  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', themeMode);
    }
  }, [themeMode]);

  // Listen to system theme changes if theme is 'system'
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => {
      if (settings.theme === 'system') {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      }
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [settings.theme]);

  // Mode change handler
  const handleSelectMode = useCallback((newMode) => {
    setIsRunning(false);
    clearInterval(timerIntervalRef.current);
    setMode(newMode);
    setTimeLeft(getTotalDuration(newMode));
  }, [getTotalDuration]);

  // Switch to Next Session
  const handleNextPhase = useCallback(() => {
    setIsRunning(false);
    clearInterval(timerIntervalRef.current);

    if (settings.soundEnabled) {
      playChimeSound(0.6);
    }

    if (mode === 'focus') {
      // Fire celebratory confetti on completing focus sprint!
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#ff453a', '#30d158', '#0a84ff', '#ffd60a'],
          disableForReducedMotion: true
        });
      } catch (_) {}

      // Increment cycle count
      const nextCycles = completedCycles + 1;
      setCompletedCycles(nextCycles);

      // Increment stats
      setStats(prev => ({
        ...prev,
        focusMinutes: prev.focusMinutes + Math.round(settings.focusDuration),
        sessionsCompleted: prev.sessionsCompleted + 1
      }));

      // Update active task progress
      if (activeTaskId) {
        setTasks(prev => prev.map(t => {
          if (t.id === activeTaskId) {
            const newCount = t.completedPoms + 1;
            return {
              ...t,
              completedPoms: newCount,
              completed: newCount >= t.estimatedPoms ? true : t.completed
            };
          }
          return t;
        }));
      }

      // Check if long break or short break
      if (nextCycles % settings.longBreakInterval === 0) {
        setMode('longBreak');
        setTimeLeft(settings.longBreakDuration * 60);
      } else {
        setMode('shortBreak');
        setTimeLeft(settings.shortBreakDuration * 60);
      }

      if (settings.autoStartBreaks) {
        setTimeout(() => setIsRunning(true), 1000);
      }
    } else {
      // Break ended
      setStats(prev => ({
        ...prev,
        breaksTaken: prev.breaksTaken + 1
      }));

      setMode('focus');
      setTimeLeft(settings.focusDuration * 60);

      if (settings.autoStartPomodoros) {
        setTimeout(() => setIsRunning(true), 1000);
      }
    }
  }, [mode, completedCycles, settings, activeTaskId]);

  // Toggle Timer Play / Pause
  const handleToggleTimer = useCallback(() => {
    setIsRunning(prev => !prev);
  }, []);

  // Timer Tick Engine with precise delta calculation
  useEffect(() => {
    if (!isRunning) {
      clearInterval(timerIntervalRef.current);
      return;
    }

    targetEndTimeRef.current = Date.now() + timeLeft * 1000;

    timerIntervalRef.current = setInterval(() => {
      const remainingMs = targetEndTimeRef.current - Date.now();
      const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));

      setTimeLeft(remainingSec);

      if (remainingSec <= 0) {
        clearInterval(timerIntervalRef.current);
        handleNextPhase();
      }
    }, 250);

    return () => clearInterval(timerIntervalRef.current);
  }, [isRunning, handleNextPhase]);

  // Sync Document Title & Favicon
  useEffect(() => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    const modeName = mode === 'focus' ? 'Focus' : mode === 'shortBreak' ? 'Short Break' : 'Long Break';
    const stateIcon = isRunning ? '⏳' : '⏸';
    document.title = `${timeStr} ${stateIcon} ${modeName} | Apple Pomodoro`;
  }, [timeLeft, mode, isRunning]);

  // Keyboard Shortcuts (Space, R, S, F, 1, 2, 3)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore when focused inside inputs
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        playTickSound(0.2);
        handleToggleTimer();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        playTickSound(0.2);
        handleResetTimer();
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        playTickSound(0.2);
        handleNextPhase();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        handleToggleFullscreen();
      } else if (e.key === '1') {
        handleSelectMode('focus');
      } else if (e.key === '2') {
        handleSelectMode('shortBreak');
      } else if (e.key === '3') {
        handleSelectMode('longBreak');
      } else if (e.key === 'Escape') {
        setIsSettingsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleToggleTimer, handleNextPhase, handleSelectMode]);

  // Reset Timer
  const handleResetTimer = useCallback(() => {
    setIsRunning(false);
    clearInterval(timerIntervalRef.current);
    setTimeLeft(getTotalDuration());
  }, [getTotalDuration]);

  // Interactive Circular Scrubber
  const handleScrubTime = useCallback((newSeconds) => {
    setTimeLeft(newSeconds);
  }, []);

  // Ambient sound selector
  const handleSelectAmbient = (type) => {
    setAmbientType(type);
    if (type === 'none') {
      ambientEngine.stop();
    } else {
      ambientEngine.setVolume(ambientVolume);
      ambientEngine.start(type);
    }
  };

  // Toggle Fullscreen
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Current active task
  const activeTask = tasks.find(t => t.id === activeTaskId);

  // Formatted Time
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const totalSecs = getTotalDuration();
  const progressPercent = totalSecs > 0 ? ((totalSecs - timeLeft) / totalSecs) * 100 : 0;

  return (
    <div className={`apple-app ${isFullscreen ? 'zen-mode' : ''}`}>
      {/* Top Background Ambient Glow Layer */}
      <div className={`ambient-backdrop mode-${mode}`} />

      {/* Top Floating Dynamic Island */}
      <header className="top-navigation-bar">
        <div className="nav-left">
          <div className="apple-brand-badge">
            <span className="apple-icon"></span>
            <span className="brand-name">FlowTimer</span>
          </div>
        </div>

        <div className="nav-center">
          <DynamicIsland
            mode={mode}
            timeLeftFormatted={formattedTime}
            isRunning={isRunning}
            onToggleTimer={handleToggleTimer}
            activeTask={activeTask}
            ambientType={ambientType}
            onToggleAmbient={() => handleSelectAmbient(ambientType === 'none' ? 'rain' : 'none')}
            progressPercent={progressPercent}
          />
        </div>

        <div className="nav-right">
          {/* Quick Theme Toggle */}
          <button
            type="button"
            className="nav-icon-btn glass-panel press-scale"
            onClick={() => {
              playTickSound(0.2);
              const nextTheme = themeMode === 'dark' ? 'light' : 'dark';
              setThemeMode(nextTheme);
              setSettings(s => ({ ...s, theme: nextTheme }));
            }}
            title="Toggle Light/Dark Theme"
          >
            {themeMode === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Settings Trigger */}
          <button
            type="button"
            className="nav-icon-btn glass-panel press-scale"
            onClick={() => {
              playTickSound(0.2);
              setIsSettingsOpen(true);
            }}
            title="Preferences & Audio Settings"
          >
            <Settings size={17} />
          </button>
        </div>
      </header>

      {/* Main Experience Layout */}
      <main className="app-main-content">
        {/* Center Clock Core */}
        <section className="timer-hero-section">
          {/* iOS Segmented Glass Pill */}
          <div className="mode-pill-wrapper">
            <ModePill currentMode={mode} onSelectMode={handleSelectMode} />
          </div>

          {/* Tactile Timer Dial with Direct Manipulation Scrubbing */}
          <TimerRing
            timeLeft={timeLeft}
            totalDuration={totalSecs}
            mode={mode}
            isRunning={isRunning}
            completedCycles={completedCycles}
            targetCycles={settings.longBreakInterval}
            onScrubTime={handleScrubTime}
          />

          {/* Primary Action Buttons */}
          <Controls
            isRunning={isRunning}
            onToggleTimer={handleToggleTimer}
            onResetTimer={handleResetTimer}
            onSkipTimer={handleNextPhase}
            mode={mode}
            isFullscreen={isFullscreen}
            onToggleFullscreen={handleToggleFullscreen}
          />

          {/* Active Task Subtitle Pill */}
          {activeTask && (
            <div className="active-focus-pill glass-panel">
              <CheckCircle2 size={13} className="focus-pill-icon" />
              <span>Target: <strong>{activeTask.title}</strong></span>
            </div>
          )}
        </section>

        {/* Bottom Widgets Row: Activity Rings, Reminders, Ambient Sound */}
        {!isFullscreen && (
          <section className="widgets-grid-section">
            <ActivityRings
              focusMinutes={stats.focusMinutes}
              focusGoal={100}
              sessionsCompleted={stats.sessionsCompleted}
              sessionsGoal={settings.longBreakInterval}
              breaksTaken={stats.breaksTaken}
              breaksGoal={settings.longBreakInterval}
              dailyStreak={stats.dailyStreak}
            />

            <TaskReminders
              tasks={tasks}
              activeTaskId={activeTaskId}
              onSelectActiveTask={(id) => setActiveTaskId(id)}
              onToggleTask={(id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))}
              onAddTask={(newTask) => setTasks(prev => [newTask, ...prev])}
              onDeleteTask={(id) => setTasks(prev => prev.filter(t => t.id !== id))}
            />

            <AmbientSoundBar
              ambientType={ambientType}
              volume={ambientVolume}
              onSelectAmbient={handleSelectAmbient}
              onChangeVolume={(vol) => setAmbientVolume(vol)}
            />
          </section>
        )}
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(newSettings) => setSettings(newSettings)}
        onResetSettings={() => {
          setSettings(DEFAULT_SETTINGS);
          setTimeLeft(DEFAULT_SETTINGS.focusDuration * 60);
        }}
      />
    </div>
  );
}
