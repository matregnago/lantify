import type { ClutchDTO } from "@repo/contracts";
import { Progress } from "../../ui/progress";

interface ClutchProgressProps {
	clutches: ClutchDTO[];
}

export const ClutchProgress = ({ clutches }: ClutchProgressProps) => {
	if (!clutches) {
		return;
	}
	const winsTotal = clutches.filter((c) => c.hasWon).length;
	const winRate = Math.round((winsTotal / clutches.length) * 100);
	const saveTotal = clutches.filter(
		(c) => c.clutcherSurvived && !c.hasWon,
	).length;
	const lossTotal = clutches.length - winsTotal;

	const lossRate = 100 - winRate;

	return (
		<div className="flex flex-col gap-1 px-4">
			<div className="flex flex-row justify-between">
				<p className="text-green-400 text-lg">{winRate}%</p>
				<p className="text-red-400 text-lg">{lossRate}%</p>
			</div>
			<Progress className="[&>div]:bg-green-400" value={winRate} />
			<div className="flex flex-row items-start justify-between">
				<p className="text-gray-400">
					{winsTotal} {winsTotal === 1 ? "Clutch Ganho" : "Clutches Ganhos"}
				</p>
				<div className="flex flex-col items-end text-right">
					<p className="text-gray-400">
						{lossTotal}{" "}
						{lossTotal === 1 ? "Clutch Perdido" : "Clutches Perdidos"}
					</p>
					<p className="text-yellow-400">
						{saveTotal} {saveTotal === 1 ? "Save" : "Saves"}
					</p>
				</div>
			</div>
		</div>
	);
};
