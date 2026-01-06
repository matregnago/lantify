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

const ProgressStatusRow = ({
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

export const OverallStatsCard = ({
	profile,
	playersRanking,
}: OverallStatsCardProps) => {
	return (
		<Field title="Estatísticas Gerais">
			<div className="flex flex-col lg:flex-row gap-6">
				<div className="flex flex-col gap-6 w-full lg:w-[50%]">
					<MainStatsProgress
						category={{
							name: "Sniping",
							value: profile.stats.snipingScore ?? 0,
							subCategories: [
								{
									name: "Sniper Kills por round",
									value: profile.stats.sniperKillsPerRound ?? 0,
									formattedValue: (
										profile.stats.sniperKillsPerRound ?? 0
									).toFixed(2),
									max: 0.3,
								},
								{
									name: "Sniper Kills %",
									value: profile.stats.sniperKillsPercent ?? 0,
									formattedValue: `${(profile.stats.sniperKillsPercent ?? 0).toFixed(1)}%`,
									max: 15,
								},
								{
									name: "Rounds com Sniper Kills %",
									value: profile.stats.roundsWithSniperKillsPercent ?? 0,
									formattedValue: `${(
										profile.stats.roundsWithSniperKillsPercent ?? 0
									).toFixed(1)}%`,
									max: 20,
								},
								{
									name: "Sniper Multi-Kill Rounds por round",
									value: profile.stats.sniperMultiKillRoundsPerRound ?? 0,
									formattedValue: (
										profile.stats.sniperMultiKillRoundsPerRound ?? 0
									).toFixed(3),
									max: 0.05,
								},
								{
									name: "Sniper Opening Kills por round",
									value: profile.stats.sniperOpeningKillsPerRound ?? 0,
									formattedValue: (
										profile.stats.sniperOpeningKillsPerRound ?? 0
									).toFixed(3),
									max: 0.05,
								},
							],
						}}
					/>
					<ProgressStatusRow
						statusName="Headshot %"
						value={profile.stats.headshotPercent}
						formattedValue={`${profile.stats.headshotPercent.toFixed(1)}%`}
						max={70}
						stat="headshotPercent"
						steamId={profile.steamId}
						playersRanking={playersRanking}
					/>
					<ProgressStatusRow
						statusName="ADR"
						value={profile.stats.averageDamagePerRound}
						formattedValue={profile.stats.averageDamagePerRound.toFixed(1)}
						max={120}
						stat="averageDamagePerRound"
						steamId={profile.steamId}
						playersRanking={playersRanking}
					/>
					<ProgressStatusRow
						statusName="Kills por partida"
						value={profile.stats.killsPerMatch}
						formattedValue={profile.stats.killsPerMatch.toFixed(0)}
						max={28}
						stat="killsPerMatch"
						steamId={profile.steamId}
						playersRanking={playersRanking}
					/>
					<ProgressStatusRow
						statusName="Kills por round"
						value={profile.stats.killsPerRound}
						formattedValue={profile.stats.killsPerRound.toFixed(2)}
						max={1.1}
						stat="killsPerRound"
						steamId={profile.steamId}
						playersRanking={playersRanking}
					/>
					<ProgressStatusRow
						statusName="KAST"
						value={profile.stats.kast}
						formattedValue={`${profile.stats.kast.toFixed(1)}%`}
						max={90}
						stat="kast"
						steamId={profile.steamId}
						playersRanking={playersRanking}
					/>
				</div>

				{/* Lado direito (Gráficos circulares) permanece igual */}
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
