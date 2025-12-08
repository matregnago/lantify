import { MapName } from "@/lib/map-name";
import { MapIcons } from "@/lib/map-icons";
import { MapImages } from "@/lib/map-images";
import { MatchDTO } from "@repo/contracts";
import Image from "next/image";
import { formatDate } from "@/lib/format-date";
import { Calendar } from "lucide-react";

const HeaderCard = ({ children }: { children: React.ReactNode }) => {
  return <div className="bg-card p-4 rounded-lg">{children}</div>;
};

export const MatchHeader = ({ match }: { match: MatchDTO }) => {
  const teamA = match.teams[0];
  const teamB = match.teams[1];

  if (!teamA || !teamB || !teamA.players || !teamB.players) return <></>;

  return (
    <div className="relative overflow-hidden rounded-lg h-72">
      <Image
        src={MapImages[match.map] || "/default-map.jpg"}
        alt={match.map}
        fill
        className="object-cover blur-xs absolute inset-0"
      />
      <div className="relative flex flex-col gap-4 items-center justify-center h-full">
        <HeaderCard>
          <div className="flex flex-row items-center gap-12 w-2xl justify-center">
            <p className="w-40 text-right text-white font-semibold text-lg">
              {teamA.name}
            </p>
            <div className="flex flex-row gap-4 text-4xl items-center min-w-32 justify-center font-bold">
              <p
                className={`${teamA.isWinner ? "text-green-400" : "text-red-400"}`}
              >
                {teamA.score}
              </p>
              <p className="text-white">:</p>
              <p
                className={`${teamB.isWinner ? "text-green-400" : "text-red-400"}`}
              >
                {teamB.score}
              </p>
            </div>
            <p className="w-40 text-left text-white font-semibold text-lg">
              {teamB.name}
            </p>
          </div>
        </HeaderCard>
        <div className="flex flex-row gap-4">
          <HeaderCard>
            <div className="flex flex-row gap-3 items-center justify-center">
              <Image
                src={MapIcons[match.map] || "/default-logo.jpeg"}
                alt={match.map}
                width={36}
                height={36}
              />
              <p className="text-lg font-medium">{MapName[match.map]}</p>
            </div>
          </HeaderCard>
          <HeaderCard>
            <div className="flex flex-row items-center justify-center h-full gap-3">
              <Calendar size={24} className="text-accent-foreground" />
              <p className="font-medium">{formatDate(match.date)}</p>
            </div>
          </HeaderCard>
        </div>
      </div>
    </div>
  );
};
