import type { PlayerProfileDTO, PlayerRankingDTO } from "@repo/contracts";
import { colorByMaxValue } from "@/lib/color-by-max-value";
import { getRankingPosByStat, type Stat } from "@/lib/ranking";
import { RankingPosition } from "../ranking/RankingPosition";
import { Card } from "../ui/card";
import { CircularChart } from "./CircularChart";
import { Field } from "./Field";
import { MainStatsProgress } from "./MainStatsProgress";
import { ProgressStatus } from "./ProgressStatus";

interface ProgressStatusRowProps {
	statusName: string;
	value: number;
	formattedValue: string;
	max: number;
	stat: Stat;
	steamId: string;
	playersRanking: PlayerRankingDTO[];
}

export const ProgressStatusRow = ({
	statusName,
	value,
	formattedValue,
	max,
	stat,
	playersRanking,
	steamId,
}: ProgressStatusRowProps) => {
	const rankingPosition = getRankingPosByStat(steamId, playersRanking, stat);

	return (
		<div className="flex flex-row gap-4 justify-center items-center">
			<div className="flex-1">
				<ProgressStatus
					statusName={statusName}
					value={value}
					formattedValue={formattedValue}
					max={max}
				/>
			</div>

			<RankingPosition isSmall position={rankingPosition} />
		</div>
	);
};

interface OverallStatsCardProps {
	profile: PlayerProfileDTO;
	playersRanking: PlayerRankingDTO[];
}

const categoriesConfig: {
	name: string;
	scoreKey: keyof PlayerProfileDTO["stats"];
	subCategories: {
		name: string;
		stat: Stat;
		min?: number;
		max: number;
		format: (val: number) => string;
		valueTransform?: (val: number) => number;
	}[];
}[] = [
	{
		name: "Entry",
		scoreKey: "entryingScore",
		subCategories: [
			{
				name: "Salvo por teammate por round",
				stat: "savedByTeammatePerRound",
				max: 0.2,
				format: (v) => v.toFixed(3),
			},
			{
				name: "Mortes tradadas por round",
				stat: "tradedDeathsPerRound",
				max: 0.2,
				format: (v) => v.toFixed(2),
			},
			{
				name: "Mortes tradadas %",
				stat: "tradedDeathsPercent",
				max: 25,
				format: (v) => `${v.toFixed(1)}%`,
			},
			{
				name: "Mortes de opening tradadas %",
				stat: "openingDeathsTradedPercent",
				max: 30,
				format: (v) => `${v.toFixed(1)}%`,
			},
			{
				name: "Assists por round",
				stat: "assistsPerRound",
				max: 0.2,
				format: (v) => v.toFixed(2),
			},
			{
				name: "Rounds suporte %",
				stat: "supportRoundsPercent",
				max: 50,
				format: (v) => v.toFixed(1),
			},
		],
	},
	{
		name: "Clutching",
		scoreKey: "clutchingScore",
		subCategories: [
			{
				name: "Pontos de clutch por round",
				stat: "clutchPointsPerRound",
				max: 0.15,
				format: (v) => v.toFixed(3),
			},
			{
				name: "Último vivo %",
				stat: "lastAlivePercent",
				max: 20,
				format: (v) => `${v.toFixed(1)}%`,
				valueTransform: (v) => v * 100,
			},
			{
				name: "Winrate 1v1",
				stat: "oneVOneWinPercent",
				max: 70,
				format: (v) => `${v.toFixed(1)}%`,
			},
			{
				name: "Tempo vivo por round",
				stat: "timeAlivePerRoundSeconds",
				max: 120,
				format: (v) => `${v.toFixed(1)}s`,
			},
			{
				name: "Saves por round perdido %",
				stat: "savesPerRoundLossPercent",
				max: 0.12,
				format: (v) => `${v.toFixed(1)}%`,
			},
		],
	},
	{
		name: "Trading",
		scoreKey: "tradingScore",
		subCategories: [
			{
				name: "Teammate salvo por round",
				stat: "savedTeammatePerRound",
				max: 0.16,
				format: (v) => v.toFixed(2),
			},
			{
				name: "Trade kills por round",
				stat: "tradeKillsPerRound",
				max: 0.2,
				format: (v) => v.toFixed(2),
			},
			{
				name: "Porcentagem de trade kills",
				stat: "tradeKillsPercent",
				max: 35,
				format: (v) => `${v.toFixed(1)}%`,
			},
			{
				name: "Kills assistidas %",
				stat: "assistedKillsPercent",
				max: 40,
				format: (v) => v.toFixed(1),
			},
			{
				name: "Dano por kill",
				stat: "damagePerKill",
				max: 200,
				format: (v) => v.toFixed(0),
			},
		],
	},
	{
		name: "Sniping",
		scoreKey: "snipingScore",
		subCategories: [
			{
				name: "Sniper Kills por round",
				stat: "sniperKillsPerRound",
				max: 0.3,
				format: (v) => v.toFixed(2),
			},
			{
				name: "Sniper Kills %",
				stat: "sniperKillsPercent",
				max: 15,
				format: (v) => `${v.toFixed(1)}%`,
			},
			{
				name: "Rounds com Sniper Kills %",
				stat: "roundsWithSniperKillsPercent",
				max: 20,
				format: (v) => `${v.toFixed(1)}%`,
			},
			{
				name: "Sniper Multi-Kill Rounds por round",
				stat: "sniperMultiKillRoundsPerRound",
				max: 0.05,
				format: (v) => v.toFixed(3),
			},
			{
				name: "Sniper Opening Kills por round",
				stat: "sniperOpeningKillsPerRound",
				max: 0.05,
				format: (v) => v.toFixed(3),
			},
		],
	},
	{
		name: "Utilitários",
		scoreKey: "utilityScore",
		subCategories: [
			{
				name: "Dano de utilitário por round",
				stat: "utilityDamagePerRound",
				max: 10,
				format: (v) => v.toFixed(2),
			},
			{
				name: "Kill de utilitário por 100 rounds",
				stat: "utilityKillsPer100Rounds",
				max: 1,
				format: (v) => v.toFixed(2),
			},
			{
				name: "Flashes lançadas por round",
				stat: "flashesThrownPerRound",
				max: 1,
				format: (v) => v.toFixed(2),
			},
			{
				name: "Flash assists por round",
				stat: "flashAssistsPerRound",
				max: 0.08,
				format: (v) => v.toFixed(3),
			},
			{
				name: "Tempo de oponentes cegos por round",
				stat: "timeOpponentsFlashedPerRoundSeconds",
				max: 6.5,
				format: (v) => v.toFixed(2),
			},
		],
	},
];

