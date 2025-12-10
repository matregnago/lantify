"use client";
import { PlayerMatchHistoryDTO } from "@repo/contracts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import Image from "next/image";
import { MapIcons } from "@/lib/map-icons";
import { MapName } from "@/lib/map-name";
import { formatDate } from "@/lib/format-date";
import { useRouter } from "next/navigation";

interface MatchHistoryTableProps {
  playerMatchHistory: PlayerMatchHistoryDTO[];
}

export const MatchHistoryTable = ({
  playerMatchHistory,
}: MatchHistoryTableProps) => {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data</TableHead>
          <TableHead>Mapa</TableHead>
          <TableHead>Placar</TableHead>
          <TableHead>Rating 2.0</TableHead>
          <TableHead>Kills</TableHead>
          <TableHead>Mortes</TableHead>
          <TableHead>K/D</TableHead>
          <TableHead>KAST</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {playerMatchHistory.map((matchHistory) => {
          const playerTeam = matchHistory.teams.find(
            (team) => team.id === matchHistory.player.teamId
          );
          const enemyTeam = matchHistory.teams.find(
            (team) => team.id !== matchHistory.player.teamId
          );
          if (!playerTeam || !enemyTeam) {
            return <></>;
          }

          return (
            <TableRow
              key={matchHistory.match.id}
              className="cursor-pointer"
              onClick={() => router.push(`/match/${matchHistory.match.id}`)}
            >
              <TableCell className="font-medium">
                {formatDate(matchHistory.match.date)}
              </TableCell>
              <TableCell className="flex flex-row gap-3 items-center font-medium">
                <Image
                  src={MapIcons[matchHistory.match.map] || ""}
                  alt={matchHistory.match.map}
                  width={32}
                  height={32}
                />
                {MapName[matchHistory.match.map] || matchHistory.match.map}
              </TableCell>
              <TableCell
                className={`${playerTeam.isWinner ? "text-green-500" : "text-red-500"} font-medium`}
              >
                {playerTeam.score} : {enemyTeam.score}
              </TableCell>
              <TableCell className="font-medium">
                {matchHistory.player.hltvRating2.toFixed(2)}
              </TableCell>
              <TableCell className="font-medium">
                {matchHistory.player.killCount}
              </TableCell>
              <TableCell className="font-medium">
                {matchHistory.player.deathCount}
              </TableCell>
              <TableCell className="font-medium">
                {matchHistory.player.killDeathRatio.toFixed(2)}
              </TableCell>
              <TableCell className="font-medium">
                {matchHistory.player.kast.toFixed(1) + "%"}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
