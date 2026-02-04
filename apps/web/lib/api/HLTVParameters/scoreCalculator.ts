import { getStatPercentage } from "@/lib/get-stat-percentage";
import { STATS_MIN_MAX_VALUES } from "@/lib/stats-max-min-values";
import { SCORE_CONFIG, type ScoreKey, type StatKey } from "./scoreWeight";

type AnyStats = Record<string, unknown>;

export function calculateScore<T extends AnyStats>(
	playerStats: T,
	scoreKey: ScoreKey,
): number {
	const cfg = SCORE_CONFIG[scoreKey];

	let weightedSum = 0;
	let weightSum = 0;

	for (const [stat, meta] of Object.entries(cfg) as [
		StatKey,
		{ weight: number; invert?: boolean },
	][]) {
		const raw = playerStats[stat];
		if (typeof raw !== "number" || !Number.isFinite(raw) || meta.weight <= 0)
			continue;

		const { min, max } = STATS_MIN_MAX_VALUES[stat];
		const pct = getStatPercentage(Number(raw), min, max, meta.invert ?? false);

		weightedSum += pct * meta.weight;
		weightSum += meta.weight;
	}

	return weightSum === 0 ? 0 : weightedSum / weightSum;
}
