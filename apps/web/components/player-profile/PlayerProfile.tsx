"use client";
import { PlayerProfileDTO, PlayerRankingDTO } from "@repo/contracts";
import { PlayerHeader } from "./PlayerHeader";
import { OverallStatsCard } from "./OverallStatsCard";
import { CompleteStats } from "./CompleteStats";
import { MatchHistoryStats } from "./MatchHistoryStats";

interface PlayerProfileProps {
  profile: PlayerProfileDTO;
  playersRanking: PlayerRankingDTO[];
}

export const PlayerProfile = ({
  profile,
  playersRanking,
}: PlayerProfileProps) => {
  return (
    <div className="max-w-370 mx-auto">
      <PlayerHeader
        avatarUrl={profile.avatarUrl}
        nickName={profile.nickName}
        playersRanking={playersRanking}
        steamId={profile.steamId}
      />
      <div className="flex flex-col gap-8">
        <OverallStatsCard profile={profile} playersRanking={playersRanking} />
        <CompleteStats profile={profile} />
        {/* <ClutchesStats profile={profile} /> */}
        <MatchHistoryStats profile={profile} />
      </div>
    </div>
  );
};
