export type ScreenId = 'misi1' | 'map' | 'misi2' | 'misi3' | 'misi4' | 'misi5' | 'bonus';

export type MissionKey = 'misi1' | 'misi2' | 'misi3' | 'misi4' | 'misi5' | 'bonus';

export type TpsPhase = 'THINK' | 'PAIR' | 'SHARE';

export type CoatStyleId = 'toska' | 'langit' | 'mint' | 'kuning';
export type StethoscopeStyleId = 'toska' | 'kuning' | 'coral';

export interface MissionMeta {
  key: MissionKey;
  numberLabel: string;
  title: string;
  roomName: string;
  shortTask: string;
  tps: TpsPhase;
  tpsHint: string;
  maxXp: number;
  accentBg: string;
  accentBorder: string;
  accentText: string;
}

export interface MissionProgress {
  completed: boolean;
  stars: number; // 0 - 3
}

export interface PoemLine {
  number: number;
  stanza: 1 | 2 | 3;
  text: string;
  periodTag: 'dahulu' | 'kini' | 'perasaan';
}

export interface LabScannerCard {
  id: string;
  label: string;
  shortClue: string;
  correctZone: 'dahulu' | 'kini';
  wrongFeedback: string;
  rightFeedback: string;
}

export interface DiagnosisSentenceCard {
  id: string;
  text: string;
  order: number;
}

export interface BonusPhrasePair {
  id: string;
  phrase: string;
  lineRef: string;
  meaning: string;
  explanation: string;
}

export interface ClinicGameState {
  currentScreen: ScreenId;
  doctorName: string;
  partnerDoctorName: string;
  coatStyle: CoatStyleId;
  stethoscopeStyle: StethoscopeStyleId;
  xp: number;
  soundMuted: boolean;
  musicEnabled: boolean;

  progress: Record<MissionKey, MissionProgress>;

  // Misi 1 – Panggilan Darurat
  emergencyAccepted: boolean;

  // Misi 2 – Pemeriksaan Puisi
  magnifierEnabled: boolean;
  poemZoom: number;
  highlightedLines: number[];
  stethoscopeUsed: boolean;
  misi2HintLevel: 0 | 1 | 2 | 3;

  // Misi 3 – Laboratorium Perbandingan
  labPlacements: Record<string, 'tray' | 'dahulu' | 'kini'>;
  labMistakes: number;
  misi3HintLevel: 0 | 1 | 2 | 3;

  // Misi 4 – Ruang Diagnosis
  arrangedCardIds: string[];
  selectedProofLines: number[];
  diagnosisMeaning: string;
  diagnosisReason: string;
  misi4HintLevel: 0 | 1 | 2 | 3;
  diagnosisSaved: boolean;

  // Misi 5 – Laporan Dokter
  patientHealed: boolean;
  reflectionNote: string;

  // Tantangan Bonus
  bonusMatchedIds: string[];
  bonusMistakes: number;
}
