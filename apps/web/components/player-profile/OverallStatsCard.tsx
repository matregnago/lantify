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
							name: "Entry",
							value: profile.stats.entryingScore ?? 0,
							subCategories: [
								{
									name: "Salvo por teammate por round",
									value: profile.stats.savedByTeammatePerRound ?? 0,
									formattedValue: (
										profile.stats.savedByTeammatePerRound ?? 0
									).toFixed(3),
									max: 0.2,
									stat: "savedByTeammatePerRound",
									position: getRankingPosByStat(
										profile.steamId,
										playersRanking,
										"savedByTeammatePerRound",
									),
								},
								{
									name: "Mortes tradadas por round",
									value: profile.stats.tradedDeathsPerRound ?? 0,
									formattedValue: (
										profile.stats.tradedDeathsPerRound ?? 0
									).toFixed(2),
									max: 0.2,
									stat: "tradedDeathsPerRound",
									position: getRankingPosByStat(
										profile.steamId,
										playersRanking,
										"tradedDeathsPerRound",
									),
								},
								{
									name: "Mortes tradadas %",
									value: profile.stats.tradedDeathsPercent ?? 0,
									formattedValue: `${(profile.stats.tradedDeathsPercent ?? 0).toFixed(1)}%`,
									max: 25,
									stat: "tradedDeathsPercent",
									position: getRankingPosByStat(
										profile.steamId,
										playersRanking,
										"tradedDeathsPercent",
									),
								},
								{
									name: "Mortes de opening tradadas %",
									value: profile.stats.openingDeathsTradedPercent ?? 0,
									formattedValue: `${(profile.stats.openingDeathsTradedPercent ?? 0).toFixed(1)}%`,
									max: 30,
									stat: "openingDeathsTradedPercent",
									position: getRankingPosByStat(
										profile.steamId,
										playersRanking,
										"openingDeathsTradedPercent",
									),
								},
								{
									name: "Assists por round",
									value: profile.stats.assistsPerRound ?? 0,
									formattedValue: (profile.stats.assistsPerRound ?? 0).toFixed(
										2,
									),
									max: 0.2,
									stat: "assistsPerRound",
									position: getRankingPosByStat(
										profile.steamId,
										playersRanking,
										"assistsPerRound",
									),
								},
								{
									name: "Rounds suporte %",
									value: profile.stats.supportRoundsPercent ?? 0,
									formattedValue: (
										profile.stats.supportRoundsPercent ?? 0
									).toFixed(1),
									max: 50,
									stat: "supportRoundsPercent",
									position: getRankingPosByStat(
										profile.steamId,
										playersRanking,
										"supportRoundsPercent",
									),
								},
							],
						}}
					/>
					<MainStatsProgress
						category={{
							name: "Trading",
							value: profile.stats.tradingScore ?? 0,
							subCategories: [
								{
									name: "Temmate salvo por round",
									value: profile.stats.savedTeammatePerRound ?? 0,
									formattedValue: (
										profile.stats.savedTeammatePerRound ?? 0
									).toFixed(2),
									max: 0.16,
									stat: "savedTeammatePerRound",
									position: getRankingPosByStat(
										profile.steamId,
										playersRanking,
										"savedTeammatePerRound",
									),
								},
								{
									name: "Trade kills por round",
									value: profile.stats.tradeKillsPerRound ?? 0,
									formattedValue: (
										profile.stats.tradeKillsPerRound ?? 0
									).toFixed(2),
									max: 0.2,
									stat: "tradeKillsPerRound",
									position: getRankingPosByStat(
										profile.steamId,
										playersRanking,
										"tradeKillsPerRound",
									),
								},
								{
									name: "Porcentagem de trade kills",
									value: profile.stats.tradeKillsPercent ?? 0,
									formattedValue: `${(profile.stats.tradeKillsPercent ?? 0).toFixed(1)}%`,
									max: 35,
									stat: "tradeKillsPercent",
									position: getRankingPosByStat(
										profile.steamId,
										playersRanking,
										"tradeKillsPercent",
									),
								},
								{
									name: "Kills assistidas %",
									value: profile.stats.assistedKillsPercent ?? 0,
									formattedValue: (
										profile.stats.assistedKillsPercent ?? 0
									).toFixed(1),
									max: 40,
									stat: "assistedKillsPercent",
									position: getRankingPosByStat(
										profile.steamId,
										playersRanking,
										"assistedKillsPercent",
									),
								},
								{
									name: "Dano por kill",
									value: profile.stats.damagePerKill ?? 0,
									formattedValue: (profile.stats.damagePerKill ?? 0).toFixed(0),
									max: 200,
									stat: "damagePerKill",
									position: getRankingPosByStat(
										profile.steamId,
										playersRanking,
										"damagePerKill",
									),
								},
							],
						}}
					/>
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
									stat: "sniperKillsPerRound",
									position: getRankingPosByStat(
										profile.steamId,
										playersRanking,
										"sniperKillsPerRound",
									),
								},
								{
									name: "Sniper Kills %",
									value: profile.stats.sniperKillsPercent ?? 0,
									formattedValue: `${(profile.stats.sniperKillsPercent ?? 0).toFixed(1)}%`,
									max: 15,
									stat: "sniperKillsPercent",
									position: getRankingPosByStat(
										profile.steamId,
										playersRanking,
										"sniperKillsPercent",
									),
								},
								{
									name: "Rounds com Sniper Kills %",
									value: profile.stats.roundsWithSniperKillsPercent ?? 0,
									formattedValue: `${(profile.stats.roundsWithSniperKillsPercent ?? 0).toFixed(1)}%`,
									max: 20,
									stat: "roundsWithSniperKillsPercent",
									position: getRankingPosByStat(
										profile.steamId,
										playersRanking,
										"roundsWithSniperKillsPercent",
									),
								},
								{
									name: "Sniper Multi-Kill Rounds por round",
									value: profile.stats.sniperMultiKillRoundsPerRound ?? 0,
									formattedValue: (
										profile.stats.sniperMultiKillRoundsPerRound ?? 0
									).toFixed(3),
									max: 0.05,
									stat: "sniperMultiKillRoundsPerRound",
									position: getRankingPosByStat(
										profile.steamId,
										playersRanking,
										"sniperMultiKillRoundsPerRound",
									),
								},
								{
									name: "Sniper Opening Kills por round",
									value: profile.stats.sniperOpeningKillsPerRound ?? 0,
									formattedValue: (
										profile.stats.sniperOpeningKillsPerRound ?? 0
									).toFixed(3),
									max: 0.05,
									stat: "sniperOpeningKillsPerRound",
									position: getRankingPosByStat(
										profile.steamId,
										playersRanking,
										"sniperOpeningKillsPerRound",
									),
								},
							],
						}}
					/>
					<MainStatsProgress
						category={{
							name: "Utilitários",
							value: profile.stats.utilityScore ?? 0,
							subCategories: [
								{
									name: "Dano de utilitário por round",
									value: profile.stats.utilityDamagePerRound ?? 0,
									formattedValue: (
										profile.stats.utilityDamagePerRound ?? 0
									).toFixed(2),
									max: 10,
									stat: "utilityDamagePerRound",
									position: getRankingPosByStat(
										profile.steamId,
										playersRanking,
										"utilityDamagePerRound",
									),
								},
								{
									name: "Kill de utilitário por 100 rounds",
									value: profile.stats.utilityKillsPer100Rounds ?? 0,
									formattedValue: (
										profile.stats.utilityKillsPer100Rounds ?? 0
									).toFixed(2),
									max: 1,
									stat: "utilityKillsPer100Rounds",
									position: getRankingPosByStat(
										profile.steamId,
										playersRanking,
										"utilityKillsPer100Rounds",
									),
								},
								{
									name: "Flashes lançadas por round",
									value: profile.stats.flashesThrownPerRound ?? 0,
									formattedValue: (
										profile.stats.flashesThrownPerRound ?? 0
									).toFixed(2),
									max: 1,
									stat: "flashesThrownPerRound",
									position: getRankingPosByStat(
										profile.steamId,
										playersRanking,
										"flashesThrownPerRound",
									),
								},
								{
									name: "Flash assists por round",
									value: profile.stats.flashAssistsPerRound ?? 0,
									formattedValue: (
										profile.stats.flashAssistsPerRound ?? 0
									).toFixed(3),
									max: 0.08,
									stat: "flashAssistsPerRound",
									position: getRankingPosByStat(
										profile.steamId,
										playersRanking,
										"flashAssistsPerRound",
									),
								},
								{
									name: "Tempo de oponentes cegos por round",
									value: profile.stats.timeOpponentsFlashedPerRoundSeconds ?? 0,
									formattedValue: (
										profile.stats.timeOpponentsFlashedPerRoundSeconds ?? 0
									).toFixed(2),
									max: 6.5,
									stat: "timeOpponentsFlashedPerRoundSeconds",
									position: getRankingPosByStat(
										profile.steamId,
										playersRanking,
										"timeOpponentsFlashedPerRoundSeconds",
									),
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
