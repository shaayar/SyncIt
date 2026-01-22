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

export async function updateYouTubeVideo(
  roomId: string,
  videoId: string,
  title: string
) {
  const roomRef = doc(db, "rooms", roomId);

  await updateDoc(roomRef, {
    currentTrack: {
      provider: "youtube",
      videoId,
      title,
      startedAt: Date.now(),
      lastSyncedAt: serverTimestamp(),
    },
    isPlaying: false,
  });
}

export async function updateLocalAudio(
  roomId: string,
  audioUrl: string,
  title: string
) {
  const roomRef = doc(db, "rooms", roomId);

  await updateDoc(roomRef, {
    currentTrack: {
      provider: "local",
      audioUrl,
      title,
      startedAt: Date.now(),
      lastSyncedAt: serverTimestamp(),
    },
    isPlaying: false,
  });
}
