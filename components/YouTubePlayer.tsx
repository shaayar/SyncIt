"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YouTubePlayerProps {
  videoId: string;
  isPlaying: boolean;
  startedAt?: number;
}

export default function YouTubePlayer({ videoId, isPlaying, startedAt }: YouTubePlayerProps) {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!videoId || !containerRef.current) return;

    function createPlayer() {
      if (playerRef.current) {
        playerRef.current.destroy();
      }

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          controls: 0,
          rel: 0,
          autoplay: 0,
          mute: 1, // Mute to allow autoplay in most browsers
        },
        events: {
          onReady: (event: any) => {
            const player = event.target;
            
            // Calculate the current time based on when the track started
            if (startedAt && isPlaying) {
              const elapsed = (Date.now() - startedAt) / 1000;
              player.seekTo(elapsed, true);
              player.playVideo();
            } else if (isPlaying) {
              player.playVideo();
            } else {
              player.pauseVideo();
            }
          },
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

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId]);

  // Handle play/pause state changes
  useEffect(() => {
    if (playerRef.current && playerRef.current.playVideo && playerRef.current.pauseVideo) {
      if (isPlaying) {
        if (startedAt) {
          const elapsed = (Date.now() - startedAt) / 1000;
          playerRef.current.seekTo(elapsed, true);
        }
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  }, [isPlaying, startedAt]);

  return (
    <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-inner">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
