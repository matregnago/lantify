import type { STATS_MIN_MAX_VALUES } from "@/lib/stats-max-min-values";

export type StatKey = keyof typeof STATS_MIN_MAX_VALUES;

export type ScoreKey =
	| "firepower"
	| "entrying"
	| "trading"
	| "opening"
	| "clutch"
	| "sniping"
	| "utility";

type StatConfig = {
	weight: number;
	invert?: boolean;
};

export type ScoreConfig = Partial<Record<StatKey, StatConfig>>;

export const SCORE_CONFIG: Record<ScoreKey, ScoreConfig> = {
	firepower: {
		killsPerRound: { weight: 1.0 },
		killsPerRoundWin: { weight: 1.0 },
		damagePerRound: { weight: 1.3 },
		damagePerRoundWin: { weight: 1.3 },
		roundsWithKillPercent: { weight: 1.3 },
		roundsWithMultiKillPercent: { weight: 1.5 },
		rating2: { weight: 1.8 },
		pistolRoundRating2: { weight: 1.3 },
	},

	entrying: {
		savedByTeammatePerRound: { weight: 1.3 },
		tradedDeathsPerRound: { weight: 1.1 },
		tradedDeathsPercent: { weight: 1.4 },
		openingDeathsTradedPercent: { weight: 2 },
		assistsPerRound: { weight: 0.4 },
		supportRoundsPercent: { weight: 1.2 },
	},

	trading: {
		savedTeammatePerRound: { weight: 1.5 },
		tradeKillsPerRound: { weight: 1.3 },
		tradeKillsPercent: { weight: 1.2 },
		assistedKillsPercent: { weight: 0.5 },
		damagePerKill: { weight: 0.9 },
	},

	opening: {
		openingKillsPerRound: { weight: 1.5 },
		openingDeathsPerRound: { weight: 1.1, invert: true },
		openingAttemptsPercent: { weight: 4 },
		openingSuccessPercent: { weight: 2 },
		winPercentAfterOpeningKill: { weight: 0.8 },
		attacksPerRound: { weight: 0.4 },
	},

	clutch: {
		clutchPointsPerRound: { weight: 3 },
		lastAlivePercent: { weight: 0.7 },
		oneVOneWinPercent: { weight: 1.5 },
		timeAlivePerRoundSeconds: { weight: 0.5 },
		savesPerRoundLossPercent: { weight: 1.0 },
	},

	sniping: {
		sniperKillsPerRound: { weight: 1.4 },
		sniperKillsPercent: { weight: 1.1 },
		roundsWithSniperKillsPercent: { weight: 0.9 },
		sniperMultiKillRoundsPerRound: { weight: 1.1 },
		sniperOpeningKillsPerRound: { weight: 3.5 },
	},

	utility: {
		utilityDamagePerRound: { weight: 2.0 },
		utilityKillsPer100Rounds: { weight: 1.5 },
		flashesThrownPerRound: { weight: 0.6 },
		flashAssistsPerRound: { weight: 1.4 },
		timeOpponentsFlashedPerRoundSeconds: { weight: 1.1 },
	},
};
