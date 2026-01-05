"use server";
import type { WeaponName, WeaponType } from "@repo/contracts/enums";
import { count, db, eq, sql } from "@repo/database";
import * as s from "@repo/database/schema";
import { buildStatsWhere, withMatchJoinIfDate } from "../query-helpers";

type WeaponTypeStatsDTO = {
	steamId: string;
	totalKills: number;
	totalRoundsWithKills: number;
	totalRoundsWithMultiKills: number;
};

export const getWeaponTypeStats = async (
	weaponType: WeaponType,
	steamId?: string,
	date: string = "all",
): Promise<WeaponTypeStatsDTO[]> => {
	const whereWeaponType = buildStatsWhere({
		steamId,
		date,
		steamIdColumn: s.kills.killerSteamId,
		dateColumn: date === "all" ? undefined : s.matches.date,
		extra: [eq(s.kills.weaponType, weaponType)],
	});

	const mkRoundsBase = db
		.select({
			steamId: s.kills.killerSteamId,
			matchId: s.kills.matchId,
			roundNumber: s.kills.roundNumber,
		})
		.from(s.kills);

	const mkRoundsQ = withMatchJoinIfDate(mkRoundsBase, date, s.kills.matchId)
		.where(whereWeaponType)
		.groupBy(s.kills.killerSteamId, s.kills.matchId, s.kills.roundNumber)
		.having(sql`COUNT(*) >= 2`)
		.as("mk_rounds");

	const mkPerPlayer = db
		.select({
			steamId: mkRoundsQ.steamId,
			totalRoundsWithMultiKills: sql<number>`COUNT(*)`
				.mapWith(Number)
				.as("totalRoundsWithMultikills"),
		})
		.from(mkRoundsQ)
		.groupBy(mkRoundsQ.steamId)
		.as("mk_per_player");

	const base = db
		.select({
			steamId: s.kills.killerSteamId,
			totalKills: count(s.kills.id).mapWith(Number),
			totalRoundsWithKills: sql<number>`
        COUNT(DISTINCT (${s.kills.matchId}, ${s.kills.roundNumber}))
      `.mapWith(Number),
			totalRoundsWithMultiKills: sql<number>`
        COALESCE(MAX(${mkPerPlayer.totalRoundsWithMultiKills}), 0)
      `.mapWith(Number),
		})
		.from(s.kills)
		.leftJoin(mkPerPlayer, eq(mkPerPlayer.steamId, s.kills.killerSteamId));

	const q = withMatchJoinIfDate(base, date, s.kills.matchId);

	return await q.where(whereWeaponType).groupBy(s.kills.killerSteamId);
};

type WeaponNameStatsDTO = {
	steamId: string;
	totalKills: number;
	totalRoundsWithKills: number;
	totalRoundsWithMultikills: number;
};

export const getWeaponNameStats = async (
	weaponName: WeaponName,
	steamId?: string,
	date: string = "all",
): Promise<WeaponNameStatsDTO[]> => {
	const whereWeaponName = buildStatsWhere({
		steamId,
		date,
		steamIdColumn: s.kills.killerSteamId,
		dateColumn: date === "all" ? undefined : s.matches.date,
		extra: [eq(s.kills.weaponName, weaponName)],
	});

	const mkRoundsBase = db
		.select({
			steamId: s.kills.killerSteamId,
			matchId: s.kills.matchId,
			roundNumber: s.kills.roundNumber,
		})
		.from(s.kills);

	const mkRoundsQ = withMatchJoinIfDate(mkRoundsBase, date, s.kills.matchId)
		.where(whereWeaponName)
		.groupBy(s.kills.killerSteamId, s.kills.matchId, s.kills.roundNumber)
		.having(sql`COUNT(*) >= 2`)
		.as("mk_rounds");

	const mkPerPlayer = db
		.select({
			steamId: mkRoundsQ.steamId,
			totalRoundsWithMultiKills: sql<number>`COUNT(*)`.mapWith(Number),
		})
		.from(mkRoundsQ)
		.groupBy(mkRoundsQ.steamId)
		.as("mk_per_player");

	const base = db
		.select({
			steamId: s.kills.killerSteamId,
			totalKills: count(s.kills.id).mapWith(Number),
			totalRoundsWithKills: sql<number>`
        COUNT(DISTINCT (${s.kills.matchId}, ${s.kills.roundNumber}))
      `.mapWith(Number),
			totalRoundsWithMultiKills: sql<number>`
        COALESCE(MAX(${mkPerPlayer.totalRoundsWithMultiKills}), 0)
      `.mapWith(Number),
		})
		.from(s.kills)
		.leftJoin(mkPerPlayer, eq(mkPerPlayer.steamId, s.kills.killerSteamId));

	const q = withMatchJoinIfDate(base, date, s.kills.matchId);

	return await q.where(whereWeaponName).groupBy(s.kills.killerSteamId);
};

type OpeningAmountDTO = {
	steamId: string;
	openingKills: number;
};

export const getOpeningAmount = async (
	weaponType?: WeaponType,
	steamId?: string,
	date: string = "all",
): Promise<OpeningAmountDTO[]> => {
	const extraConditions = [];
	if (weaponType) extraConditions.push(eq(s.kills.weaponType, weaponType));

	const whereBase = buildStatsWhere({
		steamId,
		date,
		steamIdColumn: s.kills.killerSteamId,
		dateColumn: date === "all" ? undefined : s.matches.date,
		extra: extraConditions,
	});

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
		.where(whereBase)
		.groupBy(s.kills.matchId, s.kills.roundNumber)
		.as("round_min_tick");

	// 2) Join kills to round_min_tick and keep only kills that match that earliest tick
	// (If two kills share the same earliest tick, both count as "opening" — if you want tie-breaking, say so.)
	const openingKills = db
		.select({
			steamId: s.kills.killerSteamId,
		})
		.from(s.kills)
		.innerJoin(
			roundMinTick,
			sql`
        ${s.kills.matchId} = ${roundMinTick.matchId}
        AND ${s.kills.roundNumber} = ${roundMinTick.roundNumber}
        AND ${s.kills.tick} = ${roundMinTick.minTick}
      `,
		)
		.where(whereBase)
		.as("opening_kills");

	// 3) Count opening kills per player
	const q = db
		.select({
			steamId: openingKills.steamId,
			openingKills: sql<number>`COUNT(*)`.mapWith(Number).as("openingKills"),
		})
		.from(openingKills)
		.groupBy(openingKills.steamId);

	return await q;
};
