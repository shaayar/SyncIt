"use client";

import { useState } from "react";
import { useChat } from "@/hooks/useChat";
import { sendMessage } from "@/services/chatService";
import { useAuth } from "@/hooks/useAuth";

export default function ChatBox({ roomId }: { roomId: string }) {
  const { user } = useAuth(); // ✅ FIX
  const messages = useChat(roomId);
  const [text, setText] = useState("");

  async function handleSend() {
    if (!text.trim() || !user) return;

    await sendMessage(roomId, {
      text: text.trim(),
      senderId: user.uid,
      senderName: user.displayName || "User",
    });

    setText("");
  }

  return (
    <div className="mt-10 flex flex-col h-80 mb-6">
      <h2 className="text-xl font-semibold mb-2">Chat</h2>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-2 bg-zinc-900 p-3 rounded">
        {messages.map((msg) => (
          <div key={msg.id}>
            <span className="font-semibold">{msg.senderName}</span>:{" "}
            <span className="text-zinc-300">{msg.text}</span>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2 mt-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            user ? "Type a message..." : "Sign in to chat"
          }
          disabled={!user}
          className="flex-1 px-3 py-2 rounded bg-zinc-900 border border-zinc-700 disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={!user}
          className="px-4 py-2 bg-blue-600 rounded disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
