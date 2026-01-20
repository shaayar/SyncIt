"use client";

import { useParams } from "next/navigation";

export default function RoomPage() {
  const params = useParams();
  const roomId = params.roomId as string;

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-900 text-white">
      <h1 className="text-2xl">
        Room: <span className="font-mono">{roomId}</span>
      </h1>
    </main>
  );
}
