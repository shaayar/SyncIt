"use client";

import { useEffect } from "react";
import { useYouTubePlayer } from "@/hooks/useYoutubePlayer";

export interface YouTubePlayerProps {
  videoId: string;
  isPlaying: boolean;
  startedAt?: number;
  onEnded?: () => void;
}

export default function YouTubePlayer({
  videoId,
  isPlaying,
  startedAt,
  onEnded,
}: YouTubePlayerProps) {
  const { playerRef, containerRef } = useYouTubePlayer(
    videoId,
    onEnded
  );

  useEffect(() => {
    if (!playerRef.current) return;

    if (isPlaying && startedAt) {
      const elapsed =
        (Date.now() - startedAt) / 1000;

      playerRef.current.seekTo(elapsed, true);
      playerRef.current.playVideo();
    } else {
      playerRef.current.pauseVideo();
    }
  }, [isPlaying, startedAt]);

  return (
    <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
      <div ref={containerRef} />
    </div>
  );
}
