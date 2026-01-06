"use server";

import { WeaponType } from "@repo/contracts/enums";
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
		return {
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
	});

	return sniperParameters;
};
