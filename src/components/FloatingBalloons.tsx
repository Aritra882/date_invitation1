import React, { useMemo } from 'react';

interface BalloonConfig {
  id: number;
  name: string;
  left: number; // percentage across screen
  duration: number; // float duration in seconds
  delay: number; // animation delay in seconds
  drift: number; // horizontal drift in px
  swayDuration: number;
  scale: number;
  gradient: {
    start: string;
    end: string;
    text: string;
    highlight: string;
    knot: string;
    stringColor: string;
  };
}

const BALLOON_PALETTES = [
  {
    start: '#FDA4AF', // Rose pink
    end: '#F43F5E',
    text: '#FFFFFF',
    highlight: 'rgba(255, 255, 255, 0.55)',
    knot: '#E11D48',
    stringColor: 'rgba(244, 63, 94, 0.4)',
  },
  {
    start: '#FDBA74', // Soft peach
    end: '#FB7185',
    text: '#FFFFFF',
    highlight: 'rgba(255, 255, 255, 0.6)',
    knot: '#F43F5E',
    stringColor: 'rgba(251, 113, 133, 0.4)',
  },
  {
    start: '#F472B6', // Blush pink
    end: '#EC4899',
    text: '#FFFFFF',
    highlight: 'rgba(255, 255, 255, 0.55)',
    knot: '#DB2777',
    stringColor: 'rgba(236, 72, 153, 0.4)',
  },
  {
    start: '#FFE4E6', // Warm ivory blush
    end: '#FDA4AF',
    text: '#9F1239',
    highlight: 'rgba(255, 255, 255, 0.75)',
    knot: '#FB7185',
    stringColor: 'rgba(251, 113, 133, 0.35)',
  },
  {
    start: '#FBCFE8', // Soft lavender rose
    end: '#F472B6',
    text: '#831843',
    highlight: 'rgba(255, 255, 255, 0.65)',
    knot: '#DB2777',
    stringColor: 'rgba(219, 39, 119, 0.35)',
  },
];

interface FloatingBalloonsProps {
  name?: string;
  count?: number;
}

export const FloatingBalloons: React.FC<FloatingBalloonsProps> = ({
  name = 'Srija',
  count = 9,
}) => {
  const balloons = useMemo<BalloonConfig[]>(() => {
    // Distribute nicely across the screen: left side, right side, and background edges
    const leftPositions = [4, 12, 22, 72, 82, 92, 18, 78, 48];

    return Array.from({ length: count }, (_, i) => {
      const palette = BALLOON_PALETTES[i % BALLOON_PALETTES.length];
      const baseLeft = leftPositions[i % leftPositions.length];
      // Jitter left slightly
      const left = Math.min(94, Math.max(3, baseLeft + (Math.random() * 8 - 4)));
      const duration = 16 + (i * 2.2) % 10 + Math.random() * 3; // 16s - 27s
      // Negative delays so they are already visible and active across the viewport on first render
      const delay = -((i * 3.5) % duration);
      const drift = (Math.random() - 0.5) * 60;
      const swayDuration = 3.5 + Math.random() * 2;
      const scale = 0.85 + (i % 3) * 0.12;

      return {
        id: i,
        name,
        left,
        duration,
        delay,
        drift,
        swayDuration,
        scale,
        gradient: palette,
      };
    });
  }, [name, count]);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-1 select-none"
      aria-hidden="true"
    >
      {balloons.map((b) => (
        <div
          key={b.id}
          className="absolute"
          style={{
            left: `${b.left}%`,
            bottom: '-120px',
            animation: `floatBalloon ${b.duration}s linear infinite`,
            animationDelay: `${b.delay}s`,
            ['--drift' as string]: `${b.drift}px`,
          }}
        >
          {/* Inner swaying wrapper */}
          <div
            style={{
              animation: `balloonSway ${b.swayDuration}s ease-in-out infinite alternate`,
              transformOrigin: 'bottom center',
              transform: `scale(${b.scale})`,
            }}
            className="flex flex-col items-center"
          >
            {/* Balloon Body */}
            <div
              className="relative flex items-center justify-center shadow-lg"
              style={{
                width: '74px',
                height: '92px',
                borderRadius: '50% 50% 50% 50% / 44% 44% 56% 56%',
                background: `radial-gradient(circle at 35% 30%, ${b.gradient.highlight} 0%, transparent 40%), linear-gradient(145deg, ${b.gradient.start} 0%, ${b.gradient.end} 100%)`,
                boxShadow: `0 8px 18px -2px rgba(244, 63, 94, 0.28), inset -3px -3px 8px rgba(0,0,0,0.1)`,
              }}
            >
              {/* Glossy reflection highlight */}
              <div
                className="absolute top-2 left-2.5 w-4 h-6 rounded-full opacity-60 pointer-events-none transform -rotate-25"
                style={{
                  background: 'linear-gradient(to bottom, rgba(255,255,255,0.85), rgba(255,255,255,0.1))',
                }}
              />

              {/* Girl's Name on Balloon */}
              <div className="relative z-10 flex flex-col items-center justify-center px-1 text-center">
                <span
                  style={{
                    color: b.gradient.text,
                    textShadow: '0 1px 2px rgba(0,0,0,0.18)',
                    letterSpacing: '0.03em',
                  }}
                  className="font-serif font-bold text-xs leading-none drop-shadow-xs"
                >
                  {b.name}
                </span>
                <span
                  className="text-[9px] mt-0.5 leading-none"
                  style={{ color: b.gradient.text, opacity: 0.9 }}
                >
                  💕
                </span>
              </div>
            </div>

            {/* Balloon knot */}
            <div
              style={{
                width: '10px',
                height: '7px',
                backgroundColor: b.gradient.knot,
                clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
                marginTop: '-1px',
              }}
            />

            {/* Balloon string with subtle wavy SVG */}
            <svg
              width="24"
              height="55"
              viewBox="0 0 24 55"
              fill="none"
              className="opacity-75 -mt-0.5"
            >
              <path
                d="M12 0 C 9 12, 16 22, 11 34 C 7 44, 14 48, 12 55"
                stroke={b.gradient.stringColor}
                strokeWidth="1.25"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
};
