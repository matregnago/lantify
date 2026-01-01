"use server";
import type { MatchDTO } from "@repo/contracts";
import { MatchPreview } from "@/components/match-list/MatchPreview";
import { listMatches } from "@/lib/api/match";

export default async function Home() {
	const matches: MatchDTO[] = await listMatches();

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
	const matchMapEntries = Array.from(matchMapByMonth.entries());
	return (
		<div className="max-w-7xl mx-auto py-12">
			<h1 className="text-4xl font-bold text-center md:text-left">Partidas</h1>
			{matches.length === 0 && (
				<p className="text-center md:text-left mt-4 text-muted-foreground">
					Nenhuma partida encontrada.
				</p>
			)}
			<div className="flex flex-col gap-12">
				{matchMapEntries.map(([month, matchList]) => (
					<div className="flex flex-col mt-8 md:gap-4 gap-8" key={month}>
						<p className="capitalize text-2xl border-b pb-2 mb-2 mx-4 md:px-0 px-5">
							{month}
						</p>
						{matchList.map((match) => (
							<div key={match.id}>
								<MatchPreview match={match} />
							</div>
						))}
					</div>
				))}
			</div>
		</div>
	);
}
