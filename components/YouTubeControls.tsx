"use client";

import { useState } from "react";
import { playYouTube } from "@/services/youtubePlaybackService";

export default function YouTubeControls({ roomId }: { roomId: string }) {
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
    <div className="space-y-3">
      <input
        type="text"
        value={youtubeUrl}
        onChange={(e) => setYoutubeUrl(e.target.value)}
        placeholder="Paste YouTube link..."
        className="w-full px-3 py-2 rounded bg-zinc-800 border border-zinc-700 focus:border-zinc-600 outline-none transition-colors"
      />

      <button
        onClick={handleYouTubePlay}
        className="w-full px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition-colors font-medium"
      >
        Load & Play
      </button>
    </div>
  );
}
