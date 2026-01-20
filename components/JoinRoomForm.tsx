"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { joinRoom } from "@/services/participantService";

export default function JoinRoomForm() {
  const [roomId, setRoomId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  async function handleJoinRoom() {
    if (!roomId) return;

    setLoading(true);
    setError(null);

    try {
      const userId = crypto.randomUUID();
      const userName = "Listener";

      localStorage.setItem("userId", userId);

      await joinRoom({
        roomId,
        userId,
        name: userName,
      });

      router.push(`/room/${roomId}`);
    } catch (err: any) {
      setError(err.message || "Failed to join room");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder="Enter room code"
        className="px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white outline-none"
      />

      <button
        onClick={handleJoinRoom}
        disabled={loading}
        className="px-6 py-3 border border-zinc-700 rounded-lg disabled:opacity-50"
      >
        {loading ? "Joining..." : "Join Room"}
      </button>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
}
