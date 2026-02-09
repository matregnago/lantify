"use server";
import type {
	DuelDTO,
	MatchDTO,
	PlayerMatchHistoryDTO,
	PlayerProfileDTO,
	PlayerRankingDTO,
	PlayerStatsDTO,
} from "@repo/contracts";
import {
	and,
	avg,
	count,
	countDistinct,
	db,
	eq,
	ne,
	sql,
	sum,
} from "@repo/database";
import * as s from "@repo/database/schema";
import { redis } from "@repo/redis";
import { getClutchValue } from "./HLTVParameters/clutching";
import { getEntryingValue } from "./HLTVParameters/entrying";
import { getFirepowerValue } from "./HLTVParameters/firepower";
import { getOpeningValue } from "./HLTVParameters/opening";
import { getSnipingValue } from "./HLTVParameters/sniping";
import { getTradingValue } from "./HLTVParameters/trading";
import { getUtilityValue } from "./HLTVParameters/utility";
import { buildStatsWhere, withMatchJoinIfDate } from "./query-helpers";
import { fetchSteamProfiles, getSteamIdentity } from "./steam";

export async function getAggregatedPlayerStats(
	steamId?: string,
	date: string = "all",
): Promise<PlayerStatsDTO[]> {
	const key = `aggregated-stats:${steamId ?? "all"}:${date}`;
	const cachedAggregatedStats = await redis.get(key);

	if (cachedAggregatedStats && cachedAggregatedStats !== "") {
		const playersStats = JSON.parse(cachedAggregatedStats) as PlayerStatsDTO[];
		if (playersStats.length > 0) return playersStats;
	}

	const base = db
		.select({
			steamId: s.players.steamId,
			killDeathRatio: sql<number>`
        SUM(${s.players.killCount})::float
        / NULLIF(SUM(${s.players.deathCount}), 0)
      `.mapWith(Number),
			headshotPercent: sql<number>`
        SUM(${s.players.headshotCount})::float
        / NULLIF(SUM(${s.players.killCount}), 0) * 100
      `.mapWith(Number),
			totalMatches: count(s.players.matchId),
			killsPerMatch: avg(s.players.killCount).mapWith(Number),
			killsPerRound: avg(s.players.averageKillPerRound).mapWith(Number),
			totalKills: sum(s.players.killCount).mapWith(Number),
			totalDeaths: sum(s.players.deathCount).mapWith(Number),
			totalAssists: sum(s.players.assistCount).mapWith(Number),
			totalHeadshots: sum(s.players.headshotCount).mapWith(Number),
			totalMvps: sum(s.players.mvpCount).mapWith(Number),
			totalBombPlants: sum(s.players.bombPlantedCount).mapWith(Number),
			totalBombDefuses: sum(s.players.bombDefusedCount).mapWith(Number),
			totalMultiKills: sql<number>`
        SUM(
          ${s.players.twoKillCount} +
          ${s.players.threeKillCount} +
          ${s.players.fourKillCount} +
          ${s.players.fiveKillCount}
        )
      `.mapWith(Number),
			totalFirstKills: sum(s.players.firstKillCount).mapWith(Number),
			totalFirstDeaths: sum(s.players.firstDeathCount).mapWith(Number),
			utilityDamage: avg(s.players.utilityDamage).mapWith(Number),
			kast: avg(s.players.kast).mapWith(Number),
			averageDamagePerRound: avg(s.players.averageDamagePerRound).mapWith(
				Number,
			),
			averageDeathPerRound: avg(s.players.averageDeathPerRound).mapWith(Number),
		})
		.from(s.players);

	const q = withMatchJoinIfDate(base, date, s.players.matchId);

	const where = buildStatsWhere({
		steamId,
		date,
		steamIdColumn: s.players.steamId,
		dateColumn: date === "all" ? undefined : s.matches.date,
	});

	const playerData = (await q
		.where(where)
		.groupBy(s.players.steamId)) as PlayerStatsDTO[];

	const snipingValues = await getSnipingValue(steamId, date);
	const utilityValues = await getUtilityValue(steamId, date);
	const entryValues = await getEntryingValue(steamId, date);
	const tradingValues = await getTradingValue(steamId, date);
	const clutchingValues = await getClutchValue(steamId, date);
	const openingValues = await getOpeningValue(steamId, date);
	const firePowerValues = await getFirepowerValue(steamId, date);

	const aggregatedPlayerStatsList = playerData.map((playerStats) => {
		const snipingValue = snipingValues.find(
			(sv) => sv?.steamId === playerStats.steamId,
		);
		const utilityValue = utilityValues.find(
			(uv) => uv?.steamId === playerStats.steamId,
		);
		const entryValue = entryValues.find(
			(ev) => ev?.steamId === playerStats.steamId,
		);
		const tradingValue = tradingValues.find(
			(tv) => tv?.steamId === playerStats.steamId,
		);
		const clutchingValue = clutchingValues.find(
			(cv) => cv?.steamId === playerStats.steamId,
		);
		const openingValue = openingValues.find(
			(ov) => ov?.steamId === playerStats.steamId,
		);
		const firePowerValue = firePowerValues.find(
			(fpv) => fpv?.steamId === playerStats.steamId,
		);
		return {
			...playerStats,
			...snipingValue,
			...utilityValue,
			...entryValue,
			...tradingValue,
			...clutchingValue,
			...openingValue,
			...firePowerValue,
		};
	});
	await redis.set(key, JSON.stringify(aggregatedPlayerStatsList), "EX", 43200);

	return aggregatedPlayerStatsList;
}

