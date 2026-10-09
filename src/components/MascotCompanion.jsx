import React, { useState, useEffect } from 'react';
import { playTickSound, triggerHaptic } from '../utils/audio';

// Mascot profiles per theme
const MASCOT_PROFILES = {
  pink: {
    name: 'Pomi the Bunny',
    emoji: '🐰',
    quotes: {
      focus: [
        'Semangat yaa, kamu pasti bisa! 🌸',
        'Fokus dikit lagi, hebat banget! ✨',
        'Pomi nemenin kamu belajar di sini~ 🐰',
        'Satu pomodoro lagi yuk! 🍓',
        'Kerja kerasmu hari ini manis banget! 💖',
      ],
      break: [
        'Yayy waktunya santai dulu~ 🧋',
        'Tarik nafas, minum air dulu yaa! 🍓',
        'Peregangan tangan sebentar yuk~ 🍰',
        'Rehat sejenak biar makin fresh! 🌸',
        'Kamu pantas istirahat, relaxx~ ☁️',
      ],
      idle: [
        'Haloo! Klik Start kalau udah siap yaa~ 🍓',
        'Hari ini mau selesaikan apa nih? 🌸',
        'Pomi siap nemenin kamu fokus! 🐰',
      ],
    },
  },
  yellow: {
    name: 'Kuma the Honey Bear',
    emoji: '🐻',
    quotes: {
      focus: [
        'Kuma siap kawal fokusmu hari ini! 🍯',
        'Wah kamu rajin banget, keren! 🌻',
        'Sedikit lagi, semangatt terus yaa! 🥞',
        'Ayo selesaikan task hari ini bareng Kuma! 🐝',
      ],
      break: [
        'Waktunya nyemil madu & istirahat~ 🍯',
        'Santai dulu, jangan lupa renggangkan badan! 🌼',
        'Minum teh hangat dulu yuk biar tenang~ 🥞',
        'Good job sesi tadi! Istirahat dulu yaa! 🌻',
      ],
      idle: [
        'Haloo kawan! Siap menaklukkan hari? 🍯',
        'Hari yang cerah buat belajar produktif! ☀️',
        'Kuma udah siapin toples madu nih! 🐝',
      ],
    },
  },
  blue: {
    name: 'Mochi the Sky Kitten',
    emoji: '🐱',
    quotes: {
      focus: [
        'Meow~ Fokus tenang seperti langit biru~ 🫧',
        'Mochi nemenin kamu di atas awan~ ☁️',
        'Pikiran jernih, aliran fokus maksimal! 🫐',
        'Satu demi satu beres dengan tenang~ ✨',
      ],
      break: [
        'Meoww~ Waktunya rebahan di awan empuk~ ☁️',
        'Tarik nafas sedalam awan biru~ 🫧',
        'Minum air dingin dulu yaa biar segar! 🫐',
        'Santai sejenak, regangkan jemarimu~ 🐾',
      ],
      idle: [
        'Meow! Siap terbang ke flow state? ☁️',
        'Langit cerah, pikiran damai siap belajar~ 🫧',
        'Mochi udah siap nemenin kamu nih! 🐾',
      ],
    },
  },
  mint: {
    name: 'Kero the Matcha Froggy',
    emoji: '🐸',
    quotes: {
      focus: [
        'Ribbit! Satu langkah demi satu langkah~ 🍵',
        'Fokus tenang, rasanya damai banget ya~ 🍃',
        'Kero percaya kamu pasti bisa! 🍀',
        'Hening dan fokus seperti kolam teratai~ 🐸',
      ],
      break: [
        'Waktunya minum matcha hangat dulu yuk~ 🍵',
        'Rehat di bawah daun teratai yang teduh~ 🍃',
        'Tarik nafas aroma mint segar~ 🍀',
        'Badan rileks, pikiran kembali segar! 🌸',
      ],
      idle: [
        'Ribbit! Udah siap mulai sesi fokus? 🍵',
        'Hari yang tenang buat menyelesaikan impian! 🍃',
        'Kero selalu dukung kamu 100%! 🐸',
      ],
    },
  },
  dark: {
    name: 'Luna the Midnight Cat',
    emoji: '🐈‍⬛',
    quotes: {
      focus: [
        'Malam hening, konsentrasi penuh~ 🌙',
        'Bintang-bintang mendukung langkahmu! ✨',
        'Fokus tajam di keheningan malam~ ⭐️',
        'Setiap detik membawa kemajuan besar! 🌌',
      ],
      break: [
        'Waktunya memandang bintang sejenak~ ⭐️',
        'Tarik nafas dalam-dalam, rilekskan mata~ 🌙',
        'Malam masih panjang, istirahat secukupnya~ ☕️',
      ],
      idle: [
        'Selamat malam! Siap sesi deep focus? 🌙',
        'Keheningan malam adalah kawan terbaik~ ✨',
      ],
    },
  },
  light: {
    name: 'Pippin the Arctic Fox',
    emoji: '🦊',
    quotes: {
      focus: [
        'Pikiran jernih, hasil maksimal! ☁️',
        'Desain rapi, fokus presisi tinggi! ',
        'Ketenangan membawa produktivitas terbaik~ ✨',
      ],
      break: [
        'Rehat sejenak, pandang kejauhan~ ❄️',
        'Istirahat teratur kunci konsistensi prima! ☕️',
      ],
      idle: [
        'Pippin siap menemani sesi kerjamu! 🦊',
        'Mulai dengan niat baik dan fokus jernih~ ☁️',
      ],
    },
  },
};

