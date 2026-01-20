import { db } from "@/lib/firebase";
import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

/**
 * Generates a short readable room ID
 * Example: "k8f2x9"
 */
function generateRoomId(length = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function createRoom(
  hostId: string,
  hostName: string
): Promise<string> {
  const roomId = generateRoomId();

  const roomRef = doc(db, "rooms", roomId);

  await setDoc(roomRef, {
    roomId,
    hostId,
    hostName,
    createdAt: serverTimestamp(),
    isActive: true,
    isPlaying: false,
    participantsCount: 1,
    mode: "music",
    currentTrack: null,
    settings: {
      allowRequests: true,
      allowChat: true,
    },
  });

  // Add host as first participant
  await setDoc(doc(db, "rooms", roomId, "participants", hostId), {
    userId: hostId,
    name: hostName,
    role: "host",
    joinedAt: serverTimestamp(),
    isOnline: true,
  });

  return roomId;
}
