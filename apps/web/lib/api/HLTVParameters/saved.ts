"use server";
import { and, db, eq, gte, lte, ne, sql } from "@repo/database";
import * as s from "@repo/database/schema";
import { buildStatsWhere, withMatchJoinIfDate } from "../query-helpers";

type SavedDTO = {
	steamId: string;
	savedAmount: number;
};

type WasSavedDTO = {
	steamId: string;
	wasSavedAmount: number;
};

type SaveStatsDTO = {
	steamId: string;
	savedAmount: number;
	wasSavedAmount: number;
};

export const getSaveStats = async (
	steamId?: string,
	date: string = "all",
): Promise<SaveStatsDTO[]> => {
	const tickDelta = sql<number>`${s.kills.tick} - ${s.damages.tick}`;

	const savedConditions = and(
		// mesma partida e atacante = vitima da kill
		eq(s.damages.matchId, s.kills.matchId),
		eq(s.damages.attackerSteamId, s.kills.victimSteamId),

		// garante que está salvando outra pessoa
		ne(s.damages.victimSteamId, s.kills.killerSteamId),

		// 1 segundo após o último evento de dano
		gte(tickDelta, 0),
		lte(tickDelta, 64),
	);

	const whereSaved = buildStatsWhere({
		steamId,
		date,
		steamIdColumn: s.kills.killerSteamId,
		dateColumn: date === "all" ? undefined : s.matches.date,
	});

	const whereWasSaved = buildStatsWhere({
		steamId,
		date,
		steamIdColumn: s.damages.victimSteamId, // ✅ THIS is the fix
		dateColumn: date === "all" ? undefined : s.matches.date,
	});

	const savedBase = db
		.select({
			steamId: s.kills.killerSteamId,
			savedAmount: sql<number>`count(distinct (${s.kills.id}))`,
		})
		.from(s.kills)
		.innerJoin(s.damages, savedConditions);

	const savedQ = withMatchJoinIfDate(savedBase, date, s.kills.matchId)
		.where(whereSaved)
		.groupBy(s.kills.killerSteamId);

	const savedStats = (await savedQ) as SavedDTO[];

	const wasSavedBase = db
		.select({
			steamId: s.damages.victimSteamId,
			wasSavedAmount: sql<number>`count(distinct (${s.kills.id}))`,
		})
		.from(s.kills)
		.innerJoin(s.damages, savedConditions);

	const wasSavedQ = withMatchJoinIfDate(wasSavedBase, date, s.kills.matchId)
		.where(whereWasSaved)
		.groupBy(s.damages.victimSteamId);

	const wasSavedStats = (await wasSavedQ) as WasSavedDTO[];

	const savedMap = new Map<string, number>();
	for (const row of savedStats) {
		savedMap.set(row.steamId, row.savedAmount);
	}

	const wasSavedMap = new Map<string, number>();
	for (const row of wasSavedStats) {
		wasSavedMap.set(row.steamId, row.wasSavedAmount);
	}

	const allIds = new Set<string>([...savedMap.keys(), ...wasSavedMap.keys()]);

	const saveStats: SaveStatsDTO[] = Array.from(allIds, (steamId) => ({
		steamId,
		savedAmount: savedMap.get(steamId) ?? 0,
		wasSavedAmount: wasSavedMap.get(steamId) ?? 0,
	}));

	return saveStats;
};
