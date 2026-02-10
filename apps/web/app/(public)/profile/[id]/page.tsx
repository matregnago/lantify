"use server";

import { notFound } from "next/navigation";
import { PlayerProfile } from "@/components/player-profile/PlayerProfile";
import {
	getPlayerAmount,
	getPlayerProfileData,
	getPlayersRankingData,
} from "@/lib/api/player";

export default async function ProfilePage({
	params,
	searchParams,
}: {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ date?: string }>;
}) {
	const { id } = await params;
	const { date } = await searchParams;
	const profileData = await getPlayerProfileData(id, date);
	const playerAmount = await getPlayerAmount(date ?? "all");
	const playersRanking = await getPlayersRankingData(date);

	if (!profileData) {
		notFound();
	}

	return (
		<div className="py-12 mx-4">
			<PlayerProfile
				profile={profileData}
				playersRanking={playersRanking}
				playerAmount={playerAmount}
				date={date}
			/>
		</div>
	);
}
