import type { PlayerRankingDTO, PlayerStatsDTO } from "@repo/contracts";

export type Stat = keyof PlayerStatsDTO;
export function sortRankingByStat(
	playersStats: PlayerRankingDTO[],
	statToSort: Stat,
	invert?: boolean,
) {
	return [...playersStats].sort((a, b) => {
		const rawA = a.stats[statToSort] as number;
		const rawB = b.stats[statToSort] as number;
		const statA = Number.isFinite(rawA)
			? rawA
			: invert
				? Number.POSITIVE_INFINITY
				: Number.NEGATIVE_INFINITY;
		const statB = Number.isFinite(rawB)
			? rawB
			: invert
				? Number.POSITIVE_INFINITY
				: Number.NEGATIVE_INFINITY;

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
		const raw = player.stats[statToSort] as number;
		const value = Number.isFinite(raw) ? raw : null;

		if (prevValue !== null && value !== prevValue) {
			rank = i + 1;
		}

		if (player.steamId === steamId) return rank;

		prevValue = value;
		i++;
	}

	return 0;
}

export function getRankingPositionColor(
	position: number,
	playerAmount: number,
) {
	if (position === 1) return "#f5c542"; // muted gold
	if (position === 2) return "#cbd5e1"; // steel silver
	if (position === 3) return "#d97745"; // soft bronze

	const p = position / playerAmount;

	if (p <= 0.35) return "#22a06b"; // deep green
	if (p <= 0.5) return "#3b82f6"; // calm blue
	if (p <= 0.75) return "#6366f1"; // indigo
	if (p <= 0.9) return "#64748b"; // slate

	return "#334155"; // near-invisible
}
