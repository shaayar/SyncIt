import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { RoomMode } from "@/types/mode";

export async function updateRoomMode(roomId: string, mode: RoomMode) {
  const roomRef = doc(db, "rooms", roomId);
  await updateDoc(roomRef, { mode });
}
