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
  // isPlaying reflects actual audio state; starts false until browser unlocks it
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  // true once the browser's autoplay lock has been lifted (first gesture)
  const [audioUnlocked, setAudioUnlocked] = useState<boolean>(false);

  const playerRef = useRef<any>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const manuallyPausedRef = useRef<boolean>(false);
  const playerIframeId = useRef(`yt-player-${Math.random().toString(36).substring(2, 9)}`);
  const isUsingNativeAudio = useRef<boolean>(false);
  const gestureListenersAttached = useRef<boolean>(false);
  const unlockedRef = useRef<boolean>(false);

  // ─── Core playback helpers ───────────────────────────────────────────────

  const startPlayback = useCallback(() => {
    manuallyPausedRef.current = false;

    if (isUsingNativeAudio.current && audioElementRef.current) {
      audioElementRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Native failed, try YT
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

    if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
      try {
        playerRef.current.unMute();
        playerRef.current.setVolume(85);
        playerRef.current.setPlaybackQuality?.('small');
        playerRef.current.playVideo();
        setIsPlaying(true);
      } catch {}
    }
  }, []);

  const pausePlayback = useCallback(() => {
    manuallyPausedRef.current = true;
    audioElementRef.current?.pause();
    if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
      try { playerRef.current.pauseVideo(); } catch {}
    }
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      pausePlayback();
    } else {
      startPlayback();
    }
  }, [isPlaying, pausePlayback, startPlayback]);

  // ─── Unlock handler — fires once on first user gesture ──────────────────

  const unlockAndPlay = useCallback(() => {
    if (unlockedRef.current) return;
    unlockedRef.current = true;
    setAudioUnlocked(true);

    if (!manuallyPausedRef.current) {
      startPlayback();
    }
  }, [startPlayback]);

  // ─── Attach one-time gesture listeners ──────────────────────────────────

  const attachGestureListeners = useCallback(() => {
    if (gestureListenersAttached.current) return;
    gestureListenersAttached.current = true;

    const GESTURE_EVENTS = ['click', 'touchstart', 'pointerdown', 'keydown'];

    const handler = () => {
      unlockAndPlay();
      // Remove all gesture listeners immediately after first fire
      GESTURE_EVENTS.forEach((evt) => {
        window.removeEventListener(evt, handler, true);
      });
    };

    GESTURE_EVENTS.forEach((evt) => {
      window.addEventListener(evt, handler, { capture: true, passive: true });
    });
  }, [unlockAndPlay]);

  // ─── Try local audio files first ────────────────────────────────────────

  useEffect(() => {
    const candidateUrls = ['/song.mp3', '/music.mp3', '/audio.mp3', '/kaahe-mose.mp3'];
    let found = false;

    const tryCandidate = (index: number) => {
      if (index >= candidateUrls.length || found) return;
      const audio = new Audio();
      audio.src = candidateUrls[index];
      audio.preload = 'auto';
      audio.loop = true;
      audio.volume = 0.85;

      audio.oncanplaythrough = () => {
        if (!found) {
          found = true;
          isUsingNativeAudio.current = true;
          audioElementRef.current = audio;
          // Attempt autoplay immediately (may be blocked by browser)
          audio.play()
            .then(() => {
              unlockedRef.current = true;
              setAudioUnlocked(true);
              setIsPlaying(true);
            })
            .catch(() => {
              // Browser blocked autoplay — wait for first gesture
              attachGestureListeners();
            });
        }
      };

      audio.onerror = () => tryCandidate(index + 1);
    };

    tryCandidate(0);

    return () => {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current = null;
      }
    };
  }, [attachGestureListeners]);

  // ─── Initialize YouTube IFrame Player ───────────────────────────────────

  useEffect(() => {
    let isCancelled = false;

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player || playerRef.current) return;

      playerRef.current = new window.YT.Player(playerIframeId.current, {
        height: '120',
        width: '200',
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
          autoplay: 1,
          controls: 0,
          loop: 1,
          playlist: YOUTUBE_VIDEO_ID,
          playsinline: 1,
          modestbranding: 1,
          fs: 0,
          rel: 0,
          enablejsapi: 1,
          origin: window.location.origin,
          iv_load_policy: 3,
          mute: 1, // Start muted so autoplay succeeds, then unmute on first gesture
        },
        events: {
          onReady: (event: any) => {
            if (isCancelled || isUsingNativeAudio.current) return;
            try {
              event.target.setPlaybackQuality?.('small');
              // Start muted (browsers allow muted autoplay)
              event.target.mute();
              event.target.playVideo();

              // Immediately try to unmute (works if user already interacted)
              setTimeout(() => {
                if (isCancelled) return;
                try {
                  event.target.unMute();
                  event.target.setVolume(85);
                  setIsPlaying(true);
                  unlockedRef.current = true;
                  setAudioUnlocked(true);
                } catch {
                  // Still blocked — attach gesture listeners to unmute on first tap
                  attachGestureListeners();
                }
              }, 300);
            } catch {
              attachGestureListeners();
            }
          },
          onStateChange: (event: any) => {
            if (isCancelled) return;
            if (event.data === window.YT?.PlayerState?.PLAYING) {
              if (!isUsingNativeAudio.current) setIsPlaying(true);
            } else if (event.data === window.YT?.PlayerState?.PAUSED) {
              if (manuallyPausedRef.current) setIsPlaying(false);
            } else if (event.data === window.YT?.PlayerState?.ENDED) {
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

    if (!window.YT) {
      const existingScript = document.getElementById('yt-iframe-api-script');
      if (!existingScript) {
        const tag = document.createElement('script');
        tag.id = 'yt-iframe-api-script';
        tag.src = 'https://www.youtube.com/iframe_api';
        document.getElementsByTagName('script')[0].parentNode?.insertBefore(
          tag,
          document.getElementsByTagName('script')[0]
        );
      }
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        initPlayer();
      };
    } else {
      initPlayer();
    }

    // Also attach gesture listeners as a safety net in case both audio paths fail
    attachGestureListeners();

    return () => {
      isCancelled = true;
      try {
        playerRef.current?.destroy?.();
        playerRef.current = null;
      } catch {}
    };
  }, [attachGestureListeners]);

  // ─── UI ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Hidden YouTube player — kept in viewport to prevent browser throttling */}
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
          onClick={(e) => {
            // First click always unlocks audio
            if (!audioUnlocked) {
              e.stopPropagation();
              unlockAndPlay();
            } else {
              togglePlay(e);
            }
          }}
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
                <span className="leading-tight text-stone-800">
                  {audioUnlocked ? 'Play Song' : 'Tap to Play ♪'}
                </span>
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
