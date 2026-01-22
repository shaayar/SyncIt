"use client";

import { useParams } from "next/navigation";
import { useRoom } from "@/hooks/useRoom";
import { useEffect, useRef, useState } from "react";
import { updateTrackProvider } from "@/services/trackService";

import QueuePanel from "@/components/QueuePanel";
import RequestSongForm from "@/components/RequestSongForm";
import ChatBox from "@/components/ChatBox";
import RoomHeader from "@/components/RoomHeader";
import YouTubePlayer from "@/components/YouTubePlayer";
import ParticipantList from "@/components/ParticipantList";
import LocalAudioControls from "@/components/LocalAudioControls";
import YouTubeControls from "@/components/YouTubeControls";

import { useYouTubePlayer } from "@/hooks/useYoutubePlayer";

export default function RoomPage() {
  const params = useParams();
  const roomId = params.roomId as string;

  const { room, participants, isHost, loading, error } = useRoom(roomId);

  const audioRef = useRef<HTMLAudioElement>(null);
  const provider = room?.currentTrack?.provider;

  // Provider selector state
  const [selectedProvider, setSelectedProvider] = useState<"youtube" | "local">(
    provider || "local"
  );
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleProviderChange(provider: "youtube" | "local") {
    if (provider === selectedProvider || isUpdating) return;

    setIsUpdating(true);
    try {
      await updateTrackProvider(roomId, provider);
      setSelectedProvider(provider);
    } catch (error) {
      console.error("Failed to update provider:", error);
    } finally {
      setIsUpdating(false);
    }
  }

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
                <YouTubePlayer 
                  videoId={room.currentTrack.videoId}
                  isPlaying={room.isPlaying}
                  startedAt={room.currentTrack.startedAt}
                />
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
              <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-6 shadow-2xl">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Audio Source & Playback Controls
                </h2>
                
                {/* Provider Selection */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    Audio Source
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleProviderChange("local")}
                      disabled={isUpdating}
                      className={`relative px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                        selectedProvider === "local"
                          ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                          : "bg-zinc-700/50 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                        <span>Local Audio</span>
                      </div>
                      {selectedProvider === "local" && (
                        <div className="absolute inset-0 rounded-xl bg-white opacity-10"></div>
                      )}
                    </button>

                    <button
                      onClick={() => handleProviderChange("youtube")}
                      disabled={isUpdating}
                      className={`relative px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                        selectedProvider === "youtube"
                          ? "bg-red-500 text-white shadow-lg shadow-red-500/25"
                          : "bg-zinc-700/50 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                        <span>YouTube</span>
                      </div>
                      {selectedProvider === "youtube" && (
                        <div className="absolute inset-0 rounded-xl bg-white opacity-10"></div>
                      )}
                    </button>
                  </div>

                  {isUpdating && (
                    <div className="mt-3 text-center">
                      <div className="inline-flex items-center gap-2 text-sm text-zinc-400">
                        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Switching source...
                      </div>
                    </div>
                  )}
                </div>

                {/* Playback Controls */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Playback Controls
                  </h3>
                  
                  {selectedProvider === "local" ? (
                    <LocalAudioControls roomId={roomId} />
                  ) : (
                    <YouTubeControls roomId={roomId} />
                  )}
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

          {/* RIGHT: CHAT & PARTICIPANTS */}
          <div className="xl:col-span-1 space-y-6">
            {/* Participants */}
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-6 shadow-2xl">
              <ParticipantList participants={participants} isHost={isHost} />
            </div>
            
            {/* Chat */}
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-6 shadow-2xl h-full sticky top-6">
              <ChatBox roomId={roomId} />
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
