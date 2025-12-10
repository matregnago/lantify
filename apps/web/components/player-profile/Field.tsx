import { StatsCard } from "./StatsCard";

export const Field = ({
  children,
  title,
  useStatsCard = true,
}: {
  children: React.ReactNode;
  title: string;
  useStatsCard?: boolean;
}) => {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">{title}</h1>
      {useStatsCard ? <StatsCard>{children}</StatsCard> : children}
    </div>
  );
};
