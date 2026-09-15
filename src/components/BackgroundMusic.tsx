import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Pause, Play, Music } from 'lucide-react';

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

const YOUTUBE_VIDEO_ID = 'fjBaWNRYPGk';

// Exposed so SplashScreen can call startPlayback() on button click (real user gesture)
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
  const playerRef = useRef<any>(null);
  const playerReady = useRef(false);
  const manuallyPaused = useRef(false);
  const playRequested = useRef(false);
  const iframeId = useRef(`yt-${Math.random().toString(36).slice(2, 8)}`);

  const startPlayback = useCallback(() => {
    manuallyPaused.current = false;
    playRequested.current = true;
    if (playerRef.current && playerReady.current) {
      try {
        playerRef.current.unMute();
        playerRef.current.setVolume(80);
        playerRef.current.playVideo();
        setIsPlaying(true);
      } catch {}
    }
  }, []);

  const pausePlayback = useCallback(() => {
    manuallyPaused.current = true;
    if (playerRef.current && playerReady.current) {
      try {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } catch {}
    }
  }, []);

  // Expose globally so SplashScreen can call inside its click handler
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

  // Init YouTube player — starts MUTED so browser allows it
  // We only unmute when startPlayback() is called inside a real user gesture
  useEffect(() => {
    let cancelled = false;

    const initPlayer = () => {
      if (!window.YT?.Player || playerRef.current) return;

      playerRef.current = new window.YT.Player(iframeId.current, {
        height: '1',
        width: '1',
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
          autoplay: 1,          // start buffering + playing immediately (muted)
          mute: 1,              // muted — browsers allow muted autoplay
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
              event.target.mute();
              event.target.setVolume(0);
              event.target.playVideo(); // silent pre-buffering starts now
            } catch {}

            // If startPlayback was already called (e.g., splash click happened fast),
            // apply it now that the player is ready
            if (playRequested.current && !manuallyPaused.current) {
              try {
                event.target.unMute();
                event.target.setVolume(80);
                event.target.playVideo();
                setIsPlaying(true);
              } catch {}
            }
          },
          onStateChange: (event: any) => {
            if (cancelled) return;
            const YT = window.YT;
            if (!YT?.PlayerState) return;
            if (event.data === YT.PlayerState.PLAYING && !manuallyPaused.current && playRequested.current) {
              setIsPlaying(true);
            }
            if (event.data === YT.PlayerState.ENDED && !manuallyPaused.current) {
              try {
                event.target.seekTo(0, true);
                event.target.playVideo();
              } catch {}
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
  }, []);

  return (
    <>
      {/* Hidden YouTube player in viewport corner — prevents browser throttling */}
      <div
        aria-hidden="true"
        className="fixed bottom-0 right-0 w-1 h-1 opacity-[0.001] pointer-events-none overflow-hidden -z-10"
      >
        <div id={iframeId.current} />
      </div>

      {/* Floating control — only shown after song has started */}
      {isPlaying || (!isPlaying && playRequested.current) ? (
        <aside aria-label="Background music controls" className="fixed bottom-5 left-5 z-40 select-none">
          <button
            type="button"
            onClick={togglePlay}
            className={`group flex items-center gap-2.5 px-4 py-2.5 rounded-full text-xs font-semibold backdrop-blur-md shadow-lg border transition-all duration-300 cursor-pointer ${
              isPlaying
                ? 'bg-rose-500/95 text-white border-rose-400 shadow-rose-500/25 hover:bg-rose-600 hover:scale-105'
                : 'bg-white/95 text-stone-700 border-rose-200 shadow-stone-300/40 hover:bg-white hover:text-rose-600 hover:scale-105'
            }`}
            title={isPlaying ? 'Pause' : 'Play'}
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
      ) : null}
    </>
  );
};
