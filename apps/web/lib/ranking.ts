import type { PlayerRankingDTO, PlayerStatsDTO } from "@repo/contracts";

export type Stat = keyof PlayerStatsDTO;
export function sortRankingByStat(
	playersStats: PlayerRankingDTO[],
	statToSort: Stat,
	invert?: boolean,
) {
	return playersStats.sort((a, b) => {
		const statA = a.stats[statToSort] as number;
		const statB = b.stats[statToSort] as number;
		return invert ? statA - statB : statB - statA;
	});
}

export function getRankingPosByStat(
	steamId: string,
	playersStats: PlayerRankingDTO[],
	statToSort: Stat,
	invert?: boolean,
) {
	const sortedStats = sortRankingByStat(playersStats, statToSort, invert);

	return sortedStats.findIndex((player) => player.steamId === steamId) + 1;
}

export function getRankingPositionColor(position: number) {
	switch (position) {
		case 1:
			return "#ffd336";
		case 2:
			return "#def5ff";
		case 3:
			return "#ff7236";
		default:
			return "transparent";
	}
}
