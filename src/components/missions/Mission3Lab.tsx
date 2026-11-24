import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FlaskConical,
  Hand,
  Lightbulb,
  RotateCcw,
  ScanLine,
  Sparkles,
} from 'lucide-react';
import { LAB_CARDS, MISI3_HINTS } from '../../data/poemData';
import {
  DahuluIllustration,
  KiniIllustration,
  LabCardIllustration,
} from '../ClinicIllustrations';
import { DokterPuisiMascot } from '../DokterPuisiMascot';

interface Mission3LabProps {
  coatColor: string;
  stethoscopeColor: string;
  partnerDoctorName: string;
  placements: Record<string, 'tray' | 'dahulu' | 'kini'>;
  mistakes: number;
  hintLevel: 0 | 1 | 2 | 3;
  onScanCard: (cardId: string, zone: 'dahulu' | 'kini', isCorrect: boolean) => void;
  onRevealHint: () => void;
  onReplayMission: () => void;
  onPlaySound: (type: 'click' | 'scan' | 'success' | 'error' | 'hint' | 'complete') => void;
  onCelebrate: () => void;
  onOpenMap: () => void;
  onNextMission: () => void;
}

export const Mission3Lab: React.FC<Mission3LabProps> = ({
  coatColor,
  stethoscopeColor,
  partnerDoctorName,
  placements,
  mistakes,
  hintLevel,
  onScanCard,
  onRevealHint,
  onReplayMission,
  onPlaySound,
  onCelebrate,
  onOpenMap,
  onNextMission,
}) => {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [dragOverZone, setDragOverZone] = useState<'dahulu' | 'kini' | null>(null);
  const [rejectedCardId, setRejectedCardId] = useState<string | null>(null);
  const [scanningZone, setScanningZone] = useState<'dahulu' | 'kini' | null>(null);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  const trayCards = LAB_CARDS.filter((c) => placements[c.id] === 'tray');
  const dahuluCards = LAB_CARDS.filter((c) => placements[c.id] === 'dahulu');
  const kiniCards = LAB_CARDS.filter((c) => placements[c.id] === 'kini');
  const allScanned = trayCards.length === 0;

  const handleDropToScanner = (cardId: string, zone: 'dahulu' | 'kini') => {
    const card = LAB_CARDS.find((c) => c.id === cardId);
    if (!card || placements[cardId] !== 'tray') return;

    const isCorrect = card.correctZone === zone;
    if (isCorrect) {
      onPlaySound('scan');
      setScanningZone(zone);
      window.setTimeout(() => setScanningZone(null), 550);

      onScanCard(cardId, zone, true);
      setSelectedCardId(null);

      const remaining = trayCards.filter((c) => c.id !== cardId).length;
      if (remaining === 0) {
        onPlaySound('complete');
        onCelebrate();
        setFeedback({
          ok: true,
          text: 'Mesin pemindai selesai! Semua 5 kartu berhasil dikelompokkan ke DAHULU dan KINI!',
        });
      } else {
        onPlaySound('success');
        setFeedback({
          ok: true,
          text: `${card.rightFeedback} (+30 XP)`,
        });
      }
    } else {
      onPlaySound('error');
      onScanCard(cardId, zone, false);
      setRejectedCardId(cardId);
      window.setTimeout(() => setRejectedCardId(null), 480);
      setFeedback({
        ok: false,
        text: card.wrongFeedback,
      });
    }
  };

  return (
    <section className="space-y-5" aria-labelledby="misi3-heading">
      {/* Maskot */}
      <div className="clinic-card rounded-3xl p-5">
        <DokterPuisiMascot
          mood={allScanned ? 'celebrate' : 'guide'}
          size="sm"
          coatColor={coatColor}
          stethoscopeColor={stethoscopeColor}
          label="Misi 3 · Kepala Laboratorium Puisi"
          message={
            allScanned
              ? 'Pemindaian tuntas! Lihat perbedaan nyata antara mesin DAHULU dan KINI. Ayo lanjut ke Ruang Diagnosis!'
              : `Seret 5 kartu gambar ke Mesin Pemindai DAHULU atau KINI!${
                  partnerDoctorName.trim() ? ` Diskusikan bersama ${partnerDoctorName.trim()}.` : ''
                } Jika salah, kartu akan kembali dengan petunjuk.`
          }
        />
      </div>

      {/* Header Lab */}
      <div className="clinic-card rounded-3xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-100 text-sky-700">
              <FlaskConical className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-sky-700">
                Misi 3 · Laboratorium Perbandingan (Pair)
              </p>
              <h1 id="misi3-heading" className="font-display text-2xl font-bold text-teal-950">
                Mesin Pemindai DAHULU &amp; KINI
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-extrabold tabular-nums text-teal-800">
              Dipindai: {LAB_CARDS.length - trayCards.length}/{LAB_CARDS.length} · Salah: {mistakes}
            </span>
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
      </div>

      {/* Baki Kartu Gambar */}
      <div className="clinic-card rounded-3xl p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg font-bold text-teal-950">
            Kartu Sampel Gambar
          </h2>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800">
            <Hand className="h-4 w-4 text-amber-600" aria-hidden="true" />
            Seret kartu ke mesin pemindai (atau ketuk kartu lalu ketuk tombol Masuk Pemindai)
          </span>
        </div>

        {trayCards.length > 0 ? (
          <div className="grid gap-3 rounded-2xl border-2 border-dashed border-teal-300 bg-teal-50/45 p-4 sm:grid-cols-2 lg:grid-cols-5">
            {trayCards.map((card) => {
              const isSelected = selectedCardId === card.id;
              const isRejected = rejectedCardId === card.id;

              return (
                <motion.div
                  key={card.id}
                  layout
                  animate={isRejected ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
                  transition={{ duration: 0.36 }}
                >
                  <button
                    type="button"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', card.id);
                      setDraggedCardId(card.id);
                    }}
                    onDragEnd={() => {
                      setDraggedCardId(null);
                      setDragOverZone(null);
                    }}
                    onClick={() => {
                      onPlaySound('click');
                      setSelectedCardId(isSelected ? null : card.id);
                    }}
                    className={`btn-tactile flex w-full cursor-grab items-center gap-2.5 rounded-2xl border-2 p-2.5 text-left transition active:cursor-grabbing lg:flex-col lg:text-center ${
                      isRejected
                        ? 'border-rose-500 bg-rose-50 text-rose-900'
                        : isSelected
                        ? 'border-amber-500 bg-yellow-200 text-amber-950 shadow-md ring-4 ring-amber-300/30'
                        : 'border-teal-200 bg-white text-teal-950 shadow-sm hover:border-teal-500'
                    }`}
                  >
                    <LabCardIllustration cardId={card.id} />
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold leading-tight">{card.label}</p>
                      <p className="mt-0.5 text-[11px] font-semibold text-slate-600">
                        {card.shortClue}
                      </p>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-4 text-sm font-extrabold text-emerald-900">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden="true" />
            <span>Semua 5 kartu sampel berhasil dipindai ke mesin DAHULU dan KINI!</span>
          </div>
        )}

        {feedback && (
          <motion.div
            key={feedback.text}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            role="status"
            aria-live="polite"
            className={`mt-3 rounded-2xl border-2 p-3.5 text-sm font-bold ${
              feedback.ok
                ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                : 'border-rose-300 bg-rose-50 text-rose-900'
            }`}
          >
            {feedback.text}
          </motion.div>
        )}
      </div>

      {/* Dua Mesin Pemindai: DAHULU & KINI */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Mesin DAHULU */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (dragOverZone !== 'dahulu') setDragOverZone('dahulu');
          }}
          onDragLeave={() => setDragOverZone(null)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOverZone(null);
            const id = e.dataTransfer?.getData('text/plain') || draggedCardId;
            if (id) handleDropToScanner(id, 'dahulu');
            setDraggedCardId(null);
          }}
          className={`clinic-card relative overflow-hidden rounded-3xl border-4 p-5 transition ${
            dragOverZone === 'dahulu'
              ? 'border-teal-500 bg-teal-50/80 ring-4 ring-teal-300/40'
              : 'border-teal-300'
          }`}
        >
          {scanningZone === 'dahulu' && (
            <motion.div
              initial={{ top: 0, opacity: 0.9 }}
              animate={{ top: '100%', opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="pointer-events-none absolute inset-x-0 z-10 h-2 bg-gradient-to-r from-teal-400 via-emerald-300 to-teal-400 shadow-lg"
            />
          )}

          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ScanLine className="h-5 w-5 text-teal-700" aria-hidden="true" />
              <h2 className="font-display text-xl font-bold text-teal-950">
                MESIN PEMINDAI DAHULU
              </h2>
            </div>
            {selectedCardId && (
              <button
                type="button"
                onClick={() => handleDropToScanner(selectedCardId, 'dahulu')}
                className="btn-tactile rounded-xl border-b-2 border-teal-800 bg-teal-600 px-3 py-1.5 text-xs font-extrabold text-white"
              >
                + Pindai di DAHULU
              </button>
            )}
          </div>

          <DahuluIllustration />

          <div className="mt-4 min-h-28 space-y-2 rounded-2xl border-2 border-dashed border-teal-200 bg-teal-50/60 p-3">
            {dahuluCards.length === 0 ? (
              <p className="py-5 text-center text-xs font-bold text-teal-700">
                Seret 3 kartu keadaan masa lalu ke pemindai ini
              </p>
            ) : (
              dahuluCards.map((c) => (
                <motion.div
                  key={c.id}
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-2.5 rounded-xl border border-teal-200 bg-white p-2 text-xs font-extrabold text-teal-950 shadow-sm"
                >
                  <LabCardIllustration cardId={c.id} />
                  <div className="flex-1">
                    <p className="text-sm">{c.label}</p>
                    <p className="text-[11px] font-semibold text-emerald-700">✓ Terpindai DAHULU</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Mesin KINI */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (dragOverZone !== 'kini') setDragOverZone('kini');
          }}
          onDragLeave={() => setDragOverZone(null)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOverZone(null);
            const id = e.dataTransfer?.getData('text/plain') || draggedCardId;
            if (id) handleDropToScanner(id, 'kini');
            setDraggedCardId(null);
          }}
          className={`clinic-card relative overflow-hidden rounded-3xl border-4 p-5 transition ${
            dragOverZone === 'kini'
              ? 'border-amber-500 bg-amber-50/80 ring-4 ring-amber-300/40'
              : 'border-amber-300'
          }`}
        >
          {scanningZone === 'kini' && (
            <motion.div
              initial={{ top: 0, opacity: 0.9 }}
              animate={{ top: '100%', opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="pointer-events-none absolute inset-x-0 z-10 h-2 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 shadow-lg"
            />
          )}

          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ScanLine className="h-5 w-5 text-amber-700" aria-hidden="true" />
              <h2 className="font-display text-xl font-bold text-amber-950">
                MESIN PEMINDAI KINI
              </h2>
            </div>
            {selectedCardId && (
              <button
                type="button"
                onClick={() => handleDropToScanner(selectedCardId, 'kini')}
                className="btn-tactile rounded-xl border-b-2 border-amber-700 bg-amber-400 px-3 py-1.5 text-xs font-extrabold text-amber-950"
              >
                + Pindai di KINI
              </button>
            )}
          </div>

          <KiniIllustration />

          <div className="mt-4 min-h-28 space-y-2 rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50/60 p-3">
            {kiniCards.length === 0 ? (
              <p className="py-5 text-center text-xs font-bold text-amber-800">
                Seret 2 kartu keadaan sekarang ke pemindai ini
              </p>
            ) : (
              kiniCards.map((c) => (
                <motion.div
                  key={c.id}
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-2.5 rounded-xl border border-amber-200 bg-white p-2 text-xs font-extrabold text-amber-950 shadow-sm"
                >
                  <LabCardIllustration cardId={c.id} />
                  <div className="flex-1">
                    <p className="text-sm">{c.label}</p>
                    <p className="text-[11px] font-semibold text-amber-700">✓ Terpindai KINI</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Petunjuk Bertahap + Navigasi */}
      <div className="clinic-card space-y-4 rounded-3xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            disabled={hintLevel >= 3}
            onClick={() => {
              onPlaySound('hint');
              onRevealHint();
            }}
            className="btn-tactile inline-flex items-center gap-2 rounded-2xl border-b-4 border-amber-500 bg-amber-300 px-4 py-2.5 text-xs font-extrabold text-amber-950 hover:bg-amber-400 disabled:opacity-55"
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

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onOpenMap}
              className="btn-tactile inline-flex items-center gap-2 rounded-2xl border-2 border-teal-200 bg-white px-4 py-3 text-xs font-extrabold text-teal-900 hover:bg-teal-50"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Peta Klinik</span>
            </button>

            <button
              type="button"
              disabled={!allScanned}
              onClick={onNextMission}
              className="btn-tactile inline-flex items-center gap-2 rounded-3xl border-b-4 border-teal-800 bg-gradient-to-r from-teal-600 to-emerald-500 px-6 py-3.5 text-sm font-extrabold text-white shadow-md hover:from-teal-500 hover:to-emerald-500 disabled:cursor-not-allowed disabled:border-slate-400 disabled:bg-slate-300 disabled:from-slate-300 disabled:to-slate-300 disabled:text-slate-600"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              <span>Lanjut Misi 4: Ruang Diagnosis</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {hintLevel > 0 && (
          <div className="grid gap-2.5 md:grid-cols-3">
            {MISI3_HINTS.slice(0, hintLevel).map((h, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs font-bold text-amber-950"
              >
                Petunjuk {idx + 1}: {h}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
