"use server";
import { and, count, db, eq, ne, sql } from "@repo/database";
import * as s from "@repo/database/schema";
import { getStatPercentage } from "@/lib/get-stat-percentage";
import { STATS_MIN_MAX_VALUES } from "@/lib/stats-max-min-values";
import { getTotalRounds } from "../match";
import { getRating2, getTotalDamage, getTotalKills } from "../player";
import { buildStatsWhere, withMatchJoinIfDate } from "../query-helpers";
import { getWeaponTypeStats } from "./PlayerWeaponStats";
import { getPistolRating2 } from "./pistolRating2";
import { calculateScore } from "./scoreCalculator";

export const getFirepowerValue = async (
	steamId?: string,
	date: string = "all",
) => {
	const firepowerParameters = await getFirePowerParameters(steamId, date);
	const firepowerValue = firepowerParameters.map((firepowerStats) => {
		const firePowerScore = calculateScore(firepowerStats, "firepower");
		return { ...firepowerStats, firePowerScore };
	});
	return firepowerValue;
};

type FirepowerStatsDTO = {
	steamId: string;
	killsPerRound: number;
	killsPerRoundWin: number;
	damagePerRound: number;
	damagePerRoundWin: number;
	roundsWithKillPercent: number;
	rating2: number;
	roundsWithMultiKillPercent: number;
	pistolRoundRating2: number;
};

const getFirePowerParameters = async (
	steamId?: string,
	date: string = "all",
): Promise<FirepowerStatsDTO[]> => {
	const totalDamagePerPlayer = await getTotalDamage(steamId, date);
	const wonRoundsStats = await getWonRoundStats(steamId, date);
	const killStats = await getWeaponTypeStats(undefined, steamId, date);
	const totalRoundsPerPlayer = await getTotalRounds(steamId, date);
	const rating2PerPlayer = await getRating2(steamId, date);
	const pistolRating2PerPlayer = await getPistolRating2(steamId, date);

	const firepowerParameters = totalRoundsPerPlayer.map((firepower) => {
		const totalDamageRow = totalDamagePerPlayer.find(
			(player) => player.steamId === firepower.steamId,
		);
		const wonRoundRow = wonRoundsStats.find(
			(player) => player.steamId === firepower.steamId,
		);
		const killRow = killStats.find(
			(player) => player.steamId === firepower.steamId,
		);
		const rating2Row = rating2PerPlayer.find(
			(player) => player.steamId === firepower.steamId,
		);
		const pistolRating2Row = pistolRating2PerPlayer.find(
			(player) => player.steamId === firepower.steamId,
		);
		const totalDamage = totalDamageRow ? totalDamageRow.totalDamage : 0;
		const killsInWonRounds = wonRoundRow ? wonRoundRow.killsInWonRounds : 0;
		const damageInWonRounds = wonRoundRow ? wonRoundRow.damageInWonRounds : 0;
		const totalRoundsWon = wonRoundRow ? wonRoundRow.totalRoundsWon : 0;
		const totalKills = killRow ? killRow.totalKills : 0;
		const totalRoundsWithKills = killRow ? killRow.totalRoundsWithKills : 0;
		const totalRoundsWithMultiKills = killRow
			? killRow.totalRoundsWithMultiKills
			: 0;
		const pistolRoundRating2 = pistolRating2Row ? pistolRating2Row.rating2 : 0;

		const firePowerStats = {
			steamId: firepower.steamId,
			killsPerRound: totalKills / firepower.totalRounds,
			killsPerRoundWin: killsInWonRounds / totalRoundsWon,
			damagePerRound: totalDamage / firepower.totalRounds,
			damagePerRoundWin: damageInWonRounds / totalRoundsWon,
			roundsWithKillPercent:
				(totalRoundsWithKills / firepower.totalRounds) * 100,
			rating2: rating2Row ? rating2Row.rating2 : 0,
			roundsWithMultiKillPercent:
				(totalRoundsWithMultiKills / firepower.totalRounds) * 100,
			pistolRoundRating2,
		};
		return firePowerStats;
	});

	return firepowerParameters;
};

type KillsInWonRoundsDTO = {
	steamId: string;
	killsInWonRounds: number;
};

