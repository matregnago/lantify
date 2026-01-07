import {
	alias,
	and,
	db,
	eq,
	gte,
	isNotNull,
	lte,
	ne,
	sql,
	unionAll,
} from "@repo/database";
import * as s from "@repo/database/schema";
import { getTotalRounds } from "../match";
import { getTotalAssists, getTotalDeaths } from "../player";
import { buildStatsWhere, withMatchJoinIfDate } from "../query-helpers";
import { getSaveStats } from "./saves";
import { getOpeningDeathsTraded, getTradeStats } from "./trading";

export const getEntryingValue = async (
	steamId?: string,
	date: string = "all",
) => {
	const entryingParameters = await getEntryingParameters(steamId, date);
	return entryingParameters;
};

const getEntryingParameters = async (
	steamId?: string,
	date: string = "all",
) => {
	const savedStats = await getSaveStats(steamId, date);
	const tradeStats = await getTradeStats(steamId, date);
	const totalRoundsPerPlayer = await getTotalRounds(steamId, date);
	const assists = await getTotalAssists(steamId, date);
	const deaths = await getTotalDeaths(steamId, date);
	const openingDeathsTraded = await getOpeningDeathsTraded(steamId, date);
	const support = await getSupportRounds(steamId, date);

	const entryingParameters = totalRoundsPerPlayer.map((entry) => {
		const saveRow = savedStats.find(
			(player) => player.steamId === entry.steamId,
		);
		const tradeRow = tradeStats.find(
			(player) => player.steamId === entry.steamId,
		);
		const totalRounds = entry.totalRounds;
		const assistRow = assists.find(
			(player) => player.steamId === entry.steamId,
		);
		const openingDeathsRow = openingDeathsTraded.find(
			(player) => player.steamId === entry.steamId,
		);
		const supportRow = support.find(
			(player) => player.steamId === entry.steamId,
		);

		const deathRow = deaths.find((player) => player.steamId === entry.steamId);
		return {
			steamId: entry.steamId,
			savedByTeammatePerRound: saveRow
				? saveRow.wasSavedAmount / totalRounds
				: 0,
			tradedDeathsPerRound: tradeRow ? tradeRow.tradeDeaths / totalRounds : 0,
			tradedDeathsPercent:
				deathRow && tradeRow
					? (tradeRow.tradeDeaths / deathRow.totalDeaths) * 100
					: 0,
			openingDeathsTradedPercent:
				openingDeathsRow && deathRow
					? (openingDeathsRow.openingDeathsTraded / deathRow.totalDeaths) * 100
					: 0,
			assistsPerRound: assistRow ? assistRow.totalAssists / totalRounds : 0,
			supportRoundsPercent: supportRow
				? (supportRow.supportRounds / totalRounds) * 100
				: 0,
		};
	});
	return entryingParameters;
};

type SupportRoundsDTO = {
	steamId: string;
	supportRounds: number;
};

