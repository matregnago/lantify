import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";

interface ClutchKillToolTipProps {
	kills: number;
	total: number;
}

export const ClutchKillToolTip = ({ kills, total }: ClutchKillToolTipProps) => {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<span className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-muted text-black font-semibold text-sm cursor-help">
					?
				</span>
			</TooltipTrigger>
			<TooltipContent className="bg-black border-gray-800">
				<div className="p-3 max-w-md">
					<div className="text-sm font-semibold text-white mb-2">
						Kills em Clutch
					</div>
					<p className="text-sm text-gray-300 leading-relaxed">
						O time conseguiu{" "}
						<span className="font-bold text-white">{kills}</span> de{" "}
						<span className="font-bold text-white">{total}</span> kills
						possíveis em situações de clutch.
					</p>
				</div>
			</TooltipContent>
		</Tooltip>
	);
};
