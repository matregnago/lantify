import { useState } from "react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ProgressStatus } from "./ProgressStatus";

type SubCategory = {
	name: string;
	value: number;
	formattedValue: string;
	max: number;
};

type MainCategory = {
	name: string;
	value: number;
	subCategories: SubCategory[];
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
					<div className="flex flex-row gap-2">
						<div className="flex-1">
							<ProgressStatus
								statusName={category.name}
								value={category.value}
								formattedValue={`${category.value.toFixed(0)} / 100`}
								max={100}
							/>
						</div>

						<div className="text-xs">{isOpen ? "▲" : "▼"}</div>
					</div>
				</CollapsibleTrigger>
				<CollapsibleContent className="px-4">
					<div className="flex flex-col gap-4">
						{category.subCategories.map((subCategory) => (
							<ProgressStatus
								key={subCategory.name}
								statusName={subCategory.name}
								value={subCategory.value}
								formattedValue={subCategory.formattedValue}
								max={subCategory.max}
							/>
						))}
					</div>
				</CollapsibleContent>
			</Collapsible>
		</div>
	);
}
