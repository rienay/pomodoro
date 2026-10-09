import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Sparkles, CheckCircle2, Pause, Play } from 'lucide-react';
import { playTickSound } from '../utils/audio';

export function DynamicIsland({
  mode,
  timeLeftFormatted,
  isRunning,
  onToggleTimer,
  activeTask,
  ambientType,
  onToggleAmbient,
  progressPercent
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const islandRef = useRef(null);

  useEffect(() => {
    if (!isExpanded) return;
    const handleClickOutside = (e) => {
      if (islandRef.current && !islandRef.current.contains(e.target)) {
        setIsExpanded(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [isExpanded]);

  const getModeLabel = () => {
    switch (mode) {
      case 'focus':
        return 'Deep Focus';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Rest & Recharge';
      default:
        return 'Focus';
    }
  };

  const getModeColor = () => {
    switch (mode) {
      case 'focus':
        return 'var(--color-apple-red)';
      case 'shortBreak':
        return 'var(--color-apple-green)';
      case 'longBreak':
        return 'var(--color-apple-teal)';
      default:
        return 'var(--color-apple-red)';
    }
  };

  return (
    <div
      ref={islandRef}
      className={`dynamic-island-wrapper ${isExpanded ? 'is-expanded' : ''}`}
      onClick={() => {
        setIsExpanded(!isExpanded);
        playTickSound(0.2);
      }}
      role="button"
      tabIndex={0}
      aria-label="Dynamic Island Status Bar"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          setIsExpanded(!isExpanded);
        }
      }}
    >
      <div className="dynamic-island">
        {/* Compact Mode */}
        <div className="island-compact-view">
          <div className="island-left">
            <span
              className={`island-pulse-dot ${isRunning ? 'active' : ''}`}
              style={{ backgroundColor: getModeColor() }}
            />
            <span className="island-mode-text">{getModeLabel()}</span>
            {activeTask && (
              <span className="island-task-pill">
                {activeTask.title}
              </span>
            )}
          </div>

          <div className="island-right">
            <span className="island-timer tabular-nums">{timeLeftFormatted}</span>
            {ambientType !== 'none' && (
              <span className="island-audio-indicator" title={`Ambient: ${ambientType}`}>
                <span className="sound-wave-bar bar-1"></span>
                <span className="sound-wave-bar bar-2"></span>
                <span className="sound-wave-bar bar-3"></span>
              </span>
            )}
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="island-expanded-view" onClick={(e) => e.stopPropagation()}>
            <div className="expanded-header">
              <div className="expanded-title-group">
                <span className="expanded-badge" style={{ color: getModeColor(), borderColor: getModeColor() }}>
                  {mode.toUpperCase()}
                </span>
                <h4 className="expanded-title">
                  {activeTask ? activeTask.title : 'Ready to dive into flow state'}
                </h4>
              </div>
              <div className="expanded-timer tabular-nums">
                {timeLeftFormatted}
              </div>
            </div>

            {/* Mini Progress Bar */}
            <div className="expanded-progress-track">
              <div
                className="expanded-progress-fill"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: getModeColor()
                }}
              />
            </div>

            {/* Quick Actions in Island */}
            <div className="expanded-actions">
              <button
                type="button"
                className="island-action-btn press-scale"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleTimer();
                }}
              >
                {isRunning ? <Pause size={14} /> : <Play size={14} />}
                <span>{isRunning ? 'Pause' : 'Start'}</span>
              </button>

              <button
                type="button"
                className={`island-action-btn press-scale ${ambientType !== 'none' ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleAmbient();
                }}
              >
                {ambientType !== 'none' ? <Volume2 size={14} /> : <VolumeX size={14} />}
                <span>{ambientType !== 'none' ? ambientType : 'Ambient'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
