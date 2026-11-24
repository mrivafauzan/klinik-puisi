import React from 'react';
import { motion } from 'motion/react';

export const DahuluIllustration: React.FC = () => (
  <svg
    viewBox="0 0 360 200"
    className="h-36 w-full rounded-2xl border border-teal-200 bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-100"
    role="img"
    aria-label="Ilustrasi keadaan dahulu: lapangan hijau luas dengan layangan terbang dan sungai berair jernih"
  >
    <defs>
      <linearGradient id="skyPast" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#7dd3fc" />
        <stop offset="100%" stopColor="#e0f2fe" />
      </linearGradient>
      <linearGradient id="fieldPast" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#6ee7b7" />
        <stop offset="100%" stopColor="#10b981" />
      </linearGradient>
      <linearGradient id="riverPast" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#0284c7" />
      </linearGradient>
    </defs>

    <rect width="360" height="125" fill="url(#skyPast)" />
    <circle cx="52" cy="42" r="22" fill="#fde047" />
    <circle cx="52" cy="42" r="28" fill="#fef08a" opacity="0.45" />

    <g fill="#ffffff" opacity="0.95">
      <ellipse cx="145" cy="40" rx="26" ry="12" />
      <ellipse cx="162" cy="36" rx="18" ry="11" />
      <ellipse cx="290" cy="48" rx="24" ry="10" />
      <ellipse cx="308" cy="44" rx="16" ry="9" />
    </g>

    <path d="M0 120 Q85 88 180 118 T360 112 L360 130 L0 130 Z" fill="#86efac" />
    <path d="M0 118 L360 112 L360 200 L0 200 Z" fill="url(#fieldPast)" />
    <path
      d="M210 116 C235 135, 195 162, 238 200 L330 200 C285 162, 315 135, 278 114 Z"
      fill="url(#riverPast)"
    />
    <path
      d="M238 138 Q255 144 265 139 M232 164 Q256 172 274 166"
      stroke="#bae6fd"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    />

    <g>
      <rect x="28" y="96" width="8" height="24" rx="3" fill="#92400e" />
      <circle cx="32" cy="86" r="18" fill="#16a34a" />
      <circle cx="22" cy="92" r="12" fill="#22c55e" />
      <rect x="320" y="92" width="8" height="24" rx="3" fill="#92400e" />
      <circle cx="324" cy="84" r="17" fill="#15803d" />
    </g>

    <path d="M108 156 Q165 108 214 54" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
    <g transform="translate(216 48) rotate(18)">
      <polygon points="0,-20 15,0 0,24 -15,0" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
      <polygon points="0,-20 15,0 0,0" fill="#fb7185" />
      <polygon points="0,0 -15,0 0,24" fill="#38bdf8" />
      <path d="M0,24 Q8,34 0,44 Q-6,52 2,60" stroke="#f59e0b" strokeWidth="2.5" fill="none" />
    </g>

    <g transform="translate(96 142)">
      <circle cx="10" cy="8" r="7" fill="#fed7aa" />
      <rect x="4" y="15" width="12" height="16" rx="5" fill="#0ea5e9" />
      <line x1="16" y1="18" x2="22" y2="11" stroke="#fed7aa" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

export const KiniIllustration: React.FC = () => (
  <svg
    viewBox="0 0 360 200"
    className="h-36 w-full rounded-2xl border border-amber-200 bg-gradient-to-b from-amber-50 via-slate-100 to-stone-200"
    role="img"
    aria-label="Ilustrasi keadaan sekarang: kompleks perumahan yang padat dan kali kecil berair dangkal"
  >
    <defs>
      <linearGradient id="skyNow" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#bae6fd" />
        <stop offset="100%" stopColor="#fef3c7" />
      </linearGradient>
    </defs>

    <rect width="360" height="120" fill="url(#skyNow)" />
    <rect y="118" width="360" height="82" fill="#e2e8f0" />

    {[
      { x: 14, roof: '#f97316', wall: '#fff7ed' },
      { x: 86, roof: '#0ea5e9', wall: '#f0f9ff' },
      { x: 158, roof: '#eab308', wall: '#fefce8' },
      { x: 230, roof: '#14b8a6', wall: '#f0fdfa' },
    ].map((house, idx) => (
      <g key={idx} transform={`translate(${house.x} 68)`}>
        <polygon points="32,0 64,24 0,24" fill={house.roof} />
        <rect x="6" y="24" width="52" height="38" rx="3" fill={house.wall} stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="24" y="38" width="14" height="24" rx="2" fill="#94a3b8" />
        <rect x="11" y="32" width="10" height="10" rx="1.5" fill="#bae6fd" />
        <rect x="43" y="32" width="10" height="10" rx="1.5" fill="#bae6fd" />
      </g>
    ))}

    <rect x="0" y="130" width="360" height="22" fill="#cbd5e1" />

    <path
      d="M255 152 C270 165, 250 180, 272 200 L314 200 C292 180, 308 165, 290 152 Z"
      fill="#7dd3fc"
    />
    <path d="M250 152 L255 200 M293 152 L318 200" stroke="#94a3b8" strokeWidth="4" />
    <ellipse cx="277" cy="176" rx="6" ry="3.5" fill="#94a3b8" />
    <ellipse cx="290" cy="188" rx="5" ry="3" fill="#64748b" />

    <g transform="translate(38 144)">
      <circle cx="10" cy="8" r="7" fill="#fed7aa" />
      <rect x="4" y="15" width="12" height="16" rx="5" fill="#14b8a6" />
    </g>
  </svg>
);

export const ExaminationDeskBookIllustration: React.FC<{ healed?: boolean }> = ({
  healed = false,
}) => (
  <svg
    viewBox="0 0 380 220"
    className="h-52 w-full rounded-3xl border-2 border-teal-200 bg-gradient-to-b from-sky-100 via-teal-50 to-emerald-50"
    role="img"
    aria-label={
      healed
        ? 'Pasien buku puisi Dahulu dan Kini tampak ceria dan bersinar setelah diperiksa'
        : 'Buku puisi Dahulu dan Kini berada di atas meja pemeriksaan Klinik Puisi'
    }
  >
    <path d="M52 152 L52 72 Q52 50 76 50 L108 50" fill="none" stroke="#0d9488" strokeWidth="6" strokeLinecap="round" />
    <ellipse cx="52" cy="154" rx="20" ry="6" fill="#0f766e" />
    <path d="M96 42 L126 56 L104 72 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="2.5" />
    <polygon points="108,68 235,148 135,148" fill="#fef08a" opacity={healed ? '0.52' : '0.32'} />

    <rect x="18" y="148" width="344" height="16" rx="8" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
    <rect x="36" y="164" width="16" height="44" rx="4" fill="#0284c7" />
    <rect x="328" y="164" width="16" height="44" rx="4" fill="#0284c7" />

    <g transform="translate(115 84)">
      <rect x="0" y="14" width="150" height="58" rx="8" fill={healed ? '#10b981' : '#0d9488'} />
      <path d="M6 10 Q42 0 75 10 L75 66 Q42 56 6 66 Z" fill="#fffbeb" stroke="#fde68a" strokeWidth="2" />
      <path d="M75 10 Q108 0 144 10 L144 66 Q108 56 75 66 Z" fill="#ffffff" stroke="#fde68a" strokeWidth="2" />
      <line x1="16" y1="24" x2="62" y2="24" stroke="#14b8a6" strokeWidth="3" strokeLinecap="round" />
      <line x1="16" y1="34" x2="56" y2="34" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="16" y1="44" x2="60" y2="44" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="86" y1="24" x2="132" y2="24" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
      <line x1="86" y1="34" x2="128" y2="34" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="86" y1="44" x2="124" y2="44" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />

      {/* Wajah buku pasien */}
      {healed ? (
        <g transform="translate(57 38)">
          <circle cx="8" cy="6" r="2.2" fill="#0f766e" />
          <circle cx="28" cy="6" r="2.2" fill="#0f766e" />
          <path d="M12 12 Q18 19 24 12" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      ) : (
        <g transform="translate(57 38)">
          <circle cx="8" cy="6" r="2.2" fill="#475569" />
          <circle cx="28" cy="6" r="2.2" fill="#475569" />
          <path d="M13 14 Q18 11 23 14" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}

      <circle cx="132" cy="14" r="10" fill={healed ? '#10b981' : '#fb7185'} stroke="#ffffff" strokeWidth="2" />
      <text x="132" y="18" textAnchor="middle" fontSize="10" fill="#ffffff" fontWeight="bold">
        {healed ? '✓' : '♥'}
      </text>
    </g>

    {healed && (
      <motion.g
        animate={{ y: [0, -5, 0], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      >
        <polygon points="190,26 194,35 204,36 196,42 198,52 190,47 182,52 184,42 176,36 186,35" fill="#fbbf24" />
        <polygon points="278,44 281,50 288,51 283,56 284,62 278,59 272,62 273,56 268,51 275,50" fill="#34d399" />
        <polygon points="104,44 107,50 114,51 109,56 110,62 104,59 98,62 99,56 94,51 101,50" fill="#fb7185" />
      </motion.g>
    )}

    <path
      d="M284 114 C284 94, 316 94, 316 114 C316 130, 300 138, 300 146"
      fill="none"
      stroke="#fb7185"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <circle cx="300" cy="146" r="6" fill="#fbbf24" stroke="#be123c" strokeWidth="2" />
  </svg>
);

export const LabCardIllustration: React.FC<{ cardId: string }> = ({ cardId }) => {
  switch (cardId) {
    case 'lapangan':
      return (
        <svg viewBox="0 0 80 56" className="h-12 w-16 shrink-0 rounded-xl border border-emerald-200 bg-sky-100" aria-hidden="true">
          <rect width="80" height="32" fill="#bae6fd" />
          <circle cx="16" cy="14" r="6" fill="#fde047" />
          <path d="M0 30 Q40 24 80 30 L80 56 L0 56 Z" fill="#34d399" />
          <rect x="62" y="16" width="4" height="16" fill="#92400e" />
          <circle cx="64" cy="14" r="8" fill="#16a34a" />
        </svg>
      );
    case 'layangan':
      return (
        <svg viewBox="0 0 80 56" className="h-12 w-16 shrink-0 rounded-xl border border-amber-200 bg-sky-100" aria-hidden="true">
          <rect width="80" height="56" fill="#bae6fd" />
          <ellipse cx="20" cy="14" rx="10" ry="5" fill="#ffffff" />
          <path d="M16 50 Q38 34 46 24" stroke="#475569" strokeWidth="1.5" strokeDasharray="2 2" fill="none" />
          <g transform="translate(48 22) rotate(18)">
            <polygon points="0,-13 10,0 0,15 -10,0" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
            <polygon points="0,-13 10,0 0,0" fill="#fb7185" />
            <path d="M0,15 Q5,21 0,27" stroke="#f59e0b" strokeWidth="2" fill="none" />
          </g>
        </svg>
      );
    case 'sungai':
      return (
        <svg viewBox="0 0 80 56" className="h-12 w-16 shrink-0 rounded-xl border border-sky-200 bg-emerald-100" aria-hidden="true">
          <rect width="80" height="56" fill="#6ee7b7" />
          <path d="M18 0 C32 18, 12 34, 30 56 L62 56 C44 34, 62 18, 48 0 Z" fill="#0ea5e9" />
          <path d="M32 16 Q40 20 46 16 M30 36 Q42 40 48 36" stroke="#bae6fd" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>
      );
    case 'perumahan':
      return (
        <svg viewBox="0 0 80 56" className="h-12 w-16 shrink-0 rounded-xl border border-amber-200 bg-amber-50" aria-hidden="true">
          <rect width="80" height="36" fill="#e0f2fe" />
          <rect y="36" width="80" height="20" fill="#cbd5e1" />
          <g transform="translate(6 14)">
            <polygon points="15,0 30,11 0,11" fill="#f97316" />
            <rect x="3" y="11" width="24" height="18" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
            <rect x="11" y="18" width="7" height="11" fill="#64748b" />
          </g>
          <g transform="translate(42 14)">
            <polygon points="15,0 30,11 0,11" fill="#0ea5e9" />
            <rect x="3" y="11" width="24" height="18" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
            <rect x="11" y="18" width="7" height="11" fill="#64748b" />
          </g>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 80 56" className="h-12 w-16 shrink-0 rounded-xl border border-slate-200 bg-stone-100" aria-hidden="true">
          <rect width="80" height="56" fill="#e2e8f0" />
          <path d="M26 0 L34 56 L48 56 L40 0 Z" fill="#7dd3fc" />
          <line x1="25" y1="0" x2="33" y2="56" stroke="#94a3b8" strokeWidth="3" />
          <line x1="41" y1="0" x2="49" y2="56" stroke="#94a3b8" strokeWidth="3" />
          <ellipse cx="37" cy="24" rx="4" ry="2.5" fill="#64748b" />
          <ellipse cx="40" cy="40" rx="3.5" ry="2" fill="#94a3b8" />
        </svg>
      );
  }
};
