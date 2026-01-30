export type RoomMode = "hangout" | "party" | "together" | "focus";

export interface RoomModeConfig {
  name: string;
  accentColor: string;
  description: string;
}

export const ROOM_MODES: Record<RoomMode, RoomModeConfig> = {
  hangout: {
    name: "Hangout",
    accentColor: "#6366F1", // indigo-500
    description: "Casual group listening"
  },
  party: {
    name: "Party", 
    accentColor: "#EC4899", // pink-500
    description: "Energetic group sessions"
  },
  together: {
    name: "Together",
    accentColor: "#FB7185", // rose-500
    description: "Private / emotional listening"
  },
  focus: {
    name: "Focus",
    accentColor: "#22C55E", // green-500
    description: "Solo or distraction-free listening"
  }
};

export const DEFAULT_MODE: RoomMode = "hangout";
