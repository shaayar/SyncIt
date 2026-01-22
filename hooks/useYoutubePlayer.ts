"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function useYouTubePlayer(videoId?: string) {
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (!videoId) return;

    function createPlayer() {
      playerRef.current = new window.YT.Player("youtube-player", {
        videoId,
        playerVars: {
          controls: 0,
          rel: 0,
        },
        height: "100%",
        width: "100%",
      });
    }

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      window.onYouTubeIframeAPIReady = createPlayer;
    }
  }, [videoId]);

  return playerRef;
}
