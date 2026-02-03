"use server";
import { alias, and, count, db, eq, gt, lte, ne, sql } from "@repo/database";
import * as s from "@repo/database/schema";
import { getStatPercentage } from "@/lib/get-stat-percentage";
import { STATS_MIN_MAX_VALUES } from "@/lib/stats-max-min-values";
import { getTotalRounds } from "../match";
import { buildStatsWhere, withMatchJoinIfDate } from "../query-helpers";
import { getOpeningAmount } from "./PlayerWeaponStats";

export const getOpeningValue = async (
	steamId?: string,
	date: string = "all",
) => {
	const openingParameters = await getOpeningParameters(steamId, date);

	return openingParameters;
};

const getOpeningParameters = async (steamId?: string, date: string = "all") => {
	const openingStats = await getOpeningAmount(undefined, steamId, date);
	const openingRoundsWonPerPlayer = await getOpeningRoundsWon(steamId, date);
	const totalRoundsPerPlayer = await getTotalRounds(steamId, date);
	const attackStats = await getTotalAttacks(steamId, date);

	const openingParameters = totalRoundsPerPlayer.map((opening) => {
		const openingStatsRow = openingStats.find(
			(player) => player.steamId === opening.steamId,
		);
		const openingRoundsWonRow = openingRoundsWonPerPlayer.find(
			(player) => player.steamId === opening.steamId,
		);
		const attackRow = attackStats.find(
			(player) => player.steamId === opening.steamId,
		);
		const openingKills = openingStatsRow ? openingStatsRow.openingKills : 0;
		const openingDeaths = openingStatsRow ? openingStatsRow.openingDeaths : 0;
		const openingTotal = openingKills + openingDeaths;
		const totalRounds = opening.totalRounds ? opening.totalRounds : 0;
		const totalAttacks = attackRow ? attackRow.totalAttacks : 0;
		const playerOpeningStats = {
			steamId: opening.steamId,
			openingKillsPerRound: openingKills / totalRounds,
			openingDeathsPerRound: openingDeaths / totalRounds,
			openingAttemptsPercent: (openingTotal / totalRounds) * 100,
			openingSuccessPercent: (openingKills / openingTotal) * 100,
			winPercentAfterOpeningKill: openingRoundsWonRow
				? (openingRoundsWonRow.openingsWon / openingKills) * 100
				: 0,
			attacksPerRound: totalAttacks / totalRounds,
		};
		const openingScore =
			(getStatPercentage(
				playerOpeningStats.openingKillsPerRound,
				STATS_MIN_MAX_VALUES.openingKillsPerRound.min,
				STATS_MIN_MAX_VALUES.openingKillsPerRound.max,
			) +
				getStatPercentage(
					playerOpeningStats.openingDeathsPerRound,
					STATS_MIN_MAX_VALUES.openingDeathsPerRound.min,
					STATS_MIN_MAX_VALUES.openingDeathsPerRound.max,
					true,
				) +
				getStatPercentage(
					playerOpeningStats.openingAttemptsPercent,
					STATS_MIN_MAX_VALUES.openingAttemptsPercent.min,
					STATS_MIN_MAX_VALUES.openingAttemptsPercent.max,
				) +
				getStatPercentage(
					playerOpeningStats.openingSuccessPercent,
					STATS_MIN_MAX_VALUES.openingSuccessPercent.min,
					STATS_MIN_MAX_VALUES.openingSuccessPercent.max,
				) +
				getStatPercentage(
					playerOpeningStats.winPercentAfterOpeningKill,
					STATS_MIN_MAX_VALUES.winPercentAfterOpeningKill.min,
					STATS_MIN_MAX_VALUES.winPercentAfterOpeningKill.max,
				) +
				getStatPercentage(
					playerOpeningStats.attacksPerRound,
					STATS_MIN_MAX_VALUES.attacksPerRound.min,
					STATS_MIN_MAX_VALUES.attacksPerRound.max,
				)) /
			6;

		return {
			...playerOpeningStats,
			openingScore,
		};
	});
	return openingParameters;
};

type OpeningRoundsWonDTO = {
	steamId: string;
	openingsWon: number;
};

const getOpeningRoundsWon = async (
	steamId?: string,
	date: string = "all",
): Promise<OpeningRoundsWonDTO[]> => {
	const whereRound = buildStatsWhere({
		date,
		steamIdColumn: s.kills.killerSteamId,
		dateColumn: date === "all" ? undefined : s.matches.date,
	});

	const roundJoin = and(
		eq(s.kills.roundNumber, s.rounds.number),
		eq(s.kills.matchId, s.rounds.matchId),
	);

	const roundMinTickBase = db
		.select({
			matchId: s.kills.matchId,
			roundNumber: s.kills.roundNumber,
			minTick: sql<number>`MIN(${s.kills.tick})`.mapWith(Number).as("minTick"),
		})
		.from(s.kills);

	const roundMinTick = withMatchJoinIfDate(
		roundMinTickBase,
		date,
		s.kills.matchId,
	)
		.where(whereRound)
		.groupBy(s.kills.matchId, s.kills.roundNumber)
		.as("round_min_tick");

	const openingConditions = and(
		eq(s.kills.matchId, roundMinTick.matchId),
		eq(s.kills.roundNumber, roundMinTick.roundNumber),
		eq(s.kills.tick, roundMinTick.minTick),
		ne(s.kills.killerTeamName, s.kills.victimTeamName),
	);

	const roundOpening = db
		.select({
			steamId: s.kills.killerSteamId,
			matchId: s.kills.matchId,
			roundNumber: s.kills.roundNumber,
			killerTeam: s.kills.killerTeamName,
		})
		.from(s.kills)
		.innerJoin(roundMinTick, openingConditions)
		.as("opening_kill");

	const roundWonConditions = and(
		eq(roundOpening.roundNumber, s.rounds.number),
		eq(roundOpening.matchId, s.rounds.matchId),
		eq(roundOpening.killerTeam, s.rounds.winnerName),
	);

	const roundWon = db
		.select({
			steamId: roundOpening.steamId,
			openingsWon: sql<number>`COUNT(*)`.mapWith(Number).as("openingsWon"),
		})
		.from(roundOpening)
		.innerJoin(s.rounds, roundWonConditions)
		.groupBy(roundOpening.steamId);

	return await roundWon;
};

type TotalAttacksDTO = {
	steamId: string;
	totalAttacks: number;
};

const getTotalAttacks = async (
	steamId?: string,
	date: string = "all",
): Promise<TotalAttacksDTO[]> => {
	const extra = [
		and(
			ne(s.damages.attackerTeamName, s.damages.victimTeamName),
			gt(s.damages.healthDamage, 0),
		),
	];
	const where = buildStatsWhere({
		steamId,
		date,
		steamIdColumn: s.damages.attackerSteamId,
		dateColumn: s.matches.date,
		extra,
	});

	const attacksBase = db
		.select({
			steamId: s.damages.attackerSteamId,
			totalAttacks: count().mapWith(Number).as("attacks"),
		})
		.from(s.damages);

	const attacksQ = withMatchJoinIfDate(attacksBase, date, s.damages.matchId)
		.where(where)
		.groupBy(s.damages.attackerSteamId);

	return (await attacksQ) as TotalAttacksDTO[];
};
