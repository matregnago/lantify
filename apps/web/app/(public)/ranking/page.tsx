"use server";
import { PlayersRankingTable } from "@/components/ranking/PlayersRankingTable";
import { getPlayersRankingData } from "@/lib/api/player";
import { notFound } from "next/navigation";

export default async function MainRankingPage() {
  const rankingData = await getPlayersRankingData();

  if (!rankingData) {
    notFound();
  }
  const sortedRanking = rankingData.sort(
    (a, b) => b.stats.rating2 - a.stats.rating2,
  );

  return (
    <div className="max-w-7xl mx-auto my-12">
      <h1 className="text-4xl font-bold text-center md:text-left">Ranking</h1>

      <div className="flex flex-col w-full mt-8">
        <PlayersRankingTable players={sortedRanking} />
      </div>
    </div>
  );
}
