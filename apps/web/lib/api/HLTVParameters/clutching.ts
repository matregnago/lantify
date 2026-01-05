import type { ClutchDTO } from "@repo/contracts";
import { db, eq, sum } from "@repo/database";
import * as s from "@repo/database/schema";
import build from "next/dist/build";
import { getTotalRounds } from "../match";
import { buildStatsWhere, withMatchJoinIfDate } from "../query-helpers";

export const getClutchValue = async (
	steamId?: string,
	date: string = "all",
) => {
	const clutchParameters = await getClutchParameters(steamId, date);
	return clutchParameters;
};

const getClutchParameters = async (steamId?: string, date: string = "all") => {
	const clutchPoints = await getClutchPoints(steamId, date);

	return clutchPoints;
};

const getClutchPoints = async (steamId?: string, date: string = "all") => {
	const extraConditions = [eq(s.clutches.hasWon, true)];

	const where = buildStatsWhere({
		steamId,
		date,
		steamIdColumn: s.clutches.clutcherSteamId,
		dateColumn: date === "all" ? undefined : s.matches.date,
		extra: extraConditions,
	});

	const base = db.select().from(s.clutches);

	const wonClutches = (await withMatchJoinIfDate(
		base,
		date,
		s.clutches.matchId,
	).where(where)) as ClutchDTO[];

	const clutchPointMap = new Map<string, number>();

	wonClutches.forEach((clutch) => {
		const steamId = clutch.clutcherSteamId;
		const clutchPoints = pointsPerClutch(clutch.opponentCount);
		const playerPoints = clutchPointMap.get(steamId);
		if (!playerPoints) clutchPointMap.set(steamId, clutchPoints);
		else {
			clutchPointMap.set(steamId, playerPoints + clutchPoints);
		}
	});
	return clutchPointMap;
};

const pointsPerClutch = (opponentCount: number): number => {
	switch (opponentCount) {
		case 1:
			return 1;
		case 2:
			return 2;
		case 3:
			return 4;
		case 4:
			return 8;
		case 5:
			return 16;
		default:
			throw new Error(`Invalid opponentCount: ${opponentCount}`);
	}
};