export async function getPlayerMatchHistory(steamId: string) {
	const key = `match-history:${steamId}`;
	const cachedMatchHistory = await redis.get(key);

	if (cachedMatchHistory && cachedMatchHistory !== "") {
		return JSON.parse(cachedMatchHistory) as PlayerMatchHistoryDTO[];
	}

	const playerMatchHistory: PlayerMatchHistoryDTO[] =
		(await db.query.players.findMany({
			with: {
				team: true,
				match: {
					with: {
						teams: true,
					},
				},
			},
			where: eq(s.players.steamId, steamId),
		})) || [];

	const result = playerMatchHistory.sort(
		(a, b) =>
			new Date(b.match?.date || 0).getTime() -
			new Date(a.match?.date || 0).getTime(),
	);

	await redis.set(key, JSON.stringify(result), "EX", 43200); // 12 hours

	return result;
}

export async function getPlayerProfileData(
	steamId: string,
): Promise<PlayerProfileDTO | null> {
	const key = `player-profile:${steamId}`;
	const cachedProfile = await redis.get(key);
	if (cachedProfile && cachedProfile !== "") {
		return JSON.parse(cachedProfile) as PlayerProfileDTO;
	}

	const [stats] = await getAggregatedPlayerStats(steamId);
	const steamData = await fetchSteamProfiles([steamId]);

	const steamIdentity = getSteamIdentity(steamId, steamData);

	if (!stats) {
		return null;
	}

	const playerMatchHistory = await getPlayerMatchHistory(steamId);

	const winRate =
		(playerMatchHistory.reduce(
			(acc, playerMatch) => acc + (playerMatch.team?.isWinner ? 1 : 0),
			0,
		) /
			stats.totalMatches) *
		100;

	const totalRounds = playerMatchHistory
		.flatMap((p) => p.match?.teams ?? [])
		.reduce((acc, team) => acc + (team?.score ?? 0), 0);

	const clutches = await db
		.select()
		.from(s.clutches)
		.where(eq(s.clutches.clutcherSteamId, steamId));

	const playerProfile: PlayerProfileDTO = {
		steamId,
		clutches,
		stats,
		matchHistory: playerMatchHistory,
		winRate,
		totalRounds,
		avatarUrl: steamIdentity.avatarUrl,
		nickName: steamIdentity.nickName,
	};

	await redis.set(key, JSON.stringify(playerProfile), "EX", 43200); // 12 hours

	return playerProfile;
}

