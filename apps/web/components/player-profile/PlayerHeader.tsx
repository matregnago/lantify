import type { PlayerRankingDTO } from "@repo/contracts";
import Image from "next/image";
import { getRankingPosByStat } from "@/lib/ranking";
import { RankingPosition } from "../ranking/RankingPosition";

interface PlayerHeaderProps {
	avatarUrl?: string | null;
	nickName?: string | null;
	steamId: string;
	playersRanking: PlayerRankingDTO[];
	playerAmount: number;
}

export const PlayerHeader = ({
	avatarUrl,
	nickName,
	steamId,
	playersRanking,
	playerAmount,
}: PlayerHeaderProps) => {
	const ratingRankPosition = getRankingPosByStat(
		steamId,
		playersRanking,
		"rating2",
	);
	return (
		<div
			className="border-b shadow-lg rounded-lg mb-8 py-8 px-8 flex flex-row items-center md:justify-start justify-center relative overflow-hidden"
			style={{
				backgroundImage:
					"linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%), linear-gradient(270deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.25) 28%, rgba(0, 0, 0, 0.7) 100%), url(/profile-header-background.jpg)",
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		>
			<div className="flex flex-col items-center gap-4 border w-52 h-72 justify-center rounded-xl bg-card relative z-3">
				<Image
					className="rounded-full border-2 border-accent"
					src={avatarUrl || "/default-avatar.png"}
					width={140}
					height={140}
					alt={`${nickName} avatar pfp`}
				/>
				<p className="text-base font-semibold">{nickName}</p>
				<RankingPosition
					position={ratingRankPosition}
					playerAmount={playerAmount}
				/>
			</div>
		</div>
	);
};
