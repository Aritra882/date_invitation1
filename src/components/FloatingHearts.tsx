import React, { useMemo } from 'react';

interface FloatingHeartsProps {
  count?: number;
}

export const FloatingHearts: React.FC<FloatingHeartsProps> = ({ count = 22 }) => {
  const hearts = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const left = Math.random() * 96 + 2; // 2% to 98%
      const duration = 12 + Math.random() * 14; // 12s to 26s
      const delay = Math.random() * 12; // 0s to 12s
      const size = 12 + Math.random() * 18; // 12px to 30px
      const opacity = 0.25 + Math.random() * 0.45;
      const drift = (Math.random() - 0.5) * 80;
      const rot = (Math.random() - 0.5) * 60;
      const symbols = ['❤️', '💖', '🌸', '✨', '💕', '🌷', '🤍'];
      const symbol = symbols[i % symbols.length];

      return {
        id: i,
        left: `${left}%`,
        animationDuration: `${duration}s`,
        animationDelay: `-${delay}s`,
        fontSize: `${size}px`,
        opacity,
        drift: `${drift}px`,
        rot: `${rot}deg`,
        symbol,
      };
    });
  }, [count]);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
      aria-hidden="true"
    >
      {hearts.map((h) => (
        <div
          key={h.id}
          className="absolute"
          style={{
            left: h.left,
            bottom: '-40px',
            fontSize: h.fontSize,
            opacity: h.opacity,
            animation: `floatHeart ${h.animationDuration} linear infinite`,
            animationDelay: h.animationDelay,
            ['--drift' as string]: h.drift,
            ['--rot' as string]: h.rot,
          }}
        >
          {h.symbol}
        </div>
      ))}
    </div>
  );
};
