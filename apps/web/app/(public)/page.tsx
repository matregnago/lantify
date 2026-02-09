import type { MatchDTO } from "@repo/contracts";
import { MatchPreview } from "@/components/match-list/MatchPreview";
import { SeriesPreview } from "@/components/match-list/SeriesPreview";
import { listMatchesWithPlayers } from "@/lib/api/match";
import { findTeams } from "@/lib/api/series";

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
						<SeriesPreview month={month} seriesTeam={seriesTeam} />
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
