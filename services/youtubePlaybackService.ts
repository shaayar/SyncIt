import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export async function playYouTube(
  roomId: string,
  videoId: string
) {
  await updateDoc(doc(db, "rooms", roomId), {
    isPlaying: true,
    currentTrack: {
      provider: "youtube",
      videoId,
      startedAt: Date.now(),
    },
  });
}

export async function pauseYouTube(roomId: string) {
  await updateDoc(doc(db, "rooms", roomId), {
    isPlaying: false,
  });
}
