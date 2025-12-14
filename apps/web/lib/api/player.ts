import { PlayerMatchHistoryDTO, PlayerProfileDTO } from "@repo/contracts";
import { db, eq, avg, sum, sql } from "@repo/database";
import * as s from "@repo/database/schema";
import { fetchSteamProfiles } from "./steam";
export async function getPlayerProfileData(
  steamId: string
): Promise<PlayerProfileDTO | null> {
  const playerData = await db
    .select({
      killDeathRatio: avg(s.players.killDeathRatio).mapWith(Number),
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
        Number
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

  const totalMatches = playerMatchHistory.length;
  const winRate =
    (playerMatchHistory.reduce(
      (acc, playerMatch) => acc + (playerMatch.team?.isWinner ? 1 : 0),
      0
    ) /
      totalMatches) *
    100;

  const totalRounds = playerMatchHistory
    .flatMap((p) => p.match?.teams)
    .reduce((acc, team) => (acc += team?.score || 0), 0);

  const steamData = await fetchSteamProfiles(steamId);

  const playerSteamData = steamData.response.players[0];

  return {
    ...playerStats,
    matchHistory: playerMatchHistory,
    nickName: playerSteamData?.personaname || "",
    avatarUrl: playerSteamData?.avatarfull || "",
    winRate,
    totalMatches,
    totalRounds,
  };
}
