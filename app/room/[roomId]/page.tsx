"use client";

import { useParams } from "next/navigation";
import { useRoom } from "@/hooks/useRoom";
import { useEffect, useRef } from "react";
import MusicPlayer from "@/components/MusicPlayer";
import QueuePanel from "@/components/QueuePanel";
import RequestSongForm from "@/components/RequestSongForm";
import ChatBox from "@/components/ChatBox";

export default function RoomPage() {
  const params = useParams();
  const roomId = params.roomId as string;

  // 🔥 FIRST: get room state
  const { room, participants, isHost, loading, error } = useRoom(roomId);

  // 🔥 THEN: refs & effects
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!room || !audioRef.current) return;

    const audio = audioRef.current;

    if (room.isPlaying && room.currentTrack?.startedAt) {
      const elapsed = (Date.now() - room.currentTrack.startedAt) / 1000;

      audio.currentTime = elapsed;
      audio.play().catch(() => {
        // autoplay can fail on some browsers until user interacts
      });
    }

    if (!room.isPlaying) {
      audio.pause();
    }
  }, [room?.isPlaying, room?.currentTrack?.startedAt]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading room...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <h1 className="text-2xl font-bold mb-2">Room: {room?.roomId}</h1>

      <p className="text-zinc-400 mb-4">Host: {room?.hostName}</p>

      <p className="mb-6">
        You are:{" "}
        <span className="font-semibold">{isHost ? "Host" : "Listener"}</span>
      </p>

      {/* 🎧 HOST CONTROLS */}
      {isHost && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Host Controls</h2>
          <MusicPlayer roomId={roomId} />
        </div>
      )}

      {/* 👥 PARTICIPANTS */}
      <h2 className="text-xl font-semibold mb-2">Participants</h2>
      <ul className="space-y-1">
        {participants.map((p) => (
          <li key={p.userId}>
            {p.name}{" "}
            {p.role === "host" && (
              <span className="text-sm text-zinc-400">(host)</span>
            )}
          </li>
        ))}
      </ul>

      {/* 🔊 Shared audio element */}
      <audio ref={audioRef} src="/sample.mp3" preload="auto" />

      <QueuePanel roomId={roomId} isHost={isHost} />

      <ChatBox roomId={roomId} />

      <RequestSongForm roomId={roomId} />
    </main>
  );
}
