import React, { useRef, useState } from 'react';
import { playTickSound, triggerHaptic } from '../utils/audio';

export function TimerRing({
  timeLeft,
  totalDuration,
  mode,
  isRunning,
  completedCycles,
  targetCycles = 4,
  onScrubTime
}) {
  const svgRef = useRef(null);
  const [isScrubbing, setIsScrubbing] = useState(false);

  const radius = 142;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  
  // Progress ratio (1.0 down to 0)
  const progressRatio = totalDuration > 0 ? Math.max(0, Math.min(1, timeLeft / totalDuration)) : 0;
  const strokeDashoffset = circumference * (1 - progressRatio);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  // Dynamic colors by mode
  const getStrokeGradient = () => {
    switch (mode) {
      case 'shortBreak':
        return ['#30d158', '#34c759'];
      case 'longBreak':
        return ['#40c8e0', '#30b0c7'];
      default:
        return ['#ff453a', '#ff9f0a'];
    }
  };

  const [colorStart, colorEnd] = getStrokeGradient();

  // 1:1 Direct Manipulation pointer drag handler
  const handlePointerDown = (e) => {
    if (isRunning) return; // Only allow scrubbing when paused to prevent fighting timer tick
    setIsScrubbing(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updateTimeFromPointer(e);
    playTickSound(0.2);
  };

  const handlePointerMove = (e) => {
    if (!isScrubbing) return;
    updateTimeFromPointer(e);
  };

  const handlePointerUp = (e) => {
    if (isScrubbing) {
      setIsScrubbing(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (_) {}
      playTickSound(0.25);
    }
  };

  const updateTimeFromPointer = (e) => {
    if (!svgRef.current || !onScrubTime) return;
    const rect = svgRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    // Angle in degrees from top (12 o'clock)
    let angleRad = Math.atan2(dy, dx) + Math.PI / 2;
    if (angleRad < 0) angleRad += 2 * Math.PI;

    // Fraction from 0 to 1
    const frac = angleRad / (2 * Math.PI);
    // Minimum 1 min, maximum totalDuration
    const newSeconds = Math.max(60, Math.round((frac * totalDuration) / 60) * 60);
    onScrubTime(newSeconds);
    triggerHaptic(8);
  };

  // Knob indicator position on ring
  const knobAngle = (1 - progressRatio) * 2 * Math.PI - Math.PI / 2;
  const knobX = 180 + radius * Math.cos(knobAngle);
  const knobY = 180 + radius * Math.sin(knobAngle);

  return (
    <div className="timer-ring-container">
      <svg
        ref={svgRef}
        className={`timer-svg ${isRunning ? 'running' : ''} ${isScrubbing ? 'scrubbing' : ''}`}
        viewBox="0 0 360 360"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <defs>
          <linearGradient id={`gradient-${mode}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colorStart} />
            <stop offset="100%" stopColor={colorEnd} />
          </linearGradient>

          <filter id="apple-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Background Subtle Ring */}
        <circle
          cx="180"
          cy="180"
          r={radius}
          className="ring-track"
          strokeWidth={strokeWidth}
        />

        {/* Ticks around the ring (subtle minute markers) */}
        <g className="ring-dial-ticks">
          {Array.from({ length: 60 }).map((_, i) => {
            const isMajor = i % 5 === 0;
            const angle = (i * 6 * Math.PI) / 180;
            const tickR1 = radius - (isMajor ? 12 : 7);
            const tickR2 = radius - 4;
            const x1 = 180 + tickR1 * Math.sin(angle);
            const y1 = 180 - tickR1 * Math.cos(angle);
            const x2 = 180 + tickR2 * Math.sin(angle);
            const y2 = 180 - tickR2 * Math.cos(angle);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className={isMajor ? 'tick-major' : 'tick-minor'}
              />
            );
          })}
        </g>

        {/* Active Animated Progress Arc */}
        <circle
          cx="180"
          cy="180"
          r={radius}
          className="ring-progress"
          strokeWidth={strokeWidth}
          stroke={`url(#gradient-${mode})`}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 180 180)"
        />

        {/* Glowing Head Knob (Direct manipulation target) */}
        {progressRatio > 0.01 && progressRatio < 0.99 && (
          <g className="scrubber-knob" style={{ transformOrigin: '180px 180px' }}>
            <circle
              cx={knobX}
              cy={knobY}
              r={strokeWidth / 2 + 2}
              fill="#ffffff"
              filter="url(#apple-glow)"
              className="knob-dot"
            />
          </g>
        )}
      </svg>

      {/* Center Clock Display with Proportional Tabular Numbers */}
      <div className="timer-center-content">
        <div className="timer-digits tabular-nums" aria-live="polite">
          <span className="digit-segment">{formattedMinutes}</span>
          <span className={`digit-colon ${isRunning ? 'pulse' : ''}`}>:</span>
          <span className="digit-segment">{formattedSeconds}</span>
        </div>

        {/* Mode subtitle & Scrub hint */}
        <p className="timer-hint">
          {isScrubbing
            ? 'Release to set time'
            : isRunning
            ? (mode === 'focus' ? 'Stay in the zone' : 'Take a calm breath')
            : 'Click or drag ring to adjust'}
        </p>

        {/* Session Cycle Dots (Apple Watch style 4-dots indicator) */}
        <div className="cycle-indicators" title={`Cycle: ${completedCycles % targetCycles} of ${targetCycles}`}>
          {Array.from({ length: targetCycles }).map((_, idx) => {
            const isCompleted = idx < (completedCycles % targetCycles);
            const isCurrent = idx === (completedCycles % targetCycles) && mode === 'focus';
            return (
              <span
                key={idx}
                className={`cycle-dot ${isCompleted ? 'filled' : ''} ${isCurrent ? 'current' : ''}`}
                style={{
                  backgroundColor: isCompleted
                    ? colorStart
                    : isCurrent
                    ? 'var(--color-text-secondary)'
                    : 'var(--color-border)'
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
