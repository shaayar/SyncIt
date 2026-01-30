"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function useYouTubePlayer(
  videoId?: string,
  onEnded?: () => void
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (!videoId || !containerRef.current) return;

    function createPlayer() {
      playerRef.current = new window.YT.Player(
        containerRef.current!,
        {
          videoId,
          width: "100%",
          height: "100%",
          playerVars: {
            controls: 0,
            rel: 0,
            modestbranding: 1,
          },
          events: {
            onStateChange: (e: any) => {
              if (
                e.data === window.YT.PlayerState.ENDED &&
                onEnded
              ) {
                onEnded();
              }
            },
          },
        }
      );
    }

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(script);
      window.onYouTubeIframeAPIReady = createPlayer;
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [videoId, onEnded]);

  return { playerRef, containerRef };
}
