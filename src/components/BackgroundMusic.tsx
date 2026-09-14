import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, Music } from 'lucide-react';

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

// "Kaahe Mose" by Garvit-Priyansh (Official Track)
const YOUTUBE_VIDEO_ID = 'fjBaWNRYPGk';

export const BackgroundMusic: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const playerRef = useRef<any>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const manuallyPausedRef = useRef<boolean>(false);
  const playerIframeId = useRef(`yt-player-${Math.random().toString(36).substring(2, 9)}`);
  const isUsingNativeAudio = useRef<boolean>(false);

  // Helper to start playback smoothly across either engine
  const startPlayback = useCallback(() => {
    manuallyPausedRef.current = false;
    setHasInteracted(true);

    // If native audio is available and working, prioritize it for zero latency
    if (isUsingNativeAudio.current && audioElementRef.current) {
      audioElementRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Fallback to YouTube
        if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
          try {
            playerRef.current.unMute();
            playerRef.current.setVolume(85);
            playerRef.current.playVideo();
            setIsPlaying(true);
          } catch {}
        }
      });
      return;
    }

    // YouTube playback
    if (playerRef.current) {
      try {
        if (typeof playerRef.current.unMute === 'function') playerRef.current.unMute();
        if (typeof playerRef.current.setVolume === 'function') playerRef.current.setVolume(85);
        if (typeof playerRef.current.setPlaybackQuality === 'function') {
          playerRef.current.setPlaybackQuality('small'); // Minimal bandwidth for zero-lag streaming
        }
        if (typeof playerRef.current.playVideo === 'function') {
          playerRef.current.playVideo();
        }
        setIsPlaying(true);
      } catch {}
    }
  }, []);

  // Helper to pause playback smoothly
  const pausePlayback = useCallback(() => {
    manuallyPausedRef.current = true;
    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }
    if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
      try {
        playerRef.current.pauseVideo();
      } catch {}
    }
    setIsPlaying(false);
  }, []);

  // Toggle button handler
  const togglePlay = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      pausePlayback();
    } else {
      startPlayback();
    }
  }, [isPlaying, pausePlayback, startPlayback]);

  // Try loading local audio file first (if user puts song.mp3 or music.mp3 in /public)
  useEffect(() => {
    const testAudio = new Audio();
    const candidateUrls = ['/song.mp3', '/music.mp3', '/audio.mp3', '/kaahe-mose.mp3'];

    let found = false;
    const tryCandidate = (index: number) => {
      if (index >= candidateUrls.length || found) return;
      const url = candidateUrls[index];
      
      const audio = new Audio();
      audio.src = url;
      audio.preload = 'auto';
      audio.loop = true;

      audio.oncanplaythrough = () => {
        if (!found) {
          found = true;
          isUsingNativeAudio.current = true;
          audioElementRef.current = audio;
          audio.volume = 0.85;
          audio.play().then(() => {
            setIsPlaying(true);
          }).catch(() => {
            // Autoplay policy waiting for user gesture
          });
        }
      };

      audio.onerror = () => {
        tryCandidate(index + 1);
      };
    };

    tryCandidate(0);

    return () => {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current = null;
      }
    };
  }, []);

  // Initialize Embedded High-Performance YouTube Audio Engine
  useEffect(() => {
    let isCancelled = false;

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;
      if (playerRef.current) return;

      playerRef.current = new window.YT.Player(playerIframeId.current, {
        height: '120',
        width: '200',
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
          autoplay: 1,
          controls: 0,
          loop: 1,
          playlist: YOUTUBE_VIDEO_ID, // Built-in loop
          playsinline: 1,
          modestbranding: 1,
          fs: 0,
          rel: 0,
          enablejsapi: 1,
          origin: window.location.origin,
          iv_load_policy: 3,
        },
        events: {
          onReady: (event: any) => {
            if (isCancelled) return;
            try {
              // Crucial for performance: set to lowest video quality so 100% of bandwidth goes to audio
              if (typeof event.target.setPlaybackQuality === 'function') {
                event.target.setPlaybackQuality('small');
              }
              if (!manuallyPausedRef.current && !isUsingNativeAudio.current) {
                event.target.unMute();
                event.target.setVolume(85);
                event.target.playVideo();
                setIsPlaying(true);
              }
            } catch {}
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
              // Instant seamless loop without buffering reload
              if (!manuallyPausedRef.current) {
                try {
                  event.target.seekTo(0, true);
                  event.target.playVideo();
                } catch {}
              }
            }
          },
        },
      });
    };

    // Load YouTube IFrame API script cleanly
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

    // Modern browsers strictly require 1 interaction to unlock sound if autoplay was blocked.
    // This listener catches the VERY FIRST tap, touch, click, or scroll anywhere on the screen,
    // immediately starting the music smoothly and removing listeners.
    const handleFirstGesture = () => {
      if (!manuallyPausedRef.current) {
        startPlayback();
      }
    };

    const gestureEvents = ['click', 'touchstart', 'touchend', 'pointerdown', 'scroll', 'keydown'];
    gestureEvents.forEach((evt) => {
      window.addEventListener(evt, handleFirstGesture, { capture: true, passive: true });
    });

    return () => {
      isCancelled = true;
      gestureEvents.forEach((evt) => {
        window.removeEventListener(evt, handleFirstGesture, { capture: true });
      });
      try {
        if (playerRef.current && playerRef.current.destroy) {
          playerRef.current.destroy();
          playerRef.current = null;
        }
      } catch {}
    };
  }, [startPlayback]);

  return (
    <>
      {/* 
        CRITICAL FIX FOR ZERO LAG:
        We position the YouTube player inside the active viewport at bottom-right with 
        opacity-[0.001] rather than offscreen (-bottom-999px).
        Mobile Safari and Chromium throttle offscreen/1px iframes to save power, which 
        caused the stuttering/lagging. Keeping it in the viewport ensures full 60fps audio decoding!
      */}
      <div
        aria-hidden="true"
        className="fixed bottom-0 right-0 w-36 h-24 opacity-[0.001] pointer-events-none overflow-hidden select-none -z-10"
      >
        <div id={playerIframeId.current} />
      </div>

      {/* Floating Audio Control Button */}
      <aside
        aria-label="Background music controls"
        className="fixed bottom-5 left-5 z-40 select-none"
      >
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
              {/* Equalizer animation */}
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
