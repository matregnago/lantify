import type { ClutchDTO, TeamDTO } from "@repo/contracts";
import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/card";
import { ClutchCard } from "./ClutchCard";

interface TeamClutchCardProps {
	clutches: ClutchDTO[];
	team: TeamDTO;
}

export const TeamClutchCard = ({ clutches, team }: TeamClutchCardProps) => {
	const players = team.players;
	if (!players) {
		return;
	}

	const clutchesMap = new Map<string, ClutchDTO[]>();
	clutches.forEach((clutch) => {
		const currentClutches = clutchesMap.get(clutch.clutcherSteamId);
		if (!currentClutches) clutchesMap.set(clutch.clutcherSteamId, [clutch]);
		else clutchesMap.set(clutch.clutcherSteamId, [...currentClutches, clutch]);
	});

	return (
		<Card>
			<CardHeader className="flex flex-w">
				{players.map((player) => {
					const playerClutches = clutchesMap.get(player.steamId);
					return (
						<div key={player.id} className="flex-1 last:[&>div>a]:border-r-0">
							<div className="flex flex-col">
								<Link
									className="flex flex-col gap-1 items-center cursor-pointer p-2 border-r border-b"
									href={`/profile/${player.steamId}`}
								>
									<Image
										src={player.avatarUrl || "/default-avatar.png"}
										width={60}
										height={60}
										alt={`${player.name} avatar`}
										className="rounded-full border border-gray-800 shrink-0"
									/>
									<p className="font-semibold">{player.name}</p>
								</Link>
								{playerClutches?.map((clutch) => (
									<div key={clutch.id} className="flex justify-center py-4">
										<ClutchCard clutch={clutch} />
									</div>
								))}
							</div>
						</div>
					);
				})}
			</CardHeader>
		</Card>
	);
};
