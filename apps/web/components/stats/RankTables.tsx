"use client";

import { type MatchDTO, type PlayerDTO, PlayerStatsDTO } from "@repo/contracts";
import { useRouter } from "next/dist/client/components/navigation";
import { useEffect, useState } from "react";
import {
	getAggregatedPlayerStats,
	getPlayersRankingData,
} from "@/lib/api/player";
import { type Stat, sortRankingByStat } from "@/lib/ranking";
import { SelectLan } from "../duels/SelectLan";

interface RankTablesProps {
	matchMapByMonth: Map<string, MatchDTO[]>;
}

export const RankTables = ({ matchMapByMonth }: RankTablesProps) => {
	const router = useRouter();
	const [selectedMatchMonth, setSelectedMatchMonth] = useState<string>("all");
	const [playersInMonth, setPlayersInMonth] = useState<PlayerDTO[]>([]);
	const [selectedStat, setSelectedStat] = useState<Stat>("rating2");

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
		<SelectLan
			matchMapByMonth={matchMapByMonth}
			selectedMatchMonth={selectedMatchMonth}
			setSelectedMatchMonth={setSelectedMatchMonth}
			setPlayersInMonth={setPlayersInMonth}
		/>
	);
};
