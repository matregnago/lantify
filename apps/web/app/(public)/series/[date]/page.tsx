import Link from "next/link";
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

	if (!rankingData) {
		notFound();
	}

	rankingData = sortRankingByStat(rankingData, "rating2");
	const playerAmount = await getPlayerAmount(date);
	const totalMatches = Math.max(
		...rankingData.map((p) => p.stats.totalMatches ?? 0),
	);

	return (
		<div className="max-w-7xl mx-auto my-12">
			<div className="border-t-4 border-accent rounded-lg px-6 py-5 mb-8 bg-card/50 w-full">
				<div className="flex flex-col md:flex-row md:items-center gap-4 w-full">
					<div className="flex flex-col gap-2 shrink-0">
						<div className="flex items-center gap-3 justify-center md:justify-start">
							<h1 className="text-4xl font-bold">Ranking da Lan</h1>
							<span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-2xl font-semibold">
								{date}
							</span>
						</div>
						<p className="text-sm text-muted-foreground text-center md:text-left">
							{playerAmount} jogadores · {totalMatches}{" "}
							{totalMatches === 1 ? "partida" : "partidas"}
						</p>
					</div>
					<div className="hidden md:block flex-1" />
					<Link
						href="/ranking"
						className="text-sm text-muted-foreground hover:text-foreground transition-colors text-center md:text-right shrink-0"
					>
						Ver ranking geral →
					</Link>
				</div>
			</div>

			<div className="flex flex-col w-full">
				<PlayersRankingTable
					players={rankingData}
					playerAmount={playerAmount}
					date={date}
				/>
			</div>
		</div>
	);
}
