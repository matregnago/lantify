import { listMatchesWithPlayers } from "@/lib/api/match";
import { MatchDTO } from "@repo/contracts";

export default async function StatsPage() {
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
    <div className="max-w-7xl mx-auto my-12">
      <h1 className="text-4xl font-bold text-center md:text-left">
        Estatísticas
      </h1>
      <p className="text-1xl text-center md:text-left">
        {" "}
        Fornecidas por gugab enterprise company LTDA & cia{" "}
      </p>
    </div>
  );
}
