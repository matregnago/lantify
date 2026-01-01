import type { TeamDTO } from "@repo/contracts";
import { TeamBadge } from "./TeamBadge";

export const TeamHeader = ({ team }: { team: TeamDTO }) => {
	return (
		<div className="flex flex-row gap-4 items-center py-4">
			<p
				className={`${team.isWinner ? "text-green-500" : " text-red-700"} text-xl`}
			>
				{team.score}
			</p>
			<p className="text-xl font-semibold">{team.name}</p>
			<TeamBadge isWinner={team.isWinner} />
		</div>
	);
};
