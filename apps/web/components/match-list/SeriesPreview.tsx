"use client";

import type { PlayerDTO } from "@repo/contracts";
import { SeriesMatchup } from "./SeriesMatchup";

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
	return (
		<div className="mx-4 md:mx-4">
			<div className="hidden md:grid grid-cols-[auto_1fr] items-center mx-12 gap-4">
				<div className="flex items-center gap-3">
					<span className="text-3xl font-bold">Lan de </span>
					<span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-2xl font-semibold">
						{month}
					</span>
				</div>
				<div className="flex justify-center">
					<SeriesMatchup
						teamA={seriesTeam.teamA}
						teamB={seriesTeam.teamB}
						date={month}
						avatarSize={32}
					/>
				</div>
			</div>
			<div className="md:hidden flex flex-col gap-3 mx-4">
				<div className="flex items-center gap-2">
					<span className="text-xl font-bold">Lan de</span>
					<span className="px-1 py-0.5 rounded-full bg-accent text-accent-foreground text-xl font-semibold">
						{month}
					</span>
				</div>

				<SeriesMatchup
					teamA={seriesTeam.teamA}
					teamB={seriesTeam.teamB}
					date={month}
					avatarSize={32}
				/>
			</div>
		</div>
	);
}
