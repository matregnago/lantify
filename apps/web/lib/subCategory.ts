import type { Stat } from "./ranking";
import { STATS_MIN_MAX_VALUES } from "./stats-max-min-values";

type StatRange = { min: number; max: number };

type SubCategoryConfigBase<S extends Stat = Stat> = {
	name: string;
	stat: S;
	format: (val: number) => string;
	valueTransform?: (val: number) => number;
	invert?: boolean;

	// optional overrides
	min?: number;
	max?: number;
};

export type SubCategoryResolved<S extends Stat = Stat> = Omit<
	SubCategoryConfigBase<S>,
	"min" | "max"
> & {
	min: number;
	max: number;
};

export const sc = <S extends Stat>(
	input: SubCategoryConfigBase<S>,
): SubCategoryResolved<S> => {
	const range: StatRange | undefined = STATS_MIN_MAX_VALUES[input.stat];
	if (!range && input.min === undefined && input.max === undefined) {
		return { ...input, min: 0, max: 100 };
	}

	return {
		...input,
		min: input.min ?? range?.min ?? 0,
		max: input.max ?? range?.max ?? 0,
	};
};
