import React, { useState, useEffect } from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { playTickSound, triggerHaptic } from '../utils/audio';

const CUTE_QUOTES = {
  focus: [
    'Semangat yaa, kamu pasti bisa! 🌸',
    'Fokus dikit lagi, hebat banget! ✨',
    'Aku temenin kamu belajar di sini~ 🐰',
    'Satu pomodoro lagi yuk! 🍓',
    'Kerja kerasmu hari ini keren banget! 💖',
  ],
  break: [
    'Yayy waktunya santai dulu~ 🧋',
    'Tarik nafas, minum air dulu yaa! 🫧',
    'Peregangan tangan sebentar yuk~ 🍰',
    'Rehat sejenak biar makin fresh! 🍵',
    'Kamu pantas istirahat, relaxx~ ☁️',
  ],
  idle: [
    'Haloo! Klik Start kalau udah siap yaa~ 🍯',
    'Hari ini mau selesaikan apa nih? 🌸',
    'Aku siap nemenin kamu fokus! 🐰',
    'Yuk mulai pelan-pelan tapi pasti~ 🍓',
  ],
};

export function MascotCompanion({ mode, isRunning }) {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [showBubble, setShowBubble] = useState(true);
  const [isBouncing, setIsBouncing] = useState(false);

  const quoteCategory = !isRunning ? 'idle' : mode === 'focus' ? 'focus' : 'break';
  const currentQuotes = CUTE_QUOTES[quoteCategory];

  const handleMascotClick = () => {
    playTickSound(0.25);
    triggerHaptic(15);
    setIsBouncing(true);
    setQuoteIndex((prev) => (prev + 1) % currentQuotes.length);
    setShowBubble(true);
    setTimeout(() => setIsBouncing(false), 500);
  };

  // Rotate quotes periodically
  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % currentQuotes.length);
    }, 12000);
    return () => clearInterval(timer);
  }, [currentQuotes.length]);

  return (
    <div className="mascot-companion-wrapper">
      {/* Speech Bubble */}
      {showBubble && (
        <div className="mascot-speech-bubble glass-panel press-scale" onClick={handleMascotClick}>
          <span className="speech-text">{currentQuotes[quoteIndex % currentQuotes.length]}</span>
          <span className="speech-arrow" />
        </div>
      )}

      {/* SVG Cartoon Mascot: "Pomi" The Bunny Companion */}
      <div
        className={`mascot-avatar ${isBouncing ? 'bounce' : ''} ${isRunning ? 'is-active' : ''}`}
        onClick={handleMascotClick}
        title="Klik Pomi untuk sapaan lucu! 🐰"
        role="button"
        tabIndex={0}
      >
        <svg width="68" height="68" viewBox="0 0 100 100" className="mascot-svg">
          <defs>
            {/* Soft Pastel Gradients */}
            <radialGradient id="bunny-body" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f7eef2" />
            </radialGradient>
            <radialGradient id="ear-pink" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffb6c1" />
              <stop offset="100%" stopColor="#ff9bb0" />
            </radialGradient>
            <radialGradient id="blush-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff8da1" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#ff8da1" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Ears */}
          <g className={`mascot-ears ${isRunning ? 'ears-wiggle' : ''}`}>
            {/* Left Ear */}
            <path
              d="M32 40 C24 16, 28 6, 36 6 C43 6, 42 20, 38 40 Z"
              fill="url(#bunny-body)"
              stroke="#e2cbd6"
              strokeWidth="2"
            />
            <path d="M33 34 C28 20, 31 12, 35 12 C39 12, 38 22, 36 34 Z" fill="url(#ear-pink)" />

            {/* Right Ear */}
            <path
              d="M68 40 C76 16, 72 6, 64 6 C57 6, 58 20, 62 40 Z"
              fill="url(#bunny-body)"
              stroke="#e2cbd6"
              strokeWidth="2"
            />
            <path d="M67 34 C72 20, 69 12, 65 12 C61 12, 62 22, 64 34 Z" fill="url(#ear-pink)" />
          </g>

          {/* Head & Body */}
          <circle cx="50" cy="56" r="32" fill="url(#bunny-body)" stroke="#e2cbd6" strokeWidth="2" />

          {/* Rosy Cheeks */}
          <circle cx="30" cy="62" r="7" fill="url(#blush-gradient)" />
          <circle cx="70" cy="62" r="7" fill="url(#blush-gradient)" />

          {/* Eyes */}
          {isRunning && mode === 'focus' ? (
            // Focused / Determined cute shiny eyes
            <g className="mascot-eyes">
              <ellipse cx="37" cy="54" rx="4.5" ry="6" fill="#4a3038" />
              <circle cx="35.5" cy="52" r="2" fill="#ffffff" />
              <circle cx="38" cy="57" r="1" fill="#ffffff" />

              <ellipse cx="63" cy="54" rx="4.5" ry="6" fill="#4a3038" />
              <circle cx="61.5" cy="52" r="2" fill="#ffffff" />
              <circle cx="64" cy="57" r="1" fill="#ffffff" />
            </g>
          ) : mode !== 'focus' ? (
            // Happy closed resting eyes (^_^)
            <g className="mascot-happy-eyes">
              <path d="M32 54 Q37 48 42 54" stroke="#4a3038" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M58 54 Q63 48 68 54" stroke="#4a3038" strokeWidth="3" strokeLinecap="round" fill="none" />
            </g>
          ) : (
            // Idle friendly eyes
            <g className="mascot-eyes">
              <ellipse cx="37" cy="54" rx="4" ry="5.5" fill="#4a3038" />
              <circle cx="36" cy="52" r="1.8" fill="#ffffff" />

              <ellipse cx="63" cy="54" rx="4" ry="5.5" fill="#4a3038" />
              <circle cx="62" cy="52" r="1.8" fill="#ffffff" />
            </g>
          )}

          {/* Tiny Nose and Mouth */}
          <polygon points="48,60 52,60 50,62" fill="#ff7f99" />
          <path d="M47 62 Q50 65 53 62" stroke="#68424d" strokeWidth="1.8" strokeLinecap="round" fill="none" />

          {/* Accessories by Mode */}
          {isRunning && mode === 'focus' ? (
            // Cute Focus Headphones
            <g className="mascot-headphones">
              <path d="M22 52 C22 28, 78 28, 78 52" fill="none" stroke="#ff7597" strokeWidth="3.5" strokeLinecap="round" />
              <rect x="18" y="47" width="8" height="15" rx="4" fill="#ff537e" />
              <rect x="74" y="47" width="8" height="15" rx="4" fill="#ff537e" />
            </g>
          ) : mode !== 'focus' ? (
            // Cute Boba / Strawberry Drink Cup in paws
            <g className="mascot-drink" transform="translate(42, 68)">
              <rect x="0" y="3" width="16" height="20" rx="3" fill="#ffe3ed" stroke="#ff8da1" strokeWidth="1.5" />
              <line x1="8" y1="-3" x2="8" y2="4" stroke="#ff537e" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="5" cy="18" r="1.8" fill="#ff537e" />
              <circle cx="11" cy="18" r="1.8" fill="#ff537e" />
            </g>
          ) : (
            // Cute flower / star hairpin
            <g transform="translate(64, 34)">
              <circle cx="0" cy="0" r="4.5" fill="#ffd166" />
              <circle cx="-3" cy="-3" r="2" fill="#fff" />
            </g>
          )}

          {/* Cute Paws */}
          <ellipse cx="36" cy="78" rx="6" ry="4" fill="#ffffff" stroke="#e2cbd6" strokeWidth="1.5" />
          <ellipse cx="64" cy="78" rx="6" ry="4" fill="#ffffff" stroke="#e2cbd6" strokeWidth="1.5" />
        </svg>
      </div>
    </div>
  );
}
