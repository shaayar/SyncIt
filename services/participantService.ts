import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

interface JoinRoomInput {
  roomId: string;
  userId: string;
  name: string;
}

export async function joinRoom({
  roomId,
  userId,
  name,
}: JoinRoomInput) {
  const roomRef = doc(db, "rooms", roomId);
  const roomSnap = await getDoc(roomRef);

  if (!roomSnap.exists()) {
    throw new Error("Room does not exist");
  }

  const participantRef = doc(
    db,
    "rooms",
    roomId,
    "participants",
    userId
  );

  await setDoc(participantRef, {
    userId,
    name,
    role: "user",
    joinedAt: serverTimestamp(),
    isOnline: true,
  });

  return true;
}
