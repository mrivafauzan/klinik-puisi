import {
  BonusPhrasePair,
  ClinicGameState,
  CoatStyleId,
  DiagnosisSentenceCard,
  LabScannerCard,
  MissionMeta,
  PoemLine,
  StethoscopeStyleId,
} from '../types/clinic';

export const POEM_TITLE = 'Dahulu dan Kini';
export const POEM_AUTHOR = 'Eva Y. Nukman';

// Teks puisi dipertahankan utuh tanpa mengubah kata, tanda baca, dan urutan barisnya
export const POEM_LINES: PoemLine[] = [
  { number: 1, stanza: 1, text: 'Di sini dahulu ada lapangan,', periodTag: 'dahulu' },
  { number: 2, stanza: 1, text: 'tempat kami bermain layangan.', periodTag: 'dahulu' },
  { number: 3, stanza: 1, text: 'Layangan kami membubung ke angkasa,', periodTag: 'dahulu' },
  { number: 4, stanza: 1, text: 'melenggak-lenggok dengan cantiknya.', periodTag: 'dahulu' },
  { number: 5, stanza: 2, text: 'Di sungai itu dahulu kami mandi,', periodTag: 'dahulu' },
  { number: 6, stanza: 2, text: 'berenang setiap petang dan pagi,', periodTag: 'dahulu' },
  { number: 7, stanza: 2, text: 'tak peduli dingin memagut tulang.', periodTag: 'dahulu' },
  { number: 8, stanza: 3, text: 'Demikian kakekku bercerita', periodTag: 'perasaan' },
  { number: 9, stanza: 3, text: 'dan aku hanya dapat membayangkan', periodTag: 'perasaan' },
  { number: 10, stanza: 3, text: 'sambil menatap satu kompleks perumahan', periodTag: 'kini' },
  { number: 11, stanza: 3, text: 'dan sebuah kali kecil berair dangkal.', periodTag: 'kini' },
];

export const MISSIONS_META: MissionMeta[] = [
  {
    key: 'misi1',
    numberLabel: 'MISI 1',
    title: 'Panggilan Darurat',
    roomName: 'Ruang Penerimaan Pasien',
    shortTask: 'Terima pasien puisi & pakai kartu Dokter Puisi Cilik.',
    tps: 'THINK',
    tpsHint: 'THINK · Sambut pasien puisi yang masuk dan pahami keluhannya.',
    maxXp: 100,
    accentBg: 'bg-rose-50',
    accentBorder: 'border-rose-300',
    accentText: 'text-rose-900',
  },
  {
    key: 'misi2',
    numberLabel: 'MISI 2',
    title: 'Pemeriksaan Puisi',
    roomName: 'Ruang Periksa Dokter',
    shortTask: 'Amati dengan kaca pembesar & dengarkan pakai stetoskop.',
    tps: 'THINK',
    tpsHint: 'THINK · Sorot minimal 3 baris petunjuk dan dengarkan puisi.',
    maxXp: 150,
    accentBg: 'bg-amber-50',
    accentBorder: 'border-amber-300',
    accentText: 'text-amber-950',
  },
  {
    key: 'misi3',
    numberLabel: 'MISI 3',
    title: 'Laboratorium Perbandingan',
    roomName: 'Lab Pemindai Waktu',
    shortTask: 'Seret 5 kartu gambar ke mesin pemindai DAHULU atau KINI.',
    tps: 'PAIR',
    tpsHint: 'PAIR · Diskusikan kartu mana yang masuk DAHULU dan KINI.',
    maxXp: 150,
    accentBg: 'bg-sky-50',
    accentBorder: 'border-sky-300',
    accentText: 'text-sky-950',
  },
  {
    key: 'misi4',
    numberLabel: 'MISI 4',
    title: 'Ruang Diagnosis',
    roomName: 'Studio Diagnosis Makna',
    shortTask: 'Susun kartu gagasan, pilih baris bukti, & tulis alasan.',
    tps: 'PAIR',
    tpsHint: 'PAIR · Susun kesimpulan maksud puisi dan bukti barisnya bersama rekan.',
    maxXp: 200,
    accentBg: 'bg-teal-50',
    accentBorder: 'border-teal-300',
    accentText: 'text-teal-950',
  },
  {
    key: 'misi5',
    numberLabel: 'MISI 5',
    title: 'Laporan Dokter',
    roomName: 'Aula Sertifikat Klinik',
    shortTask: 'Sembuhkan pasien puisi & raih sertifikat Dokter Puisi Cilik.',
    tps: 'SHARE',
    tpsHint: 'SHARE · Sampaikan laporan akhir dan buktinya kepada teman & guru.',
    maxXp: 150,
    accentBg: 'bg-emerald-50',
    accentBorder: 'border-emerald-300',
    accentText: 'text-emerald-950',
  },
  {
    key: 'bonus',
    numberLabel: 'BONUS',
    title: 'Bedah Ungkapan Puisi',
    roomName: 'Pojok Kata Ajaib',
    shortTask: 'Cocokkan 3 ungkapan indah dalam puisi dengan maknanya.',
    tps: 'SHARE',
    tpsHint: 'BONUS · Uji ketajamanmu memahami makna ungkapan dalam puisi!',
    maxXp: 100,
    accentBg: 'bg-violet-50',
    accentBorder: 'border-violet-300',
    accentText: 'text-violet-950',
  },
];

