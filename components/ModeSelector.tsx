"use client";

import { useState } from "react";
import { RoomMode, ROOM_MODES } from "@/types/mode";
import { updateRoomMode } from "@/services/modeService";

interface ModeSelectorProps {
  roomId: string;
  currentMode: RoomMode;
  isHost: boolean;
}

export default function ModeSelector({ roomId, currentMode, isHost }: ModeSelectorProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleModeChange(mode: RoomMode) {
    if (mode === currentMode || !isHost || isUpdating) return;

    setIsUpdating(true);
    try {
      await updateRoomMode(roomId, mode);
    } catch (error) {
      console.error("Failed to update room mode:", error);
    } finally {
      setIsUpdating(false);
    }
  }

  const currentAccent = ROOM_MODES[currentMode].accentColor;

  if (!isHost) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-zinc-400">Mode:</span>
        <span 
          className="px-2 py-1 rounded text-xs font-medium text-white"
          style={{ backgroundColor: currentAccent }}
        >
          {ROOM_MODES[currentMode].name}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-zinc-300">Room Mode</h3>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(ROOM_MODES).map(([mode, config]) => (
          <button
            key={mode}
            onClick={() => handleModeChange(mode as RoomMode)}
            disabled={isUpdating}
            className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              currentMode === mode
                ? "text-white shadow-lg"
                : "text-zinc-300 hover:text-white"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            style={{
              backgroundColor: currentMode === mode ? config.accentColor : "rgb(51 65 85)", // slate-700
            }}
          >
            <div className="flex flex-col items-center gap-1">
              <span>{config.name}</span>
              {currentMode === mode && (
                <div className="absolute inset-0 rounded-lg bg-white opacity-10"></div>
              )}
            </div>
          </button>
        ))}
      </div>
      {isUpdating && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-xs text-zinc-400">
            <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></div>
            Updating mode...
          </div>
        </div>
      )}
    </div>
  );
}
