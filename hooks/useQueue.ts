"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

export interface QueueItem {
  id: string;
  title: string;
  artist?: string;
  requestedByName: string;
  status: "pending" | "approved" | "rejected";
}

export function useQueue(roomId: string) {
  const [queue, setQueue] = useState<QueueItem[]>([]);

  useEffect(() => {
    if (!roomId) return;

    const q = query(
      collection(db, "rooms", roomId, "queue"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const items: QueueItem[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as any),
      }));
      setQueue(items);
    });

    return () => unsub();
  }, [roomId]);

  return queue;
}
