"use client";

import { play, pause } from "@/services/playbackService";

export default function LocalAudioControls({ roomId }: { roomId: string }) {
  return (
    <div className="space-y-3">
      <label className="inline-block">
        <input
          type="file"
          accept="audio/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const url = URL.createObjectURL(file);

            // Host-only local audio sync
            play(roomId);
          }}
        />
        <span className="px-4 py-2 bg-zinc-800 rounded cursor-pointer hover:bg-zinc-700 transition-colors">
          Select Local Audio
        </span>
      </label>

      <div className="flex gap-3">
        <button
          onClick={() => play(roomId)}
          className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition-colors"
        >
          Play
        </button>
        <button
          onClick={() => pause(roomId, 0)}
          className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition-colors"
        >
          Pause
        </button>
      </div>
    </div>
  );
}
