import { db, DrizzleQueryError } from "@repo/database";
import * as schema from "@repo/database/schema";
import JSONbig from "json-bigint";

type NewMatch = typeof schema.matches.$inferInsert;
type NewTeam = typeof schema.teams.$inferInsert;
type NewPlayer = typeof schema.players.$inferInsert;
type NewDuel = typeof schema.playerDuels.$inferInsert;

export const saveDemoData = async (fileName: string) => {
  const raw = await Bun.file(fileName).text();

  const data = JSONbig({
    storeAsString: true,
  }).parse(raw);

  if (!data) {
    throw new Error(`Erro ao abrir arquivo ${fileName}`);
  }

  try {
    await db.transaction(async (tx) => {
      const matchData: NewMatch = {
        id: data.checksum,
        date: data.date,
        map: data.mapName,
      };

      const insertedMatch = await tx
        .insert(schema.matches)
        .values(matchData)
        .returning({ insertedId: schema.matches.id });
      const matchId = insertedMatch[0]?.insertedId;

      if (!matchId) {
        tx.rollback();
      }

      const teamAData: NewTeam = {
        matchId,
        name: data.teamA.name,
        isWinner: data.winner.letter === data.teamA.letter,
        score: data.teamA.score,
        scoreFirstHalf: data.teamA.scoreFirstHalf,
        scoreSecondHalf: data.teamA.scoreSecondHalf,
        currentSide: data.teamA.currentSide,
      };

      const insertedTeamA = await tx
        .insert(schema.teams)
        .values(teamAData)
        .returning({ insertedId: schema.teams.id });
      const teamAId = insertedTeamA[0]?.insertedId;

      if (!teamAId) {
        tx.rollback();
      }

      const teamBData: NewTeam = {
        matchId,
        name: data.teamB.name,
        isWinner: data.winner.letter === data.teamB.letter,
        score: data.teamB.score,
        scoreFirstHalf: data.teamB.scoreFirstHalf,
        scoreSecondHalf: data.teamB.scoreSecondHalf,
        currentSide: data.teamB.currentSide,
      };

      const insertedTeamB = await tx
        .insert(schema.teams)
        .values(teamBData)
        .returning({ insertedId: schema.teams.id });
      const teamBId = insertedTeamB[0]?.insertedId;

      if (!teamBId) {
        tx.rollback();
      }

      const players: NewPlayer[] = Object.entries(data.players).map(
        ([steamId, player]: [string, any]) => {
          const teamId =
            player.team.letter === data.teamA.letter ? teamAId : teamBId;
          const newPlayerData: NewPlayer = {
            steamId,
            matchId,
            teamId,
            name: player.name,
            score: player.score,
            mvpCount: player.mvpCount,
            winCount: player.winCount,
            crosshairShareCode: player.crosshairShareCode,
            color: player.color,
            killCount: player.killCount,
            deathCount: player.deathCount,
            assistCount: player.assistCount,
            killDeathRatio: player.killDeathRatio,
            kast: player.kast,
            bombDefusedCount: player.bombDefusedCount,
            bombPlantedCount: player.bombPlantedCount,
            healthDamage: player.healthDamage,
            armorDamage: player.armorDamage,
            utilityDamage: player.utilityDamage,
            headshotCount: player.headshotCount,
            headshotPercent: player.headshotPercent,
            oneVsOneCount: player.oneVsOneCount,
            oneVsOneWonCount: player.oneVsOneWonCount,
            oneVsOneLostCount: player.oneVsOneLostCount,
            oneVsTwoCount: player.oneVsTwoCount,
            oneVsTwoWonCount: player.oneVsTwoWonCount,
            oneVsTwoLostCount: player.oneVsTwoLostCount,
            oneVsThreeCount: player.oneVsThreeCount,
            oneVsThreeWonCount: player.oneVsThreeWonCount,
            oneVsThreeLostCount: player.oneVsThreeLostCount,
            oneVsFourCount: player.oneVsFourCount,
            oneVsFourWonCount: player.oneVsFourWonCount,
            oneVsFourLostCount: player.oneVsFourLostCount,
            oneVsFiveCount: player.oneVsFiveCount,
            oneVsFiveWonCount: player.oneVsFiveWonCount,
            oneVsFiveLostCount: player.oneVsFiveLostCount,
            hostageRescuedCount: player.hostageRescuedCount,
            averageKillPerRound: player.averageKillPerRound,
            averageDeathPerRound: player.averageDeathPerRound,
            averageDamagePerRound: player.averageDamagePerRound,
            utilityDamagePerRound: player.utilityDamagePerRound,
            firstKillCount: player.firstKillCount,
            firstDeathCount: player.firstDeathCount,
            firstTradeDeathCount: player.firstTradeDeathCount,
            tradeDeathCount: player.tradeDeathCount,
            tradeKillCount: player.tradeKillCount,
            firstTradeKillCount: player.firstTradeKillCount,
            oneKillCount: player.oneKillCount,
            twoKillCount: player.twoKillCount,
            threeKillCount: player.threeKillCount,
            fourKillCount: player.fourKillCount,
            fiveKillCount: player.fiveKillCount,
            hltvRating: player.hltvRating,
            hltvRating2: player.hltvRating2,
          };
          return newPlayerData;
        },
      );

      await tx.insert(schema.players).values(players);

      const duelsMap = new Map<string, Map<string, NewDuel>>();

      const getOrCreateDuelMap = (playerId: string) => {
        let duels = duelsMap.get(playerId);
        if (!duels) {
          duels = new Map<string, NewDuel>();
          duelsMap.set(playerId, duels);
        }
        return duels;
      };

      const getOrCreateDuel = (
        duels: Map<string, NewDuel>,
        playerA: string,
        playerB: string,
      ): NewDuel => {
        let duel = duels.get(playerB);
        if (!duel) {
          duel = {
            playerA_steamId: playerA,
            playerB_steamId: playerB,
            kills: 0,
            deaths: 0,
            matchId,
          };
          duels.set(playerB, duel);
        }
        return duel;
      };

      const playerIds = Object.keys(data.players).map(String);

      for (const playerA of playerIds) {
        const map = new Map<string, NewDuel>();

        for (const playerB of playerIds) {
          if (playerA === playerB) continue;

          map.set(playerB, {
            playerA_steamId: playerA,
            playerB_steamId: playerB,
            kills: 0,
            deaths: 0,
            matchId,
          });
        }

        duelsMap.set(playerA, map);
      }

      for (const kill of data.kills) {
        const killerId = kill.killerSteamId;
        const victimId = kill.victimSteamId;

        const killerDuels = getOrCreateDuelMap(killerId);
        const victimDuels = getOrCreateDuelMap(victimId);

        const killerDuel = getOrCreateDuel(killerDuels, killerId, victimId);

        const victimDuel = getOrCreateDuel(victimDuels, victimId, killerId);

        killerDuel.kills += 1;
        victimDuel.deaths += 1;
      }

      const duels = Array.from(duelsMap.values()).flatMap((duel) =>
        Array.from(duel.values()),
      );
      await tx.insert(schema.playerDuels).values(duels);
    });
    console.log(
      `Dados da demo ${data.demoFileName} salvos com sucesso no banco.`,
    );
  } catch (error) {
    if (error instanceof DrizzleQueryError) {
      console.log("Erro detalhado:", error);
      console.log(
        `Dados já existem no banco para a demo ${data.demoFileName}.`,
      );
      return;
    }
    throw error;
  }
};
