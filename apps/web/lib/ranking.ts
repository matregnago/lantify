import type { PlayerRankingDTO, PlayerStatsDTO } from "@repo/contracts";

export type Stat = keyof PlayerStatsDTO;
export function sortRankingByStat(
	playersStats: PlayerRankingDTO[],
	statToSort: Stat,
	invert?: boolean,
) {
	return [...playersStats].sort((a, b) => {
		const statA = a.stats[statToSort] as number;
		const statB = b.stats[statToSort] as number;

		const diff = invert ? statA - statB : statB - statA;
		if (diff !== 0) return diff;

		return a.steamId.localeCompare(b.steamId);
	});
}

export function getRankingPosByStat(
	steamId: string,
	playersStats: PlayerRankingDTO[],
	statToSort: Stat,
	invert?: boolean,
) {
	if (playersStats.length === 0) return 0;

	const sorted = sortRankingByStat(playersStats, statToSort, invert);

	let rank = 1;
	let prevValue: number | null = null;
	let i = 0;

	for (const player of sorted) {
		const value = player.stats[statToSort] as number;

		if (prevValue !== null && value !== prevValue) {
			rank = i + 1;
		}

		if (player.steamId === steamId) return rank;

		prevValue = value;
		i++;
	}

	return 0;
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
