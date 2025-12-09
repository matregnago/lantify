"use server";
import { MatchHeader } from "@/components/match/MatchHeader";
import { TeamHeader } from "@/components/match/TeamHeader";
import { TeamTable } from "@/components/match/TeamTable";
import { getMatchData } from "@/lib/api/match";
import { MatchDTO } from "@repo/contracts";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function MatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const match = await getMatchData(id);

  if(!match) {
        notFound();
    
  }

  const teamA = match.teams[0];
  const teamB = match.teams[1];

  if (!teamA || !teamB || !teamA.players || !teamB.players) return <></>;

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        <Link
          href="/"
          className="flex flex-row gap-2 items-center text-muted-foreground hover:text-primary cursor-pointer"
        >
          <ChevronLeft size={16} />
          <p className="text-sm">Voltar às partidas</p>
        </Link>
        <MatchHeader match={match} />
        <div className="">
          <TeamHeader team={teamA} />
          <TeamTable team={teamA} />
        </div>
        <div>
          <TeamHeader team={teamB} />
          <TeamTable team={teamB} />
        </div>
      </div>
    </div>
  );
}
