import { getRankingPositionColor } from "@/lib/ranking";
import { cn } from "@/lib/utils";

interface RankingPositionProps {
	position: number;
	playerAmount: number;
	isSmall?: boolean;
}

export function RankingPosition({
	position,
	playerAmount,
	isSmall = false,
}: RankingPositionProps) {
	const color = getRankingPositionColor(position, playerAmount);
	const isPodium = position <= 3;

	return (
		position > 0 && (
			<div className="flex justify-center">
				<span
					className={cn(
						"flex items-center justify-center font-semibold rounded-full",
						isSmall ? "w-7 h-5 text-xs" : "w-10 h-6 text-sm",

						isPodium ? "text-black" : "text-muted-foreground",
					)}
					style={{
						backgroundColor: isPodium ? color : `${color}44`,
					}}
				>
					#{position}
				</span>
			</div>
		)
	);
}
