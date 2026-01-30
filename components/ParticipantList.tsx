"use client";

export default function ParticipantList({ 
  participants, 
  isHost 
}: { 
  participants: any[]; 
  isHost: boolean; 
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        Participants ({participants.length})
      </h3>
      
      {participants.length === 0 ? (
        <div className="text-center py-6">
          <svg className="w-12 h-12 mx-auto mb-3 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <p className="text-zinc-400 text-sm">No participants yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {participants.map((participant) => (
            <div
              key={participant.userId}
              className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50"
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-bold">
                  {participant.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
              
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-white font-medium truncate">
                    {participant.name || "Anonymous User"}
                  </p>
                  {participant.role === "host" && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      HOST
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-500">
                  {participant.isOnline ? (
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                      Online
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full"></span>
                      Offline
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
