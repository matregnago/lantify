"use server";
import { PlayerMatchHistoryDTO, PlayerProfileDTO } from "@repo/contracts";
import { db, eq, avg, sum, sql, desc, count } from "@repo/database";
import * as s from "@repo/database/schema";
import { fetchSteamProfiles } from "./steam";
export async function getPlayerProfileData(
  steamId: string,
): Promise<PlayerProfileDTO | null> {
  const playerData = await db
    .select({
      headshotPercent: avg(s.players.headshotPercent).mapWith(Number),
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
      `.as("totalMultiKills"),
      totalFirstKills: sum(s.players.firstKillCount).mapWith(Number),
      totalFirstDeaths: sum(s.players.firstDeathCount).mapWith(Number),
      utilityDamage: avg(s.players.utilityDamage).mapWith(Number),
      kast: avg(s.players.kast).mapWith(Number),
      averageDamagePerRound: avg(s.players.averageDamagePerRound).mapWith(
        Number,
      ),
      averageDeathPerRound: avg(s.players.averageDeathPerRound).mapWith(Number),
      oneVsOneCount: sum(s.players.oneVsOneCount).mapWith(Number),
      oneVsOneWonCount: sum(s.players.oneVsOneWonCount).mapWith(Number),
      oneVsOneLostCount: sum(s.players.oneVsOneLostCount).mapWith(Number),
      oneVsTwoCount: sum(s.players.oneVsTwoCount).mapWith(Number),
      oneVsTwoWonCount: sum(s.players.oneVsTwoWonCount).mapWith(Number),
      oneVsTwoLostCount: sum(s.players.oneVsTwoLostCount).mapWith(Number),
      oneVsThreeCount: sum(s.players.oneVsThreeCount).mapWith(Number),
      oneVsThreeWonCount: sum(s.players.oneVsThreeWonCount).mapWith(Number),
      oneVsThreeLostCount: sum(s.players.oneVsThreeLostCount).mapWith(Number),
      oneVsFourCount: sum(s.players.oneVsFourCount).mapWith(Number),
      oneVsFourWonCount: sum(s.players.oneVsFourWonCount).mapWith(Number),
      oneVsFourLostCount: sum(s.players.oneVsFourLostCount).mapWith(Number),
      oneVsFiveCount: sum(s.players.oneVsFiveCount).mapWith(Number),
      oneVsFiveWonCount: sum(s.players.oneVsFiveWonCount).mapWith(Number),
      oneVsFiveLostCount: sum(s.players.oneVsFiveLostCount).mapWith(Number),
    })
    .from(s.players)
    .where(eq(s.players.steamId, steamId));

  const playerStats = playerData[0];

  if (!playerStats) {
    return null;
  }

  let playerMatchHistory: PlayerMatchHistoryDTO[] =
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

  playerMatchHistory = playerMatchHistory.sort(
    (a, b) =>
      new Date(b.match?.date || 0).getTime() -
      new Date(a.match?.date || 0).getTime(),
  );

  const totalMatches = playerMatchHistory.length;
  const winRate =
    (playerMatchHistory.reduce(
      (acc, playerMatch) => acc + (playerMatch.team?.isWinner ? 1 : 0),
      0,
    ) /
      totalMatches) *
    100;

  const totalRounds = playerMatchHistory
    .flatMap((p) => p.match?.teams)
    .reduce((acc, team) => (acc += team?.score || 0), 0);

  const killDeathRatio = playerStats.totalKills / playerStats.totalDeaths;

  const headshotPercent =
    (playerStats.totalHeadshots / playerStats.totalKills) * 100;
  const steamData = await fetchSteamProfiles(steamId);

  const playerSteamData = steamData?.response.players[0] || {
    avatarfull: null,
    personaname: playerMatchHistory[0]?.name || "Unknown Player",
    steamid: null,
  };

  return {
    ...playerStats,
    killDeathRatio,
    headshotPercent,
    matchHistory: playerMatchHistory,
    nickName: playerSteamData.personaname,
    avatarUrl: playerSteamData.avatarfull,
    winRate,
    totalMatches,
    totalRounds,
  };
}

export const getPlayersRanking = async () => {
  const players = await db
    .select({
      steamId: s.players.steamId,
      rating2: avg(s.players.hltvRating2),
      partidas: count(s.players.matchId),
      adr: avg(s.players.averageDamagePerRound),
      kd: sql<number>`
        ROUND(
          SUM(${s.players.killCount})::numeric
          / NULLIF(SUM(${s.players.deathCount}), 0),
          2
        )
      `,
    })
    .from(s.players)
    .groupBy(s.players.steamId)
    .orderBy(desc(avg(s.players.hltvRating2)));

  const steamIds = players
    .map((player) => player.steamId)
    .filter(Boolean)
    .join(",");

  const steamData = (await fetchSteamProfiles(steamIds)) || {
    response: { players: [] },
  };

  return players.map((player) => {
    const playerData = steamData.response.players.find(
      (data) => data.steamid === player.steamId,
    );
    return {
      steamId: player.steamId,
      rating: Number(player.rating2).toFixed(2),
      avatarUrl: playerData?.avatarfull,
      steamNickname: playerData?.personaname,
      partidas: player.partidas,
      kd: player.kd,
      adr: Number(player.adr).toFixed(1),
    };
  });
};

export const getPlayerDuelsByMonth = async (steamId: string, month: string) => {
  if (month === "all") {
    return await db
      .select()
      .from(s.playerDuels)
      .leftJoin(s.matches, eq(s.playerDuels.matchId, s.matches.id))
      .where(eq(s.playerDuels.playerA_steamId, steamId));
  } else {
    return await db
      .select()
      .from(s.playerDuels)
      .leftJoin(s.matches, eq(s.playerDuels.matchId, s.matches.id))
      .where(
        sql`
        ${s.playerDuels.playerA_steamId} = ${steamId}
      AND to_char(${s.matches.date}::timestamp, 'Mon YYYY') = ${month}`,
      );
  }
};
