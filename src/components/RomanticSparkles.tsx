import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, Star } from 'lucide-react';

interface SideSparklesProps {
  side: 'left' | 'right';
}

// 4-point sparkle star SVG component
function SparkleStar({
  size = 24,
  color = '#F43F5E',
  glowColor = 'rgba(244, 63, 94, 0.4)',
}: {
  size?: number;
  color?: string;
  glowColor?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ filter: `drop-shadow(0 0 6px ${glowColor})` }}
    >
      <path
        d="M12 0C12 7 7 12 0 12C7 12 12 17 12 24C12 17 17 12 24 12C17 12 12 7 12 0Z"
        fill={color}
      />
    </svg>
  );
}

// 8-point shimmer flare
function ShimmerFlare({
  size = 20,
  color = '#F59E0B',
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ filter: 'drop-shadow(0 0 5px rgba(245, 158, 11, 0.5))' }}
    >
      <path
        d="M12 0 L13.5 8.5 L22 10 L13.5 11.5 L12 20 L10.5 11.5 L2 10 L10.5 8.5 Z"
        fill={color}
      />
      <circle cx="12" cy="10" r="2" fill="#FFFBEB" />
    </svg>
  );
}

export function RomanticSideSparkles({ side }: SideSparklesProps) {
  const isLeft = side === 'left';

  // Seeded positions for left vs right so they look natural, balanced, and distinct
  const sparkles = isLeft
    ? [
        { x: 30, y: 40, size: 28, color: '#FB7185', glow: 'rgba(251, 113, 133, 0.6)', dur: 2.8, delay: 0 },
        { x: 140, y: 30, size: 18, color: '#F59E0B', glow: 'rgba(245, 158, 11, 0.6)', dur: 3.2, delay: 0.7 },
        { x: 75, y: 120, size: 22, color: '#EC4899', glow: 'rgba(236, 72, 153, 0.6)', dur: 2.5, delay: 1.2 },
        { x: 190, y: 110, size: 14, color: '#FBBF24', glow: 'rgba(251, 191, 36, 0.6)', dur: 3.6, delay: 0.3 },
        { x: 45, y: 220, size: 32, color: '#F43F5E', glow: 'rgba(244, 63, 94, 0.6)', dur: 3.1, delay: 1.5 },
        { x: 135, y: 210, size: 20, color: '#FB7185', glow: 'rgba(251, 113, 133, 0.6)', dur: 2.9, delay: 0.8 },
        { x: 80, y: 300, size: 24, color: '#F59E0B', glow: 'rgba(245, 158, 11, 0.6)', dur: 3.4, delay: 0.4 },
        { x: 170, y: 290, size: 16, color: '#EC4899', glow: 'rgba(236, 72, 153, 0.6)', dur: 2.7, delay: 1.8 },
        { x: 110, y: 380, size: 26, color: '#F43F5E', glow: 'rgba(244, 63, 94, 0.6)', dur: 3.3, delay: 1.1 },
        { x: 30, y: 370, size: 18, color: '#FBBF24', glow: 'rgba(251, 191, 36, 0.6)', dur: 2.6, delay: 0.5 },
      ]
    : [
        { x: 170, y: 40, size: 26, color: '#F43F5E', glow: 'rgba(244, 63, 94, 0.6)', dur: 3.0, delay: 0.5 },
        { x: 60, y: 35, size: 16, color: '#F59E0B', glow: 'rgba(245, 158, 11, 0.6)', dur: 2.7, delay: 1.1 },
        { x: 130, y: 115, size: 22, color: '#EC4899', glow: 'rgba(236, 72, 153, 0.6)', dur: 3.4, delay: 0.2 },
        { x: 25, y: 125, size: 18, color: '#FB7185', glow: 'rgba(251, 113, 133, 0.6)', dur: 2.9, delay: 1.6 },
        { x: 160, y: 215, size: 30, color: '#F59E0B', glow: 'rgba(245, 158, 11, 0.6)', dur: 3.2, delay: 0.8 },
        { x: 70, y: 210, size: 20, color: '#F43F5E', glow: 'rgba(244, 63, 94, 0.6)', dur: 2.8, delay: 1.4 },
        { x: 135, y: 305, size: 24, color: '#FB7185', glow: 'rgba(251, 113, 133, 0.6)', dur: 3.5, delay: 0.6 },
        { x: 40, y: 295, size: 16, color: '#EC4899', glow: 'rgba(236, 72, 153, 0.6)', dur: 2.6, delay: 1.9 },
        { x: 90, y: 380, size: 28, color: '#FBBF24', glow: 'rgba(251, 191, 36, 0.6)', dur: 3.1, delay: 0.3 },
        { x: 180, y: 370, size: 17, color: '#F43F5E', glow: 'rgba(244, 63, 94, 0.6)', dur: 2.8, delay: 1.3 },
      ];

  const floatingHearts = isLeft
    ? [
        { x: 60, y: 80, size: 16, delay: 0.4, dur: 4.2 },
        { x: 160, y: 170, size: 18, delay: 1.6, dur: 3.8 },
        { x: 40, y: 270, size: 15, delay: 0.9, dur: 4.5 },
        { x: 140, y: 340, size: 17, delay: 2.1, dur: 4.0 },
      ]
    : [
        { x: 140, y: 75, size: 17, delay: 1.0, dur: 4.0 },
        { x: 45, y: 165, size: 15, delay: 0.2, dur: 4.3 },
        { x: 150, y: 265, size: 18, delay: 1.8, dur: 3.7 },
        { x: 65, y: 350, size: 16, delay: 0.7, dur: 4.4 },
      ];

  const fairyMotes = Array.from({ length: 14 }).map((_, i) => ({
    id: i,
    x: (i * 19 + 17) % 200 + 10,
    y: (i * 31 + 23) % 410 + 15,
    size: (i % 3) * 2 + 3,
    dur: 2.5 + (i % 4) * 0.6,
    delay: (i * 0.35) % 2.5,
  }));

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none relative w-56 xl:w-64 h-[440px] hidden md:flex flex-col items-center justify-center ${
        isLeft ? 'items-end pr-2' : 'items-start pl-2'
      }`}
    >
      {/* 1. Soft Warm Ambient Glow Aura */}
      <motion.div
        className="absolute w-52 h-52 rounded-full blur-3xl opacity-60"
        style={{
          background: isLeft
            ? 'radial-gradient(circle, rgba(254, 205, 211, 0.7) 0%, rgba(254, 240, 138, 0.4) 60%, transparent 100%)'
            : 'radial-gradient(circle, rgba(253, 230, 138, 0.6) 0%, rgba(251, 207, 232, 0.5) 60%, transparent 100%)',
        }}
        animate={{
          scale: [0.9, 1.15, 0.9],
          opacity: [0.45, 0.75, 0.45],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* 2. Delicate Fairy Stardust Constellation Path SVG */}
      <svg
        className="absolute inset-0 w-full h-full overflow-visible"
        viewBox="0 0 240 440"
      >
        <defs>
          <linearGradient id={`stardustGrad-${side}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FB7185" stopOpacity="0.1" />
            <stop offset="30%" stopColor="#F59E0B" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#EC4899" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Elegant Curved Star Trail */}
        {isLeft ? (
          <path
            d="M 50,40 Q 150,110 80,210 T 130,370"
            fill="none"
            stroke={`url(#stardustGrad-${side})`}
            strokeWidth="1.8"
            strokeDasharray="4 6"
            strokeLinecap="round"
          />
        ) : (
          <path
            d="M 190,40 Q 90,110 160,210 T 110,370"
            fill="none"
            stroke={`url(#stardustGrad-${side})`}
            strokeWidth="1.8"
            strokeDasharray="4 6"
            strokeLinecap="round"
          />
        )}
      </svg>

      {/* 3. Twinkling 4-Point Star Sparkles */}
      {sparkles.map((sp, idx) => (
        <motion.div
          key={`star-${side}-${idx}`}
          className="absolute"
          style={{ left: sp.x, top: sp.y }}
          animate={{
            scale: [0.65, 1.25, 0.65],
            opacity: [0.35, 1, 0.35],
            rotate: [0, 90, 180],
          }}
          transition={{
            duration: sp.dur,
            repeat: Infinity,
            delay: sp.delay,
            ease: 'easeInOut',
          }}
        >
          {idx % 3 === 0 ? (
            <ShimmerFlare size={sp.size} color={sp.color} />
          ) : (
            <SparkleStar size={sp.size} color={sp.color} glowColor={sp.glow} />
          )}
        </motion.div>
      ))}

      {/* 4. Soft Floating Fairy Hearts */}
      {floatingHearts.map((h, idx) => (
        <motion.div
          key={`heart-${side}-${idx}`}
          className="absolute flex items-center justify-center"
          style={{ left: h.x, top: h.y }}
          animate={{
            y: [-12, 12, -12],
            x: isLeft ? [-6, 6, -6] : [6, -6, 6],
            scale: [0.85, 1.15, 0.85],
            opacity: [0.5, 0.95, 0.5],
            rotate: isLeft ? [-10, 12, -10] : [10, -12, 10],
          }}
          transition={{
            duration: h.dur,
            repeat: Infinity,
            delay: h.delay,
            ease: 'easeInOut',
          }}
        >
          <Heart
            className="text-rose-400 fill-rose-300 drop-shadow-[0_0_8px_rgba(244,63,94,0.45)]"
            style={{ width: h.size, height: h.size }}
          />
        </motion.div>
      ))}

      {/* 5. Shimmering Gold & Rose Stardust Motes */}
      {fairyMotes.map((mote) => (
        <motion.div
          key={`mote-${side}-${mote.id}`}
          className="absolute rounded-full"
          style={{
            left: mote.x,
            top: mote.y,
            width: mote.size,
            height: mote.size,
            background:
              mote.id % 2 === 0
                ? 'radial-gradient(circle, #FDE047 0%, #F59E0B 100%)'
                : 'radial-gradient(circle, #FDA4AF 0%, #F43F5E 100%)',
            boxShadow:
              mote.id % 2 === 0
                ? '0 0 6px rgba(251, 191, 36, 0.8)'
                : '0 0 6px rgba(244, 63, 94, 0.8)',
          }}
          animate={{
            y: [-15, 15, -15],
            opacity: [0.2, 0.9, 0.2],
            scale: [0.7, 1.3, 0.7],
          }}
          transition={{
            duration: mote.dur,
            repeat: Infinity,
            delay: mote.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* 6. Romantic Floating Glassmorphism Whisper Pill */}
      <motion.div
        className="relative z-10 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/75 backdrop-blur-md border border-rose-100/90 shadow-sm shadow-rose-100/40 text-stone-600 text-[12px] font-medium tracking-wide"
        animate={{
          y: [-5, 5, -5],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: isLeft ? 0 : 0.8,
        }}
      >
        {isLeft ? (
          <>
            <span className="text-amber-500 animate-pulse text-xs">✨</span>
            <span className="font-serif italic text-rose-700">Warm heartbeats</span>
            <Heart className="w-3 h-3 fill-rose-400 text-rose-400" />
          </>
        ) : (
          <>
            <Heart className="w-3 h-3 fill-rose-400 text-rose-400" />
            <span className="font-serif italic text-rose-700">Sweet memories</span>
            <span className="text-amber-500 animate-pulse text-xs">✨</span>
          </>
        )}
      </motion.div>
    </div>
  );
}
