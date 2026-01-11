export const getStatPercentage = (
	value: number,
	min: number,
	max: number,
): number => {
	if (max === min) {
		return 0;
	}
	const percetange = ((value - min) / (max - min)) * 100;
	return Math.min(Math.max(percetange, 0), 100);
};