export const COAT_STYLES: Array<{
  id: CoatStyleId;
  name: string;
  trimColor: string;
  description: string;
}> = [
  {
    id: 'toska',
    name: 'Jas Putih Toska',
    trimColor: '#0d9488',
    description: 'Kerah biru toska segar',
  },
  {
    id: 'langit',
    name: 'Jas Biru Langit',
    trimColor: '#0284c7',
    description: 'Kerah biru langit cerah',
  },
  {
    id: 'mint',
    name: 'Jas Hijau Mint',
    trimColor: '#10b981',
    description: 'Kerah hijau mint sejuk',
  },
  {
    id: 'kuning',
    name: 'Jas Kuning Ceria',
    trimColor: '#eab308',
    description: 'Kerah kuning hangat',
  },
];

export const STETHOSCOPE_STYLES: Array<{
  id: StethoscopeStyleId;
  name: string;
  hex: string;
}> = [
  { id: 'toska', name: 'Toska', hex: '#0f766e' },
  { id: 'kuning', name: 'Kuning', hex: '#d97706' },
  { id: 'coral', name: 'Coral', hex: '#e11d48' },
];

export const LAB_CARDS: LabScannerCard[] = [
  {
    id: 'lapangan',
    label: 'Lapangan',
    shortClue: 'Tempat bermain yang luas',
    correctZone: 'dahulu',
    wrongFeedback: 'Ups! Periksa baris 1: "Di sini dahulu ada lapangan." Itu keadaan DAHULU.',
    rightFeedback: 'Tepat! Lapangan luas ada di masa DAHULU saat kakek masih kecil.',
  },
  {
    id: 'perumahan',
    label: 'Perumahan',
    shortClue: 'Deretan rumah yang padat',
    correctZone: 'kini',
    wrongFeedback: 'Belum tepat! Periksa baris 10: tokoh menatap "satu kompleks perumahan" di masa KINI.',
    rightFeedback: 'Benar! Kompleks perumahan berdiri di tempat itu pada masa KINI.',
  },
  {
    id: 'layangan',
    label: 'Layangan',
    shortClue: 'Melenggak-lenggok di udara',
    correctZone: 'dahulu',
    wrongFeedback: 'Coba cek bait 1! Bermain layangan diceritakan kakek pada masa DAHULU.',
    rightFeedback: 'Hebat! Bermain layangan dilakukan di lapangan pada masa DAHULU.',
  },
  {
    id: 'kali',
    label: 'Kali kecil',
    shortClue: 'Berair dangkal sekarang',
    correctZone: 'kini',
    wrongFeedback: 'Perhatikan baris terakhir! "kali kecil berair dangkal" dilihat tokoh sekarang (KINI).',
    rightFeedback: 'Cocok! Kali kecil berair dangkal adalah kondisi air masa KINI.',
  },
  {
    id: 'sungai',
    label: 'Sungai',
    shortClue: 'Tempat mandi dan berenang',
    correctZone: 'dahulu',
    wrongFeedback: 'Coba lihat bait 2: "Di sungai itu dahulu kami mandi." Itu cerita masa DAHULU.',
    rightFeedback: 'Mantap! Sungai besar tempat mandi dan berenang ada pada masa DAHULU.',
  },
];

export const DIAGNOSIS_CARDS: DiagnosisSentenceCard[] = [
  {
    id: 'card-dahulu',
    text: 'Dahulu lingkungan sangat luas dan asri, ada lapangan bermain dan sungai untuk berenang.',
    order: 1,
  },
  {
    id: 'card-kini',
    text: 'Kini tempat itu berubah menjadi kompleks perumahan dan kali kecil berair dangkal.',
    order: 2,
  },
  {
    id: 'card-maksud',
    text: 'Penyair ingin menunjukkan perubahan lingkungan akibat pembangunan sehingga kenangan indah itu hanya bisa dibayangkan.',
    order: 3,
  },
];

