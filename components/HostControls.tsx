"use client";

import { useState } from "react";
import { play, pause } from "@/services/playbackService";
import { playYouTube } from "@/services/youtubePlaybackService";

export default function HostControls({ roomId }: { roomId: string }) {
  const [mode, setMode] = useState<"local" | "youtube">("local");
  const [youtubeUrl, setYoutubeUrl] = useState("");

  function extractVideoId(url: string) {
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/
    );
    return match?.[1];
  }

  async function handleYouTubePlay() {
    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) return alert("Invalid YouTube URL");

    await playYouTube(roomId, videoId);
  }

  return (
    <div className="space-y-4">
      {/* MODE SWITCH */}
      <div className="flex gap-3">
        <button
          onClick={() => setMode("local")}
          className={`px-4 py-2 rounded ${
            mode === "local"
              ? "bg-white text-black"
              : "bg-zinc-800"
          }`}
        >
          Local Audio
        </button>

        <button
          onClick={() => setMode("youtube")}
          className={`px-4 py-2 rounded ${
            mode === "youtube"
              ? "bg-white text-black"
              : "bg-zinc-800"
          }`}
        >
          YouTube
        </button>
      </div>

      {/* LOCAL MODE */}
      {mode === "local" && (
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
            <span className="px-4 py-2 bg-zinc-800 rounded cursor-pointer">
              Select Local Audio
            </span>
          </label>

          <div className="flex gap-3">
            <button
              onClick={() => play(roomId)}
              className="px-4 py-2 bg-green-600 rounded"
            >
              Play
            </button>
            <button
              onClick={() => pause(roomId, 0)}
              className="px-4 py-2 bg-red-600 rounded"
            >
              Pause
            </button>
          </div>
        </div>
      )}

      {/* YOUTUBE MODE */}
      {mode === "youtube" && (
        <div className="space-y-3">
          <input
            type="text"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="Paste YouTube link..."
            className="w-full px-3 py-2 rounded bg-zinc-800"
          />

          <button
            onClick={handleYouTubePlay}
            className="px-4 py-2 bg-red-600 rounded"
          >
            Load & Play
          </button>
        </div>
      )}
    </div>
  );
}
