"use client";

import type { PlayerDTO } from "@repo/contracts";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { diffColor } from "@/lib/diff-color";
import { Card } from "../ui/card";

type SeriesMatchupProps = {
	teamA: { players: PlayerDTO[]; score: number };
	teamB: { players: PlayerDTO[]; score: number };
	date: string;
	avatarSize?: 28 | 32 | number;
	className?: string;
};

export function SeriesMatchup({
	teamA,
	teamB,
	date,
	avatarSize = 32,
	className,
}: SeriesMatchupProps) {
	const scoreDiffA = teamA.score - teamB.score;
	const scoreDiffB = -scoreDiffA;

	const router = useRouter();

	return (
		<Card
			className="
		cursor-pointer bg-transparent border-none shadow-none hover:bg-gray-800/60 transition hidden md:block rounded-3xl py-1.5 
	"
			onClick={() => router.push(`/series/${encodeURIComponent(date)}`)}
		>
			<div className={className}>
				<div className="rounded-lg p-2">
					<div className="grid grid-cols-[1fr_auto_1fr] items-center">
						<div className="flex justify-end gap-1 overflow-hidden">
							{teamA.players.map((player) => (
								<Image
									key={player.steamId}
									src={player.avatarUrl || "/default-avatar.png"}
									width={avatarSize}
									height={avatarSize}
									alt={player.name}
									className="shrink-0 rounded-full border border-gray-700"
								/>
							))}
						</div>

						<div className="flex items-center gap-2 px-2">
							<div className={`text-xl font-bold ${diffColor(scoreDiffA)}`}>
								{teamA.score}
							</div>
							<div className="text-xs font-bold text-gray-400">VS</div>
							<div className={`text-xl font-bold ${diffColor(scoreDiffB)}`}>
								{teamB.score}
							</div>
						</div>

						<div className="flex justify-start gap-1 overflow-hidden">
							{teamB.players.map((player) => (
								<Image
									key={player.steamId}
									src={player.avatarUrl || "/default-avatar.png"}
									width={avatarSize}
									height={avatarSize}
									alt={player.name}
									className="shrink-0 rounded-full border border-gray-700"
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</Card>
	);
}
