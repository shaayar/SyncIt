"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { requestSong } from "@/services/queueService";

export default function RequestSongForm({ roomId }: { roomId: string }) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !user) return;

    await requestSong(roomId, {
      title: title.trim(),
      requestedBy: user.uid,
      requestedByName: user.displayName || "User",
    });

    setTitle("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h1 className="text-xl font-semibold mb-2">Request Your Song</h1>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter song title..."
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        disabled={!title.trim() || !user}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Send Request
      </button>
    </form>
  );
}
