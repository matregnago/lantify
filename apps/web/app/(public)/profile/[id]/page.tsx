"use server";

import { notFound } from "next/navigation";
import { PlayerProfile } from "@/components/player-profile/PlayerProfile";
import { getPlayerProfileData, getPlayersRankingData } from "@/lib/api/player";

export default async function ProfilePage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const profileData = await getPlayerProfileData(id);
	const playersRanking = await getPlayersRankingData();

	if (!profileData) {
		notFound();
	}

	return (
		<div className="py-12 mx-4">
			<PlayerProfile profile={profileData} playersRanking={playersRanking} />
		</div>
	);
}
