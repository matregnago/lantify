import type { ClutchDTO } from "@repo/contracts";
import { count, db, eq, sql } from "@repo/database";
import * as s from "@repo/database/schema";
import { getStatPercentage } from "../../get-stat-percentage";
import { STATS_MIN_MAX_VALUES } from "../../stats-max-min-values";
import { getTotalRounds } from "../match";
import { getTotalLostAndWonRounds, getTotalTimeAliveTicks } from "../player";
import { buildStatsWhere, withMatchJoinIfDate } from "../query-helpers";
import { calculateScore } from "./scoreCalculator";

export const getClutchValue = async (
	steamId?: string,
	date: string = "all",
) => {
	const clutchParameters = await getClutchParameters(steamId, date);
	const clutchValue = clutchParameters.map((clutchStats) => {
		const clutchingScore = calculateScore(clutchStats, "clutch");
		return { ...clutchStats, clutchingScore };
	});
	return clutchValue;
};

type ClutchStatsDTO = {
	steamId: string;
	clutchPointsPerRound: number;
	lastAlivePercent: number;
	oneVOneWinPercent: number;
	timeAlivePerRoundSeconds: number;
	savesPerRoundLossPercent: number;
};

const getClutchParameters = async (
	steamId?: string,
	date: string = "all",
): Promise<ClutchStatsDTO[]> => {
	const clutchPointsMap = await getClutchPoints(steamId, date);
	const saveRounds = await getSaveRounds(steamId, date);
	const lastAliveRounds = await getLastAliveRounds(steamId, date);
	const oneOnOneWinPercent = await getOneOnOneWinPercentage(steamId, date);
	const totalTimeAliveTicks = await getTotalTimeAliveTicks(steamId, date);
	const totalRoundsMap = await getTotalRounds(steamId, date);
	const totalLostRoundsMap = await getTotalLostAndWonRounds(steamId, date);

	const clutchParameters = totalRoundsMap.map((clutcher) => {
		const clutchPoints = clutchPointsMap.get(clutcher.steamId);
		const saveRoundRow = saveRounds.find(
			(player) => player.steamId === clutcher.steamId,
		);
		const lastAliveRoundsRow = lastAliveRounds.find(
			(player) => player.steamId === clutcher.steamId,
		);
		const oneOnOneWinPercentRow = oneOnOneWinPercent.find(
			(player) => player.steamId === clutcher.steamId,
		);
		const totalTimeAliveTicksRow = totalTimeAliveTicks.find(
			(player) => player.steamId === clutcher.steamId,
		);
		const totalRounds = clutcher.totalRounds;
		const totalLostRoundsRow = totalLostRoundsMap.find(
			(player) => player.steamId === clutcher.steamId,
		);

		const playerClutchStats = {
			steamId: clutcher.steamId,
			clutchingScore: 0,
			clutchPointsPerRound: clutchPoints ? clutchPoints / totalRounds : 0,
			lastAlivePercent: lastAliveRoundsRow
				? lastAliveRoundsRow.totalLastAliveRounds / totalRounds
				: 0,
			oneVOneWinPercent: oneOnOneWinPercentRow
				? oneOnOneWinPercentRow.winPCT * 100
				: 0,
			timeAlivePerRoundSeconds: totalTimeAliveTicksRow
				? totalTimeAliveTicksRow.totalTimeAliveTicks / 64 / totalRounds
				: 0,
			savesPerRoundLossPercent:
				saveRoundRow && totalLostRoundsRow
					? (saveRoundRow.totalSaves / totalLostRoundsRow.lostRounds) * 100
					: 0,
		};

		return playerClutchStats;
	});

	return clutchParameters;
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

type SaveRoundsDTO = {
	steamId: string;
	totalSaves: number;
};

const getSaveRounds = async (
	steamId?: string,
	date: string = "all",
): Promise<SaveRoundsDTO[]> => {
	const extra = [
		eq(s.clutches.hasWon, false),
		eq(s.clutches.clutcherSurvived, true),
	];

	const where = buildStatsWhere({
		steamId,
		date,
		steamIdColumn: s.clutches.clutcherSteamId,
		dateColumn: date === "all" ? undefined : s.matches.date,
		extra,
	});

	const base = db
		.select({
			steamId: s.clutches.clutcherSteamId,
			totalSaves: count(),
		})
		.from(s.clutches);

	const q = withMatchJoinIfDate(base, date, s.clutches.matchId)
		.where(where)
		.groupBy(s.clutches.clutcherSteamId);

	return await q;
};

type LastAliveRoundsDTO = {
	steamId: string;
	totalLastAliveRounds: number;
};

const getLastAliveRounds = async (
	steamId?: string,
	date: string = "all",
): Promise<LastAliveRoundsDTO[]> => {
	const where = buildStatsWhere({
		steamId,
		date,
		steamIdColumn: s.clutches.clutcherSteamId,
		dateColumn: date === "all" ? undefined : s.matches.date,
	});

	const base = db
		.select({
			steamId: s.clutches.clutcherSteamId,
			totalLastAliveRounds: count(),
		})
		.from(s.clutches);

	const q = withMatchJoinIfDate(base, date, s.clutches.matchId)
		.where(where)
		.groupBy(s.clutches.clutcherSteamId);

	return await q;
};

type OneOnOneWinPercentageDTO = {
	steamId: string;
	totalOneOnOnes: number;
	wonOneOnOnes: number;
	winPCT: number;
};

const getOneOnOneWinPercentage = async (
	steamId?: string,
	date: string = "all",
): Promise<OneOnOneWinPercentageDTO[]> => {
	const where = buildStatsWhere({
		steamId,
		date,
		steamIdColumn: s.clutches.clutcherSteamId,
		dateColumn: date === "all" ? undefined : s.matches.date,
		extra: [eq(s.clutches.opponentCount, 1)],
	});

	const base = db
		.select({
			steamId: s.clutches.clutcherSteamId,
			totalOneOnOnes: count(),
			wonOneOnOnes: sql<number>`sum(case when ${s.clutches.hasWon} then 1 else 0 end)`,
			winPCT: sql<number>`
        case 
          when ${count()} = 0 then 0
          else (sum(case when ${s.clutches.hasWon} then 1 else 0 end)::float / ${count()}::float)
        end
      `,
		})
		.from(s.clutches);

	const q = withMatchJoinIfDate(base, date, s.clutches.matchId)
		.where(where)
		.groupBy(s.clutches.clutcherSteamId);

	return await q;
};
