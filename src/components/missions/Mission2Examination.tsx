import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Lightbulb,
  RotateCcw,
  Search,
  Square,
  Stethoscope,
  Volume2,
  X,
  ZoomIn,
} from 'lucide-react';
import {
  MISI2_HINTS,
  POEM_AUTHOR,
  POEM_LINES,
  POEM_TITLE,
} from '../../data/poemData';
import { DokterPuisiMascot } from '../DokterPuisiMascot';

interface Mission2ExaminationProps {
  coatColor: string;
  stethoscopeColor: string;
  magnifierEnabled: boolean;
  poemZoom: number;
  highlightedLines: number[];
  stethoscopeUsed: boolean;
  hintLevel: 0 | 1 | 2 | 3;
  onToggleMagnifier: () => void;
  onChangeZoom: (zoom: number) => void;
  onToggleLine: (lineNumber: number) => void;
  onMarkStethoscopeUsed: () => void;
  onRevealHint: () => void;
  onReplayMission: () => void;
  onPlaySound: (type: 'click' | 'success' | 'hint' | 'scan') => void;
  onOpenMap: () => void;
  onNextMission: () => void;
}

export const Mission2Examination: React.FC<Mission2ExaminationProps> = ({
  coatColor,
  stethoscopeColor,
  magnifierEnabled,
  poemZoom,
  highlightedLines,
  stethoscopeUsed,
  hintLevel,
  onToggleMagnifier,
  onChangeZoom,
  onToggleLine,
  onMarkStethoscopeUsed,
  onRevealHint,
  onReplayMission,
  onPlaySound,
  onOpenMap,
  onNextMission,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeSpokenLine, setActiveSpokenLine] = useState<number | null>(null);
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);
  const [lensPos, setLensPos] = useState<{ x: number; y: number; visible: boolean }>({
    x: 0,
    y: 0,
    visible: false,
  });
  const boardRef = useRef<HTMLDivElement | null>(null);
  const pulseTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (pulseTimerRef.current) {
        window.clearInterval(pulseTimerRef.current);
      }
    };
  }, []);

  const stopAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (pulseTimerRef.current) {
      window.clearInterval(pulseTimerRef.current);
      pulseTimerRef.current = null;
    }
    setIsSpeaking(false);
    setActiveSpokenLine(null);
  };

  const handleListenPoem = () => {
    if (isSpeaking) {
      stopAudio();
      return;
    }

    onMarkStethoscopeUsed();
    onPlaySound('success');
    setIsSpeaking(true);

    // Visual heartbeat line tracker (works reliably even if browser TTS has no Indonesian voice)
    let lineIdx = 0;
    setActiveSpokenLine(POEM_LINES[0].number);
    pulseTimerRef.current = window.setInterval(() => {
      lineIdx += 1;
      if (lineIdx >= POEM_LINES.length) {
        if (pulseTimerRef.current) window.clearInterval(pulseTimerRef.current);
        pulseTimerRef.current = null;
        setActiveSpokenLine(null);
        setIsSpeaking(false);
      } else {
        setActiveSpokenLine(POEM_LINES[lineIdx].number);
      }
    }, 1750);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const fullText = `${POEM_TITLE}, karya ${POEM_AUTHOR}. ${POEM_LINES.map((l) => l.text).join(' ')}`;
      const utterance = new SpeechSynthesisUtterance(fullText);
      utterance.lang = 'id-ID';
      utterance.rate = 0.86;
      utterance.onend = () => {
        stopAudio();
      };
      utterance.onerror = () => {
        // Biarkan pelacak visual tetap berjalan lalu selesai dengan rapi
      };
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!magnifierEnabled || !boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    setLensPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      visible: true,
    });
  };

  const hasPastClue = highlightedLines.some((n) => n <= 7);
  const hasNowClue = highlightedLines.some((n) => n >= 8);
  const enoughLines = highlightedLines.length >= 3;
  const missionReady = enoughLines && hasPastClue && hasNowClue && stethoscopeUsed;

  const stanzas: Array<1 | 2 | 3> = [1, 2, 3];
  const fontSizePx = Math.round(17 * poemZoom);

  let doctorGuidance =
    'Arahkan Kaca Pembesar ke teks puisi dan ketuk minimal 3 baris petunjuk penting (coba dari bait awal hingga bait akhir), lalu dengarkan puisi memakai Stetoskop!';
  if (enoughLines && (!hasPastClue || !hasNowClue)) {
    doctorGuidance =
      'Bagus! Kamu sudah menandai beberapa baris. Coba periksa juga bagian lain (awal dan akhir puisi) supaya temuanmu seimbang!';
  } else if (enoughLines && hasPastClue && hasNowClue && !stethoscopeUsed) {
    doctorGuidance =
      'Petunjuk baris sudah mantap! Sekarang tempelkan Stetoskop untuk mendengarkan pembacaan puisinya.';
  } else if (missionReady) {
    doctorGuidance =
      'Pemeriksaan lengkap! Semua baris penting sudah tercatat di Papan Pemeriksaan. Ayo bawa hasilnya ke Laboratorium Perbandingan!';
  }

  return (
    <section className="space-y-5" aria-labelledby="misi2-heading">
      {/* Maskot Dokter Puisi */}
      <div className="clinic-card rounded-3xl p-5">
        <DokterPuisiMascot
          mood={missionReady ? 'celebrate' : 'examining'}
          size="sm"
          coatColor={coatColor}
          stethoscopeColor={stethoscopeColor}
          label="Misi 2 · Dokter Puisi"
          message={doctorGuidance}
        />
      </div>

      {/* Bar Peralatan Dokter (Kaca Pembesar + Stetoskop + Ulangi Misi) */}
      <div className="clinic-card rounded-3xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-amber-700">
              Misi 2 · Ruang Pemeriksaan Puisi (Think)
            </p>
            <h1 id="misi2-heading" className="font-display text-2xl font-bold text-teal-950">
              Periksa Puisi dengan Kaca Pembesar &amp; Stetoskop
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Tombol Kaca Pembesar */}
            <button
              type="button"
              onClick={() => {
                onPlaySound('click');
                onToggleMagnifier();
              }}
              aria-pressed={magnifierEnabled}
              className={`btn-tactile inline-flex items-center gap-2 rounded-2xl border-2 px-4 py-2.5 text-xs font-extrabold transition ${
                magnifierEnabled
                  ? 'border-amber-500 bg-amber-300 text-amber-950 shadow-sm'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-amber-50'
              }`}
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              <span>{magnifierEnabled ? 'Kaca Pembesar: Aktif' : 'Aktifkan Kaca Pembesar'}</span>
            </button>

            {/* Tombol Perbesaran */}
            <button
              type="button"
              onClick={() => {
                onPlaySound('click');
                onChangeZoom(poemZoom >= 1.25 ? 1 : Number((poemZoom + 0.15).toFixed(2)));
              }}
              className="btn-tactile inline-flex items-center gap-1.5 rounded-2xl border-2 border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs font-extrabold text-amber-950 hover:bg-amber-100"
              title="Ubah ukuran teks puisi"
            >
              <ZoomIn className="h-4 w-4" aria-hidden="true" />
              <span className="tabular-nums">{Math.round(poemZoom * 100)}%</span>
            </button>

            {/* Tombol Stetoskop */}
            <button
              type="button"
              onClick={handleListenPoem}
              className={`btn-tactile inline-flex items-center gap-2 rounded-2xl border-b-4 px-4 py-2.5 text-xs font-extrabold text-white shadow-sm ${
                isSpeaking
                  ? 'border-rose-800 bg-rose-500'
                  : 'border-teal-800 bg-teal-600 hover:bg-teal-500'
              }`}
            >
              {isSpeaking ? (
                <>
                  <Square className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                  <span>Angkat Stetoskop</span>
                </>
              ) : (
                <>
                  <Stethoscope className="h-4 w-4" aria-hidden="true" />
                  <span>{stethoscopeUsed ? 'Dengar Ulang Stetoskop' : 'Stetoskop: Dengar Puisi'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onReplayMission}
              className="btn-tactile inline-flex items-center gap-1.5 rounded-2xl border-2 border-slate-200 bg-white px-3.5 py-2.5 text-xs font-extrabold text-slate-700 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Ulangi Misi</span>
            </button>
          </div>
        </div>
      </div>

      {/* Area Utama: Kiri Kertas Puisi + Lensa Kaca Pembesar, Kanan Papan Pemeriksaan */}
      <div className="grid items-start gap-6 lg:grid-cols-12">
        {/* Kertas Puisi dengan Lensa Kaca Pembesar Bergerak */}
        <div
          ref={boardRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setLensPos((p) => ({ ...p, visible: false }))}
          className={`clinic-card relative overflow-hidden rounded-3xl border-4 border-teal-200 bg-white p-6 lg:col-span-7 ${
            magnifierEnabled ? 'cursor-zoom-in' : ''
          }`}
        >
          {/* Lensa Kaca Pembesar Mengikuti Pointer */}
          {magnifierEnabled && lensPos.visible && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-amber-400 bg-amber-100/25 shadow-2xl backdrop-brightness-105"
              style={{
                left: lensPos.x,
                top: lensPos.y,
                width: 144,
                height: 144,
                boxShadow: '0 0 0 3px rgba(255,255,255,0.7), 0 12px 24px rgba(217,119,6,0.22)',
              }}
            >
              <div className="flex h-full w-full items-end justify-center pb-2">
                <span className="rounded-md bg-amber-400/90 px-2 py-0.5 text-[10px] font-extrabold text-amber-950">
                  {hoveredLine ? `Baris ${hoveredLine} (×1.25)` : 'Geser & Ketuk'}
                </span>
              </div>
            </div>
          )}

          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b-2 border-teal-100 pb-3">
            <div>
              <h2 className="font-display text-2xl font-bold text-teal-950">{POEM_TITLE}</h2>
              <p className="text-xs font-bold text-teal-700">Karya {POEM_AUTHOR}</p>
            </div>
            {isSpeaking && (
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-rose-600">
                <Volume2 className="h-4 w-4 animate-pulse" aria-hidden="true" />
                Membaca puisi...
              </span>
            )}
          </div>

          <div className="space-y-4">
            {stanzas.map((stanzaNum) => (
              <div key={stanzaNum} className="space-y-1.5">
                {POEM_LINES.filter((l) => l.stanza === stanzaNum).map((line) => {
                  const isHighlighted = highlightedLines.includes(line.number);
                  const isHovered = magnifierEnabled && hoveredLine === line.number;
                  const isSpoken = activeSpokenLine === line.number;

                  return (
                    <button
                      key={line.number}
                      type="button"
                      onMouseEnter={() => setHoveredLine(line.number)}
                      onMouseLeave={() => setHoveredLine(null)}
                      onFocus={() => setHoveredLine(line.number)}
                      onClick={() => {
                        onPlaySound(isHighlighted ? 'click' : 'scan');
                        onToggleLine(line.number);
                      }}
                      aria-pressed={isHighlighted}
                      style={{
                        fontSize: `${isHovered ? Math.round(fontSizePx * 1.12) : fontSizePx}px`,
                      }}
                      className={`flex w-full items-baseline gap-3 rounded-xl border-2 px-3 py-2 text-left transition-all duration-150 ${
                        isSpoken
                          ? 'border-rose-400 bg-rose-100/80 font-extrabold text-rose-950 shadow-sm'
                          : isHighlighted
                          ? 'border-amber-400 bg-yellow-200/85 font-extrabold text-amber-950 shadow-sm'
                          : isHovered
                          ? 'border-amber-300 bg-amber-50 font-extrabold text-teal-950'
                          : 'border-transparent bg-teal-50/40 font-bold text-slate-800 hover:border-teal-200'
                      }`}
                    >
                      <span className="w-6 shrink-0 text-right text-xs font-extrabold tabular-nums text-teal-700">
                        {line.number}
                      </span>
                      <span className="flex-1 leading-snug">{line.text}</span>
                      {isHighlighted && (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-amber-700" aria-hidden="true" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs font-bold text-slate-500">
            Petunjuk: Gerakkan kaca pembesar di atas teks puisi, lalu ketuk baris penting untuk
            menyimpannya ke Papan Pemeriksaan.
          </p>
        </div>

        {/* Kanan: Papan Pemeriksaan + Petunjuk Bertahap */}
        <div className="space-y-4 lg:col-span-5">
          <div className="clinic-card space-y-4 rounded-3xl border-2 border-teal-300 bg-teal-50/75 p-5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-teal-700" aria-hidden="true" />
                <h2 className="font-display text-lg font-bold text-teal-950">
                  Papan Pemeriksaan Dokter
                </h2>
              </div>
              <span className="text-xs font-extrabold tabular-nums text-teal-800">
                {highlightedLines.length} baris tersimpan
              </span>
            </div>

            {/* Daftar Checklist Alat */}
            <div className="space-y-1.5 rounded-2xl bg-white p-3.5 text-xs font-extrabold shadow-sm">
              <p className={enoughLines ? 'text-emerald-700' : 'text-slate-600'}>
                {enoughLines ? '✓' : '○'} Sorot minimal 3 baris petunjuk ({highlightedLines.length}/3)
              </p>
              <p className={hasPastClue && hasNowClue ? 'text-emerald-700' : 'text-slate-600'}>
                {hasPastClue && hasNowClue ? '✓' : '○'} Ada petunjuk dari bait awal &amp; bait akhir
              </p>
              <p className={stethoscopeUsed ? 'text-emerald-700' : 'text-slate-600'}>
                {stethoscopeUsed ? '✓' : '○'} Dengarkan puisi dengan Stetoskop
              </p>
            </div>

            {/* Daftar Baris Tersimpan */}
            <div className="max-h-56 space-y-2 overflow-y-auto rounded-2xl border-2 border-dashed border-teal-200 bg-white/90 p-3">
              {highlightedLines.length === 0 ? (
                <p className="py-5 text-center text-xs font-bold text-slate-500">
                  Belum ada baris tersimpan. Ketuk baris puisi di sebelah kiri!
                </p>
              ) : (
                POEM_LINES.filter((l) => highlightedLines.includes(l.number))
                  .sort((a, b) => a.number - b.number)
                  .map((line) => (
                    <motion.div
                      key={line.number}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between gap-2 rounded-xl border border-amber-200 bg-yellow-50 px-3 py-2 text-xs font-extrabold text-amber-950"
                    >
                      <span>
                        Baris {line.number}: &ldquo;{line.text}&rdquo;
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          onPlaySound('click');
                          onToggleLine(line.number);
                        }}
                        aria-label={`Hapus baris ${line.number} dari papan pemeriksaan`}
                        className="rounded-lg p-1 text-amber-700 hover:bg-amber-200/60"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </motion.div>
                  ))
              )}
            </div>

            {/* Petunjuk Bertahap Dokter Senior */}
            <div className="space-y-2 border-t border-teal-200 pt-3">
              <button
                type="button"
                disabled={hintLevel >= 3}
                onClick={() => {
                  onPlaySound('hint');
                  onRevealHint();
                }}
                className="btn-tactile inline-flex w-full items-center justify-center gap-2 rounded-2xl border-b-4 border-amber-500 bg-amber-300 px-4 py-2.5 text-xs font-extrabold text-amber-950 hover:bg-amber-400 disabled:opacity-55"
              >
                <Lightbulb className="h-4 w-4" aria-hidden="true" />
                <span>
                  {hintLevel === 0
                    ? 'Minta Petunjuk Bertahap (1/3)'
                    : hintLevel < 3
                    ? `Buka Petunjuk Berikutnya (${hintLevel + 1}/3)`
                    : 'Semua Petunjuk Terbuka'}
                </span>
              </button>

              {hintLevel > 0 && (
                <div className="space-y-1.5">
                  {MISI2_HINTS.slice(0, hintLevel).map((h, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-950"
                    >
                      Petunjuk {idx + 1}: {h}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2.5">
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
              disabled={!missionReady}
              onClick={onNextMission}
              className="btn-tactile inline-flex flex-1 items-center justify-center gap-2 rounded-3xl border-b-4 border-teal-800 bg-gradient-to-r from-teal-600 to-emerald-500 px-5 py-3.5 text-sm font-extrabold text-white shadow-md hover:from-teal-500 hover:to-emerald-500 disabled:cursor-not-allowed disabled:border-slate-400 disabled:bg-slate-300 disabled:from-slate-300 disabled:to-slate-300 disabled:text-slate-600"
            >
              <span>Lanjut Misi 3: Lab Perbandingan</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