export const OverallStatsCard = ({
	profile,
	playersRanking,
}: OverallStatsCardProps) => {
	return (
		<Field title="Estatísticas Gerais">
			<div className="flex flex-col lg:flex-row gap-6">
				<div className="flex flex-col gap-4 w-full lg:w-[50%]">
					{categoriesConfig.map((category) => (
						<MainStatsProgress
							key={category.name}
							category={{
								name: category.name,
								value: (profile.stats[category.scoreKey] as number) ?? 0,
								subCategories: category.subCategories.map((sub) => {
									const rawValue = (profile.stats[sub.stat] as number) ?? 0;
									const value = sub.valueTransform
										? sub.valueTransform(rawValue)
										: rawValue;
									return {
										name: sub.name,
										value,
										formattedValue: sub.format(rawValue),
										min: sub.min ?? 0,
										max: sub.max,
										stat: sub.stat,
										position: getRankingPosByStat(
											profile.steamId,
											playersRanking,
											sub.stat,
										),
									};
								}),
							}}
						/>
					))}
				</div>

				<div className="flex flex-row items-center gap-4 justify-evenly w-full lg:w-[50%]">
					<Card>
						<CircularChart
							color={colorByMaxValue(profile.winRate, 100)}
							value={profile.winRate}
							label="Taxa de vitória"
							max={100}
							formattedValue={`${profile.winRate.toFixed(0)}%`}
						/>
					</Card>
					<Card>
						<CircularChart
							color={colorByMaxValue(profile.stats.rating2, 1.5)}
							value={profile.stats.rating2}
							formattedValue={profile.stats.rating2.toFixed(2)}
							label="Rating 2.0"
							max={1.5}
						/>
					</Card>
				</div>
			</div>
		</Field>
	);
};
