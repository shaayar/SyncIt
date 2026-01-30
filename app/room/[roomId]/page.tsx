"use client";

import { useParams } from "next/navigation";
import { useRoom } from "@/hooks/useRoom";
import { useEffect, useRef } from "react";

import RoomHeader from "@/components/RoomHeader";
import QueuePanel from "@/components/QueuePanel";
import RequestSongForm from "@/components/RequestSongForm";
import ChatBox from "@/components/ChatBox";
import ParticipantList from "@/components/ParticipantList";
import YouTubePlayer from "@/components/YouTubePlayer";
import LocalAudioControls from "@/components/LocalAudioControls";
import YouTubeControls from "@/components/YouTubeControls";
import ModeSelector from "@/components/ModeSelector";

import { updateTrackProvider } from "@/services/trackService";
import { getNextApprovedItem, markAsPlayed } from "@/services/queueService";
import { playYouTube } from "@/services/youtubePlaybackService";
import { play } from "@/services/playbackService";
import { DEFAULT_MODE } from "@/types/mode";

export default function RoomPage() {
  const params = useParams();
  const roomId = params.roomId as string;

  const { room, participants, isHost, loading, error } =
    useRoom(roomId);

  const audioRef = useRef<HTMLAudioElement>(null);
  const prevAudioUrl = useRef<string | null>(null);

  const provider = room?.currentTrack?.provider ?? "local";

  /* =========================
     AUTO-ADVANCE (SHARED)
     ========================= */
  async function handleTrackEnded() {
    if (!isHost) return;

    const next = await getNextApprovedItem(roomId);
    if (!next) return;

    await markAsPlayed(roomId, next.id);

    if (next.provider === "youtube") {
      playYouTube(roomId, next.videoId!);
    } else {
      play(roomId);
    }
  }

  /* =========================
     LOCAL AUDIO SYNC
     ========================= */
  useEffect(() => {
    if (!room || !audioRef.current || !room.currentTrack) return;

    const audio = audioRef.current;

    if (provider !== "local") {
      audio.pause();
      audio.currentTime = 0;
      return;
    }

    if (
      room.currentTrack.audioUrl &&
      room.currentTrack.audioUrl !== prevAudioUrl.current
    ) {
      if (prevAudioUrl.current) {
        URL.revokeObjectURL(prevAudioUrl.current);
      }
      audio.src = room.currentTrack.audioUrl;
      prevAudioUrl.current = room.currentTrack.audioUrl;
    }

    if (room.isPlaying && room.currentTrack.startedAt) {
      const elapsed =
        (Date.now() - room.currentTrack.startedAt) / 1000;
      audio.currentTime = elapsed;
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [
    provider,
    room?.isPlaying,
    room?.currentTrack?.audioUrl,
    room?.currentTrack?.startedAt,
  ]);

  /* =========================
     LOCAL AUDIO END EVENT
     ========================= */
  useEffect(() => {
    if (!audioRef.current || provider !== "local") return;

    const audio = audioRef.current;
    audio.addEventListener("ended", handleTrackEnded);

    return () =>
      audio.removeEventListener("ended", handleTrackEnded);
  }, [provider, isHost]);

  /* =========================
     LOADING / ERROR
     ========================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-zinc-400">
        Loading room...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-red-400">
        {error}
      </div>
    );
  }

  /* =========================
     RENDER
     ========================= */
  return (
    <main className="min-h-screen bg-slate-900 text-zinc-200">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <RoomHeader roomId={roomId} />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
            {/* LEFT */}
            <div className="xl:col-span-2 space-y-6">
              {/* NOW PLAYING */}
              <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                <h2 className="text-xl font-semibold mb-4">
                  Now Playing
                </h2>

              {provider === "youtube" &&
                room?.currentTrack?.videoId && (
                  <YouTubePlayer
                    videoId={room.currentTrack.videoId}
                    isPlaying={room.isPlaying}
                    startedAt={room.currentTrack.startedAt}
                    onEnded={handleTrackEnded}
                  />
                )}

              {provider === "local" && (
                <div className="text-center py-12 text-zinc-400">
                  {room?.currentTrack?.title ||
                    "Local audio source"}
                </div>
              )}

              <audio ref={audioRef} hidden preload="auto" />
            </div>

            {/* HOST CONTROLS */}
            {isHost && (
              <div className="bg-slate-800 rounded-2xl p-6 space-y-6 border border-slate-700">
                <h2 className="text-xl font-semibold">
                  Host Controls
                </h2>

                {/* Mode Selector */}
                <ModeSelector 
                  roomId={roomId} 
                  currentMode={room?.mode || DEFAULT_MODE}
                  isHost={isHost}
                />

                {/* Provider Selection */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-zinc-300">Audio Source</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() =>
                        updateTrackProvider(roomId, "local")
                      }
                      className={`py-3 rounded-xl text-white ${
                        provider === "local"
                          ? "bg-indigo-500"
                          : "bg-slate-700"
                      }`}
                    >
                      Local Audio
                    </button>

                    <button
                      onClick={() =>
                        updateTrackProvider(roomId, "youtube")
                      }
                      className={`py-3 rounded-xl text-white ${
                        provider === "youtube"
                          ? "bg-indigo-500"
                          : "bg-slate-700"
                      }`}
                    >
                      YouTube
                    </button>
                  </div>
                </div>

                {provider === "local" ? (
                  <LocalAudioControls roomId={roomId} />
                ) : (
                  <YouTubeControls roomId={roomId} />
                )}
              </div>
            )}

            {/* QUEUE */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <QueuePanel roomId={roomId} isHost={isHost} />
              <div className="mt-6">
                <RequestSongForm roomId={roomId} />
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <ParticipantList
                participants={participants}
                isHost={isHost}
              />
            </div>

            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 sticky top-6">
              <ChatBox roomId={roomId} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}