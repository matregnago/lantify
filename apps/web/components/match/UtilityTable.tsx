"use client";
import type { TeamDTO } from "@repo/contracts";
import Image from "next/image";
import Link from "next/link";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";

export const UtilityTable = ({ team }: { team: TeamDTO }) => {
	if (!team.players) return;
	const players = team.players;
	return (
		<Table className="bg-card rounded-sm">
			<TableHeader>
				<TableRow>
					<TableHead className="w-64">Player</TableHead>
					<TableHead>Smokes</TableHead>
					<TableHead>Molotovs</TableHead>
					<TableHead>HEs</TableHead>
					<TableHead>Dano HE</TableHead>
					<TableHead className="w-48">Dano em amigos com HE</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{players.map((player) => (
					<TableRow key={player.id}>
						<TableCell>
							<Link
								className="flex flex-row gap-3 items-center cursor-pointer w-fit"
								href={`/profile/${player.steamId}`}
							>
								<Image
									src={player.avatarUrl || "/default-avatar.png"}
									width={32}
									height={32}
									alt={`${player.name} avatar`}
									className="rounded-full border border-gray-800 shrink-0"
								/>
								<p className="font-semibold">{player.name}</p>
							</Link>
						</TableCell>
						<TableCell>{player.totalSmokes}</TableCell>
						<TableCell>{player.totalMolotovs}</TableCell>
						<TableCell>{player.totalHes}</TableCell>
						<TableCell>{player.heDamage.toFixed(1)}</TableCell>
						<TableCell>{player.heTeamDamage.toFixed(1)}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};
