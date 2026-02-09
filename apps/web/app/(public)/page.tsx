import type { MatchDTO } from "@repo/contracts";
import Image from "next/image";
import { MatchPreview } from "@/components/match-list/MatchPreview";
import { listMatchesWithPlayers } from "@/lib/api/match";
import { findTeams } from "@/lib/api/series";
import { diffColor } from "@/lib/diff-color";

export const dynamic = "force-dynamic";

export default async function Home() {
	const matches: MatchDTO[] = await listMatchesWithPlayers();

	const matchMapByMonth = new Map<string, MatchDTO[]>();

	matches.forEach((match) => {
		const month = new Date(match.date).toLocaleString("en-GB", {
			month: "short",
			year: "numeric",
		});

		if (!matchMapByMonth.get(month)) {
			matchMapByMonth.set(month, [match]);
		} else {
			const currentMatchList = matchMapByMonth.get(month) as MatchDTO[];
			matchMapByMonth.set(month, [...currentMatchList, match]);
		}
	});
	const matchMapEntries = await Promise.all(
		Array.from(matchMapByMonth.entries()).map(async ([month, matchList]) => {
			const seriesTeam = await findTeams(matchList);

			return {
				month,
				matchList,
				seriesTeam,
			};
		}),
	);

	return (
		<div className="max-w-7xl mx-auto py-12">
			<h1 className="text-4xl font-bold text-center md:text-left">Partidas</h1>
			{matches.length === 0 && (
				<p className="text-center md:text-left mt-4 text-muted-foreground">
					Nenhuma partida encontrada.
				</p>
			)}
			<div className="flex flex-col gap-12">
				{matchMapEntries.map(({ month, matchList, seriesTeam }) => (
					<div className="flex flex-col mt-8 md:gap-4 gap-8" key={month}>
						<div className="mx-4 md:mx-4">
							<div className="hidden md:grid grid-cols-[10rem_1fr_10rem] items-center mx-12">
								<div className="w-40">
									<p className="capitalize text-2xl border-b pb-2 mb-2">
										{month}
									</p>
								</div>
								<div className="flex justify-center">
									<div className="rounded-lg p-2">
										<div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
											<div className="flex justify-end gap-2 overflow-hidden">
												{seriesTeam?.teamA.players?.map((player) => (
													<Image
														key={player.steamId}
														src={player.avatarUrl || "/default-avatar.png"}
														width={32}
														height={32}
														alt={player.name}
														className="rounded-full border border-gray-700"
													/>
												))}
											</div>
											<div className="flex items-center gap-2 px-2">
												<div
													className={`text-xl font-bold ${diffColor(
														seriesTeam.teamA.score - seriesTeam.teamB.score,
													)}`}
												>
													{seriesTeam.teamA.score}
												</div>
												<div className="text-xs font-bold text-gray-400">
													VS
												</div>
												<div
													className={`text-xl font-bold ${diffColor(
														seriesTeam.teamB.score - seriesTeam.teamA.score,
													)}`}
												>
													{seriesTeam.teamB.score}
												</div>
											</div>

											<div className="flex justify-start gap-2 overflow-hidden">
												{seriesTeam?.teamB.players?.map((player) => (
													<Image
														key={player.steamId}
														src={player.avatarUrl || "/default-avatar.png"}
														width={32}
														height={32}
														alt={player.name}
														className="rounded-full border border-gray-700"
													/>
												))}
											</div>
										</div>
									</div>
								</div>

								<div className="w-40" />
							</div>
							<div className="md:hidden flex flex-col gap-3 mx-4">
								<p className="capitalize text-2xl border-b pb-2">{month}</p>

								<div className="rounded-lg flex items-center gap-2 p-2">
									<div className="flex justify-end gap-2 overflow-hidden">
										{seriesTeam?.teamA.players?.map((player) => (
											<Image
												key={player.steamId}
												src={player.avatarUrl || "/default-avatar.png"}
												width={28}
												height={28}
												alt={player.name}
												className="rounded-full border border-gray-700"
											/>
										))}
									</div>

									<div className="flex items-center gap-2 px-2">
										<div
											className={`text-xl font-bold ${diffColor(seriesTeam.teamA.score - seriesTeam.teamB.score)}`}
										>
											{seriesTeam.teamA.score}
										</div>
										<div className="text-xs font-bold text-gray-400">VS</div>
										<div
											className={`text-xl font-bold ${diffColor(seriesTeam.teamB.score - seriesTeam.teamA.score)}`}
										>
											{seriesTeam.teamB.score}
										</div>
									</div>

									<div className="flex justify-start gap-2 overflow-hidden">
										{seriesTeam?.teamB.players?.map((player) => (
											<Image
												key={player.steamId}
												src={player.avatarUrl || "/default-avatar.png"}
												width={28}
												height={28}
												alt={player.name}
												className="rounded-full border border-gray-700"
											/>
										))}
									</div>
								</div>
							</div>
						</div>
						{matchList.map((match) => (
							<div key={match.id}>
								<MatchPreview
									match={match}
									teamA0={seriesTeam.teamA.players}
									teamB0={seriesTeam.teamB.players}
								/>
							</div>
						))}
					</div>
				))}
			</div>
		</div>
	);
}
