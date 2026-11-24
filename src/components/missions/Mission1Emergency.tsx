import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  BadgeCheck,
  BellRing,
  HeartPulse,
  Map,
  Shirt,
  Siren,
  Sparkles,
  Stethoscope,
} from 'lucide-react';
import { COAT_STYLES, POEM_AUTHOR, POEM_TITLE, STETHOSCOPE_STYLES } from '../../data/poemData';
import { CoatStyleId, StethoscopeStyleId } from '../../types/clinic';
import { ExaminationDeskBookIllustration } from '../ClinicIllustrations';
import { DokterPuisiMascot } from '../DokterPuisiMascot';

interface Mission1EmergencyProps {
  doctorName: string;
  partnerDoctorName: string;
  coatStyle: CoatStyleId;
  stethoscopeStyle: StethoscopeStyleId;
  emergencyAccepted: boolean;
  onAcceptEmergency: () => void;
  onUpdateNames: (doctorName: string, partnerDoctorName: string) => void;
  onSelectCoat: (coat: CoatStyleId) => void;
  onSelectStethoscope: (steth: StethoscopeStyleId) => void;
  onPlaySound: (type: 'click' | 'alarm' | 'success') => void;
  onStartMission2: () => void;
  onOpenMap: () => void;
}

export const Mission1Emergency: React.FC<Mission1EmergencyProps> = ({
  doctorName,
  partnerDoctorName,
  coatStyle,
  stethoscopeStyle,
  emergencyAccepted,
  onAcceptEmergency,
  onUpdateNames,
  onSelectCoat,
  onSelectStethoscope,
  onPlaySound,
  onStartMission2,
  onOpenMap,
}) => {
  const [imgError, setImgError] = useState(false);

  const selectedCoat = COAT_STYLES.find((c) => c.id === coatStyle) ?? COAT_STYLES[0];
  const selectedSteth =
    STETHOSCOPE_STYLES.find((s) => s.id === stethoscopeStyle) ?? STETHOSCOPE_STYLES[0];

  return (
    <section className="space-y-6" aria-labelledby="misi1-heading">
      {/* PANGGILAN DARURAT KLINIK */}
      <AnimatePresence mode="wait">
        {!emergencyAccepted ? (
          <motion.div
            key="emergency-alarm"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -12 }}
            className="clinic-card overflow-hidden rounded-3xl border-4 border-rose-300 bg-gradient-to-br from-rose-50 via-white to-amber-50 p-6 md:p-8"
          >
            <div className="grid items-center gap-6 lg:grid-cols-12">
              <div className="space-y-5 lg:col-span-7">
                <div className="flex items-center gap-3">
                  <motion.span
                    animate={{ rotate: [0, -10, 10, -8, 8, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 1.1 }}
                    className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-rose-500 text-white shadow-lg"
                  >
                    <Siren className="h-7 w-7" aria-hidden="true" />
                  </motion.span>
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-wider text-rose-600">
                      Misi 1 · Panggilan Darurat Klinik Puisi
                    </p>
                    <h1
                      id="misi1-heading"
                      className="font-display text-2xl font-bold text-teal-950 md:text-4xl"
                    >
                      Kring! Ada Pasien Puisi Datang!
                    </h1>
                  </div>
                </div>

                <DokterPuisiMascot
                  mood="alert"
                  size="md"
                  coatColor={selectedCoat.trimColor}
                  stethoscopeColor={selectedSteth.hex}
                  label="Dokter Puisi · Siaga Klinik"
                  message="Halo, Dokter Puisi Cilik! Bel klinik baru saja berbunyi. Ada sebuah puisi yang butuh pemeriksaanmu hari ini. Ayo tekan tombol Terima Pasien!"
                />

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      onPlaySound('alarm');
                      onAcceptEmergency();
                    }}
                    className="btn-tactile inline-flex items-center gap-2.5 rounded-3xl border-b-4 border-rose-700 bg-gradient-to-r from-rose-500 to-amber-500 px-8 py-4 text-lg font-extrabold text-white shadow-xl hover:from-rose-600 hover:to-amber-600"
                  >
                    <BellRing className="h-6 w-6" aria-hidden="true" />
                    <span>TERIMA PASIEN</span>
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onPlaySound('alarm')}
                    className="btn-tactile inline-flex items-center gap-2 rounded-2xl border-2 border-rose-200 bg-white px-4 py-3 text-xs font-extrabold text-rose-700 hover:bg-rose-50"
                  >
                    <BellRing className="h-4 w-4" aria-hidden="true" />
                    <span>Dengar Bel Klinik</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="overflow-hidden rounded-3xl border-4 border-white bg-sky-50 shadow-lg">
                  {!imgError ? (
                    <img
                      src="/assets/aistudio/bg.image_d609e2f3.png"
                      alt="Interior Klinik Puisi ceria dengan meja resepsionis, sofa tunggu, rak buku, dan jas dokter"
                      className="h-60 w-full object-cover sm:h-64"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <div className="flex h-60 items-center justify-center bg-teal-50 p-4 text-center font-bold text-teal-800">
                      Ruang Resepsionis Klinik Puisi
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="patient-arrived"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Animasi Pasien Puisi Masuk + Identitas Pasien */}
            <div className="clinic-card overflow-hidden rounded-3xl border-2 border-teal-300 p-6 md:p-7">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b-2 border-dashed border-teal-200 pb-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
                    <HeartPulse className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-wider text-teal-700">
                      Misi 1 Selesai (+100 XP) · Pasien Sudah Masuk Klinik!
                    </p>
                    <h1
                      id="misi1-heading"
                      className="font-display text-2xl font-bold text-teal-950 md:text-3xl"
                    >
                      Pasien Puisi: &ldquo;{POEM_TITLE}&rdquo;
                    </h1>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700">
                  <Sparkles className="h-4 w-4 text-amber-500" aria-hidden="true" />
                  Siap Diperiksa
                </span>
              </div>

              <div className="grid items-center gap-6 lg:grid-cols-12">
                {/* Animasi pasien puisi meluncur masuk ke meja periksa */}
                <motion.div
                  initial={{ x: -60, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 120, damping: 16 }}
                  className="space-y-2 lg:col-span-6"
                >
                  <ExaminationDeskBookIllustration />
                  <p className="text-center text-xs font-bold text-teal-800">
                    Pasien puisi &ldquo;{POEM_TITLE}&rdquo; telah tiba di meja pemeriksaan!
                  </p>
                </motion.div>

                {/* Kartu Identitas Pasien & Keluhan Singkat */}
                <div className="space-y-2.5 rounded-3xl border-2 border-teal-200 bg-teal-50/70 p-5 lg:col-span-6">
                  <h2 className="font-display text-lg font-bold text-teal-950">
                    Identitas Pasien &amp; Keluhan
                  </h2>
                  <div className="rounded-2xl bg-white px-4 py-2.5 shadow-sm">
                    <p className="text-[11px] font-extrabold uppercase text-teal-700">Nama Pasien</p>
                    <p className="text-sm font-extrabold text-teal-950">
                      Puisi &ldquo;{POEM_TITLE}&rdquo; · Karya {POEM_AUTHOR}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white px-4 py-2.5 shadow-sm">
                    <p className="text-[11px] font-extrabold uppercase text-rose-600">Keluhan Utama</p>
                    <p className="text-sm font-bold text-slate-800">
                      Maksud puisi belum dipahami. Mengapa tokoh hanya bisa membayangkan cerita kakeknya?
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white px-4 py-2.5 shadow-sm">
                    <p className="text-[11px] font-extrabold uppercase text-amber-700">Tugas Dokter</p>
                    <p className="text-sm font-bold text-slate-800">
                      Periksa baris puisi, bandingkan keadaan dahulu &amp; kini, lalu tulis diagnosis!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Perlengkapan Dokter & Kartu Identitas Dokter Puisi Cilik */}
            <div className="grid items-start gap-6 lg:grid-cols-12">
              <div className="clinic-card space-y-5 rounded-3xl p-6 lg:col-span-7">
                <div>
                  <h2 className="font-display mb-2 flex items-center gap-2 text-lg font-bold text-teal-950">
                    <Shirt className="h-5 w-5 text-teal-700" aria-hidden="true" />
                    <span>Siapkan Seragam &amp; Nama Dokter Puisi Cilik</span>
                  </h2>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="m1-doc-name" className="mb-1 block text-xs font-extrabold text-teal-900">
                        Nama Dokter Muda
                      </label>
                      <input
                        id="m1-doc-name"
                        type="text"
                        maxLength={24}
                        value={doctorName}
                        onChange={(e) => onUpdateNames(e.target.value, partnerDoctorName)}
                        placeholder="Contoh: dr. Raka"
                        className="w-full rounded-2xl border-2 border-teal-200 bg-white px-3.5 py-2 text-sm font-bold text-slate-800 focus:border-teal-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="m1-partner-name" className="mb-1 block text-xs font-extrabold text-teal-900">
                        Rekan Diskusi / Pair (opsional)
                      </label>
                      <input
                        id="m1-partner-name"
                        type="text"
                        maxLength={24}
                        value={partnerDoctorName}
                        onChange={(e) => onUpdateNames(doctorName, e.target.value)}
                        placeholder="Contoh: dr. Sinta"
                        className="w-full rounded-2xl border-2 border-teal-200 bg-white px-3.5 py-2 text-sm font-bold text-slate-800 focus:border-teal-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-extrabold text-teal-900">Pilih Warna Jas Dokter:</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {COAT_STYLES.map((coat) => {
                      const active = coat.id === coatStyle;
                      return (
                        <button
                          key={coat.id}
                          type="button"
                          onClick={() => {
                            onPlaySound('click');
                            onSelectCoat(coat.id);
                          }}
                          className={`btn-tactile flex items-center gap-2 rounded-2xl border-2 p-2.5 text-left text-xs font-extrabold transition ${
                            active
                              ? 'border-teal-600 bg-teal-50 shadow-sm'
                              : 'border-slate-200 bg-white hover:border-teal-300'
                          }`}
                        >
                          <span
                            className="h-5 w-5 shrink-0 rounded-lg border border-white shadow"
                            style={{ backgroundColor: coat.trimColor }}
                          />
                          <span className="truncate">{coat.name.replace('Jas ', '')}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-extrabold text-teal-900">Pilih Warna Stetoskop:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {STETHOSCOPE_STYLES.map((steth) => {
                      const active = steth.id === stethoscopeStyle;
                      return (
                        <button
                          key={steth.id}
                          type="button"
                          onClick={() => {
                            onPlaySound('click');
                            onSelectStethoscope(steth.id);
                          }}
                          className={`btn-tactile flex items-center gap-2 rounded-2xl border-2 p-2.5 text-xs font-extrabold transition ${
                            active
                              ? 'border-teal-600 bg-teal-50 shadow-sm'
                              : 'border-slate-200 bg-white hover:border-teal-300'
                          }`}
                        >
                          <span
                            className="h-4 w-4 shrink-0 rounded-full border border-white shadow"
                            style={{ backgroundColor: steth.hex }}
                          />
                          <span>{steth.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Kartu Identitas Dokter Puisi Cilik */}
              <div className="clinic-card rounded-3xl border-4 border-teal-300 bg-gradient-to-br from-white via-teal-50/70 to-sky-50 p-5 lg:col-span-5">
                <div className="mb-3 flex items-center justify-between border-b-2 border-dashed border-teal-200 pb-2.5">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="h-5 w-5 text-teal-700" aria-hidden="true" />
                    <h2 className="font-display text-base font-bold text-teal-950">
                      KARTU DOKTER PUISI CILIK
                    </h2>
                  </div>
                  <span className="text-[11px] font-extrabold text-teal-700">AKTIF</span>
                </div>

                <div className="flex items-center gap-4 rounded-2xl bg-white/90 p-4 shadow-inner">
                  <DokterPuisiMascot
                    hideSpeechBubble
                    mood="happy"
                    size="sm"
                    coatColor={selectedCoat.trimColor}
                    stethoscopeColor={selectedSteth.hex}
                  />
                  <div className="min-w-0">
                    <p className="text-[11px] font-extrabold uppercase text-teal-700">
                      Kelas IV SD · Tim Bedah Puisi
                    </p>
                    <p className="font-display truncate text-xl font-bold text-teal-950">
                      {doctorName.trim() || 'Dokter Muda'}
                    </p>
                    <p className="text-xs font-bold text-slate-600">
                      {selectedCoat.name} · Stetoskop {selectedSteth.name}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                  <button
                    type="button"
                    onClick={onStartMission2}
                    className="btn-tactile inline-flex flex-1 items-center justify-center gap-2 rounded-3xl border-b-4 border-teal-800 bg-gradient-to-r from-teal-600 to-emerald-500 px-5 py-3.5 text-sm font-extrabold text-white shadow-lg hover:from-teal-500 hover:to-emerald-500"
                  >
                    <Stethoscope className="h-4 w-4" aria-hidden="true" />
                    <span>Mulai Misi 2: Periksa Puisi</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={onOpenMap}
                    className="btn-tactile inline-flex items-center justify-center gap-1.5 rounded-2xl border-2 border-sky-200 bg-sky-50 px-4 py-3 text-xs font-extrabold text-sky-900 hover:bg-sky-100"
                  >
                    <Map className="h-4 w-4" aria-hidden="true" />
                    <span>Peta</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
