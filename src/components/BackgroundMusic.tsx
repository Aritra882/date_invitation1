import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause } from 'lucide-react';

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

const YOUTUBE_VIDEO_ID = 'fjBaWNRYPGk'; // Kaahe Mose by Garvit-Priyansh

export const BackgroundMusic: React.FC = () => {
  // Website opens with music playing in the background
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const manuallyPausedRef = useRef<boolean>(false);
  const playerIframeId = useRef(`yt-music-player-${Math.random().toString(36).substring(2, 9)}`);

  // Helper to start music safely
  const startPlaying = useCallback(() => {
    if (!playerRef.current) return;
    try {
      if (typeof playerRef.current.unMute === 'function') playerRef.current.unMute();
      if (typeof playerRef.current.setVolume === 'function') playerRef.current.setVolume(85);
      if (typeof playerRef.current.playVideo === 'function') playerRef.current.playVideo();
      setIsPlaying(true);
    } catch {}
  }, []);

  // Helper to pause music safely
  const pausePlaying = useCallback(() => {
    if (!playerRef.current) return;
    try {
      if (typeof playerRef.current.pauseVideo === 'function') playerRef.current.pauseVideo();
      setIsPlaying(false);
    } catch {}
  }, []);

  // Toggle button handler
  const togglePlay = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      manuallyPausedRef.current = true;
      pausePlaying();
    } else {
      manuallyPausedRef.current = false;
      startPlaying();
    }
  }, [isPlaying, pausePlaying, startPlaying]);

  // Initialize Embedded YouTube Player (built-in across all pages)
  useEffect(() => {
    let isCancelled = false;

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;
      if (playerRef.current) return;

      playerRef.current = new window.YT.Player(playerIframeId.current, {
        height: '100',
        width: '100',
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
          autoplay: 1,
          controls: 0,
          loop: 1,
          playlist: YOUTUBE_VIDEO_ID, // Loop video
          playsinline: 1,
          modestbranding: 1,
          fs: 0,
          rel: 0,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event: any) => {
            if (isCancelled) return;
            // Play immediately when website opens
            if (!manuallyPausedRef.current) {
              try {
                event.target.unMute();
                event.target.setVolume(85);
                event.target.playVideo();
                setIsPlaying(true);
              } catch {}
            }
          },
          onStateChange: (event: any) => {
            if (isCancelled) return;
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              if (manuallyPausedRef.current) {
                setIsPlaying(false);
              }
            } else if (event.data === window.YT.PlayerState.ENDED) {
              // Seamless loop
              if (!manuallyPausedRef.current) {
                try {
                  event.target.playVideo();
                } catch {}
              }
            }
          },
        },
      });
    };

    // Load YouTube IFrame API script if not present
    if (!window.YT) {
      const existingScript = document.getElementById('yt-iframe-api-script');
      if (!existingScript) {
        const tag = document.createElement('script');
        tag.id = 'yt-iframe-api-script';
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }

      const prevOnReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevOnReady) prevOnReady();
        initPlayer();
      };
    } else {
      initPlayer();
    }

    // Browsers often restrict unprompted autoplay with sound until user's first gesture.
    // This handler ensures that on first touch/click anywhere on the page, the music starts
    // playing in the background (unless the user explicitly tapped Pause).
    const handleFirstGesture = () => {
      if (!manuallyPausedRef.current && playerRef.current) {
        startPlaying();
      }
    };

    window.addEventListener('click', handleFirstGesture, { capture: true });
    window.addEventListener('touchstart', handleFirstGesture, { capture: true, passive: true });
    window.addEventListener('pointerdown', handleFirstGesture, { capture: true });

    return () => {
      isCancelled = true;
      window.removeEventListener('click', handleFirstGesture, { capture: true });
      window.removeEventListener('touchstart', handleFirstGesture, { capture: true });
      window.removeEventListener('pointerdown', handleFirstGesture, { capture: true });
      try {
        if (playerRef.current && playerRef.current.destroy) {
          playerRef.current.destroy();
          playerRef.current = null;
        }
      } catch {}
    };
  }, [startPlaying]);

  return (
    <>
      {/* Hidden YouTube Audio Player */}
      <div
        ref={containerRef}
        aria-hidden="true"
        className="fixed -bottom-96 -right-96 w-1 h-1 opacity-0 pointer-events-none overflow-hidden select-none z-0"
      >
        <div id={playerIframeId.current} />
      </div>

      {/* Floating Pause / Play Button */}
      <aside
        aria-label="Background music controls"
        className="fixed bottom-5 left-5 z-40 select-none"
      >
        <button
          type="button"
          onClick={togglePlay}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold backdrop-blur-md shadow-md border transition-all duration-300 cursor-pointer ${
            isPlaying
              ? 'bg-rose-500 text-white border-rose-400 shadow-rose-300/40 hover:bg-rose-600'
              : 'bg-white/90 text-stone-700 border-rose-200 shadow-stone-300/30 hover:bg-white hover:text-rose-600'
          }`}
          title={isPlaying ? 'Pause background song' : 'Play background song'}
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pause Song</span>
              <div className="flex items-end gap-0.5 h-2.5 ml-0.5">
                <span className="w-0.5 h-2 bg-white/90 rounded-full animate-pulse [animation-duration:0.6s]" />
                <span className="w-0.5 h-3 bg-white rounded-full animate-pulse [animation-duration:0.9s]" />
                <span className="w-0.5 h-1.5 bg-white/80 rounded-full animate-pulse [animation-duration:0.5s]" />
              </div>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current text-rose-500 ml-0.5" />
              <span>Play Song</span>
            </>
          )}
        </button>
      </aside>
    </>
  );
};
