import type { MatchDTO } from "@repo/contracts";
import { DuelsCompleteTable } from "@/components/duels/DuelsCompleteTable";
import { listMatchesWithPlayers } from "@/lib/api/match";

export const dynamic = "force-dynamic";

export default async function DuelsPage() {
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

	return (
		<div className="py-12 mx-4">
			<div className="max-w-7xl mx-auto flex flex-col gap-8">
				<h1 className="text-4xl font-bold text-center md:text-left">Duelos</h1>

				<DuelsCompleteTable matchMapByMonth={matchMapByMonth} />
			</div>
		</div>
	);
}
