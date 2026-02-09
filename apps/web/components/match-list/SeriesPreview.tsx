"use client";

import type { PlayerDTO } from "@repo/contracts";
import Image from "next/image";
import { diffColor } from "@/lib/diff-color";

type TeamSeries = {
	players: PlayerDTO[];
	score: number;
};

export type SeriesTeamDTO = {
	teamA: TeamSeries;
	teamB: TeamSeries;
};

type SeriesPreviewProps = {
	month: string;
	seriesTeam: SeriesTeamDTO;
};

export function SeriesPreview({ month, seriesTeam }: SeriesPreviewProps) {
	const scoreDiffA = seriesTeam.teamA.score - seriesTeam.teamB.score;
	const scoreDiffB = -scoreDiffA;

	return (
		<div className="mx-4 md:mx-4">
			<div className="hidden md:grid grid-cols-[10rem_1fr_10rem] items-center mx-12">
				<div className="w-40">
					<p className="capitalize text-2xl border-b pb-2 mb-2">{month}</p>
				</div>
				<div className="flex justify-center">
					<div className="rounded-lg p-2">
						<div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
							<div className="flex justify-end gap-2 overflow-hidden">
								{seriesTeam.teamA.players.map((player) => (
									<Image
										key={player.steamId}
										src={player.avatarUrl || "/default-avatar.png"}
										width={32}
										height={32}
										alt={player.name}
										className="shrink-0 rounded-full border border-gray-700"
									/>
								))}
							</div>

							{/* center score */}
							<div className="flex items-center gap-2 px-2">
								<div className={`text-xl font-bold ${diffColor(scoreDiffA)}`}>
									{seriesTeam.teamA.score}
								</div>
								<div className="text-xs font-bold text-gray-400">VS</div>
								<div className={`text-xl font-bold ${diffColor(scoreDiffB)}`}>
									{seriesTeam.teamB.score}
								</div>
							</div>

							{/* right avatars */}
							<div className="flex justify-start gap-2 overflow-hidden">
								{seriesTeam.teamB.players.map((player) => (
									<Image
										key={player.steamId}
										src={player.avatarUrl || "/default-avatar.png"}
										width={32}
										height={32}
										alt={player.name}
										className="shrink-0 rounded-full border border-gray-700"
									/>
								))}
							</div>
						</div>
					</div>
				</div>

				<div className="w-40" />
			</div>
			<div className="md:hidden flex flex-col gap-3 mx-4">
				<p className="capitalize text-2xl border-b pb-2">{month}</p>

				<div className="rounded-lg p-2">
					<div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
						<div className="flex justify-end gap-2 overflow-hidden">
							{seriesTeam.teamA.players.map((player) => (
								<Image
									key={player.steamId}
									src={player.avatarUrl || "/default-avatar.png"}
									width={28}
									height={28}
									alt={player.name}
									className="shrink-0 rounded-full border border-gray-700"
								/>
							))}
						</div>

						<div className="flex items-center gap-2 px-2">
							<div className={`text-xl font-bold ${diffColor(scoreDiffA)}`}>
								{seriesTeam.teamA.score}
							</div>
							<div className="text-xs font-bold text-gray-400">VS</div>
							<div className={`text-xl font-bold ${diffColor(scoreDiffB)}`}>
								{seriesTeam.teamB.score}
							</div>
						</div>

						<div className="flex justify-start gap-2 overflow-hidden">
							{seriesTeam.teamB.players.map((player) => (
								<Image
									key={player.steamId}
									src={player.avatarUrl || "/default-avatar.png"}
									width={28}
									height={28}
									alt={player.name}
									className="shrink-0 rounded-full border border-gray-700"
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
