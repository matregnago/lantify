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
	const totalKills = await getTotalKills(steamId, date);
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

	const totalRounds = await getTotalRounds(date);

	const sniperParameters = sniperStats.map((sniper) => {
		const total = totalKills.find(
			(player) => player.steamId === sniper.steamId,
		);
		const opkTotal = sniperOpeningTotal.find(
			(player) => player.steamId === sniper.steamId,
		);
		if (!total || !opkTotal || totalRounds === 0) return null;
		return {
			steamId: sniper.steamId,
			SniperKPR: sniper.totalKills / totalRounds,
			SniperKillPC: (sniper.totalKills / total.totalKills) * 100,
			SniperKillRoundsPC: (sniper.totalRoundsWithKills / totalRounds) * 100,
			SniperMKRounds: sniper.totalRoundsWithMultiKills / totalRounds,
			sniperOpening: opkTotal.openingKills / totalRounds,
		};
	});

	return sniperParameters;
};
