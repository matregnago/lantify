export const labelByMaxValue = (value: number, maxValue: number): string => {
	const percentage = (value / maxValue) * 100;
	if (percentage >= 90) {
		return "Excelente"; // verde escuro
	} else if (percentage >= 75) {
		return "Ótimo"; // verde
	} else if (percentage >= 60) {
		return "Bom"; // verde-amarelado
	} else if (percentage >= 50) {
		return "Ok"; // amarelo
	} else if (percentage >= 40) {
		return "Ruim"; // laranja claro
	} else if (percentage >= 35) {
		return "Péssimo"; // laranja escuro
	} else if (percentage >= 25) {
		return "Terrível"; // vermelho claro
	} else {
		return "Desastroso"; // vermelho escuro
	}
};
