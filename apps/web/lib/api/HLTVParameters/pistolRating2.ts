"use server";
import {
	alias,
	and,
	count,
	db,
	eq,
	gte,
	lte,
	ne,
	or,
	sql,
	sum,
} from "@repo/database";
import * as s from "@repo/database/schema";
import { buildStatsWhere, withMatchJoinIfDate } from "../query-helpers";

type PistolRatingDTO = {
	steamId: string;
	rating2: number;
};

export const getPistolRating2 = async (
	steamId?: string,
	date: string = "all",
): Promise<PistolRatingDTO[]> => {
	const pistolRoundStats = await getPistolRoundStats(steamId, date);

	const pistolRating2 = pistolRoundStats.map((pistol) => {
		const impact = 2.13 * pistol.pistolKPR + 0.42 * pistol.pistolAPR - 0.41;
		const rating2 =
			0.0073 * pistol.pistolKAST +
			0.3591 * pistol.pistolKPR -
			0.5329 * pistol.pistolDPR +
			0.0032 * pistol.pistolADR +
			0.2372 * impact +
			0.1587;
		return {
			steamId: pistol.steamId,
			rating2,
		};
	});
	return pistolRating2;
};

type PistolRoundStatsDTO = {
	steamId: string;
	pistolKAST: number;
	pistolKPR: number;
	pistolDPR: number;
	pistolAPR: number;
	pistolADR: number;
};

const getPistolRoundStats = async (
	steamId?: string,
	date: string = "all",
): Promise<PistolRoundStatsDTO[]> => {
	const totalPistolRounds = await getTotalPistolRounds(steamId, date);
	const pistolKastPerPlayer = await getPistolKast(steamId, date);
	const pistolKDAPerPlayer = await getPistolKDA(steamId, date);
	const pistolDamagePerPlayer = await getPistolDamage(steamId, date);

	const pistolRoundStats = totalPistolRounds.map((pistol) => {
		const pistolKastRow = pistolKastPerPlayer.find(
			(player) => player.steamId === pistol.steamId,
		);
		const pistolKdaRow = pistolKDAPerPlayer.find(
			(player) => player.steamId === pistol.steamId,
		);
		const pistolDamageRow = pistolDamagePerPlayer.find(
			(player) => player.steamId === pistol.steamId,
		);
		const pistolKAST = pistolKastRow
			? (pistolKastRow.kastRounds / pistol.totalPistolRounds) * 100
			: 0;
		const pistolKPR = pistolKdaRow
			? pistolKdaRow.totalKills / pistol.totalPistolRounds
			: 0;
		const pistolDPR = pistolKdaRow
			? pistolKdaRow.totalDeaths / pistol.totalPistolRounds
			: 0;
		const pistolAPR = pistolKdaRow
			? pistolKdaRow.totalAssists / pistol.totalPistolRounds
			: 0;
		const pistolADR = pistolDamageRow
			? pistolDamageRow.totalPistolDamage / pistol.totalPistolRounds
			: 0;

		return {
			steamId: pistol.steamId,
			pistolKAST,
			pistolKPR,
			pistolDPR,
			pistolAPR,
			pistolADR,
		};
	});

	return pistolRoundStats;
};

const getPistolRoundTable = (steamId?: string, date: string = "all") => {
	const extra = [or(eq(s.rounds.number, 1), eq(s.rounds.number, 13))];
	const pistolRoundWhere = buildStatsWhere({
		steamId,
		date,
		steamIdColumn: s.players.steamId,
		dateColumn: date === "all" ? undefined : s.matches.date,
		extra,
	});

	const pistolRoundBase = db
		.selectDistinct({
			matchId: s.rounds.matchId,
			roundNumber: s.rounds.number,
			steamId: s.players.steamId,
		})
		.from(s.rounds);

	const pistolRoundQ = withMatchJoinIfDate(
		pistolRoundBase,
		date,
		s.rounds.matchId,
	)
		.innerJoin(s.players, eq(s.players.matchId, s.rounds.matchId))
		.where(pistolRoundWhere)
		.as("pistol_rounds");

	return pistolRoundQ;
};

type PistolKastDTO = {
	steamId: string;
	kastRounds: number;
};

