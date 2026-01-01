import type { PlayerRankingDTO, PlayerStatsDTO } from "@repo/contracts";

export type Stat = keyof PlayerStatsDTO;
export function sortRankingByStat(
	playersStats: PlayerRankingDTO[],
	statToSort: Stat,
) {
	return playersStats.sort((a, b) => {
		const statA = a.stats[statToSort] as number;
		const statB = b.stats[statToSort] as number;

		return statB - statA;
	});
}

export function getRankingPosByStat(
	steamId: string,
	playersStats: PlayerRankingDTO[],
	statToSort: Stat,
) {
	const sortedStats = sortRankingByStat(playersStats, statToSort);

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
