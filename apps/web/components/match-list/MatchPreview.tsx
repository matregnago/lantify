"use client";
import type { MatchDTO } from "@repo/contracts";
import { Calendar } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/format-date";
import { MapIcons } from "@/lib/map-icons";
import { MapName } from "@/lib/map-name";
import { Card } from "../ui/card";

export const MatchPreview = ({ match }: { match: MatchDTO }) => {
	const router = useRouter();
	const teamA = match.teams[0];
	const teamB = match.teams[1];

	if (!teamA || !teamB) return <></>;

	return (
		<div>
			<Card
				className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition hidden md:block mx-4"
				onClick={() => router.push(`/match/${match.id}`)}
			>
				<div className="flex justify-between items-center mx-12">
					<div className="w-40 flex flex-row items-center gap-2 text-muted-foreground text-sm">
						<Calendar size={16} />
						<p>{formatDate(match.date)}</p>
					</div>

					<div className="flex flex-row items-center gap-12">
						<p className="w-40 text-right truncate">{teamA.name}</p>
						<div className="flex flex-row gap-4 text-3xl items-center min-w-20 justify-center">
							<p
								className={`${teamA.isWinner ? "text-green-500" : " text-red-700"}`}
							>
								{teamA.score}
							</p>
							<p>:</p>
							<p
								className={`${teamB.isWinner ? "text-green-500" : " text-red-700"}`}
							>
								{teamB.score}
							</p>
						</div>
						<p className="w-40 text-left truncate">{teamB.name}</p>
					</div>

					<div className="flex flex-row gap-4 items-center w-40">
						<Image
							src={MapIcons[match.map] || "/default.jpeg"}
							alt={match.map}
							width={40}
							height={40}
						/>
						<p className="text-muted-foreground">
							{MapName[match.map] || match.map}
						</p>
					</div>
				</div>
			</Card>
			<Card
				className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition md:hidden mx-4"
				onClick={() => router.push(`/match/${match.id}`)}
			>
				<div className="flex flex-col gap-4 justify-between items-center py-2">
					<div className="flex flex-row items-center gap-4 truncate">
						<p className="flex-1 w-36 truncate text-right">{teamA.name}</p>
						<div className="flex flex-row gap-1 text-2xl items-center justify-center">
							<p
								className={`${teamA.isWinner ? "text-green-500" : " text-red-700"}`}
							>
								{teamA.score}
							</p>
							<p>:</p>
							<p
								className={`${teamB.isWinner ? "text-green-500" : " text-red-700"}`}
							>
								{teamB.score}
							</p>
						</div>
						<p className="flex-1 truncate text-left w-36">{teamB.name}</p>
					</div>

					<div className="flex flex-row gap-12 text-muted-foreground text-sm">
						<div className="flex flex-row items-center gap-2">
							<Calendar size={16} />
							<p>{formatDate(match.date)}</p>
						</div>
						<div className="flex flex-row gap-4 items-center">
							<Image
								src={MapIcons[match.map] || "/default.jpeg"}
								alt={match.map}
								width={40}
								height={40}
							/>
							<p>{MapName[match.map] || match.map}</p>
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
};
