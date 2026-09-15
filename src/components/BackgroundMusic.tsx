import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, Music } from 'lucide-react';

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

const YOUTUBE_VIDEO_ID = 'fjBaWNRYPGk';

export const BackgroundMusic: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true); // starts muted until first gesture

  const playerRef = useRef<any>(null);
  const playerReady = useRef<boolean>(false);
  const manuallyPaused = useRef<boolean>(false);
  const unmuteHandled = useRef<boolean>(false);
  const playerIframeId = useRef(`yt-${Math.random().toString(36).slice(2, 8)}`);

  // ─── Unmute (called inside a real user gesture so browser allows it) ────
  const doUnmute = useCallback(() => {
    if (unmuteHandled.current) return;
    unmuteHandled.current = true;

    if (playerRef.current && playerReady.current) {
      try {
        playerRef.current.unMute();
        playerRef.current.setVolume(85);
        setIsMuted(false);
        setIsPlaying(true);
      } catch {}
    }
  }, []);

  // ─── Attach one-shot gesture listeners ──────────────────────────────────
  const attachGestureListeners = useCallback(() => {
    const EVENTS = ['click', 'touchstart', 'pointerdown', 'keydown'];

    const handler = () => {
      doUnmute();
      EVENTS.forEach((e) => window.removeEventListener(e, handler, true));
    };

    EVENTS.forEach((e) =>
      window.addEventListener(e, handler, { capture: true, passive: true })
    );
  }, [doUnmute]);

  // ─── Toggle (pause / resume with sound) ─────────────────────────────────
  const togglePlay = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();

    // If still muted, first click = unmute + play (don't toggle off)
    if (isMuted) {
      doUnmute();
      return;
    }

    if (!playerRef.current || !playerReady.current) return;

    try {
      if (isPlaying) {
        manuallyPaused.current = true;
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        manuallyPaused.current = false;
        playerRef.current.unMute();
        playerRef.current.setVolume(85);
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    } catch {}
  }, [isPlaying, isMuted, doUnmute]);

  // ─── Init YouTube IFrame API ─────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const initPlayer = () => {
      if (!window.YT?.Player || playerRef.current) return;

      playerRef.current = new window.YT.Player(playerIframeId.current, {
        height: '1',
        width: '1',
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
          autoplay: 1,   // start playing immediately
          mute: 1,        // muted so browser allows autoplay
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
        },
        events: {
          onReady: (event: any) => {
            if (cancelled) return;
            playerReady.current = true;
            try {
              event.target.setPlaybackQuality?.('small');
              event.target.mute();       // ensure muted
              event.target.setVolume(0);
              event.target.playVideo();  // start silent playback
              // Show muted-playing state so UI reflects background is active
              setIsPlaying(false); // not "playing with sound" yet
            } catch {}

            // Attach gesture listeners — first tap anywhere will unmute
            attachGestureListeners();
          },

          onStateChange: (event: any) => {
            if (cancelled) return;
            const YT = window.YT;
            if (!YT?.PlayerState) return;

            if (event.data === YT.PlayerState.ENDED) {
              if (!manuallyPaused.current) {
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
      if (!document.getElementById('yt-iframe-api')) {
        const tag = document.createElement('script');
        tag.id = 'yt-iframe-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
      }
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => { prev?.(); initPlayer(); };
    } else {
      initPlayer();
    }

    return () => {
      cancelled = true;
      try { playerRef.current?.destroy?.(); playerRef.current = null; } catch {}
    };
  }, [attachGestureListeners]);

  // ─── UI ──────────────────────────────────────────────────────────────────
  const showPlaying = isPlaying && !isMuted;

  return (
    <>
      {/* Hidden YouTube player — kept in viewport corner to prevent browser throttling */}
      <div
        aria-hidden="true"
        className="fixed bottom-0 right-0 w-1 h-1 opacity-[0.001] pointer-events-none overflow-hidden -z-10"
      >
        <div id={playerIframeId.current} />
      </div>

      {/* Floating control */}
      <aside
        aria-label="Background music controls"
        className="fixed bottom-5 left-5 z-40 select-none"
      >
        <button
          type="button"
          onClick={togglePlay}
          className={`group flex items-center gap-2.5 px-4 py-2.5 rounded-full text-xs font-semibold backdrop-blur-md shadow-lg border transition-all duration-300 cursor-pointer ${
            showPlaying
              ? 'bg-rose-500/95 text-white border-rose-400 shadow-rose-500/25 hover:bg-rose-600 hover:scale-105'
              : 'bg-white/95 text-stone-700 border-rose-200 shadow-stone-300/40 hover:bg-white hover:text-rose-600 hover:scale-105'
          }`}
          title={showPlaying ? 'Pause background song' : 'Play background song'}
        >
          {showPlaying ? (
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
                <span className="leading-tight text-stone-800">
                  {isMuted ? 'Tap anywhere ♪' : 'Play Song'}
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
