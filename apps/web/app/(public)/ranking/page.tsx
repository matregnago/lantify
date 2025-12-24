"use server";
import { PlayersRankingTable } from "@/components/ranking/PlayersRankingTable";
import { getPlayersRanking } from "@/lib/api/player";
import { notFound } from "next/navigation";

export default async function MainRankingPage() {
  const ranking = await getPlayersRanking();

  if (!ranking) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto my-12">
      <h1 className="text-4xl font-bold text-center md:text-left">Ranking</h1>

      <div className="flex flex-col w-full mt-8">
        <PlayersRankingTable players={ranking} />
      </div>
    </div>
  );
}