export async function getPlayersRankingData(): Promise<PlayerRankingDTO[]> {
	const playersStats = await getAggregatedPlayerStats();
	const steamIds = playersStats
		.map((player) => player.steamId)
		.filter((p) => p != null);

	const steamData = await fetchSteamProfiles(steamIds);

	return playersStats.map((playerStats) => {
		const steamIdentity = getSteamIdentity(playerStats.steamId, steamData);
		return {
			steamId: playerStats.steamId,
			stats: playerStats,
			avatarUrl: steamIdentity.avatarUrl,
			nickName: steamIdentity.nickName,
		};
	});
}

type DuelRow = {
	player_duels: DuelDTO;
	match: MatchDTO;
};

export const getPlayerDuelsByMonth = async (steamId: string, month: string) => {
	const key = `duels:${steamId}:${month}`;
	const cachedDuels = await redis.get(key);
	if (cachedDuels && cachedDuels !== "") {
		return JSON.parse(cachedDuels) as DuelRow[];
	}

	const query = db
		.select()
		.from(s.playerDuels)
		.leftJoin(s.matches, eq(s.playerDuels.matchId, s.matches.id))
		.where(
			month === "all"
				? eq(s.playerDuels.playerA_steamId, steamId)
				: sql`${s.playerDuels.playerA_steamId} = ${steamId}
              AND to_char(${s.matches.date}::timestamp, 'Mon YYYY') = ${month}`,
		);

	const result = await query;

	await redis.set(key, JSON.stringify(result), "EX", 43200); // 12 hours
	return result;
};

type TotalKillsDTO = {
	steamId: string;
	totalKills: number;
};

export const getTotalKills = async (
	steamId?: string,
	date: string = "all",
): Promise<TotalKillsDTO[]> => {
	const where = buildStatsWhere({
		steamId,
		date,
		steamIdColumn: s.kills.killerSteamId,
		dateColumn: date === "all" ? undefined : s.matches.date,
	});

	const base = db
		.select({
			steamId: s.kills.killerSteamId,
			totalKills: count(s.kills.id).mapWith(Number),
		})
		.from(s.kills);

	const q = withMatchJoinIfDate(base, date, s.kills.matchId);

	const totalKills = await q.where(where).groupBy(s.kills.killerSteamId);

	return totalKills;
};

type TotalAssistedKillsDTO = {
	steamId: string;
	totalAssistedKills: number;
};

export const getTotalAssistedKills = async (
	steamId?: string,
	date: string = "all",
): Promise<TotalAssistedKillsDTO[]> => {
	const extra = [ne(s.kills.assisterSteamId, "0")];
	const where = buildStatsWhere({
		steamId,
		date,
		steamIdColumn: s.kills.killerSteamId,
		dateColumn: date === "all" ? undefined : s.matches.date,
		extra,
	});

	const base = db
		.select({
			steamId: s.kills.killerSteamId,
			totalAssistedKills: count(s.kills.id).mapWith(Number),
		})
		.from(s.kills);

	const q = withMatchJoinIfDate(base, date, s.kills.matchId);

	const totalAssistedKills = await q
		.where(where)
		.groupBy(s.kills.killerSteamId);

	return totalAssistedKills;
};

type TotalAssistsDTO = {
	steamId: string;
	totalAssists: number;
};

export const getTotalAssists = async (
	steamId?: string,
	date: string = "all",
): Promise<TotalAssistsDTO[]> => {
	const where = buildStatsWhere({
		steamId,
		date,
		steamIdColumn: s.players.steamId,
		dateColumn: date === "all" ? undefined : s.matches.date,
	});

	const base = db
		.select({
			steamId: s.players.steamId,
			totalAssists: sum(s.players.assistCount).mapWith(Number),
		})
		.from(s.players);

	const q = withMatchJoinIfDate(base, date, s.players.matchId);

	const totalAssists = await q.where(where).groupBy(s.players.steamId);

	return totalAssists;
};

type TotalDeathsDTO = {
	steamId: string;
	totalDeaths: number;
};

