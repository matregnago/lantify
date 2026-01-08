import { alias, and, db, eq, gte, lte, ne, sql } from "@repo/database";
import * as s from "@repo/database/schema";
import { getTotalRounds } from "../match";
import {
	getTotalAssistedKills,
	getTotalDamage,
	getTotalKills,
} from "../player";
import { buildStatsWhere, withMatchJoinIfDate } from "../query-helpers";
import { getSaveStats } from "./saved";

export const getTradingValue = async (
	steamId?: string,
	date: string = "all",
) => {
	const tradingParameters = await getTradingParameters(steamId, date);
	return tradingParameters;
};

const getTradingParameters = async (steamId?: string, date: string = "all") => {
	const tradeStats = await getTradeStats(steamId, date);
	const saveStats = await getSaveStats(steamId, date);
	const totalRoundsPerPlayer = await getTotalRounds(steamId, date);
	const totalKillsPerPlayer = await getTotalKills(steamId, date);
	const totalAssistedKills = await getTotalAssistedKills(steamId, date);
	const totalDamage = await getTotalDamage(steamId, date);

	const tradingParameters = totalRoundsPerPlayer.map((trader) => {
		const tradeStatsRow = tradeStats.find(
			(player) => player.steamId === trader.steamId,
		);
		const saveStatsRow = saveStats.find(
			(player) => player.steamId === trader.steamId,
		);
		const totalKillsRow = totalKillsPerPlayer.find(
			(player) => player.steamId === trader.steamId,
		);
		const totalAssistedKillsRow = totalAssistedKills.find(
			(player) => player.steamId === trader.steamId,
		);
		const totalDamageRow = totalDamage.find(
			(player) => player.steamId === trader.steamId,
		);
		const totalRounds = trader.totalRounds;
		const totalKills =
			!totalKillsRow || totalKillsRow.totalKills === 0
				? 1
				: totalKillsRow.totalKills;

		return {
			steamId: trader.steamId,
			savedTeammatePerRound: saveStatsRow
				? saveStatsRow.savedAmount / totalRounds
				: 0,
			tradeKillsPerRound: tradeStatsRow
				? tradeStatsRow.tradeKills / totalRounds
				: 0,
			tradeKillsPercent: tradeStatsRow
				? (tradeStatsRow.tradeKills / totalKills) * 100
				: 0,
			assistedKillsPercent: totalAssistedKillsRow
				? (totalAssistedKillsRow.totalAssistedKills / totalKills) * 100
				: 0,
			damagePerKill: totalDamageRow
				? totalDamageRow.totalDamage / totalKills
				: 0,
		};
	});

	return tradingParameters;
};

type TradeKillDTO = {
	steamId: string;
	tradeKills: number;
};

type TradeDeathDTO = {
	steamId: string;
	tradeDeaths: number;
};

type TradeStatsDTO = {
	steamId: string;
	tradeKills: number;
	tradeDeaths: number;
};

export const getTradeStats = async (
	steamId?: string,
	date: string = "all",
): Promise<TradeStatsDTO[]> => {
	const k1 = s.kills; // a trade
	const k2 = alias(s.kills, "k2"); // a kill inicial

	const tickDelta = sql<number>`${k1.tick} - ${k2.tick}`;

	/**
	 * k2: A mata B
	 * k1: C mata A dentro de 5s
	 *
	 * condition: k1.victim == k2.killer AND tempo < 5s
	 */
	const tradeConditions = and(
		//relação de trade
		eq(k2.matchId, k1.matchId),
		eq(k2.roundNumber, k1.roundNumber),
		eq(k1.victimSteamId, k2.killerSteamId),
		//sem suicidio
		ne(k2.killerSteamId, k2.victimSteamId),
		ne(k1.killerSteamId, k1.victimSteamId),
		//sem 0
		ne(k2.killerSteamId, "0"),
		ne(k2.victimSteamId, "0"),
		ne(k1.killerSteamId, "0"),
		ne(k1.victimSteamId, "0"),
		//t<5s
		gte(tickDelta, 1),
		lte(tickDelta, 320),
	);

	// Trade KILLS: crédito pra quem mata (k1.killer)
	const whereTradeKills = buildStatsWhere({
		steamId,
		date,
		steamIdColumn: k1.killerSteamId,
		dateColumn: date === "all" ? undefined : s.matches.date,
	});

	// Trade DEATHS: crédito pra quem morre na inicialmente(k2.victim)
	const whereTradeDeaths = buildStatsWhere({
		steamId,
		date,
		steamIdColumn: k2.victimSteamId,
		dateColumn: date === "all" ? undefined : s.matches.date,
	});

	const tradeKillsBase = db
		.select({
			steamId: k1.killerSteamId,
			tradeKills: sql<number>`count(distinct ${k1.id})`.mapWith(Number),
		})
		.from(k1)
		.innerJoin(k2, tradeConditions);

	const tradeKillStats = (await withMatchJoinIfDate(
		tradeKillsBase,
		date,
		k1.matchId,
	)
		.where(whereTradeKills)
		.groupBy(k1.killerSteamId)) as TradeKillDTO[];

	const tradeDeathsBase = db
		.select({
			steamId: k2.victimSteamId, // jogador que morreu primeiro
			tradeDeaths: sql<number>`count(distinct ${k2.id})`.mapWith(Number),
		})
		.from(k1)
		.innerJoin(k2, tradeConditions);

	const tradeDeathStats = (await withMatchJoinIfDate(
		tradeDeathsBase,
		date,
		k1.matchId,
	)
		.where(whereTradeDeaths)
		.groupBy(k2.victimSteamId)) as TradeDeathDTO[];

	const killsMap = new Map<string, number>(
		tradeKillStats.map((r) => [r.steamId, r.tradeKills]),
	);
	const deathsMap = new Map<string, number>(
		tradeDeathStats.map((r) => [r.steamId, r.tradeDeaths]),
	);

	const allIds = new Set<string>([...killsMap.keys(), ...deathsMap.keys()]);

	const tradeStats: TradeStatsDTO[] = Array.from(allIds, (id) => ({
		steamId: id,
		tradeKills: killsMap.get(id) ?? 0,
		tradeDeaths: deathsMap.get(id) ?? 0,
	}));

	return tradeStats;
};