const getPistolKast = async (
	steamId?: string,
	date: string = "all",
): Promise<PistolKastDTO[]> => {
	const pistolRoundTable = getPistolRoundTable(steamId, date);

	const k2 = alias(s.kills, "k2");
	const k1 = alias(s.kills, "k1");

	const tickDelta = sql<number>`${k1.tick} - ${k2.tick}`;

	const tradeConditions = and(
		eq(k2.matchId, k1.matchId),
		eq(k2.roundNumber, k1.roundNumber),
		eq(k1.victimSteamId, k2.killerSteamId),

		ne(k2.killerSteamId, k2.victimSteamId),
		ne(k1.killerSteamId, k1.victimSteamId),

		ne(k2.killerSteamId, "0"),
		ne(k2.victimSteamId, "0"),
		ne(k1.killerSteamId, "0"),
		ne(k1.victimSteamId, "0"),

		ne(k2.killerTeamName, k2.victimTeamName),
		ne(k1.killerTeamName, k1.victimTeamName),

		gte(tickDelta, 0),
		lte(tickDelta, 320),
	);

	const tradedDeathsPR = db
		.select({
			matchId: k2.matchId,
			roundNumber: k2.roundNumber,
			steamId: k2.victimSteamId,
			tradedDeath: sql<number>`1`.as("tradedDeath"),
		})
		.from(k2)
		.innerJoin(k1, tradeConditions)
		.groupBy(k2.matchId, k2.roundNumber, k2.victimSteamId)
		.as("traded_deaths_pr");

	const flagsBase = db
		.select({
			matchId: pistolRoundTable.matchId,
			roundNumber: pistolRoundTable.roundNumber,
			steamId: pistolRoundTable.steamId,

			hasKill: sql<number>`
			MAX(CASE WHEN ${s.kills.killerSteamId} = ${pistolRoundTable.steamId} AND ${s.kills.killerTeamName} <> ${s.kills.victimTeamName} THEN 1 ELSE 0 END)
		  `
				.mapWith(Number)
				.as("hasKill"),

			hasAssist: sql<number>`
  MAX(CASE
    WHEN ${s.kills.assisterSteamId} = ${pistolRoundTable.steamId}
     AND ${s.kills.assisterTeamName} <> ${s.kills.victimTeamName} 
    THEN 1 ELSE 0
  END)
`
				.mapWith(Number)
				.as("hasAssist"),
			died: sql<number>`
			MAX(CASE WHEN ${s.kills.victimSteamId} = ${pistolRoundTable.steamId} THEN 1 ELSE 0 END)
		  `
				.mapWith(Number)
				.as("died"),

			tradedDeath: sql<number>`
			MAX(COALESCE(${tradedDeathsPR.tradedDeath}, 0))
		  `
				.mapWith(Number)
				.as("tradedDeath"),
		})
		.from(pistolRoundTable)
		.leftJoin(
			s.kills,
			and(
				eq(s.kills.matchId, pistolRoundTable.matchId),
				eq(s.kills.roundNumber, pistolRoundTable.roundNumber),
			),
		)
		.leftJoin(
			tradedDeathsPR,
			and(
				eq(tradedDeathsPR.matchId, pistolRoundTable.matchId),
				eq(tradedDeathsPR.roundNumber, pistolRoundTable.roundNumber),
				eq(tradedDeathsPR.steamId, pistolRoundTable.steamId),
			),
		)
		.groupBy(
			pistolRoundTable.matchId,
			pistolRoundTable.roundNumber,
			pistolRoundTable.steamId,
		)
		.as("flags");

	const kastPerRound = db
		.select({
			steamId: flagsBase.steamId,
			isKAST: sql<number>`
			CASE
			WHEN ${flagsBase.hasKill} = 1
			OR ${flagsBase.hasAssist} = 1 OR ${flagsBase.died} = 0 OR ${flagsBase.tradedDeath} = 1
			THEN 1 ELSE 0
			END
			`
				.mapWith(Number)
				.as("kast"),
		})
		.from(flagsBase)
		.as("kast_per_round");

	const kastQ = db
		.select({
			steamId: kastPerRound.steamId,
			kastRounds: sum(kastPerRound.isKAST).mapWith(Number).as("kastRounds"),
		})
		.from(kastPerRound)
		.groupBy(kastPerRound.steamId);

	return (await kastQ) as PistolKastDTO[];
};

