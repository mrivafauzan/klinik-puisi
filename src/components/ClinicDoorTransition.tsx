import React from 'react';
import { motion } from 'motion/react';
import { Stethoscope } from 'lucide-react';

interface ClinicDoorTransitionProps {
  isOpen: boolean;
}

export const ClinicDoorTransition: React.FC<ClinicDoorTransitionProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex overflow-hidden bg-teal-900/20 backdrop-blur-sm"
      aria-live="polite"
      aria-label="Membuka pintu Klinik Puisi"
    >
      {/* Pintu Kiri */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: '-100%' }}
        transition={{ duration: 0.75, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="flex h-full w-1/2 items-center justify-end border-r-4 border-amber-300 bg-gradient-to-br from-teal-500 to-teal-700 pr-4 shadow-2xl"
      >
        <div className="h-24 w-3 rounded-full bg-amber-300 shadow" />
      </motion.div>

      {/* Pintu Kanan */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: '100%' }}
        transition={{ duration: 0.75, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="flex h-full w-1/2 items-center justify-start border-l-4 border-amber-300 bg-gradient-to-bl from-teal-500 to-teal-700 pl-4 shadow-2xl"
      >
        <div className="h-24 w-3 rounded-full bg-amber-300 shadow" />
      </motion.div>

      {/* Lencana Tengah Pintu */}
      <motion.div
        initial={{ scale: 0.9, opacity: 1 }}
        animate={{ scale: 1.12, opacity: 0 }}
        transition={{ duration: 0.55, delay: 0.1 }}
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-white"
      >
        <div className="grid h-20 w-20 place-items-center rounded-3xl border-4 border-amber-300 bg-white text-teal-700 shadow-2xl">
          <Stethoscope className="h-10 w-10" aria-hidden="true" />
        </div>
        <p className="font-display mt-3 rounded-2xl bg-white/95 px-5 py-2 text-lg font-bold text-teal-950 shadow">
          Selamat Datang di Klinik Puisi!
        </p>
      </motion.div>
    </div>
  );
};