type OpeningDeathsTradedDTO = {
	steamId: string;
	openingDeathsTraded: number;
};

export const getOpeningDeathsTraded = async (
	steamId?: string,
	date: string = "all",
): Promise<OpeningDeathsTradedDTO[]> => {
	const k2 = alias(s.kills, "k2"); // opening kill
	const k1 = alias(s.kills, "k1"); // trade kill

	// opening kill
	const whereRound = buildStatsWhere({
		date,
		steamIdColumn: k2.killerSteamId,
		dateColumn: date === "all" ? undefined : s.matches.date,
	});

	const roundMinTickBase = db
		.select({
			matchId: k2.matchId,
			roundNumber: k2.roundNumber,
			minTick: sql<number>`MIN(${k2.tick})`.mapWith(Number).as("minTick"),
		})
		.from(k2);

	const roundMinTick = withMatchJoinIfDate(roundMinTickBase, date, k2.matchId)
		.where(whereRound)
		.groupBy(k2.matchId, k2.roundNumber)
		.as("round_min_tick");

	const openingJoin = and(
		eq(k2.matchId, roundMinTick.matchId),
		eq(k2.roundNumber, roundMinTick.roundNumber),
		eq(k2.tick, roundMinTick.minTick),
	);

	// trade
	const tickDelta = sql<number>`${k1.tick} - ${k2.tick}`;

	const tradeConditions = and(
		// mesmo round
		eq(k2.matchId, k1.matchId),
		eq(k2.roundNumber, k1.roundNumber),

		// quem matou na opening é tradado
		eq(k1.victimSteamId, k2.killerSteamId),

		// sem suicidios
		ne(k2.killerSteamId, k2.victimSteamId),
		ne(k1.killerSteamId, k1.victimSteamId),

		// sem 0
		ne(k2.killerSteamId, "0"),
		ne(k2.victimSteamId, "0"),
		ne(k1.killerSteamId, "0"),
		ne(k1.victimSteamId, "0"),

		// em até 5 segundos
		gte(tickDelta, 1),
		lte(tickDelta, 320),
	);

	/* -------------------------------------------------
	 * 3) Credit goes to opening death victim (k2.victim)
	 * ------------------------------------------------- */
	const where = buildStatsWhere({
		steamId,
		date,
		steamIdColumn: k2.victimSteamId,
		dateColumn: date === "all" ? undefined : s.matches.date,
	});

	const base = db
		.select({
			steamId: k2.victimSteamId,
			openingDeathsTraded: sql<number>`
        count(distinct ${k2.id})
      `.mapWith(Number),
		})
		.from(k2)
		.innerJoin(roundMinTick, openingJoin) // opening kill
		.innerJoin(k1, tradeConditions); // traded opener

	const q = withMatchJoinIfDate(base, date, k2.matchId)
		.where(where)
		.groupBy(k2.victimSteamId) as OpeningDeathsTradedDTO[];

	return await q;
};
