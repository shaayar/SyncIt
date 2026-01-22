"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function RoomHeader({ roomId }: { roomId: string }) {
  const { user } = useAuth();
  const router = useRouter();


  return (
    <header className="flex items-center justify-between">
      <button
        onClick={() => router.push("/")}
        className="group flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-white transition-all duration-200 hover:bg-zinc-800/50 rounded-lg"
      >
        <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="font-medium">Back</span>
      </button>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-white">
            {user?.displayName || "Guest"}
          </p>
          <p className="text-xs text-zinc-500">
            Room {roomId.slice(-6)}
          </p>
        </div>
        {user?.photoURL ? (
          <div className="relative">
            <img
              src={user.photoURL}
              alt={user.displayName || "User"}
              className="w-10 h-10 rounded-full border-2 border-zinc-700 shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-zinc-900"></div>
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-zinc-600 to-zinc-700 flex items-center justify-center border-2 border-zinc-700">
            <svg className="w-5 h-5 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )}
      </div>
    </header>
  );
}
