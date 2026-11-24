import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Wand2,
} from 'lucide-react';
import { BONUS_PHRASE_PAIRS } from '../../data/poemData';
import { DokterPuisiMascot } from '../DokterPuisiMascot';

interface BonusChallengeProps {
  coatColor: string;
  stethoscopeColor: string;
  matchedIds: string[];
  mistakes: number;
  onMatchResult: (pairId: string, isCorrect: boolean) => void;
  onReplayMission: () => void;
  onPlaySound: (type: 'click' | 'success' | 'error' | 'badge') => void;
  onCelebrate: () => void;
  onOpenMap: () => void;
}

const MEANING_DISPLAY_ORDER = ['bonus-bayang', 'bonus-angkasa', 'bonus-dingin'];

export const BonusChallenge: React.FC<BonusChallengeProps> = ({
  coatColor,
  stethoscopeColor,
  matchedIds,
  mistakes,
  onMatchResult,
  onReplayMission,
  onPlaySound,
  onCelebrate,
  onOpenMap,
}) => {
  const [selectedPhraseId, setSelectedPhraseId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  const allDone = matchedIds.length === BONUS_PHRASE_PAIRS.length;

  const handleSelectMeaning = (meaningPairId: string) => {
    if (!selectedPhraseId) {
      onPlaySound('click');
      setFeedback({
        ok: false,
        text: 'Ketuk dulu 1 Ungkapan Puisi di sebelah kiri, lalu ketuk maknanya di sebelah kanan!',
      });
      return;
    }

    const target = BONUS_PHRASE_PAIRS.find((p) => p.id === selectedPhraseId);
    if (!target) return;

    if (selectedPhraseId === meaningPairId) {
      const willFinish = matchedIds.length + 1 === BONUS_PHRASE_PAIRS.length;
      onMatchResult(selectedPhraseId, true);
      setSelectedPhraseId(null);
      if (willFinish) {
        onPlaySound('badge');
        onCelebrate();
        setFeedback({
          ok: true,
          text: 'Sempurna! Semua ungkapan puisi cocok! Kamu meraih Lencana Spesialis Ungkapan Puisi!',
        });
      } else {
        onPlaySound('success');
        setFeedback({
          ok: true,
          text: `${target.explanation} (+35 XP)`,
        });
      }
    } else {
      onPlaySound('error');
      onMatchResult(selectedPhraseId, false);
      setFeedback({
        ok: false,
        text: 'Belum cocok! Coba bayangkan kata kunci di dalam ungkapan itu.',
      });
    }
  };

  return (
    <section className="mx-auto max-w-4xl space-y-5" aria-labelledby="bonus-heading">
      <div className="clinic-card rounded-3xl p-5">
        <DokterPuisiMascot
          mood={allDone ? 'celebrate' : 'happy'}
          size="sm"
          coatColor={coatColor}
          stethoscopeColor={stethoscopeColor}
          label="Tantangan Bonus · Pojok Kata Ajaib"
          message={
            allDone
              ? 'Wah, hebat sekali! Kamu berhasil menaklukkan Tantangan Bonus Klinik Puisi dan meraih Lencana Spesialis Ungkapan Puisi!'
              : 'Selamat datang di Tantangan Bonus! Pasangkan 3 ungkapan indah dari puisi "Dahulu dan Kini" dengan maknanya yang tepat!'
          }
        />
      </div>

      <div className="clinic-card rounded-3xl border-2 border-violet-300 bg-white p-6 md:p-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b-2 border-violet-100 pb-4">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-600 text-white shadow-sm">
              <Wand2 className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-violet-700">
                Tantangan Bonus · Pojok Kata Ajaib
              </p>
              <h1 id="bonus-heading" className="font-display text-2xl font-bold text-teal-950">
                Bedah Ungkapan Puisi &ldquo;Dahulu dan Kini&rdquo;
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold tabular-nums text-violet-800">
              Cocok: {matchedIds.length}/{BONUS_PHRASE_PAIRS.length} · Salah: {mistakes}
            </span>
            <button
              type="button"
              onClick={onReplayMission}
              className="btn-tactile inline-flex items-center gap-1.5 rounded-2xl border-2 border-slate-200 bg-white px-3 py-1.5 text-xs font-extrabold text-slate-700 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Ulangi</span>
            </button>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2.5">
            <p className="text-xs font-extrabold uppercase text-violet-800">
              1. Pilih Ungkapan Puisi
            </p>
            {BONUS_PHRASE_PAIRS.map((pair) => {
              const matched = matchedIds.includes(pair.id);
              const active = selectedPhraseId === pair.id;
              return (
                <button
                  key={pair.id}
                  type="button"
                  disabled={matched}
                  onClick={() => {
                    onPlaySound('click');
                    setSelectedPhraseId(active ? null : pair.id);
                  }}
                  className={`btn-tactile w-full rounded-2xl border-2 p-3.5 text-left transition ${
                    matched
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                      : active
                      ? 'border-violet-600 bg-violet-100 text-violet-950 ring-2 ring-violet-300'
                      : 'border-violet-200 bg-white text-slate-800 hover:border-violet-400'
                  }`}
                >
                  <span className="block text-[11px] font-extrabold opacity-70">{pair.lineRef}</span>
                  <span className="text-sm font-extrabold">{pair.phrase}</span>
                </button>
              );
            })}
          </div>

          <div className="space-y-2.5">
            <p className="text-xs font-extrabold uppercase text-teal-800">
              2. Pasangkan dengan Maknanya
            </p>
            {MEANING_DISPLAY_ORDER.map((id) => {
              const pair = BONUS_PHRASE_PAIRS.find((p) => p.id === id);
              if (!pair) return null;
              const matched = matchedIds.includes(pair.id);
              return (
                <button
                  key={pair.id}
                  type="button"
                  disabled={matched}
                  onClick={() => handleSelectMeaning(pair.id)}
                  className={`btn-tactile flex w-full items-center gap-2 rounded-2xl border-2 p-3.5 text-left text-xs font-extrabold transition ${
                    matched
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                      : 'border-teal-200 bg-teal-50/40 text-slate-800 hover:border-teal-500 hover:bg-teal-50'
                  }`}
                >
                  {matched && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />}
                  <span>{pair.meaning}</span>
                </button>
              );
            })}
          </div>
        </div>

        {feedback && (
          <motion.div
            key={feedback.text}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            role="status"
            aria-live="polite"
            className={`mt-4 rounded-2xl border-2 p-3.5 text-sm font-bold ${
              feedback.ok
                ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                : 'border-amber-300 bg-amber-50 text-amber-950'
            }`}
          >
            {feedback.text}
          </motion.div>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t-2 border-violet-100 pt-4">
          <button
            type="button"
            onClick={onOpenMap}
            className="btn-tactile inline-flex items-center gap-2 rounded-2xl border-2 border-teal-200 bg-white px-5 py-3 text-sm font-extrabold text-teal-900 hover:bg-teal-50"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Kembali ke Peta Klinik</span>
          </button>

          {allDone && (
            <span className="inline-flex items-center gap-1.5 text-sm font-extrabold text-violet-700">
              <Sparkles className="h-4 w-4 text-amber-500" aria-hidden="true" />
              Lencana Spesialis Ungkapan Puisi Diraih!
            </span>
          )}
        </div>
      </div>
    </section>
  );
};
