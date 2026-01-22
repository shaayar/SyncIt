import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

export async function requestSong(
  roomId: string,
  data: {
    provider: "local" | "youtube";
    title: string;
    videoId?: string;
    requestedBy: string;
    requestedByName: string;
  }
) {
  await addDoc(collection(db, "rooms", roomId, "queue"), {
    ...data,
    status: "pending",
    requestedAt: serverTimestamp(),
  });
}

export async function approveRequest(
  roomId: string,
  requestId: string
) {
  await updateDoc(
    doc(db, "rooms", roomId, "queue", requestId),
    {
      status: "approved",
    }
  );
}

export async function rejectRequest(
  roomId: string,
  requestId: string
) {
  const ref = doc(db, "rooms", roomId, "queue", requestId);
  await updateDoc(ref, { status: "rejected" });
}
