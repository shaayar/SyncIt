"use client";

import { approveRequest, rejectRequest } from "@/services/queueService";
import { useQueue } from "@/hooks/useQueue";

export default function QueuePanel({
  roomId,
  isHost,
}: {
  roomId: string;
  isHost: boolean;
}) {
  const queue = useQueue(roomId);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-2">
        Song Queue
      </h2>

      {queue.length === 0 && (
        <p className="text-zinc-400">
          No requests yet
        </p>
      )}

      <ul className="space-y-2">
        {queue.map((item) => (
          <li
            key={item.id}
            className="p-3 bg-zinc-900 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-medium">
                {item.title}
              </p>
              <p className="text-sm text-zinc-400">
                Requested by {item.requestedByName}
              </p>
            </div>

            {isHost && item.status === "pending" && (
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    approveRequest(roomId, item.id)
                  }
                  className="text-green-400"
                >
                  Approve
                </button>
                <button
                  onClick={() =>
                    rejectRequest(roomId, item.id)
                  }
                  className="text-red-400"
                >
                  Reject
                </button>
              </div>
            )}

            {!isHost && (
              <span className="text-sm text-zinc-400">
                {item.status}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
