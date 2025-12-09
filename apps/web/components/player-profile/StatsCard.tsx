import { Card } from "../ui/card";

export const StatsCard = ({ children }: { children: React.ReactNode }) => {
  return <Card className="px-8 py-10">{children}</Card>;
};
