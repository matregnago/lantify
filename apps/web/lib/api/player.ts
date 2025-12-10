import { PlayerMatchHistoryDTO, PlayerProfileDTO } from "@repo/contracts";
import { db, eq } from "@repo/database";
import * as s from "@repo/database/schema";
import { fetchSteamProfiles } from "./steam";
export async function getPlayerProfileData(steamId: string) {
  const playerData = await db
    .select()
    .from(s.players)
    .leftJoin(s.teams, eq(s.players.teamId, s.teams.id))
    .leftJoin(s.matches, eq(s.teams.matchId, s.matches.id))
    .where(eq(s.players.steamId, steamId));

  if (!playerData.length) {
    return null;
  }

  const steamData = await fetchSteamProfiles(steamId);

  const playerMatchHistory: PlayerMatchHistoryDTO[] = [];

  const acc: PlayerProfileDTO = {
    killDeathRatio: 0,
    headshotPercent: 0,
    killsPerMatch: 0,
    killsPerRound: 0,
    averageDamagePerRound: 0,
    winRate: 0,
    rating2: 0,
    totalKills: 0,
    totalDeaths: 0,
    totalAssists: 0,
    totalHeadshots: 0,
    totalMvps: 0,
    totalMatches: 0,
    totalRounds: 0,
    totalBombPlants: 0,
    totalBombDefuses: 0,
    totalMultiKills: 0,
    totalFirstKills: 0,
    totalFirstDeaths: 0,
    utilityDamage: 0,
    kast: 0,
    averageDeathPerRound: 0,
    oneVsOneCount: 0,
    oneVsOneWonCount: 0,
    oneVsOneLostCount: 0,
    oneVsTwoCount: 0,
    oneVsTwoWonCount: 0,
    oneVsTwoLostCount: 0,
    oneVsThreeCount: 0,
    oneVsThreeWonCount: 0,
    oneVsThreeLostCount: 0,
    oneVsFourCount: 0,
    oneVsFourWonCount: 0,
    oneVsFourLostCount: 0,
    oneVsFiveCount: 0,
    oneVsFiveWonCount: 0,
    oneVsFiveLostCount: 0,
  };

  for (const row of playerData) {
    if (row.match && row.team && row.player) {
      const teamsFromMatch = await db
        .select()
        .from(s.teams)
        .where(eq(s.teams.matchId, row.match.id));
      const roundsPlayed = teamsFromMatch
        .map((t) => t.score)
        .reduce((a, b) => a + b, 0);
      playerMatchHistory.push({
        match: row.match,
        teams: teamsFromMatch,
        player: row.player,
      });
      acc.totalRounds += roundsPlayed;
      acc.totalMatches++;
      acc.killDeathRatio += row.player.killDeathRatio;
      acc.averageDamagePerRound += row.player.averageDamagePerRound;
      acc.headshotPercent += row.player.headshotPercent;
      acc.killsPerMatch += row.player.killCount;
      acc.killsPerRound += row.player.averageKillPerRound;
      acc.rating2 += row.player.hltvRating2;
      acc.totalKills += row.player.killCount;
      acc.totalDeaths += row.player.deathCount;
      acc.totalAssists += row.player.assistCount;
      acc.totalHeadshots += row.player.headshotCount;
      acc.totalMvps += row.player.mvpCount;
      acc.totalBombPlants += row.player.bombPlantedCount;
      acc.totalBombDefuses += row.player.bombDefusedCount;
      acc.totalMultiKills +=
        row.player.twoKillCount +
        row.player.threeKillCount +
        row.player.fourKillCount +
        row.player.fiveKillCount;
      acc.totalFirstKills += row.player.firstKillCount;
      acc.totalFirstDeaths += row.player.firstDeathCount;
      acc.utilityDamage += row.player.utilityDamage;
      acc.kast += row.player.kast;
      acc.averageDeathPerRound += row.player.averageDeathPerRound;
      acc.oneVsOneCount += row.player.oneVsOneCount;
      acc.oneVsOneWonCount += row.player.oneVsOneWonCount;
      acc.oneVsOneLostCount += row.player.oneVsOneLostCount;
      acc.oneVsTwoCount += row.player.oneVsTwoCount;
      acc.oneVsTwoWonCount += row.player.oneVsTwoWonCount;
      acc.oneVsTwoLostCount += row.player.oneVsTwoLostCount;
      acc.oneVsThreeCount += row.player.oneVsThreeCount;
      acc.oneVsThreeWonCount += row.player.oneVsThreeWonCount;
      acc.oneVsThreeLostCount += row.player.oneVsThreeLostCount;
      acc.oneVsFourCount += row.player.oneVsFourCount;
      acc.oneVsFourWonCount += row.player.oneVsFourWonCount;
      acc.oneVsFourLostCount += row.player.oneVsFourLostCount;
      acc.oneVsFiveCount += row.player.oneVsFiveCount;
      acc.oneVsFiveWonCount += row.player.oneVsFiveWonCount;
      acc.oneVsFiveLostCount += row.player.oneVsFiveLostCount;
      acc.winRate = row.team?.isWinner ? acc.winRate + 1 : acc.winRate;
    }
  }

  const profilePlayerData: PlayerProfileDTO = {
    ...acc,
    avatarUrl: steamData?.response.players[0]?.avatarfull || "",
    nickName: steamData?.response.players[0]?.personaname || "",
    killDeathRatio: acc.killDeathRatio / acc.totalMatches,
    averageDamagePerRound: acc.averageDamagePerRound / acc.totalMatches,
    headshotPercent: acc.headshotPercent / acc.totalMatches,
    killsPerMatch: acc.killsPerMatch / acc.totalMatches,
    killsPerRound: acc.killsPerRound / acc.totalMatches,
    rating2: acc.rating2 / acc.totalMatches,
    winRate: acc.totalMatches ? (acc.winRate / acc.totalMatches) * 100 : 0,
    kast: acc.kast / acc.totalMatches,
    averageDeathPerRound: acc.averageDeathPerRound / acc.totalMatches,
    matchHistory: playerMatchHistory,
    utilityDamage: acc.utilityDamage / acc.totalMatches,
  };

  return profilePlayerData;
}
