import type { WeaponName, WeaponType } from "@akiver/cs-demo-analyzer";
import type * as s from "@repo/database/schema";

export type PlayerMatchHistoryDTO = typeof s.players.$inferInsert & {
	team: typeof s.teams.$inferSelect | null;
	match:
		| (typeof s.matches.$inferSelect & {
				teams: (typeof s.teams.$inferSelect)[];
		  })
		| null;
};

export type { WeaponName, WeaponType };

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

	// firepowerScore: number;
	// killsPerRoundWin: number;
	// damagePerRoundWin: number;
	// roundsWithAKillPercent: number;
	// roundsWithAMultiKillPercent: number;
	// pistolRoundRating: number;

	// enteringScore: number;
	// savedByTeammatePerRound: number;
	// tradedDeathsPerRound: number;
	// tradedDeathsPercent: number;
	// openingDeathsTradedPercent: number;
	// assistsPerRound: number;
	// supportRoundsPercent: number;

	// tradingScore: number;
	// savedTeammatePerRound: number;
	// tradeKillsPerRound: number;
	// tradeKillsPercent: number;
	// assistedKillsPercent: number;
	// damagePerKill: number;

	// openingScore: number;
	// openingKillsPerRound: number;
	// openingDeathsPerRound: number;
	// openingAttemptsPercent: number;
	// openingSuccessPercent: number;
	// winPercentAfterOpeningKill: number;
	// attacksPerRound: number;

	// clutchingScore: number;
	// clutchPointsPerRound: number;
	// lastAlivePercent: number;
	// oneVOneWinPercent: number;
	// timeAlivePerRoundSeconds: number;
	// savesPerRoundLossPercent: number;

	snipingScore: number;
	sniperKillsPerRound: number;
	sniperKillsPercent: number;
	roundsWithSniperKillsPercent: number;
	sniperMultiKillRoundsPerRound: number;
	sniperOpeningKillsPerRound: number;

	utilityScore: number;
	utilityDamagePerRound: number;
	utilityKillsPer100Rounds: number;
	flashesThrownPerRound: number;
	flashAssistsPerRound: number;
	timeOpponentsFlashedPerRoundSeconds: number;
};

export type PlayerProfileDTO = {
	steamId: string;

	nickName?: string | null;
	avatarUrl?: string | null;

	stats: PlayerStatsDTO;

	matchHistory: PlayerMatchHistoryDTO[];

	clutches: ClutchDTO[];

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
	clutches: ClutchDTO[];
};

export type ClutchDTO = typeof s.clutches.$inferSelect;
