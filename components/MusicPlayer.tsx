"use client";

import { play, pause } from "@/services/playbackService";
import { useRef } from "react";

export default function MusicPlayer({
  roomId,
}: {
  roomId: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);

  async function handlePlay() {
    await play(roomId);
  }

  async function handlePause() {
    const currentTime =
      audioRef.current?.currentTime ?? 0;
    await pause(roomId, currentTime);
  }

  return (
    <div className="flex gap-4 mt-6">
      <button
        onClick={handlePlay}
        className="px-4 py-2 bg-green-600 rounded"
      >
        Play
      </button>
      <button
        onClick={handlePause}
        className="px-4 py-2 bg-red-600 rounded"
      >
        Pause
      </button>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src="/sample.mp3"
        preload="auto"
      />
    </div>
  );
}
