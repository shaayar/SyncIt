import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { QueueItem } from "@/hooks/useQueue";

export async function getNextApprovedItem(roomId: string): Promise<QueueItem | null> {
  const q = query(
    collection(db, "rooms", roomId, "queue"),
    where("status", "==", "approved"),
    orderBy("requestedAt", "asc"),
    limit(1)
  );

  const snap = await getDocs(q);
  if (snap.empty) return null;

  return { id: snap.docs[0].id, ...(snap.docs[0].data() as Omit<QueueItem, 'id'>) };
}

export async function markAsPlayed(
  roomId: string,
  requestId: string
) {
  await updateDoc(
    doc(db, "rooms", roomId, "queue", requestId),
    { status: "played" }
  );
}

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
