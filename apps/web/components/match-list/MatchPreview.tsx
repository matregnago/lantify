"use client";
import { MatchDTO } from "@repo/contracts";
import { Card } from "../ui/card";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MapIcons } from "@/lib/map-icons";
import { MapName } from "@/lib/map-name";
import { Calendar } from "lucide-react";
import { formatDate } from "@/lib/format-date";

export const MatchPreview = ({ match }: { match: MatchDTO }) => {
  const router = useRouter();
  const teamA = match.teams[0];
  const teamB = match.teams[1];

  if (!teamA || !teamB) return <></>;

  return (
    <Card
      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      onClick={() => router.push(`/match/${match.id}`)}
    >
      <div className="flex justify-between items-center mx-12">
        <div className="w-40 flex flex-row items-center gap-2">
          <Calendar size={16} />
          <p>{formatDate(match.date)}</p>
        </div>

        <div className="flex flex-row items-center gap-12">
          <p className="w-40 text-right">{teamA.name}</p>
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
          <p className="w-40 text-left">{teamB.name}</p>
        </div>

        <div className="flex flex-row gap-4 items-center w-40">
          <Image
            src={MapIcons[match.map] || "/default.jpeg"}
            alt={match.map}
            width={40}
            height={40}
          />
          <p>{MapName[match.map] || match.map}</p>
        </div>
      </div>
    </Card>
  );
};
