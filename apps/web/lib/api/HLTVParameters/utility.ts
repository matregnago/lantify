import { WeaponType } from "@repo/contracts/enums";
import { db, sum } from "@repo/database";
import * as s from "@repo/database/schema";
import { getStatPercentage } from "../../get-stat-percentage";
import { STATS_MIN_MAX_VALUES } from "../../stats-max-min-values";
import { getTotalRounds } from "../match";
import { buildStatsWhere, withMatchJoinIfDate } from "../query-helpers";
import { getWeaponTypeStats } from "./PlayerWeaponStats";
import { calculateScore } from "./scoreCalculator";

export const getUtilityValue = async (
	steamId?: string,
	date: string = "all",
) => {
	const utilityParameters = await getUtilityParameters(steamId, date);
	const utilityValue = utilityParameters.map((utilityStats) => {
		const utilityScore = calculateScore(utilityStats, "utility");
		return { ...utilityStats, utilityScore };
	});
	return utilityValue;
};

type UtilityParametersDTO = {
	steamId: string;
	utilityDamagePerRound: number;
	utilityKillsPer100Rounds: number;
	flashesThrownPerRound: number;
	flashAssistsPerRound: number;
	timeOpponentsFlashedPerRoundSeconds: number;
};

const getUtilityParameters = async (
	steamId?: string,
	date: string = "all",
): Promise<UtilityParametersDTO[]> => {
	const utilityStats = await getUtilityStats(steamId, date);
	const utilityKills = await getWeaponTypeStats(
		WeaponType.Grenade,
		steamId,
		date,
	);

	const totalRoundsPerPlayer = await getTotalRounds(steamId, date);

	const utilityParameters = utilityStats.map((grenader) => {
		const totalRoundsRow = totalRoundsPerPlayer.find(
			(player) => player.steamId === grenader.steamId,
		);
		const utilityKillsRow = utilityKills.find(
			(player) => player.steamId === grenader.steamId,
		);

		if (!totalRoundsRow) return null;
		const totalRounds = totalRoundsRow.totalRounds;
		const totalUtilityKills = utilityKillsRow ? utilityKillsRow.totalKills : 0;

		const playerUtilityParameters = {
			steamId: grenader.steamId,
			utilityScore: 0,
			utilityDamagePerRound: grenader.utilityDamage / totalRounds,
			utilityKillsPer100Rounds: (totalUtilityKills / totalRounds) * 100,
			flashesThrownPerRound: grenader.flashesThrown / totalRounds,
			flashAssistsPerRound: grenader.flashAssists / totalRounds,
			timeOpponentsFlashedPerRoundSeconds:
				grenader.timeOpponentsFlashed / totalRounds,
		};
		return playerUtilityParameters;
	});

	return utilityParameters.filter((param) => param !== null);
};

type UtilityStatsDTO = {
	steamId: string;
	utilityDamage: number;
	flashesThrown: number;
	flashAssists: number;
	timeOpponentsFlashed: number;
};

const getUtilityStats = async (
	steamId?: string,
	date: string = "all",
): Promise<UtilityStatsDTO[]> => {
	const where = buildStatsWhere({
		steamId,
		date,
		steamIdColumn: s.players.steamId,
		dateColumn: date === "all" ? undefined : s.matches.date,
	});

	const base = db
		.select({
			steamId: s.players.steamId,
			utilityDamage: sum(s.players.utilityDamage).mapWith(Number),
			flashesThrown: sum(s.players.totalFlashes).mapWith(Number),
			flashAssists: sum(s.players.flashAssists).mapWith(Number),
			timeOpponentsFlashed: sum(s.players.enemiesBlindTime).mapWith(Number),
		})
		.from(s.players);

	const q = withMatchJoinIfDate(base, date, s.players.matchId)
		.where(where)
		.groupBy(s.players.steamId);

	return await q;
};
