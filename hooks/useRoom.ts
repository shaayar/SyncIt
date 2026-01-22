"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  doc,
  onSnapshot,
  collection,
  query,
} from "firebase/firestore";
import { useAuth } from "./useAuth";

/* ---------------- TYPES ---------------- */

interface CurrentTrack {
  id?: string;
  title?: string;
  provider: "youtube" | "local" | null;
  videoId?: string;
  audioUrl?: string;
  startedAt?: number;
  pausedAt?: number;
  pausedTime?: number;
  lastSyncedAt?: any;
}

interface Room {
  roomId: string;
  hostId: string;
  hostName: string;
  isPlaying: boolean;
  isActive: boolean;
  mode: string;
  currentTrack: CurrentTrack | null;
  settings: {
    allowRequests: boolean;
    allowChat: boolean;
  };
}

interface Participant {
  userId: string;
  name: string;
  role: "host" | "user";
  isOnline: boolean;
}

/* ---------------- HOOK ---------------- */

export function useRoom(roomId: string) {
  const [room, setRoom] = useState<Room | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // TEMP: fake user (later replaced by Firebase Auth)
  const { user } = useAuth();
  const isHost = room?.hostId === user?.uid;


  useEffect(() => {
    if (!roomId) return;

    // ---- ROOM LISTENER ----
    const roomRef = doc(db, "rooms", roomId);

    const unsubscribeRoom = onSnapshot(
      roomRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setError("Room not found");
          setLoading(false);
          return;
        }

        setRoom(snapshot.data() as Room);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError("Failed to load room");
        setLoading(false);
      }
    );

    // ---- PARTICIPANTS LISTENER ----
    const participantsRef = collection(
      db,
      "rooms",
      roomId,
      "participants"
    );

    const q = query(participantsRef);

    const unsubscribeParticipants = onSnapshot(q, (snapshot) => {
      const list: Participant[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as Participant);
      });
      setParticipants(list);
    });

    // ---- CLEANUP ----
    return () => {
      unsubscribeRoom();
      unsubscribeParticipants();
    };
  }, [roomId]);

  return {
    room,
    participants,
    isHost,
    loading,
    error,
  };
}
