import { WeaponType } from "@repo/contracts/enums";
import {
	and,
	avg,
	count,
	countDistinct,
	db,
	eq,
	sql,
	sum,
} from "@repo/database";
import * as s from "@repo/database/schema";
import { getTotalRounds } from "../match";
import { getTotalKills, getWeaponTypeStats } from "../player";

export const getSnipingValue = async (
	steamId?: string,
	date: string = "all",
) => {
	const sniperParameters = await getSniperParameters(steamId, date);
};

const getSniperParameters = async (steamId?: string, date: string = "all") => {
	const totalKills = await getTotalKills(steamId, date);

	const sniperKills = await getWeaponTypeStats(
		WeaponType.Sniper,
		steamId,
		date,
	);

	const totalRounds = await getTotalRounds(date);

	const sniperParameters = sniperKills.map((sniper) => {
		const total = totalKills.find(
			(player) => player.steamId === sniper.steamId,
		);
		if (!total || totalRounds === 0) return null;
		return {
			steamId: sniper.steamId,
			SniperkillPercentage: (sniper.totalKills / total?.totalKills) * 100,
			SniperKPR: sniper.totalKills / totalRounds,
		};
	});

	return sniperParameters;
};
