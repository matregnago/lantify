import { TeamTable } from "@/components/match/TeamTable";
import { MatchDTO } from "@repo/contracts";

export default async function MatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const matchReq = await fetch(`http://localhost:3333/matches/${id}`);
  const match: MatchDTO = await matchReq.json();

  const teamA = match.teams[0];
  const teamB = match.teams[1];

  if (!teamA || !teamB || !teamA.players || !teamB.players) return <></>;

  return (
    <div>
      <div>
        <TeamTable team={teamA} />
      </div>
      <div>
        <TeamTable team={teamB} />
      </div>
    </div>
  );
}
