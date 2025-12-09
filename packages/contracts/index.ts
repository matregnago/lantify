import * as s from "@repo/database/schema";

export type PlayerProfileDTO = {
  nickName?: string;
  avatarUrl?: string;
  killDeathRatio: number;
  headshotPercent: number;
  killsPerMatch: number;
  killsPerRound: number;
  winRate: number;
  rating2: number;
  totalKills: number;
  totalDeaths: number;
  totalAssists: number;
  totalHeadshots: number;
  totalMvps: number;
  totalMatches: number;
  totalRounds: number;
  totalBombPlants: number;
  totalBombDefuses: number;
  totalMultiKills: number;
  totalFirstKills: number;
  totalFirstDeaths: number;
  totalUtilityDamage: number;
  kast: number;
  averageDamagePerRound: number;
  averageDeathPerRound: number;
  oneVsOneCount: number;
  oneVsOneWonCount: number;
  oneVsOneLostCount: number;
  oneVsTwoCount: number;
  oneVsTwoWonCount: number;
  oneVsTwoLostCount: number;
  oneVsThreeCount: number;
  oneVsThreeWonCount: number;
  oneVsThreeLostCount: number;
  oneVsFourCount: number;
  oneVsFourWonCount: number;
  oneVsFourLostCount: number;
  oneVsFiveCount: number;
  oneVsFiveWonCount: number;
  oneVsFiveLostCount: number;
};

export type PlayerDTO = typeof s.players.$inferSelect & {
  avatarUrl: string;
  steamNickname: string;
};

export type TeamDTO = typeof s.teams.$inferSelect & {
  players?: PlayerDTO[];
};

export type MatchDTO = typeof s.matches.$inferSelect & {
  teams: TeamDTO[];
};