export function MascotCompanion({ mode, isRunning, theme = 'pink' }) {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [showBubble, setShowBubble] = useState(true);
  const [isBouncing, setIsBouncing] = useState(false);

  const activeThemeKey = MASCOT_PROFILES[theme] ? theme : 'pink';
  const profile = MASCOT_PROFILES[activeThemeKey];

  const quoteCategory = !isRunning ? 'idle' : mode === 'focus' ? 'focus' : 'break';
  const currentQuotes = profile.quotes[quoteCategory] || profile.quotes.focus;

  const handleMascotClick = () => {
    playTickSound(0.25);
    triggerHaptic(15);
    setIsBouncing(true);
    setQuoteIndex((prev) => (prev + 1) % currentQuotes.length);
    setShowBubble(true);
    setTimeout(() => setIsBouncing(false), 500);
  };

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

      {/* Mascot Avatar Container */}
      <div
        className={`mascot-avatar ${isBouncing ? 'bounce' : ''} ${isRunning ? 'is-active' : ''}`}
        onClick={handleMascotClick}
        title={`Sapa ${profile.name}! Klik untuk ngobrol ✨`}
        role="button"
        tabIndex={0}
      >
        <svg width="68" height="68" viewBox="0 0 100 100" className="mascot-svg">
          {/* Render Theme Specific Mascot */}
          {activeThemeKey === 'pink' && renderBunnyPomi(isRunning, mode)}
          {activeThemeKey === 'yellow' && renderBearKuma(isRunning, mode)}
          {activeThemeKey === 'blue' && renderKittenMochi(isRunning, mode)}
          {activeThemeKey === 'mint' && renderFrogKero(isRunning, mode)}
          {activeThemeKey === 'dark' && renderMidnightLuna(isRunning, mode)}
          {activeThemeKey === 'light' && renderArcticPippin(isRunning, mode)}
        </svg>
      </div>

      <span className="mascot-name-badge">
        {profile.emoji} {profile.name}
      </span>
    </div>
  );
}

/* ==========================================
   🐰 1. SAKURA PINK: POMI THE BUNNY
   ========================================== */
