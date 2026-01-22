"use client";

import { useState } from "react";
import { useChat } from "@/hooks/useChat";
import { sendMessage } from "@/services/chatService";
import { useAuth } from "@/hooks/useAuth";

export default function ChatBox({ roomId }: { roomId: string }) {
  const { user } = useAuth(); 
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
    <div className="flex flex-col h-full min-h-[500px]">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
        Chat
      </h2>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 bg-zinc-800/30 rounded-xl p-4 border border-zinc-700/30 mb-4">
        {messages.length === 0 ? (
          <div className="text-center text-zinc-500 py-8">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="group">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">
                    {msg.senderName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-semibold text-white text-sm">
                      {msg.senderName}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {msg.createdAt && new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="bg-zinc-700/50 rounded-lg px-3 py-2 inline-block">
                    <p className="text-zinc-200 text-sm break-words">
                      {msg.text}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder={
            user ? "Type a message..." : "Sign in to chat"
          }
          disabled={!user}
          className="flex-1 px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-white placeholder-zinc-500 transition-all"
        />
        <button
          onClick={handleSend}
          disabled={!user || !text.trim()}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          Send
        </button>
      </div>
    </div>
  );
}
