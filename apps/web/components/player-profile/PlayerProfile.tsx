"use client";
import type { PlayerProfileDTO, PlayerRankingDTO } from "@repo/contracts";
import { ClutchesStats } from "./ClutchesStats";
import { CompleteStats } from "./CompleteStats";
import { MatchHistoryStats } from "./MatchHistoryStats";
import { OverallStatsCard } from "./OverallStatsCard";
import { PlayerHeader } from "./PlayerHeader";

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
				<ClutchesStats profile={profile} />
				<MatchHistoryStats profile={profile} />
			</div>
		</div>
	);
};
