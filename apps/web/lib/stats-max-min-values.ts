import type { PlayerStatsDTO } from "@repo/contracts";

type Stat = keyof PlayerStatsDTO;

export const STATS_MIN_MAX_VALUES: Record<Stat, { min: number; max: number }> =
	{
		killDeathRatio: { min: 0, max: 5 },
		steamId: {
			min: 0,
			max: 0,
		},
		headshotPercent: {
			min: 0,
			max: 0,
		},
		totalMatches: {
			min: 0,
			max: 0,
		},
		killsPerMatch: {
			min: 0,
			max: 0,
		},

		totalKills: {
			min: 0,
			max: 0,
		},
		totalDeaths: {
			min: 0,
			max: 0,
		},
		totalAssists: {
			min: 0,
			max: 0,
		},
		totalHeadshots: {
			min: 0,
			max: 0,
		},
		totalMvps: {
			min: 0,
			max: 0,
		},
		totalBombPlants: {
			min: 0,
			max: 0,
		},
		totalBombDefuses: {
			min: 0,
			max: 0,
		},
		totalMultiKills: {
			min: 0,
			max: 0,
		},
		totalFirstKills: {
			min: 0,
			max: 0,
		},
		totalFirstDeaths: {
			min: 0,
			max: 0,
		},
		utilityDamage: {
			min: 0,
			max: 0,
		},
		kast: {
			min: 0,
			max: 0,
		},
		averageDamagePerRound: {
			min: 0,
			max: 0,
		},
		averageDeathPerRound: {
			min: 0,
			max: 0,
		},
		entryingScore: {
			min: 0,
			max: 100,
		},
		tradingScore: {
			min: 0,
			max: 100,
		},
		openingScore: {
			min: 0,
			max: 100,
		},
		clutchingScore: {
			min: 0,
			max: 100,
		},
		snipingScore: {
			min: 0,
			max: 100,
		},
		utilityScore: {
			min: 0,
			max: 100,
		},
		firePowerScore: {
			min: 0,
			max: 100,
		},

		// firepower (HLTV-ish starting ranges)
		killsPerRound: { min: 0.55, max: 0.95 },
		killsPerRoundWin: { min: 0.7, max: 1.25 },
		damagePerRound: { min: 60, max: 95 },
		damagePerRoundWin: { min: 70, max: 120 },
		roundsWithKillPercent: { min: 40, max: 58 },
		roundsWithMultiKillPercent: { min: 10, max: 25 },
		rating2: { min: 0.9, max: 1.3 },
		pistolRoundRating2: { min: 0.7, max: 1.5 },

		//entrying
		savedByTeammatePerRound: { min: 0.06, max: 0.16 },
		tradedDeathsPerRound: { min: 0.08, max: 0.2 },
		tradedDeathsPercent: { min: 13, max: 24 },
		openingDeathsTradedPercent: { min: 15, max: 35 },
		assistsPerRound: { min: 0.1, max: 0.35 },
		supportRoundsPercent: { min: 10, max: 35 },

		//trading
		savedTeammatePerRound: { min: 0.05, max: 0.16 },
		tradeKillsPerRound: { min: 0.07, max: 0.2 },
		tradeKillsPercent: { min: 11, max: 35 },
		assistedKillsPercent: { min: 10, max: 27 },
		damagePerKill: { min: 95, max: 120 },

		//opening
		openingKillsPerRound: { min: 0.05, max: 0.16 },
		openingDeathsPerRound: { min: 0.06, max: 0.15 },
		openingAttemptsPercent: { min: 13, max: 26 },
		openingSuccessPercent: { min: 40, max: 65 },
		winPercentAfterOpeningKill: { min: 60, max: 80 },
		attacksPerRound: { min: 1.7, max: 3.5 },

		clutchPointsPerRound: { min: 0.01, max: 0.04 },
		lastAlivePercent: { min: 5, max: 17 },
		oneVOneWinPercent: { min: 40, max: 75 },
		timeAlivePerRoundSeconds: { min: 50, max: 75 },
		savesPerRoundLossPercent: { min: 0, max: 13 },

		//sniping
		sniperKillsPerRound: { min: 0, max: 0.5 },
		sniperKillsPercent: { min: 0, max: 65 },
		roundsWithSniperKillsPercent: { min: 0, max: 25 },
		sniperMultiKillRoundsPerRound: { min: 0.0, max: 0.13 },
		sniperOpeningKillsPerRound: { min: 0.0, max: 0.11 },

		//utility
		utilityDamagePerRound: { min: 2, max: 6.5 },
		utilityKillsPer100Rounds: { min: 0, max: 1.2 },
		flashesThrownPerRound: { min: 0.2, max: 0.9 },
		flashAssistsPerRound: { min: 0, max: 0.09 },
		timeOpponentsFlashedPerRoundSeconds: { min: 1.5, max: 2.5 },
	};
