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
    title: string;
    artist?: string;
    requestedBy: string;
    requestedByName: string;
  }
) {
  const queueRef = collection(db, "rooms", roomId, "queue");

  await addDoc(queueRef, {
    ...data,
    status: "pending",
    createdAt: serverTimestamp(),
  });
}

export async function approveRequest(
  roomId: string,
  requestId: string
) {
  const ref = doc(db, "rooms", roomId, "queue", requestId);
  await updateDoc(ref, { status: "approved" });
}

export async function rejectRequest(
  roomId: string,
  requestId: string
) {
  const ref = doc(db, "rooms", roomId, "queue", requestId);
  await updateDoc(ref, { status: "rejected" });
}
