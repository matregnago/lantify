import type { ClutchDTO } from "@repo/contracts";

interface ClutchCardProps {
	clutch: ClutchDTO;
}

const getClutchResult = (clutch: ClutchDTO) => {
	if (clutch.hasWon) return "Venceu";
	else if (clutch.clutcherSurvived) return "Guardou";
	else return "Perdeu";
};

const resultStyle = (result: string) => {
	if (result === "Venceu") return "border-green-500 text-green-300";
	else if (result === "Guardou") return "border-yellow-500 text-yellow-300";
	else return "border-red-500 text-red-300";
};

const cardStyle = (result: string) => {
	if (result === "Venceu") return "border-green-500 bg-green-950/40 text-white";
	else if (result === "Guardou")
		return "border-yellow-500 bg-yellow-950/40 text-white";
	else return "border-red-500 bg-red-950/40 text-white";
};

export const ClutchCard = ({ clutch }: ClutchCardProps) => {
	const result = getClutchResult(clutch);
	return (
		<div
			className={`border ${cardStyle(result)} rounded-none aspect-square w-22 pb-0`}
		>
			<div className="pb-1">
				<div className="flex flex-col gap-0.5 text-center">
					<span className="text-sm text-semibold">
						1v{clutch.opponentCount}
					</span>
					<span className="text-sm text-semibold">
						💀{clutch.clutcherKillCount}
					</span>
					<span className="text-xs">Round {clutch.roundNumber}</span>
				</div>
			</div>
			<div
				className={`border-t ${resultStyle(result)} pt-0 pb-0 flex justify-center`}
			>
				<span className="font-semibold text-center text-sm">{result}</span>
			</div>
		</div>
	);
};
