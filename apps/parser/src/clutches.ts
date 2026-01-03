import type { DemoFile, NewClutch } from "./types.js";

export const createClutches = (data: DemoFile, matchId: string) => {
	const clutches: NewClutch[] = [];
	for (const clutch of data.clutches) {
		clutches.push({
			matchId,
			clutcherKillCount: clutch.clutcherKillCount,
			clutcherSteamId: clutch.clutcherSteamId,
			hasWon: clutch.hasWon,
			opponentCount: clutch.opponentCount,
			roundNumber: clutch.roundNumber,
			clutcherSurvived: clutch.clutcherSurvived,
		});
	}
	return clutches;
};
