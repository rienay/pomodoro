import React, { useMemo } from 'react';

/**
 * AmbientFloaters: Floating butterflies, sakura petals, bubbles, clovers, or starlight
 * depending on the active theme, rendered as subtle, fluid, GPU-accelerated elements.
 */
export function AmbientFloaters({ theme }) {
  // Elements configuration per theme
  const floaters = useMemo(() => {
    switch (theme) {
      case 'pink':
        return [
          { type: 'sakura', icon: '🌸', size: 22, duration: 9, delay: 0, left: 12, drift: 45 },
          { type: 'petal', icon: '💮', size: 16, duration: 11, delay: 2, left: 28, drift: -35 },
          { type: 'berry', icon: '🍓', size: 18, duration: 13, delay: 4, left: 45, drift: 25 },
          { type: 'sakura', icon: '🌸', size: 20, duration: 8.5, delay: 1.5, left: 62, drift: -40 },
          { type: 'sparkle', icon: '✨', size: 15, duration: 10, delay: 5, left: 78, drift: 30 },
          { type: 'petal', icon: '🌸', size: 17, duration: 12, delay: 3, left: 90, drift: -20 },
        ];
      case 'yellow':
        return [
          { type: 'butterfly', icon: '🦋', size: 22, duration: 8, delay: 0, left: 15, drift: 60 },
          { type: 'daisy', icon: '🌼', size: 20, duration: 10, delay: 2.5, left: 32, drift: -30 },
          { type: 'honey', icon: '🍯', size: 17, duration: 12, delay: 4, left: 52, drift: 35 },
          { type: 'sparkle', icon: '✨', size: 16, duration: 9, delay: 1, left: 70, drift: -45 },
          { type: 'butterfly', icon: '🦋', size: 20, duration: 11, delay: 3, left: 85, drift: 50 },
        ];
      case 'blue':
        return [
          { type: 'bubble', icon: '🫧', size: 24, duration: 8.5, delay: 0, left: 14, drift: 25, floatUp: true },
          { type: 'cloud', icon: '☁️', size: 20, duration: 12, delay: 2, left: 30, drift: -30, floatUp: true },
          { type: 'bubble', icon: '🫧', size: 18, duration: 7, delay: 4, left: 48, drift: 20, floatUp: true },
          { type: 'star', icon: '⭐️', size: 16, duration: 10, delay: 1.5, left: 68, drift: -25, floatUp: true },
          { type: 'bubble', icon: '🫧', size: 22, duration: 9, delay: 3.5, left: 86, drift: 35, floatUp: true },
        ];
      case 'mint':
        return [
          { type: 'clover', icon: '🍀', size: 20, duration: 9.5, delay: 0, left: 16, drift: 30 },
          { type: 'leaf', icon: '🍃', size: 22, duration: 11, delay: 2, left: 35, drift: -40 },
          { type: 'tea', icon: '🍵', size: 18, duration: 12.5, delay: 4.5, left: 55, drift: 25 },
          { type: 'leaf', icon: '🍃', size: 19, duration: 9, delay: 1, left: 74, drift: -30 },
          { type: 'clover', icon: '🍀', size: 18, duration: 10.5, delay: 3, left: 88, drift: 35 },
        ];
      case 'dark':
        return [
          { type: 'star', icon: '✨', size: 16, duration: 7, delay: 0, left: 15, drift: 15 },
          { type: 'moon', icon: '🌙', size: 18, duration: 11, delay: 2, left: 38, drift: -20 },
          { type: 'star', icon: '⭐️', size: 14, duration: 8, delay: 4, left: 60, drift: 25 },
          { type: 'sparkle', icon: '✨', size: 17, duration: 9.5, delay: 1.5, left: 82, drift: -15 },
        ];
      default: // light
        return [
          { type: 'sparkle', icon: '✨', size: 16, duration: 9, delay: 0, left: 20, drift: 25 },
          { type: 'cloud', icon: '☁️', size: 18, duration: 12, delay: 3, left: 50, drift: -20 },
          { type: 'sparkle', icon: '✨', size: 15, duration: 10, delay: 1.5, left: 80, drift: 30 },
        ];
    }
  }, [theme]);

  return (
    <div className="ambient-floaters-container" aria-hidden="true">
      {floaters.map((item, idx) => (
        <span
          key={`${theme}-${idx}`}
          className={`floater-item ${item.floatUp ? 'float-up' : 'float-down'} type-${item.type}`}
          style={{
            left: `${item.left}%`,
            fontSize: `${item.size}px`,
            animationDuration: `${item.duration}s`,
            animationDelay: `${item.delay}s`,
            '--drift-x': `${item.drift}px`,
          }}
        >
          {item.icon}
        </span>
      ))}
    </div>
  );
}
