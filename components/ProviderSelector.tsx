"use client";

import { useState } from "react";
import { updateTrackProvider } from "@/services/trackService";

interface ProviderSelectorProps {
  roomId: string;
  currentProvider: "youtube" | "local" | null;
  onProviderChange?: (provider: "youtube" | "local") => void;
}

export default function ProviderSelector({ 
  roomId, 
  currentProvider, 
  onProviderChange 
}: ProviderSelectorProps) {
  const [selectedProvider, setSelectedProvider] = useState<"youtube" | "local">(
    currentProvider || "local"
  );
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleProviderChange(provider: "youtube" | "local") {
    if (provider === selectedProvider || isUpdating) return;

    setIsUpdating(true);
    try {
      await updateTrackProvider(roomId, provider);
      setSelectedProvider(provider);
      onProviderChange?.(provider);
    } catch (error) {
      console.error("Failed to update provider:", error);
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4">
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
  );
}
