import React, { useEffect, useState } from 'react';
import { triggerMusicPlay } from './BackgroundMusic';

interface SplashScreenProps {
  onEnter: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter }) => {
  const [leaving, setLeaving] = useState(false);
  const [dots, setDots] = useState('');

  // Animated buffering dots
  useEffect(() => {
    const id = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '' : d + '.'));
    }, 500);
    return () => clearInterval(id);
  }, []);

  const handleEnter = () => {
    // ← This runs inside a real click event — browser allows audio here
    triggerMusicPlay();
    setLeaving(true);
    setTimeout(onEnter, 700);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-700 ${
        leaving ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        background: 'radial-gradient(ellipse at 60% 40%, #fce7f3 0%, #fdf2f8 40%, #fff1f2 70%, #fff5f5 100%)',
      }}
    >
      {/* Floating hearts background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        {HEARTS.map((h) => (
          <span
            key={h.id}
            className="absolute text-rose-300 animate-pulse select-none"
            style={{
              left: `${h.x}%`,
              top: `${h.y}%`,
              fontSize: `${h.size}rem`,
              animationDuration: `${h.dur}s`,
              animationDelay: `${h.delay}s`,
              opacity: h.opacity,
            }}
          >
            ♥
          </span>
        ))}
      </div>

      {/* Card */}
      <div className="relative z-10 flex flex-col items-center text-center px-8 max-w-sm mx-auto">
        {/* Sparkle top */}
        <div className="text-4xl mb-3 animate-spin" style={{ animationDuration: '8s' }}>✨</div>

        {/* Title */}
        <h1
          className="font-serif text-4xl sm:text-5xl font-bold mb-2"
          style={{
            background: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 50%, #db2777 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          For Srija
        </h1>
        <p className="text-rose-400 text-sm font-medium tracking-widest uppercase mb-1">
          💌 A special message
        </p>

        {/* Heart divider */}
        <div className="flex items-center gap-2 my-5">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-rose-300" />
          <span className="text-rose-400 text-xl">♥</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-rose-300" />
        </div>

        {/* Buffering hint */}
        <p className="text-stone-400 text-xs mb-7 h-4">
          Song loading in background{dots}
        </p>

        {/* CTA Button */}
        <button
          type="button"
          onClick={handleEnter}
          className="group relative px-10 py-4 rounded-full text-white font-bold text-base tracking-wide shadow-2xl cursor-pointer overflow-hidden transition-transform duration-200 hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 60%, #db2777 100%)',
            boxShadow: '0 8px 32px rgba(244,63,94,0.45), 0 2px 8px rgba(244,63,94,0.2)',
          }}
        >
          {/* Shimmer */}
          <span
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background:
                'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%)',
            }}
          />
          <span className="relative flex items-center gap-2">
            <span>▶</span>
            <span>Play &amp; Enter</span>
            <span className="animate-bounce">💕</span>
          </span>
        </button>

        <p className="text-stone-400 text-[11px] mt-5 italic">
          Tap to start the music &amp; open the page
        </p>
      </div>
    </div>
  );
};

// Pre-generated heart positions so they're stable (no re-render jitter)
const HEARTS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: [5, 15, 25, 35, 45, 55, 65, 75, 85, 92, 10, 30, 50, 70, 88, 20, 60, 80][i],
  y: [10, 25, 5, 40, 15, 30, 8, 20, 35, 12, 60, 70, 55, 80, 65, 90, 75, 50][i],
  size: [1, 1.4, 0.8, 1.6, 1.1, 0.9, 1.3, 0.7, 1.5, 1, 1.2, 0.85, 1.4, 1, 0.95, 1.3, 0.75, 1.1][i],
  dur: [3, 4, 2.5, 5, 3.5, 4.5, 2.8, 3.8, 4.2, 3.2, 5, 2.6, 3.9, 4.8, 3.3, 2.9, 4.4, 3.6][i],
  delay: [0, 0.5, 1, 1.5, 0.3, 0.8, 1.2, 0.2, 0.7, 1.4, 0.6, 1.1, 0.4, 0.9, 1.3, 0.1, 0.65, 1.0][i],
  opacity: [0.3, 0.2, 0.35, 0.15, 0.25, 0.3, 0.2, 0.4, 0.18, 0.28, 0.22, 0.32, 0.19, 0.27, 0.24, 0.33, 0.21, 0.29][i],
}));
