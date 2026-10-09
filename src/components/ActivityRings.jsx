import React from 'react';
import { Flame, Target, Coffee } from 'lucide-react';

export function ActivityRings({
  focusMinutes = 0,
  focusGoal = 100, // minutes
  sessionsCompleted = 0,
  sessionsGoal = 4,
  breaksTaken = 0,
  breaksGoal = 4,
  dailyStreak = 3
}) {
  const size = 130;
  const strokeWidth = 9;
  const center = size / 2;

  // Ring 1: Focus Minutes (Outer, Red)
  const r1 = 52;
  const c1 = 2 * Math.PI * r1;
  const p1 = Math.min(1.2, focusMinutes / (focusGoal || 1));
  const offset1 = c1 * (1 - Math.min(1, p1));

  // Ring 2: Sessions (Middle, Mint Green)
  const r2 = 39;
  const c2 = 2 * Math.PI * r2;
  const p2 = Math.min(1.2, sessionsCompleted / (sessionsGoal || 1));
  const offset2 = c2 * (1 - Math.min(1, p2));

  // Ring 3: Breaks (Inner, Cyan/Blue)
  const r3 = 26;
  const c3 = 2 * Math.PI * r3;
  const p3 = Math.min(1.2, breaksTaken / (breaksGoal || 1));
  const offset3 = c3 * (1 - Math.min(1, p3));

  return (
    <div className="activity-card glass-panel">
      <div className="activity-header">
        <div className="activity-title-group">
          <span className="activity-subtitle">DAILY RINGS</span>
          <h3 className="activity-title">Activity & Flow</h3>
        </div>
        <div className="streak-badge" title="Consecutive active days">
          <Flame size={14} className="streak-icon" />
          <span>{dailyStreak}d streak</span>
        </div>
      </div>

      <div className="activity-content">
        {/* Apple 3 Rings SVG */}
        <div className="rings-svg-wrapper">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rings-svg">
            <defs>
              <linearGradient id="ring-red" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fa114f" />
                <stop offset="100%" stopColor="#ff5252" />
              </linearGradient>
              <linearGradient id="ring-green" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#92e82a" />
                <stop offset="100%" stopColor="#30d158" />
              </linearGradient>
              <linearGradient id="ring-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00d5ff" />
                <stop offset="100%" stopColor="#0a84ff" />
              </linearGradient>
            </defs>

            {/* Background Tracks */}
            <circle cx={center} cy={center} r={r1} stroke="rgba(250, 17, 79, 0.2)" strokeWidth={strokeWidth} fill="none" />
            <circle cx={center} cy={center} r={r2} stroke="rgba(146, 232, 42, 0.2)" strokeWidth={strokeWidth} fill="none" />
            <circle cx={center} cy={center} r={r3} stroke="rgba(0, 213, 255, 0.2)" strokeWidth={strokeWidth} fill="none" />

            {/* Active Rings */}
            <circle
              cx={center}
              cy={center}
              r={r1}
              stroke="url(#ring-red)"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={c1}
              strokeDashoffset={offset1}
              strokeLinecap="round"
              transform={`rotate(-90 ${center} ${center})`}
              className="ring-progress-arc"
            />
            <circle
              cx={center}
              cy={center}
              r={r2}
              stroke="url(#ring-green)"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={c2}
              strokeDashoffset={offset2}
              strokeLinecap="round"
              transform={`rotate(-90 ${center} ${center})`}
              className="ring-progress-arc"
            />
            <circle
              cx={center}
              cy={center}
              r={r3}
              stroke="url(#ring-blue)"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={c3}
              strokeDashoffset={offset3}
              strokeLinecap="round"
              transform={`rotate(-90 ${center} ${center})`}
              className="ring-progress-arc"
            />
          </svg>
        </div>

        {/* Legend stats */}
        <div className="activity-stats-list">
          <div className="stat-row">
            <span className="stat-dot red"></span>
            <div className="stat-meta">
              <span className="stat-label">Focus</span>
              <span className="stat-val tabular-nums">
                <strong>{focusMinutes}</strong> / {focusGoal}m
              </span>
            </div>
          </div>

          <div className="stat-row">
            <span className="stat-dot green"></span>
            <div className="stat-meta">
              <span className="stat-label">Sessions</span>
              <span className="stat-val tabular-nums">
                <strong>{sessionsCompleted}</strong> / {sessionsGoal}
              </span>
            </div>
          </div>

          <div className="stat-row">
            <span className="stat-dot blue"></span>
            <div className="stat-meta">
              <span className="stat-label">Breaks</span>
              <span className="stat-val tabular-nums">
                <strong>{breaksTaken}</strong> / {breaksGoal}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