function renderBunnyPomi(isRunning, mode) {
  return (
    <g>
      <defs>
        <radialGradient id="pomi-body" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#fcedf2" />
        </radialGradient>
        <radialGradient id="pomi-ear" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb0c5" />
          <stop offset="100%" stopColor="#ff9bb0" />
        </radialGradient>
      </defs>

      {/* Ears */}
      <g className={isRunning ? 'ears-wiggle' : ''}>
        <path d="M32 40 C24 16, 28 6, 36 6 C43 6, 42 20, 38 40 Z" fill="url(#pomi-body)" stroke="#e4c7d3" strokeWidth="2" />
        <path d="M33 34 C28 20, 31 12, 35 12 C39 12, 38 22, 36 34 Z" fill="url(#pomi-ear)" />

        <path d="M68 40 C76 16, 72 6, 64 6 C57 6, 58 20, 62 40 Z" fill="url(#pomi-body)" stroke="#e4c7d3" strokeWidth="2" />
        <path d="M67 34 C72 20, 69 12, 65 12 C61 12, 62 22, 64 34 Z" fill="url(#pomi-ear)" />
      </g>

      {/* Head */}
      <circle cx="50" cy="56" r="32" fill="url(#pomi-body)" stroke="#e4c7d3" strokeWidth="2" />
      {/* Cheeks */}
      <circle cx="28" cy="62" r="6" fill="#ff7f99" opacity="0.45" />
      <circle cx="72" cy="62" r="6" fill="#ff7f99" opacity="0.45" />

      {/* Eyes */}
      {isRunning && mode === 'focus' ? (
        <g>
          <ellipse cx="37" cy="54" rx="4.5" ry="6" fill="#4a2e38" />
          <circle cx="35.5" cy="52" r="2" fill="#fff" />
          <ellipse cx="63" cy="54" rx="4.5" ry="6" fill="#4a2e38" />
          <circle cx="61.5" cy="52" r="2" fill="#fff" />
        </g>
      ) : mode !== 'focus' ? (
        <g>
          <path d="M32 54 Q37 48 42 54" stroke="#4a2e38" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M58 54 Q63 48 68 54" stroke="#4a2e38" strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>
      ) : (
        <g>
          <ellipse cx="37" cy="54" rx="4" ry="5.5" fill="#4a2e38" />
          <circle cx="36" cy="52" r="1.8" fill="#fff" />
          <ellipse cx="63" cy="54" rx="4" ry="5.5" fill="#4a2e38" />
          <circle cx="62" cy="52" r="1.8" fill="#fff" />
        </g>
      )}

      {/* Nose & Mouth */}
      <polygon points="48,60 52,60 50,62" fill="#ff6584" />
      <path d="M47 62 Q50 65 53 62" stroke="#68424d" strokeWidth="1.8" strokeLinecap="round" fill="none" />

      {/* Accessory */}
      {isRunning && mode === 'focus' ? (
        <g>
          <path d="M22 52 C22 28, 78 28, 78 52" fill="none" stroke="#ff7597" strokeWidth="3.5" strokeLinecap="round" />
          <rect x="18" y="47" width="8" height="15" rx="4" fill="#ff537e" />
          <rect x="74" y="47" width="8" height="15" rx="4" fill="#ff537e" />
        </g>
      ) : mode !== 'focus' ? (
        <g transform="translate(42, 68)">
          <rect x="0" y="3" width="16" height="20" rx="3" fill="#ffe3ed" stroke="#ff8da1" strokeWidth="1.5" />
          <line x1="8" y1="-3" x2="8" y2="4" stroke="#ff537e" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="5" cy="18" r="1.8" fill="#ff537e" />
          <circle cx="11" cy="18" r="1.8" fill="#ff537e" />
        </g>
      ) : (
        <circle cx="66" cy="34" r="5" fill="#ffd166" />
      )}

      {/* Paws */}
      <ellipse cx="36" cy="78" rx="6" ry="4" fill="#ffffff" stroke="#e4c7d3" strokeWidth="1.5" />
      <ellipse cx="64" cy="78" rx="6" ry="4" fill="#ffffff" stroke="#e4c7d3" strokeWidth="1.5" />
    </g>
  );
}

/* ==========================================
   🍯 2. HONEY BUTTER: KUMA THE HONEY BEAR
   ========================================== */