type TotalPistolRoundsDTO = {
	steamId: string;
	totalPistolRounds: number;
};

const getTotalPistolRounds = async (
	steamId?: string,
	date: string = "all",
): Promise<TotalPistolRoundsDTO[]> => {
	const pistolRoundTable = getPistolRoundTable(steamId, date);

	const totalRoundsQ = db
		.select({
			steamId: pistolRoundTable.steamId,
			totalPistolRounds: count().mapWith(Number).as("totalPistolRounds"),
		})
		.from(pistolRoundTable)
		.groupBy(pistolRoundTable.steamId);

	return (await totalRoundsQ) as TotalPistolRoundsDTO[];
};

type PistolKdaDTO = {
	steamId: string;
	totalKills: number;
	totalDeaths: number;
	totalAssists: number;
};

const getPistolKDA = async (
	steamId?: string,
	date: string = "all",
): Promise<PistolKdaDTO[]> => {
	const pistolRoundTable = getPistolRoundTable(steamId, date);

	const pistolKdaPerRound = db
		.select({
			steamId: pistolRoundTable.steamId,
			matchId: pistolRoundTable.matchId,
			roundNumber: pistolRoundTable.roundNumber,
			kills: sql<number>`
		SUM(CASE WHEN ${s.kills.killerSteamId} = ${pistolRoundTable.steamId} AND  ${s.kills.killerTeamName} <> ${s.kills.victimTeamName}THEN 1 ELSE 0 END)
		`
				.mapWith(Number)
				.as("kills"),
			deaths: sql<number>`
		SUM(CASE WHEN ${s.kills.victimSteamId} = ${pistolRoundTable.steamId} THEN 1 ELSE 0 END)
		`
				.mapWith(Number)
				.as("deaths"),
			assists: sql<number>`
		SUM(CASE WHEN ${s.kills.assisterSteamId} = ${pistolRoundTable.steamId} AND ${s.kills.assisterTeamName} <> ${s.kills.victimTeamName} THEN 1 ELSE 0 END)
		`
				.mapWith(Number)
				.as("assists"),
		})
		.from(pistolRoundTable)
		.leftJoin(
			s.kills,
			and(
				eq(s.kills.matchId, pistolRoundTable.matchId),
				eq(s.kills.roundNumber, pistolRoundTable.roundNumber),
			),
		)
		.groupBy(
			pistolRoundTable.matchId,
			pistolRoundTable.roundNumber,
			pistolRoundTable.steamId,
		)
		.as("pistol_kda_per_round");

	const kdaTotals = db
		.select({
			steamId: pistolKdaPerRound.steamId,
			totalKills: sum(pistolKdaPerRound.kills)
				.mapWith(Number)
				.as("total_kills"),
			totalDeaths: sum(pistolKdaPerRound.deaths)
				.mapWith(Number)
				.as("total_deaths"),
			totalAssists: sum(pistolKdaPerRound.assists)
				.mapWith(Number)
				.as("total_assists"),
		})
		.from(pistolKdaPerRound)
		.groupBy(pistolKdaPerRound.steamId);

	return (await kdaTotals) as PistolKdaDTO[];
};

type PistolDamageDTO = {
	steamId: string;
	totalPistolDamage: number;
};

const getPistolDamage = async (
	steamId?: string,
	date: string = "all",
): Promise<PistolDamageDTO[]> => {
	const pistolRoundTable = getPistolRoundTable(steamId, date);

	const totalPistolDamage = db
		.select({
			steamId: pistolRoundTable.steamId,
			totalPistolDamage:
				sql<number>`COALESCE(SUM(${s.damages.healthDamage}), 0)`
					.mapWith(Number)
					.as("total_pistol_damage"),
		})
		.from(pistolRoundTable)
		.leftJoin(
			s.damages,
			and(
				eq(s.damages.matchId, pistolRoundTable.matchId),
				eq(s.damages.roundNumber, pistolRoundTable.roundNumber),
				eq(s.damages.attackerSteamId, pistolRoundTable.steamId),
				ne(s.damages.attackerTeamName, s.damages.victimTeamName),
			),
		)
		.groupBy(pistolRoundTable.steamId);

	return (await totalPistolDamage) as PistolDamageDTO[];
};
