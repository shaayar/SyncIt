"use client";

import { auth } from "@/lib/firebase";
import { createRoom } from "@/services/roomService";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();

   async function handleCreateRoom() {
    const fakeUser = {
      id: crypto.randomUUID(),
      name: "Host",
    };

    const roomId = await createRoom(fakeUser.id, fakeUser.name);
    router.push(`/room/${roomId}`);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">SyncParty 🎧</h1>
        <p className="text-zinc-400">
          Listen together. In sync. In real time.
        </p>

        <div className="flex gap-4 justify-center">
          <button onClick={handleCreateRoom} className="px-6 py-3 bg-white text-black rounded-lg font-medium">
            Create Room
          </button>
          <button className="px-6 py-3 border border-zinc-700 rounded-lg">
            Join Room
          </button>
        </div>
      </div>
    </main>
  );
}
