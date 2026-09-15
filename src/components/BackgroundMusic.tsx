import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Pause, Play, Music } from 'lucide-react';

const AUDIO_SRC = '/kaahe-mose.mp3';

let _startPlaybackGlobal: (() => void) | null = null;
let _pausePlaybackGlobal: (() => void) | null = null;

export function triggerMusicPlay() {
  _startPlaybackGlobal?.();
}
export function triggerMusicPause() {
  _pausePlaybackGlobal?.();
}

export const BackgroundMusic: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize native HTML5 Audio element once
  useEffect(() => {
    const audio = new Audio(AUDIO_SRC);
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.85;

    audio.oncanplaythrough = () => {
      setIsLoaded(true);
    };

    audio.onplay = () => {
      setIsPlaying(true);
    };

    audio.onpause = () => {
      setIsPlaying(false);
    };

    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const startPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Audio play failed:', err);
      });
    }
  }, []);

  const pausePlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  // Expose triggers globally for SplashScreen button click
  useEffect(() => {
    _startPlaybackGlobal = startPlayback;
    _pausePlaybackGlobal = pausePlayback;
    return () => {
      _startPlaybackGlobal = null;
      _pausePlaybackGlobal = null;
    };
  }, [startPlayback, pausePlayback]);

  const togglePlay = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      pausePlayback();
    } else {
      startPlayback();
    }
  }, [isPlaying, pausePlayback, startPlayback]);

  return (
    <>
      <aside aria-label="Background music controls" className="fixed bottom-5 left-5 z-40 select-none">
        <button
          type="button"
          onClick={togglePlay}
          className={`group flex items-center gap-2.5 px-4 py-2.5 rounded-full text-xs font-semibold backdrop-blur-md shadow-lg border transition-all duration-300 cursor-pointer ${
            isPlaying
              ? 'bg-rose-500/95 text-white border-rose-400 shadow-rose-500/25 hover:bg-rose-600 hover:scale-105'
              : 'bg-white/95 text-stone-700 border-rose-200 shadow-stone-300/40 hover:bg-white hover:text-rose-600 hover:scale-105'
          }`}
          title={isPlaying ? 'Pause background song' : 'Play background song'}
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current shrink-0" />
              <div className="flex flex-col text-left">
                <span className="leading-tight">Kaahe Mose</span>
                <span className="text-[9px] text-rose-100 font-normal opacity-90">Playing • Tap to pause</span>
              </div>
              <div className="flex items-end gap-0.5 h-3 ml-1 shrink-0">
                <span className="w-0.5 h-2.5 bg-white rounded-full animate-pulse [animation-duration:0.6s]" />
                <span className="w-0.5 h-3.5 bg-white rounded-full animate-pulse [animation-duration:0.9s]" />
                <span className="w-0.5 h-1.5 bg-white/90 rounded-full animate-pulse [animation-duration:0.5s]" />
                <span className="w-0.5 h-3 bg-white rounded-full animate-pulse [animation-duration:0.75s]" />
              </div>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current text-rose-500 shrink-0" />
              <div className="flex flex-col text-left">
                <span className="leading-tight text-stone-800">Play Song</span>
                <span className="text-[9px] text-rose-500 font-normal">Kaahe Mose • Garvit-Priyansh</span>
              </div>
              <Music className="w-3 h-3 text-rose-400 animate-bounce shrink-0 ml-0.5" />
            </>
          )}
        </button>
      </aside>
    </>
  );
};
