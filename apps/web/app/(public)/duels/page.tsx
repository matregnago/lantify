"use server";
import {  listMatchesWithPlayers } from "@/lib/api/match";
import { DuelsDropdown } from "@/components/duels/DuelsDropdown";
import { MatchDTO } from "@repo/contracts";

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
		<div className="p-4">
			<h1 className="text-2xl font-semibold mb-4">Duelos</h1>
			<DuelsDropdown matchMapByMonth={matchMapByMonth}  />
		</div>
	);
}