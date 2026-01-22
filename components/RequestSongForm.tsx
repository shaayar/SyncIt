"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { requestSong } from "@/services/queueService";

export default function RequestSongForm({ roomId }: { roomId: string }) {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function extractVideoId(url: string) {
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/
    );
    return match?.[1];
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !input.trim()) return;

    setIsSubmitting(true);
    const videoId = extractVideoId(input);

    await requestSong(roomId, {
      provider: videoId ? "youtube" : "local",
      title: input,
      videoId,
      requestedBy: user.uid,
      requestedByName: user.displayName || "User",
    });

    setInput("");
    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste YouTube link or song name..."
        className="w-full px-3 py-2 rounded bg-zinc-800"
      />

      <button
        type="submit"
        disabled={!user || isSubmitting}
        className="w-full px-4 py-2 bg-blue-600 rounded disabled:opacity-50"
      >
        Request
      </button>
    </form>
  );
}
