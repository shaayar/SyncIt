import { db } from "@/lib/firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

export async function updateTrackProvider(
  roomId: string, 
  provider: "youtube" | "local"
) {
  const roomRef = doc(db, "rooms", roomId);

  await updateDoc(roomRef, {
    "currentTrack.provider": provider,
    "currentTrack.lastSyncedAt": serverTimestamp(),
    isPlaying: false, // Stop playback when switching providers
  });
}
