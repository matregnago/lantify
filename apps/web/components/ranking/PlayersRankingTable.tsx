"use client";
import type { PlayerRankingDTO } from "@repo/contracts";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";
import { RankingPosition } from "./RankingPosition";

export const PlayersRankingTable = ({
	players,
}: {
	players: PlayerRankingDTO[];
}) => {
	const router = useRouter();

	return (
		<div>
			<Table className="">
				<TableHeader>
					<TableRow>
						<TableHead className="w-10 text-center">Rank</TableHead>
						<TableHead className="w-65">Player</TableHead>

						<TableHead className="w-22.5 text-center">Rating</TableHead>

						<TableHead className="w-17.5 text-center">KD</TableHead>

						<TableHead className="w-20 text-center">ADR</TableHead>

						<TableHead className="w-22.5 text-center">Partidas</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{players.map((player, idx) => (
						<TableRow
							key={player.steamId}
							className="cursor-pointer"
							onClick={() => router.push(`/profile/${player.steamId}`)}
						>
							<TableCell className="text-center tabular-nums">
								<RankingPosition position={idx + 1} />
							</TableCell>
							<TableCell>
								<div className="flex flex-row gap-5 items-center w-fit py-2">
									<Image
										src={player.avatarUrl || "/default-avatar.png"}
										width={40}
										height={40}
										alt={`${player.nickName} avatar`}
										className="rounded-full border border-gray-800 shrink-0"
									/>
									<p className="font-semibold">{player.nickName}</p>
								</div>
							</TableCell>
							<TableCell className="text-center tabular-nums">
								{player.stats.rating2.toFixed(2)}
							</TableCell>
							<TableCell className="text-center tabular-nums">
								{player.stats.killDeathRatio.toFixed(2)}
							</TableCell>
							<TableCell className="text-center tabular-nums">
								{player.stats.averageDamagePerRound.toFixed(1)}
							</TableCell>
							<TableCell className="text-center tabular-nums">
								{player.stats.totalMatches}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};
