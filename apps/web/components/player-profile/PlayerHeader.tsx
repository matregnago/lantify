import type { PlayerRankingDTO } from "@repo/contracts";
import Image from "next/image";
import Link from "next/link";
import { getRankingPosByStat } from "@/lib/ranking";
import { RankingPosition } from "../ranking/RankingPosition";

interface PlayerHeaderProps {
	avatarUrl?: string | null;
	nickName?: string | null;
	steamId: string;
	playersRanking: PlayerRankingDTO[];
	playerAmount: number;
	date?: string;
	totalMatches?: number;
}

export const PlayerHeader = ({
	avatarUrl,
	nickName,
	steamId,
	playersRanking,
	playerAmount,
	date,
	totalMatches,
}: PlayerHeaderProps) => {
	const ratingRankPosition = getRankingPosByStat(
		steamId,
		playersRanking,
		"rating2",
	);
	const isSeriesProfile = date && date !== "all";
	return (
		<div
			className="w-full border-b shadow-lg rounded-lg mb-8 py-8 px-8 flex flex-row items-center md:justify-start justify-center relative overflow-hidden"
			style={{
				backgroundImage:
					"linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%), linear-gradient(270deg, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.15) 28%, rgba(0, 0, 0, 0.7) 100%), url(/profile-header-background.jpg)",
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		>
			<div className="flex flex-col items-center gap-4 border w-52 h-72 justify-center rounded-xl bg-card relative z-3 shrink-0">
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
			{isSeriesProfile && (
				<>
					<div className="flex-1" />
					<Link
						href={`/series/${encodeURIComponent(date)}`}
						className="z-10 flex flex-col items-end gap-2 hover:opacity-80 transition-opacity shrink-0"
					>
						<span className="text-2xl text-muted-foreground flex items-center gap-1">
							Ver ranking →
						</span>
						<div className="flex items-center gap-3">
							<span className="text-4xl font-bold">Lan</span>
							<span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-3xl font-semibold">
								{date}
							</span>
						</div>
						{totalMatches !== undefined && (
							<span className="text-lg text-muted-foreground">
								{totalMatches} {totalMatches === 1 ? "partida" : "partidas"}
							</span>
						)}
					</Link>
				</>
			)}
		</div>
	);
};
