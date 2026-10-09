import React from 'react';
import { playTickSound } from '../utils/audio';

const MODES = [
  { id: 'focus', label: 'Focus' },
  { id: 'shortBreak', label: 'Short Break' },
  { id: 'longBreak', label: 'Long Break' },
];

export function ModePill({ currentMode, onSelectMode }) {
  const activeIndex = MODES.findIndex(m => m.id === currentMode);

  return (
    <div className="mode-segmented-control glass-panel" role="tablist">
      {/* Sliding pill indicator */}
      <div
        className="segmented-indicator"
        style={{
          width: `calc(${100 / MODES.length}% - 6px)`,
          transform: `translateX(calc(${activeIndex * 100}% + ${activeIndex * 6}px))`,
        }}
      />

      {MODES.map((mode) => {
        const isActive = mode.id === currentMode;
        return (
          <button
            key={mode.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`segmented-tab press-scale ${isActive ? 'active' : ''}`}
            onClick={() => {
              playTickSound(0.2);
              onSelectMode(mode.id);
            }}
          >
            {mode.label}
          </button>
        );
      })}
    </div>
  );
}
