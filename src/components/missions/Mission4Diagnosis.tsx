import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  ClipboardCheck,
  Layers,
  Lightbulb,
  Plus,
  RotateCcw,
  Stethoscope,
  X,
} from 'lucide-react';
import {
  DIAGNOSIS_CARDS,
  LAB_CARDS,
  MISI4_HINTS,
  POEM_LINES,
} from '../../data/poemData';
import { evaluateDiagnosisStrength } from '../../utils/sound';
import { DokterPuisiMascot } from '../DokterPuisiMascot';

interface Mission4DiagnosisProps {
  coatColor: string;
  stethoscopeColor: string;
  partnerDoctorName: string;
  highlightedLinesFromMisi2: number[];
  arrangedCardIds: string[];
  selectedProofLines: number[];
  diagnosisMeaning: string;
  diagnosisReason: string;
  hintLevel: 0 | 1 | 2 | 3;
  diagnosisSaved: boolean;
  onAddCard: (cardId: string) => void;
  onRemoveCard: (cardId: string) => void;
  onMoveCard: (cardId: string, direction: 'up' | 'down') => void;
  onToggleProofLine: (lineNumber: number) => void;
  onChangeMeaning: (val: string) => void;
  onChangeReason: (val: string) => void;
  onRevealHint: () => void;
  onSaveDiagnosis: () => void;
  onReplayMission: () => void;
  onPlaySound: (type: 'click' | 'success' | 'hint' | 'error' | 'complete') => void;
  onOpenMap: () => void;
  onNextMission: () => void;
}

