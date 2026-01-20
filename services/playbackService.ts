import { db } from "@/lib/firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

export async function play(roomId: string) {
  const roomRef = doc(db, "rooms", roomId);

  await updateDoc(roomRef, {
    isPlaying: true,
    "currentTrack.startedAt": Date.now(),
    "currentTrack.lastSyncedAt": serverTimestamp(),
  });
}

export async function pause(roomId: string, currentTime: number) {
  const roomRef = doc(db, "rooms", roomId);

  await updateDoc(roomRef, {
    isPlaying: false,
    "currentTrack.pausedAt": Date.now(),
    "currentTrack.pausedTime": currentTime,
  });
}
