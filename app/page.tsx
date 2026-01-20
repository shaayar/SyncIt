"use client";

import { auth } from "@/lib/firebase";
import { createRoom } from "@/services/roomService";
import { useRouter } from "next/navigation";
import JoinRoomForm from "@/components/JoinRoomForm";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const router = useRouter();
  const { user, login, loading } = useAuth();

  async function handleCreateRoom() {
    if (!user) return;

    const roomId = await createRoom(user.uid, user.displayName || "Host");

    router.push(`/room/${roomId}`);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">SyncParty 🎧</h1>
        <p className="text-zinc-400">Listen together. In sync. In real time.</p>

        <div className="flex flex-col gap-6 justify-center">
          {user && (
            <button
              onClick={handleCreateRoom}
              className="px-6 py-3 bg-green-600 rounded"
            >
              Create Room
            </button>
          )}

          <button
            onClick={login}
            disabled={loading}
            className="px-6 py-3 bg-white text-black rounded-lg font-medium"
          >
            {user ? "Continue as " + user.displayName : "Sign in with Google"}
          </button>

          <div className="flex items-center justify-center gap-2">
            <hr className="flex-1" />
            OR
            <hr className="flex-1" />
          </div>

          <JoinRoomForm />
        </div>
      </div>
    </main>
  );
}