function renderBearKuma(isRunning, mode) {
  return (
    <g>
      <defs>
        <radialGradient id="kuma-body" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fde092" />
          <stop offset="100%" stopColor="#f5be4f" />
        </radialGradient>
      </defs>

      {/* Round Bear Ears */}
      <circle cx="28" cy="32" r="13" fill="url(#kuma-body)" stroke="#dca238" strokeWidth="2" />
      <circle cx="28" cy="32" r="7" fill="#fef08a" />
      <circle cx="72" cy="32" r="13" fill="url(#kuma-body)" stroke="#dca238" strokeWidth="2" />
      <circle cx="72" cy="32" r="7" fill="#fef08a" />

      {/* Head */}
      <circle cx="50" cy="56" r="32" fill="url(#kuma-body)" stroke="#dca238" strokeWidth="2" />

      {/* Muzzle */}
      <ellipse cx="50" cy="62" rx="14" ry="10" fill="#fef9c3" />
      <ellipse cx="50" cy="58" rx="5" ry="3.5" fill="#583110" />
      <path d="M47 62 Q50 65 53 62" stroke="#583110" strokeWidth="1.8" strokeLinecap="round" fill="none" />

      {/* Cheeks */}
      <circle cx="26" cy="60" r="5" fill="#f97316" opacity="0.35" />
      <circle cx="74" cy="60" r="5" fill="#f97316" opacity="0.35" />

      {/* Eyes */}
      {isRunning && mode === 'focus' ? (
        <g>
          {/* Nerd Glasses */}
          <circle cx="37" cy="51" r="9" fill="none" stroke="#78350f" strokeWidth="2" />
          <circle cx="63" cy="51" r="9" fill="none" stroke="#78350f" strokeWidth="2" />
          <line x1="46" y1="51" x2="54" y2="51" stroke="#78350f" strokeWidth="2" />
          <circle cx="37" cy="51" r="3" fill="#583110" />
          <circle cx="63" cy="51" r="3" fill="#583110" />
        </g>
      ) : mode !== 'focus' ? (
        <g>
          <path d="M32 50 Q37 45 42 50" stroke="#583110" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M58 50 Q63 45 68 50" stroke="#583110" strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>
      ) : (
        <g>
          <circle cx="37" cy="50" r="3.8" fill="#583110" />
          <circle cx="35.5" cy="48.5" r="1.5" fill="#fff" />
          <circle cx="63" cy="50" r="3.8" fill="#583110" />
          <circle cx="61.5" cy="48.5" r="1.5" fill="#fff" />
        </g>
      )}

      {/* Accessory: Honey Pot when break */}
      {mode !== 'focus' && (
        <g transform="translate(42, 68)">
          <path d="M2 5 Q8 3 14 5 L13 20 Q8 22 3 20 Z" fill="#d97706" />
          <ellipse cx="8" cy="5" rx="6" ry="2" fill="#fde047" />
          <text x="8" y="15" fontSize="7" fontWeight="bold" fill="#ffffff" textAnchor="middle">HONEY</text>
        </g>
      )}

      {/* Paws */}
      <circle cx="34" cy="78" r="6" fill="#fde092" stroke="#dca238" strokeWidth="1.5" />
      <circle cx="66" cy="78" r="6" fill="#fde092" stroke="#dca238" strokeWidth="1.5" />
    </g>
  );
}

/* ==========================================
   🫧 3. COTTON BLUE: MOCHI THE SKY KITTEN
   ========================================== */
