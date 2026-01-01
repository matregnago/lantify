export const colorByMaxValue = (value: number, maxValue: number): string => {
	const percentage = (value / maxValue) * 100;
	if (percentage >= 90) {
		return "#22c55e"; // verde escuro
	} else if (percentage >= 75) {
		return "#4ade80"; // verde
	} else if (percentage >= 60) {
		return "#84cc16"; // verde-amarelado
	} else if (percentage >= 50) {
		return "#facc15"; // amarelo
	} else if (percentage >= 40) {
		return "#fb923c"; // laranja claro
	} else if (percentage >= 35) {
		return "#ea580c"; // laranja escuro
	} else if (percentage >= 25) {
		return "#dc2626"; // vermelho claro
	} else {
		return "#991b1b"; // vermelho escuro
	}
};
