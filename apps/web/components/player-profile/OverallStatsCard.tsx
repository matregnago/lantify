import type { PlayerProfileDTO, PlayerRankingDTO } from "@repo/contracts";
import { colorByMaxValue } from "@/lib/color-by-max-value";
import { getRankingPosByStat, type Stat } from "@/lib/ranking";
import { RankingPosition } from "../ranking/RankingPosition";
import { Card } from "../ui/card";
import { CircularChart } from "./CircularChart";
import { Field } from "./Field";
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
					<ProgressStatusRow
						statusName="K/D"
						value={profile.stats.killDeathRatio}
						formattedValue={profile.stats.killDeathRatio.toFixed(2)}
						max={1.5}
						stat="killDeathRatio" // Verifique se bate com o tipo Stat
						steamId={profile.steamId}
						playersRanking={playersRanking}
					/>
					<ProgressStatusRow
						statusName="Headshot %"
						value={profile.stats.headshotPercent}
						formattedValue={profile.stats.headshotPercent.toFixed(1) + "%"}
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
						formattedValue={profile.stats.kast.toFixed(1) + "%"}
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
							formattedValue={profile.winRate.toFixed(0) + "%"}
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
