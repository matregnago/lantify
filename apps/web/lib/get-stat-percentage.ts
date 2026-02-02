export const getStatPercentage = (
	value: number,
	min: number,
	max: number,
	invert = false,
): number => {
	if (max === min) {
		return 0;
	}
	const percetange = ((value - min) / (max - min)) * 100;
	const normalized = Math.min(Math.max(percetange, 0), 100);
	const result = invert ? 100 - normalized : normalized;
	return result;
};
