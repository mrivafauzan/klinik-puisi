import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Sparkles, Users } from 'lucide-react';
import { ClinicDoorTransition } from './components/ClinicDoorTransition';
import { ClinicMap } from './components/ClinicMap';
import { ConfettiBurst } from './components/ConfettiBurst';
import { PoemModal } from './components/PoemModal';
import { TopBar } from './components/TopBar';
import { BonusChallenge } from './components/missions/BonusChallenge';
import { Mission1Emergency } from './components/missions/Mission1Emergency';
import { Mission2Examination } from './components/missions/Mission2Examination';
import { Mission3Lab } from './components/missions/Mission3Lab';
import { Mission4Diagnosis } from './components/missions/Mission4Diagnosis';
import { Mission5Report } from './components/missions/Mission5Report';
import {
  BONUS_PHRASE_PAIRS,
  COAT_STYLES,
  LAB_CARDS,
  MISSIONS_META,
  STETHOSCOPE_STYLES,
  createInitialGameState,
} from './data/poemData';
import { ClinicGameState, MissionKey, ScreenId } from './types/clinic';
import { SoundEffectType, playFeedbackSound } from './utils/sound';

const STORAGE_KEY = 'klinik-puisi-game-v4';

function loadSavedState(): ClinicGameState {
  const base = createInitialGameState();
  if (typeof window === 'undefined') return base;
  try {
    const raw =
      window.sessionStorage.getItem(STORAGE_KEY) ||
      window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw) as Partial<ClinicGameState>;
    if (!parsed || typeof parsed !== 'object') return base;
    return {
      ...base,
      ...parsed,
      progress: { ...base.progress, ...(parsed.progress || {}) },
      labPlacements: { ...base.labPlacements, ...(parsed.labPlacements || {}) },
    };
  } catch {
    return base;
  }
}