export const Mission4Diagnosis: React.FC<Mission4DiagnosisProps> = ({
  coatColor,
  stethoscopeColor,
  partnerDoctorName,
  highlightedLinesFromMisi2,
  arrangedCardIds,
  selectedProofLines,
  diagnosisMeaning,
  diagnosisReason,
  hintLevel,
  diagnosisSaved,
  onAddCard,
  onRemoveCard,
  onMoveCard,
  onToggleProofLine,
  onChangeMeaning,
  onChangeReason,
  onRevealHint,
  onSaveDiagnosis,
  onReplayMission,
  onPlaySound,
  onOpenMap,
  onNextMission,
}) => {
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  const remainingCards = DIAGNOSIS_CARDS.filter((c) => !arrangedCardIds.includes(c.id));
  const arrangedCards = arrangedCardIds
    .map((id) => DIAGNOSIS_CARDS.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const isOrderCorrect =
    arrangedCards.length === DIAGNOSIS_CARDS.length &&
    arrangedCards.every((c, idx) => c.order === idx + 1);

  const strength = evaluateDiagnosisStrength(
    diagnosisMeaning,
    diagnosisReason,
    selectedProofLines.length
  );

  const handleConfirmDiagnosis = () => {
    if (arrangedCards.length < DIAGNOSIS_CARDS.length) {
      onPlaySound('error');
      setFeedback({
        ok: false,
        text: 'Susun semua 3 kartu kalimat kesimpulan di papan urutan terlebih dahulu!',
      });
      return;
    }
    if (!isOrderCorrect) {
      onPlaySound('hint');
      setFeedback({
        ok: false,
        text: 'Urutan kartu kalimat belum runtut! Mulai dari keadaan DAHULU → perubahan KINI → maksud penyair.',
      });
      return;
    }
    if (!strength.hasMeaning) {
      onPlaySound('error');
      setFeedback({
        ok: false,
        text: 'Tuliskan kesimpulan maksud puisi dengan kalimatmu sendiri (minimal beberapa kata yang jelas).',
      });
      return;
    }
    if (!strength.hasProof) {
      onPlaySound('error');
      setFeedback({
        ok: false,
        text: 'Pilih minimal 1 baris puisi yang menjadi bukti pendukung diagnosismu!',
      });
      return;
    }
    if (!strength.hasReason) {
      onPlaySound('error');
      setFeedback({
        ok: false,
        text: 'Tuliskan alasanmu memilih baris bukti tersebut dengan kalimatmu sendiri!',
      });
      return;
    }

    onPlaySound('complete');
    onSaveDiagnosis();
    setFeedback({
      ok: true,
      text: 'Diagnosis disetujui Dokter Senior! (+200 XP) Ayo masuk ke Misi 5 untuk melihat Laporan Dokter.',
    });
  };

  return (
    <section className="space-y-5" aria-labelledby="misi4-heading">
      {/* Maskot */}
      <div className="clinic-card rounded-3xl p-5">
        <DokterPuisiMascot
          mood={diagnosisSaved ? 'celebrate' : 'guide'}
          size="sm"
          coatColor={coatColor}
          stethoscopeColor={stethoscopeColor}
          label="Misi 4 · Ruang Diagnosis"
          message={
            diagnosisSaved
              ? 'Diagnosis yang sangat logis dan didukung bukti puisi! Sekarang bawa laporanmu ke Misi 5 untuk menyembuhkan pasien puisi!'
              : `Lihat hasil pemeriksaan dari misi sebelumnya${
                  partnerDoctorName.trim() ? ` bersama ${partnerDoctorName.trim()}` : ''
                }, lalu susun kartu kesimpulan, pilih baris bukti, dan tulis alasanmu sendiri!`
          }
        />
      </div>

      {/* Ringkasan Hasil Pemeriksaan Sebelumnya */}
      <div className="clinic-card rounded-3xl border-2 border-sky-200 bg-sky-50/75 p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sky-950">
            <ClipboardCheck className="h-5 w-5 text-sky-700" aria-hidden="true" />
            <h2 className="font-display text-lg font-bold">
              Rekap Hasil Pemeriksaan Sebelumnya
            </h2>
          </div>
          <button
            type="button"
            onClick={onReplayMission}
            className="btn-tactile inline-flex items-center gap-1.5 rounded-2xl border-2 border-slate-200 bg-white px-3 py-1.5 text-xs font-extrabold text-slate-700 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Ulangi Misi</span>
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-3.5 shadow-sm">
            <p className="text-xs font-extrabold text-amber-700">
              Temuan Misi 2 (Kaca Pembesar · {highlightedLinesFromMisi2.length} baris):
            </p>
            <p className="mt-1 text-xs font-bold text-slate-700">
              {highlightedLinesFromMisi2.length > 0
                ? POEM_LINES.filter((l) => highlightedLinesFromMisi2.includes(l.number))
                    .map((l) => `Baris ${l.number}: "${l.text}"`)
                    .join(' · ')
                : 'Belum ada baris disorot'}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-3.5 shadow-sm">
            <p className="text-xs font-extrabold text-sky-700">
              Temuan Misi 3 (Lab Perbandingan DAHULU vs KINI):
            </p>
            <p className="mt-1 text-xs font-bold text-slate-700">
              Dahulu:{' '}
              {LAB_CARDS.filter((c) => c.correctZone === 'dahulu')
                .map((c) => c.label)
                .join(', ')}{' '}
              → Kini:{' '}
              {LAB_CARDS.filter((c) => c.correctZone === 'kini')
                .map((c) => c.label)
                .join(', ')}
            </p>
          </div>
        </div>
      </div>

      {/* Papan Diagnosis Utama */}
      <div className="overflow-hidden rounded-3xl border-4 border-teal-600 bg-white shadow-2xl">
        <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 p-5 text-white md:p-6">
          <div className="mb-1 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-teal-100">
            <Stethoscope className="h-4 w-4" aria-hidden="true" />
            <span>Misi 4 · Studio Diagnosis Makna Puisi (Pair)</span>
          </div>
          <h1 id="misi4-heading" className="font-display text-2xl font-bold md:text-3xl">
            Susun Diagnosis &amp; Bukti Pendukung
          </h1>
        </div>

        <div className="space-y-6 p-6 md:p-7">
          {/* LANGKAH 1: SUSUN KARTU KALIMAT KESIMPULAN */}
          <div className="space-y-3 rounded-2xl border-2 border-teal-200 bg-teal-50/45 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-teal-950">
                <Layers className="h-5 w-5 text-teal-700" aria-hidden="true" />
                <h2 className="font-display text-lg font-bold">
                  1. Susun Kartu Kalimat Kesimpulan (Urutan 1 → 2 → 3)
                </h2>
              </div>
              {arrangedCards.length === DIAGNOSIS_CARDS.length && (
                <span
                  className={`text-xs font-extrabold ${
                    isOrderCorrect ? 'text-emerald-700' : 'text-amber-700'
                  }`}
                >
                  {isOrderCorrect ? '✓ Urutan logis tepat!' : 'Coba atur ulang urutannya'}
                </span>
              )}
            </div>

            {remainingCards.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {remainingCards.map((card) => (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => {
                      onPlaySound('click');
                      onAddCard(card.id);
                    }}
                    className="btn-tactile inline-flex items-center gap-1.5 rounded-2xl border-2 border-amber-300 bg-amber-50 px-3.5 py-2 text-left text-xs font-extrabold text-amber-950 hover:bg-amber-100"
                  >
                    <Plus className="h-4 w-4 shrink-0 text-amber-700" aria-hidden="true" />
                    <span>{card.text}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="min-h-20 space-y-2 rounded-2xl border-2 border-dashed border-teal-300 bg-white p-3.5">
              {arrangedCards.length === 0 ? (
                <p className="py-2 text-center text-xs font-bold text-slate-500">
                  Ketuk kartu kalimat di atas untuk menyusun alur kesimpulan puisi...
                </p>
              ) : (
                arrangedCards.map((card, idx) => (
                  <div
                    key={card.id}
                    className="flex items-center justify-between gap-2 rounded-xl border border-teal-200 bg-teal-50 px-3 py-2 text-xs font-extrabold text-teal-950"
                  >
                    <span className="flex-1">
                      {idx + 1}. {card.text}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => {
                          onPlaySound('click');
                          onMoveCard(card.id, 'up');
                        }}
                        aria-label="Naikkan urutan"
                        className="rounded-lg bg-white p-1 text-teal-800 hover:bg-teal-100 disabled:opacity-40"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === arrangedCards.length - 1}
                        onClick={() => {
                          onPlaySound('click');
                          onMoveCard(card.id, 'down');
                        }}
                        aria-label="Turunkan urutan"
                        className="rounded-lg bg-white p-1 text-teal-800 hover:bg-teal-100 disabled:opacity-40"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onPlaySound('click');
                          onRemoveCard(card.id);
                        }}
                        aria-label="Keluarkan kartu"
                        className="rounded-lg bg-white p-1 text-rose-700 hover:bg-rose-50"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div>
              <label htmlFor="m4-meaning" className="mb-1.5 block text-sm font-extrabold text-teal-950">
                Tulis kesimpulan maksud puisi dengan kalimatmu sendiri:
              </label>
              <div className="mb-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onPlaySound('click');
                    if (!diagnosisMeaning.trim()) {
                      onChangeMeaning('Menurut saya, puisi ini ingin menyampaikan bahwa ');
                    }
                  }}
                  className="rounded-xl border border-teal-200 bg-white px-3 py-1 text-xs font-bold text-teal-800 hover:bg-teal-100"
                >
                  + Bantu Awal Kalimat
                </button>
              </div>
              <textarea
                id="m4-meaning"
                rows={2}
                value={diagnosisMeaning}
                onChange={(e) => onChangeMeaning(e.target.value)}
                placeholder="Contoh: Menurut saya, puisi ini menyampaikan bahwa tempat yang dulu berupa lapangan dan sungai kini berubah menjadi perumahan dan kali dangkal..."
                className="w-full rounded-2xl border-2 border-teal-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          {/* LANGKAH 2: PILIH BUKTI BARIS PUISI */}
          <div className="space-y-3 rounded-2xl border-2 border-amber-200 bg-amber-50/50 p-5">
            <h2 className="font-display text-lg font-bold text-amber-950">
              2. Pilih Baris Puisi sebagai Bukti Pendukung
            </h2>
            <div className="grid gap-1.5 sm:grid-cols-2">
              {POEM_LINES.map((line) => {
                const isSelected = selectedProofLines.includes(line.number);
                return (
                  <button
                    key={line.number}
                    type="button"
                    onClick={() => {
                      onPlaySound('click');
                      onToggleProofLine(line.number);
                    }}
                    aria-pressed={isSelected}
                    className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2 text-left text-xs font-bold transition ${
                      isSelected
                        ? 'border-teal-600 bg-teal-600 text-white shadow-sm'
                        : 'border-amber-200/70 bg-white text-slate-800 hover:border-teal-400'
                    }`}
                  >
                    <span className="w-5 shrink-0 font-extrabold tabular-nums opacity-75">
                      {line.number}
                    </span>
                    <span className="flex-1">{line.text}</span>
                    {isSelected && <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* LANGKAH 3: TULIS ALASAN SENDIRI */}
          <div className="space-y-2.5 rounded-2xl border-2 border-rose-200 bg-rose-50/50 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label htmlFor="m4-reason" className="font-display text-lg font-bold text-rose-950">
                3. Mengapa kamu memilih baris bukti tersebut?
              </label>
              <span className="text-xs font-extrabold text-teal-800">
                Kelengkapan Diagnosis: {strength.score}/4
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                onPlaySound('click');
                if (!diagnosisReason.trim()) {
                  onChangeReason('Saya memilih baris tersebut karena menunjukkan perubahan ');
                }
              }}
              className="rounded-xl border border-rose-200 bg-white px-3 py-1 text-xs font-bold text-rose-800 hover:bg-rose-100"
            >
              + Bantu Awal Kalimat Alasan
            </button>

            <textarea
              id="m4-reason"
              rows={2}
              value={diagnosisReason}
              onChange={(e) => onChangeReason(e.target.value)}
              placeholder="Tuliskan alasanmu sendiri mengapa baris bukti itu mendukung kesimpulanmu..."
              className="w-full rounded-2xl border-2 border-rose-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 focus:border-teal-500 focus:outline-none"
            />
          </div>

          {/* Petunjuk Bertahap */}
          <div>
            <button
              type="button"
              disabled={hintLevel >= 3}
              onClick={() => {
                onPlaySound('hint');
                onRevealHint();
              }}
              className="btn-tactile inline-flex items-center gap-2 rounded-2xl border-b-4 border-amber-500 bg-amber-300 px-4 py-2 text-xs font-extrabold text-amber-950 hover:bg-amber-400 disabled:opacity-55"
            >
              <Lightbulb className="h-4 w-4" aria-hidden="true" />
              <span>
                {hintLevel === 0
                  ? 'Petunjuk Bertahap (1/3)'
                  : hintLevel < 3
                  ? `Petunjuk Berikutnya (${hintLevel + 1}/3)`
                  : 'Semua Petunjuk Terbuka'}
              </span>
            </button>

            {hintLevel > 0 && (
              <div className="mt-2.5 grid gap-2 md:grid-cols-3">
                {MISI4_HINTS.slice(0, hintLevel).map((h, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-bold text-amber-950"
                  >
                    Petunjuk {idx + 1}: {h}
                  </div>
                ))}
              </div>
            )}
          </div>

          {feedback && (
            <div
              role="status"
              aria-live="polite"
              className={`rounded-2xl border-2 p-4 text-sm font-bold ${
                feedback.ok
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                  : 'border-amber-300 bg-amber-50 text-amber-950'
              }`}
            >
              {feedback.text}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-teal-100 pt-4">
            <button
              type="button"
              onClick={onOpenMap}
              className="btn-tactile inline-flex items-center gap-2 rounded-2xl border-2 border-teal-200 bg-white px-4 py-3 text-xs font-extrabold text-teal-900 hover:bg-teal-50"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Peta Klinik</span>
            </button>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleConfirmDiagnosis}
                className="btn-tactile rounded-2xl border-b-4 border-amber-600 bg-amber-400 px-5 py-3 text-sm font-extrabold text-amber-950 hover:bg-amber-300"
              >
                {diagnosisSaved ? 'Perbarui Diagnosis' : 'Simpan Diagnosis'}
              </button>

              <button
                type="button"
                disabled={!diagnosisSaved}
                onClick={onNextMission}
                className="btn-tactile inline-flex items-center gap-2 rounded-3xl border-b-4 border-teal-800 bg-gradient-to-r from-teal-600 to-emerald-500 px-6 py-3.5 text-sm font-extrabold text-white shadow-md hover:from-teal-500 hover:to-emerald-500 disabled:cursor-not-allowed disabled:border-slate-400 disabled:bg-slate-300 disabled:from-slate-300 disabled:to-slate-300 disabled:text-slate-600"
              >
                <span>Lanjut Misi 5: Laporan Dokter</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
