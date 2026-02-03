import type { PlayerProfileDTO, PlayerRankingDTO } from "@repo/contracts";
import { colorByMaxValue } from "@/lib/color-by-max-value";
import { getRankingPosByStat, type Stat } from "@/lib/ranking";
import { STATS_MIN_MAX_VALUES } from "@/lib/stats-max-min-values";
import type { SubCategoryResolved } from "@/lib/subCategory";
import { sc } from "@/lib/subCategory";
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
	subCategories: SubCategoryResolved[];
}[] = [
	{
		name: "Firepower",
		scoreKey: "firePowerScore",
		subCategories: [
			sc({
				name: "Kills por round",
				stat: "killsPerRound",
				format: (v) => v.toFixed(2),
			}),
			sc({
				name: "Kills por round (vitória)",
				stat: "killsPerRoundWin",
				format: (v) => v.toFixed(2),
			}),
			sc({
				name: "Damage por round",
				stat: "damagePerRound",
				format: (v) => v.toFixed(1),
			}),
			sc({
				name: "Damage por round (vitória)",
				stat: "damagePerRoundWin",
				format: (v) => v.toFixed(1),
			}),
			sc({
				name: "Rounds com kill",
				stat: "roundsWithKillPercent",
				format: (v) => `${v.toFixed(1)}%`,
			}),
			sc({
				name: "Rounds com multi-kill",
				stat: "roundsWithMultiKillPercent",
				format: (v) => `${v.toFixed(1)}%`,
			}),
			sc({
				name: "Rating 2.0",
				stat: "rating2",
				format: (v) => v.toFixed(2),
			}),
		],
	},
	{
		name: "Entry",
		scoreKey: "entryingScore",
		subCategories: [
			sc({
				name: "Salvo por teammate por round",
				stat: "savedByTeammatePerRound",
				format: (v) => v.toFixed(3),
			}),
			sc({
				name: "Mortes tradadas por round",
				stat: "tradedDeathsPerRound",
				format: (v) => v.toFixed(2),
			}),
			sc({
				name: "Mortes tradadas %",
				stat: "tradedDeathsPercent",
				format: (v) => `${v.toFixed(1)}%`,
			}),
			sc({
				name: "Mortes de opening tradadas %",
				stat: "openingDeathsTradedPercent",
				format: (v) => `${v.toFixed(1)}%`,
			}),
			sc({
				name: "Assists por round",
				stat: "assistsPerRound",
				format: (v) => v.toFixed(2),
			}),
			sc({
				name: "Rounds suporte %",
				stat: "supportRoundsPercent",
				format: (v) => `${v.toFixed(1)}%`,
			}),
		],
	},
	{
		name: "Clutching",
		scoreKey: "clutchingScore",
		subCategories: [
			sc({
				name: "Pontos de clutch por round",
				stat: "clutchPointsPerRound",
				format: (v) => v.toFixed(3),
			}),
			sc({
				name: "Último vivo %",
				stat: "lastAlivePercent",
				format: (v) => `${v.toFixed(1)}%`,
				valueTransform: (v) => v * 100,
			}),
			sc({
				name: "Winrate 1v1",
				stat: "oneVOneWinPercent",
				format: (v) => `${v.toFixed(1)}%`,
			}),
			sc({
				name: "Tempo vivo por round",
				stat: "timeAlivePerRoundSeconds",
				format: (v) => `${v.toFixed(1)}s`,
			}),
			sc({
				name: "Saves por round perdido %",
				stat: "savesPerRoundLossPercent",
				format: (v) => `${v.toFixed(1)}%`,
			}),
		],
	},
	{
		name: "Trading",
		scoreKey: "tradingScore",
		subCategories: [
			sc({
				name: "Teammate salvo por round",
				stat: "savedTeammatePerRound",
				format: (v) => v.toFixed(2),
			}),
			sc({
				name: "Trade kills por round",
				stat: "tradeKillsPerRound",
				format: (v) => v.toFixed(2),
			}),
			sc({
				name: "Porcentagem de trade kills",
				stat: "tradeKillsPercent",
				format: (v) => `${v.toFixed(1)}%`,
			}),
			sc({
				name: "Kills assistidas %",
				stat: "assistedKillsPercent",
				format: (v) => v.toFixed(1),
			}),
			sc({
				name: "Dano por kill",
				stat: "damagePerKill",
				format: (v) => v.toFixed(0),
			}),
		],
	},
	{
		name: "Opening",
		scoreKey: "openingScore",
		subCategories: [
			sc({
				name: "Opening kills por round",
				stat: "openingKillsPerRound",
				format: (v: number) => v.toFixed(2),
			}),
			sc({
				name: "Opening deaths por round",
				stat: "openingDeathsPerRound",
				invert: true,
				format: (v: number) => v.toFixed(2),
			}),
			sc({
				name: "Tentativas de opening",
				stat: "openingAttemptsPercent",
				format: (v: number) => `${v.toFixed(1)}%`,
			}),
			sc({
				name: "Sucesso na Opening",
				stat: "openingSuccessPercent",
				format: (v: number) => `${v.toFixed(1)}%`,
			}),
			sc({
				name: "Win % após opening kill",
				stat: "winPercentAfterOpeningKill",
				format: (v: number) => `${v.toFixed(1)}%`,
			}),
		],
	},

	{
		name: "Sniping",
		scoreKey: "snipingScore",
		subCategories: [
			sc({
				name: "Sniper Kills por round",
				stat: "sniperKillsPerRound",
				format: (v) => v.toFixed(2),
			}),
			sc({
				name: "Sniper Kills %",
				stat: "sniperKillsPercent",
				format: (v) => `${v.toFixed(1)}%`,
			}),
			sc({
				name: "Rounds com Sniper Kills %",
				stat: "roundsWithSniperKillsPercent",
				format: (v) => `${v.toFixed(1)}%`,
			}),
			sc({
				name: "Sniper Multi-Kill Rounds por round",
				stat: "sniperMultiKillRoundsPerRound",
				format: (v) => v.toFixed(3),
			}),
			sc({
				name: "Sniper Opening Kills por round",
				stat: "sniperOpeningKillsPerRound",
				format: (v) => v.toFixed(3),
			}),
		],
	},
	{
		name: "Utilitários",
		scoreKey: "utilityScore",
		subCategories: [
			sc({
				name: "Dano de utilitário por round",
				stat: "utilityDamagePerRound",
				format: (v) => v.toFixed(2),
			}),
			sc({
				name: "Kill de utilitário por 100 rounds",
				stat: "utilityKillsPer100Rounds",
				format: (v) => v.toFixed(2),
			}),
			sc({
				name: "Flashes lançadas por round",
				stat: "flashesThrownPerRound",
				format: (v) => v.toFixed(2),
			}),
			sc({
				name: "Flash assists por round",
				stat: "flashAssistsPerRound",
				format: (v) => v.toFixed(3),
			}),
			sc({
				name: "Tempo de oponentes cegos por round",
				stat: "timeOpponentsFlashedPerRoundSeconds",
				format: (v) => v.toFixed(2),
			}),
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
								position: getRankingPosByStat(
									profile.steamId,
									playersRanking,
									category.scoreKey,
									false,
								),
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
										max: sub.max ?? 100,
										stat: sub.stat,
										position: getRankingPosByStat(
											profile.steamId,
											playersRanking,
											sub.stat,
											sub.invert ?? false,
										),
										invert: sub.invert,
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