export default function App() {
  const [state, setState] = useState<ClinicGameState>(() => loadSavedState());
  const [isPoemModalOpen, setIsPoemModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isDoorAnimating, setIsDoorAnimating] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const [xpBanner, setXpBanner] = useState<string | null>(null);
  const xpTimerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    try {
      const serialized = JSON.stringify(state);
      window.sessionStorage.setItem(STORAGE_KEY, serialized);
      window.localStorage.setItem(STORAGE_KEY, serialized);
    } catch {
      // Abaikan jika penyimpanan penuh
    }
  }, [state]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.22;
    if (state.musicEnabled) {
      audio.play().catch(() => {
        setState((prev) => ({ ...prev, musicEnabled: false }));
      });
    } else {
      audio.pause();
    }
  }, [state.musicEnabled]);

  useEffect(() => {
    return () => {
      if (xpTimerRef.current) window.clearTimeout(xpTimerRef.current);
    };
  }, []);

  const showXpBanner = (msg: string) => {
    setXpBanner(msg);
    if (xpTimerRef.current) window.clearTimeout(xpTimerRef.current);
    xpTimerRef.current = window.setTimeout(() => setXpBanner(null), 2600);
  };

  const handleSound = (type: SoundEffectType) => {
    playFeedbackSound(type, state.soundMuted);
  };

  const triggerConfetti = () => {
    setConfettiKey((k) => k + 1);
  };

  const navigateTo = (screen: ScreenId, celebrate = false) => {
    setState((prev) => ({ ...prev, currentScreen: screen }));
    if (celebrate) triggerConfetti();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const completeMission = (key: MissionKey, stars: number, xpReward: number, label: string) => {
    setState((prev) => {
      const prevProg = prev.progress[key];
      const earnedXp = prevProg.completed ? 0 : xpReward;
      return {
        ...prev,
        xp: prev.xp + earnedXp,
        progress: {
          ...prev.progress,
          [key]: {
            completed: true,
            stars: Math.max(prevProg.stars, stars),
          },
        },
      };
    });
    showXpBanner(label);
  };

  const handleAcceptEmergency = () => {
    setState((prev) => {
      const firstTime = !prev.progress.misi1.completed;
      return {
        ...prev,
        emergencyAccepted: true,
        xp: prev.xp + (firstTime ? 100 : 0),
        progress: {
          ...prev.progress,
          misi1: { completed: true, stars: 3 },
        },
      };
    });
    triggerConfetti();
    showXpBanner('Misi 1 Selesai! +100 XP & 3 Bintang');
  };

  const handleStartMission2FromMisi1 = () => {
    handleSound('success');
    setIsDoorAnimating(true);
    window.setTimeout(() => {
      navigateTo('misi2');
      setIsDoorAnimating(false);
    }, 800);
  };

  const handleCompleteMission2AndNext = () => {
    const stars = state.misi2HintLevel === 0 ? 3 : state.misi2HintLevel === 1 ? 2 : 1;
    const xpReward = 150;
    const firstTime = !state.progress.misi2.completed;
    handleSound('complete');
    completeMission(
      'misi2',
      stars,
      xpReward,
      firstTime ? `Misi 2 Tuntas! +${xpReward} XP & ${stars} Bintang` : 'Misi 2 Diperbarui!'
    );
    navigateTo('misi3', true);
  };

  const handleScanLabCard = (cardId: string, zone: 'dahulu' | 'kini', isCorrect: boolean) => {
    if (!isCorrect) {
      setState((prev) => ({ ...prev, labMistakes: prev.labMistakes + 1 }));
      return;
    }

    setState((prev) => {
      const nextPlacements = { ...prev.labPlacements, [cardId]: zone };
      const remaining = LAB_CARDS.filter((c) => nextPlacements[c.id] === 'tray').length;
      const firstTimeMission = !prev.progress.misi3.completed;
      const xpGain = firstTimeMission ? 30 : 0;

      if (remaining === 0) {
        const stars = prev.labMistakes === 0 ? 3 : prev.labMistakes <= 2 ? 2 : 1;
        return {
          ...prev,
          xp: prev.xp + xpGain,
          labPlacements: nextPlacements,
          progress: {
            ...prev.progress,
            misi3: { completed: true, stars: Math.max(prev.progress.misi3.stars, stars) },
          },
        };
      }

      return {
        ...prev,
        xp: prev.xp + xpGain,
        labPlacements: nextPlacements,
      };
    });
  };

  const handleSaveDiagnosis = () => {
    const stars = state.misi4HintLevel === 0 ? 3 : state.misi4HintLevel === 1 ? 2 : 1;
    const firstTime = !state.progress.misi4.completed;
    setState((prev) => ({
      ...prev,
      diagnosisSaved: true,
      xp: prev.xp + (firstTime ? 200 : 0),
      progress: {
        ...prev.progress,
        misi4: { completed: true, stars: Math.max(prev.progress.misi4.stars, stars) },
      },
    }));
    triggerConfetti();
    if (firstTime) showXpBanner(`Misi 4 Tuntas! +200 XP & ${stars} Bintang`);
  };

  const handleHealPatient = () => {
    const firstTime = !state.progress.misi5.completed;
    setState((prev) => ({
      ...prev,
      patientHealed: true,
      xp: prev.xp + (firstTime ? 150 : 0),
      progress: {
        ...prev.progress,
        misi5: { completed: true, stars: 3 },
      },
    }));
    if (firstTime) showXpBanner('Misi 5 Tuntas! Pasien Puisi Sembuh! +150 XP');
  };

  const handleBonusMatch = (pairId: string, isCorrect: boolean) => {
    if (!isCorrect) {
      setState((prev) => ({ ...prev, bonusMistakes: prev.bonusMistakes + 1 }));
      return;
    }

    setState((prev) => {
      if (prev.bonusMatchedIds.includes(pairId)) return prev;
      const nextMatched = [...prev.bonusMatchedIds, pairId];
      const finished = nextMatched.length === BONUS_PHRASE_PAIRS.length;
      const firstTimeBonus = !prev.progress.bonus.completed;
      const xpAdd = firstTimeBonus ? (finished ? 30 : 35) : 0;
      const stars = prev.bonusMistakes === 0 ? 3 : prev.bonusMistakes === 1 ? 2 : 1;

      if (finished) {
        showXpBanner(firstTimeBonus ? 'Tantangan Bonus Selesai! +100 XP' : 'Tantangan Bonus Selesai!');
      }

      return {
        ...prev,
        bonusMatchedIds: nextMatched,
        xp: prev.xp + xpAdd,
        progress: finished
          ? {
              ...prev.progress,
              bonus: { completed: true, stars: Math.max(prev.progress.bonus.stars, stars) },
            }
          : prev.progress,
      };
    });
  };

  const handleReplayMission = (mission: MissionKey) => {
    handleSound('click');
    setState((prev) => {
      if (mission === 'misi1') {
        return { ...prev, currentScreen: 'misi1', emergencyAccepted: false };
      }
      if (mission === 'misi2') {
        return {
          ...prev,
          currentScreen: 'misi2',
          highlightedLines: [],
          stethoscopeUsed: false,
          misi2HintLevel: 0,
        };
      }
      if (mission === 'misi3') {
        return {
          ...prev,
          currentScreen: 'misi3',
          labPlacements: {
            lapangan: 'tray',
            perumahan: 'tray',
            layangan: 'tray',
            kali: 'tray',
            sungai: 'tray',
          },
          labMistakes: 0,
          misi3HintLevel: 0,
        };
      }
      if (mission === 'misi4') {
        return {
          ...prev,
          currentScreen: 'misi4',
          arrangedCardIds: [],
          selectedProofLines: [],
          diagnosisMeaning: '',
          diagnosisReason: '',
          misi4HintLevel: 0,
          diagnosisSaved: false,
        };
      }
      if (mission === 'misi5') {
        return {
          ...prev,
          currentScreen: 'misi5',
          patientHealed: false,
        };
      }
      return {
        ...prev,
        currentScreen: 'bonus',
        bonusMatchedIds: [],
        bonusMistakes: 0,
      };
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFullReset = () => {
    const fresh = createInitialGameState();
    setState({
      ...fresh,
      soundMuted: state.soundMuted,
      musicEnabled: false,
    });
    setIsResetModalOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedCoat = COAT_STYLES.find((c) => c.id === state.coatStyle) ?? COAT_STYLES[0];
  const selectedSteth =
    STETHOSCOPE_STYLES.find((s) => s.id === state.stethoscopeStyle) ?? STETHOSCOPE_STYLES[0];

  const currentMissionMeta = MISSIONS_META.find((m) => m.key === state.currentScreen);

  return (
    <div className="min-h-screen pb-14">
      <ClinicDoorTransition isOpen={isDoorAnimating} />
      <ConfettiBurst triggerKey={confettiKey} />

      <TopBar
        state={state}
        onNavigate={(screen) => {
          handleSound('click');
          navigateTo(screen);
        }}
        onToggleSound={() =>
          setState((prev) => ({ ...prev, soundMuted: !prev.soundMuted }))
        }
        onToggleMusic={() =>
          setState((prev) => ({ ...prev, musicEnabled: !prev.musicEnabled }))
        }
        onOpenPoem={() => {
          handleSound('click');
          setIsPoemModalOpen(true);
        }}
        onRequestReset={() => {
          handleSound('click');
          setIsResetModalOpen(true);
        }}
      />

      {/* Toast XP / Pencapaian */}
      <AnimatePresence>
        {xpBanner && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="no-print fixed left-1/2 top-20 z-50 -translate-x-1/2"
          >
            <div className="inline-flex items-center gap-2 rounded-2xl border-2 border-amber-400 bg-amber-100 px-5 py-2.5 text-sm font-extrabold text-amber-950 shadow-xl">
              <Sparkles className="h-4 w-4 text-amber-600" aria-hidden="true" />
              <span>{xpBanner}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="mx-auto max-w-6xl px-4 pt-5">
        {currentMissionMeta && (
          <div className="no-print mb-5 flex flex-wrap items-center justify-between gap-2 rounded-2xl border-2 border-teal-200/80 bg-white/90 px-4 py-2 text-xs font-extrabold text-teal-950 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-teal-700" aria-hidden="true" />
              <span>{currentMissionMeta.tpsHint}</span>
            </div>
            <span className="text-teal-700">
              {currentMissionMeta.numberLabel}: {currentMissionMeta.title}
            </span>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={state.currentScreen}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {state.currentScreen === 'map' && (
              <ClinicMap
                state={state}
                onOpenMission={(screen) => {
                  handleSound('click');
                  navigateTo(screen);
                }}
                onReplayMission={handleReplayMission}
              />
            )}

            {state.currentScreen === 'misi1' && (
              <Mission1Emergency
                doctorName={state.doctorName}
                partnerDoctorName={state.partnerDoctorName}
                coatStyle={state.coatStyle}
                stethoscopeStyle={state.stethoscopeStyle}
                emergencyAccepted={state.emergencyAccepted}
                onAcceptEmergency={handleAcceptEmergency}
                onUpdateNames={(doctorName, partnerDoctorName) =>
                  setState((prev) => ({ ...prev, doctorName, partnerDoctorName }))
                }
                onSelectCoat={(coatStyle) => setState((prev) => ({ ...prev, coatStyle }))}
                onSelectStethoscope={(stethoscopeStyle) =>
                  setState((prev) => ({ ...prev, stethoscopeStyle }))
                }
                onPlaySound={handleSound}
                onStartMission2={handleStartMission2FromMisi1}
                onOpenMap={() => {
                  handleSound('click');
                  navigateTo('map');
                }}
              />
            )}

            {state.currentScreen === 'misi2' && (
              <Mission2Examination
                coatColor={selectedCoat.trimColor}
                stethoscopeColor={selectedSteth.hex}
                magnifierEnabled={state.magnifierEnabled}
                poemZoom={state.poemZoom}
                highlightedLines={state.highlightedLines}
                stethoscopeUsed={state.stethoscopeUsed}
                hintLevel={state.misi2HintLevel}
                onToggleMagnifier={() =>
                  setState((prev) => ({ ...prev, magnifierEnabled: !prev.magnifierEnabled }))
                }
                onChangeZoom={(poemZoom) => setState((prev) => ({ ...prev, poemZoom }))}
                onToggleLine={(lineNumber) =>
                  setState((prev) => {
                    const exists = prev.highlightedLines.includes(lineNumber);
                    return {
                      ...prev,
                      highlightedLines: exists
                        ? prev.highlightedLines.filter((n) => n !== lineNumber)
                        : [...prev.highlightedLines, lineNumber],
                    };
                  })
                }
                onMarkStethoscopeUsed={() =>
                  setState((prev) => ({ ...prev, stethoscopeUsed: true }))
                }
                onRevealHint={() =>
                  setState((prev) => ({
                    ...prev,
                    misi2HintLevel:
                      prev.misi2HintLevel < 3
                        ? ((prev.misi2HintLevel + 1) as 0 | 1 | 2 | 3)
                        : 3,
                  }))
                }
                onReplayMission={() => handleReplayMission('misi2')}
                onPlaySound={handleSound}
                onOpenMap={() => {
                  handleSound('click');
                  navigateTo('map');
                }}
                onNextMission={handleCompleteMission2AndNext}
              />
            )}

            {state.currentScreen === 'misi3' && (
              <Mission3Lab
                coatColor={selectedCoat.trimColor}
                stethoscopeColor={selectedSteth.hex}
                partnerDoctorName={state.partnerDoctorName}
                placements={state.labPlacements}
                mistakes={state.labMistakes}
                hintLevel={state.misi3HintLevel}
                onScanCard={handleScanLabCard}
                onRevealHint={() =>
                  setState((prev) => ({
                    ...prev,
                    misi3HintLevel:
                      prev.misi3HintLevel < 3
                        ? ((prev.misi3HintLevel + 1) as 0 | 1 | 2 | 3)
                        : 3,
                  }))
                }
                onReplayMission={() => handleReplayMission('misi3')}
                onPlaySound={handleSound}
                onCelebrate={triggerConfetti}
                onOpenMap={() => {
                  handleSound('click');
                  navigateTo('map');
                }}
                onNextMission={() => {
                  handleSound('success');
                  navigateTo('misi4');
                }}
              />
            )}

            {state.currentScreen === 'misi4' && (
              <Mission4Diagnosis
                coatColor={selectedCoat.trimColor}
                stethoscopeColor={selectedSteth.hex}
                partnerDoctorName={state.partnerDoctorName}
                highlightedLinesFromMisi2={state.highlightedLines}
                arrangedCardIds={state.arrangedCardIds}
                selectedProofLines={state.selectedProofLines}
                diagnosisMeaning={state.diagnosisMeaning}
                diagnosisReason={state.diagnosisReason}
                hintLevel={state.misi4HintLevel}
                diagnosisSaved={state.diagnosisSaved}
                onAddCard={(cardId) =>
                  setState((prev) => ({
                    ...prev,
                    arrangedCardIds: prev.arrangedCardIds.includes(cardId)
                      ? prev.arrangedCardIds
                      : [...prev.arrangedCardIds, cardId],
                  }))
                }
                onRemoveCard={(cardId) =>
                  setState((prev) => ({
                    ...prev,
                    arrangedCardIds: prev.arrangedCardIds.filter((id) => id !== cardId),
                  }))
                }
                onMoveCard={(cardId, direction) =>
                  setState((prev) => {
                    const list = [...prev.arrangedCardIds];
                    const idx = list.indexOf(cardId);
                    if (idx === -1) return prev;
                    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
                    if (swapIdx < 0 || swapIdx >= list.length) return prev;
                    [list[idx], list[swapIdx]] = [list[swapIdx], list[idx]];
                    return { ...prev, arrangedCardIds: list };
                  })
                }
                onToggleProofLine={(lineNum) =>
                  setState((prev) => {
                    const exists = prev.selectedProofLines.includes(lineNum);
                    return {
                      ...prev,
                      selectedProofLines: exists
                        ? prev.selectedProofLines.filter((n) => n !== lineNum)
                        : [...prev.selectedProofLines, lineNum].sort((a, b) => a - b),
                    };
                  })
                }
                onChangeMeaning={(diagnosisMeaning) =>
                  setState((prev) => ({ ...prev, diagnosisMeaning }))
                }
                onChangeReason={(diagnosisReason) =>
                  setState((prev) => ({ ...prev, diagnosisReason }))
                }
                onRevealHint={() =>
                  setState((prev) => ({
                    ...prev,
                    misi4HintLevel:
                      prev.misi4HintLevel < 3
                        ? ((prev.misi4HintLevel + 1) as 0 | 1 | 2 | 3)
                        : 3,
                  }))
                }
                onSaveDiagnosis={handleSaveDiagnosis}
                onReplayMission={() => handleReplayMission('misi4')}
                onPlaySound={handleSound}
                onOpenMap={() => {
                  handleSound('click');
                  navigateTo('map');
                }}
                onNextMission={() => {
                  handleSound('success');
                  navigateTo('misi5');
                }}
              />
            )}

            {state.currentScreen === 'misi5' && (
              <Mission5Report
                state={state}
                onHealPatient={handleHealPatient}
                onChangeReflection={(reflectionNote) =>
                  setState((prev) => ({ ...prev, reflectionNote }))
                }
                onReplayMission={() => handleReplayMission('misi5')}
                onOpenBonus={() => {
                  handleSound('click');
                  navigateTo('bonus');
                }}
                onOpenMap={() => {
                  handleSound('click');
                  navigateTo('map');
                }}
                onPlaySound={handleSound}
                onCelebrate={triggerConfetti}
              />
            )}

            {state.currentScreen === 'bonus' && (
              <BonusChallenge
                coatColor={selectedCoat.trimColor}
                stethoscopeColor={selectedSteth.hex}
                matchedIds={state.bonusMatchedIds}
                mistakes={state.bonusMistakes}
                onMatchResult={handleBonusMatch}
                onReplayMission={() => handleReplayMission('bonus')}
                onPlaySound={handleSound}
                onCelebrate={triggerConfetti}
                onOpenMap={() => {
                  handleSound('click');
                  navigateTo('map');
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <PoemModal
        isOpen={isPoemModalOpen}
        highlightedLines={state.highlightedLines}
        onClose={() => setIsPoemModalOpen(false)}
      />

      {isResetModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-teal-950/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsResetModalOpen(false);
          }}
        >
          <div className="w-full max-w-md rounded-3xl border-4 border-teal-200 bg-white p-6 text-center shadow-2xl">
            <h2 id="reset-modal-title" className="font-display text-xl font-bold text-teal-950">
              Mulai Ulang Permainan Klinik Puisi?
            </h2>
            <p className="mt-2 text-sm font-bold text-slate-600">
              Semua XP, bintang, lencana, dan catatan diagnosismu akan direset agar kamu bisa
              bermain lagi dari Misi 1.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setIsResetModalOpen(false)}
                className="btn-tactile flex-1 rounded-2xl border-2 border-teal-200 bg-white py-2.5 text-sm font-extrabold text-teal-900 hover:bg-teal-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleFullReset}
                className="btn-tactile flex-1 rounded-2xl border-b-4 border-rose-700 bg-rose-500 py-2.5 text-sm font-extrabold text-white hover:bg-rose-600"
              >
                Ya, Mulai Ulang
              </button>
            </div>
          </div>
        </div>
      )}

      <audio ref={audioRef} loop preload="none">
        <source src="/assets/aistudio/hospital-beeps_55da05ff.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}