export const BONUS_PHRASE_PAIRS: BonusPhrasePair[] = [
  {
    id: 'bonus-angkasa',
    phrase: '“membubung ke angkasa”',
    lineRef: 'Baris 3',
    meaning: 'Langit dan ruang terbuka dulu sangat luas untuk bermain layangan',
    explanation: 'Tepat! Layangan bisa terbang tinggi karena lapangannya luas tanpa bangunan tinggi.',
  },
  {
    id: 'bonus-dingin',
    phrase: '“tak peduli dingin memagut tulang”',
    lineRef: 'Baris 7',
    meaning: 'Air sungai dulu sangat dingin, segar, dan asyik dipakai berenang',
    explanation: 'Hebat! Anak-anak zaman kakek sangat senang mandi di sungai yang bersih dan sejuk.',
  },
  {
    id: 'bonus-bayang',
    phrase: '“hanya dapat membayangkan”',
    lineRef: 'Baris 9',
    meaning: 'Keadaan indah itu sudah hilang sekarang sehingga tokoh tidak bisa merasakannya langsung',
    explanation: 'Luar biasa! Ungkapan ini menegaskan betapa besar perubahan tempat itu dari dahulu ke kini.',
  },
];

export const MISI2_HINTS = [
  'Cari kata penanda waktu seperti "dahulu" di bait 1 dan bait 2.',
  'Perhatikan apa yang ditatap tokoh di bait 3 ("perumahan" dan "kali kecil").',
  'Sorot minimal 1 baris cerita masa lalu dan 1 baris keadaan sekarang agar bukti pemeriksaanmu lengkap!',
];

export const MISI3_HINTS = [
  'Bait 1 dan 2 menceritakan tempat bermain kakek di masa DAHULU.',
  'Bait 3 baris 10–11 menceritakan hal yang dilihat tokoh di masa KINI.',
  'Coba pasangkan: Lapangan berubah menjadi Perumahan, dan Sungai berubah menjadi Kali kecil.',
];

export const MISI4_HINTS = [
  'Susun kartu mulai dari keadaan DAHULU → perubahan KINI → pesan penyair.',
  'Pilih baris puisi yang benar-benar membuktikan perubahan tempat atau perasaan tokoh.',
  'Gunakan kata penghubung seperti "karena", "berubah", atau "sehingga" saat menulis alasanmu.',
];

export const ACHIEVEMENT_BADGES = [
  {
    id: 'first-responder',
    mission: 'misi1' as const,
    title: 'Dokter Siaga Klinik',
    subtitle: 'Menyambut panggilan darurat pasien puisi',
    style: 'border-rose-300 bg-rose-50 text-rose-950',
  },
  {
    id: 'sharp-observer',
    mission: 'misi2' as const,
    title: 'Pengamat Kaca Pembesar',
    subtitle: 'Menemukan baris petunjuk & mendengar suara puisi',
    style: 'border-amber-300 bg-amber-50 text-amber-950',
  },
  {
    id: 'lab-scanner',
    mission: 'misi3' as const,
    title: 'Ahli Pemindai Waktu',
    subtitle: 'Mengelompokkan sampel Dahulu & Kini dengan tepat',
    style: 'border-sky-300 bg-sky-50 text-sky-950',
  },
  {
    id: 'meaning-diagnostician',
    mission: 'misi4' as const,
    title: 'Dokter Diagnosis Makna',
    subtitle: 'Menyusun maksud puisi dengan bukti dan alasan',
    style: 'border-teal-300 bg-teal-50 text-teal-950',
  },
  {
    id: 'chief-poet-doctor',
    mission: 'misi5' as const,
    title: 'Dokter Puisi Teladan',
    subtitle: 'Menyelesaikan laporan & menyembuhkan pasien puisi',
    style: 'border-emerald-300 bg-emerald-50 text-emerald-950',
  },
  {
    id: 'phrase-master',
    mission: 'bonus' as const,
    title: 'Spesialis Ungkapan Puisi',
    subtitle: 'Menaklukkan Tantangan Bonus Klinik Puisi',
    style: 'border-violet-300 bg-violet-50 text-violet-950',
  },
];

export function createInitialGameState(): ClinicGameState {
  return {
    currentScreen: 'misi1',
    doctorName: '',
    partnerDoctorName: '',
    coatStyle: 'toska',
    stethoscopeStyle: 'toska',
    xp: 0,
    soundMuted: false,
    musicEnabled: false,
    progress: {
      misi1: { completed: false, stars: 0 },
      misi2: { completed: false, stars: 0 },
      misi3: { completed: false, stars: 0 },
      misi4: { completed: false, stars: 0 },
      misi5: { completed: false, stars: 0 },
      bonus: { completed: false, stars: 0 },
    },
    emergencyAccepted: false,
    magnifierEnabled: true,
    poemZoom: 1.05,
    highlightedLines: [],
    stethoscopeUsed: false,
    misi2HintLevel: 0,
    labPlacements: {
      lapangan: 'tray',
      perumahan: 'tray',
      layangan: 'tray',
      kali: 'tray',
      sungai: 'tray',
    },
    labMistakes: 0,
    misi3HintLevel: 0,
    arrangedCardIds: [],
    selectedProofLines: [],
    diagnosisMeaning: '',
    diagnosisReason: '',
    misi4HintLevel: 0,
    diagnosisSaved: false,
    patientHealed: false,
    reflectionNote: '',
    bonusMatchedIds: [],
    bonusMistakes: 0,
  };
}
