import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { playTickSound } from '../utils/audio';

const MODES = [
  { id: 'focus', label: 'Focus' },
  { id: 'shortBreak', label: 'Short Break' },
  { id: 'longBreak', label: 'Long Break' },
];

export function ModePill({ currentMode, onSelectMode }) {
  const tabsRef = useRef({});
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 4, width: 0, opacity: 0 });

  const updateIndicator = () => {
    const activeEl = tabsRef.current[currentMode];
    if (activeEl) {
      setIndicatorStyle({
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
        opacity: 1,
      });
    }
  };

  useLayoutEffect(() => {
    updateIndicator();
  }, [currentMode]);

  useEffect(() => {
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [currentMode]);

  return (
    <div className="mode-segmented-control glass-panel" role="tablist">
      {/* Pixel-perfect sliding pill indicator aligned directly with DOM element */}
      <div
        className="segmented-indicator"
        style={{
          transform: `translateX(${indicatorStyle.left}px)`,
          width: `${indicatorStyle.width}px`,
          opacity: indicatorStyle.opacity,
        }}
      />

      {MODES.map((mode) => {
        const isActive = mode.id === currentMode;
        return (
          <button
            key={mode.id}
            ref={(el) => { tabsRef.current[mode.id] = el; }}
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
