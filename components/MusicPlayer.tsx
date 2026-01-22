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
    <div className="flex items-center gap-4">
      <button
        onClick={handlePlay}
        className="group relative px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-green-500/25 transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
        </svg>
        Play
        <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
      </button>
      
      <button
        onClick={handlePause}
        className="group relative px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-red-500/25 transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        Pause
        <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
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
