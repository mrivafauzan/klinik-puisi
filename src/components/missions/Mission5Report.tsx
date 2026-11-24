import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Copy,
  HeartPulse,
  Printer,
  RotateCcw,
  Sparkles,
  Star,
  Stethoscope,
  Wand2,
} from 'lucide-react';
import {
  ACHIEVEMENT_BADGES,
  COAT_STYLES,
  LAB_CARDS,
  POEM_AUTHOR,
  POEM_LINES,
  POEM_TITLE,
  STETHOSCOPE_STYLES,
} from '../../data/poemData';
import { ClinicGameState } from '../../types/clinic';
import { ExaminationDeskBookIllustration } from '../ClinicIllustrations';
import { DokterPuisiMascot } from '../DokterPuisiMascot';

interface Mission5ReportProps {
  state: ClinicGameState;
  onHealPatient: () => void;
  onChangeReflection: (val: string) => void;
  onReplayMission: () => void;
  onOpenBonus: () => void;
  onOpenMap: () => void;
  onPlaySound: (type: 'click' | 'success' | 'complete' | 'badge') => void;
  onCelebrate: () => void;
}

export const Mission5Report: React.FC<Mission5ReportProps> = ({
  state,
  onHealPatient,
  onChangeReflection,
  onReplayMission,
  onOpenBonus,
  onOpenMap,
  onPlaySound,
  onCelebrate,
}) => {
  const [copied, setCopied] = useState(false);

  const selectedCoat = COAT_STYLES.find((c) => c.id === state.coatStyle) ?? COAT_STYLES[0];
  const selectedSteth =
    STETHOSCOPE_STYLES.find((s) => s.id === state.stethoscopeStyle) ?? STETHOSCOPE_STYLES[0];

  const proofLines = POEM_LINES.filter((l) => state.selectedProofLines.includes(l.number));
  const highlightedLines = POEM_LINES.filter((l) => state.highlightedLines.includes(l.number));
  const totalStars = Object.values(state.progress).reduce((sum, p) => sum + p.stars, 0);

  const todayFormatted = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const handleFinishExamination = () => {
    onPlaySound('complete');
    onHealPatient();
    onCelebrate();
  };

  const handleCopyReport = async () => {
    const lines = [
      `LAPORAN DOKTER PUISI CILIK — KLINIK PUISI`,
      `Dokter: ${state.doctorName || 'Dokter Puisi Cilik'}${
        state.partnerDoctorName ? ` & ${state.partnerDoctorName}` : ''
      }`,
      `Total XP: ${state.xp} XP · Bintang: ${totalStars}`,
      `Pasien Puisi: "${POEM_TITLE}" karya ${POEM_AUTHOR}`,
      ``,
      `1. Pemeriksaan Kaca Pembesar (${highlightedLines.length} baris): ${highlightedLines
        .map((l) => `Baris ${l.number} ("${l.text}")`)
        .join('; ')}`,
      `2. Pemindaian Lab: Dahulu (Lapangan, Layangan, Sungai) -> Kini (Perumahan, Kali kecil)`,
      `3. Diagnosis Maksud Puisi: ${state.diagnosisMeaning}`,
      `4. Baris Bukti Pendukung: ${proofLines.map((l) => `Baris ${l.number} ("${l.text}")`).join('; ')}`,
      `5. Alasan Dokter: ${state.diagnosisReason}`,
      state.reflectionNote ? `6. Refleksi: ${state.reflectionNote}` : '',
    ].filter(Boolean);

    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      onPlaySound('success');
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="mx-auto max-w-5xl space-y-6" aria-labelledby="misi5-heading">
      {/* Maskot */}
      <div className="no-print clinic-card rounded-3xl p-5">
        <DokterPuisiMascot
          mood={state.patientHealed ? 'celebrate' : 'happy'}
          size="sm"
          coatColor={selectedCoat.trimColor}
          stethoscopeColor={selectedSteth.hex}
          label="Misi 5 · Laporan Akhir Dokter"
          message={
            state.patientHealed
              ? 'Hore! Pasien puisi sudah sembuh dan tersenyum ceria! Sekarang bagikan laporan dan sertifikatmu kepada guru dan teman-teman!'
              : 'Periksa kembali rangkuman bukti dan diagnosismu di bawah, lalu tekan tombol Selesaikan Pemeriksaan Pasien!'
          }
        />
      </div>

      {/* Ringkasan Laporan + Animasi Pasien Sembuh */}
      <div className="clinic-card rounded-3xl border-2 border-emerald-300 bg-white p-6 md:p-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b-2 border-dashed border-teal-200 pb-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
              Misi 5 · Laporan Dokter Puisi (Share)
            </p>
            <h1 id="misi5-heading" className="font-display text-2xl font-bold text-teal-950 md:text-3xl">
              Laporan Akhir Pemeriksaan Puisi
            </h1>
          </div>

          <div className="no-print flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCopyReport}
              className="btn-tactile inline-flex items-center gap-1.5 rounded-2xl border-2 border-teal-200 bg-white px-3.5 py-2 text-xs font-extrabold text-teal-900 hover:bg-teal-50"
            >
              <Copy className="h-4 w-4" aria-hidden="true" />
              <span>{copied ? 'Laporan Tersalin!' : 'Salin Laporan'}</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="btn-tactile inline-flex items-center gap-1.5 rounded-2xl border-2 border-teal-200 bg-white px-3.5 py-2 text-xs font-extrabold text-teal-900 hover:bg-teal-50"
            >
              <Printer className="h-4 w-4" aria-hidden="true" />
              <span>Cetak</span>
            </button>
            <button
              type="button"
              onClick={onReplayMission}
              className="btn-tactile inline-flex items-center gap-1.5 rounded-2xl border-2 border-slate-200 bg-white px-3.5 py-2 text-xs font-extrabold text-slate-700 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Ulangi Misi</span>
            </button>
          </div>
        </div>

        <div className="grid items-center gap-6 lg:grid-cols-12">
          {/* Animasi Pasien Berhasil Diperiksa */}
          <div className="space-y-3 lg:col-span-5">
            <motion.div
              animate={state.patientHealed ? { scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 1.8, repeat: Infinity }}
            >
              <ExaminationDeskBookIllustration healed={state.patientHealed} />
            </motion.div>

            {!state.patientHealed ? (
              <button
                type="button"
                onClick={handleFinishExamination}
                className="btn-tactile inline-flex w-full items-center justify-center gap-2 rounded-3xl border-b-4 border-emerald-800 bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4 text-base font-extrabold text-white shadow-lg hover:from-emerald-600 hover:to-teal-700"
              >
                <HeartPulse className="h-5 w-5" aria-hidden="true" />
                <span>Selesaikan Pemeriksaan Pasien</span>
              </button>
            ) : (
              <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-3 text-center text-xs font-extrabold text-emerald-900">
                ✓ Pasien Puisi &ldquo;{POEM_TITLE}&rdquo; Berhasil Diperiksa &amp; Dipahami!
              </div>
            )}
          </div>

          {/* Bukti & Ringkasan Diagnosis */}
          <div className="space-y-3 lg:col-span-7">
            <div className="rounded-2xl border border-teal-200 bg-teal-50/60 p-4">
              <p className="text-xs font-extrabold uppercase text-teal-700">
                Diagnosis Maksud Puisi
              </p>
              <p className="mt-1 text-sm font-bold text-teal-950">
                {state.diagnosisMeaning || 'Belum diisi'}
              </p>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
              <p className="text-xs font-extrabold uppercase text-amber-800">
                Bukti Baris Puisi yang Dipilih ({proofLines.length} baris)
              </p>
              <ul className="mt-1.5 space-y-1 text-xs font-bold text-amber-950">
                {proofLines.map((l) => (
                  <li key={l.number}>
                    • Baris {l.number}: &ldquo;{l.text}&rdquo;
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-4">
              <p className="text-xs font-extrabold uppercase text-rose-700">Alasan Dokter</p>
              <p className="mt-1 text-sm font-bold text-slate-800">
                {state.diagnosisReason || 'Belum diisi'}
              </p>
            </div>

            <div className="grid gap-2 text-xs font-bold text-slate-700 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <span className="font-extrabold text-teal-800">Kaca Pembesar (Misi 2):</span>{' '}
                {highlightedLines.length} baris diamati
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <span className="font-extrabold text-sky-800">Pemindai Lab (Misi 3):</span>{' '}
                {LAB_CARDS.length}/5 kartu tepat
              </div>
            </div>
          </div>
        </div>

        {/* Refleksi Singkat */}
        <div className="no-print mt-5 rounded-2xl border-2 border-teal-100 bg-teal-50/40 p-4">
          <label htmlFor="m5-reflection" className="mb-1 block text-xs font-extrabold text-teal-900">
            Catatan Refleksi Singkat (opsional): Apa hal menarik yang kamu pelajari hari ini?
          </label>
          <input
            id="m5-reflection"
            type="text"
            value={state.reflectionNote}
            onChange={(e) => onChangeReflection(e.target.value)}
            placeholder="Contoh: Saya belajar menemukan maksud puisi dari perubahan keadaan dahulu dan kini."
            className="w-full rounded-xl border-2 border-teal-200 bg-white px-3.5 py-2 text-sm font-bold text-slate-800 focus:border-teal-500 focus:outline-none"
          />
        </div>
      </div>

      {/* SERTIFIKAT & LENCANA PENCAPAIAN (Muncul setelah pasien sembuh) */}
      {state.patientHealed && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <article className="clinic-card rounded-3xl border-8 border-double border-amber-400 bg-gradient-to-br from-amber-50 via-white to-teal-50 p-6 text-center shadow-2xl md:p-10">
            <div className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-lg">
              <Award className="h-9 w-9" aria-hidden="true" />
            </div>

            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-teal-700">
              Klinik Puisi · Operasi Bedah Puisi
            </p>
            <h2 className="font-display mt-1 text-2xl font-bold text-teal-950 md:text-4xl">
              SERTIFIKAT DOKTER PUISI CILIK
            </h2>

            <p className="mt-4 text-sm font-bold text-slate-600">Diberikan dengan bangga kepada:</p>
            <p className="font-display mt-1 text-3xl font-bold text-teal-800 md:text-4xl">
              {state.doctorName.trim() || 'Dokter Puisi Cilik'}
            </p>
            {state.partnerDoctorName.trim() && (
              <p className="mt-1 text-sm font-extrabold text-sky-800">
                Bersama Rekan Tugas: {state.partnerDoctorName.trim()}
              </p>
            )}

            <p className="mx-auto mt-3 max-w-2xl text-sm font-bold leading-relaxed text-slate-700">
              Telah berhasil menyelesaikan 5 Misi Operasi Bedah Puisi untuk pasien{' '}
              <span className="font-extrabold text-teal-950">
                &ldquo;{POEM_TITLE}&rdquo; karya {POEM_AUTHOR}
              </span>{' '}
              dengan perolehan <span className="tabular-nums font-extrabold text-teal-800">{state.xp} XP</span> dan{' '}
              <span className="tabular-nums font-extrabold text-amber-700">{totalStars} Bintang</span>.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 border-t-2 border-dashed border-amber-300 pt-4 text-xs font-extrabold text-teal-900">
              <div>
                <p className="text-slate-500">Tanggal</p>
                <p>{todayFormatted}</p>
              </div>
              <div className="flex items-center gap-1.5 rounded-2xl border-2 border-emerald-500 bg-emerald-50 px-3.5 py-2 text-emerald-800">
                <Stethoscope className="h-4 w-4" aria-hidden="true" />
                <span>Disahkan · Klinik Puisi</span>
              </div>
              <div>
                <p className="text-slate-500">Pembimbing</p>
                <p>Dokter Senior &amp; Dokter Puisi</p>
              </div>
            </div>
          </article>

          {/* Lencana Pencapaian */}
          <div className="clinic-card rounded-3xl p-6">
            <h2 className="font-display mb-4 text-xl font-bold text-teal-950">
              Lencana Pencapaian Dokter Puisi
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {ACHIEVEMENT_BADGES.map((badge) => {
                const earned = state.progress[badge.mission].completed;
                return (
                  <div
                    key={badge.id}
                    className={`flex items-start gap-3 rounded-2xl border-2 p-4 transition ${
                      earned
                        ? badge.style
                        : 'border-slate-200 bg-slate-50 text-slate-400 opacity-75'
                    }`}
                  >
                    {earned ? (
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
                    ) : (
                      <Star className="mt-0.5 h-5 w-5 shrink-0 text-slate-300" aria-hidden="true" />
                    )}
                    <div>
                      <p className="font-display text-sm font-bold">{badge.title}</p>
                      <p className="mt-0.5 text-xs font-bold opacity-85">{badge.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA ke Tantangan Bonus */}
          <div className="no-print flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={onOpenMap}
              className="btn-tactile inline-flex items-center gap-2 rounded-2xl border-2 border-teal-200 bg-white px-5 py-3 text-sm font-extrabold text-teal-900 hover:bg-teal-50"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Kembali ke Peta Klinik</span>
            </button>

            <button
              type="button"
              onClick={onOpenBonus}
              className="btn-tactile inline-flex items-center gap-2 rounded-3xl border-b-4 border-violet-800 bg-gradient-to-r from-violet-600 to-indigo-500 px-6 py-3.5 text-sm font-extrabold text-white shadow-lg hover:from-violet-500 hover:to-indigo-500"
            >
              <Wand2 className="h-4 w-4" aria-hidden="true" />
              <span>
                {state.progress.bonus.completed
                  ? 'Lihat Tantangan Bonus'
                  : 'Mainkan Tantangan Bonus (+100 XP)'}
              </span>
              <Sparkles className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      )}
    </section>
  );
};
