"use client";
import FacePile from "@convex-dev/presence/facepile";
import usePresence from "@convex-dev/presence/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

interface PresenceProps {
  roomId: Id<"posts">;
  usersId: string;
}

export default function PresenceList({ roomId, usersId }: PresenceProps) {
  const presenceState = usePresence(api.presence, roomId, usersId);

  if (!presenceState?.length) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <p className="text-muted-foreground text-xs uppercase tracking-wide">
        Viewing now
      </p>
      <FacePile presenceState={presenceState} />
    </div>
  );
}
