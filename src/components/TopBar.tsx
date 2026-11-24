import React from 'react';
import {
  BookOpen,
  Map,
  Music,
  RotateCcw,
  Sparkles,
  Star,
  Stethoscope,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { MISSIONS_META } from '../data/poemData';
import { ClinicGameState, ScreenId } from '../types/clinic';

interface TopBarProps {
  state: ClinicGameState;
  onNavigate: (screen: ScreenId) => void;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onOpenPoem: () => void;
  onRequestReset: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  state,
  onNavigate,
  onToggleSound,
  onToggleMusic,
  onOpenPoem,
  onRequestReset,
}) => {
  const coreKeys = ['misi1', 'misi2', 'misi3', 'misi4', 'misi5'] as const;
  const completedCount = coreKeys.filter((k) => state.progress[k].completed).length;
  const totalStars = Object.values(state.progress).reduce((sum, p) => sum + p.stars, 0);
  const maxStars = MISSIONS_META.length * 3;
  const progressPercent = Math.round((completedCount / coreKeys.length) * 100);

  return (
    <header className="no-print sticky top-0 z-40 border-b-2 border-teal-200/80 bg-white/92 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Logo Klinik Puisi */}
          <button
            type="button"
            onClick={() => onNavigate(state.emergencyAccepted ? 'map' : 'misi1')}
            className="flex items-center gap-2.5 text-left transition-transform hover:scale-[1.02]"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-md">
              <Stethoscope className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <span className="font-display block text-base font-bold leading-tight text-teal-950 sm:text-lg">
                Klinik Puisi
              </span>
              <span className="block text-[11px] font-bold text-teal-700">
                Operasi Bedah Puisi · Kelas IV SD
              </span>
            </div>
          </button>

          {/* Progress bar Misi + XP + Bintang */}
          <div className="order-3 flex w-full flex-wrap items-center gap-3 md:order-2 md:w-auto">
            <div className="min-w-[165px] flex-1 md:w-44">
              <div className="mb-1 flex items-center justify-between text-[11px] font-extrabold text-teal-950">
                <span>
                  Misi {completedCount} / {coreKeys.length} Selesai
                </span>
                <span className="tabular-nums text-teal-700">{progressPercent}%</span>
              </div>
              <div
                className="h-2.5 w-full overflow-hidden rounded-full border border-teal-200 bg-teal-50"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={coreKeys.length}
                aria-valuenow={completedCount}
                aria-label="Progres misi Klinik Puisi"
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal-500 via-emerald-400 to-amber-400 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-extrabold text-teal-950">
              <span className="inline-flex items-center gap-1 tabular-nums text-amber-700">
                <Star className="h-4 w-4 fill-amber-400 text-amber-500" aria-hidden="true" />
                {totalStars}/{maxStars}
              </span>
              <span className="text-slate-300" aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1 tabular-nums text-teal-800">
                <Sparkles className="h-4 w-4 text-teal-600" aria-hidden="true" />
                {state.xp} XP
              </span>
            </div>
          </div>

          {/* Kontrol Game */}
          <div className="order-2 flex items-center gap-1.5 md:order-3">
            <button
              type="button"
              onClick={() => onNavigate('map')}
              className={`btn-tactile inline-flex items-center gap-1.5 rounded-xl border-2 px-3 py-1.5 text-xs font-extrabold transition whitespace-nowrap ${
                state.currentScreen === 'map'
                  ? 'border-teal-600 bg-teal-600 text-white shadow-sm'
                  : 'border-sky-200 bg-sky-50 text-sky-900 hover:bg-sky-100'
              }`}
            >
              <Map className="h-4 w-4" aria-hidden="true" />
              <span>Peta Klinik</span>
            </button>

            <button
              type="button"
              onClick={onOpenPoem}
              className="btn-tactile inline-flex items-center gap-1.5 rounded-xl border-2 border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-extrabold text-teal-900 hover:bg-teal-100 whitespace-nowrap"
              title="Baca ulang puisi kapan saja"
            >
              <BookOpen className="h-4 w-4 text-teal-700" aria-hidden="true" />
              <span className="hidden sm:inline">Baca Puisi</span>
            </button>

            <button
              type="button"
              onClick={onToggleSound}
              aria-pressed={!state.soundMuted}
              aria-label={state.soundMuted ? 'Aktifkan efek suara' : 'Matikan efek suara'}
              title={state.soundMuted ? 'Efek suara mati' : 'Efek suara aktif'}
              className="grid h-9 w-9 place-items-center rounded-xl border-2 border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
            >
              {state.soundMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4 text-teal-700" />
              )}
            </button>

            <button
              type="button"
              onClick={onToggleMusic}
              aria-pressed={state.musicEnabled}
              aria-label={state.musicEnabled ? 'Matikan musik latar' : 'Putar musik latar'}
              title={state.musicEnabled ? 'Musik klinik menyala' : 'Musik klinik mati'}
              className={`grid h-9 w-9 place-items-center rounded-xl border-2 transition ${
                state.musicEnabled
                  ? 'border-amber-300 bg-amber-100 text-amber-800'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Music className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={onRequestReset}
              aria-label="Ulangi semua misi dari awal"
              title="Ulangi permainan dari awal"
              className="grid h-9 w-9 place-items-center rounded-xl border-2 border-slate-200 bg-white text-slate-600 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
