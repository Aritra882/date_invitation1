import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface EvasiveButtonProps {
  onEvade?: (count: number) => void;
  maxDodges?: number;
}

const EVASIVE_LABELS = [
  'No',
  'Are you sure? 🥺',
  'Nice try! 💨',
  'Too slow! 🤭',
  'Oops, over here! 🏃‍♀️',
  'Nope! 🙈',
  'Think again! 💕',
  'Can\'t catch me! ✨',
  'Almost had it! 😜',
  'Still here! 💃',
  'Keep trying! 🏃‍♂️',
  'Just say yes! 🥰',
  'Not this one! 🌸',
  'Too quick! ⚡',
  'Giving up yet? 🤭',
];

export const EvasiveButton: React.FC<EvasiveButtonProps> = ({ onEvade, maxDodges = 15 }) => {
  const [hasMoved, setHasMoved] = useState(false);
  const [isDisappeared, setIsDisappeared] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dodgeCount, setDodgeCount] = useState(0);
  const [labelIndex, setLabelIndex] = useState(0);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const posRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const moveButton = useCallback(
    (e?: React.SyntheticEvent | MouseEvent | TouchEvent) => {
      if (e) {
        if ('preventDefault' in e) e.preventDefault();
        if ('stopPropagation' in e) e.stopPropagation();
      }

      if (isDisappeared) return;

      const nextCount = dodgeCount + 1;

      // After maxDodges moves (15 times), completely disappear the button!
      if (nextCount > maxDodges) {
        setIsDisappeared(true);
        if (onEvade) onEvade(nextCount);
        return;
      }

      const btn = buttonRef.current;
      const btnWidth = btn ? btn.offsetWidth : 120;
      const btnHeight = btn ? btn.offsetHeight : 48;

      const padX = 20;
      const padY = 50;

      const vpW = window.visualViewport ? window.visualViewport.width : window.innerWidth;
      const vpH = window.visualViewport ? window.visualViewport.height : window.innerHeight;

      const minX = padX;
      const maxX = Math.max(minX, vpW - btnWidth - padX);

      const minY = padY;
      const maxY = Math.max(minY, vpH - btnHeight - padY);

      let newX = Math.floor(Math.random() * (maxX - minX) + minX);
      let newY = Math.floor(Math.random() * (maxY - minY) + minY);

      if (hasMoved) {
        const curX = posRef.current.x;
        const curY = posRef.current.y;
        for (let i = 0; i < 8; i++) {
          const dist = Math.hypot(newX - curX, newY - curY);
          if (dist >= 110) break;
          newX = Math.floor(Math.random() * (maxX - minX) + minX);
          newY = Math.floor(Math.random() * (maxY - minY) + minY);
        }
      }

      newX = Math.min(Math.max(minX, newX), maxX);
      newY = Math.min(Math.max(minY, newY), maxY);

      posRef.current = { x: newX, y: newY };
      setPosition({ x: newX, y: newY });
      setHasMoved(true);
      setDodgeCount(nextCount);
      setLabelIndex((prev) => (prev + 1) % EVASIVE_LABELS.length);

      if (onEvade) {
        onEvade(nextCount);
      }
    },
    [dodgeCount, hasMoved, isDisappeared, maxDodges, onEvade]
  );

  useEffect(() => {
    if (!hasMoved || isDisappeared) return;

    const handleResize = () => {
      const btn = buttonRef.current;
      const btnWidth = btn ? btn.offsetWidth : 120;
      const btnHeight = btn ? btn.offsetHeight : 48;
      const padX = 20;
      const padY = 50;

      const vpW = window.visualViewport ? window.visualViewport.width : window.innerWidth;
      const vpH = window.visualViewport ? window.visualViewport.height : window.innerHeight;

      const maxX = Math.max(padX, vpW - btnWidth - padX);
      const maxY = Math.max(padY, vpH - btnHeight - padY);

      setPosition((prev) => {
        const clampedX = Math.min(Math.max(padX, prev.x), maxX);
        const clampedY = Math.min(Math.max(padY, prev.y), maxY);
        posRef.current = { x: clampedX, y: clampedY };
        return { x: clampedX, y: clampedY };
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [hasMoved, isDisappeared]);

  if (isDisappeared) {
    return null;
  }

  const buttonElement = (
    <button
      ref={buttonRef}
      id="evasive-no-button"
      type="button"
      onMouseEnter={moveButton}
      onMouseMove={moveButton}
      onTouchStart={moveButton}
      onPointerDown={moveButton}
      onClick={moveButton}
      style={
        hasMoved
          ? {
              position: 'fixed',
              left: `${position.x}px`,
              top: `${position.y}px`,
              zIndex: 99999,
              transition:
                'left 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.15s ease',
            }
          : undefined
      }
      className={`px-7 py-3.5 text-base sm:text-lg font-medium rounded-full border 
        bg-white/95 text-stone-600 shadow-md select-none touch-none cursor-pointer
        hover:text-rose-600 hover:border-rose-300 active:scale-95 ${
          hasMoved
            ? 'shadow-xl border-rose-300 text-rose-700 ring-2 ring-rose-200/60 scale-105'
            : 'border-rose-200/80'
        }`}
      aria-label="Playful evasive No button"
    >
      <span className="flex items-center gap-1.5 whitespace-nowrap pointer-events-none">
        {EVASIVE_LABELS[labelIndex]}
      </span>
    </button>
  );

  return (
    <>
      {hasMoved ? (
        <>
          {typeof document !== 'undefined'
            ? createPortal(buttonElement, document.body)
            : buttonElement}
        </>
      ) : (
        buttonElement
      )}
    </>
  );
};
