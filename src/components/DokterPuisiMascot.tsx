import React from 'react';
import { motion } from 'motion/react';

interface DokterPuisiMascotProps {
  message?: string;
  mood?: 'alert' | 'welcome' | 'examining' | 'guide' | 'happy' | 'celebrate';
  size?: 'sm' | 'md' | 'lg';
  coatColor?: string;
  stethoscopeColor?: string;
  hideSpeechBubble?: boolean;
  label?: string;
}

export const DokterPuisiMascot: React.FC<DokterPuisiMascotProps> = ({
  message = '',
  mood = 'guide',
  size = 'md',
  coatColor = '#0d9488',
  stethoscopeColor = '#0f766e',
  hideSpeechBubble = false,
  label = 'Dokter Puisi',
}) => {
  const avatarSize =
    size === 'lg'
      ? 'h-28 w-28 sm:h-32 sm:w-32'
      : size === 'sm'
      ? 'h-16 w-16'
      : 'h-20 w-20 sm:h-24 sm:w-24';

  const avatar = (
    <motion.div
      animate={
        mood === 'celebrate'
          ? { y: [0, -8, 0], rotate: [0, -3, 3, 0] }
          : mood === 'alert'
          ? { scale: [1, 1.04, 1], y: [0, -3, 0] }
          : { y: [0, -4, 0] }
      }
      transition={{
        duration: mood === 'celebrate' ? 1.3 : mood === 'alert' ? 1.1 : 2.8,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={`relative shrink-0 ${avatarSize}`}
    >
      <svg
        viewBox="0 0 160 160"
        className="h-full w-full drop-shadow-md"
        role="img"
        aria-label="Karakter Dokter Puisi mengenakan jas dokter putih dan stetoskop"
      >
        <defs>
          <radialGradient id="skinGradMascot" cx="45%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#ffedd5" />
            <stop offset="100%" stopColor="#fdba74" />
          </radialGradient>
          <linearGradient id="coatGradMascot" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f1f5f9" />
          </linearGradient>
        </defs>

        <circle
          cx="80"
          cy="82"
          r="72"
          fill={mood === 'alert' ? '#ffe4e6' : '#d1fae5'}
          stroke={mood === 'alert' ? '#f43f5e' : coatColor}
          strokeWidth="4"
        />

        {/* Badan Jas Dokter Putih */}
        <path
          d="M36 144 C38 112, 54 102, 80 102 C106 102, 122 112, 124 144 Z"
          fill="url(#coatGradMascot)"
          stroke={coatColor}
          strokeWidth="2.5"
        />
        <polygon points="68,104 92,104 80,132" fill={coatColor} />
        <polygon points="64,104 75,126 57,120" fill="#ffffff" stroke={coatColor} strokeWidth="1.5" />
        <polygon points="96,104 85,126 103,120" fill="#ffffff" stroke={coatColor} strokeWidth="1.5" />

        {/* Stetoskop */}
        <path
          d="M60 106 C54 122, 62 136, 80 136 C98 136, 106 122, 100 106"
          fill="none"
          stroke={stethoscopeColor}
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <circle cx="80" cy="136" r="6.5" fill="#fbbf24" stroke={stethoscopeColor} strokeWidth="2.5" />

        {/* Aksesori Kanan: Kaca Pembesar (examining) atau Clipboard */}
        {mood === 'examining' ? (
          <g transform="translate(106 102) rotate(-14)">
            <line x1="12" y1="26" x2="12" y2="44" stroke="#0f766e" strokeWidth="6" strokeLinecap="round" />
            <circle cx="12" cy="14" r="13" fill="#fef08a" fillOpacity="0.85" stroke="#d97706" strokeWidth="3.5" />
            <path d="M6 10 Q10 6 16 8" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        ) : (
          <g transform="translate(106 108) rotate(-10)">
            <rect x="0" y="6" width="28" height="36" rx="5" fill="#fbbf24" stroke="#b45309" strokeWidth="2" />
            <rect x="4" y="12" width="20" height="26" rx="2.5" fill="#ffffff" />
            <rect x="8" y="2" width="12" height="7" rx="2.5" fill={coatColor} />
            <line x1="7" y1="18" x2="21" y2="18" stroke={coatColor} strokeWidth="2" strokeLinecap="round" />
            <line x1="7" y1="24" x2="18" y2="24" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
            <line x1="7" y1="30" x2="20" y2="30" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {/* Tangan melambai */}
        <motion.g
          animate={{ rotate: [0, 14, -4, 14, 0] }}
          transition={{ duration: 2.0, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '42px', originY: '116px' }}
        >
          <path d="M44 118 L24 98" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" />
          <circle cx="23" cy="96" r="7.5" fill="#fed7aa" />
        </motion.g>

        {/* Kepala */}
        <circle cx="80" cy="68" r="34" fill="url(#skinGradMascot)" />
        <circle cx="45" cy="70" r="6.5" fill="#fdba74" />
        <circle cx="115" cy="70" r="6.5" fill="#fdba74" />

        <path
          d="M46 64 C46 38, 64 28, 82 30 C102 32, 114 44, 114 64 C104 52, 92 48, 80 50 C66 48, 56 54, 46 64 Z"
          fill="#5c3a21"
        />

        {/* Topi medis */}
        <rect x="57" y="26" width="46" height="16" rx="7" fill="#ffffff" stroke={coatColor} strokeWidth="2.5" />
        <rect x="77" y="29" width="6" height="10" rx="1.5" fill="#fb7185" />
        <rect x="75" y="31" width="10" height="6" rx="1.5" fill="#fb7185" />

        {/* Mata & Ekspresi */}
        <circle cx="67" cy="68" r="4.5" fill="#1e293b" />
        <circle cx="93" cy="68" r="4.5" fill="#1e293b" />
        <circle cx="68.5" cy="66.5" r="1.6" fill="#ffffff" />
        <circle cx="94.5" cy="66.5" r="1.6" fill="#ffffff" />

        {mood === 'alert' && (
          <>
            <path d="M59 58 Q67 54 74 58" fill="none" stroke="#5c3a21" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M86 58 Q93 54 101 58" fill="none" stroke="#5c3a21" strokeWidth="2.5" strokeLinecap="round" />
          </>
        )}

        <ellipse cx="58" cy="76" rx="5.5" ry="3.2" fill="#fb7185" opacity="0.45" />
        <ellipse cx="102" cy="76" rx="5.5" ry="3.2" fill="#fb7185" opacity="0.45" />

        {mood === 'celebrate' || mood === 'happy' ? (
          <path
            d="M68 79 Q80 92 92 79 Z"
            fill="#fb7185"
            stroke="#9f1239"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        ) : mood === 'alert' ? (
          <ellipse cx="80" cy="83" rx="5.5" ry="4.5" fill="#fb7185" stroke="#9f1239" strokeWidth="2" />
        ) : (
          <path
            d="M69 80 Q80 89 91 80"
            fill="none"
            stroke="#7c2d12"
            strokeWidth="3"
            strokeLinecap="round"
          />
        )}
      </svg>
    </motion.div>
  );

  if (hideSpeechBubble) {
    return avatar;
  }

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center">
      {avatar}
      <motion.div
        key={message}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className={`relative flex-1 rounded-2xl border-2 px-4 py-3.5 shadow-sm ${
          mood === 'alert'
            ? 'border-rose-300 bg-rose-50/90'
            : 'border-teal-200 bg-white'
        }`}
      >
        <p
          className={`mb-0.5 text-xs font-extrabold uppercase tracking-wide ${
            mood === 'alert' ? 'text-rose-700' : 'text-teal-700'
          }`}
        >
          {label}
        </p>
        <p className="text-sm font-bold leading-relaxed text-teal-950 sm:text-base">
          &ldquo;{message}&rdquo;
        </p>
      </motion.div>
    </div>
  );
};
