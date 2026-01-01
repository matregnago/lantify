import { StatsCard } from "./StatsCard";

interface StatsRowProps {
	index: number;
	statName: string;
	statValue: string;
}
const StatsRow = ({ index, statName, statValue }: StatsRowProps) => {
	return (
		<div
			className={`flex flex-row justify-between ${index % 2 === 0 ? "bg-accent/50" : ""} px-4 py-2`}
		>
			<span className="text-gray-200">{statName}</span>
			<span className="font-medium">{statValue}</span>
		</div>
	);
};

interface StatsListProps {
	data: { name: string; value: string }[];
}

export const StatsList = ({ data }: StatsListProps) => {
	return (
		<StatsCard>
			<div className="flex flex-col">
				{data.map((stat, index) => (
					<StatsRow
						key={stat.name}
						index={index}
						statName={stat.name}
						statValue={stat.value}
					/>
				))}
			</div>
		</StatsCard>
	);
};
