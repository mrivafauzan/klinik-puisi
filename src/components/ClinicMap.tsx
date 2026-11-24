import React from 'react';
import { motion } from 'motion/react';
import {
  Award,
  CheckCircle2,
  FlaskConical,
  Lock,
  Play,
  RotateCcw,
  Search,
  Siren,
  Sparkles,
  Star,
  Stethoscope,
  Wand2,
} from 'lucide-react';
import { COAT_STYLES, MISSIONS_META, STETHOSCOPE_STYLES } from '../data/poemData';
import { ClinicGameState, MissionKey, ScreenId } from '../types/clinic';
import { DokterPuisiMascot } from './DokterPuisiMascot';

interface ClinicMapProps {
  state: ClinicGameState;
  onOpenMission: (screen: ScreenId) => void;
  onReplayMission: (mission: MissionKey) => void;
}

const ICON_MAP: Record<MissionKey, React.FC<{ className?: string }>> = {
  misi1: Siren,
  misi2: Search,
  misi3: FlaskConical,
  misi4: Stethoscope,
  misi5: Award,
  bonus: Wand2,
};

export const ClinicMap: React.FC<ClinicMapProps> = ({
  state,
  onOpenMission,
  onReplayMission,
}) => {
  const selectedCoat = COAT_STYLES.find((c) => c.id === state.coatStyle) ?? COAT_STYLES[0];
  const selectedSteth =
    STETHOSCOPE_STYLES.find((s) => s.id === state.stethoscopeStyle) ?? STETHOSCOPE_STYLES[0];

  const isMissionUnlocked = (key: MissionKey): boolean => {
    if (key === 'misi1') return true;
    if (key === 'misi2') return state.progress.misi1.completed;
    if (key === 'misi3') return state.progress.misi2.completed;
    if (key === 'misi4') return state.progress.misi3.completed;
    if (key === 'misi5') return state.progress.misi4.completed;
    if (key === 'bonus') return state.progress.misi3.completed;
    return false;
  };

  const nextMission =
    MISSIONS_META.find((m) => isMissionUnlocked(m.key) && !state.progress[m.key].completed) ??
    MISSIONS_META[0];

  return (
    <section className="space-y-6" aria-labelledby="clinic-map-heading">
      {/* Banner Dokter & Identitas Singkat */}
      <div className="clinic-card rounded-3xl p-5 md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <DokterPuisiMascot
              mood={state.progress.misi5.completed ? 'celebrate' : 'guide'}
              size="sm"
              coatColor={selectedCoat.trimColor}
              stethoscopeColor={selectedSteth.hex}
              label={`Dokter ${state.doctorName.trim() || 'Muda'} · Peta Klinik Puisi`}
              message={
                state.progress.misi5.completed
                  ? 'Semua misi utama sudah tuntas! Kamu bisa mengulang misi atau menaklukkan Tantangan Bonus di Pojok Kata Ajaib!'
                  : `Peta Klinik siap! Tugas berikutnya adalah ${nextMission.numberLabel}: ${nextMission.title}. Ketuk ruangan yang terbuka untuk mulai bermain!`
              }
            />
          </div>

          <div className="flex shrink-0 items-center gap-3 rounded-2xl border-2 border-teal-200 bg-teal-50/80 px-4 py-3">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wide text-teal-700">
                Kartu Dokter Aktif
              </p>
              <p className="font-display text-lg font-bold text-teal-950">
                {state.doctorName.trim() || 'Dokter Puisi Cilik'}
              </p>
              <p className="text-xs font-bold text-slate-600">
                {selectedCoat.name} · Stetoskop {selectedSteth.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Peta Ruangan Klinik Interaktif */}
      <div className="clinic-card rounded-3xl p-6 md:p-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-teal-700">
              Peta Klinik Interaktif · Operasi Bedah Puisi
            </p>
            <h1 id="clinic-map-heading" className="font-display text-2xl font-bold text-teal-950 md:text-3xl">
              Pilih Ruangan Misi Dokter Puisi
            </h1>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-teal-800">
            <Sparkles className="h-4 w-4 text-amber-500" aria-hidden="true" />
            Total Skor: <span className="tabular-nums">{state.xp} XP</span>
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MISSIONS_META.map((mission, index) => {
            const unlocked = isMissionUnlocked(mission.key);
            const prog = state.progress[mission.key];
            const isNext = unlocked && !prog.completed && nextMission.key === mission.key;
            const Icon = ICON_MAP[mission.key];
            const isBonus = mission.key === 'bonus';

            return (
              <motion.article
                key={mission.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className={`relative flex flex-col justify-between rounded-3xl border-2 p-5 transition ${
                  !unlocked
                    ? 'border-slate-200 bg-slate-50/90 opacity-80'
                    : isNext
                    ? `${mission.accentBorder} ${mission.accentBg} shadow-lg ring-4 ring-teal-400/20`
                    : prog.completed
                    ? 'border-emerald-300 bg-white shadow-sm'
                    : `${mission.accentBorder} ${mission.accentBg} shadow-sm`
                }`}
              >
                <div>
                  {/* Baris Atas Ruangan */}
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl shadow-sm ${
                          !unlocked
                            ? 'bg-slate-200 text-slate-500'
                            : isBonus
                            ? 'bg-violet-600 text-white'
                            : prog.completed
                            ? 'bg-emerald-500 text-white'
                            : 'bg-teal-600 text-white'
                        }`}
                      >
                        {unlocked ? <Icon className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                      </span>
                      <div>
                        <p className="text-[11px] font-extrabold uppercase tracking-wider text-teal-800">
                          {mission.numberLabel} · {mission.roomName}
                        </p>
                        <h2 className="font-display text-lg font-bold leading-tight text-teal-950">
                          {mission.title}
                        </h2>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs font-bold leading-relaxed text-slate-700">
                    {mission.shortTask}
                  </p>
                </div>

                <div className="mt-4 space-y-3 border-t border-slate-200/80 pt-3">
                  {/* Bintang & XP */}
                  <div className="flex items-center justify-between text-xs font-extrabold">
                    <div className="flex items-center gap-1" aria-label={`${prog.stars} dari 3 bintang`}>
                      {[1, 2, 3].map((s) => (
                        <Star
                          key={s}
                          className={`h-4 w-4 ${
                            s <= prog.stars
                              ? 'fill-amber-400 text-amber-500'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>

                    <span className="tabular-nums text-teal-800">
                      {prog.completed ? 'Selesai' : unlocked ? `Hingga +${mission.maxXp} XP` : 'Terkunci'}
                    </span>
                  </div>

                  {/* Tombol Aksi Ruangan */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={!unlocked}
                      onClick={() => onOpenMission(mission.key)}
                      className={`btn-tactile inline-flex flex-1 items-center justify-center gap-1.5 rounded-2xl px-4 py-2.5 text-xs font-extrabold transition whitespace-nowrap ${
                        !unlocked
                          ? 'cursor-not-allowed bg-slate-200 text-slate-500'
                          : prog.completed
                          ? 'border-2 border-teal-200 bg-teal-50 text-teal-900 hover:bg-teal-100'
                          : 'border-b-4 border-teal-800 bg-teal-600 text-white hover:bg-teal-500'
                      }`}
                    >
                      {prog.completed ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                          <span>Masuk Ruangan</span>
                        </>
                      ) : unlocked ? (
                        <>
                          <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                          <span>Mainkan Misi</span>
                        </>
                      ) : (
                        <>
                          <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Selesaikan Misi Sebelumnya</span>
                        </>
                      )}
                    </button>

                    {prog.completed && (
                      <button
                        type="button"
                        onClick={() => onReplayMission(mission.key)}
                        title={`Ulangi ${mission.title}`}
                        aria-label={`Ulangi ${mission.title}`}
                        className="btn-tactile grid h-10 w-10 shrink-0 place-items-center rounded-2xl border-2 border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
