"use server";

import { WeaponType } from "@repo/contracts/enums";
import { getStatPercentage } from "../../get-stat-percentage";
import { STATS_MIN_MAX_VALUES } from "../../stats-max-min-values";
import { getTotalRounds } from "../match";
import { getTotalKills } from "../player";
import { getOpeningAmount, getWeaponTypeStats } from "./PlayerWeaponStats";
import { calculateScore } from "./scoreCalculator";

export const getSnipingValue = async (
	steamId?: string,
	date: string = "all",
) => {
	const sniperParameters = await getSniperParameters(steamId, date);
	const sniperValue = sniperParameters.map((sniperStats) => {
		const snipingScore = calculateScore(sniperStats, "sniping");
		return { ...sniperStats, snipingScore };
	});
	return sniperValue;
};

type SnipingStatsDTO = {
	steamId: string;
	sniperKillsPerRound: number;
	sniperKillsPercent: number;
	roundsWithSniperKillsPercent: number;
	sniperMultiKillRoundsPerRound: number;
	sniperOpeningKillsPerRound: number;
};

const getSniperParameters = async (
	steamId?: string,
	date: string = "all",
): Promise<SnipingStatsDTO[]> => {
	const totalKillsPerPlayer = await getTotalKills(steamId, date);
	const sniperOpeningTotal = await getOpeningAmount(
		WeaponType.Sniper,
		steamId,
		date,
	);

	const sniperStats = await getWeaponTypeStats(
		WeaponType.Sniper,
		steamId,
		date,
	);

	const totalRoundsPerPlayer = await getTotalRounds(steamId, date);

	const sniperParameters = sniperStats.map((sniper) => {
		const totalKillsRow = totalKillsPerPlayer.find(
			(player) => player.steamId === sniper.steamId,
		);
		const opkTotal = sniperOpeningTotal.find(
			(player) => player.steamId === sniper.steamId,
		);
		const totalRoundsRow = totalRoundsPerPlayer.find(
			(player) => player.steamId === sniper.steamId,
		);

		if (!totalRoundsRow || !totalKillsRow) return null;
		const totalRounds = totalRoundsRow.totalRounds;
		const totalKills = totalKillsRow.totalKills;
		const playerSnipingStats = {
			steamId: sniper.steamId,
			snipingScore: 0,
			sniperKillsPerRound: sniper.totalKills / totalRounds,
			sniperKillsPercent: (sniper.totalKills / totalKills) * 100,
			roundsWithSniperKillsPercent:
				(sniper.totalRoundsWithKills / totalRounds) * 100,
			sniperMultiKillRoundsPerRound:
				sniper.totalRoundsWithMultiKills / totalRounds,
			sniperOpeningKillsPerRound: opkTotal
				? opkTotal.openingKills / totalRounds
				: 0,
		};
		return playerSnipingStats;
	});

	return sniperParameters.filter((param) => param !== null);
};
