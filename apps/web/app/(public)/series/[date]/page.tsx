import { notFound } from "next/navigation";
import { PlayersRankingTable } from "@/components/ranking/PlayersRankingTable";
import { getPlayerAmount, getPlayersRankingData } from "@/lib/api/player";
import { sortRankingByStat } from "@/lib/ranking";

export const dynamic = "force-dynamic";

export default async function SeriesRankingPage({
	params,
}: {
	params: Promise<{ date: string }>;
}) {
	const { date: rawDate } = await params;
	const date = decodeURIComponent(rawDate);

	let rankingData = await getPlayersRankingData(date);
	console.log("series date param:", date);
	console.log("rankingdatasize", rankingData.length);

	if (!rankingData) {
		notFound();
	}

	rankingData = sortRankingByStat(rankingData, "rating2");
	const playerAmount = await getPlayerAmount(date);
	console.log(playerAmount);

	return (
		<div className="max-w-7xl mx-auto my-12">
			<h1 className="text-4xl font-bold text-center md:text-left">Ranking</h1>

			<div className="flex flex-col w-full mt-8">
				<PlayersRankingTable
					players={rankingData}
					playerAmount={playerAmount}
					date={date}
				/>
			</div>
		</div>
	);
}
