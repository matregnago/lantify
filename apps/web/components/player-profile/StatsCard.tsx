import { Card } from "../ui/card";

export const StatsCard = ({ children }: { children: React.ReactNode }) => {
	return <Card className="px-6 py-8 md:px-8 md:py-10">{children}</Card>;
};
