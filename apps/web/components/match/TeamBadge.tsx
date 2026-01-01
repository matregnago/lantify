import { Badge } from "../ui/badge";

export const TeamBadge = ({ isWinner }: { isWinner: boolean }) => {
	if (isWinner) {
		return (
			<Badge className="bg-green-700 text-accent-foreground text-sm">
				Vitória
			</Badge>
		);
	} else {
		return (
			<Badge className="bg-red-700 text-accent-foreground text-sm">
				Derrota
			</Badge>
		);
	}
};
