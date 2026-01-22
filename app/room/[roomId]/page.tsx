"use client";

import { useParams } from "next/navigation";
import { useRoom } from "@/hooks/useRoom";
import { useEffect, useRef } from "react";

import QueuePanel from "@/components/QueuePanel";
import RequestSongForm from "@/components/RequestSongForm";
import ChatBox from "@/components/ChatBox";
import RoomHeader from "@/components/RoomHeader";
import ProviderSelector from "@/components/ProviderSelector";

import { useYouTubePlayer } from "@/hooks/useYoutubePlayer";
import HostControls from "@/components/HostControls";

export default function RoomPage() {
  const params = useParams();
  const roomId = params.roomId as string;

  const { room, participants, isHost, loading, error } = useRoom(roomId);

  const audioRef = useRef<HTMLAudioElement>(null);
  const provider = room?.currentTrack?.provider;

  /* =========================
     LOCAL AUDIO SYNC
     ========================= */
  useEffect(() => {
    if (!room || !audioRef.current || !room.currentTrack) return;

    const audio = audioRef.current;

    // If not local provider, ensure audio is stopped
    if (room.currentTrack.provider !== "local") {
      audio.pause();
      audio.currentTime = 0;
      return;
    }

    // Set audio source if provided
    if (room.currentTrack.audioUrl) {
      audio.src = room.currentTrack.audioUrl;
    }

    if (room.isPlaying && room.currentTrack.startedAt) {
      const elapsed = (Date.now() - room.currentTrack.startedAt) / 1000;
      audio.currentTime = elapsed;
      audio.play().catch(() => {
        // autoplay restrictions (expected)
      });
    } else {
      audio.pause();
    }
  }, [room?.currentTrack?.provider, room?.currentTrack?.audioUrl, room?.isPlaying, room?.currentTrack?.startedAt]);

  /* =========================
     YOUTUBE PLAYER SYNC
     ========================= */
  const playerRef = useYouTubePlayer(
    provider === "youtube" ? room?.currentTrack?.videoId : undefined,
  );

  useEffect(() => {
    if (!room || !playerRef.current) return;
    if (provider !== "youtube") return;

    const player = playerRef.current;

    if (room.isPlaying && room.currentTrack?.startedAt) {
      const elapsed = (Date.now() - room.currentTrack.startedAt) / 1000;

      player.seekTo(elapsed, true);
      player.playVideo();
    } else {
      player.pauseVideo();
    }
  }, [provider, room?.isPlaying, room?.currentTrack?.startedAt]);

  /* =========================
     LOADING / ERROR STATES
     ========================= */
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-gradient-to-br from-zinc-900 via-zinc-950 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading room...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-zinc-900 via-zinc-950 to-black flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 max-w-md">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  /* =========================
     RENDER
     ========================= */
  return (
    <main className="min-h-screen bg-linear-to-br from-zinc-900 via-zinc-950 to-black text-white">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* HEADER */}
        <RoomHeader roomId={roomId} />

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
          
          {/* LEFT: MEDIA + CONTROLS */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* MEDIA CARD */}
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Now Playing
                {room?.currentTrack?.title && (
                  <span className="text-sm font-normal text-zinc-400">
                    - {room.currentTrack.title}
                  </span>
                )}
              </h2>

              {/* YouTube Player */}
              {provider === "youtube" && room?.currentTrack?.videoId && (
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-inner">
                  <div id="youtube-player" />
                </div>
              )}

              {/* Local Audio Player */}
              {provider === "local" && (
                <div className="bg-zinc-800 rounded-xl p-8 text-center">
                  <svg className="w-16 h-16 mx-auto mb-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                  <p className="text-zinc-400 mb-2">Local Audio Source</p>
                  {room?.currentTrack?.title ? (
                    <p className="text-white font-medium">{room.currentTrack.title}</p>
                  ) : (
                    <p className="text-zinc-500 text-sm">No track loaded</p>
                  )}
                </div>
              )}

              {/* No Provider Selected */}
              {!provider && (
                <div className="bg-zinc-800 rounded-xl p-8 text-center">
                  <svg className="w-16 h-16 mx-auto mb-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                  <p className="text-zinc-400 mb-2">No Audio Source Selected</p>
                  <p className="text-zinc-500 text-sm">Choose a source below to get started</p>
                </div>
              )}

              {/* Hidden Audio Element */}
              <audio
                ref={audioRef}
                preload="auto"
                className="hidden"
              />
            </div>

            {/* HOST CONTROLS */}
            {isHost && (
              <div className="space-y-6">
                {/* Provider Selection */}
                <ProviderSelector 
                  roomId={roomId} 
                  currentProvider={provider || null}
                />
                
                {/* Playback Controls */}
                <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-6 shadow-2xl">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Playback Controls
                  </h2>
                  <HostControls roomId={roomId} />
                </div>
              </div>
            )}

            {/* QUEUE */}
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-6 shadow-2xl">
              <QueuePanel roomId={roomId} isHost={isHost} />
              <div className="mt-6">
                <RequestSongForm roomId={roomId} />
              </div>
            </div>
          </div>

          {/* RIGHT: CHAT */}
          <div className="xl:col-span-1">
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-6 shadow-2xl h-full sticky top-6">
              <ChatBox roomId={roomId} />
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
