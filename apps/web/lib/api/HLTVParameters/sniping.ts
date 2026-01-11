"use server";

import { WeaponType } from "@repo/contracts/enums";
import { getStatPercentage } from "../../get-stat-percentage";
import { STATS_MIN_MAX_VALUES } from "../../stats-max-min-values";
import { getTotalRounds } from "../match";
import { getTotalKills } from "../player";
import { getOpeningAmount, getWeaponTypeStats } from "./PlayerWeaponStats";

export const getSnipingValue = async (
	steamId?: string,
	date: string = "all",
) => {
	const sniperParameters = await getSniperParameters(steamId, date);
	return sniperParameters;
};

const getSniperParameters = async (steamId?: string, date: string = "all") => {
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
		const snipingScore =
			(getStatPercentage(
				playerSnipingStats.sniperKillsPerRound,
				STATS_MIN_MAX_VALUES.sniperKillsPerRound.min,
				STATS_MIN_MAX_VALUES.sniperKillsPerRound.max,
			) +
				getStatPercentage(
					playerSnipingStats.sniperKillsPercent,
					STATS_MIN_MAX_VALUES.sniperKillsPercent.min,
					STATS_MIN_MAX_VALUES.sniperKillsPercent.max,
				) +
				getStatPercentage(
					playerSnipingStats.roundsWithSniperKillsPercent,
					STATS_MIN_MAX_VALUES.roundsWithSniperKillsPercent.min,
					STATS_MIN_MAX_VALUES.roundsWithSniperKillsPercent.max,
				) +
				getStatPercentage(
					playerSnipingStats.sniperMultiKillRoundsPerRound,
					STATS_MIN_MAX_VALUES.sniperMultiKillRoundsPerRound.min,
					STATS_MIN_MAX_VALUES.sniperMultiKillRoundsPerRound.max,
				) +
				getStatPercentage(
					playerSnipingStats.sniperOpeningKillsPerRound,
					STATS_MIN_MAX_VALUES.sniperOpeningKillsPerRound.min,
					STATS_MIN_MAX_VALUES.sniperOpeningKillsPerRound.max,
				)) /
			5;

		return {
			...playerSnipingStats,
			snipingScore,
		};
	});

	return sniperParameters.filter((param) => param !== null);
};
