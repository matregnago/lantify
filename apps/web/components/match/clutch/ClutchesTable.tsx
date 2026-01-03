"use client";

import type { ClutchDTO, TeamDTO } from "@repo/contracts";
import { TeamClutchCard } from "./TeamClutchCard";
import { TeamClutchHeader } from "./TeamClutchHeader";

interface ClutchTableProps {
	clutches: ClutchDTO[];
	teamA: TeamDTO;
	teamB: TeamDTO;
}

export const ClutchesTable = ({ clutches, teamA, teamB }: ClutchTableProps) => {
	if (!teamA.players || !teamB.players) {
		return;
	}

	const teamClutchMap = new Map<string, ClutchDTO[]>();
	teamClutchMap.set(teamA.name, []);
	teamClutchMap.set(teamB.name, []);

	const teamAPlayerIds = new Set(teamA.players.map((player) => player.steamId));

	const teamBPlayerIds = new Set(teamB.players.map((player) => player.steamId));

	clutches.forEach((clutch) => {
		if (teamAPlayerIds.has(clutch.clutcherSteamId)) {
			(teamClutchMap.get(teamA.name) as ClutchDTO[]).push(clutch);
		} else if (teamBPlayerIds.has(clutch.clutcherSteamId)) {
			(teamClutchMap.get(teamB.name) as ClutchDTO[]).push(clutch);
		}
	});

	return (
		<div>
			<div className="pt-4">
				<TeamClutchHeader
					clutches={teamClutchMap.get(teamA.name) ?? []}
					team={teamA}
				/>
			</div>
			<div className="pt-2">
				<TeamClutchCard
					clutches={teamClutchMap.get(teamA.name) ?? []}
					team={teamA}
				/>
			</div>

			<div className="pt-8">
				<TeamClutchHeader
					clutches={teamClutchMap.get(teamB.name) ?? []}
					team={teamB}
				/>
			</div>
			<div className="pt-2">
				<TeamClutchCard
					clutches={teamClutchMap.get(teamB.name) ?? []}
					team={teamB}
				/>
			</div>
		</div>
	);
};
