"use client";

import type { MatchDTO, PlayerDTO, PlayerStatsDTO } from "@repo/contracts";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getPlayersRankingData } from "@/lib/api/player";
import { type Stat, sortRankingByStat } from "@/lib/ranking";
import { SelectLan } from "../duels/SelectLan";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { RatingGraph } from "./graphs/ratingGraph";

interface DynamicGraphProps {
	matchMapByMonth: Map<string, MatchDTO[]>;
}

export const DynamicGraph = ({ matchMapByMonth }: DynamicGraphProps) => {
	const router = useRouter();
	const [selectedMatchMonth, setSelectedMatchMonth] = useState<string>("all");
	const [playersInMonth, setPlayersInMonth] = useState<PlayerDTO[]>([]);
	const [selectedStat, setSelectedStat] = useState<Stat>("rating2");

	const statsMap = new Map<string, PlayerStatsDTO>();

	useEffect(() => {
		const getRanking = async () => {
			const stats = await getPlayersRankingData(
				selectedStat,
				selectedMatchMonth,
			);
		};
		getRanking();
	}, [selectedMatchMonth, selectedStat]);

	return (
		<div>
			<SelectLan
				matchMapByMonth={matchMapByMonth}
				selectedMatchMonth={selectedMatchMonth}
				setSelectedMatchMonth={setSelectedMatchMonth}
				setPlayersInMonth={setPlayersInMonth}
			/>
			<Tabs defaultValue="rating2">
				<TabsList>
					<TabsTrigger value="rating2">Rating</TabsTrigger>
				</TabsList>
				<TabsContent value="rating2">
					<RatingGraph></RatingGraph>
				</TabsContent>
			</Tabs>
		</div>
	);
};
