"use server";
import type {
	DuelDTO,
	MatchDTO,
	PlayerMatchHistoryDTO,
	PlayerProfileDTO,
	PlayerRankingDTO,
	PlayerStatsDTO,
} from "@repo/contracts";
import { and, avg, count, db, eq, sql, sum } from "@repo/database";
import * as s from "@repo/database/schema";
import { redis } from "@repo/redis";
import { fetchSteamProfiles, getSteamIdentity } from "./steam";

function buildPlayerStatsCondition(steamId?: string, date: string = "all") {
	const conditions = [];

	if (steamId) {
		conditions.push(eq(s.players.steamId, steamId));
	}
	if (date !== "all") {
		conditions.push(
			sql`AND to_char(${s.matches.date}::timestamp, 'Mon YYYY') = ${date}`,
		);
	}
	return conditions.length > 0 ? and(...conditions) : undefined;
}

export async function getAggregatedPlayerStats(
	steamId?: string,
	date: string = "all",
): Promise<PlayerStatsDTO[]> {
	const key = `AggregatedStats:v1:${steamId},${date}`;
	const cachedAggregatedStats = await redis.get(key);

	if (cachedAggregatedStats) {
		return JSON.parse(cachedAggregatedStats) as PlayerStatsDTO[];
	}

	const where = buildPlayerStatsCondition(steamId, date);
	const playerData = await db
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
			rating2: avg(s.players.hltvRating2).mapWith(Number),
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
		.from(s.players)
		.groupBy(s.players.steamId)
		.where(where);

	await redis.set(key, JSON.stringify(playerData), "EX", 43200); // 12 hours

	return playerData;
}

export async function getPlayerMatchHistory(steamId: string) {
	const key = `matchHistory:v1:${steamId}`;
	const cachedMatchHistory = await redis.get(key);

	if (cachedMatchHistory) {
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
	const key = `playerProfile:v1:${steamId}`;
	const cachedProfile = await redis.get(key);
	if (cachedProfile) {
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
	const key = `duels:v4:${steamId}:${month}`;
	const cachedDuels = await redis.get(key);
	if (cachedDuels) {
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