function renderKittenMochi(isRunning, mode) {
  return (
    <g>
      <defs>
        <radialGradient id="mochi-body" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e0f2fe" />
        </radialGradient>
      </defs>

      {/* Pointed Cat Ears */}
      <polygon points="24,42 20,20 40,32" fill="url(#mochi-body)" stroke="#bae6fd" strokeWidth="2" />
      <polygon points="26,38 23,24 37,32" fill="#7dd3fc" opacity="0.6" />

      <polygon points="76,42 80,20 60,32" fill="url(#mochi-body)" stroke="#bae6fd" strokeWidth="2" />
      <polygon points="74,38 77,24 63,32" fill="#7dd3fc" opacity="0.6" />

      {/* Head */}
      <circle cx="50" cy="56" r="32" fill="url(#mochi-body)" stroke="#bae6fd" strokeWidth="2" />

      {/* Cheeks */}
      <circle cx="28" cy="62" r="5.5" fill="#38bdf8" opacity="0.3" />
      <circle cx="72" cy="62" r="5.5" fill="#38bdf8" opacity="0.3" />

      {/* Whiskers */}
      <line x1="20" y1="58" x2="30" y2="60" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="19" y1="64" x2="29" y2="63" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="80" y1="58" x2="70" y2="60" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="81" y1="64" x2="71" y2="63" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />

      {/* Eyes */}
      {isRunning && mode === 'focus' ? (
        <g>
          <ellipse cx="37" cy="52" rx="4.5" ry="5.5" fill="#0369a1" />
          <circle cx="35" cy="50" r="1.8" fill="#fff" />
          <ellipse cx="63" cy="52" rx="4.5" ry="5.5" fill="#0369a1" />
          <circle cx="61" cy="50" r="1.8" fill="#fff" />
        </g>
      ) : mode !== 'focus' ? (
        <g>
          <path d="M32 52 Q37 46 42 52" stroke="#0369a1" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M58 52 Q63 46 68 52" stroke="#0369a1" strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>
      ) : (
        <g>
          <ellipse cx="37" cy="52" rx="4" ry="5" fill="#0369a1" />
          <circle cx="35.5" cy="50" r="1.5" fill="#fff" />
          <ellipse cx="63" cy="52" rx="4" ry="5" fill="#0369a1" />
          <circle cx="61.5" cy="50" r="1.5" fill="#fff" />
        </g>
      )}

      {/* Nose & Mouth */}
      <polygon points="48,58 52,58 50,60" fill="#38bdf8" />
      <path d="M46 61 Q50 64 54 61" stroke="#0369a1" strokeWidth="1.8" strokeLinecap="round" fill="none" />

      {/* Headphones during focus */}
      {isRunning && mode === 'focus' && (
        <g>
          <path d="M22 50 C22 28, 78 28, 78 50" fill="none" stroke="#0284c7" strokeWidth="3.5" strokeLinecap="round" />
          <rect x="18" y="44" width="8" height="15" rx="4" fill="#0284c7" />
          <rect x="74" y="44" width="8" height="15" rx="4" fill="#0284c7" />
          <text x="50" y="32" fontSize="9" fill="#0284c7" textAnchor="middle">⭐️</text>
        </g>
      )}

      {/* Paws */}
      <ellipse cx="35" cy="78" rx="6" ry="4" fill="#ffffff" stroke="#bae6fd" strokeWidth="1.5" />
      <ellipse cx="65" cy="78" rx="6" ry="4" fill="#ffffff" stroke="#bae6fd" strokeWidth="1.5" />
    </g>
  );
}

/* ==========================================
   🍵 4. MATCHA MOCHI: KERO THE MATCHA FROGGY
   ========================================== */
function renderFrogKero(isRunning, mode) {
  return (
    <g>
      <defs>
        <radialGradient id="kero-body" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#bbf7d0" />
          <stop offset="100%" stopColor="#86efac" />
        </radialGradient>
      </defs>

      {/* Big Frog Eye Bulges */}
      <circle cx="32" cy="34" r="14" fill="url(#kero-body)" stroke="#4ade80" strokeWidth="2" />
      <circle cx="68" cy="34" r="14" fill="url(#kero-body)" stroke="#4ade80" strokeWidth="2" />

      {/* Big Frog Eyes */}
      <circle cx="32" cy="34" r="7" fill="#14532d" />
      <circle cx="30" cy="32" r="2.8" fill="#ffffff" />
      <circle cx="68" cy="34" r="7" fill="#14532d" />
      <circle cx="66" cy="32" r="2.8" fill="#ffffff" />

      {/* Head & Body */}
      <ellipse cx="50" cy="58" rx="34" ry="28" fill="url(#kero-body)" stroke="#4ade80" strokeWidth="2" />

      {/* Rosy Cheeks */}
      <circle cx="26" cy="62" r="6" fill="#f472b6" opacity="0.4" />
      <circle cx="74" cy="62" r="6" fill="#f472b6" opacity="0.4" />

      {/* Big Smile */}
      <path d="M38 60 Q50 70 62 60" stroke="#166534" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Little Lotus Leaf on Head when Idle */}
      {!isRunning && (
        <path d="M42 22 Q50 16 58 22 Q50 28 42 22 Z" fill="#22c55e" stroke="#15803d" strokeWidth="1.2" />
      )}

      {/* Matcha Tea Cup when Break */}
      {mode !== 'focus' && (
        <g transform="translate(42, 68)">
          <rect x="0" y="2" width="16" height="15" rx="3" fill="#ffffff" stroke="#15803d" strokeWidth="1.5" />
          <rect x="2" y="4" width="12" height="6" rx="2" fill="#4ade80" />
        </g>
      )}

      {/* Paws */}
      <circle cx="32" cy="78" r="5.5" fill="#86efac" stroke="#4ade80" strokeWidth="1.5" />
      <circle cx="68" cy="78" r="5.5" fill="#86efac" stroke="#4ade80" strokeWidth="1.5" />
    </g>
  );
}

