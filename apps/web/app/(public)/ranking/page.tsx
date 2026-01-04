import { notFound } from "next/navigation";
import { PlayersRankingTable } from "@/components/ranking/PlayersRankingTable";
import { getPlayersRankingData } from "@/lib/api/player";

export const dynamic = "force-dynamic";

export default async function MainRankingPage() {
	const rankingData = await getPlayersRankingData("rating2");

	if (!rankingData) {
		notFound();
	}

	return (
		<div className="max-w-7xl mx-auto my-12">
			<h1 className="text-4xl font-bold text-center md:text-left">Ranking</h1>

			<div className="flex flex-col w-full mt-8">
				<PlayersRankingTable players={rankingData} />
			</div>
		</div>
	);
}
