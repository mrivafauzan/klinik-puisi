let audioCtx: AudioContext | null = null;

export type SoundEffectType =
  | 'click'
  | 'alarm'
  | 'scan'
  | 'success'
  | 'error'
  | 'hint'
  | 'complete'
  | 'badge';

export function playFeedbackSound(type: SoundEffectType, muted: boolean): void {
  if (muted || typeof window === 'undefined') return;
  const Ctx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return;

  try {
    if (!audioCtx) {
      audioCtx = new Ctx();
    }
    if (audioCtx.state === 'suspended') {
      void audioCtx.resume();
    }
    const now = audioCtx.currentTime;

    const notes: Record<SoundEffectType, Array<[number, number, number, OscillatorType?]>> = {
      click: [[780, 0, 0.045, 'sine']],
      alarm: [
        [660, 0, 0.1, 'triangle'],
        [880, 0.12, 0.12, 'triangle'],
        [660, 0.28, 0.1, 'triangle'],
        [880, 0.4, 0.14, 'triangle'],
      ],
      scan: [
        [480, 0, 0.07, 'sine'],
        [720, 0.06, 0.1, 'sine'],
      ],
      success: [
        [523.25, 0, 0.08, 'sine'],
        [659.25, 0.08, 0.12, 'sine'],
      ],
      error: [
        [290, 0, 0.09, 'triangle'],
        [220, 0.09, 0.14, 'triangle'],
      ],
      hint: [[460, 0, 0.11, 'triangle']],
      complete: [
        [523.25, 0, 0.09, 'sine'],
        [659.25, 0.09, 0.09, 'sine'],
        [783.99, 0.18, 0.12, 'sine'],
        [1046.5, 0.3, 0.24, 'sine'],
      ],
      badge: [
        [659.25, 0, 0.07, 'sine'],
        [880, 0.07, 0.08, 'sine'],
        [1174.66, 0.15, 0.22, 'sine'],
      ],
    };

    notes[type].forEach(([freq, offset, duration, wave]) => {
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = wave ?? 'sine';
      osc.frequency.setValueAtTime(freq, now + offset);
      gain.gain.setValueAtTime(0.055, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + duration);
    });
  } catch {
    // Abaikan jika browser membatasi audio otomatis
  }
}

export function evaluateDiagnosisStrength(
  meaning: string,
  reason: string,
  proofCount: number
): {
  hasMeaning: boolean;
  hasChangeConcept: boolean;
  hasProof: boolean;
  hasReason: boolean;
  score: number;
} {
  const cleanMeaning = meaning.trim().toLowerCase();
  const cleanReason = reason.trim().toLowerCase();
  const combined = `${cleanMeaning} ${cleanReason}`;

  const clueKeywords = [
    'berubah',
    'perubahan',
    'dahulu',
    'dulu',
    'sekarang',
    'kini',
    'lapangan',
    'perumahan',
    'sungai',
    'kali',
    'lingkungan',
    'alam',
    'hilang',
    'dibangun',
    'karena',
    'sebab',
    'akibat',
  ];

  const hasMeaning = cleanMeaning.length >= 15;
  const hasChangeConcept = clueKeywords.some((kw) => combined.includes(kw));
  const hasProof = proofCount >= 1;
  const hasReason = cleanReason.length >= 12;

  const score = [hasMeaning, hasChangeConcept, hasProof, hasReason].filter(Boolean).length;
  return { hasMeaning, hasChangeConcept, hasProof, hasReason, score };
}