export const getTotalDeaths = async (
	steamId?: string,
	date: string = "all",
): Promise<TotalDeathsDTO[]> => {
	const where = buildStatsWhere({
		steamId,
		date,
		steamIdColumn: s.kills.victimSteamId,
		dateColumn: date === "all" ? undefined : s.matches.date,
	});

	const base = db
		.select({
			steamId: s.kills.victimSteamId,
			totalDeaths: count(s.kills.id).mapWith(Number),
		})
		.from(s.kills);

	const q = withMatchJoinIfDate(base, date, s.kills.matchId);

	const totalDeaths = await q.where(where).groupBy(s.kills.victimSteamId);

	return totalDeaths;
};

type TotalDamageDTO = {
	steamId: string;
	totalDamage: number;
};

export const getTotalDamage = async (
	steamId?: string,
	date: string = "all",
): Promise<TotalDamageDTO[]> => {
	const adrPerMatch = db
		.select({
			steamId: s.players.steamId,
			matchId: s.players.matchId,
			adr: s.players.averageDamagePerRound,
		})
		.from(s.players)
		.as("pm");

	const roundsPerMatch = db
		.select({
			matchId: s.rounds.matchId,
			rounds: count().mapWith(Number).as("rounds"),
		})
		.from(s.rounds)
		.groupBy(s.rounds.matchId)
		.as("rm");

	const where = buildStatsWhere({
		steamId,
		date,
		steamIdColumn: adrPerMatch.steamId,
		dateColumn: date === "all" ? undefined : s.matches.date,
	});

	const base = db
		.select({
			steamId: adrPerMatch.steamId,
			totalDamage: sql<number>`
        SUM(${adrPerMatch.adr} * ${roundsPerMatch.rounds})
      `
				.mapWith(Number)
				.as("totalDamage"),
		})
		.from(adrPerMatch)
		.innerJoin(roundsPerMatch, eq(roundsPerMatch.matchId, adrPerMatch.matchId));

	const q = withMatchJoinIfDate(base, date, adrPerMatch.matchId)
		.where(where)
		.groupBy(adrPerMatch.steamId);

	const totalDamage = (await q) as TotalDamageDTO[];

	return totalDamage;
};

export const getTotalTimeAliveTicks = async (
	steamId?: string,
	date: string = "all",
) => {
	/**
	 * Universe: every (match, round, player) from roster × rounds
	 */
	const pr = db
		.select({
			matchId: s.rounds.matchId,
			roundNumber: s.rounds.number,
			steamId: s.players.steamId,
			startTick: s.rounds.startTick,
			endTick: s.rounds.endTick,
		})
		.from(s.rounds)
		.innerJoin(s.players, eq(s.players.matchId, s.rounds.matchId))
		.as("pr");

	/**
	 * Death tick per (match, round, player) — should be at most one.
	 * If you can have duplicates, use MIN/ MAX; MIN is safer.
	 */
	const deathPerRound = db
		.select({
			matchId: s.kills.matchId,
			roundNumber: s.kills.roundNumber,
			steamId: s.kills.victimSteamId,
			deathTick: sql<number>`MIN(${s.kills.tick})`.as("deathTick"),
		})
		.from(s.kills)
		.groupBy(s.kills.matchId, s.kills.roundNumber, s.kills.victimSteamId)
		.as("dpr");

	/**
	 * Join pr -> deathPerRound (left join so survivors have deathTick = null),
	 * then compute alive ticks per round:
	 * - if died: deathTick - startTick
	 * - else: endTick - startTick
	 *
	 * Clamp to [0, roundDuration] just in case.
	 */
	const alivePerRoundBase = db
		.select({
			steamId: pr.steamId,
			timeAliveTicks: sql<number>`
        SUM(
          LEAST(
            GREATEST(
              COALESCE(${deathPerRound.deathTick}, ${pr.endTick}) - ${pr.startTick},
              0
            ),
            (${pr.endTick} - ${pr.startTick})
          )
        )
      `.as("timeAliveTicks"),
		})
		.from(pr)
		.leftJoin(
			deathPerRound,
			and(
				eq(deathPerRound.matchId, pr.matchId),
				eq(deathPerRound.roundNumber, pr.roundNumber),
				eq(deathPerRound.steamId, pr.steamId),
			),
		)
		.groupBy(pr.matchId, pr.steamId);

	// Apply your standard filters (steamId + optional month filter via matches join)
	const aliveWithDateJoin = withMatchJoinIfDate(
		alivePerRoundBase,
		date,
		pr.matchId,
	).as("alive_with_date");

	const where = buildStatsWhere({
		steamId,
		date,
		steamIdColumn: aliveWithDateJoin.steamId,
		dateColumn: date === "all" ? undefined : s.matches.date,
	});

	const finalQ = db
		.select({
			steamId: aliveWithDateJoin.steamId,
			totalTimeAliveTicks: sql<number>`SUM(${aliveWithDateJoin.timeAliveTicks})`
				.mapWith(Number)
				.as("totalTimeAliveTicks"),
		})
		.from(aliveWithDateJoin)
		.where(where)
		.groupBy(aliveWithDateJoin.steamId);

	return await finalQ;
};

