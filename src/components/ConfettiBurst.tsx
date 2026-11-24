import React, { useEffect, useState } from 'react';

interface ConfettiBurstProps {
  triggerKey: number;
  count?: number;
}

const CONFETTI_COLORS = [
  '#14b8a6', // biru toska
  '#34d399', // mint green
  '#38bdf8', // biru langit
  '#fbbf24', // kuning cerah
  '#fb7185', // coral lembut
];

interface Piece {
  id: number;
  left: number;
  delay: number;
  color: string;
  rotate: number;
}

export const ConfettiBurst: React.FC<ConfettiBurstProps> = ({
  triggerKey,
  count = 26,
}) => {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    if (triggerKey <= 0) return;
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const created: Piece[] = Array.from({ length: count }, (_, idx) => ({
      id: triggerKey * 100 + idx,
      left: Math.round(Math.random() * 96) + 2,
      delay: Math.random() * 0.4,
      color: CONFETTI_COLORS[idx % CONFETTI_COLORS.length],
      rotate: Math.round(Math.random() * 360),
    }));
    setPieces(created);

    const timer = window.setTimeout(() => {
      setPieces([]);
    }, 2600);
    return () => window.clearTimeout(timer);
  }, [triggerKey, count]);

  if (pieces.length === 0) return null;

  return (
    <div aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}vw`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
};
