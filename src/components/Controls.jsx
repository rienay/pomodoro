import React from 'react';
import { Play, Pause, RotateCcw, SkipForward, Maximize2, Minimize2 } from 'lucide-react';
import { playTickSound, triggerHaptic } from '../utils/audio';

export function Controls({
  isRunning,
  onToggleTimer,
  onResetTimer,
  onSkipTimer,
  mode,
  isFullscreen,
  onToggleFullscreen
}) {
  const getModeColor = () => {
    switch (mode) {
      case 'shortBreak':
        return 'var(--color-apple-green)';
      case 'longBreak':
        return 'var(--color-apple-teal)';
      default:
        return 'var(--color-apple-red)';
    }
  };

  return (
    <div className="controls-container">
      {/* Reset Button */}
      <button
        type="button"
        className="ctrl-btn-secondary glass-panel press-scale"
        onClick={() => {
          playTickSound(0.2);
          onResetTimer();
        }}
        title="Reset current timer (R)"
        aria-label="Reset Timer"
      >
        <RotateCcw size={18} />
      </button>

      {/* Main Play / Pause Button */}
      <button
        type="button"
        className="ctrl-btn-primary press-scale"
        onClick={() => {
          playTickSound(0.3);
          triggerHaptic(18);
          onToggleTimer();
        }}
        style={{
          boxShadow: isRunning ? `0 12px 30px -8px ${getModeColor()}` : 'none',
        }}
        aria-label={isRunning ? 'Pause Timer (Space)' : 'Start Timer (Space)'}
      >
        <span className="btn-icon-wrapper">
          {isRunning ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" style={{ marginLeft: 2 }} />}
        </span>
        <span className="btn-label">{isRunning ? 'Pause' : 'Start'}</span>
      </button>

      {/* Skip Button */}
      <button
        type="button"
        className="ctrl-btn-secondary glass-panel press-scale"
        onClick={() => {
          playTickSound(0.25);
          onSkipTimer();
        }}
        title="Skip to next session (S)"
        aria-label="Skip to Next Session"
      >
        <SkipForward size={18} />
      </button>

      {/* Zen Fullscreen Button */}
      <button
        type="button"
        className="ctrl-btn-secondary glass-panel press-scale"
        onClick={() => {
          playTickSound(0.2);
          onToggleFullscreen();
        }}
        title={isFullscreen ? 'Exit Fullscreen (F)' : 'Zen Fullscreen (F)'}
        aria-label="Toggle Fullscreen"
      >
        {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
      </button>
    </div>
  );
}
