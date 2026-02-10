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
			<div className="hidden md:grid grid-cols-[10rem_1fr_10rem] items-center mx-12">
				<div className="w-40">
					<p className="capitalize text-2xl border-b pb-2 mb-2">{month}</p>
				</div>
				<div className="flex justify-center">
					<SeriesMatchup
						teamA={seriesTeam.teamA}
						teamB={seriesTeam.teamB}
						date={month}
						avatarSize={32}
					/>
				</div>

				<div className="w-40" />
			</div>
			<div className="md:hidden flex flex-col gap-3 mx-4">
				<p className="capitalize text-2xl border-b pb-2">{month}</p>

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
