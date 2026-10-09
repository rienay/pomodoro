// Web Audio API Procedural Synthesizer for Apple-grade audio & haptics

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Apple-style tactile click sound
 */
export function playTickSound(volume = 0.25) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.015);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2200, ctx.currentTime);

    gain.gain.setValueAtTime(volume * 0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.018);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.02);

    triggerHaptic(12);
  } catch (err) {
    console.warn('Audio tick error', err);
  }
}

/**
 * Apple-style harmonious bell / singing bowl chime on session complete
 */
export function playChimeSound(volume = 0.5) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const chords = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C Major 7 / 9 serene chime
    const now = ctx.currentTime;

    chords.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      const noteStart = now + idx * 0.06;
      const noteDuration = 2.4 - idx * 0.2;

      gain.gain.setValueAtTime(0.0001, noteStart);
      gain.gain.linearRampToValueAtTime(volume * (0.22 - idx * 0.03), noteStart + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + noteDuration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteStart);
      osc.stop(noteStart + noteDuration);
    });

    triggerHaptic([30, 80, 50, 100, 60]);
  } catch (err) {
    console.warn('Audio chime error', err);
  }
}

/**
 * Procedural Ambient Audio Generator (Rain, White Noise, Pink Noise, Stream)
 */
class AmbientSoundEngine {
  constructor() {
    this.source = null;
    this.gainNode = null;
    this.filterNode = null;
    this.lfo = null;
    this.lfoGain = null;
    this.currentType = 'none';
    this.volume = 0.35;
    this.isPlaying = false;
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.gainNode && audioCtx) {
      this.gainNode.gain.cancelScheduledValues(audioCtx.currentTime);
      this.gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, audioCtx.currentTime + 0.1);
    }
  }

  start(type = 'rain') {
    this.stop();
    if (type === 'none') return;

    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const bufferSize = ctx.sampleRate * 4;
      const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
      const left = buffer.getChannelData(0);
      const right = buffer.getChannelData(1);

      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (type === 'pink' || type === 'rain') {
          // Paul Kellet's filtered pink noise algorithm
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          b6 = white * 0.115926;
          left[i] = pink * 0.12;
          right[i] = (pink + (Math.random() * 2 - 1) * 0.08) * 0.12;
        } else {
          // White noise
          left[i] = white * 0.08;
          right[i] = (Math.random() * 2 - 1) * 0.08;
        }
      }

      this.source = ctx.createBufferSource();
      this.source.buffer = buffer;
      this.source.loop = true;

      this.filterNode = ctx.createBiquadFilter();
      if (type === 'rain') {
        this.filterNode.type = 'lowpass';
        this.filterNode.frequency.setValueAtTime(850, ctx.currentTime);
        this.filterNode.Q.setValueAtTime(0.8, ctx.currentTime);

        // LFO for wave/rain intensity variation
        this.lfo = ctx.createOscillator();
        this.lfoGain = ctx.createGain();
        this.lfo.frequency.setValueAtTime(0.2, ctx.currentTime);
        this.lfoGain.gain.setValueAtTime(250, ctx.currentTime);
        this.lfo.connect(this.lfoGain);
        this.lfoGain.connect(this.filterNode.frequency);
        this.lfo.start();
      } else if (type === 'pink') {
        this.filterNode.type = 'lowpass';
        this.filterNode.frequency.setValueAtTime(1200, ctx.currentTime);
      } else {
        this.filterNode.type = 'bandpass';
        this.filterNode.frequency.setValueAtTime(1000, ctx.currentTime);
        this.filterNode.Q.setValueAtTime(0.5, ctx.currentTime);
      }

      this.gainNode = ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
      this.gainNode.gain.linearRampToValueAtTime(this.volume * 0.35, ctx.currentTime + 1.2);

      this.source.connect(this.filterNode);
      this.filterNode.connect(this.gainNode);
      this.gainNode.connect(ctx.destination);

      this.source.start();
      this.isPlaying = true;
      this.currentType = type;
    } catch (e) {
      console.warn('Ambient sound failed to start', e);
    }
  }

  stop() {
    if (this.gainNode && audioCtx) {
      try {
        const now = audioCtx.currentTime;
        this.gainNode.gain.cancelScheduledValues(now);
        this.gainNode.gain.linearRampToValueAtTime(0.0001, now + 0.6);
        setTimeout(() => {
          if (this.source) {
            try { this.source.stop(); } catch (_) {}
            this.source.disconnect();
            this.source = null;
          }
          if (this.lfo) {
            try { this.lfo.stop(); } catch (_) {}
            this.lfo.disconnect();
            this.lfo = null;
          }
        }, 700);
      } catch (_) {
        if (this.source) {
          try { this.source.stop(); } catch (_) {}
          this.source = null;
        }
      }
    } else if (this.source) {
      try { this.source.stop(); } catch (_) {}
      this.source = null;
    }
    this.isPlaying = false;
    this.currentType = 'none';
  }
}

export const ambientEngine = new AmbientSoundEngine();

export function triggerHaptic(pattern = 10) {
  if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch (_) {}
  }
}
