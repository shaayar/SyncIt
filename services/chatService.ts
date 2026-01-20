import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export async function sendMessage(
  roomId: string,
  data: {
    text: string;
    senderId: string;
    senderName: string;
  }
) {
  const messagesRef = collection(
    db,
    "rooms",
    roomId,
    "messages"
  );

  await addDoc(messagesRef, {
    ...data,
    createdAt: serverTimestamp(),
  });
}
