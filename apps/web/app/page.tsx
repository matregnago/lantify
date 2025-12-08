"use server";
import { MatchPreview } from "@/components/match-list/MatchPreview";
import { MatchDTO } from "@repo/contracts";

export default async function Home() {
  const matchesReq = await fetch("http://localhost:3333/matches");
  const matches: MatchDTO[] = await matchesReq.json();

  return (
    <div className="max-w-7xl mx-auto py-12">
      <h1 className="text-4xl font-bold">Partidas</h1>
      <div className="flex flex-col mt-8 gap-4">
        {matches.map((match) => (
          <div key={match.id} className="">
            <MatchPreview match={match} />
          </div>
        ))}
      </div>
    </div>
  );
}
