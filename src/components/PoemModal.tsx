import React from 'react';
import { BookOpen, X } from 'lucide-react';
import { POEM_AUTHOR, POEM_LINES, POEM_TITLE } from '../data/poemData';

interface PoemModalProps {
  isOpen: boolean;
  highlightedLines: number[];
  onClose: () => void;
}

export const PoemModal: React.FC<PoemModalProps> = ({
  isOpen,
  highlightedLines,
  onClose,
}) => {
  if (!isOpen) return null;

  const stanzas: Array<1 | 2 | 3> = [1, 2, 3];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-teal-950/45 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="poem-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-h-[88vh] w-full max-w-xl overflow-y-auto rounded-3xl border-2 border-teal-200 bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-4 border-b border-teal-100 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-100 text-teal-700">
              <BookOpen className="h-5 w-5" />
            </span>
            <div>
              <h2 id="poem-modal-title" className="font-display text-xl font-bold text-teal-950">
                {POEM_TITLE}
              </h2>
              <p className="text-xs font-bold text-teal-700">Karya {POEM_AUTHOR}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup puisi"
            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 rounded-2xl border border-amber-200/80 bg-amber-50/40 p-5">
          {stanzas.map((stanzaNum) => (
            <div key={stanzaNum} className="space-y-1.5">
              {POEM_LINES.filter((l) => l.stanza === stanzaNum).map((line) => {
                const isHighlighted = highlightedLines.includes(line.number);
                return (
                  <div
                    key={line.number}
                    className={`flex items-baseline gap-3 rounded-lg px-2.5 py-1 text-base leading-relaxed ${
                      isHighlighted ? 'bg-amber-200/70 font-bold text-amber-950' : 'text-slate-800'
                    }`}
                  >
                    <span className="w-5 shrink-0 text-right text-xs font-extrabold tabular-nums text-teal-700/80">
                      {line.number}
                    </span>
                    <span>{line.text}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-teal-800"
          >
            Kembali ke Klinik
          </button>
        </div>
      </div>
    </div>
  );
};
