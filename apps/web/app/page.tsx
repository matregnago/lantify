import { MatchDTO } from "@repo/contracts";

export default async function Home() {
  const matchesReq = await fetch("http://localhost:3333/matches");

  const matches: MatchDTO[] = await matchesReq.json();

  return (
    <div>
      {matches.map((match) => (
        <div key={match.id} className="p-4 border-b">
          <div className="text-lg font-semibold mb-2">Mapa: {match.map}</div>
        </div>
      ))}
    </div>
  );
}