type TotalLostAndWonRoundsDTO = {
	steamId: string;
	lostRounds: number;
	wonRounds: number;
};

export const getTotalLostAndWonRounds = async (
	steamId?: string,
	date: string = "all",
): Promise<TotalLostAndWonRoundsDTO[]> => {
	const participants = db
		.select({
			steamId: s.players.steamId,
			matchId: s.players.matchId,
			teamName: s.teams.name,
		})
		.from(s.players)
		.innerJoin(s.teams, eq(s.teams.id, s.players.teamId))
		.groupBy(s.players.steamId, s.players.matchId, s.teams.name)
		.as("p");

	const where = buildStatsWhere({
		steamId,
		date,
		steamIdColumn: participants.steamId,
		dateColumn: s.matches.date,
	});

	const base = db
		.select({
			steamId: participants.steamId,
			lostRounds: sql<number>`
        SUM(
          CASE
            WHEN ${s.rounds.winnerName} <> ${participants.teamName}
            THEN 1 ELSE 0
          END
        )
      `
				.mapWith(Number)
				.as("lostRounds"),
			wonRounds: sql<number>`
			SUM(
				CASE
				WHEN ${s.rounds.winnerName} <> ${participants.teamName}
				THEN 0 ELSE 1
				END
			)
			`
				.mapWith(Number)
				.as("lostRounds"),
		})
		.from(s.rounds)
		.innerJoin(participants, eq(participants.matchId, s.rounds.matchId))
		.groupBy(participants.steamId);

	return await withMatchJoinIfDate(base, date, s.rounds.matchId).where(where);
};

type Rating2DTO = {
	steamId: string;
	rating2: number;
};

export const getRating2 = async (
	steamId?: string,
	date: string = "all",
): Promise<Rating2DTO[]> => {
	const base = db
		.select({
			steamId: s.players.steamId,
			rating2: avg(s.players.hltvRating2).mapWith(Number),
		})
		.from(s.players);

	const q = withMatchJoinIfDate(base, date, s.players.matchId);

	const where = buildStatsWhere({
		steamId,
		date,
		steamIdColumn: s.players.steamId,
		dateColumn: date === "all" ? undefined : s.matches.date,
	});

	return (await q.where(where).groupBy(s.players.steamId)) as Rating2DTO[];
};

export const getPlayerAmount = async (
	date: string = "all",
): Promise<number> => {
	const whereMatch = buildStatsWhere({
		date,
		steamIdColumn: s.players.steamId,
		dateColumn: date === "all" ? undefined : s.matches.date,
	});

	const res = await db
		.select({
			playerAmount: countDistinct(s.players.steamId)
				.mapWith(Number)
				.as("player_amount"),
		})
		.from(s.players)
		.innerJoin(s.matches, eq(s.players.matchId, s.matches.id))
		.where(whereMatch);

	return res[0]?.playerAmount ?? 0;
};