export const getSupportRounds = async (
	steamId?: string,
	date: string = "all",
): Promise<SupportRoundsDTO[]> => {
	/**
	 * 1) Build the set of (matchId, roundNumber, steamId) we will evaluate.
	 *    Since we only have kills, "rounds" here means rounds where the player appears
	 *    as killer OR victim OR assister.
	 */
	const prUnion = unionAll(
		db
			.select({
				matchId: s.kills.matchId,
				roundNumber: s.kills.roundNumber,
				steamId: s.kills.killerSteamId,
			})
			.from(s.kills),

		db
			.select({
				matchId: s.kills.matchId,
				roundNumber: s.kills.roundNumber,
				steamId: s.kills.victimSteamId,
			})
			.from(s.kills),

		db
			.select({
				matchId: s.kills.matchId,
				roundNumber: s.kills.roundNumber,
				steamId: sql<string>`${s.kills.assisterSteamId}`.as("steamId"),
			})
			.from(s.kills)
			.where(isNotNull(s.kills.assisterSteamId)),
	).as("pru");

	const pr = db
		.select({
			matchId: prUnion.matchId,
			roundNumber: prUnion.roundNumber,
			steamId: prUnion.steamId,
		})
		.from(prUnion)
		.groupBy(prUnion.matchId, prUnion.roundNumber, prUnion.steamId)
		.as("pr");
	/**
	 * 2) tradedDeath per (match, round, victim) using your trade definition
	 *    k2 = initial kill (A kills B)
	 *    k1 = trade kill (C kills A within 5s)
	 *    tradedDeath credit = k2.victim (B)
	 */
	const k2 = alias(s.kills, "k2");
	const k1 = alias(s.kills, "k1");

	const tickDelta = sql<number>`${k1.tick} - ${k2.tick}`;

	const tradeConditions = and(
		//relação de trade
		eq(k2.matchId, k1.matchId),
		eq(k2.roundNumber, k1.roundNumber),
		eq(k1.victimSteamId, k2.killerSteamId),
		//sem suicidio
		ne(k2.killerSteamId, k2.victimSteamId),
		ne(k1.killerSteamId, k1.victimSteamId),
		//sem 0
		// ne(k2.killerSteamId, "0"),
		// ne(k2.victimSteamId, "0"),
		// ne(k1.killerSteamId, "0"),
		// ne(k1.victimSteamId, "0"),
		//t<5s
		gte(tickDelta, 1),
		lte(tickDelta, 320),
	);

	const tradedDeathsBase = db
		.select({
			matchId: k2.matchId,
			roundNumber: k2.roundNumber,
			steamId: k2.victimSteamId,
			tradedDeath: sql<number>`1`.as("tradedDeath"),
		})
		.from(k2)
		.innerJoin(k1, tradeConditions)
		.groupBy(k2.matchId, k2.roundNumber, k2.victimSteamId);

	const tradedDeathsPR = tradedDeathsBase.as("traded_deaths_pr");

	/**
	 * 3) For each player-round, compute flags from kills table
	 */
	const flagsBase = db
		.select({
			matchId: pr.matchId,
			roundNumber: pr.roundNumber,
			steamId: pr.steamId,

			hasKill: sql<number>`
      MAX(CASE WHEN ${s.kills.killerSteamId} = ${pr.steamId} THEN 1 ELSE 0 END)
    `
				.mapWith(Number)
				.as("hasKill"),

			hasAssist: sql<number>`
      MAX(CASE WHEN ${s.kills.assisterSteamId} = ${pr.steamId} THEN 1 ELSE 0 END)
    `
				.mapWith(Number)
				.as("hasAssist"),

			died: sql<number>`
      MAX(CASE WHEN ${s.kills.victimSteamId} = ${pr.steamId} THEN 1 ELSE 0 END)
    `
				.mapWith(Number)
				.as("died"),

			tradedDeath: sql<number>`
      MAX(COALESCE(${tradedDeathsPR.tradedDeath}, 0))
    `
				.mapWith(Number)
				.as("tradedDeath"),
		})
		.from(pr)
		.leftJoin(
			s.kills,
			and(
				eq(s.kills.matchId, pr.matchId),
				eq(s.kills.roundNumber, pr.roundNumber),
			),
		)
		.leftJoin(
			tradedDeathsPR,
			and(
				eq(tradedDeathsPR.matchId, pr.matchId),
				eq(tradedDeathsPR.roundNumber, pr.roundNumber),
				eq(tradedDeathsPR.steamId, pr.steamId),
			),
		)
		.groupBy(pr.matchId, pr.roundNumber, pr.steamId);

	const flagsQ = withMatchJoinIfDate(flagsBase, date, pr.matchId).as("flags");

	const where = buildStatsWhere({
		steamId,
		date,
		steamIdColumn: flagsQ.steamId,
		dateColumn: date === "all" ? undefined : s.matches.date,
	});

	/**
	 * 4) supportRound = noKills && (hasAssist || survived || tradedDeath)
	 *    survived = (died == 0)
	 */
	const supportPerRound = db
		.select({
			steamId: flagsQ.steamId,
			isSupport: sql<number>`
        CASE
          WHEN ${flagsQ.hasKill} = 0
           AND (${flagsQ.hasAssist} = 1 OR ${flagsQ.tradedDeath} = 1 OR ${flagsQ.died} = 0)
          THEN 1 ELSE 0
        END
      `
				.mapWith(Number)
				.as("isSupport"),
		})
		.from(flagsQ)
		.where(where)
		.as("support_per_round");

	const finalQ = db
		.select({
			steamId: supportPerRound.steamId,
			supportRounds: sql<number>`SUM(${supportPerRound.isSupport})`
				.mapWith(Number)
				.as("supportRounds"),
		})
		.from(supportPerRound)
		.groupBy(supportPerRound.steamId);

	return (await finalQ) as SupportRoundsDTO[];
};
