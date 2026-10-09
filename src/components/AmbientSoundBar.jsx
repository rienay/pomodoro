import React from 'react';
import { CloudRain, Radio, Wind, Volume2, VolumeX } from 'lucide-react';
import { playTickSound, ambientEngine } from '../utils/audio';

const SOUNDS = [
  { id: 'none', label: 'Off', icon: VolumeX },
  { id: 'rain', label: 'Rain', icon: CloudRain },
  { id: 'pink', label: 'Pink Noise', icon: Radio },
  { id: 'white', label: 'White Noise', icon: Wind },
];

export function AmbientSoundBar({
  ambientType,
  volume,
  onSelectAmbient,
  onChangeVolume
}) {
  return (
    <div className="ambient-bar glass-panel">
      <div className="ambient-header">
        <div className="ambient-meta">
          <span className="ambient-subtitle">BACKGROUND AUDIO</span>
          <h4 className="ambient-title">Ambient Soundscapes</h4>
        </div>
        {ambientType !== 'none' && (
          <div className="ambient-active-indicator">
            <span className="ambient-wave bar-1"></span>
            <span className="ambient-wave bar-2"></span>
            <span className="ambient-wave bar-3"></span>
          </div>
        )}
      </div>

      {/* Sound Pills */}
      <div className="sound-chips-row">
        {SOUNDS.map((sound) => {
          const Icon = sound.icon;
          const isActive = ambientType === sound.id;
          return (
            <button
              key={sound.id}
              type="button"
              className={`sound-chip press-scale ${isActive ? 'active' : ''}`}
              onClick={() => {
                playTickSound(0.2);
                onSelectAmbient(sound.id);
              }}
            >
              <Icon size={14} />
              <span>{sound.label}</span>
            </button>
          );
        })}
      </div>

      {/* Volume Slider if playing */}
      {ambientType !== 'none' && (
        <div className="ambient-volume-row">
          <Volume2 size={14} className="vol-icon" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              onChangeVolume(val);
              ambientEngine.setVolume(val);
            }}
            className="apple-slider"
            aria-label="Ambient volume"
          />
          <span className="vol-pct tabular-nums">{Math.round(volume * 100)}%</span>
        </div>
      )}
    </div>
  );
}
