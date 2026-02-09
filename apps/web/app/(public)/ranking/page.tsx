import { notFound } from "next/navigation";
import { PlayersRankingTable } from "@/components/ranking/PlayersRankingTable";
import { getPlayerAmount, getPlayersRankingData } from "@/lib/api/player";
import { sortRankingByStat } from "@/lib/ranking";

export const dynamic = "force-dynamic";

export default async function MainRankingPage() {
	let rankingData = await getPlayersRankingData();

	if (!rankingData) {
		notFound();
	}

	rankingData = sortRankingByStat(rankingData, "rating2");
	const playerAmount = await getPlayerAmount();

	return (
		<div className="max-w-7xl mx-auto my-12">
			<h1 className="text-4xl font-bold text-center md:text-left">Ranking</h1>

			<div className="flex flex-col w-full mt-8">
				<PlayersRankingTable
					players={rankingData}
					playerAmount={playerAmount}
				/>
			</div>
		</div>
	);
}
