"use client";
import type { TeamDTO } from "@repo/contracts";
import Image from "next/image";
import Link from "next/link";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";

export const TeamTable = ({ team }: { team: TeamDTO }) => {
	if (!team.players) return;
	const players = team.players;
	return (
		<Table className="bg-card rounded-sm">
			<TableHeader>
				<TableRow>
					<TableHead className="w-64">Player</TableHead>
					<TableHead>K</TableHead>
					<TableHead>D</TableHead>
					<TableHead>A</TableHead>
					<TableHead>ADR</TableHead>
					<TableHead>K/D</TableHead>
					<TableHead>K/R</TableHead>
					<TableHead>HS %</TableHead>
					<TableHead>5k</TableHead>
					<TableHead>4k</TableHead>
					<TableHead>3k</TableHead>
					<TableHead>2k</TableHead>
					<TableHead>MVPs</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{players.map((player) => (
					<TableRow key={player.id}>
						<TableCell>
							<Link
								className="flex flex-row gap-3 items-center cursor-pointer w-fit"
								href={`/profile/${player.steamId}`}
							>
								<Image
									src={player.avatarUrl || "/default-avatar.png"}
									width={32}
									height={32}
									alt={`${player.name} avatar`}
									className="rounded-full border border-gray-800 shrink-0"
								/>
								<p className="font-semibold">{player.name}</p>
							</Link>
						</TableCell>
						<TableCell>{player.killCount}</TableCell>
						<TableCell>{player.deathCount}</TableCell>
						<TableCell>{player.assistCount}</TableCell>
						<TableCell>{player.averageDamagePerRound.toFixed(1)}</TableCell>
						<TableCell>{player.killDeathRatio.toFixed(2)}</TableCell>
						<TableCell>{player.averageKillPerRound.toFixed(2)}</TableCell>
						<TableCell>{player.headshotPercent}%</TableCell>
						<TableCell>{player.fiveKillCount}</TableCell>
						<TableCell>{player.fourKillCount}</TableCell>
						<TableCell>{player.threeKillCount}</TableCell>
						<TableCell>{player.twoKillCount}</TableCell>
						<TableCell>{player.mvpCount}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};
