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
		killsPerRound: {
			min: 0,
			max: 0,
		},
		rating2: {
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
		savedByTeammatePerRound: {
			min: 0,
			max: 0.2,
		},
		tradedDeathsPerRound: {
			min: 0,
			max: 0.2,
		},
		tradedDeathsPercent: {
			min: 0,
			max: 25,
		},
		openingDeathsTradedPercent: {
			min: 0,
			max: 30,
		},
		assistsPerRound: {
			min: 0,
			max: 0.2,
		},
		supportRoundsPercent: {
			min: 0,
			max: 50,
		},
		tradingScore: {
			min: 0,
			max: 100,
		},
		savedTeammatePerRound: {
			min: 0,
			max: 0.16,
		},
		tradeKillsPerRound: {
			min: 0,
			max: 0.2,
		},
		tradeKillsPercent: {
			min: 0,
			max: 35,
		},
		assistedKillsPercent: {
			min: 0,
			max: 40,
		},
		damagePerKill: {
			min: 0,
			max: 200,
		},
		clutchingScore: {
			min: 0,
			max: 100,
		},
		clutchPointsPerRound: {
			min: 0,
			max: 0.15,
		},
		lastAlivePercent: {
			min: 0,
			max: 20,
		},
		oneVOneWinPercent: {
			min: 0,
			max: 70,
		},
		timeAlivePerRoundSeconds: {
			min: 0,
			max: 120,
		},
		savesPerRoundLossPercent: {
			min: 0,
			max: 0.12,
		},
		snipingScore: {
			min: 0,
			max: 100,
		},
		sniperKillsPerRound: {
			min: 0,
			max: 0.3,
		},
		sniperKillsPercent: {
			min: 0,
			max: 15,
		},
		roundsWithSniperKillsPercent: {
			min: 0,
			max: 20,
		},
		sniperMultiKillRoundsPerRound: {
			min: 0,
			max: 0.05,
		},
		sniperOpeningKillsPerRound: {
			min: 0,
			max: 0.05,
		},
		utilityScore: {
			min: 0,
			max: 100,
		},
		utilityDamagePerRound: {
			min: 0,
			max: 10,
		},
		utilityKillsPer100Rounds: {
			min: 0,
			max: 1,
		},
		flashesThrownPerRound: {
			min: 0,
			max: 1,
		},
		flashAssistsPerRound: {
			min: 0,
			max: 0.08,
		},
		timeOpponentsFlashedPerRoundSeconds: {
			min: 0,
			max: 6.5,
		},
	};
