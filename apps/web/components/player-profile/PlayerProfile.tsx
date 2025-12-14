"use client";
import { PlayerProfileDTO } from "@repo/contracts";
import { PlayerHeader } from "./PlayerHeader";
import { OverallStatsCard } from "./OverallStatsCard";
import { CompleteStats } from "./CompleteStats";
import { MatchHistoryStats } from "./MatchHistoryStats";

export const PlayerProfile = ({ profile }: { profile: PlayerProfileDTO }) => {
  return (
    <div className="max-w-[1480px] mx-auto">
      <PlayerHeader avatarUrl={profile.avatarUrl} nickName={profile.nickName} />
      <div className="flex flex-col gap-8">
        <OverallStatsCard profile={profile} />
        <CompleteStats profile={profile} />
        {/* <ClutchesStats profile={profile} /> */}
        <MatchHistoryStats profile={profile} />
      </div>
    </div>
  );
};
