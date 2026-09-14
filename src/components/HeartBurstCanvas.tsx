import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  rotation: number;
  vRot: number;
  type: 'emoji' | 'sparkle' | 'glitter';
  char?: string;
  color?: string;
  life: number;
  maxLife: number;
}

interface HeartBurstProps {
  active: boolean;
  onComplete?: () => void;
  origin?: { x: number; y: number } | null;
}

// Global offscreen sprite cache for emojis to completely eliminate
// font parsing overhead and prevent dropped frames / lag
const spriteCache = new Map<string, HTMLCanvasElement>();

function getEmojiSprite(char: string, baseSize = 72): HTMLCanvasElement {
  const cached = spriteCache.get(char);
  if (cached) return cached;

  const c = document.createElement('canvas');
  c.width = baseSize;
  c.height = baseSize;
  const cCtx = c.getContext('2d');
  if (cCtx) {
    cCtx.font = `${Math.floor(baseSize * 0.72)}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
    cCtx.textAlign = 'center';
    cCtx.textBaseline = 'middle';
    cCtx.fillText(char, baseSize / 2, baseSize / 2 + 2);
  }
  spriteCache.set(char, c);
  return c;
}

export const HeartBurstCanvas: React.FC<HeartBurstProps> = ({
  active,
  onComplete,
  origin,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const originX = (origin ? origin.x : window.innerWidth / 2) * dpr;
    const originY = (origin ? origin.y : window.innerHeight / 2) * dpr;

    const emojis = ['❤️', '💖', '💕', '✨', '🌸', '🤍', '💗', '🥰'];
    const glitterColors = ['#F43F5E', '#FB7185', '#F59E0B', '#FBBF24', '#EC4899', '#FDA4AF', '#FFFFFF'];

    // Preload sprites
    emojis.forEach((em) => getEmojiSprite(em));

    const particles: Particle[] = [];
    const isMobile = window.innerWidth < 640;
    const count = isMobile ? 50 : 75;

    for (let i = 0; i < count; i++) {
      // 360-degree burst with upward bias
      const angle = Math.random() * Math.PI * 2;
      // Snappy explosive launch velocity: 9 to 24 px/frame (scaled for dpr)
      const speed = (9 + Math.random() * 15) * dpr;

      // 65% emoji hearts, 35% shimmering glitter particles
      const isEmoji = i % 3 !== 0;

      particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        // upward bias for festive fountain arc
        vy: Math.sin(angle) * speed - (4.5 + Math.random() * 3) * dpr,
        size: isEmoji ? (20 + Math.random() * 22) * dpr : (6 + Math.random() * 8) * dpr,
        opacity: 1,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.28,
        type: isEmoji ? 'emoji' : 'glitter',
        char: isEmoji ? emojis[Math.floor(Math.random() * emojis.length)] : undefined,
        color: !isEmoji ? glitterColors[Math.floor(Math.random() * glitterColors.length)] : undefined,
        life: 0,
        // Snappy duration: ~45 to 65 frames (0.75 - 1.1 seconds)
        maxLife: Math.floor(45 + Math.random() * 22),
      });
    }

    let animationFrameId: number;
    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 16.67, 2.0); // normalize around 60fps
      lastTime = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let aliveCount = 0;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life += dt;

        // Snappy physics: smooth deceleration after explosive pop
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += (0.32 * dpr) * dt; // crisp gravity
        p.vx *= Math.pow(0.95, dt); // air resistance
        p.vy *= Math.pow(0.97, dt);
        p.rotation += p.vRot * dt;

        const progress = p.life / p.maxLife;

        // Stay full opacity for first 60%, then smooth snappy fade-out
        if (progress < 0.6) {
          p.opacity = 1;
        } else {
          p.opacity = Math.max(0, 1 - (progress - 0.6) / 0.4);
        }

        if (p.life < p.maxLife && p.opacity > 0) {
          aliveCount++;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = p.opacity;

          if (p.type === 'emoji' && p.char) {
            const sprite = getEmojiSprite(p.char);
            ctx.drawImage(sprite, -p.size / 2, -p.size / 2, p.size, p.size);
          } else if (p.color) {
            // Draw sparkling glitter diamond / star
            ctx.fillStyle = p.color;
            ctx.beginPath();
            const s = p.size;
            ctx.moveTo(0, -s);
            ctx.lineTo(s * 0.35, -s * 0.35);
            ctx.lineTo(s, 0);
            ctx.lineTo(s * 0.35, s * 0.35);
            ctx.lineTo(0, s);
            ctx.lineTo(-s * 0.35, s * 0.35);
            ctx.lineTo(-s, 0);
            ctx.lineTo(-s * 0.35, -s * 0.35);
            ctx.closePath();
            ctx.fill();
          }

          ctx.restore();
        }
      }

      if (aliveCount > 0) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (onComplete) onComplete();
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [active, onComplete, origin]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  );
};
