"use client";

import type { ClutchDTO, TeamDTO } from "@repo/contracts";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { ClutchKillsChart } from "./ClutchKillsChart";
import { ClutchProgress } from "./ClutchProgress";

interface TeamClutchHeaderProps {
	team: TeamDTO;
	clutches: ClutchDTO[];
}

export const TeamClutchHeader = ({ team, clutches }: TeamClutchHeaderProps) => {
	return (
		<div>
			<Card className="overflow-hidden p-0 pb-5">
				<CardHeader className="bg-muted/30 py-4 px-0">
					<CardTitle className="px-6">{team.name}</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-row ">
						<div className="flex-3">
							<ClutchProgress clutches={clutches} />
						</div>
						<div className="flex-1 h-27.5 border-l border-muted-foreground/30">
							<ClutchKillsChart clutches={clutches} />
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
