import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';
import { playTickSound, triggerHaptic } from '../utils/audio';

export const THEMES = [
  { id: 'pink', name: 'Sakura Pink', emoji: '🌸', color: '#ff8da1', desc: 'Strawberry Milk' },
  { id: 'yellow', name: 'Honey Butter', emoji: '🍯', color: '#f59e0b', desc: 'Warm Sunshine' },
  { id: 'blue', name: 'Cotton Blue', emoji: '🫧', color: '#38bdf8', desc: 'Baby Sky Cloud' },
  { id: 'mint', name: 'Matcha Mochi', emoji: '🍵', color: '#34d399', desc: 'Sweet Sage Tea' },
  { id: 'light', name: 'Apple Frost', emoji: '☁️', color: '#e2e8f0', desc: 'Ceramic White' },
  { id: 'dark', name: 'Midnight', emoji: '🌙', color: '#1e293b', desc: 'Space Graphite' },
];

export function ThemeSelector({ currentTheme, onSelectTheme }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const activeThemeObj = THEMES.find((t) => t.id === currentTheme) || THEMES[0];

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="theme-selector-container" ref={dropdownRef}>
      {/* Trigger Button with Emoji and Active Dot */}
      <button
        type="button"
        className="theme-selector-trigger glass-panel press-scale"
        onClick={() => {
          playTickSound(0.2);
          triggerHaptic(10);
          setIsOpen(!isOpen);
        }}
        title="Pilih Tema Warna Lucu & Gemas"
        aria-label="Pilih Tema Warna"
      >
        <span className="theme-trigger-emoji">{activeThemeObj.emoji}</span>
        <span className="theme-trigger-name">{activeThemeObj.name}</span>
        <span
          className="theme-trigger-swatch"
          style={{ backgroundColor: activeThemeObj.color }}
        />
      </button>

      {/* Cute Palette Dropdown */}
      {isOpen && (
        <div className="theme-palette-menu glass-panel" role="menu">
          <div className="palette-header">
            <span className="palette-title">TEMA PASTEL & LUCU 🎀</span>
          </div>

          <div className="palette-grid">
            {THEMES.map((theme) => {
              const isActive = currentTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  className={`theme-option-card press-scale ${isActive ? 'is-active' : ''}`}
                  onClick={() => {
                    playTickSound(0.25);
                    triggerHaptic(15);
                    onSelectTheme(theme.id);
                    setIsOpen(false);
                  }}
                >
                  <div className="option-swatch-circle" style={{ backgroundColor: theme.color }}>
                    <span className="option-emoji">{theme.emoji}</span>
                  </div>
                  <div className="option-text-group">
                    <span className="option-title">{theme.name}</span>
                    <span className="option-subtitle">{theme.desc}</span>
                  </div>
                  {isActive && <Check size={14} className="option-check-icon" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