type DamageInWonRoundsDTO = {
	steamId: string;
	damageInWonRounds: number;
};

type RoundsWonDTO = {
	steamId: string;
	totalRoundsWon: number;
};

type WonRoundStatsDTO = {
	steamId: string;
	damageInWonRounds: number;
	killsInWonRounds: number;
	totalRoundsWon: number;
};

const getWonRoundStats = async (
	steamId?: string,
	date: string = "all",
): Promise<WonRoundStatsDTO[]> => {
	const whereRound = buildStatsWhere({
		steamId,
		date,
		steamIdColumn: s.players.steamId,
		dateColumn: date === "all" ? undefined : s.matches.date,
	});

	const wonRoundsBase = db
		.select({
			steamId: s.players.steamId,
			matchId: s.players.matchId,
			roundNumber: s.rounds.number, // adjust if your column name differs
		})
		.from(s.players)
		.innerJoin(s.rounds, eq(s.rounds.matchId, s.players.matchId))
		.innerJoin(
			s.teams,
			and(
				eq(s.teams.matchId, s.players.matchId),
				eq(s.teams.id, s.players.teamId),
				eq(s.teams.name, s.rounds.winnerName),
			),
		);

	const wonRounds = withMatchJoinIfDate(wonRoundsBase, date, s.players.matchId)
		.where(whereRound)
		.groupBy(s.players.steamId, s.players.matchId, s.rounds.number)
		.as("won_rounds");

	const killsInWonRounds = (await db
		.select({
			steamId: wonRounds.steamId,
			killsInWonRounds: count(s.kills.id).as("killsInWonRounds"),
		})
		.from(wonRounds)
		.innerJoin(
			s.kills,
			and(
				eq(s.kills.matchId, wonRounds.matchId),
				eq(s.kills.roundNumber, wonRounds.roundNumber),
				eq(s.kills.killerSteamId, wonRounds.steamId),
				ne(s.kills.killerTeamName, s.kills.victimTeamName),
			),
		)
		.groupBy(wonRounds.steamId)) as KillsInWonRoundsDTO[];

	const damageInWonRounds = (await db
		.select({
			steamId: wonRounds.steamId,
			damageInWonRounds: sql<number>`
      COALESCE(SUM(${s.damages.healthDamage}), 0)
    `
				.mapWith(Number)
				.as("damageInWonRounds"),
		})
		.from(wonRounds)
		.innerJoin(
			s.damages,
			and(
				eq(s.damages.matchId, wonRounds.matchId),
				eq(s.damages.roundNumber, wonRounds.roundNumber),
				eq(s.damages.attackerSteamId, wonRounds.steamId),
				ne(s.damages.attackerTeamName, s.damages.victimTeamName),
			),
		)
		.groupBy(wonRounds.steamId)) as DamageInWonRoundsDTO[];

	const totalRoundsWon = (await db
		.select({
			steamId: wonRounds.steamId,
			totalRoundsWon: count().as("totalRoundsWon"),
		})
		.from(wonRounds)
		.groupBy(wonRounds.steamId)) as RoundsWonDTO[];

	const killsMap = new Map<string, number>();
	for (const row of killsInWonRounds) {
		killsMap.set(row.steamId, row.killsInWonRounds);
	}

	const damageMap = new Map<string, number>();
	for (const row of damageInWonRounds) {
		damageMap.set(row.steamId, row.damageInWonRounds);
	}

	const totalRoundsWonMap = new Map<string, number>();
	for (const row of totalRoundsWon) {
		totalRoundsWonMap.set(row.steamId, row.totalRoundsWon);
	}

	const allIds = new Set<string>([
		...killsMap.keys(),
		...damageMap.keys(),
		...totalRoundsWonMap.keys(),
	]);

	const wonRoundStats: WonRoundStatsDTO[] = Array.from(allIds, (steamId) => ({
		steamId,
		killsInWonRounds: killsMap.get(steamId) ?? 0,
		damageInWonRounds: damageMap.get(steamId) ?? 0,
		totalRoundsWon: totalRoundsWonMap.get(steamId) ?? 0,
	}));

	return wonRoundStats;
};
