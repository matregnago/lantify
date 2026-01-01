import * as s from "@repo/database/schema";

export type PlayerMatchHistoryDTO = typeof s.players.$inferInsert & {
  team: typeof s.teams.$inferSelect | null;
  match:
  | (typeof s.matches.$inferSelect & {
    teams: (typeof s.teams.$inferSelect)[];
  })
  | null;
};

export type PlayerRankingDTO = {
  steamId: string;
  stats: PlayerStatsDTO;
  nickName?: string | null;
  avatarUrl?: string | null;
};

export type PlayerStatsDTO = {
  steamId: string;

  killDeathRatio: number;
  headshotPercent: number;

  totalMatches: number;

  killsPerMatch: number;
  killsPerRound: number;

  rating2: number;

  totalKills: number;
  totalDeaths: number;
  totalAssists: number;
  totalHeadshots: number;
  totalMvps: number;

  totalBombPlants: number;
  totalBombDefuses: number;
  totalMultiKills: number;

  totalFirstKills: number;
  totalFirstDeaths: number;

  utilityDamage: number;
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

export type PlayerProfileDTO = {
  steamId: string;

  nickName?: string | null;
  avatarUrl?: string | null;

  stats: PlayerStatsDTO;

  matchHistory: PlayerMatchHistoryDTO[];

  winRate: number;
  totalRounds: number;
};

export type PlayerDTO = typeof s.players.$inferSelect & {
  avatarUrl?: string | null;
  steamNickname?: string | null;
};

export type TeamDTO = typeof s.teams.$inferSelect & {
  players?: PlayerDTO[];
};

export type MatchDTO = typeof s.matches.$inferSelect & {
  teams: TeamDTO[];
};

export type DuelDTO = typeof s.playerDuels.$inferSelect;

export type MatchDataDTO = typeof s.matches.$inferSelect & {
  teams: TeamDTO[];
  duels: DuelDTO[];
};


// Credits to: https://github.com/akiver/cs-demo-manager

export declare const WeaponType: {
  readonly Unknown: "unknown";
  readonly Pistol: "pistol";
  readonly SMG: "smg";
  readonly Shotgun: "shotgun";
  readonly Rifle: "rifle";
  readonly Sniper: "sniper";
  readonly MachineGun: "machine_gun";
  readonly Grenade: "grenade";
  readonly Equipment: "equipment";
  readonly Melee: "melee";
  readonly World: "world";
};
export type WeaponType = (typeof WeaponType)[keyof typeof WeaponType];
export declare const WeaponName: {
  readonly AK47: "AK-47";
  readonly AUG: "AUG";
  readonly AWP: "AWP";
  readonly Bomb: "C4";
  readonly CZ75: "CZ75 Auto";
  readonly Decoy: "Decoy Grenade";
  readonly Deagle: "Desert Eagle";
  readonly DefuseKit: "Defuse Kit";
  readonly DualBerettas: "Dual Berettas";
  readonly Famas: "FAMAS";
  readonly FiveSeven: "Five-SeveN";
  readonly Flashbang: "Flashbang";
  readonly G3SG1: "G3SG1";
  readonly GalilAR: "Galil AR";
  readonly Glock: "Glock-18";
  readonly HEGrenade: "HE Grenade";
  readonly Helmet: "Kevlar + Helmet";
  readonly Kevlar: "Kevlar Vest";
  readonly Incendiary: "Incendiary Grenade";
  readonly Knife: "Knife";
  readonly M249: "M249";
  readonly M4A1: "M4A1";
  readonly M4A4: "M4A4";
  readonly Mac10: "MAC-10";
  readonly MAG7: "MAG-7";
  readonly Molotov: "Molotov";
  readonly MP5: "MP5-SD";
  readonly MP7: "MP7";
  readonly MP9: "MP9";
  readonly Negev: "Negev";
  readonly Nova: "Nova";
  readonly P2000: "P2000";
  readonly P250: "P250";
  readonly P90: "P90";
  readonly PPBizon: "PP-Bizon";
  readonly Revolver: "R8 Revolver";
  readonly SawedOff: "Sawed-Off";
  readonly Scar20: "SCAR-20";
  readonly Scout: "SSG 08";
  readonly SG553: "SG 553";
  readonly Smoke: "Smoke Grenade";
  readonly Tec9: "Tec-9";
  readonly UMP45: "UMP-45";
  readonly Unknown: "Unknown";
  readonly USP: "USP-S";
  readonly World: "World";
  readonly XM1014: "XM1014";
  readonly Zeus: "Zeus x27";
};
export type WeaponName = (typeof WeaponName)[keyof typeof WeaponName];
