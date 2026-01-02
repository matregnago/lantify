import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DuelsTable } from "@/components/match/DuelsTable";
import { FlashesTable } from "@/components/match/FlashesTable";
import { MatchHeader } from "@/components/match/MatchHeader";
import { TeamHeader } from "@/components/match/TeamHeader";
import { TeamTable } from "@/components/match/TeamTable";
import { UtilityTable } from "@/components/match/UtilityTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMatchData } from "@/lib/api/match";

export const dynamic = "force-static";

export default async function MatchPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const match = await getMatchData(id);

	if (!match) {
		notFound();
	}

	const teamA = match.teams[0];
	const teamB = match.teams[1];

	if (!teamA || !teamB || !teamA.players || !teamB.players) return <></>;

	return (
		<div className="py-12 mx-4">
			<div className="max-w-7xl mx-auto flex flex-col gap-8">
				<Link
					href="/"
					className="flex flex-row gap-2 items-center text-muted-foreground hover:text-primary cursor-pointer"
				>
					<ChevronLeft size={16} />
					<p className="text-sm">Voltar às partidas</p>
				</Link>
				<MatchHeader match={match} />
				<Tabs defaultValue="summary">
					<TabsList>
						<TabsTrigger value="summary">Geral</TabsTrigger>
						<TabsTrigger value="utility">Utilitarios</TabsTrigger>
						<TabsTrigger value="flashes">Flashes</TabsTrigger>
						<TabsTrigger value="duels">Duelos</TabsTrigger>
					</TabsList>
					<TabsContent value="summary">
						<TeamHeader team={teamA} />
						<TeamTable team={teamA} />
						<TeamHeader team={teamB} />
						<TeamTable team={teamB} />
					</TabsContent>
					<TabsContent value="utility">
						<TeamHeader team={teamA} />
						<UtilityTable team={teamA} />
						<TeamHeader team={teamB} />
						<UtilityTable team={teamB} />
					</TabsContent>
					<TabsContent value="flashes">
						<TeamHeader team={teamA} />
						<FlashesTable team={teamA} />
						<TeamHeader team={teamB} />
						<FlashesTable team={teamB} />
					</TabsContent>
					<TabsContent value="duels">
						<DuelsTable duels={match.duels} teamA={teamA} teamB={teamB} />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
