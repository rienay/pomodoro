import React from 'react';
import { X, Bell, RotateCcw, Volume2, Moon, Sun, Monitor } from 'lucide-react';
import { playTickSound, playChimeSound } from '../utils/audio';

export function SettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetSettings
}) {
  if (!isOpen) return null;

  const handleChange = (key, value) => {
    onUpdateSettings({ ...settings, [key]: value });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-sheet glass-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-heading"
      >
        {/* Sheet Top Bar */}
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-subtitle">PREFERENCES</span>
            <h3 id="settings-heading" className="modal-title">Timer Settings</h3>
          </div>
          <button
            type="button"
            className="modal-close-btn press-scale"
            onClick={() => {
              playTickSound(0.2);
              onClose();
            }}
            aria-label="Close Settings"
          >
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          {/* Section: Durations */}
          <div className="settings-section">
            <span className="section-header-label">DURATIONS (MINUTES)</span>

            <div className="setting-row">
              <div className="setting-info">
                <span className="setting-label">Deep Focus</span>
                <span className="setting-desc">Standard focus interval</span>
              </div>
              <div className="setting-stepper">
                <button
                  type="button"
                  className="step-btn press-scale"
                  onClick={() => handleChange('focusDuration', Math.max(1, settings.focusDuration - 5))}
                >
                  -
                </button>
                <span className="step-val tabular-nums">{settings.focusDuration}m</span>
                <button
                  type="button"
                  className="step-btn press-scale"
                  onClick={() => handleChange('focusDuration', Math.min(120, settings.focusDuration + 5))}
                >
                  +
                </button>
              </div>
            </div>

            <div className="setting-row">
              <div className="setting-info">
                <span className="setting-label">Short Break</span>
                <span className="setting-desc">Rest after each focus cycle</span>
              </div>
              <div className="setting-stepper">
                <button
                  type="button"
                  className="step-btn press-scale"
                  onClick={() => handleChange('shortBreakDuration', Math.max(1, settings.shortBreakDuration - 1))}
                >
                  -
                </button>
                <span className="step-val tabular-nums">{settings.shortBreakDuration}m</span>
                <button
                  type="button"
                  className="step-btn press-scale"
                  onClick={() => handleChange('shortBreakDuration', Math.min(45, settings.shortBreakDuration + 1))}
                >
                  +
                </button>
              </div>
            </div>

            <div className="setting-row">
              <div className="setting-info">
                <span className="setting-label">Long Break</span>
                <span className="setting-desc">Rest after target cycles</span>
              </div>
              <div className="setting-stepper">
                <button
                  type="button"
                  className="step-btn press-scale"
                  onClick={() => handleChange('longBreakDuration', Math.max(1, settings.longBreakDuration - 5))}
                >
                  -
                </button>
                <span className="step-val tabular-nums">{settings.longBreakDuration}m</span>
                <button
                  type="button"
                  className="step-btn press-scale"
                  onClick={() => handleChange('longBreakDuration', Math.min(60, settings.longBreakDuration + 5))}
                >
                  +
                </button>
              </div>
            </div>

            <div className="setting-row">
              <div className="setting-info">
                <span className="setting-label">Long Break Interval</span>
                <span className="setting-desc">Pomodoro cycles before long break</span>
              </div>
              <div className="setting-stepper">
                <button
                  type="button"
                  className="step-btn press-scale"
                  onClick={() => handleChange('longBreakInterval', Math.max(2, settings.longBreakInterval - 1))}
                >
                  -
                </button>
                <span className="step-val tabular-nums">{settings.longBreakInterval}</span>
                <button
                  type="button"
                  className="step-btn press-scale"
                  onClick={() => handleChange('longBreakInterval', Math.min(10, settings.longBreakInterval + 1))}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Section: Automation */}
          <div className="settings-section">
            <span className="section-header-label">AUTOMATION & FLOW</span>

            <div className="setting-row">
              <div className="setting-info">
                <span className="setting-label">Auto-start Breaks</span>
                <span className="setting-desc">Immediately begin break on focus end</span>
              </div>
              <label className="apple-switch">
                <input
                  type="checkbox"
                  checked={settings.autoStartBreaks}
                  onChange={(e) => {
                    playTickSound(0.2);
                    handleChange('autoStartBreaks', e.target.checked);
                  }}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="setting-row">
              <div className="setting-info">
                <span className="setting-label">Auto-start Pomodoros</span>
                <span className="setting-desc">Immediately begin focus on break end</span>
              </div>
              <label className="apple-switch">
                <input
                  type="checkbox"
                  checked={settings.autoStartPomodoros}
                  onChange={(e) => {
                    playTickSound(0.2);
                    handleChange('autoStartPomodoros', e.target.checked);
                  }}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>

          {/* Section: Sound & Haptics */}
          <div className="settings-section">
            <span className="section-header-label">AUDIO & NOTIFICATIONS</span>

            <div className="setting-row">
              <div className="setting-info">
                <span className="setting-label">Sound Effects</span>
                <span className="setting-desc">Apple chime and tactile clicks</span>
              </div>
              <div className="sound-preview-group">
                <button
                  type="button"
                  className="chime-test-btn press-scale"
                  onClick={() => playChimeSound(0.6)}
                  title="Test Apple Chime Sound"
                >
                  <Bell size={13} />
                  <span>Test Chime</span>
                </button>
                <label className="apple-switch">
                  <input
                    type="checkbox"
                    checked={settings.soundEnabled}
                    onChange={(e) => {
                      playTickSound(0.2);
                      handleChange('soundEnabled', e.target.checked);
                    }}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Section: Theme */}
          <div className="settings-section">
            <span className="section-header-label">APPEARANCE</span>
            <div className="theme-toggle-group">
              {[
                { id: 'system', label: 'Auto', icon: Monitor },
                { id: 'light', label: 'Light', icon: Sun },
                { id: 'dark', label: 'Dark', icon: Moon },
              ].map(item => {
                const Icon = item.icon;
                const isActive = settings.theme === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`theme-btn press-scale ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      playTickSound(0.2);
                      handleChange('theme', item.id);
                    }}
                  >
                    <Icon size={14} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button
            type="button"
            className="reset-defaults-btn press-scale"
            onClick={() => {
              playTickSound(0.2);
              onResetSettings();
            }}
          >
            <RotateCcw size={13} />
            <span>Reset Defaults</span>
          </button>
          <button
            type="button"
            className="modal-done-btn press-scale"
            onClick={() => {
              playTickSound(0.3);
              onClose();
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
