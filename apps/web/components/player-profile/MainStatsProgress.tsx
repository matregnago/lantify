import { useState } from "react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { getStatPercentage } from "@/lib/get-stat-percentage";
import type { Stat } from "@/lib/ranking";
import { RankingPosition } from "../ranking/RankingPosition";
import { ProgressStatus } from "./ProgressStatus";

type SubCategory = {
	name: string;
	value: number;
	formattedValue: string;
	min: number;
	max: number;
	stat?: Stat;
	position?: number;
	invert?: boolean;
};

type MainCategory = {
	name: string;
	value: number;
	subCategories: SubCategory[];
	position: number;
	playerAmount: number;
};

interface MainStatsProgressProps {
	category: MainCategory;
}

export function MainStatsProgress({ category }: MainStatsProgressProps) {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<div className="border rounded">
			<Collapsible open={isOpen} onOpenChange={setIsOpen}>
				<CollapsibleTrigger className="w-full hover:bg-gray-800 cursor-pointer p-4">
					<div className="flex w-full items-center gap-2">
						<div className="flex min-w-0 flex-1 items-center gap-3">
							<div className="min-w-0 flex-1">
								<ProgressStatus
									statusName={category.name}
									value={category.value}
									formattedValue={`${category.value.toFixed(0)} / 100`}
									max={100}
								/>
							</div>

							<div className="w-10 shrink-0">
								<RankingPosition
									playerAmount={category.playerAmount}
									isSmall
									position={category.position ?? 100}
								/>
							</div>
						</div>
						<div className="w-4 shrink-0 text-right text-xs">
							{isOpen ? "▲" : "▼"}
						</div>
					</div>
				</CollapsibleTrigger>
				<CollapsibleContent className="p-4">
					<div className="flex flex-col gap-4">
						{category.subCategories.map((subCategory) => (
							<div
								key={subCategory.name}
								className="flex flex-row items-center gap-4"
							>
								<div className="flex-1">
									<ProgressStatus
										statusName={subCategory.name}
										value={getStatPercentage(
											subCategory.value,
											subCategory.min,
											subCategory.max,
											subCategory.invert ?? false,
										)}
										formattedValue={subCategory.formattedValue}
										max={100}
									/>
								</div>

								<RankingPosition
									playerAmount={category.playerAmount}
									isSmall
									position={subCategory.position ? subCategory.position : 100}
								/>
							</div>
						))}
					</div>
				</CollapsibleContent>
			</Collapsible>
		</div>
	);
}