/* ==========================================
   🌙 5. MIDNIGHT: LUNA THE MIDNIGHT CAT
   ========================================== */
function renderMidnightLuna(isRunning, mode) {
  return (
    <g>
      {/* Dark Cat Ears */}
      <polygon points="24,42 20,20 40,32" fill="#1e293b" stroke="#475569" strokeWidth="2" />
      <polygon points="26,38 23,24 37,32" fill="#334155" />

      <polygon points="76,42 80,20 60,32" fill="#1e293b" stroke="#475569" strokeWidth="2" />
      <polygon points="74,38 77,24 63,32" fill="#334155" />

      {/* Head */}
      <circle cx="50" cy="56" r="32" fill="#1e293b" stroke="#475569" strokeWidth="2" />

      {/* Crescent Moon on Forehead */}
      <path d="M47 34 Q53 38 49 46 Q44 40 47 34 Z" fill="#facc15" />

      {/* Glowing Golden Eyes */}
      <ellipse cx="37" cy="52" rx="4.5" ry="6" fill="#facc15" />
      <ellipse cx="37" cy="52" rx="1.5" ry="5" fill="#0f172a" />
      <ellipse cx="63" cy="52" rx="4.5" ry="6" fill="#facc15" />
      <ellipse cx="63" cy="52" rx="1.5" ry="5" fill="#0f172a" />

      {/* Cheeks */}
      <circle cx="28" cy="62" r="5" fill="#ec4899" opacity="0.4" />
      <circle cx="72" cy="62" r="5" fill="#ec4899" opacity="0.4" />

      {/* Nose & Mouth */}
      <polygon points="48,58 52,58 50,60" fill="#f43f5e" />
      <path d="M46 61 Q50 64 54 61" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Paws */}
      <ellipse cx="35" cy="78" rx="6" ry="4" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
      <ellipse cx="65" cy="78" rx="6" ry="4" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
    </g>
  );
}

/* ==========================================
   ☁️ 6. APPLE FROST: PIPPIN THE ARCTIC FOX
   ========================================== */
function renderArcticPippin(isRunning, mode) {
  return (
    <g>
      {/* Arctic Fox Ears */}
      <polygon points="22,42 18,16 42,32" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
      <polygon points="26,38 22,22 38,32" fill="#e2e8f0" />

      <polygon points="78,42 82,16 58,32" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
      <polygon points="74,38 78,22 62,32" fill="#e2e8f0" />

      {/* Head */}
      <circle cx="50" cy="56" r="32" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />

      {/* Cheeks */}
      <circle cx="28" cy="62" r="5.5" fill="#94a3b8" opacity="0.25" />
      <circle cx="72" cy="62" r="5.5" fill="#94a3b8" opacity="0.25" />

      {/* Eyes */}
      <ellipse cx="37" cy="52" rx="4" ry="5.5" fill="#1e293b" />
      <circle cx="35.5" cy="50" r="1.8" fill="#fff" />
      <ellipse cx="63" cy="52" rx="4" ry="5.5" fill="#1e293b" />
      <circle cx="61.5" cy="50" r="1.8" fill="#fff" />

      {/* Sleek Nose & Mouth */}
      <circle cx="50" cy="59" r="2.5" fill="#0f172a" />
      <path d="M47 62 Q50 64 53 62" stroke="#64748b" strokeWidth="1.6" strokeLinecap="round" fill="none" />

      {/* Paws */}
      <ellipse cx="35" cy="78" rx="6" ry="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
      <ellipse cx="65" cy="78" rx="6" ry="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
    </g>
  );
}
